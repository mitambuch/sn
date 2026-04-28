// ═══════════════════════════════════════════════════
// deskStructure — custom sidebar menu of the Studio
//
// WHAT: Flat hierarchy — each page singleton is a direct top-level
//       item, no intermediate "Pages du site" accordion to click
//       through. Opening a page takes 1 click instead of 2.
//   📊 Tableau de bord (landing tool)
//   ⚙️ Configuration globale (singleton)
//   ─── divider ───
//   🏠 Accueil
//   ℹ️ À propos
//   ✉️ Contact
//   ─── divider ───
//   (collections placeholder)
//
// Adding a page : append an entry to PAGE_SINGLETONS.
// Adding a collection type (e.g. person, testimonial) : append a
// listItem block after the second divider (see commented example).
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
      // Flat top-level items so the editor clicks Accueil / À propos /
      // Contact directly, without going through a "Pages du site"
      // wrapper pane first. One less click per page edit.
      ...PAGE_SINGLETONS.map(p =>
        S.listItem()
          .id(`page-${p.id}`)
          .title(p.title)
          .icon(icon(p.icon))
          .child(S.document().documentId(`page-${p.id}`).schemaType('page').title(p.title)),
      ),
      S.divider(),

      // ── Collections placeholder ──────────────────
      // Clients add repeatable entities here:
      //
      //   S.listItem()
      //     .id('team')
      //     .title('Équipe')
      //     .icon(icon('👥'))
      //     .child(S.documentTypeList('person').title('Équipe')),
    ]);
