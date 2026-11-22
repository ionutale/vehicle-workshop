/**
 * Background music, synthesised at runtime. A slow eight-bar loop over four chords with a
 * pentatonic melody, scheduled ahead of the audio clock so it never stutters.
 */

export const TEMPO = 84;
const BEAT = 60 / TEMPO;
const EIGHTH = BEAT / 2;
/** The bed sits under speech and effects; this keeps it present but not competing. */
const MUSIC_LEVEL = 0.62;

/** MIDI note numbers. C major pentatonic over C – Am – F – G. */
export const CHORDS: number[][] = [
	[48, 55, 64],
	[45, 52, 60],
	[41, 48, 57],
	[43, 50, 59]
];

export const MELODY: Array<Array<number | null>> = [
	[72, null, 76, 79, null, 76, 72, null],
	[69, null, 72, 76, null, 72, 69, null],
	[65, null, 69, 72, null, 69, 65, null],
	[67, null, 71, 74, null, 71, 67, null]
];

const midiToHz = (note: number) => 440 * Math.pow(2, (note - 69) / 12);

export interface MusicBus {
	start(): void;
	stop(): void;
	setVolume(value: number): void;
	readonly playing: boolean;
}

export function createMusic(context?: AudioContext, destination?: AudioNode): MusicBus {
	let timer: number | null = null;
	let playing = false;
	let nextTime = 0;
	let step = 0;
	let gain: GainNode | null = null;
	let volume = 0.5;

	const ready = () => (context ? context : null);

	const ensureGain = (ctx: AudioContext) => {
		if (!gain) {
			gain = ctx.createGain();
			gain.gain.setValueAtTime(volume * MUSIC_LEVEL, ctx.currentTime);
			if (destination) gain.connect(destination);
			else gain.connect(ctx.destination);
		}
		return gain;
	};

	const note = (ctx: AudioContext, frequency: number, at: number, length: number, level: number, type: OscillatorType) => {
		const osc = ctx.createOscillator();
		const env = ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(frequency, at);
		env.gain.setValueAtTime(0.0001, at);
		env.gain.exponentialRampToValueAtTime(level, at + 0.05);
		env.gain.exponentialRampToValueAtTime(0.0001, at + length);
		osc.connect(env);
		env.connect(ensureGain(ctx));
		osc.start(at);
		osc.stop(at + length + 0.05);
	};

	const shaker = (ctx: AudioContext, at: number) => {
		const length = Math.max(1, Math.floor(ctx.sampleRate * 0.045));
		const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < length; i++) {
			data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
		}
		const source = ctx.createBufferSource();
		source.buffer = buffer;
		const filter = ctx.createBiquadFilter();
		filter.type = 'highpass';
		filter.frequency.setValueAtTime(6200, at);
		const env = ctx.createGain();
		env.gain.setValueAtTime(0.035, at);
		env.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
		source.connect(filter);
		filter.connect(env);
		env.connect(ensureGain(ctx));
		source.start(at);
		source.stop(at + 0.06);
	};

	const schedule = () => {
		const ctx = ready();
		if (!ctx || !playing) return;
		while (nextTime < ctx.currentTime + 0.4) {
			const bar = Math.floor(step / 8) % 4;
			const within = step % 8;

			if (within % 2 === 0) {
				const chord = CHORDS[bar];
				const bass = chord[0] - 12;
				note(ctx, midiToHz(bass), nextTime, BEAT * 1.7, 0.2, 'sine');
			}
			if (within === 0 || within === 4) {
				for (const tone of CHORDS[bar].slice(1)) {
					note(ctx, midiToHz(tone), nextTime, BEAT * 2.2, 0.075, 'triangle');
				}
			}
			if (within === 0) {
				// A soft bell marks the bar without turning into a melody of its own.
				note(ctx, midiToHz(CHORDS[bar][2] + 24), nextTime, 1.4, 0.05, 'sine');
			}
			if (within % 2 === 1) {
				note(
					ctx,
					midiToHz(CHORDS[bar][1 + (within % 4 === 1 ? 0 : 1)] + 12),
					nextTime,
					EIGHTH * 0.9,
					0.034,
					'triangle'
				);
				shaker(ctx, nextTime);
			}
			const melody = MELODY[bar][within];
			if (melody !== null) {
				note(ctx, midiToHz(melody), nextTime, EIGHTH * 1.9, 0.15, 'triangle');
			}

			nextTime += EIGHTH;
			step++;
		}
	};

	return {
		start() {
			const ctx = ready();
			if (!ctx || playing) return;
			playing = true;
			nextTime = ctx.currentTime + 0.1;
			step = 0;
			schedule();
			timer = window.setInterval(schedule, 120);
		},
		stop() {
			playing = false;
			if (timer !== null) {
				window.clearInterval(timer);
				timer = null;
			}
		},
		setVolume(value: number) {
			volume = Math.max(0, Math.min(1, value));
			if (gain && context) {
				gain.gain.setTargetAtTime(volume * MUSIC_LEVEL, context.currentTime, 0.05);
			}
		},
		get playing() {
			return playing;
		}
	};
}
