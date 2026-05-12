---
id: 2026-05-12-brand-identity-saw-next
date: 2026-05-12
type: decision
tags: [#design, #decision, #client-specific, #active, #p0]
scope: client-specific
status: active
---

# Brand identity — SAW↗NEXT logo system + fonts + arrow vocabulary

## ⚠️ RÈGLE ABSOLUE — `<BrandMark />` est la SEULE manière de rendre le logo

**Owner explicit 2026-05-12 21:10** (après pixel-perfect validation à
weight 600 + offset -0.09em) :
> *"VERROUILLE C'EST LE LOGO PIXEL PERFECT — c'est LA RÈGLE LA PLUS
> IMPORTANTE, on doit TOUJOURS avoir ce rendu."*

```tsx
import { BrandMark } from '@components/brand/BrandMark';

<BrandMark className="text-9xl" />                  {/* SAW↗NEXT display */}
<BrandMark className="text-3xl" />                  {/* SAW↗NEXT header */}
<BrandMark variant="short" className="text-6xl" />  {/* S↗N short form */}
```

**INTERDIT** :
- Hand-roll `SAW↗NEXT` ou `S↗N` directement dans du JSX
- Recopier le ↗ inline dans un h1/p/span sans passer par `<BrandMark />`
- Wrapper le ↗ dans un span custom avec un offset/transform différent
- Override le `font-bold` ou le `font-mono` du composant

**Source de vérité** : `src/components/brand/BrandMark.tsx`. Si l'offset
vertical doit changer (cap-height align), tweak la constante `ARROW_OFFSET`
dans ce fichier — un endroit unique, propage partout.

## Spec du rendu validé (pixel-perfect 2026-05-12 21:10)

- **Forme longue** : `SAW↗NEXT`
- **Forme courte** : `S↗N`
- **Font** : Geist Mono Variable, weight **700** (`font-bold` partout :
  texte + flèche). Owner a testé 600 (font-semibold) en visualisation
  mais refresh manqué → revert 700 final 2026-05-12 21:24
- **Casse** : capitales uniquement
- **Flèche** : `↗` exclusivement (Unicode U+2197)
- **Offset vertical du ↗** : `translateY(-0.09em)` — cap-height align (collée
  en haut du mot, pas centrée em-middle qui est le rendu natif Geist Mono)
- **Aucun espace** autour de la flèche
- La flèche **fait partie intégrante du mot** — non séparable

## Flèche — RÈGLE STRICTE

La seule flèche nord-est autorisée est `↗` (U+2197). C'est le glyphe que
**Geist Mono rend en bold** — c'est déjà la signature, pas besoin
de chercher une variante "plus stylée".

### Variantes INTERDITES (jamais substituer)

| Glyphe | Code point | Nom |
|---|---|---|
| `⬈` | U+2B08 | NE Black Arrow |
| `➚` | U+279A | Heavy NE Arrow |
| `🡕` | U+1F855 | Heavy NE Arrow alt |
| `🠕` | U+1F815 | — |
| `🢁` | U+1F881 | — |
| `⤴` | U+2934 | Arrow curving up |
| `⇗` | U+21D7 | Double NE |
| Toutes les variantes emoji ou décoratives | — | — |
| Toute version SVG custom "plus design" | — | — |

**Pourquoi** : Geist Mono dessine `↗` en bold solid heavy, ce qui EST
la signature. Substituer = casser la cohérence font-built. Le 2026-05-12
incident : tokens font mal nommés (`--font-family-mono` au lieu de
`--font-mono`) → fallback system, ↗ rendu thin → tentation d'aller
chercher un SVG ou autre Unicode. Corriger le token est la VRAIE solution.

### Génération de code

- **Copy-paste** le caractère `↗` directement depuis cette fiche
- **Ne jamais** reconstruire via entité HTML (sauf cas technique explicite : `&#8599;`)
- **Ne jamais** utiliser un SVG inline custom — la font fait le travail
- **Ne jamais** inventer une variante "stylée" ou "design"

## Système de flèches (vocabulaire visuel de marque)

Réutilisable dans bandeaux, boutons, ancrages, transitions, animations.
Toujours stylées en **Geist Mono Bold** pour cohérence avec le logo.

| Glyphe | Code point | Usage |
|---|---|---|
| `↗` | U+2197 | signature, accent, identité |
| `↘` | U+2198 | descente, intro de section |
| `↙` | U+2199 | retour, sortie, back-link |
| `→` | U+2192 | CTA, lien, continuité |

### Animation

Peuvent être animées (rotation légère, translation, fade, scale). **Ne
changent jamais de glyphe en cours d'animation** (pas de morph ↗ → →).

## Fonts

### Tokens (CSS @theme, Tailwind 4 namespace)

```css
--font-sans: 'Geist Variable', system-ui, -apple-system, sans-serif;
--font-mono: 'Geist Mono Variable', ui-monospace, monospace;
```

**Important** : Tailwind 4 utilise le namespace `--font-*`, **PAS**
`--font-family-*`. Si tu nommes le token `--font-family-mono`, l'utility
`font-mono` ne mappera **pas** dessus et tombera sur ui-monospace fallback
(d'où le ↗ rendu thin). C'est l'incident du 2026-05-12 ; conservé ici comme
filet pour les prochaines fois.

### Usage

- **Geist Sans** (variable) : body, titres, copy éditoriale, dashboard
  greeting, descriptions narratives — *humain neutre moderne*
- **Geist Mono** (variable) : **logo**, sidebar nav items, badges meta,
  numerals (Stats / Countdown / PriceTag), micro-uppercase labels,
  footer technique, breadcrumb path-like — *TECH, dense, signature thelobby*

### Package — utiliser le package `geist` officiel Vercel, PAS Fontsource

```bash
pnpm add -w geist
```

Le package `geist` officiel Vercel publie les fichiers **full-glyph** dans
`node_modules/geist/dist/fonts/`. Copier les .woff2 variables dans
`public/fonts/` et déclarer via @font-face WITHOUT `unicode-range` :

```css
/* src/styles/fonts.css */
@font-face {
  font-family: 'Geist Variable';
  src: url('/fonts/Geist-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Geist Mono Variable';
  src: url('/fonts/GeistMono-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

### Piège Fontsource — NE JAMAIS UTILISER POUR GEIST

`@fontsource-variable/geist-mono` (et le sibling sans) sont buildés à partir
de **Google Fonts**, qui split en subsets `latin` / `latin-ext` / `cyrillic`.
Le **subset latin par défaut** OMET le glyphe ↗ U+2197 :

```
unicode-range: U+0000-00FF, ..., U+2191, U+2193, U+2212, U+2215, ...
                                  ↑ up   ↑ down (mais PAS ↗ NE)
```

Conséquence : ↗ tombe en **fallback per-glyph** sur `ui-monospace` →
rendu thin standard, pas le glyphe Geist Mono natif (heavy bold). On y a
perdu ~20 min le 2026-05-12. **Toujours self-host depuis le package
`geist` Vercel, jamais Fontsource pour Geist.**

## En cas de doute

**Demander avant de générer**. Ne jamais inventer ni substituer une variante.

## Source

Owner instruction directe le 2026-05-12 20:31 puis raffinement à 20:44
(session marathon design-night, livraison client demain). À considérer
comme **contrat de marque inviolable**, pas guideline souple.

## Cross-refs

- Session en cours : sessions/2026-05-12-2000-*.md
- Composant logo : (à créer) `src/components/brand/BrandMark.tsx`
- Page validation : `src/pages/LogoPreview.tsx` (route `/logo`)
- Migration tokens : src/index.css ligne 40-41
- À utiliser systématiquement : Header / Footer / Logo / brand asset /
  signature email Resend / favicon (futur).
