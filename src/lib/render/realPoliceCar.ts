/**
 * Police car art, cut into the same five-piece kit as the other realistic vehicles.
 * A low white saloon facing left: long bonnet, raked screen, short boot deck, blue
 * battenburg down the doors and rear quarter, a red/blue roof light bar, a push bar on
 * the nose, a boot whip antenna and alloy wheels. The light bar is the one cue that
 * names the vehicle. Level 5 is the production target: shaded, fitted, lit and
 * picture-book finished.
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

const WHITE = '#F4F6FA';
const WHITE_SHADE = '#DCE3EE';
const BLUE = '#2C5AA0';
const BLUE_DARK = '#1E3F72';
const CREAM = '#FFF9EC';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const TAIL = '#FF4D6D';
const SIREN_BLUE = '#3FA9F5';

/** Art box 660 x 300, road at 272. Front (nose) faces left. */
const SHELL =
	'M48,252 L48,212 Q48,200 58,198 L188,186 L196,185 L272,126 Q276,122 286,122 L390,122 Q400,122 404,128 L456,180 Q462,186 472,186 L588,186 Q606,186 606,200 L606,252 Z';

const WHEEL_L = { x: 140, y: 240, r: 32 };
const WHEEL_R = { x: 500, y: 240, r: 32 };
const WHEEL_L_MASK = circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
const WHEEL_R_MASK = circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Raked windscreen band inside the A-pillar. */
const WINDSCREEN = 'M214,172 L276,132 L296,141 L234,178 Z';
/** Front door glass, clear of the door panel and the B-pillar. */
const FRONT_GLASS = pane(306, 136, 56, 34, 5);
/** Rear door glass, its rear edge following the C-pillar. */
const REAR_GLASS = 'M378,136 L400,136 L432,170 L378,170 Z';
const GLASS_MASK = `${WINDSCREEN} ${FRONT_GLASS} ${REAR_GLASS}`;

/** Front door panel: a clean rectangle between the beltline and the sill. */
const DOOR = { x: 238, y: 182, w: 136, h: 64 };
const DOOR_MASK = rectMask(DOOR.x, DOOR.y, DOOR.w, DOOR.h);

/** Battenburg band: three blue/white rows shared by the body and the door tile. */
const BAND = { y: 202, h: 36, cell: 22, row: 12, from: 198, to: 456 };

/** Roof light bar: a chrome foot on the roof and the lens housing above it. */
const BAR = { x: 292, y: 115, w: 92, h: 7 };
const BAR_HOUSING = { x: 294, y: 100, w: 88, h: 15 };

/** Push bar on the nose, butted to the front bumper. */
const PUSH = { x: 12, y: 206, w: 20, h: 46 };
/** Front bumper and the box grille that sits above it. */
const FRONT_BUMPER = { x: 32, y: 236, w: 16, h: 18 };
const GRILLE = { x: 36, y: 200, w: 12, h: 22 };
/** Rear bumper, butted to the tail face. */
const REAR_BUMPER = { x: 606, y: 240, w: 16, h: 16 };
/** Door mirror head, clear of the A-pillar and the glass. */
const MIRROR = { x: 196, y: 152, w: 16, h: 18 };
/** Boot whip antenna. */
const ANTENNA = { x: 552, y: 136, w: 38, h: 50 };

// The body mask is the shell plus every fitting that stands outside it. Subpaths only
// touch, never overlap, so the evenodd clip cannot punch a hole in the shell.
const BODY_MASK = `${SHELL} ${rectMask(BAR.x, BAR.y, BAR.w, BAR.h)} ${rectMask(BAR_HOUSING.x, BAR_HOUSING.y, BAR_HOUSING.w, BAR_HOUSING.h)} ${rectMask(PUSH.x, PUSH.y, PUSH.w, PUSH.h)} ${rectMask(FRONT_BUMPER.x, FRONT_BUMPER.y, FRONT_BUMPER.w, FRONT_BUMPER.h)} ${rectMask(GRILLE.x, GRILLE.y, GRILLE.w, GRILLE.h)} ${rectMask(REAR_BUMPER.x, REAR_BUMPER.y, REAR_BUMPER.w, REAR_BUMPER.h)} ${rectMask(MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h)} ${rectMask(ANTENNA.x, ANTENNA.y, ANTENNA.w, ANTENNA.h)}`;

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

/**
 * Paint shading shared by the body and the front-door tile: roof light, a cool mid and a
 * deep blue rocker. Position-based, so the door tile lands on the same values as the shell.
 */
