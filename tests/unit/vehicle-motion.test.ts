import { beforeEach, describe, expect, it } from 'vitest';
import { PARTS } from '#lib/game/parts';
import { spinFor } from '#lib/render/vehicle';
import { stubPath } from './canvas-recorder';

describe('vehicle motion helpers', () => {
	beforeEach(stubPath);
	it('rolls only circular wheel parts', () => {
		const wheel = PARTS.realCarWheel;
		const body = PARTS.realCarBody;
		expect(spinFor(wheel, 120)).not.toBe(0);
		expect(spinFor(PARTS.realDiggerTracks, 120)).toBe(0);
		expect(spinFor(body, 120)).toBe(0);
	});
});
