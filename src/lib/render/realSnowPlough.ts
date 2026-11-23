/**
 * Snow plough art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over gritter facing left: white cab with a navy working skirt, a salt-spreader
 * hopper with a spinner, and the cue that names the vehicle — a big navy mouldboard on
 * guide poles hanging off the front bumper on a push frame and ram.
 *
 * The blade and its arms are their own cargo piece. Level 5 is the production target:
 * shaded, fully fitted, lit and finished with paint grain, glints, hub hardware, sheen on
 * the blade and spreader, beacon and lamp highlights, a cold exhaust puff and snow dust
 * off the blade.
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

/** Art box 780 x 350, road at 272. Front (cab) faces left. */
const MAIN =
	'M124,252 L124,202 Q124,192 130,190 L146,112 Q149,98 164,98 L266,98 Q280,98 282,114 L282,150 L700,150 Q716,150 722,164 L742,236 L742,252 Z';

/** Navy working skirt along the cab and hopper floor. */
const SKIRT = 'M124,234 L742,234 L742,252 L124,252 Z';

/** The spreader's raked tail panel, behind the spinner. */
const TAIL = 'M700,150 Q716,150 722,164 L742,236 L742,252 L700,252 Z';

const WINDSCREEN =
	'M134,184 L134,172 Q134,162 139,154 L151,120 Q154,112 162,112 L190,112 Q198,112 198,120 L198,176 Q198,184 190,184 Z';
const SIDE_WINDOW =
	'M208,114 Q208,108 216,108 L260,108 Q268,108 268,116 L268,170 Q268,176 262,176 L216,176 Q208,176 208,168 Z';

const DOOR = { x: 208, y: 184, w: 58, h: 64 };

/** The mouldboard: a tall plate leaning back toward the truck, bulged at mid-height. */
const BLADE =
	'M30,120 L92,136 Q102,139 102,152 L104,252 Q104,266 90,268 L32,268 Q18,268 16,254 L8,190 Q6,176 16,166 Z';

/** Amber-topped guide poles, the classic plough sighting cue. */
const POLE_F = { x: 32, y: 84, w: 4, h: 35 };
const POLE_R = { x: 86, y: 100, w: 4, h: 33 };

/** Push frame and ram, tucked ahead of the front tyre. */
const LINK_LOW = 'M104,222 L112,224 L111,231 L104,229 Z';
const ARM_FRAME = 'M104,180 L126,196 L126,203 L104,204 Z';

const WHEEL_L = { x: 150, y: 236, r: 38 };
const WHEEL_R = { x: 600, y: 236, r: 38 };

/** Hopper stiffeners, clear of the roundel and the rear wheel arch. */
const RIBS = [348, 420, 612, 684];

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
	const radius = 44;
	ctx.beginPath();
	ctx.arc(cx, 236, radius, Math.PI, Math.PI * 2);
	ctx.lineTo(cx + radius, 252);
	ctx.lineTo(cx - radius, 252);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, 236 - radius, 0, 252);
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

	// Mudguard lip: navy banded arch with an ink edge, drawn under the plastered art.
	ctx.strokeStyle = NAVY;
	ctx.lineWidth = 6;
	ctx.beginPath();
	ctx.arc(cx, 236, radius + 2.5, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, 236, radius + 5.5, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();

	if (shaded) {
		ctx.strokeStyle = 'rgba(255,255,255,0.24)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(cx, 236, radius - 1, Math.PI * 1.12, Math.PI * 1.5);
		ctx.stroke();
	}
}

/** Salt spreader roundel: a pale snowflake on navy paint. */
function snowflakeRoundel(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	circle(ctx, cx, cy, r, NAVY, 2.6);
	ctx.strokeStyle = 'rgba(233,236,239,0.85)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 2.2;
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const inner = r * 0.24;
		const outer = r * 0.74;
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
		ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
		ctx.stroke();
		for (const side of [-0.9, 0.9]) {
			const b = a + side;
			ctx.beginPath();
			ctx.moveTo(cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5);
			ctx.lineTo(cx + Math.cos(b) * r * 0.64, cy + Math.sin(b) * r * 0.64);
			ctx.stroke();
		}
	}
	circle(ctx, cx, cy, r * 0.1, CREAM, 1.2);
}