function paintBody(ctx: CanvasRenderingContext2D, clip: string): void {
	ctx.save();
	ctx.clip(new Path2D(clip));

	const paint = ctx.createLinearGradient(0, 122, 0, 252);
	paint.addColorStop(0, 'rgba(255,255,255,0.72)');
	paint.addColorStop(0.16, 'rgba(255,255,255,0.16)');
	paint.addColorStop(0.56, 'rgba(44,90,160,0.03)');
	paint.addColorStop(1, 'rgba(30,63,114,0.22)');
	ctx.fillStyle = paint;
	ctx.fillRect(10, 100, 620, 160);

	const roof = ctx.createLinearGradient(0, 122, 0, 156);
	roof.addColorStop(0, 'rgba(255,255,255,0.5)');
	roof.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roof;
	ctx.fillRect(274, 122, 128, 34);

	const rocker = ctx.createLinearGradient(0, 230, 0, 252);
	rocker.addColorStop(0, 'rgba(30,63,114,0)');
	rocker.addColorStop(1, 'rgba(30,63,114,0.28)');
	ctx.fillStyle = rocker;
	ctx.fillRect(44, 230, 566, 24);
	ctx.restore();
}

/** Blue/white checks, phase-locked to a fixed grid so body and door meet seamlessly. */
function battenburg(
	ctx: CanvasRenderingContext2D,
	from: number,
	to: number,
	y: number,
	h: number,
	cell: number,
	row: number
): void {
	const first = Math.floor(from / cell);
	const last = Math.ceil(to / cell);
	const rows = Math.round(h / row);
	for (let column = first; column < last; column++) {
		const x = Math.max(from, column * cell);
		const right = Math.min(to, (column + 1) * cell);
		if (right <= x) continue;
		for (let r = 0; r < rows; r++) {
			if ((column + r) % 2 !== 0) continue;
			ctx.fillStyle = BLUE;
			ctx.fillRect(x, y + r * row, right - x, row);
		}
	}
}

/** The livery band, clipped by the caller. */
function liveryBand(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	const { y, h, cell, row, from, to } = BAND;
	battenburg(ctx, from, to, y, h, cell, row);
	// Fine dark grid over the checks, so the squares read at game scale.
	ctx.strokeStyle = 'rgba(30,63,114,0.3)';
	ctx.lineWidth = 1;
	for (let x = Math.ceil(from / cell) * cell; x < to; x += cell) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y + h);
		ctx.stroke();
	}
	for (let r = 1; r < Math.round(h / row); r++) {
		ctx.beginPath();
		ctx.moveTo(from, y + r * row);
		ctx.lineTo(to, y + r * row);
		ctx.stroke();
	}
	if (shaded) {
		line(ctx, from, y + 1.2, to, y + 1.2, 'rgba(255,255,255,0.45)', 1.6);
		line(ctx, from, y + h - 1.2, to, y + h - 1.2, 'rgba(30,63,114,0.42)', 1.8);
	}
	line(ctx, from, y, to, y, INK, 1.6);
	line(ctx, from, y + h, to, y + h, INK, 1.6);
}

