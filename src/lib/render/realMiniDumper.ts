/**
 * Mini dumper art, cut into the same five-piece kit as the other realistic works machines.
 * A one-tonne site dumper facing left: the tipping skip rides over the front axle, the
 * operator sits at the rear under a two-post roll bar with a beacon, and chunky tyres
 * carry a low charcoal chassis. The open skip is the cue that names the machine.
 * Level 5 is the production target: shaded, fully fitted, lit and picture-book finished
 * with paint grain, skip wear and scratches, glints, hub bolts and a beacon sheen.
 */

import {
	CHROME,
	INK,
	STEEL,
	circle,
	circleMask,
	line,
	rect,
	rectMask,
	shape,
	wheel
} from './realKit';

const ORANGE = '#F4A261';
const ORANGE_DARK = '#D98B4A';
const ORANGE_DEEP = '#B9743D';
const CHARCOAL = '#2B2D42';
const CHARCOAL_DARK = '#1D1F30';
const CHARCOAL_LIGHT = '#3D405B';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';
const GRAVEL = '#8C8378';

/** Art box 620 x 330, road at 272. The skip is at the front (left). */
const SHELL =
	'M170,250 L170,204 L222,196 L292,194 L302,184 L316,172 Q326,166 336,174 L342,184 L342,200 L352,198 L352,194 L430,190 L430,178 L520,166 L544,166 L544,144 L556,144 L556,165 L566,164 L566,250 L498,250 L498,236 A38,38 0 0 0 422,236 L422,250 Z';

/** Exhaust wisp above the stack: mask-only, drawn by the picture-book pass. */
const PUFF = 'M542,144 Q536,132 548,127 Q560,119 568,127 Q575,135 568,144 Z';

const BODY_MASK = `${SHELL} ${PUFF}`;

/** The tipping skip: a raked box with an open top, overhanging the front axle. */
const SKIP = 'M50,206 L50,156 L236,138 L236,198 L150,202 Z';
const SKIP_INTERIOR = 'M50,156 L236,138 L236,150 L50,168 Z';
const SKIP_RAIL = 'M50,168 L236,150 L236,160 L50,178 Z';
const SKIP_PANEL = `${SKIP} ${SKIP_INTERIOR} ${SKIP_RAIL}`;

/** Rear operator station: cushion, backrest, pedestal, roll bar and beacon. */
const SEAT_CUSHION = 'M334,174 L390,172 L390,188 L334,190 Z';
const SEAT_BACK =
	'M390,184 L414,182 L414,130 Q414,124 408,124 L398,124 Q390,124 390,130 Z';
const SEAT_BASE = 'M334,190 L390,188 L390,204 L334,206 Z';
const ROLL_BAR =
	'M468,180 L468,120 Q468,108 480,108 L510,108 Q522,108 522,120 L522,174 L508,174 L508,124 L482,126 L482,180 Z';
const ROLL_FOOT_L = 'M462,180 L488,180 L488,188 L462,188 Z';
const ROLL_FOOT_R = 'M502,180 L528,180 L528,188 L502,188 Z';
const BEACON_BASE = 'M486,108 L504,108 L504,100 L486,100 Z';
const BEACON_LENS = 'M488,100 L502,100 L500,92 Q495,88 488,92 Z';

const WHEEL_L = { x: 140, y: 236, r: 30 };
const WHEEL_R = { x: 460, y: 236, r: 30 };
const ARCH_R = 38;

/**
 * Paint grain lands on orange paint only: the tyre circles, charcoal engine cover,
 * chassis rail and exhaust stack are cut out so metal stays metal.
 */
const BODY_GRAIN = `${BODY_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)} ${rectMask(430, 170, 140, 84)} ${rectMask(170, 240, 398, 12)} ${rectMask(544, 144, 12, 22)}`;

const SKIP_RIBS = [92, 130, 168, 204];

/** Bottom edge of the near skip rail, so ribs tuck under it. */
const railBottom = (rx: number): number => 178 - ((rx - 50) * 18) / 186;
/** Skip floor line, falling towards the discharge lip at the front. */
const skipFloor = (rx: number): number => 206 - ((rx - 50) * 8) / 186;

