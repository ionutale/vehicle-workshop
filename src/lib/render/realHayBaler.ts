/**
 * Hay baler art, cut into the same five-piece kit as the other realistic vehicles:
 * body (pickup and round chamber), bale, drawbar, and one wheel part used twice.
 *
 * A trailed round baler facing left. The drawbar runs out of the front-left corner to
 * the tractor hitch, with a stone guard standing ahead of the pickup. The pickup reel
 * turns at the nose and feeds the tall drum that forms the whole working body — its
 * rounded chamber arc is the machine's silhouette, ringed in teal. A chute slopes out
 * of the drum's rear over the axle, and the finished round bale — the naming cue —
 * rests on its steel deck under the end board.
 *
 * Level 4 is the production target: shaded, fitted, lit and grounded. Level 5 adds the
 * picture-book finish: paint grain, straw, glints, hub hardware and a chaff puff.
 */

import { CHROME, INK, STEEL, circle, line, rect, shape, wheel } from './realKit';

const YELLOW = '#E9C46A';
const TEAL = '#2A9D8F';
const TEAL_LIGHT = '#58C3B3';
const TEAL_DEEP = '#1E6F66';
const CREAM = '#FFF6E4';
const STRAW = '#EFD6A0';
const STRAW_LIGHT = '#FFF0CE';
const STRAW_DEEP = '#CDA45D';
const STRAW_LINE = '#A9813F';
const WELL = '#25403C';
const IRON = '#3E4652';
const RAIL = '#4C5560';
const LAMP = '#FFF1BE';
const AMBER = '#FFB703';
const RED = '#E0455A';

/** Art box 720 x 330, road at 272. Front (drawbar and pickup) faces left. */
const FRONT_WHEEL = { x: 150, y: 236, r: 32 };
const REAR_WHEEL = { x: 540, y: 236, r: 32 };
const BALE = { x: 602, y: 160, r: 44 };
const PICKUP = { x: 92, y: 226, r: 21 };
const PICKUP_RECESS = 24;

/** The drum that forms the body: its crown is the machine's roofline. */
const DRUM = { x: 330, y: 190, r: 78 };
const CHUTE_DECK_Y = 196;
const CHUTE_END = { x: 640, y: 206 };

/**
 * Body shell, one closed outline: the nose and feed deck at the front, then the drum's
 * chamber arc over the crown and down its rear, then the chute that slopes over the
 * axle into its end board, and the rear wall down to the flat chassis line.
 */
const SHELL =
	'M58,252 L58,200 Q58,186 72,182 L96,176 L253.3,176 A78,78 0 0 1 407.8,196 L640,206 L648,196 L672,196 L676,206 L676,218 L600,222 L460,222 L430,252 Z';

/** Sloping chute deck, drawn as its own strip over the teal arm. */
const CHUTE_DECK = 'M408,196 L640,206 L640,213 L408,203 Z';
const CHUTE_ARM = 'M408,196 L640,206 L648,196 L672,196 L676,206 L676,218 L600,222 L460,222 L430,252 L330,252 Z';

/** Drawbar bar out to the hitch, then the stone guard standing ahead of the pickup. */
const DRAWBAR_BAR = 'M6,246 L58,240 L58,254 L6,258 Z';
const DRAWBAR_GUARD = 'M62,194 Q46,208 42,232 L51,234 Q56,212 68,200 Z';

function onWheel(px: number, py: number, pad = 2): boolean {
	return (
		Math.hypot(px - FRONT_WHEEL.x, py - FRONT_WHEEL.y) < FRONT_WHEEL.r + pad ||
		Math.hypot(px - REAR_WHEEL.x, py - REAR_WHEEL.y) < REAR_WHEEL.r + pad
	);
}

function onPickup(px: number, py: number): boolean {
	return Math.hypot(px - PICKUP.x, py - PICKUP.y) < PICKUP_RECESS + 3;
}

