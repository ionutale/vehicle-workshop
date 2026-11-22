/**
 * Rear-loading refuse truck art, cut into the same five-piece kit as the other realistic
 * vehicles. A compact cab-over cab facing left, a high compactor body with a crowned roof
 * and full-height ribs, a rear hopper with a loading mouth and a bin-lift mast, a wheelie
 * bin hanging off the tail, plus a beacon, mirrors, steps and mudguards.
 *
 * The hopper, bin and lift are baked into the body piece: they are the cue that names the
 * vehicle, so they survive at level 1. Level 5 is the production target: shaded, fully
 * fitted, lit and finished with paint grain, hopper and bin sheen, glints, hub hardware
 * and small working marks.
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

/** Art box 760 x 330, road at 272. Front (cab) faces left. */
const MAIN =
	'M30,250 L30,150 Q30,136 38,128 L70,88 Q76,80 88,80 L196,80 L196,68 Q196,58 206,58 L250,56 Q455,38 640,54 L656,56 Q670,58 676,70 L682,80 L700,92 Q704,95 704,106 L704,250 Z';

/** The hopper slab at the tail, cut off the shell with a seam at x=640. */
const HOPPER =
	'M640,54 L656,56 Q670,58 676,70 L682,80 L700,92 Q704,95 704,106 L704,250 L640,250 Z';

/** The loading mouth: a dark recessed slot under the hopper lip. */
const MOUTH = 'M672,88 L696,98 Q701,100 701,107 L701,146 L672,138 Z';

const WINDSCREEN =
	'M36,164 L36,138 Q36,128 44,122 L58,102 Q64,92 76,92 L102,92 Q110,92 110,100 L110,156 Q110,164 102,164 Z';
const SIDE_WINDOW =
	'M124,94 L180,94 Q188,94 188,102 L188,150 Q188,158 180,158 L124,158 Q116,158 116,150 L116,102 Q116,94 124,94 Z';

const DOOR = { x: 124, y: 172, w: 66, h: 72 };

const MIRROR = 'M18,96 L30,96 L30,126 L18,126 Z';
const BEACON = 'M140,80 L140,74 L150,74 Q150,60 160,60 Q170,60 170,74 L180,74 L180,80 Z';
const BUMPER_F = 'M16,230 L30,230 L30,260 L16,260 Z';
const STEP = 'M112,250 L188,250 L188,262 L112,262 Z';
const MUDFLAP_F = 'M190,250 L206,250 L206,268 L190,268 Z';
const MUDFLAP_R = 'M642,250 L658,250 L658,268 L642,268 Z';
const BIN_LID = 'M704,160 L752,160 L752,168 L704,168 Z';
const BIN_BODY =
	'M708,168 L748,168 L744,226 Q744,232 738,232 L718,232 Q712,232 712,226 Z';
const REAR_BUMPER = 'M696,250 L724,250 L724,264 L696,264 Z';

/** Body cut-out: shell plus every fitting that stands outside it. Wheel circles never. */
const BODY_MASK = [
	MAIN,
	BEACON,
	MIRROR,
	BUMPER_F,
	STEP,
	MUDFLAP_F,
	MUDFLAP_R,
	BIN_LID,
	BIN_BODY,
	REAR_BUMPER
].join(' ');

const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 600, y: 236, r: 36 };
const ARCH = 46;

const RIB_X = [302, 360, 418, 476, 534, 592];

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
	ctx.arc(wx, 240, radius, Math.PI, Math.PI * 2);
	ctx.lineTo(wx + radius, 250);
	ctx.lineTo(wx - radius, 250);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, 240 - radius, 0, 250);
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

/**
 * Glass, navy panels, the hopper, the bin and the tyres carry no paint grain, so the
 * speckle stays on the teal paint and the cut-outs keep the glass and dark panels clean.
 */
const GRAIN_CUTOUTS = [
	WINDSCREEN,
	SIDE_WINDOW,
	'M196,34 L642,34 L642,68 L196,68 Z',
	'M196,196 L642,196 L642,228 L196,228 Z',
	HOPPER,
	MOUTH,
	BIN_LID,
	BIN_BODY,
	BEACON,
	circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r),
	circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)
];

