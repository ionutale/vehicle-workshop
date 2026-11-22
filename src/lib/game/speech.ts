import { prefs } from '../preferences.svelte';

/**
 * Spoken component names. The Web Speech API is optional: when it is missing or the
 * voices / sound level is zero, the visual label still works.
 */
export function speakPart(name: string): number {
	if (typeof window === 'undefined') return 0;
	if (prefs.muted) return 0;
	const volume = Math.max(0, Math.min(1, prefs.voices * prefs.sound));
	if (volume <= 0) return volume;
	if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
		return volume;
	}

	try {
		const synth = window.speechSynthesis;
		synth.cancel();
		const utterance = new SpeechSynthesisUtterance(name);
		utterance.lang = 'en';
		utterance.rate = 0.9;
		utterance.pitch = 1.1;
		utterance.volume = volume;
		const voice = synth.getVoices().find((candidate) => candidate.lang.toLowerCase().startsWith('en'));
		if (voice) utterance.voice = voice;
		synth.speak(utterance);
	} catch {
		// A browser with a broken speech engine should never break the game.
	}
	return volume;
}
