/**
 * Hook-lift truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over lorry facing left carries an open-topped skip container on a hook-lift
 * subframe. The cue that names the vehicle is the raised hydraulic arm with its J hook
 * at the rear and the boxy open-topped container; both survive at level 1 because the
 * arm lives in the body piece and the container is the cargo piece.
 *
 * Level 5 is the production target: shaded, fully fitted, lit and picture-book finished.
 */

import { CHROME, GLASS, INK, STEEL, circle, line, rect, shape, wheel } from './realKit';

const TEAL = '#2A9D8F';
const TEAL_DARK = '#1E7A70';
const NAVY = '#264653';
const NAVY_DARK = '#1A333D';
const NAVY_LIGHT = '#35606E';
const CREAM = '#F3E9D2';
const CREAM_DARK = '#D6C6A1';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';
const RUST = '#B0653C';

/** Art box 700 x 310, road at 250. Front (cab) faces left. */
const CAB =
	'M34,232 L34,128 Q34,112 48,106 L68,100 Q78,96 92,96 L188,96 Q202,96 202,108 L202,232 Z';
const WINDSCREEN =
	'M41,184 L41,132 Q41,122 51,118 L92,112 Q100,111 100,119 L100,178 Q100,184 94,184 Z';
const SIDE_WINDOW =
	'M112,112 L182,112 Q190,112 190,120 L190,170 Q190,176 184,176 L112,176 Q104,176 104,170 L104,120 Q104,112 112,112 Z';

/** The skip container: open top, corrugated near side and a lifting pocket at the rear. */
const CONTAINER =
	'M236,186 L604,186 L604,86 L612,76 L608,76 L608,72 L592,72 L592,76 L248,76 L236,86 Z';
const CONTAINER_PANEL = 'M236,86 L604,86 L604,186 L236,186 Z';
const CONTAINER_TOP = 'M248,76 L612,76 L604,86 L236,86 Z';

/** The raised arm beam, and the body mask that also covers its J hook. */
const BEAM = 'M640,186 L676,182 L648,36 L620,42 Z';
const ARM_MASK =
	'M640,186 L676,182 L648,36 L626,32 L600,24 L588,32 L586,48 L594,60 L606,70 L616,68 L614,56 L600,54 L598,44 L606,38 L616,42 L620,42 Z';

const DOOR = { x: 106, y: 180, w: 86, h: 48 };
const RIBS = [252, 278, 304, 330, 356, 382, 408, 434, 460, 486, 512, 538, 564];

const WHEEL_L = { x: 170, y: 222, r: 28 };
const WHEEL_R = { x: 520, y: 222, r: 28 };
const ARCH = 34;

const BODY_MASK = [
	CAB,
	'M20,216 L34,216 L34,240 L20,240 Z',
	'M10,96 L28,96 L28,124 L10,124 Z',
	'M146,74 L174,74 L174,96 L146,96 Z',
	'M96,232 L130,232 L130,242 L96,242 Z',
	'M202,92 L222,92 L222,186 L202,186 Z',
	'M204,186 L682,186 L682,248 L204,248 Z',
	'M682,212 L698,212 L698,236 L682,236 Z',
	ARM_MASK
].join(' ');

