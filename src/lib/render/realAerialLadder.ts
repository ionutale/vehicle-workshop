/**
 * Aerial ladder truck art, cut into the same five-piece kit as the other realistic
 * vehicles. A rear-mount fire ladder appliance facing left: a cab-over cab at the
 * nose, a hose-bed body behind it, deployed outrigger jacks, a light bar and a
 * hanging rear step.
 *
 * The cue that names the vehicle is the long nested aerial ladder stowed low over
 * the roof, heeled on a turntable at the tail. It is its own cargo piece so the
 * ladder sections and the turntable keep their metalwork. Level 5 is the production
 * target: shaded, fitted, lit and finished with paint grain, ladder sheen, glints,
 * hub hardware and an exhaust puff.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape, wheel } from './realKit';

const RED = '#E63946';
const RED_DARK = '#B72A35';
const RED_DEEP = '#7E1B23';
const WHITE = '#F7F9FC';
const WHITE_SOFT = '#FFFFFF';
const CREAM = '#FFF3DA';
const GOLD = '#E7C56A';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const BLUE_LAMP = '#2C5AA0';
const RED_LAMP = '#FF4D6D';
const PANEL = '#E8EDF4';
const ALU = '#D7DEE8';
const CHASSIS = '#3F4653';

/**
 * Cab and body traced as one silhouette so the cut-out keeps them welded together.
 * Cab roof 130, body roof 152, both riding on a common 262 underframe. Front is left.
 */
const MAIN =
	'M30,262 L30,188 Q30,174 40,170 L48,142 Q52,130 66,130 L188,130 Q196,130 196,140 L196,152 L744,152 Q752,152 752,162 L752,262 Z';

/** Chrome front bumper, butted to the nose. */
const BUMPER = 'M16,240 L30,240 L30,264 L16,264 Z';

/** Mirror head, standing proud of the cab on its drawn stalk. */
const MIRROR = 'M16,140 L30,140 L30,166 L16,166 Z';

/** Roof light bar, sitting on the cab roof. */
const LIGHT_BAR = 'M66,130 L66,118 Q66,114 70,114 L174,114 Q178,114 178,118 L178,130 Z';

/** Front outrigger, hanging from the underframe just behind the cab. */
const LEG_F = 'M252,262 L266,262 L266,280 L286,280 L286,290 L234,290 L234,280 L252,280 Z';

/** Rear outrigger, ahead of the rear tyre. */
const LEG_R = 'M544,262 L558,262 L558,280 L578,280 L578,290 L526,290 L526,280 L544,280 Z';

/** Rear step under the tail. */
const STEP = 'M688,262 L756,262 L756,288 L688,288 Z';

/** Vertical exhaust stack in the gap behind the cab. */
const STACK = 'M198,118 L210,118 L210,152 L198,152 Z';

/** Exhaust puff, mask-only until the picture-book level draws it. */
const PUFF =
	'M196,118 Q194,104 206,100 Q212,88 226,90 Q242,92 240,104 Q248,110 240,118 Z';

/** Wheel-arch holes, deliberately cut into the shell so the tyres read (never a circle). */
const ARCH_F = 'M146,268 A34,34 0 0 1 214,268 Z';
const ARCH_R = 'M586,268 A34,34 0 0 1 654,268 Z';

const BODY_MASK = [
	MAIN,
	BUMPER,
	MIRROR,
	LIGHT_BAR,
	LEG_F,
	LEG_R,
	STEP,
	STACK,
	PUFF,
	ARCH_F,
	ARCH_R
].join(' ');

/** Tall, raked windscreen — fire appliances have plenty of glass. */
const WINDSCREEN = 'M42,184 L50,152 Q52,144 60,144 L112,144 L112,184 Z';

/** Side window on the cab door. */
const DOOR_GLASS = 'M124,144 L184,144 Q190,144 190,150 L190,184 L124,184 Z';

