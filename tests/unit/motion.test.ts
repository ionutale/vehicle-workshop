import { describe, expect, it } from 'vitest';
import { MOTION, driveDistance, motionAt, roadScroll, wheelSpin } from '#lib/render/motion';

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

	it('rolls with distance and reverses for a flipped wheel', () => {
		expect(wheelSpin(0, 30)).toBe(0);
		expect(wheelSpin(30, 0)).toBe(0);
		expect(wheelSpin(120, 30)).toBeCloseTo(4, 6);
		expect(wheelSpin(120, 30, { flip: true })).toBeCloseTo(-4, 6);
	});

	it('caps the angular rate rather than the total angle', () => {
		const capped = wheelSpin(10_000, 30, { elapsedMs: 500 });
		expect(capped).toBeCloseTo(MOTION.maxWheelRadPerSec * 0.5, 6);
		expect(wheelSpin(200, 30, { elapsedMs: 5_000 })).toBeCloseTo(200 / 30, 6);
	});

	it('stops the road and the wheels under reduced motion', () => {
		expect(roadScroll(480, false)).toBe(480);
		expect(roadScroll(480, true)).toBe(0);
		expect(driveDistance(480, 0.5, false)).toBeCloseTo(960, 6);
		expect(driveDistance(480, 0.5, true)).toBe(0);
	});
});
