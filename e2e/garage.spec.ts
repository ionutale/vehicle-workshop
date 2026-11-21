import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('a finished vehicle parks on the menu and drives again when tapped', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');

	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).toHaveAttribute('data-phase', 'ready');

	await page.getByRole('button', { name: 'Menu' }).click();
	const garage = page.getByTestId('garage');
	await expect(garage).toBeVisible();
	const parked = garage.locator('button[data-vehicle="car"]');
	await expect(parked).toBeVisible();

	await parked.click();
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await expect(stage).toHaveAttribute('data-phase', 'assembling');

	await page.reload();
	await expect(page.getByTestId('garage').locator('button[data-vehicle="car"]')).toBeVisible();
	expect(await page.evaluate(() => window.localStorage.getItem('vw:garage'))).toContain('car');
});
