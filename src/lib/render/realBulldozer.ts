/**
 * Bulldozer art, cut into the same five-piece kit as the other realistic works machines.
 * A yellow tracked dozer facing left: a heavy mouldboard blade pushed ahead on arms, a
 * ripper at the tail, a glazed cab, exhaust stack, work lamps and a road-wheel track frame.
 *
 * The blade and its push arms are their own piece, split from the body at the nose. The
 * undercarriage is one rounded track piece. Level 5 is the production target: shaded,
 * fully fitted, lit and picture-book finished.
 */

import { CHROME, GLASS, INK, STEEL, circle, line, rect, shape } from './realKit';

const YELLOW = '#E9C46A';
const YELLOW_DARK = '#C9A145';
const YELLOW_LIGHT = '#F6DFA6';
const GREY = '#6B6B6B';
const GREY_DARK = '#4B4B4B';
const GREY_LIGHT = '#8A8A8A';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';
const CREAM = '#FFF6E0';

/** Art box 720 x 340, road at 272. Front (blade) faces left. */
const SHELL =
	'M176,198 L176,150 L194,142 L222,142 L240,76 Q242,66 252,66 L312,66 L314,56 Q322,46 330,56 L332,66 L344,66 Q352,66 352,74 L352,128 L356,134 L468,143 L468,82 L494,82 L494,144 L562,150 L562,172 L616,172 L616,192 L600,198 L676,242 L690,238 L704,250 L700,266 L684,272 L660,266 L580,206 L562,198 Z';

/** Spec body mask: the shell plus the mirror head, which sits outside it. */
const BODY_MASK = `${SHELL} M210,84 L224,84 L224,102 L210,102 Z`;

/** Blade and push arms, split off the body as the fifth piece. */
const BLADE_MASK =
	'M176,164 L84,190 L22,182 Q8,180 10,260 L10,272 L84,272 L84,202 L176,182 Z';

/** The painted silhouette for shading and grain: body mask plus blade, never the glass. */
function paintedPanels(): Path2D {
	const panels = new Path2D(BODY_MASK);
	panels.addPath(new Path2D(BLADE_MASK));
	return panels;
}

const TRACK_MASK =
	'M126,200 L442,200 Q472,200 472,230 L472,242 Q472,272 442,272 L126,272 Q96,272 96,242 L96,230 Q96,200 126,200 Z';

const WINDSCREEN = 'M238,82 L264,82 L264,126 L226,126 Z';
const SIDE_WINDOW =
	'M276,82 Q276,78 282,78 L328,78 Q334,78 334,84 L334,106 Q334,112 328,112 L282,112 Q276,112 276,106 Z';
const GLASS_MASK = `${WINDSCREEN} ${SIDE_WINDOW}`;

const DOOR = { x: 274, y: 120, w: 58, h: 56 };

