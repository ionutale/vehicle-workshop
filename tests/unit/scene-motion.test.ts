import { beforeEach, describe, expect, it, vi } from 'vitest';
import { computeLayout } from '#lib/game/layout';
import { motionAt } from '#lib/render/motion';
import { drawFarLayer, drawRoad } from '#lib/render/scene';
import { recorder, stubPath } from './canvas-recorder';

describe('living backdrop', () => {
	beforeEach(stubPath);
	const layout = computeLayout(
		{ width: 390, height: 844 },
		{ width: 500, height: 250 },
		[],
		{ top: 0, right: 0, bottom: 0, left: 0 },
		120
	);

	it('scrolls the road dashes with a positive drive offset', () => {
		const firstDashX = (scrollX: number) => {
			const xs: number[] = [];
			const ctx = {
				fillRect: () => {},
				beginPath: () => {},
				moveTo: (x: number) => xs.push(x),
				lineTo: () => {},
				quadraticCurveTo: () => {},
				closePath: () => {},
				fill: () => {},
				fillStyle: ''
			};
			drawRoad(ctx as unknown as CanvasRenderingContext2D, layout, scrollX);
			return Math.min(...xs);
		};
		expect(firstDashX(120)).toBeLessThan(firstDashX(0));
	});

	it('draws birds and motes only when a motion frame is supplied', () => {
		const still = recorder();
		drawFarLayer(still.ctx, layout, 0, 'countryside');
		const alive = recorder();
		drawFarLayer(alive.ctx, layout, 0, 'countryside', motionAt(12_000, layout.worldWidth, layout.roadY));
		expect(alive.calls.length).toBeGreaterThan(still.calls.length);
		expect(alive.calls.filter((c) => c === 'arc').length).toBeGreaterThan(
			still.calls.filter((c) => c === 'arc').length
		);
	});
});
