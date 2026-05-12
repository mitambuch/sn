---
id: 2026-05-13-0050-landing-iteration-marathon
date: 2026-05-13
type: session
tags: [#design, #workflow, #client-specific, #active, #p0]
scope: client-specific
status: active
---

# Session — Landing public iteration marathon (22:44 → 00:50)

Suite directe du journal
[`2026-05-12-2300-landing-spine.md`](2026-05-12-2300-landing-spine.md)
(round 1 / spine baseline commit ed87d4d). 12 rounds d'itération
serrée avec owner en mode preview-feedback rapide. Branche
`feat/landing-public` à `1e0b41e` au handoff.

## Format de la session

Owner en preview-feedback loop. Chaque tour : owner regarde /fr,
liste des frictions précises, je code-commit-push, owner re-preview.
Cadence ~10 min par round, owner late-night très critique mais
concret. Anti-complaisance respectée : zéro discussion, exécution
immédiate sur chaque pointage.

## Rounds shippés cette session

| # | Commit | Sujet |
|---|---|---|
| 1 | ed87d4d | Spine baseline (Hero / Présentation / Access / Interlocuteur / Footer + TerminalBar + IndexOverlay) — journal 2200 |
| 2 | 12198fd | Card/Button atoms, drawer wiring, S05 Domaines |
| 3 | 047ea43 | Immersion (line reveal hero) + Principles S04 + breathing footer wordmark + non-sticky terminal |
| 4 | f6b1088 | Manifesto S02 (300vh) + Principles V2 blur-hover + Presentation visible (useReveal cassait) + dark-section IO chrome inversion |
| 5 | d66f574 | Tokens --color-ink #0a0a0a + Presentation extended copy 7 paragraphes + triptyque Card + Access h2 calmer + useLandingData hook |
| 6 | d9c73d0 | Single black --color-fg #0a0a0a + manifesto random-grid mots dispersés + grain on dark (screen mix-blend) + logo morph SAW↗NEXT ↔ S↗N + chrome clearance |
| 7 | 9f5713d | Sticky pin Presentation + Method.tsx (S03b) monumental display + dense paragraphs + Manifesto watermark numéro géant |
| 8 | ddd16ae | Manifesto pool 6/3 random + centered + glow hover + Method.tsx supprimé (intégré Presentation) + Hero side-mark vire + overflow-x-clip main |
| 8.5 | bb59829 | Presentation triptyque dans col 3 du body (à côté paragraphes) |
| 8.6 | 68f8a24 | Presentation body 2-col mirror header (triptyque aligne sous lead) |
| 9 | 36874b0 | Access secondary panel OUT + --color-accent ink + Presentation 3-col reverted + Manifesto fog .lines arrays + indentations par phrase |
| 10 | 2b9f495 | Triptyque même largeur que lead (sub-grid 180px+1fr dans col gauche, triptyque col droite) + Manifesto overflow-hidden retiré (sticky restauré) |
| 11 | 166d92f | Manifesto fog AU-DESSUS du texte mix-blend lighten + organic exit fumée + softer white (text-on-ink/85 → /70) |
| 12 | 4f6b7ba | Text illumination 3-layer text-shadow + fog edges plus doux (140px blur) + VISIBLE_BANDS dwell entre phrases |
| 13 | 1e0b41e | Hero video bg Cloudinary (6 URLs, random pick lazy useState) + headline font-bold no-italic mix-blend-difference text-white + cycling 6.5s + marquee bold + slower 80s |

13 commits. Branche pushed sur `origin/feat/landing-public`.

## Décisions clés prises

### Tokens & palette (round 6 + round 9)

- `--color-fg` aligné sur `--color-ink` = `#0a0a0a` (vs charcoal
  `#2a2a2a` historique). Owner : "que un noir". Aligne le text body
  partout sur le même noir que les sections ink.
- `--color-accent` aussi alignée sur `#0a0a0a` (round 9). Le Button
  primary atom utilise `bg-accent` → maintenant matche bg-ink.
- `--color-ink` + `--color-on-ink` tokens dédiés aux surfaces noires
  cinématiques de la landing. Renommage tactique pour distinguer
  surface dark vs text fg (même si valeur identique en light mode).

### Architecture sections

- Layout final 10 sections : Hero S01 / Manifesto S02 (400vh sticky)
  / Presentation S03 (avec method triptyque col droite) / Principles
  S04 (blur-hover) / Domains S05 / Access S08 (drawer) / Interlocutor
  S09 / Footer + chrome (TopProgress + IndexOverlay + TerminalBar
  + 4 marquees).
- Method.tsx créé puis supprimé (round 7 → round 8). Triptyque
  vit maintenant DANS Presentation col 3 du body.
- Access secondary panel "Espace privé / Se connecter" supprimé
  round 9. Le seul accès privé reste via TerminalBar bottom +
  IndexOverlay CTAs.

### Manifesto pattern (réinventé 4 fois)

Owner a poussé pour itérer ce module 4x dans la session :
- V1 (round 4) : centered phrases stack + scroll progress
- V2 (round 6) : random-grid 12-cols word constellation avec
  placements explicites par mot
- V3 (round 7) : ajout numéro géant Pentagram-style watermark
- V4 (round 8) : pool 6 phrases / 3 random / centered same-size
- V5 (rounds 9-12) : lines arrays per phrase + indentations par
  phrase + cinema fog (back + front mix-blend lighten layers) +
  illumination text-shadow 3-couches + VISIBLE_BANDS dwell.

État final : 6 phrases dans pool i18n (FR + EN), 3 random pick par
session via Fisher-Yates au mount, chaque phrase = 1-3 lignes avec
`PHRASE_LAYOUTS` margin-left % score par ligne, scroll-driven via
`VISIBLE_BANDS` (gaps entre phrases pour respiration fog), texte
illuminé par 3-layer text-shadow halo, fog back + front animated
(4 blobs total, durations 22/28/32/38s, scale modulations 0.9-1.15
pour motion organique), exit asymétrique entrance 1800ms / exit
2400ms blur 16px.

### Hero pattern (round 13)

- 6 vidéos Cloudinary, random pick au mount via useState lazy init
  (useMemo violerait react-hooks/purity car Math.random impure).
- `<video autoplay loop muted playsInline>` en `-z-10 absolute
  inset-0 object-cover`. Mask-image fade vers le bas pour préserver
  lisibilité du bottom meta strip.
- Section `relative isolate` pour stacking context propre.
- h1 `mix-blend-mode: difference` + `text-white` + `font-bold` →
  texte en pur négatif sur la vidéo, lisibilité auto selon
  luminance.
- Cycling word 4s → 6.5s. Toujours non-italic, all 3 lines bold
  aligned (drop pl-[18%] + italic ligne 3 du mockup).

### TerminalBar / Marquee

- TerminalBar : sticky → fixed → sticky → relative (mode footer).
  Final = relative en dernier enfant de main (round 6).
- Marquee durationSec 50s → 80s (round 13). font-bold (round 13).

## Effets / motions implémentés

| Element | Effet |
|---|---|
| Hero headline | Stagger reveal 3 lignes (.hero-line .1/.2/.3 + animation-delay 0.2/0.4/0.6s, opacity 0→1 + translate-y 40 + blur 8→0). Cycling word 6.5s par mot (4 mots). |
| Hero | mix-blend-difference text-white sur video Cloudinary autoplay |
| Manifesto | fog back (2 blobs, 22s/28s, 140px blur) + fog front (2 blobs, 32s/38s, blur 70px, mix-blend lighten, opacity 0.55) + text-shadow 3-layer illumination + entrance/exit asymétrique (1800/2400ms) + VISIBLE_BANDS dwell |
| Principles | IO sync + hover blur reveal (texte blur 4px par défaut, sharp au hover/scroll-active) |
| Domains | Hover/focus item → preview Card swap |
| Footer wordmark | useReveal scroll-in + wordmark-breathe (letter-spacing 6s loop) |
| TerminalBar | live time CH/CET refresh 1s + status dot terminal-pulse 1.4s + marquee 50s (now 80s) |
| TopProgress | Scroll-position-driven width % |
| IndexOverlay | Slide-down 500ms cubic-bezier(0.7,0,0.3,1) |
| TopCornerChrome | dark-section IO toggle (BrandMark + INDEX button inversent text-fg ↔ text-bg) + logo morph SAW↗NEXT ↔ S↗N au scroll (threshold 220px, cross-fade 500ms) |

## Tokens / animations ajoutés

`.claude/memory/decisions/` à écrire post-mortem :
- `--color-ink` + `--color-on-ink` tokens
- `@keyframes hero-line-reveal` / `cycling-word` / `terminal-pulse`
  / `wordmark-breathe` / `side-mark-drift` (retirée round 8) /
  `manifesto-fog-a/b/c/d` / `[data-landing-dark]::after grain`
- `.manifesto-fog` / `.manifesto-fog-top` / `.manifesto-phrase-lit`
- `.hero-line` + `.hero-line-1/2/3` delay
- `--color-accent` aligné #0a0a0a (single black across)

## Ce qui reste pour demain matin (avant livraison client)

### HIGH

- Owner preview round 13 (vidéo Cloudinary + mix-blend headline +
  marquee bold/slow). Si la vidéo passe pas autoplay sur certains
  navigateurs (Safari iOS strict mode), fallback poster image
  nécessaire.
- Polish final : test mobile sur 320px, 375px, 414px viewports
  réels. Plusieurs sections ont `md:` sticky qui drop sur mobile
  mais Manifesto reste 400vh sur mobile aussi (peut être long).
- EN locale brand-voice : raffinement des traductions sommaires.
  Plusieurs strings sont littérales (Hero/Presentation/Manifesto).
- Sanity : créer `interlocutor` singleton + migrer Salva static
  depuis Interlocutor.tsx → CMS. Pareil pour le ticker
  TerminalBar (siteSettings).

### MEDIUM

- S06 Expériences (encore absent) : à câbler avec schéma Sanity
  `experience` + 3 cards saison. Owner doit fournir contenu.
- S07 Manifesto II (encore absent du mockup mais owner peut le
  vouloir si on suit le mockup à la lettre).
- Validation full `pnpm validate` (pas seulement :fast) avant
  release pour catch build issues.
- Tag v0.6.0 + memory-record-release.

### LOW

- Warnings IDE Tailwind canonical (duration-[Xms] → duration-X,
  blur-[8px] → blur-sm, tracking-[0.1em] → tracking-widest). Non-
  bloquant mais cleanup possible.
- Move docs/landing-mockup-v5.html → archived ou .gitignored selon
  rétention voulue (était public/ initialement).
- Le top corner chrome BrandMark variant="full" sizer invisible est
  un hack pour preserver la largeur — pourrait être remplacé par
  un width fixe en clamp.

## RELEASE CHECK

```
Commits depuis dernière release (v0.5.0) :
  - sur main : aucun (rien mergé depuis le 2026-05-12 brand stack)
  - sur feat/next-iteration : 1 (preloader baseline, pas mergé)
  - sur feat/landing-public : 13 (cette session, pas mergé)
Types : feat(landing) × 1, fix(landing) × 12
Validate pipeline : ✅ validate:fast vert exit 0 (1e0b41e)
Recommandation : WAIT — pas de tag ce soir.
Raison : la landing est encore en preview-feedback loop owner. La
  démo client matin est dans ~9h, owner va re-preview round 13
  (video bg) dès le réveil. Tag v0.6.0 mieux placé demain matin
  après dernier polish + EN trad + full validate (pas juste :fast).
  Push current state safe (zéro perte branche pushed).
Next milestone : v0.6.0 "Landing publique cinéma + manifesto" target
  2026-05-13 matin avant livraison client.
Push state : feat/landing-public à 1e0b41e pushed sur origin.
  feat/next-iteration (preloader baseline) toujours pushed.
  main à v0.5.0 brand identity stack inchangée.
```

## Cross-refs

- Journal initial spine : `sessions/2026-05-12-2300-landing-spine.md`
- Brand identity : `decisions/2026-05-12-brand-identity-saw-next.md`
- Mockup référence : `docs/landing-mockup-v5.html`
- Branche : `feat/landing-public` à `1e0b41e`
- Composants nouveaux session : Manifesto, Principles, Domains,
  TopCornerChrome (extracted from Home)
- Composant supprimé : Method.tsx (intégré dans Presentation col 3)
- Hook nouveau : useLandingData
- Tokens nouveaux : --color-ink, --color-on-ink
- Keyframes/utilities nouveaux : terminal-pulse, cycling-word,
  hero-line-reveal, wordmark-breathe, side-mark-drift (retirée),
  manifesto-fog-a/b/c/d, manifesto-phrase-lit, grain dark-section
  ::after
- Memory state : 103 entries après ce journal

## Note pour réveil

Round 13 = vidéo Cloudinary autoplay + mix-blend-difference + bold
marquee. Owner a dit "on finira demain". S'il dit "c'est bon" demain,
on tag v0.6.0 + on merge sur main. Sinon nouveau cycle preview-fix.
La branche compile, lint, types vert. Dev server :5174 toujours up
(background process). Reload /fr pour preview state final 1e0b41e.
