/**
 * Recycling lorry art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over cab facing left, a tall blue body split into two loading bays by a full-height
 * divider, two side hatches with recycling roundels, and a big open tail hopper heaped with
 * sorted bottles, paper and card. Five slots: body, windows, hopper, one wheel used twice.
 *
 * The hopper and its sorted load are the cue that names the vehicle, so they are drawn flat
 * from level 1. Level 4 is the production target; level 5 is the picture-book finish with
 * paint grain, body and load sheen, glints, hub hardware, hopper sheen and an exhaust puff.
 */

import {
	CHROME,
	GLASS,
	INK,
	STEEL,
	circle,
	circleMask,
	line,
	rect,
	shape,
	wheel
} from './realKit';

const BLUE = '#457B9D';
const BLUE_DARK = '#35617D';
const BLUE_DEEP = '#27485D';
const BLUE_LIGHT = '#5C93B4';
const GREEN = '#90BE6D';
const GREEN_DARK = '#6F9F4C';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';
const CARD = '#C89A6B';
const GLASS_GREEN = '#3F7A4F';
const GLASS_BLUE = '#4F86A8';
const PAPER_WHITE = '#FFFDF4';

/** Art box 700 x 330, road at 292. Front (cab) faces left. */
const MAIN =
	'M40,282 L40,248 L40,214 L44,168 Q45,152 53,140 L65,122 Q71,112 85,110 L226,110 L226,74 Q226,62 238,62 L604,62 Q622,62 622,80 L622,282 Z';

/** Roof spine marking the two loading bays. */
const SPINE = 'M376,62 L376,54 Q376,50 382,50 L418,50 Q424,50 424,54 L424,62 Z';

/** Every fitting that stands outside the shell. Wheel circles never. */
const BEACON = 'M166,110 L166,103 L171,103 Q171,92 182,92 Q193,92 193,103 L198,103 L198,110 Z';
const STACK = 'M204,110 L204,80 L202,76 L218,76 L216,80 L216,110 Z';
const MIRROR = 'M20,126 L34,131 L34,158 L20,152 Z';
const BUMPER = 'M24,248 L40,248 L40,282 L24,282 Z';
const FLAP_F = 'M202,282 L218,282 L218,290 L202,290 Z';
const FLAP_R = 'M576,282 L592,282 L592,290 L576,290 Z';
const STEP_R = 'M660,282 L696,282 L696,290 L660,290 Z';

const BODY_MASK = [MAIN, SPINE, BEACON, STACK, MIRROR, BUMPER, FLAP_F, FLAP_R, STEP_R].join(' ');

const WINDSCREEN =
	'M50,206 L50,168 Q50,153 57,145 L71,128 Q78,118 91,118 L116,118 Q124,118 124,126 L124,198 Q124,206 116,206 Z';
const SIDE_WINDOW =
	'M136,114 L210,114 Q218,114 218,122 L218,192 Q218,200 210,200 L136,200 Q128,200 128,192 L128,122 Q128,114 136,114 Z';

/** The open tail hopper: near wall, open mouth, and the sorted load standing above it. */
const HOPPER_SHELL =
	'M590,174 L690,174 L690,266 Q690,282 674,282 L606,282 Q596,282 594,270 L584,200 Q584,188 590,174 Z';
const CARTON = 'M594,174 L594,142 L602,134 L616,138 L616,174 Z';
const BOTTLE_GREEN =
	'M620,174 L620,156 Q620,150 625,148 L625,143 L628,141 L628,137 Q628,132 631,132 Q634,132 634,137 L634,141 L637,143 L637,148 Q642,150 642,156 L642,174 Z';
const BOTTLE_BLUE =
	'M646,174 L646,158 Q646,153 650,151 L650,146 L652,144 L652,142 Q652,139 655,139 Q658,139 658,142 L658,144 L660,146 L660,151 Q664,153 664,158 L664,174 Z';
const PAPER = 'M668,174 L672,132 L684,136 L682,174 Z';

const HOPPER_MASK = [HOPPER_SHELL, CARTON, BOTTLE_GREEN, BOTTLE_BLUE, PAPER].join(' ');

const WHEEL_L = { x: 170, y: 262, r: 30 };
const WHEEL_R = { x: 550, y: 262, r: 30 };
const ARCH = 38;

const HATCH_F = { x: 258, y: 168, w: 116, h: 60 };
const HATCH_R = { x: 414, y: 168, w: 116, h: 60 };

const hatchMask = (h: { x: number; y: number; w: number; h: number }): string =>
	`M${h.x},${h.y} L${h.x + h.w},${h.y} L${h.x + h.w},${h.y + h.h} L${h.x},${h.y + h.h} Z`;

