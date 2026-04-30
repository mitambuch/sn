import { useLocale } from '@app/LocaleProvider';
import { Logomark } from '@components/ui/Logomark';
import { WipeButton } from '@components/ui/WipeButton';
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

const CHANNELS = [
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

export const LandingFooter = () => {
  const { localePath } = useLocale();

  return (
    <footer
      id="contact"
      className="relative z-10 w-full scroll-mt-24 overflow-hidden pt-24 pb-10 md:scroll-mt-28 md:pt-32 md:pb-12"
    >
      <div className="landing-grid absolute inset-0 opacity-30" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-400 px-5 md:px-6">
        <p className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
          <span className="text-fg/30">06 / </span>CONTACT
        </p>

        <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-12">
          <h2 className="text-fg font-mono text-4xl leading-[1.02] font-semibold tracking-tight uppercase md:col-span-8 md:text-6xl lg:text-7xl">
            Chaque expérience commence
            <br />
            par une conversation.
          </h2>

          <div className="border-fg/15 bg-fg/[0.035] border p-5 md:col-span-4">
            <p className="text-muted font-mono text-[10px] leading-relaxed font-semibold tracking-[0.28em] uppercase">
              Contact direct
              <br />
              réponse confidentielle
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <WipeButton href={`tel:${CONTACT.phoneRaw}`} variant="solid">
                Appeler maintenant
              </WipeButton>
              <WipeButton href={`mailto:${CONTACT.email}`} variant="ghost">
                Écrire un email
              </WipeButton>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-4">
          {CHANNELS.map((channel, index) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.external ? '_blank' : undefined}
              rel={channel.external ? 'noopener noreferrer' : undefined}
              className="border-fg/15 bg-bg/45 group relative min-h-44 overflow-hidden border p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="bg-fg absolute top-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
              <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                0{index + 1} / {channel.label}
              </span>
              <span className="text-fg mt-12 flex items-end justify-between gap-4 font-mono text-base font-semibold tracking-tight md:text-lg">
                {channel.value}
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>
          ))}

          <Link
            to={localePath(ROUTES.LOGIN)}
            className="border-fg/15 bg-fg text-bg group relative min-h-44 overflow-hidden border p-5 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
              04 / Espace client
            </span>
            <span className="mt-12 flex items-end justify-between gap-4 font-mono text-base font-semibold tracking-tight md:text-lg">
              Se connecter
              <ArrowUpRight
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </Link>
        </div>

        <div className="border-fg/10 mt-16 flex flex-col items-start justify-between gap-4 border-t pt-6 md:flex-row md:items-center md:pt-8">
          <Logomark className="text-fg/80 h-5 w-auto" />
          <p className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            © 2026 SAW NEXT · SUISSE · Jamais intermédiaire financier
          </p>
        </div>
      </div>
    </footer>
  );
};
