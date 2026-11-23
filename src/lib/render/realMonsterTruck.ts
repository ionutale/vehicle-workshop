/**
 * Monster truck art, cut into the same five-piece kit as the rest of the realistic fleet.
 * Front faces left: a high-riding pickup body on a lifted ladder frame, huge tyres, a
 * tubular roll bar over the open bed and a purple/yellow flame-and-star livery.
 * The far-side axle is baked into the body art; the two near tyres share one wheel part.
 * Level 5 adds the picture-book finish: paint grain, flame and star highlights,
 * chrome on the roll bar and stacks, beadlock hub detail, glints and tyre sheen.
 */

import {
	CHROME,
	GLASS,
	INK,
	STEEL,
	TIRE,
	circle,
	line,
	rect,
	shape,
	wheel
} from './realKit';

const PURPLE = '#8338EC';
const PURPLE_DARK = '#3E1279';
const YELLOW = '#FFBE0B';
const GOLD = '#FFD65A';
const CREAM = '#FFF3CF';
const LAMP = '#FFF1BE';
const AMBER = '#FF9F1C';
const TAIL = '#FF4D6D';
const SOOT = '#3B3355';

/** Shell: nose, cab, bed side and the raised wheel arches in one silhouette. */
const SHELL =
	'M54,190 L54,150 Q54,142 64,138 L94,130 L146,124 Q158,124 164,116 L182,104 L196,96 Q202,88 212,84 L234,80 Q242,72 254,72 L326,72 Q338,72 340,84 L342,124 L348,130 L664,130 L664,190 L632,190 Q624,162 560,162 Q496,162 488,190 L216,190 Q208,162 150,162 Q92,162 84,190 Z';

/** Roll bar over the bed: one П-shaped tube, drawn as a single closed path. */
const ROLLBAR =
	'M382,130 L382,80 Q382,60 402,60 L518,60 Q538,60 538,80 L538,130 L526,130 L526,80 Q526,72 518,72 L402,72 Q394,72 394,80 L394,130 Z';

const WINDSCREEN = 'M212,120 L246,84 L256,84 L256,120 Z';
const DOOR_GLASS =
	'M266,84 Q266,80 270,80 L318,80 Q322,80 322,84 L322,116 Q322,120 318,120 L270,120 Q266,120 266,116 Z';
const QUARTER_GLASS =
	'M328,88 Q328,85 331,85 L335,85 Q338,85 338,88 L338,116 Q338,119 335,119 L331,119 Q328,119 328,116 Z';

const FRONT_BUMPER = 'M40,164 L54,164 L54,188 L40,188 Z';
const REAR_BUMPER = 'M664,162 L682,162 L682,186 L664,186 Z';

const WHEEL_L = { x: 150, y: 236, r: 55 };
const WHEEL_R = { x: 560, y: 236, r: 55 };
const FAR_L = { x: 198, y: 236, r: 44 };
const FAR_R = { x: 606, y: 236, r: 44 };
const ARCH_FRONT = 'M88,186 Q96,158 150,158 Q204,158 212,186';
const ARCH_REAR = 'M492,186 Q500,158 560,158 Q624,158 628,186';

const GLASS_AREAS: Array<[number, number, number, number]> = [
	[212, 80, 44, 40],
	[266, 80, 56, 40],
	[328, 85, 10, 34]
];

/** Five-point star, used on the door and the bed side. */
function star(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	r: number,
	fill: string,
	width = 1.6
): void {
	ctx.beginPath();
	for (let i = 0; i < 10; i++) {
		const a = -Math.PI / 2 + (i * Math.PI) / 5;
		const rr = i % 2 === 0 ? r : r * 0.44;
		const px = cx + Math.cos(a) * rr;
		const py = cy + Math.sin(a) * rr;
		if (i === 0) ctx.moveTo(px, py);
		else ctx.lineTo(px, py);
	}
	ctx.closePath();
	ctx.fillStyle = fill;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = width;
	ctx.stroke();
}

/** Far-side tyre: a dark, low-contrast wheel that sits behind the near one. */
function drawFarWheel(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, shaded: boolean): void {
	circle(ctx, cx, cy, r, TIRE, 3);
	ctx.strokeStyle = 'rgba(0,0,0,0.32)';
	ctx.lineWidth = 2;
	for (let i = 0; i < 10; i++) {
		const a = (i / 10) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * r * 0.76, cy + Math.sin(a) * r * 0.76);
		ctx.lineTo(cx + Math.cos(a) * r * 0.95, cy + Math.sin(a) * r * 0.95);
		ctx.stroke();
	}
	circle(ctx, cx, cy, r * 0.46, '#666B80', 2);
	circle(ctx, cx, cy, r * 0.18, '#4A4E63', 1.4);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, r, 0, Math.PI * 2);
		ctx.clip();
		const shade = ctx.createLinearGradient(0, cy - r, 0, cy + r);
		shade.addColorStop(0, 'rgba(20,12,26,0.32)');
		shade.addColorStop(0.6, 'rgba(20,12,26,0.1)');
		shade.addColorStop(1, 'rgba(0,0,0,0.42)');
		ctx.fillStyle = shade;
		ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
		ctx.restore();
	}
}

