// ═══════════════════════════════════════════════════
// domainImage — image with alt + caption + hotspot
//
// WHAT: A reusable Sanity image object that enforces alt text (a11y)
//       and offers an optional caption. Hotspot enabled so Salva can
//       set a focal point that the frontend uses for object-position
//       crops (avoiding head-cuts on portraits).
// WHEN: Use as a sub-type wherever a domain document needs an image
//       (events, properties, timepieces, artworks, journeys, etc.).
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

export const domainImage = defineType({
  name: 'domainImage',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texte alternatif',
      type: 'string',
      description:
        "Décris en 1 phrase ce que montre l'image. Important pour l'accessibilité (lecteurs d'écran) et le SEO. Ex: \"Salle des Pas-Perdus en gala, 220 couverts\".",
      validation: Rule => Rule.required().warning("L'alt est recommandé pour l'accessibilité."),
    }),
    defineField({
      name: 'caption',
      title: 'Légende (optionnelle)',
      type: 'localeString',
      description: "Légende visible sous l'image. Laisse vide si non nécessaire.",
    }),
  ],
});