const HATCH_F_MASK = hatchMask(HATCH_F);
const HATCH_R_MASK = hatchMask(HATCH_R);

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
	glass.addColorStop(0.44, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(80,160,205,0.32)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Recessed wheel well under the tyre, ringed by a green mudguard lip. */
function wheelWell(ctx: CanvasRenderingContext2D, cx: number, shaded: boolean): void {
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH, Math.PI, Math.PI * 2);
	ctx.lineTo(cx + ARCH, 282);
	ctx.lineTo(cx - ARCH, 282);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, WHEEL_L.y - ARCH, 0, 282);
		well.addColorStop(0, '#0D1A22');
		well.addColorStop(1, BLUE_LIGHT);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = BLUE_DEEP;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke();

	// Mudguard lip: a green band with an ink edge, under the paint.
	ctx.strokeStyle = GREEN_DARK;
	ctx.lineWidth = 6;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH + 2.5, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH + 5.5, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();

	if (shaded) {
		ctx.strokeStyle = 'rgba(255,255,255,0.26)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(cx, WHEEL_L.y, ARCH - 2, Math.PI * 1.12, Math.PI * 1.5);
		ctx.stroke();
	}
}

/** Side hatch: a framed loading door with a hinge bar, latch and green edge stripe. */
function sideHatch(
	ctx: CanvasRenderingContext2D,
	hatch: { x: number; y: number; w: number; h: number },
	shaded: boolean,
	fitted: boolean
): void {
	const { x, y, w, h } = hatch;
	rect(ctx, x, y, w, h, BLUE_DARK, 3, 2.6);
	rect(ctx, x + 4, y + 4, w - 8, h - 8, BLUE, 2, 1.8);

	// Pressed ribs and a dark top shadow read as a metal hatch, never as glass.
	for (let rx = x + 16; rx < x + w - 14; rx += 24) {
		rect(ctx, rx, y + 7, 6, h - 16, BLUE_DARK, 1, 1.3);
		if (shaded) {
			line(ctx, rx + 1.5, y + 9, rx + 1.5, y + h - 11, 'rgba(255,255,255,0.16)', 1.2);
			line(ctx, rx + 5, y + 9, rx + 5, y + h - 11, 'rgba(18,40,55,0.28)', 1.1);
		}
	}
	if (shaded) {
		ctx.fillStyle = 'rgba(16,36,50,0.28)';
		ctx.fillRect(x + 4, y + 4, w - 8, 4);
		line(ctx, x + 6, y + h - 9, x + w - 6, y + h - 9, 'rgba(255,255,255,0.18)', 1.6);
	}
	rect(ctx, x + 4, y + h - 10, w - 8, 4, GREEN, 1, 1);

	if (fitted) {
		// Hinge barrels on the top edge and a latch rod on the trailing edge.
		rect(ctx, x + 8, y + 1, 20, 4, STEEL, 2, 1.5);
		rect(ctx, x + w - 28, y + 1, 20, 4, STEEL, 2, 1.5);
		rect(ctx, x + w - 12, y + 16, 6, 26, CHROME, 2, 1.5);
		line(ctx, x + w - 9, y + 20, x + w - 9, y + 38, 'rgba(58,39,27,0.3)', 1.4);
		circle(ctx, x + 18, y + 3, 2, CHROME, 1);
		circle(ctx, x + w - 18, y + 3, 2, CHROME, 1);
	}
}

