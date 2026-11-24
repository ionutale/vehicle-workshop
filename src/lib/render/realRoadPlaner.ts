/**
 * Road planer (cold milling machine) art, cut into the same five-piece kit as the other
 * realistic works machines. An orange planer facing left: a long low milling body with a
 * conveyor boot on the front deck, a discharge hood cantilevered out over the nose on its
 * rising conveyor, the cutting drum in a housing under the middle, and the glazed operator
 * cab at the rear over the back axle. One wheel piece serves both axles.
 *
 * The drum housing is the naming cue, so it hangs below the chassis with the toothed barrel
 * visible in a dark working aperture. Level 5 is the production target: shaded, fully fitted,
 * lit with a cast shadow, contact patches, rim light and the headlamp, work-lamp and beacon
 * glow, then the picture-book finish: paint grain, gloss, glints, worked paint, a polished
 * drum and housing, a sheened conveyor and the exhaust puff.
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

const ORANGE = '#F4A261';
const ORANGE_DARK = '#D9834A';
const ORANGE_DEEP = '#AF5F2B';
const CHARCOAL = '#2B2D42';
const CHARCOAL_LIGHT = '#3D405B';
const CAVITY = '#191B29';
const AMBER = '#FFB703';
const LAMP = '#FFF3B0';
const RED = '#E0455A';
const CREAM = '#FFF6E0';

/** Art box 760 x 320, road at 252. Front (the conveyor discharge) faces left. */
const FRONT_WHEEL = { x: 180, y: 222, r: 30 };
/** Rear axle, tucked under the cab; the same wheel tile, flipped in its slot. */
const REAR_WHEEL = { x: 600, y: 222, r: 30 };

/**
 * One outline for the nose, deck, rising conveyor, discharge hood, cab, rear engine cover
 * and the two wheel arches. The conveyor tapers from a deep trough at the hood into the
 * boot, and its underside leaves a wedge of sky over the front frame. The bottom edge
 * arches over both tyres with a plain arc — no circle subpaths, so evenodd never punches
 * a wheel hole.
 */
const SHELL =
	'M70,214 L70,152 L300,152 L152,118 L92,118 L92,74 L104,62 L152,62 L368,152 L540,152 L558,96 L694,96 Q718,96 718,120 L718,214 L630,214 A31,31 0 0 0 570,214 L210,214 A31,31 0 0 0 150,214 L70,214 Z';

/** Amber beacon on the cab roof: a fitting outside the shell, its own body subpath. */
const BEACON = 'M640,96 L640,84 Q640,78 646,78 L658,78 Q664,78 664,84 L664,96 Z';

/** Exhaust stack on the deck between the conveyor boot and the cab. */
const STACK = 'M510,152 L510,124 Q510,118 516,118 L524,118 Q530,118 530,124 L530,152 Z';

/** Conveyor lift strut: only the two ends touch the shell (deck and belt underside). */
const STRUT = 'M230,152 L254,152 L210,131.3 L186,125.8 Z';

/** Body mask: shell, the strut bridging the wedge, and the two rooftop fittings. */
const BODY_MASK = `${SHELL} ${STRUT} ${BEACON} ${STACK}`;

/**
 * Drum housing: a wide bolted plate that bridges the belly between the arches and hangs below
 * it, its ends dropping past the cutting drum so the cut reads as open at the bottom. One
 * subpath, no circle cut, so the drum art inside is never punched out.
 */
const HOUSING =
	'M292,190 L528,190 L534,200 L534,246 Q534,252 528,252 L292,252 Q286,252 286,246 L286,200 Z';

/** Conveyor belt run: the dark belt sitting inside the trough, deck rim above it. */
const BELT = 'M152,68 L350,150 L350,165 L152,83 Z';
/** Charcoal engine hood between the conveyor boot and the cab. */
const HOOD_BAND = 'M372,152 L540,152 L540,178 L372,178 Z';
/** Charcoal roof cap and the rear engine cover. */
const ROOF_BAND = 'M558,96 L706,96 Q718,96 718,108 L718,114 L556,114 Z';
const REAR_BAND = 'M704,112 L718,112 L718,214 L704,214 Z';
/** Charcoal skirt along the belly, interrupted by the arches. */
const SKIRT = 'M70,198 L718,198 L718,214 L70,214 Z';
/** Cab pillar trim. */
const A_PILLAR = 'M540,152 L558,96 L562,96 L542,152 Z';
const B_PILLAR = 'M594,104 L604,104 L604,148 L594,148 Z';

