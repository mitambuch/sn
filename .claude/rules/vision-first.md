# Vision-First — une vision validée avant tout code UI (always-loaded)

Incident 2026-04-23 : l'owner a **annulé un rendez-vous client** après
trois passes UI où j'ai répondu à chaque feedback en patchant l'énoncé
littéralement, sans jamais remonter à une vision d'ensemble validée.
Résultat : chaque passe s'écartait davantage. Cette règle existe pour
que ça ne se reproduise pas.

## Le contrat

**Avant toute passe UI non-triviale** (nouvelle page, refonte de section
existante, rework tokens, redirection design), j'émets un **bloc VISION**
qui tient en 5 lignes et qui se fait valider par l'owner **avant** le
premier Edit/Write.

```
VISION
- Intent : [1 phrase — ce que la page/section doit raconter à l'utilisateur]
- Refs : [2-3 URL ou nom de repo concrets, pas d'adjectif flû]
- Mechanics : [≥ 2 slugs depuis creative-library/mechanics/]
- Keep : [2-3 choses de l'état actuel qui survivent]
- Drop : [2-3 choses de l'état actuel qui disparaissent]
- Verdict attendu : "go" | "refs manquantes" | "mechanics shallow" | "repropose"
```

**Sans réponse explicite de l'owner, pas une ligne de JSX n'est écrite.**
L'overhead est de 30 secondes côté owner. Le coût de l'ignorer se
compte en heures de code jeté.

Le champ `Mechanics:` a été ajouté le 2026-04-23 suite à la réalisation
que vision-first seul ne suffit pas — une VISION avec des refs floues
et sans mécanique explicite produit du code propre mais plat. Voir
`creative-ambition.md` pour la discipline complète (2+ slugs minimum
depuis le catalogue `.claude/memory/creative-library/mechanics/`).

## Quand l'appliquer

- ✅ Nouvelle page (`/new-page`, `/spec`)
- ✅ Refonte de section existante (ex : "refaire le dashboard")
- ✅ Rework tokens (palette, typographie, grain)
- ✅ Redirection design suite à feedback ("c'est moche, refais")
- ✅ Introduction d'un benchmark en cours de projet ("regarde saw-next")
- ❌ Fix de bug chirurgical, correction typo, bump deps → exempt

## Pourquoi 1 phrase d'intent et pas une spec

Une spec prend 20 min à écrire. Une phrase prend 20 secondes. Ce qu'on
cherche c'est **l'alignement**, pas le contrat légal. Si je ne peux pas
résumer en 1 phrase ce que la section doit raconter, c'est que je n'ai
pas compris le brief — et ça doit se voir AVANT d'écrire.

## Pourquoi des refs obligatoires

Les adjectifs ("classe", "minimal", "luxe") sont des trous noirs : chacun
les interprète différemment. Un repo GitHub, une URL de site live, un
screenshot — c'est concret, falsifiable. Sans ref, je redessine un
adjectif, et le délai entre ma lecture et la validation owner est
asymétrique : je perds 1h, il perd 30 secondes à rejeter.

## Intéraction avec CHALLENGE (`anti-complaisance.md` §11)

Le VISION block est l'**input** du CHALLENGE, pas un substitut. Séquence :

```
VISION → owner GO/NO-GO → si GO → CHALLENGE (verdict GO/GO-BUT/NO-GO)
       → si CHALLENGE GO → code
```

Le CHALLENGE reste nécessaire si l'intent cache une décision
architecturale que l'owner n'a pas vue.

## Intéraction avec `/brief` et benchmark

Si l'owner introduit un **nouveau benchmark visuel en cours de projet**
(ex : "regarde ce repo", "mon site préféré c'est X") :

1. Je **rouvre `/brief`** ou j'écris une `decisions/DD-brief-update.md`.
2. Le VISION block suivant **cite** le nouveau benchmark dans `Refs`.
3. Je vérifie si les décisions design précédentes restent valides
   (ex : "typographique pur, pas 3D" du 2026-04-20 était toujours OK
   quand saw-next est entré dans la référence, mais l'absence de glass
   + pastels actifs était obsolète — il fallait le dire).

## Anti-patterns

- **VISION théâtrale**. Si la tâche est triviale et que je suis sûr du
  chemin, je l'écris quand même mais je demande "confirme en 5 sec, je
  go". Pas de rituel creux.
- **Appliquer un absolu owner sans CHALLENGE**. Ex : "zéro rouge" →
  CHALLENGE obligatoire : "zéro rouge = tout rouge y compris pastel
  rose, ou juste le coral red #c44040 ?". Cf `anti-complaisance.md`
  nouvelle règle absolus.
- **Vision rédigée après coup pour justifier le code qu'on a déjà
  écrit**. Aucune valeur. La vision vient AVANT, c'est tout son intérêt.

## Enforcement

- `scripts/validate-vision-first.js` (TODO v6.9) grep le dernier commit
  JSX/TSX + vérifie qu'un bloc VISION existe dans le message de commit
  ou dans la session journal du jour. Absence → warning.
- Pour l'instant : discipline à chaque tour. Trigger = déclenche
  naturellement quand je vois `/new-page`, `/design`, `/design-explore`,
  "refais", "rework", "refonte".

## Cross-refs

- Incident source : `sessions/2026-04-23-1133-cancelled-meeting-debrief.md`
- Règle parent : `anti-complaisance.md` §CHALLENGE
- Règle complémentaire : `creative-ambition.md` (Mechanics obligatoires)
- Catalogue : `.claude/memory/creative-library/mechanics/` (slugs ici)
- Workflow : `workflow.md` §User mobilization (le VISION block **n'est pas**
  un ACTION HUMAINE REQUISE — c'est un check-in léger)
- Memory : `feedback/2026-04-23-content-first-before-any-code.md`,
  `patterns/2026-04-23-vision-before-code.md`
