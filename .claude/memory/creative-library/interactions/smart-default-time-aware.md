---
id: interaction-smart-default-time-aware
date: 2026-04-23
type: pattern
tags: [#design, #pattern, #template, #active]
scope: template
status: active
---

# Smart Default Time-Aware — pré-sélection selon heure locale

## Quoi

Remplacer un sélecteur par défaut neutre (*"Choisir"*, placeholder vide)
par une **pré-sélection intelligente** basée sur l'heure locale du
visiteur. Exemple : menu restaurant pré-sélectionne *"Déjeuner"* avant
14h, *"Dîner"* après 18h. L'utilisateur peut changer — mais souvent il
n'a pas à.

Pattern minuscule, impact disproportionné sur les pages où 80% des
visites tombent dans une intention prévisible par l'heure.

## Pourquoi ça marche

- **Law of Least Astonishment** : l'utilisateur voit l'info qu'il
  attend sans interagir. À 20h, il veut voir le menu du soir, pas
  celui du midi.
- **Réduit clicks par défaut** — pour 80% des visites, 0 interaction
  nécessaire.
- **Respect du choix** : le toggle reste visible et modifiable. On
  guide, on ne force pas.
- **Ressenti de *"le site me comprend"*** : petit détail qui signale
  un soin product.

## Quand l'utiliser

- Menu restaurant (midi / soir) — 80/20 évident
- Horaires d'ouverture — afficher "Ouvert" / "Ferme dans X" selon now()
- Page événement (prochaine session visible d'abord)
- Page booking (date = aujourd'hui+1 par défaut plutôt que vide)
- Page météo / conditions (aujourd'hui sélectionné)
- Tab par défaut sur une page multi-vues (ex : Restaurant / Spa / Chambres
  → selon source referrer ou heure)

## Quand éviter

- Decision space où l'utilisateur doit explicitement exprimer un choix
  (préférence alimentaire, opt-in) — pré-sélection = manipulation.
- Audience internationale sans timezone stable — le serveur ne connaît
  pas la TZ du user. Faire en client-side seulement.
- Donnée critique (dosage médical, config financière) — erreur de
  default = dégât.

## Implémentation minimale

```tsx
// src/hooks/useTimeAware.ts
import { useEffect, useState } from 'react';

type MealService = 'lunch' | 'dinner' | 'closed';

function inferMealService(now: Date = new Date()): MealService {
  const hour = now.getHours();
  const day = now.getDay(); // 0 = dimanche
  // Example: restaurant fermé dimanche soir
  if (day === 0 && hour >= 15) return 'closed';
  if (hour >= 11 && hour < 14) return 'lunch';
  if (hour >= 18 && hour < 23) return 'dinner';
  // entre 14h et 18h : dinner proche, pré-sélection dinner
  if (hour >= 14 && hour < 18) return 'dinner';
  return 'lunch'; // matin ou nuit tardive → lunch par défaut
}

export function useMealService(): [MealService, (m: MealService) => void] {
  const [service, setService] = useState<MealService>(() => inferMealService());

  // Optionnel : refresh à midi et 18h si onglet reste ouvert
  useEffect(() => {
    const tick = () => setService((prev) => {
      const inferred = inferMealService();
      return prev === inferred ? prev : inferred;
    });
    const interval = setInterval(tick, 60_000);
    return () => clearInterval(interval);
  }, []);

  return [service, setService];
}
```

```tsx
// Usage page menu
const [service, setService] = useMealService();

<Tabs value={service} onValueChange={setService}>
  <TabsList>
    <TabsTrigger value="lunch">Déjeuner</TabsTrigger>
    <TabsTrigger value="dinner">Dîner</TabsTrigger>
  </TabsList>
  <TabsContent value="lunch"><MenuLunch /></TabsContent>
  <TabsContent value="dinner"><MenuDinner /></TabsContent>
</Tabs>
```

## Variantes

- **Horaires d'ouverture dynamique** : afficher *"Ouvert · ferme dans
  2h14"* ou *"Fermé · ouvre demain à 9h"* selon now() + config hours.
- **Season-aware** : plage horaire pré-sélectionne "Terrasse" en été,
  "Salle" en hiver.
- **Referrer-aware** : si user vient d'un lien Instagram story =
  contenu visuel first. Si user vient de Google Search "prix" = Pricing
  tab first.
- **Day-of-week** : weekends = brunch sur menus spéciaux.

## a11y / SSR / timezone

- **a11y** : annoncer le changement de tab via `aria-live` si la
  bascule se fait automatiquement en cours de session (rare, mais si
  17h59 → 18h01 le user voit le contenu changer = surprise).
- **SSR** : **ne pas pré-sélectionner côté serveur** — le serveur ne
  connaît pas la TZ du visiteur. Toujours client-side via
  `useEffect` après hydratation. Sinon hydration mismatch.
- **Timezone** : `new Date().getHours()` = TZ du client. Pas besoin
  de lib. Pour des cas internationaux (affichage des horaires de
  Paris pour un visiteur à Dubai) = `Intl.DateTimeFormat` avec
  `timeZone: 'Europe/Paris'`.
- **Fallback UI** : le premier render doit être déterministe. Tab
  *"Déjeuner"* affiché en SSR + switch en client-side si besoin.
  Sinon flicker.

## Anti-patterns

- **Auto-switch intempestif** : re-inférer toutes les 30 secondes et
  switcher la vue sans input user = perte de focus. Limiter à un
  switch initial par session ou sur interaction.
- **Pré-sélection cachée** : rendre le toggle invisible = l'utilisateur
  ne sait pas qu'il peut changer. Toujours exposer le contrôle.
- **Inférence trop fine** : un site resto qui pré-sélectionne
  différemment à 13h00, 13h15, 13h30 = overkill. 2-3 tranches
  suffisent.

## Refs

- Jakob Nielsen — *Designing Smart Defaults* (NNGroup, 2019).
- Exemple cité : Apple Weather pré-sélectionne l'heure courante.

## Cross-refs

- `interactions/secondary-menu-deep-link.md` — pattern complémentaire
  pour accès rapide
- `rules/ux-first.md` §*Friction*