/** Dark arch recess painted on the body behind each tyre, kept inside the shell. */
function drawWheelArch(ctx: CanvasRenderingContext2D, cx: number, shaded: boolean): void {
	circle(ctx, cx, 236, 40, WELL, 2.4);
	if (shaded) {
		ctx.strokeStyle = 'rgba(255,255,255,0.2)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(cx, 236, 34, Math.PI * 1.02, Math.PI * 1.5);
		ctx.stroke();
	}
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

/** The pickup reel: a recessed drum with spring tines, a windguard and a centre shaft. */
function drawPickup(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	circle(ctx, PICKUP.x, PICKUP.y, PICKUP_RECESS, WELL, 2.4);
	circle(ctx, PICKUP.x, PICKUP.y, PICKUP.r, STEEL, 2.4);
	if (shaded) {
		ctx.strokeStyle = TEAL;
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.arc(PICKUP.x, PICKUP.y, PICKUP_RECESS + 2, 0, Math.PI * 2);
		ctx.stroke();
	}

	ctx.save();
	ctx.beginPath();
	ctx.arc(PICKUP.x, PICKUP.y, PICKUP.r, 0, Math.PI * 2);
	ctx.clip();
	if (shaded) {
		const drum = ctx.createRadialGradient(
			PICKUP.x - 7,
			PICKUP.y - 8,
			3,
			PICKUP.x,
			PICKUP.y,
			PICKUP.r + 4
		);
		drum.addColorStop(0, 'rgba(255,255,255,0.32)');
		drum.addColorStop(0.6, 'rgba(255,255,255,0.04)');
		drum.addColorStop(1, 'rgba(8,34,31,0.42)');
		ctx.fillStyle = drum;
		ctx.fillRect(PICKUP.x - PICKUP.r, PICKUP.y - PICKUP.r, PICKUP.r * 2, PICKUP.r * 2);
	}
	ctx.restore();

	// Spring tines curling past the drum edge.
	for (let i = 0; i < 10; i++) {
		const a = (i / 10) * Math.PI * 2;
		const inner = PICKUP.r * 0.62;
		const outer = PICKUP.r * 1.06;
		ctx.beginPath();
		ctx.moveTo(PICKUP.x + Math.cos(a) * inner, PICKUP.y + Math.sin(a) * inner);
		ctx.quadraticCurveTo(
			PICKUP.x + Math.cos(a + 0.22) * (outer - 1),
			PICKUP.y + Math.sin(a + 0.22) * (outer - 1),
			PICKUP.x + Math.cos(a + 0.36) * outer,
			PICKUP.y + Math.sin(a + 0.36) * outer
		);
		ctx.strokeStyle = shaded ? '#DCE4EA' : CHROME;
		ctx.lineWidth = 1.5;
		ctx.stroke();
	}

	circle(ctx, PICKUP.x, PICKUP.y, 5.4, CHROME, 1.8);
	circle(ctx, PICKUP.x, PICKUP.y, 2, IRON, 1);

	if (fitted) {
		// Windguard arch over the reel with its three teeth.
		ctx.strokeStyle = IRON;
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(PICKUP.x - 27, 210);
		ctx.quadraticCurveTo(PICKUP.x, 194, PICKUP.x + 27, 208);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.3)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(PICKUP.x - 25, 208);
		ctx.quadraticCurveTo(PICKUP.x, 195.5, PICKUP.x + 25, 206);
		ctx.stroke();
		for (const dx of [-13, 0, 13]) {
			line(ctx, PICKUP.x + dx, 200, PICKUP.x + dx, 207, IRON, 2);
		}
	}

	if (finish) {
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.arc(PICKUP.x, PICKUP.y, PICKUP.r * 0.72, Math.PI * 1.08, Math.PI * 1.62);
		ctx.stroke();
		// Straw caught in the tines.
		for (let i = 0; i < 5; i++) {
			const a = -0.6 + i * 0.9;
			line(
				ctx,
				PICKUP.x + Math.cos(a) * 17,
				PICKUP.y + Math.sin(a) * 17,
				PICKUP.x + Math.cos(a + 0.35) * 25,
				PICKUP.y + Math.sin(a + 0.35) * 25,
				STRAW_LIGHT,
				1.2
			);
		}
	}
}

/**
 * The chamber face: the teal rim band following the drum's crown, the belt wraps in the
 * lower-left, the hinged tailgate seam at the rear and the drive gearbox low down.
 */