/** Roof light bar: chrome foot, blue housing, red and blue lenses. */
function lightBar(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	// Foot on the roof.
	rect(ctx, BAR.x, BAR.y, BAR.w, BAR.h, CHROME, 2, 2.4);
	line(ctx, BAR.x + 4, BAR.y + 2, BAR.x + BAR.w - 4, BAR.y + 2, 'rgba(255,255,255,0.7)', 1.3);

	// Housing.
	rect(ctx, BAR_HOUSING.x, BAR_HOUSING.y, BAR_HOUSING.w, BAR_HOUSING.h, BLUE_DARK, 3, 2.6);

	if (shaded) {
		const face = ctx.createLinearGradient(0, BAR_HOUSING.y, 0, BAR_HOUSING.y + BAR_HOUSING.h);
		face.addColorStop(0, 'rgba(255,255,255,0.34)');
		face.addColorStop(0.45, 'rgba(255,255,255,0.05)');
		face.addColorStop(1, 'rgba(0,0,0,0.3)');
		ctx.fillStyle = face;
		ctx.fillRect(BAR_HOUSING.x + 2, BAR_HOUSING.y + 2, BAR_HOUSING.w - 4, BAR_HOUSING.h - 4);
	}

	// Lenses: red at the nose end, clear in the middle, blue at the tail end.
	rect(ctx, 298, 104, 24, 7, TAIL, 2, 1.5);
	rect(ctx, 326, 104, 26, 7, '#E8F4FF', 2, 1.2);
	rect(ctx, 356, 104, 22, 7, SIREN_BLUE, 2, 1.5);
	line(ctx, 300, 105.4, 320, 105.4, 'rgba(255,255,255,0.6)', 1.2);
	line(ctx, 330, 105.4, 348, 105.4, 'rgba(255,255,255,0.75)', 1.2);
	line(ctx, 358, 105.4, 376, 105.4, 'rgba(255,255,255,0.5)', 1.2);

	if (fitted) {
		// End caps and the mounting bolts on the foot.
		rect(ctx, 296, 102, 4, 11, CHROME, 1.5, 1.4);
		rect(ctx, 376, 102, 4, 11, CHROME, 1.5, 1.4);
		circle(ctx, 300, 118.5, 1.7, CHROME, 1);
		circle(ctx, 376, 118.5, 1.7, CHROME, 1);
	}

	if (finish) {
		glint(ctx, 340, 107.5, 2.4);
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.beginPath();
		ctx.arc(310, 107.2, 0.9, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(368, 107.2, 0.9, 0, Math.PI * 2);
		ctx.fill();

		// Lens modules: faint LED dividers, a bright emitter row and the bezel lips.
		for (const [lensX, lensW] of [
			[298, 24],
			[326, 26],
			[356, 22]
		] as const) {
			const step = lensW / 4;
			ctx.save();
			ctx.beginPath();
			ctx.rect(lensX + 1, 104.6, lensW - 2, 6.2);
			ctx.clip();
			for (let i = 1; i < 4; i++) {
				line(
					ctx,
					lensX + i * step,
					105,
					lensX + i * step,
					110.4,
					'rgba(30,63,114,0.22)',
					0.9
				);
			}
			ctx.fillStyle = lensX === 326 ? 'rgba(150,190,220,0.9)' : 'rgba(255,255,255,0.85)';
			for (let i = 0; i < 4; i++) {
				ctx.fillRect(lensX + 2.4 + i * step, 108.7, 2, 1.5);
			}
			ctx.restore();
			line(ctx, lensX + 2, 109.8, lensX + lensW - 2, 109.8, 'rgba(255,255,255,0.45)', 0.9);
			line(ctx, lensX + 2, 105, lensX + lensW - 2, 105, 'rgba(255,255,255,0.55)', 0.8);
		}

		// Housing bevels, end-cap edges and the slotted foot screws.
		line(
			ctx,
			BAR_HOUSING.x + 3,
			BAR_HOUSING.y + 1,
			BAR_HOUSING.x + BAR_HOUSING.w - 3,
			BAR_HOUSING.y + 1,
			'rgba(255,255,255,0.4)',
			1
		);
		line(
			ctx,
			BAR_HOUSING.x + 3,
			BAR_HOUSING.y + BAR_HOUSING.h - 1,
			BAR_HOUSING.x + BAR_HOUSING.w - 3,
			BAR_HOUSING.y + BAR_HOUSING.h - 1,
			'rgba(0,0,0,0.34)',
			1.1
		);
		line(ctx, 297.2, 102.4, 297.2, 112.6, 'rgba(255,255,255,0.6)', 0.9);
		line(ctx, 378.8, 102.4, 378.8, 112.6, 'rgba(255,255,255,0.6)', 0.9);
		for (const screwX of [300, 376]) {
			line(ctx, screwX - 1.3, 118.5, screwX + 1.3, 118.5, 'rgba(58,39,27,0.5)', 0.9);
		}
	}
}

/** Push bar: three rails on two uprights, bracketed back to the bumper. */
function pushBar(ctx: CanvasRenderingContext2D, shaded: boolean, finish: boolean): void {
	const bar = (x: number, y: number, w: number, h: number): void => {
		rect(ctx, x, y, w, h, STEEL, 1.5, 2);
		if (shaded) {
			line(ctx, x + 1.4, y + 1.4, x + w - 1.4, y + 1.4, 'rgba(255,255,255,0.45)', 1.2);
		}
		if (finish) {
			line(ctx, x + 1.2, y + h - 1.1, x + w - 1.2, y + h - 1.1, 'rgba(0,0,0,0.24)', 1);
		}
	};

	bar(14, 208, 7, 44);
	bar(23, 208, 7, 44);
	bar(12, 214, 19, 6);
	bar(12, 230, 19, 6);
	bar(12, 246, 19, 6);

	// Corner brackets that land on the bumper.
	rect(ctx, 28, 216, 5, 30, STEEL, 1.5, 1.8);
	if (shaded) {
		line(ctx, 29, 218, 29, 244, 'rgba(255,255,255,0.4)', 1.1);
	}

	if (finish) {
		// Chrome bolts at every rail/upright crossing, plus the bracket bolt.
		for (const [boltX, boltY] of [
			[17.5, 217],
			[26.5, 217],
			[17.5, 233],
			[26.5, 233],
			[17.5, 249],
			[26.5, 249]
		]) {
			circle(ctx, boltX, boltY, 1.5, CHROME, 0.9);
			ctx.fillStyle = 'rgba(255,255,255,0.88)';
			ctx.beginPath();
			ctx.arc(boltX - 0.5, boltY - 0.5, 0.6, 0, Math.PI * 2);
			ctx.fill();
		}
		circle(ctx, 30.5, 240, 1.3, CHROME, 0.9);

		// Long specular down the leading rail and a sparkle on the top rail.
		line(ctx, 15.3, 209.6, 15.3, 250.4, 'rgba(255,255,255,0.55)', 1.1);
		line(ctx, 13.2, 217, 13.2, 249, 'rgba(255,255,255,0.35)', 1);
		line(ctx, 23.9, 235, 23.9, 245, 'rgba(255,255,255,0.3)', 1);
		glint(ctx, 22, 217, 2.2);
	}
}

/** Door mirror on a short arm; the arm lands on the A-pillar. */
function mirror(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	line(ctx, 206, 168, 216, 172, INK, 3.4);
	line(ctx, 206, 168, 216, 172, STEEL, 2.2);
	rect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, BLUE_DARK, 3, 2.4);
	if (shaded) {
		rect(ctx, MIRROR.x + 3, MIRROR.y + 3, MIRROR.w - 6, MIRROR.h - 6, GLASS, 1.4);
		line(ctx, MIRROR.x + 4, MIRROR.y + 5, MIRROR.x + 4, MIRROR.y + 15, 'rgba(255,255,255,0.45)', 1.2);
	}
}

