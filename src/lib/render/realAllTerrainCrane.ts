/**
 * All-terrain crane art, cut into the same five-piece kit as the other realistic vehicles.
 * A yellow and charcoal telescopic crane carrier facing left: a low cab at the nose of a
 * long multi-axle carrier, four-point outriggers, a turntable superstructure with its own
 * operator cab, and a telescopic boom rising forward. The hook block hanging on its cable
 * is the cue that names the machine; beacons and hazard chevrons finish the works livery.
 *
 * The boom, cable and hook are one cut-out piece, so the cargo slot carries the whole
 * telescope. Level 4 is the production target: shaded, fitted and lit. Level 5 adds the
 * picture-book finish: paint grain, boom sheen, glints, hub hardware and the exhaust puff.
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
	shape,
	wheel
} from './realKit';

const YELLOW = '#F9C74F';
const YELLOW_DEEP = '#DCA62C';
const YELLOW_AMBER = '#C8901E';
const CHARCOAL = '#2B2D42';
const CHARCOAL_DARK = '#1B1D2C';
const CHARCOAL_LIGHT = '#3F4257';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** Art box 800 x 360, road at 320. Front (carrier cab) faces left. */
const CAB = 'M26,282 L26,224 L36,206 Q40,196 52,196 L126,196 Q140,198 140,214 L140,282 Z';
const FRAME = 'M140,244 L770,244 Q782,244 782,254 L782,268 Q782,276 770,276 L140,276 Z';
const SUPER = 'M318,244 L318,236 Q318,214 340,214 L744,214 Q760,214 760,232 L760,244 Z';
const OP_CAB = 'M340,214 L340,190 L352,174 Q356,168 366,168 L418,168 Q432,170 432,184 L432,214 Z';
const HOUSE = 'M544,214 L544,202 Q544,196 550,196 L736,196 Q744,196 744,204 L744,214 Z';
const LEG_F = 'M232,276 L258,276 L258,298 L268,298 L268,310 L220,310 L220,298 L232,298 Z';
const LEG_R = 'M706,276 L732,276 L732,298 L744,298 L744,310 L696,310 L696,298 L706,298 Z';
const BEACON = 'M74,196 L74,188 Q74,184 79,184 L97,184 Q102,184 102,188 L102,196 Z';
const OP_BEACON = 'M372,168 L372,160 Q372,156 377,156 L395,156 Q400,156 400,160 L400,168 Z';
const MIRROR = 'M16,212 L26,212 L26,238 L16,238 Z';
const BUMPER = 'M14,262 L26,262 L26,284 L14,284 Z';
const STACK = 'M158,244 L158,192 L162,188 L170,188 L170,244 Z';

const BODY_MASK = [
	CAB,
	FRAME,
	SUPER,
	OP_CAB,
	HOUSE,
	LEG_F,
	LEG_R,
	BEACON,
	OP_BEACON,
	MIRROR,
	BUMPER,
	STACK
].join(' ');

const WINDSCREEN = 'M37,250 L45,214 Q47,208 53,208 L76,208 L76,250 Z';
const DOOR_GLASS = 'M84,208 L126,208 Q134,208 134,216 L134,250 L84,250 Z';
const OP_WINDSCREEN = 'M350,206 L350,194 Q350,188 357,184 L374,177 Q380,175 386,177 L386,206 Z';
const OP_SIDE_GLASS = 'M394,179 L410,179 Q418,179 418,187 L418,206 L394,206 Z';
const GLASS_MASK = `${WINDSCREEN} ${DOOR_GLASS} ${OP_WINDSCREEN} ${OP_SIDE_GLASS}`;

