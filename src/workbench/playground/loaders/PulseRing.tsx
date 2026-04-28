/** Minimal loader — cercle qui pulse avec halo expanding. */
export function PulseRing() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="relative flex h-8 w-8 items-center justify-center"
    >
      <span
        className="bg-accent/20 absolute inline-flex h-full w-full rounded-full motion-safe:animate-ping"
        aria-hidden
      />
      <span className="bg-accent relative inline-flex h-4 w-4 rounded-full" aria-hidden />
    </div>
  );
}
