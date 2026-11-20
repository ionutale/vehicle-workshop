import { describe, expect, it } from 'vitest';
import { PARTS } from '#lib/game/parts';
import { VEHICLES } from '#lib/game/vehicles';
import { pieceBoxes } from '#lib/render/tray';
import {
	computeLayout,
	packShelf,
	screenToWorld,
	worldToScreen,
	WORLD_HEIGHT
} from '#lib/game/layout';

const car = { width: 480, height: 220 };
const pieces = [
	{ slotId: 'body', w: 440, h: 110 },
	{ slotId: 'wheel-l', w: 68, h: 68 },
	{ slotId: 'wheel-r', w: 68, h: 68 },
	{ slotId: 'cabin', w: 170, h: 78 },
	{ slotId: 'door', w: 56, h: 64 },
	{ slotId: 'light', w: 28, h: 28 }
];
const noInsets = { top: 0, right: 0, bottom: 0, left: 0 };

describe('packShelf', () => {
	it('puts large pieces first and keeps every piece', () => {
		const rows = packShelf(pieces, 430, 16);
		expect(rows[0][0].slotId).toBe('body');
		expect(rows.flat()).toHaveLength(pieces.length);
	});

	it('never splits a piece across rows or exceeds the panel width', () => {
		for (const row of packShelf(pieces, 700, 16)) {
			const width = row.reduce((sum, p) => sum + p.w, 0) + 16 * (row.length - 1);
			expect(width).toBeLessThanOrEqual(700);
		}
	});
});

describe('computeLayout', () => {
	const wide = computeLayout({ width: 844, height: 390 }, car, pieces, noInsets, 34);
	const tall = computeLayout({ width: 390, height: 844 }, car, pieces, noInsets, 34);

	it('keeps an 800-unit world height and derives width from aspect', () => {
		expect(wide.worldHeight).toBe(WORLD_HEIGHT);
		expect(wide.worldWidth).toBeCloseTo((800 * 844) / 390, 5);
		expect(tall.worldWidth).toBeCloseTo((800 * 390) / 844, 5);
	});

	it('scales the vehicle up on a wide viewport but never past 1.8', () => {
		expect(wide.gameScale).toBeLessThanOrEqual(1.8);
		expect(tall.gameScale).toBeLessThanOrEqual(1.8);
		expect(wide.gameScale).toBeGreaterThan(tall.gameScale);
	});

	it('keeps the shelf above the vehicle and the vehicle on the road', () => {
		for (const layout of [wide, tall]) {
			expect(layout.shelf.y + layout.shelf.h).toBeLessThan(layout.roadY);
			expect(layout.vehicleAnchor.y).toBeCloseTo(layout.roadY, 0);
		}
	});

	it('never shrinks the snap radius below 48 world units', () => {
		expect(tall.snapRadius).toBeGreaterThanOrEqual(48);
	});

	it('fits the widest shelf row inside the panel', () => {
		for (const layout of [wide, tall]) {
			for (const row of layout.rows) {
				const right = row.reduce((max, p) => Math.max(max, p.rect.x + p.rect.w), 0);
				expect(right).toBeLessThanOrEqual(layout.shelf.x + layout.shelf.w + 0.001);
			}
		}
	});

	it('round-trips a point between world and screen', () => {
		const viewport = { width: 390, height: 844 };
		const world = screenToWorld(tall, viewport, { x: 120, y: 300 });
		const back = worldToScreen(tall, viewport, world);
		expect(back.x).toBeCloseTo(120, 5);
		expect(back.y).toBeCloseTo(300, 5);
	});
});


describe('every vehicle fits both orientations', () => {
	for (const vp of [
		{ width: 390, height: 844 },
		{ width: 844, height: 390 }
	]) {
		it(`packs the shelf of all 36 vehicles at ${vp.width}x${vp.height}`, () => {
			for (const vehicle of VEHICLES) {
				const boxes = pieceBoxes(vehicle);
				const largest = Math.max(...vehicle.slots.map((slot) => PARTS[slot.part].radius));
				const layout = computeLayout(vp, vehicle, boxes, noInsets, largest);
				for (const row of layout.rows) {
					const right = row.reduce((max, p) => Math.max(max, p.rect.x + p.rect.w), 0);
					expect(right).toBeLessThanOrEqual(layout.shelf.x + layout.shelf.w + 0.001);
				}
				expect(layout.shelf.y + layout.shelf.h).toBeLessThan(layout.roadY);
				expect(layout.gameScale).toBeGreaterThan(0.05);
			}
		});
	}
});
