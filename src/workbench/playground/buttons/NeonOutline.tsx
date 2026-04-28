/** Luxe technical — thin accent outline, neon-like soft glow ring on hover. */
export function NeonOutline() {
  return (
    <button
      type="button"
      className="border-accent text-accent-text focus-visible:ring-accent focus-visible:ring-offset-bg duration-base inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-semibold tracking-[0.15em] uppercase transition-shadow hover:shadow-[0_0_24px_color-mix(in_srgb,var(--color-accent)_35%,transparent),inset_0_0_0_1px_var(--color-accent)] focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Activer
    </button>
  );
}
