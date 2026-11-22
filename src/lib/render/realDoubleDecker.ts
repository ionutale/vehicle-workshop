/**
 * Double-decker art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 4: shaded, fully fitted and lit.
 */

const O = '#3A271B';
const RED = '#E63946';
const DARK_RED = '#C1121F';
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

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, r = 0, width = 2.5) {
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

export function drawRealDoubleDecker(
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
		ctx.ellipse(380, 368, 350, 14, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell.
	shape(
		ctx,
		'M55,330 Q40,330 40,312 L40,100 Q40,70 70,70 L690,70 Q720,70 720,100 L720,312 Q720,330 705,330 Z',
		RED
	);

	// Cream deck band.
	rect(ctx, 45, 168, 670, 20, CREAM, 0, 0);

	// Upper and lower windows.
	rect(ctx, 100, 95, 540, 55, GLASS, 8);
	for (let pane = 1; pane < 5; pane++) {
		line(ctx, 100 + pane * 108, 95, 100 + pane * 108, 150, O, 3);
	}
	rect(ctx, 100, 196, 490, 56, GLASS, 8);
	for (let pane = 1; pane < 4; pane++) {
		line(ctx, 100 + pane * 122, 196, 100 + pane * 122, 252, O, 3);
	}
	rect(ctx, 655, 88, 55, 232, GLASS, 8);
	line(ctx, 681, 88, 681, 320, O, 2.5);
	line(ctx, 655, 168, 710, 168, O, 2.5);

	// Door.
	rect(ctx, 600, 196, 36, 118, RED, 4);
	rect(ctx, 604, 202, 28, 44, GLASS, 3);
	rect(ctx, 604, 254, 28, 46, GLASS, 3);
	line(ctx, 618, 202, 618, 300, O, 2);

	if (fitted) {
		// Destination board, mirror, vents, lights, bumpers, plate.
		rect(ctx, 648, 74, 65, 17, O, 3);
		rect(ctx, 653, 77, 55, 11, '#FFD166', 2);
		line(ctx, 720, 108, 738, 100, O, 2.5);
		circle(ctx, 741, 98, 4, CHROME, 2);
		for (let vent = 0; vent < 3; vent++) {
			rect(ctx, 220 + vent * 80, 62, 40, 8, DARK_RED, 2, 1.5);
		}
		rect(ctx, 712, 286, 10, 16, '#FFE066', 3);
		rect(ctx, 34, 288, 8, 18, '#FF4D6D', 2);
		rect(ctx, 30, 314, 26, 12, CHROME, 3);
		rect(ctx, 706, 314, 30, 12, CHROME, 3);
		rect(ctx, 650, 314, 20, 9, CREAM, 2);
	}

	wheel(ctx, 160, 324, 36, finish);
	wheel(ctx, 600, 324, 36, finish);
	ctx.strokeStyle = RED;
	ctx.lineWidth = 5;
	for (const wheelX of [160, 600]) {
		ctx.beginPath();
		ctx.arc(wheelX, 324, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [160, 600]) {
		ctx.beginPath();
		ctx.arc(wheelX, 324, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		ctx.save();
		const shell = new Path2D(
			'M55,330 Q40,330 40,312 L40,100 Q40,70 70,70 L690,70 Q720,70 720,100 L720,312 Q720,330 705,330 Z'
		);
		ctx.clip(shell);
		const gradient = ctx.createLinearGradient(0, 70, 0, 330);
		gradient.addColorStop(0, 'rgba(255,255,255,0.25)');
		gradient.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		gradient.addColorStop(1, 'rgba(58,39,27,0.18)');
		ctx.fillStyle = gradient;
		ctx.fillRect(40, 70, 680, 260);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(100, 95, 540, 55);
		ctx.clip();
		const glass = ctx.createLinearGradient(100, 95, 640, 150);
		glass.addColorStop(0, 'rgba(255,255,255,0.55)');
		glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		glass.addColorStop(1, 'rgba(105,190,240,0.22)');
		ctx.fillStyle = glass;
		ctx.fillRect(100, 95, 540, 55);
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.45)';
		ctx.lineWidth = 2.5;
		ctx.beginPath();
		ctx.moveTo(70, 78);
		ctx.lineTo(690, 78);
		ctx.stroke();
	}

	if (lit) {
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.moveTo(70, 74);
		ctx.lineTo(690, 74);
		ctx.stroke();

		const glow = ctx.createRadialGradient(712, 292, 1, 712, 292, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.75)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(712, 292, 28, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = O;
		for (const wheelX of [160, 600]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 362, 42, 7, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		ctx.save();
		const shell = new Path2D(
			'M55,330 Q40,330 40,312 L40,100 Q40,70 70,70 L690,70 Q720,70 720,100 L720,312 Q720,330 705,330 Z'
		);
		ctx.clip(shell);
		ctx.globalAlpha = 0.07;
		ctx.fillStyle = O;
		let seed = 13;
		for (let i = 0; i < 44; i++) {
			seed = (seed * 9301 + 49297) % 233280;
			const px = 50 + (seed / 233280) * 660;
			seed = (seed * 9301 + 49297) % 233280;
			const py = 78 + (seed / 233280) * 240;
			ctx.fillRect(px, py, 1.3, 1.3);
		}
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.9)';
		ctx.lineWidth = 3;
		for (const [gx, gy] of [
			[700, 270],
			[708, 236]
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
		ctx.arc(46, 328, 6, 0, Math.PI * 2);
		ctx.arc(54, 322, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}
