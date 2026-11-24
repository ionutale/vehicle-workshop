/**
 * Asphalt paver art, cut into the same five-piece kit as the other works machines.
 * A wheeled paver facing left: a slatted receiving hopper with a chrome push roller at
 * the nose, a canopy over the seat and console, a long engine deck with louvres, fuel
 * tank and stack, and the screed board trailing at the tail with its end plates and step.
 * The hopper and the screed are the cues that name the machine.
 * Level 4 is the production target; level 5 adds the picture-book finish.
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
const YELLOW_DARK = '#D9A62E';
const YELLOW_DEEP = '#B9851C';
const GREY = '#6B6B6B';
const GREY_DARK = '#4B4C52';
const GREY_LIGHT = '#8C8D94';
const CHARCOAL = '#2B2D42';
const AMBER = '#FFB703';
const LAMP = '#FFF3B0';
const RED = '#E0455A';
const CREAM = '#FFF6E0';
const ASPHALT = '#3B3C42';

/** Art box 700 x 310, road at 246. The hopper is at the front (left). */
const WHEEL_L = { x: 170, y: 216, r: 30 };
const WHEEL_R = { x: 520, y: 216, r: 30 };

/** Receiving hopper: near wall, raked front, rim rising to the back wall. */
const HOPPER = 'M24,204 L24,148 Q24,140 32,138 L136,124 L136,204 Z';
/** The open hopper: the dark asphalt between the far rim and the near rim. */
const HOPPER_LOAD = 'M24,166 L32,156 L136,140 L136,124 L32,138 Q24,140 24,148 Z';

/** Tractor deck: console, floor and the engine housing behind the operator. */
const BODY =
	'M136,204 L136,152 Q136,144 144,142 L196,138 L196,196 L300,196 L300,120 L588,120 Q600,120 600,132 L600,204 Z';

/** Chassis rail under the deck, drawn on into the drawbar that tows the screed. */
const CHASSIS = 'M204,204 L560,204 L560,206 L614,206 L614,214 L204,214 Z';

const ROOF = 'M144,76 L144,66 Q144,60 152,60 L382,60 Q390,60 390,68 L390,76 Z';
const POST_F = 'M186,76 L186,138 L198,138 L198,76 Z';
const POST_R = 'M362,76 L362,120 L374,120 L374,76 Z';
/** Rear screen frame: the leading post of the windbreak above the engine hood. */
const FRAME_R = 'M310,76 L310,120 L316,120 L316,76 Z';

const BEACON = 'M252,60 L252,54 Q252,44 260,44 Q268,44 268,54 L268,60 Z';
const LAMP_F = 'M132,66 L144,66 L144,76 L132,76 Z';
const LAMP_R = 'M390,66 L404,66 L404,76 L390,76 Z';
const MIRROR = 'M120,82 L136,82 L136,76 L144,76 L144,86 L136,86 L136,98 L120,98 Z';

const STACK = 'M560,120 L560,90 L574,90 L574,120 Z';
const STACK_CAP = 'M556,86 L578,86 L578,90 L556,90 Z';
const PUFF = 'M552,84 Q546,72 558,66 Q568,60 576,68 Q582,76 574,84 Z';
/** Engine-deck grab rail behind the canopy. */
const RAIL = 'M430,120 L430,104 L436,104 L436,112 L514,112 L514,104 L520,104 L520,120 Z';

const SEAT = 'M212,196 L212,182 Q212,174 222,174 L282,170 L282,130 Q282,124 288,124 L294,124 L294,196 Z';

/** Body mask: shell plus the fittings that sit outside it. No wheel circle is ever cut in. */
const BODY_MASK = [
	HOPPER,
	BODY,
	CHASSIS,
	ROOF,
	POST_F,
	POST_R,
	FRAME_R,
	BEACON,
	LAMP_F,
	LAMP_R,
	MIRROR,
	STACK,
	STACK_CAP,
	PUFF,
	RAIL,
	SEAT
].join(' ');

