// ═══════════════════════════════════════════════════
// property — Propriété (résidence, chalet, villa, ranch)
//
// WHAT: A real-estate asset, off-market or curated. Lives at
//       /[locale]/properties/[slug] when public, espace membre when
//       private, or via share code.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { icon } from '../_helpers/icons';
import { visibilityField, visibilityGroup } from '../_helpers/visibilityField';

const KINDS = [
  { title: 'Chalet alpin', value: 'chalet' },
  { title: 'Villa', value: 'villa' },
  { title: 'Appartement', value: 'apartment' },
  { title: 'Domaine / propriété', value: 'estate' },
  { title: 'Penthouse', value: 'penthouse' },
  { title: 'Ferme / mas', value: 'farmhouse' },
  { title: 'Hôtel particulier', value: 'townhouse' },
  { title: 'Autre', value: 'other' },
];

const TRANSACTION_TYPES = [
  { title: 'Achat', value: 'sale' },
  { title: 'Location longue', value: 'rental-long' },
  { title: 'Location saisonnière', value: 'rental-seasonal' },
  { title: 'Sur demande', value: 'on-request' },
];

export const property = defineType({
  name: 'property',
  title: 'Propriété',
  type: 'document',
  icon: icon('🏛️'),
  description: 'Bien immobilier off-market ou curé : chalet, villa, propriété, penthouse.',
  groups: [
    visibilityGroup,
    { name: 'essentiel', title: '🎯 Essentiel', default: true },
    { name: 'localisation', title: '📍 Localisation' },
    { name: 'caracteristiques', title: '📐 Caractéristiques' },
    { name: 'tarif', title: '💰 Tarif & disponibilité' },
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
      description: 'Ex: "Chalet historique de Sankt Moritz".',
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
      name: 'kind',
      title: 'Type de bien',
      type: 'string',
      group: 'essentiel',
      options: { list: KINDS, layout: 'radio' },
      initialValue: 'chalet',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'transactionType',
      title: 'Mode',
      type: 'string',
      group: 'essentiel',
      options: { list: TRANSACTION_TYPES, layout: 'radio' },
      initialValue: 'on-request',
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
    // ─── Localisation ───
    defineField({
      name: 'city',
      title: 'Ville / lieu',
      type: 'string',
      group: 'localisation',
      description: 'Ex: "Sankt Moritz", "Cap d\'Antibes".',
    }),
    defineField({
      name: 'region',
      title: 'Région',
      type: 'string',
      group: 'localisation',
      description: 'Ex: "Engadine", "Côte d\'Azur".',
    }),
    defineField({
      name: 'countryCode',
      title: 'Pays (code ISO)',
      type: 'string',
      group: 'localisation',
      validation: Rule => Rule.length(2).warning('Code ISO 2 lettres.'),
    }),
    // ─── Caractéristiques ───
    defineField({
      name: 'bedrooms',
      title: 'Chambres',
      type: 'number',
      group: 'caracteristiques',
    }),
    defineField({
      name: 'bathrooms',
      title: 'Salles de bain',
      type: 'number',
      group: 'caracteristiques',
    }),
    defineField({
      name: 'livingArea',
      title: 'Surface habitable (m²)',
      type: 'number',
      group: 'caracteristiques',
    }),
    defineField({
      name: 'landArea',
      title: 'Surface terrain (m²)',
      type: 'number',
      group: 'caracteristiques',
    }),
    defineField({
      name: 'amenities',
      title: 'Aménagements',
      type: 'array',
      group: 'caracteristiques',
      of: [{ type: 'localeString' }],
      description:
        'Ex: "Piscine intérieure", "Spa privé", "Héliport", "Cave à vin 1200 bouteilles".',
    }),
    // ─── Tarif ───
    defineField({
      name: 'price',
      title: 'Tarif',
      type: 'priceBlock',
      group: 'tarif',
    }),
    defineField({
      name: 'availability',
      title: 'Disponibilité',
      type: 'localeString',
      group: 'tarif',
      description: 'Ex: "Saison hiver 2026-2027", "Immédiate", "Sur demande".',
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
      city: 'city',
      kind: 'kind',
      visibility: 'visibility',
      media: 'images.0',
    },
    prepare: ({ title, city, kind, visibility, media }) => {
      const visIcon = visibility === 'public' ? '🌐' : visibility === 'shareCode' ? '🔑' : '🔒';
      return {
        title: `${visIcon} ${String(title ?? 'Sans titre')}`,
        subtitle: `${String(kind ?? '—')} · ${String(city ?? '—')}`,
        media,
      };
    },
  },
});
