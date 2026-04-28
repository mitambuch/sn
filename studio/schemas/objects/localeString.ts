// ═══════════════════════════════════════════════════
// localeString — short multilingual text (FR required, DE/EN optional)
//
// WHAT: FR is the source of truth. DE/EN share the same compact input:
//       3 language tabs (🇫🇷 FR · 🇩🇪 DE · 🇬🇧 EN) with a fill indicator
//       dot per tab, one input visible at a time. No more stacked
//       3-field rendering.
// WHEN: Titles, labels, CTAs, eyebrow text ≤ 80 characters.
// RULE: .claude/rules/i18n-sanity.md lesson #2 — FR is warning, never required.
// ═══════════════════════════════════════════════════

import { defineField, defineType } from 'sanity';

import { LocaleTabsInput } from '../../components/LocaleTabsInput';

export const localeString = defineType({
  name: 'localeString',
  title: 'Texte court',
  type: 'object',
  components: { input: LocaleTabsInput },
  fields: [
    defineField({
      name: 'fr',
      title: 'Français',
      type: 'string',
      // WHY: warning (not error) — an empty field doesn't block publishing
      // but is surfaced so the editor can't ship a blank page unknowingly.
      validation: Rule => Rule.required().warning('Le texte FR est recommandé.'),
    }),
    defineField({ name: 'de', title: 'Deutsch', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
});
