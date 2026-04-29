// ═══════════════════════════════════════════════════
// AccountPreferences — /:locale/account/preferences
// Toggle switches for notifications + recommendations (UI only,
// persistence lands in lot C). Local row component so we can put the
// hint under the label — Switch atom shows label inline.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { SectionHeader } from '@components/ui/SectionHeader';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PreferenceRowProps {
  label: string;
  hint: string;
  enabled: boolean;
  onToggle: () => void;
}

const PreferenceRow = ({ label, hint, enabled, onToggle }: PreferenceRowProps) => (
  <div className="border-border flex items-center justify-between gap-6 border-b py-5 last:border-b-0">
    <div className="flex flex-col gap-1">
      <span className="text-fg text-sm font-medium">{label}</span>
      <span className="text-muted text-xs leading-relaxed">{hint}</span>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full',
        'duration-fast transition-colors',
        'focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        enabled ? 'bg-accent' : 'bg-border',
      )}
    >
      <span
        className={cn(
          'bg-fg pointer-events-none inline-block h-4 w-4 rounded-full',
          'duration-fast transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1',
        )}
        aria-hidden="true"
      />
    </button>
  </div>
);

export default function AccountPreferences() {
  const { t } = useTranslation();

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [phoneNotif, setPhoneNotif] = useState(true);
  const [recommendations, setRecommendations] = useState(true);

  return (
    <Container size="md">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.preferencesTitle')}
          size="md"
          as="h1"
        />

        <section className="border-border bg-surface/40 rounded-lg border px-8 py-2">
          <PreferenceRow
            label={t('account.preferences.notifEmail')}
            hint={t('account.preferences.notifEmailHint')}
            enabled={emailNotif}
            onToggle={() => setEmailNotif(v => !v)}
          />
          <PreferenceRow
            label={t('account.preferences.notifSms')}
            hint={t('account.preferences.notifSmsHint')}
            enabled={smsNotif}
            onToggle={() => setSmsNotif(v => !v)}
          />
          <PreferenceRow
            label={t('account.preferences.notifPhone')}
            hint={t('account.preferences.notifPhoneHint')}
            enabled={phoneNotif}
            onToggle={() => setPhoneNotif(v => !v)}
          />
          <PreferenceRow
            label={t('account.preferences.recommendations')}
            hint={t('account.preferences.recommendationsHint')}
            enabled={recommendations}
            onToggle={() => setRecommendations(v => !v)}
          />
        </section>
      </div>
    </Container>
  );
}
