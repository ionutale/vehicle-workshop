/**
 * Retro camper art, cut into the same five-piece kit as the other realistic vehicles.
 * A rounded pop-top camper van facing left: cream and brick two-tone livery, a canvas-sided
 * pop top with a chrome roof rack, a rolled side awning, a sliding side door with its small
 * window, a rear quarter window, chrome bumpers and whitewall wheels. Level 5 is the
 * production target: shaded, fitted, lit and picture-book finished.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape, wheel } from './realKit';

const CREAM = '#F2E8CF';
const CREAM_LIGHT = '#FAF3E3';
const CREAM_SHADE = '#E3D6B8';
const CANVAS = '#E9DCC0';
const BRICK = '#A44A3F';
const BRICK_DARK = '#7E362E';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/** Art box 720 x 340, road at 272. Front (nose) faces left. */
const SHELL =
	'M52,252 Q44,252 44,244 L44,156 Q44,138 52,126 Q60,114 78,108 Q94,102 120,98 L150,98 L146,64 Q146,46 160,46 L580,46 Q594,46 594,64 L590,98 L650,98 Q682,98 682,120 L682,244 Q682,252 674,252 Z';

/** Brick lower body, rising to a sweep at the nose and the rear corner. */
const LOWER = 'M0,214 Q54,206 108,200 L630,200 Q668,200 682,188 L682,270 L0,270 Z';

/** The two-tone division line, stroked in ink then cream as a coachline. */
const SPLIT = 'M0,211 Q54,203 108,197 L630,197 Q668,197 682,185';

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const WINDSCREEN = pane(56, 124, 36, 54, 6);
const CAB_GLASS = pane(106, 112, 84, 58, 7);
const DOOR_GLASS = pane(268, 128, 54, 40, 4);
const SIDE_GLASS = pane(354, 124, 116, 46, 5);
const REAR_GLASS = pane(560, 124, 88, 46, 5);
const GLASS_MASK = `${WINDSCREEN} ${CAB_GLASS} ${DOOR_GLASS} ${SIDE_GLASS} ${REAR_GLASS}`;

/** Side door: the panel mask sits under its small window, clear of every pane. */
const DOOR = { x: 248, y: 176, w: 92, h: 76 };
const DOOR_FRAME = { x: 248, y: 120, w: 92, h: 132 };

const WHEEL_L = { x: 150, y: 236, r: 34 };
const WHEEL_R = { x: 560, y: 236, r: 34 };

const AWNING = { x: 300, y: 104, w: 328, h: 16 };
const RACK = { x: 220, y: 28, w: 300 };

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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.58)');
	glass.addColorStop(0.46, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.24)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Filled wheel-arch band sitting just outside the tyre. */
function camperArch(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 8, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = BRICK_DARK;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(250,243,227,0.5)';
	ctx.lineWidth = 1.8;
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

	ctx.fillStyle = CREAM_LIGHT;
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: whitewall bands, a lit rim, six bolt heads and a polished centre cap.
 * Every mark is mirror-symmetric about the hub centre, so the flipped rear wheel matches
 * exactly.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Broad whitewall band, then the crisp whitewall ring.
	ctx.strokeStyle = 'rgba(250,243,227,0.3)';
	ctx.lineWidth = 7;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.73, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(250,243,227,0.94)';
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.66, 0, Math.PI * 2);
	ctx.stroke();

	// Soft tyre wall shadow just inside the whitewall.
	ctx.strokeStyle = 'rgba(43,45,66,0.24)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.59, 0, Math.PI * 2);
	ctx.stroke();

	// Bright rim arc with a narrow dark rim line under it.
	ctx.strokeStyle = 'rgba(255,255,255,0.68)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.47, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(43,45,66,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.27, y + Math.sin(a) * r * 0.27, 2.1, CHROME, 1.1);
	}
	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.2);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x, y, r * 0.045, 0, Math.PI * 2);
	ctx.fill();
}

