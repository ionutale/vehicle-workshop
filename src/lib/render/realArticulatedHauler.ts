/**
 * Articulated hauler art, cut into the five-piece kit: body (tractor and bed shell),
 * glass, the dump body as a cargo piece, and one wheel used twice.
 *
 * A yellow ADT facing left. A square cab rides over the front axle behind a short raked
 * bonnet and grille; a waist-level articulation joint with its pivot drum joins the
 * tractor to the tipper, and the big heaped body sits over the rear axle. Charcoal
 * chassis, beacon, exhaust stack and works lamps name the machine.
 *
 * Level 5 is the production target: shaded, fully fitted, lit and picture-book finished.
 */

import {
	CHROME,
	GLASS,
	INK,
	STEEL,
	circle,
	circleBounds,
	circleMask,
	line,
	rect,
	rectMask,
	shape,
	wheel
} from './realKit';

const YELLOW = '#F9C74F';
const YELLOW_DEEP = '#DCA92F';
const YELLOW_SHADE = '#B9871F';
const CHARCOAL = '#2B2D42';
const CHARCOAL_LIGHT = '#3E4260';
const CHARCOAL_DEEP = '#1B1C2B';
const CREAM = '#FFF9EC';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const TAIL = '#FF4D6D';
const LOAD = '#8C6B4F';
const LOAD_LIGHT = '#B5906A';
const LOAD_DARK = '#66482F';

/** Art box 780 x 380, road at 272. Front (cab) faces left. */
const BODY_SHELL =
	'M22,262 L22,232 L40,230 L47,206 L62,198 L92,104 Q95,90 108,90 L232,90 Q244,90 244,102 L244,212 L282,218 L310,222 L322,224 L352,56 Q354,48 364,48 L740,68 Q752,70 752,82 L752,246 Q752,254 744,254 L332,254 L318,250 L288,244 L62,246 L40,256 Z';

/** Beacon and exhaust stack ride on the cab roof; the mirror head sits clear of the nose. */
const BEACON_MASK = 'M195,74 L215,74 L215,90 L195,90 Z';
const STACK_MASK = 'M218,60 L232,60 L232,90 L218,90 Z';
const MIRROR_MASK = 'M46,106 L68,106 L68,132 L46,132 Z';
const BODY_MASK = `${BODY_SHELL} ${BEACON_MASK} ${STACK_MASK} ${MIRROR_MASK}`;

