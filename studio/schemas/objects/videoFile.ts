// ═══════════════════════════════════════════════════
// videoFile — a self-hosted video uploaded directly to Sanity
//
// WHAT: a video file (mp4/webm/mov) uploaded to Sanity's CDN, with an
//       optional poster image (the still shown before play) and an
//       accessible description. No platform logo, full control — but it
//       uses storage/bandwidth, so keep clips short.
// WHEN: inside a media gallery (article.gallery[]). For long videos,
//       prefer videoEmbed (Vimeo) to avoid heavy hosting.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

export const videoFile = defineType({
  name: 'videoFile',
  title: 'Vidéo (fichier importé)',
  type: 'object',
  fields: [
    defineField({
      name: 'file',
      title: 'Fichier vidéo',
      type: 'file',
      options: { accept: 'video/*' },
      description:
        'Importe un fichier vidéo (mp4 recommandé). Garde les clips courts pour un chargement rapide.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'poster',
      title: "Image d'aperçu (poster)",
      type: 'image',
      options: { hotspot: true },
      description:
        'Image fixe affichée avant la lecture. Si vide, le navigateur prend la première frame.',
    }),
    defineField({
      name: 'alt',
      title: 'Description (accessibilité)',
      type: 'string',
      description:
        'Décris en 1 phrase ce que montre la vidéo, pour les lecteurs d\'écran. Ex: "Arrivée discrète d\'un yacht au coucher du soleil".',
      validation: Rule =>
        Rule.required().warning("La description est recommandée pour l'accessibilité."),
    }),
    defineField({
      name: 'caption',
      title: 'Légende (optionnelle)',
      type: 'localeString',
      description:
        'Texte affiché sous la vidéo. Traduisible FR/EN/ES. Laisse vide si non nécessaire.',
    }),
  ],
  preview: {
    select: { caption: 'caption.fr', alt: 'alt', media: 'poster' },
    prepare: ({ caption, alt, media }) => ({
      title: String(caption ?? alt ?? 'Vidéo importée'),
      subtitle: 'Fichier vidéo',
      media,
    }),
  },
});
