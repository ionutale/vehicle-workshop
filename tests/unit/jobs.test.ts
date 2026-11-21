import { beforeEach, describe, expect, it } from 'vitest';
import { PARTS } from '#lib/game/parts';
import { getVehicle, VEHICLES } from '#lib/game/vehicles';
import { computeLayout } from '#lib/game/layout';
import { pieceBoxes } from '#lib/render/tray';
import { JOB_KINDS, type JobKind } from '#lib/game/jobs';
import { drawJob, jobStage } from '#lib/render/jobs';
import { recorder, stubPath } from './canvas-recorder';

const jobs: JobKind[] = [...JOB_KINDS];

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

	it('keeps every cutscene inside portrait and landscape', () => {
		for (const viewport of [
			{ width: 320, height: 568 },
			{ width: 844, height: 390 }
		]) {
			for (const vehicle of VEHICLES) {
				const layout = computeLayout(
					viewport,
					vehicle,
					pieceBoxes(vehicle),
					{ top: 0, right: 0, bottom: 0, left: 0 },
					Math.max(...vehicle.slots.map((slot) => PARTS[slot.part].radius))
				);
				const stage = jobStage(vehicle, layout);
				expect(stage.centreX - (vehicle.width * stage.scale) / 2).toBeGreaterThanOrEqual(-1);
				expect(stage.right).toBeLessThanOrEqual(layout.worldWidth + 1);
				// The widest prop (the plough mound) reaches about 2.4× the base size.
				expect(stage.propX + stage.size * 2.4).toBeLessThanOrEqual(layout.worldWidth + 1);
			}
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
