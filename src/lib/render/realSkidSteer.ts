/**
 * Skid-steer loader art, cut into the same five-piece kit as the other works machines.
 * Front faces left: a blocky chassis with the tyres seated in arches, a lift arm carried as
 * its own beam from the quick-attach at the nose to the rear tower, the front bucket that
 * names the machine, an open charcoal ROPS cage on the beam with a windscreen, seat and
 * engine cover, a rear tower with its stack. Level 5 is the production target: shaded, lit
 * and picture-book finished with paint grain, arm and steel sheen, glints, hub bolts, an
 * exhaust puff and wear.
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
const YELLOW_DARK = '#D8A62E';
const CHARCOAL = '#2B2D42';
const CHARCOAL_DARK = '#1C1E2E';
const CHARCOAL_LIGHT = '#3D405B';
const CREAM = '#FFF6E0';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** Art box 620 x 320, road at 272. The bucket is at the front (left). */
const BODY =
	'M96,252 L96,222 Q96,214 105,214 L122,199 L456,199 L470,146 L524,146 Q540,146 540,164 L540,238 Q540,252 528,252 L482,252 L482,236 A32,32 0 0 0 418,236 L418,252 L182,252 L182,236 A32,32 0 0 0 118,236 L118,252 Z';

/** Lift arm: one tapered beam from the nose quick-attach to the rear tower. */
const ARM = 'M122,158 L300,148 L452,156 L452,199 L122,199 Z';

/** Buttoned ROPS roof with its three posts, backrest and the engine cover behind it. */
const ROOF = 'M230,98 L230,82 Q230,76 238,76 L408,76 Q416,76 416,82 L416,98 Z';
const POST_F = 'M236,98 L248,98 L248,148 L236,148 Z';
const MID_POST = 'M306,98 L318,98 L318,146 L306,146 Z';
const SEAT = 'M326,146 L358,146 L358,118 Q358,106 346,106 L338,106 Q326,106 326,118 Z';
const CAB_BACK = 'M362,146 L396,146 L396,104 Q396,100 392,100 L366,100 Q362,100 362,104 Z';
const POST_R = 'M400,98 L412,98 L412,151 L400,151 Z';

const BEACON = 'M236,76 L236,68 Q236,60 248,60 Q260,60 260,68 L260,76 Z';
const STACK = 'M496,146 L496,118 L508,118 L508,146 Z';
const PUFF = 'M492,118 Q486,106 498,100 Q508,90 520,98 Q526,106 520,114 Q522,118 512,118 Z';

/** Raked windscreen hung between the front post and the mid post. */
const WINDSCREEN = 'M248,99 L306,99 L306,146 L248,149 Z';

/** Bucket: flat back wall, bowed front face, curved floor and a level scooped rim. */
const BUCKET =
	'M122,154 L122,244 Q122,258 106,260 L48,265 Q28,265 26,248 Q22,204 34,168 L36,160 L112,154 Z';

const BODY_MASK = [
	BODY,
	ARM,
	ROOF,
	POST_F,
	MID_POST,
	POST_R,
	SEAT,
	CAB_BACK,
	BEACON,
	STACK,
	PUFF
].join(' ');
const GLASS_MASK = WINDSCREEN;
const BUCKET_MASK = BUCKET;

const WHEEL_L = { x: 150, y: 236, r: 28 };
const WHEEL_R = { x: 450, y: 236, r: 28 };

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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.6)');
	glass.addColorStop(0.46, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(92,176,224,0.34)');
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
 * specular pips, the dish shadow, a polished cap with a valve stem and inner rim arcs.
 * Every mark is mirrored about both axes, so the flipped rear wheel reads the same.
 */
function wheelFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Shoulder gloss on both upper sidewalls, clear of the tread notches.
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 2.2;
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
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.52, 0, Math.PI * 2);
	ctx.stroke();

	// Six bolts, each with a specular pip on its upper shoulder.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.2, CHROME, 1.1);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx, by - 0.8, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}

	// Dish shadow under the cap, then the polished cap itself.
	ctx.strokeStyle = 'rgba(58,39,27,0.26)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.44, 0.18 * Math.PI, 0.82 * Math.PI);
	ctx.stroke();
	circle(ctx, x, y, r * 0.16, '#E8EDF4', 1.2);
	ctx.strokeStyle = 'rgba(255,255,255,0.9)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.12, Math.PI * 1.06, Math.PI * 1.6);
	ctx.stroke();
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x, y - 0.8, 0.8, 0, Math.PI * 2);
	ctx.fill();

	// Bright inner rim arcs and the valve stem on the top centreline.
	ctx.strokeStyle = 'rgba(255,255,255,0.62)';
	ctx.lineWidth = 1.6;
	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.94]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.62, from, to);
		ctx.stroke();
	}
	circle(ctx, x, y - r * 0.55, 2, CHROME, 1);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x, y - r * 0.58, 0.8, 0, Math.PI * 2);
	ctx.fill();
	line(ctx, x, y - r * 0.53, x, y - r * 0.64, CHROME, 2);
}

