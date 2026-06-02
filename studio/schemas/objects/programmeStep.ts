// ═══════════════════════════════════════════════════
// programmeStep — single line of a timed programme (events, journeys)
//
// WHAT: two clearly separated fields, repeatable. Used inside
//       event.programme[] and journey.itinerary[].
//       - `time`  : the hour, plain text ("09h00", "19:30"). NOT
//         translatable — a clock value reads the same in every language.
//       - `label` : the short title, localeString (FR/EN) — this is the
//         part that needs translating ("Arrivée à La Chaux-de-Fonds").
//       Renders as "09h00 | Arrivée à La Chaux-de-Fonds".
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

export const programmeStep = defineType({
  name: 'programmeStep',
  title: 'Étape du programme',
  type: 'object',
  fields: [
    defineField({
      name: 'time',
      title: 'Heure',
      type: 'string',
      description: 'L\'horaire de l\'étape. Ex: "09h00", "19:30".',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Titre',
      type: 'localeString',
      description:
        'Court titre traduisible (FR/EN). Ex: "Arrivée à La Chaux-de-Fonds", "Cocktail Salle des Pas-Perdus".',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: { time: 'time', label: 'label.fr' },
    prepare: ({ time, label }) => ({
      title: `${String(time ?? '')} | ${String(label ?? '')}`,
    }),
  },
});