/** A yellow coil spring wrapped around each shock tower. */
function drawSpring(ctx: CanvasRenderingContext2D, x: number, top: number, bottom: number): void {
	ctx.strokeStyle = YELLOW;
	ctx.lineWidth = 3.2;
	ctx.beginPath();
	let up = true;
	ctx.moveTo(x - 4, top);
	for (let y = top; y <= bottom; y += 4) {
		ctx.lineTo(up ? x + 4 : x - 4, y);
		up = !up;
	}
	ctx.stroke();
	ctx.strokeStyle = 'rgba(58,39,27,0.45)';
	ctx.lineWidth = 1;
	ctx.stroke();
}

function shadeGlass(
	ctx: CanvasRenderingContext2D,
	path: string,
	x: number,
	y: number,
	w: number,
	h: number
): void {
	ctx.save();
	ctx.clip(new Path2D(path));
	const glass = ctx.createLinearGradient(x, y, x + w, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.58)');
	glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(105,190,240,0.28)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Paint grain over the shell only, never across the glazing or the tyre crowns. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	let seed = 83;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	const onGlass = (px: number, py: number): boolean =>
		GLASS_AREAS.some(([gx, gy, gw, gh]) => px >= gx && px <= gx + gw && py >= gy && py <= gy + gh);
	const onWheel = (px: number, py: number): boolean =>
		Math.hypot(px - WHEEL_L.x, py - WHEEL_L.y) < WHEEL_L.r + 2 ||
		Math.hypot(px - WHEEL_R.x, py - WHEEL_R.y) < WHEEL_R.r + 2;

	ctx.fillStyle = INK;
	for (let i = 0; i < 560; i++) {
		const px = 54 + rnd() * 610;
		const py = 72 + rnd() * 116;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.055 + rnd() * 0.07;
		const size = 1.3 + rnd() * 1.9;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 210; i++) {
		const px = 54 + rnd() * 610;
		const py = 72 + rnd() * 116;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.08 + rnd() * 0.09;
		ctx.fillRect(px, py, 1 + rnd() * 1.4, 1 + rnd() * 1.4);
	}

	// Sun-bleached flecks kept to the upper panels so the livery still reads below
	// the shoulder line.
	ctx.fillStyle = '#FFF6E4';
	for (let i = 0; i < 80; i++) {
		const px = 54 + rnd() * 610;
		const py = 72 + rnd() * 78;
		if (onGlass(px, py) || onWheel(px, py)) continue;
		ctx.globalAlpha = 0.08 + rnd() * 0.07;
		ctx.fillRect(px, py, 1 + rnd() * 1.2, 1 + rnd() * 1.2);
	}
	ctx.restore();

	// Long brush sweeps: daylight along the bonnet and roof, shade under the shoulder.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(66, 140);
	ctx.bezierCurveTo(110, 134, 160, 128, 198, 110);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.3)';
	ctx.beginPath();
	ctx.moveTo(260, 74.5);
	ctx.lineTo(322, 74.5);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.2)';
	ctx.beginPath();
	ctx.moveTo(236, 124);
	ctx.bezierCurveTo(276, 121.5, 310, 122.5, 340, 126);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,12,26,0.16)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(62, 144);
	ctx.bezierCurveTo(108, 138, 158, 132, 196, 114);
	ctx.stroke();

	// Bed flank: a long sweep above the rocker, shading into the sill.
	const bedWash = ctx.createLinearGradient(0, 158, 0, 184);
	bedWash.addColorStop(0, 'rgba(255,255,255,0.12)');
	bedWash.addColorStop(0.6, 'rgba(255,255,255,0.01)');
	bedWash.addColorStop(1, 'rgba(20,12,26,0.14)');
	ctx.fillStyle = bedWash;
	ctx.fillRect(348, 158, 316, 26);
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(352, 172);
	ctx.bezierCurveTo(430, 170, 570, 174, 656, 171);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,12,26,0.12)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(352, 180);
	ctx.bezierCurveTo(440, 178.5, 570, 181, 656, 179);
	ctx.stroke();
	ctx.restore();
}

