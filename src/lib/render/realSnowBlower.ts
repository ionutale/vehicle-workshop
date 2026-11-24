/**
 * Snow blower art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over truck facing left with a wide auger/intake drum hung off the front bumper,
 * a visible impeller fan on its flank and a tall gooseneck discharge chute — the cue that
 * names the vehicle. Off-white bodywork with navy livery, beacon, work lamps, hazard
 * stripes and snow-flecked tyres.
 *
 * The chute, cab and rear deck are the body piece; the drum with its fan and intake is the
 * cargo piece. Level 5 is the production target: shaded, fully fitted, lit and finished with
 * paint grain, chute and drum sheen, glints, hub hardware, a cold exhaust puff and snow
 * blowing out of the spout.
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

const WHITE = '#E9ECEF';
const WHITE_SOFT = '#F7F9FA';
const NAVY = '#1D3557';
const NAVY_DARK = '#12233D';
const NAVY_LIGHT = '#2F517A';
const CREAM = '#FFF9EC';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** Art box 680 x 320, road at 252. Front (blower and cab) faces left. */
const MAIN =
	'M168,246 L168,176 Q168,164 173,156 L180,138 Q184,128 196,128 L306,128 Q320,128 321,142 L321,158 L654,158 Q668,158 670,172 L670,246 Z';

/**
 * Discharge chute: a vertical stack off the drum crown that elbows forward over the fan and
 * ends in a spout pointing right. Quarter-annulus at the bend so it reads as a pipe.
 */
const CHUTE =
	'M112,142 L112,74 A46,46 0 0 1 158,28 L224,28 L224,62 L158,62 A12,12 0 0 0 146,74 L146,142 Z';

/** Rear window of the spout, drawn as a dark mouth under the lip. */
const SPOUT_MOUTH = 'M217,30 L226,30 L226,60 L217,60 Z';

const BEACON_BASE = 'M258,120 L298,120 L298,128 L258,128 Z';
const BEACON_DOME = 'M262,120 L262,112 Q262,98 278,98 Q294,98 294,112 L294,120 Z';
const MIRROR = 'M150,118 L164,118 L164,146 L150,146 Z';
const EXHAUST = 'M338,124 L350,124 L350,158 L338,158 Z';
const BUMPER_R = 'M670,222 L680,222 L680,246 L670,246 Z';
const MUDFLAP_L = 'M232,246 L248,246 L248,252 L232,252 Z';
const MUDFLAP_R = 'M552,246 L568,246 L568,252 L552,252 Z';

/**
 * Auger/impeller drum hung on the front, mouth at the road. The raised boss on its crown is
 * the chute collar, so the pipe visibly grows out of the casing.
 */
const HOUSING =
	'M22,249 L22,198 Q22,184 32,176 L50,158 Q56,150 70,150 L108,150 L108,140 L152,140 L152,150 L154,150 Q162,150 162,160 L162,249 Z';
const SCOOP = 'M22,249 L22,228 Q22,218 30,214 L60,204 Q70,201 76,210 L82,222 L82,249 Z';

/** Cab glass: raked windscreen plus the door pane, both well clear of the front drum. */
const WINDSCREEN =
	'M172,184 L172,178 Q172,168 177,160 L188,144 Q192,136 200,136 L212,136 Q220,136 220,144 L220,176 Q220,184 212,184 Z';
const SIDE_GLASS =
	'M240,144 Q240,136 248,136 L300,136 Q308,136 308,144 L308,196 Q308,204 300,204 L248,204 Q240,204 240,194 Z';

/** Livery bands, also used to keep the paint grain off the navy panels. */
const WAIST = 'M321,182 L670,182 L670,198 L321,198 Z';
const SKIRT = 'M321,232 L670,232 L670,246 L321,246 Z';
const CAB_SKIRT = 'M168,232 L321,232 L321,246 L168,246 Z';
const REAR_PANEL = 'M592,168 L666,168 L666,232 L592,232 Z';

const FAN = { x: 102, y: 194, r: 36 };
const WHEEL_L = { x: 200, y: 222, r: 30 };
const WHEEL_R = { x: 520, y: 222, r: 30 };