function ribPath(rx: number): string {
	const top = railBottom(rx);
	const foot = skipFloor(rx);
	return `M${rx},${top} L${rx + 7},${top - 1} L${rx + 9},${foot} L${rx + 2},${foot + 1} Z`;
}

/** A four-point sparkle: soft halo, long cross, short diagonals and a warm core. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.save();
	const halo = ctx.createRadialGradient(x, y, 0.4, x, y, size * 2.4);
	halo.addColorStop(0, 'rgba(255,255,255,0.3)');
	halo.addColorStop(0.45, 'rgba(255,255,255,0.09)');
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
 * Picture-book hub: a bright rim ring, six bolts and a pale centre cap. Mirrored about
 * the hub, so the flipped rear wheel, which is the same tile, matches.
 */
function wheelFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.29, y + Math.sin(a) * r * 0.29, 2.4, CHROME, 1.2);
	}

	circle(ctx, x, y, r * 0.16, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.85)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.6, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();
}

/** Recessed wheel well: the tyre sits inside a dark arch in the rear body. */
function wheelWell(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	ctx.beginPath();
	ctx.arc(WHEEL_R.x, WHEEL_R.y, ARCH_R - 1, Math.PI, Math.PI * 2);
	ctx.lineTo(WHEEL_R.x + ARCH_R - 1, 250);
	ctx.lineTo(WHEEL_R.x - ARCH_R + 1, 250);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, WHEEL_R.y - ARCH_R, 0, 250);
		well.addColorStop(0, '#12131F');
		well.addColorStop(1, CHARCOAL_LIGHT);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = CHARCOAL_DARK;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke();
}

/** Paint grain over solid paint only: tyres, engine cover, chassis and skip top are out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(BODY_GRAIN), 'evenodd');

	const wash = ctx.createLinearGradient(170, 118, 566, 250);
	wash.addColorStop(0, 'rgba(255,255,255,0.05)');
	wash.addColorStop(0.48, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.08)');
	ctx.fillStyle = wash;
	ctx.fillRect(168, 116, 410, 136);

	let seed = 61;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 170; i++) {
		const px = 170 + rand() * 406;
		const py = 120 + rand() * 130;
		const size = 1.1 + rand() * 1.1;
		ctx.globalAlpha = 0.07 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 76; i++) {
		const px = 170 + rand() * 406;
		const py = 122 + rand() * 128;
		const size = 0.9 + rand() * 0.8;
		ctx.globalAlpha = 0.15 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Dry-brush strokes along the deck.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[250, 203, 330, 200],
		[360, 207, 430, 203],
		[240, 244, 420, 243]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 1.8, ex, ey);
		ctx.stroke();
	}
	ctx.restore();

	// Grain on the skip's near panel, never in the open top.
	ctx.save();
	ctx.clip(new Path2D(SKIP_PANEL), 'evenodd');
	ctx.fillStyle = INK;
	seed = 29;
	for (let i = 0; i < 64; i++) {
		const px = 48 + rand() * 190;
		const py = 158 + rand() * 48;
		const size = 1 + rand() * 1;
		ctx.globalAlpha = 0.06 + rand() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 28; i++) {
		const px = 50 + rand() * 188;
		const py = 160 + rand() * 46;
		const size = 0.8 + rand() * 0.7;
		ctx.globalAlpha = 0.14 + rand() * 0.09;
		ctx.fillRect(px, py, size, size);
	}

	// A couple of dry-brush passes along the near panel.
	ctx.globalAlpha = 0.08;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.4;
	for (const [sx, sy, ex, ey] of [
		[64, 190, 156, 186],
		[118, 199, 226, 195]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 1.2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Engine cover, roll bar, seat and skip-rail highlights for the picture-book pass. */
