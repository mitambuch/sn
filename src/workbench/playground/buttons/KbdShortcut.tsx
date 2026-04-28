/** Product — button with a keyboard shortcut chip on the right. Useful for
 *  search / command / submit flows on design-tool-like interfaces. */
export function KbdShortcut() {
  return (
    <button
      type="button"
      className="border-border/60 bg-surface/60 text-fg hover:border-accent/50 focus-visible:ring-accent focus-visible:ring-offset-bg duration-base inline-flex items-center gap-3 rounded-lg border px-4 py-2 text-sm font-medium tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Search the site
      <span className="border-border/70 bg-bg text-muted inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 font-mono text-[10px] tracking-wider">
        <span>⌘</span>
        <span>K</span>
      </span>
    </button>
  );
}
