// ═══════════════════════════════════════════════════
// LoaderShowcase — démo isolée de l'animation SAW NEXT loader
//
// WHAT: Page transit pour archiver et présenter le composant Loader
//       extrait de la branche feat/landing-mvp (abandonnée). Le loader
//       monte en plein écran : stroke-draw du wordmark (4s), fill du
//       contour (1.8s), CTA "Entrer". Quand l'utilisateur entre,
//       l'overlay se lève (scale + blur + fade) et révèle ce panneau
//       explicatif. Bouton "Rejouer" remonte le Loader via un key.
// WHEN: Ouvrir /loader. Sert à la session parallèle pour décider si
//       on intègre cette animation dans la landing v0.6 actuelle.
// CHANGE TIMING: éditer DRAW_MS/HOLD_MS/FILL_MS/EXIT_MS dans Loader.tsx
// CHANGE WORDMARK: éditer les PATHS/POLYGONS dans WordmarkStroke.tsx
// ═══════════════════════════════════════════════════

import { Loader } from '@features/landing/Loader/Loader';
import { useState } from 'react';

export default function LoaderShowcase() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <main className="bg-bg text-fg min-h-screen px-6 py-16 sm:px-12 sm:py-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-12">
        <header className="flex flex-col gap-4">
          <p className="text-muted font-mono text-xs tracking-widest uppercase">
            Archive · branche feat/landing-mvp
          </p>
          <h1 className="font-mono text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
            Loader SAW NEXT — extrait du PC parallèle
          </h1>
          <p className="text-muted max-w-2xl text-base leading-relaxed text-pretty">
            Animation en deux temps : le wordmark se dessine au trait (stroke-dashoffset 1 → 0 sur
            4s, ease cubique), puis le contour se remplit en aplat (fill-opacity 0 → 1 sur 1.8s).
            Une fois posé, un CTA &laquo;&nbsp;Entrer&nbsp;&raquo; apparaît. Au clic, l&apos;overlay
            s&apos;envole (scale 1.05, blur 10px, opacity 0 sur 1.4s) et révèle la page underneath.
          </p>
        </header>

        <section className="border-border bg-surface rounded-card flex flex-col gap-3 border p-6">
          <h2 className="font-mono text-xs tracking-widest uppercase">
            À l&apos;attention de la session parallèle
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            Ce composant est le seul artefact qu&apos;on garde de la branche{' '}
            <code className="font-mono">feat/landing-mvp</code> (le reste — typewriter hero, header
            overlay, sections Equipe/Expertise/Méthode/Positionnement — est obsolète, on tient la
            base v0.6 sur main). Décide si on l&apos;intègre tel quel sur la landing actuelle
            (par-dessus l&apos;`AppLayout` au premier paint), ou si on l&apos;adapte (timings,
            palette, wordmark différent).
          </p>
          <p className="text-muted text-sm leading-relaxed">
            Fichiers&nbsp;:{' '}
            <code className="font-mono">src/features/landing/Loader/Loader.tsx</code> et{' '}
            <code className="font-mono">WordmarkStroke.tsx</code>. Pas de dépendance lourde (lucide
            + cn + tokens de design standard).
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-xs tracking-widest uppercase">Contrôles</h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setReplayKey(k => k + 1)}
              className="border-fg bg-fg text-bg hover:bg-fg/90 inline-flex items-center gap-3 rounded-full border px-6 py-3 font-mono text-xs tracking-widest uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              Rejouer l&apos;animation
            </button>
          </div>
          <p className="text-muted font-mono text-[10px] tracking-widest uppercase">
            Replay #{replayKey}
          </p>
        </section>
      </div>

      <Loader key={replayKey} />
    </main>
  );
}
