import { expect, type Page } from '@playwright/test';

/** The game opens on the menu; every interaction test starts by pressing Play. */
export async function start(page: Page): Promise<void> {
	const play = page.getByRole('button', { name: /^(Play|Resume)$/ });
	await expect(play).toBeVisible({ timeout: 15_000 });
	await play.click();
	await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
}
