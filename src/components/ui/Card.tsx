// ═══════════════════════════════════════════════════
// Card — Apple-closed surface system
//
// WHAT: Self-contained box atom with hairline border, inner top specular
//       highlight, and slot-based composition (Media, Body, Eyebrow, Title,
//       Meta, Footer, Overlay). One unified container for the 7 domain
//       cards + admin surfaces.
// WHEN: Use anywhere you need a closed, premium container — listing card,
//       admin tile, account widget. Each domain card is a thin wrapper.
// CHANGE RADIUS / SHADOW: edit --radius-card + --shadow-card-hover tokens
//       in src/index.css (propagates everywhere).
// CHANGE COLORS: edit design tokens in src/index.css, never here.
//
// USAGE
//   Legacy children-only mode (playground, stats) — padding applies to wrapper:
//     <Card padding="md">simple content</Card>
//
//   Slot mode — domain cards, set padding="none" so slots own their spacing:
//     <Card href={href} padding="none">
//       <Card.Media src={...} alt={...} ratio="4/3" />
//       <Card.Overlay>{actionsAbsolutePositioned}</Card.Overlay>
//       <Card.Body>
//         <Card.Eyebrow>...</Card.Eyebrow>
//         <Card.Title italic>...</Card.Title>
//         <Card.Meta>...</Card.Meta>
//         <Card.Footer>{ctaOrPrice}</Card.Footer>
//       </Card.Body>
//     </Card>
// ═══════════════════════════════════════════════════

import { Image } from '@components/ui/Image';
import { cn } from '@utils/cn';
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  /** Renders as React Router <Link to> — SPA navigation, preferred for internal routes. */
  to?: string | undefined;
  /** Renders as plain <a href> — full page reload, use for external links. */
  href?: string | undefined;
  /** Force interactive states even without href/to (rare — div-wrapped onClick). */
  interactive?: boolean | undefined;
  /** Outer wrapper padding for children-only mode. Use "none" with slots. */
  padding?: 'sm' | 'md' | 'lg' | 'none' | undefined;
  className?: string | undefined;
  children: ReactNode;
}

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
  none: 'p-0',
};

const baseSurface = cn(
  'group relative isolate flex flex-col overflow-hidden',
  'rounded-card border border-border bg-surface',
  'shadow-card-rest',
  'transition-[border-color,transform,box-shadow] duration-500 ease-out',
);

const interactiveStyles = cn(
  'cursor-pointer',
  'hover:border-fg/30',
  'motion-safe:hover:-translate-y-[2px]',
  'hover:shadow-card-hover',
  'active:translate-y-0 active:scale-[0.998] active:duration-100',
  'focus-visible:outline-none',
  'focus-visible:ring-2 focus-visible:ring-fg/40 focus-visible:ring-offset-4 focus-visible:ring-offset-bg',
);

// WHY: dark fg on dark bg means standard box-shadow is invisible. Inner top
// 1px specular highlight is the Apple signature for premium surfaces — it
// reads as carved-in light catching the top edge, not as a drop shadow.
/** Apple-closed surface atom — composes via slot statics on Card.* */
export const Card = ({
  to,
  href,
  interactive = false,
  padding = 'md',
  className,
  children,
  ...rest
}: CardProps & (AnchorHTMLAttributes<HTMLAnchorElement> | HTMLAttributes<HTMLDivElement>)) => {
  const effectiveInteractive = interactive || Boolean(href) || Boolean(to);

  const classes = cn(
    baseSurface,
    effectiveInteractive && interactiveStyles,
    paddingStyles[padding],
    className,
  );

  if (to) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link to={to} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  if (href) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const divRest = rest as HTMLAttributes<HTMLDivElement>;
  return (
    <div className={classes} {...divRest}>
      {children}
    </div>
  );
};

// ─── Slots ──────────────────────────────────────────────────────────

interface CardMediaProps {
  src?: string | undefined;
  alt: string;
  ratio?: '4/3' | '16/9' | '1/1' | '3/4' | '3/2' | undefined;
  fit?: 'cover' | 'contain' | undefined;
  wrapperClassName?: string | undefined;
  className?: string | undefined;
}

/** Top media slot — image flush to card edges, clipped by parent radius.
 *  Group-hover scales the image inside, not the card itself. */
const CardMedia = ({
  src,
  alt,
  ratio = '4/3',
  fit = 'cover',
  wrapperClassName,
  className,
}: CardMediaProps) => (
  <div className={cn('relative overflow-hidden', wrapperClassName)}>
    <Image
      src={src ?? ''}
      alt={alt}
      ratio={ratio}
      className={cn(
        'duration-cinematic transition-transform motion-safe:group-hover:scale-[1.04]',
        fit === 'contain' && 'object-contain',
        className,
      )}
    />
  </div>
);

