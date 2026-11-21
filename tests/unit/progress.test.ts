import { beforeEach, describe, expect, it } from 'vitest';
import {
	hydratePrefs,
	noteBuildFinished,
	noteBuildStall,
	prefs,
	recordBuild
} from '#lib/preferences.svelte';
import { initialDifficulty } from '#lib/game/difficulty';

describe('progress persistence', () => {
	beforeEach(() => {
		window.localStorage.clear();
		prefs.garage = [];
		prefs.difficulty = initialDifficulty();
		hydratePrefs();
	});

	it('keeps garage entries unique and in build order', () => {
		recordBuild('car');
		recordBuild('bus');
		recordBuild('car');
		expect(prefs.garage).toEqual(['bus', 'car']);
		expect(JSON.parse(window.localStorage.getItem('vw:garage')!)).toEqual(['bus', 'car']);
	});

	it('caps the garage at nine parked vehicles', () => {
		for (let i = 0; i < 12; i++) recordBuild(`v${i}`);
		expect(prefs.garage).toHaveLength(9);
		expect(prefs.garage[8]).toBe('v11');
	});

	it('restores the ramp across a hydrate', () => {
		noteBuildFinished();
		noteBuildFinished();
		noteBuildFinished();
		expect(prefs.difficulty.level).toBe(1);

		prefs.difficulty = initialDifficulty();
		hydratePrefs();
		expect(prefs.difficulty).toEqual({ level: 1, streak: 0, stalls: 0 });
	});

	it('records a stall for an unfinished menu visit', () => {
		noteBuildStall();
		expect(prefs.difficulty.stalls).toBe(1);
	});
});
