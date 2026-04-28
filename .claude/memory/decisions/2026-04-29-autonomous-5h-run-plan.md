---
id: 2026-04-29-autonomous-5h-run-plan
date: 2026-04-29
type: decision
tags: [#workflow, #decision, #client-specific, #p0]
scope: client-specific
status: active
---

# Run autonome 5h — protocole + checklist + stop conditions

## Décision

Le 2026-04-29 matin, l'owner ouvre une session **auto-mode 5h non-stop**
sur le projet Sawnext Studio. L'objectif : avancer lots A.5 → E (au
moins partiellement) sans baby-sitting.

L'owner orchestre en parallèle un **cross-audit via Codex + Gemini**
(agents externes). Claude (cette instance) produit le code ; les autres
agents auditent les diffs / l'archi / la qualité.

L'owner attend que Claude livre un **runbook étape par étape** —
prompts auto-suffisants par lot, dispatchables, avec stop conditions
explicites — pour pouvoir piloter l'auto-mode sans rester scotché à
l'écran.

## Why

- Velocity : 5h de Claude focused = ~2-3 lots du roadmap si le
  scope est cadré et que les keys/comptes sont fournis upfront.
- Cross-audit Codex/Gemini = filet contre la dérive complaisante /
  les choix non challengés (anti-complaisance étendu à du LLM peer
  review).
- Owner peut faire autre chose pendant que ça tourne, tant que les
  stop conditions sont respectées.

## Pre-requirements — owner DOIT fournir AVANT de lancer auto-mode

Sans ces inputs, je bloque dans les 30 minutes max et je perds 4h.

### 1. Comptes externes créés + clés en `.env.local`

| Service | Variable | Source |
|---|---|---|
| Supabase EU (Frankfurt) | `VITE_SUPABASE_URL` | dashboard.supabase.com → project → Settings → API |
| Supabase EU | `VITE_SUPABASE_ANON_KEY` | idem |
| Supabase EU | `SUPABASE_SERVICE_ROLE_KEY` (backend only, no VITE_) | idem (À NE JAMAIS COMMIT) |
| Resend | `RESEND_API_KEY` (backend only) | resend.com → API Keys |
| Resend | `VITE_RESEND_FROM_EMAIL` | sender domain configuré + DNS validé |
| Sanity (si éditorial activé) | `VITE_SANITY_PROJECT_ID` + write token | sanity.io/manage |

→ Si une key manque, j'émets `🧑 ACTION HUMAINE REQUISE` et j'attends.

### 2. Décisions produit pré-tranchées (pour ne pas pinger en boucle)

Réponses **avant le run**, sinon je m'arrête au premier doute :

- **Domaine email expéditeur Resend ?** (ex : `notifications@sawnext.studio`)
  vs `concierge@…` vs autre.