/** Three chasing arrows in a cream disc: the recycling roundel, with a material glyph. */
function recycleBadge(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	r: number,
	glyph: 'paper' | 'bottle'
): void {
	circle(ctx, cx, cy, r, CREAM, 2.2);
	ctx.strokeStyle = GREEN;
	ctx.lineWidth = r * 0.19;
	for (let i = 0; i < 3; i++) {
		const a0 = (i / 3) * Math.PI * 2 - Math.PI / 2;
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.74, a0 + 0.18, a0 + 1.48);
		ctx.stroke();

		const tip = a0 + 1.58;
		const px = cx + Math.cos(tip) * r * 0.74;
		const py = cy + Math.sin(tip) * r * 0.74;
		const tx = -Math.sin(tip);
		const ty = Math.cos(tip);
		const nx = Math.cos(tip);
		const ny = Math.sin(tip);
		const s = r * 0.26;
		ctx.fillStyle = GREEN;
		ctx.beginPath();
		ctx.moveTo(px + tx * s, py + ty * s);
		ctx.lineTo(px - tx * s * 0.3 + nx * s * 0.95, py - ty * s * 0.3 + ny * s * 0.95);
		ctx.lineTo(px - tx * s * 0.3 - nx * s * 0.95, py - ty * s * 0.3 - ny * s * 0.95);
		ctx.closePath();
		ctx.fill();
	}

	circle(ctx, cx, cy, r * 0.4, '#F4F9EE', 1.4);

	if (glyph === 'paper') {
		ctx.fillStyle = '#FFFFFF';
		ctx.strokeStyle = BLUE_DARK;
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.moveTo(cx - r * 0.26, cy - r * 0.34);
		ctx.lineTo(cx + r * 0.26, cy - r * 0.34);
		ctx.lineTo(cx + r * 0.26, cy + r * 0.16);
		ctx.lineTo(cx + r * 0.08, cy + r * 0.36);
		ctx.lineTo(cx - r * 0.26, cy + r * 0.36);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle = GREEN_DARK;
		ctx.lineWidth = 1.2;
		for (const dy of [-0.1, 0.04, 0.18]) {
			ctx.beginPath();
			ctx.moveTo(cx - r * 0.16, cy + r * dy);
			ctx.lineTo(cx + r * 0.14, cy + r * dy);
			ctx.stroke();
		}
	} else {
		ctx.fillStyle = GLASS_GREEN;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.1;
		ctx.beginPath();
		ctx.moveTo(cx - r * 0.15, cy + r * 0.36);
		ctx.lineTo(cx - r * 0.15, cy + r * 0.02);
		ctx.lineTo(cx - r * 0.06, cy - r * 0.04);
		ctx.lineTo(cx - r * 0.06, cy - r * 0.2);
		ctx.lineTo(cx - r * 0.02, cy - r * 0.24);
		ctx.lineTo(cx + r * 0.1, cy - r * 0.24);
		ctx.lineTo(cx + r * 0.14, cy - r * 0.2);
		ctx.lineTo(cx + r * 0.14, cy - r * 0.04);
		ctx.lineTo(cx + r * 0.23, cy + r * 0.02);
		ctx.lineTo(cx + r * 0.23, cy + r * 0.36);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(cx - r * 0.09, cy + r * 0.06);
		ctx.lineTo(cx - r * 0.09, cy + r * 0.28);
		ctx.stroke();
	}
}

/** Paint grain and long brush sweeps, clipped to the blue panels only. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(MAIN);
	for (const cut of [
		WINDSCREEN,
		SIDE_WINDOW,
		'M242,62 L604,62 L604,77 L242,77 Z',
		'M60,110 L226,110 L226,118 L60,118 Z',
		'M234,232 L600,232 L600,258 L234,258 Z',
		circleMask(WHEEL_L.x, WHEEL_L.y, ARCH - 4),
		circleMask(WHEEL_R.x, WHEEL_R.y, ARCH - 4),
		circleMask(313, 110, 26),
		circleMask(511, 110, 26)
	]) {
		panels.addPath(new Path2D(cut));
	}
	ctx.clip(panels, 'evenodd');
	let seed = 71;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 320; i++) {
		const px = 44 + rnd() * 574;
		const py = 80 + rnd() * 196;
		const size = 1.4 + rnd() * 1.5;
		ctx.globalAlpha = 0.08 + rnd() * 0.05;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 110; i++) {
		const px = 44 + rnd() * 574;
		const py = 80 + rnd() * 196;
		const size = 1.2 + rnd() * 1;
		ctx.globalAlpha = 0.16 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	ctx.globalAlpha = 0.09;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[54, 190, 120, 188],
		[146, 240, 214, 238],
		[280, 120, 372, 118],
		[430, 150, 520, 148],
		[540, 120, 592, 118]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Level-5 gloss: a long diagonal sweep across the blue bays, cut clear of the fittings. */
function bodySheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(MAIN);
	for (const cut of [
		WINDSCREEN,
		SIDE_WINDOW,
		HATCH_F_MASK,
		HATCH_R_MASK,
		'M242,62 L604,62 L604,77 L242,77 Z',
		'M234,232 L600,232 L600,258 L234,258 Z',
		'M226,62 L242,62 L242,282 L226,282 Z',
		'M386,62 L402,62 L402,282 L386,282 Z',
		'M564,62 L580,62 L580,282 L564,282 Z',
		circleMask(313, 110, 26),
		circleMask(511, 110, 26)
	]) {
		panels.addPath(new Path2D(cut));
	}
	ctx.clip(panels, 'evenodd');

	const gloss = ctx.createLinearGradient(250, 244, 556, 84);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.22, 'rgba(255,255,255,0.04)');
	gloss.addColorStop(0.42, 'rgba(255,255,255,0.18)');
	gloss.addColorStop(0.56, 'rgba(255,255,255,0.03)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(240, 60, 356, 224);
	ctx.restore();

	// A tighter vertical gleam on the rear bay flank, right of the rear hatch.
	ctx.save();
	ctx.clip(new Path2D(MAIN));
	const flank = ctx.createLinearGradient(537, 0, 562, 0);
	flank.addColorStop(0, 'rgba(255,255,255,0)');
	flank.addColorStop(0.45, 'rgba(255,255,255,0.16)');
	flank.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = flank;
	ctx.fillRect(536, 82, 27, 146);
	ctx.restore();
}

