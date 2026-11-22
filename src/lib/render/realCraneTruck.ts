/**
 * Crane truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over lorry facing left: flat deck, rear-mounted turntable with an operator post,
 * a tall lattice-braced boom angled up and back, a cable and hook block over the deck,
 * deployed outriggers, beacons and a two-tone works livery.
 *
 * The boom and hook are baked into the body piece. Level 5 is the production target:
 * shaded, fitted, lit and finished with paint grain, boom sheen, glints and hub hardware.
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

const ORANGE = '#E76F51';
const TEAL = '#264653';
const TEAL_DARK = '#1A333D';
const TEAL_LIGHT = '#35606E';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** Art box 820 x 430, road at 272. Front (cab) faces left. */
const CAB = 'M34,252 L34,128 Q34,110 50,104 L186,104 Q196,104 196,114 L196,252 Z';
const DECK = 'M196,204 L772,204 L772,232 L196,232 Z';
const CHASSIS = { x: 100, y: 232, w: 672, h: 16 };

const WINDSCREEN = 'M46,186 L46,130 Q46,119 57,119 L112,119 Q120,119 120,127 L120,186 Z';
const DOOR_GLASS =
	'M134,123 L180,123 Q186,123 186,129 L186,177 Q186,183 180,183 L134,183 Q128,183 128,177 L128,129 Q128,123 134,123 Z';
const GLASS_MASK = `${WINDSCREEN} ${DOOR_GLASS}`;

const DOOR = { x: 128, y: 190, w: 62, h: 60 };

const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 620, y: 236, r: 36 };

/**
 * One cut-out for cab, chassis, deck and the crane mount. The boom is part of the same
 * outline, traced from the turntable up the top chord and back down the underside, so the
 * crane reads as one welded piece rather than a floating overlay.
 */
const MAIN =
	'M34,252 L34,128 Q34,110 50,104 L186,104 Q196,104 196,114 L196,204 L462,204 L462,174 L494.3,167.1 L719.4,36.3 L728.6,51.7 L509.7,192.9 L538,174 L538,204 L772,204 L772,248 L196,248 L196,252 Z';

/** Mounting wedge under the boom, drawn as part of the same silhouette. */
const TURNTABLE =
	'M462,204 L462,174 L494.3,167.1 L509.7,192.9 L538,174 L538,204 Z';

/** Operator post: seat, console and platform, sitting on the deck ahead of the turntable. */
const OPERATOR =
	'M398,204 L398,188 L400,188 L400,172 L408,172 L408,184 L430,184 L430,174 L446,174 L446,204 Z';

/** Thin handrail around the operator post: two posts and a top rail. */
const RAIL = 'M386,204 L386,166 L454,166 L454,204 L450,204 L450,170 L390,170 L390,204 Z';

const BEACON = 'M100,104 L100,100 Q100,92 108,92 L140,92 Q148,92 148,100 L148,104 Z';
const MIRROR = 'M22,118 L34,118 L34,144 L22,144 Z';
const BUMPER = 'M20,238 L34,238 L34,260 L20,260 Z';
const STACK =
	'M204,124 L200,124 L200,116 L220,116 L220,124 L216,124 L216,204 L204,204 Z';
const PUFF = 'M204,116 Q202,102 214,98 Q222,86 236,88 Q250,90 250,102 Q260,108 254,116 Z';

const LEG_F = 'M230,248 L244,248 L244,260 L258,260 L258,266 L214,266 L214,260 L230,260 Z';
const LEG_R = 'M700,248 L714,248 L714,260 L728,260 L728,266 L684,266 L684,260 L700,260 Z';

const CABLE = 'M707,66 L713,66 L713,156 L707,156 Z';
const HOOK_BLOCK = 'M696,156 L724,156 L724,176 L696,176 Z';
const HOOK_ZONE = 'M700,176 L724,176 L724,196 L700,196 Z';

const BODY_MASK = [
	MAIN,
	OPERATOR,
	RAIL,
	BEACON,
	MIRROR,
	BUMPER,
	STACK,
	PUFF,
	LEG_F,
	LEG_R,
	CABLE,
	HOOK_BLOCK,
	HOOK_ZONE
].join(' ');

interface Point {
	x: number;
	y: number;
}

interface Chord {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
}

