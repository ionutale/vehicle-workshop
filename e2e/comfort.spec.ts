import { expect, test } from '@playwright/test';

test('reduced motion still finishes the loop', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/?test=1&vehicle=car&order=fixed');
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).not.toHaveAttribute('data-vehicle', 'car', { timeout: 4_000 });
	await expect(stage).toHaveAttribute('data-phase', 'assembling');
});

test('the hint appears on the first vehicle and not after the first pick', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await expect(stage).toHaveAttribute('data-hint', 'true', { timeout: 5_000 });
	await page.evaluate(() => (window as any).__vw.pickOne());
	await expect(stage).toHaveAttribute('data-hint', 'false');
});
