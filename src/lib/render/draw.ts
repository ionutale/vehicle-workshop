import type { Layout, Viewport } from '../game/layout';

/**
 * Canvas plumbing: one DPR-aware backing store, one transform from world units to device
 * pixels, and a Path2D cache so path strings are parsed once.
 */

export interface Painter {
	ctx: CanvasRenderingContext2D;
	dpr: number;
}

const paths = new Map<string, Path2D>();

export function pathFrom(d: string): Path2D {
	let path = paths.get(d);
	if (!path) {
		path = new Path2D(d);
		paths.set(d, path);
	}
	return path;
}

export function devicePixelRatioFor(win: Window): number {
	return Math.min(2, Math.max(1, win.devicePixelRatio || 1));
}

export function prepareCanvas(
	canvas: HTMLCanvasElement,
	vp: Viewport,
	dpr: number,
	layout: Layout
): Painter {
	const width = Math.max(1, Math.round(vp.width * dpr));
	const height = Math.max(1, Math.round(vp.height * dpr));
	if (canvas.width !== width) canvas.width = width;
	if (canvas.height !== height) canvas.height = height;

	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas 2D is unavailable');

	setWorldTransform({ ctx, dpr }, vp, layout);
	return { ctx, dpr };
}

export function setWorldTransform(painter: Painter, vp: Viewport, layout: Layout): void {
	const { ctx, dpr } = painter;
	ctx.setTransform(
		(dpr * vp.width) / layout.worldWidth,
		0,
		0,
		(dpr * vp.height) / layout.worldHeight,
		0,
		0
	);
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
}

/** A rounded rectangle path in the current space. */
export function roundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
): void {
	const radius = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + w - radius, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
	ctx.lineTo(x + w, y + h - radius);
	ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
	ctx.lineTo(x + radius, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}
