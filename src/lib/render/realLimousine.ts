/**
 * Limousine art, cut into the same five-piece kit as the other realistic vehicles.
 * A long black saloon facing left: low bonnet, raked A-pillar, three chrome-pillared side
 * windows, a gold waistline, a stretched rear passenger door and a short boot. The stretch
 * between the front door and the rear door is the cue that names the vehicle.
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

const BLACK = '#2E2B3A';
const BLACK_DEEP = '#221F2E';
const GOLD = '#C9A227';
const GOLD_LIGHT = '#E6C862';
const GOLD_DARK = '#96771A';
const CREAM = '#FFF6DC';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const TAIL = '#FF4D6D';

/** Art box 820 x 300, road at 272. Front (bonnet) faces left. */
const SHELL =
	'M46,250 L46,204 Q46,194 58,191 L204,177 Q214,174 219,169 L253,124 Q259,118 269,118 L666,118 Q676,118 681,126 L714,171 L790,171 Q798,171 798,179 L798,236 Q798,250 784,250 Z';

const WHEEL_L = { x: 150, y: 240, r: 32 };
const WHEEL_R = { x: 650, y: 240, r: 32 };

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Front side window follows the A-pillar rake; the middle and rear panes are the stretch. */
const WIN_FRONT = 'M278,126 L348,126 Q352,126 352,130 L352,164 Q352,168 348,168 L246,168 Z';
const WIN_MIDDLE = pane(368, 126, 120, 42, 5);
const WIN_REAR = pane(504, 126, 116, 42, 5);
const GLASS_MASK = `${WIN_FRONT} ${WIN_MIDDLE} ${WIN_REAR}`;

/** Rear passenger door: a clean rectangle clear of all three panes. */
const DOOR = { x: 504, y: 176, w: 112, h: 72 };

/** Bumpers and the exhaust tip touch the shell edge and are part of the body cut-out. */
const BUMPER_FRONT = { x: 32, y: 222, w: 14, h: 26 };
const BUMPER_REAR = { x: 798, y: 234, w: 14, h: 20 };
const EXHAUST = { x: 712, y: 250, w: 18, h: 6 };

/** Gold coachline: along the bonnet top, over the cowl, then flat along the beltline. */
const WAISTLINE =
	'M58,191 L204,177 Q213,174 219,171 L798,171 L798,180 L219,180 Q213,183 204,186 L58,200 Z';

/** Second, finer coachline above the rocker. */
const PINSTRIPE = 'M64,232 L796,232 L796,235 L64,235 Z';

// The body mask is the shell plus the two bumpers and the exhaust tip, all of which touch the
// shell edge. Subpaths never overlap, so the evenodd clip cannot punch a hole.

/** Four-point paint glint, sized to survive the game scale. */
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
	ctx.arc(x, y, 1.9, 0, Math.PI * 2);
	ctx.fill();
}

/** Paint body: roof light falling to a warm shade at the rocker. */
function paintShade(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	const paint = ctx.createLinearGradient(0, 118, 0, 250);
	paint.addColorStop(0, 'rgba(255,255,255,0.34)');
	paint.addColorStop(0.16, 'rgba(255,255,255,0.1)');
	paint.addColorStop(0.6, 'rgba(34,31,46,0.06)');
	paint.addColorStop(1, 'rgba(18,16,26,0.34)');
	ctx.fillStyle = paint;
	ctx.fillRect(40, 118, 764, 132);

	// Long bonnet catches more of the sky than the boot.
	const bonnet = ctx.createLinearGradient(0, 168, 0, 196);
	bonnet.addColorStop(0, 'rgba(255,255,255,0.24)');
	bonnet.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = bonnet;
	ctx.fillRect(56, 168, 160, 30);

	// Soft sheen down the stretched flank.
	const flank = ctx.createLinearGradient(220, 130, 620, 240);
	flank.addColorStop(0, 'rgba(255,255,255,0)');
	flank.addColorStop(0.36, 'rgba(255,255,255,0.09)');
	flank.addColorStop(0.62, 'rgba(255,255,255,0.03)');
	flank.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = flank;
	ctx.fillRect(220, 126, 420, 124);

	ctx.restore();
}

