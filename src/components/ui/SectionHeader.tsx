// ═══════════════════════════════════════════════════
// SectionHeader — editorial section opener (eyebrow / title / lede)
//
// WHAT: Renders a stacked header with an optional small uppercase eyebrow,
//       a large display title, and an optional muted lede paragraph.
//       Aligned by default; pass align="center" for centered hero use.
// WHEN: Top of every list page, top of major Detail page sections.
// CHANGE TITLE SIZE: edit the sizeStyles below.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

const sizeStyles: Record<NonNullable<SectionHeaderProps['size']>, string> = {
  sm: 'text-xl md:text-2xl',
  md: 'text-2xl md:text-3xl',
  lg: 'text-3xl md:text-4xl lg:text-5xl',
};

const alignStyles: Record<NonNullable<SectionHeaderProps['align']>, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
};

/** Editorial eyebrow + title + lede header, used at every section opener. */
export const SectionHeader = ({
  eyebrow,
  title,
  lede,
  align = 'left',
  size = 'md',
  className,
  as: Tag = 'h2',
}: SectionHeaderProps) => {
  return (
    <header className={cn('flex w-full flex-col gap-4', alignStyles[align], className)}>
      {eyebrow && <span className="text-muted text-xs tracking-[0.3em] uppercase">{eyebrow}</span>}
      <Tag
        className={cn(
          'text-fg font-mono font-bold tracking-tight text-balance uppercase',
          sizeStyles[size],
        )}
      >
        {title}
      </Tag>
      {lede && (
        <p className="text-muted max-w-2xl text-base leading-relaxed text-pretty md:text-lg">
          {lede}
        </p>
      )}
    </header>
  );
};
