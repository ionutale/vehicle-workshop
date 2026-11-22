/**
 * Coach bus art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 4: shaded, fully fitted and lit.
 */

const O = '#3A271B';
const BLUE = '#457B9D';
const BLUE_DARK = '#2F5C77';
const CREAM = '#F7F9FC';
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

const SHELL = 'M70,250 L70,88 Q70,66 92,66 L766,66 Q788,66 798,88 L820,182 L820,250 Z';

export function drawRealCoachBus(
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
		ctx.ellipse(440, 296, 380, 14, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell with the raked coach front.
	shape(ctx, SHELL, BLUE);

	// Cream livery band and lower skirt.
	rect(ctx, 70, 178, 750, 14, CREAM, 0, 0);
	rect(ctx, 70, 226, 750, 24, BLUE_DARK, 0, 0);

	// Panoramic side window band.
	rect(ctx, 100, 96, 584, 72, GLASS, 10);
	for (let pane = 1; pane < 6; pane++) {
		line(ctx, 100 + pane * 97.33, 96, 100 + pane * 97.33, 168, O, 3);
	}

	// Windscreen following the rake, and a quarter light.
	shape(ctx, 'M752,96 L788,96 L804,172 L762,172 Z', GLASS, 2.5);
	line(ctx, 776, 100, 790, 168, O, 2);

	// Front door with a tall glass panel.
	rect(ctx, 692, 96, 44, 148, CREAM, 4);
	rect(ctx, 697, 102, 34, 64, GLASS, 3);
	rect(ctx, 697, 172, 34, 42, GLASS, 3);
	line(ctx, 714, 102, 714, 214, O, 2);

	if (fitted) {
		// Luggage bay doors and handles.
		for (const bay of [
			[110, 176],
			[356, 176]
		]) {
			rect(ctx, bay[0], 192, 232, 46, BLUE_DARK, 5, 2);
			line(ctx, bay[0] + 196, 210, bay[0] + 214, 210, CHROME, 3);
		}

		// Destination board, roof pods, mirror.
		rect(ctx, 770, 70, 40, 16, O, 3);
		rect(ctx, 774, 73, 32, 10, '#FFD166', 2);
		rect(ctx, 190, 56, 90, 10, BLUE_DARK, 3);
		rect(ctx, 330, 56, 90, 10, BLUE_DARK, 3);
		line(ctx, 800, 96, 826, 86, O, 2.5);
		circle(ctx, 829, 84, 4, CHROME, 2);

		// Lights, bumpers, plate, tow eye.
		rect(ctx, 806, 196, 14, 24, '#FFE066', 3);
		rect(ctx, 70, 196, 10, 22, '#FF4D6D', 2);
		rect(ctx, 810, 228, 14, 20, CHROME, 3);
		rect(ctx, 56, 232, 16, 16, CHROME, 3);
		rect(ctx, 748, 232, 26, 9, CREAM, 2);

		// Rear engine grille.
		for (let bar = 0; bar < 4; bar++) {
			line(ctx, 74, 190 + bar * 8, 96, 190 + bar * 8, 'rgba(58,39,27,0.5)', 2);
		}
	}

	// Wheels with silver coach trims.
	for (const wheelX of [640, 170]) {
		circle(ctx, wheelX, 252, 36, TIRE, 3);
		ctx.strokeStyle = 'rgba(0,0,0,0.28)';
		ctx.lineWidth = 2;
		for (let i = 0; i < 12; i++) {
			const a = (i / 12) * Math.PI * 2;
			ctx.beginPath();
			ctx.moveTo(wheelX + Math.cos(a) * 27, 252 + Math.sin(a) * 27);
			ctx.lineTo(wheelX + Math.cos(a) * 34, 252 + Math.sin(a) * 34);
			ctx.stroke();
		}
		circle(ctx, wheelX, 252, 18, CHROME, 2.4);
		circle(ctx, wheelX, 252, 7, '#8A93A3', 1.8);
		if (finish) {
			for (let i = 0; i < 6; i++) {
				const a = (i / 6) * Math.PI * 2;
				circle(ctx, wheelX + Math.cos(a) * 12, 252 + Math.sin(a) * 12, 1.4, '#5C6472', 1);
			}
		}
	}
	ctx.strokeStyle = BLUE;
	ctx.lineWidth = 5;
	for (const wheelX of [640, 170]) {
		ctx.beginPath();
		ctx.arc(wheelX, 252, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [640, 170]) {
		ctx.beginPath();
		ctx.arc(wheelX, 252, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const gradient = ctx.createLinearGradient(0, 66, 0, 250);
		gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
		gradient.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		gradient.addColorStop(1, 'rgba(20,45,60,0.22)');
		ctx.fillStyle = gradient;
		ctx.fillRect(64, 60, 762, 194);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(100, 96, 584, 72);
		ctx.clip();
		const glass = ctx.createLinearGradient(100, 96, 660, 168);
		glass.addColorStop(0, 'rgba(255,255,255,0.55)');
		glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		glass.addColorStop(1, 'rgba(105,190,240,0.24)');
		ctx.fillStyle = glass;
		ctx.fillRect(100, 96, 584, 72);
		ctx.restore();
	}

	if (lit) {
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.moveTo(92, 70);
		ctx.lineTo(766, 70);
		ctx.stroke();

		const glow = ctx.createRadialGradient(812, 208, 1, 812, 208, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.75)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(812, 208, 28, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = O;
		for (const wheelX of [640, 170]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 288, 40, 6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.07;
		ctx.fillStyle = O;
		let seed = 23;
		for (let i = 0; i < 48; i++) {
			seed = (seed * 9301 + 49297) % 233280;
			const px = 76 + (seed / 233280) * 738;
			seed = (seed * 9301 + 49297) % 233280;
			const py = 74 + (seed / 233280) * 168;
			ctx.fillRect(px, py, 1.3, 1.3);
		}
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.9)';
		ctx.lineWidth = 3;
		for (const [gx, gy] of [
			[808, 150],
			[802, 120]
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
		ctx.arc(58, 280, 6, 0, Math.PI * 2);
		ctx.arc(66, 274, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}
