/**
 * Rescue truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A box-body rescue appliance facing left: a cab-over cab with a crew window and a roof
 * light bar, a tall equipment box carrying a white RESCUE sign board and three roller
 * lockers, a rear roller shutter with a red/white chevron band and a fold-down step, tail
 * lamps and a rear roof beacon. Five slots: body (cab, box, lockers, light bar), windows,
 * shutter (bay, chevrons, step, lamps), and one wheel used twice.
 *
 * Level 4 is the production target: shaded, fully fitted and lit. Level 5 adds the
 * picture-book finish: paint grain, panel sheen, glints, hub bolts and a warm exhaust puff.
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

const RED = '#E63946';
const RED_DARK = '#B02330';
const RED_DEEP = '#8E1B26';
const WHITE = '#F1FAEE';
const WHITE_SHADE = '#DCE8E2';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const ICE = '#BFE6FF';
const TAIL = '#FF4D6D';
const UNDER = '#5C6472';

/** Art box 700 x 330, road at 292. Front (cab) faces left. */
const SHELL =
	'M38,270 L38,182 Q38,172 44,166 L74,120 Q78,114 86,114 L212,114 L212,96 Q212,90 218,90 L652,90 Q664,90 664,102 L664,264 Q664,270 658,270 Z';

/** Roof light bar on the flat of the cab roof. */
const LIGHT_BAR = { x: 92, y: 100, w: 108, h: 14 };

/** Rear roof beacon, sitting on the box roof at the tail. */
const BEACON = { x: 620, y: 80, w: 30, h: 10 };

/** Mirror head on its arm, ahead of the cab A-pillar. */
const MIRROR = { x: 16, y: 156, w: 22, h: 44 };

const FRONT_BUMPER = { x: 20, y: 244, w: 18, h: 26 };
const REAR_BUMPER = { x: 664, y: 250, w: 16, h: 18 };

/** Chassis rails with a deeper tank between the axles. Part of the body cut-out. */
const UNDERBODY = 'M96,270 L320,270 L320,286 L420,286 L420,270 L656,270 L656,278 L96,278 Z';

/** Cab door, kept as painted body art. */
const DOOR = { x: 106, y: 120, w: 100, h: 112 };

/** White RESCUE sign board across the upper box flank. */
const SIGN = { x: 220, y: 102, w: 376, h: 48 };

/** Three white roller lockers along the flank, clear of both wheel arches. */
const LOCKERS = [
	{ x: 224, y: 162, w: 88, h: 70 },
	{ x: 318, y: 162, w: 88, h: 70 },
	{ x: 412, y: 162, w: 88, h: 70 }
];

/** Rear roller shutter bay at the tail of the box. */
const SHUTTER = { x: 598, y: 104, w: 62, h: 140 };

/** Fold-down step and tail lamps, cut with the shutter cargo piece. */
const STEP = { x: 634, y: 270, w: 54, h: 10 };

const WHEEL_L = { x: 170, y: 262, r: 30 };
const WHEEL_R = { x: 550, y: 262, r: 30 };

/** Glass: raked windscreen band, front door pane and crew door pane. */
const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const WINDSCREEN = 'M46,170 L76,124 L104,128 L74,174 Z';
const CAB_GLASS = pane(112, 124, 44, 50, 5);
const CREW_GLASS = pane(162, 126, 38, 46, 5);
const GLASS_MASK = `${WINDSCREEN} ${CAB_GLASS} ${CREW_GLASS}`;

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
	glass.addColorStop(0.44, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.28)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Recessed wheel-arch band in darker body red with a white outer lip. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 11, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = RED_DARK;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = WHITE;
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 9.4, Math.PI * 1.06, Math.PI * 1.94);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5.6, Math.PI * 1.12, Math.PI * 1.88);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(58,39,27,0.28)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 2.2, Math.PI * 1.06, Math.PI * 1.94);
	ctx.stroke();
}

/** Red/white diagonal chevrons, clipped to the panel. */
function chevrons(
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

	ctx.fillStyle = WHITE;
	ctx.fillRect(x, y, w, h);

	ctx.fillStyle = RED;
	const step = 13;
	for (let i = -h; i < w + h; i += step) {
		ctx.beginPath();
		ctx.moveTo(x + i, y + h);
		ctx.lineTo(x + i + step / 2, y + h);
		ctx.lineTo(x + i + step / 2 + h, y);
		ctx.lineTo(x + i + h, y);
		ctx.closePath();
		ctx.fill();
	}
	ctx.restore();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, w, h);
}

