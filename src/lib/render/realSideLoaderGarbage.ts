/**
 * Side-loading refuse truck art, cut into the same five-piece kit as the other realistic
 * vehicles. A compact cab-over cab facing left, a tall compactor body with a crowned roof
 * and full-height ribs, a side-loading lifting arm on the flank gripping a wheelie bin —
 * the cue that names the vehicle — plus a rear hopper with a chevron tail, a beacon,
 * mirrors, steps and mudguards.
 *
 * The arm and the bin are baked into the drawn scene and read flat from level 1. Level 5 is
 * the production target: shaded, fully fitted, lit and finished with paint grain, hopper and
 * bin sheen, glints, hub hardware and small working marks.
 *
 * Art box 720 x 340, road at 300. Front (cab) faces left; the wheels sit at (170, 268) and
 * (560, 268) with a 32px radius.
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

const TEAL = '#2A9D8F';
const TEAL_DARK = '#1E7A70';
const TEAL_DEEP = '#155C55';
const TEAL_LIGHT = '#3FB8A8';
const NAVY = '#264653';
const NAVY_DARK = '#1A333D';
const NAVY_LIGHT = '#35606E';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** The one silhouette: cab-over cab, crowned compactor body and the raised tail bay. */
const MAIN =
	'M32,272 L32,158 Q32,144 40,136 L62,116 Q68,108 82,108 L174,108 Q182,108 182,100 L182,96 Q182,88 194,88 L634,84 L646,62 Q650,58 660,58 L690,58 Q702,58 702,70 L702,272 Z';

/** The raised hopper bay at the tail, cut off the shell with a seam at x=634. */
const HOPPER =
	'M634,84 L646,62 Q650,58 660,58 L690,58 Q702,58 702,70 L702,272 L634,272 Z';

/** The loading mouth: a dark recessed aperture under the hopper lip. */
const MOUTH = 'M662,88 L694,96 Q698,98 698,104 L698,152 L662,144 Z';

const WINDSCREEN =
	'M38,202 L38,166 Q38,156 44,148 L58,130 Q64,122 76,122 L98,122 Q106,122 106,130 L106,194 Q106,202 98,202 Z';
const SIDE_WINDOW =
	'M118,124 L166,124 Q174,124 174,132 L174,184 Q174,192 166,192 L118,192 Q110,192 110,184 L110,132 Q110,124 118,124 Z';

const DOOR = { x: 110, y: 196, w: 62, h: 56 };

const BEACON = 'M118,108 L118,100 L128,100 Q128,84 140,84 Q152,84 152,100 L158,100 L158,108 Z';
const MIRROR = 'M14,118 L28,118 L28,150 L14,150 Z';
const BUMPER_F = 'M16,244 L32,244 L32,272 L16,272 Z';
const STEP = 'M96,272 L158,272 L158,284 L96,284 Z';
const MUDFLAP_F = 'M196,272 L212,272 L212,292 L196,292 Z';
const MUDFLAP_R = 'M586,272 L602,272 L602,292 L586,292 Z';

/** Wheelie bin: separate lid and body subpaths, both disjoint from the glass. */
const BIN_LID =
	'M296,219 L352,219 L352,231 Q352,234 349,234 L299,234 Q296,234 296,231 Z';
const BIN_BODY =
	'M299,234 L349,234 L345,284 Q345,290 339,290 L334,290 L334,300 L327,300 L327,290 L321,290 L321,300 L314,300 L314,290 L309,290 Q303,290 303,284 Z';

/** Body cut-out: the shell plus every fitting that stands outside it. Wheel circles never. */
const BODY_MASK = [MAIN, BEACON, MIRROR, BUMPER_F, STEP, MUDFLAP_F, MUDFLAP_R].join(' ');

const WHEEL_L = { x: 170, y: 268, r: 32 };
const WHEEL_R = { x: 560, y: 268, r: 32 };
const ARCH = 40;