/** Diagonal glass gradient inside one pane. */
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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.72, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.62)');
	glass.addColorStop(0.44, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(92,168,222,0.3)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);

	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 7;
	ctx.beginPath();
	ctx.moveTo(x - 6, y + h + 4);
	ctx.lineTo(x + 34, y - 6);
	ctx.stroke();
	ctx.restore();
}

/** Gold arch lip sitting just outside the tyre. */
function wheelArch(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.strokeStyle = GOLD;
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 9, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 11.6, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 6.4, Math.PI * 1.12, Math.PI * 1.88);
	ctx.stroke();
}

/**
 * Picture-book hub: sidewall gloss, bright rim ring, six spokes, six bolt heads with specular
 * pips, the dish shadow and a polished centre cap. Every mark is mirror-symmetric about the
 * hub centre, so the flipped rear wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Sidewall catches the roof light on both shoulders, clear of the tread notches.
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 2.6;
	for (const [from, to] of [
		[Math.PI * 1.08, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.92]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.86, from, to);
		ctx.stroke();
	}

	// Spokes sit between the bolts, so the phase stays mirror-symmetric across the hub.
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
		line(
			ctx,
			x + Math.cos(a) * r * 0.19,
			y + Math.sin(a) * r * 0.19,
			x + Math.cos(a) * r * 0.47,
			y + Math.sin(a) * r * 0.47,
			'rgba(255,255,255,0.26)',
			2
		);
		line(
			ctx,
			x + Math.cos(a) * r * 0.19,
			y + Math.sin(a) * r * 0.19 + 1.2,
			x + Math.cos(a) * r * 0.44,
			y + Math.sin(a) * r * 0.44 + 1.2,
			'rgba(58,39,27,0.3)',
			1.2
		);
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.5, CHROME, 1.2);
		ctx.fillStyle = 'rgba(255,255,255,0.88)';
		ctx.beginPath();
		ctx.arc(bx - 0.8, by - 0.9, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	// Dish shadow under the cap, then the polished cap itself.
	ctx.strokeStyle = 'rgba(58,39,27,0.26)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.46, 0.18 * Math.PI, 0.82 * Math.PI);
	ctx.stroke();
	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.1, Math.PI * 1.06, Math.PI * 1.6);
	ctx.stroke();
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(x - 0.8, y - 0.9, 0.9, 0, Math.PI * 2);
	ctx.fill();

	ctx.strokeStyle = 'rgba(255,255,255,0.74)';
	ctx.lineWidth = 1.6;
	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.94]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.62, from, to);
		ctx.stroke();
	}
	// Valve stem hangs straight down, so a horizontal flip leaves it on the hub axis.
	line(ctx, x, y + r * 0.53, x, y + r * 0.66, CHROME, 2.2);
	ctx.fillStyle = 'rgba(255,255,255,0.8)';
	ctx.beginPath();
	ctx.arc(x - 0.4, y + r * 0.56, 0.8, 0, Math.PI * 2);
	ctx.fill();
	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - 0.7, y - r * 0.58, 0.9, 0, Math.PI * 2);
	ctx.fill();
}

/** Paint grain over solid paint only: glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	const wash = ctx.createLinearGradient(46, 118, 798, 250);
	wash.addColorStop(0, 'rgba(255,255,255,0.07)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.08)');
	ctx.fillStyle = wash;
	ctx.fillRect(46, 118, 752, 132);

	let seed = 47;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	// Fine metallic flake: cool silver, warm cream, then the deep grain underneath.
	ctx.fillStyle = '#DCE9F7';
	for (let i = 0; i < 240; i++) {
		const px = 48 + rand() * 748;
		const py = 120 + rand() * 128;
		const size = 1.2 + rand() * 0.8;
		ctx.globalAlpha = 0.08 + rand() * 0.07;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFF3D0';
	for (let i = 0; i < 90; i++) {
		const px = 48 + rand() * 748;
		const py = 120 + rand() * 128;
		const size = 1 + rand() * 0.7;
		ctx.globalAlpha = 0.1 + rand() * 0.08;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = INK;
	for (let i = 0; i < 340; i++) {
		const px = 48 + rand() * 748;
		const py = 120 + rand() * 128;
		const size = 1.3 + rand() * 1.1;
		ctx.globalAlpha = 0.12 + rand() * 0.08;
		ctx.fillRect(px, py, size, size);
	}

	// Long polishing strokes and the scratches the coat keeps.
	ctx.globalAlpha = 0.13;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[64, 214, 150, 212],
		[226, 206, 320, 204],
		[430, 200, 596, 198],
		[640, 224, 720, 223],
		[730, 236, 788, 235],
		[70, 196, 168, 194],
		[636, 184, 706, 183],
		[726, 196, 790, 195]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest, so the grain has a hand-made edge.
	ctx.globalAlpha = 0.2;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[86, 190, 172, 188],
		[232, 224, 300, 223],
		[520, 214, 606, 213],
		[268, 202, 300, 201],
		[652, 214, 700, 213],
		[742, 200, 786, 199],
		[120, 226, 154, 225]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/**
 * Black lacquer sheen: the shoulder mirrors a cool horizon band, the stretch takes one raked
 * reflection, and a warm road bounce lifts the rocker. Clipped to solid paint so no streak
 * ever crosses the glazing or the tyres.
 */
