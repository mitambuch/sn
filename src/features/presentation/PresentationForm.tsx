// ═══════════════════════════════════════════════════
// PresentationForm — anonymous bespoke lead form (salon /presentation)
//
// WHAT: name / email / phone / message + consent. Writes to access_requests
//       (the same anon-write path as the membership request → Postgres trigger
//       emails the operator), marked activity "Salon / QR" so Salva knows the
//       source. Inline status (no toast — the page lives outside providers).
//       Falls back to a simulator when no backend (.env.local absent).
// WHEN: rendered inside the /presentation form section. The page supplies the
//       eyebrow + heading around it.
// ═══════════════════════════════════════════════════

import { Button } from '@components/ui/Button';
import { Checkbox } from '@components/ui/Checkbox';
import { Input } from '@components/ui/Input';
import { Textarea } from '@components/ui/Textarea';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { hasSupabase, supabase } from '@/lib/supabase';

/** Boundary email check — good enough for a salon form, not RFC-perfect. */
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** Anonymous lead form → access_requests → operator email. */
export const PresentationForm = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const valid = name.trim() !== '' && isValidEmail(email) && message.trim() !== '' && consent;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending' || !valid) return;
    setStatus('sending');
    const parts = name.trim().split(/\s+/);
    const first = parts[0] ?? name.trim();
    const last = parts.slice(1).join(' ') || first;

    if (hasSupabase && supabase) {
      const { error } = await supabase.from('access_requests').insert({
        first_name: first,
        last_name: last,
        email: email.trim(),
        phone: phone.trim() || null,
        activity: 'Salon / QR',
        message: message.trim(),
      });
      setStatus(error ? 'error' : 'ok');
      return;
    }
    await new Promise<void>(resolve => {
      setTimeout(resolve, 600);
    });
    setStatus('ok');
  };

  if (status === 'ok') {
    return (
      <div className="border-fg/20 bg-fg/3 rounded-media max-w-xl border p-8">
        <p className="text-fg text-base leading-relaxed">{t('qr.form.success')}</p>
      </div>
    );
  }

  return (
    <form
      className="flex max-w-xl flex-col gap-5"
      onSubmit={e => {
        void handleSubmit(e);
      }}
    >
      <Input
        label={t('qr.form.name')}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={t('qr.form.namePlaceholder')}
        autoComplete="name"
        required
      />
      <Input
        label={t('qr.form.email')}
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={t('qr.form.emailPlaceholder')}
        autoComplete="email"
        required
      />
      <Input
        label={t('qr.form.phone')}
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder={t('qr.form.phonePlaceholder')}
        autoComplete="tel"
      />
      <Textarea
        label={t('qr.form.message')}
        rows={5}
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder={t('qr.form.messagePlaceholder')}
        required
      />
      <Checkbox
        label={t('qr.form.consent')}
        checked={consent}
        onChange={e => setConsent(e.target.checked)}
      />
      {status === 'error' && (
        <p className="text-danger-text text-sm" role="alert">
          {t('qr.form.error')}
        </p>
      )}
      <Button
        type="submit"
        isLoading={status === 'sending'}
        disabled={!valid}
        className="self-start"
      >
        {status === 'sending' ? t('qr.form.sending') : t('qr.form.submit')}
      </Button>
    </form>
  );
};
