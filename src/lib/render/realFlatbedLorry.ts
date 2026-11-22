/**
 * Flatbed lorry art, cut into the same five-piece kit as the other realistic vehicles.
 * Front faces left, like the box truck: low cab, long flat deck with stake posts and
 * side rails, a small crate load, ramps stowed under the deck and a two-tone livery.
 * Level 5 adds the picture-book finish: paint grain, glints, hub detail and marks.
 */

import {
	CHROME,
	GLASS,
	INK,
	STEEL,
	TIRE,
	circle,
	line,
	rect,
	rectMask,
	shape,
	wheel
} from './realKit';

const PURPLE = '#6D597A';
const PURPLE_DARK = '#54455F';
const PURPLE_DEEP = '#3F3448';
const GOLD = '#E9C46A';
const CREAM = '#FFF6E4';
const AMBER = '#F2A65A';
const RED = '#E0455A';

/** Cab shell: low roof, short raked nose, flat floor over the chassis. */
const CAB =
	'M42,266 L42,194 Q42,180 54,172 L76,144 Q84,132 100,132 L200,132 Q212,132 212,144 L212,266 Z';

/** Big raked windscreen, one of the two glass areas. */
const WINDSCREEN = 'M54,214 L66,154 Q69,148 76,148 L120,148 L120,214 Z';

const FRONT_WHEEL = { x: 150, y: 236, r: 36 };
const REAR_WHEEL = { x: 600, y: 236, r: 36 };

const DECK = { left: 212, right: 752, top: 196, bottom: 210 };
const POSTS = [222, 306, 390, 474, 558, 642, 726];

interface Crate {
	x: number;
	y: number;
	w: number;
	h: number;
	gold: boolean;
}

/** Crates sit on the deck, behind the near-side rail. */
const CRATES: Crate[] = [
	{ x: 316, y: 156, w: 64, h: 40, gold: true },
	{ x: 392, y: 164, w: 72, h: 32, gold: false },
	{ x: 478, y: 154, w: 70, h: 42, gold: true },
	{ x: 562, y: 160, w: 68, h: 36, gold: true }
];

function drawCrate(ctx: CanvasRenderingContext2D, crate: Crate): void {
	const { x, y, w, h } = crate;
	const body = crate.gold ? GOLD : PURPLE;
	const edge = crate.gold ? PURPLE : GOLD;

	rect(ctx, x, y, w, h, body, 2, 2.5);
	line(ctx, x + 4, y + h * 0.38, x + w - 4, y + h * 0.38, 'rgba(58,39,27,0.32)', 1.5);
	line(ctx, x + 4, y + h * 0.72, x + w - 4, y + h * 0.72, 'rgba(58,39,27,0.32)', 1.5);

	// Corner bands and a stencilled badge give the load some colour.
	rect(ctx, x + 3, y + 3, 11, 4, edge, 1, 1.2);
	rect(ctx, x + w - 14, y + 3, 11, 4, edge, 1, 1.2);
	circle(ctx, x + 12, y + 14, 3.4, edge, 1.2);
}

/** A stowed loading ramp: a sloped metal bar with rungs. */
function drawRamp(
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	thickness: number,
	fill: string
): void {
	shape(
		ctx,
		`M${x1},${y1} L${x2},${y2} L${x2},${y2 + thickness} L${x1},${y1 + thickness} Z`,
		fill,
		1.8
	);
	for (let x = x1 + 8; x < x2 - 4; x += 16) {
		const t = (x - x1) / (x2 - x1);
		const y = y1 + (y2 - y1) * t;
		line(ctx, x, y + 1.4, x, y + thickness - 1.4, INK, 1.2);
	}
}