/** Hub trim that survives the game scale: beadlock ring, bolts and a bright crown. */
function drawHubDetail(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	// Bright crown and a soft shadow inside the chrome disc rim.
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 1.02, Math.PI * 1.52);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,12,26,0.28)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 0.06, Math.PI * 0.44);
	ctx.stroke();

	// Machined inner ring: a shadowed groove with a lit upper lip.
	ctx.strokeStyle = 'rgba(58,39,27,0.3)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.29, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.3, Math.PI * 1.08, Math.PI * 1.55);
	ctx.stroke();

	// Machined spoke shadows, short enough to stay crisp at half scale.
	ctx.strokeStyle = 'rgba(58,39,27,0.2)';
	ctx.lineWidth = 1.6;
	for (const a of [Math.PI * 0.3, Math.PI * 1.02, Math.PI * 1.72]) {
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * r * 0.1, cy + Math.sin(a) * r * 0.1);
		ctx.lineTo(cx + Math.cos(a) * r * 0.27, cy + Math.sin(a) * r * 0.27);
		ctx.stroke();
	}

	// Chrome disc edge: shade below, catchlight above.
	ctx.strokeStyle = 'rgba(20,12,26,0.3)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.44, Math.PI * 0.1, Math.PI * 0.46);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.55)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.41, Math.PI * 1.06, Math.PI * 1.5);
	ctx.stroke();

	// Beadlock ring sheen along the top-left of the yellow band.
	ctx.strokeStyle = 'rgba(255,246,228,0.62)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.555, Math.PI * 1.1, Math.PI * 1.45);
	ctx.stroke();

	// Beadlock bolts: chrome heads with a pinpoint catchlight.
	for (let i = 0; i < 8; i++) {
		const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
		const bx = cx + Math.cos(a) * r * 0.66;
		const by = cy + Math.sin(a) * r * 0.66;
		circle(ctx, bx, by, 2.2, CHROME, 0.8);
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		ctx.beginPath();
		ctx.arc(bx - 0.5, by - 0.5, 0.7, 0, Math.PI * 2);
		ctx.fill();
	}

	// Centre cap, bright crescent and a screw slot.
	circle(ctx, cx, cy, r * 0.1, YELLOW, 1);
	ctx.strokeStyle = 'rgba(255,255,255,0.85)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.18, Math.PI * 1.08, Math.PI * 1.54);
	ctx.stroke();
	line(ctx, cx - 1.6, cy + 0.2, cx + 1.6, cy - 0.2, 'rgba(58,39,27,0.45)', 0.9);
}

/** Sidewall sheen and a shaded contact patch on the huge near tyres. */
function dressTyreFinish(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.22)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.8, Math.PI * 1.08, Math.PI * 1.44);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.1)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.74, Math.PI * 1.16, Math.PI * 1.4);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(0,0,0,0.3)';
	ctx.lineWidth = 3.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.9, Math.PI * 0.28, Math.PI * 0.6);
	ctx.stroke();

	// Tread blocks catch a hairline of light on the shoulder.
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 1.4;
	for (let i = 0; i < 12; i++) {
		const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * r * 0.88, cy + Math.sin(a) * r * 0.88);
		ctx.lineTo(cx + Math.cos(a) * r * 0.94, cy + Math.sin(a) * r * 0.94);
		ctx.stroke();
	}
}

/** Livery finish: every flame, star and stripe gets a lit edge and a shadowed one. */
function liveryFinish(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Rocker band: warm core, bright top lip and a shadowed sill.
	line(ctx, 54, 184.6, 664, 184.6, 'rgba(255,255,255,0.55)', 1.2);
	line(ctx, 54, 187, 664, 187, 'rgba(255,214,90,0.5)', 1.6);
	line(ctx, 54, 189.4, 664, 189.4, 'rgba(58,39,27,0.34)', 1.4);

	// Bonnet flames: a thin cream catchlight up the lit side of each tongue.
	ctx.strokeStyle = 'rgba(255,246,228,0.62)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.moveTo(86, 160);
	ctx.bezierCurveTo(93, 149, 95, 139, 104, 133.4);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(132, 160);
	ctx.bezierCurveTo(139, 149, 141, 141, 150, 136.4);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(178, 163);
	ctx.bezierCurveTo(185, 153, 187, 147, 196, 142.4);
	ctx.stroke();

	// A dark hairline up each flame edge keeps the tongues crisp on the bonnet.
	ctx.strokeStyle = 'rgba(120,70,10,0.32)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(84, 163);
	ctx.bezierCurveTo(92, 150, 94, 138, 104, 132);
	ctx.bezierCurveTo(104, 146, 110, 156, 116, 162);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(130, 163);
	ctx.bezierCurveTo(138, 150, 140, 140, 150, 135);
	ctx.bezierCurveTo(150, 148, 156, 157, 162, 163);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(176, 166);
	ctx.bezierCurveTo(184, 154, 186, 146, 196, 141);
	ctx.bezierCurveTo(196, 153, 202, 160, 208, 165);
	ctx.stroke();

	// Nose flame wedge: lit top edge and a deeper gold throat.
	line(ctx, 54, 152.6, 102, 164.6, 'rgba(255,243,207,0.5)', 1.2);
	line(ctx, 54, 163.6, 116, 163.6, 'rgba(120,70,10,0.28)', 1.2);

	// Cab shoulder stripe: lit top edge and shadow, only where the stripe is visible
	// to the right of the bed-side flame.
	line(ctx, 436, 160.6, 664, 160.6, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 436, 165.2, 664, 165.2, 'rgba(58,39,27,0.3)', 1.1);
	line(ctx, 348, 160.6, 366, 160.6, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 348, 165.2, 366, 165.2, 'rgba(58,39,27,0.3)', 1.1);

	// Bed-side flame: only the slice below the bed well is visible, so the lit edge
	// follows its clipped top and its right slope instead of the hidden peaks.
	line(ctx, 368, 158.7, 427, 158.7, 'rgba(255,246,228,0.45)', 1.2);
	line(ctx, 428, 159.4, 435.4, 180.4, 'rgba(255,246,228,0.38)', 1.2);
	line(ctx, 348, 180.4, 436, 180.4, 'rgba(58,39,27,0.3)', 1.2);

	// Gold accent along the nose edge.
	line(ctx, 55, 126, 55, 182, 'rgba(255,246,228,0.35)', 1.1);

	// Door star and bed-side star: a lit sliver on the top spire, shade below.
	starFinish(ctx, 288, 155, 13);
	starFinish(ctx, 455, 172, 13);
	ctx.restore();
}

