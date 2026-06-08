---
id: catalogue-holding-state-flag
date: 2026-06-08
type: decision
tags: [#content, #routing, #decision, #client-specific, #p1]
scope: client-specific
status: active
---

# Catalogue masqué derrière un flag « espace en préparation »

## Contexte

Un vrai client s'est inscrit sur le site live. À la connexion, l'espace membre
sert encore **100 % de données mock** : faux produits (montres, propriétés,
œuvres…), faux comptes à rebours « offre limitée » codés en dur, et un contact
concierge placeholder (`valmont@sawnext.studio` + faux numéro). Pour une marque
HNW « retenue suisse-bancaire », c'est pire qu'un espace vide. Les fiches ne sont
pas encore content-complete → brancher du vrai n'est pas possible maintenant.

Owner a tranché (via question directe) : **« espace en préparation »** plutôt
que nettoyage cosmétique ou wiring de contenu pas prêt.

## Décision

Un **flag unique** `FEATURES.catalogueLive` (`src/config/features.ts`, typé
`boolean` pour calmer `no-unnecessary-condition`), à `false`. Tant qu'il est
false, toutes les surfaces mock-backed sont masquées :

- **Nav** (sidebar `AppLayout` + bottom `AppBottomNav`) : réduite à Accueil ·
  Demandes · Profil · Préférences. Modules + « Tout » + « Ma collection »
  retirés. Le FAB reste centré (grille 5-col paddée).
- **Routes** (`app/routes/index.tsx`) : catalogue/news/saved + toutes les
  list+detail modules → redirect `/account` via helper `gated()` + `ToAccountHome`.
  L'élément gated n'est jamais monté → le chunk lazy n'est pas fetché.
- **Dashboard** : état d'attente = greeting + canal de demande live (wizard →
  inquiry → email Salva) + notice `account.preparing.*`. La vitrine « offres
  exclusives » et le bloc concierge placeholder sont **droppés** (full dashboard
  conservé sous le `if`, restauré quand le flag passe true).
- **CommandPalette** (Cmd+K) démontée — elle n'indexe que les produits mock.
- Copy `preparing.*` ajoutée FR + EN.

## Pourquoi un flag et pas une suppression

Réversible en une ligne. Quand le contenu Sanity réel est prêt, on passe le flag
à `true` **en même temps** qu'on merge la branche `fix/catalogue-studio-content-model`
(les 7 detail pages crash-safe) → le catalogue est réel dès le premier clic.
Cf [[catalogue-triple-model-divergence]].

## Hors scope (volontaire)

- Le **vrai contact concierge** (nom + email + téléphone) reste à fournir par
  l'owner — `siteConfig.email/phone` sont vides ; le nom « Valmont Seragone Mato »
  est un placeholder. Le bloc concierge est retiré de l'état d'attente plutôt que
  d'afficher du faux.
- L'admin (back-office Salva) n'est **pas** touché — il doit préparer le contenu.
- Le **gate d'approbation** est inchangé : demande d'accès → Salva accepte →
  code d'invitation → registerWithCode. Personne ne s'auto-inscrit sans code.
  Cf [[password-access-tunnel]].

## Cross-refs

- Branche : `feat/member-holding-state`, commit `18a1179` (non mergé).
- Friction parente : [[catalogue-triple-model-divergence]]
- Tunnel d'accès : [[password-access-tunnel]]
