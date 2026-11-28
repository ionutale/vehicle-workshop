import { describe, expect, it } from 'vitest';
import { shouldPaint } from '#lib/render/motion';

describe('paint loop policy', () => {
	it('paints continuously while visible and motion is allowed', () => {
		expect(shouldPaint({ reduced: false, hidden: false, dirty: false, animating: false })).toBe(
			true
		);
	});
	it('never paints while hidden', () => {
		expect(shouldPaint({ reduced: false, hidden: true, dirty: true, animating: true })).toBe(
			false
		);
	});
	it('paints reduced motion only when something changes', () => {
		expect(shouldPaint({ reduced: true, hidden: false, dirty: false, animating: false })).toBe(
			false
		);
		expect(shouldPaint({ reduced: true, hidden: false, dirty: true, animating: false })).toBe(
			true
		);
		expect(shouldPaint({ reduced: true, hidden: false, dirty: false, animating: true })).toBe(
			true
		);
	});
});
