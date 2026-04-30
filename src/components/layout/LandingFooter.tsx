// ═══════════════════════════════════════════════════
// LandingFooter — closing block of the public landing
//
// WHAT: Massive CONTACTER call-to-action, contact lines (phone +
//       email + WhatsApp), legal mentions in micro typography.
//       This is the page's anchor — every visitor scrolls down to
//       this point and finds a clear way to reach Salvatore.
// WHEN: Last child of LandingLayout main on the public landing.
// EDIT CONTACT: CONTACT constants below — moved to siteConfig once
//       /brief is run for client.md.
// ═══════════════════════════════════════════════════

import { useLocale } from '@app/LocaleProvider';
import { Container } from '@components/layout/Container';
import { BrandArrow } from '@components/ui/BrandArrow';
import { Logomark } from '@components/ui/Logomark';
import { MagneticButton } from '@components/ui/MagneticButton';
import { ROUTES } from '@constants/routes';
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
    <footer
      id="contact"
      className="border-fg/10 relative w-full border-t pt-32 pb-16 md:pt-48 md:pb-20"
    >
      <Container size="2k">
        {/* Massive call to action */}
        <div className="grid gap-16 md:grid-cols-12 md:gap-12">
          <div className="col-span-12 md:col-span-7">
            <p className="text-fg/55 font-mono text-[10px] font-semibold tracking-[0.5em] uppercase">
              CONTACT
            </p>
            <h2
              className="text-fg mt-6 font-mono font-semibold tracking-tight uppercase"
              style={{ fontSize: 'clamp(1.85rem, 4.5vw, 4rem)', lineHeight: '1.05' }}
            >
              Chaque expérience commence
              <br />
              par une conversation.
            </h2>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <MagneticButton strength={0.3} range={140}>
                <a
                  href={`tel:${CONTACT.phoneRaw}`}
                  className="border-fg bg-fg text-bg hover:bg-fg/90 focus-visible:ring-fg/30 inline-flex items-center gap-4 rounded-full border px-7 py-4 font-mono text-xs font-semibold tracking-[0.35em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span>APPELER MAINTENANT</span>
                  <BrandArrow className="h-[0.9em]" />
                </a>
              </MagneticButton>
              <MagneticButton strength={0.3} range={140}>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="border-fg/30 text-fg hover:border-fg focus-visible:ring-fg/30 inline-flex items-center gap-4 rounded-full border px-7 py-4 font-mono text-xs font-semibold tracking-[0.35em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <span>ÉCRIRE UN EMAIL</span>
                  <BrandArrow className="h-[0.9em]" />
                </a>
              </MagneticButton>
            </div>
          </div>

          {/* Right — contact lines */}
          <div className="col-span-12 flex flex-col gap-6 md:col-span-5 md:items-end md:text-right">
            <div className="flex flex-col gap-2">
              <span className="text-fg/50 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                TÉLÉPHONE
              </span>
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                className="text-fg hover:text-fg/70 font-mono text-lg font-semibold tracking-tight md:text-xl"
              >
                {CONTACT.phoneDisplay}
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-fg/50 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                EMAIL
              </span>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-fg hover:text-fg/70 font-mono text-lg font-semibold tracking-tight md:text-xl"
              >
                {CONTACT.email}
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-fg/50 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                WHATSAPP
              </span>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg hover:text-fg/70 font-mono text-lg font-semibold tracking-tight md:text-xl"
              >
                Message pré-rédigé →
              </a>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-fg/50 font-mono text-[10px] font-semibold tracking-[0.4em] uppercase">
                ESPACE CLIENT
              </span>
              <Link
                to={localePath(ROUTES.LOGIN)}
                className="text-fg hover:text-fg/70 inline-flex items-center gap-2 font-mono text-lg font-semibold tracking-tight md:text-xl"
              >
                Se connecter <BrandArrow className="h-[0.8em]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Legal end-cap */}
        <div className="border-fg/10 mt-32 flex flex-col items-start justify-between gap-6 border-t pt-10 md:flex-row md:items-center">
          <Logomark className="text-fg/80 h-5 w-auto" />
          <p className="text-fg/40 font-mono text-[10px] tracking-[0.4em] uppercase">
            © 2026 SAW NEXT · GENÈVE · CONFIDENTIEL · SAW Next n&apos;agit jamais comme
            intermédiaire financier
          </p>
        </div>
      </Container>
    </footer>
  );
};
