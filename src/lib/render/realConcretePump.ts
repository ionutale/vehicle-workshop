/**
 * Concrete pump truck art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over lorry facing left: orange cab and deck over a teal underframe, a folding
 * multi-section boom stowed along the top of the truck with the delivery pipe snaking over
 * the folds, deployed outriggers, a rear receiving hopper with a chute, hazard chevrons,
 * a roof beacon and works lamps.
 *
 * The boom is its own cut-out piece: the bundled sections, the hinge knuckles, the delivery
 * pipe and the tip nozzle live inside one stepped silhouette so the whole folding arm can be
 * lifted off the truck as cargo. Level 4 is the production target; level 5 adds the
 * picture-book finish: paint grain, boom sheen, glints, hub hardware and the exhaust puff.
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

const ORANGE = '#F4A261';
const TEAL = '#264653';
const TEAL_DARK = '#1A333D';
const TEAL_LIGHT = '#35606E';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** Art box 760 x 340, road at 262. Front (cab) faces left. */
const WHEEL_L = { x: 170, y: 230, r: 32 };
const WHEEL_R = { x: 560, y: 230, r: 32 };

const CAB = 'M24,232 L24,136 Q24,118 42,118 L182,118 Q196,118 196,132 L196,232 Z';
const WINDSCREEN = 'M36,196 L36,144 Q36,136 44,136 L92,136 Q100,136 100,144 L100,196 Z';
const DOOR_GLASS =
	'M116,136 L174,136 Q182,136 182,144 L182,182 Q182,190 174,190 L116,190 Q108,190 108,182 L108,144 Q108,136 116,136 Z';
const GLASS_MASK = `${WINDSCREEN} ${DOOR_GLASS}`;

/** Deck slab with the slewing turret behind the cab, traced as one welded outline. */
const DECK =
	'M196,168 L208,168 L208,152 L220,138 L258,138 L270,152 L270,168 L676,168 L676,198 L196,198 Z';

/** Underframe skirt from the cab to the tail. */
const SKIRT = 'M196,198 L748,198 L748,232 L196,232 Z';

/** Receiving hopper on the tail, open mouthed, with the discharge chute. */
const HOPPER = 'M676,158 L736,158 L744,164 L744,176 L748,182 L748,198 L676,198 Z';

/** The turret face, sitting inside the deck outline. */
const PEDESTAL = 'M208,168 L208,152 L220,138 L258,138 L270,152 L270,168 Z';

const CRADLE_F = 'M318,154 L336,154 L336,168 L318,168 Z';
const CRADLE_R = 'M596,154 L614,154 L614,168 L596,168 Z';

const OUTRIGGER_F = 'M220,232 L236,232 L236,250 L250,250 L250,262 L206,262 L206,250 L220,250 Z';
const OUTRIGGER_R = 'M616,232 L632,232 L632,250 L648,250 L648,262 L604,262 L604,250 L616,250 Z';

const FLAP_F = 'M210,232 L218,232 L218,250 L210,250 Z';
const FLAP_R = 'M596,232 L604,232 L604,250 L596,250 Z';

const BUMPER = 'M10,196 L24,196 L24,234 L10,234 Z';
const MIRROR = 'M8,130 L18,130 L18,154 L8,154 Z';
const MIRROR_ARM = 'M18,142 L24,140 L24,148 L18,150 Z';
const BEACON = 'M56,118 L56,112 Q56,104 64,104 L86,104 Q94,104 94,112 L94,118 Z';
const STACK = 'M198,126 L208,126 L208,168 L198,168 Z';
const PUFF = 'M200,126 Q194,114 206,108 Q216,98 230,102 Q242,106 240,118 Q246,124 242,126 Z';
const TAIL_BAR = 'M700,232 L748,232 L748,242 L740,246 L700,246 Z';

