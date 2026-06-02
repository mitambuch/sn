// ═══════════════════════════════════════════════════
// TimeInput — native clock picker for a string field
//
// WHAT: Renders a `<input type="time">` (HH:MM, 24h) for a Sanity string
//       field, so editors PICK an hour instead of typing free text. Value
//       is stored as a plain "HH:MM" string (e.g. "10:15").
// WHEN: Registered via `components.input` on programmeStep.time so the
//       "Déroulé de la soirée" hour is a real selector — prevents a title
//       from being typed into the hour field.
// ═══════════════════════════════════════════════════

import { TextInput } from '@sanity/ui';
import { type FormEvent, useCallback } from 'react';
import { set, type StringInputProps, unset } from 'sanity';

export function TimeInput(props: StringInputProps) {
  const { value, onChange, elementProps } = props;

  const handleChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const next = event.currentTarget.value;
      onChange(next ? set(next) : unset());
    },
    [onChange],
  );

  return <TextInput {...elementProps} type="time" value={value ?? ''} onChange={handleChange} />;
}
