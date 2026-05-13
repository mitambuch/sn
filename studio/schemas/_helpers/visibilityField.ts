// ═══════════════════════════════════════════════════
// visibilityField — tri-state access control for every domain doc
//
// WHAT: A reusable Sanity field configuration that gives Salva three
//       access modes on every fiche (event / property / timepiece /
//       artwork / journey / conciergeService / article / teamMember) :
//
//       ① 'private'    — visible only to authenticated clients in
//                        their /account space. Default for new docs.
//       ② 'public'     — accessible via the canonical public URL
//                        /[locale]/[domain]/[slug] without auth.
//                        Indexed by Google.
//       ③ 'shareCode'  — Salva generates a SAW-XXXXXXXX code in the
//                        Supabase share_codes table that points to
//                        this doc. Recipient lands on /share/[code]
//                        without auth — sees ONLY this single doc.
//
// WHEN: import + spread into every document fields[] array, ideally
//       in a dedicated "🔓 Visibilité & partage" group at the top.
// USAGE:
//   import { visibilityField, visibilityGroup } from '../_helpers/visibilityField';
//   defineType({
//     groups: [visibilityGroup, ...],
//     fields: [visibilityField(), ...],
//   });
// ═══════════════════════════════════════════════════

import { defineField } from 'sanity';

export const VISIBILITY_GROUP_NAME = 'visibility';

/** Group spec to register at the top of each document's groups array. */
export const visibilityGroup = {
  name: VISIBILITY_GROUP_NAME,
  title: '🔓 Visibilité & partage',
};

/**
 * Returns the shared `visibility` field config.
 * Drop into every domain document's `fields` array.
 */
export const visibilityField = () =>
  defineField({
    name: 'visibility',
    title: 'Mode de visibilité',
    type: 'string',
    group: VISIBILITY_GROUP_NAME,
    description:
      'Qui voit cette fiche ? Choisis selon l\'intention. "Privée" est le défaut sûr — la fiche n\'apparaît que dans l\'espace privé des membres connectés. Astuce : une fois la visibilité réglée, utilise le menu ⋮ en haut à droite → "Partager cette fiche…" pour générer un code (mode 🔑) ou récupérer le lien public (mode 🌐) en un clic.',
    options: {
      list: [
        {
          title: '🔒 Privée — espace client uniquement (membres connectés)',
          value: 'private',
        },
        {
          title: '🌐 Publique — visible sur le site, indexée Google',
          value: 'public',
        },
        {
          title: '🔑 Partage par code — un code SAW-XXXXXXXX donne accès à cette fiche seule',
          value: 'shareCode',
        },
      ],
      layout: 'radio',
    },
    initialValue: 'private',
    validation: Rule => Rule.required(),
  });
