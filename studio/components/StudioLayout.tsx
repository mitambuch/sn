// ═══════════════════════════════════════════════════
// StudioLayout — global CSS fixes for known Sanity v4 UX pain points
//
// WHAT: Sanity's default form UI is cramped (narrow edit panel, H2 title
//       duplicated in the breadcrumb, noisy "All fields" tab, tiny
//       Publish button). This layout injects 5 surgical CSS overrides
//       that widen + clean without touching core styles.
//       It also FORCES the dark color scheme (see ForceDarkScheme below).
// WHEN: Registered via `studio.components.layout` in sanity.config.ts.
// RULE: .claude/rules/i18n-sanity.md lesson #12.
// ═══════════════════════════════════════════════════

import { useEffect } from 'react';
import { type LayoutProps, useColorSchemeSetValue } from 'sanity';

const GLOBAL_CSS = `
/* 1. The edit panel takes all available width */
[data-ui="Pane"]:last-child { flex: 1 1 auto !important; min-width: 0 !important; }
[data-ui="Container"] { max-width: 100% !important; }
[data-testid="document-panel-scroller"] form { max-width: 100% !important; }

/* 2. Hide the redundant H2 title + its Stack wrapper (already shown in breadcrumb) */
[data-testid="document-panel-document-title"],
[data-testid="form-view"] > [data-ui="Stack"]:first-child { display: none !important; }

/* 3. Hide the "All fields" tab — duplicate of our field groups */
[data-testid="group-tab-all-fields"] { display: none !important; }

/* 4. Compact pill-shaped group tabs — sticky to the top of the scroll
      area so Contenu / CTA / SEO / Avancé stay reachable while scrolling. */
[data-testid^="group-tab-"] {
  padding: 0.3rem 0.75rem !important;
  border-radius: 6px !important;
  font-size: 0.78rem !important;
}
[role="tablist"] {
  flex-wrap: wrap !important;
  gap: 0.25rem !important;
  margin: 0 !important;
}
[data-testid="field-groups"] {
  padding: 0.5rem 0 !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 10 !important;
  background: var(--card-bg-color, #1a1a1a) !important;
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--card-border-color, rgba(255,255,255,0.08));
}

/* 5. Publish button styled as the primary action */
button[data-testid*="ublish"] {
  font-weight: 600 !important;
  padding: 0.55rem 1.1rem !important;
  border-radius: 8px !important;
  font-size: 0.9rem !important;
}

/* 6. Hide Sanity promo dialogs/banners that occlude the edit panel.
      The "free upgrade" banner, "What's new" side banner, welcome
      onboarding popover — none of these help a paying client. */
[data-ui="Dialog"][role="dialog"]:has([aria-label*="upgrade" i]),
[data-ui="Dialog"][role="dialog"]:has([aria-label*="What's new" i]),
[data-testid="sanity-io-upsell"],
[data-testid="dashboard-banner"],
[id^="sanity-upgrade"],
div:has(> button:has-text("You got a free upgrade")),
div:has(> *:has-text("You got a free upgrade")),
aside:has([class*="upgrade" i]) {
  display: none !important;
}

/* 7. Tighter form density — Sanity defaults are sometimes airy for heavy
      trilingual forms. Clients with 20+ fields appreciate the compactness. */
[data-testid="form-view"] [data-ui="Stack"][data-space="5"] { gap: 0.75rem !important; }
[data-testid="field-"] + [data-testid="field-"] { margin-top: 0.5rem !important; }

/* 8. Slightly bigger, more readable labels */
label[data-ui="Label"] { font-size: 0.82rem !important; font-weight: 500 !important; }
`;

// ForceDarkScheme — locks the Studio to dark mode.
// WHY: the brand UI + injected CSS (e.g. field-groups bg #1a1a1a, light
//      text) is authored for dark. In light mode the client reported
//      near-invisible content. Forcing dark removes that failure mode.
// HOW: useColorSchemeSetValue is provided by Sanity's ColorSchemeProvider,
//      which sits ABOVE this layout — so the setter is available here.
//      We re-assert 'dark' on mount; the toggle is intentionally overridden.
function ForceDarkScheme() {
  const setScheme = useColorSchemeSetValue();
  useEffect(() => {
    if (typeof setScheme === 'function') setScheme('dark');
  }, [setScheme]);
  return null;
}

export function StudioLayout(props: LayoutProps) {
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <ForceDarkScheme />
      {props.renderDefault(props)}
    </>
  );
}
