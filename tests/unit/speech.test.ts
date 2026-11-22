import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prefs } from '#lib/preferences.svelte';
import { speakPart } from '#lib/game/speech';

const speak = vi.fn();
const cancel = vi.fn();

class FakeUtterance {
	lang = '';
	rate = 1;
	pitch = 1;
	volume = 1;
	voice: unknown = null;
	constructor(public text: string) {}
}

describe('spoken part names', () => {
	beforeEach(() => {
		prefs.muted = false;
		prefs.sound = 1;
		prefs.voices = 1;
		speak.mockClear();
		cancel.mockClear();
		vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
		Object.defineProperty(window, 'speechSynthesis', {
			configurable: true,
			value: { speak, cancel, getVoices: () => [{ lang: 'en-GB' }] }
		});
	});

	it('speaks the name at the voices × sound level', () => {
		prefs.voices = 0.5;
		prefs.sound = 0.8;
		const volume = speakPart('Ladder');

		expect(cancel).toHaveBeenCalled();
		expect(speak).toHaveBeenCalledTimes(1);
		const utterance = speak.mock.calls[0][0] as FakeUtterance;
		expect(utterance.text).toBe('Ladder');
		expect(utterance.volume).toBeCloseTo(0.4, 5);
		expect(volume).toBeCloseTo(0.4, 5);
	});

	it('stays silent when muted or the voice level is zero', () => {
		prefs.muted = true;
		expect(speakPart('Wheel')).toBe(0);
		expect(speak).not.toHaveBeenCalled();

		prefs.muted = false;
		prefs.voices = 0;
		expect(speakPart('Wheel')).toBe(0);
		expect(speak).not.toHaveBeenCalled();
	});

	it('does not throw when speech is unavailable', () => {
		vi.stubGlobal('SpeechSynthesisUtterance', undefined);
		expect(() => speakPart('Cab')).not.toThrow();
	});
});
