import { describe, expect, it, vi } from 'vitest';
import { TONES, VOICES, createAudioBus } from '#lib/game/audio';

function fakeContext() {
	const osc = {
		type: 'sine',
		frequency: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
		connect: vi.fn(),
		start: vi.fn(),
		stop: vi.fn()
	};
	const gain = {
		gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
		connect: vi.fn()
	};
	const ctx = {
		currentTime: 0,
		state: 'running',
		destination: {},
		createOscillator: () => osc,
		createGain: () => gain,
		createBufferSource: () => ({ buffer: null, connect: vi.fn(), start: vi.fn(), stop: vi.fn() }),
		createBuffer: () => ({ getChannelData: () => new Float32Array(64) }),
		createBiquadFilter: () => ({ type: 'lowpass', frequency: { setValueAtTime: vi.fn() }, connect: vi.fn() }),
		resume: vi.fn(),
		close: vi.fn()
	} as unknown as AudioContext;
	return { ctx, osc };
}

describe('audio', () => {
	it('uses a rising two-note completion chime', () => {
		expect(TONES.completeB).toBeGreaterThan(TONES.completeA);
	});

	it('ramps the engine upward', () => {
		expect(TONES.engineTo).toBeGreaterThan(TONES.engineFrom);
	});

	it('does nothing without an AudioContext', () => {
		const bus = createAudioBus(undefined);
		expect(() => {
			bus.unlock();
			bus.pick();
			bus.snap();
			bus.complete();
			bus.engine();
			bus.voice('car');
		}).not.toThrow();
	});

	it('respects mute', () => {
		const { ctx, osc } = fakeContext();
		const bus = createAudioBus(ctx);
		bus.setMuted(true);
		bus.pick();
		expect(osc.start).not.toHaveBeenCalled();
	});

	it('plays a tone when unmuted', () => {
		const { ctx, osc } = fakeContext();
		const bus = createAudioBus(ctx);
		bus.pick();
		expect(osc.start).toHaveBeenCalled();
	});

	it('gives every family a distinct voice and mutes it with the rest', () => {
		const families = ['car', 'truck', 'bus', 'farm', 'works', 'emergency', 'rail'] as const;
		for (const family of families) expect(VOICES[family].length).toBeGreaterThan(0);
		expect(new Set(families.map((family) => VOICES[family][0].frequency)).size).toBe(7);
		expect(VOICES.emergency.some((note) => note.endFrequency !== undefined)).toBe(true);

		const { ctx } = fakeContext();
		const bus = createAudioBus(ctx);
		bus.setMuted(true);
		expect(() => bus.voice('emergency')).not.toThrow();
	});

	it('cancels scheduled notes when muted, closed or replaced', () => {
		vi.useFakeTimers();
		const { ctx, osc } = fakeContext();
		const bus = createAudioBus(ctx);

		bus.voice('emergency');
		bus.setMuted(true);
		vi.runAllTimers();
		expect(osc.start).not.toHaveBeenCalled();

		bus.setMuted(false);
		bus.voice('rail');
		bus.close();
		vi.runAllTimers();
		expect(osc.start).not.toHaveBeenCalled();

		vi.useRealTimers();
	});
});
