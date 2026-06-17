---
id: standalone-public-page-outside-localeprovider
date: 2026-06-17
type: pattern
tags: [#routing, #i18n, #pattern, #client-specific]
scope: client-specific
status: active
---

# Page publique autonome à URL fixe, hors LocaleProvider

## Problème résolu

Une page publique qui doit vivre à une **URL propre top-level** (pas
`/:locale/…`) — QR de salon, partage, preview — multilingue, à chargement
instantané, sans dépendre des providers de l'app.

## Solution (validée sur `/QR`, commit e92dce7)

Route top-level **hors** de l'arbre `/:locale`, comme `/logo`, `/motion`,
`/share`, `/exemple` :

```tsx
<Route path="/QR" element={<QRPresentation />} />
```

La page **s'auto-gère** (elle n'est pas sous `LocaleProvider`) :

- **i18n** : `useTranslation()` + `<LanguageSwitcher />` **sans** `onLocaleChange`
  → le switcher appelle `i18n.changeLanguage` directement. `useTranslation`
  re-render la page au switch.
- **`<html lang>`** : sync manuel via `useEffect(() => { document.documentElement.lang = lang }, [lang])` (i18n-sanity leçon #3).
- **Meta** : émises **inline** (React 19 hoist `<title>`/`<meta>`). **Ne pas
  utiliser `SeoHead`** → il dépend de `useLocale()` (LocaleProvider) et crashe.
  `noindex` inline si la page est réservée (ex : exclusivité salon).
- **Reuse** : ok pour les atomes/contenu i18n (`landing.domains.*` réutilisés).
  **Éviter** les composants qui dépendent de `useLocale` (ex :
  `AccessRequestModal`) — ils crashent hors provider.

## Capture de lead anonyme (point critique)

Une page publique = visiteur **non authentifié**. `submitInquiry()` exige un
user authentifié, sinon il **simule** sans email → le lead est perdu en
silence. Écrire plutôt dans **`access_requests`** (policy anon-write,
migration 0012 → trigger Postgres → email Resend à l'opératrice), avec un
marqueur de source dans `activity` (ex : `"Salon / QR"`).

```tsx
await supabase.from('access_requests').insert({
  first_name, last_name, email, phone, activity: 'Salon / QR', message,
});
```

## Quand l'appliquer

- ✅ Landing/QR/preview à URL fixe, public, multilingue, hors funnel app.
- ❌ Page membre / catalogue (elles vivent sous `/:locale/account`, avec
  LocaleProvider + auth).

## Cross-refs

- `src/pages/QRPresentation.tsx`, `src/app/routes/index.tsx`
- `src/lib/inquiry.ts` (pourquoi submitInquiry ne suffit pas en anon)
- `src/features/access/AccessRequestModal.tsx` (le chemin access_requests)
