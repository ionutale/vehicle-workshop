/**
 * Food truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A boxy orange serving van facing left: a stubby nose under a raked screen, a long teal-roofed
 * box body, a wide serving hatch with a chrome counter and a scalloped striped awning, a menu
 * board beside it, a side door, a rear plate and — the cue that names the vehicle — a rooftop
 * sign carrying a burger-and-star emblem, with no lettering. Level 5 is the production target:
 * shaded, fully fitted, lit and picture-book finished.
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
const ORANGE_LIGHT = '#FFC58F';
const ORANGE_SHADE = '#DE8B4B';
const ORANGE_DEEP = '#C0763C';
const TEAL = '#2A9D8F';
const TEAL_DARK = '#1F7C71';
const TEAL_DEEP = '#145C54';
const CREAM = '#FFF6E6';
const BUN = '#F0B269';
const PATTY = '#7A4B2E';
const LETTUCE = '#7FB069';
const CHEESE = '#FFC94A';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/** Art box 720 x 350, road at 272. Front (cab) faces left. */
const SHELL =
	'M36,258 L36,198 Q36,186 48,182 L86,176 L142,104 Q146,94 158,94 L674,94 Q688,94 688,108 L688,244 Q688,258 672,258 Z';

/** Rooftop sign board: rounded top, square foot sitting exactly on the roof line. */
const SIGN = 'M296,44 L420,44 Q428,44 428,52 L428,94 L288,94 L288,52 Q288,44 296,44 Z';
const SIGN_FACE = { x: 296, y: 50, w: 124, h: 38 };
const SIGN_FOOT_L = { x: 302, y: 88, w: 10, h: 8 };
const SIGN_FOOT_R = { x: 404, y: 88, w: 10, h: 8 };

/** Chrome bumpers and the underbody sill: body-mask fittings that only touch the shell. */
const BUMPER_FRONT = { x: 22, y: 236, w: 14, h: 22 };
const BUMPER_REAR = { x: 688, y: 246, w: 14, h: 14 };
const UNDERBODY = { x: 206, y: 258, w: 306, h: 6 };

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Raked windscreen band with the A-pillar, plus the cab side pane. */
const WINDSCREEN = 'M96,168 L138,114 L154,124 L112,176 Z';
const SIDE_GLASS = pane(166, 116, 54, 46, 6);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Cab side door: a clean rectangle, clear of every pane and of the serving hatch. */
const DOOR = { x: 232, y: 112, w: 124, h: 122 };
const DOOR_MASK = rectMask(DOOR.x, DOOR.y, DOOR.w, DOOR.h);

/** Serving hatch opening under the awning, deep enough to stock a shelf. */
const HATCH = 'M366,196 L366,168 Q366,154 380,154 L506,154 Q520,154 520,168 L520,196 Z';
const COUNTER = { x: 356, y: 193, w: 174, h: 15 };

/** Menu board beside the hatch, clear of the rear wheel arch. */
const MENU = { x: 596, y: 112, w: 60, h: 64 };

/** Striped awning with eight scallops along its lower edge. */
const AWNING = (() => {
	const x0 = 344;
	const x1 = 542;
	const top = 124;
	const base = 146;
	const n = 8;
	const w = (x1 - x0) / n;
	let d = `M${x0},${top} L${x1},${top} L${x1},${base}`;
	for (let i = n - 1; i >= 0; i--) {
		const a = x0 + i * w;
		d += ` Q${a + w / 2},${base + 13} ${a},${base}`;
	}
	return `${d} Z`;
})();

/** Both wheels are the same piece; the body never masks them. */
const WHEEL_L = { x: 150, y: 236, r: 34 };
const WHEEL_R = { x: 560, y: 236, r: 34 };
const WHEEL_MASK = circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);

/** Body mask: shell plus the roof sign and the bumpers. Subpaths never overlap. */
const BODY_MASK = `${SHELL} ${SIGN} ${rectMask(
	BUMPER_FRONT.x,
	BUMPER_FRONT.y,
	BUMPER_FRONT.w,
	BUMPER_FRONT.h
)} ${rectMask(BUMPER_REAR.x, BUMPER_REAR.y, BUMPER_REAR.w, BUMPER_REAR.h)} ${rectMask(
	UNDERBODY.x,
	UNDERBODY.y,
	UNDERBODY.w,
	UNDERBODY.h
)}`;

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
	glass.addColorStop(1, 'rgba(105,190,240,0.26)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Filled wheel-arch band sitting just outside the tyre. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 11, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = TEAL;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 6.6, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
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

/** A crisp five-point star, used on the rooftop sign and the menu board. */
function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, fill: string): void {
	let d = '';
	for (let i = 0; i < 10; i++) {
		const rad = i % 2 === 0 ? r : r * 0.44;
		const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
		d += `${i === 0 ? 'M' : 'L'}${(cx + Math.cos(a) * rad).toFixed(2)},${(
			cy +
			Math.sin(a) * rad
		).toFixed(2)} `;
	}
	shape(ctx, `${d}Z`, fill, 1.4);
}

