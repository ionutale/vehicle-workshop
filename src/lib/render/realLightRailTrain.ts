/**
 * Light-rail train art, cut into the same five-piece kit as the other realistic vehicles.
 * Two cars joined by a gangway bellows, raked cab nose, roof pantograph.
 * Level 5 is the production target: shaded, fully fitted, lit and picture-book finished.
 */

import {
	CHROME,
	GLASS,
	INK,
	STEEL,
	circle,
	line,
	rect,
	shape,
	wheel
} from './realKit';

const CORAL = '#E76F51';
const CORAL_DEEP = '#C4563B';
const CREAM = '#F2E8CF';
const CHARCOAL = '#3F4450';
const AMBER = '#FFD166';
const HEADLAMP = '#FFE066';
const TAIL = '#FF4D6D';

// Art box: 900 x 380, road at 272, wheels at (150,236) and (700,236).
const REAR_SHELL =
	'M50,262 L50,112 Q50,92 70,92 L410,92 Q430,92 430,112 L430,262 Z';
const FRONT_SHELL =
	'M474,262 L474,112 Q474,92 494,92 L800,92 Q820,92 828,106 L858,158 Q866,170 866,184 L866,262 Z';
const BELLOWS =
	'M430,262 L430,124 Q430,116 438,116 L466,116 Q474,116 474,124 L474,262 Z';
const WINDSHIELD = 'M802,106 L822,106 L848,170 Q852,178 846,186 L802,186 Z';
const SHELLS = `${REAR_SHELL} ${FRONT_SHELL}`;
const REAR_OUTLINE =
	'M50,262 L50,112 Q50,92 70,92 L410,92 Q430,92 430,112 L430,262';
const FRONT_OUTLINE =
	'M474,262 L474,112 Q474,92 494,92 L800,92 Q820,92 828,106 L858,158 Q866,170 866,184 L866,262';

const DOOR_X = 566;
const DOOR_Y = 108;
const DOOR_W = 64;
const DOOR_H = 144;

const WHEEL_XS = [150, 700];
const WHEEL_Y = 236;
const WHEEL_R = 36;

const WINDOW_BANDS: Array<[number, number, number, number]> = [
	[74, 112, 164, 58],
	[318, 112, 94, 58],
	[494, 112, 62, 58],
	[640, 112, 150, 58]
];

function doubleDoor(ctx: CanvasRenderingContext2D, x: number): void {
	rect(ctx, x, DOOR_Y, DOOR_W, DOOR_H, CORAL, 3);
	rect(ctx, x + 4, 112, 26, 82, GLASS, 3);
	rect(ctx, x + 34, 112, 26, 82, GLASS, 3);
	rect(ctx, x + 4, 202, 26, 42, CORAL_DEEP, 2);
	rect(ctx, x + 34, 202, 26, 42, CORAL_DEEP, 2);
	line(ctx, x + 32, 112, x + 32, 248, INK, 2.4);
}

function windowBand(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	panes: number
): void {
	rect(ctx, x, y, w, h, GLASS, 7);
	for (let pane = 1; pane < panes; pane++) {
		line(ctx, x + (w / panes) * pane, y + 2, x + (w / panes) * pane, y + h - 2, INK, 3);
	}
}

function pantograph(ctx: CanvasRenderingContext2D): void {
	// Insulators planted on the rear-car roof.
	rect(ctx, 194, 84, 13, 8, STEEL, 2, 1.6);
	rect(ctx, 225, 84, 13, 8, STEEL, 2, 1.6);

	// Base frame, then the crossed arms up to the contact strip.
	line(ctx, 192, 87, 240, 87, INK, 4.6);
	line(ctx, 192, 87, 240, 87, STEEL, 2.6);
	line(ctx, 197, 85, 230, 23, INK, 5.6);
	line(ctx, 197, 85, 230, 23, STEEL, 3.2);
	line(ctx, 237, 85, 204, 23, INK, 5.6);
	line(ctx, 237, 85, 204, 23, STEEL, 3.2);
	circle(ctx, 217, 54, 3.2, CHROME, 1.6);
	line(ctx, 186, 18, 248, 18, INK, 4.6);
	line(ctx, 186, 18, 248, 18, CHROME, 2.4);
	line(ctx, 186, 17, 180, 11, INK, 2.6);
	line(ctx, 248, 17, 254, 11, INK, 2.6);
}

