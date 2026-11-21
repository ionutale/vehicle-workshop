import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('a wheel can be dragged from the shelf onto the car', async ({ page }) => {
	await page.goto('/?test=1');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const wheel = rects.shelf.find((p: any) => (p.part === 'wheel' || /Wheel$/.test(p.part)));
	const slot = rects.slots.find((p: any) => (p.part === 'wheel' || /Wheel$/.test(p.part)));
	await page.mouse.move(wheel.x + wheel.w / 2, wheel.y + wheel.h / 2);
	await page.mouse.down();
	await page.mouse.move(slot.x, slot.y, { steps: 12 });
	await page.mouse.up();
	await expect(stage).toHaveAttribute('data-placed', '1');
	await expect(stage).toHaveAttribute('data-tray', '3');
});

test('a missed drop returns the piece to the shelf', async ({ page }) => {
	await page.goto('/?test=1');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const body = rects.shelf.find((p: any) => (p.part === 'body' || /Body$/.test(p.part)));
	await page.mouse.move(body.x + body.w / 2, body.y + body.h / 2);
	await page.mouse.down();
	await page.mouse.move(5, 5, { steps: 8 });
	await page.mouse.up();
	await expect(stage).toHaveAttribute('data-placed', '0');
	await expect(stage).toHaveAttribute('data-tray', '4');
});


test('releasing outside the play area cancels the drag', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const wheel = rects.shelf.find((p: any) => (p.part === 'wheel' || /Wheel$/.test(p.part)));

	await page.mouse.move(wheel.x + wheel.w / 2, wheel.y + wheel.h / 2);
	await page.mouse.down();
	await page.mouse.move(2, 2, { steps: 6 });
	await page.mouse.up();

	await expect(stage).toHaveAttribute('data-placed', '0');
	await expect(stage).toHaveAttribute('data-tray', '4');
});


test('a wide body grabbed near its end still lands when the body sits on its ghost', async ({
	page
}) => {
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const body = rects.shelf.find((p: any) => (p.part === 'body' || /Body$/.test(p.part)));
	const slot = rects.slots.find((p: any) => (p.part === 'body' || /Body$/.test(p.part)));

	const grabX = body.x + 10;
	const grabY = body.y + body.h / 2;
	await page.mouse.move(grabX, grabY);
	await page.mouse.down();
	// Put the piece's centre on the slot, so the finger sits well left of it.
	await page.mouse.move(slot.x - (body.w / 2 - 10), slot.y, { steps: 10 });
	await page.mouse.up();

	await expect(stage).toHaveAttribute('data-placed', '1');
});
