---
id: 2026-04-23-vision-before-code
date: 2026-04-23
type: pattern
tags: [#workflow, #design, #pattern, #template, #active, #p0]
scope: template
status: active
---

# Vision-before-code — émettre un bloc VISION avant toute passe UI

## Problème résolu

Les passes UI en aveugle (pas de vision validée en amont) produisent :

- du code jeté (l'owner rejette la direction après 1h de dev)
- des itérations sans convergence (chaque feedback change la direction)
- une pile de commits qui masque l'absence de fil rouge
- une perte de confiance owner — il finit par annuler le livrable

Observation 2026-04-23 : 3 passes UI sur Sawnext, chacune rejetée sur
direction (pas sur exécution). Aucune des 3 n'avait été validée en
amont comme *vision*. Résultat : rendez-vous client annulé, 4h perdues.

## Pattern

**Avant la première Edit/Write d'une passe UI**, j'émets un bloc
`VISION` en 5 lignes et j'attends validation owner (réponse `go` ou
reformulation).

### Template

```
VISION
- Intent : [1 phrase — ce que la page/section doit raconter]
- Refs : [2-3 URL ou nom de repo concrets, jamais un adjectif flû]
- Keep : [2-3 éléments de l'état actuel qui survivent]
- Drop : [2-3 éléments qui disparaissent]
- Verdict attendu : "go" | "refs manquantes" | "repropose"
```

### Exemple bien formé (Sawnext, ce qu'il aurait fallu faire session 1)

```
VISION — Home Sawnext
- Intent : une cover éditoriale unique qui incarne la discrétion luxe
  sans effet showreel (statement bold + aurora qui respire)
- Refs : github.com/mitambuch/saw-next (palette + glass cards),
  xx.wearemotto.com (grands visuels + typo), lombardodier.com (autorité)
- Keep : 10 mots rotatifs (owner-validés), Geist Mono, grain 35mm
- Drop : hero Three.js, CustomCursor, EntryLoader, counter 0X/07
- Verdict attendu : go avec refs confirmées, ou repropose si mix
  saw-next + wearemotto n'est pas cohérent pour toi
```

### Exemple mal formé (à éviter)

```
VISION
- Intent : site luxe minimaliste
- Refs : classe, sobre, élégant
- Keep : typo
- Drop : trop de trucs
```

Adjectifs = trous noirs, aucune valeur de validation.

## Quand l'appliquer

✅ Nouvelle page (`/new-page`, `/spec`)
✅ Refonte de section existante
✅ Rework tokens (palette, grain, typographie)
✅ Redirection design après feedback owner
✅ Introduction d'un benchmark visuel mid-projet
❌ Bug fix chirurgical
❌ Bump deps
❌ Rename / regen / cleanup mécanique

## Anti-patterns

### 1. VISION écrite APRÈS le code pour justifier ce qu'on a déjà fait

Aucune valeur. La vision vient **avant**, ou pas du tout.

### 2. VISION théâtrale pour paraître rigoureux

Si la tâche est triviale et que je suis sûr du chemin, je rédige la
vision compacte (1 ligne) et je demande *« confirme en 5 sec »*.

### 3. VISION rédigée, owner absent, je pars quand même

Si j'ai rédigé une VISION et que l'owner ne répond pas dans 10 min, **je
stoppe**. Je n'exécute pas sur mon interprétation unilatérale. C'est
tout le point : valider avant de coûter de l'argent en temps.

### 4. VISION qui couvre 5 sections à la fois

Une vision = une section / une page / un token set. Si je dois en
couvrir plusieurs, j'émets plusieurs VISIONs séquentielles, et je code
bloc par bloc avec check-in owner au milieu.

## Intéraction avec d'autres règles

- **`anti-complaisance.md §CHALLENGE`** : la VISION est l'input, le
  CHALLENGE est le filtre. Séquence :
  `VISION → owner GO → CHALLENGE → owner GO → code`
- **`critical.md §11`** : le CHALLENGE reste obligatoire sur R2 même si
  la VISION est GO, parce qu'un intent peut cacher une décision archi
  que l'owner ne voit pas.
- **`stop-piling-changes.md`** : une fois la VISION validée, je commit
  par étape ; après 2 commits sans check-in visuel owner, je stoppe et
  je demande retour avant de poursuivre.

## Cross-refs

- Rule always-loaded : `rules/vision-first.md`
- Feedback incident source : `feedback/2026-04-23-content-first-before-any-code.md`
- Session journal : `sessions/2026-04-23-1133-cancelled-meeting-debrief.md`
- Related pattern : `patterns/2026-04-22-stop-piling-changes.md` (check-in
  discipline pendant l'exécution)