/** Deterministic picture-book grain over paint only: glass and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	const panels = new Path2D(BODY_MASK);
	panels.addPath(new Path2D(BUCKET_MASK));
	ctx.save();
	ctx.clip(panels);
	ctx.clip(new Path2D(`${BODY_MASK} ${BUCKET_MASK} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(28, 148, 540, 252);
	wash.addColorStop(0, 'rgba(255,255,255,0.06)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.08)');
	ctx.fillStyle = wash;
	ctx.fillRect(24, 58, 520, 196);

	let seed = 59;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 420; i++) {
		const px = 24 + rand() * 520;
		const py = 60 + rand() * 192;
		const size = 1.1 + rand() * 1.1;
		ctx.globalAlpha = 0.07 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 185; i++) {
		const px = 24 + rand() * 520;
		const py = 62 + rand() * 190;
		const size = 0.9 + rand() * 0.8;
		ctx.globalAlpha = 0.15 + rand() * 0.11;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 70; i++) {
		const px = 24 + rand() * 520;
		const py = 64 + rand() * 186;
		const size = 0.6 + rand() * 0.4;
		ctx.globalAlpha = 0.08 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush strokes over the deck, the arm and the bowl of the bucket.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[196, 226, 330, 224],
		[344, 232, 452, 231],
		[470, 200, 536, 199],
		[156, 172, 292, 162],
		[306, 164, 446, 172],
		[54, 214, 100, 204]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest.
	ctx.globalAlpha = 0.16;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[206, 246, 258, 245],
		[300, 226, 344, 225],
		[430, 248, 470, 247],
		[492, 236, 528, 235],
		[188, 214, 240, 213],
		[140, 180, 240, 164],
		[46, 234, 78, 252]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Shell: paint, panel work, the charcoal belly and the engine deck. */