/** Glazing: raked windscreen and the door pane, separated by the B-pillar. */
const WINDSCREEN = 'M546,148 L560,104 L594,104 L594,148 Z';
const SIDE_GLASS =
	'M604,104 L692,104 Q700,104 700,112 L700,138 Q700,146 692,146 L604,146 Z';
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Door and cab panels are painted into the body, so no door piece is needed. */
const DOOR = { x: 602, y: 150, w: 100, h: 34 };

function panel(ctx: CanvasRenderingContext2D, d: string, fill: string): void {
	ctx.fillStyle = fill;
	ctx.fill(new Path2D(d));
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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.6)');
	glass.addColorStop(0.46, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(80,160,205,0.32)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Four-point sparkle with a warm core, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
	ctx.lineWidth = 2.8;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.7;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 1.8, 0, Math.PI * 2);
	ctx.fill();
}

/** Amber-and-charcoal diagonal hazard band, clipped to the area it is given. */
function hazardBand(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number
): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();
	for (let sx = x - h; sx < x + w + h; sx += 18) {
		panel(ctx, `M${sx},${y + h} L${sx + h},${y} L${sx + h + 9},${y} L${sx + 9},${y + h} Z`, AMBER);
	}
	ctx.restore();
}

/** Deterministic picture-book grain over the painted shell, never glass, drum or tyres. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${HOUSING} ${BEACON} ${STACK} ${circleMask(
		FRONT_WHEEL.x,
		FRONT_WHEEL.y,
		FRONT_WHEEL.r
	)} ${circleMask(REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r)}`;

	ctx.save();
	ctx.clip(new Path2D(BODY_MASK), 'evenodd');
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');

	let seed = 71;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 360; i++) {
		const px = 74 + rnd() * 642;
		const py = 66 + rnd() * 144;
		const size = 1.4 + rnd() * 1.4;
		ctx.globalAlpha = 0.07 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}
	// Warm primer flecks keep the orange from reading as flat plastic.
	ctx.fillStyle = ORANGE_DEEP;
	for (let i = 0; i < 150; i++) {
		const px = 74 + rnd() * 642;
		const py = 66 + rnd() * 144;
		const size = 1.2 + rnd() * 1.2;
		ctx.globalAlpha = 0.09 + rnd() * 0.07;
		ctx.fillRect(px, py, size, size);
	}
	// A little pale road dust gathers along the working edges.
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 130; i++) {
		const px = 74 + rnd() * 642;
		const py = 150 + rnd() * 62;
		const size = 1.1 + rnd() * 1.1;
		ctx.globalAlpha = 0.1 + rnd() * 0.08;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();

	// Long brush sweeps down the flank and the conveyor.
	ctx.save();
	ctx.clip(new Path2D(BODY_MASK), 'evenodd');
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');
	ctx.strokeStyle = 'rgba(255,255,255,0.15)';
	ctx.lineWidth = 2;
	for (const [x1, y1, x2, y2] of [
		[386, 168, 532, 166],
		[390, 190, 530, 188],
		[562, 190, 700, 188],
		[178, 80, 348, 144],
		[100, 72, 148, 100]
	]) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.quadraticCurveTo((x1 + x2) / 2, y1 - 1.6, x2, y2);
		ctx.stroke();
	}
	ctx.strokeStyle = 'rgba(255,255,255,0.1)';
	ctx.lineWidth = 1.3;
	for (const [x1, y1, x2, y2] of [
		[410, 160, 520, 159],
		[100, 84, 144, 104],
		[610, 178, 690, 177]
	]) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	ctx.restore();
}

/** Level-5 gloss: broad lacquer rolls over the flank, the belt and the cab. */
function finishSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Engine flank: the light rolls off the deck and dies under the waistline.
	const flank = ctx.createLinearGradient(380, 156, 520, 204);
	flank.addColorStop(0, 'rgba(255,255,255,0.24)');
	flank.addColorStop(0.55, 'rgba(255,255,255,0.06)');
	flank.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = flank;
	ctx.fillRect(378, 154, 148, 50);

	// Cab flank: a long polish over the door.
	const cab = ctx.createLinearGradient(552, 100, 690, 190);
	cab.addColorStop(0, 'rgba(255,255,255,0.22)');
	cab.addColorStop(0.6, 'rgba(255,255,255,0.04)');
	cab.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cab;
	ctx.fillRect(552, 96, 168, 104);

	// Belt edge catches one continuous gloss from the hood to the boot.
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(162, 71);
	ctx.lineTo(346, 147);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.14)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(168, 86);
	ctx.lineTo(332, 152);
	ctx.stroke();

	// Polished hood and deck lip.
	line(ctx, 96, 64.5, 148, 64.5, 'rgba(255,255,255,0.24)', 1.8);
	line(ctx, 374, 154.5, 538, 154.5, 'rgba(255,255,255,0.26)', 1.8);
	ctx.restore();
}