const ROAD_WHEELS = [156, 200, 244, 288, 332, 376];
const ROAD_Y = 236;

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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.65, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.62)');
	glass.addColorStop(0.44, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(80,160,205,0.32)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Deterministic picture-book paint grain, clipped to the painted body and blade panels. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(paintedPanels());
	let seed = 71;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 380; i++) {
		const px = 12 + rnd() * 688;
		const py = 52 + rnd() * 214;
		const size = 1.5 + rnd() * 1.5;
		ctx.globalAlpha = 0.09 + rnd() * 0.07;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 120; i++) {
		const px = 12 + rnd() * 688;
		const py = 52 + rnd() * 214;
		const size = 1.3 + rnd() * 1.1;
		ctx.globalAlpha = 0.16 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Larger flecks so the grain still reads at the game scale.
	ctx.fillStyle = INK;
	for (let i = 0; i < 30; i++) {
		const px = 12 + rnd() * 688;
		const py = 52 + rnd() * 214;
		ctx.globalAlpha = 0.06 + rnd() * 0.05;
		ctx.fillRect(px, py, 2.6 + rnd() * 1.6, 2.4 + rnd() * 1.4);
	}

	// Long, faint brush sweeps over the cab, hood and blade.
	ctx.globalAlpha = 0.09;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[246, 136, 344, 130],
		[366, 148, 462, 145],
		[494, 158, 548, 160],
		[26, 200, 78, 204],
		[214, 176, 330, 180]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Polished blade face: a soft diagonal sheen and a lit cutting edge. */
function bladeSheen(ctx: CanvasRenderingContext2D): void {
	const blade = new Path2D('M22,182 Q8,180 10,260 L10,272 L84,272 L84,202 Z');
	ctx.save();
	ctx.clip(blade);

	const face = ctx.createLinearGradient(10, 182, 84, 272);
	face.addColorStop(0, 'rgba(255,255,255,0.3)');
	face.addColorStop(0.34, 'rgba(255,255,255,0.02)');
	face.addColorStop(1, 'rgba(58,39,27,0.18)');
	ctx.fillStyle = face;
	ctx.fillRect(8, 180, 80, 94);

	// Rounded face catchlights, following the mouldboard curve.
	line(ctx, 21, 186, 29, 250, 'rgba(255,255,255,0.4)', 2.2);
	line(ctx, 30, 188, 38, 250, 'rgba(255,255,255,0.2)', 1.6);

	// Bright steel cutting edge and its polished lip.
	const edge = ctx.createLinearGradient(0, 254, 0, 272);
	edge.addColorStop(0, 'rgba(255,255,255,0.34)');
	edge.addColorStop(0.45, 'rgba(255,255,255,0.06)');
	edge.addColorStop(1, 'rgba(58,39,27,0.2)');
	ctx.fillStyle = edge;
	ctx.fillRect(10, 254, 74, 18);
	line(ctx, 12, 257.5, 82, 257.5, 'rgba(255,255,255,0.72)', 2);

	// Scrape marks left by the working edge.
	ctx.globalAlpha = 0.26;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.3;
	for (const [sx, sy, ex] of [
		[22, 262, 46],
		[40, 266, 64],
		[56, 260, 78]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, sy - 2);
		ctx.stroke();
	}

	// Paint chips along the lower blade shoulders.
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[14, 248, 7, 2, 0.4],
		[30, 246, 5, 1.8, 0.32],
		[66, 249, 8, 2, 0.36]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	// Lit top lip runs the length of the blade, just inside the outline.
	line(ctx, 22, 183.5, 82, 190.5, 'rgba(255,255,255,0.62)', 2.4);
}

/** A four-point paint glint, sized to survive the game scale. */
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
	ctx.arc(x, y, 2, 0, Math.PI * 2);
	ctx.fill();
}

/** Picture-book hub: bright rim ring, five bolts and a pale centre cap. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.32, y + Math.sin(a) * r * 0.32, 1.7, CHROME, 1);
	}

	// A second, smaller ring of rivets between the bolts.
	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2 + Math.PI / 5;
		circle(ctx, x + Math.cos(a) * r * 0.2, y + Math.sin(a) * r * 0.2, 1.1, GREY_LIGHT, 0.8);
	}

	circle(ctx, x, y, r * 0.14, '#E8EDF4', 1.1);

	// Specular arc on the rim and a catchlight on the tyre shoulder.
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.66, Math.PI * 1.08, Math.PI * 1.5);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.4)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.86, Math.PI * 1.06, Math.PI * 1.32);
	ctx.stroke();
}

/**
 * Picture-book finishing marks: rivet rows down the cab seam, blade shoulders and hood,
 * plus chrome sheen on the shoulders and grille edges. Kept inside the body outline.
 */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(paintedPanels());

	ctx.fillStyle = 'rgba(255,246,224,0.8)';
	for (const ry of [84, 100, 116]) {
		ctx.beginPath();
		ctx.arc(348.5, ry, 1.8, 0, Math.PI * 2);
		ctx.fill();
	}
	for (const ry of [196, 216, 236]) {
		ctx.beginPath();
		ctx.arc(17, ry, 1.7, 0, Math.PI * 2);
		ctx.fill();
	}
	for (const rx of [378, 400, 422, 444, 466, 488, 510]) {
		ctx.beginPath();
		ctx.arc(rx, 155.5, 1.5, 0, Math.PI * 2);
		ctx.fill();
	}
	for (const rx of [570, 584, 598, 612]) {
		ctx.beginPath();
		ctx.arc(rx, 188, 1.6, 0, Math.PI * 2);
		ctx.fill();
	}

	line(ctx, 360, 145, 462, 148, 'rgba(255,255,255,0.28)', 1.6);
	line(ctx, 228, 136, 344, 136, 'rgba(255,255,255,0.2)', 1.6);
	line(ctx, 566, 176, 612, 178, 'rgba(255,255,255,0.28)', 1.5);
	line(ctx, 514, 156.5, 548, 156.5, 'rgba(255,255,255,0.5)', 1.4);
	ctx.restore();
}

