---
id: uipro-font-pairings
date: 2026-04-23
type: reference
tags: [#design, #template, #active]
scope: template
status: active
source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/src/ui-ux-pro-max/data/typography.csv
---

# Font pairings — typographic vocabulary 2026

## Usage

73 pairings Google Fonts catégorisés par combinaison (Serif+Sans,
Sans+Sans, Display+Sans, Mono+Mono, etc.). Utiliser comme **point
de départ** quand on n'a pas de direction brand, puis **assumer un
décalage** (weight extrême, italic cassé, mono hybride) pour signer.

Anti-slop : `Cormorant + Montserrat` revient 5× dans le catalogue
pour "luxury". Tous les sites luxe en 2026 ne vont PAS porter ce
combo. Voir section "À éviter sans remix" en bas.

## Pairings par direction

### Éditorial / luxe / storytelling
| Nom | Headings | Body | Quand |
|---|---|---|---|
| Classic Elegant | Playfair Display | Inter | Éditorial premium, mag digital |
| Luxury Serif ⚠ | Cormorant | Montserrat | Luxe générique — **remixer** |
| News Editorial | Newsreader | Roboto | News, journalisme sérieux |
| Editorial Classic | Cormorant Garamond | Libre Baskerville | Old-school littéraire |
| Academic/Archival | EB Garamond | Crimson Text | University / research |
| Academia Mobile | Cormorant Garamond + Crimson + Cinzel | triple-stack | Library, parchment, brass |
| Minimalist Monochrome Editorial | Playfair + Source Serif + mono | mix austère | Mono-poetry |

### Modern / tech / SaaS
| Nom | Headings | Body | Quand |
|---|---|---|---|
| Modern Professional | Poppins | Open Sans | SaaS corporate classique |
| **Tech Startup** ⭐ | Space Grotesk | DM Sans | Startup moderne, bold, futuriste — combo **solide 2026** |
| Minimal Swiss | Inter | Inter | Single family, clean, Swiss |
| Geometric Modern | Outfit | Work Sans | Contemporary balanced |
| Friendly SaaS | Plus Jakarta Sans | idem | B2B friendly indigo |
| Enterprise SaaS Mobile | Plus Jakarta Sans | idem | B2B pro single-family |

### Creative / bold / éditorial
| Nom | Headings | Body | Quand |
|---|---|---|---|
| **Bold Statement** ⭐ | Bebas Neue | Source Sans 3 | Affiche, événement, impact héros |
| **Kinetic Motion** ⭐ | Syncopate | Space Mono | Speed, motion, tech wide |
| **Kinetic Brutalism** ⭐ | Space Grotesk (single) | idem | Aggressive uppercase oversized |
| **Neo Brutalism Mobile** ⭐ | Space Grotesk Heavy | idem | Pop art, loud, sticker |
| Art Deco | Poiret One | Didact Gothic | 1920s décoratif Gatsby |
| Gaming Bold | Russo One | Chakra Petch | Esports, action |
| Indie/Craft | Amatic SC | Cabin | Artisan handmade organic |
| Retro Vintage | Abril Fatface | Merriweather | Nostalgique dramatique |
| Bold Typography Mobile | Inter Tight + Playfair | poster | Near-black, vermillon, éditorial |

### Tech / sci-fi / cyberpunk
| Nom | Headings | Body | Quand |
|---|---|---|---|
| **Cyberpunk Mobile** ⭐ | Orbitron | JetBrains Mono | Neon, glitch, HUD, sci-fi dark |
| **Tech/HUD Mono** ⭐ | Share Tech Mono | Fira Code | Futuriste HUD, data terminal |
| Developer Mono | JetBrains Mono | IBM Plex Sans | Dev tool precis, code-first |
| Dashboard Data | Fira Code | Fira Sans | Analytics, data, monospace mix |
| Terminal CLI Monospace | JetBrains Mono (single) | idem | CLI, hacker, matrix |
| **Brutalist Raw** ⭐ | Space Mono (single) | idem | Brutalism technique minimal |

### Playful / consumer / warm
| Nom | Headings | Body | Quand |
|---|---|---|---|
| Playful Creative | Fredoka | Nunito | Fun, creative, warm |
| **Claymorphism Mobile** | Nunito | DM Sans | Clay bubble candy rounded |
| Handwritten Charm | Caveat | Quicksand | Personal, friendly, casual |
| Sketch Hand-Drawn | Kalam + Patrick Hand | dual | Human, imperfect, sketch |

### Wellness / soin / nature
| Nom | Headings | Body | Quand |
|---|---|---|---|
| Wellness Calm | Lora | Raleway | Calm, organic, natural — **meh** |
| Wedding/Romance ⚠ | Great Vibes | Cormorant Infant | Invitation cliché — remix obligatoire |

### Web3 / crypto / bitcoin
| Nom | Headings | Body | Quand |
|---|---|---|---|
| **Web3 Bitcoin DeFi** | Space Grotesk + Inter + Mono | triple | Digital gold, DeFi, fintech crypto |
| **Modern Dark Cinema** | Inter (system) | idem | Dark cinematic premium precision |

### Mobile / boutique / premium
| Nom | Headings | Body | Quand |
|---|---|---|---|
| SaaS Mobile Boutique | Calistoga + Inter + mono | triple | Electric warm editorial bold |
| Material You MD3 | Roboto (system) | idem | Android tonal friendly |
| Neumorphism Mobile | Plus Jakarta Sans + system | single | Cool grey mono soft UI |

### International
| Nom | Headings | Body | Quand |
|---|---|---|---|
| Japanese Elegant | Noto Serif JP | Noto Sans JP | Elegant traditional JP |

## À éviter sans remix (slop alert)

Ces pairings sont OK **en théorie** mais sur-utilisés comme réponse
AI par défaut au prompt "luxury" / "wellness" / "wedding" :

- **Cormorant Garamond + Montserrat** = "luxury" stock AI. Si le
  brief demande luxe, préférer : `Domaine Display + Inter Tight`,
  `Canela + Söhne`, `Reckless + Suisse`, ou remix avec **italic
  extrême** ou **italic-only headings**.
- **Great Vibes + Cormorant Infant** = "wedding" stock. Remix via
  full-mono, ou `Beatrice Display + Grotesque`, ou tout-caps brutal.
- **Lora + Raleway** = "wellness spa" générique. Casser avec
  monospace body, ou tout-sans geometric friendly.
- **Playfair Display + Inter** = "éditorial" default. Fonctionne si
  on pousse les weights (Ultra Bold italic + Regular crispy).

## Signature 2026 — combos à privilégier

⭐ = combos solides pour du "putain de ouff" non-slop :

- **Space Grotesk** (single family weights 300/500/700) — identité
  forte, moderne, adopté par nombre de sites awwwards 2025-2026
- **Syncopate + Space Mono** — kinetic, fait respirer les letters
- **Orbitron + JetBrains Mono** — sci-fi tech sans verser ringard
- **Bebas Neue + Source Sans 3** — poster impact sans basculer dated
- **Cabinet Grotesk + Satoshi** (non-listé uipro mais 2026 dominant)
- **General Sans + General Sans Mono** (Indian Type Foundry) —
  ambitieux underground

## Implémentation

Pour chaque pairing uipro, Google Fonts URL + CSS `@import` + Tailwind
config sont fournis dans la source CSV. Importer via `<link>` en
head. Préférer `variable fonts` quand dispo pour weight morphing
sans 4 fichiers.

## Cross-refs

- `mechanics/morphing-typography.md` (Phase 2) — typo qui morphe
  sur scroll/hover
- `mechanics/kinetic-typography.md` (Phase 2) — mots en motion
- `references/uipro/styles-catalog.md` — typo suit style choisi
- `anti-patterns/ai-slop-luxury-spa.md` (Phase 2) — Cormorant + Gold
  détaillé
