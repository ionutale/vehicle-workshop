import type { Layout } from '../game/layout';
import { roundedRect } from './draw';

/**
 * The backdrop: flat paper cut-out, repeating every world width so the drive-off can
 * scroll it. The far layer is static per resize and can be pre-rendered; the road is drawn
 * each frame because it is three rects and a dozen dashes.
 */

export const SKY = '#BFEAFF';
export const SUN = '#FFE066';
export const HILL_FAR = '#A8E6A1';
export const HILL_NEAR = '#8AD88A';
export const ROAD = '#77808F';
export const ROAD_LIP = '#5C6472';
export const ROAD_LINE = '#F3F6FA';
export const OUTLINE = '#3A271B';
export const CLOUD = '#FFFFFF';

export function drawScene(
	ctx: CanvasRenderingContext2D,
	layout: Layout,
	scrollX = 0,
	roadScroll = 0
): void {
	drawFarLayer(ctx, layout, scrollX);
	drawRoad(ctx, layout, roadScroll);
}

/** Everything above the road: sky, sun, clouds and both hill bands. */
export function drawFarLayer(ctx: CanvasRenderingContext2D, layout: Layout, scrollX = 0): void {
	const { worldWidth: w, worldHeight: h, roadY } = layout;

	ctx.fillStyle = SKY;
	ctx.fillRect(0, 0, w, h);

	const shift = (distance: number) => ((scrollX * distance) % w + w) % w;

	// Sun sits high and drifts slowest.
	ctx.fillStyle = SUN;
	ctx.beginPath();
	ctx.arc(w * 0.62 - shift(0.08), h * 0.13, 46, 0, Math.PI * 2);
	ctx.fill();

	// Two cloud groups, a little life without motion of their own.
	ctx.fillStyle = CLOUD;
	for (let copy = -1; copy <= 1; copy++) {
		for (let i = 0; i < 3; i++) {
			const cx = w * (0.18 + i * 0.3) + copy * w - shift(0.16);
			const cy = h * (0.1 + (i % 2) * 0.05);
			ctx.beginPath();
			ctx.ellipse(cx, cy, 42, 15, 0, 0, Math.PI * 2);
			ctx.ellipse(cx + 26, cy + 4, 28, 12, 0, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// Far hills, then near hills, each a slow repeated wave.
	ctx.fillStyle = HILL_FAR;
	for (let copy = -1; copy <= 1; copy++) {
		const base = copy * w - shift(0.2);
		ctx.beginPath();
		ctx.moveTo(base, roadY);
		ctx.quadraticCurveTo(base + w * 0.2, roadY - 150, base + w * 0.45, roadY - 40);
		ctx.quadraticCurveTo(base + w * 0.7, roadY - 160, base + w, roadY - 60);
		ctx.lineTo(base + w, roadY);
		ctx.closePath();
		ctx.fill();
	}

	ctx.fillStyle = HILL_NEAR;
	for (let copy = -1; copy <= 1; copy++) {
		const base = copy * w - shift(0.32);
		ctx.beginPath();
		ctx.moveTo(base, roadY);
		ctx.quadraticCurveTo(base + w * 0.25, roadY - 90, base + w * 0.5, roadY - 20);
		ctx.quadraticCurveTo(base + w * 0.78, roadY - 100, base + w, roadY - 30);
		ctx.lineTo(base + w, roadY);
		ctx.closePath();
		ctx.fill();
	}
}

export function drawRoad(ctx: CanvasRenderingContext2D, layout: Layout, scrollX = 0): void {
	const { worldWidth: w, worldHeight: h, roadY } = layout;
	const lip = 8;

	ctx.fillStyle = ROAD_LIP;
	ctx.fillRect(0, roadY, w, h - roadY);
	ctx.fillStyle = ROAD;
	ctx.fillRect(0, roadY + lip, w, h - roadY - lip);

	// Centre line: fixed-length dashes, shifted by the scroll distance.
	const dash = 44;
	const gap = 40;
	const y = roadY + (h - roadY) * 0.55;
	const offset = (scrollX % (dash + gap) + (dash + gap)) % (dash + gap);
	ctx.fillStyle = ROAD_LINE;
	for (let x = -offset; x < w + dash; x += dash + gap) {
		roundedRect(ctx, x, y - 3, dash, 6, 3);
		ctx.fill();
	}
}
