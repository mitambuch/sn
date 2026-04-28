---
id: interaction-share-whatsapp-prefilled
date: 2026-04-23
type: pattern
tags: [#design, #pattern, #template, #active]
scope: template
status: active
---

# Share WhatsApp Prefilled — bouton envoie un message pré-rempli

## Quoi

Un bouton qui ouvre WhatsApp (app mobile ou WhatsApp Web) avec un
**texte pré-rempli** pointant vers la page courante. L'utilisateur n'a
qu'à choisir le destinataire — zéro typing.

URL scheme universel : `https://wa.me/?text=<encoded message>` (sans
numéro = partage général) ou `https://wa.me/<phone>?text=<encoded>`
(direct à un numéro).

## Pourquoi ça marche

- **1 tap au lieu de 4** : copy URL → ouvrir WhatsApp → choisir contact
  → paste. Le bouton compresse en 1 geste.
- **Texte pré-écrit** = zéro friction rédaction. L'utilisateur poste ce
  qu'il n'aurait jamais pris le temps d'écrire.
- **WhatsApp = canal relation proche** en Europe continentale
  (FR/DE/IT/CH). Partages qualifiés, pas dilution.
- **Mobile-first** : le scheme `wa.me` déclenche l'app native si
  installée, fallback WhatsApp Web sinon. Pas de détection manuelle.

## Quand l'utiliser

- Page menu restaurant / plats du jour → *"Regarde le menu ce soir"*
- Page offre promotionnelle → *"Check ce deal avant vendredi"*
- Page évènement / concert → *"On y va ensemble ?"*
- Page produit unique / recommandation → *"J'ai trouvé ça"*
- Page booking dispo → *"Je réserve pour 2 demain ?"*
- Tout contenu avec forte charge émotionnelle ou urgence implicite

## Quand éviter

- B2B / SaaS — LinkedIn ou email sont plus naturels
- Contenu confidentiel (tarifs négociés, contrats, données client)
- Audience < 25 ans en US/UK — iMessage/Signal dominent, WhatsApp
  moins naturel
- Page de contact principale — la personne veut TE joindre, pas
  partager avec un pote
- Page où `Goal user` est consommation solo (lecture article long)

## Implémentation minimale

```tsx
// src/components/ui/ShareWhatsAppButton.tsx
interface Props {
  text: string; // message pré-rempli, URL incluse si souhaitée
  phone?: string; // E.164 sans '+', ex: "41791234567" ; omit pour partage général
  label?: string;
}

export function ShareWhatsAppButton({
  text,
  phone,
  label = 'Envoyer à un pote',
}: Props) {
  const base = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
  const href = `${base}?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="..."
      aria-label={`${label} via WhatsApp`}
    >
      {label}
    </a>
  );
}

// Usage sur page menu restaurant
<ShareWhatsAppButton
  text={`Regarde le menu ce soir : ${window.location.href}`}
/>
```

## Variantes

- **Sans numéro** (`wa.me/?text=...`) : WhatsApp ouvre chooser contact.
  Usage : partage général.
- **Numéro du client** (`wa.me/41791234567?text=...`) : message direct
  au business (réception hôtel, restaurant). Usage : contact préféré
  WhatsApp.
- **Multilingue** : détecter `i18n.language` et servir le texte dans
  la langue du visiteur.
- **UTM-tagged** : inclure `?utm_source=whatsapp-share` dans l'URL
  partagée pour mesurer.

## a11y / mobile / privacy

- **a11y** : `aria-label` explicite, contrast suffisant, icône +
  texte (pas icône seule).
- **Mobile** : `target="_blank"` + `rel="noopener noreferrer"` —
  évite hijack de l'onglet courant quand WhatsApp Web s'ouvre dans
  le même onglet. Sur mobile le scheme `wa.me` route vers l'app.
- **Privacy** : le texte pré-rempli est visible dans l'URL partagée.
  Ne pas inclure de PII, session ID, ou token.
- **Desktop sans WhatsApp Web** : fallback = `whatsapp://send?text=`
  qui échoue silencieusement. Accepter la friction ou détecter UA.

## Variantes multi-plateforme (si nécessaire)

Pour couvrir iMessage (iOS) + SMS (Android) + WhatsApp :

```tsx
// Web Share API natif — plateforme choisit
if (navigator.share) {
  await navigator.share({ text, url: window.location.href });
}
// Voir interactions/native-web-share.md
```

Si WhatsApp est *le* canal visé (resto, hôtel, petits commerces FR/CH),
pattern dédié reste meilleur. Web Share ouvre une sélection, ajoute un
choix à faire — 1 tap supplémentaire.

## Refs

- WhatsApp click-to-chat — https://faq.whatsapp.com/5913398998672934
- Exemple owner : hotel-vda.ch bouton `Carte des mets` (2026-04-23)

## Cross-refs

- `interactions/native-web-share.md` — alternative système natif
- `interactions/one-tap-call-contextual.md` — pattern tel: similaire
- `rules/ux-first.md` §*Share hook*
