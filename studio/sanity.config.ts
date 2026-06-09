// ═══════════════════════════════════════════════════
// Sanity Studio — root configuration
//
// Tools bar order : 📊 Tableau de bord · 📄 Structure · 🔭 Vision · 📖 Guide.
// Dashboard is first so it's the landing page when the Studio opens.
// Desk structure is customised (see structure/deskStructure.ts).
// StudioLayout injects global CSS that fixes 5 default-UX pain points.
// Singleton documents cannot be created/deleted/duplicated from the UI.
// ═══════════════════════════════════════════════════

import { languageFilter } from '@sanity/language-filter';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { media } from 'sanity-plugin-media';

import { makeShareDocumentAction } from './actions/shareDocumentAction';
import { Logo } from './components/Logo';
import { StudioLayout } from './components/StudioLayout';
import { schemaTypes } from './schemas';
import { SINGLETON_TYPES, structure } from './structure/deskStructure';
import { dashboardTool } from './tools/dashboardTool';
import { helpGuideTool } from './tools/helpGuideTool';

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? '';
const DATASET = process.env.SANITY_STUDIO_DATASET ?? 'staging';

// WHY: enables the "View" button in the Studio top-right. Opens the rendered
// draft of the current doc in a new tab. Falls back to process.env for Node,
// and a localhost default so the Studio stays usable in `pnpm studio:dev`.
const PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL ??
  process.env.SANITY_STUDIO_SITE_URL ??
  'http://localhost:5173';
const DEFAULT_LOCALE = 'fr';

// Studio title — branded per-client via env. Falls back to "Studio".
const STUDIO_TITLE = process.env.SANITY_STUDIO_BRAND_NAME ?? 'Studio';

// "Partager cette fiche…" Document Action — bound to the site URL once,
// then attached to every shareable document via the document.actions hook.
const shareDocumentAction = makeShareDocumentAction({ siteUrl: PREVIEW_URL });

export default defineConfig({
  name: 'steaksoap-studio',
  title: STUDIO_TITLE,

  projectId: PROJECT_ID,
  dataset: DATASET,

  plugins: [
    // 1st → landing page
    dashboardTool(),
    structureTool({ structure }),
    // Presentation tool — inline iframe preview of the site next to the
    // edit panel. Click an element in the preview → Studio opens the
    // matching doc. Uses PREVIEW_URL (env or localhost:5173 fallback).
    presentationTool({
      previewUrl: {
        origin: PREVIEW_URL,
        preview: `/${DEFAULT_LOCALE}`,
      },
    }),
    // Media library plugin — replaces the raw asset list with a real
    // gallery (tags, search, rename). Community-maintained, widely
    // adopted. Adds a "Media" tool in the top navigation.
    media(),
    visionTool(),
    // last → Guide tab on the right
    helpGuideTool(),
    languageFilter({
      supportedLanguages: [
        { id: 'fr', title: 'Français' },
        { id: 'en', title: 'English' },
        { id: 'es', title: 'Español' },
      ],
      defaultLanguages: ['fr'],
      documentTypes: [
        'page',
        'siteConfig',
        'landing',
        'event',
        'property',
        'timepiece',
        'artwork',
        'journey',
        'conciergeService',
        'article',
        'teamMember',
      ],
      filterField: (enclosingType, member, selectedLanguageIds) =>
        !enclosingType.name.startsWith('locale') || selectedLanguageIds.includes(member.name),
    }),
  ],

  schema: {
    types: schemaTypes,
    // Block singleton creation from "New document"
    templates: prev => prev.filter(t => !SINGLETON_TYPES.includes(t.schemaType)),
  },

  document: {
    // Block create / delete / duplicate / unpublish on singletons.
    // Append the "Partager cette fiche" action on every shareable doc —
    // the action component itself filters by schema type, so safe to
    // append unconditionally.
    actions: (prev, context) => {
      const base = SINGLETON_TYPES.includes(context.schemaType)
        ? prev.filter(a => !['duplicate', 'unpublish', 'delete'].includes(a.action ?? ''))
        : prev;
      return [...base, shareDocumentAction];
    },

    // "View" button (top-right of the editor) — opens the rendered draft
    // of the current doc. Wire-up per type : siteConfig → home, page →
    // /:locale/:slug, domain types → their listing or detail URL.
    productionUrl: async (prev, context) => {
      const { document } = context;
      if (document._type === 'siteConfig' || document._type === 'landing') {
        return `${PREVIEW_URL}/${DEFAULT_LOCALE}`;
      }
      if (document._type === 'page') {
        const slug = (document.slug as { current?: string } | undefined)?.current;
        if (!slug) return prev;
        const path = slug === 'home' ? '' : `/${slug}`;
        return `${PREVIEW_URL}/${DEFAULT_LOCALE}${path}?draft=1`;
      }
      // Domain documents : map _type to the corresponding listing folder,
      // then append slug for the detail page.
      const DOMAIN_PATHS: Record<string, string> = {
        event: 'events',
        property: 'properties',
        timepiece: 'timepieces',
        artwork: 'artworks',
        journey: 'journeys',
        conciergeService: 'concierge',
        article: 'news',
      };
      const folder = DOMAIN_PATHS[document._type];
      if (folder) {
        const slug = (document.slug as { current?: string } | undefined)?.current;
        const base = `${PREVIEW_URL}/${DEFAULT_LOCALE}/account/${folder}`;
        return slug ? `${base}/${slug}?draft=1` : base;
      }
      return prev;
    },
  },

  studio: {
    components: {
      layout: StudioLayout,
      logo: Logo,
    },
  },
});