/** Everything inside these panels takes paint grain. Glass and arches punch holes. */
const GRAIN_PANELS = [CAB, CONTAINER_PANEL, BEAM];
const GRAIN_HOLES = [
	WINDSCREEN,
	SIDE_WINDOW,
	'M236,86 L604,86 L604,102 L236,102 Z',
	'M236,164 L604,164 L604,186 L236,186 Z',
	'M24,216 L36,216 L36,240 L24,240 Z',
	'M12,98 L26,98 L26,122 L12,122 Z'
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
	glass.addColorStop(0, 'rgba(255,255,255,0.6)');
	glass.addColorStop(0.44, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(88,166,212,0.3)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Recessed wheel well, drawn under the tyre so the contact sits on the road. */
function wheelWell(
	ctx: CanvasRenderingContext2D,
	wx: number,
	radius: number,
	shaded: boolean
): void {
	ctx.beginPath();
	ctx.arc(wx, WHEEL_L.y, radius, Math.PI, Math.PI * 2);
	ctx.lineTo(wx + radius, 250);
	ctx.lineTo(wx - radius, 250);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, WHEEL_L.y - radius, 0, 250);
		well.addColorStop(0, '#0F1D21');
		well.addColorStop(1, NAVY_LIGHT);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = NAVY_DARK;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke();
}

/** A soft sweep over the pressed corrugation, with a short highlight on each rib. */
function corrugationSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(CONTAINER_PANEL));

	const sweep = ctx.createLinearGradient(250, 88, 438, 190);
	sweep.addColorStop(0, 'rgba(255,255,255,0)');
	sweep.addColorStop(0.3, 'rgba(255,255,255,0.22)');
	sweep.addColorStop(0.52, 'rgba(255,255,255,0.07)');
	sweep.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = sweep;
	ctx.fillRect(236, 86, 368, 100);

	// Alternating rib catches, so the pressed panel reads as metal at game scale.
	for (let i = 0; i < RIBS.length; i++) {
		const rx = RIBS[i];
		const top = 100 + (i % 3) * 2;
		line(ctx, rx + 2.2, top, rx + 2.2, top + 24, 'rgba(255,255,255,0.62)', 1.8);
		line(ctx, rx + 7.4, top + 30, rx + 7.4, 168, 'rgba(58,39,27,0.16)', 1.6);
	}
	ctx.restore();
}

