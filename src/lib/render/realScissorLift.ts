/**
 * Scissor lift art, cut into the same five-piece kit as the rest of the realistic fleet.
 * Front faces left: a compact slab chassis on four small wheels, a two-bay scissor stack
 * whose crossing X arms name the machine, and a railed platform on top with a mesh gate at
 * the front and a beacon on the rear handrail. Yellow and grey works livery, hazard stripes
 * on the chassis front and the platform toe boards, a slide-out battery tray and a ground
 * control box. Level 5 is the production target: shaded, fitted, lit and picture-book
 * finished with paint grain, scissor-arm steel sheen, platform sheen, glints and hub hardware.
 */

import { CHROME, INK, STEEL, circle, line, rect, roundedPath, shape, wheel } from './realKit';

const YELLOW = '#F9C74F';
const YELLOW_DEEP = '#DFA92F';
const YELLOW_PALE = '#FFDE8A';
const GREY = '#6B6B6B';
const GREY_DARK = '#47484D';
const GREY_LIGHT = '#8E9099';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';
const GREEN = '#7BC96F';

/** Art box 540 x 360, road at 316. Front (gate end) faces left. */
const WHEEL_L = { x: 150, y: 294, r: 22 };
const WHEEL_R = { x: 380, y: 294, r: 22 };

/** Chassis and base frame: one cut-out, with a wheel arch over each tyre. */
const CHASSIS =
	'M104,236 L426,236 Q434,236 434,244 L434,286 Q434,294 426,294 L407,294 A27,27 0 0 0 353,294 L177,294 A27,27 0 0 0 123,294 L104,294 Q96,294 96,286 L96,244 Q96,236 104,236 Z';

/** Platform deck slab. */
const DECK =
	'M123,110 L407,110 Q412,110 412,115 L412,131 Q412,136 407,136 L123,136 Q118,136 118,131 L118,115 Q118,110 123,110 Z';

/** Rail posts: nose, gate stile, mid stile and tail. */
const POSTS = [
	'M121,51 L132,51 L132,110 L121,110 Z',
	'M186,51 L197,51 L197,110 L186,110 Z',
	'M300,51 L311,51 L311,110 L300,110 Z',
	'M398,51 L409,51 L409,110 L398,110 Z'
];

/** Top and mid handrails, kept clear of the posts so the cut-out stays one flat piece. */
const RAILS = [
	'M197,51 L300,51 L300,58 L197,58 Z',
	'M311,51 L398,51 L398,58 L311,58 Z',
	'M197,82 L300,82 L300,88 L197,88 Z',
	'M311,82 L398,82 L398,88 L311,88 Z'
];

/** Mesh gate filling the front bay between the nose post and the gate stile. */
const GATE = 'M132,52 L186,52 L186,110 L132,110 Z';

const BEACON_BASE = 'M348,43 L378,43 L378,51 L348,51 Z';
const BEACON_DOME = 'M352,43 L352,38 Q352,32 359,32 L367,32 Q374,32 374,38 L374,43 Z';

const PLATFORM_MASK = [DECK, ...POSTS, ...RAILS, GATE, BEACON_BASE, BEACON_DOME].join(' ');
const BODY_MASK = CHASSIS;

/**
 * The scissor stack's own mask is the envelope of its arms: they cross at the pivots, and
 * crossing subpaths would be punched out by the even-odd clip.
 */
const SCISSOR =
	'M133.88,152.62 L136.25,137.8 L393.75,137.8 L396.12,152.62 L396.12,219.38 L393.75,234.2 L136.25,234.2 L133.88,219.38 Z';

/** Arm pivots: two bays, 250 px wide by 40 px tall each. */
interface Pin {
	x: number;
	y: number;
}

const PINS = {
	bl: { x: 140, y: 226 },
	br: { x: 390, y: 226 },
	ml: { x: 140, y: 186 },
	mr: { x: 390, y: 186 },
	tl: { x: 140, y: 146 },
	tr: { x: 390, y: 146 }
} as const;

/** Arms overshoot the pivots a little, as the real end plates do. */
const ARM_EXT = 5;
const ARM_T = 15;

