/**
 * Metro train art, cut into the same five-piece kit as the other realistic vehicles.
 * Level 5: the level-4 fittings plus the picture-book finish (paint grain, glass
 * glints, wheel bolts and small hand-painted marks).
 *
 * A single modern metro car facing right: streamlined raked nose, dark window band,
 * three double doors, a low rail skirt and a folded roof pantograph baked into the body.
 */

import { INK, GLASS, CHROME, STEEL, shape, rect, circle, line, wheel } from './realKit';

const CREAM = '#F1FAEE';
const NAVY = '#1D3557';
const NAVY_DEEP = '#16283F';
const GLASS_DARK = '#2C4A63';
const LAMP = '#FFE066';

const SHELL =
	'M58,256 L58,96 Q58,74 82,74 L742,74 Q778,74 796,92 Q846,140 858,200 L858,232 Q858,256 834,256 Z';

const WINDOW_TOP = 108;
const WINDOW_H = 58;
const DOOR_Y = 102;
const DOOR_W = 72;
const DOOR_H = 124;
const DOOR_X = [212, 400, 572];

const WIN_X: Array<[number, number]> = [
	[100, 210],
	[286, 398],
	[474, 570],
	[646, 768]
];

const WINDSCREEN = 'M792,94 Q830,142 854,198 L810,202 Q786,150 770,100 Z';

/** Window part mask: every side pane plus the windscreen, disjoint subpaths. */
const GLASS_MASK =
	WIN_X.map(
		([x0, x1]) =>
			`M${x0},${WINDOW_TOP} L${x1},${WINDOW_TOP} L${x1},${WINDOW_TOP + WINDOW_H} L${x0},${WINDOW_TOP + WINDOW_H} Z`
	).join(' ') +
	' ' +
	WINDSCREEN;

function pantograph(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	// Base frame and insulators sitting on the roof.
	rect(ctx, 300, 67, 110, 7, STEEL, 2, 2);
	rect(ctx, 310, 61, 18, 7, CHROME, 1.5, 1.5);
	rect(ctx, 384, 61, 18, 7, CHROME, 1.5, 1.5);

	// Folded single arm.
	line(ctx, 322, 62, 384, 26, INK, 9);
	line(ctx, 322, 62, 384, 26, STEEL, 5.5);
	line(ctx, 384, 26, 332, 8, INK, 8);
	line(ctx, 384, 26, 332, 8, STEEL, 4.5);

	// Collector bar and contact pads.
	line(ctx, 314, 7, 398, 7, INK, 8);
	line(ctx, 314, 7, 398, 7, STEEL, 4.5);
	if (fitted) {
		rect(ctx, 310, 3, 14, 8, CHROME, 1, 1.5);
		rect(ctx, 388, 3, 14, 8, CHROME, 1, 1.5);
	}
}

function drawWindow(ctx: CanvasRenderingContext2D, x: number, w: number, shaded: boolean): void {
	rect(ctx, x, WINDOW_TOP, w, WINDOW_H, GLASS_DARK, 6, 3);
	const panes = Math.max(1, Math.round(w / 46));
	for (let pane = 1; pane < panes; pane++) {
		const px = x + (pane * w) / panes;
		line(ctx, px, WINDOW_TOP + 3, px, WINDOW_TOP + WINDOW_H - 3, NAVY_DEEP, 2.4);
	}
	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(x, WINDOW_TOP, w, WINDOW_H);
		ctx.clip();
		const sheen = ctx.createLinearGradient(x, WINDOW_TOP, x + w, WINDOW_TOP + WINDOW_H);
		sheen.addColorStop(0, 'rgba(207,239,255,0.5)');
		sheen.addColorStop(0.45, 'rgba(207,239,255,0.08)');
		sheen.addColorStop(1, 'rgba(207,239,255,0.22)');
		ctx.fillStyle = sheen;
		ctx.fillRect(x, WINDOW_TOP, w, WINDOW_H);
		ctx.restore();
	}
}

