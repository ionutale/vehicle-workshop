import { readFlag, writeFlag } from './storage';

/** A quiet add-to-home-screen nudge: iOS gets instructions, Chromium gets the real prompt. */

export type InstallPlatform = 'ios' | 'chromium' | 'none';

export interface InstallState {
	available: boolean;
	installed: boolean;
	dismissed: boolean;
	platform: InstallPlatform;
}

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const KEY = 'vw:installDismissed';

export const install = $state<InstallState>({
	available: false,
	installed: false,
	dismissed: false,
	platform: 'none'
});

let deferred: BeforeInstallPromptEvent | null = null;

export function detectPlatform(
	userAgent: string,
	standalone: boolean,
	maxTouchPoints = 0
): InstallPlatform {
	if (standalone) return 'none';
	if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
	if (/Macintosh/.test(userAgent) && maxTouchPoints > 1) return 'ios';
	if (/Chrome|Chromium|Edg\//.test(userAgent)) return 'chromium';
	return 'none';
}

export function shouldOfferInstall(state: InstallState, builds: number): boolean {
	if (builds < 2 || state.installed || state.dismissed) return false;
	if (state.platform === 'ios') return true;
	return state.platform === 'chromium' && state.available;
}

export function initInstall(): () => void {
	if (typeof window === 'undefined') return () => {};

	const standalone =
		(typeof window.matchMedia === 'function' &&
			window.matchMedia('(display-mode: standalone)').matches) ||
		Boolean((navigator as unknown as { standalone?: boolean }).standalone);

	install.dismissed = readFlag(KEY);
	install.installed = standalone;
	install.platform = detectPlatform(
		navigator.userAgent,
		standalone,
		navigator.maxTouchPoints ?? 0
	);

	const onPrompt = (event: Event) => {
		event.preventDefault();
		deferred = event as BeforeInstallPromptEvent;
		install.available = true;
		install.platform = 'chromium';
	};
	const onInstalled = () => {
		install.installed = true;
		install.available = false;
		deferred = null;
	};

	window.addEventListener('beforeinstallprompt', onPrompt);
	window.addEventListener('appinstalled', onInstalled);

	return () => {
		window.removeEventListener('beforeinstallprompt', onPrompt);
		window.removeEventListener('appinstalled', onInstalled);
	};
}

export async function promptInstall(): Promise<void> {
	const event = deferred;
	if (!event) return;
	deferred = null;
	install.available = false;
	await event.prompt();
	await event.userChoice.catch(() => undefined);
}

export function dismissInstall(): void {
	install.dismissed = true;
	install.available = false;
	writeFlag(KEY, true);
}