function drawChamber(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	const { x, y, r } = DRUM;

	// Rim band over the crown, from the feed deck round to the rear-bottom.
	ctx.beginPath();
	ctx.arc(x, y, r - 10, Math.PI * 1.062, Math.PI * 2);
	ctx.strokeStyle = TEAL;
	ctx.lineWidth = 11;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(x, y, r - 10, Math.PI * 1.062, Math.PI * 2);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.2;
	ctx.stroke();

	// Inset side door, so the drum face reads as a panel and not an open dial.
	ctx.beginPath();
	ctx.arc(x, y, r - 22, 0, Math.PI * 2);
	ctx.fillStyle = 'rgba(158,112,34,0.1)';
	ctx.fill();
	ctx.strokeStyle = 'rgba(58,39,27,0.24)';
	ctx.lineWidth = 1.6;
	ctx.stroke();

	// Faint spiral of the bale already forming inside the chamber.
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r - 22, 0, Math.PI * 2);
	ctx.clip();
	ctx.beginPath();
	for (let a = 0; a < Math.PI * 2 * 3.1; a += 0.14) {
		const rr = 5 + (a / (Math.PI * 2 * 3.1)) * 46;
		const aa = a - 0.7;
		const px = x + Math.cos(aa) * rr;
		const py = y + Math.sin(aa) * rr;
		if (a === 0) ctx.moveTo(px, py);
		else ctx.lineTo(px, py);
	}
	ctx.strokeStyle = 'rgba(160,120,46,0.2)';
	ctx.lineWidth = 2.4;
	ctx.stroke();
	ctx.restore();

	// Door handle beside the tailgate seam.
	rect(ctx, 382, 178, 5, 18, CHROME, 2, 1.4);
	circle(ctx, 384.5, 182, 1.2, IRON, 0.7);

	// Hinged tailgate seam down the rear of the drum, with its hinge blocks.
	ctx.beginPath();
	ctx.arc(x, y, r - 8, Math.PI * 0.02, Math.PI * 0.3);
	ctx.strokeStyle = 'rgba(58,39,27,0.3)';
	ctx.lineWidth = 2.2;
	ctx.stroke();

	// Drive gearbox low on the chamber face.
	rect(ctx, x - 42, y + 32, 28, 21, TEAL_DEEP, 3, 2);
	for (const [bx, by] of [
		[x - 38, y + 36],
		[x - 18, y + 36],
		[x - 38, y + 49],
		[x - 18, y + 49]
	]) {
		circle(ctx, bx, by, 1.5, CHROME, 0.7);
	}
	line(ctx, x - 32, y + 32, x - 28, y + 16, RAIL, 3);
	circle(ctx, x - 28, y + 15, 3, RAIL, 1.2);

	if (fitted) {
		// Rim bolts around the crown.
		for (let i = 0; i < 11; i++) {
			const a = Math.PI * (1.06 + (i / 10) * 0.88);
			circle(ctx, x + Math.cos(a) * (r - 10), y + Math.sin(a) * (r - 10), 1.5, STEEL, 0.7);
		}
		// Hinge blocks on the tailgate seam.
		rect(ctx, 397, 197, 10, 8, RAIL, 2, 1.4);
		rect(ctx, 385, 223, 10, 8, RAIL, 2, 1.4);
		// Belt tension gauge and the chamber serial plate.
		rect(ctx, 272, 150, 15, 17, CREAM, 3, 1.8);
		line(ctx, 275.5, 156, 283, 156, INK, 1.6);
		line(ctx, 275.5, 160, 279, 160, 'rgba(58,39,27,0.5)', 1.2);
		circle(ctx, 279, 163.5, 1.4, RED, 0.8);
		rect(ctx, 300, 170, 26, 11, CREAM, 1.5, 1.2);
		line(ctx, 304, 175.5, 322, 175.5, 'rgba(58,39,27,0.45)', 1);
		// Louvred belt cover inside the front of the chamber.
		for (let l = 0; l < 3; l++) {
			line(ctx, 262, 198 + l * 6, 288, 193 + l * 6, 'rgba(30,111,102,0.34)', 2.4);
		}
	}

	if (shaded) {
		// Crown light and the shaded lower-right of the chamber face.
		ctx.save();
		ctx.beginPath();
		ctx.arc(x, y, r - 16, 0, Math.PI * 2);
		ctx.clip();
		const tone = ctx.createLinearGradient(x - r, y - r, x + r * 0.7, y + r);
		tone.addColorStop(0, 'rgba(255,255,255,0.26)');
		tone.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		tone.addColorStop(1, 'rgba(122,86,20,0.16)');
		ctx.fillStyle = tone;
		ctx.fillRect(x - r, y - r, r * 2, r * 2);
		ctx.restore();

		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.arc(x, y, r - 14, Math.PI * 1.06, Math.PI * 1.68);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(30,111,102,0.24)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(x, y, r - 14, Math.PI * 0.12, Math.PI * 0.55);
		ctx.stroke();
	}

	if (finish) {
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.arc(x, y, r - 9, Math.PI * 1.1, Math.PI * 1.55);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(x, y, r - 20, Math.PI * 1.12, Math.PI * 1.4);
		ctx.stroke();
	}
}

