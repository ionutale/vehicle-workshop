/**
 * Gritter truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over winter-maintenance lorry facing left: a tall yellow cab, an open grit hopper
 * with a heaped load and a propped-open mesh lid over the rear axle, a spinner disc
 * under the tail, and a curved mouldboard on a hazard-striped push frame at the nose.
 * Five slots: body (cab, bed, blade, spreader), windows, hopper, one wheel used twice.
 *
 * Level 5 is the production target: shaded, fully fitted, lit and picture-book finished
 * with paint grain, glints, hub hardware, hopper sheen, beacon and lamp highlights, a
 * cold exhaust puff and salt dust off the spinner.
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

const YELLOW = '#F9C74F';
const YELLOW_DARK = '#D9A633';
const TEAL = '#264653';
const TEAL_DARK = '#18323B';
const TEAL_LIGHT = '#3E6B7A';
const CREAM = '#FFF9EC';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';
const GRIT = '#7E7466';
const GRIT_LIGHT = '#A79B88';
const GRIT_DARK = '#564E43';
const SALT = '#E7E4DA';

/** Art box 700 x 320, road at 252. Front (cab) faces left. */
const BODY_MAIN =
	'M82,240 L82,208 Q82,200 86,196 L92,124 Q94,108 108,105 L114,98 Q118,86 132,84 L246,84 Q258,84 258,96 L258,170 L600,170 Q618,170 622,184 L650,240 Z';

/** Teal working skirt along cab and bed, following the raked tail. */
const SKIRT = 'M83,224 L638,224 L650,240 L83,240 Z';

/** Teal band down the raked tail panel, behind the spreader. */
const TAIL_BAND = 'M598,170 L612,170 L650,240 L636,240 Z';

const WINDSCREEN =
	'M94,178 L94,150 Q94,138 100,126 L106,110 Q109,102 118,102 L146,102 Q152,102 152,110 L152,170 Q152,178 146,178 Z';
const SIDE_WINDOW =
	'M164,104 Q164,98 172,98 L204,98 Q212,98 212,106 L212,158 Q212,164 204,164 L172,164 Q164,164 164,156 Z';

const DOOR = { x: 160, y: 100, w: 96, h: 120 };

/** The mouldboard: concave-forward plate with a forward-curled top lip. */
const BLADE =
	'M8,118 Q2,124 3,138 Q4,152 6,166 Q8,188 14,210 Q20,234 28,246 L62,246 L66,240 L66,152 Q66,140 70,136 Q40,118 8,118 Z';

/** Push frame: two arms and a ram off the bumper, hidden at the blade end. */
const ARM_UP = 'M64,196 L100,212 L100,223 L63,206 Z';
const ARM_LOW = 'M64,224 L100,235 L100,246 L65,236 Z';
const RAM = 'M62,178 L98,196 L96,204 L60,187 Z';

/** Cargo hopper: steep-sided open box under a heaped load, over the rear axle. */
const HOPPER = 'M424,116 L440,116 Q526,82 612,116 L628,116 L584,170 L468,170 Z';
/** Mesh lid, hinged at the rear rim and lifted open over the load. */
const HOPPER_LID = 'M626,116 L594,88 L600,80 L632,108 Z';

const WHEEL_L = { x: 170, y: 222, r: 30 };
const WHEEL_R = { x: 530, y: 222, r: 30 };
const ARCH = 37;

const SPINNER = { x: 670, y: 233, rx: 20, ry: 10 };

const CHASSIS = { x: 96, y: 240, w: 554, h: 12 };
const BEACON = { x: 196, y: 72, w: 34, h: 12 };
const STACK = { x: 259, y: 96, w: 12, h: 72 };
const MIRROR = 'M64,104 L82,109 L82,123 L64,118 Z';
const TOOLBOX = { x: 280, y: 146, w: 60, h: 24 };

const HOPPER_RIBS = [470, 490, 552, 574];

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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.62)');
	glass.addColorStop(0.44, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(80,160,205,0.3)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** A recessed wheel well under the tyre, ringed by a teal mudguard lip. */
function wheelWell(ctx: CanvasRenderingContext2D, cx: number, shaded: boolean): void {
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH, Math.PI, Math.PI * 2);
	ctx.lineTo(cx + ARCH, 252);
	ctx.lineTo(cx - ARCH, 252);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, WHEEL_L.y - ARCH, 0, 252);
		well.addColorStop(0, '#0A1418');
		well.addColorStop(1, TEAL_LIGHT);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = TEAL_DARK;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke();

	// Mudguard lip: a banded arch with an ink edge, under the paint.
	ctx.strokeStyle = TEAL;
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
		ctx.strokeStyle = 'rgba(255,255,255,0.24)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(cx, WHEEL_L.y, ARCH - 1, Math.PI * 1.12, Math.PI * 1.5);
		ctx.stroke();
	}
}

