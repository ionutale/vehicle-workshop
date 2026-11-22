import {
	initialDifficulty,
	MAX_LEVEL,
	registerFinish,
	registerStall,
	type DifficultyState
} from './game/difficulty';
import { VEHICLES } from './game/vehicles';
import { readFlag, readJson, writeFlag, writeJson } from './storage';

export interface Settings {
	muted: boolean;
	seenHint: boolean;
	music: number;
	sound: number;
	sfx: number;
	voices: number;
}

const KEYS = {
	muted: 'vw:muted',
	seenHint: 'vw:seenHint',
	music: 'vw:music',
	sound: 'vw:sound',
	sfx: 'vw:sfx',
	voices: 'vw:voices',
	garage: 'vw:garage',
	difficulty: 'vw:difficulty'
};

export const GARAGE_LIMIT = 9;

function isDifficulty(value: unknown): value is DifficultyState {
	if (!value || typeof value !== 'object') return false;
	const candidate = value as Record<string, unknown>;
	return ['level', 'streak', 'stalls'].every(
		(key) => typeof candidate[key] === 'number' && Number.isFinite(candidate[key])
	);
}

function cleanDifficulty(value: DifficultyState): DifficultyState {
	const whole = (n: number) => Math.max(0, Math.floor(n));
	return {
		level: Math.min(MAX_LEVEL, whole(value.level)),
		streak: Math.min(2, whole(value.streak)),
		stalls: Math.min(2, whole(value.stalls))
	};
}

const VEHICLE_IDS = new Set(VEHICLES.map((vehicle) => vehicle.id));

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
	sfx: 1,
	voices: 1,
	garage: [] as string[],
	difficulty: initialDifficulty()
});

export function hydratePrefs(): void {
	prefs.muted = readFlag(KEYS.muted);
	prefs.seenHint = readFlag(KEYS.seenHint);
	prefs.music = readLevel(KEYS.music, 0.5);
	prefs.sound = readLevel(KEYS.sound, 1);
	prefs.sfx = readLevel(KEYS.sfx, 1);
	prefs.voices = readLevel(KEYS.voices, 1);
	prefs.garage = readJson<string[]>(
		KEYS.garage,
		[],
		(value): value is string[] =>
			Array.isArray(value) && value.every((entry) => typeof entry === 'string')
	)
		.filter((id, index, all) => VEHICLE_IDS.has(id) && all.indexOf(id) === index)
		.slice(-GARAGE_LIMIT);
	prefs.difficulty = cleanDifficulty(
		readJson<DifficultyState>(KEYS.difficulty, initialDifficulty(), isDifficulty)
	);
}

/** Park a finished vehicle at the end of the shelf; replaying it moves it to the front. */
export function recordBuild(vehicleId: string): void {
	const garage = [...prefs.garage.filter((id) => id !== vehicleId), vehicleId].slice(-GARAGE_LIMIT);
	prefs.garage = garage;
	writeJson(KEYS.garage, garage);
}

export function noteBuildFinished(): void {
	prefs.difficulty = registerFinish(prefs.difficulty);
	writeJson(KEYS.difficulty, prefs.difficulty);
}

export function noteBuildStall(): void {
	prefs.difficulty = registerStall(prefs.difficulty);
	writeJson(KEYS.difficulty, prefs.difficulty);
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

export function setVoices(value: number): void {
	prefs.voices = clamp01(value);
	writeLevel(KEYS.voices, prefs.voices);
}
