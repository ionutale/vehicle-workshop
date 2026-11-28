import { describe, expect, it } from 'vitest';
import { shouldPaint } from '#lib/render/motion';

describe('paint loop policy', () => {
	it('paints continuously while visible and motion is allowed', () => {
		expect(shouldPaint({ reduced: false, hidden: false, dirty: false, animating: false, active: true })).toBe(
			true
		);
	});
	it('never paints while hidden', () => {
		expect(shouldPaint({ reduced: false, hidden: true, dirty: true, animating: true, active: true })).toBe(
			false
		);
	});
	it('only repaints a covered screen when something is dirty', () => {
		expect(shouldPaint({ reduced: false, hidden: false, dirty: false, animating: true, active: false })).toBe(false);
		expect(shouldPaint({ reduced: false, hidden: false, dirty: true, animating: true, active: false })).toBe(true);
	});

	it('paints reduced motion only when something changes', () => {
		expect(shouldPaint({ reduced: true, hidden: false, dirty: false, animating: false, active: true })).toBe(
			false
		);
		expect(shouldPaint({ reduced: true, hidden: false, dirty: true, animating: false, active: true })).toBe(
			true
		);
		expect(shouldPaint({ reduced: true, hidden: false, dirty: false, animating: true, active: true })).toBe(
			true
		);
	});
});
