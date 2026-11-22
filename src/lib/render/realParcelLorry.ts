/**
 * Parcel lorry art, cut into the same five-piece kit as the other realistic vehicles.
 * A compact cab-over box lorry facing left: a tall red body with a cream parcel motif,
 * a roll-up rear shutter with horizontal slats, a side loading door, a roof rail,
 * mudguards and lamps. Level 5 is the production target: shaded, fitted, lit and
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
	roundedPath,
	shape,
	wheel
} from './realKit';

const RED = '#C1121F';
const RED_DARK = '#8F0D17';
const CREAM = '#F2E8CF';
const CREAM_SHADE = '#E3D5B4';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const TAIL = '#FF4D6D';

/** Art box 780 x 360, road at 272. Front (cab) faces left. */
const SHELL =
	'M24,258 L24,124 Q24,106 42,102 L196,102 L196,44 L748,44 Q764,44 764,60 L764,240 L196,240 L196,258 Z';

// The spec body mask is this shell plus the underbody band, the roof rail, the exhaust
// stack, the mirror head and the bumpers/step: subpaths touch but never overlap, so the
// evenodd clip cannot punch a hole.
const ROOF_RAIL_BAR = 'M214,32 L742,32 L742,38 L214,38 Z';
const ROOF_RAIL_POST_A = 'M226,38 L234,38 L234,44 L226,44 Z';
const ROOF_RAIL_POST_B = 'M722,38 L730,38 L730,44 L722,44 Z';
const EXHAUST = 'M186,82 L196,82 L196,102 L186,102 Z';

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const WINDSCREEN = pane(34, 112, 104, 64, 10);
const SIDE_GLASS = pane(146, 116, 42, 56, 5);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Side loading door on the box flank: a clean rectangle, clear of every glass pane. */
const DOOR = { x: 474, y: 96, w: 92, h: 110 };

/** Rear roll-up shutter bay at the right-hand end of the box. */
const SHUTTER = { x: 678, y: 54, w: 78, h: 174 };

/** The cream parcel motif: a staggered stack of tape-crossed boxes. */
const PARCELS = [
	{ x: 212, y: 62, w: 94, h: 76 },
	{ x: 316, y: 88, w: 66, h: 58 },
	{ x: 414, y: 66, w: 46, h: 42 },
	{ x: 232, y: 152, w: 104, h: 66 },
	{ x: 348, y: 160, w: 58, h: 58 }
];

const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 620, y: 236, r: 36 };

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
	ctx.fillStyle = CREAM;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(58,39,27,0.34)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5.6, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
}

/** One tape-crossed parcel outline in cream, with a small address label when fitted. */
function parcelBox(
	ctx: CanvasRenderingContext2D,
	box: { x: number; y: number; w: number; h: number },
	fitted: boolean
): void {
	const path = new Path2D(roundedPath(box.w, box.h, 3));
	ctx.save();
	ctx.translate(box.x + box.w / 2, box.y + box.h / 2);
	ctx.fillStyle = 'rgba(242,232,207,0.09)';
	ctx.fill(path);
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 2.8;
	ctx.stroke(path);
	ctx.restore();

	// String-tied parcel: a lid seam and the crossed tape, the parcel signature.
	line(ctx, box.x + 3, box.y + 9, box.x + box.w - 3, box.y + 9, CREAM, 1.8);
	line(ctx, box.x + 4, box.y + 4, box.x + box.w - 4, box.y + box.h - 4, CREAM, 2.2);
	line(ctx, box.x + box.w - 4, box.y + 4, box.x + 4, box.y + box.h - 4, CREAM, 2.2);

	if (fitted) {
		rect(ctx, box.x + box.w - 25, box.y + box.h - 17, 18, 11, CREAM, 1.5, 1.4);
		line(
			ctx,
			box.x + box.w - 22,
			box.y + box.h - 13.5,
			box.x + box.w - 10,
			box.y + box.h - 13.5,
			'rgba(58,39,27,0.5)',
			1.1
		);
		line(
			ctx,
			box.x + box.w - 22,
			box.y + box.h - 10,
			box.x + box.w - 15,
			box.y + box.h - 10,
			'rgba(58,39,27,0.35)',
			1.1
		);
	}
}