/** Everything the body piece owns: shell, turret, outriggers, fittings. */
const BODY_MASK = [
	CAB,
	DECK,
	SKIRT,
	HOPPER,
	OUTRIGGER_F,
	OUTRIGGER_R,
	FLAP_F,
	FLAP_R,
	CRADLE_F,
	CRADLE_R,
	BUMPER,
	MIRROR,
	MIRROR_ARM,
	BEACON,
	STACK,
	PUFF,
	TAIL_BAR
].join(' ');

/**
 * Folded boom bundle: the root section over the deck, the middle section folded back on top
 * and the tip section folded forward again, so the stack steps up towards the rear.
 * One stepped silhouette, no overlapping subpaths.
 */
const BOOM_BUNDLE =
	'M404,76 L628,76 L628,102 L656,102 L656,154 L270,154 L270,128 L404,128 Z';

const BOOM_S1 = { x: 270, y: 128, w: 386, h: 26 };
const BOOM_S2 = { x: 404, y: 102, w: 252, h: 26 };
const BOOM_S3 = { x: 404, y: 76, w: 224, h: 26 };

/** Delivery line: up over the deck, along each boom section and back at every fold. */
const PIPE: Array<[number, number]> = [
	[272, 141],
	[620, 141],
	[620, 116],
	[412, 116],
	[412, 90],
	[612, 90]
];

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

/** Diagonal hazard chevrons, clipped to a band. */
function hazardStripes(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	phase = 0
): void {
	ctx.save();
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.clip();
	ctx.fillStyle = AMBER;
	ctx.fillRect(x, y, w, h);
	ctx.fillStyle = INK;
	const step = 14;
	for (let i = -h - step; i < w + h; i += step * 2) {
		ctx.beginPath();
		ctx.moveTo(x + i + phase, y + h);
		ctx.lineTo(x + i + phase + step, y + h);
		ctx.lineTo(x + i + phase + step + h, y);
		ctx.lineTo(x + i + phase + h, y);
		ctx.closePath();
		ctx.fill();
	}
	ctx.restore();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.4;
	ctx.strokeRect(x, y, w, h);
}

/** Wheel well behind the tyre and the livery lip over it. */
function wheelArch(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
	ctx.beginPath();
	ctx.arc(cx, cy, 38, Math.PI, Math.PI * 2);
	ctx.closePath();
	ctx.fillStyle = TEAL_DARK;
	ctx.fill();

	ctx.beginPath();
	ctx.arc(cx, cy, 40, Math.PI * 1.02, Math.PI * 1.98);
	ctx.strokeStyle = ORANGE;
	ctx.lineWidth = 5;
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.6;
	ctx.stroke();
}

/** A four-point sparkle with a warm core. */
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

