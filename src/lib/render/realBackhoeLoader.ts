/**
 * Backhoe loader art, cut into the same five-piece kit as the other realistic works machines.
 * An orange backhoe loader facing left: the loader bucket rides on a long arm that lifts over
 * the front tyre and roots at a tower on the bonnet, the glazed cab sits over the rear axle,
 * and the rear deck carries the engine cover, the hydraulic tank and the backhoe kingpost.
 * The backhoe folds up over the rear wheel into a curled toothed bucket. Stabiliser pads hang
 * off the chassis rail at both ends, the beacon sits on the cab roof and the work lamps face
 * the trench.
 *
 * The body mask is the loader bucket, the loader arm, the bonnet with its tower, the cab, the
 * rear deck, the chassis rail with both stabiliser pads, the beacon and the exhaust stack.
 * Every subpath is disjoint or shares an edge, so the evenodd cut-out never punches a hole,
 * and no wheel circle is part of the mask. The raised loader arm clears the front tyre, so
 * the wheel tile never eats into it. The backhoe arm and bucket are their own cargo piece.
 *
 * Level 5 is the production target: shaded, fully fitted, lit with a cast shadow, contact
 * patches, rim light and the headlamp and beacon glow, then picture-book finished with paint
 * grain, bucket, backhoe and ram sheen, glints, hub hardware and an exhaust puff.
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
const CHAR = '#2B2D42';
const GRAPHITE = '#3C4058';
const GRAPHITE_LIGHT = '#5A6180';
const GRAPHITE_DARK = '#1E202C';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** Art box 760 x 310, road at 272. Front (loader bucket) faces left. */
const FRONT_WHEEL = { x: 150, y: 236, r: 36 };
const REAR_WHEEL = { x: 600, y: 236, r: 36 };

/**
 * Loader bucket carried just clear of the ground ahead of the front axle: a flat floor, a
 * straight back wall at the arm hinge and a rolled rim climbing to the front.
 */
const LOADER_BUCKET =
	'M112,264 L112,200 L102,196 L26,228 L14,232 L24,238 L14,242 L24,246 L14,250 L22,256 L20,264 Z';

/**
 * The loader arm: a deep boom that leaves the bucket hinge, clears the front tyre and runs
 * back to the tower on the bonnet. It rides above the paint, so it is its own subpath and
 * never overlaps the bonnet.
 */
const LOADER_ARM = 'M112,182 Q200,160 260,157 L352,162 L352,176 L260,172 Q170,190 112,210 Z';

/**
 * Bonnet with the loader tower rising at its cab end. The arm roots on the tower's left
 * face, so the two subpaths only touch.
 */
const HOOD =
	'M212,252 L212,206 Q212,188 226,186 L352,178 L352,148 L380,148 L380,176 L420,174 L420,252 Z';

/** Glazed cab over the rear axle: raked windscreen, flat roof and a vertical rear pillar. */
const CAB = 'M420,252 L420,174 L444,90 Q448,78 460,78 L552,78 Q560,78 560,88 L560,252 Z';

/** Engine deck, cast tail and the fender arch cut over the rear tyre. */
const DECK =
	'M560,252 L560,146 L630,146 Q646,146 648,158 L652,186 L664,194 L666,252 L644,252 Q644,192 600,190 Q560,192 560,252 Z';

/** Chassis rail with the stabiliser pads hanging at each end. */
const CHASSIS =
	'M186,252 L186,262 L232,262 L236,268 L236,272 L266,272 L266,258 L634,258 L634,272 L664,272 L668,266 L668,262 L666,262 L666,252 Z';

/** Amber beacon on the cab roof. */
const BEACON = 'M468,78 L468,60 Q468,54 474,54 L486,54 Q492,54 492,60 L492,78 Z';

/** Exhaust stack standing on the engine deck behind the cab. */
const EXHAUST = 'M576,146 L576,88 L588,88 L588,146 Z';

/**
 * The production cut-out: loader bucket, raised loader arm, bonnet and tower, cab, deck,
 * chassis, beacon and stack. Every subpath only touches its neighbour, never overlaps it.
 */
const BODY_MASK = [
	LOADER_BUCKET,
	LOADER_ARM,
	HOOD,
	CAB,
	DECK,
	CHASSIS,
	BEACON,
	EXHAUST
].join(' ');

/**
 * Backhoe arm in its parked fold, one continuous cut-out: boom from the kingpost pivot up to
 * the elbow, dipper down to the wrist, then the curled toothed bucket whose mouth faces the
 * machine. The bucket hangs clear of the rear tyre and the road.
 */
const BACKHOE =
	'M639,188 L711,118 L723,122 L747,210 L753,220 Q757,232 754,244 L751,251 L746,251 L743,258 L738,251 L733,251 L730,258 L725,251 L720,251 L717,258 L712,251 L707,251 Q701,250 702,242 Q705,235 714,230 Q722,226 727,221 L731,217 L735,213 L711,126 L723,131 L651,200 Z';

