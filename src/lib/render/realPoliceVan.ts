/**
 * Police van art, cut into the same five-piece kit as the other realistic vehicles.
 * A boxy navy-and-white patrol van facing left: a roof light bar over the cab, battenburg
 * checks along the flank, small barred windows, a sliding side door, twin rear doors, a
 * short bonnet with a lamp cluster and the POLICE wordmark. Level 5 is the production
 * target: shaded, fitted, lit and picture-book finished.
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

const NAVY = '#1D3557';
const NAVY_DARK = '#142640';
const WHITE = '#F1FAEE';
const WHITE_SHADE = '#D8E5E0';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';
const BLUE = '#3A86FF';

/** Art box 720 x 340, road at 272. Front (nose) faces left. */
const SHELL =
	'M30,258 L30,202 Q30,192 40,189 L80,182 L118,98 Q122,88 134,88 L676,88 Q690,88 690,102 L690,242 Q690,258 674,258 Z';

/** Navy cap along the roof edge. */
const ROOF_BAND = { x: 118, y: 88, w: 570, h: 12 };

/** Roof light bar: the one cue that names the vehicle. Sits on the roof line at y=88. */
const LIGHT_BAR = { x: 156, y: 60, w: 150, h: 28 };

/** Battenburg checks: two staggered rows of 26 px tiles. */
const BAND = { x: 140, y: 172, cols: 21, tile: 26, rows: 2 };

/** Sliding side door, cut out as the door piece. Clear of every pane. */
const DOOR = { x: 300, y: 108, w: 126, h: 142 };

/** Twin rear doors at the right-hand end of the flank. */
const REAR_DOOR = { x: 604, y: 106, w: 72, h: 134 };

/** Door-mounted mirror, head outside the shell on a short arm. */
const MIRROR = { x: 62, y: 122, w: 18, h: 36 };

/** Underbody strip between the axles, part of the body cut-out. */
const UNDERBODY = { x: 190, y: 258, w: 350, h: 8 };

const BUMPER_F = { x: 16, y: 236, w: 14, h: 26 };
const BUMPER_R = { x: 690, y: 240, w: 12, h: 18 };

const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 580, y: 236, r: 36 };

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Windshield glass in side view: a raked band inside the A-pillar. */
const WINDSCREEN = 'M94,172 L120,110 L148,116 L122,180 Z';
const CAB_GLASS = pane(166, 106, 62, 52, 5);
const BARRED_A = pane(246, 116, 36, 40, 3);
const BARRED_B = pane(448, 116, 36, 40, 3);
const REAR_GLASS_L = pane(613, 116, 23, 32, 2);
const REAR_GLASS_R = pane(645, 116, 23, 32, 2);
const GLASS_MASK = [
	WINDSCREEN,
	CAB_GLASS,
	BARRED_A,
	BARRED_B,
	REAR_GLASS_L,
	REAR_GLASS_R
].join(' ');

// The spec body mask is the shell plus the light bar, both bumpers, the mirror head on its
// short arm and the underbody strip. The arm's outer edge lies exactly on the A-pillar, so
// no subpath overlaps another and the evenodd clip cannot punch a hole.

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
	ctx.fillStyle = NAVY;
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

