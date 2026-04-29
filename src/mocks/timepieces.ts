// ═══════════════════════════════════════════════════
// Timepieces mock dataset — lot B fake data
// 8 horology pieces, fact-driven, no marketing prose.
// ═══════════════════════════════════════════════════

import { unsplash } from '@/mocks/unsplash';
import type { Timepiece } from '@/types/timepiece';

const img = (slug: string, alt: string) => ({ src: unsplash(slug), alt });

export const timepieces: Timepiece[] = [
  {
    id: 'tp-01',
    slug: 'patek-philippe-5711-1a-jumbo',
    brand: 'Patek Philippe',
    model: 'Nautilus',
    reference: '5711/1A-014',
    year: 2022,
    caliber: '26-330 S C',
    caseDiameterMm: 40,
    material: 'steel',
    condition: 'unworn',
    fullSet: true,
    provenance: [
      'Premier propriétaire — Genève, 2022',
      'Acquis chez détaillant officiel Patek Philippe',
      'Set complet, plombs intacts',
    ],
    summary: 'Référence iconique discontinuée, cadran olive vert horizontal, set complet 2022.',
    description:
      'Patek Philippe Nautilus 5711/1A-014, version cadran olive lancée en 2021 et discontinuée en 2022. Boîtier 40 mm en acier brossé/poli, mouvement automatique 26-330 S C. Réserve de marche 45 heures. Lunette horizontale octogonale, bracelet acier intégré. Pièce unworn, livrée avec écrin, certificat, set d’origine.',
    images: [
      img('patek-philippe-nautilus-green', 'Patek Philippe Nautilus 5711 cadran vert'),
      img('luxury-watch-dial-macro', 'Macro cadran olive horizontal'),
      img('watch-movement-caliber', 'Mouvement automatique 26-330 S C'),
      img('watch-bracelet-steel', 'Bracelet acier intégré'),
    ],
    createdAt: '2026-04-22T09:00:00.000Z',
  },
  {
    id: 'tp-02',
    slug: 'rolex-daytona-116500ln-white',
    brand: 'Rolex',
    model: 'Cosmograph Daytona',
    reference: '116500LN',
    year: 2018,
    caliber: '4130',
    caseDiameterMm: 40,
    material: 'steel',
    condition: 'excellent',
    fullSet: true,
    provenance: [
      'Premier propriétaire — Zurich, 2018',
      'Acquis chez Rolex Boutique Bahnhofstrasse',
      'Révision complète Rolex Genève, 2024',
    ],
    summary: 'Daytona céramique, cadran panda blanc, full set 2018, révision Rolex 2024.',
    description:
      'Rolex Cosmograph Daytona ref. 116500LN, cadran blanc, lunette céramique noire Cerachrom. Mouvement chronographe automatique calibre 4130. Bracelet Oyster acier 904L. Conditionnement complet d’origine, papiers, écrin, garantie internationale tamponnée.',
    images: [
      img('rolex-daytona-panda-white', 'Rolex Daytona cadran panda blanc'),
      img('rolex-watch-bezel-ceramic', 'Lunette céramique Cerachrom'),
      img('rolex-bracelet-oyster', 'Bracelet Oyster 904L'),
    ],
    createdAt: '2026-04-18T10:30:00.000Z',
  },
  {
    id: 'tp-03',
    slug: 'audemars-piguet-royal-oak-15202st',
    brand: 'Audemars Piguet',
    model: 'Royal Oak Jumbo Extra-Thin',
    reference: '15202ST.OO.1240ST.01',
    year: 2021,
    caliber: '2121',
    caseDiameterMm: 39,
    material: 'steel',
    condition: 'mint',
    fullSet: true,
    provenance: [
      'Premier propriétaire — Le Brassus, 2021',
      'Acquis chez Manufacture Audemars Piguet',
      'Visite technique annuelle 2024',
    ],
    summary:
      'Royal Oak Jumbo 39 mm acier, cadran Petite Tapisserie bleu, ultra-plate calibre 2121.',
    description:
      'Référence collector, ultime version 39 mm avant remplacement par 16202. Boîtier acier brossé/poli, lunette octogonale 8 vis, mouvement extra-plat 2121 (3,05 mm). Cadran Petite Tapisserie bleu, index appliqués or blanc.',
    images: [
      img('royal-oak-blue-tapisserie', 'Cadran Petite Tapisserie bleu'),
      img('audemars-piguet-jumbo-case', 'Boîtier 39 mm acier brossé'),
      img('royal-oak-bracelet-integrated', 'Bracelet intégré acier'),
      img('mechanical-watch-movement', 'Mouvement extra-plat calibre 2121'),
    ],
    createdAt: '2026-04-15T14:00:00.000Z',
  },
  {
    id: 'tp-04',
    slug: 'a-lange-sohne-lange-1-platinum',
    brand: 'A. Lange & Söhne',
    model: 'Lange 1',
    reference: '101.025',
    year: 2019,
    caliber: 'L121.1',
    caseDiameterMm: 38.5,
    material: 'platinum',
    condition: 'mint',
    fullSet: true,
    provenance: [
      'Premier propriétaire — Munich, 2019',
      'Acquis chez Concession A. Lange & Söhne Munich',
      'Set complet ; révision Glashütte 2025',
    ],
    summary: 'Lange 1 platine 38,5 mm, cadran argenté, grande date emblématique.',
    description:
      'A. Lange & Söhne Lange 1 en platine, mouvement manufacture L121.1 à remontage manuel, réserve de marche 72 heures. Cadran argenté, sous-cadrans excentrés, indicateur de réserve, grande date signature de la maison. Bracelet alligator noir avec boucle déployante platine.',
    images: [
      img('a-lange-sohne-lange-1-silver', 'Lange 1 cadran argenté'),
      img('platinum-watch-movement', 'Mouvement L121.1 visible'),
      img('luxury-german-watch', 'Boîtier platine 38,5 mm'),
    ],
    createdAt: '2026-04-10T11:00:00.000Z',
  },
  {
    id: 'tp-05',
    slug: 'vacheron-overseas-4500v-blue',
    brand: 'Vacheron Constantin',
    model: 'Overseas',
    reference: '4500V/110A-B128',
    year: 2020,
    caliber: '5100',
    caseDiameterMm: 41,
    material: 'steel',
    condition: 'excellent',
    fullSet: true,
    provenance: [
      'Premier propriétaire — Paris, 2020',
      'Acquis chez Boutique Vacheron Place Vendôme',
      '3 bracelets interchangeables (acier, cuir, caoutchouc)',
    ],
    summary: 'Overseas 41 mm acier, cadran bleu translucide, 3 bracelets interchangeables.',
    description:
      'Mouvement automatique calibre 5100, certifié Poinçon de Genève. Lunette boîtier hexagonale signature de la collection. Système de changement de bracelet sans outil. Cadran bleu velouté, index facettés rhodiés.',
    images: [
      img('vacheron-overseas-blue-dial', 'Overseas cadran bleu'),
      img('luxury-watch-blue-dial-macro', 'Macro cadran translucide'),
      img('vacheron-bracelet-system', 'Système 3 bracelets'),
    ],
    createdAt: '2026-04-05T09:00:00.000Z',
  },
  {
    id: 'tp-06',
    slug: 'rolex-gmt-master-ii-pepsi-126710',
    brand: 'Rolex',
    model: 'GMT-Master II',
    reference: '126710BLRO',
    year: 2023,
    caliber: '3285',
    caseDiameterMm: 40,
    material: 'steel',
    condition: 'unworn',
    fullSet: true,
    provenance: [
      'Premier propriétaire — Genève, 2023',
      'Acquis chez Rolex Bucherer',
      'Plombs intacts, conditionnement scellé',
    ],
    summary: 'GMT-Master II Pepsi céramique, bracelet Jubilé, unworn 2023.',
    description:
      'Lunette céramique bidirectionnelle bleu/rouge Cerachrom. Calibre 3285 nouvelle génération, réserve 70h. Bracelet Jubilé 5 maillons en acier 904L. Pièce unworn, jamais portée, conditionnement scellé.',
    images: [
      img('rolex-gmt-pepsi-jubilee', 'GMT-Master II lunette Pepsi'),
      img('rolex-cerachrom-bezel', 'Lunette céramique Cerachrom'),
    ],
    createdAt: '2026-04-01T15:00:00.000Z',
  },
  {
    id: 'tp-07',
    slug: 'fp-journe-chronometre-souverain',
    brand: 'F.P. Journe',
    model: 'Chronomètre Souverain',
    reference: 'CS R 38 PT',
    year: 2017,
    caliber: '1304',
    caseDiameterMm: 38,
    material: 'platinum',
    condition: 'excellent',
    fullSet: true,
    provenance: [
      'Premier propriétaire — Hong Kong, 2017',
      'Acquis chez Boutique F.P. Journe Hong Kong',
      'Révision Genève 2023, certifiée par F.P. Journe',
    ],
    summary: 'Chronomètre Souverain 38 mm platine, cadran or rose, mouvement or rose 18 ct.',
    description:
      'Mouvement à remontage manuel calibre 1304, ponts et platine en or rose 18 ct. Cadran or rose massif, index rhodiés. Réserve de marche affichée à 12h, petite seconde à 6h. Pièce de pure horlogerie indépendante.',
    images: [
      img('fp-journe-chronometre-souverain', 'Chronomètre Souverain cadran or rose'),
      img('fp-journe-movement-rose-gold', 'Mouvement 1304 en or rose'),
    ],
    createdAt: '2026-03-25T10:00:00.000Z',
  },
  {
    id: 'tp-08',
    slug: 'cartier-tank-cintree-platinum',
    brand: 'Cartier',
    model: 'Tank Cintrée Edition Limitée',
    reference: 'WGTA0118',
    year: 2024,
    caliber: '1917 MC',
    caseDiameterMm: 23,
    material: 'platinum',
    condition: 'mint',
    fullSet: true,
    provenance: [
      'Premier propriétaire — Paris, 2024',
      'Acquis chez Boutique Cartier Rue de la Paix',
      '150 exemplaires, numéro 037/150',
    ],
    summary: 'Tank Cintrée platine, cadran argenté guilloché, édition limitée 150 ex., numéro 037.',
    description:
      'Réinterprétation de la Tank Cintrée 1921. Boîtier platine 23 × 46 mm, cadran argenté guilloché, chiffres romains noirs. Mouvement squeletté manuel calibre 1917 MC. Bracelet alligator gris boucle platine.',
    images: [
      img('cartier-tank-cintree-platinum', 'Tank Cintrée platine'),
      img('cartier-skeleton-movement', 'Mouvement 1917 MC squeletté'),
    ],
    createdAt: '2026-03-18T13:00:00.000Z',
  },
];
