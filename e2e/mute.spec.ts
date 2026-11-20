import { expect, test } from '@playwright/test';

test('the mute toggle survives a reload', async ({ page }) => {
	await page.goto('/?test=1');
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	const rects = await page.evaluate(() => (window as any).__vw.rects());
	await page.mouse.click(rects.mute.x + rects.mute.w / 2, rects.mute.y + rects.mute.h / 2);
	await expect(stage).toHaveAttribute('data-muted', 'true');
	await page.reload();
	await expect(stage).toHaveAttribute('data-muted', 'true');
});
