/**
 * Motor grader art, cut into the same five-piece kit as the other realistic works
 * machines. A long articulated grader facing left: a low nose over the front axle, a slim
 * front frame running back under the mouldboard, the gooseneck arch rising to the deep
 * rear frame, a glazed cab over the tandem and the teal engine deck at the tail. One wheel
 * piece serves the front axle and the rear tandem; the leading tandem axle is baked into
 * the body under its fender, so the rear still reads as a tandem pair.
 *
 * Level 4 is the production target: shaded, fully fitted and lit with a cast shadow,
 * contact patches, rim light and the headlamp and beacon glow. Level 5 adds the
 * picture-book finish: paint grain, lacquer sheen on the body and mouldboard, glints,
 * hub hardware, worked paint and the exhaust puff.
 */

import {
	CHROME,
	GLASS,
	INK,
	STEEL,
	circle,
	line,
	rect,
	shape,
	wheel
} from './realKit';

const YELLOW = '#F9C74F';
const YELLOW_DARK = '#D9A62E';
const TEAL = '#264653';
const TEAL_DARK = '#1A333C';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';
const CREAM = '#FFF6E4';

/** Art box 820 x 300, road at 270. Front (nose) faces left. */
const FRONT_WHEEL = { x: 160, y: 236, r: 34 };
/** Leading tandem axle, baked into the body under the fender. */
const TANDEM_AXLE = { x: 600, y: 236, r: 34 };
/** Trailing tandem axle, the one wheel piece used twice. */
const REAR_WHEEL = { x: 660, y: 236, r: 34 };

/**
 * One outline for the nose, front frame, gooseneck arch, cab, engine deck, counterweight
 * and tandem fender. The bottom edge dips around the baked tandem tyre so its art is never
 * clipped; the two slot wheels sit inside the shell's lower band and are drawn from their
 * own tiles on top. No circle subpaths, so evenodd never punches a wheel-shaped hole.
 */
const SHELL =
	'M76,206 L76,182 Q76,166 92,163 L150,164 L420,160 Q470,118 520,124 L536,44 L646,44 Q658,44 658,56 L658,126 L770,126 Q786,126 786,140 L786,206 L695,206 L695,236 A35,35 0 0 1 630,254 A35,35 0 0 1 565,236 L565,206 Z';

/** Amber beacon on the cab roof: a fitting outside the shell, so its own body subpath. */
const BEACON = 'M552,44 L552,34 Q552,26 560,26 L566,26 Q574,26 574,34 L574,44 Z';

/** Exhaust stack off the engine deck, behind the cab. */
const STACK = 'M664,126 L664,88 Q664,82 670,82 L676,82 Q682,82 682,88 L682,126 Z';

/** Body mask: shell plus the two fittings that stand outside it. All subpaths disjoint. */
const BODY_MASK = `${SHELL} ${BEACON} ${STACK}`;

/** The mouldboard, slung under the middle on its circle. One clean outline: the plate
 * plus the central circle stem that tucks up under the frame. */
const BLADE =
	'M300,210 L356,208 L362,192 L418,192 L424,208 L486,202 Q496,201 495,211 L493,250 Q492,260 482,262 L302,266 Q294,266 294,258 L296,216 Q296,210 300,210 Z';

/** Raked windscreen and the side pane: two disjoint glass areas, clear of the blade. */
const WINDSCREEN = 'M528,116 L539,60 L566,60 L566,116 Z';
const SIDE_GLASS =
	'M580,60 L632,60 Q640,60 640,68 L640,96 Q640,104 632,104 L580,104 Q572,104 572,96 L572,68 Q572,60 580,60 Z';
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Door and cab panels are painted into the body, so no door piece is needed. */
const DOOR = { x: 576, y: 108, w: 70, h: 18 };

