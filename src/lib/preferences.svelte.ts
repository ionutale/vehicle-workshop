import { readFlag, writeFlag } from './storage';

/** The entire persisted state of the game: muted, and whether the hand hint was seen. */
export const prefs = $state({
	muted: false,
	seenHint: false
});

const MUTED_KEY = 'vw:muted';
const HINT_KEY = 'vw:seenHint';

export function hydratePrefs(): void {
	prefs.muted = readFlag(MUTED_KEY);
	prefs.seenHint = readFlag(HINT_KEY);
}

export function setMuted(value: boolean): void {
	prefs.muted = value;
	writeFlag(MUTED_KEY, value);
}

export function markHintSeen(): void {
	prefs.seenHint = true;
	writeFlag(HINT_KEY, true);
}
