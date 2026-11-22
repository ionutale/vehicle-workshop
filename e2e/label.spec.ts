import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('the moving piece is named at the top of the screen', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/?test=1&vehicle=fire-engine');
	await start(page);

	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const ladder = rects.shelf.find((piece: any) => /Ladder$/.test(piece.part));
	expect(ladder).toBeTruthy();

	await page.mouse.move(ladder.x + ladder.w / 2, ladder.y + ladder.h / 2);
	await page.mouse.down();
	await expect(page.getByTestId('piece-label')).toHaveText('Ladder');

	await page.mouse.up();
	await expect(page.getByTestId('piece-label')).toHaveCount(0);
});
