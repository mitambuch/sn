# Art-direction — visuels des expériences SAW Next

Prompts prêts à coller pour générer les visuels des trois expériences
(Private Retreats, Sécurité & sérénité, Déplacements d'exception). Pensés pour
**Midjourney v6 / Firefly / Flux / DALL·E** — coller le bloc complet, ajuster
si besoin.

## Pourquoi ce document

Le client a tenté via ChatGPT sans résultat. La cause habituelle : un prompt
trop court et trop « luxe ostentatoire ». Ici chaque prompt décrit **une
émotion + une scène concrète + ce qu'on évite**, ce qui guide vraiment le
modèle.

## Direction commune (à respecter sur tous les visuels)

- **Émotion avant objet** : le sujet est une sensation, pas un bien.
  Le visiteur doit penser « je pourrais être là », pas « je voudrais posséder ça ».
- **Esthétique de marque** : SAW Next est **monochrome / désaturé**. Ne pas
  livrer des photos sur-saturées « carte postale ». On vise une photographie
  **éditoriale, palette sourde, lumière naturelle, grain argentique léger,
  retenue**. Couleurs présentes mais discrètes (tons neutres, sable, ardoise,
  brume), jamais criardes.
- **Anti-cliché du luxe** : pas de voitures de sport, pas de champagne en gros
  plan, pas de démonstration de richesse, pas de logos.
- **Humain et discret** : personnages de dos ou hors champ, jamais en pose.
- **Cadrage** : prévoir un format large (paysage) pour le hero **16:9** et des
  carrés **1:1** pour la galerie.

### Suffixe de style à coller à la fin de chaque prompt

```
editorial photography, muted desaturated palette, natural soft light, subtle
film grain, restrained and timeless, shot on 35mm, shallow depth of field,
no text, no logos, no people posing --ar 16:9 --style raw
```

(Pour la galerie carrée, remplacer `--ar 16:9` par `--ar 1:1`.)

---

## 1 — Private Retreats — « le luxe de l'intimité »

**Émotions** : liberté, évasion, sérénité, intimité, temps pour soi, moments
partagés, confort discret, sentiment d'être ailleurs.
**On évite** : façade de villa ostentatoire, piscine à débordement « cliché
Instagram », champagne, bijoux.

```
A quiet terrace overlooking a calm sea at dusk, two low lounge chairs facing
the horizon, a linen throw, warm low light, the feeling of having all the time
in the world, no people or one person seen from behind, [STYLE SUFFIX]
```

```
Interior of a warm elegant villa at golden hour, natural materials — stone,
wood, linen — an open door to a garden, soft shadows, intimate and lived-in,
a sense of calm and belonging rather than display, [STYLE SUFFIX]
```

```
A wooden sailing boat anchored in a secluded bay, seen as a means of freedom
and exploration, gentle morning haze, distant inspiring coastline, the promise
of slowing down, [STYLE SUFFIX]
```

---

## 2 — Sécurité & sérénité — « protection invisible »

**Émotions** : sérénité, confiance, discrétion, tranquillité d'esprit,
accompagnement, présence rassurante, protection invisible.
**On évite absolument** : gardes du corps en costume, oreillettes, véhicules
blindés, démonstration de force, attitude intimidante.

```
A couple walking serenely through the elegant lobby of a private residence,
unhurried, completely at ease, a discreet professional in the soft-focus
background simply present, calm premium atmosphere, the feeling that everything
is handled, [STYLE SUFFIX]
```

```
A discreet arrival at the entrance of a quiet hotel at night, warm interior
light spilling out, a family stepping in relaxed and unbothered, everything
smooth and organised, no visible security apparatus, [STYLE SUFFIX]
```

```
A peaceful family moment in a serene high-end setting — a garden, a terrace —
nobody looking over their shoulder, pure tranquillity, soft natural light,
the sensation of being free to focus on what matters, [STYLE SUFFIX]
```

---

## 3 — Déplacements d'exception — « Private Travel & Protocol »

**Émotions** : liberté, gain de temps, fluidité, sérénité, discrétion,
efficacité, confort, se consacrer à l'essentiel.
**On évite** : jet / hélico / voiture de prestige comme sujet principal et
symbole de richesse. Ces objets peuvent apparaître, jamais au premier plan.

```
The view FROM inside a private aircraft window onto a soft sea of clouds at
dawn, a calm hand resting, a notebook, the feeling of time regained, the
aircraft itself barely visible, [STYLE SUFFIX]
```

```
A discreet, fluid transfer on a quiet private tarmac at first light, a single
figure walking unhurried with light luggage, everything perfectly organised and
calm, the machine kept in the background, [STYLE SUFFIX]
```

```
An inspiring remote landscape made reachable by seamless logistics — a
mountain plateau, a quiet coastline — one person taking it in, the journey felt
as freedom rather than status, [STYLE SUFFIX]
```

---

## Intégration

Une fois les fichiers générés, ils s'ajoutent dans Sanity :

- **Private Retreats** (Voyage) → champ **Images** de la fiche.
- **Sécurité & sérénité** + **Déplacements d'exception** (Prestation
  conciergerie) → champ **Images** de la fiche.

Renseigner un **texte alternatif** (1 phrase descriptive) sur chaque image pour
l'accessibilité. Côté code, le rendu est déjà prêt à les recevoir.
