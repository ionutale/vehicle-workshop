/**
 * Crop sprayer art, cut into the same five-piece kit as the rest of the realistic fleet.
 *
 * A high-clearance green machine facing left: a tractor-like bonnet and a tall glazed cab
 * up front, a big product tank behind it, and the wide horizontal spray booms folded along
 * the flanks — the naming cue, so they travel as their own cargo piece. The chassis is a
 * slim spine a full wheel-height above the road so the crop passes underneath, and the
 * rear bumper carries the lamps and plate clear of the folded booms.
 *
 * Yellow carries the second colour on the roof cap, cab belt, tank band, boom tubes,
 * nozzle caps and the hub ring.
 *
 * Level 4 is the production target: shaded, fitted and lit in the world; level 5 adds the
 * picture-book finish.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape, wheel } from './realKit';

const GREEN = '#90BE6D';
const GREEN_LIGHT = '#B8D99D';
const GREEN_DEEP = '#6E9E4F';
const YELLOW = '#F9C74F';
const YELLOW_DEEP = '#D9A62E';
const CREAM = '#FFF6E4';
const CHARCOAL = '#2B2D42';
const CHARCOAL_LIGHT = '#3E4260';
const RAIL = '#48545F';
const IRON = '#3B434E';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#E0455A';
const WELL = '#2F4A28';

/** Art box 800 x 360, road at 272. Front (bonnet) faces left. */
const WHEEL_L = { x: 160, y: 236, r: 38 };
const WHEEL_R = { x: 620, y: 236, r: 38 };

/**
 * One silhouette: nose, bonnet, raked cab, big tank dome and stepped engine deck, with a
 * wheel well scalloped out of the belly at each axle. The belly runs clear of the wheel
 * crowns, which is what makes the machine read as a high-clearance sprayer.
 */
const SHELL =
	'M38,196 L38,170 Q38,159 50,156 L166,138 Q176,136 180,128 L212,62 Q214,56 222,56 L326,56 Q334,56 334,64 L334,118 L344,130 C348,104 360,88 386,86 L502,86 C528,86 542,98 546,122 L552,140 L562,150 L646,150 Q658,150 664,160 L668,196 L658,196 Q656,186 620,184 Q584,186 582,196 L206,196 Q204,186 160,184 Q116,186 114,196 Z';

const WELL_F = 'M114,196 Q116,186 160,184 Q204,186 206,196 Z';
const WELL_R = 'M582,196 Q584,186 620,184 Q656,186 658,196 Z';
const ARCH_F = 'M116,196 Q118,187 160,185 Q202,187 204,196';
const ARCH_R = 'M584,196 Q586,187 620,185 Q654,187 656,196';

/** Slim high-clearance spine under the tank, reaching both axle centres. */
const BELLY = 'M160,196 L620,196 L620,206 Q620,210 614,210 L166,210 Q160,210 160,206 Z';
/** Cast front weight block hung off the nose. */
const FRONT_WEIGHT = 'M20,178 L38,178 L38,196 L20,196 Z';
/** Rear bumper: lamps and plate live here, clear of the folded booms. */
const BUMPER = 'M646,196 L686,196 L686,210 Q686,216 678,216 L654,216 Q646,216 646,210 Z';

const BEACON = 'M286,56 L286,48 Q286,40 294,40 L302,40 Q310,40 310,48 L310,56 Z';
const STACK = 'M314,40 L326,40 L326,56 L314,56 Z';
const STACK_CAP = 'M310,36 L330,36 L330,40 L310,40 Z';
/** Mirror head on a stalk ahead of the A-pillar, clear of the glazing. */
const MIRROR = 'M160,84 L182,84 L182,102 L173,102 L173,133 L167,133 L167,102 L160,102 Z';
/** Fill hatch, a low dome sitting on the tank crown. */
const HATCH = 'M420,86 Q420,76 434,74 L466,74 Q476,76 476,86 Z';
/** Vent stack rising out of the fill hatch. */
const VENT = 'M445,60 L452,60 L452,74 L445,74 Z';
const VENT_CAP = 'M441,55 L456,55 L456,60 L441,60 Z';
/** Roof work lamp, butted to the front of the cab roof. */
const WORK_LAMP = 'M222,50 L236,50 L236,56 L222,56 Z';

