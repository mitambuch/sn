// ═══════════════════════════════════════════════════
// TrustBadge + TrustModal — premium security & confidentiality assurance
//
// WHAT: A discreet pill ("Sécurité & confidentialité") that opens a
//       full Modal with seven trust pillars (NDA, encryption, no resale,
//       Swiss data residency, escrow, vetted-only, RGPD/LPD, audit log).
//       Each line carries a lucide icon for cohesion.
// WHEN: Mounted on the dashboard between the greeting and intent cards;
//       can also be embedded near any high-stakes form. Owner-controlled.
// EDIT COPY: src/locales/{fr,en}.json under trust.* — never inline.
// ═══════════════════════════════════════════════════

import { Modal } from '@components/ui/Modal';
import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2,
  FileLock2,
  Lock,
  MapPin,
  Scale,
  ShieldCheck,
  ShieldQuestion,
  UserRoundCheck,
  Vault,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Pillar {
  icon: LucideIcon;
  titleKey: string;
  bodyKey: string;
}

const PILLARS: Pillar[] = [
  { icon: FileLock2, titleKey: 'trust.pillar.nda.title', bodyKey: 'trust.pillar.nda.body' },
  {
    icon: Lock,
    titleKey: 'trust.pillar.encryption.title',
    bodyKey: 'trust.pillar.encryption.body',
  },
  {
    icon: MapPin,
    titleKey: 'trust.pillar.residency.title',
    bodyKey: 'trust.pillar.residency.body',
  },
  {
    icon: UserRoundCheck,
    titleKey: 'trust.pillar.vetted.title',
    bodyKey: 'trust.pillar.vetted.body',
  },
  { icon: Vault, titleKey: 'trust.pillar.escrow.title', bodyKey: 'trust.pillar.escrow.body' },
  {
    icon: Scale,
    titleKey: 'trust.pillar.compliance.title',
    bodyKey: 'trust.pillar.compliance.body',
  },
  {
    icon: CheckCircle2,
    titleKey: 'trust.pillar.audit.title',
    bodyKey: 'trust.pillar.audit.body',
  },
];

interface TrustBadgeProps {
  className?: string;
}

export const TrustBadge = ({ className }: TrustBadgeProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'group border-border bg-surface/40 hover:border-fg/40 hover:bg-surface text-muted hover:text-fg',
          'inline-flex items-center gap-3 rounded-full border px-4 py-2 text-xs tracking-widest uppercase',
          'duration-base transition-[border-color,background-color,color]',
          'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          className,
        )}
      >
        <ShieldCheck size={14} strokeWidth={1.5} aria-hidden="true" />
        <span>{t('trust.badge')}</span>
        <ShieldQuestion
          size={12}
          strokeWidth={1.5}
          aria-hidden="true"
          className="text-muted/60 group-hover:text-fg duration-base transition-colors"
        />
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={t('trust.modalTitle')}>
        <div className="space-y-6">
          <p className="text-muted text-sm leading-relaxed">{t('trust.modalLede')}</p>

          <ul className="divide-border divide-y">
            {PILLARS.map(({ icon: Icon, titleKey, bodyKey }) => (
              <li key={titleKey} className="flex items-start gap-4 py-4">
                <span className="border-border bg-surface text-fg flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-fg text-sm font-medium">{t(titleKey)}</span>
                  <span className="text-muted text-sm leading-relaxed">{t(bodyKey)}</span>
                </div>
              </li>
            ))}
          </ul>

          <p className="border-border text-muted border-t pt-4 text-xs leading-relaxed">
            {t('trust.footerNote')}
          </p>
        </div>
      </Modal>
    </>
  );
};
