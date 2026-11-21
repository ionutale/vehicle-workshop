import { expect, type Page } from '@playwright/test';

/** The game opens on the menu; every interaction test starts by pressing Play. */
export async function start(page: Page): Promise<void> {
	const play = page.getByRole('button', { name: /^(Play|Resume)$/ });
	await expect(play).toBeVisible({ timeout: 15_000 });
	await play.click();
	await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
}

/** Drag every shelf piece to a matching ghost using real mouse moves. */
export async function dragEverything(page: Page): Promise<void> {
	for (let guard = 0; guard < 10; guard++) {
		const snapshot = await page.evaluate(() => ({
			pieces: (window as any).__vw.rects().shelf,
			slots: (window as any).__vw.rects().slots,
			placed: (window as any).__vw.state().placed
		}));
		if (snapshot.pieces.length === 0) return;
		const piece = snapshot.pieces[0];
		const target = snapshot.slots.find(
			(slot: any) => slot.part === piece.part && !snapshot.placed.includes(slot.slotId)
		);
		if (!target) throw new Error(`no slot for ${piece.part}`);
		await page.mouse.move(piece.x + piece.w / 2, piece.y + piece.h / 2);
		await page.mouse.down();
		await page.mouse.move(target.x, target.y, { steps: 8 });
		await page.mouse.up();
	}
	throw new Error('the shelf never emptied');
}
