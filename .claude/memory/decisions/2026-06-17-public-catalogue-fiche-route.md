---
id: public-catalogue-fiche-route
date: 2026-06-17
type: decision
tags: [#routing, #sanity, #security, #content, #decision, #client-specific]
scope: client-specific
status: active
---

# Fiche produit publique `/c/:type/:id` pour les docs `visibility: public`

## Contexte

Sur l'accueil, le teaser « 08.A Aperçu du catalogue » ([[Access.tsx]]) rendait
les vrais items publics en `<button>` ouvrant le **formulaire de demande
d'accès** — on ne pouvait pas voir le produit. Owner (2026-06-17) : « les
articles du catalogue il faut qu'on puisse ouvrir les fiches produit et les
voir ». Choix owner explicite (AskUserQuestion) = **vignettes accueil public**,
pas l'espace membre.

## Décision

Un doc tagué `visibility: public` est **consultable publiquement**, pas
seulement aguiché. La fiche s'ouvre en **popup modale au-dessus de la landing**
(owner 2026-06-17 soir : « en mode popup devant le site, pas une page
distincte »), lecture seule, réutilisant le langage visuel de `/share`. Les
vignettes réelles du teaser sont des `<button>` qui ouvrent la modale ; les
cadenas restent sur demande d'accès.

**Direction initiale (révisée le même soir)** : d'abord livré comme page/route
`/c/:type/:id`, puis basculé en modale à la demande de l'owner → pattern
[[shared-panel-two-shells]] (panel sans chrome + coque). La route a été
supprimée (le partage de fiche reste couvert par `/share/:code`).

Le catalogue **membre** gated (`FEATURES.catalogueLive: false`) reste inchangé.

## Frontière de discrétion (HNW)

La fiche publique montre l'**appétit** (image, titre, résumé, description,
date/lieu pour les events, galerie) + CTA « demander un accès ». Elle n'expose
**jamais** le prix, le specsheet complet, la provenance — ça reste derrière
l'accès. Cette frontière est **côté données** (GROQ whitelist), pas côté UI :
voir [[public-route-whitelist-projection]] — la 1re version réutilisait la
projection `/share` avec son `...` brut et fuyait tout le doc dans le payload
(attrapé en revue sécurité avant livraison).

## Implémentation

- `GROQ_PUBLIC_FICHE` (durci `visibility == "public"` + projection whitelist).
- Action serveur Netlify `publicFiche` (non authentifiée, validée `isModuleKey`
  + `DOC_ID_RE` avant interpolation GROQ — même garde que l'action `item`).
- Hook `usePublicFiche` (gate-aware + fallback mock dev offline, jamais en prod).
- `PublicFichePanel` (corps de fiche, champs vides masqués, CTA bas) + coque
  `PublicFicheModal` (Modal existant). `Access.tsx` ouvre la popup via state.

## Fichiers

`src/features/landing/PublicFichePanel.tsx`,
`src/features/landing/PublicFicheModal.tsx`,
`src/features/landing/usePublicFiche.ts`,
`src/lib/sanityQueries.ts` (GROQ_PUBLIC_FICHE + PUBLIC_FICHE_PROJECTION),
`src/lib/sanityGate.ts` (gatePublicFiche), `netlify/functions/catalogue.mts`,
`src/features/landing/Access.tsx`.