/** Paint grain and long brush sweeps, clipped to the painted panels only. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(MAIN);
	for (const cut of GRAIN_CUTOUTS) panels.addPath(new Path2D(cut));
	ctx.clip(panels, 'evenodd');
	let seed = 61;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 360; i++) {
		const px = 24 + rnd() * 700;
		const py = 50 + rnd() * 194;
		const size = 1.5 + rnd() * 1.6;
		ctx.globalAlpha = 0.08 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 110; i++) {
		const px = 24 + rnd() * 700;
		const py = 50 + rnd() * 194;
		const size = 1.3 + rnd() * 1.1;
		ctx.globalAlpha = 0.16 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Long, faint brush sweeps across the cab and compactor panels.
	ctx.globalAlpha = 0.09;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[44, 182, 186, 180],
		[220, 118, 330, 116],
		[352, 158, 460, 157],
		[496, 122, 622, 119],
		[650, 148, 700, 146]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Polished hopper: a soft diagonal sheen plus a lit lip and rear edge. */
function hopperSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(HOPPER));
	const sheen = ctx.createLinearGradient(640, 60, 704, 250);
	sheen.addColorStop(0, 'rgba(255,255,255,0.24)');
	sheen.addColorStop(0.38, 'rgba(255,255,255,0.03)');
	sheen.addColorStop(1, 'rgba(0,0,0,0.2)');
	ctx.fillStyle = sheen;
	ctx.fillRect(638, 52, 70, 200);

	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(642, 56.5);
	ctx.lineTo(656, 58.5);
	ctx.quadraticCurveTo(672, 60, 679, 73);
	ctx.quadraticCurveTo(684, 82, 699, 93);
	ctx.stroke();

	line(ctx, 701.4, 108, 701.4, 246, 'rgba(255,255,255,0.22)', 2);
	line(ctx, 641, 62, 641, 248, 'rgba(255,255,255,0.12)', 2);
	ctx.restore();
}

/** The wheelie bin reads as moulded plastic: a front sheen, lit lid and castors. */
function binSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(BIN_BODY));
	const sheen = ctx.createLinearGradient(708, 168, 748, 232);
	sheen.addColorStop(0, 'rgba(255,255,255,0.3)');
	sheen.addColorStop(0.42, 'rgba(255,255,255,0.05)');
	sheen.addColorStop(1, 'rgba(0,0,0,0.24)');
	ctx.fillStyle = sheen;
	ctx.fillRect(706, 166, 44, 70);
	line(ctx, 715.5, 174, 715.5, 228, 'rgba(255,255,255,0.3)', 2);
	ctx.restore();

	ctx.save();
	ctx.clip(new Path2D(BIN_LID));
	const lid = ctx.createLinearGradient(0, 160, 0, 168);
	lid.addColorStop(0, 'rgba(255,255,255,0.55)');
	lid.addColorStop(1, 'rgba(255,255,255,0.05)');
	ctx.fillStyle = lid;
	ctx.fillRect(702, 158, 54, 12);
	ctx.restore();

	// Castor pair under the bin body, tucked inside the body mask.
	circle(ctx, 717, 229, 2.6, '#1A333D', 1.1);
	circle(ctx, 741, 229, 2.4, '#1A333D', 1.1);
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
}

