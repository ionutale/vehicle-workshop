import { describe, expect, it } from 'vitest';
import { createConfetti } from '#lib/render/particles';

describe('confetti', () => {
	it('spawns a burst and reports how many pieces are still flying', () => {
		const field = createConfetti();
		expect(field.live()).toBe(0);
		field.spawn(100, 100, ['#FF6B6B', '#FFD166'], 20);
		expect(field.live()).toBe(20);
	});

	it('clears every piece when the celebration is over', () => {
		const field = createConfetti();
		field.spawn(0, 0, ['#FFFFFF'], 12);
		field.clear();
		expect(field.live()).toBe(0);
	});

	it('retires pieces once their life runs out', () => {
		const field = createConfetti();
		field.spawn(0, 0, ['#FFFFFF'], 8);
		field.step(5_000);
		expect(field.live()).toBe(0);
	});
});