/**
 * Picture-book hub: polished cap, bright rim ring, six bolt heads with their own highlights,
 * an axle shadow and mirrored rim arcs. Sidewall shoulders catch the roof light. Every mark
 * is symmetric about the vertical axis, so the flipped rear wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Sidewall shoulders catch the roof light, clear of the tread notches.
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.86, Math.PI * 1.08, Math.PI * 1.42);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(x, y, r * 0.86, Math.PI * 1.58, Math.PI * 1.92);
	ctx.stroke();

	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
	ctx.clip();
	const cap = ctx.createLinearGradient(0, y - r * 0.42, 0, y + r * 0.42);
	cap.addColorStop(0, 'rgba(255,255,255,0.85)');
	cap.addColorStop(0.44, 'rgba(255,255,255,0.1)');
	cap.addColorStop(1, 'rgba(92,100,114,0.42)');
	ctx.fillStyle = cap;
	ctx.fillRect(x - r, y - r, r * 2, r * 2);
	ctx.restore();

	// Darker seat under the cap reads as depth around the axle.
	ctx.fillStyle = 'rgba(43,45,66,0.28)';
	ctx.beginPath();
	ctx.arc(x, y, r * 0.37, Math.PI * 0.16, Math.PI * 0.84);
	ctx.arc(x, y, r * 0.16, Math.PI * 0.84, Math.PI * 0.16, true);
	ctx.closePath();
	ctx.fill();

	// Dish shadow rolling under the polished cap.
	ctx.strokeStyle = 'rgba(58,39,27,0.22)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, Math.PI * 0.18, Math.PI * 0.82);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.28;
		const by = y + Math.sin(a) * r * 0.28;
		circle(ctx, bx, by, 2.4, CHROME, 1.2);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx, by - 0.9, 0.85, 0, Math.PI * 2);
		ctx.fill();
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.fillStyle = 'rgba(255,255,255,0.9)';
	ctx.beginPath();
	ctx.arc(x, y - r * 0.04, r * 0.055, 0, Math.PI * 2);
	ctx.fill();

	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.1, Math.PI * 1.46);
	ctx.arc(x, y, r * 0.62, Math.PI * 1.54, Math.PI * 1.9);
	ctx.stroke();
	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
}

/** The cab side door: inset leaf, hinges, chrome handle and the livery bands carried across. */
function sideDoor(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, ORANGE_SHADE, 3, 2.6);
	rect(ctx, DOOR.x + 5, DOOR.y + 5, DOOR.w - 10, DOOR.h - 10, ORANGE, 2, 1.8);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(DOOR_MASK));
		const shade = ctx.createLinearGradient(DOOR.x, DOOR.y, DOOR.x, DOOR.y + DOOR.h);
		shade.addColorStop(0, 'rgba(255,255,255,0.44)');
		shade.addColorStop(0.5, 'rgba(255,255,255,0.06)');
		shade.addColorStop(1, 'rgba(192,118,60,0.2)');
		ctx.fillStyle = shade;
		ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
		ctx.restore();
	}

	line(ctx, DOOR.x + 6, DOOR.y + 9, DOOR.x + DOOR.w - 6, DOOR.y + 9, 'rgba(192,118,60,0.2)', 1.4);
	line(ctx, DOOR.x + 6, 150, DOOR.x + DOOR.w - 6, 150, 'rgba(31,124,113,0.3)', 1.4);

	if (fitted) {
		for (const hy of [DOOR.y + 14, DOOR.y + 58]) {
			rect(ctx, DOOR.x + 1, hy, 6, 12, STEEL, 1.5, 1.4);
			circle(ctx, DOOR.x + 4, hy + 6, 1.2, CHROME, 0.8);
		}
		rect(ctx, DOOR.x + DOOR.w - 16, 166, 11, 5, CHROME, 2.2, 1.8);
	}

	// Waist and skirt bands carried across the leaf so the separate door matches the flank.
	ctx.save();
	ctx.clip(new Path2D(DOOR_MASK));
	ctx.fillStyle = TEAL;
	ctx.fillRect(DOOR.x, 220, DOOR.w, 11);
	ctx.fillStyle = 'rgba(255,255,255,0.24)';
	ctx.fillRect(DOOR.x, 221.4, DOOR.w, 1.4);
	ctx.fillStyle = TEAL;
	ctx.fillRect(DOOR.x, 244, DOOR.w, 14);
	ctx.fillStyle = 'rgba(255,255,255,0.24)';
	ctx.fillRect(DOOR.x, 245.4, DOOR.w, 1.4);
	ctx.restore();
}