const ARM_PAIRS: { a: Pin; b: Pin; plane: 'near' | 'far' }[] = [
	{ a: PINS.br, b: PINS.ml, plane: 'far' },
	{ a: PINS.mr, b: PINS.tl, plane: 'far' },
	{ a: PINS.bl, b: PINS.mr, plane: 'near' },
	{ a: PINS.ml, b: PINS.tr, plane: 'near' }
];

function extended(a: Pin, b: Pin): [Pin, Pin] {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const len = Math.hypot(dx, dy);
	const ux = (dx / len) * ARM_EXT;
	const uy = (dy / len) * ARM_EXT;
	return [
		{ x: a.x - ux, y: a.y - uy },
		{ x: b.x + ux, y: b.y + uy }
	];
}

/** One scissor arm: a rounded beam between its end plates. */
function arm(ctx: CanvasRenderingContext2D, a: Pin, b: Pin, fill: string, shaded: boolean): void {
	const [p, q] = extended(a, b);
	const dx = q.x - p.x;
	const dy = q.y - p.y;
	const len = Math.hypot(dx, dy);

	ctx.save();
	ctx.translate((p.x + q.x) / 2, (p.y + q.y) / 2);
	ctx.rotate(Math.atan2(dy, dx));
	const path = new Path2D(roundedPath(len, ARM_T, 4));
	ctx.fillStyle = fill;
	ctx.fill(path);
	if (shaded) {
		const paint = ctx.createLinearGradient(0, -ARM_T / 2, 0, ARM_T / 2);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.46, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(58,39,27,0.26)');
		ctx.fillStyle = paint;
		ctx.fill(path);
	}
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(path);
	ctx.restore();
}

/**
 * Flat world-space polygon of an arm beam, inset a little from the painted edge. The stack's
 * spec mask is the whole envelope; grain clipped to these polygons stays on the steel and
 * never dusts the empty triangles between the crossing arms.
 */
function armSurface(a: Pin, b: Pin): Path2D {
	const [p, q] = extended(a, b);
	const dx = q.x - p.x;
	const dy = q.y - p.y;
	const len = Math.hypot(dx, dy);
	const nx = (-dy / len) * (ARM_T / 2 - 0.6);
	const ny = (dx / len) * (ARM_T / 2 - 0.6);
	return new Path2D(
		`M${p.x + nx},${p.y + ny} L${q.x + nx},${q.y + ny} L${q.x - nx},${q.y - ny} L${p.x - nx},${p.y - ny} Z`
	);
}

/** Hazard chevrons inside a plate: dark board, amber diagonals. */
function hazard(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	step = 9
): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();
	ctx.fillStyle = '#2E3038';
	ctx.fillRect(x, y, w, h);
	for (let i = -h; i < w + h; i += step) {
		line(ctx, x + i, y + h, x + i + h, y, AMBER, step * 0.52);
	}
	ctx.restore();
}

/** A four-point sparkle with a warm core. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.save();
	const halo = ctx.createRadialGradient(x, y, 0.4, x, y, size * 2.4);
	halo.addColorStop(0, 'rgba(255,255,255,0.3)');
	halo.addColorStop(0.5, 'rgba(255,255,255,0.08)');
	halo.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = halo;
	ctx.beginPath();
	ctx.arc(x, y, size * 2.4, 0, Math.PI * 2);
	ctx.fill();

	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 1.7, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/** Picture-book hub: bright machined ring, five bolts, polished cap and valve stem. */
function wheelFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
		const bx = x + Math.cos(a) * r * 0.27;
		const by = y + Math.sin(a) * r * 0.27;
		circle(ctx, bx, by, 1.7, CHROME, 1);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx - 0.4, by - 0.5, 0.7, 0, Math.PI * 2);
		ctx.fill();
	}

	circle(ctx, x, y, r * 0.15, '#E8EDF4', 1.1);
	line(ctx, x, y - r * 0.5, x, y - r * 0.62, CHROME, 1.8);
	ctx.fillStyle = 'rgba(255,255,255,0.8)';
	ctx.beginPath();
	ctx.arc(x - 0.6, y - r * 0.1, 0.8, 0, Math.PI * 2);
	ctx.fill();
}

