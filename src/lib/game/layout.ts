/**
 * Screen layout in one logical space: the world is always 800 units tall and as wide as
 * the viewport's aspect demands. Everything the renderer draws is in world units; pointer
 * coordinates cross the boundary here, and nowhere else.
 */

export const WORLD_HEIGHT = 800;
export const SHELF_INSET = 24;
export const ROAD_FRACTION = 0.8;

const SHELF_GAP = 16;
const SHELF_PADDING = 10;
const VEHICLE_GAP = 64;
const TEACHING_ROWS = 2;
const MUTE_SIZE = 56;

export interface Point {
	x: number;
	y: number;
}

export interface Viewport {
	width: number;
	height: number;
}

export interface Insets {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

/** A tray piece's footprint in vehicle units, before `gameScale` is applied. */
export interface PieceBox {
	slotId: string;
	w: number;
	h: number;
}

export interface PlacedPiece {
	slotId: string;
	rect: Rect;
}

export interface Layout {
	worldWidth: number;
	worldHeight: number;
	gameScale: number;
	shelf: Rect;
	rows: PlacedPiece[][];
	roadY: number;
	vehicleAnchor: Point;
	muteButton: Rect;
	snapRadius: number;
	/** Outline thickness in world units that renders as a consistent on-screen weight. */
	outline: number;
}

/**
 * Pack pieces into rows, largest first, never splitting a piece. Widths are compared in
 * the same unit the caller supplies; `computeLayout` packs at scale 1 because the final
 * scale is derived from the widest row this produces.
 */
export function packShelf(pieces: PieceBox[], panelWidth: number, gap: number): PieceBox[][] {
	const sorted = [...pieces].sort((a, b) => b.w - a.w || b.h - a.h);
	const rows: PieceBox[][] = [];
	let row: PieceBox[] = [];
	let used = 0;

	for (const piece of sorted) {
		const needed = row.length === 0 ? piece.w : used + gap + piece.w;
		if (row.length > 0 && needed > panelWidth) {
			rows.push(row);
			row = [piece];
			used = piece.w;
			continue;
		}
		used = needed;
		row.push(piece);
	}
	if (row.length > 0) rows.push(row);
	return rows;
}

function rowWidth(row: PieceBox[], gap: number): number {
	return row.reduce((sum, piece) => sum + piece.w, 0) + gap * Math.max(0, row.length - 1);
}

export function computeLayout(
	vp: Viewport,
	vehicle: { width: number; height: number },
	pieces: PieceBox[],
	insets: Insets,
	largestPartRadius: number
): Layout {
	const worldWidth = (WORLD_HEIGHT * Math.max(vp.width, 1)) / Math.max(vp.height, 1);
	const roadY = WORLD_HEIGHT * ROAD_FRACTION;
	const shelfY = SHELF_INSET + insets.top;

	const panelX = SHELF_INSET + insets.left;
	const muteReserve = MUTE_SIZE + 12;
	const panelW = Math.max(
		1,
		worldWidth - SHELF_INSET * 2 - muteReserve - insets.left - insets.right
	);

	const packed = packShelf(pieces, panelW, SHELF_GAP);
	const widestRow = Math.max(1, ...packed.map((row) => rowWidth(row, SHELF_GAP)));
	const shelfUnits = packed.reduce(
		(height, row) => height + Math.max(...row.map((piece) => piece.h)) + SHELF_GAP,
		0
	);

	const heightBudget = roadY - shelfY - VEHICLE_GAP;
	const gameScale = Math.max(
		0.05,
		Math.min(
			1.8,
			Math.max(1, panelW - SHELF_PADDING * 2) / widestRow,
			heightBudget / Math.max(1, shelfUnits + vehicle.height),
			(worldWidth * 0.78) / Math.max(1, vehicle.width)
		)
	);
	const unitsPerPixel = WORLD_HEIGHT / Math.max(vp.height, 1);

	const rows: PlacedPiece[][] = [];
	let y = shelfY + SHELF_PADDING;
	for (const row of packed) {
		const rowHeight = Math.max(...row.map((piece) => piece.h));
		let x = panelX + SHELF_PADDING;
		const placedRow: PlacedPiece[] = [];
		for (const piece of row) {
			placedRow.push({
				slotId: piece.slotId,
				rect: { x, y, w: piece.w * gameScale, h: piece.h * gameScale }
			});
			x += piece.w * gameScale + SHELF_GAP * gameScale;
		}
		rows.push(placedRow);
		y += (rowHeight + SHELF_GAP) * gameScale;
	}

	const shelfHeight = (shelfUnits - SHELF_GAP) * gameScale + SHELF_PADDING * 2;

	return {
		worldWidth,
		worldHeight: WORLD_HEIGHT,
		gameScale,
		shelf: { x: panelX, y: shelfY, w: panelW, h: Math.max(shelfHeight, MUTE_SIZE) },
		rows,
		roadY,
		vehicleAnchor: { x: worldWidth / 2, y: roadY },
		muteButton: {
			x: panelX + panelW + 12,
			y: shelfY,
			w: MUTE_SIZE,
			h: MUTE_SIZE
		},
		snapRadius: Math.max(48, largestPartRadius * 0.9 * gameScale),
		outline: Math.min(6, Math.max(1.6, unitsPerPixel * 2.2))
	};
}

/** The number of rows the shelf needs before any scale is applied; used by callers that
 * want to reserve space. Kept for the teaching-mode check. */
export function teachingRows(pieces: PieceBox[], panelWidth: number): number {
	return Math.min(TEACHING_ROWS, packShelf(pieces, panelWidth, SHELF_GAP).length);
}

export function screenToWorld(layout: Layout, vp: Viewport, p: Point): Point {
	return {
		x: (p.x / Math.max(vp.width, 1)) * layout.worldWidth,
		y: (p.y / Math.max(vp.height, 1)) * layout.worldHeight
	};
}

export function worldToScreen(layout: Layout, vp: Viewport, p: Point): Point {
	return {
		x: (p.x / layout.worldWidth) * vp.width,
		y: (p.y / layout.worldHeight) * vp.height
	};
}
