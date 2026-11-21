import { beforeEach, describe, expect, it } from 'vitest';
import { computeLayout } from '#lib/game/layout';
import { getVehicle } from '#lib/game/vehicles';
import { pieceBoxes } from '#lib/render/tray';
import { drawFarLayer, sceneForBuild, SCENES, type SceneId } from '#lib/render/scene';
import { recorder, stubPath } from './canvas-recorder';

const car = getVehicle('car');
const layout = computeLayout(
	{ width: 390, height: 844 },
	car,
	pieceBoxes(car),
	{ top: 0, right: 0, bottom: 0, left: 0 },
	34
);

describe('scene rotation', () => {
	beforeEach(stubPath);

	it('cycles countryside, town, harbour', () => {
		expect([0, 1, 2, 3, 4].map(sceneForBuild)).toEqual([
			'countryside',
			'town',
			'harbour',
			'countryside',
			'town'
		]);
		expect(SCENES).toHaveLength(3);
	});

	it('draws every backdrop distinctly', () => {
		for (const scene of SCENES) {
			const { ctx, calls } = recorder();
			drawFarLayer(ctx, layout, 0, scene as SceneId);
			expect(calls.length).toBeGreaterThan(10);
		}

		const town = recorder();
		drawFarLayer(town.ctx, layout, 0, 'town');
		expect(town.calls.filter((call) => call === 'fillRect').length).toBeGreaterThan(8);

		const harbour = recorder();
		drawFarLayer(harbour.ctx, layout, 0, 'harbour');
		expect(harbour.calls.filter((call) => call === 'arc').length).toBeGreaterThan(2);
	});
});
