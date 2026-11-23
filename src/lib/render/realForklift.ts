/**
 * Forklift art, cut into the same five-piece kit as the rest of the realistic fleet.
 * Front faces left: a compact chassis, a charcoal counterweight over the rear wheel, an
 * overhead guard with a windscreen, a mast with rails, chain and lift ram, and the
 * pallet-fork carriage that names the machine. Small wheels, roof beacon and work lamps.
 * Level 5 is the production target: shaded, fitted, lit and picture-book finished with
 * paint grain, mast and fork sheen, cage and counterweight highlights, glints and hubs.
 */

import {
	CHROME,
	GLASS,
	INK,
	STEEL,
	TIRE,
	circle,
	circleMask,
	line,
	rect,
	shape,
	wheel
} from './realKit';

const ORANGE = '#F4A261';
const CHARCOAL = '#2B2D42';
const CHARCOAL_DARK = '#1D1F30';
const CHARCOAL_LIGHT = '#3D405B';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** Art box 640 x 340, road at 272. The mast and forks are at the front (left). */
const BODY =
	'M196,252 L196,204 Q196,196 204,194 L214,194 L214,150 Q214,142 222,142 L252,142 L252,172 L330,172 L330,124 Q330,118 338,118 L354,118 Q362,118 362,124 L362,148 L456,148 L456,140 L528,140 Q536,140 536,146 L536,252 L516,252 L516,236 A36,36 0 0 0 444,236 L444,252 Z';

/** Two-stage mast, rising above the guard and clear of the front wheel's top. */
const MAST = 'M96,202 L96,50 Q96,44 102,44 L142,44 Q148,44 148,50 L148,202 Z';

/** Front frame bracket between the mast and the shell. */
const MOUNT = 'M148,204 L148,190 L182,190 L182,204 Z';
const FRAME = 'M182,204 L196,204 L196,252 L182,252 Z';

const CANOPY = 'M200,80 L200,62 Q200,56 206,56 L446,56 Q452,56 452,62 L452,80 Z';
const POST_F = 'M252,80 L264,80 L264,172 L252,172 Z';
const POST_R = 'M420,80 L434,80 L434,148 L420,148 Z';
const BEACON = 'M372,56 L372,48 Q372,42 380,42 L396,42 Q404,42 404,48 L404,56 Z';

/** Exhaust stub on the counterweight, with the picture-book puff above it. */
const STACK = 'M468,140 L468,112 L480,112 L480,140 Z';
const PUFF = 'M464,112 Q462,98 474,94 Q484,82 498,88 Q508,94 504,104 Q510,108 504,112 Z';

/** Raked windscreen hung between the canopy and the dash. */
const WINDSCREEN = 'M214,80 L252,80 L252,142 L226,142 Z';

/** Pallet-forks carriage: the shank hung on the mast and the blade reaching forward. */
const CARRIAGE = 'M74,182 L96,182 L96,252 L74,252 Z';
const BLADE = 'M28,236 L74,236 L74,248 L28,248 Z';

const BODY_MASK = [
	BODY,
	MAST,
	MOUNT,
	FRAME,
	CANOPY,
	POST_F,
	POST_R,
	BEACON,
	STACK,
	PUFF
].join(' ');
const GLASS_MASK = WINDSCREEN;

const WHEEL_L = { x: 150, y: 236, r: 32 };
const WHEEL_R = { x: 480, y: 236, r: 32 };

/** Arch radius of the counterweight's wheel opening; 4px clear of the tyre. */
const ARCH_R = 36;

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
	glass.addColorStop(0, 'rgba(255,255,255,0.58)');
	glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.24)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** A four-point sparkle: soft halo, long cross, short diagonals and a warm core. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.save();
	const halo = ctx.createRadialGradient(x, y, 0.4, x, y, size * 2.4);
	halo.addColorStop(0, 'rgba(255,255,255,0.32)');
	halo.addColorStop(0.45, 'rgba(255,255,255,0.1)');
	halo.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = halo;
	ctx.beginPath();
	ctx.arc(x, y, size * 2.4, 0, Math.PI * 2);
	ctx.fill();

	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
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
	ctx.restore();
}

