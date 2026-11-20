import { describe, expect, it, vi } from 'vitest';
import { attachPointerHandlers, type PointerCallbacks } from '#lib/game/pointer';
import type { TrayPiece } from '#lib/render/tray';

/** A canvas stand-in that records listeners and honours pointer capture. */
function fakeCanvas() {
	const listeners = new Map<string, Set<(event: PointerEvent) => void>>();
	const canvas = {
		addEventListener: (type: string, handler: (event: PointerEvent) => void) => {
			if (!listeners.has(type)) listeners.set(type, new Set());
			listeners.get(type)!.add(handler);
		},
		removeEventListener: (type: string, handler: (event: PointerEvent) => void) => {
			listeners.get(type)?.delete(handler);
		},
		setPointerCapture: vi.fn(),
		releasePointerCapture: vi.fn(),
		hasPointerCapture: () => true,
		dispatch: (type: string, event: Partial<PointerEvent>) => {
			const full = { preventDefault: () => {}, ...event } as PointerEvent;
			for (const handler of listeners.get(type) ?? []) handler(full);
		}
	};
	return canvas;
}

const piece = (): TrayPiece => ({
	slotId: 'wheel-l',
	part: 'wheel',
	rect: { x: 0, y: 0, w: 60, h: 60 }
});

function setup() {
	const canvas = fakeCanvas();
	const callbacks: PointerCallbacks = {
		onPick: vi.fn(),
		onMove: vi.fn(),
		onDrop: vi.fn(),
		toWorld: (client) => ({ x: client.x, y: client.y }),
		hit: () => piece(),
		isActive: () => true
	};
	const detach = attachPointerHandlers(canvas as unknown as HTMLCanvasElement, callbacks);
	return { canvas, callbacks, detach };
}

describe('pointer wiring', () => {
	it('ignores a second pointer while one is held', () => {
		const { canvas, callbacks } = setup();
		canvas.dispatch('pointerdown', { pointerId: 1, isPrimary: true, clientX: 10, clientY: 10 });
		canvas.dispatch('pointerdown', { pointerId: 2, isPrimary: true, clientX: 20, clientY: 20 });
		canvas.dispatch('pointermove', { pointerId: 2, clientX: 30, clientY: 30 });
		expect(callbacks.onPick).toHaveBeenCalledTimes(1);
		expect(callbacks.onMove).not.toHaveBeenCalled();
	});

	it('ignores a non-primary pointer entirely', () => {
		const { canvas, callbacks } = setup();
		canvas.dispatch('pointerdown', { pointerId: 3, isPrimary: false, clientX: 5, clientY: 5 });
		expect(callbacks.onPick).not.toHaveBeenCalled();
	});

	it('treats a press and release without movement as a tap that drops', () => {
		const { canvas, callbacks } = setup();
		canvas.dispatch('pointerdown', { pointerId: 1, isPrimary: true, clientX: 10, clientY: 10 });
		canvas.dispatch('pointerup', { pointerId: 1, clientX: 11, clientY: 10 });
		expect(callbacks.onDrop).toHaveBeenCalledTimes(1);
	});

	it('drops at the release point after a real drag', () => {
		const { canvas, callbacks } = setup();
		canvas.dispatch('pointerdown', { pointerId: 1, isPrimary: true, clientX: 10, clientY: 10 });
		canvas.dispatch('pointermove', { pointerId: 1, clientX: 80, clientY: 90 });
		canvas.dispatch('pointerup', { pointerId: 1, clientX: 80, clientY: 90 });
		expect(callbacks.onDrop).toHaveBeenCalledWith({ x: 80, y: 90 });
	});

	it('detaches every listener it added', () => {
		const { canvas, callbacks, detach } = setup();
		detach();
		canvas.dispatch('pointerdown', { pointerId: 1, isPrimary: true, clientX: 10, clientY: 10 });
		expect(callbacks.onPick).not.toHaveBeenCalled();
	});
});
