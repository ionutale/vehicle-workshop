/**
 * Tipper lorry art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over heavy dump truck: tall raked steel body with a stepped headboard, chunky
 * ribs, a front-mounted hydraulic ram, navy chassis and deep arches. Front faces left.
 * Level 5 is the production target: shaded, fully fitted, lit and picture-book finished.
 */

import { CHROME, GLASS, INK, STEEL, circle, line, rect, shape, wheel } from './realKit';

const RED = '#E63946';
const RED_DARK = '#C1121F';
const NAVY = '#2B2D42';
const NAVY_LIGHT = '#3A3D55';
const CREAM = '#FFF9EC';
const YELLOW = '#FFD166';
const AMBER = '#FFB703';
const TAIL = '#FF4D6D';

/** Art box 760 x 370, road at 272. Front (cab) faces left. */
const BODY_SHELL =
	'M26,250 L26,220 L38,220 L38,198 L48,190 L48,176 Q48,150 62,138 L80,112 Q88,98 104,98 L264,98 Q276,98 276,112 L276,152 L304,152 L304,46 Q304,40 314,40 L330,40 L330,52 L726,82 L726,250 Z';
const BED_SIDE =
	'M304,230 L304,46 Q304,40 314,40 L330,40 L330,52 L726,82 L726,230 Z';
/** The open top: dark inside of the box between the far rail and the near rail. */
const BED_INTERIOR = 'M330,58 L710,88 L710,106 L330,76 Z';
const NEAR_RAIL = 'M330,76 L710,106 L710,116 L330,86 Z';
const WINDSCREEN =
	'M52,172 L52,158 Q52,148 58,140 L76,118 Q82,108 92,108 L126,108 Q132,108 132,116 L132,164 Q132,172 126,172 Z';
const SIDE_WINDOW =
	'M142,110 Q142,104 150,104 L244,104 Q252,104 252,112 L252,156 Q252,164 244,164 L150,164 Q142,164 142,156 Z';

const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 600, y: 236, r: 36 };
const ARCH_L = 52;
const ARCH_R = 54;
const RIB_X = [336, 386, 436, 486, 536, 586, 636, 686];

/** Y of the near rail's lower edge at a given x, so ribs tuck under the cap. */
const railBottom = (x: number): number => 86 + ((x - 330) * 30) / 396;

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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.65, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.6)');
	glass.addColorStop(0.42, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(96,176,226,0.3)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** The recessed wheel well: a deep dark arch the tyre sits inside. */
function wheelWell(
	ctx: CanvasRenderingContext2D,
	wx: number,
	radius: number,
	shaded: boolean
): void {
	ctx.beginPath();
	ctx.arc(wx, 236, radius, Math.PI, Math.PI * 2);
	ctx.lineTo(wx + radius, 250);
	ctx.lineTo(wx - radius, 250);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, 236 - radius, 0, 250);
		well.addColorStop(0, '#12131F');
		well.addColorStop(1, NAVY_LIGHT);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = NAVY;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.5;
	ctx.stroke();

	if (shaded) {
		ctx.strokeStyle = 'rgba(0,0,0,0.32)';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(wx, 239, radius - 4, Math.PI * 1.04, Math.PI * 1.96);
		ctx.stroke();
	}
}

/** The open bed and the navy band carry no paint grain, so the box stays clean. */
const GRAIN_CUTOUTS = [
	'M330,58 L710,88 L710,116 L330,86 Z',
	'M330,216 L726,216 L726,230 L330,230 Z'
];

