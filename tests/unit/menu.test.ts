import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Menu from '#lib/components/Menu.svelte';

describe('menu garage', () => {
	beforeEach(() => {
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
	});

	it('parks a finished vehicle and reports a tap', async () => {
		const onpick = vi.fn();
		render(Menu, {
			props: {
				started: false,
				garage: ['car'],
				installHint: null,
				onplay: vi.fn(),
				onpick,
				oninstall: vi.fn(),
				ondismissinstall: vi.fn(),
				onsettings: vi.fn()
			}
		});

		expect(screen.getByTestId('garage')).toBeInTheDocument();
		await fireEvent.click(screen.getByRole('button', { name: 'Car' }));
		expect(onpick).toHaveBeenCalledWith('car');
	});

	it('hides the shelf when nothing has been built', () => {
		render(Menu, {
			props: {
				started: false,
				garage: [],
				installHint: null,
				onplay: vi.fn(),
				onpick: vi.fn(),
				oninstall: vi.fn(),
				ondismissinstall: vi.fn(),
				onsettings: vi.fn()
			}
		});

		expect(screen.queryByTestId('garage')).toBeNull();
	});

	it('shows iOS instructions without a native add button', () => {
		render(Menu, {
			props: {
				started: false,
				garage: [],
				installHint: 'ios',
				onplay: vi.fn(),
				onpick: vi.fn(),
				oninstall: vi.fn(),
				ondismissinstall: vi.fn(),
				onsettings: vi.fn()
			}
		});

		expect(screen.getByTestId('install-hint')).toBeInTheDocument();
		expect(screen.getByText(/Tap Share, then Add to Home Screen/i)).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Add' })).toBeNull();
	});

	it('adds or dismisses the Chromium hint', async () => {
		const oninstall = vi.fn();
		const ondismissinstall = vi.fn();
		render(Menu, {
			props: {
				started: false,
				garage: [],
				installHint: 'chromium',
				onplay: vi.fn(),
				onpick: vi.fn(),
				oninstall,
				ondismissinstall,
				onsettings: vi.fn()
			}
		});

		await fireEvent.click(screen.getByRole('button', { name: 'Add' }));
		expect(oninstall).toHaveBeenCalled();
		await fireEvent.click(screen.getByRole('button', { name: 'Dismiss install hint' }));
		expect(ondismissinstall).toHaveBeenCalled();
	});
});
