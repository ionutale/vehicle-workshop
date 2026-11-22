/**
 * Ice-cream van art, cut into the same five-piece kit as the other realistic vehicles.
 * A compact serving van facing left: soft pink body with plum roof and skirt bands, a wide
 * serving hatch under a striped scalloped awning, a chrome counter and service bell, a menu
 * board beside the hatch, a painted 99 roundel, a rear door seam and — the cue that names the
 * vehicle — a big whipped-cone ornament standing on the roof. Level 5 is the production
 * target: shaded, fully fitted, lit and picture-book finished.
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
const PINK_LIGHT = '#FDE8F2';
const PINK_SHADE = '#ECADD0';
const PLUM = '#6D597A';
const PLUM_DARK = '#4F405C';
const CREAM = '#FFF8E9';
const WAFFLE = '#DFA36B';
const WAFFLE_DARK = '#B87C46';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/**
 * One cut-out for the whole shell: flat nose, stubby bonnet, raked screen, long roof and a
 * rounded rear corner. The roof sits at 110 so the cone ornament has room above it.
 */
const SHELL =
	'M34,258 L34,206 Q34,196 42,192 L58,180 L82,118 Q84,110 92,110 L638,110 Q652,110 652,124 L652,242 Q652,258 636,258 Z';

/** The roof ornament: a waffle cone under a three-bulge whipped swirl, as one outline. */
const CONE =
	'M250,100 L230,72 Q218,68 228,58 Q218,50 230,42 Q228,30 242,30 Q250,19 258,30 Q272,30 270,42 Q282,50 272,58 Q282,68 270,72 Z';

