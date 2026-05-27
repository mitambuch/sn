// ═══════════════════════════════════════════════════
// teamMember — Membre de l'équipe (fondateur, conciergerie)
//
// WHAT: A person on the Sawnext team. Valmont is the focal contact ;
//       Harvy + Lucian + Tavio + Sergio form the network circle.
//       Used by Interlocutor section + article.author references.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { icon } from '../_helpers/icons';

const ROLES = [
  { title: 'Fondateur opérationnel', value: 'founder-operational' },
  { title: 'Cofondateur', value: 'cofounder' },
  { title: 'Conseil / advisory', value: 'advisor' },
  { title: 'Conciergerie', value: 'concierge' },
  { title: 'Autre', value: 'other' },
];

export const teamMember = defineType({
  name: 'teamMember',
  title: "Membre de l'équipe",
  type: 'document',
  icon: icon('👤'),
  description:
    'Fondateur opérationnel et cercle réseau. Valmont reste le point de contact principal.',
  groups: [
    { name: 'essentiel', title: '🎯 Essentiel', default: true },
    { name: 'contact', title: '📞 Contact' },
    { name: 'bio', title: '✍️ Biographie' },
  ],
  fields: [
    defineField({
      name: 'firstName',
      title: 'Prénom',
      type: 'string',
      group: 'essentiel',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Nom',
      type: 'string',
      group: 'essentiel',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      group: 'essentiel',
      options: {
        source: doc => `${doc.firstName as string} ${doc.lastName as string}`,
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rôle',
      type: 'string',
      group: 'essentiel',
      options: { list: ROLES, layout: 'radio' },
      initialValue: 'concierge',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Tag spécialité',
      type: 'localeString',
      group: 'essentiel',
      description: 'Courte étiquette. Ex: "Sport & lifestyle", "Sport & relation HNW".',
    }),
    defineField({
      name: 'isFocal',
      title: 'Point de contact principal',
      type: 'boolean',
      group: 'essentiel',
      initialValue: false,
      description:
        'Un seul membre devrait être marqué focal — celui qui apparaît en grand sur la landing.',
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      group: 'essentiel',
      initialValue: 99,
      description: 'Plus le nombre est petit, plus haut dans la liste. Valmont = 1.',
    }),
    // ─── Contact ───
    defineField({
      name: 'phone',
      title: 'Téléphone',
      type: 'string',
      group: 'contact',
      description: 'Format E.164. Ex: "+41787498170".',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'url',
      group: 'contact',
      description: 'Lien wa.me complet. Ex: https://wa.me/41787498170',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn',
      type: 'url',
      group: 'contact',
    }),
    // ─── Bio ───
    defineField({
      name: 'bio',
      title: 'Biographie',
      type: 'localeText',
      group: 'bio',
      description: 'Affichée dans la section équipe de la landing.',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'domainImage',
      group: 'bio',
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'role',
      isFocal: 'isFocal',
      media: 'photo',
    },
    prepare: ({ firstName, lastName, role, isFocal, media }) => ({
      title: `${isFocal ? '⭐ ' : ''}${String(firstName ?? '')} ${String(lastName ?? '')}`,
      subtitle: String(role ?? '—'),
      media,
    }),
  },
  orderings: [
    {
      title: "Ordre d'affichage",
      name: 'order',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
