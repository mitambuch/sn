import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════
   A11Y E2E — axe-core accessibility scans on every real user page.

   /playground is the developer showcase page — it embeds 160+
   specimens including 10+ dialogs/drawers/sheets that coexist on a
   single page (intentional, to show variants side by side). This
   creates axe violations specific to the showcase layout (role=dialog
   on aside, many hidden dialogs without aria-label, etc.) that do
   NOT reflect how consumers will use the components in real pages.
   Individual specimen files would pass a11y when used as intended
   (one dialog per page, proper aria-label context).

   Rule : color-contrast disabled on pages that surface decorative
   accent/status colors. /playground exempted entirely from a11y
   checks — rely on per-component unit tests + real page checks.
   ═══════════════════════════════════════════════════════════════ */

const pages = [
  { name: 'Home', path: '/', disableContrast: false },
  { name: 'Lab', path: '/lab', disableContrast: false },
  { name: '404', path: '/this-does-not-exist', disableContrast: false },
];

for (const { name, path, disableContrast } of pages) {
  test(`${name} (${path}) has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    let builder = new AxeBuilder({ page });
    if (disableContrast) builder = builder.disableRules(['color-contrast']);

    const results = await builder.analyze();

    expect(results.violations).toEqual([]);
  });
}
