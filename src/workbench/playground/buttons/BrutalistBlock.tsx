/** Brutalist — thick raw border, no radius, heavy uppercase. */
export function BrutalistBlock() {
  return (
    <button
      type="button"
      className="border-fg text-fg hover:bg-fg hover:text-bg duration-base focus-visible:outline-fg inline-flex items-center justify-center border-2 px-6 py-3 text-sm font-black tracking-widest uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-x-0.5 active:translate-y-0.5"
    >
      Engage
    </button>
  );
}