/** Roof light bar: white housing, red end lenses and a pale centre lens. */
function roofBar(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	const { x, y, w, h } = LIGHT_BAR;

	rect(ctx, x, y, w, h, WHITE, 4, 2.6);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 1.5, y + 1.5, w - 3, h - 3);
		ctx.clip();
		const housing = ctx.createLinearGradient(0, y, 0, y + h);
		housing.addColorStop(0, 'rgba(255,255,255,0.62)');
		housing.addColorStop(0.55, 'rgba(255,255,255,0.04)');
		housing.addColorStop(1, 'rgba(58,39,27,0.16)');
		ctx.fillStyle = housing;
		ctx.fillRect(x + 1.5, y + 1.5, w - 3, h - 3);
		ctx.restore();
	}

	if (fitted) {
		const lenses = [
			{ x: x + 6, w: 34, color: RED },
			{ x: x + 44, w: 20, color: ICE },
			{ x: x + 68, w: 34, color: RED }
		];
		for (const lens of lenses) {
			rect(ctx, lens.x, y + 3, lens.w, h - 8, lens.color, 2, 1.6);
			line(
				ctx,
				lens.x + 2.5,
				y + 4.8,
				lens.x + lens.w - 2.5,
				y + 4.8,
				'rgba(255,255,255,0.7)',
				1.3
			);
			line(
				ctx,
				lens.x + 2.5,
				y + h - 6.4,
				lens.x + lens.w - 2.5,
				y + h - 6.4,
				'rgba(58,39,27,0.32)',
				1.1
			);
		}
		rect(ctx, x + 2, y + 2, 5, h - 4, WHITE_SHADE, 1.5, 1.4);
		rect(ctx, x + w - 7, y + 2, 5, h - 4, WHITE_SHADE, 1.5, 1.4);
		rect(ctx, x + 11, y + h - 6, w - 22, 4, RED_DARK, 1, 1.2);
	} else {
		rect(ctx, x + 5, y + 3, w - 10, h - 8, RED, 2, 1.6);
		rect(ctx, x + w - 11, y + 3, 5, h - 8, WHITE_SHADE, 1.5, 1.2);
	}

	if (lit) {
		ctx.save();
		ctx.globalAlpha = 0.34;
		for (const lens of [
			{ cx: x + 23, color: '255,90,110' },
			{ cx: x + 54, color: '205,240,255' },
			{ cx: x + 85, color: '255,90,110' }
		]) {
			const glow = ctx.createRadialGradient(lens.cx, y + 7, 1, lens.cx, y + 7, 17);
			glow.addColorStop(0, `rgba(${lens.color},0.85)`);
			glow.addColorStop(1, `rgba(${lens.color},0)`);
			ctx.fillStyle = glow;
			ctx.beginPath();
			ctx.arc(lens.cx, y + 7, 17, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		const lenses = [
			{ x: x + 6, w: 34, color: '255,90,110' },
			{ x: x + 44, w: 20, color: '205,240,255' },
			{ x: x + 68, w: 34, color: '255,90,110' }
		];
		for (const lens of lenses) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(lens.x + 1.5, y + 3.5, lens.w - 3, h - 9);
			ctx.clip();
			const gloss = ctx.createLinearGradient(lens.x, y + h - 6, lens.x + lens.w, y + 4);
			gloss.addColorStop(0, 'rgba(255,255,255,0)');
			gloss.addColorStop(0.48, 'rgba(255,255,255,0.16)');
			gloss.addColorStop(0.62, 'rgba(255,255,255,0.5)');
			gloss.addColorStop(0.8, 'rgba(255,255,255,0.06)');
			gloss.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.fillStyle = gloss;
			ctx.fillRect(lens.x, y + 3, lens.w, h - 8);
			ctx.restore();
			glint(ctx, lens.x + lens.w * 0.7, y + 6.2, 1.6);
		}
		line(ctx, x + 12, y + h - 2.4, x + w - 12, y + h - 2.4, 'rgba(255,255,255,0.5)', 1.2);
	}
}

