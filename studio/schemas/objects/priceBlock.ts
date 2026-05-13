// ═══════════════════════════════════════════════════
// priceBlock — structured price with currency + free-form note
//
// WHAT: A reusable Sanity price object. Three modes :
//       - 'amount' : numeric amount + currency (CHF / EUR / USD).
//       - 'onRequest' : "Sur demande" — no public price displayed.
//       - 'range' : amount = lower bound, note = "à partir de" or range
//         description.
//       Salva picks the mode. Frontend formats accordingly.
// WHEN: Use in domain docs that have a price (event, property,
//       timepiece, artwork, journey, conciergeService).
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

export const priceBlock = defineType({
  name: 'priceBlock',
  title: 'Prix',
  type: 'object',
  fields: [
    defineField({
      name: 'mode',
      title: 'Mode',
      type: 'string',
      description:
        'Choisis comment afficher le prix au client. "Sur demande" reste discret — c\'est le défaut HNW.',
      options: {
        list: [
          { title: '💰 Montant fixe', value: 'amount' },
          { title: '📊 À partir de (plage)', value: 'range' },
          { title: '🤫 Sur demande', value: 'onRequest' },
        ],
        layout: 'radio',
      },
      initialValue: 'onRequest',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Montant',
      type: 'number',
      description: 'En nombre entier sans symbole. Ex: 4500.',
      hidden: ({ parent }) => parent?.mode === 'onRequest',
    }),
    defineField({
      name: 'currency',
      title: 'Devise',
      type: 'string',
      options: {
        list: [
          { title: 'CHF', value: 'CHF' },
          { title: 'EUR', value: 'EUR' },
          { title: 'USD', value: 'USD' },
        ],
        layout: 'radio',
      },
      initialValue: 'CHF',
      hidden: ({ parent }) => parent?.mode === 'onRequest',
    }),
    defineField({
      name: 'note',
      title: 'Note libre',
      type: 'localeString',
      description: 'Précision optionnelle. Ex: "par personne", "à la nuit", "incluant taxes".',
    }),
  ],
});
