---
id: 2026-07-01-audit-ux-patch
date: 2026-07-01
type: decision
tags: [#content, #i18n, #sanity, #decision, #client-specific]
scope: client-specific
status: active
---

# Patch d'incohérences UX (audit client juillet 2026) — 19 items, 14 commits

Le client a fourni un audit Excel (`public/SAWNEXT_Audit_UX_incoherences.xlsx`,
19 incohérences P1/P2/P3) après coup. Patch livré sur branche
`fix/audit-ux-incoherences`. Ne pas ré-appliquer l'audit à l'aveugle : il
contient des prémisses fausses (voir plus bas).

## Décisions owner (2026-07-01)
- **Conciergerie (A1/C5)** : garder le déni du manifeste, **retirer le
  self-label « conciergerie » partout** → marque = « cercle privé » / hero
  Type = « Indépendante ». Les libellés de *service* conciergerie (dashboard,
  `conciergeService`, domainTile dormant) restent — ce sont des services, pas
  le self-label.
- **Domaines (A5/B1/B6)** : périmètre = **10 verticales** (fie-toi-à-l'audit).
  Titre → « Dix/Ten verticales », lede recadré, plus de « Six/restreint ».
- **Engagements (B2)** : **afficher un 4e principe** (« Engagement suisse »)
  plutôt que retomber à « Trois ». Ajouté côté i18n (le composant lit l'i18n,
  pas le tableau Sanity `principles[]` qui est dormant).
- **Légal (C2)** : contenu géré par le client sur Sanity → liens morts
  neutralisés (spans muets `FooterPending`), à câbler quand le contenu arrive.

## L'audit se trompe (documenté, non appliqué)
- **C1** : l'audit croit le domaine = `sawnext.ch`. FAUX — le vrai est
  `saw-next.ch` (avec tiret, cf `.env.local`, teamData, siteConfig). L'email
  `info@saw-next.ch` est **correct**, ne pas « unifier ».
- **C8** : les fiches catalogue FR/EN sont déjà équivalentes ; les textes cités
  par l'audit (« Private Travel & Protocol ») viennent d'une maquette morte
  (`docs/landing-mockup-v5.html`), pas du code shippé.
- **B1** : l'audit dit FR « Dix chantiers » ; le fixture disait « Six » (les
  deux langues). Le vrai défaut = « Six » sur une grille de 10, pas juste l'EN.

## Architecture contenu (rappel critique)
Landing (`Home.tsx`) = **Sanity-first → fallback i18n** via
`resolveFieldOrFallback`. Le contenu **live** vient du dataset Sanity quand
peuplé. Corollaires :
- Les tableaux Sanity `landing.principles[]` (4) et `domainTiles[]` (6) sont
  **dormants** — les composants rendent l'i18n (`landing.principles.pN`,
  `landing.domains.NN`). Éditer ces tableaux ne change PAS le rendu.
- Le « chrome » (compteurs de sections, marquee, index, brand, édition) est
  **i18n-only** → non « mettable en Sanity » sans migration de schéma.
- La meta description de Home vient de `src/config/site.ts` (SeoHead sans
  props), **pas** de Sanity `siteConfig.seoDescription`.
- **Les corrections du fixture `studio/fixtures/sawnext-seed.json` n'atteignent
  le site live qu'après `pnpm sanity:push:landing` sur le dataset prod**
  (token d'écriture Sanity requis — action owner). Sinon seul le fallback i18n
  (déjà corrigé) rend.

## Renumbering (B3/B4/B5)
Sections landing renumérotées en continu **01→07** : Access `s08→s06`,
Interlocutor `s09→s07`. `SECTION_KEYS`, ancres, footer nav, clés i18n
`landing.index.sNN`, compteurs (`02 / 07`, eyebrow `/ 02`). Le QR page
`pages/Presentation.tsx` (namespace `qr.*`, num 01-06) et le playground gardent
leur numérotation propre.

## Reste à faire (owner/client)
- `pnpm sanity:push:landing` (+ `push-site-config`) pour propager les champs
  Sanity corrigés au live.
- Client fournit le contenu légal (Sàrl, IDE/RC, adresse Boudry, hébergeur UE).
- C4 : forme de marque en prose (copyright « SAW Next » vs « Sawnext Sàrl »,
  « l'équipe SAW Next ») — décision de graphie laissée à l'owner (seule la
  partie aria a été normalisée).
- Sortir `public/*.xlsx` et `public/brief_*.md` de `public/` (sinon servis
  publiquement s'ils sont commités).

## Audit V2 (ajout ES) — 2026-07-01 après-midi
Le client a fourni une V2 (`public/SAWNEXT_Audit_UX_incoherences_v2.xlsx`) =
V1 + espagnol (26 items : 19 V1 + ES1-ES6 + C9). Traitement :
- **ES1** (ES « Fundada 2025 ») déjà réglé par A3 ; **ES5** (ES « Estado :
  Suiza ») déjà réglé par A4.
- **ES4** (GPS ES faux 46.50°N — Boudry = 46.83°) + **ES6** (index
  « Interlocutor » ≠ header « Equipo ») corrigés côté i18n (commit `6fa1c04`),
  `topRightGps` → « 46.831° N · 6.842° E » et `eyebrowTeam` aligné sur le nom
  de section (3 langues).
- **Restent des décisions owner/client** : **ES2** (la version ES est un texte
  distinct, pas une traduction — réécrire sur une trame commune), **ES3** (le
  catalogue ES n'affiche aucune fiche ouverte), **C9** (anglicisme
  « marketplace » FR), **C1** (confirmer domaine officiel saw-next.ch), **C4**
  (graphie de marque en prose).

## PIÈGE CRITIQUE — push Sanity casse l'ES
`resolveField = value[locale] ?? value.fr ?? i18n` (src/lib/i18nField.ts). Les
champs Sanity du fixture n'ont que **fr/en**. Donc si on **push** le landing
Sanity en prod, la version **ES rendra du FRANÇAIS** (fallback `.fr`) pour tout
champ Sanity peuplé. Aujourd'hui l'ES rend l'i18n espagnol (Sanity ne délivre
pas d'es). **Ne pas push Sanity tel quel** : soit rester sur l'i18n (couvre les
3 langues, déjà corrigé), soit ajouter l'es aux champs Sanity d'abord (client).
Corollaire : les corrections i18n suffisent pour le live ; le push Sanity n'est
PAS requis et serait risqué sans traduction ES préalable.

Voir aussi [[2026-06-02-sanity-stale-data-overrides-code]] (Sanity écrase le
fallback code), [[option-b-fast-ship]] (flux de livraison rapide).
