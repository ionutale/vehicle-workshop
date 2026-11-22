/**
 * Feedback sounds, synthesised at runtime so there is nothing to cache and the engine ramp
 * is a parameter change rather than an asset. Three independent levels feed a master gain:
 * music, sound effects, and the master the mute toggle drives.
 */

import type { VehicleFamily } from './families';
import type { JobKind } from './jobs';

export const TONES = {
	pick: 660,
	snap: 220,
	completeA: 523,
	completeB: 659,
	completeC: 784,
	engineFrom: 80,
	engineTo: 140
};

export const MASTER_GAIN = 0.28;

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
	voices: number;
}

export interface JobNote {
	at: number;
	frequency: number;
	duration: number;
	type: OscillatorType;
	endFrequency?: number;
}

export interface JobSound {
	notes: JobNote[];
	noise?: { at?: number; duration: number; frequency: number; level: number; type?: BiquadFilterType };
}

/** Short, characterful effects for each job beat, all from the same oscillator/noise kit. */
export const JOB_SOUNDS: Record<JobKind, JobSound> = {
	beep: {
		notes: [
			{ at: 0, frequency: 420, duration: 0.12, type: 'square' },
			{ at: 150, frequency: 520, duration: 0.12, type: 'square' }
		]
	},
	deliver: {
		notes: [{ at: 0, frequency: 90, duration: 0.2, type: 'sine' }],
		noise: { duration: 0.16, frequency: 260, level: 0.22, type: 'lowpass' }
	},
	passengers: {
		notes: [
			{ at: 0, frequency: 660, duration: 0.18, type: 'sine' },
			{ at: 130, frequency: 880, duration: 0.24, type: 'sine' }
		]
	},
	harvest: {
		notes: [{ at: 0, frequency: 110, duration: 0.22, type: 'triangle' }],
		noise: { duration: 0.3, frequency: 1500, level: 0.14, type: 'highpass' }
	},
	dig: {
		notes: [{ at: 80, frequency: 160, duration: 0.14, type: 'triangle' }],
		noise: { duration: 0.24, frequency: 500, level: 0.3, type: 'lowpass' }
	},
	spray: {
		notes: [],
		noise: { duration: 0.5, frequency: 2200, level: 0.18, type: 'highpass' }
	},
	siren: {
		notes: [
			{ at: 0, frequency: 760, duration: 0.18, type: 'square' },
			{ at: 210, frequency: 560, duration: 0.18, type: 'square' }
		]
	},
	platform: {
		notes: [
			{ at: 0, frequency: 1046, duration: 0.4, type: 'sine' },
			{ at: 180, frequency: 784, duration: 0.3, type: 'sine' }
		]
	},
	tow: {
		notes: [{ at: 0, frequency: 220, duration: 0.38, type: 'sawtooth', endFrequency: 300 }],
		noise: { at: 40, duration: 0.16, frequency: 900, level: 0.12, type: 'lowpass' }
	},
	mix: {
		notes: [{ at: 0, frequency: 80, duration: 0.55, type: 'sawtooth' }],
		noise: { duration: 0.4, frequency: 350, level: 0.16, type: 'lowpass' }
	},
	plough: {
		notes: [{ at: 0, frequency: 120, duration: 0.22, type: 'triangle' }],
		noise: { duration: 0.38, frequency: 900, level: 0.22, type: 'lowpass' }
	},
	sweep: {
		notes: [],
		noise: { duration: 0.34, frequency: 2600, level: 0.14, type: 'highpass' }
	},
	roll: {
		notes: [{ at: 0, frequency: 65, duration: 0.55, type: 'sawtooth', endFrequency: 85 }],
		noise: { duration: 0.4, frequency: 400, level: 0.14, type: 'lowpass' }
	},
	pour: {
		notes: [{ at: 0, frequency: 140, duration: 0.3, type: 'sine' }],
		noise: { duration: 0.45, frequency: 900, level: 0.18, type: 'bandpass' }
	},
	logs: {
		notes: [{ at: 0, frequency: 180, duration: 0.12, type: 'triangle' }],
		noise: { at: 80, duration: 0.14, frequency: 500, level: 0.16, type: 'lowpass' }
	},
	cars: {
		notes: [
			{ at: 0, frequency: 320, duration: 0.12, type: 'square' },
			{ at: 110, frequency: 180, duration: 0.14, type: 'triangle' }
		]
	},
	lift: {
		notes: [{ at: 60, frequency: 200, duration: 0.32, type: 'sine', endFrequency: 300 }],
		noise: { duration: 0.3, frequency: 2000, level: 0.12, type: 'highpass' }
	},
	rescue: {
		notes: [
			{ at: 0, frequency: 880, duration: 0.24, type: 'sine' },
			{ at: 190, frequency: 660, duration: 0.3, type: 'sine' }
		]
	}
};