/**
 * Picture-book finishing marks: rivets down the bulkhead post, chrome sheen on the step
 * and bumper, paint chips along the working edge and a dust smudge on the bin lid.
 */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// Rivet line down the body front wall, above the step.
	ctx.fillStyle = 'rgba(255,246,228,0.78)';
	for (const ry of [84, 110, 136, 162, 188, 214, 240]) {
		ctx.beginPath();
		ctx.arc(203.5, ry, 1.9, 0, Math.PI * 2);
		ctx.fill();
	}

	// Chrome sheen: step rungs, front bumper lip and rear step nose.
	line(ctx, 210, 203.5, 246, 203.5, 'rgba(255,255,255,0.6)', 1.8);
	line(ctx, 210, 221.5, 246, 221.5, 'rgba(255,255,255,0.45)', 1.6);
	line(ctx, 17.5, 231.5, 29, 231.5, 'rgba(255,255,255,0.7)', 1.6);
	line(ctx, 698, 252.5, 722, 252.5, 'rgba(255,255,255,0.55)', 1.5);

	// Mast carriage sheen and the lift arm catchlights.
	line(ctx, 670.5, 216, 683.5, 216, 'rgba(255,255,255,0.7)', 1.6);
	line(ctx, 684, 168, 700, 180, 'rgba(255,255,255,0.55)', 1.6);
	line(ctx, 684, 201, 699, 204, 'rgba(255,255,255,0.45)', 1.5);

	// Paint chips along the lower working edge, all inside the shell.
	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[226, 246, 9, 2.2, 0.42],
		[322, 246, 7, 2, 0.34],
		[438, 247, 10, 2, 0.3],
		[556, 246, 6, 2, 0.36],
		[626, 246, 8, 2.2, 0.3]
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
	ctx.ellipse(730, 164, 9, 3.2, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	line(ctx, 726, 178, 724, 208, 'rgba(58,39,27,0.28)', 2.4);

	// Warm badge catchlight.
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(395, 150, 24, Math.PI * 1.12, Math.PI * 1.44);
	ctx.stroke();

	// Long roof highlight on the compactor crown and the cab roof.
	line(ctx, 210, 60, 400, 50, 'rgba(255,255,255,0.28)', 2);
	line(ctx, 96, 81.5, 190, 81.5, 'rgba(255,255,255,0.4)', 1.8);
}

/** The roundel on the body side: three arrows in a ring, read as a refuse badge. */
function badge(ctx: CanvasRenderingContext2D): void {
	circle(ctx, 395, 150, 22, CREAM, 2.4);
	circle(ctx, 395, 150, 18, NAVY, 1.6);
	ctx.strokeStyle = TEAL;
	ctx.lineWidth = 3.4;
	for (let i = 0; i < 3; i++) {
		const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
		ctx.beginPath();
		ctx.arc(395, 150, 10.5, a + 0.22, a + 1.62);
		ctx.stroke();
		const tip = a + 1.7;
		ctx.beginPath();
		ctx.moveTo(395 + Math.cos(tip) * 13.6, 150 + Math.sin(tip) * 13.6);
		ctx.lineTo(395 + Math.cos(tip) * 7.4, 150 + Math.sin(tip) * 7.4);
		ctx.stroke();
	}
	circle(ctx, 395, 150, 3, CREAM, 1.2);
}

