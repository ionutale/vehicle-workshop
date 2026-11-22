/**
 * Delivery van art, cut into the same five-piece kit as the other realistic vehicles.
 * A long green panel van facing left: a compact nose under a raked screen, a cream roof cap
 * and cream lower panels, a wide sliding side door in its own track, a rear door bay with
 * latch rods, a roof extractor vent, mudguards and lamps. The cue that names the vehicle is
 * the cream parcel roundel and the DELIVERY wordmark on the flank. Level 5 is the production
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
	shape,
	wheel
} from './realKit';

const GREEN = '#6A994E';
const GREEN_DARK = '#547C3C';
const GREEN_DEEP = '#3E5D2C';
const CREAM = '#F2E8CF';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const TAIL = '#FF4D6D';

/** Art box 720 x 330, road at 272. Front (cab) faces left. */
const SHELL =
	'M36,258 L36,196 Q36,186 46,182 L84,178 L140,98 Q144,88 156,88 L676,88 Q688,88 688,102 L688,244 Q688,258 672,258 Z';

/** Roof extractor vent. Part of the body cut-out, drawn to the same outline. */
const VENT = 'M302,88 L306,74 Q308,72 312,72 L360,72 Q364,72 366,74 L370,88 Z';

/** Front and rear bumpers plus the underbody sill: all body-mask fittings. */
const BUMPER_FRONT = { x: 24, y: 236, w: 12, h: 22 };
const BUMPER_REAR = { x: 688, y: 244, w: 12, h: 12 };
const UNDERBODY = { x: 206, y: 258, w: 308, h: 6 };

/** Sliding side door: a clean rectangle, clear of every pane. */
const DOOR = { x: 232, y: 106, w: 146, h: 128 };

/** Rear door bay at the right-hand end of the flank. */
const REAR_DOOR = { x: 606, y: 102, w: 70, h: 126 };

/** Parcel roundel: the one cue that names the load. */
const ROUNDEL = { x: 446, y: 140, r: 30 };

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Windscreen band raked back from the bonnet edge, plus the cab side pane. */
const WINDSCREEN = 'M94,171 L136.6,110 L151.3,120.2 L109,182 Z';
const SIDE_GLASS = pane(172, 104, 52, 54, 6);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

const WHEEL_L = { x: 150, y: 236, r: 34 };
const WHEEL_R = { x: 560, y: 236, r: 34 };

// The spec body mask is the shell plus the roof vent, the mirror head with its arm that lands
// exactly on the screen edge, both bumpers and the underbody sill. Subpaths only touch, never
// overlap, so the evenodd clip cannot punch a hole.

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
	ctx.fillStyle = GREEN;
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

/** Door-mounted mirror: head on a short bracket, glass filled once shaded. */
function doorMirror(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	line(ctx, 100, 128, 116, 132, INK, 5.5);
	line(ctx, 100, 128, 116, 132, STEEL, 3.6);
	rect(ctx, 78, 110, 22, 36, GREEN_DEEP, 3.5, 2.4);

	if (shaded) {
		rect(ctx, 81, 114, 16, 28, GLASS, 1.4);
		line(ctx, 82.4, 117, 95.6, 117, 'rgba(255,255,255,0.45)', 1.2);
	}
}

/** Roof extractor vent: louvred casing on a gasket line across the roof. */
function roofVent(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, VENT, CREAM, 2.6);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(VENT));
		const face = ctx.createLinearGradient(0, 72, 0, 88);
		face.addColorStop(0, 'rgba(255,255,255,0.55)');
		face.addColorStop(0.55, 'rgba(255,255,255,0.08)');
		face.addColorStop(1, 'rgba(58,39,27,0.2)');
		ctx.fillStyle = face;
		ctx.fillRect(300, 72, 72, 16);
		ctx.restore();
	}

	line(ctx, 304, 87.2, 368, 87.2, 'rgba(58,39,27,0.34)', 1.6);

	if (fitted) {
		line(ctx, 309, 78, 363, 78, 'rgba(58,39,27,0.42)', 1.5);
		line(ctx, 309, 81.4, 363, 81.4, 'rgba(58,39,27,0.36)', 1.4);
		line(ctx, 309, 84.6, 363, 84.6, 'rgba(58,39,27,0.3)', 1.3);
		circle(ctx, 366, 82, 1.4, CHROME, 1);
	}

	if (finish) {
		line(ctx, 309, 73.6, 361, 73.6, 'rgba(255,255,255,0.66)', 1.5);
		line(ctx, 309, 79.4, 363, 79.4, 'rgba(255,255,255,0.28)', 1);
	}
}

