// ═══════════════════════════════════════════════════
// Invite — personal invitation landing reached from a WhatsApp link
//
// WHAT: Code-personalised landing under the same light + grain
//       aesthetic as the home page. Three-field form (name, email,
//       phone) submits to /.netlify/functions/invite. Salva tracks
//       which code went to whom out-of-band — no DB validation here,
//       the URL slug is decorative.
// WHEN: Route /:locale/invite/:code, only reachable via the direct
//       link Salva shares.
// CHANGE COPY: src/pages/Invite.tsx until /brief is run, then move
//              to src/locales/{fr,en}.json under invite.*.
// CHANGE ENDPOINT: SUBMIT_URL constant — points to Netlify function.
// ═══════════════════════════════════════════════════

import { BrandArrow } from '@components/ui/BrandArrow';
import { FilmGrain } from '@components/ui/FilmGrain';
import { Logomark } from '@components/ui/Logomark';
import { MagneticButton } from '@components/ui/MagneticButton';
import { MaskedReveal } from '@components/ui/MaskedReveal';
import { SnArrow } from '@components/ui/SnArrow';
import { cn } from '@utils/cn';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const SUBMIT_URL = '/.netlify/functions/invite';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  phone: string;
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function Invite() {
  const { code } = useParams<{ code: string }>();
  const safeCode = (code ?? '').toUpperCase();

  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const onChange = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError('Merci d’indiquer votre nom complet.');
      return;
    }
    if (!isEmail(form.email)) {
      setError('Adresse email non valide.');
      return;
    }
    if (!form.phone.trim() || form.phone.trim().length < 6) {
      setError('Merci d’indiquer un numéro de téléphone joignable.');
      return;
    }

    setStatus('submitting');
    fetch(SUBMIT_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code: safeCode, ...form }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: unknown = await res.json().catch(() => ({}));
        if (typeof json === 'object' && json && 'ok' in json && json.ok === false) {
          const reason = 'error' in json && typeof json.error === 'string' ? json.error : 'reject';
          throw new Error(reason);
        }
        setStatus('success');
      })
      .catch((err: unknown) => {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Échec de l’envoi.');
      });
  };

  if (status === 'success') {
    return <InviteSuccess firstName={form.name.split(' ')[0] ?? ''} />;
  }

  return (
    <InviteHero
      code={safeCode}
      form={form}
      status={status}
      error={error}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}