function drawBody(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, BODY, YELLOW, 3);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(BODY));
		const paint = ctx.createLinearGradient(0, 196, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.26)');
		paint.addColorStop(0.55, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(120,84,14,0.26)');
		ctx.fillStyle = paint;
		ctx.fillRect(94, 194, 448, 60);

		const deck = ctx.createLinearGradient(0, 146, 0, 252);
		deck.addColorStop(0, 'rgba(255,255,255,0.3)');
		deck.addColorStop(0.4, 'rgba(255,255,255,0.02)');
		deck.addColorStop(1, 'rgba(120,84,14,0.24)');
		ctx.fillStyle = deck;
		ctx.fillRect(454, 144, 88, 110);
		ctx.restore();

		// Deck edge, drop shadow cast by the arm and the rear panel bevel.
		line(ctx, 132, 200, 454, 200, 'rgba(255,255,255,0.4)', 2);
		line(ctx, 132, 203.5, 454, 203.5, 'rgba(58,39,27,0.2)', 3);
		line(ctx, 456, 147.5, 536, 147.5, 'rgba(255,255,255,0.26)', 2);
		line(ctx, 458, 199, 538, 199, 'rgba(58,39,27,0.22)', 2);
	}

	ctx.save();
	ctx.clip(new Path2D(BODY));

	// Charcoal belly under the deck seam, and the engine housing's charcoal panel.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(96, 237, 444, 15);
	ctx.fillStyle = 'rgba(255,255,255,0.14)';
	ctx.fillRect(96, 237, 444, 1.5);
	ctx.fillStyle = CHARCOAL_LIGHT;
	ctx.fillRect(456, 150, 82, 64);
	ctx.fillStyle = 'rgba(0,0,0,0.16)';
	ctx.fillRect(456, 208, 82, 6);
	ctx.restore();

	if (fitted) {
		// Rear engine grille, tail lamps, plate and the step under the cab opening.
		rect(ctx, 514, 172, 24, 42, CHARCOAL_DARK, 3, 2);
		for (let bar = 0; bar < 4; bar++) {
			line(ctx, 518, 178 + bar * 8.5, 534, 178 + bar * 8.5, 'rgba(201,210,222,0.55)', 2.2);
		}
		rect(ctx, 512, 238, 16, 10, RED, 2, 1.8);
		rect(ctx, 494, 238, 14, 10, AMBER, 2, 1.8);
		rect(ctx, 464, 196, 32, 12, CREAM, 2, 1.8);
		line(ctx, 468, 200.5, 492, 200.5, 'rgba(58,39,27,0.42)', 1.2);
		line(ctx, 468, 204.5, 486, 204.5, 'rgba(58,39,27,0.3)', 1.2);
		rect(ctx, 294, 238, 38, 7, STEEL, 2, 1.8);
		line(ctx, 298, 241, 328, 241, 'rgba(255,255,255,0.42)', 1.2);
		for (let louvre = 0; louvre < 3; louvre++) {
			line(ctx, 458, 220 + louvre * 6, 486, 220 + louvre * 6, 'rgba(58,39,27,0.3)', 2);
		}

		// Side hatch between the wheels, with its bolt heads.
		rect(ctx, 236, 218, 54, 15, YELLOW_DARK, 3, 1.6);
		for (const boltX of [241, 285]) {
			circle(ctx, boltX, 225.5, 1.7, CHROME, 0.9);
		}
		// Rear fender lip, following the arch.
		ctx.save();
		ctx.clip(new Path2D(BODY));
		ctx.strokeStyle = 'rgba(255,255,255,0.3)';
		ctx.lineWidth = 1.8;
		for (const tyre of [WHEEL_L, WHEEL_R]) {
			ctx.beginPath();
			ctx.arc(tyre.x, tyre.y, tyre.r + 6, Math.PI * 1.06, Math.PI * 1.94);
			ctx.stroke();
		}
		ctx.restore();
	}
}

/** Lift-arm sheen: gloss along the beam, a lit top spine and polished pivot bosses. */
function armSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(ARM));

	// Long gloss running the length of the beam, brightest at the nose.
	const gloss = ctx.createLinearGradient(0, 148, 0, 199);
	gloss.addColorStop(0, 'rgba(255,255,255,0.22)');
	gloss.addColorStop(0.34, 'rgba(255,255,255,0.05)');
	gloss.addColorStop(0.72, 'rgba(255,255,255,0)');
	gloss.addColorStop(1, 'rgba(90,64,14,0.16)');
	ctx.fillStyle = gloss;
	ctx.fillRect(118, 146, 338, 54);

	// Warm ground bounce along the beam's belly.
	const bounce = ctx.createLinearGradient(0, 190, 0, 199);
	bounce.addColorStop(0, 'rgba(255,246,224,0)');
	bounce.addColorStop(1, 'rgba(255,246,224,0.16)');
	ctx.fillStyle = bounce;
	ctx.fillRect(118, 190, 338, 10);
	ctx.restore();

	// Lit top spine, its softer echo and the shaded web under them.
	line(ctx, 132, 157.6, 296, 147.4, 'rgba(255,255,255,0.5)', 2);
	line(ctx, 306, 148.4, 444, 156.6, 'rgba(255,255,255,0.38)', 1.6);
	line(ctx, 134, 162.4, 294, 152.2, 'rgba(255,255,255,0.16)', 1.2);
	line(ctx, 130, 166, 444, 166, 'rgba(255,246,224,0.12)', 1.2);

	// Pivot bosses: bright rims and specular pips.
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(440, 176, 6.8, Math.PI * 1.05, Math.PI * 1.55);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(136, 178, 4.8, Math.PI * 1.05, Math.PI * 1.55);
	ctx.stroke();
	ctx.fillStyle = 'rgba(255,255,255,0.88)';
	ctx.beginPath();
	ctx.arc(438.8, 173.4, 1, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(134.9, 175.7, 0.8, 0, Math.PI * 2);
	ctx.fill();

	// Chrome rod catchlight and the ram barrel's soft upper sheen.
	line(ctx, 390, 184.8, 418, 184.8, 'rgba(255,255,255,0.8)', 1.2);
	line(ctx, 331.6, 182.4, 386, 182.4, 'rgba(255,255,255,0.22)', 1.1);
}