/** Picture-book hub: a machined ring, six bolts and a polished centre cap. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.28, y + Math.sin(a) * r * 0.28, 2.1, CHROME, 1.1);
	}

	ctx.strokeStyle = 'rgba(255,255,255,0.7)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.11, 0, Math.PI * 2);
	ctx.stroke();
}

/** Deterministic paint grain over every painted panel, never the glazing or the tyres. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const painted = [CAB, DECK, SKIRT, HOPPER].join(' ');
	const keepOut = `${GLASS_MASK} ${circleMask(
		WHEEL_L.x,
		WHEEL_L.y,
		WHEEL_L.r + 1
	)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r + 1)}`;

	ctx.save();
	ctx.clip(new Path2D(`${painted} ${keepOut}`), 'evenodd');

	let seed = 71;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 320; i++) {
		const px = 20 + rnd() * 730;
		const py = 100 + rnd() * 150;
		const size = 1.4 + rnd() * 1.3;
		ctx.globalAlpha = 0.07 + rnd() * 0.07;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 130; i++) {
		const px = 20 + rnd() * 730;
		const py = 100 + rnd() * 150;
		const size = 1.3 + rnd() * 1.1;
		ctx.globalAlpha = 0.16 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();

	// Long brush sweeps give the cab and deck panels a hand-painted sheen.
	ctx.save();
	ctx.globalAlpha = 0.12;
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.6;
	for (const [sx, sy, ex, ey] of [
		[44, 210, 186, 208],
		[230, 180, 640, 179],
		[300, 224, 620, 223]
	]) {
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.quadraticCurveTo((sx + ex) / 2, sy - 2.4, ex, ey);
		ctx.stroke();
	}
	ctx.restore();
}

/** A boom section face: livery fill, chord highlight and lower-edge shade. */
function boomSection(
	ctx: CanvasRenderingContext2D,
	section: { x: number; y: number; w: number; h: number },
	fill: string,
	shaded: boolean
): void {
	rect(ctx, section.x, section.y, section.w, section.h, fill, 0, 2.5);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(section.x, section.y, section.w, section.h);
		ctx.clip();
		const tone = ctx.createLinearGradient(0, section.y, 0, section.y + section.h);
		tone.addColorStop(0, 'rgba(255,255,255,0.3)');
		tone.addColorStop(0.45, 'rgba(255,255,255,0.04)');
		tone.addColorStop(1, 'rgba(8,18,24,0.34)');
		ctx.fillStyle = tone;
		ctx.fillRect(section.x, section.y, section.w, section.h);
		ctx.restore();
	}

	line(
		ctx,
		section.x + 6,
		section.y + 3.4,
		section.x + section.w - 8,
		section.y + 3.4,
		'rgba(255,246,228,0.42)',
		1.6
	);
}

/** Delivery pipe, pipe clamps, hinge knuckles and the tip nozzle. */
function drawBoomHardware(ctx: CanvasRenderingContext2D, fitted: boolean): void {
	// Root clamp where the boom leaves the turret.
	rect(ctx, 270, 128, 18, 26, ORANGE, 0, 2);
	line(ctx, 286, 129, 286, 153, INK, 1.6);
	circle(ctx, 277, 141, 2.4, CHROME, 1);

	ctx.save();
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.beginPath();
	ctx.moveTo(PIPE[0][0], PIPE[0][1]);
	for (const [px, py] of PIPE.slice(1)) ctx.lineTo(px, py);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 8;
	ctx.stroke();
	ctx.strokeStyle = STEEL;
	ctx.lineWidth = 5.2;
	ctx.stroke();
	ctx.strokeStyle = 'rgba(255,255,255,0.5)';
	ctx.lineWidth = 1.5;
	ctx.stroke();
	ctx.restore();

	// Tip nozzle, tucked inside the last section.
	rect(ctx, 608, 84, 18, 12, CHROME, 3, 2);
	rect(ctx, 617, 86, 5, 8, RED, 1, 1.2);

	if (!fitted) return;

	// Fold knuckles: rear fold and front fold, with their pins.
	rect(ctx, 642, 122, 14, 14, TEAL_DARK, 2, 2);
	circle(ctx, 649, 129, 3, CHROME, 1.2);
	rect(ctx, 404, 96, 14, 14, TEAL_DARK, 2, 2);
	circle(ctx, 411, 103, 3, CHROME, 1.2);

	// Pipe clamps.
	for (const [cx, cy] of [
		[310, 141],
		[390, 141],
		[470, 141],
		[550, 141],
		[600, 116],
		[500, 116],
		[460, 90],
		[540, 90]
	]) {
		rect(ctx, cx - 4, cy - 6, 8, 12, ORANGE, 2, 1.5);
	}

	// Telescopic seam marks and chord rivets.
	for (const sx of [360, 470, 580]) {
		line(ctx, sx, 130, sx, 152, 'rgba(8,18,24,0.28)', 1.4);
	}
	for (const rx of [320, 360, 440, 480, 560, 600]) {
		circle(ctx, rx, 150, 1.4, 'rgba(8,18,24,0.5)', 0.8);
	}
}