function paintSheen(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	// Cool sky band along the whole flank, brightest at the beltline.
	const shoulder = ctx.createLinearGradient(0, 176, 0, 216);
	shoulder.addColorStop(0, 'rgba(206,230,255,0)');
	shoulder.addColorStop(0.28, 'rgba(206,230,255,0.14)');
	shoulder.addColorStop(0.46, 'rgba(206,230,255,0.2)');
	shoulder.addColorStop(0.66, 'rgba(206,230,255,0.05)');
	shoulder.addColorStop(1, 'rgba(206,230,255,0)');
	ctx.fillStyle = shoulder;
	ctx.fillRect(54, 172, 744, 48);

	// Bonnet and boot hold separate patches of sky.
	const bonnet = ctx.createLinearGradient(0, 176, 0, 206);
	bonnet.addColorStop(0, 'rgba(226,240,255,0.2)');
	bonnet.addColorStop(0.62, 'rgba(226,240,255,0.05)');
	bonnet.addColorStop(1, 'rgba(226,240,255,0)');
	ctx.fillStyle = bonnet;
	ctx.fillRect(56, 174, 166, 32);

	const boot = ctx.createLinearGradient(0, 172, 0, 216);
	boot.addColorStop(0, 'rgba(226,240,255,0.16)');
	boot.addColorStop(0.7, 'rgba(226,240,255,0.03)');
	boot.addColorStop(1, 'rgba(226,240,255,0)');
	ctx.fillStyle = boot;
	ctx.fillRect(716, 172, 82, 44);

	// A taut reflected horizon: one continuous line, lifted over the front wheel, fading at both ends.
	const horizon = ctx.createLinearGradient(58, 0, 800, 0);
	horizon.addColorStop(0, 'rgba(255,255,255,0)');
	horizon.addColorStop(0.14, 'rgba(255,255,255,0.34)');
	horizon.addColorStop(0.48, 'rgba(255,255,255,0.15)');
	horizon.addColorStop(0.8, 'rgba(255,255,255,0.3)');
	horizon.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.strokeStyle = horizon;
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(58, 199);
	ctx.quadraticCurveTo(230, 192, 398, 192);
	ctx.lineTo(788, 189);
	ctx.stroke();

	// One raked reflection crossing the stretch, with a fainter echo behind it.
	const rake = ctx.createLinearGradient(330, 236, 566, 178);
	rake.addColorStop(0, 'rgba(255,255,255,0)');
	rake.addColorStop(0.38, 'rgba(255,255,255,0.02)');
	rake.addColorStop(0.5, 'rgba(255,255,255,0.13)');
	rake.addColorStop(0.59, 'rgba(255,255,255,0.04)');
	rake.addColorStop(0.74, 'rgba(255,255,255,0)');
	ctx.fillStyle = rake;
	ctx.fillRect(226, 178, 570, 62);

	const echo = ctx.createLinearGradient(600, 238, 700, 186);
	echo.addColorStop(0, 'rgba(255,255,255,0)');
	echo.addColorStop(0.52, 'rgba(255,255,255,0.07)');
	echo.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = echo;
	ctx.fillRect(596, 182, 120, 58);

	// A tight reflected band down the stretch, built from stacked fades so it has no hard ends.
	ctx.save();
	ctx.translate(430, 206);
	ctx.rotate(-0.028);
	for (const [halfW, alpha] of [
		[220, 0.03],
		[150, 0.05],
		[86, 0.07]
	]) {
		const band = ctx.createLinearGradient(0, -11, 0, 11);
		band.addColorStop(0, 'rgba(255,255,255,0)');
		band.addColorStop(0.4, `rgba(255,255,255,${alpha * 0.7})`);
		band.addColorStop(0.52, `rgba(255,255,255,${alpha})`);
		band.addColorStop(0.66, `rgba(255,255,255,${alpha * 0.3})`);
		band.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = band;
		ctx.fillRect(-halfW, -11, halfW * 2, 22);
	}
	ctx.restore();

	// Warm road bounce lifting the rocker, so the lower panel does not read as a hole.
	const bounce = ctx.createLinearGradient(0, 222, 0, 250);
	bounce.addColorStop(0, 'rgba(255,232,178,0)');
	bounce.addColorStop(0.72, 'rgba(255,232,178,0.06)');
	bounce.addColorStop(1, 'rgba(255,232,178,0.12)');
	ctx.fillStyle = bounce;
	ctx.fillRect(54, 222, 744, 28);

	// Polished edge where the rear quarter rolls into the boot lid.
	ctx.strokeStyle = 'rgba(255,255,255,0.22)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(718, 176);
	ctx.quadraticCurveTo(724, 200, 716, 232);
	ctx.stroke();

	ctx.restore();
}

