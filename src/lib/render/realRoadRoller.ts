/**
 * Road roller art, cut into the same five-piece kit as the other realistic works machines.
 * A yellow tandem roller facing left: one big smooth drum ahead of a glazed operator cab,
 * an articulated joint, a rear engine hood under a charcoal water tank, and a second drum
 * at the tail. One drum piece serves both ends; the rear slot scales the same tile down.
 * Level 5 is the production target: shaded, fully fitted, lit and picture-book finished.
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
	rectMask,
	shape
} from './realKit';

const YELLOW = '#F9C74F';
const YELLOW_DARK = '#D9A62E';
const YELLOW_DEEP = '#B9851C';
const CHARCOAL = '#2B2D42';
const CHARCOAL_LIGHT = '#3D405B';
const AMBER = '#FFB703';
const LAMP = '#FFF3B0';
const RED = '#E0455A';
const CREAM = '#FFF6E0';

/** Art box 680 x 340, road at 272. Front (the big drum) faces left. */
const DRUM_L = { x: 152, y: 220, r: 52 };
const DRUM_R = { x: 556, y: 228, r: 44 };

/**
 * Cab shell: the front sits on the big drum, so the lower-front corner follows the drum
 * circle and leaves a clean arch. Raked front pillar, flat roof over the articulation.
 */
const CAB =
	'M176,174 A52,52 0 0 1 202.1,206 L338,206 L338,100 Q338,84 326,84 L228,84 Q212,86 208,102 L196,140 Q188,146 186,160 L176,174 Z';

/**
 * Rear module: engine hood with an exhaust stack welded into the silhouette, the water
 * tank and its filler cap on top, and an arch cut over the rear drum. One subpath, so the
 * even-odd mask never punches a hole through the tank.
 */
const REAR =
	'M356,206 L356,166 Q356,150 372,146 L370,146 L370,88 L384,88 L384,146 L392,146 L392,126 Q392,112 408,108 L420,106 L420,104 L426,104 L426,96 L442,96 L442,104 L556,104 Q574,104 580,122 L580,146 L592,148 Q606,154 610,172 Q614,186 610,198 L610,214 L597.7,214 A44,44 0 0 0 514.3,214 L356,214 Z';

/** Water tank outline: the same top edge as REAR, closed along the hood line. */
const TANK =
	'M392,146 L392,126 Q392,112 408,108 L420,106 L420,104 L426,104 L426,96 L442,96 L442,104 L556,104 Q574,104 580,122 L580,146 Z';

/** Articulation plate: a charcoal block that bridges cab and rear module. */
const JOINT = 'M338,160 L356,160 L356,206 L338,206 Z';

const BEACON = 'M296,84 L296,78 Q296,64 306,64 Q316,64 316,78 L316,84 Z';
const ROOF_LAMP = 'M208,84 L208,76 L226,76 L226,84 Z';
const MIRROR_HEAD = 'M172,88 L188,88 L188,104 L172,104 Z';
const MIRROR_STALK = 'M188,96 L206,100 L206,104 L188,100 Z';
const STEP = 'M246,206 L282,206 L282,214 L246,214 Z';

/** Body mask: shell plus fittings outside it. No drum circle is ever cut into this. */
const BODY_MASK = `${CAB} ${REAR} ${JOINT} ${BEACON} ${ROOF_LAMP} ${MIRROR_HEAD} ${MIRROR_STALK} ${STEP}`;

/** Glazing: raked windscreen and one cab side pane, separated by the A-pillar. */
const WINDSCREEN = 'M190,158 L200,112 Q203,100 215,98 L246,98 L246,158 Z';
const SIDE_WINDOW =
	'M258,96 L322,96 Q328,96 328,102 L328,154 Q328,160 322,160 L258,160 Q252,160 252,154 L252,102 Q252,96 258,96 Z';
const GLASS_MASK = `${WINDSCREEN} ${SIDE_WINDOW}`;

