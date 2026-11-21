import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getVehicle } from '#lib/game/vehicles';
import { drawGarageVehicle } from '#lib/render/garage';

const stubPath = () =>
	vi.stubGlobal(
		'Path2D',
		class {
			constructor(public d: string) {}
		}
	);

function recorder() {
	const calls: string[] = [];
	const record = (name: string) => () => calls.push(name);
	const ctx = {
		save: record('save'),
		restore: record('restore'),
		translate: record('translate'),
		scale: record('scale'),
		clip: record('clip'),
		fill: record('fill'),
		stroke: record('stroke'),
		beginPath: record('beginPath'),
		closePath: record('closePath'),
		moveTo: record('moveTo'),
		lineTo: record('lineTo'),
		quadraticCurveTo: record('quadraticCurveTo'),
		arc: record('arc'),
		ellipse: record('ellipse'),
		fillRect: record('fillRect'),
		globalAlpha: 1,
		lineWidth: 1,
		strokeStyle: '',
		fillStyle: ''
	};
	return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

describe('garage thumbnail', () => {
	beforeEach(stubPath);

	it('draws a complete vehicle into the box', () => {
		const { ctx, calls } = recorder();
		drawGarageVehicle(ctx, getVehicle('car'), 64, 40);
		expect(calls.filter((call) => call === 'fill').length).toBeGreaterThan(4);
		expect(calls.filter((call) => call === 'stroke').length).toBeGreaterThan(0);
	});
});
