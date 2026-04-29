// ═══════════════════════════════════════════════════
// Articles mock dataset — lot B fake editorial stories
// 6 articles spanning all 6 modules + an editorial piece.
// ═══════════════════════════════════════════════════

import { unsplash } from '@/mocks/unsplash';
import type { Article } from '@/types/article';

const img = (slug: string, alt: string) => ({ src: unsplash(slug), alt });

export const articles: Article[] = [
  {
    id: 'art-news-01',
    slug: 'engadine-domaine-nouvelle-arrivee',
    title: 'Domaine en Engadine — nouvelle arrivée hors-marché',
    excerpt:
      'Ancienne maison d’un industriel zurichois, lac privé, héliport homologué. Disponible avant publication publique.',
    body: 'Notre conciergerie a obtenu en exclusivité, avant tout listing public, une propriété historique en Engadine. Bâtiment principal de 720 m² en pierre et arole, ferme rénovée en maison d’invités, lac privé alimenté par une source naturelle, héliport classe FATO 1 homologué OFAC. Téléphérique privé desservant les pistes de Saint-Moritz. Trois familles ont déjà été contactées en parallèle de cette annonce ; nous gardons cette fiche visible 48 heures avant rotation discrète.',
    kind: 'launch',
    publishedAt: '2026-04-26T08:00:00.000Z',
    readMinutes: 3,
    cover: img('engadine-estate-mountains', 'Domaine en Engadine vu d’altitude'),
    relatedItem: { module: 'property', slug: 'estate-engadine' },
  },
  {
    id: 'art-news-02',
    slug: 'patek-nautilus-5711-olive',
    title: 'Patek Philippe Nautilus 5711/1A — cadran olive, set complet',
    excerpt:
      'Référence iconique discontinuée 2022, plombs intacts, livrée au premier propriétaire genevois. Cession discrète possible.',
    body: 'L’une des dernières Patek Philippe Nautilus 5711/1A-014 cadran olive de notre réseau. Acquise en 2022 chez détaillant officiel par un collectionneur genevois, jamais portée, conditionnement scellé. Mouvement automatique calibre 26-330 S C, lunette horizontale octogonale, bracelet acier intégré. Set complet Patek Philippe : écrin, certificat, garantie internationale tamponnée. Cession privée, sans passage en salle des ventes — la pièce ne sera pas indexée.',
    kind: 'launch',
    publishedAt: '2026-04-22T11:00:00.000Z',
    readMinutes: 2,
    cover: img('patek-philippe-nautilus-green', 'Patek Philippe Nautilus 5711 cadran vert'),
    relatedItem: { module: 'timepiece', slug: 'patek-philippe-5711-1a-jumbo' },
  },
  {
    id: 'art-news-03',
    slug: 'partenariat-belmond-okavango',
    title: 'Partenariat Belmond — Delta de l’Okavango sur 8 jours',
    excerpt:
      'Nouvelle collaboration avec Belmond Safaris : 3 camps consécutifs, ranger francophone privatisé, vol Bombardier Global aller-retour.',
    body: 'Nous avons concrétisé un partenariat exclusif avec Belmond Safaris sur leur réseau au Botswana. Itinéraire 8 jours pour 6 voyageurs maximum reliant Mombo Camp, Vumbura Plains et Chief’s Camp — trois biotopes distincts du Delta. Ranger francophone privatisé sur la durée totale, vol Bombardier Global 6500 Genève → Maun aller-retour, charters Cessna Caravan internes. Disponibilité juin à novembre, calendrier ajustable à la semaine près.',
    kind: 'partnership',
    publishedAt: '2026-04-18T10:00:00.000Z',
    readMinutes: 4,
    cover: img('botswana-okavango-delta', 'Delta de l’Okavango vu du ciel'),
    relatedItem: { module: 'journey', slug: 'safari-okavango-private' },
  },
  {
    id: 'art-news-04',
    slug: 'gala-onu-juin-2026',
    title: 'Gala UNHCR — places attribuées juin 2026',
    excerpt:
      'Salle des Pas-Perdus, ONU Genève. Quatre places réservées à Sawnext, programme musical privé du Quatuor de l’OSR.',
    body: 'Notre allocation pour le Gala de bienfaisance annuel UNHCR à l’ONU Genève vient d’être confirmée — quatre places à table sont réservées à nos membres. Cocktail à 19h30 sous la Salle des Pas-Perdus, dîner à 21h, prestation privée du Quatuor à cordes de l’Orchestre de la Suisse Romande, vente aux enchères silencieuse au profit de l’UNHCR. Cravate noire. Première venue, première servie — manifester votre intérêt avant le 15 mai.',
    kind: 'opening',
    publishedAt: '2026-04-20T09:00:00.000Z',
    readMinutes: 2,
    cover: img('geneva-united-nations-gala', 'Gala ONU Genève'),
    relatedItem: { module: 'event', slug: 'gala-onu-geneve-2026' },
  },
  {
    id: 'art-news-05',
    slug: 'maren-vahl-northern-light',
    title: 'Maren Vahl — Northern Light Series, pièce maîtresse disponible',
    excerpt:
      'Huile monochrome 220 × 180 cm exposée à Astrup Fearnley en 2024. Cession via galerie d’origine.',
    body: 'Maren Vahl, artiste norvégienne basée à Oslo, est représentée pour la première fois dans notre catalogue. Sa pièce maîtresse de la série Northern Light — huile sur lin brut 220 × 180 cm, pigment bleu Aix outremer en couches successives — sort de collection privée norvégienne et redevient disponible. Encadrement chêne fumé sur mesure inclus. La galerie Standard à Oslo gère la transaction ; nous coordonnons la logistique.',
    kind: 'editorial',
    publishedAt: '2026-04-12T11:00:00.000Z',
    readMinutes: 3,
    cover: img('blue-monochrome-painting-large', 'Toile bleue monochrome Maren Vahl'),
    relatedItem: { module: 'artwork', slug: 'maren-vahl-untitled-2023' },
  },
  {
    id: 'art-news-06',
    slug: 'service-aviation-6h',
    title: 'Aviation privée — préavis 6 heures court-courrier',
    excerpt:
      'Notre desk aviation a réduit le préavis standard à 6 heures sur les liaisons court-courrier européennes.',
    body: 'Suite au renforcement de notre réseau de partenaires (240 jets et hélicoptères certifiés en Europe), notre desk aviation peut désormais confirmer un vol court-courrier sous 6 heures de préavis — contre 12 heures précédemment. La capacité long-courrier reste à 12 heures. Ce changement s’applique aux liaisons intra-Schengen et à quelques destinations hors Schengen pré-validées (Royaume-Uni, Suisse, Norvège). Pour les escales techniques sensibles, nous conservons la marge initiale de 12 heures.',
    kind: 'story',
    publishedAt: '2026-04-08T15:00:00.000Z',
    readMinutes: 2,
    cover: img('private-jet-tarmac', 'Jet privé sur tarmac'),
    relatedItem: { module: 'concierge', slug: 'transport-aerien-prive' },
  },
];