/** Wide serving hatch: dark recess, stocked shelf at the fitted level and a warm glow when lit. */
function servingHatch(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	ctx.save();
	ctx.clip(new Path2D(HATCH));
	ctx.fillStyle = TEAL_DEEP;
	ctx.fillRect(362, 150, 162, 50);

	if (shaded) {
		const depth = ctx.createLinearGradient(0, 152, 0, 198);
		depth.addColorStop(0, 'rgba(8,30,28,0.62)');
		depth.addColorStop(0.45, 'rgba(8,30,28,0.08)');
		depth.addColorStop(1, 'rgba(255,226,178,0.2)');
		ctx.fillStyle = depth;
		ctx.fillRect(362, 150, 162, 50);
	}

	if (lit) {
		const glow = ctx.createRadialGradient(443, 184, 4, 443, 184, 96);
		glow.addColorStop(0, 'rgba(255,214,150,0.46)');
		glow.addColorStop(1, 'rgba(255,214,150,0)');
		ctx.fillStyle = glow;
		ctx.fillRect(362, 150, 162, 50);
	}

	if (fitted) {
		// Stocked tubs and trays along the upper shelf.
		const tubs = [ORANGE_LIGHT, CREAM, TEAL, '#F7C8E0'];
		for (let i = 0; i < 6; i++) {
			const tx = 380 + i * 23;
			rect(ctx, tx, 164, 17, 12, tubs[i % 4], 2, 1.5);
			line(ctx, tx + 2, 167, tx + 15, 167, 'rgba(255,255,255,0.45)', 1.2);
		}
		line(ctx, 372, 178, 514, 178, CHROME, 2.4);
		line(ctx, 372, 179.4, 514, 179.4, 'rgba(255,255,255,0.5)', 1);

		// Condiment bottles and a paper tray on the counter shelf.
		for (const [bx, color] of [
			[386, AMBER],
			[398, RED],
			[410, LETTUCE]
		] as Array<[number, string]>) {
			rect(ctx, bx, 184, 7, 11, color, 2, 1.2);
			rect(ctx, bx + 1.5, 181, 4, 4, STEEL, 1, 1);
		}
		rect(ctx, 438, 182, 42, 12, CREAM, 1.5, 1.3);
		line(ctx, 443, 186, 470, 186, 'rgba(31,124,113,0.55)', 1.2);
		line(ctx, 443, 190, 462, 190, 'rgba(31,124,113,0.4)', 1.2);
	}

	if (finish) {
		const warm = ctx.createLinearGradient(0, 184, 0, 198);
		warm.addColorStop(0, 'rgba(255,226,178,0.34)');
		warm.addColorStop(1, 'rgba(255,226,178,0)');
		ctx.fillStyle = warm;
		ctx.fillRect(362, 184, 162, 14);

		ctx.fillStyle = 'rgba(255,255,255,0.82)';
		for (const [sx, sy] of [
			[380.6, 178.4],
			[426.6, 178.4],
			[472.6, 178.4],
			[510.6, 178.4],
			[392.4, 196.2],
			[454.4, 196.2]
		]) {
			ctx.beginPath();
			ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	ctx.restore();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke(new Path2D(HATCH));
}

/** Chrome-lipped serving counter with brackets, a service bell and a lacquered top. */
function counter(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean, finish: boolean): void {
	rect(ctx, COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h, CREAM, 3, 2.6);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(rectMask(COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h)));
		const face = ctx.createLinearGradient(0, COUNTER.y, 0, COUNTER.y + COUNTER.h);
		face.addColorStop(0, 'rgba(255,255,255,0.55)');
		face.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		face.addColorStop(1, 'rgba(192,118,60,0.18)');
		ctx.fillStyle = face;
		ctx.fillRect(COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h);
		ctx.restore();
	}

	if (fitted) {
		rect(ctx, COUNTER.x, 205, COUNTER.w, 3, CHROME, 1.5, 0);
		line(ctx, COUNTER.x + 4, 195.4, COUNTER.x + COUNTER.w - 4, 195.4, 'rgba(255,255,255,0.72)', 1.5);
		rect(ctx, 362, 208, 8, 6, TEAL_DEEP, 1, 1.4);
		rect(ctx, 516, 208, 8, 6, TEAL_DEEP, 1, 1.4);
		line(ctx, 365, 208, 358, 221, CHROME, 2);
		line(ctx, 523, 208, 529, 221, CHROME, 2);
		circle(ctx, 490, 189, 4.4, CHROME, 1.6);
		circle(ctx, 490, 185.6, 1.5, STEEL, 1);
	}

	if (finish) {
		// Lacquered face: hatch light across the top, a warm reflection of the stock,
		// and a deep orange gathering at the base.
		ctx.save();
		ctx.clip(new Path2D(rectMask(COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h)));
		const lacquer = ctx.createLinearGradient(0, COUNTER.y, 0, COUNTER.y + COUNTER.h);
		lacquer.addColorStop(0, 'rgba(255,255,255,0.5)');
		lacquer.addColorStop(0.46, 'rgba(255,255,255,0.06)');
		lacquer.addColorStop(1, 'rgba(192,118,60,0.26)');
		ctx.fillStyle = lacquer;
		ctx.fillRect(COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h);

		const warmReflect = ctx.createLinearGradient(382, 194, 512, 208);
		warmReflect.addColorStop(0, 'rgba(255,232,184,0.34)');
		warmReflect.addColorStop(0.55, 'rgba(255,232,184,0.1)');
		warmReflect.addColorStop(1, 'rgba(255,232,184,0)');
		ctx.fillStyle = warmReflect;
		ctx.fillRect(COUNTER.x + 6, 194, COUNTER.w - 12, 12);
		ctx.restore();

		ctx.save();
		ctx.clip(new Path2D(rectMask(COUNTER.x, 205, COUNTER.w, 3)));
		const lip = ctx.createLinearGradient(0, 205, 0, 208);
		lip.addColorStop(0, 'rgba(255,255,255,0.95)');
		lip.addColorStop(0.5, 'rgba(255,255,255,0.12)');
		lip.addColorStop(1, 'rgba(58,39,27,0.34)');
		ctx.fillStyle = lip;
		ctx.fillRect(COUNTER.x, 205, COUNTER.w, 3);
		ctx.restore();

		line(ctx, 358, 206.1, 528, 206.1, 'rgba(255,255,255,0.78)', 1.2);
		line(ctx, 366, 199, 520, 199, 'rgba(255,255,255,0.28)', 1.2);
		circle(ctx, 366, 210.5, 1.4, CHROME, 0.9);
		circle(ctx, 520, 210.5, 1.4, CHROME, 0.9);
		circle(ctx, 488.9, 187.6, 1.1, 'rgba(255,255,255,0.9)', 0.8);
	}
}

