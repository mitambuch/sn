import { useLocale } from '@app/LocaleProvider';
import { Logomark } from '@components/ui/Logomark';
import { ROUTES } from '@constants/routes';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONTACT = {
  phoneDisplay: '+41 78 749 81 70',
  phoneRaw: '+41787498170',
  email: 'info@saw-next.ch',
  whatsappUrl:
    'https://wa.me/41787498170?text=' +
    encodeURIComponent('Bonjour Salvatore, je souhaiterais entrer en contact avec SAW Next.'),
};

interface Channel {
  label: string;
  value: string;
  href: string;
  external: boolean;
}

const CHANNELS: Channel[] = [
  {
    label: 'Téléphone',
    value: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phoneRaw}`,
    external: false,
  },
  {
    label: 'Email',
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

const SUBTITLE = 'Réponse confidentielle, sous 24 heures ouvrées.';
const COPYRIGHT = '© 2026 SAW NEXT · SUISSE · Jamais intermédiaire financier';

export const LandingFooter = () => {
  const { localePath } = useLocale();

  return (
    <footer
      id="contact"
      className="relative z-10 w-full scroll-mt-24 overflow-hidden pt-24 pb-10 md:scroll-mt-28 md:pt-32 md:pb-12"
    >
      <div className="relative mx-auto w-full max-w-400 px-5 md:px-6">
        <div className="flex items-center gap-4">
          <p className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
            <span className="text-fg/30">06 / </span>CONTACT
          </p>
          <span className="bg-fg/20 hidden h-px w-16 md:block" aria-hidden="true" />
        </div>

        <h2 className="text-fg mt-5 max-w-3xl font-mono text-2xl leading-[1.08] font-semibold tracking-tight uppercase md:mt-6 md:text-4xl lg:text-5xl">
          Chaque expérience commence
          <br />
          par une conversation.
        </h2>

        <p className="text-muted mt-5 max-w-md text-base leading-relaxed">{SUBTITLE}</p>

        <ul className="border-fg/15 mt-12 border-t md:mt-16">
          {CHANNELS.map((channel, index) => (
            <li key={channel.label} className="border-fg/15 border-b">
              <a
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noopener noreferrer' : undefined}
                className="hover:bg-fg/[0.03] group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 transition-colors duration-200 md:grid-cols-[4rem_minmax(9rem,12rem)_1fr_auto] md:gap-6 md:py-6"
              >
                <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase tabular-nums">
                  0{index + 1}
                </span>
                <span className="text-muted hidden font-mono text-[10px] font-semibold tracking-[0.35em] uppercase md:inline">
                  {channel.label}
                </span>
                <span className="text-fg font-mono text-base font-semibold tracking-tight md:text-lg">
                  <span className="text-muted mr-3 md:hidden">{channel.label} —</span>
                  {channel.value}
                </span>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="text-fg/30 group-hover:text-fg transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="border-fg/10 mt-16 flex flex-col items-start justify-between gap-6 border-t pt-6 md:flex-row md:items-center md:gap-10 md:pt-8">
          <div className="flex items-center gap-6">
            <Logomark className="text-fg/80 h-5 w-auto" />
            <p className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
              {COPYRIGHT}
            </p>
          </div>
          <Link
            to={localePath(ROUTES.LOGIN)}
            className="text-muted hover:text-fg group inline-flex items-center gap-3 font-mono text-[10px] font-semibold tracking-[0.32em] uppercase transition-colors duration-200"
          >
            <span>Espace client</span>
            <ArrowUpRight
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};