/** Raked windscreen and the long side pane: two disjoint glass areas. */
const WINDSCREEN = 'M426,188 L448,100 L468,100 L468,188 Z';
const SIDE_GLASS = 'M472,96 L544,96 Q550,96 550,102 L550,194 Q550,200 544,200 L472,200 Z';
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

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
	glass.addColorStop(0.44, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(86,166,214,0.32)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Four-point sparkle with a warm core, sized to survive the game scale. */
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

/** Picture-book hub: bright rim ring, five bolts and a pale centre cap. */
function hubFinish(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
		circle(ctx, cx + Math.cos(a) * r * 0.32, cy + Math.sin(a) * r * 0.32, 1.8, CHROME, 1);
	}
	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2 + Math.PI / 5;
		circle(ctx, cx + Math.cos(a) * r * 0.2, cy + Math.sin(a) * r * 0.2, 1.1, GRAPHITE_LIGHT, 0.8);
	}

	// Machined dish: a soft shadow under the hub and a lit arc on the outer rim.
	ctx.strokeStyle = 'rgba(58,39,27,0.18)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.76, Math.PI * 0.16, Math.PI * 0.84);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.94, Math.PI * 1.1, Math.PI * 1.92);
	ctx.stroke();

	circle(ctx, cx, cy, r * 0.14, '#E8EDF4', 1.1);
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.66, Math.PI * 1.08, Math.PI * 1.5);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.4)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.86, Math.PI * 1.06, Math.PI * 1.32);
	ctx.stroke();
}