/** The three white equipment lockers: roller slats, latches, hinges and a soft sheen. */
function lockerBank(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	for (const locker of LOCKERS) {
		rect(ctx, locker.x, locker.y, locker.w, locker.h, WHITE, 2.5, 2.4);

		if (shaded) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(locker.x + 1.5, locker.y + 1.5, locker.w - 3, locker.h - 3);
			ctx.clip();
			const leaf = ctx.createLinearGradient(0, locker.y, 0, locker.y + locker.h);
			leaf.addColorStop(0, 'rgba(255,255,255,0.5)');
			leaf.addColorStop(0.52, 'rgba(255,255,255,0.02)');
			leaf.addColorStop(1, 'rgba(58,39,27,0.15)');
			ctx.fillStyle = leaf;
			ctx.fillRect(locker.x + 1.5, locker.y + 1.5, locker.w - 3, locker.h - 3);
			ctx.restore();

			for (let slat = 1; slat <= 3; slat++) {
				const sy = locker.y + 9 + slat * 14;
				line(
					ctx,
					locker.x + 4,
					sy,
					locker.x + locker.w - 4,
					sy,
					'rgba(58,39,27,0.2)',
					1.4
				);
				line(
					ctx,
					locker.x + 4,
					sy + 1.2,
					locker.x + locker.w - 4,
					sy + 1.2,
					'rgba(255,255,255,0.55)',
					1.1
				);
			}
		}

		if (fitted) {
			rect(ctx, locker.x + locker.w - 24, locker.y + locker.h - 20, 15, 5, CHROME, 2, 1.8);
			line(
				ctx,
				locker.x + locker.w - 21,
				locker.y + locker.h - 17.6,
				locker.x + locker.w - 12,
				locker.y + locker.h - 17.6,
				'rgba(58,39,27,0.3)',
				1.1
			);
			circle(ctx, locker.x + locker.w - 31, locker.y + locker.h - 17.5, 1.6, STEEL, 1);
			rect(ctx, locker.x + 4, locker.y + 10, 4, 11, STEEL, 1, 1.2);
			rect(ctx, locker.x + 4, locker.y + locker.h - 23, 4, 11, STEEL, 1, 1.2);
			rect(ctx, locker.x + locker.w - 5, locker.y + 10, 2, 11, 'rgba(58,39,27,0.18)', 0, 0);
		}

		if (finish) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(locker.x + 2, locker.y + 2, locker.w - 4, locker.h - 4);
			ctx.clip();
			const gloss = ctx.createLinearGradient(
				locker.x,
				locker.y + locker.h,
				locker.x + locker.w,
				locker.y
			);
			gloss.addColorStop(0, 'rgba(255,255,255,0)');
			gloss.addColorStop(0.46, 'rgba(255,255,255,0.12)');
			gloss.addColorStop(0.62, 'rgba(255,255,255,0.24)');
			gloss.addColorStop(0.8, 'rgba(255,255,255,0.03)');
			gloss.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.fillStyle = gloss;
			ctx.fillRect(locker.x + 2, locker.y + 2, locker.w - 4, locker.h - 4);
			ctx.restore();
			ctx.fillStyle = 'rgba(255,255,255,0.85)';
			for (const [px, py] of [
				[locker.x + 5.4, locker.y + 10.6],
				[locker.x + 5.4, locker.y + locker.h - 22.4]
			]) {
				ctx.beginPath();
				ctx.arc(px, py, 0.8, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}
}

/**
 * Rear roller shutter cargo piece: the roller housing, pale slat field, red/white chevron
 * band, guide rails and latch, then the fold-down step and the tail lamps below.
 */
function rearShutter(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	const { x, y, w, h } = SHUTTER;

	// Roller housing above the bay.
	rect(ctx, x, y - 4, w, 8, STEEL, 2, 2.2);
	line(ctx, x + 4, y - 1.4, x + w - 4, y - 1.4, 'rgba(255,255,255,0.45)', 1.3);
	line(ctx, x + 4, y + 2.6, x + w - 4, y + 2.6, 'rgba(58,39,27,0.3)', 1.2);

	// Recessed bay, then the slat field.
	rect(ctx, x, y, w, h, '#39414F', 2, 2.4);
	const fieldX = x + 7;
	const fieldW = w - 14;
	const slatBottom = y + h - 46;

	rect(ctx, fieldX, y + 5, fieldW, slatBottom - y - 9, '#BCC7D4', 1.5, 1.6);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(fieldX + 1, y + 6, fieldW - 2, slatBottom - y - 11);
		ctx.clip();
		const field = ctx.createLinearGradient(0, y + 5, 0, slatBottom);
		field.addColorStop(0, 'rgba(255,255,255,0.5)');
		field.addColorStop(0.62, 'rgba(255,255,255,0.02)');
		field.addColorStop(1, 'rgba(58,39,27,0.3)');
		ctx.fillStyle = field;
		ctx.fillRect(fieldX + 1, y + 6, fieldW - 2, slatBottom - y - 11);
		ctx.restore();
	}

	for (let sy = y + 12; sy < slatBottom - 5; sy += 8.5) {
		line(ctx, fieldX + 2, sy, fieldX + fieldW - 2, sy, 'rgba(58,39,27,0.36)', 1.4);
		line(ctx, fieldX + 2, sy + 1.2, fieldX + fieldW - 2, sy + 1.2, 'rgba(255,255,255,0.6)', 1.1);
	}

	// Reflective chevron band across the foot of the shutter.
	chevrons(ctx, fieldX, slatBottom, fieldW, y + h - 8 - slatBottom);
	rect(ctx, fieldX, y + h - 7, fieldW, 5, STEEL, 1.5, 1.8);

	// Guide rails with a bright edge.
	rect(ctx, x, y, 7, h, STEEL, 1.5, 2);
	rect(ctx, x + w - 7, y, 7, h, STEEL, 1.5, 2);
	line(ctx, x + 2, y + 4, x + 2, y + h - 4, 'rgba(255,255,255,0.34)', 1.3);
	line(ctx, x + w - 2, y + 4, x + w - 2, y + h - 4, 'rgba(255,255,255,0.34)', 1.3);

	if (fitted) {
		for (const by of [y + 14, y + h - 16]) {
			circle(ctx, x + 3.5, by, 1.7, CHROME, 1);
			circle(ctx, x + w - 3.5, by, 1.7, CHROME, 1);
		}

		// Pull bar and lock near the foot of the slats.
		rect(ctx, fieldX + 4, y + 64, 9, 22, CHROME, 2.5, 2.2);
		line(ctx, fieldX + 8.5, y + 67, fieldX + 8.5, y + 83, 'rgba(58,39,27,0.32)', 1.6);
		circle(ctx, fieldX + 8.5, y + 58, 3.2, CHROME, 1.5);

		// Rear lamps under the shutter, plus the plate.
		rect(ctx, 622, 246, 20, 14, TAIL, 2, 1.9);
		line(ctx, 625, 249, 639, 249, 'rgba(255,255,255,0.55)', 1.4);
		rect(ctx, 646, 246, 12, 14, AMBER, 2, 1.7);
		line(ctx, 648, 249, 656, 249, 'rgba(255,255,255,0.5)', 1.2);
		rect(ctx, 600, 248, 18, 9, WHITE, 1, 1.4);
		line(ctx, 603, 253, 615, 253, STEEL, 1.6);
	}

	// Fold-down step under the tail: a chrome tread over a steel lower leaf.
	rect(ctx, STEP.x, STEP.y, STEP.w, STEP.h, CHROME, 2, 2.2);
	line(ctx, STEP.x + 4, STEP.y + 3.2, STEP.x + STEP.w - 4, STEP.y + 3.2, 'rgba(255,255,255,0.68)', 1.5);
	line(ctx, STEP.x + 4, STEP.y + 7.4, STEP.x + STEP.w - 4, STEP.y + 7.4, 'rgba(58,39,27,0.3)', 1.3);
	rect(ctx, STEP.x + 5, STEP.y + STEP.h, STEP.w - 10, 4, STEEL, 1.2, 1.8);
	line(
		ctx,
		STEP.x + 8,
		STEP.y + STEP.h + 2.4,
		STEP.x + STEP.w - 8,
		STEP.y + STEP.h + 2.4,
		'rgba(255,255,255,0.42)',
		1.2
	);

	if (finish) shutterSheen(ctx);
}

