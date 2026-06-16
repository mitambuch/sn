// ═══════════════════════════════════════════════════
// serviceStep — one step of a concierge experience programme (no hour)
//
// WHAT: a repeatable entry used inside conciergeService.programme[]. Unlike
//       programmeStep (events, which carry an HOUR like "10:15") or
//       itineraryDay (journeys, structured by DAY), a concierge experience
//       programme is just an ordered sequence of moments — no time, no day.
//       The editor writes only a title + an optional detail, both translatable.
//       - `label`       : short title, localeString (FR/EN/ES) — required.
//       - `description`  : optional detail, localeText (FR/EN/ES).
// WHEN: conciergeService.programme[]. Renders downstream as a simple timeline.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

export const serviceStep = defineType({
  name: 'serviceStep',
  title: 'Étape du programme',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: "Titre de l'étape",
      type: 'localeString',
      description:
        'Court titre traduisible (FR/EN/ES). Ex: "Prise de contact et brief", "Repérage discret des lieux".',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
      description:
        'Détail optionnel traduisible (FR/EN/ES), affiché sous le titre. Ex: "Un référent dédié coordonne chaque intervenant en amont."',
    }),
  ],
  preview: {
    select: { label: 'label.fr', en: 'label.en' },
    prepare: ({ label, en }) => ({
      title: String(label ?? en ?? '(étape sans titre)'),
      subtitle: en ? `EN · ${String(en)}` : 'EN à compléter',
    }),
  },
});
