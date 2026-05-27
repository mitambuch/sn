---
id: friction-2026-05-27-access-request-step3-skip
date: 2026-05-27
type: friction
tags: [#auth, #forms, #friction, #client-specific, #p1]
scope: client-specific
status: active
---

# AccessRequestModal — Step 3 (Message) saute, submit direct depuis Step 2

## Symptôme reporté (owner, 2026-05-27 ~16:45)

Sur le wizard "Demander un accès" (3-step), après avoir rempli la
step 2 (Profil — phone/company/activity), l'utilisateur clique sur
le bouton de progression et **la step 3 (Message) ne s'affiche pas**
— le submit fire directement.

## État du code à l'audit

`src/features/access/AccessRequestModal.tsx` :

- `REQUEST_STEP_COUNT = 3`, `step ∈ {0, 1, 2}`
- Step 0 (Identité) : firstName + lastName + email — required
- Step 1 (Profil) : phone (required) + company + activity (optionnels)
- Step 2 (Message) : message textarea (optionnel) + legal + submit

Bouton de navigation conditionnel (lignes 398-423) :
- `step < REQUEST_STEP_COUNT - 1` → "Continuer" (type="button", onClick=goNext)
- sinon → "Envoyer" (type="submit")

`goNext` gate via `isStepComplete(step, form)` :
- REQUIRED_PER_STEP[0] = firstName/lastName/email
- REQUIRED_PER_STEP[1] = phone
- REQUIRED_PER_STEP[2] = [] (rien obligatoire)

Form onSubmit `handleRequestSubmit` :
```ts
if (step !== REQUEST_STEP_COUNT - 1) {
  goNext();
  return;
}
// submit
```

**À la lecture, la logique est correcte** — step 1 → bouton type=button → goNext → setStep(2) → render step 2.

## Hypothèses à tester (reproduction nécessaire)

1. **Enter pressé dans le phone input de step 1** déclenche le default
   browser form submit. handleRequestSubmit gate l'avance step 1 → 2.
   Mais visuellement, l'utilisateur pourrait voir la transition trop
   rapide et ne pas réaliser qu'il est sur step 2. La next pression
   Enter sur le textarea (qui n'est PAS un input simple) ne fire pas
   submit par défaut, mais...
2. **Double-firing** : peut-être que goNext s'exécute deux fois
   (clic + Enter qui passe le focus), ce qui ferait step 1 → 2 → 2
   (clamp), puis le second événement déclencherait submit ?
3. **i18n labels confondus** : peut-être que `t('...steps.next')` et
   `t('...submitRequest')` retournent la même chaîne ou similaire, et
   le bouton affiché sur step 1 est en fait le bouton submit ?
4. **isStepComplete bug** : si step 2 retourne true (rien requis), et
   qu'une race condition cause un re-render où `step === 2` apparaît
   sans que la UI step 2 ne soit montrée, l'utilisateur verrait
   "Envoyer" sans le textarea.

## Comment reproduire

Sur `https://sawnext.netlify.app` :
1. Ouvre DevTools console
2. Clique "Demander un accès"
3. Remplis step 0 (Identité) → Continuer
4. Remplis step 1 (Profil) — juste le phone → Continuer
5. Observe : la step 3 (Message) devrait apparaître avec un textarea

À investiguer dans la console : ajouter `console.log('step', step)`
au début du composant rendu pour tracer.

## Résolution provisoire

**Aucune** — pas bloquant pour la vitrine launch puisque message est
**optionnel**. La data atterrit dans `access_requests` avec
`message = NULL`. L'opérateur reçoit quand même l'email.

**À investiguer post-launch** :
- Reproduction step-by-step en DevTools
- Vérifier les labels i18n (FR + EN)
- Console.log step transitions
- Si bug confirmé → soit fixer la nav (type=button bien isolé), soit
  rendre step 2 visible automatiquement (skip explicit, justifié par
  "message optionnel et legal info à voir avant submit")

## Cross-refs

- `src/features/access/AccessRequestModal.tsx` lignes 88-160 (state +
  handlers) et 282-376 (step renders) et 398-423 (nav buttons)
- `src/locales/fr.json` clés `landing.access.modal.steps.*` et
  `landing.access.modal.submitRequest`