/** Rear roll-up shutter: guide rails, horizontal slats, bottom bar and latch. */
function rearShutter(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	// Roll drum across the top of the bay.
	rect(ctx, SHUTTER.x, SHUTTER.y - 4, SHUTTER.w, 8, STEEL, 2, 2.2);
	line(ctx, SHUTTER.x + 3, SHUTTER.y - 1.4, SHUTTER.x + SHUTTER.w - 3, SHUTTER.y - 1.4, 'rgba(255,255,255,0.42)', 1.4);

	rect(ctx, SHUTTER.x + 6, SHUTTER.y, SHUTTER.w - 12, SHUTTER.h, RED_DARK, 0, 0);

	// Horizontal slats, each dark groove over a highlight.
	for (let slatY = SHUTTER.y + 6; slatY < SHUTTER.y + SHUTTER.h - 14; slatY += 8.5) {
		line(
			ctx,
			SHUTTER.x + 7,
			slatY,
			SHUTTER.x + SHUTTER.w - 7,
			slatY,
			'rgba(58,39,27,0.42)',
			2.2
		);
		if (shaded) {
			line(
				ctx,
				SHUTTER.x + 7,
				slatY + 2.2,
				SHUTTER.x + SHUTTER.w - 7,
				slatY + 2.2,
				'rgba(255,255,255,0.22)',
				1.4
			);
		}
	}

	// Side guide rails.
	rect(ctx, SHUTTER.x, SHUTTER.y, 7, SHUTTER.h, STEEL, 1.6, 2);
	rect(ctx, SHUTTER.x + SHUTTER.w - 7, SHUTTER.y, 7, SHUTTER.h, STEEL, 1.6, 2);
	line(ctx, SHUTTER.x + 2, SHUTTER.y + 4, SHUTTER.x + 2, SHUTTER.y + SHUTTER.h - 4, 'rgba(255,255,255,0.32)', 1.3);
	line(
		ctx,
		SHUTTER.x + SHUTTER.w - 4,
		SHUTTER.y + 4,
		SHUTTER.x + SHUTTER.w - 4,
		SHUTTER.y + SHUTTER.h - 4,
		'rgba(255,255,255,0.32)',
		1.3
	);

	// Bottom bar with the pull handle and lock.
	rect(ctx, SHUTTER.x + 7, SHUTTER.y + SHUTTER.h - 14, SHUTTER.w - 14, 14, STEEL, 1.5, 2);
	rect(ctx, SHUTTER.x + 15, SHUTTER.y + SHUTTER.h - 26, SHUTTER.w - 30, 10, CHROME, 2, 1.8);
	line(
		ctx,
		SHUTTER.x + 18,
		SHUTTER.y + SHUTTER.h - 21,
		SHUTTER.x + SHUTTER.w - 18,
		SHUTTER.y + SHUTTER.h - 21,
		'rgba(58,39,27,0.28)',
		1.3
	);

	if (fitted) {
		for (const boltY of [SHUTTER.y + 12, SHUTTER.y + SHUTTER.h - 30]) {
			circle(ctx, SHUTTER.x + 3.5, boltY, 1.8, CHROME, 1.1);
			circle(ctx, SHUTTER.x + SHUTTER.w - 3.5, boltY, 1.8, CHROME, 1.1);
		}
		rect(ctx, SHUTTER.x + SHUTTER.w - 22, SHUTTER.y + 82, 9, 22, CHROME, 2.5, 2.2);
		line(
			ctx,
			SHUTTER.x + SHUTTER.w - 17.5,
			SHUTTER.y + 85,
			SHUTTER.x + SHUTTER.w - 17.5,
			SHUTTER.y + 101,
			'rgba(58,39,27,0.34)',
			1.5
		);
	}
}

