/**
 * Airport shuttle art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 4: shaded, fully fitted and lit.
 */

const O = '#3A271B';
const WHITE = '#F7F9FC';
const BLUE = '#457B9D';
const BLUE_DARK = '#2F5C77';
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
	'M70,240 L70,108 Q70,90 92,90 L640,90 Q658,90 666,102 L706,162 Q712,172 712,184 L712,214 Q712,240 694,240 Z';

export function drawRealAirportShuttle(
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
		ctx.ellipse(400, 272, 350, 13, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// White shuttle shell with the short van nose.
	shape(ctx, SHELL, WHITE);

	// Blue livery band and skirt.
	rect(ctx, 70, 196, 642, 16, BLUE, 0, 0);
	rect(ctx, 70, 218, 642, 22, BLUE_DARK, 0, 0);

	// Side window band.
	rect(ctx, 100, 116, 444, 60, GLASS, 9);
	for (let pane = 1; pane < 4; pane++) {
		line(ctx, 100 + pane * 111, 116, 100 + pane * 111, 176, O, 3);
	}

	// Raked windscreen.
	shape(ctx, 'M668,104 L694,104 L708,166 L682,172 Z', GLASS, 2.5);
	line(ctx, 686, 108, 698, 162, O, 2);

	// Sliding door behind the front axle.
	rect(ctx, 556, 116, 52, 120, WHITE, 4);
	rect(ctx, 561, 122, 42, 48, GLASS, 3);
	rect(ctx, 561, 176, 42, 36, GLASS, 3);
	line(ctx, 582, 122, 582, 212, O, 2);

	if (fitted) {
		// Roof air-conditioning pod and shuttle sign.
		rect(ctx, 300, 82, 82, 9, BLUE_DARK, 2, 1.5);
		rect(ctx, 470, 78, 92, 14, BLUE, 4);
		rect(ctx, 477, 82, 78, 6, WHITE, 2, 1.5);

		// Mirror, lights, bumpers, plate, handles.
		line(ctx, 700, 154, 724, 146, O, 2.5);
		circle(ctx, 727, 144, 4, CHROME, 2);
		rect(ctx, 698, 196, 14, 20, '#FFE066', 3);
		rect(ctx, 70, 196, 10, 20, '#FF4D6D', 2);
		rect(ctx, 700, 224, 18, 14, CHROME, 3);
		rect(ctx, 54, 228, 16, 12, CHROME, 3);
		rect(ctx, 650, 228, 22, 9, WHITE, 2);
		line(ctx, 566, 190, 584, 190, CHROME, 3);
		line(ctx, 100, 190, 116, 190, CHROME, 3);
	}

	// Wheels and arches.
	for (const wheelX of [640, 160]) {
		wheel(ctx, wheelX, 228, 34, finish);
	}
	ctx.strokeStyle = WHITE;
	ctx.lineWidth = 5;
	for (const wheelX of [640, 160]) {
		ctx.beginPath();
		ctx.arc(wheelX, 228, 40, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [640, 160]) {
		ctx.beginPath();
		ctx.arc(wheelX, 228, 40, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const gradient = ctx.createLinearGradient(0, 90, 0, 240);
		gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
		gradient.addColorStop(0.45, 'rgba(255,255,255,0.06)');
		gradient.addColorStop(1, 'rgba(47,92,119,0.2)');
		ctx.fillStyle = gradient;
		ctx.fillRect(64, 84, 652, 162);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(100, 116, 444, 60);
		ctx.clip();
		const glass = ctx.createLinearGradient(100, 116, 544, 176);
		glass.addColorStop(0, 'rgba(255,255,255,0.55)');
		glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		glass.addColorStop(1, 'rgba(105,190,240,0.24)');
		ctx.fillStyle = glass;
		ctx.fillRect(100, 116, 444, 60);
		ctx.restore();
	}

	if (lit) {
		ctx.strokeStyle = 'rgba(255,255,255,0.65)';
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.moveTo(92, 94);
		ctx.lineTo(644, 94);
		ctx.stroke();

		const glow = ctx.createRadialGradient(704, 206, 1, 704, 206, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.75)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(704, 206, 26, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = O;
		for (const wheelX of [640, 160]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 262, 38, 6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.07;
		ctx.fillStyle = O;
		let seed = 31;
		for (let i = 0; i < 42; i++) {
			seed = (seed * 9301 + 49297) % 233280;
			const px = 76 + (seed / 233280) * 632;
			seed = (seed * 9301 + 49297) % 233280;
			const py = 96 + (seed / 233280) * 140;
			ctx.fillRect(px, py, 1.3, 1.3);
		}
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.9)';
		ctx.lineWidth = 3;
		for (const [gx, gy] of [
			[702, 140],
			[696, 176]
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
		ctx.arc(58, 254, 6, 0, Math.PI * 2);
		ctx.arc(66, 248, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}
