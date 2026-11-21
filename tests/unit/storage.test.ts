import { describe, expect, it, vi, afterEach } from 'vitest';
import { readFlag, readJson, writeFlag, writeJson } from '#lib/storage';

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

	it('round-trips JSON and falls back on bad data', () => {
		writeJson('vw:test-list', ['a', 'b']);
		expect(readJson('vw:test-list', [], (value) => Array.isArray(value))).toEqual(['a', 'b']);

		window.localStorage.setItem('vw:test-list', '{nope');
		expect(readJson('vw:test-list', [], (value) => Array.isArray(value))).toEqual([]);

		expect(readJson('vw:missing', { level: 0 }, (value) => typeof value === 'object')).toEqual({
			level: 0
		});
	});
});