/** Cream parcel roundel with a tape-crossed box and its string loop. */
function parcelRoundel(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	const { x, y, r } = ROUNDEL;

	circle(ctx, x, y, r, CREAM, 2.4);
	ctx.strokeStyle = 'rgba(84,124,60,0.42)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r - 5, 0, Math.PI * 2);
	ctx.stroke();

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(circleMask(x, y, r)));
		const gloss = ctx.createLinearGradient(x - r, y - r, x + r * 0.4, y + r);
		gloss.addColorStop(0, 'rgba(255,255,255,0.5)');
		gloss.addColorStop(0.6, 'rgba(255,255,255,0.04)');
		gloss.addColorStop(1, 'rgba(58,39,27,0.12)');
		ctx.fillStyle = gloss;
		ctx.fillRect(x - r, y - r, r * 2, r * 2);
		ctx.restore();
	}

	// Parcel box, tape cross and the string loop tied above it.
	rect(ctx, x - 14, y - 6, 28, 19, GREEN, 1.5, 1.8);
	line(ctx, x, y - 6, x, y + 13, CREAM, 2.2);
	line(ctx, x - 14, y + 3.5, x + 14, y + 3.5, CREAM, 2.2);
	ctx.strokeStyle = GREEN_DEEP;
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(x - 13, y - 5.4);
	ctx.lineTo(x, y - 15);
	ctx.lineTo(x + 13, y - 5.4);
	ctx.stroke();
	circle(ctx, x, y - 15, 2.4, GREEN_DEEP, 1);
}

/** Sliding door: frame, leaf, livery bands, guide track shoe and pull handle. */
function slidingDoor(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	const { x, y, w, h } = DOOR;

	rect(ctx, x, y, w, h, GREEN_DARK, 3.5, 2.6);
	rect(ctx, x + 4, y + 4, w - 8, h - 8, GREEN, 2.5, 2);

	// Livery bands line up with the body: cream lower panel under a chrome waist bead.
	rect(ctx, x + 4, 190, w - 8, 40, CREAM, 0, 2);
	rect(ctx, x + 4, 186, w - 8, 4, CHROME, 0, 0);
	line(ctx, x + 4, 191.4, x + w - 4, 191.4, 'rgba(58,39,27,0.14)', 1.2);
	line(ctx, x + 4, 229.4, x + w - 4, 229.4, 'rgba(58,39,27,0.26)', 1.6);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 4, y + 4, w - 8, h - 8);
		ctx.clip();
		const face = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
		face.addColorStop(0, 'rgba(255,255,255,0.16)');
		face.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		face.addColorStop(1, 'rgba(58,39,27,0.14)');
		ctx.fillStyle = face;
		ctx.fillRect(x + 4, y + 4, w - 8, h - 8);

		const bounce = ctx.createLinearGradient(0, 190, 0, 230);
		bounce.addColorStop(0, 'rgba(255,255,255,0)');
		bounce.addColorStop(1, 'rgba(84,124,60,0.14)');
		ctx.fillStyle = bounce;
		ctx.fillRect(x + 4, 190, w - 8, 40);
		ctx.restore();

		line(ctx, x + 4, y + 6.5, x + w - 4, y + 6.5, 'rgba(58,39,27,0.2)', 1.6);
	}

	if (fitted) {
		// Handle on the trailing stile, with its finger recess and lock cylinder.
		rect(ctx, x + w - 26, 148, 10, 34, CHROME, 3, 2.2);
		line(ctx, x + w - 21, 152, x + w - 21, 178, 'rgba(58,39,27,0.32)', 1.5);
		rect(ctx, x + w - 40, 158, 12, 5, STEEL, 1, 1.4);
		circle(ctx, x + w - 21, 190, 1.8, INK, 1);

		// Top roller bracket and the guide shoe at the foot of the bay.
		rect(ctx, x + w - 24, y + 2, 16, 6, STEEL, 1.5, 1.6);
		circle(ctx, x + w - 16, y + 5, 1.6, CHROME, 1);
		rect(ctx, x + 10, 228, 14, 5, STEEL, 1, 1.5);
	}
}

