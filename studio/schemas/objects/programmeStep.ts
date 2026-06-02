// ═══════════════════════════════════════════════════
// programmeStep — single line of a timed programme (events, journeys)
//
// WHAT: two clearly separated fields, repeatable. Used inside
//       event.programme[] and journey.itinerary[].
//       - `time`  : the hour, picked via a clock selector (TimeInput),
//         stored as "HH:MM" (e.g. "10:15"). NOT translatable — and not
//         free text, so a title can't be typed into the hour field.
//       - `label` : the short title, localeString (FR/EN) — this is the
//         part that needs translating ("Les pièces historiques").
//       Renders as "10:15 | Les pièces historiques".
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { TimeInput } from '../../components/TimeInput';

export const programmeStep = defineType({
  name: 'programmeStep',
  title: 'Étape du programme',
  type: 'object',
  fields: [
    defineField({
      name: 'time',
      title: 'Heure',
      type: 'string',
      description: "Sélectionne l'heure de l'étape (ex: 10:15).",
      components: { input: TimeInput },
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
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      description:
        'Détail optionnel traduisible (FR/EN), affiché sous le titre. Ex: "Visite guidée par le conservateur, accès aux ateliers."',
    }),
  ],
  preview: {
    select: { time: 'time', label: 'label.fr' },
    prepare: ({ time, label }) => ({
      title: `${String(time ?? '')} | ${String(label ?? '')}`,
    }),
  },
});
