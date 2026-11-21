import { expect, test } from '@playwright/test';
import { start } from './helpers';

test.use({
	viewport: { width: 390, height: 844 },
	userAgent:
		'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
});

test('the iOS install hint appears after two builds and stays dismissed', async ({ page }) => {
	await page.goto('/?test=1&level=3&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');

	await page.getByRole('button', { name: 'Menu' }).click();
	await expect(page.getByTestId('install-hint')).toHaveCount(0);
	await page.getByRole('button', { name: 'Resume' }).click();

	for (let build = 0; build < 2; build++) {
		await page.evaluate(() => (window as any).__vw.complete());
		await expect
			.poll(() => page.evaluate(() => (window as any).__vw.state().phase), { timeout: 5_000 })
			.toBe('assembling');
	}

	await page.getByRole('button', { name: 'Menu' }).click();
	await expect(page.getByTestId('install-hint')).toBeVisible();
	await expect(page.getByText(/Tap Share, then Add to Home Screen/i)).toBeVisible();

	await page.getByRole('button', { name: 'Dismiss install hint' }).click();
	await expect(page.getByTestId('install-hint')).toHaveCount(0);

	await page.reload();
	await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
	await expect(page.getByTestId('install-hint')).toHaveCount(0);
	expect(await page.evaluate(() => window.localStorage.getItem('vw:installDismissed'))).toBe('1');
});
