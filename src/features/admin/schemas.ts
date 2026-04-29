// ═══════════════════════════════════════════════════
// admin/schemas — declarative field definitions per catalogue module
//
// WHAT: each AdminModule has a list of fields the admin form renders.
//       Field types map to inputs (text / textarea / number / select /
//       date-time / image-url). The schema also exposes a `toRecord`
//       function that turns form values into the typed domain object
//       expected by adminStore.createItem / updateItem.
// WHEN: read by AdminItemDrawer to build the form, and by AdminCatalogue
//       to render the table columns.
// ═══════════════════════════════════════════════════

import type { AdminModule, AdminModuleMap } from '@/store/adminStore';

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'datetime' | 'image';

export interface FieldDef {
  key: string;
  labelKey: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  step?: number;
}

export interface ModuleSchema {
  /** Raw form values (string-keyed) the drawer state holds. */
  fields: FieldDef[];
  /** Columns shown in the admin table. */
  tableColumns: { key: string; labelKey: string }[];
  /** Build the typed domain object from raw form values + a generated id. */
  toRecord: (values: Record<string, string>, id: string) => unknown;
}

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const num = (v: string | undefined, fallback = 0): number => {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const ensureSlug = (raw: string, title: string): string => (raw.length > 0 ? raw : slugify(title));

const timestamp = (): string => new Date().toISOString();

/* ─── Property ─── */

const propertySchema: ModuleSchema = {
  fields: [
    { key: 'title', labelKey: 'admin.fields.title', type: 'text', required: true },
    { key: 'slug', labelKey: 'admin.fields.slug', type: 'text' },
    {
      key: 'kind',
      labelKey: 'admin.fields.kind',
      type: 'select',
      required: true,
      options: ['chalet', 'villa', 'penthouse', 'estate', 'townhouse'],
    },
    {
      key: 'availability',
      labelKey: 'admin.fields.availability',
      type: 'select',
      required: true,
      options: ['sale', 'rent', 'both'],
    },
    { key: 'region', labelKey: 'admin.fields.region', type: 'text', required: true },
    { key: 'countryCode', labelKey: 'admin.fields.countryCode', type: 'text', required: true },
    { key: 'surfaceSqm', labelKey: 'admin.fields.surfaceSqm', type: 'number', required: true },
    { key: 'bedrooms', labelKey: 'admin.fields.bedrooms', type: 'number', required: true },
    { key: 'bathrooms', labelKey: 'admin.fields.bathrooms', type: 'number', required: true },
    { key: 'summary', labelKey: 'admin.fields.summary', type: 'textarea', required: true },
    { key: 'description', labelKey: 'admin.fields.description', type: 'textarea', required: true },
    { key: 'imageSrc', labelKey: 'admin.fields.imageSrc', type: 'image' },
    { key: 'imageAlt', labelKey: 'admin.fields.imageAlt', type: 'text' },
  ],
  tableColumns: [
    { key: 'title', labelKey: 'admin.fields.title' },
    { key: 'kind', labelKey: 'admin.fields.kind' },
    { key: 'region', labelKey: 'admin.fields.region' },
    { key: 'surfaceSqm', labelKey: 'admin.fields.surfaceSqm' },
  ],
  toRecord: (v, id) => {
    const slug = ensureSlug(v.slug ?? '', v.title ?? '');
    const base: AdminModuleMap['property'] = {
      id,
      slug,
      title: v.title ?? '',
      kind: (v.kind as AdminModuleMap['property']['kind']) || 'villa',
      availability: (v.availability as AdminModuleMap['property']['availability']) || 'sale',
      region: v.region ?? '',
      countryCode: v.countryCode ?? 'CH',
      surfaceSqm: num(v.surfaceSqm),
      bedrooms: num(v.bedrooms),
      bathrooms: num(v.bathrooms),
      summary: v.summary ?? '',
      description: v.description ?? '',
      images: v.imageSrc ? [{ src: v.imageSrc, alt: v.imageAlt || v.title || '' }] : [],
      highlights: [],
      createdAt: timestamp(),
    };
    return base;
  },
};

/* ─── Timepiece ─── */

const timepieceSchema: ModuleSchema = {
  fields: [
    { key: 'brand', labelKey: 'admin.fields.brand', type: 'text', required: true },
    { key: 'model', labelKey: 'admin.fields.model', type: 'text', required: true },
    { key: 'reference', labelKey: 'admin.fields.reference', type: 'text', required: true },
    { key: 'slug', labelKey: 'admin.fields.slug', type: 'text' },
    { key: 'year', labelKey: 'admin.fields.year', type: 'number', required: true },
    {
      key: 'material',
      labelKey: 'admin.fields.material',
      type: 'select',
      required: true,
      options: [
        'steel',
        'gold-yellow',
        'gold-white',
        'gold-rose',
        'platinum',
        'titanium',
        'two-tone',
        'ceramic',
      ],
    },
    {
      key: 'condition',
      labelKey: 'admin.fields.condition',
      type: 'select',
      required: true,
      options: ['mint', 'unworn', 'excellent', 'very-good', 'good', 'restored'],
    },
    { key: 'caliber', labelKey: 'admin.fields.caliber', type: 'text' },
    { key: 'caseDiameterMm', labelKey: 'admin.fields.caseDiameterMm', type: 'number' },
    {
      key: 'fullSet',
      labelKey: 'admin.fields.fullSet',
      type: 'select',
      required: true,
      options: ['true', 'false'],
    },
    { key: 'summary', labelKey: 'admin.fields.summary', type: 'textarea', required: true },
    { key: 'description', labelKey: 'admin.fields.description', type: 'textarea', required: true },
    { key: 'imageSrc', labelKey: 'admin.fields.imageSrc', type: 'image' },
    { key: 'imageAlt', labelKey: 'admin.fields.imageAlt', type: 'text' },
  ],
  tableColumns: [
    { key: 'brand', labelKey: 'admin.fields.brand' },
    { key: 'model', labelKey: 'admin.fields.model' },
    { key: 'reference', labelKey: 'admin.fields.reference' },
    { key: 'year', labelKey: 'admin.fields.year' },
  ],
  toRecord: (v, id) => {
    const slug = ensureSlug(v.slug ?? '', `${v.brand ?? ''} ${v.model ?? ''} ${v.reference ?? ''}`);
    const base: AdminModuleMap['timepiece'] = {
      id,
      slug,
      brand: v.brand ?? '',
      model: v.model ?? '',
      reference: v.reference ?? '',
      year: num(v.year, new Date().getFullYear()),
      material: (v.material as AdminModuleMap['timepiece']['material']) || 'steel',
      condition: (v.condition as AdminModuleMap['timepiece']['condition']) || 'excellent',
      ...(v.caliber ? { caliber: v.caliber } : {}),
      ...(v.caseDiameterMm ? { caseDiameterMm: num(v.caseDiameterMm) } : {}),
      fullSet: v.fullSet === 'true',
      provenance: [],
      summary: v.summary ?? '',
      description: v.description ?? '',
      images: v.imageSrc
        ? [{ src: v.imageSrc, alt: v.imageAlt || `${v.brand ?? ''} ${v.model ?? ''}` }]
        : [],
      createdAt: timestamp(),
    };
    return base;
  },
};

/* ─── Artwork ─── */

const artworkSchema: ModuleSchema = {
  fields: [
    { key: 'title', labelKey: 'admin.fields.title', type: 'text', required: true },
    { key: 'artistName', labelKey: 'admin.fields.artistName', type: 'text', required: true },
    { key: 'slug', labelKey: 'admin.fields.slug', type: 'text' },
    { key: 'year', labelKey: 'admin.fields.year', type: 'number', required: true },
    {
      key: 'medium',
      labelKey: 'admin.fields.medium',
      type: 'select',
      required: true,
      options: [
        'painting-oil',
        'painting-acrylic',
        'painting-watercolor',
        'sculpture-bronze',
        'sculpture-marble',
        'sculpture-mixed',
        'photography',
        'works-on-paper',
        'mixed-media',
      ],
    },
    { key: 'heightCm', labelKey: 'admin.fields.heightCm', type: 'number', required: true },
    { key: 'widthCm', labelKey: 'admin.fields.widthCm', type: 'number', required: true },
    {
      key: 'signed',
      labelKey: 'admin.fields.signed',
      type: 'select',
      required: true,
      options: ['true', 'false'],
    },
    { key: 'artistBio', labelKey: 'admin.fields.artistBio', type: 'textarea', required: true },
    { key: 'summary', labelKey: 'admin.fields.summary', type: 'textarea', required: true },
    { key: 'description', labelKey: 'admin.fields.description', type: 'textarea', required: true },
    { key: 'imageSrc', labelKey: 'admin.fields.imageSrc', type: 'image' },
    { key: 'imageAlt', labelKey: 'admin.fields.imageAlt', type: 'text' },
  ],
  tableColumns: [
    { key: 'title', labelKey: 'admin.fields.title' },
    { key: 'artistName', labelKey: 'admin.fields.artistName' },
    { key: 'medium', labelKey: 'admin.fields.medium' },
    { key: 'year', labelKey: 'admin.fields.year' },
  ],
  toRecord: (v, id) => {
    const slug = ensureSlug(v.slug ?? '', `${v.artistName ?? ''} ${v.title ?? ''}`);
    const base: AdminModuleMap['artwork'] = {
      id,
      slug,
      title: v.title ?? '',
      artistName: v.artistName ?? '',
      artistBio: v.artistBio ?? '',
      year: num(v.year, new Date().getFullYear()),
      medium: (v.medium as AdminModuleMap['artwork']['medium']) || 'painting-oil',
      dimensions: { heightCm: num(v.heightCm), widthCm: num(v.widthCm) },
      signed: v.signed === 'true',
      provenance: [],
      exhibitions: [],
      summary: v.summary ?? '',
      description: v.description ?? '',
      images: v.imageSrc ? [{ src: v.imageSrc, alt: v.imageAlt || v.title || '' }] : [],
      createdAt: timestamp(),
    };
    return base;
  },
};

/* ─── Event ─── */

const eventSchema: ModuleSchema = {
  fields: [
    { key: 'title', labelKey: 'admin.fields.title', type: 'text', required: true },
    { key: 'slug', labelKey: 'admin.fields.slug', type: 'text' },
    {
      key: 'category',
      labelKey: 'admin.fields.category',
      type: 'select',
      required: true,
      options: ['gala', 'opening', 'concert', 'sport', 'private-dinner', 'auction', 'cultural'],
    },
    { key: 'startsAt', labelKey: 'admin.fields.startsAt', type: 'datetime', required: true },
    { key: 'city', labelKey: 'admin.fields.city', type: 'text', required: true },
    { key: 'countryCode', labelKey: 'admin.fields.countryCode', type: 'text', required: true },
    { key: 'venue', labelKey: 'admin.fields.venue', type: 'text', required: true },
    { key: 'capacity', labelKey: 'admin.fields.capacity', type: 'number', required: true },
    {
      key: 'allocatedSeats',
      labelKey: 'admin.fields.allocatedSeats',
      type: 'number',
      required: true,
    },
    {
      key: 'dressCode',
      labelKey: 'admin.fields.dressCode',
      type: 'select',
      required: true,
      options: ['black-tie', 'cocktail', 'business', 'smart-casual', 'tenue-d-hiver', 'open'],
    },
    { key: 'summary', labelKey: 'admin.fields.summary', type: 'textarea', required: true },
    { key: 'description', labelKey: 'admin.fields.description', type: 'textarea', required: true },
    { key: 'imageSrc', labelKey: 'admin.fields.imageSrc', type: 'image' },
    { key: 'imageAlt', labelKey: 'admin.fields.imageAlt', type: 'text' },
  ],
  tableColumns: [
    { key: 'title', labelKey: 'admin.fields.title' },
    { key: 'category', labelKey: 'admin.fields.category' },
    { key: 'city', labelKey: 'admin.fields.city' },
    { key: 'startsAt', labelKey: 'admin.fields.startsAt' },
  ],
  toRecord: (v, id) => {
    const slug = ensureSlug(v.slug ?? '', v.title ?? '');
    const base: AdminModuleMap['event'] = {
      id,
      slug,
      title: v.title ?? '',
      category: (v.category as AdminModuleMap['event']['category']) || 'cultural',
      startsAt: v.startsAt || timestamp(),
      city: v.city ?? '',
      countryCode: v.countryCode ?? 'CH',
      venue: v.venue ?? '',
      capacity: num(v.capacity),
      allocatedSeats: num(v.allocatedSeats),
      dressCode: (v.dressCode as AdminModuleMap['event']['dressCode']) || 'business',
      summary: v.summary ?? '',
      description: v.description ?? '',
      programme: [],
      images: v.imageSrc ? [{ src: v.imageSrc, alt: v.imageAlt || v.title || '' }] : [],
      createdAt: timestamp(),
    };
    return base;
  },
};

/* ─── Journey ─── */

const journeySchema: ModuleSchema = {
  fields: [
    { key: 'title', labelKey: 'admin.fields.title', type: 'text', required: true },
    { key: 'slug', labelKey: 'admin.fields.slug', type: 'text' },
    {
      key: 'kind',
      labelKey: 'admin.fields.kind',
      type: 'select',
      required: true,
      options: ['private-jet', 'yacht', 'expedition', 'safari', 'rail-luxury'],
    },
    { key: 'durationDays', labelKey: 'admin.fields.durationDays', type: 'number', required: true },
    { key: 'origin', labelKey: 'admin.fields.origin', type: 'text', required: true },
    { key: 'destinations', labelKey: 'admin.fields.destinations', type: 'text', required: true },
    {
      key: 'guestCapacity',
      labelKey: 'admin.fields.guestCapacity',
      type: 'number',
      required: true,
    },
    { key: 'summary', labelKey: 'admin.fields.summary', type: 'textarea', required: true },
    { key: 'description', labelKey: 'admin.fields.description', type: 'textarea', required: true },
    { key: 'imageSrc', labelKey: 'admin.fields.imageSrc', type: 'image' },
    { key: 'imageAlt', labelKey: 'admin.fields.imageAlt', type: 'text' },
  ],
  tableColumns: [
    { key: 'title', labelKey: 'admin.fields.title' },
    { key: 'kind', labelKey: 'admin.fields.kind' },
    { key: 'durationDays', labelKey: 'admin.fields.durationDays' },
    { key: 'destinations', labelKey: 'admin.fields.destinations' },
  ],
  toRecord: (v, id) => {
    const slug = ensureSlug(v.slug ?? '', v.title ?? '');
    const base: AdminModuleMap['journey'] = {
      id,
      slug,
      title: v.title ?? '',
      kind: (v.kind as AdminModuleMap['journey']['kind']) || 'private-jet',
      durationDays: num(v.durationDays, 1),
      origin: v.origin ?? '',
      destinations: v.destinations ?? '',
      guestCapacity: num(v.guestCapacity, 2),
      inclusions: [],
      exclusions: [],
      legs: [],
      summary: v.summary ?? '',
      description: v.description ?? '',
      images: v.imageSrc ? [{ src: v.imageSrc, alt: v.imageAlt || v.title || '' }] : [],
      createdAt: timestamp(),
    };
    return base;
  },
};

/* ─── Concierge service ─── */

const conciergeSchema: ModuleSchema = {
  fields: [
    { key: 'title', labelKey: 'admin.fields.title', type: 'text', required: true },
    { key: 'slug', labelKey: 'admin.fields.slug', type: 'text' },
    {
      key: 'category',
      labelKey: 'admin.fields.category',
      type: 'select',
      required: true,
      options: [
        'transport',
        'gastronomy',
        'security',
        'medical',
        'cultural',
        'wellness',
        'family',
        'logistics',
      ],
    },
    { key: 'leadTime', labelKey: 'admin.fields.leadTime', type: 'text', required: true },
    { key: 'summary', labelKey: 'admin.fields.summary', type: 'textarea', required: true },
    { key: 'description', labelKey: 'admin.fields.description', type: 'textarea', required: true },
    { key: 'imageSrc', labelKey: 'admin.fields.imageSrc', type: 'image' },
    { key: 'imageAlt', labelKey: 'admin.fields.imageAlt', type: 'text' },
  ],
  tableColumns: [
    { key: 'title', labelKey: 'admin.fields.title' },
    { key: 'category', labelKey: 'admin.fields.category' },
    { key: 'leadTime', labelKey: 'admin.fields.leadTime' },
  ],
  toRecord: (v, id) => {
    const slug = ensureSlug(v.slug ?? '', v.title ?? '');
    const base: AdminModuleMap['concierge'] = {
      id,
      slug,
      title: v.title ?? '',
      category: (v.category as AdminModuleMap['concierge']['category']) || 'logistics',
      summary: v.summary ?? '',
      description: v.description ?? '',
      caseStudies: [],
      leadTime: v.leadTime ?? '',
      images: v.imageSrc ? [{ src: v.imageSrc, alt: v.imageAlt || v.title || '' }] : [],
      createdAt: timestamp(),
    };
    return base;
  },
};

/* ─── Article ─── */

const articleSchema: ModuleSchema = {
  fields: [
    { key: 'title', labelKey: 'admin.fields.title', type: 'text', required: true },
    { key: 'slug', labelKey: 'admin.fields.slug', type: 'text' },
    {
      key: 'kind',
      labelKey: 'admin.fields.kind',
      type: 'select',
      required: true,
      options: ['launch', 'opening', 'partnership', 'editorial', 'story'],
    },
    { key: 'publishedAt', labelKey: 'admin.fields.publishedAt', type: 'datetime', required: true },
    { key: 'readMinutes', labelKey: 'admin.fields.readMinutes', type: 'number', required: true },
    { key: 'excerpt', labelKey: 'admin.fields.excerpt', type: 'textarea', required: true },
    { key: 'body', labelKey: 'admin.fields.body', type: 'textarea', required: true },
    { key: 'imageSrc', labelKey: 'admin.fields.imageSrc', type: 'image', required: true },
    { key: 'imageAlt', labelKey: 'admin.fields.imageAlt', type: 'text' },
  ],
  tableColumns: [
    { key: 'title', labelKey: 'admin.fields.title' },
    { key: 'kind', labelKey: 'admin.fields.kind' },
    { key: 'publishedAt', labelKey: 'admin.fields.publishedAt' },
  ],
  toRecord: (v, id) => {
    const slug = ensureSlug(v.slug ?? '', v.title ?? '');
    const base: AdminModuleMap['article'] = {
      id,
      slug,
      title: v.title ?? '',
      excerpt: v.excerpt ?? '',
      body: v.body ?? '',
      kind: (v.kind as AdminModuleMap['article']['kind']) || 'editorial',
      publishedAt: v.publishedAt || timestamp(),
      readMinutes: num(v.readMinutes, 3),
      cover: { src: v.imageSrc ?? '', alt: v.imageAlt || v.title || '' },
    };
    return base;
  },
};

export const SCHEMAS: Record<AdminModule, ModuleSchema> = {
  property: propertySchema,
  timepiece: timepieceSchema,
  artwork: artworkSchema,
  event: eventSchema,
  journey: journeySchema,
  concierge: conciergeSchema,
  article: articleSchema,
};