/** Window security bars: an ink bar over a narrow steel highlight. */
function bars(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	count: number,
	finish = false
): void {
	if (finish) {
		// Reflected light on the glass behind the bars, clipped to the pane.
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 1, y + 1, w - 2, h - 2);
		ctx.clip();
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.7;
		ctx.beginPath();
		ctx.moveTo(x + 4, y + h - 6);
		ctx.lineTo(x + w * 0.56, y + 5);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 1.05;
		ctx.beginPath();
		ctx.moveTo(x + w - 5, y + h - 4);
		ctx.lineTo(x + w * 0.72, y + 6);
		ctx.stroke();
		line(ctx, x + 2.6, y + 2.4, x + w - 2.6, y + 2.4, 'rgba(255,255,255,0.38)', 1.2);
		ctx.restore();
	}

	for (let i = 1; i <= count; i++) {
		const barX = x + (w * i) / (count + 1);
		line(ctx, barX, y + 1.5, barX, y + h - 1.5, INK, 3.2);
		line(ctx, barX + 0.7, y + 2, barX + 0.7, y + h - 2, '#AEB9C9', 1.3);
		if (finish) {
			// White edge and end caps make each bar read as painted metal.
			line(ctx, barX - 0.8, y + 2.4, barX - 0.8, y + h - 2.4, 'rgba(255,255,255,0.5)', 0.8);
			ctx.fillStyle = 'rgba(255,255,255,0.92)';
			ctx.beginPath();
			ctx.arc(barX + 0.7, y + 2.9, 0.9, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(barX + 0.7, y + h - 2.9, 0.8, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	line(ctx, x + 1.5, y + h / 2, x + w - 1.5, y + h / 2, INK, 2.4);
	line(ctx, x + 2, y + h / 2 + 0.8, x + w - 2, y + h / 2 + 0.8, '#AEB9C9', 1.2);
	if (finish) {
		line(ctx, x + 3, y + h / 2 - 1.3, x + w - 3, y + h / 2 - 1.3, 'rgba(255,255,255,0.5)', 0.8);
		circle(ctx, x + w - 3.4, y + h / 2 + 0.4, 0.9, CHROME, 0.8);
		circle(ctx, x + 3.4, y + h / 2 + 0.4, 0.8, CHROME, 0.7);
	}
}

/** The roof light bar: navy housing, blue and red lenses, base rail and mounting feet. */
function lightBar(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	const { x, y, w, h } = LIGHT_BAR;

	rect(ctx, x, y, w, h, NAVY, 5, 2.8);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 1, y + 1, w - 2, h - 2);
		ctx.clip();
		const shellPaint = ctx.createLinearGradient(0, y, 0, y + h);
		shellPaint.addColorStop(0, 'rgba(255,255,255,0.3)');
		shellPaint.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		shellPaint.addColorStop(1, 'rgba(0,0,0,0.28)');
		ctx.fillStyle = shellPaint;
		ctx.fillRect(x, y, w, h);
		ctx.restore();
	}

	// Lenses, flat fills at level 1 so the bar reads as a police light bar at a glance.
	rect(ctx, 167, 66, 58, 14, BLUE, 2, 2.2);
	rect(ctx, 235, 66, 58, 14, RED, 2, 2.2);
	rect(ctx, 225, 66, 10, 14, NAVY_DARK, 1, 1.6);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(167, 66, 58, 14);
		ctx.clip();
		const blueGlass = ctx.createLinearGradient(0, 66, 0, 80);
		blueGlass.addColorStop(0, 'rgba(255,255,255,0.55)');
		blueGlass.addColorStop(0.5, 'rgba(255,255,255,0.06)');
		blueGlass.addColorStop(1, 'rgba(20,38,64,0.24)');
		ctx.fillStyle = blueGlass;
		ctx.fillRect(167, 66, 58, 14);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(235, 66, 58, 14);
		ctx.clip();
		const redGlass = ctx.createLinearGradient(0, 66, 0, 80);
		redGlass.addColorStop(0, 'rgba(255,255,255,0.55)');
		redGlass.addColorStop(0.5, 'rgba(255,255,255,0.06)');
		redGlass.addColorStop(1, 'rgba(20,38,64,0.24)');
		ctx.fillStyle = redGlass;
		ctx.fillRect(235, 66, 58, 14);
		ctx.restore();
	}

	// Base rail the bar is bolted to.
	rect(ctx, 161, 82, 140, 5, STEEL, 1.5, 1.8);
	if (shaded) {
		line(ctx, 163, 83.4, 299, 83.4, 'rgba(255,255,255,0.5)', 1.2);
	}

	if (fitted) {
		// Feet and the centre speaker module between the lenses.
		rect(ctx, 168, 85, 10, 3, '#4E5764', 1, 1.2);
		rect(ctx, 284, 85, 10, 3, '#4E5764', 1, 1.2);
		circle(ctx, 228, 72, 2.1, CHROME, 1);
		circle(ctx, 232, 72, 2.1, CHROME, 1);
		line(ctx, 168, 67.4, 224, 67.4, 'rgba(255,255,255,0.45)', 1.3);
		line(ctx, 236, 67.4, 292, 67.4, 'rgba(255,255,255,0.45)', 1.3);
		line(ctx, 168, 78.4, 224, 78.4, 'rgba(20,38,64,0.4)', 1.3);
		line(ctx, 236, 78.4, 292, 78.4, 'rgba(20,38,64,0.4)', 1.3);
	}

	if (finish) {
		// Lens gloss streaks and screw heads.
		line(ctx, 176, 76, 200, 68.4, 'rgba(255,255,255,0.6)', 2);
		line(ctx, 244, 76, 268, 68.4, 'rgba(255,255,255,0.6)', 2);

		// Lens modules: faint LED dividers, a bright module row and the bezel lips.
		for (const lensX of [167, 235]) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(lensX + 1, 67, 56, 12);
			ctx.clip();
			for (let i = 1; i < 5; i++) {
				line(ctx, lensX + i * 11.6, 68, lensX + i * 11.6, 79, 'rgba(20,38,64,0.22)', 1);
			}
			ctx.fillStyle = 'rgba(255,255,255,0.82)';
			for (let i = 0; i < 5; i++) {
				ctx.fillRect(lensX + 3 + i * 11.6, 76.4, 2.2, 1.6);
			}
			ctx.restore();
			line(ctx, lensX + 2, 79.4, lensX + 56, 79.4, 'rgba(255,255,255,0.5)', 1);
			line(ctx, lensX + 2, 67.6, lensX + 56, 67.6, 'rgba(255,255,255,0.55)', 0.9);
		}

		// Centre module and housing bevels.
		line(ctx, 225.8, 67.2, 225.8, 79, 'rgba(255,255,255,0.34)', 1);
		line(ctx, 234.2, 67.2, 234.2, 79, 'rgba(20,38,64,0.34)', 1);
		line(ctx, 158, 61.5, 304, 61.5, 'rgba(255,255,255,0.4)', 1.2);

		for (const screwX of [161.5, 300.5]) {
			circle(ctx, screwX, 84.5, 1.5, CHROME, 1);
		}
	}
}

