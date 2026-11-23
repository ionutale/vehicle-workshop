/**
 * Quad bike (four-wheeler ATV) art, cut into the same five-piece kit as the rest of the
 * realistic fleet. Front faces left: a red utility quad on chunky knobbly tyres with a
 * charcoal saddle, a compact T-bar handlebar, bulging mudguards over both axles, a
 * headlight in the nose and the naming cue: a flat front rack over the front mudguard and
 * a charcoal cargo rack over the rear fender.
 *
 * The front rack is a fitting of the body mask; the rear rack is the cargo part, kept clear
 * of the saddle so the two pieces never share pixels. Level 5 adds the picture-book finish:
 * paint grain, glints, hub hardware, rack and fender sheen, mud and exhaust.
 */

import { CHROME, INK, STEEL, circle, line, rect, shape, wheel } from './realKit';

const RED = '#E63946';
const RED_DARK = '#C1121F';
const CHARCOAL = '#2B2D42';
const CHARCOAL_L = '#3D4159';
const LAMP = '#FFF1BE';
const AMBER = '#F4A259';
const TAIL = '#FF6B6B';
const SKID = '#20222F';

/** Shell: fenders, tank, footboard mass, steering column and T-bar in one silhouette. */
const SHELL =
	'M76,208 L76,196 Q76,188 90,186 L158,186 Q172,185 176,196 L182,204 Q186,196 196,194 L202,194 L202,170 L196,172 Q189,173 188,169 Q187,164 194,163 L213,151 Q219,150 220,155 Q221,160 214,161 L209,162 L209,196 Q224,198 240,197 L262,199 Q268,200 270,205 L354,200 L360,190 L362,186 L436,186 Q454,186 454,200 Q454,216 438,222 L372,228 L354,234 L348,242 L210,242 L198,234 L94,228 Q80,226 78,216 Z';

/** Front rack: a flat deck on two legs, clear of the mudguard crown. */
const FRONT_RACK =
	'M106,174 L180,174 L180,182 L162,182 L162,186 L152,186 L152,182 L118,182 L118,186 L108,186 L108,182 L106,182 Z';

/** Rear cargo rack: the cargo part, its deck and legs sit above the rear fender. */
const REAR_RACK =
	'M362,174 L452,174 L452,182 L448,182 L448,186 L438,186 L438,182 L382,182 L382,186 L372,186 L372,182 L362,182 Z';

/** Handlebar silhouette: filled as one shape so no shell red shows through the tube. */
const BAR =
	'M202,170 L196,172 Q189,173 188,169 Q187,164 194,163 L213,151 Q219,150 220,155 Q221,160 214,161 L209,162 L209,194 L202,194 Z';
/** Saddle: charcoal seat pan that overhangs the tank and wraps the rear body. */
const SEAT =
	'M276,202 L276,196 Q276,186 286,180 L296,172 Q304,167 312,166 L334,166 Q342,166 345,174 L346,188 L346,202 Z';

const WHEEL_L = { x: 130, y: 236, r: 30 };
const WHEEL_R = { x: 400, y: 236, r: 30 };
/** Mudguard opening: 3.5px clear of the tyre so the body mask never holds a wheel disc. */
const ARCH_R = 33.5;

/** Rubber lip of the mudguard opening: dark trim and an ink edge, drawn at every level. */
function drawArch(ctx: CanvasRenderingContext2D, cx: number): void {
	ctx.strokeStyle = CHARCOAL;
	ctx.lineWidth = 4.4;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, 32, Math.PI * 1.02, Math.PI * 1.98);
	ctx.stroke();

	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH_R + 0.9, Math.PI * 1.02, Math.PI * 1.98);
	ctx.stroke();
}

/** Red-dark lip hugging the mudguard opening, plus a shade just inside it. */
function fenderLip(ctx: CanvasRenderingContext2D, cx: number): void {
	ctx.strokeStyle = RED_DARK;
	ctx.lineWidth = 4.6;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH_R + 4.1, Math.PI * 1.05, Math.PI * 1.95);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(20,12,26,0.22)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH_R + 2.1, Math.PI * 1.05, Math.PI * 1.95);
	ctx.stroke();
}

