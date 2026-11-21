import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('the backdrop changes after each finished vehicle', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/?test=1&level=3');
	await start(page);
	const stage = page.getByTestId('stage');

	await expect(stage).toHaveAttribute('data-scene', 'countryside');

	for (const scene of ['town', 'harbour', 'countryside']) {
		await page.evaluate(() => (window as any).__vw.complete());
		await expect
			.poll(() => page.evaluate(() => (window as any).__vw.state().phase), { timeout: 5_000 })
			.toBe('assembling');
		await expect(stage).toHaveAttribute('data-scene', scene);
		await expect(stage).toHaveAttribute('data-placed', '0');
		expect(Number(await stage.getAttribute('data-tray'))).toBeGreaterThan(0);
	}
});
