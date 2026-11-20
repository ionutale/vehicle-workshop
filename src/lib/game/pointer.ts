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

const TAP_SLOP = 6;

export function attachPointerHandlers(canvas: HTMLCanvasElement, callbacks: PointerCallbacks): () => void {
	let pointerId: number | null = null;
	let startClient: Point | null = null;
	let moved = 0;
	let picked: TrayPiece | null = null;

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
		picked = piece;
		canvas.setPointerCapture(event.pointerId);
		callbacks.onPick(piece, world);
		event.preventDefault();
	};

	const move = (event: PointerEvent) => {
		if (pointerId === null || event.pointerId !== pointerId) return;
		if (startClient) {
			moved = Math.max(
				moved,
				Math.hypot(event.clientX - startClient.x, event.clientY - startClient.y)
			);
		}
		callbacks.onMove(callbacks.toWorld({ x: event.clientX, y: event.clientY }));
	};

	const release = (event: PointerEvent) => {
		if (pointerId === null || event.pointerId !== pointerId) return;
		const world = callbacks.toWorld({ x: event.clientX, y: event.clientY });
		if (moved < TAP_SLOP) {
			// A tap, not a drag: drop it where it was picked up so it returns to the shelf.
			callbacks.onDrop(world);
		} else {
			callbacks.onDrop(world);
		}
		if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
		pointerId = null;
		startClient = null;
		picked = null;
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

	return () => {
		canvas.removeEventListener('pointerdown', down);
		canvas.removeEventListener('pointermove', move);
		canvas.removeEventListener('pointerup', release);
		canvas.removeEventListener('pointercancel', cancel);
	};
}

/** Topmost shelf piece under a world-space point. */
export function hitPiece(pieces: TrayPiece[], world: Point): TrayPiece | null {
	for (let i = pieces.length - 1; i >= 0; i--) {
		const { rect } = pieces[i];
		if (
			world.x >= rect.x &&
			world.x <= rect.x + rect.w &&
			world.y >= rect.y &&
			world.y <= rect.y + rect.h
		) {
			return pieces[i];
		}
	}
	return null;
}