/** Level-5 sheen on the shutter: slat gloss, lit rails and lamp catches. */
function shutterSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = SHUTTER;
	const fieldX = x + 7;
	const fieldW = w - 14;
	const slatBottom = y + h - 46;

	ctx.save();
	ctx.beginPath();
	ctx.rect(fieldX + 1, y + 6, fieldW - 2, slatBottom - y - 11);
	ctx.clip();
	const gloss = ctx.createLinearGradient(fieldX, slatBottom, fieldX + fieldW, y + 6);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.4, 'rgba(255,255,255,0.1)');
	gloss.addColorStop(0.56, 'rgba(255,255,255,0.24)');
	gloss.addColorStop(0.74, 'rgba(255,255,255,0.03)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(fieldX + 1, y + 6, fieldW - 2, slatBottom - y - 11);
	ctx.restore();

	// Chevron band gloss crosses the red and white bars together.
	ctx.save();
	ctx.beginPath();
	ctx.rect(fieldX, slatBottom, fieldW, y + h - 8 - slatBottom);
	ctx.clip();
	const band = ctx.createLinearGradient(fieldX, y + h, fieldX + fieldW, slatBottom);
	band.addColorStop(0, 'rgba(255,255,255,0)');
	band.addColorStop(0.44, 'rgba(255,255,255,0.32)');
	band.addColorStop(0.6, 'rgba(255,255,255,0.08)');
	band.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = band;
	ctx.fillRect(fieldX, slatBottom, fieldW, y + h - 8 - slatBottom);
	ctx.restore();

	line(ctx, fieldX + 2, slatBottom - 1.4, fieldX + fieldW - 2, slatBottom - 1.4, 'rgba(255,255,255,0.6)', 1.2);
	glint(ctx, fieldX + 9, y + 54, 1.9);
	glint(ctx, 631, 251, 1.6);
	glint(ctx, 654, 251, 1.4);
}