const WHEEL_L = { x: 180, y: 288, r: 32 };
const WHEEL_R = { x: 650, y: 288, r: 32 };
const WHEEL_BOX_L = circleBounds(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
const WHEEL_BOX_R = circleBounds(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

interface Point {
	x: number;
	y: number;
}

/** Boom centreline: 314 px long, rising 31.5° towards the front of the machine. */
const BOOM_A: Point = { x: 540, y: 226 };
const BOOM_B: Point = { x: 272, y: 62 };
/** Unit normal to the boom, pointing up-and-forward. */
const BOOM_N: Point = { x: 0.522, y: -0.853 };
const BOOM_STEPS = [0.38, 0.7];

/**
 * Single stepped outline: base section, then the two telescope sections. Traced as one
 * subpath so the mask can never fold back on itself and punch an evenodd hole.
 */
const BOOM_PATH =
	'M530.08,242.21 L430.33,176.47 L432.16,173.49 L346.4,121.01 L347.96,118.45 L267.56,69.25 ' +
	'L276.44,54.75 L356.84,103.95 L358.4,101.39 L444.16,153.87 L445.99,150.89 L549.92,209.79 Z';

const CABLE_BLOCK = 'M297,92 L303,92 L303,175 L317,175 L317,197 L283,197 L283,175 L297,175 Z';
const HOOK_ZONE = 'M291,197 L315,197 L315,215 L291,215 Z';
const BOOM_MASK = `${BOOM_PATH} ${CABLE_BLOCK} ${HOOK_ZONE}`;

const PUFF = 'M150,188 Q146,174 158,168 Q160,156 174,156 Q188,156 190,168 Q200,174 196,182 Q198,188 190,188 Z';

/** Half-width of the boom at t along the centreline (0 at the foot, 1 at the tip). */
function boomHalf(t: number): number {
	if (t <= 0.38) return 19 - 4 * (t / 0.38);
	if (t <= 0.7) return 15 - 3.5 * ((t - 0.38) / 0.32);
	return 11.5 - 3 * ((t - 0.7) / 0.3);
}

/** A point on one chord of the boom, `side` 1 for the top chord and -1 for the underside. */
function boomPoint(t: number, side: 1 | -1, inset = 0): Point {
	const cx = BOOM_A.x + (BOOM_B.x - BOOM_A.x) * t;
	const cy = BOOM_A.y + (BOOM_B.y - BOOM_A.y) * t;
	const h = boomHalf(t) - inset;
	return { x: cx + BOOM_N.x * h * side, y: cy + BOOM_N.y * h * side };
}

/** A quad between two stations along the boom, used for the section tones. */
function boomQuad(t0: number, t1: number, inset = 0): string {
	const topA = boomPoint(t0, 1, inset);
	const topB = boomPoint(t1, 1, inset);
	const bottomB = boomPoint(t1, -1, inset);
	const bottomA = boomPoint(t0, -1, inset);
	return `M${topA.x},${topA.y} L${topB.x},${topB.y} L${bottomB.x},${bottomB.y} L${bottomA.x},${bottomA.y} Z`;
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
	glass.addColorStop(0, 'rgba(255,255,255,0.58)');
	glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.24)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Diagonal hazard stripes, clipped to the band they belong to. */
function hazardBand(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();
	ctx.fillStyle = CHARCOAL_DARK;
	ctx.fillRect(x, y, w, h);
	ctx.fillStyle = YELLOW;
	const stripe = 9;
	for (let sx = x - h - stripe * 2; sx < x + w + h; sx += stripe * 2) {
		ctx.beginPath();
		ctx.moveTo(sx, y + h);
		ctx.lineTo(sx + stripe, y + h);
		ctx.lineTo(sx + stripe + h, y);
		ctx.lineTo(sx + h, y);
		ctx.closePath();
		ctx.fill();
	}
	ctx.restore();
}

/** Wheel well behind the tyre: a dark arch with a livery lip, drawn before the wheel tiles. */
function wheelArch(ctx: CanvasRenderingContext2D, cx: number, cy: number, fitted: boolean): void {
	ctx.beginPath();
	ctx.arc(cx, cy, 42, Math.PI, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = CHARCOAL_DARK;
	ctx.fill();

	ctx.strokeStyle = YELLOW;
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(cx, cy, 42, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(cx, cy, 42, Math.PI * 1.02, Math.PI * 1.98);
	ctx.stroke();

	if (fitted) {
		// Two-piece mudguard and its bolts.
		line(ctx, cx - 24, cy - 33, cx - 8, cy - 40, 'rgba(255,255,255,0.45)', 1.6);
		circle(ctx, cx - 27, cy - 30, 1.6, CHROME, 1);
		circle(ctx, cx + 27, cy - 30, 1.6, CHROME, 1);
	}
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

/** Picture-book hub: machined ring, five bolts and a polished centre cap. */
function wheelFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2, CHROME, 1.1);
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.11, 0, Math.PI * 2);
	ctx.stroke();
}

/** Telescopic boom: three stepped sections, laminated chords and section collars. */
function drawBoom(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, BOOM_PATH, YELLOW, 3);

	ctx.save();
	ctx.clip(new Path2D(BOOM_PATH));

	// Flat section tones so the telescope still reads at level 1.
	ctx.fillStyle = YELLOW_DEEP;
	ctx.fill(new Path2D(boomQuad(0.38, 0.7)));
	ctx.fillStyle = YELLOW_AMBER;
	ctx.fill(new Path2D(boomQuad(0.7, 1)));

	if (shaded) {
		const metal = ctx.createLinearGradient(430, 120, 500, 175);
		metal.addColorStop(0, 'rgba(255,255,255,0.34)');
		metal.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		metal.addColorStop(1, 'rgba(27,29,44,0.24)');
		ctx.fillStyle = metal;
		ctx.fillRect(250, 40, 380, 215);
	}

	// Laminated chord highlight and the centre seam behind the telescope.
	const chordStart = boomPoint(0.03, 1, 4.5);
	const chordEnd = boomPoint(0.97, 1, 4.5);
	line(ctx, chordStart.x, chordStart.y, chordEnd.x, chordEnd.y, 'rgba(255,255,255,0.34)', 2.2);

	const seamStart = boomPoint(0.04, 1, 10);
	const seamEnd = boomPoint(0.96, 1, 10);
	line(ctx, seamStart.x, seamStart.y, seamEnd.x, seamEnd.y, 'rgba(27,29,44,0.22)', 1.4);

	if (fitted) {
		// Section collars, each with a bright wear edge and rivets.
		for (const t of BOOM_STEPS) {
			const top = boomPoint(t, 1);
			const bottom = boomPoint(t, -1);
			line(ctx, top.x, top.y, bottom.x, bottom.y, CHARCOAL_DARK, 7);
			const topEdge = boomPoint(t, 1, 8);
			const bottomEdge = boomPoint(t, -1, 8);
			line(ctx, topEdge.x, topEdge.y, bottomEdge.x, bottomEdge.y, 'rgba(255,255,255,0.55)', 1.8);
		}

		// Rivet rows down both chords.
		ctx.fillStyle = CHROME;
		for (const t of [0.1, 0.22, 0.46, 0.58, 0.78, 0.88]) {
			for (const point of [boomPoint(t, 1, 3), boomPoint(t, -1, 3)]) {
				ctx.beginPath();
				ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// Luffing anchor plate and a wear pad at the foot.
		const plate = boomPoint(0.12, -1, 2);
		rect(ctx, plate.x - 9, plate.y - 5, 18, 10, CHARCOAL_LIGHT, 2, 1.4);
		line(ctx, plate.x - 4, plate.y, plate.x + 4, plate.y, CHROME, 1.4);
	}

	ctx.restore();

	// Pivot boss on the superstructure, part of the boom piece so it survives the cut-out.
	circle(ctx, 540, 226, 7.5, CHARCOAL_DARK, 2.2);
	circle(ctx, 540, 226, 2.6, CHROME, 1.2);
}

/** Hook block and its J-hook, hanging from the boom tip on a cable. */
function drawHook(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	circle(ctx, 300, 84, 4.5, CHROME, 1.6);
	circle(ctx, 300, 84, 1.8, STEEL, 1);

	line(ctx, 300, 92, 300, 175, INK, 3.2);
	line(ctx, 301.2, 94, 301.2, 174, 'rgba(255,255,255,0.5)', 1.1);

	rect(ctx, 283, 175, 34, 22, CHARCOAL, 3, 2.5);
	rect(ctx, 285, 177, 30, 3.5, YELLOW, 1, 1);
	circle(ctx, 300, 186, 6, CHROME, 1.8);
	circle(ctx, 300, 186, 1.8, STEEL, 1.2);

	// J-hook, kept inside the cut-out zone below the block.
	ctx.beginPath();
	ctx.moveTo(300, 196);
	ctx.lineTo(300, 203);
	ctx.quadraticCurveTo(300, 213, 307, 213);
	ctx.quadraticCurveTo(312, 213, 312, 206);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 5;
	ctx.stroke();
	ctx.strokeStyle = STEEL;
	ctx.lineWidth = 2.6;
	ctx.stroke();

	if (fitted) {
		line(ctx, 308, 206, 312, 206, CHROME, 2);
		circle(ctx, 288, 186, 1.6, CHROME, 1);
	}
}

export function drawRealAllTerrainCraneLevel(
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
		ctx.ellipse(400, 329, 358, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Exhaust stack stands in the gap between the cab and the front deck.
	shape(ctx, STACK, STEEL, 2.5);
	if (shaded) {
		line(ctx, 161, 194, 161, 242, 'rgba(255,255,255,0.32)', 1.5);
		line(ctx, 167, 194, 167, 242, 'rgba(0,0,0,0.3)', 1.8);
	}
	if (fitted) {
		rect(ctx, 156, 186, 18, 4, CHARCOAL_DARK, 2, 1.6);
		rect(ctx, 159, 210, 10, 3, CHARCOAL_DARK, 1, 1.2);
	}

	// Carrier chassis: one long charcoal beam under the whole machine.
	shape(ctx, FRAME, CHARCOAL, 3);
	if (shaded) {
		const rail = ctx.createLinearGradient(0, 244, 0, 276);
		rail.addColorStop(0, 'rgba(255,255,255,0.24)');
		rail.addColorStop(0.45, 'rgba(255,255,255,0.03)');
		rail.addColorStop(1, 'rgba(10,11,18,0.4)');
		ctx.save();
		ctx.clip(new Path2D(FRAME));
		ctx.fillStyle = rail;
		ctx.fillRect(140, 244, 642, 32);
		ctx.restore();
		line(ctx, 142, 245.6, 770, 245.6, 'rgba(255,255,255,0.4)', 1.8);
	}

	// Hazard chevrons along the carrier skirt, broken by the wheels.
	hazardBand(ctx, 216, 262, 396, 11);
	hazardBand(ctx, 686, 262, 92, 11);

	if (fitted) {
		// Fuel tank and locker between the front axle and the turntable.
		rect(ctx, 274, 248, 42, 18, CHROME, 8, 2.2);
		line(ctx, 288, 250, 288, 264, 'rgba(58,39,27,0.32)', 1.3);
		line(ctx, 302, 250, 302, 264, 'rgba(58,39,27,0.32)', 1.3);
		rect(ctx, 318, 250, 22, 16, CHARCOAL_LIGHT, 3, 2);
		rect(ctx, 322, 256, 6, 4, CHROME, 1, 1.2);

		// Axle tubes and leaf springs, sized off the wheel bounds.
		for (const box of [WHEEL_BOX_L, WHEEL_BOX_R]) {
			rect(ctx, box.x - 3, 266, box.w + 6, 6, STEEL, 3, 1.8);
			line(ctx, box.x + 9, 268.5, box.x + box.w - 9, 268.5, 'rgba(255,255,255,0.24)', 1.2);
		}

		// Rear plate and lamp cluster on the tail.
		rect(ctx, 760, 248, 18, 10, CREAM, 1, 1.4);
		line(ctx, 763, 251, 774, 251, 'rgba(58,39,27,0.4)', 1);
		rect(ctx, 764, 260, 12, 8, RED, 2, 1.4);
	}

	// Outriggers: beam, ram and pad on each corner, pads just clear of the road.
	shape(ctx, LEG_F, CHARCOAL, 2.5);
	shape(ctx, LEG_R, CHARCOAL, 2.5);
	rect(ctx, 236, 278, 18, 4, YELLOW, 0, 0);
	rect(ctx, 710, 278, 18, 4, YELLOW, 0, 0);
	if (fitted) {
		for (const cx of [244, 718]) {
			line(ctx, cx, 279, cx, 297, CHROME, 4.5);
			circle(ctx, cx, 296, 2, STEEL, 1);
		}
		hazardBand(ctx, 222, 300, 44, 8);
		hazardBand(ctx, 698, 300, 44, 8);
		line(ctx, 218, 312, 272, 312, 'rgba(0,0,0,0.28)', 1.4);
		line(ctx, 694, 312, 748, 312, 'rgba(0,0,0,0.28)', 1.4);
	}

	// Wheel wells and livery arches, then the tyres go on at the end.
	wheelArch(ctx, WHEEL_L.x, WHEEL_L.y, fitted);
	wheelArch(ctx, WHEEL_R.x, WHEEL_R.y, fitted);

	// Carrier cab: flat yellow shell with a charcoal belt and rocker.
	shape(ctx, CAB, YELLOW, 3);
	ctx.save();
	ctx.clip(new Path2D(CAB));
	rect(ctx, 24, 250, 122, 8, CHARCOAL, 0, 0);
	rect(ctx, 24, 258, 122, 2, CREAM, 0, 0);
	rect(ctx, 24, 266, 122, 20, CHARCOAL, 0, 0);
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 196, 0, 282);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.4, 'rgba(255,255,255,0.04)');
		paint.addColorStop(1, 'rgba(27,29,44,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(24, 194, 122, 90);
	}
	ctx.restore();

	if (fitted) {
		// Door seam, handle, step and vent grille.
		line(ctx, 80, 252, 80, 280, 'rgba(27,29,44,0.5)', 1.6);
		rect(ctx, 116, 236, 8, 4, CHROME, 1.5, 1.4);
		rect(ctx, 32, 274, 22, 5, CHROME, 2, 1.8);
		rect(ctx, 46, 254, 26, 6, CHARCOAL_DARK, 1, 1.6);
		for (let vent = 0; vent < 3; vent++) {
			line(ctx, 48, 255.5 + vent * 1.8, 70, 255.5 + vent * 1.8, 'rgba(201,210,222,0.55)', 1);
		}

		// Headlamp, amber marker and the sun visor.
		circle(ctx, 33, 270, 4.6, LAMP, 2);
		circle(ctx, 33, 258, 2.6, AMBER, 1.4);
		rect(ctx, 40, 197, 82, 4, CHARCOAL_DARK, 2, 1.6);
	}

	// Glass: raked windscreen and a door pane on the carrier cab.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 37, 208, 39, 42);
		shadeGlass(ctx, DOOR_GLASS, 84, 208, 50, 42);
	}
	if (fitted) {
		line(ctx, 48, 244, 64, 216, INK, 2);
		line(ctx, 86, 244, 104, 220, INK, 1.6);
	}

	// Carrier cab beacon.
	shape(ctx, BEACON, AMBER, 2);
	rect(ctx, 71, 194, 34, 4, CHARCOAL_DARK, 1.5, 1.8);
	if (fitted) {
		line(ctx, 79, 186, 79, 194, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 97, 186, 97, 194, 'rgba(255,255,255,0.55)', 1.2);
	}

	// Mirror and front bumper.
	shape(ctx, MIRROR, CHARCOAL_DARK, 2.2);
	rect(ctx, 17.5, 214, 7, 20, GLASS, 1.5, 1.1);
	line(ctx, 26, 228, 36, 223, INK, 2);

	shape(ctx, BUMPER, CHROME, 2.5);
	if (fitted) {
		circle(ctx, 21, 268, 2, STEEL, 1);
		circle(ctx, 21, 279, 2, STEEL, 1);
		rect(ctx, 16, 271, 8, 4, AMBER, 1, 1.2);
	}

	// Turntable deck ring: charcoal band with a cream coach line.
	shape(ctx, SUPER, YELLOW, 3);
	ctx.save();
	ctx.clip(new Path2D(SUPER));
	rect(ctx, 318, 234, 442, 10, CHARCOAL, 0, 0);
	rect(ctx, 318, 231, 442, 3, CREAM, 0, 0);
	if (shaded) {
		const house = ctx.createLinearGradient(0, 214, 0, 244);
		house.addColorStop(0, 'rgba(255,255,255,0.3)');
		house.addColorStop(0.45, 'rgba(255,255,255,0.03)');
		house.addColorStop(1, 'rgba(27,29,44,0.24)');
		ctx.fillStyle = house;
		ctx.fillRect(318, 214, 442, 30);
	}
	ctx.restore();

	// Machinery house behind the boom foot.
	shape(ctx, HOUSE, YELLOW, 3);
	ctx.save();
	ctx.clip(new Path2D(HOUSE));
	rect(ctx, 544, 208, 200, 6, 'rgba(255,255,255,0.24)', 0, 0);
	if (shaded) {
		const clad = ctx.createLinearGradient(0, 196, 0, 214);
		clad.addColorStop(0, 'rgba(255,255,255,0.34)');
		clad.addColorStop(0.55, 'rgba(255,255,255,0.04)');
		clad.addColorStop(1, 'rgba(27,29,44,0.26)');
		ctx.fillStyle = clad;
		ctx.fillRect(544, 196, 200, 18);
	}
	ctx.restore();

	// Counterweight block over the tail, spanning the house and the deck ring.
	rect(ctx, 700, 200, 44, 44, CHARCOAL, 3, 2.5);
	hazardBand(ctx, 702, 226, 40, 12);
	line(ctx, 700, 204, 744, 204, 'rgba(255,255,255,0.3)', 1.6);

	if (fitted) {
		// Machinery louvres, the deck ring bolts and the tail seam.
		rect(ctx, 566, 198, 96, 12, CHARCOAL_LIGHT, 2, 1.8);
		for (let louvre = 0; louvre < 4; louvre++) {
			line(ctx, 569, 200.5 + louvre * 2.6, 659, 200.5 + louvre * 2.6, 'rgba(201,210,222,0.5)', 1);
		}
		for (let bolt = 0; bolt < 9; bolt++) {
			circle(ctx, 336 + bolt * 46, 240, 1.5, CHROME, 0.9);
		}
		line(ctx, 322, 238, 758, 238, 'rgba(255,255,255,0.22)', 1.4);
	}

	// Operator cab on the front of the superstructure.
	shape(ctx, OP_CAB, YELLOW, 3);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(OP_CAB));
		const opPaint = ctx.createLinearGradient(340, 168, 432, 214);
		opPaint.addColorStop(0, 'rgba(255,255,255,0.36)');
		opPaint.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		opPaint.addColorStop(1, 'rgba(27,29,44,0.2)');
		ctx.fillStyle = opPaint;
		ctx.fillRect(340, 166, 94, 50);
		ctx.restore();
	}
	rect(ctx, 344, 168, 86, 4, CHARCOAL_DARK, 2, 1.8);
	rect(ctx, 340, 204, 92, 10, CHARCOAL, 0, 0);
	if (fitted) {
		line(ctx, 390, 208, 390, 214, 'rgba(27,29,44,0.5)', 1.4);
		rect(ctx, 422, 196, 6, 14, CHROME, 2, 1.6);
	}

	shape(ctx, OP_WINDSCREEN, GLASS, 2.4);
	shape(ctx, OP_SIDE_GLASS, GLASS, 2.4);
	if (shaded) {
		shadeGlass(ctx, OP_WINDSCREEN, 350, 175, 36, 31);
		shadeGlass(ctx, OP_SIDE_GLASS, 394, 179, 24, 27);
	}
	if (fitted) {
		line(ctx, 356, 200, 372, 180, INK, 1.6);
	}

	// Operator cab beacon.
	shape(ctx, OP_BEACON, AMBER, 2);
	rect(ctx, 369, 166, 34, 4, CHARCOAL_DARK, 1.5, 1.8);

	// Boom and hook: last painted piece, so the telescope sits proud of the house.
	drawBoom(ctx, shaded, fitted);
	drawHook(ctx, fitted);

	// Both wheels share the one wheel part; the rear tile is the front mirrored.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r, finish);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r, finish);

	if (lit) {
		// Rim light: cab roof, operator cab, boom top chord, hook block and frame top.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(54, 198);
		ctx.lineTo(122, 198);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(368, 170);
		ctx.lineTo(414, 170);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(286, 176);
		ctx.lineTo(314, 176);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2;
		const boomA = boomPoint(0.05, 1, 1.5);
		const boomB = boomPoint(0.95, 1, 1.5);
		ctx.beginPath();
		ctx.moveTo(boomA.x, boomA.y);
		ctx.lineTo(boomB.x, boomB.y);
		ctx.stroke();

		// Headlamp glow and both beacon flashes.
		const glow = ctx.createRadialGradient(33, 270, 1, 33, 270, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(33, 270, 28, 0, Math.PI * 2);
		ctx.fill();

		const beaconFront = ctx.createRadialGradient(88, 190, 1, 88, 190, 22);
		beaconFront.addColorStop(0, 'rgba(255,183,3,0.5)');
		beaconFront.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beaconFront;
		ctx.beginPath();
		ctx.arc(88, 190, 22, 0, Math.PI * 2);
		ctx.fill();

		const beaconRear = ctx.createRadialGradient(386, 162, 1, 386, 162, 18);
		beaconRear.addColorStop(0, 'rgba(255,183,3,0.46)');
		beaconRear.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beaconRear;
		ctx.beginPath();
		ctx.arc(386, 162, 18, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const at of [WHEEL_L, WHEEL_R]) {
			ctx.beginPath();
			ctx.ellipse(at.x, 320, 27, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain over every painted surface, never the glazing or the tyres.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(
			WHEEL_R.x,
			WHEEL_R.y,
			WHEEL_R.r
		)} ${BUMPER}`;
		// Intersect the body first, then punch out glass, chrome and tyres. Without the first
		// clip the evenodd parity would re-open the wheel-only area outside the body.
		ctx.clip(new Path2D(BODY_MASK), 'nonzero');
		ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');
		let seed = 43;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 380; i++) {
			const px = 14 + rand() * 770;
			const py = 154 + rand() * 158;
			const size = 1.4 + rand() * 1.2;
			ctx.globalAlpha = 0.08 + rand() * 0.07;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = CREAM;
		for (let i = 0; i < 150; i++) {
			const px = 14 + rand() * 770;
			const py = 154 + rand() * 158;
			const size = 1.2 + rand() * 1;
			ctx.globalAlpha = 0.18 + rand() * 0.11;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes over the cab, frame and superstructure flank.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[36, 230, 132, 228],
			[160, 252, 300, 251],
			[360, 222, 520, 221],
			[560, 230, 748, 229]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Boom grain and the polished run down its top chord.
		ctx.save();
		ctx.clip(new Path2D(BOOM_PATH));
		let boomSeed = 71;
		const boomRand = () => {
			boomSeed = (boomSeed * 9301 + 49297) % 233280;
			return boomSeed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 150; i++) {
			const px = 250 + boomRand() * 380;
			const py = 50 + boomRand() * 190;
			ctx.globalAlpha = 0.07 + boomRand() * 0.06;
			ctx.fillRect(px, py, 1.6, 1.6);
		}
		const shineStart = boomPoint(0.06, 1, 2.4);
		const shineEnd = boomPoint(0.94, 1, 2.4);
		ctx.globalAlpha = 0.32;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(shineStart.x, shineStart.y);
		ctx.lineTo(shineEnd.x, shineEnd.y);
		ctx.stroke();
		ctx.restore();

		// Hook sheen: a polished cheek on the block and a catch on the sheave.
		line(ctx, 286.6, 181.5, 286.6, 193, 'rgba(255,255,255,0.58)', 1.5);
		ctx.strokeStyle = 'rgba(255,255,255,0.66)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.arc(300, 186, 4.6, Math.PI * 1.08, Math.PI * 1.78);
		ctx.stroke();

		// Exhaust puff drifting off the stack.
		ctx.save();
		ctx.clip(new Path2D(PUFF));
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[162, 180, 5],
			[174, 172, 6],
			[188, 168, 4.5]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Glass sheen and the sparkle in the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(52, 244);
		ctx.lineTo(70, 212);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(96, 242);
		ctx.lineTo(110, 218);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(358, 198);
		ctx.lineTo(376, 180);
		ctx.stroke();
		ctx.restore();

		// Glints on paint, chrome and glass, all clear of the tyres.
		glint(ctx, 420, 155, 5.4);
		glint(ctx, 74, 216, 5);
		glint(ctx, 646, 222, 4.6);
		glint(ctx, 690, 226, 4.2);
		glint(ctx, 300, 187, 3.2);
		glint(ctx, 386, 164, 3);

		// Hub hardware on both wheels; both finishes are mirror-symmetric.
		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Paint chips on the working edges, and soot softened onto the stack cap.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[34, 260, 8, 2.2, 0.42],
			[62, 279, 7, 2, 0.34],
			[266, 273, 10, 2, 0.3],
			[604, 271, 7, 2, 0.3],
			[772, 272, 6, 2.4, 0.4],
			[292, 190, 8, 2, 0.3]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		// Cable catchlight between the sheave and the hook block.
		line(ctx, 300.6, 96, 300.6, 150, 'rgba(255,255,255,0.8)', 1.4);
		glint(ctx, 300, 100, 2.2);

		// Outrigger pads: bright top edges on the hazard stripes.
		for (const padX of [244, 720]) {
			line(ctx, padX - 21, 300.4, padX + 21, 300.4, 'rgba(255,255,255,0.6)', 1.4);
		}
	}

	ctx.restore();
}

export function drawRealAllTerrainCrane(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealAllTerrainCraneLevel(ctx, x, y, scale, 5);
}
