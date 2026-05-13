// ═══════════════════════════════════════════════════
// artwork — Œuvre d'art (artiste vivant ou succession)
//
// WHAT: A single artwork — painting, sculpture, photograph, installation.
//       Provenance + certificate are first-class.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { icon } from '../_helpers/icons';
import { visibilityField, visibilityGroup } from '../_helpers/visibilityField';

const MEDIUMS = [
  { title: 'Peinture', value: 'painting' },
  { title: 'Sculpture', value: 'sculpture' },
  { title: 'Photographie', value: 'photography' },
  { title: 'Dessin / œuvre sur papier', value: 'drawing' },
  { title: 'Installation', value: 'installation' },
  { title: 'Vidéo / nouveau média', value: 'video' },
  { title: 'Autre', value: 'other' },
];

export const artwork = defineType({
  name: 'artwork',
  title: "Œuvre d'art",
  type: 'document',
  icon: icon('🖼️'),
  description:
    'Œuvre unique : peinture, sculpture, photo, installation. Provenance et catalogue raisonné premium.',
  groups: [
    visibilityGroup,
    { name: 'essentiel', title: '🎯 Essentiel', default: true },
    { name: 'oeuvre', title: '🎨 Œuvre' },
    { name: 'provenance', title: '📜 Provenance' },
    { name: 'tarif', title: '💰 Tarif' },
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
      description: 'Ex: "Sans titre, 1987".',
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
      name: 'artistName',
      title: 'Artiste',
      type: 'string',
      group: 'essentiel',
      description: 'Ex: "Cy Twombly", "Anish Kapoor".',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Année',
      type: 'number',
      group: 'essentiel',
    }),
    defineField({
      name: 'summary',
      title: 'Résumé',
      type: 'localeText',
      group: 'essentiel',
    }),
    defineField({
      name: 'description',
      title: 'Description complète',
      type: 'localeRichText',
      group: 'essentiel',
    }),
    // ─── Œuvre ───
    defineField({
      name: 'medium',
      title: 'Médium',
      type: 'string',
      group: 'oeuvre',
      options: { list: MEDIUMS, layout: 'radio' },
      initialValue: 'painting',
    }),
    defineField({
      name: 'technique',
      title: 'Technique précise',
      type: 'localeString',
      group: 'oeuvre',
      description: 'Ex: "Huile sur toile", "Bronze patiné, fonte unique".',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      group: 'oeuvre',
      description: 'Format libre. Ex: "200 x 150 cm", "Ø 80 cm", "30 x 40 x 25 cm".',
    }),
    defineField({
      name: 'edition',
      title: 'Édition',
      type: 'string',
      group: 'oeuvre',
      description: 'Ex: "Unique", "Édition 3/8", "Épreuve d\'artiste".',
    }),
    // ─── Provenance ───
    defineField({
      name: 'provenanceNote',
      title: 'Provenance',
      type: 'localeText',
      group: 'provenance',
      description: 'Historique de propriété, expositions, publications.',
    }),
    defineField({
      name: 'certificate',
      title: "Certificat d'authenticité",
      type: 'boolean',
      group: 'provenance',
      initialValue: true,
    }),
    defineField({
      name: 'catalogueRaisonne',
      title: 'Référence catalogue raisonné',
      type: 'string',
      group: 'provenance',
      description: "Numéro de catalogue si l'œuvre y est répertoriée.",
    }),
    // ─── Tarif ───
    defineField({
      name: 'price',
      title: 'Prix',
      type: 'priceBlock',
      group: 'tarif',
    }),
    // ─── Médias ───
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'medias',
      of: [{ type: 'domainImage' }],
      options: { layout: 'grid' },
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
      artistName: 'artistName',
      year: 'year',
      visibility: 'visibility',
      media: 'images.0',
    },
    prepare: ({ title, artistName, year, visibility, media }) => {
      const visIcon = visibility === 'public' ? '🌐' : visibility === 'shareCode' ? '🔑' : '🔒';
      return {
        title: `${visIcon} ${String(title ?? 'Sans titre')}`,
        subtitle: [artistName, year].filter(Boolean).join(' · ') || '—',
        media,
      };
    },
  },
});