const WHEEL_L = { x: 160, y: 236, r: 42 };
const WHEEL_R = { x: 620, y: 236, r: 42 };
const WHEEL_BOX = circleBounds(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
const ARCH = 48;

/** Near rail: the steel cap along the top of the bed, in bed coordinates. */
const RAIL_CAP = 'M358,47 L736,67 L736,81 L358,61 Z';
const railY = (x: number): number => 48 + ((x - 364) * 20) / 376;
const railBottom = (x: number): number => railY(x) + 14;

const WINDSCREEN =
	'M78,170 L82,152 L102,112 Q106,104 116,104 L126,104 Q134,104 134,112 L134,162 Q134,170 126,170 Z';
const SIDE_GLASS = pane(146, 104, 92, 58, 7);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Jagged crest of the heaped load, riding the rail line and sloping to the tail. */
const RIDGE =
	'L372,49 L384,40 L398,44 L412,38 L426,46 L440,40 L454,34 L468,40 L482,34 L496,31 L508,40 L524,33 L540,43 L556,36 L572,45 L588,42 L604,49 L620,42 L636,53 L652,47 L668,54 L684,51 L700,56 L716,55 L726,59 L734,68';

/**
 * The dump body: side panel up to the silhouette edge, with a heaped load rising above
 * the near rail. The heap is part of the outline so the cargo piece carries it.
 */
const TIPPER = `M334,226 L360,48 ${RIDGE} L734,226 Z`;
const HEAP = `M372,49 ${RIDGE} L734,104 L372,104 Z`;
const HEAP_EDGE = `M372,49 ${RIDGE}`;

/** Fixed spoil lumps in the load, so the grain reads at every level. */
const LUMPS: Array<[number, number, number]> = [
	[384, 42, 5],
	[398, 44, 5],
	[412, 40, 6],
	[426, 42, 5],
	[440, 40, 6],
	[454, 36, 6],
	[468, 38, 6],
	[482, 36, 6],
	[498, 38, 7],
	[514, 44, 6],
	[530, 38, 7],
	[546, 46, 6],
	[562, 42, 7],
	[578, 48, 6],
	[594, 46, 7],
	[610, 50, 6],
	[626, 46, 7],
	[642, 52, 6],
	[658, 50, 7],
	[674, 54, 6],
	[690, 54, 6],
	[706, 58, 5],
	[722, 60, 5],
	[736, 66, 4]
];

/**
 * Painted panels for grain: the body, less the tyre circles, the glass, and the charcoal
 * chassis band, so the speckle only lands on yellow paint.
 */
const BODY_GRAIN = `${BODY_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r - 3)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r - 3)} ${WINDSCREEN} ${SIDE_GLASS} ${rectMask(38, 238, 716, 26)} ${BEACON_MASK} ${STACK_MASK} ${MIRROR_MASK} ${rectMask(214, 226, 72, 20)} ${rectMask(24, 232, 21, 29)} ${rectMask(122, 92, 92, 6)}`;

/** The tipper panel for grain: the dump body, less the heaped spoil. */
const TIPPER_GRAIN = `${TIPPER} ${HEAP}`;

function pane(x: number, y: number, w: number, h: number, r: number): string {
	return `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;
}

function glassShade(
	ctx: CanvasRenderingContext2D,
	path: string,
	x: number,
	y: number,
	w: number,
	h: number
): void {
	ctx.save();
	ctx.clip(new Path2D(path));
	const glass = ctx.createLinearGradient(x, y, x + w * 0.65, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.62)');
	glass.addColorStop(0.42, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(96,176,226,0.3)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Recessed wheel well: a deep dark arch the tyre sits inside. */
function wheelWell(
	ctx: CanvasRenderingContext2D,
	wx: number,
	radius: number,
	shaded: boolean
): void {
	ctx.beginPath();
	ctx.arc(wx, 236, radius, Math.PI, Math.PI * 2);
	ctx.lineTo(wx + radius, 250);
	ctx.lineTo(wx - radius, 250);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, 236 - radius, 0, 250);
		well.addColorStop(0, '#101120');
		well.addColorStop(1, CHARCOAL_LIGHT);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = CHARCOAL;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.5;
	ctx.stroke();

	if (shaded) {
		ctx.strokeStyle = 'rgba(0,0,0,0.34)';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(wx, 239, radius - 4, Math.PI * 1.04, Math.PI * 1.96);
		ctx.stroke();
	}
}

/** Deterministic picture-book paint grain on the body and the bed panel. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const scatter = (x0: number, y0: number, w: number, h: number, count: number, seed: number) => {
		let state = seed;
		const rnd = (): number => {
			state = (state * 9301 + 49297) % 233280;
			return state / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < count; i++) {
			ctx.globalAlpha = 0.09 + rnd() * 0.06;
			ctx.fillRect(x0 + rnd() * w, y0 + rnd() * h, 1.5 + rnd() * 1.7, 1.5 + rnd() * 1.7);
		}
		ctx.fillStyle = CREAM;
		for (let i = 0; i < count * 0.3; i++) {
			ctx.globalAlpha = 0.16 + rnd() * 0.1;
			ctx.fillRect(x0 + rnd() * w, y0 + rnd() * h, 1.3 + rnd() * 1.2, 1.3 + rnd() * 1.2);
		}
	};

	ctx.save();
	ctx.clip(new Path2D(BODY_GRAIN));
	scatter(26, 46, 726, 212, 300, 59);
	ctx.restore();

	ctx.save();
	ctx.clip(new Path2D(TIPPER_GRAIN), 'evenodd');
	scatter(338, 84, 396, 118, 120, 23);
	ctx.restore();
	ctx.globalAlpha = 1;
}

/** Picture-book spoil: stone speckle on the heap, a seated shadow and a crest catchlight. */
function loadFinish(ctx: CanvasRenderingContext2D): void {
	let state = 91;
	const rnd = (): number => {
		state = (state * 9301 + 49297) % 233280;
		return state / 233280;
	};

	for (let i = 0; i < 64; i++) {
		const x = 372 + rnd() * 362;
		const y = 32 + rnd() * 66;
		const size = 1 + rnd() * 2.2;
		ctx.fillStyle = i % 3 === 0 ? 'rgba(230,204,166,0.5)' : 'rgba(64,42,24,0.5)';
		ctx.fillRect(x, y, size, size);
	}

	// Shadow seating the load onto the near rail.
	ctx.fillStyle = 'rgba(46,28,14,0.24)';
	ctx.beginPath();
	ctx.moveTo(360, railBottom(360) - 5);
	ctx.lineTo(734, railBottom(734) - 5);
	ctx.lineTo(734, railBottom(734) + 1);
	ctx.lineTo(360, railBottom(360) + 1);
	ctx.closePath();
	ctx.fill();

	// A pale catchlight just inside the jagged crest.
	ctx.save();
	ctx.translate(0, 2.2);
	ctx.strokeStyle = 'rgba(255,240,212,0.55)';
	ctx.lineWidth = 1.8;
	ctx.stroke(new Path2D(HEAP_EDGE));
	ctx.restore();
}

/** A four-point paint glint, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
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

/** Picture-book hub: a bright rim ring, six bolts and a pale centre cap. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.47, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.6, CHROME, 1.2);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();
}

/** The dump body piece: panel, ribs, near rail and the heaped spoil. */
function drawBed(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, TIPPER, YELLOW, 2.4);

	ctx.save();
	ctx.clip(new Path2D(TIPPER));

	// Panel light and the deep shade under the rail.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 46, 0, 226);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(120,70,8,0.26)');
		ctx.fillStyle = paint;
		ctx.fillRect(330, 40, 410, 190);
	}

	// Heaped load, clipped so it never shows below the near rail.
	ctx.save();
	ctx.clip(
		new Path2D(
			`M360,0 L780,0 L780,${railBottom(780)} L360,${railBottom(360)} Z`
		)
	);
	ctx.fillStyle = LOAD;
	ctx.fill(new Path2D(HEAP));
	ctx.save();
	ctx.clip(new Path2D(HEAP));
	if (shaded) {
		const spoil = ctx.createLinearGradient(0, 18, 0, 100);
		spoil.addColorStop(0, 'rgba(255,255,255,0.32)');
		spoil.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		spoil.addColorStop(1, 'rgba(46,28,14,0.36)');
		ctx.fillStyle = spoil;
		ctx.fillRect(370, 16, 374, 92);
	}
	for (const [lx, ly, lr] of LUMPS) {
		const tone = ly < 50 ? LOAD_LIGHT : LOAD_DARK;
		if (finish) {
			circle(ctx, lx, ly, lr, tone, 1.4);
		} else {
			ctx.beginPath();
			ctx.arc(lx, ly, lr, 0, Math.PI * 2);
			ctx.fillStyle = tone;
			ctx.fill();
		}
	}
	if (shaded) {
		ctx.fillStyle = 'rgba(255,240,210,0.34)';
		for (const [lx, ly, lr] of LUMPS) {
			if (ly > 52) continue;
			ctx.beginPath();
			ctx.arc(lx - lr * 0.3, ly - lr * 0.35, lr * 0.4, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	if (finish) loadFinish(ctx);
	ctx.restore();
	ctx.restore();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke(new Path2D(HEAP_EDGE));

	// Pressed ribs down the flank, tucked under the rail.
	for (const rx of [382, 448, 514, 580, 646, 704]) {
		const top = railBottom(rx) + 2;
		rect(ctx, rx, top, 15, 220 - top, YELLOW_DEEP, 2, 1.8);
		line(ctx, rx + 3, top + 5, rx + 3, 214, 'rgba(255,255,255,0.24)', 3);
		line(ctx, rx + 12, top + 5, rx + 12, 214, 'rgba(120,70,8,0.3)', 2);
	}

	// Tailgate post and its hinges.
	rect(ctx, 704, railBottom(704) + 4, 30, 210 - railBottom(704), YELLOW_DEEP, 2, 2.2);
	for (const hy of [96, 152, 204]) {
		rect(ctx, 700, hy, 18, 7, fitted ? STEEL : YELLOW_DEEP, 2, 1.5);
	}

	// Picture-book gloss down the flank, clipped clear of the load.
	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(TIPPER_GRAIN), 'evenodd');
		const sheen = ctx.createLinearGradient(410, 88, 540, 206);
		sheen.addColorStop(0, 'rgba(255,255,255,0.02)');
		sheen.addColorStop(0.45, 'rgba(255,255,255,0.2)');
		sheen.addColorStop(0.58, 'rgba(255,255,255,0.05)');
		sheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = sheen;
		ctx.beginPath();
		ctx.moveTo(406, 86);
		ctx.lineTo(466, 86);
		ctx.lineTo(516, 204);
		ctx.lineTo(458, 204);
		ctx.closePath();
		ctx.fill();
		line(ctx, 410, 92, 462, 202, 'rgba(255,255,255,0.3)', 2.2);
		line(ctx, 466, 90, 514, 200, 'rgba(255,255,255,0.22)', 1.8);
		ctx.restore();
	}

	// Charcoal livery band along the bed floor.
	rect(ctx, 334, 206, 400, 15, CHARCOAL, 0, 2.2);
	line(ctx, 338, 209.5, 730, 209.5, CHROME, 1.6);

	// Near rail in front of the load, with a chrome top edge.
	shape(ctx, RAIL_CAP, CHARCOAL, 2.2);
	line(ctx, 362, 48.6, 732, 67.9, 'rgba(255,255,255,0.34)', 2);
	line(ctx, 360, 60, 734, 80, 'rgba(255,249,236,0.34)', 1.6);

	// Headboard face at the front of the box.
	ctx.fillStyle = YELLOW_SHADE;
	ctx.fill(new Path2D('M336,222 L360,58 L364,58 L346,222 Z'));
	ctx.strokeStyle = 'rgba(58,39,27,0.35)';
	ctx.lineWidth = 1.6;
	ctx.stroke(new Path2D('M338,220 L361,60'));

	if (fitted) {
		// Latch gear on the tailgate.
		rect(ctx, 712, 118, 14, 5, CHROME, 2, 1.5);
		rect(ctx, 712, 178, 14, 5, CHROME, 2, 1.5);
	}

	ctx.restore();

	// Side marker lamps along the livery band are body fittings; the panel keeps its edge.
	if (fitted) {
		for (const mx of [420, 520, 620]) {
			rect(ctx, mx, 208, 14, 6, AMBER, 1.5, 1.3);
		}
	}
}

export function drawRealArticulatedHaulerLevel(
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
		ctx.ellipse(388, 274, 344, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// ── Tractor: cab, bonnet, chassis and articulation ──────────────────────────────
	shape(ctx, BODY_SHELL, YELLOW);

	ctx.save();
	ctx.clip(new Path2D(BODY_SHELL));

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 44, 0, 262);
		paint.addColorStop(0, 'rgba(255,255,255,0.44)');
		paint.addColorStop(0.3, 'rgba(255,255,255,0.05)');
		paint.addColorStop(0.72, 'rgba(150,96,10,0.06)');
		paint.addColorStop(1, 'rgba(120,70,8,0.28)');
		ctx.fillStyle = paint;
		ctx.fillRect(16, 44, 744, 222);
	}

	// Charcoal chassis beam under the deck and along the frame.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(38, 238, 716, 26);
	ctx.fillStyle = 'rgba(255,255,255,0.18)';
	ctx.fillRect(38, 238, 716, 2.2);
	ctx.fillStyle = CHARCOAL_DEEP;
	ctx.fillRect(38, 259, 716, 5);

	// Frame top edge from the cab to the pivot, so the deck reads as a beam.
	line(ctx, 246, 213, 320, 225, 'rgba(255,255,255,0.24)', 2.4);
	line(ctx, 246, 218, 320, 230, 'rgba(58,39,27,0.28)', 2);

	// Front bumper, grille recess and tow eye.
	rect(ctx, 24, 232, 21, 29, CHROME, 4, 2.6);
	rect(ctx, 27, 246, 15, 9, CHARCOAL, 2, 1.6);
	line(ctx, 27, 234, 45, 234, 'rgba(255,255,255,0.6)', 1.8);
	rect(ctx, 44, 206, 11, 25, CHARCOAL, 2, 2.2);
	for (let bar = 0; bar < 3; bar++) {
		line(ctx, 45, 211 + bar * 6, 54, 211 + bar * 6, CHROME, 1.5);
	}

	// Bonnet louvres on the short engine hood.
	if (shaded) {
		for (let vent = 0; vent < 3; vent++) {
			line(ctx, 52, 204 - vent * 5, 72, 200 - vent * 5, 'rgba(120,70,8,0.4)', 2);
		}
	}

	// Cab door: seam, handle, hinge and the step under the sill.
	rect(ctx, 146, 172, 92, 38, YELLOW, 3, 2.4);
	line(ctx, 147, 176, 237, 176, 'rgba(58,39,27,0.2)', 1.6);
	rect(ctx, 140, 206, 102, 6, YELLOW_SHADE, 2, 1.8);
	rect(ctx, 146, 208, 52, 8, CHARCOAL, 2, 2);
	line(ctx, 150, 212, 194, 212, 'rgba(255,255,255,0.35)', 1.4);

	// Fuel tank on the frame behind the front tyre.
	rect(ctx, 214, 226, 72, 20, CHROME, 6, 2.4);
	line(ctx, 220, 229, 280, 229, 'rgba(255,255,255,0.6)', 1.6);
	line(ctx, 240, 227, 240, 245, STEEL, 2);
	line(ctx, 262, 227, 262, 245, STEEL, 2);
	circle(ctx, 250, 236, 4, STEEL, 1.4);

	// Articulation joint: pivot drum, pin and hydraulic hose on the frame.
	circle(ctx, 312, 232, 11, CHARCOAL_LIGHT, 2.6);
	circle(ctx, 312, 232, 4.5, CHROME, 1.6);
	line(ctx, 302, 240, 292, 248, INK, 4.4);
	line(ctx, 302, 240, 292, 248, STEEL, 2.6);

	// Deck plate between the cab and the pivot, with its bolts.
	rect(ctx, 248, 214, 58, 11, CHARCOAL_LIGHT, 3, 2);
	circle(ctx, 259, 219.5, 2, STEEL, 1);
	circle(ctx, 295, 219.5, 2, STEEL, 1);

	// Bed front face, stepped up from the deck.
	ctx.fillStyle = YELLOW_DEEP;
	ctx.fill(new Path2D('M322,224 L352,56 L364,60 L336,226 Z'));
	ctx.strokeStyle = 'rgba(58,39,27,0.35)';
	ctx.lineWidth = 1.8;
	ctx.stroke(new Path2D('M322,224 L352,56'));
	line(ctx, 330, 210, 356, 74, CHROME, 1.8);

	// Picture-book sheen across the cab roof and flank, under the glass.
	if (finish) {
		const gloss = ctx.createLinearGradient(100, 92, 238, 228);
		gloss.addColorStop(0, 'rgba(255,255,255,0.34)');
		gloss.addColorStop(0.5, 'rgba(255,255,255,0.1)');
		gloss.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = gloss;
		ctx.beginPath();
		ctx.moveTo(104, 92);
		ctx.lineTo(152, 92);
		ctx.lineTo(216, 220);
		ctx.lineTo(162, 220);
		ctx.closePath();
		ctx.fill();
		line(ctx, 108, 96, 148, 97, 'rgba(255,255,255,0.52)', 2.2);
		line(ctx, 114, 100, 210, 210, 'rgba(255,255,255,0.26)', 2);
	}

	ctx.restore();

	// ── Cab roof gear (outside the shell, inside the body mask) ─────────────────────
	if (fitted) {
		// Beacon on its low base.
		rect(ctx, 195, 86, 20, 4, CHARCOAL, 1.5, 1.6);
		ctx.beginPath();
		ctx.arc(205, 86, 9, Math.PI, 0);
		ctx.fillStyle = AMBER;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2;
		ctx.stroke();
		line(ctx, 200, 78, 203, 84, 'rgba(255,255,255,0.6)', 1.6);

		// Exhaust stack with a chrome cap.
		rect(ctx, 221, 64, 12, 26, CHARCOAL_LIGHT, 2, 2.2);
		rect(ctx, 218, 60, 14, 6, CHROME, 2, 1.8);
		line(ctx, 223, 70, 223, 88, 'rgba(255,255,255,0.28)', 1.6);

		// Mirror head on its stalk, bracketed to the A-pillar.
		rect(ctx, 48, 108, 16, 22, CHROME, 3, 2.2);
		line(ctx, 51, 112, 61, 112, 'rgba(255,255,255,0.65)', 1.6);
		line(ctx, 62, 120, 82, 126, INK, 3.4);
		line(ctx, 62, 120, 82, 126, STEEL, 2.2);
		rect(ctx, 74, 117, 14, 10, STEEL, 3, 1.8);

		// Roof marker lamps under the visor.
		rect(ctx, 122, 92, 92, 6, CHARCOAL, 2, 2);
		for (let lens = 0; lens < 5; lens++) {
			rect(ctx, 126 + lens * 18, 92.6, 11, 4.4, AMBER, 1.4, 1.1);
		}
	}

	// ── Dump body (its own piece) ───────────────────────────────────────────────────
	drawBed(ctx, shaded, fitted, finish);

	// ── Cab glass ───────────────────────────────────────────────────────────────────
	shape(ctx, WINDSCREEN, GLASS, 2.4);
	shape(ctx, SIDE_GLASS, GLASS, 2.4);

	if (shaded) {
		glassShade(ctx, WINDSCREEN, 78, 104, 56, 66);
		glassShade(ctx, SIDE_GLASS, 146, 104, 92, 58);
		line(ctx, 106, 122, 92, 152, 'rgba(255,255,255,0.55)', 3);
	}

	// Rear lights and plate on the tailgate face, clear of the bed piece.
	rect(ctx, 738, 186, 11, 17, TAIL, 2, 1.8);
	rect(ctx, 738, 206, 11, 12, AMBER, 2, 1.5);
	rect(ctx, 736, 226, 15, 9, CREAM, 1, 1.4);
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(738, 228.5, 11, 4);

	if (fitted) {
		// Wipers, door handle, grab rail and side markers.
		line(ctx, 88, 162, 110, 150, INK, 2.2);
		line(ctx, 94, 164, 116, 152, INK, 2);
		rect(ctx, 224, 178, 12, 4, CHROME, 2, 1.5);
		rect(ctx, 148, 180, 4, 12, STEEL, 1.5, 1.4);
		line(ctx, 244, 110, 244, 150, 'rgba(58,39,27,0.24)', 2);

		// Headlamp and indicator on the nose.
		circle(ctx, 56, 219, 7.5, LAMP, 2.2);
		circle(ctx, 56, 219, 3.4, CREAM, 1.2);
		rect(ctx, 46, 228, 10, 5, AMBER, 1.5, 1.2);
	}

	// ── Wheel arches over the paint, then the one wheel piece used twice ────────────
	wheelWell(ctx, WHEEL_L.x, ARCH, shaded);
	wheelWell(ctx, WHEEL_R.x, ARCH, shaded);

	if (fitted) {
		ctx.strokeStyle = YELLOW_DEEP;
		ctx.lineWidth = 5;
		for (const [wx, ar] of [
			[WHEEL_L.x, ARCH],
			[WHEEL_R.x, ARCH]
		]) {
			ctx.beginPath();
			ctx.arc(wx, 236, ar + 3, Math.PI * 1.03, Math.PI * 1.97);
			ctx.stroke();
		}
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.7;
		for (const [wx, ar] of [
			[WHEEL_L.x, ARCH],
			[WHEEL_R.x, ARCH]
		]) {
			ctx.beginPath();
			ctx.arc(wx, 236, ar + 5.5, Math.PI * 1.03, Math.PI * 1.97);
			ctx.stroke();
		}

		// Mudflaps behind each axle.
		rect(ctx, WHEEL_BOX.x + WHEEL_BOX.w + 16, 248, 18, 20, CHARCOAL, 2, 2);
		rect(ctx, WHEEL_R.x + WHEEL_R.r + 16, 250, 18, 18, CHARCOAL, 2, 2);
	}

	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (finish) {
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	if (lit) {
		// Rim light along the cab roof and the bed rail.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(110, 91);
		ctx.lineTo(230, 91);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(366, 49);
		ctx.lineTo(736, 68);
		ctx.stroke();

		// Headlight glow and a beacon flash.
		const glow = ctx.createRadialGradient(56, 219, 1, 56, 219, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.62)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(56, 219, 30, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.3;
		ctx.fillStyle = '#FFC94D';
		ctx.beginPath();
		ctx.arc(205, 78, 15, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.22;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 274, 34, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		glint(ctx, 416, 168, 5.6);
		glint(ctx, 566, 150, 5.2);
		glint(ctx, 690, 132, 5);
		glint(ctx, 196, 130, 4.6);
		glint(ctx, 228, 196, 4);
		line(ctx, 90, 116, 104, 146, 'rgba(255,255,255,0.45)', 2.4);
		line(ctx, 150, 116, 162, 150, 'rgba(255,255,255,0.4)', 2.2);
		line(ctx, 51, 126, 62, 110, 'rgba(255,255,255,0.55)', 1.8);

		// Chrome sheen and rivet heads on the headboard.
		line(ctx, 360, 92, 388, 70, 'rgba(255,255,255,0.4)', 1.8);
		ctx.fillStyle = 'rgba(255,249,236,0.8)';
		for (const ry of [90, 150, 210]) {
			ctx.beginPath();
			ctx.arc(338, ry, 2.2, 0, Math.PI * 2);
			ctx.fill();
		}

		// Exhaust puff.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = '#9AA3B2';
		ctx.beginPath();
		ctx.arc(227, 54, 7, 0, Math.PI * 2);
		ctx.arc(220, 43, 5.4, 0, Math.PI * 2);
		ctx.arc(233, 36, 4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealArticulatedHauler(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealArticulatedHaulerLevel(ctx, x, y, scale, 5);
}
