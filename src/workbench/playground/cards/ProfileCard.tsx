import { ArrowUpRight, Mail } from 'lucide-react';

/** Profile card — avatar + name + role + CTA. Pour team / contact blocks. */
export function ProfileCard() {
  return (
    <article className="border-border/60 bg-surface/40 group w-full max-w-sm rounded-xl border p-5 md:p-6">
      <div className="flex items-center gap-4">
        <div className="border-border/60 from-accent/30 to-bg flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-gradient-to-br">
          <span className="text-fg font-semibold">JM</span>
        </div>
        <div className="min-w-0">
          <h4 className="text-fg truncate text-base font-semibold tracking-tight">Julie Mercier</h4>
          <p className="text-muted truncate text-sm">Photographe · Lausanne</p>
        </div>
      </div>
      <p className="text-muted mt-4 text-sm leading-relaxed">
        Portraits, paysages, travaux commissionnés. Disponible dès juin 2026 pour de nouveaux
        projets éditoriaux.
      </p>
      <div className="mt-5 flex items-center justify-between">
        <a
          href="#contact"
          className="text-muted hover:text-accent-text duration-base inline-flex items-center gap-1.5 text-sm"
        >
          <Mail size={14} strokeWidth={2} />
          Contacter
        </a>
        <a
          href="#profile"
          className="text-fg hover:text-accent-text duration-base inline-flex items-center gap-1 text-sm font-semibold tracking-tight"
        >
          Voir le profil
          <ArrowUpRight
            size={14}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </article>
  );
}
