---
id: feedback-2026-04-19-regler-pas-signaler
date: 2026-04-19
type: feedback
tags: [#workflow, #feedback, #template, #p0, #active]
scope: template
status: active
---

# Feedback — règle les frictions, ne les signale pas

## Règle

Quand je détecte une friction connue dans le workflow (env vars à
remplir, ordre de commandes sensible, feature théorique qui ne
s'active jamais), je la **règle**. Je ne produis pas une liste de
"conseils" que l'owner doit retenir et exécuter manuellement.

Signaler = demander à l'owner de faire le travail. Si je connais le
problème, j'ai les moyens de le coder. Sinon je suis complaisant.

## Why

2026-04-19 17:42 — à la clôture v6.5, j'ai pondu à l'owner :

> **Ce que je te conseille avant de coder demain** :
> 1. Remplir `.env.local` avec `VITE_SANITY_PROJECT_ID`...
> 2. Lancer `pnpm validate:sanity-content:required`...
> 3. Si tu démarres fatigué, lis `BOOTSTRAP-CLIENT.md` avant...

Et sur le dispatch :

> **Ce qui reste du muscle dormant** — demain si tu as un batch de
> tâches répétitives, force-toi à me dire "dispatche ça" — sinon je
> continuerai à tout faire main-thread.

Réaction owner (directe) :

> "ALORS MON AMIS. Typquement c'est le genre de réponse que je ne veux
> PAS entendre. Notre repo doit être putain de clean pour que TOUT se
> fasse automatiquement. Ce n'est pas à moi de faire attention quand
> on lance un projet ni à moi de dire quand on dispatch. C'est ta
> tâche régle ça. [...] si tu détectes un frein dans notre workflow
> ben il faut le signaler et le régler tout de suite."

Il a raison. Les 3 "conseils" auraient dû être :
1. → `pnpm doctor:client:fix` qui remplit `.env.local` interactivement.
2. → `/wire-content` gate sur `doctor:client:strict` automatiquement.
3. → Documenté dans BOOTSTRAP-CLIENT.md comme fix, pas comme warning.

Le dispatch "muscle dormant" aurait dû être :
- Un hook qui classifie et injecte `[DISPATCH_CLASS]` obligation.
- Un Stop hook qui détecte la violation et alerte.
- Une règle §12 qui codifie l'obligation.

Résultat : v6.6.0 livrée dans la foulée avec tous ces fixes.

## How to apply

**Test à chaque fin de session** : si je m'apprête à dire "tu devrais
[X] avant demain" ou "fais attention à [Y]", je m'arrête et je me
demande :

- Est-ce que je peux coder ce check / gate / fix maintenant ?
- Est-ce que ça tient dans la session courante (< 1-2h) ?

Si oui → je code, pas je signale.
Si non → soit je le fais en premier chantier de la prochaine session,
soit je mobilise l'owner via `ACTION HUMAINE REQUISE` (taste, access,
irréversible), **pas** via une liste de conseils.

**Exception légitime** : signaler est OK quand la friction nécessite
une action humaine que je ne peux pas automatiser (créer compte
Sanity, acheter domain, etc.). Dans ce cas utiliser le bloc
`ACTION HUMAINE REQUISE` du format `workflow.md`, pas un paragraphe
de conseils.

## Cross-refs

- Session source : `sessions/2026-04-19-1800.md`
- Rule parente : `.claude/rules/anti-complaisance.md`
- Fixes appliqués : v6.6.0 (doctor-client + dispatch enforcement +
  friction loop)
- Principe : si tu connais, tu fixes. Si tu peux pas, tu demandes
  clair. Jamais de "voici ce que tu devrais faire".
