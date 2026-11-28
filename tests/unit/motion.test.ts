import { describe, expect, it } from 'vitest';
import { MOTION, motionAt, wheelSpin } from '#lib/render/motion';

describe('motion', () => {
	it('is deterministic for one timestamp', () => {
		const a = motionAt(12_345, 800, 640);
		const b = motionAt(12_345, 800, 640);
		expect(a).toEqual(b);
	});

	it('drifts clouds monotonically and keeps the far layer slower', () => {
		const a = motionAt(0, 800, 640);
		const b = motionAt(10_000, 800, 640);
		expect(b.cloudNear).toBeGreaterThan(a.cloudNear);
		expect(b.cloudNear - a.cloudNear).toBeGreaterThan(b.cloudFar - a.cloudFar);
	});

	it('sends a flock across once per period and never leaves the width', () => {
		const quiet = motionAt(MOTION.birdPeriodMs / 2, 800, 640);
		expect(quiet.birds).toHaveLength(0);
		const crossing = motionAt(3_000, 800, 640);
		expect(crossing.birds.length).toBeGreaterThanOrEqual(3);
		for (const bird of crossing.birds) {
			expect(bird.x).toBeGreaterThanOrEqual(-40);
			expect(bird.x).toBeLessThanOrEqual(840);
		}
	});

	it('keeps a fixed number of motes above the road and inside the width', () => {
		const frame = motionAt(5000, 800, 640);
		expect(frame.motes).toHaveLength(MOTION.moteCount);
		for (const mote of frame.motes) {
			expect(mote.x).toBeGreaterThanOrEqual(0);
			expect(mote.x).toBeLessThan(800);
			expect(mote.y).toBeLessThan(640);
		}
	});

	it('caps wheel spin and reverses for a flipped wheel', () => {
		expect(wheelSpin(0, 30)).toBe(0);
		expect(wheelSpin(30, 0)).toBe(0);
		expect(wheelSpin(10_000, 30)).toBeLessThanOrEqual(MOTION.maxWheelRadPerSec);
		expect(wheelSpin(120, 30, true)).toBeCloseTo(-wheelSpin(120, 30), 6);
	});
});
