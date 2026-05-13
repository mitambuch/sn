// ═══════════════════════════════════════════════════
// OtpInput — N-box code input (like 2FA / WhatsApp validation)
//
// WHAT: Renders `length` square boxes, each accepting one alphanumeric
//       character. Auto-focuses the next box on input, jumps back on
//       Backspace, accepts full-string paste in any box (fills all),
//       and uppercases everything (alphabet is case-insensitive).
//       Calls onComplete(value) once every box is filled.
// WHEN: /exemple share-code entry, AccessRequestModal code mode, any
//       other place a short validation code must be typed in.
// CHANGE STYLE: edit boxBase / boxFocus classes ; sizing via `length`.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';
import {
  type ClipboardEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface OtpInputProps {
  /** Number of boxes. Defaults to 6 (share-code length). */
  length?: number;
  /** Allowed characters — case is normalised to upper. Default = alphanumeric. */
  pattern?: RegExp;
  /** Called once every box is filled. Receives the normalised string. */
  onComplete?: (value: string) => void;
  /** Called on every change with the current (possibly partial) value. */
  onChange?: (value: string) => void;
  /** Imperative initial value (uppercased + truncated to length). */
  initialValue?: string;
  /** Disable all inputs (during submit). */
  disabled?: boolean;
  /** Visual variant — "default" or "danger" (after a failed attempt). */
  variant?: 'default' | 'danger';
  /** Aria label for the group of inputs. */
  ariaLabel?: string;
}

const DEFAULT_PATTERN = /^[A-Z0-9]$/i;

export const OtpInput = ({
  length = 6,
  pattern = DEFAULT_PATTERN,
  onComplete,
  onChange,
  initialValue = '',
  disabled = false,
  variant = 'default',
  ariaLabel = 'Code de validation',
}: OtpInputProps) => {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [chars, setChars] = useState<string[]>(() => {
    const seed = initialValue.toUpperCase().slice(0, length).split('');
    return Array.from({ length }, (_, i) => seed[i] ?? '');
  });

  const value = useMemo(() => chars.join(''), [chars]);

  useEffect(() => {
    onChange?.(value);
    if (value.length === length && !value.includes('')) {
      onComplete?.(value);
    }
    // We intentionally exclude onChange/onComplete from deps — they're
    // expected to be stable or change-tolerant from the caller side.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, length]);

  const focusAt = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(i, length - 1));
      refs.current[idx]?.focus();
      refs.current[idx]?.select();
    },
    [length],
  );

  const setCharAt = useCallback((i: number, char: string) => {
    setChars(prev => {
      const next = [...prev];
      next[i] = char;
      return next;
    });
  }, []);

  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLInputElement>, i: number) => {
      if (disabled) return;

      // Navigation
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusAt(i - 1);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusAt(i + 1);
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (chars[i]) {
          setCharAt(i, '');
        } else {
          setCharAt(Math.max(0, i - 1), '');
          focusAt(i - 1);
        }
        return;
      }
      if (e.key === 'Delete') {
        e.preventDefault();
        setCharAt(i, '');
        return;
      }

      // Character entry — strip diacritics first so French spellings like
      // "aperçu" pass (ç → c, é → e, etc.). The user's keypress is
      // tolerated even if their keyboard inserts a combining diacritic.
      if (e.key.length === 1) {
        const stripped = e.key
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toUpperCase();
        if (pattern.test(stripped)) {
          e.preventDefault();
          setCharAt(i, stripped);
          focusAt(i + 1);
        }
      }
    },
    [chars, disabled, focusAt, pattern, setCharAt],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>, i: number) => {
      if (disabled) return;
      const pasted = e.clipboardData
        .getData('text')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toUpperCase();
      // Strip dashes/whitespace + tolerate legacy SAW- prefix
      const cleaned = pasted.replace(/^SAW-/i, '').replace(/[\s-]/g, '');
      if (!cleaned) return;
      e.preventDefault();
      setChars(prev => {
        const next = [...prev];
        let cursor = i;
        for (const ch of cleaned) {
          if (cursor >= length) break;
          if (pattern.test(ch)) {
            next[cursor] = ch;
            cursor++;
          }
        }
        // Defer focus to the last filled cell (or current if nothing landed)
        requestAnimationFrame(() => {
          const lastFilled = Math.min(cursor, length - 1);
          refs.current[lastFilled]?.focus();
          refs.current[lastFilled]?.select();
        });
        return next;
      });
    },
    [disabled, length, pattern],
  );

  const boxBase = cn(
    'h-14 w-12 rounded-lg border text-center font-mono text-2xl font-medium tabular-nums uppercase',
    'duration-base transition-[border-color,background-color,box-shadow]',
    'bg-bg/80 border-border text-fg',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'focus-visible:border-fg/70 focus-visible:ring-fg/20',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'sm:h-16 sm:w-14 sm:text-3xl',
  );

  const dangerBox = 'border-accent/70 ring-1 ring-accent/30';

  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label={ariaLabel}>
      {chars.map((ch, i) => (
        <input
          // OTP boxes are positional — index is the key on purpose.
          key={`otp-${String(i)}`}
          ref={el => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="text"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={1}
          disabled={disabled}
          value={ch}
          onChange={() => {
            /* handled in onKeyDown */
          }}
          onKeyDown={e => {
            handleKey(e, i);
          }}
          onPaste={e => {
            handlePaste(e, i);
          }}
          onFocus={e => {
            e.target.select();
          }}
          aria-label={`Caractère ${String(i + 1)} sur ${String(length)}`}
          className={cn(boxBase, variant === 'danger' && dangerBox)}
        />
      ))}
    </div>
  );
};
