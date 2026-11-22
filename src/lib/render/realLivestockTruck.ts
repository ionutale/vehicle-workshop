/**
 * Livestock truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A double-deck cattle lorry facing left: a compact cab-over cab, a tall two-deck body
 * with horizontal ventilation slats between plum stanchions, a bolted deck belt with the
 * bull roundel, roof vents, a folded rear loading ramp, mudguards and lamps.
 * Livery #8AC6D1 / #6D597A. Art box 800 x 400 with the road at 272.
 * Level 5 is the production target: shaded, fitted, lit and picture-book finished.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape, wheel } from './realKit';

const TEAL = '#8AC6D1';
const TEAL_SHADE = '#6FA3AE';
const TEAL_DEEP = '#456B77';
const PLUM = '#6D597A';
const PLUM_DARK = '#4B3D57';
const CREAM = '#F7F9FC';
const LAMP = '#FFE066';
const AMBER = '#FFB703';
const RED = '#FF4D6D';

/**
 * One cut-out for cab, two-deck body and chassis: the cab roof steps up into the taller
 * body, the body floor stops short of the cab skirt and the rear edge carries the ramp.
 */
const SHELL =
	'M22,258 L22,146 Q22,120 36,112 L52,104 Q62,99 78,99 L190,99 L190,52 Q190,44 200,44 L748,44 Q762,44 762,56 L762,248 L200,248 L200,258 Z';

// The spec body mask is this shell plus the underbody band, the mirror head, the front
// bumper, the three roof vents and the folded ramp. Every subpath is disjoint from the
// shell, so the evenodd clip cannot punch a hole.

const pane = (x: number, y: number, w: number, h: number, r: number): string =>
	`M${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`;

const WINDSCREEN = pane(38, 120, 84, 58, 9);
const SIDE_GLASS = pane(128, 122, 48, 56, 5);
const GLASS_MASK = `${WINDSCREEN} ${SIDE_GLASS}`;

/** Cab door: a clean rectangle, clear of every piece of glass. */
const DOOR = { x: 40, y: 182, w: 138, h: 70 };

/** Both axles share the one wheel piece; the body never masks a tyre. */
const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 640, y: 236, r: 36 };

/** Folded loading ramp hanging against the rear face. */
const RAMP = { x: 762, y: 58, w: 28, h: 186 };

/** Roof vent boxes, each 52 wide with its base on the roof line. */
const VENTS = [300, 462, 624];
const VENT_W = 52;

const BODY_L = 200;
const BODY_R = 750;
const BODY_BOT = 248;
const ROOF = 44;
const ROOF_RAIL = 54;
const UPPER_BOT = 146;
const BELT_BOT = 168;
const LOWER_BOT = 240;
const POST_W = 12;
const POSTS = [190, 288, 406, 524, 642, 750];

/** Slat rows: nine on the upper deck, seven below the belt. */
const SLATS: number[] = [];
for (let slatY = 58; slatY <= 140; slatY += 9.5) SLATS.push(slatY);
for (let slatY = 172; slatY <= 232; slatY += 9.5) SLATS.push(slatY);

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
	glass.addColorStop(0, 'rgba(255,255,255,0.58)');
	glass.addColorStop(0.46, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(98,182,230,0.28)');
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
	ctx.fillStyle = PLUM;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.arc(cx, cy, r + 5.4, Math.PI * 1.12, Math.PI * 1.88);
	ctx.stroke();
}

