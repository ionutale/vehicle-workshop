import { describe, expect, it, vi, afterEach } from 'vitest';
import { readFlag, writeFlag } from '#lib/storage';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('storage', () => {
	it('round-trips a flag', () => {
		writeFlag('vw:test', true);
		expect(readFlag('vw:test')).toBe(true);
		writeFlag('vw:test', false);
		expect(readFlag('vw:test')).toBe(false);
	});

	it('reads false when getItem throws', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('denied');
		});
		expect(readFlag('vw:test')).toBe(false);
	});

	it('swallows a throwing setItem', () => {
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('quota');
		});
		expect(() => writeFlag('vw:test', true)).not.toThrow();
	});
});
