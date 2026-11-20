import { expect, test } from '@playwright/test';

test('the canvas fills the viewport in both orientations', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	const box = await page.getByTestId('stage').boundingBox();
	expect(box).not.toBeNull();
	expect(box!.width).toBe(390);
	expect(box!.height).toBe(844);
	await page.setViewportSize({ width: 844, height: 390 });
	const rotated = await page.getByTestId('stage').boundingBox();
	expect(rotated!.width).toBe(844);
	expect(rotated!.height).toBe(390);
});
