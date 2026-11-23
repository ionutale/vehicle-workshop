/**
 * Street sweeper art, cut into the same five-piece kit as the other realistic vehicles.
 * A compact cab-over cab facing left, a boxy hopper with a curved rear tailgate, twin
 * rotating gutter brushes hanging under the cab front, a suction nozzle fed by a fat hose,
 * a water tank on the hopper roof, a beacon and lamps. Green and charcoal livery.
 *
 * The brushes, nozzle, tank, lid and beacon are baked into the body piece: they are the cue
 * that names the vehicle, so they survive at level 1. Level 5 is the production target:
 * shaded, fully fitted, lit and finished with paint grain, tank and hopper sheen, glints,
 * hub hardware and picked-up grit around the brushes.
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

const GREEN = '#90BE6D';
const GREEN_DARK = '#6FA04E';
const GREEN_DEEP = '#547A3A';
const CHAR = '#2B2D42';
const CHAR_DARK = '#1B1D2A';
const CHAR_LIGHT = '#454A63';
const CREAM = '#FFF6E4';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#E0455A';

/** Art box 760 x 350, road at 272. Front (cab) faces left. */
const SHELL =
	'M36,246 L36,168 Q36,156 45,148 L70,118 Q78,100 96,100 L200,100 L200,112 L656,112 Q684,112 690,132 L690,246 L112,246 L112,226 L36,226 Z';

/** Cab glass: a raked windscreen plus the door pane, kept clear of the door mask. */
const WINDSCREEN =
	'M52,160 L52,148 Q52,138 60,130 L82,110 Q88,104 100,104 L116,104 Q124,104 124,112 L124,152 Q124,160 116,160 Z';
const SIDE_GLASS =
	'M140,110 L182,110 Q188,110 188,116 L188,152 Q188,158 182,158 L140,158 Q134,158 134,152 L134,116 Q134,110 140,110 Z';
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Cab door: a clean rectangle, below every pane and behind the wheel arch. */
const DOOR = { x: 132, y: 170, w: 62, h: 68 };

/** Water tank lying on the hopper roof, bottom edge flush with the roof at y=112; the
 * raised filler neck is part of the same subpath so the evenodd mask cannot hole. */
const TANK =
	'M216,112 L216,96 Q216,84 230,84 L254,84 L254,80 L274,80 L274,84 L316,84 Q330,84 330,96 L330,112 Z';
/** Raised hopper lid at the tail, again flush with the roof. */
const LID = 'M566,112 L566,102 Q566,96 574,96 L640,96 Q648,96 648,102 L648,112 Z';
/** Beacon on the flat cab roof. */
const BEACON = 'M144,100 L144,92 L152,92 Q152,80 164,80 Q176,80 176,92 L184,92 L184,100 Z';
/** Mirror head on the front door post. */
const MIRROR = 'M20,146 L36,146 L36,186 L20,186 Z';
/** Both bumpers, standing outside the shell. */
const BUMPER_F = 'M20,218 L36,218 L36,256 L20,256 Z';
const BUMPER_R = 'M690,226 L716,226 L716,256 L690,256 Z';
/** Suction nozzle housing hanging under the hopper floor, mouth flared just above the road. */
const NOZZLE = 'M300,246 L352,246 L356,256 L362,263 L288,263 L294,256 Z';

/** Livery bands, also used to keep the paint grain off the charcoal panels. */
const WAIST = 'M204,182 L688,182 L688,200 L204,200 Z';
const SKIRT = 'M204,222 L688,222 L688,246 L204,246 Z';
const CAB_SKIRT = 'M36,208 L200,208 L200,246 L36,246 Z';
const TAILGATE = 'M648,118 L690,118 L690,246 L648,246 Z';

/** Both brushes hang tangentially off the cab-floor notch, so the mask cannot hole. */
const BRUSH_A = { x: 60, y: 248, r: 22 };
const BRUSH_B = { x: 100, y: 242, r: 16 };

const WHEEL_L = { x: 150, y: 236, r: 34 };
const WHEEL_R = { x: 600, y: 236, r: 34 };

/** Body cut-out: shell plus every fitting that stands outside it, never a wheel circle. */
const BODY_MASK = [
	SHELL,
	BEACON,
	MIRROR,
	BUMPER_F,
	BUMPER_R,
	TANK,
	LID,
	NOZZLE,
	circleMask(BRUSH_A.x, BRUSH_A.y, BRUSH_A.r),
	circleMask(BRUSH_B.x, BRUSH_B.y, BRUSH_B.r)
].join(' ');

