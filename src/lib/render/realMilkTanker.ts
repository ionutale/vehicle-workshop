/**
 * Milk tanker art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over lorry facing left: tall day cab, polished cylindrical tank with
 * longitudinal ribs and a domed rear head, a top manway, a rear ladder and
 * under-run bars. Level 5 is the production target: shaded, fitted, lit and
 * finished with paint grain, specular glints and hub hardware.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape, wheel } from './realKit';

const CREAM = '#F7F9FC';
const CREAM_SHADE = '#EFF3F9';
const BLUE = '#457B9D';
const BLUE_DARK = '#2F5C77';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/**
 * One cut-out for cab, tank and chassis: the cab roof sits above the tank, the
 * tank's rear head domes out over the chassis, and the cab skirt hangs low.
 */
const SHELL =
	'M30,258 L30,128 Q30,111 48,105 L198,96 Q208,96 214,100 L216,110 L672,110 C690,110 702,134 702,176 C702,218 690,242 672,242 L700,242 L700,258 L30,258 Z';

/** The cylinder alone: clips the metal shading, ribs and livery band. */
const TANK = 'M216,110 L672,110 C690,110 702,134 702,176 C702,218 690,242 672,242 L216,242 Z';

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const SCREEN = pane(42, 122, 88, 48, 8);
const DOOR_GLASS = pane(142, 126, 62, 44, 5);
const GLASS_MASK = `${SCREEN} ${DOOR_GLASS}`;

/** Door panel sits under the glass, flush with the cab sill. */
const DOOR = { x: 44, y: 178, w: 160, h: 74 };

/** Both wheels are the same piece; the body never masks them. */
const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 600, y: 236, r: 36 };

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
	ctx.fillStyle = BLUE_DARK;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
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
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.28, y + Math.sin(a) * r * 0.28, 2.5, CHROME, 1.2);
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.11, 0, Math.PI * 2);
	ctx.stroke();
}

