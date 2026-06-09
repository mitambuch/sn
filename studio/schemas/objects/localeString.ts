// ═══════════════════════════════════════════════════
// localeString — short multilingual text (FR required, EN/ES optional)
//
// WHAT: FR is the source of truth. EN + ES share the same compact input:
//       3 language tabs (🇫🇷 FR · 🇬🇧 EN · 🇪🇸 ES) with a fill indicator
//       dot per tab, one input visible at a time. No more stacked
//       multi-field rendering.
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
    defineField({ name: 'en', title: 'English', type: 'string' }),
    defineField({ name: 'es', title: 'Español', type: 'string' }),
  ],
  // WHY: without a preview, every `localeString` inside an array renders as
  // "Untitled" in the Studio list — the editor can't tell items apart nor see
  // whether EN is filled, which reads as "the translation didn't save". Title
  // shows FR (EN fallback) ; subtitle surfaces the EN value or a to-do marker.
  preview: {
    select: { fr: 'fr', en: 'en' },
    prepare: ({ fr, en }) => {
      const frText = String(fr ?? '').trim();
      const enText = String(en ?? '').trim();
      return {
        title: frText || enText || '(vide)',
        subtitle: enText ? `EN · ${enText}` : 'EN à compléter',
      };
    },
  },
});
