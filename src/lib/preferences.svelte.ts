import { readFlag, writeFlag } from './storage';

export interface Settings {
	muted: boolean;
	seenHint: boolean;
	music: number;
	sound: number;
	sfx: number;
}

const KEYS = {
	muted: 'vw:muted',
	seenHint: 'vw:seenHint',
	music: 'vw:music',
	sound: 'vw:sound',
	sfx: 'vw:sfx'
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function readLevel(key: string, fallback: number): number {
	try {
		const raw = window.localStorage.getItem(key);
		if (raw === null) return fallback;
		const value = Number.parseFloat(raw);
		return Number.isFinite(value) ? clamp01(value) : fallback;
	} catch {
		return fallback;
	}
}

function writeLevel(key: string, value: number): void {
	try {
		window.localStorage.setItem(key, String(clamp01(value)));
	} catch {
		// Storage unavailable: the setting simply does not persist.
	}
}

/** The entire persisted state of the game. */
export const prefs = $state({
	muted: false,
	seenHint: false,
	music: 0.5,
	sound: 1,
	sfx: 1
});

export function hydratePrefs(): void {
	prefs.muted = readFlag(KEYS.muted);
	prefs.seenHint = readFlag(KEYS.seenHint);
	prefs.music = readLevel(KEYS.music, 0.5);
	prefs.sound = readLevel(KEYS.sound, 1);
	prefs.sfx = readLevel(KEYS.sfx, 1);
}

export function setMuted(value: boolean): void {
	prefs.muted = value;
	writeFlag(KEYS.muted, value);
}

export function markHintSeen(): void {
	prefs.seenHint = true;
	writeFlag(KEYS.seenHint, true);
}

export function setMusic(value: number): void {
	prefs.music = clamp01(value);
	writeLevel(KEYS.music, prefs.music);
}

export function setSound(value: number): void {
	prefs.sound = clamp01(value);
	writeLevel(KEYS.sound, prefs.sound);
}

export function setSfx(value: number): void {
	prefs.sfx = clamp01(value);
	writeLevel(KEYS.sfx, prefs.sfx);
}