/** Battenburg checks: a navy band with staggered white tiles and 2 px navy joints. */
function battenburg(ctx: CanvasRenderingContext2D, finish: boolean): void {
	const { x, y, cols, tile, rows } = BAND;

	rect(ctx, x, y, cols * tile, rows * tile, NAVY, 0, 0);

	for (let col = 0; col < cols; col++) {
		for (let row = 0; row < rows; row++) {
			if ((col + row) % 2) continue;
			rect(ctx, x + col * tile + 2, y + row * tile + 2, tile - 4, tile - 4, WHITE, 0, 0);
		}
	}

	line(ctx, x, y, x + cols * tile, y, 'rgba(20,38,64,0.55)', 1.8);
	line(ctx, x, y + rows * tile, x + cols * tile, y + rows * tile, 'rgba(20,38,64,0.5)', 1.6);

	if (finish) {
		const w = cols * tile;
		const h = rows * tile;

		ctx.save();
		ctx.beginPath();
		ctx.rect(x, y, w, h);
		ctx.clip();

		// A slow sheen across the checks, so the livery reads as vinyl, not flat tiles.
		const sheen = ctx.createLinearGradient(x, y, x + w, y + h);
		sheen.addColorStop(0, 'rgba(255,255,255,0.16)');
		sheen.addColorStop(0.42, 'rgba(255,255,255,0.02)');
		sheen.addColorStop(0.78, 'rgba(255,255,255,0)');
		sheen.addColorStop(1, 'rgba(20,38,64,0.1)');
		ctx.fillStyle = sheen;
		ctx.fillRect(x, y, w, h);

		// Per-tile bevel: lit top edge, shaded right and bottom edge.
		for (let col = 0; col < cols; col++) {
			for (let row = 0; row < rows; row++) {
				if ((col + row) % 2) continue;
				const tx = x + col * tile + 2;
				const ty = y + row * tile + 2;
				const edge = tile - 4;
				line(ctx, tx + 1, ty + 1, tx + edge - 1, ty + 1, 'rgba(255,255,255,0.55)', 1);
				line(ctx, tx + edge - 1, ty + 2, tx + edge - 1, ty + edge - 1, 'rgba(20,38,64,0.16)', 1);
				line(ctx, tx + 1, ty + edge - 1, tx + edge - 2, ty + edge - 1, 'rgba(20,38,64,0.2)', 1);
			}
		}

		// Joint gloss along the top of the band and a couple of resolved tile glints.
		line(ctx, x + 2, y + 1.2, x + w - 2, y + 1.2, 'rgba(255,255,255,0.22)', 1);
		glint(ctx, x + 6 * tile + tile / 2, y + tile / 2, 2.2);
		glint(ctx, x + 16 * tile + tile / 2, y + tile + tile / 2, 2);

		ctx.restore();
	}
}