/** Flat steel cargo deck: rail, mesh grooves and the two legs, all inside the mask. */
function drawRack(
	ctx: CanvasRenderingContext2D,
	path: string,
	left: number,
	right: number,
	top: number,
	bottom: number,
	legs: number[]
): void {
	shape(ctx, path, CHARCOAL, 2.2);

	// Top rail and its lit lip.
	line(ctx, left + 2.5, top + 2, right - 2.5, top + 2, CHARCOAL_L, 2.4);
	line(ctx, left + 3, top + 1, right - 3, top + 1, 'rgba(255,255,255,0.3)', 0.9);

	// Mesh grooves across the deck.
	for (let bx = left + 6; bx <= right - 5; bx += 9) {
		line(ctx, bx, top + 4, bx, bottom - 4, 'rgba(20,12,26,0.4)', 1);
	}

	// Leg shading so the frame reads as standing on the fender.
	for (const leg of legs) {
		line(ctx, leg + 3, top + 6, leg + 3, bottom - 1, 'rgba(20,12,26,0.35)', 1.4);
		line(ctx, leg - 3, top + 6, leg - 3, bottom - 1, 'rgba(255,255,255,0.12)', 1);
	}

	line(ctx, left + 2, bottom - 2.6, right - 2, bottom - 2.6, 'rgba(20,12,26,0.4)', 1.1);
}

/** The saddle, drawn over the tank rail. */
function drawSeat(ctx: CanvasRenderingContext2D): void {
	shape(ctx, SEAT, CHARCOAL, 2.4);
	line(ctx, 284, 181, 340, 178, CHARCOAL_L, 2);
	line(ctx, 286, 192, 346, 190, 'rgba(20,12,26,0.45)', 1.4);
	line(ctx, 290, 198, 345, 197, 'rgba(255,255,255,0.1)', 1.2);
}

/** Handlebar: one charcoal shape with rubber grips, no thin tube over shell red. */
function drawBar(ctx: CanvasRenderingContext2D): void {
	ctx.fillStyle = CHARCOAL;
	ctx.fill(new Path2D(BAR));

	// Lit crown along the bar and the column.
	line(ctx, 196, 165.6, 211, 154.6, 'rgba(255,255,255,0.24)', 1.2);
	line(ctx, 203.4, 172, 203.4, 192, 'rgba(255,255,255,0.14)', 1);

	rect(ctx, 189, 164, 9, 8, CHARCOAL_L, 3, 1.6);
	rect(ctx, 212, 152, 8, 7, CHARCOAL_L, 3, 1.6);
	line(ctx, 191, 166.6, 196, 165.6, 'rgba(255,255,255,0.3)', 0.9);
	line(ctx, 191, 169, 196, 168, 'rgba(255,255,255,0.16)', 0.9);
	line(ctx, 213, 154.4, 217, 153.6, 'rgba(255,255,255,0.3)', 0.9);
}

/** Engine block in the frame bay, with cooling fins and a chrome head. */
function drawEngine(ctx: CanvasRenderingContext2D): void {
	rect(ctx, 294, 214, 36, 20, CHARCOAL_L, 4, 2.2);
	for (let i = 0; i < 3; i++) {
		line(ctx, 299, 219 + i * 5, 325, 219 + i * 5, CHARCOAL, 1.8);
	}
	rect(ctx, 296, 211, 32, 5, STEEL, 2, 1.4);
	ctx.save();
	ctx.beginPath();
	ctx.rect(294, 214, 36, 20);
	ctx.clip();
	const block = ctx.createLinearGradient(0, 214, 0, 234);
	block.addColorStop(0, 'rgba(255,255,255,0.14)');
	block.addColorStop(1, 'rgba(0,0,0,0.3)');
	ctx.fillStyle = block;
	ctx.fillRect(294, 214, 36, 20);
	ctx.restore();
}

/** Footboards either side of the engine, with a short frame rail between them. */
function drawFootboards(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	rect(ctx, 262, 230, 82, 4, CHARCOAL, 1, 1.4);
	rect(ctx, 198, 228, 64, 6, STEEL, 2, 1.6);
	rect(ctx, 344, 228, 22, 6, STEEL, 2, 1.6);
	if (fitted) {
		rect(ctx, 252, 231, 14, 4, CHROME, 2, 1.3);
		rect(ctx, 348, 231, 12, 4, CHROME, 2, 1.3);
		line(ctx, 201, 230, 251, 230, 'rgba(255,255,255,0.32)', 1.1);
		line(ctx, 347, 230, 363, 230, 'rgba(255,255,255,0.32)', 1.1);
	}
}

