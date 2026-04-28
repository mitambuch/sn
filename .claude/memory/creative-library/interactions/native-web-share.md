---
id: interaction-native-web-share
date: 2026-04-23
type: pattern
tags: [#design, #pattern, #template, #active]
scope: template
status: active
---

# Native Web Share — chooser système + fallback clipboard

## Quoi

Bouton partage qui invoque le **Web Share API** natif (`navigator.share`)
— sur mobile ouvre le share sheet système (WhatsApp, iMessage, SMS,
Mail, Airdrop, etc.), sur desktop ouvre un dialog spécifique au
navigateur. Fallback = copie de l'URL dans le clipboard avec toast
confirmation.

## Pourquoi ça marche

- **Plateforme-native** : l'utilisateur voit les apps qu'il connaît
  (WhatsApp, Signal, Messages, Discord), pas un dialog custom.
- **Aucun setup** côté owner — pas de SDK Facebook/Twitter à intégrer.
- **Permission-free** : Web Share ne demande rien si invoqué dans un
  event user (click). Pas de popup *"Autoriser X à partager ?"*.
- **Privacy-friendly** : aucun tracker tiers, aucun iframe externe.
- **Fallback graceful** : copie URL + toast = still fonctionnel
  partout.

## Quand l'utiliser

- Pattern generic de partage quand tu ne sais pas quel canal préfère
  l'utilisateur (mix mobile/desktop, mix audiences).
- Page article / blog / portfolio
- Produit e-commerce (share avec ami avant achat)
- Page évènement
- Page profil / avis client

**Utile quand WhatsApp seul ne suffit pas** — pour FR/CH resto :
`share-whatsapp-prefilled` reste plus direct (1 tap au lieu de 2).

## Quand éviter

- Audience >95% mobile WhatsApp (FR/IT/CH resto/hôtel) — scheme
  dédié plus rapide.
- Besoin de texte pré-rempli par canal (WhatsApp vs Twitter ont des
  best practices différentes) — Web Share ne permet pas de tailler
  par destination.
- Desktop-only audience — sur Chrome desktop l'UX est dégradée
  (dialog moche vs mobile beau share sheet).

## Implémentation minimale

```tsx
// src/hooks/useShare.ts
import { useCallback, useState } from 'react';

interface ShareInput {
  title?: string;
  text?: string;
  url?: string;
}

export function useShare() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'shared' | 'error'>('idle');

  const share = useCallback(async (input: ShareInput) => {
    const data = {
      title: input.title,
      text: input.text,
      url: input.url ?? window.location.href,
    };

    // Feature-detect native share
    if (navigator.share && navigator.canShare?.(data)) {
      try {
        await navigator.share(data);
        setStatus('shared');
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          setStatus('idle'); // user cancelled — silent
          return;
        }
        // fall through to clipboard
      }
    }

    // Fallback: clipboard
    try {
      await navigator.clipboard.writeText(data.url ?? '');
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
    }
  }, []);

  return { share, status };
}
```

```tsx
// Usage
const { share, status } = useShare();

<button onClick={() => share({ text: 'Regarde ça', url: window.location.href })}>
  {status === 'copied' ? 'Lien copié !' : 'Partager'}
</button>
```

## Variantes

- **Share files** : `navigator.share({ files: [...] })` pour partager
  image/PDF. Support partiel (Chrome Android OK, Safari iOS 16+,
  desktop mixte).
- **Contextual text** : adapter le `text` selon la page (produit :
  *"J'ai trouvé ce produit"*, article : titre de l'article).
- **Multi-action** : afficher un bouton plus spécifique (WhatsApp) ET
  un bouton générique Web Share à côté — l'utilisateur choisit.

## a11y / browser support

- **a11y** : annoncer le status du fallback au lecteur d'écran via
  `aria-live="polite"`. Le toast *"Lien copié"* doit être annoncé, pas
  juste visuel.
- **Browser support** (janvier 2026) :
  - Chrome Android : ✓ full
  - Safari iOS : ✓ full
  - Chrome/Edge desktop : ✓ depuis 2021
  - Firefox desktop : ✗ → fallback clipboard
  - Firefox Android : partial (text/url OK, files non)
- **`canShare()`** : tester avant `share()` pour éviter `TypeError`
  sur navigateurs partiels.

## Refs

- MDN Web Share API — https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
- caniuse share — https://caniuse.com/web-share

## Cross-refs

- `interactions/share-whatsapp-prefilled.md` — pattern canal spécifique
- `rules/ux-first.md` §*Share hook*
