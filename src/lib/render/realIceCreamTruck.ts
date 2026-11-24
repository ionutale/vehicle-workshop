/**
 * Ice-cream truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A boxy pink serving truck facing left: a stubby cab, a raked screen, a long roof carrying a
 * giant waffle cone, a wide serving hatch under a yellow-and-cream striped scalloped awning,
 * a chrome counter, a menu board on the rear flank, a beacon over the cab and lamps front and
 * rear. The striped awning and the rooftop cone are the cues that name the vehicle.
 *
 * Art box 620 x 330, road at 288, wheels (150, 258) and (480, 258) with r30. Front faces left.
 * Level 4 is the production target: shaded, fully fitted and lit. Level 5 adds the picture-book
 * finish: paint grain, awning and hatch sheen, glints, hub hardware and an exhaust puff.
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

const PINK = '#F7C8E0';
const PINK_LIGHT = '#FDEBF4';
const PINK_SHADE = '#EBB0CD';
const PINK_DEEP = '#D68FB3';
const YELLOW = '#F9C74F';
const YELLOW_LIGHT = '#FFDE87';
const YELLOW_DEEP = '#D8A42C';
const CREAM = '#FFF9EC';
const BERRY = '#8E4F68';
const BERRY_DARK = '#68374B';
const WAFFLE = '#E0A96D';
const WAFFLE_DARK = '#B87C46';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/** One outline for cab and body: stubby nose, raked screen, long roof, rounded rear corner. */
const SHELL =
	'M30,276 L30,206 Q30,196 40,192 L74,184 L100,146 Q104,136 114,136 L566,136 Q582,136 582,150 L582,262 Q582,276 566,276 Z';

/** Rooftop ornament: waffle cone under a three-bulge whipped swirl, as one cut-out. */
const CONE =
	'M349,136 L323,96 Q311,92 320,82 Q311,72 321,62 Q316,50 330,48 Q337,37 349,41 Q362,37 369,48 Q383,50 378,62 Q388,72 379,82 Q388,92 375,96 Z';

/** Amber beacon bump on the roof, bottom edge flush with the roof line. */
const BEACON = 'M118,136 L118,130 Q118,120 128,120 Q138,120 138,130 L138,136 Z';

/** Body-mask fittings that only touch the shell: bumpers and the underbody sill. */
const BUMPER_FRONT = { x: 16, y: 248, w: 14, h: 28 };
const BUMPER_REAR = { x: 582, y: 254, w: 14, h: 16 };
const UNDERBODY = { x: 210, y: 276, w: 220, h: 6 };

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Raked windscreen band with the A-pillar, plus the cab side pane. */
const WINDSCREEN = 'M84,196 L118,146 L142,152 L106,202 Z';
const SIDE_GLASS = pane(152, 143, 52, 39, 6);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Cab door: a clean inset leaf, clear of both panes and of the serving hatch. */
const DOOR = { x: 144, y: 186, w: 68, h: 82 };
const DOOR_MASK = rectMask(DOOR.x, DOOR.y, DOOR.w, DOOR.h);

/** Serving hatch opening under the awning, deep enough to stock two shelves. */
const HATCH = 'M240,220 L240,200 Q240,186 254,186 L414,186 Q428,186 428,200 L428,220 Z';
const HATCH_MASK = rectMask(226, 148, 216, 100);
const COUNTER = { x: 232, y: 221, w: 204, h: 16 };

/** Menu board on the rear flank, clear of the hatch and of the rear wheel arch. */
const MENU = { x: 512, y: 150, w: 50, h: 58 };

/** Striped awning with eight scallops along its lower edge. */
const AWNING_EDGE = { x0: 232, x1: 436, top: 154, base: 172, n: 8 };
const AWNING = (() => {
	const { x0, x1, top, base, n } = AWNING_EDGE;
	const w = (x1 - x0) / n;
	let d = `M${x0},${top} L${x1},${top} L${x1},${base}`;
	for (let i = n - 1; i >= 0; i--) {
		const a = x0 + i * w;
		d += ` Q${a + w / 2},${base + 13} ${a},${base}`;
	}
	return `${d} Z`;
})();

/** Both wheels are the same piece; the body never masks them. */
const WHEEL_L = { x: 150, y: 258, r: 30 };
const WHEEL_R = { x: 480, y: 258, r: 30 };
const WHEEL_MASK_L = circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
const WHEEL_MASK_R = circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

