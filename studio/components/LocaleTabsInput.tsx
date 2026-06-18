// ═══════════════════════════════════════════════════
// LocaleTabsInput — compact fr/en/es tabs for locale* types
//
// WHAT: Replaces the default stacked multi-field rendering of
//       localeString / localeText / localeRichText with a single
//       compact input showing one language at a time + small
//       language pills at the top (fr/en/es) to switch. Each pill
//       shows a fill-indicator dot (green if the locale has a value,
//       muted otherwise) so the editor can see at a glance what's
//       translated without expanding anything.
// WHEN: Registered via `components.input` on each locale* schema.
// WHY: Stacking FR + EN + ES vertically was taking ~3× the vertical
//       space of a normal field. On a doc with 15 locale fields
//       (typical page), that was pushing everything below the fold.
// ═══════════════════════════════════════════════════

import { useMemo, useState } from 'react';
import { type ObjectInputProps } from 'sanity';

type LocaleId = 'fr' | 'en' | 'es';

const LOCALES: Array<{ id: LocaleId; label: string }> = [
  { id: 'fr', label: 'FR' },
  { id: 'en', label: 'EN' },
  { id: 'es', label: 'ES' },
];

function hasContent(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  // Rich text (Portable Text): array of blocks with at least one non-empty child
  if (Array.isArray(value)) {
    return value.some(
      block =>
        block &&
        typeof block === 'object' &&
        Array.isArray((block as { children?: unknown }).children) &&
        ((block as { children: Array<{ text?: string }> }).children ?? []).some(
          c => (c.text ?? '').trim().length > 0,
        ),
    );
  }
  return Boolean(value);
}

export function LocaleTabsInput(props: ObjectInputProps) {
  const [active, setActive] = useState<LocaleId>('fr');

  const v =
    (props.value as Record<LocaleId, unknown> | undefined) ?? ({} as Record<LocaleId, unknown>);
  const filled: Record<LocaleId, boolean> = {
    fr: hasContent(v.fr),
    en: hasContent(v.en),
    es: hasContent(v.es),
  };

  // Keep only the active locale field; Sanity still processes the others
  // under the hood — they're just hidden from the form UI until the tab
  // is activated.
  const filteredMembers = useMemo(
    () =>
      props.members.filter(m => {
        if (m.kind === 'field') return m.name === active;
        return true;
      }),
    [props.members, active],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* ─── Language pills ─── */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: 2,
          background: 'var(--card-bg-color, rgba(255,255,255,0.04))',
          border: '1px solid var(--card-border-color, rgba(255,255,255,0.08))',
          borderRadius: 8,
          width: 'fit-content',
        }}
      >
        {LOCALES.map(({ id, label }) => {
          const isActive = id === active;
          const isFilled = filled[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              aria-pressed={isActive}
              aria-label={`Switch to ${label}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 6,
                border: 'none',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'background 120ms ease, color 120ms ease',
                background: isActive ? 'var(--card-focus-ring-color, #60a5fa)' : 'transparent',
                color: isActive ? '#0b1220' : 'var(--card-muted-fg-color, #d0d0d0)',
                fontFamily: 'inherit',
              }}
            >
              <span>{label}</span>
              <span
                aria-hidden="true"
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  marginLeft: 1,
                  background: isFilled
                    ? '#4ade80'
                    : isActive
                      ? 'rgba(11,18,32,0.35)'
                      : 'rgba(240,240,240,0.25)',
                  boxShadow: isFilled ? '0 0 4px rgba(74,222,128,0.7)' : 'none',
                }}
              />
            </button>
          );
        })}
      </div>

      {/* ─── Empty non-FR locale → remind the editor this is theirs to fill.
           The client reported translations "blocked"; in reality the EN/ES
           tab was simply empty and FR was showing as fallback on the site.
           This contextual hint makes the expected action explicit. ─── */}
      {active !== 'fr' && !filled[active] && (
        <p
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.5,
            color: 'var(--card-muted-fg-color, #9aa0a6)',
          }}
        >
          Traduction {active.toUpperCase()} vide — le français s’affiche sur le site en attendant.
          Saisissez la traduction dans le champ ci-dessous, puis publiez.
        </p>
      )}

      {/* ─── Active locale field (rendered via renderDefault) ─── */}
      {props.renderDefault({ ...props, members: filteredMembers })}
    </div>
  );
}