/** Sliding side door: recessed leaf, top runner, pull handle and roller hardware. */
function slidingDoor(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	const { x, y, w, h } = DOOR;

	rect(ctx, x, y, w, h, WHITE_SHADE, 3, 2.6);
	rect(ctx, x + 4, y + 4, w - 8, h - 8, WHITE, 2, 1.8);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 4, y + 4, w - 8, h - 8);
		ctx.clip();
		const face = ctx.createLinearGradient(0, y + 4, 0, y + h - 4);
		face.addColorStop(0, 'rgba(255,255,255,0.5)');
		face.addColorStop(0.3, 'rgba(255,255,255,0.06)');
		face.addColorStop(1, 'rgba(20,38,64,0.16)');
		ctx.fillStyle = face;
		ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
		ctx.restore();

		line(ctx, x + 9, y + h - 26, x + w - 9, y + h - 26, 'rgba(20,38,64,0.18)', 1.6);
		line(ctx, x + 9, y + h - 25, x + w - 9, y + h - 25, 'rgba(255,255,255,0.4)', 1.1);
	}

	// Recess shadow down the trailing edge and a lit shut line on the leading edge.
	line(ctx, x + w - 9, y + 8, x + w - 9, y + h - 8, 'rgba(20,38,64,0.12)', 5);
	line(ctx, x + 4, y + 8, x + 4, y + h - 8, 'rgba(255,255,255,0.5)', 1.4);

	if (fitted) {
		rect(ctx, x + 7, 140, 8, 30, CHROME, 3, 2.2);
		line(ctx, x + 11, 144, x + 11, 166, 'rgba(58,39,27,0.32)', 1.5);
		circle(ctx, x + 17, 200, 1.8, INK, 1);
		for (const hy of [124, 160, 208]) {
			rect(ctx, x + w - 8, hy, 8, 10, STEEL, 2, 1.6);
		}
		rect(ctx, x + 7, y + h - 6, 18, 5, STEEL, 1.5, 1.5);
	}
}

/** Twin rear doors: navy frame, two white leaves, centre seam and the sill. */
function rearDoors(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	const { x, y, w, h } = REAR_DOOR;

	rect(ctx, x, y, w, h, NAVY, 3, 2.6);
	rect(ctx, x + 3, y + 3, 31, h - 6, WHITE_SHADE, 1.5, 1.8);
	rect(ctx, x + 38, y + 3, 31, h - 6, WHITE_SHADE, 2, 1.8);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 3, y + 3, 31, h - 6);
		ctx.rect(x + 38, y + 3, 31, h - 6);
		ctx.clip();
		const leaves = ctx.createLinearGradient(x, y, x + w, y);
		leaves.addColorStop(0, 'rgba(255,255,255,0.44)');
		leaves.addColorStop(0.55, 'rgba(255,255,255,0.08)');
		leaves.addColorStop(1, 'rgba(20,38,64,0.16)');
		ctx.fillStyle = leaves;
		ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
		ctx.restore();
	}

	line(ctx, x + 36, y + 3, x + 36, y + h - 3, 'rgba(20,38,64,0.55)', 2.2);
	line(ctx, x + 37.6, y + 5, x + 37.6, y + h - 5, 'rgba(255,255,255,0.5)', 1.1);
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

	ctx.fillStyle = WHITE;
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: bright rim ring, six bolt heads, a valve cap on the crown and a pair of
 * polished arcs. Every mark is mirror-symmetric about the hub centre, so the flipped rear
 * wheel reproduces the same hardware.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	// Inner rim line and the shaded lower lip of the dish.
	ctx.strokeStyle = 'rgba(255,255,255,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.37, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(58,39,27,0.18)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.57, Math.PI * 0.16, Math.PI * 0.84);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.5, CHROME, 1.2);
		// Specular sits on the radial line inward, so the set mirrors with the wheel.
		ctx.fillStyle = 'rgba(255,255,255,0.88)';
		ctx.beginPath();
		ctx.arc(bx - Math.cos(a) * 0.8, by - Math.sin(a) * 0.8, 0.85, 0, Math.PI * 2);
		ctx.fill();
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.fillStyle = 'rgba(58,39,27,0.4)';
	ctx.beginPath();
	ctx.arc(x, y, r * 0.05, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = 'rgba(255,255,255,0.9)';
	ctx.beginPath();
	ctx.arc(x, y - r * 0.05, 0.8, 0, Math.PI * 2);
	ctx.fill();

	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 1.6;
	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.94]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.62, from, to);
		ctx.stroke();
	}
	// Valve cap on the crown, with its short stem.
	line(ctx, x, y - r * 0.47, x, y - r * 0.62, CHROME, 1.6);
	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.9)';
	ctx.beginPath();
	ctx.arc(x - 0.6, y - r * 0.55 - 0.7, 0.7, 0, Math.PI * 2);
	ctx.fill();
}

