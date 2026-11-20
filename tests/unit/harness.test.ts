import { describe, expect, it } from 'vitest';

describe('test harness', () => {
	it('provides a working localStorage fallback', () => {
		localStorage.setItem('harness', 'ok');
		expect(localStorage.getItem('harness')).toBe('ok');
		expect(localStorage.length).toBe(1);
	});

	it('clears storage between tests', () => {
		expect(localStorage.length).toBe(0);
	});
});
