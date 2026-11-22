/**
 * Curtain-side lorry art, cut into the same five-piece kit as the other realistic vehicles.
 * A compact cab-over tractor unit facing left pulls a long curtain-sided trailer: tensioned
 * grey curtain panels with vertical seams and a slight sag, ratchet straps with chrome
 * buckles, a roof rail with tension tabs, twin rear doors with latch rods, blue skirt and
 * livery details, mudguards over both axles and lamps.
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

const BLUE = '#457B9D';
const BLUE_DARK = '#2F5C77';
const BLUE_DEEP = '#24455B';
const GREY = '#CED4DA';
const GREY_LIGHT = '#E4E9ED';
const GREY_DARK = '#AEB9C3';
const CREAM = '#FFF9EC';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/** Art box 800 x 360, road at 272. Front (cab) faces left. */
const SHELL =
	'M22,258 L22,126 Q22,106 40,101 L70,93 Q78,91 86,91 L188,91 L188,78 Q188,74 194,74 L762,74 Q770,74 770,82 L770,262 L196,262 L196,258 Z';

// The spec body mask is this shell plus the mirror head, the front bumper and the rear
// under-run. Every subpath touches the shell only at an edge, so the evenodd clip cannot
// punch a hole.
//   mirror:    M6,108 L22,108 L22,144 L6,144 Z
//   bumper:    M6,240 L22,240 L22,266 L6,266 Z
//   under-run: M770,246 L788,246 L788,264 L770,264 Z

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const WINDSCREEN = pane(30, 112, 92, 64, 8);
const SIDE_GLASS = pane(132, 112, 54, 54, 6);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Cab door: a clean rectangle, clear of every pane. */
const DOOR = { x: 128, y: 182, w: 64, h: 74 };

const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 640, y: 236, r: 36 };

/** Trailer geometry. The roof rail caps the curtain; the deck band and steel rail sit below. */
const CURTAIN_TOP = 84;
const CURTAIN_HEM = 226;
const CURTAIN_SAG = 9;
const CURTAIN_LEFT = 206;
const CURTAIN_RIGHT = 682;
const SEAMS = [360, 522];
const STRAPS = [283, 441, 602];
const REAR_DOOR = { x: 690, y: 86, w: 68, h: 144 };

const BAYS = [
	{ left: CURTAIN_LEFT, right: SEAMS[0] },
	{ left: SEAMS[0], right: SEAMS[1] },
	{ left: SEAMS[1], right: CURTAIN_RIGHT }
];

const bayPath = (left: number, right: number): string =>
	`M${left},${CURTAIN_TOP} L${right},${CURTAIN_TOP} L${right},${CURTAIN_HEM} Q${(left + right) / 2},${CURTAIN_HEM + CURTAIN_SAG} ${left},${CURTAIN_HEM} Z`;

const CURTAIN_MASK = BAYS.map((bay) => bayPath(bay.left, bay.right)).join(' ');

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

/** A filled wheel-arch band sitting just outside the tyre. */
function mudguard(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	r: number,
	band: string
): void {
	ctx.beginPath();
	ctx.arc(cx, cy, r + 12, Math.PI, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = BLUE_DEEP;
	ctx.fill();

	ctx.beginPath();
	ctx.arc(cx, cy, r + 12, Math.PI * 1.02, Math.PI * 1.98);
	ctx.arc(cx, cy, r, Math.PI * 1.98, Math.PI * 1.02, true);
	ctx.closePath();
	ctx.fillStyle = band;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.32)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 7.6, Math.PI * 1.1, Math.PI * 1.9);
	ctx.stroke();
}

/** One curtain bay: flat panel, optional sheen, a seam on the trailing edge and the sag. */
function curtainBay(
	ctx: CanvasRenderingContext2D,
	left: number,
	right: number,
	shaded: boolean
): void {
	const path = new Path2D(bayPath(left, right));
	ctx.fillStyle = GREY;
	ctx.fill(path);

	if (shaded) {
		ctx.save();
		ctx.clip(path);
		const across = ctx.createLinearGradient(left, 0, right, 0);
		across.addColorStop(0, 'rgba(255,255,255,0.44)');
		across.addColorStop(0.2, 'rgba(255,255,255,0.12)');
		across.addColorStop(0.56, 'rgba(255,255,255,0.02)');
		across.addColorStop(0.82, 'rgba(36,69,91,0.09)');
		across.addColorStop(1, 'rgba(36,69,91,0.2)');
		ctx.fillStyle = across;
		ctx.fillRect(left, CURTAIN_TOP, right - left, CURTAIN_HEM - CURTAIN_TOP + CURTAIN_SAG);

		const underRail = ctx.createLinearGradient(0, CURTAIN_TOP, 0, CURTAIN_TOP + 34);
		underRail.addColorStop(0, 'rgba(36,69,91,0.22)');
		underRail.addColorStop(1, 'rgba(36,69,91,0)');
		ctx.fillStyle = underRail;
		ctx.fillRect(left, CURTAIN_TOP, right - left, 34);

		// Waist crease: a long, soft fold across the cloth.
		ctx.strokeStyle = 'rgba(36,69,91,0.13)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(left, 168);
		ctx.quadraticCurveTo((left + right) / 2, 171, right, 168);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.moveTo(left, 166.4);
		ctx.quadraticCurveTo((left + right) / 2, 169.4, right, 166.4);
		ctx.stroke();
		ctx.restore();
	}

	// Trailing seam: a dark fold with a lit edge on the next panel.
	if (right < CURTAIN_RIGHT) {
		line(ctx, right, CURTAIN_TOP, right, CURTAIN_HEM, 'rgba(36,69,91,0.42)', 2.2);
		line(ctx, right + 2, CURTAIN_TOP + 2, right + 2, CURTAIN_HEM, 'rgba(255,255,255,0.55)', 1.2);
	}

	// Hem binding, following the sag.
	ctx.strokeStyle = BLUE_DARK;
	ctx.lineWidth = 7;
	ctx.beginPath();
	ctx.moveTo(left, CURTAIN_HEM);
	ctx.quadraticCurveTo((left + right) / 2, CURTAIN_HEM + CURTAIN_SAG, right, CURTAIN_HEM);
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(left, CURTAIN_HEM - 3);
	ctx.quadraticCurveTo((left + right) / 2, CURTAIN_HEM + CURTAIN_SAG - 3, right, CURTAIN_HEM - 3);
	ctx.stroke();
}

