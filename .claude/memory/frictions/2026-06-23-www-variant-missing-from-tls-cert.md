---
id: www-variant-missing-from-tls-cert
date: 2026-06-23
type: friction
tags: [#deploy, #security, #friction, #client-specific]
scope: client-specific
status: resolved
---

# « Cette connexion n'est pas privée » sur `www.saw-next.ch` — variante www absente du certificat

## Symptôme (signalé par un visiteur, via Salva)

Safari affiche l'alerte rouge « Cette connexion n'est pas privée — ce site tente
peut-être de se faire passer pour www.saw-next.ch ». Uniquement sur l'adresse
avec **`www.`** devant ; `saw-next.ch` (sans www) marche parfaitement.

## Cause (diagnostiquée par inspection du certificat, pas de code)

`www.saw-next.ch` pointait bien vers Netlify, MAIS n'était pas déclaré comme
domaine sur le site Netlify → Netlify servait son **certificat générique
`*.netlify.app`** pour cette variante. Le navigateur voit un certificat dont le
nom ne correspond pas → `SEC_E_WRONG_PRINCIPAL` / WRONG_PRINCIPAL → alerte.

Le certificat Let's Encrypt couvrait `saw-next.ch`, `sawnext.ch`,
`www.sawnext.ch` (sans tiret) — mais **pas `www.saw-next.ch`** (le www du
domaine canonique avec tiret avait été oublié à la config initiale).

**Ce n'est ni un piratage ni lié à un déploiement de code.** Un déploiement de
code ne touche pas le certificat/DNS. C'était une config domaine incomplète,
latente depuis le départ.

## Diagnostic reproductible

```bash
# Doit échouer (exit 60, WRONG_PRINCIPAL) si la variante n'est pas couverte :
curl -sSI https://www.saw-next.ch
# Lire les noms couverts par le certificat (champ SAN) :
echo | openssl s_client -connect www.saw-next.ch:443 -servername www.saw-next.ch \
  | openssl x509 -noout -subject -ext subjectAltName
```

## Résolution

Netlify → site → **Domain management** → **Add a domain** → `www.saw-next.ch`.
Comme `saw-next.ch` est le domaine principal, Netlify redirige automatiquement
`www` → apex ET régénère le certificat en l'incluant. Vérifié après coup : le
SAN contient désormais `www.saw-next.ch`, `curl` renvoie HTTP 200, ssl_verify=0.

## Pour que ça ne se reproduise pas

- À toute mise en ligne d'un domaine custom : déclarer **les 4 variantes**
  (apex + www, avec ET sans tiret si les deux orthographes existent), pas
  seulement l'apex canonique.
- Un redirect `netlify.toml` ne suffit PAS : le handshake TLS échoue AVANT que
  la redirection HTTP ne s'applique → la variante doit avoir son propre
  certificat, donc être déclarée côté hébergeur.
- Lien domaine canonique : [[password-access-tunnel]] (canonique = `saw-next.ch`
  avec tiret).
