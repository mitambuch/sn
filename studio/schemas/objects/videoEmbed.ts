// ═══════════════════════════════════════════════════
// videoEmbed — a hosted video referenced by URL (Vimeo / YouTube)
//
// WHAT: stores just the share URL of a video hosted on Vimeo or YouTube.
//       The frontend turns it into a clean, privacy-friendly responsive
//       player (Vimeo player / youtube-nocookie). Use this when the video
//       already lives on a platform — no file is uploaded to Sanity, so it
//       costs nothing in storage/bandwidth.
// WHEN: inside a media gallery (article.gallery[]). Mix freely with photos
//       and uploaded videos.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

// Accept the common Vimeo / YouTube URL shapes; the player normalises them.
const VIDEO_URL =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|vimeo\.com\/|player\.vimeo\.com\/video\/)[\w-]+/i;

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Vidéo hébergée (Vimeo / YouTube)',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Lien de la vidéo',
      type: 'url',
      description:
        'Colle le lien Vimeo ou YouTube. Ex: "https://vimeo.com/123456789" ou "https://youtu.be/abc123". Vimeo est recommandé pour un rendu épuré, sans publicité ni vidéos suggérées.',
      validation: Rule =>
        Rule.required()
          .uri({ scheme: ['http', 'https'] })
          .custom(value =>
            typeof value !== 'string' || VIDEO_URL.test(value)
              ? true
              : 'Colle un lien Vimeo ou YouTube valide.',
          ),
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
    select: { url: 'url', caption: 'caption.fr' },
    prepare: ({ url, caption }) => ({
      title: String(caption ?? 'Vidéo hébergée'),
      subtitle: String(url ?? ''),
    }),
  },
});