/** The lift arm: one beam with its bosses, rivets and the ram that lifts it. */
function drawArm(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, ARM, YELLOW, 3);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(ARM));
		const beam = ctx.createLinearGradient(0, 148, 0, 199);
		beam.addColorStop(0, 'rgba(255,255,255,0.44)');
		beam.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		beam.addColorStop(1, 'rgba(90,64,14,0.34)');
		ctx.fillStyle = beam;
		ctx.fillRect(118, 146, 338, 54);
		ctx.restore();

		line(ctx, 128, 156.5, 298, 146.5, 'rgba(255,255,255,0.5)', 1.8);
		line(ctx, 304, 146.5, 446, 154.5, 'rgba(255,255,255,0.42)', 1.6);
		line(ctx, 128, 196, 446, 196, 'rgba(90,64,14,0.18)', 3.4);
		line(ctx, 128, 193, 446, 193, 'rgba(255,255,255,0.14)', 1.4);
	}

	if (fitted) {
		// Rear tower pivot and the quick-attach boss at the nose.
		circle(ctx, 440, 176, 9, CHARCOAL_LIGHT, 2);
		circle(ctx, 440, 176, 3.6, CHROME, 1.4);
		circle(ctx, 136, 178, 7, CHARCOAL_LIGHT, 1.8);
		circle(ctx, 136, 178, 2.6, CHROME, 1.2);

		// Rivets along the beam's web.
		for (const rivet of [176, 214, 252, 290]) {
			circle(ctx, rivet, 174 - (rivet - 176) * 0.055, 1.6, 'rgba(255,246,224,0.8)', 0.6);
		}

		// Lift ram clamped along the beam's belly, gland and chrome rod forward.
		line(ctx, 330, 186, 388, 186, INK, 10);
		line(ctx, 330, 186, 388, 186, CHARCOAL_LIGHT, 7);
		line(ctx, 388, 186, 420, 186, INK, 5);
		line(ctx, 388, 186, 420, 186, CHROME, 3);
		circle(ctx, 330, 186, 4.6, CHARCOAL_DARK, 1.6);
		circle(ctx, 388, 186, 3.6, CHARCOAL_DARK, 1.2);
	}
}