/** Deterministic picture-book paint grain, clipped to the painted panels. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(BODY_SHELL);
	for (const cut of GRAIN_CUTOUTS) panels.addPath(new Path2D(cut));
	ctx.clip(panels, 'evenodd');
	let seed = 43;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 340; i++) {
		const px = 28 + rnd() * 696;
		const py = 44 + rnd() * 204;
		const size = 1.6 + rnd() * 1.6;
		ctx.globalAlpha = 0.1 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 96; i++) {
		const px = 28 + rnd() * 696;
		const py = 44 + rnd() * 204;
		const size = 1.4 + rnd() * 1.1;
		ctx.globalAlpha = 0.18 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();
}

/** A four-point paint glint, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
	ctx.lineWidth = 3.4;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 2.1;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 2.2, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: a bright rim ring, six bolts and a pale centre cap. The pattern is
 * mirror-symmetric, so the flipped right wheel, which is the same tile, matches.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.47, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.6, CHROME, 1.2);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();
}

/**
 * Picture-book finishing marks: chrome sheen on the near rail, rivet heads down the
 * headboard and a lit edge on the tailgate post. All inside the body mask.
 */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	line(ctx, 364, 81.4, 426, 86.1, 'rgba(255,255,255,0.55)', 2);
	line(ctx, 566, 96.1, 622, 100.4, 'rgba(255,255,255,0.45)', 2);

	ctx.fillStyle = 'rgba(255,249,236,0.78)';
	for (const ry of [78, 132, 186]) {
		ctx.beginPath();
		ctx.arc(316, ry, 2, 0, Math.PI * 2);
		ctx.fill();
	}

	line(ctx, 712, 86, 712, 100, 'rgba(255,255,255,0.26)', 1.8);
}

