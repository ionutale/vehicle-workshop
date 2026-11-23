/**
 * Wheel loader art, cut into the same five-piece kit as the other realistic works machines.
 * A yellow articulated loader facing left: a big front bucket carried on two deep lift arms,
 * a glazed cab over the articulation joint, a sloped engine hood and counterweight behind it,
 * and a beacon and work lamps on the roof. The bucket is the cargo piece, the two wheels are
 * one mirrored tile, so the whole machine is body + glass + bucket + wheel.
 *
 * Geometry notes:
 *  - Art box 760 x 310, road at 278, wheels at (160, 236) and (620, 236), r 42.
 *  - The front wheel sits between the bucket and the front frame, under the lift arm; the
 *    rear wheel is tucked under a fender arch cut from the body silhouette.
 *  - The body mask is a single connected outline (arms, frame, cab, hood, counterweight,
 *    beacon, roof lamp, exhaust) with no wheel circles and no overlapping subpaths.
 *
 * Level 4 is the production target: shaded, fully fitted and lit with a cast shadow,
 * contact patches, rim light and the work-lamp and beacon glow. The level-5 finish (paint
 * grain, bucket sheen, glints, hub hardware, exhaust puff) stays behind `finish`.
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

const YELLOW = '#E9C46A';
const TEAL = '#264653';
const TEAL_DARK = '#1A333D';
const SLATE = '#3D4451';
const SLATE_DARK = '#282E39';
const CREAM = '#FFF6E1';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** Art box 760 x 310, road at 278. Front (bucket and arms) faces left. */
const WHEEL_L = { x: 160, y: 236, r: 42 };
const WHEEL_R = { x: 620, y: 236, r: 42 };

/**
 * One connected silhouette, walked clockwise from the lift-arm tip:
 * arm top -> cab front and roof -> cab rear -> sloped engine hood -> counterweight ->
 * tail -> deck floor -> rear fender arch -> front frame nose -> arm underside -> arm tip.
 * The rear arch is cut with quadratics, never a wheel circle.
 */
const BODY = [
	'M118,160',
	'L300,144',
	'L308,138',
	'L318,106',
	'Q322,100 330,100',
	'L430,100',
	'Q440,100 440,110',
	'L440,152',
	'L520,152',
	'L648,176',
	'L660,144',
	'L716,144',
	'Q730,144 730,156',
	'L730,240',
	'Q730,252 718,252',
	'L684,252',
	'L684,248',
	'Q684,184 620,184',
	'Q556,184 556,248',
	'L556,252',
	'L224,252',
	'L224,200',
	'L118,182',
	'Z'
].join(' ');

/** Amber beacon on the cab roof, touching the roof line at y 100. */
const BEACON = 'M396,100 L396,86 Q396,82 401,82 L409,82 Q414,82 414,86 L414,100 Z';

/** Roof work-lamp pod on the front of the cab roof. */
const ROOF_LAMP = 'M322,100 L322,90 Q322,86 327,86 L345,86 Q350,86 350,90 L350,100 Z';

/** Exhaust stack behind the cab, sitting on the hood line at y 152. */
const EXHAUST = 'M470,152 L470,118 L486,118 L486,152 Z';

/** Steel axle stub that ties the front wheel to the frame nose. */
const AXLE = 'M204,222 L224,222 L224,234 L204,234 Z';

/** Body cut-out: shell plus the fittings that only touch it, never overlap it. */
const BODY_MASK = `${BODY} ${BEACON} ${ROOF_LAMP} ${EXHAUST} ${AXLE}`;

/** The scoop: back wall, heel, cutting edge and the open mouth line to the top. */
const BUCKET_MASK =
	'M118,156 L118,242 Q118,262 100,268 L52,274 Q24,276 12,264 Q6,256 8,246 L16,190 Z';

