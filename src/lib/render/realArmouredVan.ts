/**
 * Armoured van art, cut into the same five-piece kit as the other realistic vehicles.
 * A cash-in-transit security van facing left: a heavy slab-sided graphite body with a
 * silver roof cap and waist band, a raised cargo roof carrying a low hatch, small
 * armoured glazing in the cab, a reinforced side door with a shield badge, twin rear
 * doors with latch rods, a running board, heavy bumpers and lamps.
 * Level 5 is the production target: shaded, fitted, lit and picture-book finished.
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

const DARK = '#495057';
const DARK_DEEP = '#343A40';
const DARK_EDGE = '#262B30';
const LIGHT = '#CED4DA';
const LIGHT_SHADE = '#ADB5BD';
const CREAM = '#F1F3F5';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/** Art box 720 x 340, road at 272. Front (cab) faces left. */
const SHELL =
	'M44,250 L44,196 Q44,188 52,184 L88,172 L134,96 Q138,88 148,88 L176,88 L176,64 Q176,56 186,56 L672,56 Q684,56 684,68 L684,250 Z';

// The spec body mask is this shell plus the roof hatch, both bumpers, the running board
// and the mirror head on its short arm. Every subpath only touches the shell at an edge,
// so the evenodd clip cannot punch a hole:
//   hatch   M408,42 L492,42 L492,56 L408,56 Z
//   bumper  M22,230 L44,230 L44,264 L22,264 Z
//   rear    M684,238 L704,238 L704,266 L684,266 Z
//   board   M190,250 L526,250 L526,259 L190,259 Z
//   mirror  M92,106 L110,106 L110,132 L92,132 Z
//   arm     M110,117 L121,117 L117.4,123 L110,123 Z
// The arm tip follows the raked shell edge (x = 88 + 0.6053 * (172 - y)), so it meets the
// body along a line instead of floating short of it.

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Small armoured glass: a raked screen band plus a compact cab side pane. */
const WINDSCREEN = 'M92,168 L130,106 L148,114 L110,176 Z';
const SIDE_GLASS = pane(152, 102, 20, 46, 4);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Reinforced side door: a clean rectangle, clear of every pane. */
const DOOR = { x: 300, y: 92, w: 92, h: 146 };

/** Twin rear doors on the rear quarter, behind the rear arch. */
const REAR_DOOR = { x: 618, y: 96, w: 60, h: 142 };

/** Low roof hatch, the cue that reads as a security vehicle from above. */
const HATCH = { x: 408, y: 42, w: 84, h: 14 };

const FRONT_BUMPER = { x: 22, y: 230, w: 22, h: 34 };
const REAR_BUMPER = { x: 684, y: 238, w: 20, h: 28 };
const SIDE_BOARD = { x: 190, y: 250, w: 336, h: 9 };
const MIRROR = { x: 92, y: 106, w: 18, h: 26 };

