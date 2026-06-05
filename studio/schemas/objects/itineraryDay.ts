// ═══════════════════════════════════════════════════
// itineraryDay — one day of a journey itinerary (no hour)
//
// WHAT: a repeatable day entry used inside journey.itinerary[]. Unlike
//       programmeStep (events, which carry an HOUR like "10:15"), a journey
//       is structured by DAYS, not hours — so there is no time field. The
//       day number is derived from the order in the list (Jour 1, Jour 2…),
//       so the editor only writes the title + optional detail.
//       - `label`       : short title, localeString (FR/EN) — required.
//       - `description`  : optional detail, localeText (FR/EN).
// WHEN: journey.itinerary[]. Renders downstream as "Jour {n} — {label}".
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

export const itineraryDay = defineType({
  name: 'itineraryDay',
  title: 'Journée',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Titre de la journée',
      type: 'localeString',
      description:
        'Court titre traduisible (FR/EN). Ex: "Arrivée à El Calafate", "Navigation vers les fjords". Les journées sont numérotées automatiquement dans l\'ordre (Jour 1, Jour 2…).',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Détail',
      type: 'localeText',
      description:
        'Détail optionnel traduisible (FR/EN), affiché sous le titre. Ex: "Transfert privé vers l\'estancia, dîner au coin du feu."',
    }),
  ],
  preview: {
    select: { label: 'label.fr' },
    prepare: ({ label }) => ({ title: String(label ?? 'Journée') }),
  },
});