/**
 * The spreader under the tail: a feed duct from the hopper outlet and a flat spinner
 * disc with radial vanes and a fan of grit, not a stub axle.
 */
function spreader(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	// Outlet collar under the hopper, then a two-part feed duct down the tail.
	rect(ctx, 558, 168, 18, 14, STEEL, 3, 2.2);
	line(ctx, 562, 172, 562, 179, 'rgba(255,255,255,0.4)', 1.4);
	line(ctx, 566, 182, 602, 204, INK, 14);
	line(ctx, 566, 182, 602, 204, TEAL, 10);
	line(ctx, 602, 204, 660, 212, INK, 14);
	line(ctx, 602, 204, 660, 212, TEAL, 10);
	circle(ctx, 602, 204, 6, STEEL, 1.8);
	circle(ctx, 602, 204, 2, CHROME, 1);
	line(ctx, 564, 179, 600, 200, 'rgba(255,255,255,0.3)', 2);

	// Spinner motor on the tail, with the disc hung beneath it.
	rect(ctx, 662, 204, 16, 18, STEEL, 3, 2.2);
	rect(ctx, 662, 210, 16, 5, CHROME, 1, 1.4);
	line(ctx, 664, 207, 664, 219, 'rgba(255,255,255,0.35)', 1.4);
	circle(ctx, 670, 208, 2.4, CHROME, 1.2);
	line(ctx, 670, 221, 670, 226, INK, 5);
	line(ctx, 670, 221, 670, 226, STEEL, 3);

	ctx.save();
	ctx.beginPath();
	ctx.ellipse(SPINNER.x, SPINNER.y, SPINNER.rx, SPINNER.ry, 0, 0, Math.PI * 2);
	if (shaded) {
		const disc = ctx.createLinearGradient(0, SPINNER.y - SPINNER.ry, 0, SPINNER.y + SPINNER.ry);
		disc.addColorStop(0, '#C7D0DC');
		disc.addColorStop(0.55, '#8B95A4');
		disc.addColorStop(1, '#4A5361');
		ctx.fillStyle = disc;
	} else {
		ctx.fillStyle = STEEL;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke();

	// Radial vanes across the disc face.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2 + 0.18;
		const x1 = SPINNER.x + Math.cos(a) * 5.5;
		const y1 = SPINNER.y + Math.sin(a) * 2.5;
		const x2 = SPINNER.x + Math.cos(a) * 17;
		const y2 = SPINNER.y + Math.sin(a) * 7.6;
		line(ctx, x1, y1, x2, y2, 'rgba(24,34,42,0.5)', 3);
		line(ctx, x1, y1, x2, y2, 'rgba(226,234,240,0.65)', 1.4);
	}

	// Bright rim and hub.
	ctx.strokeStyle = 'rgba(236,242,248,0.7)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.ellipse(SPINNER.x, SPINNER.y, SPINNER.rx - 2.5, SPINNER.ry - 1.2, 0, Math.PI * 1.04, Math.PI * 1.86);
	ctx.stroke();
	circle(ctx, SPINNER.x, SPINNER.y, 4.4, CHROME, 1.6);
	circle(ctx, SPINNER.x, SPINNER.y, 1.6, STEEL, 1);
	ctx.restore();

	if (finish) {
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.ellipse(SPINNER.x, SPINNER.y, SPINNER.rx - 3, SPINNER.ry - 1.5, 0, Math.PI * 1.1, Math.PI * 1.55);
		ctx.stroke();
	}
}

/**
 * The cargo hopper: an open, steep-sided works hopper with a heaped grit load, steel
 * ribs, a sight window and a mesh lid propped open at the rear.
 */