/** The spinner under the tail: a flat disc seen edge-on, fed by a chute. */
function spinner(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	line(ctx, cx - 26, cy - 24, cx - 8, cy - 4, NAVY_DARK, 8);
	line(ctx, cx - 23, cy - 21, cx - 8, cy - 4, 'rgba(255,255,255,0.16)', 2);

	ctx.save();
	ctx.beginPath();
	ctx.ellipse(cx, cy, r, r * 0.42, 0, 0, Math.PI * 2);
	ctx.fillStyle = STEEL;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	// Vanes around the disc, squashed with it.
	ctx.strokeStyle = 'rgba(220,228,236,0.72)';
	ctx.lineWidth = 1.9;
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * r * 0.22, cy + Math.sin(a) * r * 0.09);
		ctx.lineTo(cx + Math.cos(a) * r * 0.86, cy + Math.sin(a) * r * 0.36);
		ctx.stroke();
	}
	circle(ctx, cx, cy, 3.2, CHROME, 1.4);
	ctx.restore();
}

/**
 * Deterministic picture-book paint grain on the white panels only: glass, the door,
 * the navy livery and the wheel circles are cut out.
 */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const panels = new Path2D(MAIN);
	for (const cut of [
		WINDSCREEN,
		SIDE_WINDOW,
		'M208,184 L266,184 L266,248 L208,248 Z',
		SKIRT,
		'M282,144 L706,144 L706,158 L282,158 Z',
		TAIL,
		circleMask(516, 194, 30),
		circleMask(150, 236, 44),
		circleMask(600, 236, 44)
	]) {
		panels.addPath(new Path2D(cut));
	}
	ctx.clip(panels, 'evenodd');

	let seed = 71;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 330; i++) {
		const px = 120 + rnd() * 620;
		const py = 100 + rnd() * 148;
		const size = 1.5 + rnd() * 1.5;
		ctx.globalAlpha = 0.07 + rnd() * 0.05;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = WHITE_SOFT;
	for (let i = 0; i < 110; i++) {
		const px = 120 + rnd() * 620;
		const py = 100 + rnd() * 148;
		const size = 1.3 + rnd() * 1.2;
		ctx.globalAlpha = 0.16 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}

	// A cool powder mottle and a scatter of hard white flecks so the white paint reads
	// as sprayed metal rather than flat fill when the tile is only a few pixels tall.
	ctx.fillStyle = 'rgba(118,146,178,0.9)';
	for (let i = 0; i < 120; i++) {
		const px = 120 + rnd() * 620;
		const py = 100 + rnd() * 148;
		const size = 1 + rnd() * 1.1;
		ctx.globalAlpha = 0.08 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 90; i++) {
		const px = 120 + rnd() * 620;
		const py = 100 + rnd() * 148;
		const size = 0.8 + rnd() * 0.9;
		ctx.globalAlpha = 0.22 + rnd() * 0.16;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();
}

/** Level-5 spreader shine: cool light down the hopper flank and a warm bounce low down. */
function spreaderSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	const cut = `${WINDSCREEN} ${SIDE_WINDOW} ${circleMask(516, 194, 33)} ${circleMask(
		WHEEL_L.x,
		WHEEL_L.y,
		45
	)} ${circleMask(WHEEL_R.x, WHEEL_R.y, 45)}`;
	ctx.clip(new Path2D(`${MAIN} ${cut}`), 'evenodd');

	const flank = ctx.createLinearGradient(292, 150, 690, 238);
	flank.addColorStop(0, 'rgba(255,255,255,0.22)');
	flank.addColorStop(0.45, 'rgba(255,255,255,0.03)');
	flank.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = flank;
	ctx.fillRect(284, 148, 458, 86);

	const bounce = ctx.createLinearGradient(0, 224, 0, 238);
	bounce.addColorStop(0, 'rgba(255,246,228,0)');
	bounce.addColorStop(1, 'rgba(255,246,228,0.14)');
	ctx.fillStyle = bounce;
	ctx.fillRect(284, 220, 458, 18);

	// Hard edge where the flank rolls under the rail.
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(302, 158);
	ctx.lineTo(690, 158);
	ctx.stroke();
	ctx.restore();
}