/** Rubber contact patch, tyre squashed a little onto the road. */
function contactPatch(ctx: CanvasRenderingContext2D, x: number): void {
	ctx.save();
	ctx.globalAlpha = 0.22;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(x, 316, 19, 4, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/** Picture-book steel sheen: a cool machined gloss over each arm, brightest on the near pair. */
function armSheen(ctx: CanvasRenderingContext2D): void {
	for (const pair of ARM_PAIRS) {
		const near = pair.plane === 'near';
		const [p, q] = extended(pair.a, pair.b);
		const dx = q.x - p.x;
		const dy = q.y - p.y;
		const len = Math.hypot(dx, dy);

		ctx.save();
		ctx.translate((p.x + q.x) / 2, (p.y + q.y) / 2);
		ctx.rotate(Math.atan2(dy, dx));
		const beam = new Path2D(roundedPath(len, ARM_T, 4));

		const gloss = ctx.createLinearGradient(0, -ARM_T / 2, 0, ARM_T / 2);
		gloss.addColorStop(0, near ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.12)');
		gloss.addColorStop(0.24, near ? 'rgba(201,210,222,0.16)' : 'rgba(201,210,222,0.07)');
		gloss.addColorStop(0.52, 'rgba(255,255,255,0.015)');
		gloss.addColorStop(1, 'rgba(58,39,27,0.13)');
		ctx.fillStyle = gloss;
		ctx.fill(beam);

		// Machined top edge, plus a short secondary gleam along the weld line.
		line(
			ctx,
			-len / 2 + 3,
			-ARM_T / 2 + 1.7,
			len / 2 - 3,
			-ARM_T / 2 + 1.7,
			near ? 'rgba(244,250,255,0.6)' : 'rgba(244,250,255,0.26)',
			1.3
		);
		if (near) {
			line(
				ctx,
				-len * 0.26,
				-ARM_T / 2 + 3.2,
				len * 0.08,
				-ARM_T / 2 + 3.2,
				'rgba(255,255,255,0.24)',
				1
			);
		}
		ctx.restore();
	}
}

/** The two-bay scissor stack: four crossing arms, pinned through plated pivots. */
function drawStack(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	for (const pair of ARM_PAIRS) {
		arm(ctx, pair.a, pair.b, pair.plane === 'near' ? YELLOW : YELLOW_DEEP, shaded);
	}

	// End pins and the two crossing pivots, each with a steel shoe and a chrome pin.
	for (const pin of [PINS.bl, PINS.br, PINS.ml, PINS.mr, PINS.tl, PINS.tr]) {
		circle(ctx, pin.x, pin.y, 6, STEEL, 2.2);
		circle(ctx, pin.x, pin.y, 2.4, CHROME, 1.2);
	}
	for (const pivotY of [208, 166]) {
		circle(ctx, 265, pivotY, 5.4, STEEL, 2.2);
		circle(ctx, 265, pivotY, 2.2, CHROME, 1.2);
	}

	if (fitted) {
		// Wear strip along the lower edge of each arm, and the hose clipped to the near pair.
		ctx.save();
		ctx.clip(new Path2D(SCISSOR));
		for (const pair of ARM_PAIRS) {
			const [p, q] = extended(pair.a, pair.b);
			const dx = q.x - p.x;
			const dy = q.y - p.y;
			const len = Math.hypot(dx, dy);
			const nx = (-dy / len) * (ARM_T / 2 - 2.4);
			const ny = (dx / len) * (ARM_T / 2 - 2.4);
			line(ctx, p.x + nx, p.y + ny, q.x + nx, q.y + ny, 'rgba(58,39,27,0.22)', 2.4);
		}
		line(ctx, 192, 220.4, 338, 196.4, 'rgba(58,39,27,0.45)', 2.2);
		line(ctx, 192, 219.5, 338, 195.5, 'rgba(255,255,255,0.16)', 1);
		circle(ctx, 215, 216.6, 2, GREY_DARK, 1);
		circle(ctx, 300, 202.8, 2, GREY_DARK, 1);
		ctx.restore();

		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		for (const pin of [PINS.bl, PINS.br, PINS.tl, PINS.tr]) {
			ctx.beginPath();
			ctx.arc(pin.x - 0.6, pin.y - 0.8, 0.8, 0, Math.PI * 2);
			ctx.fill();
		}
		for (const pivotY of [208, 166]) {
			for (let i = 0; i < 3; i++) {
				const a = Math.PI / 6 + (i / 3) * Math.PI * 2;
				circle(ctx, 265 + Math.cos(a) * 3.8, pivotY + Math.sin(a) * 3.8, 0.95, CHROME, 0.7);
			}
		}
	}

	if (finish) {
		// Steel sheen on every arm, then a specular on the pivot bosses.
		armSheen(ctx);
		ctx.strokeStyle = 'rgba(255,255,255,0.75)';
		ctx.lineWidth = 1.2;
		for (const pivotY of [208, 166]) {
			ctx.beginPath();
			ctx.arc(265, pivotY, 3.4, Math.PI * 1.1, Math.PI * 1.6);
			ctx.stroke();
		}
		glint(ctx, 316, 198, 3);
		glint(ctx, 208, 176, 2.4);
	}
}

/** Chassis, base frame, hazard plate, slide-out battery tray and the ground control box. */
function drawChassis(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, CHASSIS, YELLOW, 3);

	ctx.save();
	ctx.clip(new Path2D(CHASSIS));

	// Steel base plate on top, dark skirt along the road.
	ctx.fillStyle = GREY;
	ctx.fillRect(96, 236, 338, 14);
	ctx.fillStyle = 'rgba(255,255,255,0.3)';
	ctx.fillRect(96, 236, 338, 2.6);
	ctx.fillStyle = 'rgba(58,39,27,0.22)';
	ctx.fillRect(96, 248, 338, 2);
	ctx.fillStyle = GREY_DARK;
	ctx.fillRect(96, 284, 338, 10);
	ctx.fillStyle = CREAM;
	ctx.fillRect(96, 283.4, 338, 1.4);

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 250, 0, 294);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		paint.addColorStop(0.88, 'rgba(163,109,20,0.16)');
		paint.addColorStop(1, 'rgba(58,39,27,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(96, 250, 338, 34);

		// Plate lip shadow, so the base frame reads as sitting proud of the chassis.
		const lip = ctx.createLinearGradient(0, 250, 0, 258);
		lip.addColorStop(0, 'rgba(58,39,27,0.24)');
		lip.addColorStop(1, 'rgba(58,39,27,0)');
		ctx.fillStyle = lip;
		ctx.fillRect(96, 250, 338, 8);
	}
	ctx.restore();

	if (shaded) {
		// Wheel arches: a dark lip inside each opening and a lit crown above it.
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.strokeStyle = 'rgba(58,39,27,0.3)';
			ctx.lineWidth = 2.2;
			ctx.beginPath();
			ctx.arc(wheelX, 294, 28.4, Math.PI, Math.PI * 2);
			ctx.stroke();
			ctx.strokeStyle = 'rgba(255,255,255,0.28)';
			ctx.lineWidth = 1.4;
			ctx.beginPath();
			ctx.arc(wheelX, 294, 32.4, Math.PI * 1.12, Math.PI * 1.88);
			ctx.stroke();
		}
	}

	if (fitted) {
		// Base plate fasteners.
		ctx.fillStyle = CHROME;
		for (let boltX = 112; boltX <= 420; boltX += 22) {
			ctx.beginPath();
			ctx.arc(boltX, 243, 1.14, 0, Math.PI * 2);
			ctx.fill();
		}

		// Crush-hazard plate on the front face, clear of the wheel arch.
		hazard(ctx, 100, 252, 68, 14, 6);
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2;
		ctx.strokeRect(100, 252, 68, 14);

		// Battery tray: housing, two cells, strap, terminals and the slide handle.
		rect(ctx, 170, 262, 8, 13, CHROME, 2, 1.6);
		rect(ctx, 178, 254, 82, 28, GREY, 3, 2.4);
		rect(ctx, 182, 258, 74, 20, '#31343C', 2.5, 1.6);
		rect(ctx, 185, 260, 32, 16, '#5B6572', 2, 1.6);
		rect(ctx, 221, 260, 32, 16, '#5B6572', 2, 1.6);
		circle(ctx, 190, 263.4, 1.8, CHROME, 0.9);
		circle(ctx, 252, 263.4, 1.8, RED, 0.9);
		line(ctx, 218, 260, 218, 276, GREY_DARK, 1.4);
		line(ctx, 188, 271, 250, 271, 'rgba(58,39,27,0.4)', 1.8);
		line(ctx, 171, 265, 177, 265, 'rgba(255,255,255,0.7)', 1.2);

		// Ground control box: key switch, three buttons, screen and legend plate.
		rect(ctx, 288, 250, 62, 34, GREY_DARK, 4, 2.4);
		rect(ctx, 291, 253, 56, 28, GREY, 3, 1.8);
		circle(ctx, 298, 261, 3.2, CHROME, 1.4);
		circle(ctx, 298, 261, 1.2, INK, 0.8);
		for (const [buttonX, tone] of [
			[309, GREEN],
			[318, AMBER],
			[327, RED]
		] as const) {
			circle(ctx, buttonX, 261, 2.9, tone, 1.2);
		}
		rect(ctx, 294, 268, 22, 10, '#243039', 1.5, 1.2);
		line(ctx, 296, 272, 313, 272, 'rgba(140,233,154,0.85)', 1.4);
		line(ctx, 296, 275, 306, 275, 'rgba(140,233,154,0.5)', 1.2);
		rect(ctx, 320, 268, 24, 10, CREAM, 1.5, 1.2);
		line(ctx, 323, 272, 341, 272, 'rgba(58,39,27,0.4)', 1.1);
		line(ctx, 323, 275.4, 336, 275.4, 'rgba(58,39,27,0.28)', 1.1);
		line(ctx, 331, 284, 336, 292, INK, 1.8);

		// Rear louvres, tail lamp and the two tie-down rings.
		for (const [louvreY, louvreW] of [
			[253, 52],
			[259, 46],
			[265, 40]
		] as const) {
			line(ctx, 376, louvreY, 376 + louvreW, louvreY, 'rgba(58,39,27,0.3)', 2.4);
		}
		rect(ctx, 414, 268, 12, 15, RED, 2.5, 1.8);
		circle(ctx, 108, 289, 3.4, CHROME, 1.4);
		circle(ctx, 108, 289, 1.3, GREY_DARK, 0.9);
		circle(ctx, 424, 289, 3.4, CHROME, 1.4);
		circle(ctx, 424, 289, 1.3, GREY_DARK, 0.9);
	}

	if (finish) {
		// Front corner glint and a little paint wear along the working edge.
		glint(ctx, 112, 258, 3);
		ctx.save();
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, chipW, chipH] of [
			[120, 282, 9, 1.6],
			[196, 281, 7, 1.6],
			[300, 282, 8, 1.4],
			[408, 281.4, 5, 1.6]
		] as const) {
			ctx.fillRect(chipX, chipY, chipW, chipH);
		}
		ctx.restore();
	}
}

