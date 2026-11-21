import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getVehicle } from '#lib/game/vehicles';
import { computeLayout } from '#lib/game/layout';
import { pieceBoxes } from '#lib/render/tray';
import type { JobKind } from '#lib/game/families';
import { drawJob } from '#lib/render/jobs';

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
		rect: record('rect'),
		fillRect: record('fillRect'),
		setLineDash: record('setLineDash'),
		globalAlpha: 1,
		lineWidth: 1,
		strokeStyle: '',
		fillStyle: ''
	};
	return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

const jobs: JobKind[] = ['beep', 'deliver', 'passengers', 'harvest', 'dig', 'spray', 'siren', 'platform'];

describe('job cutscene', () => {
	beforeEach(stubPath);

	it('draws every job without leaving the road', () => {
		const car = getVehicle('car');
		const layout = computeLayout(
			{ width: 390, height: 844 },
			car,
			pieceBoxes(car),
			{ top: 0, right: 0, bottom: 0, left: 0 },
			34
		);

		for (const job of jobs) {
			const { ctx, calls } = recorder();
			drawJob(ctx, car, job, layout, 0.5, false);
			expect(calls.length).toBeGreaterThan(8);
		}
	});

	it('still draws a static beat with reduced motion', () => {
		const car = getVehicle('car');
		const layout = computeLayout(
			{ width: 390, height: 844 },
			car,
			pieceBoxes(car),
			{ top: 0, right: 0, bottom: 0, left: 0 },
			34
		);
		for (const job of jobs) {
			const { ctx, calls } = recorder();
			drawJob(ctx, car, job, layout, 0.5, true);
			expect(calls.length).toBeGreaterThan(8);
		}
	});
});
