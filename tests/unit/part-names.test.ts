import { describe, expect, it } from 'vitest';
import { PARTS, partName, type PartId } from '#lib/game/parts';

describe('part names', () => {
	it('names every component for the label and the voice', () => {
		for (const id of Object.keys(PARTS) as PartId[]) {
			expect(partName(id)).toBeTruthy();
			expect(partName(id)).not.toMatch(/real|Strip/);
		}
	});

	it('uses child-friendly names for the realistic kits', () => {
		expect(partName('realFireLadder')).toBe('Ladder');
		expect(partName('realDiggerBucket')).toBe('Bucket');
		expect(partName('realBusWindows')).toBe('Windows');
		expect(partName('realTruckBox')).toBe('Box');
	});
});