const WINDSCREEN = 'M191,124 L217,68 L241,68 L241,124 Z';
const DOOR_GLASS = pane(247, 70, 56, 50, 4);
const QUARTER_GLASS = pane(309, 74, 19, 42, 3);
const GLASS_MASK = `${WINDSCREEN} ${DOOR_GLASS} ${QUARTER_GLASS}`;

/** Door panel under the glazing, flush with the cab sill. */
const DOOR = { x: 240, y: 130, w: 90, h: 64 };

/**
 * Folded booms: two long horizontal tubes, three hinge plates between them, an end plate,
 * a front mounting post and six nozzle bodies with tips. The post plants the assembly on
 * the tank shoulder; the right end runs past the tail. Nothing here reaches the wheels.
 */
const TUBE_A = 'M348,158 L766,158 Q778,158 778,164 Q778,170 766,170 L348,170 L342,164 Z';
const TUBE_B = 'M364,180 L744,180 Q754,180 754,185 Q754,191 744,191 L364,191 L358,185 Z';
const HINGES = [
	'M428,170 L448,170 L448,180 L428,180 Z',
	'M524,170 L544,170 L544,180 L524,180 Z',
	'M620,170 L640,170 L640,180 L620,180 Z'
].join(' ');
/** Front mounting post: the boom is bolted down onto the chassis, not floating. */
const BOOM_POST = 'M342,170 L356,170 L356,196 L342,196 Z';
const BOOM_END = 'M756,170 L770,170 L770,202 L756,202 Z';
const NOZZLE_X = [386, 446, 506, 566, 676, 736];

function nozzleBody(x: number): string {
	return `M${x - 7},191 L${x + 7},191 L${x + 4},202 L${x - 4},202 Z`;
}

function nozzleTip(x: number): string {
	return `M${x - 3.5},202 L${x + 3.5},202 L${x},208 Z`;
}

const BOOM_MASK = [
	TUBE_A,
	TUBE_B,
	HINGES,
	BOOM_POST,
	BOOM_END,
	...NOZZLE_X.flatMap((n) => [nozzleBody(n), nozzleTip(n)])
].join(' ');

/** Canvas-wide keep-out with a wheel-shaped hole, for clipping paint off the tyres. */
const KEEP_OUT_L = `M-20,-20 H820 V380 H-20 Z ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r + 2)}`;
const KEEP_OUT_R = `M-20,-20 H820 V380 H-20 Z ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r + 2)}`;

const BODY_MASK = [
	SHELL,
	WELL_F,
	WELL_R,
	BELLY,
	FRONT_WEIGHT,
	BUMPER,
	BEACON,
	STACK,
	STACK_CAP,
	MIRROR,
	HATCH,
	VENT,
	VENT_CAP,
	WORK_LAMP
].join(' ');

