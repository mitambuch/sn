// ═══════════════════════════════════════════════════
// LogoPreview — Brand identity validation page
//
// WHAT: Renders the SAW↗NEXT logo (via <BrandMark />) in multiple sizes
//       + the arrow vocabulary set. Owner-facing reference page.
// WHEN: Open /logo to verify brand compliance (font, glyph, vertical
//       alignment, spacing, case).
// RULE: .claude/memory/decisions/2026-05-12-brand-identity-saw-next.md
// ═══════════════════════════════════════════════════

import { BrandMark } from '@components/brand/BrandMark';

const ARROWS = [
  { glyph: '↗', code: 'U+2197', usage: 'signature · accent · identité' },
  { glyph: '↘', code: 'U+2198', usage: 'descente · intro de section' },
  { glyph: '↙', code: 'U+2199', usage: 'retour · sortie · back-link' },
  { glyph: '→', code: 'U+2192', usage: 'CTA · lien · continuité' },
] as const;

const FORBIDDEN = [
  { glyph: '⬈', code: 'U+2B08', label: 'NE Black Arrow' },
  { glyph: '➚', code: 'U+279A', label: 'Heavy NE Arrow' },
  { glyph: '⤴', code: 'U+2934', label: 'Curving up' },
  { glyph: '⇗', code: 'U+21D7', label: 'Double NE' },
] as const;

export default function LogoPreview() {
  return (
    <main className="bg-bg text-fg min-h-screen px-6 py-16 sm:px-12 sm:py-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-24">
        {/* ─── Display — long form, very large ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Long form / display — Geist Mono Variable / 700 / caps
          </p>
          <BrandMark className="text-6xl leading-none sm:text-8xl md:text-9xl" />
        </section>

        {/* ─── Header size ─── */}
        <section className="flex flex-col gap-4">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Long form / header size
          </p>
          <BrandMark className="text-2xl sm:text-3xl" />
        </section>

        {/* ─── Inline body ─── */}
        <section className="flex flex-col gap-4">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Long form / inline body
          </p>
          <BrandMark className="text-base" />
        </section>

        {/* ─── Short form ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Short form / display
          </p>
          <BrandMark variant="short" className="text-6xl leading-none sm:text-8xl" />
        </section>

        {/* ─── Arrow vocabulary — 4 authorised ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Arrow vocabulary — 4 autorisées
          </p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {ARROWS.map(a => (
              <div
                key={a.code}
                className="border-border bg-surface rounded-card flex flex-col gap-3 border p-6"
              >
                <p className="font-mono text-6xl leading-none font-bold">{a.glyph}</p>
                <p className="font-mono text-xs tracking-wider">{a.code}</p>
                <p className="text-muted text-xs leading-tight">{a.usage}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Forbidden variants ─── */}
        <section className="flex flex-col gap-6">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            INTERDIT — jamais substituer ↗
          </p>
          <div className="border-danger/40 bg-danger/5 rounded-card grid grid-cols-2 gap-4 border p-6 sm:grid-cols-4">
            {FORBIDDEN.map(f => (
              <div key={f.code} className="flex flex-col items-start gap-2">
                <p className="font-mono text-4xl leading-none font-bold line-through opacity-60">
                  {f.glyph}
                </p>
                <p className="font-mono text-[10px] tracking-wider">{f.code}</p>
                <p className="text-muted text-[10px] leading-tight">{f.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Spec sheet ─── */}
        <section className="flex flex-col gap-4">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">Spec</p>
          <ul className="font-mono text-sm leading-relaxed">
            <li>
              Component : <span className="font-bold">&lt;BrandMark /&gt;</span> (never hand-roll)
            </li>
            <li>
              Font : <span className="font-bold">Geist Mono Variable</span>
            </li>
            <li>
              Weight : <span className="font-semibold">600</span> (font-semibold — validé
              pixel-perfect 2026-05-12)
            </li>
            <li>
              Case : <span className="font-bold">UPPERCASE</span>
            </li>
            <li>
              Arrow : <span className="font-bold">↗ U+2197 (Unicode character, never SVG)</span>
            </li>
            <li>
              Arrow offset : <span className="font-semibold">translateY(-0.09em)</span> — cap-height
              align
            </li>
            <li>
              Spacing : <span className="font-bold">aucun espace autour de ↗</span>
            </li>
          </ul>
        </section>

        <p className="text-muted font-sans text-xs">
          Reference : .claude/memory/decisions/2026-05-12-brand-identity-saw-next.md
        </p>
      </div>
    </main>
  );
}
