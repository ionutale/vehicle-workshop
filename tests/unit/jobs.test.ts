import { beforeEach, describe, expect, it } from 'vitest';
import { getVehicle } from '#lib/game/vehicles';
import { computeLayout } from '#lib/game/layout';
import { pieceBoxes } from '#lib/render/tray';
import type { JobKind } from '#lib/game/families';
import { drawJob } from '#lib/render/jobs';
import { recorder, stubPath } from './canvas-recorder';

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