/** Rust blooms and runnels on the container floor seam. */
function containerRust(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(236, 86, 368, 100);
	ctx.clip();

	ctx.fillStyle = RUST;
	const blooms: Array<[number, number, number, number, number]> = [
		[286, 172, 11, 5, 0.2],
		[340, 166, 7, 4, 0.16],
		[468, 174, 14, 5, 0.22],
		[566, 169, 9, 5, 0.18],
		[594, 158, 4, 11, 0.14]
	];
	for (const [bx, by, bw, bh, alpha] of blooms) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.ellipse(bx, by, bw, bh, -0.08, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.globalAlpha = 0.2;
	ctx.fillRect(286, 174, 3, 9);
	ctx.fillRect(470, 176, 3, 7);
	ctx.fillRect(578, 171, 2, 11);
	ctx.restore();
}

/** The open-topped skip container. Cargo piece, sits flat on the hook-lift frame. */
function drawContainer(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, CONTAINER, CREAM);

	// Dark inside of the open box, with the lit inner face of the far wall.
	shape(ctx, CONTAINER_TOP, '#323D41', 1.6);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(CONTAINER_TOP));
		const depth = ctx.createLinearGradient(0, 74, 0, 86);
		depth.addColorStop(0, '#93A6A8');
		depth.addColorStop(0.24, '#4C5A5E');
		depth.addColorStop(0.62, '#313C40');
		depth.addColorStop(1, '#1B2428');
		ctx.fillStyle = depth;
		ctx.fillRect(230, 72, 390, 18);
		ctx.strokeStyle = 'rgba(0,0,0,0.2)';
		ctx.lineWidth = 1.4;
		for (let rx = 264; rx < 600; rx += 26) {
			ctx.beginPath();
			ctx.moveTo(rx, 78);
			ctx.lineTo(rx, 84);
			ctx.stroke();
		}
		ctx.strokeStyle = 'rgba(255,255,255,0.14)';
		for (let rx = 258; rx < 600; rx += 26) {
			ctx.beginPath();
			ctx.moveTo(rx, 78);
			ctx.lineTo(rx, 84);
			ctx.stroke();
		}
		ctx.fillStyle = 'rgba(0,0,0,0.35)';
		ctx.fillRect(232, 83, 386, 4);
		ctx.restore();
	}

	// Pressed corrugation on the near side, then the livery band over it.
	for (const rx of RIBS) {
		line(ctx, rx, 98, rx, 174, 'rgba(255,255,255,0.5)', 2.2);
		line(ctx, rx + 8, 98, rx + 8, 174, 'rgba(58,39,27,0.22)', 2.2);
	}
	ctx.save();
	ctx.globalAlpha = 0.9;
	rect(ctx, 236, 138, 368, 14, TEAL_DARK, 0, 0);
	ctx.restore();
	rect(ctx, 236, 96, 12, 80, NAVY, 1, 2.2);
	rect(ctx, 592, 96, 12, 80, NAVY, 1, 2.2);

	// Far rim, light near-wall top edge, near rail and the lifting pocket.
	line(ctx, 249, 77, 611, 77, CHROME, 2.8);
	line(ctx, 247, 81, 609, 81, 'rgba(255,255,255,0.2)', 1.6);
	line(ctx, 606, 79, 611, 77, 'rgba(255,255,255,0.4)', 1.6);
	rect(ctx, 236, 86, 368, 8, CREAM_DARK, 1, 2.2);
	line(ctx, 240, 87.4, 600, 87.4, 'rgba(255,255,255,0.6)', 1.8);
	line(ctx, 240, 92.6, 600, 92.6, 'rgba(58,39,27,0.34)', 1.6);
	rect(ctx, 236, 93, 368, 3, NAVY, 0, 0);
	rect(ctx, 236, 176, 368, 10, NAVY, 1, 2.4);
	line(ctx, 240, 177.5, 600, 177.5, CHROME, 1.4);
	rect(ctx, 592, 72, 16, 5, NAVY_DARK, 1.5, 1.8);
	line(ctx, 594, 73.6, 606, 73.6, CHROME, 1.3);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(CONTAINER_PANEL));
		const paint = ctx.createLinearGradient(0, 86, 0, 186);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(58,39,27,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(236, 86, 368, 100);
		ctx.restore();
	}

	if (fitted) {
		// Corner castings, rivets and two amber reflectors on the bottom rail.
		rect(ctx, 240, 100, 8, 8, STEEL, 1, 1.4);
		rect(ctx, 592, 100, 8, 8, STEEL, 1, 1.4);
		for (const rx of [250, 320, 390, 460, 530, 590]) {
			circle(ctx, rx, 110, 1.7, CHROME, 0.9);
			circle(ctx, rx, 172, 1.7, CHROME, 0.9);
		}
		rect(ctx, 256, 178, 12, 5, AMBER, 1, 1.2);
		rect(ctx, 572, 178, 12, 5, AMBER, 1, 1.2);
		rect(ctx, 262, 120, 28, 12, TEAL, 2, 1.6);
		rect(ctx, 266, 124, 20, 4, CREAM, 1, 1.1);

		// Tie-down loops on the bottom rail.
		for (const tx of [300, 440, 540]) {
			ctx.beginPath();
			ctx.arc(tx, 181, 5, Math.PI * 0.1, Math.PI * 0.9);
			ctx.strokeStyle = INK;
			ctx.lineWidth = 3;
			ctx.stroke();
			ctx.strokeStyle = STEEL;
			ctx.lineWidth = 1.6;
			ctx.stroke();
		}
	}

	if (finish) {
		// Corrugation sheen, rust weeping from the lower seam and one scuffed rib.
		corrugationSheen(ctx);
		containerRust(ctx);
		line(ctx, 340, 118, 344, 160, 'rgba(58,39,27,0.22)', 1.6);
	}
}

/** Paint sheen, edge light and chrome glint on the raised hydraulic arm. */
function armSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(BEAM));
	const sheen = ctx.createLinearGradient(616, 44, 680, 188);
	sheen.addColorStop(0, 'rgba(255,255,255,0.02)');
	sheen.addColorStop(0.34, 'rgba(255,255,255,0.34)');
	sheen.addColorStop(0.56, 'rgba(255,255,255,0.06)');
	sheen.addColorStop(1, 'rgba(10,54,52,0.24)');
	ctx.fillStyle = sheen;
	ctx.fillRect(614, 30, 72, 162);
	ctx.restore();

	line(ctx, 648, 56, 638, 124, 'rgba(255,255,255,0.66)', 2.2);
	line(ctx, 651, 68, 660, 142, 'rgba(21,92,85,0.5)', 2.4);
	line(ctx, 647, 40, 630, 46, 'rgba(255,255,255,0.72)', 2.4);
	line(ctx, 657, 158, 640, 114, 'rgba(255,255,255,0.9)', 1.4);
}