/**
 * Paint grain keep-outs: glass, both doors and the wheel circles. Keeping the wheel discs
 * clean also keeps their finish mirror-symmetric for the flipped front wheel tile.
 */
const SPECKLE_KEEPOUT: Array<[number, number, number, number]> = [
	[70, 108, 172, 66],
	[314, 108, 102, 66],
	[490, 108, 70, 66],
	[636, 108, 158, 66],
	[798, 102, 58, 92],
	[242, 104, 72, 152],
	[562, 104, 72, 152]
];

function speckleAllowed(px: number, py: number): boolean {
	for (const [gx, gy, gw, gh] of SPECKLE_KEEPOUT) {
		if (px >= gx && px <= gx + gw && py >= gy && py <= gy + gh) return false;
	}
	for (const wheelX of WHEEL_XS) {
		const dx = px - wheelX;
		const dy = py - WHEEL_Y;
		if (dx * dx + dy * dy < 40 * 40) return false;
	}
	return true;
}

/** Deterministic picture-book paint grain: dark tooth plus a few cream flecks. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELLS));
	let seed = 73;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 220; i++) {
		const px = 56 + rnd() * 802;
		const py = 98 + rnd() * 156;
		const size = 1.4 + rnd() * 1.2;
		if (!speckleAllowed(px, py)) continue;
		ctx.globalAlpha = 0.08 + rnd() * 0.05;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 70; i++) {
		const px = 56 + rnd() * 802;
		const py = 98 + rnd() * 156;
		const size = 1.2 + rnd() * 0.9;
		if (!speckleAllowed(px, py)) continue;
		ctx.globalAlpha = 0.16 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();
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
	ctx.arc(x, y, 1.8, 0, Math.PI * 2);
	ctx.fill();
}

/**
 * Picture-book hub: bright rim ring, eight bolts and a lit hub centre. Eight bolts keep the
 * pattern mirror-symmetric, so the flipped front wheel tile assembles identically.
 */
function hubBolts(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.58)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.53, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 8; i++) {
		const a = (i / 8) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.28, y + Math.sin(a) * r * 0.28, 2.5, CHROME, 1.2);
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.11, 0, Math.PI * 2);
	ctx.stroke();
}