/** Level-5 load sheen: sky light down the paper, wet glass flanks and a lit carton edge. */
function loadSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(PAPER));
	const sheets = ctx.createLinearGradient(668, 132, 684, 174);
	sheets.addColorStop(0, 'rgba(255,255,255,0.9)');
	sheets.addColorStop(0.45, 'rgba(255,255,255,0.3)');
	sheets.addColorStop(1, 'rgba(176,168,144,0.08)');
	ctx.fillStyle = sheets;
	ctx.fillRect(666, 130, 20, 46);
	ctx.restore();

	ctx.save();
	ctx.clip(new Path2D(CARTON));
	const carton = ctx.createLinearGradient(594, 136, 616, 174);
	carton.addColorStop(0, 'rgba(255,255,255,0.42)');
	carton.addColorStop(0.42, 'rgba(255,255,255,0.06)');
	carton.addColorStop(1, 'rgba(64,38,16,0.16)');
	ctx.fillStyle = carton;
	ctx.fillRect(592, 132, 26, 44);
	ctx.restore();

	// Glass catches: bright shoulders on both bottles, clear of the label bands.
	for (const [path, x, y, w, h] of [
		[BOTTLE_GREEN, 620, 132, 22, 42],
		[BOTTLE_BLUE, 646, 139, 18, 35]
	] as const) {
		ctx.save();
		ctx.clip(new Path2D(path));
		const glass = ctx.createLinearGradient(x, y, x + w, y + h);
		glass.addColorStop(0, 'rgba(255,255,255,0.55)');
		glass.addColorStop(0.36, 'rgba(255,255,255,0.1)');
		glass.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = glass;
		ctx.fillRect(x - 2, y - 2, w + 4, h + 6);
		ctx.restore();
	}

	// One bright crest along the load's top edge ties the pieces together.
	line(ctx, 597, 144, 614, 137.5, 'rgba(255,255,255,0.62)', 1.8);
	line(ctx, 670, 134.5, 682, 137.5, 'rgba(255,255,255,0.62)', 1.8);
}

