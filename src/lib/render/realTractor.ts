/**
 * Farm tractor art, cut into the same five-piece kit as the rest of the realistic fleet.
 * A compact green tractor facing left: low sloping bonnet, tall glazed cab, vertical
 * exhaust stack ahead of the windscreen, a deep mudguard over the rear wheel and a
 * compact front wheel, with a three-point linkage trailed off the back. Orange livery
 * bands, orange fender lip and orange hubs carry the second colour.
 * Level 5 is the production target: shaded, fitted, lit and picture-book finished.
 */

import { CHROME, GLASS, INK, STEEL, circle, line, rect, shape, wheel } from './realKit';

const GREEN = '#59B85C';
const ORANGE = '#F4A261';
const CREAM = '#FFF6E4';
const LAMP = '#FFF1BE';
const AMBER = '#FFB703';
const RED = '#FF6B6B';
const WELL = '#24412A';
const IRON = '#3E4652';
const RAIL = '#4C5560';

/** Art box 640 x 330, road at 272. Front (bonnet) faces left. */
const FRONT_WHEEL = { x: 150, y: 236, r: 36 };
const REAR_WHEEL = { x: 500, y: 236, r: 36 };
const ARCH_F = 'M108,244 Q108,201 150,197 Q192,201 192,244';
const ARCH_R = 'M460,244 Q460,198 500,194 Q540,198 540,244';

/**
 * One silhouette: bonnet, exhaust stack, cab, rear trunk and mudguard, with a wheel
 * arch cut out at each axle. The stack rises out of the bonnet ahead of the raked
 * windscreen, so the whole working profile stays in one cut-out.
 */
const SHELL =
	'M30,244 L30,192 Q30,183 41,179 L54,175 Q62,167 76,165 L158,149 L164,148 L164,54 Q164,46 172,46 L184,46 Q192,46 192,54 L192,118 L197,127 Q199,132 205,135 L205,140 L231,63 Q234,55 244,55 L382,53 Q394,53 396,65 L398,168 L412,180 L432,186 Q440,168 456,162 Q500,154 544,162 Q562,170 568,186 L572,200 L572,244 L540,244 Q540,198 500,194 Q460,198 460,244 L192,244 Q192,201 150,197 Q108,201 108,244 L30,244 Z';

/** Cast front weight, transmission block and the linkage trailed off the back. */
const WEIGHT = 'M18,208 L30,208 L30,244 L18,244 Z';
const CHASSIS_BLOCK = 'M250,244 L430,244 L430,262 L250,262 Z';
const TOP_LINK = 'M574,237 L620,222 L622,229 L576,243 Z';
const LOWER_LINK = 'M556,244 L616,258 L614,266 L554,252 Z';
const LINK_BALL = 'M616,263 A5,5 0 1 1 626,263 A5,5 0 1 1 616,263 Z';
const BEACON = 'M294,44 Q294,36 302,36 L308,36 Q316,36 316,44 L316,52 L294,52 Z';

const WINDSCREEN = 'M212,131 L235,64 L250,64 L250,131 Z';
const DOOR_GLASS =
	'M255,63 L317,63 Q321,63 321,67 L321,125 Q321,129 317,129 L255,129 Q251,129 251,125 L251,67 Q251,63 255,63 Z';
const QUARTER_GLASS =
	'M333,70 L381,70 Q384,70 384,73 L384,121 Q384,124 381,124 L333,124 Q330,124 330,121 L330,73 Q330,70 333,70 Z';
const WINDOW_MASK = `${WINDSCREEN} ${DOOR_GLASS} ${QUARTER_GLASS}`;

const DOOR = { x: 254, y: 136, w: 66, h: 78 };
const DOOR_MASK = `M${DOOR.x},${DOOR.y} L${DOOR.x + DOOR.w},${DOOR.y} L${DOOR.x + DOOR.w},${
	DOOR.y + DOOR.h
} L${DOOR.x},${DOOR.y + DOOR.h} Z`;

