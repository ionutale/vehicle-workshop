import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('reduced motion still finishes the loop', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/?test=1&vehicle=car&order=fixed');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).toHaveAttribute('data-phase', 'ready');
	expect(await page.evaluate(() => (window as any).__vw.confetti())).toBe(0);
	await expect(stage).not.toHaveAttribute('data-vehicle', 'car', { timeout: 4_000 });
	await expect(stage).toHaveAttribute('data-phase', 'assembling');
});

test('the hint appears on the first vehicle and not after the first pick', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await expect(stage).toHaveAttribute('data-hint', 'true', { timeout: 5_000 });
	await page.evaluate(() => (window as any).__vw.pickOne());
	await expect(stage).toHaveAttribute('data-hint', 'false');
});


test('a hidden page does not fast-forward the hand-off', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');

	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).toHaveAttribute('data-phase', 'ready');

	await page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
		document.dispatchEvent(new Event('visibilitychange'));
	});
	await page.waitForTimeout(1_500);
	await page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
		document.dispatchEvent(new Event('visibilitychange'));
	});

	// The reward must not be skipped: still on the same car's ready beat, then it plays out.
	await expect(stage).toHaveAttribute('data-phase', 'ready');
	await expect(stage).not.toHaveAttribute('data-vehicle', 'car', { timeout: 3_000 });
});