/** A ratchet strap down one bay, ending on the deck band. */
function drawStrap(ctx: CanvasRenderingContext2D, cx: number, fitted: boolean): void {
	const top = CURTAIN_TOP + 3;
	const bottom = CURTAIN_HEM + CURTAIN_SAG + 6;

	shape(
		ctx,
		`M${cx - 4},${top} L${cx + 4},${top} L${cx + 4},${bottom} L${cx - 4},${bottom} Z`,
		BLUE_DEEP,
		1.4
	);
	line(ctx, cx - 1.4, top + 2, cx - 1.4, bottom - 2, 'rgba(255,255,255,0.18)', 1.2);

	if (!fitted) return;

	// Ratchet body with its toothed lever and the loose tail below the hem.
	rect(ctx, cx - 7, 162, 14, 18, CHROME, 2, 2);
	for (let tooth = 0; tooth < 3; tooth++) {
		line(ctx, cx - 4, 167 + tooth * 4, cx + 4, 167 + tooth * 4, 'rgba(58,39,27,0.45)', 1.3);
	}
	line(ctx, cx + 6, 169, cx + 16, 162, INK, 2.6);
	line(ctx, cx + 6, 169, cx + 16, 162, CHROME, 1.5);

	shape(
		ctx,
		`M${cx + 2},${bottom} L${cx + 9},${bottom} L${cx + 7},${bottom + 13} L${cx + 3},${bottom + 13} Z`,
		BLUE_DARK,
		1.2
	);
}

/** Curtain top hooks: the row of little plates that ties the sheet to the roof rail. */
function curtainTabs(ctx: CanvasRenderingContext2D): void {
	for (let tabX = CURTAIN_LEFT + 16; tabX < CURTAIN_RIGHT - 8; tabX += 26) {
		rect(ctx, tabX, CURTAIN_TOP - 1, 5, 6, GREY_DARK, 1, 1.2);
	}
}

/** Twin rear doors: two leaves, edge hinges, latch rods, handles and the plate. */
function rearDoors(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	rect(ctx, REAR_DOOR.x, REAR_DOOR.y, REAR_DOOR.w, REAR_DOOR.h, GREY_DARK, 2.5, 2.6);
	rect(ctx, REAR_DOOR.x + 3, 90, 29, 136, GREY_LIGHT, 1.5, 2);
	rect(ctx, REAR_DOOR.x + 36, 90, 29, 136, GREY, 1.5, 2);
	line(ctx, REAR_DOOR.x + 34, 90, REAR_DOOR.x + 34, 226, 'rgba(36,69,91,0.5)', 2.4);
	line(ctx, REAR_DOOR.x + 35.4, 92, REAR_DOOR.x + 35.4, 224, 'rgba(255,255,255,0.6)', 1.2);
	rect(ctx, REAR_DOOR.x, 214, REAR_DOOR.w, 16, BLUE_DARK, 0, 0);
	line(ctx, REAR_DOOR.x + 2, 216, REAR_DOOR.x + REAR_DOOR.w - 2, 216, 'rgba(255,255,255,0.3)', 1.4);

	if (!fitted) return;

	for (const hy of [100, 128, 156]) {
		rect(ctx, REAR_DOOR.x + 1, hy, 6, 11, STEEL, 1.5, 1.4);
		rect(ctx, REAR_DOOR.x + REAR_DOOR.w - 7, hy, 6, 11, STEEL, 1.5, 1.4);
	}

	for (const rodX of [REAR_DOOR.x + 12, REAR_DOOR.x + 56]) {
		line(ctx, rodX, 94, rodX, 222, INK, 4.6);
		line(ctx, rodX, 94, rodX, 222, CHROME, 3);
		rect(ctx, rodX - 7, 148, 14, 5, STEEL, 1.5, 1.4);
		circle(ctx, rodX, 98, 2.2, CHROME, 1);
	}

	// Rear plate between the rods and the door-edge rub strips.
	rect(ctx, REAR_DOOR.x + 22, 190, 26, 12, CREAM, 1.5, 1.7);
	ctx.fillStyle = BLUE;
	ctx.fillRect(REAR_DOOR.x + 24, 192, 4, 8);
	ctx.fillStyle = INK;
	ctx.fillRect(REAR_DOOR.x + 30, 194, 13, 1.8);
	ctx.fillRect(REAR_DOOR.x + 30, 197.6, 9, 1.8);

	line(ctx, REAR_DOOR.x + 6, 222, REAR_DOOR.x + 6, 228, STEEL, 2);
	line(ctx, REAR_DOOR.x + 62, 222, REAR_DOOR.x + 62, 228, STEEL, 2);
}

