/**
 * Trolleybus art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 4: shaded, fully fitted and lit.
 */

const O = '#3A271B';
const TEAL = '#2A9D8F';
const TEAL_DARK = '#1F7A6F';
const CREAM = '#F2E8CF';
const GLASS = '#CFEFFF';
const TIRE = '#2B2D42';
const CHROME = '#C9D2DE';
const STEEL = '#5C6472';

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
	'M70,246 L70,124 Q70,100 94,100 L730,100 Q752,100 762,116 L790,180 Q796,192 796,206 L796,232 Q796,246 780,246 Z';

function pole(ctx: CanvasRenderingContext2D, baseX: number, tipX: number, tipY: number, finish: boolean) {
	line(ctx, baseX, 100, tipX, tipY, O, 9);
	line(ctx, baseX, 100, tipX, tipY, STEEL, 6);
	line(ctx, baseX - 1, 98, tipX - 1, tipY + 2, 'rgba(255,255,255,0.4)', 1.6);
	if (finish) {
		rect(ctx, tipX - 18, tipY - 4, 36, 7, STEEL, 2, 2);
	}
}

export function drawRealTrolleybus(
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
		ctx.ellipse(430, 292, 380, 14, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Twin trolley poles on the roof.
	pole(ctx, 436, 300, 48, fitted);
	pole(ctx, 474, 344, 48, fitted);

	// Cream shell with a teal livery.
	shape(ctx, SHELL, CREAM);
	rect(ctx, 70, 196, 726, 20, TEAL, 0, 0);
	rect(ctx, 70, 224, 726, 22, TEAL_DARK, 0, 0);

	// Side window band.
	rect(ctx, 100, 118, 560, 62, GLASS, 9);
	for (let pane = 1; pane < 6; pane++) {
		line(ctx, 100 + pane * 93.33, 118, 100 + pane * 93.33, 180, O, 3);
	}

	// Windscreen and cab quarter light.
	shape(ctx, 'M714,104 L746,104 L764,172 L732,178 Z', GLASS, 2.5);
	line(ctx, 738, 108, 752, 168, O, 2);

	// Front door.
	rect(ctx, 668, 118, 42, 124, TEAL, 4);
	rect(ctx, 673, 124, 32, 46, GLASS, 3);
	rect(ctx, 673, 176, 32, 40, GLASS, 3);
	line(ctx, 689, 124, 689, 216, O, 2);

	if (fitted) {
		// Pole bases and collector shoes.
		rect(ctx, 426, 92, 20, 10, STEEL, 2, 2);
		rect(ctx, 464, 92, 20, 10, STEEL, 2, 2);
		rect(ctx, 282, 42, 36, 8, STEEL, 2, 2);
		rect(ctx, 326, 42, 36, 8, STEEL, 2, 2);

		// Destination board, roof vents, mirror.
		rect(ctx, 708, 104, 58, 14, O, 3);
		rect(ctx, 713, 107, 48, 8, '#FFD166', 2);
		rect(ctx, 190, 92, 72, 8, TEAL_DARK, 2, 1.5);
		rect(ctx, 280, 92, 72, 8, TEAL_DARK, 2, 1.5);
		line(ctx, 794, 132, 814, 124, O, 2.5);
		circle(ctx, 817, 122, 4, CHROME, 2);

		// Lights, bumpers, plate.
		rect(ctx, 784, 198, 12, 18, '#FFE066', 3);
		rect(ctx, 70, 198, 10, 18, '#FF4D6D', 2);
		rect(ctx, 792, 228, 18, 14, CHROME, 3);
		rect(ctx, 54, 230, 16, 12, CHROME, 3);
		rect(ctx, 748, 230, 22, 9, CREAM, 2);
	}

	// Wheels and arches.
	for (const wheelX of [640, 160]) {
		wheel(ctx, wheelX, 236, 36, finish);
	}
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 5;
	for (const wheelX of [640, 160]) {
		ctx.beginPath();
		ctx.arc(wheelX, 236, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [640, 160]) {
		ctx.beginPath();
		ctx.arc(wheelX, 236, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const gradient = ctx.createLinearGradient(0, 100, 0, 246);
		gradient.addColorStop(0, 'rgba(255,255,255,0.45)');
		gradient.addColorStop(0.45, 'rgba(255,255,255,0.04)');
		gradient.addColorStop(1, 'rgba(31,122,111,0.2)');
		ctx.fillStyle = gradient;
		ctx.fillRect(64, 94, 738, 158);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(100, 118, 560, 62);
		ctx.clip();
		const glass = ctx.createLinearGradient(100, 118, 660, 180);
		glass.addColorStop(0, 'rgba(255,255,255,0.55)');
		glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		glass.addColorStop(1, 'rgba(105,190,240,0.24)');
		ctx.fillStyle = glass;
		ctx.fillRect(100, 118, 560, 62);
		ctx.restore();
	}

	if (lit) {
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.moveTo(94, 104);
		ctx.lineTo(730, 104);
		ctx.stroke();

		const glow = ctx.createRadialGradient(790, 208, 1, 790, 208, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.75)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(790, 208, 26, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = O;
		for (const wheelX of [640, 160]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 272, 40, 6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.07;
		ctx.fillStyle = O;
		let seed = 53;
		for (let i = 0; i < 48; i++) {
			seed = (seed * 9301 + 49297) % 233280;
			const px = 76 + (seed / 233280) * 720;
			seed = (seed * 9301 + 49297) % 233280;
			const py = 108 + (seed / 233280) * 132;
			ctx.fillRect(px, py, 1.3, 1.3);
		}
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.9)';
		ctx.lineWidth = 3;
		for (const [gx, gy] of [
			[792, 150],
			[786, 182]
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
		ctx.arc(58, 264, 6, 0, Math.PI * 2);
		ctx.arc(66, 258, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}
