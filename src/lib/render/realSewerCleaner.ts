/**
 * Sewer-cleaning truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A compact works cab facing left, a big teal jetting-water cylinder, a rear cargo deck with a
 * large hose reel wound with high-pressure hose, a hose boom arm over the tank, a cream control
 * cabinet, a beacon and lamps. Green and dark-teal livery.
 *
 * The coiled hose and the boom are the cue that names the vehicle, so both read at level 1.
 * Level 5 is the production target: shaded, fully fitted, lit and finished with paint grain,
 * tank and hose sheen, glints, hub hardware and an exhaust puff.
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

const GREEN = '#90BE6D';
const GREEN_PANEL = '#86B662';
const GREEN_DARK = '#6E9A4E';
const GREEN_DEEP = '#547A3A';
const TEAL = '#264653';
const TEAL_DARK = '#1A333D';
const TEAL_DEEP = '#122730';
const TEAL_LIGHT = '#4F7B89';
const CREAM = '#FFF6E4';
const HOSE = '#3E4757';
const HOSE_LIGHT = '#6E7A92';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#E0455A';

/** Art box 660 x 300, road at 244. Front (cab) faces left. */
const SHELL =
	'M28,224 L28,150 Q28,136 38,128 L60,106 Q68,96 84,96 L186,96 Q200,96 206,104 L212,104 L486,104 C498,110 506,128 506,152 C506,176 500,190 486,200 L506,200 L506,196 L632,196 Q644,196 644,208 L644,224 Z';

/** The cylindrical tank alone: clips the metal, ribs and the waist band. */
const TANK =
	'M212,104 L486,104 C498,110 506,128 506,152 C506,176 500,190 486,200 L212,200 Z';

/** Hose boom arm: a pivoting beam from the cab bulkhead out over the reel. */
const BOOM = 'M214,104 L214,84 L392,58 L578,62 L602,72 L594,86 L392,80 L216,104 Z';

/** Beacon on the flat cab roof, mirror head ahead of the A-pillar, exhaust stack at the tail. */
const BEACON = 'M100,96 L100,88 L106,88 Q108,76 118,76 Q128,76 130,88 L136,88 L136,96 Z';
const MIRROR = 'M10,120 L26,120 Q28,120 28,124 L28,150 L10,150 Z';
const BUMPER_F = 'M12,206 L28,206 L28,232 L12,232 Z';
const BUMPER_R = 'M620,226 L654,226 L654,238 L620,238 Z';
const UNDER_RUN = 'M214,226 L470,226 L470,234 L214,234 Z';
const HATCH = 'M420,104 L420,94 Q420,88 428,88 L454,88 Q462,88 462,94 L462,104 Z';
const CABINET = 'M508,152 L548,152 L548,196 L508,196 Z';
const STACK = 'M644,140 L654,140 L654,220 L644,220 Z';
/** Axle stub and pedestal tying the reel back to the cabinet and the deck. */
const REEL_AXLE = 'M548,148 L556,148 L556,156 L548,156 Z';
const REEL_PEDESTAL = 'M550,180 L564,180 L564,196 L550,196 Z';
/** Hose guide sleeve hanging from the boom tip, just above the reel. */
const BOOM_DROP = 'M593,88 L603,88 L603,108 L593,108 Z';
/** Chassis hem visible under the shell, split around the under-run bar and rear bumper. */
const CHASSIS = 'M40,224 L214,224 L214,232 L40,232 Z M470,224 L620,224 L620,232 L470,232 Z';

/** Body cut-out: shell plus every fitting outside it, never a wheel circle. */
const BODY_MASK = [
	SHELL,
	BOOM,
	BEACON,
	MIRROR,
	BUMPER_F,
	BUMPER_R,
	UNDER_RUN,
	HATCH,
	CABINET,
	STACK,
	REEL_AXLE,
	REEL_PEDESTAL,
	BOOM_DROP,
	CHASSIS
].join(' ');

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const WINDSCREEN =
	'M38,160 L38,142 Q38,134 44,130 L64,110 Q70,104 80,104 L112,104 Q118,104 118,110 L118,154 Q118,160 112,160 Z';