/** Chrome collar the cone stands in, flush with the roof line. */
const CONE_BASE = { x: 240, y: 100, w: 20, h: 10 };

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Raked windscreen band and the cab side pane, with the A-pillar between them. */
const WINDSCREEN = 'M72,162 L90,124 Q92,120 98,120 L130,120 Q134,120 134,124 L118,162 Z';
const SIDE_WINDOW = pane(140, 120, 54, 36, 6);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_WINDOW}`;

/** Cab door: a clean rectangle clear of both panes. */
const DOOR = { x: 122, y: 162, w: 76, h: 90 };
const DOOR_MASK = rectMask(DOOR.x, DOOR.y, DOOR.w, DOOR.h);

/** Serving hatch opening under the awning. */
const HATCH = 'M302,206 L302,164 Q302,150 316,150 L486,150 Q500,150 500,164 L500,206 Z';

/** Menu board beside the hatch, clear of the rear wheel arch. */
const MENU = { x: 522, y: 122, w: 66, h: 66 };

/** Striped awning with eight scallops along its lower edge. */
const AWNING = (() => {
	const x0 = 288;
	const x1 = 514;
	const top = 118;
	const base = 144;
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

/** Body mask: shell plus the roof cone, its collar and the two bumpers. Subpaths never overlap. */
const BODY_MASK = `${SHELL} ${CONE} ${rectMask(CONE_BASE.x, CONE_BASE.y, CONE_BASE.w, CONE_BASE.h)} ${rectMask(20, 242, 14, 20)} ${rectMask(652, 246, 14, 16)}`;

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
	ctx.fillStyle = PLUM;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.36)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5.6, Math.PI * 1.12, Math.PI * 1.88);
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
	// Polished cap: cream light at the top falling into a cool grey underside.
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

	// Two mirrored rim arcs: a chrome ring catching the light, identical when the wheel is flipped.
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.1, Math.PI * 1.46);
	ctx.arc(x, y, r * 0.62, Math.PI * 1.54, Math.PI * 1.9);
	ctx.stroke();
	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
}

/** The side door: inset leaf, hinges, chrome handle and the skirt band carried across. */
function sideDoor(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, PINK_SHADE, 3, 2.6);
	rect(ctx, DOOR.x + 5, DOOR.y + 5, DOOR.w - 10, DOOR.h - 10, PINK, 2, 1.8);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(DOOR_MASK));
		const shade = ctx.createLinearGradient(DOOR.x, DOOR.y, DOOR.x, DOOR.y + DOOR.h);
		shade.addColorStop(0, 'rgba(255,255,255,0.42)');
		shade.addColorStop(0.5, 'rgba(255,255,255,0.06)');
		shade.addColorStop(1, 'rgba(109,89,122,0.16)');
		ctx.fillStyle = shade;
		ctx.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
		ctx.restore();
	}

	line(ctx, DOOR.x + 6, DOOR.y + 9, DOOR.x + DOOR.w - 6, DOOR.y + 9, 'rgba(109,89,122,0.16)', 1.4);

	if (fitted) {
		for (const hy of [DOOR.y + 16, DOOR.y + 50]) {
			rect(ctx, DOOR.x + 1, hy, 6, 12, STEEL, 1.5, 1.4);
			circle(ctx, DOOR.x + 4, hy + 6, 1.2, CHROME, 0.8);
		}
		rect(ctx, DOOR.x + DOOR.w - 15, DOOR.y + 30, 10, 5, CHROME, 2.2, 1.8);
	}

	// Skirt band carried across the door so the separate leaf matches the flank.
	ctx.save();
	ctx.clip(new Path2D(DOOR_MASK));
	ctx.fillStyle = PLUM;
	ctx.fillRect(34, 246, 620, 12);
	ctx.fillStyle = 'rgba(255,255,255,0.22)';
	ctx.fillRect(DOOR.x, 247.4, DOOR.w, 1.4);
	ctx.restore();
}

/** Wide serving hatch: dark recess, stocked shelves at the fitted level and a warm glow at night. */
function servingHatch(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	ctx.save();
	ctx.clip(new Path2D(HATCH));
	ctx.fillStyle = '#4B3D57';
	ctx.fillRect(300, 146, 202, 64);

	if (shaded) {
		const depth = ctx.createLinearGradient(0, 148, 0, 208);
		depth.addColorStop(0, 'rgba(24,16,31,0.5)');
		depth.addColorStop(0.45, 'rgba(24,16,31,0.06)');
		depth.addColorStop(1, 'rgba(255,224,188,0.18)');
		ctx.fillStyle = depth;
		ctx.fillRect(300, 146, 202, 64);
	}

	if (lit) {
		const glow = ctx.createRadialGradient(400, 196, 4, 400, 196, 112);
		glow.addColorStop(0, 'rgba(255,214,150,0.42)');
		glow.addColorStop(1, 'rgba(255,214,150,0)');
		ctx.fillStyle = glow;
		ctx.fillRect(300, 146, 202, 64);
	}

	if (fitted) {
		const tubs = [PINK, CREAM, PLUM, PINK_LIGHT];
		for (let i = 0; i < 8; i++) {
			const tx = 310 + i * 23;
			rect(ctx, tx, 162, 17, 13, tubs[i % 4], 2, 1.5);
			line(ctx, tx + 2, 165, tx + 15, 165, 'rgba(255,255,255,0.45)', 1.2);
		}
		line(ctx, 306, 177, 496, 177, CHROME, 2.4);
		line(ctx, 306, 178.4, 496, 178.4, 'rgba(255,255,255,0.5)', 1);

		// Cone sleeves in the chrome rack on the counter.
		rect(ctx, 318, 196, 118, 4, CHROME, 1.5, 1.3);
		for (let i = 0; i < 5; i++) {
			const cx = 330 + i * 22;
			shape(ctx, `M${cx - 7},196 L${cx + 7},196 L${cx},181 Z`, WAFFLE, 1.4);
			line(ctx, cx - 4, 192, cx + 3, 185, 'rgba(120,72,35,0.4)', 1);
		}

		// Little price card propped up beside the rack.
		rect(ctx, 448, 183, 30, 13, CREAM, 1.5, 1.2);
		line(ctx, 452, 187, 472, 187, 'rgba(109,89,122,0.55)', 1.2);
		line(ctx, 452, 191, 466, 191, 'rgba(109,89,122,0.4)', 1.2);
	}

	if (finish) {
		// Warm light pooling on the counter shelf under the stocked racks.
		const warm = ctx.createLinearGradient(0, 188, 0, 210);
		warm.addColorStop(0, 'rgba(255,226,178,0.32)');
		warm.addColorStop(1, 'rgba(255,226,178,0)');
		ctx.fillStyle = warm;
		ctx.fillRect(300, 188, 202, 22);

		// Specular pinpoints along the chrome shelf and cone rack.
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		for (const [sx, sy] of [
			[312, 177.6],
			[352, 177.6],
			[404, 177.6],
			[452, 177.6],
			[322, 196.4],
			[430, 196.4]
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
function counter(ctx: CanvasRenderingContext2D, fitted: boolean, finish: boolean): void {
	rect(ctx, 292, 203, 220, 16, CREAM, 3, 2.6);

	if (finish) {
		// Lacquered face: hatch light at the top, a warm reflection and a plum fall at the base.
		ctx.save();
		ctx.clip(new Path2D(rectMask(292, 203, 220, 16)));
		const face = ctx.createLinearGradient(0, 203, 0, 219);
		face.addColorStop(0, 'rgba(255,255,255,0.6)');
		face.addColorStop(0.44, 'rgba(255,255,255,0.06)');
		face.addColorStop(1, 'rgba(109,89,122,0.24)');
		ctx.fillStyle = face;
		ctx.fillRect(292, 203, 220, 16);

		const reflect = ctx.createLinearGradient(300, 204, 402, 219);
		reflect.addColorStop(0, 'rgba(255,238,205,0.42)');
		reflect.addColorStop(1, 'rgba(255,238,205,0)');
		ctx.fillStyle = reflect;
		ctx.fillRect(300, 204, 104, 15);
		ctx.restore();
	}

	if (fitted) {
		rect(ctx, 292, 215, 220, 4, CHROME, 2, 0);
		line(ctx, 296, 206, 508, 206, 'rgba(255,255,255,0.7)', 1.6);
		rect(ctx, 300, 219, 9, 7, PLUM_DARK, 1, 1.5);
		rect(ctx, 495, 219, 9, 7, PLUM_DARK, 1, 1.5);
		line(ctx, 303, 219, 296, 232, CHROME, 2);
		line(ctx, 502, 219, 508, 232, CHROME, 2);
		circle(ctx, 486, 200, 4.5, CHROME, 1.6);
		circle(ctx, 486, 196.5, 1.6, STEEL, 1);
	}

	if (finish) {
		// Chrome nosing: bright top edge rolling into a dark underside.
		ctx.save();
		ctx.clip(new Path2D(rectMask(292, 215, 220, 4)));
		const lip = ctx.createLinearGradient(0, 215, 0, 219);
		lip.addColorStop(0, 'rgba(255,255,255,0.95)');
		lip.addColorStop(0.5, 'rgba(255,255,255,0.12)');
		lip.addColorStop(1, 'rgba(58,39,27,0.34)');
		ctx.fillStyle = lip;
		ctx.fillRect(292, 215, 220, 4);
		ctx.restore();

		line(ctx, 294, 216.1, 510, 216.1, 'rgba(255,255,255,0.78)', 1.2);
		circle(ctx, 304.5, 222.5, 1.5, CHROME, 0.9);
		circle(ctx, 499.5, 222.5, 1.5, CHROME, 0.9);
		circle(ctx, 484.9, 198.6, 1.2, 'rgba(255,255,255,0.9)', 0.8);
	}
}

/** Menu board beside the hatch: framed cream board, price lines, a cone doodle and a laminate sheen. */
function menuBoard(ctx: CanvasRenderingContext2D, fitted: boolean, finish: boolean): void {
	if (finish) {
		// Drop shadow so the board sits proud of the flank.
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = PLUM_DARK;
		ctx.fill(new Path2D(rectMask(MENU.x + 3, MENU.y + 4, MENU.w, MENU.h)));
		ctx.restore();
	}

	rect(ctx, MENU.x, MENU.y, MENU.w, MENU.h, PLUM, 4, 2.6);
	rect(ctx, MENU.x + 4, MENU.y + 4, MENU.w - 8, MENU.h - 8, CREAM, 2, 1.8);

	if (fitted) {
		ctx.fillStyle = PLUM;
		ctx.font = '700 10px ui-rounded, system-ui, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('MENU', MENU.x + MENU.w / 2, MENU.y + 17);

		const items: Array<[number, number]> = [
			[MENU.y + 28, 18],
			[MENU.y + 37, 22],
			[MENU.y + 46, 15]
		];
		for (const [iy, iw] of items) {
			line(ctx, MENU.x + 8, iy, MENU.x + 8 + iw, iy, 'rgba(109,89,122,0.55)', 2);
			circle(ctx, MENU.x + MENU.w - 11, iy, 1.6, PLUM, 1);
		}

		// Cone doodle in the bottom corner.
		shape(ctx, `M${MENU.x + 12},${MENU.y + 59} L${MENU.x + 23},${MENU.y + 59} L${MENU.x + 17.5},${MENU.y + 49} Z`, WAFFLE, 1.2);
		circle(ctx, MENU.x + 17.5, MENU.y + 47.5, 3.4, PINK, 1.2);
	}

	if (finish) {
		// Laminated sheen sweeping across the board.
		ctx.save();
		ctx.clip(new Path2D(rectMask(MENU.x + 4, MENU.y + 4, MENU.w - 8, MENU.h - 8)));
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = '#FFFFFF';
		ctx.beginPath();
		ctx.moveTo(MENU.x + 12, MENU.y + 60);
		ctx.lineTo(MENU.x + 42, MENU.y + 6);
		ctx.lineTo(MENU.x + 50, MENU.y + 6);
		ctx.lineTo(MENU.x + 20, MENU.y + 60);
		ctx.closePath();
		ctx.fill();
		ctx.globalAlpha = 1;

		// Chalk dust caught in the laminate.
		ctx.fillStyle = 'rgba(109,89,122,0.18)';
		for (const [dx, dy, dr] of [
			[MENU.x + 26, MENU.y + 24, 0.9],
			[MENU.x + 48, MENU.y + 33, 0.8],
			[MENU.x + 31, MENU.y + 44, 0.7],
			[MENU.x + 56, MENU.y + 52, 0.9]
		]) {
			ctx.beginPath();
			ctx.arc(dx, dy, dr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Frame bevel: bright top-left, shaded bottom-right, four corner screws.
		line(ctx, MENU.x + 2, MENU.y + 2, MENU.x + MENU.w - 2, MENU.y + 2, 'rgba(255,255,255,0.5)', 1.4);
		line(ctx, MENU.x + 2, MENU.y + 2, MENU.x + 2, MENU.y + MENU.h - 2, 'rgba(255,255,255,0.34)', 1.2);
		line(ctx, MENU.x + 2, MENU.y + MENU.h - 2, MENU.x + MENU.w - 2, MENU.y + MENU.h - 2, 'rgba(58,39,27,0.32)', 1.4);
		for (const [sx, sy] of [
			[MENU.x + 7, MENU.y + 7],
			[MENU.x + MENU.w - 7, MENU.y + 7],
			[MENU.x + 7, MENU.y + MENU.h - 7],
			[MENU.x + MENU.w - 7, MENU.y + MENU.h - 7]
		]) {
			circle(ctx, sx, sy, 1.5, STEEL, 0.9);
		}
	}

	ctx.textAlign = 'left';
}

/** Scalloped awning: alternating plum and cream stripes clipped to one outline. */
function awning(ctx: CanvasRenderingContext2D, shaded: boolean, finish: boolean): void {
	const x0 = 288;
	const x1 = 514;
	const top = 118;
	const base = 144;
	const n = 8;
	const w = (x1 - x0) / n;

	ctx.save();
	ctx.clip(new Path2D(AWNING));
	for (let i = 0; i < n; i++) {
		ctx.fillStyle = i % 2 === 0 ? PLUM : CREAM;
		ctx.fillRect(x0 + i * w, top - 2, w + 0.6, 44);
	}
	if (shaded) {
		const light = ctx.createLinearGradient(0, top, 0, 160);
		light.addColorStop(0, 'rgba(255,255,255,0.3)');
		light.addColorStop(0.5, 'rgba(255,255,255,0.03)');
		light.addColorStop(1, 'rgba(58,39,27,0.24)');
		ctx.fillStyle = light;
		ctx.fillRect(x0 - 2, top - 2, x1 - x0 + 4, 46);
	}
	if (finish) {
		// Stitched seams between the stripes.
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 1.2;
		for (let i = 1; i < n; i++) {
			ctx.beginPath();
			ctx.moveTo(x0 + i * w, top);
			ctx.lineTo(x0 + i * w, base);
			ctx.stroke();
		}

		// A light sweep raking across the fabric from the front edge.
		const sheen = ctx.createLinearGradient(x0, top, x0 + 130, base + 12);
		sheen.addColorStop(0, 'rgba(255,255,255,0.32)');
		sheen.addColorStop(0.46, 'rgba(255,255,255,0.02)');
		sheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = sheen;
		ctx.fillRect(x0, top, x1 - x0, 44);
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

		// Shade gathering above each scallop tip.
		ctx.strokeStyle = 'rgba(79,64,92,0.2)';
		ctx.lineWidth = 2;
		for (let i = 0; i < n; i++) {
			const a = x0 + i * w;
			ctx.beginPath();
			ctx.moveTo(a + 1.6, base + 0.4);
			ctx.quadraticCurveTo(a + w / 2, base + 11.2, a + w - 1.6, base + 0.4);
			ctx.stroke();
		}
		ctx.restore();
	}

	// Mounting rail across the roof line.
	rect(ctx, 284, 114, 234, 5, CHROME, 2, 2);
	line(ctx, 288, 115.4, 514, 115.4, 'rgba(255,255,255,0.7)', 1.2);

	if (finish) {
		// Rail screws holding the awning to the roof.
		for (let rx = 296; rx <= 506; rx += 14) {
			circle(ctx, rx, 116.6, 1.3, STEEL, 0.9);
		}
	}

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6;
	ctx.stroke(new Path2D(AWNING));
}

/** Whipped-cone roof ornament: waffle cone, cream swirl, pink drizzle and a cherry. */
function roofCone(ctx: CanvasRenderingContext2D, finish: boolean): void {
	rect(ctx, CONE_BASE.x, CONE_BASE.y, CONE_BASE.w, CONE_BASE.h, CHROME, 2, 2.2);
	line(ctx, 243, 102.5, 257, 102.5, 'rgba(255,255,255,0.65)', 1.4);

	ctx.save();
	ctx.clip(new Path2D(CONE));
	ctx.fillStyle = CREAM;
	ctx.fillRect(216, 18, 70, 86);

	// Waffle cone below the swirl, with a cross-hatch.
	ctx.save();
	ctx.clip(new Path2D('M250,100 L230,72 L270,72 Z'));
	ctx.fillStyle = WAFFLE;
	ctx.fillRect(226, 66, 48, 38);
	ctx.strokeStyle = WAFFLE_DARK;
	ctx.lineWidth = 1.5;
	for (let i = -5; i <= 5; i++) {
		const bx = 250 + i * 9;
		line(ctx, bx, 100, bx - 34, 52, 'rgba(184,124,70,0.72)', 1.5);
		line(ctx, bx, 100, bx + 34, 52, 'rgba(184,124,70,0.72)', 1.5);
	}
	ctx.restore();

	// Cream light and shade over the whole ornament.
	const cream = ctx.createLinearGradient(0, 22, 0, 86);
	cream.addColorStop(0, 'rgba(255,255,255,0.75)');
	cream.addColorStop(0.55, 'rgba(255,255,255,0.04)');
	cream.addColorStop(1, 'rgba(109,89,122,0.16)');
	ctx.fillStyle = cream;
	ctx.fillRect(216, 18, 70, 86);

	// Pink drizzle ribbons over the swirl.
	ctx.strokeStyle = PINK;
	ctx.lineWidth = 2.8;
	ctx.beginPath();
	ctx.moveTo(228, 60);
	ctx.quadraticCurveTo(240, 70, 250, 60);
	ctx.quadraticCurveTo(262, 50, 274, 60);
	ctx.stroke();
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(232, 44);
	ctx.quadraticCurveTo(242, 52, 252, 44);
	ctx.quadraticCurveTo(264, 36, 270, 44);
	ctx.stroke();

	// Cherry on the crown, drawn after the picture-book shading so it stays red.
	if (finish) {
		// Volume: lit from the top left, settling into a strawberry shade low and right.
		// Clipped off the waffle so the cone keeps its own colour.
		ctx.save();
		ctx.clip(new Path2D(`${CONE} M250,100 L230,72 L270,72 Z`), 'evenodd');

		const vol = ctx.createRadialGradient(241, 38, 3, 252, 54, 40);
		vol.addColorStop(0, 'rgba(255,255,255,0.5)');
		vol.addColorStop(0.4, 'rgba(255,255,255,0.04)');
		vol.addColorStop(0.78, 'rgba(236,173,208,0.16)');
		vol.addColorStop(1, 'rgba(214,137,183,0.38)');
		ctx.fillStyle = vol;
		ctx.fillRect(216, 18, 70, 86);

		// Fold shadows under the drizzle ribbons give the three whipped bulges their roll.
		ctx.strokeStyle = 'rgba(214,137,183,0.36)';
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(228, 62.8);
		ctx.quadraticCurveTo(240, 72.8, 250, 62.8);
		ctx.quadraticCurveTo(262, 52.8, 274, 62.8);
		ctx.stroke();
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(232, 46.8);
		ctx.quadraticCurveTo(242, 54.8, 252, 46.8);
		ctx.quadraticCurveTo(264, 38.8, 270, 46.8);
		ctx.stroke();

		// Paper-cut bevel: a bright line just inside the ink on the swirl.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 4;
		ctx.stroke(new Path2D(CONE));
		ctx.restore();

		const sprinkles: Array<[number, number, number, string]> = [
			[238, 52, 0.4, AMBER],
			[258, 55, -0.5, '#8FD3E8'],
			[244, 66, 0.2, RED],
			[262, 68, -0.3, PLUM],
			[234, 45, -0.6, '#8FD3E8'],
			[265, 43, 0.5, AMBER],
			[240, 73, -0.2, PLUM],
			[266, 74, 0.6, PINK],
			[256, 47, -0.4, AMBER]
		];
		ctx.lineWidth = 1.6;
		ctx.lineCap = 'round';
		for (const [sx, sy, angle, color] of sprinkles) {
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(sx - Math.cos(angle) * 2.6, sy - Math.sin(angle) * 2.6);
			ctx.lineTo(sx + Math.cos(angle) * 2.6, sy + Math.sin(angle) * 2.6);
			ctx.stroke();
		}

		// Gloss on the drizzle ribbons.
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(234, 60.4);
		ctx.quadraticCurveTo(240, 65.4, 246, 61.6);
		ctx.moveTo(258, 55.2);
		ctx.quadraticCurveTo(264, 51.6, 269, 55.4);
		ctx.stroke();

		// Waffle cone as a rolled cylinder: lit left flank, shaded right, bright left edge.
		ctx.save();
		ctx.clip(new Path2D('M250,100 L230,72 L270,72 Z'));
		const wafer = ctx.createLinearGradient(234, 0, 268, 0);
		wafer.addColorStop(0, 'rgba(255,255,255,0.34)');
		wafer.addColorStop(0.34, 'rgba(255,255,255,0.05)');
		wafer.addColorStop(0.68, 'rgba(120,72,35,0.06)');
		wafer.addColorStop(1, 'rgba(120,72,35,0.32)');
		ctx.fillStyle = wafer;
		ctx.fillRect(228, 66, 46, 38);
		ctx.strokeStyle = 'rgba(255,255,255,0.32)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(241.6, 96.6);
		ctx.lineTo(235, 75.4);
		ctx.stroke();
		ctx.restore();
	}

	// Cherry on the crown, drawn last so the picture-book shading never greys it.
	line(ctx, 249, 38, 255, 28, PLUM, 2.2);
	circle(ctx, 247, 39, 4.4, RED, 1.8);
	if (!finish) {
		circle(ctx, 245.6, 37.4, 1.2, 'rgba(255,255,255,0.8)', 0);
	}

	if (finish) {
		// Gloss over the cherry: lit shoulder falling to a deep candy shade.
		ctx.save();
		ctx.beginPath();
		ctx.arc(247, 39, 4.4, 0, Math.PI * 2);
		ctx.clip();
		const gloss = ctx.createRadialGradient(245, 36.6, 0.4, 247, 39, 5.4);
		gloss.addColorStop(0, 'rgba(255,255,255,0.42)');
		gloss.addColorStop(0.45, 'rgba(255,160,185,0.18)');
		gloss.addColorStop(1, 'rgba(150,16,50,0.42)');
		ctx.fillStyle = gloss;
		ctx.fillRect(242, 34, 12, 12);
		ctx.restore();

		// Clean catchlights, no inherited ring at this level.
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.beginPath();
		ctx.arc(245.6, 37.2, 1.35, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(249.2, 41.8, 0.7, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(CONE));

	if (finish) {
		// Chrome collar under the cone: polished gradient, two rivets, rim highlight.
		ctx.save();
		ctx.clip(new Path2D(rectMask(CONE_BASE.x, CONE_BASE.y, CONE_BASE.w, CONE_BASE.h)));
		const collar = ctx.createLinearGradient(0, CONE_BASE.y, 0, CONE_BASE.y + CONE_BASE.h);
		collar.addColorStop(0, 'rgba(255,255,255,0.9)');
		collar.addColorStop(0.5, 'rgba(255,255,255,0.1)');
		collar.addColorStop(1, 'rgba(58,39,27,0.28)');
		ctx.fillStyle = collar;
		ctx.fillRect(CONE_BASE.x, CONE_BASE.y, CONE_BASE.w, CONE_BASE.h);
		ctx.restore();
		circle(ctx, CONE_BASE.x + 4.5, CONE_BASE.y + 5.4, 1.2, STEEL, 0.8);
		circle(ctx, CONE_BASE.x + CONE_BASE.w - 4.5, CONE_BASE.y + 5.4, 1.2, STEEL, 0.8);

		// The last crisp highlight where the waffle meets the collar.
		line(ctx, 240, 98.6, 260, 98.6, 'rgba(255,255,255,0.5)', 1.4);

		// Soft cast shadow of the collar on the plum roof band.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = PLUM_DARK;
		ctx.beginPath();
		ctx.ellipse(250, 112.4, 14, 3, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

export function drawRealIceCreamVanLevel(
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
		ctx.ellipse(348, 279, 320, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell.
	shape(ctx, SHELL, PINK);

	// Paint: light roof falling to a plum-tinted lower body, clipped to the silhouette.
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const paint = ctx.createLinearGradient(0, 104, 0, 258);
		paint.addColorStop(0, 'rgba(255,255,255,0.6)');
		paint.addColorStop(0.22, 'rgba(255,255,255,0.14)');
		paint.addColorStop(0.62, 'rgba(109,89,122,0.05)');
		paint.addColorStop(1, 'rgba(109,89,122,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(30, 104, 626, 158);
		ctx.restore();
	}

	// Livery bands and panel seams, clipped so they follow the shell edge.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.fillStyle = PLUM;
	ctx.fillRect(96, 110, 560, 8);
	ctx.fillStyle = 'rgba(255,255,255,0.22)';
	ctx.fillRect(96, 111.6, 560, 1.6);
	ctx.fillStyle = PLUM;
	ctx.fillRect(34, 246, 620, 12);
	ctx.fillStyle = 'rgba(255,255,255,0.22)';
	ctx.fillRect(36, 247.4, 616, 1.4);

	// Waist crease and vertical panel joints; fittings paint over the ones they cross.
	line(ctx, 208, 122, 208, 244, 'rgba(109,89,122,0.2)', 1.8);
	line(ctx, 209.6, 124, 209.6, 242, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, 600, 122, 600, 244, 'rgba(109,89,122,0.2)', 1.8);
	line(ctx, 601.6, 124, 601.6, 242, 'rgba(255,255,255,0.4)', 1.2);

	// Rear door seam and its stiles.
	line(ctx, 630, 120, 630, 250, 'rgba(79,64,92,0.45)', 2);
	line(ctx, 631.6, 124, 631.6, 246, 'rgba(255,255,255,0.5)', 1.2);
	ctx.restore();

	// Silhouette re-stroke so the opaque bands keep a crisp edge.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Door, 99 roundel, serving hatch, counter, menu board and wordmark.
	sideDoor(ctx, shaded, fitted);

	circle(ctx, 252, 184, 18, CREAM, 2.6);
	ctx.strokeStyle = PLUM;
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(252, 184, 14.5, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fillStyle = PLUM;
	ctx.font = '700 14px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('99', 252, 189);
	ctx.textAlign = 'left';

	servingHatch(ctx, shaded, fitted, lit, finish);
	counter(ctx, fitted, finish);
	menuBoard(ctx, fitted, finish);

	ctx.fillStyle = PLUM;
	ctx.font = '700 17px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('ICE CREAM', 401, 241);
	ctx.textAlign = 'left';

	awning(ctx, shaded, finish);

	// The naming cue, standing proud of the roof.
	roofCone(ctx, finish);

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 72, 120, 62, 42);
		glassShade(ctx, SIDE_WINDOW, 140, 120, 54, 36);
	}

	if (fitted) {
		// Screen wiper and a chrome bonnet crease.
		line(ctx, 88, 158, 102, 132, INK, 2);
		line(ctx, 44, 191, 72, 179, 'rgba(255,255,255,0.5)', 1.6);

		// Nose: louvred grille, indicator and headlamp.
		rect(ctx, 36, 196, 13, 26, PLUM_DARK, 2, 2);
		for (let bar = 0; bar < 3; bar++) {
			line(ctx, 37.5, 202 + bar * 6, 47.5, 202 + bar * 6, CHROME, 1.6);
		}
		circle(ctx, 42.5, 229, 3.6, AMBER, 1.8);
		circle(ctx, 42.5, 240, 7.5, LAMP, 2.4);
		circle(ctx, 42.5, 240, 3.8, '#FFF7CF', 1.5);

		// Rear door hardware, lamps and plate.
		rect(ctx, 626, 204, 6, 12, STEEL, 1.5, 1.4);
		rect(ctx, 626, 230, 6, 12, STEEL, 1.5, 1.4);
		rect(ctx, 620, 212, 5, 20, CHROME, 2.5, 2);
		line(ctx, 621.5, 215, 621.5, 229, 'rgba(255,255,255,0.6)', 1.2);
		rect(ctx, 636, 208, 10, 16, RED, 2, 1.8);
		rect(ctx, 636, 228, 10, 10, AMBER, 1.5, 1.5);
		rect(ctx, 604, 238, 26, 13, CREAM, 1.5, 1.7);
		ctx.fillStyle = PLUM;
		ctx.fillRect(607, 241, 4, 7);
		ctx.fillStyle = INK;
		ctx.fillRect(614, 242, 12, 2);
		ctx.fillRect(614, 246, 8, 2);
	}

	// Bumpers: chrome blocks butted to the nose and tail, both inside the body mask.
	rect(ctx, 20, 242, 14, 20, CHROME, 3, 2.6);
	line(ctx, 22, 246, 32, 246, 'rgba(255,255,255,0.62)', 1.6);
	line(ctx, 22, 258, 32, 258, 'rgba(58,39,27,0.28)', 1.6);
	rect(ctx, 652, 246, 14, 16, CHROME, 2, 2.6);
	line(ctx, 655, 250, 663, 250, 'rgba(255,255,255,0.55)', 1.4);

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
		ctx.moveTo(106, 111.5);
		ctx.lineTo(636, 111.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(35.5, 208);
		ctx.lineTo(35.5, 244);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(650.5, 130);
		ctx.lineTo(650.5, 240);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(42.5, 240, 1, 42.5, 240, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(42.5, 240, 30, 0, Math.PI * 2);
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
		// Paint grain over the body mask only: glazing, hatch recess, trim and tyres stay clear.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${HATCH} ${AWNING} ${WHEEL_MASK} ${circleMask(
			WHEEL_R.x,
			WHEEL_R.y,
			WHEEL_R.r
		)} ${rectMask(MENU.x - 2, MENU.y - 2, MENU.w + 4, MENU.h + 4)} ${rectMask(
			290,
			201,
			224,
			20
		)} ${circleMask(252, 184, 19)}`;
		ctx.clip(new Path2D(BODY_MASK), 'evenodd');
		ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');
		let seed = 53;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 380; i++) {
			const px = 30 + rand() * 626;
			const py = 106 + rand() * 150;
			const size = 1.4 + rand() * 1.1;
			ctx.globalAlpha = 0.07 + rand() * 0.04;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 120; i++) {
			const px = 30 + rand() * 626;
			const py = 106 + rand() * 150;
			const size = 1.2 + rand() * 0.9;
			ctx.globalAlpha = 0.13 + rand() * 0.06;
			ctx.fillRect(px, py, size, size);
		}

		// Fine tooth: a denser second pass in both directions so the paint reads as brushed.
		ctx.fillStyle = INK;
		for (let i = 0; i < 320; i++) {
			const px = 30 + rand() * 626;
			const py = 106 + rand() * 150;
			const size = 0.8 + rand() * 0.7;
			ctx.globalAlpha = 0.04 + rand() * 0.035;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 160; i++) {
			const px = 30 + rand() * 626;
			const py = 106 + rand() * 150;
			const size = 0.7 + rand() * 0.6;
			ctx.globalAlpha = 0.08 + rand() * 0.05;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes across the flanks.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[44, 150, 78, 146],
			[214, 130, 292, 128],
			[516, 132, 596, 130],
			[212, 228, 286, 226],
			[520, 222, 624, 220]
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
			[232, 174, 34],
			[262, 170, 26],
			[334, 214, 18],
			[558, 176, 28],
			[590, 194, 22],
			[214, 226, 16]
		]) {
			ctx.beginPath();
			ctx.moveTo(hx, hy);
			ctx.quadraticCurveTo(hx + 1.6, hy + hh / 2, hx, hy + hh);
			ctx.stroke();
		}
		ctx.restore();

		// Roof sheen and the crisp cream swipe along the flank.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const roofSheen = ctx.createLinearGradient(0, 110, 0, 152);
		roofSheen.addColorStop(0, 'rgba(255,255,255,0.34)');
		roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = roofSheen;
		ctx.fillRect(100, 110, 552, 42);
		ctx.globalAlpha = 0.3;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(214, 192);
		ctx.quadraticCurveTo(400, 188, 594, 192);
		ctx.stroke();
		ctx.restore();

		// Glints on paint and chrome, clipped so no sparkle pokes off the silhouette.
		ctx.save();
		ctx.clip(new Path2D(BODY_MASK));
		glint(ctx, 214, 158, 5.4);
		glint(ctx, 604, 156, 4.8);
		glint(ctx, 334, 232, 4.2);
		glint(ctx, 462, 232, 3.8);
		glint(ctx, 96, 112, 4.4);
		glint(ctx, 646, 190, 3.4);

		// Pinpoint speculars on the chrome where a full sparkle would read as a blob.
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		for (const [sx, sy] of [
			[189.6, 194.2],
			[621.8, 217.4],
			[659, 252.6]
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
		ctx.moveTo(80, 154);
		ctx.lineTo(100, 128);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(148, 150);
		ctx.lineTo(160, 124);
		ctx.stroke();
		ctx.restore();

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Dashed stitch under the awning rail, roof-band rivets and body highlights.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 1.4;
		for (let sx = 292; sx < 512; sx += 9) {
			ctx.beginPath();
			ctx.moveTo(sx, 121);
			ctx.lineTo(Math.min(sx + 5, 512), 121);
			ctx.stroke();
		}
		ctx.fillStyle = CHROME;
		ctx.globalAlpha = 0.7;
		for (let rivetX = 108; rivetX <= 632; rivetX += 30) {
			if (rivetX > 280 && rivetX < 520) continue;
			ctx.beginPath();
			ctx.arc(rivetX, 114, 1.4, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
		line(ctx, 295, 204.6, 509, 204.6, 'rgba(255,255,255,0.65)', 1.4);
		line(ctx, 300, 250, 620, 250, 'rgba(255,255,255,0.18)', 1.4);
	}

	ctx.restore();
}

export function drawRealIceCreamVan(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealIceCreamVanLevel(ctx, x, y, scale, 5);
}
