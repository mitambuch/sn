// ═══════════════════════════════════════════════════
// sharing — channel-agnostic share helpers (WhatsApp, email, SMS, copy)
//
// WHAT: Pure utilities that turn (url, message) tuples into ready-to-open
//       deeplinks. No DOM dependency — usable from both the React app and
//       the Sanity Studio runtime. All templates respect the brand voice
//       (sober, factual, no exclamation marks, French-first).
// WHEN: Used by ShareActionRow, AdminShareCodes, SharePage, and the
//       Studio Document Action dialog.
// CHANGE TEMPLATES: edit the buildShareMessage() switch below — anything
//       else (channel construction, URL format) stays stable.
// ═══════════════════════════════════════════════════

import type { ShareableDocType } from '@/types/share';

export type ShareLocale = 'fr' | 'en';

/** Pretty French label per doc type — used in message templates. */
const TYPE_LABELS_FR: Record<ShareableDocType, string> = {
  event: 'évènement',
  property: 'propriété',
  timepiece: 'pièce horlogère',
  artwork: "œuvre d'art",
  journey: 'voyage',
  conciergeService: 'service',
  article: 'actualité',
};

const TYPE_LABELS_EN: Record<ShareableDocType, string> = {
  event: 'event',
  property: 'property',
  timepiece: 'timepiece',
  artwork: 'artwork',
  journey: 'journey',
  conciergeService: 'service',
  article: 'article',
};

interface BuildMessageOpts {
  /** Sanity doc type — drives the noun used in the template. */
  docType?: ShareableDocType | null;
  /** Pretty title of the fiche (e.g. "Gala de bienfaisance, ONU"). */
  title?: string | null;
  /** Absolute URL the recipient will open. */
  url: string;
  /** Optional code to mention explicitly (rare — usually baked into url). */
  code?: string | null;
  /** Locale of the message. Defaults to 'fr'. */
  locale?: ShareLocale;
}

/**
 * Build the pre-filled text Salva sends. Concise, factual, no emoji.
 * The recipient reads this on WhatsApp / iMessage and sees Salva's voice,
 * not a generic share blurb.
 *
 * Example output (fr) :
 *   "Bonjour, voici un évènement que je souhaite vous partager : Gala de
 *    bienfaisance, ONU.\n\nhttps://sawnext.ch/share/SAW-AB23-C7DE"
 */
export const buildShareMessage = (opts: BuildMessageOpts): string => {
  const locale = opts.locale ?? 'fr';
  const labels = locale === 'fr' ? TYPE_LABELS_FR : TYPE_LABELS_EN;
  const noun = opts.docType ? labels[opts.docType] : locale === 'fr' ? 'fiche' : 'item';
  // Defensive: tolerate a non-string title (e.g. an unflattened localeString
  // object) instead of throwing on .trim() — the share page must never 500.
  const title = typeof opts.title === 'string' ? opts.title.trim() : undefined;

  if (locale === 'en') {
    const head = title
      ? `Hello, sharing this ${noun} with you: ${title}.`
      : `Hello, sharing this ${noun} with you.`;
    return `${head}\n\n${opts.url}`;
  }

  // FR default
  const head = title
    ? `Bonjour, voici ${noun === 'évènement' || noun === 'actualité' ? 'un' : 'une'} ${noun} que je souhaite vous partager : ${title}.`
    : `Bonjour, voici une fiche que je souhaite vous partager.`;
  return `${head}\n\n${opts.url}`;
};

/** Build a wa.me URL with the message pre-filled. Empty body still valid. */
export const buildWhatsAppUrl = (message: string): string =>
  `https://wa.me/?text=${encodeURIComponent(message)}`;

/** Build a mailto: URL with optional subject + body. */
export const buildMailtoUrl = (opts: { subject?: string; body: string }): string => {
  const params = new URLSearchParams();
  if (opts.subject) params.set('subject', opts.subject);
  params.set('body', opts.body);
  return `mailto:?${params.toString().replace(/\+/g, '%20')}`;
};

/** Build an sms: URL with pre-filled body. Works on iOS and Android. */
export const buildSmsUrl = (message: string): string => `sms:?&body=${encodeURIComponent(message)}`;

/**
 * Copy text to the clipboard, returning a boolean for the caller to toast.
 * Falls back to a hidden textarea + execCommand on browsers without the
 * async clipboard API (rare but worth covering).
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy.
    }
  }
  if (typeof document === 'undefined') return false;
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    document.body.removeChild(ta);
    return false;
  }
};

/**
 * Build a Studio deep-link to the document editor.
 * Example : studioDeeplink('https://sawnext-studio.sanity.studio', 'event', 'evt-01')
 *        → https://sawnext-studio.sanity.studio/structure/collection-event;evt-01
 */
export const buildStudioDeeplink = (
  studioBaseUrl: string,
  docType: string,
  docId: string,
): string => `${studioBaseUrl.replace(/\/$/, '')}/structure/collection-${docType};${docId}`;
