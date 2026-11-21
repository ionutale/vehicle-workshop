import { createAssembly } from '../game/assembly';
import type { Layout } from '../game/layout';
import type { Vehicle } from '../game/vehicles';
import { drawVehicle } from './vehicle';

/**
 * A finished vehicle drawn into a menu thumbnail. The same anchors and parts as the game,
 * fitted into the small box with a four-unit margin.
 */
export function drawGarageVehicle(
	ctx: CanvasRenderingContext2D,
	vehicle: Vehicle,
	width: number,
	height: number
): void {
	const margin = 4;
	const scale = Math.max(
		0.001,
		Math.min(
			(width - margin * 2) / Math.max(vehicle.width, 1),
			(height - margin * 2) / Math.max(vehicle.height, 1)
		)
	);
	const origin = {
		x: (width - vehicle.width * scale) / 2,
		y: (height - vehicle.height * scale) / 2
	};
	const state = createAssembly(vehicle, scale, 0, 0, 1, origin);
	const placed = { ...state, placed: vehicle.slots.map((slot) => slot.id) };
	const layout: Layout = {
		worldWidth: width,
		worldHeight: height,
		gameScale: scale,
		shelf: { x: 0, y: 0, w: 0, h: 0 },
		rows: [],
		roadY: height,
		vehicleAnchor: { x: width / 2, y: height / 2 },
		muteButton: { x: 0, y: 0, w: 0, h: 0 },
		snapRadius: 0,
		outline: 1.6
	};

	drawVehicle(ctx, vehicle, placed, layout, 0);
}
