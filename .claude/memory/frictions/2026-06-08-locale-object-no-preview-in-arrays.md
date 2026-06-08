---
id: locale-object-no-preview-in-arrays
date: 2026-06-08
type: friction
tags: [#sanity, #i18n, #friction, #client-specific, #p1]
scope: client-specific
status: active
---

# Piège — `localeString`/`localeText` sans `preview` = « Untitled » dans les listes

## Ce qui bloque

Retour client : dans les champs LISTE multilingues du Studio (concierge
« Capacités précises », journey destinations/transport/hébergement, property
aménagements, page paragraphes intro = tous des `array of localeString|Text`),
chaque élément s'affiche **« Untitled »**, et après saisie de l'EN la valeur
« semble vide / ne s'enregistre pas / incohérent ».

## Cause réelle

`localeString` et `localeText` sont des objets `{ fr, en }` avec un input custom
(`LocaleTabsInput`, onglets FR/EN) mais **aucun `preview`**. En contexte liste,
Sanity ne peut pas dériver de titre d'item → « Untitled » pour tous. La donnée
**est** bien enregistrée (le filtrage des `members` dans LocaleTabsInput ne perd
rien) ; mais l'éditeur ne voit pas le contenu, et au ré-ouvert l'onglet repart
sur FR → perception « l'EN a disparu ».

## Résolu (commit `da49b75`, branche `fix/catalogue-studio-content-model`)

Ajout d'un `preview` sur les deux types : title = FR (fallback EN, « (vide) »),
subtitle = la valeur EN (localeString) ou un statut « EN renseigné / EN à
compléter » (localeText). Les items de liste deviennent lisibles ET montrent
l'état de traduction d'un coup d'œil. Style calqué sur `programmeStep`
(prepare non typé + `String(… ?? '')`).

## Pour que ça ne se reproduise pas

**Tout objet utilisé dans un `array` DOIT avoir un `preview`** — sinon « Untitled ».
À vérifier pour tout nouveau type d'objet répétable. Candidat enforcement :
étendre `validate-sanity-schema.js` pour warn si un type-objet référencé dans un
`array of` n'a pas de `preview`.

## Reste à confirmer

La partie « EN ne s'enregistre pas » est très probablement une perception due au
preview manquant (+ reset d'onglet sur FR). Si après redéploiement du Studio le
client constate une vraie non-persistance EN, **reproduire dans le Studio
déployé** — ce n'est pas reproductible en lecture de code seule.

## Cross-refs

- [[catalogue-triple-model-divergence]] (même lot Voyages)
- `studio/components/LocaleTabsInput.tsx` (input custom, filtrage des members)
- `studio/schemas/objects/{localeString,localeText}.ts`
