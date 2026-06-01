// ═══════════════════════════════════════════════════
// event — Évènement (gala, ouverture, dîner privé, sport)
//
// WHAT: A closed-circle event with date, venue, capacity, programme,
//       photos. Lives at /[locale]/events/[slug] when public, in the
//       member space when private, or under a share code.
// WHEN: Salva crée une fiche event quand il y a un rendez-vous à
//       partager — Gala ONU, Art Basel preview, F1 hospitality, etc.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { icon } from '../_helpers/icons';
import { visibilityField, visibilityGroup } from '../_helpers/visibilityField';

const CATEGORIES = [
  { title: 'Gala / bienfaisance', value: 'gala' },
  { title: 'Vernissage / opening', value: 'opening' },
  { title: 'Dîner privé', value: 'private-dinner' },
  { title: 'Sport / hospitality', value: 'sport' },
  { title: 'Festival / culturel', value: 'festival' },
  { title: 'Concert privé', value: 'concert' },
  { title: 'Autre', value: 'other' },
];

const DRESS_CODES = [
  { title: 'Black tie', value: 'black-tie' },
  { title: 'Black tie optional', value: 'black-tie-optional' },
  { title: 'Business / formal', value: 'business' },
  { title: 'Smart casual', value: 'smart-casual' },
  { title: 'Aucun dress code', value: 'none' },
];

// WHY: certains rendez-vous n'ont pas de date fixe (offre dispo toute
// l'année, ou cadence libre type "chaque dimanche", "sur demande").
// Le mode pilote quels champs date sont demandés — cf. dateMode field.
const DATE_MODES = [
  { title: 'Date précise', value: 'exact' },
  { title: 'Toute l’année', value: 'allYear' },
  { title: 'Texte libre (ex: « Sur demande », « Été 2026 »)', value: 'free' },
];

