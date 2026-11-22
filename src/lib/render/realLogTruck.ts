/**
 * Timber lorry art, cut into the same five-piece kit as the other realistic vehicles.
 * A compact cab-over tractor unit pulls a low log bunk: heavy stakes, a tall headboard and a
 * stack of sawn timber with cut ends and bark, bound by chains. Livery #8B5E34 / #6B4226.
 * Front faces left; art box 800 x 380 with the road at 272.
 * Level 5 adds the picture-book finish: paint grain, bark grain, sawn end-grain rings,
 * chain and strap sheen, glints, hub detail and finishing marks.
 */

import { CHROME, GLASS, INK, STEEL, circle, line, rect, shape, wheel } from './realKit';

const PAINT = '#8B5E34';
const PAINT_DARK = '#6B4226';
const PAINT_DEEP = '#3E2716';
const CREAM = '#F7E9D2';
const AMBER = '#F2B450';
const LENS = '#FFF0B8';
const RED = '#D9544B';
const BARK = '#6E4827';
const BARK_LIGHT = '#A5794C';
const BARK_DARK = '#4A2E18';
const END_GRAIN = '#EFD3A6';
const RING = '#BE9160';

/** Cab shell: compact cab-over, flat roof and a near-vertical front. */
const CAB =
	'M46,252 L46,142 Q46,120 58,110 L72,100 Q80,92 94,92 L212,92 Q224,92 224,104 L224,252 Z';
/** Tall raked windscreen wrapping into the A-pillar. */
const WINDSCREEN =
	'M56,128 Q56,114 64,112 L128,112 Q134,112 134,118 L134,178 Q134,184 128,184 L62,184 Q56,184 56,178 Z';
/** Side glass, stopping above the door line so the two masks stay disjoint. */
const SIDE_WINDOW =
	'M146,114 L204,114 Q212,114 212,122 L212,152 Q212,158 206,158 L146,158 Q140,158 140,152 L140,120 Q140,114 146,114 Z';

const FRONT = { x: 150, y: 236, r: 36 };
const REAR = { x: 640, y: 236, r: 36 };

const DECK = { left: 230, right: 782, top: 186, bottom: 208 };
const HEADBOARD = { x: 228, y: 60, w: 28, h: 126 };
/** Most logs butt against the same sawn face just behind the headboard. */
const LOG_LEFT = 272;

interface LogRow {
	cy: number;
	r: number;
	right: number;
	left?: number;
}

/** Bottom row first: each log rests on the one below. */
const LOGS: LogRow[] = [
	{ cy: 167, r: 19, right: 772 },
	{ cy: 133, r: 18, right: 776 },
	{ cy: 102, r: 16, right: 752 },
	{ cy: 78, r: 11, right: 700, left: 292 }
];

const STAKE_X = [322, 448, 574, 700];
const STRAP_X = [396, 646];
const DOOR = { x: 142, y: 164, w: 76, h: 82 };

