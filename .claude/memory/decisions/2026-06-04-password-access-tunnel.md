---
id: password-access-tunnel
date: 2026-06-04
type: decision
tags: [#auth, #security, #decision, #client-specific, #p1]
scope: client-specific
status: active
supersedes: atomic-redemption-rpc
---

# Tunnel d'accès basé mot de passe (remplace le lien magique)

L'owner (2026-06-04) : le tunnel de connexion était « brouillon », même lui ne
le comprenait pas. Trois défauts réels, pas un ressenti :

1. **Domaine faux dans l'email** — l'email d'acceptation pointait vers
   `sawnext.ch` (sans tiret) alors que le domaine configuré partout (Resend,
   canonical CI `VITE_APP_URL`) est **`saw-next.ch`** (avec tiret). Le lien
   tombait sur une page Vercel. Owner a tranché : canonique = `saw-next.ch`.
2. **Aucun mot de passe** — login 100 % lien magique. Le mode « email + mot de
   passe » était mort (personne n'en créait jamais). Onboarding forçait à
   re-saisir le code après un **2e** email.
3. **Deux UIs de login** divergentes (`Login.tsx` page + `LoginModal.tsx`).

## Décision

Tunnel **mot de passe** standard, en un seul flux :

- Email d'acceptation (1 seul) → `saw-next.ch/fr/login`.
- « Première connexion » : email + code + nom + mot de passe + confirmation →
  `registerWithCode` (verify code RPC → `signUp` avec password → `redeem` code).
  Compte créé + connecté **immédiatement**, pas de 2e email.
- « Email + mot de passe » pour le retour + « Mot de passe oublié » →
  `requestPasswordReset` → page `/reset-password` → `updatePassword`.
- Onboarding réduit à un **écran de bienvenue** unique (code déjà consommé).

CHALLENGE émis et validé GO-BUT : le lien magique est plus simple/sûr en
absolu, mais la vraie douleur (double-email + double-code) est supprimée par le
mot de passe, qui donne le login réutilisable attendu.

## Dépendances critiques (côté owner, pas du code)

- **Supabase Auth → "Confirm email" = OFF** : le code prouve déjà l'adresse.
  Sans ça, `signUp` renvoie zéro session → on retombe sur un email de confirm
  (et le code reste non consommé). Le code gère le cas gracieusement
  (`needsEmailConfirm` → panneau « vérifiez votre email »).
- **Supabase Auth → Site URL = `https://saw-next.ch`** + Redirect URLs
  allowlist `https://saw-next.ch/**`.
- **`VITE_APP_URL=https://saw-next.ch`** dans l'env de déploiement prod
  (Vercel/Netlify), pas seulement en CI — sinon les emails reset/confirm
  repointent vers localhost. Tous les redirects email sont construits depuis
  `env.APP_URL`, jamais `window.location.origin` (qui fuit l'hôte preview).

## Sécurité — note de durcissement futur

`invitation_codes` n'est pas lié à l'email du demandeur. Comme avant, un code
fuité + un email arbitraire permet de créer un compte. Pas une régression (le
flux magic-link avait le même trou). Durcissement possible : lier le code à
`access_requests.email`. Voir [[atomic-redemption-rpc]].

## Cross-refs

- Pattern d'implémentation : [[shared-panel-two-shells]]
- Friction de validation : [[vitest-coverage-testtimeout-flake]]
- Migration email : `supabase/migrations/0021_notify_access_accepted.sql`
