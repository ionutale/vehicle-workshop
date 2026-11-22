/**
 * Ambulance art, cut into the same five-piece kit as the other realistic vehicles.
 * A box ambulance facing left: a short van cab under a lower roof, a tall white patient
 * box stepping up behind it, a red waist stripe and roof rail, a segmented roof light bar,
 * a red cross roundel, a red/white chevron panel on the rear corner, a rear door bay, a
 * sliding side door with a fold-out step, and red-trimmed wheel arches. Level 5 is the
 * production target: shaded, fitted, lit and picture-book finished.
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

const WHITE = '#F7F9FC';
const WHITE_SHADE = '#E6EDF6';
const RED = '#E63946';
const RED_DARK = '#C1121F';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const ICE = '#BFE6FF';
const TAIL = '#FF4D6D';
const UNDER = '#5C6472';

/** Art box 720 x 340, road at 272. Front (cab) faces left. */
const SHELL =
	'M36,258 L36,178 Q36,170 44,166 L86,154 L158,96 Q162,88 172,88 L236,88 L236,62 Q236,56 244,56 L656,56 Q668,56 668,68 L668,244 Q668,258 654,258 Z';

/** Roof light bar, sitting on the front of the patient-box roof. */
const LIGHT_BAR = { x: 252, y: 40, w: 120, h: 16 };

/** Cab door mirror head, mounted on the front corner. */
const MIRROR = { x: 18, y: 146, w: 18, h: 40 };

const FRONT_BUMPER = { x: 18, y: 230, w: 18, h: 28 };
const REAR_BUMPER = { x: 668, y: 236, w: 18, h: 20 };

/** Underbody strip between the axles, part of the body cut-out. */
const UNDERBODY = { x: 200, y: 258, w: 340, h: 10 };

/** Rear door bay on the flank corner: one leaf, hinges and a latch rod. */
const REAR_BAY = { x: 636, y: 64, w: 32, h: 86 };

/** Chevron panel on the rear corner, clear of the rear wheel arch. */
const CHEVRON = { x: 630, y: 196, w: 38, h: 40 };

/** Side sliding door, cut out as the door piece. */
const DOOR = { x: 416, y: 104, w: 96, h: 122 };

/** Red cross roundel on the forward patient-box flank. */
const CROSS = { x: 300, y: 126, r: 26 };

const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 580, y: 236, r: 36 };

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Raked windscreen band, cab side pane and the small patient-box window. */
const WINDSCREEN = 'M102,172 L158,98 L188,102 L134,176 Z';
const CAB_GLASS = pane(192, 102, 40, 50, 5);
const BOX_GLASS = pane(536, 116, 58, 46, 6);
const GLASS_MASK = `${WINDSCREEN} ${CAB_GLASS} ${BOX_GLASS}`;

// The spec body mask is this shell plus the light bar, mirror head, both bumpers and the
// underbody strip. Every subpath only touches the shell, never overlaps it, so the evenodd
// clip cannot punch a hole. The wheel circles are never part of the body mask.

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

/** Filled wheel-arch band sitting just outside the tyre, with a red lip. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 12, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = WHITE_SHADE;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = RED;
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 9, Math.PI * 1.08, Math.PI * 1.92);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.65)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5.6, Math.PI * 1.12, Math.PI * 1.88);
	ctx.stroke();
}

/** A solid medical cross. */
function cross(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	arm: number,
	thick: number,
	fill: string
): void {
	ctx.fillStyle = fill;
	ctx.fillRect(cx - thick / 2, cy - arm, thick, arm * 2);
	ctx.fillRect(cx - arm, cy - thick / 2, arm * 2, thick);
}