/**
 * Deterministic picture-book paint grain: the painted shell, then a softer pass over the
 * loader bucket and backhoe. Never across the glazing, the chassis or the tyre circles.
 */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${LOADER_BUCKET} ${CHASSIS} ${circleMask(
		FRONT_WHEEL.x,
		FRONT_WHEEL.y,
		FRONT_WHEEL.r
	)} ${circleMask(REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r)}`;

	ctx.save();
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');

	let seed = 83;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 420; i++) {
		const px = 20 + rnd() * 646;
		const py = 54 + rnd() * 206;
		const size = 1.4 + rnd() * 1.5;
		ctx.globalAlpha = 0.06 + rnd() * 0.07;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 150; i++) {
		const px = 20 + rnd() * 646;
		const py = 54 + rnd() * 206;
		const size = 1.1 + rnd() * 1.2;
		ctx.globalAlpha = 0.14 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush sweeps along the bonnet crown and the deck shoulder.
	ctx.globalAlpha = 0.14;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.8;
	for (const [sx, sy, ex, ey] of [
		[232, 206, 372, 198],
		[456, 112, 490, 110],
		[568, 152, 632, 150],
		[604, 164, 640, 162],
		[230, 236, 320, 226]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();

	// A softer grain pass over the bucket shell and the folded backhoe.
	ctx.save();
	ctx.clip(new Path2D(`${LOADER_BUCKET} ${BACKHOE}`), 'evenodd');
	ctx.fillStyle = INK;
	for (let i = 0; i < 80; i++) {
		const px = 20 + rnd() * 730;
		const py = 120 + rnd() * 142;
		const size = 1.1 + rnd() * 1.1;
		ctx.globalAlpha = 0.06 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.4;
	for (const [sx, sy, ex, ey] of [
		[30, 214, 104, 204],
		[34, 238, 106, 228],
		[658, 186, 706, 140],
		[720, 140, 738, 204]
	]) {
		ctx.globalAlpha = 0.1;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Bucket face sheen: gloss down the back wall, a lit rim and a worn floor. */
function bucketSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(LOADER_BUCKET));

	const gloss = ctx.createLinearGradient(16, 194, 112, 266);
	gloss.addColorStop(0, 'rgba(255,255,255,0.2)');
	gloss.addColorStop(0.44, 'rgba(255,255,255,0.02)');
	gloss.addColorStop(1, 'rgba(58,39,27,0.2)');
	ctx.fillStyle = gloss;
	ctx.fillRect(12, 194, 104, 74);

	// Specular streak just inside the rolled rim, then a softer echo.
	line(ctx, 99, 203, 35, 232, 'rgba(255,255,255,0.5)', 2.2);
	line(ctx, 95, 214, 41, 240, 'rgba(255,255,255,0.2)', 1.6);
	// Lit quick-hitch cheek on the back wall.
	line(ctx, 106, 212, 106, 258, 'rgba(255,255,255,0.26)', 2);
	line(ctx, 24, 250, 24, 262, 'rgba(255,255,255,0.24)', 1.6);

	// Bright worn lip and two scrapes across the floor.
	line(ctx, 22, 254.5, 20, 262.5, 'rgba(255,255,255,0.34)', 1.8);
	ctx.globalAlpha = 0.22;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.2;
	for (const [sy, ey] of [
		[258, 259],
		[261.5, 262]
	]) {
		ctx.beginPath();
		ctx.moveTo(32, sy);
		ctx.lineTo(74, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Backhoe sheen: lit chords down the boom and dipper and a gloss on the curled bucket. */
function backhoeSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(BACKHOE));

	const gloss = ctx.createLinearGradient(640, 116, 752, 250);
	gloss.addColorStop(0, 'rgba(255,255,255,0.2)');
	gloss.addColorStop(0.45, 'rgba(255,255,255,0.02)');
	gloss.addColorStop(1, 'rgba(0,0,0,0.14)');
	ctx.fillStyle = gloss;
	ctx.fillRect(636, 114, 126, 148);

	// Cool chord along the top of the boom, then the dipper's lit outer edge.
	line(ctx, 655, 188, 714, 128, 'rgba(255,255,255,0.4)', 2.4);
	line(ctx, 724, 136, 741, 204, 'rgba(255,255,255,0.28)', 2);
	line(ctx, 728, 138, 745, 203, 'rgba(255,255,255,0.12)', 1.4);

	// Gloss on the back of the curled bucket and a sparkle-soft lip.
	line(ctx, 749, 216, 752, 240, 'rgba(255,255,255,0.34)', 2.2);
	line(ctx, 744, 220, 747, 244, 'rgba(255,255,255,0.14)', 1.4);
	line(ctx, 711, 249, 746, 249, 'rgba(255,255,255,0.26)', 1.6);
	ctx.restore();
}

/** Stabiliser ram sheen: chrome shafts with a lit edge, dark side and polished feet. */
function ramSheen(ctx: CanvasRenderingContext2D): void {
	for (const legX of [250, 649]) {
		line(ctx, legX - 1.8, 259, legX - 1.8, 268, 'rgba(255,255,255,0.66)', 1.4);
		line(ctx, legX + 1.8, 259, legX + 1.8, 268, 'rgba(30,32,44,0.3)', 1.2);
		ctx.strokeStyle = 'rgba(255,255,255,0.38)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(legX, 258, 4.4, Math.PI * 1.05, Math.PI * 1.95);
		ctx.stroke();
	}
	// Lit top edges on the two steel shoes.
	line(ctx, 236, 268, 264, 268, 'rgba(255,255,255,0.34)', 1.2);
	line(ctx, 634, 268, 662, 268, 'rgba(255,255,255,0.3)', 1.2);
}

/** Loader bucket: graphite shell, ribbed back, bright cutting edge and wear. */
function drawLoaderBucket(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, LOADER_BUCKET, ORANGE, 3);

	ctx.save();
	ctx.clip(new Path2D(LOADER_BUCKET));

	if (shaded) {
		const face = ctx.createLinearGradient(14, 190, 112, 266);
		face.addColorStop(0, 'rgba(255,255,255,0.4)');
		face.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		face.addColorStop(1, 'rgba(24,26,38,0.34)');
		ctx.fillStyle = face;
		ctx.fillRect(12, 188, 104, 80);

		// Open mouth: a dark band under the rim reads as the bucket's inside.
		ctx.beginPath();
		ctx.moveTo(102, 197);
		ctx.lineTo(27, 228);
		ctx.lineTo(31, 237);
		ctx.lineTo(106, 206);
		ctx.closePath();
		ctx.fillStyle = 'rgba(24,26,38,0.28)';
		ctx.fill();
	}

	// Bright rolled rim over that shadow.
	line(ctx, 102, 196.5, 26.5, 228, 'rgba(255,240,220,0.65)', 2.2);

	// Two stiffening ribs down the back wall.
	line(ctx, 96, 206, 96, 262, 'rgba(201,210,222,0.5)', 2.4);
	line(ctx, 70, 218, 70, 263, 'rgba(255,240,220,0.4)', 2);

	if (fitted) {
		// Bright cutting edge down the front lip and the three tooth tips.
		line(ctx, 25, 232, 22, 254, 'rgba(201,210,222,0.85)', 2.6);
		for (const ty of [232, 242, 250]) {
			line(ctx, 15, ty, 21, ty, 'rgba(210,219,230,0.85)', 2);
		}
		// Quick-hitch plate and hinge pin at the arm root.
		line(ctx, 100, 204, 100, 220, 'rgba(255,255,255,0.3)', 2);
		circle(ctx, 105, 206, 3.2, CHROME, 1.2);
	}

	if (finish) {
		// Wear stripes where the bucket drags and a chip on the floor.
		ctx.globalAlpha = 0.2;
		ctx.strokeStyle = '#B9C2D0';
		ctx.lineWidth = 1.2;
		for (let i = 0; i < 4; i++) {
			line(ctx, 32 + i * 18, 259, 76 + i * 8, 261, '#B9C2D0', 1.2);
		}
		ctx.globalAlpha = 1;
		line(ctx, 28, 254, 42, 256, CREAM, 1.4);
	}
	ctx.restore();
}

/** Backhoe cargo: boom, dipper and the curled bucket, then its pins and hoses. */
function drawBackhoe(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, BACKHOE, GRAPHITE, 3);

	ctx.save();
	ctx.clip(new Path2D(BACKHOE));

	if (shaded) {
		const beam = ctx.createLinearGradient(0, 116, 0, 266);
		beam.addColorStop(0, 'rgba(255,255,255,0.34)');
		beam.addColorStop(0.38, 'rgba(255,255,255,0.03)');
		beam.addColorStop(1, 'rgba(0,0,0,0.42)');
		ctx.fillStyle = beam;
		ctx.fillRect(636, 114, 124, 154);

		// Darker underside along the boom and the dipper.
		ctx.strokeStyle = 'rgba(0,0,0,0.36)';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(652, 198);
		ctx.lineTo(716, 133);
		ctx.lineTo(739, 212);
		ctx.stroke();

		// Lit back of the curled bucket.
		ctx.fillStyle = 'rgba(255,255,255,0.16)';
		ctx.beginPath();
		ctx.moveTo(749, 214);
		ctx.lineTo(753, 222);
		ctx.quadraticCurveTo(756, 234, 753, 245);
		ctx.lineTo(750, 250);
		ctx.lineTo(746, 250);
		ctx.lineTo(746, 230);
		ctx.quadraticCurveTo(747, 220, 744, 214);
		ctx.closePath();
		ctx.fill();

		// Shadow in the throat of the bucket.
		ctx.fillStyle = 'rgba(0,0,0,0.34)';
		ctx.beginPath();
		ctx.moveTo(706, 246);
		ctx.quadraticCurveTo(703, 240, 706, 235);
		ctx.quadraticCurveTo(712, 230, 720, 226);
		ctx.lineTo(724, 234);
		ctx.quadraticCurveTo(716, 238, 710, 244);
		ctx.closePath();
		ctx.fill();
	}

	// Orange livery band running the length of the boom.
	ctx.strokeStyle = ORANGE;
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(656, 192);
	ctx.lineTo(712, 134);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,246,228,0.5)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(658, 189);
	ctx.lineTo(713, 131);
	ctx.stroke();

	// Steel wear strip along the cutting edge of the bucket.
	line(ctx, 749, 250, 707, 250, 'rgba(201,210,222,0.8)', 2.6);

	if (fitted) {
		// Bright tooth tips along the cutting edge.
		for (const tipX of [717, 730, 743]) {
			line(ctx, tipX, 252, tipX, 257, 'rgba(210,219,230,0.8)', 2);
		}
		// Boom bolts and the dipper rib.
		for (const [bx, by] of [
			[667, 185],
			[684, 168],
			[701, 151]
		]) {
			circle(ctx, bx, by, 1.5, CHROME, 0.9);
		}
		line(ctx, 717, 140, 738, 205, 'rgba(255,255,255,0.2)', 2);
		line(ctx, 710, 137, 731, 202, 'rgba(0,0,0,0.28)', 1.6);
		// Hydraulic hose clipped along the boom's lower edge.
		ctx.strokeStyle = 'rgba(18,20,30,0.65)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(654, 200);
		ctx.lineTo(715, 142);
		ctx.stroke();
	}

	if (finish) {
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(713, 122);
		ctx.lineTo(726, 126);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.28)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(734, 216);
		ctx.lineTo(745, 213);
		ctx.stroke();
	}
	ctx.restore();

	// Pins sit on the finished outline: kingpost, elbow and wrist.
	circle(ctx, 645, 194, 5.8, CHROME, 1.6);
	circle(ctx, 645, 194, 2.2, STEEL, 1);
	circle(ctx, 717, 124, 4.6, CHROME, 1.4);
	circle(ctx, 717, 124, 1.8, STEEL, 0.9);
	circle(ctx, 741, 212, 4.8, CHROME, 1.4);
	circle(ctx, 741, 212, 1.9, STEEL, 0.9);
}

export function drawRealBackhoeLoaderLevel(
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
		// Cast shadow: a soft spread plus a tighter core, so the machine sits on the road.
		ctx.save();
		ctx.fillStyle = INK;
		ctx.globalAlpha = 0.18;
		ctx.beginPath();
		ctx.ellipse(352, 278, 330, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.09;
		ctx.beginPath();
		ctx.ellipse(348, 274, 250, 6, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis rail and the two stabiliser pads.
	shape(ctx, CHASSIS, GRAPHITE_DARK, 2.6);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(CHASSIS));
		const rail = ctx.createLinearGradient(0, 252, 0, 272);
		rail.addColorStop(0, 'rgba(255,255,255,0.24)');
		rail.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		rail.addColorStop(1, 'rgba(0,0,0,0.5)');
		ctx.fillStyle = rail;
		ctx.fillRect(184, 250, 486, 24);
		line(ctx, 190, 254, 630, 254, 'rgba(255,255,255,0.14)', 1.6);
		ctx.restore();
	}
	if (fitted) {
		// Chrome rams and steel feet on both stabiliser pads.
		for (const legX of [250, 649]) {
			line(ctx, legX, 258, legX, 270, 'rgba(58,39,27,0.5)', 8);
			line(ctx, legX, 258, legX, 270, CHROME, 5);
			line(ctx, legX - 1.4, 260, legX - 1.4, 268, 'rgba(255,255,255,0.6)', 1.4);
		}
		rect(ctx, 234, 267, 32, 5, STEEL, 1.2, 1.5);
		rect(ctx, 632, 267, 32, 5, STEEL, 1.2, 1.5);
		for (const legX of [243, 656]) circle(ctx, legX, 256, 1.5, CHROME, 0.8);
	}

	// Rear engine deck, cast tail and backhoe mount.
	shape(ctx, DECK, ORANGE, 3);
	ctx.save();
	ctx.clip(new Path2D(DECK));
	if (shaded) {
		const cowl = ctx.createLinearGradient(0, 144, 0, 254);
		cowl.addColorStop(0, 'rgba(255,255,255,0.42)');
		cowl.addColorStop(0.32, 'rgba(255,255,255,0.04)');
		cowl.addColorStop(0.82, 'rgba(163,90,38,0.1)');
		cowl.addColorStop(1, 'rgba(24,26,38,0.32)');
		ctx.fillStyle = cowl;
		ctx.fillRect(558, 142, 112, 112);

		// Engine cover laid along the fender crown.
		ctx.beginPath();
		ctx.moveTo(562, 146);
		ctx.lineTo(640, 146);
		ctx.lineTo(640, 166);
		ctx.quadraticCurveTo(640, 172, 634, 172);
		ctx.lineTo(568, 172);
		ctx.quadraticCurveTo(562, 172, 562, 166);
		ctx.closePath();
		ctx.fillStyle = CHAR;
		ctx.fill();

		// Dark skirt under the cast tail.
		ctx.fillStyle = CHAR;
		ctx.fillRect(640, 238, 26, 14);
	}
	ctx.fillStyle = CREAM;
	ctx.fillRect(564, 174, 74, 2.4);
	ctx.fillRect(646, 200, 18, 2.2);
	ctx.restore();

	// Engine vents and the deck's working hardware.
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(DECK));
		for (let vent = 0; vent < 3; vent++) {
			line(ctx, 570, 153 + vent * 5, 600, 151 + vent * 5, 'rgba(255,255,255,0.18)', 1.6);
		}
		for (let vent = 0; vent < 3; vent++) {
			line(ctx, 604, 154 + vent * 6, 632, 152 + vent * 6, 'rgba(58,39,27,0.32)', 2);
		}
		// Cast hydraulic tank behind the wheel.
		rect(ctx, 604, 176, 30, 12, GRAPHITE, 2, 1.8);
		ctx.restore();
	}
	if (fitted) {
		// Rear work lamp, tail lamps and the number plate on the cast tail.
		rect(ctx, 646, 166, 13, 10, GRAPHITE_DARK, 2, 1.6);
		rect(ctx, 649, 168, 7, 6, LAMP, 1, 1);
		rect(ctx, 652, 206, 9, 12, RED, 2, 1.6);
		rect(ctx, 652, 221, 9, 9, AMBER, 1.5, 1.4);
		rect(ctx, 646, 228, 18, 11, CREAM, 1.4, 1.3);
		line(ctx, 649, 232, 661, 232, 'rgba(58,39,27,0.5)', 1);
		line(ctx, 649, 236, 659, 236, 'rgba(58,39,27,0.35)', 1);
		// Kingpost plate where the backhoe hangs, with its two mount pins.
		rect(ctx, 636, 158, 24, 42, GRAPHITE, 3, 2);
		line(ctx, 640, 166, 656, 166, 'rgba(255,255,255,0.16)', 1.4);
		for (const pinY of [168, 186]) circle(ctx, 658, pinY, 2.4, CHROME, 1.1);
		// Fuel filler and the hydraulic tank cap.
		circle(ctx, 619, 166, 4, CHROME, 1.4);
		circle(ctx, 619, 166, 1.6, GRAPHITE, 0.9);
	}

	// Fender lip over the rear tyre.
	ctx.strokeStyle = ORANGE;
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(640, 250);
	ctx.quadraticCurveTo(640, 197, 600, 195);
	ctx.quadraticCurveTo(562, 197, 562, 250);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(640, 250);
	ctx.quadraticCurveTo(640, 197, 600, 195);
	ctx.quadraticCurveTo(562, 197, 562, 250);
	ctx.stroke();
	if (fitted) {
		ctx.strokeStyle = 'rgba(255,226,180,0.7)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(637, 249);
		ctx.quadraticCurveTo(637, 200, 600, 198);
		ctx.quadraticCurveTo(565, 200, 565, 249);
		ctx.stroke();
	}

	// Bonnet with the loader tower.
	shape(ctx, HOOD, ORANGE, 3);
	ctx.save();
	ctx.clip(new Path2D(HOOD));
	if (shaded) {
		const bonnet = ctx.createLinearGradient(0, 188, 0, 254);
		bonnet.addColorStop(0, 'rgba(255,255,255,0.46)');
		bonnet.addColorStop(0.34, 'rgba(255,255,255,0.05)');
		bonnet.addColorStop(0.8, 'rgba(163,90,38,0.1)');
		bonnet.addColorStop(1, 'rgba(24,26,38,0.3)');
		ctx.fillStyle = bonnet;
		ctx.fillRect(208, 178, 216, 80);

		// Nose panel and the throat under the loader arm.
		ctx.fillStyle = CHAR;
		ctx.fillRect(212, 210, 18, 42);
		ctx.fillStyle = 'rgba(255,255,255,0.16)';
		ctx.fillRect(212, 210, 2, 42);
		// Raised engine cover with its latch and the bonnet seam.
		ctx.fillStyle = 'rgba(201,122,62,0.42)';
		ctx.beginPath();
		ctx.moveTo(240, 196);
		ctx.lineTo(330, 191);
		ctx.lineTo(334, 214);
		ctx.lineTo(244, 219);
		ctx.closePath();
		ctx.fill();
		ctx.strokeStyle = 'rgba(255,240,220,0.28)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(242, 196.5);
		ctx.lineTo(329, 191.5);
		ctx.stroke();
		// Louvres on the bonnet flank.
		for (let louvre = 0; louvre < 3; louvre++) {
			line(ctx, 250, 226 + louvre * 8, 322, 220 + louvre * 8, 'rgba(58,39,27,0.34)', 2.4);
		}
		line(ctx, 340, 190, 340, 250, 'rgba(58,39,27,0.24)', 1.8);
		// Loader tower: lit left cheek, shaded right cheek.
		ctx.fillStyle = 'rgba(255,255,255,0.2)';
		ctx.fillRect(354, 150, 24, 3);
		ctx.fillStyle = 'rgba(24,26,38,0.34)';
		ctx.fillRect(374, 152, 6, 25);
		line(ctx, 354, 176.5, 378, 176.5, 'rgba(58,39,27,0.3)', 1.4);
	}
	ctx.fillStyle = CREAM;
	ctx.fillRect(240, 186, 110, 2.4);
	ctx.restore();

	// Headlamp and indicator on the nose.
	if (fitted) {
		circle(ctx, 218, 214, 7, CHROME, 2);
		circle(ctx, 218, 214, 5, LAMP, 1.6);
		circle(ctx, 217, 213, 1.7, '#FFFDE8', 0.8);
		circle(ctx, 218, 240, 4.6, AMBER, 1.6);
		line(ctx, 234, 205, 250, 205, 'rgba(255,255,255,0.4)', 1.6);
	}

	drawLoaderBucket(ctx, shaded, fitted, finish);

	// Loader arm: painted boom, dark link plate, chrome pins and a hose.
	shape(ctx, LOADER_ARM, ORANGE, 3);
	ctx.save();
	ctx.clip(new Path2D(LOADER_ARM));
	if (shaded) {
		const arm = ctx.createLinearGradient(0, 150, 0, 214);
		arm.addColorStop(0, 'rgba(255,255,255,0.46)');
		arm.addColorStop(0.42, 'rgba(255,255,255,0.04)');
		arm.addColorStop(1, 'rgba(24,26,38,0.38)');
		ctx.fillStyle = arm;
		ctx.fillRect(110, 150, 246, 66);
	}
	// Dark link plate following the boom from the hinge to the tower.
	ctx.beginPath();
	ctx.moveTo(124, 203);
	ctx.quadraticCurveTo(200, 178, 262, 166);
	ctx.lineTo(344, 169);
	ctx.strokeStyle = 'rgba(30,32,44,0.88)';
	ctx.lineWidth = 9;
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.2;
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(130, 198.5);
	ctx.quadraticCurveTo(201, 174, 260, 162);
	ctx.lineTo(342, 165);
	ctx.strokeStyle = 'rgba(255,255,255,0.26)';
	ctx.lineWidth = 1.3;
	ctx.stroke();
	if (fitted) {
		for (const [px, py] of [
			[172, 183],
			[250, 166],
			[330, 168]
		]) {
			circle(ctx, px, py, 1.6, CHROME, 0.9);
		}
		// Hydraulic hose running the boom's underside.
		ctx.strokeStyle = 'rgba(18,20,30,0.55)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(126, 206);
		ctx.quadraticCurveTo(196, 185, 268, 172);
		ctx.stroke();
	}
	ctx.restore();

	// Pivot pins: the arm root on the tower and the bucket hinge.
	circle(ctx, 356, 169, 7, CHROME, 1.8);
	circle(ctx, 356, 169, 2.6, STEEL, 1);
	circle(ctx, 116, 198, 4.6, CHROME, 1.4);
	circle(ctx, 116, 198, 1.8, STEEL, 0.9);

	// Cab shell.
	shape(ctx, CAB, ORANGE, 3);
	ctx.save();
	ctx.clip(new Path2D(CAB));
	if (shaded) {
		const cab = ctx.createLinearGradient(0, 76, 0, 254);
		cab.addColorStop(0, 'rgba(255,255,255,0.5)');
		cab.addColorStop(0.3, 'rgba(255,255,255,0.05)');
		cab.addColorStop(0.82, 'rgba(163,90,38,0.08)');
		cab.addColorStop(1, 'rgba(24,26,38,0.3)');
		ctx.fillStyle = cab;
		ctx.fillRect(418, 74, 154, 178);

		// Charcoal beltline and skirt, with the cream pinstripes.
		ctx.fillStyle = CHAR;
		ctx.fillRect(420, 200, 140, 7);
		ctx.fillRect(420, 244, 140, 10);
		ctx.fillStyle = CREAM;
		ctx.fillRect(420, 207.5, 140, 2.2);
		ctx.fillRect(420, 241.5, 140, 2);
		// Roof cap and the A-pillar shadow.
		ctx.fillStyle = 'rgba(255,255,255,0.2)';
		ctx.fillRect(454, 80, 96, 5);
		ctx.fillStyle = 'rgba(24,26,38,0.18)';
		ctx.fillRect(422, 100, 5, 154);
	}
	ctx.restore();

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 426, 100, 42, 90);
		glassShade(ctx, SIDE_GLASS, 472, 96, 88, 104);
		// Front pillar and the divider between the panes.
		line(ctx, 469, 100, 469, 190, 'rgba(255,255,255,0.3)', 2.4);
		line(ctx, 471, 100, 471, 190, INK, 1.6);
		// Wiper parked at the base of the windscreen.
		line(ctx, 434, 182, 458, 146, INK, 2.2);
	}
	ctx.strokeStyle = '#2F3338';
	ctx.lineWidth = 2;
	ctx.stroke(new Path2D(WINDSCREEN));
	ctx.stroke(new Path2D(SIDE_GLASS));

	// Cab door, handle and step.
	ctx.save();
	ctx.clip(new Path2D(CAB));
	rect(ctx, 474, 212, 76, 32, ORANGE, 2, 2.2);
	if (shaded) {
		const skin = ctx.createLinearGradient(0, 212, 0, 244);
		skin.addColorStop(0, 'rgba(255,255,255,0.2)');
		skin.addColorStop(0.7, 'rgba(255,255,255,0.02)');
		skin.addColorStop(1, 'rgba(24,26,38,0.26)');
		ctx.fillStyle = skin;
		ctx.fillRect(474, 212, 76, 32);
	}
	line(ctx, 478, 216, 478, 240, 'rgba(58,39,27,0.28)', 1.6);
	line(ctx, 546, 216, 546, 240, 'rgba(58,39,27,0.28)', 1.6);
	if (fitted) {
		rect(ctx, 530, 226, 12, 4, CHROME, 2, 1.4);
		rect(ctx, 478, 214, 4, 8, STEEL, 1, 1.2);
		rect(ctx, 478, 234, 4, 8, STEEL, 1, 1.2);
		rect(ctx, 448, 246, 42, 6, GRAPHITE_DARK, 1.4, 1.6);
		line(ctx, 452, 248.5, 486, 248.5, 'rgba(255,255,255,0.22)', 1.2);
	}
	ctx.restore();

	// Beacon on the roof.
	shape(ctx, BEACON, AMBER, 2.2);
	rect(ctx, 466, 74, 28, 4, GRAPHITE_DARK, 1.4, 1.4);
	if (fitted) {
		line(ctx, 474, 58, 474, 73, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 485, 59, 484, 73, 'rgba(255,255,255,0.5)', 1.2);
	}

	// Exhaust stack on the deck.
	shape(ctx, EXHAUST, STEEL, 2.4);
	if (shaded) line(ctx, 579, 92, 579, 145, 'rgba(255,255,255,0.3)', 1.6);
	if (fitted) {
		rect(ctx, 575, 90, 14, 4, GRAPHITE_DARK, 1.5, 1.6);
		line(ctx, 578, 94, 586, 94, 'rgba(0,0,0,0.4)', 1.4);
	}

	// The naming cue: backhoe arm and bucket, folded over the rear wheel.
	drawBackhoe(ctx, shaded, fitted, finish);

	// Both wheels share the one wheel part; the rear tile is its exact mirror.
	wheel(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r);
	wheel(ctx, REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r);

	if (lit) {
		// Rim light: roof, loader arm, bucket rim, boom chord and the fender crown.
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(458, 80);
		ctx.lineTo(562, 80);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(118, 182);
		ctx.quadraticCurveTo(200, 160, 260, 157);
		ctx.lineTo(350, 162);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(58, 205.5);
		ctx.quadraticCurveTo(34, 211.5, 27, 228);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(643, 191);
		ctx.lineTo(712, 120);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(564, 224);
		ctx.quadraticCurveTo(564, 200, 600, 198);
		ctx.quadraticCurveTo(638, 200, 638, 224);
		ctx.stroke();

		// Headlamp glow thrown ahead of the nose.
		const glow = ctx.createRadialGradient(212, 214, 1, 212, 214, 22);
		glow.addColorStop(0, 'rgba(255,240,150,0.55)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(212, 214, 22, 0, Math.PI * 2);
		ctx.fill();

		const beaconGlow = ctx.createRadialGradient(480, 66, 1, 480, 66, 26);
		beaconGlow.addColorStop(0, 'rgba(255,183,3,0.55)');
		beaconGlow.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beaconGlow;
		ctx.beginPath();
		ctx.arc(480, 66, 26, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.26;
		ctx.fillStyle = INK;
		for (const at of [FRONT_WHEEL, REAR_WHEEL]) {
			ctx.beginPath();
			ctx.ellipse(at.x, 270, 27, 6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Working-end sheen: bucket face, backhoe chords and the stabiliser rams.
		bucketSheen(ctx);
		backhoeSheen(ctx);
		ramSheen(ctx);

		// Bonnet and cab sheen, clipped to the painted shell and clear of the glass.
		ctx.save();
		ctx.clip(new Path2D(`${HOOD} ${CAB} ${DECK}`));
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(236, 208);
		ctx.quadraticCurveTo(300, 202, 372, 197);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.22)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(458, 86);
		ctx.lineTo(556, 86);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(566, 154);
		ctx.quadraticCurveTo(600, 151, 636, 152);
		ctx.stroke();
		ctx.restore();

		// Glass sheen, kept inside the glazing.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(434, 184);
		ctx.lineTo(455, 106);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(480, 190);
		ctx.lineTo(508, 102);
		ctx.stroke();
		ctx.lineWidth = 1.4;
		ctx.globalAlpha = 0.7;
		ctx.beginPath();
		ctx.moveTo(522, 182);
		ctx.lineTo(540, 116);
		ctx.stroke();
		ctx.restore();

		// Exhaust puff drifting off the stack.
		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = '#D5DCE5';
		ctx.beginPath();
		ctx.arc(596, 80, 7, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(607, 74, 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(591, 70, 4.4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Glints, clear of the glass and the tyre circles.
		glint(ctx, 268, 166, 4.6);
		glint(ctx, 500, 83, 4.4);
		glint(ctx, 700, 138, 4.2);
		glint(ctx, 64, 240, 4);
		glint(ctx, 556, 79, 3.6);
		glint(ctx, 218, 212, 3.2);
		glint(ctx, 634, 168, 3);
		glint(ctx, 596, 168, 2.8);
		glint(ctx, 745, 246, 2.6);
		glint(ctx, 104, 205, 2.8);
		glint(ctx, 251, 259, 2.2);
		glint(ctx, 480, 62, 2.4);

		// Hub hardware on both wheels.
		hubFinish(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r);
		ctx.save();
		ctx.translate(FRONT_WHEEL.x + REAR_WHEEL.x, 0);
		ctx.scale(-1, 1);
		hubFinish(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r);
		ctx.restore();

		// Working marks: paint chips on the bonnet, cab and deck.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[240, 244, 8, 2, 0.42],
			[424, 242, 6, 2, 0.34],
			[566, 244, 7, 2, 0.36],
			[646, 238, 6, 2, 0.3],
			[98, 200, 6, 2, 0.26]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		line(ctx, 226, 236, 226, 248, 'rgba(58,39,27,0.3)', 1.2);
		line(ctx, 646, 176, 646, 196, 'rgba(255,255,255,0.18)', 1.2);
	}

	ctx.restore();
}

export function drawRealBackhoeLoader(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealBackhoeLoaderLevel(ctx, x, y, scale, 5);
}
