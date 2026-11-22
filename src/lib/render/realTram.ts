/**
 * City tram art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 5: shaded, fully fitted, lit and finished like a picture book.
 */

import { CHROME, GLASS, INK, STEEL, circle, line, rect, shape, wheel } from './realKit';

const PINK = '#EF476F';
const PINK_DARK = '#C93A5C';
const PINK_SHADE = '#A82D49';
const GOLD = '#FFD166';
const CREAM = '#FFF8E7';

/** Rounded body: taller roof corners, tighter bottom corners, front facing right. */
const SHELL =
	'M98,94 L722,94 Q760,94 760,132 L760,230 Q760,252 738,252 L82,252 Q60,252 60,230 L60,132 Q60,94 98,94 Z';

/** Silhouette of the roof pantograph, used by the body mask. */
const PANTOGRAPH = 'M362,94 L362,56 L368,18 L438,18 L452,56 L452,94 Z';

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const REAR_GLASS = pane(76, 116, 36, 58, 6);
const SIDE_GLASS = pane(124, 114, 464, 60, 8);
const FRONT_GLASS = pane(704, 112, 44, 64, 10);
const DOOR_GLASS_L = pane(602, 122, 30, 46, 4);
const DOOR_GLASS_R = pane(640, 122, 30, 46, 4);

/** The two wheels are the same piece; the body punches both circles out. */
const WHEEL_L = { x: 160, y: 236, r: 36 };
const WHEEL_R = { x: 640, y: 236, r: 36 };

function pantograph(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	// Insulated base on the roof.
	rect(ctx, 368, 84, 84, 10, STEEL, 2, 2);
	rect(ctx, 370, 70, 14, 14, CHROME, 2, 2);
	rect(ctx, 436, 70, 14, 14, CHROME, 2, 2);

	// Lower and upper arms of the single-arm pantograph.
	line(ctx, 394, 80, 424, 46, INK, 9);
	line(ctx, 394, 80, 424, 46, STEEL, 6);
	line(ctx, 393, 78, 423, 45, 'rgba(255,255,255,0.35)', 1.6);
	line(ctx, 424, 46, 402, 30, INK, 8);
	line(ctx, 424, 46, 402, 30, STEEL, 5);
	line(ctx, 440, 78, 428, 48, INK, 5);
	line(ctx, 440, 78, 428, 48, STEEL, 3);

	// Collector head, with a bright contact strip once the tram is fitted.
	rect(ctx, 370, 22, 68, 8, STEEL, 2, 2);
	if (fitted) {
		rect(ctx, 376, 19, 56, 5, GOLD, 2, 1.5);
		line(ctx, 386, 30, 398, 44, INK, 2);
	}
}

function shadeGlass(
	ctx: CanvasRenderingContext2D,
	path: string,
	x: number,
	y: number,
	w: number,
	h: number
): void {
	ctx.save();
	ctx.clip(new Path2D(path));
	const glass = ctx.createLinearGradient(x, y, x + w, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.55)');
	glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.24)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Glass and tyre keep-out boxes, padded so a speck never straddles a cut-out edge. */
const SPECKLE_KEEPOUT: Array<[number, number, number, number]> = [
	[70, 110, 48, 70],
	[118, 108, 476, 72],
	[698, 106, 56, 76],
	[596, 116, 84, 58]
];

function speckleAllowed(px: number, py: number): boolean {
	for (const [gx, gy, gw, gh] of SPECKLE_KEEPOUT) {
		if (px >= gx && px <= gx + gw && py >= gy && py <= gy + gh) return false;
	}
	for (const wheelAt of [WHEEL_L, WHEEL_R]) {
		const dx = px - wheelAt.x;
		const dy = py - wheelAt.y;
		if (dx * dx + dy * dy < 42 * 42) return false;
	}
	return true;
}

