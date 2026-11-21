/** localStorage reads and writes that never throw: private mode, quota, disabled storage. */

export function readFlag(key: string): boolean {
	try {
		return window.localStorage.getItem(key) === '1';
	} catch {
		return false;
	}
}

export function writeFlag(key: string, value: boolean): void {
	try {
		window.localStorage.setItem(key, value ? '1' : '0');
	} catch {
		// Storage unavailable: the setting simply does not persist.
	}
}

/** JSON for small persisted structures; malformed data falls back instead of throwing. */
export function readJson<T>(key: string, fallback: T, valid: (value: unknown) => boolean): T {
	try {
		const raw = window.localStorage.getItem(key);
		if (raw === null) return fallback;
		const parsed: unknown = JSON.parse(raw);
		return valid(parsed) ? (parsed as T) : fallback;
	} catch {
		return fallback;
	}
}

export function writeJson(key: string, value: unknown): void {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage unavailable: the value simply does not persist.
	}
}
