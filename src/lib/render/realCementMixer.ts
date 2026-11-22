/**
 * Cement mixer art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over mixer lorry facing left: a compact upright day cab, a short fatter
 * pear-shaped drum with a narrow charging neck at the front, its widest point about
 * two-thirds back and a big discharge mouth at the rear, helical fins, a striped waist
 * band, a compact charging hopper over the mouth and a short discharge chute.
 * Level 5 is the production target: shaded, fitted, lit and finished with paint grain,
 * glints and hub hardware.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape, wheel } from './realKit';

const ORANGE = '#F4A261';
const ORANGE_LIGHT = '#F7B37C';
const TEAL = '#264653';
const TEAL_DARK = '#1B343D';
const CREAM = '#FFF3E0';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';
const RAIL = '#48545F';
const RIM = '#9AA6B3';

/**
 * One cut-out for cab, drum, hopper, chute, front mount, pedestal and chassis. The cab
 * back runs into a steel front mount, the drum's narrow neck flares back into the wide
 * discharge end, and the hopper and chute stay compact around the mouth.
 */
const SHELL =
	'M34,260 L34,124 Q34,104 50,98 L60,90 Q68,84 82,84 L182,84 Q196,84 196,96 L196,150 L212,162 L226,172 C256,158 296,134 340,108 C388,84 434,66 480,60 C512,56 534,62 546,76 L552,54 L644,54 L644,78 L620,78 L620,98 L596,98 L596,118 L584,118 L560,136 C562,152 560,172 552,190 C548,200 544,204 542,204 L548,200 L620,226 L638,220 L636,241 L620,241 L552,218 L542,208 C526,220 502,228 476,234 C430,242 382,244 332,238 C302,234 278,224 252,210 L226,204 L226,244 L690,244 L690,260 Z';

/** Painted drum alone: clips the cylinder shading, fins, band and rear mouth. */
const DRUM =
	'M226,172 C256,158 296,134 340,108 C388,84 434,66 480,60 C512,56 534,62 546,76 C556,88 562,106 566,124 C570,146 568,170 560,190 C554,202 548,208 540,212 C524,222 500,230 474,236 C430,244 382,246 332,240 C302,236 278,226 252,212 L226,204 Z';

/** Charging hopper: a compact steel funnel riding the drum's wide discharge end. */
const HOPPER =
	'M546,76 L552,54 L644,54 L644,78 L620,78 L620,98 L596,98 L596,118 L584,118 L566,136 L548,136 L540,108 Z';

/** Short discharge chute tucked under the tail. */
const CHUTE = 'M546,198 L620,226 L638,220 L636,241 L620,241 L552,218 L542,208 Z';

const CHUTE_GROOVE = 'M556,205 L618,226 L630,222 L628,229 L618,229 L558,211 Z';

const SCREEN = pane(42, 100, 76, 62, 7);
const DOOR_GLASS = pane(128, 104, 58, 56, 5);
const GLASS_MASK = `${SCREEN} ${DOOR_GLASS}`;

/** Door panel sits under the glass, flush with the cab sill. */
const DOOR = { x: 44, y: 170, w: 146, h: 74 };

const MIRROR = { x: 14, y: 100, w: 14, h: 32 };
const BUMPER = { x: 18, y: 232, w: 18, h: 24 };

/** Both wheels are the same piece; the body never masks them. */
const WHEEL_L = { x: 140, y: 236, r: 36 };
const WHEEL_R = { x: 500, y: 236, r: 36 };

/** Helical fins show as shallow diagonal ribs climbing the tilted drum. */
const FINS = [
	'M240,196 C286,190 330,170 366,146',
	'M280,216 C332,210 380,186 418,150',
	'M334,232 C392,228 442,198 478,156',
	'M396,240 C452,236 500,206 528,168',
	'M456,236 C496,230 528,208 546,184'
];