const RIB_X = [238, 292, 346, 400, 496, 544];

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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.6, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.62)');
	glass.addColorStop(0.44, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(80,160,205,0.32)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Recessed wheel well, drawn under the tyre. */
function wheelWell(
	ctx: CanvasRenderingContext2D,
	wx: number,
	radius: number,
	shaded: boolean
): void {
	ctx.beginPath();
	ctx.arc(wx, WHEEL_L.y, radius, Math.PI, Math.PI * 2);
	ctx.lineTo(wx + radius, 272);
	ctx.lineTo(wx - radius, 272);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, WHEEL_L.y - radius, 0, 272);
		well.addColorStop(0, '#0F1D21');
		well.addColorStop(1, NAVY_LIGHT);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = TEAL_DEEP;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke();
}

/** Hazard chevrons, clipped to the tail panel. Livery, so they read from level 1. */
function hazardBand(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	shaded: boolean
): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();
	ctx.fillStyle = CREAM;
	ctx.fillRect(x, y, w, h);
	ctx.fillStyle = RED;
	for (let sx = x - h - 24; sx < x + w + h; sx += 24) {
		ctx.beginPath();
		ctx.moveTo(sx, y + h);
		ctx.lineTo(sx + 12, y + h);
		ctx.lineTo(sx + 12 + h, y);
		ctx.lineTo(sx + h, y);
		ctx.closePath();
		ctx.fill();
	}
	if (shaded) {
		const shade = ctx.createLinearGradient(0, y, 0, y + h);
		shade.addColorStop(0, 'rgba(255,255,255,0.2)');
		shade.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		shade.addColorStop(1, 'rgba(0,0,0,0.22)');
		ctx.fillStyle = shade;
		ctx.fillRect(x, y, w, h);
	}
	ctx.restore();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.strokeRect(x, y, w, h);
}

/**
 * Glass, navy panels, the hopper, the chevrons and the tyres carry no paint grain, so the
 * speckle stays on the teal paint.
 */
const GRAIN_CUTOUTS = [
	WINDSCREEN,
	SIDE_WINDOW,
	'M194,60 L636,60 L636,104 L194,104 Z',
	'M194,220 L634,220 L634,250 L194,250 Z',
	HOPPER,
	MOUTH,
	'M646,190 L698,190 L698,244 L646,244 Z',
	BEACON,
	BIN_LID,
	BIN_BODY,
	circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r),
	circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)
];

/** Paint grain and long brush sweeps, clipped to the painted panels only. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(MAIN);
	for (const cut of GRAIN_CUTOUTS) panels.addPath(new Path2D(cut));
	ctx.clip(panels, 'evenodd');
	let seed = 37;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 340; i++) {
		const px = 26 + rnd() * 660;
		const py = 84 + rnd() * 182;
		const size = 1.5 + rnd() * 1.6;
		ctx.globalAlpha = 0.08 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 96; i++) {
		const px = 26 + rnd() * 660;
		const py = 84 + rnd() * 182;
		const size = 1.3 + rnd() * 1.1;
		ctx.globalAlpha = 0.16 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Long, faint brush sweeps across the cab and compactor panels.
	ctx.globalAlpha = 0.09;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[44, 190, 168, 188],
		[212, 124, 330, 122],
		[352, 158, 452, 157],
		[470, 116, 552, 114],
		[566, 168, 596, 166]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/**
 * Painted body gloss: a broad daylight gleam down the compactor flank and a softer
 * shoulder reflection on the cab. Both stay on the teal paint, clear of glass, panels,
 * the hopper, the bin and the tyres.
 */
function bodySheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(MAIN);
	for (const cut of GRAIN_CUTOUTS) panels.addPath(new Path2D(cut));
	ctx.clip(panels, 'evenodd');

	const flank = ctx.createLinearGradient(210, 96, 632, 268);
	flank.addColorStop(0, 'rgba(255,255,255,0)');
	flank.addColorStop(0.28, 'rgba(255,255,255,0.13)');
	flank.addColorStop(0.52, 'rgba(255,255,255,0.03)');
	flank.addColorStop(1, 'rgba(0,38,34,0.12)');
	ctx.fillStyle = flank;
	ctx.fillRect(194, 84, 440, 190);

	// A broad raked gleam across the ribs, soft-edged so it reads as daylight, not a scuff.
	const gleam = ctx.createLinearGradient(300, 100, 376, 280);
	gleam.addColorStop(0, 'rgba(255,255,255,0)');
	gleam.addColorStop(0.3, 'rgba(255,255,255,0)');
	gleam.addColorStop(0.4, 'rgba(255,255,255,0.1)');
	gleam.addColorStop(0.5, 'rgba(255,255,255,0.14)');
	gleam.addColorStop(0.6, 'rgba(255,255,255,0.04)');
	gleam.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gleam;
	ctx.fillRect(194, 84, 440, 190);

	// Cab shoulder gloss under the glass line.
	const cab = ctx.createLinearGradient(34, 112, 178, 206);
	cab.addColorStop(0, 'rgba(255,255,255,0.16)');
	cab.addColorStop(0.42, 'rgba(255,255,255,0.02)');
	cab.addColorStop(1, 'rgba(0,38,34,0.1)');
	ctx.fillStyle = cab;
	ctx.fillRect(32, 108, 152, 100);
	ctx.restore();
}

/** Polished hopper bay: a soft diagonal sheen plus a lit lip and rear edge. */
function hopperSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(HOPPER));
	const sheen = ctx.createLinearGradient(634, 62, 702, 272);
	sheen.addColorStop(0, 'rgba(255,255,255,0.22)');
	sheen.addColorStop(0.38, 'rgba(255,255,255,0.03)');
	sheen.addColorStop(1, 'rgba(0,0,0,0.2)');
	ctx.fillStyle = sheen;
	ctx.fillRect(632, 56, 72, 220);

	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(636, 84.5);
	ctx.lineTo(647, 63);
	ctx.quadraticCurveTo(651, 60, 661, 60);
	ctx.stroke();

	line(ctx, 700.4, 76, 700.4, 266, 'rgba(255,255,255,0.2)', 2);
	line(ctx, 636, 90, 636, 266, 'rgba(255,255,255,0.1)', 2);
	ctx.restore();
}

/** The wheelie bin reads as moulded plastic: a front sheen, lit lid and castors. */
function binSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(BIN_BODY));
	const sheen = ctx.createLinearGradient(299, 234, 345, 300);
	sheen.addColorStop(0, 'rgba(255,255,255,0.3)');
	sheen.addColorStop(0.42, 'rgba(255,255,255,0.05)');
	sheen.addColorStop(1, 'rgba(0,0,0,0.26)');
	ctx.fillStyle = sheen;
	ctx.fillRect(297, 232, 56, 72);
	line(ctx, 308.5, 240, 306, 288, 'rgba(255,255,255,0.28)', 2);
	ctx.restore();

	ctx.save();
	ctx.clip(new Path2D(BIN_LID));
	const lid = ctx.createLinearGradient(0, 219, 0, 234);
	lid.addColorStop(0, 'rgba(255,255,255,0.55)');
	lid.addColorStop(1, 'rgba(255,255,255,0.05)');
	ctx.fillStyle = lid;
	ctx.fillRect(294, 217, 60, 20);
	ctx.restore();

	// Castor pair under the bin body.
	circle(ctx, 317.5, 293, 2.6, '#1A333D', 1.1);
	circle(ctx, 330.5, 293, 2.4, '#1A333D', 1.1);
}

/** A four-point paint glint. */
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
	ctx.arc(x, y, 2.1, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: bright rim, six bolts and a pale cap. The pattern is mirror
 * symmetric, so the flipped right wheel matches.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.47, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.4, CHROME, 1.2);
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
}

/** The roundel on the compactor side: three arrows in a ring, read as a refuse badge. */
function badge(ctx: CanvasRenderingContext2D): void {
	circle(ctx, 452, 158, 20, CREAM, 2.4);
	circle(ctx, 452, 158, 16, NAVY, 1.6);
	ctx.strokeStyle = TEAL;
	ctx.lineWidth = 3;
	for (let i = 0; i < 3; i++) {
		const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
		ctx.beginPath();
		ctx.arc(452, 158, 9.4, a + 0.22, a + 1.62);
		ctx.stroke();
		const tip = a + 1.7;
		ctx.beginPath();
		ctx.moveTo(452 + Math.cos(tip) * 12.2, 158 + Math.sin(tip) * 12.2);
		ctx.lineTo(452 + Math.cos(tip) * 6.6, 158 + Math.sin(tip) * 6.6);
		ctx.stroke();
	}
	circle(ctx, 452, 158, 2.8, CREAM, 1.2);
}