/** Teal livery blocks painted inside the shell. */
const ENGINE_DECK = 'M660,126 L770,126 Q786,126 786,140 L786,190 L660,190 Z';
const ENGINE_RAIL = 'M660,190 L786,190 L786,206 L660,206 Z';
const NOSE_BAND = 'M76,190 L150,186 L150,206 L76,206 Z';
const FRAME_STRIPE = 'M150,196 L420,190 L420,198 L150,204 Z';
const POD_SHADE = 'M565,206 L695,206 L695,222 L565,222 Z';

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

/** Machined hub ring, bright crescent and five bolts; the pattern mirrors cleanly. */
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

	ctx.strokeStyle = 'rgba(255,255,255,0.82)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.37, Math.PI * 1.05, Math.PI * 1.6);
	ctx.stroke();

	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
		const bx = cx + Math.cos(a) * r * 0.235;
		const by = cy + Math.sin(a) * r * 0.235;
		circle(ctx, bx, by, 2, CHROME, 1);
	}

	circle(ctx, cx, cy, r * 0.1, CREAM, 0.9);
}

/** Deterministic picture-book grain over the painted panels, never glass or tyres. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const onGlass = (px: number, py: number): boolean =>
		(px >= 524 && px <= 570 && py >= 56 && py <= 120) ||
		(px >= 568 && px <= 644 && py >= 56 && py <= 108);
	const onWheel = (px: number, py: number): boolean =>
		Math.hypot(px - FRONT_WHEEL.x, py - FRONT_WHEEL.y) < FRONT_WHEEL.r + 2 ||
		Math.hypot(px - TANDEM_AXLE.x, py - TANDEM_AXLE.y) < TANDEM_AXLE.r + 2 ||
		Math.hypot(px - REAR_WHEEL.x, py - REAR_WHEEL.y) < REAR_WHEEL.r + 2;

	ctx.save();
	ctx.clip(new Path2D(`${SHELL} ${BLADE}`), 'nonzero');

	let seed = 53;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 380; i++) {
		const px = 86 + rnd() * 704;
		const py = 26 + rnd() * 246;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		const size = 1.4 + rnd() * 1.5;
		ctx.globalAlpha = 0.07 + rnd() * 0.07;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 150; i++) {
		const px = 86 + rnd() * 704;
		const py = 26 + rnd() * 246;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		const size = 1.1 + rnd() * 1.2;
		ctx.globalAlpha = 0.14 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();

	// Long brush sweeps along the frame, deck and blade face.
	ctx.save();
	ctx.clip(new Path2D(`${SHELL} ${BLADE}`), 'nonzero');
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(158, 176);
	ctx.bezierCurveTo(240, 173, 340, 170, 414, 167);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(58,39,27,0.16)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(316, 214);
	ctx.bezierCurveTo(360, 211, 430, 208, 478, 206);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.13)';
	ctx.beginPath();
	ctx.moveTo(674, 136);
	ctx.bezierCurveTo(712, 134, 752, 136, 778, 134);
	ctx.stroke();
	ctx.restore();
}

/** Blade face: concave sheen, ribs, cutting edge and its bright lip. */
function bladeSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(BLADE));

	const face = ctx.createLinearGradient(294, 194, 496, 270);
	face.addColorStop(0, 'rgba(255,255,255,0.34)');
	face.addColorStop(0.42, 'rgba(255,255,255,0.02)');
	face.addColorStop(1, 'rgba(58,39,27,0.2)');
	ctx.fillStyle = face;
	ctx.fillRect(288, 190, 214, 84);

	// The concave catchlight down the left of the mouldboard.
	line(ctx, 312, 214, 306, 252, 'rgba(255,255,255,0.42)', 2.4);
	line(ctx, 330, 214, 326, 252, 'rgba(255,255,255,0.2)', 1.6);

	// Steel cutting edge with a polished lip.
	ctx.fillStyle = STEEL;
	ctx.fillRect(288, 256, 214, 18);
	ctx.fillStyle = 'rgba(255,255,255,0.42)';
	ctx.fillRect(288, 256, 214, 2.4);
	line(ctx, 296, 259, 492, 253, 'rgba(255,255,255,0.62)', 1.8);

	// Scrape marks where the edge has been working.
	ctx.strokeStyle = CREAM;
	ctx.globalAlpha = 0.26;
	ctx.lineWidth = 1.3;
	for (const [sx, sy] of [
		[318, 262],
		[352, 261],
		[392, 260],
		[430, 259]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(sx + 20, sy - 1.4);
		ctx.stroke();
	}
	ctx.globalAlpha = 1;

	// Accidental paint chips along the shoulders.
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[302, 238, 6, 2, 0.34],
		[470, 232, 7, 2, 0.3]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();
}