/** Red/white diagonal chevrons, clipped to the panel. */
function chevrons(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();

	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(x, y, w, h);

	ctx.fillStyle = RED;
	const step = 14;
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
		housing.addColorStop(0, 'rgba(255,255,255,0.6)');
		housing.addColorStop(0.55, 'rgba(255,255,255,0.04)');
		housing.addColorStop(1, 'rgba(58,39,27,0.16)');
		ctx.fillStyle = housing;
		ctx.fillRect(x + 1.5, y + 1.5, w - 3, h - 3);
		ctx.restore();
	}

	if (fitted) {
		const lenses = [
			{ x: x + 7, w: 38, color: RED },
			{ x: x + 49, w: 22, color: ICE },
			{ x: x + 75, w: 38, color: RED }
		];
		for (const lens of lenses) {
			rect(ctx, lens.x, y + 3, lens.w, h - 8, lens.color, 2, 1.6);
			line(ctx, lens.x + 3, y + 5, lens.x + lens.w - 3, y + 5, 'rgba(255,255,255,0.65)', 1.4);
			line(ctx, lens.x + 3, y + h - 6, lens.x + lens.w - 3, y + h - 6, 'rgba(58,39,27,0.3)', 1.1);
		}
		// End caps and the mounting plinth.
		rect(ctx, x + 2, y + 2, 5, h - 4, WHITE_SHADE, 1.5, 1.4);
		rect(ctx, x + w - 7, y + 2, 5, h - 4, WHITE_SHADE, 1.5, 1.4);
		rect(ctx, x + 12, y + h - 6, w - 24, 4, RED_DARK, 1, 1.2);
	} else {
		// Flat silhouette: one red lens face with a chrome end cap.
		rect(ctx, x + 6, y + 3, w - 12, h - 8, RED, 2, 1.6);
		rect(ctx, x + w - 12, y + 3, 5, h - 8, WHITE_SHADE, 1.5, 1.2);
	}

	if (lit) {
		ctx.save();
		ctx.globalAlpha = 0.34;
		const glow = ctx.createRadialGradient(x + 26, y + 7, 1, x + 26, y + 7, 18);
		glow.addColorStop(0, 'rgba(255,90,110,0.85)');
		glow.addColorStop(1, 'rgba(255,90,110,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(x + 26, y + 7, 18, 0, Math.PI * 2);
		ctx.fill();

		const centre = ctx.createRadialGradient(x + 60, y + 7, 1, x + 60, y + 7, 15);
		centre.addColorStop(0, 'rgba(205,240,255,0.8)');
		centre.addColorStop(1, 'rgba(205,240,255,0)');
		ctx.fillStyle = centre;
		ctx.beginPath();
		ctx.arc(x + 60, y + 7, 15, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	if (finish) {
		// Lens glass: a wet diagonal gloss, a hot centre and a hard top lip.
		const lenses = [
			{ x: x + 7, w: 38, color: '255,90,110' },
			{ x: x + 49, w: 22, color: '205,240,255' },
			{ x: x + 75, w: 38, color: '255,90,110' }
		];
		for (const lens of lenses) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(lens.x + 1.5, y + 3.5, lens.w - 3, h - 9);
			ctx.clip();
			const gloss = ctx.createLinearGradient(lens.x, y + h - 6, lens.x + lens.w, y + 4);
			gloss.addColorStop(0, 'rgba(255,255,255,0)');
			gloss.addColorStop(0.46, `rgba(${lens.color},0.24)`);
			gloss.addColorStop(0.62, 'rgba(255,255,255,0.5)');
			gloss.addColorStop(0.78, 'rgba(255,255,255,0.06)');
			gloss.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.fillStyle = gloss;
			ctx.fillRect(lens.x, y + 3, lens.w, h - 8);

			const hot = ctx.createRadialGradient(
				lens.x + lens.w / 2,
				y + h / 2 - 1,
				0.5,
				lens.x + lens.w / 2,
				y + h / 2 - 1,
				lens.w * 0.52
			);
			hot.addColorStop(0, 'rgba(255,255,255,0.38)');
			hot.addColorStop(0.55, `rgba(${lens.color},0.32)`);
			hot.addColorStop(1, `rgba(${lens.color},0)`);
			ctx.fillStyle = hot;
			ctx.fillRect(lens.x, y + 3, lens.w, h - 8);
			ctx.restore();

			line(ctx, lens.x + 2.5, y + 4.6, lens.x + lens.w - 2.5, y + 4.6, 'rgba(255,255,255,0.8)', 1.3);
			glint(ctx, lens.x + lens.w * 0.72, y + 6.4, 1.7);
		}

		// Mounting plinth catches the roof light and two chrome screws hold it.
		line(ctx, x + 13, y + h - 2.4, x + w - 13, y + h - 2.4, 'rgba(255,255,255,0.5)', 1.2);
		circle(ctx, x + 5, y + h / 2, 1.5, CHROME, 1);
		circle(ctx, x + w - 5, y + h / 2, 1.5, CHROME, 1);
		ctx.fillStyle = 'rgba(255,255,255,0.88)';
		for (const [pipX, pipY] of [
			[x + 4.4, y + h / 2 - 0.7],
			[x + w - 5.6, y + h / 2 - 0.7]
		]) {
			ctx.beginPath();
			ctx.arc(pipX, pipY, 0.75, 0, Math.PI * 2);
			ctx.fill();
		}

		// Small halo that reads as a lit lens at game scale.
		ctx.save();
		ctx.globalAlpha = 0.18;
		for (const lens of [x + 26, x + 60, x + 94]) {
			const halo = ctx.createRadialGradient(lens, y + 7, 1, lens, y + 7, 10);
			halo.addColorStop(0, 'rgba(255,255,255,0.6)');
			halo.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.fillStyle = halo;
			ctx.beginPath();
			ctx.arc(lens, y + 7, 10, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}
}

/** Sliding side door: recessed leaf, top track, kick plate, handle, cross decal and step. */
function slidingDoor(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	const { x, y, w, h } = DOOR;

	rect(ctx, x, y, w, h, WHITE_SHADE, 3, 2.6);
	rect(ctx, x + 3, y + 4, w - 6, h - 8, WHITE, 2, 2);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 3, y + 4, w - 6, h - 8);
		ctx.clip();
		const leaf = ctx.createLinearGradient(0, y + 4, 0, y + h - 4);
		leaf.addColorStop(0, 'rgba(255,255,255,0.4)');
		leaf.addColorStop(0.5, 'rgba(255,255,255,0.03)');
		leaf.addColorStop(1, 'rgba(58,39,27,0.16)');
		ctx.fillStyle = leaf;
		ctx.fillRect(x + 3, y + 4, w - 6, h - 8);
		ctx.restore();
	}

	// Top track rail with its rollers.
	rect(ctx, x + 3, y + 4, w - 6, 7, CHROME, 2, 1.8);
	line(ctx, x + 7, y + 7.6, x + w - 7, y + 7.6, 'rgba(58,39,27,0.28)', 1.2);
	if (fitted) {
		circle(ctx, x + 12, y + 7.6, 1.8, STEEL, 1);
		circle(ctx, x + w - 12, y + 7.6, 1.8, STEEL, 1);
	}

	// The livery band runs across the leaf.
	rect(ctx, x + 3, 170, w - 6, 20, RED, 0, 0);
	line(ctx, x + 4, 171.4, x + w - 4, 171.4, 'rgba(255,255,255,0.34)', 1.2);

	// Cross decal above the band.
	circle(ctx, x + 24, y + 34, 13, RED, 2);
	cross(ctx, x + 24, y + 34, 8, 5.6, WHITE);

	// Panel joint and kick plate.
	line(ctx, x + 8, y + 56, x + w - 8, y + 56, 'rgba(58,39,27,0.16)', 1.4);
	rect(ctx, x + 3, y + h - 22, w - 6, 14, WHITE_SHADE, 2, 1.8);

	if (fitted) {
		// Vertical pull handle on the trailing stile.
		rect(ctx, x + w - 17, y + 24, 9, 34, CHROME, 3, 2.2);
		line(ctx, x + w - 12.5, y + 28, x + w - 12.5, y + 52, 'rgba(58,39,27,0.34)', 1.6);
		// Door-edge seam and a pair of striker plates.
		line(ctx, x + w - 3, y + 6, x + w - 3, y + h - 6, 'rgba(58,39,27,0.3)', 1.6);
		rect(ctx, x + 4, y + 70, 5, 14, STEEL, 1.5, 1.3);
		rect(ctx, x + 4, y + 92, 5, 14, STEEL, 1.5, 1.3);
	}
}

/** Rear door bay: one leaf, a mid-rail, hinges and a handle. */
function rearBay(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	const { x, y, w, h } = REAR_BAY;

	rect(ctx, x, y, w, h, WHITE_SHADE, 2.5, 2.6);
	rect(ctx, x + 3, y + 3, w - 6, h - 6, WHITE, 1.5, 2);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 3, y + 3, w - 6, h - 6);
		ctx.clip();
		const leaf = ctx.createLinearGradient(0, y + 3, 0, y + h - 3);
		leaf.addColorStop(0, 'rgba(255,255,255,0.36)');
		leaf.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		leaf.addColorStop(1, 'rgba(58,39,27,0.2)');
		ctx.fillStyle = leaf;
		ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
		ctx.restore();
	}

	// Shut line at the rear corner and the leaf's mid-rail.
	line(ctx, x + w - 4, y + 4, x + w - 4, y + h - 4, 'rgba(58,39,27,0.32)', 2);
	line(ctx, x + 5, y + 46, x + w - 6, y + 46, 'rgba(58,39,27,0.16)', 1.4);
	line(ctx, x + 5, y + 47.4, x + w - 6, y + 47.4, 'rgba(255,255,255,0.4)', 1.1);

	if (fitted) {
		for (const hy of [y + 20, y + 62]) {
			rect(ctx, x + w - 9, hy, 6, 10, STEEL, 1.2, 1.3);
		}
		rect(ctx, x + 4, y + 34, 6, 20, CHROME, 2, 1.6);
		line(ctx, x + 7, y + 38, x + 7, y + 50, 'rgba(58,39,27,0.3)', 1.2);
	}
}