const DOOR_GLASS = pane(124, 110, 64, 50, 5);
const GLASS_MASK = `${WINDSCREEN} ${DOOR_GLASS}`;

/** Cab door, baked into the body piece as the kit does for works trucks. */
const DOOR = { x: 42, y: 168, w: 104, h: 50 };

/** Both wheels are the same piece; the body never masks them. */
const WHEEL_L = { x: 170, y: 216, r: 28 };
const WHEEL_R = { x: 500, y: 216, r: 28 };

/** Hose reel cargo piece: flange, coil and the trailing hose with its nozzle. */
const REEL = { x: 598, y: 152, r: 44 };
const REEL_TAIL = 'M589,197 L601,197 L603,230 L607,238 L596,238 L591,232 Z';
const REEL_MASK = `${circleMask(REEL.x, REEL.y, REEL.r)} ${REEL_TAIL}`;

/** Hoop ribs, vertical in side profile and broken by the painted waist band. */
const RIBS = [250, 328, 406, 466];

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
	glass.addColorStop(0.44, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(70,150,190,0.32)');
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
	ctx.fillStyle = GREEN_DARK;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
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
 * Picture-book hub: bright rim rings, six bolt heads and a polished centre cap.
 * Every mark is mirror-symmetric, so the flipped rear wheel assembles identically.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.68)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.3, CHROME, 1.1);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.2);
	ctx.strokeStyle = 'rgba(58,39,27,0.3)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.24, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();
}

