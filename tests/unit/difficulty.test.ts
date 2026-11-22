import { describe, expect, it } from 'vitest';
import {
	initialDifficulty,
	piecesAtLevel,
	registerFinish,
	registerStall,
	vehicleAtLevel
} from '#lib/game/difficulty';
import { PARTS } from '#lib/game/parts';
import { VEHICLES, getVehicle } from '#lib/game/vehicles';

const kindOf = (part: string): string => {
	const kind = PARTS[part as keyof typeof PARTS]?.kind;
	if (kind) return kind;
	if (['wheel', 'tracks', 'roller'].includes(part)) return 'locomotion';
	if (['body', 'bodyBox'].includes(part)) return 'body';
	return 'detail';
};

describe('difficulty', () => {
	it('starts at four pieces and widens to seven', () => {
		expect([0, 1, 2, 3, 9].map(piecesAtLevel)).toEqual([4, 5, 6, 7, 7]);
	});

	it('gives every vehicle exactly four slots at level 0, keeping locomotion and a body', () => {
		for (const vehicle of VEHICLES) {
			const view = vehicleAtLevel(vehicle, 0);
			expect(view.slots).toHaveLength(4);
			expect(view.slots.some((slot) => kindOf(slot.part) === 'locomotion')).toBe(true);
			expect(view.slots.some((slot) => kindOf(slot.part) === 'body')).toBe(true);
		}
	});

	it('keeps the part that names the vehicle at level 0', () => {
		const signature = (id: string) =>
			vehicleAtLevel(getVehicle(id), 0).slots.map((slot) => slot.part);
		expect(signature('cement-mixer')).toContain('mixer');
		expect(signature('fire-engine')).toContain('realFireLadder');
		expect(signature('digger')).toContain('realDiggerBucket');
		expect(signature('crane-truck')).toContain('boom');
		expect(signature('school-bus')).toContain('realSchoolBusWindows');
		expect(signature('bendy-bus')).toContain('realBendyBusWindows');
		expect(signature('coach-bus')).toContain('realCoachBusWindows');
		expect(signature('airport-shuttle')).toContain('realAirportShuttleWindows');
		expect(signature('mobile-library')).toContain('realMobileLibraryWindows');
		expect(signature('mobile-clinic')).toContain('realMobileClinicWindows');
		expect(signature('trolleybus')).toContain('realTrolleybusWindows');
	});

	it('leaves the full vehicle untouched at level 3', () => {
		const car = getVehicle('car');
		expect(vehicleAtLevel(car, 3)).toBe(car);
	});

	it('promotes after three clean finishes and resets the streak', () => {
		const one = registerFinish(initialDifficulty());
		const two = registerFinish(one);
		const three = registerFinish(two);
		expect(three).toEqual({ level: 1, streak: 0, stalls: 0 });
	});

	it('drops back after two stalls, but never below four pieces', () => {
		const promoted = { level: 1, streak: 2, stalls: 0 };
		const one = registerStall(promoted);
		const two = registerStall(one);
		expect(two).toEqual({ level: 0, streak: 0, stalls: 0 });
		expect(registerStall(initialDifficulty())).toEqual({ level: 0, streak: 0, stalls: 1 });
	});
});
