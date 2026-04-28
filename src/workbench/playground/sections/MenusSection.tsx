import {
  AsymmetricSplit,
  BrutalistNav,
  CommandPillK,
  CornerDual,
  EditorialHeader,
  FullscreenBurger,
  MegaDropdown,
  MinimalFloating,
  ScrollAdaptive,
  SideRail,
  SplitWordmark,
  TickerTop,
} from '../menus';
import { MenuFrame, Section } from '../shared';

const BASE_PATH = '@workbench/playground/menus';

export function MenusSection() {
  return (
    <Section number="15" title="menus / headers">
      <p className="text-muted mb-10 max-w-2xl text-sm leading-relaxed md:text-base">
        Douze headers distincts — tokenisés, responsives de 320 px à 1920 px (écrans portrait
        inclus), compatibles light/dark mode. Plusieurs intègrent le switcher de langue (FR/EN) et
        le toggle de thème. Copie le chemin d'import en haut de chaque bloc. Aucune dépendance
        au-delà des tokens de design, <span className="font-mono text-xs">lucide-react</span> et{' '}
        <span className="font-mono text-xs">react-i18next</span>.
      </p>

      {/* ─── Classics ─────────────────────────────────── */}
      <h3 className="text-fg mt-4 mb-6 font-mono text-[11px] tracking-[0.3em] uppercase">
        · classics
      </h3>

      <div className="space-y-10">
        <MenuFrame
          name="Brutalist"
          path={`${BASE_PATH}/BrutalistNav`}
          tags={['brutalist', 'solid']}
          ethos="wordmark dominant · raw divider"
        >
          <BrutalistNav />
        </MenuFrame>

        <MenuFrame
          name="Editorial"
          path={`${BASE_PATH}/EditorialHeader`}
          tags={['editorial', 'luxe']}
          ethos="masthead centré · micro-nav slashes"
        >
          <EditorialHeader />
        </MenuFrame>

        <MenuFrame
          name="Minimal floating"
          path={`${BASE_PATH}/MinimalFloating`}
          tags={['minimal', 'ghost']}
          ethos="pill blur · centré · CTA intégré"
        >
          <MinimalFloating />
        </MenuFrame>

        <MenuFrame
          name="Asymmetric split"
          path={`${BASE_PATH}/AsymmetricSplit`}
          tags={['product', 'technical']}
          ethos="groupes dissociés · poids à droite"
        >
          <AsymmetricSplit />
        </MenuFrame>

        <MenuFrame
          name="Mega dropdown"
          path={`${BASE_PATH}/MegaDropdown`}
          tags={['product']}
          ethos="panneaux structurés · featured card"
        >
          <MegaDropdown />
        </MenuFrame>

        <MenuFrame
          name="Fullscreen burger"
          path={`${BASE_PATH}/FullscreenBurger`}
          tags={['editorial', 'playful']}
          ethos="overlay typographique · même UX partout"
        >
          <FullscreenBurger />
        </MenuFrame>
      </div>

      {/* ─── Creative ─────────────────────────────────── */}
      <h3 className="text-fg mt-14 mb-6 font-mono text-[11px] tracking-[0.3em] uppercase">
        · creative
      </h3>

      <div className="space-y-10">
        <MenuFrame
          name="Command pill (⌘K)"
          path={`${BASE_PATH}/CommandPillK`}
          tags={['product', 'technical']}
          ethos="pill docké bas · palette clavier · i18n + langue"
        >
          <CommandPillK />
        </MenuFrame>

        <MenuFrame
          name="Side rail"
          path={`${BASE_PATH}/SideRail`}
          tags={['product', 'technical']}
          ethos="rail vertical · expand au hover · thème + langue"
        >
          <SideRail />
        </MenuFrame>

        <MenuFrame
          name="Split wordmark"
          path={`${BASE_PATH}/SplitWordmark`}
          tags={['editorial', 'brutalist']}
          ethos="marque scindée · menu niché entre les moitiés"
        >
          <SplitWordmark />
        </MenuFrame>

        <MenuFrame
          name="Scroll adaptive"
          path={`${BASE_PATH}/ScrollAdaptive`}
          tags={['product', 'animated']}
          ethos="grand au repos · morphe en pill au scroll"
        >
          <ScrollAdaptive />
        </MenuFrame>

        <MenuFrame
          name="Ticker top"
          path={`${BASE_PATH}/TickerTop`}
          tags={['editorial', 'animated']}
          ethos="marquee live · nav classique dessous · i18n inline"
        >
          <TickerTop />
        </MenuFrame>

        <MenuFrame
          name="Corner dual"
          path={`${BASE_PATH}/CornerDual`}
          tags={['minimal', 'organic']}
          ethos="zéro chrome · logo + menu ancrés dans les coins"
        >
          <CornerDual />
        </MenuFrame>
      </div>
    </Section>
  );
}
