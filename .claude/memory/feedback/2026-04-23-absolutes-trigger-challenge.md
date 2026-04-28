---
id: 2026-04-23-absolutes-trigger-challenge
date: 2026-04-23
type: feedback
tags: [#workflow, #feedback, #template, #active, #p0]
scope: template
status: active
---

# Les absolus owner déclenchent un CHALLENGE obligatoire

## Règle

Dès que l'owner utilise un **absolu** dans une demande UI/design, je
déclenche un `CHALLENGE` (anti-complaisance §11) **avant** d'appliquer.
Le CHALLENGE doit expliciter l'interprétation en 1 ligne et attendre
confirmation si la lecture n'est pas évidente.

**Absolus déclencheurs** :

- « zéro X », « plus de X », « supprime tous les X »
- « tout en Y », « Y partout », « Y seulement »
- « plus jamais Z »
- « rien ne doit… », « aucun… »
- « que du… », « QUE en… »

## Why

Session 2026-04-23 sur Sawnext. L'owner dit : *« fait un fond neutre pas
de rouge dedans »*. J'applique littéralement :

- Retire `--color-accent: #c44040` (coral red) ✅ bon réflexe
- Retire AUSSI les pastels `rose #d4a59e`, `blue #9bb5c4`, `lavender`,
  `beige`, `sage` qui étaient dans la palette saw-next qu'il aimait ✗
- Remplace l'accent par `accent = fg` (graphite sur fond crème) — site
  devient plat, monochrome, sans vie.

3 itérations plus tard, il me redemande de remettre ce que j'ai retiré,
cite explicitement le repo `saw-next` comme benchmark. Le malentendu a
coûté 2h. *« zéro rouge »* voulait dire : *« retire le coral red criard
qui jure avec la DA conciergerie »*, pas *« extermine tout ce qui n'est
pas gris »*.

Un CHALLENGE aurait pris 15 secondes :
```
CHALLENGE
- Hypothèse implicite : "zéro rouge" = retirer le #c44040 uniquement,
  pas les pastels rose/bleu/lavande de saw-next
- Alternative non envisagée : garder l'accent rose poudré, neutraliser
  seulement les éléments corail vifs
- Verdict : GO-BUT — je confirme : rouge = coral red only ?
```

→ réponse owner en 5 sec, zero waste.

## How to apply

### Séquence obligatoire face à un absolu

1. Lire la demande, identifier le mot absolu.
2. Formuler **2 interprétations plausibles** (une minimale, une maximale).
3. Émettre un `CHALLENGE` avec les 2 lectures en `Hypothèse implicite` et
   `Alternative`.
4. Verdict `GO-BUT` par défaut (avec ma lecture la plus probable) et
   **attendre confirmation 1 ligne**.
5. Si l'owner dit « ne fais pas de CHALLENGE théâtral pour ça, c'est clair »
   → je note et j'exécute mon interprétation, mais je cite l'absolu
   dans le commit body pour traçabilité.

### Exemples de CHALLENGE bien formés

**Cas « zéro rouge »** :
> CHALLENGE — Hypothèse : #c44040 coral red uniquement. Alternative :
> retirer aussi les pastels rose/lavande de saw-next. Verdict GO-BUT,
> je pars sur la première. Confirme ou corrige en 1 mot.

**Cas « tout en mono »** :
> CHALLENGE — Hypothèse : Geist Mono partout (sans + mono pointent vers
> Geist Mono). Alternative : Geist Mono pour titres, Geist Sans pour
> body. Verdict GO, j'aligne le token. OK ?

**Cas « supprime le cursor custom »** :
> Pas d'ambiguïté → pas de CHALLENGE, exécute direct.

### Quand NE PAS émettre un CHALLENGE

- Absolu trivial + non-ambigu (« supprime le fichier X » → exécute).
- Absolu sur zone technique non-UI (« pas de any TypeScript », « jamais
  d'export default » — règles techniques sans zone grise).
- Reprise d'une feedback existante (« on avait dit zéro coral », pas la
  première fois → je relis la feedback et j'applique).

## Cross-refs

- Rule durcie : `.claude/rules/anti-complaisance.md` §"Quand appliquer
  le CHALLENGE" — ajout du trigger "absolu"
- Incident source : `sessions/2026-04-23-1133-cancelled-meeting-debrief.md`
- Règle parent : `rules/vision-first.md`
