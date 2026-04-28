---
id: pattern-2026-04-19-workbench-showcase-module
date: 2026-04-19
type: pattern
tags: [#design, #pattern, #template, #active]
scope: template
status: active
---

# Workbench showcase module — ajouter un catalogue visuel

## Problème résolu

Comment ajouter un nouveau catalogue visuel (ex : menus, heros, FAQs,
pricing variants) au playground sans dupliquer de code et en gardant la
structure cohérente avec les 22 sections existantes ?

## Template éprouvé (C1 menus, 2026-04-19)

**Structure fichiers** (ex : catégorie "XYZ") :

```
src/workbench/playground/
├── xyzs/                       ← NEW folder for the variants
│   ├── VariantA.tsx            ← self-contained component
│   ├── VariantB.tsx
│   ├── ...
│   └── index.ts                ← barrel: exports named
├── shared/
│   └── XyzFrame.tsx            ← NEW visual wrapper (name + ethos + copy-path chip)
│   └── index.ts                ← add XyzFrame export
└── sections/
    ├── XyzsSection.tsx         ← NEW section assembling the variants in frames
    └── index.ts                ← add XyzsSection export
```

**Côté `src/pages/Playground.tsx`** :
- Ajouter l'import de `XyzsSection` dans le barrel import
- Placer `<XyzsSection />` au bon endroit selon la logique (composition
  complexe = full-width en haut ; petites variants = dans une grille
  2-col avec une section proche)

## Contraintes obligatoires pour chaque variant

- **Tokens only** : `bg-bg`, `text-fg`, `text-accent`, `text-muted`,
  `border-border`, `font-mono`, etc. Jamais de couleur hex ou de taille
  arbitraire.
- **Responsive** : `sm` / `md` / `lg` utilisés pour couvrir 320 px → 1920
  px incluant les moniteurs portrait (~1080 px de large).
- **Touch targets** : 44×44 min sur mobile (typique : `h-11 w-11` sur
  les boutons icône).
- **Accessibilité** : `aria-label` sur boutons icône, `aria-expanded`
  sur toggles, `role="dialog"` + `aria-modal="true"` sur overlays
  fullscreen, Escape ferme les overlays ouverts.
- **Auto-contained** : zéro dépendance externe (pas de react-router, pas
  de state global). `useState` local suffit pour toggle/dropdown.
- **href valides** : `href="#home"` pas `href="#"` (règle ESLint
  `jsx-a11y/anchor-is-valid`).
- **`max-w-400`** (canonique Tailwind 4) au lieu de `max-w-[1600px]`.

## Frame wrapper — rôle + template

`shared/XyzFrame.tsx` sert à :
- Afficher le nom + ethos du variant
- Rendre le chemin d'import copiable (Copyable chip)
- Isoler visuellement chaque variant avec une bordure (simulacre de
  "page-top" dans la showcase)

```tsx
export function XyzFrame({ name, path, ethos, children }: Props) {
  return (
    <article className="border-border/60 bg-bg overflow-hidden rounded-xl border">
      <header className="border-border/50 bg-surface/40 flex flex-wrap items-baseline justify-between gap-3 border-b px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <h3 className="text-fg text-sm font-medium tracking-tight md:text-base">{name}</h3>
          <p className="text-muted font-mono text-[10px] tracking-[0.15em] uppercase">{ethos}</p>
        </div>
        <Copyable text={path} />
      </header>
      <div className="bg-bg">{children}</div>
    </article>
  );
}
```

(Pour les menus, voir directement `src/workbench/playground/shared/MenuFrame.tsx`.)

## Anti-patterns

- **Ne PAS** copier-coller le même variant et changer 2 classes.
  Chaque variant doit avoir une intention design distincte sinon il
  pollue le catalogue.
- **Ne PAS** laisser des `href="#"` — ESLint échoue.
- **Ne PAS** hardcoder de largeur en px arbitraire ; utiliser les tokens
  spacing Tailwind 4 (`max-w-400`, pas `max-w-[1600px]`).
- **Ne PAS** oublier d'ajouter à `sections/index.ts` ET à
  `shared/index.ts` ET à `Playground.tsx` (triple wire-in).

## Quand appliquer ce pattern

À chaque prochain ajout de catalogue :
- Heros (~C1.3 de Production Machine)
- Sections content (features, FAQ, pricing, team, etc. — C1.4)
- Moodboards per design direction (C1.6)

## Cross-refs

- Première application : commit `0d1aaa6` (feat/playground-menus)
- Fichiers exemples :
  - `src/workbench/playground/menus/BrutalistNav.tsx` (composant
    variant)
  - `src/workbench/playground/shared/MenuFrame.tsx` (frame wrapper)
  - `src/workbench/playground/sections/MenusSection.tsx` (section
    assembler)
- Décision amont : `decisions/2026-04-19-repo-objective.md`
  (starter perso optimisé = pipeline bout-en-bout)
