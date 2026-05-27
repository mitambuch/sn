// ═══════════════════════════════════════════════════
// AccountProfile — /:locale/account/profile
//
// WHAT: Displays the current member's profile fields (name, email,
//       phone, contact preference, locale, focal interlocutor name)
//       read from the live Supabase session via useAuth. Falls back
//       to the currentUser mock when no session is present (dev/local
//       boot without env). A "Modifier" CTA opens the ProfileEditDrawer
//       which writes back to public.profiles via the column-whitelist
//       UPDATE policy from migration 0010 (full_name, phone,
//       contact_preference, locale).
// WHEN: Sidebar entry "Profil". Anchored at /:locale/account/profile.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { MetaList } from '@components/ui/MetaList';
import { SectionHeader } from '@components/ui/SectionHeader';
import { useAuth } from '@context/AuthContext';
import { ProfileEditDrawer } from '@features/account/ProfileEditDrawer';
import { cn } from '@utils/cn';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { currentUser } from '@/mocks/users';

export default function AccountProfile() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  // Prefer live session ; fall back to mock when no backend.
  const user = session?.user ?? currentUser;

  const meta = [
    { label: t('common.fullName'), value: user.fullName },
    { label: t('auth.email'), value: user.email },
    ...(user.phone ? [{ label: t('common.phone'), value: user.phone }] : []),
    {
      label: t('account.preferences.contactPreference'),
      value: t(`account.preferences.contact.${user.contactPreference}`),
    },
    {
      label: t('account.preferences.locale'),
      value: user.locale === 'fr' ? 'Français' : 'English',
    },
    {
      label: t('account.preferences.concierge'),
      value: user.conciergeName,
    },
  ];

  return (
    <>
      <Container size="lg">
        <div className="space-y-12 py-12">
          <div className="flex items-start justify-between gap-6">
            <SectionHeader
              eyebrow={t('account.eyebrow')}
              title={t('account.profileTitle')}
              size="md"
              as="h1"
            />
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className={cn(
                'border-fg/15 text-fg hover:border-fg/40 hover:bg-bg/40 focus-visible:ring-accent',
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] tracking-[0.25em] whitespace-nowrap uppercase',
                'duration-base transition-[border-color,background-color]',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              )}
            >
              <Pencil size={12} strokeWidth={1.5} aria-hidden="true" />
              {t('common.edit')}
            </button>
          </div>
          <div className="border-border bg-surface/40 rounded-lg border p-8">
            <MetaList items={meta} />
          </div>
          <p className="text-muted text-xs tracking-widest uppercase">
            {t('account.preferences.contactConcierge')}
          </p>
        </div>
      </Container>
      <ProfileEditDrawer open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
}