function machineSheen(ctx: CanvasRenderingContext2D): void {
	// Brushed engine cover with a warm bounce along its lower edge.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	const brushed = ctx.createLinearGradient(430, 0, 570, 0);
	brushed.addColorStop(0, 'rgba(255,255,255,0.14)');
	brushed.addColorStop(0.5, 'rgba(255,255,255,0.02)');
	brushed.addColorStop(1, 'rgba(0,0,0,0.16)');
	ctx.fillStyle = brushed;
	ctx.fillRect(430, 162, 140, 90);
	ctx.restore();

	line(ctx, 434, 179.4, 518, 167.6, 'rgba(255,255,255,0.45)', 1.6);
	line(ctx, 434, 182.2, 518, 170.6, 'rgba(255,255,255,0.14)', 3);

	// Roll bar: lit inner stiles and a bolt at each foot.
	line(ctx, 470, 124, 470, 176, 'rgba(255,255,255,0.42)', 1.4);
	line(ctx, 480, 124, 480, 176, 'rgba(0,0,0,0.22)', 1.2);
	line(ctx, 520, 124, 520, 170, 'rgba(255,255,255,0.3)', 1.3);
	line(ctx, 510, 124, 510, 170, 'rgba(0,0,0,0.2)', 1.1);
	line(ctx, 482, 110.4, 508, 110.4, 'rgba(255,255,255,0.5)', 1.4);
	line(ctx, 482, 114, 508, 114, 'rgba(255,255,255,0.16)', 2.6);
	circle(ctx, 465, 184, 1.6, CHROME, 1);
	circle(ctx, 525, 184, 1.6, CHROME, 1);

	// Seat piping and the pedestal lip.
	line(ctx, 338, 175.4, 386, 173.8, 'rgba(255,255,255,0.3)', 1.4);
	line(ctx, 396, 128, 396, 178, 'rgba(255,255,255,0.28)', 1.4);
	line(ctx, 412, 128, 412, 180, 'rgba(0,0,0,0.24)', 1.3);
	line(ctx, 338, 191.4, 386, 189.6, 'rgba(255,255,255,0.16)', 1.2);

	// Beacon plinth highlight and the near skip rail sheen.
	line(ctx, 487, 100.6, 503, 100.6, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, 54, 166.4, 232, 152.4, 'rgba(255,255,255,0.42)', 1.4);
	line(ctx, 52, 174.6, 234, 160.4, 'rgba(255,255,255,0.16)', 3);
}

/** Working marks: gravel in the skip, exhaust wisp, chips, dust and lamp pips. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// A little ballast still sitting in the skip.
	ctx.save();
	ctx.clip(new Path2D(SKIP_INTERIOR));
	for (const [gx, gy, gr] of [
		[86, 160, 2.6],
		[103, 158, 2],
		[128, 156, 2.4],
		[151, 153, 1.8],
		[176, 151, 2.2],
		[200, 149, 1.7]
	]) {
		circle(ctx, gx, gy, gr, GRAVEL, 1);
	}
	ctx.fillStyle = 'rgba(120,110,98,0.7)';
	for (const [gx, gy] of [
		[95, 161],
		[117, 159],
		[141, 156],
		[165, 154],
		[188, 152]
	]) {
		ctx.beginPath();
		ctx.arc(gx, gy, 1.1, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Exhaust wisp drifting back off the stack.
	shape(ctx, PUFF, 'rgba(213,220,229,0.55)', 1.8);
	ctx.fillStyle = 'rgba(255,255,255,0.35)';
	for (const [px, py, pr] of [
		[549, 134, 5],
		[561, 130, 4],
		[568, 136, 3]
	]) {
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}

	// Paint chips on the skip lip, chassis rail and engine cover.
	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[64, 196, 7, 1.8, 0.4],
		[130, 186, 6, 1.6, 0.34],
		[198, 171, 8, 1.8, 0.32],
		[252, 240.6, 8, 1.6, 0.3],
		[356, 240.4, 7, 1.6, 0.26],
		[468, 240.6, 9, 1.6, 0.3],
		[534, 166.6, 6, 1.5, 0.3],
		[236, 232, 5, 1.6, 0.28]
	]) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	// Dust shadow under the chassis and lamp pips.
	ctx.save();
	ctx.globalAlpha = 0.1;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(330, 250, 120, 3.4, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[494, 94, 1.3],
		[250.6, 205.6, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** The tipping skip: open top, raked near rail, stiffening ribs and pivot hinge. */
