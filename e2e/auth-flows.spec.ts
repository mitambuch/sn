import { expect, test } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════════
   AUTH-FLOWS — admin route reachability + auth surface smoke.

   This spec covers the admin route plumbing post-Phase-5 wiring.

   The two landing-modal flows (AccessRequestModal wizard + LoginModal)
   are intentionally DEFERRED to a follow-up — driving the cinematic
   Loader from Playwright is fiddly enough to deserve dedicated test
   fixtures (test mode that bypasses the Loader, etc.). For now, the
   smoke.spec already proves the landing renders without console errors,
   which catches the regression risk we care about most.
   ═══════════════════════════════════════════════════════════════ */

test.describe('Admin — route reachability', () => {
  test('/admin/invitations route loads without crashing', async ({ page }) => {
    await page.goto('/fr/admin/invitations');
    await page.waitForLoadState('networkidle');
    // Two valid end states : the admin page (admin session) OR the
    // login redirect (RequireAuth). We assert the SPA settled on one.
    const adminOrLogin = page
      .getByRole('button', { name: /générer|generate/i })
      .or(page.getByRole('heading', { level: 1 }).first());
    await expect(adminOrLogin.first()).toBeVisible({ timeout: 10_000 });
  });

  test('/admin/inquiries route loads without crashing', async ({ page }) => {
    await page.goto('/fr/admin/inquiries');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('/admin/users route loads without crashing', async ({ page }) => {
    await page.goto('/fr/admin/users');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({
      timeout: 10_000,
    });
  });
});

test.describe('Auth — public routes', () => {
  test('/fr/login route renders the login surface', async ({ page }) => {
    await page.goto('/fr/login');
    await page.waitForLoadState('networkidle');
    // Login route surfaces either the 3 modes OR a "Back to home" link.
    const loginSurface = page
      .getByText(/email et mot de passe|email and password/i)
      .or(page.getByRole('link', { name: /back to home|retour/i }).first());
    await expect(loginSurface.first()).toBeVisible({ timeout: 10_000 });
  });

  test('/fr/onboarding route renders the cinematic wizard', async ({ page }) => {
    await page.goto('/fr/onboarding');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({
      timeout: 10_000,
    });
  });
});
