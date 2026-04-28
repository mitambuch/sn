#!/usr/bin/env node

/* ═══════════════════════════════════════════════════════════════
   CREATIVE:ADD — scaffold a new creative-library entry

   Usage:
     pnpm creative:add <category> <slug>

   <category>: mechanic | lib | anti-pattern | reference
   <slug>:     kebab-case identifier

   Creates .claude/memory/creative-library/<category>/<slug>.md with
   the appropriate template frontmatter + body skeleton. Fails if
   the file already exists (no overwrite).
   ═══════════════════════════════════════════════════════════════ */

import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LIBRARY = join(ROOT, '.claude', 'memory', 'creative-library');

const VALID_CATEGORIES = {
  mechanic: 'mechanics',
  mechanics: 'mechanics',
  lib: 'libs',
  libs: 'libs',
  'anti-pattern': 'anti-patterns',
  'anti-patterns': 'anti-patterns',
  reference: 'references',
  references: 'references',
};

const TEMPLATES = {
  mechanics: (slug, today) => `---
id: mechanic-${slug}
date: ${today}
type: mechanic
tags: [#mechanic, #design, #template, #active]
scope: template
status: active
---

# ${slug} — [short description]

## Quoi

[1-2 phrases — what this mechanic is]

## Quand l'utiliser

- [concrete use case]
- [another]

## Quand éviter

- [no-go case]
- [a11y concern]

## Implémentation minimale

\`\`\`tsx
// minimal working snippet (≤ 50 lines)
\`\`\`

## Variantes

- [variant 1]

## Performance / budget

- [concrete numbers]

## a11y

- \`prefers-reduced-motion\` fallback : [strategy]

## Refs

- [URL]
- [URL]

## Cross-refs

- \`.claude/rules/creative-ambition.md\`
- \`.claude/rules/vision-first.md\`
- \`mechanics/<related>.md\`
`,

  libs: (slug, today) => `---
id: lib-${slug}
date: ${today}
type: lib
tags: [#lib, #design, #template, #active]
scope: template
status: active
---

# ${slug} — [short pitch]

## Quoi

[npm package name, maintainer, ~bundle size gzip, 1-2 sentences]

## Quand l'utiliser

- [use case]

## Quand éviter

- [bundle constraint]
- [browser support]

## API essentiels

- \`functionA\` — [description]
- \`HookB\` — [description]

## Snippet minimal

\`\`\`tsx
// canonical use case (10-30 lines)
\`\`\`

## Intégration avec notre stack

- Vite + React 19 + Tailwind 4 + TS 5.9
- [any gotchas]

## Dépendances / peer deps

- [peer dep name]

## Refs

- [official docs URL]

## Cross-refs

- \`mechanics/<using-this-lib>.md\`
`,

  'anti-patterns': (slug, today) => `---
id: anti-${slug}
date: ${today}
type: anti-pattern
tags: [#anti-pattern, #design, #template, #active]
scope: template
status: active
---

# ${slug} — [pattern title]

## Le pattern

[Specific description: colors, fonts, layout, components]

## Pourquoi c'est l'AI slop 2020-2024

[Why Claude/GPT/Gemini defaults to this under ambiguity]

## Signaux de détection

- [signal 1 — if I catch myself coding X]
- [signal 2]

## Alternatives ambitieuses

- \`mechanics/<alt-1>.md\`
- \`mechanics/<alt-2>.md\`
- \`references/uipro/styles-catalog.md\` — Tier 1 [style name]

## Quand c'est quand même acceptable

- [rare legit case — a11y-first, gov, healthcare, etc.]

## Cross-refs

- \`.claude/rules/creative-ambition.md\`
`,

  references: (slug, today) => `---
id: ref-${slug}
date: ${today}
type: reference
tags: [#reference, #design, #template, #active]
scope: template
status: active
source: [URL]
---

# ${slug} — [site/repo name]

## Quoi

[1-2 phrases what this reference is]

## Mécaniques signature identifiées

- [mechanic 1] → \`mechanics/<slug>.md\`
- [mechanic 2]
- [mechanic 3]

## Stack technique observée

- [lib/framework used]

## Take-away exploitable

[1-2 paragraphs on what we can reuse/adapt from this reference]

## Anti-pattern éventuel

[What doesn't age well in this ref, if anything]

## Cross-refs

- \`references/<other>.md\`
- \`mechanics/<extracted>.md\`
`,
};

const [, , rawCategory, slug] = process.argv;

if (!rawCategory || !slug) {
  console.error('Usage: pnpm creative:add <category> <slug>');
  console.error('  <category>: mechanic | lib | anti-pattern | reference');
  console.error('  <slug>:     kebab-case identifier (ex: snake-cursor-follow)');
  process.exit(1);
}

const category = VALID_CATEGORIES[rawCategory];
if (!category) {
  console.error(`Unknown category "${rawCategory}". Valid: ${Object.keys(VALID_CATEGORIES).join(', ')}`);
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error(`Invalid slug "${slug}". Must be kebab-case lowercase (a-z 0-9 -).`);
  process.exit(1);
}

const dir = join(LIBRARY, category);
mkdirSync(dir, { recursive: true });

const target = join(dir, `${slug}.md`);
if (existsSync(target)) {
  console.error(`File already exists: ${target}`);
  console.error('Edit manually or choose a different slug.');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const content = TEMPLATES[category](slug, today);
writeFileSync(target, content, 'utf8');

console.log(`✓ Created: ${target}`);
console.log(`  Open and fill in the template sections.`);
console.log(`  Then cite this slug in a VISION block via creative-library/${category}/${slug}`);