const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 580, y: 236, r: 36 };

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
	glass.addColorStop(0, 'rgba(255,255,255,0.55)');
	glass.addColorStop(0.46, 'rgba(255,255,255,0.04)');
	glass.addColorStop(1, 'rgba(80,160,210,0.3)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Filled wheel-arch band sitting just outside the tyre. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 13, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = DARK_DEEP;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(206,212,218,0.42)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 8.4, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();

	circle(ctx, cx - r - 10, cy - 3, 1.5, CHROME, 1);
	circle(ctx, cx + r + 10, cy - 3, 1.5, CHROME, 1);
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

/** Shield outline used for the security badge on the side door. */
function shieldPath(cx: number, cy: number, w: number, h: number): string {
	return `M${cx - w / 2},${cy - h / 2} L${cx + w / 2},${cy - h / 2} L${cx + w / 2},${cy + h * 0.06} Q${cx + w / 2},${cy + h * 0.32} ${cx},${cy + h / 2} Q${cx - w / 2},${cy + h * 0.32} ${cx - w / 2},${cy + h * 0.06} Z`;
}

/** The side door badge: silver shield, inset keyhole, riveted edge. */
function doorBadge(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	const cx = 340;
	const cy = 148;
	shape(ctx, shieldPath(cx, cy, 42, 54), LIGHT, 2.2);

	ctx.strokeStyle = 'rgba(73,80,87,0.45)';
	ctx.lineWidth = 1.5;
	ctx.stroke(new Path2D(shieldPath(cx, cy, 33, 44)));

	circle(ctx, cx, cy - 5, 4.6, DARK_DEEP, 1.3);
	ctx.beginPath();
	ctx.moveTo(cx - 3.1, cy - 1);
	ctx.lineTo(cx + 3.1, cy - 1);
	ctx.lineTo(cx + 5.2, cy + 11);
	ctx.lineTo(cx - 5.2, cy + 11);
	ctx.closePath();
	ctx.fillStyle = DARK_DEEP;
	ctx.fill();

	if (fitted) {
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		for (const [pipX, pipY] of [
			[cx - 16, cy - 22],
			[cx + 16, cy - 22],
			[cx - 13, cy + 1],
			[cx + 13, cy + 1]
		]) {
			ctx.beginPath();
			ctx.arc(pipX, pipY, 0.9, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}

/**
 * Picture-book hub: sidewall gloss, bright rim ring, six bolt heads with specular pips,
 * the dish shadow and a polished centre cap. Every mark is mirror-symmetric about the
 * hub centre, so the flipped rear wheel assembles identically.
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

	// Tread shoulder notches pick up a nick of light, mirrored about the hub centre.
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 1.6;
	for (const angle of [Math.PI * 1.18, Math.PI * 1.36, Math.PI * 1.64, Math.PI * 1.82]) {
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(angle) * r * 0.93, y + Math.sin(angle) * r * 0.93);
		ctx.lineTo(x + Math.cos(angle) * r * 0.99, y + Math.sin(angle) * r * 0.99);
		ctx.stroke();
	}

	// Bright rim ring, then a finer polished ring inside it.
	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.36)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.37, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.5, CHROME, 1.2);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx - 0.8, by - 0.9, 0.9, 0, Math.PI * 2);
		ctx.fill();
		// Radial slot in each bolt head, so the hub reads as bolted rather than printed.
		ctx.strokeStyle = 'rgba(38,43,48,0.35)';
		ctx.lineWidth = 0.9;
		ctx.beginPath();
		ctx.moveTo(bx + Math.cos(a) * 1.6, by + Math.sin(a) * 1.6);
		ctx.lineTo(bx - Math.cos(a) * 1.6, by - Math.sin(a) * 1.6);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(38,43,48,0.32)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, 0.18 * Math.PI, 0.82 * Math.PI);
	ctx.stroke();
	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);

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

/** Reinforced side door: armoured leaf, vision slot, badge, hinges and locking bar. */
function sideDoor(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	const { x, y, w, h } = DOOR;

	rect(ctx, x, y, w, h, DARK_DEEP, 3, 2.8);
	rect(ctx, x + 5, y + 5, w - 10, h - 10, DARK, 2, 2);

	// Livery band and rub strip continue across the leaf.
	ctx.fillStyle = LIGHT;
	ctx.fillRect(x + 5, 196, w - 10, 22);
	rect(ctx, x + 6, 219, w - 12, 4, CHROME, 0, 0);
	line(ctx, x + 8, 220.2, x + w - 8, 220.2, 'rgba(255,255,255,0.65)', 1.1);

	if (shaded) {
		const leaf = ctx.createLinearGradient(0, y + 5, 0, y + h - 5);
		leaf.addColorStop(0, 'rgba(255,255,255,0.16)');
		leaf.addColorStop(0.34, 'rgba(255,255,255,0.02)');
		leaf.addColorStop(1, 'rgba(15,18,21,0.22)');
		ctx.fillStyle = leaf;
		ctx.fillRect(x + 5, y + 5, w - 10, h - 10);
	}

	// Armoured vision slot: black opening cross-barred with steel.
	rect(ctx, x + 13, y + 10, w - 26, 9, DARK_EDGE, 1.5, 1.6);
	for (let bar = 0; bar < 5; bar++) {
		line(ctx, x + 18 + bar * 13, y + 11, x + 18 + bar * 13, y + 18, 'rgba(173,181,189,0.55)', 1.4);
	}

	doorBadge(ctx, fitted);

	if (fitted) {
		// Heavy hinges on the leading stile.
		for (const hy of [112, 150, 188]) {
			rect(ctx, x + 1, hy, 8, 15, STEEL, 2, 1.6);
			line(ctx, x + 3, hy + 3, x + 3, hy + 12, 'rgba(255,255,255,0.4)', 1);
		}

		// Locking bar, handle and keyhole on the trailing stile.
		rect(ctx, x + w - 16, 126, 10, 64, CHROME, 4, 2.4);
		line(ctx, x + w - 11, 131, x + w - 11, 185, 'rgba(38,43,48,0.36)', 1.8);
		rect(ctx, x + w - 27, 148, 12, 6, STEEL, 2, 1.5);
		circle(ctx, x + w - 11, 198, 1.7, DARK_DEEP, 1);

		// Kick plate along the sill.
		rect(ctx, x + 7, y + h - 15, w - 14, 9, STEEL, 1.5, 2);
		line(ctx, x + 9, y + h - 10.4, x + w - 9, y + h - 10.4, 'rgba(255,255,255,0.35)', 1.1);

		// Reflective corner pips.
		circle(ctx, x + 9, y + 7, 1.6, CHROME, 1);
		circle(ctx, x + w - 9, y + 7, 1.6, CHROME, 1);
	}
}

/** Twin rear doors: heavy leaves, stile hinges, twin latch rods and the rear plate. */
function rearDoors(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	const { x, y, w, h } = REAR_DOOR;

	rect(ctx, x, y, w, h, DARK_DEEP, 3, 2.8);
	rect(ctx, x + 4, y + 4, 24, h - 8, DARK, 1.5, 2);
	rect(ctx, x + 30, y + 4, 26, h - 8, DARK, 1.5, 2);

	if (shaded) {
		const leaves = ctx.createLinearGradient(0, y + 4, 0, y + h - 4);
		leaves.addColorStop(0, 'rgba(255,255,255,0.18)');
		leaves.addColorStop(0.42, 'rgba(255,255,255,0.02)');
		leaves.addColorStop(1, 'rgba(15,18,21,0.24)');
		ctx.fillStyle = leaves;
		ctx.fillRect(x + 4, y + 4, 52, h - 8);
	}

	// Livery band continues across both leaves.
	ctx.fillStyle = LIGHT;
	ctx.fillRect(x + 4, 196, 52, 22);
	rect(ctx, x + 4, 219, 52, 4, CHROME, 0, 0);
	line(ctx, x + 6, 197.4, x + w - 6, 197.4, 'rgba(255,255,255,0.42)', 1.2);
	line(ctx, x + 6, 216.6, x + w - 6, 216.6, 'rgba(30,35,40,0.26)', 1.2);

	// Centre joint between the leaves.
	line(ctx, x + 29, y + 4, x + 29, y + h - 4, DARK_EDGE, 2.2);
	line(ctx, x + 31, y + 6, x + 31, y + h - 8, 'rgba(255,255,255,0.34)', 1.2);

	if (fitted) {
		for (const hy of [y + 18, y + 58, y + 98]) {
			rect(ctx, x + 1, hy, 6, 12, STEEL, 1.5, 1.4);
			rect(ctx, x + w - 7, hy, 6, 12, STEEL, 1.5, 1.4);
		}

		// Twin latch rods with their handles.
		for (const rodX of [x + 12, x + 47]) {
			line(ctx, rodX, y + 7, rodX, y + h - 20, INK, 4.4);
			line(ctx, rodX, y + 7, rodX, y + h - 20, CHROME, 2.8);
			rect(ctx, rodX - 7, 142, 14, 5, STEEL, 1.5, 1.3);
			circle(ctx, rodX, y + h - 24, 1.8, DARK_DEEP, 1);
		}

		// Rear plate bolted under the band.
		rect(ctx, x + 18, 222, 26, 12, CREAM, 1.5, 1.6);
		ctx.fillStyle = DARK;
		ctx.fillRect(x + 19.5, 223.5, 3, 9);
		ctx.fillStyle = INK;
		ctx.fillRect(x + 25, 225.5, 12, 1.6);
		ctx.fillRect(x + 25, 228.5, 8, 1.6);
	}
}

/** Low roof hatch: rim, vent panel, hinge and two amber marker lamps. */
function roofHatch(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	const { x, y, w, h } = HATCH;

	rect(ctx, x, y, w, h, DARK_DEEP, 2, 2.4);
	rect(ctx, x + 3, y + 3, w - 6, h - 6, DARK, 1.5, 1.6);

	if (shaded) {
		const lid = ctx.createLinearGradient(0, y + 3, 0, y + h - 3);
		lid.addColorStop(0, 'rgba(255,255,255,0.3)');
		lid.addColorStop(1, 'rgba(15,18,21,0.24)');
		ctx.fillStyle = lid;
		ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
	}

	// Vent louvres in the middle of the lid.
	for (let vent = 0; vent < 4; vent++) {
		const ventY = y + 5 + vent * 2.2;
		line(ctx, x + 30, ventY, x + 66, ventY, 'rgba(38,43,48,0.6)', 1.2);
		line(ctx, x + 30, ventY + 1, x + 66, ventY + 1, 'rgba(255,255,255,0.28)', 0.9);
	}

	// Hinge plate and latch on the upper face.
	rect(ctx, x + 6, y + 2, 14, 4, STEEL, 1, 1.4);
	rect(ctx, x + w - 22, y + 4, 12, 5, CHROME, 1.5, 1.4);

	if (fitted) {
		// Amber identification lamps at the hatch corners.
		rect(ctx, x + 7, y + 7, 9, 5, AMBER, 1.5, 1.2);
		rect(ctx, x + w - 16, y + 7, 9, 5, AMBER, 1.5, 1.2);
		line(ctx, x + 4, y + 11.4, x + w - 4, y + 11.4, 'rgba(255,255,255,0.3)', 1);
	}

	if (finish) {
		// Lid gloss: a raked sheen across the vent panel, then a lit front lip and a
		// shaded inner sill so the hatch reads as a raised lid rather than a painted patch.
		ctx.save();
		ctx.beginPath();
		ctx.rect(x + 3, y + 3, w - 6, h - 6);
		ctx.clip();
		const lidGloss = ctx.createLinearGradient(x, y + h, x + w, y);
		lidGloss.addColorStop(0, 'rgba(255,255,255,0)');
		lidGloss.addColorStop(0.44, 'rgba(255,255,255,0.26)');
		lidGloss.addColorStop(0.62, 'rgba(255,255,255,0.05)');
		lidGloss.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = lidGloss;
		ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
		ctx.restore();

		line(ctx, x + 4, y + 4, x + w - 4, y + 4, 'rgba(255,255,255,0.72)', 1.4);
		line(ctx, x + 5, y + h - 3.6, x + w - 5, y + h - 3.6, 'rgba(15,18,21,0.4)', 1.2);

		// Latch plate gleam, hinge screw pips and an amber lamp pip at each corner.
		line(ctx, x + w - 21.2, y + 5.4, x + w - 10.8, y + 5.4, 'rgba(255,255,255,0.85)', 1.1);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		for (const [screwX, screwY] of [
			[x + 8, y + 3.1],
			[x + 18, y + 3.1]
		]) {
			ctx.beginPath();
			ctx.arc(screwX, screwY, 0.8, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.fillStyle = '#FFF4C2';
		for (const pipX of [x + 9.5, x + w - 14.5]) {
			ctx.beginPath();
			ctx.arc(pipX, y + 9.2, 0.9, 0, Math.PI * 2);
			ctx.fill();
		}

		glint(ctx, x + 26, y + 6, 2.4);
		glint(ctx, x + w - 16, y + h - 5, 2.2);
	}
}

/** Door-mounted mirror: heavy housing on a wedge arm that lands on the raked cab edge. */
function mirror(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	shape(ctx, 'M110,117 L121,117 L117.4,123 L110,123 Z', STEEL, 2);
	line(ctx, 111, 118, 118, 118, 'rgba(255,255,255,0.4)', 1.1);

	rect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, DARK_DEEP, 3, 2.4);
	if (shaded) {
		rect(ctx, MIRROR.x + 3, MIRROR.y + 3, MIRROR.w - 6, MIRROR.h - 6, GLASS, 1.2);
		line(ctx, MIRROR.x + 4, MIRROR.y + 5, MIRROR.x + 4, MIRROR.y + MIRROR.h - 6, 'rgba(255,255,255,0.3)', 1.2);
	}
}

/** Paint grain over solid paint only: the glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(44, 56, 684, 250);
	wash.addColorStop(0, 'rgba(255,255,255,0.08)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(15,18,21,0.1)');
	ctx.fillStyle = wash;
	ctx.fillRect(44, 56, 640, 194);

	let seed = 53;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 440; i++) {
		const px = 48 + rand() * 632;
		const py = 60 + rand() * 188;
		const size = 1.4 + rand() * 1.1;
		ctx.globalAlpha = 0.09 + rand() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#F1F3F5';
	for (let i = 0; i < 160; i++) {
		const px = 48 + rand() * 632;
		const py = 60 + rand() * 188;
		const size = 1.2 + rand() * 0.9;
		ctx.globalAlpha = 0.16 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[52, 190, 168, 188],
		[204, 72, 400, 70],
		[416, 120, 596, 118],
		[420, 234, 600, 232],
		[52, 238, 176, 236],
		[520, 168, 604, 167]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest.
	ctx.globalAlpha = 0.15;
	ctx.strokeStyle = LIGHT;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[64, 208, 128, 207],
		[214, 236, 262, 235],
		[452, 88, 512, 87],
		[548, 232, 598, 231],
		[214, 122, 268, 121]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Panel sheen: roof light, a cool flank wash and a bounce along the waist band. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	const roofSheen = ctx.createLinearGradient(0, 56, 0, 104);
	roofSheen.addColorStop(0, 'rgba(255,255,255,0.36)');
	roofSheen.addColorStop(0.55, 'rgba(255,255,255,0.08)');
	roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roofSheen;
	ctx.fillRect(186, 56, 494, 48);

	const flankSheen = ctx.createLinearGradient(360, 70, 560, 200);
	flankSheen.addColorStop(0, 'rgba(255,255,255,0)');
	flankSheen.addColorStop(0.46, 'rgba(255,255,255,0.15)');
	flankSheen.addColorStop(0.72, 'rgba(255,255,255,0.04)');
	flankSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = flankSheen;
	ctx.fillRect(350, 66, 210, 136);

	const cabSheen = ctx.createLinearGradient(44, 96, 150, 180);
	cabSheen.addColorStop(0, 'rgba(255,255,255,0.2)');
	cabSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cabSheen;
	ctx.fillRect(44, 96, 116, 92);

	ctx.strokeStyle = LIGHT;
	ctx.lineWidth = 3;
	for (const [sx, sy, ex, ey] of [
		[198, 66, 430, 64],
		[436, 116, 598, 114],
		[48, 214, 130, 212]
	]) {
		ctx.globalAlpha = 0.24;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/**
 * Second grain pass: a finer coat over the ribbed cargo panels, short brush drags that
 * stop at the joints, and road film gathered above the running board.
 */
function armourGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	let seed = 97;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	// Freckle: tighter than the base grain and mostly on the upper flank.
	ctx.fillStyle = DARK_EDGE;
	for (let i = 0; i < 220; i++) {
		const px = 190 + rand() * 480;
		const py = 70 + rand() * 170;
		ctx.globalAlpha = 0.05 + rand() * 0.05;
		ctx.fillRect(px, py, 1 + rand() * 0.9, 1 + rand() * 0.9);
	}
	ctx.fillStyle = '#E9ECEF';
	for (let i = 0; i < 95; i++) {
		const px = 190 + rand() * 480;
		const py = 70 + rand() * 170;
		ctx.globalAlpha = 0.08 + rand() * 0.06;
		ctx.fillRect(px, py, 0.8 + rand() * 0.7, 0.8 + rand() * 0.7);
	}

	// Brush drag: short horizontal pulls, each one narrower than a rib bay.
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1;
	for (let i = 0; i < 16; i++) {
		const rowY = 76 + rand() * 148;
		const startX = 196 + rand() * 468;
		const len = 16 + rand() * 42;
		ctx.globalAlpha = 0.08 + rand() * 0.06;
		ctx.beginPath();
		ctx.moveTo(startX, rowY);
		ctx.lineTo(startX + len, rowY + 0.6);
		ctx.stroke();
	}

	// Skirt mottle: a little road film above the board, thinning toward the door.
	ctx.fillStyle = INK;
	for (let i = 0; i < 26; i++) {
		const px = 190 + rand() * 330;
		const py = 234 + rand() * 11;
		ctx.globalAlpha = 0.06 + rand() * 0.06;
		ctx.beginPath();
		ctx.ellipse(px, py, 3 + rand() * 7, 1.6 + rand() * 2.2, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

/**
 * Armour-panel sheen: roof-cap glare, a long diagonal gloss down the ribbed flank, a
 * rear-quarter bounce and crisp light on the panel rib crests.
 */
function armourSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Hard run along the silver roof cap with a short fall-off underneath.
	const cap = ctx.createLinearGradient(0, 56, 0, 76);
	cap.addColorStop(0, 'rgba(255,255,255,0.5)');
	cap.addColorStop(0.32, 'rgba(255,255,255,0.16)');
	cap.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cap;
	ctx.fillRect(186, 56, 494, 20);

	// The main gloss: a wide diagonal band that crosses several rib bays at once.
	const flank = ctx.createLinearGradient(320, 60, 520, 226);
	flank.addColorStop(0, 'rgba(255,255,255,0)');
	flank.addColorStop(0.34, 'rgba(255,255,255,0.08)');
	flank.addColorStop(0.5, 'rgba(255,255,255,0.12)');
	flank.addColorStop(0.66, 'rgba(255,255,255,0.03)');
	flank.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = flank;
	ctx.fillRect(300, 66, 270, 180);

	// Rear-quarter bounce, so the back of the box belongs to the same gloss.
	const rear = ctx.createLinearGradient(604, 84, 682, 236);
	rear.addColorStop(0, 'rgba(255,255,255,0.1)');
	rear.addColorStop(0.58, 'rgba(255,255,255,0.02)');
	rear.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = rear;
	ctx.fillRect(598, 80, 86, 162);

	// Cab shoulder catch-light above the waist band.
	const cab = ctx.createLinearGradient(44, 92, 152, 178);
	cab.addColorStop(0, 'rgba(255,255,255,0.13)');
	cab.addColorStop(0.52, 'rgba(255,255,255,0.03)');
	cab.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cab;
	ctx.fillRect(44, 88, 140, 100);

	// Rib crests take a crisp light edge in the finished pass.
	ctx.strokeStyle = 'rgba(255,255,255,0.32)';
	ctx.lineWidth = 1.1;
	for (let ribX = 206; ribX < 610; ribX += 34) {
		if (ribX > DOOR.x - 8 && ribX < DOOR.x + DOOR.w + 8) continue;
		if (ribX > REAR_DOOR.x - 8) continue;
		ctx.beginPath();
		ctx.moveTo(ribX + 2.2, 70);
		ctx.lineTo(ribX + 2.2, 190);
		ctx.stroke();
	}
	ctx.restore();

	// Long chrome catch on the waist-band rub strip, dying out at both ends.
	ctx.save();
	ctx.beginPath();
	ctx.rect(44, 219, 640, 4);
	ctx.clip();
	const strip = ctx.createLinearGradient(44, 219, 684, 219);
	strip.addColorStop(0, 'rgba(255,255,255,0)');
	strip.addColorStop(0.24, 'rgba(255,255,255,0.72)');
	strip.addColorStop(0.5, 'rgba(255,255,255,0.14)');
	strip.addColorStop(0.74, 'rgba(255,255,255,0.58)');
	strip.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = strip;
	ctx.fillRect(44, 219, 640, 4);
	ctx.restore();
}

/** Lock hardware gleam: locking bar, keyholes, latch rods, rear handles and the badge. */
function lockSheen(ctx: CanvasRenderingContext2D): void {
	// Side-door locking bar: a vertical specular run with a cap at each end.
	ctx.save();
	ctx.beginPath();
	ctx.rect(DOOR.x + DOOR.w - 16, 126, 10, 64);
	ctx.clip();
	const bar = ctx.createLinearGradient(DOOR.x + DOOR.w - 16, 0, DOOR.x + DOOR.w - 6, 0);
	bar.addColorStop(0, 'rgba(255,255,255,0)');
	bar.addColorStop(0.42, 'rgba(255,255,255,0.72)');
	bar.addColorStop(0.62, 'rgba(255,255,255,0.18)');
	bar.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = bar;
	ctx.fillRect(DOOR.x + DOOR.w - 16, 126, 10, 64);
	ctx.restore();

	line(ctx, DOOR.x + DOOR.w - 11, 130, DOOR.x + DOOR.w - 11, 142, 'rgba(255,255,255,0.85)', 1.2);
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(DOOR.x + DOOR.w - 13.4, 128.6, 1, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(DOOR.x + DOOR.w - 8.6, 187.4, 0.9, 0, Math.PI * 2);
	ctx.fill();

	// Handle top edge and the ring of light around the keyhole.
	line(ctx, DOOR.x + DOOR.w - 26, 149.4, DOOR.x + DOOR.w - 16, 149.4, 'rgba(255,255,255,0.7)', 1.1);
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 0.9;
	ctx.beginPath();
	ctx.arc(DOOR.x + DOOR.w - 11, 198, 2.6, Math.PI * 1.05, Math.PI * 1.65);
	ctx.stroke();

	// Hinge plates on the leading stile keep a polished pip each.
	ctx.fillStyle = 'rgba(255,255,255,0.8)';
	for (const hingeY of [112, 150, 188]) {
		ctx.beginPath();
		ctx.arc(DOOR.x + 3.2, hingeY + 3.4, 0.85, 0, Math.PI * 2);
		ctx.fill();
	}

	// Rear latch rods: bright leading edge, collar light and end-cap sparkle.
	for (const rodX of [REAR_DOOR.x + 12, REAR_DOOR.x + 47]) {
		line(ctx, rodX - 1.1, REAR_DOOR.y + 8, rodX - 1.1, REAR_DOOR.y + REAR_DOOR.h - 21, 'rgba(255,255,255,0.58)', 1.1);
		line(ctx, rodX + 1.2, REAR_DOOR.y + 8, rodX + 1.2, REAR_DOOR.y + REAR_DOOR.h - 21, 'rgba(15,18,21,0.24)', 1.1);
		line(ctx, rodX - 6.5, 143.2, rodX + 6.5, 143.2, 'rgba(255,255,255,0.55)', 1);
		ctx.fillStyle = '#FFFFFF';
		ctx.beginPath();
		ctx.arc(rodX - 2.6, REAR_DOOR.y + 8.6, 0.8, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(rodX - 2.6, REAR_DOOR.y + REAR_DOOR.h - 20.6, 0.8, 0, Math.PI * 2);
		ctx.fill();
	}

	// Rear hinge plates.
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	for (const hingeY of [REAR_DOOR.y + 18, REAR_DOOR.y + 58, REAR_DOOR.y + 98]) {
		for (const pipX of [REAR_DOOR.x + 2.6, REAR_DOOR.x + REAR_DOOR.w - 5.4]) {
			ctx.beginPath();
			ctx.arc(pipX, hingeY + 3.2, 0.8, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// One raked gleam across the shield face of the door badge.
	ctx.save();
	ctx.clip(new Path2D(shieldPath(340, 148, 42, 54)));
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(322, 160);
	ctx.lineTo(340, 126);
	ctx.stroke();
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(348, 158);
	ctx.lineTo(358, 136);
	ctx.stroke();
	ctx.restore();
}

/** Finishing marks: rivets, lamp pips, arch crowns, stone chips and dust. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// Roof-band rivets.
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.65;
	for (let rivetX = 196; rivetX <= 670; rivetX += 32) {
		ctx.beginPath();
		ctx.arc(rivetX, 60, 1.4, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Waist-band rivets either side of the door and rear bay.
	ctx.save();
	ctx.fillStyle = 'rgba(241,243,245,0.7)';
	for (const rivetX of [198, 246, 408, 456, 504, 552]) {
		ctx.beginPath();
		ctx.arc(rivetX, 207, 1.2, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Headlamp and marker lamp pips.
	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[57, 221, 1.7],
		[202, 60, 1.1],
		[658, 60, 1.1]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	// Indicator, tail lamps and the front bumper each pick up a small lip.
	line(ctx, 49, 207.2, 57, 207.2, 'rgba(255,255,255,0.6)', 1.1);
	line(ctx, 625, 241.4, 635, 241.4, 'rgba(255,255,255,0.65)', 1.2);
	line(ctx, 645, 241.4, 655, 241.4, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 28, 236.5, 42, 236.5, 'rgba(255,255,255,0.7)', 1.5);
	line(ctx, 686, 243, 700, 243, 'rgba(255,255,255,0.6)', 1.2);

	// Running-board tread and bracket shadows.
	line(ctx, 196, 255, 520, 255, 'rgba(255,255,255,0.4)', 1.1);
	for (const bracketX of [240, 330, 420, 500]) {
		line(ctx, bracketX, 259, bracketX, 263, 'rgba(38,43,48,0.4)', 2);
	}

	// Mudguard hardware and lit arch crowns.
	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		circle(ctx, wheelX, WHEEL_L.y - WHEEL_L.r - 10.6, 1.6, CHROME, 1);
		ctx.strokeStyle = 'rgba(255,255,255,0.48)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 9.4, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
	}

	// Stone chips where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.4;
	ctx.fillStyle = LIGHT;
	for (const [chipX, chipY, chipR] of [
		[64, 246, 1.2],
		[214, 247, 1.1],
		[398, 246, 1.3],
		[478, 247, 1.2],
		[600, 245, 1.1]
	]) {
		ctx.beginPath();
		ctx.arc(chipX, chipY, chipR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Garage dust low on the flank, so the finish keeps its used edge.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	for (const [dustX, dustY, dustR] of [
		[424, 240, 1.5],
		[512, 238, 1.3],
		[580, 236, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export function drawRealArmouredVanLevel(
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
		ctx.ellipse(364, 279, 344, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis block: painted under the body so the underbody keeps its strip.
	rect(ctx, 60, 240, 610, 20, '#3B4149', 0, 0);
	rect(ctx, 62, 241, 606, 3, '#565E67', 0, 0);
	rect(ctx, 62, 255, 606, 4, '#2A2F35', 0, 0);

	// Heavy slab-sided shell.
	shape(ctx, SHELL, DARK);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Body paint: light roof, flat mid, deep lower shade.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 56, 0, 250);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.12, 'rgba(255,255,255,0.06)');
		paint.addColorStop(0.68, 'rgba(15,18,21,0.04)');
		paint.addColorStop(1, 'rgba(15,18,21,0.3)');
		ctx.fillStyle = paint;
		ctx.fillRect(44, 56, 640, 194);

		const cabPaint = ctx.createLinearGradient(0, 88, 0, 250);
		cabPaint.addColorStop(0, 'rgba(255,255,255,0.28)');
		cabPaint.addColorStop(0.4, 'rgba(255,255,255,0.04)');
		cabPaint.addColorStop(1, 'rgba(15,18,21,0.24)');
		ctx.fillStyle = cabPaint;
		ctx.fillRect(44, 88, 142, 162);
	}

	// Silver roof cap.
	rect(ctx, 186, 56, 490, 7, LIGHT, 0, 0);
	line(ctx, 190, 58.2, 670, 58.2, 'rgba(255,255,255,0.6)', 1.5);
	line(ctx, 188, 62.2, 674, 62.2, 'rgba(30,35,40,0.28)', 1.2);

	// Cab roof trim picks up the same cap where the cab steps down to the screen.
	ctx.fillStyle = LIGHT;
	ctx.fillRect(150, 88, 26, 4);
	line(ctx, 152, 89.2, 174, 89.2, 'rgba(255,255,255,0.5)', 1.1);

	// Waist band and chrome rub strip, carried across cab, cargo flank and doors.
	ctx.fillStyle = LIGHT;
	ctx.fillRect(44, 196, 640, 22);
	line(ctx, 46, 197.4, 682, 197.4, 'rgba(255,255,255,0.42)', 1.4);
	line(ctx, 46, 216.6, 682, 216.6, 'rgba(30,35,40,0.24)', 1.4);
	rect(ctx, 44, 219, 640, 4, CHROME, 0, 0);
	line(ctx, 48, 220.2, 680, 220.2, 'rgba(255,255,255,0.7)', 1.1);

	// Panel joints across the upper cargo flank, skipping both door bays.
	for (let ribX = 206; ribX < 610; ribX += 34) {
		if (ribX > DOOR.x - 8 && ribX < DOOR.x + DOOR.w + 8) continue;
		if (ribX > REAR_DOOR.x - 8) continue;
		line(ctx, ribX, 66, ribX, 192, 'rgba(15,18,21,0.26)', 1.6);
		line(ctx, ribX + 1.6, 66, ribX + 1.6, 192, 'rgba(255,255,255,0.2)', 1.2);
	}

	// Cab door seam and the cab / box joint.
	line(ctx, 176, 94, 176, 248, 'rgba(15,18,21,0.45)', 2);
	line(ctx, 177.4, 98, 177.4, 244, 'rgba(255,255,255,0.22)', 1.1);
	line(ctx, 186, 60, 186, 248, 'rgba(15,18,21,0.5)', 2.2);
	line(ctx, 187.6, 64, 187.6, 244, 'rgba(255,255,255,0.24)', 1.2);

	// Livery word on the rear half of the band.
	ctx.fillStyle = DARK;
	ctx.font = '700 13px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('SECURE', 430, 213);

	rearDoors(ctx, shaded, fitted);
	sideDoor(ctx, shaded, fitted);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	roofHatch(ctx, shaded, fitted, finish);
	mirror(ctx, shaded);

	// Armoured glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 92, 106, 56, 70);
		glassShade(ctx, SIDE_GLASS, 152, 102, 20, 46);
	}

	// Heavy front bumper, rear bumper and the side running board.
	rect(ctx, FRONT_BUMPER.x, FRONT_BUMPER.y, FRONT_BUMPER.w, FRONT_BUMPER.h, CHROME, 3, 2.6);
	rect(ctx, 24, 240, 18, 6, DARK_DEEP, 1.5, 1.4);
	line(ctx, 24, 232.5, 42, 232.5, 'rgba(255,255,255,0.7)', 1.6);
	line(ctx, 24, 246, 42, 246, 'rgba(38,43,48,0.28)', 1.3);
	line(ctx, 24, 261, 42, 261, 'rgba(38,43,48,0.3)', 1.4);
	circle(ctx, 34, 252, 2.2, DARK_EDGE, 1.2);

	rect(ctx, REAR_BUMPER.x, REAR_BUMPER.y, REAR_BUMPER.w, REAR_BUMPER.h, CHROME, 2.5, 2.6);
	line(ctx, 686, 242, 702, 242, 'rgba(255,255,255,0.6)', 1.4);
	line(ctx, 686, 248, 702, 248, 'rgba(38,43,48,0.28)', 1.3);
	line(ctx, 686, 263, 702, 263, 'rgba(38,43,48,0.28)', 1.3);

	rect(ctx, SIDE_BOARD.x, SIDE_BOARD.y, SIDE_BOARD.w, SIDE_BOARD.h, STEEL, 1.5, 2.2);
	line(ctx, 194, 253.4, 522, 253.4, 'rgba(255,255,255,0.42)', 1.2);
	line(ctx, 194, 256.6, 522, 256.6, 'rgba(15,18,21,0.3)', 1.1);

	// Exhaust outlet under the board.
	rect(ctx, 472, 252, 26, 5, STEEL, 2.5, 1.8);
	line(ctx, 474, 253.4, 496, 253.4, 'rgba(255,255,255,0.3)', 1.1);

	if (fitted) {
		// Grille, indicator and headlamp on the front face.
		rect(ctx, 47, 190, 9, 14, DARK_DEEP, 1.5, 2);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 48, 193 + bar * 2.8, 55, 193 + bar * 2.8, CHROME, 1.1);
		}
		rect(ctx, 48, 206, 11, 8, AMBER, 2, 1.6);
		circle(ctx, 60, 224, 9, LAMP, 2.4);
		circle(ctx, 60, 224, 4.6, '#FFF7CF', 1.5);

		// Wipers, clipped to the screen.
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		line(ctx, 102, 168, 124, 146, INK, 2.2);
		line(ctx, 116, 168, 136, 148, INK, 2);
		ctx.restore();

		// Roof marker lamps on the box shoulders.
		circle(ctx, 202, 60, 2.6, AMBER, 1.2);
		circle(ctx, 658, 60, 2.6, AMBER, 1.2);

		// Cab door handle and keyhole.
		rect(ctx, 158, 170, 14, 5, CHROME, 2.5, 2);
		line(ctx, 160, 172.5, 170, 172.5, 'rgba(38,43,48,0.32)', 1.1);
		circle(ctx, 168, 180, 1.5, INK, 1);

		// Tail lamps under the rear doors.
		rect(ctx, 622, 240, 12, 9, RED, 2, 1.8);
		rect(ctx, 640, 240, 9, 9, AMBER, 1.5, 1.5);

		// Side markers along the band.
		for (const markerX of [206, 284, 556, 596]) {
			rect(ctx, markerX, 201, 12, 5, AMBER, 1.2, 1.1);
		}

		// Mudguards over both axles.
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: roof cap, rear edge and the front face.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(196, 57.4);
		ctx.lineTo(664, 57.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(683, 72);
		ctx.lineTo(683, 238);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(45.4, 204);
		ctx.lineTo(45.4, 244);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(60, 224, 1, 60, 224, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(60, 224, 30, 0, Math.PI * 2);
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
		armourGrain(ctx);
		panelSheen(ctx);
		armourSheen(ctx);

		// Glints, clear of the glass, tyres and lettering.
		glint(ctx, 250, 78, 4.6);
		glint(ctx, 560, 90, 4);
		glint(ctx, 470, 166, 4.2);
		glint(ctx, 120, 220, 3.6);
		glint(ctx, 540, 210, 3.8);
		glint(ctx, 612, 176, 3.2);
		glint(ctx, 350, 74, 3.4);
		glint(ctx, 262, 100, 3.2);
		glint(ctx, 214, 152, 3);
		glint(ctx, 664, 126, 2.8);
		glint(ctx, 90, 188, 2.6);
		glint(ctx, 520, 228, 2.4);
		glint(ctx, 674, 230, 2.2);

		// Glass sheen and a sparkle in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(100, 166);
		ctx.lineTo(132, 112);
		ctx.stroke();
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(156, 140);
		ctx.lineTo(168, 116);
		ctx.stroke();
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(160, 144);
		ctx.lineTo(167, 132);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 162, 128, 2.6);
		glint(ctx, 112, 138, 2.4);
		glint(ctx, 158, 108, 2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
		lockSheen(ctx);

		// Exhaust puff.
		ctx.save();
		for (const [px, py, pr, alpha] of [
			[506, 254, 4.5, 0.3],
			[515, 249, 6.5, 0.24],
			[526, 242, 8.5, 0.16]
		] as const) {
			ctx.globalAlpha = alpha;
			ctx.fillStyle = '#E9ECEF';
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealArmouredVan(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealArmouredVanLevel(ctx, x, y, scale, 5);
}
