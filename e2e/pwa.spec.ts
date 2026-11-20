import { expect, test } from '@playwright/test';

test('the app opens offline after one visit', async ({ page, context }) => {
	await page.goto('/');
	await page.waitForFunction(() => navigator.serviceWorker?.controller !== null, undefined, {
		timeout: 20_000
	});
	await context.setOffline(true);
	await page.reload();
	await expect(page.getByTestId('stage')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
});