/** Level-5 metal sweep across the spinner disc, plus a bright rim arc. */
function spinnerSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.beginPath();
	ctx.ellipse(712, 241, 14.6, 6.1, 0, 0, Math.PI * 2);
	ctx.clip();
	const sweep = ctx.createLinearGradient(698, 236, 726, 246);
	sweep.addColorStop(0, 'rgba(255,255,255,0.5)');
	sweep.addColorStop(0.5, 'rgba(255,255,255,0.06)');
	sweep.addColorStop(1, 'rgba(20,32,48,0.3)');
	ctx.fillStyle = sweep;
	ctx.fillRect(696, 234, 32, 14);
	ctx.restore();

	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.ellipse(712, 241, 14, 5.8, 0, Math.PI * 1.02, Math.PI * 1.7);
	ctx.stroke();
}

/** Level-5 lamp sparkle: warm catchlights on every lens, small enough for a tile. */
function lampHighlights(ctx: CanvasRenderingContext2D): void {
	// Cab beacon: a hot core inside the amber bar and short rays off the lens.
	glint(ctx, 223, 88, 3.4);
	ctx.fillStyle = 'rgba(255,249,214,0.95)';
	ctx.beginPath();
	ctx.ellipse(218, 88.5, 5, 1.8, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = 'rgba(255,214,102,0.5)';
	ctx.lineWidth = 1.6;
	for (const a of [-0.9, -0.2, 0.5]) {
		ctx.beginPath();
		ctx.moveTo(223 + Math.cos(a) * 7, 88 + Math.sin(a) * 7);
		ctx.lineTo(223 + Math.cos(a) * 13, 88 + Math.sin(a) * 13);
		ctx.stroke();
	}

	// Headlamp sparkle and a chrome fillet on the bezel.
	glint(ctx, 136, 190, 2.4);
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(137, 192, 5.4, Math.PI * 1.05, Math.PI * 1.6);
	ctx.stroke();

	// Roof markers and rear cluster get a pin catchlight each.
	ctx.fillStyle = 'rgba(255,252,232,0.9)';
	for (let lens = 0; lens < 5; lens++) {
		ctx.fillRect(174 + lens * 18, 100.8, 4, 1.4);
	}
	ctx.fillStyle = 'rgba(255,252,232,0.85)';
	ctx.fillRect(748, 236.5, 5, 1.6);
	ctx.fillRect(748, 244, 4, 1.3);

	// Guide-pole lamps.
	glint(ctx, 34, 80, 2.4);
	glint(ctx, 88, 98, 2.2);
	ctx.fillStyle = 'rgba(255,252,232,0.95)';
	ctx.beginPath();
	ctx.arc(33.2, 78.6, 1.1, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(87.4, 96.8, 1, 0, Math.PI * 2);
	ctx.fill();
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
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.5, CHROME, 1.2);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(58,39,27,0.28)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.25, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();

	// Extra hub hardware: a finer ring of rim rivets, washer catches on every lug and a
	// faceted centre cap. The 6-fold pattern stays mirror symmetric for the flipped tile.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
		circle(ctx, x + Math.cos(a) * r * 0.58, y + Math.sin(a) * r * 0.58, 1.5, '#B9C3D1', 1);
	}

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		ctx.strokeStyle = 'rgba(255,255,255,0.85)';
		ctx.lineWidth = 1.1;
		ctx.beginPath();
		ctx.arc(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 3.1, Math.PI * 1.05, Math.PI * 1.55);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(58,39,27,0.35)';
	ctx.lineWidth = 1;
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(a) * r * 0.07, y + Math.sin(a) * r * 0.07);
		ctx.lineTo(x + Math.cos(a) * r * 0.15, y + Math.sin(a) * r * 0.15);
		ctx.stroke();
	}

	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x - 0.6, y - 0.8, 1.4, 0, Math.PI * 2);
	ctx.fill();
}

