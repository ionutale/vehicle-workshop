/**
 * Refrigerated truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over insulated box lorry facing left: a tall white fridge body with fine panel
 * joints, a nose-mounted chiller unit sitting above the cab roof with its vent bank, a
 * side access door, rear cargo doors with latch rods, blue livery, mudguards and a low
 * rear under-run. Level 5 is the production target: shaded, fitted, lit and picture-book
 * finished.
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

const CREAM = '#F7F9FC';
const CREAM_SHADE = '#E9F0F8';
const BLUE = '#457B9D';
const BLUE_DARK = '#2F5C77';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/** Art box 780 x 340, road at 272. Front (cab) faces left. */
const SHELL =
	'M24,260 L24,134 Q24,114 42,110 Q58,106 78,106 L130,106 L130,62 Q130,58 136,58 L196,58 L196,52 L742,52 Q752,52 752,62 L752,240 L196,240 L196,260 Z';

// The spec body mask is this shell plus the underbody band, the mirror head and both
// bumpers: M196,240 L752,240 L752,260 L196,260 Z, then three small rects outside the
// shell. Subpaths never overlap, so the evenodd clip cannot punch a hole.

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const WINDSCREEN = pane(36, 120, 92, 58, 9);
const SIDE_GLASS = pane(138, 124, 44, 54, 5);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Side access door: a clean rectangle, clear of every piece of glass. */
const DOOR = { x: 470, y: 96, w: 86, h: 108 };

/** Rear cargo doors, drawn as the last bay of the box side with the latch rods. */
const REAR_DOOR = { x: 684, y: 60, w: 66, h: 176 };

/** Chiller unit on the box front face, sitting above the cab roof. */
const CHILLER = { x: 130, y: 58, w: 66, h: 48 };

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
	ctx.arc(cx, cy, r + 12, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = BLUE;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 7.6, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
}

/** The insulated-panel cue: a six-armed frost star. */
function snowflake(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 2.4;
	for (let i = 0; i < 3; i++) {
		const a = (i / 3) * Math.PI;
		ctx.beginPath();
		ctx.moveTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r);
		ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
		ctx.stroke();
	}
	ctx.lineWidth = 1.7;
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = cx + Math.cos(a) * r * 0.6;
		const by = cy + Math.sin(a) * r * 0.6;
		for (const s of [-0.52, 0.52]) {
			ctx.beginPath();
			ctx.moveTo(bx, by);
			ctx.lineTo(bx + Math.cos(a + s) * r * 0.32, by + Math.sin(a + s) * r * 0.32);
			ctx.stroke();
		}
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

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.29, y + Math.sin(a) * r * 0.29, 2.5, CHROME, 1.2);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);

	// Twin quarter-arcs mirrored across the centre line, plus the valve cap on the crown.
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
}

/** The side access door: insulated leaf, hinges, latch bar and kick plate. */
function cargoDoor(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, CREAM_SHADE, 2.5, 2.6);
	rect(ctx, DOOR.x + 6, DOOR.y + 6, DOOR.w - 12, DOOR.h - 12, CREAM, 2, 2);
	line(ctx, DOOR.x + 6, DOOR.y + 10, DOOR.x + DOOR.w - 6, DOOR.y + 10, 'rgba(47,92,119,0.16)', 1.6);

	if (fitted) {
		for (const hy of [112, 146, 180]) {
			rect(ctx, DOOR.x + 1, hy, 7, 15, STEEL, 2, 1.6);
			line(ctx, DOOR.x + 8, hy + 3, DOOR.x + 12, hy + 3, 'rgba(58,39,27,0.25)', 1.2);
		}

		// Latch bar and its handle sit on the trailing stile.
		rect(ctx, DOOR.x + DOOR.w - 16, 134, 10, 32, CHROME, 3, 2.2);
		line(ctx, DOOR.x + DOOR.w - 11, 138, DOOR.x + DOOR.w - 11, 162, 'rgba(58,39,27,0.34)', 1.6);
		rect(ctx, DOOR.x + DOOR.w - 26, 146, 10, 5, STEEL, 1.5, 1.4);
		rect(ctx, DOOR.x + 6, DOOR.y + DOOR.h - 19, DOOR.w - 12, 8, BLUE, 2, 1.6);
	}
}

