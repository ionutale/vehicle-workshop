import { describe, expect, it } from 'vitest';
import { VEHICLES, getVehicle } from '#lib/game/vehicles';
import { JOB_KINDS, jobOf } from '#lib/game/jobs';

describe('job mapping', () => {
	it('gives every vehicle a known, specific job', () => {
		for (const vehicle of VEHICLES) expect(JOB_KINDS).toContain(jobOf(vehicle));
		expect(new Set(VEHICLES.map(jobOf)).size).toBeGreaterThanOrEqual(12);
	});

	it('matches the obvious machines', () => {
		expect(jobOf(getVehicle('tow-truck'))).toBe('tow');
		expect(jobOf(getVehicle('cement-mixer'))).toBe('mix');
		expect(jobOf(getVehicle('snow-plough'))).toBe('plough');
		expect(jobOf(getVehicle('street-sweeper'))).toBe('sweep');
		expect(jobOf(getVehicle('road-roller'))).toBe('roll');
		expect(jobOf(getVehicle('concrete-pump'))).toBe('pour');
		expect(jobOf(getVehicle('log-truck'))).toBe('logs');
		expect(jobOf(getVehicle('car-transporter'))).toBe('cars');
		expect(jobOf(getVehicle('forklift'))).toBe('lift');
		expect(jobOf(getVehicle('ambulance'))).toBe('rescue');
		expect(jobOf(getVehicle('police-car'))).toBe('siren');
		expect(jobOf(getVehicle('fire-engine'))).toBe('spray');
		expect(jobOf(getVehicle('school-bus'))).toBe('passengers');
		expect(jobOf(getVehicle('tram'))).toBe('platform');
		expect(jobOf(getVehicle('tractor'))).toBe('harvest');
		expect(jobOf(getVehicle('digger'))).toBe('dig');
		expect(jobOf(getVehicle('milk-tanker'))).toBe('deliver');
		expect(jobOf(getVehicle('taxi'))).toBe('beep');
	});
});
