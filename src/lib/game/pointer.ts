import type { Point } from './layout';
import type { TrayPiece } from '../render/tray';

/**
 * Pointer wiring. The canvas is the only surface; a single primary pointer owns a drag at a
 * time, and coordinates are always re-derived from the live client point so a resize cannot
 * leave a piece cached in the wrong place.
 */

export interface PointerCallbacks {
	onPick: (piece: TrayPiece, world: Point) => void;
	onMove: (world: Point) => void;
	onDrop: (world: Point) => void;
	toWorld: (client: Point) => Point;
	hit: (world: Point) => TrayPiece | null;
	isActive: () => boolean;
}

export function attachPointerHandlers(canvas: HTMLCanvasElement, callbacks: PointerCallbacks): () => void {
	let pointerId: number | null = null;
	let startClient: Point | null = null;
	let moved = 0;

	const down = (event: PointerEvent) => {
		if (!event.isPrimary) return;
		if (pointerId !== null) return;
		if (!callbacks.isActive()) return;

		const world = callbacks.toWorld({ x: event.clientX, y: event.clientY });
		const piece = callbacks.hit(world);
		if (!piece) return;

		pointerId = event.pointerId;
		startClient = { x: event.clientX, y: event.clientY };
		moved = 0;
		try {
			canvas.setPointerCapture(event.pointerId);
		} catch {
			// Capture is an optimisation; the drag still works without it.
		}
		callbacks.onPick(piece, world);
		event.preventDefault();
	};

	const move = (event: PointerEvent) => {
		if (pointerId === null || event.pointerId !== pointerId) return;
		callbacks.onMove(callbacks.toWorld({ x: event.clientX, y: event.clientY }));
	};

	const release = (event: PointerEvent) => {
		if (pointerId === null || event.pointerId !== pointerId) return;
		const world = callbacks.toWorld({ x: event.clientX, y: event.clientY });
		// A tap and a drag both end in a drop; the reducer returns a piece released far
		// from its slot to the shelf, so a tap simply goes home.
		callbacks.onDrop(world);
		if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
		pointerId = null;
		startClient = null;
		moved = 0;
	};

	const cancel = (event: PointerEvent) => {
		if (pointerId === null || event.pointerId !== pointerId) return;
		release(event);
	};

	canvas.addEventListener('pointerdown', down);
	canvas.addEventListener('pointermove', move);
	canvas.addEventListener('pointerup', release);
	canvas.addEventListener('pointercancel', cancel);
	canvas.addEventListener('lostpointercapture', cancel);

	return () => {
		canvas.removeEventListener('pointerdown', down);
		canvas.removeEventListener('pointermove', move);
		canvas.removeEventListener('pointerup', release);
		canvas.removeEventListener('pointercancel', cancel);
		canvas.removeEventListener('lostpointercapture', cancel);
	};
}

/**
 * Topmost shelf piece under a world-space point. `minSize` expands each piece's target
 * symmetrically, so a 14 px headlight still has a 44 px finger target.
 */
export function hitPiece(pieces: TrayPiece[], world: Point, minSize = 0): TrayPiece | null {
	for (let i = pieces.length - 1; i >= 0; i--) {
		const { rect } = pieces[i];
		const padX = Math.max(0, (minSize - rect.w) / 2);
		const padY = Math.max(0, (minSize - rect.h) / 2);
		if (
			world.x >= rect.x - padX &&
			world.x <= rect.x + rect.w + padX &&
			world.y >= rect.y - padY &&
			world.y <= rect.y + rect.h + padY
		) {
			return pieces[i];
		}
	}
	return null;
}