/** Sliding-door sheen: leaf gloss, lit track, handle sparkle and step chrome. */
function doorSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = DOOR;

	ctx.save();
	ctx.beginPath();
	ctx.rect(x + 3, y + 4, w - 6, h - 8);
	ctx.clip();

	const gloss = ctx.createLinearGradient(x + 3, y + h, x + w, y + 4);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.4, 'rgba(255,255,255,0.1)');
	gloss.addColorStop(0.58, 'rgba(255,255,255,0.24)');
	gloss.addColorStop(0.76, 'rgba(255,255,255,0.03)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(x + 3, y + 4, w - 6, h - 8);

	// Warm bounce off the red band and the road.
	const bounce = ctx.createLinearGradient(0, y + h - 26, 0, y + h - 4);
	bounce.addColorStop(0, 'rgba(255,255,255,0)');
	bounce.addColorStop(1, 'rgba(255,255,255,0.16)');
	ctx.fillStyle = bounce;
	ctx.fillRect(x + 3, y + h - 26, w - 6, 22);
	ctx.restore();

	// Track, leaf seams and the pull handle each keep a lit edge.
	line(ctx, x + 5, y + 5.4, x + w - 5, y + 5.4, 'rgba(255,255,255,0.72)', 1.3);
	line(ctx, x + 5, y + 56.4, x + w - 8, y + 56.4, 'rgba(255,255,255,0.4)', 1.1);
	line(ctx, x + 8, y + 72, x + 8, y + h - 24, 'rgba(255,255,255,0.34)', 1.2);
	line(ctx, x + w - 17.4, y + 27, x + w - 17.4, y + 55, 'rgba(255,255,255,0.7)', 1.2);
	line(ctx, x + w - 15.6, y + 27, x + w - 15.6, y + 55, 'rgba(58,39,27,0.2)', 1.1);
	glint(ctx, x + w - 14, y + 44, 1.9);

	// Rollers and the striker plates pick up polished pips.
	ctx.fillStyle = 'rgba(255,255,255,0.88)';
	for (const [pipX, pipY] of [
		[x + 11.4, y + 7],
		[x + w - 12.6, y + 7],
		[x + 5.4, y + 72],
		[x + 5.4, y + 94]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}

	// Step chrome: a bright tread edge and a soft shadow under the riser.
	line(ctx, 420, 233.2, 510, 233.2, 'rgba(255,255,255,0.78)', 1.4);
	line(ctx, 426, 243.4, 502, 243.4, 'rgba(255,255,255,0.55)', 1.2);
	line(ctx, 424, 245.8, 504, 245.8, 'rgba(58,39,27,0.24)', 1.2);
}

/** Rear door bay sheen: leaf gloss, lit shut line and hinge/handle pips. */
function rearBaySheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = REAR_BAY;

	ctx.save();
	ctx.beginPath();
	ctx.rect(x + 3, y + 3, w - 6, h - 6);
	ctx.clip();
	const gloss = ctx.createLinearGradient(x, y + h, x + w, y);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.46, 'rgba(255,255,255,0.16)');
	gloss.addColorStop(0.64, 'rgba(255,255,255,0.04)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
	ctx.restore();

	line(ctx, x + 4.4, y + 8, x + 4.4, y + h - 8, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, x + w - 4, y + 5, x + w - 4, y + h - 5, 'rgba(255,255,255,0.36)', 1.1);
	line(ctx, x + 6, y + 47.2, x + w - 7, y + 47.2, 'rgba(255,255,255,0.62)', 1.2);

	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	for (const hy of [y + 20, y + 62]) {
		ctx.beginPath();
		ctx.arc(x + w - 6.4, hy + 3, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}
	line(ctx, x + 5, y + 38, x + 5, y + 50, 'rgba(255,255,255,0.6)', 1.1);
}

/** Mirror sheen: a raked reflection streak in the glass and a lit head edge. */
function mirrorSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(21, 158, MIRROR.w - 6, MIRROR.h - 19);
	ctx.clip();
	ctx.strokeStyle = 'rgba(255,255,255,0.62)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(22, 174);
	ctx.lineTo(29, 163);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 1.1;
	ctx.beginPath();
	ctx.moveTo(26, 176);
	ctx.lineTo(31, 169);
	ctx.stroke();
	ctx.restore();
	line(ctx, 19.6, 152, 19.6, 180, 'rgba(255,255,255,0.36)', 1.1);
	glint(ctx, 31, 168, 1.7);
}

