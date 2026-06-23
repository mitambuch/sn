---
id: public-experience-interest-contact-form
date: 2026-06-23
type: decision
tags: [#content, #forms, #decision, #client-specific, #p1]
scope: client-specific
status: active
---

# Public experience "Manifester mon intérêt" → simple contact form, not the access tunnel

Client retour (2026-06-23) : sur une fiche expérience **publique**, le bouton
« Manifester mon intérêt » ouvrait `AccessRequestModal` (assistant 3 étapes
« demander un accès » + onglet code d'invitation). Ressenti : on demande au
visiteur de solliciter une autorisation / s'inscrire, alors que le contenu est
déjà public. Objectif owner : réduire la friction, augmenter les prises de contact.

## Décision

Nouveau composant `src/features/landing/ExperienceInterestModal.tsx` — un
formulaire de contact **simple, un seul écran** : prénom/nom/email/téléphone +
message + disponibilités (optionnel). Pas de code d'invitation, pas de framing
« accès ». Le CTA des deux surfaces publiques (`PublicFichePanel` via le teaser
accueil, et `/share/:code` `SharePage`) ouvre désormais ce formulaire.

Le tunnel d'accès (`AccessRequestModal`) **reste** pour les vraies intentions de
rejoindre la plateforme : CTA bas de section Access, cartes cadenassées, Hero,
et l'état d'erreur/expiré d'une fiche partagée. Le CTA d'une fiche = contact ;
le CTA « devenir membre » = accès. Deux intentions, deux chemins.

## Backend — réutilisation, pas de migration

Insert dans `public.access_requests` (migration 0012) : déjà **anon-insert** +
trigger Postgres qui email l'opérateur (`reply_to` = email du lead). Le titre de
l'expérience est préfixé dans le `message` (`[<titre>]`) + les disponibilités, pour
que l'opérateur voie le contexte. **Zéro nouvelle migration.**

`inquiries` était inutilisable ici : FK obligatoire vers `auth.users` → pas de
chemin anonyme. Cf [[saved-items-upsert-no-update-grant]] sur les pièges de
grants de cette table.

## Compromis assumés (phase 2 possible)

- Les leads « intérêt expérience » atterrissent dans le **même inbox admin** que
  les demandes d'accès (`/admin/access-requests`), distingués par le préfixe du
  message. Le sujet de l'email reste « Nouvelle demande d'accès » (changer =
  migration). Acceptable pour livrer maintenant ; une table/colonne `source`
  dédiée serait une amélioration phase 2.

CHALLENGE émis : verdict GO. La décision client est explicite et saine ; le choix
technique (réutiliser `access_requests`) est dans mon mandat.

## Cross-refs

- Surface publique introduite v1.4/1.5 : commits 61566f3 + 35b01cf (fiche
  publique → popup modale).
- Pattern coque/panel : [[shared-panel-two-shells]].
- Tunnel d'accès mot de passe : [[password-access-tunnel]].