/** Cage sheen: roof gloss, rivet row, lit post stiles and the beacon's glass arc. */
function cageSheen(ctx: CanvasRenderingContext2D): void {
	// Roof gloss with a warm bounce under the lip.
	ctx.save();
	ctx.clip(new Path2D(ROOF));
	const roof = ctx.createLinearGradient(0, 76, 0, 98);
	roof.addColorStop(0, 'rgba(255,255,255,0.3)');
	roof.addColorStop(0.48, 'rgba(255,255,255,0.06)');
	roof.addColorStop(1, 'rgba(0,0,0,0.1)');
	ctx.fillStyle = roof;
	ctx.fillRect(228, 74, 190, 26);
	const bounce = ctx.createLinearGradient(0, 92, 0, 98);
	bounce.addColorStop(0, 'rgba(255,246,224,0)');
	bounce.addColorStop(1, 'rgba(255,246,224,0.13)');
	ctx.fillStyle = bounce;
	ctx.fillRect(228, 92, 190, 6);
	ctx.restore();

	line(ctx, 234, 77.8, 412, 77.8, 'rgba(255,255,255,0.58)', 1.8);
	line(ctx, 236, 82.5, 408, 82.5, 'rgba(255,255,255,0.16)', 5);
	line(ctx, 232, 97, 414, 97, 'rgba(0,0,0,0.2)', 1.4);

	// Rivet row along the roof's front edge.
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.66;
	for (let rivetX = 242; rivetX <= 404; rivetX += 16) {
		ctx.beginPath();
		ctx.arc(rivetX, 81.4, 1, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Grab rail, post stiles and the seat's piping.
	line(ctx, 322, 81.4, 394, 81.4, 'rgba(255,255,255,0.34)', 1.2);
	line(ctx, 239.2, 102, 239.2, 146, 'rgba(255,255,255,0.46)', 1.2);
	line(ctx, 245.6, 102, 245.6, 146, 'rgba(0,0,0,0.18)', 1.1);
	line(ctx, 309.2, 102, 309.2, 144, 'rgba(255,255,255,0.4)', 1.1);
	line(ctx, 315.4, 102, 315.4, 144, 'rgba(0,0,0,0.16)', 1);
	line(ctx, 403.2, 102, 403.2, 149, 'rgba(255,255,255,0.36)', 1.2);
	line(ctx, 409.6, 102, 409.6, 149, 'rgba(0,0,0,0.16)', 1);
	line(ctx, 333, 124, 349, 124, 'rgba(255,246,228,0.26)', 1.3);
	line(ctx, 330, 135.5, 352, 135.5, 'rgba(0,0,0,0.2)', 1.2);

	// Lit vent-bar tops and the post-foot bolt heads.
	for (let bar = 0; bar < 4; bar++) {
		line(ctx, 366 + bar * 8, 105.4, 366 + bar * 8, 118, 'rgba(255,255,255,0.22)', 1);
	}
	ctx.fillStyle = 'rgba(255,255,255,0.8)';
	for (const [pipX, pipY] of [
		[241.4, 144.4],
		[311.4, 142.4],
		[405.4, 147.4]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, 0.75, 0, Math.PI * 2);
		ctx.fill();
	}

	// Beacon glass arc and its top-edge pip.
	ctx.save();
	ctx.clip(new Path2D(BEACON));
	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(248, 70, 8, Math.PI * 1.15, Math.PI * 1.85);
	ctx.stroke();
	ctx.restore();
	ctx.fillStyle = '#FFFDF2';
	ctx.beginPath();
	ctx.arc(244.4, 64.6, 0.9, 0, Math.PI * 2);
	ctx.fill();
}

/** ROPS roof, posts, backrest, engine cover and beacon. */
function drawCage(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, POST_F, CHARCOAL, 2.5);
	shape(ctx, MID_POST, CHARCOAL, 2.5);
	shape(ctx, CAB_BACK, CHARCOAL, 2.5);
	shape(ctx, SEAT, CHARCOAL, 2.5);
	shape(ctx, POST_R, CHARCOAL, 2.5);
	shape(ctx, ROOF, CHARCOAL, 3);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(ROOF));
		const roof = ctx.createLinearGradient(0, 76, 0, 98);
		roof.addColorStop(0, 'rgba(255,255,255,0.28)');
		roof.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		roof.addColorStop(1, 'rgba(0,0,0,0.34)');
		ctx.fillStyle = roof;
		ctx.fillRect(228, 74, 190, 26);
		ctx.restore();
		line(ctx, 236, 78, 410, 78, 'rgba(255,255,255,0.5)', 1.6);
		line(ctx, 232, 97, 414, 97, 'rgba(0,0,0,0.36)', 2);
		line(ctx, 242, 102, 242, 147, 'rgba(255,255,255,0.2)', 1.2);
		line(ctx, 406, 102, 406, 149, 'rgba(255,255,255,0.16)', 1.2);
		line(ctx, 368, 104, 392, 104, 'rgba(255,255,255,0.14)', 1.2);
		line(ctx, 330, 114, 354, 114, 'rgba(255,255,255,0.14)', 1.2);
	}

	if (fitted) {
		// Grab rail under the roof lip, front work lamp and the post feet.
		rect(ctx, 320, 80, 76, 5, CHARCOAL_DARK, 2, 1.2);
		circle(ctx, 240, 90, 5.5, LAMP, 2);
		circle(ctx, 240, 90, 2.4, CREAM, 1.1);
		circle(ctx, 408, 88, 4, LAMP, 1.8);
		circle(ctx, 242, 145, 1.6, CHROME, 1);
		circle(ctx, 312, 143, 1.5, CHROME, 1);
		circle(ctx, 406, 148, 1.6, CHROME, 1);
		// Seat pad and the engine cover's vent bars.
		rect(ctx, 330, 120, 22, 18, CHARCOAL_DARK, 2, 1.4);
		line(ctx, 332, 126, 350, 126, 'rgba(255,246,228,0.2)', 1.2);
		for (let bar = 0; bar < 4; bar++) {
			line(ctx, 366 + bar * 8, 106, 366 + bar * 8, 142, 'rgba(201,210,222,0.22)', 2);
		}
	}

	shape(ctx, BEACON, AMBER, 2);
	rect(ctx, 236, 72, 24, 4, CHARCOAL_DARK, 1, 1.6);
	if (shaded) {
		line(ctx, 242, 66, 242, 73, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 253, 66, 253, 73, 'rgba(255,255,255,0.42)', 1.2);
	}
}

