import { expect, test } from '@playwright/test';
import { start } from './helpers';

test('draws the scene, the ghosts and a shelf of pieces', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/?motion=off');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await expect(stage).toHaveAttribute('data-phase', 'assembling');
	await expect(stage).toHaveAttribute('data-placed', '0');
	await expect(stage).toHaveAttribute('data-tray', '4');

	const painted = await page.evaluate(() => {
		const canvas = document.querySelector('canvas') as HTMLCanvasElement;
		const ctx = canvas.getContext('2d')!;
		const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let nonBlank = 0;
		for (let i = 0; i < data.length; i += 4) {
			if (data[i] !== 191 || data[i + 1] !== 234 || data[i + 2] !== 255) nonBlank++;
		}
		return nonBlank / (data.length / 4);
	});
	expect(painted).toBeGreaterThan(0.2);

	await expect(stage).toHaveScreenshot('first-frame-portrait.png', { maxDiffPixelRatio: 0.02 });
});


test('draws the landscape composition', async ({ page }) => {
	await page.setViewportSize({ width: 844, height: 390 });
	await page.goto('/?motion=off');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await expect(stage).toHaveScreenshot('first-frame-landscape.png', { maxDiffPixelRatio: 0.02 });
});