export function drawRealConcretePumpLevel(
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
		ctx.ellipse(382, 270, 352, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Exhaust stack stands in the gap behind the cab.
	shape(ctx, STACK, STEEL, 2.5);
	if (shaded) {
		line(ctx, 200.5, 128, 200.5, 166, 'rgba(255,255,255,0.34)', 1.6);
		line(ctx, 205.5, 128, 205.5, 166, 'rgba(0,0,0,0.3)', 2);
	}
	if (fitted) {
		rect(ctx, 198, 124, 10, 5, TEAL_DARK, 2, 1.8);
		rect(ctx, 199, 142, 8, 3, INK, 1, 1.4);
	}

	// Underframe skirt: hazard tape over a dark lower valance.
	shape(ctx, SKIRT, TEAL, 3);
	rect(ctx, 196, 207, 552, 25, TEAL_DARK, 0, 0);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SKIRT));
		const skirt = ctx.createLinearGradient(0, 198, 0, 232);
		skirt.addColorStop(0, 'rgba(255,255,255,0.16)');
		skirt.addColorStop(1, 'rgba(0,0,0,0.28)');
		ctx.fillStyle = skirt;
		ctx.fillRect(196, 198, 552, 34);
		ctx.restore();
	}
	if (fitted) {
		hazardStripes(ctx, 198, 198, 550, 9, 5);
		// Fuel tank and toolbox slung under the deck.
		rect(ctx, 298, 211, 54, 17, CHROME, 7, 2.2);
		line(ctx, 312, 212, 312, 227, 'rgba(58,39,27,0.35)', 1.4);
		line(ctx, 338, 212, 338, 227, 'rgba(58,39,27,0.35)', 1.4);
		rect(ctx, 366, 211, 44, 17, TEAL_DARK, 3, 2.2);
		rect(ctx, 380, 216, 14, 3, CHROME, 1, 1.2);
		// Long underframe rail seam.
		line(ctx, 200, 214, 744, 214, 'rgba(255,255,255,0.12)', 1.4);
	}

	// Deck slab and its turret.
	shape(ctx, DECK, ORANGE, 3);
	ctx.save();
	ctx.clip(new Path2D(DECK));
	rect(ctx, 196, 168, 480, 5, TEAL_DARK, 0, 0);
	rect(ctx, 196, 186, 480, 3, CREAM, 0, 0);
	rect(ctx, 196, 189, 480, 9, TEAL, 0, 0);
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 168, 0, 198);
		paint.addColorStop(0, 'rgba(255,255,255,0.32)');
		paint.addColorStop(0.55, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(90,40,10,0.16)');
		ctx.fillStyle = paint;
		ctx.fillRect(196, 168, 480, 30);
	}
	ctx.restore();

	if (fitted) {
		// Deck seam and lashing rings along the near face.
		line(ctx, 200, 186, 672, 186, 'rgba(58,39,27,0.16)', 1.3);
		for (const ringX of [238, 292, 424, 470, 640]) {
			circle(ctx, ringX, 183, 2, CHROME, 0.9);
		}
	}

	// Slewing turret: face, base band, slewing ring, boom mount and bolts.
	shape(ctx, PEDESTAL, TEAL_LIGHT, 3);
	rect(ctx, 212, 158, 54, 10, TEAL, 0, 0);
	rect(ctx, 244, 150, 20, 12, TEAL_DARK, 2, 1.8);
	line(ctx, 212, 165, 266, 165, ORANGE, 3);
	line(ctx, 212, 168, 266, 168, 'rgba(0,0,0,0.28)', 1.6);
	circle(ctx, 239, 162, 3.2, CHROME, 1.3);
	circle(ctx, 254, 156, 3.6, CHROME, 1.4);
	circle(ctx, 254, 156, 1.4, STEEL, 1);
	if (fitted) {
		for (let i = 0; i < 5; i++) {
			circle(ctx, 218 + i * 11, 162.5, 1.5, CHROME, 0.9);
		}
	}

	// Boom cradles on the deck.
	shape(ctx, CRADLE_F, TEAL_DARK, 2.5);
	shape(ctx, CRADLE_R, TEAL_DARK, 2.5);
	if (fitted) {
		rect(ctx, 320, 156, 14, 4, CHROME, 1, 1.2);
		rect(ctx, 598, 156, 14, 4, CHROME, 1, 1.2);
	}

	// Receiving hopper: open mouth, funnel walls, chute and caution band.
	shape(ctx, HOPPER, ORANGE, 3);
	ctx.beginPath();
	ctx.moveTo(682, 160);
	ctx.lineTo(737, 160);
	ctx.lineTo(741, 172);
	ctx.lineTo(682, 172);
	ctx.closePath();
	ctx.fillStyle = TEAL_DARK;
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.6;
	ctx.stroke();
	line(ctx, 684, 173, 700, 196, 'rgba(0,0,0,0.18)', 1.6);
	line(ctx, 741, 173, 727, 196, 'rgba(0,0,0,0.18)', 1.6);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(HOPPER));
		const hopper = ctx.createLinearGradient(0, 158, 0, 198);
		hopper.addColorStop(0, 'rgba(255,255,255,0.32)');
		hopper.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		hopper.addColorStop(1, 'rgba(90,40,10,0.24)');
		ctx.fillStyle = hopper;
		ctx.fillRect(676, 158, 72, 40);
		ctx.restore();
	}
	if (fitted) {
		for (let bar = 0; bar < 4; bar++) {
			const bx = 692 + bar * 13;
			line(ctx, bx, 160, bx - 1.5, 172, INK, 2.4);
		}
		hazardStripes(ctx, 680, 181, 62, 12, 2);
		line(ctx, 744, 183, 748, 183, 'rgba(255,255,255,0.5)', 2);
		circle(ctx, 682, 190, 1.6, STEEL, 0.9);
		circle(ctx, 738, 190, 1.6, STEEL, 0.9);
	}

	// Delivery line from the hopper to the turret, along the deck face.
	if (fitted) {
		ctx.save();
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(682, 177);
		ctx.lineTo(262, 177);
		ctx.lineTo(262, 151);
		ctx.strokeStyle = INK;
		ctx.lineWidth = 8;
		ctx.stroke();
		ctx.strokeStyle = STEEL;
		ctx.lineWidth = 5.2;
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.4;
		ctx.stroke();
		ctx.restore();
		for (const clampX of [330, 380, 430, 480, 530, 580, 630]) {
			rect(ctx, clampX - 4, 171, 8, 12, ORANGE, 1.5, 1.3);
		}
	}

	// Outriggers: leg, chrome ram, hazard pad.
	shape(ctx, OUTRIGGER_F, TEAL_DARK, 2.5);
	shape(ctx, OUTRIGGER_R, TEAL_DARK, 2.5);
	rect(ctx, 222, 234, 12, 14, CHROME, 1.5, 1.8);
	rect(ctx, 618, 234, 12, 14, CHROME, 1.5, 1.8);
	if (fitted) {
		hazardStripes(ctx, 206, 250, 44, 12, 3);
		hazardStripes(ctx, 604, 250, 44, 12, 3);
		line(ctx, 214, 250, 242, 250, 'rgba(0,0,0,0.3)', 1.4);
		line(ctx, 612, 250, 640, 250, 'rgba(0,0,0,0.3)', 1.4);
	}

	// Mud flaps behind both axles.
	if (fitted) {
		rect(ctx, 210, 232, 8, 18, '#2B2D42', 1, 1.8);
		rect(ctx, 596, 232, 8, 18, '#2B2D42', 1, 1.8);
	}

	// Tail bumper and lamp cluster.
	shape(ctx, TAIL_BAR, STEEL, 2.5);
	if (fitted) {
		hazardStripes(ctx, 700, 232, 48, 10, 1);
		rect(ctx, 738, 200, 9, 8, RED, 2, 1.6);
		rect(ctx, 738, 210, 9, 6, AMBER, 1.5, 1.4);
		rect(ctx, 706, 200, 24, 12, CREAM, 1, 1.5);
		line(ctx, 709, 203, 728, 203, 'rgba(58,39,27,0.45)', 1.1);
	}

	// Cab shell and livery bands.
	shape(ctx, CAB, ORANGE, 3);
	ctx.save();
	ctx.clip(new Path2D(CAB));
	rect(ctx, 24, 220, 172, 12, TEAL, 0, 0);
	rect(ctx, 24, 217, 172, 3, CREAM, 0, 0);
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 118, 0, 232);
		paint.addColorStop(0, 'rgba(255,255,255,0.4)');
		paint.addColorStop(0.36, 'rgba(255,255,255,0.04)');
		paint.addColorStop(0.82, 'rgba(160,80,30,0.08)');
		paint.addColorStop(1, 'rgba(26,51,61,0.22)');
		ctx.fillStyle = paint;
		ctx.fillRect(22, 116, 176, 118);
	}
	ctx.restore();

	if (fitted) {
		// Roof visor and marker lamps.
		rect(ctx, 30, 120, 104, 6, TEAL_DARK, 3, 2.4);
		rect(ctx, 34, 128, 8, 3, AMBER, 1, 1);
		rect(ctx, 46, 128, 8, 3, AMBER, 1, 1);

		// Grille, headlamp and indicator on the nose.
		rect(ctx, 26, 198, 10, 16, TEAL_DARK, 2, 1.8);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 27.5, 200 + bar * 3.6, 34.5, 200 + bar * 3.6, 'rgba(201,210,222,0.7)', 1.1);
		}
		circle(ctx, 34, 221, 6.2, LAMP, 2.2);
		circle(ctx, 33, 219.6, 3, '#FFF7CF', 1.2);
		circle(ctx, 48, 224, 3.2, AMBER, 1.5);
	}

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 36, 136, 64, 60);
		shadeGlass(ctx, DOOR_GLASS, 108, 136, 74, 54);
	}
	if (fitted) {
		line(ctx, 48, 190, 74, 164, INK, 2.2);
		line(ctx, 82, 190, 94, 176, INK, 1.8);
		line(ctx, 104, 136, 104, 196, INK, 2.4);
		line(ctx, 107, 136, 107, 194, 'rgba(255,255,255,0.3)', 1.2);
	}

	// Cab door: panel, waist band, handle and hinges.
	if (fitted) {
		rect(ctx, 106, 196, 88, 36, ORANGE, 2, 2.2);
		rect(ctx, 106, 220, 88, 12, TEAL, 0, 0);
		rect(ctx, 106, 217, 88, 3, CREAM, 0, 0);
		rect(ctx, 184, 204, 6, 14, CHROME, 1.5, 1.5);
		rect(ctx, 109, 200, 4, 8, STEEL, 1, 1.3);
		rect(ctx, 109, 210, 4, 8, STEEL, 1, 1.3);
		line(ctx, 108, 214, 192, 214, 'rgba(58,39,27,0.2)', 1.2);
	}

	// Beacon.
	shape(ctx, BEACON, AMBER, 2);
	rect(ctx, 56, 113, 38, 5, TEAL_DARK, 1.5, 1.8);
	if (fitted) {
		line(ctx, 64, 106, 64, 114, 'rgba(255,255,255,0.7)', 1.6);
		line(ctx, 78, 106, 78, 114, 'rgba(255,255,255,0.5)', 1.2);
	}

	// Mirror and bumper.
	shape(ctx, MIRROR_ARM, TEAL_DARK, 2);
	shape(ctx, MIRROR, TEAL_DARK, 2.2);
	rect(ctx, 10, 133, 6, 18, GLASS, 1, 1);
	shape(ctx, BUMPER, CHROME, 2.5);
	if (fitted) {
		circle(ctx, 17, 202, 1.8, STEEL, 0.9);
		circle(ctx, 17, 228, 1.8, STEEL, 0.9);
		rect(ctx, 12, 208, 10, 5, ORANGE, 1, 1.2);
	}

	// Folded boom: one stepped bundle, then its hardware.
	shape(ctx, BOOM_BUNDLE, TEAL, 3);
	boomSection(ctx, BOOM_S1, TEAL, shaded);
	boomSection(ctx, BOOM_S2, TEAL_LIGHT, shaded);
	boomSection(ctx, BOOM_S3, TEAL, shaded);
	drawBoomHardware(ctx, fitted);

	// Wheel arches, then the tyres.
	if (fitted) {
		wheelArch(ctx, WHEEL_L.x, WHEEL_L.y);
		wheelArch(ctx, WHEEL_R.x, WHEEL_R.y);
	}

	// Both wheels share the one wheel part; the rear tile is its exact mirror.
	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r, finish);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r, finish);

	if (lit) {
		// Rim light: cab roof, nose, deck edge and the boom chords.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(46, 120);
		ctx.lineTo(180, 120);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(25.5, 142);
		ctx.lineTo(25.5, 226);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(276, 169.5);
		ctx.lineTo(654, 169.5);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(410, 77.5);
		ctx.lineTo(624, 77.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(410, 103.5);
		ctx.lineTo(650, 103.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(276, 129.5);
		ctx.lineTo(648, 129.5);
		ctx.stroke();

		// Headlight glow and the beacon flash.
		const glow = ctx.createRadialGradient(34, 221, 1, 34, 221, 28);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(34, 221, 28, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(74, 108, 1, 74, 108, 22);
		beacon.addColorStop(0, 'rgba(255,183,3,0.55)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(74, 108, 22, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelX of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wheelX, 262, 27, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// A polished run down the top chord of the folded bundle.
		ctx.save();
		ctx.clip(new Path2D(BOOM_BUNDLE));
		ctx.globalAlpha = 0.32;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(410, 80);
		ctx.lineTo(620, 80);
		ctx.stroke();
		ctx.globalAlpha = 0.16;
		ctx.lineWidth = 6;
		ctx.beginPath();
		ctx.moveTo(410, 122);
		ctx.lineTo(646, 122);
		ctx.stroke();
		ctx.restore();

		// Glass sheen.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 3.6;
		ctx.beginPath();
		ctx.moveTo(50, 188);
		ctx.lineTo(82, 142);
		ctx.stroke();
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(128, 184);
		ctx.lineTo(152, 144);
		ctx.stroke();
		ctx.restore();

		// Exhaust puff drifting off the stack.
		ctx.save();
		ctx.clip(new Path2D(PUFF));
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = '#D5DCE5';
		for (const [px, py, pr] of [
			[212, 116, 5],
			[226, 108, 6],
			[240, 110, 4.4]
		] as Array<[number, number, number]>) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Glints on paint, glass and chrome, clear of the tyres.
		glint(ctx, 300, 178, 5);
		glint(ctx, 470, 82, 4.2);
		glint(ctx, 90, 148, 4.6);
		glint(ctx, 240, 160, 3.6);
		glint(ctx, 620, 148, 3.4);
		glint(ctx, 708, 168, 3.2);

		// Hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		// Finishing marks: paint chips on the working edges and soot on the cab roof.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[46, 228, 8, 2.2, 0.42],
			[142, 228, 6, 2, 0.34],
			[286, 192, 10, 2, 0.32],
			[452, 192, 7, 2, 0.3],
			[736, 194, 4, 2.4, 0.4]
		] as Array<[number, number, number, number, number]>) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();

		ctx.save();
		ctx.globalAlpha = 0.14;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(196, 124, 9, 3.4, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Outrigger pads: bright top edges.
		for (const padX of [228, 626]) {
			line(ctx, padX - 20, 250.6, padX + 20, 250.6, 'rgba(255,255,255,0.72)', 1.8);
		}
	}

	ctx.restore();
}

export function drawRealConcretePump(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealConcretePumpLevel(ctx, x, y, scale, 5);
}
