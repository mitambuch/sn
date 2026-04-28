// ═══════════════════════════════════════════════════
// Logo — Studio wordmark (top-left of the tool bar)
//
// WHAT: Replaces the default "Sanity" wordmark. Reads from env vars
//       so each client project has its own branding without forking
//       this file :
//         SANITY_STUDIO_BRAND_NAME   — label text (default: "Studio")
//         SANITY_STUDIO_BRAND_EMOJI  — leading glyph (default: "📝")
//         SANITY_STUDIO_BRAND_IMAGE  — absolute path or URL to a logo
//                                       image (overrides emoji if set)
// WHEN: Rendered by studio.components.logo in sanity.config.ts.
// CHANGE per client : edit studio/.env.local (or a .env at deploy).
// ═══════════════════════════════════════════════════

import type { ReactElement } from 'react';

const BRAND_NAME = process.env.SANITY_STUDIO_BRAND_NAME ?? 'Studio';
const BRAND_EMOJI = process.env.SANITY_STUDIO_BRAND_EMOJI ?? '📝';
const BRAND_IMAGE = process.env.SANITY_STUDIO_BRAND_IMAGE ?? '';

export function Logo(): ReactElement {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      {BRAND_IMAGE ? (
        <img
          src={BRAND_IMAGE}
          alt=""
          aria-hidden="true"
          style={{ height: 18, width: 'auto', display: 'block' }}
        />
      ) : (
        <span aria-hidden="true" style={{ fontSize: 16 }}>
          {BRAND_EMOJI}
        </span>
      )}
      {BRAND_NAME}
    </span>
  );
}