/** Gold waistline sheen: gloss inside the coachline, a running highlight and crisp lit edges. */
function waistlineSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Gloss confined to the gold band itself.
	ctx.save();
	ctx.clip(new Path2D(WAISTLINE));
	const gloss = ctx.createLinearGradient(0, 168, 0, 200);
	gloss.addColorStop(0, 'rgba(255,250,214,0.34)');
	gloss.addColorStop(0.3, 'rgba(255,250,214,0.05)');
	gloss.addColorStop(0.68, 'rgba(150,119,26,0.14)');
	gloss.addColorStop(1, 'rgba(150,119,26,0.34)');
	ctx.fillStyle = gloss;
	ctx.fillRect(50, 166, 752, 38);

	// A highlight travelling down the coachline, longest over the stretch.
	const running = ctx.createLinearGradient(90, 0, 800, 0);
	running.addColorStop(0, 'rgba(255,255,255,0)');
	running.addColorStop(0.18, 'rgba(255,255,255,0.06)');
	running.addColorStop(0.3, 'rgba(255,255,255,0.44)');
	running.addColorStop(0.4, 'rgba(255,255,255,0.08)');
	running.addColorStop(0.62, 'rgba(255,255,255,0.02)');
	running.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = running;
	ctx.fillRect(50, 166, 752, 38);
	ctx.restore();

	// Lit top edge and shaded underside of the band.
	line(ctx, 224, 172.6, 794, 172.6, 'rgba(255,252,224,0.56)', 1.4);
	line(ctx, 62, 192.8, 202, 178.6, 'rgba(255,252,224,0.46)', 1.2);
	line(ctx, 224, 179.4, 794, 179.4, 'rgba(128,100,18,0.5)', 1.2);

	// The finer coachline above the rocker takes the same treatment.
	ctx.fillStyle = GOLD_LIGHT;
	ctx.globalAlpha = 0.5;
	ctx.fillRect(66, 232.2, 728, 0.9);
	ctx.globalAlpha = 1;
	line(ctx, 66, 234.2, 794, 234.2, 'rgba(255,244,196,0.42)', 1.2);

	// Bright pin at the cowl kink, where the bonnet run meets the beltline.
	glint(ctx, 217, 174, 2.2);
	ctx.restore();
}

