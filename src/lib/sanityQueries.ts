// ═══════════════════════════════════════════════════
// sanityQueries — GROQ queries for the 7 domain listings + detail
//
// WHAT: One query string per domain that returns the SAME shape as the
//       corresponding mock dataset, so the existing pages can fallback
//       cleanly when Sanity is empty / unavailable. Each list query
//       returns only `visibility != "private"` items (i.e. public +
//       shareCode visible to anon ; private docs only render in
//       authenticated/admin contexts which use a different query).
//
//       The transform functions in `sanityTransform.ts` adapt each
//       Sanity doc to the internal TypeScript type.
// WHEN: useSanityCollection() + useSanityItem() consume these. Both
//       hooks inject a `$locale` param ('fr' | 'en' | 'es') read from the
//       active LocaleProvider, so every localised projection below
//       resolves to the visitor's language with a FR fallback.
// i18n: editorial fields are localeString/localeText/localeRichText in
//       Sanity. We flatten them HERE (not in React) via the L/LPT/LARR
//       helpers — the returned shape stays mono-string, so pages, types
//       and mocks are untouched. Fixes the FR-only detail-page bug
//       (friction 2026-05-29-bilingual-detail-gap).
// ═══════════════════════════════════════════════════

/**
 * Visibility filter for public listings. Returns docs the recipient
 * is allowed to discover via standard browsing (excludes 'private'
 * which is auth-walled separately).
 */
const PUBLIC_VISIBILITY = `visibility in ["public", "shareCode"]`;

// ─── Localised projection helpers ─────────────────────────────────
// `$locale` is supplied by the consuming hook. `select` + `coalesce`
// are core GROQ (no reliance on dynamic-key access). FR is the final
// fallback so a half-translated doc never renders blank.

/** Localised scalar (localeString / localeText) → active-locale string. */
const L = (field: string) =>
  `select($locale == "en" => coalesce(${field}.en, ${field}.fr), $locale == "es" => coalesce(${field}.es, ${field}.fr), ${field}.fr)`;

/** Localised portable text → plain string in the active locale. */
const LPT = (field: string) =>
  `pt::text(select($locale == "en" => coalesce(${field}.en, ${field}.fr), $locale == "es" => coalesce(${field}.es, ${field}.fr), ${field}.fr))`;

/** Localised array-of-localeString → array of active-locale strings. */
const LARR = (field: string) =>
  `${field}[]select($locale == "en" => coalesce(@.en, @.fr), $locale == "es" => coalesce(@.es, @.fr), @.fr)`;

/** Localised `label` inside an array element (element has a `label` localeString). */
const L_LABEL = `select($locale == "en" => coalesce(label.en, label.fr), $locale == "es" => coalesce(label.es, label.fr), label.fr)`;

/** Localised value when the array element *is itself* the localeString. */
const L_SELF = `select($locale == "en" => coalesce(en, fr), $locale == "es" => coalesce(es, fr), fr)`;

// ─── Events ───────────────────────────────────────────────────────
export const GROQ_EVENTS_LIST = `*[_type == "event" && ${PUBLIC_VISIBILITY}] | order(startsAt asc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  category,
  dateMode,
  startsAt,
  endsAt,
  "dateLabel": ${L('dateLabel')},
  city,
  countryCode,
  venue,
  capacity,
  allocatedSeats,
  dressCode,
  "summary": ${L('summary')},
  "description": ${LPT('description')},
  programme[]{ time, "label": ${L_LABEL}, "description": ${L('description')} },
  "images": coalesce(images[]{ "src": asset->url, "alt": alt }, [])
}`;

export const GROQ_EVENT_DETAIL = (slug: string) =>
  `*[_type == "event" && slug.current == "${slug}"][0]{
    "id": _id,
    "slug": slug.current,
    "title": ${L('title')},
    category,
    dateMode,
    startsAt,
    endsAt,
    "dateLabel": ${L('dateLabel')},
    city,
    countryCode,
    venue,
    capacity,
    allocatedSeats,
    dressCode,
    "summary": ${L('summary')},
    "description": ${LPT('description')},
    programme[]{ time, "label": ${L_LABEL}, "description": ${L('description')} },
    "images": coalesce(images[]{ "src": asset->url, "alt": alt }, [])
  }`;