/** Charcoal panels, glass and tyres carry no paint grain. */
const GRAIN_CUTOUTS = [
	WAIST,
	SKIRT,
	CAB_SKIRT,
	TAILGATE,
	GLASS_MASK,
	NOZZLE,
	circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r),
	circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r),
	circleMask(BRUSH_A.x, BRUSH_A.y, BRUSH_A.r),
	circleMask(BRUSH_B.x, BRUSH_B.y, BRUSH_B.r)
];

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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.6, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.62)');
	glass.addColorStop(0.44, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(80,160,205,0.32)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Recessed wheel well, drawn under the tyre. */
function wheelWell(ctx: CanvasRenderingContext2D, wx: number, shaded: boolean): void {
	ctx.beginPath();
	ctx.arc(wx, WHEEL_L.y, 40, Math.PI, Math.PI * 2);
	ctx.lineTo(wx + 40, 246);
	ctx.lineTo(wx - 40, 246);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, WHEEL_L.y - 40, 0, 246);
		well.addColorStop(0, '#10111A');
		well.addColorStop(1, CHAR_LIGHT);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = CHAR_DARK;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke();
}

/** Charcoal mudguard band sitting just outside the tyre. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, fitted: boolean): void {
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, WHEEL_L.r + 12, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, WHEEL_L.y, WHEEL_L.r + 3, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = GREEN_DARK;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	if (fitted) {
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(cx, WHEEL_L.y, WHEEL_L.r + 8, Math.PI * 1.1, Math.PI * 1.9);
		ctx.stroke();
	}
}

/**
 * A gutter brush seen in side elevation: a pale nylon bristle disc on a charcoal backing,
 * a painted housing over the crown and a small steel hub, so it never reads as a wheel.
 */
