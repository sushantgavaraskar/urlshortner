const { test, expect } = require('@playwright/test');

test.describe('Basic Functionality', () => {
  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check basic page structure
    await expect(page).toHaveTitle(/SmartShort/);
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check navbar elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to features section
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(1000);
    
    // Check some key features
    await expect(page.locator('h3:has-text("AI-Powered Insights")')).toBeVisible();
    await expect(page.locator('h3:has-text("Real-time Analytics")')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });
}); 