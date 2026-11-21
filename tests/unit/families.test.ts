import { describe, expect, it } from 'vitest';
import { VEHICLES, getVehicle } from '#lib/game/vehicles';
import { familyOf, type VehicleFamily } from '#lib/game/families';

describe('families', () => {
	it('classifies every vehicle into a known family', () => {
		const known: VehicleFamily[] = ['car', 'truck', 'bus', 'farm', 'works', 'emergency', 'rail'];
		for (const vehicle of VEHICLES) expect(known).toContain(familyOf(vehicle));
		expect(new Set(VEHICLES.map(familyOf)).size).toBe(7);
	});

	it('names the obvious ones', () => {
		expect(familyOf(getVehicle('fire-engine'))).toBe('emergency');
		expect(familyOf(getVehicle('tram'))).toBe('rail');
		expect(familyOf(getVehicle('tractor'))).toBe('farm');
		expect(familyOf(getVehicle('digger'))).toBe('works');
		expect(familyOf(getVehicle('school-bus'))).toBe('bus');
		expect(familyOf(getVehicle('milk-tanker'))).toBe('truck');
		expect(familyOf(getVehicle('taxi'))).toBe('car');
	});

});
