// ═══════════════════════════════════════════════════
// ArticleCard — listing card for news / stories module
// 3:2 cover image, kind eyebrow, title, excerpt, read time, date.
// ═══════════════════════════════════════════════════

import { Image } from '@components/ui/Image';
import { cn } from '@utils/cn';
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
    <a
      href={href}
      className={cn(
        'group focus-visible:ring-accent block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <Image
        src={article.cover.src}
        alt={article.cover.alt}
        ratio="3/2"
        className="duration-slow transition-transform group-hover:scale-[1.02]"
      />
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-muted text-xs tracking-widest uppercase">
          {kindLabel} · {dateLabel}
        </span>
        <h3 className="text-fg text-lg leading-snug font-light">{article.title}</h3>
        <p className="text-muted text-sm leading-relaxed">{article.excerpt}</p>
        <span className="text-muted mt-1 inline-flex items-center gap-2 text-xs tracking-widest uppercase">
          <Clock size={12} strokeWidth={1.5} aria-hidden="true" />
          {String(article.readMinutes)} {readMinutesLabel}
        </span>
      </div>
    </a>
  );
};