/** A four-point paint glint that survives the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.9;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = WHITE;
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, Math.PI * 2);
	ctx.fill();
}

/** Six-bolt picture-book hub; mirror symmetric so the flipped rear tile matches. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.48, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.29, y + Math.sin(a) * r * 0.29, 2.4, CHROME, 1.2);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(x + Math.cos(a) * r * 0.29 - 0.8, y + Math.sin(a) * r * 0.29 - 0.9, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	circle(ctx, x, y, r * 0.14, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.82)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.6, Math.PI * 1.06, Math.PI * 1.54);
	ctx.stroke();
	circle(ctx, x, y - r * 0.56, 2, CHROME, 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - 0.7, y - r * 0.58, 0.9, 0, Math.PI * 2);
	ctx.fill();
}

/** Deterministic paint grain over solid paint only. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)} ${rectMask(SHUTTER.x, SHUTTER.y - 4, SHUTTER.w, SHUTTER.h + 4)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(38, 90, 664, 270);
	wash.addColorStop(0, 'rgba(255,255,255,0.12)');
	wash.addColorStop(0.48, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.09)');
	ctx.fillStyle = wash;
	ctx.fillRect(36, 88, 632, 186);

	let seed = 71;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 430; i++) {
		const px = 40 + rand() * 620;
		const py = 92 + rand() * 174;
		const size = 1.3 + rand() * 1.1;
		ctx.globalAlpha = 0.08 + rand() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = WHITE;
	for (let i = 0; i < 165; i++) {
		const px = 40 + rand() * 620;
		const py = 92 + rand() * 174;
		const size = 1.1 + rand() * 0.9;
		ctx.globalAlpha = 0.2 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[56, 206, 148, 204],
		[232, 116, 330, 114],
		[430, 216, 500, 214],
		[232, 256, 470, 254],
		[516, 154, 588, 152],
		[100, 160, 180, 158]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}

	ctx.globalAlpha = 0.16;
	ctx.strokeStyle = WHITE;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[64, 222, 104, 221],
		[240, 250, 288, 249],
		[352, 108, 398, 107],
		[470, 148, 508, 147],
		[516, 258, 556, 257],
		[596, 122, 610, 121]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Panel sheen: roof light rolling down the box, cab gloss and a wet flank streak. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	const roofSheen = ctx.createLinearGradient(0, 92, 0, 120);
	roofSheen.addColorStop(0, 'rgba(255,255,255,0.42)');
	roofSheen.addColorStop(0.6, 'rgba(255,255,255,0.08)');
	roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roofSheen;
	ctx.fillRect(218, 92, 434, 28);

	const cabSheen = ctx.createLinearGradient(0, 116, 0, 190);
	cabSheen.addColorStop(0, 'rgba(255,255,255,0.4)');
	cabSheen.addColorStop(0.6, 'rgba(255,255,255,0.08)');
	cabSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cabSheen;
	ctx.fillRect(40, 116, 172, 74);

	const flank = ctx.createLinearGradient(240, 140, 520, 264);
	flank.addColorStop(0, 'rgba(255,255,255,0)');
	flank.addColorStop(0.44, 'rgba(255,255,255,0.24)');
	flank.addColorStop(0.68, 'rgba(255,255,255,0.06)');
	flank.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = flank;
	ctx.fillRect(220, 140, 300, 124);

	const bounce = ctx.createLinearGradient(0, 248, 0, 270);
	bounce.addColorStop(0, 'rgba(255,255,255,0)');
	bounce.addColorStop(1, 'rgba(255,255,255,0.14)');
	ctx.fillStyle = bounce;
	ctx.fillRect(40, 248, 620, 22);

	ctx.strokeStyle = WHITE;
	ctx.lineWidth = 3;
	for (const [sx, sy, ex, ey] of [
		[228, 100, 640, 98],
		[46, 200, 158, 198],
		[520, 254, 604, 252],
		[250, 152, 492, 150]
	]) {
		ctx.globalAlpha = 0.24;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Level-5 livery sheen: sign board gloss, letter relief and the lower coach line. */
function liverySheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(SIGN.x, SIGN.y, SIGN.w, SIGN.h);
	ctx.clip();
	const board = ctx.createLinearGradient(SIGN.x, SIGN.y + SIGN.h, SIGN.x + SIGN.w, SIGN.y);
	board.addColorStop(0, 'rgba(255,255,255,0)');
	board.addColorStop(0.3, 'rgba(255,255,255,0.1)');
	board.addColorStop(0.44, 'rgba(255,255,255,0.26)');
	board.addColorStop(0.58, 'rgba(255,255,255,0.04)');
	board.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = board;
	ctx.fillRect(SIGN.x, SIGN.y, SIGN.w, SIGN.h);

	const soil = ctx.createLinearGradient(0, SIGN.y + SIGN.h - 8, 0, SIGN.y + SIGN.h);
	soil.addColorStop(0, 'rgba(58,39,27,0)');
	soil.addColorStop(1, 'rgba(58,39,27,0.16)');
	ctx.fillStyle = soil;
	ctx.fillRect(SIGN.x, SIGN.y + SIGN.h - 8, SIGN.w, 8);
	ctx.restore();

	line(ctx, SIGN.x + 3, SIGN.y + 1.4, SIGN.x + SIGN.w - 3, SIGN.y + 1.4, 'rgba(255,255,255,0.66)', 1.2);

	// Coach-line gloss.
	line(ctx, 44, 238.2, 656, 238.2, 'rgba(255,255,255,0.72)', 1.4);
	line(ctx, 44, 242.4, 656, 242.4, 'rgba(58,39,27,0.22)', 1.2);

	ctx.save();
	ctx.clip(new Path2D(SHELL));
	const stripe = ctx.createLinearGradient(40, 243, 660, 236);
	stripe.addColorStop(0, 'rgba(255,255,255,0)');
	stripe.addColorStop(0.42, 'rgba(255,255,255,0.22)');
	stripe.addColorStop(0.62, 'rgba(255,255,255,0.04)');
	stripe.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = stripe;
	ctx.fillRect(40, 236, 620, 7);
	ctx.restore();
}

/** Finishing marks: roof rivets, lamp pips, stone chips and a warm exhaust puff. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.7;
	for (let rivetX = 226; rivetX <= 646; rivetX += 28) {
		ctx.beginPath();
		ctx.arc(rivetX, 91.4, 1.3, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[48.4, 229.6, 1.8],
		[96, 106.4, 1.1],
		[196, 106.4, 1.1]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	line(ctx, 22, 246.6, 36, 246.6, 'rgba(255,255,255,0.72)', 1.4);
	line(ctx, 22, 268, 36, 268, 'rgba(58,39,27,0.28)', 1.3);
	line(ctx, 666, 253, 678, 253, 'rgba(255,255,255,0.55)', 1.3);
	line(ctx, 20, 162, 34, 162, 'rgba(255,255,255,0.4)', 1.2);

	ctx.save();
	ctx.globalAlpha = 0.4;
	ctx.fillStyle = WHITE;
	for (const [chipX, chipY, chipR] of [
		[62, 262, 1.2],
		[118, 264, 1.1],
		[300, 264, 1.2],
		[470, 265, 1.2],
		[560, 262, 1.1]
	]) {
		ctx.beginPath();
		ctx.arc(chipX, chipY, chipR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Warm exhaust puff drifting out under the rear step.
	ctx.save();
	ctx.fillStyle = '#9AA3B2';
	for (const [px, py, pr, alpha] of [
		[678, 288, 4.6, 0.2],
		[685, 283, 3.4, 0.15],
		[691, 288, 2.4, 0.12]
	]) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

/** Level-5 lamp sparkle: hot cores in the beacon, headlamp and rear cluster. */
function lampHighlights(ctx: CanvasRenderingContext2D): void {
	glint(ctx, 635, 86, 2.6);
	ctx.fillStyle = 'rgba(255,249,214,0.95)';
	ctx.beginPath();
	ctx.ellipse(631, 86.4, 4, 1.4, 0, 0, Math.PI * 2);
	ctx.fill();

	glint(ctx, 52, 232, 1.9);
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(52, 233, 5.4, Math.PI * 1.05, Math.PI * 1.6);
	ctx.stroke();

	ctx.fillStyle = 'rgba(255,252,232,0.9)';
	ctx.fillRect(626, 250, 5, 1.5);
	ctx.fillRect(648, 250, 4, 1.4);
}

