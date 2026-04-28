import { Section, TypeRow } from '../shared';

/** Full type specimen — every nameable style in the system. Full-width section.
 *  Respects : WCAG 2.1 AA (contrast via audited tokens, line-height ≥ 1.5 on
 *  body, mobile text ≥ 14 px except uppercase+tracked utility labels), minimum
 *  body 16 px (body-lg 18→20 px for design-forward sites), modular scale
 *  ratios 1.2-1.33, responsive mobile→desktop via `md:`/`lg:`. Fonts from the
 *  starter pack (Space Grotesk + JetBrains Mono) ; swap the two
 *  `--font-family-*` tokens in `src/index.css` `@theme` to change on a new
 *  project. */
export function TypographySection() {
  return (
    <Section number="01" title="typography">
      <p className="text-muted mb-6 max-w-2xl text-sm leading-relaxed md:text-base">
        Vingt-deux styles nommés, copiables directement dans le JSX. Tous basés sur les deux polices
        chargées dans <span className="font-mono text-xs">src/index.css</span> :{' '}
        <span className="font-mono text-xs">Space Grotesk</span> (sans) et{' '}
        <span className="font-mono text-xs">JetBrains Mono</span>. Pour swap sur un nouveau projet :
        remplace les deux <span className="font-mono text-xs">--font-family-*</span> dans le bloc{' '}
        <span className="font-mono text-xs">@theme</span>, tout le reste suit.
      </p>

      {/* Norm legend */}
      <ul className="border-border/50 bg-surface/30 mb-10 grid gap-2 rounded-lg border px-4 py-3 text-[11px] leading-relaxed md:grid-cols-2 md:text-xs">
        <li className="text-muted">
          <span className="text-accent-text font-mono tracking-wider uppercase">AA</span> contrast
          audité sur tous les tokens (dark + light).
        </li>
        <li className="text-muted">
          <span className="text-accent-text font-mono tracking-wider uppercase">≥ 14 px</span> sur
          mobile pour tout texte lu ; utility (eyebrow / metadata / micro) en 10-12 px uniquement
          quand uppercase + tracked.
        </li>
        <li className="text-muted">
          <span className="text-accent-text font-mono tracking-wider uppercase">1.5+</span>{' '}
          line-height sur body (WCAG 2.1 SC 1.4.12).
        </li>
        <li className="text-muted">
          <span className="text-accent-text font-mono tracking-wider uppercase">45-75</span>{' '}
          caractères par ligne sur body — contraindre via{' '}
          <span className="font-mono">max-w-prose</span>.
        </li>
      </ul>

      {/* ─── Display ─────────────────────────────────── */}
      <h3 className="text-fg mt-4 mb-5 font-mono text-[11px] tracking-[0.3em] uppercase">
        · display
      </h3>
      <div className="space-y-4">
        <TypeRow
          id="display-xl"
          classes="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none"
          size="60 → 96 px"
          color="text-fg"
          lineHeight="1.0"
        >
          Forme & rigueur.
        </TypeRow>
        <TypeRow
          id="display"
          classes="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          size="48 → 72 px"
          color="text-fg"
          lineHeight="1.05"
        >
          Titres de hero standards.
        </TypeRow>
        <TypeRow
          id="display-sm"
          classes="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]"
          size="36 → 48 px"
          color="text-fg"
          lineHeight="1.1"
        >
          Sous-hero ou page d'entrée.
        </TypeRow>
      </div>

      {/* ─── Headings ─────────────────────────────────── */}
      <h3 className="text-fg mt-12 mb-5 font-mono text-[11px] tracking-[0.3em] uppercase">
        · headings
      </h3>
      <div className="space-y-4">
        <TypeRow
          id="h1"
          classes="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight"
          size="30 → 48 px"
          color="text-fg"
          lineHeight="1.25"
        >
          Titre principal de page.
        </TypeRow>
        <TypeRow
          id="h2"
          classes="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight"
          size="24 → 36 px"
          color="text-fg"
          lineHeight="1.25"
        >
          Titre de section majeure.
        </TypeRow>
        <TypeRow
          id="h3"
          classes="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight leading-snug"
          size="20 → 30 px"
          color="text-fg"
          lineHeight="1.375"
        >
          Sous-section, bloc thématique.
        </TypeRow>
        <TypeRow
          id="h4"
          classes="text-lg md:text-xl font-medium tracking-tight leading-snug"
          size="18 → 20 px"
          color="text-fg"
          lineHeight="1.375"
        >
          Titre de carte ou bloc court.
        </TypeRow>
        <TypeRow
          id="h5"
          classes="text-base md:text-lg font-medium leading-normal"
          size="16 → 18 px"
          color="text-fg"
          lineHeight="1.5"
        >
          Étiquette de bloc secondaire.
        </TypeRow>
        <TypeRow
          id="h6"
          classes="text-sm font-semibold uppercase tracking-wider leading-normal"
          size="14 px"
          color="text-fg"
          lineHeight="1.5"
        >
          Micro-titre utilitaire.
        </TypeRow>
      </div>

      {/* ─── Body ─────────────────────────────────── */}
      <h3 className="text-fg mt-12 mb-5 font-mono text-[11px] tracking-[0.3em] uppercase">
        · body
      </h3>
      <div className="space-y-4">
        <TypeRow
          id="lead"
          classes="text-muted text-lg md:text-xl leading-relaxed"
          size="18 → 20 px"
          color="text-muted"
          lineHeight="1.625"
        >
          Paragraphe d'introduction, plus grand et aéré pour accrocher dès la première phrase.
        </TypeRow>
        <TypeRow
          id="body-lg"
          classes="text-fg text-lg md:text-xl leading-relaxed"
          size="18 → 20 px"
          color="text-fg"
          lineHeight="1.625"
        >
          Body généreux pour sites design-forward — éditorial, portfolio, artisans. Lecture
          confortable, présence typographique marquée. Utilise cette taille quand le contenu doit
          respirer et que la mise en page est peu dense.
        </TypeRow>
        <TypeRow
          id="body"
          classes="text-fg text-base leading-relaxed"
          size="16 px"
          color="text-fg"
          lineHeight="1.625"
        >
          Texte courant standard — sites produit, documentation, contenus éditoriaux. Respecte WCAG
          AA (16 px minimum pour body), interligne 1.625 pour lisibilité prolongée.
        </TypeRow>
        <TypeRow
          id="body-sm"
          classes="text-muted text-sm leading-relaxed"
          size="14 px"
          color="text-muted"
          lineHeight="1.625"
        >
          Texte secondaire, légendes longues, notes de bas de bloc, contenu accessoire. 14 px =
          minimum acceptable sur mobile ; à ne pas utiliser pour du body principal.
        </TypeRow>
        <TypeRow
          id="quote"
          classes="text-fg text-xl md:text-2xl leading-snug italic font-medium"
          size="20 → 24 px"
          color="text-fg"
          lineHeight="1.375"
        >
          « Une citation forte, placée en exergue. »
        </TypeRow>
      </div>

      {/* ─── UI ─────────────────────────────────── */}
      <h3 className="text-fg mt-12 mb-5 font-mono text-[11px] tracking-[0.3em] uppercase">· ui</h3>
      <div className="space-y-4">
        <TypeRow
          id="button"
          classes="text-fg text-sm font-semibold tracking-tight leading-none"
          size="14 px"
          color="text-fg"
          lineHeight="1.0"
        >
          Label de bouton
        </TypeRow>
        <TypeRow
          id="label"
          classes="text-fg text-xs font-medium tracking-tight leading-snug"
          size="12 px"
          color="text-fg"
          lineHeight="1.375"
        >
          Libellé de champ formulaire
        </TypeRow>
        <TypeRow
          id="caption"
          classes="text-muted text-xs leading-snug"
          size="12 px"
          color="text-muted"
          lineHeight="1.375"
        >
          Aide contextuelle, message d'erreur, légende brève (max 2 lignes).
        </TypeRow>
        <TypeRow
          id="eyebrow"
          classes="text-accent-text font-mono text-[10px] tracking-[0.2em] uppercase leading-tight"
          size="10 px"
          color="text-accent-text"
          lineHeight="1.25"
        >
          Catégorie / section marker
        </TypeRow>
        <TypeRow
          id="micro"
          classes="text-muted text-[10px] tracking-wide leading-tight"
          size="10 px"
          color="text-muted"
          lineHeight="1.25"
        >
          Métadonnée interface, statut, timestamp.
        </TypeRow>
      </div>

      {/* ─── Mono ─────────────────────────────────── */}
      <h3 className="text-fg mt-12 mb-5 font-mono text-[11px] tracking-[0.3em] uppercase">
        · mono
      </h3>
      <div className="space-y-4">
        <TypeRow
          id="code"
          classes="text-fg font-mono text-sm leading-normal"
          size="14 px"
          color="text-fg"
          lineHeight="1.5"
        >
          const pattern = &#x27;inline-code&#x27;;
        </TypeRow>
        <TypeRow
          id="code-sm"
          classes="text-muted font-mono text-xs leading-normal"
          size="12 px"
          color="text-muted"
          lineHeight="1.5"
        >
          // commentaires techniques, path, slug, meta
        </TypeRow>
        <TypeRow
          id="metadata"
          classes="text-muted font-mono text-[10px] tracking-wider uppercase leading-tight"
          size="10 px"
          color="text-muted"
          lineHeight="1.25"
        >
          0042 · last edited · 2026-04-19
        </TypeRow>
      </div>
    </Section>
  );
}