/** A dark wheel well with a livery arch over it. Drawn before the wheel tiles. */
function drawWheelArch(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
	ctx.save();
	ctx.beginPath();
	ctx.arc(cx, cy, 42, Math.PI, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = PURPLE_DEEP;
	ctx.fill();
	ctx.restore();

	ctx.strokeStyle = PURPLE;
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(cx, cy, 42, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(cx, cy, 42, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();
}

/** A ratchet strap over a crate, with a chrome ratchet body. */
function drawStrap(ctx: CanvasRenderingContext2D, x: number, top: number): void {
	shape(
		ctx,
		`M${x},${top} L${x + 6},${top} L${x + 13},${DECK.top} L${x + 7},${DECK.top} Z`,
		PURPLE_DEEP,
		1.5
	);
	rect(ctx, x + 2, top + 18, 12, 11, CHROME, 2, 1.8);
	line(ctx, x + 4, top + 23.5, x + 12, top + 23.5, INK, 1.5);
	line(ctx, x + 12, top + 20, x + 15, top + 17, INK, 1.5);
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

/**
 * Deterministic picture-book paint grain over every painted surface: cab, deck fascia
 * and the crate load, but never the glazing or the open load gaps. Speckle sizes are
 * deliberately above a hairline so the tooth still reads once the game scales the art
 * down to roughly half size.
 */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const painted = [
		CAB,
		'M212,196 L752,196 L752,228 L212,228 Z',
		...CRATES.map((crate) => rectMask(crate.x, crate.y, crate.w, crate.h))
	].join(' ');

	ctx.save();
	ctx.clip(new Path2D(painted), 'nonzero');
	let seed = 37;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	const onGlass = (px: number, py: number): boolean =>
		(px >= 50 && px <= 124 && py >= 144 && py <= 224) ||
		(px >= 124 && px <= 204 && py >= 144 && py <= 198);
	const onWheel = (px: number, py: number): boolean =>
		Math.hypot(px - FRONT_WHEEL.x, py - FRONT_WHEEL.y) < FRONT_WHEEL.r + 2 ||
		Math.hypot(px - REAR_WHEEL.x, py - REAR_WHEEL.y) < REAR_WHEEL.r + 2;

	ctx.fillStyle = INK;
	for (let i = 0; i < 300; i++) {
		const px = 38 + rnd() * 714;
		const py = 130 + rnd() * 138;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.06 + rnd() * 0.06;
		const size = 1.5 + rnd() * 1.7;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 120; i++) {
		const px = 38 + rnd() * 714;
		const py = 130 + rnd() * 138;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.1 + rnd() * 0.1;
		const size = 1.3 + rnd() * 1.4;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();

	// Two long brush sweeps give the deck fascia a hand-painted sheen.
	ctx.save();
	ctx.clip(new Path2D('M212,196 L752,196 L752,210 L212,210 Z'));
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.moveTo(222, 200.5);
	ctx.bezierCurveTo(380, 198.5, 560, 202, 742, 199.5);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,12,26,0.13)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(226, 208);
	ctx.bezierCurveTo(400, 206.5, 600, 209.5, 742, 207.5);
	ctx.stroke();
	ctx.restore();
}

/** Run `paint` at the front wheel and again at the rear as its exact mirror. */
function atBothWheels(ctx: CanvasRenderingContext2D, paint: (cx: number) => void): void {
	paint(FRONT_WHEEL.x);
	ctx.save();
	ctx.translate(FRONT_WHEEL.x + REAR_WHEEL.x, 0);
	ctx.scale(-1, 1);
	paint(FRONT_WHEEL.x);
	ctx.restore();
}

/** Hub trim that survives the game scale: a machined ring, a crescent and a valve stem. */
function drawHubDetail(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.strokeStyle = 'rgba(58,39,27,0.34)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.36, Math.PI * 1.06, Math.PI * 1.58);
	ctx.stroke();

	line(ctx, cx - r * 0.25, cy + r * 0.3, cx - r * 0.35, cy + r * 0.17, CHROME, 1.8);
	circle(ctx, cx - r * 0.02, cy - r * 0.02, r * 0.06, CREAM, 0.6);
}

/** Finishing marks: paint chips on the working edges and soot softened onto the roof. */
function drawFinishingMarks(ctx: CanvasRenderingContext2D): void {
	const chips: Array<[number, number, number, number, number]> = [
		[57, 258, 7, 2.2, 0.5],
		[108, 258, 9, 2, 0.45],
		[204, 244, 6, 2, 0.4],
		[298, 202, 5, 1.8, 0.35],
		[468, 224, 11, 2, 0.35],
		[741, 250, 6, 2.4, 0.5]
	];

	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of chips) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	// Dust settled along the lower deck seam, clear of the rear wheel arch.
	ctx.save();
	ctx.globalAlpha = 0.14;
	ctx.fillStyle = INK;
	for (let dust = 0; dust < 9; dust++) {
		const dx = 236 + dust * 57;
		if (dx > 548 && dx < 650) continue;
		ctx.fillRect(dx, 224 + (dust % 3), 14, 2);
	}
	ctx.restore();

	// Soot softened onto the cab roof behind the exhaust stack.
	ctx.save();
	ctx.globalAlpha = 0.12;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(196, 140, 9, 3.6, -0.08, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/** A four-point sparkle with a warm core. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 1.9, 0, Math.PI * 2);
	ctx.fill();
}

export function drawRealFlatbedLorryLevel(
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
		ctx.ellipse(390, 278, 350, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Exhaust stack sits behind the cab and the deck rail.
	rect(ctx, 212, 110, 12, 42, STEEL, 3, 2.5);

	// Chassis rails run from the nose to the tail.
	rect(ctx, 104, 244, 648, 14, STEEL, 3, 2.5);
	line(ctx, 110, 254, 746, 254, 'rgba(58,39,27,0.35)', 1.6);

	// Flat deck: a purple slab over a deep underframe, with a gold edge stripe.
	rect(ctx, DECK.left, DECK.top, DECK.right - DECK.left, DECK.bottom - DECK.top, PURPLE, 0, 3);
	rect(ctx, DECK.left, 210, DECK.right - DECK.left, 18, PURPLE_DARK, 2, 3);
	line(ctx, 218, 226, 748, 226, 'rgba(58,39,27,0.42)', 1.6);
	rect(ctx, DECK.left + 4, DECK.bottom - 8, DECK.right - DECK.left - 8, 4, GOLD, 0, 0);

	// Load, then the near-side stake posts and rails in front of it.
	for (const crate of CRATES) drawCrate(ctx, crate);
	for (const px of POSTS) rect(ctx, px, 160, 9, DECK.top - 160, PURPLE, 1.5, 2.5);
	rect(ctx, 214, 152, 530, 9, PURPLE, 2.5, 2.5);
	rect(ctx, 216, 152, 526, 3, GOLD, 0, 0);
	rect(ctx, 214, 190, 530, 6, PURPLE, 1, 2.5);
	rect(ctx, 216, 190, 526, 2, GOLD, 0, 0);

	// Cab shell and glass.
	shape(ctx, CAB, PURPLE);
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	rect(ctx, 128, 148, 72, 46, GLASS, 5, 2.5);

	// Roof visor, door panel, gold waist stripe, pillar and front bumper.
	rect(ctx, 96, 126, 80, 7, PURPLE_DARK, 3, 2.5);
	rect(ctx, 126, 194, 78, 62, PURPLE, 4, 2.5);
	rect(ctx, 66, 228, 142, 7, GOLD, 0, 0);
	line(ctx, 124, 140, 124, 260, INK, 2.5);
	rect(ctx, 30, 244, 14, 22, CHROME, 4, 2.5);

	if (shaded) {
		// Cab paint: roof light falling into a low-body shade.
		ctx.save();
		ctx.clip(new Path2D(CAB));
		const paint = ctx.createLinearGradient(0, 132, 0, 266);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.45, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(20,12,26,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(36, 128, 182, 142);
		ctx.restore();

		shadeGlass(ctx, WINDSCREEN, 54, 148, 66, 66);
		ctx.save();
		ctx.beginPath();
		ctx.rect(128, 148, 72, 46);
		ctx.clip();
		const sideGlass = ctx.createLinearGradient(128, 148, 200, 194);
		sideGlass.addColorStop(0, 'rgba(255,255,255,0.5)');
		sideGlass.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		sideGlass.addColorStop(1, 'rgba(105,190,240,0.24)');
		ctx.fillStyle = sideGlass;
		ctx.fillRect(128, 148, 72, 46);
		ctx.restore();

		// Deck fascia bevel.
		ctx.save();
		ctx.beginPath();
		ctx.rect(DECK.left, DECK.top, DECK.right - DECK.left, DECK.bottom - DECK.top);
		ctx.clip();
		const deck = ctx.createLinearGradient(0, DECK.top, 0, DECK.bottom);
		deck.addColorStop(0, 'rgba(255,255,255,0.24)');
		deck.addColorStop(1, 'rgba(20,12,26,0.2)');
		ctx.fillStyle = deck;
		ctx.fillRect(DECK.left, DECK.top, DECK.right - DECK.left, DECK.bottom - DECK.top);
		ctx.restore();

		for (const crate of CRATES) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(crate.x, crate.y, crate.w, crate.h);
			ctx.clip();
			const tone = ctx.createLinearGradient(0, crate.y, 0, crate.y + crate.h);
			tone.addColorStop(0, 'rgba(255,255,255,0.26)');
			tone.addColorStop(0.45, 'rgba(255,255,255,0.02)');
			tone.addColorStop(1, 'rgba(58,39,27,0.2)');
			ctx.fillStyle = tone;
			ctx.fillRect(crate.x, crate.y, crate.w, crate.h);
			ctx.restore();
		}
	}

	if (fitted) {
		// Fuel tank, toolbox and the pair of ramps stowed under the deck.
		rect(ctx, 216, 229, 52, 15, CHROME, 7, 2.5);
		line(ctx, 228, 230, 228, 243, 'rgba(58,39,27,0.35)', 1.6);
		line(ctx, 254, 230, 254, 243, 'rgba(58,39,27,0.35)', 1.6);
		rect(ctx, 464, 229, 50, 15, PURPLE_DARK, 3, 2.5);
		rect(ctx, 486, 235, 8, 4, CHROME, 1, 1.5);
		drawRamp(ctx, 282, 236, 446, 241, 6, STEEL);
		drawRamp(ctx, 276, 229, 450, 234, 6, CHROME);

		// Exhaust rain cap and a heat band.
		rect(ctx, 208, 105, 20, 6, STEEL, 3, 2);
		rect(ctx, 212, 134, 12, 3, INK, 1, 1.5);

		// Vent grille under the windscreen, headlight, marker and mirror.
		rect(ctx, 56, 216, 64, 10, PURPLE_DARK, 2, 2);
		for (let vent = 0; vent < 3; vent++) {
			line(ctx, 60, 218 + vent * 3, 116, 218 + vent * 3, 'rgba(201,210,222,0.55)', 1.1);
		}
		circle(ctx, 49, 232, 6.5, GOLD, 2.2);
		circle(ctx, 47, 242, 3, AMBER, 1.6);
		line(ctx, 60, 152, 41, 143, INK, 2.6);
		line(ctx, 60, 158, 41, 151, INK, 1.8);
		rect(ctx, 32, 134, 9, 17, CHROME, 2, 2);
		rect(ctx, 34, 136, 5, 13, GLASS, 1, 1);

		// Cab roof markers and door step.
		rect(ctx, 108, 127, 6, 3, AMBER, 1, 1);
		rect(ctx, 122, 127, 6, 3, AMBER, 1, 1);
		rect(ctx, 186, 252, 20, 7, CHROME, 2, 2);

		// Rear lamp cluster, plate and bumper.
		rect(ctx, 744, 214, 8, 14, RED, 2, 1.8);
		rect(ctx, 744, 230, 8, 10, GOLD, 2, 1.5);
		rect(ctx, 710, 218, 28, 9, CREAM, 1, 1.5);
		rect(ctx, 736, 248, 16, 14, CHROME, 3, 2.5);

		// Door handle and hinge.
		rect(ctx, 188, 206, 5, 16, CHROME, 1.5, 1.5);
		rect(ctx, 127, 196, 4, 8, STEEL, 1, 1.5);

		// Deck seams, bolt rows and stake hardware.
		for (let bx = 236; bx < 744; bx += 52) {
			circle(ctx, bx, 202, 1.4, STEEL, 0.8);
			circle(ctx, bx + 18, 156, 1.4, CHROME, 0.8);
		}
		for (const px of POSTS) circle(ctx, px + 4.5, 165, 1.5, CHROME, 0.9);

		// Wheel arches, then the straps over the load.
		drawWheelArch(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y);
		drawWheelArch(ctx, REAR_WHEEL.x, REAR_WHEEL.y);
		rect(ctx, 640, 250, 8, 22, TIRE, 1, 2);

		drawStrap(ctx, 504, 152);
		drawStrap(ctx, 592, 152);
	}

	// Both wheels share the one wheel part; the rear tile is the front mirrored.
	atBothWheels(ctx, (cx) => wheel(ctx, cx, FRONT_WHEEL.y, FRONT_WHEEL.r, finish));

	if (lit) {
		// Rim light on the cab roof and the deck rail.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(88, 134);
		ctx.lineTo(198, 134);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(220, 154);
		ctx.lineTo(740, 154);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(216, 198);
		ctx.lineTo(748, 198);
		ctx.stroke();

		// Headlight glow on the nose.
		const glow = ctx.createRadialGradient(49, 232, 1, 49, 232, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.75)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(49, 232, 30, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelAt of [FRONT_WHEEL, REAR_WHEEL]) {
			ctx.beginPath();
			ctx.ellipse(wheelAt.x, 272, 30, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Paint, glass, chrome and load glints, all clear of the wheel circles.
		glint(ctx, 96, 178, 5.4);
		glint(ctx, 690, 155, 4.6);
		glint(ctx, 524, 172, 4.4);
		glint(ctx, 196, 238, 4.2);
		glint(ctx, 50, 230, 3.6);
		glint(ctx, 300, 206, 3.4);

		// Hub detail on both wheels; the rear tile mirrors the front one.
		atBothWheels(ctx, (cx) => drawHubDetail(ctx, cx, FRONT_WHEEL.y, FRONT_WHEEL.r));

		drawFinishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealFlatbedLorry(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealFlatbedLorryLevel(ctx, x, y, scale, 5);
}