/** The drive line: chain, link teeth and idler running from the pickup to the gearbox. */
function drawDrive(ctx: CanvasRenderingContext2D, shaded: boolean): void {
	ctx.beginPath();
	ctx.moveTo(104, 230);
	ctx.quadraticCurveTo(200, 242, 284, 224);
	ctx.strokeStyle = IRON;
	ctx.lineWidth = 4.2;
	ctx.stroke();

	for (let t = 0.08; t < 1; t += 0.06) {
		const mt = 1 - t;
		const px = mt * mt * 104 + 2 * mt * t * 200 + t * t * 284;
		const py = mt * mt * 230 + 2 * mt * t * 242 + t * t * 224;
		const dx = 2 * mt * (200 - 104) + 2 * t * (284 - 200);
		const dy = 2 * mt * (242 - 230) + 2 * t * (224 - 242);
		const len = Math.hypot(dx, dy) || 1;
		ctx.beginPath();
		ctx.moveTo(px - (dy / len) * 3.4, py + (dx / len) * 3.4);
		ctx.lineTo(px + (dy / len) * 3.4, py - (dx / len) * 3.4);
		ctx.strokeStyle = shaded ? '#8A93A3' : CHROME;
		ctx.lineWidth = 1.4;
		ctx.stroke();
	}

	circle(ctx, 199, 234, 7.4, CHROME, 2);
	circle(ctx, 199, 234, 2.6, IRON, 1);
	if (shaded) {
		ctx.strokeStyle = 'rgba(58,39,27,0.3)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.arc(199, 234, 5, 0.2, 2.4);
		ctx.stroke();
	}
}

/** The finished round bale: rolled layers, net wrap, straw and a contact shadow. */
function drawBale(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	const { x, y, r } = BALE;

	if (shaded) {
		// Contact shadow where the bale meets the chute deck.
		ctx.save();
		ctx.globalAlpha = 0.22;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(x - 6, 204, 29, 4.6, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	circle(ctx, x, y, r, STRAW, 3);

	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.clip();

	if (shaded) {
		const round = ctx.createRadialGradient(x - 15, y - 17, 4, x, y, r + 6);
		round.addColorStop(0, 'rgba(255,255,255,0.42)');
		round.addColorStop(0.55, 'rgba(255,255,255,0.03)');
		round.addColorStop(1, 'rgba(146,104,34,0.3)');
		ctx.fillStyle = round;
		ctx.fillRect(x - r, y - r, r * 2, r * 2);
	}

	// Rolled layers read as a true spiral on the bale's end face, turned off the
	// vertical so the face never reads as a wheel.
	ctx.beginPath();
	for (let a = 0; a < Math.PI * 2 * 4.2; a += 0.12) {
		const rr = 4 + (a / (Math.PI * 2 * 4.2)) * (r - 8);
		const aa = a + 0.42;
		const px = x + Math.cos(aa) * rr;
		const py = y + Math.sin(aa) * rr;
		if (a === 0) ctx.moveTo(px, py);
		else ctx.lineTo(px, py);
	}
	ctx.strokeStyle = STRAW_LINE;
	ctx.globalAlpha = 0.5;
	ctx.lineWidth = 1.8;
	ctx.stroke();
	ctx.globalAlpha = 1;

	// Short radial strands so the face does not read as a machined disc.
	let seed = 21;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.strokeStyle = STRAW_DEEP;
	for (let i = 0; i < 74; i++) {
		const a = rnd() * Math.PI * 2;
		const inner = 6 + rnd() * (r - 20);
		const outer = inner + 3 + rnd() * 9;
		ctx.globalAlpha = 0.18 + rnd() * 0.26;
		ctx.lineWidth = 0.9 + rnd() * 0.5;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(a) * inner, y + Math.sin(a) * inner);
		ctx.lineTo(x + Math.cos(a + 0.05) * outer, y + Math.sin(a + 0.05) * outer);
		ctx.stroke();
	}
	ctx.globalAlpha = 1;
	// Straw ends curling out of the wrap at the rim.
	ctx.strokeStyle = STRAW_LIGHT;
	for (let i = 0; i < 12; i++) {
		const a = 0.2 + (i / 12) * Math.PI * 2;
		ctx.globalAlpha = 0.55;
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(a) * (r - 6), y + Math.sin(a) * (r - 6));
		ctx.quadraticCurveTo(
			x + Math.cos(a + 0.12) * (r - 1),
			y + Math.sin(a + 0.12) * (r - 1),
			x + Math.cos(a + 0.2) * (r + 2),
			y + Math.sin(a + 0.2) * (r + 2)
		);
		ctx.stroke();
	}
	ctx.globalAlpha = 1;

	if (fitted) {
		// Net wrap: fine chords across the face, the wrap seam and its loose corner.
		ctx.strokeStyle = 'rgba(255,246,228,0.34)';
		ctx.lineWidth = 1.1;
		for (const a of [-0.75, -0.1, 0.55, 1.2]) {
			ctx.beginPath();
			ctx.moveTo(x + Math.cos(a) * (r - 3), y + Math.sin(a) * (r - 3));
			ctx.lineTo(x + Math.cos(a + Math.PI) * (r - 3), y + Math.sin(a + Math.PI) * (r - 3));
			ctx.stroke();
		}
		ctx.strokeStyle = 'rgba(169,129,63,0.6)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.arc(x, y, r - 14, Math.PI * 0.88, Math.PI * 1.92);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x + 13, y + 37);
		ctx.quadraticCurveTo(x + 4, y + 41, x - 2, y + 38);
		ctx.stroke();
	}

	if (finish) {
		// Sun on the crown and a spiral catchlight.
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.arc(x, y, r - 6, Math.PI * 1.12, Math.PI * 1.56);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.45)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(x + 1, y, 26, Math.PI * 1.16, Math.PI * 1.42);
		ctx.stroke();
		// Loose straw ends poking past the wrap.
		for (const [sx, sy, ex, ey] of [
			[x - 33, y - 26, x - 38, y - 32],
			[x + 24, y - 33, x + 29, y - 40],
			[x - 37, y + 9, x - 43, y + 11],
			[x + 34, y + 15, x + 39, y + 19]
		]) {
			ctx.globalAlpha = 0.8;
			line(ctx, sx, sy, ex, ey, STRAW_LIGHT, 1.6);
		}
		ctx.globalAlpha = 1;
	}
	ctx.restore();

	if (lit) {
		// Rim light down the top-left arc of the bale, shade under the bottom.
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.arc(x, y, r - 1.4, Math.PI * 1.04, Math.PI * 1.5);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(88,58,16,0.22)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(x, y, r - 1.4, Math.PI * 0.15, Math.PI * 0.6);
		ctx.stroke();
	}
}