/**
 * Picture-book finishing marks: rivets down the bulkhead post, chrome sheen on the step,
 * bumper and boom, paint chips along the working edge and a dust smudge on the bin lid.
 */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	ctx.fillStyle = 'rgba(255,246,228,0.78)';
	for (const ry of [112, 138, 164, 190, 216, 242]) {
		ctx.beginPath();
		ctx.arc(203.5, ry, 1.9, 0, Math.PI * 2);
		ctx.fill();
	}

	line(ctx, 100, 274.5, 154, 274.5, 'rgba(255,255,255,0.55)', 1.8);
	line(ctx, 19, 246, 30, 246, 'rgba(255,255,255,0.7)', 1.6);
	line(ctx, 355, 208, 362, 208, 'rgba(255,255,255,0.6)', 1.5);

	// Paint chips along the lower working edge, all inside the shell.
	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[224, 252, 9, 2.2, 0.4],
		[316, 252, 7, 2, 0.32],
		[420, 253, 10, 2, 0.28],
		[512, 252, 6, 2, 0.34],
		[572, 253, 8, 2.2, 0.28]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	// Road dust smudge on the bin lid and a scuff down the bin flank.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(324, 226, 9, 3, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	line(ctx, 341, 240, 338, 284, 'rgba(58,39,27,0.26)', 2.2);

	line(ctx, 96, 109.5, 170, 109.5, 'rgba(255,255,255,0.4)', 1.8);
}

