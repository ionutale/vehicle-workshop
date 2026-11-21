import { beforeEach, describe, expect, it } from 'vitest';
import { createAssembly } from '#lib/game/assembly';
import { getVehicle, VEHICLES } from '#lib/game/vehicles';
import { computeLayout } from '#lib/game/layout';
import { pieceBoxes } from '#lib/render/tray';
import { detailsFor, drawVehicleDetails } from '#lib/render/details';
import { recorder, stubPath } from './canvas-recorder';

describe('vehicle details', () => {
	beforeEach(stubPath);

	it('gives every vehicle at least two details inside its box', () => {
		for (const vehicle of VEHICLES) {
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

	it('gives the fire engine a grille and the bus an exhaust', () => {
		expect(detailsFor(getVehicle('fire-engine')).map((detail) => detail.kind)).toContain('grille');
		expect(detailsFor(getVehicle('school-bus')).map((detail) => detail.kind)).toContain('exhaust');
	});

	it('skips every detail while no part is placed', () => {
		const car = getVehicle('car');
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