function drawDoor(ctx: CanvasRenderingContext2D, x: number, fitted: boolean, shaded: boolean): void {
	// Twin leaves with a dark glazed upper half.
	rect(ctx, x, DOOR_Y, DOOR_W, DOOR_H, CREAM, 4, 3);
	rect(ctx, x + 5, DOOR_Y + 8, 29, 56, GLASS_DARK, 3, 2.4);
	rect(ctx, x + 38, DOOR_Y + 8, 29, 56, GLASS_DARK, 3, 2.4);

	if (shaded) {
		for (const gx of [x + 5, x + 38]) {
			const sheen = ctx.createLinearGradient(gx, DOOR_Y + 8, gx + 29, DOOR_Y + 64);
			sheen.addColorStop(0, 'rgba(207,239,255,0.48)');
			sheen.addColorStop(1, 'rgba(207,239,255,0.06)');
			ctx.fillStyle = sheen;
			ctx.fillRect(gx, DOOR_Y + 8, 29, 56);
		}
	}

	// Centre seam and lower panels.
	line(ctx, x + DOOR_W / 2, DOOR_Y + 4, x + DOOR_W / 2, DOOR_Y + DOOR_H - 4, INK, 2.4);
	line(ctx, x + 6, DOOR_Y + 76, x + DOOR_W - 6, DOOR_Y + 76, 'rgba(29,53,87,0.35)', 2);

	if (fitted) {
		// Stainless kick plates and grab handles beside the seam.
		rect(ctx, x + 5, DOOR_Y + 92, 29, 24, '#DCE6E1', 2, 1.6);
		rect(ctx, x + 38, DOOR_Y + 92, 29, 24, '#DCE6E1', 2, 1.6);
		rect(ctx, x + 25, DOOR_Y + 50, 3, 30, CHROME, 1, 1.2);
		rect(ctx, x + 44, DOOR_Y + 50, 3, 30, CHROME, 1, 1.2);
	}
}

