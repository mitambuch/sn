---
id: interaction-secondary-menu-deep-link
date: 2026-04-23
type: pattern
tags: [#design, #pattern, #template, #active]
scope: template
status: active
---

# Secondary Menu Deep-Link — bypass funnel via raccourci top-level

## Quoi

Ajouter un lien direct vers une **page profonde à forte intention** dans
le menu secondaire (ou top nav persistent), court-circuitant le funnel
classique home → section → sous-page.

Exemple canonique : bouton *"Carte des mets"* dans le menu secondaire
d'un hôtel, deep-linkant `/carte` au lieu de passer par
`/restaurant/carte`.

## Pourquoi ça marche

- **Alignement intent ↔ accès** : quand 40 % des visiteurs cherchent
  une info précise (menu, prix, horaires), les faire traverser 3 pages
  pour l'atteindre = friction pure.
- **Google SEO gain** : le deep-link accumule CTR + session depth sur
  une URL propre. Après 2-3 semaines, Google la surface en snippet /
  direct answer.
- **Partage facilité** : URL courte et mémorable (`/carte` vs
  `/restaurant/content/menus-plat-du-jour-avril`).
- **Mental load réduit** : l'utilisateur n'a pas à deviner la
  hiérarchie du site.

## Quand l'utiliser

- Restaurant/hôtel → `/carte`, `/horaires`, `/reserver`
- E-commerce → `/solde`, `/nouveautes`, `/livraison`
- Agence → `/tarifs`, `/contact`, `/portfolio/<projet-phare>`
- SaaS → `/pricing`, `/changelog`, `/docs/getting-started`
- Site événementiel → `/programme`, `/billetterie`

**Critère** : existe-t-il une URL que tu donnerais au téléphone sans
prendre le temps de naviguer ? Cette URL doit avoir un bouton top-
level.

## Quand éviter

- Menu déjà saturé (7+ items) — ajouter un 8e casse la lisibilité.
  Préférer un redesign IA complet.
- Page profonde non-stable (URL change souvent) — deep-link pourrit.
- Contenu gated (connexion requise) — l'utilisateur atterrit sur un
  login sans contexte, pire UX.
- Page qui requiert de comprendre le reste du site pour être utile
  (ex : *"Notre méthode"* sur site agence, utile seulement après home).

## Implémentation minimale

```tsx
// src/components/layout/Header.tsx — menu secondaire
const secondaryNav = [
  { label: 'Carte des mets', href: '/carte', priority: 'high' },
  { label: 'Réserver', href: '/reserver', priority: 'high' },
  { label: 'Horaires', href: '/horaires', priority: 'medium' },
];

<nav aria-label="Navigation secondaire" className="...">
  {secondaryNav.map((item) => (
    <Link
      key={item.href}
      to={item.href}
      className={cn(
        'text-sm font-medium',
        item.priority === 'high' && 'text-accent',
      )}
    >
      {item.label}
    </Link>
  ))}
</nav>
```

## Variantes

- **Top nav epinglé** : le deep-link est dans la nav principale (pas
  secondaire) — usage quand l'intent est vraiment dominant (site dédié
  menu de resto).
- **Sticky footer CTA mobile** : sur mobile, le lien devient un bouton
  sticky bas d'écran toujours visible.
- **Breadcrumb reverse** : la page deep-link affiche en haut un
  breadcrumb *"Voir aussi : Restaurant > Menu > Carte"* pour remonter.
- **Hero homepage épinglé** : un tile dans la grille du hero qui
  pointe directement vers la page profonde.

## a11y / SEO / indexation

- **a11y** : le lien dans la nav secondaire doit être atteignable au
  clavier (Tab order cohérent), `aria-current="page"` quand active.
- **SEO** : la page deep-linkée doit avoir son propre `<title>`,
  meta description, Open Graph image. Pas *"Hôtel du Soleil - Page"*,
  mais *"Carte des mets — Hôtel du Soleil"*.
- **Sitemap.xml** : l'URL deep-link doit être listée au même niveau
  que la home, pas cachée sous `/restaurant/...`.
- **Canonical** : si la même page existe aussi sous un path profond,
  définir canonical vers la version deep-link courte.

## Mesurer le gain

Métrique à 7 jours :
- Pageviews directes `/carte` (via GA/Plausible) vs `/restaurant/carte`
- Entry page distribution — la deep-link URL apparaît-elle dans le
  top 10 entries ?
- Bounce rate sur la page deep-link (un bounce bas = intent matché)

## Refs

- Exemple owner : hotel-vda.ch bouton *"Carte des mets"* 2026-04-23
  — la page menu est devenue top entrée du site devant la homepage.
- Nielsen Norman Group — *Information Scent* (1998, toujours valide).

## Cross-refs

- `interactions/share-whatsapp-prefilled.md` — partage de la deep-link
- `interactions/native-web-share.md` — partage natif de la URL
- `rules/ux-first.md` §*Goal user*
