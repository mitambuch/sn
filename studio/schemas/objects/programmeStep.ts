// ═══════════════════════════════════════════════════
// programmeStep — single line of a timed programme (events, journeys)
//
// WHAT: time + label pair, repeatable. Used inside event.programme[] and
//       journey.itinerary[]. Both fields are localeString (FR/EN) — the
//       "time" repère is free-form text that often needs translating
//       ("J1 matin" → "D1 morning", "deuxième jour" → "second day"), not
//       just a clock value.
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
      type: 'localeString',
      description: 'Libre, traduisible. Ex: "19:30", "J1 matin", "21:00", "deuxième jour".',
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
    select: { time: 'time.fr', label: 'label.fr' },
    prepare: ({ time, label }) => ({
      title: `${String(time ?? '')} — ${String(label ?? '')}`,
    }),
  },
});