/** Body mask: shell plus cone, beacon, bumpers and sill. Subpaths never overlap. */
const BODY_MASK = `${SHELL} ${CONE} ${BEACON} ${rectMask(
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
	ctx.arc(cx, cy, r + 9, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = YELLOW;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.4)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5.4, Math.PI * 1.12, Math.PI * 1.88);
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

/**
 * Picture-book hub: polished cap, bright rim ring, six bolt heads with their own highlights,
 * an axle shadow and mirrored rim arcs. Every mark is symmetric about the vertical axis, so
 * the flipped rear wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
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

	ctx.fillStyle = 'rgba(43,45,66,0.28)';
	ctx.beginPath();
	ctx.arc(x, y, r * 0.37, Math.PI * 0.16, Math.PI * 0.84);
	ctx.arc(x, y, r * 0.16, Math.PI * 0.84, Math.PI * 0.16, true);
	ctx.closePath();
	ctx.fill();

	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.28;
		const by = y + Math.sin(a) * r * 0.28;
		circle(ctx, bx, by, 2.2, CHROME, 1.1);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx, by - 0.8, 0.8, 0, Math.PI * 2);
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
	circle(ctx, x, y - r * 0.55, 2, CHROME, 1.1);
}

/** The cab door: inset leaf, hinges, chrome handle and a little painted cone badge. */
function cabDoor(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, PINK_SHADE, 3, 2.6);
	rect(ctx, DOOR.x + 5, DOOR.y + 5, DOOR.w - 10, DOOR.h - 10, PINK, 2, 1.8);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(DOOR_MASK));
		const shade = ctx.createLinearGradient(DOOR.x, DOOR.y, DOOR.x, DOOR.y + DOOR.h);
		shade.addColorStop(0, 'rgba(255,255,255,0.44)');
		shade.addColorStop(0.5, 'rgba(255,255,255,0.06)');
		shade.addColorStop(1, 'rgba(214,143,179,0.2)');
		ctx.fillStyle = shade;
		ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
		ctx.strokeStyle = YELLOW;
		ctx.lineWidth = 8;
		ctx.beginPath();
		ctx.moveTo(DOOR.x, 254);
		ctx.lineTo(DOOR.x + DOOR.w, 254);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(DOOR.x, 250.6);
		ctx.lineTo(DOOR.x + DOOR.w, 250.6);
		ctx.stroke();
		ctx.restore();
	}

	line(ctx, DOOR.x + 6, DOOR.y + 9, DOOR.x + DOOR.w - 6, DOOR.y + 9, 'rgba(214,143,179,0.22)', 1.4);

	if (fitted) {
		for (const hy of [DOOR.y + 14, DOOR.y + 54]) {
			rect(ctx, DOOR.x + 1, hy, 6, 11, STEEL, 1.5, 1.4);
			circle(ctx, DOOR.x + 4, hy + 5.5, 1.1, CHROME, 0.8);
		}
		rect(ctx, DOOR.x + DOOR.w - 16, 202, 11, 5, CHROME, 2.2, 1.8);
	}

	// Little painted cone badge, high on the leaf so it clears the front wheel.
	shape(ctx, `M${DOOR.x + 27},${DOOR.y + 36} L${DOOR.x + 41},${DOOR.y + 36} L${DOOR.x + 34},${DOOR.y + 22} Z`, WAFFLE, 1.2);
	circle(ctx, DOOR.x + 34, DOOR.y + 20.4, 4, PINK, 1.2);
	if (fitted) {
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(DOOR.x + 32.8, DOOR.y + 19, 1, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** Wide serving hatch: dark recess, stocked shelves and a warm glow at night. */
function servingHatch(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	ctx.save();
	ctx.clip(new Path2D(HATCH));
	ctx.fillStyle = BERRY_DARK;
	ctx.fillRect(238, 182, 192, 40);

	if (shaded) {
		const depth = ctx.createLinearGradient(0, 184, 0, 222);
		depth.addColorStop(0, 'rgba(35,12,22,0.5)');
		depth.addColorStop(0.45, 'rgba(35,12,22,0.06)');
		depth.addColorStop(1, 'rgba(255,226,178,0.2)');
		ctx.fillStyle = depth;
		ctx.fillRect(238, 182, 192, 40);
	}

	if (lit) {
		const glow = ctx.createRadialGradient(334, 210, 4, 334, 210, 90);
		glow.addColorStop(0, 'rgba(255,214,150,0.46)');
		glow.addColorStop(1, 'rgba(255,214,150,0)');
		ctx.fillStyle = glow;
		ctx.fillRect(238, 182, 192, 40);
	}

	if (fitted) {
		// Stocked tubs on the upper shelf.
		const tubs = [PINK, CREAM, YELLOW, PINK_LIGHT];
		for (let i = 0; i < 7; i++) {
			const tx = 250 + i * 24;
			rect(ctx, tx, 192, 18, 12, tubs[i % 4], 2, 1.5);
			line(ctx, tx + 2, 195, tx + 16, 195, 'rgba(255,255,255,0.5)', 1.2);
		}
		line(ctx, 244, 205, 424, 205, CHROME, 2.4);
		line(ctx, 244, 206.4, 424, 206.4, 'rgba(255,255,255,0.5)', 1);

		// Cone sleeves racked on the counter shelf.
		rect(ctx, 252, 217, 96, 3.4, CHROME, 1.5, 1.3);
		for (let i = 0; i < 5; i++) {
			const cx = 264 + i * 19;
			shape(ctx, `M${cx - 6.5},217 L${cx + 6.5},217 L${cx},204 Z`, WAFFLE, 1.3);
			line(ctx, cx - 3.6, 214, cx + 2.4, 208, 'rgba(120,72,35,0.45)', 1);
		}

		// Price card propped beside the rack.
		rect(ctx, 368, 203, 34, 13, CREAM, 1.5, 1.2);
		line(ctx, 372, 207, 396, 207, 'rgba(142,79,104,0.55)', 1.2);
		line(ctx, 372, 211, 390, 211, 'rgba(142,79,104,0.4)', 1.2);
	}

	if (finish) {
		const warm = ctx.createLinearGradient(0, 206, 0, 222);
		warm.addColorStop(0, 'rgba(255,226,178,0.34)');
		warm.addColorStop(1, 'rgba(255,226,178,0)');
		ctx.fillStyle = warm;
		ctx.fillRect(238, 206, 192, 16);

		ctx.fillStyle = 'rgba(255,255,255,0.82)';
		for (const [sx, sy] of [
			[252, 205.6],
			[300, 205.6],
			[348, 205.6],
			[396, 205.6],
			[262, 217.2],
			[358, 217.2]
		]) {
			ctx.beginPath();
			ctx.arc(sx, sy, 1.1, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	ctx.restore();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke(new Path2D(HATCH));
}

/** Chrome-lipped serving counter with brackets, a service bell and a lacquered top. */
function counter(ctx: CanvasRenderingContext2D, fitted: boolean, finish: boolean): void {
	rect(ctx, COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h, CREAM, 3, 2.6);

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(rectMask(COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h)));
		const face = ctx.createLinearGradient(0, COUNTER.y, 0, COUNTER.y + COUNTER.h);
		face.addColorStop(0, 'rgba(255,255,255,0.6)');
		face.addColorStop(0.44, 'rgba(255,255,255,0.06)');
		face.addColorStop(1, 'rgba(214,143,179,0.26)');
		ctx.fillStyle = face;
		ctx.fillRect(COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h);

		const reflect = ctx.createLinearGradient(COUNTER.x + 8, COUNTER.y + 1, COUNTER.x + 110, COUNTER.y + 16);
		reflect.addColorStop(0, 'rgba(255,238,205,0.42)');
		reflect.addColorStop(1, 'rgba(255,238,205,0)');
		ctx.fillStyle = reflect;
		ctx.fillRect(COUNTER.x + 8, COUNTER.y + 1, 102, 15);
		ctx.restore();
	}

	if (fitted) {
		rect(ctx, COUNTER.x + 2, COUNTER.y + COUNTER.h - 4, COUNTER.w - 4, 3.4, CHROME, 1.5, 0);
		line(ctx, COUNTER.x + 4, COUNTER.y + 3, COUNTER.x + COUNTER.w - 4, COUNTER.y + 3, 'rgba(255,255,255,0.72)', 1.5);
		rect(ctx, 234, 237, 7, 10, STEEL, 2, 1.4);
		rect(ctx, 426, 237, 7, 10, STEEL, 2, 1.4);
		line(ctx, 235.6, 238.6, 239.4, 238.6, 'rgba(255,255,255,0.55)', 1);
		line(ctx, 427.6, 238.6, 431.4, 238.6, 'rgba(255,255,255,0.55)', 1);
		circle(ctx, 408, 216, 4.4, CHROME, 1.6);
		circle(ctx, 408, 212.6, 1.5, STEEL, 1);
	}

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(rectMask(COUNTER.x + 2, COUNTER.y + COUNTER.h - 4, COUNTER.w - 4, 3.4)));
		const lip = ctx.createLinearGradient(0, COUNTER.y + COUNTER.h - 4, 0, COUNTER.y + COUNTER.h);
		lip.addColorStop(0, 'rgba(255,255,255,0.95)');
		lip.addColorStop(0.5, 'rgba(255,255,255,0.12)');
		lip.addColorStop(1, 'rgba(58,39,27,0.34)');
		ctx.fillStyle = lip;
		ctx.fillRect(COUNTER.x, COUNTER.y + COUNTER.h - 4, COUNTER.w, 4);
		ctx.restore();

		line(ctx, COUNTER.x + 4, COUNTER.y + 5.4, COUNTER.x + COUNTER.w - 4, COUNTER.y + 5.4, 'rgba(255,255,255,0.78)', 1.2);
		circle(ctx, 406.9, 214.6, 1.2, 'rgba(255,255,255,0.9)', 0.8);
		circle(ctx, 242.5, 240.5, 1.4, CHROME, 0.9);
		circle(ctx, 426.5, 240.5, 1.4, CHROME, 0.9);
	}
}

/** Menu board: yellow frame, cream face, price lines, a cone doodle and a laminate sheen. */
function menuBoard(ctx: CanvasRenderingContext2D, fitted: boolean, finish: boolean): void {
	if (finish) {
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = BERRY_DARK;
		ctx.fill(new Path2D(rectMask(MENU.x + 3, MENU.y + 4, MENU.w, MENU.h)));
		ctx.restore();
	}

	rect(ctx, MENU.x, MENU.y, MENU.w, MENU.h, YELLOW_DEEP, 4, 2.6);
	rect(ctx, MENU.x + 4, MENU.y + 4, MENU.w - 8, MENU.h - 8, CREAM, 2, 1.8);

	if (fitted) {
		ctx.fillStyle = BERRY;
		ctx.font = '700 9px ui-rounded, system-ui, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('MENU', MENU.x + MENU.w / 2, MENU.y + 16);

		const items: Array<[number, number]> = [
			[MENU.y + 26, 16],
			[MENU.y + 34, 20],
			[MENU.y + 42, 13]
		];
		for (const [iy, iw] of items) {
			line(ctx, MENU.x + 7, iy, MENU.x + 7 + iw, iy, 'rgba(142,79,104,0.55)', 1.8);
			circle(ctx, MENU.x + MENU.w - 9, iy, 1.5, YELLOW_DEEP, 1);
		}

		// Cone doodle in the bottom corner.
		shape(
			ctx,
			`M${MENU.x + 10},${MENU.y + 53} L${MENU.x + 21},${MENU.y + 53} L${MENU.x + 15.5},${MENU.y + 44} Z`,
			WAFFLE,
			1.2
		);
		circle(ctx, MENU.x + 15.5, MENU.y + 42.6, 3.2, PINK, 1.2);
	}

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(rectMask(MENU.x + 4, MENU.y + 4, MENU.w - 8, MENU.h - 8)));
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = '#FFFFFF';
		ctx.beginPath();
		ctx.moveTo(MENU.x + 10, MENU.y + 52);
		ctx.lineTo(MENU.x + 34, MENU.y + 6);
		ctx.lineTo(MENU.x + 41, MENU.y + 6);
		ctx.lineTo(MENU.x + 17, MENU.y + 52);
		ctx.closePath();
		ctx.fill();
		ctx.globalAlpha = 1;

		ctx.fillStyle = 'rgba(142,79,104,0.18)';
		for (const [dx, dy, dr] of [
			[MENU.x + 22, MENU.y + 22, 0.9],
			[MENU.x + 40, MENU.y + 31, 0.8],
			[MENU.x + 28, MENU.y + 40, 0.7],
			[MENU.x + 44, MENU.y + 48, 0.9]
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
		}
	}

	ctx.textAlign = 'left';
}

/** Scalloped awning: alternating yellow and cream stripes clipped to one outline. */
function awning(ctx: CanvasRenderingContext2D, shaded: boolean, finish: boolean): void {
	const { x0, x1, top, base, n } = AWNING_EDGE;
	const w = (x1 - x0) / n;

	ctx.save();
	ctx.clip(new Path2D(AWNING));
	for (let i = 0; i < n; i++) {
		ctx.fillStyle = i % 2 === 0 ? YELLOW : CREAM;
		ctx.fillRect(x0 + i * w, top - 2, w + 0.6, 45);
	}
	if (shaded) {
		const light = ctx.createLinearGradient(0, top, 0, base + 14);
		light.addColorStop(0, 'rgba(255,255,255,0.34)');
		light.addColorStop(0.5, 'rgba(255,255,255,0.03)');
		light.addColorStop(1, 'rgba(58,39,27,0.22)');
		ctx.fillStyle = light;
		ctx.fillRect(x0 - 2, top - 2, x1 - x0 + 4, 48);
	}
	if (finish) {
		ctx.strokeStyle = 'rgba(255,255,255,0.44)';
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
		ctx.fillRect(x0, top, x1 - x0, 45);

		const rearSheen = ctx.createLinearGradient(x1 - 140, top, x1, base + 8);
		rearSheen.addColorStop(0, 'rgba(255,255,255,0)');
		rearSheen.addColorStop(0.55, 'rgba(255,255,255,0.2)');
		rearSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = rearSheen;
		ctx.fillRect(x0, top, x1 - x0, 45);

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

		// Piped hem traced just inside the scallops.
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

		ctx.fillStyle = 'rgba(255,255,255,0.78)';
		for (let i = 0; i < n; i++) {
			ctx.beginPath();
			ctx.arc(x0 + i * w + w / 2, base + 5.4, 1, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Soft shadow the awning drops onto the hatch lip and flank.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = PINK_DEEP;
		ctx.beginPath();
		ctx.ellipse((x0 + x1) / 2, 189, (x1 - x0) / 2 - 6, 5.5, 0, 0, Math.PI);
		ctx.fill();
		ctx.restore();
	}

	// Chrome mounting rail across the roof band.
	rect(ctx, 228, 148, 212, 6, CHROME, 2, 2);
	line(ctx, 232, 149.6, 436, 149.6, 'rgba(255,255,255,0.7)', 1.2);

	if (finish) {
		for (let rx = 240; rx <= 430; rx += 14) {
			circle(ctx, rx, 152, 1.3, STEEL, 0.9);
		}
	}

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6;
	ctx.stroke(new Path2D(AWNING));
}

/** Whipped-cone roof ornament: waffle cone, cream swirl, pink drizzle and a cherry. */
function roofCone(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	// Chrome socket the cone stands in, entirely on the roof band.
	ctx.beginPath();
	ctx.ellipse(349, 137, 13, 4.4, 0, 0, Math.PI * 2);
	ctx.fillStyle = CHROME;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.save();
	ctx.clip(new Path2D(CONE));
	ctx.fillStyle = CREAM;
	ctx.fillRect(308, 36, 84, 102);

	// Waffle cone below the swirl, cross-hatched.
	ctx.save();
	ctx.clip(new Path2D('M349,136 L323,96 L375,96 Z'));
	ctx.fillStyle = WAFFLE;
	ctx.fillRect(320, 92, 60, 46);
	ctx.strokeStyle = WAFFLE_DARK;
	ctx.lineWidth = 1.5;
	for (let i = -5; i <= 5; i++) {
		const bx = 349 + i * 9;
		line(ctx, bx, 136, bx - 32, 88, 'rgba(184,124,70,0.72)', 1.5);
		line(ctx, bx, 136, bx + 32, 88, 'rgba(184,124,70,0.72)', 1.5);
	}
	ctx.restore();

	if (shaded) {
		const cream = ctx.createLinearGradient(0, 40, 0, 100);
		cream.addColorStop(0, 'rgba(255,255,255,0.75)');
		cream.addColorStop(0.55, 'rgba(255,255,255,0.04)');
		cream.addColorStop(1, 'rgba(214,143,179,0.16)');
		ctx.fillStyle = cream;
		ctx.fillRect(308, 36, 84, 102);
	}

	// Pink drizzle ribbons over the swirl, with a thin yellow companion line.
	ctx.strokeStyle = PINK;
	ctx.lineWidth = 2.8;
	ctx.beginPath();
	ctx.moveTo(324, 64);
	ctx.quadraticCurveTo(338, 74, 349, 64);
	ctx.quadraticCurveTo(362, 54, 376, 64);
	ctx.stroke();
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(328, 48);
	ctx.quadraticCurveTo(340, 57, 350, 48);
	ctx.quadraticCurveTo(362, 40, 370, 48);
	ctx.stroke();

	ctx.strokeStyle = YELLOW;
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(326, 74);
	ctx.quadraticCurveTo(338, 82, 350, 74);
	ctx.quadraticCurveTo(362, 66, 374, 74);
	ctx.stroke();

	if (finish) {
		// Volume on the swirl: lit top left, berry shade gathering low and right.
		ctx.save();
		ctx.clip(new Path2D(`${CONE} M349,136 L323,96 L375,96 Z`), 'evenodd');
		const vol = ctx.createRadialGradient(338, 48, 3, 352, 68, 42);
		vol.addColorStop(0, 'rgba(255,255,255,0.5)');
		vol.addColorStop(0.4, 'rgba(255,255,255,0.04)');
		vol.addColorStop(0.78, 'rgba(235,176,205,0.18)');
		vol.addColorStop(1, 'rgba(214,143,179,0.38)');
		ctx.fillStyle = vol;
		ctx.fillRect(308, 36, 84, 102);

		ctx.strokeStyle = 'rgba(214,143,179,0.36)';
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(324, 66.8);
		ctx.quadraticCurveTo(338, 76.8, 349, 66.8);
		ctx.quadraticCurveTo(362, 56.8, 376, 66.8);
		ctx.stroke();
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(328, 50.8);
		ctx.quadraticCurveTo(340, 59.8, 350, 50.8);
		ctx.quadraticCurveTo(362, 42.8, 370, 50.8);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 4;
		ctx.stroke(new Path2D(CONE));
		ctx.restore();

		const sprinkles: Array<[number, number, number, string]> = [
			[332, 58, 0.4, AMBER],
			[360, 60, -0.5, '#8FD3E8'],
			[338, 72, 0.2, RED],
			[358, 76, -0.3, BERRY],
			[329, 52, -0.6, '#8FD3E8'],
			[366, 50, 0.5, AMBER],
			[342, 84, -0.2, PINK],
			[356, 86, 0.6, YELLOW_DEEP]
		];
		ctx.lineWidth = 1.6;
		ctx.lineCap = 'round';
		for (const [sx, sy, angle, color] of sprinkles) {
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(sx - Math.cos(angle) * 2.4, sy - Math.sin(angle) * 2.4);
			ctx.lineTo(sx + Math.cos(angle) * 2.4, sy + Math.sin(angle) * 2.4);
			ctx.stroke();
		}

		// Gloss on the drizzle.
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(330, 63.4);
		ctx.quadraticCurveTo(338, 69.4, 344, 65.6);
		ctx.moveTo(356, 58.2);
		ctx.quadraticCurveTo(362, 54.6, 367, 58.4);
		ctx.stroke();

		// Waffle cone as a rolled cylinder.
		ctx.save();
		ctx.clip(new Path2D('M349,136 L323,96 L375,96 Z'));
		const wafer = ctx.createLinearGradient(325, 0, 373, 0);
		wafer.addColorStop(0, 'rgba(255,255,255,0.34)');
		wafer.addColorStop(0.34, 'rgba(255,255,255,0.05)');
		wafer.addColorStop(0.68, 'rgba(120,72,35,0.06)');
		wafer.addColorStop(1, 'rgba(120,72,35,0.32)');
		ctx.fillStyle = wafer;
		ctx.fillRect(320, 92, 60, 46);
		ctx.strokeStyle = 'rgba(255,255,255,0.32)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(340.6, 128.6);
		ctx.lineTo(330.4, 100.4);
		ctx.stroke();
		ctx.restore();
	}

	ctx.restore();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.8;
	ctx.stroke(new Path2D(CONE));

	// Cherry tucked into the crown, drawn after the shading so it keeps its colour.
	line(ctx, 349, 45.5, 356, 39, '#6B3A2E', 2.2);
	circle(ctx, 349, 46.5, 4.2, RED, 1.8);

	if (finish) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(349, 46.5, 4.2, 0, Math.PI * 2);
		ctx.clip();
		const gloss = ctx.createRadialGradient(347, 44.2, 0.4, 349, 46.5, 5.2);
		gloss.addColorStop(0, 'rgba(255,255,255,0.42)');
		gloss.addColorStop(0.45, 'rgba(255,160,185,0.18)');
		gloss.addColorStop(1, 'rgba(150,16,50,0.42)');
		ctx.fillStyle = gloss;
		ctx.fillRect(344, 41, 11, 11);
		ctx.restore();

		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.beginPath();
		ctx.arc(347.4, 44.6, 1.2, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(351, 49, 0.7, 0, Math.PI * 2);
		ctx.fill();
	}

	if (fitted) {
		// Socket rim highlight and the two screws that hold it down.
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.arc(349, 137, 11.4, Math.PI * 1.05, Math.PI * 1.95);
		ctx.stroke();
		circle(ctx, 341, 137.6, 1.2, STEEL, 0.8);
		circle(ctx, 357, 137.6, 1.2, STEEL, 0.8);
	}

	// Soft contact shadow where the ornament meets the roof.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.globalAlpha = 0.14;
	ctx.fillStyle = PINK_DEEP;
	ctx.beginPath();
	ctx.ellipse(349, 139.4, 15, 3.2, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

/** Amber beacon over the cab, with a chrome plinth at the fitted level. */
function roofBeacon(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	shape(ctx, BEACON, AMBER, 2.4);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(BEACON));
		const lens = ctx.createLinearGradient(0, 120, 0, 136);
		lens.addColorStop(0, 'rgba(255,255,255,0.6)');
		lens.addColorStop(0.55, 'rgba(255,255,255,0.06)');
		lens.addColorStop(1, 'rgba(160,96,0,0.26)');
		ctx.fillStyle = lens;
		ctx.fillRect(116, 118, 24, 20);
		ctx.restore();
	}

	if (fitted) {
		rect(ctx, 118, 132, 20, 4, CHROME, 2, 1.8);
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.arc(128, 132, 8.4, Math.PI * 1.1, Math.PI * 1.9);
		ctx.stroke();
	}

	if (lit) {
		const glow = ctx.createRadialGradient(128, 124, 2, 128, 124, 17);
		glow.addColorStop(0, 'rgba(255,214,90,0.4)');
		glow.addColorStop(1, 'rgba(255,214,90,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(128, 124, 17, 0, Math.PI * 2);
		ctx.fill();
	}

	if (finish) {
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.beginPath();
		ctx.arc(123, 126, 1.6, 0, Math.PI * 2);
		ctx.fill();
		circle(ctx, 116.5, 133.6, 1.1, STEEL, 0.8);
		circle(ctx, 139.5, 133.6, 1.1, STEEL, 0.8);
	}
}

export function drawRealIceCreamTruckLevel(
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
		ctx.ellipse(307, 292, 272, 8.5, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis block under the body, inside the underbody strip.
	ctx.fillStyle = '#6F7987';
	ctx.fillRect(UNDERBODY.x, UNDERBODY.y, UNDERBODY.w, UNDERBODY.h);
	ctx.fillStyle = '#8C96A4';
	ctx.fillRect(UNDERBODY.x, UNDERBODY.y, UNDERBODY.w, 2);
	ctx.fillStyle = '#555D6A';
	ctx.fillRect(UNDERBODY.x, UNDERBODY.y + UNDERBODY.h - 2, UNDERBODY.w, 2);

	// Shell.
	shape(ctx, SHELL, PINK);

	// Paint: light roof falling into a warm lower body, clipped to the silhouette.
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const paint = ctx.createLinearGradient(0, 136, 0, 276);
		paint.addColorStop(0, 'rgba(255,255,255,0.52)');
		paint.addColorStop(0.22, 'rgba(255,255,255,0.12)');
		paint.addColorStop(0.64, 'rgba(214,143,179,0.06)');
		paint.addColorStop(1, 'rgba(214,143,179,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(26, 136, 560, 140);
		ctx.restore();
	}

	// Livery bands and panel seams, clipped so they follow the shell edge.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.fillStyle = YELLOW;
	ctx.fillRect(96, 136, 486, 10);
	ctx.fillStyle = 'rgba(255,255,255,0.26)';
	ctx.fillRect(96, 137.6, 486, 1.6);
	ctx.fillStyle = YELLOW;
	ctx.fillRect(30, 250, 552, 8);
	ctx.fillStyle = 'rgba(255,255,255,0.26)';
	ctx.fillRect(32, 251.4, 548, 1.4);
	ctx.fillStyle = YELLOW;
	ctx.fillRect(30, 266, 552, 10);
	ctx.fillStyle = 'rgba(255,255,255,0.26)';
	ctx.fillRect(32, 267.4, 548, 1.4);

	// Waist creases and vertical panel joints; fittings paint over the ones they cross.
	line(ctx, 216, 146, 216, 266, 'rgba(214,143,179,0.24)', 1.8);
	line(ctx, 217.6, 148, 217.6, 264, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, 470, 158, 470, 250, 'rgba(214,143,179,0.2)', 1.8);
	line(ctx, 471.6, 160, 471.6, 248, 'rgba(255,255,255,0.36)', 1.2);
	line(ctx, 568, 146, 568, 264, 'rgba(142,79,104,0.4)', 2);
	line(ctx, 569.6, 150, 569.6, 260, 'rgba(255,255,255,0.5)', 1.2);
	ctx.restore();

	// Silhouette re-stroke so the opaque bands keep a crisp edge.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Chrome pinstripes flanking the waist band, under the door leaf and fittings.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	line(ctx, 100, 248, 582, 248, CHROME, 1.4);
	line(ctx, 100, 260, 582, 260, CHROME, 1.4);
	ctx.restore();

	cabDoor(ctx, shaded, fitted);
	servingHatch(ctx, shaded, fitted, lit, finish);
	counter(ctx, fitted, finish);
	menuBoard(ctx, fitted, finish);

	awning(ctx, shaded, finish);

	// The naming cue, standing proud of the roof.
	roofCone(ctx, shaded, fitted, finish);
	roofBeacon(ctx, shaded, fitted, lit, finish);

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 84, 146, 58, 56);
		glassShade(ctx, SIDE_GLASS, 152, 143, 52, 39);
	}

	if (fitted) {
		// Screen wiper and a chrome bonnet crease.
		line(ctx, 104, 192, 120, 166, INK, 2);
		line(ctx, 44, 191, 72, 188, 'rgba(255,255,255,0.5)', 1.6);

		// Nose: louvred grille, indicator and headlamp.
		rect(ctx, 33, 198, 12, 22, BERRY, 2, 2);
		for (let bar = 0; bar < 3; bar++) {
			line(ctx, 34.5, 203 + bar * 6, 43.5, 203 + bar * 6, CHROME, 1.6);
		}
		circle(ctx, 54, 222, 3.4, AMBER, 1.8);
		circle(ctx, 44, 240, 8, LAMP, 2.4);
		circle(ctx, 44, 240, 4.2, '#FFF7CF', 1.5);

		// Rear lamps, plate and a rear-door handle.
		rect(ctx, 566, 210, 13, 18, RED, 2, 1.8);
		rect(ctx, 566, 231, 13, 9, AMBER, 1.5, 1.5);
		rect(ctx, 560, 190, 6, 5, CHROME, 2, 1.6);
		rect(ctx, 522, 258, 32, 13, CREAM, 1.5, 1.7);
		ctx.fillStyle = YELLOW;
		ctx.fillRect(525, 261, 4, 7);
		ctx.fillStyle = INK;
		ctx.fillRect(532, 262, 16, 2);
		ctx.fillRect(532, 266, 10, 2);
	}

	// Bumpers: chrome blocks butted to the nose and tail, both inside the body mask.
	rect(ctx, BUMPER_FRONT.x, BUMPER_FRONT.y, BUMPER_FRONT.w, BUMPER_FRONT.h, CHROME, 3, 2.6);
	line(ctx, 18, 253, 28, 253, 'rgba(255,255,255,0.62)', 1.6);
	line(ctx, 18, 270, 28, 270, 'rgba(58,39,27,0.28)', 1.6);
	rect(ctx, BUMPER_REAR.x, BUMPER_REAR.y, BUMPER_REAR.w, BUMPER_REAR.h, CHROME, 2, 2.6);
	line(ctx, 585, 258, 593, 258, 'rgba(255,255,255,0.55)', 1.4);

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
		ctx.moveTo(118, 137.5);
		ctx.lineTo(564, 137.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(31.5, 208);
		ctx.lineTo(31.5, 244);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(580.5, 152);
		ctx.lineTo(580.5, 258);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(44, 240, 1, 44, 240, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(44, 240, 28, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 289, 25, 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain over the body mask only: glazing, hatch, trim and tyres stay clear.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${HATCH_MASK} ${WHEEL_MASK_L} ${WHEEL_MASK_R} ${rectMask(
			MENU.x - 2,
			MENU.y - 2,
			MENU.w + 4,
			MENU.h + 4
		)} ${rectMask(310, 34, 80, 104)} ${rectMask(114, 116, 28, 22)} ${rectMask(
			BUMPER_FRONT.x - 2,
			BUMPER_FRONT.y - 2,
			BUMPER_FRONT.w + 4,
			BUMPER_FRONT.h + 4
		)} ${rectMask(BUMPER_REAR.x - 2, BUMPER_REAR.y - 2, BUMPER_REAR.w + 4, BUMPER_REAR.h + 4)} ${rectMask(
			UNDERBODY.x,
			UNDERBODY.y,
			UNDERBODY.w,
			UNDERBODY.h
		)}`;
		ctx.clip(new Path2D(BODY_MASK), 'evenodd');
		ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');
		let seed = 71;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 380; i++) {
			const px = 28 + rand() * 558;
			const py = 134 + rand() * 142;
			const size = 1.3 + rand() * 1;
			ctx.globalAlpha = 0.06 + rand() * 0.04;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 140; i++) {
			const px = 28 + rand() * 558;
			const py = 134 + rand() * 142;
			const size = 1.1 + rand() * 0.8;
			ctx.globalAlpha = 0.12 + rand() * 0.06;
			ctx.fillRect(px, py, size, size);
		}

		ctx.fillStyle = INK;
		for (let i = 0; i < 300; i++) {
			const px = 28 + rand() * 558;
			const py = 134 + rand() * 142;
			const size = 0.8 + rand() * 0.6;
			ctx.globalAlpha = 0.04 + rand() * 0.03;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 150; i++) {
			const px = 28 + rand() * 558;
			const py = 134 + rand() * 142;
			const size = 0.7 + rand() * 0.55;
			ctx.globalAlpha = 0.08 + rand() * 0.05;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes across the flanks.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[44, 168, 76, 164],
			[232, 160, 300, 158],
			[476, 166, 556, 164],
			[244, 246, 316, 244],
			[486, 240, 556, 238]
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
			[190, 176, 30],
			[240, 160, 22],
			[500, 176, 26],
			[548, 194, 20],
			[196, 244, 14]
		]) {
			ctx.beginPath();
			ctx.moveTo(hx, hy);
			ctx.quadraticCurveTo(hx + 1.6, hy + hh / 2, hx, hy + hh);
			ctx.stroke();
		}
		ctx.restore();

		// Roof sheen and a crisp cream swipe along the flank.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const roofSheen = ctx.createLinearGradient(0, 136, 0, 176);
		roofSheen.addColorStop(0, 'rgba(255,255,255,0.34)');
		roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = roofSheen;
		ctx.fillRect(100, 136, 482, 40);
		ctx.globalAlpha = 0.28;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(188, 252);
		ctx.quadraticCurveTo(320, 249, 452, 252);
		ctx.stroke();
		ctx.restore();

		// Glints on paint and chrome, clipped so no sparkle pokes off the silhouette.
		ctx.save();
		ctx.clip(new Path2D(BODY_MASK));
		glint(ctx, 196, 162, 4.4);
		glint(ctx, 548, 164, 4);
		glint(ctx, 240, 258, 3.4);
		glint(ctx, 500, 256, 3.2);
		glint(ctx, 108, 146, 3.8);

		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		for (const [sx, sy] of [
			[430.6, 240.4],
			[586, 252.6],
			[344.6, 205.6],
			[388.6, 205.6]
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
		ctx.moveTo(102, 184);
		ctx.lineTo(124, 156);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(154, 178);
		ctx.lineTo(166, 148);
		ctx.stroke();
		ctx.restore();

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Roof-band rivets and body highlights.
		ctx.fillStyle = CHROME;
		ctx.globalAlpha = 0.7;
		for (let rivetX = 112; rivetX <= 560; rivetX += 28) {
			if (rivetX > 326 && rivetX < 372) continue;
			ctx.beginPath();
			ctx.arc(rivetX, 138.6, 1.3, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
		line(ctx, 244, 218.6, 424, 218.6, 'rgba(255,255,255,0.65)', 1.4);
		line(ctx, 230, 269, 562, 269, 'rgba(255,255,255,0.18)', 1.4);

		// Soft exhaust puff curling up and back from behind the rear bumper.
		ctx.save();
		const puff = (puffX: number, puffY: number, puffR: number, alpha: number) => {
			const haze = ctx.createRadialGradient(puffX, puffY, 0, puffX, puffY, puffR);
			haze.addColorStop(0, `rgba(213,220,229,${alpha})`);
			haze.addColorStop(0.6, `rgba(224,230,238,${alpha * 0.55})`);
			haze.addColorStop(1, 'rgba(224,230,238,0)');
			ctx.fillStyle = haze;
			ctx.beginPath();
			ctx.arc(puffX, puffY, puffR, 0, Math.PI * 2);
			ctx.fill();
		};
		puff(591, 277, 6.5, 0.5);
		puff(599, 272, 8, 0.4);
		puff(607, 265, 6.5, 0.3);
		puff(603, 258, 4.5, 0.2);

		// Warm cream core where the puff leaves the tail.
		const core = ctx.createRadialGradient(589, 277, 0, 589, 277, 3.2);
		core.addColorStop(0, 'rgba(255,249,236,0.55)');
		core.addColorStop(1, 'rgba(255,249,236,0)');
		ctx.fillStyle = core;
		ctx.beginPath();
		ctx.arc(589, 277, 3.2, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealIceCreamTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealIceCreamTruckLevel(ctx, x, y, scale, 5);
}