/** Drawbar: teal bar to the hitch eye, chrome pin and iron stone guard. */
function drawDrawbar(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, DRAWBAR_BAR, TEAL, 2.6);
	shape(ctx, DRAWBAR_GUARD, STEEL, 2.2);

	if (shaded) {
		line(ctx, 10, 244.6, 54, 239, 'rgba(255,255,255,0.4)', 1.4);
		line(ctx, 10, 256.6, 56, 252.8, 'rgba(10,40,36,0.34)', 1.4);
		line(ctx, 62, 196, 44, 230, 'rgba(255,255,255,0.34)', 1.2);
		line(ctx, 49, 232, 66, 201, 'rgba(20,26,32,0.3)', 1.2);
	}

	// Hitch eye at the far end.
	ctx.strokeStyle = CHROME;
	ctx.lineWidth = 3.4;
	ctx.beginPath();
	ctx.arc(14, 251, 4.2, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.arc(14, 251, 5.7, 0, Math.PI * 2);
	ctx.stroke();

	if (fitted) {
		circle(ctx, 46, 244, 3.4, CHROME, 1.4);
		circle(ctx, 46, 244, 1.3, IRON, 0.8);
		line(ctx, 30, 248, 44, 245, 'rgba(58,39,27,0.35)', 1.2);
		// Stone-guard slots and the pivot bolt on the nose.
		for (const gy of [212, 222]) {
			line(ctx, 47, gy, 57, gy - 8, INK, 1.6);
		}
		circle(ctx, 65, 196, 2.2, CHROME, 0.9);
	}

	if (finish) {
		// Keep the level-5 chrome marks within the drawbar cut-out.
		ctx.save();
		ctx.clip(new Path2D(`${DRAWBAR_BAR} ${DRAWBAR_GUARD}`));
		line(ctx, 9, 248.4, 50, 242.4, 'rgba(255,255,255,0.62)', 1.2);
		glint(ctx, 46, 245, 2);
		ctx.restore();
	}
}

