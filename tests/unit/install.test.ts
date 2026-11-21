import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	detectPlatform,
	dismissInstall,
	install,
	promptInstall,
	shouldOfferInstall
} from '#lib/install.svelte';

function installEvent(prompt: () => Promise<void>) {
	const event = new Event('beforeinstallprompt');
	Object.defineProperties(event, {
		prompt: { value: prompt },
		userChoice: { value: Promise.resolve({ outcome: 'accepted' }) }
	});
	return event;
}

describe('install hint', () => {
	beforeEach(() => {
		window.localStorage.clear();
		install.dismissed = false;
		install.installed = false;
		install.available = false;
		install.platform = 'none';
	});

	it('detects iPhone, iPad desktop mode, Chrome and standalone', () => {
		expect(detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', false)).toBe(
			'ios'
		);
		expect(detectPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', false, 5)).toBe('ios');
		expect(detectPlatform('Mozilla/5.0 Chrome/130 Safari/537.36', false)).toBe('chromium');
		expect(detectPlatform('Mozilla/5.0 Firefox/130', false)).toBe('none');
		expect(detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', true)).toBe('none');
	});

	it('offers only after two builds, and never when installed or dismissed', () => {
		const base = {
			available: true,
			installed: false,
			dismissed: false,
			platform: 'chromium' as const
		};
		expect(shouldOfferInstall(base, 1)).toBe(false);
		expect(shouldOfferInstall(base, 2)).toBe(true);
		expect(shouldOfferInstall({ ...base, dismissed: true }, 2)).toBe(false);
		expect(shouldOfferInstall({ ...base, installed: true }, 2)).toBe(false);
		expect(shouldOfferInstall({ ...base, platform: 'ios' }, 2)).toBe(true);
		expect(shouldOfferInstall({ ...base, available: false }, 2)).toBe(false);
		expect(shouldOfferInstall({ ...base, platform: 'none' }, 2)).toBe(false);
	});

	it('persists a dismissal', () => {
		dismissInstall();
		expect(install.dismissed).toBe(true);
		expect(window.localStorage.getItem('vw:installDismissed')).toBe('1');
	});

	it('catches a beforeinstallprompt that arrives before initInstall', () => {
		window.dispatchEvent(installEvent(() => Promise.resolve()));
		expect(install.available).toBe(true);
		expect(install.platform).toBe('chromium');
	});

	it('keeps the hint available when the native prompt fails', async () => {
		window.dispatchEvent(installEvent(() => Promise.reject(new Error('dismissed'))));
		await promptInstall();
		expect(install.available).toBe(true);
	});
});
