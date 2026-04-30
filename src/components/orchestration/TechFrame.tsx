// ═══════════════════════════════════════════════════
// TechFrame — angular corner markers + act numbering overlay
//
// WHAT: Renders 4 thin angular corner markers (┌ ┐ └ ┘) + a
//       compact act-id strip top-left (eg. `001 · LOADER · SUISSE`).
//       Sits absolute inside an act's relative wrapper, decorative
//       (aria-hidden), pointer-events-none.
// WHEN: Inside any act that wants the technical signature framing.
// CHANGE MARKER SIZE: prop `cornerSize` (default 32 px).
// CHANGE STRIP: pass children custom; default uses `index` + `label`.
// ═══════════════════════════════════════════════════

import { cn } from '@utils/cn';

interface TechFrameProps {
  /** Act index zero-padded (eg. "001"). */
  index: string;
  /** Section label uppercase (eg. "POSITIONNEMENT"). */
  label: string;
  /** Optional 3rd token (default "SUISSE"). */
  scope?: string;
  /** Marker size in px. Default 32. */
  cornerSize?: number;
  className?: string;
}

const Corner = ({ side, size }: { side: 'tl' | 'tr' | 'bl' | 'br'; size: number }) => {
  const common = 'absolute pointer-events-none';
  const styles: Record<typeof side, string> = {
    tl: 'top-4 left-4 border-t border-l',
    tr: 'top-4 right-4 border-t border-r',
    bl: 'bottom-4 left-4 border-b border-l',
    br: 'bottom-4 right-4 border-b border-r',
  };
  return (
    <span
      aria-hidden="true"
      className={cn(
        common,
        styles[side],
        'border-[#1a1a1a]/35 md:top-8 md:right-8 md:bottom-8 md:left-8',
      )}
      style={{ width: size, height: size }}
    />
  );
};

export const TechFrame = ({
  index,
  label,
  scope = 'SUISSE',
  cornerSize = 32,
  className,
}: TechFrameProps) => {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 z-10', className)}>
      <Corner side="tl" size={cornerSize} />
      <Corner side="tr" size={cornerSize} />
      <Corner side="bl" size={cornerSize} />
      <Corner side="br" size={cornerSize} />

      {/* Act ID strip — top-left */}
      <div className="absolute top-6 left-6 flex items-center gap-3 font-mono text-[10px] font-semibold tracking-[0.4em] text-[#1a1a1a]/70 uppercase md:top-12 md:left-12">
        <span className="text-[#1a1a1a]/35">{index}</span>
        <span className="block h-px w-6 bg-[#1a1a1a]/35" />
        <span>{label}</span>
        <span className="text-[#1a1a1a]/35">·</span>
        <span className="text-[#1a1a1a]/50">{scope}</span>
      </div>
    </div>
  );
};