/** Narrow raked screen and the big side pane: two disjoint glass areas. */
const WINDSCREEN = 'M314,134 L324,108 L336,108 L336,134 Z';
const SIDE_GLASS = 'M346,108 L420,108 Q428,108 428,116 L428,182 Q428,190 420,190 L346,190 Z';
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Rear fender lip, drawn just inside the body arch and just outside the tyre. */
const ARCH_R = 49;

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
	glass.addColorStop(0, 'rgba(255,255,255,0.6)');
	glass.addColorStop(0.48, 'rgba(255,255,255,0.05)');
	glass.addColorStop(1, 'rgba(78,158,204,0.28)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** A four-point sparkle: halo, long cross, short diagonals and a warm core. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
	ctx.save();
	const halo = ctx.createRadialGradient(x, y, 0.4, x, y, size * 2.4);
	halo.addColorStop(0, 'rgba(255,255,255,0.3)');
	halo.addColorStop(0.45, 'rgba(255,255,255,0.09)');
	halo.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = halo;
	ctx.beginPath();
	ctx.arc(x, y, size * 2.4, 0, Math.PI * 2);
	ctx.fill();

	ctx.strokeStyle = 'rgba(255,255,255,0.94)';
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
	ctx.restore();
}

/**
 * Picture-book hub: bright machined rim, six bolts with specular pips, the dish shadow
 * and a polished centre cap. Marked up symmetrically so the flipped rear wheel matches.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 2.4;
	for (const [from, to] of [
		[Math.PI * 1.08, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.92]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.86, from, to);
		ctx.stroke();
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.5, CHROME, 1.2);
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.beginPath();
		ctx.arc(bx, by - 0.9, 0.9, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.strokeStyle = 'rgba(58,39,27,0.26)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.44, 0.18 * Math.PI, 0.82 * Math.PI);
	ctx.stroke();
	circle(ctx, x, y, r * 0.16, '#E8EDF4', 1.3);
	ctx.strokeStyle = 'rgba(255,255,255,0.9)';
	ctx.lineWidth = 1.3;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.12, Math.PI * 1.06, Math.PI * 1.6);
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
	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(x, y - r * 0.58, 0.9, 0, Math.PI * 2);
	ctx.fill();
	line(ctx, x, y - r * 0.53, x, y - r * 0.64, CHROME, 2);
}

/**
 * Deterministic picture-book grain over painted panels only. The body is restricted first,
 * then glass and both tyres are punched out with evenodd.
 */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${BEACON} ${ROOF_LAMP} ${EXHAUST} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;

	ctx.save();
	ctx.clip(new Path2D(BODY_MASK));
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');

	let seed = 83;
	const rand = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 430; i++) {
		const px = 112 + rand() * 620;
		const py = 78 + rand() * 172;
		const size = 1.1 + rand() * 1.2;
		ctx.globalAlpha = 0.07 + rand() * 0.07;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 190; i++) {
		const px = 112 + rand() * 620;
		const py = 78 + rand() * 172;
		const size = 0.9 + rand() * 0.9;
		ctx.globalAlpha = 0.14 + rand() * 0.11;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 80; i++) {
		const px = 112 + rand() * 620;
		const py = 80 + rand() * 170;
		const size = 0.6 + rand() * 0.5;
		ctx.globalAlpha = 0.08 + rand() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush strokes along the hood, arm, skirt and counterweight.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	for (const [sx, sy, ex, ey] of [
		[140, 158, 292, 151],
		[238, 216, 300, 214],
		[340, 120, 430, 118],
		[462, 156, 530, 157],
		[560, 162, 640, 172],
		[686, 176, 722, 178],
		[244, 236, 420, 234]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();

	// A softer pass over the bucket shell.
	ctx.save();
	ctx.clip(new Path2D(BUCKET_MASK));
	ctx.fillStyle = INK;
	ctx.globalAlpha = 0.08;
	for (let i = 0; i < 70; i++) {
		const px = 12 + rand() * 104;
		const py = 140 + rand() * 130;
		ctx.fillRect(px, py, 1.2 + rand() * 1.2, 1.2 + rand() * 1.2);
	}
	ctx.globalAlpha = 0.12;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.4;
	for (const [sx, sy, ex, ey] of [
		[24, 190, 110, 178],
		[28, 216, 108, 206],
		[34, 244, 102, 236]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Bucket face sheen and a lit, worn cutting edge. */
function bucketSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(BUCKET_MASK));

	const face = ctx.createLinearGradient(12, 150, 112, 270);
	face.addColorStop(0, 'rgba(255,255,255,0.28)');
	face.addColorStop(0.4, 'rgba(255,255,255,0.02)');
	face.addColorStop(1, 'rgba(58,39,27,0.2)');
	ctx.fillStyle = face;
	ctx.fillRect(6, 140, 122, 140);

	line(ctx, 18, 194, 24, 250, 'rgba(255,255,255,0.32)', 2);
	line(ctx, 28, 192, 34, 248, 'rgba(255,255,255,0.14)', 1.4);

	const edge = ctx.createLinearGradient(0, 250, 0, 276);
	edge.addColorStop(0, 'rgba(255,255,255,0.3)');
	edge.addColorStop(0.5, 'rgba(255,255,255,0.04)');
	edge.addColorStop(1, 'rgba(58,39,27,0.22)');
	ctx.fillStyle = edge;
	ctx.fillRect(8, 250, 64, 26);

	ctx.globalAlpha = 0.24;
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 1.2;
	for (const [sx, sy, ex] of [
		[22, 260, 42],
		[30, 266, 50],
		[38, 271, 58]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, sy - 1.6);
		ctx.stroke();
	}

	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[26, 216, 7, 2, 0.36],
		[40, 248, 5, 1.8, 0.3],
		[100, 196, 6, 2, 0.28]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	line(ctx, 23, 200, 114, 163, 'rgba(255,255,255,0.55)', 2.2);
}

/** Level-5 ram polish: barrel gloss, bright chrome rod and the gland collar. */
function ramSheen(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(BODY_MASK));

	// Barrel: warm highlight along the crown, cool shadow under the belly.
	line(ctx, 289, 158.8, 253, 161.8, 'rgba(255,255,255,0.4)', 2);
	line(ctx, 289, 163.2, 253, 166.2, 'rgba(0,0,0,0.26)', 2);
	line(ctx, 266, 156.1, 254, 157.2, 'rgba(255,255,255,0.5)', 1.2);

	// Polished chrome rod with a darker reflected underside.
	line(ctx, 251, 162.4, 152, 166.9, 'rgba(255,255,255,0.78)', 1.4);
	line(ctx, 251, 165.6, 152, 170.1, 'rgba(0,0,0,0.22)', 1);

	// Gland collar at the barrel mouth and the rod cap highlight at the arm tip.
	line(ctx, 252.5, 160.3, 252.5, 167.3, STEEL, 3.4);
	line(ctx, 251.6, 160.8, 251.6, 166.8, 'rgba(255,255,255,0.5)', 1.2);
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(150, 169, 3.2, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();
	ctx.restore();
}

/** Working marks: chips, lamp pips, soot and the exhaust puff. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[403.4, 89.2, 1.2],
		[333.8, 92.4, 1.3],
		[722, 199, 0.9]
	] as const) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	ctx.save();
	ctx.clip(new Path2D(`${BEACON} ${ROOF_LAMP}`));
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.moveTo(399, 84);
	ctx.lineTo(399, 98);
	ctx.stroke();
	ctx.restore();

	// Chips on the frame, hood, arm and counterweight.
	ctx.save();
	ctx.fillStyle = CREAM;
	for (const [chipX, chipY, w, h, alpha] of [
		[236, 226, 9, 2, 0.36],
		[272, 240, 6, 2, 0.3],
		[300, 214, 10, 2, 0.32],
		[518, 158, 8, 2, 0.28],
		[690, 234, 6, 2.2, 0.34],
		[132, 166, 7, 2, 0.3],
		[402, 236, 5, 1.8, 0.24]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.fillRect(chipX, chipY, w, h);
	}
	ctx.restore();

	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(478, 121, 8, 3.2, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// Soft exhaust puff above the stack.
	ctx.save();
	ctx.fillStyle = '#D5DCE5';
	for (const [px, py, pr, alpha] of [
		[494, 104, 9, 0.16],
		[508, 90, 11, 0.13],
		[522, 76, 12, 0.1],
		[486, 110, 4.5, 0.2]
	] as const) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

/** Shell, teal chassis bands and the fixed machine fittings. */
function drawShell(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, BODY_MASK, YELLOW, 3);

	ctx.save();
	ctx.clip(new Path2D(BODY_MASK));

	// Teal chassis skirt across both frames, under the cab and the counterweight.
	ctx.fillStyle = TEAL;
	ctx.fillRect(222, 240, 506, 14);
	ctx.fillStyle = 'rgba(0,0,0,0.26)';
	ctx.fillRect(222, 240, 506, 3);

	// Teal stripe along the underside of the lift arm, tying the bucket to the cab.
	ctx.beginPath();
	ctx.moveTo(128, 174);
	ctx.lineTo(298, 192);
	ctx.lineTo(298, 200);
	ctx.lineTo(128, 182);
	ctx.closePath();
	ctx.fillStyle = TEAL;
	ctx.fill();

	// Teal roof cap and the rear cab pillar.
	ctx.fillStyle = TEAL;
	ctx.fillRect(330, 100, 100, 4);
	ctx.fillStyle = TEAL_DARK;
	ctx.fillRect(436, 110, 4, 142);

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 96, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.36)');
		paint.addColorStop(0.34, 'rgba(255,255,255,0.05)');
		paint.addColorStop(0.82, 'rgba(150,110,30,0.1)');
		paint.addColorStop(1, 'rgba(58,39,27,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(110, 78, 626, 178);
	}
	ctx.restore();

	// Rear fender lip, just inside the body arch.
	ctx.strokeStyle = 'rgba(0,0,0,0.3)';
	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.arc(WHEEL_R.x, WHEEL_R.y, ARCH_R, Math.PI * 1.04, Math.PI * 1.96);
	ctx.stroke();
	if (shaded) {
		ctx.strokeStyle = 'rgba(255,255,255,0.2)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(WHEEL_R.x, WHEEL_R.y, ARCH_R + 3.4, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	// Front frame face plate, hose block and steps.
	rect(ctx, 236, 204, 46, 30, TEAL, 4, 2);
	line(ctx, 240, 208, 278, 208, 'rgba(255,255,255,0.2)', 1.4);
	rect(ctx, 242, 214, 18, 10, SLATE, 2, 1.4);
	circle(ctx, 247, 219, 1.8, CHROME, 1);
	circle(ctx, 256, 219, 1.8, CHROME, 1);
	rect(ctx, 240, 240, 38, 4, STEEL, 1.5, 1.4);
	rect(ctx, 248, 246, 38, 4, STEEL, 1.5, 1.4);

	// Front axle stub reaching out to the tyre.
	shape(ctx, AXLE, SLATE, 2.2);
	line(ctx, 206, 224.4, 222, 224.4, 'rgba(255,255,255,0.3)', 1.2);

	// Articulation joint under the cab front: hinge block and pin.
	rect(ctx, 292, 204, 18, 44, TEAL_DARK, 3, 1.8);
	line(ctx, 302, 204, 302, 248, 'rgba(255,255,255,0.18)', 1.6);
	circle(ctx, 302, 226, 8, STEEL, 2);
	circle(ctx, 302, 226, 3.4, CHROME, 1.2);

	// Lift and tilt cylinder carried along the top of the arm.
	if (fitted) {
		line(ctx, 290, 161, 150, 169, INK, 10);
		line(ctx, 290, 161, 150, 169, STEEL, 7);
		line(ctx, 252, 164, 150, 169, INK, 5);
		line(ctx, 252, 164, 150, 169, CHROME, 3);
		line(ctx, 284, 158.4, 154, 164.6, 'rgba(255,255,255,0.5)', 1.4);
		rect(ctx, 266, 153, 26, 16, SLATE_DARK, 3, 2);
		circle(ctx, 150, 169, 4.4, SLATE, 1.6);
		circle(ctx, 150, 169, 1.8, CHROME, 1);
		for (const boltX of [176, 204, 232]) circle(ctx, boltX, 178, 1.7, CHROME, 0.9);
	}

	// Arm pivot boss at the frame.
	circle(ctx, 280, 168, 11, TEAL_DARK, 2.4);
	circle(ctx, 280, 168, 6, STEEL, 1.8);
	circle(ctx, 280, 168, 2.4, CHROME, 1.2);
	if (fitted) {
		for (let i = 0; i < 4; i++) {
			const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
			circle(ctx, 280 + Math.cos(a) * 8.6, 168 + Math.sin(a) * 8.6, 1.2, CHROME, 0.8);
		}
	}

	// Hood seam, cab rear seam and counterweight step.
	line(ctx, 442, 153.5, 518, 153.5, 'rgba(255,255,255,0.22)', 2);
	line(ctx, 440, 112, 440, 150, 'rgba(58,39,27,0.3)', 2.4);
	line(ctx, 648, 176, 662, 146, 'rgba(255,255,255,0.2)', 1.6);

	// Exhaust stack.
	shape(ctx, EXHAUST, SLATE, 2.4);
	line(ctx, 474, 122, 474, 150, 'rgba(255,255,255,0.3)', 1.6);
	rect(ctx, 470, 118, 16, 4, SLATE_DARK, 1.5, 1.4);

	// Beacon and its base.
	shape(ctx, BEACON, AMBER, 2.2);
	rect(ctx, 394, 98, 22, 3.5, SLATE_DARK, 1.5, 1.6);
	if (fitted) {
		line(ctx, 400, 84, 400, 97, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 410, 85, 409, 97, 'rgba(255,255,255,0.45)', 1.2);
	}

	// Roof work lamp pod.
	shape(ctx, ROOF_LAMP, SLATE, 2.2);
	circle(ctx, 335, 94, 3.8, LAMP, 1.6);
	if (fitted) {
		circle(ctx, 333.8, 92.4, 1.6, '#FFF7CF', 1);
	}

	// Engine louvres and the model plate on the hood flank.
	for (let i = 0; i < 4; i++) {
		line(ctx, 464, 160 + i * 9, 512, 161 + i * 9, 'rgba(58,39,27,0.3)', 2.2);
	}
	rect(ctx, 536, 168, 46, 24, CREAM, 3, 2.2);
	ctx.fillStyle = TEAL;
	ctx.fillRect(538, 186, 42, 5);
	ctx.fillStyle = TEAL_DARK;
	ctx.font = '700 12px ui-rounded, system-ui, sans-serif';
	ctx.fillText('WL', 548, 183);

	// Rear grille, plate and tail lamps on the counterweight.
	rect(ctx, 686, 156, 36, 30, SLATE, 3, 2.2);
	for (let i = 0; i < 3; i++) {
		line(ctx, 690, 162 + i * 8, 718, 162 + i * 8, CHROME, 1.5);
	}
	rect(ctx, 692, 194, 18, 10, CREAM, 1.5, 1.4);
	line(ctx, 695, 198, 707, 198, 'rgba(58,39,27,0.42)', 1);
	rect(ctx, 716, 190, 12, 18, RED, 3, 2);
	rect(ctx, 716, 212, 12, 10, AMBER, 2, 1.8);

	// Rear work lamp on the counterweight shoulder.
	circle(ctx, 700, 150, 4.4, LAMP, 1.6);

	// Cab door panel, below the glass and resting on the skirt.
	rect(ctx, 346, 196, 84, 42, YELLOW, 3, 2.4);
	line(ctx, 350, 200, 426, 200, 'rgba(255,255,255,0.2)', 1.4);
	line(ctx, 346, 196, 346, 238, 'rgba(0,0,0,0.2)', 1.6);
	rect(ctx, 414, 212, 12, 5, CHROME, 2, 1.4);
	rect(ctx, 426, 200, 2.4, 38, SLATE, 1, 1);
	if (fitted) {
		circle(ctx, 428, 204, 1.8, STEEL, 1);
		circle(ctx, 428, 230, 1.8, STEEL, 1);
	}

	// Tread plates at the cab foot.
	rect(ctx, 358, 240, 56, 4, TEAL_DARK, 1.5, 1.4);
	rect(ctx, 366, 246, 56, 4, TEAL_DARK, 1.5, 1.4);
	line(ctx, 360, 241.2, 412, 241.2, 'rgba(255,255,255,0.28)', 1);

	if (fitted) {
		// Cab front pillar, wiper and grab handle.
		line(ctx, 340, 110, 340, 134, SLATE, 2);
		line(ctx, 314, 132, 332, 126, INK, 2.4);
		line(ctx, 432, 194, 432, 230, CHROME, 3);
		circle(ctx, 432, 196, 1.8, STEEL, 1);
		circle(ctx, 432, 228, 1.8, STEEL, 1);

		// Hydraulic hoses tucked along the arm root.
		line(ctx, 302, 150, 302, 178, INK, 4);
		line(ctx, 302, 150, 302, 178, '#2B2D42', 2.4);
		line(ctx, 306, 152, 306, 180, INK, 4);
		line(ctx, 306, 152, 306, 180, '#2B2D42', 2.4);
	}
}

/** The bucket: scoop shading, mouth interior, rim, wear plate, cutting edge and teeth. */
function drawBucket(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, BUCKET_MASK, YELLOW, 3);

	ctx.save();
	ctx.clip(new Path2D(BUCKET_MASK));

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 146, 0, 276);
		paint.addColorStop(0, 'rgba(255,255,255,0.26)');
		paint.addColorStop(0.4, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(58,39,27,0.2)');
		ctx.fillStyle = paint;
		ctx.fillRect(6, 140, 124, 140);
	}

	// Interior of the scoop, a deep band under the open mouth.
	ctx.beginPath();
	ctx.moveTo(114, 160);
	ctx.lineTo(23, 194);
	ctx.lineTo(29, 218);
	ctx.quadraticCurveTo(76, 222, 112, 196);
	ctx.closePath();
	ctx.fillStyle = 'rgba(58,39,27,0.42)';
	ctx.fill();

	if (shaded) {
		const mouth = ctx.createLinearGradient(26, 196, 114, 160);
		mouth.addColorStop(0, 'rgba(58,39,27,0.06)');
		mouth.addColorStop(1, 'rgba(58,39,27,0.3)');
		ctx.fillStyle = mouth;
		ctx.beginPath();
		ctx.moveTo(110, 165);
		ctx.lineTo(26, 195);
		ctx.lineTo(32, 214);
		ctx.quadraticCurveTo(76, 218, 110, 190);
		ctx.closePath();
		ctx.fill();
	}

	// Side-plate seam, a little inside the outer shell.
	ctx.strokeStyle = 'rgba(58,39,27,0.18)';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(110, 164);
	ctx.lineTo(110, 236);
	ctx.quadraticCurveTo(110, 254, 96, 260);
	ctx.lineTo(58, 266);
	ctx.quadraticCurveTo(28, 268, 22, 250);
	ctx.lineTo(24, 198);
	ctx.stroke();

	// Quick-coupler plate on the back wall, where the arms attach.
	rect(ctx, 102, 174, 16, 48, TEAL_DARK, 3, 2);
	circle(ctx, 110, 182, 3.4, CHROME, 1.4);
	circle(ctx, 110, 214, 3.4, CHROME, 1.4);
	line(ctx, 104, 196, 116, 196, 'rgba(255,255,255,0.2)', 1.4);

	// Ribs down the side plate.
	line(ctx, 24, 228, 110, 206, 'rgba(58,39,27,0.26)', 2.4);
	line(ctx, 28, 250, 110, 238, 'rgba(58,39,27,0.26)', 2.4);
	line(ctx, 23, 226, 109, 204, 'rgba(255,255,255,0.14)', 1.4);

	// Steel cutting edge and the wrap-up the front wall.
	ctx.beginPath();
	ctx.moveTo(8, 250);
	ctx.lineTo(18, 244);
	ctx.lineTo(44, 272);
	ctx.lineTo(28, 276);
	ctx.closePath();
	ctx.fillStyle = STEEL;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2;
	ctx.stroke();
	line(ctx, 13, 248, 42, 272, 'rgba(255,255,255,0.35)', 1.6);

	// Wear plate on the front wall.
	ctx.beginPath();
	ctx.moveTo(8, 248);
	ctx.lineTo(18, 198);
	ctx.lineTo(24, 200);
	ctx.lineTo(16, 252);
	ctx.closePath();
	ctx.fillStyle = 'rgba(92,100,114,0.7)';
	ctx.fill();

	// Bucket teeth on the cutting edge.
	for (const [tx, ty] of [
		[10, 256],
		[20, 264],
		[30, 270],
		[40, 274]
	] as const) {
		ctx.beginPath();
		ctx.moveTo(tx, ty);
		ctx.lineTo(tx + 7, ty - 3);
		ctx.lineTo(tx + 4, ty + 8);
		ctx.closePath();
		ctx.fillStyle = STEEL;
		ctx.fill();
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.4;
		ctx.stroke();
	}

	if (fitted) {
		// Rim strip along the open mouth and the back-wall bolts.
		line(ctx, 22, 198, 114, 162, CREAM, 3.2);
		line(ctx, 23, 201, 114, 165, 'rgba(58,39,27,0.25)', 1.4);
		for (const by of [170, 232]) circle(ctx, 112, by, 1.7, CHROME, 0.9);
		circle(ctx, 52, 210, 2.2, CHROME, 1);
		circle(ctx, 48, 234, 2.2, CHROME, 1);
		line(ctx, 38, 256, 58, 266, 'rgba(0,0,0,0.24)', 1.4);
	}

	if (finish) {
		line(ctx, 100, 172, 98, 184, 'rgba(255,255,255,0.2)', 1.2);
	}
	ctx.restore();
}

