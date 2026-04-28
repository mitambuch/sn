#!/usr/bin/env node

/* UserPromptSubmit hook — injects a real-time clock reading + re-injects
   the non-negotiables + classifies the user prompt for dispatch routing.

   Since v6.6.0, this hook also:
   - Reads the prompt from stdin (JSON with `prompt` key).
   - Classifies it R0/R1/R2 via scripts/classify-task.js.
   - Writes {class, prompt_hash, timestamp} to .claude/.dispatch-state.json
     so the Stop hook can later check if the dispatch actually happened.
   - Appends a [DISPATCH_CLASS: ...] line to additionalContext when the
     classification is confident (R0 or R1). R2 and SKIP don't inject
     (R2 = architecture stays main-thread, SKIP = conversational).

   Short and stable, must NOT bloat context. Cross-platform pure Node. */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { classify } from '../classify-task.js';

const WEEKDAYS_FR = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
];

function bucketFor(hour) {
  if (hour < 6) return 'late-night';
  if (hour < 12) return 'matin';
  if (hour < 18) return 'après-midi';
  return 'soir';
}

function clockLine() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const weekday = WEEKDAYS_FR[now.getDay()];
  const bucket = bucketFor(now.getHours());
  let tz;
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local';
  } catch {
    tz = 'local';
  }
  return `[clock: ${y}-${m}-${d} ${hh}:${mm} · ${weekday} · ${bucket} · ${tz}]`;
}

async function readStdinJson() {
  if (process.stdin.isTTY) return null;
  let data = '';
  try {
    for await (const chunk of process.stdin) data += chunk;
    return data.trim() ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function persistState(state) {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const root = resolve(__dirname, '../..');
    const dir = join(root, '.claude');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, '.dispatch-state.json'), JSON.stringify(state, null, 2), 'utf-8');
  } catch {
    // non-fatal
  }
}

function dispatchHint(classification, prompt) {
  if (!classification) return null;
  if (classification.class === 'R0') {
    return [
      '',
      `[DISPATCH_CLASS: R0 · ${classification.reason}]`,
      'OBLIGATION : cette tâche est mécanique/déterministe. Tu DOIS la dispatcher à `worker-haiku` via `Agent({ subagent_type: "general-purpose", model: "haiku", ...})`. Exécuter en main-thread = violation de .claude/rules/critical.md §12.',
    ].join('\n');
  }
  if (classification.class === 'R1') {
    return [
      '',
      `[DISPATCH_CLASS: R1 · ${classification.reason}]`,
      'OBLIGATION : cette tâche suit un pattern existant. Tu DOIS la dispatcher à `worker-sonnet` via `Agent({ subagent_type: "general-purpose", model: "sonnet", ...})`. Exécuter en main-thread = violation de .claude/rules/critical.md §12.',
    ].join('\n');
  }
  return null;
}

async function main() {
  const input = await readStdinJson();
  const promptText = input?.prompt || input?.prompt_text || '';

  let classification = null;
  if (promptText) {
    try {
      classification = classify(promptText);
    } catch {
      classification = null;
    }
    if (classification) {
      persistState({
        class: classification.class,
        confidence: classification.confidence,
        reason: classification.reason,
        prompt_hash: createHash('sha1').update(promptText).digest('hex').slice(0, 12),
        timestamp: new Date().toISOString(),
      });
    }
  }

  const reminders = [
    clockLine(),
    '',
    '# Non-negotiables (re-injected per turn)',
    '',
    '1. **Branch first**: never commit on main/master. Husky will block.',
    '2. **Memory check**: before non-trivial tasks, `grep -rl "#<domain>" .claude/memory/`.',
    '3. **End-of-session**: write `.claude/memory/sessions/YYYY-MM-DD-HHMM.md` + run `pnpm memory:index` + output RELEASE CHECK.',
    '4. **Karpathy**: think before coding · simplicity first · surgical changes · goal-driven execution.',
    '5. **User mobilization**: when help is needed, use the `🧑 ACTION HUMAINE REQUISE` block (QUOI/POURQUOI/COMMENT/LIVRABLE).',
    '6. **Commit body**: feat/fix require WHY/WHAT/IMPACT/TEST in body (commit-msg hook warns if missing).',
    '7. **Time awareness**: the [clock: ...] line at the top is the real wall-clock for this turn. Use it for timestamps, tone, and deadline reasoning. See `.claude/rules/time-awareness.md`.',
  ];

  const hint = dispatchHint(classification, promptText);
  if (hint) reminders.push(hint);

  const output = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: reminders.join('\n'),
    },
  };

  process.stdout.write(JSON.stringify(output));
}

main().catch(() => {
  // On any failure, fall back to the clock+reminders only — never break Claude's turn.
  const output = {
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: clockLine(),
    },
  };
  process.stdout.write(JSON.stringify(output));
});
