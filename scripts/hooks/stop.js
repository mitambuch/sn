#!/usr/bin/env node

/* Stop hook — checks session hygiene + dispatch discipline + friction
   patterns before halting.

   Duties :
   1. Session journal written today? (nudge if not)
   2. Session-wrap audit reminder (feedback/patterns/frictions counts)
   3. Dispatch enforcement — reads .claude/.dispatch-state.json written
      by the prompt-submit hook. If the last prompt was classified R0 or
      R1 and 3+ files were modified in the working tree without a
      recorded Agent dispatch call, emit a violation warning.
   4. Friction pattern scan — detects common in-session friction
      signatures (retry loops, --no-verify attempts, ff-only
      workarounds) via git reflog and writes auto-frictions to
      .claude/memory/frictions/ for upstream reporting.

   Non-blocking (emits systemMessage, not decision:"block"). */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.cwd();
const sessionsDir = join(root, '.claude', 'memory', 'sessions');
const feedbackDir = join(root, '.claude', 'memory', 'feedback');
const patternsDir = join(root, '.claude', 'memory', 'patterns');
const frictionsDir = join(root, '.claude', 'memory', 'frictions');
const stateFile = join(root, '.claude', '.dispatch-state.json');
const today = new Date().toISOString().slice(0, 10);

function realEntries(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.startsWith('.'))
    .map(f => ({ name: f, path: join(dir, f) }));
}

function gitTry(cmd) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function filesChangedSinceLastCommit() {
  const stat = gitTry('git diff --name-only HEAD');
  const staged = gitTry('git diff --cached --name-only');
  const untracked = gitTry('git ls-files --others --exclude-standard');
  return new Set(
    [...stat.split('\n'), ...staged.split('\n'), ...untracked.split('\n')]
      .filter(f => f.trim()),
  );
}

function readDispatchState() {
  if (!existsSync(stateFile)) return null;
  try {
    return JSON.parse(readFileSync(stateFile, 'utf-8'));
  } catch {
    return null;
  }
}

function detectDispatchViolation(state) {
  if (!state) return null;
  if (state.class !== 'R0' && state.class !== 'R1') return null;
  const changed = filesChangedSinceLastCommit();
  // If zero file changes, maybe the task didn't need code — don't flag.
  if (changed.size < 3) return null;

  // Heuristic: if state is older than 30 min, assume turn has moved on.
  const age = Date.now() - new Date(state.timestamp || 0).getTime();
  if (age > 30 * 60 * 1000) return null;

  return {
    expected: state.class,
    files: changed.size,
    reason: state.reason,
  };
}

function detectFrictionSignatures() {
  const frictions = [];
  // Recent reflog events that indicate friction
  const reflog = gitTry('git reflog --date=iso -20');
  if (/--ff-only.*feat\/|--ff-only.*fix\//.test(reflog)) {
    frictions.push({
      slug: 'ff-only-workaround',
      summary: 'ff-only merge used instead of --no-ff (audit trail lost)',
    });
  }
  if (/amend/.test(reflog) && /HEAD@\{[0-9]\}/.test(reflog)) {
    // amend in last 20 reflog entries — might be normal
  }
  return frictions;
}

function writeFrictionIfNew(slug, summary) {
  const dir = frictionsDir;
  if (!existsSync(dir)) return;
  const file = join(dir, `${today}-${slug}.md`);
  if (existsSync(file)) return;
  const body = `---
id: friction-${today}-${slug}
date: ${today}
type: friction
tags: [#workflow, #friction, #template, #auto-detected, #active]
scope: template
status: active
---

# Auto-detected friction — ${summary}

Detected by \`scripts/hooks/stop.js\` at session end on ${new Date().toISOString()}.

## Signature

${summary}

## What to do

- Owner reviews this entry next session.
- If real : patch upstream via \`pnpm upstream:friction-report\`.
- If false positive : deprecate this entry (status: deprecated).

## Cross-refs

- Detection logic : \`scripts/hooks/stop.js\` §detectFrictionSignatures
`;
  try {
    writeFileSync(file, body, 'utf-8');
  } catch {
    // non-fatal
  }
}

function main() {
  const messages = [];

  let hasTodayJournal = false;
  if (existsSync(sessionsDir)) {
    const files = readdirSync(sessionsDir).filter(f => f.endsWith('.md'));
    hasTodayJournal = files.some(f => f.startsWith(today));
  }

  const feedbackCount = realEntries(feedbackDir).length;
  const patternsCount = realEntries(patternsDir).length;
  const frictionsCount = realEntries(frictionsDir).length;

  if (!hasTodayJournal) {
    messages.push(
      '⚠ No session journal yet for today. Before stopping: write ' +
        '`.claude/memory/sessions/' + today + '-HHMM.md`, run ' +
        '`pnpm memory:index`, and output the RELEASE CHECK block. ' +
        'Skip if this was a trivial single-action session.',
    );
  }

  if (feedbackCount + patternsCount <= 1) {
    messages.push(
      '📝 Session-wrap audit (memory-protocol.md) : (1) Owner correction ' +
        'or non-obvious validation? → feedback/ entry. (2) Reusable pattern ' +
        'emerged? → patterns/ entry. (3) > 5 min lost on a workaround? ' +
        '→ frictions/ entry. Counts today: feedback=' + feedbackCount +
        ', patterns=' + patternsCount + ', frictions=' + frictionsCount + '.',
    );
  }

  // Dispatch enforcement
  const state = readDispatchState();
  const violation = detectDispatchViolation(state);
  if (violation) {
    messages.push(
      `🚨 DISPATCH VIOLATION : last prompt classified ${violation.expected} ` +
        `(${violation.reason}), but ${violation.files} files were modified in ` +
        `main-thread without a recorded dispatch. Next time, use ` +
        `Agent({ model: "${violation.expected === 'R0' ? 'haiku' : 'sonnet'}", ... }) ` +
        `per .claude/rules/critical.md §12.`,
    );
  }

  // Friction detection
  const frictions = detectFrictionSignatures();
  for (const f of frictions) {
    writeFrictionIfNew(f.slug, f.summary);
    messages.push(`🪤 Auto-friction logged: ${f.summary} → frictions/${today}-${f.slug}.md`);
  }

  if (messages.length === 0) {
    process.stdout.write(JSON.stringify({}));
    return;
  }

  process.stdout.write(JSON.stringify({ systemMessage: messages.join(' ') }));
}

main();
