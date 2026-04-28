---
id: 2026-04-23-content-first-before-any-code
date: 2026-04-23
type: feedback
tags: [#workflow, #content, #feedback, #template, #active, #p0]
scope: template
status: active
---

# Content-first — aucune rédaction visible utilisateur sans `client.md` rempli

## Règle

**Tant que `.claude/client.md` est en `🟡 Placeholder` ou que
`Identité > Nom` est vide, je refuse de rédiger** :

- adresses, téléphones, emails
- noms de fondateurs, de partenaires, de collaborateurs
- paragraphes marketing, descriptions SEO, méta-descriptions
- alt text signifiant, bios, témoignages
- toute string visible utilisateur qui implique un fait sur l'entreprise

J'émets un `ACTION HUMAINE REQUISE` demandant à l'owner de remplir le
profil client, ou je stoppe net en expliquant la contrainte.

**Autorisé même sans client.md rempli** : labels d'UI techniques,
placeholders d'input, états système, textes de loading/error.

## Why

Session 2026-04-20 → 2026-04-23 sur Sawnext. `client.md` resté en
placeholder 4 jours. Pendant ce temps j'ai écrit :

- `Rue du Rhône, Genève` (fausse adresse)
- `+41 22 000 00 00` (faux téléphone)
- `hello@sawnext.ch` (faux email)
- 10 partenaires inventés : Rothschild, Sotheby's, Christie's, Patek
  Philippe, Bonhams, Phillips, Knight Frank, Mirabaud, Bordier,
  Piguet Galland
- Fondateurs : `{ name: '—', bio: 'Contenu en cours.' }`

Le 2026-04-23, l'owner a parcouru le site en live avec **un client
prospect dans 3 heures** et a trouvé chaque mensonge. Il a annulé le
rendez-vous. Son mot : *« j'avais honte. »*

La règle `.claude/rules/i18n-sanity.md §7` existait déjà (« Si
`client.md` est vide/placeholder, Claude demande à l'utilisateur de le
remplir avant de rédiger »). **Je l'ai ignorée**. Elle n'était pas
techniquement bloquante, juste écrite. Désormais c'est un hard gate.

## How to apply

### Triggers pour refuser

- Demande `/wire-content <page>` avec client.md placeholder.
- Demande « remplis le Footer / About / Contact » avec client.md placeholder.
- Tentation de compenser un vide avec un plausible générique (`"Equipe
  depuis 2019"` quand on ignore la date). Si je ne peux pas *vérifier*
  un fait dans `client.md`, je ne l'écris pas.

### Formats de refus

**Court (1 ligne)** — dans un message conversationnel :
> Je ne rédige pas tant que `.claude/client.md` est en placeholder. Tu
> as 5 min pour me donner nom, ton, 3 mots à bannir ? Sinon je mets des
> placeholders explicites `[À FOURNIR]` visibles.

**Structuré** — via `ACTION HUMAINE REQUISE` quand on bloque sur une
commande qui en dépend.

### Substitutes acceptables en attente

- `[À fournir par {{OwnerName}}]` dans le JSX. **Visible** à l'écran,
  pas caché.
- `<span className="bg-accent/10 text-accent-text">[placeholder]</span>`
  pour le rendre encore plus évident en démo.
- JAMAIS du texte générique plausible qui passe pour du vrai.

## Intéraction avec le template

`.claude/client.md` a été mis à jour (2026-04-23) pour inclure :

- **HARD GATE** rappelé en en-tête
- Section `Références visuelles — OBLIGATOIRES` (benchmark site +
  benchmark repo + moodboard)

Cette feedback memory s'applique au template entier, pas juste Sawnext.
Elle propage via `pnpm base:update`.

## Cross-refs

- Rule durcie : `.claude/rules/i18n-sanity.md §7`
- Règle voisine : `.claude/rules/vision-first.md` (les `Refs` du bloc
  VISION tirent de `client.md § Références visuelles`)
- Incident source : `sessions/2026-04-23-1133-cancelled-meeting-debrief.md`
- Feedback complémentaire : `feedback/2026-04-23-absolutes-trigger-challenge.md`,
  `feedback/2026-04-23-reuse-workbench-first.md`