/** Level-5 paint grain over the painted shell only, never the tyres or the pickup. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	let seed = 53;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 460; i++) {
		const px = 56 + rnd() * 636;
		const py = 110 + rnd() * 144;
		if (onWheel(px, py) || onPickup(px, py)) continue;
		ctx.globalAlpha = 0.045 + rnd() * 0.06;
		const size = 1.2 + rnd() * 1.9;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 210; i++) {
		const px = 56 + rnd() * 636;
		const py = 110 + rnd() * 144;
		if (onWheel(px, py) || onPickup(px, py)) continue;
		ctx.globalAlpha = 0.07 + rnd() * 0.1;
		const size = 1.2 + rnd() * 1.4;
		ctx.fillRect(px, py, size, size);
	}

	// Sun-bleached tooth on the chamber crown.
	ctx.fillStyle = '#FFF0C6';
	for (let i = 0; i < 80; i++) {
		const px = 250 + rnd() * 300;
		const py = 116 + rnd() * 54;
		if (onWheel(px, py) || onPickup(px, py)) continue;
		ctx.globalAlpha = 0.06 + rnd() * 0.08;
		ctx.fillRect(px, py, 1 + rnd() * 1.3, 1 + rnd() * 1.3);
	}

	// Long brush sweeps along the drum crown, feed deck and lower band.
	ctx.globalAlpha = 0.15;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.8;
	for (const [sx, sy, ex, ey] of [
		[110, 180, 260, 178],
		[256, 170, 340, 116],
		[344, 114, 408, 150],
		[476, 204, 636, 214],
		[120, 244, 360, 240]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Straw caught on the working panels and along the chute deck. */
function strawFlecks(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	let seed = 149;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	const straw = ['#F2D79B', '#DFBB74', '#C79B51', '#FBE7B4'];

	for (const [x0, x1, y0, y1, count] of [
		[64, 200, 200, 250, 14],
		[480, 630, 198, 220, 12],
		[240, 360, 232, 250, 9]
	]) {
		for (let i = 0; i < count; i++) {
			const px = x0 + rnd() * (x1 - x0);
			const py = y0 + rnd() * (y1 - y0);
			if (onWheel(px, py) || onPickup(px, py)) continue;
			const len = 2.6 + rnd() * 3.8;
			ctx.save();
			ctx.translate(px, py);
			ctx.rotate(-0.9 + rnd() * 1.8);
			ctx.strokeStyle = straw[i % straw.length];
			ctx.globalAlpha = 0.24 + rnd() * 0.24;
			ctx.lineWidth = 1 + rnd() * 0.7;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.quadraticCurveTo(len * 0.42, -0.7 - rnd() * 0.9, len, -0.2 + rnd() * 0.6);
			ctx.stroke();
			ctx.restore();
		}
	}
	ctx.restore();

	// Chaff drifting out of the pickup mouth: a warm plume kept inside the nose so
	// the cut-out tile carries it and no fleck floats past the painted silhouette.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	for (let i = 0; i < 14; i++) {
		const a = 0.35 + i * 0.12;
		const px = 68 + Math.cos(a) * (10 + i * 1.1);
		const py = 214 - Math.sin(a) * (7 + i * 0.9);
		ctx.fillStyle = i % 3 === 0 ? STRAW_DEEP : i % 2 === 0 ? STRAW : STRAW_LIGHT;
		ctx.globalAlpha = 0.2 + (i % 4) * 0.05;
		ctx.beginPath();
		ctx.ellipse(px, py, 0.8 + (i % 3) * 0.35, 0.55 + (i % 2) * 0.3, -0.6, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

/** Picture-book hub: a machined teal ring, chrome disc, six lugs and valve stem. */
function hubFinish(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	const ring = ctx.createLinearGradient(cx - r * 0.3, cy - r * 0.3, cx + r * 0.3, cy + r * 0.3);
	ring.addColorStop(0, TEAL_LIGHT);
	ring.addColorStop(0.55, TEAL);
	ring.addColorStop(1, TEAL_DEEP);
	ctx.strokeStyle = ring;
	ctx.lineWidth = 3.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.285, 0, Math.PI * 2);
	ctx.stroke();

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
		circle(ctx, lx, ly, 1.6, IRON, 0.9);
		ctx.fillStyle = 'rgba(255,255,255,0.75)';
		ctx.beginPath();
		ctx.arc(lx - 0.5, ly - 0.5, 0.55, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.78)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 1.04, Math.PI * 1.56);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,26,32,0.24)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 0.1, Math.PI * 0.5);
	ctx.stroke();

	circle(ctx, cx, cy, r * 0.13, '#AEB8C6', 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.9)';
	ctx.beginPath();
	ctx.arc(cx - r * 0.03, cy - r * 0.03, r * 0.042, 0, Math.PI * 2);
	ctx.fill();

	line(ctx, cx - r * 0.18, cy + r * 0.34, cx - r * 0.3, cy + r * 0.2, CHROME, 1.5);
	circle(ctx, cx - r * 0.3, cy + r * 0.2, 0.8, '#FFFFFF', 0.5);
}

