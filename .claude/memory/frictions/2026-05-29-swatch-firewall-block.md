---
id: friction-swatch-firewall-block
date: 2026-05-29
type: friction
tags: [#deploy, #security, #client-specific]
scope: client-specific
status: active
---

# Friction — Firewall Swatch Group bloque saw-next.ch en "high-risk"

## Ce qui bloque

Le 2026-05-29 vers 14:30, l'owner a tenté de montrer le site à un
contact Swatch Group (user AD `swatchgroupnet\jdz-sanrap`). Le
firewall datacenter Swatch (signature Palo Alto Networks PAN-DB) a
bloqué l'accès à `www.saw-next.ch` avec la page "Web Page Blocked",
catégorie : `high-risk`, application : `web-browsing`.

C'est purement une catégorisation URL côté Palo Alto — **pas un
problème de notre code ni de notre stack**.

## Pourquoi le domaine est classé high-risk

Réputationnel pur :

1. **Domaine récent** — saw-next.ch enregistré ~mai 2026, < 3 mois
   d'historique. Palo Alto PAN-DB met les NRD (newly registered
   domains) en high-risk par défaut.
2. **Aucun trafic historique** — pas de signal positif pour
   contrebalancer.
3. **TLD .ch + nom court + look "boutique"** — heuristique de
   risque plus élevée que `.com` corporate connu.
4. **Pas dans les bases de réputation** (Alexa, OISD, Cisco
   Talos) — unknown = high-risk par défaut.

C'est exactement ce qui arrive à tout site neuf qu'on essaie
d'accéder depuis une grosse boîte (Nestlé, Roche, Novartis,
UBS — mêmes symptômes).

## Résolution (à exécuter par owner)

### Voie A — Recatégorisation Palo Alto (canonique, 24-48h)

Soumettre le domaine sur https://urlfiltering.paloaltonetworks.com/

- URL : `https://www.saw-next.ch`
- Demande : `Recategorize from 'high-risk' to 'Business and Economy'`
- Justification (prête à coller) :

> Sawnext is a registered Swiss private concierge platform (Sàrl,
> Boudry CH) offering curated access to events, properties,
> timepieces, artworks and travel for vetted HNW clientele. Site
> launched May 2026. No malicious content. Site uses standard
> infrastructure (Netlify hosting, Sanity CMS, Supabase backend).
> Please recategorize to Business and Economy.

Une fois recatégorisé chez Palo Alto, **toutes les boîtes du
monde** qui utilisent PAN-DB héritent de la nouvelle catégorie
automatiquement.

### Voie B — Whitelist côté IT Swatch (immédiat, requiert humain)

Si le contact `jdz-sanrap` peut ping son IT, ticket pour whitelister
`saw-next.ch` + dépendances :
```
saw-next.ch
*.supabase.co (HTTPS + WebSocket WSS)
*.api.sanity.io
*.apicdn.sanity.io
cdn.sanity.io
res.cloudinary.com
*.ingest.sentry.io
*.ingest.us.sentry.io
*.ingest.de.sentry.io
```

## Lesson pour les futurs clients enterprise

Anticiper le problème : pour tout client HNW dans une grosse
boîte (banque, horlogerie, pharma), prévoir 48h de buffer avant
la démo pour :

1. Soumettre la recat Palo Alto si pas déjà fait.
2. Demander au contact de tester depuis son réseau pro AVANT la
   démo, pour qu'il puisse activer un ticket IT en parallèle.
3. Avoir un plan B : démo depuis téléphone (4G/5G hors réseau
   corporate), ou capture vidéo.

Pourrait être codé dans `/morning-brief` quand un nouveau client
enterprise est dans le carnet : warn 48h avant la deadline si la
recat n'est pas confirmée.

## Cross-refs

- Session source : [sessions/2026-05-29-1406.md](../sessions/2026-05-29-1406.md)
- Règle security : `.claude/rules/security.md` (CSP, headers)
- CSP source : `netlify.toml` (Content-Security-Policy header)
- Palo Alto PAN-DB : https://urlfiltering.paloaltonetworks.com/