/** Tensioned curtain, roof rail and the trailer flank, painted inside the shell clip. */
function drawTrailer(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean
): void {
	// Deck band under the curtains, then the steel underframe with its fittings.
	rect(ctx, 196, 228, 574, 14, BLUE_DARK, 0, 0);
	line(ctx, 198, 229.4, 768, 229.4, 'rgba(255,255,255,0.34)', 1.5);
	rect(ctx, 196, 242, 574, 20, STEEL, 0, 0);
	rect(ctx, 196, 242, 574, 2.6, '#7C8592', 0, 0);
	rect(ctx, 196, 259.4, 574, 2.6, '#474E59', 0, 0);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(196, 242, 574, 20);
		ctx.clip();
		const frame = ctx.createLinearGradient(0, 242, 0, 262);
		frame.addColorStop(0, 'rgba(255,255,255,0.16)');
		frame.addColorStop(1, 'rgba(0,0,0,0.18)');
		ctx.fillStyle = frame;
		ctx.fillRect(196, 242, 574, 20);
		ctx.restore();
	}

	if (fitted) {
		// Fuel tank, battery box, toolbox and the side-guard rails.
		rect(ctx, 214, 244, 74, 16, CHROME, 8, 2.2);
		line(ctx, 226, 245, 226, 259, 'rgba(58,39,27,0.3)', 1.4);
		line(ctx, 268, 245, 268, 259, 'rgba(58,39,27,0.3)', 1.4);
		line(ctx, 220, 247, 282, 247, 'rgba(255,255,255,0.55)', 1.4);

		rect(ctx, 312, 244, 46, 17, BLUE_DEEP, 2, 2);
		rect(ctx, 320, 249, 20, 3, 'rgba(255,255,255,0.22)', 0, 0);

		rect(ctx, 370, 244, 52, 16, STEEL, 2, 2);
		rect(ctx, 394, 248, 10, 4, CHROME, 1, 1.4);

		line(ctx, 438, 249, 582, 249, CHROME, 2.4);
		line(ctx, 438, 256, 582, 256, CHROME, 2.4);
		for (let post = 438; post <= 582; post += 36) {
			line(ctx, post, 248, post, 258, STEEL, 2);
		}
	}

	// Curtain bays, then the straps over them.
	for (const bay of BAYS) curtainBay(ctx, bay.left, bay.right, shaded);
	if (shaded) {
		// Soft tension creases either side of each strap.
		for (const strapX of STRAPS) {
			const crease = ctx.createLinearGradient(strapX - 26, 0, strapX + 26, 0);
			crease.addColorStop(0, 'rgba(36,69,91,0)');
			crease.addColorStop(0.46, 'rgba(36,69,91,0.08)');
			crease.addColorStop(0.55, 'rgba(255,255,255,0.12)');
			crease.addColorStop(1, 'rgba(36,69,91,0)');
			ctx.save();
			ctx.beginPath();
			ctx.rect(strapX - 26, CURTAIN_TOP, 52, CURTAIN_HEM - CURTAIN_TOP + CURTAIN_SAG);
			ctx.clip();
			ctx.fillStyle = crease;
			ctx.fillRect(strapX - 26, CURTAIN_TOP, 52, CURTAIN_HEM - CURTAIN_TOP + CURTAIN_SAG);
			ctx.restore();
		}
	}
	for (const strapX of STRAPS) drawStrap(ctx, strapX, fitted);
	if (fitted) {
		curtainTabs(ctx);

		// Hem buckle row: the little chrome hooks that tension the sheet to the deck.
		for (const bay of BAYS) {
			for (let hookX = bay.left + 20; hookX < bay.right - 10; hookX += 36) {
				rect(ctx, hookX, 234, 5, 5, CHROME, 1, 1.1);
				line(ctx, hookX + 2.5, 236, hookX + 2.5, 239, 'rgba(58,39,27,0.4)', 1);
			}
		}
	}

	// Roof rail over the curtain tops, with its light lip and rear cap.
	rect(ctx, 200, 74, 562, 10, BLUE_DARK, 0, 0);
	rect(ctx, 202, 74, 558, 2.6, GREY_LIGHT, 0, 0);
	line(ctx, 200, 84, 762, 84, 'rgba(36,69,91,0.55)', 1.6);
	rect(ctx, 752, 74, 10, 10, BLUE_DARK, 1, 2);

	// Front and rear corner posts.
	rect(ctx, 196, 84, 12, 144, BLUE_DARK, 0, 2.2);
	line(ctx, 198, 88, 198, 224, 'rgba(255,255,255,0.26)', 1.4);
	rect(ctx, 682, 84, 8, 144, BLUE_DARK, 0, 2);

	rearDoors(ctx, fitted);
	rect(ctx, 758, 84, 12, 144, BLUE_DARK, 0, 2);
	line(ctx, 760, 88, 760, 224, 'rgba(255,255,255,0.22)', 1.4);
}

