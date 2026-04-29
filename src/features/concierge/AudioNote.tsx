// ═══════════════════════════════════════════════════
// AudioNote — Salvatore's spoken commentary on a catalogue piece
//
// WHAT: Premium signature widget. Bordered surface with avatar
//       (initials), name, "Note vocale" eyebrow, simulated waveform
//       (12 bars), play/pause button, animated progress + duration
//       timer, transcript text below.
// WHY:  no real audio file is bundled in lot B (privacy + size). The
//       play button simulates a deterministic playthrough by ticking
//       the progress over `durationSeconds`. The TRANSCRIPT carries
//       the substance — when lot C plugs an actual file URL we just
//       drop the simulator. The "wow" is the visual + Salvatore's
//       human voice metaphor; transcript ensures accessibility +
//       value capture even for muted users.
// WHEN: Embed in any DetailPage that has Salvatore's commentary.
// EDGE: respects prefers-reduced-motion (waveform stops animating).
// ═══════════════════════════════════════════════════

import { useMediaQuery } from '@hooks/useMediaQuery';
import { cn } from '@utils/cn';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { currentUser } from '@/mocks/users';

interface AudioNoteProps {
  transcript: string;
  /** Total length in seconds — drives the simulated playback. */
  durationSeconds: number;
  className?: string;
}

const WAVEFORM_BARS = 24;
// WHY: deterministic pseudo-waveform — heights derived from a fixed
// hash of the bar index so the visual is stable per render but reads
// "audio-shaped".
const WAVEFORM_HEIGHTS = Array.from({ length: WAVEFORM_BARS }, (_, i) => {
  const phase = (i / WAVEFORM_BARS) * Math.PI * 2;
  return 0.35 + Math.abs(Math.sin(phase * 1.3 + i * 0.6)) * 0.65;
});

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m)}:${String(s).padStart(2, '0')}`;
};

const Initials = ({ name }: { name: string }) => {
  const parts = name.split(' ');
  const initials = (parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '');
  return (
    <span
      aria-hidden="true"
      className="border-border bg-bg text-fg flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs tracking-widest uppercase"
    >
      {initials}
    </span>
  );
};

export const AudioNote = ({ transcript, durationSeconds, className }: AudioNoteProps) => {
  const { t } = useTranslation();
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const startElapsedRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    startTimeRef.current = performance.now();
    startElapsedRef.current = elapsed;

    const tick = () => {
      const dt = (performance.now() - startTimeRef.current) / 1000;
      const next = startElapsedRef.current + dt;
      if (next >= durationSeconds) {
        setElapsed(durationSeconds);
        setPlaying(false);
        return;
      }
      setElapsed(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, durationSeconds]);

  const togglePlay = () => {
    if (elapsed >= durationSeconds) {
      setElapsed(0);
    }
    setPlaying(p => !p);
  };

  const progress = elapsed / durationSeconds;

  return (
    <aside
      className={cn(
        'border-border bg-surface/60 flex flex-col gap-4 rounded-lg border p-6',
        className,
      )}
      aria-label={t('audio.label')}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Initials name={currentUser.conciergeName} />
          <div className="flex flex-col">
            <span className="text-muted text-xs tracking-widest uppercase">
              {t('audio.eyebrow')}
            </span>
            <span className="text-fg text-sm font-medium">{currentUser.conciergeName}</span>
          </div>
        </div>
        <span className="text-muted font-mono text-xs">
          {formatTime(elapsed)} / {formatTime(durationSeconds)}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? t('audio.pause') : t('audio.play')}
          className={cn(
            'border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-accent',
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border',
            'duration-base transition-[border-color,background-color]',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          )}
        >
          {playing ? (
            <Pause size={16} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Play size={16} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
          )}
        </button>

        {/* Waveform — fills left-to-right as elapsed advances */}
        <div className="flex h-8 flex-1 items-end gap-[2px]" aria-hidden="true" role="presentation">
          {WAVEFORM_HEIGHTS.map((h, i) => {
            const barProgress = (i + 1) / WAVEFORM_BARS;
            const filled = barProgress <= progress;
            return (
              <span
                key={i}
                className={cn(
                  'inline-block w-[3px] rounded-sm',
                  filled ? 'bg-fg' : 'bg-fg/20',
                  playing && !reduceMotion && filled && 'motion-safe:animate-pulse',
                )}
                style={{ height: `${String(h * 100)}%` }}
              />
            );
          })}
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed italic">«&nbsp;{transcript}&nbsp;»</p>
    </aside>
  );
};
