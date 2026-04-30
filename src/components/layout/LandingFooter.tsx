import { useLocale } from '@app/LocaleProvider';
import { Logomark } from '@components/ui/Logomark';
import { ROUTES } from '@constants/routes';
import { cn } from '@utils/cn';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONTACT = {
  phoneDisplay: '+41 78 749 81 70',
  phoneRaw: '+41787498170',
  email: 'info@saw-next.ch',
  whatsappUrl:
    'https://wa.me/41787498170?text=' +
    encodeURIComponent('Bonjour Salvatore, je souhaiterais entrer en contact avec SAW Next.'),
};

interface ContactCTA {
  label: string;
  value: string;
  href: string;
  external: boolean;
  primary?: boolean;
}

const CTAS: ContactCTA[] = [
  {
    label: 'Appeler',
    value: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phoneRaw}`,
    external: false,
    primary: true,
  },
  {
    label: 'Écrire',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    external: false,
  },
  {
    label: 'WhatsApp',
    value: 'Message pré-rédigé',
    href: CONTACT.whatsappUrl,
    external: true,
  },
];

const LEGAL = [
  { label: 'Mentions légales', href: '#' },
  { label: 'Confidentialité', href: '#' },
  { label: 'CGU', href: '#' },
  { label: 'Cookies', href: '#' },
];

const SUBTITLE = 'Réponse confidentielle, sous 24 heures ouvrées.';
const COPYRIGHT = '© 2026 SAW NEXT · CONCIERGERIE PRIVÉE · SUISSE';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const LandingFooter = () => {
  const { localePath } = useLocale();

  return (
    <footer
      id="contact"
      className="relative z-10 w-full scroll-mt-24 overflow-hidden pt-24 pb-10 md:scroll-mt-28 md:pt-32 md:pb-12"
    >
      <div className="relative mx-auto w-full max-w-400 px-5 md:px-6">
        <div className="flex items-center gap-4">
          <p className="text-fg font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
            <span className="text-fg/30">06 / </span>CONTACT
          </p>
          <span className="bg-fg/30 hidden h-px w-16 md:block" aria-hidden="true" />
        </div>

        <h2 className="text-fg mt-5 max-w-3xl font-mono text-2xl leading-[1.08] font-semibold tracking-tight uppercase md:mt-6 md:text-4xl lg:text-5xl">
          Chaque expérience commence
          <br />
          par une conversation.
        </h2>

        <p className="text-fg mt-5 max-w-md text-base leading-relaxed">{SUBTITLE}</p>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {CTAS.map((cta, index) => (
            <a
              key={cta.label}
              href={cta.href}
              target={cta.external ? '_blank' : undefined}
              rel={cta.external ? 'noopener noreferrer' : undefined}
              className={cn(
                'group focus-visible:ring-fg/30 relative flex min-h-36 flex-col justify-between rounded-sm border p-6 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none md:p-7',
                cta.primary
                  ? 'border-fg bg-fg text-bg hover:bg-fg/92'
                  : 'border-fg text-fg hover:bg-fg hover:text-bg',
              )}
            >
              <span className="font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
                0{index + 1} / {cta.label}
              </span>
              <div className="mt-8 flex items-end justify-between gap-4">
                <span className="font-mono text-base leading-tight font-semibold tracking-tight md:text-lg">
                  {cta.value}
                </span>
                <ArrowUpRight
                  size={20}
                  strokeWidth={1.6}
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </a>
          ))}
        </div>

        <Link
          to={localePath(ROUTES.LOGIN)}
          className="border-fg bg-fg text-bg group focus-visible:ring-fg/30 mt-5 grid grid-cols-1 gap-8 rounded-sm border p-7 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none md:mt-6 md:grid-cols-[1fr_auto] md:items-end md:gap-10 md:p-9"
        >
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
              Espace client
            </span>
            <span className="font-mono text-2xl leading-[1.05] font-semibold tracking-tight uppercase md:text-4xl lg:text-5xl">
              Déjà client ?
              <br />
              Accédez à votre dossier privé.
            </span>
            <span className="mt-3 max-w-md text-base leading-relaxed md:mt-4">
              Correspondances, suivi des demandes en cours, documents partagés — tout au même
              endroit, en stricte confidentialité.
            </span>
          </div>
          <span className="border-bg/30 group-hover:border-bg group-hover:bg-bg group-hover:text-fg inline-flex items-center justify-between gap-4 rounded-sm border px-6 py-4 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase transition-colors duration-200 md:min-w-56 md:justify-center md:gap-3">
            <span>Se connecter</span>
            <ArrowUpRight
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </Link>

        <div className="border-fg/20 mt-20 flex flex-col gap-6 border-t pt-8 md:mt-28 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-8">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Retour en haut de page"
            className="text-fg focus-visible:ring-fg/30 group inline-flex items-center gap-4 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            <Logomark className="h-5 w-auto transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="text-fg font-mono text-[10px] tracking-[0.4em] uppercase">
              {COPYRIGHT}
            </span>
          </button>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] font-semibold tracking-[0.32em] uppercase md:gap-x-6">
            {LEGAL.map((item, index) => (
              <li key={item.label} className="flex items-center gap-x-5 md:gap-x-6">
                <a
                  href={item.href}
                  className="text-fg focus-visible:ring-fg/30 rounded-sm underline-offset-4 transition-[text-decoration] duration-200 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  {item.label}
                </a>
                {index < LEGAL.length - 1 && (
                  <span aria-hidden="true" className="text-fg/30">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={scrollToTop}
            className="border-fg text-fg hover:bg-fg hover:text-bg focus-visible:ring-fg/30 group inline-flex items-center gap-3 rounded-sm border px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.32em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            <ArrowUp
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
            <span>Haut de page</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
