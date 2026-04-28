---
id: anti-pattern-bootstrap-landing-default
date: 2026-04-23
type: anti-pattern
tags: [#anti-pattern, #design, #template, #active]
scope: template
status: active
---

# Bootstrap Landing Default — le site qui ressemble à tous les sites

## Le pattern

La page après le hero centré. Structure immuable, dans cet ordre :

1. **"Our Services" / "What We Offer"** : 3 cards en grid, chacune avec
   icône SVG 48px centré, titre H3, 2-3 lignes de texte. Gap 24px.
   Fond blanc ou gris clair `#F9FAFB`.
2. **Testimonials** : avatar rond 48px + guillemets ouvrants en
   `text-6xl text-gray-200` + quote + name + titre. Slider ou grid 3-col.
3. **"Our Team" / "Meet the founders"** : grid de photos rondes +
   nom + rôle + liens LinkedIn/Twitter. Parfois un `hover: scale(1.05)`.
4. **"Contact Us"** : form centré, champs Name / Email / Message + CTA
   "Send message". Parfois une carte Google Maps à côté.

Entre chaque section : un `<hr>` ou un divider SVG "wave". Section headings
en H2 centré, sous-titre centré plus petit, `mb-16`. Toujours centré.

C'est Bootstrap 3 / 2015. Il est ressorti en Tailwind UI wrapper. Il vit
dans 90 000 templates ThemeForest. Il est brand-indifférent par spec.

## Pourquoi c'est l'AI slop 2020-2024

Ce pattern est la réponse à "make me a landing page" dans tout modèle
entraîné avant 2025. La structure est tellement canonique dans les datasets
(tutos, templates, starters, "build a SaaS landing in 1 hour" YouTube)
que le modèle la reproduit par défaut quand aucune contrainte n'est imposée.

Le vrai problème : ce pattern est **brand-indifférent par construction**.
La même page "Our Services" icône-titre-texte peut être générée pour un
cabinet d'avocats, un studio de yoga, une agence SEO, une startup fintech.
Si la page est interchangeable, le client est invisible.

Un visiteur qui connaît ton produit ne devrait pas pouvoir se tromper de
site. Avec ce pattern, il le peut.

## Signaux de détection

- J'écris une section avec exactement 3 cards icône+titre+texte
- La section s'appelle "Services", "Features", ou "Why us"
- Les testimonials ont des avatars ronds et des guillemets géants
- Il y a une section "Our Team" avec des photos rondes en grid
- Le form de contact est centré et générique
- Je pense "je dois ajouter les testimonials" par réflexe, pas par besoin

## Alternatives ambitieuses

1. **Editorial grid narrative** (`references/uipro/styles-catalog.md`
   Tier 1 "Editorial Layout") : remplacer les 3 cards par un bloc
   typographique structuré — les "services" sont des chapitres d'un texte,
   pas des cartes. Layout asymétrique. Les témoignages sont des citations
   intégrées dans la narration, pas un slider indépendant.
2. **Dimensional layering / bento custom** : remplacer la 3-col grid uniforme
   par un bento-grid à cases de tailles variables — un service prend 2 cols,
   un autre est un strip horizontal, un troisième est une card verticale tall.
   La hiérarchie visuelle encode l'importance, pas seulement l'ordre.
3. **Narrative-first page** : la page entière EST une histoire. Il n'y a
   pas de "section Features" — le produit se révèle à travers une progression
   narrative pilotée par `mechanics/cinematic-scroll-hero.md` ou
   `mechanics/masked-reveal.md`. Les "testimonials" arrivent dans le flux,
   pas dans un bloc dédié.

## Quand c'est quand même acceptable

- Site institutionnel pour une PME qui a un besoin de réassurance SEO :
  la structure prévisible aide les bots et les visiteurs qui scannent.
- Client sous contrainte de temps qui doit livrer en 48h — le pattern est
  correct, il n'est juste pas ambitieux.
- Site d'un professionnel libéral (médecin, notaire) dont le client
  veut se repérer vite : prévisibilité = confiance dans ces contextes.
- Contexts gouvernementaux ou accessibilité stricte.

## Cross-refs

- `anti-patterns/safe-centered-hero.md` — la section hero qui précède
  typiquement ce layout
- `mechanics/cinematic-scroll-hero.md` — alternative narrative complète
- `mechanics/masked-reveal.md` — révélation progressive en remplacement
  des sections statiques
- `references/uipro/styles-catalog.md` — Tier 1 "Editorial Layout",
  "Dimensional Layering", "Bento Grid"