export function drawRealLightRailTrainLevel(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number,
	level: number
): void {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	const shaded = level >= 2;
	const fitted = level >= 3;
	const lit = level >= 4;
	const finish = level >= 5;

	if (lit) {
		ctx.save();
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(452, 290, 392, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Bellows first, so both cars close cleanly over it.
	shape(ctx, BELLOWS, CHARCOAL, 2.6);
	for (let rib = 438; rib < 472; rib += 9) {
		line(ctx, rib, 120, rib, 260, 'rgba(255,255,255,0.16)', 2);
	}
	rect(ctx, 434, 116, 36, 9, STEEL, 2, 1.4);

	// Two car shells.
	shape(ctx, REAR_SHELL, CORAL);
	shape(ctx, FRONT_SHELL, CORAL);

	// Roof cap, cream belt and the low rail skirt. Clipped to the shells so the cap
	// never pokes past the rounded roof corners.
	ctx.save();
	ctx.clip(new Path2D(SHELLS));
	ctx.fillStyle = CORAL_DEEP;
	ctx.fillRect(50, 92, 380, 12);
	ctx.fillRect(494, 92, 306, 12);
	line(ctx, 800, 96, 828, 110, CORAL_DEEP, 10);
	ctx.restore();
	ctx.fillStyle = CREAM;
	ctx.fillRect(50, 176, 380, 14);
	ctx.fillRect(474, 176, 392, 14);
	ctx.fillRect(50, 224, 380, 26);
	ctx.fillRect(474, 224, 392, 26);
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(50, 250, 380, 12);
	ctx.fillRect(474, 250, 392, 12);
	line(ctx, 50, 224, 430, 224, CORAL_DEEP, 2);
	line(ctx, 474, 224, 866, 224, CORAL_DEEP, 2);
	line(ctx, 50, 238, 430, 238, CORAL, 2.5);
	line(ctx, 474, 238, 866, 238, CORAL, 2.5);
	line(ctx, 50, 250, 430, 250, INK, 2);
	line(ctx, 474, 250, 866, 250, INK, 2);

	// Roof equipment pods: the train cue that the bus family does not have.
	rect(ctx, 330, 81, 76, 11, CORAL_DEEP, 3);
	rect(ctx, 336, 84, 24, 4, INK, 1.5, 1.2);
	rect(ctx, 366, 84, 24, 4, INK, 1.5, 1.2);
	rect(ctx, 544, 81, 64, 11, CORAL_DEEP, 3);
	rect(ctx, 550, 84, 22, 4, INK, 1.5, 1.2);

	// Roof pantograph.
	pantograph(ctx);

	// Both doors: the rear one is baked in, the front one is also the door part.
	doubleDoor(ctx, 246);
	doubleDoor(ctx, DOOR_X);

	// Side glazing and the raked cab screen.
	windowBand(ctx, ...WINDOW_BANDS[0], 4);
	windowBand(ctx, ...WINDOW_BANDS[1], 2);
	windowBand(ctx, ...WINDOW_BANDS[2], 2);
	windowBand(ctx, ...WINDOW_BANDS[3], 2);
	shape(ctx, WINDSHIELD, GLASS, 2.5);
	line(ctx, 810, 180, 838, 166, INK, 2);

	if (fitted) {
		// Roof vents, beacon and the route display along the cab roofline.
		rect(ctx, 300, 94, 64, 7, CORAL_DEEP, 2, 1.5);
		rect(ctx, 556, 94, 64, 7, CORAL_DEEP, 2, 1.5);
		circle(ctx, 790, 98, 4, HEADLAMP, 1.8);
		rect(ctx, 686, 93, 80, 11, CHARCOAL, 2, 1.8);
		rect(ctx, 690, 96, 72, 5, AMBER, 1.5, 1);
		rect(ctx, 695, 97.5, 18, 2, CHARCOAL, 0.5, 1);
		rect(ctx, 720, 97.5, 12, 2, CHARCOAL, 0.5, 1);
		rect(ctx, 742, 97.5, 14, 2, CHARCOAL, 0.5, 1);

		// Headlamp, tail lamp and the buffer couplers.
		rect(ctx, 846, 204, 12, 20, HEADLAMP, 3);
		rect(ctx, 52, 204, 8, 20, TAIL, 2);
		rect(ctx, 866, 238, 14, 12, CHROME, 3);
		rect(ctx, 36, 240, 14, 12, CHROME, 3);
		line(ctx, 866, 244, 880, 244, STEEL, 2);

		// Door thresholds and handles.
		for (const doorX of [246, DOOR_X]) {
			line(ctx, doorX + 4, 246, doorX + 60, 246, INK, 2);
			line(ctx, doorX + 8, 200, doorX + 20, 200, INK, 2);
			line(ctx, doorX + 44, 200, doorX + 56, 200, INK, 2);
		}

		// Fleet number plate, battery box, skirt bolts.
		rect(ctx, 88, 198, 42, 14, CHARCOAL, 2);
		rect(ctx, 94, 203, 30, 4, CREAM, 1, 1);
		rect(ctx, 178, 252, 92, 10, CHARCOAL, 2, 1.5);
		for (let bolt = 62; bolt < 420; bolt += 24) {
			circle(ctx, bolt, 256, 1.6, STEEL, 1);
		}
		for (let bolt = 486; bolt < 856; bolt += 24) {
			circle(ctx, bolt, 256, 1.6, STEEL, 1);
		}
	}

	// Wheel arches, then the shared wheel part.
	ctx.strokeStyle = CHARCOAL;
	ctx.lineWidth = 4;
	for (const wheelX of WHEEL_XS) {
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_Y, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.6;
	for (const wheelX of WHEEL_XS) {
		ctx.beginPath();
		ctx.arc(wheelX, WHEEL_Y, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	wheel(ctx, WHEEL_XS[0], WHEEL_Y, WHEEL_R);
	wheel(ctx, WHEEL_XS[1], WHEEL_Y, WHEEL_R);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SHELLS));
		const gradient = ctx.createLinearGradient(0, 92, 0, 262);
		gradient.addColorStop(0, 'rgba(255,255,255,0.34)');
		gradient.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		gradient.addColorStop(1, 'rgba(120,45,25,0.18)');
		ctx.fillStyle = gradient;
		ctx.fillRect(46, 88, 824, 178);
		ctx.restore();

		ctx.save();
		ctx.beginPath();
		for (const [bx, by, bw, bh] of WINDOW_BANDS) ctx.rect(bx, by, bw, bh);
		ctx.clip();
		const glass = ctx.createLinearGradient(74, 112, 800, 170);
		glass.addColorStop(0, 'rgba(255,255,255,0.55)');
		glass.addColorStop(0.5, 'rgba(255,255,255,0.05)');
		glass.addColorStop(1, 'rgba(105,190,240,0.24)');
		ctx.fillStyle = glass;
		ctx.fillRect(74, 112, 726, 58);
		ctx.restore();

		ctx.save();
		ctx.clip(new Path2D(WINDSHIELD));
		const screen = ctx.createLinearGradient(802, 106, 850, 186);
		screen.addColorStop(0, 'rgba(255,255,255,0.5)');
		screen.addColorStop(0.55, 'rgba(255,255,255,0.04)');
		screen.addColorStop(1, 'rgba(105,190,240,0.26)');
		ctx.fillStyle = screen;
		ctx.fillRect(798, 102, 58, 90);
		ctx.restore();

		// Restore the silhouette the gradient just washed out.
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2;
		ctx.stroke(new Path2D(REAR_OUTLINE));
		ctx.stroke(new Path2D(FRONT_OUTLINE));
	}

	if (lit) {
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.moveTo(70, 96);
		ctx.lineTo(410, 96);
		ctx.moveTo(494, 96);
		ctx.lineTo(800, 96);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(830, 108);
		ctx.lineTo(858, 158);
		ctx.stroke();

		const glow = ctx.createRadialGradient(852, 214, 1, 852, 214, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.8)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(852, 214, 30, 0, Math.PI * 2);
		ctx.fill();

		ctx.save();
		ctx.globalAlpha = 0.22;
		ctx.fillStyle = INK;
		for (const wheelX of [150, 700]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 270, 34, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Picture-book hubs, inside the wheel discs so the flipped front tile matches.
		for (const wheelX of WHEEL_XS) hubBolts(ctx, wheelX, WHEEL_Y, WHEEL_R);

		// Paint glints on the nose and panels, clear of the wheel circles.
		glint(ctx, 766, 207, 6);
		glint(ctx, 338, 206, 5.5);
		glint(ctx, 398, 196, 4.5);

		// Glass glints: sparkle on the cab screen, streaks along the side bands.
		glint(ctx, 820, 146, 5);
		line(ctx, 700, 120, 716, 162, 'rgba(255,255,255,0.5)', 3);
		line(ctx, 200, 120, 216, 162, 'rgba(255,255,255,0.5)', 3);

		// Catchlight on the headlamp lens.
		circle(ctx, 850, 209, 2.2, CREAM, 0.9);

		// A little spark at the pantograph head, kept inside the roof-box mask.
		line(ctx, 232, 22, 244, 12, AMBER, 2.4);
		line(ctx, 244, 12, 238, 10, '#FFF3B0', 1.8);
		line(ctx, 238, 10, 248, 10, '#FFF3B0', 1.6);
		circle(ctx, 244, 12, 1.6, CREAM, 1);
	}

	ctx.restore();
}

export function drawRealLightRailTrain(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealLightRailTrainLevel(ctx, x, y, scale, 5);
}
