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

for (const [id, job, viewport] of [
	['tow-truck', 'tow', { width: 390, height: 844 }],
	['cement-mixer', 'mix', { width: 390, height: 844 }],
	['snow-plough', 'plough', { width: 320, height: 568 }],
	['street-sweeper', 'sweep', { width: 390, height: 844 }],
	['car-transporter', 'cars', { width: 844, height: 390 }]
] as const) {
	test(`${id} performs its ${job} job`, async ({ page }) => {
		await page.setViewportSize(viewport);
		await page.goto(`/?test=1&vehicle=${id}`);
		await start(page);
		const stage = page.getByTestId('stage');

		await expect(stage).toHaveAttribute('data-job', job);
		await page.evaluate(() => (window as any).__vw.complete());
		await expect(stage).toHaveAttribute('data-phase', 'working', { timeout: 3_000 });
		await expect(stage).toHaveAttribute('data-phase', 'assembling', { timeout: 3_000 });
	});
}