function pane(x: number, y: number, w: number, h: number, r: number): string {
	return `M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;
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
	glass.addColorStop(1, 'rgba(105,190,240,0.24)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** Filled wheel-arch band sitting just outside the tyre. */
function mudguard(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 9, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = TEAL;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(cx, cy, r + 7, Math.PI * 1.08, Math.PI * 1.9);
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 1.6;
	ctx.stroke();
}

/** A four-point sparkle with a warm core, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
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
 * Picture-book hub: bright rim ring, six bolt heads and a polished centre cap.
 * Every mark is mirror-symmetric, so the flipped right wheel assembles identically.
 */
function wheelFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	// Soft polished band on the outer rim, then a bright ring on the hub.
	ctx.strokeStyle = 'rgba(255,255,255,0.18)';
	ctx.lineWidth = 4.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.63, Math.PI * 1.08, Math.PI * 1.92);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.28, y + Math.sin(a) * r * 0.28, 3, CHROME, 1.3);
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.11, 0, Math.PI * 2);
	ctx.stroke();
	ctx.fillStyle = 'rgba(255,255,255,0.7)';
	ctx.beginPath();
	ctx.arc(x, y, 1.5, 0, Math.PI * 2);
	ctx.fill();
}

/** Teal waist band with cream slashes, wrapped on the tilted drum. */
function drumBand(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number): void {
	ctx.save();
	ctx.translate(cx, cy);
	ctx.rotate(-0.13);
	ctx.fillStyle = TEAL;
	ctx.fillRect(-w / 2, -h / 2, w, h);
	ctx.save();
	ctx.beginPath();
	ctx.rect(-w / 2, -h / 2, w, h);
	ctx.clip();
	for (let i = -w / 2 - 20; i < w / 2 + 20; i += 40) {
		ctx.beginPath();
		ctx.moveTo(i, -h / 2 - 2);
		ctx.lineTo(i + 9, -h / 2 - 2);
		ctx.lineTo(i - 7, h / 2 + 2);
		ctx.lineTo(i - 16, h / 2 + 2);
		ctx.closePath();
		ctx.fillStyle = 'rgba(255,243,224,0.92)';
		ctx.fill();
	}
	ctx.restore();
	ctx.fillStyle = 'rgba(255,255,255,0.22)';
	ctx.fillRect(-w / 2, -h / 2, w, 2.4);
	ctx.fillStyle = 'rgba(10,32,40,0.32)';
	ctx.fillRect(-w / 2, h / 2 - 2.4, w, 2.4);
	ctx.restore();
}

export function drawRealCementMixerLevel(
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
		ctx.ellipse(360, 278, 320, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Painted shell: cab, drum, hopper, chute, front mount, pedestal and chassis.
	shape(ctx, SHELL, ORANGE);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Steel chassis rails, standing proud of the shell's lower edge.
	rect(ctx, 30, 244, 660, 16, RAIL, 0, 0);
	rect(ctx, 30, 244, 660, 2.6, '#6B7885', 0, 0);
	rect(ctx, 30, 255, 660, 5, '#2F3942', 0, 0);
	rect(ctx, 214, 246, 6, 12, '#2F3942', 0, 0);
	rect(ctx, 436, 246, 6, 12, '#2F3942', 0, 0);

	// Cab paint: light roof, deep lower flank.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 82, 0, 250);
		paint.addColorStop(0, 'rgba(255,255,255,0.55)');
		paint.addColorStop(0.34, 'rgba(255,255,255,0.05)');
		paint.addColorStop(0.78, 'rgba(122,60,20,0.05)');
		paint.addColorStop(1, 'rgba(122,60,20,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(32, 82, 166, 168);
	}

	// Livery: teal roof cap, cream pinstripe and teal skirt on the cab.
	rect(ctx, 30, 84, 168, 12, TEAL, 0, 0);
	rect(ctx, 30, 95, 168, 2, 'rgba(255,255,255,0.22)', 0, 0);
	rect(ctx, 30, 216, 168, 3, CREAM, 0, 0);
	rect(ctx, 30, 220, 168, 24, TEAL, 0, 0);

	ctx.restore();

	// Drum: painted barrel with raised helical fins and a striped waist band.
	ctx.save();
	ctx.clip(new Path2D(DRUM));

	if (shaded) {
		ctx.save();
		ctx.translate(384, 160);
		ctx.rotate(-0.13);
		const metal = ctx.createLinearGradient(0, -86, 0, 90);
		metal.addColorStop(0, '#FFD1A2');
		metal.addColorStop(0.16, '#FCC08C');
		metal.addColorStop(0.42, '#F4A261');
		metal.addColorStop(0.72, '#E08B4B');
		metal.addColorStop(1, '#C4733A');
		ctx.fillStyle = metal;
		ctx.fillRect(-220, -110, 440, 220);
		ctx.restore();
	}

	// Livery on the drum: a narrow teal ring by the mouth, a wide waist band and a nose collar.
	ctx.save();
	ctx.translate(506, 142);
	ctx.rotate(-0.13);
	ctx.fillStyle = TEAL;
	ctx.fillRect(-7, -52, 14, 104);
	ctx.fillStyle = 'rgba(255,255,255,0.22)';
	ctx.fillRect(-7, -52, 2.4, 104);
	ctx.restore();

	drumBand(ctx, 378, 168, 250, 26);
	drumBand(ctx, 258, 190, 40, 15);

	for (const d of FINS) {
		const path = new Path2D(d);
		if (shaded) {
			ctx.save();
			ctx.translate(0, 2.6);
			ctx.strokeStyle = 'rgba(122,50,16,0.42)';
			ctx.lineWidth = 9;
			ctx.stroke(path);
			ctx.restore();
			ctx.save();
			ctx.translate(0, -2.2);
			ctx.strokeStyle = 'rgba(255,232,204,0.72)';
			ctx.lineWidth = 3;
			ctx.stroke(path);
			ctx.restore();
			ctx.strokeStyle = 'rgba(255,255,255,0.2)';
			ctx.lineWidth = 1.4;
			ctx.stroke(path);
		} else {
			ctx.strokeStyle = 'rgba(160,80,32,0.5)';
			ctx.lineWidth = 5;
			ctx.stroke(path);
		}
	}

	// Rear mouth: the drum's wide end opens around a heavy rim.
	ctx.save();
	ctx.translate(532, 132);
	ctx.rotate(-0.13);
	ctx.beginPath();
	ctx.ellipse(0, 0, 17, 52, 0, 0, Math.PI * 2);
	ctx.fillStyle = '#C4733A';
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.8;
	ctx.stroke();
	ctx.beginPath();
	ctx.ellipse(-1.5, 0, 11, 44, 0, 0, Math.PI * 2);
	ctx.fillStyle = '#141F24';
	ctx.fill();
	ctx.strokeStyle = RIM;
	ctx.lineWidth = 2.2;
	ctx.stroke();
	if (shaded) {
		ctx.beginPath();
		ctx.ellipse(-4.5, 0, 3.6, 36, 0, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(255,255,255,0.13)';
		ctx.fill();
		ctx.strokeStyle = 'rgba(154,166,179,0.35)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.ellipse(1, -8, 8, 28, 0.3, Math.PI * 0.1, Math.PI * 0.9);
		ctx.stroke();
		ctx.beginPath();
		ctx.ellipse(-2, 16, 6, 20, 0.3, Math.PI * 0.95, Math.PI * 1.75);
		ctx.stroke();
	}
	if (finish) {
		for (let i = 0; i < 12; i++) {
			const a = (i / 12) * Math.PI * 2;
			circle(ctx, Math.cos(a) * 13.4, Math.sin(a) * 47.5, 1.3, CHROME, 0.8);
		}
	}
	ctx.restore();

	// Rear stiffener ring just ahead of the mouth.
	ctx.beginPath();
	ctx.ellipse(486, 146, 6, 44, -0.13, 0, Math.PI * 2);
	ctx.strokeStyle = 'rgba(122,60,20,0.28)';
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.restore();

	// Re-stroke the silhouette after the opaque drum fill.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Front mount: steel frame carrying the drum neck behind the cab.
	shape(ctx, 'M198,244 L210,192 L226,178 L226,244 Z', '#525E6A', 2.4);
	if (shaded) {
		line(ctx, 202, 238, 211, 197, 'rgba(255,255,255,0.25)', 2);
		line(ctx, 222, 242, 222, 186, 'rgba(0,0,0,0.22)', 2);
	}
	rect(ctx, 222, 186, 8, 26, '#6E7A87', 3);
	if (fitted) {
		circle(ctx, 226, 192, 2.2, CHROME, 1.1);
		circle(ctx, 226, 208, 2.2, CHROME, 1.1);
		circle(ctx, 204, 236, 2, CHROME, 1);
		rect(ctx, 208, 200, 12, 4, CHROME, 1.4);
	}

	// Charging hopper over the drum mouth.
	shape(ctx, HOPPER, RIM, 3);
	ctx.save();
	ctx.clip(new Path2D(HOPPER));
	// Open top of the hopper and the funnel throat running down to the drum mouth.
	ctx.fillStyle = '#4E5B68';
	ctx.beginPath();
	ctx.moveTo(558, 58);
	ctx.lineTo(638, 58);
	ctx.lineTo(632, 76);
	ctx.lineTo(560, 76);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = 'rgba(0,0,0,0.22)';
	ctx.beginPath();
	ctx.moveTo(560, 76);
	ctx.lineTo(632, 76);
	ctx.lineTo(618, 88);
	ctx.lineTo(570, 88);
	ctx.closePath();
	ctx.fill();
	rect(ctx, 550, 76, 92, 5, TEAL, 0, 0);
	ctx.fillStyle = 'rgba(38,70,83,0.26)';
	ctx.beginPath();
	ctx.moveTo(558, 82);
	ctx.lineTo(632, 82);
	ctx.lineTo(600, 96);
	ctx.lineTo(586, 120);
	ctx.lineTo(568, 136);
	ctx.lineTo(548, 136);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = 'rgba(255,255,255,0.28)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(560, 84);
	ctx.lineTo(550, 134);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(630, 84);
	ctx.lineTo(600, 134);
	ctx.stroke();
	ctx.fillStyle = 'rgba(255,255,255,0.34)';
	ctx.fillRect(554, 58, 3, 38);
	ctx.restore();
	line(ctx, 560, 55, 636, 55, 'rgba(255,255,255,0.55)', 2);
	if (fitted) {
		// Feed boot dropping into the drum mouth, hopper seam and corner bolts.
		shape(ctx, 'M550,132 L576,132 L568,150 L556,150 Z', TEAL_DARK, 2);
		circle(ctx, 564, 59, 2, CHROME, 1);
		circle(ctx, 632, 59, 2, CHROME, 1);
		circle(ctx, 598, 59, 2, CHROME, 1);
		line(ctx, 620, 80, 620, 96, 'rgba(38,70,83,0.45)', 1.6);
	}

	// Discharge chute.
	shape(ctx, CHUTE, RIM, 3);
	ctx.fillStyle = '#6E7A87';
	ctx.fill(new Path2D(CHUTE_GROOVE));
	ctx.strokeStyle = 'rgba(58,39,27,0.6)';
	ctx.lineWidth = 1.4;
	ctx.stroke(new Path2D(CHUTE_GROOVE));
	if (fitted) {
		circle(ctx, 548, 203, 5, CHROME, 2);
		line(ctx, 632, 224, 633, 238, 'rgba(255,255,255,0.5)', 2);
		rect(ctx, 588, 216, 12, 5, TEAL, 2);
	}

	// Mirror on the front pillar.
	rect(ctx, MIRROR.x, MIRROR.y, MIRROR.w, MIRROR.h, TEAL, 3);
	if (shaded) {
		rect(ctx, 16, 103, 10, 26, GLASS, 1.2);
	}
	line(ctx, 28, 115, 35, 118, INK, 2.5);

	// Front bumper, grille, lamps, step and visor.
	rect(ctx, BUMPER.x, BUMPER.y, BUMPER.w, BUMPER.h, CHROME, 4);
	if (fitted) {
		circle(ctx, 26, 247, 2.6, STEEL, 1.4);
		rect(ctx, 36, 176, 14, 28, TEAL, 3);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 38, 176 + bar * 7, 48, 176 + bar * 7, CHROME, 1.8);
		}
		circle(ctx, 48, 220, 6.5, LAMP, 2.4);
		circle(ctx, 48, 220, 3.6, '#FFF7CF', 1.5);
		circle(ctx, 48, 206, 4, AMBER, 2);
		rect(ctx, 58, 246, 28, 6, CHROME, 2);
		rect(ctx, 38, 94, 86, 5, TEAL_DARK, 2);
		line(ctx, 56, 156, 78, 146, INK, 2.2);
		line(ctx, 86, 156, 106, 148, INK, 2.2);
	}

	// Exhaust stack behind the door, full cab height.
	rect(ctx, 198, 150, 10, 94, '#6E7A87', 4);
	rect(ctx, 196, 144, 14, 9, '#7C8895', 3);
	line(ctx, 200.5, 158, 200.5, 236, CHROME, 1.6);
	if (fitted) {
		rect(ctx, 197, 240, 12, 4, CHROME, 1.5);
	}

	// Cab glass.
	shape(ctx, SCREEN, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, SCREEN, 42, 100, 76, 62);
		shadeGlass(ctx, DOOR_GLASS, 128, 104, 58, 56);
	}

	// Cab door: panel, livery stripe, sill shade and handle.
	ctx.fillStyle = ORANGE_LIGHT;
	ctx.fill(new Path2D(pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 3)));
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.5;
	ctx.stroke(new Path2D(pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 3)));
	ctx.save();
	ctx.clip(new Path2D(pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 3)));
	rect(ctx, 44, 226, 146, 18, TEAL, 0, 0);
	if (shaded) {
		const dg = ctx.createLinearGradient(0, 170, 0, 244);
		dg.addColorStop(0, 'rgba(255,255,255,0.34)');
		dg.addColorStop(1, 'rgba(122,60,20,0.12)');
		ctx.fillStyle = dg;
		ctx.fillRect(44, 170, 146, 74);
	}
	ctx.restore();
	line(ctx, 46, 204, 188, 204, 'rgba(58,39,27,0.22)', 1.6);
	if (fitted) {
		rect(ctx, 168, 192, 14, 5, CHROME, 2.2);
		line(ctx, 44, 190, 190, 190, 'rgba(255,255,255,0.3)', 2);
	}

	// Wheel arches.
	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Side under-run bar between the axles.
		rect(ctx, 282, 248, 5, 10, STEEL, 1.4);
		rect(ctx, 404, 248, 5, 10, STEEL, 1.4);
		rect(ctx, 278, 256, 134, 6, CHROME, 2.6);
	}

	// Front pedestal with its two support rollers.
	shape(ctx, 'M228,262 L228,244 L266,244 L262,216 L232,216 Z', TEAL, 2.4);
	if (fitted) {
		circle(ctx, 238, 212, 6, STEEL, 2);
		circle(ctx, 238, 212, 2.2, INK, 1);
		circle(ctx, 256, 214, 5.5, STEEL, 2);
		circle(ctx, 256, 214, 1.9, INK, 1);
	}

	// Both wheels share the one wheel part. Hub hardware is drawn later, symmetrically,
	// so the flipped right wheel reproduces the full art exactly.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (fitted) {
		// Tail lamps and plate on the rear cross-member.
		rect(ctx, 642, 246, 9, 11, RED, 1.5);
		rect(ctx, 656, 246, 8, 9, AMBER, 1.5);
		rect(ctx, 668, 246, 14, 10, CREAM, 1.5);
		line(ctx, 670, 250, 680, 250, 'rgba(58,39,27,0.5)', 1.2);
	}

	if (lit) {
		// Rim light along the cab roof, drum top and hopper rim.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(58, 89);
		ctx.lineTo(180, 86.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(300, 124);
		ctx.quadraticCurveTo(420, 82, 534, 65);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(560, 55);
		ctx.lineTo(636, 55);
		ctx.stroke();

		// Headlight glow.
		const glow = ctx.createRadialGradient(48, 220, 1, 48, 220, 24);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(48, 220, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 272, 33, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain: painted body only, never the glazing or the tyres.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
		ctx.clip(new Path2D(keepOut), 'evenodd');
		let seed = 29;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 300; i++) {
			const px = 38 + rand() * 640;
			const py = 90 + rand() * 156;
			const size = 1.5 + rand() * 1.3;
			ctx.globalAlpha = 0.1 + rand() * 0.07;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 120; i++) {
			const px = 38 + rand() * 640;
			const py = 90 + rand() * 156;
			const size = 1.3 + rand() * 1;
			ctx.globalAlpha = 0.18 + rand() * 0.12;
			ctx.fillRect(px, py, size, size);
		}

		// A few larger flecks so the grain still reads at game scale.
		ctx.fillStyle = INK;
		for (let i = 0; i < 26; i++) {
			const px = 38 + rand() * 640;
			const py = 90 + rand() * 156;
			ctx.globalAlpha = 0.07 + rand() * 0.05;
			ctx.fillRect(px, py, 2.6 + rand() * 1.6, 2.4 + rand() * 1.4);
		}

		// Long brush strokes along the cab flank and the drum.
		ctx.globalAlpha = 0.12;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.7;
		for (const [sx, sy, ex, ey] of [
			[56, 118, 182, 104],
			[250, 182, 340, 156],
			[380, 134, 500, 96],
			[58, 208, 180, 206],
			[286, 198, 372, 178]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.5, ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Polished drum: a broad crown sheen, two bright core lines and a lower bounce.
		// Clipped to the barrel minus both tyres, so no highlight crosses the rubber.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.clip(
			new Path2D(
				`${DRUM} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`
			),
			'evenodd'
		);

		ctx.save();
		ctx.translate(392, 150);
		ctx.rotate(-0.13);
		const sheen = ctx.createLinearGradient(0, -80, 0, 34);
		sheen.addColorStop(0, 'rgba(255,255,255,0)');
		sheen.addColorStop(0.3, 'rgba(255,255,255,0.24)');
		sheen.addColorStop(0.58, 'rgba(255,255,255,0.08)');
		sheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = sheen;
		ctx.fillRect(-180, -104, 360, 148);
		ctx.restore();

		ctx.globalAlpha = 0.42;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(276, 148);
		ctx.quadraticCurveTo(420, 92, 540, 76);
		ctx.stroke();
		ctx.globalAlpha = 0.24;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(292, 141);
		ctx.quadraticCurveTo(424, 97, 534, 83);
		ctx.stroke();
		ctx.globalAlpha = 0.2;
		ctx.lineWidth = 4.4;
		ctx.beginPath();
		ctx.moveTo(294, 222);
		ctx.quadraticCurveTo(430, 236, 540, 202);
		ctx.stroke();
		ctx.globalAlpha = 0.3;
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(330, 224);
		ctx.quadraticCurveTo(420, 230, 500, 214);
		ctx.stroke();
		ctx.restore();

		// Glints clear of the glass and the wheel circles.
		glint(ctx, 428, 118, 7.4);
		glint(ctx, 480, 98, 6.2);
		glint(ctx, 330, 160, 5.8);
		glint(ctx, 82, 176, 5.4);
		glint(ctx, 600, 62, 4.6);
		glint(ctx, 606, 228, 3.6);
		glint(ctx, 146, 90, 4.4);

		// Glass: a sheen down the screen and a sparkle in the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(60, 148);
		ctx.lineTo(92, 108);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(138, 148);
		ctx.lineTo(162, 114);
		ctx.stroke();
		ctx.lineWidth = 1.6;
		ctx.globalAlpha = 0.7;
		ctx.beginPath();
		ctx.moveTo(52, 152);
		ctx.lineTo(66, 132);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 172, 120, 4);

		// Hub hardware on both wheels.
		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Exhaust wisp drifting from the stack across the cab's rear pillar. Clipped to the
		// shell so the cut-out tile keeps every mark.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[194, 148, 3.2],
			[192, 142, 3.4],
			[190, 136, 2.6]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Finishing marks: hopper lip sheen, chute edge and pedestal bolts.
		line(ctx, 562, 56, 634, 56, 'rgba(255,255,255,0.5)', 2);
		line(ctx, 554, 205, 618, 226, 'rgba(255,255,255,0.4)', 1.6);
		circle(ctx, 231, 256, 1.4, CHROME, 1);
		circle(ctx, 263, 256, 1.4, CHROME, 1);

		// Bumper, grille, door handle and tail-lamp gleams.
		line(ctx, 20, 234, 33, 234, 'rgba(255,255,255,0.75)', 2);
		line(ctx, 39, 180, 46, 180, 'rgba(255,255,255,0.55)', 1.4);
		line(ctx, 170, 194, 181, 194, 'rgba(255,255,255,0.7)', 1.8);
		circle(ctx, 674, 251, 1.4, '#FFF7CF', 1);

		// Drum-band rivets, kept inside the painted barrel.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.translate(378, 168);
		ctx.rotate(-0.13);
		for (const rx of [-92, -46, 0, 46, 92]) {
			circle(ctx, rx, 0, 1.6, CHROME, 0.9);
		}
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealCementMixer(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealCementMixerLevel(ctx, x, y, scale, 5);
}
