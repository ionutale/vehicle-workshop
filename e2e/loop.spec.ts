import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('a finished car drives off and a fresh vehicle arrives', async ({ page }) => {
	await page.goto('/?test=1&order=fixed');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).toHaveAttribute('data-phase', 'ready');
	await expect(stage).toHaveAttribute('data-placed', '4');
	expect(await page.evaluate(() => (window as any).__vw.confetti())).toBeGreaterThan(0);
	await expect(stage).toHaveAttribute('data-phase', 'driving', { timeout: 2_000 });
	await expect(stage).toHaveAttribute('data-phase', 'working', { timeout: 2_000 });
	await expect(stage).toHaveAttribute('data-phase', 'assembling', { timeout: 3_000 });
	expect(await page.evaluate(() => (window as any).__vw.confetti())).toBe(0);
	await expect(stage).toHaveAttribute('data-placed', '0');
	await expect(stage).toHaveAttribute('data-tray', '4');
});

test('tapping a piece without moving returns it to the shelf', async ({ page }) => {
	await page.goto('/?test=1');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const body = rects.shelf.find((p: any) => (p.part === 'body' || /Body$/.test(p.part)));
	await page.mouse.click(body.x + body.w / 2, body.y + body.h / 2);
	await expect(stage).toHaveAttribute('data-placed', '0');
	await expect(stage).toHaveAttribute('data-tray', '4');
});
