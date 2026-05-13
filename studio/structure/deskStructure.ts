// ═══════════════════════════════════════════════════
// deskStructure — custom sidebar menu of the Studio
//
// WHAT: Two-zone hierarchy.
//   ⚙️ Configuration globale (singleton)
//   ─── divider ───
//   🏠 Accueil    ℹ️ À propos    ✉️ Contact     (page singletons)
//   ─── divider ───
//   📅 Évènements   🏛️ Propriétés   ⌚ Garde-temps
//   🖼️ Œuvres       🌍 Voyages      🛎️ Conciergerie
//   📰 Actualités   👤 Équipe                     (domain collections)
//
// Adding a page : append an entry to PAGE_SINGLETONS.
// Adding a collection : append to DOMAIN_COLLECTIONS.
// ═══════════════════════════════════════════════════

import type { StructureResolver } from 'sanity/structure';

import { icon } from '../icons';

/** Document types that must remain single-instance (blocked in "New document"). */
export const SINGLETON_TYPES = ['siteConfig'];

/**
 * Page documents with fixed IDs.
 *
 * Each entry = one page singleton. `page-<id>` is the _id used everywhere,
 * so the app fetches with `*[_id == "page-home"][0]` and never wonders
 * which document represents the home page.
 */
export const PAGE_SINGLETONS: ReadonlyArray<{
  id: string;
  title: string;
  icon: string;
}> = [
  { id: 'home', title: 'Accueil', icon: '🏠' },
  { id: 'about', title: 'À propos', icon: 'ℹ️' },
  { id: 'contact', title: 'Contact', icon: '✉️' },
];

/**
 * Domain collections — Sanity document types with multiple instances.
 *
 * Each entry = one menu item that opens a list of docs of that type.
 * `type` matches the schema name. `title` is the sidebar label.
 */
export const DOMAIN_COLLECTIONS: ReadonlyArray<{
  type: string;
  title: string;
  icon: string;
}> = [
  { type: 'event', title: 'Évènements', icon: '📅' },
  { type: 'property', title: 'Propriétés', icon: '🏛️' },
  { type: 'timepiece', title: 'Garde-temps', icon: '⌚' },
  { type: 'artwork', title: "Œuvres d'art", icon: '🖼️' },
  { type: 'journey', title: 'Voyages', icon: '🌍' },
  { type: 'conciergeService', title: 'Conciergerie', icon: '🛎️' },
  { type: 'article', title: 'Actualités', icon: '📰' },
  { type: 'teamMember', title: 'Équipe', icon: '👤' },
];

export const structure: StructureResolver = S =>
  S.list()
    .title('Contenu')
    .items([
      // ── Global config ────────────────────────────
      S.listItem()
        .id('site-config')
        .title('Configuration globale')
        .icon(icon('⚙️'))
        .child(
          S.document()
            .documentId('siteConfig-singleton')
            .schemaType('siteConfig')
            .title('Configuration globale'),
        ),
      S.divider(),

      // ── Page singletons ────────────────────────────────────
      ...PAGE_SINGLETONS.map(p =>
        S.listItem()
          .id(`page-${p.id}`)
          .title(p.title)
          .icon(icon(p.icon))
          .child(S.document().documentId(`page-${p.id}`).schemaType('page').title(p.title)),
      ),
      S.divider(),

      // ── Domain collections ─────────────────────────────────
      ...DOMAIN_COLLECTIONS.map(c =>
        S.listItem()
          .id(`collection-${c.type}`)
          .title(c.title)
          .icon(icon(c.icon))
          .child(S.documentTypeList(c.type).title(c.title)),
      ),
    ]);