/** The cue that names the load: a bull head on a painted roundel. */
function bullBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	circle(ctx, cx, cy, r, PLUM, 2.4);
	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(cx, cy, r - 4.2, 0, Math.PI * 2);
	ctx.stroke();

	// Horns sweep out and up from the crown.
	ctx.strokeStyle = CREAM;
	ctx.lineWidth = 2.8;
	ctx.beginPath();
	ctx.moveTo(cx - 6.5, cy - 8);
	ctx.quadraticCurveTo(cx - 14, cy - 16, cx - 17.5, cy - 5);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(cx + 6.5, cy - 8);
	ctx.quadraticCurveTo(cx + 14, cy - 16, cx + 17.5, cy - 5);
	ctx.stroke();

	// Head: broad brow tapering to the muzzle.
	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.moveTo(cx - 9, cy - 9);
	ctx.lineTo(cx + 9, cy - 9);
	ctx.lineTo(cx + 7, cy + 2);
	ctx.quadraticCurveTo(cx + 6, cy + 9, cx, cy + 10);
	ctx.quadraticCurveTo(cx - 6, cy + 9, cx - 7, cy + 2);
	ctx.closePath();
	ctx.fill();

	// Ears tucked under the horns, eyes and the pale muzzle.
	ctx.beginPath();
	ctx.moveTo(cx - 9, cy - 7);
	ctx.lineTo(cx - 13, cy - 3);
	ctx.lineTo(cx - 8.5, cy - 1);
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(cx + 9, cy - 7);
	ctx.lineTo(cx + 13, cy - 3);
	ctx.lineTo(cx + 8.5, cy - 1);
	ctx.closePath();
	ctx.fill();

	circle(ctx, cx - 4, cy - 2.5, 1.5, INK, 1);
	circle(ctx, cx + 4, cy - 2.5, 1.5, INK, 1);

	rect(ctx, cx - 3.6, cy + 3.4, 7.2, 5.2, PLUM_DARK, 1.6, 1);
	circle(ctx, cx - 1.6, cy + 6, 0.8, CREAM, 0.8);
	circle(ctx, cx + 1.6, cy + 6, 0.8, CREAM, 0.8);
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
 * Picture-book hub: bright rim ring, six bolt heads and a polished centre cap. Every mark
 * is mirror-symmetric about the hub centre, so the flipped rear wheel reproduces it.
 */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.64)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		const bx = x + Math.cos(a) * r * 0.29;
		const by = y + Math.sin(a) * r * 0.29;
		circle(ctx, bx, by, 2.5, CHROME, 1.2);
		// Specular on each bolt head. A centred dot is invariant under the mirror, so the
		// flipped rear wheel carries identical hardware.
		circle(ctx, bx, by, 0.9, '#FFFFFF', 0.6);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.3);
	circle(ctx, x, y - 1.2, 1.1, '#FFFFFF', 0.5);

	ctx.strokeStyle = 'rgba(255,255,255,0.34)';
	ctx.lineWidth = 1.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.36, 0, Math.PI * 2);
	ctx.stroke();

	for (const [from, to] of [
		[Math.PI * 1.06, Math.PI * 1.44],
		[Math.PI * 1.56, Math.PI * 1.94]
	]) {
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(x, y, r * 0.62, from, to);
		ctx.stroke();
	}
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.1;
	for (const [from, to] of [
		[Math.PI * 1.12, Math.PI * 1.38],
		[Math.PI * 1.62, Math.PI * 1.88]
	]) {
		ctx.beginPath();
		ctx.arc(x, y, r * 0.78, from, to);
		ctx.stroke();
	}
	circle(ctx, x, y - r * 0.55, 2.2, CHROME, 1.1);
}

/** The cab door: leaf, inset panel, hinges, handle and the livery band. */
function cabDoor(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, TEAL_SHADE, 3, 2.6);
	rect(ctx, DOOR.x + 5, DOOR.y + 5, DOOR.w - 10, DOOR.h - 10, TEAL, 2.5, 1.6);

	// The cab skirt runs on across the leaf.
	rect(ctx, DOOR.x + 5, 244, DOOR.w - 10, 8, PLUM, 0, 0);
	line(ctx, DOOR.x + 6, 245.5, DOOR.x + DOOR.w - 6, 245.5, 'rgba(255,255,255,0.24)', 1.2);

	if (fitted) {
		for (const hingeY of [192, 212, 232]) {
			rect(ctx, DOOR.x + 1, hingeY, 6, 12, STEEL, 2, 1.4);
		}

		// Handle rides the trailing stile, clear of the front wheel arch.
		rect(ctx, DOOR.x + DOOR.w - 22, DOOR.y + 2, 16, 5, CREAM, 2.5, 1.6);
		line(ctx, DOOR.x + DOOR.w - 20, DOOR.y + 4, DOOR.x + DOOR.w - 10, DOOR.y + 4, '#FFFFFF', 1.2);
	}
}

