/**
 * Removals van art, cut into the same five-piece kit as the other realistic vehicles.
 * A luton-style removals van facing left: a compact green cab under a tall box body that
 * runs forward over the cab as a cream-fronted luton pod, a rear roller shutter, a
 * blanket-wrapped sofa and rolled rug with a hanging label, a roof rail, cream mudguards
 * and lamps. Level 5 is the production target: shaded, fitted, lit and picture-book
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

const GREEN = '#6A994E';
const GREEN_DARK = '#4E7338';
const GREEN_DEEP = '#3A5629';
const CREAM = '#F2E8CF';
const CREAM_LIGHT = '#FAF3E1';
const CREAM_SHADE = '#E0D2B2';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const TAIL = '#FF4D6D';

/** Art box 780 x 360, road at 272. Front (cab) faces left. */
const SHELL =
	'M24,258 L24,124 Q24,106 42,102 L112,102 L112,34 Q112,32 118,32 L744,32 Q756,32 756,44 L756,240 L196,240 L196,258 Z';

// The spec body mask is this shell plus the underbody band, the roof rail, the mirror head
// on the A-pillar and the front bumper, step and rear under-run. Subpaths only touch,
// never overlap, so the evenodd clip cannot punch a hole. The wheel circles stay out of
// the mask; they come from the wheel tiles.
const UNDERBODY = 'M196,240 L756,240 L756,258 L196,258 Z';
const ROOF_RAIL = 'M214,18 L742,18 L742,26 L214,26 Z';
const RAIL_POST_A = 'M226,26 L234,26 L234,32 L226,32 Z';
const RAIL_POST_B = 'M722,26 L730,26 L730,32 L722,32 Z';
const MIRROR_HEAD = 'M6,112 L24,112 L24,148 L6,148 Z';
const FRONT_BUMPER = 'M8,244 L24,244 L24,266 L8,266 Z';
const CAB_STEP = 'M94,258 L126,258 L126,268 L94,268 Z';
const REAR_UNDER_RUN = 'M756,246 L770,246 L770,264 L756,264 Z';

/** Cream corner cap and lip for the luton pod over the cab. */
const POD_LIP = { x: 112, y: 94, w: 84, h: 7 };

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Raked windscreen panes: the front screen and the cab side pane behind it. */
const WINDSCREEN = pane(36, 112, 96, 62, 9);
const SIDE_GLASS = pane(140, 110, 46, 48, 5);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Side loading door on the box flank: a clean rectangle, clear of every glass pane. */
const DOOR = { x: 470, y: 94, w: 92, h: 114 };

/** Rear roller shutter bay at the right-hand end of the box. */
const SHUTTER = { x: 668, y: 52, w: 88, h: 172 };

/** Cream waist band, carried across the cab and the box. */
const WAIST = { y: 208, h: 18 };

/**
 * Blanket-wrapped sofa in side view, back to the rear, with its two binding straps and a
 * hanging label. This is the cue that names the vehicle, so the outline lands at level 1
 * and only the hardware waits for level 3.
 */
const SOFA = {
	path: 'M216,152 L216,108 Q216,96 234,96 Q250,96 254,108 L254,114 L302,114 L302,76 Q302,64 316,64 Q340,64 348,78 L348,152 Z',
	straps: [250, 320],
	tag: { x: 352, y: 86, w: 30, h: 24 }
};

/** Rolled rug lying under the wrapped sofa, its spiral end facing the rear. */
const RUG = { x: 212, y: 160, w: 132, h: 36 };
const RUG_END = { x: RUG.x + RUG.w - 18, y: RUG.y + RUG.h / 2 };

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

/** The wrapped sofa, its binding straps and the luggage label hanging off the back. */
function blanketLoad(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	// Wrapped sofa: a solid cream lump, so the load reads at game scale.
	const sofa = new Path2D(SOFA.path);
	ctx.fillStyle = CREAM;
	ctx.fill(sofa);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(sofa);

	// Blanket folds: a quilted crown, a seam down the arm and the seat crease.
	line(ctx, 308, 82, 340, 76, 'rgba(78,115,56,0.55)', 1.8);
	line(ctx, 222, 106, 248, 104, 'rgba(78,115,56,0.45)', 1.6);
	line(ctx, 258, 114, 298, 114, 'rgba(78,115,56,0.55)', 1.6);
	line(ctx, 220, 142, 342, 142, 'rgba(58,39,27,0.22)', 1.6);

	// Binding straps with buckles.
	for (const strapX of SOFA.straps) {
		const top = strapX < 280 ? 98 : 66;
		line(ctx, strapX, top, strapX, 150, GREEN_DARK, 4);
		line(ctx, strapX, top, strapX, 150, GREEN, 2.4);
		if (fitted) {
			rect(ctx, strapX - 5, 116, 10, 9, CHROME, 1.5, 1.4);
			line(ctx, strapX - 2.4, 119, strapX + 2.4, 119, 'rgba(58,39,27,0.4)', 1.1);
		}
	}

	// Hanging luggage label on its string.
	line(ctx, 346, 84, SOFA.tag.x + 2, SOFA.tag.y + 4, INK, 1.6);
	rect(ctx, SOFA.tag.x, SOFA.tag.y, SOFA.tag.w, SOFA.tag.h, CREAM, 2.4, 2.2);
	if (fitted) {
		circle(ctx, SOFA.tag.x + 5, SOFA.tag.y + 5, 1.8, GREEN_DARK, 1);
		line(
			ctx,
			SOFA.tag.x + 9,
			SOFA.tag.y + 8,
			SOFA.tag.x + 26,
			SOFA.tag.y + 8,
			'rgba(58,39,27,0.55)',
			1.3
		);
		line(
			ctx,
			SOFA.tag.x + 9,
			SOFA.tag.y + 14,
			SOFA.tag.x + 22,
			SOFA.tag.y + 14,
			'rgba(58,39,27,0.4)',
			1.1
		);
		line(
			ctx,
			SOFA.tag.x + 9,
			SOFA.tag.y + 19,
			SOFA.tag.x + 18,
			SOFA.tag.y + 19,
			'rgba(58,39,27,0.3)',
			1
		);
	}

	// Rolled rug: a solid cream capsule, two straps and the spiral end.
	rect(ctx, RUG.x, RUG.y, RUG.w, RUG.h, CREAM, RUG.h / 2, 2.8);
	line(ctx, RUG.x + 12, RUG.y + 7, RUG_END.x, RUG.y + 7, 'rgba(78,115,56,0.45)', 1.6);
	for (const strapX of [250, 292]) {
		line(ctx, strapX, RUG.y + 1, strapX, RUG.y + RUG.h - 1, GREEN_DARK, 3.4);
		line(ctx, strapX, RUG.y + 1, strapX, RUG.y + RUG.h - 1, GREEN, 2);
	}
	ctx.strokeStyle = GREEN_DARK;
	for (const radius of [15, 9.5, 4.5]) {
		ctx.lineWidth = radius > 11 ? 2 : 1.6;
		ctx.beginPath();
		ctx.arc(RUG_END.x, RUG_END.y, radius, Math.PI * 0.2, Math.PI * 1.75);
		ctx.stroke();
	}
	circle(ctx, RUG_END.x, RUG_END.y, 1.5, GREEN_DARK, 1);
}

