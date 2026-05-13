// ═══════════════════════════════════════════════════
// timepiece — Garde-temps (horlogerie de collection)
//
// WHAT: A collector timepiece — vintage, modern, edition. Provenance,
//       papers, condition are first-class data.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { icon } from '../_helpers/icons';
import { visibilityField, visibilityGroup } from '../_helpers/visibilityField';

const CONDITIONS = [
  { title: 'Neuf', value: 'new' },
  { title: 'Comme neuf', value: 'like-new' },
  { title: 'Excellent', value: 'excellent' },
  { title: 'Très bon', value: 'very-good' },
  { title: 'Bon', value: 'good' },
];

const PAPERS = [
  { title: 'Full set (boîte + papiers + extras)', value: 'full-set' },
  { title: 'Boîte + papiers', value: 'box-papers' },
  { title: 'Papiers seuls', value: 'papers-only' },
  { title: 'Boîte seule', value: 'box-only' },
  { title: 'Aucun', value: 'none' },
];

export const timepiece = defineType({
  name: 'timepiece',
  title: 'Garde-temps',
  type: 'document',
  icon: icon('⌚'),
  description:
    'Pièce horlogère de collection. Provenance, papiers et état sont des données premium.',
  groups: [
    visibilityGroup,
    { name: 'essentiel', title: '🎯 Essentiel', default: true },
    { name: 'specs', title: '📐 Caractéristiques' },
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
      description: 'Ex: "Patek Philippe Nautilus 5711/1A — Tiffany Blue".',
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
      name: 'brand',
      title: 'Marque',
      type: 'string',
      group: 'essentiel',
      description: 'Ex: "Patek Philippe", "Audemars Piguet", "F.P. Journe".',
    }),
    defineField({
      name: 'reference',
      title: 'Référence',
      type: 'string',
      group: 'essentiel',
      description: 'Ex: "5711/1A-001", "16610LV".',
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
    // ─── Specs ───
    defineField({
      name: 'caseDiameter',
      title: 'Diamètre boîtier (mm)',
      type: 'number',
      group: 'specs',
    }),
    defineField({
      name: 'caseMaterial',
      title: 'Matériau boîtier',
      type: 'string',
      group: 'specs',
      description: 'Ex: "Acier", "Or jaune 18k", "Platine 950".',
    }),
    defineField({
      name: 'movement',
      title: 'Mouvement',
      type: 'string',
      group: 'specs',
      description: 'Ex: "Automatique cal. 26-330 S C", "Manuel cal. 1130 Vz".',
    }),
    defineField({
      name: 'productionYear',
      title: 'Année de production',
      type: 'number',
      group: 'specs',
      description: 'Ex: 2019.',
    }),
    defineField({
      name: 'condition',
      title: 'État',
      type: 'string',
      group: 'specs',
      options: { list: CONDITIONS, layout: 'radio' },
      initialValue: 'excellent',
    }),
    // ─── Provenance ───
    defineField({
      name: 'papers',
      title: 'Boîte & papiers',
      type: 'string',
      group: 'provenance',
      options: { list: PAPERS, layout: 'radio' },
      initialValue: 'full-set',
    }),
    defineField({
      name: 'provenanceNote',
      title: 'Note provenance',
      type: 'localeText',
      group: 'provenance',
      description:
        "Historique, première propriété, références d'archives. Confidentiel par défaut.",
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
      brand: 'brand',
      reference: 'reference',
      visibility: 'visibility',
      media: 'images.0',
    },
    prepare: ({ title, brand, reference, visibility, media }) => {
      const visIcon = visibility === 'public' ? '🌐' : visibility === 'shareCode' ? '🔑' : '🔒';
      const sub = [brand, reference].filter(Boolean).join(' · ');
      return {
        title: `${visIcon} ${String(title ?? 'Sans titre')}`,
        subtitle: sub || '—',
        media,
      };
    },
  },
});