export function drawRealWheelLoaderLevel(
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
		// Cast shadow: a soft spread plus a tighter core under the working axis.
		ctx.save();
		ctx.fillStyle = INK;
		ctx.globalAlpha = 0.17;
		ctx.beginPath();
		ctx.ellipse(369, 278, 352, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalAlpha = 0.09;
		ctx.beginPath();
		ctx.ellipse(369, 275, 268, 6, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	drawShell(ctx, shaded, fitted);

	// Both wheels share the one wheel part; the rear tile is its exact mirror.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	// Bucket drawn over the arm tips, ahead of the front wheel.
	drawBucket(ctx, shaded, fitted, finish);

	// Cab glass, painted over the shaded body so it stays clean.
	shape(ctx, GLASS_MASK, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 314, 108, 22, 26);
		shadeGlass(ctx, SIDE_GLASS, 346, 108, 82, 82);
		line(ctx, 354, 184, 374, 112, 'rgba(255,255,255,0.24)', 2.4);
	}
	if (fitted) {
		line(ctx, 426, 112, 426, 186, 'rgba(255,255,255,0.32)', 2);
		line(ctx, 428, 112, 428, 186, INK, 1.6);
		line(ctx, 332, 134, 338, 134, 'rgba(58,39,27,0.4)', 1.6);
	}

	if (lit) {
		// Rim light: arm chord, cab roof, hood, counterweight and bucket mouth.
		ctx.strokeStyle = 'rgba(255,255,255,0.56)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(134, 159.5);
		ctx.lineTo(294, 145.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(332, 101);
		ctx.lineTo(428, 101);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.36)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(522, 153);
		ctx.lineTo(644, 175.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(664, 145);
		ctx.lineTo(720, 145);
		ctx.stroke();
		ctx.save();
		ctx.clip(new Path2D(BUCKET_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(23, 199);
		ctx.lineTo(114, 162.5);
		ctx.stroke();
		ctx.restore();

		// Work-lamp glow and beacon flash.
		const lamp = ctx.createRadialGradient(335, 94, 1, 335, 94, 28);
		lamp.addColorStop(0, 'rgba(255,240,150,0.72)');
		lamp.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = lamp;
		ctx.beginPath();
		ctx.arc(335, 94, 28, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(405, 92, 1, 405, 92, 27);
		beacon.addColorStop(0, 'rgba(255,183,3,0.55)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(405, 92, 27, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches: tyre seats and the bucket lip on the road.
		ctx.save();
		ctx.globalAlpha = 0.26;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 277, 30, 6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 0.18;
		ctx.beginPath();
		ctx.ellipse(56, 272, 44, 5, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Sheen down the arm and the lit cab roof.
		ctx.save();
		ctx.clip(new Path2D(BODY_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(134, 158);
		ctx.lineTo(292, 145);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.16)';
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(336, 106);
		ctx.lineTo(424, 106);
		ctx.stroke();
		ctx.restore();

		bucketSheen(ctx);
		ramSheen(ctx);

		// Glass sheen.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(352, 184);
		ctx.lineTo(378, 112);
		ctx.stroke();
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(362, 186);
		ctx.lineTo(386, 120);
		ctx.stroke();
		ctx.restore();

		finishingMarks(ctx);

		glint(ctx, 262, 216, 4.6);
		glint(ctx, 340, 122, 4);
		glint(ctx, 610, 178, 4.2);
		glint(ctx, 700, 166, 3.4);
		glint(ctx, 138, 160, 3.2);
		glint(ctx, 66, 244, 3.6);
		glint(ctx, 274, 232, 3);

		// Hub hardware on both wheels, mirrored for the flipped rear tile.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		ctx.save();
		ctx.translate(WHEEL_L.x + WHEEL_R.x, 0);
		ctx.scale(-1, 1);
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealWheelLoader(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealWheelLoaderLevel(ctx, x, y, scale, 5);
}