export function drawRealHayBalerLevel(
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
		ctx.ellipse(367, 281, 322, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Painted shell.
	shape(ctx, SHELL, YELLOW);

	const shellPath = new Path2D(SHELL);
	ctx.save();
	ctx.clip(shellPath);

	// Arch recesses painted behind the tyres.
	drawWheelArch(ctx, FRONT_WHEEL.x, shaded);
	drawWheelArch(ctx, REAR_WHEEL.x, shaded);

	// Livery: lower teal band and the chute frame.
	ctx.fillStyle = TEAL;
	ctx.fillRect(0, 236, 720, 16);
	ctx.fill(new Path2D(CHUTE_ARM));
	ctx.fillStyle = CREAM;
	ctx.fillRect(0, 233, 720, 2.4);

	// Steel chute deck under the bale.
	ctx.fillStyle = STEEL;
	ctx.fill(new Path2D(CHUTE_DECK));

	if (shaded) {
		// Roof light rolling down the shell into a low-body shade.
		const paint = ctx.createLinearGradient(0, 106, 0, 256);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.4, 'rgba(255,255,255,0.04)');
		paint.addColorStop(0.78, 'rgba(128,88,16,0.05)');
		paint.addColorStop(1, 'rgba(112,76,14,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(56, 106, 636, 150);

		// Bevels on the band, the chute frame and the tail wall.
		ctx.fillStyle = 'rgba(255,255,255,0.16)';
		ctx.fillRect(0, 237, 720, 2.6);
		ctx.fillStyle = 'rgba(8,44,40,0.22)';
		ctx.fillRect(0, 248, 720, 4);
		line(ctx, 410, 196.6, 638, 205.8, 'rgba(255,255,255,0.3)', 1.6);
		line(ctx, 412, 220, 636, 220, 'rgba(8,44,40,0.3)', 2.2);

		// Feed deck and chute seams.
		line(ctx, 100, 178, 250, 178, 'rgba(255,255,255,0.3)', 1.6);
		line(ctx, 480, 208, 636, 210, 'rgba(58,39,27,0.16)', 1.6);
	}

	// Panel work: the feed deck edge, the tail wall seam and the chute ribs.
	line(ctx, 96, 176, 250, 176, 'rgba(58,39,27,0.26)', 2);
	line(ctx, 420, 222, 398, 246, 'rgba(58,39,27,0.24)', 1.6);
	for (const rx of [492, 518, 544, 570, 596, 622, 648]) {
		const ry = CHUTE_DECK_Y + ((rx - 408) * (CHUTE_END.y - CHUTE_DECK_Y)) / 232;
		line(ctx, rx, ry + 1, rx, ry + 7, 'rgba(58,39,27,0.3)', 1.2);
	}

	// Toolbox bolted to the feed deck.
	ctx.fillStyle = YELLOW;
	ctx.fillRect(146, 196, 50, 24);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.4;
	ctx.strokeRect(146, 196, 50, 24);
	ctx.fillStyle = TEAL;
	ctx.fillRect(146, 196, 50, 5);
	ctx.restore();

	// Re-stroke the silhouette after the opaque livery fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(shellPath);

	// Chamber, drive line and pickup read at every level: they name the machine.
	drawChamber(ctx, shaded, fitted, finish);
	drawDrive(ctx, shaded);
	drawPickup(ctx, shaded, fitted, finish);

	// Drawbar and its stone guard at the front-left corner.
	drawDrawbar(ctx, shaded, fitted, finish);

	// Tailgate hardware, lights and plates.
	if (fitted) {
		// Toolbox lid latch and hinges.
		rect(ctx, 166, 205, 10, 6, CHROME, 2, 1.4);
		circle(ctx, 152, 200, 1.3, CHROME, 0.7);
		circle(ctx, 190, 200, 1.3, CHROME, 0.7);

		// Work lamp on the nose and the amber marker above it.
		circle(ctx, 64, 240, 6.2, IRON, 1.8);
		circle(ctx, 64, 240, 4.4, LAMP, 1.4);
		circle(ctx, 63, 239, 1.5, '#FFFDE8', 0.7);
		circle(ctx, 63, 214, 2.6, AMBER, 1.4);

		// Ram on the tail wall and the chute's end-board latch.
		rect(ctx, 412, 200, 8, 24, STEEL, 3, 2);
		line(ctx, 416, 202, 416, 218, CHROME, 2.2);
		rect(ctx, 650, 196, 9, 13, CHROME, 2, 1.4);
		line(ctx, 652, 199, 657, 204, INK, 1.4);

		// Rear lamp cluster on the end board and its plate on the chute.
		rect(ctx, 660, 198, 9, 10, RED, 2, 1.4);
		rect(ctx, 660, 210, 9, 5, AMBER, 1.5, 1);
		rect(ctx, 500, 208, 30, 11, CREAM, 1.5, 1.4);
		for (let d = 0; d < 2; d++) {
			line(ctx, 504, 212 + d * 3, 526, 212 + d * 3, 'rgba(58,39,27,0.4)', 1);
		}

		// Rollers on the chute deck.
		for (const rx of [492, 518, 544, 570, 596, 622]) {
			const ry = CHUTE_DECK_Y + ((rx - 408) * (CHUTE_END.y - CHUTE_DECK_Y)) / 232;
			circle(ctx, rx, ry + 4, 2.2, CHROME, 1);
		}

		// Reflectors on the lower band, clear of both tyres.
		for (const rx of [212, 234, 256, 316, 338]) {
			rect(ctx, rx, 240, 9, 5, AMBER, 1.2, 0.9);
		}

		// Pickup height lever on the feed deck.
		line(ctx, 138, 190, 166, 186, CHROME, 2.4);
		circle(ctx, 166, 186, 3.2, RAIL, 1.2);
	}

	// The finished bale rests on the chute deck.
	drawBale(ctx, shaded, fitted, lit, finish);

	// Both wheels share the one wheel part; the rear tile is the front mirrored.
	wheel(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r, finish);
	wheel(ctx, REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r, finish);

	if (shaded) {
		// Teal arch lip over the front tyre, clipped to the shell.
		ctx.save();
		ctx.clip(shellPath);
		ctx.strokeStyle = TEAL;
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.arc(FRONT_WHEEL.x, 236, 38, Math.PI * 1.02, Math.PI * 1.98);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(8,44,40,0.35)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(494, 213);
		ctx.lineTo(586, 217);
		ctx.stroke();
		ctx.restore();
	}

	if (lit) {
		// Rim light along the drum crown, chute deck and end board.
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.arc(DRUM.x, DRUM.y, DRUM.r - 3, Math.PI * 1.12, Math.PI * 1.72);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(412, 197.4);
		ctx.lineTo(638, 206.2);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(650, 197.4);
		ctx.lineTo(670, 197.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(98, 177.4);
		ctx.lineTo(250, 177.4);
		ctx.stroke();

		// Work-lamp glow washing over the pickup.
		const glow = ctx.createRadialGradient(64, 240, 1, 64, 240, 22);
		glow.addColorStop(0, 'rgba(255,240,150,0.55)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(64, 240, 22, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const at of [FRONT_WHEEL, REAR_WHEEL]) {
			ctx.beginPath();
			ctx.ellipse(at.x, 271, 26, 4.4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		strawFlecks(ctx);

		// Glints on the drum rim, gearbox, lamp, plate, chute and bale; each is set
		// far enough inside its panel that the sparkle stays within the cut-out.
		glint(ctx, 330, 118, 4);
		glint(ctx, 292, 232, 3.2);
		glint(ctx, 64, 239, 3);
		glint(ctx, 602, 122, 3.6);
		glint(ctx, 512, 208, 2.6);
		glint(ctx, 658, 200, 2.4);
		glint(ctx, 171, 206, 2.4);
		glint(ctx, 166, 186, 2.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, FRONT_WHEEL.x, FRONT_WHEEL.y, FRONT_WHEEL.r);
		hubFinish(ctx, REAR_WHEEL.x, REAR_WHEEL.y, REAR_WHEEL.r);

		// Dust along the rocker, clear of both arches and kept on the painted shell.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = INK;
		for (let dust = 0; dust < 9; dust++) {
			const dx = 60 + dust * 68;
			if ((dx > 100 && dx < 200) || (dx > 490 && dx < 586)) continue;
			ctx.fillRect(dx, 244 + (dust % 3), 14, 2);
		}
		ctx.restore();

		// Paint chips on the working edges and the end board, inside the shell.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, chipW, alpha] of [
			[66, 250, 8, 0.42],
			[200, 250, 7, 0.34],
			[350, 248, 9, 0.34],
			[650, 198, 10, 0.4]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, chipW, 2);
		}
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealHayBaler(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealHayBalerLevel(ctx, x, y, scale, 5);
}