// ─── Properties ───────────────────────────────────────────────────
export const GROQ_PROPERTIES_LIST = `*[_type == "property" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  kind,
  transactionType,
  "summary": ${L('summary')},
  city,
  region,
  countryCode,
  bedrooms,
  bathrooms,
  "surfaceSqm": livingArea,
  "plotSqm": landArea,
  amenities[]{ "label": ${L_SELF} },
  price,
  availability,
  "images": coalesce(images[]{ "src": asset->url, "alt": alt }, [])
}`;

// ─── Timepieces ───────────────────────────────────────────────────
export const GROQ_TIMEPIECES_LIST = `*[_type == "timepiece" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  brand,
  "model": ${L('title')},
  reference,
  "caseDiameterMm": caseDiameter,
  "material": ${L('caseMaterial')},
  "caliber": movement,
  "year": productionYear,
  condition,
  papers,
  "summary": ${L('summary')},
  price,
  "images": coalesce(images[]{ "src": asset->url, "alt": alt }, [])
}`;

// ─── Artworks ─────────────────────────────────────────────────────
export const GROQ_ARTWORKS_LIST = `*[_type == "artwork" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  artistName,
  year,
  medium,
  "technique": ${L('technique')},
  dimensions,
  edition,
  certificate,
  "summary": ${L('summary')},
  price,
  "images": coalesce(images[]{ "src": asset->url, "alt": alt }, [])
}`;

// ─── Journeys ─────────────────────────────────────────────────────
export const GROQ_JOURNEYS_LIST = `*[_type == "journey" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  "destinations": ${LARR('destinations')},
  duration,
  durationDays,
  partySize,
  "summary": ${L('summary')},
  itinerary[]{ "label": ${L_LABEL}, "description": ${L('description')} },
  "transport": ${LARR('transport')},
  "accommodation": ${LARR('accommodation')},
  price,
  "images": coalesce(images[]{ "src": asset->url, "alt": alt }, [])
}`;

// ─── Concierge services ──────────────────────────────────────────
export const GROQ_CONCIERGE_LIST = `*[_type == "conciergeService" && ${PUBLIC_VISIBILITY}] | order(_createdAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  category,
  "summary": ${L('summary')},
  "leadTime": ${L('leadTime')},
  "coverageArea": ${L('coverageArea')},
  "capabilities": ${LARR('capabilities')},
  price,
  "images": coalesce(images[]{ "src": asset->url, "alt": alt }, [])
}`;

// ─── Articles / News ──────────────────────────────────────────────
export const GROQ_ARTICLES_LIST = `*[_type == "article" && ${PUBLIC_VISIBILITY}] | order(publishedAt desc){
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  category,
  "kind": category,
  publishedAt,
  "readMinutes": readTimeMinutes,
  "summary": ${L('summary')},
  "excerpt": ${L('summary')},
  "cover": { "src": heroImage.asset->url, "alt": heroImage.alt },
  "author": author->{ firstName, lastName, "photoUrl": photo.asset->url }
}`;

// ─── Team members ─────────────────────────────────────────────────
// NOTE: not localised here — useTeamMembers fetches with its own query
// and does not pass $locale. Left FR until team bilingual is in scope.
// Canonical team query — matches useTeamMembers' TeamMemberRaw shape (tag +
// bio kept as {fr,en} objects, resolved in React). Shared with the gate so
// the server returns the exact shape the hook maps.
export const GROQ_TEAM = `*[_type == "teamMember"] | order(order asc) {
  _id, firstName, lastName, slug, isFocal, order, tag, bio,
  phone, email, whatsapp, linkedin
}`;

// ─── Domain detail queries by slug ────────────────────────────────
const detailFields = `
  "id": _id,
  "slug": slug.current,
  "title": ${L('title')},
  "summary": ${L('summary')},
  "description": ${LPT('description')},
  "images": coalesce(images[]{ "src": asset->url, "alt": alt }, [])
`;

