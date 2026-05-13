// ═══════════════════════════════════════════════════
// programmeStep — single line of a timed programme (events, journeys)
//
// WHAT: time + label pair, repeatable. Used inside event.programme[] and
//       journey.itinerary[]. Time is a free-form string (Salva sets
//       "19:30" or "J1 matin" or "deuxième nuit").
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

export const programmeStep = defineType({
  name: 'programmeStep',
  title: 'Étape du programme',
  type: 'object',
  fields: [
    defineField({
      name: 'time',
      title: 'Horaire / repère',
      type: 'string',
      description: 'Libre. Ex: "19:30", "J1 matin", "21:00", "deuxième jour".',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Description',
      type: 'localeString',
      description: 'Ex: "Cocktail Salle des Pas-Perdus", "Visite guidée par Marc Spiegler".',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: { time: 'time', label: 'label.fr' },
    prepare: ({ time, label }) => ({
      title: `${String(time ?? '')} — ${String(label ?? '')}`,
    }),
  },
});