export function drawRealDumpTruckLevel(
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
		ctx.ellipse(380, 277, 342, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// One silhouette: cab, ram housing, chassis deck and tipper side.
	shape(ctx, BODY_SHELL, RED);

	// Tipper side panel with a stepped headboard at the front.
	shape(ctx, BED_SIDE, RED);

	// Open top: far rail, dark interior and the steel near rail.
	shape(ctx, BED_INTERIOR, '#1C1D2B', 2);
	ctx.save();
	ctx.clip(new Path2D(BED_INTERIOR));
	const depth = ctx.createLinearGradient(0, 56, 0, 106);
	depth.addColorStop(0, '#6B1620');
	depth.addColorStop(0.4, '#2A1219');
	depth.addColorStop(1, '#12131C');
	ctx.fillStyle = depth;
	ctx.fillRect(330, 56, 380, 54);
	ctx.restore();
	line(ctx, 333, 54.5, 723, 84.5, CHROME, 2);

	// Chassis rail and underbody, visible below the raised tipper floor.
	rect(ctx, 292, 232, 434, 18, STEEL, 0, 2.2);
	rect(ctx, 292, 244, 434, 6, NAVY, 0, 0);
	rect(ctx, 344, 246, 116, 22, CHROME, 7, 2.4);
	line(ctx, 360, 247, 360, 267, STEEL, 2.2);
	line(ctx, 444, 247, 444, 267, STEEL, 2.2);
	line(ctx, 350, 251, 450, 251, 'rgba(255,255,255,0.5)', 1.7);
	circle(ctx, 402, 257, 4, STEEL, 1.4);

	// Rear bumper outside the shell.
	rect(ctx, 726, 236, 24, 18, CHROME, 3, 2.4);
	rect(ctx, 738, 240, 10, 10, NAVY, 2, 1.6);

	// Mudflaps hanging behind each wheel.
	rect(ctx, 186, 250, 17, 20, NAVY, 2, 2);
	rect(ctx, 638, 250, 17, 20, NAVY, 2, 2);
	if (fitted) {
		line(ctx, 189, 254, 189, 266, NAVY_LIGHT, 2);
		line(ctx, 641, 254, 641, 266, NAVY_LIGHT, 2);
	}

	// Headboard face, raised above the side rail.
	rect(ctx, 304, 46, 26, 184, RED_DARK, 2, 2.6);
	rect(ctx, 304, 40, 27, 9, RED_DARK, 2, 2.2);
	line(ctx, 306, 41.5, 329, 41.5, CHROME, 1.6);
	line(ctx, 308, 54, 308, 226, 'rgba(255,255,255,0.22)', 3);
	line(ctx, 322, 52, 322, 226, 'rgba(58,39,27,0.32)', 2.2);
	if (fitted) {
		for (const ry of [86, 112]) {
			rect(ctx, 308, ry, 18, 5, CHROME, 2, 1.6);
		}
	}

	// Chunkier ribs down the tipper side.
	for (const rx of RIB_X) {
		const top = railBottom(rx) + 2;
		rect(ctx, rx, top, 16, 216 - top, RED_DARK, 2, 1.8);
		line(ctx, rx + 3, top + 5, rx + 3, 212, 'rgba(255,255,255,0.22)', 3);
		line(ctx, rx + 13, top + 5, rx + 13, 212, 'rgba(58,39,27,0.3)', 2);
	}

	// Near rail, closing the open top over the ribs.
	shape(ctx, NEAR_RAIL, RED_DARK, 2.2);
	line(ctx, 332, 78, 708, 108, CHROME, 2.6);
	line(ctx, 331, 87, 709, 117, 'rgba(58,39,27,0.34)', 3);

	// Tailgate post at the rear corner.
	rect(ctx, 710, 80, 16, 150, RED_DARK, 1, 2.4);

	// Navy livery band along the tipper floor.
	rect(ctx, 330, 216, 396, 14, NAVY, 0, 2.2);
	line(ctx, 332, 219, 724, 219, CHROME, 1.6);

	// Cab door, kept as a clean rectangle for its own piece.
	rect(ctx, 204, 168, 66, 82, RED, 3, 2.6);
	line(ctx, 206, 176, 268, 176, 'rgba(58,39,27,0.22)', 1.6);
	rect(ctx, 208, 228, 58, 17, RED_DARK, 2, 2);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(BODY_SHELL));
		const paint = ctx.createLinearGradient(0, 40, 0, 250);
		paint.addColorStop(0, 'rgba(255,255,255,0.26)');
		paint.addColorStop(0.38, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(70,8,16,0.26)');
		ctx.fillStyle = paint;
		ctx.fillRect(0, 40, 760, 212);
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
	}

	// Angled hydraulic ram filling the gap between cab and body.
	rect(ctx, 277, 228, 28, 18, NAVY, 2, 2);
	line(ctx, 284, 234, 291, 194, INK, 18);
	line(ctx, 284, 234, 291, 194, STEEL, 15);
	line(ctx, 288, 232, 293, 200, 'rgba(255,255,255,0.28)', 2.5);
	rect(ctx, 282, 186, 20, 10, NAVY, 2, 2.2);
	line(ctx, 291, 196, 298, 160, INK, 11);
	line(ctx, 291, 196, 298, 160, CHROME, 8);
	line(ctx, 294, 194, 299, 170, 'rgba(255,255,255,0.75)', 1.8);
	line(ctx, 297, 180, 304, 174, INK, 2.2);

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);

	if (shaded) {
		glassShade(ctx, WINDSCREEN, 52, 104, 80, 68);
		glassShade(ctx, SIDE_WINDOW, 142, 104, 110, 60);
		line(ctx, 90, 120, 74, 152, 'rgba(255,255,255,0.55)', 3);
	}

	// Front bumper, grille recess and headlight.
	rect(ctx, 26, 222, 24, 28, CHROME, 4, 2.6);
	rect(ctx, 28, 238, 20, 8, NAVY, 2, 1.6);
	line(ctx, 29, 224, 48, 224, 'rgba(255,255,255,0.6)', 1.8);

	if (fitted) {
		// Grille and lamps on the nose.
		rect(ctx, 38, 196, 10, 26, NAVY, 2, 2.2);
		for (let bar = 0; bar < 3; bar++) {
			line(ctx, 39, 202 + bar * 5, 47, 202 + bar * 5, CHROME, 1.6);
		}
		circle(ctx, 43, 216, 6.5, YELLOW, 2.2);
		circle(ctx, 43, 216, 3.2, CREAM, 1.2);
		rect(ctx, 30, 226, 7, 7, AMBER, 1.8, 1.5);

		// Mirror on the cab's A-pillar.
		line(ctx, 52, 102, 79, 116, INK, 3.6);
		line(ctx, 52, 102, 79, 116, STEEL, 2.4);
		rect(ctx, 36, 90, 18, 24, CHROME, 3, 2.2);
		line(ctx, 39, 95, 51, 95, 'rgba(255,255,255,0.65)', 1.6);

		// Roof marker lamps on a low base bar.
		rect(ctx, 128, 90, 96, 8, NAVY, 3, 2.2);
		for (let lens = 0; lens < 5; lens++) {
			rect(ctx, 132 + lens * 18, 91, 12, 6, AMBER, 1.5, 1.2);
		}

		// Cab details: wipers, handle, step, hinge.
		line(ctx, 60, 166, 78, 148, INK, 2.2);
		line(ctx, 84, 168, 98, 154, INK, 2);
		rect(ctx, 250, 194, 14, 4, CHROME, 2, 1.5);
		rect(ctx, 206, 180, 4, 12, STEEL, 1.5, 1.4);
		rect(ctx, 232, 242, 34, 6, CHROME, 2, 1.6);

		// Side marker lamps along the lower rail.
		for (const mx of [346, 398, 450, 502, 674, 710]) {
			rect(ctx, mx, 219, 13, 6, AMBER, 1.5, 1.3);
		}

		// Tailgate seam and hinges.
		line(ctx, 706, 96, 706, 228, 'rgba(58,39,27,0.4)', 2.4);
		for (const hy of [104, 156, 208]) {
			rect(ctx, 706, hy, 18, 7, STEEL, 2, 1.5);
		}

		// Rear lights and plate.
		rect(ctx, 714, 200, 10, 15, TAIL, 2, 1.8);
		rect(ctx, 714, 218, 10, 11, AMBER, 2, 1.5);
		rect(ctx, 714, 232, 10, 8, CREAM, 1, 1.4);
		rect(ctx, 678, 236, 24, 9, CREAM, 1, 1.8);
		ctx.fillStyle = NAVY;
		ctx.fillRect(681, 239, 18, 3);

		// Hydraulic hose from the ram base.
		line(ctx, 281, 232, 270, 224, INK, 2.4);
	}

	// Deep wheel arches over the paint, then the one wheel piece used twice.
	wheelWell(ctx, WHEEL_L.x, ARCH_L, shaded);
	wheelWell(ctx, WHEEL_R.x, ARCH_R, shaded);

	if (fitted) {
		ctx.strokeStyle = RED_DARK;
		ctx.lineWidth = 5;
		for (const [wx, ar] of [
			[WHEEL_L.x, ARCH_L],
			[WHEEL_R.x, ARCH_R]
		]) {
			ctx.beginPath();
			ctx.arc(wx, 236, ar + 3, Math.PI * 1.03, Math.PI * 1.97);
			ctx.stroke();
		}
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.7;
		for (const [wx, ar] of [
			[WHEEL_L.x, ARCH_L],
			[WHEEL_R.x, ARCH_R]
		]) {
			ctx.beginPath();
			ctx.arc(wx, 236, ar + 5.5, Math.PI * 1.03, Math.PI * 1.97);
			ctx.stroke();
		}
	}

	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (finish) {
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	if (lit) {
		// Rim light along the cab roof and the tipper rail.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(110, 99);
		ctx.lineTo(262, 99);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(334, 56);
		ctx.lineTo(722, 83);
		ctx.stroke();

		// Headlight glow.
		const glow = ctx.createRadialGradient(43, 216, 1, 43, 216, 27);
		glow.addColorStop(0, 'rgba(255,240,150,0.62)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(43, 216, 27, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 272, 33, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint glints clear of the tyre circles; the one at the side window sits on the
		// glass edge and reads as a reflection.
		glint(ctx, 470, 200, 6);
		glint(ctx, 250, 120, 5.6);
		glint(ctx, 354, 100, 5);
		glint(ctx, 690, 210, 5);
		line(ctx, 74, 114, 92, 146, 'rgba(255,255,255,0.5)', 2.6);
		line(ctx, 150, 112, 166, 146, 'rgba(255,255,255,0.45)', 2.4);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealDumpTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealDumpTruckLevel(ctx, x, y, scale, 5);
}
