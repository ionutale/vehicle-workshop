import { describe, expect, it } from 'vitest';
import { PARTS } from '#lib/game/parts';
import { circleMask } from '#lib/render/realKit';

describe('realistic part masks', () => {
	it('centres every wheel mask on its bounds', () => {
		const wheels = Object.values(PARTS).filter(
			(part) => part.realVehicle && part.id.endsWith('Wheel')
		);
		expect(wheels.length).toBeGreaterThanOrEqual(12);
		for (const part of wheels) {
			const bounds = part.maskBounds;
			expect(bounds, part.id).toBeTruthy();
			if (!bounds) continue;
			expect(bounds.w, part.id).toBe(bounds.h);
			expect(part.maskPath, part.id).toBe(
				circleMask(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2, bounds.w / 2)
			);
		}
	});
});
