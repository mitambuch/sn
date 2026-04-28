---
id: interaction-zero-click-copy
date: 2026-04-23
type: pattern
tags: [#design, #pattern, #template, #active]
scope: template
status: active
---

# Zero-Click Copy — copier une donnée utile sans sélection manuelle

## Quoi

Un bouton *"Copier"* (icône 📋) à côté d'une donnée utile (adresse,
IBAN, numéro de compte, code promo, commande CLI, email de contact)
qui copie au clipboard en **1 tap** + toast confirmation.

Remplace le workflow classique : select → cmd+C / long-press → copier.
Surtout pénible sur mobile où la sélection de texte est imprécise.

## Pourquoi ça marche

- **Élimine la friction sélection** — particulièrement sur mobile où
  sélectionner une partie d'un paragraphe est approximatif.
- **Feedback instantané** : toast *"Copié !"* confirme l'action, évite
  le doute *"ai-je bien copié ?"*.
- **Pattern attendu** : les users IT connaissent depuis GitHub code
  blocks. Hors IT, se diffuse via Apple Wallet, Revolut, etc.
- **Réduit erreurs de saisie** : un IBAN copié intact vs saisie à la
  main = moins d'échecs de virement.

## Quand l'utiliser

- Adresse physique du commerce (à mettre dans GPS)
- IBAN / RIB / coordonnées bancaires (virement acompte)
- Email de contact (coller dans son client mail)
- Numéro de commande / référence client
- Code promo / offre
- Commande shell / snippet de code (dev-facing)
- Wifi password (hôtel, café, co-working)

## Quand éviter

- Texte libre long (paragraphe, article) — l'utilisateur ne veut pas
  tout copier, le pattern devient un bruit.
- Donnée sensible affichée partiellement (numéro de carte masqué) —
  copier un truc incomplet = friction, pas gain.
- Usage unique rare (footer email de contact qu'aucun user ne copie)
  — ajouter un bouton = surface UI pour rien.

## Implémentation minimale

```tsx
// src/components/ui/CopyField.tsx
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  value: string;
  label?: string; // a11y — ex "Copier l'adresse"
  displayValue?: string; // si différent du value copié (ex masquage)
}

export function CopyField({ value, label = 'Copier', displayValue }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: fallback manuel via input hidden + execCommand si besoin
      // (Chrome < 66 / Safari < 13.1 — rare en 2026)
    }
  };

  return (
    <div className="flex items-center gap-2">
      <code className="font-mono text-sm">{displayValue ?? value}</code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={label}
        className="..."
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        <span className="sr-only">{copied ? 'Copié' : label}</span>
      </button>
    </div>
  );
}
```

```tsx
// Usage page contact
<CopyField
  value="hello@studio.ch"
  label="Copier l'email"
/>

<CopyField
  value="CH93 0076 2011 6238 5295 7"
  displayValue="CH93 ••••  2011 6238 5295 7"
  label="Copier l'IBAN"
/>
```

## Variantes

- **Full-row click** : la ligne entière est cliquable (pas juste le
  bouton), avec un highlight au hover. Gain : zone de tap plus large.
- **Auto-select** : l'utilisateur clique le texte → sélection complète
  faite pour lui (sans copy automatique — respect intent).
  Implémentation : `onClick` + `selectAllText` via `document.createRange`.
- **Sensitive reveal** : masquer par défaut (IBAN avec •), *"Révéler"*
  avant copy. Pour données semi-sensibles.
- **Feedback haptic** : vibration courte sur copy succès (mobile
  Android). Voir pattern haptic-confirm (emerging-inputs) à venir.

## a11y / privacy

- **a11y** : label explicite sur le bouton (*"Copier l'adresse"*,
  pas *"Copier"* seul), icône `aria-hidden`, confirmation via
  `aria-live="polite"` ou visuel + screen reader text (`sr-only`).
- **Focus** : le bouton doit être focusable, `aria-pressed={copied}`
  facultatif pour l'état.
- **Privacy** : `navigator.clipboard.writeText()` nécessite un secure
  context (HTTPS). En dev local `localhost` est considéré secure, OK.
- **Fallback legacy** : navigateurs < 2020 ne supportent pas Clipboard
  API. Fallback : input hidden + `document.execCommand('copy')`. Rare
  en 2026, pas critique.

## Refs

- MDN Clipboard API — https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
- WCAG Success Criterion 3.3.5 Help — pattern copy = aide à saisie

## Cross-refs

- `interactions/one-tap-call-contextual.md` — fallback copy desktop
- `interactions/share-whatsapp-prefilled.md` — partage vs copy
- `rules/ux-first.md` §*Friction*