export function drawRealSideLoaderGarbageLevel(
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
		ctx.ellipse(360, 306, 340, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// One silhouette: cab, crowned compactor body and the raised hopper tail.
	shape(ctx, MAIN, TEAL);

	// Beacon on the cab roof: navy plinth, amber dome, lit lens once fitted.
	rect(ctx, 118, 100, 40, 8, NAVY, 2, 2.2);
	shape(ctx, 'M128,100 Q128,84 140,84 Q152,84 152,100 Z', AMBER, 2.2);
	if (fitted) {
		circle(ctx, 140, 93, 4.5, LAMP, 1.2);
		line(ctx, 124, 102, 152, 102, 'rgba(255,255,255,0.4)', 1.6);
	}

	// Hopper bay at the tail, darker than the body paint.
	shape(ctx, HOPPER, NAVY, 2.6);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(HOPPER));
		const tail = ctx.createLinearGradient(634, 62, 634, 272);
		tail.addColorStop(0, 'rgba(255,255,255,0.18)');
		tail.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		tail.addColorStop(1, 'rgba(0,0,0,0.3)');
		ctx.fillStyle = tail;
		ctx.fillRect(632, 56, 72, 220);
		ctx.restore();
	}

	// Roof cap and the livery band, both cut to the shell so the crown reads.
	ctx.save();
	ctx.clip(new Path2D(MAIN));
	ctx.fillStyle = NAVY;
	ctx.fillRect(194, 56, 442, 48);
	if (shaded) {
		const cap = ctx.createLinearGradient(0, 80, 0, 104);
		cap.addColorStop(0, 'rgba(255,255,255,0.22)');
		cap.addColorStop(1, 'rgba(0,0,0,0.14)');
		ctx.fillStyle = cap;
		ctx.fillRect(194, 56, 442, 48);
	}
	ctx.fillStyle = NAVY;
	ctx.fillRect(194, 220, 440, 30);
	if (shaded) {
		const band = ctx.createLinearGradient(0, 220, 0, 250);
		band.addColorStop(0, 'rgba(0,0,0,0.12)');
		band.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		band.addColorStop(1, 'rgba(0,0,0,0.16)');
		ctx.fillStyle = band;
		ctx.fillRect(194, 220, 440, 30);
	}
	ctx.restore();
	line(ctx, 206, 220, 632, 220, CHROME, 1.6);
	line(ctx, 206, 250, 632, 250, 'rgba(0,0,0,0.28)', 2);

	// Bulkhead post behind the cab: the body front wall stands above the cab roof.
	ctx.save();
	ctx.clip(new Path2D(MAIN));
	rect(ctx, 194, 94, 16, 178, TEAL_DARK, 2, 2.4);
	line(ctx, 197, 100, 197, 266, 'rgba(255,255,255,0.2)', 3);
	ctx.restore();

	// Full-height ribs down the compactor side.
	for (const rx of RIB_X) {
		rect(ctx, rx, 104, 13, 116, TEAL_DARK, 2, 1.8);
		if (shaded) {
			line(ctx, rx + 3, 110, rx + 3, 216, 'rgba(255,255,255,0.24)', 3);
			line(ctx, rx + 10, 110, rx + 10, 216, 'rgba(0,0,0,0.28)', 2);
		}
	}

	// Cab door, kept as a clean rectangle: the body piece carries it.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, TEAL, 3, 2.6);
	line(ctx, DOOR.x + 2, 204, DOOR.x + DOOR.w - 2, 204, 'rgba(58,39,27,0.2)', 1.6);
	rect(ctx, DOOR.x + 4, DOOR.y + 38, DOOR.w - 8, 12, TEAL_DARK, 2, 2);

	// Loading mouth at the tail.
	shape(ctx, MOUTH, '#16262C', 2.4);
	ctx.save();
	ctx.clip(new Path2D(MOUTH));
	const depth = ctx.createLinearGradient(0, 86, 0, 152);
	depth.addColorStop(0, '#1E333A');
	depth.addColorStop(0.5, '#132229');
	depth.addColorStop(1, '#0A1215');
	ctx.fillStyle = depth;
	ctx.fillRect(660, 86, 40, 68);
	ctx.restore();
	line(ctx, 663, 89.5, 693, 97.5, CHROME, 2);
	line(ctx, 663, 143, 696, 151, 'rgba(0,0,0,0.45)', 3);
	if (fitted) {
		// Rake bars across the aperture.
		for (let i = 0; i < 3; i++) {
			line(ctx, 668 + i * 10, 96, 668 + i * 10, 148, 'rgba(92,100,114,0.5)', 2.2);
		}
		rect(ctx, 680, 84, 16, 6, STEEL, 2, 1.6);
	}

	// Hazard chevrons on the tail panel: livery, so they read from level 1.
	hazardBand(ctx, 646, 190, 52, 54, shaded);

	// Side-loading arm on the flank: bracket, boom and the grabber over the bin lid.
	rect(ctx, 352, 102, 30, 44, NAVY_DARK, 3, 2.4);
	circle(ctx, 366, 124, 8, CHROME, 2.4);
	line(ctx, 366, 126, 330, 146, INK, 16);
	line(ctx, 366, 126, 330, 146, STEEL, 12);
	line(ctx, 372, 132, 338, 150, 'rgba(255,255,255,0.34)', 2.4);
	circle(ctx, 330, 148, 6, CHROME, 2);
	line(ctx, 330, 148, 322, 210, INK, 14);
	line(ctx, 330, 148, 322, 210, STEEL, 10);
	// Grabber head clamped over the lid.
	rect(ctx, 304, 204, 34, 10, CHROME, 3, 2.2);
	rect(ctx, 304, 212, 8, 12, CHROME, 2, 1.8);
	rect(ctx, 330, 212, 8, 12, CHROME, 2, 1.8);
	if (fitted) {
		line(ctx, 358, 108, 376, 108, 'rgba(255,255,255,0.4)', 2);
		rect(ctx, 356, 132, 18, 6, STEEL, 1.5, 1.5);
		line(ctx, 326, 154, 326, 206, 'rgba(255,255,255,0.35)', 2);
		line(ctx, 334, 156, 334, 206, 'rgba(0,0,0,0.18)', 1.6);
		line(ctx, 306, 210, 306, 224, 'rgba(0,0,0,0.3)', 1.6);
		line(ctx, 336, 210, 336, 224, 'rgba(0,0,0,0.3)', 1.6);
		// Two mounting bolts on the bracket.
		circle(ctx, 366, 110, 2.4, CHROME, 1.2);
		circle(ctx, 376, 138, 2.4, CHROME, 1.2);
	}

	// Chassis frame, toolbox and fuel tank between the wheels.
	rect(ctx, 206, 256, 424, 14, NAVY_DARK, 0, 2);
	line(ctx, 208, 256.8, 628, 256.8, STEEL, 1.8);
	rect(ctx, 218, 246, 62, 16, NAVY, 3, 2);
	rect(ctx, 372, 247, 70, 14, CHROME, 7, 2.2);
	line(ctx, 382, 250, 432, 250, 'rgba(255,255,255,0.55)', 2);
	if (fitted) {
		line(ctx, 396, 252, 396, 260, STEEL, 2.6);
		line(ctx, 420, 252, 420, 260, STEEL, 2.6);
		rect(ctx, 228, 250, 22, 4, CHROME, 2, 1.4);
	}

	// Shaded paint pass, cut to the shell.
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(MAIN));
		const paint = ctx.createLinearGradient(0, 84, 0, 272);
		paint.addColorStop(0, 'rgba(255,255,255,0.26)');
		paint.addColorStop(0.4, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(0,38,34,0.28)');
		ctx.fillStyle = paint;
		ctx.fillRect(0, 84, 720, 190);
		ctx.restore();
	}

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 38, 122, 68, 80);
		glassShade(ctx, SIDE_WINDOW, 110, 124, 64, 68);
		line(ctx, 60, 138, 46, 168, 'rgba(255,255,255,0.55)', 3);
	}
	if (fitted) {
		line(ctx, 48, 190, 64, 176, INK, 2.2);
		line(ctx, 70, 192, 84, 180, INK, 2);
		line(ctx, 111, 126, 110, 190, 'rgba(58,39,27,0.35)', 2);
		// Mirror stalk, drawn over the A-pillar edge.
		line(ctx, 28, 128, 40, 136, STEEL, 2.6);
		line(ctx, 28, 142, 40, 148, STEEL, 2.2);
	}

	// Badge on the compactor side.
	if (fitted) {
		badge(ctx);
	}

	// Wheel wells and flares over the paint.
	wheelWell(ctx, WHEEL_L.x, ARCH, shaded);
	wheelWell(ctx, WHEEL_R.x, ARCH, shaded);

	if (fitted) {
		ctx.strokeStyle = TEAL_DARK;
		ctx.lineWidth = 7;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wx, WHEEL_L.y, ARCH + 3, Math.PI * 1.02, Math.PI * 1.98);
			ctx.stroke();
		}
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.8;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wx, WHEEL_L.y, ARCH + 6, Math.PI * 1.03, Math.PI * 1.97);
			ctx.stroke();
		}
		line(ctx, WHEEL_L.x - 34, 238, WHEEL_L.x - 22, 232, 'rgba(255,255,255,0.4)', 3);
	}

	// Mudflaps and the cab step sit on top of the arches.
	rect(ctx, 196, 272, 16, 20, NAVY, 2, 2);
	rect(ctx, 586, 272, 16, 20, NAVY, 2, 2);
	rect(ctx, 96, 272, 62, 12, STEEL, 2, 2);
	if (fitted) {
		line(ctx, 200, 276, 200, 288, NAVY_LIGHT, 2);
		line(ctx, 590, 276, 590, 288, NAVY_LIGHT, 2);
		for (let sx = 102; sx < 154; sx += 12) {
			line(ctx, sx, 274, sx, 281, 'rgba(0,0,0,0.35)', 1.6);
		}
	}

	// Front bumper, grille, lamps.
	rect(ctx, 16, 244, 16, 28, CHROME, 4, 2.6);
	if (fitted) {
		rect(ctx, 18, 248, 12, 9, NAVY, 2, 1.6);
		line(ctx, 18, 246.5, 30, 246.5, 'rgba(255,255,255,0.7)', 1.6);
		for (let bar = 0; bar < 4; bar++) {
			line(ctx, 33, 206 + bar * 6, 46, 206 + bar * 6, CHROME, 2);
		}
		rect(ctx, 30, 228, 18, 13, LAMP, 3, 2.2);
		rect(ctx, 33, 231, 10, 6, CREAM, 2, 1.2);
		rect(ctx, 30, 242, 14, 6, AMBER, 2, 1.6);
		rect(ctx, 34, 262, 28, 8, CREAM, 1, 1.8);
		ctx.fillStyle = NAVY;
		ctx.fillRect(38, 265, 20, 3);
	}

	// Door hardware.
	if (fitted) {
		rect(ctx, 158, 208, 10, 4, CHROME, 2, 1.5);
		rect(ctx, 114, 200, 4, 12, STEEL, 1.5, 1.4);
		line(ctx, 136, 210, 136, 220, 'rgba(58,39,27,0.28)', 2);
		rect(ctx, 16, 118, 12, 32, CHROME, 3, 2.2);
		line(ctx, 18, 123, 26, 123, 'rgba(255,255,255,0.65)', 1.5);
	}

	// Side marker lamps on the livery band.
	if (fitted) {
		for (const mx of [220, 318, 480, 566]) {
			rect(ctx, mx, 236, 14, 7, AMBER, 1.5, 1.4);
		}
	}

	// The wheelie bin beside the flank: the cue, drawn flat from level 1.
	shape(ctx, BIN_LID, TEAL_LIGHT, 2.2);
	shape(ctx, BIN_BODY, NAVY_DARK, 2.2);
	line(ctx, 303.5, 240, 306.5, 284, 'rgba(255,255,255,0.3)', 2.2);
	if (fitted) {
		line(ctx, 306, 240, 304, 286, 'rgba(255,255,255,0.2)', 2);
		line(ctx, 343, 240, 340, 284, 'rgba(0,0,0,0.35)', 2);
		rect(ctx, 316, 224, 18, 5, CHROME, 2, 1.4);
		rect(ctx, 301, 238, 6, 12, STEEL, 2, 1.4);
		line(ctx, 306, 258, 343, 258, 'rgba(255,255,255,0.28)', 2);
		line(ctx, 306, 272, 342, 272, 'rgba(0,0,0,0.22)', 1.8);
	}

	// One wheel piece used twice: front-left and rear-right, bottoms on the road.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (finish) {
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	if (lit) {
		// Rim light along the cab roof, the body crown and the hopper lip.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(84, 108.5);
		ctx.lineTo(172, 108.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(206, 87);
		ctx.quadraticCurveTo(420, 85, 632, 86);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(648, 62);
		ctx.lineTo(688, 59.5);
		ctx.stroke();

		// Headlight glow.
		const glow = ctx.createRadialGradient(39, 234, 1, 39, 234, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.62)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(39, 234, 26, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 300, 30, 4.5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 0.14;
		ctx.beginPath();
		ctx.ellipse(324, 300, 26, 4, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		bodySheen(ctx);
		hopperSheen(ctx);
		binSheen(ctx);

		// Glass: a sparkle down the door pane, clear of the wiper and the pillar.
		line(ctx, 126, 138, 152, 168, 'rgba(255,255,255,0.5)', 2.6);
		line(ctx, 136, 136, 160, 164, 'rgba(255,255,255,0.28)', 1.8);

		glint(ctx, 300, 112, 4.6);
		glint(ctx, 444, 148, 4.2);
		glint(ctx, 520, 176, 4.2);
		glint(ctx, 246, 168, 4);
		glint(ctx, 660, 214, 3.6);
		glint(ctx, 326, 250, 3);
		glint(ctx, 60, 156, 3.4);

		// Beacon glow on the cab roof.
		const beacon = ctx.createRadialGradient(140, 92, 1, 140, 92, 20);
		beacon.addColorStop(0, 'rgba(255,196,60,0.7)');
		beacon.addColorStop(1, 'rgba(255,196,60,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(140, 92, 20, 0, Math.PI * 2);
		ctx.fill();

		finishingMarks(ctx);

		// Exhaust puff drifting up off the rear skirt, overlapping so it reads as one cloud.
		ctx.save();
		ctx.fillStyle = 'rgba(58,39,27,1)';
		for (const [puffX, puffY, puffR, alpha] of [
			[697, 286, 5, 0.22],
			[704, 280, 6, 0.15],
			[712, 274, 4.4, 0.09]
		] as const) {
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc(puffX, puffY, puffR, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealSideLoaderGarbage(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealSideLoaderGarbageLevel(ctx, x, y, scale, 5);
}
