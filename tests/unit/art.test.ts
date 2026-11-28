import { beforeEach, describe, expect, it, vi } from 'vitest';
import { drawContactShadow } from '#lib/render/vehicle';
import { getVehicle } from '#lib/game/vehicles';
import { computeLayout } from '#lib/game/layout';
import { pieceBoxes } from '#lib/render/tray';

const stubPath = () =>
	vi.stubGlobal(
		'Path2D',
		class {
			constructor(public d: string) {}
		}
	);

function recorder() {
	const calls: string[] = [];
	const noop = (name: string) => () => calls.push(name);
	const ctx = {
		save: noop('save'),
		restore: noop('restore'),
		translate: noop('translate'),
		scale: noop('scale'),
		clip: noop('clip'),
		fill: noop('fill'),
		stroke: noop('stroke'),
		beginPath: noop('beginPath'),
		closePath: noop('closePath'),
		moveTo: noop('moveTo'),
		lineTo: noop('lineTo'),
		arc: noop('arc'),
		ellipse: noop('ellipse'),
		rect: noop('rect'),
		fillRect: noop('fillRect'),
		globalAlpha: 1,
		lineWidth: 1,
		fillStyle: '',
		strokeStyle: ''
	};
	return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

describe('vehicle graphics', () => {
	beforeEach(stubPath);

	it('puts a contact shadow under the vehicle', () => {
		const car = getVehicle('car');
		const layout = computeLayout(
			{ width: 390, height: 844 },
			car,
			pieceBoxes(car),
			{ top: 0, right: 0, bottom: 0, left: 0 },
			120
		);
		const { ctx, calls } = recorder();
		drawContactShadow(ctx, car, layout);
		expect(calls).toContain('ellipse');
		expect(calls).toContain('fill');
	});
});