/** Bucket sheen: brushed face, lit rim folds, floor sheen and polished attach pins. */
function bucketSheen(ctx: CanvasRenderingContext2D): void {
	// Brushed metal band across the bowed face, light falling off toward the heel.
	ctx.save();
	ctx.clip(new Path2D(BUCKET));
	const brushed = ctx.createLinearGradient(26, 0, 122, 0);
	brushed.addColorStop(0, 'rgba(255,255,255,0.16)');
	brushed.addColorStop(0.34, 'rgba(255,255,255,0.03)');
	brushed.addColorStop(0.74, 'rgba(0,0,0,0.03)');
	brushed.addColorStop(1, 'rgba(0,0,0,0.12)');
	ctx.fillStyle = brushed;
	ctx.fillRect(24, 152, 100, 114);

	// Warm ground bounce in the bowl's lower corner.
	const bounce = ctx.createLinearGradient(0, 228, 0, 266);
	bounce.addColorStop(0, 'rgba(255,246,224,0)');
	bounce.addColorStop(1, 'rgba(255,246,224,0.1)');
	ctx.fillStyle = bounce;
	ctx.fillRect(24, 228, 100, 38);
	ctx.restore();

	// Spill guard's lit fold, the shaded underside and the back-plate gloss.
	line(ctx, 37.5, 159.4, 111, 153.6, 'rgba(255,255,255,0.58)', 1.4);
	line(ctx, 39.5, 163, 109.5, 157.2, 'rgba(255,246,224,0.2)', 1);
	line(ctx, 114.6, 156, 114.6, 175, 'rgba(255,255,255,0.5)', 1);
	line(ctx, 44, 206, 100, 184.6, 'rgba(255,255,255,0.3)', 1.2);

	// Scuffed floor inside the scoop, catching the sky.
	line(ctx, 52, 191, 104, 185, 'rgba(255,246,224,0.24)', 1.2);
	line(ctx, 58, 194.5, 96, 190, 'rgba(255,246,224,0.14)', 1);

	// Hardened cutting edge: bright bevel and the wear highlights along the blade.
	line(ctx, 26.6, 247.4, 30.4, 257.2, 'rgba(255,255,255,0.5)', 1.2);
	line(ctx, 30, 259.4, 46, 263.4, 'rgba(255,255,255,0.18)', 1);
	for (const [chipX, chipY, w, h, alpha] of [
		[32, 250, 8, 2, 0.42],
		[58, 248, 6, 1.8, 0.32],
		[86, 242, 7, 2, 0.28]
	]) {
		ctx.save();
		ctx.globalAlpha = alpha;
		ctx.fillStyle = CREAM;
		ctx.fillRect(chipX, chipY, w, h);
		ctx.restore();
	}

	// Quick-attach pins and bucket bolt speculars.
	ctx.fillStyle = 'rgba(255,255,255,0.88)';
	for (const [pipX, pipY] of [
		[114.2, 174.2],
		[114.2, 207.2],
		[29.4, 257.6],
		[35.4, 254.8]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}

	glint(ctx, 68, 216, 2.6);
}

/** The bucket: scooped rim, dark interior, hardened edge and the quick-attach plate. */
function drawBucket(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, BUCKET, YELLOW, 3);

	ctx.save();
	ctx.clip(new Path2D(BUCKET));

	// The open mouth: dark interior under a steel spill guard.
	ctx.fillStyle = CHARCOAL_DARK;
	ctx.beginPath();
	ctx.moveTo(38, 166);
	ctx.lineTo(112, 160);
	ctx.lineTo(120, 159);
	ctx.lineTo(120, 176);
	ctx.quadraticCurveTo(94, 182, 72, 184);
	ctx.quadraticCurveTo(52, 186, 38, 178);
	ctx.closePath();
	ctx.fill();
	// Inner bowl falling away from the light, no lit edge on the mouth.
	ctx.fillStyle = 'rgba(0,0,0,0.25)';
	ctx.beginPath();
	ctx.moveTo(120, 168);
	ctx.lineTo(120, 176);
	ctx.quadraticCurveTo(94, 180, 72, 182);
	ctx.quadraticCurveTo(56, 184, 46, 178);
	ctx.lineTo(46, 172);
	ctx.quadraticCurveTo(74, 178, 96, 172);
	ctx.closePath();
	ctx.fill();

	// Scuffed steel floor inside the scoop.
	ctx.strokeStyle = 'rgba(255,246,224,0.22)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(52, 190);
	ctx.quadraticCurveTo(78, 192, 104, 184);
	ctx.stroke();

	// Steel spill guard folded along the rim.
	ctx.fillStyle = STEEL;
	ctx.beginPath();
	ctx.moveTo(35, 159);
	ctx.lineTo(112, 153);
	ctx.lineTo(122, 153);
	ctx.lineTo(122, 159);
	ctx.lineTo(112, 160);
	ctx.lineTo(37, 166);
	ctx.closePath();
	ctx.fill();
	line(ctx, 37, 160, 111, 154, 'rgba(255,255,255,0.66)', 1.8);
	line(ctx, 40, 163.5, 110, 157.5, 'rgba(0,0,0,0.26)', 1.4);

	// Back plate lip and its two rivets.
	line(ctx, 114, 155, 114, 176, 'rgba(255,255,255,0.4)', 1.6);
	line(ctx, 119.5, 155, 119.5, 176, 'rgba(0,0,0,0.2)', 1.4);

	if (shaded) {
		const bowl = ctx.createLinearGradient(0, 150, 0, 266);
		bowl.addColorStop(0, 'rgba(255,255,255,0.3)');
		bowl.addColorStop(0.38, 'rgba(255,255,255,0.03)');
		bowl.addColorStop(1, 'rgba(96,66,10,0.34)');
		ctx.fillStyle = bowl;
		ctx.fillRect(22, 148, 102, 120);
	}
	ctx.restore();

	// Hardened cutting edge along the bottom of the front face.
	ctx.save();
	ctx.clip(new Path2D(BUCKET));
	shape(ctx, 'M23,236 L26,252 Q30,264 48,265 L48,256 Q32,254 29,240 Z', STEEL, 2);
	line(ctx, 26, 248, 30, 258, 'rgba(255,255,255,0.4)', 1.4);
	ctx.restore();

	// Front-face ribs and the top rim's lit fold.
	for (const rib of [
		[46, 192, 42, 246],
		[76, 186, 72, 250],
		[104, 180, 106, 244]
	]) {
		line(ctx, rib[0], rib[1], rib[2], rib[3], 'rgba(58,39,27,0.26)', 2.6);
		line(ctx, rib[0] - 2.4, rib[1], rib[2] - 2.4, rib[3], 'rgba(255,255,255,0.3)', 1.6);
	}
	line(ctx, 46, 258, 100, 254, 'rgba(255,255,255,0.24)', 2.2);
	line(ctx, 34, 176, 30, 236, 'rgba(255,255,255,0.22)', 2.2);

	if (fitted) {
		rect(ctx, 110, 166, 10, 52, CHARCOAL_DARK, 2, 1.8);
		circle(ctx, 115, 175, 2.6, CHROME, 1.2);
		circle(ctx, 115, 208, 2.6, CHROME, 1.2);
		line(ctx, 112, 192, 118, 192, 'rgba(201,210,222,0.6)', 1.4);
		for (const boltX of [30, 36, 42]) {
			circle(ctx, boltX, 258 - (boltX - 30) * 0.5, 1.5, CHROME, 0.9);
		}
	}

}

