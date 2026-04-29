// ═══════════════════════════════════════════════════
// ComingSoon — placeholder page for not-yet-built lot B routes
//
// WHAT: Renders a SectionHeader with an editorial "in preparation"
//       message keyed by i18n. Used everywhere a route has been wired
//       in src/app/routes/index.tsx but the corresponding page hasn't
//       landed yet (lot B is incremental).
// WHEN: Every Account/Admin sub-route until its dedicated page is built.
// REPLACE ME: each module's commit replaces the matching <Route element>.
// ═══════════════════════════════════════════════════

import { Container } from '@components/layout/Container';
import { SectionHeader } from '@components/ui/SectionHeader';
import { useTranslation } from 'react-i18next';

interface ComingSoonProps {
  /** i18n key for the page title (e.g. "account.events.title"). */
  titleKey: string;
  /** i18n key for the eyebrow label (e.g. "account.eyebrow"). */
  eyebrowKey?: string;
}

const ComingSoon = ({ titleKey, eyebrowKey }: ComingSoonProps) => {
  const { t } = useTranslation();
  return (
    <Container>
      <div className="py-24">
        <SectionHeader
          {...(eyebrowKey ? { eyebrow: t(eyebrowKey) } : {})}
          title={t(titleKey)}
          lede={t('common.comingSoon')}
          size="md"
        />
      </div>
    </Container>
  );
};

export default ComingSoon;
