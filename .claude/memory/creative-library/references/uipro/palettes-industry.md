---
id: uipro-palettes-industry
date: 2026-04-23
type: reference
tags: [#design, #template, #active]
scope: template
status: active
source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/data/colors.csv
---

# Palettes by industry — quick-start color lookup

## Usage

161 palettes WCAG-ajustées mappées à un type de produit/industrie.
**Pas des directions finales** — des **points de départ safe** quand
on n'a aucun input brand. Chaque palette contient : Primary, Accent,
Background, et variantes card/border/muted dérivées.

**À ne PAS faire** : prendre la palette et livrer tel quel. C'est
l'exact chemin vers du "design correct mais plat" — parce que 161
projets SaaS auront tous le même `#2563EB + #EA580C + #F8FAFC`.

**À faire** : utiliser comme **réservoir de départ** puis déplacer
chaque hex de ±15-25° en teinte ou ±10% en luminosité pour signer
le projet. Le pattern devient : *"trust blue warm de sa famille"*
plutôt que *"blue #2563EB stock"*.

## Familles utiles (extraits)

### Trust / corporate / SaaS
| Industrie | Primary | Accent | BG | Vibe |
|---|---|---|---|---|
| SaaS (General) | `#2563EB` blue | `#EA580C` orange | `#F8FAFC` | Trust + CTA punch |
| B2B Service | `#0F172A` navy | `#0369A1` blue | `#F8FAFC` | Pro sobre |
| Analytics Dashboard | `#1E40AF` blue | `#D97706` amber | `#F8FAFC` | Data + highlight |
| AI/Chatbot | `#7C3AED` purple | `#0891B2` cyan | `#FAF5FF` | AI-native cliché — remixer obligatoire |
| Remote Work | `#6366F1` indigo | `#059669` green | `#F5F3FF` | Calm + success |
| Government | `#0F172A` navy | `#0369A1` blue | `#F8FAFC` | Contrast institutionnel |

### Creative / culture / lifestyle
| Industrie | Primary | Accent | BG | Vibe |
|---|---|---|---|---|
| Creative Agency | `#EC4899` pink | `#0891B2` cyan | `#FDF2F8` | Bold + punch |
| Portfolio/Personal | `#18181B` mono | `#2563EB` blue | `#FAFAFA` | Graphite + signature |
| Gaming | `#7C3AED` purple | `#F43F5E` rose | `#0F0F23` dark | Neon night |
| NFT/Web3 | `#8B5CF6` purple | `#FBBF24` gold | `#0F0F23` | Tech + value signal |
| Creator Economy | `#EC4899` pink | `#EA580C` orange | `#FDF2F8` | Energy + warmth |
| Music Streaming | (check source) | — | — | Audio-dark typ |
| Photography Studio | (check source) | — | — | Editorial neutral |

### Wellness / health / lifestyle
| Industrie | Primary | Accent | BG | Vibe |
|---|---|---|---|---|
| Healthcare App | `#0891B2` cyan | `#059669` green | `#ECFEFF` | Calm + vitalité |
| Mental Health | `#8B5CF6` lavender | `#059669` green | `#FAF5FF` | Soin + wellness |
| Fitness/Gym | `#F97316` orange | `#22C55E` green | `#1F2937` dark | Energy |
| **Beauty/Spa/Wellness** ⚠ | `#EC4899` pink | `#8B5CF6` lavender | `#FDF2F8` | **Slop alert** — c'est le cliché |
| Dental Practice | (check source) | — | — | Clean clinical |

### Luxury / premium ⚠ slop-alert
| Industrie | Primary | Accent | BG | Vibe |
|---|---|---|---|---|
| E-commerce Luxury | `#1C1917` black | `#A16207` gold | `#FAFAF9` | Black + gold — cliché |
| **Luxury/Premium Brand** ⚠ | `#1C1917` black | `#A16207` gold | `#FAFAF9` | Identique — slop alert |
| Hotel/Hospitality | `#1E3A8A` navy | `#A16207` gold | `#F8FAFC` | Trust + luxury |
| Wedding/Event | `#DB2777` pink | `#A16207` gold | `#FDF2F8` | Romantic cliché |

⚠ Les 3 palettes luxury utilisent **toutes** or `#A16207`. Si le
client est luxury, NE PAS défaut-er sur ces combos sans remix.
Alternatives : déplacer l'or vers `#C19A6B` (bronze doré) ou
`#D4AF8C` (champagne warm), noir vers `#201A17` (graphite profond),
ou carrément casser la famille : luxe peut être **blanc cassé +
cyan électrique** (saw-next), ou **crème + vermillon** (éditorial).

### Food / consumer / retail
| Industrie | Primary | Accent | BG | Vibe |
|---|---|---|---|---|
| Restaurant/Food | `#DC2626` red | `#A16207` gold | `#FEF2F2` | Appetit + warmth |
| Bakery/Cafe | (check source) | — | — | Warm cosy |
| Brewery/Winery | (check source) | — | — | Earthy craft |
| E-commerce | `#059669` green | `#EA580C` orange | `#ECFDF5` | Success + urgency |

### Tech / futur / crypto
| Industrie | Primary | Accent | BG | Vibe |
|---|---|---|---|---|
| Fintech/Crypto | `#F59E0B` gold | `#8B5CF6` purple | `#0F172A` | Value + tech |
| Financial Dashboard | `#0F172A` dark | `#22C55E` green | `#020617` very-dark | Trading terminal |
| EV/Charging | `#0891B2` cyan | `#16A34A` green | `#ECFEFF` | Electric eco |
| Smart Home/IoT | `#1E293B` dark | `#22C55E` green | `#0F172A` | Status-live dark |
| Podcast Platform | `#1E1B4B` indigo | `#F97316` orange | `#0F0F23` | Audio-dark |

## Full list

161 total. Vois la source CSV pour les palettes complètes (card,
muted, border, destructive, ring — tous WCAG-adjusted AA minimum).

Industries non-listed ci-dessus mais dans la source :
Non-profit, Dating, Subscription Box, Newsletter Platform,
Real Estate, Travel, Airline, Marketplace, Logistics, Agriculture,
Automotive, Construction, Coworking, Homecare, Childcare, Senior Care,
Medical Clinic, Pharmacy, Veterinary, Florist, Museum/Gallery, Theater,
Language Learning, Magazine/Blog, Event Management, Membership,
Freelancer, Marketing Agency, Church, Sports Team, Insurance, Banking,
Online Course, Job Board, Knowledge Base, Micro-Credentials, Hyperlocal,
Digital Products, Pet Tech, Beauty, Hotel, etc.

## Anti-slop checklist (obligatoire avant livraison palette)

- [ ] La palette diffère-t-elle d'une autre industrie proche ?
      (2 SaaS ne doivent pas avoir la même palette)
- [ ] Y-a-t-il un décalage tonal ou saturation du Primary par
      rapport au stock ?
- [ ] L'Accent évite-t-il le défaut or/purple/rose AI-slop ?
- [ ] La BG est-elle plus que `#F8FAFC` ou `#FFFFFF` ? (crème ?
      off-white teinté ? blur ?)
- [ ] Dark mode : pas juste invert, vraie palette paire ?

## Cross-refs

- `anti-patterns/ai-slop-luxury-spa.md` (Phase 2) — le cas
  Beauty/Spa + Wellness détaillé
- `mechanics/` (Phase 2) — quand une mécanique a sa propre palette
  signature (aurora = mesh gradient spécifique, etc.)
- `references/uipro/styles-catalog.md` — palette suit style choisi