/**
 * Picture-book hub: sidewall shoulder gloss, a bright machined rim, six bolt heads with
 * specular pips, the dish shadow and a polished centre cap with a valve stem. Every mark
 * is mirrored about the hub's vertical axis, so the flipped rear wheel reads identically.
 */
function wheelFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Shoulder gloss on both upper sidewalls, clear of the tread notches.
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 2.4;
	for (const [from, to] of [
		[Math.PI * 1.08, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.92]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.86, from, to);
		ctx.stroke();
	}

	// Machined rim ring.
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	// Six bolts, each with a specular pip on its upper shoulder.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.5, CHROME, 1.2);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx, by - 0.9, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	// Dish shadow under the cap, then the polished cap itself.
	ctx.strokeStyle = 'rgba(58,39,27,0.26)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.44, 0.18 * Math.PI, 0.82 * Math.PI);
	ctx.stroke();
	circle(ctx, x, y, r * 0.16, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.9)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.12, Math.PI * 1.06, Math.PI * 1.6);
	ctx.stroke();
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x, y - 0.9, 0.9, 0, Math.PI * 2);
	ctx.fill();

	// Bright inner rim arcs and the valve stem on the top centreline.
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.6;
	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.94]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.62, from, to);
		ctx.stroke();
	}
	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x, y - r * 0.58, 0.9, 0, Math.PI * 2);
	ctx.fill();
	line(ctx, x, y - r * 0.53, x, y - r * 0.64, CHROME, 2);
}

/** Fender lip inside the counterweight arch, so the tyre reads as tucked in. */
function archLip(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	ctx.strokeStyle = 'rgba(0,0,0,0.3)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(WHEEL_R.x, WHEEL_R.y, ARCH_R + 1.4, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();

	if (shaded) {
		ctx.strokeStyle = 'rgba(255,255,255,0.2)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(WHEEL_R.x, WHEEL_R.y, ARCH_R + 3.4, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
}

/** Paint grain over solid paint only: glazing and tyres are punched out of the clip. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	// Restrict to the body first: even-odd alone would also keep the standalone wheel
	// circles (inside the keep-out subpaths but outside the shell) and tint the tyres.
	ctx.clip(new Path2D(BODY_MASK));
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');

	// Warm wash: sun on the hood, dust and shade low on the counterweight.
	const wash = ctx.createLinearGradient(196, 142, 536, 252);
	wash.addColorStop(0, 'rgba(255,255,255,0.06)');
	wash.addColorStop(0.48, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.08)');
	ctx.fillStyle = wash;
	ctx.fillRect(94, 40, 448, 216);

	let seed = 47;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 430; i++) {
		const px = 96 + rand() * 442;
		const py = 42 + rand() * 208;
		const size = 1.1 + rand() * 1.1;
		ctx.globalAlpha = 0.07 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 185; i++) {
		const px = 96 + rand() * 442;
		const py = 44 + rand() * 206;
		const size = 0.9 + rand() * 0.8;
		ctx.globalAlpha = 0.15 + rand() * 0.11;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 75; i++) {
		const px = 96 + rand() * 442;
		const py = 46 + rand() * 204;
		const size = 0.6 + rand() * 0.4;
		ctx.globalAlpha = 0.08 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush strokes across the hood, skirt, mast and counterweight.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[214, 204, 330, 203],
		[340, 208, 444, 207],
		[458, 190, 528, 189],
		[206, 240, 330, 239],
		[334, 170, 418, 169],
		[100, 82, 144, 81]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest, so the grain keeps a hand-made edge.
	ctx.globalAlpha = 0.16;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[220, 246, 262, 245],
		[300, 216, 340, 215],
		[408, 244, 446, 243],
		[466, 232, 512, 231],
		[520, 166, 532, 165],
		[202, 88, 246, 87],
		[108, 58, 140, 57]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Mast bright pass, laid over the grain so the rails stay the brightest steel. */
function mastSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(MAST));
	ctx.globalAlpha = 0.34;
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(112, 70);
	ctx.lineTo(112, 194);
	ctx.stroke();
	ctx.globalAlpha = 0.2;
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(106, 74);
	ctx.lineTo(106, 192);
	ctx.stroke();
	ctx.restore();

	line(ctx, 98.4, 52, 98.4, 90, 'rgba(255,255,255,0.4)', 1.2);
	glint(ctx, 104, 90, 2.6);
}