/** Cab door: a clean rectangle clear of both panes. */
const DOOR = { x: 252, y: 166, w: 72, h: 36 };
const DOOR_MASK = rectMask(DOOR.x, DOOR.y, DOOR.w, DOOR.h);

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
	glass.addColorStop(0.46, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.3)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** A smooth steel drum: a flat machined end face inside a dark rolled rim. */
function drawDrum(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	r: number,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	circle(ctx, cx, cy, r, '#7C8595', 3.2);

	// Rolled rim band.
	ctx.strokeStyle = '#565F6D';
	ctx.lineWidth = Math.max(5, r * 0.1);
	ctx.beginPath();
	ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
	ctx.stroke();

	// Flat end plate, proud of the rim.
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.76, 0, Math.PI * 2);
	ctx.fillStyle = 'rgba(255,255,255,0.07)';
	ctx.fill();

	circle(ctx, cx, cy, r * 0.2, '#4B5361', 2.2);
	circle(ctx, cx, cy, r * 0.085, CHROME, 1.4);

	if (shaded) {
		// Rolled crown: light at the top, a deep contact shade along the road edge.
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, r - 1.5, 0, Math.PI * 2);
		ctx.clip();
		const crown = ctx.createLinearGradient(cx - r * 0.4, cy - r, cx + r * 0.4, cy + r);
		crown.addColorStop(0, 'rgba(255,255,255,0.34)');
		crown.addColorStop(0.42, 'rgba(255,255,255,0.02)');
		crown.addColorStop(1, 'rgba(10,12,20,0.36)');
		ctx.fillStyle = crown;
		ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

		// Sheen where the cylindrical shell turns under the light.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = Math.max(2, r * 0.06);
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.86, Math.PI * 1.06, Math.PI * 1.52);
		ctx.stroke();
		ctx.restore();
	}

	if (fitted) {
		// End-plate bolts sit close to the hub; wide-set nuts read as a tyre.
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
			circle(
				ctx,
				cx + Math.cos(a) * r * 0.34,
				cy + Math.sin(a) * r * 0.34,
				Math.max(1.3, r * 0.038),
				CHARCOAL_LIGHT,
				1
			);
		}
	}

	if (lit) {
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.arc(cx, cy, r - 2, Math.PI * 1.06, Math.PI * 1.58);
		ctx.stroke();
	}

	if (finish) {
		// Machined end plate: a polished wear band, a dark cut line and a broad crown sheen.
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
		ctx.clip();

		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = Math.max(1.4, r * 0.05);
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.7, Math.PI * 1.02, Math.PI * 1.98);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(20,26,38,0.22)';
		ctx.lineWidth = Math.max(1.2, r * 0.035);
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.62, Math.PI * 0.98, Math.PI * 2.02);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.26)';
		ctx.lineWidth = Math.max(5, r * 0.14);
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.84, Math.PI * 1.16, Math.PI * 1.42);
		ctx.stroke();

		// A warm bounce off the road along the lower shell.
		ctx.strokeStyle = 'rgba(255,203,112,0.16)';
		ctx.lineWidth = Math.max(4, r * 0.09);
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.92, Math.PI * 0.3, Math.PI * 0.7);
		ctx.stroke();
		ctx.restore();

		// Polished hub: bright ring, six cap bolts and a lit centre.
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = Math.max(1.2, r * 0.03);
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.26, 0, Math.PI * 2);
		ctx.stroke();
		for (let i = 0; i < 6; i++) {
			const a = (i / 6) * Math.PI * 2 + Math.PI / 12;
			circle(
				ctx,
				cx + Math.cos(a) * r * 0.225,
				cy + Math.sin(a) * r * 0.225,
				Math.max(1.1, r * 0.028),
				CHROME,
				0.9
			);
		}
		ctx.fillStyle = 'rgba(255,255,255,0.92)';
		ctx.beginPath();
		ctx.arc(cx, cy, Math.max(1.2, r * 0.035), 0, Math.PI * 2);
		ctx.fill();
		line(ctx, cx - r * 0.04, cy, cx + r * 0.04, cy, 'rgba(58,39,27,0.45)', 1);

		glint(ctx, cx + r * 0.42, cy - r * 0.46, r * 0.16);
		glint(ctx, cx - r * 0.52, cy + r * 0.4, r * 0.075);
	}
}

