import { describe, expect, it } from 'vitest';
import { CHORDS, MELODY, TEMPO, createMusic } from '#lib/game/music';
import { prefs, hydratePrefs, setMusic, setSfx, setSound } from '#lib/preferences.svelte';

describe('music', () => {
	it('has a four-chord loop and a matching melody grid', () => {
		expect(TEMPO).toBe(84);
		expect(CHORDS).toHaveLength(4);
		expect(MELODY).toHaveLength(4);
		for (const bar of MELODY) expect(bar).toHaveLength(8);
	});

	it('stays silent and safe without an audio context', () => {
		const music = createMusic(undefined);
		expect(() => {
			music.start();
			music.stop();
			music.setVolume(0.4);
		}).not.toThrow();
		expect(music.playing).toBe(false);
	});
});

describe('preferences', () => {
	it('defaults to music 0.5 and full sound and effects', () => {
		hydratePrefs();
		expect(prefs.music).toBe(0.5);
		expect(prefs.sound).toBe(1);
		expect(prefs.sfx).toBe(1);
	});

	it('clamps out-of-range values', () => {
		setMusic(4);
		expect(prefs.music).toBe(1);
		setSound(-2);
		expect(prefs.sound).toBe(0);
		setSfx(0.35);
		expect(prefs.sfx).toBeCloseTo(0.35, 5);
	});

	it('persists levels as decimals and restores them', () => {
		setMusic(0.2);
		setSound(0.7);
		setSfx(0.9);
		expect(localStorage.getItem('vw:music')).toBe('0.2');
		expect(localStorage.getItem('vw:sound')).toBe('0.7');
		expect(localStorage.getItem('vw:sfx')).toBe('0.9');

		prefs.music = 0;
		hydratePrefs();
		expect(prefs.music).toBe(0.2);
	});

	it('falls back to defaults when storage returns nonsense', () => {
		localStorage.setItem('vw:music', 'loud');
		hydratePrefs();
		expect(prefs.music).toBe(0.5);
	});
});
