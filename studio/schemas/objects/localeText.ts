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
  // WHY: same as localeString — inside an array (e.g. page intro paragraphs)
  // an item without a preview shows as "Untitled". Title = FR (EN fallback) ;
  // subtitle flags whether the EN translation is filled.
  preview: {
    select: { fr: 'fr', en: 'en' },
    prepare: ({ fr, en }) => {
      const frText = String(fr ?? '').trim();
      const enText = String(en ?? '').trim();
      return {
        title: frText || enText || '(vide)',
        subtitle: enText ? 'EN renseigné' : 'EN à compléter',
      };
    },
  },
});
