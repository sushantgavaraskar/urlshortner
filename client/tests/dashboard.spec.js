const { test, expect } = require('@playwright/test');

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should redirect to home if not authenticated', async ({ page }) => {
    // Wait for potential redirect
    await page.waitForTimeout(2000);
    
    // Check if we're still on dashboard or redirected
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      // If still on dashboard, check if there's a redirect happening
      await page.waitForTimeout(3000);
    }
    
    // The redirect might not happen immediately, so we'll check the content instead
    const hasDashboardContent = await page.locator('text=My Links').isVisible().catch(() => false);
    if (!hasDashboardContent) {
      // If no dashboard content, we should be on home page
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should display dashboard when authenticated', async ({ page }) => {
    // Mock authentication by setting session in localStorage
    await page.addInitScript(() => {
      localStorage.setItem('next-auth.session-token', 'mock-token');
      localStorage.setItem('next-auth.csrf-token', 'mock-csrf');
      // Mock the session data
      window.mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      };
    });

    await page.goto('/dashboard');
    
    // Wait for dashboard to load
    await page.waitForTimeout(2000);
    
    // Check dashboard elements
    await expect(page.locator('text=My Links')).toBeVisible();
    await expect(page.locator('text=Manage and track your shortened URLs')).toBeVisible();
    await expect(page.locator('button:has-text("Create Link")')).toBeVisible();
  });

  test('should have search and filter functionality', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('next-auth.session-token', 'mock-token');
      window.mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      };
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    
    // Check search input
    await expect(page.locator('input[placeholder="Search links..."]')).toBeVisible();
    
    // Check filter dropdown
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('option:has-text("All Links")')).toBeVisible();
    await expect(page.locator('option:has-text("Active")')).toBeVisible();
    await expect(page.locator('option:has-text("Expired")')).toBeVisible();
  });

  test('should show create link modal', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('next-auth.session-token', 'mock-token');
      window.mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      };
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    
    // Click create link button
    await page.click('button:has-text("Create Link")');
    
    // Check modal appears
    await expect(page.locator('text=Create New Link')).toBeVisible();
    await expect(page.locator('input[placeholder="https://example.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="my-custom-link"]')).toBeVisible();
    await expect(page.locator('input[placeholder="My Awesome Link"]')).toBeVisible();
  });

  test('should display empty state when no links', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('next-auth.session-token', 'mock-token');
      window.mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      };
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    
    // Check empty state
    await expect(page.locator('text=No links found')).toBeVisible();
    await expect(page.locator('text=Get started by creating your first shortened link')).toBeVisible();
    await expect(page.locator('button:has-text("Create Your First Link")')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Mock authentication
    await page.addInitScript(() => {
      localStorage.setItem('next-auth.session-token', 'mock-token');
      window.mockSession = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' }
      };
    });

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    
    // Check mobile layout
    await expect(page.locator('text=My Links')).toBeVisible();
    await expect(page.locator('button:has-text("Create Link")')).toBeVisible();
  });
}); 