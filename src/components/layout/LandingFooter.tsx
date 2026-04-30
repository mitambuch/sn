// ═══════════════════════════════════════════════════
// LandingFooter — lighter, less encumbered (owner: "un peu grossier")
// ═══════════════════════════════════════════════════

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

export const LandingFooter = () => {
  const { localePath } = useLocale();

  return (
    <footer id="contact" className="relative w-full pt-24 pb-10 md:pt-32 md:pb-12">
      <div className="mx-auto w-full max-w-400 px-5 md:px-6">
        {/* Header */}
        <p className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
          <span className="text-fg/30">06 / </span>CONTACT
        </p>
        <h2 className="text-fg mt-4 font-mono text-2xl leading-[1.1] font-semibold tracking-tight uppercase md:mt-5 md:text-4xl lg:text-5xl">
          Chaque expérience commence
          <br />
          par une conversation.
        </h2>

        {/* CTAs primary */}
        <div className="mt-10 flex flex-wrap items-center gap-3 md:mt-14">
          <WipeButton href={`tel:${CONTACT.phoneRaw}`} variant="solid">
            Appeler maintenant
          </WipeButton>
          <WipeButton href={`mailto:${CONTACT.email}`} variant="ghost">
            Écrire un email
          </WipeButton>
        </div>

        {/* Coordonnées discrètes en grid */}
        <dl className="border-fg/15 mt-16 grid grid-cols-1 gap-6 border-t pt-8 md:grid-cols-4 md:gap-8">
          <div>
            <dt className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
              Téléphone
            </dt>
            <dd className="text-fg mt-2 font-mono text-sm tracking-tight md:text-base">
              <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-muted transition-colors">
                {CONTACT.phoneDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
              Email
            </dt>
            <dd className="text-fg mt-2 font-mono text-sm tracking-tight md:text-base">
              <a href={`mailto:${CONTACT.email}`} className="hover:text-muted transition-colors">
                {CONTACT.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
              WhatsApp
            </dt>
            <dd className="text-fg mt-2 font-mono text-sm tracking-tight md:text-base">
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-muted inline-flex items-center gap-1.5 transition-colors"
              >
                Message pré-rédigé
                <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
              Espace client
            </dt>
            <dd className="text-fg mt-2 font-mono text-sm tracking-tight md:text-base">
              <Link
                to={localePath(ROUTES.LOGIN)}
                className="hover:text-muted inline-flex items-center gap-1.5 transition-colors"
              >
                Se connecter
                <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
              </Link>
            </dd>
          </div>
        </dl>

        {/* Legal end-cap */}
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
