---
id: interaction-one-tap-call-contextual
date: 2026-04-23
type: pattern
tags: [#design, #pattern, #template, #active]
scope: template
status: active
---

# One-Tap Call Contextual — bouton tel: avec contexte préservé

## Quoi

Bouton *"Appeler"* qui ouvre le dialer avec le numéro pré-rempli (scheme
`tel:`), accompagné d'un **contexte visuel** qui confirme ce que
l'utilisateur va appeler (nom, horaires, rappel du service). Sur
desktop, fallback = afficher le numéro + bouton *"Copier"*.

## Pourquoi ça marche

- **1 tap = appel en cours.** Sur mobile, `tel:41791234567` ouvre le
  dialer natif avec le numéro pré-rempli, l'utilisateur n'a qu'à
  valider.
- **Zéro copie-colle** : le copier-coller du numéro est la friction
  #1 sur mobile pour un site de commerce local.
- **Contexte rassure** : afficher *"Réception Hôtel du Soleil —
  7h-22h"* à côté du numéro évite le doute *"je suis bien sur le bon
  service ?"*.
- **Desktop dignified** : sur desktop le `tel:` est inutile (pas de
  dialer), mais copier le numéro reste rapide avec 1 bouton.

## Quand l'utiliser

- Restaurant / hôtel / boutique / garage / cabinet — tout commerce
  local avec téléphone prioritaire
- Page contact d'agence (directe vers le commercial)
- Support / urgence — affichage prominent (pas caché en footer)
- Page *"Comment venir"* d'un lieu physique

## Quand éviter

- SaaS B2B — l'utilisateur veut un email / Intercom, pas un appel
- Audience < 30 ans - préfèrent DM/chat à l'appel
- Horaires très restreints sans contexte affiché — le user appelle en
  dehors, hang up côté business, mauvaise expérience
- Numéro surtaxé sans le dire (illegal en plus)

## Implémentation minimale

```tsx
// src/components/ui/CallButton.tsx
import { Phone } from 'lucide-react';

interface Props {
  phone: string; // E.164 sans '+', ex "41791234567"
  display?: string; // format lisible "+41 79 123 45 67"
  context?: string; // ex "Réception — 7h-22h"
  onDesktopCopy?: () => void;
}

export function CallButton({ phone, display, context, onDesktopCopy }: Props) {
  const href = `tel:+${phone}`;
  const formatted = display ?? `+${phone}`;
  const isMobile = typeof window !== 'undefined'
    && /Mobi|Android|iPhone/.test(navigator.userAgent);

  if (isMobile) {
    return (
      <a href={href} className="..." aria-label={`Appeler ${context ?? formatted}`}>
        <Phone aria-hidden="true" />
        <span>
          <strong>Appeler</strong>
          {context && <span className="text-xs block">{context}</span>}
        </span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(formatted);
        onDesktopCopy?.();
      }}
      className="..."
    >
      <Phone aria-hidden="true" />
      <span>
        <strong>{formatted}</strong>
        <span className="text-xs block">Cliquer pour copier</span>
      </span>
    </button>
  );
}
```

## Variantes

- **Click-to-Call tracking** : wrapper dans un analytics event pour
  mesurer les clicks (signe d'intent fort).
- **WhatsApp fallback** : *"Pas le temps d'appeler ? Écrivez-nous sur
  WhatsApp"* sous le bouton call — convertit un intent call en message.
- **Horaires dynamiques** : désactiver le bouton ou afficher *"Fermé —
  ouvre à 9h"* en dehors des heures d'ouverture.
- **Multi-service** : si plusieurs lignes (réception / restaurant /
  spa), afficher en groupe avec contexte par ligne.

## a11y / mobile / privacy

- **a11y** : `aria-label` incluant le contexte (*"Appeler la
  réception"*), icône `aria-hidden`, focus keyboard visible.
- **Mobile detection** : l'UA sniffing est imparfait — `tel:` sur
  desktop ouvre rien (Chrome demande une app par défaut = friction).
  Fallback copy est le safe play.
- **Privacy** : le `tel:` n'expose rien côté user, mais l'analytics
  qui track le click expose la metadata — respecter le consent mode.
- **iOS safari** : le lien `tel:` fonctionne depuis forever. Android
  Chrome idem. Pas de spécificité.

## Mesurer le gain

- Clicks sur bouton call (event GA/Plausible)
- Ratio call vs form submit (si les deux existent) — indicateur du
  mode de contact préféré
- Coupler avec un numéro spécifique à ce bouton pour tracker les
  appels effectifs (call-tracking provider type CallRail)

## Refs

- MDN tel: URI scheme — https://developer.mozilla.org/en-US/docs/Web/URI/Schemes/tel
- E.164 format — https://en.wikipedia.org/wiki/E.164

## Cross-refs

- `interactions/zero-click-copy.md` — pattern copy similaire
- `interactions/share-whatsapp-prefilled.md` — fallback message async
- `rules/ux-first.md` §*Friction*
