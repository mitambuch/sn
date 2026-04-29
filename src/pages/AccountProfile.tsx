// ═══════════════════════════════════════════════════
// AccountProfile — /:locale/account/profile
// Read-only display of currentUser data + edit-on-click placeholders.
// Real edit flow lands in lot C alongside Supabase wiring.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { MetaList } from '@components/ui/MetaList';
import { SectionHeader } from '@components/ui/SectionHeader';
import { useTranslation } from 'react-i18next';

import { currentUser } from '@/mocks/users';

export default function AccountProfile() {
  const { t } = useTranslation();

  const meta = [
    { label: t('common.fullName'), value: currentUser.fullName },
    { label: t('auth.email'), value: currentUser.email },
    {
      label: t('account.preferences.contactPreference'),
      value: t(`account.preferences.contact.${currentUser.contactPreference}`),
    },
    {
      label: t('account.preferences.locale'),
      value: currentUser.locale === 'fr' ? 'Français' : 'English',
    },
    {
      label: t('account.preferences.concierge'),
      value: currentUser.conciergeName,
    },
  ];

  return (
    <Container size="lg">
      <div className="space-y-12 py-12">
        <SectionHeader
          eyebrow={t('account.eyebrow')}
          title={t('account.profileTitle')}
          size="md"
          as="h1"
        />
        <div className="border-border bg-surface/40 rounded-lg border p-8">
          <MetaList items={meta} />
        </div>
        <p className="text-muted text-xs tracking-widest uppercase">
          {t('account.preferences.contactConcierge')}
        </p>
      </div>
    </Container>
  );
}