/** Cage, posts, counterweight, beacon and seat highlights. */
function machineSheen(ctx: CanvasRenderingContext2D): void {
	// Canopy roof gloss with a warm bounce under the lip.
	ctx.save();
	ctx.clip(new Path2D(CANOPY));
	const roof = ctx.createLinearGradient(0, 56, 0, 80);
	roof.addColorStop(0, 'rgba(255,255,255,0.34)');
	roof.addColorStop(0.5, 'rgba(255,255,255,0.05)');
	roof.addColorStop(1, 'rgba(0,0,0,0.14)');
	ctx.fillStyle = roof;
	ctx.fillRect(198, 54, 256, 28);
	const bounce = ctx.createLinearGradient(0, 72, 0, 80);
	bounce.addColorStop(0, 'rgba(255,246,228,0)');
	bounce.addColorStop(1, 'rgba(255,246,228,0.14)');
	ctx.fillStyle = bounce;
	ctx.fillRect(198, 72, 256, 8);
	ctx.restore();

	line(ctx, 206, 59.6, 446, 59.6, 'rgba(255,255,255,0.5)', 1.6);
	line(ctx, 206, 63, 446, 63, 'rgba(255,255,255,0.16)', 4);

	// Canopy rivets, guard rib top edge and the lamp housing bevel.
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.7;
	for (let rivetX = 214; rivetX <= 444; rivetX += 16) {
		ctx.beginPath();
		ctx.arc(rivetX, 61.6, 1.05, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
	line(ctx, 268, 60.8, 386, 60.8, 'rgba(255,255,255,0.42)', 1.1);
	line(ctx, 268, 64.6, 386, 64.6, 'rgba(0,0,0,0.2)', 1);
	line(ctx, 331, 68.4, 341, 68.4, 'rgba(255,255,255,0.4)', 1);

	// Posts: lit inner stiles and a bolt at each foot.
	line(ctx, 254.4, 84, 254.4, 168, 'rgba(255,255,255,0.5)', 1.4);
	line(ctx, 262, 84, 262, 170, 'rgba(0,0,0,0.22)', 1.2);
	line(ctx, 422.4, 84, 422.4, 146, 'rgba(255,255,255,0.42)', 1.4);
	line(ctx, 432, 84, 432, 146, 'rgba(0,0,0,0.2)', 1.2);
	circle(ctx, 258, 168, 1.5, CHROME, 1);
	circle(ctx, 427, 144, 1.5, CHROME, 1);

	// Counterweight: brushed metal, ground bounce, a lit shoulder and seam rivets.
	ctx.save();
	ctx.clip(new Path2D(BODY));
	const brushed = ctx.createLinearGradient(452, 0, 538, 0);
	brushed.addColorStop(0, 'rgba(255,255,255,0.16)');
	brushed.addColorStop(0.4, 'rgba(255,255,255,0.03)');
	brushed.addColorStop(0.74, 'rgba(0,0,0,0.04)');
	brushed.addColorStop(1, 'rgba(0,0,0,0.16)');
	ctx.fillStyle = brushed;
	ctx.fillRect(450, 128, 90, 128);
	const lower = ctx.createLinearGradient(0, 232, 0, 254);
	lower.addColorStop(0, 'rgba(255,246,228,0)');
	lower.addColorStop(1, 'rgba(255,246,228,0.08)');
	ctx.fillStyle = lower;
	ctx.fillRect(450, 232, 90, 22);
	ctx.restore();

	line(ctx, 456, 141.6, 530, 141.6, 'rgba(255,255,255,0.38)', 1.6);
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.72;
	for (let rivetY = 150; rivetY <= 236; rivetY += 14) {
		ctx.beginPath();
		ctx.arc(455.4, rivetY, 1.2, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Lit arch crown, tail-lamp lips and the rear plate gloss.
	ctx.strokeStyle = 'rgba(255,255,255,0.2)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(WHEEL_R.x, WHEEL_R.y, ARCH_R + 4.6, Math.PI * 1.24, Math.PI * 1.76);
	ctx.stroke();
	line(ctx, 521, 202.4, 529, 202.4, 'rgba(255,255,255,0.7)', 1.1);
	line(ctx, 521, 224.4, 529, 224.4, 'rgba(255,255,255,0.55)', 1.1);
	line(ctx, 461, 165.6, 481, 165.6, 'rgba(255,255,255,0.5)', 1.1);

	// Work lamp lens ring, beacon glass arc, seat piping and dash gauge pips.
	ctx.strokeStyle = 'rgba(255,255,255,0.75)';
	ctx.lineWidth = 1.1;
	ctx.beginPath();
	ctx.arc(204, 212, 4.4, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
	ctx.save();
	ctx.clip(new Path2D(BEACON));
	ctx.beginPath();
	ctx.arc(388, 50, 7, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
	ctx.restore();
	line(ctx, 292, 174, 338, 174, 'rgba(255,255,255,0.22)', 1.2);
	line(ctx, 332, 127, 360, 127, 'rgba(255,255,255,0.2)', 1.4);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	for (const [pipX, pipY] of [
		[224.8, 153.8],
		[236.8, 153.8]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** Windscreen: one raked glass streak, a fine second edge and the frame lip. */
function glassSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(GLASS_MASK));
	ctx.strokeStyle = 'rgba(255,255,255,0.62)';
	ctx.lineWidth = 3.4;
	ctx.beginPath();
	ctx.moveTo(218, 136);
	ctx.lineTo(238, 92);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.3)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(224, 138);
	ctx.lineTo(246, 102);
	ctx.stroke();
	ctx.restore();
	line(ctx, 216, 81, 250, 81, 'rgba(255,255,255,0.5)', 1.2);
	glint(ctx, 240, 112, 2.8);
}

/** Working marks: lamp sparkles, paint chips, exhaust puff and soot. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// Lamp pips: beacon, work lamp and the marker on the frame.
	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[383.4, 45.2, 1.2],
		[201.8, 209.8, 1.3],
		[203, 226.4, 0.9]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	// Exhaust puff drifting off the stack.
	ctx.save();
	ctx.clip(new Path2D(PUFF));
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = '#D5DCE5';
	for (const [px, py, pr] of [
		[472, 104, 5],
		[486, 98, 6],
		[499, 100, 4.5]
	]) {
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Working marks: chips on the fork heel, the mast foot and the counterweight.
	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[32, 246, 9, 2, 0.4],
		[52, 237.5, 7, 2, 0.34],
		[76, 250, 6, 2.2, 0.3],
		[99, 198, 8, 2, 0.36],
		[456, 236, 10, 2, 0.28],
		[530, 244, 4, 2.4, 0.38],
		[112, 190, 6, 1.8, 0.3],
		[512, 236, 5, 1.8, 0.24]
	]) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	// Soot above the exhaust stub and a last dust shadow under the counterweight.
	ctx.save();
	ctx.globalAlpha = 0.14;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(474, 111, 7, 3, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalAlpha = 0.1;
	ctx.beginPath();
	ctx.ellipse(494, 250, 34, 3.4, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/** Mast: two steel channels either side of a dark recess, chain and lift ram. */
function drawMast(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, MAST, CHARCOAL, 3);

	// Dark inner stage, with the cross braces showing between the channels.
	rect(ctx, 107, 47, 30, 152, CHARCOAL_DARK, 0, 0);
	rect(ctx, 98, 47, 9, 152, STEEL, 2, 1.6);
	rect(ctx, 137, 47, 9, 152, STEEL, 2, 1.6);
	rect(ctx, 98, 47, 48, 8, STEEL, 2, 1.4);

	for (const braceY of [70, 94, 118, 142, 166, 188]) {
		line(ctx, 107, braceY, 137, braceY, 'rgba(201,210,222,0.42)', 2);
	}

	// Lift ram gland and rod.
	rect(ctx, 117, 92, 11, 10, STEEL, 2, 1.4);
	rect(ctx, 119, 100, 7, 98, CHROME, 3, 1.4);

	// Lift chain down the machined side of the recess.
	ctx.save();
	ctx.setLineDash([4, 3]);
	line(ctx, 131, 60, 131, 194, 'rgba(201,210,222,0.75)', 2.2);
	ctx.restore();

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(MAST));
		const steel = ctx.createLinearGradient(96, 0, 148, 0);
		steel.addColorStop(0, 'rgba(255,255,255,0.22)');
		steel.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		steel.addColorStop(1, 'rgba(0,0,0,0.3)');
		ctx.fillStyle = steel;
		ctx.fillRect(94, 42, 56, 162);
		ctx.restore();

		line(ctx, 100, 60, 100, 192, 'rgba(255,255,255,0.34)', 1.4);
		line(ctx, 144, 60, 144, 192, 'rgba(0,0,0,0.24)', 1.6);
	}

	if (fitted) {
		// Top sheave, rod cap and the channel bolts.
		circle(ctx, 129, 60, 4.4, CHARCOAL_LIGHT, 1.5);
		circle(ctx, 129, 60, 1.8, CHROME, 1);
		circle(ctx, 122.5, 196, 3, STEEL, 1.2);
		for (const boltY of [62, 106, 150, 184]) {
			circle(ctx, 102.5, boltY, 1.7, CHROME, 0.9);
			circle(ctx, 141.5, boltY, 1.7, CHROME, 0.9);
		}
		// Mast tilt ram tucked against the frame side.
		line(ctx, 136, 174, 148, 200, INK, 6);
		line(ctx, 136, 174, 148, 200, CHROME, 3.4);
	}

	if (finish) {
		// Rail gloss: a soft light-to-shadow band over both machined channels.
		ctx.save();
		ctx.clip(new Path2D(MAST));
		const gloss = ctx.createLinearGradient(96, 0, 148, 0);
		gloss.addColorStop(0, 'rgba(255,255,255,0.2)');
		gloss.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		gloss.addColorStop(0.78, 'rgba(0,0,0,0.06)');
		gloss.addColorStop(1, 'rgba(0,0,0,0.22)');
		ctx.fillStyle = gloss;
		ctx.fillRect(94, 42, 56, 162);
		ctx.restore();

		// Bright leading stile, rod shaft and the shaded trailing stile.
		line(ctx, 98.4, 54, 98.4, 194, 'rgba(255,255,255,0.6)', 1.8);
		line(ctx, 101, 62, 101, 190, 'rgba(255,255,255,0.28)', 1);
		line(ctx, 121, 102, 121, 194, 'rgba(255,255,255,0.62)', 1.4);
		line(ctx, 143.4, 60, 143.4, 192, 'rgba(0,0,0,0.22)', 1.4);

		// Top cap bevel and the cross-brace tops catching the roof light.
		line(ctx, 98, 48.4, 146, 48.4, 'rgba(255,255,255,0.5)', 1.2);
		line(ctx, 99, 51.4, 145, 51.4, 'rgba(255,255,255,0.18)', 1);
		for (const braceY of [70, 94, 118, 142, 166, 188]) {
			line(ctx, 108, braceY - 0.8, 136, braceY - 0.8, 'rgba(255,255,255,0.22)', 1);
		}

		// Polished fastener heads and the sheave's top-left specular.
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		for (const boltY of [62, 106, 150, 184]) {
			for (const boltX of [102.5, 141.5]) {
				ctx.beginPath();
				ctx.arc(boltX - 0.4, boltY - 0.5, 0.7, 0, Math.PI * 2);
				ctx.fill();
			}
		}
		ctx.strokeStyle = 'rgba(255,255,255,0.8)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(129, 60, 2.8, Math.PI * 1.05, Math.PI * 1.5);
		ctx.stroke();

		glint(ctx, 103.5, 120, 2.8);
		glint(ctx, 130, 152, 2.6);
		glint(ctx, 127, 58, 2.2);
	}
}

/** Pallet forks: the hung carriage shank with its rollers, and the blade. */
function drawForks(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, CARRIAGE, STEEL, 2.5);
	rect(ctx, 77, 187, 14, 62, CHARCOAL, 2, 1.4);
	line(ctx, 84, 190, 84, 246, 'rgba(0,0,0,0.18)', 3);

	shape(ctx, BLADE, STEEL, 2.5);
	ctx.save();
	ctx.clip(new Path2D(BLADE));
	line(ctx, 28, 238.5, 74, 238.5, CHROME, 2.4);
	if (shaded) {
		const steel = ctx.createLinearGradient(0, 236, 0, 248);
		steel.addColorStop(0, 'rgba(255,255,255,0.3)');
		steel.addColorStop(1, 'rgba(0,0,0,0.26)');
		ctx.fillStyle = steel;
		ctx.fillRect(26, 234, 50, 16);
	}
	ctx.restore();

	// Tapered tip and the heel weld.
	line(ctx, 28, 236, 34, 248, INK, 2);
	line(ctx, 74, 236, 86, 252, CHARCOAL, 3);

	if (fitted) {
		// Carriage rollers on the mast rails and the fork locking pins.
		circle(ctx, 92, 196, 4.6, CHARCOAL_LIGHT, 1.6);
		circle(ctx, 92, 242, 4.6, CHARCOAL_LIGHT, 1.6);
		rect(ctx, 79, 204, 6, 5, CHROME, 1, 1.2);
		rect(ctx, 79, 232, 6, 5, CHROME, 1, 1.2);
		line(ctx, 30, 244, 70, 244, 'rgba(0,0,0,0.32)', 1.6);
	}

	if (finish) {
		// Carriage face: brushed vertical band with a lit leading stile and dark trailing edge.
		ctx.save();
		ctx.clip(new Path2D(CARRIAGE));
		const face = ctx.createLinearGradient(74, 0, 96, 0);
		face.addColorStop(0, 'rgba(255,255,255,0.24)');
		face.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		face.addColorStop(1, 'rgba(0,0,0,0.18)');
		ctx.fillStyle = face;
		ctx.fillRect(74, 182, 22, 70);
		ctx.restore();
		line(ctx, 76, 186, 76, 248, 'rgba(255,255,255,0.48)', 1.4);
		line(ctx, 94, 186, 94, 248, 'rgba(0,0,0,0.2)', 1.3);

		// Blade top run, underside bounce and the heel weld catching the light.
		line(ctx, 34, 237.4, 72, 237.4, 'rgba(255,255,255,0.8)', 1.2);
		line(ctx, 36, 239, 70, 239, 'rgba(255,255,255,0.6)', 1.3);
		line(ctx, 30, 246.4, 72, 246.4, 'rgba(255,255,255,0.2)', 1);
		line(ctx, 75, 239, 85.4, 251, 'rgba(255,255,255,0.4)', 1.2);

		// Roller rims, locking pins and the carriage/mast gap shadow.
		for (const rollerY of [196, 242]) {
			ctx.strokeStyle = 'rgba(255,255,255,0.72)';
			ctx.lineWidth = 1.2;
			ctx.beginPath();
			ctx.arc(92, rollerY, 3.2, Math.PI * 1.05, Math.PI * 1.55);
			ctx.stroke();
			ctx.fillStyle = 'rgba(255,255,255,0.85)';
			ctx.beginPath();
			ctx.arc(90.7, rollerY - 1.4, 0.85, 0, Math.PI * 2);
			ctx.fill();
		}
		line(ctx, 80, 205.4, 84, 205.4, 'rgba(255,255,255,0.68)', 1);
		line(ctx, 80, 233.4, 84, 233.4, 'rgba(255,255,255,0.68)', 1);

		glint(ctx, 44, 242, 2.6);
		glint(ctx, 82, 220, 2.4);
	}
}

/** Seat, dash and floor of the open operator station, seen side-on. */
function drawStation(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	// Floor plate and rubber mat.
	rect(ctx, 214, 190, 78, 10, CHARCOAL_LIGHT, 2, 1.6);
	rect(ctx, 218, 192, 70, 6, TIRE, 1.4, 1.1);

	// Dash: a dark panel with two gauges and the hydraulic levers.
	rect(ctx, 216, 146, 34, 26, CHARCOAL_DARK, 3, 2);
	if (fitted) {
		circle(ctx, 226, 155, 4.4, CREAM, 1.5);
		circle(ctx, 238, 155, 4.4, CREAM, 1.5);
		line(ctx, 226, 155, 228.6, 152, INK, 1.2);
		line(ctx, 238, 155, 240, 157, INK, 1.2);
		line(ctx, 220, 166, 245, 166, 'rgba(255,255,255,0.14)', 1.2);
	}

	// Levers on the console's near face.
	line(ctx, 242, 168, 249, 158, INK, 3);
	circle(ctx, 249, 157, 3, CHARCOAL, 1.4);
	line(ctx, 246, 172, 251, 165, INK, 2.4);
	circle(ctx, 251, 164, 2.4, CHARCOAL, 1.2);

	// Seat: cushion and a tall backrest with a padded centre panel.
	rect(ctx, 290, 172, 52, 16, CHARCOAL, 3, 2.2);
	rect(ctx, 330, 124, 32, 48, CHARCOAL, 4, 2.2);
	if (fitted) {
		rect(ctx, 334, 130, 24, 30, CHARCOAL_LIGHT, 3, 1.4);
		line(ctx, 294, 175, 338, 175, 'rgba(255,255,255,0.16)', 1.4);
		line(ctx, 344, 128, 344, 166, 'rgba(255,255,255,0.12)', 1.4);
		rect(ctx, 318, 148, 12, 18, CHARCOAL_DARK, 2, 1.4);
		rect(ctx, 288, 186, 56, 4, CHARCOAL_DARK, 1.5, 1.2);
		rect(ctx, 278, 182, 10, 8, STEEL, 2, 1.4);
	}
}

export function drawRealForkliftLevel(
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
		ctx.ellipse(316, 278, 292, 13, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Mast first: its mounting bracket, then the forks that ride in front of it.
	shape(ctx, MOUNT, CHARCOAL, 2.5);
	drawMast(ctx, shaded, fitted, finish);
	drawForks(ctx, shaded, fitted, finish);

	// Shell, with the counterweight and lower skirt knocked back in charcoal.
	shape(ctx, BODY, ORANGE, 3);
	ctx.save();
	ctx.clip(new Path2D(BODY));

	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(450, 130, 90, 126);
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(196, 242, 250, 14);
	ctx.fillStyle = 'rgba(255,255,255,0.1)';
	ctx.fillRect(196, 242, 250, 2);

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 112, 0, 254);
		paint.addColorStop(0, 'rgba(255,255,255,0.36)');
		paint.addColorStop(0.4, 'rgba(255,255,255,0.04)');
		paint.addColorStop(0.86, 'rgba(201,123,60,0.14)');
		paint.addColorStop(1, 'rgba(90,44,14,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(190, 108, 352, 150);

		const metal = ctx.createLinearGradient(450, 0, 540, 0);
		metal.addColorStop(0, 'rgba(255,255,255,0.18)');
		metal.addColorStop(0.7, 'rgba(255,255,255,0.02)');
		metal.addColorStop(1, 'rgba(0,0,0,0.28)');
		ctx.fillStyle = metal;
		ctx.fillRect(448, 128, 92, 130);
	}
	ctx.restore();

	// Counterweight seam and the arched rear fender lip.
	line(ctx, 450, 142, 450, 238, CHARCOAL_DARK, 2.2);
	line(ctx, 451.4, 144, 451.4, 236, 'rgba(255,255,255,0.12)', 1.2);
	archLip(ctx, shaded);

	// Cream waist line, carried from the front frame into the counterweight.
	line(ctx, 198, 200, 448, 200, 'rgba(255,246,228,0.85)', 2.4);
	line(ctx, 198, 203, 448, 203, 'rgba(58,39,27,0.22)', 1.4);

	shape(ctx, FRAME, CHARCOAL, 2.5);
	if (shaded) {
		line(ctx, 184, 206, 184, 250, 'rgba(255,255,255,0.16)', 1.4);
		line(ctx, 150, 192, 180, 192, 'rgba(255,255,255,0.16)', 1.4);
	}

	drawStation(ctx, fitted);

	// Overhead guard: posts first, canopy over them.
	shape(ctx, POST_F, CHARCOAL, 2.5);
	shape(ctx, POST_R, CHARCOAL, 2.5);
	shape(ctx, CANOPY, CHARCOAL, 3);
	if (shaded) {
		line(ctx, 206, 58, 446, 58, 'rgba(255,255,255,0.3)', 1.8);
		line(ctx, 202, 78, 448, 78, 'rgba(0,0,0,0.3)', 1.8);
	}
	if (fitted) {
		// Guard ribs and the front work lamp.
		rect(ctx, 268, 60, 118, 5, CHARCOAL_DARK, 2, 1.2);
		rect(ctx, 330, 68, 12, 10, CHARCOAL_DARK, 1.5, 1.2);
		circle(ctx, 212, 72, 4.4, LAMP, 1.8);
		line(ctx, 254.5, 84, 254.5, 168, 'rgba(255,255,255,0.16)', 1.3);
		line(ctx, 422.5, 84, 422.5, 146, 'rgba(255,255,255,0.14)', 1.3);
	}

	// Beacon on the canopy.
	shape(ctx, BEACON, AMBER, 2);
	rect(ctx, 372, 52, 32, 4, CHARCOAL_DARK, 1, 1.6);
	if (shaded) {
		line(ctx, 380, 46, 380, 54, 'rgba(255,255,255,0.65)', 1.6);
		line(ctx, 390, 46, 390, 54, 'rgba(255,255,255,0.4)', 1.2);
	}

	// Windscreen.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 210, 80, 42, 62);
	}
	if (fitted) {
		line(ctx, 248, 138, 240, 102, INK, 2);
		line(ctx, 222, 84, 222, 134, 'rgba(255,255,255,0.16)', 1.2);
	}

	// Work lamp, marker and step on the front frame.
	if (fitted) {
		circle(ctx, 204, 212, 6, LAMP, 2.4);
		circle(ctx, 202.5, 210.5, 2.8, '#FFF7CF', 1.2);
		circle(ctx, 204, 228, 3.2, AMBER, 1.6);
		rect(ctx, 196, 242, 18, 8, CHROME, 2, 2);
		line(ctx, 199, 246, 211, 246, 'rgba(58,39,27,0.4)', 1.2);
	}

	// Hood louvers behind the seat.
	if (fitted) {
		for (let row = 0; row < 3; row++) {
			line(ctx, 388, 154 + row * 6, 446, 154 + row * 6, 'rgba(58,39,27,0.22)', 2);
		}
	}

	// Tail lamps and rear hazard chevrons on the counterweight.
	if (fitted) {
		rect(ctx, 520, 202, 10, 20, RED, 3, 2);
		rect(ctx, 520, 224, 10, 10, AMBER, 2, 1.8);
		ctx.save();
		ctx.clip(new Path2D(BODY));
		for (let i = 0; i < 4; i++) {
			line(ctx, 496 + i * 11, 200, 508 + i * 11, 176, 'rgba(255,183,3,0.9)', 5);
		}
		ctx.restore();
		rect(ctx, 460, 164, 22, 14, CREAM, 1.5, 1.6);
		line(ctx, 463, 169, 479, 169, 'rgba(58,39,27,0.42)', 1);
		line(ctx, 463, 173, 474, 173, 'rgba(58,39,27,0.3)', 1);
	}

	// Exhaust stub.
	shape(ctx, STACK, STEEL, 2.2);
	if (shaded) {
		line(ctx, 470, 114, 470, 138, 'rgba(255,255,255,0.3)', 1.4);
	}

	// Both wheels share the one wheel part; the rear tile is its exact mirror.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: canopy, mast leading edge, counterweight and fork blade.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(206, 57.5);
		ctx.lineTo(446, 57.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(97.5, 56);
		ctx.lineTo(97.5, 196);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.38)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(534.5, 152);
		ctx.lineTo(534.5, 240);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(30, 237);
		ctx.lineTo(72, 237);
		ctx.stroke();

		// Headlight glow and the beacon flash.
		const glow = ctx.createRadialGradient(204, 212, 1, 204, 212, 24);
		glow.addColorStop(0, 'rgba(255,240,150,0.68)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(204, 212, 24, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(388, 48, 1, 388, 48, 24);
		beacon.addColorStop(0, 'rgba(255,183,3,0.5)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(388, 48, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 270, 26, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Picture-book pass, in layers: grain, sheen, glints, hub hardware, wear.
		paintGrain(ctx);
		line(ctx, 210, 66, 442, 66, 'rgba(255,255,255,0.16)', 6);
		machineSheen(ctx);
		mastSheen(ctx);
		glassSheen(ctx);

		// Glints on paint, glass and chrome, clear of the tyres and the open cab.
		glint(ctx, 300, 218, 5);
		glint(ctx, 334, 206, 4.2);
		glint(ctx, 472, 150, 4.6);
		glint(ctx, 527, 158, 3);
		glint(ctx, 350, 132, 2.8);
		glint(ctx, 222, 186, 2.6);

		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealForklift(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealForkliftLevel(ctx, x, y, scale, 5);
}