export function drawRealGarbageTruckLevel(
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
		ctx.ellipse(386, 277, 344, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// One silhouette: cab, crowned compactor body and the sloping hopper tail.
	shape(ctx, MAIN, TEAL);

	// Hopper slab at the tail, darker than the body paint.
	shape(ctx, HOPPER, NAVY, 2.6);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(HOPPER));
		const tail = ctx.createLinearGradient(640, 60, 640, 250);
		tail.addColorStop(0, 'rgba(255,255,255,0.18)');
		tail.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		tail.addColorStop(1, 'rgba(0,0,0,0.28)');
		ctx.fillStyle = tail;
		ctx.fillRect(638, 50, 70, 202);
		ctx.restore();
	}

	// Roof cap and the low livery band, both cut to the shell so the crown reads.
	ctx.save();
	ctx.clip(new Path2D(MAIN));
	ctx.fillStyle = NAVY;
	ctx.fillRect(196, 34, 446, 34);
	if (shaded) {
		const cap = ctx.createLinearGradient(0, 40, 0, 68);
		cap.addColorStop(0, 'rgba(255,255,255,0.22)');
		cap.addColorStop(1, 'rgba(0,0,0,0.14)');
		ctx.fillStyle = cap;
		ctx.fillRect(196, 34, 446, 34);
	}
	ctx.fillStyle = NAVY;
	ctx.fillRect(196, 196, 446, 32);
	if (shaded) {
		const band = ctx.createLinearGradient(0, 196, 0, 228);
		band.addColorStop(0, 'rgba(0,0,0,0.12)');
		band.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		band.addColorStop(1, 'rgba(0,0,0,0.16)');
		ctx.fillStyle = band;
		ctx.fillRect(196, 196, 446, 32);
	}
	ctx.restore();
	line(ctx, 210, 196, 638, 196, CHROME, 1.6);
	line(ctx, 210, 228, 638, 228, 'rgba(0,0,0,0.28)', 2);

	// Bulkhead post behind the cab: the body front wall stands above the cab roof.
	ctx.save();
	ctx.clip(new Path2D(MAIN));
	rect(ctx, 196, 58, 15, 190, TEAL_DARK, 2, 2.4);
	line(ctx, 199, 64, 199, 244, 'rgba(255,255,255,0.2)', 3);
	ctx.restore();

	// Full-height ribs down the compactor side.
	for (const rx of RIB_X) {
		rect(ctx, rx, 68, 13, 176, TEAL_DARK, 2, 1.8);
		if (shaded) {
			line(ctx, rx + 3, 74, rx + 3, 240, 'rgba(255,255,255,0.24)', 3);
			line(ctx, rx + 10, 74, rx + 10, 240, 'rgba(0,0,0,0.28)', 2);
		}
	}

	// Roof hatch and vent on the compactor crown.
	if (fitted) {
		ctx.save();
		ctx.clip(new Path2D(MAIN));
		rect(ctx, 374, 47, 74, 13, NAVY_LIGHT, 3, 2);
		rect(ctx, 386, 50, 50, 7, NAVY_DARK, 2, 1.4);
		ctx.restore();
		line(ctx, 378, 61, 444, 59, 'rgba(255,255,255,0.26)', 2);
		circle(ctx, 382, 53, 2.2, CHROME, 1.2);
		circle(ctx, 440, 52, 2.2, CHROME, 1.2);
	}

	// Cab door, kept as a clean rectangle for its own piece.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, TEAL, 3, 2.6);
	line(ctx, DOOR.x + 2, 180, DOOR.x + DOOR.w - 2, 180, 'rgba(58,39,27,0.2)', 1.6);
	rect(ctx, DOOR.x + 4, DOOR.y + 54, DOOR.w - 8, 14, TEAL_DARK, 2, 2);

	// Loading mouth, sweep blade and the bin-lift mast on the hopper.
	shape(ctx, MOUTH, '#16262C', 2.4);
	ctx.save();
	ctx.clip(new Path2D(MOUTH));
	const depth = ctx.createLinearGradient(0, 86, 0, 146);
	depth.addColorStop(0, NAVY_LIGHT);
	depth.addColorStop(0.45, '#213239');
	depth.addColorStop(1, '#0E1A1F');
	ctx.fillStyle = depth;
	ctx.fillRect(670, 86, 34, 62);
	ctx.restore();
	line(ctx, 673, 89.5, 697, 99.5, CHROME, 2);
	line(ctx, 673, 137, 700, 145, 'rgba(0,0,0,0.45)', 3);

	// Bin-lift mast, carriage and two arms reaching back to the bin.
	rect(ctx, 674, 152, 9, 80, NAVY_DARK, 2, 2.2);
	line(ctx, 677, 158, 677, 226, TEAL_LIGHT, 2.4);
	line(ctx, 680, 166, 698, 179, INK, 13);
	line(ctx, 680, 166, 698, 179, STEEL, 9);
	line(ctx, 680, 200, 698, 203, INK, 12);
	line(ctx, 680, 200, 698, 203, STEEL, 8);
	if (fitted) {
		line(ctx, 683, 168, 701, 181, 'rgba(255,255,255,0.5)', 2);
		line(ctx, 683, 202, 701, 207, 'rgba(255,255,255,0.38)', 1.8);
		rect(ctx, 668, 214, 18, 12, CHROME, 2, 1.8);
		line(ctx, 662, 226, 675, 232, INK, 2.2);
		// Hydraulic hose looping off the mast base.
		line(ctx, 674, 228, 664, 234, INK, 2.4);
		line(ctx, 664, 234, 664, 246, INK, 2.2);
	}

	// The wheelie bin on the lift arms: the cue, drawn flat from level 1.
	shape(ctx, BIN_LID, TEAL_LIGHT, 2.2);
	shape(ctx, BIN_BODY, NAVY_DARK, 2.2);
	if (fitted) {
		line(ctx, 718, 174, 718, 228, 'rgba(255,255,255,0.2)', 2);
		line(ctx, 744, 174, 742, 226, 'rgba(0,0,0,0.35)', 2);
		rect(ctx, 722, 160, 16, 5, CHROME, 2, 1.4);
		rect(ctx, 710, 172, 6, 12, STEEL, 2, 1.4);
		line(ctx, 715, 196, 741, 196, CREAM, 2.6);
		line(ctx, 715, 184, 738, 184, 'rgba(255,255,255,0.3)', 2);
	}

	// Chassis frame, toolbox and fuel tank between the wheels.
	rect(ctx, 198, 238, 446, 12, NAVY_DARK, 0, 2);
	line(ctx, 200, 238.8, 642, 238.8, STEEL, 1.8);
	rect(ctx, 300, 230, 66, 17, NAVY, 3, 2);
	rect(ctx, 430, 231, 74, 15, CHROME, 7, 2.2);
	line(ctx, 440, 234, 494, 234, 'rgba(255,255,255,0.55)', 2);
	if (fitted) {
		line(ctx, 452, 236, 452, 244, STEEL, 2.6);
		line(ctx, 482, 236, 482, 244, STEEL, 2.6);
		rect(ctx, 322, 234, 22, 4, CHROME, 2, 1.4);
	}

	// Front bumper, grille, lamps.
	rect(ctx, 16, 230, 14, 30, CHROME, 4, 2.6);
	if (fitted) {
		rect(ctx, 18, 236, 10, 9, NAVY, 2, 1.6);
		line(ctx, 18, 232.5, 28, 232.5, 'rgba(255,255,255,0.7)', 1.6);
		for (let bar = 0; bar < 4; bar++) {
			line(ctx, 33, 172 + bar * 7, 44, 172 + bar * 7, CHROME, 2);
		}
		rect(ctx, 30, 202, 16, 13, LAMP, 3, 2.2);
		rect(ctx, 33, 205, 9, 6, CREAM, 2, 1.2);
		rect(ctx, 30, 220, 12, 7, AMBER, 2, 1.6);
		rect(ctx, 34, 244, 26, 9, CREAM, 1, 1.8);
		ctx.fillStyle = NAVY;
		ctx.fillRect(38, 247, 18, 3);
	}

	// Door hardware, side steps and mirror.
	if (fitted) {
		rect(ctx, 176, 196, 10, 4, CHROME, 2, 1.5);
		rect(ctx, 127, 176, 4, 12, STEEL, 1.5, 1.4);
		line(ctx, 150, 186, 150, 196, 'rgba(58,39,27,0.28)', 2);
		// Two-rung side step up the body flank behind the cab.
		rect(ctx, 208, 200, 40, 7, CHROME, 2, 1.8);
		rect(ctx, 208, 218, 40, 7, CHROME, 2, 1.8);
		rect(ctx, 204, 196, 5, 34, STEEL, 1.5, 1.6);
		rect(ctx, 247, 196, 5, 34, STEEL, 1.5, 1.6);
		rect(ctx, 18, 96, 12, 30, CHROME, 3, 2.2);
		line(ctx, 20, 101, 28, 101, 'rgba(255,255,255,0.65)', 1.5);
		rect(ctx, 140, 74, 40, 7, NAVY, 2, 2);
		shape(ctx, 'M150,74 Q150,60 160,60 Q170,60 170,74 Z', AMBER, 2.2);
		circle(ctx, 160, 69, 4.5, LAMP, 1.2);
	}

	// Shaded paint pass, cut to the shell.
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(MAIN));
		const paint = ctx.createLinearGradient(0, 44, 0, 250);
		paint.addColorStop(0, 'rgba(255,255,255,0.26)');
		paint.addColorStop(0.4, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(0,38,34,0.28)');
		ctx.fillStyle = paint;
		ctx.fillRect(0, 44, 760, 208);
		ctx.restore();
	}

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 36, 92, 76, 72);
		glassShade(ctx, SIDE_WINDOW, 116, 94, 72, 64);
		line(ctx, 58, 108, 44, 136, 'rgba(255,255,255,0.55)', 3);
	}
	if (fitted) {
		line(ctx, 46, 160, 62, 146, INK, 2.2);
		line(ctx, 68, 162, 82, 150, INK, 2);
		line(ctx, 111, 96, 110, 156, 'rgba(58,39,27,0.35)', 2);
		// Mirror stalk, drawn over the A-pillar edge.
		line(ctx, 30, 106, 44, 114, STEEL, 2.6);
		line(ctx, 30, 122, 44, 128, STEEL, 2.2);
	}

	// Badge on the compactor side.
	if (fitted) {
		badge(ctx);
	}

	// Wheel wells and flares over the paint, then the one wheel piece used twice.
	wheelWell(ctx, WHEEL_L.x, ARCH, shaded);
	wheelWell(ctx, WHEEL_R.x, ARCH, shaded);

	if (fitted) {
		ctx.strokeStyle = TEAL_DARK;
		ctx.lineWidth = 7;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wx, 240, ARCH + 3, Math.PI * 1.02, Math.PI * 1.98);
			ctx.stroke();
		}
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.8;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wx, 240, ARCH + 6, Math.PI * 1.03, Math.PI * 1.97);
			ctx.stroke();
		}
		line(ctx, WHEEL_L.x - 40, 210, WHEEL_L.x - 26, 204, 'rgba(255,255,255,0.4)', 3);
	}

	// Mudflaps and the rear step sit on top of the arches.
	rect(ctx, 190, 250, 16, 18, NAVY, 2, 2);
	rect(ctx, 642, 250, 16, 18, NAVY, 2, 2);
	rect(ctx, 112, 250, 76, 12, STEEL, 2, 2);
	if (fitted) {
		line(ctx, 194, 254, 194, 266, NAVY_LIGHT, 2);
		line(ctx, 646, 254, 646, 266, NAVY_LIGHT, 2);
		for (let sx = 120; sx < 184; sx += 12) {
			line(ctx, sx, 252, sx, 259, 'rgba(0,0,0,0.35)', 1.6);
		}
	}

	// Rear step bumper under the hopper, with a dark treading plate.
	rect(ctx, 696, 250, 28, 14, CHROME, 3, 2.4);
	if (fitted) {
		rect(ctx, 700, 253, 20, 8, NAVY, 2, 1.6);
		rect(ctx, 701, 254, 7, 6, RED, 1.4, 1.2);
		rect(ctx, 712, 254, 7, 6, AMBER, 1.4, 1.2);
		rect(ctx, 688, 230, 12, 18, RED, 2, 1.8);
		rect(ctx, 691, 233, 6, 12, CREAM, 1, 1.1);
	}

	// Side marker lamps on the livery band.
	if (fitted) {
		for (const mx of [258, 372, 466, 530]) {
			rect(ctx, mx, 214, 14, 7, AMBER, 1.5, 1.4);
		}
	}

	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (finish) {
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	if (lit) {
		// Rim light along the crowned roof and the cab roof.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(96, 80.5);
		ctx.lineTo(194, 80.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(212, 57);
		ctx.quadraticCurveTo(455, 39, 640, 55);
		ctx.stroke();

		// Headlight glow.
		const glow = ctx.createRadialGradient(38, 208, 1, 38, 208, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.62)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(38, 208, 28, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 272, 32, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		hopperSheen(ctx);
		binSheen(ctx);

		// Glass: a sparkle down the door pane, clear of the wiper and the pillar.
		line(ctx, 140, 112, 168, 142, 'rgba(255,255,255,0.5)', 2.6);
		line(ctx, 150, 110, 178, 140, 'rgba(255,255,255,0.28)', 1.8);

		glint(ctx, 336, 104, 5);
		glint(ctx, 512, 168, 4.2);
		glint(ctx, 450, 122, 4.6);
		glint(ctx, 290, 162, 4);
		glint(ctx, 692, 222, 3.6);
		glint(ctx, 730, 164, 2.8);
		glint(ctx, 58, 128, 3.4);

		// Beacon glow on the cab roof.
		const beacon = ctx.createRadialGradient(160, 66, 1, 160, 66, 22);
		beacon.addColorStop(0, 'rgba(255,196,60,0.7)');
		beacon.addColorStop(1, 'rgba(255,196,60,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(160, 66, 22, 0, Math.PI * 2);
		ctx.fill();

		finishingMarks(ctx);
	}
	ctx.restore();
}

export function drawRealGarbageTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealGarbageTruckLevel(ctx, x, y, scale, 5);
}