/** Rear roller shutter: drum, horizontal slats, guide rails, bottom bar and latch. */
function rearShutter(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	// Roll drum across the top of the bay.
	rect(ctx, SHUTTER.x, SHUTTER.y - 4, SHUTTER.w, 8, STEEL, 2, 2.2);
	line(
		ctx,
		SHUTTER.x + 3,
		SHUTTER.y - 1.4,
		SHUTTER.x + SHUTTER.w - 3,
		SHUTTER.y - 1.4,
		'rgba(255,255,255,0.42)',
		1.4
	);

	rect(ctx, SHUTTER.x + 6, SHUTTER.y, SHUTTER.w - 12, SHUTTER.h, GREEN_DEEP, 0, 0);

	// Horizontal slats, each dark groove under a lit lip.
	for (let slatY = SHUTTER.y + 6; slatY < SHUTTER.y + SHUTTER.h - 14; slatY += 8.5) {
		line(
			ctx,
			SHUTTER.x + 7,
			slatY,
			SHUTTER.x + SHUTTER.w - 7,
			slatY,
			'rgba(16,26,10,0.5)',
			2.2
		);
		if (shaded) {
			line(
				ctx,
				SHUTTER.x + 7,
				slatY + 2.2,
				SHUTTER.x + SHUTTER.w - 7,
				slatY + 2.2,
				'rgba(242,232,207,0.22)',
				1.4
			);
		}
	}

	// Side guide rails.
	rect(ctx, SHUTTER.x, SHUTTER.y, 7, SHUTTER.h, STEEL, 1.6, 2);
	rect(ctx, SHUTTER.x + SHUTTER.w - 7, SHUTTER.y, 7, SHUTTER.h, STEEL, 1.6, 2);
	line(
		ctx,
		SHUTTER.x + 2,
		SHUTTER.y + 4,
		SHUTTER.x + 2,
		SHUTTER.y + SHUTTER.h - 4,
		'rgba(255,255,255,0.32)',
		1.3
	);
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

/** Side loading door: cream leaf, green livery stripe, hinges and latch bar. */
function loadingDoor(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, CREAM_SHADE, 3, 2.8);
	rect(ctx, DOOR.x + 6, DOOR.y + 6, DOOR.w - 12, DOOR.h - 12, CREAM, 2, 2);
	rect(ctx, DOOR.x + 6, DOOR.y + 40, DOOR.w - 12, 12, GREEN, 0, 0);
	line(ctx, DOOR.x + 6, DOOR.y + 10, DOOR.x + DOOR.w - 6, DOOR.y + 10, 'rgba(58,39,27,0.16)', 1.6);

	if (shaded) {
		line(
			ctx,
			DOOR.x + 8,
			DOOR.y + 42,
			DOOR.x + DOOR.w - 8,
			DOOR.y + 42,
			'rgba(255,255,255,0.34)',
			1.2
		);
		line(
			ctx,
			DOOR.x + 8,
			DOOR.y + 49.4,
			DOOR.x + DOOR.w - 8,
			DOOR.y + 49.4,
			'rgba(58,39,27,0.28)',
			1.4
		);
	}

	if (fitted) {
		for (const hingeY of [DOOR.y + 18, DOOR.y + 58, DOOR.y + 92]) {
			rect(ctx, DOOR.x + 1, hingeY, 7, 13, STEEL, 2, 1.6);
		}

		rect(ctx, DOOR.x + DOOR.w - 18, DOOR.y + 30, 9, 30, CHROME, 3, 2.2);
		rect(ctx, DOOR.x + DOOR.w - 30, DOOR.y + 42, 11, 5, STEEL, 1.5, 1.4);
		rect(ctx, DOOR.x + 6, DOOR.y + DOOR.h - 18, DOOR.w - 12, 9, STEEL, 2, 1.6);
		line(
			ctx,
			DOOR.x + 10,
			DOOR.y + DOOR.h - 13.5,
			DOOR.x + DOOR.w - 10,
			DOOR.y + DOOR.h - 13.5,
			'rgba(255,255,255,0.4)',
			1.2
		);
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

	ctx.fillStyle = CREAM_LIGHT;
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
	// Shaded sidewall well and the tread shoulder catching the roof light.
	ctx.strokeStyle = 'rgba(0,0,0,0.22)';
	ctx.lineWidth = 4.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.79, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.95, Math.PI * 1.16, Math.PI * 1.84);
	ctx.stroke();

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

	// A finer inner gloss keeps the sidewall reading as a rounded torus.
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 1.6;
	for (const [from, to] of [
		[Math.PI * 1.14, Math.PI * 1.42],
		[Math.PI * 1.58, Math.PI * 1.86]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.73, from, to);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(58,39,27,0.32)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.56, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.445, 0, Math.PI * 2);
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
		ctx.strokeStyle = 'rgba(58,39,27,0.3)';
		ctx.lineWidth = 1.1;
		ctx.beginPath();
		ctx.arc(bx, by, 2.9, Math.PI * 0.2, Math.PI * 0.9);
		ctx.stroke();

		// Short spoke shadow behind each nut, tying the bolts to the rim.
		ctx.strokeStyle = 'rgba(58,39,27,0.18)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(a) * r * 0.36, y + Math.sin(a) * r * 0.36);
		ctx.lineTo(x + Math.cos(a) * r * 0.43, y + Math.sin(a) * r * 0.43);
		ctx.stroke();
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

	// Twin specular pips on the rim shoulders, plus the valve stem.
	ctx.fillStyle = '#FFFFFF';
	for (const a of [Math.PI * 1.2, Math.PI * 1.8]) {
		ctx.beginPath();
		ctx.arc(x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66, 1.2, 0, Math.PI * 2);
		ctx.fill();
	}

	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
	line(ctx, x, y - r * 0.53, x, y - r * 0.64, CHROME, 2);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - 0.7, y - r * 0.55 - 0.7, 0.8, 0, Math.PI * 2);
	ctx.fill();
}