export interface AudioBus {
	unlock(): void;
	pick(): void;
	snap(): void;
	complete(): void;
	engine(): void;
	voice(family: VehicleFamily): void;
	job(job: JobKind): void;
	setMuted(muted: boolean): void;
	setVolumes(volumes: Partial<Volumes>): void;
	/** Where a music generator should connect. */
	musicInput(): AudioNode | null;
	context(): AudioContext | undefined;
	close(): void;
}

export function createAudioBus(context?: AudioContext): AudioBus {
	let muted = false;
	let volumes: Volumes = { master: 1, music: 0.5, sfx: 1, voices: 1 };
	let master: GainNode | null = null;
	let sfx: GainNode | null = null;
	let music: GainNode | null = null;
	let voices: GainNode | null = null;
	let timers: number[] = [];

	const clearTimers = () => {
		for (const id of timers) window.clearTimeout(id);
		timers = [];
	};

	const later = (fn: () => void, delay: number) => {
		const id = window.setTimeout(() => {
			timers = timers.filter((timer) => timer !== id);
			fn();
		}, delay);
		timers.push(id);
	};

	const ready = () => (context && !muted && context.state !== 'closed' ? context : null);

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
			voices = ctx.createGain();
			voices.gain.setValueAtTime(volumes.voices, ctx.currentTime);
			voices.connect(master);
		}
		return { master, sfx: sfx!, music: music!, voices: voices! };
	};

	const tone = (
		ctx: AudioContext,
		frequency: number,
		duration: number,
		type: OscillatorType = 'sine',
		endFrequency?: number,
		bus?: AudioNode
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
		gain.connect(bus ?? ensureMaster(ctx).sfx);
		osc.start();
		osc.stop(ctx.currentTime + duration + 0.02);
	};

	const noise = (
		ctx: AudioContext,
		duration: number,
		frequency: number,
		level: number,
		type: BiquadFilterType = 'highpass',
		at = 0
	) => {
		const start = ctx.currentTime + at;
		const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
		const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < length; i++) {
			data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
		}
		const source = ctx.createBufferSource();
		source.buffer = buffer;
		const filter = ctx.createBiquadFilter();
		filter.type = type;
		filter.frequency.setValueAtTime(frequency, start);
		const gain = ctx.createGain();
		gain.gain.setValueAtTime(level, start);
		gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
		source.connect(filter);
		filter.connect(gain);
		gain.connect(ensureMaster(ctx).sfx);
		source.start(start);
		source.stop(start + duration + 0.02);
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
				later(() => {
					const current = ready();
					if (current) tone(current, frequency, 0.24, 'triangle');
				}, index * 95);
			});
		},
		engine() {
			const ctx = ready();
			if (!ctx) return;
			tone(ctx, TONES.engineFrom, 0.7, 'sawtooth', TONES.engineTo);
		},
		voice(family) {
			clearTimers();
			for (const note of VOICES[family]) {
				later(() => {
					const ctx = ready();
					if (ctx) {
						tone(ctx, note.frequency, note.duration, note.type, note.endFrequency, ensureMaster(ctx).voices);
					}
				}, note.at);
			}
		},
		job(job: JobKind) {
			const ctx = ready();
			if (!ctx) return;
			const sound = JOB_SOUNDS[job];
			for (const note of sound.notes) {
				later(() => {
					const current = ready();
					if (current) {
						tone(current, note.frequency, note.duration, note.type, note.endFrequency);
					}
				}, note.at);
			}
			if (sound.noise) {
				const { at = 0, duration, frequency, level, type } = sound.noise;
				later(() => {
					const current = ready();
					if (current) noise(current, duration, frequency, level, type);
				}, at);
			}
		},
		setMuted(value: boolean) {
			muted = value;
			if (value) clearTimers();
			if (master && context) master.gain.setValueAtTime(value ? 0 : MASTER_GAIN * volumes.master, context.currentTime);
		},
		setVolumes(next: Partial<Volumes>) {
			volumes = { ...volumes, ...next };
			if (!context) return;
			const nodes = ensureMaster(context);
			nodes.master.gain.setValueAtTime(muted ? 0 : MASTER_GAIN * volumes.master, context.currentTime);
			nodes.sfx.gain.setValueAtTime(volumes.sfx, context.currentTime);
			nodes.music.gain.setValueAtTime(volumes.music, context.currentTime);
			nodes.voices.gain.setValueAtTime(volumes.voices, context.currentTime);
		},
		musicInput() {
			if (!context) return null;
			return ensureMaster(context).music;
		},
		context() {
			return context;
		},
		close() {
			clearTimers();
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
