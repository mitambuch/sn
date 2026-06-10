#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   DISPATCH-REPORT — the number that pilots the economy.

   WHY: "prefer cheap models" is only a strategy if you can answer, with
   numbers, "does haiku actually cost me less PER SUCCESSFUL TASK?" A haiku
   reworked twice costs more than a sonnet direct — that is the €/successful-
   task trap (not €/token). dispatch-verify (P11) appends one JSONL line per
   attempt to .claude/ledger/dispatch.jsonl; this reads them. Pack P13.

   Read once a month, ~10 min, take at most one decision (tighten a
   classify-task keyword, move a task type between zones). Zero dependency;
   a corrupt ledger line is skipped + warned, never a crash on history.

   Usage: pnpm dispatch:report
   ═══════════════════════════════════════════════════════════════ */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { PATHS } from './utils/paths.js';

const ROOT = process.env.STEAKSOAP_TEST_ROOT || PATHS.root;
const ledgerPath = join(ROOT, '.claude/ledger/dispatch.jsonl');

// Intended model per risk class (dispatch.md): R0→haiku, R1→sonnet, R2→orchestrator.
const INTENDED = { R0: 'haiku', R1: 'sonnet', R2: 'orchestrator' };

function readLedger() {
  if (!existsSync(ledgerPath)) return { rows: [], corrupt: 0 };
  const rows = [];
  let corrupt = 0;
  for (const line of readFileSync(ledgerPath, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t) continue;
    try {
      rows.push(JSON.parse(t));
    } catch {
      corrupt++; // history must never crash the report
    }
  }
  return { rows, corrupt };
}

function pct(n, d) {
  return d === 0 ? '—' : `${Math.round((n / d) * 100)}%`;
}

export function buildReport(rows) {
  const models = new Map(); // model → { attempts, first, pass1, escalationsReceived }
  const classes = new Map(); // class → Set(ids) + finishedAtIntended Set(ids)
  const tasks = new Map(); // id → { class, verifiedModel }
  const cheats = [];

  for (const r of rows) {
    const m = r.model || '?';
    if (!models.has(m)) models.set(m, { attempts: 0, first: 0, pass1: 0, escal: 0 });
    const mm = models.get(m);
    mm.attempts++;
    if (r.attempt === 1) {
      mm.first++;
      if (r.verified) mm.pass1++;
    }
    if (r.escalated_to) {
      if (!models.has(r.escalated_to)) models.set(r.escalated_to, { attempts: 0, first: 0, pass1: 0, escal: 0 });
      models.get(r.escalated_to).escal++;
    }
    if (r.checks?.cheat_warn) cheats.push(r.id);

    const cls = r.class || '?';
    if (!classes.has(cls)) classes.set(cls, { ids: new Set(), finished: new Set() });
    classes.get(cls).ids.add(r.id);

    if (!tasks.has(r.id)) tasks.set(r.id, { class: cls });
    if (r.verified) tasks.get(r.id).verifiedModel = m;
  }

  // a task is "finished at the intended model" if its verified attempt used
  // the model the class targets (R0→haiku, …).
  for (const [id, t] of tasks) {
    if (t.verifiedModel && INTENDED[t.class] === t.verifiedModel) {
      classes.get(t.class).finished.add(id);
    }
  }

  return { models, classes, cheats, taskCount: tasks.size };
}

function render({ rows, corrupt }) {
  if (rows.length === 0) {
    console.log('\n  DISPATCH REPORT — ledger empty (no dispatch-verify runs yet).\n');
    return;
  }
  const { models, classes, cheats, taskCount } = buildReport(rows);

  console.log(`\n  DISPATCH REPORT — ${rows.length} attempt(s) over ${taskCount} task(s)\n`);

  console.log('  By model           attempts   pass 1st   rework   escalations recv');
  for (const [m, s] of [...models].sort((a, b) => b[1].attempts - a[1].attempts)) {
    const p1 = pct(s.pass1, s.first);
    const rework = s.first === 0 ? '—' : `${100 - Math.round((s.pass1 / s.first) * 100)}%`;
    console.log(
      `    ${m.padEnd(15)} ${String(s.attempts).padStart(6)}   ${String(p1).padStart(7)}   ${String(rework).padStart(6)}   ${String(s.escal || '—').padStart(8)}`,
    );
  }

  console.log('\n  By class   tasks   finished at intended model');
  for (const cls of ['R0', 'R1', 'R2']) {
    if (!classes.has(cls)) continue;
    const c = classes.get(cls);
    const ratio = pct(c.finished.size, c.ids.size);
    const flag = cls === 'R1' && c.ids.size > 0 && c.finished.size / c.ids.size < 0.8 ? '   ← < 80%, tighten classify-task' : '';
    console.log(`    ${cls.padEnd(7)} ${String(c.ids.size).padStart(5)}   ${String(ratio).padStart(6)}${flag}`);
  }

  if (cheats.length) {
    console.log(`\n  cheat_warn: ${cheats.length} occurrence(s) — ${[...new Set(cheats)].join(', ')}`);
  }
  if (corrupt) {
    console.log(`\n  ⚠ ${corrupt} unparseable ledger line(s) skipped.`);
  }
  console.log('');
}

// Run only when executed directly — importing (the test) gets pure buildReport.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  render(readLedger());
}
