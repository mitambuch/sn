import { SeoHead } from '@components/features/SeoHead';
import { playgroundPage } from '@data/pages';
import {
  AccordionSection,
  AvatarsSkeletonSection,
  BadgesSection,
  BannersSection,
  ButtonsSection,
  CardsSection,
  ColorsSection,
  ContactSection,
  CTASection,
  EmptyStatesSection,
  FormsSection,
  HerosSection,
  IconsSection,
  LoadersSection,
  MenusSection,
  MiscSection,
  OverlaysSection,
  PricingSection,
  StatsSection,
  TabsSpinnerSection,
  TestimonialsSection,
  TimelineSection,
  ToastSection,
  TypographySection,
} from '@workbench/playground/sections';
import { ZoneBanner } from '@workbench/playground/shared';

/* ═══════════════════════════════════════════════════════════════
   Playground — design system devkit
   Zone 1 : CORE     (foundation installée sur chaque site)
   Zone 2 : GRAPHIC  (composition assemblée à partir du CORE)
   Each section full-width · 1-col stack so every section breathes.
   ═══════════════════════════════════════════════════════════════ */

export default function Playground() {
  return (
    <>
      <SeoHead title={playgroundPage.seo.title} description={playgroundPage.seo.description} />
      <div className="bg-bg text-fg min-h-screen">
        {/* Hero header */}
        <div className="mx-auto max-w-350 px-6 pt-12 pb-8 md:px-10 md:pt-16 md:pb-12">
          <span className="text-accent-text font-mono text-[10px] tracking-[0.2em] uppercase">
            {playgroundPage.label}
          </span>
          <h1 className="text-fg mt-3 text-4xl font-medium tracking-tight md:text-6xl lg:text-7xl">
            {playgroundPage.headline}
          </h1>
          <p className="text-muted mt-4 max-w-xl text-base leading-relaxed md:text-lg">
            {playgroundPage.subline}
          </p>
          <div className="bg-accent mt-6 h-px w-16" />
        </div>

        {/* Main content — 1-col stack */}
        <div className="mx-auto max-w-350 space-y-20 px-6 pb-20 md:px-10">
          {/* ═════ ZONE 01 — CORE ═════ */}
          <ZoneBanner
            label="Zone 01"
            title="Core"
            description="Le socle que tu installes sur chaque nouveau site : palette, typographie, boutons, atomes d'interface. Change ces tokens et l'ensemble du design suit."
          />

          <div className="border-border/60 bg-surface/30 rounded-xl border px-4 py-3 md:px-6">
            <p className="text-muted text-xs leading-relaxed md:text-sm">
              <span className="text-accent-text font-mono tracking-wider uppercase">note</span> Les
              specimens utilisent du texte FR dummy pour la lisibilité. En production, toutes les
              strings UI passent par <span className="font-mono">useTranslation()</span> (clés dans{' '}
              <span className="font-mono">src/locales/</span>) et le contenu éditorial vient de
              Sanity (pattern <span className="font-mono">#sanity</span> — inline / dedicated menu /
              siteConfig). Voir <span className="font-mono">.claude/rules/i18n-sanity.md</span>.
            </p>
          </div>

          <TypographySection />
          <ColorsSection />
          <ButtonsSection />
          <BadgesSection />
          <FormsSection />
          <CardsSection />
          <AvatarsSkeletonSection />
          <OverlaysSection />
          <ToastSection />
          <IconsSection />
          <TabsSpinnerSection />
          <LoadersSection />
          <BannersSection />
          <EmptyStatesSection />

          {/* ═════ ZONE 02 — GRAPHIC ═════ */}
          <ZoneBanner
            label="Zone 02"
            title="Graphic"
            description="Les blocs composés que tu piocheras par vibe (tags #brutalist · #editorial · #luxe · …) selon le client. Ils consomment le CORE — change un token, ils suivent."
          />

          <MenusSection />
          <HerosSection />
          <AccordionSection />
          <PricingSection />
          <TestimonialsSection />
          <ContactSection />
          <CTASection />
          <TimelineSection />
          <StatsSection />
          <MiscSection />
        </div>
      </div>
    </>
  );
}