/** One rounded track piece: belt, cleats, frame, road wheels, idler and drive sprocket. */
function drawTracks(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, TRACK_MASK, '#2B2D42', 3);

	// Inner belt band, leaving a rubber rim top and bottom.
	rect(ctx, 108, 207, 352, 58, '#3B3E4C', 24, 2.2);

	// Steel cleats running around the outside of the belt.
	for (let cx = 126; cx <= 442; cx += 20) {
		rect(ctx, cx, 201, 12, 7, '#4A4E5A', 2, 1.2);
		rect(ctx, cx + 4, 264, 12, 7, '#4A4E5A', 2, 1.2);
	}

	// Heavy track frame with the road wheels tucked inside it.
	rect(ctx, 122, 214, 324, 40, '#4B4F5C', 12, 2.4);

	for (const wx of ROAD_WHEELS) {
		circle(ctx, wx, ROAD_Y, 14, STEEL, 2.2);
		circle(ctx, wx, ROAD_Y, 6.5, GREY, 1.6);
	}

	// Front idler and rear drive sprocket.
	circle(ctx, 118, ROAD_Y, 20, '#3A3D4A', 2.6);
	circle(ctx, 118, ROAD_Y, 10, STEEL, 2);
	circle(ctx, 448, ROAD_Y, 22, '#3A3D4A', 2.6);
	circle(ctx, 448, ROAD_Y, 11, STEEL, 2);

	if (fitted) {
		for (let i = 0; i < 10; i++) {
			const a = (i / 10) * Math.PI * 2;
			line(
				ctx,
				448 + Math.cos(a) * 20,
				ROAD_Y + Math.sin(a) * 20,
				448 + Math.cos(a) * 24,
				ROAD_Y + Math.sin(a) * 24,
				'#2B2D42',
				3
			);
		}
		for (let bx = 134; bx <= 438; bx += 34) {
			circle(ctx, bx, 219, 2.2, GREY_LIGHT, 1.1);
			circle(ctx, bx, 249, 2.2, GREY_LIGHT, 1.1);
		}
	}

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(TRACK_MASK));
		const belt = ctx.createLinearGradient(0, 200, 0, 272);
		belt.addColorStop(0, 'rgba(255,255,255,0.16)');
		belt.addColorStop(0.42, 'rgba(255,255,255,0)');
		belt.addColorStop(1, 'rgba(0,0,0,0.24)');
		ctx.fillStyle = belt;
		ctx.fillRect(96, 200, 376, 72);
		ctx.restore();
		line(ctx, 130, 203, 438, 203, 'rgba(255,255,255,0.35)', 2);
	}

	if (finish) {
		// Track sheen: polished cleat tops, lit belt edges and bright idler/sprocket rims.
		ctx.save();
		ctx.clip(new Path2D(TRACK_MASK));
		line(ctx, 120, 203.2, 440, 203.2, 'rgba(255,255,255,0.5)', 2);
		line(ctx, 120, 268.8, 440, 268.8, 'rgba(255,255,255,0.26)', 1.6);
		for (let cx = 126; cx <= 438; cx += 20) {
			line(ctx, cx + 1.5, 202.2, cx + 10.5, 202.2, 'rgba(255,255,255,0.45)', 1.4);
			line(ctx, cx + 1.5, 265.4, cx + 10.5, 265.4, 'rgba(255,255,255,0.22)', 1.2);
		}
		line(ctx, 130, 214.5, 438, 214.5, 'rgba(255,255,255,0.28)', 2);

		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.arc(118, ROAD_Y, 16, Math.PI * 1.06, Math.PI * 1.46);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(448, ROAD_Y, 18, Math.PI * 1.06, Math.PI * 1.46);
		ctx.stroke();
		ctx.restore();

		for (const wx of ROAD_WHEELS) hubFinish(ctx, wx, ROAD_Y, 14);
		hubFinish(ctx, 118, ROAD_Y, 20);
		hubFinish(ctx, 448, ROAD_Y, 22);
	}
}

/**
 * Everything above the tracks. The blade is drawn first as its own cut-out, then the body
 * over its mounting edge; the ripper stays welded into the body outline.
 */