/** Paint grain over solid paint only: the glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	// Hand-mixed wash: warm cream into the roof, a deeper green into the skirt.
	const wash = ctx.createLinearGradient(170, 32, 700, 250);
	wash.addColorStop(0, 'rgba(255,246,214,0.1)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(20,34,12,0.14)');
	ctx.fillStyle = wash;
	ctx.fillRect(24, 32, 732, 226);

	let seed = 61;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	// Broad, barely-there mottling gives the flat paint a hand-mixed depth.
	const mottle: Array<[number, number, number, number, string]> = [
		[178, 56, 66, 15, '#FFFFFF'],
		[312, 128, 96, 20, '#FFFFFF'],
		[502, 116, 74, 16, GREEN_DEEP],
		[694, 166, 62, 17, '#FFFFFF'],
		[268, 226, 88, 14, GREEN_DEEP],
		[82, 206, 50, 13, '#FFFFFF'],
		[620, 68, 76, 13, '#FFFFFF']
	];
	for (const [mx, my, mrx, mry, tone] of mottle) {
		ctx.globalAlpha = 0.05;
		ctx.fillStyle = tone;
		ctx.beginPath();
		ctx.ellipse(mx, my, mrx, mry, 0, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.fillStyle = INK;
	for (let i = 0; i < 540; i++) {
		const px = 30 + rand() * 726;
		const py = 36 + rand() * 218;
		const size = 1.4 + rand() * 1.1;
		ctx.globalAlpha = 0.1 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 200; i++) {
		const px = 30 + rand() * 726;
		const py = 36 + rand() * 218;
		const size = 1.2 + rand() * 0.9;
		ctx.globalAlpha = 0.16 + rand() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// Dry-brush flecks catching the light along the skirt.
	ctx.fillStyle = CREAM_LIGHT;
	for (let i = 0; i < 120; i++) {
		const px = 30 + rand() * 716;
		const py = 208 + rand() * 44;
		ctx.globalAlpha = 0.07 + rand() * 0.07;
		ctx.fillRect(px, py, 2 + rand() * 5, 1.1);
	}

	// Long brush strokes across the pod, cab flank, box panels and skirt.
	ctx.globalAlpha = 0.13;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[132, 54, 184, 52],
		[44, 138, 110, 136],
		[164, 46, 188, 46],
		[206, 70, 430, 68],
		[206, 104, 300, 103],
		[576, 96, 660, 95],
		[206, 190, 444, 188],
		[576, 186, 662, 185],
		[42, 240, 150, 238],
		[482, 74, 548, 73],
		[606, 214, 656, 213]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest.
	ctx.globalAlpha = 0.18;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[54, 232, 96, 230],
		[228, 236, 280, 235],
		[596, 214, 654, 213],
		[716, 92, 748, 91],
		[124, 66, 168, 65],
		[486, 196, 528, 195],
		[700, 130, 742, 129]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Panel sheen: roof light down the box and cab, a wet gloss on the flank and the pod. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	const roofSheen = ctx.createLinearGradient(0, 32, 0, 96);
	roofSheen.addColorStop(0, 'rgba(255,255,255,0.3)');
	roofSheen.addColorStop(0.5, 'rgba(255,255,255,0.08)');
	roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = roofSheen;
	ctx.fillRect(112, 32, 644, 64);

	const cabSheen = ctx.createLinearGradient(0, 102, 0, 166);
	cabSheen.addColorStop(0, 'rgba(255,255,255,0.28)');
	cabSheen.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cabSheen;
	ctx.fillRect(24, 102, 172, 64);

	// Broad diagonal gloss across the plain stretch between the door and the shutter.
	const flankSheen = ctx.createLinearGradient(566, 56, 664, 200);
	flankSheen.addColorStop(0, 'rgba(255,246,214,0)');
	flankSheen.addColorStop(0.4, 'rgba(255,246,214,0.18)');
	flankSheen.addColorStop(0.7, 'rgba(255,246,214,0.06)');
	flankSheen.addColorStop(1, 'rgba(255,246,214,0)');
	ctx.fillStyle = flankSheen;
	ctx.fillRect(562, 52, 106, 156);

	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 3;
	for (const [sx, sy, ex, ey] of [
		[204, 58, 662, 56],
		[204, 198, 452, 196],
		[576, 172, 660, 170],
		[46, 224, 152, 222],
		[124, 62, 190, 60],
		[236, 176, 330, 174],
		[484, 88, 552, 86]
	]) {
		ctx.globalAlpha = 0.24;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}

	// A second, narrower gloss catches the sky behind the cab.
	const cabStreak = ctx.createLinearGradient(24, 120, 120, 220);
	cabStreak.addColorStop(0, 'rgba(255,255,255,0)');
	cabStreak.addColorStop(0.48, 'rgba(255,255,255,0.13)');
	cabStreak.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cabStreak;
	ctx.fillRect(26, 106, 108, 132);
	ctx.restore();
}

/** Luton pod sheen: the green front, cream corner cap, corn cap and lip in window light. */
function lutonSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Green pod front: vertical gloss with a warm bounce off the cream lip.
	const pod = ctx.createLinearGradient(0, 32, 0, 94);
	pod.addColorStop(0, 'rgba(255,255,255,0.3)');
	pod.addColorStop(0.38, 'rgba(255,255,255,0.05)');
	pod.addColorStop(0.86, 'rgba(20,34,12,0.06)');
	pod.addColorStop(1, 'rgba(20,34,12,0.2)');
	ctx.fillStyle = pod;
	ctx.fillRect(119, 32, 77, 62);

	// Cream corn cap and corner post take a wet highlight.
	const cap = ctx.createLinearGradient(112, 0, 196, 0);
	cap.addColorStop(0, 'rgba(255,255,255,0.5)');
	cap.addColorStop(0.6, 'rgba(255,255,255,0.06)');
	cap.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = cap;
	ctx.fillRect(112, 32, 84, 5);
	ctx.fillStyle = 'rgba(255,255,255,0.18)';
	ctx.fillRect(112, 34, 7, 62);

	line(ctx, 113, 33.4, 194, 33.4, 'rgba(255,255,255,0.7)', 1.4);
	line(ctx, 119, 37.6, 194, 37.6, 'rgba(20,34,12,0.26)', 1.4);
	line(ctx, 115.4, 42, 115.4, 92, 'rgba(255,255,255,0.45)', 1.6);

	// Cream lip: gloss along the band, dark joint above, bounce below.
	const lip = ctx.createLinearGradient(0, POD_LIP.y, 0, POD_LIP.y + POD_LIP.h);
	lip.addColorStop(0, 'rgba(255,255,255,0.34)');
	lip.addColorStop(0.55, 'rgba(255,255,255,0.04)');
	lip.addColorStop(1, 'rgba(58,39,27,0.14)');
	ctx.fillStyle = lip;
	ctx.fillRect(POD_LIP.x, POD_LIP.y, POD_LIP.w, POD_LIP.h);
	line(ctx, 114, POD_LIP.y + 0.8, 194, POD_LIP.y + 0.8, 'rgba(255,255,255,0.62)', 1.2);
	line(
		ctx,
		114,
		POD_LIP.y + POD_LIP.h - 0.6,
		194,
		POD_LIP.y + POD_LIP.h - 0.6,
		'rgba(58,39,27,0.34)',
		1.3
	);

	// Warm light dropped from the lip onto the cab roof just behind it.
	line(ctx, 118, 102.4, 193, 102.4, 'rgba(255,246,214,0.3)', 2);
	ctx.restore();
}