/** Navy panels, glass and tyres carry no paint grain. */
const GRAIN_CUTOUTS = [
	WAIST,
	SKIRT,
	CAB_SKIRT,
	REAR_PANEL,
	WINDSCREEN,
	SIDE_GLASS,
	circleMask(WHEEL_L.x, WHEEL_L.y, 44),
	circleMask(WHEEL_R.x, WHEEL_R.y, 44)
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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.62)');
	glass.addColorStop(0.44, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(80,160,205,0.3)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** A recessed wheel well under the tyre, ringed by a navy mudguard lip. */
function wheelWell(ctx: CanvasRenderingContext2D, cx: number, shaded: boolean): void {
	const radius = 38;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, radius, Math.PI, Math.PI * 2);
	ctx.lineTo(cx + radius, 246);
	ctx.lineTo(cx - radius, 246);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, WHEEL_L.y - radius, 0, 246);
		well.addColorStop(0, '#0C1626');
		well.addColorStop(1, NAVY_LIGHT);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = NAVY_DARK;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke();

	// Mudguard lip: a navy band with an ink edge, drawn under the tyre art.
	ctx.strokeStyle = NAVY;
	ctx.lineWidth = 6;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, radius + 2.5, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, radius + 5.5, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();
}

/**
 * The naming cue: a cast impeller seen through its side plate. Nine curved chrome vanes on
 * a recessed navy eye, a bolted steel guard ring and a scroll lip that feeds the chute — so
 * it can never be mistaken for the tyre.
 */
function impeller(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	r: number,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	circle(ctx, cx, cy, r, shaded ? STEEL : '#5C6472', 2.8);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, r, 0, Math.PI * 2);
		ctx.clip();
		const ring = ctx.createLinearGradient(0, cy - r, 0, cy + r);
		ring.addColorStop(0, 'rgba(255,255,255,0.46)');
		ring.addColorStop(0.5, 'rgba(255,255,255,0.04)');
		ring.addColorStop(1, 'rgba(10,18,30,0.42)');
		ctx.fillStyle = ring;
		ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
		ctx.restore();
	}

	// Recessed eye and the fan itself.
	circle(ctx, cx, cy, r * 0.82, '#16233A', 2.2);
	for (let i = 0; i < 9; i++) {
		const a = (i / 9) * Math.PI * 2 + 0.22;
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * r * 0.28, cy + Math.sin(a) * r * 0.28);
		ctx.quadraticCurveTo(
			cx + Math.cos(a + 0.34) * r * 0.6,
			cy + Math.sin(a + 0.34) * r * 0.6,
			cx + Math.cos(a + 0.16) * r * 0.74,
			cy + Math.sin(a + 0.16) * r * 0.74
		);
		ctx.strokeStyle = INK;
		ctx.lineWidth = 7.5;
		ctx.stroke();
		ctx.strokeStyle = fitted ? '#DEE6F0' : CHROME;
		ctx.lineWidth = 4.8;
		ctx.stroke();
	}

	// Scroll lip wrapping the eye toward the chute throat.
	ctx.strokeStyle = shaded ? CHROME : STEEL;
	ctx.lineWidth = 3.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.82, -Math.PI * 0.98, -Math.PI * 0.1);
	ctx.stroke();

	// Hub and guard hardware.
	circle(ctx, cx, cy, r * 0.26, CHROME, 2.2);
	circle(ctx, cx, cy, r * 0.11, NAVY_DARK, 1.6);
	if (fitted) {
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
			circle(ctx, cx + Math.cos(a) * (r - 3.4), cy + Math.sin(a) * (r - 3.4), 1.7, CHROME, 1);
		}
		for (let i = 0; i < 5; i++) {
			const a = (i / 5) * Math.PI * 2 + 0.3;
			circle(ctx, cx + Math.cos(a) * r * 0.2, cy + Math.sin(a) * r * 0.2, 1.5, STEEL, 1);
		}
	}
	if (finish) {
		// Cold sheen along the shroud guard ring and the polished vane crown.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(cx, cy, r + 5, Math.PI * 1.06, Math.PI * 1.44);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.7, Math.PI * 1.1, Math.PI * 1.5);
		ctx.stroke();
		circle(ctx, cx - r * 0.05, cy - r * 0.05, r * 0.06, CREAM, 1.2);
	}
}