/** The folded rear ramp: hinge bar, grooved deck face, gas strut and the foot lip. */
function rearRamp(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	// Leaf frame and the deck face inset inside it.
	rect(ctx, RAMP.x, RAMP.y, RAMP.w, RAMP.h, PLUM_DARK, 2.5, 2.6);
	const deckX = RAMP.x + 4;
	const deckY = RAMP.y + 13;
	const deckW = RAMP.w - 8;
	const deckH = RAMP.h - 33;
	rect(ctx, deckX, deckY, deckW, deckH, PLUM, 2, 1.8);

	// Cross treads read as the ramp deck, seen edge-on while it is folded up.
	for (let treadY = deckY + 6; treadY < deckY + deckH - 8; treadY += 19) {
		ctx.fillStyle = TEAL;
		ctx.fillRect(deckX + 1.5, treadY, deckW - 3, 7);
		line(ctx, deckX + 1.5, treadY + 7.8, deckX + deckW - 1.5, treadY + 7.8, INK, 1.3);
		line(
			ctx,
			deckX + 1.5,
			treadY + 1,
			deckX + deckW - 1.5,
			treadY + 1,
			'rgba(255,255,255,0.36)',
			1.2
		);
	}

	// Hinge bar at the top, foot lip at the bottom.
	rect(ctx, RAMP.x + 1, RAMP.y + 2, RAMP.w - 2, 9, CHROME, 2, 2);
	line(ctx, RAMP.x + 5, RAMP.y + 4, RAMP.x + RAMP.w - 5, RAMP.y + 4, '#FFFFFF', 1.4);
	shape(
		ctx,
		`M${RAMP.x + 2},${RAMP.y + RAMP.h - 18} L${RAMP.x + RAMP.w - 1},${RAMP.y + RAMP.h - 19} L${RAMP.x + RAMP.w - 1},${RAMP.y + RAMP.h - 4} L${RAMP.x + 2},${RAMP.y + RAMP.h - 1} Z`,
		STEEL,
		2
	);

	if (fitted) {
		circle(ctx, RAMP.x + 6, RAMP.y + RAMP.h - 12, 1.9, CHROME, 1.1);
		circle(ctx, RAMP.x + RAMP.w - 6, RAMP.y + RAMP.h - 13, 1.9, CHROME, 1.1);
	}
}

/**
 * Level-5 pass over the folded ramp. The leaf sits outside the body shell, so it gets its
 * own clip: a cool light falloff across the width, tread-top sheen, scuffed paint grain and
 * bright hinge / foot hardware.
 */
function rampFinish(ctx: CanvasRenderingContext2D): void {
	const deckX = RAMP.x + 4;
	const deckY = RAMP.y + 13;
	const deckW = RAMP.w - 8;
	const deckH = RAMP.h - 33;

	ctx.save();
	ctx.beginPath();
	ctx.rect(RAMP.x, RAMP.y, RAMP.w, RAMP.h);
	ctx.clip();

	const leaf = ctx.createLinearGradient(RAMP.x, 0, RAMP.x + RAMP.w, 0);
	leaf.addColorStop(0, 'rgba(255,255,255,0.34)');
	leaf.addColorStop(0.42, 'rgba(255,255,255,0.08)');
	leaf.addColorStop(1, 'rgba(0,0,0,0.16)');
	ctx.fillStyle = leaf;
	ctx.fillRect(RAMP.x, RAMP.y, RAMP.w, RAMP.h);

	for (let treadY = deckY + 6; treadY < deckY + deckH - 8; treadY += 19) {
		line(ctx, deckX + 2, treadY + 0.9, deckX + deckW - 2, treadY + 0.9, 'rgba(255,255,255,0.55)', 1.2);
		line(ctx, deckX + 2, treadY + 6.6, deckX + deckW - 2, treadY + 6.6, 'rgba(58,39,27,0.18)', 1);
	}

	// Scuffed grain: a deterministic sprinkle so the ramp matches the brushwork on the
	// body paint without disturbing the deck treads.
	let seed = 71;
	const rand = () => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	for (let i = 0; i < 46; i++) {
		ctx.globalAlpha = 0.08 + rand() * 0.06;
		ctx.fillStyle = i % 3 === 0 ? '#FFFFFF' : INK;
		ctx.fillRect(deckX + 1 + rand() * (deckW - 2), deckY + 2 + rand() * (deckH - 4), 1.2, 1.2);
	}

	// Hinge bar and foot lip catch the sky.
	ctx.globalAlpha = 0.55;
	line(ctx, RAMP.x + 4, RAMP.y + 10.2, RAMP.x + RAMP.w - 4, RAMP.y + 10.2, '#FFFFFF', 1.3);
	line(ctx, RAMP.x + 3, RAMP.y + RAMP.h - 5.4, RAMP.x + RAMP.w - 3, RAMP.y + RAMP.h - 6.4, '#FFFFFF', 1.4);
	circle(ctx, RAMP.x + 5.5, RAMP.y + 6.5, 1.1, '#FFFFFF', 0.5);
	circle(ctx, RAMP.x + RAMP.w - 5.5, RAMP.y + 6.5, 1.1, '#FFFFFF', 0.5);
	ctx.restore();
}

