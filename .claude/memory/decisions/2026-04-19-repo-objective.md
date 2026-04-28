---
id: decision-2026-04-19-repo-objective
date: 2026-04-19
type: decision
tags: [#workflow, #decision, #template, #p0, #active]
scope: template
status: active
---

# Objectif du repo — starter perso optimisé max velocity

## Context

Owner (2026-04-19 matin) a évoqué une ambition "meilleur repo de GitHub /
trending" en même temps qu'il demandait une règle anti-complaisance. Les
deux objectifs sont en tension : trend = marketing OSS, perso = velocity
propriétaire. Phase C visait à trancher avant de lancer un audit méta-stack.

Diagnostic du repo : 100 % personnel (branding "steaksoap", stack ultra-opinée,
47 entrées memory, 9 règles always-loaded, workflow Claude intransposable).
OSS trendable aurait coûté 2-4 mois de decoupling + marketing, avec
opportunity-cost direct sur livraison client.

## Decision

**(a) Starter perso optimisé "machine de guerre"**. Pas de spectacle,
pas de marketing, pas d'OSS du repo entier. L'objectif est la vélocité
personnelle de l'owner, mesurée par **features livrées par heure** (et
pas par stars GitHub).

Porte laissée ouverte mais non-prioritaire : extraire un jour un
sous-ensemble propre (ex : pattern Conductor & Workers dispatcher) comme
mini-OSS séparé dans un autre repo si l'envie arrive. Pas aujourd'hui.

## Alternatives rejetées

| Alt | Pourquoi rejetée |
|---|---|
| (b) OSS full repo trendable | 2-4 mois d'effort decoupling + marketing, opportunity-cost direct sur clients, risque burn-out + repo abandonné. |
| (b-lite) Extraire dispatcher comme OSS maintenant | Owner veut velocity, pas spectacle — reportée sine die. |

## Implications pour Phase B (audit méta-stack)

L'audit optimise pour **UNE** métrique : temps owner économisé sur les
tâches réelles. Chaque couple (règle / entrée memory / script / commande)
doit justifier son existence par un usage mesurable ou une valeur
load-bearing. Sinon → simplifier ou supprimer.

La règle "sans perdre de valeur" est absolue : rien n'est supprimé sans
green light explicite de l'owner sur la proposition.

## Cross-refs

- Règle anti-complaisance (session matin) :
  `decisions/2026-04-19-anti-complaisance.md`
- v6.0 plan (momentum à préserver) :
  `decisions/2026-04-19-v6.0-plan.md`
- Phase B audit suivante (entrée à créer après exécution)