export function drawRealCurtainSideLorryLevel(
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
		ctx.ellipse(398, 279, 368, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Cab and trailer in one silhouette, so the whole body cuts as a single piece.
	shape(ctx, SHELL, BLUE);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// Cab paint: light roof falling into a low-body shade.
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 91, 0, 258);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(20,40,55,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(22, 91, 174, 167);
	}

	// Cab door leaf, roof cap, waist band and skirt in the second livery colour. Bands run
	// across the door, as they do on the real cab.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, BLUE, 3, 2.6);
	rect(ctx, 26, 91, 162, 9, GREY, 3, 2.4);
	rect(ctx, 24, 196, 172, 9, GREY, 0, 0);
	line(ctx, 24, 197.4, 196, 197.4, 'rgba(255,255,255,0.5)', 1.4);
	line(ctx, 24, 204, 196, 204, 'rgba(36,69,91,0.3)', 1.4);
	rect(ctx, 24, 234, 172, 24, GREY, 0, 0);
	line(ctx, 24, 235.4, 196, 235.4, 'rgba(255,255,255,0.46)', 1.4);
	line(ctx, 24, 256, 196, 256, 'rgba(36,69,91,0.34)', 1.6);

	// Door seam, hinge line and the A-pillar gap in front of it.
	ctx.strokeStyle = 'rgba(36,69,91,0.55)';
	ctx.lineWidth = 2.2;
	ctx.stroke(new Path2D(rectMask(DOOR.x, DOOR.y, DOOR.w, DOOR.h)));
	ctx.strokeStyle = 'rgba(255,255,255,0.24)';
	ctx.lineWidth = 1.2;
	ctx.stroke(new Path2D(rectMask(DOOR.x + 2, DOOR.y + 2, DOOR.w - 4, DOOR.h - 4)));
	line(ctx, 126, 102, 126, 258, 'rgba(36,69,91,0.42)', 2);
	line(ctx, 127.6, 106, 127.6, 254, 'rgba(255,255,255,0.22)', 1.2);

	// Cab / trailer joint.
	line(ctx, 196, 84, 196, 258, 'rgba(36,69,91,0.5)', 2.4);
	line(ctx, 197.6, 88, 197.6, 256, 'rgba(255,255,255,0.28)', 1.2);

	drawTrailer(ctx, shaded, fitted);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Glass, then the shade that makes it read as glazing.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 30, 112, 92, 64);
		glassShade(ctx, SIDE_GLASS, 132, 112, 54, 54);
	}

	// Mirror head and arm on the A-pillar.
	line(ctx, 24, 124, 12, 116, INK, 3.2);
	line(ctx, 24, 124, 12, 116, STEEL, 2);
	rect(ctx, 6, 108, 16, 36, BLUE_DARK, 3, 2.4);
	if (shaded) {
		rect(ctx, 9, 112, 10, 28, GLASS, 1.2);
	}

	// Front bumper under the nose, rear under-run under the doors.
	rect(ctx, 6, 240, 16, 26, CHROME, 3, 2.6);
	line(ctx, 8, 246, 20, 246, 'rgba(255,255,255,0.6)', 1.6);
	line(ctx, 8, 259, 20, 259, 'rgba(58,39,27,0.3)', 1.6);
	rect(ctx, 770, 246, 18, 18, CHROME, 2, 2.6);
	line(ctx, 772, 250, 786, 250, 'rgba(255,255,255,0.55)', 1.6);

	if (fitted) {
		// Grille, headlamp, indicator and the folding step under the door.
		rect(ctx, 24, 178, 10, 26, STEEL, 2, 2);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 25, 178 + bar * 6, 33, 178 + bar * 6, CHROME, 1.5);
		}
		circle(ctx, 38, 232, 8.5, LAMP, 2.4);
		circle(ctx, 38, 232, 4.2, '#FFF7CF', 1.5);
		rect(ctx, 30, 212, 8, 8, AMBER, 2, 1.6);
		rect(ctx, 88, 244, 24, 12, CHROME, 3, 2.4);
		line(ctx, 92, 250, 108, 250, 'rgba(58,39,27,0.35)', 1.4);

		// Sun visor, wipers and roof markers.
		rect(ctx, 26, 104, 104, 7, BLUE_DARK, 3, 2);
		line(ctx, 54, 172, 78, 152, INK, 2.2);
		line(ctx, 88, 172, 106, 156, INK, 2);
		rect(ctx, 96, 94, 7, 4, AMBER, 1, 1);
		rect(ctx, 110, 94, 7, 4, AMBER, 1, 1);

		// Door handle, hinge and the cab steps.
		rect(ctx, 172, 210, 16, 6, CHROME, 2, 1.6);
		line(ctx, 174, 213, 185, 213, 'rgba(58,39,27,0.45)', 1.4);
		rect(ctx, 129, 200, 4, 10, STEEL, 1, 1.3);

		// Tail lamps on the rear corner, plus the side marker on the deck band.
		rect(ctx, 746, 244, 12, 14, RED, 2, 1.8);
		rect(ctx, 760, 244, 8, 10, AMBER, 1.5, 1.5);
		for (const markerX of [330, 470, 620]) {
			rect(ctx, markerX, 231, 10, 4, AMBER, 1, 1.1);
		}

		// Mudguards: painted over the cab skirt and the trailer flank.
		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r, BLUE);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r, BLUE_DARK);

		// Curtain tensioner block at the rear of the deck band.
		rect(ctx, 654, 228, 24, 12, BLUE_DEEP, 2, 2);
		line(ctx, 658, 232, 674, 232, CHROME, 1.6);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r, finish);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r, finish);

	if (lit) {
		// Rim light: cab roof, trailer roof rail, rear edge and the deck line.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(44, 94);
		ctx.lineTo(186, 94);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(204, 76.5);
		ctx.lineTo(752, 76.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(768.5, 88);
		ctx.lineTo(768.5, 256);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.35)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(200, 230);
		ctx.lineTo(766, 230);
		ctx.stroke();

		// Headlamp glow on the nose.
		const glow = ctx.createRadialGradient(38, 232, 1, 38, 232, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(38, 232, 30, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelAt of [WHEEL_L, WHEEL_R]) {
			ctx.beginPath();
			ctx.ellipse(wheelAt.x, 272, 33, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);
		curtainGrain(ctx);
		curtainFinish(ctx);
		strapFinish(ctx);
		hardwareFinish(ctx);
		glassFinish(ctx);

		// Glints on paint, cloth, hardware and glass.
		glint(ctx, 100, 122, 5.6);
		glint(ctx, 410, 140, 5.2);
		glint(ctx, 560, 186, 4.8);
		glint(ctx, 286, 163, 4.2);
		glint(ctx, 726, 104, 4);
		glint(ctx, 640, 82, 3.8);
		glint(ctx, 46, 230, 3.6);
		glint(ctx, 200, 150, 3.4);
		glint(ctx, 148, 212, 3.4);
		glint(ctx, 334, 122, 3.2);
		glint(ctx, 494, 206, 3);
		glint(ctx, 690, 202, 3);
		glint(ctx, 92, 182, 3.2);
		glint(ctx, 166, 97, 2.8);

		// Hub hardware survives the game scale on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

/** Warm four-point sparkle. */
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
 * Picture-book hub: a bright ring, six bolt heads and a polished crescent. Every mark is
 * mirror-symmetric about the hub centre, so the flipped rear wheel keeps its hardware.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.62)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.29, y + Math.sin(a) * r * 0.29, 2.4, CHROME, 1.2);
	}

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
	circle(ctx, x, y - r * 0.55, 2.1, CHROME, 1.1);
}