/** Machined hub ring, crescent and bolts; the pattern mirrors cleanly in its slot. */
function hubDetail(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.48, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(58,39,27,0.3)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.29, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.85)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.37, Math.PI * 1.05, Math.PI * 1.6);
	ctx.stroke();

	circle(ctx, cx, cy, r * 0.1, CREAM, 0.9);
}

/** Cutting drum: two machined end flanges joined by the toothed barrel. */
const DRUM_END_L = { x: 320, y: 232, r: 14 };
const DRUM_END_R = { x: 500, y: 232, r: 14 };

/** The cutting drum: a horizontal toothed barrel on two machined end flanges. */
function drawDrum(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	// Picks biting out of the barrel's underside, down to the cut line.
	for (let i = 0; i < 17; i++) {
		const bx = 328 + i * 10.25;
		ctx.beginPath();
		ctx.moveTo(bx - 3.4, 241);
		ctx.lineTo(bx, 252);
		ctx.lineTo(bx + 3.4, 241);
		ctx.closePath();
		ctx.fillStyle = i % 2 ? '#7E8897' : CHROME;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.1;
		ctx.stroke();
	}

	// Barrel, a bright cylinder seen along its length.
	rect(ctx, 320, 220, 180, 24, STEEL, 7, 2.6);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(320, 220, 180, 24);
		ctx.clip();
		const barrel = ctx.createLinearGradient(0, 218, 0, 246);
		barrel.addColorStop(0, 'rgba(255,255,255,0.42)');
		barrel.addColorStop(0.42, 'rgba(255,255,255,0.05)');
		barrel.addColorStop(1, 'rgba(8,10,18,0.44)');
		ctx.fillStyle = barrel;
		ctx.fillRect(320, 218, 180, 28);
		ctx.restore();
	}

	// Machined end flanges.
	for (const flange of [DRUM_END_L, DRUM_END_R]) {
		const { x: cx, y: cy, r } = flange;
		circle(ctx, cx, cy, r, '#5C6472', 2.8);
		circle(ctx, cx, cy, r * 0.64, CHARCOAL_LIGHT, 1.8);
		circle(ctx, cx, cy, r * 0.22, CHROME, 1.2);

		if (shaded) {
			ctx.save();
			ctx.beginPath();
			ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
			ctx.clip();
			const face = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
			face.addColorStop(0, 'rgba(255,255,255,0.34)');
			face.addColorStop(0.5, 'rgba(255,255,255,0.02)');
			face.addColorStop(1, 'rgba(8,10,18,0.42)');
			ctx.fillStyle = face;
			ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
			ctx.restore();
		}

		if (fitted) {
			for (let i = 0; i < 6; i++) {
				const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
				circle(ctx, cx + Math.cos(a) * r * 0.43, cy + Math.sin(a) * r * 0.43, 1.2, CHROME, 0.9);
			}
		}

		if (lit) {
			ctx.strokeStyle = 'rgba(255,255,255,0.55)';
			ctx.lineWidth = 2.2;
			ctx.beginPath();
			ctx.arc(cx, cy, r - 1.4, Math.PI * 1.05, Math.PI * 1.6);
			ctx.stroke();
		}
	}

	if (lit) {
		// The barrel's lit crown.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(336, 221.6);
		ctx.lineTo(484, 221.6);
		ctx.stroke();
	}

	if (finish) {
		// Polished barrel: a long crown gloss and a warm bounce off the cut.
		ctx.save();
		ctx.beginPath();
		ctx.rect(320, 220, 180, 24);
		ctx.clip();
		const barrelSheen = ctx.createLinearGradient(0, 220, 0, 244);
		barrelSheen.addColorStop(0, 'rgba(255,255,255,0.32)');
		barrelSheen.addColorStop(0.4, 'rgba(255,255,255,0.08)');
		barrelSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = barrelSheen;
		ctx.fillRect(320, 220, 180, 24);
		line(ctx, 336, 223.4, 484, 223.4, 'rgba(255,255,255,0.62)', 1.8);
		line(ctx, 338, 240.6, 482, 240.6, 'rgba(255,203,112,0.18)', 2.6);
		ctx.restore();

		// Machined flange rings catch a crescent of sky on the lit side.
		for (const flange of [DRUM_END_L, DRUM_END_R]) {
			const { x: cx, y: cy, r } = flange;
			ctx.save();
			ctx.beginPath();
			ctx.arc(cx, cy, r - 1.2, 0, Math.PI * 2);
			ctx.clip();
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			ctx.lineWidth = 1.8;
			ctx.beginPath();
			ctx.arc(cx, cy, r * 0.55, Math.PI * 1.02, Math.PI * 1.98);
			ctx.stroke();
			ctx.strokeStyle = 'rgba(255,203,112,0.18)';
			ctx.lineWidth = 2.4;
			ctx.beginPath();
			ctx.arc(cx, cy, r * 0.82, Math.PI * 0.28, Math.PI * 0.72);
			ctx.stroke();
			ctx.restore();
		}

		glint(ctx, 356, 226, 3.4);
		glint(ctx, 466, 232, 2.8);
		ctx.fillStyle = 'rgba(255,246,224,0.8)';
		for (const bx of [356, 408, 460]) {
			ctx.beginPath();
			ctx.arc(bx, 250, 1.1, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}

/** The drum housing: side plates, aperture, water bar, hydraulics and the drum inside. */
function drawHousing(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	shape(ctx, HOUSING, ORANGE);

	ctx.save();
	ctx.clip(new Path2D(HOUSING));

	// Charcoal flange tying the housing to the machine, and the lower rail.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(286, 190, 250, 8);
	ctx.fillRect(286, 246, 250, 8);

	// Plate seams, so the housing reads as a bolted cover.
	ctx.strokeStyle = 'rgba(58,39,27,0.3)';
	ctx.lineWidth = 1.6;
	ctx.strokeRect(292.5, 199.5, 237, 53);

	if (shaded) {
		const plate = ctx.createLinearGradient(0, 190, 0, 252);
		plate.addColorStop(0, 'rgba(255,255,255,0.24)');
		plate.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		plate.addColorStop(1, 'rgba(30,18,8,0.32)');
		ctx.fillStyle = plate;
		ctx.fillRect(286, 190, 250, 64);
	}

	// Dark working aperture below the plate.
	ctx.beginPath();
	ctx.moveTo(300, 204);
	ctx.lineTo(520, 204);
	ctx.lineTo(520, 252);
	ctx.lineTo(300, 252);
	ctx.closePath();
	ctx.fillStyle = CAVITY;
	ctx.fill();

	// Water spray bar feeding the picks from above the drum.
	ctx.strokeStyle = CHROME;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(306, 210);
	ctx.lineTo(514, 210);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(308, 209);
	ctx.lineTo(512, 209);
	ctx.stroke();
	for (let sx = 320; sx <= 500; sx += 45) {
		line(ctx, sx, 212, sx, 217, CHROME, 1.3);
	}

	drawDrum(ctx, shaded, fitted, lit, finish);

	// Rubber scraper flaps hugging the drum at both ends of the cut.
	ctx.fillStyle = CHARCOAL;
	ctx.fill(new Path2D('M300,220 L318,220 L318,246 Q310,250 300,250 Z'));
	ctx.fill(new Path2D('M502,220 L520,220 L520,250 Q510,250 502,246 Z'));

	if (fitted) {
		// Flange bolts on the top rail.
		for (const bx of [300, 330, 360, 460, 490, 520]) {
			circle(ctx, bx, 194, 1.7, CHROME, 0.9);
		}
		// Drive motor and hoses on the rear end plate.
		rect(ctx, 504, 222, 26, 20, CHARCOAL_LIGHT, 3, 1.8);
		circle(ctx, 517, 232, 5.2, CHROME, 1.4);
		ctx.strokeStyle = STEEL;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(506, 224);
		ctx.quadraticCurveTo(500, 214, 498, 208);
		ctx.stroke();
		ctx.strokeStyle = CHROME;
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(505, 223);
		ctx.quadraticCurveTo(499, 213, 497, 207);
		ctx.stroke();
		// Cutting-depth rod with its scale on the front plate.
		rect(ctx, 291, 208, 7, 26, CHROME, 2, 1.4);
		for (let tick = 0; tick < 4; tick++) {
			line(ctx, 292, 214 + tick * 5, 296, 214 + tick * 5, 'rgba(43,45,66,0.6)', 1);
		}
	}

	if (finish) {
		// Polished rails and plate edge: one long sky line along the housing.
		line(ctx, 294, 192.4, 526, 192.4, 'rgba(255,255,255,0.4)', 1.6);
		line(ctx, 298, 200.6, 522, 200.6, 'rgba(255,255,255,0.24)', 1.4);
		line(ctx, 291.6, 204, 291.6, 246, 'rgba(255,255,255,0.3)', 2);
		// The chrome water bar keeps a hot specular along its lit top.
		line(ctx, 310, 208.6, 512, 208.6, 'rgba(255,255,255,0.75)', 1.4);

		// Scuffed paint on the leading corners and road dust at the rail.
		ctx.fillStyle = CREAM;
		ctx.globalAlpha = 0.4;
		ctx.fillRect(310, 202, 5, 2);
		ctx.fillRect(518, 202, 6, 2);
		ctx.globalAlpha = 0.28;
		for (const [px, py] of [
			[306, 244],
			[368, 248],
			[452, 248],
			[516, 244]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, 1.3, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
	}

	ctx.restore();

	// Re-stroke so the cavity cannot eat the housing outline.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(HOUSING));
}

export function drawRealRoadPlanerLevel(
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
		// Cast shadow: a soft spread plus a tighter core under the machine.
		ctx.save();
		ctx.fillStyle = INK;
		ctx.globalAlpha = 0.17;
		ctx.beginPath();
		ctx.ellipse(398, 257, 336, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.09;
		ctx.beginPath();
		ctx.ellipse(394, 254, 252, 6, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell, then the livery blocks painted inside it.
	shape(ctx, SHELL, ORANGE);

	ctx.save();
	ctx.clip(new Path2D(SHELL));
	panel(ctx, BELT, CHARCOAL);
	panel(ctx, HOOD_BAND, CHARCOAL);
	panel(ctx, ROOF_BAND, CHARCOAL);
	panel(ctx, REAR_BAND, CHARCOAL);
	panel(ctx, SKIRT, CHARCOAL);
	panel(ctx, A_PILLAR, CHARCOAL);
	panel(ctx, B_PILLAR, CHARCOAL);
	ctx.restore();

	if (shaded) {
		// Body paint: deck light falling into a low-body shade.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const paint = ctx.createLinearGradient(0, 44, 0, 214);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.34, 'rgba(255,255,255,0.04)');
		paint.addColorStop(0.78, 'rgba(120,60,20,0.12)');
		paint.addColorStop(1, 'rgba(58,39,27,0.3)');
		ctx.fillStyle = paint;
		ctx.fillRect(60, 40, 670, 180);

		// Belt picks up a cool sky sheen; the skirt stays matte.
		ctx.save();
		ctx.clip(new Path2D(BELT));
		const belt = ctx.createLinearGradient(148, 62, 352, 168);
		belt.addColorStop(0, 'rgba(207,239,255,0.18)');
		belt.addColorStop(0.55, 'rgba(255,255,255,0.03)');
		belt.addColorStop(1, 'rgba(0,0,0,0.26)');
		ctx.fillStyle = belt;
		ctx.fillRect(148, 60, 210, 112);
		ctx.restore();

		// Rear cover catches a cooler light away from the cab.
		const rear = ctx.createLinearGradient(700, 112, 720, 214);
		rear.addColorStop(0, 'rgba(207,239,255,0.14)');
		rear.addColorStop(1, 'rgba(0,0,0,0.22)');
		ctx.fillStyle = rear;
		ctx.fillRect(700, 110, 22, 106);
		ctx.restore();
	}

	// Re-stroke the shell so the livery blocks cannot eat the outline.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Conveyor lift strut, bridging the wedge ahead of the boot.
	shape(ctx, STRUT, CHARCOAL_LIGHT);
	ctx.save();
	ctx.clip(new Path2D(STRUT));
	line(ctx, 252, 150.5, 188, 127, STEEL, 13);
	line(ctx, 252, 150.5, 188, 127, CHARCOAL, 7);
	line(ctx, 214, 137.5, 190, 127.7, CHROME, 3.8);
	circle(ctx, 246, 148.5, 3.4, CHARCOAL, 1.4);
	circle(ctx, 194, 128.6, 2.6, CHROME, 1.2);
	ctx.restore();

	// Stack and beacon are their own body subpaths, painted as hardware.
	shape(ctx, STACK, STEEL, 2.4);
	line(ctx, 516.5, 126, 516.5, 148, 'rgba(255,255,255,0.34)', 2);
	rect(ctx, 511, 118, 18, 5, CHROME, 1, 1.8);
	shape(ctx, BEACON, AMBER, 2.2);
	rect(ctx, 641, 92, 22, 4, CHARCOAL, 1, 1.4);

	// Conveyor: belt tread and the boot into the deck.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	if (fitted) {
		for (let bx = 172; bx <= 344; bx += 34) {
			const ty = 68 + (bx - 152) * 0.414;
			line(ctx, bx, ty + 4, bx + 4, ty + 11, 'rgba(201,210,222,0.42)', 1.9);
		}
		for (const [bx, by] of [
			[180, 121],
			[220, 130],
			[260, 139]
		]) {
			circle(ctx, bx, by, 1.7, CHROME, 0.9);
		}
	}
	// The boot side cover where the belt drops into the chassis.
	rect(ctx, 308, 156, 64, 24, CHARCOAL, 3, 2.2);
	line(ctx, 314, 162, 366, 162, 'rgba(201,210,222,0.26)', 1.4);
	line(ctx, 314, 174, 366, 174, 'rgba(201,210,222,0.16)', 1.2);
	ctx.restore();

	// Front frame: water tank, sight glass and the toolbox on the deck flank.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	if (fitted) {
		rect(ctx, 100, 160, 84, 34, CHARCOAL_LIGHT, 4, 2.2);
		rect(ctx, 108, 164, 6, 26, ORANGE, 1.5, 1.4);
		rect(ctx, 150, 164, 6, 26, ORANGE, 1.5, 1.4);
		rect(ctx, 164, 166, 9, 22, GLASS, 2, 1.2);
		line(ctx, 166, 180, 171, 180, 'rgba(43,45,66,0.5)', 1);
		circle(ctx, 120, 159, 4, CHROME, 1.6);
		circle(ctx, 120, 159, 1.6, CHARCOAL, 0.8);
		rect(ctx, 196, 166, 70, 28, ORANGE_DARK, 3, 2.2);
		rect(ctx, 252, 178, 7, 3, CHROME, 1, 1);
		line(ctx, 202, 172, 260, 172, 'rgba(58,39,27,0.28)', 1.2);
		rect(ctx, 200, 200, 32, 6, CHARCOAL, 1.5, 1.4);
	}
	ctx.restore();

	// Engine hood: louvres, hatch, cooler and hydraulics on the visible flank.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	if (fitted) {
		for (let louvre = 0; louvre < 3; louvre++) {
			line(ctx, 388, 160 + louvre * 6, 462, 159 + louvre * 6, 'rgba(207,239,255,0.28)', 2);
		}
		rect(ctx, 478, 158, 52, 18, ORANGE, 3, 1.8);
		rect(ctx, 490, 166, 10, 3, CHARCOAL_LIGHT, 1, 1);
		rect(ctx, 384, 174, 80, 16, CHARCOAL_LIGHT, 3, 2);
		for (let slat = 0; slat < 3; slat++) {
			line(ctx, 390, 178 + slat * 4, 456, 177 + slat * 4, 'rgba(201,210,222,0.4)', 1.4);
		}
		// Hydraulic hoses and the valve block above the drum housing.
		ctx.strokeStyle = STEEL;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(466, 180);
		ctx.quadraticCurveTo(480, 184, 494, 186);
		ctx.stroke();
		ctx.strokeStyle = CHROME;
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.moveTo(467, 179);
		ctx.quadraticCurveTo(480, 183, 494, 185);
		ctx.stroke();
		rect(ctx, 496, 180, 30, 9, STEEL, 2, 1.6);
	}
	ctx.restore();

	// Cab furniture: door, handle, hinges, sill and steps.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, ORANGE, 3, 2.4);
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	if (shaded) {
		ctx.save();
		ctx.clip(
			new Path2D(
				`M${DOOR.x},${DOOR.y} L${DOOR.x + DOOR.w},${DOOR.y} L${DOOR.x + DOOR.w},${DOOR.y + DOOR.h} L${DOOR.x},${DOOR.y + DOOR.h} Z`
			)
		);
		const door = ctx.createLinearGradient(0, DOOR.y, 0, DOOR.y + DOOR.h);
		door.addColorStop(0, 'rgba(255,255,255,0.2)');
		door.addColorStop(1, 'rgba(25,18,10,0.16)');
		ctx.fillStyle = door;
		ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
		ctx.restore();
	}
	if (fitted) {
		line(ctx, DOOR.x, DOOR.y + 1, DOOR.x + DOOR.w, DOOR.y + 1, 'rgba(58,39,27,0.28)', 1.2);
		rect(ctx, 688, 158, 10, 4, CHROME, 1.2, 1.4);
		rect(ctx, 603, 154, 4, 7, STEEL, 1, 1.2);
		rect(ctx, 603, 172, 4, 7, STEEL, 1, 1.2);
		line(ctx, 556, 112, 552, 146, CHROME, 2);
		rect(ctx, 546, 194, 20, 7, CHARCOAL_LIGHT, 1.5, 1.6);
		rect(ctx, 550, 204, 17, 7, CHARCOAL_LIGHT, 1.5, 1.6);
	}
	ctx.restore();

	// Front face: work lamp, marker and the bumper block.
	if (fitted) {
		circle(ctx, 84, 178, 7.4, CHROME, 2.2);
		circle(ctx, 84, 178, 4.4, LAMP, 1.2);
		circle(ctx, 81, 199, 3.4, AMBER, 1.2);
		rect(ctx, 71, 190, 15, 22, CHARCOAL, 2, 2);
		line(ctx, 74, 194, 74, 208, 'rgba(201,210,222,0.5)', 1.4);
	}

	// Hood: chute mouth and the work lamps on the discharge end.
	if (fitted) {
		ctx.fillStyle = CAVITY;
		ctx.fill(new Path2D('M96,94 L112,94 L108,114 L96,114 Z'));
		line(ctx, 94, 92, 94, 116, CHROME, 2.2);
		line(ctx, 98, 96, 110, 96, 'rgba(201,210,222,0.4)', 1.2);
		// Work lamps: housings on the hood's lower edge, lenses facing forward.
		for (const lx of [120, 137]) {
			rect(ctx, lx, 98, 13, 9, CHARCOAL, 2, 1.5);
			rect(ctx, lx + 1.5, 100, 4, 5, LAMP, 1, 1);
		}
	}

	// Beacon and roof markers.
	if (fitted) {
		line(ctx, 646, 81, 646, 91, 'rgba(255,255,255,0.62)', 1.4);
		rect(ctx, 642, 88, 20, 3, 'rgba(255,255,255,0.35)', 1, 1);
		for (const mx of [566, 578, 590]) {
			rect(ctx, mx, 98, 7, 4, AMBER, 1, 1);
		}
	}

	// Rear: engine slots, hazard chevrons, lamps and the plate.
	if (fitted) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		for (let slot = 0; slot < 3; slot++) {
			line(ctx, 707, 122 + slot * 7, 715, 121 + slot * 7, 'rgba(201,210,222,0.32)', 1.6);
		}
		hazardBand(ctx, 636, 194, 82, 20);
		ctx.restore();
		rect(ctx, 706, 150, 9, 12, RED, 1.4, 1.4);
		rect(ctx, 706, 164, 9, 8, AMBER, 1.2, 1.2);
		rect(ctx, 706, 176, 9, 11, CREAM, 1, 1.2);
		line(ctx, 707, 180, 714, 180, 'rgba(58,39,27,0.5)', 1);
		line(ctx, 707, 183, 714, 183, 'rgba(58,39,27,0.4)', 1);
	}

	// Glazing, then the sill trim over it.
	shape(ctx, GLASS_MASK, GLASS, 2.5);

	if (shaded) {
		glassShade(ctx, WINDSCREEN, 546, 104, 48, 44);
		glassShade(ctx, SIDE_GLASS, 604, 104, 96, 42);
		line(ctx, 552, 144, 578, 110, 'rgba(255,255,255,0.5)', 2.4);
	}

	if (fitted) {
		line(ctx, 606, 142, 696, 142, 'rgba(43,45,66,0.32)', 1.4);
		line(ctx, 606, 108, 696, 108, 'rgba(255,255,255,0.32)', 1.2);
	}

	// Drum, then the wheels, matching the slot z-order. The rear slot flips its tile, so
	// its finish is drawn mirrored to match the assembled game.
	drawHousing(ctx, shaded, fitted, lit, finish);

	wheel(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r, finish);
	ctx.save();
	if (finish) {
		ctx.translate(REAR_WHEEL.x * 2, 0);
		ctx.scale(-1, 1);
	}
	wheel(ctx, REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r, finish);
	ctx.restore();

	if (finish) {
		// Machined hub hardware, mirroring the rear tile in its slot.
		hubDetail(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r);
		ctx.save();
		ctx.translate(REAR_WHEEL.x * 2, 0);
		ctx.scale(-1, 1);
		hubDetail(ctx, REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r);
		ctx.restore();
	}

	if (lit) {
		// Rim light on the roof, hood, belt, nose and rear.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(560, 97.6);
		ctx.lineTo(700, 97.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(107, 63.6);
		ctx.lineTo(150, 63.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(156, 63.5);
		ctx.lineTo(364, 150);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.36)';
		ctx.beginPath();
		ctx.moveTo(93.5, 78);
		ctx.lineTo(93.5, 114);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(96, 72);
		ctx.lineTo(104, 64.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(71.5, 156);
		ctx.lineTo(71.5, 210);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(716, 128);
		ctx.lineTo(716, 190);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(300, 191.6);
		ctx.lineTo(520, 191.6);
		ctx.stroke();

		// Headlamp, work-lamp and beacon glow.
		const head = ctx.createRadialGradient(84, 178, 1, 84, 178, 28);
		head.addColorStop(0, 'rgba(255,240,150,0.68)');
		head.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = head;
		ctx.beginPath();
		ctx.arc(84, 178, 28, 0, Math.PI * 2);
		ctx.fill();

		for (const lx of [121, 138]) {
			const work = ctx.createRadialGradient(lx, 102, 1, lx, 102, 15);
			work.addColorStop(0, 'rgba(255,243,176,0.55)');
			work.addColorStop(1, 'rgba(255,243,176,0)');
			ctx.fillStyle = work;
			ctx.beginPath();
			ctx.arc(lx, 102, 15, 0, Math.PI * 2);
			ctx.fill();
		}

		const beacon = ctx.createRadialGradient(652, 86, 1, 652, 86, 22);
		beacon.addColorStop(0, 'rgba(255,183,3,0.5)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(652, 86, 22, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches exactly under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const axle of [FRONT_WHEEL, REAR_WHEEL]) {
			ctx.beginPath();
			ctx.ellipse(axle.x, 252, 25, 4.4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		finishSheen(ctx);

		// Conveyor: a broad sky gloss over the dark belt, then the boot cover's lip.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.save();
		ctx.clip(new Path2D(BELT));
		const beltSheen = ctx.createLinearGradient(150, 66, 352, 156);
		beltSheen.addColorStop(0, 'rgba(255,255,255,0.26)');
		beltSheen.addColorStop(0.5, 'rgba(255,255,255,0.07)');
		beltSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = beltSheen;
		ctx.fillRect(148, 64, 208, 104);
		ctx.strokeStyle = 'rgba(255,255,255,0.45)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(176, 82);
		ctx.lineTo(300, 133);
		ctx.stroke();
		ctx.restore();
		line(ctx, 314, 160.5, 364, 160.5, 'rgba(255,255,255,0.4)', 1.4);
		line(ctx, 314, 169, 362, 169, 'rgba(255,255,255,0.18)', 1.2);
		ctx.restore();

		// Glints on paint and glass, all clear of the tyre circles.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		glint(ctx, 112, 84, 4);
		glint(ctx, 200, 112, 3.4);
		glint(ctx, 500, 168, 3.6);
		glint(ctx, 662, 176, 4);
		ctx.restore();

		// Cab glazing: a long sheen and a sparkle in the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(612, 140);
		ctx.lineTo(634, 110);
		ctx.stroke();
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(650, 140);
		ctx.lineTo(666, 112);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 680, 124, 3.2);

		// Worked paint: chips along the belly, hood corner and the cab step.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[104, 205, 7, 2, 0.4],
			[236, 208, 6, 2, 0.32],
			[388, 205, 7, 2, 0.34],
			[520, 205, 6, 2, 0.3],
			[660, 204, 7, 2.2, 0.32],
			[130, 70, 5, 1.8, 0.4]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		// Exhaust: soft overlapping puffs curling up and away from the cab.
		ctx.save();
		for (const [px, py, pr, alpha] of [
			[520, 111, 6.5, 0.22],
			[513, 101, 8, 0.18],
			[504, 92, 9.5, 0.15],
			[494, 82, 11, 0.1],
			[521, 108, 3.2, 0.26]
		]) {
			const puff = ctx.createRadialGradient(px, py, 0, px, py, pr);
			puff.addColorStop(0, `rgba(230,234,240,${alpha})`);
			puff.addColorStop(0.62, `rgba(213,220,229,${alpha * 0.55})`);
			puff.addColorStop(1, 'rgba(213,220,229,0)');
			ctx.fillStyle = puff;
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.fillStyle = 'rgba(240,244,249,0.34)';
		ctx.beginPath();
		ctx.arc(519, 110, 3, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealRoadPlaner(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealRoadPlanerLevel(ctx, x, y, scale, 5);
}
