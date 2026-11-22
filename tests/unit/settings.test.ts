import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SettingsPanel from '#lib/components/SettingsPanel.svelte';

describe('settings lock', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('starts locked and unlocks after a deliberate hold', async () => {
		render(SettingsPanel, { props: { onback: vi.fn() } });
		const slider = screen.getByRole('slider', { name: 'Music' });
		expect(slider).toBeDisabled();
		expect(screen.getByRole('slider', { name: 'Voices' })).toBeDisabled();

		await fireEvent.pointerDown(screen.getByRole('button', { name: 'Unlock settings' }));
		await vi.advanceTimersByTimeAsync(1200);
		await waitFor(() => expect(slider).not.toBeDisabled());
	});

	it('ignores a quick tap', async () => {
		render(SettingsPanel, { props: { onback: vi.fn() } });
		const button = screen.getByRole('button', { name: 'Unlock settings' });
		const slider = screen.getByRole('slider', { name: 'Music' });

		await fireEvent.pointerDown(button);
		await fireEvent.pointerUp(button);
		await fireEvent.click(button, { detail: 1 });

		expect(slider).toBeDisabled();
	});

	it('locks again from the button and on Back', async () => {
		const onback = vi.fn();
		render(SettingsPanel, { props: { onback } });
		const slider = screen.getByRole('slider', { name: 'Music' });

		await fireEvent.pointerDown(screen.getByRole('button', { name: 'Unlock settings' }));
		await vi.advanceTimersByTimeAsync(1200);
		await waitFor(() => expect(slider).not.toBeDisabled());
		await fireEvent.pointerUp(screen.getByRole('button', { name: 'Lock settings' }));
		await fireEvent.click(screen.getByRole('button', { name: 'Lock settings' }));
		expect(slider).toBeDisabled();

		await fireEvent.click(screen.getByRole('button', { name: 'Unlock settings' }), { detail: 0 });
		expect(slider).not.toBeDisabled();
		await fireEvent.click(screen.getByRole('button', { name: 'Back' }));
		expect(onback).toHaveBeenCalled();
		expect(slider).toBeDisabled();
	});
});