const GLASS_MASK = `${WINDSCREEN} ${DOOR_GLASS}`;

/** Both wheels share one tile; the rear is the front mirrored. */
const WHEEL_L = { x: 180, y: 268, r: 32 };
const WHEEL_R = { x: 620, y: 268, r: 32 };

/**
 * Stowed ladder envelope: three nested sections drawn as one stepped contour so the
 * mask is hole-free. Fly at the front tip, middle, then the wide base at the heel.
 */
const LADDER = 'M212,126 L340,126 L340,122 L472,122 L472,118 L652,118 L652,150 L472,150 L472,146 L340,146 L340,142 L212,142 Z';

/** Turntable drum on the rear roof, butted to the stair heel. */
const TURNTABLE =
	'M652,152 L652,136 Q652,128 660,128 L736,128 Q744,128 744,136 L744,152 Z';

const LADDER_MASK = `${LADDER} ${TURNTABLE}`;

interface Section {
	x: number;
	y: number;
	w: number;
	h: number;
	rail: number;
	rung: number;
}

/** Mid and fly lunge a little into the next section so the nesting reads. */
const SECTIONS: Section[] = [
	{ x: 472, y: 118, w: 180, h: 32, rail: 6, rung: 18 },
	{ x: 340, y: 122, w: 142, h: 24, rail: 5, rung: 16 },
	{ x: 212, y: 126, w: 138, h: 16, rail: 4, rung: 14 }
];