/** Chrome pillar highlights: a polished face, one raked reflection and lit cap edges. */
function pillarSheen(ctx: CanvasRenderingContext2D): void {
	for (const px of [352, 488]) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(px, 124, 16, 46);
		ctx.clip();

		const gloss = ctx.createLinearGradient(px, 0, px + 16, 0);
		gloss.addColorStop(0, 'rgba(255,255,255,0.5)');
		gloss.addColorStop(0.3, 'rgba(255,255,255,0.05)');
		gloss.addColorStop(0.62, 'rgba(150,210,255,0.2)');
		gloss.addColorStop(1, 'rgba(58,39,27,0.36)');
		ctx.fillStyle = gloss;
		ctx.fillRect(px, 124, 16, 46);

		// The panes either side of the pillar reflect into it at the same rake.
		ctx.strokeStyle = 'rgba(255,255,255,0.66)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(px + 3.4, 168);
		ctx.lineTo(px + 11.6, 128);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.3)';
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.moveTo(px + 9, 169);
		ctx.lineTo(px + 15.4, 141);
		ctx.stroke();
		ctx.restore();

		line(ctx, px + 1, 125.2, px + 15, 125.2, 'rgba(255,255,255,0.82)', 1.4);
		line(ctx, px + 1, 169, px + 15, 169, 'rgba(58,39,27,0.4)', 1.2);
	}
}

