#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   VSCODE PROJECT COLOR — never run a prompt in the wrong workspace.

   Picks a unique accent per project and writes it to
   .vscode/settings.json (titleBar + statusBar). With many repos open
   side by side, the chrome colour tells you which workspace is which
   at a glance.

   Pick logic:
     1. If package.json has `vscodeProjectColor: "<name>"` and that
        name exists in the palette → use it. (steaksoap pins "rose".)
     2. Else: deterministic sha256 hash of the project name → palette
        index. Index 0 (rose) is reserved for explicit overrides, so
        hashed projects pick from indices 1..N-1.

   JSONC-aware: edits .vscode/settings.json in place. Preserves all
   comments and keys outside `workbench.colorCustomizations`. Inside
   that block, merges (managed keys win, others kept) — comments
   strictly inside the block are not preserved.

   Usage:  pnpm vscode:color
           # or: node scripts/vscode-project-color.js
   ═══════════════════════════════════════════════════════════════ */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const ROOT = process.cwd();

/* 24-colour palette, perceptually spaced, mid-saturation so each one
   reads against VS Code's dark editor without blasting the eyes.
   Foreground is always #f5f5f5 — every bg is dark enough for white text.
   Inactive bg is computed at runtime (mix ~55 % toward #1e1e1e).        */
const PALETTE = [
  { name: 'rose', bg: '#d4438e' }, // 0 — reserved for explicit override (steaksoap)
  { name: 'crimson', bg: '#d94454' },
  { name: 'coral', bg: '#e0664a' },
  { name: 'orange', bg: '#e08a3a' },
  { name: 'amber', bg: '#d9a83a' },
  { name: 'gold', bg: '#c9a23a' },
  { name: 'olive', bg: '#8a8a3a' },
  { name: 'lime', bg: '#8fbf3a' },
  { name: 'green', bg: '#4aab5a' },
  { name: 'emerald', bg: '#2eab78' },
  { name: 'teal', bg: '#2aa19a' },
  { name: 'cyan', bg: '#3ab8c9' },
  { name: 'sky', bg: '#4598d4' },
  { name: 'blue', bg: '#4565d4' },
  { name: 'navy', bg: '#3a5aa0' },
  { name: 'indigo', bg: '#6055d4' },
  { name: 'violet', bg: '#8350d4' },
  { name: 'purple', bg: '#a045d4' },
  { name: 'magenta', bg: '#c440b8' },
  { name: 'fuchsia', bg: '#d04bd4' },
  { name: 'plum', bg: '#8e5a8e' },
  { name: 'slate', bg: '#5a7090' },
  { name: 'rust', bg: '#a05a3a' },
  { name: 'forest', bg: '#3a7a4a' },
];

const FG = '#f5f5f5';
const KEY = '"workbench.colorCustomizations"';

function readPkg() {
  try {
    return JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
  } catch {
    return null;
  }
}

function projectName() {
  const pkg = readPkg();
  return pkg?.name ?? basename(ROOT);
}

function mixWithDark(hex, t = 0.55) {
  const dark = [0x1e, 0x1e, 0x1e];
  const c = [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const mixed = c.map((v, i) => Math.round(v * (1 - t) + dark[i] * t));
  return '#' + mixed.map(v => v.toString(16).padStart(2, '0')).join('');
}

function pickColor() {
  const pkg = readPkg();
  const override = pkg?.vscodeProjectColor;
  if (override) {
    const found = PALETTE.find(p => p.name === override);
    if (found) return found;
    console.warn(`[vscode:color] override "${override}" not in palette — falling back to hash.`);
    console.warn(`[vscode:color] available: ${PALETTE.map(p => p.name).join(', ')}`);
  }
  const h = createHash('sha256').update(projectName()).digest();
  // Reserve index 0 (rose) for overrides; hash picks from 1..N-1.
  const idx = (h.readUInt32BE(0) % (PALETTE.length - 1)) + 1;
  return PALETTE[idx];
}

/* JSONC walker — strips // and /* *​/ comments, respects strings,
   tolerates trailing commas. Used for parsing only — never written. */
function stripJsonc(src) {
  let out = '';
  let i = 0;
  let state = 'code';
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (state === 'code') {
      if (c === '"') {
        state = 'string';
        out += c;
        i++;
        continue;
      }
      if (c === '/' && n === '/') {
        state = 'line';
        i += 2;
        continue;
      }
      if (c === '/' && n === '*') {
        state = 'block';
        i += 2;
        continue;
      }
      out += c;
      i++;
      continue;
    }
    if (state === 'string') {
      out += c;
      if (c === '\\' && i + 1 < src.length) {
        out += src[i + 1];
        i += 2;
        continue;
      }
      if (c === '"') state = 'code';
      i++;
      continue;
    }
    if (state === 'line') {
      if (c === '\n') {
        out += c;
        state = 'code';
      }
      i++;
      continue;
    }
    if (state === 'block') {
      if (c === '*' && n === '/') {
        state = 'code';
        i += 2;
        continue;
      }
      i++;
    }
  }
  return out.replace(/,(\s*[}\]])/g, '$1');
}