function brushHead(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	r: number,
	phase: number,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	circle(ctx, cx, cy, r, '#E3DED0', 2.6);

	const count = Math.round(r * 1.6);
	for (let i = 0; i < count; i++) {
		const a = phase + (i / count) * Math.PI * 2;
		const outer = r * (i % 3 === 0 ? 1 : 0.93);
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * r * 0.28, cy + Math.sin(a) * r * 0.28);
		ctx.lineTo(cx + Math.cos(a + 0.06) * outer, cy + Math.sin(a + 0.06) * outer);
		ctx.strokeStyle = i % 2 === 0 ? '#9C9A8A' : '#BFBCAB';
		ctx.lineWidth = 1.5;
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
	ctx.stroke();

	// Painted housing over the crown, with a steel mounting bracket at its crown.
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.99, Math.PI * 1.03, Math.PI * 1.97);
	ctx.arc(cx, cy, r * 0.5, Math.PI * 1.97, Math.PI * 1.03, true);
	ctx.closePath();
	ctx.fillStyle = shaded ? GREEN_DEEP : GREEN_DARK;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();

	rect(ctx, cx - 4.5, cy - r + 4, 9, 7, CHAR_LIGHT, 2, 1.6);
	circle(ctx, cx, cy - r + 7.5, 1.6, CHROME, 1);

	circle(ctx, cx, cy, r * 0.23, CHAR, 2);
	circle(ctx, cx, cy, r * 0.09, CHROME, 1.3);

	if (fitted) {
		// Motion arcs inside the bristle fan.
		ctx.strokeStyle = 'rgba(43,45,66,0.4)';
		ctx.lineWidth = 1.6;
		for (const start of [0.16, 1.16]) {
			ctx.beginPath();
			ctx.arc(cx, cy, r * 0.7, Math.PI * start, Math.PI * (start + 0.34));
			ctx.stroke();
		}
		// Housing catchlight and its mounting bolt.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.76, Math.PI * 1.12, Math.PI * 1.5);
		ctx.stroke();
		circle(ctx, cx, cy, r * 0.13, '#8A93A3', 1);
	}

	if (finish) {
		// Grit kicked up around the working edge, plus a scuff on the ground.
		ctx.save();
		ctx.fillStyle = '#8C7A5E';
		for (const [gx, gy, gr] of [
			[-0.86, 0.62, 1.5],
			[-0.52, 0.86, 1.1],
			[0.42, 0.88, 1.3],
			[0.78, 0.6, 1],
			[-0.1, 0.94, 1.2],
			[-0.68, 0.78, 0.9],
			[0.58, 0.74, 0.85],
			[0.96, 0.3, 0.8]
		] as const) {
			ctx.beginPath();
			ctx.arc(cx + gx * r, cy + gy * r, gr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 0.22;
		ctx.fillStyle = '#6B5B45';
		ctx.beginPath();
		ctx.ellipse(cx - r * 0.15, cy + r * 0.9, r * 1.05, 3, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		ctx.save();
		ctx.fillStyle = '#E6E1D3';
		ctx.globalAlpha = 0.32;
		for (const [px, py, pr] of [
			[-1.15, 0.46, 2.6],
			[-1.38, 0.2, 1.8],
			[1.2, 0.54, 2.2],
			[-1.3, 0.36, 1.4],
			[0.92, 0.36, 1.5]
		] as const) {
			ctx.beginPath();
			ctx.arc(cx + px * r, cy + py * r, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Bright bristle tips, a lit housing rim and the bracket bolt's catchlight.
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 1.5;
		for (const start of [0.2, 1.56]) {
			ctx.beginPath();
			ctx.arc(cx, cy, r * 0.9, Math.PI * start, Math.PI * (start + 0.5));
			ctx.stroke();
		}
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.87, Math.PI * 1.2, Math.PI * 1.48);
		ctx.stroke();
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(cx - r * 0.05, cy - r + 6.6, 0.9, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.arc(cx - r * 0.03, cy - r * 0.04, 1.1, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** A four-point paint glint. */
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

/** Picture-book hub hardware, mirror symmetric so the flipped wheel matches. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.47, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.4, CHROME, 1.1);
	}

	// A second ring of small rivets between the bolts, evenly spaced so the
	// flipped right wheel still matches.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
		circle(ctx, x + Math.cos(a) * r * 0.19, y + Math.sin(a) * r * 0.19, 1.35, '#8A93A3', 0.9);
	}

	// Billet catchlight on every lug nut.
	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 1.2;
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		ctx.beginPath();
		ctx.arc(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 3.5, Math.PI * 0.78, Math.PI * 1.46);
		ctx.stroke();
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.2);
	ctx.strokeStyle = 'rgba(58,39,27,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.24, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.4)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.84, Math.PI * 1.06, Math.PI * 1.34);
	ctx.stroke();
}

/** Paint grain and long brush sweeps, clipped to the painted panels only. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(SHELL);
	for (const cut of GRAIN_CUTOUTS) panels.addPath(new Path2D(cut));
	ctx.clip(panels, 'evenodd');
	let seed = 83;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	// Fine dark speckle, denser than level 4's flat paint.
	ctx.fillStyle = INK;
	for (let i = 0; i < 470; i++) {
		const px = 40 + rnd() * 646;
		const py = 104 + rnd() * 138;
		const size = 1.3 + rnd() * 1.7;
		ctx.globalAlpha = 0.07 + rnd() * 0.07;
		ctx.fillRect(px, py, size, size);
	}

	// Pale flecks and a sparser set of larger freckles so the grain reads small.
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 150; i++) {
		const px = 40 + rnd() * 646;
		const py = 104 + rnd() * 138;
		const size = 1.2 + rnd() * 1.1;
		ctx.globalAlpha = 0.15 + rnd() * 0.12;
		ctx.fillRect(px, py, size, size);
	}

	for (let i = 0; i < 56; i++) {
		const px = 44 + rnd() * 638;
		const py = 106 + rnd() * 134;
		const size = 2.2 + rnd() * 1.9;
		ctx.fillStyle = i % 3 === 0 ? CREAM : INK;
		ctx.globalAlpha = 0.05 + rnd() * 0.04;
		ctx.beginPath();
		ctx.arc(px, py, size * 0.5, 0, Math.PI * 2);
		ctx.fill();
	}

	// Short brush flicks: a sprayed edge rather than even noise.
	ctx.globalAlpha = 0.08;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.1;
	for (let i = 0; i < 70; i++) {
		const px = 44 + rnd() * 636;
		const py = 108 + rnd() * 130;
		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(px + 2 + rnd() * 4, py - 0.6 - rnd() * 1.4);
		ctx.stroke();
	}

	// Long faint brush sweeps over the cab, hopper and tailgate panels.
	ctx.globalAlpha = 0.09;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[46, 176, 126, 174],
		[214, 138, 322, 136],
		[344, 168, 430, 167],
		[446, 132, 542, 130],
		[598, 156, 682, 154],
		[210, 212, 300, 210],
		[330, 126, 412, 124],
		[438, 190, 520, 188],
		[556, 176, 640, 174],
		[660, 132, 686, 131],
		[140, 200, 190, 198]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** The water tank reads as moulded plastic with a liquid level window. */
function tankSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(TANK));

	// Sky along the crown shading down to the roof line, then a lower shade.
	const sheen = ctx.createLinearGradient(0, 80, 0, 112);
	sheen.addColorStop(0, 'rgba(255,255,255,0.62)');
	sheen.addColorStop(0.34, 'rgba(255,255,255,0.12)');
	sheen.addColorStop(0.72, 'rgba(255,255,255,0.02)');
	sheen.addColorStop(1, 'rgba(0,0,0,0.24)');
	ctx.fillStyle = sheen;
	ctx.fillRect(214, 78, 118, 36);

	// Soft specular column down the flank and a bright rounded end cap.
	const gloss = ctx.createLinearGradient(282, 0, 312, 0);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.5, 'rgba(255,255,255,0.22)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(282, 82, 30, 30);

	const cap = ctx.createLinearGradient(318, 0, 330, 0);
	cap.addColorStop(0, 'rgba(255,255,255,0.05)');
	cap.addColorStop(0.7, 'rgba(255,255,255,0.34)');
	cap.addColorStop(1, 'rgba(0,0,0,0.12)');
	ctx.fillStyle = cap;
	ctx.fillRect(316, 82, 16, 30);

	// The filler-neck shoulder sits proud of the drum.
	const neck = ctx.createLinearGradient(0, 79, 0, 86);
	neck.addColorStop(0, 'rgba(255,255,255,0.55)');
	neck.addColorStop(1, 'rgba(0,0,0,0.16)');
	ctx.fillStyle = neck;
	ctx.fillRect(252, 78, 24, 8);

	// Strap shadows and the shade the drum casts on the roof.
	ctx.fillStyle = 'rgba(58,39,27,0.12)';
	for (const strapX of [238, 300]) {
		ctx.fillRect(strapX + 8, 84, 3, 28);
	}
	ctx.fillStyle = 'rgba(0,0,0,0.18)';
	ctx.fillRect(214, 110, 120, 3);
	ctx.restore();

	// Crisp crown highlight and filler-cap sheen sit above the tank itself.
	line(ctx, 219, 85.5, 327, 85.5, 'rgba(255,255,255,0.66)', 1.8);
	line(ctx, 220, 88, 326, 88, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, 256, 81, 272, 81, 'rgba(255,255,255,0.7)', 1.2);
}

/** A roundel on the hopper flank: a brush disc on a ring, read as the sweep badge. */
function badge(ctx: CanvasRenderingContext2D): void {
	circle(ctx, 556, 152, 21, CREAM, 2.4);
	circle(ctx, 556, 152, 17, CHAR, 1.6);
	circle(ctx, 556, 152, 13, GREEN, 1.6);

	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.4;
	for (let i = 0; i < 10; i++) {
		const a = (i / 10) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(556 + Math.cos(a) * 4.4, 152 + Math.sin(a) * 4.4);
		ctx.lineTo(556 + Math.cos(a) * 12, 152 + Math.sin(a) * 12);
		ctx.stroke();
	}
	circle(ctx, 556, 152, 3.4, CHAR, 1.2);
}

/** Finishing marks: rivets, chrome catches, road dust and the paint-chip edge. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// Rivet line down the bulkhead seam behind the cab.
	ctx.fillStyle = 'rgba(255,246,228,0.7)';
	for (const ry of [126, 154, 178, 206, 232]) {
		ctx.beginPath();
		ctx.arc(205, ry, 1.7, 0, Math.PI * 2);
		ctx.fill();
	}

	// Chrome sheen on the bumper lip and step rungs.
	line(ctx, 22, 220, 34, 220, 'rgba(255,255,255,0.7)', 1.6);
	line(ctx, 692, 228, 714, 228, 'rgba(255,255,255,0.55)', 1.5);
	line(ctx, 144, 241, 176, 241, 'rgba(255,255,255,0.45)', 1.4);
	line(ctx, 300, 248, 348, 248, 'rgba(255,255,255,0.35)', 1.4);

	// Paint chips along the working edge under the hopper.
	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[242, 244, 8, 2, 0.4],
		[366, 244, 10, 2, 0.32],
		[474, 244, 7, 2, 0.36],
		[536, 244, 9, 2, 0.28],
		[610, 244, 6, 2, 0.34]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	// Road dust on the lid and a scuff along the lower tailgate.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(606, 101, 11, 3, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	line(ctx, 660, 210, 658, 236, 'rgba(58,39,27,0.28)', 2.2);

	// Long roof highlight on the cab and the hopper crown.
	line(ctx, 100, 102.5, 196, 102.5, 'rgba(255,255,255,0.32)', 2);
	line(ctx, 300, 114, 500, 114, 'rgba(255,255,255,0.24)', 1.8);

	// Tank strap catches and the filler cap glint.
	for (const strapX of [238, 300]) {
		line(ctx, strapX, 86, strapX, 111, 'rgba(255,255,255,0.4)', 1.3);
	}
	circle(ctx, 246, 88, 2.2, CHROME, 1);

	// Lid corner rivets and the tailgate edge rivets.
	ctx.fillStyle = 'rgba(255,246,228,0.6)';
	for (const rx of [570, 596, 622, 644]) {
		ctx.beginPath();
		ctx.arc(rx, 107, 1.2, 0, Math.PI * 2);
		ctx.fill();
	}
	for (const ry of [128, 156, 184, 212]) {
		ctx.beginPath();
		ctx.arc(684, ry, 1.4, 0, Math.PI * 2);
		ctx.fill();
	}

	// Badge ring catches the light and the door handle gets a chrome pip.
	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(556, 152, 23.5, Math.PI * 1.1, Math.PI * 1.42);
	ctx.stroke();
	ctx.fillStyle = 'rgba(255,255,255,0.8)';
	ctx.beginPath();
	ctx.arc(177, 192, 1.1, 0, Math.PI * 2);
	ctx.fill();
}

export function drawRealStreetSweeperLevel(
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
		ctx.ellipse(368, 277, 344, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis and underbody, painted inside the shell so the body mask keeps them.
	rect(ctx, 40, 236, 646, 10, CHAR_DARK, 0, 0);
	rect(ctx, 40, 236, 646, 2.4, CHAR_LIGHT, 0, 0);

	// One silhouette: compact cab, hopper roof and the curved rear tailgate.
	shape(ctx, SHELL, GREEN);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 100, 0, 246);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.24, 'rgba(255,255,255,0.06)');
		paint.addColorStop(0.7, 'rgba(39,60,24,0.03)');
		paint.addColorStop(1, 'rgba(39,60,24,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(0, 100, 760, 146);

		const cabBevel = ctx.createLinearGradient(36, 0, 120, 0);
		cabBevel.addColorStop(0, 'rgba(255,255,255,0.24)');
		cabBevel.addColorStop(0.3, 'rgba(255,255,255,0.02)');
		cabBevel.addColorStop(1, 'rgba(39,60,24,0.08)');
		ctx.fillStyle = cabBevel;
		ctx.fillRect(36, 100, 164, 146);
	}

	// Hopper panel joints and the inspection hatch.
	for (const ribX of [246, 320, 392, 550, 614]) {
		line(ctx, ribX, 124, ribX, 180, 'rgba(57,80,36,0.24)', 1.6);
		line(ctx, ribX + 1.5, 124, ribX + 1.5, 180, 'rgba(255,255,255,0.4)', 1.2);
		line(ctx, ribX, 202, ribX, 240, 'rgba(57,80,36,0.24)', 1.6);
		line(ctx, ribX + 1.5, 202, ribX + 1.5, 240, 'rgba(255,255,255,0.4)', 1.2);
	}
	rect(ctx, 432, 128, 74, 46, GREEN_DARK, 3, 2.2);
	rect(ctx, 438, 134, 62, 34, GREEN, 2, 1.8);
	line(ctx, 438, 138, 500, 138, 'rgba(255,255,255,0.3)', 1.4);

	// Cab / hopper joint and the tailgate slab.
	line(ctx, 200, 112, 200, 246, 'rgba(43,45,66,0.5)', 3.4);
	line(ctx, 202.4, 116, 202.4, 244, 'rgba(255,255,255,0.3)', 1.3);
	ctx.fillStyle = CHAR;
	ctx.fillRect(648, 118, 42, 128);
	line(ctx, 649.5, 122, 649.5, 242, 'rgba(255,255,255,0.22)', 2);
	line(ctx, 650, 120, 688, 120, 'rgba(255,255,255,0.28)', 1.6);

	// Livery: charcoal waist band with a cream pinstripe, skirt and cab skirt.
	ctx.fillStyle = CHAR;
	ctx.fillRect(204, 182, 484, 18);
	ctx.fillRect(204, 222, 484, 24);
	ctx.fillRect(36, 208, 164, 38);
	line(ctx, 204, 183.5, 686, 183.5, 'rgba(255,255,255,0.34)', 1.4);
	line(ctx, 204, 221, 686, 221, 'rgba(0,0,0,0.3)', 2);

	// Tailgate hinges and latch.
	for (const hy of [134, 176, 218]) {
		rect(ctx, 646, hy, 9, 14, CHAR_LIGHT, 2, 1.6);
	}
	rect(ctx, 666, 194, 12, 8, CHAR_LIGHT, 1.5, 1.6);

	// Hopper sight glass with a water level.
	rect(ctx, 618, 134, 16, 36, CHAR_DARK, 3, 2);
	rect(ctx, 621, 137, 10, 30, '#BFE4F0', 2, 1.4);
	ctx.fillStyle = 'rgba(90,160,190,0.55)';
	ctx.fillRect(621, 151, 10, 16);

	// Door: painted leaf with a charcoal kick panel and its seams.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, GREEN, 3, 2.6);
	rect(ctx, DOOR.x + 4, DOOR.y + 4, DOOR.w - 8, DOOR.h - 8, GREEN, 2, 1.6);
	line(ctx, DOOR.x + 5, DOOR.y + 7, DOOR.x + DOOR.w - 5, DOOR.y + 7, 'rgba(255,255,255,0.3)', 1.3);
	ctx.fillStyle = CHAR;
	ctx.fillRect(DOOR.x + 3, 222, DOOR.w - 6, 16);

	// Livery lettering on the charcoal skirt.
	ctx.fillStyle = CREAM;
	ctx.font = '800 21px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('SWEEP', 392, 241);
	ctx.fillStyle = 'rgba(255,246,228,0.7)';
	ctx.font = '700 9px ui-rounded, system-ui, sans-serif';
	ctx.fillText('CITY SERVICES', 394, 217);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Water tank and its straps, sitting on the hopper crown.
	shape(ctx, TANK, CREAM, 2.6);
	ctx.save();
	ctx.clip(new Path2D(TANK));
	ctx.fillStyle = GREEN;
	ctx.fillRect(214, 105, 120, 7);
	ctx.fillStyle = 'rgba(255,255,255,0.5)';
	ctx.fillRect(214, 87, 120, 4);
	ctx.restore();
	line(ctx, 228, 88, 228, 111, 'rgba(58,39,27,0.22)', 1.6);
	for (const strapX of [238, 300]) {
		rect(ctx, strapX, 85, 8, 27, CHAR, 2, 1.6);
	}
	rect(ctx, 255, 80.4, 18, 3.2, CHAR_LIGHT, 1, 1.1);
	circle(ctx, 264, 82, 2.2, CHROME, 1);
	circle(ctx, 324, 95, 2.6, CHROME, 1.2);

	// Raised hopper lid with its hinges, a grab handle and the suction-fan grille.
	shape(ctx, LID, CHAR, 2.4);
	line(ctx, 570, 98.5, 644, 98.5, 'rgba(255,255,255,0.28)', 1.6);
	for (const hingeX of [578, 628]) {
		rect(ctx, hingeX, 104, 10, 8, CHAR_LIGHT, 2, 1.4);
	}
	circle(ctx, 607, 104, 7.5, CHAR_LIGHT, 1.8);
	circle(ctx, 607, 104, 3.4, CHAR_DARK, 1.4);
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		line(
			ctx,
			607 + Math.cos(a) * 3.6,
			104 + Math.sin(a) * 3.6,
			607 + Math.cos(a) * 7.2,
			104 + Math.sin(a) * 7.2,
			CHAR_DARK,
			1.2
		);
	}

	// Beacon on the cab roof.
	rect(ctx, 144, 94, 40, 6, CHAR, 2, 2);
	shape(ctx, BEACON, LAMP, 2.2);
	ctx.save();
	ctx.clip(new Path2D(BEACON));
	const dome = ctx.createLinearGradient(0, 80, 0, 100);
	dome.addColorStop(0, 'rgba(255,255,255,0.7)');
	dome.addColorStop(1, 'rgba(255,183,3,0.35)');
	ctx.fillStyle = dome;
	ctx.fillRect(148, 78, 32, 24);
	ctx.restore();

	// Suction nozzle under the hopper, its hose looping up into the body.
	shape(ctx, NOZZLE, CHAR, 2.4);
	ctx.save();
	ctx.clip(new Path2D(NOZZLE));
	const throat = ctx.createLinearGradient(0, 246, 0, 263);
	throat.addColorStop(0, CHAR_LIGHT);
	throat.addColorStop(1, '#10111A');
	ctx.fillStyle = throat;
	ctx.fillRect(286, 244, 80, 22);
	ctx.fillStyle = '#0B0C12';
	ctx.fillRect(288, 259, 76, 5);
	ctx.restore();
	line(ctx, 292, 247.5, 358, 247.5, 'rgba(255,255,255,0.34)', 1.5);

	ctx.beginPath();
	ctx.moveTo(342, 250);
	ctx.bezierCurveTo(366, 252, 374, 240, 384, 228);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 15;
	ctx.stroke();
	ctx.strokeStyle = CHAR;
	ctx.lineWidth = 11;
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 3;
	ctx.stroke();
	rect(ctx, 335, 245, 14, 7, STEEL, 2, 1.5);

	// Twin rotating gutter brushes.
	brushHead(ctx, BRUSH_A.x, BRUSH_A.y, BRUSH_A.r, 0.2, shaded, fitted, finish);
	brushHead(ctx, BRUSH_B.x, BRUSH_B.y, BRUSH_B.r, 0.6, shaded, fitted, finish);

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 52, 104, 72, 56);
		glassShade(ctx, SIDE_GLASS, 134, 110, 54, 48);
	}
	if (fitted) {
		line(ctx, 60, 152, 74, 140, INK, 2.2);
		line(ctx, 82, 154, 96, 142, INK, 2);
		line(ctx, 129, 110, 129, 158, 'rgba(58,39,27,0.32)', 2);
	}

	// Mirror on the door post.
	line(ctx, 30, 166, 36, 166, INK, 3);
	shape(ctx, MIRROR, CHAR, 2.4);
	rect(ctx, 23, 152, 10, 28, GLASS, 1.4, 1.4);
	line(ctx, 24, 156, 32, 156, 'rgba(255,255,255,0.4)', 1.2);

	// Front bumper, lamps and plate.
	shape(ctx, BUMPER_F, CHAR_LIGHT, 2.6);
	line(ctx, 22, 232, 34, 232, 'rgba(255,255,255,0.42)', 1.5);
	rect(ctx, 22, 236, 12, 16, CREAM, 1.5, 1.6);
	ctx.fillStyle = CHAR;
	ctx.fillRect(24, 240, 8, 2);
	ctx.fillRect(24, 244, 6, 2);

	if (fitted) {
		rect(ctx, 38, 190, 12, 18, LAMP, 3, 2.2);
		rect(ctx, 41, 193, 6, 9, CREAM, 1.5, 1.2);
		rect(ctx, 38, 212, 10, 7, AMBER, 2, 1.5);
		line(ctx, 40, 174, 52, 174, 'rgba(43,45,66,0.4)', 2);
		line(ctx, 40, 179, 52, 179, 'rgba(43,45,66,0.32)', 2);
		line(ctx, 40, 184, 52, 184, 'rgba(43,45,66,0.24)', 2);
	}

	// Rear under-run, tail lamps and plate.
	shape(ctx, BUMPER_R, CHAR_LIGHT, 2.4);
	if (fitted) {
		rect(ctx, 696, 230, 13, 11, RED, 2, 1.7);
		rect(ctx, 696, 243, 13, 8, AMBER, 1.5, 1.5);
		rect(ctx, 692, 240, 16, 11, CREAM, 1.5, 1.5);
		ctx.fillStyle = CHAR;
		ctx.fillRect(694, 243, 12, 2);
		ctx.fillRect(697, 247, 7, 2);
		rect(ctx, 672, 230, 14, 8, STEEL, 2, 1.6);
	}

	if (fitted) {
		badge(ctx);
		// Inspection hatch latches and handle.
		rect(ctx, 440, 138, 8, 5, CHAR_LIGHT, 1.5, 1.3);
		rect(ctx, 490, 138, 8, 5, CHAR_LIGHT, 1.5, 1.3);
		rect(ctx, 458, 142, 24, 4, CHROME, 1.5, 1.3);
		// Door handle and a step under the door.
		rect(ctx, 174, 190, 14, 5, CHROME, 2, 1.6);
		line(ctx, 176, 192.5, 186, 192.5, 'rgba(58,39,27,0.4)', 1.3);
		rect(ctx, 138, 240, 46, 6, STEEL, 2, 1.8);
		// Side markers on the waist band.
		for (const mx of [226, 470]) {
			rect(ctx, mx, 187, 13, 7, AMBER, 1.5, 1.3);
		}
		// Reflective chevrons on the tailgate.
		for (let i = 0; i < 3; i++) {
			line(ctx, 654 + i * 12, 232, 662 + i * 12, 218, 'rgba(255,246,228,0.42)', 3);
		}
	}

	// Wheel wells and flares over the paint, then the one wheel piece used twice.
	wheelWell(ctx, WHEEL_L.x, shaded);
	wheelWell(ctx, WHEEL_R.x, shaded);

	if (fitted) {
		mudguard(ctx, WHEEL_L.x, true);
		mudguard(ctx, WHEEL_R.x, true);
	}

	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (finish) {
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	if (lit) {
		// Rim light along the cab roof, hopper crown, tank and rear corner.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(100, 101.5);
		ctx.lineTo(196, 101.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(206, 113.5);
		ctx.lineTo(652, 113.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(688, 138);
		ctx.lineTo(688, 242);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(222, 86);
		ctx.lineTo(324, 86);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(44, 199, 1, 44, 199, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.74)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(44, 199, 30, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under both tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 271, 31, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		tankSheen(ctx);

		// Hopper sheen: a cool sheet of light down the flanks and a warm bounce low down.
		// Glass and tyres are kept out so the finish sits on paint only.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
		ctx.clip(new Path2D(SHELL));
		ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');
		const hopperSheen = ctx.createLinearGradient(220, 118, 640, 238);
		hopperSheen.addColorStop(0, 'rgba(255,255,255,0.2)');
		hopperSheen.addColorStop(0.4, 'rgba(255,255,255,0.02)');
		hopperSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = hopperSheen;
		ctx.fillRect(204, 112, 486, 134);
		const bounce = ctx.createLinearGradient(0, 228, 0, 246);
		bounce.addColorStop(0, 'rgba(255,246,228,0)');
		bounce.addColorStop(1, 'rgba(255,246,228,0.1)');
		ctx.fillStyle = bounce;
		ctx.fillRect(36, 226, 654, 20);

		// A crisp gloss band down the flank, with a lit leading edge.
		const gloss = ctx.createLinearGradient(360, 118, 470, 244);
		gloss.addColorStop(0, 'rgba(255,255,255,0.18)');
		gloss.addColorStop(0.2, 'rgba(255,255,255,0.05)');
		gloss.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = gloss;
		ctx.fillRect(330, 114, 140, 132);
		line(ctx, 352, 120, 438, 118, 'rgba(255,255,255,0.26)', 2);

		// Tailgate sheet-metal sheen.
		const tail = ctx.createLinearGradient(648, 118, 690, 246);
		tail.addColorStop(0, 'rgba(255,255,255,0.14)');
		tail.addColorStop(0.5, 'rgba(255,255,255,0.03)');
		tail.addColorStop(1, 'rgba(0,0,0,0.18)');
		ctx.fillStyle = tail;
		ctx.fillRect(648, 118, 42, 128);

		// Shade the tank drum lays on the crown behind it.
		const tankShade = ctx.createLinearGradient(330, 0, 366, 0);
		tankShade.addColorStop(0, 'rgba(43,45,66,0.18)');
		tankShade.addColorStop(1, 'rgba(43,45,66,0)');
		ctx.fillStyle = tankShade;
		ctx.fillRect(330, 112, 38, 12);
		ctx.restore();

		// Raised lid: a moulded highlight and a darker underside seam.
		ctx.save();
		ctx.clip(new Path2D(LID));
		const lidSheen = ctx.createLinearGradient(0, 96, 0, 112);
		lidSheen.addColorStop(0, 'rgba(255,255,255,0.28)');
		lidSheen.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		lidSheen.addColorStop(1, 'rgba(0,0,0,0.24)');
		ctx.fillStyle = lidSheen;
		ctx.fillRect(564, 94, 88, 22);
		ctx.restore();

		// Glass sparkle down the windscreen and the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(62, 154);
		ctx.lineTo(88, 112);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(140, 154);
		ctx.lineTo(166, 116);
		ctx.stroke();
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(74, 156);
		ctx.lineTo(98, 120);
		ctx.stroke();
		// Faint reflection along the base of both panes.
		ctx.strokeStyle = 'rgba(255,255,255,0.18)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(56, 154);
		ctx.lineTo(120, 154);
		ctx.moveTo(138, 154);
		ctx.lineTo(184, 154);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 166, 132, 3.2);
		glint(ctx, 96, 124, 3.6);

		glint(ctx, 320, 140, 4.6);
		glint(ctx, 466, 206, 4);
		glint(ctx, 592, 130, 4.2);
		glint(ctx, 250, 172, 3.6);
		glint(ctx, 662, 168, 3.2);
		glint(ctx, 282, 92, 3.4);
		glint(ctx, 232, 90, 3);
		glint(ctx, 448, 136, 3.4);
		glint(ctx, 622, 100, 3);
		glint(ctx, 712, 234, 2.6);
		glint(ctx, 340, 251, 2.6);

		// Beacon: outer halo, hot core and a lit dome.
		const halo = ctx.createRadialGradient(164, 86, 2, 164, 86, 32);
		halo.addColorStop(0, 'rgba(255,206,80,0.24)');
		halo.addColorStop(1, 'rgba(255,196,60,0)');
		ctx.fillStyle = halo;
		ctx.beginPath();
		ctx.arc(164, 86, 32, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(164, 86, 1, 164, 86, 21);
		beacon.addColorStop(0, 'rgba(255,214,110,0.7)');
		beacon.addColorStop(0.55, 'rgba(255,196,60,0.28)');
		beacon.addColorStop(1, 'rgba(255,196,60,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(164, 86, 21, 0, Math.PI * 2);
		ctx.fill();

		// Dome streak, hot spot and a warm reflection on the cab roof.
		ctx.save();
		ctx.clip(new Path2D(BEACON));
		const dome = ctx.createLinearGradient(0, 80, 0, 100);
		dome.addColorStop(0, 'rgba(255,255,255,0.52)');
		dome.addColorStop(1, 'rgba(255,183,3,0.26)');
		ctx.fillStyle = dome;
		ctx.fillRect(148, 78, 32, 24);
		line(ctx, 159, 82, 159, 97, 'rgba(255,255,255,0.72)', 2.2);
		line(ctx, 168, 84, 168, 96, 'rgba(255,255,255,0.34)', 1.4);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(162, 83, 2.4, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2.2;
		ctx.stroke(new Path2D(BEACON));
		line(ctx, 148, 98.5, 182, 98.5, 'rgba(255,196,60,0.4)', 2);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealStreetSweeper(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealStreetSweeperLevel(ctx, x, y, scale, 5);
}