/** Menu board beside the hatch: framed cream board, chalk lines, a burger doodle and a sheen. */
function menuBoard(ctx: CanvasRenderingContext2D, fitted: boolean, finish: boolean): void {
	if (finish) {
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = TEAL_DEEP;
		ctx.fill(new Path2D(rectMask(MENU.x + 3, MENU.y + 4, MENU.w, MENU.h)));
		ctx.restore();
	}

	rect(ctx, MENU.x, MENU.y, MENU.w, MENU.h, TEAL_DARK, 4, 2.6);
	rect(ctx, MENU.x + 4, MENU.y + 4, MENU.w - 8, MENU.h - 8, CREAM, 2, 1.8);

	if (fitted) {
		// Chalk menu lines, kept as marks so the board reads without lettering.
		const items: Array<[number, number]> = [
			[MENU.y + 20, 18],
			[MENU.y + 28, 24],
			[MENU.y + 36, 16]
		];
		for (const [iy, iw] of items) {
			line(ctx, MENU.x + 8, iy, MENU.x + 8 + iw, iy, 'rgba(31,124,113,0.55)', 2);
			circle(ctx, MENU.x + MENU.w - 10, iy, 1.5, ORANGE_DEEP, 1);
		}

		// Small burger doodle and a star in the lower half of the board.
		shape(
			ctx,
			`M${MENU.x + 9},${MENU.y + 52} Q${MENU.x + 9},${MENU.y + 45} ${MENU.x + 16},${MENU.y + 45} L${
				MENU.x + 26
			},${MENU.y + 45} Q${MENU.x + 33},${MENU.y + 45} ${MENU.x + 33},${MENU.y + 52} Z`,
			BUN,
			1.2
		);
		line(
			ctx,
			MENU.x + 9,
			MENU.y + 53,
			MENU.x + 33,
			MENU.y + 53,
			PATTY,
			2.4
		);
		line(
			ctx,
			MENU.x + 10,
			MENU.y + 56,
			MENU.x + 32,
			MENU.y + 56,
			LETTUCE,
			1.6
		);
		shape(
			ctx,
			`M${MENU.x + 9},${MENU.y + 57} L${MENU.x + 33},${MENU.y + 57} Q${MENU.x + 31},${
				MENU.y + 62
			} ${MENU.x + 26},${MENU.y + 62} L${MENU.x + 16},${MENU.y + 62} Q${MENU.x + 11},${
				MENU.y + 62
			} ${MENU.x + 9},${MENU.y + 57} Z`,
			BUN,
			1.2
		);
		star(ctx, MENU.x + 46, MENU.y + 52, 5.6, AMBER);
	}

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(rectMask(MENU.x + 4, MENU.y + 4, MENU.w - 8, MENU.h - 8)));
		ctx.globalAlpha = 0.18;
		ctx.fillStyle = '#FFFFFF';
		ctx.beginPath();
		ctx.moveTo(MENU.x + 10, MENU.y + 56);
		ctx.lineTo(MENU.x + 38, MENU.y + 6);
		ctx.lineTo(MENU.x + 46, MENU.y + 6);
		ctx.lineTo(MENU.x + 18, MENU.y + 56);
		ctx.closePath();
		ctx.fill();

		// A second, tighter sheen catching the top-right corner of the laminate.
		ctx.globalAlpha = 0.11;
		ctx.beginPath();
		ctx.moveTo(MENU.x + 48, MENU.y + 6);
		ctx.lineTo(MENU.x + 60, MENU.y + 6);
		ctx.lineTo(MENU.x + 40, MENU.y + 58);
		ctx.lineTo(MENU.x + 28, MENU.y + 58);
		ctx.closePath();
		ctx.fill();

		// Chalk dust caught in the laminate.
		ctx.globalAlpha = 1;
		ctx.fillStyle = 'rgba(31,124,113,0.2)';
		for (const [dx, dy, dr] of [
			[MENU.x + 22, MENU.y + 22, 0.9],
			[MENU.x + 46, MENU.y + 31, 0.8],
			[MENU.x + 29, MENU.y + 42, 0.7],
			[MENU.x + 52, MENU.y + 49, 0.9]
		]) {
			ctx.beginPath();
			ctx.arc(dx, dy, dr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		line(ctx, MENU.x + 2, MENU.y + 2, MENU.x + MENU.w - 2, MENU.y + 2, 'rgba(255,255,255,0.5)', 1.4);
		line(ctx, MENU.x + 2, MENU.y + 2, MENU.x + 2, MENU.y + MENU.h - 2, 'rgba(255,255,255,0.34)', 1.2);
		line(
			ctx,
			MENU.x + 2,
			MENU.y + MENU.h - 2,
			MENU.x + MENU.w - 2,
			MENU.y + MENU.h - 2,
			'rgba(58,39,27,0.32)',
			1.4
		);
		for (const [sx, sy] of [
			[MENU.x + 7, MENU.y + 7],
			[MENU.x + MENU.w - 7, MENU.y + 7],
			[MENU.x + 7, MENU.y + MENU.h - 7],
			[MENU.x + MENU.w - 7, MENU.y + MENU.h - 7]
		]) {
			circle(ctx, sx, sy, 1.4, STEEL, 0.9);
			ctx.fillStyle = 'rgba(255,255,255,0.85)';
			ctx.beginPath();
			ctx.arc(sx - 0.5, sy - 0.6, 0.35, 0, Math.PI * 2);
			ctx.fill();
		}

		// Pinpoint catchlight on the gold star and a soft glow along the top frame.
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.beginPath();
		ctx.arc(MENU.x + 44.6, MENU.y + 49.6, 1.1, 0, Math.PI * 2);
		ctx.fill();
		line(ctx, MENU.x + 6, MENU.y + 3.4, MENU.x + MENU.w - 6, MENU.y + 3.4, 'rgba(255,255,255,0.24)', 1.1);
	}
}