function pane(x: number, y: number, w: number, h: number, r: number): string {
	return `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;
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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.6)');
	glass.addColorStop(0.46, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(96,182,232,0.26)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** A four-point sparkle with a warm core, sized to survive the game scale. */
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
	ctx.lineWidth = 1.9;
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

/**
 * Picture-book hub: a yellow machined ring, a chrome centre disc that hides the kit's
 * stamp, six lug nuts with catchlights and a bright crown. Mirror-symmetric, so the
 * flipped rear wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	const ring = ctx.createLinearGradient(cx - r * 0.3, cy - r * 0.3, cx + r * 0.3, cy + r * 0.3);
	ring.addColorStop(0, '#FFE9B0');
	ring.addColorStop(0.5, YELLOW);
	ring.addColorStop(1, '#C9932A');
	ctx.strokeStyle = ring;
	ctx.lineWidth = 3.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.285, 0, Math.PI * 2);
	ctx.stroke();

	const disc = ctx.createLinearGradient(
		cx - r * 0.24,
		cy - r * 0.24,
		cx + r * 0.24,
		cy + r * 0.24
	);
	disc.addColorStop(0, '#F2F6FA');
	disc.addColorStop(0.55, '#CDD6E2');
	disc.addColorStop(1, '#9AA5B4');
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.245, 0, Math.PI * 2);
	ctx.fillStyle = disc;
	ctx.fill();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const lx = cx + Math.cos(a) * r * 0.315;
		const ly = cy + Math.sin(a) * r * 0.315;
		circle(ctx, lx, ly, 1.7, IRON, 0.9);
		ctx.fillStyle = 'rgba(255,255,255,0.75)';
		ctx.beginPath();
		ctx.arc(lx - 0.55, ly - 0.55, 0.6, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.78)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 1.04, Math.PI * 1.56);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,26,32,0.24)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 0.1, Math.PI * 0.5);
	ctx.stroke();

	circle(ctx, cx, cy, r * 0.13, '#AEB8C6', 1.2);
	ctx.fillStyle = 'rgba(255,255,255,0.9)';
	ctx.beginPath();
	ctx.arc(cx - r * 0.035, cy - r * 0.035, r * 0.045, 0, Math.PI * 2);
	ctx.fill();

	line(ctx, cx - r * 0.18, cy + r * 0.34, cx - r * 0.3, cy + r * 0.2, CHROME, 1.6);
	circle(ctx, cx - r * 0.3, cy + r * 0.2, 0.9, '#FFFFFF', 0.5);
}

/** Deterministic picture-book paint grain over the painted body, never the glass or tyres. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(`${BODY_MASK} ${GLASS_MASK}`), 'evenodd');
	ctx.clip(new Path2D(KEEP_OUT_L), 'evenodd');
	ctx.clip(new Path2D(KEEP_OUT_R), 'evenodd');

	let seed = 43;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 460; i++) {
		const px = 24 + rnd() * 660;
		const py = 40 + rnd() * 168;
		ctx.globalAlpha = 0.05 + rnd() * 0.07;
		const size = 1.3 + rnd() * 1.7;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 210; i++) {
		const px = 24 + rnd() * 660;
		const py = 40 + rnd() * 168;
		ctx.globalAlpha = 0.08 + rnd() * 0.12;
		const size = 1.1 + rnd() * 1.3;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = '#E6F5D8';
	for (let i = 0; i < 90; i++) {
		const px = 40 + rnd() * 290;
		const py = 144 + rnd() * 46;
		ctx.globalAlpha = 0.06 + rnd() * 0.09;
		ctx.fillRect(px, py, 1 + rnd() * 1.3, 1 + rnd() * 1.3);
	}

	ctx.globalAlpha = 0.15;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.7;
	for (const [sx, sy, ex, ey] of [
		[52, 172, 176, 145],
		[196, 132, 330, 130],
		[356, 104, 538, 100],
		[576, 156, 640, 160],
		[176, 202, 610, 204]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Level-5 tank sheen: a cabinet reflection across the dome and a crown catchlight. */
function tankSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	// Keep the polish on the tank skin: the sight glass and its liquid stay clear.
	ctx.clip(new Path2D(`${SHELL} M386,92 L398,92 L398,144 L386,144 Z`), 'evenodd');
	ctx.clip(new Path2D(KEEP_OUT_R), 'evenodd');

	const flank = ctx.createLinearGradient(0, 82, 0, 146);
	flank.addColorStop(0, 'rgba(255,255,255,0.3)');
	flank.addColorStop(0.5, 'rgba(255,255,255,0.06)');
	flank.addColorStop(1, 'rgba(46,86,32,0.14)');
	ctx.fillStyle = flank;
	ctx.fillRect(348, 82, 202, 64);

	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(392, 90);
	ctx.quadraticCurveTo(440, 87.6, 500, 88);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(398, 96);
	ctx.quadraticCurveTo(444, 93.4, 496, 93.8);
	ctx.stroke();

	// Cab flank catchlight and the bonnet crown.
	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(248, 130);
	ctx.lineTo(326, 130);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.4)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.moveTo(58, 166);
	ctx.lineTo(176, 142);
	ctx.stroke();
	ctx.restore();
}

/** Level-5 boom sheen: polished tube crowns, chrome pins and hinge catchlights. */
function boomSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(BOOM_MASK));

	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(352, 161);
	ctx.lineTo(762, 161);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(368, 183);
	ctx.lineTo(740, 183);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(58,39,27,0.28)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(352, 168.4);
	ctx.lineTo(764, 168.4);
	ctx.stroke();

	for (const pin of [438, 534, 630, 763]) {
		circle(ctx, pin, 175, 1.6, CHROME, 0.9);
	}
	ctx.restore();
}

export function drawRealCropSprayerLevel(
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
		ctx.ellipse(352, 282, 322, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Dark wells behind the arch scallops, before the tyre tiles go on top.
	ctx.fillStyle = WELL;
	ctx.fill(new Path2D(WELL_F));
	ctx.fill(new Path2D(WELL_R));

	// ── Painted silhouette ───────────────────────────────────────────────────────────
	shape(ctx, SHELL, GREEN);

	const shellPath = new Path2D(SHELL);
	ctx.save();
	ctx.clip(shellPath);

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 46, 0, 220);
		paint.addColorStop(0, 'rgba(255,255,255,0.5)');
		paint.addColorStop(0.28, 'rgba(255,255,255,0.05)');
		paint.addColorStop(0.72, 'rgba(46,86,32,0.06)');
		paint.addColorStop(1, 'rgba(40,74,28,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(18, 44, 670, 178);
	}

	// Roof cap and cab belt in yellow.
	ctx.fillStyle = YELLOW;
	ctx.fillRect(224, 56, 100, 5);
	ctx.fillStyle = YELLOW_DEEP;
	ctx.fillRect(186, 126, 148, 4);

	// Tank band riding just above the folded booms.
	ctx.fillStyle = YELLOW;
	ctx.fillRect(352, 138, 196, 6);
	ctx.fillStyle = 'rgba(255,255,255,0.4)';
	ctx.fillRect(352, 138, 196, 1.6);

	// Tank seams across the dome.
	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 1.8;
	for (const seam of [408, 456, 504]) {
		ctx.beginPath();
		ctx.moveTo(seam, 92);
		ctx.lineTo(seam, 138);
		ctx.stroke();
	}

	// Tank sight glass with spray liquid showing through.
	ctx.fillStyle = 'rgba(20,25,30,0.5)';
	ctx.fillRect(386, 92, 12, 52);
	ctx.fillStyle = GREEN_DEEP;
	ctx.fillRect(388, 104, 8, 38);
	ctx.fillStyle = 'rgba(255,255,255,0.5)';
	ctx.fillRect(389, 106, 2, 34);
	ctx.strokeStyle = 'rgba(58,39,27,0.55)';
	ctx.lineWidth = 1.4;
	ctx.strokeRect(386, 92, 12, 52);
	if (fitted) {
		// Level ticks beside the sight glass.
		ctx.strokeStyle = 'rgba(58,39,27,0.4)';
		ctx.lineWidth = 1.2;
		for (let tick = 0; tick < 4; tick++) {
			line(ctx, 380, 108 + tick * 10, 384, 108 + tick * 10, 'rgba(58,39,27,0.4)', 1.2);
		}
	}

	// Bonnet crease, cowl seam and the cab rear shadow.
	line(ctx, 54, 164, 174, 141, 'rgba(255,255,255,0.28)', 1.6);
	line(ctx, 54, 180, 176, 156, 'rgba(58,39,27,0.16)', 1.4);
	line(ctx, 180, 130, 180, 194, INK, 2.2);
	if (shaded) {
		ctx.fillStyle = 'rgba(40,74,28,0.16)';
		ctx.fillRect(330, 78, 6, 112);
		ctx.fillStyle = 'rgba(40,74,28,0.12)';
		ctx.fillRect(38, 188, 560, 8);
	}

	// Engine-bay louvres show above the folded booms.
	ctx.strokeStyle = 'rgba(58,39,27,0.4)';
	ctx.lineWidth = 1.6;
	for (let vent = 0; vent < 2; vent++) {
		ctx.beginPath();
		ctx.moveTo(570, 152.5 + vent * 3.2);
		ctx.lineTo(640, 153.5 + vent * 3.2);
		ctx.stroke();
	}

	// Door panel: seam, shoulder highlight and the window sill rubber.
	ctx.fillStyle = 'rgba(255,255,255,0.1)';
	ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
	line(ctx, DOOR.x, 130, DOOR.x, 194, 'rgba(58,39,27,0.26)', 1.6);
	if (shaded) {
		line(ctx, DOOR.x + 2, 134, DOOR.x + DOOR.w - 4, 134, 'rgba(255,255,255,0.22)', 1.4);
		line(ctx, DOOR.x + 2, 190, DOOR.x + DOOR.w - 4, 190, 'rgba(58,39,27,0.16)', 1.4);
	}
	ctx.restore();

	// Re-stroke the silhouette after the opaque livery fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(shellPath);

	// ── Body fittings that sit outside the shell (all part of the body mask) ─────────
	// Cast front weight on the nose.
	shape(ctx, FRONT_WEIGHT, '#59626E', 2.4);
	line(ctx, 22, 184, 30, 184, 'rgba(255,255,255,0.3)', 1.6);
	if (fitted) {
		for (const wy of [186, 191]) {
			line(ctx, 22, wy, 30, wy, '#2C333C', 2.2);
		}
		circle(ctx, 24, 181.6, 1.5, CHROME, 0.9);
		circle(ctx, 24, 193, 1.5, CHROME, 0.9);
	}

	// Belly spine: the high-clearance chassis rail.
	shape(ctx, BELLY, IRON, 2.2);
	line(ctx, 164, 198.6, 616, 198.6, 'rgba(255,255,255,0.2)', 1.6);
	line(ctx, 168, 207.4, 612, 207.4, 'rgba(0,0,0,0.35)', 1.6);
	if (fitted) {
		// Hydraulic line and its clips running the length of the spine.
		line(ctx, 200, 203, 600, 203, '#B0762F', 2.4);
		for (const clip of [230, 340, 450, 560]) {
			rect(ctx, clip, 200.4, 6, 5, RAIL, 1.2, 1);
		}
	}

	// Rear bumper carrying the lamps and the plate.
	shape(ctx, BUMPER, RAIL, 2.2);
	if (shaded) {
		line(ctx, 650, 198.4, 682, 198.4, 'rgba(255,255,255,0.28)', 1.4);
	}

	// Beacon base and exhaust stack.
	shape(ctx, BEACON, '#3E4652', 2);
	rect(ctx, 288, 42, 18, 11, AMBER, 5, 1.4);
	if (shaded) {
		line(ctx, 290, 46, 304, 46, 'rgba(255,255,255,0.6)', 1.2);
	}
	shape(ctx, STACK, '#5A636F', 2);
	if (shaded) {
		const pipe = ctx.createLinearGradient(314, 0, 326, 0);
		pipe.addColorStop(0, '#6C7885');
		pipe.addColorStop(0.5, '#545E6A');
		pipe.addColorStop(1, '#333B46');
		ctx.fillStyle = pipe;
		ctx.fillRect(315, 41, 10, 15);
	}
	shape(ctx, STACK_CAP, '#454E5A', 1.8);

	// Mirror head on its stalk.
	shape(ctx, MIRROR, CHARCOAL, 2);
	rect(ctx, 162, 86, 17, 14, GLASS, 2, 1.2);
	if (shaded) {
		line(ctx, 163, 87.4, 178, 87.4, 'rgba(255,255,255,0.45)', 1.2);
	}

	// Tank fill hatch and its vent stack.
	shape(ctx, HATCH, GREEN_LIGHT, 2);
	if (shaded) {
		line(ctx, 426, 78, 464, 76.6, 'rgba(255,255,255,0.45)', 1.4);
	}
	if (fitted) {
		rect(ctx, 436, 72, 16, 4, CHROME, 1.6);
	}
	shape(ctx, VENT, '#5A636F', 1.8);
	shape(ctx, VENT_CAP, '#454E5A', 1.6);

	// Roof work lamp.
	shape(ctx, WORK_LAMP, IRON, 1.8);
	rect(ctx, 224, 51.4, 10, 4, LAMP, 1.2, 1);

	// ── Glass ────────────────────────────────────────────────────────────────────────
	shape(ctx, WINDSCREEN, GLASS, 2.4);
	shape(ctx, DOOR_GLASS, GLASS, 2.4);
	shape(ctx, QUARTER_GLASS, GLASS, 2.4);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 191, 68, 50, 56);
		shadeGlass(ctx, DOOR_GLASS, 247, 70, 56, 50);
		shadeGlass(ctx, QUARTER_GLASS, 309, 74, 19, 42);
	}
	ctx.strokeStyle = '#2F3338';
	ctx.lineWidth = 1.8;
	ctx.stroke(new Path2D(pane(247, 70, 56, 50, 4)));
	ctx.stroke(new Path2D(pane(309, 74, 19, 42, 3)));

	// ── Folded booms (cargo piece) ───────────────────────────────────────────────────
	shape(ctx, BOOM_POST, GREEN_DEEP, 2.4);
	if (shaded) {
		line(ctx, 344, 172, 344, 194, 'rgba(255,255,255,0.26)', 1.4);
	}
	shape(ctx, TUBE_A, YELLOW, 2.6);
	shape(ctx, TUBE_B, YELLOW, 2.6);
	shape(ctx, HINGES, GREEN_DEEP, 2);
	shape(ctx, BOOM_END, GREEN_DEEP, 2);
	for (const nx of NOZZLE_X) {
		shape(ctx, nozzleBody(nx), CHARCOAL_LIGHT, 2);
		shape(ctx, nozzleTip(nx), STEEL, 1.6);
	}

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(BOOM_MASK));
		const tube = ctx.createLinearGradient(0, 158, 0, 170);
		tube.addColorStop(0, 'rgba(255,255,255,0.5)');
		tube.addColorStop(0.45, 'rgba(255,255,255,0.06)');
		tube.addColorStop(1, 'rgba(120,64,8,0.26)');
		ctx.fillStyle = tube;
		ctx.fillRect(340, 158, 440, 12);
		const tubeB = ctx.createLinearGradient(0, 180, 0, 191);
		tubeB.addColorStop(0, 'rgba(255,255,255,0.42)');
		tubeB.addColorStop(1, 'rgba(120,64,8,0.3)');
		ctx.fillStyle = tubeB;
		ctx.fillRect(356, 180, 400, 11);
		ctx.restore();
	}

	if (fitted) {
		// Green transport clamps over the upper tube.
		for (const cx of [372, 694]) {
			rect(ctx, cx - 8, 155, 16, 16, GREEN_DEEP, 3, 1.8);
			line(ctx, cx - 5, 158, cx - 5, 168, 'rgba(255,255,255,0.3)', 1.2);
			circle(ctx, cx, 160, 1.6, CHROME, 0.9);
			circle(ctx, cx, 168, 1.6, CHROME, 0.9);
		}
		// Fold plates get their bolts and the end plate its pivot pin.
		for (const px of [438, 534, 630]) {
			circle(ctx, px, 172.4, 1.5, CHROME, 0.8);
			circle(ctx, px, 177.6, 1.5, CHROME, 0.8);
		}
		circle(ctx, 763, 188, 3.4, CHROME, 1.4);
		circle(ctx, 763, 188, 1.4, IRON, 0.8);
		// Nozzle caps and collars.
		for (const nx of NOZZLE_X) {
			rect(ctx, nx - 5.2, 191.6, 10.4, 4, YELLOW, 1.2, 0.9);
			line(ctx, nx - 7.4, 199, nx + 7.4, 199, CHROME, 1.1);
		}
	}

	// ── Cab fittings ─────────────────────────────────────────────────────────────────
	if (fitted) {
		rect(ctx, DOOR.x + DOOR.w - 16, 148, 13, 4, CHROME, 2, 1.3);
		rect(ctx, 296, 168, 30, 7, STEEL, 2, 2);
		rect(ctx, 292, 179, 38, 6, RAIL, 2, 1.6);
		rect(ctx, 292, 189, 38, 5, RAIL, 2, 1.4);
		// Grab rail beside the door.
		line(ctx, 333, 134, 333, 178, CHROME, 2.2);

		// Nose: grille, headlamp and indicator.
		rect(ctx, 40, 178, 9, 12, '#39414C', 2, 2);
		for (let gy = 181; gy <= 188; gy += 3.5) {
			line(ctx, 42, gy, 47, gy, CHROME, 1);
		}
		circle(ctx, 55, 168, 6.6, CHROME, 2);
		circle(ctx, 55, 168, 4.6, LAMP, 1.6);
		circle(ctx, 54, 167, 1.6, '#FFFDF0', 0.7);
		circle(ctx, 48, 192, 3.2, AMBER, 1.4);

		// Bonnet badge, filler cap and louvres.
		circle(ctx, 118, 156, 3.4, YELLOW_DEEP, 1.3);
		circle(ctx, 118, 156, 1.3, CREAM, 0.8);
		circle(ctx, 148, 150, 3.4, CHROME, 1.3);
		for (let louvre = 0; louvre < 3; louvre++) {
			line(ctx, 84, 168 + louvre * 5, 126, 161 + louvre * 5, 'rgba(58,39,27,0.3)', 1.6);
		}

		// Rear lamps and plate on the bumper.
		rect(ctx, 649, 198, 11, 9, RED, 2, 1.6);
		rect(ctx, 662, 200, 7, 7, AMBER, 1.4);
		rect(ctx, 671, 199, 13, 9, CREAM, 1.4);
		line(ctx, 674, 202, 681, 202, 'rgba(58,39,27,0.5)', 1.1);
		line(ctx, 674, 205, 680, 205, 'rgba(58,39,27,0.35)', 1.1);
	}

	// ── Wheels: one piece, drawn twice; the body never masks them ────────────────────
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r, finish);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r, finish);

	if (fitted) {
		// Yellow fender lips laid inside each arch scallop.
		ctx.strokeStyle = YELLOW;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(116, 195);
		ctx.quadraticCurveTo(118, 186.6, 160, 185.4);
		ctx.quadraticCurveTo(202, 186.6, 204, 195);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(584, 195);
		ctx.quadraticCurveTo(586, 186.6, 620, 185.4);
		ctx.quadraticCurveTo(654, 186.6, 656, 195);
		ctx.stroke();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.2;
		ctx.stroke(new Path2D(ARCH_F));
		ctx.stroke(new Path2D(ARCH_R));
	}

	if (lit) {
		// Rim light along the roof, bonnet, tank dome and boom crowns.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(226, 57.4);
		ctx.lineTo(326, 57.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(64, 162);
		ctx.lineTo(172, 141);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.45)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(392, 88.4);
		ctx.quadraticCurveTo(440, 86.6, 506, 87.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.32)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(183, 134);
		ctx.lineTo(183, 192);
		ctx.stroke();

		// Rim light along both folded boom tubes.
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(352, 160.4);
		ctx.lineTo(764, 160.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.45)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(368, 182.4);
		ctx.lineTo(740, 182.4);
		ctx.stroke();

		// Headlamp glow and beacon wash.
		const glow = ctx.createRadialGradient(56, 169, 1, 56, 169, 13);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(56, 169, 13, 0, Math.PI * 2);
		ctx.fill();

		const beaconGlow = ctx.createRadialGradient(297, 46, 1, 297, 46, 16);
		beaconGlow.addColorStop(0, 'rgba(255,183,3,0.5)');
		beaconGlow.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beaconGlow;
		ctx.beginPath();
		ctx.arc(297, 46, 16, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const at of [WHEEL_L, WHEEL_R]) {
			ctx.beginPath();
			ctx.ellipse(at.x, 271, 28, 4.5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		tankSheen(ctx);
		boomSheen(ctx);

		// Bonnet and cab sheen, clipped to the painted shell.
		ctx.save();
		ctx.clip(shellPath);
		ctx.strokeStyle = 'rgba(255,255,255,0.36)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(62, 168);
		ctx.quadraticCurveTo(118, 156, 172, 144);
		ctx.stroke();
		ctx.globalAlpha = 0.6;
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(66, 173);
		ctx.quadraticCurveTo(120, 161, 170, 149);
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.strokeStyle = 'rgba(255,255,255,0.22)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(196, 124);
		ctx.lineTo(330, 124);
		ctx.stroke();
		ctx.restore();

		// Glass sheen, kept inside the glazing.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.66)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(196, 121);
		ctx.lineTo(220, 73);
		ctx.stroke();
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(253, 118);
		ctx.lineTo(271, 74);
		ctx.stroke();
		ctx.lineWidth = 1.4;
		ctx.globalAlpha = 0.7;
		ctx.beginPath();
		ctx.moveTo(277, 116);
		ctx.lineTo(289, 78);
		ctx.stroke();
		ctx.restore();

		// Glints across the paint, chrome and working metal.
		glint(ctx, 292, 58, 4.6);
		glint(ctx, 142, 148, 4);
		glint(ctx, 466, 88, 4);
		glint(ctx, 55, 166, 3.2);
		glint(ctx, 340, 138, 3.4);
		glint(ctx, 432, 79, 3);
		glint(ctx, 630, 156, 2.6);
		glint(ctx, 206, 172, 2.6);
		glint(ctx, 118, 154, 2.6);
		glint(ctx, 762, 164, 2.2);
		glint(ctx, 230, 54, 2);
		glint(ctx, 678, 200, 2.2);
		glint(ctx, 366, 142, 2.2);
		glint(ctx, 320, 46, 2.2);
		glint(ctx, 172, 90, 2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Nozzle tips polished.
		for (const nx of NOZZLE_X) {
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			ctx.lineWidth = 1.2;
			ctx.beginPath();
			ctx.moveTo(nx - 1.9, 203.2);
			ctx.lineTo(nx - 0.35, 205.8);
			ctx.stroke();
		}

		// Rocker dust and a couple of chipped edges from field work, kept on the body tile.
		ctx.save();
		ctx.clip(new Path2D(BODY_MASK));
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = INK;
		for (let dust = 0; dust < 12; dust++) {
			const dx = 56 + dust * 52;
			if ((dx > 108 && dx < 212) || (dx > 576 && dx < 664)) continue;
			ctx.fillRect(dx, 205 + (dust % 3), 14, 2);
		}
		ctx.restore();

		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, chipW, alpha] of [
			[42, 192, 7, 0.4],
			[186, 190, 7, 0.32],
			[556, 153, 6, 0.32],
			[664, 197, 6, 0.3]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, chipW, 2);
		}
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealCropSprayer(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealCropSprayerLevel(ctx, x, y, scale, 5);
}