/** Side loading door: cream leaf, red tape stripe, hinges and latch bar. */
function loadingDoor(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, CREAM_SHADE, 3, 2.8);
	rect(ctx, DOOR.x + 6, DOOR.y + 6, DOOR.w - 12, DOOR.h - 12, CREAM, 2, 2);
	rect(ctx, DOOR.x + 6, DOOR.y + 44, DOOR.w - 12, 10, RED, 0, 0);
	line(ctx, DOOR.x + 6, DOOR.y + 10, DOOR.x + DOOR.w - 6, DOOR.y + 10, 'rgba(58,39,27,0.16)', 1.6);

	if (shaded) {
		line(ctx, DOOR.x + 8, DOOR.y + 46, DOOR.x + DOOR.w - 8, DOOR.y + 46, 'rgba(255,255,255,0.32)', 1.2);
		line(ctx, DOOR.x + 8, DOOR.y + 53, DOOR.x + DOOR.w - 8, DOOR.y + 53, 'rgba(58,39,27,0.28)', 1.4);
	}

	if (fitted) {
		for (const hingeY of [DOOR.y + 18, DOOR.y + 58, DOOR.y + 92]) {
			rect(ctx, DOOR.x + 1, hingeY, 7, 13, STEEL, 2, 1.6);
		}

		rect(ctx, DOOR.x + DOOR.w - 18, DOOR.y + 30, 9, 30, CHROME, 3, 2.2);
		rect(ctx, DOOR.x + DOOR.w - 30, DOOR.y + 42, 11, 5, STEEL, 1.5, 1.4);
		rect(ctx, DOOR.x + 6, DOOR.y + DOOR.h - 18, DOOR.w - 12, 9, STEEL, 2, 1.6);
		line(ctx, DOOR.x + 10, DOOR.y + DOOR.h - 13.5, DOOR.x + DOOR.w - 10, DOOR.y + DOOR.h - 13.5, 'rgba(255,255,255,0.4)', 1.2);
	}
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
 * Picture-book hub: sidewall gloss, bright rim ring, six bolt heads and a polished centre
 * cap. Every mark is mirror-symmetric about the hub centre, so the flipped rear wheel
 * assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Sidewall catches the roof light on both shoulders, clear of the tread notches.
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
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.5, CHROME, 1.2);
		// Each bolt head keeps a specular pip on its upper shoulder.
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx - 0.8, by - 0.9, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	// Dish shadow under the cap, then the polished cap itself.
	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, 0.18 * Math.PI, 0.82 * Math.PI);
	ctx.stroke();
	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.9)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.1, Math.PI * 1.06, Math.PI * 1.6);
	ctx.stroke();
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x - 0.8, y - 0.9, 0.9, 0, Math.PI * 2);
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
	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
	line(ctx, x, y - r * 0.53, x, y - r * 0.64, CHROME, 2);
}

/** Paint grain over solid paint only: the glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	// Hand-mixed wash: warm cream into the roof, a deeper red into the skirt.
	const wash = ctx.createLinearGradient(210, 44, 700, 250);
	wash.addColorStop(0, 'rgba(255,238,206,0.09)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.1)');
	ctx.fillStyle = wash;
	ctx.fillRect(24, 44, 740, 216);

	let seed = 53;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 470; i++) {
		const px = 30 + rand() * 730;
		const py = 48 + rand() * 204;
		const size = 1.4 + rand() * 1.1;
		ctx.globalAlpha = 0.11 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 170; i++) {
		const px = 30 + rand() * 730;
		const py = 48 + rand() * 204;
		const size = 1.2 + rand() * 0.9;
		ctx.globalAlpha = 0.16 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush strokes across the cab flank, box panels and skirt.
	ctx.globalAlpha = 0.12;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[44, 118, 124, 116],
		[206, 72, 438, 70],
		[478, 118, 560, 116],
		[206, 204, 444, 202],
		[580, 196, 668, 194],
		[214, 96, 296, 95],
		[560, 210, 660, 208],
		[42, 238, 178, 236]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest.
	ctx.globalAlpha = 0.16;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[54, 224, 96, 222],
		[228, 236, 280, 235],
		[602, 214, 654, 213],
		[722, 96, 752, 95]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Panel sheen: roof light falling down the box and cab, plus a wet gloss on the flank. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	const roofSheen = ctx.createLinearGradient(0, 48, 0, 108);
	roofSheen.addColorStop(0, 'rgba(255,255,255,0.24)');
	roofSheen.addColorStop(0.55, 'rgba(255,255,255,0.07)');
	roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roofSheen;
	ctx.fillRect(198, 48, 554, 60);

	const cabSheen = ctx.createLinearGradient(0, 102, 0, 152);
	cabSheen.addColorStop(0, 'rgba(255,255,255,0.26)');
	cabSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cabSheen;
	ctx.fillRect(24, 102, 172, 50);

	// Broad diagonal gloss across the empty flank between the door and the shutter.
	const flankSheen = ctx.createLinearGradient(566, 60, 688, 220);
	flankSheen.addColorStop(0, 'rgba(255,240,214,0)');
	flankSheen.addColorStop(0.44, 'rgba(255,240,214,0.16)');
	flankSheen.addColorStop(0.7, 'rgba(255,240,214,0.05)');
	flankSheen.addColorStop(1, 'rgba(255,240,214,0)');
	ctx.fillStyle = flankSheen;
	ctx.fillRect(566, 56, 110, 168);

	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 3;
	for (const [sx, sy, ex, ey] of [
		[210, 66, 660, 64],
		[210, 214, 664, 212],
		[574, 176, 668, 174],
		[48, 226, 178, 224]
	]) {
		ctx.globalAlpha = 0.24;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** The parcel motif catches window light: lit lid edge, shaded stile, tape gloss. */