/** Scalloped awning: alternating orange and cream stripes clipped to one outline. */
function awning(ctx: CanvasRenderingContext2D, shaded: boolean, finish: boolean): void {
	const x0 = 344;
	const x1 = 542;
	const top = 124;
	const base = 146;
	const n = 8;
	const w = (x1 - x0) / n;

	ctx.save();
	ctx.clip(new Path2D(AWNING));
	for (let i = 0; i < n; i++) {
		ctx.fillStyle = i % 2 === 0 ? ORANGE : CREAM;
		ctx.fillRect(x0 + i * w, top - 2, w + 0.6, 43);
	}
	if (shaded) {
		const light = ctx.createLinearGradient(0, top, 0, 160);
		light.addColorStop(0, 'rgba(255,255,255,0.34)');
		light.addColorStop(0.5, 'rgba(255,255,255,0.03)');
		light.addColorStop(1, 'rgba(58,39,27,0.24)');
		ctx.fillStyle = light;
		ctx.fillRect(x0 - 2, top - 2, x1 - x0 + 4, 46);
	}
	if (finish) {
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 1.2;
		for (let i = 1; i < n; i++) {
			ctx.beginPath();
			ctx.moveTo(x0 + i * w, top);
			ctx.lineTo(x0 + i * w, base);
			ctx.stroke();
		}

		const sheen = ctx.createLinearGradient(x0, top, x0 + 120, base + 12);
		sheen.addColorStop(0, 'rgba(255,255,255,0.32)');
		sheen.addColorStop(0.46, 'rgba(255,255,255,0.02)');
		sheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = sheen;
		ctx.fillRect(x0, top, x1 - x0, 43);

		// A second sweep answers it from the rear edge, so the fabric reads glossy
		// from both sides of the hatch.
		const rearSheen = ctx.createLinearGradient(x1 - 150, top, x1, base + 8);
		rearSheen.addColorStop(0, 'rgba(255,255,255,0)');
		rearSheen.addColorStop(0.55, 'rgba(255,255,255,0.22)');
		rearSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = rearSheen;
		ctx.fillRect(x0, top, x1 - x0, 43);

		// Glossy roll where the fabric meets the mounting rail.
		const roll = ctx.createLinearGradient(0, top, 0, top + 7);
		roll.addColorStop(0, 'rgba(255,255,255,0.52)');
		roll.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = roll;
		ctx.fillRect(x0, top, x1 - x0, 7);
	}
	ctx.restore();

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(AWNING));

		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		for (let i = 0; i < n; i++) {
			const a = x0 + i * w;
			ctx.moveTo(a + 1, base - 2.6);
			ctx.quadraticCurveTo(a + w / 2, base + 9.8, a + w - 1, base - 2.6);
		}
		ctx.stroke();

		ctx.strokeStyle = 'rgba(58,39,27,0.18)';
		ctx.lineWidth = 2;
		for (let i = 0; i < n; i++) {
			const a = x0 + i * w;
			ctx.beginPath();
			ctx.moveTo(a + 1.6, base + 0.4);
			ctx.quadraticCurveTo(a + w / 2, base + 11.2, a + w - 1.6, base + 0.4);
			ctx.stroke();
		}

		// A pip of light on the crest of every scallop.
		ctx.fillStyle = 'rgba(255,255,255,0.78)';
		for (let i = 0; i < n; i++) {
			ctx.beginPath();
			ctx.arc(x0 + i * w + w / 2, base + 5.4, 1, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Soft shadow the awning drops onto the hatch lip and flank below.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = ORANGE_DEEP;
		ctx.beginPath();
		ctx.ellipse((x0 + x1) / 2, 164, (x1 - x0) / 2 - 6, 6.5, 0, 0, Math.PI);
		ctx.fill();
		ctx.restore();
	}

	// Mounting rail across the roof line above the hatch.
	rect(ctx, 338, 120, 210, 5, CHROME, 2, 2);
	line(ctx, 342, 121.4, 544, 121.4, 'rgba(255,255,255,0.7)', 1.2);

	if (finish) {
		for (let rx = 348; rx <= 538; rx += 14) {
			circle(ctx, rx, 122.6, 1.3, STEEL, 0.9);
		}
	}

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6;
	ctx.stroke(new Path2D(AWNING));
}