/** Level-5 picture-book hub: bright rim, six bolts, cap highlight. Mirror symmetric. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.47, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.5, CHROME, 1.2);
	}

	// A second ring of small rivets between the bolts, still mirror-symmetric.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
		circle(ctx, x + Math.cos(a) * r * 0.19, y + Math.sin(a) * r * 0.19, 1.3, '#8A93A3', 0.9);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(58,39,27,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.24, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();

	// Tread catchlight on the shoulder of the tyre, mirrored on the flipped wheel.
	ctx.strokeStyle = 'rgba(255,255,255,0.42)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.84, Math.PI * 1.06, Math.PI * 1.34);
	ctx.stroke();

	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x - 0.6, y - 0.8, 1.4, 0, Math.PI * 2);
	ctx.fill();
}

/** A four-point paint glint that survives the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
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
	ctx.arc(x, y, 2, 0, Math.PI * 2);
	ctx.fill();
}

/** The open tail hopper, its near rail and the sorted load standing above it. */
function tailHopper(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, HOPPER_SHELL, GREEN);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(HOPPER_SHELL));
		const paint = ctx.createLinearGradient(0, 174, 0, 282);
		paint.addColorStop(0, 'rgba(255,255,255,0.24)');
		paint.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(30,52,20,0.34)');
		ctx.fillStyle = paint;
		ctx.fillRect(582, 172, 112, 112);
		ctx.restore();
	}

	// Soft shadow under the rim, where the open mouth falls away behind it.
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(HOPPER_SHELL));
		const depth = ctx.createLinearGradient(0, 182, 0, 206);
		depth.addColorStop(0, 'rgba(12,26,16,0.62)');
		depth.addColorStop(0.6, 'rgba(12,26,16,0.24)');
		depth.addColorStop(1, 'rgba(12,26,16,0)');
		ctx.fillStyle = depth;
		ctx.fillRect(590, 182, 100, 24);
		ctx.restore();
	}

	// Near wall lip: the load comes up out of the box behind it.
	rect(ctx, 592, 174, 96, 8, GREEN_DARK, 2, 2.2);
	line(ctx, 596, 176.5, 684, 176.5, 'rgba(255,255,255,0.32)', 1.6);

	// The sorted load standing in the mouth: a carton of paper, two glass bottles
	// and a sheaf of sheets.
	shape(ctx, CARTON, CARD, 2.2);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(CARTON));
		ctx.fillStyle = '#B07F52';
		ctx.fillRect(594, 134, 22, 8);
		ctx.fillStyle = 'rgba(50,32,16,0.24)';
		ctx.fillRect(610, 138, 6, 40);
		ctx.restore();
		line(ctx, 598, 154, 612, 154, 'rgba(255,255,255,0.34)', 2);
	}

	shape(ctx, PAPER, PAPER_WHITE, 2);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(PAPER));
		const sheets = ctx.createLinearGradient(668, 132, 686, 174);
		sheets.addColorStop(0, 'rgba(255,255,255,0.7)');
		sheets.addColorStop(1, 'rgba(196,190,170,0.45)');
		ctx.fillStyle = sheets;
		ctx.fillRect(666, 130, 20, 48);
		ctx.strokeStyle = 'rgba(58,39,27,0.3)';
		ctx.lineWidth = 1.1;
		for (const t of [0.3, 0.55, 0.8]) {
			ctx.beginPath();
			ctx.moveTo(668 + 4 * t, 174);
			ctx.lineTo(672 + 4 * t, 133);
			ctx.stroke();
		}
		ctx.restore();
	}

	shape(ctx, BOTTLE_GREEN, GLASS_GREEN, 2);
	shape(ctx, BOTTLE_BLUE, GLASS_BLUE, 2);
	if (shaded) {
		// Glass shoulders and label bands.
		for (const [path, x, y, w, h, label] of [
			[BOTTLE_GREEN, 619, 131, 25, 44, 157],
			[BOTTLE_BLUE, 645, 138, 21, 37, 160]
		] as const) {
			ctx.save();
			ctx.clip(new Path2D(path));
			const glass = ctx.createLinearGradient(x, y, x + w, y + h);
			glass.addColorStop(0, 'rgba(255,255,255,0.4)');
			glass.addColorStop(0.5, 'rgba(255,255,255,0.04)');
			glass.addColorStop(1, 'rgba(0,0,0,0.28)');
			ctx.fillStyle = glass;
			ctx.fillRect(x, y, w, h);
			ctx.fillStyle = CREAM;
			ctx.globalAlpha = 0.9;
			ctx.fillRect(x, label, w, 6);
			ctx.restore();
		}
		line(ctx, 622, 152, 622, 170, 'rgba(255,255,255,0.55)', 1.6);
		line(ctx, 648, 155, 648, 170, 'rgba(255,255,255,0.5)', 1.4);
	}

	// Hopper flanks, straps and the recycling roundel.
	ctx.save();
	ctx.clip(new Path2D(HOPPER_SHELL));
	for (const rx of [600, 646]) {
		rect(ctx, rx, 199, 7, 73, GREEN_DARK, 1, 1.6);
		if (shaded) line(ctx, rx + 1.8, 203, rx + 1.8, 270, 'rgba(255,255,255,0.26)', 1.2);
	}
	recycleBadge(ctx, 626, 228, 14, 'paper');
	ctx.restore();

	// Rear lamps, plate and the tailgate pivot post.
	rect(ctx, 666, 196, 12, 16, RED, 2, 1.8);
	rect(ctx, 666, 218, 12, 10, AMBER, 2, 1.5);
	rect(ctx, 646, 254, 32, 12, CREAM, 1, 1.7);
	ctx.fillStyle = BLUE_DEEP;
	ctx.fillRect(650, 258, 24, 3);
	rect(ctx, 684, 198, 6, 68, STEEL, 2, 1.8);
	if (shaded) line(ctx, 686.5, 202, 686.5, 262, 'rgba(255,255,255,0.34)', 1.4);

	if (fitted) {
		// Hinge blocks down the tailgate post.
		for (const hy of [206, 232, 258]) {
			rect(ctx, 678, hy, 12, 6, STEEL, 2, 1.3);
		}
		rect(ctx, 682, 240, 3, 12, CHROME, 1, 1.1);
	}

	if (finish) {
		// Paint grain on the green flanks, under the load.
		ctx.save();
		ctx.clip(new Path2D(HOPPER_SHELL));
		let seed = 37;
		const rnd = (): number => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = '#F4F9EE';
		for (let i = 0; i < 90; i++) {
			const px = 596 + rnd() * 92;
			const py = 186 + rnd() * 82;
			const size = 1 + rnd() * 1.2;
			ctx.globalAlpha = 0.1 + rnd() * 0.1;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#1B2A14';
		for (let i = 0; i < 70; i++) {
			const px = 596 + rnd() * 92;
			const py = 186 + rnd() * 82;
			const size = 1 + rnd() * 1.2;
			ctx.globalAlpha = 0.1 + rnd() * 0.08;
			ctx.fillRect(px, py, size, size);
		}
		ctx.restore();

		// A cool sheen down the flank and small glints on the load.
		ctx.save();
		ctx.clip(new Path2D(HOPPER_SHELL));
		const sheen = ctx.createLinearGradient(596, 188, 680, 282);
		sheen.addColorStop(0, 'rgba(255,255,255,0.2)');
		sheen.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		sheen.addColorStop(1, 'rgba(0,0,0,0.18)');
		ctx.fillStyle = sheen;
		ctx.fillRect(590, 183, 100, 99);
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(595, 174.6);
		ctx.lineTo(688, 174.6);
		ctx.stroke();
		line(ctx, 632, 136, 632, 146, 'rgba(255,255,255,0.55)', 1.6);
		line(ctx, 656, 148, 656, 156, 'rgba(255,255,255,0.5)', 1.4);
	}
}

