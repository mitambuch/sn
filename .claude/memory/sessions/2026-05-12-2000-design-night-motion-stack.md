---
id: 2026-05-12-2000-design-night-motion-stack
date: 2026-05-12
type: session
tags: [#design, #workflow, #routing, #client-specific, #active, #p0]
scope: client-specific
status: active
---

# Session — Design-night motion stack (Phase 1-5) + brand identity SAW↗NEXT

## Context

Session marathon 20:00 → ~22:30 (~2h30, 7 commits) ouverte par owner avec
mission : "TOUT bien calé sur Supabase/Sanity/Resend + attaquer le design
du site, livraison client demain 2026-05-13". Pivot rapide après réalité-
check : backend déjà OK depuis lot A.5/A.6 (2026-05-11), le vrai blocker
= identité visuelle + motion design "puer la modernité + une autre
dimension".

Branche : `feat/brand-identity-foundation` (7 commits, non mergée).

## Ce qui a été shippé (7 commits)

### Vague 1 — Brand identity foundation

**`106a4a8` feat(brand): Geist Mono full-glyph + SAW↗NEXT identity foundation**
- Install `geist` package officiel Vercel (drop Fontsource — subset latin
  omettait U+2197 ↗, faisait tomber le glyphe en fallback per-glyph thin)
- Self-host Geist-Variable.woff2 + GeistMono-Variable.woff2 dans public/
  fonts/ (full-glyph, no unicode-range subset)
- Rewrite src/styles/fonts.css avec full-glyph @font-face
- Rename CSS tokens `--font-family-*` → `--font-*` (Tailwind 4 namespace —
  `--font-family-*` legacy v3 ne mappait PAS sur `font-sans` / `font-mono`
  utilities, fallback ui-monospace silencieux)
- Drop @fontsource-variable/geist*
- new page /logo brand validation
- decision memory entry avec piège Fontsource documenté

**`6197a56` feat(brand): <BrandMark /> canonical — pixel-perfect SAW↗NEXT**
- Component `<BrandMark variant?: 'full' | 'short' />` source unique de
  vérité pour SAW↗NEXT. Geist Mono Variable / font-bold 700 / caps
- `ARROW_OFFSET = -0.09em` tokenise la position verticale du ↗ (cap-height
  align — owner validé "PIXEL PERFECT" 21:10)
- Memory decision **règle absolue** : jamais hand-roll SAW↗NEXT, toujours
  <BrandMark />

### Vague 2 — Light theme + 35mm grain + mono typo

**`96fc59d` feat(brand+motion): light default + 35mm grain + mono typo**
- Theme swap : light en @theme défaut (bg #bcbcbc gris papier carton,
  fg #2a2a2a charcoal soft contrast ~8:1), dark en `[data-theme='dark']`
  override. ThemeContext default 'light', ignore system preference.
- Motion tokens étendus : `--duration-instant→glacier`, `--ease-luxe/
  spring/glide` (auto-mapped `ease-luxe` utility), `--blur-glass-sm/md/
  lg`, `--reveal-y-*` + `--stagger-*` pour useReveal futur
- **Grain 35mm cinéma** : SVG fractalNoise sur body::before, opacity 0.45,
  size 240px, baseFrequency 0.70, animation 2.4s steps(8) (24fps cinema
  feel). mix-blend-mode multiply (light) / screen (dark) via
  `--grain-blend` token per theme. z-index 9998 REQUIRED pour que le
  blend s'exécute. Owner iterative : opacity 0.08 → 0.18 → 0.32 → 0.45,
  baseFrequency 0.92 → 0.75 → 0.62 → 0.35 → 0.70 final
- **@layer base h1-h6 défaut Geist Mono / 700 / uppercase / tracking-
  tight** ("le logo est la base des titres" — owner)
- Mass replace `font-light` → `font-mono font-bold uppercase` dans 17
  fichiers (components, features, pages). Workbench showcase non touché.
- Headings downscalés (text-7xl→5xl) Home/Onboarding/DetailHero/
  AccountDashboard/SectionHeader pour réduire contraste taille
- <BrandMark /> dans Header.tsx + Footer.tsx (remplace siteConfig.name
  text inline)

### Vague 3 — Drawer unification + Lenis

**`361066c` feat(forms+motion): Lenis smooth scroll + <RequestDrawerShell> unifié**
- Owner direction 21:43 : "le formulaire faire une demande sur-mesure
  utilise encore le module latéral, son design est beaucoup plus
  travaillé c'est magnifique, faut réutiliser ce système pour le reste
  des formulaires"
- new src/components/ui/RequestDrawerShell.tsx — chrome canonique extracté
  du BespokeRequestDrawer (backdrop blur, slide-in-from-right, header
  eyebrow+h2+lede+close X, scroll-y body, optional footer, escape close,
  body scroll lock)
- Refactor 5 drawers → shell : Bespoke, Inquiry, FreeForm, ScheduleCall,
  JetCharter. Chacun = uniquement logic métier + form fields. Tweak
  shell propage 5×.
- Submit buttons → brand arrow ↗ partout (au lieu de → générique)
- Lenis smooth scroll dans RootLayout via useSmoothScroll. 1.1s ease-out-
  expo. Respect prefers-reduced-motion. ~3KB

### Vague 4 — Reveal stagger sur 8 listings

**`b4067b0` feat(motion): scroll-reveal stagger sur 8 listings (Phase 3)**
- new src/hooks/useReveal.ts (IntersectionObserver, respect prefers-
  reduced-motion)
- new src/components/ui/Reveal.tsx (wrapper avec index/stagger props)
- CSS [data-reveal] states (--ease-luxe + --duration-slow + --reveal-y-md)
- Wrap 8 listings : AccountCatalogue, Properties, Timepieces, Artworks,
  Events, Journeys, Concierge, News. Cards stagger 60ms cap 600ms

### Vague 5 — View transitions + magnetic hover

**`dbf22fb` feat(motion): view-transitions native inter-pages (Phase 4)**
- Card atom `<Link viewTransition>` (React Router 7 native — initial)
- CSS `::view-transition-old/new(root)` tuned avec --ease-luxe

**`24e41e3` feat(motion): magnetic hover sur CTAs critiques (Phase 5)**
- new src/hooks/useMagneticHover.ts — pointermove + rAF throttle, skip
  touch + reduced-motion
- new src/components/ui/MagneticHover.tsx (wrapper inline-block)
- Applied sur 4 mini-shortcuts AccountDashboard

### Vague 6 — Fix Lenis app-level + BrandLink + MotionShowcase

**`c869ffb` fix(motion): Lenis app-level + <BrandLink> + /motion showcase**
- Owner test 22:00 — Lenis ne tournait PAS sur /motion (mounted dans
  RootLayout qui couvre seulement /:locale/*). View-transitions ignoré
  silencieusement parce que legacy <BrowserRouter> ne support pas la
  prop viewTransition (data router seulement).
- Move useSmoothScroll → App.tsx (tourne sur TOUS les routes)
- new src/components/ui/BrandLink.tsx — Link wrapper qui intercept click
  et call document.startViewTransition() manuellement. Bypass legacy
  BrowserRouter limitation. Graceful fallback (Firefox / Safari <18 →
  instant nav). Skip modifier-clicks (open new tab natif).
- Card.tsx swap <Link> → <BrandLink>
- new /motion route showcase Phase 1-5 (no layout, no locale) — sections
  grain / Lenis / reveal stagger / view-transitions / magnetic hover
- View-transition duration 500ms → **1600ms**, easing **cubic-bezier(0.83,
  0, 0.17, 1)** ease-in-out-quart "lent-vite-lent" owner validated 22:06

## Décisions taken

1. **Light = thème principal** (override system preference). Dark reste
   accessible via toggle. ThemeContext default 'light'.
2. **bg #bcbcbc charcoal #2a2a2a** soft contrast ~8:1 — confort lecture
   sans contraste yeux-qui-brûlent
3. **Geist + Geist Mono Variable** via `geist` package Vercel, self-host
   public/fonts/, NEVER fontsource subset (piège U+2197)
4. **`<BrandMark />` = règle absolue** (owner 21:10) — jamais hand-roll
   SAW↗NEXT, toujours via composant. ARROW_OFFSET -0.09em.
5. **h1-h6 default Geist Mono bold uppercase** via @layer base — "le logo
   est la base des titres"
6. **`<RequestDrawerShell />` = canonical chrome drawer** — 5 drawers
   refactored. Tweak shell propage 5×.
7. **`<BrandLink />` = canonical Link** pour pages devant view-transitions
   (bypass legacy BrowserRouter limitation). Card.tsx l'utilise auto.
8. **Motion-token discipline** : tweak 1 endroit (--grain-opacity,
   --grain-blend, ARROW_OFFSET, --duration-*, etc.) propage globalement
9. **Submit buttons ↗** (brand arrow) au lieu de → générique partout
10. **View-transition 1600ms ease-in-out-quart** — owner validated le
    "lent-vite-lent" rhythm

## Frictions

1. **Fontsource subset latin omet U+2197 (↗)** — initial install
   `@fontsource-variable/geist-mono` semblait OK mais le ↗ tombait en
   fallback. ~20 min perdues à diagnostiquer avant de switcher au
   package `geist` Vercel full-glyph.
   → friction : `frictions/2026-05-12-fontsource-geist-arrow-subset.md`
   (à écrire en suite si encore d'autres claudes touchent à Geist)
2. **Tokens `--font-family-*` legacy Tailwind 3** ne mappaient pas sur
   `font-sans` / `font-mono` Tailwind 4 — silent fallback ui-monospace
   pendant des semaines. Fix : rename `--font-*` namespace.
3. **z-index -1 + mix-blend-mode** — initial grain à z-index -1 pour ne
   pas écraser le texte, mais mix-blend-mode n'avait rien à blender (sans
   stacking context). Repasse à z-index 9998 + mix-blend multiply qui
   darken le texte charcoal de façon minimale.
4. **Legacy <BrowserRouter> ignore `viewTransition` prop** — silence,
   pas d'erreur. Diagnostiqué via search dans node_modules. Workaround =
   <BrandLink /> avec manual document.startViewTransition().
5. **Lenis mounted dans RootLayout** ne couvre pas top-level routes
   (/motion, /logo). Fix : move to App.tsx.
6. **Linter strict** — `@typescript-eslint/no-floating-promises` flag le
   navigate() retour (Promise type même en BrowserRouter). Fix : `void
   navigate(to)`. + `max-lines-per-function 150` sur MotionShowcase (154
   lines) → eslint-disable-next-line ciblé.

## Ce qui reste ouvert

- **View-transition image morph Card.Media → DetailHero** : skipped cette
  passe (aspect ratios divergent 4:3 vs hero wider, morph pourrait
  rendre étrange). Polish post-démo si owner valide direction.
- **Magnetic hover sur autres CTAs critiques** : submit buttons drawers,
  ConciergeCard, hero CTAs. Pattern réutilisable via `<MagneticHover />`,
  propagation post-validation.
- **Sidebars `AppLayout` + `AdminLayout` logo** : pas de `<BrandMark />`
  en top pour l'instant. Sur mobile auth le Header est masqué → drawer
  ouvert pourrait montrer le logo. Polish post-démo.
- **Login.tsx + Onboarding.tsx hero brand** : pas de `<BrandMark />` en
  grand. Pourrait être un Apple-tier first impression sur /login.
- **Wizard ConciergeRequestWizard** : encore modal centré 4-step. Owner
  dit "réutiliser le système drawer pour le reste des formulaires" —
  ambigu si inclut le wizard. À clarifier.
- **`pnpm validate` full pipeline** : tourne actuellement (background).
  Si typecheck ou tests échouent, à fixer avant merge.
- **Branch merge** : `feat/brand-identity-foundation` (7 commits). Owner
  décide merge dans main + tag v0.5.0 "Brand identity + motion stack".

## RELEASE CHECK

```
RELEASE CHECK:
- Commits depuis dernière release : 7 (tous sur feat/brand-identity-
  foundation, pas mergée)
- Types : feat × 5 (brand foundation, BrandMark, light+grain+mono,
                    drawer unify+Lenis, motion phases 3-5) ·
          fix × 1 (Lenis app-level + BrandLink) ·
          chore × 0
- Recommandation : **release v0.5.0 "Brand identity + motion stack"
  après owner GO merge dans main**
- Raison : milestone visuel majeur cohérent, démontrable bout-en-bout
  via /motion + /logo + /fr/account. SAW↗NEXT identity verrouillée
  (component canonical + règle absolue mémoire). Light theme premier
  + grain 35mm vivant + Lenis smooth scroll + 8 listings reveal stagger
  + 5 drawers unifiés + view-transitions luxe 1600ms + magnetic hover.
  Backend Supabase + Resend déjà OK (lot A.5/A.6 2026-05-11). Branch
  démontrable client demain.
- Push state : commits locaux uniquement, branch pas pushée
- Next milestone : owner GO merge + v0.5.0 → propager motion
  (magnetic + reveal) sur surfaces restantes + image morph polish +
  Login/Onboarding hero brand
```

## Cross-refs

- Branche : `feat/brand-identity-foundation` (7 commits depuis main)
- Brand decision : `decisions/2026-05-12-brand-identity-saw-next.md` (#p0)
- Logo preview : route `/logo`
- Motion showcase : route `/motion`
- Composants nouveaux : `BrandMark`, `BrandLink`, `Reveal`,
  `MagneticHover`, `RequestDrawerShell`
- Hooks nouveaux : `useReveal`, `useMagneticHover`
- Tokens nouveaux : `--font-sans/mono`, `--ease-luxe/spring/glide`,
  `--duration-instant→glacier`, `--blur-glass-*`, `--reveal-y-*`,
  `--stagger-*`, `--grain-opacity/size/blend`
- Mass replace : font-light → font-mono font-bold uppercase (17 fichiers)