interface CardOverlayProps {
  children: ReactNode;
  className?: string | undefined;
}

/** Absolute overlay over Media — for HeartButton, status pills.
 *  Children position themselves (e.g. `className="absolute top-3 right-3"`).
 *  Overlay container is pointer-inert, children are pointer-active. */
const CardOverlay = ({ children, className }: CardOverlayProps) => (
  <div className={cn('pointer-events-none absolute inset-0 z-10 *:pointer-events-auto', className)}>
    {children}
  </div>
);

interface CardBadgeProps {
  /** Big top line — number, day, year, etc. */
  top: ReactNode;
  /** Small bottom line — unit, month, label. Omit for 1-line badges. */
  bottom?: ReactNode | undefined;
  className?: string | undefined;
}

/** Frosted-glass stamp pinned top-left of Media. The "domain signature" —
 *  date for Events, year for Timepiece/Artwork, surface for Property, etc.
 *  Always the same box shell, content varies per module. */
const CardBadge = ({ top, bottom, className }: CardBadgeProps) => (
  <div
    className={cn(
      'bg-bg/55 border-border/40 pointer-events-none absolute top-3 left-3 z-10 flex flex-col items-center rounded-xl border px-3 py-2 backdrop-blur-md',
      className,
    )}
  >
    <span className="text-fg text-lg leading-none font-light">{top}</span>
    {bottom !== undefined && (
      <span className="text-fg/80 mt-1 text-[10px] tracking-widest uppercase">{bottom}</span>
    )}
  </div>
);

interface CardBodyProps {
  children: ReactNode;
  className?: string | undefined;
  /** Compact (admin tiles), comfortable (default), or spacious (hero detail surfaces). */
  density?: 'compact' | 'comfortable' | 'spacious' | undefined;
}

const densityStyles: Record<NonNullable<CardBodyProps['density']>, string> = {
  compact: 'p-4 gap-1',
  comfortable: 'p-5 gap-1.5',
  spacious: 'p-6 gap-2',
};

/** Padded content area — wraps Eyebrow/Title/Meta/Footer. */
const CardBody = ({ children, className, density = 'comfortable' }: CardBodyProps) => (
  <div className={cn('flex flex-1 flex-col', densityStyles[density], className)}>{children}</div>
);

interface CardEyebrowProps {
  children: ReactNode;
  className?: string | undefined;
}

/** Tiny uppercase tracking-wide label — eyebrow before the title. */
const CardEyebrow = ({ children, className }: CardEyebrowProps) => (
  <span className={cn('text-muted text-xs tracking-widest uppercase', className)}>{children}</span>
);

interface CardTitleProps {
  children: ReactNode;
  className?: string | undefined;
  /** True for art-style titles (Artwork module). */
  italic?: boolean | undefined;
  size?: 'base' | 'lg' | undefined;
}

const titleSizes: Record<NonNullable<CardTitleProps['size']>, string> = {
  base: 'text-base font-medium',
  lg: 'text-lg font-light leading-snug',
};

/** Title of the card — h3 default, supports italic for artworks. */
const CardTitle = ({ children, className, italic = false, size = 'base' }: CardTitleProps) => (
  <h3 className={cn('text-fg', titleSizes[size], italic && 'italic', className)}>{children}</h3>
);

interface CardMetaProps {
  children: ReactNode;
  className?: string | undefined;
  /** Mono variant for technical references (Timepiece ref number). */
  mono?: boolean | undefined;
}

/** Meta line under title — dimensions, reference, lead time, etc. */
const CardMeta = ({ children, className, mono = false }: CardMetaProps) => (
  <span
    className={cn(
      'text-muted text-xs',
      mono ? 'font-mono tracking-wider' : 'tracking-wide',
      className,
    )}
  >
    {children}
  </span>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string | undefined;
}

/** Bottom-anchored footer inside Body — for PriceTag, CTA, time hint. */
const CardFooter = ({ children, className }: CardFooterProps) => (
  <div className={cn('mt-auto pt-3', className)}>{children}</div>
);

Card.Media = CardMedia;
Card.Overlay = CardOverlay;
Card.Badge = CardBadge;
Card.Body = CardBody;
Card.Eyebrow = CardEyebrow;
Card.Title = CardTitle;
Card.Meta = CardMeta;
Card.Footer = CardFooter;