/** Deck and rail sheen: cool gloss on the steelwork, a warm lift on the painted deck edge. */
function platformSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(DECK));
	const gloss = ctx.createLinearGradient(118, 110, 412, 136);
	gloss.addColorStop(0, 'rgba(255,255,255,0.26)');
	gloss.addColorStop(0.55, 'rgba(255,255,255,0.06)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(118, 110, 294, 26);
	line(ctx, 132, 111.3, 402, 111.3, 'rgba(255,255,255,0.55)', 1.2);
	ctx.restore();

	// Handrail tubes: a machined top line, a soft bounce below and a dark underside.
	for (const [railX, railW, railY, railH] of [
		[197, 103, 51, 7],
		[311, 87, 51, 7],
		[197, 103, 82, 6],
		[311, 87, 82, 6]
	] as const) {
		line(ctx, railX + 5, railY + 2.7, railX + railW - 5, railY + 2.7, 'rgba(244,250,255,0.34)', 1.1);
		line(ctx, railX + 5, railY + railH - 1.4, railX + railW - 5, railY + railH - 1.4, 'rgba(58,39,27,0.2)', 1);
	}
	line(ctx, 126, 128.9, 404, 128.9, 'rgba(255,255,255,0.26)', 1.2);
}

/** Railed platform: deck, toe boards, posts, handrails, mesh gate and the beacon. */
function drawPlatform(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, DECK, YELLOW, 3);
	ctx.save();
	ctx.clip(new Path2D(DECK));

	// Steel deck surface, yellow fascia and the grey toe board along the face.
	ctx.fillStyle = GREY_LIGHT;
	ctx.fillRect(118, 110, 294, 6);
	ctx.fillStyle = 'rgba(255,255,255,0.4)';
	ctx.fillRect(118, 110, 294, 1.8);
	ctx.fillStyle = GREY;
	ctx.fillRect(118, 128, 294, 8);
	ctx.fillStyle = CREAM;
	ctx.fillRect(118, 127.4, 294, 1.2);

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 116, 0, 136);
		paint.addColorStop(0, 'rgba(255,255,255,0.28)');
		paint.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(58,39,27,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(118, 116, 294, 12);
	}
	ctx.restore();

	if (fitted) {
		// Hazard chevrons on the toe boards at both ends of the deck.
		hazard(ctx, 120, 128, 48, 7.6, 6);
		hazard(ctx, 362, 128, 48, 7.6, 6);
		ctx.strokeStyle = 'rgba(58,39,27,0.3)';
		ctx.lineWidth = 1;
		ctx.strokeRect(120, 128, 48, 7.6);
		ctx.strokeRect(362, 128, 48, 7.6);
	}

	// Posts, with a lit leading edge and a shadowed trailing edge.
	for (const postX of [121, 186, 300, 398]) {
		rect(ctx, postX, 51, 11, 59, YELLOW, 2, 2.5);
		if (shaded) {
			line(ctx, postX + 2.4, 54, postX + 2.4, 108, 'rgba(255,255,255,0.42)', 1.6);
			line(ctx, postX + 9, 54, postX + 9, 108, 'rgba(58,39,27,0.24)', 1.4);
		}
	}

	// Handrails: steel tubes, the top pair heavier than the mid pair.
	for (const [railX, railW, railY, railH] of [
		[197, 103, 51, 7],
		[311, 87, 51, 7],
		[197, 103, 82, 6],
		[311, 87, 82, 6]
	] as const) {
		rect(ctx, railX, railY, railW, railH, GREY_LIGHT, railH / 2, 2.4);
		if (shaded) {
			line(
				ctx,
				railX + 4,
				railY + 1.8,
				railX + railW - 4,
				railY + 1.8,
				'rgba(255,255,255,0.6)',
				1.4
			);
			line(ctx, railX + 4, railY + railH - 2, railX + railW - 4, railY + railH - 2, 'rgba(58,39,27,0.22)', 1);
		}
	}

	// Mesh gate: yellow frame, dark mesh infill, diagonal brace, hinges and latch.
	rect(ctx, 132, 52, 54, 58, YELLOW, 2, 3);
	rect(ctx, 138, 58, 42, 44, '#3B4048', 2, 1.6);
	ctx.save();
	ctx.beginPath();
	ctx.rect(138, 58, 42, 44);
	ctx.clip();
	for (let i = -44; i <= 44; i += 7) {
		line(ctx, 138 + i, 102, 138 + i + 44, 58, 'rgba(142,144,153,0.5)', 1.1);
		line(ctx, 138 + i, 58, 138 + i + 44, 102, 'rgba(142,144,153,0.5)', 1.1);
	}
	ctx.restore();
	line(ctx, 141, 100, 177, 60, YELLOW, 4);
	line(ctx, 141, 100, 177, 60, 'rgba(58,39,27,0.25)', 1.2);

	if (fitted) {
		circle(ctx, 135, 62, 3, CHROME, 1.4);
		circle(ctx, 135, 100, 3, CHROME, 1.4);
		rect(ctx, 179, 78, 6, 12, GREY_DARK, 1.5, 1.6);
		line(ctx, 181, 80, 184, 88, CHROME, 1.6);
		// Post feet and rail clamps.
		for (const postX of [121, 186, 300, 398]) {
			circle(ctx, postX + 5.5, 106, 1.6, STEEL, 1);
		}
		for (const clampX of [200, 244, 290, 318, 356, 394]) {
			line(ctx, clampX, 51.8, clampX, 57.2, 'rgba(58,39,27,0.3)', 1.6);
		}
		// Duty plate on the deck fascia.
		rect(ctx, 178, 117, 32, 8, CREAM, 1.5, 1.2);
		line(ctx, 181, 120, 207, 120, 'rgba(58,39,27,0.4)', 1);
		line(ctx, 181, 122.6, 199, 122.6, 'rgba(58,39,27,0.28)', 1);
	}

	// Beacon on the rear handrail.
	shape(ctx, BEACON_BASE, GREY_DARK, 2);
	shape(ctx, BEACON_DOME, AMBER, 2);
	if (shaded) {
		line(ctx, 357, 36, 357, 42, 'rgba(255,255,255,0.7)', 1.8);
		line(ctx, 364, 34, 364, 42, 'rgba(255,255,255,0.4)', 1.2);
	}
	if (fitted) {
		line(ctx, 350, 45.5, 376, 45.5, 'rgba(255,255,255,0.35)', 1.4);
		circle(ctx, 363, 46.5, 1.4, LAMP, 0.9);
	}

	if (finish) {
		// Platform sheen, then picture-book glints on the railwork.
		platformSheen(ctx);
		glint(ctx, 158, 120, 3.4);
		glint(ctx, 352, 54, 2.8);
		glint(ctx, 214, 84, 2.2);
	}
}

