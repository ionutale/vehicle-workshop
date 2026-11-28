import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('keeps painting while the world is alive', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	await expect(page.getByTestId('stage')).toHaveAttribute('data-vehicle', 'car');

	await page.waitForTimeout(600);
	const first = await page.evaluate(() => (window as any).__vw.frames());
	await page.waitForTimeout(600);
	const second = await page.evaluate(() => (window as any).__vw.frames());

	expect(second - first).toBeGreaterThan(20);
});

test('stops painting under reduced motion when nothing changes', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	expect(await page.evaluate(() => (window as any).__vw.motion().enabled)).toBe(false);

	await page.waitForTimeout(600);
	const first = await page.evaluate(() => (window as any).__vw.frames());
	await page.waitForTimeout(600);
	const second = await page.evaluate(() => (window as any).__vw.frames());

	expect(second - first).toBeLessThanOrEqual(2);
});