/** Boom centreline is 258 px long, rising 31.7° towards the rear. */
const BOOM_TOP: Chord = { x0: 494.3, y0: 167.1, x1: 719.4, y1: 36.3 };
const BOOM_BOTTOM: Chord = { x0: 509.7, y0: 192.9, x1: 728.6, y1: 51.7 };
const BOOM_QUAD = 'M494.3,167.1 L719.4,36.3 L728.6,51.7 L509.7,192.9 Z';

const TOP_TO_BOTTOM = { x: 0.511, y: 0.8595 };

const at = (chord: Chord, t: number): Point => ({
	x: chord.x0 + (chord.x1 - chord.x0) * t,
	y: chord.y0 + (chord.y1 - chord.y0) * t
});

/** Inset from the top chord towards the centre of the boom. */
const innerTop = (t: number, inset = 4.2): Point => {
	const p = at(BOOM_TOP, t);
	return { x: p.x + TOP_TO_BOTTOM.x * inset, y: p.y + TOP_TO_BOTTOM.y * inset };
};

/** Inset from the bottom chord towards the centre of the boom. */
const innerBottom = (t: number, inset = 4.2): Point => {
	const p = at(BOOM_BOTTOM, t);
	return { x: p.x - TOP_TO_BOTTOM.x * inset, y: p.y - TOP_TO_BOTTOM.y * inset };
};

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

/** Wheel well behind the tyre: a dark arch that reads once the wheel tile is fitted. */
function wheelWell(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, 45, Math.PI, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = TEAL_DARK;
	ctx.fill();
}

/** Livery mudguard over the well, sitting proud of the tyre. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, 46, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, 36, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = TEAL;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(cx, cy, 44, Math.PI * 1.06, Math.PI * 1.94);
	ctx.strokeStyle = ORANGE;
	ctx.lineWidth = 1.6;
	ctx.stroke();
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

/** Picture-book hub: a bright machined ring, six bolts and a polished centre cap. */
function wheelFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.28, y + Math.sin(a) * r * 0.28, 2.2, CHROME, 1.1);
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.11, 0, Math.PI * 2);
	ctx.stroke();
}

