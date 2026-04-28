import { ArrowUpRight } from 'lucide-react';

const PROJECTS = [
  { n: '01', client: 'HDVA', year: '2025', tag: 'Restaurant' },
  { n: '02', client: 'Maison Rivière', year: '2025', tag: 'Éditorial' },
  { n: '03', client: 'Atelier Grise', year: '2024', tag: 'Identité' },
  { n: '04', client: 'Nord Ouest', year: '2024', tag: 'E-commerce' },
];

/** Portfolio-index hero — le hero EST la liste des projets. Lecture immédiate,
 *  pas de chrome superflu. Brutal + éditorial. */
export function PortfolioIndex() {
  return (
    <section className="bg-bg border-border border-b px-6 py-12 md:px-10 md:py-20">
      <div className="mx-auto max-w-400">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4 md:mb-16">
          <h2 className="text-fg text-3xl leading-none font-bold tracking-tighter uppercase md:text-4xl lg:text-5xl">
            Studio
            <br />
            <span className="text-accent-text">/ index 2024—2025</span>
          </h2>
          <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
            04 projets · voir tous →
          </span>
        </div>

        <ul>
          {PROJECTS.map(({ n, client, year, tag }) => (
            <li key={n} className="border-border/60 border-t">
              <a
                href={`#${n}`}
                className="text-fg hover:text-accent-text duration-base group grid grid-cols-[auto_1fr_auto_auto] items-baseline gap-4 py-4 transition-colors md:grid-cols-[auto_1fr_auto_auto_auto] md:py-6"
              >
                <span className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
                  {n}
                </span>
                <span className="text-2xl font-semibold tracking-tight md:text-4xl">{client}</span>
                <span className="text-muted hidden font-mono text-xs tracking-wide uppercase md:inline">
                  {tag}
                </span>
                <span className="text-muted font-mono text-xs tracking-wide uppercase">{year}</span>
                <ArrowUpRight
                  size={20}
                  strokeWidth={1.5}
                  className="text-muted group-hover:text-accent-text transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          ))}
          <li className="border-border/60 border-t border-b" />
        </ul>
      </div>
    </section>
  );
}
