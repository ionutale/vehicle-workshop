import { describe, expect, it } from 'vitest';
import {
	initialDifficulty,
	piecesAtLevel,
	registerFinish,
	registerStall,
	vehicleAtLevel
} from '#lib/game/difficulty';
import { VEHICLES, getVehicle } from '#lib/game/vehicles';

describe('difficulty', () => {
	it('starts at four pieces and widens to seven', () => {
		expect([0, 1, 2, 3, 9].map(piecesAtLevel)).toEqual([4, 5, 6, 7, 7]);
	});

	it('gives every vehicle exactly four slots at level 0, keeping locomotion and a body', () => {
		for (const vehicle of VEHICLES) {
			const view = vehicleAtLevel(vehicle, 0);
			expect(view.slots).toHaveLength(4);
			expect(view.slots.some((slot) => ['wheel', 'tracks', 'roller'].includes(slot.part))).toBe(
				true
			);
			expect(
				view.slots.some((slot) => ['body', 'bodyBox', 'frame', 'seat'].includes(slot.part))
			).toBe(true);
		}
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
