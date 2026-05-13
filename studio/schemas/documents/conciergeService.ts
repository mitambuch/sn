// ═══════════════════════════════════════════════════
// conciergeService — Prestation conciergerie
//
// WHAT: A bespoke concierge capability — transport, gastronomie,
//       sécurité, médical, culturel.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { icon } from '../_helpers/icons';
import { visibilityField, visibilityGroup } from '../_helpers/visibilityField';

const CATEGORIES = [
  { title: 'Transport (jet, yacht, hélico, voitures)', value: 'transport' },
  { title: 'Gastronomie (chefs, tables privées, dégustations)', value: 'gastronomy' },
  { title: 'Sécurité (close protection, audit, escorte)', value: 'security' },
  { title: 'Médical (concierge médical, second avis)', value: 'medical' },
  { title: 'Culture (visites privées, accès collections)', value: 'culture' },
  { title: 'Sport & wellness', value: 'wellness' },
  { title: 'Famille (nounou, écoles, formalités)', value: 'family' },
  { title: 'Autre', value: 'other' },
];

export const conciergeService = defineType({
  name: 'conciergeService',
  title: 'Prestation conciergerie',
  type: 'document',
  icon: icon('🛎️'),
  description:
    'Une capacité concierge sur mesure : transport, gastronomie, sécurité, médical, culture.',
  groups: [
    visibilityGroup,
    { name: 'essentiel', title: '🎯 Essentiel', default: true },
    { name: 'details', title: '📋 Détails' },
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
      description: 'Ex: "Chef à domicile — étoilé Michelin".',
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
      validation: Rule => Rule.required(),
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
    // ─── Détails ───
    defineField({
      name: 'leadTime',
      title: 'Délai',
      type: 'localeString',
      group: 'details',
      description: 'Ex: "24h", "Immédiat", "1 semaine de préavis".',
    }),
    defineField({
      name: 'coverageArea',
      title: 'Zone géographique',
      type: 'localeString',
      group: 'details',
      description: 'Ex: "Suisse romande", "Europe", "Monde".',
    }),
    defineField({
      name: 'capabilities',
      title: 'Capacités précises',
      type: 'array',
      group: 'details',
      of: [{ type: 'localeString' }],
      description:
        'Liste à puces de ce qui est inclus. Ex: "Menu sur mesure", "Service en salle", "Vins accordés".',
    }),
    // ─── Tarif ───
    defineField({
      name: 'price',
      title: 'Tarif',
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
      category: 'category',
      visibility: 'visibility',
      media: 'images.0',
    },
    prepare: ({ title, category, visibility, media }) => {
      const visIcon = visibility === 'public' ? '🌐' : visibility === 'shareCode' ? '🔑' : '🔒';
      return {
        title: `${visIcon} ${String(title ?? 'Sans titre')}`,
        subtitle: String(category ?? '—'),
        media,
      };
    },
  },
});
