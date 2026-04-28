/** Playful loader — 2 orbes qui orbitent autour d'un centre. Signature. */
export function OrbitOrbs() {
  return (
    <div role="status" aria-label="Loading" className="relative h-10 w-10">
      <span
        className="absolute inset-0 block motion-safe:animate-spin"
        style={{ animationDuration: '1200ms' }}
        aria-hidden
      >
        <span className="bg-accent absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" />
        <span className="bg-accent-text absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full" />
      </span>
    </div>
  );
}
