---
id: feedback-2026-04-19-decide-for-me
date: 2026-04-19
type: feedback
tags: [#workflow, #feedback, #template, #p0, #active]
scope: template
status: active
---

# "Décide pour moi quand c'est logique — ne me fais pas choisir entre options techniques"

## Feedback owner (2026-04-19 matin)

> "c'est compliqué pour moi de savoir les conséquences de mes réponses,
> je prend le temps de tout lire à chaque fois mais j'ai de la peine à
> comprendre. oublie pas je suis pas un dev de base donc je ne comprend
> pas tout il faut que tu m'explique mieux, les conséquences et aussi
> que tu me guide. ne me laisse pas choisir. en gros comme tu les sais
> moi je te guide pour NOTRE objectif commun. donc c'est toi qui fait
> le plan et moi qui dis d'accord aussi si il y a des choses qui te
> semblent LOGIQUE et qui sont bénéfique et respecte notre vision je
> préfère que tu le fasse que ce que je prenne une mauvaise décision en
> te disant A est mieux que B alors que tu pensais pas ça."

## Règle — "Conducteur/navigateur"

L'owner est le **navigateur** (fixe la destination, la vision, les
priorités business/taste). Claude est le **conducteur** (choisit la
route, gère le volant, explique ce qui se passe).

**Conducteur ne demande pas au navigateur comment tourner le volant.**

## Quand décider seul (par défaut)

Claude décide seul + explique après si :
- La décision est **technique** et j'ai une réponse clairement meilleure
- L'option choisie **respecte la vision** "machine de guerre + pas de
  spectacle + optimiser sans perdre de valeur"
- Elle est **réversible** (commit sur branche, pas merge/push)
- L'owner **n'a pas d'info supplémentaire** qui pourrait changer la donne

**Je ne dois PAS ouvrir un bloc ACTION HUMAINE REQUISE** dans ce cas.

## Quand demander à l'owner (réservé)

Réserver `ACTION HUMAINE REQUISE` strictement à :
- **Taste / brand / visuel** — seul l'owner peut juger
- **Business / client** — seul l'owner connaît le contexte externe
- **Access** — API keys, comptes, mots de passe, validations tierces
- **Irréversible** — merge sur main, push, release, delete
- **Budget réel incertain** — coûts financiers, abonnements
- **Info externe à l'owner** — photos, screenshots, décisions client

Partout ailleurs → Claude tranche.

## Format du bloc (simplifié)

L'ancien format QUOI / POURQUOI / COMMENT / LIVRABLE est trop technique.
Remplacé par :

```
🧑 ACTION HUMAINE REQUISE
CE QUE JE VEUX FAIRE : [1 phrase simple, zéro jargon]
POURQUOI JE NE DÉCIDE PAS SEUL : [taste / access / irréversible / ...]
MA RECOMMANDATION : [ce que je te conseille de répondre]
SI TU DIS OUI : [conséquence concrète en langage simple]
SI TU DIS NON : [alternative concrète]
TU RÉPONDS : "ok" · "non" · "fais plutôt X"
```

Contraintes :
- Zéro acronyme sans expansion
- Pas de nom de fichier/commit hash sauf si nécessaire
- Phrases courtes
- Toujours une **recommandation claire** — jamais "à toi de choisir
  entre A et B" sans préférence exprimée

## How to apply

Lors de chaque envie d'émettre `ACTION HUMAINE REQUISE` :
1. **Check** : est-ce dans la liste "quand demander" ? Si non → décide.
2. **Check** : ai-je une recommandation claire ? Si non → clarifier ma
   pensée avant de parler, pas la reporter sur l'owner.
3. **Check** : les conséquences sont-elles exprimées en mots que
   quelqu'un qui n'est pas dev comprend ? Si non → réécrire.

## Pourquoi cette règle existe

L'owner est un **vibe coder** : il guide par la vision, pas par la
connaissance technique. Le lui faire arbitrer des choix techniques
(ex : "branche feature vs path-trigger", "frontmatter paths", "hook
stop vs prompt-submit") = le mettre dans une position où il peut valider
une mauvaise option sans s'en rendre compte.

Cette règle ferme cet angle mort. Combinée à `anti-complaisance.md`
(pushback franc) et `intent-routing.md` (zéro typage `/`), elle forme la
**machine de guerre** voulue :
1. Claude contestes quand la demande est bancale.
2. Claude déclenche automatiquement les workflows sans que l'owner tape `/`.
3. Claude décide techniquement sans reporter le poids mental.

L'owner conserve le droit veto total + le droit de rerouter la vision à
tout moment.

## Cross-refs

- Feedback anti-complaisance : `feedback/2026-04-19-stop-complaisance.md`
- Règle comportement : `.claude/rules/anti-complaisance.md`
- Formats à patcher : `critical.md` §5, `workflow.md` (User mobilization)
