/**
 * Feedback sounds, synthesised at runtime so there is nothing to cache and the engine ramp
 * is a parameter change rather than an asset. Three independent levels feed a master gain:
 * music, sound effects, and the master the mute toggle drives.
 */

import type { VehicleFamily } from './families';

export const TONES = {
	pick: 660,
	snap: 220,
	completeA: 523,
	completeB: 659,
	completeC: 784,
	engineFrom: 80,
	engineTo: 140
};

export const MASTER_GAIN = 0.2;

export interface VoiceNote {
	/** Milliseconds from the start of the signature. */
	at: number;
	frequency: number;
	duration: number;
	type: OscillatorType;
	endFrequency?: number;
}

/** One short, recognisable signature per family, all synthesised from the same oscillator. */
export const VOICES: Record<VehicleFamily, VoiceNote[]> = {
	car: [
		{ at: 0, frequency: 740, duration: 0.1, type: 'triangle' },
		{ at: 110, frequency: 988, duration: 0.12, type: 'triangle' }
	],
	truck: [{ at: 0, frequency: 196, duration: 0.34, type: 'square', endFrequency: 174 }],
	bus: [
		{ at: 0, frequency: 330, duration: 0.22, type: 'square' },
		{ at: 90, frequency: 392, duration: 0.24, type: 'square' }
	],
	farm: [
		{ at: 0, frequency: 147, duration: 0.13, type: 'triangle' },
		{ at: 190, frequency: 147, duration: 0.13, type: 'triangle' }
	],
	works: [
		{ at: 0, frequency: 440, duration: 0.12, type: 'square' },
		{ at: 180, frequency: 440, duration: 0.12, type: 'square' }
	],
	emergency: [
		{ at: 0, frequency: 950, duration: 0.5, type: 'sawtooth', endFrequency: 650 },
		{ at: 520, frequency: 800, duration: 0.5, type: 'sawtooth' }
	],
	rail: [
		{ at: 0, frequency: 1200, duration: 0.24, type: 'sine' },
		{ at: 300, frequency: 1200, duration: 0.24, type: 'sine' }
	]
};

export interface Volumes {
	master: number;
	music: number;
	sfx: number;
}

export interface AudioBus {
	unlock(): void;
	pick(): void;
	snap(): void;
	complete(): void;
	engine(): void;
	voice(family: VehicleFamily): void;
	setMuted(muted: boolean): void;
	setVolumes(volumes: Partial<Volumes>): void;
	/** Where a music generator should connect. */
	musicInput(): AudioNode | null;
	context(): AudioContext | undefined;
	close(): void;
}

export function createAudioBus(context?: AudioContext): AudioBus {
	let muted = false;
	let volumes: Volumes = { master: 1, music: 0.5, sfx: 1 };
	let master: GainNode | null = null;
	let sfx: GainNode | null = null;
	let music: GainNode | null = null;

	const ready = () => (context && !muted ? context : null);

	const ensureMaster = (ctx: AudioContext) => {
		if (!master) {
			master = ctx.createGain();
			master.gain.setValueAtTime(MASTER_GAIN * volumes.master, ctx.currentTime);
			master.connect(ctx.destination);
			sfx = ctx.createGain();
			sfx.gain.setValueAtTime(volumes.sfx, ctx.currentTime);
			sfx.connect(master);
			music = ctx.createGain();
			music.gain.setValueAtTime(volumes.music, ctx.currentTime);
			music.connect(master);
		}
		return { master, sfx: sfx!, music: music! };
	};

	const tone = (
		ctx: AudioContext,
		frequency: number,
		duration: number,
		type: OscillatorType = 'sine',
		endFrequency?: number
	) => {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(frequency, ctx.currentTime);
		if (endFrequency !== undefined) {
			osc.frequency.linearRampToValueAtTime(endFrequency, ctx.currentTime + duration);
		}
		gain.gain.setValueAtTime(0.9, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
		osc.connect(gain);
		gain.connect(ensureMaster(ctx).sfx);
		osc.start();
		osc.stop(ctx.currentTime + duration + 0.02);
	};

	const click = (ctx: AudioContext, duration: number) => {
		const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
		const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < length; i++) {
			data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
		}
		const source = ctx.createBufferSource();
		source.buffer = buffer;
		const filter = ctx.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(1200, ctx.currentTime);
		const gain = ctx.createGain();
		gain.gain.setValueAtTime(0.5, ctx.currentTime);
		source.connect(filter);
		filter.connect(gain);
		gain.connect(ensureMaster(ctx).sfx);
		source.start();
		source.stop(ctx.currentTime + duration);
	};

	return {
		unlock() {
			if (!context) return;
			if (context.state === 'suspended') void context.resume();
		},
		pick() {
			const ctx = ready();
			if (!ctx) return;
			tone(ctx, TONES.pick, 0.06);
		},
		snap() {
			const ctx = ready();
			if (!ctx) return;
			click(ctx, 0.12);
			tone(ctx, TONES.snap, 0.1);
		},
		complete() {
			const ctx = ready();
			if (!ctx) return;
			const notes = [TONES.completeA, TONES.completeB, TONES.completeC];
			notes.forEach((frequency, index) => {
				window.setTimeout(() => {
					const later = ready();
					if (later) tone(later, frequency, 0.24, 'triangle');
				}, index * 95);
			});
		},
		engine() {
			const ctx = ready();
			if (!ctx) return;
			tone(ctx, TONES.engineFrom, 0.7, 'sawtooth', TONES.engineTo);
		},
		voice(family) {
			for (const note of VOICES[family]) {
				window.setTimeout(() => {
					const ctx = ready();
					if (ctx) tone(ctx, note.frequency, note.duration, note.type, note.endFrequency);
				}, note.at);
			}
		},
		setMuted(value: boolean) {
			muted = value;
			if (master && context) master.gain.setValueAtTime(value ? 0 : MASTER_GAIN * volumes.master, context.currentTime);
		},
		setVolumes(next: Partial<Volumes>) {
			volumes = { ...volumes, ...next };
			if (!context) return;
			const nodes = ensureMaster(context);
			nodes.master.gain.setValueAtTime(muted ? 0 : MASTER_GAIN * volumes.master, context.currentTime);
			nodes.sfx.gain.setValueAtTime(volumes.sfx, context.currentTime);
			nodes.music.gain.setValueAtTime(volumes.music, context.currentTime);
		},
		musicInput() {
			if (!context) return null;
			return ensureMaster(context).music;
		},
		context() {
			return context;
		},
		close() {
			if (context && context.state !== 'closed') void context.close();
		}
	};
}

/** The browser's context factory, or undefined where WebAudio is unavailable. */
export function createBrowserAudioBus(): AudioBus {
	const Ctor =
		typeof window !== 'undefined'
			? window.AudioContext ??
				(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
			: undefined;
	return createAudioBus(Ctor ? new Ctor() : undefined);
}