/** Windscreen: two raked streaks and the frame lip catching the light. */
function glassSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(GLASS_MASK));
	ctx.strokeStyle = 'rgba(255,255,255,0.62)';
	ctx.lineWidth = 3.2;
	ctx.beginPath();
	ctx.moveTo(256, 143);
	ctx.lineTo(272, 106);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(262, 144);
	ctx.lineTo(281, 111.5);
	ctx.stroke();
	ctx.restore();
	line(ctx, 250, 100.6, 304, 100.6, 'rgba(255,255,255,0.42)', 1.1);
}

/** Stack, soot and the picture-book puff. */
function drawStack(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, STACK, STEEL, 2.2);
	if (shaded) {
		line(ctx, 498.5, 120, 498.5, 144, 'rgba(255,255,255,0.4)', 1.6);
		line(ctx, 505.5, 120, 505.5, 144, 'rgba(0,0,0,0.24)', 1.4);
	}
	if (fitted) {
		rect(ctx, 494, 116, 16, 4, CHARCOAL, 1.5, 1.4);
	}
}

/** Working marks, soot and the last dust shadow. */
function finishingMarks(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	// Lamp pips: beacon, work lamp and the rear marker lenses.
	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[250.4, 64.4, 1.1],
		[238.8, 88.8, 1.2],
		[524.4, 241, 0.9]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}
	line(ctx, 515, 239.4, 526, 239.4, 'rgba(255,255,255,0.45)', 1);
	line(ctx, 465.6, 197.4, 494, 197.4, 'rgba(255,255,255,0.5)', 1);

	ctx.save();
	ctx.clip(new Path2D(PUFF));
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = '#D5DCE5';
	for (const [px, py, pr] of [
		[496, 110, 5],
		[508, 104, 5.6],
		[518, 108, 4.2]
	]) {
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	ctx.save();
	ctx.globalAlpha = 0.14;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(500, 117, 8, 2.6, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalAlpha = 0.1;
	ctx.beginPath();
	ctx.ellipse(516, 250, 26, 3, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	if (!fitted) return;

	// Paint chips on the skirt, the arm, the deck edge and the engine cover.
	ctx.save();
	ctx.clip(new Path2D(BODY_MASK));
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[200, 246, 10, 2, 0.34],
		[248, 248, 6, 1.8, 0.28],
		[366, 246, 8, 2, 0.24],
		[486, 240, 9, 2, 0.26],
		[150, 168, 7, 1.8, 0.3],
		[528, 216, 5, 2.2, 0.3],
		[282, 160, 8, 1.8, 0.26],
		[404, 164, 6, 2, 0.24],
		[460, 209, 6, 1.8, 0.22],
		[506, 226, 4, 2.4, 0.26]
	]) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();
}

