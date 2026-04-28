import { describe, expect, it } from 'vitest';

import { classify } from '../classify-task.js';

/* ═══════════════════════════════════════════════════════════════
   classify-task.js tests — locks the R0/R1/R2/SKIP pattern matching
   so future regex tweaks can't silently regress. Reality-calibrated:
   every case here is a phrasing we've actually seen (session
   journals 2026-04-20, audit-cycle-closed history).
   ═══════════════════════════════════════════════════════════════ */

describe('classify — R0 (mechanical, dispatch to worker-haiku)', () => {
  const cases = [
    'patch le site GAFHA',
    'propage les dernières améliorations upstream',
    'applique la patch infra',
    'nettoie les imports morts',
    'clean up les imports',
    'reformat le fichier',
    'rattrape le drift docs',
    'catch-up les deps',
    'bump les deps safe',
    'upgrade les deps',
    'mets à jour les deps',
    'pnpm memory:index',
    'pnpm docs:sync',
    'rename foo to bar',
    'regen INDEX.md',
    'archive memory sessions > 30 jours',
  ];
  for (const prompt of cases) {
    it(`"${prompt}" → R0`, () => {
      expect(classify(prompt).class).toBe('R0');
    });
  }
});

describe('classify — R1 (new code following pattern, dispatch to worker-sonnet)', () => {
  const cases = [
    'implémente un bouton secondaire',
    'implémente une nouvelle page About',
    'monte un composant Banner avec variants',
    'extract ce block en sous-composant',
    'extract a hook from this logic',
    'nouveau composant Toast',
    'nouvelle page dashboard',
    'crée un hook useFocusTrap',
    'écris un test pour Button',
    'ajoute un champ featuredImage au schema',
    'new component LanguageSwitcher',
    'create a hook useCopyToClipboard',
    'implement a component Modal',
    'local refactor of this function',
  ];
  for (const prompt of cases) {
    it(`"${prompt}" → R1`, () => {
      expect(classify(prompt).class).toBe('R1');
    });
  }
});

describe('classify — R2 (architecture, stays main-thread)', () => {
  const cases = [
    'audit le repo en entier',
    'refonte visuelle du header',
    'redesign the home page',
    'choix de librairie pour i18n',
    'library choice for forms',
    'stratégie de migration vers Next',
    'plan pour le handoff',
    'architecture du dispatch system',
    'refactor cross-cutting de tous les imports',
    'debug without repro ce truc bizarre',
  ];
  for (const prompt of cases) {
    it(`"${prompt}" → R2`, () => {
      expect(classify(prompt).class).toBe('R2');
    });
  }
});

describe('classify — SKIP (conversational / info)', () => {
  const cases = [
    'où on en est',
    'status',
    'git status',
    'c\'est quoi la dernière release',
    'explique ce code',
    'how does this work',
    'merci',
    'ok',
    'oui',
    'non',
    '',
  ];
  for (const prompt of cases) {
    it(`"${prompt}" → SKIP`, () => {
      expect(classify(prompt).class).toBe('SKIP');
    });
  }
});

describe('classify — precedence (R2 wins over R1/R0)', () => {
  it('"audit + bump deps" → R2 (architecture beats mechanical)', () => {
    expect(classify('audit le repo et bump les deps').class).toBe('R2');
  });
  it('"nouveau composant + refactor global" → R2 (architecture wins)', () => {
    expect(classify('nouveau composant dans un refactor global').class).toBe('R2');
  });
});

describe('classify — confidence signal', () => {
  it('weak single-signal R0 has non-zero confidence', () => {
    // WHY: "rename" alone is a single regex match — confidence should still
    // clear the lower bound (>= 0.6 per the `0.6 + 0.15*n` formula).
    const r = classify('rename this file');
    expect(r.class).toBe('R0');
    expect(r.confidence).toBeGreaterThanOrEqual(0.6);
  });

  it('empty prompt → SKIP with full confidence', () => {
    const r = classify('');
    expect(r.class).toBe('SKIP');
    expect(r.confidence).toBe(1);
  });
});
