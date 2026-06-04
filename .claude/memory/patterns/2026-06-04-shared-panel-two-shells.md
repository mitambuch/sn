---
id: shared-panel-two-shells
date: 2026-06-04
type: pattern
tags: [#auth, #pattern, #client-specific, #p2]
scope: client-specific
status: active
---

# Un panneau partagé, deux coques (page + modale)

## Problème résolu

Le login existait en double : une **page** route `/login` (cible deep-link de
l'email + callback) et une **modale** overlay sur la landing (`LoginModal`).
Deux fichiers avec la même logique → ils dérivent (l'un avait le lien magique,
l'autre une autre variante). C'est une des racines du « brouillon » du tunnel.

## Le pattern

Extraire **toute la logique + le formulaire** dans un composant sans chrome ni
routing — `LoginPanel` — et ne laisser aux deux conteneurs que leur cadre et la
navigation post-action :

```
LoginPanel  → useAuth + état + formulaires + validation
            → props : onRegistered() / onSignedIn() (le conteneur navigue)
            → ZÉRO import de routing, ZÉRO chrome

Login.tsx (page)   = <section plein écran> + X → <LoginPanel/>
LoginModal.tsx     = <Modal> + <LoginPanel/>
```

Résultat : `LoginModal.tsx` passe de ~318 lignes à ~40, `Login.tsx` idem. Le
flux ne peut **plus** diverger — un seul endroit à modifier, deux rendus.

## Quand l'appliquer

- Une même UX doit exister en page ET en overlay/modale.
- Un wizard/formulaire est rendu dans 2+ contextes.

## Anti-patterns à éviter

- Le panneau partagé ne doit PAS naviguer ni connaître ses conteneurs →
  callbacks (`onRegistered`/`onSignedIn`), pas `useNavigate` dedans. Ça garde le
  panneau testable en isolation (mock `useAuth`, assert les callbacks).
- Respecter les frontières d'import : panneau dans `features/`, importe `ui/` +
  `context/`, jamais `pages/`/`app/`.

## Cross-refs

- Décision : [[password-access-tunnel]]
- Fichiers : `src/features/access/LoginPanel.tsx` (+ test), `src/pages/Login.tsx`,
  `src/features/access/LoginModal.tsx`