/**
 * Level-5 lacquer. A broad gloss rolls along the bonnet, over the cab flank and down the
 * rear haunch, the teal deck catches a cooler sky, and the mouldboard takes one more
 * mirror catchlight than the level-2 shade. The glosses are clipped to the painted panels
 * so no highlight crosses an outline or the glazing.
 */
function finishSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Long bonnet: a diagonal polish running back from the nose.
	const bonnet = ctx.createLinearGradient(120, 202, 430, 148);
	bonnet.addColorStop(0, 'rgba(255,255,255,0.22)');
	bonnet.addColorStop(0.5, 'rgba(255,255,255,0.07)');
	bonnet.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = bonnet;
	ctx.fillRect(96, 154, 348, 58);

	// Cab flank: the light rolls over the door and dies under the waistline.
	const cab = ctx.createLinearGradient(540, 52, 646, 128);
	cab.addColorStop(0, 'rgba(255,255,255,0.2)');
	cab.addColorStop(0.6, 'rgba(255,255,255,0.04)');
	cab.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cab;
	ctx.fillRect(520, 44, 142, 166);

	// Rear haunch above the tandem.
	const haunch = ctx.createLinearGradient(0, 204, 0, 256);
	haunch.addColorStop(0, 'rgba(255,255,255,0.18)');
	haunch.addColorStop(0.55, 'rgba(255,255,255,0.03)');
	haunch.addColorStop(1, 'rgba(58,39,27,0.08)');
	ctx.fillStyle = haunch;
	ctx.fillRect(566, 204, 128, 52);

	// Teal engine deck picks up a cool sky reflection across its louvres.
	const deck = ctx.createLinearGradient(0, 128, 0, 192);
	deck.addColorStop(0, 'rgba(207,239,255,0.2)');
	deck.addColorStop(0.55, 'rgba(207,239,255,0.02)');
	deck.addColorStop(1, 'rgba(4,16,22,0.14)');
	ctx.fillStyle = deck;
	ctx.fillRect(658, 126, 128, 80);

	// Polished frame and deck edges.
	line(ctx, 156, 171, 418, 165, 'rgba(255,255,255,0.18)', 2);
	line(ctx, 92, 165, 148, 165.5, 'rgba(255,255,255,0.22)', 1.8);
	line(ctx, 664, 130, 768, 130, 'rgba(207,239,255,0.24)', 1.8);
	ctx.restore();

	// Mouldboard: a mirror catchlight down the left of the face, a polished top rail and
	// a soft gloss over the right shoulder.
	ctx.save();
	ctx.clip(new Path2D(BLADE));
	const face = ctx.createLinearGradient(298, 212, 366, 254);
	face.addColorStop(0, 'rgba(255,255,255,0.3)');
	face.addColorStop(0.55, 'rgba(255,255,255,0.06)');
	face.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = face;
	ctx.fillRect(294, 208, 78, 56);
	line(ctx, 316, 212, 310, 250, 'rgba(255,255,255,0.34)', 1.8);
	line(ctx, 486, 204, 484, 246, 'rgba(255,255,255,0.18)', 1.4);
	line(ctx, 302, 211, 486, 205, 'rgba(255,255,255,0.28)', 1.6);
	ctx.restore();

	// Chrome hardware: stack collar, air-cleaner crown and the articulation pin.
	line(ctx, 664, 86, 680, 86, 'rgba(255,255,255,0.55)', 1.6);
	line(ctx, 710, 103, 728, 103, 'rgba(255,255,255,0.5)', 1.4);
	line(ctx, 450, 168, 450, 200, 'rgba(255,255,255,0.24)', 1.4);
}

