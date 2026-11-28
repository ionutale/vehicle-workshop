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

test('stops painting while the tab is hidden and resumes when it returns', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	await start(page);

	await page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
		document.dispatchEvent(new Event('visibilitychange'));
	});
	const hiddenFirst = await page.evaluate(() => (window as any).__vw.frames());
	await page.waitForTimeout(600);
	const hiddenSecond = await page.evaluate(() => (window as any).__vw.frames());
	expect(hiddenSecond - hiddenFirst).toBeLessThanOrEqual(1);

	await page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
		document.dispatchEvent(new Event('visibilitychange'));
	});
	await page.waitForTimeout(400);
	const resumedFirst = await page.evaluate(() => (window as any).__vw.frames());
	await page.waitForTimeout(400);
	const resumedSecond = await page.evaluate(() => (window as any).__vw.frames());
	expect(resumedSecond - resumedFirst).toBeGreaterThan(5);
});

test('stops painting under reduced motion when nothing changes', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	expect(await page.evaluate(() => (window as any).__vw.motion().enabled)).toBe(false);

	// Past the two-second hint so this samples the steady state, not the first second.
	await page.waitForTimeout(2600);
	const first = await page.evaluate(() => (window as any).__vw.frames());
	await page.waitForTimeout(600);
	const second = await page.evaluate(() => (window as any).__vw.frames());

	expect(second - first).toBeLessThanOrEqual(2);
});

test('does not animate the world behind the menu', async ({ page }) => {
	await page.goto('/?test=1');
	await page.waitForTimeout(800);
	const first = await page.evaluate(() => (window as any).__vw.frames());
	await page.waitForTimeout(600);
	const second = await page.evaluate(() => (window as any).__vw.frames());
	expect(second - first).toBeLessThanOrEqual(2);
});