/** Paint grain over solid paint only: the glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(30, 88, 690, 258);
	wash.addColorStop(0, 'rgba(255,255,255,0.1)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(20,38,64,0.12)');
	ctx.fillStyle = wash;
	ctx.fillRect(30, 88, 660, 170);

	let seed = 83;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 560; i++) {
		const px = 34 + rand() * 652;
		const py = 92 + rand() * 162;
		const size = 1.4 + rand() * 1.1;
		ctx.globalAlpha = 0.09 + rand() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = WHITE;
	for (let i = 0; i < 230; i++) {
		const px = 34 + rand() * 652;
		const py = 92 + rand() * 162;
		const size = 1.2 + rand() * 0.9;
		ctx.globalAlpha = 0.2 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Coarser mottling in the paint, front wing and rear quarter.
	for (const [mx, my, mr] of [
		[104, 212, 17],
		[392, 206, 20],
		[610, 196, 13],
		[236, 124, 11]
	]) {
		ctx.globalAlpha = 0.045;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.arc(mx, my, mr, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.05;
		ctx.fillStyle = WHITE;
		ctx.beginPath();
		ctx.arc(mx - mr * 0.45, my - mr * 0.5, mr * 0.62, 0, Math.PI * 2);
		ctx.fill();
	}

	// Dry-brush flicks: short, near-horizontal strokes where the coat thins.
	ctx.lineWidth = 1.15;
	for (let i = 0; i < 30; i++) {
		const sx = 38 + rand() * 640;
		const sy = 96 + rand() * 152;
		const len = 6 + rand() * 14;
		ctx.globalAlpha = 0.1 + rand() * 0.06;
		ctx.strokeStyle = INK;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo(sx + len / 2, sy - 1.2, sx + len, sy + rand() * 1.2);
		ctx.stroke();
	}
	for (let i = 0; i < 18; i++) {
		const sx = 38 + rand() * 640;
		const sy = 96 + rand() * 152;
		const len = 5 + rand() * 11;
		ctx.globalAlpha = 0.14 + rand() * 0.06;
		ctx.strokeStyle = WHITE;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo(sx + len / 2, sy - 1, sx + len, sy + rand());
		ctx.stroke();
	}

	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[44, 198, 150, 196],
		[240, 104, 420, 102],
		[438, 108, 596, 106],
		[444, 158, 590, 156],
		[44, 234, 214, 232],
		[672, 130, 686, 129]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Panel sheen: roof light, a cool streak down the flank and a fender gloss. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	const roofSheen = ctx.createLinearGradient(0, 92, 0, 136);
	roofSheen.addColorStop(0, 'rgba(255,255,255,0.34)');
	roofSheen.addColorStop(0.6, 'rgba(255,255,255,0.07)');
	roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roofSheen;
	ctx.fillRect(134, 92, 540, 44);

	const flankSheen = ctx.createLinearGradient(460, 96, 560, 250);
	flankSheen.addColorStop(0, 'rgba(255,255,255,0)');
	flankSheen.addColorStop(0.42, 'rgba(255,255,255,0.2)');
	flankSheen.addColorStop(0.7, 'rgba(255,255,255,0.05)');
	flankSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = flankSheen;
	ctx.fillRect(452, 92, 120, 160);

	const noseSheen = ctx.createLinearGradient(32, 196, 92, 214);
	noseSheen.addColorStop(0, 'rgba(255,255,255,0.22)');
	noseSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = noseSheen;
	ctx.fillRect(32, 194, 64, 26);

	ctx.strokeStyle = WHITE;
	ctx.lineWidth = 3;
	for (const [sx, sy, ex, ey] of [
		[142, 96, 400, 94],
		[448, 128, 592, 126],
		[38, 210, 150, 208]
	]) {
		ctx.globalAlpha = 0.26;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Finishing marks: rivets, lamp sparkles, chrome lips, stone chips and arch hardware. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// Roof-band rivets.
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.7;
	for (let rivetX = 152; rivetX <= 670; rivetX += 30) {
		ctx.beginPath();
		ctx.arc(rivetX, 94, 1.4, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Lamp pips: headlamp, indicators, roof markers and the tail cluster.
	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[42.4, 217.4, 1.8],
		[44.4, 204.4, 1],
		[673.6, 208.8, 1.1],
		[673.6, 221.4, 1.05],
		[148.8, 93.2, 1],
		[671.2, 93.2, 1]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	// Chrome lips on the bumpers, the rub strip and the door handle.
	line(ctx, 18, 239, 28, 239, 'rgba(255,255,255,0.7)', 1.4);
	line(ctx, 18, 258, 28, 258, 'rgba(58,39,27,0.24)', 1.2);
	line(ctx, 692, 243, 700, 243, 'rgba(255,255,255,0.6)', 1.2);
	line(ctx, 142, 227.6, 686, 227.6, 'rgba(255,255,255,0.55)', 1.1);
	line(ctx, 307, 143, 307, 167, 'rgba(255,255,255,0.55)', 1.2);

	// Rear plate gloss and the sill lip.
	line(ctx, 616, 245.4, 636, 245.4, 'rgba(255,255,255,0.5)', 1);
	line(ctx, 676, 248, 686, 248, 'rgba(255,255,255,0.4)', 1);

	// Mudguard hardware and the lit arch crowns.
	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		circle(ctx, wheelX, WHEEL_L.y - WHEEL_L.r - 9.6, 1.6, CHROME, 1);
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 8.6, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
	}

	// Stone chips where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.42;
	ctx.fillStyle = WHITE;
	for (const [chipX, chipY, chipR] of [
		[52, 250, 1.2],
		[212, 248, 1.1],
		[344, 246, 1.3],
		[470, 247, 1.2],
		[600, 245, 1.1]
	]) {
		ctx.beginPath();
		ctx.arc(chipX, chipY, chipR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Garage dust low on the navy skirt, so the finish keeps its used edge.
	ctx.save();
	ctx.globalAlpha = 0.18;
	ctx.fillStyle = '#FFFFFF';
	for (const [dustX, dustY] of [
		[268, 244],
		[430, 241],
		[540, 242]
	]) {
		ctx.beginPath();
		ctx.arc(dustX, dustY, 1.2, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export function drawRealPoliceVanLevel(
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
		ctx.ellipse(359, 280, 350, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell.
	shape(ctx, SHELL, WHITE);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Body paint: light roof, a cool mid and a deep lower shade.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 88, 0, 258);
		paint.addColorStop(0, 'rgba(255,255,255,0.5)');
		paint.addColorStop(0.2, 'rgba(255,255,255,0.1)');
		paint.addColorStop(0.64, 'rgba(20,38,64,0.03)');
		paint.addColorStop(1, 'rgba(20,38,64,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(26, 88, 666, 172);

		const rocker = ctx.createLinearGradient(0, 234, 0, 258);
		rocker.addColorStop(0, 'rgba(20,38,64,0)');
		rocker.addColorStop(1, 'rgba(20,38,64,0.22)');
		ctx.fillStyle = rocker;
		ctx.fillRect(30, 234, 660, 24);
	}

	// Navy roof cap.
	rect(ctx, ROOF_BAND.x, ROOF_BAND.y, ROOF_BAND.w, ROOF_BAND.h, NAVY, 0, 0);
	line(ctx, 134, 89.6, 676, 89.6, 'rgba(255,255,255,0.3)', 1.5);
	line(ctx, 134, 98.4, 674, 98.4, 'rgba(20,38,64,0.4)', 1.4);

	// Panel joints above the band; the doors are drawn over them.
	if (shaded) {
		for (const seamX of [438, 596]) {
			line(ctx, seamX, 104, seamX, 168, 'rgba(20,38,64,0.2)', 1.6);
			line(ctx, seamX + 1.6, 104, seamX + 1.6, 168, 'rgba(255,255,255,0.4)', 1.1);
		}
	}

	// Cab door seam and its trailing stile, hidden under the band lower down.
	line(ctx, 236, 104, 236, 250, 'rgba(20,38,64,0.4)', 2);
	line(ctx, 237.6, 108, 237.6, 246, 'rgba(255,255,255,0.34)', 1.1);

	rearDoors(ctx, shaded);
	slidingDoor(ctx, shaded, fitted);

	// Battenburg checks run the length of the flank and straight across both doors.
	battenburg(ctx, finish);

	// The centre seam stays readable under the livery.
	line(ctx, REAR_DOOR.x + 36, 172, REAR_DOOR.x + 36, 224, 'rgba(20,38,64,0.34)', 1.6);
	line(ctx, REAR_DOOR.x + 37.6, 172, REAR_DOOR.x + 37.6, 224, 'rgba(255,255,255,0.34)', 1);

	// Wordmark on the rear quarter, clear of the paired panes.
	ctx.fillStyle = NAVY;
	ctx.font = '700 17px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('POLICE', 498, 163);

	// Chrome rub strip and the navy skirt.
	rect(ctx, 30, 226, 660, 5, CHROME, 0, 0);
	line(ctx, 32, 227.2, 688, 227.2, 'rgba(255,255,255,0.6)', 1.2);
	rect(ctx, 26, 231, 666, 27, NAVY, 0, 0);
	line(ctx, 30, 232.6, 690, 232.6, 'rgba(255,255,255,0.3)', 1.4);
	line(ctx, 30, 255.6, 690, 255.6, 'rgba(0,0,0,0.3)', 1.6);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Underbody strip between the axles.
	rect(ctx, UNDERBODY.x, UNDERBODY.y, UNDERBODY.w, UNDERBODY.h, '#5C6472', 0, 2.2);
	rect(ctx, UNDERBODY.x + 2, UNDERBODY.y + 2, UNDERBODY.w - 4, 2, '#8C96A4', 0, 0);

	// Roof light bar, mirror head and arm.
	lightBar(ctx, shaded, fitted, finish);

	ctx.beginPath();
	ctx.moveTo(80, 138);
	ctx.lineTo(99.9, 138);
	ctx.lineTo(93.6, 152);
	ctx.lineTo(80, 152);
	ctx.closePath();
	ctx.fillStyle = STEEL;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();

	rect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, NAVY, 3, 2.4);
	if (shaded) {
		rect(ctx, MIRROR.x + 3, MIRROR.y + 4, MIRROR.w - 6, MIRROR.h - 8, GLASS, 1.4);
		line(ctx, 66, 128, 66, 154, 'rgba(255,255,255,0.4)', 1.2);
	}

	// Glass: windshield, cab pane, the paired cargo windows and both rear-door panes.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, CAB_GLASS, GLASS, 2.5);
	shape(ctx, BARRED_A, GLASS, 2.5);
	shape(ctx, BARRED_B, GLASS, 2.5);
	shape(ctx, REAR_GLASS_L, GLASS, 2.5);
	shape(ctx, REAR_GLASS_R, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 94, 110, 54, 70);
		glassShade(ctx, CAB_GLASS, 166, 106, 62, 52);
		glassShade(ctx, BARRED_A, 246, 116, 36, 40);
		glassShade(ctx, BARRED_B, 448, 116, 36, 40);
		glassShade(ctx, REAR_GLASS_L, 613, 116, 23, 32);
		glassShade(ctx, REAR_GLASS_R, 645, 116, 23, 32);
	}

	// Security bars read at every level: they are the vehicle's tell.
	bars(ctx, 246, 116, 36, 40, 3, finish);
	bars(ctx, 448, 116, 36, 40, 3, finish);
	bars(ctx, 613, 116, 23, 32, 2, finish);
	bars(ctx, 645, 116, 23, 32, 2, finish);

	// Front bumper, rear bumper and chassis furniture.
	rect(ctx, BUMPER_F.x, BUMPER_F.y, BUMPER_F.w, BUMPER_F.h, CHROME, 3, 2.6);
	line(ctx, 18, 241, 28, 241, 'rgba(255,255,255,0.7)', 1.4);
	line(ctx, 18, 256, 28, 256, 'rgba(58,39,27,0.3)', 1.4);

	rect(ctx, BUMPER_R.x, BUMPER_R.y, BUMPER_R.w, BUMPER_R.h, CHROME, 2.5, 2.6);
	line(ctx, 692, 244, 700, 244, 'rgba(255,255,255,0.55)', 1.4);
	line(ctx, 692, 254, 700, 254, 'rgba(58,39,27,0.26)', 1.2);

	if (fitted) {
		// Grille, indicator and headlamp on the nose.
		rect(ctx, 31, 204, 9, 12, STEEL, 1.5, 2);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 32, 204 + bar * 3, 39, 204 + bar * 3, CHROME, 1.2);
		}
		rect(ctx, 42, 202, 13, 7, AMBER, 2, 1.6);
		circle(ctx, 46, 221, 10, LAMP, 2.4);
		circle(ctx, 46, 221, 4.8, '#FFF7CF', 1.5);

		// Wipers, clipped to the screen.
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		line(ctx, 104, 164, 128, 138, INK, 2.2);
		line(ctx, 118, 166, 136, 146, INK, 2);
		ctx.restore();

		// Roof marker lamps.
		circle(ctx, 148, 94, 2.2, AMBER, 1.1);
		circle(ctx, 672, 94, 2.2, AMBER, 1.1);

		// Sliding-door runner over the leaf and the cab door handle.
		rect(ctx, 296, 103, 140, 5, STEEL, 2, 1.8);
		line(ctx, 299, 104.4, 433, 104.4, 'rgba(255,255,255,0.45)', 1.2);
		line(ctx, 299, 106.6, 433, 106.6, 'rgba(20,38,64,0.22)', 1.1);
		rect(ctx, 430, 101, 8, 9, '#4E5764', 1.5, 1.5);
		rect(ctx, 206, 164, 20, 6, CHROME, 2.5, 2);
		line(ctx, 209, 167, 221, 167, 'rgba(58,39,27,0.3)', 1.1);

		// Rear-door hardware: hinges, twin latch rods and the plate on the skirt.
		const { x: rx, y: ry, w: rw, h: rh } = REAR_DOOR;
		for (const hy of [ry + 20, ry + 52, ry + 88]) {
			rect(ctx, rx + 1, hy, 6, 12, STEEL, 1.5, 1.4);
			rect(ctx, rx + rw - 7, hy, 6, 12, STEEL, 1.5, 1.4);
		}
		for (const rodX of [rx + 4, rx + rw - 4]) {
			line(ctx, rodX, ry + 8, rodX, ry + rh - 10, INK, 4);
			line(ctx, rodX, ry + 8, rodX, ry + rh - 10, CHROME, 2.6);
		}
		rect(ctx, 614, 244, 24, 10, WHITE, 1.5, 1.7);
		ctx.fillStyle = NAVY;
		ctx.fillRect(616, 245.5, 3, 7);
		ctx.fillStyle = INK;
		ctx.fillRect(621, 247, 12, 1.6);
		ctx.fillRect(621, 250, 9, 1.6);

		// Tail cluster on the rear corner.
		rect(ctx, 677, 208, 12, 10, RED, 1.5, 1.7);
		rect(ctx, 677, 220, 12, 8, AMBER, 1.5, 1.5);
	}

	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: roof, rear corner and the nose face.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(140, 89.4);
		ctx.lineTo(672, 89.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(689, 108);
		ctx.lineTo(689, 236);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(31.4, 206);
		ctx.lineTo(31.4, 232);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(46, 221, 1, 46, 221, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(46, 221, 30, 0, Math.PI * 2);
		ctx.fill();

		// Light-bar bloom, blue over the front lens and red over the rear one.
		for (const [lensX, tint] of [
			[196, '58,134,255'],
			[264, '255,77,109']
		] as const) {
			const bloom = ctx.createRadialGradient(lensX, 72, 2, lensX, 72, 40);
			bloom.addColorStop(0, `rgba(${tint},0.5)`);
			bloom.addColorStop(1, `rgba(${tint},0)`);
			ctx.fillStyle = bloom;
			ctx.beginPath();
			ctx.arc(lensX, 72, 40, 0, Math.PI * 2);
			ctx.fill();
		}

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 271, 33, 4.6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		panelSheen(ctx);

		// Glints, clear of the glass, tyres and lettering.
		glint(ctx, 262, 104, 4.4);
		glint(ctx, 334, 150, 4);
		glint(ctx, 470, 164, 3.8);
		glint(ctx, 566, 108, 4.2);
		glint(ctx, 640, 132, 3.4);
		glint(ctx, 88, 172, 3.6);
		glint(ctx, 438, 162, 3.2);

		// Secondary glints: roof band, door leaf, flank, nose and skirt.
		glint(ctx, 200, 93.5, 3.4);
		glint(ctx, 536, 93.5, 3);
		glint(ctx, 360, 126, 3.6);
		glint(ctx, 516, 102, 2.8);
		glint(ctx, 70, 202, 3);
		glint(ctx, 250, 240, 2.6);

		// Glass sheen and a sparkle in the cab pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(106, 164);
		ctx.lineTo(132, 120);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(174, 150);
		ctx.lineTo(196, 118);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 186, 128, 3);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealPoliceVan(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealPoliceVanLevel(ctx, x, y, scale, 5);
}
