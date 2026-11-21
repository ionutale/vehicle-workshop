import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('the tram boards passengers before the next vehicle arrives', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/?test=1&vehicle=tram');
	await start(page);
	const stage = page.getByTestId('stage');

	await expect(stage).toHaveAttribute('data-family', 'rail');
	await expect(stage).toHaveAttribute('data-job', 'platform');

	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).toHaveAttribute('data-phase', 'working', { timeout: 3_000 });
	await expect(stage).toHaveAttribute('data-phase', 'assembling', { timeout: 3_000 });
});