/** Finishing marks: chipped working edges, snow dust on the blade and road grime. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[128, 246, 8, 2, 0.35],
		[206, 258, 6, 2, 0.3],
		[352, 240, 10, 2, 0.28],
		[604, 240, 7, 2, 0.26],
		[730, 240, 8, 2, 0.3]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	// Snow dust blown off the cutting edge.
	ctx.save();
	ctx.fillStyle = WHITE_SOFT;
	for (const [dx, dy, dr, alpha] of [
		[22, 248, 3, 0.5],
		[30, 256, 2.2, 0.4],
		[14, 258, 2.4, 0.45],
		[38, 262, 1.8, 0.35]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(dx, dy, dr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Road grime along the chassis and a scuff down the blade's leading edge.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(390, 262, 22, 3.4, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
	line(ctx, 20, 214, 26, 252, 'rgba(255,255,255,0.22)', 2);
}

export function drawRealSnowPloughLevel(
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
		ctx.ellipse(410, 278, 338, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// One silhouette: cab-over nose, cab roof, spreader hopper and raked tail.
	shape(ctx, MAIN, WHITE);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(MAIN));
		const paint = ctx.createLinearGradient(0, 98, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.36)');
		paint.addColorStop(0.4, 'rgba(255,255,255,0.04)');
		paint.addColorStop(1, 'rgba(35,52,74,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(120, 96, 626, 158);
		ctx.restore();
	}

	if (finish) paintGrain(ctx);

	// Livery: navy skirt, hopper rail, stiffeners, raked tail and spreader roundel.
	shape(ctx, SKIRT, NAVY, 2.4);
	line(ctx, 132, 236.5, 736, 236.5, 'rgba(255,255,255,0.16)', 2);

	// Hazard dashes along the working skirt.
	ctx.fillStyle = 'rgba(233,236,239,0.8)';
	for (const dx of [300, 384, 468, 552, 622]) {
		ctx.fillRect(dx, 240, 22, 4);
	}
	ctx.fillStyle = WHITE;

	rect(ctx, 282, 144, 424, 14, NAVY, 3, 2.6);
	line(ctx, 288, 147.5, 698, 147.5, 'rgba(255,255,255,0.32)', 2);

	// Tarp straps over the hopper rail.
	for (const tx of [322, 400, 478, 556, 634]) {
		line(ctx, tx, 150, tx, 164, 'rgba(233,236,239,0.55)', 3);
		rect(ctx, tx - 3, 158, 8, 5, CHROME, 1, 1.2);
	}

	for (const rx of RIBS) {
		rect(ctx, rx, 160, 12, 72, NAVY, 1.5, 2);
		if (shaded) line(ctx, rx + 2.5, 163, rx + 2.5, 229, 'rgba(255,255,255,0.16)', 1.6);
	}

	shape(ctx, TAIL, NAVY, 2.4);
	if (shaded) line(ctx, 708, 156, 738, 234, 'rgba(255,255,255,0.14)', 3);

	spinner(ctx, 712, 241, 15);
	snowflakeRoundel(ctx, 516, 194, 30);
	if (finish) {
		spinnerSheen(ctx);
		spreaderSheen(ctx);
	}

	// Chassis rails and underbody.
	rect(ctx, 126, 252, 618, 14, STEEL, 0, 2.4);
	line(ctx, 132, 254.5, 738, 254.5, 'rgba(255,255,255,0.26)', 2);
	rect(ctx, 298, 255, 92, 9, CHROME, 5, 2);
	rect(ctx, 404, 255, 58, 9, NAVY, 2, 2);
	line(ctx, 318, 257, 318, 263, 'rgba(35,52,74,0.35)', 1.6);
	line(ctx, 370, 257, 370, 263, 'rgba(35,52,74,0.35)', 1.6);

	// Mudguards first: their arch band tucks under the blade and the cab glass.
	wheelWell(ctx, WHEEL_L.x, shaded);
	wheelWell(ctx, WHEEL_R.x, shaded);

	// Cab glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);

	if (shaded) {
		glassShade(ctx, WINDSCREEN, 134, 110, 66, 76);
		glassShade(ctx, SIDE_WINDOW, 208, 106, 62, 72);
		line(ctx, 150, 126, 166, 158, 'rgba(255,255,255,0.5)', 3);
		line(ctx, 216, 120, 240, 146, 'rgba(255,255,255,0.35)', 2.4);
	}

	// Door, kept a clean rectangle for its own piece.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, WHITE, 3, 2.6);
	line(ctx, 210, 186, 264, 186, 'rgba(35,52,74,0.2)', 1.6);
	rect(ctx, 210, 232, 54, 14, NAVY, 2, 2);
	if (fitted) {
		rect(ctx, 246, 202, 14, 5, CHROME, 2, 1.6);
		rect(ctx, 210, 192, 4, 12, STEEL, 1.5, 1.4);
		rect(ctx, 214, 238, 46, 5, CHROME, 1.5, 1.4);
	}

	// Front bumper and the cab's work lamps, clear of the tyre.
	rect(ctx, 110, 212, 14, 44, CHROME, 4, 2.6);
	rect(ctx, 112, 216, 10, 36, NAVY, 2, 1.8);
	if (fitted) {
		circle(ctx, 137, 192, 5.4, CHROME, 1.8);
		circle(ctx, 137, 192, 4.4, LAMP, 1.6);
		circle(ctx, 136, 191, 1.8, CREAM, 1);
		circle(ctx, 151, 191, 2.8, AMBER, 1.4);
		line(ctx, 112, 247, 122, 247, 'rgba(255,255,255,0.5)', 1.4);
	}

	if (lit) {
		// Headlight beam, drawn before the plough and tyre so they cut it off.
		const glow = ctx.createRadialGradient(137, 192, 1, 137, 192, 19);
		glow.addColorStop(0, 'rgba(255,240,150,0.6)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(137, 192, 19, 0, Math.PI * 2);
		ctx.fill();
	}

	// Rear bumper, lamp cluster and plate, behind the tail.
	rect(ctx, 744, 232, 16, 24, CHROME, 3, 2.4);
	rect(ctx, 746, 235, 11, 7, RED, 2, 1.6);
	rect(ctx, 746, 243, 11, 6, AMBER, 2, 1.4);
	rect(ctx, 747, 249, 9, 5, CREAM, 1, 1.3);

	// Mudflaps hanging behind each tyre.
	rect(ctx, 198, 252, 16, 20, NAVY, 2, 2);
	rect(ctx, 646, 252, 16, 20, NAVY, 2, 2);
	if (fitted) {
		line(ctx, 201, 256, 201, 268, NAVY_LIGHT, 2);
		line(ctx, 649, 256, 649, 268, NAVY_LIGHT, 2);
	}

	if (fitted) {
		// Mirror on the A-pillar.
		line(ctx, 136, 120, 128, 132, INK, 3.4);
		rect(ctx, 112, 114, 16, 34, NAVY, 4, 2.4);
		rect(ctx, 115, 117, 10, 24, GLASS, 2, 1.4);
		line(ctx, 116, 120, 116, 136, 'rgba(255,255,255,0.45)', 1.4);

		// Roof marker lamps on the cab brow.
		for (let lens = 0; lens < 5; lens++) {
			rect(ctx, 172 + lens * 18, 100, 10, 4, AMBER, 1.5, 1.2);
		}

		// Wipers over the windscreen foot.
		line(ctx, 142, 176, 156, 160, INK, 2.2);
		line(ctx, 160, 178, 174, 162, INK, 2);

		// Amber beacon bar on the cab roof.
		rect(ctx, 206, 92, 34, 6, NAVY, 3, 2);
		rect(ctx, 208, 86, 30, 7, AMBER, 3, 2);
		rect(ctx, 210, 87.5, 10, 3, LAMP, 1, 1);

		// Exhaust stack behind the cab.
		rect(ctx, 282, 104, 11, 44, CHROME, 3, 2.4);
		rect(ctx, 283, 106, 9, 3, STEEL, 1, 1.4);
		rect(ctx, 284, 128, 7, 5, NAVY_DARK, 1, 1.2);
	}

	// The plough: a small ram stub and a chunky A-frame, then the mouldboard.
	shape(ctx, LINK_LOW, STEEL, 1.8);
	line(ctx, 105, 226, 110, 227, 'rgba(255,255,255,0.4)', 1.4);
	shape(ctx, ARM_FRAME, STEEL, 1.8);
	line(ctx, 105, 183, 123, 197, 'rgba(255,255,255,0.45)', 2);
	line(ctx, 106, 201, 123, 200, 'rgba(255,255,255,0.3)', 1.4);
	circle(ctx, 121, 199, 2.4, INK, 1.1);

	shape(ctx, BLADE, NAVY);
	ctx.save();
	ctx.clip(new Path2D(BLADE));

	if (shaded) {
		const face = ctx.createLinearGradient(8, 166, 104, 196);
		face.addColorStop(0, 'rgba(255,255,255,0.24)');
		face.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		face.addColorStop(1, 'rgba(6,16,28,0.28)');
		ctx.fillStyle = face;
		ctx.fillRect(4, 116, 104, 156);
	}

	// Curled top rail and the cutting edge along the ground.
	line(ctx, 33, 126, 93, 141, 'rgba(255,255,255,0.5)', 6);
	line(ctx, 35, 132, 93, 147, 'rgba(8,18,32,0.4)', 2.4);

	// Hazard chevrons, worn across the mouldboard face.
	ctx.fillStyle = WHITE;
	for (const d of [
		'M24,148 L86,163 L82,175 L20,160 Z',
		'M18,178 L80,193 L76,205 L14,190 Z',
		'M12,208 L74,223 L70,235 L8,220 Z'
	]) {
		ctx.fill(new Path2D(d));
	}

	line(ctx, 22, 248, 100, 250, CHROME, 5);
	line(ctx, 22, 259, 100, 261, INK, 2);
	line(ctx, 22, 246, 100, 248, 'rgba(255,255,255,0.6)', 1.4);
	ctx.restore();

	if (shaded) {
		line(ctx, 20, 168, 14, 248, 'rgba(255,255,255,0.18)', 2.4);
	}

	if (finish) {
		// Cold sheen down the mouldboard face, powder dragged toward the cutting edge,
		// and a wet gleam along the curled top rail.
		ctx.save();
		ctx.clip(new Path2D(BLADE));
		const bladeSheen = ctx.createLinearGradient(10, 130, 96, 260);
		bladeSheen.addColorStop(0, 'rgba(255,255,255,0.24)');
		bladeSheen.addColorStop(0.34, 'rgba(255,255,255,0.04)');
		bladeSheen.addColorStop(0.7, 'rgba(8,20,36,0.1)');
		bladeSheen.addColorStop(1, 'rgba(8,20,36,0.26)');
		ctx.fillStyle = bladeSheen;
		ctx.fillRect(4, 116, 104, 156);

		ctx.strokeStyle = 'rgba(255,255,255,0.14)';
		ctx.lineWidth = 1.4;
		for (const [sx, sy, ex, ey] of [
			[38, 142, 31, 206],
			[58, 150, 53, 232],
			[78, 158, 75, 244]
		] as const) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		line(ctx, 30, 128, 90, 142, 'rgba(255,255,255,0.42)', 2);
		line(ctx, 24, 246, 96, 248, 'rgba(255,255,255,0.5)', 1.6);
	}

	// Guide poles with amber lamps.
	rect(ctx, POLE_F.x, POLE_F.y, POLE_F.w, POLE_F.h, STEEL, 1.5, 1.6);
	circle(ctx, 34, 80, 5, AMBER, 1.8);
	circle(ctx, 33.5, 79, 2, LAMP, 1);
	rect(ctx, POLE_R.x, POLE_R.y, POLE_R.w, POLE_R.h, STEEL, 1.5, 1.6);
	circle(ctx, 88, 98, 4.4, AMBER, 1.8);
	circle(ctx, 87.6, 97.2, 1.8, LAMP, 1);

	if (finish) lampHighlights(ctx);

	// Both wheels come from the one wheel piece; the rear tile is the front mirrored.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light on the cab roof, hopper rail and blade top.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(168, 99);
		ctx.lineTo(262, 99);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(288, 145);
		ctx.lineTo(696, 145);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(32, 121.4);
		ctx.lineTo(90, 136.4);
		ctx.stroke();

		// Beacon glow.
		const beacon = ctx.createRadialGradient(223, 88, 1, 223, 88, 22);
		beacon.addColorStop(0, 'rgba(255,183,3,0.5)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(223, 88, 22, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 274, 33, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint, chrome and blade glints, clear of the wheel circles.
		glint(ctx, 244, 156, 5.4);
		glint(ctx, 470, 194, 5.8);
		glint(ctx, 700, 196, 4.6);
		glint(ctx, 64, 168, 5);
		glint(ctx, 118, 228, 3.6);
		glint(ctx, 330, 151, 4.2);
		glint(ctx, 252, 204, 2.6);
		glint(ctx, 121, 126, 2.2);
		glint(ctx, 724, 214, 3);
		glint(ctx, 52, 236, 3.2);
		glint(ctx, 752, 237.5, 2.2);
		glint(ctx, 712, 238, 2.4);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Cold exhaust puff rising from the stack.
		ctx.save();
		ctx.fillStyle = '#C9D2DE';
		for (const [px, py, pr, alpha] of [
			[292, 98, 5, 0.5],
			[286, 92, 4, 0.4],
			[292, 88, 3.2, 0.3]
		] as const) {
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealSnowPlough(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealSnowPloughLevel(ctx, x, y, scale, 5);
}
