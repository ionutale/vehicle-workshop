import { beforeEach, describe, expect, it } from 'vitest';
import { createAssembly } from '#lib/game/assembly';
import { vehicleAtLevel } from '#lib/game/difficulty';
import { getVehicle, VEHICLES } from '#lib/game/vehicles';
import { computeLayout } from '#lib/game/layout';
import { pieceBoxes } from '#lib/render/tray';
import { detailsFor, drawVehicleDetails } from '#lib/render/details';
import { recorder, stubPath } from './canvas-recorder';

describe('vehicle details', () => {
	beforeEach(stubPath);

	it('gives every generic vehicle at least two details inside its box', () => {
		for (const vehicle of VEHICLES) {
			if (vehicle.realistic) {
				expect(detailsFor(vehicle)).toEqual([]);
				continue;
			}
			const details = detailsFor(vehicle);
			expect(details.length).toBeGreaterThanOrEqual(2);
			for (const detail of details) {
				expect(detail.x).toBeGreaterThanOrEqual(-12);
				expect(detail.x).toBeLessThanOrEqual(vehicle.width + 12);
				expect(detail.y).toBeGreaterThanOrEqual(-12);
				expect(detail.y).toBeLessThanOrEqual(vehicle.height + 12);
			}
		}
	});

	it('gives a generic truck a grille and a delivery van an exhaust', () => {
		expect(detailsFor(getVehicle('delivery-van')).map((detail) => detail.kind)).toContain('grille');
		expect(detailsFor(getVehicle('delivery-van')).map((detail) => detail.kind)).toContain('exhaust');
	});

	it('puts the grille at the nose of right-facing and rear-cab machines', () => {
		const grille = (id: string) => detailsFor(getVehicle(id)).find((d) => d.kind === 'grille')!;
		for (const id of ['taxi', 'monster-truck', 'bulldozer', 'skid-steer', 'steam-roller']) {
			expect(grille(id).x).toBeGreaterThan(getVehicle(id).width / 2);
		}
		expect(grille('delivery-van').x).toBeLessThan(getVehicle('delivery-van').width / 2);
		expect(grille('refrigerated-truck').x).toBeLessThan(getVehicle('refrigerated-truck').width / 2);
	});

	it('keeps the facing when the level view has trimmed the cab away', () => {
		const truck = getVehicle('fuel-tanker');
		const trimmed = vehicleAtLevel(truck, 0);
		expect(trimmed.slots.some((slot) => slot.part === 'cab')).toBe(false);
		const grille = detailsFor(trimmed).find((detail) => detail.kind === 'grille')!;
		expect(grille.x).toBeLessThan(truck.width / 2);
	});

	it('only references slot ids that exist', () => {
		for (const vehicle of VEHICLES) {
			const ids = new Set(vehicle.slots.map((slot) => slot.id));
			for (const detail of detailsFor(vehicle)) {
				if (detail.requires) expect(ids.has(detail.requires)).toBe(true);
			}
		}
	});

	it('draws only details whose supporting part is placed', () => {
		const car = getVehicle('taxi');
		const layout = computeLayout(
			{ width: 390, height: 844 },
			car,
			pieceBoxes(car),
			{ top: 0, right: 0, bottom: 0, left: 0 },
			34
		);
		const base = createAssembly(car, layout.gameScale, layout.snapRadius, 0, 1, { x: 40, y: 300 });
		const wheel = car.slots.find((slot) => slot.part === 'wheel')!;

		const wheelOnly = recorder();
		drawVehicleDetails(wheelOnly.ctx, car, { ...base, placed: [wheel.id] }, layout);
		const everything = recorder();
		drawVehicleDetails(
			everything.ctx,
			car,
			{ ...base, placed: car.slots.map((slot) => slot.id) },
			layout
		);

		expect(wheelOnly.calls.length).toBeGreaterThan(0);
		expect(wheelOnly.calls.length).toBeLessThan(everything.calls.length);
	});

	it('skips every detail while no part is placed', () => {
		const car = getVehicle('taxi');
		const layout = computeLayout(
			{ width: 390, height: 844 },
			car,
			pieceBoxes(car),
			{ top: 0, right: 0, bottom: 0, left: 0 },
			34
		);
		const state = createAssembly(car, layout.gameScale, layout.snapRadius, 0, 1, { x: 40, y: 300 });
		const { ctx, calls } = recorder();
		drawVehicleDetails(ctx, car, state, layout);
		expect(calls).toHaveLength(0);
	});
});