/** Rounded plank shape used for the bark body of one log. */
const logPath = (row: LogRow): string => {
	const { cy, r, right } = row;
	const left = row.left ?? LOG_LEFT;
	return `M${left + r},${cy - r} L${right - r},${cy - r} Q${right},${cy - r} ${right},${cy} Q${right},${cy + r} ${right - r},${cy + r} L${left + r},${cy + r} Q${left},${cy + r} ${left},${cy} Q${left},${cy - r} ${left + r},${cy - r} Z`;
};

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
	glass.addColorStop(0.45, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(96,176,226,0.28)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** One log: bark cylinder with a big sawn end face at the front of the stack. */
function drawLog(
	ctx: CanvasRenderingContext2D,
	row: LogRow,
	shaded: boolean,
	finish: boolean
): void {
	const { cy, r } = row;
	const left = row.left ?? LOG_LEFT;
	const path = logPath(row);

	shape(ctx, path, BARK, 2.8);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(path));
		const body = ctx.createLinearGradient(0, cy - r, 0, cy + r);
		body.addColorStop(0, 'rgba(255,255,255,0.3)');
		body.addColorStop(0.32, 'rgba(255,255,255,0.04)');
		body.addColorStop(1, 'rgba(16,8,2,0.42)');
		ctx.fillStyle = body;
		ctx.fillRect(left, cy - r, row.right - left, r * 2);
		ctx.restore();

		line(ctx, left + r, cy - r * 0.42, row.right - 12, cy - r * 0.42, BARK_LIGHT, 3);
		line(
			ctx,
			left + r + 8,
			cy + r * 0.56,
			row.right - 18,
			cy + r * 0.56,
			'rgba(58,34,14,0.55)',
			2.4
		);

		// Coarse bark streaks keep the stack reading as timber, not planks, at game scale.
		ctx.save();
		ctx.clip(new Path2D(path));
		let streakSeed = 7 + Math.round(cy * 3);
		const streakRnd = (): number => {
			streakSeed = (streakSeed * 9301 + 49297) % 233280;
			return streakSeed / 233280;
		};
		for (let i = 0; i < 7; i++) {
			const bx = left + 30 + streakRnd() * (row.right - left - 80);
			const by = cy - r * 0.15 + streakRnd() * (r * 0.7);
			const len = 12 + streakRnd() * 26;
			line(ctx, bx, by, bx + len, by - 1.6, 'rgba(52,30,12,0.26)', 2.2);
		}
		ctx.restore();
	}

	// Sawn end: bark collar, pale face and growth rings.
	const ex = left + 7;
	const rx = r * 0.8;
	ctx.save();
	ctx.beginPath();
	ctx.ellipse(ex, cy, rx, r - 0.8, 0, 0, Math.PI * 2);
	ctx.fillStyle = END_GRAIN;
	ctx.fill();
	ctx.strokeStyle = BARK_DARK;
	ctx.lineWidth = 4;
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.4;
	ctx.stroke();

	if (shaded) {
		ctx.beginPath();
		ctx.ellipse(ex, cy, rx, r - 0.8, 0, 0, Math.PI * 2);
		ctx.clip();
		const face = ctx.createLinearGradient(ex - rx, cy - r, ex + rx, cy + r);
		face.addColorStop(0, 'rgba(255,255,255,0.44)');
		face.addColorStop(0.55, 'rgba(255,255,255,0)');
		face.addColorStop(1, 'rgba(120,80,34,0.3)');
		ctx.fillStyle = face;
		ctx.fillRect(ex - rx, cy - r, rx * 2, r * 2);
	}

	ctx.strokeStyle = RING;
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.ellipse(ex, cy, rx * 0.64, (r - 2) * 0.62, 0, 0, Math.PI * 2);
	ctx.stroke();
	if (shaded) {
		ctx.beginPath();
		ctx.ellipse(ex, cy, rx * 0.32, r * 0.3, 0, 0, Math.PI * 2);
		ctx.stroke();
	}

	if (finish) {
		// Sapwood band just inside the bark collar, then finer growth rings.
		ctx.strokeStyle = 'rgba(230,201,154,0.9)';
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.ellipse(ex, cy, rx * 0.87, (r - 1.4) * 0.86, 0, 0, Math.PI * 2);
		ctx.stroke();

		const rings = [0.76, 0.56, 0.46, 0.24];
		for (let i = 0; i < rings.length; i++) {
			const k = rings[i];
			ctx.strokeStyle = i % 2 === 0 ? 'rgba(190,145,96,0.62)' : 'rgba(190,145,96,0.4)';
			ctx.lineWidth = 1.1;
			ctx.beginPath();
			ctx.ellipse(ex + 0.7 - i * 0.3, cy + 0.4, rx * k, (r - 2) * k * 0.94, 0.04, 0, Math.PI * 2);
			ctx.stroke();
		}

		// Two drying checks and a pale crescent where the sawn face catches light.
		ctx.strokeStyle = 'rgba(74,46,24,0.62)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(ex + rx * 0.12, cy - r * 0.18);
		ctx.lineTo(ex + rx * 0.72, cy - r * 0.5);
		ctx.moveTo(ex - rx * 0.16, cy + r * 0.26);
		ctx.lineTo(ex - rx * 0.62, cy + r * 0.52);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.ellipse(ex, cy, rx * 0.9, (r - 2) * 0.9, 0, Math.PI * 1.06, Math.PI * 1.4);
		ctx.stroke();
	}

	ctx.fillStyle = BARK_DARK;
	ctx.beginPath();
	ctx.arc(ex + 0.4, cy, Math.max(1.3, r * 0.1), 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(path));
		let seed = 11 + Math.round(cy);
		const rnd = (): number => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};

		// Pale lichen flecks and fine bark tooth along the lit top edge.
		for (let i = 0; i < 14; i++) {
			const bx = left + 26 + rnd() * (row.right - left - 52);
			const by = cy - r + 7 + rnd() * (r * 2 - 14);
			const len = 7 + rnd() * 16;
			line(ctx, bx, by, bx + len, by - 1.2, 'rgba(255,255,255,0.24)', 1.4);
		}

		// Dark fissures follow the length of the log, never across it.
		ctx.strokeStyle = 'rgba(46,26,10,0.34)';
		ctx.lineWidth = 1.3;
		for (let i = 0; i < 9; i++) {
			const bx = left + 24 + rnd() * (row.right - left - 80);
			const by = cy - r + 5 + rnd() * (r * 2 - 10);
			ctx.beginPath();
			ctx.moveTo(bx, by);
			ctx.quadraticCurveTo(bx + 14, by - 2.2, bx + 30 + rnd() * 12, by + 0.8);
			ctx.stroke();
		}

		// Bark eyes: dark core inside a raised rim.
		for (let i = 0; i < 4; i++) {
			const bx = left + 40 + rnd() * (row.right - left - 90);
			const by = cy - r * 0.3 + rnd() * (r * 0.9);
			ctx.fillStyle = 'rgba(52,30,12,0.55)';
			ctx.beginPath();
			ctx.ellipse(bx, by, 2.5, 1.4, 0.2, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = 'rgba(165,121,76,0.6)';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.ellipse(bx, by, 3.8, 2.3, 0.2, 0, Math.PI * 2);
			ctx.stroke();
		}

		// A long raking sheen so each log reads round, not flat.
		ctx.strokeStyle = 'rgba(255,236,200,0.22)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(left + 16, cy - r * 0.7);
		ctx.quadraticCurveTo((left + row.right) / 2, cy - r * 0.92, row.right - 18, cy - r * 0.66);
		ctx.stroke();
		ctx.restore();
	}
}

