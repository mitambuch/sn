---
id: 2026-04-28-business-model-inquiry-not-ecommerce
date: 2026-04-28
type: decision
tags: [#workflow, #decision, #client-specific]
scope: client-specific
status: active
---

# Modèle business — inquiry-based, pas e-commerce

## Décision

Sawnext Studio est une plateforme de **génération de leads + présentation
curatée d'items haut de gamme**. Elle n'est **PAS une boutique en ligne**.

Flow utilisateur :

```
Client vetted (via code SAW-XXXX-XXXX) se connecte
  → navigue les modules (Événements, Propriétés, Garde-temps, Œuvres,
    Voyages, Conciergerie)
  → consulte une fiche détail
  → clique « Manifester intérêt »
  → Inquiry créée en DB + email envoyé à Salva (operator) via Resend
  → Salva contacte le client hors plateforme (téléphone / messagerie privée)
  → conversion / vente / engagement → off-platform
```

Confirmé par owner le 2026-04-28 23:32 (suite session bootstrap +
lot A infra) : « ok alors en effet c'est bien un truc où on clique
sur un bouton pour manifester un intérêt ».

## Why

Le modèle HNW concierge suisse repose sur la **relation humaine
operator ↔ client**, pas sur le self-service transactionnel. Trois
raisons :

1. **Discrétion** — pas de trace de transaction online, pas de
   tracking pixel marketing, pas de panier abandonné qui exposerait
   l'intérêt du client à un tiers.
2. **Curation** — chaque inquiry est une opportunité d'ajouter de
   la valeur (proposer un item alternatif, conseiller, négocier).
3. **Régulation** — selon les items (montres rares, œuvres, biens
   immobiliers), un paiement online déclencherait des contraintes
   KYC / AML / TVA / douanes lourdes. Le hors-ligne les évite ou
   les transfère sur un canal contrôlé.

## How to apply

**Côté code, NE JAMAIS proposer / construire** :
- Panier (`Cart`, `CartItem`)
- Checkout / Stripe / paiement online
- Inventaire transactionnel (réservation atomique, hold, expiration)
- Order / OrderLine / Refund / Invoice automatisée
- Shipping / livraison / tracking
- Wishlist persistée (l'inquiry = la wishlist du HNW)
- Tarification dynamique / coupons / promos

**À construire** (déjà cadré dans `src/types/inquiry.ts`) :
- `Inquiry` avec `source` ∈ {event, property, timepiece, artwork,
  journey, concierge} et `targetId` pointant l'item.
- `InquiryStatus` ∈ {new, in_review, contacted, closed} pour le
  cycle opérateur.
- Bouton « Manifester intérêt » sur chaque fiche détail (lots C-D).
- Email Resend → Salva sur création (lot A.5 + B).
- Vue admin filtrée par module + statut (lot E).

**Items côté Sanity** : champs métier descriptifs (titre, photos,
description, caractéristiques, **prix indicatif ou « sur demande »**),
**pas de stock numérique**, pas de SKU, pas de status « disponible /
vendu » côté plateforme (Salva gère la dispo en off-platform et
décide quand retirer une fiche manuellement).

## Cross-refs

- Types : `src/types/inquiry.ts` (Inquiry, InquirySource, InquiryStatus)
- Session bootstrap : `.claude/memory/sessions/2026-04-28-2044.md`
- Si plus tard l'owner veut un module « e-commerce vrai » sur un
  segment spécifique (ex : drops limités sur garde-temps avec
  réservation atomique), c'est une **superseding decision** à écrire
  — pas un patch silencieux de celle-ci.
