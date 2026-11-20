import { describe, expect, it } from 'vitest';
import { hitPiece } from '#lib/game/pointer';

const pieces = [
	{ slotId: 'body', part: 'body', rect: { x: 0, y: 0, w: 300, h: 100 } },
	{ slotId: 'wheel', part: 'wheel', rect: { x: 320, y: 0, w: 60, h: 60 } }
] as never;

describe('hitPiece', () => {
	it('finds the piece under the point', () => {
		expect(hitPiece(pieces, { x: 30, y: 30 })?.slotId).toBe('body');
		expect(hitPiece(pieces, { x: 340, y: 20 })?.slotId).toBe('wheel');
	});

	it('returns null in the gap between pieces', () => {
		expect(hitPiece(pieces, { x: 312, y: 30 })).toBeNull();
	});
});
