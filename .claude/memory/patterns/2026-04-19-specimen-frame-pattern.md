---
id: pattern-2026-04-19-specimen-frame-pattern
date: 2026-04-19
type: pattern
tags: [#design, #pattern, #template, #active]
scope: template
status: active
---

# SpecimenFrame + tag-based component library

## Problème résolu

Comment organiser une librairie de composants "signature" (menus,
heros, boutons, cards, loaders, gradients, etc.) dans le playground
de manière cohérente, copiable, et filtrable par vibe ?

## Solution éprouvée (2026-04-19, après 17 commits)

Structure canonique :

```
src/workbench/playground/
├── tags.ts                    ← vocabulaire fermé
├── shared/
│   ├── SpecimenFrame.tsx      ← wrapper (id + tags + ethos + copy-path)
│   ├── MenuFrame.tsx          ← variant full-width pour menus/heros
│   └── TypeRow.tsx            ← variant typography spec
├── <category>/                ← ex : buttons/, heros/, cards/, loaders/, menus/
│   ├── VariantA.tsx           ← un fichier par variant autonome
│   ├── VariantB.tsx
│   └── index.ts               ← barrel
└── sections/
    └── <Category>Section.tsx  ← assembleur : core atom + specimens
```

Chaque specimen a :
- **id** stable (kebab-case, citable en conversation : "utilise `arrow-forward`")
- **tags** 1-3 (depuis `tags.ts`, ex : `#brutalist #solid`)
- **ethos** one-liner décrivant l'intention
- **path** copiable = import statement
- **Component** autonome, tokens-only, pas de props externes, responsive

## Vocabulaire de tags (closed set)

**Style (8)** : brutalist · editorial · minimal · product · playful · luxe · technical · organic
**Behavior (5)** : icon · solid · ghost · animated · accent

Défini dans `src/workbench/playground/tags.ts` avec types TypeScript.

## Règles critiques pour éviter les régressions

1. **Tokens only** — jamais de hex hardcodé. Tout via `var(--color-*)`
   ou classes Tailwind `bg-accent` / `text-fg` / etc.
2. **Responsive** — chaque specimen fonctionne 320 px → 1920 px, incluant
   monitors portrait (~1080 px de large).
3. **Touch targets** — 44×44 minimum pour boutons icône
   (`h-11 w-11` ou plus).
4. **Light/dark** — via tokens, les specimens suivent automatiquement
   le thème. `ThemeToggle` dans playground pour tester.
5. **Motion-safe** — `motion-safe:animate-*` sur les loaders + menus
   animés. `prefers-reduced-motion` respecté.
6. **Focus-visible** — `focus-visible:ring-accent` sur tous les
   interactifs. Jamais `outline: none` sans remplacement.
7. **Accessibilité** — `aria-label`, `aria-expanded`, `role="dialog"
   aria-modal"` sur les overlays.
8. **href valides** — `href="#home"` ou `href="#contact"`, jamais
   `href="#"` (ESLint `jsx-a11y/anchor-is-valid` le flag).
9. **max-w-400** canonique — `max-w-[1600px]` = warning.
10. **`bg-linear-to-*`** Tailwind 4 — `bg-gradient-to-*` est déprécié.
11. **No label-wrapping checkbox/file-input** — bug ESLint
    `jsx-a11y/label-has-associated-control` + minimatch crash. Utiliser
    `<label htmlFor>` explicite ou pattern `<button>` + hidden input.

## Section assembler pattern

```tsx
// Chaque XxxSection.tsx suit ce squelette :
export function XxxSection() {
  return (
    <Section number="NN" title="xxx">
      <p className="text-muted mb-8 ...">Description pédagogique.</p>

      {/* · core atom */}
      <h3>· core atom</h3>
      {/* existing <Atom /> showcase — preservation */}

      {/* · specimens */}
      <h3>· specimens</h3>
      <div className="grid gap-4 lg:grid-cols-2">
        {SPECIMENS.map(({ id, path, tags, ethos, Component }) => (
          <SpecimenFrame {...{ id, path, tags, ethos }}>
            <Component />
          </SpecimenFrame>
        ))}
      </div>
    </Section>
  );
}
```

## Quand appliquer

- Chaque nouvelle section du playground
- Chaque nouveau type de composant (cards, testimonials, heros, etc.)
- Chaque ajout de variants à une section existante

## Anti-patterns

- **Ne pas** oublier de tagger : un specimen sans tag = non-filtrable
  en conversation.
- **Ne pas** wrapper les specimens dans SpecimenFrame si l'élément a
  besoin d'être full-width (heros, menus) — utiliser `MenuFrame` à la
  place.
- **Ne pas** dupliquer l'atom de base dans les specimens — garder
  l'atom dans `· core atom`, les specimens sont des extensions.
- **Ne pas** mélanger CORE et GRAPHIC dans les zones Playground.

## Cross-refs

- `src/workbench/playground/tags.ts` — vocabulaire typé
- `src/workbench/playground/shared/SpecimenFrame.tsx` — wrapper
- `src/workbench/playground/shared/MenuFrame.tsx` — variant full-width
- `decisions/2026-04-19-repo-objective.md` — "machine de guerre"
- Sections appliquant le pattern : buttons, heros, menus, cards,
  loaders, badges, banners, toasts, forms, overlays, avatars, icons,
  empty states, accordion, pricing, testimonials, CTA (17 sections)
