import { beforeEach, describe, expect, it } from 'vitest';
import { createAssembly } from '#lib/game/assembly';
import { getVehicle, VEHICLES } from '#lib/game/vehicles';
import { computeLayout } from '#lib/game/layout';
import { pieceBoxes } from '#lib/render/tray';
import { detailsFor, drawVehicleDetails } from '#lib/render/details';
import { recorder, stubPath } from './canvas-recorder';

describe('vehicle details', () => {
	beforeEach(stubPath);

	it('adds no generic details to the realistic fleet', () => {
		for (const vehicle of VEHICLES) {
			expect(vehicle.realistic).toBe(true);
			expect(detailsFor(vehicle)).toEqual([]);
		}
	});

	it('draws nothing over a realistic vehicle', () => {
		const van = getVehicle('van');
		const layout = computeLayout(
			{ width: 390, height: 844 },
			van,
			pieceBoxes(van),
			{ top: 0, right: 0, bottom: 0, left: 0 },
			34
		);
		const base = createAssembly(van, layout.gameScale, layout.snapRadius, 0, 1, { x: 40, y: 300 });
		const painted = recorder();
		drawVehicleDetails(
			painted.ctx,
			van,
			{ ...base, placed: van.slots.map((slot) => slot.id) },
			layout
		);
		expect(painted.calls).toEqual([]);
	});
});