function gritHopper(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, HOPPER, TEAL);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(HOPPER));
		const paint = ctx.createLinearGradient(0, 106, 0, 170);
		paint.addColorStop(0, 'rgba(255,255,255,0.22)');
		paint.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(0,0,0,0.34)');
		ctx.fillStyle = paint;
		ctx.fillRect(420, 104, 212, 68);
		ctx.restore();
	}

	if (finish) {
		hopperGrain(ctx);
		hopperSheen(ctx);
	}

	// Heaped load of grit and salt inside the open top.
	ctx.save();
	ctx.clip(new Path2D(HOPPER));
	const heap = ctx.createLinearGradient(0, 96, 0, 117);
	heap.addColorStop(0, GRIT_LIGHT);
	heap.addColorStop(1, GRIT_DARK);
	ctx.fillStyle = heap;
	ctx.fillRect(420, 76, 212, 42);

	let seed = 53;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	for (let i = 0; i < 240; i++) {
		const px = 436 + rnd() * 180;
		const py = 97 + rnd() * 19;
		const size = 1 + rnd() * 1.9;
		ctx.fillStyle = i % 6 === 0 ? GRIT_LIGHT : i % 4 === 0 ? '#6A6154' : GRIT;
		ctx.globalAlpha = 0.5 + rnd() * 0.4;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = SALT;
	for (let i = 0; i < 70; i++) {
		const px = 440 + rnd() * 172;
		const py = 100 + rnd() * 16;
		ctx.globalAlpha = 0.45 + rnd() * 0.4;
		ctx.fillRect(px, py, 1 + rnd() * 1.2, 1 + rnd() * 1.2);
	}
	ctx.globalAlpha = 1;
	ctx.restore();

	// Shadow where the load meets the steel wall, and a little spill over the rim.
	line(ctx, 442, 116.4, 610, 116.4, 'rgba(10,22,26,0.55)', 2.2);
	ctx.fillStyle = GRIT;
	ctx.beginPath();
	ctx.ellipse(601, 117.5, 7, 2.2, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = SALT;
	ctx.beginPath();
	ctx.arc(598, 119, 1.2, 0, Math.PI * 2);
	ctx.fill();

	if (finish) loadSheen(ctx);

	// Yellow livery band along the lower flank and a steel base rail.
	ctx.save();
	ctx.clip(new Path2D(HOPPER));
	ctx.fillStyle = YELLOW;
	ctx.fillRect(466, 150, 120, 7);
	ctx.restore();
	rect(ctx, 468, 167, 116, 3, STEEL, 1, 1.6);

	// Steel straps over the sloping sides.
	for (const rx of HOPPER_RIBS) {
		rect(ctx, rx, 122, 6, 42, STEEL, 1, 1.6);
		if (shaded) line(ctx, rx + 1.7, 124, rx + 1.7, 161, 'rgba(255,255,255,0.3)', 1.2);
		for (const ry of [128, 140, 152]) circle(ctx, rx + 3, ry, 0.9, CHROME, 0.6);
	}

	// Sight window on the flank.
	rect(ctx, 500, 128, 26, 15, '#17343D', 2, 1.8);
	line(ctx, 503, 140, 520, 131, 'rgba(255,255,255,0.3)', 1.4);
	line(ctx, 502, 142, 521, 142, 'rgba(0,0,0,0.4)', 1.2);

	// Mesh lid, hinged at the rear rim and lifted open over the load.
	shape(ctx, HOPPER_LID, '#8A94A2', 2.2);
	ctx.save();
	ctx.clip(new Path2D(HOPPER_LID));
	for (let k = 1; k < 5; k++) {
		const t = k / 5;
		const ax = 626 - 32 * t;
		const ay = 116 - 28 * t;
		const bx = 632 - 32 * t;
		const by = 108 - 28 * t;
		line(ctx, ax, ay, bx, by, 'rgba(30,44,52,0.5)', 1.1);
	}
	line(ctx, 628, 110, 602, 82, 'rgba(255,255,255,0.32)', 1.4);
	ctx.restore();

	// Hinge, catch and prop strut.
	circle(ctx, 626, 116, 3.4, STEEL, 1.4);
	circle(ctx, 626, 116, 1.3, CHROME, 0.9);
	rect(ctx, 598, 86, 7, 5, TEAL_DARK, 1.5, 1.3);
	if (fitted) {
		line(ctx, 598, 90, 604, 116, INK, 3.2);
		line(ctx, 598, 90, 604, 116, STEEL, 1.8);
		line(ctx, 602, 86, 600, 92, 'rgba(255,255,255,0.4)', 1.2);
	}
}

/**
 * The mouldboard at the nose: a concave-forward curved plate leaning out over the road,
 * on a visible hazard-striped push frame with a hydraulic ram.
 */
function ploughBlade(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	// Push frame: two arms and a ram, drawn first so the blade caps their roots.
	shape(ctx, ARM_UP, STEEL, 2.2);
	shape(ctx, ARM_LOW, STEEL, 2.2);

	// Hazard chevrons on the frame only.
	for (const arm of [ARM_UP, ARM_LOW]) {
		ctx.save();
		ctx.clip(new Path2D(arm));
		ctx.strokeStyle = YELLOW;
		ctx.lineWidth = 7;
		for (let band = 0; band < 5; band++) {
			const bx = 64 + band * 10;
			ctx.beginPath();
			ctx.moveTo(bx, 246);
			ctx.lineTo(bx + 16, 198);
			ctx.stroke();
		}
		ctx.restore();
	}

	// Hydraulic ram and its mount on the nose.
	shape(ctx, RAM, CHROME, 2);
	line(ctx, 64, 180, 94, 197, 'rgba(255,255,255,0.55)', 1.4);
	rect(ctx, 91, 198, 10, 10, STEEL, 1.5, 1.8);

	// Curved mouldboard, top leaning forward.
	shape(ctx, BLADE, TEAL);
	ctx.save();
	ctx.clip(new Path2D(BLADE));

	if (shaded) {
		const face = ctx.createLinearGradient(2, 118, 70, 246);
		face.addColorStop(0, 'rgba(4,16,20,0.4)');
		face.addColorStop(0.32, 'rgba(255,255,255,0.2)');
		face.addColorStop(0.64, 'rgba(255,255,255,0.03)');
		face.addColorStop(1, 'rgba(0,8,12,0.34)');
		ctx.fillStyle = face;
		ctx.fillRect(0, 110, 74, 140);
	}

	// Concave working face: curved light and shadow bands down the plate.
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(19, 146);
	ctx.quadraticCurveTo(11, 190, 19, 232);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(0,10,14,0.28)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(35, 150);
	ctx.quadraticCurveTo(30, 194, 36, 236);
	ctx.stroke();

	// Curled top lip: a folded band with a dark fold line.
	ctx.fillStyle = 'rgba(255,255,255,0.09)';
	ctx.beginPath();
	ctx.moveTo(6, 120);
	ctx.quadraticCurveTo(40, 119, 69, 137);
	ctx.lineTo(66, 149);
	ctx.quadraticCurveTo(40, 131, 4, 140);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = 'rgba(0,10,14,0.35)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(4, 140);
	ctx.quadraticCurveTo(40, 131, 66, 149);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.42)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(9, 120);
	ctx.quadraticCurveTo(40, 120, 68, 137);
	ctx.stroke();

	// Folded return down the back edge, and one horizontal stiffener seam.
	ctx.strokeStyle = 'rgba(0,8,12,0.3)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.moveTo(59, 152);
	ctx.lineTo(62, 238);
	ctx.stroke();
	line(ctx, 11, 196, 57, 199, 'rgba(0,10,14,0.22)', 1.8);
	line(ctx, 12, 192, 57, 195, 'rgba(255,255,255,0.18)', 1.4);
	circle(ctx, 54, 198, 1.3, 'rgba(20,34,40,0.6)', 0.8);
	circle(ctx, 16, 195, 1.3, 'rgba(20,34,40,0.6)', 0.8);

	// Steel wear edge along the road.
	ctx.fillStyle = '#6D7684';
	ctx.fillRect(26, 238, 36, 8);
	line(ctx, 28, 241, 61, 241, CHROME, 3);
	line(ctx, 28, 245, 61, 245, INK, 1.6);
	for (const bx of [34, 45, 56]) circle(ctx, bx, 241.5, 1.2, 'rgba(20,34,40,0.55)', 0.7);

	if (finish) {
		// Cold sheen rolling down the concave face, powder dragged toward the wear edge.
		const sheen = ctx.createLinearGradient(2, 120, 64, 244);
		sheen.addColorStop(0, 'rgba(255,255,255,0.28)');
		sheen.addColorStop(0.34, 'rgba(255,255,255,0.06)');
		sheen.addColorStop(0.7, 'rgba(2,14,18,0.1)');
		sheen.addColorStop(1, 'rgba(2,14,18,0.26)');
		ctx.fillStyle = sheen;
		ctx.fillRect(0, 112, 72, 138);

		ctx.strokeStyle = 'rgba(255,255,255,0.16)';
		ctx.lineWidth = 1.6;
		for (const [sx, sy, ex, ey] of [
			[16, 158, 14, 212],
			[30, 162, 28, 226],
			[46, 168, 44, 234]
		] as const) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();
		}

		// Wet gleam caught in the curled top lip.
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(9, 121);
		ctx.quadraticCurveTo(40, 121, 68, 137);
		ctx.stroke();
	}
	ctx.restore();

	// Pivot bolts on the back edge.
	circle(ctx, 60, 180, 2.6, CHROME, 1.2);
	circle(ctx, 61, 220, 2.6, CHROME, 1.2);

	if (fitted) {
		// Reflective marker on the blade face, clear of the chevrons on the frame.
		circle(ctx, 34, 150, 2.8, AMBER, 1.3);
	}

	if (finish) {
		// Salt dust kicked off the wear edge.
		ctx.save();
		ctx.fillStyle = '#F2F4F0';
		for (const [dx, dy, dr, alpha] of [
			[30, 249, 2.2, 0.5],
			[38, 252, 1.8, 0.4],
			[24, 247, 1.6, 0.4],
			[22, 252, 1.4, 0.3]
		] as const) {
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc(dx, dy, dr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}
}

/** Deterministic picture-book paint grain, clipped to the yellow panels. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(BODY_MAIN);
	for (const cut of [
		SKIRT,
		'M258,170 L634,170 L634,180 L258,180 Z',
		WINDSCREEN,
		SIDE_WINDOW,
		circleMask(WHEEL_L.x, WHEEL_L.y, 34),
		circleMask(WHEEL_R.x, WHEEL_R.y, 34)
	]) {
		panels.addPath(new Path2D(cut));
	}
	ctx.clip(panels, 'evenodd');

	let seed = 97;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 320; i++) {
		const px = 86 + rnd() * 558;
		const py = 88 + rnd() * 148;
		const size = 1.5 + rnd() * 1.4;
		ctx.globalAlpha = 0.08 + rnd() * 0.05;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 120; i++) {
		const px = 86 + rnd() * 558;
		const py = 88 + rnd() * 148;
		const size = 1.2 + rnd() * 1.1;
		ctx.globalAlpha = 0.18 + rnd() * 0.12;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 80; i++) {
		const px = 86 + rnd() * 558;
		const py = 88 + rnd() * 148;
		const size = 0.8 + rnd() * 0.9;
		ctx.globalAlpha = 0.22 + rnd() * 0.16;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();
}

/** Deterministic grain on the teal hopper panels, under the load line. */
function hopperGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(HOPPER));
	let seed = 29;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = '#DBE7EC';
	for (let i = 0; i < 140; i++) {
		const px = 430 + rnd() * 194;
		const py = 124 + rnd() * 44;
		const size = 1 + rnd() * 1.2;
		ctx.globalAlpha = 0.1 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#071015';
	for (let i = 0; i < 110; i++) {
		const px = 430 + rnd() * 194;
		const py = 124 + rnd() * 44;
		const size = 1 + rnd() * 1.3;
		ctx.globalAlpha = 0.1 + rnd() * 0.08;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();
}

/** Level-5 sheen down the hopper flank. */
function hopperSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(HOPPER));
	const flank = ctx.createLinearGradient(430, 120, 600, 176);
	flank.addColorStop(0, 'rgba(255,255,255,0.22)');
	flank.addColorStop(0.45, 'rgba(255,255,255,0.03)');
	flank.addColorStop(1, 'rgba(0,0,0,0.2)');
	ctx.fillStyle = flank;
	ctx.fillRect(420, 118, 212, 54);
	ctx.restore();
}