function pane(x: number, y: number, w: number, h: number, r: number): string {
	return `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${
		y + h - r
	} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${
		y + h - r
	} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;
}

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
	glass.addColorStop(0.45, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(96,176,226,0.3)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** The dark wheel well, filled exactly inside the arch cut-out. */
function drawWheelWell(ctx: CanvasRenderingContext2D, arch: string, left: number, right: number): void {
	ctx.beginPath();
	ctx.fillStyle = WELL;
	ctx.fill(new Path2D(`${arch} L${right},250 L${left},250 Z`));
}

/** Orange lip laid just inside the rear mudguard's arch cut-out. */
function fenderLip(ctx: CanvasRenderingContext2D): void {
	const cx = REAR_WHEEL.x;
	const left = cx - 42;
	const right = cx + 42;
	ctx.beginPath();
	ctx.moveTo(left + 2, 242);
	ctx.quadraticCurveTo(left + 2, 199, cx, 195);
	ctx.quadraticCurveTo(right - 2, 199, right - 2, 242);
	ctx.strokeStyle = ORANGE;
	ctx.lineWidth = 5;
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(left + 2, 242);
	ctx.quadraticCurveTo(left + 2, 199, cx, 195);
	ctx.quadraticCurveTo(right - 2, 199, right - 2, 242);
	ctx.stroke();
}

/** Exhaust stack: a sooted steel pipe with heat bands and a flapper cap. */
function drawStack(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	ctx.save();
	ctx.clip(new Path2D('M164,46 L192,46 L192,127 L164,127 Z'));
	ctx.fillStyle = RAIL;
	ctx.fillRect(164, 46, 28, 81);
	const pipe = ctx.createLinearGradient(164, 0, 192, 0);
	pipe.addColorStop(0, '#697380');
	pipe.addColorStop(0.45, '#57616D');
	pipe.addColorStop(1, '#343C47');
	ctx.fillStyle = pipe;
	ctx.fillRect(166, 47, 24, 79);
	ctx.fillStyle = 'rgba(255,255,255,0.2)';
	ctx.fillRect(169, 50, 3, 72);
	if (shaded) {
		for (let band = 0; band < 4; band++) {
			line(ctx, 166, 58 + band * 14, 190, 58 + band * 14, 'rgba(20,26,32,0.28)', 2);
		}
		ctx.fillStyle = 'rgba(20,26,32,0.35)';
		ctx.fillRect(184, 50, 6, 74);
	}
	if (fitted) {
		ctx.fillStyle = 'rgba(32,26,22,0.5)';
		ctx.beginPath();
		ctx.ellipse(178, 48, 10, 3, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	rect(ctx, 162, 46, 32, 6, '#454E5A', 2, 2);
	if (shaded) {
		line(ctx, 165, 47.5, 191, 47.5, 'rgba(255,255,255,0.4)', 1.2);
	}
}

/** Two-stage cast weight on the nose, with its lifting slots. */
function drawFrontWeight(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	shape(ctx, WEIGHT, '#59626E', 2.4);
	line(ctx, 20, 216, 28, 216, '#7C8794', 2);
	if (fitted) {
		for (const wy of [218, 228, 238]) {
			line(ctx, 20, wy, 28, wy, '#2C333C', 2.2);
		}
		circle(ctx, 24, 211, 1.6, CHROME, 0.9);
		circle(ctx, 24, 241, 1.6, CHROME, 0.9);
	}
}

/** Three-point linkage: top link, draft links, ball ends and pins. */
function drawLinkage(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, TOP_LINK, '#616B77', 2.2);
	shape(ctx, LOWER_LINK, '#59626E', 2.4);
	circle(ctx, 621, 263, 5, CHROME, 2);

	if (shaded) {
		line(ctx, 574, 238, 618, 224, 'rgba(255,255,255,0.34)', 1.4);
		line(ctx, 558, 249, 612, 261, 'rgba(255,255,255,0.3)', 1.4);
	}
	if (fitted) {
		circle(ctx, 576, 239, 3, CHROME, 1.4);
		circle(ctx, 560, 250, 2.6, CHROME, 1.3);
		circle(ctx, 610, 259, 2.6, CHROME, 1.3);
		circle(ctx, 621, 263, 1.8, IRON, 1);
		// PTO stub and the remote valve block on the rear housing.
		circle(ctx, 530, 230, 5, STEEL, 2);
		for (let spline = 0; spline < 6; spline++) {
			const a = (spline / 6) * Math.PI * 2;
			line(
				ctx,
				530 + Math.cos(a) * 2,
				230 + Math.sin(a) * 2,
				530 + Math.cos(a) * 4,
				230 + Math.sin(a) * 4,
				IRON,
				1
			);
		}
		rect(ctx, 522, 208, 14, 9, STEEL, 2, 1.6);
		circle(ctx, 526, 212.5, 1.2, CHROME, 0.7);
		circle(ctx, 532, 212.5, 1.2, CHROME, 0.7);
	}
}

/**
 * Picture-book hub: a machined orange ring, a chrome centre disc that covers the generic
 * five-bolt stamp, six lug nuts with catchlights, a bright crown and a valve stem.
 * Every mark is symmetric so the flipped rear wheel still reads as the same part.
 */
function hubFinish(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	// Warm ring, lit at the top-left and falling to a copper edge at the bottom-right.
	const ring = ctx.createLinearGradient(cx - r * 0.3, cy - r * 0.3, cx + r * 0.3, cy + r * 0.3);
	ring.addColorStop(0, '#FFD3A0');
	ring.addColorStop(0.5, ORANGE);
	ring.addColorStop(1, '#C97A3E');
	ctx.strokeStyle = ring;
	ctx.lineWidth = 3.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.285, 0, Math.PI * 2);
	ctx.stroke();

	// Chrome centre disc hides the kit's five small bolts so the six tractor lugs read.
	const disc = ctx.createLinearGradient(
		cx - r * 0.24,
		cy - r * 0.24,
		cx + r * 0.24,
		cy + r * 0.24
	);
	disc.addColorStop(0, '#F2F6FA');
	disc.addColorStop(0.55, '#CDD6E2');
	disc.addColorStop(1, '#9AA5B4');
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.245, 0, Math.PI * 2);
	ctx.fillStyle = disc;
	ctx.fill();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const lx = cx + Math.cos(a) * r * 0.315;
		const ly = cy + Math.sin(a) * r * 0.315;
		circle(ctx, lx, ly, 1.7, IRON, 0.9);
		ctx.fillStyle = 'rgba(255,255,255,0.75)';
		ctx.beginPath();
		ctx.arc(lx - 0.55, ly - 0.55, 0.6, 0, Math.PI * 2);
		ctx.fill();
	}

	// Bright crown on the chrome rim, then the shaded half opposite it.
	ctx.strokeStyle = 'rgba(255,255,255,0.78)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 1.04, Math.PI * 1.56);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,26,32,0.24)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 0.1, Math.PI * 0.5);
	ctx.stroke();

	// Centre cap and its pinpoint.
	circle(ctx, cx, cy, r * 0.13, '#AEB8C6', 1.2);
	ctx.fillStyle = 'rgba(255,255,255,0.9)';
	ctx.beginPath();
	ctx.arc(cx - r * 0.035, cy - r * 0.035, r * 0.045, 0, Math.PI * 2);
	ctx.fill();

	line(ctx, cx - r * 0.18, cy + r * 0.34, cx - r * 0.3, cy + r * 0.2, CHROME, 1.6);
	circle(ctx, cx - r * 0.3, cy + r * 0.2, 0.9, '#FFFFFF', 0.5);
}

/** A four-point sparkle with a warm core, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.8;
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

/**
 * Deterministic picture-book paint grain over the painted shell only, never across the
 * glazing, the exhaust stack or the tyre circles. A dark tooth, a broken highlight layer
 * and a pale sun-bleach pass give the paint depth that survives the game scale.
 */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const onGlass = (px: number, py: number): boolean =>
		px >= 210 && px <= 386 && py >= 62 && py <= 133;
	const onWheel = (px: number, py: number): boolean =>
		Math.hypot(px - FRONT_WHEEL.x, py - FRONT_WHEEL.y) < FRONT_WHEEL.r + 3 ||
		Math.hypot(px - REAR_WHEEL.x, py - REAR_WHEEL.y) < REAR_WHEEL.r + 3;
	const onStack = (px: number, py: number): boolean => px >= 161 && px <= 195 && py <= 132;

	ctx.save();
	ctx.clip(new Path2D(SHELL));
	let seed = 67;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	// Dark tooth settling into the paint.
	ctx.fillStyle = INK;
	for (let i = 0; i < 540; i++) {
		const px = 20 + rnd() * 600;
		const py = 40 + rnd() * 210;
		if (onGlass(px, py) || onWheel(px, py) || onStack(px, py)) continue;
		ctx.globalAlpha = 0.045 + rnd() * 0.065;
		const size = 1.3 + rnd() * 1.9;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	// Broken highlights that keep the crown from reading as flat colour.
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 230; i++) {
		const px = 20 + rnd() * 600;
		const py = 40 + rnd() * 210;
		if (onGlass(px, py) || onWheel(px, py) || onStack(px, py)) continue;
		ctx.globalAlpha = 0.07 + rnd() * 0.11;
		const size = 1.2 + rnd() * 1.4;
		ctx.fillRect(px, py, size, size);
	}

	// Sun-bleached tooth on the upper panels, where the roof light lands.
	ctx.fillStyle = '#EAF7D8';
	for (let i = 0; i < 85; i++) {
		const px = 32 + rnd() * 540;
		const py = 44 + rnd() * 112;
		if (onGlass(px, py) || onStack(px, py)) continue;
		ctx.globalAlpha = 0.06 + rnd() * 0.08;
		ctx.fillRect(px, py, 1 + rnd() * 1.3, 1 + rnd() * 1.3);
	}

	// Long brush sweeps: daylight along the bonnet crown, shade under the cab shoulder,
	// then a rolling sheen across the deck and the rear mudguard.
	ctx.globalAlpha = 0.16;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.8;
	for (const [sx, sy, ex, ey] of [
		[44, 176, 160, 154],
		[212, 140, 336, 134],
		[356, 176, 428, 186],
		[446, 180, 556, 184],
		[430, 214, 560, 210]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/**
 * Straw and chaff caught on the working panels: short bent pieces over the bonnet, deck
 * and mudguard, plus a few longer stalks hooked on the fender flank. Every piece is
 * rotated and curved independently, and the whole pass is clipped to the shell so
 * nothing floats past the silhouette.
 */
function strawFlecks(ctx: CanvasRenderingContext2D): void {
	const onGlass = (px: number, py: number): boolean =>
		px >= 210 && px <= 386 && py >= 62 && py <= 133;
	const onWheel = (px: number, py: number): boolean =>
		Math.hypot(px - FRONT_WHEEL.x, py - FRONT_WHEEL.y) < FRONT_WHEEL.r + 2 ||
		Math.hypot(px - REAR_WHEEL.x, py - REAR_WHEEL.y) < REAR_WHEEL.r + 2;

	ctx.save();
	ctx.clip(new Path2D(SHELL));
	let seed = 137;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	const straw = ['#EBCB8B', '#D9AE63', '#BF8C42', '#F2DEA6'];

	for (const [x0, x1, y0, y1, count] of [
		[34, 202, 164, 208, 16],
		[424, 570, 164, 212, 16],
		[226, 424, 196, 240, 12]
	]) {
		for (let i = 0; i < count; i++) {
			const px = x0 + rnd() * (x1 - x0);
			const py = y0 + rnd() * (y1 - y0);
			if (onGlass(px, py) || onWheel(px, py)) continue;
			const len = 2.4 + rnd() * 3.6;
			ctx.save();
			ctx.translate(px, py);
			ctx.rotate(-0.9 + rnd() * 1.8);
			ctx.strokeStyle = straw[i % straw.length];
			ctx.globalAlpha = 0.24 + rnd() * 0.22;
			ctx.lineWidth = 1 + rnd() * 0.7;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.quadraticCurveTo(
				len * 0.42,
				-0.7 - rnd() * 0.9,
				len,
				-0.2 + rnd() * 0.6
			);
			ctx.stroke();
			ctx.restore();
		}
	}

	// A few longer stalks caught on the fender flank and the deck edge.
	for (let i = 0; i < 5; i++) {
		const px = i < 3 ? 444 + rnd() * 112 : 330 + rnd() * 76;
		const py = i < 3 ? 192 + rnd() * 20 : 230 + rnd() * 9;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		const len = 7 + rnd() * 5;
		ctx.save();
		ctx.translate(px, py);
		ctx.rotate(-0.5 + rnd() * 0.9);
		ctx.strokeStyle = straw[(i + 1) % straw.length];
		ctx.globalAlpha = 0.3 + rnd() * 0.16;
		ctx.lineWidth = 1.1 + rnd() * 0.4;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.quadraticCurveTo(len * 0.38, -1.6, len * 0.7, -0.5);
		ctx.quadraticCurveTo(len * 0.88, 0.1, len, -1);
		ctx.stroke();
		ctx.restore();
	}

	// Loose chaff dots so the straw reads as debris, not decoration.
	ctx.fillStyle = '#DDBB74';
	for (let i = 0; i < 26; i++) {
		const px = 36 + rnd() * 526;
		const py = 160 + rnd() * 78;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.2 + rnd() * 0.2;
		ctx.fillRect(px, py, 1 + rnd() * 0.9, 1 + rnd() * 0.9);
	}
	ctx.restore();
}

/** Level-5 gloss on the mudguards and deck: lit crown, rolled lip, shadowed flank. */
function fenderSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Rear mudguard: light pools on the crown and the flank falls into shade.
	const fender = ctx.createLinearGradient(0, 152, 0, 236);
	fender.addColorStop(0, 'rgba(255,255,255,0.26)');
	fender.addColorStop(0.34, 'rgba(255,255,255,0.08)');
	fender.addColorStop(0.72, 'rgba(18,48,22,0.04)');
	fender.addColorStop(1, 'rgba(18,48,22,0.22)');
	ctx.fillStyle = fender;
	ctx.fillRect(428, 152, 146, 84);

	// Crown catchlight follows the fender arc, then a soft shadow below it.
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.moveTo(438, 183);
	ctx.quadraticCurveTo(458, 166, 500, 160);
	ctx.quadraticCurveTo(538, 163, 562, 180);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(18,48,22,0.2)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(446, 190);
	ctx.quadraticCurveTo(466, 176, 500, 171);
	ctx.quadraticCurveTo(534, 173, 552, 187);
	ctx.stroke();

	// Deck pressing behind the cab: lit top edge, shadow at the rocker.
	line(ctx, 322, 201.2, 394, 201.2, 'rgba(255,255,255,0.28)', 1.3);
	line(ctx, 322, 213, 394, 213, 'rgba(58,39,27,0.24)', 1.3);

	// Front arch liner catches a little sky on its crown.
	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(114, 238);
	ctx.quadraticCurveTo(116, 205, 150, 201);
	ctx.quadraticCurveTo(184, 205, 186, 238);
	ctx.stroke();
	ctx.restore();

	// Warm highlight rolling along the orange fender lip, with a dark line under it.
	ctx.strokeStyle = 'rgba(255,226,180,0.72)';
	ctx.lineWidth = 1.7;
	ctx.beginPath();
	ctx.moveTo(461, 239);
	ctx.quadraticCurveTo(461, 202, 500, 197.5);
	ctx.quadraticCurveTo(539, 202, 539, 239);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(58,39,27,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(459, 241);
	ctx.quadraticCurveTo(459, 204, 500, 199.5);
	ctx.quadraticCurveTo(541, 204, 541, 241);
	ctx.stroke();
}

/** Level-5 metal finish: lit upper edges, dark undersides and bright pins on the linkage. */
function linkageSheen(ctx: CanvasRenderingContext2D): void {
	// Top link: daylight along the top edge, shade along the underside.
	line(ctx, 577, 235.4, 618, 222.4, 'rgba(255,255,255,0.5)', 1.5);
	line(ctx, 578, 241, 620, 227.6, 'rgba(20,26,32,0.3)', 1.4);

	// Draft link below it.
	line(ctx, 558, 246.2, 613, 257.6, 'rgba(255,255,255,0.46)', 1.5);
	line(ctx, 556, 251.4, 613, 264.4, 'rgba(20,26,32,0.32)', 1.4);

	// Ball end: chrome crescent over a dark seat.
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(621, 263, 3.4, Math.PI * 1.05, Math.PI * 1.72);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,26,32,0.3)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(621, 263, 3.4, Math.PI * 0.1, Math.PI * 0.55);
	ctx.stroke();

	// Link pins and the PTO splines pick up the same light.
	ctx.fillStyle = 'rgba(255,255,255,0.72)';
	for (const [px, py] of [
		[575.6, 238.4],
		[559.6, 249.4],
		[609.6, 258.4]
	]) {
		ctx.beginPath();
		ctx.arc(px, py, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}
	line(ctx, 527.4, 227.6, 532.6, 227.6, 'rgba(255,255,255,0.55)', 1.1);
	line(ctx, 524, 210.2, 534, 210.2, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 524.4, 214.8, 533.6, 214.8, 'rgba(20,26,32,0.3)', 1.1);
}


export function drawRealTractorLevel(
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
		ctx.ellipse(320, 281, 302, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Dark wells behind the arches, before the tyre tiles go on top.
	drawWheelWell(ctx, ARCH_F, 108, 192);
	drawWheelWell(ctx, ARCH_R, 460, 540);

	// Painted silhouette: bonnet, stack, cab, rear trunk and mudguard.
	shape(ctx, SHELL, GREEN);

	const shellPath = new Path2D(SHELL);
	ctx.save();
	ctx.clip(shellPath);

	// Livery: bonnet shoulder stripe, cab belt and roof cap in orange.
	ctx.fillStyle = ORANGE;
	ctx.fill(new Path2D('M34,192 L164,166 L164,176 L34,202 Z'));
	ctx.fillRect(205, 132, 191, 6);
	ctx.fillRect(246, 55, 134, 6);
	ctx.fillRect(320, 200, 76, 14);

	if (shaded) {
		// Roof light rolling down the cab and bonnet into a low-body shade.
		const paint = ctx.createLinearGradient(0, 38, 0, 250);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.4, 'rgba(255,255,255,0.04)');
		paint.addColorStop(0.78, 'rgba(20,58,26,0.06)');
		paint.addColorStop(1, 'rgba(18,48,22,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(18, 36, 610, 212);

		// Bonnet crown gets its own pool of light; cab pillars drop a shadow.
		ctx.fillStyle = 'rgba(255,255,255,0.14)';
		ctx.fill(new Path2D('M42,184 L160,158 L160,150 L42,176 Z'));
		ctx.fillStyle = 'rgba(16,44,20,0.16)';
		ctx.fillRect(205, 136, 6, 106);
		ctx.fillRect(392, 66, 4, 170);
		ctx.fillStyle = 'rgba(16,44,20,0.12)';
		ctx.fillRect(30, 226, 540, 18);

		// Fender backs fall away under the deck.
		const fenderShade = ctx.createLinearGradient(0, 158, 0, 244);
		fenderShade.addColorStop(0, 'rgba(255,255,255,0.16)');
		fenderShade.addColorStop(0.55, 'rgba(255,255,255,0)');
		fenderShade.addColorStop(1, 'rgba(18,48,22,0.2)');
		ctx.fillStyle = fenderShade;
		ctx.fillRect(430, 158, 142, 86);
	}

	// Panel work: bonnet crease, cowl seam, cab rear seam and the deck pressing.
	line(ctx, 44, 178, 160, 154, 'rgba(255,255,255,0.3)', 1.6);
	line(ctx, 44, 198, 162, 172, 'rgba(58,39,27,0.18)', 1.4);
	line(ctx, 205, 141, 205, 226, INK, 2.2);
	line(ctx, 398, 168, 398, 228, 'rgba(58,39,27,0.35)', 2);
	line(ctx, 414, 182, 430, 186, 'rgba(58,39,27,0.22)', 1.6);
	if (shaded) {
		line(ctx, 436, 180, 566, 182, 'rgba(255,255,255,0.16)', 1.6);
	}
	ctx.restore();

	// Re-stroke the silhouette after the opaque livery fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(shellPath);

	// Exhaust stack, weight and linkage read at every level: they name the machine.
	drawStack(ctx, shaded, fitted);
	drawFrontWeight(ctx, fitted);

	// Transmission and the trailed linkage.
	shape(ctx, CHASSIS_BLOCK, '#3B434E', 2.2);
	line(ctx, 258, 247, 422, 247, 'rgba(255,255,255,0.16)', 1.4);
	drawLinkage(ctx, shaded, fitted);

	// Window glass and the cab door.
	shape(ctx, WINDSCREEN, GLASS, 2.4);
	shape(ctx, DOOR_GLASS, GLASS, 2.4);
	shape(ctx, QUARTER_GLASS, GLASS, 2.4);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 212, 64, 38, 67);
		glassShade(ctx, DOOR_GLASS, 251, 63, 70, 66);
		glassShade(ctx, QUARTER_GLASS, 330, 70, 54, 54);
	}
	// Rubber seals around the door glass and quarter light.
	ctx.strokeStyle = '#2F3338';
	ctx.lineWidth = 2;
	ctx.stroke(new Path2D(pane(251, 63, 70, 66, 4)));
	ctx.stroke(new Path2D(pane(330, 70, 54, 54, 3)));

	ctx.fillStyle = GREEN;
	ctx.fill(new Path2D(DOOR_MASK));
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.stroke(new Path2D(DOOR_MASK));
	ctx.save();
	ctx.clip(new Path2D(DOOR_MASK));
	if (shaded) {
		const skin = ctx.createLinearGradient(0, 136, 0, 214);
		skin.addColorStop(0, 'rgba(255,255,255,0.2)');
		skin.addColorStop(0.62, 'rgba(255,255,255,0.02)');
		skin.addColorStop(1, 'rgba(18,48,22,0.18)');
		ctx.fillStyle = skin;
		ctx.fillRect(254, 136, 66, 78);
	}
	ctx.fillStyle = ORANGE;
	ctx.fillRect(254, 200, 66, 14);
	line(ctx, 256, 199.4, 318, 199.4, 'rgba(255,255,255,0.45)', 1.4);
	line(ctx, 256, 204, 318, 204, 'rgba(58,39,27,0.16)', 1.2);
	// Door seam against the cab and the sliding-glass rail.
	line(ctx, 258, 136, 258, 214, 'rgba(58,39,27,0.28)', 1.6);
	ctx.restore();

	// Front axle beam drops from the chassis into the front hub.
	line(ctx, 114, 246, 150, 238, RAIL, 7);
	line(ctx, 116, 244.5, 148, 237, 'rgba(255,255,255,0.22)', 1.6);

	// Wheels: one piece used twice, the rear slot flipped.
	wheel(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r, finish);
	wheel(ctx, REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r, finish);

	if (shaded) {
		// Beltline chrome picks out the stripe and the door shoulder.
		line(ctx, 208, 133, 396, 133, 'rgba(255,255,255,0.3)', 1.2);
		line(ctx, 34, 202, 164, 176, 'rgba(255,255,255,0.22)', 1.2);
	}

	if (fitted) {
		// Orange lip on the big rear mudguard; a dark liner on the front arch.
		fenderLip(ctx);
		ctx.strokeStyle = IRON;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(110, 242);
		ctx.quadraticCurveTo(110, 202, 150, 198);
		ctx.quadraticCurveTo(190, 202, 190, 242);
		ctx.stroke();

		// Grille, headlamp and indicator on the nose.
		rect(ctx, 31, 196, 10, 40, '#39414C', 2, 2);
		for (let gy = 202; gy <= 228; gy += 6) {
			line(ctx, 34, gy, 38, gy, CHROME, 1.1);
		}
		circle(ctx, 52, 188, 9, CHROME, 2.2);
		circle(ctx, 52, 188, 6.4, LAMP, 1.8);
		circle(ctx, 51, 187, 2, '#FFFDE8', 0.8);
		circle(ctx, 51, 206, 3.6, AMBER, 1.6);

		// Bonnet badge, filler cap and louvres.
		circle(ctx, 118, 176, 3.6, ORANGE, 1.4);
		circle(ctx, 118, 176, 1.4, CREAM, 0.8);
		circle(ctx, 96, 172, 3.8, CHROME, 1.4);
		for (let louvre = 0; louvre < 3; louvre++) {
			line(ctx, 86, 184 + louvre * 5, 126, 177 + louvre * 5, 'rgba(44,102,51,0.7)', 1.6);
		}

		// Step, cab grab rail and the door handle.
		rect(ctx, 258, 219, 34, 7, STEEL, 2, 2);
		rect(ctx, 264, 228, 24, 5, RAIL, 2, 1.6);
		line(ctx, 390, 142, 390, 196, CHROME, 2.2);
		rect(ctx, 302, 176, 12, 4, CHROME, 2, 1.4);
		line(ctx, 306, 219, 318, 219, 'rgba(58,39,27,0.4)', 1.4);

		// Beacon on the cab roof, tail lamps and plate on the fender.
		shape(ctx, BEACON, '#3E4652', 2);
		rect(ctx, 297, 39, 16, 9, AMBER, 4, 1.4);
		line(ctx, 299, 44, 311, 44, 'rgba(255,255,255,0.6)', 1.2);
		rect(ctx, 542, 198, 12, 10, RED, 2, 1.6);
		rect(ctx, 556, 200, 7, 7, AMBER, 1.4);
		rect(ctx, 544, 214, 26, 11, CREAM, 1.4);
		line(ctx, 548, 218, 566, 218, 'rgba(58,39,27,0.5)', 1.2);
		line(ctx, 548, 221, 560, 221, 'rgba(58,39,27,0.35)', 1.2);

		// Rear work lamp and remote valves on the mudguard crown.
		rect(ctx, 466, 160, 13, 9, IRON, 2, 1.6);
		rect(ctx, 469, 162, 7, 5, LAMP, 1, 1);
		line(ctx, 480, 164, 485, 166, INK, 1.6);
		circle(ctx, 456, 176, 3, CHROME, 1.4);
		circle(ctx, 456, 176, 1.2, IRON, 0.8);
		circle(ctx, 463, 176, 3, CHROME, 1.4);
		circle(ctx, 463, 176, 1.2, IRON, 0.8);
		line(ctx, 450, 182, 474, 182, 'rgba(58,39,27,0.3)', 1.4);
	}

	if (lit) {
		// Rim light along the roof, bonnet and mudguard crown.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(246, 56.5);
		ctx.lineTo(380, 54.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(78, 166);
		ctx.lineTo(156, 150.5);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(458, 160);
		ctx.quadraticCurveTo(500, 154, 542, 161);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.32)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(171, 54);
		ctx.lineTo(171, 120);
		ctx.stroke();

		// Headlamp glow and the beacon wash.
		const glow = ctx.createRadialGradient(52, 188, 1, 52, 188, 24);
		glow.addColorStop(0, 'rgba(255,240,150,0.75)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(52, 188, 24, 0, Math.PI * 2);
		ctx.fill();

		const beaconGlow = ctx.createRadialGradient(305, 43, 1, 305, 43, 17);
		beaconGlow.addColorStop(0, 'rgba(255,183,3,0.5)');
		beaconGlow.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beaconGlow;
		ctx.beginPath();
		ctx.arc(305, 43, 17, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const at of [FRONT_WHEEL, REAR_WHEEL]) {
			ctx.beginPath();
			ctx.ellipse(at.x, 271, 27, 4.5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		fenderSheen(ctx);
		strawFlecks(ctx);
		linkageSheen(ctx);

		// Bonnet and cab sheen, clipped to the painted shell and clear of the glass.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.strokeStyle = 'rgba(255,255,255,0.38)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(48, 182);
		ctx.quadraticCurveTo(110, 168, 160, 158);
		ctx.stroke();
		ctx.globalAlpha = 0.6;
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(52, 187);
		ctx.quadraticCurveTo(110, 174, 158, 164);
		ctx.stroke();
		ctx.globalAlpha = 1;
		ctx.strokeStyle = 'rgba(255,255,255,0.22)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(352, 176);
		ctx.quadraticCurveTo(400, 184, 430, 188);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.3)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(444, 170);
		ctx.quadraticCurveTo(500, 160, 556, 172);
		ctx.stroke();
		ctx.restore();

		// Glass sheen, kept inside the glazing.
		ctx.save();
		ctx.clip(new Path2D(WINDOW_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.66)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(218, 124);
		ctx.lineTo(240, 70);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(262, 124);
		ctx.lineTo(282, 70);
		ctx.stroke();
		ctx.lineWidth = 1.4;
		ctx.globalAlpha = 0.7;
		ctx.beginPath();
		ctx.moveTo(286, 120);
		ctx.lineTo(300, 82);
		ctx.stroke();
		ctx.restore();

		// Glints clear of the glass and the tyre circles: paint, chrome, lamps and pins.
		glint(ctx, 300, 57, 4.8);
		glint(ctx, 140, 158, 4.2);
		glint(ctx, 552, 168, 4);
		glint(ctx, 52, 186, 3.4);
		glint(ctx, 178, 44, 3.2);
		glint(ctx, 305, 43, 3);
		glint(ctx, 546, 203, 2.8);
		glint(ctx, 118, 174, 2.8);
		glint(ctx, 288, 160, 2.6);
		glint(ctx, 168, 96, 2.6);
		glint(ctx, 456, 174, 2.6);
		glint(ctx, 24, 214, 2.4);
		glint(ctx, 390, 143, 2.4);
		glint(ctx, 544, 216, 2.2);
		glint(ctx, 612, 250, 2.2);
		glint(ctx, 530, 228, 2.2);
		glint(ctx, 576, 239, 2);
		glint(ctx, 398, 196, 2);

		// Hub hardware on both wheels.
		hubFinish(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r);
		hubFinish(ctx, REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r);

		// Finishing marks: rocker dust, paint chips on the working edges and a scuff.
		ctx.save();
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = INK;
		for (let dust = 0; dust < 10; dust++) {
			const dx = 46 + dust * 52;
			if ((dx > 104 && dx < 198) || (dx > 456 && dx < 546)) continue;
			ctx.fillRect(dx, 236 + (dust % 3), 14, 2);
		}
		ctx.restore();

		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, chipW, alpha] of [
			[36, 238, 7, 0.45],
			[158, 240, 8, 0.35],
			[350, 232, 6, 0.35],
			[548, 240, 7, 0.35]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, chipW, 2);
		}
		ctx.restore();

		ctx.save();
		ctx.strokeStyle = 'rgba(58,39,27,0.22)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(470, 214);
		ctx.quadraticCurveTo(492, 212, 508, 214);
		ctx.stroke();
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealTractor(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealTractorLevel(ctx, x, y, scale, 5);
}
