import { describe, expect, it } from 'vitest';
import { PARTS } from '#lib/game/parts';
import { FIRST_VEHICLE_ID, VEHICLES, getVehicle, nextVehicleId } from '#lib/game/vehicles';

describe('catalogue', () => {
	it('has a car first', () => {
		expect(FIRST_VEHICLE_ID).toBe('car');
		expect(VEHICLES[0].id).toBe('car');
	});

	it('gives every slot a part that exists', () => {
		for (const v of VEHICLES) for (const slot of v.slots) expect(PARTS[slot.part]).toBeDefined();
	});

	it('uses unique slot ids and between 5 and 7 pieces per vehicle', () => {
		for (const v of VEHICLES) {
			expect(new Set(v.slots.map((s) => s.id)).size).toBe(v.slots.length);
			expect(v.slots.length).toBeGreaterThanOrEqual(5);
			expect(v.slots.length).toBeLessThanOrEqual(7);
		}
	});

	it('declares a colour for every role its parts use', () => {
		for (const v of VEHICLES)
			for (const slot of v.slots)
				expect(v.palette[PARTS[slot.part].role]).toMatch(/^#[0-9A-F]{6}$/i);
	});

	it('keeps every slot anchor inside the vehicle box', () => {
		for (const v of VEHICLES)
			for (const s of v.slots) {
				expect(s.x).toBeGreaterThanOrEqual(0);
				expect(s.x).toBeLessThanOrEqual(v.width);
				expect(s.y).toBeGreaterThanOrEqual(0);
				expect(s.y).toBeLessThanOrEqual(v.height);
			}
	});

	it('never returns the vehicle it just showed', () => {
		if (VEHICLES.length < 2) return; // the one-vehicle catalogue cannot avoid a repeat
		for (const v of VEHICLES) {
			const next = nextVehicleId(v.id, null);
			expect(next).not.toBe(v.id);
		}
	});

	it('finds a vehicle by id', () => {
		expect(getVehicle('car').name).toBe('Car');
	});
});