/** Rear cargo doors: two leaves, stile hinges, twin latch rods and the rear plate. */
function rearDoors(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	rect(ctx, REAR_DOOR.x, REAR_DOOR.y, REAR_DOOR.w, REAR_DOOR.h, CREAM_SHADE, 3, 2.6);
	rect(ctx, REAR_DOOR.x + 4, REAR_DOOR.y + 5, REAR_DOOR.w - 8, REAR_DOOR.h - 10, CREAM, 2, 2);
	rect(ctx, REAR_DOOR.x + 4, 204, REAR_DOOR.w - 8, 27, BLUE, 0, 0);
	line(ctx, REAR_DOOR.x + 4, 206, REAR_DOOR.x + REAR_DOOR.w - 4, 206, 'rgba(255,255,255,0.32)', 1.5);
	line(
		ctx,
		REAR_DOOR.x + 33,
		REAR_DOOR.y + 5,
		REAR_DOOR.x + 33,
		REAR_DOOR.y + REAR_DOOR.h - 5,
		'rgba(47,92,119,0.42)',
		2.2
	);
	line(
		ctx,
		REAR_DOOR.x + 34.8,
		REAR_DOOR.y + 8,
		REAR_DOOR.x + 34.8,
		REAR_DOOR.y + REAR_DOOR.h - 8,
		'rgba(255,255,255,0.7)',
		1.3
	);

	if (fitted) {
		for (const hy of [76, 118, 160, 200]) {
			rect(ctx, REAR_DOOR.x + 2, hy, 10, 8, STEEL, 1.5, 1.5);
			rect(ctx, REAR_DOOR.x + REAR_DOOR.w - 12, hy, 10, 8, STEEL, 1.5, 1.5);
		}

		// Twin lock rods with their latch handles.
		for (const rodX of [REAR_DOOR.x + 15, REAR_DOOR.x + 51]) {
			line(ctx, rodX, REAR_DOOR.y + 6, rodX, REAR_DOOR.y + REAR_DOOR.h - 8, INK, 5);
			line(ctx, rodX, REAR_DOOR.y + 6, rodX, REAR_DOOR.y + REAR_DOOR.h - 8, CHROME, 3.2);
			rect(ctx, rodX - 8, 142, 16, 5, STEEL, 1.5, 1.4);
		}

		// Rear plate bolted between the rods.
		rect(ctx, REAR_DOOR.x + 26, 214, 26, 13, CREAM, 1.5, 1.7);
		ctx.fillStyle = BLUE;
		ctx.fillRect(REAR_DOOR.x + 28, 216, 4, 9);
		ctx.fillStyle = INK;
		ctx.fillRect(REAR_DOOR.x + 34, 218, 15, 2);
		ctx.fillRect(REAR_DOOR.x + 34, 222, 11, 2);
	}
}