export function drawRealMilkTankerLevel(
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
		ctx.ellipse(368, 278, 330, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis rails, then the shell over them.
	rect(ctx, 46, 242, 648, 16, '#79828F', 3);
	shape(ctx, SHELL, CREAM);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Chassis rail band under the tank, standing proud of the tank's lower edge.
	rect(ctx, 216, 242, 486, 16, '#79828F', 0, 0);
	rect(ctx, 216, 242, 486, 3, '#9AA3B2', 0, 0);
	rect(ctx, 216, 254, 486, 4, '#555D6A', 0, 0);

	// Livery: blue roof cap and cab skirt. (Tank band is painted over the metal below.)
	rect(ctx, 30, 94, 190, 12, BLUE, 0, 0);
	rect(ctx, 30, 238, 190, 22, BLUE, 0, 0);

	// Cab paint light and lower shade.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 96, 0, 258);
		paint.addColorStop(0, 'rgba(255,255,255,0.55)');
		paint.addColorStop(0.3, 'rgba(255,255,255,0.05)');
		paint.addColorStop(0.78, 'rgba(47,92,119,0.04)');
		paint.addColorStop(1, 'rgba(47,92,119,0.16)');
		ctx.fillStyle = paint;
		ctx.fillRect(24, 92, 200, 170);
	}

	// Shadowed gap between cab and tank, with the exhaust stack standing in it.
	rect(ctx, 205, 107, 11, 135, '#2B3C48', 0, 0);
	rect(ctx, 205, 107, 2, 135, 'rgba(255,255,255,0.22)', 0, 0);

	// Bulkhead between cab and tank.
	line(ctx, 216, 110, 216, 242, INK, 2.5);

	ctx.restore();

	// Polished cylinder: an opaque metal gradient, ribs, ring seams and the domed head.
	ctx.save();
	ctx.clip(new Path2D(TANK));

	if (shaded) {
		const metal = ctx.createLinearGradient(0, 110, 0, 242);
		metal.addColorStop(0, '#D9E4EE');
		metal.addColorStop(0.08, '#FFFFFF');
		metal.addColorStop(0.18, '#F4F8FC');
		metal.addColorStop(0.32, '#E7EFF7');
		metal.addColorStop(0.38, '#FFFFFF');
		metal.addColorStop(0.46, '#F1F6FB');
		metal.addColorStop(0.68, '#E1EAF3');
		metal.addColorStop(0.86, '#CEDDEA');
		metal.addColorStop(1, '#BDCFE0');
		ctx.fillStyle = metal;
		ctx.fillRect(216, 110, 486, 132);

		ctx.fillStyle = 'rgba(47,92,119,0.22)';
		ctx.fillRect(216, 239, 486, 3);
	}

	// Livery band and pinstripe sit on top of the metal so they keep their colour.
	rect(ctx, 216, 114, 486, 5, BLUE, 0, 0);
	rect(ctx, 216, 208, 486, 22, BLUE, 0, 0);
	rect(ctx, 216, 208, 486, 2, 'rgba(255,255,255,0.3)', 0, 0);
	rect(ctx, 216, 228, 486, 2, 'rgba(47,92,119,0.35)', 0, 0);

	for (const ribY of [152, 176, 198]) {
		line(ctx, 220, ribY, 694, ribY, 'rgba(255,255,255,0.9)', 1.8);
		line(ctx, 220, ribY + 2, 694, ribY + 2, 'rgba(47,92,119,0.26)', 2);
	}

	for (const seamX of [356, 500]) {
		line(ctx, seamX, 116, seamX, 238, 'rgba(47,92,119,0.16)', 2);
		line(ctx, seamX + 1.5, 116, seamX + 1.5, 238, 'rgba(255,255,255,0.55)', 1.2);
	}

	// Ring stiffener ahead of the domed head.
	ctx.beginPath();
	ctx.ellipse(670, 176, 18, 62, 0, 0, Math.PI * 2);
	ctx.strokeStyle = 'rgba(47,92,119,0.24)';
	ctx.lineWidth = 2;
	ctx.stroke();

	if (fitted) {
		// Dairy wordmark on the waist band.
		ctx.fillStyle = CREAM;
		ctx.font = '700 18px ui-rounded, system-ui, sans-serif';
		ctx.fillText('MILK', 262, 226);

		// Draining valve on the rear head.
		circle(ctx, 690, 200, 4, CHROME, 1.6);
	}

	ctx.restore();

	// Re-stroke the silhouette after the opaque metal fill.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Top manways: a short neck under a domed, bolted lid. Two hatches name the tank.
	rect(ctx, 548, 94, 64, 16, CREAM, 2.5);
	ctx.save();
	ctx.clip(new Path2D(pane(548, 94, 64, 16, 2)));
	rect(ctx, 548, 100, 64, 4, BLUE, 0, 0);
	ctx.restore();
	shape(ctx, 'M542,96 Q542,84 554,84 L606,84 Q618,84 618,96 Z', CREAM, 2.5);
	line(ctx, 546, 94, 614, 94, 'rgba(47,92,119,0.35)', 1.8);
	rect(ctx, 328, 96, 48, 14, CREAM, 2.4);
	ctx.save();
	ctx.clip(new Path2D(pane(328, 96, 48, 14, 2)));
	rect(ctx, 328, 101, 48, 3.6, BLUE, 0, 0);
	ctx.restore();
	shape(ctx, 'M322,98 Q322,88 332,88 L372,88 Q382,88 382,98 Z', CREAM, 2.4);
	line(ctx, 326, 96, 378, 96, 'rgba(47,92,119,0.35)', 1.6);
	if (fitted) {
		circle(ctx, 550, 92, 2.4, CHROME, 1.2);
		circle(ctx, 610, 92, 2.4, CHROME, 1.2);
		circle(ctx, 580, 87, 3, CHROME, 1.4);
		circle(ctx, 334, 94, 2.2, CHROME, 1.1);
		circle(ctx, 370, 94, 2.2, CHROME, 1.1);
	}

	// Rear ladder, tail lamps and bumper.
	for (const railX of [706, 723]) {
		line(ctx, railX, 110, railX, 216, INK, 5);
		line(ctx, railX, 110, railX, 216, CHROME, 3.2);
	}
	for (let rungY = 120; rungY <= 208; rungY += 14) {
		line(ctx, 706, rungY, 723, rungY, INK, 4);
		line(ctx, 706, rungY, 723, rungY, CHROME, 2.4);
	}
	if (fitted) {
		// Ladder stand-off brackets tying it back to the domed head.
		line(ctx, 698, 148, 710, 148, INK, 3.4);
		line(ctx, 698, 148, 710, 148, CHROME, 2);
		line(ctx, 698, 206, 710, 206, INK, 3.4);
		line(ctx, 698, 206, 710, 206, CHROME, 2);
	}

	if (fitted) {
		rect(ctx, 704, 220, 9, 15, RED, 2);
		rect(ctx, 704, 236, 9, 11, AMBER, 2);
		rect(ctx, 715, 220, 7, 12, '#FFB3C0', 1.5);
		rect(ctx, 702, 242, 26, 14, CHROME, 3);
		rect(ctx, 706, 244, 16, 8, CREAM, 1.5);
	}

	// Front bumper, mirror and exhaust stack.
	rect(ctx, 16, 236, 14, 22, CHROME, 4);
	if (fitted) {
		circle(ctx, 24, 250, 3, STEEL, 1.6);
	}
	line(ctx, 30, 144, 17, 133, INK, 2.5);
	rect(ctx, 11, 113, 12, 26, BLUE_DARK, 3);
	if (shaded) {
		rect(ctx, 13, 117, 8, 18, GLASS, 1.2);
	}

	rect(ctx, 203, 124, 13, 7, STEEL, 3);
	rect(ctx, 206, 129, 8, 113, STEEL, 4, 2);
	line(ctx, 207.5, 136, 207.5, 236, CHROME, 1.8);
	line(ctx, 212.5, 140, 212.5, 236, 'rgba(58,39,27,0.4)', 2);

	// Glass.
	shape(ctx, SCREEN, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, SCREEN, 42, 122, 88, 48);
		shadeGlass(ctx, DOOR_GLASS, 142, 126, 62, 44);
	}

	// Cab door: panel, livery stripe, handle.
	ctx.fillStyle = CREAM_SHADE;
	ctx.fill(new Path2D(pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 3)));
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.5;
	ctx.stroke(new Path2D(pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 3)));
	ctx.save();
	ctx.clip(new Path2D(pane(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 3)));
	rect(ctx, 30, 238, 190, 22, BLUE, 0, 0);
	ctx.restore();
	rect(ctx, 48, 194, 152, 7, BLUE, 0, 0);
	line(ctx, 46, 228, 202, 228, 'rgba(58,39,27,0.28)', 1.6);
	rect(ctx, 186, 208, 14, 5, CHROME, 2.5);

	// Cab front: visor, grille, lamps, step, wipers.
	if (fitted) {
		rect(ctx, 38, 116, 100, 6, BLUE_DARK, 3);
		rect(ctx, 32, 198, 14, 30, STEEL, 3);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 34, 198 + bar * 7, 44, 198 + bar * 7, CHROME, 1.8);
		}
		circle(ctx, 38, 244, 7, LAMP, 2.4);
		circle(ctx, 38, 244, 4, '#FFF7CF', 1.5);
		circle(ctx, 38, 232, 4, AMBER, 2);
		rect(ctx, 56, 250, 28, 7, CHROME, 2);
		line(ctx, 52, 166, 72, 148, INK, 2.2);
		line(ctx, 82, 166, 102, 150, INK, 2.2);
	}

	if (fitted) {
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Side under-run bar between the wheels.
		rect(ctx, 226, 246, 6, 13, STEEL, 1.5);
		rect(ctx, 524, 246, 6, 13, STEEL, 1.5);
		rect(ctx, 220, 258, 316, 7, CHROME, 3);
	}

	// Both wheels share the one wheel part. Hub hardware is drawn later, symmetrically,
	// so the flipped right wheel reproduces the full art exactly.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light along the cab roof, nose, tank top and domed head.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(58, 105);
		ctx.lineTo(194, 97.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(31.5, 144);
		ctx.lineTo(31.5, 246);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(222, 111.5);
		ctx.lineTo(666, 111.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(688, 132);
		ctx.quadraticCurveTo(699, 140, 699, 176);
		ctx.stroke();

		// Headlight glow.
		const glow = ctx.createRadialGradient(38, 244, 1, 38, 244, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(38, 244, 28, 0, Math.PI * 2);
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
		// Paint grain: solid paint and tank metal only, never the glazing or the tyres.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
		ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');
		let seed = 41;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 260; i++) {
			const px = 34 + rand() * 660;
			const py = 100 + rand() * 154;
			const size = 1.4 + rand() * 1.1;
			ctx.globalAlpha = 0.09 + rand() * 0.06;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 90; i++) {
			const px = 34 + rand() * 660;
			const py = 100 + rand() * 154;
			const size = 1.2 + rand() * 0.9;
			ctx.globalAlpha = 0.18 + rand() * 0.1;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes across the cab and barrel.
		ctx.globalAlpha = 0.11;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.6;
		for (const [sx, sy, ex, ey] of [
			[54, 112, 186, 102],
			[232, 142, 470, 140],
			[516, 192, 660, 190],
			[58, 216, 176, 214]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.5, ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Polished barrel: soft sheen bands and a warm reflection on the domed head.
		ctx.save();
		ctx.clip(new Path2D(TANK));
		ctx.globalAlpha = 0.34;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(238, 130);
		ctx.quadraticCurveTo(430, 124, 640, 128);
		ctx.stroke();
		ctx.globalAlpha = 0.2;
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(244, 194);
		ctx.quadraticCurveTo(440, 200, 646, 196);
		ctx.stroke();
		const dome = ctx.createRadialGradient(686, 154, 2, 686, 154, 28);
		dome.addColorStop(0, 'rgba(255,255,255,0.55)');
		dome.addColorStop(0.55, 'rgba(255,255,255,0.16)');
		dome.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.globalAlpha = 1;
		ctx.fillStyle = dome;
		ctx.fillRect(650, 112, 52, 128);

		// Rivets down the two barrel seams.
		ctx.globalAlpha = 0.6;
		ctx.fillStyle = CHROME;
		for (const seamX of [356, 500]) {
			for (let ry = 122; ry <= 234; ry += 14) {
				ctx.beginPath();
				ctx.arc(seamX, ry, 1.3, 0, Math.PI * 2);
				ctx.fill();
			}
		}
		ctx.restore();

		// Paint and chrome glints, clear of the glass and the wheel circles.
		glint(ctx, 468, 152, 6.6);
		glint(ctx, 606, 188, 6);
		glint(ctx, 300, 196, 5.4);
		glint(ctx, 76, 146, 5.4);
		glint(ctx, 580, 91, 4.2);
		glint(ctx, 714, 148, 3.4);

		// Glass: a sheen down the screen and a sparkle in the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(60, 164);
		ctx.lineTo(94, 125);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(152, 164);
		ctx.lineTo(176, 132);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 186, 141, 4.2);

		// Hub hardware on both wheels.
		wheelFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		wheelFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Exhaust wisp rising in the shadow gap behind the cab. Clipped to the shell so the
		// cut-out tile keeps every mark.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.globalAlpha = 0.42;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[211, 122, 3.4],
			[212, 117, 4],
			[209, 112, 3.2]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Finishing marks: bumper highlight, manway rim light and ladder bracket bolts.
		line(ctx, 18, 240, 27, 240, 'rgba(255,255,255,0.75)', 2);
		line(ctx, 560, 88, 604, 88, 'rgba(255,255,255,0.55)', 2);
		line(ctx, 334, 92, 368, 92, 'rgba(255,255,255,0.5)', 1.8);
		circle(ctx, 707, 148, 1.5, CHROME, 1);
		circle(ctx, 707, 206, 1.5, CHROME, 1);
	}

	ctx.restore();
}

export function drawRealMilkTanker(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealMilkTankerLevel(ctx, x, y, scale, 5);
}