/** A dark wheel well that the tyre drops into; the livery arch is added when fitted. */
function wheelWell(ctx: CanvasRenderingContext2D, cx: number, shaded: boolean): void {
	ctx.beginPath();
	ctx.arc(cx, FRONT.y, 43, Math.PI, Math.PI * 2);
	ctx.lineTo(cx + 43, 250);
	ctx.lineTo(cx - 43, 250);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, FRONT.y - 43, 0, 250);
		well.addColorStop(0, '#100A05');
		well.addColorStop(1, PAINT_DEEP);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = PAINT_DEEP;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.5;
	ctx.stroke();
}

/** Livery lip and a rear mudguard over an existing well. */
function drawArchTrim(ctx: CanvasRenderingContext2D, cx: number, guard: boolean): void {
	ctx.strokeStyle = PAINT;
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(cx, FRONT.y, 43, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, FRONT.y, 45.5, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();

	if (guard) {
		ctx.strokeStyle = PAINT_DARK;
		ctx.lineWidth = 7;
		ctx.beginPath();
		ctx.arc(cx, FRONT.y, 50, Math.PI * 1.04, Math.PI * 1.96);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.28)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(cx, FRONT.y, 52.2, Math.PI * 1.08, Math.PI * 1.5);
		ctx.stroke();
	}
}

