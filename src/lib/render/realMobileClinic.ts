/**
 * Mobile clinic art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 4: shaded, fully fitted and lit.
 */

const O = '#3A271B';
const WHITE = '#F7F9FC';
const RED = '#E63946';
const RED_DARK = '#C1121F';
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
	'M70,246 L70,96 Q70,76 92,76 L700,76 Q718,76 726,88 L764,160 Q770,172 770,186 L770,222 Q770,246 750,246 Z';

function cross(ctx: CanvasRenderingContext2D, cx: number, cy: number, arm: number, thick: number, fill: string) {
	ctx.fillStyle = fill;
	ctx.fillRect(cx - thick / 2, cy - arm, thick, arm * 2);
	ctx.fillRect(cx - arm, cy - thick / 2, arm * 2, thick);
}

export function drawRealMobileClinic(
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

	// White clinic shell.
	shape(ctx, SHELL, WHITE);

	// Red livery band and skirt.
	rect(ctx, 70, 190, 700, 18, RED, 0, 0);
	rect(ctx, 70, 220, 700, 26, RED_DARK, 0, 0);

	// Red cross on the rear side panel.
	cross(ctx, 186, 146, 34, 26, RED);

	// Treatment-room window.
	rect(ctx, 264, 112, 208, 64, GLASS, 8);
	line(ctx, 368, 112, 368, 176, O, 3);
	line(ctx, 272, 122, 464, 122, 'rgba(255,255,255,0.55)', 2);

	// Patient door.
	rect(ctx, 552, 112, 54, 130, WHITE, 4);
	rect(ctx, 557, 118, 44, 46, GLASS, 3);
	rect(ctx, 557, 170, 44, 50, WHITE, 3);
	line(ctx, 579, 118, 579, 220, O, 2);

	if (fitted) {
		// Roof cross sign and vent.
		rect(ctx, 330, 58, 92, 20, WHITE, 3);
		cross(ctx, 376, 68, 7, 5, RED);
		rect(ctx, 464, 68, 60, 8, RED_DARK, 2, 1.5);

		// Mirror, lights, bumpers, plate, handle, step.
		line(ctx, 760, 150, 784, 142, O, 2.5);
		circle(ctx, 787, 140, 4, CHROME, 2);
		rect(ctx, 756, 198, 14, 20, '#FFE066', 3);
		rect(ctx, 70, 198, 10, 20, '#FF4D6D', 2);
		rect(ctx, 764, 228, 18, 14, CHROME, 3);
		rect(ctx, 54, 230, 16, 12, CHROME, 3);
		rect(ctx, 710, 230, 22, 9, WHITE, 2);
		line(ctx, 594, 190, 600, 190, CHROME, 3);
		rect(ctx, 548, 236, 62, 6, CHROME, 2);

		// Small medical kit box mark by the door.
		rect(ctx, 512, 130, 24, 18, RED, 2, 2);
		line(ctx, 524, 134, 524, 144, WHITE, 3);
		line(ctx, 518, 139, 530, 139, WHITE, 3);
	}

	// Wheels and arches.
	for (const wheelX of [620, 160]) {
		wheel(ctx, wheelX, 236, 34, finish);
	}
	ctx.strokeStyle = WHITE;
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
		gradient.addColorStop(1, 'rgba(193,18,31,0.16)');
		ctx.fillStyle = gradient;
		ctx.fillRect(64, 70, 708, 178);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(264, 112, 208, 64);
		ctx.clip();
		const glass = ctx.createLinearGradient(264, 112, 472, 176);
		glass.addColorStop(0, 'rgba(255,255,255,0.55)');
		glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		glass.addColorStop(1, 'rgba(105,190,240,0.22)');
		ctx.fillStyle = glass;
		ctx.fillRect(264, 112, 208, 64);
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
		let seed = 47;
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