interface InviteHeroProps {
  code: string;
  form: FormState;
  status: Status;
  error: string | null;
  onChange: (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const InviteHero = ({ code, form, status, error, onChange, onSubmit }: InviteHeroProps) => (
  <section className="relative flex min-h-screen w-full flex-col overflow-hidden">
    <FilmGrain intensity={0.85} density={14} tickMs={90} />

    <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
      <Logomark className="text-fg h-6 w-auto md:h-7" />
      <span className="text-fg/60 font-mono text-[10px] tracking-[0.4em] uppercase">
        Confidentiel
      </span>
    </header>

    <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-16 md:py-24">
      <MaskedReveal immediate delay={100}>
        <div className="border-fg/15 bg-fg/3 mb-12 flex flex-col items-center border p-6 md:p-8">
          <span className="text-fg/40 font-mono text-[9px] tracking-[0.5em] uppercase">
            SAW · INVITATION
          </span>
          <span className="text-fg mt-3 font-mono text-2xl font-semibold tracking-[0.3em] md:text-4xl">
            {code || '— · — · —'}
          </span>
        </div>
      </MaskedReveal>

      <MaskedReveal immediate delay={300}>
        <p className="text-fg/60 font-mono text-[10px] tracking-[0.5em] uppercase">
          Une invitation personnelle de
        </p>
      </MaskedReveal>
      <MaskedReveal immediate delay={420}>
        <h1 className="text-fg mt-3 font-mono text-2xl leading-tight font-semibold tracking-tight uppercase md:text-4xl">
          Salvatore Montemagno
        </h1>
      </MaskedReveal>
      <MaskedReveal immediate delay={580}>
        <p className="text-fg/85 mt-6 max-w-xl text-base leading-relaxed md:text-lg">
          Pour rejoindre SAW Next, laissez-nous trois informations. Salvatore vous appellera
          personnellement sous 48 heures.
        </p>
      </MaskedReveal>

      <InviteForm
        form={form}
        status={status}
        error={error}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  </section>
);

interface InviteFormProps {
  form: FormState;
  status: Status;
  error: string | null;
  onChange: (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const InviteForm = ({ form, status, error, onChange, onSubmit }: InviteFormProps) => (
  <form onSubmit={onSubmit} className="mt-12 flex flex-col gap-5" noValidate>
    <Field
      label="Nom complet"
      name="name"
      type="text"
      autoComplete="name"
      value={form.name}
      onChange={onChange('name')}
      required
    />
    <Field
      label="Email"
      name="email"
      type="email"
      autoComplete="email"
      value={form.email}
      onChange={onChange('email')}
      required
    />
    <Field
      label="Téléphone (WhatsApp préféré)"
      name="phone"
      type="tel"
      autoComplete="tel"
      value={form.phone}
      onChange={onChange('phone')}
      required
    />

    {error && (
      <p role="alert" className="text-danger-text font-mono text-[11px] tracking-wider uppercase">
        {error}
      </p>
    )}

    <div className="mt-6 flex justify-start">
      <MagneticButton strength={0.3} range={140}>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cn(
            'border-fg/30 hover:border-fg text-fg focus-visible:ring-fg/40 inline-flex items-center justify-center gap-3 rounded-full border px-7 py-3.5 font-mono text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60',
          )}
        >
          <span>{status === 'submitting' ? 'Envoi en cours' : 'Accepter l’invitation'}</span>
          <BrandArrow className="h-[0.9em]" />
        </button>
      </MagneticButton>
    </div>

    <p className="text-fg/40 mt-2 max-w-md font-mono text-[9px] leading-relaxed tracking-wider uppercase">
      Vos informations sont transmises uniquement à Salvatore. Aucun envoi marketing, aucune liste
      partagée.
    </p>
  </form>
);

interface InviteSuccessProps {
  firstName: string;
}

const InviteSuccess = ({ firstName }: InviteSuccessProps) => (
  <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6">
    <FilmGrain intensity={1} density={20} tickMs={80} />
    <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
      <SnArrow className="text-fg mb-12 h-12 w-auto" />
      <MaskedReveal immediate>
        <p className="text-fg/60 font-mono text-[10px] tracking-[0.5em] uppercase">
          Invitation acceptée
        </p>
      </MaskedReveal>
      <MaskedReveal immediate delay={200}>
        <h1 className="text-fg mt-8 font-mono text-3xl leading-tight font-semibold tracking-tight uppercase md:text-5xl">
          Merci{firstName ? `, ${firstName}` : ''}.
        </h1>
      </MaskedReveal>
      <MaskedReveal immediate delay={420}>
        <p className="text-fg/80 mt-8 max-w-md text-base leading-relaxed md:text-lg">
          Salvatore vous contactera personnellement sous 48 heures pour poursuivre la conversation.
        </p>
      </MaskedReveal>
      <MaskedReveal immediate delay={620}>
        <p className="text-fg/40 mt-12 font-mono text-[10px] tracking-[0.4em] uppercase">
          Vous pouvez fermer cette fenêtre.
        </p>
      </MaskedReveal>
    </div>
  </section>
);

interface FieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'tel';
  autoComplete: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Field = ({ label, name, type, autoComplete, value, onChange, required }: FieldProps) => {
  const id = `invite-field-${name}`;
  return (
    <div className="group flex flex-col gap-2">
      <label htmlFor={id} className="text-fg/60 font-mono text-[10px] tracking-[0.4em] uppercase">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        required={required}
        className="border-fg/20 focus:border-fg text-fg placeholder:text-fg/30 w-full border-b bg-transparent py-3 text-lg transition-colors duration-300 outline-none"
      />
    </div>
  );
};
