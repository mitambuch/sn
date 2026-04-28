// ═══════════════════════════════════════════════════
// localeText — long multilingual text (FR required, EN optional)
//
// WHAT: Same as localeString but for paragraphs (multi-line), with the
//       same compact language-tabs input (🇫🇷 FR · 🇬🇧 EN).
// WHEN: Descriptions, leads, bios, intros, editorial paragraphs.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { LocaleTabsInput } from '../../components/LocaleTabsInput';

export const localeText = defineType({
  name: 'localeText',
  title: 'Texte long',
  type: 'object',
  components: { input: LocaleTabsInput },
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().warning('Le texte FR est recommandé.'),
    }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 4 }),
  ],
});
