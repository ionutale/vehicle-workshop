/**
 * Mobile library art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 4: shaded, fully fitted and lit.
 */

const O = '#3A271B';
const CREAM = '#F2E8CF';
const TEAL = '#8AC6D1';
const TEAL_DARK = '#5FA4B3';
const GLASS = '#CFEFFF';
const TIRE = '#2B2D42';
const CHROME = '#C9D2DE';
const BOOKS = ['#E63946', '#457B9D', '#F9C74F', '#43AA8B', '#F9844A', '#577590', '#9B5DE5'];

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

function wheel(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, finish: boolean) {
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

const SHELL =
	'M70,246 L70,96 Q70,76 92,76 L700,76 Q718,76 726,88 L764,160 Q770,172 770,186 L770,222 Q770,246 750,246 Z';

function bookRow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number) {
	let px = x;
	let state = seed;
	while (px < x + w - 4) {
		state = (state * 9301 + 49297) % 233280;
		const bw = 5 + (state / 233280) * 5;
		state = (state * 9301 + 49297) % 233280;
		const book = BOOKS[Math.floor((state / 233280) * BOOKS.length)];
		const bh = h - 2 - (state / 233280) * 3;
		ctx.fillStyle = book;
		ctx.fillRect(px, y + h - bh, Math.min(bw, x + w - px), bh);
		px += bw + 1;
	}
}

export function drawRealMobileLibrary(
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

	// Level 4: shaded, fully fitted and lit; no paint grain.
	const shaded = true;
	const fitted = true;
	const lit = true;
	const finish = false;

	if (lit) {
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = O;
		ctx.beginPath();
		ctx.ellipse(410, 278, 360, 13, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Cream shell with the short van nose.
	shape(ctx, SHELL, CREAM);

	// Teal livery band and skirt.
	rect(ctx, 70, 190, 700, 20, TEAL, 0, 0);
	rect(ctx, 70, 220, 700, 26, TEAL_DARK, 0, 0);

	// Display wall with three shelves of books.
	rect(ctx, 120, 112, 400, 72, GLASS, 8);
	for (let shelf = 0; shelf < 3; shelf++) {
		const top = 116 + shelf * 24;
		bookRow(ctx, 124, top, 392, 18, 11 + shelf * 37);
		line(ctx, 120, top + 20, 520, top + 20, O, 2);
	}

	// Service door.
	rect(ctx, 552, 112, 54, 130, TEAL, 4);
	rect(ctx, 557, 118, 44, 44, GLASS, 3);
	rect(ctx, 557, 168, 44, 52, CREAM, 3);
	line(ctx, 579, 118, 579, 220, O, 2);

	if (fitted) {
		// Awning cassette above the display wall, with stripes.
		rect(ctx, 112, 100, 416, 10, TEAL_DARK, 3, 2);
		for (let stripe = 0; stripe < 8; stripe++) {
			line(ctx, 126 + stripe * 50, 102, 126 + stripe * 50, 108, CREAM, 3);
		}

		// Roof vent and open-book sign.
		rect(ctx, 300, 68, 64, 8, TEAL_DARK, 2, 1.5);
		rect(ctx, 462, 62, 96, 16, TEAL, 4);
		ctx.strokeStyle = CREAM;
		ctx.lineWidth = 2.5;
		ctx.beginPath();
		ctx.moveTo(482, 74);
		ctx.lineTo(482, 66);
		ctx.quadraticCurveTo(496, 62, 509, 66);
		ctx.lineTo(509, 74);
		ctx.quadraticCurveTo(496, 70, 482, 74);
		ctx.stroke();
		line(ctx, 509, 66, 509, 74, CREAM, 2.5);

		// Mirror, lights, bumpers, plate, handle, step.
		line(ctx, 760, 150, 784, 142, O, 2.5);
		circle(ctx, 787, 140, 4, CHROME, 2);
		rect(ctx, 756, 198, 14, 20, '#FFE066', 3);
		rect(ctx, 70, 198, 10, 20, '#FF4D6D', 2);
		rect(ctx, 764, 228, 18, 14, CHROME, 3);
		rect(ctx, 54, 230, 16, 12, CHROME, 3);
		rect(ctx, 710, 230, 22, 9, CREAM, 2);
		line(ctx, 594, 190, 600, 190, CHROME, 3);
		rect(ctx, 548, 236, 62, 6, CHROME, 2);
	}

	// Wheels and arches.
	for (const wheelX of [620, 160]) {
		wheel(ctx, wheelX, 236, 34, finish);
	}
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 5;
	for (const wheelX of [620, 160]) {
		ctx.beginPath();
		ctx.arc(wheelX, 236, 40, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [620, 160]) {
		ctx.beginPath();
		ctx.arc(wheelX, 236, 40, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const gradient = ctx.createLinearGradient(0, 76, 0, 246);
		gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
		gradient.addColorStop(0.45, 'rgba(255,255,255,0.05)');
		gradient.addColorStop(1, 'rgba(47,92,119,0.2)');
		ctx.fillStyle = gradient;
		ctx.fillRect(64, 70, 708, 178);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(120, 112, 400, 72);
		ctx.clip();
		const glass = ctx.createLinearGradient(120, 112, 520, 184);
		glass.addColorStop(0, 'rgba(255,255,255,0.35)');
		glass.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		glass.addColorStop(1, 'rgba(105,190,240,0.2)');
		ctx.fillStyle = glass;
		ctx.fillRect(120, 112, 400, 72);
		ctx.restore();
	}

	if (lit) {
		ctx.strokeStyle = 'rgba(255,255,255,0.65)';
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.moveTo(92, 80);
		ctx.lineTo(702, 80);
		ctx.stroke();

		const glow = ctx.createRadialGradient(762, 208, 1, 762, 208, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.75)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(762, 208, 26, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = O;
		for (const wheelX of [620, 160]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 270, 38, 6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.07;
		ctx.fillStyle = O;
		let seed = 41;
		for (let i = 0; i < 44; i++) {
			seed = (seed * 9301 + 49297) % 233280;
			const px = 76 + (seed / 233280) * 690;
			seed = (seed * 9301 + 49297) % 233280;
			const py = 84 + (seed / 233280) * 150;
			ctx.fillRect(px, py, 1.3, 1.3);
		}
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.9)';
		ctx.lineWidth = 3;
		for (const [gx, gy] of [
			[760, 142],
			[754, 178]
		]) {
			ctx.beginPath();
			ctx.moveTo(gx - 4, gy);
			ctx.lineTo(gx + 4, gy);
			ctx.moveTo(gx, gy - 4);
			ctx.lineTo(gx, gy + 4);
			ctx.stroke();
		}

		ctx.save();
		ctx.globalAlpha = 0.18;
		ctx.fillStyle = '#9AA3B2';
		ctx.beginPath();
		ctx.arc(58, 262, 6, 0, Math.PI * 2);
		ctx.arc(66, 256, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}