/** One lit sliver and one shaded sliver on a star so the gold reads as foil. */
function starFinish(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.moveTo(cx - 1, cy - r * 0.4);
	ctx.lineTo(cx, cy - r + 1);
	ctx.lineTo(cx + 1, cy - r * 0.4);
	ctx.closePath();
	ctx.fillStyle = 'rgba(255,246,228,0.45)';
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(cx + r * 0.56, cy + r * 0.7);
	ctx.lineTo(cx + r * 0.56, cy + r * 0.84);
	ctx.lineTo(cx + r * 0.72, cy + r * 0.78);
	ctx.closePath();
	ctx.fillStyle = 'rgba(58,39,27,0.22)';
	ctx.fill();
}

/** Level-5 bed finish: ribbed floor, rail lip and a painted flank that loses light. */
function bedFinish(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D('M358,132 L650,132 L650,158 L358,158 Z'));

	// Ribbed floor: lit left edge, shadow on the right of every rib.
	for (let rx = 376; rx <= 638; rx += 42) {
		line(ctx, rx - 1, 136, rx - 1, 156, 'rgba(255,255,255,0.2)', 1.3);
		line(ctx, rx + 1.2, 136, rx + 1.2, 156, 'rgba(0,0,0,0.24)', 1.3);
	}
	const floor = ctx.createLinearGradient(0, 132, 0, 158);
	floor.addColorStop(0, 'rgba(255,255,255,0.12)');
	floor.addColorStop(0.5, 'rgba(255,255,255,0.02)');
	floor.addColorStop(1, 'rgba(0,0,0,0.16)');
	ctx.fillStyle = floor;
	ctx.fillRect(358, 132, 292, 26);
	ctx.restore();

	// Chrome rail cap along the near lip of the bed.
	line(ctx, 348, 131.2, 664, 131.2, 'rgba(255,255,255,0.62)', 1.4);
	line(ctx, 348, 133.2, 664, 133.2, 'rgba(20,12,26,0.3)', 1.2);

	// Bed flank: a bright rail shadow falls on the paint, then a soft sill shade.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.fillStyle = 'rgba(20,12,26,0.16)';
	ctx.fillRect(348, 158, 316, 5);
	ctx.fillStyle = 'rgba(255,255,255,0.1)';
	ctx.fillRect(348, 163, 316, 2);
	ctx.restore();
}