export function drawRealSkidSteerLevel(
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
		ctx.globalAlpha = 0.17;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(318, 277, 264, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	drawBody(ctx, shaded, fitted);
	drawArm(ctx, shaded, fitted);
	drawCage(ctx, shaded, fitted);
	drawBucket(ctx, shaded, fitted);
	drawStack(ctx, shaded, fitted);

	// Windscreen, painted over the paint so it stays clean.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 247, 98, 60, 54);
	}
	if (fitted) {
		line(ctx, 252, 146, 306, 143, INK, 2.2);
		line(ctx, 300, 140, 268, 108, INK, 1.8);
		line(ctx, 250, 144, 250, 104, 'rgba(255,255,255,0.16)', 1.4);
	}

	// Both wheels share the one wheel part; the rear tile is its exact mirror.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: roof lip, arm spine, bucket rim and the rear deck edge.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(236, 77);
		ctx.lineTo(410, 77);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(126, 157);
		ctx.lineTo(298, 147);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(302, 147);
		ctx.lineTo(448, 155);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(36, 180);
		ctx.lineTo(106, 156);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(538, 166);
		ctx.lineTo(538, 240);
		ctx.stroke();

		// Work-lamp glow, beacon flash.
		const lampGlow = ctx.createRadialGradient(240, 90, 1, 240, 90, 26);
		lampGlow.addColorStop(0, 'rgba(255,240,150,0.66)');
		lampGlow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = lampGlow;
		ctx.beginPath();
		ctx.arc(240, 90, 26, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(248, 66, 1, 248, 66, 22);
		beacon.addColorStop(0, 'rgba(255,183,3,0.5)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(248, 66, 22, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the small tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 266, 21, 4.4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Picture-book pass, in layers: grain, machine sheen, glints, hubs, wear.
		paintGrain(ctx);
		armSheen(ctx);
		cageSheen(ctx);
		bucketSheen(ctx);
		glassSheen(ctx);

		// Glints on paint, glass and chrome, clear of the tyres and the open cab.
		glint(ctx, 176, 172, 3.6);
		glint(ctx, 350, 168, 3);
		glint(ctx, 272, 84, 2.8);
		glint(ctx, 214, 224, 3.2);
		glint(ctx, 492, 186, 2.6);
		glint(ctx, 274, 128, 2.2);
		glint(ctx, 508, 172, 2.1);
		glint(ctx, 244, 236, 2.2);

		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx, fitted);
	}

	ctx.restore();
}

export function drawRealSkidSteer(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealSkidSteerLevel(ctx, x, y, scale, 5);
}