/** The raised hook arm, its piston and the J hook over the container's lifting pocket. */
function drawArm(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	// Base bracket bolted to the subframe.
	rect(ctx, 646, 186, 30, 14, NAVY_DARK, 2, 2.2);
	shape(ctx, BEAM, TEAL);
	if (shaded) {
		line(ctx, 650, 176, 626, 58, 'rgba(255,255,255,0.42)', 3);
		line(ctx, 666, 172, 640, 52, 'rgba(21,92,85,0.55)', 4);
	}
	line(ctx, 658, 172, 634, 60, 'rgba(58,39,27,0.28)', 1.8);

	// Piston rod running up the beam, inside its silhouette.
	line(ctx, 662, 176, 634, 104, INK, 9);
	line(ctx, 662, 176, 634, 104, CHROME, 5.5);
	line(ctx, 658, 168, 632, 112, 'rgba(255,255,255,0.7)', 1.7);
	line(ctx, 650, 172, 646, 158, STEEL, 6);

	// Pivot pin.
	circle(ctx, 660, 184, 9, STEEL, 2.4);
	circle(ctx, 660, 184, 4, CHROME, 1.8);

	// J hook, opening down onto the container's lifting pocket.
	ctx.beginPath();
	ctx.moveTo(630, 44);
	ctx.lineTo(606, 32);
	ctx.quadraticCurveTo(592, 40, 594, 54);
	ctx.quadraticCurveTo(598, 64, 610, 62);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 11;
	ctx.stroke();
	ctx.strokeStyle = STEEL;
	ctx.lineWidth = 6.5;
	ctx.stroke();

	if (fitted) {
		line(ctx, 596, 50, 606, 46, CHROME, 2);
		circle(ctx, 652, 152, 2.4, CHROME, 1);
		line(ctx, 642, 182, 638, 174, INK, 2);
	}

	if (finish) {
		armSheen(ctx);
		line(ctx, 610, 36, 602, 44, 'rgba(255,255,255,0.75)', 2);
	}
}