/** Chrome and lamp finish: lit lips and shadows on the bar, brace, stacks and bumpers. */
function metalFinish(ctx: CanvasRenderingContext2D): void {
	// Roll bar posts: light on the left outline, shade on the right one.
	line(ctx, 383.4, 128, 383.4, 82, 'rgba(255,255,255,0.55)', 1.6);
	line(ctx, 392.6, 128, 392.6, 82, 'rgba(20,12,26,0.3)', 1.4);
	line(ctx, 527.4, 128, 527.4, 82, 'rgba(255,255,255,0.3)', 1.4);
	line(ctx, 536.6, 128, 536.6, 82, 'rgba(20,12,26,0.32)', 1.4);

	// Tube crown, underside and the two upper bends.
	line(ctx, 402, 61.4, 518, 61.4, 'rgba(255,255,255,0.72)', 1.2);
	line(ctx, 402, 70.6, 518, 70.6, 'rgba(20,12,26,0.36)', 1.2);
	ctx.strokeStyle = 'rgba(255,255,255,0.42)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(402, 80, 18.4, Math.PI, Math.PI * 1.42);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(518, 80, 18.4, Math.PI * 1.58, Math.PI * 2);
	ctx.stroke();

	// Cross-brace: lit crown, shadowed underside and end collars.
	line(ctx, 396, 93.2, 524, 93.2, 'rgba(255,255,255,0.55)', 1.2);
	line(ctx, 396, 98.4, 524, 98.4, 'rgba(20,12,26,0.34)', 1.1);
	line(ctx, 395, 93, 395, 98.6, 'rgba(255,255,255,0.45)', 1.2);
	line(ctx, 525, 93, 525, 98.6, 'rgba(20,12,26,0.3)', 1.2);

	// Roll-bar lamps: bright rims and a shadow under each housing.
	for (let i = 0; i < 4; i++) {
		const lx = 412 + i * 30;
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.arc(lx, 66, 5.2, Math.PI * 1.06, Math.PI * 1.5);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(20,12,26,0.3)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.arc(lx, 66, 5.2, Math.PI * 0.08, Math.PI * 0.46);
		ctx.stroke();
	}
	// Amber work lamps get a lit lens edge.
	for (const ax of [388, 532]) {
		ctx.strokeStyle = 'rgba(255,243,207,0.6)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.arc(ax, 96, 4.4, Math.PI * 1.08, Math.PI * 1.5);
		ctx.stroke();
	}

	// Twin stacks: chrome lip on the left, shade on the right, soot ring at the mouth.
	for (const sx of [350, 362]) {
		line(ctx, sx + 0.9, 103, sx + 0.9, 128, 'rgba(255,255,255,0.72)', 1.3);
		line(ctx, sx + 7.1, 103, sx + 7.1, 128, 'rgba(20,12,26,0.32)', 1.3);
		line(ctx, sx + 1.6, 99.6, sx + 6.4, 99.6, 'rgba(255,255,255,0.55)', 1.1);
		line(ctx, sx + 1.4, 103.6, sx + 6.6, 103.6, 'rgba(0,0,0,0.36)', 1.1);
	}

	// Bumpers: top lip, bottom shade and vertical end lights.
	line(ctx, 41.4, 165, 41.4, 187, 'rgba(255,255,255,0.55)', 1.2);
	line(ctx, 52.6, 165, 52.6, 187, 'rgba(20,12,26,0.3)', 1.2);
	line(ctx, 41, 187.2, 53, 187.2, 'rgba(20,12,26,0.34)', 1.2);
	line(ctx, 665.4, 163, 665.4, 185, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, 680.6, 163, 680.6, 185, 'rgba(20,12,26,0.34)', 1.2);
	line(ctx, 665, 185.2, 681, 185.2, 'rgba(20,12,26,0.34)', 1.2);

	// Bumper bolts and the fuel filler ring.
	ctx.fillStyle = 'rgba(255,255,255,0.7)';
	ctx.fillRect(43.4, 167.4, 4, 1.2);
	ctx.fillRect(668, 165.4, 4, 1.2);
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(630, 168, 4.4, Math.PI * 1.08, Math.PI * 1.5);
	ctx.stroke();
}

/** Paint chips, road dust and mud flecks on the working edges. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	const chips: Array<[number, number, number, number, number]> = [
		[58, 186, 6, 2, 0.4],
		[122, 186.4, 7, 1.8, 0.32],
		[402, 186.2, 6, 2, 0.3],
		[598, 186.3, 5, 1.8, 0.3],
		[668, 183.4, 6, 2.2, 0.35]
	];

	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of chips) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	// Road dust settled along the rocker and around the far arches.
	ctx.save();
	ctx.globalAlpha = 0.12;
	ctx.fillStyle = INK;
	for (let dust = 0; dust < 9; dust++) {
		const dx = 118 + dust * 58;
		if (dx > 88 && dx < 216) continue;
		if (dx > 496 && dx < 632) continue;
		ctx.fillRect(dx, 188 + (dust % 3), 12, 1.8);
	}
	for (const [gritX, gritY, gritW] of [
		[96, 188.6, 5],
		[206, 188.8, 6],
		[498, 188.6, 5],
		[626, 188.9, 6]
	]) {
		ctx.fillRect(gritX, gritY, gritW, 1.3);
	}
	ctx.restore();

	// Mud flecks kicked up behind each big tyre.
	ctx.save();
	ctx.fillStyle = '#5B4632';
	for (const [mudX, mudY, mudR, alpha] of [
		[212, 268, 2, 0.32],
		[220, 258, 1.5, 0.28],
		[230, 276, 2.4, 0.26],
		[620, 270, 2, 0.3],
		[630, 260, 1.6, 0.26],
		[638, 278, 2.2, 0.24]
	]) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(mudX, mudY, mudR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// A hairline scuff on the bed flank and a boot scuff on the door.
	ctx.save();
	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(470, 177.5);
	ctx.quadraticCurveTo(492, 175.6, 512, 176.4);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(58,39,27,0.2)';
	ctx.beginPath();
	ctx.moveTo(268, 174.5);
	ctx.quadraticCurveTo(280, 173.4, 290, 174.2);
	ctx.stroke();
	ctx.restore();
}

/** Chunky beadlock ring and alternating tread blocks on a near tyre. */
function dressWheel(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.strokeStyle = '#1E2030';
	ctx.lineWidth = 5;
	for (let i = 0; i < 12; i++) {
		const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * r * 0.88, cy + Math.sin(a) * r * 0.88);
		ctx.lineTo(cx + Math.cos(a) * r * 0.97, cy + Math.sin(a) * r * 0.97);
		ctx.stroke();
	}

	ctx.strokeStyle = YELLOW;
	ctx.lineWidth = 3.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(58,39,27,0.5)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 8; i++) {
		const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
		circle(ctx, cx + Math.cos(a) * r * 0.66, cy + Math.sin(a) * r * 0.66, 2.2, CHROME, 1);
	}
}

