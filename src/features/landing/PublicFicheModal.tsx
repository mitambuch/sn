// ═══════════════════════════════════════════════════
// PublicFicheModal — the public fiche as an overlay over the site
//
// WHAT: Renders the shared <PublicFichePanel/> inside a Modal so a catalogue
//       fiche opens as a popup IN FRONT of the landing, not a separate page
//       (owner direction 2026-06-17). The Modal owns the close button, the
//       backdrop, the focus trap and Escape. The panel owns the fiche.
// WHEN: Mounted by the 08.A teaser (Access), controlled by which item is open.
// ═══════════════════════════════════════════════════

import { Modal } from '@components/ui/Modal';
import { PublicFichePanel } from '@features/landing/PublicFichePanel';
import type { PublicCatalogueType } from '@features/landing/usePublicCatalogue';

interface PublicFicheModalProps {
  /** The catalogue item to show, or null when the modal is closed. */
  item: { type: PublicCatalogueType; id: string } | null;
  onClose: () => void;
  /** Fired by the fiche CTA — the parent closes the fiche then opens access. */
  onRequestAccess: () => void;
}

/** The public fiche, opened as a popup over the landing. */
export const PublicFicheModal = ({ item, onClose, onRequestAccess }: PublicFicheModalProps) => (
  <Modal isOpen={item !== null} onClose={onClose} className="max-w-2xl">
    {item && <PublicFichePanel type={item.type} id={item.id} onRequestAccess={onRequestAccess} />}
  </Modal>
);
