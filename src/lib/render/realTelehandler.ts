/**
 * Telehandler art, cut into the same five-piece kit as the other realistic vehicles.
 * A compact works machine facing left: the cab sits at the front-left over the front
 * axle, the engine cowl and counterweight fill the rear-right, and a telescopic boom
 * pivots high on a tower at the very back. The boom runs FORWARD over the cab roof,
 * descending to a pallet-fork carriage ahead of the nose; the pallet rides on the tines
 * and the stabiliser legs are planted under both axles.
 *
 * The boom is a single continuous cut-out from the rear pivot, past the cab roof, down
 * the carriage mast and out along the forks, so it always reads as pointing at the load.
 * The cab sits below the boom with a clear gap; the body mask carries the boom, mast and
 * forks as one joined outline with no overlapping subpaths.
 *
 * Level 4 is the production target: shaded, fully fitted and lit with a cast shadow,
 * contact patches, rim light and the work-lamp and beacon glow. The level-5 finish
 * (paint grain, sheen, glints, hub hardware, exhaust puff) stays behind `finish`.
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
	shape,
	wheel
} from './realKit';

const ORANGE = '#F4A261';
const TEAL = '#264653';
const TEAL_DARK = '#1A333D';
const TEAL_LIGHT = '#35606E';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';
const WOOD = '#C08552';

/** Art box 760 x 310, road at 272. Front (forks) faces left. */
const WHEEL_L = { x: 150, y: 236, r: 40 };
const WHEEL_R = { x: 560, y: 236, r: 40 };

/** Cab over the front axle, under the forward-running boom. */
const CAB =
	'M150,252 L150,186 Q150,172 162,164 L182,152 Q190,146 200,146 L286,146 Q300,146 300,160 L300,252 Z';

/** Flat deck between cab and engine, carrying the lift ram. */
const DECK = 'M300,252 L300,206 L460,206 L460,252 Z';

/** Engine cowl behind the deck. */
const ENGINE = 'M460,252 L460,160 L620,160 L620,252 Z';

/** Rear counterweight with a rounded tail. */
const COUNTERWEIGHT = 'M620,252 L620,178 Q620,170 628,170 L692,170 Q700,170 700,178 L700,252 Z';

/**
 * Boom outline: a 28 px band from the high rear pivot (612, 86..114) running forward,
 * descending to the tip (80, 124..152), then down the carriage mast (to 232) and out
 * along the fork tines (24..104 at 232..248).
 * Top y = 124 - (x - 80) * 38/532, underside y = 152 - (x - 80) * 38/532.
 */
const BOOM =
	'M612,86 L80,124 L80,232 L24,232 L24,248 L104,248 L104,150.29 L612,114 Z';

/** Root tower on the cowl, carrying the rear boom pivot. */
const TOWER = 'M570,160 L612,160 L612,114 L570,117 Z';

/** Long lift ram from the deck to the boom underside. */
const RAM = 'M320,206 L336,206 L336,133.71 L320,134.86 Z';

/** Empty pallet resting on the fork tines: the cue that names the machine. */
const PALLET = rectMask(26, 216, 54, 16);

/** Screen and side pane: two disjoint glass areas. */
const WINDSCREEN = 'M160,196 L162,172 Q163,166 169,162 L184,154 L184,196 Z';
const SIDE_GLASS =
	'M200,196 L200,160 Q200,154 208,154 L278,154 Q288,154 288,164 L288,190 Q288,196 280,196 Z';
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Door panel under the side pane; never touches the glass. */
const DOOR = { x: 200, y: 202, w: 88, h: 44 };

/** Amber beacon on the rear counterweight. */
const BEACON = 'M658,170 L658,154 Q658,148 664,148 L676,148 Q682,148 682,154 L682,170 Z';

/** Short exhaust pipe on the counterweight. */
const EXHAUST = 'M630,170 L630,130 L642,130 L642,170 Z';

/** Exhaust puff, drawn only at level 5. */
const PUFF =
	'M642,132 Q647,118 659,113 Q675,107 681,119 Q687,129 680,137 Q668,145 653,141 Q643,138 642,132 Z';