function drawBody(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	// Blade first, then the body over its mounting edge, so the two pieces read as one.
	shape(ctx, BLADE_MASK, YELLOW, 3);
	shape(ctx, BODY_MASK, YELLOW, 3);

	// Blade: steel cutting edge, curved face ribs and a bright top lip.
	shape(ctx, 'M10,272 L84,272 L84,254 L10,254 Z', STEEL, 2.4);
	line(ctx, 13, 258, 82, 258, 'rgba(255,255,255,0.32)', 2);
	line(ctx, 30, 193, 27, 250, 'rgba(58,39,27,0.26)', 2.6);
	line(ctx, 48, 194, 46, 250, 'rgba(58,39,27,0.26)', 2.6);
	line(ctx, 66, 195, 64, 250, 'rgba(58,39,27,0.26)', 2.6);
	line(ctx, 24, 184, 82, 191, CHROME, 2.6);

	// Push arm: a grey beam from the body nose down to the blade.
	shape(ctx, 'M176,164 L84,190 L84,202 L176,182 Z', GREY, 2.6);
	line(ctx, 169, 170, 92, 192, 'rgba(255,255,255,0.28)', 2.2);

	// Hydraulic ram integrated in the push arm: dark barrel, bright rod.
	line(ctx, 168, 178, 98, 194, INK, 8);
	line(ctx, 168, 178, 98, 194, STEEL, 5.5);
	line(ctx, 166, 178, 102, 192, 'rgba(255,255,255,0.5)', 1.8);

	// Ripper at the tail: steel shank and tooth under the yellow tool bar.
	shape(
		ctx,
		'M600,200 L676,244 L690,240 L704,252 L700,266 L684,272 L660,266 L580,208 Z',
		STEEL,
		2.4
	);
	line(ctx, 606, 204, 668, 242, 'rgba(255,255,255,0.26)', 2.2);
	circle(ctx, 588, 186, 4, GREY_DARK, 1.6);
	if (fitted) {
		for (const bx of [574, 592, 608]) circle(ctx, bx, 181, 2.4, CHROME, 1.1);
		rect(ctx, 556, 182, 10, 9, RED, 2, 1.6);
	}

	// Chassis skirt under the cab and hood.
	rect(ctx, 222, 180, 336, 18, GREY_DARK, 5, 2.2);
	line(ctx, 226, 184, 552, 184, 'rgba(255,255,255,0.18)', 2);

	// Engine hood panel and rear grille.
	rect(ctx, 368, 152, 176, 26, YELLOW_DARK, 4, 2.2);
	line(ctx, 372, 156, 540, 156, 'rgba(255,255,255,0.26)', 2);
	rect(ctx, 512, 154, 40, 24, GREY_DARK, 3, 2.2);
	for (let bar = 0; bar < 3; bar++) {
		line(ctx, 516, 160 + bar * 6, 548, 160 + bar * 6, CHROME, 1.6);
	}

	// Exhaust stack and cap.
	rect(ctx, 472, 92, 14, 54, GREY, 2, 2.4);
	rect(ctx, 468, 86, 24, 8, STEEL, 2, 2);
	line(ctx, 470, 118, 488, 118, INK, 2);

	// Handrail lying along the hood shoulder, kept inside the cut-out.
	line(ctx, 360, 138, 456, 144, STEEL, 2.6);
	line(ctx, 368, 138, 368, 148, STEEL, 2.2);
	line(ctx, 448, 143, 448, 153, STEEL, 2.2);

	// Cab pillars and rear seam.
	shape(ctx, 'M222,142 L240,76 L248,78 L231,142 Z', YELLOW_DARK, 2);
	rect(ctx, 264, 78, 12, 50, YELLOW_DARK, 2, 2);
	line(ctx, 352, 76, 352, 128, 'rgba(58,39,27,0.28)', 2.6);

	// Beacon bump on the cab roof.
	circle(ctx, 322, 58, 6, AMBER, 2);
	rect(ctx, 314, 62, 16, 4, GREY, 1, 1.4);

	// Nose grille ahead of the cab.
	rect(ctx, 180, 150, 18, 26, GREY_DARK, 3, 2.2);
	for (let bar = 0; bar < 3; bar++) {
		line(ctx, 183, 156 + bar * 6, 195, 156 + bar * 6, CHROME, 1.5);
	}

	if (shaded) {
		ctx.save();
		ctx.clip(paintedPanels());
		const paint = ctx.createLinearGradient(0, 50, 0, 272);
		paint.addColorStop(0, 'rgba(255,255,255,0.28)');
		paint.addColorStop(0.36, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(80,58,20,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(0, 50, 720, 222);
		ctx.restore();

		line(ctx, 256, 70, 340, 70, 'rgba(255,255,255,0.5)', 3);
		line(ctx, 86, 194, 82, 246, 'rgba(255,255,255,0.16)', 3);
	}

	if (finish) {
		paintGrain(ctx);
		bladeSheen(ctx);
	}
}

export function drawRealBulldozerLevel(
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
		ctx.ellipse(360, 278, 330, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	drawTracks(ctx, shaded, fitted, finish);
	drawBody(ctx, shaded, fitted, lit, finish);

	// Cab glass, painted over the shaded paint so it stays clean.
	shape(ctx, GLASS_MASK, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 226, 78, 40, 50);
		glassShade(ctx, SIDE_WINDOW, 276, 78, 58, 34);
		line(ctx, 240, 96, 234, 116, 'rgba(255,255,255,0.55)', 2.6);
	}

	// Door sits below the side glass, clear of both panes.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, YELLOW, 3, 2.6);
	rect(ctx, 280, 126, 46, 42, YELLOW_LIGHT, 4, 1.4);
	rect(ctx, 276, 128, 3, 12, GREY, 1, 1.2);
	rect(ctx, 315, 137, 12, 4, CHROME, 2, 1.5);

	if (fitted) {
		// Work lamp and mirror on the nose.
		circle(ctx, 208, 158, 6.5, LAMP, 2.2);
		circle(ctx, 208, 158, 3.2, CREAM, 1.2);
		circle(ctx, 208, 174, 4, AMBER, 1.6);
		line(ctx, 238, 100, 222, 94, INK, 3.4);
		line(ctx, 238, 100, 222, 94, STEEL, 2.2);
		rect(ctx, 210, 84, 14, 18, CHROME, 3, 2.2);

		// Blade bolts, hood vents, steps, wipers and cylinder mounts.
		for (const bx of [22, 38, 54, 70]) circle(ctx, bx, 264, 2.2, CHROME, 1.1);
		circle(ctx, 82, 196, 5, STEEL, 2);
		for (let vent = 0; vent < 4; vent++) {
			line(ctx, 396, 158 + vent * 5, 456, 158 + vent * 5, 'rgba(58,39,27,0.28)', 2);
		}
		line(ctx, 542, 186, 592, 196, INK, 8);
		line(ctx, 542, 186, 592, 196, STEEL, 5.5);
		circle(ctx, 542, 186, 4, GREY_DARK, 1.6);
		rect(ctx, 278, 182, 42, 4, GREY_LIGHT, 2, 1.4);
		rect(ctx, 284, 188, 32, 4, GREY_LIGHT, 2, 1.4);
		line(ctx, 230, 120, 250, 100, INK, 2.2);
		line(ctx, 288, 106, 302, 96, INK, 1.8);
		line(ctx, 320, 121, 330, 121, 'rgba(58,39,27,0.28)', 1.6);
	}

	if (lit) {
		// Rim light down the roof, hood and blade lip.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(254, 68);
		ctx.lineTo(342, 68);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(24, 183);
		ctx.lineTo(82, 190);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(360, 136);
		ctx.lineTo(464, 142);
		ctx.stroke();

		// Work-lamp glow.
		const glow = ctx.createRadialGradient(208, 158, 1, 208, 158, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.62)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(208, 158, 28, 0, Math.PI * 2);
		ctx.fill();

		// Track contact patch on the road.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(284, 272, 186, 4.5, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	if (finish) {
		finishingMarks(ctx);

		glint(ctx, 410, 166, 5.4);
		glint(ctx, 58, 214, 5.2);
		glint(ctx, 270, 70, 4.4);
		glint(ctx, 34, 206, 4.2);
		glint(ctx, 300, 92, 3.6);
		glint(ctx, 622, 232, 4.6);
		glint(ctx, 490, 150, 3.8);
		line(ctx, 320, 196, 384, 196, 'rgba(255,255,255,0.4)', 2.2);
		line(ctx, 464, 150, 552, 156, 'rgba(255,255,255,0.34)', 2);

		// Soft exhaust puff above the stack.
		ctx.save();
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr, alpha] of [
			[498, 74, 8, 0.16],
			[510, 60, 10, 0.13],
			[524, 46, 12, 0.1],
			[492, 78, 4, 0.2]
		] as const) {
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealBulldozer(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealBulldozerLevel(ctx, x, y, scale, 5);
}
