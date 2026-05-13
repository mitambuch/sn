// ═══════════════════════════════════════════════════
// schemas — Studio types index
//
// Structure:
// - _helpers/  reusable field configs (visibility, icons)
// - objects/   reusable types (locale*, domainImage, priceBlock, programmeStep)
// - documents/ editable entities shown in the deskStructure
//
// Adding a type: import it here + append to schemaTypes + add a listItem
// in studio/structure/deskStructure.ts (if dedicated menu desired).
// ═══════════════════════════════════════════════════

import { article } from './documents/article';
import { artwork } from './documents/artwork';
import { conciergeService } from './documents/conciergeService';
import { event } from './documents/event';
import { journey } from './documents/journey';
import { page } from './documents/page';
import { property } from './documents/property';
import { siteConfig } from './documents/siteConfig';
import { teamMember } from './documents/teamMember';
import { timepiece } from './documents/timepiece';
import { domainImage } from './objects/domainImage';
import { localeRichText } from './objects/localeRichText';
import { localeString } from './objects/localeString';
import { localeText } from './objects/localeText';
import { priceBlock } from './objects/priceBlock';
import { programmeStep } from './objects/programmeStep';

export const schemaTypes = [
  // ─── Reusable objects ───
  localeString,
  localeText,
  localeRichText,
  domainImage,
  priceBlock,
  programmeStep,
  // ─── Singletons ───
  siteConfig,
  page,
  // ─── Domain documents ───
  event,
  property,
  timepiece,
  artwork,
  journey,
  conciergeService,
  article,
  teamMember,
];