/** Rolled awning along the roof edge: canvas roll, brick piping and tie straps. */
function drawAwning(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	if (fitted) {
		rect(ctx, 296, 100, 9, 7, STEEL, 1.5, 1.4);
		rect(ctx, 623, 100, 9, 7, STEEL, 1.5, 1.4);
	}

	ctx.save();
	ctx.globalAlpha = 0.14;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(AWNING.x + AWNING.w / 2, AWNING.y + AWNING.h + 3, 148, 4, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	const roll = pane(AWNING.x, AWNING.y, AWNING.w, AWNING.h, 8);
	shape(ctx, roll, CANVAS, 2.6);

	ctx.save();
	ctx.clip(new Path2D(roll));
	if (shaded) {
		const fabric = ctx.createLinearGradient(0, AWNING.y, 0, AWNING.y + AWNING.h);
		fabric.addColorStop(0, 'rgba(255,255,255,0.55)');
		fabric.addColorStop(0.42, 'rgba(255,255,255,0.08)');
		fabric.addColorStop(1, 'rgba(126,54,46,0.22)');
		ctx.fillStyle = fabric;
		ctx.fillRect(AWNING.x, AWNING.y, AWNING.w, AWNING.h);
	}

	rect(ctx, AWNING.x, 105, AWNING.w, 2, BRICK, 0, 0);
	rect(ctx, AWNING.x, 117, AWNING.w, 2, BRICK, 0, 0);
	line(ctx, AWNING.x + 12, 111, AWNING.x + AWNING.w - 12, 111, 'rgba(255,255,255,0.34)', 1.4);

	if (finish) {
		// Woven canvas ribs under a gloss that runs the length of the roll.
		for (let ribX = AWNING.x + 8; ribX < AWNING.x + AWNING.w - 8; ribX += 9) {
			line(ctx, ribX, 105.5, ribX, 118.5, 'rgba(58,39,27,0.05)', 1);
		}
		const sheen = ctx.createLinearGradient(0, AWNING.y, 0, AWNING.y + AWNING.h);
		sheen.addColorStop(0, 'rgba(255,255,255,0.34)');
		sheen.addColorStop(0.42, 'rgba(255,255,255,0.04)');
		sheen.addColorStop(1, 'rgba(126,54,46,0.1)');
		ctx.fillStyle = sheen;
		ctx.fillRect(AWNING.x, AWNING.y, AWNING.w, AWNING.h);

		// Stitch lines framing the piping, and a bright crease along the crown.
		line(ctx, AWNING.x + 6, 104.6, AWNING.x + AWNING.w - 6, 104.6, 'rgba(255,255,255,0.52)', 1.1);
		line(ctx, AWNING.x + 6, 119.2, AWNING.x + AWNING.w - 6, 119.2, 'rgba(58,39,27,0.16)', 1);
		line(ctx, AWNING.x + 14, 110.4, AWNING.x + AWNING.w - 14, 110.4, 'rgba(255,255,255,0.3)', 1.6);
	}

	for (const strapX of [356, 462, 568]) {
		ctx.fillStyle = 'rgba(58,39,27,0.62)';
		ctx.fillRect(strapX, AWNING.y, 3, AWNING.h);
		circle(ctx, strapX + 1.5, AWNING.y + 8, 2, CHROME, 1);
		if (finish) {
			line(ctx, strapX + 0.5, AWNING.y + 2, strapX + 0.5, AWNING.y + 6, 'rgba(255,255,255,0.42)', 1);
			line(ctx, strapX + 0.5, AWNING.y + 11, strapX + 0.5, AWNING.y + 15, 'rgba(255,255,255,0.42)', 1);
		}
	}
	ctx.restore();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6;
	ctx.stroke(new Path2D(roll));

	circle(ctx, AWNING.x + 6, AWNING.y + 8, 2.6, CHROME, 1.3);
	circle(ctx, AWNING.x + AWNING.w - 6, AWNING.y + 8, 2.6, CHROME, 1.3);
	if (finish) {
		line(ctx, AWNING.x + 4.4, AWNING.y + 6.6, AWNING.x + 7.8, AWNING.y + 5.2, 'rgba(255,255,255,0.85)', 1.1);
		line(
			ctx,
			AWNING.x + AWNING.w - 7.8,
			AWNING.y + 5.2,
			AWNING.x + AWNING.w - 4.4,
			AWNING.y + 6.6,
			'rgba(255,255,255,0.85)',
			1.1
		);
	}
}

/** Low chrome luggage rack on the pop-top lid. */
function drawRoofRack(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	rect(ctx, RACK.x, RACK.y, RACK.w, 5, CHROME, 2, 2.2);
	for (const postX of [234, 314, 394, 474]) {
		rect(ctx, postX, 33, 5, 13, CHROME, 1, 1.8);
	}
	if (fitted) {
		circle(ctx, 232, 30.5, 1.6, STEEL, 1);
		circle(ctx, 508, 30.5, 1.6, STEEL, 1);
	}
}

/** Pop-top canvas at picture-book finish: weave, seam stitching and a soft upper sheen. */
function canvasWeave(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(144, 64, 452, 34);
	ctx.clip();

	for (let weftY = 65.5; weftY < 97; weftY += 3) {
		ctx.strokeStyle = weftY % 6 < 3 ? 'rgba(255,255,255,0.15)' : 'rgba(58,39,27,0.06)';
		ctx.lineWidth = 0.9;
		ctx.beginPath();
		ctx.moveTo(145, weftY);
		ctx.lineTo(595, weftY);
		ctx.stroke();
	}
	for (let warpX = 147; warpX < 596; warpX += 6) {
		line(ctx, warpX, 65, warpX, 97, 'rgba(58,39,27,0.04)', 0.8);
	}

	// Soft daylight sheen across the top half of the canvas.
	const sheen = ctx.createLinearGradient(0, 65, 0, 90);
	sheen.addColorStop(0, 'rgba(255,255,255,0.26)');
	sheen.addColorStop(0.55, 'rgba(255,255,255,0.05)');
	sheen.addColorStop(1, 'rgba(126,54,46,0.08)');
	ctx.fillStyle = sheen;
	ctx.fillRect(144, 65, 452, 25);

	// Stitch dashes either side of each vertical seam.
	for (let seamX = 176; seamX < 590; seamX += 56) {
		for (let stitchY = 67; stitchY < 95; stitchY += 5) {
			line(ctx, seamX - 2.2, stitchY, seamX - 2.2, stitchY + 2.4, 'rgba(58,39,27,0.2)', 1);
			line(ctx, seamX + 2.2, stitchY, seamX + 2.2, stitchY + 2.4, 'rgba(58,39,27,0.2)', 1);
		}
	}

	// Hemisphere of shade where the canvas tucks under the raised lid.
	line(ctx, 146, 65.4, 594, 65.4, 'rgba(58,39,27,0.22)', 1.6);
	ctx.restore();
}

/** Sliding side door: two-tone leaf, its small window frame, handle and hinges. */
function drawCamperDoor(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	rect(ctx, DOOR_FRAME.x, DOOR_FRAME.y, DOOR_FRAME.w, DOOR_FRAME.h, CREAM_SHADE, 6, 2.6);

	ctx.save();
	ctx.clip(new Path2D(pane(DOOR_FRAME.x, DOOR_FRAME.y, DOOR_FRAME.w, DOOR_FRAME.h, 6)));
	if (shaded) {
		const leaf = ctx.createLinearGradient(0, DOOR_FRAME.y, 0, 252);
		leaf.addColorStop(0, 'rgba(255,255,255,0.42)');
		leaf.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		leaf.addColorStop(1, 'rgba(126,54,46,0.14)');
		ctx.fillStyle = leaf;
		ctx.fillRect(DOOR_FRAME.x, DOOR_FRAME.y, DOOR_FRAME.w, DOOR_FRAME.h);
	}

	ctx.fillStyle = BRICK;
	ctx.fillRect(DOOR_FRAME.x, 200, DOOR_FRAME.w, 52);
	if (shaded) {
		const brickLeaf = ctx.createLinearGradient(0, 200, 0, 252);
		brickLeaf.addColorStop(0, 'rgba(255,255,255,0.14)');
		brickLeaf.addColorStop(1, 'rgba(60,18,14,0.28)');
		ctx.fillStyle = brickLeaf;
		ctx.fillRect(DOOR_FRAME.x, 200, DOOR_FRAME.w, 52);
	}
	line(ctx, DOOR_FRAME.x, 200, DOOR_FRAME.x + DOOR_FRAME.w, 200, 'rgba(58,39,27,0.42)', 2);
	line(
		ctx,
		DOOR_FRAME.x,
		202.4,
		DOOR_FRAME.x + DOOR_FRAME.w,
		202.4,
		'rgba(255,255,255,0.34)',
		1.2
	);
	ctx.restore();

	// Window frame, with the pane drawn over it later.
	rect(ctx, 260, 122, 68, 52, CREAM_LIGHT, 5, 2);

	if (fitted) {
		rect(ctx, 316, 194, 16, 5, CHROME, 2.5, 2);
		line(ctx, 318, 196.5, 330, 196.5, 'rgba(255,255,255,0.6)', 1.2);

		for (const hingeY of [182, 206, 230]) {
			rect(ctx, 250, hingeY, 6, 12, STEEL, 1.5, 1.5);
		}

		rect(ctx, 266, 234, 30, 14, 'rgba(58,39,27,0.16)', 2, 0);
		for (let vent = 0; vent < 3; vent++) {
			line(ctx, 268, 237 + vent * 4, 294, 237 + vent * 4, 'rgba(58,39,27,0.4)', 1.6);
		}
	}
}

export function drawRealCamperLevel(
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
		ctx.ellipse(362, 277, 326, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis rails under the shell, between the wheels.
	rect(ctx, 108, 244, 520, 12, '#79828F', 1, 0);
	rect(ctx, 108, 246, 520, 3, '#9AA3B2', 1, 0);
	rect(ctx, 108, 253, 520, 4, '#555D6A', 1, 0);

	shape(ctx, SHELL, CREAM);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Cream paint: bright at the roof, warm shade along the lower flank.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 46, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.5)');
		paint.addColorStop(0.22, 'rgba(255,255,255,0.1)');
		paint.addColorStop(0.7, 'rgba(126,54,46,0.02)');
		paint.addColorStop(1, 'rgba(126,54,46,0.16)');
		ctx.fillStyle = paint;
		ctx.fillRect(0, 46, 720, 206);
	}

	// Brick lower body.
	ctx.fillStyle = BRICK;
	ctx.fill(new Path2D(LOWER));
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(LOWER));
		const lowerPaint = ctx.createLinearGradient(0, 188, 0, 258);
		lowerPaint.addColorStop(0, 'rgba(255,255,255,0.18)');
		lowerPaint.addColorStop(0.32, 'rgba(255,255,255,0)');
		lowerPaint.addColorStop(1, 'rgba(60,18,14,0.3)');
		ctx.fillStyle = lowerPaint;
		ctx.fillRect(0, 185, 720, 90);
		ctx.restore();
	}
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SPLIT));
	ctx.strokeStyle = 'rgba(250,243,227,0.72)';
	ctx.lineWidth = 1.4;
	ctx.stroke(new Path2D(SPLIT));

	// Brick roof edge band and its cream pinline.
	rect(ctx, 0, 98, 720, 6, BRICK, 0, 0);
	line(ctx, 120, 104.4, 682, 104.4, 'rgba(58,39,27,0.3)', 1.4);
	line(ctx, 120, 105.5, 682, 105.5, 'rgba(255,255,255,0.32)', 1.1);

	// Side panel seams and the beltline under the glazing.
	for (const seamX of [204, 346, 486, 652]) {
		line(ctx, seamX, 104, seamX, 248, 'rgba(58,39,27,0.15)', 1.5);
		line(ctx, seamX + 1.5, 104, seamX + 1.5, 248, 'rgba(255,255,255,0.3)', 1.1);
	}
	line(ctx, 120, 176, 682, 176, 'rgba(58,39,27,0.1)', 1.4);

	// Canvas band under the raised lid.
	rect(ctx, 144, 64, 452, 34, CANVAS, 0, 0);
	if (shaded) {
		const canvasShade = ctx.createLinearGradient(0, 64, 0, 98);
		canvasShade.addColorStop(0, 'rgba(255,255,255,0.48)');
		canvasShade.addColorStop(0.55, 'rgba(255,255,255,0.08)');
		canvasShade.addColorStop(1, 'rgba(126,54,46,0.18)');
		ctx.fillStyle = canvasShade;
		ctx.fillRect(144, 64, 452, 34);
		ctx.fillStyle = 'rgba(58,39,27,0.16)';
		ctx.fillRect(148, 64, 444, 4);
	}
	for (let seamX = 176; seamX < 590; seamX += 56) {
		line(ctx, seamX, 66, seamX, 96, 'rgba(58,39,27,0.16)', 1.4);
		line(ctx, seamX + 1.4, 66, seamX + 1.4, 96, 'rgba(255,255,255,0.42)', 1.1);
	}
	line(ctx, 150, 96.4, 590, 96.4, 'rgba(58,39,27,0.38)', 1.8);

	// The raised lid: brick shell with a cream top lip and a chrome base trim.
	rect(ctx, 144, 45, 452, 20, BRICK, 0, 0);
	if (shaded) {
		const lid = ctx.createLinearGradient(0, 45, 0, 65);
		lid.addColorStop(0, 'rgba(255,255,255,0.5)');
		lid.addColorStop(0.6, 'rgba(255,255,255,0.08)');
		lid.addColorStop(1, 'rgba(60,18,14,0.24)');
		ctx.fillStyle = lid;
		ctx.fillRect(144, 45, 452, 20);
	}
	rect(ctx, 148, 46, 444, 4, CREAM_LIGHT, 0, 0);
	rect(ctx, 150, 61, 440, 3, CHROME, 0, 0);
	line(ctx, 150, 63.8, 590, 63.8, 'rgba(58,39,27,0.32)', 1.4);

	if (finish) {
		canvasWeave(ctx);
	}

	// Small pop-top latches at the canvas base.
	if (fitted) {
		rect(ctx, 196, 91, 14, 5, CHROME, 2, 1.5);
		rect(ctx, 526, 91, 14, 5, CHROME, 2, 1.5);
		line(ctx, 199, 93.5, 207, 93.5, 'rgba(58,39,27,0.4)', 1.2);
		line(ctx, 529, 93.5, 537, 93.5, 'rgba(58,39,27,0.4)', 1.2);
	}

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Awning, roof rack and the sliding door sit on the body side.
	drawAwning(ctx, shaded, fitted, finish);
	drawRoofRack(ctx, fitted);
	drawCamperDoor(ctx, shaded, fitted);

	// Glass: roof band, windscreen and side panes.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, CAB_GLASS, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	shape(ctx, REAR_GLASS, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 56, 124, 36, 54);
		shadeGlass(ctx, CAB_GLASS, 106, 112, 84, 58);
		shadeGlass(ctx, DOOR_GLASS, 268, 128, 54, 40);
		shadeGlass(ctx, SIDE_GLASS, 354, 124, 116, 46);
		shadeGlass(ctx, REAR_GLASS, 560, 124, 88, 46);
	}

	// Door mirror on the A-pillar.
	line(ctx, 30, 136, 46, 132.5, INK, 3.4);
	line(ctx, 30, 136, 46, 132.5, CHROME, 2.2);
	rect(ctx, 10, 120, 20, 32, STEEL, 4, 2.4);
	if (shaded) {
		rect(ctx, 12.5, 123, 15, 26, GLASS, 1.4);
	}

	// Chrome bumpers.
	rect(ctx, 24, 238, 20, 20, CHROME, 4, 2.6);
	line(ctx, 27, 242, 41, 242, 'rgba(255,255,255,0.65)', 1.6);
	rect(ctx, 682, 240, 18, 18, CHROME, 4, 2.6);
	line(ctx, 685, 244, 697, 244, 'rgba(255,255,255,0.65)', 1.6);

	if (fitted) {
		// Front: over-rider, grille, headlamp and indicator.
		rect(ctx, 26, 241, 7, 15, STEEL, 1.5, 1.8);
		rect(ctx, 46, 190, 12, 18, STEEL, 2, 2);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 48, 190 + bar * 4.5, 56, 190 + bar * 4.5, CHROME, 1.4);
		}
		circle(ctx, 54, 216, 8, LAMP, 2.4);
		circle(ctx, 54, 216, 4.6, '#FFF7CF', 1.5);
		rect(ctx, 46, 229, 9, 6, AMBER, 1.5, 1.5);

		// Rear corner: lamp stack and plate above the bumper.
		rect(ctx, 662, 182, 12, 12, RED, 2, 1.8);
		rect(ctx, 662, 198, 12, 10, AMBER, 1.5, 1.5);
		rect(ctx, 654, 241, 24, 11, CREAM, 1.5, 1.8);
		line(ctx, 657, 245, 671, 245, 'rgba(58,39,27,0.7)', 1.6);
		line(ctx, 657, 248.5, 667, 248.5, 'rgba(58,39,27,0.5)', 1.4);

		// Side vent behind the cab, fuel cap and chrome step under the door.
		for (let slat = 0; slat < 4; slat++) {
			line(ctx, 206, 148 + slat * 4.4, 234, 148 + slat * 4.4, 'rgba(58,39,27,0.32)', 2.6);
			line(ctx, 206, 149.4 + slat * 4.4, 234, 149.4 + slat * 4.4, CHROME, 1.4);
		}
		circle(ctx, 506, 226, 5, CHROME, 1.8);
		line(ctx, 503, 226, 509, 226, 'rgba(58,39,27,0.4)', 1.2);
		rect(ctx, 252, 252, 80, 6, CHROME, 2, 2);

		// Wipers resting along the bottom of the windscreen.
		line(ctx, 60, 174, 76, 158, INK, 2.2);
		line(ctx, 80, 174, 90, 166, INK, 2);

		// Livery wordmark between the side and rear windows.
		ctx.fillStyle = BRICK;
		ctx.font = '700 15px ui-rounded, system-ui, sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';
		ctx.fillText('CAMPER', 478, 168);
	}

	if (fitted) {
		camperArch(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		camperArch(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: lid, roof nose, front face and rear corner.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(168, 47.5);
		ctx.lineTo(572, 47.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(60, 130);
		ctx.lineTo(84, 108);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(45.5, 160);
		ctx.lineTo(45.5, 246);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(680.5, 126);
		ctx.lineTo(680.5, 238);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(54, 216, 1, 54, 216, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(54, 216, 26, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 271, 31, 4.5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain over the shell only: glazing and tyres are punched out.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
		ctx.clip(new Path2D(SHELL));
		ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');
		let seed = 53;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};

		// Broad, barely-there mottling gives the flat paint a hand-mixed depth.
		const mottle: Array<[number, number, number, number, string]> = [
			[130, 132, 62, 15, '#FFFFFF'],
			[260, 206, 84, 18, '#FFFFFF'],
			[470, 136, 58, 13, BRICK_DARK],
			[610, 214, 66, 16, '#FFFFFF'],
			[196, 226, 52, 13, BRICK_DARK]
		];
		for (const [mx, my, mrx, mry, tone] of mottle) {
			ctx.globalAlpha = 0.045;
			ctx.fillStyle = tone;
			ctx.beginPath();
			ctx.ellipse(mx, my, mrx, mry, 0, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.fillStyle = INK;
		for (let i = 0; i < 430; i++) {
			const px = 28 + rand() * 664;
			const py = 48 + rand() * 198;
			const size = 1.2 + rand() * 1.2;
			ctx.globalAlpha = 0.08 + rand() * 0.05;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 170; i++) {
			const px = 28 + rand() * 664;
			const py = 48 + rand() * 198;
			const size = 1.1 + rand() * 0.9;
			ctx.globalAlpha = 0.18 + rand() * 0.1;
			ctx.fillRect(px, py, size, size);
		}

		// Dry-brush flecks catching the light along the brick lower body.
		ctx.fillStyle = CREAM_LIGHT;
		for (let i = 0; i < 90; i++) {
			const px = 30 + rand() * 660;
			const py = 204 + rand() * 46;
			ctx.globalAlpha = 0.08 + rand() * 0.08;
			ctx.fillRect(px, py, 2 + rand() * 5, 1.1);
		}

		// Long brush strokes across the flanks.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[58, 146, 118, 140],
			[212, 108, 336, 106],
			[356, 186, 520, 184],
			[560, 214, 668, 212],
			[60, 228, 128, 226],
			[296, 240, 372, 239],
			[600, 172, 654, 170]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
			ctx.stroke();
		}

		// A light dry-brush scuff on each brick flank.
		ctx.globalAlpha = 0.16;
		ctx.strokeStyle = CREAM_LIGHT;
		ctx.lineWidth = 1.4;
		for (const [sx, sy, ex] of [
			[92, 236, 132],
			[398, 232, 446],
			[588, 240, 636]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.6, ex, sy);
			ctx.stroke();
		}
		ctx.restore();

		// Paint glints, clear of the glass and the wheel circles.
		glint(ctx, 70, 190, 5.2);
		glint(ctx, 222, 108, 4.8);
		glint(ctx, 380, 192, 5.4);
		glint(ctx, 486, 146, 4.6);
		glint(ctx, 600, 192, 4.8);
		glint(ctx, 664, 150, 4);
		glint(ctx, 300, 243, 3.8);
		glint(ctx, 478, 232, 4.2);

		// Glass sheen and sparkles.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(62, 172);
		ctx.lineTo(84, 130);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(118, 164);
		ctx.lineTo(160, 126);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(168, 168);
		ctx.lineTo(186, 142);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(274, 164);
		ctx.lineTo(294, 140);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(366, 166);
		ctx.lineTo(420, 132);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(572, 166);
		ctx.lineTo(618, 134);
		ctx.stroke();

		// A second, finer pane highlight on the side and cab glass.
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(172, 158);
		ctx.lineTo(184, 132);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(432, 160);
		ctx.lineTo(458, 132);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(602, 160);
		ctx.lineTo(634, 134);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 150, 140, 3.2);
		glint(ctx, 390, 140, 3.4);
		glint(ctx, 585, 142, 3);

		// Whitewalls and hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Lit arch crowns over the brick wheel arches.
		ctx.strokeStyle = 'rgba(250,243,227,0.42)';
		ctx.lineWidth = 2.2;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 9.4, Math.PI * 1.16, Math.PI * 1.84);
			ctx.stroke();
		}

		// Embossed wordmark: a cream key light behind the brick lettering.
		ctx.font = '700 15px ui-rounded, system-ui, sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';
		ctx.save();
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = CREAM_LIGHT;
		ctx.fillText('CAMPER', 477, 167);
		ctx.restore();
		ctx.fillStyle = BRICK;
		ctx.fillText('CAMPER', 478, 168);

		// Chrome trim rivets along the pop-top base.
		ctx.save();
		ctx.fillStyle = CHROME;
		ctx.globalAlpha = 0.55;
		for (let rivetX = 170; rivetX <= 570; rivetX += 26) {
			ctx.beginPath();
			ctx.arc(rivetX, 62.5, 1.1, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Finishing marks: rack rail, bumper lips, lid trim and awning eyes.
		line(ctx, 224, 29.5, 516, 29.5, 'rgba(255,255,255,0.6)', 1.6);
		line(ctx, 27, 254, 41, 254, 'rgba(255,255,255,0.5)', 1.4);
		line(ctx, 685, 254, 697, 254, 'rgba(255,255,255,0.5)', 1.4);
		line(ctx, 300, 108, 580, 108, 'rgba(255,255,255,0.32)', 1.4);

		// Chrome licks: rack caps and posts, bumper edges, mirror, handle, step.
		line(ctx, 221.6, 29, 221.6, 32.6, 'rgba(255,255,255,0.75)', 1.4);
		line(ctx, 518.4, 29, 518.4, 32.6, 'rgba(255,255,255,0.75)', 1.4);
		for (const postX of [234, 314, 394, 474]) {
			line(ctx, postX + 1.4, 34, postX + 1.4, 45, 'rgba(255,255,255,0.45)', 1);
		}
		line(ctx, 25.6, 240.5, 25.6, 255, 'rgba(255,255,255,0.55)', 1.2);
		line(ctx, 698.4, 243, 698.4, 255.5, 'rgba(255,255,255,0.55)', 1.2);
		line(ctx, 318, 195.2, 329, 195.2, 'rgba(255,255,255,0.8)', 1.1);
		line(ctx, 11.5, 121.6, 27.5, 121.6, 'rgba(255,255,255,0.6)', 1.1);
		glint(ctx, 16, 128, 2.6);
		line(ctx, 254, 253.6, 330, 253.6, 'rgba(255,255,255,0.45)', 1.2);

		// Headlamp chrome bezel and lens sparkle; fuel-cap glint.
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.arc(54, 216, 8.6, Math.PI * 1.08, Math.PI * 1.62);
		ctx.stroke();
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.beginPath();
		ctx.arc(52.6, 213.4, 1.5, 0, Math.PI * 2);
		ctx.fill();
		line(ctx, 504, 224, 507.6, 224, 'rgba(255,255,255,0.7)', 1.1);

		// Picture-book exhaust wisp at the rear corner, kept inside the tile.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.38;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[648, 249, 2.8],
			[652, 247, 3.4],
			[659, 241, 4.2],
			[665, 234, 3.2],
			[669, 228, 2.4]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealCamper(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealCamperLevel(ctx, x, y, scale, 5);
}