/* Walk from `openIdx` (which points at `{`) and return the index of
   the matching `}`. Respects strings and escapes. -1 if unmatched.   */
function findMatchingBrace(src, openIdx) {
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === '\\') {
      escape = true;
      continue;
    }
    if (c === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function formatBlock(obj) {
  // 2-space file indent → nested entries at 4 spaces, closing brace at 2.
  const entries = Object.entries(obj).map(
    ([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)}`,
  );
  return `{\n${entries.join(',\n')}\n  }`;
}

function writeSettings(color) {
  const dir = resolve(ROOT, '.vscode');
  const file = join(dir, 'settings.json');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const inactiveBg = mixWithDark(color.bg, 0.55);
  const managed = {
    'titleBar.activeBackground': color.bg,
    'titleBar.activeForeground': FG,
    'titleBar.inactiveBackground': inactiveBg,
    'titleBar.inactiveForeground': FG,
    'statusBar.background': color.bg,
    'statusBar.foreground': FG,
    'statusBar.noFolderBackground': inactiveBg,
  };

  if (!existsSync(file)) {
    const fresh = { 'workbench.colorCustomizations': managed };
    writeFileSync(file, JSON.stringify(fresh, null, 2) + '\n');
    log(color, inactiveBg, file, 'created');
    return;
  }

  const src = readFileSync(file, 'utf8');
  const idx = src.indexOf(KEY);

  if (idx === -1) {
    // Insert before the last top-level `}`.
    const trimmed = src.replace(/\s*$/, '');
    const lastBrace = trimmed.lastIndexOf('}');
    if (lastBrace === -1) {
      console.error('[vscode:color] no top-level closing brace found.');
      process.exit(1);
    }
    const head = trimmed.slice(0, lastBrace).replace(/\s*$/, '');
    const lastChar = head.slice(-1);
    const needsComma = lastChar !== '{' && lastChar !== ',';
    const block = formatBlock(managed);
    const insertion =
      `${needsComma ? ',' : ''}\n\n` +
      `  // Per-project accent — managed by scripts/vscode-project-color.js\n` +
      `  ${KEY}: ${block}`;
    writeFileSync(file, head + insertion + '\n}\n');
    log(color, inactiveBg, file, 'inserted');
    return;
  }

  // Key present — locate its value object, merge, rewrite that span only.
  const colonIdx = src.indexOf(':', idx + KEY.length);
  const openIdx = src.indexOf('{', colonIdx);
  const closeIdx = findMatchingBrace(src, openIdx);
  if (openIdx === -1 || closeIdx === -1) {
    console.error('[vscode:color] could not locate colorCustomizations block.');
    process.exit(1);
  }
  const innerSrc = src.slice(openIdx, closeIdx + 1);
  let existingInner;
  try {
    existingInner = JSON.parse(stripJsonc(innerSrc));
  } catch (e) {
    console.error('[vscode:color] could not parse colorCustomizations block:', e.message);
    process.exit(1);
  }
  const merged = { ...existingInner, ...managed };
  const block = formatBlock(merged);
  writeFileSync(file, src.slice(0, openIdx) + block + src.slice(closeIdx + 1));
  log(color, inactiveBg, file, 'updated');
}

function log(color, inactiveBg, file, mode) {
  console.log(
    `[vscode:color] ${projectName()} → ${color.name} (${color.bg})  inactive=${inactiveBg}`,
  );
  console.log(`[vscode:color] ${mode} ${file}`);
}

writeSettings(pickColor());