/** Shade the saddle only: the racks are open frames over the fender. */
function shadePanels(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SEAT));
	const seatTone = ctx.createLinearGradient(0, 166, 0, 202);
	seatTone.addColorStop(0, 'rgba(255,255,255,0.24)');
	seatTone.addColorStop(0.55, 'rgba(255,255,255,0.02)');
	seatTone.addColorStop(1, 'rgba(0,0,0,0.42)');
	ctx.fillStyle = seatTone;
	ctx.fillRect(272, 162, 76, 44);
	ctx.restore();
}

/** Deterministic picture-book grain, kept off the tyres. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL), 'evenodd');
	let seed = 47;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	const onWheel = (px: number, py: number): boolean =>
		Math.hypot(px - WHEEL_L.x, py - WHEEL_L.y) < ARCH_R + 1 ||
		Math.hypot(px - WHEEL_R.x, py - WHEEL_R.y) < ARCH_R + 1;

	ctx.fillStyle = INK;
	for (let i = 0; i < 220; i++) {
		const px = 74 + rnd() * 382;
		const py = 144 + rnd() * 100;
		if (onWheel(px, py)) continue;
		ctx.globalAlpha = 0.06 + rnd() * 0.05;
		const size = 1.2 + rnd() * 1.4;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	ctx.fillStyle = '#FFF1E6';
	for (let i = 0; i < 75; i++) {
		const px = 74 + rnd() * 382;
		const py = 144 + rnd() * 60;
		if (onWheel(px, py)) continue;
		ctx.globalAlpha = 0.09 + rnd() * 0.08;
		ctx.fillRect(px, py, 1 + rnd() * 1.2, 1 + rnd() * 1.2);
	}
	ctx.restore();
}

/** Machined hub trim that survives the game scale. */
function hubDetail(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.68)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 1.02, Math.PI * 1.52);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(20,12,26,0.28)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.4, Math.PI * 0.06, Math.PI * 0.44);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(58,39,27,0.22)';
	ctx.lineWidth = 1.4;
	for (const a of [Math.PI * 0.32, Math.PI * 1.04, Math.PI * 1.74]) {
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * r * 0.12, cy + Math.sin(a) * r * 0.12);
		ctx.lineTo(cx + Math.cos(a) * r * 0.29, cy + Math.sin(a) * r * 0.29);
		ctx.stroke();
	}

	ctx.fillStyle = 'rgba(255,255,255,0.82)';
	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2;
		ctx.beginPath();
		ctx.arc(cx + Math.cos(a) * r * 0.22, cy + Math.sin(a) * r * 0.22, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}
	circle(ctx, cx, cy, r * 0.09, '#DDE4EC', 0.6);
}

/** Level-5 fender sheen: a lit crown arc and a turning shade, clipped to the shell. */
function fenderSheen(ctx: CanvasRenderingContext2D, cx: number): void {
	ctx.save();
	ctx.clip(new Path2D(SHELL));

	ctx.strokeStyle = 'rgba(255,255,255,0.42)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH_R + 7.4, Math.PI * 1.08, Math.PI * 1.46);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(20,12,26,0.2)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH_R + 3.2, Math.PI * 1.56, Math.PI * 1.88);
	ctx.stroke();
	ctx.restore();
}

