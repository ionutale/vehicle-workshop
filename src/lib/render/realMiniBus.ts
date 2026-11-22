/**
 * Mini bus art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 4: shaded, fully fitted and lit.
 */

const O = '#3A271B';
const TEAL = '#8AC6D1';
const NAVY = '#1D3557';
const CREAM = '#FFF9EC';
const GLASS = '#CFEFFF';
const TIRE = '#2B2D42';
const CHROME = '#C9D2DE';

const rounded = (w: number, h: number, r: number): string => {
	const x = w / 2;
	const y = h / 2;
	return `M${-x + r},${-y} L${x - r},${-y} Q${x},${-y} ${x},${-y + r} L${x},${y - r} Q${x},${y} ${x - r},${y} L${-x + r},${y} Q${-x},${y} ${-x},${y - r} L${-x},${-y + r} Q${-x},${-y} ${-x + r},${-y} Z`;
};

function shape(ctx: CanvasRenderingContext2D, d: string, fill: string, width = 3): void {
	const path = new Path2D(d);
	ctx.fillStyle = fill;
	ctx.fill(path);
	ctx.strokeStyle = O;
	ctx.lineWidth = width;
	ctx.stroke(path);
}

function rect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	fill: string,
	r = 0,
	width = 2.5
): void {
	const path = new Path2D(rounded(w, h, r));
	ctx.save();
	ctx.translate(x + w / 2, y + h / 2);
	ctx.fillStyle = fill;
	ctx.fill(path);
	ctx.strokeStyle = O;
	ctx.lineWidth = width;
	ctx.stroke(path);
	ctx.restore();
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string, width = 2.2) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = fill;
	ctx.fill();
	ctx.strokeStyle = O;
	ctx.lineWidth = width;
	ctx.stroke();
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color = O, width = 2.5) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.stroke();
}

function wheel(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
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
}

export function drawRealMiniBus(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	// Cast shadow.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = O;
	ctx.beginPath();
	ctx.ellipse(325, 272, 285, 13, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// Shell.
	shape(
		ctx,
		'M55,235 Q40,235 40,218 L40,125 Q40,100 65,100 L575,100 Q600,100 600,125 L600,218 Q600,235 585,235 Z',
		TEAL
	);

	// Navy side band and roof side rail.
	rect(ctx, 46, 196, 550, 14, NAVY, 0, 0);
	line(ctx, 65, 111, 575, 111, 'rgba(255,255,255,0.35)', 2.5);

	// Side windows.
	rect(ctx, 100, 118, 390, 54, GLASS, 8);
	for (let pane = 1; pane < 3; pane++) {
		line(ctx, 100 + pane * 130, 118, 100 + pane * 130, 172, O, 3);
	}
	rect(ctx, 540, 116, 52, 64, GLASS, 8);
	line(ctx, 566, 116, 566, 180, O, 2.5);
	rect(ctx, 58, 118, 34, 54, GLASS, 7);

	// Door.
	rect(ctx, 500, 118, 35, 108, TEAL, 4);
	rect(ctx, 504, 124, 27, 40, GLASS, 3);
	rect(ctx, 504, 170, 27, 42, GLASS, 3);
	line(ctx, 517, 124, 517, 212, O, 2);

	// Destination board, mirror, roof vent, lights, bumpers, plate.
	rect(ctx, 540, 100, 52, 15, O, 3);
	rect(ctx, 545, 103, 42, 9, '#FFD166', 2);
	line(ctx, 600, 126, 616, 118, O, 2.5);
	circle(ctx, 619, 116, 4, CHROME, 2);
	rect(ctx, 225, 92, 76, 8, '#E6F2F5', 2);
	rect(ctx, 590, 200, 10, 14, '#FFE066', 3);
	rect(ctx, 34, 208, 7, 16, '#FF4D6D', 2);
	rect(ctx, 30, 230, 24, 10, CHROME, 3);
	rect(ctx, 596, 218, 24, 12, CHROME, 3);
	rect(ctx, 548, 226, 18, 8, CREAM, 2);

	// Wheels and arches.
	wheel(ctx, 140, 228, 34);
	wheel(ctx, 500, 228, 34);
	ctx.strokeStyle = TEAL;
	ctx.lineWidth = 5;
	for (const wheelX of [140, 500]) {
		ctx.beginPath();
		ctx.arc(wheelX, 228, 40, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [140, 500]) {
		ctx.beginPath();
		ctx.arc(wheelX, 228, 40, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	// Shading.
	ctx.save();
	const shell = new Path2D(
		'M55,235 Q40,235 40,218 L40,125 Q40,100 65,100 L575,100 Q600,100 600,125 L600,218 Q600,235 585,235 Z'
	);
	ctx.clip(shell);
	const gradient = ctx.createLinearGradient(0, 100, 0, 235);
	gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
	gradient.addColorStop(0.4, 'rgba(255,255,255,0.02)');
	gradient.addColorStop(1, 'rgba(29,53,87,0.18)');
	ctx.fillStyle = gradient;
	ctx.fillRect(40, 100, 560, 135);
	ctx.restore();

	ctx.save();
	ctx.beginPath();
	ctx.rect(100, 118, 390, 54);
	ctx.clip();
	const glass = ctx.createLinearGradient(100, 118, 490, 172);
	glass.addColorStop(0, 'rgba(255,255,255,0.55)');
	glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.22)');
	ctx.fillStyle = glass;
	ctx.fillRect(100, 118, 390, 54);
	ctx.restore();

	// Rim light and headlight glow.
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(65, 106);
	ctx.lineTo(575, 106);
	ctx.stroke();

	const glow = ctx.createRadialGradient(590, 202, 1, 590, 202, 24);
	glow.addColorStop(0, 'rgba(255,240,150,0.7)');
	glow.addColorStop(1, 'rgba(255,240,150,0)');
	ctx.fillStyle = glow;
	ctx.beginPath();
	ctx.arc(590, 202, 24, 0, Math.PI * 2);
	ctx.fill();

	// Wheel contact patches.
	ctx.save();
	ctx.globalAlpha = 0.2;
	ctx.fillStyle = O;
	for (const wheelX of [140, 500]) {
		ctx.beginPath();
		ctx.ellipse(wheelX, 264, 38, 6, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	ctx.restore();
}
