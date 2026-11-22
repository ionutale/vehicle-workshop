/**
 * Shared canvas helpers for the realistic cut-out art.
 *
 * Art modules keep only their own geometry and livery. Strokes, tyres, glass and the
 * mask builders live here so every vehicle has the same outline weight and the wheel
 * mask can never be authored off-centre again.
 */

export const INK = '#3A271B';
export const GLASS = '#CFEFFF';
export const TIRE = '#2B2D42';
export const CHROME = '#C9D2DE';
export const STEEL = '#5C6472';

export const roundedPath = (w: number, h: number, r: number): string => {
	const x = w / 2;
	const y = h / 2;
	return `M${-x + r},${-y} L${x - r},${-y} Q${x},${-y} ${x},${-y + r} L${x},${y - r} Q${x},${y} ${x - r},${y} L${-x + r},${y} Q${-x},${y} ${-x},${y - r} L${-x},${-y + r} Q${-x},${-y} ${-x + r},${-y} Z`;
};

export function shape(
	ctx: CanvasRenderingContext2D,
	d: string,
	fill: string,
	width = 3
): void {
	const path = new Path2D(d);
	ctx.fillStyle = fill;
	ctx.fill(path);
	ctx.strokeStyle = INK;
	ctx.lineWidth = width;
	ctx.stroke(path);
}

export function rect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	fill: string,
	r = 0,
	width = 2.5
): void {
	const path = new Path2D(roundedPath(w, h, r));
	ctx.save();
	ctx.translate(x + w / 2, y + h / 2);
	ctx.fillStyle = fill;
	ctx.fill(path);
	ctx.strokeStyle = INK;
	ctx.lineWidth = width;
	ctx.stroke(path);
	ctx.restore();
}

export function circle(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	r: number,
	fill: string,
	width = 2.2
): void {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = fill;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = width;
	ctx.stroke();
}

export function line(
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	color = INK,
	width = 2.5
): void {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.stroke();
}

export function wheel(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	r: number,
	finish = false
): void {
	circle(ctx, x, y, r, TIRE, 3);
	ctx.strokeStyle = 'rgba(0,0,0,0.28)';
	ctx.lineWidth = 2;
	for (let i = 0; i < 12; i++) {
		const a = (i / 12) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(a) * r * 0.75, y + Math.sin(a) * r * 0.75);
		ctx.lineTo(x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95);
		ctx.stroke();
	}
	circle(ctx, x, y, r * 0.42, CHROME, 2.4);
	circle(ctx, x, y, r * 0.16, '#8A93A3', 1.8);
	if (finish) {
		for (let i = 0; i < 5; i++) {
			const a = (i / 5) * Math.PI * 2;
			circle(ctx, x + Math.cos(a) * r * 0.22, y + Math.sin(a) * r * 0.22, 1.3, '#5C6472', 1);
		}
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(x, y, r * 0.5, Math.PI * 1.1, Math.PI * 1.8);
		ctx.stroke();
	}
}

/** A full circle centred on the wheel. Never author a wheel mask from a corner. */
export function circleMask(cx: number, cy: number, r: number): string {
	return `M${cx - r},${cy} A${r},${r} 0 1 1 ${cx + r},${cy} A${r},${r} 0 1 1 ${cx - r},${cy} Z`;
}

export function circleBounds(cx: number, cy: number, r: number) {
	return { x: cx - r, y: cy - r, w: r * 2, h: r * 2 };
}

export function rectMask(x: number, y: number, w: number, h: number): string {
	return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
}

export function rectBounds(x: number, y: number, w: number, h: number) {
	return { x, y, w, h };
}