export const GROQ_PROPERTY_DETAIL = (slug: string) =>
  `*[_type == "property" && slug.current == "${slug}"][0]{
    ${detailFields},
    kind,
    transactionType,
    city,
    region,
    countryCode,
    bedrooms,
    bathrooms,
    "surfaceSqm": livingArea,
    "plotSqm": landArea,
    amenities[]{ "label": ${L_SELF} },
    price,
    "availability": ${L('availability')}
  }`;

export const GROQ_TIMEPIECE_DETAIL = (slug: string) =>
  `*[_type == "timepiece" && slug.current == "${slug}"][0]{
    ${detailFields},
    brand,
    "model": ${L('title')},
    reference,
    "caseDiameterMm": caseDiameter,
    "material": ${L('caseMaterial')},
    "caliber": movement,
    "year": productionYear,
    condition,
    papers,
    "provenanceNote": ${L('provenanceNote')},
    price
  }`;

export const GROQ_ARTWORK_DETAIL = (slug: string) =>
  `*[_type == "artwork" && slug.current == "${slug}"][0]{
    ${detailFields},
    artistName,
    year,
    medium,
    "technique": ${L('technique')},
    dimensions,
    edition,
    certificate,
    catalogueRaisonne,
    "provenanceNote": ${L('provenanceNote')},
    price
  }`;

export const GROQ_JOURNEY_DETAIL = (slug: string) =>
  `*[_type == "journey" && slug.current == "${slug}"][0]{
    ${detailFields},
    "destinations": ${LARR('destinations')},
    duration,
    durationDays,
    partySize,
    itinerary[]{ "label": ${L_LABEL}, "description": ${L('description')} },
    "transport": ${LARR('transport')},
    "accommodation": ${LARR('accommodation')},
    price
  }`;

export const GROQ_CONCIERGE_DETAIL = (slug: string) =>
  `*[_type == "conciergeService" && slug.current == "${slug}"][0]{
    ${detailFields},
    category,
    "leadTime": ${L('leadTime')},
    "coverageArea": ${L('coverageArea')},
    "capabilities": ${LARR('capabilities')},
    price
  }`;

export const GROQ_ARTICLE_DETAIL = (slug: string) =>
  `*[_type == "article" && slug.current == "${slug}"][0]{
    "id": _id,
    "slug": slug.current,
    "title": ${L('title')},
    category,
    "kind": category,
    publishedAt,
    "readMinutes": readTimeMinutes,
    "summary": ${L('summary')},
    "excerpt": ${L('summary')},
    "body": ${LPT('body')},
    "heroImage": { "src": heroImage.asset->url, "alt": heroImage.alt },
    "cover": { "src": heroImage.asset->url, "alt": heroImage.alt },
    "gallery": coalesce(gallery[]{ "src": asset->url, "alt": alt }, []),
    "author": author->{ firstName, lastName, "photoUrl": photo.asset->url }
  }`;

// ─── Share fiche by type + id (for /share/:code render) ──────────
export const GROQ_SHARED_FICHE = (type: string, id: string) =>
  `*[_type == "${type}" && _id == "${id}"][0]{
    _type,
    _id,
    "slug": slug.current,
    "title": ${L('title')},
    "summary": ${L('summary')},
    "description": pt::text(select(
      $locale == "en" => coalesce(description.en, body.en, bio.en, description.fr, body.fr, bio.fr),
      $locale == "es" => coalesce(description.es, body.es, bio.es, description.fr, body.fr, bio.fr),
      coalesce(description.fr, body.fr, bio.fr)
    )),
    "images": coalesce(images[]{ "src": asset->url, "alt": alt }, []),
    "heroImage": { "src": heroImage.asset->url, "alt": heroImage.alt },
    // Event specsheet + programme (null on other types) so the public
    // share page renders the full fiche from Sanity, not just the generics.
    dateMode,
    startsAt,
    "dateLabel": ${L('dateLabel')},
    venue,
    city,
    countryCode,
    capacity,
    allocatedSeats,
    dressCode,
    programme[]{ time, "label": ${L_LABEL}, "description": ${L('description')} },
    ...
  }`;

/** Compact projection for a SET of fiches by _id — used by the multi-doc
 *  share page (one code → several fiches) to render a collection of cards. */