/** Level-5 paint grain on the off-white panels only. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(MAIN);
	for (const cut of GRAIN_CUTOUTS) panels.addPath(new Path2D(cut));
	ctx.clip(panels, 'evenodd');

	let seed = 97;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 360; i++) {
		const px = 170 + rnd() * 498;
		const py = 130 + rnd() * 114;
		const size = 1.4 + rnd() * 1.5;
		ctx.globalAlpha = 0.07 + rnd() * 0.05;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = WHITE_SOFT;
	for (let i = 0; i < 130; i++) {
		const px = 170 + rnd() * 498;
		const py = 130 + rnd() * 114;
		const size = 1.2 + rnd() * 1.2;
		ctx.globalAlpha = 0.16 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// A cool powder mottle and hard white flecks so the paint reads sprayed at tile scale.
	ctx.fillStyle = 'rgba(118,146,178,0.9)';
	for (let i = 0; i < 110; i++) {
		const px = 170 + rnd() * 498;
		const py = 130 + rnd() * 114;
		const size = 1 + rnd() * 1.1;
		ctx.globalAlpha = 0.08 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 90; i++) {
		const px = 170 + rnd() * 498;
		const py = 130 + rnd() * 114;
		const size = 0.8 + rnd() * 0.9;
		ctx.globalAlpha = 0.22 + rnd() * 0.16;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();
}

/** A four-point glint that survives the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.9;
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

/** Six-bolt picture-book hub; the pattern is mirror symmetric for the flipped tile. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.47, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.3, CHROME, 1.1);
	}

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
		circle(ctx, x + Math.cos(a) * r * 0.56, y + Math.sin(a) * r * 0.56, 1.4, '#B9C3D1', 1);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.2);
	ctx.strokeStyle = 'rgba(58,39,27,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.25, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();

	// Snow packed into the tread, mirror symmetric either side.
	ctx.fillStyle = 'rgba(247,249,250,0.5)';
	for (const [dx, dy, dr] of [
		[-0.72, -0.46, 1.5],
		[-0.4, -0.82, 1.2],
		[0.36, -0.84, 1.4],
		[0.74, -0.44, 1.2],
		[0.82, 0.28, 1.3],
		[-0.8, 0.34, 1.2]
	] as const) {
		ctx.beginPath();
		ctx.arc(x + dx * r, y + dy * r, dr, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** Level-5 snow spray out of the spout, and a cold exhaust puff off the stack. */
