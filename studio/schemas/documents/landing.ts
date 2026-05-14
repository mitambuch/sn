// ═══════════════════════════════════════════════════
// landing — Landing page editable copy (singleton)
//
// WHAT: All marketing copy of the public landing that the client should
//       be able to edit without redeploy. One document, one ID
//       (`landing-singleton`).
//
//       Scope decision (2026-05-14) : structural content stays code-side
//       so we don't break the mechanics — typewriter phrases (before /
//       highlight / after), Manifesto per-phrase indentation, Hero video
//       cycle list. These remain in `src/locales/{fr,en}.json` keyed
//       under landing.hero.cyclePhrases / landing.manifesto.p* etc.
//       Everything else (eyebrows, headlines, ledes, meta blocks, tile
//       copy, bios, terminal status, CTA labels) lives here.
// WHEN: Read by the app via `useLandingContent()` with i18n fallback —
//       so the site keeps working when the field is empty.
// RULE: .claude/rules/i18n-sanity.md (singleton shared across pages).
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { icon } from '../../icons';

export const landing = defineType({
  name: 'landing',
  title: 'Landing — page publique',
  type: 'document',
  icon: icon('🌐'),
  description:
    'Tout le contenu éditable de la page d’accueil publique. Phrases dynamiques de Hero / Manifesto restent côté code (mécaniques d’animation).',
  groups: [
    { name: 'terminal', title: '⌨️ Bandeau bas + CTAs', default: true },
    { name: 'hero', title: '🎬 Hero (méta + GPS)' },
    { name: 'presentation', title: '📝 Présentation' },
    { name: 'principles', title: '🧭 Principes' },
    { name: 'domains', title: '🗂️ Domaines' },
    { name: 'access', title: '🔑 Accès / cooptation' },
    { name: 'interlocutor', title: '👤 Interlocuteur' },
    { name: 'footer', title: '📎 Footer landing' },
  ],
  fields: [
    // ─── Terminal bar (bottom band) + global landing CTAs ─────────────
    defineField({
      name: 'terminalStatus',
      title: 'Statut bandeau bas',
      type: 'localeString',
      group: 'terminal',
      description: 'Ex : « Cooptation ouverte ». Affiché à gauche du pied de page landing.',
    }),
    defineField({
      name: 'terminalTz',
      title: 'Libellé fuseau horaire',
      type: 'localeString',
      group: 'terminal',
      description: 'Ex : « CH / CET ». Affiché à côté de l’horloge live.',
    }),
    defineField({
      name: 'ctaRequestAccess',
      title: 'CTA — Demander un accès',
      type: 'localeString',
      group: 'terminal',
      description: 'Libellé du bouton « Demander un accès » dans toute la landing.',
    }),
    defineField({
      name: 'ctaPrivateArea',
      title: 'CTA — Espace privé',
      type: 'localeString',
      group: 'terminal',
      description: 'Libellé du bouton qui ouvre la pop-up de connexion.',
    }),
    defineField({
      name: 'ctaCallDirect',
      title: 'CTA — Appeler',
      type: 'localeString',
      group: 'terminal',
      description: 'Libellé du bouton téléphone (icône + texte sur md+).',
    }),

    // ─── Hero (S01) — meta block on the right column ──────────────────
    defineField({
      name: 'heroMetaStructure',
      title: 'Hero — libellé colonne structure',
      type: 'localeString',
      group: 'hero',
      description: 'Petit eyebrow au-dessus du tableau type / statut / modèle.',
    }),
    defineField({
      name: 'heroMetaType',
      title: 'Hero — ligne « Type »',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroMetaTypeValue',
      title: 'Hero — valeur « Type »',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroMetaStatus',
      title: 'Hero — ligne « Statut »',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroMetaStatusValue',
      title: 'Hero — valeur « Statut »',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroMetaModel',
      title: 'Hero — ligne « Modèle »',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroMetaModelValue',
      title: 'Hero — valeur « Modèle »',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroMetaEstablished',
      title: 'Hero — ligne « Établi »',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroMetaEstablishedValue',
      title: 'Hero — valeur « Établi »',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroFieldLabel',
      title: 'Hero — eyebrow colonne « Champ d’action »',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'heroFieldText',
      title: 'Hero — paragraphe « Champ d’action »',
      type: 'localeText',
      group: 'hero',
      description: 'Le paragraphe court à droite du tableau.',
    }),
    defineField({
      name: 'heroGpsLabel',
      title: 'Hero — étiquette GPS',
      type: 'localeString',
      group: 'hero',
      description: 'Ex : « Coordonnées GPS ».',
    }),
    defineField({
      name: 'heroGpsValue',
      title: 'Hero — valeur GPS / localisation',
      type: 'localeString',
      group: 'hero',
      description: 'Ex : « 46.831°N · 6.842°E · Boudry, Suisse ».',
    }),

    // ─── Presentation (S03) ────────────────────────────────────────────
    defineField({
      name: 'presentationEyebrow',
      title: 'Présentation — eyebrow',
      type: 'localeString',
      group: 'presentation',
    }),
    defineField({
      name: 'presentationHeadline',
      title: 'Présentation — titre',
      type: 'localeString',
      group: 'presentation',
    }),
    defineField({
      name: 'presentationLede',
      title: 'Présentation — paragraphe principal',
      type: 'localeText',
      group: 'presentation',
    }),

    // ─── Principles (S04) ─────────────────────────────────────────────
    defineField({
      name: 'principlesEyebrow',
      title: 'Principes — eyebrow',
      type: 'localeString',
      group: 'principles',
    }),
    defineField({
      name: 'principlesHeadline',
      title: 'Principes — titre',
      type: 'localeString',
      group: 'principles',
    }),
    defineField({
      name: 'principles',
      title: 'Principes — liste',
      type: 'array',
      group: 'principles',
      description: '3 à 6 principes maximum. Chaque entrée = un titre + un paragraphe.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Titre', type: 'localeString' }),
            defineField({ name: 'body', title: 'Texte', type: 'localeText' }),
          ],
          preview: { select: { title: 'title.fr' } },
        },
      ],
    }),

    // ─── Domains (S05) ────────────────────────────────────────────────
    defineField({
      name: 'domainsEyebrow',
      title: 'Domaines — eyebrow',
      type: 'localeString',
      group: 'domains',
    }),
    defineField({
      name: 'domainsHeadline',
      title: 'Domaines — titre',
      type: 'localeString',
      group: 'domains',
    }),
    defineField({
      name: 'domainsLede',
      title: 'Domaines — paragraphe',
      type: 'localeText',
      group: 'domains',
    }),
    defineField({
      name: 'domainTiles',
      title: 'Domaines — tuiles',
      type: 'array',
      group: 'domains',
      description: '6 tuiles : Évènements, Propriétés, Garde-temps, Œuvres, Voyages, Conciergerie.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              title: 'Clé technique',
              type: 'string',
              description:
                'Doit matcher : event / property / timepiece / artwork / journey / concierge.',
            }),
            defineField({ name: 'title', title: 'Titre', type: 'localeString' }),
            defineField({ name: 'lead', title: 'Sous-titre / lead', type: 'localeText' }),
          ],
          preview: { select: { title: 'title.fr', subtitle: 'key' } },
        },
      ],
    }),

    // ─── Access (S08) ─────────────────────────────────────────────────
    defineField({
      name: 'accessEyebrow',
      title: 'Accès — eyebrow',
      type: 'localeString',
      group: 'access',
    }),
    defineField({
      name: 'accessTitleA',
      title: 'Accès — titre ligne 1',
      type: 'localeString',
      group: 'access',
    }),
    defineField({
      name: 'accessTitleB',
      title: 'Accès — titre ligne 2 (atténué)',
      type: 'localeString',
      group: 'access',
    }),
    defineField({
      name: 'accessLede',
      title: 'Accès — paragraphe',
      type: 'localeText',
      group: 'access',
    }),
    defineField({
      name: 'accessEventsEyebrow',
      title: 'Accès — eyebrow bandeau évènements',
      type: 'localeString',
      group: 'access',
    }),
    defineField({
      name: 'accessLockedEyebrow',
      title: 'Accès — eyebrow bandeau verrouillés',
      type: 'localeString',
      group: 'access',
    }),

    // ─── Interlocutor (S09) ───────────────────────────────────────────
    defineField({
      name: 'interlocutorEyebrow',
      title: 'Interlocuteur — eyebrow',
      type: 'localeString',
      group: 'interlocutor',
    }),
    defineField({
      name: 'interlocutorHeadlineA',
      title: 'Interlocuteur — titre ligne 1',
      type: 'localeString',
      group: 'interlocutor',
    }),
    defineField({
      name: 'interlocutorHeadlineB',
      title: 'Interlocuteur — titre ligne 2 (atténué)',
      type: 'localeString',
      group: 'interlocutor',
    }),
    defineField({
      name: 'interlocutorCircleTag',
      title: 'Interlocuteur — tag colonne droite',
      type: 'localeString',
      group: 'interlocutor',
      description: 'Ex : « Circle ».',
    }),
    defineField({
      name: 'interlocutorRole',
      title: 'Interlocuteur — rôle (libellé)',
      type: 'localeString',
      group: 'interlocutor',
      description: 'Ex : « Concierge ».',
    }),

    // ─── Footer landing ───────────────────────────────────────────────
    defineField({
      name: 'footerNote',
      title: 'Footer — note finale',
      type: 'localeText',
      group: 'footer',
      description: 'Petit paragraphe en bas du pied de page landing.',
    }),
    defineField({
      name: 'footerLocation',
      title: 'Footer — localisation',
      type: 'localeString',
      group: 'footer',
      description: 'Ex : « Boudry, Suisse ».',
    }),
    defineField({
      name: 'footerEdition',
      title: 'Footer — édition',
      type: 'localeString',
      group: 'footer',
      description: 'Ex : « Édition mai 2026 ».',
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Landing — contenu éditable',
      subtitle: '🌐 Singleton — page publique',
    }),
  },
});