function parcelSheen(ctx: CanvasRenderingContext2D): void {
	for (const box of PARCELS) {
		ctx.save();
		ctx.translate(box.x + box.w / 2, box.y + box.h / 2);
		ctx.clip(new Path2D(roundedPath(box.w, box.h, 3)));

		const sheen = ctx.createLinearGradient(
			-box.w / 2,
			-box.h / 2,
			box.w / 2,
			box.h / 2
		);
		sheen.addColorStop(0, 'rgba(255,252,240,0.32)');
		sheen.addColorStop(0.44, 'rgba(255,248,228,0.06)');
		sheen.addColorStop(1, 'rgba(58,39,27,0.15)');
		ctx.fillStyle = sheen;
		ctx.fillRect(-box.w / 2, -box.h / 2, box.w, box.h);

		// Lit lid edge, shaded right stile.
		ctx.strokeStyle = 'rgba(255,252,235,0.62)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(-box.w / 2 + 5, -box.h / 2 + 1.8);
		ctx.lineTo(box.w / 2 - 5, -box.h / 2 + 1.8);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(58,39,27,0.15)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(box.w / 2 - 2, -box.h / 2 + 6);
		ctx.lineTo(box.w / 2 - 2, box.h / 2 - 6);
		ctx.stroke();

		// The crossed tape picks up a bright top edge and a short corner glint.
		ctx.strokeStyle = 'rgba(255,255,255,0.48)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(-box.w / 2 + 5, -box.h / 2 + 3);
		ctx.lineTo(box.w / 2 - 5, box.h / 2 - 5);
		ctx.moveTo(box.w / 2 - 5, -box.h / 2 + 3);
		ctx.lineTo(-box.w / 2 + 5, box.h / 2 - 5);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(-box.w / 2 + 8, -box.h / 2 + 17);
		ctx.lineTo(-box.w / 2 + 17, -box.h / 2 + 8);
		ctx.stroke();
		ctx.restore();

		// Address label: bright top edge so it reads as a separate slip.
		line(
			ctx,
			box.x + box.w - 23,
			box.y + box.h - 16,
			box.x + box.w - 9,
			box.y + box.h - 16,
			'rgba(255,255,255,0.55)',
			1.1
		);
		line(
			ctx,
			box.x + box.w - 22,
			box.y + box.h - 8,
			box.x + box.w - 16,
			box.y + box.h - 8,
			'rgba(58,39,27,0.35)',
			1
		);
	}
}

