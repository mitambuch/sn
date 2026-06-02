// ═══════════════════════════════════════════════════
// PhoneField — international phone input (country flag + format)
//
// WHAT: Wraps react-phone-number-input so the user picks a country and
//       gets live formatting + a validatable E.164 value (e.g.
//       "+41791234567"). Styled to the site tokens (see .sn-phone in
//       src/index.css) — no white system box.
// WHEN: Any phone field in a form. Pair with isValidPhoneNumber from
//       'react-phone-number-input' for validation.
// CHANGE LOOK: edit the .sn-phone rules in src/index.css.
// ═══════════════════════════════════════════════════

import 'react-phone-number-input/style.css';

import { cn } from '@utils/cn';
import { useId } from 'react';
import PhoneInput from 'react-phone-number-input';
// Bundled SVG flags — without this the lib fetches flag images from a CDN,
// which renders as broken-image icons when that CDN is blocked/offline.
import flags from 'react-phone-number-input/flags';

interface PhoneFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
}

/** International phone input with country selector, themed to the site. */
export const PhoneField = ({ label, value, onChange, error, id }: PhoneFieldProps) => {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-fg text-sm font-medium">
        {label}
      </label>
      <PhoneInput
        id={fieldId}
        international
        defaultCountry="CH"
        flags={flags}
        value={value}
        onChange={next => onChange(next ?? '')}
        className={cn('sn-phone', error && 'sn-phone--error')}
      />
      {error && (
        <p className="text-danger-text text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