/** The wrapped sofa catches the window light: lit crown, shaded flank, tag top edge. */
function motifSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SOFA.path));
	const sheen = ctx.createLinearGradient(216, 62, 348, 152);
	sheen.addColorStop(0, 'rgba(255,252,240,0.4)');
	sheen.addColorStop(0.44, 'rgba(255,248,228,0.08)');
	sheen.addColorStop(1, 'rgba(58,39,27,0.16)');
	ctx.fillStyle = sheen;
	ctx.fillRect(210, 58, 144, 100);

	// Quilted crown: a lit ridge over the high back and a warm seat bounce.
	ctx.strokeStyle = 'rgba(255,253,244,0.72)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(304, 67);
	ctx.quadraticCurveTo(324, 65, 344, 78);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,252,238,0.5)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(220, 104);
	ctx.quadraticCurveTo(238, 99, 254, 106);
	ctx.stroke();

	const seatBounce = ctx.createRadialGradient(300, 132, 4, 300, 132, 52);
	seatBounce.addColorStop(0, 'rgba(255,252,238,0.26)');
	seatBounce.addColorStop(1, 'rgba(255,252,238,0)');
	ctx.fillStyle = seatBounce;
	ctx.fillRect(252, 108, 96, 44);

	// The near edge falls away into shade, and the back stile holds a soft shade.
	const frontShade = ctx.createLinearGradient(216, 0, 232, 0);
	frontShade.addColorStop(0, 'rgba(58,39,27,0.2)');
	frontShade.addColorStop(1, 'rgba(58,39,27,0)');
	ctx.fillStyle = frontShade;
	ctx.fillRect(216, 96, 18, 56);
	ctx.fillStyle = 'rgba(58,39,27,0.12)';
	ctx.fillRect(340, 78, 8, 74);

	// Short fold creases so the blanket reads as cloth, not a solid lump.
	ctx.strokeStyle = 'rgba(58,39,27,0.16)';
	ctx.lineWidth = 1.2;
	for (const [sx, sy, mx, my, ex, ey] of [
		[262, 116, 270, 120, 278, 117],
		[288, 106, 296, 111, 304, 108],
		[314, 94, 322, 98, 330, 95],
		[236, 128, 242, 134, 249, 130],
		[300, 126, 308, 132, 316, 128]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo(mx, my, ex, ey);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(255,252,235,0.62)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(220, 116);
	ctx.quadraticCurveTo(262, 100, 300, 106);
	ctx.stroke();
	ctx.restore();

	// Binding straps catch a lit edge; the buckles keep a specular pip.
	for (const strapX of SOFA.straps) {
		const top = strapX < 280 ? 98 : 66;
		line(ctx, strapX - 1.5, top + 2, strapX - 1.5, 148, 'rgba(255,255,255,0.42)', 1.2);
		line(ctx, strapX + 1.4, top + 2, strapX + 1.4, 148, 'rgba(20,34,12,0.24)', 1);
		circle(ctx, strapX - 2.6, 118.4, 1.1, '#FFFDF2', 0.8);
	}

	// Rug: a lengthwise gloss, a lit top edge and a shadow where it meets the waist band.
	line(ctx, 232, RUG.y + 4.4, 312, RUG.y + 4.4, 'rgba(255,255,255,0.42)', 2.4);
	line(ctx, 236, RUG.y + 2, 316, RUG.y + 2, 'rgba(255,255,255,0.62)', 1.8);
	line(ctx, 222, RUG.y + RUG.h - 2, 318, RUG.y + RUG.h - 2, 'rgba(58,39,27,0.22)', 1.6);
	line(ctx, 228, RUG.y + RUG.h - 5.4, 310, RUG.y + RUG.h - 5.4, 'rgba(255,247,224,0.22)', 2);
	line(ctx, 218, RUG.y + RUG.h + 1.6, 326, RUG.y + RUG.h + 1.6, 'rgba(20,34,12,0.28)', 2);

	// Spiral end: a bright outer turn and a darker inner turn give it depth.
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(RUG_END.x, RUG_END.y, 12, Math.PI * 1.05, Math.PI * 1.7);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(58,39,27,0.22)';
	ctx.lineWidth = 1.1;
	ctx.beginPath();
	ctx.arc(RUG_END.x, RUG_END.y, 7.6, Math.PI * 0.15, Math.PI * 0.8);
	ctx.stroke();
	circle(ctx, RUG_END.x - 8.2, RUG_END.y - 8.2, 1.2, '#FFFDF2', 0.8);

	// Rug straps: lit leading edge on each band.
	for (const strapX of [250, 292]) {
		line(ctx, strapX - 1.3, RUG.y + 2, strapX - 1.3, RUG.y + RUG.h - 2, 'rgba(255,255,255,0.34)', 1);
	}

	// Tag: lit top edge so it reads as a separate slip, shaded foot and string glint.
	line(
		ctx,
		SOFA.tag.x + 3,
		SOFA.tag.y + 2,
		SOFA.tag.x + SOFA.tag.w - 3,
		SOFA.tag.y + 2,
		'rgba(255,255,255,0.6)',
		1.2
	);
	line(
		ctx,
		SOFA.tag.x + 3,
		SOFA.tag.y + SOFA.tag.h - 1.6,
		SOFA.tag.x + SOFA.tag.w - 3,
		SOFA.tag.y + SOFA.tag.h - 1.6,
		'rgba(58,39,27,0.24)',
		1.4
	);
	line(ctx, 347, 85, SOFA.tag.x + 5, SOFA.tag.y + 6, 'rgba(255,255,255,0.42)', 1);
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
	gloss.addColorStop(0.4, 'rgba(255,255,255,0.1)');
	gloss.addColorStop(0.56, 'rgba(255,255,255,0.2)');
	gloss.addColorStop(0.74, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(field.x, field.y, field.w, field.h);

	// A narrower second reflection runs across the main gloss.
	const reflection = ctx.createLinearGradient(
		field.x + field.w,
		field.y + field.h * 0.18,
		field.x,
		field.y + field.h * 0.92
	);
	reflection.addColorStop(0, 'rgba(255,255,255,0)');
	reflection.addColorStop(0.46, 'rgba(255,255,255,0)');
	reflection.addColorStop(0.54, 'rgba(255,255,255,0.14)');
	reflection.addColorStop(0.6, 'rgba(255,255,255,0)');
	ctx.fillStyle = reflection;
	ctx.fillRect(field.x, field.y, field.w, field.h);

	// The bay sits back under the drum and darkens behind the bottom bar.
	const depth = ctx.createLinearGradient(0, field.y, 0, field.y + field.h);
	depth.addColorStop(0, 'rgba(16,26,10,0.3)');
	depth.addColorStop(0.14, 'rgba(16,26,10,0)');
	depth.addColorStop(0.8, 'rgba(16,26,10,0.06)');
	depth.addColorStop(1, 'rgba(16,26,10,0.32)');
	ctx.fillStyle = depth;
	ctx.fillRect(field.x, field.y, field.w, field.h);

	ctx.strokeStyle = '#EFF6DF';
	ctx.lineWidth = 1.5;
	let slatIndex = 0;
	for (let slatY = SHUTTER.y + 6; slatY < SHUTTER.y + SHUTTER.h - 14; slatY += 8.5) {
		ctx.globalAlpha = slatIndex % 2 === 0 ? 0.34 : 0.22;
		ctx.beginPath();
		ctx.moveTo(field.x + 1, slatY + 2.4);
		ctx.lineTo(field.x + field.w - 1, slatY + 2.4);
		ctx.stroke();
		slatIndex++;
	}
	ctx.restore();

	// Drum end caps and a bright lip along the roll.
	circle(ctx, SHUTTER.x + 4, SHUTTER.y, 2.8, CHROME, 1.2);
	circle(ctx, SHUTTER.x + SHUTTER.w - 4, SHUTTER.y, 2.8, CHROME, 1.2);
	line(
		ctx,
		SHUTTER.x + 6,
		SHUTTER.y - 2.2,
		SHUTTER.x + SHUTTER.w - 6,
		SHUTTER.y - 2.2,
		'rgba(255,255,255,0.6)',
		1.2
	);

	line(ctx, SHUTTER.x + 2, 62, SHUTTER.x + 2, 216, 'rgba(255,255,255,0.42)', 1.4);
	line(ctx, SHUTTER.x + 9, 62, SHUTTER.x + 9, 216, 'rgba(255,255,255,0.34)', 2);
	line(ctx, SHUTTER.x + 4.6, 66, SHUTTER.x + 4.6, 210, 'rgba(255,255,255,0.2)', 1);
	line(
		ctx,
		SHUTTER.x + SHUTTER.w - 9,
		SHUTTER.y + 8,
		SHUTTER.x + SHUTTER.w - 9,
		SHUTTER.y + SHUTTER.h - 18,
		'rgba(255,255,255,0.22)',
		1.8
	);
	line(
		ctx,
		SHUTTER.x + SHUTTER.w - 4.6,
		SHUTTER.y + 12,
		SHUTTER.x + SHUTTER.w - 4.6,
		SHUTTER.y + SHUTTER.h - 22,
		'rgba(255,255,255,0.16)',
		1
	);
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
		SHUTTER.x + 8,
		SHUTTER.y + SHUTTER.h - 9.8,
		SHUTTER.x + SHUTTER.w - 8,
		SHUTTER.y + SHUTTER.h - 9.8,
		'rgba(58,39,27,0.2)',
		1.2
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

	// Bolt heads keep a sparkle so the rails read as hardware.
	ctx.fillStyle = '#FFFDF2';
	for (const [bx, by] of [
		[SHUTTER.x + 4, SHUTTER.y + 12.6],
		[SHUTTER.x + SHUTTER.w - 4, SHUTTER.y + SHUTTER.h - 29.4]
	]) {
		ctx.beginPath();
		ctx.arc(bx - 0.6, by - 0.7, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

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
		DOOR.y + 40.8,
		DOOR.x + DOOR.w - 7,
		DOOR.y + 40.8,
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
	line(ctx, 210, 19.6, 736, 19.6, 'rgba(255,255,255,0.55)', 1.6);
	line(ctx, 226.5, 27, 226.5, 31, 'rgba(255,255,255,0.65)', 1.4);
	line(ctx, 729.5, 27, 729.5, 31, 'rgba(255,255,255,0.65)', 1.4);

	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.7;
	for (let rivetX = 222; rivetX <= 734; rivetX += 32) {
		ctx.beginPath();
		ctx.arc(rivetX, 22, 1.5, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Bumper, step and under-run lips.
	line(ctx, 10, 246, 22, 246, 'rgba(255,255,255,0.75)', 1.8);
	line(ctx, 98, 262.5, 122, 262.5, 'rgba(255,255,255,0.45)', 1.3);
	line(ctx, 758, 249, 768, 249, 'rgba(255,255,255,0.7)', 1.6);

	// Lamp sparkles: headlamp, pod markers, side markers, tail lamps.
	ctx.fillStyle = '#FFFDF2';
	ctx.beginPath();
	ctx.arc(33.4, 227.4, 1.9, 0, Math.PI * 2);
	ctx.fill();
	for (const [markerX, markerY] of [
		[126, 68],
		[130, 52]
	]) {
		ctx.beginPath();
		ctx.arc(markerX + 2.6, markerY + 2.4, 1.1, 0, Math.PI * 2);
		ctx.fill();
	}
	for (const markerX of [248, 392, 586]) {
		ctx.beginPath();
		ctx.arc(markerX + 3.4, 215.4, 1.2, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.beginPath();
	ctx.arc(721, 247, 1.5, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(739, 248.4, 1.1, 0, Math.PI * 2);
	ctx.fill();

	// Mudguard rivets and the lit arch crowns.
	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		circle(ctx, wheelX, WHEEL_L.y - WHEEL_L.r - 9, 1.6, CHROME, 1);
		circle(ctx, wheelX - WHEEL_R.r - 8.6, WHEEL_L.y - 8, 1.3, CHROME, 0.9);
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 8.6, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
	}

	// Stone chips on the skirt, where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, chipR] of [
		[206, 236, 1.3],
		[268, 237, 1.1],
		[512, 236, 1.2],
		[60, 250, 1.2]
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
		[452, 235, 1.4],
		[586, 234, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Exhaust puff trailing from the tailpipe under the rear corner.
	ctx.save();
	ctx.globalAlpha = 0.36;
	ctx.fillStyle = '#D5DCE5';
	for (const [px, py, pr] of [
		[718, 266, 3.4],
		[726, 262, 3.9],
		[734, 268, 3]
	]) {
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export function drawRealRemovalsVanLevel(
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
	rect(ctx, 24, 240, 732, 18, '#6F7987', 0, 0);
	rect(ctx, 24, 240, 732, 3, '#8C96A4', 0, 0);
	rect(ctx, 24, 255, 732, 3, '#555D6A', 0, 0);

	// Cab, luton pod, box and lower skirt in one silhouette.
	shape(ctx, SHELL, GREEN);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Body paint: light roof, deep lower shade.
	if (shaded) {
		const boxPaint = ctx.createLinearGradient(0, 32, 0, 240);
		boxPaint.addColorStop(0, 'rgba(255,255,255,0.3)');
		boxPaint.addColorStop(0.16, 'rgba(255,255,255,0.06)');
		boxPaint.addColorStop(0.68, 'rgba(20,34,12,0.04)');
		boxPaint.addColorStop(1, 'rgba(20,34,12,0.24)');
		ctx.fillStyle = boxPaint;
		ctx.fillRect(112, 32, 644, 208);

		const cabPaint = ctx.createLinearGradient(0, 102, 0, 258);
		cabPaint.addColorStop(0, 'rgba(255,255,255,0.34)');
		cabPaint.addColorStop(0.3, 'rgba(255,255,255,0.06)');
		cabPaint.addColorStop(0.76, 'rgba(20,34,12,0.04)');
		cabPaint.addColorStop(1, 'rgba(20,34,12,0.2)');
		ctx.fillStyle = cabPaint;
		ctx.fillRect(24, 102, 172, 156);
	}

	// Rear shutter before the livery so the bands stop short of the bay.
	rearShutter(ctx, shaded, fitted);

	// The luton/box construction joint: the pod's underside carried along the box.
	if (shaded) {
		line(ctx, 196, 102, 754, 102, 'rgba(20,34,12,0.36)', 2);
		line(ctx, 196, 99.6, 754, 99.6, 'rgba(255,255,255,0.34)', 1.4);
	}

	// Fine vertical panel seams across the forward flank only: the door, the wordmark
	// stretch and the shutter bay stay plain.
	for (let seamX = 208; seamX <= 432; seamX += 32) {
		line(ctx, seamX, 40, seamX, 204, 'rgba(20,34,12,0.2)', 1.6);
		line(ctx, seamX + 1.6, 40, seamX + 1.6, 204, 'rgba(255,255,255,0.3)', 1.2);
	}
	if (shaded) {
		line(ctx, 200, 64, 664, 64, 'rgba(20,34,12,0.14)', 1.2);
		line(ctx, 200, 65.4, 664, 65.4, 'rgba(255,255,255,0.3)', 1.1);
	}

	// Livery: cream roof cap, luton pod corner and lip, cream cab roof.
	rect(ctx, 112, 32, 644, 5, CREAM, 0, 0);
	line(ctx, 112, 37, 754, 37, 'rgba(20,34,12,0.24)', 1.2);

	// The luton front corner cap and the cream lip under the pod overhang.
	rect(ctx, 112, 34, 7, 62, CREAM, 0, 0);
	rect(ctx, POD_LIP.x, POD_LIP.y, POD_LIP.w, POD_LIP.h, CREAM, 0, 0);
	line(ctx, 114.5, 40, 114.5, 92, 'rgba(255,255,255,0.5)', 1.4);
	line(ctx, 116, 96, 194, 96, 'rgba(255,255,255,0.45)', 1.4);

	// The cab roof, visible under the pod overhang, ties the cab to the box.
	rect(ctx, 44, 103, 152, 4, CREAM, 0, 0);
	line(ctx, 44, 107, 196, 107, 'rgba(20,34,12,0.2)', 1.2);

	rect(ctx, 200, WAIST.y, 468, WAIST.h, CREAM, 0, 0);
	line(ctx, 200, WAIST.y + 2.4, 668, WAIST.y + 2.4, 'rgba(255,255,255,0.42)', 1.4);
	line(ctx, 200, WAIST.y + WAIST.h, 668, WAIST.y + WAIST.h, 'rgba(20,34,12,0.3)', 1.6);

	rect(ctx, 26, WAIST.y, 170, WAIST.h, CREAM, 0, 0);
	line(ctx, 26, WAIST.y + 2.4, 196, WAIST.y + 2.4, 'rgba(255,255,255,0.42)', 1.4);

	// Cab door seam and the cab/box joint.
	line(ctx, 134, 106, 134, 252, 'rgba(20,34,12,0.4)', 2);
	line(ctx, 135.6, 110, 135.6, 248, 'rgba(255,255,255,0.3)', 1.1);

	line(ctx, 196, 102, 196, 240, 'rgba(20,34,12,0.4)', 2.2);
	line(ctx, 197.6, 104, 197.6, 238, 'rgba(255,255,255,0.4)', 1.2);

	// The removals cue: wrapped sofa, rolled rug and hanging label.
	blanketLoad(ctx, fitted);

	// Cream wordmark on the plain stretch between the door and the shutter.
	ctx.fillStyle = CREAM;
	ctx.font = '700 16px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('REMOVALS', 572, 128);

	loadingDoor(ctx, shaded, fitted);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Roof rail: two posts and the rail bar.
	shape(ctx, RAIL_POST_A, CREAM, 2);
	shape(ctx, RAIL_POST_B, CREAM, 2);
	shape(ctx, ROOF_RAIL, CREAM, 2.4);

	// Mirror head and arm on the A-pillar.
	line(ctx, 24, 132, 12, 126, INK, 3.4);
	line(ctx, 24, 132, 12, 126, STEEL, 2.2);
	rect(ctx, 6, 112, 18, 36, CREAM, 3, 2.4);
	if (shaded) {
		rect(ctx, 9, 116, 12, 28, GLASS, 1.4);
	}

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 36, 112, 96, 62);
		glassShade(ctx, SIDE_GLASS, 140, 110, 46, 48);
	}

	// Front bumper, under the cab nose, and the step below the cab door.
	rect(ctx, 8, 244, 16, 6, '#4E5764', 1.5, 1.6);
	rect(ctx, 8, 249, 16, 17, CHROME, 3, 2.6);
	line(ctx, 10, 253, 22, 253, 'rgba(255,255,255,0.6)', 1.8);
	line(ctx, 10, 262, 22, 262, 'rgba(58,39,27,0.3)', 1.6);

	rect(ctx, 94, 258, 32, 10, STEEL, 2, 2);
	line(ctx, 98, 262, 122, 262, 'rgba(255,255,255,0.4)', 1.3);

	// Rear under-run bumper.
	rect(ctx, 756, 246, 14, 18, CHROME, 2.5, 2.6);
	line(ctx, 758, 249, 768, 249, 'rgba(255,255,255,0.55)', 1.6);
	line(ctx, 758, 260, 768, 260, 'rgba(58,39,27,0.26)', 1.4);

	if (fitted) {
		// Cab front: grille, lamps and wipers.
		rect(ctx, 26, 182, 10, 18, STEEL, 2, 2);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 27, 182 + bar * 4.5, 35, 182 + bar * 4.5, CHROME, 1.4);
		}
		circle(ctx, 36, 230, 8.5, LAMP, 2.4);
		circle(ctx, 36, 230, 4.2, '#FFF7CF', 1.5);
		rect(ctx, 27, 204, 9, 8, AMBER, 2, 1.6);
		line(ctx, 54, 168, 80, 142, INK, 2.2);
		line(ctx, 86, 166, 104, 146, INK, 2);

		rect(ctx, 128, 95, 12, 5, AMBER, 1.2, 1);
		rect(ctx, 154, 95, 12, 5, AMBER, 1.2, 1);

		rect(ctx, 144, 196, 18, 6, CHROME, 2.5, 2);
		line(ctx, 146.5, 199, 160, 199, 'rgba(255,255,255,0.5)', 1.2);

		// Side markers along the waist band and the tail lamps on the chassis.
		for (const markerX of [248, 392, 586]) {
			rect(ctx, markerX, 213, 13, 6, AMBER, 1.5, 1.2);
		}
		rect(ctx, 714, 244, 13, 12, TAIL, 2, 1.8);
		rect(ctx, 731, 246, 9, 9, AMBER, 1.5, 1.5);
		rect(ctx, 742, 247, 10, 8, CREAM, 1.2, 1.3);

		// Tailpipe under the rear corner, feeding the level 5 puff.
		rect(ctx, 704, 251, 14, 5, STEEL, 1.5, 1.6);
	}

	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: cab roof, pod front edge, box roof, rear corner and nose.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(46, 103.2);
		ctx.lineTo(110, 103.2);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(113.4, 46);
		ctx.lineTo(113.4, 96);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(118, 33.5);
		ctx.lineTo(740, 33.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(754.5, 50);
		ctx.lineTo(754.5, 236);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(25.5, 132);
		ctx.lineTo(25.5, 250);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(36, 230, 1, 36, 230, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(36, 230, 30, 0, Math.PI * 2);
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
		lutonSheen(ctx);
		motifSheen(ctx);
		shutterSheen(ctx);
		doorSheen(ctx);

		// Glints, clear of glass, tyres, the motif linework and the shutter.
		glint(ctx, 446, 74, 5.4);
		glint(ctx, 408, 180, 5);
		glint(ctx, 600, 86, 4);
		glint(ctx, 582, 168, 4.6);
		glint(ctx, 232, 50, 4);
		glint(ctx, 76, 186, 5);
		glint(ctx, 656, 64, 3.6);
		glint(ctx, 162, 60, 4.2);
		glint(ctx, 640, 190, 4.4);
		glint(ctx, 480, 236, 3.4);
		glint(ctx, 352, 234, 3.2);

		// Glass sheen and a sparkle in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(52, 166);
		ctx.lineTo(78, 140);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(146, 152);
		ctx.lineTo(168, 120);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 168, 132, 3.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Finishing marks: rivets, lamp sparkles, mudguard crowns and the exhaust puff.
		finishingMarks(ctx);

		// Pod corner fasteners and the waist-band edge highlight.
		circle(ctx, 115.5, 44, 1.6, CHROME, 1);
		circle(ctx, 115.5, 86, 1.6, CHROME, 1);
		line(ctx, 206, 226.6, 664, 226.6, 'rgba(255,255,255,0.3)', 1.4);
	}

	ctx.restore();
}

export function drawRealRemovalsVan(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealRemovalsVanLevel(ctx, x, y, scale, 5);
}