/** A binder strap over the near face of the load, with a chrome ratchet body. */
function drawStrap(
	ctx: CanvasRenderingContext2D,
	x: number,
	top: number,
	bottom: number,
	finish: boolean
): void {
	shape(
		ctx,
		`M${x},${top} L${x + 6},${top} L${x + 7},${bottom} L${x + 1},${bottom} Z`,
		'#3D342F',
		1.6
	);
	line(ctx, x + 1.6, top + 4, x + 2.4, bottom - 4, 'rgba(255,255,255,0.22)', 1.2);
	line(ctx, x + 4.8, top + 4, x + 5.4, bottom - 4, 'rgba(0,0,0,0.35)', 1.2);

	rect(ctx, x - 3.5, 132, 14, 13, CHROME, 2.4, 1.9);
	line(ctx, x + 2.5, 137.5, x + 8.5, 133.5, INK, 1.6);
	line(ctx, x + 1, 141, x + 8, 141, 'rgba(255,255,255,0.5)', 1);

	if (finish) {
		// Webbing sheen and a chrome highlight across the ratchet body.
		line(ctx, x + 2.2, top + 3, x + 3, bottom - 3, 'rgba(255,255,255,0.46)', 1.1);
		line(ctx, x - 2.6, 133.2, x + 10.4, 133.2, 'rgba(255,255,255,0.62)', 1);
		line(ctx, x - 2.2, 143, x + 10, 143, 'rgba(0,0,0,0.22)', 1);
	}
}

