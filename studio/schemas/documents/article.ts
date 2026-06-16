// ═══════════════════════════════════════════════════
// article — Actualité / Story éditoriale
//
// WHAT: An editorial story / news item. Long-form rich text, hero
//       image, publication date.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { icon } from '../_helpers/icons';
import { visibilityField, visibilityGroup } from '../_helpers/visibilityField';

const CATEGORIES = [
  { title: 'Édito / point de vue', value: 'edito' },
  { title: 'Récit client (sans identité)', value: 'story' },
  { title: 'Coulisses', value: 'behind-scenes' },
  { title: 'Guide / shortlist', value: 'guide' },
  { title: 'Annonce', value: 'announcement' },
];

export const article = defineType({
  name: 'article',
  title: 'Actualité',
  type: 'document',
  icon: icon('📰'),
  description:
    'Récit éditorial : édito, coulisses, guide, annonce. Long-form rich text + image hero.',
  groups: [
    visibilityGroup,
    { name: 'essentiel', title: '🎯 Essentiel', default: true },
    { name: 'contenu', title: '📝 Contenu' },
    { name: 'medias', title: '📸 Médias' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    visibilityField(),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      group: 'essentiel',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      group: 'essentiel',
      options: { source: 'title.fr', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'essentiel',
      options: { list: CATEGORIES, layout: 'radio' },
      initialValue: 'edito',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      group: 'essentiel',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      group: 'essentiel',
      to: [{ type: 'teamMember' }],
      description: "Lien vers un membre de l'équipe. Sinon laisse vide.",
    }),
    defineField({
      name: 'summary',
      title: 'Chapeau / résumé',
      type: 'localeText',
      group: 'essentiel',
    }),
    // ─── Contenu ───
    defineField({
      name: 'body',
      title: "Corps de l'article",
      type: 'localeRichText',
      group: 'contenu',
    }),
    defineField({
      name: 'readTimeMinutes',
      title: 'Temps de lecture (min)',
      type: 'number',
      group: 'contenu',
      description: 'Approximatif. Ex: 5.',
    }),
    // ─── Médias ───
    defineField({
      name: 'heroImage',
      title: 'Image hero',
      type: 'domainImage',
      group: 'medias',
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie média (photos + vidéos)',
      type: 'array',
      group: 'medias',
      of: [{ type: 'domainImage' }, { type: 'videoEmbed' }, { type: 'videoFile' }],
      options: { layout: 'grid' },
      description:
        "Mélange librement photos, vidéos hébergées (Vimeo/YouTube) et vidéos importées, dans l'ordre voulu. Idéal pour raconter une expérience de façon immersive.",
    }),
    // ─── SEO ───
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'localeString',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description SEO',
      type: 'localeText',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title.fr',
      publishedAt: 'publishedAt',
      category: 'category',
      visibility: 'visibility',
      media: 'heroImage',
    },
    prepare: ({ title, publishedAt, category, visibility, media }) => {
      const visIcon = visibility === 'public' ? '🌐' : visibility === 'shareCode' ? '🔑' : '🔒';
      const date = publishedAt ? new Date(publishedAt as string).toLocaleDateString('fr-CH') : '—';
      return {
        title: `${visIcon} ${String(title ?? 'Sans titre')}`,
        subtitle: `${String(category ?? '—')} · ${date}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Publication — plus récent',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
