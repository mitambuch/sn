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
import { useEffect, useState } from 'react';
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
  /** Flagged as priority — adds a subtle pulsing outline ring around the card. */
  important?: boolean | undefined;
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
  important = false,
  className,
  children,
  ...rest
}: CardProps & (AnchorHTMLAttributes<HTMLAnchorElement> | HTMLAttributes<HTMLDivElement>)) => {
  const effectiveInteractive = interactive || Boolean(href) || Boolean(to);

  const classes = cn(
    baseSurface,
    effectiveInteractive && interactiveStyles,
    paddingStyles[padding],
    important && 'animate-important motion-reduce:animate-none',
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

/** Padded content area — wraps Eyebrow/Title/Meta/Footer.
 *  `justify-end` anchors all children to the bottom of Body when the
 *  card is stretched (catalogue mixed grid). Cascade behavior: adding
 *  content pushes the cluster up, removing it lets it settle down.
 *  Combined with Media fixed top, the empty space appears BETWEEN
 *  Media and the bottom-anchored content cluster. */
const CardBody = ({ children, className, density = 'comfortable' }: CardBodyProps) => (
  <div className={cn('flex flex-1 flex-col justify-end', densityStyles[density], className)}>
    {children}
  </div>
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

/** Bottom-anchored footer inside Body — for inline CTA, time hint. */
const CardFooter = ({ children, className }: CardFooterProps) => (
  <div className={cn('mt-auto pt-3', className)}>{children}</div>
);

interface CardStatsProps {
  children: ReactNode;
  className?: string | undefined;
  /** Number of equal columns (default 2). */
  cols?: 2 | 3 | undefined;
}

const statsColStyles: Record<NonNullable<CardStatsProps['cols']>, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
};

/** Specs grid inside Body — label + value pairs, hairline divider above.
 *  Sits at the bottom of the body cluster (Body uses `justify-end` to
 *  anchor everything bottom). `mt-3` keeps a small gap from Title. */
const CardStats = ({ children, className, cols = 2 }: CardStatsProps) => (
  <div
    className={cn('border-border mt-3 grid gap-4 border-t pt-3', statsColStyles[cols], className)}
  >
    {children}
  </div>
);

interface CardStatProps {
  label: ReactNode;
  value: ReactNode;
  className?: string | undefined;
  /** Mono variant for technical references. */
  mono?: boolean | undefined;
}

/** One specs cell — tiny uppercase label on top, value below. */
const CardStat = ({ label, value, className, mono = false }: CardStatProps) => (
  <div className={cn('flex flex-col gap-1', className)}>
    <span className="text-muted text-[10px] tracking-widest uppercase">{label}</span>
    <span className={cn('text-fg text-sm', mono && 'font-mono tracking-wider')}>{value}</span>
  </div>
);

interface CardPriceBlockProps {
  children: ReactNode;
  className?: string | undefined;
}

/** Prominent footer block — edge-to-edge with hairline divider and a
 *  subtle bg shift. Place OUTSIDE Card.Body (sits flush at card bottom).
 *  Typical content: tiny uppercase label + Card.Pill on the right. */
const CardPriceBlock = ({ children, className }: CardPriceBlockProps) => (
  <div
    className={cn(
      'border-border bg-bg/40 mt-auto flex items-center justify-between gap-4 border-t px-5 py-3.5',
      className,
    )}
  >
    {children}
  </div>
);

interface CardPillProps {
  children: ReactNode;
  className?: string | undefined;
}

/** Mini bordered pill — premium tag style for the right side of PriceBlock.
 *  Apple App Store pricing pill vibe: hairline border, contrasting bg,
 *  rounded-full, mono uppercase typography. */
const CardPill = ({ children, className }: CardPillProps) => (
  <span
    className={cn(
      'border-border bg-bg text-fg inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs tracking-widest uppercase',
      className,
    )}
  >
    {children}
  </span>
);

// ─── Countdown slot — live timer for "offre limitée" cards ─────────

interface CardCountdownProps {
  /** Target end date as ISO string. When passed, ticks every second until 0. */
  endsAt: string;
  /** Localised "OFFRE LIMITÉE" label shown above the timer. */
  label: string;
  /** Position class — e.g. "top-3 left-3" or "top-3 right-3". */
  className?: string | undefined;
}

function useCountdown(endsAt: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const end = new Date(endsAt).getTime();
  const diff = Math.max(0, end - now);
  return {
    expired: diff === 0,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    mins: Math.floor((diff / 60_000) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

/** Frosted-glass countdown pill. Positioned via className (top-left when
 *  Card.Badge is absent, top-right under HeartButton when it isn't).
 *  Pointer-inert, doesn't interfere with the underlying card link. */
const CardCountdown = ({ endsAt, label, className }: CardCountdownProps) => {
  const { expired, days, hours, mins, secs } = useCountdown(endsAt);
  if (expired) return null;
  return (
    <div
      className={cn(
        'bg-bg/55 border-border/40 pointer-events-none absolute z-10 flex flex-col items-center rounded-xl border px-3 py-2 backdrop-blur-md',
        className,
      )}
    >
      <span className="text-fg/80 text-[9px] tracking-widest uppercase">{label}</span>
      <span className="text-fg mt-1 font-mono text-[11px] tracking-wider tabular-nums">
        {days}j {hours}h {mins}m {secs}s
      </span>
    </div>
  );
};

Card.Media = CardMedia;
Card.Overlay = CardOverlay;
Card.Badge = CardBadge;
Card.Countdown = CardCountdown;
Card.Body = CardBody;
Card.Eyebrow = CardEyebrow;
Card.Title = CardTitle;
Card.Meta = CardMeta;
Card.Footer = CardFooter;
Card.Stats = CardStats;
Card.Stat = CardStat;
Card.PriceBlock = CardPriceBlock;
Card.Pill = CardPill;
