/** Playful loader — 3 dots rebondissent en séquence. */
export function DotsBounce() {
  return (
    <div role="status" aria-label="Loading" className="flex items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="bg-accent h-2 w-2 rounded-full motion-safe:animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
          aria-hidden
        />
      ))}
    </div>
  );
}