/** Glazing: the raked windscreen and the windbreak pane on the engine hood. */
const WINDSCREEN = 'M140,143 L152,78 L186,78 L186,139 Z';
const REAR_PANE = 'M316,76 L360,76 L360,120 L316,120 Z';
const GLASS_MASK = `${WINDSCREEN} ${REAR_PANE}`;

/** Screed: the trailing board, its step and the two end plates. */
const SCREED_PLATE_L = 'M574,234 L574,180 L592,180 L592,234 Z';
const SCREED_PLATE_R = 'M666,230 L666,184 L682,184 L682,230 Z';
const SCREED_BOARD = 'M592,198 L666,198 L666,232 L592,232 Z';
const SCREED_STEP = 'M592,190 L666,190 L666,198 L592,198 Z';

/** Near rim of the hopper, a chrome wear strip over the slatted wall. */
const HOPPER_RIM = 'M24,166 L32,156 L136,140 L136,145 L32,161 L24,171 Z';

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

/** The recessed wheel well: a dark arch the tyre sits inside. */
function wheelWell(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	shaded: boolean
): void {
	const r = 36;
	ctx.save();
	ctx.beginPath();
	ctx.arc(cx, cy, r, Math.PI, Math.PI * 2);
	ctx.lineTo(cx + r, 210);
	ctx.lineTo(cx - r, 210);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, cy - r, 0, 210);
		well.addColorStop(0, '#14151D');
		well.addColorStop(1, GREY_DARK);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = CHARCOAL;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();
	ctx.restore();
}

/** Deterministic picture-book paint grain, clipped to the painted panels only. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${HOPPER_LOAD} ${GLASS_MASK} ${CHASSIS} ${SEAT} ${circleMask(
		WHEEL_L.x,
		WHEEL_L.y,
		WHEEL_L.r
	)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;

	ctx.save();
	ctx.clip(new Path2D(BODY_MASK), 'evenodd');
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');

	let seed = 53;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 420; i++) {
		const px = 40 + rnd() * 566;
		const py = 50 + rnd() * 158;
		const size = 1.5 + rnd() * 1.4;
		ctx.globalAlpha = 0.07 + rnd() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 170; i++) {
		const px = 40 + rnd() * 566;
		const py = 50 + rnd() * 158;
		const size = 1.3 + rnd() * 1.1;
		ctx.globalAlpha = 0.13 + rnd() * 0.08;
		ctx.fillRect(px, py, size, size);
	}
	// Warm primer flecks keep the yellow from reading as flat plastic.
	ctx.fillStyle = YELLOW_DEEP;
	for (let i = 0; i < 120; i++) {
		const px = 40 + rnd() * 566;
		const py = 50 + rnd() * 158;
		const size = 1.2 + rnd() * 1.3;
		ctx.globalAlpha = 0.08 + rnd() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();

	// Two long brush sweeps across the engine flank and the hopper wall.
	ctx.save();
	ctx.clip(new Path2D(BODY_MASK), 'evenodd');
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');
	ctx.strokeStyle = 'rgba(255,255,255,0.15)';
	ctx.lineWidth = 2;
	for (const [x1, y1, x2, y2] of [
		[320, 132, 592, 131],
		[318, 176, 594, 175],
		[240, 188, 296, 187],
		[48, 178, 130, 152]
	]) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.quadraticCurveTo((x1 + x2) / 2, y1 - 2, x2, y2);
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
	ctx.arc(x, y, 1.8, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: a bright rim ring, six bolts and a pale centre cap. The pattern is
 * mirror-symmetric, so the flipped rear wheel, which is the same tile, matches.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.48, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.29, y + Math.sin(a) * r * 0.29, 2.2, CHROME, 1.1);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.2);
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.64, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();
}

/** Fresh asphalt catches the sky: a soft sheen and a wet edge under the near rim. */
function asphaltSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(HOPPER_LOAD));

	const sky = ctx.createLinearGradient(32, 124, 40, 170);
	sky.addColorStop(0, 'rgba(255,255,255,0.18)');
	sky.addColorStop(0.42, 'rgba(255,255,255,0.04)');
	sky.addColorStop(1, 'rgba(0,0,0,0.32)');
	ctx.fillStyle = sky;
	ctx.fillRect(22, 120, 118, 52);

	// Two highlights lying along the fresh surface.
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(36, 141);
	ctx.lineTo(128, 127);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.12)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(36, 147);
	ctx.lineTo(128, 133);
	ctx.stroke();

	// A wet, darker ribbon right under the near rim.
	ctx.strokeStyle = 'rgba(12,13,17,0.5)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(36, 153);
	ctx.lineTo(128, 139);
	ctx.stroke();
	ctx.restore();
}

