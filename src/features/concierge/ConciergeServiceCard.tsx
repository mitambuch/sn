// ═══════════════════════════════════════════════════
// ConciergeServiceCard — listing card for Concierge module
// Different shape from item modules: square Image (capability metaphor)
// + category eyebrow + title + 2-line summary + lead time hint.
// ═══════════════════════════════════════════════════

import { HeartButton } from '@components/ui/HeartButton';
import { Image } from '@components/ui/Image';
import { cn } from '@utils/cn';

import type { ConciergeService } from '@/types/concierge';

interface ConciergeServiceCardProps {
  service: ConciergeService;
  href: string;
  categoryLabel: string;
  leadTimeLabel: string;
  className?: string;
}

export const ConciergeServiceCard = ({
  service,
  href,
  categoryLabel,
  leadTimeLabel,
  className,
}: ConciergeServiceCardProps) => {
  return (
    <a
      href={href}
      className={cn(
        'group focus-visible:ring-accent border-border bg-surface/40 hover:border-fg/40 block rounded-lg border p-6',
        'duration-base transition-[border-color,background-color]',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <div className="relative">
        <Image
          src={service.images[0]?.src ?? ''}
          alt={service.images[0]?.alt ?? service.title}
          ratio="3/2"
          className="duration-slow transition-transform group-hover:scale-[1.02]"
        />
        <HeartButton
          module="concierge"
          slug={service.slug}
          size="sm"
          className="absolute top-3 right-3"
        />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-muted text-xs tracking-widest uppercase">{categoryLabel}</span>
        <h3 className="text-fg text-base font-medium">{service.title}</h3>
        <p className="text-muted text-sm leading-relaxed">{service.summary}</p>
        <span className="text-muted mt-2 text-xs tracking-widest uppercase">
          ⌛ {leadTimeLabel}: {service.leadTime}
        </span>
      </div>
    </a>
  );
};