/** Stabiliser legs stand clear of both tyres. */
const LEG_F = 'M190,252 L202,252 L202,260 L226,260 L226,270 L190,270 Z';
const LEG_R = 'M640,252 L652,252 L652,260 L674,260 L674,270 L640,270 Z';

/**
 * One cut-out for cab, deck, engine, counterweight, boom, carriage and the fittings
 * that only touch the shell. Every subpath is disjoint or shares an edge, so evenodd
 * never punches an unintended hole, and no wheel circle is part of the mask. The
 * exhaust puff is a level-5 finish mark, so it is not part of the production cut-out.
 */
const BODY_MASK = [
	CAB,
	DECK,
	ENGINE,
	COUNTERWEIGHT,
	BOOM,
	TOWER,
	PALLET,
	RAM,
	BEACON,
	EXHAUST,
	LEG_F,
	LEG_R
].join(' ');

const boomTop = (x: number): number => 124 - (x - 80) * (38 / 532);
const boomBottom = (x: number): number => 152 - (x - 80) * (38 / 532);

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

/** Four-point sparkle with a warm core. */
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

/** Machined hub ring, bright crescent and five bolts; mirrored on the rear wheel. */
function hubDetail(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.46, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(58,39,27,0.3)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.29, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 2.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.36, Math.PI * 1.05, Math.PI * 1.6);
	ctx.stroke();

	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
		const bx = cx + Math.cos(a) * r * 0.235;
		const by = cy + Math.sin(a) * r * 0.235;
		circle(ctx, bx, by, 2.1, CHROME, 1);
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		ctx.beginPath();
		ctx.arc(bx - 0.5, by - 0.6, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	circle(ctx, cx, cy, r * 0.1, CREAM, 0.9);
}

