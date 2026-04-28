/** Technical loader — 5 barres verticales qui pulsent comme un VU-mètre. */
export function BarsEqualizer() {
  return (
    <div role="status" aria-label="Loading" className="flex h-8 items-end gap-1">
      {[0, 1, 2, 3, 4].map(i => (
        <span
          key={i}
          className="bg-accent inline-block w-1 rounded-sm motion-safe:animate-[equalizer_900ms_ease-in-out_infinite]"
          style={{
            animationDelay: `${i * 120}ms`,
            height: '100%',
          }}
          aria-hidden
        />
      ))}
    </div>
  );
}
