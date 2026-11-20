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