export function drawRealSewerCleanerLevel(
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
		ctx.ellipse(332, 250, 292, 10, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis rails, then the shell over them.
	rect(ctx, 40, 212, 600, 20, '#79828F', 0, 0);
	ctx.fillStyle = '#555D6A';
	ctx.fillRect(40, 228, 600, 4);
	shape(ctx, SHELL, GREEN);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Cab paint light and lower shade.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 94, 0, 224);
		paint.addColorStop(0, 'rgba(255,255,255,0.5)');
		paint.addColorStop(0.3, 'rgba(255,255,255,0.06)');
		paint.addColorStop(0.76, 'rgba(84,122,58,0.05)');
		paint.addColorStop(1, 'rgba(84,122,58,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(26, 92, 184, 134);
	}

	// Rear deck paint, a little cooler than the cab.
	if (shaded) {
		const deck = ctx.createLinearGradient(0, 196, 0, 224);
		deck.addColorStop(0, 'rgba(255,255,255,0.34)');
		deck.addColorStop(1, 'rgba(26,51,61,0.26)');
		ctx.fillStyle = deck;
		ctx.fillRect(504, 196, 142, 28);
	}

	// Roof cap, belt line and skirt in the teal second colour.
	ctx.fillStyle = TEAL;
	ctx.fillRect(26, 94, 184, 8);
	ctx.fillRect(26, 162, 184, 6);
	ctx.fillRect(26, 208, 618, 16);
	ctx.fillStyle = 'rgba(255,255,255,0.28)';
	ctx.fillRect(26, 208, 618, 2);
	ctx.fillStyle = 'rgba(0,0,0,0.16)';
	ctx.fillRect(26, 220, 618, 4);

	// Deck lip and rear panel seam.
	ctx.fillStyle = TEAL;
	ctx.fillRect(506, 196, 138, 4);
	line(ctx, 640, 200, 640, 224, 'rgba(18,39,48,0.24)', 1.6);

	// Shadowed bulkhead between cab and tank.
	ctx.fillStyle = TEAL_DEEP;
	ctx.fillRect(206, 104, 8, 120);
	ctx.fillStyle = 'rgba(255,255,255,0.16)';
	ctx.fillRect(206, 104, 2, 120);

	// Cab door leaf: fitted flush behind the front wheel arch.
	const doorPath = new Path2D(pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 3));
	ctx.fillStyle = GREEN_PANEL;
	ctx.fill(doorPath);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.5;
	ctx.stroke(doorPath);

	ctx.save();
	ctx.clip(doorPath);
	ctx.fillStyle = TEAL;
	ctx.fillRect(DOOR.x - 2, 208, DOOR.w + 4, 9);
	ctx.fillStyle = 'rgba(255,255,255,0.3)';
	ctx.fillRect(DOOR.x - 2, 168, DOOR.w + 4, 2.4);
	ctx.fillStyle = 'rgba(84,122,58,0.18)';
	ctx.fillRect(DOOR.x - 2, 200, DOOR.w + 4, 3);
	ctx.fillStyle = 'rgba(0,0,0,0.12)';
	ctx.fillRect(DOOR.x - 2, 216, DOOR.w + 4, 4);
	ctx.restore();

	ctx.restore();

	// Tank: flat teal at level 1, brushed painted metal from level 2.
	ctx.save();
	ctx.clip(new Path2D(TANK));
	ctx.fillStyle = TEAL;
	ctx.fillRect(210, 102, 300, 100);
	if (shaded) {
		const metal = ctx.createLinearGradient(0, 104, 0, 200);
		metal.addColorStop(0, '#57828F');
		metal.addColorStop(0.1, '#5F8C99');
		metal.addColorStop(0.22, '#436C7A');
		metal.addColorStop(0.38, TEAL);
		metal.addColorStop(0.62, '#1F3B47');
		metal.addColorStop(0.84, '#182F3A');
		metal.addColorStop(1, '#11252E');
		ctx.fillStyle = metal;
		ctx.fillRect(210, 102, 300, 100);

		const crown = ctx.createLinearGradient(0, 106, 0, 142);
		crown.addColorStop(0, 'rgba(255,255,255,0.34)');
		crown.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = crown;
		ctx.fillRect(210, 106, 300, 36);

		ctx.fillStyle = 'rgba(9,22,28,0.24)';
		ctx.fillRect(210, 196, 300, 4);
	}

	// Green waist band with its bevels and wordmark.
	ctx.fillStyle = GREEN;
	ctx.fillRect(212, 152, 294, 20);
	ctx.fillStyle = 'rgba(255,255,255,0.45)';
	ctx.fillRect(212, 152, 294, 2);
	ctx.fillStyle = 'rgba(84,122,58,0.4)';
	ctx.fillRect(212, 169, 294, 3);
	if (fitted) {
		ctx.fillStyle = TEAL_DARK;
		ctx.font = '700 13px ui-rounded, system-ui, sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';
		ctx.fillText('SEWER', 258, 167);
	}

	// Hoop ribs: lit left edge and shaded right edge, broken by the band.
	if (shaded) {
		for (const ribX of RIBS) {
			for (const [top, bottom] of [
				[108, 150],
				[176, 196]
			]) {
				line(ctx, ribX, top, ribX, bottom, 'rgba(255,255,255,0.26)', 3);
				line(ctx, ribX + 3, top, ribX + 3, bottom, 'rgba(9,22,28,0.28)', 3);
			}
		}
	}

	// Front head seam and the stiffener ring ahead of the domed rear head.
	line(ctx, 212, 104, 212, 200, 'rgba(9,22,28,0.45)', 3);
	line(ctx, 214, 106, 214, 198, 'rgba(255,255,255,0.16)', 1.6);
	ctx.beginPath();
	ctx.ellipse(496, 152, 7, 46, 0, 0, Math.PI * 2);
	ctx.strokeStyle = 'rgba(9,22,28,0.28)';
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.restore();

	// Re-stroke the silhouette after the opaque tank fill.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Tank hatch on the crown, drawn over the tank outline.
	shape(ctx, HATCH, CREAM, 2.5);
	ctx.save();
	ctx.clip(new Path2D(HATCH));
	ctx.fillStyle = TEAL;
	ctx.fillRect(418, 98, 46, 3.4);
	ctx.fillStyle = 'rgba(0,0,0,0.1)';
	ctx.fillRect(418, 101.4, 46, 3);
	ctx.restore();
	line(ctx, 418, 94.4, 464, 94.4, 'rgba(26,51,61,0.3)', 1.6);
	if (fitted) {
		circle(ctx, 425, 91, 1.9, CHROME, 1);
		circle(ctx, 457, 91, 1.9, CHROME, 1);
		circle(ctx, 441, 88.6, 2.3, CHROME, 1.1);
	}

	// Hose boom arm over the tank, with its ram, pivot and hose guide.
	shape(ctx, BOOM, GREEN);
	ctx.save();
	ctx.clip(new Path2D(BOOM));
	if (shaded) {
		const arm = ctx.createLinearGradient(0, 58, 0, 104);
		arm.addColorStop(0, '#A8CE88');
		arm.addColorStop(0.45, GREEN);
		arm.addColorStop(1, '#5F8A42');
		ctx.fillStyle = arm;
		ctx.fillRect(210, 56, 396, 50);
	}
	if (fitted) {
		line(ctx, 300, 90, 392, 74, INK, 6);
		line(ctx, 300, 90, 392, 74, STEEL, 4);
		line(ctx, 322, 86, 386, 75.4, CHROME, 1.6);
		circle(ctx, 300, 90, 3.4, TEAL_DARK, 1.4);
		circle(ctx, 392, 74, 2.8, CHROME, 1.2);
		line(ctx, 230, 97.6, 384, 77.8, 'rgba(26,70,85,0.5)', 3.2);
		line(ctx, 400, 78.4, 586, 82.8, 'rgba(26,70,85,0.5)', 3.2);
	}
	ctx.restore();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.6;
	ctx.stroke(new Path2D(BOOM));

	// Hose guide sleeve and the hose dropping from the boom toward the reel.
	shape(ctx, BOOM_DROP, STEEL, 2.2);
	line(ctx, 598, 80, 598, 106, INK, 7);
	line(ctx, 598, 80, 598, 106, HOSE, 5);
	circle(ctx, 598, 104, 2.8, CHROME, 1.4);

	// Boom pivot block and hose-guide roller.
	circle(ctx, 216, 98, 6.2, TEAL_DARK, 2.2);
	circle(ctx, 216, 98, 2.2, CHROME, 1.2);
	if (fitted) {
		circle(ctx, 598, 74, 6, TEAL_DARK, 2.2);
		circle(ctx, 598, 74, 2.4, CHROME, 1.2);
		line(ctx, 593, 74, 603, 74, 'rgba(255,255,255,0.28)', 1.2);
	}

	// Beacon: amber dome on a teal base.
	shape(ctx, BEACON, AMBER, 2.5);
	ctx.save();
	ctx.clip(new Path2D(BEACON));
	ctx.fillStyle = TEAL;
	ctx.fillRect(98, 88, 40, 8);
	ctx.fillStyle = 'rgba(255,255,255,0.4)';
	ctx.fillRect(106, 82, 3, 8);
	ctx.restore();

	// Mirror head and arm on the A-pillar.
	line(ctx, 28, 138, 26, 132, INK, 3);
	line(ctx, 28, 138, 26, 132, STEEL, 1.8);
	shape(ctx, MIRROR, TEAL_DARK, 2.4);
	if (shaded) {
		ctx.fillStyle = GLASS;
		ctx.fillRect(13, 124, 12, 22);
		ctx.strokeStyle = 'rgba(58,39,27,0.5)';
		ctx.lineWidth = 1.2;
		ctx.strokeRect(13, 124, 12, 22);
	}

	// Front bumper, side under-run bar and rear under-run.
	shape(ctx, BUMPER_F, CHROME, 2.6);
	ctx.fillStyle = 'rgba(0,0,0,0.18)';
	ctx.fillRect(13, 226, 15, 5);
	shape(ctx, UNDER_RUN, CHROME, 2.4);
	for (const hangerX of [240, 446]) {
		line(ctx, hangerX, 224, hangerX, 232, INK, 3.4);
		line(ctx, hangerX, 224, hangerX, 232, STEEL, 1.8);
	}
	shape(ctx, BUMPER_R, CHROME, 2.4);

	// Exhaust stack up the tail, clear of the reel piece.
	shape(ctx, STACK, CHROME, 2.4);
	ctx.save();
	ctx.clip(new Path2D(STACK));
	ctx.fillStyle = 'rgba(255,255,255,0.5)';
	ctx.fillRect(646, 142, 2.4, 78);
	ctx.fillStyle = 'rgba(0,0,0,0.18)';
	ctx.fillRect(651, 142, 3, 78);
	ctx.restore();
	ctx.fillStyle = TEAL_DEEP;
	ctx.beginPath();
	ctx.ellipse(649, 140, 5, 1.8, 0, 0, Math.PI * 2);
	ctx.fill();
	if (fitted) {
		for (const bandY of [152, 208]) {
			line(ctx, 643, bandY, 655, bandY, INK, 3.2);
			line(ctx, 643, bandY, 655, bandY, STEEL, 1.8);
		}
		line(ctx, 638, 166, 644, 166, INK, 3);
		line(ctx, 638, 166, 644, 166, CHROME, 1.6);
	}

	// Control cabinet between tank head and reel, with gauges and levers.
	shape(ctx, CABINET, CREAM, 2.6);
	ctx.save();
	ctx.clip(new Path2D(CABINET));
	ctx.fillStyle = TEAL;
	ctx.fillRect(506, 152, 44, 7);
	ctx.fillStyle = 'rgba(0,0,0,0.08)';
	ctx.fillRect(506, 190, 44, 6);
	ctx.fillStyle = 'rgba(255,255,255,0.6)';
	ctx.fillRect(506, 159, 44, 1.6);
	ctx.restore();
	if (fitted) {
		circle(ctx, 517, 170, 5, '#EAF1E4', 1.6);
		circle(ctx, 531, 170, 5, '#EAF1E4', 1.6);
		line(ctx, 517, 170, 514.5, 167, INK, 1.4);
		line(ctx, 531, 170, 534, 167, INK, 1.4);
		line(ctx, 517, 181, 517, 189, INK, 3);
		line(ctx, 525, 181, 527, 189, INK, 3);
		circle(ctx, 515, 181, 2, CHROME, 1);
		circle(ctx, 523, 181, 2, CHROME, 1);
	} else {
		ctx.fillStyle = 'rgba(26,51,61,0.18)';
		ctx.fillRect(512, 164, 15, 10);
	}

	// Reel axle stub and pedestal behind the cargo piece.
	shape(ctx, REEL_PEDESTAL, STEEL, 1.8);
	ctx.fillStyle = CHROME;
	ctx.fillRect(551, 181, 12, 4);
	ctx.fillStyle = 'rgba(0,0,0,0.18)';
	ctx.fillRect(550, 190, 14, 5);
	shape(ctx, REEL_AXLE, STEEL, 1.6);

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 38, 104, 80, 56);
		glassShade(ctx, DOOR_GLASS, 124, 110, 64, 50);
	}

	// Cab fittings.
	if (fitted) {
		for (const hy of [176, 196]) {
			rect(ctx, DOOR.x + 3, hy, 6, 11, STEEL, 1.6, 1.2);
		}
		rect(ctx, DOOR.x + DOOR.w - 22, 184, 15, 5, CHROME, 2.5, 2);
		rect(ctx, 31, 180, 10, 16, STEEL, 2.4);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 33, 180 + bar * 4, 39, 180 + bar * 4, CHROME, 1.5);
		}
		circle(ctx, 35, 211, 7, LAMP, 2.4);
		circle(ctx, 35, 211, 3.8, '#FFF7CF', 1.4);
		circle(ctx, 35, 197, 4, AMBER, 2);
		line(ctx, 48, 158, 64, 144, INK, 2);
		line(ctx, 78, 158, 94, 148, INK, 2);
		rect(ctx, 13, 214, 14, 8, CREAM, 1.4, 1.2);
		ctx.fillStyle = TEAL;
		ctx.fillRect(14, 215, 3, 6);
		ctx.fillStyle = INK;
		ctx.fillRect(18, 216, 7, 1.4);
		ctx.fillRect(18, 219, 5, 1.4);

		// Side markers along the tank below the waist band.
		for (const markerX of [236, 356, 452]) {
			rect(ctx, markerX, 180, 10, 5, AMBER, 1.2, 1);
		}

		// Tail lamps on the rear panel, under the reel.
		rect(ctx, 612, 202, 14, 15, '#3E4C59', 2.4, 1.8);
		rect(ctx, 614, 204, 10, 11, RED, 1.4);
		rect(ctx, 629, 204, 8, 10, AMBER, 1.4);
		rect(ctx, 622, 228, 26, 8, CREAM, 1.4, 1.2);
		ctx.fillStyle = TEAL;
		ctx.fillRect(624, 229, 3.4, 6);
		ctx.fillStyle = INK;
		ctx.fillRect(629, 230, 12, 1.2);
		ctx.fillRect(629, 233, 8, 1.2);
	}

	// Hose reel cargo piece: painted flange, coiled hose, hub and trailing nozzle.
	circle(ctx, REEL.x, REEL.y, REEL.r, GREEN_DARK, 3);
	circle(ctx, REEL.x, REEL.y, REEL.r - 6, '#17242B', 2);
	for (const radius of [36, 29, 22]) {
		ctx.strokeStyle = HOSE;
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, radius, 0, Math.PI * 2);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.3)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, radius - 1.4, Math.PI * 1.04, Math.PI * 1.52);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(0,0,0,0.22)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, radius + 2.2, Math.PI * 0.05, Math.PI * 0.95);
		ctx.stroke();
	}
	circle(ctx, REEL.x, REEL.y, 8.4, CHROME, 2);
	circle(ctx, REEL.x, REEL.y, 2.8, STEEL, 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(REEL.x, REEL.y, REEL.r - 2.6, 0, Math.PI * 2);
	ctx.stroke();

	// Free end of the hose dropping off the coil to its brass nozzle.
	line(ctx, 595, 198, 598, 230, INK, 10);
	line(ctx, 595, 198, 598, 230, HOSE, 8);
	line(ctx, 596, 200, 598.6, 226, HOSE_LIGHT, 2.2);
	shape(ctx, 'M603,230 L607,238 L596,238 L591,232 Z', CHROME, 1.8);

	// Wheel arches and the one wheel piece, drawn twice.
	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: cab roof, nose, tank crown, boom and deck lip.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(56, 102.5);
		ctx.lineTo(182, 99);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(29.5, 154);
		ctx.lineTo(29.5, 218);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(218, 106.5);
		ctx.lineTo(482, 106.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(498, 114);
		ctx.quadraticCurveTo(504.5, 128, 504.5, 152);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(226, 81.5);
		ctx.lineTo(388, 60.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(402, 60.4);
		ctx.lineTo(572, 64.2);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(35, 211, 1, 35, 211, 24);
		glow.addColorStop(0, 'rgba(255,240,150,0.75)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(35, 211, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 244, 26, 4.4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain: solid paint only, never the glazing, tyres or the reel hose.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)} ${REEL_MASK}`;
		ctx.clip(new Path2D(`${SHELL} ${BOOM} ${keepOut}`), 'evenodd');
		let seed = 67;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 420; i++) {
			const px = 30 + rand() * 610;
			const py = 60 + rand() * 162;
			const size = 1.3 + rand() * 1.2;
			ctx.globalAlpha = 0.08 + rand() * 0.06;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 130; i++) {
			const px = 30 + rand() * 610;
			const py = 60 + rand() * 162;
			const size = 1.2 + rand() * 0.9;
			ctx.globalAlpha = 0.15 + rand() * 0.09;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush sweeps across the cab, tank band and deck.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[52, 112, 180, 103],
			[222, 132, 474, 130],
			[226, 188, 476, 186],
			[518, 204, 632, 203],
			[240, 74, 380, 62]
		] as const) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Tank sheen: polished streaks and a soft crown bounce.
		ctx.save();
		ctx.clip(new Path2D(TANK));
		ctx.globalAlpha = 0.28;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(226, 126);
		ctx.quadraticCurveTo(360, 120, 492, 124);
		ctx.stroke();
		ctx.globalAlpha = 0.16;
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(230, 186);
		ctx.quadraticCurveTo(364, 190, 492, 186);
		ctx.stroke();
		ctx.globalAlpha = 0.12;
		ctx.lineWidth = 7;
		ctx.beginPath();
		ctx.moveTo(268, 110);
		ctx.quadraticCurveTo(274, 152, 268, 194);
		ctx.stroke();
		const dome = ctx.createRadialGradient(504, 132, 2, 504, 132, 34);
		dome.addColorStop(0, 'rgba(255,255,255,0.42)');
		dome.addColorStop(0.55, 'rgba(255,255,255,0.12)');
		dome.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.globalAlpha = 1;
		ctx.fillStyle = dome;
		ctx.fillRect(470, 106, 36, 92);
		ctx.restore();

		// Hose reel sheen: polished coils, a lit flange rim and a bright ferrule.
		ctx.save();
		ctx.clip(new Path2D(REEL_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 1.8;
		for (const radius of [36, 29, 22]) {
			ctx.beginPath();
			ctx.arc(REEL.x, REEL.y, radius, Math.PI * 1.04, Math.PI * 1.5);
			ctx.stroke();
		}
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, REEL.r - 1.4, Math.PI * 1.06, Math.PI * 1.48);
		ctx.stroke();
		line(ctx, 596, 200, 598, 227, 'rgba(255,255,255,0.36)', 1.6);
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		ctx.beginPath();
		ctx.arc(602, 235, 1.4, 0, Math.PI * 2);
		ctx.fill();
		for (let i = 0; i < 6; i++) {
			const a = (i / 6) * Math.PI * 2;
			circle(
				ctx,
				REEL.x + Math.cos(a) * (REEL.r - 3.6),
				REEL.y + Math.sin(a) * (REEL.r - 3.6),
				1.5,
				CHROME,
				0.9
			);
		}
		// Lit hub cap and a polished highlight on the axle boss.
		ctx.fillStyle = 'rgba(255,255,255,0.68)';
		ctx.beginPath();
		ctx.arc(596.6, 150.4, 1.5, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = 'rgba(255,255,255,0.45)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.arc(REEL.x, REEL.y, 5.2, Math.PI * 1.12, Math.PI * 1.62);
		ctx.stroke();
		ctx.restore();

		// Paint and chrome glints, clear of the glass and the reel.
		glint(ctx, 150, 104, 4.6);
		glint(ctx, 268, 124, 5.4);
		glint(ctx, 414, 124, 5);
		glint(ctx, 352, 190, 4.4);
		glint(ctx, 100, 186, 4);
		glint(ctx, 584, 68, 4);
		glint(ctx, 20, 210, 3);
		glint(ctx, 632, 220, 3.2);

		// Glass: a sheen down the screen and a sparkle in the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.2;
		ctx.beginPath();
		ctx.moveTo(52, 154);
		ctx.lineTo(88, 114);
		ctx.stroke();
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(138, 154);
		ctx.lineTo(160, 124);
		ctx.stroke();
		ctx.restore();

		// Beacon lens glint and cabinet hardware.
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(118, 88, 9, Math.PI * 1.15, Math.PI * 1.6);
		ctx.stroke();
		circle(ctx, 511, 155, 1.4, CHROME, 0.9);
		circle(ctx, 545, 193, 1.4, CHROME, 0.9);

		// Gauge glass gleams on the control cabinet.
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		for (const gaugeX of [517, 531]) {
			ctx.beginPath();
			ctx.arc(gaugeX - 1.4, 168, 1.5, 0, Math.PI * 2);
			ctx.fill();
		}

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Exhaust wisp rising off the tail stack.
		ctx.save();
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[651, 132, 2.8],
			[653, 127, 3.4],
			[650, 122, 2.6]
		] as const) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Mudguard crown sheen on both arches.
		ctx.strokeStyle = 'rgba(255,255,255,0.45)';
		ctx.lineWidth = 1.8;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 7.6, Math.PI * 1.18, Math.PI * 1.82);
			ctx.stroke();
		}

		// Finished chrome: bumper lip, hatch rim, stack crown.
		line(ctx, 14, 208.6, 26, 208.6, 'rgba(255,255,255,0.7)', 1.8);
		line(ctx, 422, 90, 460, 90, 'rgba(255,255,255,0.5)', 1.6);
		line(ctx, 646, 142, 652, 142, 'rgba(255,255,255,0.6)', 1.4);

		// Boom ram piston and door handle catch the light last.
		line(ctx, 326, 84.8, 382, 76, 'rgba(255,255,255,0.55)', 1.3);
		line(ctx, 125, 185.2, 137, 185.2, 'rgba(255,255,255,0.7)', 1.4);
	}

	ctx.restore();
}

export function drawRealSewerCleaner(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealSewerCleanerLevel(ctx, x, y, scale, 5);
}