/**
 * Fittings painted onto the shell: grille, headlamp, markers, the articulation joint,
 * blade hydraulics, the tandem bogie, deck hardware and the door furniture.
 */
function drawFittings(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	if (!fitted) return;

	// Nose grille, headlamp and marker.
	rect(ctx, 80, 168, 32, 22, TEAL_DARK, 2, 2);
	for (let bar = 0; bar < 4; bar++) {
		line(ctx, 84, 173 + bar * 4.6, 108, 173 + bar * 4.6, CHROME, 1.4);
	}
	circle(ctx, 84, 196, 5.4, LAMP, 2);
	circle(ctx, 78, 180, 3, AMBER, 1.5);

	// Boarding step on the frame and marker lights.
	rect(ctx, 128, 194, 26, 10, CHROME, 2, 1.8);
	line(ctx, 134, 199, 148, 199, 'rgba(58,39,27,0.4)', 1.4);
	rect(ctx, 262, 192, 12, 6, AMBER, 1.4, 1.2);
	rect(ctx, 372, 186, 12, 6, AMBER, 1.4, 1.2);

	// Articulation joint: teal block, chrome pin and bolt ring.
	rect(ctx, 448, 164, 38, 40, TEAL, 3, 2.4);
	circle(ctx, 466, 184, 8, CHROME, 2.2);
	circle(ctx, 466, 184, 3.2, STEEL, 1.4);
	for (let i = 0; i < 4; i++) {
		const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
		circle(ctx, 466 + Math.cos(a) * 12, 184 + Math.sin(a) * 12, 1.5, CHROME, 0.8);
	}

	// Blade hydraulics and the mounting bracket, above the blade's top lip.
	rect(ctx, 336, 192, 46, 8, CHROME, 4, 1.8);
	line(ctx, 346, 196, 372, 196, 'rgba(58,39,27,0.35)', 1.4);
	rect(ctx, 408, 190, 52, 8, CHROME, 4, 1.8);
	line(ctx, 420, 194, 448, 194, 'rgba(58,39,27,0.35)', 1.4);
	rect(ctx, 376, 188, 40, 8, STEEL, 2, 1.6);
	circle(ctx, 384, 192, 1.8, CHROME, 0.9);
	circle(ctx, 408, 192, 1.8, CHROME, 0.9);

	// Tandem bogie beam over both rear tyres.
	rect(ctx, 566, 190, 128, 12, TEAL_DARK, 3, 2.2);
	for (const bx of [586, 600, 660, 674]) circle(ctx, bx, 196, 1.8, CHROME, 0.9);
	panel(ctx, 'M566,190 L694,190 L694,192.4 L566,192.4 Z', 'rgba(255,255,255,0.24)');

	// Front axle beam over the front tyre.
	rect(ctx, 132, 190, 56, 11, TEAL_DARK, 3, 2.2);
	circle(ctx, 160, 196, 2.4, CHROME, 1);

	// Engine deck: louvres, air cleaner and exhaust cap.
	for (let louvre = 0; louvre < 4; louvre++) {
		line(ctx, 668, 142 + louvre * 8, 744, 140 + louvre * 8, 'rgba(207,239,255,0.26)', 2);
	}
	rect(ctx, 702, 106, 34, 20, YELLOW, 4, 2.2);
	rect(ctx, 708, 102, 22, 6, CHROME, 3, 1.8);
	rect(ctx, 660, 86, 26, 6, STEEL, 2, 1.6);
	rect(ctx, 666, 100, 8, 3, INK, 1, 1.2);

	// Beacon mount and its chrome collar.
	rect(ctx, 556, 32, 14, 3, CHROME, 1, 1);

	// Door hardware and hinges.
	rect(ctx, 640, 110, 12, 5, CHROME, 1.6, 1.4);
	rect(ctx, 578, 110, 4, 12, STEEL, 1, 1.2);
	rect(ctx, 578, 96, 4, 8, STEEL, 1, 1.2);

	// Tail lamps and plate on the counterweight.
	rect(ctx, 770, 152, 10, 16, RED, 2, 1.6);
	rect(ctx, 770, 172, 10, 10, AMBER, 2, 1.4);
	rect(ctx, 744, 158, 22, 10, CREAM, 1, 1.4);
}