export const GROQ_SHARED_FICHES = (ids: readonly string[]) => {
  const idList = ids.map(id => `"${id}"`).join(', ');
  return `*[_id in [${idList}]]{
    _type,
    _id,
    "slug": slug.current,
    "title": ${L('title')},
    "summary": ${L('summary')},
    "image": images[0].asset->url
  }`;
};

// ─── Public singletons (marketing — no audience gate) ─────────────
// Centralised here (single source of truth) so both the React hooks and
// the server gate (netlify/functions/catalogue) run the exact same GROQ.

export const GROQ_LANDING = `*[_id == "landing-singleton"][0]{
  _id, _updatedAt,
  terminalStatus, terminalTz,
  ctaRequestAccess, ctaPrivateArea, ctaCallDirect,
  heroMetaStructure,
  heroMetaType, heroMetaTypeValue,
  heroMetaStatus, heroMetaStatusValue,
  heroMetaModel, heroMetaModelValue,
  heroMetaEstablished, heroMetaEstablishedValue,
  heroFieldLabel, heroFieldText,
  heroGpsLabel, heroGpsValue,
  presentationEyebrow, presentationHeadline, presentationLede,
  principlesEyebrow, principlesHeadline,
  principles[]{ _key, title, body },
  domainsEyebrow, domainsHeadline, domainsLede,
  domainTiles[]{ _key, key, title, lead },
  accessEyebrow, accessTitleA, accessTitleB, accessLede,
  accessEventsEyebrow, accessLockedEyebrow,
  interlocutorEyebrow, interlocutorHeadlineA, interlocutorHeadlineB,
  interlocutorCircleTag, interlocutorRole,
  footerNote, footerLocation, footerEdition
}`;

export const GROQ_SITE_CONFIG = `*[_id == "siteConfig-singleton"][0]{
  _id, _updatedAt,
  siteName, tagline, logo,
  primaryNav, footerTagline, copyright,
  contactEmail, contactPhone, contactAddress, socials,
  seoTitle, seoDescription, ogImage
}`;

/** Admin monitoring list — every catalogue doc, raw (no $locale flatten;
 *  the admin UI picks fr/en itself). Shared with the server gate. */
export const GROQ_ADMIN_CATALOGUE = `*[_type in ["event", "property", "timepiece", "artwork", "journey", "conciergeService", "article"]] | order(_updatedAt desc){
  _id, _type, _updatedAt,
  slug,
  title,
  visibility,
  "thumb": images[0].asset->url
}`;

// ─── Catalogue module registry ────────────────────────────────────
// Maps a catalogue module to its list query, detail-by-slug builder, and
// Sanity _type. The server gate uses this to run the SAME queries the
// client would, then post-filters list/detail results by audience.

export type CatalogueModuleKey =
  | 'event'
  | 'property'
  | 'timepiece'
  | 'artwork'
  | 'journey'
  | 'conciergeService'
  | 'article';

export interface ModuleQuerySet {
  type: CatalogueModuleKey;
  list: string;
  detail: (slug: string) => string;
}

export const CATALOGUE_MODULE_QUERIES: Record<CatalogueModuleKey, ModuleQuerySet> = {
  event: { type: 'event', list: GROQ_EVENTS_LIST, detail: GROQ_EVENT_DETAIL },
  property: { type: 'property', list: GROQ_PROPERTIES_LIST, detail: GROQ_PROPERTY_DETAIL },
  timepiece: { type: 'timepiece', list: GROQ_TIMEPIECES_LIST, detail: GROQ_TIMEPIECE_DETAIL },
  artwork: { type: 'artwork', list: GROQ_ARTWORKS_LIST, detail: GROQ_ARTWORK_DETAIL },
  journey: { type: 'journey', list: GROQ_JOURNEYS_LIST, detail: GROQ_JOURNEY_DETAIL },
  conciergeService: {
    type: 'conciergeService',
    list: GROQ_CONCIERGE_LIST,
    detail: GROQ_CONCIERGE_DETAIL,
  },
  article: { type: 'article', list: GROQ_ARTICLES_LIST, detail: GROQ_ARTICLE_DETAIL },
};
