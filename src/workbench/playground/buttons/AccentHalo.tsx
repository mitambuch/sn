/** Playful — soft accent halo expands on hover. */
export function AccentHalo() {
  return (
    <button
      type="button"
      className="bg-accent text-on-accent focus-visible:ring-accent duration-base focus-visible:ring-offset-bg inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-shadow hover:shadow-[0_0_0_8px_color-mix(in_srgb,var(--color-accent)_22%,transparent)] focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Inscris-toi
    </button>
  );
}
