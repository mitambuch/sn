// ═══════════════════════════════════════════════════
// localeRichText — multilingual Portable Text (FR required, EN/ES optional)
//
// WHAT: Rich content (paragraphs, bold, italic, links, headings) in 3
//       languages, under the same compact language-tabs input as the
//       other locale* types.
// WHEN: Body copy, articles, long descriptions that need formatting.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { LocaleTabsInput } from '../../components/LocaleTabsInput';

const richBlock = {
  type: 'array' as const,
  of: [
    {
      type: 'block' as const,
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Titre', value: 'h3' },
      ],
      marks: {
        decorators: [
          { title: 'Gras', value: 'strong' },
          { title: 'Italique', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object' as const,
            title: 'Lien',
            fields: [{ name: 'href', type: 'url', title: 'URL' }],
          },
        ],
      },
    },
  ],
};

export const localeRichText = defineType({
  name: 'localeRichText',
  title: 'Contenu riche',
  type: 'object',
  components: { input: LocaleTabsInput },
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      ...richBlock,
      validation: Rule => Rule.required().warning('Le contenu FR est recommandé.'),
    }),
    defineField({ name: 'en', title: 'English', ...richBlock }),
    defineField({ name: 'es', title: 'Español', ...richBlock }),
  ],
});