export const event = defineType({
  name: 'event',
  title: 'Évènement',
  type: 'document',
  icon: icon('📅'),
  description:
    'Un rendez-vous fermé : gala, opening, dîner privé, sport. Astuce — pour dupliquer un évènement récurrent : menu ⋮ en haut à droite → Duplicate → change juste la date.',
  groups: [
    visibilityGroup,
    { name: 'essentiel', title: '🎯 Essentiel', default: true },
    { name: 'lieu', title: '📍 Lieu' },
    { name: 'pratique', title: '💰 Tarif & places' },
    { name: 'programme', title: '🗓️ Programme' },
    { name: 'medias', title: '📸 Médias' },
    { name: 'seo', title: '🔍 SEO' },
  ],
  fields: [
    visibilityField(),
    // ─── Essentiel ───
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'localeString',
      group: 'essentiel',
      description: 'Ex: "Gala de bienfaisance, ONU Genève".',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      group: 'essentiel',
      description: 'Identifiant URL. Auto-généré depuis le titre.',
      options: { source: 'title.fr', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'essentiel',
      options: { list: CATEGORIES, layout: 'radio' },
      initialValue: 'gala',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Résumé court',
      type: 'localeText',
      group: 'essentiel',
      description: '1-2 phrases pour les cards de catalogue. Pas le texte complet.',
    }),
    defineField({
      name: 'description',
      title: 'Description complète',
      type: 'localeRichText',
      group: 'essentiel',
      description: "Le récit complet de l'évènement, affiché sur la page détail.",
    }),
    defineField({
      name: 'dateMode',
      title: 'Mode de date',
      type: 'string',
      group: 'essentiel',
      options: { list: DATE_MODES, layout: 'radio' },
      initialValue: 'exact',
      description:
        '« Date précise » = début (et fin) calendaires. « Toute l’année » = dispo en permanence, aucune date à saisir. « Texte libre » = tu écris ce que tu veux.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'startsAt',
      title: 'Début',
      type: 'datetime',
      group: 'essentiel',
      description: 'Date et heure de début. Ex: 14.06.2026 19:30.',
      // WHY: only relevant in "exact" mode — hidden + required conditionally
      // so the operator isn't forced to invent a date for a year-round offer.
      hidden: ({ document }) => document?.dateMode != null && document.dateMode !== 'exact',
      validation: Rule =>
        Rule.custom((value, context) => {
          const mode = context.document?.dateMode ?? 'exact';
          if (mode === 'exact' && !value) return 'Date de début requise en mode « Date précise ».';
          return true;
        }),
    }),
    defineField({
      name: 'endsAt',
      title: 'Fin',
      type: 'datetime',
      group: 'essentiel',
      description: 'Date et heure de fin. Optionnel pour les évènements ouverts.',
      hidden: ({ document }) => document?.dateMode != null && document.dateMode !== 'exact',
    }),
    defineField({
      name: 'dateLabel',
      title: 'Date — texte libre',
      type: 'localeString',
      group: 'essentiel',
      description:
        'Affiché à la place de la date. Ex: « Sur demande », « Été 2026 », « Chaque dimanche ». Garde-le court — il sert aussi de pastille sur la carte.',
      hidden: ({ document }) => document?.dateMode !== 'free',
      validation: Rule =>
        Rule.custom((value: { fr?: string } | undefined, context) => {
          if (context.document?.dateMode !== 'free') return true;
          if (!value?.fr) return 'Texte requis en mode « Texte libre » (au moins le FR).';
          return true;
        }),
    }),
    // ─── Lieu ───
    defineField({
      name: 'venue',
      title: 'Lieu',
      type: 'string',
      group: 'lieu',
      description: 'Ex: "Palais des Nations", "Villa del Balbianello".',
    }),
    defineField({
      name: 'city',
      title: 'Ville',
      type: 'string',
      group: 'lieu',
      description: 'Ex: "Genève", "Bâle".',
    }),
    defineField({
      name: 'countryCode',
      title: 'Pays (code ISO)',
      type: 'string',
      group: 'lieu',
      description: '2 lettres. Ex: CH, FR, IT, US.',
      validation: Rule => Rule.length(2).warning('Code ISO 2 lettres recommandé.'),
    }),
    // ─── Pratique ───
    defineField({
      name: 'capacity',
      title: 'Capacité totale',
      type: 'number',
      group: 'pratique',
      description: 'Nombre total de places sur la liste. Ex: 220.',
    }),
    defineField({
      name: 'allocatedSeats',
      title: 'Places réservées à Sawnext',
      type: 'number',
      group: 'pratique',
      description: 'Places dont on dispose pour les clients. Ex: 4.',
    }),
    defineField({
      name: 'dressCode',
      title: 'Dress code',
      type: 'string',
      group: 'pratique',
      options: { list: DRESS_CODES, layout: 'radio' },
      initialValue: 'none',
    }),
    defineField({
      name: 'price',
      title: 'Tarif',
      type: 'priceBlock',
      group: 'pratique',
    }),
    // ─── Programme ───
    defineField({
      name: 'programme',
      title: 'Déroulé de la soirée',
      type: 'array',
      group: 'programme',
      of: [{ type: 'programmeStep' }],
      description: 'Ajoute chaque étape avec son heure. Ex: 19:30 Cocktail / 21:00 Dîner.',
    }),
    // ─── Médias ───
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'medias',
      of: [{ type: 'domainImage' }],
      options: { layout: 'grid' },
      description: 'Photos affichées en galerie sur la page détail. Première = image principale.',
    }),
    // ─── SEO ───
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'localeString',
      group: 'seo',
      description:
        'Override du titre dans la balise <title>. Laisse vide pour utiliser le titre principal.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description SEO',
      type: 'localeText',
      group: 'seo',
      description: 'Description en 155 caractères max pour les résultats Google.',
    }),
  ],
  preview: {
    select: {
      title: 'title.fr',
      city: 'city',
      startsAt: 'startsAt',
      dateMode: 'dateMode',
      dateLabel: 'dateLabel.fr',
      visibility: 'visibility',
      media: 'images.0',
    },
    prepare: ({ title, city, startsAt, dateMode, dateLabel, visibility, media }) => {
      const date =
        dateMode === 'allYear'
          ? 'Toute l’année'
          : dateMode === 'free'
            ? String(dateLabel ?? 'Texte libre')
            : startsAt
              ? new Date(startsAt as string).toLocaleDateString('fr-CH')
              : '—';
      const visIcon = visibility === 'public' ? '🌐' : visibility === 'shareCode' ? '🔑' : '🔒';
      return {
        title: `${visIcon} ${String(title ?? 'Sans titre')}`,
        subtitle: `${date} · ${String(city ?? '—')}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Date — plus récent',
      name: 'startsAtDesc',
      by: [{ field: 'startsAt', direction: 'desc' }],
    },
    {
      title: 'Date — chronologique',
      name: 'startsAtAsc',
      by: [{ field: 'startsAt', direction: 'asc' }],
    },
  ],
});