/** Rear doors: frame, two leaves, waist band, hinges and twin latch rods. */
function rearDoors(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	const { x, y, w, h } = REAR_DOOR;

	rect(ctx, x, y, w, h, GREEN_DEEP, 3, 2.6);
	rect(ctx, x + 3, y + 3, 30, h - 6, GREEN, 1.5, 1.8);
	rect(ctx, x + 37, y + 3, 30, h - 6, GREEN, 1.5, 1.8);
	line(ctx, x + 35, y + 4, x + 35, y + h - 4, 'rgba(62,93,44,0.6)', 1.8);

	// The cream band crosses both leaves exactly where the body band runs.
	rect(ctx, x + 3, 190, 30, 34, CREAM, 0, 0);
	rect(ctx, x + 37, 190, 30, 34, CREAM, 0, 0);
	line(ctx, x + 3, 190, x + w - 3, 190, 'rgba(58,39,27,0.16)', 1.2);
	line(ctx, x + 3, 223.4, x + w - 3, 223.4, 'rgba(58,39,27,0.28)', 1.6);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 3, y + 3, w - 6, h - 6);
		ctx.clip();
		const leaves = ctx.createLinearGradient(0, y + 3, 0, y + h - 3);
		leaves.addColorStop(0, 'rgba(255,255,255,0.34)');
		leaves.addColorStop(0.42, 'rgba(255,255,255,0.06)');
		leaves.addColorStop(1, 'rgba(58,39,27,0.18)');
		ctx.fillStyle = leaves;
		ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
		ctx.restore();
	}

	if (fitted) {
		// Hinges on the rear stile, then the twin latch rods and their handles.
		for (const hy of [y + 24, y + 90]) {
			rect(ctx, x + w - 7, hy, 6, 14, STEEL, 1.5, 1.4);
		}

		for (const rodX of [x + 16, x + 50]) {
			line(ctx, rodX, y + 7, rodX, y + h - 12, INK, 3.4);
			line(ctx, rodX, y + 7, rodX, y + h - 12, CHROME, 2.2);
			rect(ctx, rodX - 6, 156, 12, 4, STEEL, 1, 1.2);
		}

		line(ctx, x + 8, 194, x + 26, 194, 'rgba(255,255,255,0.3)', 1.2);
		line(ctx, x + 42, 194, x + 60, 194, 'rgba(255,255,255,0.3)', 1.2);
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
 * Picture-book hub: sidewall gloss, bright rim ring, six bolt heads and a polished cap.
 * Every mark is mirror-symmetric about the hub centre, so the flipped rear wheel assembles
 * identically.
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
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	// Dish shadow under the cap, so the rim face sits below the hub.
	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, 0.18 * Math.PI, 0.82 * Math.PI);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		ctx.fillStyle = 'rgba(58,39,27,0.22)';
		ctx.beginPath();
		ctx.arc(bx + 0.7, by + 0.8, 2.9, 0, Math.PI * 2);
		ctx.fill();
		circle(ctx, bx, by, 2.4, CHROME, 1.2);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx - 0.8, by - 0.9, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

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

	// Tread shoulder catches the sky along the top of the tyre.
	ctx.strokeStyle = 'rgba(255,255,255,0.3)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.97, Math.PI * 1.12, Math.PI * 1.44);
	ctx.stroke();

	circle(ctx, x, y - r * 0.55, 2.1, CHROME, 1.1);
	line(ctx, x, y - r * 0.53, x, y - r * 0.66, CHROME, 2);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - 0.7, y - r * 0.58, 0.9, 0, Math.PI * 2);
	ctx.fill();
}