/** Brushed-steel sheen along the screed plate and its chrome wear strip. */
function screedSteelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(594, 216, 70, 14);
	ctx.rect(596, 228, 66, 4);
	ctx.clip();

	const steel = ctx.createLinearGradient(0, 216, 0, 232);
	steel.addColorStop(0, 'rgba(255,255,255,0.5)');
	steel.addColorStop(0.35, 'rgba(255,255,255,0.08)');
	steel.addColorStop(0.72, 'rgba(0,0,0,0.2)');
	steel.addColorStop(1, 'rgba(255,255,255,0.34)');
	ctx.fillStyle = steel;
	ctx.fillRect(592, 214, 74, 20);

	// Brushed lines and a hot highlight where the plate meets the fresh mat.
	ctx.strokeStyle = 'rgba(255,255,255,0.42)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(596, 221);
	ctx.lineTo(662, 221);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(0,0,0,0.22)';
	ctx.beginPath();
	ctx.moveTo(596, 224.5);
	ctx.lineTo(662, 224.5);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(598, 229.2);
	ctx.lineTo(660, 229.2);
	ctx.stroke();
	ctx.restore();
}

/** Speckled asphalt sitting in the open hopper. */
function asphaltGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(HOPPER_LOAD));
	let seed = 71;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	for (let i = 0; i < 190; i++) {
		const px = 26 + rnd() * 108;
		const py = 126 + rnd() * 40;
		ctx.fillStyle = rnd() > 0.5 ? '#5A5B63' : '#26272D';
		ctx.globalAlpha = 0.2 + rnd() * 0.28;
		const size = 1 + rnd() * 1.7;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();
}