function weatherMarks(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.fillStyle = WHITE_SOFT;
	for (const [sx, sy, sr, alpha] of [
		[236, 34, 2.6, 0.85],
		[244, 40, 2, 0.7],
		[252, 31, 1.7, 0.6],
		[260, 44, 2.3, 0.5],
		[238, 52, 1.8, 0.55],
		[248, 58, 1.4, 0.42],
		[268, 36, 1.3, 0.36],
		[276, 50, 1.1, 0.3],
		[284, 44, 1.5, 0.3],
		[272, 62, 1.2, 0.26],
		[252, 25, 1.4, 0.4]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(sx, sy, sr, 0, Math.PI * 2);
		ctx.fill();
	}

	// Snow dust kicked up around the intake mouth.
	for (const [dx, dy, dr, alpha] of [
		[14, 242, 2.6, 0.5],
		[18, 236, 1.9, 0.4],
		[10, 248, 1.8, 0.42],
		[24, 246, 1.5, 0.32]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(dx, dy, dr, 0, Math.PI * 2);
		ctx.fill();
	}

	// Exhaust puff.
	ctx.fillStyle = '#C9D2DE';
	for (const [px, py, pr, alpha] of [
		[344, 118, 4.4, 0.45],
		[349, 112, 3.4, 0.36],
		[344, 106, 2.6, 0.28],
		[351, 122, 2.2, 0.22],
		[341, 101, 1.9, 0.2]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Snow crest along the deck roof and the drum crown.
	ctx.save();
	ctx.strokeStyle = 'rgba(255,255,255,0.85)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(332, 156);
	ctx.quadraticCurveTo(400, 152, 470, 156);
	ctx.quadraticCurveTo(530, 159, 566, 156);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(64, 150);
	ctx.quadraticCurveTo(84, 146, 106, 150);
	ctx.stroke();
	ctx.restore();
}

/** Snow-flecked tyres: flecks packed between the tread bars of the wheel art. */
function snowFlecks(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.save();
	ctx.fillStyle = 'rgba(247,249,250,0.55)';
	for (let i = 0; i < 10; i++) {
		const a = (i / 10) * Math.PI * 2 + 0.25;
		const rr = r * (i % 2 === 0 ? 0.88 : 0.8);
		const size = 1.1 + (i % 3) * 0.4;
		ctx.beginPath();
		ctx.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr, size, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export function drawRealSnowBlowerLevel(
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
		ctx.ellipse(380, 259, 300, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis rail and underbody, painted inside the shell so the body mask keeps them.
	rect(ctx, 168, 240, 502, 12, '#2E3542', 0, 0);
	rect(ctx, 168, 240, 502, 2.4, STEEL, 0, 0);

	// One silhouette: cab-over nose, cab roof and the long rear deck.
	shape(ctx, MAIN, WHITE);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(MAIN));
		const paint = ctx.createLinearGradient(0, 128, 0, 246);
		paint.addColorStop(0, 'rgba(255,255,255,0.38)');
		paint.addColorStop(0.38, 'rgba(255,255,255,0.04)');
		paint.addColorStop(1, 'rgba(35,52,74,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(166, 126, 506, 122);
		ctx.restore();
	}

	if (finish) paintGrain(ctx);

	// Livery: navy waist band, working skirt and cab skirt, all inside the shell.
	rect(ctx, 321, 182, 349, 16, NAVY, 0, 2.4);
	line(ctx, 325, 184, 666, 184, 'rgba(255,255,255,0.28)', 2);
	rect(ctx, 321, 232, 349, 14, NAVY, 0, 2.2);
	rect(ctx, 168, 232, 153, 14, NAVY, 0, 2.2);

	// Rear panel with the fleet name, clear of the rear wheel arch.
	rect(ctx, 592, 168, 74, 64, NAVY, 2, 2.6);
	ctx.fillStyle = CREAM;
	ctx.font = '800 20px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('SNOW', 600, 198);
	ctx.fillStyle = 'rgba(255,249,236,0.72)';
	ctx.font = '700 8px ui-rounded, system-ui, sans-serif';
	ctx.fillText('BLOWER', 601, 212);

	// Engine louvres and deck seams.
	rect(ctx, 352, 164, 96, 30, NAVY_DARK, 2, 2.2);
	if (fitted) {
		ctx.fillStyle = 'rgba(233,236,239,0.65)';
		for (let i = 0; i < 4; i++) ctx.fillRect(358, 169 + i * 6, 84, 2);
		ctx.fillStyle = WHITE;
	}
	line(ctx, 470, 158, 470, 232, 'rgba(35,52,74,0.28)', 1.8);
	line(ctx, 560, 158, 560, 232, 'rgba(35,52,74,0.2)', 1.6);

	// Fuel tank slung under the deck between the axles.
	rect(ctx, 352, 212, 72, 22, CHROME, 5, 2.4);
	line(ctx, 358, 216, 418, 216, 'rgba(255,255,255,0.55)', 1.6);
	rect(ctx, 376, 214, 8, 18, STEEL, 1.5, 1.6);
	rect(ctx, 396, 214, 8, 18, STEEL, 1.5, 1.6);
	circle(ctx, 364, 221, 2.6, '#8A93A3', 1.2);

	// Cab door, seams, navy kick panel and the step under it.
	rect(ctx, 240, 212, 68, 34, WHITE, 2, 2.4);
	line(ctx, 242, 214, 306, 214, 'rgba(35,52,74,0.22)', 1.6);
	ctx.fillStyle = NAVY;
	ctx.fillRect(242, 236, 64, 8);
	rect(ctx, 292, 224, 12, 5, CHROME, 2, 1.6);

	// Wheel wells, clipped to the body so no cavity spills past the silhouette.
	ctx.save();
	ctx.clip(new Path2D(MAIN));
	wheelWell(ctx, WHEEL_L.x, shaded);
	wheelWell(ctx, WHEEL_R.x, shaded);
	ctx.restore();

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 174, 134, 46, 52);
		glassShade(ctx, SIDE_GLASS, 240, 134, 70, 72);
		line(ctx, 186, 148, 200, 172, 'rgba(255,255,255,0.5)', 3);
		line(ctx, 250, 146, 272, 178, 'rgba(255,255,255,0.34)', 2.4);
	}
	if (fitted) {
		line(ctx, 180, 178, 193, 166, INK, 2.2);
		line(ctx, 196, 180, 209, 168, INK, 2);
		line(ctx, 234, 138, 234, 200, 'rgba(58,39,27,0.3)', 2);
	}

	// The discharge chute: navy pipework on a bolted steel collar.
	shape(ctx, CHUTE, NAVY);
	ctx.save();
	ctx.clip(new Path2D(CHUTE));
	if (shaded) {
		const pipe = ctx.createLinearGradient(108, 0, 226, 0);
		pipe.addColorStop(0, 'rgba(255,255,255,0.24)');
		pipe.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		pipe.addColorStop(1, 'rgba(6,16,28,0.3)');
		ctx.fillStyle = pipe;
		ctx.fillRect(106, 24, 124, 130);
		const mouth = ctx.createLinearGradient(0, 28, 0, 62);
		mouth.addColorStop(0, 'rgba(6,16,28,0.34)');
		mouth.addColorStop(1, 'rgba(255,255,255,0.08)');
		ctx.fillStyle = mouth;
		ctx.fillRect(158, 28, 68, 34);
	}
	// Ribs around the stack and a sheen down the outer edge.
	line(ctx, 114, 112, 144, 112, 'rgba(255,255,255,0.4)', 4);
	line(ctx, 114, 134, 144, 134, 'rgba(255,255,255,0.2)', 2.4);
	line(ctx, 160, 34, 158, 58, 'rgba(255,255,255,0.16)', 2.4);
	line(ctx, 114, 76, 124, 60, 'rgba(255,255,255,0.2)', 2.2);
	ctx.restore();

	// Spout mouth, lip and its reinforcement band.
	shape(ctx, SPOUT_MOUTH, '#0B1420', 2);
	ctx.save();
	ctx.clip(new Path2D(SPOUT_MOUTH));
	const throat = ctx.createLinearGradient(217, 0, 228, 0);
	throat.addColorStop(0, '#0B1420');
	throat.addColorStop(1, 'rgba(120,150,180,0.5)');
	ctx.fillStyle = throat;
	ctx.fillRect(215, 28, 14, 34);
	ctx.restore();
	rect(ctx, 224, 26, 7, 38, STEEL, 2, 1.8);
	if (fitted) {
		rect(ctx, 196, 28, 10, 34, STEEL, 0, 1.8);
		for (const ry of [33, 45, 57]) circle(ctx, 201, ry, 1.5, CHROME, 1);
	}

	// The auger/impeller drum: shell, fan and intake.
	shape(ctx, HOUSING, WHITE);
	ctx.save();
	ctx.clip(new Path2D(HOUSING));
	if (shaded) {
		const drum = ctx.createLinearGradient(0, 150, 0, 249);
		drum.addColorStop(0, 'rgba(255,255,255,0.36)');
		drum.addColorStop(0.5, 'rgba(255,255,255,0.03)');
		drum.addColorStop(1, 'rgba(35,52,74,0.26)');
		ctx.fillStyle = drum;
		ctx.fillRect(20, 138, 144, 113);
	}
	// Navy chute-collar boss on the crown, then the working band along the foot.
	ctx.fillStyle = NAVY;
	ctx.fillRect(108, 140, 44, 10);
	ctx.fillRect(24, 231, 138, 18);
	ctx.fillStyle = 'rgba(255,255,255,0.2)';
	ctx.fillRect(24, 231, 138, 2);
	ctx.restore();

	// Guard-ring shading behind the fan: a pale shroud so it never reads as another tyre.
	circle(ctx, FAN.x, FAN.y, FAN.r + 5, shaded ? '#B9C4D2' : CHROME, 2.4);
	impeller(ctx, FAN.x, FAN.y, FAN.r, shaded, fitted, finish);

	// Bolted steel collar where the chute grows out of the drum.
	rect(ctx, 110, 142, 40, 6, STEEL, 1.5, 2);
	for (const bx of [116, 128, 140]) circle(ctx, bx, 145, 1.4, CHROME, 1);

	// Intake scoop at the road, with the auger flighting visible through the mouth.
	shape(ctx, SCOOP, '#16233A', 2.6);
	ctx.save();
	ctx.clip(new Path2D(SCOOP));
	const scoopShade = ctx.createLinearGradient(22, 210, 62, 249);
	scoopShade.addColorStop(0, '#24344A');
	scoopShade.addColorStop(1, '#0A1119');
	ctx.fillStyle = scoopShade;
	ctx.fillRect(20, 200, 64, 51);
	// Auger flighting: pale screw edges across the intake.
	ctx.strokeStyle = 'rgba(201,210,222,0.8)';
	ctx.lineWidth = 2.2;
	for (const fx of [28, 42, 56, 70]) {
		ctx.beginPath();
		ctx.moveTo(fx, 210);
		ctx.quadraticCurveTo(fx + 7, 231, fx + 3, 247);
		ctx.stroke();
	}
	ctx.strokeStyle = STEEL;
	ctx.lineWidth = 3.4;
	ctx.beginPath();
	ctx.moveTo(24, 233);
	ctx.lineTo(80, 233);
	ctx.stroke();
	ctx.restore();
	line(ctx, 24, 233, 80, 233, 'rgba(255,255,255,0.2)', 1.4);
	line(ctx, 23, 248, 81, 248, 'rgba(255,255,255,0.75)', 2);

	if (fitted) {
		// Hazard stripe along the drum foot, right of the intake.
		ctx.save();
		ctx.clip(new Path2D('M84,231 L162,231 L162,249 L84,249 Z'));
		ctx.fillStyle = CREAM;
		for (let i = 0; i < 5; i++) {
			ctx.beginPath();
			ctx.moveTo(82 + i * 16, 249);
			ctx.lineTo(92 + i * 16, 249);
			ctx.lineTo(102 + i * 16, 231);
			ctx.lineTo(92 + i * 16, 231);
			ctx.closePath();
			ctx.fill();
		}
		ctx.restore();
		// Drum plate and guard bolts.
		rect(ctx, 146, 164, 14, 28, NAVY, 2, 1.8);
		line(ctx, 149, 169, 157, 169, CREAM, 1.4);
		line(ctx, 149, 174, 155, 174, 'rgba(255,249,236,0.7)', 1.2);
		line(ctx, 156, 196, 156, 227, 'rgba(35,52,74,0.24)', 1.6);
		// Rear-skirt chevrons.
		ctx.save();
		ctx.clip(new Path2D('M574,232 L670,232 L670,246 L574,246 Z'));
		ctx.fillStyle = 'rgba(233,236,239,0.75)';
		for (let i = 0; i < 6; i++) {
			ctx.beginPath();
			ctx.moveTo(572 + i * 16, 246);
			ctx.lineTo(580 + i * 16, 246);
			ctx.lineTo(590 + i * 16, 232);
			ctx.lineTo(582 + i * 16, 232);
			ctx.closePath();
			ctx.fill();
		}
		ctx.restore();
	}

	// Beacon with its mounting bar on the cab roof.
	shape(ctx, BEACON_BASE, NAVY, 2.2);
	shape(ctx, BEACON_DOME, LAMP, 2.2);
	ctx.save();
	ctx.clip(new Path2D(BEACON_DOME));
	const dome = ctx.createLinearGradient(0, 98, 0, 120);
	dome.addColorStop(0, 'rgba(255,255,255,0.7)');
	dome.addColorStop(1, 'rgba(255,183,3,0.35)');
	ctx.fillStyle = dome;
	ctx.fillRect(260, 96, 36, 26);
	ctx.restore();

	// Mirror on the cab front post.
	line(ctx, 172, 140, 164, 133, INK, 3.2);
	shape(ctx, MIRROR, NAVY, 2.4);
	rect(ctx, 152, 121, 9, 22, GLASS, 2, 1.4);
	line(ctx, 154, 124, 154, 140, 'rgba(255,255,255,0.45)', 1.4);

	if (fitted) {
		// Twin work lamps on the cab brow.
		for (const lx of [198, 224]) {
			rect(ctx, lx, 116, 20, 12, NAVY_DARK, 2, 2);
			rect(ctx, lx + 2, 118, 8, 8, LAMP, 1, 1.4);
			line(ctx, lx + 12, 118, lx + 12, 126, 'rgba(58,39,27,0.5)', 1.2);
			line(ctx, lx + 14, 121, lx + 18, 121, 'rgba(255,255,255,0.5)', 1.2);
		}
		// Deck side markers on the waist band.
		for (const mx of [332, 574]) rect(ctx, mx, 186, 12, 6, AMBER, 1.5, 1.2);
	}

	// Inlet hatch on the deck flank.
	rect(ctx, 486, 164, 72, 18, '#F2F5F8', 2, 1.8);
	line(ctx, 490, 167, 554, 167, 'rgba(35,52,74,0.24)', 1.4);
	for (const hx of [496, 548]) rect(ctx, hx, 169, 8, 4, CHROME, 1, 1.2);

	// Rear bumper, lamp cluster and plate.
	shape(ctx, BUMPER_R, CHROME, 2.4);
	rect(ctx, 672, 226, 7, 7, RED, 2, 1.5);
	rect(ctx, 672, 235, 7, 6, AMBER, 2, 1.4);
	rect(ctx, 654, 236, 12, 8, CREAM, 1.5, 1.4);

	// Mudflaps behind each tyre.
	shape(ctx, MUDFLAP_L, NAVY, 1.8);
	shape(ctx, MUDFLAP_R, NAVY, 1.8);

	// Exhaust stack behind the cab.
	shape(ctx, EXHAUST, CHROME, 2.4);
	rect(ctx, 339, 126, 10, 3, STEEL, 1, 1.4);
	rect(ctx, 339, 140, 10, 4, NAVY_DARK, 1, 1.2);
	if (fitted) circle(ctx, 344, 130, 2.2, '#8A93A3', 1);

	// One wheel piece used twice; the rear tile is the front mirrored.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (fitted) {
		snowFlecks(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		snowFlecks(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// Headlamp and indicator on the drum's upper front.
	circle(ctx, 38, 170, 7, CHROME, 2.2);
	circle(ctx, 38, 170, 5.4, LAMP, 1.6);
	circle(ctx, 37, 169, 2, CREAM, 1);
	if (fitted) circle(ctx, 38, 189, 4, AMBER, 1.4);

	if (lit) {
		// Headlamp beam, cut off by the drum face behind it.
		const glow = ctx.createRadialGradient(38, 170, 1, 38, 170, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.55)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(38, 170, 26, 0, Math.PI * 2);
		ctx.fill();

		// Rim light along the cab roof, deck and chute.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(198, 127);
		ctx.lineTo(306, 127);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(326, 157);
		ctx.lineTo(650, 157);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(115, 74);
		ctx.lineTo(115, 142);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(162, 31);
		ctx.lineTo(220, 31);
		ctx.stroke();

		// Beacon glow.
		const beacon = ctx.createRadialGradient(278, 108, 1, 278, 108, 24);
		beacon.addColorStop(0, 'rgba(255,183,3,0.5)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(278, 108, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 253, 27, 4.4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Chute and drum sheen, kept on paint only.
		ctx.save();
		ctx.clip(new Path2D(HOUSING));
		const drumSheen = ctx.createLinearGradient(26, 152, 160, 232);
		drumSheen.addColorStop(0, 'rgba(255,255,255,0.24)');
		drumSheen.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		drumSheen.addColorStop(1, 'rgba(6,16,28,0.2)');
		ctx.fillStyle = drumSheen;
		ctx.fillRect(22, 138, 142, 111);
		ctx.restore();

		ctx.save();
		ctx.clip(new Path2D(CHUTE));
		const pipeSheen = ctx.createLinearGradient(112, 0, 152, 0);
		pipeSheen.addColorStop(0, 'rgba(255,255,255,0.22)');
		pipeSheen.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		pipeSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = pipeSheen;
		ctx.fillRect(112, 26, 34, 128);
		ctx.strokeStyle = 'rgba(255,255,255,0.14)';
		ctx.lineWidth = 1.6;
		for (const [sx, sy, ex, ey] of [
			[118, 96, 120, 150],
			[128, 90, 130, 150],
			[138, 86, 138, 150]
		] as const) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Glints on the paint, chrome and glass.
		glint(ctx, 254, 158, 4.8);
		glint(ctx, 452, 172, 4.2);
		glint(ctx, 626, 178, 3.4);
		glint(ctx, 198, 132, 3);
		glint(ctx, 124, 58, 3.2);
		glint(ctx, 134, 98, 3.8);
		glint(ctx, 34, 214, 2.4);
		glint(ctx, 72, 166, 2.6);
		glint(ctx, 346, 132, 2.6);
		glint(ctx, 408, 216, 2.2);
		glint(ctx, 204, 178, 3.4);
		glint(ctx, 156, 130, 2.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Beacon sparkle.
		glint(ctx, 278, 104, 3.2);

		weatherMarks(ctx);
	}

	ctx.restore();
}

export function drawRealSnowBlower(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealSnowBlowerLevel(ctx, x, y, scale, 5);
}
