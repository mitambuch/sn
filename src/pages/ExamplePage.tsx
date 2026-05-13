// ═══════════════════════════════════════════════════
// ExamplePage — /exemple — code-entry gate with 6 OTP boxes
//
// WHAT: Esthetic light-grey landing where the recipient types the 6-
//       character access code Salva sent them. The 6 boxes auto-advance
//       and accept paste. Successful validation pushes through to
//       /share/<CODE> which resolves the linked fiche (Sanity).
//       Pre-fills the canonical demo code (APERCU) when the URL has
//       ?code=APERCU — used by the / exemple demo button and any
//       direct deeplink Salva sends.
//
// WHEN: Public route /exemple (outside locale tree, no layout chrome).
//       Reachable directly, share-able as-is.
// ═══════════════════════════════════════════════════

import { OtpInput } from '@components/ui/OtpInput';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { consumeShareCode } from '@/lib/shareCode';
import { normalizeShareCode, SHARE_CODE_CANONICAL_PATTERN, SHARE_CODE_LENGTH } from '@/types/share';

type Status = 'idle' | 'checking' | 'invalid' | 'unknown';

export default function ExamplePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const presetCode = params.get('code') ?? '';
  const [status, setStatus] = useState<Status>('idle');

  const handleComplete = async (raw: string) => {
    const code = normalizeShareCode(raw);
    if (!SHARE_CODE_CANONICAL_PATTERN.test(code)) {
      setStatus('invalid');
      return;
    }
    setStatus('checking');
    // Pre-check the code so we can show inline feedback before navigating.
    // SharePage will consume it again — that's fine, consume_share_code
    // is the only path that bumps the view counter.
    const result = await consumeShareCode(code);
    if (result?.isValid) {
      void navigate(`/share/${code}`);
      return;
    }
    setStatus('unknown');
  };

  const statusLabel: Record<Status, string> = {
    idle: 'Tapez ou collez le code à 6 caractères transmis par Salvatore.',
    checking: 'Vérification du code…',
    invalid: '6 caractères attendus, sans préfixe ni espace.',
    unknown: "Ce code n'est pas reconnu. Vérifiez la saisie ou contactez Salvatore.",
  };

  return (
    <main
      data-theme="light"
      className="bg-bg text-fg relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 md:px-12"
    >
      {/* React 19 hoists these into <head> automatically */}
      <title>Aperçu privé — SAW NEXT</title>
      <meta
        name="description"
        content="Entrez le code à 6 caractères transmis par Salvatore pour ouvrir l'aperçu privé."
      />
      <meta name="robots" content="noindex, nofollow" />

      {/* Soft grey ambient backdrop — light surface, low-key luxury */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 60%), linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%)',
        }}
      />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-10 text-center">
        <span className="text-muted font-mono text-[10px] tracking-[0.5em] uppercase">
          SAW NEXT — Aperçu privé
        </span>

        <h1 className="font-mono text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] font-medium tracking-tight uppercase">
          Un code,
          <br />
          une fiche.
        </h1>

        <p className="text-muted max-w-md text-sm leading-relaxed">
          Entrez ci-dessous les 6 caractères transmis par Salvatore. Aucun compte, aucune trace — le
          code donne accès à <em>une seule</em> fiche, pour vous.
        </p>

        <div className="flex flex-col items-center gap-4">
          <OtpInput
            length={SHARE_CODE_LENGTH}
            initialValue={presetCode}
            pattern={/^[A-HJ-NP-Z2-9]$/i}
            onComplete={value => {
              void handleComplete(value);
            }}
            onChange={() => {
              if (status !== 'idle') setStatus('idle');
            }}
            disabled={status === 'checking'}
            variant={status === 'invalid' || status === 'unknown' ? 'danger' : 'default'}
          />
          <p
            aria-live="polite"
            className={
              status === 'invalid' || status === 'unknown'
                ? 'text-accent text-xs leading-relaxed'
                : 'text-muted text-xs leading-relaxed'
            }
          >
            {statusLabel[status]}
          </p>
        </div>

        <Link
          to="/"
          className="text-muted hover:text-fg mt-4 font-mono text-[10px] tracking-[0.3em] uppercase transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