/** Livery sheen: red band gloss, chevron wet edge and the cross roundel dome. */
function liverySheen(ctx: CanvasRenderingContext2D): void {
	// Red waist band: a long diagonal highlight and a damp lower edge.
	ctx.save();
	ctx.beginPath();
	ctx.rect(36, 170, 632, 20);
	ctx.clip();
	const band = ctx.createLinearGradient(36, 190, 668, 170);
	band.addColorStop(0, 'rgba(255,255,255,0)');
	band.addColorStop(0.24, 'rgba(255,255,255,0.1)');
	band.addColorStop(0.42, 'rgba(255,255,255,0.26)');
	band.addColorStop(0.58, 'rgba(255,255,255,0.05)');
	band.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = band;
	ctx.fillRect(36, 170, 632, 20);
	const damp = ctx.createLinearGradient(0, 182, 0, 190);
	damp.addColorStop(0, 'rgba(193,18,31,0)');
	damp.addColorStop(1, 'rgba(193,18,31,0.5)');
	ctx.fillStyle = damp;
	ctx.fillRect(36, 182, 632, 8);
	ctx.restore();
	line(ctx, 40, 171.2, 664, 171.2, 'rgba(255,255,255,0.66)', 1.2);

	// Chevron panel: the gloss crosses the white and red bars together.
	ctx.save();
	ctx.beginPath();
	ctx.rect(CHEVRON.x, CHEVRON.y, CHEVRON.w, CHEVRON.h);
	ctx.clip();
	const panel = ctx.createLinearGradient(CHEVRON.x, CHEVRON.y + CHEVRON.h, CHEVRON.x + CHEVRON.w, CHEVRON.y);
	panel.addColorStop(0, 'rgba(255,255,255,0)');
	panel.addColorStop(0.42, 'rgba(255,255,255,0.32)');
	panel.addColorStop(0.6, 'rgba(255,255,255,0.08)');
	panel.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = panel;
	ctx.fillRect(CHEVRON.x, CHEVRON.y, CHEVRON.w, CHEVRON.h);
	const soil = ctx.createLinearGradient(0, CHEVRON.y + CHEVRON.h - 8, 0, CHEVRON.y + CHEVRON.h);
	soil.addColorStop(0, 'rgba(58,39,27,0)');
	soil.addColorStop(1, 'rgba(58,39,27,0.24)');
	ctx.fillStyle = soil;
	ctx.fillRect(CHEVRON.x, CHEVRON.y + CHEVRON.h - 8, CHEVRON.w, 8);
	ctx.restore();
	line(
		ctx,
		CHEVRON.x + 2,
		CHEVRON.y + 1.4,
		CHEVRON.x + CHEVRON.w - 2,
		CHEVRON.y + 1.4,
		'rgba(255,255,255,0.66)',
		1.1
	);

	// Cross roundel: a dome of light across the upper-left and a settled rim shadow.
	ctx.save();
	ctx.beginPath();
	ctx.arc(CROSS.x, CROSS.y, CROSS.r, 0, Math.PI * 2);
	ctx.clip();
	const dome = ctx.createLinearGradient(CROSS.x - 18, CROSS.y - 26, CROSS.x + 12, CROSS.y + 20);
	dome.addColorStop(0, 'rgba(255,255,255,0.24)');
	dome.addColorStop(0.46, 'rgba(255,255,255,0.04)');
	dome.addColorStop(1, 'rgba(58,39,27,0.14)');
	ctx.fillStyle = dome;
	ctx.fillRect(CROSS.x - CROSS.r, CROSS.y - CROSS.r, CROSS.r * 2, CROSS.r * 2);
	ctx.restore();
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.7;
	ctx.beginPath();
	ctx.arc(CROSS.x, CROSS.y, CROSS.r - 4.6, Math.PI * 1.08, Math.PI * 1.62);
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
	// Sidewall catches the roof light on both shoulders, clear of the tread notches.
	ctx.strokeStyle = 'rgba(255,255,255,0.22)';
	ctx.lineWidth = 2.4;
	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.94]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.86, from, to);
		ctx.stroke();
	}
	ctx.strokeStyle = 'rgba(255,255,255,0.12)';
	ctx.lineWidth = 1.8;
	for (const [from, to] of [
		[Math.PI * 1.02, Math.PI * 1.2],
		[Math.PI * 1.8, Math.PI * 1.98]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.95, from, to);
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

	// Polished hub arcs and the chrome valve at the crown.
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
	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.36, 0, Math.PI * 2);
	ctx.stroke();
	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - 0.7, y - r * 0.58, 0.9, 0, Math.PI * 2);
	ctx.fill();
	line(ctx, x, y - r * 0.53, x, y - r * 0.64, CHROME, 2);
}

