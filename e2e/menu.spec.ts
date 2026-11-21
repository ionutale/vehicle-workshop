import { expect, test } from '@playwright/test';
import { unlockSettings } from './helpers';

test('the menu opens settings and plays', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();

	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page.getByRole('slider', { name: 'Music' })).toBeVisible();
	await expect(page.getByRole('slider', { name: 'Sound', exact: true })).toBeVisible();
	await expect(page.getByRole('slider', { name: 'Sound effects' })).toBeVisible();

	await page.getByRole('button', { name: 'Back' }).click();
	await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();

	await page.getByRole('button', { name: 'Play' }).click();
	await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Play' })).toHaveCount(0);
});

test('a slider change survives a reload', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Settings' }).click();
	await unlockSettings(page);
	const music = page.getByRole('slider', { name: 'Music' });
	await music.evaluate((element: HTMLInputElement) => {
		element.value = '20';
		element.dispatchEvent(new Event('input', { bubbles: true }));
	});
	await expect
		.poll(() => page.evaluate(() => window.localStorage.getItem('vw:music')))
		.toBe('0.2');

	await page.reload();
	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page.getByRole('slider', { name: 'Music' })).toHaveValue('20');
});

test('settings start locked and unlock only with a deliberate hold', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Settings' }).click();
	const music = page.getByRole('slider', { name: 'Music' });
	await expect(music).toBeDisabled();

	await page.getByRole('button', { name: 'Unlock settings' }).click();
	await expect(music).toBeDisabled();

	await unlockSettings(page);
	await expect(music).toBeEnabled();
	await page.getByRole('button', { name: 'Lock settings' }).click();
	await expect(music).toBeDisabled();

	await unlockSettings(page);
	await page.getByRole('button', { name: 'Back' }).click();
	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page.getByRole('slider', { name: 'Music' })).toBeDisabled();
});

test('the page cannot be zoomed or text-selected', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
	const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
	expect(viewport).toContain('user-scalable=no');
	expect(viewport).toContain('maximum-scale=1');

	const selectable = await page.evaluate(
		() => getComputedStyle(document.body).userSelect || getComputedStyle(document.body).webkitUserSelect
	);
	expect(selectable).toBe('none');
});