export function drawRealAsphaltPaverLevel(
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
		ctx.ellipse(356, 252, 330, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// ---- Receiving hopper, the front cue -------------------------------------------------
	shape(ctx, HOPPER, YELLOW);
	shape(ctx, HOPPER_LOAD, ASPHALT, 2.4);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(HOPPER_LOAD));
		const depth = ctx.createLinearGradient(0, 122, 0, 168);
		depth.addColorStop(0, '#6E7078');
		depth.addColorStop(0.45, '#35363D');
		depth.addColorStop(1, '#1B1C22');
		ctx.fillStyle = depth;
		ctx.fillRect(22, 120, 116, 50);
		ctx.restore();
	}

	// Far rim, near wear strip and the slatted wall behind them.
	line(ctx, 33, 138.2, 134, 124.4, CHROME, 2.2);
	shape(ctx, HOPPER_RIM, CHROME, 1.4);

	for (let i = 0; i < 4; i++) {
		const bx = 52 + i * 22;
		const rimY = 156 + ((140 - 156) * (bx - 32)) / 104;
		line(ctx, bx, rimY + 4, bx, 200, GREY_DARK, 3);
		line(ctx, bx - 1, rimY + 4, bx - 1, 197, 'rgba(255,255,255,0.3)', 1.2);
	}
	line(ctx, 112, 146, 68, 202, YELLOW_DARK, 2.4);
	line(ctx, 108, 148, 64, 202, 'rgba(255,255,255,0.24)', 1.4);

	// Chrome push roller at the nose and the work lamp on the hopper wall.
	circle(ctx, 34, 192, 8, CHROME, 2.4);
	circle(ctx, 34, 192, 5.2, GREY_LIGHT, 1.2);
	line(ctx, 27, 192, 41, 192, 'rgba(255,255,255,0.68)', 1.5);
	rect(ctx, 44, 178, 16, 11, CHROME, 3, 1.8);
	rect(ctx, 46, 180, 12, 7, LAMP, 1, 1.2);

	// ---- Tractor deck, canopy and engine --------------------------------------------------
	shape(ctx, BODY, YELLOW);
	shape(ctx, CHASSIS, CHARCOAL, 2.5);
	line(ctx, 208, 206, 596, 206, 'rgba(255,255,255,0.18)', 1.6);
	circle(ctx, 568, 210, 3.4, CHROME, 1.4);

	// Access step and rear step plate sit inside the chassis mask.
	rect(ctx, 206, 204, 34, 8, CHROME, 2, 1.6);
	line(ctx, 212, 208, 234, 208, 'rgba(58,39,27,0.35)', 1.2);
	rect(ctx, 550, 204, 18, 8, GREY_LIGHT, 2, 1.6);
	for (const mx of [286, 452]) {
		rect(ctx, mx, 206, 12, 5, AMBER, 1, 1.2);
	}

	// Engine flank: louvre panel, fuel tank and the livery badge.
	rect(ctx, 384, 138, 102, 38, GREY, 4, 2.4);
	line(ctx, 388, 144, 480, 144, 'rgba(255,255,255,0.28)', 1.8);
	rect(ctx, 496, 150, 60, 38, GREY_DARK, 5, 2.4);
	rect(ctx, 504, 158, 20, 6, CHROME, 2, 1.5);
	line(ctx, 502, 180, 548, 180, 'rgba(255,255,255,0.2)', 1.4);
	rect(ctx, 336, 146, 28, 34, GREY_DARK, 3, 2.2);
	rect(ctx, 340, 152, 20, 5, YELLOW, 0, 0);
	rect(ctx, 340, 162, 20, 5, YELLOW, 0, 0);

	// Operator console in front of the seat.
	rect(ctx, 146, 148, 42, 30, GREY_DARK, 4, 2.2);
	circle(ctx, 157, 158, 4.6, CREAM, 1.4);
	circle(ctx, 157, 158, 2.2, INK, 0.8);
	circle(ctx, 174, 158, 4.6, CREAM, 1.4);
	circle(ctx, 174, 158, 2.2, INK, 0.8);
	circle(ctx, 181, 170, 2.6, RED, 1.2);

	// Seat under the canopy.
	shape(ctx, SEAT, CHARCOAL, 2.4);
	line(ctx, 216, 178, 282, 174, 'rgba(255,255,255,0.18)', 2);
	line(ctx, 282, 138, 282, 186, 'rgba(255,255,255,0.16)', 2);
	rect(ctx, 214, 190, 80, 6, YELLOW_DARK, 1.5, 1.6);
	rect(ctx, 288, 128, 5, 58, 'rgba(255,255,255,0.1)', 1, 0);

	// Canopy roof and its posts.
	shape(ctx, ROOF, YELLOW);
	shape(ctx, POST_F, YELLOW, 2.2);
	shape(ctx, POST_R, YELLOW, 2.2);
	shape(ctx, FRAME_R, YELLOW, 2.2);
	rect(ctx, 152, 72, 230, 4, YELLOW_DARK, 0, 0);
	line(ctx, 160, 64, 376, 64, 'rgba(255,255,255,0.34)', 2);

	// Roof gear: beacon, work lamps, mirror and the engine grab rail.
	shape(ctx, BEACON, AMBER, 2.2);
	rect(ctx, 251, 56, 18, 4, CHARCOAL, 1, 1.6);
	shape(ctx, LAMP_F, CHARCOAL, 1.6);
	rect(ctx, 134, 68, 9, 6, LAMP, 1, 1.2);
	shape(ctx, LAMP_R, CHARCOAL, 1.6);
	rect(ctx, 392, 68, 10, 6, LAMP, 1, 1.2);
	shape(ctx, MIRROR, CHROME, 1.8);
	rect(ctx, 122, 84, 12, 12, GLASS, 1.4, 1.2);
	shape(ctx, RAIL, STEEL, 2.2);
	line(ctx, 436, 106, 514, 106, 'rgba(255,255,255,0.45)', 1.6);

	// Exhaust stack and rain cap on the rear deck.
	shape(ctx, STACK, STEEL, 2.4);
	rect(ctx, 563, 96, 8, 18, GREY_LIGHT, 1.5, 1.2);
	shape(ctx, STACK_CAP, GREY_DARK, 1.8);

	if (shaded) {
		// Cab paint: light on the canopy, shade down the flank.
		ctx.save();
		ctx.clip(new Path2D(BODY));
		const paint = ctx.createLinearGradient(0, 120, 0, 204);
		paint.addColorStop(0, 'rgba(255,255,255,0.28)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(25,18,10,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(134, 118, 470, 88);
		ctx.restore();

		ctx.save();
		ctx.clip(new Path2D(HOPPER));
		const wall = ctx.createLinearGradient(0, 122, 0, 204);
		wall.addColorStop(0, 'rgba(255,255,255,0.24)');
		wall.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		wall.addColorStop(1, 'rgba(25,18,10,0.22)');
		ctx.fillStyle = wall;
		ctx.fillRect(22, 120, 116, 86);
		ctx.restore();

		ctx.save();
		ctx.clip(new Path2D(ROOF));
		const roof = ctx.createLinearGradient(0, 60, 0, 76);
		roof.addColorStop(0, 'rgba(255,255,255,0.4)');
		roof.addColorStop(1, 'rgba(25,18,10,0.16)');
		ctx.fillStyle = roof;
		ctx.fillRect(142, 58, 250, 20);
		ctx.restore();

		// Louvre and tank get a panel sheen.
		ctx.save();
		ctx.beginPath();
		ctx.rect(384, 138, 102, 38);
		ctx.clip();
		const panel = ctx.createLinearGradient(0, 138, 0, 176);
		panel.addColorStop(0, 'rgba(255,255,255,0.2)');
		panel.addColorStop(1, 'rgba(0,0,0,0.18)');
		ctx.fillStyle = panel;
		ctx.fillRect(384, 138, 102, 38);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(496, 150, 60, 38);
		ctx.clip();
		const tank = ctx.createLinearGradient(0, 150, 0, 188);
		tank.addColorStop(0, 'rgba(255,255,255,0.2)');
		tank.addColorStop(1, 'rgba(0,0,0,0.24)');
		ctx.fillStyle = tank;
		ctx.fillRect(496, 150, 60, 38);
		ctx.restore();
	}

	// Screed lift ram on the rear flank, tying the trailing board to the deck.
	line(ctx, 574, 150, 592, 188, INK, 11);
	line(ctx, 574, 150, 592, 188, CHROME, 8);
	line(ctx, 576, 152, 589, 182, 'rgba(255,255,255,0.7)', 1.8);
	rect(ctx, 566, 143, 17, 9, GREY_DARK, 2, 1.6);
	line(ctx, 570, 147, 579, 147, 'rgba(255,255,255,0.3)', 1.2);

	// ---- Fitted hardware ----------------------------------------------------------------
	if (fitted) {
		for (let vent = 0; vent < 4; vent++) {
			line(ctx, 390, 148 + vent * 6, 480, 148 + vent * 6, 'rgba(43,45,66,0.55)', 2.2);
			line(ctx, 390, 149.4 + vent * 6, 480, 149.4 + vent * 6, 'rgba(255,255,255,0.18)', 1);
		}
		circle(ctx, 548, 156, 4.6, CHROME, 1.8);
		line(ctx, 502, 178, 548, 178, 'rgba(255,255,255,0.2)', 1.2);

		// Hopper hardware: rim clamps and a hazard tab on the front face.
		for (const hx of [44, 76, 108]) {
			rect(ctx, hx, 156 + ((140 - 156) * (hx - 32)) / 104, 10, 5, GREY_LIGHT, 1.5, 1.4);
		}
		rect(ctx, 26, 174, 8, 14, AMBER, 1.5, 1.4);
		line(ctx, 28, 178, 32, 182, INK, 1.6);
		line(ctx, 28, 184, 32, 180, INK, 1.6);

		// Console switches and the seat rail.
		rect(ctx, 150, 172, 10, 4, CHROME, 1, 1.2);
		rect(ctx, 164, 172, 10, 4, CHROME, 1, 1.2);
		line(ctx, 216, 194, 290, 194, 'rgba(0,0,0,0.3)', 1.4);

		// Canopy: beacon base bolts.
		circle(ctx, 254, 58, 1.5, GREY_LIGHT, 0.8);
		circle(ctx, 266, 58, 1.5, GREY_LIGHT, 0.8);

		// Windshield wiper.
		line(ctx, 148, 140, 170, 112, INK, 2.4);
		line(ctx, 149, 138, 171, 111, CHROME, 1);
	}

	// ---- Glass --------------------------------------------------------------------------
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, REAR_PANE, GLASS, 2.5);

	// Rear screen header and bead, both inside the one glass tile.
	rect(ctx, 316, 76, 44, 5, CHROME, 1, 1.2);
	line(ctx, 319, 116, 357, 116, 'rgba(58,39,27,0.24)', 1.4);

	if (shaded) {
		glassShade(ctx, WINDSCREEN, 140, 78, 46, 65);
		glassShade(ctx, REAR_PANE, 316, 80, 44, 40);
	}

	// ---- Screed: the trailing board and its end plates -----------------------------------
	shape(ctx, SCREED_PLATE_R, YELLOW_DARK, 2.4);
	shape(ctx, SCREED_BOARD, YELLOW, 2.6);
	shape(ctx, SCREED_STEP, YELLOW_DARK, 2.2);
	shape(ctx, SCREED_PLATE_L, YELLOW, 2.8);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(`${SCREED_BOARD} ${SCREED_STEP} ${SCREED_PLATE_L}`), 'nonzero');
		const screed = ctx.createLinearGradient(0, 180, 0, 234);
		screed.addColorStop(0, 'rgba(255,255,255,0.26)');
		screed.addColorStop(0.5, 'rgba(255,255,255,0.03)');
		screed.addColorStop(1, 'rgba(0,0,0,0.26)');
		ctx.fillStyle = screed;
		ctx.fillRect(572, 178, 112, 58);
		ctx.restore();
	}

	// Steel screed plate along the bottom of the yellow frame.
	rect(ctx, 594, 216, 70, 14, GREY, 0, 2);
	rect(ctx, 596, 228, 66, 4, CHROME, 0, 1.6);
	line(ctx, 594, 215, 664, 215, 'rgba(58,39,27,0.4)', 1.6);

	// Step treads and the end-plate hardware.
	for (const sx of [602, 620, 638, 656]) {
		line(ctx, sx, 191.5, sx, 196.5, 'rgba(58,39,27,0.4)', 2);
	}
	line(ctx, 594, 197, 666, 197, 'rgba(255,255,255,0.35)', 1.4);
	line(ctx, 578, 184, 578, 231, 'rgba(255,255,255,0.42)', 2);
	for (const by of [190, 204, 218, 230]) {
		circle(ctx, 586, by, 2, GREY_DARK, 1);
	}
	circle(ctx, 584, 182, 3.4, CHROME, 1.4);
	circle(ctx, 674, 196, 1.8, GREY, 0.9);
	circle(ctx, 674, 214, 1.8, GREY, 0.9);

	if (fitted) {
		rect(ctx, 576, 220, 9, 8, RED, 1.5, 1.4);
		rect(ctx, 576, 208, 9, 5, AMBER, 1.5, 1.2);
		line(ctx, 594, 204, 664, 204, 'rgba(58,39,27,0.28)', 1.4);
		circle(ctx, 600, 210, 3.4, CHROME, 1.4);
	}

	// ---- Wheel arches, then the one wheel piece used twice -------------------------------
	ctx.save();
	ctx.clip(new Path2D(BODY_MASK), 'evenodd');
	wheelWell(ctx, WHEEL_L.x, WHEEL_L.y, shaded);
	wheelWell(ctx, WHEEL_R.x, WHEEL_R.y, shaded);

	ctx.strokeStyle = YELLOW_DEEP;
	ctx.lineWidth = 5;
	for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
		ctx.beginPath();
		ctx.arc(wx, WHEEL_L.y, 39, Math.PI * 1.03, Math.PI * 1.97);
		ctx.stroke();
	}
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.7;
	for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
		ctx.beginPath();
		ctx.arc(wx, WHEEL_L.y, 41, Math.PI * 1.03, Math.PI * 1.97);
		ctx.stroke();
	}
	ctx.restore();

	// Both wheels share the one wheel part; the rear tile is the front mirrored.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (finish) {
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// ---- In the world -------------------------------------------------------------------
	if (lit) {
		// Rim light on the canopy, the hopper rim and the engine deck.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(152, 61.4);
		ctx.lineTo(380, 61.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(302, 121.4);
		ctx.lineTo(586, 121.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(26, 141);
		ctx.lineTo(134, 127);
		ctx.stroke();

		// Headlight glow on the hopper's nose.
		const glow = ctx.createRadialGradient(52, 184, 1, 52, 184, 26);
		glow.addColorStop(0, 'rgba(255,243,176,0.7)');
		glow.addColorStop(1, 'rgba(255,243,176,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(52, 184, 26, 0, Math.PI * 2);
		ctx.fill();

		// Amber beacon wash over the canopy.
		const beaconGlow = ctx.createRadialGradient(260, 52, 1, 260, 52, 20);
		beaconGlow.addColorStop(0, 'rgba(255,183,3,0.5)');
		beaconGlow.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beaconGlow;
		ctx.beginPath();
		ctx.arc(260, 52, 20, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 246, 26, 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	// ---- Picture-book finish ------------------------------------------------------------
	if (finish) {
		paintGrain(ctx);
		asphaltSheen(ctx);
		asphaltGrain(ctx);
		screedSteelSheen(ctx);

		// Paint and chrome glints, clear of the glass and the wheel circles.
		glint(ctx, 246, 64, 4.2);
		glint(ctx, 340, 156, 4.6);
		glint(ctx, 470, 160, 3.8);
		glint(ctx, 104, 178, 4.2);
		glint(ctx, 566, 178, 3.6);
		glint(ctx, 160, 166, 3.4);
		glint(ctx, 640, 194, 3.4);

		// Windscreen sheen.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(150, 134);
		ctx.lineTo(168, 92);
		ctx.stroke();
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(177, 128);
		ctx.lineTo(183, 100);
		ctx.stroke();
		ctx.restore();

		// Hopper wear: chipped paint and a polished rim.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[30, 200, 6, 2, 0.5],
			[64, 196, 8, 2, 0.42],
			[206, 206, 7, 2, 0.35],
			[300, 210, 9, 2, 0.35],
			[579, 226, 5, 2, 0.4],
			[620, 224, 6, 2, 0.4]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		// Exhaust puff drifting off the stack.
		ctx.save();
		ctx.clip(new Path2D(PUFF));
		ctx.fillStyle = 'rgba(92,100,114,0.3)';
		ctx.beginPath();
		ctx.arc(562, 76, 12, 0, Math.PI * 2);
		ctx.arc(570, 70, 8, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = 'rgba(232,236,242,0.4)';
		ctx.beginPath();
		ctx.arc(558, 72, 3.4, 0, Math.PI * 2);
		ctx.arc(566, 78, 2.6, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Beacon lens: a hot core inside the amber shell.
		ctx.save();
		ctx.clip(new Path2D(BEACON));
		const lens = ctx.createRadialGradient(257, 50, 1, 260, 54, 13);
		lens.addColorStop(0, 'rgba(255,255,255,0.8)');
		lens.addColorStop(0.42, 'rgba(255,220,120,0.34)');
		lens.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = lens;
		ctx.fillRect(250, 42, 20, 20);
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealAsphaltPaver(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealAsphaltPaverLevel(ctx, x, y, scale, 5);
}
