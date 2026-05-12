---
id: 2026-05-13-0106-landing-final-typewriter-merge
date: 2026-05-13
type: session
tags: [#design, #workflow, #client-specific, #active, #p0, #release]
scope: client-specific
status: active
---

# Session addendum — Hero typewriter final + merge sur main (00:50 → 01:08)

Suite directe du journal
[`2026-05-13-0050-landing-iteration-marathon.md`](2026-05-13-0050-landing-iteration-marathon.md).
Ce journal couvrait jusqu'au commit `1e0b41e`. Cet addendum capture
les 5 derniers commits + le merge sur `main` jusqu'au handoff dodo.

## Commits post-journal

| Commit | Sujet |
|---|---|
| `2ead3fb` | hero font-bold → font-medium (owner : "le bold sur tout c'est horrible") + TopCornerChrome mix-blend-difference universel + darkActive state/IO retiré (rendu inutile par mix-blend auto-adapt) |
| `6da8476` | Hero video mask `black 65%` → `black 88%` : la vidéo descend jusqu'à 88% au lieu de s'arrêter à 65%, fade-to-bg gardé sur les 12% du bas pour le strip |
| `9be7083` | Top GPS strip (46.50° N, 6.83° E / Boudry / NE) passe en négatif : mix-blend-difference + text-white + border-white + bg-white dot. Cohérent avec headline + TopCornerChrome |
| `721ae87` | Hero typewriter v1 : 8 phrases brand, type 60ms → hold 2.4s → erase 32ms → next, caret ▎ blinking, video swap random à chaque phrase change |
| `6e88daf` | Hero typewriter v2 (FINAL) : 1 mot key par phrase en mix-blend-difference (rest plain white), top GPS déplacé en bas (tout le meta groupé), mask-image bottom fade retiré → overlay `bg-black/35` pour assombrir vidéo, type 90ms / hold 4.5s / erase 50ms (slower), text-balance + max-w-5xl pour 2 lignes naturelles |
| `c5a8f2c` | **MERGE no-ff feat/landing-public → main**. 17 commits intégrés. Pushed origin/main |

## État du Hero final (au handoff)

### Typewriter

- 8 phrases dans `landing.hero.cyclePhrases.{cp1..cp8}` structurées
  en `{before, highlight, after}` :
  - cp1 conciergerie / cp2 Bespoke / cp3 cooptation / cp4 portes /
    cp5 exigence / cp6 vitrine / cp7 restreint / cp8 patience
- State machine 3 phases : typing 90ms/char → holding 4500ms →
  erasing 50ms/char → next phrase + new random video.
- Tous setState routés via setTimeout (React 19 strict
  react-hooks/set-state-in-effect compliance).
- `TypewriterRender` component slice le texte en 3 segments,
  applique `mixBlendMode: 'difference'` uniquement sur le segment
  `highlight`.
- Caret `▎` avec class `.caret-blink` (1s steps).

### Video

- 6 URLs Cloudinary dans `HERO_VIDEOS`.
- Random pick au mount via `useState` lazy init (react-hooks/purity
  safe).
- `useEffect` sur `phraseIdx` → setVideoSrc nouveau random à chaque
  phrase change.
- `isInitialMount` ref évite swap inutile à la première mount.
- Full height object-cover, `-z-20`. Pas de mask bottom fade.

### Overlay

- `bg-black/35` en absolute inset-0 `-z-10` au-dessus de la vidéo.
  Assombrit la vidéo de 35% → texte blanc lisible partout.

### Layout

- Section `relative isolate flex flex-col`.
- Center : typewriter h1 only (flex-1 items-center).
  - clamp(2rem, 5.5vw, 5.5rem), text-balance, max-w-5xl, leading
    [1.15], font-medium, text-white, uppercase.
- Bottom strip : GPS row + 3-col meta (structure dl / champ
  d'action / CTAs) — tout groupé en bas, plus rien en haut.
- Bottom meta passes en white-on-darkened-video : text-white,
  text-white/60, text-white/85, border-white/20-25.
- mix-blend-difference scoped : highlight word + top corner chrome
  (BrandMark + INDEX). Le bottom strip est en plain white (lisibilité
  sur overlay sombre).

### Mobile

- text-balance fonctionne sur tous les viewports.
- Bottom strip : grid 1-col mobile / 3-col desktop.
- Cards CTA en `hidden md:flex` (CTAs cachés mobile, TerminalBar
  bottom sticky garde la conversion accessible).
- Vidéo Cloudinary autoplay nécessite muted+playsInline (✓).

## Merge sur main

Merge no-ff propre, zéro conflit. 17 commits feat/fix intégrés
depuis la dernière release v0.5.0 (commit 532f1ec brand identity
foundation). `c5a8f2c` pushed sur `origin/main`.

`feat/landing-public` à `6e88daf` reste pushed sur origin (peut
être supprimée après tag, ou gardée pour suite preloader / next-
iteration).

`feat/next-iteration` (preloader baseline `b5f2e12`) toujours
pushed, indépendante.

## RELEASE CHECK FINAL

```
Commits sur main depuis v0.5.0 : 17
  - 16 feat/fix(landing) cette session marathon
  - 1 chore(release) merge
Validate pipeline : ✅ validate:fast vert au dernier commit
  (6e88daf), merge clean sur main.
Recommandation : WAIT (tag demain matin par owner).
Raison : la landing est mergée et déployable mais owner doit
  preview production matin avant tag v0.6.0 + polish mobile +
  EN brand-voice + Sanity interlocutor migration.
Next milestone : v0.6.0 "Landing publique cinéma + manifesto"
  target 2026-05-13 matin avant livraison client.
Push state final :
  - main : c5a8f2c pushed
  - feat/landing-public : 6e88daf pushed (à supprimer après tag
    OU à garder pour suite)
  - feat/next-iteration : b5f2e12 pushed (preloader, indép)
```

## Cross-refs

- Journal principal : `sessions/2026-05-13-0050-landing-iteration-marathon.md`
- Journal initial : `sessions/2026-05-12-2300-landing-spine.md`
- Brand identity : `decisions/2026-05-12-brand-identity-saw-next.md`
- Mockup référence : `docs/landing-mockup-v5.html`
- Branche merged sur main : `feat/landing-public` à `6e88daf`
- Commit merge : `c5a8f2c`
- Memory state : 104 entries après ce journal
