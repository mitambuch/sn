/** Product loader — barre horizontale avec segment qui traverse (indeterminate). */
export function ProgressBar() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="bg-surface relative h-1 w-48 overflow-hidden rounded-full"
    >
      <span
        className="bg-accent absolute inset-y-0 w-1/3 rounded-full motion-safe:animate-[progress-sweep_1.4s_ease-in-out_infinite]"
        aria-hidden
      />
    </div>
  );
}