/** Rounded rectangle path, matching the kit's shell radius. */
function roundedBox(x: number, y: number, w: number, h: number, r: number): string {
	return `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;
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
	const glass = ctx.createLinearGradient(x, y, x + w, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.6)');
	glass.addColorStop(0.45, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(80,160,205,0.28)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Recessed wheel well behind the tyre, ringed by a red mudguard lip. */
function wheelArch(ctx: CanvasRenderingContext2D, cx: number, shaded: boolean): void {
	ctx.beginPath();
	ctx.arc(cx, 268, 40, Math.PI, Math.PI * 2);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, 228, 0, 268);
		well.addColorStop(0, '#2A1114');
		well.addColorStop(1, RED_DEEP);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = '#3A1518';
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = RED;
	ctx.lineWidth = 6;
	ctx.beginPath();
	ctx.arc(cx, 268, 43, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, 268, 46, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();

	if (shaded) {
		ctx.strokeStyle = 'rgba(255,255,255,0.28)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(cx, 268, 39, Math.PI * 1.12, Math.PI * 1.5);
		ctx.stroke();
	}
}

/** Four-point sparkle with a warm core, sized to survive the game scale. */
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

/** Six-bolt picture-book hub; the pattern is mirror symmetric for the flipped tile. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.68)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.48, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.29, y + Math.sin(a) * r * 0.29, 2.1, CHROME, 1.1);
	}

	circle(ctx, x, y, r * 0.12, '#E8EDF4', 1.2);
	ctx.strokeStyle = 'rgba(255,255,255,0.75)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.64, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();
}

/** One telescoping ladder section: pale metal box, steel rungs, painted tip band. */
function ladderSection(
	ctx: CanvasRenderingContext2D,
	s: Section,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	const path = roundedBox(s.x, s.y, s.w, s.h, 2.4);
	shape(ctx, path, PANEL, 2.2);

	ctx.save();
	ctx.clip(new Path2D(path));

	if (shaded) {
		const metal = ctx.createLinearGradient(0, s.y, 0, s.y + s.h);
		metal.addColorStop(0, 'rgba(255,255,255,0.72)');
		metal.addColorStop(0.48, 'rgba(255,255,255,0.06)');
		metal.addColorStop(1, 'rgba(40,60,80,0.24)');
		ctx.fillStyle = metal;
		ctx.fillRect(s.x, s.y, s.w, s.h);
	}

	// Rungs first, rails over them, so the ladder reads even at a glance.
	for (let rx = s.x + 8; rx < s.x + s.w - 5; rx += s.rung) {
		line(ctx, rx, s.y + s.rail, rx, s.y + s.h - s.rail, STEEL, 2.2);
	}
	const railTop = s.y + s.rail / 2 + 0.5;
	const railBottom = s.y + s.h - s.rail / 2 - 0.5;
	line(ctx, s.x + 2, railTop, s.x + s.w - 2, railTop, STEEL, s.rail);
	line(ctx, s.x + 2, railBottom, s.x + s.w - 2, railBottom, STEEL, s.rail);
	if (shaded) {
		line(ctx, s.x + 3, railTop - 1, s.x + s.w - 3, railTop - 1, ALU, 1.3);
		line(ctx, s.x + 3, railBottom - 1, s.x + s.w - 3, railBottom - 1, ALU, 1.1);
	}

	// Red tip band at the forward end of every section.
	rect(ctx, s.x + 0.5, s.y + 0.8, 7, s.h - 1.6, RED, 0.5, 0);

	if (fitted) {
		// Section collars at the heel and a rivet pair at every rung foot.
		line(ctx, s.x + s.w - 8, s.y + 1, s.x + s.w - 8, s.y + s.h - 1, RED_DARK, 4);
		for (let rx = s.x + 14; rx < s.x + s.w - 10; rx += 12) {
			circle(ctx, rx, railTop + s.rail / 2 + 1, 1.1, CHROME, 0.7);
		}
	}

	if (finish) {
		// Polished run along the loaded top rail.
		ctx.globalAlpha = 0.5;
		line(ctx, s.x + 6, railTop - s.rail / 2 + 0.6, s.x + s.w - 6, railTop - s.rail / 2 + 0.6, WHITE_SOFT, 2);
		ctx.globalAlpha = 1;
	}

	ctx.restore();
}

/** Turntable drum, its ring gear and the ladder heel pin. */
function drawTurntable(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, TURNTABLE, STEEL, 2.6);

	ctx.save();
	ctx.clip(new Path2D(TURNTABLE));
	if (shaded) {
		const drum = ctx.createLinearGradient(0, 128, 0, 152);
		drum.addColorStop(0, 'rgba(255,255,255,0.46)');
		drum.addColorStop(0.55, 'rgba(255,255,255,0.05)');
		drum.addColorStop(1, 'rgba(0,0,0,0.3)');
		ctx.fillStyle = drum;
		ctx.fillRect(652, 128, 92, 24);
	}
	rect(ctx, 654, 145, 88, 6, RED_DARK, 0, 0);
	rect(ctx, 654, 143.5, 88, 1.6, GOLD, 0, 0);
	ctx.restore();

	// Ring gear: the disc that makes the turntable read as a turntable.
	circle(ctx, 704, 140, 10.5, CHROME, 2);
	circle(ctx, 704, 140, 6, STEEL, 1.4);
	circle(ctx, 704, 140, 2.8, CHROME, 1.2);
	if (fitted) {
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * Math.PI * 2;
			circle(ctx, 704 + Math.cos(a) * 8, 140 + Math.sin(a) * 8, 1.15, STEEL, 0.8);
		}
		for (let bx = 662; bx < 738; bx += 13) {
			circle(ctx, bx, 148.5, 1.5, CHROME, 0.9);
		}
	}

	if (finish) {
		line(ctx, 658, 129.5, 738, 129.5, 'rgba(255,255,255,0.55)', 1.6);
		line(ctx, 716, 138, 724, 138, 'rgba(255,255,255,0.75)', 1.3);
	}
}

/** Nested ladder, turntable, heel pin and luffing ram — the naming cue. */
function drawLadder(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	for (const s of SECTIONS) {
		ladderSection(ctx, s, shaded, fitted, finish);
	}

	drawTurntable(ctx, shaded, fitted, finish);

	// Heel pin: the ladder pivots here, inside both envelope subpaths.
	circle(ctx, 654, 139, 6.5, CHROME, 2);
	circle(ctx, 654, 139, 2.4, STEEL, 1.2);

	if (fitted) {
		// Luffing ram lying along the bed, plus its trunnion and the turntable ring bolts.
		line(ctx, 600, 147.5, 700, 148.5, INK, 5.4);
		line(ctx, 600, 147.5, 700, 148.5, CHROME, 2.6);
		circle(ctx, 700, 148.5, 3, STEEL, 1.4);

		// Fly-tip guide roller and the stop plate at the heel.
		circle(ctx, 218, 134, 3.2, CHROME, 1.3);
		rect(ctx, 636, 120, 8, 10, RED_DARK, 1.2, 1.6);

		// Ladder load plate and hose straps laid over the base section.
		rect(ctx, 500, 144, 30, 5, RED, 1.5, 1.4);
		rect(ctx, 560, 144, 22, 5, RED, 1.5, 1.4);
	}

	if (lit) {
		// Rim light down the top of the base section and a cool sheen on the mid.
		line(ctx, 474, 119.6, 650, 119.6, 'rgba(255,255,255,0.6)', 1.8);
		line(ctx, 342, 123.4, 470, 123.4, 'rgba(255,255,255,0.42)', 1.4);
	}
}

export function drawRealAerialLadderLevel(
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
		ctx.ellipse(390, 306, 350, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Exhaust stack behind the cab.
	shape(ctx, STACK, STEEL, 2.5);
	if (shaded) {
		line(ctx, 201, 120, 201, 150, 'rgba(255,255,255,0.34)', 1.5);
		line(ctx, 206.5, 120, 206.5, 150, 'rgba(0,0,0,0.3)', 2);
	}

	// Outrigger jacks, drawn under the shell so their tops tuck beneath it.
	for (const [leg, padCx] of [
		[LEG_F, 260],
		[LEG_R, 552]
	] as const) {
		shape(ctx, leg, RED, 2.5);
		if (fitted) {
			line(ctx, padCx, 264, padCx, 279, CHROME, 3.6);
			line(ctx, padCx, 264, padCx, 279, 'rgba(255,255,255,0.5)', 1.2);
			line(ctx, padCx - 24, 287, padCx + 24, 287, AMBER, 2);
			circle(ctx, padCx, 268, 1.9, STEEL, 1);
		}
		if (finish) {
			line(ctx, padCx - 24, 289, padCx + 24, 289, 'rgba(255,255,255,0.7)', 1.4);
		}
	}

	// Shell.
	shape(ctx, MAIN, RED, 3);

	ctx.save();
	ctx.clip(new Path2D(MAIN));

	// Underframe strip and the dark chassis rails inside the silhouette.
	rect(ctx, 30, 250, 722, 12, CHASSIS, 0, 0);
	rect(ctx, 30, 244, 722, 6, RED_DARK, 0, 0);

	// Livery: broad white band with a gold pinstripe, plus a white roof cap.
	rect(ctx, 30, 186, 722, 20, WHITE, 0, 0);
	rect(ctx, 30, 206, 722, 3, GOLD, 0, 0);
	rect(ctx, 30, 130, 166, 7, WHITE, 0, 0);
	rect(ctx, 196, 152, 548, 6, RED_DEEP, 0, 0);
	line(ctx, 196, 158, 744, 158, 'rgba(255,255,255,0.22)', 1.4);

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 128, 0, 262);
		paint.addColorStop(0, 'rgba(255,255,255,0.32)');
		paint.addColorStop(0.3, 'rgba(255,255,255,0.04)');
		paint.addColorStop(0.82, 'rgba(90,16,24,0.08)');
		paint.addColorStop(1, 'rgba(40,8,12,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(30, 126, 722, 138);
	}

	ctx.restore();

	// Chassis detail: rails, bolts and the fuel tank between the axles.
	if (shaded) {
		line(ctx, 44, 254, 742, 254, 'rgba(255,255,255,0.16)', 1.4);
		line(ctx, 44, 258, 742, 258, 'rgba(0,0,0,0.32)', 1.6);
	}
	if (fitted) {
		rect(ctx, 466, 247, 58, 12, CHROME, 3, 2);
		line(ctx, 486, 248, 486, 258, 'rgba(58,39,27,0.4)', 1.2);
		line(ctx, 504, 248, 504, 258, 'rgba(58,39,27,0.4)', 1.2);
		for (let boltX = 56; boltX < 740; boltX += 58) {
			circle(ctx, boltX, 256, 1.2, 'rgba(255,255,255,0.35)', 0.6);
		}
	}

	// Compartment fascia: two roller doors, the pump panel and the tail locker.
	if (fitted) {
		for (const [dx, dw] of [
			[216, 114],
			[344, 114]
		] as const) {
			rect(ctx, dx, 210, dw, 34, '#EDF1F6', 3, 2.2);
			for (let slat = 1; slat < 4; slat++) {
				line(ctx, dx + 4, 210 + slat * 8, dx + dw - 4, 210 + slat * 8, 'rgba(58,39,27,0.3)', 1.4);
			}
			rect(ctx, dx + dw / 2 - 11, 226, 22, 4, RED_DARK, 1.5, 1.2);
		}

		// Pump panel with two gauges and a row of levers.
		rect(ctx, 474, 210, 110, 34, CHROME, 3, 2.2);
		for (const [gx, needle] of [
			[492, -0.7],
			[512, 0.5]
		] as const) {
			circle(ctx, gx, 223, 6.5, '#F1F5FA', 1.6);
			line(ctx, gx, 223, gx + Math.cos(needle) * 5, 223 + Math.sin(needle) * 5, RED_DEEP, 1.3);
		}
		for (let lx = 538; lx < 576; lx += 10) {
			rect(ctx, lx, 216, 5, 14, lx === 548 ? RED : STEEL, 1.2, 1.1);
		}
		line(ctx, 478, 238, 580, 238, 'rgba(58,39,27,0.24)', 1.2);

		// Rear locker, kept above the rear arch.
		rect(ctx, 600, 210, 78, 22, '#EDF1F6', 3, 2);
		for (let vent = 0; vent < 4; vent++) {
			line(ctx, 606, 214 + vent * 4, 672, 214 + vent * 4, 'rgba(58,39,27,0.3)', 1.3);
		}
	}

	// Rear hazard chevrons, tail lamps and plate on the tail panel.
	if (fitted) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(696, 210, 32, 36);
		ctx.clip();
		ctx.fillStyle = GOLD;
		ctx.fillRect(696, 210, 32, 36);
		ctx.fillStyle = RED_DARK;
		for (let i = -36; i < 68; i += 16) {
			ctx.beginPath();
			ctx.moveTo(696 + i, 246);
			ctx.lineTo(696 + i + 36, 210);
			ctx.lineTo(696 + i + 44, 210);
			ctx.lineTo(696 + i + 8, 246);
			ctx.closePath();
			ctx.fill();
		}
		ctx.restore();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.8;
		ctx.strokeRect(696, 210, 32, 36);

		rect(ctx, 734, 210, 12, 9, RED_LAMP, 2, 1.4);
		rect(ctx, 734, 221, 12, 7, AMBER, 1.5, 1.3);
		rect(ctx, 734, 230, 12, 8, CREAM, 1.2, 1.2);
		line(ctx, 736, 233, 744, 233, 'rgba(58,39,27,0.45)', 1);
	}

	// Cab door seam, handle and hinges.
	line(ctx, 124, 188, 124, 246, 'rgba(58,39,27,0.55)', 2);
	line(ctx, 124, 246, 190, 246, 'rgba(58,39,27,0.4)', 1.6);
	if (fitted) {
		rect(ctx, 178, 214, 8, 4, CHROME, 1, 1.2);
		rect(ctx, 126, 196, 3, 9, STEEL, 1, 1.2);
		rect(ctx, 126, 228, 3, 9, STEEL, 1, 1.2);
		// Cab step and the crew grab handle under the window.
		rect(ctx, 128, 250, 44, 6, CHROME, 2, 1.6);
		line(ctx, 160, 188, 160, 206, 'rgba(58,39,27,0.35)', 1.4);
	}

	// Front bumper, grille, lamps and plate.
	shape(ctx, BUMPER, CHROME, 2.5);
	if (fitted) {
		circle(ctx, 24, 245, 2, STEEL, 1);
		circle(ctx, 24, 258, 2, STEEL, 1);
		rect(ctx, 18, 249, 12, 7, WHITE, 1, 1.2);
		line(ctx, 20, 252, 28, 252, 'rgba(58,39,27,0.4)', 1);
		rect(ctx, 31, 196, 7, 18, '#39404E', 2, 1.4);
		for (let bar = 0; bar < 3; bar++) {
			line(ctx, 33, 200 + bar * 5, 36, 200 + bar * 5, 'rgba(201,210,222,0.7)', 1.1);
		}
		circle(ctx, 38, 224, 7, LAMP, 2.2);
		circle(ctx, 37, 222.5, 3.4, '#FFF7CF', 1.3);
		circle(ctx, 38, 238, 4, AMBER, 1.6);
	}

	// Mirror head on its stalk.
	shape(ctx, MIRROR, STEEL, 2.4);
	rect(ctx, 19, 144, 8, 18, GLASS, 1.2, 1.2);
	line(ctx, 30, 150, 48, 150, INK, 2.6);
	line(ctx, 30, 150, 48, 150, CHROME, 1.4);

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.4);
	shape(ctx, DOOR_GLASS, GLASS, 2.4);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 42, 144, 70, 40);
		glassShade(ctx, DOOR_GLASS, 124, 144, 66, 40);
	}
	if (fitted) {
		// Wipers and the centre divider between screen and door glass.
		line(ctx, 48, 180, 78, 158, INK, 2);
		line(ctx, 84, 180, 104, 164, INK, 1.6);
		line(ctx, 118, 144, 118, 184, 'rgba(58,39,27,0.5)', 2);
	}

	// Roof light bar: red and blue cells on a steel base.
	shape(ctx, LIGHT_BAR, STEEL, 2.4);
	rect(ctx, 72, 116, 46, 12, RED_LAMP, 2, 1.4);
	rect(ctx, 122, 116, 48, 12, BLUE_LAMP, 2, 1.4);
	if (fitted) {
		line(ctx, 74, 117.5, 116, 117.5, 'rgba(255,255,255,0.6)', 1.2);
		line(ctx, 124, 117.5, 168, 117.5, 'rgba(255,255,255,0.45)', 1.2);
	}

	// Ladder bed cradles on the roof, under the stowed ladder.
	if (fitted) {
		for (const cradleX of [250, 400, 600]) {
			rect(ctx, cradleX, 152, 10, 6, STEEL, 1.5, 1.4);
			circle(ctx, cradleX + 5, 156, 1.5, CHROME, 0.9);
		}
	}

	// Rear step with treads and its two lamps.
	shape(ctx, STEP, CHROME, 2.4);
	ctx.save();
	ctx.clip(new Path2D(STEP));
	rect(ctx, 688, 262, 68, 3, '#8A93A3', 0, 0);
	if (shaded) {
		const plate = ctx.createLinearGradient(0, 262, 0, 288);
		plate.addColorStop(0, 'rgba(255,255,255,0.4)');
		plate.addColorStop(1, 'rgba(40,50,64,0.22)');
		ctx.fillStyle = plate;
		ctx.fillRect(688, 262, 68, 26);
	}
	ctx.restore();
	if (fitted) {
		for (let tread = 1; tread < 4; tread++) {
			line(ctx, 692, 262 + tread * 6.5, 752, 262 + tread * 6.5, 'rgba(58,39,27,0.4)', 1.4);
		}
		rect(ctx, 738, 277, 8, 5, RED_LAMP, 1.5, 1.2);
		rect(ctx, 746, 277, 7, 5, AMBER, 1.5, 1.2);
	}
	if (finish) {
		line(ctx, 690, 263.5, 754, 263.5, 'rgba(255,255,255,0.6)', 1.4);
	}

	// Wheel wells and mudguards, then the tyres.
	if (fitted) {
		wheelArch(ctx, WHEEL_L.x, shaded);
		wheelArch(ctx, WHEEL_R.x, shaded);
	}

	// The ladder is drawn after the shell so its shadows fall on the roof.
	if (shaded) {
		ctx.save();
		ctx.globalAlpha = 0.18;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(470, 154, 228, 5, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	drawLadder(ctx, shaded, fitted, lit, finish);

	// One wheel piece, used twice; the rear tile is its exact mirror.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light along the cab roof, nose and body shoulder.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(68, 131.5);
		ctx.lineTo(186, 131.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(31.5, 192);
		ctx.lineTo(31.5, 246);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(266, 153.5);
		ctx.lineTo(742, 153.5);
		ctx.stroke();

		// Headlight glow and the beacon wash on the roof.
		const glow = ctx.createRadialGradient(38, 224, 1, 38, 224, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.72)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(38, 224, 26, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(144, 112, 1, 144, 112, 30);
		beacon.addColorStop(0, 'rgba(255,77,109,0.34)');
		beacon.addColorStop(0.5, 'rgba(44,90,160,0.2)');
		beacon.addColorStop(1, 'rgba(44,90,160,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(144, 112, 30, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 300, 27, 4.5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain over the body: glass and tyres stay clear.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(
			WHEEL_R.x,
			WHEEL_R.y,
			WHEEL_R.r
		)}`;
		ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');
		let seed = 43;
		const rnd = (): number => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 320; i++) {
			const px = 20 + rnd() * 732;
			const py = 94 + rnd() * 168;
			const size = 1.4 + rnd() * 1.3;
			ctx.globalAlpha = 0.07 + rnd() * 0.06;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = WHITE_SOFT;
		for (let i = 0; i < 120; i++) {
			const px = 20 + rnd() * 732;
			const py = 94 + rnd() * 168;
			const size = 1.2 + rnd() * 1;
			ctx.globalAlpha = 0.18 + rnd() * 0.12;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes: cab flank, hose bed and tail.
		ctx.globalAlpha = 0.09;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[40, 222, 188, 221],
			[210, 232, 450, 231],
			[610, 234, 744, 233],
			[56, 168, 182, 166]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Exhaust puff drifting off the stack.
		ctx.save();
		ctx.clip(new Path2D(PUFF));
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[208, 110, 4.6],
			[220, 103, 5.4],
			[232, 100, 4]
		] as const) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Glass sheen and a sparkle in the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(56, 180);
		ctx.lineTo(88, 148);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(138, 180);
		ctx.lineTo(162, 156);
		ctx.stroke();
		ctx.restore();

		// Glints on paint, metal and chrome, clear of the tyres.
		glint(ctx, 330, 132, 5.4);
		glint(ctx, 654, 135, 4.2);
		glint(ctx, 514, 216, 4);
		glint(ctx, 118, 152, 4.4);
		glint(ctx, 740, 234, 3.6);

		// Hub hardware on both wheels; both finishes are mirror-symmetric.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Finishing marks: chipped paint on the working edges.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[44, 259, 8, 2, 0.36],
			[206, 245, 7, 2, 0.3],
			[462, 245, 9, 2, 0.28],
			[628, 245, 6, 2, 0.26],
			[744, 246, 5, 2.2, 0.32]
		] as const) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealAerialLadder(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealAerialLadderLevel(ctx, x, y, scale, 5);
}