/** A four-point sparkle with a warm core, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, gx: number, gy: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(gx - size, gy);
	ctx.lineTo(gx + size, gy);
	ctx.moveTo(gx, gy - size);
	ctx.lineTo(gx, gy + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.9;
	ctx.beginPath();
	ctx.moveTo(gx - d, gy - d);
	ctx.lineTo(gx + d, gy + d);
	ctx.moveTo(gx - d, gy + d);
	ctx.lineTo(gx + d, gy - d);
	ctx.stroke();

	ctx.fillStyle = '#FFFDF2';
	ctx.beginPath();
	ctx.arc(gx, gy, 1.8, 0, Math.PI * 2);
	ctx.fill();
}

export function drawRealMetroTrainLevel(
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

	// Level 5 is the production target: shaded, fully fitted, lit and hand-finished.
	const shaded = level >= 2;
	const fitted = level >= 3;
	const lit = level >= 4;
	const finish = level >= 5;

	if (lit) {
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(455, 283, 396, 13, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Roof pantograph, drawn before the shell so its feet tuck onto the roof.
	pantograph(ctx, fitted);

	// Shell with the streamlined raked nose.
	shape(ctx, SHELL, CREAM);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		const bodyGradient = ctx.createLinearGradient(0, 74, 0, 248);
		bodyGradient.addColorStop(0, 'rgba(255,255,255,0.4)');
		bodyGradient.addColorStop(0.36, 'rgba(255,255,255,0.04)');
		bodyGradient.addColorStop(0.78, 'rgba(29,53,87,0.06)');
		bodyGradient.addColorStop(1, 'rgba(22,40,63,0.2)');
		ctx.fillStyle = bodyGradient;
		ctx.fillRect(52, 68, 814, 192);
		ctx.restore();
	}

	// Waist stripe, clipped to the shell so it wraps the nose.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	rect(ctx, 52, 174, 814, 22, NAVY, 0, 0);
	rect(ctx, 52, 196, 814, 3, 'rgba(255,255,255,0.35)', 0, 0);
	if (fitted) {
		rect(ctx, 52, 168, 814, 3, GLASS, 0, 0);
	}
	ctx.restore();

	// Dark window band, split around the three doors.
	for (const [wx, ww] of WIN_X) {
		drawWindow(ctx, wx, ww - wx, shaded);
	}

	// Large raked windscreen.
	shape(ctx, WINDSCREEN, GLASS_DARK, 3);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(WINDSCREEN));
		const windscreenSheen = ctx.createLinearGradient(792, 94, 850, 196);
		windscreenSheen.addColorStop(0, 'rgba(207,239,255,0.62)');
		windscreenSheen.addColorStop(0.5, 'rgba(207,239,255,0.1)');
		windscreenSheen.addColorStop(1, 'rgba(207,239,255,0.24)');
		ctx.fillStyle = windscreenSheen;
		ctx.fillRect(764, 90, 96, 114);
		ctx.restore();
	}
	if (fitted) {
		line(ctx, 844, 182, 820, 189, INK, 2.4);
		line(ctx, 840, 186, 816, 193, 'rgba(58,39,27,0.5)', 1.6);
	}

	// Low rail skirt over the wheels.
	ctx.save();
	ctx.clip(new Path2D(SHELL));
	rect(ctx, 52, 228, 814, 30, NAVY_DEEP, 0, 0);
	if (shaded) {
		rect(ctx, 52, 228, 814, 4, 'rgba(255,255,255,0.14)', 0, 0);
	}
	ctx.restore();

	// Arched rail wheel wells, drawn before the doors so no leaf is covered.
	for (const wheelX of [150, 700]) {
		const well = `M${wheelX - 46},256 L${wheelX - 46},232 Q${wheelX - 46},216 ${wheelX - 24},216 L${wheelX + 24},216 Q${wheelX + 46},216 ${wheelX + 46},232 L${wheelX + 46},256 Z`;
		shape(ctx, well, fitted ? '#101E2B' : NAVY_DEEP, 2.4);
		if (fitted) {
			line(ctx, wheelX - 30, 222, wheelX + 30, 222, 'rgba(201,210,222,0.4)', 2);
			line(ctx, wheelX - 30, 228, wheelX + 30, 228, 'rgba(201,210,222,0.28)', 2);
		}
	}

	// Three sets of double doors.
	for (const doorX of DOOR_X) {
		drawDoor(ctx, doorX, fitted, shaded);
	}

	if (fitted) {
		// Roof equipment pods.
		rect(ctx, 214, 77, 104, 9, NAVY, 2, 2);
		rect(ctx, 470, 77, 92, 9, NAVY, 2, 2);
		line(ctx, 226, 81, 306, 81, 'rgba(255,255,255,0.22)', 2);

		// Destination board on the roof fascia.
		rect(ctx, 694, 78, 64, 13, INK, 3);
		rect(ctx, 698, 81, 56, 7, '#FFD166', 2);
		ctx.fillStyle = NAVY;
		ctx.font = '700 8px system-ui, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('M2', 726, 87.5);
		ctx.textAlign = 'left';

		// Headlight and tail light.
		rect(ctx, 824, 202, 18, 19, LAMP, 4);
		rect(ctx, 827, 206, 12, 7, '#FFF7CF', 2, 1.4);
		rect(ctx, 60, 190, 10, 22, '#FF4D6D', 2);
		rect(ctx, 63, 194, 6, 6, '#FFB3C0', 1.5, 1.2);

		// Front skirt lip and car number.
		rect(ctx, 838, 228, 18, 10, STEEL, 3);
		ctx.fillStyle = NAVY;
		ctx.font = '700 11px system-ui, sans-serif';
		ctx.fillText('7301', 84, 218);

		// Door threshold plates.
		for (const doorX of DOOR_X) {
			rect(ctx, doorX + 2, 224, DOOR_W - 4, 5, STEEL, 1.5, 1.2);
		}

		// Cab louvre under the windscreen.
		rect(ctx, 780, 206, 34, 14, NAVY, 2, 1.6);
		for (let bar = 0; bar < 3; bar++) {
			line(ctx, 784, 209 + bar * 4, 810, 209 + bar * 4, 'rgba(241,250,238,0.35)', 1.4);
		}
	}

	// Steel rail wheels: only the lower arc shows below the low skirt.
	for (const wheelX of [150, 700]) {
		line(ctx, wheelX - 38, 247, wheelX + 38, 247, STEEL, 2.4);
		ctx.save();
		ctx.beginPath();
		ctx.rect(wheelX - 40, 248, 80, 28);
		ctx.clip();
		wheel(ctx, wheelX, 236, 36, finish);
		// Steel web over the shared treaded wheel: reads as a rail wheel.
		circle(ctx, wheelX, 236, 27, STEEL, 2.4);
		circle(ctx, wheelX, 236, 19, '#454D59', 2);
		circle(ctx, wheelX, 236, 8, CHROME, 2);
		if (finish) {
			// Rim bolts on the exposed lower arc of the rail wheel.
			for (let i = 0; i < 5; i++) {
				const a = Math.PI * (0.25 + (i / 4) * 0.5);
				circle(ctx, wheelX + Math.cos(a) * 27.5, 236 + Math.sin(a) * 27.5, 1.8, '#2B2D42', 1);
			}
			// Polished rim highlight, kept to the visible arc.
			ctx.strokeStyle = 'rgba(255,255,255,0.55)';
			ctx.lineWidth = 2.2;
			ctx.beginPath();
			ctx.arc(wheelX, 236, 31, Math.PI * 0.32, Math.PI * 0.68);
			ctx.stroke();
		}
		ctx.restore();
	}

	if (lit) {
		// Rim light along the roof and nose.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.moveTo(84, 76.5);
		ctx.lineTo(758, 76.5);
		ctx.stroke();

		// Headlight glow.
		const glow = ctx.createRadialGradient(833, 211, 1, 833, 211, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(833, 211, 30, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [150, 700]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 271, 38, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		// Paint grain: visible tooth on the solid paint, cut out of the glazing.
		ctx.save();
		ctx.clip(new Path2D(`${SHELL} ${GLASS_MASK}`), 'evenodd');
		let seed = 37;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 180; i++) {
			const px = 64 + rand() * 780;
			const py = 78 + rand() * 168;
			const size = 1.4 + rand() * 1.2;
			ctx.globalAlpha = 0.08 + rand() * 0.06;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFDF2';
		for (let i = 0; i < 60; i++) {
			const px = 64 + rand() * 780;
			const py = 78 + rand() * 168;
			const size = 1.2 + rand() * 0.9;
			ctx.globalAlpha = 0.18 + rand() * 0.1;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes on the cream panels.
		ctx.globalAlpha = 0.09;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.6;
		for (const [sx, sy, ex, ey] of [
			[96, 92, 214, 89],
			[596, 88, 742, 86],
			[300, 208, 430, 205],
			[88, 250, 190, 249]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 3, ex, ey);
			ctx.stroke();
		}

		// Rivets along the rail skirt.
		ctx.globalAlpha = 0.55;
		ctx.fillStyle = CHROME;
		for (let bx = 86; bx <= 828; bx += 42) {
			ctx.beginPath();
			ctx.arc(bx, 251, 1.2, 0, Math.PI * 2);
			ctx.fill();
		}

		// Warm sheen down the nose.
		ctx.globalAlpha = 0.32;
		ctx.strokeStyle = '#FFFDF2';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(836, 128);
		ctx.quadraticCurveTo(850, 164, 850, 198);
		ctx.stroke();
		ctx.restore();

		// A soft shine down the windscreen and two rear panes, clipped to the glass.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.34)';
		ctx.lineWidth = 5.4;
		ctx.beginPath();
		ctx.moveTo(798, 104);
		ctx.lineTo(820, 158);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(804, 114);
		ctx.lineTo(816, 146);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(112, 160);
		ctx.lineTo(140, 114);
		ctx.moveTo(300, 160);
		ctx.lineTo(330, 128);
		ctx.stroke();
		ctx.restore();

		// Bold sparkles: windscreen, a mid pane and the rear pane, plus one on the
		// cream panel between the last door and the cab. Sized for production scale.
		glint(ctx, 808, 132, 5.4);
		glint(ctx, 532, 124, 5.2);
		glint(ctx, 126, 120, 4.8);
		glint(ctx, 700, 214, 4.4);

		// Headlight sparkle.
		ctx.strokeStyle = 'rgba(255,255,255,0.9)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(828, 212);
		ctx.lineTo(838, 212);
		ctx.moveTo(833, 207);
		ctx.lineTo(833, 217);
		ctx.stroke();

		// A small spark on the pantograph.
		ctx.strokeStyle = 'rgba(255,240,150,0.95)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(398, 8);
		ctx.lineTo(404, 4);
		ctx.lineTo(400, 3);
		ctx.lineTo(406, 2);
		ctx.stroke();
	}

	ctx.restore();
}

export function drawRealMetroTrain(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealMetroTrainLevel(ctx, x, y, scale, 5);
}
