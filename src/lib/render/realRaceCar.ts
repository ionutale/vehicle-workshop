/**
 * Race car art, cut into the same five-piece kit as the other realistic vehicles.
 * A low rear-engined sports racer facing left: wedge nose, bubble canopy, side intake,
 * number roundel on the door, twin racing stripes, wide flared wheels and a tall rear wing.
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
	rectMask,
	shape,
	wheel
} from './realKit';

const RED = '#E63946';
const RED_DARK = '#B3273A';
const RED_SHADE = '#8E1B2B';
const WHITE = '#FFFFFF';
const CREAM = '#FFF8EE';
const CARBON = '#2B2D42';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const TAIL = '#FF6B81';

/** Shell: low wedge nose on the left, canopy hump, flat engine deck and a squared tail. */
const SHELL =
	'M22,248 L22,226 Q22,218 32,216 L96,204 L168,194 L214,190 L260,152 Q263,149 268,149 L334,149 Q340,149 344,154 L390,190 L486,196 L540,202 L618,202 Q640,203 645,218 L648,240 Q649,248 640,248 Z';

/** Rear wing: plane, two endplates and the struts that land on the deck. */
const WING_PLANE = 'M556,126 L654,126 L654,140 L556,140 Z';
const WING_END_L = 'M548,116 L556,116 L556,148 L548,148 Z';
const WING_END_R = 'M654,116 L662,116 L662,148 L654,148 Z';
const WING_STRUT_L = 'M570,140 L577,140 L577,202 L570,202 Z';
const WING_STRUT_R = 'M604,140 L611,140 L611,202 L604,202 Z';

/** Front splitter and rear diffuser: both butt to the flat underside. */
const SPLITTER = 'M14,248 L102,248 L102,256 L22,256 Q14,256 14,248 Z';
const DIFFUSER = 'M584,248 L640,248 L640,256 L584,256 Z';

/** Side intake behind the door, clear of both wheel arches. */
const INTAKE = 'M386,203 L452,199 L458,208 L458,224 Q458,229 452,229 L392,229 Q386,229 386,223 Z';

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

/** Raked windscreen band and the canopy side pane, with the B-pillar between them. */
const WINDSCREEN = 'M220,189 L254,157 L274,157 L240,189 Z';
const SIDE_GLASS = pane(280, 157, 54, 32, 5);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Cockpit door: a clean rectangle clear of both panes. */
const DOOR = { x: 302, y: 198, w: 62, h: 44 };
const DOOR_MASK = rectMask(DOOR.x, DOOR.y, DOOR.w, DOOR.h);

/** Both wheels are the same piece; the body never masks them. */
const WHEEL_L = { x: 140, y: 244, r: 30 };
const WHEEL_R = { x: 520, y: 244, r: 30 };
const WHEEL_MASK = circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);

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

