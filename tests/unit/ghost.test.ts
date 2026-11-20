import { describe, expect, it } from 'vitest';
import { createAssembly } from '#lib/game/assembly';
import { computeLayout } from '#lib/game/layout';
import { getVehicle } from '#lib/game/vehicles';
import { drawChassisGhosts } from '#lib/render/vehicle';
import { pieceBoxes } from '#lib/render/tray';
import { vi } from 'vitest';

// jsdom has no Path2D; the renderer only needs construction to succeed.
vi.stubGlobal(
	'Path2D',
	class {
		constructor(public d: string) {}
	}
);

function recordingContext() {
	const calls: Array<[string, number[]]> = [];
	const record =
		(name: string) =>
		(...args: unknown[]) => {
			calls.push([
				name,
				args.map((value) => (typeof value === 'number' ? value : Number.NaN))
			]);
		};
	const ctx = {
		save: record('save'),
		restore: record('restore'),
		translate: record('translate'),
		scale: record('scale'),
		stroke: record('stroke'),
		fill: record('fill'),
		beginPath: record('beginPath'),
		arc: record('arc'),
		ellipse: record('ellipse'),
		setLineDash: record('setLineDash'),
		rect: record('rect'),
		clip: record('clip'),
		globalAlpha: 1,
		lineWidth: 1,
		strokeStyle: '',
		fillStyle: ''
	};
	return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

describe('chassis ghost', () => {
	it('draws the dashed silhouette under the vehicle, not at the world origin', () => {
		const car = getVehicle('car');
		const layout = computeLayout(
			{ width: 390, height: 844 },
			car,
			pieceBoxes(car),
			{ top: 0, right: 0, bottom: 0, left: 0 },
			120
		);
		const origin = { x: 100, y: 500 };
		const state = createAssembly(car, layout.gameScale, layout.snapRadius, 0, 1, origin);
		const { ctx, calls } = recordingContext();

		drawChassisGhosts(ctx, car, state, layout, 0);

		const translate = calls.find(([name]) => name === 'translate');
		expect(translate).toBeDefined();
		expect(translate![1]).toEqual([origin.x, origin.y]);
	});
});
