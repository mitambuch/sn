// ═══════════════════════════════════════════════════
// ArticleCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface, 4:3 cover image, frosted-glass date badge
//       top-left (day · month — same canonical pattern as Event), kind
//       eyebrow, large light-weight title, excerpt as expanded meta,
//       read-time hint with Clock icon in footer. No HeartButton — articles
//       are editorial, not "save" semantics.
// WHEN: NewsList grid item, account "your reading" widgets.
// EDIT VISUAL: change radius/shadow in src/index.css tokens.
// ═══════════════════════════════════════════════════

import { Card } from '@components/ui/Card';
import { Clock } from 'lucide-react';

import type { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
  href: string;
  kindLabel: string;
  locale: string;
  readMinutesLabel: string;
  className?: string;
}

export const ArticleCard = ({
  article,
  href,
  kindLabel,
  locale,
  readMinutesLabel,
  className,
}: ArticleCardProps) => {
  const date = new Date(article.publishedAt);
  const day = date.toLocaleDateString(locale, { day: '2-digit' });
  const month = date.toLocaleDateString(locale, { month: 'short' });

  return (
    <Card href={href} padding="none" className={className}>
      <Card.Media src={article.cover.src} alt={article.cover.alt} ratio="4/3" />
      <Card.Badge top={day} bottom={month} />
      <Card.Body>
        <Card.Eyebrow>{kindLabel}</Card.Eyebrow>
        <Card.Title size="lg">{article.title}</Card.Title>
        <p className="text-muted text-sm leading-relaxed">{article.excerpt}</p>
        <Card.Footer>
          <Card.Meta className="inline-flex items-center gap-2 uppercase">
            <Clock size={12} strokeWidth={1.5} aria-hidden="true" />
            {String(article.readMinutes)} {readMinutesLabel}
          </Card.Meta>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};
