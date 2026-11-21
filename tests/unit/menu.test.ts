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
				onplay: vi.fn(),
				onpick,
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
				onplay: vi.fn(),
				onpick: vi.fn(),
				onsettings: vi.fn()
			}
		});

		expect(screen.queryByTestId('garage')).toBeNull();
	});
});
