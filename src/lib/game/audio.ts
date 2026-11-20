/**
 * Feedback sounds, synthesised at runtime so there is nothing to cache and the engine ramp
 * is a parameter change rather than an asset. Every method is a no-op without a context or
 * while muted.
 */

export const TONES = {
	pick: 660,
	snap: 220,
	completeA: 523,
	completeB: 784,
	engineFrom: 80,
	engineTo: 140
};

export const MASTER_GAIN = 0.2;

export interface AudioBus {
	unlock(): void;
	pick(): void;
	snap(): void;
	complete(): void;
	engine(): void;
	setMuted(muted: boolean): void;
}

export function createAudioBus(context?: AudioContext): AudioBus {
	let muted = false;
	let master: GainNode | null = null;

	const ready = () => (context && !muted ? context : null);

	const ensureMaster = (ctx: AudioContext) => {
		if (!master) {
			master = ctx.createGain();
			master.gain.setValueAtTime(MASTER_GAIN, ctx.currentTime);
			master.connect(ctx.destination);
		}
		return master;
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
		gain.connect(ensureMaster(ctx));
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
		gain.connect(ensureMaster(ctx));
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
			tone(ctx, TONES.completeA, 0.22);
			window.setTimeout(() => {
				const later = ready();
				if (later) tone(later, TONES.completeB, 0.28);
			}, 140);
		},
		engine() {
			const ctx = ready();
			if (!ctx) return;
			tone(ctx, TONES.engineFrom, 0.7, 'sawtooth', TONES.engineTo);
		},
		setMuted(value: boolean) {
			muted = value;
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