/** The chain lying over the top of the load, link by link. */
function drawTopChain(ctx: CanvasRenderingContext2D, finish: boolean): void {
	const top = 70;
	ctx.strokeStyle = STEEL;
	ctx.lineWidth = 3.4;
	ctx.beginPath();
	ctx.moveTo(322, 67);
	ctx.bezierCurveTo(420, top + 3, 600, top + 3, 700, 67);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.32)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(322, 65.6);
	ctx.bezierCurveTo(420, top + 1.6, 600, top + 1.6, 700, 65.6);
	ctx.stroke();

	if (finish) {
		for (let lx = 338; lx < 694; lx += 13) {
			const t = (lx - 322) / 378;
			const ly = 67 + Math.sin(t * Math.PI) * 3;
			line(ctx, lx - 2.6, ly - 2, lx + 2.6, ly + 2, 'rgba(201,210,222,0.65)', 1.5);
		}

		// Under-edge shadow plus a link-by-link sparkle give the chain its roundness.
		ctx.strokeStyle = 'rgba(0,0,0,0.26)';
		ctx.lineWidth = 1.1;
		ctx.beginPath();
		ctx.moveTo(322, 68.6);
		ctx.bezierCurveTo(420, top + 4.6, 600, top + 4.6, 700, 68.6);
		ctx.stroke();

		ctx.fillStyle = 'rgba(255,255,255,0.72)';
		for (let lx = 345; lx < 690; lx += 39) {
			const t = (lx - 322) / 378;
			const ly = 67 + Math.sin(t * Math.PI) * 3;
			ctx.beginPath();
			ctx.arc(lx, ly + 0.2, 1.15, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	for (const sx of STAKE_X) {
		line(ctx, sx + 6, 66, sx + 6, 77, STEEL, 2.4);
	}
}

/** Deterministic picture-book paint grain over the painted panels only. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const panels = new Path2D(CAB);
	panels.rect(DECK.left, DECK.top, DECK.right - DECK.left, DECK.bottom - DECK.top);
	panels.rect(HEADBOARD.x, HEADBOARD.y, HEADBOARD.w, HEADBOARD.h);
	for (const sx of STAKE_X) panels.rect(sx, 74, 13, 116);

	ctx.save();
	ctx.clip(panels, 'nonzero');
	let seed = 53;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	const onGlass = (px: number, py: number): boolean =>
		(px >= 54 && px <= 136 && py >= 110 && py <= 186) ||
		(px >= 138 && px <= 214 && py >= 112 && py <= 160);
	const onWheel = (px: number, py: number): boolean =>
		Math.hypot(px - FRONT.x, py - FRONT.y) < FRONT.r + 2 ||
		Math.hypot(px - REAR.x, py - REAR.y) < REAR.r + 2;

	ctx.fillStyle = INK;
	for (let i = 0; i < 320; i++) {
		const px = 44 + rnd() * 742;
		const py = 62 + rnd() * 204;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.08 + rnd() * 0.06;
		const size = 1.5 + rnd() * 1.6;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 110; i++) {
		const px = 44 + rnd() * 742;
		const py = 62 + rnd() * 204;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.1 + rnd() * 0.1;
		const size = 1.3 + rnd() * 1.4;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();

	// Brush sweeps along the deck rail.
	ctx.save();
	ctx.clip(new Path2D('M230,186 L782,186 L782,208 L230,208 Z'));
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(240, 192);
	ctx.bezierCurveTo(400, 190, 620, 194, 772, 191);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,12,6,0.14)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(244, 202);
	ctx.bezierCurveTo(420, 200, 640, 203, 772, 201);
	ctx.stroke();
	ctx.restore();

	// Cab-side sweeps following the panel, well clear of the glazing and arches.
	ctx.save();
	ctx.clip(new Path2D(CAB));
	ctx.strokeStyle = 'rgba(255,244,220,0.16)';
	ctx.lineWidth = 3.2;
	ctx.beginPath();
	ctx.moveTo(60, 214);
	ctx.bezierCurveTo(112, 209, 172, 213, 218, 207);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(24,14,6,0.13)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.moveTo(58, 234);
	ctx.bezierCurveTo(120, 229, 176, 233, 220, 228);
	ctx.stroke();
	ctx.restore();

	// Vertical grain down the headboard and each stake.
	ctx.save();
	ctx.beginPath();
	ctx.rect(HEADBOARD.x, HEADBOARD.y, HEADBOARD.w, HEADBOARD.h);
	for (const sx of STAKE_X) ctx.rect(sx, 74, 13, 116);
	ctx.clip();
	for (const [index, grainX] of [233, 241, 248, 325, 451, 577, 703].entries()) {
		ctx.strokeStyle = index % 2 === 0 ? 'rgba(255,244,220,0.14)' : 'rgba(24,14,6,0.14)';
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(grainX, 76);
		ctx.bezierCurveTo(grainX + 1.2, 110, grainX - 1, 150, grainX + 0.6, 184);
		ctx.stroke();
	}
	ctx.restore();
}

/** A four-point sparkle with a warm core. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
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

/** Picture-book hub: bright ring, six bolts and a pale centre cap. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.68)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.47, 0, Math.PI * 2);
	ctx.stroke();

	// Machined groove just inside the bolt circle.
	ctx.strokeStyle = 'rgba(58,39,27,0.34)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.2, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.4, CHROME, 1.1);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.2);
	ctx.strokeStyle = 'rgba(255,255,255,0.75)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();

	// Valve stem and a warm dust arc along the lower rim.
	line(ctx, x + r * 0.2, y + r * 0.34, x + r * 0.3, y + r * 0.2, CHROME, 1.7);
	ctx.strokeStyle = 'rgba(58,39,27,0.28)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.72, Math.PI * 0.12, Math.PI * 0.42);
	ctx.stroke();
}

/** Finishing marks: paint chips on the working edges, dust along the frame. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	const chips: Array<[number, number, number, number, number]> = [
		[48, 242, 6, 2.2, 0.45],
		[196, 240, 8, 2, 0.4],
		[236, 214, 10, 2, 0.3],
		[322, 160, 3, 1.8, 0.35],
		[448, 120, 3, 1.6, 0.3],
		[574, 176, 4, 1.8, 0.32],
		[740, 214, 8, 2, 0.35],
		[770, 202, 6, 2.2, 0.45]
	];

	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of chips) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	ctx.save();
	ctx.globalAlpha = 0.14;
	ctx.fillStyle = INK;
	for (let dust = 0; dust < 8; dust++) {
		const dx = 252 + dust * 64;
		if (dx > 590 && dx < 690) continue;
		ctx.fillRect(dx, 252 + (dust % 3), 14, 2);
	}
	ctx.restore();

	// Soot softened onto the cab roof behind the beacon.
	ctx.save();
	ctx.globalAlpha = 0.12;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(178, 96, 9, 3.4, -0.06, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}

export function drawRealLogTruckLevel(
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
		ctx.ellipse(404, 278, 366, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis rails run from the nose to the tail, dark under the brown livery.
	rect(ctx, 54, 246, 728, 16, PAINT_DEEP, 2, 2.5);
	line(ctx, 60, 247, 776, 247, STEEL, 2);
	line(ctx, 60, 259, 776, 259, 'rgba(0,0,0,0.4)', 1.5);

	if (fitted) {
		// Fuel tank and toolbox hung off the rails.
		rect(ctx, 64, 248, 46, 14, CHROME, 7, 2.2);
		line(ctx, 78, 249, 78, 261, 'rgba(58,39,27,0.35)', 1.5);
		line(ctx, 96, 249, 96, 261, 'rgba(58,39,27,0.35)', 1.5);
		rect(ctx, 252, 248, 42, 12, PAINT_DARK, 2, 2.2);
	}

	// Headboard: tall log guard with a livery cap and corner braces.
	rect(ctx, HEADBOARD.x, HEADBOARD.y, HEADBOARD.w, HEADBOARD.h, PAINT_DARK, 2, 2.8);
	rect(ctx, HEADBOARD.x - 2, HEADBOARD.y, HEADBOARD.w + 4, 10, PAINT, 2, 2.4);
	line(ctx, 231, 74, 231, 184, 'rgba(255,255,255,0.2)', 2.4);
	line(ctx, 249, 74, 249, 184, 'rgba(0,0,0,0.3)', 2.2);
	if (fitted) {
		for (const ry of [88, 112, 136]) {
			circle(ctx, 240, ry, 2.1, STEEL, 1);
		}
		rect(ctx, 226, 72, 4, 112, PAINT, 1, 1.6);
		line(ctx, 228, 176, 254, 160, 'rgba(255,255,255,0.16)', 2);
	}

	// Flat bunk: livery deck slab over a dark bolster and open hangers.
	rect(ctx, DECK.left, DECK.top, DECK.right - DECK.left, DECK.bottom - DECK.top, PAINT_DARK, 0, 3);
	rect(ctx, DECK.left, DECK.top, DECK.right - DECK.left, 4, PAINT, 0, 0);
	line(ctx, 234, DECK.bottom - 3, 778, DECK.bottom - 3, 'rgba(0,0,0,0.35)', 1.5);
	rect(ctx, DECK.left, 208, DECK.right - DECK.left, 14, PAINT_DEEP, 0, 2.2);

	for (const hx of [330, 450, 570, 690]) {
		rect(ctx, hx, 222, 12, 24, PAINT_DARK, 1, 2);
	}
	line(ctx, 342, 244, 392, 222, PAINT_DARK, 5);
	line(ctx, 462, 244, 512, 222, PAINT_DARK, 5);
	line(ctx, 582, 244, 632, 222, PAINT_DARK, 5);

	// The load: sawn timber resting on the bunk.
	for (const row of LOGS) drawLog(ctx, row, shaded, finish);

	if (fitted) {
		for (const sx of STRAP_X) drawStrap(ctx, sx, 70, 187, finish);
	}

	// Heavy stakes stand in front of the load and hold it down.
	for (const sx of STAKE_X) {
		shape(
			ctx,
			`M${sx},190 L${sx},74 L${sx + 4},65 L${sx + 13},74 L${sx + 13},190 Z`,
			PAINT,
			2.4
		);
		line(ctx, sx + 3, 78, sx + 3, 186, 'rgba(255,255,255,0.24)', 2);
		line(ctx, sx + 10, 78, sx + 10, 186, 'rgba(0,0,0,0.3)', 2);
		if (fitted) {
			circle(ctx, sx + 6.5, 98, 1.8, CHROME, 0.9);
			circle(ctx, sx + 6.5, 182, 1.8, STEEL, 0.9);
			rect(ctx, sx - 2, 182, 17, 7, PAINT_DEEP, 1.5, 1.6);
		}
	}

	if (fitted) drawTopChain(ctx, finish);

	// Cab shell, then the door and glazing on top of it.
	shape(ctx, CAB, PAINT);
	rect(ctx, 48, 196, 174, 7, CREAM, 0, 0);
	line(ctx, 48, 203, 222, 203, 'rgba(58,39,27,0.35)', 1.4);
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, PAINT, 3, 2.6);
	line(ctx, 146, 172, 214, 172, 'rgba(58,39,27,0.25)', 1.6);
	line(ctx, 144, 236, 216, 236, 'rgba(58,39,27,0.22)', 1.4);

	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(CAB));
		const paint = ctx.createLinearGradient(0, 92, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.28)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(22,13,6,0.26)');
		ctx.fillStyle = paint;
		ctx.fillRect(40, 88, 190, 168);
		ctx.restore();

		glassShade(ctx, WINDSCREEN, 56, 112, 78, 72);
		glassShade(ctx, SIDE_WINDOW, 140, 114, 72, 44);
		line(ctx, 94, 118, 74, 158, 'rgba(255,255,255,0.5)', 3.4);

		ctx.save();
		ctx.beginPath();
		ctx.rect(DECK.left, DECK.top, DECK.right - DECK.left, DECK.bottom - DECK.top);
		ctx.clip();
		const deck = ctx.createLinearGradient(0, DECK.top, 0, DECK.bottom);
		deck.addColorStop(0, 'rgba(255,255,255,0.26)');
		deck.addColorStop(1, 'rgba(20,12,6,0.22)');
		ctx.fillStyle = deck;
		ctx.fillRect(DECK.left, DECK.top, DECK.right - DECK.left, DECK.bottom - DECK.top);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		ctx.rect(HEADBOARD.x, HEADBOARD.y, HEADBOARD.w, HEADBOARD.h);
		ctx.clip();
		const board = ctx.createLinearGradient(0, HEADBOARD.y, 0, HEADBOARD.y + HEADBOARD.h);
		board.addColorStop(0, 'rgba(255,255,255,0.2)');
		board.addColorStop(1, 'rgba(20,12,6,0.24)');
		ctx.fillStyle = board;
		ctx.fillRect(HEADBOARD.x, HEADBOARD.y, HEADBOARD.w, HEADBOARD.h);
		ctx.restore();
	}

	if (fitted) {
		// Grille on the cab's front edge.
		rect(ctx, 46, 150, 8, 54, PAINT_DEEP, 1, 2);
		for (let bar = 0; bar < 4; bar++) {
			line(ctx, 47, 158 + bar * 12, 53, 158 + bar * 12, CHROME, 1.5);
		}

		// Headlight and indicator on the nose.
		circle(ctx, 53, 216, 8.5, PAINT_DEEP, 1.8);
		circle(ctx, 53, 216, 6.4, LENS, 1.6);
		rect(ctx, 48, 228, 9, 6, AMBER, 1.4, 1.2);

		// Front bumper under the cab.
		rect(ctx, 30, 232, 16, 24, CHROME, 5, 2.6);
		rect(ctx, 32, 246, 12, 7, PAINT_DARK, 2, 1.5);
		line(ctx, 31, 236, 44, 236, 'rgba(255,255,255,0.6)', 1.6);

		// Mirror on the A-pillar.
		line(ctx, 48, 120, 37, 114, STEEL, 2.6);
		line(ctx, 48, 126, 37, 121, STEEL, 2);
		rect(ctx, 24, 102, 13, 26, CHROME, 4, 2.2);
		rect(ctx, 27, 106, 7, 18, GLASS, 2, 1.2);

		// Beacon and roof markers.
		rect(ctx, 182, 86, 20, 6, STEEL, 2, 2);
		circle(ctx, 192, 79, 7, AMBER, 2.2);
		circle(ctx, 189.6, 76.8, 2.2, LENS, 0.8);
		for (let lens = 0; lens < 3; lens++) {
			rect(ctx, 104 + lens * 16, 94, 10, 4, AMBER, 1, 1);
		}

		// Wipers, handle and step.
		line(ctx, 66, 180, 82, 168, INK, 2.2);
		line(ctx, 96, 180, 112, 168, INK, 2);
		rect(ctx, 208, 182, 5, 15, CHROME, 1.5, 1.5);
		rect(ctx, 190, 242, 26, 6, CHROME, 2, 1.6);

		// Side markers along the deck rail and the tail post lamps.
		for (const mx of [340, 430, 520, 610, 700]) {
			rect(ctx, mx, 190, 12, 5, AMBER, 1.2, 1.2);
		}
		rect(ctx, 768, 188, 14, 58, PAINT_DARK, 1, 2.4);
		line(ctx, 771, 190, 771, 244, 'rgba(255,255,255,0.2)', 1.6);
		rect(ctx, 770, 192, 9, 15, RED, 2, 1.8);
		rect(ctx, 770, 209, 9, 10, AMBER, 2, 1.5);
		rect(ctx, 758, 246, 24, 16, CHROME, 3, 2.4);
		rect(ctx, 762, 250, 16, 8, CREAM, 1, 1.3);
	}

	// Wheel wells, livery arches and mudguards; the tyre tiles land on top.
	wheelWell(ctx, FRONT.x, shaded);
	wheelWell(ctx, REAR.x, shaded);

	if (fitted) {
		drawArchTrim(ctx, FRONT.x, false);
		drawArchTrim(ctx, REAR.x, true);
		rect(ctx, 182, 248, 16, 20, PAINT_DARK, 2, 2);
		rect(ctx, 670, 248, 16, 20, PAINT_DARK, 2, 2);
		line(ctx, 185, 252, 185, 264, PAINT, 1.8);
		line(ctx, 673, 252, 673, 264, PAINT, 1.8);
	}

	// Both wheels are the one wheel part; the rear tile is the front mirrored.
	wheel(ctx, FRONT.x, FRONT.y, FRONT.r, finish);
	wheel(ctx, REAR.x, REAR.y, REAR.r, finish);

	if (lit) {
		// Rim light on the roof, headboard cap, deck rail and the crest of the load.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(100, 93);
		ctx.lineTo(206, 93);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(228, 61);
		ctx.lineTo(254, 61);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(238, 187);
		ctx.lineTo(776, 187);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.3)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(296, 67.5);
		ctx.lineTo(694, 67.5);
		ctx.stroke();

		// Headlight glow on the nose.
		const glow = ctx.createRadialGradient(53, 216, 1, 53, 216, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.72)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(53, 216, 30, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const at of [FRONT, REAR]) {
			ctx.beginPath();
			ctx.ellipse(at.x, 272, 32, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		glint(ctx, 84, 150, 5.2);
		glint(ctx, 96, 138, 3.8);
		glint(ctx, 196, 120, 4.6);
		glint(ctx, 246, 68, 3.2);
		glint(ctx, 440, 158, 4.8);
		glint(ctx, 520, 71, 2.7);
		glint(ctx, 700, 122, 4.2);
		glint(ctx, 398, 139, 3.1);
		glint(ctx, 60, 238, 3.6);
		glint(ctx, 330, 198, 3.4);
		glint(ctx, 272, 163, 2.8);

		hubFinish(ctx, FRONT.x, FRONT.y, FRONT.r);
		hubFinish(ctx, REAR.x, REAR.y, REAR.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealLogTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealLogTruckLevel(ctx, x, y, scale, 5);
}