/** Rear shutter sheen: a diagonal gloss across the slats and lit rails and handle. */
function shutterSheen(ctx: CanvasRenderingContext2D): void {
	const field = { x: SHUTTER.x + 7, y: SHUTTER.y, w: SHUTTER.w - 14, h: SHUTTER.h };
	ctx.save();
	ctx.beginPath();
	ctx.rect(field.x, field.y, field.w, field.h);
	ctx.clip();

	const gloss = ctx.createLinearGradient(field.x, field.y + field.h, field.x + field.w, field.y);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.4, 'rgba(255,255,255,0.12)');
	gloss.addColorStop(0.56, 'rgba(255,255,255,0.22)');
	gloss.addColorStop(0.74, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(field.x, field.y, field.w, field.h);

	ctx.globalAlpha = 0.3;
	ctx.strokeStyle = '#FFF4E2';
	ctx.lineWidth = 1.5;
	for (let slatY = SHUTTER.y + 6; slatY < SHUTTER.y + SHUTTER.h - 14; slatY += 8.5) {
		ctx.beginPath();
		ctx.moveTo(field.x + 1, slatY + 2.4);
		ctx.lineTo(field.x + field.w - 1, slatY + 2.4);
		ctx.stroke();
	}
	ctx.restore();

	// Lit guide rails, one narrow band on each.
	line(ctx, SHUTTER.x + 2, 62, SHUTTER.x + 2, 216, 'rgba(255,255,255,0.42)', 1.4);
	line(ctx, SHUTTER.x + 9, 62, SHUTTER.x + 9, 216, 'rgba(255,255,255,0.34)', 2);
	line(
		ctx,
		SHUTTER.x + SHUTTER.w - 9,
		SHUTTER.y + 8,
		SHUTTER.x + SHUTTER.w - 9,
		SHUTTER.y + SHUTTER.h - 18,
		'rgba(255,255,255,0.22)',
		1.8
	);

	// Bottom bar lip, pull handle gloss and a sparkle on the latch.
	line(
		ctx,
		SHUTTER.x + 8,
		SHUTTER.y + SHUTTER.h - 13.4,
		SHUTTER.x + SHUTTER.w - 8,
		SHUTTER.y + SHUTTER.h - 13.4,
		'rgba(255,255,255,0.6)',
		1.6
	);
	line(
		ctx,
		SHUTTER.x + 17.4,
		SHUTTER.y + SHUTTER.h - 25,
		SHUTTER.x + 17.4,
		SHUTTER.y + SHUTTER.h - 17,
		'rgba(255,255,255,0.55)',
		1.4
	);
	line(
		ctx,
		SHUTTER.x + SHUTTER.w - 20,
		SHUTTER.y + 84,
		SHUTTER.x + SHUTTER.w - 20,
		SHUTTER.y + 102,
		'rgba(255,255,255,0.45)',
		1.2
	);
	glint(ctx, SHUTTER.x + SHUTTER.w - 17.5, SHUTTER.y + 88, 2.3);
}

/** Side loading door highlights: leaf sheen, lit stiles, hinge bolts and handle glow. */
function doorSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(DOOR.x + 6, DOOR.y + 6, DOOR.w - 12, DOOR.h - 12);
	ctx.clip();

	const leaf = ctx.createLinearGradient(DOOR.x + 6, 0, DOOR.x + 62, 0);
	leaf.addColorStop(0, 'rgba(255,255,255,0.36)');
	leaf.addColorStop(0.7, 'rgba(255,255,255,0.06)');
	leaf.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = leaf;
	ctx.fillRect(DOOR.x + 6, DOOR.y + 6, DOOR.w - 12, DOOR.h - 12);

	const floorBounce = ctx.createLinearGradient(0, DOOR.y + DOOR.h - 40, 0, DOOR.y + DOOR.h - 8);
	floorBounce.addColorStop(0, 'rgba(255,255,255,0)');
	floorBounce.addColorStop(1, 'rgba(255,246,224,0.22)');
	ctx.fillStyle = floorBounce;
	ctx.fillRect(DOOR.x + 6, DOOR.y + DOOR.h - 40, DOOR.w - 12, 32);
	ctx.restore();

	line(
		ctx,
		DOOR.x + 7.2,
		DOOR.y + 12,
		DOOR.x + 7.2,
		DOOR.y + DOOR.h - 12,
		'rgba(255,255,255,0.42)',
		1.4
	);
	line(
		ctx,
		DOOR.x + DOOR.w - 7.2,
		DOOR.y + 12,
		DOOR.x + DOOR.w - 7.2,
		DOOR.y + DOOR.h - 12,
		'rgba(255,255,255,0.5)',
		1.4
	);
	line(
		ctx,
		DOOR.x + 7,
		DOOR.y + 44.8,
		DOOR.x + DOOR.w - 7,
		DOOR.y + 44.8,
		'rgba(255,255,255,0.4)',
		1.6
	);

	for (const hingeY of [DOOR.y + 18, DOOR.y + 58, DOOR.y + 92]) {
		circle(ctx, DOOR.x + 4.5, hingeY + 6.5, 1.5, CHROME, 1);
	}

	line(
		ctx,
		DOOR.x + DOOR.w - 15.8,
		DOOR.y + 32,
		DOOR.x + DOOR.w - 15.8,
		DOOR.y + 58,
		'rgba(255,255,255,0.6)',
		1.4
	);
	line(
		ctx,
		DOOR.x + 10,
		DOOR.y + DOOR.h - 16.2,
		DOOR.x + DOOR.w - 10,
		DOOR.y + DOOR.h - 16.2,
		'rgba(255,255,255,0.5)',
		1.1
	);
}

