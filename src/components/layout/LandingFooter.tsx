// ═══════════════════════════════════════════════════
// LandingFooter — GAFHA grid + WipeButton CTAs + uniform header
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Logomark } from '@components/ui/Logomark';
import { WipeButton } from '@components/ui/WipeButton';
import { ROUTES } from '@constants/routes';
import { ArrowUpRight, Mail, MessageSquare, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const CONTACT = {
  phoneDisplay: '+41 78 749 81 70',
  phoneRaw: '+41787498170',
  email: 'info@saw-next.ch',
  whatsappUrl:
    'https://wa.me/41787498170?text=' +
    encodeURIComponent('Bonjour Salvatore, je souhaiterais entrer en contact avec SAW Next.'),
};

export const LandingFooter = () => {
  const { localePath } = useLocale();

  return (
    <footer id="contact" className="relative w-full pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="mx-auto w-full max-w-400 px-5 md:px-6">
        <div className="bg-surface rounded-md px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
          {/* Header */}
          <p className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
            <span className="text-fg/30">06 / </span>CONTACT
          </p>
          <h2 className="text-fg mt-5 font-mono text-3xl leading-[1.05] font-semibold tracking-tight uppercase md:mt-6 md:text-5xl lg:text-6xl">
            Chaque expérience commence
            <br />
            par une conversation.
          </h2>

          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
            {/* Left — primary CTAs */}
            <div className="flex flex-col gap-4">
              <WipeButton href={`tel:${CONTACT.phoneRaw}`} variant="solid">
                Appeler maintenant
              </WipeButton>
              <WipeButton href={`mailto:${CONTACT.email}`} variant="ghost">
                Écrire un email
              </WipeButton>
              <WipeButton
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
              >
                WhatsApp · Message pré-rédigé
              </WipeButton>
            </div>

            {/* Right — coordonnées */}
            <ul className="border-border space-y-4 border-t pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
              <ContactRow
                icon={<Phone size={14} strokeWidth={2} aria-hidden="true" />}
                label="Téléphone"
                value={CONTACT.phoneDisplay}
                href={`tel:${CONTACT.phoneRaw}`}
              />
              <ContactRow
                icon={<Mail size={14} strokeWidth={2} aria-hidden="true" />}
                label="Email"
                value={CONTACT.email}
                href={`mailto:${CONTACT.email}`}
              />
              <ContactRow
                icon={<MessageSquare size={14} strokeWidth={2} aria-hidden="true" />}
                label="WhatsApp"
                value="Message pré-rédigé"
                href={CONTACT.whatsappUrl}
                external
              />
              <li className="border-border flex items-baseline justify-between gap-4 border-t pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                    Espace client
                  </span>
                  <Link
                    to={localePath(ROUTES.LOGIN)}
                    className="text-fg hover:text-muted group inline-flex items-center gap-1.5 text-base transition-colors"
                  >
                    Se connecter
                    <ArrowUpRight
                      size={14}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal end-cap */}
        <div className="border-border mt-12 flex flex-col items-start justify-between gap-4 border-t pt-8 md:flex-row md:items-center">
          <Logomark className="text-fg/80 h-5 w-auto" />
          <p className="text-muted font-mono text-[10px] tracking-[0.4em] uppercase">
            © 2026 SAW NEXT · GENÈVE · CONFIDENTIEL · Jamais intermédiaire financier
          </p>
        </div>
      </div>
    </footer>
  );
};

interface ContactRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

const ContactRow = ({ icon, label, value, href, external }: ContactRowProps) => (
  <li className="border-border flex items-baseline justify-between gap-4 border-t pt-4 first:border-t-0 first:pt-0">
    <div className="flex flex-col gap-1">
      <span className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
        {label}
      </span>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="text-fg hover:text-muted group inline-flex items-center gap-2 text-base transition-colors"
      >
        {icon}
        <span>{value}</span>
      </a>
    </div>
  </li>
);
