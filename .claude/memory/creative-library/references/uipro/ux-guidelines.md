---
id: uipro-ux-guidelines
date: 2026-04-23
type: reference
tags: [#design, #a11y, #template, #active]
scope: template
status: active
source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/data/ux-guidelines.csv
---

# UX guidelines — ce qui doit tenir quoi que la DA

## Usage

99 guidelines UX/a11y/perf. **Ce sont des contraintes**, pas des
directions créatives. Une DA "putain de ouff" doit **quand même**
respecter ces guidelines (sinon site esthétique mais inutilisable).

Groupées par catégorie, triées Severity High/Critical en premier.
Niveau "Medium" / "Low" / "Nice-to-have" sont dans la source CSV.

## Accessibility (11) — baseline non-négociable

| Item | Do | Don't |
|---|---|---|
| **Color Contrast** | WCAG 2.1 AA minimum (4.5:1 body, 3:1 large) | Texte gris clair sur blanc |
| **Color Only** | Utiliser icône/texte en plus de la couleur | Status = couleur seule |
| **Alt Text** | Image informative → alt descriptif | Alt générique ("image1") |
| **ARIA Labels** | Bouton icône → aria-label explicite | Bouton nu sans label |
| **Keyboard Navigation** | Toute action atteignable au clavier | Interactions hover/cursor-only |
| **Form Labels** | `<label>` associé à chaque input | Placeholder-as-label |
| **Error Messages** | Announced via aria-live + visible | Couleur rouge seule |
| **Focus States** | Ring visible contrastant | `outline: none` sans alternative |
| **Motion Sensitivity** ⚠ | `prefers-reduced-motion` respecté | Parallax/scroll-jack forcé |
| **Touch Targets** | 44×44 px min (Apple) / 48×48 (Google) | Boutons 24 px |
| **Readable Font Size** | Body ≥ 16 px | Body 12 px pour tenir |

**Implication directe sur nos mechanics** : tout scroll-driven 3D,
kinetic typo, parallax, motion-heavy doit avoir un `prefers-reduced-motion`
fallback. Non négociable.

## Animation (8) — ambitieux + accessible

| Item | Règle |
|---|---|
| **Excessive Motion** | Max 1-2 animations "grosses" par section. Pas 7. |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` + version dégradée statique |
| **Loading States** | Skeleton / spinner / progress — jamais de "ça charge dans le néant" |
| **Hover vs Tap** | Hover effect → alternative touch (tap + held, long-press reveal) |
| **Duration** | Default `200-300ms` pour UI, `400-800ms` pour entrée hero, `1s+` pour cinema reveal |
| **Easing** | `cubic-bezier(0.4, 0, 0.2, 1)` (material standard) pour micro, `cubic-bezier(0.65, 0, 0.35, 1)` (snappy) pour impacts |
| **Performance** | Animer `transform` + `opacity` only. Pas `top/left/width/height` (layout thrash) |
| **Scroll-linked** | Privilégier `animation-timeline: scroll()` CSS native quand dispo, fallback GSAP |

## Performance (8)

| Item | Cible |
|---|---|
| Image Optimization | AVIF/WebP, `<picture>` fallback, lazy below fold |
| LCP (Largest Contentful Paint) | < 2.5s (Web Vitals good) |
| CLS (Cumulative Layout Shift) | < 0.1 — réserver espace images/embeds |
| TTI (Time to Interactive) | < 3.5s |
| Bundle size | Initial JS < 200 KB gzip |
| Code splitting | Route-based + component lazy pour 3D / r3f |
| Font loading | `font-display: swap` + preload primary |
| Third-party | Défers + respect de l'initial payload |

**Implication stack 2026** : r3f / drei / three sont 180 KB gzip →
**obligatoire** de lazy-loader, Suspense boundary, server placeholder.

## Interaction (8)

| Item | Do |
|---|---|
| Focus States | Ring visible, couleur accent, 2-3 px offset |
| Loading Buttons | Disabled + spinner pendant async, prevent double submit |
| Error Feedback | aria-live + texte visible + icône + color |
| Confirmation Dialogs | Destructive actions (delete, pay, cancel) → confirm explicit |
| Drag & Drop | Feedback zone dépose visible, preview pendant drag |
| Tooltips | 500ms delay, dismiss on Escape, pas d'info critique dedans |
| Context Menus | Aria accessible, keyboard navigable |
| Double-click | Jamais comme action primaire (desktop-only, non-mobile) |

## Forms (10) — souvent bâclés par AI

| Item | Règle |
|---|---|
| Input Labels | `<label>` visible + associé (pas placeholder-as-label) |
| Required Fields | `required` + indicateur visuel (*) + `aria-required` |
| Validation | Inline au blur + sur submit, pas pendant typing |
| Error Position | Sous le champ, visible, aria-describedby |
| Password Fields | Toggle show/hide accessible |
| Autocomplete | `autocomplete` attribute proper (address, email, etc.) |
| Button States | Idle / Hover / Focus / Active / Loading / Disabled |
| Submit Feedback | Confirmation visible (toast / redirect / inline) |
| Form Length | Minimiser, split multi-step si > 6 fields |
| Save Progress | Multi-step → indicateur + persistence localStorage |

## Navigation (6)

| Item | Règle |
|---|---|
| Smooth Scroll | `scroll-behavior: smooth` sur `<html>` + Lenis pour control |
| Sticky Navigation | `padding-top` body compensant la hauteur nav |
| Back Button | Browser back marche (pas de SPA qui le détourne silencieusement) |
| Breadcrumbs | Sur pages profondes (>2 niveaux), structured data schema |
| Mobile Menu | Hamburger OK mais avec affordance + close clair |
| Active State | Item actif distinct visuellement (pas juste hover) |

## Responsive (8)

| Item | Règle |
|---|---|
| Mobile First | Media queries min-width, pas max-width |
| Touch Friendly | Targets 44×44 min, spacing 8 px entre |
| Readable Font | 16 px minimum body mobile |
| Viewport Meta | `<meta name="viewport" content="width=device-width, initial-scale=1">` |
| Horizontal Scroll | **Jamais** (sauf galerie volontaire horizontale) |
| Breakpoints | sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536 (Tailwind defaults) |
| Images | `srcset` / `picture` pour retina + density |
| Dark Mode | Support via `prefers-color-scheme` ou toggle explicit |

## Typography (6)

| Item | Règle |
|---|---|
| Contrast Readability | Body 7:1 idéalement, 4.5:1 minimum |
| Line Height | 1.5-1.7 body, 1.1-1.3 headlines |
| Line Length | 60-80 chars par ligne (prose) |
| Font Loading | `font-display: swap`, préchargement |
| Scale | Modular scale 1.25x / 1.333x / 1.5x consistent |
| Weight Hierarchy | Au moins 3 weights différents (300/500/700 typique) |

## Touch (6) — pour mobile

| Item | Règle |
|---|---|
| Touch Target Size | 44×44 (iOS) / 48×48 (Android) min |
| Tap Gestures | Tap / Long-press / Swipe / Pinch — documenter les dispos |
| Thumb Zone | Primary actions en bas (thumb-reachable) |
| Edge Swipe | Ne pas override les gestures système (back edge, notif drawer) |
| Pull-to-Refresh | Patterns natifs respectés |
| Haptics | Feedback subtle sur actions clés si dispo |

## Feedback (6)

| Item | Règle |
|---|---|
| Loading Indicators | Skeleton > spinner > "loading…" texte |
| Toast Notifications | 3-5s auto-dismiss, dismissible, ARIA live polite |
| Empty States | Illustration + texte guide + CTA |
| Error States | Ton humain + action corrective claire |
| Success States | Feedback proportionné (toast pour perso, modal pour important) |
| Skeleton Screens | Pour async, match final layout pour éviter CLS |

## AI Interaction (3)

| Item | Règle |
|---|---|
| Disclaimer | "Powered by AI" visible si réponses LLM user-facing |
| Uncertainty | Montrer quand AI est incertain (confidence score / "I'm not sure") |
| Human Escalation | Toujours offrir "parler à un humain" fallback |

## Sustainability (2) — nouveauté 2026

| Item | Règle |
|---|---|
| Dark Mode Default | Sur OLED, économies 30-40% batterie |
| Asset Budget | Bundle total < 1 MB page initial |

## Cross-refs

- `.claude/rules/responsive.md` — responsive mobile-first
- `.claude/rules/performance.md` — bundle + Lighthouse 90+
- `mechanics/*.md` (Phase 2) — chaque mechanic rappelle son fallback
  `prefers-reduced-motion`
- Source complète : https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max/data/ux-guidelines.csv