/** Lattice-braced boom: teal chords, a lighter web and cream cross bracing. */
function drawBoom(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, BOOM_QUAD, TEAL, 3);

	ctx.save();
	ctx.clip(new Path2D(BOOM_QUAD));

	if (shaded) {
		const metal = ctx.createLinearGradient(600, 100, 616, 146);
		metal.addColorStop(0, 'rgba(255,255,255,0.3)');
		metal.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		metal.addColorStop(1, 'rgba(0,0,0,0.26)');
		ctx.fillStyle = metal;
		ctx.fillRect(480, 20, 260, 190);
	}

	const t0 = innerTop(0.02);
	const t1 = innerTop(0.98);
	const b1 = innerBottom(0.98);
	const b0 = innerBottom(0.02);
	ctx.fillStyle = TEAL_LIGHT;
	ctx.fill(new Path2D(`M${t0.x},${t0.y} L${t1.x},${t1.y} L${b1.x},${b1.y} L${b0.x},${b0.y} Z`));

	// Stepped lattice panels: two crossed braces in each bay.
	const bays = 8;
	for (let i = 0; i < bays; i++) {
		const a = i / bays;
		const b = (i + 1) / bays;
		const topA = innerTop(a);
		const topB = innerTop(b);
		const bottomA = innerBottom(a);
		const bottomB = innerBottom(b);
		line(ctx, topA.x, topA.y, bottomB.x, bottomB.y, 'rgba(255,246,228,0.7)', 1.9);
		line(ctx, bottomA.x, bottomA.y, topB.x, topB.y, 'rgba(255,246,228,0.7)', 1.9);
	}

	// Chord highlight runs the full length of the boom.
	line(
		ctx,
		innerTop(0.04, 2).x,
		innerTop(0.04, 2).y,
		innerTop(0.96, 2).x,
		innerTop(0.96, 2).y,
		'rgba(255,255,255,0.32)',
		2
	);

	if (fitted) {
		// Telescopic section collars.
		for (const t of [0.46, 0.72]) {
			const top = at(BOOM_TOP, t);
			const bottom = at(BOOM_BOTTOM, t);
			line(ctx, top.x, top.y, bottom.x, bottom.y, TEAL_DARK, 7);
			line(ctx, top.x, top.y, bottom.x, bottom.y, ORANGE, 2.4);
		}

		// Rivet rows down both chords.
		ctx.fillStyle = CHROME;
		for (const t of [0.12, 0.26, 0.38, 0.58, 0.82]) {
			for (const point of [innerTop(t, 2.8), innerBottom(t, 2.8)]) {
				ctx.beginPath();
				ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}

	ctx.restore();
}

/** Cable, sheave and hook block hanging from the boom tip over the rear deck. */
function drawHook(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	// Sheave sits just inside the tip, with the cable falling clear of the underside.
	circle(ctx, 710, 54, 5.5, CHROME, 1.8);
	circle(ctx, 710, 54, 2, STEEL, 1.2);

	line(ctx, 710, 58, 710, 156, INK, 3.2);
	line(ctx, 710, 60, 710, 156, 'rgba(255,255,255,0.45)', 1.1);

	rect(ctx, 697, 157, 26, 18, ORANGE, 3, 2.5);
	circle(ctx, 710, 166, 6.5, CHROME, 1.8);
	rect(ctx, 699, 160, 4, 12, TEAL_DARK, 1, 1.2);

	// J-hook, drawn as a thick open curve tucked inside the cut-out zone.
	ctx.beginPath();
	ctx.moveTo(710, 175);
	ctx.lineTo(710, 181);
	ctx.quadraticCurveTo(710, 191, 717, 191);
	ctx.quadraticCurveTo(723, 191, 723, 185);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 5;
	ctx.stroke();
	ctx.strokeStyle = STEEL;
	ctx.lineWidth = 2.6;
	ctx.stroke();

	if (fitted) {
		line(ctx, 719, 185, 723, 185, CHROME, 2);
		circle(ctx, 702, 166, 1.6, STEEL, 1);
	}
}

export function drawRealCraneTruckLevel(
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
		ctx.ellipse(400, 278, 370, 13, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Exhaust stack stands in the gap behind the cab.
	shape(ctx, STACK, STEEL, 2.5);
	if (shaded) {
		line(ctx, 208, 132, 208, 198, 'rgba(255,255,255,0.32)', 1.6);
		line(ctx, 213, 132, 213, 198, 'rgba(0,0,0,0.28)', 2);
	}

	// Chassis rails run from under the cab to the tail.
	rect(ctx, CHASSIS.x, CHASSIS.y, CHASSIS.w, CHASSIS.h, STEEL, 4, 2.5);
	if (shaded) {
		rect(ctx, CHASSIS.x, CHASSIS.y, CHASSIS.w, 3, '#8A93A3', 0, 0);
	}
	line(ctx, 108, 244, 764, 244, 'rgba(58,39,27,0.35)', 1.6);

	// Outriggers hang from the chassis, pads just clear of the road.
	shape(ctx, LEG_F, TEAL, 2.5);
	shape(ctx, LEG_R, TEAL, 2.5);
	if (fitted) {
		for (const cx of [237, 707]) {
			line(ctx, cx, 249, cx, 259, CHROME, 4.5);
			line(ctx, cx - 10, 261, cx + 10, 261, ORANGE, 2);
			circle(ctx, cx, 257, 1.8, STEEL, 1);
		}
		line(ctx, 218, 263, 254, 263, 'rgba(0,0,0,0.3)', 1.4);
		line(ctx, 688, 263, 724, 263, 'rgba(0,0,0,0.3)', 1.4);
	}

	// Flat deck: orange fascia, teal skirt, cream coach line.
	shape(ctx, DECK, ORANGE);
	ctx.save();
	ctx.clip(new Path2D(DECK));
	rect(ctx, 196, 221, 576, 11, TEAL, 0, 0);
	rect(ctx, 196, 217.5, 576, 3, CREAM, 0, 0);
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 204, 0, 232);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.5, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(26,51,61,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(196, 204, 576, 28);
	}
	ctx.restore();
	line(ctx, 198, 206, 770, 206, 'rgba(58,39,27,0.25)', 1.6);

	if (fitted) {
		// Lockers and fuel tank tucked under the deck between the axles.
		rect(ctx, 294, 233, 62, 14, CHROME, 6, 2.2);
		line(ctx, 308, 234, 308, 245, 'rgba(58,39,27,0.35)', 1.4);
		line(ctx, 340, 234, 340, 245, 'rgba(58,39,27,0.35)', 1.4);
		rect(ctx, 370, 234, 48, 13, TEAL, 3, 2.2);
		rect(ctx, 380, 238, 8, 3, CHROME, 1, 1.2);

		// Stake pockets and lashing rings along the deck face.
		for (const pocketX of [232, 300, 366]) {
			rect(ctx, pocketX, 207, 7, 10, TEAL_DARK, 1, 1.4);
		}
		for (const ringX of [258, 328, 390, 570, 640, 704]) {
			circle(ctx, ringX, 214, 2.4, CHROME, 1.1);
		}

		// Deck seam and a row of rivets.
		line(ctx, 200, 225, 768, 225, 'rgba(58,39,27,0.24)', 1.3);
		for (let rivetX = 212; rivetX < 766; rivetX += 44) {
			circle(ctx, rivetX, 229, 1.2, 'rgba(58,39,27,0.5)', 0.7);
		}
	}

	// Operator post on the deck, ahead of the turntable.
	shape(ctx, OPERATOR, TEAL, 2.5);
	rect(ctx, 400, 174, 8, 14, TEAL_DARK, 1.5, 1.8);
	rect(ctx, 408, 186, 20, 8, ORANGE, 2, 1.8);
	rect(ctx, 430, 180, 16, 14, TEAL_DARK, 2, 1.8);
	line(ctx, 435, 182, 434, 177, INK, 2);
	circle(ctx, 434, 176.5, 1.8, CHROME, 0.9);
	line(ctx, 441, 182, 442, 177, INK, 2);
	circle(ctx, 442, 176.5, 1.8, CHROME, 0.9);
	if (fitted) {
		line(ctx, 399, 196, 445, 196, 'rgba(255,255,255,0.24)', 1.4);
		line(ctx, 410, 194, 410, 202, INK, 1.4);
		line(ctx, 426, 194, 426, 202, INK, 1.4);
	}

	// Guard rail around the post.
	line(ctx, 388, 168, 388, 204, INK, 4.4);
	line(ctx, 452, 168, 452, 204, INK, 4.4);
	line(ctx, 388, 168, 452, 168, INK, 4.4);
	line(ctx, 388, 168, 388, 204, CHROME, 2.6);
	line(ctx, 452, 168, 452, 204, CHROME, 2.6);
	line(ctx, 388, 168, 452, 168, CHROME, 2.6);

	// Cab shell and livery.
	shape(ctx, CAB, ORANGE);
	ctx.save();
	ctx.clip(new Path2D(CAB));
	rect(ctx, 34, 186, 162, 10, TEAL, 0, 0);
	rect(ctx, 34, 196, 162, 3, CREAM, 0, 0);
	rect(ctx, 34, 236, 162, 16, TEAL, 0, 0);
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 104, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.4)');
		paint.addColorStop(0.34, 'rgba(255,255,255,0.04)');
		paint.addColorStop(0.8, 'rgba(163,61,40,0.06)');
		paint.addColorStop(1, 'rgba(26,51,61,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(32, 102, 166, 152);
	}
	ctx.restore();

	if (fitted) {
		// Roof visor, marker lamps and the front step.
		rect(ctx, 38, 112, 90, 6, TEAL_DARK, 3, 2);
		rect(ctx, 66, 105, 8, 3, AMBER, 1, 1);
		rect(ctx, 90, 105, 8, 3, AMBER, 1, 1);
		rect(ctx, 188, 246, 20, 7, CHROME, 2, 2);
	}

	// Turntable: mounting wedge, ring and bolts.
	shape(ctx, TURNTABLE, TEAL, 3);
	ctx.beginPath();
	ctx.moveTo(468, 189);
	ctx.quadraticCurveTo(500, 179, 532, 189);
	ctx.strokeStyle = TEAL_DARK;
	ctx.lineWidth = 4;
	ctx.stroke();
	if (fitted) {
		for (let i = 0; i < 6; i++) {
			const a = Math.PI + (i / 5) * Math.PI;
			circle(ctx, 500 + Math.cos(a) * 33, 188 + Math.sin(a) * 7, 1.7, CHROME, 1);
		}
	}
	circle(ctx, 500, 191, 3.4, CHROME, 1.4);
	line(ctx, 464, 198, 536, 198, ORANGE, 3);
	line(ctx, 464, 201, 536, 201, 'rgba(0,0,0,0.25)', 1.4);

	// Luffing ram under the boom.
	line(ctx, 470, 200, 565, 156, INK, 11);
	line(ctx, 470, 200, 565, 156, STEEL, 8);
	line(ctx, 474, 198, 561, 158, CHROME, 3);
	circle(ctx, 470, 200, 3.2, STEEL, 1.4);

	drawBoom(ctx, shaded, fitted);
	circle(ctx, 502, 180, 3.4, CHROME, 1.4);
	circle(ctx, 565, 156, 2.6, CHROME, 1.2);
	drawHook(ctx, fitted);

	// Roof beacon.
	shape(ctx, BEACON, AMBER, 2);
	rect(ctx, 96, 103, 56, 4, TEAL_DARK, 1.5, 1.8);
	if (fitted) {
		line(ctx, 108, 94, 108, 102, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 128, 94, 128, 102, 'rgba(255,255,255,0.55)', 1.2);
	}

	// Mirror, bumper, grille and lamps.
	shape(ctx, MIRROR, TEAL_DARK, 2.5);
	rect(ctx, 24, 121, 8, 20, GLASS, 1.5, 1.2);
	line(ctx, 34, 132, 24, 128, INK, 2);

	shape(ctx, BUMPER, CHROME, 2.5);
	if (fitted) {
		circle(ctx, 27, 243, 2, STEEL, 1);
		circle(ctx, 27, 254, 2, STEEL, 1);
		rect(ctx, 23, 246, 8, 4, ORANGE, 1, 1.2);
		circle(ctx, 40, 231, 7, LAMP, 2.4);
		circle(ctx, 39, 229.5, 3.5, '#FFF7CF', 1.4);
		circle(ctx, 40, 217, 4, AMBER, 1.8);
		rect(ctx, 36, 194, 12, 16, TEAL_DARK, 2, 1.8);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 38, 198 + bar * 4, 46, 198 + bar * 4, 'rgba(201,210,222,0.7)', 1.1);
		}
	}

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 46, 119, 74, 67);
		shadeGlass(ctx, DOOR_GLASS, 128, 123, 58, 60);
	}

	// Cab door: panel, waist band, handle and hinges.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, ORANGE, 2.5, 2.5);
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, 6, TEAL, 0, 0);
	rect(ctx, DOOR.x, DOOR.y + 6, DOOR.w, 3, CREAM, 0, 0);
	rect(ctx, DOOR.x, 236, DOOR.w, 14, TEAL, 0, 0);
	rect(ctx, 180, 204, 6, 17, CHROME, 2.5, 1.8);
	rect(ctx, 131, 198, 4, 8, STEEL, 1, 1.4);
	rect(ctx, 131, 224, 4, 8, STEEL, 1, 1.4);
	line(ctx, 128, 230, 190, 230, 'rgba(58,39,27,0.22)', 1.3);

	if (fitted) {
		// Wipers, sun visor shadow and the front screen divider.
		line(ctx, 54, 180, 82, 152, INK, 2.2);
		line(ctx, 90, 180, 112, 160, INK, 1.8);
		line(ctx, 122, 122, 122, 184, INK, 2.4);
		line(ctx, 126, 122, 126, 184, 'rgba(255,255,255,0.3)', 1.2);

		// Rear lamp cluster and plate on the deck.
		rect(ctx, 750, 210, 9, 8, RED, 2, 1.6);
		rect(ctx, 750, 219, 9, 7, AMBER, 1.5, 1.4);
		rect(ctx, 730, 214, 17, 9, CREAM, 1, 1.4);
		line(ctx, 733, 217, 744, 217, 'rgba(58,39,27,0.4)', 1);
	}

	// Wheel wells and mudguards, then the tyres.
	if (fitted) {
		wheelWell(ctx, WHEEL_L.x, WHEEL_L.y);
		wheelWell(ctx, WHEEL_R.x, WHEEL_R.y);
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y);
	}

	// Both wheels share the one wheel part; the rear tile is its exact mirror.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: cab roof, nose, deck edge and the boom's top chord.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(58, 106);
		ctx.lineTo(184, 106);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(35.5, 134);
		ctx.lineTo(35.5, 234);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(200, 205.5);
		ctx.lineTo(770, 205.5);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.45)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(510, 160);
		ctx.lineTo(706, 46);
		ctx.stroke();

		// Headlight glow and the beacon flash.
		const glow = ctx.createRadialGradient(40, 231, 1, 40, 231, 29);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(40, 231, 29, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(124, 96, 1, 124, 96, 24);
		beacon.addColorStop(0, 'rgba(255,183,3,0.5)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(124, 96, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 272, 30, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain over every painted surface, never the glazing or the tyres.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
		ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');
		let seed = 59;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 340; i++) {
			const px = 22 + rand() * 748;
			const py = 92 + rand() * 158;
			const size = 1.4 + rand() * 1.2;
			ctx.globalAlpha = 0.08 + rand() * 0.07;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = CREAM;
		for (let i = 0; i < 130; i++) {
			const px = 22 + rand() * 748;
			const py = 92 + rand() * 158;
			const size = 1.2 + rand() * 1;
			ctx.globalAlpha = 0.18 + rand() * 0.11;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes over the cab, deck and boom.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[48, 208, 180, 206],
			[214, 212, 380, 211],
			[560, 214, 748, 213],
			[520, 158, 690, 50]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Boom sheen: a polished run down the top chord and a soft bounce in the web.
		ctx.save();
		ctx.clip(new Path2D(BOOM_QUAD));
		const shineTop = innerTop(0.05, 2.6);
		const shineEnd = innerTop(0.95, 2.6);
		ctx.globalAlpha = 0.34;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(shineTop.x, shineTop.y);
		ctx.lineTo(shineEnd.x, shineEnd.y);
		ctx.stroke();

		const bounceStart = innerBottom(0.08, 8);
		const bounceEnd = innerBottom(0.92, 8);
		ctx.globalAlpha = 0.14;
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(bounceStart.x, bounceStart.y);
		ctx.lineTo(bounceEnd.x, bounceEnd.y);
		ctx.stroke();
		ctx.restore();

		// Exhaust puff drifting off the stack.
		ctx.save();
		ctx.clip(new Path2D(PUFF));
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[216, 108, 5],
			[230, 100, 6],
			[244, 97, 4.5]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Glass: a sheen down the screen and a sparkle in the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3.6;
		ctx.beginPath();
		ctx.moveTo(62, 180);
		ctx.lineTo(100, 126);
		ctx.stroke();
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(142, 178);
		ctx.lineTo(166, 140);
		ctx.stroke();
		ctx.restore();

		// Glints on paint, glass and chrome, clear of the tyres.
		glint(ctx, 660, 82, 6);
		glint(ctx, 84, 136, 5.6);
		glint(ctx, 502, 198, 4.6);
		glint(ctx, 300, 213, 4.6);
		glint(ctx, 711, 166, 3.6);

		// Hub hardware on both wheels; both finishes are mirror-symmetric.
		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Outrigger pads: bright top edges and a bolt on each pad.
		for (const padX of [236, 706]) {
			line(ctx, padX - 19, 261, padX + 19, 261, 'rgba(255,255,255,0.78)', 1.8);
			circle(ctx, padX, 263.5, 1.5, CREAM, 0.9);
		}

		// Finishing marks: paint chips on the working edges and soot on the stack.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[52, 247, 8, 2.2, 0.42],
			[120, 247, 6, 2, 0.36],
			[282, 228, 10, 2, 0.32],
			[560, 228, 7, 2, 0.3],
			[767, 230, 4, 2.4, 0.4]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		ctx.save();
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(210, 122, 8, 3.4, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		line(ctx, 713, 158, 721, 158, 'rgba(255,255,255,0.7)', 2);

		// Cable catchlight between the sheave and the hook block, inside the cable mask.
		line(ctx, 710.4, 70, 710.4, 116, 'rgba(255,255,255,0.8)', 1.6);
		glint(ctx, 710, 84, 2.4);
	}

	ctx.restore();
}

export function drawRealCraneTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealCraneTruckLevel(ctx, x, y, scale, 5);
}