/**
 * Paint grain over the painted surfaces only: the glazing, the tyres and the curtain
 * panels are punched out so the fabric keeps its own weave.
 */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${CURTAIN_MASK} ${circleMask(
		WHEEL_L.x,
		WHEEL_L.y,
		WHEEL_L.r
	)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;

	ctx.save();
	ctx.clip(new Path2D(SHELL));
	ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');

	let seed = 41;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 380; i++) {
		const px = 26 + rnd() * 740;
		const py = 76 + rnd() * 184;
		ctx.globalAlpha = 0.075 + rnd() * 0.05;
		const size = 1.3 + rnd() * 1.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = '#FFFFFF';
	for (let i = 0; i < 150; i++) {
		const px = 26 + rnd() * 740;
		const py = 76 + rnd() * 184;
		ctx.globalAlpha = 0.12 + rnd() * 0.1;
		const size = 1.1 + rnd() * 0.9;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush strokes across the cab flank, the deck band and the rear doors.
	ctx.globalAlpha = 0.1;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.6;
	for (const [sx, sy, ex, ey] of [
		[40, 118, 122, 116],
		[216, 232, 336, 231],
		[352, 234, 430, 233],
		[694, 98, 754, 96],
		[700, 176, 752, 174],
		[40, 238, 176, 236]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
		ctx.stroke();
	}
	ctx.globalAlpha = 0.28;
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 2;
	for (const [sx, sy, ex, ey] of [
		[48, 96, 122, 95],
		[214, 78, 452, 77],
		[470, 100, 660, 99]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 1.6, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** Cloth grain on the curtains: a fine weave plus long vertical drape streaks. */
function curtainGrain(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(CURTAIN_MASK));

	let seed = 67;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.strokeStyle = INK;
	ctx.lineWidth = 1;
	for (let i = 0; i < 300; i++) {
		const px = CURTAIN_LEFT + rnd() * (CURTAIN_RIGHT - CURTAIN_LEFT);
		const py = CURTAIN_TOP + 4 + rnd() * (CURTAIN_HEM - CURTAIN_TOP - 6);
		ctx.globalAlpha = 0.045 + rnd() * 0.05;
		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(px + 1.2 + rnd() * 2.2, py + (rnd() - 0.5) * 1.2);
		ctx.stroke();
	}

	ctx.strokeStyle = '#FFFFFF';
	for (let i = 0; i < 46; i++) {
		const px = CURTAIN_LEFT + rnd() * (CURTAIN_RIGHT - CURTAIN_LEFT);
		const py = CURTAIN_TOP + 6 + rnd() * 96;
		ctx.globalAlpha = 0.08 + rnd() * 0.08;
		ctx.lineWidth = 1.1 + rnd();
		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(px + 0.8, py + 22 + rnd() * 46);
		ctx.stroke();
	}
	ctx.restore();
}

/**
 * Picture-book cloth finish: a broad sheen down every bay, long drape folds, the gathers
 * pulled in around each ratchet, tension dimples under the roof tabs and a catchlight along
 * the sagging hem.
 */
function curtainFinish(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(CURTAIN_MASK));

	for (const bay of BAYS) {
		const width = bay.right - bay.left;
		ctx.save();
		ctx.clip(new Path2D(bayPath(bay.left, bay.right)));

		const sheen = ctx.createLinearGradient(bay.left, 0, bay.right, 0);
		sheen.addColorStop(0, 'rgba(255,255,255,0)');
		sheen.addColorStop(0.2, 'rgba(255,255,255,0.3)');
		sheen.addColorStop(0.34, 'rgba(255,255,255,0.05)');
		sheen.addColorStop(0.7, 'rgba(36,69,91,0.06)');
		sheen.addColorStop(1, 'rgba(36,69,91,0.16)');
		ctx.fillStyle = sheen;
		ctx.fillRect(bay.left, CURTAIN_TOP, width, CURTAIN_HEM - CURTAIN_TOP + CURTAIN_SAG);

		// Weight at the hem: the cloth bunches where it meets the binding.
		const hemShade = ctx.createLinearGradient(0, CURTAIN_HEM - 26, 0, CURTAIN_HEM + 4);
		hemShade.addColorStop(0, 'rgba(36,69,91,0)');
		hemShade.addColorStop(1, 'rgba(36,69,91,0.14)');
		ctx.fillStyle = hemShade;
		ctx.fillRect(bay.left, CURTAIN_HEM - 26, width, 32);

		// Two long drape folds per bay, each with a lit edge.
		for (const [t, bend] of [
			[0.36, 6],
			[0.68, -7]
		]) {
			const foldX = bay.left + width * t;
			ctx.strokeStyle = 'rgba(36,69,91,0.1)';
			ctx.lineWidth = 4.4;
			ctx.beginPath();
			ctx.moveTo(foldX, CURTAIN_TOP + 5);
			ctx.quadraticCurveTo(foldX + bend, 154, foldX - bend * 0.4, CURTAIN_HEM - 3);
			ctx.stroke();
			ctx.strokeStyle = 'rgba(255,255,255,0.36)';
			ctx.lineWidth = 1.4;
			ctx.beginPath();
			ctx.moveTo(foldX + 2.4, CURTAIN_TOP + 8);
			ctx.quadraticCurveTo(foldX + bend + 2.4, 156, foldX - bend * 0.4 + 2.4, CURTAIN_HEM - 5);
			ctx.stroke();
		}

		// Hem catchlight and the little gathers that hang from the binding.
		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(bay.left, CURTAIN_HEM - 6);
		ctx.quadraticCurveTo(
			(bay.left + bay.right) / 2,
			CURTAIN_HEM + CURTAIN_SAG - 6,
			bay.right,
			CURTAIN_HEM - 6
		);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(36,69,91,0.22)';
		ctx.lineWidth = 1.4;
		for (const t of [0.3, 0.55, 0.78]) {
			const gx = bay.left + width * t;
			const gy = CURTAIN_HEM + Math.sin(t * Math.PI) * CURTAIN_SAG - 2;
			ctx.beginPath();
			ctx.moveTo(gx - 4, gy);
			ctx.quadraticCurveTo(gx, gy + 4.4, gx + 4, gy);
			ctx.stroke();
		}
		ctx.restore();
	}

	// Tension dimples under every roof tab.
	for (let tabX = CURTAIN_LEFT + 16; tabX < CURTAIN_RIGHT - 8; tabX += 26) {
		line(ctx, tabX + 0.4, CURTAIN_TOP + 7, tabX + 4.4, CURTAIN_TOP + 7, 'rgba(36,69,91,0.2)', 1.2);
		line(ctx, tabX + 0.6, CURTAIN_TOP + 5.6, tabX + 4.6, CURTAIN_TOP + 5.6, 'rgba(255,255,255,0.4)', 1);
	}

	// Cloth gathers pulled in on both sides of each ratchet.
	for (const strapX of STRAPS) {
		for (const [sx, sy, cx, cy, ex, ey] of [
			[strapX - 18, 174, strapX - 27, 200, strapX - 15, 223],
			[strapX - 10, 168, strapX - 16, 196, strapX - 8, 224],
			[strapX + 18, 174, strapX + 27, 200, strapX + 15, 223],
			[strapX + 10, 168, strapX + 16, 196, strapX + 8, 224]
		]) {
			ctx.strokeStyle = 'rgba(36,69,91,0.1)';
			ctx.lineWidth = 1.8;
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo(cx, cy, ex, ey);
			ctx.stroke();
			ctx.strokeStyle = 'rgba(255,255,255,0.3)';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(sx + 1.4, sy + 1);
			ctx.quadraticCurveTo(cx + 1.4, cy + 1, ex + 1.4, ey);
			ctx.stroke();
		}
	}

	ctx.restore();
}

/** Chrome ratchet bodies, tooth sparkle, lever edges, webbing stitches and the hook row. */
function strapFinish(ctx: CanvasRenderingContext2D): void {
	const top = CURTAIN_TOP + 3;
	const bottom = CURTAIN_HEM + CURTAIN_SAG + 6;

	for (const cx of STRAPS) {
		// Chrome face: bright top bevel falling into a dark lower lip.
		ctx.save();
		ctx.beginPath();
		ctx.rect(cx - 7, 162, 14, 18);
		ctx.clip();
		const face = ctx.createLinearGradient(0, 162, 0, 180);
		face.addColorStop(0, 'rgba(255,255,255,0.72)');
		face.addColorStop(0.42, 'rgba(255,255,255,0.04)');
		face.addColorStop(1, 'rgba(58,39,27,0.24)');
		ctx.fillStyle = face;
		ctx.fillRect(cx - 7, 162, 14, 18);
		ctx.restore();

		line(ctx, cx - 5.2, 162.7, cx + 5.2, 162.7, 'rgba(255,255,255,0.86)', 1.1);
		line(ctx, cx - 6.1, 163.4, cx - 6.1, 178.6, 'rgba(255,255,255,0.55)', 1);

		// Every tooth gets a lit crown and a shadow under it.
		for (let tooth = 0; tooth < 3; tooth++) {
			line(ctx, cx - 4, 166.3 + tooth * 4, cx + 4, 166.3 + tooth * 4, 'rgba(255,255,255,0.62)', 0.9);
			line(ctx, cx - 4, 167.8 + tooth * 4, cx + 4, 167.8 + tooth * 4, 'rgba(58,39,27,0.24)', 0.9);
		}

		// Lever head catches the light; the loose tail shows a folded edge.
		line(ctx, cx + 7.2, 167.6, cx + 14.6, 161.6, 'rgba(255,255,255,0.82)', 1.1);
		line(ctx, cx + 3.6, bottom + 2, cx + 4.4, bottom + 11, 'rgba(255,255,255,0.4)', 1);
		line(ctx, cx + 7.4, bottom + 2, cx + 6.4, bottom + 11, 'rgba(36,69,91,0.35)', 1);

		// Webbing stitches down the blue strap.
		ctx.strokeStyle = 'rgba(255,255,255,0.28)';
		ctx.lineWidth = 1;
		for (let sy = top + 26; sy < bottom - 26; sy += 22) {
			ctx.beginPath();
			ctx.moveTo(cx - 3, sy);
			ctx.lineTo(cx + 3, sy + 1.4);
			ctx.stroke();
		}
	}

	// Hem hook row: a lit crown and a bright rivet on every chrome hook.
	for (const bay of BAYS) {
		for (let hookX = bay.left + 20; hookX < bay.right - 10; hookX += 36) {
			line(ctx, hookX + 0.6, 234.7, hookX + 4.4, 234.7, 'rgba(255,255,255,0.85)', 1);
			ctx.fillStyle = 'rgba(255,255,255,0.9)';
			ctx.fillRect(hookX + 1.7, 236.4, 1.6, 1.6);
		}
	}
	line(ctx, 208, 240.2, 676, 240.2, 'rgba(255,255,255,0.24)', 1.2);
}

/** Rail and frame rivets, post highlights, mudguard crowns and the cab/door hardware. */
function hardwareFinish(ctx: CanvasRenderingContext2D): void {
	// Roof rail lip and its rivet row.
	line(ctx, 206, 80.4, 748, 80.4, 'rgba(255,255,255,0.5)', 1.6);
	ctx.save();
	ctx.fillStyle = CHROME;
	ctx.globalAlpha = 0.8;
	for (let rivetX = 218; rivetX <= 742; rivetX += 32) {
		ctx.beginPath();
		ctx.arc(rivetX, 80.4, 1.4, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Deck-band bolts, kept clear of the markers and the straps.
	ctx.save();
	ctx.fillStyle = 'rgba(255,255,255,0.6)';
	for (let boltX = 212; boltX <= 750; boltX += 24) {
		if ([330, 470, 620].some((markerX) => Math.abs(boltX - markerX - 5) < 12)) continue;
		if (STRAPS.some((strapX) => Math.abs(boltX - strapX) < 9)) continue;
		ctx.fillRect(boltX, 231, 1.6, 1.6);
	}
	ctx.restore();
	line(ctx, 210, 240.4, 754, 240.4, 'rgba(255,255,255,0.3)', 1.2);

	// Corner posts: a lit inner edge on each vertical.
	line(ctx, 205.6, 88, 205.6, 224, 'rgba(255,255,255,0.34)', 1.2);
	line(ctx, 688.2, 88, 688.2, 224, 'rgba(255,255,255,0.4)', 1.2);
	line(ctx, 768.2, 88, 768.2, 224, 'rgba(255,255,255,0.4)', 1.2);

	// Mudguard crowns catch the roof light.
	for (const wheelAt of [WHEEL_L, WHEEL_R]) {
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(wheelAt.x, wheelAt.y, wheelAt.r + 9.4, Math.PI * 1.16, Math.PI * 1.84);
		ctx.stroke();
	}
	line(ctx, 106, 254, 194, 254, 'rgba(255,255,255,0.26)', 1.2);
	line(ctx, 596, 254, 684, 254, 'rgba(255,255,255,0.26)', 1.2);

	// Rear doors: rod sheen, hinge crowns, plate screws.
	for (const rodX of [REAR_DOOR.x + 12, REAR_DOOR.x + 56]) {
		line(ctx, rodX - 1.1, 96, rodX - 1.1, 220, 'rgba(255,255,255,0.6)', 1.2);
		line(ctx, rodX - 6, 149, rodX + 6, 149, 'rgba(255,255,255,0.5)', 1);
	}
	for (const hy of [100, 128, 156]) {
		ctx.fillStyle = 'rgba(255,255,255,0.8)';
		ctx.fillRect(REAR_DOOR.x + 2.4, hy + 1.2, 1.6, 1.6);
		ctx.fillRect(REAR_DOOR.x + REAR_DOOR.w - 5.2, hy + 1.2, 1.6, 1.6);
	}
	ctx.fillStyle = 'rgba(58,39,27,0.5)';
	ctx.fillRect(REAR_DOOR.x + 24.4, 192.2, 1.4, 1.4);
	ctx.fillRect(REAR_DOOR.x + 44.2, 192.2, 1.4, 1.4);

	// Cab door: handle lip and hinge bolts.
	line(ctx, 172.6, 211, 187, 211, 'rgba(255,255,255,0.8)', 1.2);
	circle(ctx, 131, 202.6, 1.4, CHROME, 0.9);
	circle(ctx, 131, 208.6, 1.4, CHROME, 0.9);

	// Grille bars, sun visor, step lip, mirror arm and mirror head edge.
	for (let bar = 1; bar <= 3; bar++) {
		line(ctx, 25.4, 178 + bar * 6 - 0.5, 32.6, 178 + bar * 6 - 0.5, 'rgba(255,255,255,0.5)', 0.9);
	}
	line(ctx, 27, 104.8, 129, 104.8, 'rgba(255,255,255,0.6)', 1.2);
	line(ctx, 90, 246, 110, 246, 'rgba(255,255,255,0.6)', 1.2);
	circle(ctx, 91.5, 252, 1.3, CHROME, 0.9);
	circle(ctx, 108.5, 252, 1.3, CHROME, 0.9);
	line(ctx, 13, 117, 22.4, 123, 'rgba(255,255,255,0.6)', 1.1);
	line(ctx, 7.6, 110, 7.6, 142, 'rgba(255,255,255,0.45)', 1.1);

	// Lamp lenses and the marker edges.
	ctx.fillStyle = 'rgba(255,255,255,0.85)';
	ctx.beginPath();
	ctx.arc(35.8, 229.6, 1.8, 0, Math.PI * 2);
	ctx.fill();
	line(ctx, 31, 212.6, 37, 212.6, 'rgba(255,255,255,0.7)', 1);
	line(ctx, 748, 245.2, 756.4, 245.2, 'rgba(255,255,255,0.7)', 1.1);
	line(ctx, 761, 245, 766.6, 245, 'rgba(255,255,255,0.55)', 1);
	for (const markerX of [330, 470, 620]) {
		line(ctx, markerX + 0.6, 231.6, markerX + 9.4, 231.6, 'rgba(255,255,255,0.6)', 1);
	}
	line(ctx, 660, 230.2, 672, 230.2, 'rgba(255,255,255,0.5)', 1);
	rect(ctx, 8.4, 242.2, 10, 2, 'rgba(255,255,255,0.5)', 0, 0);
}

/** Glazing sheen: bright rakes down each pane plus a cool bounce along the lower edge. */
function glassFinish(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(GLASS_MASK));

	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(48, 168);
	ctx.lineTo(96, 122);
	ctx.stroke();

	ctx.lineWidth = 2.6;
	ctx.beginPath();
	ctx.moveTo(146, 164);
	ctx.lineTo(174, 126);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(105,190,240,0.45)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(36, 170);
	ctx.lineTo(114, 170);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(138, 161);
	ctx.lineTo(182, 161);
	ctx.stroke();
	ctx.restore();

	glint(ctx, 168, 138, 3.2);
}

/** Working marks: chalk scuffs on the curtains, road spray along the skirt, soot at the rail. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(CURTAIN_MASK));
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 2.2;
	for (const [sx, sy, ex, ey] of [
		[228, 112, 250, 110],
		[232, 120, 246, 119],
		[566, 196, 590, 194],
		[640, 150, 656, 148],
		[642, 158, 652, 157]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
		ctx.stroke();
	}
	ctx.restore();

	// A stitched repair patch on the leading bay, with a chalked tally beside it.
	ctx.save();
	ctx.clip(new Path2D(bayPath(BAYS[0].left, BAYS[0].right)));
	ctx.fillStyle = 'rgba(255,255,255,0.26)';
	ctx.fillRect(236, 124, 32, 34);
	ctx.fillStyle = 'rgba(36,69,91,0.07)';
	ctx.fillRect(236, 124, 32, 6);
	ctx.setLineDash([3, 3]);
	ctx.strokeStyle = 'rgba(36,69,91,0.46)';
	ctx.lineWidth = 1.2;
	ctx.strokeRect(237, 125, 30, 32);
	ctx.setLineDash([]);
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(242, 129);
	ctx.lineTo(262, 129);
	ctx.moveTo(242, 153);
	ctx.lineTo(262, 153);
	ctx.stroke();
	ctx.restore();

	for (let tally = 0; tally < 4; tally++) {
		line(ctx, 300 + tally * 5, 130 + tally * 0.6, 301 + tally * 5, 141 + tally * 0.6, 'rgba(255,255,255,0.42)', 1.7);
	}
	line(ctx, 298, 138, 318, 134, 'rgba(255,255,255,0.42)', 1.7);

	// Road spray along the bottom of the skirt, either side of the wheel arches.
	ctx.save();
	ctx.globalAlpha = 0.13;
	ctx.fillStyle = INK;
	for (let dust = 0; dust < 12; dust++) {
		const dx = 210 + dust * 46;
		if (dx > 578 && dx < 700) continue;
		ctx.fillRect(dx, 238 + (dust % 3), 13, 2);
	}
	ctx.restore();

	// Soot softened under the roof rail at the cab end.
	ctx.save();
	ctx.globalAlpha = 0.12;
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.ellipse(300, 88, 42, 3.2, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();

	// A little paint wear on the bumper and the rear doors.
	ctx.save();
	ctx.globalAlpha = 0.4;
	ctx.fillStyle = CREAM;
	ctx.fillRect(9, 250, 6, 2);
	ctx.fillRect(700, 206, 8, 2);
	ctx.fillRect(756, 232, 5, 2);
	ctx.restore();
}

export function drawRealCurtainSideLorry(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealCurtainSideLorryLevel(ctx, x, y, scale, 5);
}
