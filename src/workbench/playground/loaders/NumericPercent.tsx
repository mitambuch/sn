import { useEffect, useState } from 'react';

/** Technical loader — gros chiffre qui tique de 0 à 99%. Réinitialise en boucle.
 *  Utile pour les processus longs où tu veux "donner du feedback de progrès
 *  simulé". Affichage uniquement, pas lié à une vraie progression. */
export function NumericPercent() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN(v => (v >= 99 ? 0 : v + 1)), 45);
    return () => clearInterval(id);
  }, []);
  return (
    <div role="status" aria-label={`Loading — ${n} percent`} className="flex items-baseline gap-1">
      <span className="text-fg font-mono text-4xl font-bold tracking-tighter tabular-nums">
        {String(n).padStart(2, '0')}
      </span>
      <span className="text-accent-text font-mono text-lg font-bold">%</span>
    </div>
  );
}
