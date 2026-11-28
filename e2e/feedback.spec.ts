import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('a snapped piece sparkles and settles', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const before = await page.evaluate(() => (window as any).__vw.state().placed.length);
	const box = await page.evaluate(() => (window as any).__vw.rects());
	const piece = box.shelf[0];
	const slot = box.slots.find((s: any) => s.part === piece.part);
	await page.mouse.move(piece.x + piece.w / 2, piece.y + piece.h / 2);
	await page.mouse.down();
	await page.mouse.move(slot.x, slot.y, { steps: 8 });
	await page.mouse.up();
	await expect
		.poll(() => page.evaluate(() => (window as any).__vw.state().placed.length))
		.toBe(before + 1);
	await expect
		.poll(() => page.evaluate(() => (window as any).__vw.sparkles()))
		.toBeGreaterThan(0);
});