/** Level-5 rack sheen: painted-steel gradient across the deck and a row of brushed streaks. */
function rackSheen(
	ctx: CanvasRenderingContext2D,
	path: string,
	left: number,
	right: number,
	top: number,
	bottom: number
): void {
	ctx.save();
	ctx.clip(new Path2D(path));

	const sheen = ctx.createLinearGradient(0, top, 0, bottom);
	sheen.addColorStop(0, 'rgba(255,255,255,0.26)');
	sheen.addColorStop(0.45, 'rgba(255,255,255,0.04)');
	sheen.addColorStop(1, 'rgba(20,12,26,0.2)');
	ctx.fillStyle = sheen;
	ctx.fillRect(left, top, right - left, bottom - top);

	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1;
	for (let bx = left + 8; bx <= right - 6; bx += 18) {
		ctx.beginPath();
		ctx.moveTo(bx, top + 3.4);
		ctx.lineTo(bx + 7, top + 3.4);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(20,12,26,0.26)';
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(left + 2, bottom - 3.2);
	ctx.lineTo(right - 2, bottom - 3.2);
	ctx.stroke();
	ctx.restore();
}

/** A four-point sparkle. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.92)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(x - size, y);
	ctx.lineTo(x + size, y);
	ctx.moveTo(x, y - size);
	ctx.lineTo(x, y + size);
	ctx.stroke();

	const d = size * 0.55;
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(x - d, y - d);
	ctx.lineTo(x + d, y + d);
	ctx.moveTo(x - d, y + d);
	ctx.lineTo(x + d, y - d);
	ctx.stroke();

	ctx.fillStyle = '#FFF6E4';
	ctx.beginPath();
	ctx.arc(x, y, 1.6, 0, Math.PI * 2);
	ctx.fill();
}

export function drawRealQuadBikeLevel(
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
		ctx.ellipse(265, 275, 218, 8, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Body shell.
	shape(ctx, SHELL, RED);

	// Livery: a red-dark stripe along each mudguard.
	ctx.save();
	ctx.clip(new Path2D(SHELL), 'nonzero');
	ctx.fillStyle = RED_DARK;
	ctx.fillRect(186, 212, 40, 5);
	ctx.fillRect(384, 208, 42, 5);
	ctx.fillStyle = 'rgba(255,255,255,0.12)';
	ctx.fillRect(186, 210.6, 40, 1.4);
	ctx.fillRect(384, 206.6, 42, 1.4);

	// Dark frame bay between the mudguards: the quad's middle is frame, not bodywork.
	ctx.fillStyle = CHARCOAL;
	ctx.beginPath();
	ctx.moveTo(190, 210);
	ctx.lineTo(252, 210);
	ctx.lineTo(264, 203);
	ctx.lineTo(350, 203);
	ctx.lineTo(350, 244);
	ctx.lineTo(196, 244);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = CHARCOAL_L;
	ctx.fillRect(198, 216, 152, 2);
	ctx.fillRect(198, 220, 58, 1.6);
	ctx.restore();

	// Skid plate under the frame, then the engine, boards and racks.
	rect(ctx, 236, 236, 84, 6, SKID, 3, 2);
	drawFootboards(ctx, fitted);
	drawEngine(ctx);
	drawArch(ctx, WHEEL_L.x);
	drawArch(ctx, WHEEL_R.x);
	drawRack(ctx, FRONT_RACK, 106, 180, 174, 186, [113, 157]);
	drawRack(ctx, REAR_RACK, 362, 452, 174, 186, [377, 443]);
	drawSeat(ctx);
	drawBar(ctx);

	if (shaded) {
		// Body paint: crown light falling into the low-body shade.
		ctx.save();
		ctx.clip(new Path2D(SHELL), 'nonzero');
		const paint = ctx.createLinearGradient(0, 146, 0, 243);
		paint.addColorStop(0, 'rgba(255,255,255,0.3)');
		paint.addColorStop(0.45, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(20,12,26,0.26)');
		ctx.fillStyle = paint;
		ctx.fillRect(70, 142, 392, 108);

		// A soft shade under the saddle and along the footboard.
		ctx.fillStyle = 'rgba(20,12,26,0.16)';
		ctx.fillRect(266, 200, 88, 6);
		ctx.fillStyle = 'rgba(20,12,26,0.12)';
		ctx.fillRect(198, 234, 168, 6);
		ctx.restore();

		shadePanels(ctx);

		// Tank crease behind the steering column.
		line(ctx, 214, 198, 258, 200, 'rgba(58,39,27,0.28)', 1.6);
		line(ctx, 214, 195.6, 258, 197.6, 'rgba(255,255,255,0.24)', 1.2);
	}

	if (fitted) {
		// Mudguard lips over both tyres.
		fenderLip(ctx, WHEEL_L.x);
		fenderLip(ctx, WHEEL_R.x);

		// Front bumper and a single brush-guard tube across the nose.
		line(ctx, 82, 192, 82, 212, INK, 6);
		line(ctx, 82, 192, 82, 212, CHROME, 3.4);
		line(ctx, 76, 214, 96, 214, INK, 5);
		line(ctx, 76, 214, 96, 214, CHROME, 2.6);
		circle(ctx, 88, 198, 7.5, CHROME, 2.2);
		circle(ctx, 88, 198, 5.4, LAMP, 1.6);

		// Nose vent and the tail lamp on the rear fender.
		rect(ctx, 77, 202, 7, 9, CHARCOAL_L, 1.5, 1.4);
		rect(ctx, 439, 194, 11, 13, TAIL, 2, 2);
		rect(ctx, 440, 195, 9, 5, '#FFB3B3', 1.5, 1);

		// Rack leg bolts.
		circle(ctx, 113, 184, 1.3, CHROME, 0.7);
		circle(ctx, 157, 184, 1.3, CHROME, 0.7);
		circle(ctx, 377, 184, 1.3, CHROME, 0.7);
		circle(ctx, 443, 184, 1.3, CHROME, 0.7);

		// Tank filler cap and the rear grab rail.
		circle(ctx, 250, 200, 3.6, CHROME, 1.5);
		line(ctx, 422, 184.4, 448, 184.4, CHROME, 3);
		line(ctx, 422, 187.4, 448, 187.4, 'rgba(20,12,26,0.3)', 1.4);

		// Exhaust pipe.
		line(ctx, 332, 226, 366, 232, INK, 6);
		line(ctx, 332, 226, 366, 232, STEEL, 3.6);
		circle(ctx, 368, 232, 3.2, CHROME, 1.5);
	}

	// Both wheels share the one wheel part; the rear tile is the front mirrored.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r, finish);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r, finish);

	if (lit) {
		// Rim light along the rack rails, tank rail and the saddle crest.
		line(ctx, 108, 175, 177, 175, 'rgba(255,255,255,0.45)', 1.6);
		line(ctx, 364, 175, 449, 175, 'rgba(255,255,255,0.45)', 1.6);
		line(ctx, 268, 196, 252, 195.4, 'rgba(255,255,255,0.4)', 1.4);
		line(ctx, 300, 167, 332, 166.4, 'rgba(255,255,255,0.3)', 1.6);
		line(ctx, 214, 153, 197, 165, 'rgba(255,255,255,0.3)', 1.2);

		// Headlight glow on the nose.
		const glow = ctx.createRadialGradient(88, 200, 1, 88, 200, 24);
		glow.addColorStop(0, 'rgba(255,240,150,0.62)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(88, 200, 24, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the knobbly tyres.
		ctx.save();
		ctx.globalAlpha = 0.22;
		ctx.fillStyle = INK;
		for (const at of [WHEEL_L, WHEEL_R]) {
			ctx.beginPath();
			ctx.ellipse(at.x, 268, 21, 4, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Painted-steel sheen over both rack decks and lit crowns on the mudguards.
		rackSheen(ctx, FRONT_RACK, 106, 180, 174, 186);
		rackSheen(ctx, REAR_RACK, 362, 452, 174, 186);
		fenderSheen(ctx, WHEEL_L.x);
		fenderSheen(ctx, WHEEL_R.x);

		// Paint, rack and lamp glints, clear of the tyre crowns.
		glint(ctx, 148, 191, 4.2);
		glint(ctx, 246, 198, 3);
		glint(ctx, 428, 196, 3.2);
		glint(ctx, 412, 174, 2.8);
		glint(ctx, 112, 202, 2.2);
		glint(ctx, 88, 197, 2.4);

		// Hub hardware on both wheels.
		hubDetail(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubDetail(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Mud thrown up the mudguard skirts and the tyre walls.
		ctx.save();
		ctx.fillStyle = 'rgba(43,45,66,0.5)';
		for (const [mx, my, mr] of [
			[112, 219, 1.7],
			[150, 214, 1.4],
			[384, 214, 1.6],
			[356, 222, 1.3],
			[368, 210, 1.2],
			[148, 254, 1.5],
			[418, 252, 1.4]
		]) {
			ctx.beginPath();
			ctx.arc(mx, my, mr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Exhaust puff drifting off the tailpipe.
		ctx.save();
		ctx.fillStyle = 'rgba(120,116,110,0.16)';
		ctx.beginPath();
		ctx.arc(372, 231, 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.7;
		ctx.beginPath();
		ctx.arc(380, 225, 8, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.45;
		ctx.beginPath();
		ctx.arc(388, 218, 10, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Chalky scuffs on the rack decks.
		ctx.save();
		ctx.strokeStyle = 'rgba(255,255,255,0.22)';
		ctx.lineWidth = 1.2;
		for (const [sx, sy, ex, ey] of [
			[110, 178, 156, 178],
			[368, 178, 440, 178]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();
		}
		ctx.restore();

		// Amber side marker on the rear fender.
		circle(ctx, 420, 204, 2.4, AMBER, 1);
	}

	ctx.restore();
}

export function drawRealQuadBike(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealQuadBikeLevel(ctx, x, y, scale, 5);
}