/** Finishing marks: lamp sparkles, chrome lips, plate gloss, arch hardware, chips and dust. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// Headlamp, indicator and tail lamp keep a specular pip each.
	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[54.6, 202.4, 1.5],
		[50.4, 220.4, 0.9],
		[793.6, 198.4, 1.1]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	// Grille bars and both bumper faces catch a short bright run.
	line(ctx, 48.6, 233.2, 58.4, 233.2, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 33, 224, 45, 224, 'rgba(255,255,255,0.82)', 1.5);
	line(ctx, 33, 245, 45, 245, 'rgba(58,39,27,0.3)', 1.3);
	line(ctx, 799, 236, 811, 236, 'rgba(255,255,255,0.72)', 1.4);
	line(ctx, 799, 252, 811, 252, 'rgba(58,39,27,0.3)', 1.2);

	// Indicator lens, tail lens and rear plate each get a top lip.
	line(ctx, 49.4, 219.6, 59.6, 219.6, 'rgba(255,255,255,0.62)', 1.1);
	line(ctx, 786.6, 196.6, 795.4, 196.6, 'rgba(255,255,255,0.66)', 1.2);
	line(ctx, 786.6, 220.6, 795.4, 220.6, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 753, 232.8, 781, 232.8, 'rgba(255,255,255,0.56)', 1);

	// Door handles, boot handle and the badge take a polished lip.
	for (const handleX of [336, 514]) {
		line(ctx, handleX + 1, 190.8, handleX + 19, 190.8, 'rgba(255,255,255,0.72)', 1.2);
		line(ctx, handleX + 1, 194.2, handleX + 19, 194.2, 'rgba(58,39,27,0.3)', 1);
	}
	line(ctx, 745, 204.8, 773, 204.8, 'rgba(255,255,255,0.7)', 1.2);
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(700, 198, 6.2, Math.PI * 1.08, Math.PI * 1.62);
	ctx.stroke();

	// Exhaust tip lip and the boot trim highlight.
	line(ctx, 714, 251.2, 728, 251.2, 'rgba(255,255,255,0.5)', 1.2);
	line(ctx, 722, 190.6, 791, 190.6, 'rgba(255,255,255,0.4)', 1.1);

	// Arch hardware: a chrome pip at each crown and a lit outer lip.
	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		circle(ctx, wheelX, WHEEL_L.y - WHEEL_L.r - 9.6, 1.7, CHROME, 1);
		ctx.strokeStyle = 'rgba(255,255,255,0.44)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 12.2, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
	}

	// Stone chips where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.4;
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, chipR] of [
		[68, 246, 1.2],
		[214, 248, 1.1],
		[318, 247, 1.3],
		[456, 248, 1.2],
		[592, 247, 1.1],
		[678, 249, 1.2]
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
		[392, 238, 1.5],
		[470, 236, 1.3],
		[602, 234, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

/** Front bumper, lamps, grille and wing vent. */
function frontFittings(ctx: CanvasRenderingContext2D): void {
	rect(
		ctx,
		BUMPER_FRONT.x,
		BUMPER_FRONT.y,
		BUMPER_FRONT.w,
		BUMPER_FRONT.h,
		CHROME,
		3,
		2.6
	);
	line(ctx, 34, 226, 44, 226, 'rgba(255,255,255,0.7)', 1.6);
	line(ctx, 34, 244, 44, 244, 'rgba(58,39,27,0.28)', 1.4);

	// Headlamp: chrome bezel, warm lens and a specular core.
	circle(ctx, 58, 205, 9.5, CHROME, 2.2);
	circle(ctx, 58, 205, 7.2, LAMP, 1.6);
	circle(ctx, 56.4, 203, 3.1, '#FFF8D4', 1.2);

	// Indicator and the grille sliver at the nose.
	rect(ctx, 49, 219, 11, 7, AMBER, 2, 1.6);
	rect(ctx, 48, 229, 11, 17, STEEL, 2, 2);
	for (let bar = 1; bar <= 3; bar++) {
		line(ctx, 49, 229 + bar * 4.2, 58, 229 + bar * 4.2, CHROME, 1.3);
	}

	// Fender vent behind the front wheel.
	rect(ctx, 184, 200, 24, 10, BLACK_DEEP, 2, 1.8);
	for (let vent = 0; vent < 3; vent++) {
		line(ctx, 187, 203 + vent * 2.6, 205, 203 + vent * 2.6, CHROME, 1.1);
	}
}

/** Rear bumper, lamps, plate, boot trim and the exhaust tip. */
function rearFittings(ctx: CanvasRenderingContext2D): void {
	rect(ctx, BUMPER_REAR.x, BUMPER_REAR.y, BUMPER_REAR.w, BUMPER_REAR.h, CHROME, 2.5, 2.6);
	line(ctx, 800, 238, 810, 238, 'rgba(255,255,255,0.6)', 1.4);
	line(ctx, 800, 251, 810, 251, 'rgba(58,39,27,0.28)', 1.3);

	line(ctx, 720, 190, 792, 190, 'rgba(58,39,27,0.5)', 1.6);
	line(ctx, 720, 191.4, 792, 191.4, 'rgba(255,255,255,0.22)', 1.2);

	rect(ctx, 786, 196, 10, 22, TAIL, 2, 1.8);
	rect(ctx, 786, 220, 10, 8, AMBER, 1.5, 1.5);

	rect(ctx, 752, 232, 30, 11, CREAM, 1.5, 1.6);
	ctx.fillStyle = BLACK;
	ctx.fillRect(755, 234, 3, 7);
	ctx.fillStyle = INK;
	ctx.fillRect(760, 236, 11, 1.5);
	ctx.fillRect(760, 239, 8, 1.5);

	rect(ctx, EXHAUST.x, EXHAUST.y, EXHAUST.w, EXHAUST.h, STEEL, 2, 1.8);
	line(ctx, EXHAUST.x + 2, EXHAUST.y + 1.6, EXHAUST.x + EXHAUST.w - 2, EXHAUST.y + 1.6, 'rgba(255,255,255,0.3)', 1.2);
}