function drawSkip(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, SKIP, ORANGE, 3);

	// Open top between the far rail and the near rail.
	shape(ctx, SKIP_INTERIOR, '#1B1C29', 2);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SKIP_INTERIOR));
		const depth = ctx.createLinearGradient(0, 136, 0, 194);
		depth.addColorStop(0, 'rgba(104,42,26,0.9)');
		depth.addColorStop(0.43, 'rgba(40,22,24,0.92)');
		depth.addColorStop(1, 'rgba(16,17,26,0.96)');
		ctx.fillStyle = depth;
		ctx.fillRect(48, 136, 192, 50);
		ctx.restore();
	}
	line(ctx, 51, 155, 235, 137, CHROME, 2);

	// Near rail: the top edge of the side wall facing the camera.
	shape(ctx, SKIP_RAIL, ORANGE_DARK, 2.4);

	// Stiffening ribs down the near panel.
	for (const rx of SKIP_RIBS) {
		shape(ctx, ribPath(rx), ORANGE_DEEP, 1.8);
		line(ctx, rx + 2.4, railBottom(rx) + 3, rx + 4.2, skipFloor(rx) - 2, 'rgba(255,255,255,0.24)', 2);
	}

	// Panel fold near the floor and the discharge lip.
	line(ctx, 54, 203, 233, 195.2, 'rgba(58,39,27,0.18)', 2);
	line(ctx, 51.4, 158, 51.4, 204, 'rgba(255,255,255,0.3)', 2);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SKIP_PANEL), 'evenodd');
		const paint = ctx.createLinearGradient(48, 150, 236, 206);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.04)');
		paint.addColorStop(1, 'rgba(90,44,14,0.26)');
		ctx.fillStyle = paint;
		ctx.fillRect(48, 150, 192, 58);
		ctx.restore();
	}

	if (fitted) {
		// Chrome lip along the near rail and the pivot hinge at the rear corner.
		line(ctx, 52, 167, 234, 151, 'rgba(255,255,255,0.6)', 1.4);
		circle(ctx, 232, 190, 4.4, STEEL, 1.5);
		circle(ctx, 232, 190, 1.7, CHROME, 1);
		rect(ctx, 223, 192, 14, 5, CHARCOAL, 1.5, 1.3);
		// Rivet heads down each rib.
		ctx.fillStyle = 'rgba(255,246,228,0.75)';
		for (const rx of SKIP_RIBS) {
			ctx.beginPath();
			ctx.arc(rx + 4.4, railBottom(rx) + 5, 1.1, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(rx + 6, skipFloor(rx) - 5, 1.1, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(SKIP_PANEL), 'evenodd');

		// Ground-away paint along the discharge lip, broken into wear dashes.
		ctx.strokeStyle = 'rgba(255,246,228,0.55)';
		ctx.lineWidth = 1.7;
		ctx.beginPath();
		ctx.moveTo(53, 204);
		ctx.lineTo(100, 202.8);
		ctx.moveTo(110, 202.5);
		ctx.lineTo(148, 201.7);
		ctx.stroke();
		line(ctx, 52, 205.8, 149, 203.5, 'rgba(0,0,0,0.24)', 1.4);

		// Scratches: a pale cut with a shadow just under it, plus a few dents.
		for (const [sx, sy, ex, ey, alpha] of [
			[64, 193, 96, 190.4, 0.4],
			[112, 186, 140, 182.8, 0.32],
			[156, 179, 181, 175.6, 0.28],
			[198, 171, 223, 167.6, 0.24]
		]) {
			ctx.strokeStyle = `rgba(255,246,228,${alpha})`;
			ctx.lineWidth = 1.2;
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();
			ctx.strokeStyle = 'rgba(58,39,27,0.24)';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(sx, sy + 1.4);
			ctx.lineTo(ex, ey + 1.4);
			ctx.stroke();
		}
		ctx.strokeStyle = 'rgba(58,39,27,0.22)';
		ctx.lineWidth = 1.2;
		for (const [sx, sy, ex, ey] of [
			[80, 197, 90, 196],
			[126, 191, 138, 190],
			[204, 181, 214, 179.6]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();
		}
		ctx.restore();
	}
}

/** Seat, pedestal and the two-post roll bar with its beacon. */
function drawSeat(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	// Mounting feet, pedestal, backrest, then the cushion over the join.
	shape(ctx, ROLL_FOOT_L, CHARCOAL, 2);
	shape(ctx, ROLL_FOOT_R, CHARCOAL, 2);
	shape(ctx, SEAT_BASE, CHARCOAL_DARK, 2.2);
	shape(ctx, SEAT_BACK, CHARCOAL, 2.6);
	shape(ctx, SEAT_CUSHION, CHARCOAL, 2.6);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(`${SEAT_CUSHION} ${SEAT_BACK} ${SEAT_BASE}`));
		const upholstery = ctx.createLinearGradient(0, 122, 0, 206);
		upholstery.addColorStop(0, 'rgba(255,255,255,0.18)');
		upholstery.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		upholstery.addColorStop(1, 'rgba(0,0,0,0.24)');
		ctx.fillStyle = upholstery;
		ctx.fillRect(332, 120, 86, 88);
		ctx.restore();
	}

	// Roll bar hoop.
	shape(ctx, ROLL_BAR, CHARCOAL, 3);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(ROLL_BAR));
		const steel = ctx.createLinearGradient(464, 0, 526, 0);
		steel.addColorStop(0, 'rgba(255,255,255,0.2)');
		steel.addColorStop(0.45, 'rgba(255,255,255,0.03)');
		steel.addColorStop(1, 'rgba(0,0,0,0.3)');
		ctx.fillStyle = steel;
		ctx.fillRect(466, 106, 58, 76);
		ctx.restore();
	}

	// Beacon: dark plinth, amber lens.
	shape(ctx, BEACON_BASE, CHARCOAL_DARK, 1.8);
	shape(ctx, BEACON_LENS, AMBER, 1.8);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(BEACON_LENS));
		const lens = ctx.createLinearGradient(486, 0, 504, 0);
		lens.addColorStop(0, 'rgba(255,255,255,0.55)');
		lens.addColorStop(0.6, 'rgba(255,183,3,0.06)');
		lens.addColorStop(1, 'rgba(150,90,0,0.34)');
		ctx.fillStyle = lens;
		ctx.fillRect(486, 88, 20, 22);
		ctx.restore();
	}

	if (fitted) {
		// Cushion centre panel, backrest panel and the lap strap.
		rect(ctx, 340, 177, 40, 9, CHARCOAL_LIGHT, 3, 1.4);
		rect(ctx, 396, 130, 16, 34, CHARCOAL_LIGHT, 3, 1.4);
		line(ctx, 400, 136, 400, 158, 'rgba(255,255,255,0.12)', 1.3);
		line(ctx, 408, 134, 392, 166, INK, 3.6);
		line(ctx, 408, 134, 392, 166, 'rgba(224,69,90,0.85)', 1.8);
		// Foot bolts and a grab handle on the bar.
		circle(ctx, 466, 186, 2, CHROME, 1);
		circle(ctx, 524, 186, 2, CHROME, 1);
		line(ctx, 516, 142, 526, 144, CHROME, 2.2);
		line(ctx, 526, 144, 528, 150, CHROME, 2.2);
	}

	if (finish) {
		// Beacon sheen: a lit streak down the amber lens and a pale rim along its crown.
		ctx.save();
		ctx.clip(new Path2D(BEACON_LENS));
		const sheen = ctx.createLinearGradient(487, 0, 503, 0);
		sheen.addColorStop(0, 'rgba(255,255,255,0.82)');
		sheen.addColorStop(0.34, 'rgba(255,246,228,0.3)');
		sheen.addColorStop(0.62, 'rgba(255,255,255,0.05)');
		sheen.addColorStop(1, 'rgba(120,66,0,0.3)');
		ctx.fillStyle = sheen;
		ctx.fillRect(486, 88, 20, 14);
		ctx.restore();
		ctx.strokeStyle = 'rgba(255,255,255,0.72)';
		ctx.lineWidth = 1.1;
		ctx.beginPath();
		ctx.arc(495, 96, 5.2, Math.PI * 1.14, Math.PI * 1.86);
		ctx.stroke();
		circle(ctx, 493.8, 93.6, 1.5, 'rgba(255,255,255,0.9)', 0.8);

		// A stitched seat edge.
		ctx.fillStyle = 'rgba(255,246,228,0.5)';
		for (let i = 0; i < 6; i++) {
			ctx.beginPath();
			ctx.arc(340 + i * 7, 177.4 - i * 0.2, 0.8, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}

export function drawRealMiniDumperLevel(
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
		ctx.ellipse(330, 278, 280, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// ---- Body: chassis, engine cover, dash and exhaust ----
	shape(ctx, SHELL, ORANGE, 3);
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Charcoal engine cover over the rear axle.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(430, 150, 140, 104);
	// Chassis rail under the deck.
	ctx.fillStyle = CHARCOAL_DARK;
	ctx.fillRect(170, 240, 398, 12);
	// Exhaust stack reads as steel, not paint.
	ctx.fillStyle = CHARCOAL_LIGHT;
	ctx.fillRect(544, 144, 12, 22);

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 166, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.4, 'rgba(255,255,255,0.04)');
		paint.addColorStop(0.86, 'rgba(201,123,60,0.12)');
		paint.addColorStop(1, 'rgba(90,44,14,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(168, 162, 402, 92);

		const metal = ctx.createLinearGradient(430, 0, 572, 0);
		metal.addColorStop(0, 'rgba(255,255,255,0.16)');
		metal.addColorStop(0.46, 'rgba(255,255,255,0.03)');
		metal.addColorStop(1, 'rgba(0,0,0,0.3)');
		ctx.fillStyle = metal;
		ctx.fillRect(430, 166, 140, 88);
	}
	ctx.restore();

	// Cream waist line along the top of the chassis rail.
	line(ctx, 172, 239.4, 560, 239.4, 'rgba(255,246,228,0.8)', 2);

	// Engine cover seam, hood shoulder and the rear lip.
	line(ctx, 430, 180, 430, 250, CHARCOAL_DARK, 2.2);
	line(ctx, 431.4, 182, 431.4, 238, 'rgba(255,255,255,0.12)', 1.2);
	line(ctx, 434, 179.4, 518, 167.6, 'rgba(255,255,255,0.3)', 1.8);
	line(ctx, 566, 168, 566, 246, 'rgba(255,255,255,0.16)', 1.6);

	// Exhaust cap and heat collar.
	rect(ctx, 543, 142, 14, 4, CHARCOAL_DARK, 1, 1.6);
	line(ctx, 545.4, 148, 545.4, 164, 'rgba(255,255,255,0.24)', 1.4);

	// Steering column, dash binnacle and the wheel.
	line(ctx, 327, 197, 324, 186, INK, 4);
	line(ctx, 327, 197, 324, 186, STEEL, 2.2);
	rect(ctx, 306, 188, 20, 9, CHARCOAL_DARK, 2, 1.6);
	if (shaded) {
		line(ctx, 308, 191, 324, 191, 'rgba(255,255,255,0.14)', 1.2);
	}
	ctx.save();
	ctx.translate(322, 181);
	ctx.rotate(-0.4);
	ctx.beginPath();
	ctx.ellipse(0, 0, 10.2, 4.6, 0, 0, Math.PI * 2);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 4.2;
	ctx.stroke();
	ctx.strokeStyle = CHARCOAL;
	ctx.lineWidth = 2.2;
	ctx.stroke();
	ctx.strokeStyle = CHARCOAL_LIGHT;
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(-8, 0);
	ctx.lineTo(8, 0);
	ctx.moveTo(0, -3.4);
	ctx.lineTo(0, 3.4);
	ctx.stroke();
	ctx.fillStyle = CHARCOAL_LIGHT;
	ctx.beginPath();
	ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// Footwell mat.
	if (fitted) {
		rect(ctx, 242, 200, 44, 5, CHARCOAL_DARK, 2, 1.2);
		line(ctx, 246, 202, 284, 201, 'rgba(255,255,255,0.1)', 1);
	}

	// Rear wheel well, painted before the axle side fittings.
	wheelWell(ctx, shaded);
	if (fitted) {
		ctx.strokeStyle = CHARCOAL_LIGHT;
		ctx.lineWidth = 4.4;
		ctx.beginPath();
		ctx.arc(WHEEL_R.x, WHEEL_R.y, ARCH_R + 1.4, Math.PI * 1.03, Math.PI * 1.97);
		ctx.stroke();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.arc(WHEEL_R.x, WHEEL_R.y, ARCH_R + 3.4, Math.PI * 1.03, Math.PI * 1.97);
		ctx.stroke();
	}

	// Tipping ram between the chassis and the skip's floor.
	line(ctx, 292, 236, 250, 221, INK, 11);
	line(ctx, 292, 236, 250, 221, STEEL, 7.5);
	line(ctx, 287, 234, 255, 222, 'rgba(255,255,255,0.3)', 1.8);
	rect(ctx, 282, 228, 12, 16, CHARCOAL, 2, 2);
	circle(ctx, 250, 221, 3.2, CHROME, 1.4);

	if (fitted) {
		// Recessed headlamp on the chassis corner, facing the skip.
		rect(ctx, 242, 200, 20, 14, CHARCOAL_DARK, 3, 1.8);
		circle(ctx, 252, 207, 5, LAMP, 1.8);
		circle(ctx, 250.6, 205.6, 2.2, '#FFF7CF', 1);
		circle(ctx, 264, 234, 2.4, AMBER, 1.4);

		// Engine cover vents, filler cap and maker's plate.
		for (let row = 0; row < 3; row++) {
			line(ctx, 454, 196 + row * 7, 512, 194 + row * 7, 'rgba(0,0,0,0.3)', 2.2);
			line(ctx, 454, 197.2 + row * 7, 512, 195.2 + row * 7, 'rgba(255,255,255,0.1)', 1);
		}
		circle(ctx, 536, 188, 4.4, STEEL, 1.6);
		circle(ctx, 536, 188, 1.6, CHROME, 1);
		rect(ctx, 492, 226, 34, 13, CREAM, 2, 1.8);
		ctx.fillStyle = CHARCOAL;
		ctx.fillRect(496, 229.4, 26, 2);
		ctx.fillRect(496, 233.6, 18, 2);

		// Step and tail lamps on the rear quarter.
		rect(ctx, 430, 232, 36, 6, CHROME, 2, 1.6);
		line(ctx, 434, 235, 462, 235, 'rgba(58,39,27,0.35)', 1.2);
		rect(ctx, 542, 196, 12, 16, RED, 3, 1.8);
		rect(ctx, 542, 216, 12, 8, AMBER, 2, 1.5);
	}

	// ---- Skip, operator station, wheels ----
	drawSkip(ctx, shaded, fitted, finish);
	drawSeat(ctx, shaded, fitted, finish);

	// Both wheels share the one wheel part; the rear tile is its exact mirror.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (finish) {
		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	if (lit) {
		// Rim light along the skip rail, hood, roll bar and rear face.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(52, 155.4);
		ctx.lineTo(234, 137.8);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(432, 178.6);
		ctx.lineTo(518, 167.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.38)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(482, 109);
		ctx.lineTo(508, 109);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(565, 170);
		ctx.lineTo(565, 244);
		ctx.stroke();

		// Headlight glow and the beacon flash.
		const glow = ctx.createRadialGradient(252, 207, 1, 252, 207, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.66)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(252, 207, 26, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(495, 95, 1, 495, 95, 19);
		beacon.addColorStop(0, 'rgba(255,183,3,0.5)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(495, 95, 19, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 271, 29, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		machineSheen(ctx);

		glint(ctx, 124, 196, 4.6);
		glint(ctx, 190, 184, 4);
		glint(ctx, 278, 214, 3.4);
		glint(ctx, 500, 190, 4.4);
		glint(ctx, 477, 134, 3);
		glint(ctx, 494, 96, 2.4);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealMiniDumper(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealMiniDumperLevel(ctx, x, y, scale, 5);
}