- **Email destinataire des inquiries (Salva) ?** (l'adresse exacte).
- **Magic link expiration ?** (15 min recommandé Supabase default — OK ?).
- **Code invitation expiration ?** (30 jours par défaut — OK ?).
- **Code invitation usage ?** (single-use — déjà cadré, mais multi-use admin
  par ex pour comptes pilotes ?).
- **Champs métier des items** (lots C-D) — fournir une **liste par module** :
  - Event : titre, dates, lieu, description, photos, capacité, prix indicatif/sur demande, catégorie ?
  - Property : titre, lieu, surface, chambres, type (location/vente), photos, description, prix indicatif/sur demande ?
  - Timepiece : marque, modèle, référence, année, état, complications, photos, prix sur demande ?
  - Artwork : artiste, titre, année, technique, dimensions, photos, prix sur demande, certificat ?
  - Journey : titre, destination, durée, période, photos, programme, prix indicatif ?
  - Concierge : pas une fiche produit, juste un formulaire ouvert "votre demande" ?
- **Tarification affichée ?** "sur demande" only OU prix indicatif visible OU mixte par module ?
- **Fiche détail = single page OU multi-tab ?** (galerie photos + description + caractéristiques + bouton intérêt sur une seule page recommandé).
- **Email à Salva sur inquiry — contenu ?** (item title + client email + message + lien vers admin pour répondre). Template à valider ou je propose ?
- **Statut item visible côté client ?** (pas de stock, mais "réservé" / "vendu" doit-il apparaître publiquement ou Salva retire la fiche manuellement ?).
- **Onboarding post-redeem-code = quels champs ?** (juste email + nom ? préférences modules ? téléphone ?).
- **DPI / images** : Cloudinary (déjà câblé) OU upload direct Sanity ?

→ Si une décision manque, je propose ma reco par défaut + je continue
SI elle est de niveau R1, je pose `🧑 ACTION HUMAINE REQUISE` SI R2.

### 3. Mode opératoire avec les autres agents (Codex + Gemini)

À clarifier demain matin :
- Quand je commit un chunk, est-ce que toi ou un script déclenche un
  audit Codex/Gemini sur le diff ?
- Si un audit revient avec des findings, comment je les vois ? (tu me
  les colles dans la conversation, ou un fichier déposé quelque part ?)
- Les findings sont-ils **bloquants** (j'arrête, je fix avant de
  continuer) ou **à intégrer plus tard** (TODO list) ?

→ Ma reco : par défaut, audit non-bloquant, findings collectés dans
`.claude/memory/frictions/` au fil de l'eau, traités en fin de run.

## Lots roadmap — pré-cadrage

Pour info, les lots à enchaîner (chacun = un commit ou un set de commits
sur une branche dédiée). Je dispatcherai R0/R1 à workers, je garderai R2
en main thread.

### Lot A.5 — Supabase live (~1h30)

Chunks :
1. Install `@supabase/supabase-js` + update `pnpm-lock.yaml` + DEPENDENCIES.md
2. Swap stub `src/lib/supabase.ts` (real `createClient`)
3. SQL schema Supabase :
   - `profiles` (id PK = auth.users.id, email, role enum, created_at)
   - `invitation_codes` (id, code, status, created_at, redeemed_at, redeemed_by, expires_at, created_by)
   - `inquiries` (id, user_id FK profiles, source enum, target_id, message, status enum, created_at)
   - RLS policies : profiles read-self, invitation_codes admin-only, inquiries read-own + admin-all
4. RPC function `redeem_invitation_code(p_code text, p_user_id uuid)` — atomic single-use redeem
5. Wire AuthContext methods to real supabase calls
6. Hook `onAuthStateChange` listener dans AuthProvider useEffect
7. Edge Function (ou serverless route Vite) qui envoie email Resend sur inquiry insert (trigger Supabase Postgres + webhook ou polling)
8. Tests d'intégration (mock supabase ou test e2e contre dev project)

### Lot B — Public pages avec contenu (~3h)

Pré-requis : `/brief` lancé (client.md filled) + `/wire-content` pour Home/Login/Onboarding.

Chunks :
1. `/brief` → fill `client.md` (lui-même fait par owner ou via prompts en chaîne)
2. `/wire-content` Home → push FR + EN dans Sanity OU fixtures locales
3. Page Login (form email + magic link OU champ "j'ai un code SAW-XXXX") + state management form
4. Page Onboarding (post-magic-link confirm) → form profile minimal
5. Wire flow complet : entrée code → validation → redirect onboarding → save profile → redirect /account
6. Tests pages Login + Onboarding

### Lot C — Pilote module Events (~3-4h)

Pré-requis : champs Event tranchés.

Chunks :
1. Schéma Sanity `event` (avec localeText/RichText pour fr/en)
2. Push schéma + seed data 3-5 events fixtures
3. Hook `useEventsList` (TanStack Query si on l'installe, sinon hook custom avec AbortController)
4. Composant `EventCard` (atom)
5. Page `EventsList` (galerie responsive de cards)
6. Hook `useEventDetail(slug)`
7. Page `EventDetail` (galerie photos + description + caractéristiques + sticky `<InterestButton />`)
8. Composant `InterestButton` (atom) → POST /api/inquiries (ou direct supabase insert) → success state + email envoyé
9. Tests : list, detail, interest creation flow
10. /wire-content events → push contenu réel via Claude

### Lot D — Replicate to 5 modules (~6-8h)

Loop :
- Properties (~1h)
- Timepieces (~1h)
- Artworks (~1h)
- Journeys (~1h)
- Concierge (~1h, mais c'est un formulaire pas une liste — pattern différent)

Chaque module clone le pattern Events. Refactor possible si > 70%
duplication réelle (extract `<ModulePage<T>>` générique).

### Lot E — Admin (~4-5h)

Chunks :
1. Page `Invitations` : liste + create form + revoke action
2. Page `Inquiries` : liste filtrée par source + status + détail + status update
3. Page `Users` : liste profiles + role update (client → admin)
4. Email templates Resend (welcome, magic-link, inquiry-receipt, inquiry-notification-admin)

## Stop conditions auto-mode (j'ARRÊTE et je pose ACTION HUMAINE REQUISE si)

1. **Une key/credential manque** dans `.env.local` → je ne fake jamais.
2. **Une décision produit non pré-tranchée** rencontrée (ex : item field
   ambigu, format de tarif non défini, champ onboarding non clarifié).
3. **Une action irréversible** (delete, force-push, drop table production,
   release publique).
4. **Un test échoue 3 fois consécutives** sur la même surface après
   3 tentatives de fix → je m'arrête, j'écris une `frictions/` entry
   et je pose la question.
5. **Un audit Codex/Gemini revient avec un finding `BLOCKER`** (si
   protocole bloquant établi).
6. **Le scope d'un lot dépasse de > 50 % l'estimation** → red flag,
   je m'arrête et je propose de redécouper.
7. **Husky pre-commit fail répété** sur le même fichier → je traite
   le root cause, pas un --no-verify.
8. **Le test coverage chute sous le ratchet** et je n'ai pas pu remonter
   en 2 essais → je m'arrête et je propose soit d'ajouter des tests
   ciblés, soit (avec son OK) de baisser le seuil temporairement.

## Comment je tourne pendant le run

- Toutes les ~30-45 min, je commit un chunk vert (validate green) et
  j'enchaîne le suivant. Atomic commits, pas de bombe en fin de run.
- Je dispatche R0 (rename, regen, tests boilerplate) à `worker-haiku`
  + R1 (component nouveau, page suivant pattern, schema Sanity nouveau)
  à `worker-sonnet`. Je garde R2 (archi, choix de lib, refactor cross-
  cutting) en main thread.
- Je commit sur des branches `feat/lot-A.5-supabase-live`,
  `feat/lot-B-public-pages`, etc. — une par lot. Merge sur main à la
  fin de chaque lot vert.
- Toutes les heures je dump un statut court dans la conversation pour
  que l'owner puisse rattraper sans relire tout (style status update :
  « Lot A.5 chunks 1-3 commités, blocked sur SQL schema check, en
  attente de N. Continue lot A.5 chunk 4. »).

## Cross-refs

- Bootstrap session : `.claude/memory/sessions/2026-04-28-2044.md`
- Modèle business : `.claude/memory/decisions/2026-04-28-business-model-inquiry-not-ecommerce.md`
- Lot A baseline (à merger sur main avant ce run) : branche
  `feat/lot-a-infra` (8 commits dont ce decision file)
- Règles always-loaded à respecter : `anti-complaisance.md` (CHALLENGE
  avant R2), `dispatch.md` (R0/R1/R2 classification), `releases.md`
  (RELEASE CHECK fin de session), `vision-first.md` + `creative-
  ambition.md` + `ux-first.md` (avant toute passe UI).
