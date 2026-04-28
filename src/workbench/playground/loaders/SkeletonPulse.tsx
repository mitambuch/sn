/** Minimal loader — skeleton lines animées, placeholder content durant le fetch. */
export function SkeletonPulse() {
  return (
    <div role="status" aria-label="Loading" className="flex w-56 flex-col gap-2">
      <span className="bg-surface h-3 w-3/4 rounded-sm motion-safe:animate-pulse" aria-hidden />
      <span className="bg-surface h-3 w-full rounded-sm motion-safe:animate-pulse" aria-hidden />
      <span className="bg-surface h-3 w-5/6 rounded-sm motion-safe:animate-pulse" aria-hidden />
    </div>
  );
}