export function drawRealLimousineLevel(
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
		ctx.ellipse(420, 279, 350, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell.
	shape(ctx, SHELL, BLACK);

	if (shaded) paintShade(ctx);

	// Livery and panel work, clipped to the silhouette.
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Gold coachline along the bonnet and the waist.
	ctx.fillStyle = GOLD;
	ctx.fill(new Path2D(WAISTLINE));
	if (shaded) {
		line(ctx, 60, 194, 202, 180, 'rgba(255,255,255,0.32)', 1.3);
		line(ctx, 222, 172.6, 796, 172.6, GOLD_LIGHT, 1.5);
		line(ctx, 222, 179.2, 796, 179.2, GOLD_DARK, 1.3);
	}

	// Finer coachline above the rocker.
	ctx.fillStyle = GOLD;
	ctx.fill(new Path2D(PINSTRIPE));

	// Rocker in the deeper body colour.
	ctx.fillStyle = BLACK_DEEP;
	ctx.fillRect(58, 240, 734, 10);
	if (shaded) {
		line(ctx, 58, 240.6, 792, 240.6, 'rgba(255,255,255,0.2)', 1.2);
	}

	// Door shutlines: front door, the long stretch, then the rear passenger door.
	for (const seamX of [244, 368, 504, 616]) {
		line(ctx, seamX, 176, seamX, 246, 'rgba(20,18,28,0.85)', 1.8);
		if (shaded) {
			line(ctx, seamX + 1.5, 178, seamX + 1.5, 244, 'rgba(255,255,255,0.16)', 1.1);
		}
	}

	// Boot shutline and the rear quarter badge.
	line(ctx, 714, 180, 714, 246, 'rgba(20,18,28,0.85)', 1.6);
	circle(ctx, 700, 198, 7, GOLD, 1.6);
	circle(ctx, 700, 198, 3.1, BLACK_DEEP, 1.1);

	// Panel highlight along the shoulder, only once shaded.
	if (shaded) {
		line(ctx, 224, 184.6, 792, 184.6, 'rgba(255,255,255,0.1)', 1.6);
		line(ctx, 60, 204, 200, 191, 'rgba(255,255,255,0.16)', 1.4);
	}

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Glass: three panes, chrome pillars between them.
	for (const [path, gx, gy, gw, gh] of [
		[WIN_FRONT, 246, 126, 106, 42],
		[WIN_MIDDLE, 368, 126, 120, 42],
		[WIN_REAR, 504, 126, 116, 42]
	] as const) {
		shape(ctx, path, GLASS, 2.5);
		if (shaded) glassShade(ctx, path, gx, gy, gw, gh);
	}

	rect(ctx, 352, 124, 16, 46, CHROME, 0, 2);
	rect(ctx, 488, 124, 16, 46, CHROME, 0, 2);
	line(ctx, 354, 126, 354, 168, 'rgba(255,255,255,0.55)', 1.2);
	line(ctx, 490, 126, 490, 168, 'rgba(255,255,255,0.55)', 1.2);

	if (fitted) {
		// Chrome window surrounds and the roof drip rail.
		line(ctx, 268, 122, 664, 122, CHROME, 2.2);
		line(ctx, 222, 182, 796, 182, CHROME, 2.6);
		line(ctx, 222, 183.2, 796, 183.2, 'rgba(255,255,255,0.5)', 1.1);

		frontFittings(ctx);
		rearFittings(ctx);

		// Door mirror on the front door's leading edge, below the beltline so the glass tile
		// never covers it.
		line(ctx, 246, 184, 253, 181, INK, 3);
		line(ctx, 246, 184, 253, 181, CHROME, 1.6);
		rect(ctx, 226, 182, 20, 13, CHROME, 4, 2.2);
		rect(ctx, 229, 185, 14, 7, '#59637A', 2, 1.2);

		// Waistline door handles.
		rect(ctx, 336, 190, 20, 5, CHROME, 2.5, 1.8);
		rect(ctx, 514, 190, 20, 5, CHROME, 2.5, 1.8);

		// Boot handle.
		rect(ctx, 744, 204, 30, 6, CHROME, 3, 1.8);
	}

	// Wheel arches sit under the tyres.
	if (fitted) {
		wheelArch(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelArch(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: roof, bonnet edge and the rear panel.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(272, 119.4);
		ctx.lineTo(662, 119.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(62, 192.4);
		ctx.lineTo(200, 178.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(796.4, 186);
		ctx.lineTo(796.4, 232);
		ctx.stroke();

		// Headlight glow, with a softer tail-lamp bloom.
		const glow = ctx.createRadialGradient(58, 205, 1, 58, 205, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(58, 205, 30, 0, Math.PI * 2);
		ctx.fill();

		const tail = ctx.createRadialGradient(792, 206, 1, 792, 206, 20);
		tail.addColorStop(0, 'rgba(255,90,110,0.5)');
		tail.addColorStop(1, 'rgba(255,90,110,0)');
		ctx.fillStyle = tail;
		ctx.beginPath();
		ctx.arc(792, 206, 20, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 271, 27, 4.2, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		paintSheen(ctx);
		waistlineSheen(ctx);
		pillarSheen(ctx);

		// Chrome and lamp glints, clear of the glass and tyres.
		glint(ctx, 316, 200, 4.2);
		glint(ctx, 604, 196, 3.6);
		glint(ctx, 448, 228, 3.2);
		glint(ctx, 92, 214, 3.2);
		glint(ctx, 196, 188, 3.2);
		glint(ctx, 662, 206, 2.8);
		glint(ctx, 758, 240, 2.8);
		glint(ctx, 770, 198, 2.6);
		glint(ctx, 60, 205, 2.6);

		// Glass sheen in the three panes, with a sparkle in each long pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		for (const [gx, gy] of [
			[282, 166],
			[392, 166],
			[528, 166]
		] as const) {
			ctx.beginPath();
			ctx.moveTo(gx, gy);
			ctx.lineTo(gx + 26, gy - 40);
			ctx.stroke();
		}
		ctx.strokeStyle = 'rgba(255,255,255,0.28)';
		ctx.lineWidth = 1.6;
		for (const [gx, gy] of [
			[298, 168],
			[410, 168],
			[546, 168]
		] as const) {
			ctx.beginPath();
			ctx.moveTo(gx, gy);
			ctx.lineTo(gx + 20, gy - 32);
			ctx.stroke();
		}
		glint(ctx, 412, 148, 2.6);
		glint(ctx, 566, 142, 2.2);
		ctx.restore();

		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);

		// Exhaust puff drifting back under the boot.
		ctx.save();
		const puff = (px: number, py: number, pr: number, alpha: number) => {
			ctx.globalAlpha = alpha;
			ctx.fillStyle = '#E4E7EF';
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		};
		puff(736, 251, 4.2, 0.3);
		puff(744, 247, 5, 0.2);
		puff(753, 242, 6, 0.12);
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealLimousine(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealLimousineLevel(ctx, x, y, scale, 5);
}