/** Deterministic picture-book paint grain, clipped to the painted shell. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${DOOR_MASK} ${circleMask(
		DRUM_L.x,
		DRUM_L.y,
		DRUM_L.r
	)} ${circleMask(DRUM_R.x, DRUM_R.y, DRUM_R.r)}`;

	ctx.save();
	ctx.clip(new Path2D(BODY_MASK), 'evenodd');
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');

	let seed = 29;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 420; i++) {
		const px = 182 + rnd() * 420;
		const py = 66 + rnd() * 146;
		const size = 1.5 + rnd() * 1.4;
		ctx.globalAlpha = 0.07 + rnd() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 150; i++) {
		const px = 182 + rnd() * 420;
		const py = 66 + rnd() * 146;
		const size = 1.3 + rnd() * 1.1;
		ctx.globalAlpha = 0.13 + rnd() * 0.08;
		ctx.fillRect(px, py, size, size);
	}
	// Warm primer flecks keep the yellow from reading as flat plastic.
	ctx.fillStyle = YELLOW_DEEP;
	for (let i = 0; i < 110; i++) {
		const px = 182 + rnd() * 420;
		const py = 66 + rnd() * 146;
		const size = 1.2 + rnd() * 1.3;
		ctx.globalAlpha = 0.08 + rnd() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();

	// Long brush sweeps across the cab flank and the engine hood.
	ctx.save();
	ctx.clip(new Path2D(BODY_MASK), 'evenodd');
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');
	ctx.strokeStyle = 'rgba(255,255,255,0.15)';
	ctx.lineWidth = 2;
	for (const [x1, y1, x2, y2] of [
		[206, 144, 326, 142],
		[412, 166, 588, 164],
		[210, 190, 330, 189],
		[224, 108, 318, 106],
		[430, 192, 594, 190]
	]) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.quadraticCurveTo((x1 + x2) / 2, y1 - 2, x2, y2);
		ctx.stroke();
	}
	// A second, finer pair of sweeps gives the paint two visible layers.
	ctx.strokeStyle = 'rgba(255,255,255,0.1)';
	ctx.lineWidth = 1.3;
	for (const [x1, y1, x2, y2] of [
		[240, 128, 330, 127],
		[378, 132, 430, 131]
	]) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	ctx.restore();
}

/** A four-point paint glint with a warm core. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 1.7, 0, Math.PI * 2);
	ctx.fill();
}

export function drawRealRoadRollerLevel(
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
		ctx.ellipse(346, 277, 300, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Rear module first, then the cab in front of the articulation.
	shape(ctx, REAR, YELLOW);
	shape(ctx, CAB, YELLOW);
	shape(ctx, JOINT, CHARCOAL);

	// Chassis and lower skirts never carry body colour.
	rect(ctx, 360, 198, 250, 16, CHARCOAL, 3, 2.5);
	rect(ctx, 204, 198, 134, 8, CHARCOAL, 2, 2.5);

	// The water tank and the exhaust stack sit proud of the hood.
	shape(ctx, TANK, CHARCOAL);
	shape(ctx, 'M370,146 L370,88 L384,88 L384,146 Z', STEEL, 2.5);
	rect(ctx, 373, 92, 8, 48, CHARCOAL_LIGHT, 2, 2);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(CAB));
		const paint = ctx.createLinearGradient(0, 84, 0, 206);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.46, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(25,18,10,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(172, 80, 170, 130);
		ctx.restore();

		ctx.save();
		ctx.clip(new Path2D(REAR));
		const hood = ctx.createLinearGradient(0, 96, 0, 214);
		hood.addColorStop(0, 'rgba(255,255,255,0.26)');
		hood.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		hood.addColorStop(1, 'rgba(25,18,10,0.26)');
		ctx.fillStyle = hood;
		ctx.fillRect(352, 92, 262, 126);
		ctx.restore();

		ctx.save();
		ctx.clip(new Path2D(TANK));
		const tank = ctx.createLinearGradient(0, 104, 0, 146);
		tank.addColorStop(0, 'rgba(255,255,255,0.24)');
		tank.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		tank.addColorStop(1, 'rgba(0,0,0,0.3)');
		ctx.fillStyle = tank;
		ctx.fillRect(390, 94, 192, 54);
		ctx.restore();
	}

	// Engine louvres, rear grille and tail lamps.
	if (fitted) {
		rect(ctx, 414, 158, 86, 30, YELLOW_DARK, 3, 2.2);
		for (let vent = 0; vent < 4; vent++) {
			line(ctx, 419, 165 + vent * 6, 495, 165 + vent * 6, 'rgba(43,45,66,0.5)', 2);
		}
		rect(ctx, 578, 150, 16, 26, CHARCOAL_LIGHT, 2.5, 2.2);
		for (let slat = 0; slat < 4; slat++) {
			line(ctx, 581, 155 + slat * 5, 591, 155 + slat * 5, 'rgba(201,210,222,0.5)', 1.2);
		}
		rect(ctx, 596, 152, 10, 10, RED, 2, 1.8);
		rect(ctx, 596, 166, 10, 10, AMBER, 2, 1.8);
		rect(ctx, 598, 190, 11, 22, CHROME, 3, 2.5);
		line(ctx, 601, 194, 607, 194, 'rgba(58,39,27,0.4)', 1.4);
	}

	// Tank strapping, filler cap and a chrome level gauge.
	if (fitted) {
		ctx.save();
		ctx.clip(new Path2D(TANK));
		rect(ctx, 452, 104, 8, 42, YELLOW, 1, 1.6);
		rect(ctx, 524, 104, 8, 42, YELLOW, 1, 1.6);
		line(ctx, 456, 112, 456, 140, 'rgba(58,39,27,0.4)', 1.2);
		line(ctx, 528, 112, 528, 140, 'rgba(58,39,27,0.4)', 1.2);
		ctx.restore();
		rect(ctx, 456, 118, 12, 7, CHROME, 2, 1.4);
		rect(ctx, 528, 118, 12, 7, CHROME, 2, 1.4);
		rect(ctx, 426, 96, 16, 8, CHROME, 2, 2);
		line(ctx, 429, 99, 439, 99, 'rgba(58,39,27,0.4)', 1.2);
		rect(ctx, 370, 88, 14, 5, CHARCOAL, 1, 2);
		line(ctx, 372, 97, 382, 97, CHROME, 1.4);
	}

	// Articulation: pivot pin and the steering ram under the joint plate.
	if (fitted) {
		line(ctx, 340, 197, 354, 172, STEEL, 5);
		line(ctx, 341, 195, 353, 174, CHROME, 2);
		circle(ctx, 347, 184, 7, CHROME, 2.2);
		circle(ctx, 347, 184, 2.6, INK, 1.2);
	}

	// Roof gear: beacon, work lamp, mirror and the cab marker lamps.
	shape(ctx, BEACON, AMBER, 2.2);
	if (fitted) {
		rect(ctx, 296, 80, 20, 4, CHARCOAL, 1, 2);
		rect(ctx, 208, 76, 18, 8, CHARCOAL, 1.5, 2);
		rect(ctx, 210, 78, 7, 4, LAMP, 1, 1.2);
		line(ctx, 188, 97, 205, 101, STEEL, 3.2);
		line(ctx, 188, 97, 205, 101, CHROME, 1.4);
		shape(ctx, MIRROR_HEAD, CHARCOAL, 2);
		rect(ctx, 174, 90, 12, 12, GLASS, 1.5, 1.2);
		rect(ctx, 232, 86, 7, 3, AMBER, 1, 1);
		rect(ctx, 246, 86, 7, 3, AMBER, 1, 1);
	}

	// Glazing, then the door panel over the sill.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);

	if (shaded) {
		glassShade(ctx, WINDSCREEN, 190, 98, 60, 60);
		glassShade(ctx, SIDE_WINDOW, 252, 96, 76, 64);
	}

	if (fitted) {
		line(ctx, 199, 120, 232, 142, 'rgba(43,45,66,0.45)', 2);
		line(ctx, 200, 117, 233, 139, 'rgba(255,255,255,0.5)', 1.2);
	}

	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, YELLOW, 3, 2.5);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(DOOR_MASK));
		const door = ctx.createLinearGradient(0, DOOR.y, 0, DOOR.y + DOOR.h);
		door.addColorStop(0, 'rgba(255,255,255,0.2)');
		door.addColorStop(1, 'rgba(25,18,10,0.16)');
		ctx.fillStyle = door;
		ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
		ctx.restore();
	}

	if (fitted) {
		rect(ctx, 312, 178, 9, 5, CHROME, 1.5, 1.4);
		rect(ctx, 254, 169, 3, 8, STEEL, 1, 1.2);
		rect(ctx, 254, 185, 3, 8, STEEL, 1, 1.2);
		line(ctx, DOOR.x + 3, DOOR.y + DOOR.h - 4, DOOR.x + DOOR.w - 3, DOOR.y + DOOR.h - 4, 'rgba(58,39,27,0.32)', 1.2);
		rect(ctx, 247, 207, 34, 6, CHARCOAL_LIGHT, 1.5, 2);
		line(ctx, 251, 209, 277, 209, CHROME, 1.2);
	}

	// Front face details: work lamp, marker and the cab grab rail.
	if (fitted) {
		circle(ctx, 198, 184, 7, CHROME, 2.2);
		circle(ctx, 198, 184, 4.2, LAMP, 1.2);
		circle(ctx, 190, 168, 3.4, AMBER, 1.2);
		line(ctx, 334, 110, 334, 158, CHROME, 2.4);
		line(ctx, 330, 110, 334, 110, CHROME, 1.8);
		line(ctx, 330, 158, 334, 158, CHROME, 1.8);
	}

	// Fender line over the rear drum, kept inside the body arch.
	if (fitted) {
		ctx.strokeStyle = YELLOW_DEEP;
		ctx.lineWidth = 8;
		ctx.beginPath();
		ctx.arc(DRUM_R.x, DRUM_R.y, 50, Math.PI * 1.06, Math.PI * 1.94);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(58,39,27,0.35)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(DRUM_R.x, DRUM_R.y, 54, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	// One drum piece, drawn twice. The rear is the same art, smaller.
	drawDrum(ctx, DRUM_L.x, DRUM_L.y, DRUM_L.r, shaded, fitted, lit, finish);
	drawDrum(ctx, DRUM_R.x, DRUM_R.y, DRUM_R.r, shaded, fitted, lit, finish);

	if (lit) {
		// Rim light on the roofline, tank top and body edges.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(230, 85.4);
		ctx.lineTo(324, 85.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(416, 105.4);
		ctx.lineTo(554, 105.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.38)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(188, 162);
		ctx.lineTo(178, 200);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(609, 180);
		ctx.lineTo(609, 196);
		ctx.stroke();

		// Marker lamp glow and the amber beacon wash.
		const lampGlow = ctx.createRadialGradient(198, 184, 1, 198, 184, 26);
		lampGlow.addColorStop(0, 'rgba(255,243,176,0.7)');
		lampGlow.addColorStop(1, 'rgba(255,243,176,0)');
		ctx.fillStyle = lampGlow;
		ctx.beginPath();
		ctx.arc(198, 184, 26, 0, Math.PI * 2);
		ctx.fill();

		const beaconGlow = ctx.createRadialGradient(306, 70, 1, 306, 70, 20);
		beaconGlow.addColorStop(0, 'rgba(255,183,3,0.5)');
		beaconGlow.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beaconGlow;
		ctx.beginPath();
		ctx.arc(306, 70, 20, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under both drums.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const drum of [DRUM_L, DRUM_R]) {
			ctx.beginPath();
			ctx.ellipse(drum.x, 272, drum.r * 0.72, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Paint and glass glints, all inside the body silhouette.
		ctx.save();
		ctx.clip(new Path2D(BODY_MASK), 'evenodd');
		glint(ctx, 206, 132, 5);
		glint(ctx, 428, 170, 4.2);
		glint(ctx, 562, 128, 4.4);
		glint(ctx, 330, 108, 4);
		glint(ctx, 588, 188, 3.6);
		glint(ctx, 347, 184, 3.2);
		glint(ctx, 230, 178, 4.4);
		glint(ctx, 392, 156, 3.8);
		glint(ctx, 478, 148, 4.8);
		glint(ctx, 540, 184, 3.8);
		ctx.restore();

		// Cab glazing: a pair of long sheens and a sparkle in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(201, 148);
		ctx.lineTo(228, 106);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(262, 152);
		ctx.lineTo(286, 108);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 306, 114, 4.2);

		// Water tank: polished top edge, a broad flank sheen and strap hardware.
		ctx.save();
		ctx.clip(new Path2D(TANK));
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(395, 142);
		ctx.quadraticCurveTo(395, 114, 411, 110);
		ctx.lineTo(421, 108);
		ctx.moveTo(428, 100);
		ctx.lineTo(440, 100);
		ctx.moveTo(446, 107);
		ctx.lineTo(552, 107);
		ctx.quadraticCurveTo(570, 107, 576, 124);
		ctx.lineTo(577, 142);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.24)';
		ctx.lineWidth = 4.2;
		ctx.beginPath();
		ctx.moveTo(402, 126);
		ctx.quadraticCurveTo(486, 121, 570, 124);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(404, 136);
		ctx.lineTo(570, 136);
		ctx.stroke();
		ctx.restore();

		for (const [bx, by] of [
			[456, 108],
			[528, 108],
			[456, 140],
			[528, 140]
		]) {
			circle(ctx, bx, by, 1.6, CHROME, 0.9);
		}
		line(ctx, 428, 98.5, 440, 98.5, 'rgba(255,255,255,0.7)', 1.5);
		glint(ctx, 434, 100, 2.6);
		glint(ctx, 568, 118, 3.4);

		// Beacon: a hot lens inside the amber shell, then a soft crown sparkle.
		ctx.save();
		ctx.clip(new Path2D(BEACON));
		const lens = ctx.createRadialGradient(303, 71, 1, 306, 74, 14);
		lens.addColorStop(0, 'rgba(255,255,255,0.8)');
		lens.addColorStop(0.42, 'rgba(255,220,120,0.34)');
		lens.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = lens;
		ctx.fillRect(294, 62, 26, 24);
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(299, 81);
		ctx.lineTo(313, 81);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 302, 69, 3.2);

		// Paint chips and road dust along the working edges.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[182, 196, 6, 2, 0.5],
			[238, 203, 8, 2, 0.45],
			[368, 210, 7, 2, 0.4],
			[596, 208, 5, 2, 0.4],
			[214, 148, 4, 1.6, 0.4],
			[574, 162, 5, 1.6, 0.35]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		// Exhaust puff drifting off the stack, with a pale core on the last puff.
		ctx.save();
		ctx.fillStyle = 'rgba(92,100,114,0.28)';
		for (const [px, py, pr] of [
			[364, 84, 6],
			[352, 76, 4.4],
			[342, 70, 2.8]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.fillStyle = 'rgba(230,234,240,0.35)';
		ctx.beginPath();
		ctx.arc(362, 83, 2.4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealRoadRoller(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealRoadRollerLevel(ctx, x, y, scale, 5);
}