/** Boot whip antenna: a mount, a tapering whip and a tip bead. */
function antenna(ctx: CanvasRenderingContext2D, shaded: boolean, finish: boolean): void {
	rect(ctx, 554, 178, 12, 8, STEEL, 2, 2);
	if (shaded) {
		line(ctx, 556, 180, 564, 180, 'rgba(255,255,255,0.4)', 1.1);
	}
	line(ctx, 558, 180, 570, 141, INK, 2.6);
	line(ctx, 558, 180, 570, 141, CHROME, 1.5);
	circle(ctx, 570, 139, 2, CHROME, 1.2);
	if (finish) {
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.beginPath();
		ctx.arc(570.6, 138.2, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** Front face: grille, lamp, indicator, plate and bumper. */
function nose(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	rect(ctx, GRILLE.x, GRILLE.y, GRILLE.w, GRILLE.h, '#39404C', 2, 2.2);
	for (let bar = 0; bar < 4; bar++) {
		line(ctx, 38, 204 + bar * 5, 46, 204 + bar * 5, CHROME, 1.3);
	}
	rect(ctx, GRILLE.x, GRILLE.y, GRILLE.w, 3, CHROME, 1, 1.6);

	// Front bumper: chrome block, butted to the shell.
	rect(ctx, FRONT_BUMPER.x, FRONT_BUMPER.y, FRONT_BUMPER.w, FRONT_BUMPER.h, CHROME, 3, 2.6);
	if (shaded) {
		line(ctx, 34, 239, 46, 239, 'rgba(255,255,255,0.72)', 1.5);
		line(ctx, 34, 251, 46, 251, 'rgba(58,39,27,0.28)', 1.4);
	}

	if (fitted) {
		rect(ctx, 36, 240, 10, 8, CREAM, 1.2, 1.4);
		line(ctx, 38, 244, 44, 244, INK, 1.2);

		// Headlamp and indicator, both clear of the grille.
		circle(ctx, 56, 212, 7, LAMP, 2.4);
		circle(ctx, 56, 212, 3.4, '#FFF7CF', 1.4);
		rect(ctx, 50, 228, 12, 5, AMBER, 1.5, 1.5);
		line(ctx, 52, 231.6, 60, 231.6, 'rgba(255,255,255,0.55)', 1);

		// Bonnet shut line and the crease that runs to the screen.
		line(ctx, 60, 201, 194, 187, 'rgba(30,63,114,0.4)', 1.6);
		line(ctx, 60, 202.4, 194, 188.4, 'rgba(255,255,255,0.42)', 1.2);
	}
}

/** Tail: lamp cluster, plate, bumper and exhaust. */
function tail(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	rect(ctx, 594, 196, 10, 20, TAIL, 2, 2);
	rect(ctx, 594, 218, 10, 8, AMBER, 1.5, 1.5);
	if (shaded) {
		line(ctx, 596, 198, 596, 214, 'rgba(255,255,255,0.4)', 1.2);
	}

	rect(ctx, REAR_BUMPER.x, REAR_BUMPER.y, REAR_BUMPER.w, REAR_BUMPER.h, CHROME, 3, 2.6);
	if (shaded) {
		line(ctx, 608, 243, 620, 243, 'rgba(255,255,255,0.6)', 1.4);
	}

	if (fitted) {
		rect(ctx, 582, 236, 20, 10, CREAM, 1.5, 1.5);
		line(ctx, 585, 241, 599, 241, INK, 1.6);

		// Exhaust tip under the bumper.
		rect(ctx, 608, 250, 11, 6, STEEL, 1.5, 1.7);
		line(ctx, 610, 251.4, 617, 251.4, 'rgba(255,255,255,0.35)', 1.1);

		// Boot shut line.
		line(ctx, 476, 187.4, 584, 187.4, 'rgba(30,63,114,0.35)', 1.4);
	}
}

/** Front door tile: seam, livery, handle and lock, cut to the door rectangle. */
function frontDoor(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	const { x, y, w, h } = DOOR;

	rect(ctx, x, y, w, h, WHITE, 0, 0);
	if (shaded) paintBody(ctx, DOOR_MASK);

	ctx.save();
	ctx.clip(new Path2D(DOOR_MASK));
	liveryBand(ctx, shaded);
	ctx.restore();

	// Front and rear shut lines, plus the handle recess.
	line(ctx, x + 0.9, y + 2, x + 0.9, y + h, 'rgba(30,63,114,0.45)', 2);
	line(ctx, x + 2.4, y + 4, x + 2.4, y + h, 'rgba(255,255,255,0.5)', 1.2);
	line(ctx, x + w - 1.1, y + 2, x + w - 1.1, y + h, 'rgba(30,63,114,0.45)', 2);
	line(ctx, x + w - 2.6, y + 4, x + w - 2.6, y + h, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, x + 2, y + 2, x + w - 2, y + 2, 'rgba(30,63,114,0.3)', 1.6);

	if (fitted) {
		rect(ctx, 346, 187, 18, 5, CHROME, 2, 1.8);
		line(ctx, 349, 189.5, 361, 189.5, 'rgba(58,39,27,0.3)', 1.1);
		circle(ctx, 336, 190, 1.4, INK, 1);
	}
}

/** Filled wheel-arch band sitting just outside the tyre. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 9, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = BLUE;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.4)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5.4, Math.PI * 1.1, Math.PI * 1.9);
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
 * Picture-book alloy hub: bright rim ring, six bolt heads, dish shadow and a polished
 * centre cap. Every mark is mirror-symmetric about the hub centre, so the flipped rear
 * wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.22)';
	ctx.lineWidth = 2.4;
	for (const [from, to] of [
		[Math.PI * 1.08, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.92]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.86, from, to);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	// Inner rim line, so the dish reads as a stepped alloy rather than a flat plate.
	ctx.strokeStyle = 'rgba(255,255,255,0.32)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.37, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.3, CHROME, 1.2);
		// Specular sits inward along the radial line, so the whole set mirrors with the wheel.
		ctx.fillStyle = 'rgba(255,255,255,0.88)';
		ctx.beginPath();
		ctx.arc(bx - Math.cos(a) * 0.8, by - Math.sin(a) * 0.8, 0.85, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, 0.18 * Math.PI, 0.82 * Math.PI);
	ctx.stroke();
	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.fillStyle = 'rgba(58,39,27,0.45)';
	ctx.beginPath();
	ctx.arc(x, y, r * 0.05, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = 'rgba(255,255,255,0.9)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.1, Math.PI * 1.06, Math.PI * 1.6);
	ctx.stroke();
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x - 0.7, y - 0.8, 0.9, 0, Math.PI * 2);
	ctx.fill();

	// Valve cap on the crown, on a short stem: mirror-safe at the centre line.
	line(ctx, x, y - r * 0.47, x, y - r * 0.62, CHROME, 1.5);
	circle(ctx, x, y - r * 0.55, 2.1, CHROME, 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.9)';
	ctx.beginPath();
	ctx.arc(x - 0.6, y - r * 0.55 - 0.7, 0.7, 0, Math.PI * 2);
	ctx.fill();

	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 1.5;
	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.94]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.62, from, to);
		ctx.stroke();
	}
}

/** Paint grain over the shell only: glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${WHEEL_L_MASK} ${WHEEL_R_MASK}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(48, 122, 606, 252);
	wash.addColorStop(0, 'rgba(255,255,255,0.1)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(30,63,114,0.09)');
	ctx.fillStyle = wash;
	ctx.fillRect(48, 122, 558, 130);

	let seed = 71;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 620; i++) {
		const px = 52 + rand() * 550;
		const py = 126 + rand() * 124;
		const size = 1.3 + rand() * 1.1;
		ctx.globalAlpha = 0.09 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 230; i++) {
		const px = 52 + rand() * 550;
		const py = 126 + rand() * 124;
		const size = 1.1 + rand() * 0.9;
		ctx.globalAlpha = 0.16 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Coarser mottling where the coat thins: bonnet, flank and boot deck.
	for (const [mx, my, mr] of [
		[104, 212, 13],
		[292, 214, 15],
		[452, 196, 10],
		[520, 202, 9],
		[344, 126, 8]
	]) {
		ctx.globalAlpha = 0.05;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.arc(mx, my, mr, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.06;
		ctx.fillStyle = '#FFFFFF';
		ctx.beginPath();
		ctx.arc(mx - mr * 0.45, my - mr * 0.5, mr * 0.6, 0, Math.PI * 2);
		ctx.fill();
	}

	// Dry-brush flicks: short near-horizontal strokes where the paint thins out.
	ctx.lineWidth = 1.1;
	for (let i = 0; i < 34; i++) {
		const sx = 56 + rand() * 540;
		const sy = 130 + rand() * 116;
		const len = 6 + rand() * 13;
		ctx.globalAlpha = 0.1 + rand() * 0.06;
		ctx.strokeStyle = INK;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo(sx + len / 2, sy - 1.2, sx + len, sy + rand() * 1.2);
		ctx.stroke();
	}
	for (let i = 0; i < 20; i++) {
		const sx = 56 + rand() * 540;
		const sy = 130 + rand() * 116;
		const len = 5 + rand() * 11;
		ctx.globalAlpha = 0.13 + rand() * 0.07;
		ctx.strokeStyle = '#FFFFFF';
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo(sx + len / 2, sy - 1, sx + len, sy + rand());
		ctx.stroke();
	}

	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.4;
	for (const [sx, sy, ex, ey] of [
		[64, 208, 150, 206],
		[196, 196, 236, 194],
		[430, 192, 512, 190],
		[470, 240, 548, 239],
		[62, 236, 100, 235],
		[120, 232, 172, 231],
		[382, 210, 430, 209]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 1.8, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/**
 * Picture-book livery: one sheen and one per-tile bevel pass over the whole band, drawn
 * once at the end so the body and the door tile land on exactly the same marks.
 */
function battenburgFinish(ctx: CanvasRenderingContext2D): void {
	const { y, h, cell, row, from, to } = BAND;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.beginPath();
	ctx.rect(from, y, to - from, h);
	ctx.clip();

	const sheen = ctx.createLinearGradient(from, y, to, y + h);
	sheen.addColorStop(0, 'rgba(255,255,255,0.22)');
	sheen.addColorStop(0.45, 'rgba(255,255,255,0.04)');
	sheen.addColorStop(0.82, 'rgba(255,255,255,0)');
	sheen.addColorStop(1, 'rgba(30,63,114,0.12)');
	ctx.fillStyle = sheen;
	ctx.fillRect(from, y, to - from, h);

	const first = Math.floor(from / cell);
	const last = Math.ceil(to / cell);
	const rows = Math.round(h / row);
	for (let column = first; column < last; column++) {
		const left = Math.max(from, column * cell);
		const right = Math.min(to, (column + 1) * cell);
		if (right - left < 3) continue;
		for (let r = 0; r < rows; r++) {
			if ((column + r) % 2 !== 0) continue;
			const top = y + r * row;
			line(ctx, left + 1, top + 1, right - 1, top + 1, 'rgba(255,255,255,0.4)', 1);
			line(ctx, left + 1, top + row - 1, right - 1, top + row - 1, 'rgba(0,0,0,0.24)', 1);
			line(ctx, left + 1, top + 2, left + 1, top + row - 2, 'rgba(255,255,255,0.18)', 0.9);
			line(ctx, right - 1, top + 2, right - 1, top + row - 2, 'rgba(15,35,65,0.2)', 0.9);
		}
	}

	// Joint gloss under the band lip, so the vinyl reads as laid film.
	line(ctx, from + 2, y + 1.4, to - 2, y + 1.4, 'rgba(255,255,255,0.26)', 1);
	ctx.restore();
}

/** Finishing marks: rivets, lamp sparkles, stone chips, dust and the exhaust puff. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// Light-bar lens sparkles and the housing rivets.
	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[302.6, 105.2, 1],
		[362.6, 105.2, 1],
		[56, 209.4, 1.4],
		[300, 118.5, 0.8],
		[376, 118.5, 0.8],
		[46.4, 201.6, 0.8],
		[565, 182.4, 0.9],		[618, 251.8, 0.9]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	// Lamp lips.
	line(ctx, 52, 229.2, 60, 229.2, 'rgba(255,255,255,0.6)', 1.1);
	line(ctx, 594.6, 197, 603.4, 197, 'rgba(255,255,255,0.6)', 1.1);
	line(ctx, 594.6, 218.8, 603.4, 218.8, 'rgba(255,255,255,0.55)', 1.1);

	// Headlamp crest and the grille chrome lip.
	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(56, 212, 5.2, Math.PI * 1.06, Math.PI * 1.62);
	ctx.stroke();
	line(ctx, 37, 203.4, 47, 203.4, 'rgba(255,255,255,0.4)', 1);

	// Bumper chrome sparkle.
	line(ctx, 608.4, 242.6, 619.4, 242.6, 'rgba(255,255,255,0.55)', 1.1);
	line(ctx, 33.4, 249.4, 46, 249.4, 'rgba(255,255,255,0.4)', 1);

	// Reflectors on the blue checks, aligned to the vinyl grid.
	glint(ctx, 231, 208, 2.2);
	glint(ctx, 275, 232, 2);

	// Door and mirror gloss.
	line(ctx, 349, 188.4, 361, 188.4, 'rgba(255,255,255,0.6)', 1);
	line(ctx, MIRROR.x + 4.4, MIRROR.y + 5, MIRROR.x + 4.4, MIRROR.y + 13, 'rgba(255,255,255,0.6)', 1);

	// Mudguard hardware and the lit arch crowns.
	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		circle(ctx, wheelX, WHEEL_L.y - WHEEL_L.r - 7.4, 1.5, CHROME, 0.9);
		ctx.strokeStyle = 'rgba(255,255,255,0.48)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 6.6, Math.PI * 1.18, Math.PI * 1.82);
		ctx.stroke();
	}

	// Stone chips where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.42;
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, chipR] of [
		[70, 248, 1.1],
		[186, 249, 1],
		[300, 250, 1.2],
		[430, 249, 1.1],
		[586, 248, 1],
		[128, 247, 0.9],
		[508, 246, 1],
		[612, 246, 0.9]
	]) {
		ctx.beginPath();
		ctx.arc(chipX, chipY, chipR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Garage dust low on the flank.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	for (const [dustX, dustY, dustR] of [
		[392, 244, 1.4],
		[456, 242, 1.2],
		[566, 240, 1.1],
		[240, 245, 1]
	]) {
		ctx.beginPath();
		ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// A short exhaust puff, drifting back from the tail, with a pale core.
	ctx.save();
	ctx.globalAlpha = 0.32;
	ctx.fillStyle = '#EEF2F8';
	for (const [puffX, puffY, puffR] of [
		[623, 252, 4.5],
		[630, 248, 3.4],
		[635, 243, 2.4],
		[631, 253.6, 2.2]
	]) {
		ctx.beginPath();
		ctx.arc(puffX, puffY, puffR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.globalAlpha = 0.42;
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(626.4, 249.6, 1.7, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

export function drawRealPoliceCarLevel(
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
		ctx.ellipse(327, 281, 300, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell.
	shape(ctx, SHELL, WHITE);

	if (shaded) paintBody(ctx, SHELL);

	// Livery, beltline and skirts, clipped so they follow the shell edge.
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	liveryBand(ctx, shaded);

	// Blue beltline trim, under the glass but above the door panel.
	rect(ctx, 198, 174, 274, 7, BLUE, 0, 0);
	line(ctx, 198, 175.2, 472, 175.2, 'rgba(255,255,255,0.5)', 1.4);
	line(ctx, 198, 180, 472, 180, 'rgba(30,63,114,0.4)', 1.4);

	// Blue rocker, well clear of the door bottom.
	rect(ctx, 46, 246, 556, 6, BLUE, 0, 0);
	line(ctx, 48, 247.2, 600, 247.2, 'rgba(255,255,255,0.28)', 1.2);

	// Panel seams: cowl, boot lid and the C-pillar joint.
	line(ctx, 196, 186, 196, 244, 'rgba(30,63,114,0.3)', 1.6);
	line(ctx, 197.6, 190, 197.6, 242, 'rgba(255,255,255,0.4)', 1.1);
	line(ctx, 474, 188, 474, 244, 'rgba(30,63,114,0.3)', 1.6);
	line(ctx, 475.6, 192, 475.6, 242, 'rgba(255,255,255,0.4)', 1.1);

	// Wordmark on the rear quarter, above the band and clear of the door tile.
	ctx.fillStyle = BLUE;
	ctx.font = '700 11px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('POLICE', 388, 199);
	ctx.textAlign = 'left';

	ctx.restore();

	// Silhouette re-stroke so the opaque bands keep a crisp edge.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Light bar on the roof and the door glass.
	lightBar(ctx, shaded, fitted, finish);
	if (fitted) {
		mirror(ctx, shaded);
		antenna(ctx, shaded, finish);
	}

	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, FRONT_GLASS, GLASS, 2.5);
	shape(ctx, REAR_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 214, 132, 82, 46);
		glassShade(ctx, FRONT_GLASS, 306, 136, 56, 34);
		glassShade(ctx, REAR_GLASS, 378, 136, 54, 34);
	}

	// Front door tile art, then nose and tail fittings.
	frontDoor(ctx, shaded, fitted);
	nose(ctx, shaded, fitted);
	tail(ctx, shaded, fitted);
	if (fitted) pushBar(ctx, shaded, finish);

	// Dark wheel wells, so the tyres sit in the body rather than on it.
	for (const hub of [WHEEL_L, WHEEL_R]) {
		ctx.beginPath();
		ctx.arc(hub.x, hub.y, hub.r + 3, 0, Math.PI * 2);
		ctx.fillStyle = '#33373F';
		ctx.fill();
	}

	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: roof, bonnet and the tail corner.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(286, 123.6);
		ctx.lineTo(388, 123.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(62, 198.6);
		ctx.lineTo(186, 187.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(604.6, 202);
		ctx.lineTo(604.6, 238);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(56, 212, 1, 56, 212, 24);
		glow.addColorStop(0, 'rgba(255,244,168,0.6)');
		glow.addColorStop(0.45, 'rgba(255,240,150,0.24)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(56, 212, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 271, 28, 4.5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		battenburgFinish(ctx);

		// Glints on the bonnet, flank and boot. Clipped to the shell so no arm of a
		// sparkle can float outside the paint silhouette.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		glint(ctx, 132, 194, 4.2);
		glint(ctx, 228, 168, 3.6);
		glint(ctx, 292, 152, 3.2);
		glint(ctx, 418, 178, 4);
		glint(ctx, 544, 190, 4.4);
		glint(ctx, 64, 214, 3.2);

		// Secondary glints: nose, cowl, roof, boot, rear quarter and sill.
		glint(ctx, 96, 210, 3.2);
		glint(ctx, 182, 204, 2.8);
		glint(ctx, 322, 127, 3);
		glint(ctx, 510, 194, 3.2);
		glint(ctx, 466, 200, 2.6);
		glint(ctx, 382, 242.6, 2.4);
		ctx.restore();

		// Glass sheen: one raked streak in the screen and a sparkle in the door glass.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(224, 172);
		ctx.lineTo(266, 138);
		ctx.stroke();
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(312, 166);
		ctx.lineTo(332, 142);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 340, 150, 2.6);

		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealPoliceCar(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealPoliceCarLevel(ctx, x, y, scale, 5);
}