/** Picture-book finishing marks: chips on the paint, marks on the working parts. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[266, 274, 7, 2, 0.3],
		[352, 233, 6, 2, 0.26],
		[462, 262, 8, 2, 0.24],
		[452, 272, 6, 2, 0.28]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	// Road grime under the hopper and behind the rear wheel.
	ctx.save();
	ctx.globalAlpha = 0.14;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(612, 279, 30, 3.2, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// Rivet line down the bulkhead post.
	ctx.fillStyle = 'rgba(255,246,228,0.72)';
	for (const ry of [86, 118, 150, 182, 214, 246]) {
		ctx.beginPath();
		ctx.arc(233.5, ry, 1.9, 0, Math.PI * 2);
		ctx.fill();
	}

	// Warm badge catchlight and roof highlight.
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(511, 110, 26, Math.PI * 1.12, Math.PI * 1.44);
	ctx.stroke();
	line(ctx, 250, 63, 470, 62.4, 'rgba(255,255,255,0.28)', 2);
	line(ctx, 90, 111.5, 196, 111.5, 'rgba(255,255,255,0.4)', 1.8);
}

export function drawRealRecyclingTruckLevel(
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
		ctx.ellipse(350, 298, 328, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// One silhouette: cab-over nose, cab roof, tall divided body and square tail.
	shape(ctx, MAIN, BLUE);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(MAIN));
		const paint = ctx.createLinearGradient(0, 62, 0, 282);
		paint.addColorStop(0, 'rgba(255,255,255,0.28)');
		paint.addColorStop(0.38, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(10,32,46,0.3)');
		ctx.fillStyle = paint;
		ctx.fillRect(0, 62, 700, 220);
		ctx.restore();
	}

	// Green livery: roof cap, cab brow and the lower band.
	ctx.save();
	ctx.clip(new Path2D(MAIN));
	ctx.fillStyle = GREEN;
	ctx.fillRect(242, 62, 362, 15);
	ctx.fillRect(60, 110, 166, 8);
	ctx.fillRect(234, 232, 366, 26);
	if (shaded) {
		const cap = ctx.createLinearGradient(0, 62, 0, 77);
		cap.addColorStop(0, 'rgba(255,255,255,0.3)');
		cap.addColorStop(1, 'rgba(0,0,0,0.16)');
		ctx.fillStyle = cap;
		ctx.fillRect(242, 62, 362, 15);
		ctx.fillRect(60, 110, 166, 8);

		const band = ctx.createLinearGradient(0, 232, 0, 258);
		band.addColorStop(0, 'rgba(255,255,255,0.16)');
		band.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		band.addColorStop(1, 'rgba(0,0,0,0.22)');
		ctx.fillStyle = band;
		ctx.fillRect(234, 232, 366, 26);
	}
	ctx.restore();

	line(ctx, 244, 77.5, 602, 77.5, 'rgba(58,39,27,0.35)', 1.6);
	line(ctx, 62, 118.5, 224, 118.5, 'rgba(58,39,27,0.28)', 1.5);
	line(ctx, 236, 232, 598, 232, 'rgba(58,39,27,0.32)', 1.6);
	line(ctx, 236, 258, 598, 258, 'rgba(58,39,27,0.3)', 1.6);

	// Bulkhead post behind the cab.
	ctx.save();
	ctx.clip(new Path2D(MAIN));
	rect(ctx, 226, 62, 16, 220, BLUE_DARK, 2, 2.4);
	line(ctx, 229, 68, 229, 276, 'rgba(255,255,255,0.2)', 3);
	line(ctx, 238, 68, 238, 276, 'rgba(0,0,0,0.22)', 2);
	ctx.restore();

	// Full-height divider and rear corner post.
	for (const rx of [386, 564]) {
		rect(ctx, rx, 62, 16, 220, BLUE_DARK, 1.5, 2.4);
		if (shaded) {
			line(ctx, rx + 3.5, 68, rx + 3.5, 276, 'rgba(255,255,255,0.22)', 3);
			line(ctx, rx + 12, 68, rx + 12, 276, 'rgba(0,0,0,0.26)', 2);
		}
		if (fitted) {
			for (const by of [88, 170, 252]) circle(ctx, rx + 8, by, 2, CHROME, 1.1);
		}
	}
	shape(ctx, SPINE, BLUE_DARK, 2.2);
	line(ctx, 380, 54.5, 420, 54.5, 'rgba(255,255,255,0.26)', 1.6);

	// Two side hatches for the two sorted bays.
	sideHatch(ctx, HATCH_F, shaded, fitted);
	sideHatch(ctx, HATCH_R, shaded, fitted);

	// Recycling roundels: paper in the front bay, glass in the rear bay.
	recycleBadge(ctx, 313, 110, 24, 'paper');
	recycleBadge(ctx, 511, 110, 24, 'bottle');

	// Chassis rail, toolbox and fuel tank along the sill.
	rect(ctx, 52, 272, 548, 10, STEEL, 0, 2.2);
	line(ctx, 56, 274, 598, 274, 'rgba(255,255,255,0.28)', 1.6);
	rect(ctx, 256, 258, 64, 14, BLUE_DARK, 2, 2);
	line(ctx, 260, 260.5, 316, 260.5, 'rgba(255,255,255,0.22)', 1.4);
	rect(ctx, 332, 259, 56, 13, CHROME, 6, 2.2);
	line(ctx, 340, 261.5, 380, 261.5, 'rgba(255,255,255,0.55)', 1.8);
	if (fitted) {
		line(ctx, 348, 261, 348, 271, STEEL, 2.2);
		line(ctx, 372, 261, 372, 271, STEEL, 2.2);
		rect(ctx, 268, 264, 18, 4, CHROME, 2, 1.4);
		rect(ctx, 288, 264, 10, 4, STEEL, 1, 1.2);
	}

	// Cab door, kick panel and step.
	rect(ctx, 130, 204, 88, 62, BLUE, 3, 2.4);
	line(ctx, 134, 213, 214, 213, 'rgba(58,39,27,0.2)', 1.6);
	rect(ctx, 136, 246, 76, 12, BLUE_DARK, 2, 1.8);
	if (fitted) {
		rect(ctx, 202, 218, 12, 4, CHROME, 2, 1.5);
		rect(ctx, 132, 220, 4, 12, STEEL, 1.5, 1.4);
		line(ctx, 150, 228, 150, 244, 'rgba(58,39,27,0.26)', 2);
		rect(ctx, 208, 262, 16, 6, CHROME, 2, 1.6);
		rect(ctx, 208, 270, 16, 4, STEEL, 1.5, 1.4);
	}

	// Nose: seam down the front corner, headlamp and indicator.
	line(ctx, 46, 160, 46, 206, 'rgba(58,39,27,0.26)', 1.6);
	circle(ctx, 52, 220, 8, CHROME, 2);
	circle(ctx, 52, 220, 6.6, LAMP, 1.6);
	circle(ctx, 50.6, 218.6, 2.6, CREAM, 1);
	rect(ctx, 45, 238, 11, 6, AMBER, 2, 1.5);

	// Front bumper and plate.
	shape(ctx, BUMPER, CHROME, 2.6);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(BUMPER));
		const bumper = ctx.createLinearGradient(24, 248, 40, 282);
		bumper.addColorStop(0, 'rgba(255,255,255,0.5)');
		bumper.addColorStop(1, 'rgba(70,80,94,0.3)');
		ctx.fillStyle = bumper;
		ctx.fillRect(20, 246, 22, 38);
		ctx.restore();
	}
	rect(ctx, 26, 264, 12, 9, CREAM, 1, 1.6);
	ctx.fillStyle = BLUE_DEEP;
	ctx.fillRect(28, 267, 8, 3);
	if (fitted) {
		line(ctx, 25, 252, 39, 252, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 32, 254, 32, 262, 'rgba(58,39,27,0.3)', 1.6);
	}

	// Mudflaps and the rear step.
	shape(ctx, FLAP_F, BLUE_DEEP, 2);
	shape(ctx, FLAP_R, BLUE_DEEP, 2);
	shape(ctx, STEP_R, STEEL, 2.2);
	if (fitted) {
		line(ctx, 206, 284, 206, 288, 'rgba(255,255,255,0.24)', 1.6);
		line(ctx, 580, 284, 580, 288, 'rgba(255,255,255,0.24)', 1.6);
		for (let sx = 664; sx < 692; sx += 8) {
			line(ctx, sx, 283.5, sx, 288.5, 'rgba(0,0,0,0.35)', 1.4);
		}
	}

	// Beacon on the cab roof, and the exhaust stack behind it.
	shape(ctx, BEACON, AMBER, 2);
	rect(ctx, 166, 103, 32, 7, BLUE_DARK, 1.5, 1.8);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(BEACON));
		const lens = ctx.createLinearGradient(168, 92, 194, 104);
		lens.addColorStop(0, 'rgba(255,255,255,0.72)');
		lens.addColorStop(0.5, 'rgba(255,255,255,0.1)');
		lens.addColorStop(1, 'rgba(160,90,0,0.28)');
		ctx.fillStyle = lens;
		ctx.fillRect(164, 90, 36, 16);
		ctx.restore();
	}
	shape(ctx, STACK, STEEL, 2.2);
	line(ctx, 206.5, 80, 206.5, 108, 'rgba(255,255,255,0.36)', 1.8);
	rect(ctx, 202, 76, 16, 5, CHROME, 1, 1.5);
	if (fitted) {
		rect(ctx, 204, 74, 12, 3, INK, 1, 1.2);
		circle(ctx, 182, 103, 2, CHROME, 1);
	}

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 50, 118, 76, 88);
		glassShade(ctx, SIDE_WINDOW, 128, 114, 90, 86);
		line(ctx, 82, 136, 62, 166, 'rgba(255,255,255,0.55)', 3);
		line(ctx, 150, 120, 176, 150, 'rgba(255,255,255,0.32)', 2.4);
	}
	if (fitted) {
		// Wipers over the windscreen foot.
		line(ctx, 58, 200, 72, 186, INK, 2.2);
		line(ctx, 78, 202, 92, 188, INK, 2);
		line(ctx, 125, 116, 125, 198, 'rgba(58,39,27,0.35)', 1.8);
		// Mirror arm reaching forward off the A-pillar.
		line(ctx, 34, 138, 44, 142, STEEL, 3);
		line(ctx, 22, 130, 26, 152, 'rgba(255,255,255,0.55)', 1.4);
		// Roof marker lamps on the cab brow.
		for (let lens = 0; lens < 3; lens++) {
			rect(ctx, 112 + lens * 24, 112, 12, 5, AMBER, 1.5, 1.2);
		}
	}

	// Mirror head and its chrome mount.
	shape(ctx, MIRROR, GLASS, 2.2);
	line(ctx, 23, 132, 31, 136, 'rgba(255,255,255,0.6)', 1.4);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(MIRROR));
		ctx.fillStyle = 'rgba(80,160,205,0.3)';
		ctx.fillRect(18, 148, 18, 12);
		ctx.restore();
	}

	// Side marker lamps along the livery band.
	if (fitted) {
		for (const mx of [250, 328, 406, 484]) {
			rect(ctx, mx, 240, 13, 7, AMBER, 1.5, 1.3);
		}
	}

	// Wheel wells and green arches, then the one wheel piece used twice.
	wheelWell(ctx, WHEEL_L.x, shaded);
	wheelWell(ctx, WHEEL_R.x, shaded);

	// Tail: the hopper and its sorted load, over the body and the rear arch.
	tailHopper(ctx, shaded, fitted, finish);

	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (finish) {
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	if (lit) {
		// Rim light along the cab roof, the body roof and the hopper rim.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(86, 110.6);
		ctx.lineTo(222, 110.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(244, 62.6);
		ctx.lineTo(600, 62.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(594, 174.6);
		ctx.lineTo(688, 174.6);
		ctx.stroke();

		// Headlight glow.
		const glow = ctx.createRadialGradient(52, 220, 1, 52, 220, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.62)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(52, 220, 26, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 293, 26, 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		bodySheen(ctx);
		loadSheen(ctx);

		// Glass sparkle and paint glints, clear of the tyre circles.
		line(ctx, 80, 138, 104, 172, 'rgba(255,255,255,0.5)', 2.6);
		line(ctx, 90, 134, 114, 168, 'rgba(255,255,255,0.28)', 1.8);

		glint(ctx, 300, 146, 4.6);
		glint(ctx, 360, 210, 4);
		glint(ctx, 470, 196, 4.4);
		glint(ctx, 540, 140, 4);
		glint(ctx, 640, 250, 3);
		glint(ctx, 654, 236, 2.6);
		glint(ctx, 48, 190, 3.2);
		glint(ctx, 160, 236, 3);
		glint(ctx, 676, 152, 2.4);

		// Beacon glow.
		const beacon = ctx.createRadialGradient(182, 98, 1, 182, 98, 22);
		beacon.addColorStop(0, 'rgba(255,196,60,0.7)');
		beacon.addColorStop(1, 'rgba(255,196,60,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(182, 98, 22, 0, Math.PI * 2);
		ctx.fill();

		// Exhaust puff from the stack.
		ctx.save();
		ctx.fillStyle = '#C9D2DE';
		for (const [px, py, pr, alpha] of [
			[211, 72, 5.4, 0.46],
			[217, 64, 4.2, 0.34],
			[210, 56, 3.2, 0.24]
		] as const) {
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealRecyclingTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealRecyclingTruckLevel(ctx, x, y, scale, 5);
}