/** Finishing marks: rail rivets, lamp sparkles, mudguard rivets and the exhaust puff. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	line(ctx, 210, 58, 300, 58, 'rgba(255,255,255,0.4)', 1.4);
	line(ctx, 218.5, 33, 218.5, 37, 'rgba(255,255,255,0.65)', 1.4);
	line(ctx, 737.5, 33, 737.5, 37, 'rgba(255,255,255,0.65)', 1.4);

	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.7;
	for (let rivetX = 222; rivetX <= 734; rivetX += 32) {
		ctx.beginPath();
		ctx.arc(rivetX, 35, 1.5, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Bumper and step lips.
	line(ctx, 10, 249, 22, 249, 'rgba(255,255,255,0.75)', 1.8);
	line(ctx, 766, 250, 774, 250, 'rgba(255,255,255,0.7)', 1.6);
	line(ctx, 96, 259.5, 120, 259.5, 'rgba(255,255,255,0.5)', 1.3);

	// Lamp sparkles: headlamp, marker lamps, tail lamp.
	ctx.fillStyle = '#FFFDF2';
	ctx.beginPath();
	ctx.arc(30.5, 225.4, 1.9, 0, Math.PI * 2);
	ctx.fill();
	for (const markerX of [210, 596, 658]) {
		ctx.beginPath();
		ctx.arc(markerX + 3.6, 229.4, 1.2, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.beginPath();
	ctx.arc(725, 246, 1.5, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(741, 245, 1.1, 0, Math.PI * 2);
	ctx.fill();

	// Mudguard rivets and the lit arch crowns.
	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		circle(ctx, wheelX, WHEEL_L.y - WHEEL_L.r - 9.6, 1.6, CHROME, 1);
		circle(ctx, wheelX - WHEEL_L.r - 9.2, WHEEL_L.y - 8, 1.3, CHROME, 0.9);
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 8.6, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
	}

	// Exhaust stack: mouth rim, cuff highlight and the puff above it.
	line(ctx, 186.8, 83.2, 195.2, 83.2, 'rgba(255,255,255,0.55)', 1.4);
	line(ctx, 188.5, 92, 188.5, 101, 'rgba(255,255,255,0.3)', 1.1);

	// Stone chips on the skirt, where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, chipR] of [
		[206, 236, 1.3],
		[268, 237, 1.1],
		[612, 236, 1.2],
		[60, 246, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(chipX, chipY, chipR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Garage-dust speckle low on the box, so the finish has a used edge.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	for (const [dustX, dustY, dustR] of [
		[250, 234, 1.6],
		[462, 235, 1.4],
		[560, 234, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Exhaust puff above the stack mouth.
	ctx.save();
	ctx.globalAlpha = 0.4;
	ctx.fillStyle = '#D5DCE5';
	for (const [px, py, pr] of [
		[191, 77, 3.4],
		[193, 72, 4],
		[190, 67, 3.2]
	]) {
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export function drawRealParcelLorryLevel(
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
		ctx.ellipse(392, 279, 356, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis block: painted under the box so the body mask keeps its underbody.
	rect(ctx, 24, 240, 740, 18, '#6F7987', 0, 0);
	rect(ctx, 24, 240, 740, 3, '#8C96A4', 0, 0);
	rect(ctx, 24, 255, 740, 3, '#555D6A', 0, 0);

	// Cab, box and lower skirt in one silhouette.
	shape(ctx, SHELL, RED);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Body paint: light roof, warm mid and a deep lower shade.
	if (shaded) {
		const boxPaint = ctx.createLinearGradient(0, 44, 0, 240);
		boxPaint.addColorStop(0, 'rgba(255,255,255,0.34)');
		boxPaint.addColorStop(0.16, 'rgba(255,255,255,0.06)');
		boxPaint.addColorStop(0.68, 'rgba(58,39,27,0.03)');
		boxPaint.addColorStop(1, 'rgba(58,39,27,0.2)');
		ctx.fillStyle = boxPaint;
		ctx.fillRect(196, 44, 568, 196);

		const cabPaint = ctx.createLinearGradient(0, 102, 0, 258);
		cabPaint.addColorStop(0, 'rgba(255,255,255,0.38)');
		cabPaint.addColorStop(0.3, 'rgba(255,255,255,0.06)');
		cabPaint.addColorStop(0.76, 'rgba(58,39,27,0.03)');
		cabPaint.addColorStop(1, 'rgba(58,39,27,0.18)');
		ctx.fillStyle = cabPaint;
		ctx.fillRect(24, 102, 172, 156);
	}

	// Rear shutter before the livery so the bands stop short of the bay.
	rearShutter(ctx, shaded, fitted);

	// Livery: cream roof pinstripe, waist band and skirt band.
	rect(ctx, 200, 50, 472, 4, CREAM, 0, 0);
	line(ctx, 200, 54, 672, 54, 'rgba(58,39,27,0.24)', 1.2);
	rect(ctx, 200, 224, 472, 9, CREAM, 0, 0);
	line(ctx, 200, 226.4, 672, 226.4, 'rgba(255,255,255,0.35)', 1.4);
	line(ctx, 200, 232, 672, 232, 'rgba(58,39,27,0.28)', 1.8);

	rect(ctx, 24, 102, 172, 6, CREAM, 0, 0);
	line(ctx, 24, 108, 196, 108, 'rgba(58,39,27,0.24)', 1.3);
	rect(ctx, 24, 224, 172, 9, CREAM, 0, 0);
	line(ctx, 24, 226.4, 196, 226.4, 'rgba(255,255,255,0.35)', 1.4);

	// Cab door seam and handle, cab/box joint and the box bevel.
	line(ctx, 142, 110, 142, 252, 'rgba(58,39,27,0.4)', 2);
	line(ctx, 143.6, 114, 143.6, 248, 'rgba(255,255,255,0.32)', 1.1);
	rect(ctx, 148, 196, 18, 6, CHROME, 2.5, 2);

	line(ctx, 196, 44, 196, 240, 'rgba(58,39,27,0.4)', 2.2);
	line(ctx, 197.6, 48, 197.6, 238, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, 200, 44, 200, 240, 'rgba(255,255,255,0.2)', 1.6);

	// Fine vertical seams on the plain stretch between the loading door and the shutter.
	if (shaded) {
		for (const seamX of [592, 650]) {
			line(ctx, seamX, 58, seamX, 220, 'rgba(58,39,27,0.2)', 1.6);
			line(ctx, seamX + 1.6, 58, seamX + 1.6, 220, 'rgba(255,255,255,0.35)', 1.2);
		}
		line(ctx, 200, 220, 672, 220, 'rgba(58,39,27,0.16)', 1.2);
	}

	// The cream parcel motif.
	for (const parcel of PARCELS) {
		parcelBox(ctx, parcel, fitted);
	}

	loadingDoor(ctx, shaded, fitted);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Exhaust stack at the cab/box joint, above the cab roof.
	shape(ctx, EXHAUST, STEEL, 2.4);
	if (shaded) {
		rect(ctx, 187.5, 88, 7, 4, CHROME, 1.5, 1.4);
		line(ctx, 188.5, 96, 188.5, 101, 'rgba(255,255,255,0.35)', 1.2);
	}

	// Mirror head and arm on the A-pillar.
	line(ctx, 24, 132, 15, 126, INK, 3.4);
	line(ctx, 24, 132, 15, 126, STEEL, 2.2);
	rect(ctx, 8, 118, 16, 34, CREAM, 3, 2.4);
	if (shaded) {
		rect(ctx, 10.5, 122, 11, 26, GLASS, 1.4);
	}

	// Roof rail: two posts and the rail bar.
	shape(ctx, ROOF_RAIL_POST_A, CREAM, 2);
	shape(ctx, ROOF_RAIL_POST_B, CREAM, 2);
	shape(ctx, ROOF_RAIL_BAR, CREAM, 2.4);
	line(ctx, 218, 34.5, 738, 34.5, 'rgba(255,255,255,0.5)', 1.4);

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 34, 112, 104, 64);
		glassShade(ctx, SIDE_GLASS, 146, 116, 42, 56);
	}

	// Front bumper, under the cab nose, and the step below the cab door.
	rect(ctx, 8, 242, 16, 6, '#4E5764', 1.5, 1.6);
	rect(ctx, 8, 247, 16, 19, CHROME, 3, 2.6);
	line(ctx, 10, 251, 22, 251, 'rgba(255,255,255,0.6)', 1.8);
	line(ctx, 10, 262, 22, 262, 'rgba(58,39,27,0.3)', 1.6);

	rect(ctx, 92, 258, 32, 10, STEEL, 2, 2);
	line(ctx, 96, 262, 120, 262, 'rgba(255,255,255,0.4)', 1.3);

	// Rear under-run bumper.
	rect(ctx, 764, 248, 12, 18, CHROME, 2.5, 2.6);
	line(ctx, 766, 251, 774, 251, 'rgba(255,255,255,0.55)', 1.6);
	line(ctx, 766, 262, 774, 262, 'rgba(58,39,27,0.26)', 1.4);

	if (fitted) {
		// Cab front: visor, grille, lamps, wipers and the roof marker lights.
		rect(ctx, 28, 106, 112, 6, RED_DARK, 2.5, 2);
		rect(ctx, 26, 190, 10, 18, STEEL, 2, 2);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 27, 190 + bar * 4.5, 35, 190 + bar * 4.5, CHROME, 1.4);
		}
		circle(ctx, 33, 228, 8.5, LAMP, 2.4);
		circle(ctx, 33, 228, 4.2, '#FFF7CF', 1.5);
		rect(ctx, 27, 208, 9, 8, AMBER, 2, 1.6);
		line(ctx, 52, 172, 78, 150, INK, 2.2);
		line(ctx, 86, 170, 106, 154, INK, 2);

		for (const markerX of [210, 596, 658]) {
			rect(ctx, markerX, 227, 13, 6, AMBER, 1.5, 1.2);
		}
		for (const lampX of [26, 46, 66]) {
			circle(ctx, lampX, 100, 2.2, AMBER, 1.1);
		}

		// Rear lamps and plate on the chassis under the shutter.
		rect(ctx, 722, 242, 12, 14, TAIL, 2, 1.8);
		rect(ctx, 738, 242, 10, 10, AMBER, 1.5, 1.5);
		rect(ctx, 748, 250, 16, 9, CREAM, 1.2, 1.4);

		// Side under-run bar between the axles.
		rect(ctx, 230, 256, 336, 6, CHROME, 2, 2);
		line(ctx, 236, 258.8, 560, 258.8, 'rgba(255,255,255,0.45)', 1.2);
	}

	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: cab roof, box roof, rail and the rear corner.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(48, 103);
		ctx.lineTo(190, 103);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(200, 45.5);
		ctx.lineTo(744, 45.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(762.5, 64);
		ctx.lineTo(762.5, 234);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(25.5, 130);
		ctx.lineTo(25.5, 246);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(33, 228, 1, 33, 228, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(33, 228, 30, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 272, 33, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		panelSheen(ctx);
		parcelSheen(ctx);
		shutterSheen(ctx);
		doorSheen(ctx);

		// Glints, clear of glass, tyres, parcel linework and the shutter.
		glint(ctx, 442, 126, 5.4);
		glint(ctx, 606, 120, 5);
		glint(ctx, 176, 142, 5);
		glint(ctx, 452, 192, 5.2);
		glint(ctx, 118, 186, 3.6);
		glint(ctx, 664, 84, 3.8);

		// Glass sheen and a sparkle in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(52, 168);
		ctx.lineTo(90, 120);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(154, 164);
		ctx.lineTo(178, 124);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 172, 134, 3.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealParcelLorry(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealParcelLorryLevel(ctx, x, y, scale, 5);
}
