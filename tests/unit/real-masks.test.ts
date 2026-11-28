import { describe, expect, it } from 'vitest';
import { computeLayout } from '#lib/game/layout';
import { PARTS, partName } from '#lib/game/parts';
import { VEHICLES, getVehicle } from '#lib/game/vehicles';
import { REAL_ART } from '#lib/render/realVehicles';

describe('real masks', () => {
	it('keeps every mask inside the art box', () => {
		for (const vehicle of VEHICLES) {
			const spec = REAL_ART[vehicle.id];
			for (const slot of vehicle.slots) {
				const part = PARTS[slot.part];
				const b = part.maskBounds;
				expect(b, part.id).toBeTruthy();
				if (!b) continue;
				expect(b.x, part.id).toBeGreaterThanOrEqual(0);
				expect(b.y, part.id).toBeGreaterThanOrEqual(0);
				expect(b.x + b.w, part.id).toBeLessThanOrEqual(spec.width + 1);
				expect(b.y + b.h, part.id).toBeLessThanOrEqual(spec.height + 1);
			}
		}
	});

	it('fits ten pieces on a phone', () => {
		const car = getVehicle('car');
		const ten = Array.from({ length: 10 }, (_, index) => ({
			slotId: `p${index}`,
			w: 120 + index * 20,
			h: 60 + (index % 3) * 20
		}));
		const layout = computeLayout(
			{ width: 390, height: 844 },
			car,
			ten,
			{ top: 0, right: 0, bottom: 0, left: 0 },
			120
		);
		expect(layout.gameScale).toBeGreaterThanOrEqual(0.4);
		expect(layout.shelf.y + layout.shelf.h).toBeLessThan(layout.roadY - 40);
	});

	it('keeps every part name short enough for the label line', () => {
		// 28 is the longest label already shipped ("Side-loader garbage truck"); new parts
		// must not make the label line longer than the art it names.
		for (const part of Object.values(PARTS)) {
			expect(partName(part.id).length, part.id).toBeLessThanOrEqual(28);
		}
	});
});