/** A four-point sparkle with a warm core. */
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

export function drawRealMonsterTruckLevel(
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
		ctx.ellipse(361, 294, 302, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Far-side axle, baked behind the near tyres.
	drawFarWheel(ctx, FAR_L.x, FAR_L.y, FAR_L.r, shaded);
	drawFarWheel(ctx, FAR_R.x, FAR_R.y, FAR_R.r, shaded);

	// Lifted ladder frame, shock towers and coil springs.
	rect(ctx, 246, 190, 254, 14, STEEL, 3, 2.6);
	line(ctx, 252, 201, 494, 201, 'rgba(20,12,26,0.28)', 1.5);
	rect(ctx, 244, 204, 12, 32, PURPLE_DARK, 2, 2.4);
	rect(ctx, 486, 204, 12, 32, PURPLE_DARK, 2, 2.4);
	drawSpring(ctx, 250, 206, 232);
	drawSpring(ctx, 492, 206, 232);

	// Shell.
	const shellPath = new Path2D(SHELL);
	shape(ctx, SHELL, PURPLE, 3);

	// Livery: yellow rocker, bonnet flames, bed flames and stars, clipped to the shell.
	ctx.save();
	ctx.clip(shellPath);

	ctx.fillStyle = YELLOW;
	ctx.fillRect(54, 184, 610, 6);
	ctx.beginPath();
	ctx.moveTo(54, 152);
	ctx.bezierCurveTo(76, 150, 86, 162, 102, 164);
	ctx.bezierCurveTo(116, 166, 124, 156, 138, 156);
	ctx.bezierCurveTo(154, 156, 158, 168, 174, 169);
	ctx.bezierCurveTo(190, 170, 196, 158, 212, 158);
	ctx.lineTo(230, 164);
	ctx.lineTo(230, 190);
	ctx.lineTo(54, 190);
	ctx.closePath();
	ctx.fill();

	// Flame tongues, pointing back over the bonnet.
	ctx.beginPath();
	ctx.moveTo(84, 163);
	ctx.bezierCurveTo(92, 150, 94, 138, 104, 132);
	ctx.bezierCurveTo(104, 146, 110, 156, 116, 162);
	ctx.closePath();
	ctx.moveTo(130, 163);
	ctx.bezierCurveTo(138, 150, 140, 140, 150, 135);
	ctx.bezierCurveTo(150, 148, 156, 157, 162, 163);
	ctx.closePath();
	ctx.moveTo(176, 166);
	ctx.bezierCurveTo(184, 154, 186, 146, 196, 141);
	ctx.bezierCurveTo(196, 153, 202, 160, 208, 165);
	ctx.closePath();
	ctx.fillStyle = GOLD;
	ctx.fill();

	// Cab shoulder stripe and the bed-side flame.
	ctx.fillStyle = YELLOW;
	ctx.fillRect(348, 160, 316, 5);
	ctx.beginPath();
	ctx.moveTo(348, 182);
	ctx.lineTo(372, 152);
	ctx.lineTo(384, 164);
	ctx.lineTo(396, 146);
	ctx.lineTo(410, 164);
	ctx.lineTo(422, 152);
	ctx.lineTo(436, 182);
	ctx.closePath();
	ctx.fill();

	// Open bed: a dark well with a ribbed floor and a chrome rail cap.
	rect(ctx, 358, 132, 292, 26, SOOT, 3, 2.2);
	ctx.fillStyle = 'rgba(255,255,255,0.08)';
	ctx.fillRect(366, 136, 276, 5);
	ctx.fillStyle = 'rgba(0,0,0,0.28)';
	ctx.fillRect(366, 152, 276, 4);
	for (let rx = 376; rx <= 638; rx += 42) {
		line(ctx, rx, 137, rx, 156, '#242035', 1.6);
	}

	// Bed-side star, clear of the rear wheel arch.
	star(ctx, 455, 172, 13, GOLD, 1.6);

	ctx.fillStyle = GOLD;
	ctx.fillRect(54, 124, 4, 60);
	ctx.restore();

	// Outline stays crisp over the livery.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(shellPath);

	// Glazing: windscreen, door drop glass and the slim rear quarter light.
	shape(ctx, WINDSCREEN, GLASS, 2.4);
	shape(ctx, DOOR_GLASS, GLASS, 2.4);
	shape(ctx, QUARTER_GLASS, GLASS, 2.4);
	line(ctx, 256, 84, 256, 120, INK, 2.4);
	line(ctx, 322, 82, 322, 118, INK, 2.4);

	// Door: clean panel with a star and a chrome handle.
	rect(ctx, 258, 128, 64, 56, PURPLE, 3, 2.5);
	line(ctx, 258, 132, 322, 132, 'rgba(255,255,255,0.22)', 1.6);
	star(ctx, 288, 155, 13, YELLOW, 1.6);
	rect(ctx, 304, 136, 12, 4, CHROME, 2, 1.4);

	if (shaded) {
		// Cab and bed paint: roof light falling into a low-body shade.
		ctx.save();
		ctx.clip(shellPath);
		const paint = ctx.createLinearGradient(0, 72, 0, 190);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(20,12,26,0.26)');
		ctx.fillStyle = paint;
		ctx.fillRect(50, 68, 620, 126);

		const roof = ctx.createLinearGradient(0, 72, 0, 86);
		roof.addColorStop(0, 'rgba(255,255,255,0.34)');
		roof.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = roof;
		ctx.fillRect(234, 72, 104, 14);

		ctx.fillStyle = 'rgba(20,12,26,0.2)';
		ctx.fillRect(54, 166, 610, 24);
		ctx.restore();

		// Door skin picks up the same top light.
		ctx.save();
		ctx.beginPath();
		ctx.rect(258, 128, 64, 56);
		ctx.clip();
		const doorTone = ctx.createLinearGradient(0, 128, 0, 184);
		doorTone.addColorStop(0, 'rgba(255,255,255,0.2)');
		doorTone.addColorStop(0.65, 'rgba(255,255,255,0.02)');
		doorTone.addColorStop(1, 'rgba(20,12,26,0.24)');
		ctx.fillStyle = doorTone;
		ctx.fillRect(258, 128, 64, 56);
		ctx.restore();

		shadeGlass(ctx, WINDSCREEN, 212, 84, 44, 36);
		shadeGlass(ctx, DOOR_GLASS, 266, 80, 56, 40);
		shadeGlass(ctx, QUARTER_GLASS, 328, 85, 10, 34);

		// Chassis and shock bevels.
		ctx.fillStyle = 'rgba(20,12,26,0.24)';
		ctx.fillRect(246, 200, 254, 4);
		ctx.fillStyle = 'rgba(255,255,255,0.16)';
		ctx.fillRect(246, 190, 254, 2);
		line(ctx, 250, 208, 250, 232, 'rgba(255,255,255,0.24)', 1.6);
		line(ctx, 492, 208, 492, 232, 'rgba(255,255,255,0.24)', 1.6);
	}

	// Roll bar tube and cross-brace.
	shape(ctx, ROLLBAR, STEEL, 3);
	ctx.fillStyle = 'rgba(255,255,255,0.2)';
	ctx.fillRect(402, 62, 116, 2.6);
	ctx.fillStyle = 'rgba(20,12,26,0.22)';
	ctx.fillRect(402, 69, 116, 2.2);
	rect(ctx, 394, 92, 132, 7, STEEL, 0, 2.4);
	line(ctx, 398, 93.4, 522, 93.4, 'rgba(255,255,255,0.24)', 1.4);

	// Twin chrome exhaust stacks rising behind the cab.
	for (const sx of [350, 362]) {
		rect(ctx, sx, 98, 8, 32, CHROME, 3, 2.2);
		ctx.fillStyle = SOOT;
		ctx.fillRect(sx + 1.4, 100, 5.2, 4);
		ctx.fillStyle = 'rgba(255,255,255,0.45)';
		ctx.fillRect(sx + 1.8, 108, 1.4, 18);
		ctx.fillStyle = 'rgba(20,12,26,0.24)';
		ctx.fillRect(sx + 5.4, 108, 1.4, 18);
	}

	// Bumpers read at every level; lamps arrive with the fittings.
	shape(ctx, FRONT_BUMPER, STEEL, 2.6);
	shape(ctx, REAR_BUMPER, STEEL, 2.6);
	ctx.fillStyle = 'rgba(255,255,255,0.2)';
	ctx.fillRect(42, 165, 10, 2);
	ctx.fillRect(666, 163, 14, 2);
	ctx.fillStyle = 'rgba(20,12,26,0.26)';
	ctx.fillRect(42, 185, 10, 2);
	ctx.fillRect(666, 183, 14, 2);

	if (fitted) {
		// Fender flares tucked inside the arches.
		for (const arch of [ARCH_FRONT, ARCH_REAR]) {
			ctx.strokeStyle = YELLOW;
			ctx.lineWidth = 5;
			ctx.stroke(new Path2D(arch));
			ctx.strokeStyle = INK;
			ctx.lineWidth = 2;
			ctx.stroke(new Path2D(arch));
		}

		// Nose hardware: headlamp, grille slats and indicator.
		circle(ctx, 64, 158, 7, LAMP, 2.2);
		circle(ctx, 64, 158, 3.4, '#FFFDE8', 1);
		for (let gy = 164; gy <= 178; gy += 6) line(ctx, 57, gy, 63, gy, CHROME, 1.4);
		circle(ctx, 64, 173, 3.2, AMBER, 1.4);

		// Roll bar lamp bar and work lamps.
		for (let i = 0; i < 4; i++) {
			circle(ctx, 412 + i * 30, 66, 5.2, LAMP, 1.8);
			circle(ctx, 412 + i * 30, 66, 2.2, '#FFFDE8', 0.8);
		}
		circle(ctx, 388, 96, 4.4, AMBER, 1.6);
		circle(ctx, 532, 96, 4.4, AMBER, 1.6);
		// Bumper lamps, plate and tow hook.
		circle(ctx, 47, 170, 3, AMBER, 1.2);
		circle(ctx, 47, 180, 3, LAMP, 1.2);
		circle(ctx, 673, 168, 4.2, TAIL, 1.6);
		circle(ctx, 673, 178, 3.2, AMBER, 1.2);
		rect(ctx, 668, 182, 9, 4, CREAM, 1, 1);
		line(ctx, 42, 183, 47, 187, CHROME, 2.4);
		line(ctx, 674, 181, 680, 185, CHROME, 2.4);

		// Fuel filler on the bed side.
		circle(ctx, 630, 168, 4.4, CHROME, 1.8);
		circle(ctx, 630, 168, 1.6, STEEL, 0.8);

		// Door handle shadow and a side crease.
		line(ctx, 304, 141, 316, 141, 'rgba(20,12,26,0.35)', 1.2);
		line(ctx, 60, 180, 322, 180, 'rgba(20,12,26,0.16)', 1.6);
	}

	// Both near tyres share the one wheel part; the rear slot is mirrored.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r, finish);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r, finish);

	if (fitted) {
		dressWheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		dressWheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	if (lit) {
		// Rim light on the roof, roll bar and bonnet crease.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(254, 74);
		ctx.lineTo(324, 74);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(402, 62);
		ctx.lineTo(518, 62);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(66, 140);
		ctx.bezierCurveTo(110, 134, 160, 128, 196, 110);
		ctx.stroke();

		// Headlight glow on the nose.
		const glow = ctx.createRadialGradient(64, 158, 1, 64, 158, 26);
		glow.addColorStop(0, 'rgba(255,240,150,0.62)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(64, 158, 26, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the huge tyres.
		ctx.save();
		ctx.globalAlpha = 0.22;
		ctx.fillStyle = INK;
		for (const wheelAt of [WHEEL_L, WHEEL_R]) {
			ctx.beginPath();
			ctx.ellipse(wheelAt.x, 290, 30, 4.8, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		liveryFinish(ctx);
		bedFinish(ctx);
		metalFinish(ctx);

		// Huge-wheel finish: sidewall sheen then the beadlock hub.
		for (const wheelAt of [WHEEL_L, WHEEL_R]) {
			dressTyreFinish(ctx, wheelAt.x, wheelAt.y, wheelAt.r);
			drawHubDetail(ctx, wheelAt.x, wheelAt.y, wheelAt.r);
		}

		// Paint, glass, chrome, livery and lamp glints, all clear of the tyre tread.
		glint(ctx, 300, 76, 5.2);
		glint(ctx, 462, 62, 4.2);
		glint(ctx, 64, 156, 3.4);
		glint(ctx, 146, 136, 3.4);
		glint(ctx, 354, 100, 2.8);
		glint(ctx, 630, 168, 2.6);
		glint(ctx, 673, 168, 2.4);
		glint(ctx, 47, 170, 2.2);
		glint(ctx, 246, 192, 2.6);
		glint(ctx, 104, 134, 2.2);
		glint(ctx, 196, 144, 2);
		glint(ctx, 414, 162, 2.2);
		glint(ctx, 574, 187, 2.2);
		glint(ctx, 388, 84, 2);
		glint(ctx, 502, 66, 1.8);
		glint(ctx, 352, 104, 1.8);
		glint(ctx, 364, 112, 1.6);
		glint(ctx, 600, 131, 1.8);

		// Exhaust puff drifting off the cab stacks, soft-edged so it reads as smoke.
		ctx.save();
		for (const [px, py, pr, alpha] of [
			[357, 95, 6, 0.28],
			[366, 85, 8, 0.24],
			[377, 74, 10.5, 0.2],
			[390, 63, 12.5, 0.15]
		]) {
			const wisp = ctx.createRadialGradient(px, py, 0.5, px, py, pr);
			wisp.addColorStop(0, `rgba(120,116,110,${alpha})`);
			wisp.addColorStop(0.62, `rgba(120,116,110,${alpha * 0.55})`);
			wisp.addColorStop(1, 'rgba(120,116,110,0)');
			ctx.fillStyle = wisp;
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealMonsterTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealMonsterTruckLevel(ctx, x, y, scale, 5);
}