/** Seeded paint grain on the painted surfaces only: never the tyres or the arm gaps. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const painted = new Path2D(BODY_MASK);
	painted.addPath(new Path2D(PLATFORM_MASK));
	for (const pair of ARM_PAIRS) painted.addPath(armSurface(pair.a, pair.b));
	ctx.clip(painted);

	const wash = ctx.createLinearGradient(96, 110, 434, 294);
	wash.addColorStop(0, 'rgba(255,255,255,0.05)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.06)');
	ctx.fillStyle = wash;
	ctx.fillRect(96, 110, 338, 184);

	let seed = 71;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 420; i++) {
		const px = 100 + rand() * 330;
		const py = 34 + rand() * 258;
		const size = 1.1 + rand() * 1.1;
		ctx.globalAlpha = 0.07 + rand() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = YELLOW_PALE;
	for (let i = 0; i < 190; i++) {
		const px = 100 + rand() * 330;
		const py = 34 + rand() * 258;
		const size = 0.9 + rand() * 0.8;
		ctx.globalAlpha = 0.14 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 80; i++) {
		const px = 100 + rand() * 330;
		const py = 36 + rand() * 254;
		const size = 0.6 + rand() * 0.4;
		ctx.globalAlpha = 0.07 + rand() * 0.05;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush strokes over the deck, the plate and the lower body.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[126, 122, 250, 121],
		[270, 123, 402, 122],
		[104, 262, 240, 261],
		[272, 263, 410, 262],
		[104, 278, 200, 277]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 1.8, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

export function drawRealScissorLiftLevel(
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
		// Cast shadow on the road, wide because the base is.
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(265, 320, 222, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// The stack sits behind the base frame and the deck it lifts.
	drawStack(ctx, shaded, fitted, finish);
	drawChassis(ctx, shaded, fitted, finish);
	drawPlatform(ctx, shaded, fitted, finish);

	// Both wheels share the one wheel part; the rear tile is its exact mirror.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light along the handrail, the deck and the base plate.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.2;
		for (const [x1, y1, x2, y2] of [
			[199, 52.4, 396, 52.4],
			[121, 112, 409, 112],
			[100, 237.6, 430, 237.6]
		] as const) {
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(123, 109);
		ctx.lineTo(123, 56);
		ctx.stroke();

		// Beacon flash and the lit control screen.
		const beacon = ctx.createRadialGradient(363, 37, 1, 363, 37, 26);
		beacon.addColorStop(0, 'rgba(255,183,3,0.52)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(363, 37, 26, 0, Math.PI * 2);
		ctx.fill();

		const screen = ctx.createRadialGradient(305, 273, 1, 305, 273, 16);
		screen.addColorStop(0, 'rgba(140,233,154,0.32)');
		screen.addColorStop(1, 'rgba(140,233,154,0)');
		ctx.fillStyle = screen;
		ctx.beginPath();
		ctx.arc(305, 273, 16, 0, Math.PI * 2);
		ctx.fill();

		contactPatch(ctx, WHEEL_L.x);
		contactPatch(ctx, WHEEL_R.x);
	}

	if (finish) {
		paintGrain(ctx);
		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
		glint(ctx, 250, 120, 4);
		glint(ctx, 116, 252, 2.6);
		glint(ctx, 400, 250, 2.2);
	}

	ctx.restore();
}

export function drawRealScissorLift(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealScissorLiftLevel(ctx, x, y, scale, 5);
}