/** Level-5 sheen across the heaped load: cool crest light and salt catches. */
function loadSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(HOPPER));

	const crest = ctx.createLinearGradient(0, 84, 0, 118);
	crest.addColorStop(0, 'rgba(255,255,255,0.3)');
	crest.addColorStop(0.48, 'rgba(255,255,255,0.05)');
	crest.addColorStop(1, 'rgba(18,14,10,0.18)');
	ctx.fillStyle = crest;
	ctx.fillRect(424, 78, 208, 42);

	// The crest line catches the sky; hard salt fragments sparkle just below it.
	ctx.strokeStyle = 'rgba(255,255,255,0.46)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(438, 115);
	ctx.quadraticCurveTo(526, 84, 610, 115);
	ctx.stroke();

	ctx.fillStyle = '#FFFFFF';
	for (const [sx, sy, sw, alpha] of [
		[470, 104, 2.2, 0.5],
		[502, 96, 1.8, 0.45],
		[534, 92, 2.4, 0.5],
		[566, 100, 1.6, 0.4],
		[482, 110, 1.2, 0.35],
		[550, 106, 1.4, 0.4]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(sx, sy, sw, sw * 0.8);
	}
	ctx.restore();
}

/** A four-point glint that survives the game scale. */
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

/** Level-5 lamp sparkle: hot cores and short rays that survive the game scale. */
function lampHighlights(ctx: CanvasRenderingContext2D): void {
	// Beacon: a hot core inside the amber lens with a few short rays.
	glint(ctx, 211, 76, 3.2);
	ctx.fillStyle = 'rgba(255,249,214,0.95)';
	ctx.beginPath();
	ctx.ellipse(207, 76.5, 4.6, 1.6, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = 'rgba(255,214,102,0.5)';
	ctx.lineWidth = 1.6;
	for (const a of [-0.9, -0.2, 0.5]) {
		ctx.beginPath();
		ctx.moveTo(211 + Math.cos(a) * 7, 76 + Math.sin(a) * 7);
		ctx.lineTo(211 + Math.cos(a) * 13, 76 + Math.sin(a) * 13);
		ctx.stroke();
	}

	// Headlamp sparkle and a chrome fillet on the bezel.
	glint(ctx, 92, 204, 2.4);
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(93, 206, 5.4, Math.PI * 1.05, Math.PI * 1.6);
	ctx.stroke();

	// Pin catchlights on the roof markers and the rear cluster.
	ctx.fillStyle = 'rgba(255,252,232,0.9)';
	for (let lens = 0; lens < 3; lens++) {
		ctx.fillRect(138 + lens * 22, 89.4, 4, 1.3);
	}
	ctx.fillStyle = 'rgba(255,252,232,0.85)';
	ctx.fillRect(608, 174, 4, 1.5);
	ctx.fillRect(608, 188, 3.5, 1.2);
}

/** Six-bolt picture-book hub; mirror symmetric so the flipped tile matches. */
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

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();

	// Faceted centre cap and washer catches on every lug.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		ctx.strokeStyle = 'rgba(255,255,255,0.85)';
		ctx.lineWidth = 1.1;
		ctx.beginPath();
		ctx.arc(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 3.1, Math.PI * 1.05, Math.PI * 1.55);
		ctx.stroke();
	}

	// Extra hub hardware: a finer ring of rim rivets, shadowed spoke grooves and a
	// highlight on the centre cap. The 6-fold pattern stays mirror symmetric.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
		circle(ctx, x + Math.cos(a) * r * 0.58, y + Math.sin(a) * r * 0.58, 1.5, '#B9C3D1', 1);
	}

	ctx.strokeStyle = 'rgba(58,39,27,0.35)';
	ctx.lineWidth = 1;
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(a) * r * 0.07, y + Math.sin(a) * r * 0.07);
		ctx.lineTo(x + Math.cos(a) * r * 0.15, y + Math.sin(a) * r * 0.15);
		ctx.stroke();
	}

	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x - 0.6, y - 0.8, 1.4, 0, Math.PI * 2);
	ctx.fill();
}

