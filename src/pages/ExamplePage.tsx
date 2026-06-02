// ═══════════════════════════════════════════════════
// ExamplePage — /exemple — code-entry gate with 6 OTP boxes
//
// WHAT: Esthetic light-grey landing where the recipient types the 6-
//       character access code Salva sent them. SAW↗NEXT mark sits at
//       the top of the page, then a centered "form" card holds the
//       eyebrow + headline + intro + 6 OTP boxes + status, and a
//       prominent "Retour sur le site" button anchors the bottom. The
//       OTP auto-advances and accepts paste. Successful validation
//       pushes the user through to /share/<CODE>.
//       Pre-fills the canonical demo code when the URL has ?code=APERCU.
//
// WHEN: Public route /exemple (outside locale tree, no layout chrome).
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';
import { OtpInput } from '@components/ui/OtpInput';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { normalizeShareCode, SHARE_CODE_CANONICAL_PATTERN, SHARE_CODE_LENGTH } from '@/types/share';

type Status = 'idle' | 'invalid';

const DEMO_CODE = 'APERCU';

export default function ExamplePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const presetCode = params.get('code') ?? '';
  const [status, setStatus] = useState<Status>('idle');
  const [current, setCurrent] = useState<string>(presetCode);

  // Validate the FORMAT only, then hand off to /share/:code — which is the
  // single place that consumes the code (one view bump) and renders every
  // outcome (single fiche · selection · expired · revoked · not-found).
  // Consuming here too would double-count views (a 1-view code would burn
  // before the recipient ever sees the fiche).
  const handleComplete = (raw: string) => {
    const code = normalizeShareCode(raw);
    if (!SHARE_CODE_CANONICAL_PATTERN.test(code)) {
      setStatus('invalid');
      return;
    }
    void navigate(`/share/${code}`);
  };

  const canSubmit = current.length === SHARE_CODE_LENGTH;

  // One-click "test with the demo code" — bypasses the OTP entirely for
  // owner-driven walkthroughs. Pushes straight to /share/APERCU.
  const handleDemoShortcut = () => {
    void navigate(`/share/${DEMO_CODE}`);
  };

  const statusLabel: Record<Status, string> = {
    idle: 'Tapez ou collez le code à 6 caractères transmis par Valmont.',
    invalid: '6 caractères attendus, sans préfixe ni espace.',
  };

  return (
    <main
      data-theme="light"
      className="bg-bg text-fg relative flex min-h-screen flex-col overflow-hidden px-6 py-10 md:px-12 md:py-12"
    >
      {/* React 19 hoists these into <head> automatically */}
      <title>{t('example.metaTitle')}</title>
      <meta
        name="description"
        content="Entrez le code à 6 caractères transmis par Valmont pour ouvrir l'aperçu privé."
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

      {/* ─── Top : brand mark ─────────────────────────── */}
      <header className="flex w-full items-center justify-center">
        <Link to="/" aria-label="Retour à l'accueil SAW NEXT" className="inline-flex">
          <BrandMark variant="full" className="text-fg text-base md:text-lg" />
        </Link>
      </header>

      {/* ─── Center : form card ──────────────────────── */}
      <div className="flex flex-1 items-center justify-center py-10">
        <section
          aria-labelledby="example-heading"
          className="border-border bg-bg/80 shadow-card-rest animate-important w-full max-w-xl rounded-2xl border px-6 py-10 backdrop-blur-sm motion-reduce:animate-none md:px-10 md:py-12"
        >
          <div className="flex flex-col items-center gap-8 text-center">
            <span className="text-muted font-mono text-[10px] tracking-[0.5em] uppercase">
              Aperçu privé
            </span>

            <h1
              id="example-heading"
              className="font-mono text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] font-medium tracking-tight uppercase"
            >
              Un code,
              <br />
              votre accès.
            </h1>

            <p className="text-muted max-w-sm text-sm leading-relaxed">
              Entrez les 6 caractères transmis par Valmont. Aucun compte, aucune trace — le code
              donne accès à <em>une ou plusieurs</em> fiches, pour vous.
            </p>

            <div className="flex w-full flex-col items-center gap-4 pt-2">
              <OtpInput
                length={SHARE_CODE_LENGTH}
                initialValue={presetCode}
                pattern={/^[A-HJ-NP-Z2-9]$/i}
                onComplete={value => {
                  handleComplete(value);
                }}
                onChange={value => {
                  setCurrent(value);
                  if (status !== 'idle') setStatus('idle');
                }}
                variant={status === 'invalid' ? 'danger' : 'default'}
              />
              <p
                aria-live="polite"
                className={
                  status === 'invalid'
                    ? 'text-accent text-xs leading-relaxed'
                    : 'text-muted text-xs leading-relaxed'
                }
              >
                {statusLabel[status]}
              </p>

              {/* Manual "Entrer" submit — fires even if onComplete missed
                  (legacy browsers, paste-then-Enter, demo walkthrough). */}
              <button
                type="button"
                onClick={() => {
                  handleComplete(current);
                }}
                disabled={!canSubmit}
                className="border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-fg/30 mt-2 inline-flex items-center gap-3 rounded-full border px-7 py-3 font-mono text-xs tracking-[0.4em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              >
                Entrer
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Demo hint — visible "test with APERCU" shortcut ──── */}
      <div className="flex w-full justify-center pb-6">
        <button
          type="button"
          onClick={handleDemoShortcut}
          className="text-muted hover:text-fg font-mono text-[10px] tracking-[0.3em] uppercase transition-colors"
        >
          Démo : tester avec le code <span className="text-fg font-medium">{DEMO_CODE}</span> ↗
        </button>
      </div>

      {/* ─── Bottom : visible primary "back to site" CTA ──── */}
      <footer className="flex w-full justify-center pb-2">
        <Link
          to="/"
          className="border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-fg/30 group inline-flex items-center gap-3 rounded-full border px-7 py-3.5 font-mono text-xs tracking-[0.4em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Retour sur le site
        </Link>
      </footer>
    </main>
  );
}
