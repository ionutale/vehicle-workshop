import { expect, test } from '@playwright/test';

test('a resize mid-drag keeps the piece under the pointer', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');

	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const wheel = rects.shelf.find((p: any) => p.part === 'wheel');
	const grabX = wheel.x + wheel.w / 2;
	const grabY = wheel.y + wheel.h / 2;

	await page.mouse.move(grabX, grabY);
	await page.mouse.down();
	await page.mouse.move(grabX + 40, grabY + 60, { steps: 6 });

	await page.setViewportSize({ width: 844, height: 390 });
	await page.waitForFunction(() => window.innerWidth === 844);

	const drag = await page.evaluate(() => (window as any).__vw.drag());
	expect(drag.part).toBe('wheel');
	expect(drag.screen.x).toBeCloseTo(grabX + 40, 0);
	expect(drag.screen.y).toBeCloseTo(grabY + 60, 0);

	await page.mouse.up();
	await expect(stage).toHaveAttribute('data-placed', '0');
});
