---
id: 2026-06-18-client-owns-translations
date: 2026-06-18
type: feedback
tags: [#i18n, #content, #workflow, #feedback, #client-specific, #p0]
scope: client-specific
status: active
---

# Le client traduit lui-même ses champs Sanity — FR = fallback assumé

## La directive (owner Mirco, 2026-06-18)

Le client (Salva) remonte régulièrement des « bugs de traduction » : EN/ES
affiche du FR sur une expérience (ex. Jaquet Droz). Owner, sans ambiguïté :

> « Mon CLIENT DOIT TRADUIRE LUI-MÊME LES CHAMPS SUR SANITY. Ça sort sinon de
> ma zone de travail et il va se reposer sur moi à chaque fois pour traduire le
> tout, c'est SON travail. Si le FR est un fallback parce qu'il a pas rempli, il
> DOIT le faire. »

## La règle

**Remplir EN/ES dans Sanity = travail du client, pas de l'owner ni de Claude.**

- Le **FR est un fallback légitime et assumé**, pas un bug. `resolveField`
  ([src/lib/i18nField.ts](../../src/lib/i18nField.ts)) fait `value[locale] ?? value.fr` :
  un champ EN/ES vide → le FR s'affiche. C'est le comportement voulu (leçon #4).
- Ne **jamais** lancer `/translate` pour combler l'EN/ES d'un contenu client
  (events, journeys, conciergeService, timepieces…). Ces docs sont la zone du
  client.
- **Exception — ce qui reste mon job** : si le champ est *réellement cassé*
  (impossible de saisir/sauver une locale, champ manquant sur le type), alors le
  client ne *peut pas* faire son travail → c'est un bug à corriger. Distinguer
  « pas rempli » (client) de « pas remplissable » (moi).

## Pourquoi cette distinction compte

Prolonge [[cms-i18n-complaint-real-cause-missing-field]] : un retour « ça ne se
traduit pas » est presque toujours soit un champ vide (→ client le remplit),
soit un champ manquant/cassé (→ moi). Avant de toucher du code i18n :

1. Le champ **existe-t-il** sur ce type de doc ? (sinon : mon bug)
2. Le champ est-il **saisissable** dans le Studio ? (sinon : mon bug)
3. Sinon → il est juste **vide** → c'est au client de le remplir, FR en
   attendant. Je ne traduis pas à sa place.

## Comment appliquer

- Face à un retour « traduction » : je trie d'abord avec les 3 questions
  ci-dessus, je réponds au client (via owner) « FR est le fallback, l'EN/ES est
  à saisir côté Studio », et je ne code que si le champ est cassé/absent.
- Côté Studio, j'ai ajouté un indice contextuel dans `LocaleTabsInput` : un
  onglet EN/ES vide affiche « traduction vide — le FR s'affiche en attendant,
  saisissez-la puis publiez » (commit du 2026-06-18). But : que le client cesse
  de prendre le fallback pour un bug.
- Le validateur `validate-sanity-content` n'exige que FR/EN sur les singletons
  canoniques (`siteConfig`, `page-*`) ; il **ne bloque pas** sur l'EN/ES vide
  des docs éditoriaux du client — cohérent avec « FR fallback assumé ».
