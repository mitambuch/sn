// ═══════════════════════════════════════════════════
// journey — Voyage curaté (itinéraire bespoke)
//
// WHAT: A bespoke journey — multi-day itinerary, jets/yachts/villas,
//       guides, secured logistics.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { icon } from '../_helpers/icons';
import { visibilityField, visibilityGroup } from '../_helpers/visibilityField';

const DURATIONS = [
  { title: 'Weekend (2-3 jours)', value: 'weekend' },
  { title: 'Court (4-5 jours)', value: 'short' },
  { title: 'Semaine', value: 'week' },
  { title: 'Long (10-14 jours)', value: 'long' },
  { title: 'Expédition (3+ semaines)', value: 'expedition' },
];

export const journey = defineType({
  name: 'journey',
  title: 'Voyage',
  type: 'document',
  icon: icon('🌍'),
  description: 'Voyage curaté avec itinéraire détaillé — jet privé, yacht, guides, villas.',
  groups: [
    visibilityGroup,
    { name: 'essentiel', title: '🎯 Essentiel', default: true },
    { name: 'itineraire', title: '🗺️ Itinéraire' },
    { name: 'logistique', title: '✈️ Logistique' },
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
      description: 'Ex: "Patagonie sauvage et estancias privées".',
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
      name: 'destinations',
      title: 'Destinations',
      type: 'array',
      group: 'essentiel',
      of: [{ type: 'localeString' }],
      description:
        'Une ou plusieurs destinations, chacune traduisible (FR/EN). Ex: "Buenos Aires", "El Calafate", "Île de Pâques"/"Easter Island".',
    }),
    defineField({
      name: 'duration',
      title: 'Durée',
      type: 'string',
      group: 'essentiel',
      options: { list: DURATIONS, layout: 'radio' },
      initialValue: 'week',
    }),
    defineField({
      name: 'durationDays',
      title: 'Nombre de jours précis',
      type: 'number',
      group: 'essentiel',
      description: 'Ex: 12.',
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
    // ─── Itinéraire ───
    defineField({
      name: 'itinerary',
      title: 'Étapes',
      type: 'array',
      group: 'itineraire',
      of: [{ type: 'itineraryDay' }],
      description:
        'Ajoute chaque journée dans l\'ordre — numérotée automatiquement (Jour 1, Jour 2…). Pas d\'heure : juste le titre du jour + un détail optionnel. Ex: "Arrivée privée à El Calafate, transfert estancia".',
    }),
    // ─── Logistique ───
    defineField({
      name: 'transport',
      title: 'Transport',
      type: 'array',
      group: 'logistique',
      of: [{ type: 'localeString' }],
      description: 'Ex: "Jet privé Global 7500", "Yacht 65m", "Hélicoptère pour le glacier".',
    }),
    defineField({
      name: 'accommodation',
      title: 'Hébergement',
      type: 'array',
      group: 'logistique',
      of: [{ type: 'localeString' }],
      description: 'Ex: "Estancia privée Eolo", "Tipuana lodge", "Cruise Australis suite avant".',
    }),
    defineField({
      name: 'partySize',
      title: 'Taille du groupe',
      type: 'string',
      group: 'logistique',
      description: 'Ex: "2-4 personnes", "Couple", "Famille 4-6", "Sur mesure".',
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
      destinations: 'destinations',
      durationDays: 'durationDays',
      visibility: 'visibility',
      media: 'images.0',
    },
    prepare: ({ title, destinations, durationDays, visibility, media }) => {
      const visIcon = visibility === 'public' ? '🌐' : visibility === 'shareCode' ? '🔑' : '🔒';
      const destStr = Array.isArray(destinations)
        ? (destinations as Array<{ fr?: string }>)
            .slice(0, 2)
            .map(d => d?.fr)
            .filter(Boolean)
            .join(' · ')
        : '';
      const durStr = typeof durationDays === 'number' ? `${String(durationDays)}j` : '';
      return {
        title: `${visIcon} ${String(title ?? 'Sans titre')}`,
        subtitle: [destStr, durStr].filter(Boolean).join(' · ') || '—',
        media,
      };
    },
  },
});