/** Rooftop sign: burger over a patty and a gold star on a teal board, no lettering. */
function roofSign(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean, finish: boolean): void {
	// Chrome feet under the board, sitting on the teal roof cap.
	rect(ctx, SIGN_FOOT_L.x, SIGN_FOOT_L.y, SIGN_FOOT_L.w, SIGN_FOOT_L.h, CHROME, 2, 1.8);
	rect(ctx, SIGN_FOOT_R.x, SIGN_FOOT_R.y, SIGN_FOOT_R.w, SIGN_FOOT_R.h, CHROME, 2, 1.8);

	shape(ctx, SIGN, TEAL, 2.8);

	// Cream face with a narrow teal margin.
	rect(ctx, SIGN_FACE.x, SIGN_FACE.y, SIGN_FACE.w, SIGN_FACE.h, CREAM, 4, 2);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SIGN));
		const face = ctx.createLinearGradient(0, 44, 0, 94);
		face.addColorStop(0, 'rgba(255,255,255,0.4)');
		face.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		face.addColorStop(1, 'rgba(20,92,84,0.24)');
		ctx.fillStyle = face;
		ctx.fillRect(288, 44, 140, 50);
		ctx.restore();
	}

	// Burger emblem: sesame bun, cheese, patty, lettuce, heel bun.
	shape(
		ctx,
		'M330,68 Q330,55 348,55 L368,55 Q386,55 386,68 Z',
		BUN,
		1.8
	);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	for (const [sx, sy] of [
		[342, 62],
		[356, 59],
		[370, 62],
		[350, 66],
		[364, 66]
	]) {
		ctx.beginPath();
		ctx.arc(sx, sy, 1.1, 0, Math.PI * 2);
		ctx.fill();
	}

	// Cheese corner peeking out under the bun.
	shape(ctx, 'M330,68 L344,68 L338,73 Z M372,68 L386,68 L378,73 Z', CHEESE, 1.2);
	rect(ctx, 329, 70, 58, 6, PATTY, 3, 1.6);
	line(ctx, 330, 76.5, 386, 76.5, LETTUCE, 2.2);
	shape(ctx, 'M330,78 L386,78 Q386,88 372,88 L344,88 Q330,88 330,78 Z', BUN, 1.6);

	if (fitted) {
		star(ctx, 404, 60, 8.4, AMBER);
		star(ctx, 404, 60, 3.6, '#FFF0B8');
		line(ctx, 334, 84, 348, 84, 'rgba(255,255,255,0.45)', 1.2);
	}

	if (finish) {
		// Printed face gloss raking across the cream board.
		ctx.save();
		ctx.clip(new Path2D(rectMask(SIGN_FACE.x, SIGN_FACE.y, SIGN_FACE.w, SIGN_FACE.h)));
		const faceSheen = ctx.createLinearGradient(300, 88, 400, 50);
		faceSheen.addColorStop(0, 'rgba(255,255,255,0)');
		faceSheen.addColorStop(0.5, 'rgba(255,255,255,0.24)');
		faceSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = faceSheen;
		ctx.fillRect(SIGN_FACE.x, SIGN_FACE.y, SIGN_FACE.w, SIGN_FACE.h);
		ctx.restore();

		// Bright bevel just inside the ink, top lit and bottom shaded.
		ctx.save();
		ctx.clip(new Path2D(SIGN));
		line(ctx, 292, 47.4, 424, 47.4, 'rgba(255,255,255,0.46)', 1.6);
		line(ctx, 292, 90.4, 424, 90.4, 'rgba(58,39,27,0.2)', 1.6);
		ctx.restore();

		// Gloss on the bun and a tight specular on the star.
		ctx.save();
		ctx.beginPath();
		ctx.ellipse(350, 61, 12, 4.4, -0.25, 0, Math.PI * 2);
		ctx.clip();
		ctx.fillStyle = 'rgba(255,255,255,0.5)';
		ctx.fillRect(336, 54, 30, 14);
		ctx.restore();
		line(ctx, 333, 71, 383, 71, 'rgba(255,255,255,0.28)', 1.2);

		// Tight catchlight on the gold star, kept clear of the ink outline.
		ctx.strokeStyle = 'rgba(255,255,255,0.92)';
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(400.4, 55.2);
		ctx.lineTo(403.6, 58.4);
		ctx.stroke();
		ctx.fillStyle = 'rgba(255,255,255,0.95)';
		ctx.beginPath();
		ctx.arc(402, 56.8, 1.1, 0, Math.PI * 2);
		ctx.fill();

		line(ctx, 292, 92, 424, 92, 'rgba(255,255,255,0.34)', 1.4);
		circle(ctx, 306, 90, 1.5, STEEL, 0.9);
		circle(ctx, 420, 90, 1.5, STEEL, 0.9);

		// The board settles onto the teal roof band with a soft contact shadow.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = TEAL_DEEP;
		ctx.beginPath();
		ctx.ellipse(358, 97.6, 78, 3.6, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

export function drawRealFoodTruckLevel(
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
		ctx.ellipse(360, 279, 334, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis block under the box, inside the underbody strip.
	ctx.fillStyle = '#6F7987';
	ctx.fillRect(UNDERBODY.x, UNDERBODY.y, UNDERBODY.w, UNDERBODY.h);
	ctx.fillStyle = '#8C96A4';
	ctx.fillRect(UNDERBODY.x, UNDERBODY.y, UNDERBODY.w, 2);
	ctx.fillStyle = '#555D6A';
	ctx.fillRect(UNDERBODY.x, UNDERBODY.y + UNDERBODY.h - 2, UNDERBODY.w, 2);

	// Shell.
	shape(ctx, SHELL, ORANGE);

	// Paint: light roof falling into a deep orange lower body, clipped to the silhouette.
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const paint = ctx.createLinearGradient(0, 92, 0, 258);
		paint.addColorStop(0, 'rgba(255,255,255,0.56)');
		paint.addColorStop(0.22, 'rgba(255,255,255,0.12)');
		paint.addColorStop(0.64, 'rgba(192,118,60,0.06)');
		paint.addColorStop(1, 'rgba(192,118,60,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(30, 92, 662, 166);
		ctx.restore();
	}

	// Livery bands and panel seams, clipped so they follow the shell edge.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.fillStyle = TEAL;
	ctx.fillRect(158, 94, 516, 8);
	ctx.fillStyle = 'rgba(255,255,255,0.24)';
	ctx.fillRect(158, 95.6, 516, 1.6);
	ctx.fillStyle = TEAL;
	ctx.fillRect(36, 220, 652, 11);
	ctx.fillStyle = 'rgba(255,255,255,0.24)';
	ctx.fillRect(38, 221.4, 648, 1.4);
	ctx.fillStyle = TEAL;
	ctx.fillRect(36, 244, 652, 14);
	ctx.fillStyle = 'rgba(255,255,255,0.24)';
	ctx.fillRect(38, 245.4, 648, 1.4);

	// Waist creases and vertical panel joints; fittings paint over the ones they cross.
	line(ctx, 200, 104, 200, 244, 'rgba(192,118,60,0.22)', 1.8);
	line(ctx, 201.6, 106, 201.6, 242, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, 660, 104, 660, 244, 'rgba(192,118,60,0.22)', 1.8);
	line(ctx, 661.6, 106, 661.6, 242, 'rgba(255,255,255,0.4)', 1.2);
	ctx.restore();

	// Silhouette re-stroke so the opaque bands keep a crisp edge.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Chrome pinstripes flanking the waist band.
	line(ctx, 156, 220, 688, 220, CHROME, 1.6);
	line(ctx, 156, 231, 688, 231, CHROME, 1.6);

	sideDoor(ctx, shaded, fitted);
	servingHatch(ctx, shaded, fitted, lit, finish);
	counter(ctx, shaded, fitted, finish);
	menuBoard(ctx, fitted, finish);

	// Wordmark below the counter, on the orange between the teal bands.
	ctx.fillStyle = CREAM;
	ctx.font = '700 15px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('FOOD TRUCK', 443, 242);
	ctx.textAlign = 'left';

	awning(ctx, shaded, finish);

	// The naming cue, standing proud of the roof.
	roofSign(ctx, shaded, fitted, finish);

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 96, 114, 62, 62);
		glassShade(ctx, SIDE_GLASS, 166, 116, 54, 46);
	}

	if (fitted) {
		// Screen wiper and a chrome bonnet crease.
		line(ctx, 108, 164, 128, 140, INK, 2);
		line(ctx, 54, 192, 82, 184, 'rgba(255,255,255,0.5)', 1.6);

		// Nose: louvred grille, indicator and headlamp.
		rect(ctx, 40, 198, 12, 26, TEAL_DEEP, 2, 2);
		for (let bar = 0; bar < 3; bar++) {
			line(ctx, 41.5, 204 + bar * 6, 50.5, 204 + bar * 6, CHROME, 1.6);
		}
		circle(ctx, 54, 216, 3.6, AMBER, 1.8);
		circle(ctx, 54, 234, 8.5, LAMP, 2.4);
		circle(ctx, 54, 234, 4.4, '#FFF7CF', 1.5);

		// Rear lamps, handle and plate on the tail of the flank.
		rect(ctx, 666, 212, 14, 18, RED, 2, 1.8);
		rect(ctx, 666, 234, 14, 10, AMBER, 1.5, 1.5);
		rect(ctx, 668, 158, 8, 5, CHROME, 2, 1.6);
		rect(ctx, 612, 238, 30, 13, CREAM, 1.5, 1.7);
		ctx.fillStyle = TEAL;
		ctx.fillRect(615, 241, 4, 7);
		ctx.fillStyle = INK;
		ctx.fillRect(622, 242, 15, 2);
		ctx.fillRect(622, 246, 10, 2);
	}

	// Bumpers: chrome blocks butted to the nose and tail, both inside the body mask.
	rect(ctx, BUMPER_FRONT.x, BUMPER_FRONT.y, BUMPER_FRONT.w, BUMPER_FRONT.h, CHROME, 3, 2.6);
	line(ctx, 24, 240, 34, 240, 'rgba(255,255,255,0.62)', 1.6);
	line(ctx, 24, 252, 34, 252, 'rgba(58,39,27,0.28)', 1.6);
	rect(ctx, BUMPER_REAR.x, BUMPER_REAR.y, BUMPER_REAR.w, BUMPER_REAR.h, CHROME, 2, 2.6);
	line(ctx, 691, 250, 699, 250, 'rgba(255,255,255,0.55)', 1.4);

	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: roof line, nose and rear corner.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(162, 95.5);
		ctx.lineTo(670, 95.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(37.5, 202);
		ctx.lineTo(37.5, 242);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(686.5, 112);
		ctx.lineTo(686.5, 240);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(292, 45.5);
		ctx.lineTo(420, 45.5);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(54, 234, 1, 54, 234, 32);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(54, 234, 32, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 272, 31, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain over the body mask only: glazing, hatch, awning, counter, menu and tyres
		// are punched out so they stay clear.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${HATCH} ${AWNING} ${WHEEL_MASK} ${circleMask(
			WHEEL_R.x,
			WHEEL_R.y,
			WHEEL_R.r
		)} ${rectMask(MENU.x - 2, MENU.y - 2, MENU.w + 4, MENU.h + 4)} ${rectMask(
			COUNTER.x - 2,
			COUNTER.y - 2,
			COUNTER.w + 4,
			COUNTER.h + 4
		)} ${rectMask(SIGN_FACE.x, SIGN_FACE.y, SIGN_FACE.w, SIGN_FACE.h)}`;
		ctx.clip(new Path2D(BODY_MASK), 'evenodd');
		ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');
		let seed = 61;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 460; i++) {
			const px = 30 + rand() * 662;
			const py = 90 + rand() * 160;
			const size = 1.4 + rand() * 1.1;
			ctx.globalAlpha = 0.07 + rand() * 0.04;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 160; i++) {
			const px = 30 + rand() * 662;
			const py = 90 + rand() * 160;
			const size = 1.2 + rand() * 0.9;
			ctx.globalAlpha = 0.13 + rand() * 0.06;
			ctx.fillRect(px, py, size, size);
		}

		ctx.fillStyle = INK;
		for (let i = 0; i < 360; i++) {
			const px = 30 + rand() * 662;
			const py = 90 + rand() * 160;
			const size = 0.8 + rand() * 0.7;
			ctx.globalAlpha = 0.04 + rand() * 0.035;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 180; i++) {
			const px = 30 + rand() * 662;
			const py = 90 + rand() * 160;
			const size = 0.7 + rand() * 0.6;
			ctx.globalAlpha = 0.08 + rand() * 0.05;
			ctx.fillRect(px, py, size, size);
		}

		// Burnished tooth: one last fine pass so the paint never reads as a flat fill.
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 260; i++) {
			const px = 30 + rand() * 662;
			const py = 90 + rand() * 160;
			const size = 0.6 + rand() * 0.5;
			ctx.globalAlpha = 0.05 + rand() * 0.04;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes across the flanks.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[52, 156, 84, 150],
			[208, 126, 286, 124],
			[548, 128, 646, 126],
			[208, 214, 280, 212],
			[560, 200, 648, 198]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
			ctx.stroke();
		}

		// Short vertical strokes where the brush turned on the panels.
		ctx.globalAlpha = 0.075;
		ctx.lineWidth = 1.2;
		for (const [hx, hy, hh] of [
			[226, 160, 32],
			[574, 170, 28],
			[620, 196, 20],
			[210, 228, 12],
			[560, 236, 12]
		]) {
			ctx.beginPath();
			ctx.moveTo(hx, hy);
			ctx.quadraticCurveTo(hx + 1.6, hy + hh / 2, hx, hy + hh);
			ctx.stroke();
		}

		// Thin paint drags pulled along the panel as the brush lifted.
		ctx.globalAlpha = 0.05;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 1.1;
		for (const [sx, sy, ex, ey] of [
			[64, 142, 150, 138],
			[268, 108, 352, 106],
			[560, 106, 648, 108],
			[300, 216, 360, 214],
			[552, 214, 648, 212],
			[76, 184, 128, 182]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Roof sheen and the crisp cream swipe along the flank.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const roofSheen = ctx.createLinearGradient(0, 94, 0, 140);
		roofSheen.addColorStop(0, 'rgba(255,255,255,0.34)');
		roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = roofSheen;
		ctx.fillRect(158, 94, 516, 46);
		ctx.globalAlpha = 0.3;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(210, 238);
		ctx.quadraticCurveTo(430, 235, 660, 238);
		ctx.stroke();
		ctx.restore();

		// Glints on paint and chrome, clipped so no sparkle pokes off the silhouette.
		ctx.save();
		ctx.clip(new Path2D(BODY_MASK));
		glint(ctx, 214, 132, 5.2);
		glint(ctx, 638, 130, 4.6);
		glint(ctx, 336, 238, 4);
		glint(ctx, 500, 238, 3.6);
		glint(ctx, 164, 98, 4.2);
		glint(ctx, 676, 188, 3.4);
		glint(ctx, 262, 138, 3.6);
		glint(ctx, 606, 240, 3.2);

		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		for (const [sx, sy] of [
			[522, 194.2],
			[534, 207.2],
			[697, 252.6],
			[308, 90.4],
			[404.6, 178.4],
			[488.6, 178.4],
			[474.4, 196.2],
			[354.6, 196.2]
		]) {
			ctx.beginPath();
			ctx.arc(sx, sy, 0.9, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Glass sheen.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(104, 162);
		ctx.lineTo(124, 134);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(174, 156);
		ctx.lineTo(186, 122);
		ctx.stroke();
		ctx.restore();

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Dashed stitch under the awning rail, roof-band rivets and body highlights.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 1.4;
		for (let sx = 348; sx < 540; sx += 9) {
			ctx.beginPath();
			ctx.moveTo(sx, 131);
			ctx.lineTo(Math.min(sx + 5, 540), 131);
			ctx.stroke();
		}
		ctx.fillStyle = CHROME;
		ctx.globalAlpha = 0.7;
		for (let rivetX = 172; rivetX <= 664; rivetX += 30) {
			if (rivetX > 284 && rivetX < 432) continue;
			ctx.beginPath();
			ctx.arc(rivetX, 96.6, 1.4, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
		line(ctx, 360, 194.6, 526, 194.6, 'rgba(255,255,255,0.65)', 1.4);
		line(ctx, 300, 250, 620, 250, 'rgba(255,255,255,0.18)', 1.4);
	}

	ctx.restore();
}

export function drawRealFoodTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealFoodTruckLevel(ctx, x, y, scale, 5);
}
