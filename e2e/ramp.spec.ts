import { expect, test } from '@playwright/test';
import { dragEverything, start } from './helpers';

test('the first vehicle asks for four pieces and widens after three builds', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');

	await expect(stage).toHaveAttribute('data-level', '0');
	await expect(stage).toHaveAttribute('data-tray', '4');

	for (let build = 0; build < 3; build++) {
		await page.evaluate(() => (window as any).__vw.complete());
		await expect
			.poll(() => page.evaluate(() => (window as any).__vw.builds()))
			.toBeGreaterThan(build);
		// Poll the state, not the painted attribute: the attribute can still read the
		// previous assembling phase on the same tick the completion happened.
		await expect
			.poll(() => page.evaluate(() => (window as any).__vw.state().phase), { timeout: 5_000 })
			.toBe('assembling');
	}

	await expect.poll(() => page.evaluate(() => (window as any).__vw.level())).toBe(1);
	await expect(stage).toHaveAttribute('data-level', '1');

	await page.reload();
	await start(page);
	await expect(page.getByTestId('stage')).toHaveAttribute('data-level', '1');
	await expect(page.getByTestId('stage')).toHaveAttribute('data-tray', '5');
});

test('the second vehicle is completable by real drags at level 0', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');

	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).not.toHaveAttribute('data-vehicle', 'car', { timeout: 5_000 });
	await expect(stage).toHaveAttribute('data-phase', 'assembling');
	const next = await stage.getAttribute('data-vehicle');

	await expect(stage).toHaveAttribute('data-tray', '4');
	await dragEverything(page);
	await expect(stage).toHaveAttribute('data-placed', '4');
	await expect(stage).not.toHaveAttribute('data-vehicle', next!, { timeout: 5_000 });
});