export function drawRealMotorGraderLevel(
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
		ctx.ellipse(430, 278, 356, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.09;
		ctx.beginPath();
		ctx.ellipse(420, 275, 276, 6, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell, then the teal livery blocks painted inside it.
	shape(ctx, SHELL, YELLOW);

	ctx.save();
	ctx.clip(new Path2D(SHELL));
	panel(ctx, ENGINE_DECK, TEAL);
	panel(ctx, ENGINE_RAIL, TEAL_DARK);
	panel(ctx, NOSE_BAND, TEAL);
	panel(ctx, FRAME_STRIPE, TEAL);
	panel(ctx, POD_SHADE, TEAL_DARK);
	ctx.restore();

	// Cab shell detail: pillars, roof cap, panel seams.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	panel(ctx, 'M520,126 L536,44 L543,44 L528,126 Z', TEAL);
	panel(ctx, 'M646,44 L658,56 L658,126 L648,126 Z', TEAL);
	panel(ctx, 'M536,44 L646,44 L646,51 L536,51 Z', TEAL);
	panel(ctx, 'M560,60 L572,60 L572,120 L560,120 Z', TEAL);
	panel(ctx, 'M576,104 L646,104 L646,108 L576,108 Z', TEAL_DARK);
	panel(ctx, `M${DOOR.x},${DOOR.y} L${DOOR.x + DOOR.w},${DOOR.y} L${DOOR.x + DOOR.w},${DOOR.y + DOOR.h} L${DOOR.x},${DOOR.y + DOOR.h} Z`, YELLOW_DARK);
	// Sun visor over the windscreen.
	panel(ctx, 'M520,58 L572,56 L572,62 L520,64 Z', TEAL_DARK);
	line(ctx, 640, 56, 640, 122, 'rgba(58,39,27,0.28)', 1.6);
	line(ctx, 528, 120, 644, 120, 'rgba(58,39,27,0.22)', 1.6);
	// Frame panel seams.
	line(ctx, 240, 168, 240, 202, 'rgba(58,39,27,0.16)', 1.6);
	line(ctx, 330, 165, 330, 202, 'rgba(58,39,27,0.16)', 1.6);
	ctx.restore();

	// Joint seam between the front frame and the rear section.
	line(ctx, 448, 160, 448, 204, 'rgba(58,39,27,0.24)', 2);

	if (shaded) {
		// Body paint: roof light falling into a low-body shade.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const paint = ctx.createLinearGradient(0, 40, 0, 272);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.3, 'rgba(255,255,255,0.05)');
		paint.addColorStop(0.78, 'rgba(120,80,10,0.1)');
		paint.addColorStop(1, 'rgba(58,39,27,0.3)');
		ctx.fillStyle = paint;
		ctx.fillRect(84, 26, 706, 246);
		ctx.restore();

		// Teal deck catches the sky along its top edge.
		ctx.save();
		ctx.clip(new Path2D(ENGINE_DECK));
		const deck = ctx.createLinearGradient(0, 126, 0, 192);
		deck.addColorStop(0, 'rgba(255,255,255,0.26)');
		deck.addColorStop(0.5, 'rgba(255,255,255,0.03)');
		deck.addColorStop(1, 'rgba(4,16,22,0.34)');
		ctx.fillStyle = deck;
		ctx.fillRect(656, 124, 134, 70);
		ctx.restore();

		// Fender shade over both rear tyres, and the arch lip catching light.
		line(ctx, 569, 207, 691, 207, 'rgba(255,255,255,0.3)', 2);
		line(ctx, 571, 209.5, 689, 209.5, 'rgba(58,39,27,0.24)', 1.6);

		// Frame top edge highlight.
		line(ctx, 156, 166.5, 416, 160.5, 'rgba(255,255,255,0.36)', 2.2);
	}

	// Re-stroke the shell so the livery blocks cannot eat the outline.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Stack and beacon are their own body subpaths, painted as hardware.
	shape(ctx, STACK, STEEL, 2.4);
	line(ctx, 668, 96, 668, 122, 'rgba(255,255,255,0.34)', 2);
	rect(ctx, 662, 84, 22, 6, CHROME, 2, 1.6);
	shape(ctx, BEACON, AMBER, 2.2);
	line(ctx, 557, 32, 557, 42, 'rgba(255,255,255,0.5)', 1.8);
	rect(ctx, 548, 42, 30, 4, TEAL_DARK, 1.5, 1.2);

	// Fittings that sit on the shell.
	drawFittings(ctx, fitted);

	// Engine deck seams and rivets, always present.
	line(ctx, 660, 128, 660, 204, 'rgba(58,39,27,0.34)', 2);
	circle(ctx, 668, 132, 1.7, CHROME, 0.9);
	circle(ctx, 668, 196, 1.7, CHROME, 0.9);
	rect(ctx, 96, 172, 4, 20, YELLOW_DARK, 1, 1.2);

	if (fitted) {
		// Rivet row along the front frame and the arch.
		for (let rx = 168; rx < 416; rx += 34) {
			circle(ctx, rx, 188, 1.6, 'rgba(255,246,228,0.8)', 0.8);
		}
		for (let rx = 430; rx < 516; rx += 24) {
			circle(ctx, rx, 156, 1.5, 'rgba(255,246,228,0.7)', 0.8);
		}
	}

	// Blade piece, then glass, then the wheels, matching the slot z-order.
	shape(ctx, BLADE, YELLOW);
	ctx.save();
	ctx.clip(new Path2D(BLADE));
	// Teal top rail below the circle stem.
	panel(ctx, 'M290,208 L502,202 L502,224 L290,231 Z', TEAL);
	// Mouldboard ribs: five curved blades of the face, each with a lit edge.
	for (const rx of [316, 352, 388, 424, 460]) {
		ctx.strokeStyle = 'rgba(58,39,27,0.3)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(rx, 226);
		ctx.quadraticCurveTo(rx - 4, 240, rx - 3, 252);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.24)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(rx + 3, 227);
		ctx.quadraticCurveTo(rx - 1, 240, rx, 251);
		ctx.stroke();
	}
	// Bright steel cutting edge along the bottom lip.
	panel(ctx, 'M290,247 L502,241 L502,258 L290,264 Z', STEEL);
	line(ctx, 296, 250.4, 498, 244.4, 'rgba(255,255,255,0.62)', 1.8);
	ctx.restore();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(BLADE));

	if (shaded) {
		bladeSheen(ctx);
	}

	if (fitted) {
		// Blade hardware: end caps, circle boss and cutting-edge bolts.
		rect(ctx, 294, 220, 8, 40, TEAL_DARK, 2, 1.6);
		rect(ctx, 486, 216, 8, 40, TEAL_DARK, 2, 1.6);
		circle(ctx, 390, 204, 12, STEEL, 2.4);
		circle(ctx, 390, 204, 7, TEAL_DARK, 1.6);
		circle(ctx, 390, 204, 2.4, CHROME, 1);
		for (let i = 0; i < 4; i++) {
			const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
			circle(ctx, 390 + Math.cos(a) * 9.4, 204 + Math.sin(a) * 9.4, 1.3, CHROME, 0.7);
		}
		for (const bx of [306, 340, 374, 408, 442, 476]) {
			circle(ctx, bx, 256, 1.6, 'rgba(255,246,228,0.72)', 0.8);
		}
	}

	shape(ctx, GLASS_MASK, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 528, 56, 40, 64);
		glassShade(ctx, SIDE_GLASS, 572, 56, 68, 52);
		// Glare sweeping across the front pane.
		line(ctx, 534, 106, 556, 66, 'rgba(255,255,255,0.5)', 2.4);
	}

	// Wipers sit on the glass, drawn after the pane so they read.
	line(ctx, 533, 113, 539, 85, INK, 2);
	line(ctx, 545, 113, 551, 85, INK, 1.8);

	if (finish) {
		// Lacquer is laid down before the wheels so the tyre tops stay clean rubber, and the
		// body tiles keep the sheen that the cut-out wheel tiles sit over.
		finishSheen(ctx);
	}

	// One wheel piece used twice, plus the baked tandem axle the body carries. The rear
	// slot flips its tile, so its finish is drawn mirrored to match the assembled game.
	for (const axle of [FRONT_WHEEL, TANDEM_AXLE]) {
		wheel(ctx, axle.x, axle.y, axle.r, finish);
	}
	ctx.save();
	if (finish) {
		ctx.translate(REAR_WHEEL.x * 2, 0);
		ctx.scale(-1, 1);
	}
	wheel(ctx, REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r, finish);
	ctx.restore();

	if (lit) {
		// Rim light on the roof, frame, blade lip and hood shoulder.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(542, 45.6);
		ctx.lineTo(640, 45.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(160, 167.8);
		ctx.lineTo(414, 161.8);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(666, 127.8);
		ctx.lineTo(766, 127.8);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.36)';
		ctx.beginPath();
		ctx.moveTo(306, 211.4);
		ctx.lineTo(352, 209.8);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(428, 209.4);
		ctx.lineTo(484, 203.6);
		ctx.stroke();

		// Headlamp glow on the nose, with a warm spill onto the frame.
		const glow = ctx.createRadialGradient(93, 186, 1, 93, 186, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.7)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(93, 186, 30, 0, Math.PI * 2);
		ctx.fill();

		// Beacon spill.
		const beacon = ctx.createRadialGradient(563, 34, 1, 563, 34, 22);
		beacon.addColorStop(0, 'rgba(255,183,3,0.5)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(563, 34, 22, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under all three tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const axle of [FRONT_WHEEL, TANDEM_AXLE, REAR_WHEEL]) {
			ctx.beginPath();
			ctx.ellipse(axle.x, 272, 27, 4.6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Glints on paint, glass and chrome, all clear of the tyre circles.
		glint(ctx, 214, 176, 5);
		glint(ctx, 480, 128, 4.4);
		glint(ctx, 380, 220, 4.2);
		glint(ctx, 706, 140, 4.6);
		glint(ctx, 100, 190, 3.6);
		glint(ctx, 548, 68, 3.4);
		glint(ctx, 620, 84, 3.2);
		glint(ctx, 466, 184, 3.2);
		glint(ctx, 390, 204, 3);

		// Hub hardware on all three wheels; the rear tile mirrors the front one in its slot,
		// so its hardware is mirrored here too and the sheet matches the cut-out game art.
		hubDetail(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r);
		hubDetail(ctx, TANDEM_AXLE.x, TANDEM_AXLE.y, TANDEM_AXLE.r);
		ctx.save();
		ctx.translate(REAR_WHEEL.x * 2, 0);
		ctx.scale(-1, 1);
		hubDetail(ctx, REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r);
		ctx.restore();

		// Worked paint: chips on the blade shoulders and the nose corner.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[304, 246, 7, 2, 0.4],
			[452, 240, 6, 2, 0.34],
			[96, 202, 7, 2.2, 0.42],
			[744, 188, 8, 2, 0.3]
		] as const) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		// Soft exhaust puff above the stack.
		ctx.save();
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr, alpha] of [
			[682, 76, 7, 0.16],
			[694, 64, 9, 0.13],
			[708, 50, 11, 0.1],
			[676, 80, 4, 0.2]
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

export function drawRealMotorGrader(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealMotorGraderLevel(ctx, x, y, scale, 5);
}
