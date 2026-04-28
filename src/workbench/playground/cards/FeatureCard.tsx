import { Zap } from 'lucide-react';

/** Feature card — icône + titre + description. Pour grilles "features" de landing. */
export function FeatureCard() {
  return (
    <article className="border-border/60 bg-surface/30 w-full max-w-sm rounded-xl border p-5 md:p-6">
      <div className="bg-accent/15 text-accent-text inline-flex h-10 w-10 items-center justify-center rounded-lg">
        <Zap size={18} strokeWidth={2} />
      </div>
      <h4 className="text-fg mt-4 text-lg font-semibold tracking-tight md:text-xl">
        Temps de build divisé par 3
      </h4>
      <p className="text-muted mt-2 text-sm leading-relaxed">
        Cache intelligent qui réutilise les artefacts entre builds. Plus d'attente, plus de feedback
        immédiat sur chaque push.
      </p>
      <ul className="mt-4 space-y-1.5">
        {['Cache partagé équipe', 'Invalidation sélective', 'Zero-config'].map(item => (
          <li key={item} className="text-muted flex items-start gap-2 text-sm">
            <span className="bg-accent-text mt-1.5 h-1 w-1 rounded-full" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