/** Finishing marks: panel chips, deck scuffs and road grime. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[110, 236, 7, 2, 0.32],
		[232, 238, 6, 2, 0.28],
		[566, 238, 8, 2, 0.26],
		[620, 226, 6, 2, 0.3]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(350, 249, 34, 3.2, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	line(ctx, 16, 206, 22, 240, 'rgba(255,255,255,0.2)', 2);

	// Salt dust blowing off the spinner, finer than the fitted grit fan.
	ctx.save();
	ctx.fillStyle = '#F2F4F0';
	for (const [dx, dy, dr, alpha] of [
		[682, 258, 2.2, 0.4],
		[690, 263, 1.6, 0.34],
		[697, 268, 1.2, 0.28],
		[676, 265, 1.4, 0.3],
		[700, 260, 1, 0.26]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(dx, dy, dr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export function drawRealGritterTruckLevel(
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
		ctx.ellipse(350, 258, 316, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// One silhouette: cab-over nose, cab roof, bed deck and raked tail.
	shape(ctx, BODY_MAIN, YELLOW);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(BODY_MAIN));
		const paint = ctx.createLinearGradient(0, 84, 0, 240);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.04)');
		paint.addColorStop(1, 'rgba(120,78,16,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(80, 82, 574, 160);
		ctx.restore();
	}

	if (finish) paintGrain(ctx);

	// Deck rail across the bed, then the teal band down the tail.
	rect(ctx, 258, 170, 376, 10, TEAL, 0, 2.2);
	line(ctx, 264, 172.5, 630, 172.5, 'rgba(255,255,255,0.3)', 2);
	shape(ctx, TAIL_BAND, TEAL, 2.2);
	if (shaded) line(ctx, 604, 178, 642, 236, 'rgba(255,255,255,0.16)', 2.4);

	// Bed stiffeners in the gap ahead of the hopper.
	for (const sx of [356, 396]) {
		rect(ctx, sx, 182, 10, 38, TEAL, 1.5, 2);
		if (shaded) line(ctx, sx + 2.5, 185, sx + 2.5, 218, 'rgba(255,255,255,0.18)', 1.6);
	}

	// Chassis rail, underbody and mudflaps.
	rect(ctx, CHASSIS.x, CHASSIS.y, CHASSIS.w, CHASSIS.h, STEEL, 0, 2.4);
	line(ctx, 102, 242.5, 646, 242.5, 'rgba(255,255,255,0.26)', 2);
	rect(ctx, 204, 240, 13, 12, TEAL_DARK, 1, 1.8);
	rect(ctx, 562, 240, 13, 12, TEAL_DARK, 1, 1.8);

	// Deck locker between the cab and the hopper.
	rect(ctx, TOOLBOX.x, TOOLBOX.y, TOOLBOX.w, TOOLBOX.h, TEAL, 2, 2.4);
	line(ctx, 284, 149, 336, 149, 'rgba(255,255,255,0.25)', 2);
	rect(ctx, 300, 154, 20, 4, CHROME, 1.5, 1.4);
	if (fitted) {
		rect(ctx, 288, 160, 6, 5, STEEL, 1, 1.2);
		rect(ctx, 332, 160, 6, 5, STEEL, 1, 1.2);
		line(ctx, 310, 146, 310, 156, 'rgba(58,39,27,0.25)', 1.2);
	}

	// Cab door, kept as painted body art.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, YELLOW, 3, 2.6);
	line(ctx, 162, 168, 254, 168, 'rgba(120,78,16,0.24)', 1.6);
	rect(ctx, 162, 208, 92, 10, TEAL, 2, 1.8);
	if (fitted) {
		rect(ctx, 238, 130, 16, 5, CHROME, 2, 1.6);
		rect(ctx, 162, 112, 4, 12, STEEL, 1.5, 1.4);
		line(ctx, 186, 104, 208, 104, 'rgba(120,78,16,0.3)', 1.6);
	}

	// Teal working skirt with yellow hazard dashes.
	shape(ctx, SKIRT, TEAL, 2.4);
	line(ctx, 92, 226.5, 640, 226.5, 'rgba(255,255,255,0.16)', 2);
	ctx.fillStyle = YELLOW;
	for (const dx of [300, 376, 452, 528, 596]) {
		ctx.fillRect(dx, 230, 24, 5);
	}

	// Mudguards first: their arch band tucks under the paint and glass.
	wheelWell(ctx, WHEEL_L.x, shaded);
	wheelWell(ctx, WHEEL_R.x, shaded);

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);

	if (shaded) {
		glassShade(ctx, WINDSCREEN, 94, 102, 58, 76);
		glassShade(ctx, SIDE_WINDOW, 164, 98, 48, 66);
		line(ctx, 112, 122, 100, 152, 'rgba(255,255,255,0.5)', 3);
		line(ctx, 176, 110, 196, 134, 'rgba(255,255,255,0.35)', 2.4);
	}

	// Front bumper, headlamp and marker on the nose.
	rect(ctx, 82, 226, 12, 16, CHROME, 3, 2.4);
	line(ctx, 83, 228, 93, 228, 'rgba(255,255,255,0.6)', 1.6);
	circle(ctx, 92, 204, 5.4, CHROME, 1.8);
	circle(ctx, 92, 204, 4.4, LAMP, 1.6);
	circle(ctx, 91, 203, 1.8, CREAM, 1);
	circle(ctx, 92, 217, 2.6, AMBER, 1.4);

	// Mouldboard on its push frame at the nose.
	ploughBlade(ctx, shaded, fitted, finish);

	// Rear lamps and plate on the tail panel, clear of the feed duct.
	rect(ctx, 606, 173, 10, 12, RED, 2, 1.7);
	rect(ctx, 606, 187, 10, 8, AMBER, 2, 1.5);
	rect(ctx, 596, 224, 18, 9, CREAM, 1, 1.6);

	// Beacon on the cab roof.
	rect(ctx, 196, 80, 34, 7, TEAL, 2, 2);
	rect(ctx, 198, 74, 26, 7, AMBER, 3, 2);
	if (fitted) rect(ctx, 202, 75.5, 9, 3, LAMP, 1, 1);

	// Mirror head on its arm, ahead of the cab glass.
	shape(ctx, MIRROR, TEAL, 2.2);
	line(ctx, 72, 112, 79, 114, 'rgba(255,255,255,0.3)', 1.4);
	line(ctx, 82, 114, 93, 112, STEEL, 3);

	// Exhaust stack behind the cab.
	rect(ctx, STACK.x, STACK.y, STACK.w, STACK.h, STEEL, 2, 2.2);
	line(ctx, 261.5, 100, 261.5, 164, 'rgba(255,255,255,0.35)', 1.6);
	if (fitted) rect(ctx, 259, 96, 12, 5, CHROME, 1, 1.5);

	if (fitted) {
		// Roof marker lamps on the cab brow.
		for (let lens = 0; lens < 3; lens++) {
			rect(ctx, 136 + lens * 22, 88, 12, 5, AMBER, 1.5, 1.2);
		}

		// Wipers over the windscreen foot.
		line(ctx, 104, 174, 118, 158, INK, 2.2);
		line(ctx, 122, 176, 136, 160, INK, 2);

		// Cab step under the door.
		rect(ctx, 194, 222, 46, 5, CHROME, 1.5, 1.6);
		rect(ctx, 188, 230, 58, 5, STEEL, 1.5, 1.5);

		// Side marker lamps along the rail.
		for (const mx of [300, 360, 400, 620]) {
			rect(ctx, mx, 218, 12, 6, AMBER, 1.5, 1.3);
		}

		// Stake pockets on the open deck, ahead of the hopper.
		for (const px of [350, 408]) {
			rect(ctx, px, 168, 10, 8, STEEL, 1.5, 1.4);
		}
	}

	// Feed duct and spinner disc under the tail.
	spreader(ctx, shaded, fitted, finish);

	// Cargo hopper over the rear axle, with its heaped load and open lid.
	gritHopper(ctx, shaded, fitted, finish);

	// Both wheels come from the one wheel piece; the rear tile is the front mirrored.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (fitted) {
		// Grit fanning off the spinner.
		ctx.save();
		ctx.fillStyle = GRIT_LIGHT;
		for (const [dx, dy, dr, alpha] of [
			[686, 245, 2.2, 0.55],
			[692, 250, 1.8, 0.45],
			[682, 256, 2, 0.4],
			[690, 261, 1.6, 0.34],
			[676, 259, 1.4, 0.3],
			[694, 255, 1.1, 0.3]
		] as const) {
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc(dx, dy, dr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (lit) {
		// Rim light on the cab roof, bed rail, blade top and hopper rim.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(138, 85.4);
		ctx.lineTo(244, 85.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(264, 171.2);
		ctx.lineTo(632, 171.2);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(9, 119);
		ctx.quadraticCurveTo(40, 119, 69, 137);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(426, 116.8);
		ctx.lineTo(438, 116.8);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(614, 116.8);
		ctx.lineTo(626, 116.8);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(601, 81);
		ctx.lineTo(631, 107);
		ctx.stroke();

		// Beacon glow.
		const beacon = ctx.createRadialGradient(211, 76, 1, 211, 76, 22);
		beacon.addColorStop(0, 'rgba(255,183,3,0.5)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(211, 76, 22, 0, Math.PI * 2);
		ctx.fill();

		// Headlight beam.
		const glow = ctx.createRadialGradient(92, 204, 1, 92, 204, 20);
		glow.addColorStop(0, 'rgba(255,240,150,0.6)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(92, 204, 20, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 253, 26, 4.4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint, chrome and hopper glints, clear of the tyre circles.
		glint(ctx, 190, 132, 5);
		glint(ctx, 300, 200, 4.4);
		glint(ctx, 560, 200, 4.2);
		glint(ctx, 390, 206, 3.6);
		glint(ctx, 466, 150, 3.4);
		glint(ctx, 636, 212, 2.8);
		glint(ctx, 58, 186, 4);
		glint(ctx, 30, 232, 2.8);
		glint(ctx, 120, 232, 2.8);
		glint(ctx, 59, 146, 3.2);
		glint(ctx, 607, 93, 2.4);
		glint(ctx, 670, 233, 2.4);

		lampHighlights(ctx);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Cold exhaust puff rising from the stack.
		ctx.save();
		ctx.fillStyle = '#C9D2DE';
		for (const [px, py, pr, alpha] of [
			[268, 92, 5, 0.5],
			[275, 86, 4, 0.4],
			[268, 82, 3.2, 0.3]
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

export function drawRealGritterTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealGritterTruckLevel(ctx, x, y, scale, 5);
}
