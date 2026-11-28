/**
 * Time-based motion. Everything here is a pure function of the clock, so ambient animation
 * needs no state of its own and the same timestamp always paints the same frame.
 */

export const MOTION = {
	cloudNear: 9,
	cloudFar: 3.5,
	sunAlpha: 0.04,
	birdPeriodMs: 20_000,
	birdCrossMs: 7_000,
	moteCount: 5,
	maxWheelRadPerSec: 8
} as const;

export interface MotionFrame {
	time: number;
	cloudNear: number;
	cloudFar: number;
	sunAlpha: number;
	birds: { x: number; y: number; flap: number }[];
	motes: { x: number; y: number; alpha: number }[];
}

export function motionAt(timeMs: number, width: number, roadY: number): MotionFrame {
	const seconds = timeMs / 1000;
	const period = timeMs % MOTION.birdPeriodMs;

	const birds: MotionFrame['birds'] = [];
	if (width > 0 && period < MOTION.birdCrossMs) {
		const progress = period / MOTION.birdCrossMs;
		for (let index = 0; index < 4; index++) {
			const p = Math.min(1, Math.max(0, progress - index * 0.035));
			birds.push({
				x: -40 + (width + 80) * p,
				y: roadY * (0.2 + 0.04 * Math.sin(index * 1.7)),
				flap: Math.sin(timeMs / 120 + index * 1.3)
			});
		}
	}

	const motes: MotionFrame['motes'] = [];
	const safeWidth = Math.max(1, width);
	for (let index = 0; index < MOTION.moteCount; index++) {
		motes.push({
			x: (index * 137 + seconds * (6 + index)) % safeWidth,
			y: roadY * (0.52 + 0.09 * Math.sin(index * 2.1 + seconds * 0.2)),
			alpha: 0.1 + 0.05 * Math.sin(seconds * 0.9 + index)
		});
	}

	return {
		time: timeMs,
		cloudNear: seconds * MOTION.cloudNear,
		cloudFar: seconds * MOTION.cloudFar,
		sunAlpha: MOTION.sunAlpha * (0.5 + 0.5 * Math.sin(seconds * 0.7)),
		birds,
		motes
	};
}

/** Wheel angle for a distance travelled, capped so baked hub highlights do not strobe. */
export function wheelSpin(distance: number, radius: number, flip = false): number {
	if (!(distance > 0) || !(radius > 0)) return 0;
	const angle = Math.min(MOTION.maxWheelRadPerSec, distance / (radius * 2));
	return flip ? -angle : angle;
}

/** Repaint policy: continuous while visible, one-shot under reduced motion, never hidden. */
export function shouldPaint(state: {
	reduced: boolean;
	hidden: boolean;
	dirty: boolean;
	animating: boolean;
}): boolean {
	if (state.hidden) return false;
	if (!state.reduced) return true;
	return state.dirty || state.animating;
}