/** Wide arch flare sitting just outside the tyre. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 12, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r + 4, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = RED_DARK;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.45)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 9.4, Math.PI * 1.14, Math.PI * 1.86);
	ctx.stroke();
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

/**
 * Picture-book hub: sidewall gloss, bright rim ring, six bolt heads with specular pips, the
 * dish shadow, a polished centre cap and the valve stem. Every mark is mirror-symmetric about
 * the hub centre, so the flipped rear wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Sidewall catches the roof light on both shoulders, clear of the tread notches.
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

	// Rim lip and the polished ring just inside it.
	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.6;
	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.94]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.62, from, to);
		ctx.stroke();
	}

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.5, CHROME, 1.2);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx - 0.8, by - 0.9, 0.9, 0, Math.PI * 2);
		ctx.fill();
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
	line(ctx, x - 2, y + 0.4, x + 2, y + 0.4, 'rgba(58,39,27,0.3)', 1);

	// Valve stem at the top of the rim.
	circle(ctx, x, y - r * 0.6, 1.7, CHROME, 1);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x - 0.6, y - r * 0.62, 0.8, 0, Math.PI * 2);
	ctx.fill();
	line(ctx, x, y - r * 0.56, x, y - r * 0.66, CHROME, 2);
}

/** Everything that must stay clean of paint grain and sheen: glazing and both tyres. */
const KEEP_OUT = `${GLASS_MASK} ${WHEEL_MASK} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;

/** Paint grain over solid paint only: the glazing and tyres are punched out. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${KEEP_OUT}`), 'evenodd');

	const wash = ctx.createLinearGradient(22, 149, 648, 256);
	wash.addColorStop(0, 'rgba(255,248,238,0.12)');
	wash.addColorStop(0.5, 'rgba(255,255,255,0)');
	wash.addColorStop(1, 'rgba(58,39,27,0.1)');
	ctx.fillStyle = wash;
	ctx.fillRect(14, 145, 650, 114);

	// Warmer second wash that follows the canopy crown, so the coat reads wet up top.
	const crown = ctx.createLinearGradient(200, 149, 400, 202);
	crown.addColorStop(0, 'rgba(255,252,244,0.18)');
	crown.addColorStop(0.6, 'rgba(255,250,238,0.05)');
	crown.addColorStop(1, 'rgba(255,248,238,0)');
	ctx.fillStyle = crown;
	ctx.fillRect(178, 149, 250, 40);

	let seed = 89;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 430; i++) {
		const px = 20 + rand() * 628;
		const py = 150 + rand() * 100;
		const size = 1.3 + rand() * 1.2;
		ctx.globalAlpha = 0.08 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 155; i++) {
		const px = 20 + rand() * 628;
		const py = 150 + rand() * 100;
		const size = 1.1 + rand() * 0.95;
		ctx.globalAlpha = 0.16 + rand() * 0.12;
		ctx.fillRect(px, py, size, size);
	}

	// Fine tooth: near-pixel flecks that only read as tooth at game scale.
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 80; i++) {
		const px = 20 + rand() * 628;
		const py = 150 + rand() * 100;
		ctx.globalAlpha = 0.1 + rand() * 0.1;
		ctx.fillRect(px, py, 0.9, 0.9);
	}

	// Curved grain scratches, following the panel rake.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.3;
	for (const [sx, sy, ex, ey] of [
		[40, 230, 118, 214],
		[150, 202, 214, 194],
		[236, 186, 296, 182],
		[372, 210, 452, 208],
		[500, 204, 560, 202],
		[572, 228, 622, 227]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}

	// Dry-brush flicks where the coat is thinnest.
	ctx.globalAlpha = 0.16;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.1;
	for (const [sx, sy, ex, ey] of [
		[48, 232, 104, 230],
		[176, 206, 230, 200],
		[412, 214, 448, 212],
		[540, 196, 604, 195],
		[300, 238, 356, 237],
		[232, 230, 272, 229],
		[466, 236, 502, 235]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Paint sheen: canopy crown, white nose gloss, flank streak and rear-deck bounce. */
function panelSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${KEEP_OUT}`), 'evenodd');

	// Canopy crown, along the white roof edge.
	const crown = ctx.createLinearGradient(0, 149, 0, 180);
	crown.addColorStop(0, 'rgba(255,255,255,0.42)');
	crown.addColorStop(0.5, 'rgba(255,255,255,0.1)');
	crown.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = crown;
	ctx.fillRect(166, 149, 236, 31);

	// White nose cap: a raked panel gloss.
	const nose = ctx.createLinearGradient(28, 248, 120, 200);
	nose.addColorStop(0, 'rgba(255,255,255,0)');
	nose.addColorStop(0.44, 'rgba(255,255,255,0.4)');
	nose.addColorStop(0.72, 'rgba(255,255,255,0.08)');
	nose.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = nose;
	ctx.fillRect(22, 200, 100, 48);

	// Long wet streak carried by the twin stripes.
	const flank = ctx.createLinearGradient(122, 222, 540, 202);
	flank.addColorStop(0, 'rgba(255,248,238,0)');
	flank.addColorStop(0.34, 'rgba(255,248,238,0.2)');
	flank.addColorStop(0.66, 'rgba(255,248,238,0.05)');
	flank.addColorStop(1, 'rgba(255,248,238,0)');
	ctx.fillStyle = flank;
	ctx.fillRect(118, 196, 426, 46);

	// Rear haunch and engine-deck bounce.
	const deck = ctx.createLinearGradient(392, 190, 622, 228);
	deck.addColorStop(0, 'rgba(255,240,214,0)');
	deck.addColorStop(0.42, 'rgba(255,240,214,0.22)');
	deck.addColorStop(1, 'rgba(255,240,214,0)');
	ctx.fillStyle = deck;
	ctx.fillRect(388, 188, 236, 44);

	// Lit top edges where the paint rolls under, so the panels lift.
	ctx.globalAlpha = 0.32;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 2.6;
	for (const [sx, sy, ex, ey] of [
		[126, 209.6, 372, 207.6],
		[548, 209.4, 614, 208.2],
		[40, 224, 118, 213]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 1.4, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Wing and splitter gloss: plane sheen, endplate trim, strut lights and fin edges. */
function aeroSheen(ctx: CanvasRenderingContext2D): void {
	// Wing plane gloss.
	ctx.save();
	ctx.clip(new Path2D(WING_PLANE));
	const plane = ctx.createLinearGradient(556, 126, 654, 140);
	plane.addColorStop(0, 'rgba(255,255,255,0)');
	plane.addColorStop(0.34, 'rgba(255,255,255,0.32)');
	plane.addColorStop(0.62, 'rgba(255,255,255,0.06)');
	plane.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = plane;
	ctx.fillRect(556, 126, 98, 14);
	ctx.restore();

	line(ctx, 558, 127.2, 653, 127.2, 'rgba(255,255,255,0.62)', 1.5);
	line(ctx, 557, 138.4, 653, 138.4, 'rgba(58,39,27,0.26)', 1.3);

	// Endplates: lit stiles, top bevels and one fastener pip each.
	line(ctx, 549.4, 118, 549.4, 146, 'rgba(255,255,255,0.52)', 1.3);
	line(ctx, 655.4, 118, 655.4, 146, 'rgba(255,255,255,0.38)', 1.2);
	line(ctx, 549, 117.4, 661, 117.4, 'rgba(255,255,255,0.6)', 1.4);
	line(ctx, 550, 146.6, 660, 146.6, 'rgba(58,39,27,0.24)', 1.3);
	for (const endX of [552, 658]) {
		circle(ctx, endX, 132, 1.5, CHROME, 1);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(endX - 0.6, 131.3, 0.7, 0, Math.PI * 2);
		ctx.fill();
	}
	line(ctx, 653, 127, 653, 139, 'rgba(255,255,255,0.5)', 1.2);

	// Struts keep an edge light on their front face.
	line(ctx, 571.2, 142, 571.2, 200, 'rgba(255,255,255,0.42)', 1.3);
	line(ctx, 605.2, 142, 605.2, 200, 'rgba(255,255,255,0.32)', 1.2);

	// Splitter: leading edge light, top-face gloss and canard pip.
	ctx.save();
	ctx.clip(new Path2D(SPLITTER));
	const splitter = ctx.createLinearGradient(14, 248, 102, 256);
	splitter.addColorStop(0, 'rgba(255,255,255,0.3)');
	splitter.addColorStop(0.7, 'rgba(255,255,255,0.06)');
	splitter.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = splitter;
	ctx.fillRect(14, 248, 88, 8);
	ctx.restore();
	line(ctx, 18, 249.4, 100, 249.4, 'rgba(255,255,255,0.55)', 1.5);
	line(ctx, 24, 254.6, 96, 254.6, 'rgba(58,39,27,0.3)', 1.2);
	line(ctx, 20, 243.2, 42, 238.6, 'rgba(255,255,255,0.5)', 1.2);

	// Diffuser fins catch the same light.
	line(ctx, 585, 249.4, 638, 249.4, 'rgba(255,255,255,0.32)', 1.1);
	for (const finX of [596, 612, 628]) {
		line(ctx, finX + 0.9, 250.6, finX + 0.9, 255.4, 'rgba(255,255,255,0.48)', 1);
	}
}

/** Number roundel: lift shadow, disc gloss, ring highlight and a sparkle on the rim. */
function roundelSheen(ctx: CanvasRenderingContext2D): void {
	// Soft shadow under the disc so it stands off the door.
	ctx.save();
	ctx.globalAlpha = 0.15;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.arc(333, 221.8, 20.2, Math.PI * 0.14, Math.PI * 0.86);
	ctx.closePath();
	ctx.fill();
	ctx.restore();

	ctx.save();
	ctx.beginPath();
	ctx.arc(333, 220, 20, 0, Math.PI * 2);
	ctx.clip();
	const gloss = ctx.createLinearGradient(314, 238, 352, 200);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.34, 'rgba(255,255,255,0.32)');
	gloss.addColorStop(0.56, 'rgba(255,255,255,0.06)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(313, 200, 40, 40);

	// A little red bounce off the paint along the lower rim.
	const bounce = ctx.createLinearGradient(0, 214, 0, 240);
	bounce.addColorStop(0, 'rgba(255,214,214,0)');
	bounce.addColorStop(1, 'rgba(255,206,206,0.24)');
	ctx.fillStyle = bounce;
	ctx.fillRect(313, 214, 40, 26);
	ctx.restore();

	// Lit ring and disc edge.
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(333, 220, 15.5, Math.PI * 1.06, Math.PI * 1.5);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(333, 220, 19.2, Math.PI * 1.05, Math.PI * 1.42);
	ctx.stroke();
	glint(ctx, 346, 207.5, 2.4);
}

/** Finishing marks: lamp sparkles, chrome lips, arch hardware, stone chips and the puff. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	// Headlamp and indicator sparkle on the nose.
	ctx.fillStyle = '#FFFDF2';
	ctx.beginPath();
	ctx.arc(37.6, 226.8, 1.6, 0, Math.PI * 2);
	ctx.fill();
	line(ctx, 28, 242, 39, 242, 'rgba(255,255,255,0.6)', 1.1);

	// Tail lamps, the exhaust lip and its chrome tip.
	line(ctx, 629.4, 213, 640.6, 213, 'rgba(255,255,255,0.62)', 1.2);
	line(ctx, 629.4, 223, 640.6, 223, 'rgba(255,255,255,0.5)', 1.1);
	line(ctx, 637, 233, 643.4, 233, 'rgba(255,255,255,0.45)', 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(643.2, 236.6, 0.9, 0, Math.PI * 2);
	ctx.fill();

	// Splitter fasteners and a stone nip on the leading edge.
	for (const boltX of [38, 88]) {
		circle(ctx, boltX, 250.4, 1.2, CHROME, 0.9);
	}
	line(ctx, 62, 248.6, 78, 248.6, 'rgba(255,255,255,0.4)', 1);

	// Mudguard hardware and the lit arch crowns.
	for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
		circle(ctx, wheelX, WHEEL_L.y - WHEEL_L.r - 9.6, 1.6, CHROME, 1);
		circle(ctx, wheelX - WHEEL_L.r - 9.2, WHEEL_L.y - 8, 1.3, CHROME, 0.9);
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 8.6, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
	}

	// Stone chips where the paint meets the road.
	ctx.save();
	ctx.globalAlpha = 0.42;
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, chipR] of [
		[36, 252.4, 1.1],
		[58, 254, 1],
		[84, 252.6, 1.1],
		[218, 246, 1.2],
		[320, 246, 1.1],
		[452, 247, 1.2],
		[578, 245.6, 1]
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
		[398, 242, 1.5],
		[470, 241, 1.3],
		[612, 239, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(dustX, dustY, dustR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Exhaust puff at the tail.
	ctx.save();
	for (const [puffX, puffY, puffR, puffAlpha] of [
		[652, 236, 4.4, 0.5],
		[661, 231, 3.4, 0.4],
		[668, 226, 2.4, 0.3],
		[674, 221, 1.8, 0.22]
	]) {
		ctx.globalAlpha = puffAlpha;
		ctx.fillStyle = WHITE;
		ctx.beginPath();
		ctx.arc(puffX, puffY, puffR, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export function drawRealRaceCarLevel(
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
		ctx.ellipse(338, 276, 330, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// The rear wing is the cue that names the vehicle, so it reads at level 1.
	shape(ctx, WING_STRUT_L, CARBON, 2.2);
	shape(ctx, WING_STRUT_R, CARBON, 2.2);
	shape(ctx, WING_PLANE, RED, 2.6);
	shape(ctx, WING_END_L, WHITE, 2.4);
	shape(ctx, WING_END_R, WHITE, 2.4);
	if (shaded) {
		ctx.fillStyle = 'rgba(58,39,27,0.2)';
		ctx.fillRect(557, 135, 96, 4.6);
		line(ctx, 558, 127.4, 652, 127.4, 'rgba(255,255,255,0.45)', 1.4);
	}

	// Splitter and diffuser are part of the body cut-out, so they fill at every level.
	shape(ctx, SPLITTER, RED_DARK, 2.4);
	shape(ctx, DIFFUSER, CARBON, 2.4);

	// Shell.
	shape(ctx, SHELL, RED);

	// Livery, clipped to the shell.
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// White nose cap, cut on a raked panel line.
	ctx.fillStyle = WHITE;
	ctx.beginPath();
	ctx.moveTo(22, 248);
	ctx.lineTo(22, 226);
	ctx.quadraticCurveTo(22, 218, 32, 216);
	ctx.lineTo(96, 204);
	ctx.lineTo(122, 201);
	ctx.lineTo(122, 248);
	ctx.closePath();
	ctx.fill();
	line(ctx, 122, 201, 122, 248, RED_DARK, 2);

	// Twin racing stripes down the flank, and the white canopy roof edge.
	ctx.fillStyle = WHITE;
	ctx.fillRect(122, 203, 430, 9);
	ctx.fillRect(122, 218, 430, 4);
	line(ctx, 122, 215.6, 552, 215.6, RED_DARK, 1.6);
	ctx.fillStyle = WHITE;
	ctx.fillRect(238, 149, 122, 7);

	// Lower rocker and the white rear-deck lip.
	ctx.fillStyle = RED_SHADE;
	ctx.fillRect(22, 240, 626, 10);
	line(ctx, 24, 240.8, 644, 240.8, 'rgba(255,255,255,0.26)', 1.4);
	ctx.fillStyle = WHITE;
	ctx.fillRect(536, 202, 112, 6);
	ctx.fillStyle = RED_DARK;
	ctx.fillRect(536, 208, 112, 2);

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 149, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.42)');
		paint.addColorStop(0.24, 'rgba(255,255,255,0.08)');
		paint.addColorStop(0.68, 'rgba(58,39,27,0.02)');
		paint.addColorStop(1, 'rgba(58,39,27,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(14, 145, 650, 114);

		// Panel joints on the flanks.
		for (const seamX of [214, 552]) {
			line(ctx, seamX, 190, seamX, 240, 'rgba(58,39,27,0.22)', 1.6);
			line(ctx, seamX + 1.6, 190, seamX + 1.6, 240, 'rgba(255,255,255,0.3)', 1.2);
		}

		// Rear haunch shoulder over the engine cover.
		ctx.strokeStyle = 'rgba(58,39,27,0.18)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(392, 193);
		ctx.quadraticCurveTo(462, 196, 510, 207);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(392, 194.4);
		ctx.quadraticCurveTo(462, 197.4, 508, 208.4);
		ctx.stroke();
	}

	ctx.restore();

	// Re-stroke the silhouette over the opaque livery fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Canopy glazing.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 220, 157, 54, 32);
		glassShade(ctx, SIDE_GLASS, 280, 157, 54, 32);
	}

	// Cockpit door seam, hinges and handle.
	shape(ctx, DOOR_MASK, 'rgba(0,0,0,0)', 2.5);
	if (fitted) {
		rect(ctx, 356, 208, 5, 15, CHROME, 1.5, 1.8);
		line(ctx, 359, 211, 359, 220, 'rgba(58,39,27,0.32)', 1.3);
		for (const hy of [203, 231]) {
			rect(ctx, 302, hy, 5, 7, STEEL, 1.2, 1.4);
		}
	}

	// Racing number roundel on the door.
	circle(ctx, 333, 220, 20, WHITE, 2.6);
	ctx.strokeStyle = RED;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(333, 220, 15.5, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fillStyle = RED;
	ctx.font = '700 21px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText('7', 333, 221);
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';

	// Side intake.
	shape(ctx, INTAKE, CARBON, 2.4);
	if (shaded) {
		for (let mesh = 0; mesh < 3; mesh++) {
			line(ctx, 396 + mesh * 18, 227, 406 + mesh * 18, 203, 'rgba(255,255,255,0.16)', 1.4);
		}
	}
	line(ctx, 390, 204, 452, 200.4, 'rgba(255,255,255,0.4)', 1.3);

	// Engine-cover louvres on the rear flank.
	rect(ctx, 566, 208, 61, 26, CARBON, 3, 2.4);
	for (let louvre = 0; louvre < 4; louvre++) {
		line(ctx, 572, 215 + louvre * 5, 621, 213 + louvre * 5, 'rgba(255,255,255,0.22)', 1.6);
	}

	if (fitted) {
		// Wing hardware: gurney lip, endplate trim and strut bolts.
		line(ctx, 652, 121, 652, 140, CARBON, 3.2);
		line(ctx, 550.5, 120, 550.5, 144, RED, 2);
		line(ctx, 659.5, 120, 659.5, 144, RED, 2);
		for (const [boltX, boltY] of [
			[573.5, 172],
			[607.5, 172],
			[573.5, 196],
			[607.5, 196]
		]) {
			circle(ctx, boltX, boltY, 2, CHROME, 1.1);
		}

		// Headlight cluster on the nose and the indicator under it.
		circle(ctx, 40, 230, 8.5, WHITE, 2.4);
		circle(ctx, 40, 230, 5.6, LAMP, 1.6);
		rect(ctx, 27, 241, 13, 5, AMBER, 1.5, 1.5);

		// Nose grille slot on the front face.
		rect(ctx, 23, 234, 7, 10, CARBON, 1, 1.6);

		// Tail lamps and exhaust on the squared tail.
		rect(ctx, 628, 212, 14, 7, TAIL, 1.5, 1.7);
		rect(ctx, 628, 222, 14, 5, AMBER, 1.5, 1.5);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		for (const [pipX, pipY] of [
			[631, 214.5],
			[631, 224]
		]) {
			ctx.beginPath();
			ctx.arc(pipX, pipY, 1, 0, Math.PI * 2);
			ctx.fill();
		}
		rect(ctx, 636, 232, 10, 6, STEEL, 2, 1.8);
		circle(ctx, 644, 235, 2.4, CARBON, 1.2);

		// Splitter canards and diffuser fins.
		shape(ctx, 'M18,244 L44,238 L44,245 L18,248 Z', CARBON, 1.8);
		for (const finX of [596, 612, 628]) {
			line(ctx, finX, 250, finX, 256, CHROME, 1.6);
		}

		// Wide arch flares.
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: nose edge, hood and canopy crown.
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(33, 216);
		ctx.quadraticCurveTo(23, 220, 23, 230);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(98, 204.6);
		ctx.lineTo(214, 190.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(262, 152.6);
		ctx.lineTo(334, 150.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(346, 156);
		ctx.lineTo(388, 189.4);
		ctx.stroke();

		// Headlight glow.
		const glow = ctx.createRadialGradient(40, 230, 1, 40, 230, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(40, 230, 30, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 272, 28, 4.2, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		panelSheen(ctx);
		aeroSheen(ctx);
		roundelSheen(ctx);

		// Paint glints, clear of the wheel circles and the intake.
		glint(ctx, 70, 216.5, 4.6);
		glint(ctx, 168, 202, 3.4);
		glint(ctx, 196, 232, 3.2);
		glint(ctx, 462, 232, 3.4);
		glint(ctx, 472, 210, 4);
		glint(ctx, 556, 219, 3);
		glint(ctx, 214, 226, 4.2);
		glint(ctx, 612, 206, 3.2);
		glint(ctx, 596, 133, 2.8);
		glint(ctx, 551.5, 121.5, 2);
		glint(ctx, 52, 252, 2.4);

		// Glass sheen: two raked streaks in the screen, one in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		line(ctx, 228, 186, 252, 161, 'rgba(255,255,255,0.62)', 2.6);
		line(ctx, 288, 185, 318, 161, 'rgba(255,255,255,0.5)', 2.2);
		line(ctx, 322, 179, 331, 170, 'rgba(255,255,255,0.3)', 1.4);
		ctx.restore();
		glint(ctx, 264, 166, 3.4);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealRaceCar(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealRaceCarLevel(ctx, x, y, scale, 5);
}