export function drawRealRescueTruckLevel(
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
		ctx.ellipse(350, 298, 326, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// One silhouette: cab-over nose, cab roof, high box with a squared tail.
	shape(ctx, SHELL, RED);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Body paint: bright roof, cool mid and a deep red lower shade.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 90, 0, 270);
		paint.addColorStop(0, 'rgba(255,255,255,0.44)');
		paint.addColorStop(0.15, 'rgba(255,255,255,0.06)');
		paint.addColorStop(0.62, 'rgba(80,10,18,0.02)');
		paint.addColorStop(1, 'rgba(80,10,18,0.3)');
		ctx.fillStyle = paint;
		ctx.fillRect(30, 88, 640, 186);
	}

	// White roof caps on the box and the cab.
	rect(ctx, 218, 90, 434, 8, WHITE, 0, 0);
	line(ctx, 220, 97.2, 650, 97.2, 'rgba(58,39,27,0.2)', 1.3);
	rect(ctx, 88, 114, 122, 5, WHITE, 0, 0);

	// The sign board that names the vehicle.
	rect(ctx, SIGN.x, SIGN.y, SIGN.w, SIGN.h, WHITE, 2.5, 2.6);
	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(SIGN.x + 1.5, SIGN.y + 1.5, SIGN.w - 3, SIGN.h - 3);
		ctx.clip();
		const board = ctx.createLinearGradient(0, SIGN.y, 0, SIGN.y + SIGN.h);
		board.addColorStop(0, 'rgba(255,255,255,0.42)');
		board.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		board.addColorStop(1, 'rgba(58,39,27,0.12)');
		ctx.fillStyle = board;
		ctx.fillRect(SIGN.x + 1.5, SIGN.y + 1.5, SIGN.w - 3, SIGN.h - 3);
		ctx.restore();
	}
	if (fitted) {
		ctx.strokeStyle = 'rgba(176,35,48,0.5)';
		ctx.lineWidth = 1.5;
		ctx.strokeRect(SIGN.x + 4, SIGN.y + 4, SIGN.w - 8, SIGN.h - 8);
	}
	ctx.fillStyle = RED;
	ctx.font = '800 27px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('RESCUE', 244, 137);
	if (fitted) {
		rect(ctx, 246, 143, 320, 2.4, RED_DARK, 0, 0);
	}

	// Lower white coach line along the whole flank.
	rect(ctx, 40, 236, 620, 7, WHITE, 0, 0);
	line(ctx, 42, 242.4, 658, 242.4, 'rgba(58,39,27,0.22)', 1.4);

	// Cab door seams, crew door split and waistline.
	line(ctx, DOOR.x, 124, DOOR.x, 232, 'rgba(58,39,27,0.34)', 2);
	line(ctx, 159, 120, 159, 232, 'rgba(58,39,27,0.24)', 1.6);
	line(ctx, DOOR.x + DOOR.w, 120, DOOR.x + DOOR.w, 232, 'rgba(58,39,27,0.34)', 2);
	line(ctx, 108, 180, 204, 180, 'rgba(58,39,27,0.2)', 1.6);

	// Cab to box joint, then the box panel joints.
	line(ctx, 212, 92, 212, 268, 'rgba(58,39,27,0.42)', 2.4);
	line(ctx, 213.6, 96, 213.6, 250, 'rgba(255,255,255,0.22)', 1.2);
	line(ctx, 506, 150, 506, 236, 'rgba(58,39,27,0.18)', 1.6);
	line(ctx, 594, 150, 594, 236, 'rgba(58,39,27,0.18)', 1.6);

	// Equipment lockers.
	lockerBank(ctx, shaded, fitted, finish);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Chassis rails and the deeper tank between the axles.
	shape(ctx, UNDERBODY, UNDER, 2.2);
	line(ctx, 100, 272.4, 652, 272.4, 'rgba(255,255,255,0.2)', 1.6);
	rect(ctx, 332, 274, 76, 9, '#4C5462', 1, 1.4);
	line(ctx, 336, 276.4, 404, 276.4, 'rgba(255,255,255,0.18)', 1.2);

	// Front and rear bumpers.
	rect(ctx, FRONT_BUMPER.x, FRONT_BUMPER.y, FRONT_BUMPER.w, FRONT_BUMPER.h, CHROME, 3, 2.6);
	line(ctx, 21, 248, 34, 248, 'rgba(255,255,255,0.7)', 1.4);
	line(ctx, 21, 266.4, 34, 266.4, 'rgba(58,39,27,0.3)', 1.3);
	if (fitted) rect(ctx, 23, 254, 13, 8, WHITE, 1, 1.3);

	rect(
		ctx,
		REAR_BUMPER.x,
		REAR_BUMPER.y,
		REAR_BUMPER.w,
		REAR_BUMPER.h,
		CHROME,
		2.5,
		2.6
	);
	line(ctx, 666, 253, 678, 253, 'rgba(255,255,255,0.55)', 1.3);

	// Mirror head on its arm.
	rect(ctx, 38, 184, 10, 7, STEEL, 2, 1.8);
	rect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, WHITE, 3, 2.4);
	rect(ctx, MIRROR.x + 1.5, MIRROR.y + 2, MIRROR.w - 3, 7, RED, 1, 1);
	if (shaded) {
		rect(ctx, 19, 166, MIRROR.w - 6, MIRROR.h - 19, GLASS, 1.4);
		line(ctx, 21, 169, 31, 169, 'rgba(255,255,255,0.5)', 1.2);
	}

	// Roof light bar on the cab, rear beacon on the box.
	roofBar(ctx, shaded, fitted, lit, finish);
	rect(ctx, BEACON.x, BEACON.y, BEACON.w, BEACON.h, STEEL, 2.5, 2.2);
	rect(ctx, BEACON.x + 3, BEACON.y + 2, BEACON.w - 6, BEACON.h - 4, AMBER, 1.5, 1.5);
	if (fitted) {
		rect(ctx, BEACON.x + 7, BEACON.y + 3.2, 7, 3.4, LAMP, 1, 1);
		line(ctx, BEACON.x + 3, BEACON.y + 2.4, BEACON.x + BEACON.w - 3, BEACON.y + 2.4, 'rgba(255,255,255,0.6)', 1.1);
	}

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, CAB_GLASS, GLASS, 2.5);
	shape(ctx, CREW_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 46, 124, 58, 50);
		glassShade(ctx, CAB_GLASS, 112, 124, 44, 50);
		glassShade(ctx, CREW_GLASS, 162, 126, 38, 46);
	}

	// Rear roller shutter, step and tail lamps: the cargo piece.
	rearShutter(ctx, shaded, fitted, finish);

	if (fitted) {
		// Headlamp, indicator and grille slots on the front corner.
		circle(ctx, 52, 232, 9.5, CHROME, 2.2);
		circle(ctx, 52, 232, 7.4, LAMP, 1.6);
		rect(ctx, 40, 216, 9, 7, AMBER, 2, 1.6);
		for (let bar = 0; bar < 3; bar++) {
			line(ctx, 40, 194 + bar * 5, 54, 194 + bar * 5, STEEL, 2);
		}

		// Wipers, clipped to the screen.
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		line(ctx, 56, 164, 74, 140, INK, 2.2);
		line(ctx, 66, 166, 84, 142, INK, 2);
		ctx.restore();

		// Cab door handles and the crew grab handle.
		rect(ctx, 130, 196, 17, 5, CHROME, 2.2, 1.9);
		rect(ctx, 186, 196, 17, 5, CHROME, 2.2, 1.9);
		circle(ctx, 120, 210, 1.5, INK, 1);

		// Side marker lamps along the lower flank, clear of both arches.
		for (const mx of [280, 360, 440]) {
			rect(ctx, mx, 246, 12, 6, AMBER, 1.5, 1.3);
		}

		// Wheel arches before the tyres.
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light on the cab roof, box roof and both corners.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(88, 115.4);
		ctx.lineTo(210, 115.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(220, 91.4);
		ctx.lineTo(650, 91.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(662.6, 104);
		ctx.lineTo(662.6, 260);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(52, 232, 1, 52, 232, 20);
		glow.addColorStop(0, 'rgba(255,240,150,0.6)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(52, 232, 20, 0, Math.PI * 2);
		ctx.fill();

		// Beacon glow.
		const beacon = ctx.createRadialGradient(635, 86, 1, 635, 86, 20);
		beacon.addColorStop(0, 'rgba(255,183,3,0.5)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(635, 86, 20, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 291, 27, 4.4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		panelSheen(ctx);
		liverySheen(ctx);

		// Glints clear of glass, tyres and the shutter.
		glint(ctx, 148, 206, 4.4);
		glint(ctx, 258, 196, 3.4);
		glint(ctx, 352, 196, 3.4);
		glint(ctx, 456, 196, 3.4);
		glint(ctx, 300, 254, 3);
		glint(ctx, 480, 254, 3);
		glint(ctx, 120, 228, 3.2);
		glint(ctx, 566, 158, 2.8);
		glint(ctx, 90, 140, 3);
		glint(ctx, 27, 178, 1.8);

		// Glass sheen and a sparkle in the crew pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(56, 164);
		ctx.lineTo(76, 134);
		ctx.stroke();
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(118, 166);
		ctx.lineTo(140, 134);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(170, 162);
		ctx.lineTo(188, 136);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 140, 138, 2.4);
		glint(ctx, 186, 142, 2.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		lampHighlights(ctx);
		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealRescueTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealRescueTruckLevel(ctx, x, y, scale, 5);
}
