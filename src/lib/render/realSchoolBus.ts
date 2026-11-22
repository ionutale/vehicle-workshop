/**
 * School bus art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 4: shaded, fully fitted and lit.
 */

const O = '#3A271B';
const YELLOW = '#FFC94D';
const DARK_YELLOW = '#D9A441';
const GLASS = '#CFEFFF';
const TIRE = '#2B2D42';
const CHROME = '#C9D2DE';
const RED = '#E63946';

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

function stopSign(ctx: CanvasRenderingContext2D, x: number, y: number): void {
	ctx.save();
	ctx.translate(x, y);
	ctx.beginPath();
	for (let i = 0; i < 8; i++) {
		const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
		const px = Math.cos(a) * 15;
		const py = Math.sin(a) * 15;
		if (i === 0) ctx.moveTo(px, py);
		else ctx.lineTo(px, py);
	}
	ctx.closePath();
	ctx.fillStyle = RED;
	ctx.fill();
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.fillStyle = '#FFF9EC';
	ctx.fillRect(-8, -2, 16, 4);
	ctx.restore();
}

export function drawRealSchoolBus(
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
		ctx.ellipse(385, 292, 340, 14, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell.
	shape(
		ctx,
		'M60,250 Q45,250 45,232 L45,130 Q45,105 70,105 L700,105 Q725,105 725,130 L725,232 Q725,250 710,250 Z',
		YELLOW
	);

	// Black rub rails are what make it read as a school bus.
	rect(ctx, 55, 196, 660, 9, O, 0, 0);
	rect(ctx, 55, 216, 660, 9, O, 0, 0);

	// Window strip.
	rect(ctx, 120, 124, 490, 58, GLASS, 8);
	for (let pane = 1; pane < 5; pane++) {
		line(ctx, 120 + pane * 98, 124, 120 + pane * 98, 182, O, 3);
	}
	rect(ctx, 654, 122, 54, 70, GLASS, 8);
	line(ctx, 681, 122, 681, 192, O, 2.5);
	rect(ctx, 70, 124, 38, 58, GLASS, 7);

	// Door.
	rect(ctx, 610, 124, 38, 120, YELLOW, 4);
	rect(ctx, 614, 130, 30, 42, GLASS, 3);
	rect(ctx, 614, 178, 30, 44, GLASS, 3);
	line(ctx, 629, 130, 629, 222, O, 2);

	if (fitted) {
		// Stop sign, mirror, destination board, vents, lights.
		line(ctx, 165, 196, 165, 176, O, 3);
		stopSign(ctx, 165, 164);
		line(ctx, 720, 130, 738, 122, O, 2.5);
		circle(ctx, 741, 120, 4, CHROME, 2);
		rect(ctx, 650, 100, 68, 18, O, 3);
		rect(ctx, 656, 104, 56, 10, '#FFD166', 2);
		for (let vent = 0; vent < 3; vent++) {
			rect(ctx, 230 + vent * 70, 96, 38, 7, DARK_YELLOW, 2, 1.5);
		}
		rect(ctx, 716, 212, 10, 16, '#FFE066', 3);
		rect(ctx, 38, 214, 8, 18, '#FF4D6D', 2);
		rect(ctx, 34, 238, 26, 12, CHROME, 3);
		rect(ctx, 710, 238, 30, 12, CHROME, 3);
		rect(ctx, 650, 238, 20, 9, '#FFF9EC', 2);
	}

	// Wheels and arches.
	wheel(ctx, 165, 246, 36, finish);
	wheel(ctx, 590, 246, 36, finish);
	ctx.strokeStyle = YELLOW;
	ctx.lineWidth = 5;
	for (const wheelX of [165, 590]) {
		ctx.beginPath();
		ctx.arc(wheelX, 246, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [165, 590]) {
		ctx.beginPath();
		ctx.arc(wheelX, 246, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		ctx.save();
		const shell = new Path2D(
			'M60,250 Q45,250 45,232 L45,130 Q45,105 70,105 L700,105 Q725,105 725,130 L725,232 Q725,250 710,250 Z'
		);
		ctx.clip(shell);
		const gradient = ctx.createLinearGradient(0, 105, 0, 250);
		gradient.addColorStop(0, 'rgba(255,255,255,0.28)');
		gradient.addColorStop(0.35, 'rgba(255,255,255,0.02)');
		gradient.addColorStop(1, 'rgba(58,39,27,0.18)');
		ctx.fillStyle = gradient;
		ctx.fillRect(45, 105, 680, 145);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(120, 124, 490, 58);
		ctx.clip();
		const glass = ctx.createLinearGradient(120, 124, 610, 182);
		glass.addColorStop(0, 'rgba(255,255,255,0.55)');
		glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		glass.addColorStop(1, 'rgba(105,190,240,0.22)');
		ctx.fillStyle = glass;
		ctx.fillRect(120, 124, 490, 58);
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.45)';
		ctx.lineWidth = 2.5;
		ctx.beginPath();
		ctx.moveTo(70, 112);
		ctx.lineTo(700, 112);
		ctx.stroke();
	}

	if (lit) {
		// Rim light on the roof, glow at the headlight, contact under the wheels.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.moveTo(70, 110);
		ctx.lineTo(700, 110);
		ctx.stroke();

		const glow = ctx.createRadialGradient(716, 214, 1, 716, 214, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.75)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(716, 214, 28, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = O;
		for (const wheelX of [165, 590]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 286, 42, 7, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain, glints, exhaust puff.
		ctx.save();
		const shell = new Path2D(
			'M60,250 Q45,250 45,232 L45,130 Q45,105 70,105 L700,105 Q725,105 725,130 L725,232 Q725,250 710,250 Z'
		);
		ctx.clip(shell);
		ctx.globalAlpha = 0.07;
		ctx.fillStyle = O;
		let seed = 11;
		for (let i = 0; i < 40; i++) {
			seed = (seed * 9301 + 49297) % 233280;
			const px = 55 + (seed / 233280) * 650;
			seed = (seed * 9301 + 49297) % 233280;
			const py = 112 + (seed / 233280) * 130;
			ctx.fillRect(px, py, 1.3, 1.3);
		}
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.9)';
		ctx.lineWidth = 3;
		for (const [gx, gy] of [
			[704, 190],
			[712, 158]
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
		ctx.arc(46, 250, 6, 0, Math.PI * 2);
		ctx.arc(54, 244, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}
