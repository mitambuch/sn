// ═══════════════════════════════════════════════════
// ArticleCard — domain wrapper around Card atom
//
// WHAT: Apple-closed surface with 3:2 editorial cover, kind · date eyebrow,
//       large light-weight title, excerpt as expanded meta, read-time hint
//       with Clock icon in footer.
// WHEN: NewsList grid item, account "your reading" widgets.
// EDIT VISUAL: change radius/shadow in src/index.css tokens. 3:2 kept (not
//       unified to 4:3) because editorial convention favours wider cover.
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
  const dateLabel = date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card href={href} padding="none" className={className}>
      <Card.Media src={article.cover.src} alt={article.cover.alt} ratio="3/2" />
      <Card.Body>
        <Card.Eyebrow>
          {kindLabel} · {dateLabel}
        </Card.Eyebrow>
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
