---
id: 2026-05-12-2200-preloader-baseline-addendum
date: 2026-05-12
type: session
tags: [#design, #workflow, #client-specific, #active, #p0]
scope: client-specific
status: active
---

# Session addendum — Brand preloader baseline (22:00 → 22:40)

Suite directe de la session
[`2026-05-12-2000-design-night-motion-stack.md`](2026-05-12-2000-design-night-motion-stack.md).
Le journal principal a été écrit vers 22:10 — ce qui suit est arrivé
après et complète le contexte avant transition vers une nouvelle
conversation Claude (owner pivot 22:38 pour éviter context fantôme).

## Ce qui a été shippé après 22:00

### Push + merge feat/brand-identity-foundation

- `git push -u origin feat/brand-identity-foundation`
- `git checkout main && git pull` → up to date
- `git merge --no-ff feat/brand-identity-foundation` →
  commit `532f1ec` (chore(release): merge feat/brand-identity-foundation)
- `git push origin main` → toute la session 1-5 + brand identity live sur
  origin/main
- `git checkout -b feat/next-iteration` → nouvelle branche pour la suite

### Preloader baseline (commit `b5f2e12` sur feat/next-iteration)

Owner direction 22:20 :
> "il nous faut un chargement [...] le sawnext s'écrivait depuis les bords
> et après il se remplissait [...] une barre de chargement il faut que ça
> dure 5 secondes minium [...] des textes des trucs qui souhaite la
> bienvenue [...] on entre chez sawnext"

Owner direction 22:25 (après tentative CSS plain) :
> "c'est horrible ahaha faut faire un truc en three.js [...] vraiment que
> ça fasse que le bord des lettres et ça doit être plus lent centré et
> plus immersif"

Owner validation finale 22:33 :
> "ok alors écoute c'est pas trop mal je te donnerais l'effet demain depuis
> le travaille et tu diras à ok c'était ça"

**Implémentation** :

- Install `@react-three/fiber` + `@react-three/drei` + `three` + `opentype.js`
- `src/components/brand/BrandPreloader.tsx` :
  - 4 phases : `draw 4s → fill 1.1s → hold 1.4s → exit 0.8s` (TOTAL 7.3s)
  - Gated par `sessionStorage.__sn_preloader_seen` (one-shot per session)
  - **r3f scene** : `<Canvas>` plein écran + `<Stars>` drei (2600 points
    starfield, count haut pour densité immersive) + slow camera dolly
    `z 6 → 3.5` over duration (sense of entering)
  - **SVG stroke-draw réel** : `opentype.js` charge
    `/fonts/GeistMono-Variable.ttf` à runtime, `font.getPath('SAW↗NEXT')`
    génère le SVG path complet des contours de chaque lettre. Rendu
    `<path stroke-dasharray=1 stroke-dashoffset 1→0>` anim 4s = **vrai
    contour des lettres tracé**, pas un clip-path wipe approximation
  - Phase 'fill' → `fill: transparent → fg + stroke-width 2 → 0`
    (transition 1.1s)
  - **Scale 0.92 → 1 + blur 3px → 0** sur le wrap (zoom-in focus immersif
    sur 5s)
  - Vignette top+bottom + radial glow centered (mix-blend overlay)
  - Welcome copy 2-line : `Ferment privilégié` / `Bienvenue chez`
    (eyebrows), tagline `Conciergerie privée — l'accès est ferment
    privilégié.`
  - Progress bar 0→100 linéaire avec compteur `000 / 100`
  - Respect `prefers-reduced-motion` (initial state `done`, onComplete asap)
- App.tsx — gate sessionStorage + mount sur first visit
- Public TTF Geist Mono Variable (170KB) — opentype.js gère TTF
  natif sans le problème brotli decompression du woff2

## État final repo au moment du handoff (22:38)

- Branch courante : `feat/next-iteration` (1 commit ahead of main)
- `origin/main` : à jour avec toute la session brand + motion (Phase 1-5)
- `origin/feat/brand-identity-foundation` : mergée, archivable
- `origin/feat/next-iteration` : pushed, contient preloader baseline
- `scripts/seed-test-user.js` : dev tool utility créé au seed du user
  `test@sawnext.studio` (Supabase Dashboard manuel via fallback signUp)
  — committé en chore final pour cleanliness

## Ce qui reste ouvert (pour la NEW conversation)

### HIGH — owner doit fournir

1. **Référence preloader exacte** — owner enverra demain depuis le
   travail. Effet stroke-draw qu'il avait sur un autre projet. Baseline
   actuel "pas trop mal" mais à swap. Mécanique probable : path-draw
   plus immersive ou Three.js Text3D extrudé avec animated edges.

2. **Squelette de la landing page** — owner travaille en parallèle sur
   Claude.ai pour produire le skeleton. Va revenir avec structure +
   sections + copy. À implémenter selon ses specs.

### MEDIUM — surfaces non-mergées (post-démo)

- **Image morph view-transition** Card.Media → DetailHero (skipped Phase
  4 parce que aspect ratios divergent 4:3 vs hero wider)
- **Magnetic hover propagation** sur autres CTAs (submit drawers,
  ConciergeCard, hero CTAs, Header logo subtil)
- **Login.tsx + Onboarding.tsx hero brand** — Apple-tier first
  impression sur `/login` avec `<BrandMark className="text-9xl" />`
- **Sidebars logo** AppLayout/AdminLayout (mobile drawer top)
- **5 detail pages restantes** (Property/Artwork/Event/Journey/Concierge/
  News) à aligner sur le pattern TimepieceDetail
- **Wizard ConciergeRequestWizard → drawer pattern** (question ambiguë
  si inclus dans "unification formulaires" owner ask)

### LOW — debt non-urgent

- **`pnpm validate` strict** : passe actuellement avec quelques eslint-
  disable-next-line ciblés sur MotionShowcase + BrandPreloader (max-
  lines-per-function 154 vs 150 et 200+ vs 150). Refactor split possible.
- **Bundle audit** : +200KB (r3f + drei + three + opentype.js) pour le
  preloader. Lazy-import possible (preloader = dynamic chunk) si
  Lighthouse score critique demain.

## RELEASE CHECK

```
Commits depuis dernière release : 9 (5 sur main mergée, 1 sur next-iter)
Validate pipeline : ✅ exit 0 sur tag commit (mémoire INDEX a passé)
Recommandation : tag v0.5.0 "Brand identity + motion stack" sur main
  (commits 106a4a8 → 532f1ec). Preloader baseline reste sur feat/next-
  iteration jusqu'à validation owner demain.
Raison : milestone visuel + identitaire majeur. SAW↗NEXT canonical
  verrouillé + 35mm grain + Lenis + reveal stagger + view-transitions
  luxe + magnetic hover + drawer unification + preloader entry baseline.
Push state : main pushed, feat/next-iteration pushed. Aucune perte
  possible en switchant de conversation.
Next milestone : owner ref preloader + landing skeleton → v0.6.0
  "Landing publique + preloader final" (target 2026-05-13 livraison
  client demain)
```

## Cross-refs

- Journal principal : `sessions/2026-05-12-2000-design-night-motion-stack.md`
- Brand identity decision : `decisions/2026-05-12-brand-identity-saw-next.md`
- Branches : `feat/brand-identity-foundation` (mergée main),
  `feat/next-iteration` (preloader baseline pushed)
- Composants nouveaux session entière : BrandMark, BrandLink, Reveal,
  MagneticHover, RequestDrawerShell, BrandPreloader, MotionShowcase
- Hooks nouveaux : useReveal, useMagneticHover, (useSmoothScroll in App)
- Routes nouvelles : `/logo`, `/motion`
- Memory state : 101 entries (préloader addendum compris)
