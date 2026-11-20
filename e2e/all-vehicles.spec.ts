import { expect, test } from '@playwright/test';

const IDS = ['car', 'fire-engine', 'bus', 'tractor', 'digger', 'van'];

for (const id of IDS) {
	test(`${id} completes and drives away in portrait`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(`/?test=1&vehicle=${id}&order=fixed`);
		const stage = page.getByTestId('stage');
		await expect(stage).toHaveAttribute('data-vehicle', id);
		await page.evaluate(() => (window as any).__vw.complete());
		await expect(stage).toHaveAttribute('data-phase', 'ready');
		await expect(stage).not.toHaveAttribute('data-vehicle', id, { timeout: 4_000 });
	});
}

test('the next vehicle is never the one just built', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).not.toHaveAttribute('data-vehicle', 'car', { timeout: 4_000 });
});