/** Deterministic picture-book grain over the painted panels, never glass, forks or tyres. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${rectMask(24, 232, 80, 16)} ${rectMask(80, 150, 24, 82)} ${rectMask(26, 216, 54, 16)} ${rectMask(570, 124, 42, 36)} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;

	ctx.save();
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');

	let seed = 47;
	const rand = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 340; i++) {
		const px = 22 + rand() * 674;
		const py = 88 + rand() * 178;
		const size = 1.4 + rand() * 1.5;
		ctx.globalAlpha = 0.07 + rand() * 0.08;
		ctx.fillRect(px, py, size, size * (0.6 + rand() * 0.7));
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 140; i++) {
		const px = 22 + rand() * 674;
		const py = 88 + rand() * 178;
		const size = 1.1 + rand() * 1.2;
		ctx.globalAlpha = 0.14 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();

	ctx.save();
	ctx.clip(new Path2D(`${CAB} ${ENGINE} ${COUNTERWEIGHT}`), 'nonzero');
	ctx.strokeStyle = 'rgba(255,255,255,0.2)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(166, 206);
	ctx.bezierCurveTo(210, 203, 270, 209, 296, 205);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(58,39,27,0.16)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(476, 180);
	ctx.bezierCurveTo(520, 176, 580, 182, 612, 178);
	ctx.stroke();
	ctx.restore();
}

export function drawRealTelehandlerLevel(
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
		ctx.ellipse(360, 278, 320, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.09;
		ctx.beginPath();
		ctx.ellipse(356, 275, 238, 6, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Rear deck and engine cowl.
	shape(ctx, DECK, TEAL);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(DECK));
		const deckPaint = ctx.createLinearGradient(0, 206, 0, 252);
		deckPaint.addColorStop(0, 'rgba(255,255,255,0.22)');
		deckPaint.addColorStop(0.55, 'rgba(255,255,255,0.03)');
		deckPaint.addColorStop(1, 'rgba(10,26,34,0.34)');
		ctx.fillStyle = deckPaint;
		ctx.fillRect(300, 206, 160, 46);
		ctx.restore();
	}
	line(ctx, 302, 208.5, 456, 208.5, 'rgba(255,246,228,0.5)', 1.8);

	shape(ctx, ENGINE, ORANGE);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(ENGINE));
		const cowl = ctx.createLinearGradient(0, 160, 0, 252);
		cowl.addColorStop(0, 'rgba(255,255,255,0.4)');
		cowl.addColorStop(0.34, 'rgba(255,255,255,0.04)');
		cowl.addColorStop(0.82, 'rgba(163,90,38,0.1)');
		cowl.addColorStop(1, 'rgba(10,26,34,0.28)');
		ctx.fillStyle = cowl;
		ctx.fillRect(458, 158, 164, 94);

		ctx.fillStyle = TEAL;
		ctx.fillRect(460, 234, 160, 18);
		ctx.fillStyle = CREAM;
		ctx.fillRect(460, 231.5, 160, 2.5);
		ctx.restore();
	}

	// Rear counterweight.
	shape(ctx, COUNTERWEIGHT, ORANGE);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(COUNTERWEIGHT));
		const weight = ctx.createLinearGradient(0, 170, 0, 252);
		weight.addColorStop(0, 'rgba(255,255,255,0.34)');
		weight.addColorStop(0.4, 'rgba(255,255,255,0.03)');
		weight.addColorStop(1, 'rgba(10,26,34,0.3)');
		ctx.fillStyle = weight;
		ctx.fillRect(618, 168, 84, 86);
		ctx.restore();
		line(ctx, 624, 172, 696, 172, 'rgba(255,246,228,0.6)', 2);
	}

	// Lift ram from the deck up to the boom underside.
	rect(ctx, 320, 168, 16, 38, TEAL_DARK, 3, 2);
	line(ctx, 328, 136, 328, 172, INK, 7);
	line(ctx, 328, 136, 328, 172, CHROME, 4);
	line(ctx, 326, 140, 326, 168, 'rgba(255,255,255,0.55)', 1.4);
	circle(ctx, 328, 176, 3.4, STEEL, 1.4);

	// Root tower on the cowl.
	shape(ctx, TOWER, TEAL_DARK, 2.6);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(TOWER));
		ctx.fillStyle = 'rgba(255,255,255,0.14)';
		ctx.fillRect(570, 124, 42, 6);
		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		ctx.fillRect(570, 146, 42, 8);
		ctx.restore();
	}
	if (fitted) {
		for (let bolt = 0; bolt < 2; bolt++) {
			circle(ctx, 580 + bolt * 20, 155, 1.8, CHROME, 1);
		}
	}

	// The boom: one continuous arm from the rear pivot to the fork carriage.
	shape(ctx, BOOM, TEAL, 3);
	ctx.save();
	ctx.clip(new Path2D(BOOM));

	if (shaded) {
		const beam = ctx.createLinearGradient(0, 82, 0, 154);
		beam.addColorStop(0, 'rgba(255,255,255,0.34)');
		beam.addColorStop(0.4, 'rgba(255,255,255,0.03)');
		beam.addColorStop(1, 'rgba(8,22,30,0.36)');
		ctx.fillStyle = beam;
		ctx.fillRect(76, 82, 540, 72);
	}

	ctx.strokeStyle = ORANGE;
	ctx.lineWidth = 7;
	ctx.beginPath();
	ctx.moveTo(104, boomTop(104) + 10);
	ctx.lineTo(604, boomTop(604) + 10);
	ctx.stroke();
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(104, boomTop(104) + 5.5);
	ctx.lineTo(604, boomTop(604) + 5.5);
	ctx.stroke();

	// Carriage mast plate and steel fork bar.
	ctx.beginPath();
	ctx.moveTo(80, 152);
	ctx.lineTo(104, 150.29);
	ctx.lineTo(104, 232);
	ctx.lineTo(80, 232);
	ctx.closePath();
	ctx.fillStyle = TEAL_DARK;
	ctx.fill();
	ctx.fillStyle = TEAL_LIGHT;
	ctx.fillRect(84, 155, 4, 75);
	ctx.fillRect(96, 155, 4, 75);
	ctx.fillStyle = STEEL;
	ctx.fillRect(24, 232, 80, 16);
	ctx.fillStyle = 'rgba(255,255,255,0.28)';
	ctx.fillRect(24, 232, 80, 2.4);

	if (fitted) {
		// Telescopic collars along the boom.
		for (const collarX of [160, 280, 420, 540]) {
			line(ctx, collarX, boomTop(collarX), collarX, boomBottom(collarX), TEAL_DARK, 8);
			line(ctx, collarX, boomTop(collarX), collarX, boomBottom(collarX), ORANGE, 2.6);
		}
		for (let rivetX = 130; rivetX < 600; rivetX += 62) {
			circle(ctx, rivetX, boomTop(rivetX) + 4.4, 1.3, CHROME, 0.8);
			circle(ctx, rivetX, boomBottom(rivetX) - 4, 1.3, CHROME, 0.8);
		}

		// Carriage crosshead, bolts and fork heel.
		line(ctx, 82, 158, 102, 158, CHROME, 3);
		circle(ctx, 91, 170, 3, CHROME, 1.3);
		circle(ctx, 91, 190, 2.2, CHROME, 1);
		circle(ctx, 91, 212, 2.2, CHROME, 1);
		line(ctx, 86, 216, 100, 216, 'rgba(255,255,255,0.26)', 1.4);
		line(ctx, 86, 224, 100, 224, 'rgba(0,0,0,0.3)', 1.4);
		line(ctx, 28, 239, 98, 239, 'rgba(255,255,255,0.4)', 1.6);
		line(ctx, 28, 245, 98, 245, 'rgba(0,0,0,0.28)', 1.4);
	}
	ctx.restore();

	// Boom hardware: hydraulic line, root pivot and the carriage outline.
	ctx.save();
	ctx.clip(new Path2D(BOOM));
	line(ctx, 300, boomBottom(300) - 6, 604, boomBottom(604) - 6, 'rgba(26,51,61,0.55)', 2.4);
	line(ctx, 300, boomBottom(300) - 7, 604, boomBottom(604) - 7, 'rgba(255,255,255,0.16)', 1);
	circle(ctx, 596, 100, 5.2, CHROME, 1.8);
	circle(ctx, 596, 100, 2, STEEL, 1.2);
	ctx.restore();

	drawPallet(ctx, shaded, fitted);

	// Cab, sitting under the boom.
	shape(ctx, CAB, ORANGE);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(CAB));
		const cab = ctx.createLinearGradient(0, 146, 0, 252);
		cab.addColorStop(0, 'rgba(255,255,255,0.46)');
		cab.addColorStop(0.3, 'rgba(255,255,255,0.05)');
		cab.addColorStop(0.8, 'rgba(163,90,38,0.08)');
		cab.addColorStop(1, 'rgba(10,26,34,0.26)');
		ctx.fillStyle = cab;
		ctx.fillRect(148, 144, 154, 110);

		ctx.fillStyle = TEAL;
		ctx.fillRect(150, 197, 150, 5);
		ctx.fillStyle = CREAM;
		ctx.fillRect(150, 195.5, 150, 1.4);
		ctx.fillStyle = 'rgba(26,51,61,0.34)';
		ctx.fillRect(150, 244, 150, 8);

		ctx.fillStyle = TEAL;
		ctx.fillRect(150, 146, 150, 5);
		ctx.fillStyle = CREAM;
		ctx.fillRect(150, 151, 150, 1.4);
		ctx.restore();
	}

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 160, 154, 24, 42);
		shadeGlass(ctx, SIDE_GLASS, 200, 154, 88, 42);

		line(ctx, 244, 155, 244, 195, 'rgba(255,255,255,0.35)', 3.4);
		line(ctx, 245, 155, 245, 195, INK, 1.8);
	}

	// Door.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, ORANGE, 2.5, 2.5);
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, 5, TEAL, 0, 0);
	rect(ctx, DOOR.x, DOOR.y + 5, DOOR.w, 2, CREAM, 0, 0);
	line(ctx, DOOR.x + 5, DOOR.y + 9, DOOR.x + 5, DOOR.y + DOOR.h - 6, 'rgba(255,255,255,0.24)', 1.5);
	line(
		ctx,
		DOOR.x + DOOR.w - 5,
		DOOR.y + 9,
		DOOR.x + DOOR.w - 5,
		DOOR.y + DOOR.h - 6,
		'rgba(58,39,27,0.3)',
		1.5
	);

	// Beacon on the rear counterweight.
	shape(ctx, BEACON, AMBER, 2.2);
	rect(ctx, 656, 168, 28, 3.5, TEAL_DARK, 1.5, 1.6);
	if (fitted) {
		line(ctx, 664, 152, 664, 167, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 673, 153, 672, 167, 'rgba(255,255,255,0.5)', 1.2);
	}

	// Exhaust pipe on the counterweight.
	shape(ctx, EXHAUST, STEEL, 2.4);
	if (shaded) line(ctx, 634, 134, 634, 168, 'rgba(255,255,255,0.32)', 1.6);
	if (fitted) {
		rect(ctx, 628, 128, 16, 4, TEAL_DARK, 1.5, 1.6);
		line(ctx, 631, 132, 641, 132, 'rgba(0,0,0,0.35)', 1.5);
	}

	// Stabiliser legs and pads.
	shape(ctx, LEG_F, TEAL, 2.4);
	shape(ctx, LEG_R, TEAL, 2.4);
	if (fitted) {
		for (const [legX, padX] of [
			[196, 208],
			[646, 657]
		]) {
			line(ctx, legX, 253, legX, 259, CHROME, 4);
			line(ctx, padX - 16, 261, padX + 16, 261, ORANGE, 2.2);
			circle(ctx, legX, 256, 1.8, STEEL, 1);
		}
		line(ctx, 192, 263, 224, 263, 'rgba(0,0,0,0.3)', 1.4);
		line(ctx, 642, 263, 672, 263, 'rgba(0,0,0,0.3)', 1.4);
	}

	if (fitted) {
		// Cab fittings: handle, hinges, wiper and step.
		rect(ctx, 276, 218, 8, 5, CHROME, 2, 1.5);
		rect(ctx, 202, 208, 4, 9, STEEL, 1, 1.2);
		rect(ctx, 202, 234, 4, 9, STEEL, 1, 1.2);
		line(ctx, 170, 192, 178, 166, INK, 2.2);
		line(ctx, 150, 186, 150, 240, 'rgba(255,255,255,0.22)', 1.6);
		rect(ctx, 252, 246, 40, 5, TEAL_DARK, 1.5, 1.6);

		// Work lamp on the boom tip.
		rect(ctx, 86, 130, 14, 11, TEAL_DARK, 2, 1.8);
		circle(ctx, 93, 135.5, 3.6, LAMP, 1.8);
		circle(ctx, 92.6, 134.6, 1.7, '#FFF7CF', 1.1);

		// Engine cowl: louvres, badge and plate.
		for (let louvre = 0; louvre < 4; louvre++) {
			line(ctx, 474, 182 + louvre * 9, 542, 182 + louvre * 9, 'rgba(58,39,27,0.3)', 2.2);
		}
		rect(ctx, 550, 174, 44, 26, CREAM, 3, 2.2);
		rect(ctx, 552, 192, 40, 5, TEAL, 0, 0);
		ctx.fillStyle = TEAL_DARK;
		ctx.font = '700 12px ui-rounded, system-ui, sans-serif';
		ctx.fillText('TL', 564, 190);
		rect(ctx, 610, 176, 9, 14, RED, 2, 1.6);
		rect(ctx, 610, 192, 9, 9, AMBER, 1.5, 1.4);

		// Counterweight plates, plate and tail lamp.
		for (let plate = 0; plate < 3; plate++) {
			line(ctx, 624, 208 + plate * 12, 696, 208 + plate * 12, 'rgba(58,39,27,0.28)', 2.2);
		}
		rect(ctx, 632, 190, 22, 10, CREAM, 1, 1.4);
		line(ctx, 635, 194, 649, 194, 'rgba(58,39,27,0.4)', 1);
		rect(ctx, 684, 182, 9, 12, RED, 2, 1.6);
	}

	// Both wheels share the one wheel part; the rear tile is its exact mirror.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: boom top chord, cab front and roof, fork tine, cowl and counterweight.
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(88, boomTop(88) + 1.5);
		ctx.lineTo(606, boomTop(606) + 1.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(151.5, 190);
		ctx.lineTo(151.5, 240);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(210, 148);
		ctx.lineTo(286, 146);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(28, 233.5);
		ctx.lineTo(100, 233.5);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.46)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(462, 162);
		ctx.lineTo(616, 162);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(622, 172);
		ctx.lineTo(696, 172);
		ctx.stroke();

		// Headlight glow at the carriage work lamp and the beacon flash.
		const glow = ctx.createRadialGradient(93, 135.5, 1, 93, 135.5, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.82)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(93, 135.5, 30, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(670, 160, 1, 670, 160, 26);
		beacon.addColorStop(0, 'rgba(255,183,3,0.56)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(670, 160, 26, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches: a dark seat under each tyre, on top of the soft cast shadow.
		ctx.save();
		ctx.globalAlpha = 0.26;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 276, 30, 7, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Boom sheen along the top chord.
		ctx.save();
		ctx.clip(new Path2D(BOOM));
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(110, boomTop(110) + 2.4);
		ctx.lineTo(600, boomTop(600) + 2.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.18)';
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(120, boomTop(120) + 5.5);
		ctx.lineTo(590, boomTop(590) + 5.5);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.14)';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(120, boomBottom(120) - 4);
		ctx.lineTo(590, boomBottom(590) - 4);
		ctx.stroke();
		ctx.restore();

		// Glass sheen.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(166, 192);
		ctx.lineTo(176, 156);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(208, 192);
		ctx.lineTo(236, 156);
		ctx.stroke();
		ctx.restore();

		// Exhaust puff drifting off the pipe.
		ctx.save();
		ctx.clip(new Path2D(PUFF));
		ctx.fillStyle = 'rgba(213,220,229,0.55)';
		ctx.fill(new Path2D(PUFF));
		ctx.fillStyle = 'rgba(255,255,255,0.45)';
		ctx.beginPath();
		ctx.arc(661, 123, 7, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(675, 126, 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = 'rgba(201,210,222,0.35)';
		ctx.beginPath();
		ctx.arc(652, 133, 6, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Glints, clear of the tyres and mask edges.
		glint(ctx, 150, boomTop(150) + 12, 5.2);
		glint(ctx, 430, boomTop(430) + 12, 4.6);
		glint(ctx, 228, 170, 4.4);
		glint(ctx, 268, 222, 4.2);
		glint(ctx, 580, 180, 4);
		glint(ctx, 110, 140, 3.2);
		glint(ctx, 330, 190, 3);

		// Hub hardware on both wheels.
		hubDetail(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		ctx.save();
		ctx.translate(WHEEL_L.x + WHEEL_R.x, 0);
		ctx.scale(-1, 1);
		hubDetail(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		ctx.restore();

		// Working marks: paint chips on the cab, boom and cowl, soot at the pipe.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[158, 240, 8, 2, 0.4],
			[286, 246, 6, 2, 0.34],
			[130, 136, 9, 2, 0.3],
			[440, 118, 7, 2, 0.28],
			[640, 208, 6, 2, 0.36]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		ctx.save();
		ctx.globalAlpha = 0.18;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(633, 132, 6, 3, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Finishing marks: fork tip, mast edge and beacon.
		line(ctx, 27, 233, 98, 233, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 84, 148, 84, 228, 'rgba(255,255,255,0.22)', 1.4);
		line(ctx, 664, 151, 664, 167, 'rgba(255,255,255,0.5)', 1.2);
		line(ctx, 286, 160, 286, 190, 'rgba(255,255,255,0.2)', 1.2);
	}

	ctx.restore();
}

/** Wooden pallet sitting on the fork tines. */
function drawPallet(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	rect(ctx, 26, 216, 54, 4, WOOD, 1, 2);
	rect(ctx, 26, 229, 54, 3, WOOD, 1, 1.8);
	for (const blockX of [26, 47, 72]) {
		rect(ctx, blockX, 220, 8, 9, WOOD, 1, 1.6);
	}
	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(26, 216, 54, 16);
		ctx.clip();
		ctx.fillStyle = 'rgba(255,255,255,0.2)';
		ctx.fillRect(26, 216, 54, 2);
		ctx.fillStyle = 'rgba(80,45,20,0.18)';
		ctx.fillRect(26, 227, 54, 5);
		ctx.restore();
	}
	if (fitted) {
		for (const blockX of [30, 51, 76]) {
			circle(ctx, blockX, 224.5, 1.1, STEEL, 0.7);
		}
		line(ctx, 30, 217.5, 76, 217.5, 'rgba(80,45,20,0.35)', 1);
	}
}

export function drawRealTelehandler(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealTelehandlerLevel(ctx, x, y, scale, 4);
}
