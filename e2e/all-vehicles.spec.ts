import { expect, test } from '@playwright/test';
import { start } from './helpers';

const IDS = [
	'car',
	'fire-engine',
	'bus',
	'tractor',
	'digger',
	'van',
	'police-car',
	'taxi',
	'limousine',
	'race-car',
	'ambulance',
	'camper',
	'food-truck',
	'ice-cream-van',
	'mini-bus',
	'mail-van',
	'delivery-van',
	'armoured-van',
	'pickup',
	'school-bus',
	'tram',
	'milk-tanker',
	'fuel-tanker',
	'tow-truck',
	'crane-truck',
	'cement-mixer',
	'garbage-truck',
	'flatbed-lorry',
	'log-truck',
	'car-transporter',
	'snow-plough',
	'street-sweeper',
	'road-roller',
	'forklift',
	'bulldozer',
	'monster-truck',
	'combine-harvester',
	'crop-sprayer',
	'hay-baler',
	'telehandler',
	'skid-steer',
	'backhoe-loader',
	'wheel-loader',
	'motor-grader',
	'articulated-hauler',
	'dump-truck',
	'refrigerated-truck',
	'box-truck',
	'curtain-side-lorry',
	'skip-loader',
	'hook-lift-truck',
	'livestock-truck',
	'concrete-pump',
	'water-tanker',
	'gritter-truck',
	'snow-blower',
	'road-planer',
	'asphalt-paver',
	'sewer-cleaner',
	'airport-fuel-bowser',
	'mobile-library',
	'mobile-clinic',
	'parcel-lorry',
	'removals-van',
	'double-decker',
	'bendy-bus',
	'coach-bus',
	'trolleybus',
	'airport-shuttle',
	'light-rail-train',
	'metro-train',
	'aerial-ladder',
	'airport-fire-truck',
	'hazmat-truck',
	'police-van',
	'rescue-truck',
	'cherry-picker',
	'scissor-lift',
	'all-terrain-crane',
	'side-loader-garbage',
	'recycling-truck',
	'mini-dumper',
	'ice-cream-truck',
	'milk-float',
	'steam-roller',
	'quad-bike'
];

test('every vehicle completes and hands off in portrait', async ({ page }) => {
	test.setTimeout(300_000);
	await page.setViewportSize({ width: 390, height: 844 });
	const stage = page.getByTestId('stage');

	for (const id of IDS) {
		await page.goto(`/?test=1&vehicle=${id}&order=fixed`);
		await start(page);
		await expect(stage).toHaveAttribute('data-vehicle', id);
		await page.evaluate(() => (window as any).__vw.complete());
		await expect(stage).toHaveAttribute('data-phase', 'ready');
		await expect(stage).not.toHaveAttribute('data-vehicle', id, { timeout: 5_000 });
	}
});

test('the next vehicle is never the one just built', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');
	await page.evaluate(() => (window as any).__vw.complete());
	await expect(stage).not.toHaveAttribute('data-vehicle', 'car', { timeout: 4_000 });
});


async function dragEverything(page: import('@playwright/test').Page) {
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

for (const viewport of [
	{ width: 390, height: 844 },
	{ width: 844, height: 390 }
]) {
	test(`the car assembles by real drags at ${viewport.width}x${viewport.height}`, async ({ page }) => {
		await page.setViewportSize(viewport);
		await page.goto('/?test=1&vehicle=car');
		await start(page);
		const stage = page.getByTestId('stage');
		await expect(stage).toHaveAttribute('data-vehicle', 'car');

		await dragEverything(page);
		await expect(stage).toHaveAttribute('data-placed', '4');
		await expect(stage).not.toHaveAttribute('data-vehicle', 'car', { timeout: 4_000 });
	});
}

test('a wheel dropped on the other wheel ghost still lands', async ({ page }) => {
	await page.goto('/?test=1&vehicle=car');
	await start(page);
	const stage = page.getByTestId('stage');
	await expect(stage).toHaveAttribute('data-vehicle', 'car');

	const rects = await page.evaluate(() => (window as any).__vw.rects());
	const wheels = rects.slots.filter((s: any) => s.part === 'wheel');
	const piece = rects.shelf.filter((p: any) => p.part === 'wheel')[0];

	// Aim at the far wheel's ghost, not the one nearest the shelf entry.
	const far = wheels.find((w: any) => w.x !== piece.x) ?? wheels[1];
	await page.mouse.move(piece.x + piece.w / 2, piece.y + piece.h / 2);
	await page.mouse.down();
	await page.mouse.move(far.x, far.y, { steps: 8 });
	await page.mouse.up();

	await expect(stage).toHaveAttribute('data-placed', '1');
	const placed = await page.evaluate(() => (window as any).__vw.state().placed);
	expect(placed).toHaveLength(1);
});
