import type { AssemblyState } from '../game/assembly';
import type { Layout, PieceBox, PlacedPiece } from '../game/layout';
import { PARTS, type PartId, type PartShape } from '../game/parts';
import type { Vehicle } from '../game/vehicles';
import { roundedRect } from './draw';
import { OUTLINE, SUN } from './scene';
import { drawPart } from './vehicle';

/** The parts shelf: pieces at slot scale, variable-width cells, two rows at most. */

export interface TrayPiece extends PlacedPiece {
	part: PartId;
}

export const PANEL_FILL = '#FFF9EC';
export const PANEL_EDGE = '#FFDCAE';
export const ICON_INK = '#7A6A55';

export function pieceBoxes(vehicle: Vehicle): PieceBox[] {
	return vehicle.slots.map((slot) => {
		const shape = PARTS[slot.part];
		const scale = slot.scale ?? 1;
		return {
			slotId: slot.id,
			w: shape.halfWidth * 2 * scale,
			h: shape.halfHeight * 2 * scale
		};
	});
}

export function trayPieces(vehicle: Vehicle, state: AssemblyState, layout: Layout): TrayPiece[] {
	const rects = new Map<string, PlacedPiece['rect']>();
	for (const row of layout.rows) for (const placed of row) rects.set(placed.slotId, placed.rect);

	return vehicle.slots
		.filter((slot) => !state.placed.includes(slot.id))
		.map((slot) => {
			const rect = rects.get(slot.id);
			return rect ? { slotId: slot.id, part: slot.part, rect } : null;
		})
		.filter((piece): piece is TrayPiece => piece !== null);
}

export interface ShelfOptions {
	hintSlotId?: string | null;
	muted?: boolean;
	now?: number;
	/** Per-piece opacity, used for the staggered pop-in after a hand-off. */
	alphaFor?: (index: number) => number;
	/** Serve calm, static affordances when the user asked for less motion. */
	reduced?: boolean;
}

export function drawShelf(
	ctx: CanvasRenderingContext2D,
	layout: Layout,
	pieces: TrayPiece[],
	parts: Record<PartId, PartShape>,
	options: ShelfOptions = {}
): void {
	const { hintSlotId = null, muted = false, now = 0, alphaFor, reduced = false } = options;
	const shelf = layout.shelf;

	ctx.save();
	if (pieces.length > 0) {
		ctx.fillStyle = PANEL_FILL;
		roundedRect(ctx, shelf.x, shelf.y, shelf.w, shelf.h, 22);
		ctx.fill();
		ctx.strokeStyle = PANEL_EDGE;
		ctx.lineWidth = 3;
		ctx.stroke();
	}
	ctx.restore();

	for (const [index, piece] of pieces.entries()) {
		const shape = parts[piece.part];
		const scale = piece.rect.w / Math.max(shape.halfWidth * 2, 0.001);
		const centre = {
			x: piece.rect.x + piece.rect.w / 2,
			y: piece.rect.y + piece.rect.h / 2
		};
		drawPart(ctx, shape, centre, scale, {
			alpha: alphaFor ? Math.max(0, Math.min(1, alphaFor(index))) : 1
		});

		if (hintSlotId === piece.slotId) {
			const pulse = 0.5 + 0.5 * Math.sin(now / 260);
			ctx.save();
			ctx.strokeStyle = SUN;
			ctx.globalAlpha = reduced ? 0.8 : 0.45 + 0.45 * pulse;
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.ellipse(
				centre.x,
				centre.y,
				piece.rect.w / 2 + 10,
				piece.rect.h / 2 + 10,
				0,
				0,
				Math.PI * 2
			);
			ctx.stroke();
			ctx.restore();
		}
	}

	drawMuteIcon(ctx, layout, muted);
}

function drawMuteIcon(ctx: CanvasRenderingContext2D, layout: Layout, muted: boolean): void {
	const { x, y, w, h } = layout.muteButton;
	const cx = x + w / 2;
	const cy = y + h / 2;
	const size = 22;

	ctx.save();
	ctx.fillStyle = PANEL_FILL;
	roundedRect(ctx, x + 4, y + 4, w - 8, h - 8, 14);
	ctx.fill();

	ctx.strokeStyle = ICON_INK;
	ctx.fillStyle = ICON_INK;
	ctx.lineWidth = 3;
	ctx.globalAlpha = 0.75;

	ctx.beginPath();
	ctx.moveTo(cx - size * 0.55, cy - size * 0.28);
	ctx.lineTo(cx - size * 0.2, cy - size * 0.28);
	ctx.lineTo(cx + size * 0.25, cy - size * 0.65);
	ctx.lineTo(cx + size * 0.25, cy + size * 0.65);
	ctx.lineTo(cx - size * 0.2, cy + size * 0.28);
	ctx.lineTo(cx - size * 0.55, cy + size * 0.28);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = OUTLINE;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.strokeStyle = ICON_INK;
	ctx.lineWidth = 3;
	if (muted) {
		ctx.beginPath();
		ctx.moveTo(cx + size * 0.45, cy - size * 0.4);
		ctx.lineTo(cx + size * 0.95, cy + size * 0.4);
		ctx.moveTo(cx + size * 0.95, cy - size * 0.4);
		ctx.lineTo(cx + size * 0.45, cy + size * 0.4);
		ctx.stroke();
	} else {
		ctx.beginPath();
		ctx.arc(cx + size * 0.3, cy, size * 0.45, -0.7, 0.7);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(cx + size * 0.3, cy, size * 0.75, -0.7, 0.7);
		ctx.stroke();
	}
	ctx.restore();
}
