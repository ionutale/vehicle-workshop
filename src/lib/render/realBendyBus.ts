/**
 * Bendy bus art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 4: shaded, fully fitted and lit.
 */

const O = '#3A271B';
const YELLOW = '#F9C74F';
const YELLOW_DARK = '#E0A92E';
const CHARCOAL = '#2B2D42';
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

const REAR_SHELL =
	'M64,240 L424,240 L424,70 L90,70 Q64,70 64,96 Z';
const FRONT_SHELL =
	'M500,240 L852,240 L852,96 Q852,70 826,70 L500,70 Z';
const BELLOWS =
	'M424,240 L500,240 L500,74 L424,74 Z';

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

export function drawRealBendyBus(
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
		ctx.ellipse(450, 292, 410, 14, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Two shells joined by an accordion bellows.
	shape(ctx, REAR_SHELL, YELLOW);
	shape(ctx, FRONT_SHELL, YELLOW);

	// Skirt band along both sections.
	rect(ctx, 64, 214, 360, 22, CHARCOAL, 0, 0);
	rect(ctx, 500, 214, 352, 22, CHARCOAL, 0, 0);

	// Bellows, with a rib per fold.
	shape(ctx, BELLOWS, CHARCOAL, 2.5);
	for (let rib = 432; rib < 500; rib += 11) {
		line(ctx, rib, 76, rib, 238, 'rgba(255,255,255,0.16)', 2);
	}

	// Window strips and the cab side glass.
	rect(ctx, 92, 92, 304, 60, GLASS, 8);
	for (let pane = 1; pane < 4; pane++) {
		line(ctx, 92 + pane * 76, 92, 92 + pane * 76, 152, O, 3);
	}
	rect(ctx, 522, 92, 202, 60, GLASS, 8);
	for (let pane = 1; pane < 3; pane++) {
		line(ctx, 522 + pane * 67, 92, 522 + pane * 67, 152, O, 3);
	}
	rect(ctx, 798, 92, 46, 58, GLASS, 6);
	line(ctx, 821, 92, 821, 150, O, 2.2);

	// Front door.
	rect(ctx, 748, 92, 42, 146, YELLOW, 4);
	rect(ctx, 752, 97, 34, 46, GLASS, 3);
	rect(ctx, 752, 149, 34, 40, GLASS, 3);
	line(ctx, 769, 97, 769, 196, O, 2);

	if (fitted) {
		// Destination board.
		rect(ctx, 780, 74, 66, 16, CHARCOAL, 3);
		rect(ctx, 785, 77, 56, 10, '#FFD166', 2);
		line(ctx, 790, 82, 828, 82, CHARCOAL, 2);

		// Mirror.
		line(ctx, 852, 102, 868, 94, O, 2.5);
		circle(ctx, 871, 92, 4, CHROME, 2);

		// Roof vents.
		for (const ventX of [130, 210, 290, 560, 640]) {
			rect(ctx, ventX, 64, 44, 8, YELLOW_DARK, 2, 1.5);
		}

		// Headlight, tail light, bumpers, plate.
		rect(ctx, 838, 190, 12, 20, '#FFE066', 3);
		rect(ctx, 64, 190, 10, 20, '#FF4D6D', 2);
		rect(ctx, 846, 228, 20, 12, CHROME, 3);
		rect(ctx, 46, 228, 20, 12, CHROME, 3);
		rect(ctx, 800, 228, 22, 9, CREAM, 2);

		// Door rail and grab handle.
		line(ctx, 748, 232, 790, 232, O, 2.5);
	}

	// Wheels: front axle, centre axle (baked into the body), rear axle.
	wheel(ctx, 760, 236, 36, finish);
	wheel(ctx, 340, 236, 36, finish);
	wheel(ctx, 150, 236, 36, finish);
	ctx.strokeStyle = YELLOW_DARK;
	ctx.lineWidth = 5;
	for (const wheelX of [760, 340, 150]) {
		ctx.beginPath();
		ctx.arc(wheelX, 236, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [760, 340, 150]) {
		ctx.beginPath();
		ctx.arc(wheelX, 236, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		ctx.save();
		const shell = new Path2D(`${REAR_SHELL} ${FRONT_SHELL}`);
		ctx.clip(shell);
		const gradient = ctx.createLinearGradient(0, 70, 0, 240);
		gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
		gradient.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		gradient.addColorStop(1, 'rgba(58,39,27,0.18)');
		ctx.fillStyle = gradient;
		ctx.fillRect(60, 66, 798, 178);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(92, 92, 304, 60);
		ctx.rect(522, 92, 202, 60);
		ctx.rect(798, 92, 46, 58);
		ctx.clip();
		const glass = ctx.createLinearGradient(92, 92, 640, 152);
		glass.addColorStop(0, 'rgba(255,255,255,0.55)');
		glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		glass.addColorStop(1, 'rgba(105,190,240,0.22)');
		ctx.fillStyle = glass;
		ctx.fillRect(92, 92, 752, 60);
		ctx.restore();
	}

	if (lit) {
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.moveTo(90, 74);
		ctx.lineTo(424, 74);
		ctx.moveTo(500, 74);
		ctx.lineTo(826, 74);
		ctx.stroke();

		const glow = ctx.createRadialGradient(844, 200, 1, 844, 200, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.75)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(844, 200, 28, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = O;
		for (const wheelX of [760, 340, 150]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 272, 38, 6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		ctx.save();
		const shell = new Path2D(`${REAR_SHELL} ${FRONT_SHELL}`);
		ctx.clip(shell);
		ctx.globalAlpha = 0.07;
		ctx.fillStyle = O;
		let seed = 17;
		for (let i = 0; i < 52; i++) {
			seed = (seed * 9301 + 49297) % 233280;
			const px = 70 + (seed / 233280) * 770;
			seed = (seed * 9301 + 49297) % 233280;
			const py = 80 + (seed / 233280) * 150;
			ctx.fillRect(px, py, 1.3, 1.3);
		}
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.9)';
		ctx.lineWidth = 3;
		for (const [gx, gy] of [
			[846, 120],
			[840, 176]
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
		ctx.arc(52, 270, 6, 0, Math.PI * 2);
		ctx.arc(60, 264, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}