export function drawRealLivestockTruckLevel(
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
		ctx.ellipse(392, 279, 344, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis block: painted under the body so the body mask keeps its underbody band.
	rect(ctx, 26, 246, 738, 19, '#6F7987', 0, 0);
	rect(ctx, 26, 246, 738, 3, '#8C96A4', 0, 0);
	rect(ctx, 26, 259, 738, 6, '#555D6A', 0, 0);

	// Cab, two-deck body and chassis in one silhouette.
	shape(ctx, SHELL, TEAL);

	ctx.save();
	ctx.clip(new Path2D(SHELL));

	// The decks are open behind the slats: dark interior showing through every gap.
	ctx.fillStyle = TEAL_DEEP;
	ctx.fillRect(BODY_L, ROOF_RAIL, BODY_R - BODY_L, UPPER_BOT - ROOF_RAIL);
	ctx.fillRect(BODY_L, BELT_BOT, BODY_R - BODY_L, LOWER_BOT - BELT_BOT);

	if (shaded) {
		const cabPaint = ctx.createLinearGradient(0, 99, 0, 258);
		cabPaint.addColorStop(0, 'rgba(255,255,255,0.56)');
		cabPaint.addColorStop(0.3, 'rgba(255,255,255,0.06)');
		cabPaint.addColorStop(0.74, 'rgba(75,61,87,0.05)');
		cabPaint.addColorStop(1, 'rgba(75,61,87,0.22)');
		ctx.fillStyle = cabPaint;
		ctx.fillRect(22, 99, 168, 159);

		// Each deck falls away from the roof above it, so the openings have depth.
		for (const [top, bottom] of [
			[ROOF_RAIL, UPPER_BOT],
			[BELT_BOT, LOWER_BOT]
		]) {
			const depth = ctx.createLinearGradient(0, top, 0, bottom);
			depth.addColorStop(0, 'rgba(12,30,36,0.46)');
			depth.addColorStop(0.42, 'rgba(12,30,36,0.05)');
			depth.addColorStop(1, 'rgba(12,30,36,0.3)');
			ctx.fillStyle = depth;
			ctx.fillRect(BODY_L, top, BODY_R - BODY_L, bottom - top);
		}
	}

	// Horizontal ventilation slats: the cue that names the vehicle.
	for (const slatY of SLATS) {
		ctx.fillStyle = TEAL;
		ctx.fillRect(BODY_L + 2, slatY, BODY_R - BODY_L - 4, 5.8);
		line(
			ctx,
			BODY_L + 2,
			slatY + 6,
			BODY_R - 2,
			slatY + 6,
			'rgba(58,39,27,0.32)',
			1.1
		);
		if (shaded) {
			line(ctx, BODY_L + 2, slatY + 0.9, BODY_R - 2, slatY + 0.9, 'rgba(255,255,255,0.46)', 1.1);
			ctx.fillStyle = 'rgba(255,255,255,0.1)';
			ctx.fillRect(BODY_L + 2, slatY + 1.6, BODY_R - BODY_L - 4, 1.6);
		}
	}

	// Side stanchions standing proud of the slats.
	for (const postX of POSTS) {
		rect(ctx, postX, ROOF, POST_W, BODY_BOT - ROOF, PLUM, 1.5, 2.2);
		line(ctx, postX + 3.4, ROOF + 6, postX + 3.4, BODY_BOT - 6, 'rgba(255,255,255,0.2)', 2);
		line(ctx, postX + POST_W - 3, ROOF + 8, postX + POST_W - 3, BODY_BOT - 8, 'rgba(0,0,0,0.18)', 1.6);
	}

	// Roof rail, deck belt with its chrome rub rail, and the lower skirt.
	rect(ctx, 190, ROOF, 572, 10, PLUM, 0, 0);
	line(ctx, 194, 46.5, 758, 46.5, 'rgba(255,255,255,0.3)', 1.8);
	line(ctx, 190, 52.5, 762, 52.5, 'rgba(0,0,0,0.24)', 1.6);

	rect(ctx, 190, UPPER_BOT, 572, 18, PLUM, 0, 0);
	line(ctx, 190, 147.6, 762, 147.6, 'rgba(255,255,255,0.3)', 1.8);
	rect(ctx, 190, 164, 572, 5, CHROME, 2, 1.8);

	rect(ctx, 190, LOWER_BOT, 572, BODY_BOT - LOWER_BOT, PLUM, 0, 0);
	line(ctx, 190, 241.6, 762, 241.6, 'rgba(255,255,255,0.26)', 1.6);

	// Cab roof cap, waist seam and skirt.
	ctx.save();
	ctx.strokeStyle = PLUM;
	ctx.lineWidth = 9;
	ctx.stroke(new Path2D('M38,111 L52,104 Q62,99 78,99 L190,99'));
	ctx.restore();
	line(ctx, 24, 176.6, 190, 176.6, 'rgba(75,61,87,0.4)', 2.4);
	line(ctx, 24, 180.4, 190, 180.4, 'rgba(255,255,255,0.3)', 1.4);
	rect(ctx, 22, 244, 168, 14, PLUM, 0, 0);
	line(ctx, 24, 246, 188, 246, 'rgba(255,255,255,0.28)', 1.5);

	// One sky-to-floor light pass over the whole livery: roof light at the top, a deep
	// shade under the deck belt and along the skirt.
	if (shaded) {
		const bodyLight = ctx.createLinearGradient(0, ROOF, 0, BODY_BOT);
		bodyLight.addColorStop(0, 'rgba(255,255,255,0.3)');
		bodyLight.addColorStop(0.16, 'rgba(255,255,255,0.05)');
		bodyLight.addColorStop(0.62, 'rgba(75,61,87,0.02)');
		bodyLight.addColorStop(0.86, 'rgba(75,61,87,0.12)');
		bodyLight.addColorStop(1, 'rgba(75,61,87,0.24)');
		ctx.fillStyle = bodyLight;
		ctx.fillRect(190, ROOF, 572, BODY_BOT - ROOF);
	}

	// Door seam on the cab flank, and the cab / body joint.
	line(ctx, 178.6, 104, 178.6, 252, 'rgba(58,39,27,0.32)', 1.8);
	line(ctx, 190, 99, 190, 248, 'rgba(58,39,27,0.45)', 2.4);
	if (shaded) {
		line(ctx, 192.6, 102, 192.6, 246, 'rgba(255,255,255,0.18)', 1.2);
	}

	cabDoor(ctx, fitted);

	// Deck belt wordmark and the bull badge on the upper front bay.
	ctx.fillStyle = CREAM;
	ctx.font = '700 12px ui-rounded, system-ui, sans-serif';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText('LIVESTOCK', 316, 160.5);
	bullBadge(ctx, 245, 100, 22);

	ctx.restore();

	// Re-stroke the silhouette over the opaque fills.
	ctx.strokeStyle = INK;
	ctx.lineWidth = 3;
	ctx.stroke(new Path2D(SHELL));

	// Mirror head and arm on the A-pillar.
	line(ctx, 24, 138, 12, 132, INK, 3.4);
	line(ctx, 24, 138, 12, 132, STEEL, 2.2);
	rect(ctx, 2, 116, 16, 36, PLUM_DARK, 3, 2.4);
	if (shaded) {
		rect(ctx, 4.5, 120, 11, 28, GLASS, 1.4);
	}

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_GLASS, GLASS, 2.5);
	if (shaded) {
		glassShade(ctx, WINDSCREEN, 38, 120, 84, 58);
		glassShade(ctx, SIDE_GLASS, 128, 122, 48, 56);
	}

	// Front bumper under the cab nose: chrome bar with a dark rubber insert.
	rect(ctx, 4, 244, 18, 24, CHROME, 4, 2.6);
	ctx.fillStyle = '#4E5764';
	ctx.fillRect(7, 249, 12, 5);
	line(ctx, 7, 247, 19, 247, 'rgba(255,255,255,0.6)', 1.8);
	line(ctx, 7, 263, 19, 263, 'rgba(58,39,27,0.3)', 1.6);

	// Roof vents and the folded rear ramp.
	for (const ventX of VENTS) {
		rect(ctx, ventX, 31, VENT_W, 14, TEAL_SHADE, 3, 2.2);
		rect(ctx, ventX + 4, 34.5, VENT_W - 8, 5.5, PLUM, 1.5, 1.4);
		line(ctx, ventX + 6, 37, ventX + VENT_W - 6, 37, 'rgba(255,255,255,0.42)', 1.2);
		line(ctx, ventX + 2, 47, ventX + VENT_W - 2, 47, 'rgba(58,39,27,0.2)', 2);
		if (fitted) {
			for (let blade = 0; blade < 4; blade++) {
				line(
					ctx,
					ventX + 7 + blade * 11,
					34.6,
					ventX + 7 + blade * 11,
					40.4,
					'rgba(58,39,27,0.34)',
					1.4
				);
			}
		}
	}

	rearRamp(ctx, fitted);

	if (fitted) {
		// Lamps, grille and wipers on the cab nose.
		circle(ctx, 31, 233, 7, LAMP, 2.4);
		circle(ctx, 31, 233, 3.6, '#FFF7CF', 1.5);
		rect(ctx, 28, 212, 9, 9, AMBER, 2, 1.6);
		rect(ctx, 27, 190, 11, 18, STEEL, 2, 2);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 28, 190 + bar * 4.5, 37, 190 + bar * 4.5, CHROME, 1.5);
		}
		line(ctx, 52, 174, 74, 156, INK, 2.2);
		line(ctx, 88, 174, 106, 160, INK, 2);

		// Sun visor over the screen, folding step under the door.
		rect(ctx, 34, 114, 90, 6, PLUM_DARK, 2.5, 2);
		rect(ctx, 88, 251, 30, 7, STEEL, 2, 2);
		line(ctx, 92, 252.4, 114, 252.4, 'rgba(255,255,255,0.5)', 1.6);

		// Exhaust stack behind the cab door, capped under the roof.
		rect(ctx, 180, 118, 9, 124, STEEL, 2, 2);
		line(ctx, 182.5, 124, 182.5, 236, CHROME, 2);
		rect(ctx, 179, 114, 11, 6, PLUM_DARK, 2, 1.8);

		// Marker lamps along the deck belt and the rear lamps on the chassis.
		for (const markerX of [430, 556, 682]) {
			rect(ctx, markerX, 152, 12, 6, AMBER, 1.5, 1.2);
		}
		rect(ctx, 700, 246, 13, 14, RED, 2, 1.8);
		rect(ctx, 717, 248, 10, 10, AMBER, 1.5, 1.5);

		mudguard(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		mudguard(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);
	}

	// One wheel piece, drawn twice.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: cab nose, cab roof, body roof and the rear corner.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(24, 152);
		ctx.lineTo(24, 244);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(40, 110);
		ctx.lineTo(78, 100.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(204, 45.5);
		ctx.lineTo(744, 45.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(760.5, 62);
		ctx.lineTo(760.5, 240);
		ctx.stroke();

		// Headlamp glow.
		const glow = ctx.createRadialGradient(31, 233, 1, 31, 233, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(31, 233, 28, 0, Math.PI * 2);
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
		// Paint grain over solid paint only: glazing and tyres are punched out.
		ctx.save();
		const keepOut = `${GLASS_MASK} ${circleMask(WHEEL_L.x, WHEEL_L.y, WHEEL_L.r)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;
		ctx.clip(new Path2D(SHELL));
		ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');
		let seed = 53;
		const rand = () => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 430; i++) {
			const px = 26 + rand() * 730;
			const py = 48 + rand() * 196;
			const size = 1.4 + rand() * 1.1;
			ctx.globalAlpha = 0.09 + rand() * 0.05;
			ctx.fillRect(px, py, size, size);
		}
		ctx.fillStyle = '#FFFFFF';
		for (let i = 0; i < 150; i++) {
			const px = 26 + rand() * 730;
			const py = 48 + rand() * 196;
			const size = 1.2 + rand() * 0.9;
			ctx.globalAlpha = 0.18 + rand() * 0.1;
			ctx.fillRect(px, py, size, size);
		}

		// Long brush strokes along the cab flank and the deck bands.
		ctx.globalAlpha = 0.1;
		ctx.strokeStyle = INK;
		ctx.lineWidth = 1.5;
		for (const [sx, sy, ex, ey] of [
			[42, 116, 172, 112],
			[208, 72, 736, 70],
			[222, 196, 700, 194],
			[300, 156, 740, 154],
			[44, 238, 176, 236]
		]) {
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.2, ex, ey);
			ctx.stroke();
		}

		// Slat grain: short brushed streaks riding every ventilation board, with a paler
		// pass just above the shadow so the boards read as painted timber rather than
		// flat fills.
		ctx.lineWidth = 1;
		for (let i = 0; i < SLATS.length; i++) {
			const slatY = SLATS[i];
			const startX = BODY_L + 8 + rand() * 130;
			const length = 24 + rand() * 58;
			ctx.globalAlpha = 0.08 + rand() * 0.04;
			ctx.strokeStyle = INK;
			ctx.beginPath();
			ctx.moveTo(startX, slatY + 3);
			ctx.lineTo(startX + length, slatY + 2.6);
			ctx.stroke();

			ctx.globalAlpha = 0.14 + rand() * 0.08;
			ctx.strokeStyle = '#FFFFFF';
			ctx.beginPath();
			ctx.moveTo(startX + 5, slatY + 1.5);
			ctx.lineTo(startX + 5 + length * 0.62, slatY + 1.3);
			ctx.stroke();
		}
		ctx.restore();

		// Panel sheen: roof light down the body panels, a streak along each deck, and a
		// bounce under the belt. Glass and tyres stay clear so the wheel tiles match.
		ctx.save();
		ctx.clip(new Path2D(SHELL));
		ctx.clip(new Path2D(`${SHELL} ${keepOut}`), 'evenodd');
		const roofSheen = ctx.createLinearGradient(0, 54, 0, 104);
		roofSheen.addColorStop(0, 'rgba(255,255,255,0.3)');
		roofSheen.addColorStop(0.6, 'rgba(255,255,255,0.08)');
		roofSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = roofSheen;
		ctx.fillRect(198, 54, 552, 50);

		const cabSheen = ctx.createLinearGradient(0, 101, 0, 154);
		cabSheen.addColorStop(0, 'rgba(255,255,255,0.3)');
		cabSheen.addColorStop(1, 'rgba(255,255,255,0)');
		ctx.fillStyle = cabSheen;
		ctx.fillRect(24, 101, 164, 53);

		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 3;
		for (const [sx, sy, ex, ey] of [
			[214, 66, 736, 64],
			[214, 188, 736, 186],
			[48, 232, 176, 230]
		]) {
			ctx.globalAlpha = 0.26;
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.quadraticCurveTo((sx + ex) / 2, sy - 2, ex, ey);
			ctx.stroke();
		}
		ctx.globalAlpha = 0.18;
		ctx.strokeStyle = GLASS;
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(206, 168);
		ctx.quadraticCurveTo(470, 171, 744, 166);
		ctx.stroke();

		// Slat sheen: each board keeps a top-lit falloff, and every third opening carries
		// a warm bounce that picks the deck apart at a glance.
		for (let i = 0; i < SLATS.length; i++) {
			const slatY = SLATS[i];
			const board = ctx.createLinearGradient(0, slatY, 0, slatY + 5.8);
			board.addColorStop(0, 'rgba(255,255,255,0.26)');
			board.addColorStop(0.52, 'rgba(255,255,255,0.07)');
			board.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.globalAlpha = 1;
			ctx.fillStyle = board;
			ctx.fillRect(BODY_L + 2, slatY, BODY_R - BODY_L - 4, 5.8);
			if (i % 3 === 0) {
				ctx.globalAlpha = 0.14;
				ctx.fillStyle = '#FFF3CE';
				ctx.fillRect(BODY_L + 2, slatY + 5.8, BODY_R - BODY_L - 4, 1.2);
			}
		}

		// Deck rails: a polished chrome edge on the belt rub rail, a soft underside, the
		// lower deck lip and the slim highlight along the roof rail.
		ctx.globalAlpha = 1;
		line(ctx, 192, 165.1, 760, 165.1, 'rgba(255,255,255,0.6)', 1.8);
		line(ctx, 192, 167.4, 760, 167.4, 'rgba(58,39,27,0.22)', 1.2);
		line(ctx, 192, 239.4, 760, 239.4, 'rgba(255,255,255,0.34)', 1.4);
		line(ctx, 192, 49.2, 760, 49.2, 'rgba(255,255,255,0.3)', 1.2);
		for (const railX of [194, 742]) {
			rect(ctx, railX, 163.4, 8, 6.4, CHROME, 1.5, 1.2);
		}
		ctx.restore();

		// Glints on the frame rails and the cab roof, clear of the glass and the tyres.
		glint(ctx, 294, 100, 4.4);
		glint(ctx, 410, 155, 3.6);
		glint(ctx, 530, 156, 4);
		glint(ctx, 744, 116, 4.2);
		glint(ctx, 150, 112, 4.4);
		glint(ctx, 320, 62, 2.8);
		glint(ctx, 596, 148, 2.6);
		glint(ctx, 226, 214, 2.8);
		glint(ctx, 778, 63, 2.2);

		// Glass sheen and a sparkle in the side pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 3.4;
		ctx.beginPath();
		ctx.moveTo(58, 172);
		ctx.lineTo(94, 124);
		ctx.stroke();
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(138, 172);
		ctx.lineTo(162, 130);
		ctx.stroke();
		ctx.restore();
		glint(ctx, 168, 140, 3.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Ramp sheen and hardware. The folded leaf lies outside the body shell, so it has
		// its own clip and finish.
		rampFinish(ctx);

		// Rear lamp halo, kept faint and clipped to the body band so no glow spills past
		// the painted underbody.
		ctx.save();
		ctx.beginPath();
		ctx.rect(688, 240, 38, 22);
		ctx.clip();
		const tailGlow = ctx.createRadialGradient(706, 253, 1, 706, 253, 16);
		tailGlow.addColorStop(0, 'rgba(255,77,109,0.3)');
		tailGlow.addColorStop(1, 'rgba(255,77,109,0)');
		ctx.fillStyle = tailGlow;
		ctx.beginPath();
		ctx.arc(706, 253, 16, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Exhaust puff rising past the cab roof.
		ctx.save();
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[185, 109, 3.6],
			[182, 102, 4.2],
			[179, 94, 3.4],
			[177, 86.5, 2.6]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Finishing marks: rail highlight, belt rivets, bumper lip and badge sheen.
		line(ctx, 200, 56.5, 748, 56.5, 'rgba(255,255,255,0.42)', 2);
		line(ctx, 6, 246, 20, 246, 'rgba(255,255,255,0.75)', 1.8);

		ctx.save();
		ctx.fillStyle = CHROME;
		ctx.globalAlpha = 0.62;
		for (let rivetX = 200; rivetX <= 752; rivetX += 24) {
			ctx.beginPath();
			ctx.arc(rivetX, 152, 1.3, 0, Math.PI * 2);
			ctx.fill();
		}

		// Roof-rail and lower-skirt rivets, plus a bright bolt at every stanchion head.
		ctx.globalAlpha = 0.5;
		for (let rivetX = 208; rivetX <= 744; rivetX += 24) {
			ctx.beginPath();
			ctx.arc(rivetX, 50.7, 1.1, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.globalAlpha = 0.38;
		for (let rivetX = 216; rivetX <= 744; rivetX += 32) {
			ctx.beginPath();
			ctx.arc(rivetX, 238.4, 1, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Stanchion-head bolts and the two lamp specks.
		for (const postX of POSTS) {
			circle(ctx, postX + POST_W / 2, 95, 1.2, 'rgba(255,255,255,0.72)', 0.6);
		}
		circle(ctx, 28.6, 231.2, 2.2, '#FFFFFF', 0.8);
		circle(ctx, 704.4, 251.4, 2.2, '#FFD3DB', 0.8);

		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.arc(245, 100, 19.5, Math.PI * 1.08, Math.PI * 1.6);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 2;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.arc(wheelX, WHEEL_L.y, WHEEL_L.r + 7, Math.PI * 1.16, Math.PI * 1.84);
			ctx.stroke();
		}
	}

	ctx.restore();
}

export function drawRealLivestockTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealLivestockTruckLevel(ctx, x, y, scale, 5);
}
