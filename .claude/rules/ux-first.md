# UX-First — bloc UX avant toute page/section (always-loaded)

Debrief owner 2026-04-23 : sur hotel-vda.ch, l'ajout d'un bouton *"Carte
des mets"* dans le menu secondaire + d'un bouton *"Envoyer à un pote"*
WhatsApp a transformé la page menu en **top entrée du site**, devant la
homepage. Zéro tech compliqué — juste la question *"quel micro-feature
signature manque ?"* posée **au bon moment**. Cette règle force la
question avant chaque page. C'est le complément UX de `vision-first.md`
(qui cadre le visuel) et `creative-ambition.md` (qui cadre la motion).

## Le contrat

Avant toute nouvelle page ou refonte de section à audience B2C/B2B
utilisateur, émettre le bloc UX **après** VISION et **avant** le premier
Edit/Write :

```
UX
- Goal : [1 verbe — ce que l'utilisateur arrive à faire]
- Friction : [2 obstacles concrets sur son chemin le plus court]
- Micro-feature signature : [1 ajout inattendu — slug depuis interactions/]
- Share hook : [moment "envoyer à un pote" — NA si aucun]
- Métrique : [ce qui prouve en 7 jours que ça a marché]
```

Une UX sans `Micro-feature signature` = invalide. *"Un bouton classique"*
ne compte pas. L'objectif : identifier le 20 % qui fait 80 % de la
valeur perçue.

## Exemple bien formé — Hotel-VDA refactor

```
UX
- Goal : voir les plats du jour avant de réserver la table
- Friction : home → Restaurant → scroll → télécharger PDF (4 étapes)
           + PDF pas partageable en 1 tap
- Micro-feature signature : secondary-menu-deep-link — bouton "Carte
  des mets" dans le menu top, deep-link /carte direct
- Share hook : share-whatsapp-prefilled — "Regarde le menu ce soir :
  https://hotel-vda.ch/carte"
- Métrique : pageviews direct "/carte" vs ancien "/restaurant/carte"
  à 7 jours + taux de clic sur share hook
```

## Exemple mal formé

```
UX
- Goal : voir la page restaurant
- Friction : le site est moche
- Micro-feature signature : faire plus beau
- Share hook : bouton partager
- Métrique : plus de visites
```

Goal pas verbe, friction adjective, micro-feature adjective, share hook
générique, métrique vibes. Verdict : **repropose**.

## Ordre de consultation avant le bloc UX

1. `ls .claude/memory/creative-library/interactions/` — patterns
   existants.
2. Lire 2-3 fiches candidates en entier (pas diagonale).
3. Choisir **1 pattern** qui match l'intent utilisateur. Pas 3 — le
   choix forcé est ce qui fait la valeur.
4. Citer par slug exact dans `Micro-feature signature`.

Si aucun pattern existant ne couvre : ajouter d'abord une fiche dans
`interactions/<slug>.md`, **ensuite** citer. Pas l'inverse.

## Quand l'appliquer

- ✅ Nouvelle page utilisateur (landing, menu, pricing, booking)
- ✅ Refonte d'un funnel (home → action conversion)
- ✅ Page avec intent utilisateur clair (restaurant menu, contact, prix)
- ✅ Brief type *"faire une feature de fou"*, *"quelque chose qui
  marque"*, *"viral"*
- ❌ Atom UI dans `components/ui/` (pas de flux user)
- ❌ Refactor technique sans impact visible
- ❌ Page admin/studio (audience = 1 opérateur, règles différentes)
- ❌ Bug fix chirurgical

## Interaction avec VISION et CHALLENGE

Séquence complète pour une passe UI non-triviale :

```
VISION (visual mechanics ≥2) → owner GO
  → UX (micro-feature signature + métrique) → owner GO
    → CHALLENGE (architecture risk + GO/GO-BUT/NO-GO) → verdict
      → si GO : code
```

UX vient **après** VISION parce que le look cadre le comportement
remarquable attendu. UX passe **avant** CHALLENGE parce qu'un
micro-feature peut réarranger l'archi (deep-link → nouvelle route →
sitemap update).

## Pourquoi 1 micro-feature et pas 5

Le piège = lister 10 features *"qui seraient cool"*. Résultat : scope
creep, coût explosé, aucune ne sort. Obligation = 1 seule. Laquelle ?
Celle qui est **asymétrique** — coût bas, impact haut, idéalement avec
un share hook.

## Anti-patterns

- **Micro-feature = redesign complet.** Par définition PETIT ajout,
  gros impact. Un bouton dans un menu existant, pas *"refaire le
  layout"*.
- **Share hook forcé.** Toutes les pages n'ont pas de moment partage.
  Page contact = NA. Page menu restaurant = oui. Honnêteté > cases
  cochées.
- **Métrique fantaisie.** *"Plus d'engagement"* = no. Comptable et
  observable en 7 jours = oui (pageviews path X, CTR bouton Y, bounce
  rate).
- **UX rédigé après coup** pour justifier le code écrit. Zéro valeur.
- **Copier hotel-vda partout.** Pattern excellent pour restaurant.
  Ne pas le forcer sur un SaaS B2B. Toujours ancrer dans le persona
  réel.

## Interaction avec `dispatch.md`

Une passe UX non-triviale = **R2 en pratique** (arbitrage product +
alignement client). Main-thread Opus, pas worker.

## Enforcement

- **Phase future** : `scripts/validate-ux-first.js` — scan dernier
  commit `src/pages/*.tsx` hors `/playground/`, warn si message n'a
  pas de bloc UX dans body ou journal session du jour.
- **Phase future** : `scripts/classify-task.js` hint injection
  `[UX_REQUIRED]` sur regex `(page|feature|killer|wow|bouton signature
  |viral|micro-feature)`.
- D'ici là : discipline + cette règle always-loaded.

## Cross-refs

- `vision-first.md` — bloc VISION en amont (motion)
- `creative-ambition.md` — 2+ mechanics visuelles
- `anti-complaisance.md` §CHALLENGE — gate architecture aval
- `.claude/memory/creative-library/interactions/` — catalogue patterns
- `.claude/memory/creative-library/mechanics/` — motion visuelle (à ne
  pas confondre avec interactions comportementales)

## Pourquoi cette règle existe

Sans déclencheur explicite, le réflexe Claude face à *"nouvelle page"*
= générer hero + intro + CTA + SEO. C'est fonctionnel mais plat. Les
wins réels des projets owner viennent systématiquement d'un **micro-
ajout imaginé au bon moment** — le bouton qui change le funnel. Cette
règle oblige la question avant l'Edit. L'overhead côté owner est de 30
secondes pour valider le bloc UX. Le coût de l'ignorer se compte en
pages moyennes qui ne décollent pas.
