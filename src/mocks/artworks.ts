// ═══════════════════════════════════════════════════
// Artworks mock dataset — lot B fake data
// 7 fine-art pieces. Artists are fictional placeholders to avoid IP issues.
// ═══════════════════════════════════════════════════

import { unsplash } from '@/mocks/unsplash';
import type { Artwork } from '@/types/artwork';

const img = (slug: string, alt: string) => ({ src: unsplash(slug), alt });

export const artworks: Artwork[] = [
  {
    id: 'art-01',
    slug: 'maren-vahl-untitled-2023',
    title: 'Untitled — Northern Light Series',
    artistName: 'Maren Vahl',
    artistBio:
      'Artiste norvégienne basée à Oslo. Travaille depuis 2010 sur les variations de lumière nordique, exposée à la Astrup Fearnley en 2022.',
    year: 2023,
    medium: 'painting-oil',
    dimensions: { heightCm: 220, widthCm: 180 },
    signed: true,
    provenance: [
      'Atelier de l’artiste, Oslo',
      'Galerie Standard, Oslo, 2023',
      'Collection privée norvégienne, 2023-2026',
    ],
    exhibitions: [
      'Astrup Fearnley Museet, Oslo — solo show, 2024',
      'Art Basel Statements, Bâle, 2025',
    ],
    summary:
      'Huile monochrome bleue sur lin brut, 220 × 180 cm, exposée à Astrup Fearnley en 2024.',
    description:
      'Pièce maîtresse de la série Northern Light, peinte au studio d’Oslo en hiver 2023 sous des conditions de lumière naturelle minimale. Pigment bleu Aix outremer sur lin écru non apprêté, technique de couches successives. Encadrement en chêne fumé sur mesure inclus.',
    images: [
      img('blue-monochrome-painting-large', 'Toile bleue monochrome 220 cm'),
      img('contemporary-art-oslo-studio', 'Détail texture huile sur lin'),
      img('art-gallery-installation', 'Installation Astrup Fearnley'),
    ],
    createdAt: '2026-04-12T11:00:00.000Z',
  },
  {
    id: 'art-02',
    slug: 'tomas-roth-bronze-iv',
    title: 'Bronze IV',
    artistName: 'Tomáš Roth',
    artistBio:
      'Sculpteur tchèque, formé aux Beaux-Arts de Prague. Bronze patiné, recherche sur la mémoire des matériaux post-industriels.',
    year: 2022,
    medium: 'sculpture-bronze',
    dimensions: { heightCm: 145, widthCm: 60, depthCm: 60 },
    signed: true,
    edition: '3/5',
    provenance: [
      'Atelier Roth, Prague',
      'Galerie Hunt Kastner, Prague, 2022',
      'Acquéreur initial, collection privée tchèque',
    ],
    exhibitions: ['Národní galerie Praha, 2023', 'Frieze Sculpture, Londres, 2024'],
    summary: 'Bronze patiné 145 cm, édition 3/5, exposé à la Národní galerie en 2023.',
    description:
      'Forme abstraite verticale fondue d’une seule pièce, patine noire ferreuse appliquée au feu. Socle béton brut intégré. Édition limitée à 5 exemplaires plus 2 EA. Certificat d’authenticité signé.',
    images: [
      img('bronze-sculpture-vertical', 'Bronze IV vue principale'),
      img('contemporary-bronze-detail', 'Détail patine ferreuse'),
      img('sculpture-installation-museum', 'Installation Národní galerie'),
    ],
    createdAt: '2026-04-08T10:00:00.000Z',
  },
  {
    id: 'art-03',
    slug: 'aiko-tanaka-photography-tokyo',
    title: 'Tokyo Vacant Lot, 04:17',
    artistName: 'Aiko Tanaka',
    artistBio:
      'Photographe japonaise, basée à Tokyo. Travail nocturne sur l’architecture urbaine vacante. Représentée par Taka Ishii.',
    year: 2024,
    medium: 'photography',
    dimensions: { heightCm: 120, widthCm: 180 },
    signed: true,
    edition: '2/7',
    provenance: ['Studio Tanaka, Tokyo', 'Taka Ishii Gallery, Tokyo, 2024'],
    exhibitions: ['Photo London, 2025', 'Paris Photo, 2024'],
    summary: 'Tirage gélatino-argentique 120 × 180 cm, édition 2/7, exposée à Paris Photo 2024.',
    description:
      'Photographie nocturne argentique, prise d’une parcelle vacante du quartier Setagaya à 4h17 du matin, avril 2024. Tirage main par l’artiste sur papier baryté Ilford, encadrement noir mat sous verre antireflet. Édition limitée à 7 plus 2 EA.',
    images: [
      img('tokyo-night-photography', 'Photographie nocturne Tokyo'),
      img('black-and-white-tokyo', 'Détail tirage argentique'),
    ],
    createdAt: '2026-04-04T14:00:00.000Z',
  },
  {
    id: 'art-04',
    slug: 'lina-soares-painting-lisbon',
    title: 'Estuário',
    artistName: 'Lina Soares',
    artistBio:
      'Peintre portugaise basée à Lisbonne. Composition gestuelle sur grands formats, palette terre/ocre/bleu Atlantique.',
    year: 2023,
    medium: 'painting-acrylic',
    dimensions: { heightCm: 180, widthCm: 240 },
    signed: true,
    provenance: ['Atelier Soares, Lisbonne', 'Galeria Cristina Guerra, Lisbonne'],
    exhibitions: ['Museu Berardo, Lisbonne, 2024'],
    summary: 'Acrylique 180 × 240 cm, palette ocre et bleu Atlantique, exposée au Berardo 2024.',
    description:
      'Composition gestuelle sur lin apprêté, acrylique Sennelier, technique mixte. Référence à l’estuaire du Tage, peinte sur place pendant l’été 2023. Encadrement chêne brut sur mesure inclus.',
    images: [
      img('contemporary-painting-portugal', 'Estuário vue principale'),
      img('large-format-acrylic-painting', 'Détail texture acrylique'),
    ],
    createdAt: '2026-03-29T13:00:00.000Z',
  },
  {
    id: 'art-05',
    slug: 'marcus-keil-marble-sculpture',
    title: 'Carrara V',
    artistName: 'Marcus Keil',
    artistBio:
      'Sculpteur allemand, atelier à Pietrasanta (Toscane). Marbre statuaire travaillé à la main sur procédés traditionnels.',
    year: 2021,
    medium: 'sculpture-marble',
    dimensions: { heightCm: 95, widthCm: 80, depthCm: 60 },
    signed: true,
    provenance: ['Atelier Keil, Pietrasanta', 'Galerie Thaddaeus Ropac, Salzbourg, 2021'],
    exhibitions: ['Galerie Thaddaeus Ropac, Salzbourg, 2021'],
    summary: 'Marbre de Carrare statuario 95 cm, taille à la main, exposé à Salzbourg 2021.',
    description:
      'Bloc de marbre statuario sélectionné personnellement par l’artiste à Carrare en 2020. Taille directe à la main, polissage final à la cire d’abeille. Pièce unique. Socle inox brossé inclus.',
    images: [
      img('carrara-marble-sculpture', 'Sculpture marbre vue principale'),
      img('white-marble-detail', 'Détail polissage'),
    ],
    createdAt: '2026-03-22T09:00:00.000Z',
  },
  {
    id: 'art-06',
    slug: 'helena-ostrowska-watercolor',
    title: 'Six Aquarelles, Mer Baltique',
    artistName: 'Helena Ostrowska',
    artistBio:
      'Artiste polonaise, basée à Sopot. Aquarelle traditionnelle sur thématique maritime baltique.',
    year: 2024,
    medium: 'painting-watercolor',
    dimensions: { heightCm: 60, widthCm: 90 },
    signed: true,
    edition: 'Pièces uniques',
    provenance: ['Atelier Ostrowska, Sopot'],
    exhibitions: ['Galeria Państwowa Sztuki, Sopot, 2024'],
    summary: 'Suite de 6 aquarelles 60 × 90 cm, encadrées sur mesure, vendues comme ensemble.',
    description:
      'Six aquarelles cohérentes peintes au cours de l’hiver 2024 sur les rives baltiques de Sopot. Papier Fabriano 640g, pigments Schmincke. Encadrement chêne clair sous verre Mirogard inclus. Vendues exclusivement comme ensemble.',
    images: [
      img('watercolor-baltic-sea', 'Aquarelle Mer Baltique'),
      img('contemporary-watercolor-set', 'Vue d’ensemble 6 aquarelles'),
    ],
    createdAt: '2026-03-15T11:00:00.000Z',
  },
  {
    id: 'art-07',
    slug: 'arno-leclerc-mixed-media',
    title: 'Palimpseste III',
    artistName: 'Arno Leclerc',
    artistBio:
      'Artiste belge, atelier à Bruxelles. Technique mixte sur médium ancien : papier japonais, gouache, fil, fragment textile XIXe.',
    year: 2023,
    medium: 'mixed-media',
    dimensions: { heightCm: 150, widthCm: 110 },
    signed: true,
    provenance: ['Atelier Leclerc, Bruxelles', 'Galerie Sorry We’re Closed, Bruxelles'],
    exhibitions: ['Wiels, Bruxelles, 2024'],
    summary:
      'Technique mixte 150 × 110 cm sur papier japonais, fragment textile XIXe, exposée au Wiels 2024.',
    description:
      'Œuvre construite par couches : papier japonais Awagami, gouache, broderie noire, fragment textile XIXe siècle prélevé d’un rideau ancien. Cadre pin clair sur mesure inclus.',
    images: [
      img('mixed-media-contemporary-art', 'Palimpseste III'),
      img('contemporary-textile-art', 'Détail fragment textile'),
    ],
    createdAt: '2026-03-08T15:00:00.000Z',
  },
];