/** Paint grain over solid paint only: the glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	// A cool-to-warm wash across the coat, so the grain sits in a lit field.
	const wash = ctx.createLinearGradient(36, 56, 668, 258);
	wash.addColorStop(0, 'rgba(255,255,255,0.12)');
	wash.addColorStop(0.48, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.09)');
	ctx.fillStyle = wash;
	ctx.fillRect(36, 56, 632, 202);

	let seed = 53;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 480; i++) {
		const px = 40 + rand() * 620;
		const py = 60 + rand() * 192;
		const size = 1.4 + rand() * 1.1;
		ctx.globalAlpha = 0.08 + rand() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 185; i++) {
		const px = 40 + rand() * 620;
		const py = 60 + rand() * 192;
		const size = 1.2 + rand() * 0.9;
		ctx.globalAlpha = 0.22 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush strokes across the cab flank, box panels and skirt.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[50, 190, 140, 188],
		[246, 78, 420, 76],
		[440, 140, 620, 138],
		[246, 222, 520, 220],
		[246, 246, 620, 244],
		[300, 110, 340, 108],
		[556, 176, 624, 176]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest, so the grain has a hand-made edge.
	ctx.globalAlpha = 0.16;
	ctx.strokeStyle = WHITE;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[58, 212, 104, 210],
		[212, 244, 266, 243],
		[350, 84, 394, 83],
		[466, 128, 506, 127],
		[562, 234, 612, 233],
		[612, 108, 650, 107],
		[250, 196, 292, 195]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Panel sheen: roof light rolling down the white box, a flank streak and arch bounce. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	const roofSheen = ctx.createLinearGradient(0, 58, 0, 118);
	roofSheen.addColorStop(0, 'rgba(255,255,255,0.42)');
	roofSheen.addColorStop(0.5, 'rgba(255,255,255,0.1)');
	roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roofSheen;
	ctx.fillRect(246, 58, 420, 60);

	const cabSheen = ctx.createLinearGradient(0, 90, 0, 170);
	cabSheen.addColorStop(0, 'rgba(255,255,255,0.4)');
	cabSheen.addColorStop(0.6, 'rgba(255,255,255,0.08)');
	cabSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cabSheen;
	ctx.fillRect(46, 90, 190, 80);

	const flank = ctx.createLinearGradient(350, 96, 520, 230);
	flank.addColorStop(0, 'rgba(255,255,255,0)');
	flank.addColorStop(0.42, 'rgba(255,255,255,0.24)');
	flank.addColorStop(0.68, 'rgba(255,255,255,0.06)');
	flank.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = flank;
	ctx.fillRect(330, 90, 200, 150);

	// A wet vertical streak down the rear box panel.
	const streak = ctx.createLinearGradient(556, 88, 646, 232);
	streak.addColorStop(0, 'rgba(255,255,255,0)');
	streak.addColorStop(0.34, 'rgba(255,255,255,0.16)');
	streak.addColorStop(0.48, 'rgba(255,255,255,0.04)');
	streak.addColorStop(0.72, 'rgba(255,255,255,0.12)');
	streak.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = streak;
	ctx.fillRect(548, 88, 108, 150);

	// Road bounce on the rocker and the front fender.
	const bounce = ctx.createLinearGradient(0, 236, 0, 258);
	bounce.addColorStop(0, 'rgba(255,255,255,0)');
	bounce.addColorStop(1, 'rgba(255,255,255,0.14)');
	ctx.fillStyle = bounce;
	ctx.fillRect(38, 236, 626, 22);

	const fender = ctx.createLinearGradient(44, 196, 126, 208);
	fender.addColorStop(0, 'rgba(255,255,255,0.18)');
	fender.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = fender;
	ctx.fillRect(42, 194, 96, 20);

	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 3;
	for (const [sx, sy, ex, ey] of [
		[256, 68, 640, 66],
		[250, 162, 628, 160],
		[48, 214, 168, 212],
		[558, 192, 638, 190],
		[62, 150, 176, 148]
	]) {
		ctx.globalAlpha = 0.28;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Finishing marks: rivets, lamp pips, stone chips, arch hardware and the exhaust puff. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// Roof-rail rivets.
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.7;
	for (let rivetX = 256; rivetX <= 646; rivetX += 26) {
		ctx.beginPath();
		ctx.arc(rivetX, 60, 1.4, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Lamp speculars.
	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[52.6, 220.8, 1.7],
		[176, 85.6, 1.1],
		[232, 85.6, 1.1]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	// Chrome lips and door hardware.
	line(ctx, 20, 246, 34, 246, 'rgba(255,255,255,0.7)', 1.4);
	line(ctx, 670, 241, 684, 241, 'rgba(255,255,255,0.55)', 1.3);
	line(ctx, 424, 232.4, 504, 232.4, 'rgba(255,255,255,0.6)', 1.2);
	line(ctx, 20, 160, 20, 176, 'rgba(255,255,255,0.4)', 1.2);

	// Stone chips where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.42;
	ctx.fillStyle = WHITE;
	for (const [chipX, chipY, chipR] of [
		[62, 250, 1.2],
		[232, 252, 1.1],
		[352, 250, 1.3],
		[498, 251, 1.2],
		[612, 248, 1.1]
	]) {
		ctx.beginPath();
		ctx.arc(chipX, chipY, chipR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Arch hardware and the lit arch crowns.
	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		circle(ctx, wheelX, WHEEL_L.y - WHEEL_L.r - 10.4, 1.6, CHROME, 1);
		circle(ctx, wheelX - WHEEL_L.r - 9.6, WHEEL_L.y - 8, 1.3, CHROME, 0.9);
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 9.4, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
	}

	// A soft exhaust puff under the rear skirt.
	ctx.save();
	ctx.globalAlpha = 0.18;
	ctx.fillStyle = '#9AA3B2';
	ctx.beginPath();
	ctx.arc(608, 262, 6, 0, Math.PI * 2);
	ctx.arc(617, 256, 4, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

export function drawRealAmbulanceLevel(
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
		ctx.ellipse(352, 280, 348, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// White patient box and cab in one silhouette.
	shape(ctx, SHELL, WHITE);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Body paint: bright roof, cool mid and a red-tinted lower shade.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 56, 0, 258);
		paint.addColorStop(0, 'rgba(255,255,255,0.52)');
		paint.addColorStop(0.16, 'rgba(255,255,255,0.08)');
		paint.addColorStop(0.64, 'rgba(47,92,119,0.02)');
		paint.addColorStop(1, 'rgba(193,18,31,0.14)');
		ctx.fillStyle = paint;
		ctx.fillRect(30, 56, 644, 204);

		const rocker = ctx.createLinearGradient(0, 236, 0, 258);
		rocker.addColorStop(0, 'rgba(58,39,27,0)');
		rocker.addColorStop(1, 'rgba(58,39,27,0.16)');
		ctx.fillStyle = rocker;
		ctx.fillRect(36, 236, 632, 22);
	}

	// Box roof rail and the cab roof cap.
	rect(ctx, 246, 57, 420, 5, RED, 0, 0);
	line(ctx, 248, 58.4, 664, 58.4, 'rgba(255,255,255,0.35)', 1.2);
	rect(ctx, 174, 88, 62, 4, RED, 0, 0);

	// Patient-box panel joints, skipping the cross, window, door and rear bay.
	for (const seamX of [254, 348, 386, 530]) {
		line(ctx, seamX, 64, seamX, 248, 'rgba(58,39,27,0.14)', 1.6);
		line(ctx, seamX + 1.6, 64, seamX + 1.6, 248, 'rgba(255,255,255,0.5)', 1.2);
	}

	// Cab to box joint.
	line(ctx, 236, 60, 236, 252, 'rgba(58,39,27,0.4)', 2.2);
	line(ctx, 237.6, 64, 237.6, 248, 'rgba(255,255,255,0.45)', 1.2);

	// Red livery band along the whole flank.
	rect(ctx, 36, 170, 632, 20, RED, 0, 0);
	line(ctx, 38, 171.6, 666, 171.6, 'rgba(255,255,255,0.34)', 1.4);
	line(ctx, 38, 188.2, 666, 188.2, 'rgba(193,18,31,0.55)', 1.4);

	// The cue that names the vehicle: red cross roundel.
	circle(ctx, CROSS.x, CROSS.y, CROSS.r, RED, 2.6);
	ctx.strokeStyle = 'rgba(255,255,255,0.42)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(CROSS.x, CROSS.y, CROSS.r - 5, 0, Math.PI * 2);
	ctx.stroke();
	cross(ctx, CROSS.x, CROSS.y, 17, 12, WHITE);

	// Rear corner chevrons.
	chevrons(ctx, CHEVRON.x, CHEVRON.y, CHEVRON.w, CHEVRON.h);

	rearBay(ctx, shaded, fitted);
	slidingDoor(ctx, shaded, fitted);

	// Livery lettering on the rear flank band.
	ctx.fillStyle = WHITE;
	ctx.font = '700 10px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('AMBULANCE', 520, 186);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Underbody strip between the axles.
	rect(ctx, UNDERBODY.x, UNDERBODY.y, UNDERBODY.w, UNDERBODY.h, UNDER, 0, 2.2);
	rect(ctx, UNDERBODY.x + 2, UNDERBODY.y + 2, UNDERBODY.w - 4, 2, '#8C96A4', 0, 0);

	// Front and rear bumpers.
	rect(ctx, FRONT_BUMPER.x, FRONT_BUMPER.y, FRONT_BUMPER.w, FRONT_BUMPER.h, CHROME, 3, 2.6);
	line(ctx, 20, 234, 34, 234, 'rgba(255,255,255,0.7)', 1.4);
	line(ctx, 20, 254, 34, 254, 'rgba(58,39,27,0.28)', 1.3);

	rect(ctx, REAR_BUMPER.x, REAR_BUMPER.y, REAR_BUMPER.w, REAR_BUMPER.h, CHROME, 2.5, 2.6);
	line(ctx, 670, 239, 684, 239, 'rgba(255,255,255,0.55)', 1.3);

	// Mirror head on the front corner with its bracket into the cab.
	rect(ctx, 36, 168, 11, 7, STEEL, 2, 1.8);
	rect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, WHITE, 3, 2.4);
	rect(ctx, MIRROR.x + 1.5, MIRROR.y + 2, MIRROR.w - 3, 7, RED, 1, 1);
	if (shaded) {
		rect(ctx, 21, 158, MIRROR.w - 6, MIRROR.h - 19, GLASS, 1.4);
		line(ctx, 23, 161, 32, 161, 'rgba(255,255,255,0.45)', 1.2);
	}

	// Roof light bar.
	roofBar(ctx, shaded, fitted, lit, finish);

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, CAB_GLASS, GLASS, 2.5);
	shape(ctx, BOX_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 102, 98, 86, 78);
		glassShade(ctx, CAB_GLASS, 192, 102, 40, 50);
		glassShade(ctx, BOX_GLASS, 536, 116, 58, 46);
	}

	// Side door step, under the sliding door.
	if (fitted) {
		rect(ctx, 415, 229, 98, 5, '#8A93A3', 1.5, 1.5);
		rect(ctx, 418, 234, 92, 7, CHROME, 2, 2.2);
		line(ctx, 422, 237.4, 506, 237.4, 'rgba(255,255,255,0.6)', 1.4);
		rect(ctx, 424, 241, 80, 6, '#9AA3B2', 1.5, 1.8);
		line(ctx, 428, 244, 500, 244, 'rgba(58,39,27,0.3)', 1.2);
	}

	if (fitted) {
		// Headlamp, indicator and grille slots on the front corner.
		circle(ctx, 54, 224, 8.5, LAMP, 2.4);
		circle(ctx, 54, 224, 4.2, '#FFF7CF', 1.5);
		rect(ctx, 42, 204, 10, 8, AMBER, 2, 1.6);
		for (let bar = 0; bar < 3; bar++) {
			line(ctx, 40, 196 + bar * 5, 50, 196 + bar * 5, STEEL, 2);
		}

		// Wipers, clipped to the screen.
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		line(ctx, 120, 164, 144, 146, INK, 2.2);
		line(ctx, 136, 166, 158, 148, INK, 2);
		ctx.restore();

		// Cab door handle and keyhole.
		rect(ctx, 204, 158, 20, 6, CHROME, 2.5, 2);
		line(ctx, 208, 161, 220, 161, 'rgba(58,39,27,0.3)', 1.1);
		circle(ctx, 232, 176, 1.5, INK, 1);

		// Cab roof marker lamps.
		circle(ctx, 178, 85, 2.2, AMBER, 1.1);
		circle(ctx, 230, 85, 2.2, AMBER, 1.1);

		// Side marker on the box waist and the rear lamps on the chassis.
		rect(ctx, 354, 174, 13, 6, AMBER, 1.5, 1.2);
		rect(ctx, 610, 174, 13, 6, AMBER, 1.5, 1.2);
		rect(ctx, 646, 240, 12, 12, TAIL, 2, 1.8);
		rect(ctx, 660, 240, 6, 12, AMBER, 1.5, 1.5);
	}

	// Wheel arches and wheels.
	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: cab roof, box roof line and the rear corner.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(176, 89.4);
		ctx.lineTo(232, 89.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(248, 57.4);
		ctx.lineTo(652, 57.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(666.4, 70);
		ctx.lineTo(666.4, 238);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(37.4, 184);
		ctx.lineTo(37.4, 250);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(54, 224, 1, 54, 224, 24);
		glow.addColorStop(0, 'rgba(255,240,150,0.72)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(54, 224, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 271, 33, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		panelSheen(ctx);
		liverySheen(ctx);
		doorSheen(ctx);
		rearBaySheen(ctx);
		mirrorSheen(ctx);

		// Glints clear of the glass, tyres, cross and lettering.
		glint(ctx, 402, 132, 5);
		glint(ctx, 470, 152, 4);
		glint(ctx, 566, 148, 4.6);
		glint(ctx, 232, 118, 4);
		glint(ctx, 596, 206, 4.2);
		glint(ctx, 118, 210, 3.6);
		glint(ctx, 262, 96, 3.4);
		glint(ctx, 640, 120, 2.8);
		glint(ctx, 486, 96, 3);
		glint(ctx, 626, 178, 3);
		glint(ctx, 646, 218, 2.5);
		glint(ctx, 322, 206, 3.2);
		glint(ctx, 380, 246, 2.5);
		glint(ctx, 44, 224, 2.3);
		glint(ctx, 606, 76, 2.4);

		// Glass sheen and a sparkle in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(116, 168);
		ctx.lineTo(158, 106);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(200, 146);
		ctx.lineTo(222, 112);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(544, 156);
		ctx.lineTo(570, 122);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 214, 120, 3);
		glint(ctx, 558, 132, 3.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealAmbulance(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealAmbulanceLevel(ctx, x, y, scale, 5);
}
