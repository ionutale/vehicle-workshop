import { expect, test } from '@playwright/test';

test('a wheel can be dragged from the shelf onto the car', async ({ page }) => {
	await page.goto('/?test=1');
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const wheel = rects.shelf.find((p: any) => p.part === 'wheel');
	const slot = rects.slots.find((p: any) => p.part === 'wheel');
	await page.mouse.move(wheel.x + wheel.w / 2, wheel.y + wheel.h / 2);
	await page.mouse.down();
	await page.mouse.move(slot.x, slot.y, { steps: 12 });
	await page.mouse.up();
	await expect(stage).toHaveAttribute('data-placed', '1');
	await expect(stage).toHaveAttribute('data-tray', '5');
});

test('a missed drop returns the piece to the shelf', async ({ page }) => {
	await page.goto('/?test=1');
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const body = rects.shelf.find((p: any) => p.part === 'body');
	await page.mouse.move(body.x + body.w / 2, body.y + body.h / 2);
	await page.mouse.down();
	await page.mouse.move(5, 5, { steps: 8 });
	await page.mouse.up();
	await expect(stage).toHaveAttribute('data-placed', '0');
	await expect(stage).toHaveAttribute('data-tray', '6');
});
