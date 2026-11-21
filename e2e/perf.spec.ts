import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('stops painting when nothing is happening', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');

	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const wheel = rects.shelf.find((p: any) => (p.part === 'wheel' || /Wheel$/.test(p.part)));
	const slot = rects.slots.find((p: any) => (p.part === 'wheel' || /Wheel$/.test(p.part)));
	await page.mouse.move(wheel.x + wheel.w / 2, wheel.y + wheel.h / 2);
	await page.mouse.down();
	await page.mouse.move(slot.x, slot.y, { steps: 10 });
	await page.mouse.up();
	await expect(stage).toHaveAttribute('data-placed', '1');

	await page.waitForTimeout(600);
	const first = await page.evaluate(() => (window as any).__vw.frames());
	await page.waitForTimeout(600);
	const second = await page.evaluate(() => (window as any).__vw.frames());

	expect(second - first).toBeLessThanOrEqual(2);
});