export function drawRealRefrigeratedTruckLevel(
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
		ctx.ellipse(390, 279, 352, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis block: painted under the box so the body mask keeps its underbody.
	rect(ctx, 28, 240, 724, 20, '#6F7987', 0, 0);
	rect(ctx, 28, 240, 724, 3, '#8C96A4', 0, 0);
	rect(ctx, 28, 256, 724, 4, '#555D6A', 0, 0);

	// Cab, chiller bump and insulated box in one silhouette.
	shape(ctx, SHELL, CREAM);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Box and cab paint: light roof, cool lower shade.
	if (shaded) {
		const boxPaint = ctx.createLinearGradient(0, 52, 0, 240);
		boxPaint.addColorStop(0, 'rgba(255,255,255,0.62)');
		boxPaint.addColorStop(0.16, 'rgba(255,255,255,0.12)');
		boxPaint.addColorStop(0.66, 'rgba(47,92,119,0.03)');
		boxPaint.addColorStop(1, 'rgba(47,92,119,0.16)');
		ctx.fillStyle = boxPaint;
		ctx.fillRect(196, 52, 556, 188);

		const cabPaint = ctx.createLinearGradient(0, 104, 0, 260);
		cabPaint.addColorStop(0, 'rgba(255,255,255,0.56)');
		cabPaint.addColorStop(0.3, 'rgba(255,255,255,0.06)');
		cabPaint.addColorStop(0.74, 'rgba(47,92,119,0.03)');
		cabPaint.addColorStop(1, 'rgba(47,92,119,0.15)');
		ctx.fillStyle = cabPaint;
		ctx.fillRect(0, 104, 200, 160);
	}

	// Fine insulated panel joints across the box side, skipping both door bays.
	for (let ribX = 218; ribX < 740; ribX += 31) {
		if (ribX > DOOR.x - 9 && ribX < DOOR.x + DOOR.w + 9) continue;
		if (ribX > REAR_DOOR.x - 9) continue;
		line(ctx, ribX, 58, ribX, 204, 'rgba(47,92,119,0.16)', 1.6);
		line(ctx, ribX + 1.6, 58, ribX + 1.6, 204, 'rgba(255,255,255,0.72)', 1.3);
	}
	line(ctx, 196, 112, 752, 112, 'rgba(47,92,119,0.14)', 1.6);
	line(ctx, 196, 113.6, 752, 113.6, 'rgba(255,255,255,0.6)', 1.2);

	// Livery: blue roof rail, waist band, cab roof cap, cab stripe and skirt.
	rect(ctx, 196, 52, 556, 6, BLUE, 0, 0);
	rect(ctx, 196, 204, 488, 36, BLUE, 0, 0);
	line(ctx, 196, 206.5, 684, 206.5, 'rgba(255,255,255,0.34)', 1.6);
	line(ctx, 196, 236, 684, 236, 'rgba(47,92,119,0.42)', 2);

	rect(ctx, 16, 104, 128, 10, BLUE, 0, 0);
	rect(ctx, 16, 184, 186, 9, BLUE, 0, 0);
	rect(ctx, 16, 244, 186, 20, BLUE, 0, 0);
	line(ctx, 18, 246.5, 194, 246.5, 'rgba(255,255,255,0.3)', 1.5);

	// Cab door seam and handle.
	line(ctx, 132.6, 112, 132.6, 250, 'rgba(58,39,27,0.36)', 2);
	line(ctx, 134.4, 116, 134.4, 246, 'rgba(255,255,255,0.32)', 1.1);
	rect(ctx, 144, 196, 18, 6, CHROME, 2.5, 2);

	// Cab / box joint.
	line(ctx, 196, 106, 196, 240, 'rgba(47,92,119,0.4)', 2.2);
	line(ctx, 197.6, 108, 197.6, 238, 'rgba(255,255,255,0.45)', 1.2);

	cargoDoor(ctx, fitted);
	rearDoors(ctx, fitted);

	// Frost roundel: the one cue that names the load.
	circle(ctx, 288, 146, 25, BLUE, 2.4);
	ctx.strokeStyle = 'rgba(255,255,255,0.42)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(288, 146, 20, 0, Math.PI * 2);
	ctx.stroke();
	snowflake(ctx, 288, 146, 15);

	ctx.fillStyle = CREAM;
	ctx.font = '700 19px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('FRESH', 342, 231);

	// Chiller unit on the box front face, above the cab roof.
	rect(ctx, CHILLER.x, CHILLER.y, CHILLER.w, CHILLER.h, CREAM_SHADE, 3, 2.6);
	rect(ctx, CHILLER.x, CHILLER.y, CHILLER.w, 5, BLUE, 0, 0);
	rect(ctx, CHILLER.x + 1, 102, CHILLER.w - 2, 5, STEEL, 1.5, 1.8);

	// Louvre bank over the lower half, with the condenser fan and the control panel above.
	for (let vent = 0; vent < 5; vent++) {
		const ventY = 78 + vent * 5;
		line(ctx, 134, ventY, 192, ventY, 'rgba(47,92,119,0.5)', 2.2);
		line(ctx, 134, ventY + 2.2, 192, ventY + 2.2, 'rgba(255,255,255,0.85)', 1.4);
	}
	circle(ctx, 146, 69, 7, '#DCE6F1', 1.8);
	ctx.strokeStyle = 'rgba(47,92,119,0.55)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(139, 69);
	ctx.lineTo(153, 69);
	ctx.moveTo(146, 62);
	ctx.lineTo(146, 76);
	ctx.stroke();

	rect(ctx, 160, 62, 30, 11, BLUE_DARK, 2, 1.6);
	ctx.fillStyle = '#D9F3FF';
	ctx.fillRect(164, 65, 8, 4);
	ctx.fillRect(176, 65, 4, 4);
	ctx.fillRect(182, 65, 4, 4);

	line(ctx, 130, 107, 196, 107, 'rgba(58,39,27,0.4)', 2.2);
	line(ctx, 196, 58, 196, 107, 'rgba(47,92,119,0.4)', 2.2);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Mirror head and arm on the A-pillar.
	line(ctx, 22, 136, 12, 131, INK, 3.4);
	line(ctx, 22, 136, 12, 131, STEEL, 2.2);
	rect(ctx, 6, 116, 18, 34, BLUE_DARK, 3, 2.4);
	if (shaded) {
		rect(ctx, 9, 120, 12, 26, GLASS, 1.4);
	}

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 36, 120, 92, 58);
		glassShade(ctx, SIDE_GLASS, 138, 124, 44, 54);
	}

	// Front bumper, under the cab nose.
	rect(ctx, 8, 244, 16, 6, '#4E5764', 1.5, 1.6);
	rect(ctx, 8, 249, 16, 19, CHROME, 3, 2.6);
	line(ctx, 10, 253, 22, 253, 'rgba(255,255,255,0.6)', 1.8);
	line(ctx, 10, 262, 22, 262, 'rgba(58,39,27,0.3)', 1.6);

	// Rear under-run and the chassis fittings between the axles.
	rect(ctx, 752, 246, 16, 20, CHROME, 1, 2.6);
	line(ctx, 754, 250, 766, 250, 'rgba(255,255,255,0.55)', 1.6);
	rect(ctx, 206, 242, 78, 17, CHROME, 4, 2.2);
	line(ctx, 214, 244, 214, 257, 'rgba(58,39,27,0.24)', 1.6);
	line(ctx, 220, 246, 276, 246, 'rgba(255,255,255,0.5)', 1.4);
	rect(ctx, 292, 244, 18, 14, '#4E5764', 2, 1.8);
	rect(ctx, 316, 246, 254, 12, CHROME, 3, 2.2);
	line(ctx, 322, 249, 564, 249, 'rgba(255,255,255,0.45)', 1.4);

	if (fitted) {
		// Headlamp, indicator, grille and wipers.
		circle(ctx, 34, 234, 8.5, LAMP, 2.4);
		circle(ctx, 34, 234, 4.4, '#FFF7CF', 1.5);
		rect(ctx, 28, 214, 9, 8, AMBER, 2, 1.6);
		rect(ctx, 26, 194, 10, 16, STEEL, 2, 2);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 27, 194 + bar * 4, 35, 194 + bar * 4, CHROME, 1.5);
		}
		line(ctx, 54, 176, 74, 158, INK, 2.2);
		line(ctx, 86, 176, 102, 162, INK, 2);

		// Sun visor over the screen and the folding step under the door.
		rect(ctx, 30, 112, 100, 6, BLUE_DARK, 2.5, 2);
		rect(ctx, 90, 252, 26, 8, CHROME, 2, 2);
		line(ctx, 94, 256, 112, 256, 'rgba(58,39,27,0.4)', 1.4);

		// Side markers along the box waist band.
		for (const markerX of [238, 338, 648]) {
			rect(ctx, markerX, 210, 13, 6, AMBER, 1.5, 1.2);
		}

		// Tail lamps on the chassis under the rear doors.
		rect(ctx, 722, 242, 12, 14, RED, 2, 1.8);
		rect(ctx, 738, 242, 10, 10, AMBER, 1.5, 1.5);
	}

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
		ctx.moveTo(48, 111);
		ctx.lineTo(126, 107.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(200, 53.5);
		ctx.lineTo(738, 53.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(750.5, 66);
		ctx.lineTo(750.5, 234);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(34, 234, 1, 34, 234, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(34, 234, 30, 0, Math.PI * 2);
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
		// Paint grain over solid paint only: the glazing and tyres are punched out so they
		// stay clear.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
		ctx.clip(new Path2D(SHELL));
		ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');
		let seed = 47;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 420; i++) {
			const px = 30 + rand() * 716;
			const py = 56 + rand() * 190;
			const size = 1.4 + rand() * 1.1;
			ctx.globalAlpha = 0.09 + rand() * 0.05;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 150; i++) {
			const px = 30 + rand() * 716;
			const py = 56 + rand() * 190;
			const size = 1.2 + rand() * 0.9;
			ctx.globalAlpha = 0.2 + rand() * 0.1;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes across the cab flank, box panels and skirt.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[46, 118, 124, 116],
			[216, 82, 452, 80],
			[472, 150, 628, 148],
			[216, 178, 444, 176],
			[214, 214, 670, 212],
			[44, 236, 176, 234]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Panel sheen: a cool roof light falling down the insulated panels, a painted streak
		// along each panel run and a soft bounce under the waist band. Glass and tyres stay
		// clear so the same finish lands on both wheel tiles.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');
		const roofSheen = ctx.createLinearGradient(0, 58, 0, 112);
		roofSheen.addColorStop(0, 'rgba(255,255,255,0.32)');
		roofSheen.addColorStop(0.55, 'rgba(255,255,255,0.09)');
		roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = roofSheen;
		ctx.fillRect(198, 58, 552, 54);

		const cabSheen = ctx.createLinearGradient(0, 106, 0, 156);
		cabSheen.addColorStop(0, 'rgba(255,255,255,0.32)');
		cabSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = cabSheen;
		ctx.fillRect(24, 106, 174, 50);

		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 3;
		for (const [sx, sy, ex, ey] of [
			[216, 68, 668, 66],
			[210, 190, 674, 188],
			[50, 232, 178, 230]
		]) {
			ctx.globalAlpha = 0.28;
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
			ctx.stroke();
		}
		ctx.globalAlpha = 0.2;
		ctx.strokeStyle = GLASS;
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(208, 200);
		ctx.quadraticCurveTo(442, 203, 676, 198);
		ctx.stroke();
		ctx.restore();

		// Chiller casing sheen: bright top bevel, cool falloff over the louvre bank and
		// bright inner edges, so the box front reads as moulded plastic rather than a flat
		// rectangle.
		ctx.save();
		ctx.beginPath();
		ctx.rect(CHILLER.x, CHILLER.y, CHILLER.w, CHILLER.h);
		ctx.clip();
		const chillerFace = ctx.createLinearGradient(0, CHILLER.y, 0, CHILLER.y + CHILLER.h);
		chillerFace.addColorStop(0, 'rgba(255,255,255,0.5)');
		chillerFace.addColorStop(0.42, 'rgba(255,255,255,0.08)');
		chillerFace.addColorStop(1, 'rgba(47,92,119,0.14)');
		ctx.fillStyle = chillerFace;
		ctx.fillRect(CHILLER.x, CHILLER.y, CHILLER.w, CHILLER.h);
		ctx.strokeStyle = 'rgba(255,255,255,0.8)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(CHILLER.x + 2.5, 101);
		ctx.lineTo(CHILLER.x + 2.5, CHILLER.y + 8);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(CHILLER.x + 6, 103.5);
		ctx.lineTo(CHILLER.x + CHILLER.w - 6, 103.5);
		ctx.stroke();
		ctx.restore();

		// Glints clear of the glass and the tyre circles.
		glint(ctx, 402, 132, 6.4);
		glint(ctx, 566, 172, 5.6);
		glint(ctx, 234, 88, 5.2);
		glint(ctx, 74, 112, 5);
		glint(ctx, 664, 108, 5);
		glint(ctx, 288, 146, 4.2);
		glint(ctx, 188, 84, 3.6);
		glint(ctx, 540, 112, 3.8);
		glint(ctx, 726, 92, 3.4);

		// Glass sheen and a sparkle in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(54, 168);
		ctx.lineTo(92, 125);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(148, 168);
		ctx.lineTo(172, 132);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 164, 140, 3.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Finishing marks: roof rail highlight and rivets, bumper lip, door bar sheen,
		// chiller fasteners, mudguard crowns and rear-door hardware.
		line(ctx, 206, 55, 700, 55, 'rgba(255,255,255,0.5)', 2);
		line(ctx, 10, 246, 22, 246, 'rgba(255,255,255,0.75)', 1.8);
		line(ctx, 476, 136, 476, 174, 'rgba(255,255,255,0.4)', 1.6);

		ctx.save();
		ctx.fillStyle = CHROME;
		ctx.globalAlpha = 0.7;
		for (let rivetX = 214; rivetX <= 700; rivetX += 32) {
			ctx.beginPath();
			ctx.arc(rivetX, 55, 1.5, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		circle(ctx, 133.5, 61.5, 1.6, CHROME, 1);
		circle(ctx, 192.5, 61.5, 1.6, CHROME, 1);

		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 9.4, Math.PI * 1.16, Math.PI * 1.84);
			ctx.stroke();
		}

		for (const rodX of [REAR_DOOR.x + 15, REAR_DOOR.x + 51]) {
			line(
				ctx,
				rodX - 1,
				REAR_DOOR.y + 9,
				rodX - 1,
				REAR_DOOR.y + REAR_DOOR.h - 11,
				'rgba(255,255,255,0.55)',
				1.2
			);
			line(ctx, rodX - 7, 143, rodX + 7, 143, 'rgba(255,255,255,0.5)', 1.2);
		}

		for (const hy of [119.5, 153.5, 187.5]) {
			circle(ctx, DOOR.x + 4.5, hy, 1.5, CHROME, 1);
		}

		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(288, 146, 22.5, Math.PI * 1.06, Math.PI * 1.62);
		ctx.stroke();
	}

	ctx.restore();
}

export function drawRealRefrigeratedTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealRefrigeratedTruckLevel(ctx, x, y, scale, 5);
}