/** Deterministic picture-book paint grain: dark tooth plus a few light flecks. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	let seed = 71;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 240; i++) {
		const px = 66 + rnd() * 688;
		const py = 100 + rnd() * 146;
		const size = 1.5 + rnd() * 1.4;
		if (!speckleAllowed(px, py)) continue;
		ctx.globalAlpha = 0.09 + rnd() * 0.045;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 70; i++) {
		const px = 66 + rnd() * 688;
		const py = 100 + rnd() * 146;
		const size = 1.3 + rnd() * 0.9;
		if (!speckleAllowed(px, py)) continue;
		ctx.globalAlpha = 0.16 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();
}

/** A four-point sparkle with a warm core, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
	ctx.lineWidth = 3.2;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: bright rim ring and six bolts. Everything here is mirror-symmetric,
 * so the right wheel, which is the flipped left piece, assembles identically.
 */
function wheelFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.28, y + Math.sin(a) * r * 0.28, 3.1, CHROME, 1.2);
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.65)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.11, 0, Math.PI * 2);
	ctx.stroke();
}

export function drawRealTramLevel(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number,
	level: number
): void {
	const shaded = level >= 2;
	const fitted = level >= 3;
	const lit = level >= 4;
	const finish = level >= 5;

	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	if (lit) {
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(410, 278, 348, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// The pantograph is the cue that names the vehicle, so it reads at level 1.
	pantograph(ctx, fitted);

	// Rounded shell.
	shape(ctx, SHELL, PINK);

	// Livery: gold roof cap, gold waist band and a darker low rail panel.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.fillStyle = GOLD;
	ctx.fillRect(56, 94, 708, 12);
	ctx.fillStyle = GOLD;
	ctx.fillRect(56, 182, 708, 13);
	ctx.fillStyle = CREAM;
	ctx.fillRect(56, 198, 708, 3);
	ctx.fillStyle = PINK_DARK;
	ctx.fillRect(56, 236, 708, 18);
	ctx.restore();

	// Glass: tail pane, long side band, windscreen.
	shape(ctx, REAR_GLASS, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 3);
	for (let paneIndex = 1; paneIndex < 5; paneIndex++) {
		const mullion = 124 + paneIndex * 92.8;
		line(ctx, mullion, 114, mullion, 174, INK, 3);
	}
	shape(ctx, FRONT_GLASS, GLASS, 2.5);

	// Double sliding door with two glazed leaves.
	rect(ctx, 598, 116, 76, 118, PINK_DARK, 5);
	shape(ctx, DOOR_GLASS_L, GLASS, 2.5);
	shape(ctx, DOOR_GLASS_R, GLASS, 2.5);
	line(ctx, 636, 116, 636, 234, INK, 2.5);
	line(ctx, 634, 120, 634, 230, 'rgba(255,255,255,0.28)', 1.5);
	rect(ctx, 601, 182, 70, 13, GOLD, 1, 0);
	rect(ctx, 602, 224, 68, 6, STEEL, 1.5);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const paint = ctx.createLinearGradient(0, 94, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.32)');
		paint.addColorStop(0.45, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(120,25,50,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(56, 90, 708, 166);
		ctx.restore();

		shadeGlass(ctx, REAR_GLASS, 76, 116, 36, 58);
		shadeGlass(ctx, SIDE_GLASS, 124, 114, 464, 60);
		shadeGlass(ctx, FRONT_GLASS, 704, 112, 44, 64);
		shadeGlass(ctx, DOOR_GLASS_L, 602, 122, 30, 46);
		shadeGlass(ctx, DOOR_GLASS_R, 640, 122, 30, 46);
	}

	if (fitted) {
		// Destination board on the roof, just behind the nose.
		rect(ctx, 656, 78, 66, 16, INK, 3);
		rect(ctx, 661, 81, 56, 10, GOLD, 2);
		ctx.fillStyle = INK;
		for (let glyph = 0; glyph < 5; glyph++) {
			ctx.fillRect(668 + glyph * 9, 84, 5, 5);
		}

		// Roof vents.
		rect(ctx, 180, 86, 58, 8, PINK_DARK, 2, 1.5);
		rect(ctx, 280, 86, 58, 8, PINK_DARK, 2, 1.5);

		// Mirror on the front pillar.
		line(ctx, 760, 132, 776, 123, INK, 2.5);
		circle(ctx, 780, 120, 5, CHROME, 2);

		// Headlight, marker lamp and rear light.
		circle(ctx, 744, 214, 9, STEEL, 2.4);
		circle(ctx, 744, 214, 6, '#FFF3BF', 1.8);
		circle(ctx, 742, 212, 2.4, CREAM, 1);
		circle(ctx, 72, 214, 6, '#FF4D6D', 2);
		circle(ctx, 72, 230, 4, GOLD, 1.8);

		// Couplers, rear bumper and plate.
		rect(ctx, 760, 238, 18, 10, STEEL, 3, 2);
		line(ctx, 764, 243, 772, 243, CHROME, 2);
		rect(ctx, 70, 238, 18, 11, STEEL, 3, 2);
		rect(ctx, 690, 232, 26, 8, CREAM, 2);

		// Door handles.
		rect(ctx, 627, 166, 4, 16, CHROME, 1.5);
		rect(ctx, 641, 166, 4, 16, CHROME, 1.5);

		// Wipers on the windscreen.
		line(ctx, 712, 168, 726, 151, INK, 2.2);
		line(ctx, 728, 168, 740, 154, INK, 2.2);

		// Livery roundel between the wheels.
		circle(ctx, 330, 214, 9, GOLD, 2);
		circle(ctx, 330, 214, 4, PINK_DARK, 1.5);

		// Wheel arches.
		ctx.strokeStyle = PINK_SHADE;
		ctx.lineWidth = 5;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wheelX, 236, 44, Math.PI * 1.08, Math.PI * 1.92);
			ctx.stroke();
		}
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wheelX, 236, 44, Math.PI * 1.08, Math.PI * 1.92);
			ctx.stroke();
		}
	}

	// Both wheels share the one wheel part.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	if (finish) {
		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	if (lit) {
		// Roof and nose rim light.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(116, 97);
		ctx.lineTo(704, 97);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(726, 99);
		ctx.quadraticCurveTo(757, 104, 758, 138);
		ctx.stroke();

		// Headlight glow.
		const glow = ctx.createRadialGradient(744, 214, 1, 744, 214, 32);
		glow.addColorStop(0, 'rgba(255,240,150,0.7)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(744, 214, 32, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 272, 34, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Paint glints on the nose and panels, clear of the wheel circles.
		glint(ctx, 752, 196, 6);
		glint(ctx, 500, 222, 5.5);
		glint(ctx, 330, 188, 5.5);
		glint(ctx, 110, 200, 5);

		// Glass glints: one sparkle on the windscreen, streaks on the rear panes.
		glint(ctx, 718, 156, 5);
		line(ctx, 140, 120, 162, 168, 'rgba(255,255,255,0.5)', 3.2);
		line(ctx, 84, 122, 100, 168, 'rgba(255,255,255,0.5)', 3);

		// Live-wire contact: a warm glow and spark points on the collector strip.
		ctx.save();
		ctx.beginPath();
		ctx.rect(374, 18, 60, 14);
		ctx.clip();
		const contact = ctx.createRadialGradient(402, 21, 0.5, 402, 21, 18);
		contact.addColorStop(0, 'rgba(255,253,224,0.95)');
		contact.addColorStop(0.45, 'rgba(255,226,128,0.5)');
		contact.addColorStop(1, 'rgba(255,226,128,0)');
		ctx.fillStyle = contact;
		ctx.fillRect(374, 18, 60, 14);
		ctx.restore();

		ctx.fillStyle = CREAM;
		for (const [sx, sy, sr] of [
			[392, 21.5, 1.7],
			[404, 20.5, 2.1],
			[418, 21.5, 1.5]
		]) {
			ctx.beginPath();
			ctx.arc(sx, sy, sr, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	ctx.restore();
}

export function drawRealTram(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealTramLevel(ctx, x, y, scale, 5);
}