/** Deterministic picture-book paint grain on the painted panels only. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(GRAIN_PANELS[0]);
	for (const extra of GRAIN_PANELS.slice(1)) panels.addPath(new Path2D(extra));
	const holes = new Path2D();
	for (const hole of GRAIN_HOLES) holes.addPath(new Path2D(hole));
	panels.addPath(holes);
	ctx.clip(panels, 'evenodd');

	let seed = 59;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 300; i++) {
		const px = 36 + rnd() * 636;
		const py = 48 + rnd() * 184;
		const size = 1.5 + rnd() * 1.6;
		ctx.globalAlpha = 0.08 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 110; i++) {
		const px = 36 + rnd() * 636;
		const py = 48 + rnd() * 184;
		const size = 1.3 + rnd() * 1.3;
		ctx.globalAlpha = 0.14 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();
}

/** Weathered steel grit and rust on the chassis rail, kept clear of the tyres. */
function steelGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const steel = new Path2D('M60,204 L684,204 L684,220 L60,220 Z');
	steel.addPath(new Path2D('M682,212 L698,212 L698,236 L682,236 Z'));
	ctx.clip(steel);

	let seed = 71;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	const clearOfWheels = (px: number, py: number): boolean =>
		Math.hypot(px - WHEEL_L.x, py - WHEEL_L.y) > ARCH + 6 &&
		Math.hypot(px - WHEEL_R.x, py - WHEEL_R.y) > ARCH + 6;

	// Pale grit first, then dark pitting, so the rail reads as rolled steel.
	ctx.fillStyle = CHROME;
	for (let i = 0; i < 260; i++) {
		const px = 62 + rnd() * 620;
		const py = 205 + rnd() * 14;
		if (!clearOfWheels(px, py)) continue;
		ctx.globalAlpha = 0.06 + rnd() * 0.09;
		ctx.fillRect(px, py, 1 + rnd() * 1.8, 1 + rnd() * 1.3);
	}

	ctx.fillStyle = INK;
	for (let i = 0; i < 170; i++) {
		const px = 62 + rnd() * 620;
		const py = 205 + rnd() * 14;
		if (!clearOfWheels(px, py)) continue;
		ctx.globalAlpha = 0.05 + rnd() * 0.09;
		ctx.fillRect(px, py, 1 + rnd() * 1.5, 1 + rnd() * 1.2);
	}

	ctx.fillStyle = RUST;
	for (let i = 0; i < 34; i++) {
		const px = 64 + rnd() * 612;
		const py = 204 + rnd() * 15;
		if (!clearOfWheels(px, py)) continue;
		ctx.globalAlpha = 0.09 + rnd() * 0.13;
		ctx.beginPath();
		ctx.ellipse(px, py, 1.8 + rnd() * 3.4, 1 + rnd() * 1.4, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Two short rust runnels bleeding down from the rail.
	ctx.save();
	ctx.beginPath();
	ctx.rect(60, 204, 624, 16);
	ctx.clip();
	ctx.fillStyle = RUST;
	ctx.globalAlpha = 0.2;
	ctx.fillRect(238, 206, 3, 10);
	ctx.fillRect(560, 208, 2, 8);
	ctx.restore();
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

/** Picture-book hub: bright rim ring, six bolts and a pale centre cap. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.47, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.2, CHROME, 1.1);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.2);
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();
}

/** Small working marks: paint chips on the nose, soot by the stack, exhaust puff. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	const chips: Array<[number, number, number, number, number]> = [
		[38, 228, 6, 2, 0.5],
		[62, 230, 8, 2, 0.42],
		[198, 214, 5, 2, 0.4],
		[214, 198, 6, 2, 0.35],
		[672, 208, 6, 2, 0.4]
	];

	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of chips) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	// Soot softened onto the cab roof beside the stack.
	ctx.save();
	ctx.globalAlpha = 0.12;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(196, 100, 8, 3.4, -0.06, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// Cold exhaust puff drifting back over the container.
	ctx.save();
	ctx.fillStyle = '#DCE7EA';
	ctx.globalAlpha = 0.14;
	ctx.beginPath();
	ctx.ellipse(250, 68, 27, 13, -0.18, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = '#EDF2F4';
	for (const [px, py, pr, alpha] of [
		[222, 88, 6.5, 0.32],
		[234, 77, 8.5, 0.34],
		[248, 66, 8, 0.34],
		[263, 58, 6, 0.32],
		[278, 52, 4, 0.26]
	]) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export function drawRealHookLiftTruckLevel(
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
		ctx.ellipse(360, 255, 322, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Exhaust stack stands in the gap between cab and container.
	rect(ctx, 206, 96, 12, 92, STEEL, 3, 2.5);
	if (shaded) {
		line(ctx, 208.5, 102, 208.5, 184, 'rgba(255,255,255,0.3)', 1.8);
		line(ctx, 215, 102, 215, 184, 'rgba(0,0,0,0.28)', 2);
	}

	// Chassis rail, hook-lift subframe and the rear bumper frame.
	rect(ctx, 60, 204, 624, 16, STEEL, 2, 2.5);
	line(ctx, 64, 216, 680, 216, 'rgba(58,39,27,0.38)', 1.6);
	rect(ctx, 204, 186, 478, 18, NAVY, 2, 2.6);
	line(ctx, 208, 189, 678, 189, CHROME, 1.6);
	if (shaded) {
		line(ctx, 210, 201, 676, 201, NAVY_DARK, 3);
		ctx.fillStyle = 'rgba(0,0,0,0.2)';
		ctx.fillRect(234, 186, 372, 4);
	}
	for (const bx of [280, 400, 500, 640]) {
		rect(ctx, bx, 190, 10, 10, STEEL, 1, 1.4);
	}
	rect(ctx, 682, 212, 16, 24, CHROME, 3, 2.4);
	if (fitted) {
		rect(ctx, 685, 216, 10, 9, RED, 2, 1.8);
		rect(ctx, 685, 227, 10, 6, AMBER, 1.5, 1.4);
		line(ctx, 686, 218, 694, 218, 'rgba(255,255,255,0.6)', 1.4);
		rect(ctx, 650, 228, 24, 10, CREAM, 1, 1.6);
		ctx.fillStyle = NAVY;
		ctx.fillRect(654, 232, 16, 2.4);
	}

	// Mudflaps and the underframe boxes between the two arches.
	rect(ctx, 204, 226, 16, 22, NAVY, 2, 2);
	rect(ctx, 552, 226, 16, 22, NAVY, 2, 2);
	if (fitted) {
		line(ctx, 207, 230, 207, 244, NAVY_LIGHT, 1.6);
		line(ctx, 555, 230, 555, 244, NAVY_LIGHT, 1.6);
	}

	rect(ctx, 214, 220, 86, 26, CHROME, 10, 2.4);
	line(ctx, 240, 222, 240, 244, 'rgba(58,39,27,0.32)', 1.5);
	line(ctx, 272, 222, 272, 244, 'rgba(58,39,27,0.32)', 1.5);
	rect(ctx, 312, 220, 52, 24, NAVY, 3, 2.4);
	rect(ctx, 372, 226, 58, 18, CHROME, 9, 2.2);
	rect(ctx, 572, 222, 54, 24, NAVY, 3, 2.4);
	if (fitted) {
		circle(ctx, 224, 228, 3.2, STEEL, 1.2);
		rect(ctx, 338, 230, 8, 4, CHROME, 1, 1.2);
		line(ctx, 378, 230, 424, 230, 'rgba(255,255,255,0.5)', 1.4);
		rect(ctx, 598, 230, 10, 5, STEEL, 1, 1.2);
	}

	// Cab-over shell.
	shape(ctx, CAB, TEAL);

	// Lower livery skirt and cream belt stripe.
	rect(ctx, 34, 214, 168, 18, NAVY, 0, 0);
	rect(ctx, 34, 210, 168, 4, CREAM, 0, 0);

	// Cab door, kept as a clean rectangle for its own piece.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, TEAL, 4, 2.6);
	rect(ctx, DOOR.x + 2, 210, DOOR.w - 4, 4, CREAM, 0, 0);

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(CAB));
		const paint = ctx.createLinearGradient(0, 96, 0, 232);
		paint.addColorStop(0, 'rgba(255,255,255,0.28)');
		paint.addColorStop(0.4, 'rgba(255,255,255,0.02)');
		paint.addColorStop(1, 'rgba(10,54,52,0.26)');
		ctx.fillStyle = paint;
		ctx.fillRect(30, 94, 176, 140);
		ctx.restore();

		glassShade(ctx, WINDSCREEN, 41, 111, 59, 73);
		glassShade(ctx, SIDE_WINDOW, 104, 112, 86, 64);
		line(ctx, 60, 126, 48, 170, 'rgba(255,255,255,0.5)', 2.6);
	}

	// Front bumper, grille, lamps and the mirror on the A-pillar.
	rect(ctx, 20, 216, 16, 24, CHROME, 4, 2.5);
	rect(ctx, 23, 232, 10, 6, NAVY, 1, 1.4);

	if (fitted) {
		rect(ctx, 38, 186, 20, 9, NAVY, 2, 1.8);
		for (let bar = 0; bar < 2; bar++) {
			line(ctx, 40, 188.5 + bar * 4, 56, 188.5 + bar * 4, CHROME, 1.3);
		}
		circle(ctx, 47, 204, 8, LAMP, 2.2);
		circle(ctx, 47, 204, 3.6, CREAM, 1.2);
		rect(ctx, 38, 214, 12, 6, AMBER, 1.5, 1.3);

		line(ctx, 36, 104, 24, 110, INK, 3);
		line(ctx, 36, 104, 24, 110, STEEL, 1.8);
		rect(ctx, 12, 98, 14, 24, CHROME, 3, 2.2);
		rect(ctx, 14, 101, 10, 18, GLASS, 1, 1.2);

		// Roof markers and the amber beacon.
		rect(ctx, 84, 98, 54, 6, NAVY, 2, 1.8);
		for (let lens = 0; lens < 3; lens++) {
			rect(ctx, 88 + lens * 17, 99, 11, 4, AMBER, 1, 1.1);
		}

		// Wipers, handle, hinge and the entry step.
		line(ctx, 48, 176, 64, 160, INK, 2);
		line(ctx, 70, 178, 84, 164, INK, 1.8);
		rect(ctx, 112, 194, 6, 16, CHROME, 2, 1.4);
		rect(ctx, 108, 186, 4, 10, STEEL, 1, 1.4);
		rect(ctx, 96, 232, 34, 9, CHROME, 3, 2.2);
		rect(ctx, 100, 234, 26, 2, 'rgba(255,255,255,0.55)', 0, 0);

		// Mirror face, stack cap and heat band.
		line(ctx, 18, 104, 18, 116, 'rgba(255,255,255,0.55)', 1.4);
		rect(ctx, 203, 92, 18, 6, STEEL, 3, 2);
		rect(ctx, 206, 150, 12, 4, INK, 1, 1.2);
	}

	// Beacon base and dome sit on the roof at every level.
	rect(ctx, 148, 90, 24, 6, NAVY, 2, 1.8);
	shape(ctx, 'M152,90 Q152,76 160,76 Q168,76 168,90 Z', AMBER, 2);
	if (fitted) {
		line(ctx, 154, 87, 154, 80, 'rgba(255,255,255,0.7)', 2);
	}

	// The raised hook arm lives in the body piece, then the container sits on the frame.
	drawArm(ctx, shaded, fitted, finish);
	drawContainer(ctx, shaded, fitted, finish);

	// Deep arches over the paint, then the one wheel piece used twice.
	wheelWell(ctx, WHEEL_L.x, ARCH, shaded);
	wheelWell(ctx, WHEEL_R.x, ARCH, shaded);

	if (fitted) {
		ctx.strokeStyle = TEAL_DARK;
		ctx.lineWidth = 5;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wx, WHEEL_L.y, ARCH + 3, Math.PI * 1.04, Math.PI * 1.96);
			ctx.stroke();
		}
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.6;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wx, WHEEL_L.y, ARCH + 5, Math.PI * 1.04, Math.PI * 1.96);
			ctx.stroke();
		}
	}

	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light along the cab roof, the frame and the arm.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(72, 98);
		ctx.lineTo(184, 98);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(210, 188);
		ctx.lineTo(604, 188);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(628, 30);
		ctx.lineTo(646, 34);
		ctx.stroke();

		// Headlight glow on the nose.
		const glow = ctx.createRadialGradient(47, 204, 1, 47, 204, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.7)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(47, 204, 26, 0, Math.PI * 2);
		ctx.fill();

		// Beacon glow above the cab.
		ctx.save();
		ctx.globalAlpha = 0.35;
		ctx.fillStyle = '#FFD166';
		ctx.beginPath();
		ctx.arc(160, 80, 13, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 250, 26, 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		steelGrain(ctx);

		glint(ctx, 118, 160, 5.2);
		glint(ctx, 68, 140, 4.6);
		glint(ctx, 352, 132, 4.4);
		glint(ctx, 250, 232, 4);
		glint(ctx, 632, 100, 3.6);
		glint(ctx, 452, 108, 3.8);
		glint(ctx, 300, 214, 3.2);

		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealHookLiftTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealHookLiftTruckLevel(ctx, x, y, scale, 5);
}