/** Paint grain over solid paint only: the glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(40, 88, 680, 258);
	wash.addColorStop(0, 'rgba(255,249,232,0.07)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.09)');
	ctx.fillStyle = wash;
	ctx.fillRect(36, 88, 652, 170);

	// The cream lower panels take a warmer, flatter coat than the green flank.
	const creamWash = ctx.createLinearGradient(0, 186, 0, 244);
	creamWash.addColorStop(0, 'rgba(255,255,255,0.16)');
	creamWash.addColorStop(0.55, 'rgba(255,255,255,0.05)');
	creamWash.addColorStop(1, 'rgba(58,39,27,0.08)');
	ctx.fillStyle = creamWash;
	ctx.fillRect(36, 186, 652, 58);

	let seed = 53;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 560; i++) {
		const px = 40 + rand() * 644;
		const py = 90 + rand() * 164;
		const size = 1.4 + rand() * 1.1;
		ctx.globalAlpha = 0.09 + rand() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFF9E8';
	for (let i = 0; i < 200; i++) {
		const px = 40 + rand() * 644;
		const py = 90 + rand() * 164;
		const size = 1.2 + rand() * 0.9;
		ctx.globalAlpha = 0.18 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Paint tooth: short vertical dashes where the roller lifted on the upper green.
	ctx.globalAlpha = 0.15;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1;
	for (let i = 0; i < 90; i++) {
		const px = 44 + rand() * 636;
		const py = 102 + rand() * 82;
		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(px + 0.3, py + 2.4 + rand() * 2.2);
		ctx.stroke();
	}

	// Long brush strokes along the flank, the cream panels and the skirt.
	ctx.globalAlpha = 0.11;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[48, 190, 158, 188],
		[128, 118, 222, 116],
		[398, 122, 448, 120],
		[524, 136, 596, 134],
		[400, 210, 500, 209],
		[534, 232, 598, 231],
		[602, 214, 664, 212],
		[48, 244, 196, 242]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}

	// Short vertical drags down the sliding leaf, where the paint was rollered.
	ctx.globalAlpha = 0.08;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.2;
	for (const [sx, sy, ey] of [
		[248, 118, 214],
		[276, 114, 204],
		[318, 120, 212],
		[352, 116, 208]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(sx + 0.4, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest.
	ctx.globalAlpha = 0.16;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[62, 214, 108, 213],
		[210, 250, 268, 249],
		[446, 232, 486, 231],
		[528, 168, 574, 167],
		[560, 244, 604, 243],
		[612, 230, 660, 229],
		[196, 96, 262, 95]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Panel sheen: roof light, front-fender gloss and a wet streak down the rear flank. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	const roofSheen = ctx.createLinearGradient(0, 100, 0, 152);
	roofSheen.addColorStop(0, 'rgba(255,255,255,0.28)');
	roofSheen.addColorStop(0.6, 'rgba(255,255,255,0.06)');
	roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roofSheen;
	ctx.fillRect(168, 100, 516, 52);

	// Cream roof cap: a long specular run broken by two short dashes.
	const capSheen = ctx.createLinearGradient(0, 88, 0, 100);
	capSheen.addColorStop(0, 'rgba(255,255,255,0.42)');
	capSheen.addColorStop(0.55, 'rgba(255,255,255,0.14)');
	capSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = capSheen;
	ctx.fillRect(46, 88, 630, 12);
	line(ctx, 196, 90.2, 384, 90.2, 'rgba(255,255,255,0.66)', 1.5);
	line(ctx, 540, 90.2, 660, 90.2, 'rgba(255,255,255,0.5)', 1.3);

	// Cream lower panels hold a soft horizontal sheen under the waist bead.
	const bandSheen = ctx.createLinearGradient(0, 190, 0, 242);
	bandSheen.addColorStop(0, 'rgba(255,255,255,0.2)');
	bandSheen.addColorStop(0.5, 'rgba(255,255,255,0.04)');
	bandSheen.addColorStop(1, 'rgba(58,39,27,0.07)');
	ctx.fillStyle = bandSheen;
	ctx.fillRect(36, 190, 652, 52);

	const flankSheen = ctx.createLinearGradient(420, 104, 560, 226);
	flankSheen.addColorStop(0, 'rgba(255,249,232,0)');
	flankSheen.addColorStop(0.44, 'rgba(255,249,232,0.2)');
	flankSheen.addColorStop(0.72, 'rgba(255,249,232,0.05)');
	flankSheen.addColorStop(1, 'rgba(255,249,232,0)');
	ctx.fillStyle = flankSheen;
	ctx.fillRect(400, 104, 190, 132);

	// A second wet streak down the rear flank and the rear-door bay.
	const rearSheen = ctx.createLinearGradient(590, 108, 668, 216);
	rearSheen.addColorStop(0, 'rgba(255,249,232,0)');
	rearSheen.addColorStop(0.5, 'rgba(255,249,232,0.16)');
	rearSheen.addColorStop(0.75, 'rgba(255,249,232,0.04)');
	rearSheen.addColorStop(1, 'rgba(255,249,232,0)');
	ctx.fillStyle = rearSheen;
	ctx.fillRect(584, 104, 96, 132);

	const fenderSheen = ctx.createLinearGradient(38, 188, 130, 216);
	fenderSheen.addColorStop(0, 'rgba(255,255,255,0.18)');
	fenderSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = fenderSheen;
	ctx.fillRect(38, 188, 96, 28);

	// Soft reflection columns either side of the panel seams.
	for (const [colX, colW, alpha] of [
		[392, 46, 0.07],
		[542, 40, 0.05]
	]) {
		const column = ctx.createLinearGradient(colX, 0, colX + colW, 0);
		column.addColorStop(0, 'rgba(255,255,255,0)');
		column.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
		column.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = column;
		ctx.fillRect(colX, 102, colW, 140);
	}

	// Chrome waist bead catches short bright dashes along its length.
	for (const [dashX, dashW] of [
		[52, 54],
		[138, 42],
		[392, 60],
		[476, 44],
		[540, 34],
		[596, 52]
	]) {
		line(ctx, dashX, 187.4, dashX + dashW, 187.4, 'rgba(255,255,255,0.7)', 1.4);
	}

	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 3;
	for (const [sx, sy, ex, ey] of [
		[168, 108, 392, 106],
		[400, 150, 596, 148],
		[46, 204, 148, 202],
		[604, 190, 660, 188]
	]) {
		ctx.globalAlpha = 0.24;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Sliding-door sheen: a diagonal gloss across the leaf, lit stiles and track hardware. */
function doorSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = DOOR;

	ctx.save();
	ctx.beginPath();
	ctx.rect(x + 4, y + 4, w - 8, h - 8);
	ctx.clip();
	const gloss = ctx.createLinearGradient(x, y + h, x + w, y);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.42, 'rgba(255,255,255,0.1)');
	gloss.addColorStop(0.58, 'rgba(255,255,255,0.2)');
	gloss.addColorStop(0.76, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
	ctx.restore();

	// A narrower second streak, so the leaf reads as a curved panel rather than a flat slab.
	ctx.save();
	ctx.beginPath();
	ctx.rect(x + 4, y + 4, w - 8, h - 8);
	ctx.clip();
	const streak = ctx.createLinearGradient(x + 26, y + h, x + 94, y);
	streak.addColorStop(0, 'rgba(255,255,255,0)');
	streak.addColorStop(0.46, 'rgba(255,255,255,0.13)');
	streak.addColorStop(0.62, 'rgba(255,255,255,0.05)');
	streak.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = streak;
	ctx.fillRect(x + 26, y + 4, 72, h - 8);
	ctx.restore();

	line(ctx, x + 5.4, y + 9, x + 5.4, 228, 'rgba(255,255,255,0.34)', 1.4);
	line(ctx, x + w - 5.4, y + 9, x + w - 5.4, 228, 'rgba(255,255,255,0.2)', 1.6);
	line(ctx, x + 8, 187.8, x + w - 8, 187.8, 'rgba(255,255,255,0.55)', 1.4);
	line(ctx, x + 8, 191.8, x + w - 8, 191.8, 'rgba(255,249,232,0.4)', 1.2);
	line(ctx, x + 8, 229, x + w - 8, 229, 'rgba(58,39,27,0.16)', 1.2);

	// Top track, sill runner and their hardware catch a short bright edge.
	line(ctx, 230, 104.4, 382, 104.4, 'rgba(255,255,255,0.34)', 1.2);
	line(ctx, 230, 235.4, 382, 235.4, 'rgba(255,255,255,0.4)', 1.2);
	circle(ctx, 374, 103, 1.4, CHROME, 0.9);
	circle(ctx, 238, 236.6, 1.2, CHROME, 0.9);

	// Handle chrome, its finger recess and lock cylinder get polished pips.
	line(ctx, x + w - 23.4, 152, x + w - 23.4, 177, 'rgba(255,255,255,0.6)', 1.2);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	for (const [pipX, pipY] of [
		[x + w - 23.6, 151],
		[x + w - 30.2, 160.4],
		[x + w - 21, 188.6],
		[x + w - 16, y + 4.4]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	glint(ctx, x + w - 21, 152, 2.2);
	glint(ctx, x + 54, 122, 2.4);
}

/** Rear door sheen: leaf gloss, lit stiles, hinge pips and latch-rod edge lights. */
function rearDoorSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, w, h } = REAR_DOOR;

	ctx.save();
	ctx.beginPath();
	ctx.rect(x + 3, y + 3, w - 6, h - 6);
	ctx.clip();

	const leaves = ctx.createLinearGradient(0, y + 3, 0, y + h - 3);
	leaves.addColorStop(0, 'rgba(255,255,255,0.26)');
	leaves.addColorStop(0.4, 'rgba(255,255,255,0.05)');
	leaves.addColorStop(1, 'rgba(58,39,27,0.16)');
	ctx.fillStyle = leaves;
	ctx.fillRect(x + 3, y + 3, w - 6, h - 6);

	const bounce = ctx.createLinearGradient(0, 190, 0, 224);
	bounce.addColorStop(0, 'rgba(255,255,255,0.24)');
	bounce.addColorStop(1, 'rgba(84,124,60,0.12)');
	ctx.fillStyle = bounce;
	ctx.fillRect(x + 3, 190, w - 6, 34);

	const rake = ctx.createLinearGradient(x + 6, y + h, x + 60, y);
	rake.addColorStop(0, 'rgba(255,255,255,0)');
	rake.addColorStop(0.5, 'rgba(255,255,255,0.09)');
	rake.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = rake;
	ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
	ctx.restore();

	line(ctx, x + 5.2, y + 8, x + 5.2, y + h - 14, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, x + 39.2, y + 8, x + 39.2, y + h - 14, 'rgba(255,255,255,0.3)', 1.2);
	line(ctx, x + 33, y + 8, x + 33, y + h - 14, 'rgba(58,39,27,0.16)', 1.2);

	line(ctx, x + 3, 190.8, x + w - 3, 190.8, 'rgba(255,255,255,0.32)', 1.2);
	line(ctx, x + 3, 223, x + w - 3, 223, 'rgba(58,39,27,0.14)', 1.2);

	for (const hy of [y + 24, y + 90]) {
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(x + w - 4.6, hy + 2.6, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	for (const rodX of [x + 16, x + 50]) {
		line(ctx, rodX - 1.3, y + 8, rodX - 1.3, y + h - 13, 'rgba(255,255,255,0.5)', 1.2);
		line(ctx, rodX + 1.3, y + 8, rodX + 1.3, y + h - 13, 'rgba(58,39,27,0.24)', 1.2);
		line(ctx, rodX - 5, 156.6, rodX + 5, 156.6, 'rgba(255,255,255,0.45)', 1);
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		ctx.beginPath();
		ctx.arc(rodX - 3.8, 158.2, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** Mirror sheen: a raked reflection in the glass and a lit head edge. */
function mirrorSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(81, 114, 16, 28);
	ctx.clip();
	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(82, 136);
	ctx.lineTo(93, 118);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(89, 139);
	ctx.lineTo(96, 129);
	ctx.stroke();
	ctx.restore();

	line(ctx, 79.2, 114, 79.2, 142, 'rgba(255,255,255,0.34)', 1.2);
	line(ctx, 79, 112.4, 99, 112.4, 'rgba(255,255,255,0.28)', 1.1);
}

/** Roundel gloss: a raked reflection, rim depth and finished parcel-box hardware. */
function roundelSheen(ctx: CanvasRenderingContext2D): void {
	const { x, y, r } = ROUNDEL;

	ctx.save();
	ctx.clip(new Path2D(circleMask(x, y, r)));
	const gloss = ctx.createLinearGradient(x - r, y + r, x + r, y - r);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.5, 'rgba(255,255,255,0.22)');
	gloss.addColorStop(0.66, 'rgba(255,255,255,0.04)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(x - r, y - r, r * 2, r * 2);

	// Warm bounce around the parcel, so the cream face does not read as flat paper.
	const warm = ctx.createRadialGradient(x, y + 2, 4, x, y + 2, r - 4);
	warm.addColorStop(0, 'rgba(255,255,255,0.18)');
	warm.addColorStop(0.7, 'rgba(255,255,255,0.04)');
	warm.addColorStop(1, 'rgba(58,39,27,0.08)');
	ctx.fillStyle = warm;
	ctx.fillRect(x - r, y - r, r * 2, r * 2);
	ctx.restore();

	// Outer rim: a shaded under-edge and a lit upper edge give the disc thickness.
	ctx.strokeStyle = 'rgba(58,39,27,0.2)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(x, y, r - 1.2, Math.PI * 0.12, Math.PI * 0.88);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r - 2, Math.PI * 1.06, Math.PI * 1.62);
	ctx.stroke();

	// Inner printed ring keeps a highlight at the top-left and a shade at the foot.
	ctx.strokeStyle = 'rgba(255,255,255,0.4)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(x, y, r - 5, Math.PI * 1.06, Math.PI * 1.48);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(84,124,60,0.26)';
	ctx.beginPath();
	ctx.arc(x, y, r - 5, Math.PI * 0.18, Math.PI * 0.72);
	ctx.stroke();

	// Parcel box: lit top and left edges, shaded sill, tape and string gloss.
	line(ctx, x - 13, y - 5.4, x + 13, y - 5.4, 'rgba(255,255,255,0.8)', 1.1);
	line(ctx, x - 13.4, y - 4.8, x - 13.4, y + 11.8, 'rgba(255,255,255,0.36)', 1);
	line(ctx, x - 13, y + 12.4, x + 13, y + 12.4, 'rgba(58,39,27,0.34)', 1.1);
	line(ctx, x - 0.7, y - 5, x - 0.7, y + 12.4, 'rgba(255,255,255,0.5)', 1);
	line(ctx, x - 14, y + 2.9, x + 14, y + 2.9, 'rgba(255,255,255,0.5)', 1);
	line(ctx, x - 12.4, y - 5.1, x - 1.2, y - 14.2, 'rgba(255,255,255,0.6)', 1);
	line(ctx, x + 1.2, y - 14.2, x + 12.4, y - 5.1, 'rgba(255,255,255,0.34)', 1);
	ctx.fillStyle = 'rgba(255,255,255,0.8)';
	ctx.beginPath();
	ctx.arc(x - 0.8, y - 15.6, 0.9, 0, Math.PI * 2);
	ctx.fill();

	glint(ctx, x + 17, y - 16, 2.4);
	glint(ctx, x - 18, y + 18, 1.8);
}

/** Finishing marks: rivets, lamp pips, arch crowns, stone chips, dust and the exhaust puff. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.7;
	for (let rivetX = 180; rivetX <= 660; rivetX += 26) {
		ctx.beginPath();
		ctx.arc(rivetX, 94, 1.3, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = 'rgba(255,255,255,0.9)';
		ctx.beginPath();
		ctx.arc(rivetX - 0.4, 93.6, 0.45, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = CHROME;
	}
	ctx.restore();

	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[162.8, 92.8, 1.1],
		[662.8, 92.8, 1.1],
		[57.4, 222.6, 1.7]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	// Lamp lips, bumper chrome and the side marker.
	line(ctx, 50, 205.6, 62, 205.6, 'rgba(255,255,255,0.6)', 1.1);
	line(ctx, 665, 241, 683, 241, 'rgba(255,255,255,0.65)', 1.2);
	line(ctx, 665, 251, 683, 251, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 27, 238, 34, 238, 'rgba(255,255,255,0.7)', 1.3);
	line(ctx, 689.5, 246.4, 698.5, 246.4, 'rgba(255,255,255,0.6)', 1.1);
	line(ctx, 392.4, 247, 396, 247, 'rgba(255,255,255,0.55)', 1.1);

	// Bumper and sill screw heads.
	circle(ctx, 30, 254, 1.2, CHROME, 0.9);
	circle(ctx, 693, 252, 1.1, CHROME, 0.8);
	circle(ctx, 510, 260.4, 1.1, CHROME, 0.8);

	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		circle(ctx, wheelX, WHEEL_L.y - WHEEL_L.r - 9.6, 1.6, CHROME, 1);
		circle(ctx, wheelX - WHEEL_L.r - 9.2, WHEEL_L.y - 8, 1.3, CHROME, 0.9);
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 8.6, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.28)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r * 0.97, Math.PI * 1.14, Math.PI * 1.42);
		ctx.stroke();
	}

	// Stone chips where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.42;
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, chipR] of [
		[60, 246, 1.2],
		[212, 250, 1.1],
		[304, 248, 1.3],
		[408, 250, 1.2],
		[604, 244, 1.1],
		[652, 246, 1]
	]) {
		ctx.beginPath();
		ctx.arc(chipX, chipY, chipR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Depot dust low on the flank.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	for (const [dustX, dustY, dustR] of [
		[384, 248, 1.5],
		[520, 250, 1.3],
		[600, 252, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Exhaust puff behind the rear bumper: warm core, cool edge and a rising wisp.
	ctx.save();
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = '#E7E1D4';
	for (const [puffX, puffY, puffR] of [
		[705, 250, 4.6],
		[712, 243.5, 3.4],
		[706.5, 237.5, 2.4],
		[714, 235.5, 1.6]
	]) {
		ctx.beginPath();
		ctx.arc(puffX, puffY, puffR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.globalAlpha = 0.35;
	ctx.fillStyle = '#F7F2E8';
	ctx.beginPath();
	ctx.arc(704, 248.4, 2.2, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = 'rgba(231,225,212,0.6)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(711, 241);
	ctx.quadraticCurveTo(717, 236, 715, 230);
	ctx.stroke();
	ctx.restore();
}

export function drawRealDeliveryVanLevel(
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
		ctx.ellipse(360, 279, 340, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell.
	shape(ctx, SHELL, GREEN);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Body paint: roof light falling into a deep lower shade.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 88, 0, 258);
		paint.addColorStop(0, 'rgba(255,255,255,0.42)');
		paint.addColorStop(0.14, 'rgba(255,255,255,0.1)');
		paint.addColorStop(0.6, 'rgba(58,39,27,0.02)');
		paint.addColorStop(1, 'rgba(58,39,27,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(30, 88, 660, 172);
	}

	// Cream roof cap and the cream lower panels under a chrome waist bead.
	rect(ctx, 30, 88, 654, 12, CREAM, 0, 0);
	line(ctx, 160, 89.8, 676, 89.8, 'rgba(255,255,255,0.62)', 1.5);
	line(ctx, 44, 98.2, 676, 98.2, 'rgba(84,124,60,0.38)', 1.5);

	rect(ctx, 30, 186, 660, 4, CHROME, 0, 0);
	line(ctx, 30, 187.2, 690, 187.2, 'rgba(255,255,255,0.6)', 1.1);
	rect(ctx, 30, 190, 660, 52, CREAM, 0, 0);
	line(ctx, 30, 191.4, 690, 191.4, 'rgba(58,39,27,0.14)', 1.2);
	line(ctx, 30, 240.6, 690, 240.6, 'rgba(58,39,27,0.3)', 1.8);

	if (shaded) {
		const bounce = ctx.createLinearGradient(0, 190, 0, 242);
		bounce.addColorStop(0, 'rgba(255,255,255,0)');
		bounce.addColorStop(1, 'rgba(84,124,60,0.12)');
		ctx.fillStyle = bounce;
		ctx.fillRect(30, 190, 660, 52);

		const rocker = ctx.createLinearGradient(0, 242, 0, 258);
		rocker.addColorStop(0, 'rgba(58,39,27,0)');
		rocker.addColorStop(1, 'rgba(58,39,27,0.24)');
		ctx.fillStyle = rocker;
		ctx.fillRect(34, 242, 652, 16);
	}

	// Panel joints along the flank; the livery sits between them.
	if (shaded) {
		for (const seamX of [390, 540, 590]) {
			line(ctx, seamX, 102, seamX, 240, 'rgba(58,39,27,0.22)', 1.6);
			line(ctx, seamX + 1.6, 106, seamX + 1.6, 236, 'rgba(255,255,255,0.3)', 1.2);
		}
	}

	// Cab door seam on the B-pillar, just ahead of the sliding bay.
	line(ctx, 226, 104, 226, 250, 'rgba(58,39,27,0.34)', 2);
	line(ctx, 227.6, 108, 227.6, 246, 'rgba(255,255,255,0.28)', 1.1);

	// Sliding-door track above the bay and the sill runner below it.
	rect(ctx, 226, 100, 160, 6, GREEN_DEEP, 2, 2);
	line(ctx, 230, 101.8, 382, 101.8, 'rgba(255,255,255,0.28)', 1.2);
	rect(ctx, 226, 234, 160, 5, GREEN_DEEP, 1.5, 1.8);

	// Livery: the parcel roundel over the DELIVERY wordmark.
	parcelRoundel(ctx, shaded);
	ctx.fillStyle = GREEN_DEEP;
	ctx.font = '700 17px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('DELIVERY', ROUNDEL.x, 224);
	ctx.textAlign = 'left';

	rearDoors(ctx, shaded, fitted);
	slidingDoor(ctx, shaded, fitted);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Underbody sill between the axles, with the exhaust outlet at its rear end.
	rect(ctx, UNDERBODY.x, UNDERBODY.y, UNDERBODY.w, UNDERBODY.h, '#5C6472', 0, 2.2);
	rect(ctx, UNDERBODY.x + 2, UNDERBODY.y + 2, UNDERBODY.w - 4, 2, '#8C96A4', 0, 0);
	if (fitted) {
		rect(ctx, 490, 258, 22, 6, STEEL, 1.5, 1.8);
		line(ctx, 493, 259.6, 507, 259.6, 'rgba(0,0,0,0.45)', 1.6);
	}

	// Front and rear bumpers.
	rect(ctx, BUMPER_FRONT.x, BUMPER_FRONT.y, BUMPER_FRONT.w, BUMPER_FRONT.h, CHROME, 3, 2.6);
	line(ctx, 26, 239, 34, 239, 'rgba(255,255,255,0.68)', 1.4);
	if (fitted) {
		rect(ctx, 24.5, 241, 11, 4, '#96A0AE', 0, 0);
		line(ctx, 26, 252.4, 34, 252.4, 'rgba(58,39,27,0.3)', 1.4);
	}

	rect(ctx, BUMPER_REAR.x, BUMPER_REAR.y, BUMPER_REAR.w, BUMPER_REAR.h, CHROME, 2.5, 2.6);
	line(ctx, 690, 246.5, 698, 246.5, 'rgba(255,255,255,0.55)', 1.2);

	// Roof vent, mirror and glass.
	roofVent(ctx, shaded, fitted, finish);
	doorMirror(ctx, shaded);

	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 94, 110, 58, 72);
		glassShade(ctx, SIDE_GLASS, 172, 104, 52, 54);
	}

	if (fitted) {
		// Front face: grille slats, indicator and the headlamp.
		rect(ctx, 38, 200, 9, 24, STEEL, 1.5, 2);
		for (let bar = 1; bar <= 4; bar++) {
			line(ctx, 39, 201.4 + bar * 4.4, 46, 201.4 + bar * 4.4, CHROME, 1.2);
		}
		rect(ctx, 50, 205, 13, 7, AMBER, 2, 1.6);
		circle(ctx, 60, 226, 9, LAMP, 2.4);
		circle(ctx, 60, 226, 4.6, '#FFF7CF', 1.5);

		// Wipers, clipped to the screen.
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		line(ctx, 102, 166, 126, 132, INK, 2.2);
		line(ctx, 114, 170, 136, 140, INK, 2);
		ctx.restore();

		// Roof marker lamps and the side marker on the skirt.
		circle(ctx, 164, 94, 2.2, AMBER, 1.1);
		circle(ctx, 664, 94, 2.2, AMBER, 1.1);
		rect(ctx, 392, 246, 12, 5, AMBER, 1.5, 1.2);

		// Cab door handle and keyhole.
		rect(ctx, 196, 168, 17, 6, CHROME, 2.5, 2);
		line(ctx, 199, 171, 210, 171, 'rgba(58,39,27,0.3)', 1.1);
		circle(ctx, 207, 180, 1.5, INK, 1);

		// Rear lamp cluster on the corner.
		rect(ctx, 664, 240, 20, 11, TAIL, 2, 1.8);
		rect(ctx, 664, 252, 20, 5, AMBER, 1.5, 1.5);
	}

	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: roof, rear corner and the front face.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(158, 89.5);
		ctx.lineTo(674, 89.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(686.5, 104);
		ctx.lineTo(686.5, 240);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(37.5, 200);
		ctx.lineTo(37.5, 250);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(60, 226, 1, 60, 226, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(60, 226, 28, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 271, 30, 4.5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		panelSheen(ctx);
		doorSheen(ctx);
		rearDoorSheen(ctx);
		mirrorSheen(ctx);
		roundelSheen(ctx);

		// Glints clear of the glass, livery and tyres.
		glint(ctx, 404, 124, 4.4);
		glint(ctx, 548, 160, 4);
		glint(ctx, 596, 128, 4.2);
		glint(ctx, 194, 202, 3.6);
		glint(ctx, 420, 240, 3.4);
		glint(ctx, 302, 96, 4);
		glint(ctx, 626, 120, 3.8);
		glint(ctx, 664, 206, 3);
		glint(ctx, 344, 176, 3.2);
		glint(ctx, 250, 122, 3.2);
		glint(ctx, 74, 190, 3.2);
		glint(ctx, 336, 80, 2.2);

		// Glass sheen and a sparkle in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(108, 164);
		ctx.lineTo(142, 116);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(180, 148);
		ctx.lineTo(202, 116);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 192, 126, 3);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealDeliveryVan(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealDeliveryVanLevel(ctx, x, y, scale, 5);
}
