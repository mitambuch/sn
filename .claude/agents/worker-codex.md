---
name: worker-codex
description: 5e tier du dispatch — Codex (GPT-5.x, OpenAI) en headless via le CLI `@openai/codex`. Le rung "complexe-mais-borné" de l'échelle d'intelligence : plus puissant qu'un worker haiku/sonnet, atteint via `pnpm dispatch:codex`, JAMAIS auto-accepté — dispatch-verify gate le résultat. Pour le bounded-but-hard cadré par Opus, pas l'archi/design (R2 reste Opus).
model: GPT-5.x (gpt-5.5 par ~/.codex/config.toml), atteint via le CLI codex exec, PAS via Agent({model})
tools: [Bash (codex exec via scripts/codex-delegate.js), Read]
---

# Worker — Codex (GPT-5.x, le rung "complexe-mais-borné")

Codex est un **allié puissant** pour les tâches **complexes mais bornées** que
ni haiku ni sonnet ne tiennent bien, mais qui n'atteignent pas le R2
(archi/design — Opus garde ça). Doctrine de l'échelle :
[`memory/decisions/2026-06-10-intelligence-ladder-doctrine.md`]. La règle de
l'owner : **« puissant SI il est contrôlé »** — Codex ne remplace jamais
l'orchestrateur, il exécute du borné sous contrôle mécanique.

## ⚠️ Mécanisme — pas un sous-agent `Agent({model})`

`Agent({model})` n'accepte que haiku/sonnet/opus. Codex est atteint par le CLI
`@openai/codex` (sur PATH, authé via `~/.codex`, modèle `gpt-5.5`), enveloppé
par `scripts/codex-delegate.js` :

```
node scripts/codex-delegate.js --spec <id>   # ou pnpm dispatch:codex --spec <id>
node scripts/dispatch-verify.js <id>          # TOUJOURS après — la preuve §4
```

Le wrapper lui passe **le même contexte worker mince (P14)** qu'à un worker
haiku/sonnet (digest + règles path-triggered + le contrat), lance `codex exec`
**sandboxé `workspace-write`** (il édite dans le repo, rien hors-workspace), et
laisse l'arbre changé **sans l'accepter**.

## Le contrôle — non négociable

- **Aucune auto-acceptation.** Codex peut déborder des `allowed_paths` (le
  sandbox autorise tout le workspace) — c'est **`dispatch-verify` qui confine**
  après coup (diff hors scope → FAIL, revert). La preuve, c'est la sortie du
  vérificateur, pas la parole de Codex.
- **Attribution** : commit avec `Model: codex` + `Dispatch: <id>` (le hook
  commit-msg l'exige sur le marqueur verified) ; ligne de ledger écrite.
- **Un seul retry, un cran au-dessus** (échelle) : Codex échoue → l'orchestrateur
  reprend lui-même, misclassification loggée. Jamais de 2e retry.

## Quand router vers Codex (frontière, pas optimisme)

- **Oui** : tâche bornée mais qui demande du raisonnement (refactor local non
  trivial, bug avec repro mais logique tordue, génération suivant un pattern
  exigeant) — cadrée par une spec `allowed_paths` serrée + acceptance.
- **Non** : R2 (archi/design/review/plan → Opus), R0 trivial (→ haiku, moins
  cher), urgence (latence réseau + raisonnement xhigh), tâche sans acceptance
  vérifiable. En cas de doute haiku/sonnet vs Codex : reste sur haiku/sonnet
  sauf si la complexité bornée le justifie explicitement.

Cross-refs : `dispatch.md` (l'échelle), `dispatch-verify.js` (le contrôle),
`build-worker-context.js` (le contexte mince), `worker-steakcode.md` (le tier
local gratuit, pour le borné non-pressé).
