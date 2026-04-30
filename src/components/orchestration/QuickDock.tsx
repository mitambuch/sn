// ═══════════════════════════════════════════════════
// QuickDock — top-right persistent quick actions
//
// WHAT: A row of four micro labels — APPELER · ÉCRIRE · ESPACE
//       CLIENT · WHATSAPP ↗ — that fade in once the loader has
//       cleared and stays visible across all subsequent acts.
//       mix-blend-difference keeps it readable on every surface.
// WHEN: Mounted once at the SceneDirector root, after Threshold has
//       resolved (gated by `hasCrossedThreshold`).
// CHANGE LABELS: ITEMS array — keep them very short (1 word each).
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { useScene } from '@components/orchestration/useScene';
import { ROUTES } from '@constants/routes';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CONTACT_PHONE = '+41787498170';
const WHATSAPP_URL =
  'https://wa.me/41787498170?text=' +
  encodeURIComponent('Bonjour Salvatore, je souhaiterais entrer en contact avec SAW Next.');

interface QuickDockProps {
  /** Optional click handler triggered on "ÉCRIRE" — opens the drawer if provided. */
  onWrite?: (() => void) | undefined;
}

export const QuickDock = ({ onWrite }: QuickDockProps) => {
  const { hasCrossedThreshold } = useScene();
  const { localePath } = useLocale();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      aria-label="Actions rapides"
      className="pointer-events-auto fixed top-6 right-6 z-9998 flex items-center gap-5 font-mono text-[10px] font-semibold tracking-[0.35em] uppercase mix-blend-difference transition-opacity duration-700 md:top-12 md:right-12 md:gap-7"
      style={{
        opacity: hasCrossedThreshold ? 1 : 0,
        pointerEvents: hasCrossedThreshold ? 'auto' : 'none',
        color: '#ffffff',
      }}
      onMouseLeave={() => setHovered(null)}
    >
      <a
        href={`tel:${CONTACT_PHONE}`}
        onMouseEnter={() => setHovered('call')}
        className={hovered && hovered !== 'call' ? 'opacity-50' : 'opacity-100'}
      >
        APPELER
      </a>
      <span aria-hidden="true" className="opacity-30">
        ·
      </span>
      <button
        type="button"
        onClick={onWrite}
        onMouseEnter={() => setHovered('write')}
        className={hovered && hovered !== 'write' ? 'opacity-50' : 'opacity-100'}
      >
        ÉCRIRE
      </button>
      <span aria-hidden="true" className="opacity-30">
        ·
      </span>
      <Link
        to={localePath(ROUTES.LOGIN)}
        onMouseEnter={() => setHovered('login')}
        className={hovered && hovered !== 'login' ? 'opacity-50' : 'opacity-100'}
      >
        ESPACE CLIENT
      </Link>
      <span aria-hidden="true" className="opacity-30">
        ·
      </span>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered('whatsapp')}
        className={hovered && hovered !== 'whatsapp' ? 'opacity-50' : 'opacity-100'}
      >
        WHATSAPP ↗
      </a>
    </div>
  );
};
