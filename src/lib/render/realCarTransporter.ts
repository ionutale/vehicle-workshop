/**
 * Car transporter art, cut into the same five-piece kit as the other realistic vehicles.
 * A cab-over lorry facing left: a compact cab, a low deck and a raised upper deck held
 * by side posts, a slate-and-gold livery, two small cars loaded (one low, one high), a
 * hydraulic ram and a tail ramp.
 *
 * The decks, posts, ram and both load cars are baked into the body piece. Level 5 is the
 * production target: shaded, fitted, lit and finished with paint grain, deck and car sheen,
 * glints and hub hardware.
 */

import {
	CHROME,
	GLASS,
	INK,
	STEEL,
	TIRE,
	circle,
	circleMask,
	line,
	rect,
	rectMask,
	shape,
	wheel
} from './realKit';

const SLATE = '#577590';
const SLATE_DARK = '#415C78';
const SLATE_DEEP = '#2E4459';
const GOLD = '#F9C74F';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const RED = '#E0455A';

/** Art box 860 x 340, road at 272. Front (cab) faces left. */
const CAB = 'M24,252 L24,132 Q24,116 40,116 L174,116 Q190,116 190,132 L190,252 Z';
const VISOR = { x: 38, y: 106, w: 78, h: 10 };

const WINDSCREEN = 'M32,190 L32,142 Q32,132 42,132 L88,132 Q96,132 96,142 L96,190 Z';
const DOOR_GLASS =
	'M118,178 L118,142 Q118,132 128,132 L168,132 Q178,132 178,142 L178,178 Z';
const GLASS_MASK = `${WINDSCREEN} ${DOOR_GLASS}`;
const DOOR = { x: 118, y: 184, w: 60, h: 62 };

const MIRROR_HEAD =
	'M6,134 Q6,130 10,130 L18,130 Q22,130 22,134 L22,158 Q22,162 18,162 L10,162 Q6,162 6,158 Z';
const MIRROR_ARM = 'M22,144 L24,144 L24,152 L22,152 Z';
const BUMPER = { x: 6, y: 238, w: 18, h: 26 };
const STEP = { x: 120, y: 252, w: 70, h: 6 };

/** Exhaust stack and its picture-book puff, tucked into the gap behind the cab. */
const STACK = { x: 194, y: 124, w: 12, h: 58 };
const PUFF = 'M196,124 Q194,119 198,115 Q202,111 207,112 Q211,114 209,118 Q212,121 207,124 Z';

/** Decks, skirts and frames. Their edges abut so the body mask stays hole-free. */
const FRONT_GUSSET = 'M150,108 L150,116 L118,116 Z';
const UPPER_DECK = { x: 150, y: 96, w: 666, h: 12 };
const LOWER_DECK = { x: 190, y: 182, w: 622, h: 18 };
const SKIRT_FRONT = { x: 214, y: 200, w: 386, h: 44 };
const SKIRT_REAR = { x: 686, y: 200, w: 126, h: 44 };
const UNDER_BOX = { x: 190, y: 200, w: 24, h: 44 };
const CHASSIS = { x: 190, y: 244, w: 634, h: 14 };
const REAR_BUMPER = { x: 792, y: 258, w: 32, h: 8 };
const POSTS = [236, 386, 596, 800];
const BRACE = 'M250,110 L378,176 L378,180 L250,114 Z';
const RAM = 'M700,173 L792,108 L792,117 L700,182 Z';
const RAMP = 'M812,202 L852,262 L838,270 L812,216 Z';

/** Access ladder behind the cab, and a deck box for the lashing gear. */
const LADDER = [
	rectMask(214, 112, 4, 70),
	rectMask(228, 112, 4, 70),
	rectMask(218, 124, 10, 4),
	rectMask(218, 140, 10, 4),
	rectMask(218, 156, 10, 4),
	rectMask(218, 172, 10, 4)
];
const DECK_BOX = rectMask(196, 78, 40, 18);

const WHEEL_L = { x: 150, y: 236, r: 36 };
const WHEEL_R = { x: 650, y: 236, r: 36 };

interface LoadedCar {
	body: string;
	glass: string[];
	/** One bright diagonal per pane, picture-book only. */
	sheen: Array<[number, number, number, number]>;
	wheels: Array<[number, number]>;
	fill: string;
	left: number;
	right: number;
	top: number;
	base: number;
}

/** Upper load: gold hatchback sitting on the raised deck. */
const UPPER_LOAD: LoadedCar = {
	body: 'M250,96 L250,90 Q250,86 256,85 L274,82 L290,61 Q294,55 302,55 L340,55 Q348,55 352,61 L368,76 L386,79 Q396,80 396,86 L396,96 Z',
	glass: ['M286,80 L300,62 L316,62 L316,80 Z', 'M330,62 L342,62 L352,74 L330,74 Z'],
	sheen: [
		[292, 78, 308, 64],
		[333, 72, 347, 65]
	],
	wheels: [
		[280, 88],
		[370, 88]
	],
	fill: GOLD,
	left: 250,
	right: 396,
	top: 55,
	base: 96
};

/** Lower load: cream saloon tucked under the upper deck. */
const LOWER_LOAD: LoadedCar = {
	body: 'M440,182 L440,176 Q440,172 446,171 L464,168 L478,147 Q482,141 490,141 L524,141 Q532,141 536,147 L550,162 L576,165 Q586,166 586,172 L586,182 Z',
	glass: ['M478,164 L492,147 L510,147 L510,164 Z', 'M518,147 L534,147 L542,160 L518,160 Z'],
	sheen: [
		[482, 162, 498, 149],
		[521, 158, 533, 150]
	],
	wheels: [
		[468, 174],
		[548, 174]
	],
	fill: CREAM,
	left: 440,
	right: 586,
	top: 141,
	base: 182
};

/**
 * One silhouette for the whole load bed. Every subpath abuts its neighbour instead of
 * overlapping, so the evenodd clip never punches an accidental hole.
 */
const BODY_MASK = [
	CAB,
	rectMask(VISOR.x, VISOR.y, VISOR.w, VISOR.h),
	MIRROR_HEAD,
	MIRROR_ARM,
	rectMask(BUMPER.x, BUMPER.y, BUMPER.w, BUMPER.h),
	rectMask(STEP.x, STEP.y, STEP.w, STEP.h),
	rectMask(STACK.x, STACK.y, STACK.w, STACK.h),
	PUFF,
	FRONT_GUSSET,
	rectMask(UPPER_DECK.x, UPPER_DECK.y, UPPER_DECK.w, UPPER_DECK.h),
	rectMask(LOWER_DECK.x, LOWER_DECK.y, LOWER_DECK.w, LOWER_DECK.h),
	rectMask(SKIRT_FRONT.x, SKIRT_FRONT.y, SKIRT_FRONT.w, SKIRT_FRONT.h),
	rectMask(SKIRT_REAR.x, SKIRT_REAR.y, SKIRT_REAR.w, SKIRT_REAR.h),
	rectMask(UNDER_BOX.x, UNDER_BOX.y, UNDER_BOX.w, UNDER_BOX.h),
	rectMask(CHASSIS.x, CHASSIS.y, CHASSIS.w, CHASSIS.h),
	rectMask(REAR_BUMPER.x, REAR_BUMPER.y, REAR_BUMPER.w, REAR_BUMPER.h),
	...POSTS.map((px) => rectMask(px, 108, 12, 74)),
	BRACE,
	RAM,
	RAMP,
	...LADDER,
	DECK_BOX,
	UPPER_LOAD.body,
	LOWER_LOAD.body
].join(' ');

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

/** Dark arch band with a livery trim, clipped to the panel it is cut into. */
function wheelArch(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	clip: string,
	outer = 43,
	inner = 36
): void {
	ctx.save();
	ctx.clip(new Path2D(clip));
	ctx.beginPath();
	ctx.arc(cx, cy, outer, Math.PI, Math.PI * 2);
	ctx.arc(cx, cy, inner, Math.PI * 2, Math.PI, true);
	ctx.closePath();
	ctx.fillStyle = SLATE_DEEP;
	ctx.fill();

	ctx.strokeStyle = GOLD;
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(cx, cy, outer - 1.6, Math.PI * 1.03, Math.PI * 1.97);
	ctx.stroke();
	ctx.restore();
}

/** One of the two loaded cars: shell, glass, wheels, straps and a little trim. */
function drawLoadedCar(
	ctx: CanvasRenderingContext2D,
	car: LoadedCar,
	shaded: boolean,
	fitted: boolean
): void {
	shape(ctx, car.body, car.fill, 2.4);

	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(car.body));
		const paint = ctx.createLinearGradient(0, car.top, 0, car.base);
		paint.addColorStop(0, 'rgba(255,255,255,0.44)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.05)');
		paint.addColorStop(1, 'rgba(20,12,26,0.24)');
		ctx.fillStyle = paint;
		ctx.fillRect(car.left - 4, car.top - 4, car.right - car.left + 8, car.base - car.top + 8);
		ctx.restore();
	}

	for (const pane of car.glass) {
		shape(ctx, pane, GLASS, 1.5);
		if (shaded) shadeGlass(ctx, pane, car.left, car.top, car.right - car.left, car.base - car.top);
	}

	for (const [wx, wy] of car.wheels) {
		circle(ctx, wx, wy, 8, TIRE, 1.8);
		circle(ctx, wx, wy, 3, CHROME, 1.1);
	}

	if (fitted) {
		// Waist crease, door shut and a headlamp at the nose.
		line(ctx, car.left + 8, car.base - 10, car.right - 8, car.base - 10, 'rgba(58,39,27,0.26)', 1.3);
		circle(ctx, car.left + 8, car.base - 8, 2.5, LAMP, 1.1);
		line(ctx, car.left + 30, car.base - 26, car.left + 30, car.base - 12, 'rgba(58,39,27,0.24)', 1.2);

		// Lashing straps hooked over the front and rear tyres.
		for (const [wx] of car.wheels) {
			line(ctx, wx - 13, car.base + 2, wx + 7, car.base - 22, 'rgba(58,39,27,0.5)', 2);
			line(ctx, wx - 13, car.base + 2, wx - 6, car.base + 2, INK, 1.6);
		}
	}
}

/** Run `paint` at the front wheel and again at the rear as its exact mirror. */
function atBothWheels(ctx: CanvasRenderingContext2D, paint: (cx: number) => void): void {
	paint(WHEEL_L.x);
	ctx.save();
	ctx.translate(WHEEL_L.x + WHEEL_R.x, 0);
	ctx.scale(-1, 1);
	paint(WHEEL_L.x);
	ctx.restore();
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

/** Picture-book hub: machined ring, crescent and a polished centre cap. */
function hubDetail(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
	ctx.strokeStyle = 'rgba(58,39,27,0.34)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
	ctx.stroke();

	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.36, Math.PI * 1.06, Math.PI * 1.58);
	ctx.stroke();

	line(ctx, cx - r * 0.25, cy + r * 0.3, cx - r * 0.35, cy + r * 0.17, CHROME, 1.8);
	circle(ctx, cx - r * 0.02, cy - r * 0.02, r * 0.06, CREAM, 0.6);
}

/** A loaded car's picture-book gloss: a flank sweep and angled catchlights in the glass. */
function carSheen(ctx: CanvasRenderingContext2D, car: LoadedCar): void {
	const h = car.base - car.top;

	ctx.save();
	ctx.clip(new Path2D(car.body));
	const gloss = ctx.createLinearGradient(car.left, car.base, car.right, car.top);
	gloss.addColorStop(0, 'rgba(255,255,255,0)');
	gloss.addColorStop(0.48, 'rgba(255,255,255,0.17)');
	gloss.addColorStop(0.64, 'rgba(255,255,255,0.02)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(car.left - 2, car.top - 2, car.right - car.left + 4, h + 4);

	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 1.8;
	ctx.beginPath();
	ctx.moveTo(car.left + 12, car.base - h * 0.6);
	ctx.quadraticCurveTo(
		(car.left + car.right) / 2,
		car.base - h * 0.88,
		car.right - 14,
		car.base - h * 0.56
	);
	ctx.stroke();
	ctx.restore();

	ctx.save();
	ctx.clip(new Path2D(car.glass.join(' ')));
	ctx.strokeStyle = 'rgba(255,255,255,0.66)';
	ctx.lineWidth = 2.2;
	for (const [gx, gy, gx2, gy2] of car.sheen) {
		ctx.beginPath();
		ctx.moveTo(gx, gy);
		ctx.lineTo(gx2, gy2);
		ctx.stroke();
	}
	ctx.restore();
}

/** Polished run down a deck fascia: soft band plus a crisp catchlight, clipped to the deck. */
function deckSheen(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number
): void {
	ctx.save();
	ctx.clip(new Path2D(rectMask(x, y, w, h)));

	const gloss = ctx.createLinearGradient(0, y, 0, y + h);
	gloss.addColorStop(0, 'rgba(255,255,255,0.3)');
	gloss.addColorStop(0.44, 'rgba(255,255,255,0.08)');
	gloss.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = gloss;
	ctx.fillRect(x, y, w, h);

	ctx.strokeStyle = 'rgba(255,255,255,0.42)';
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.moveTo(x + 6, y + 3.4);
	ctx.bezierCurveTo(x + w * 0.34, y + 2.6, x + w * 0.68, y + 3.8, x + w - 5, y + 3);
	ctx.stroke();
	ctx.restore();
}

/** Deterministic picture-book grain over painted panels, never glass or tyres. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${GLASS_MASK} ${UPPER_LOAD.glass.join(' ')} ${LOWER_LOAD.glass.join(' ')} ${circleMask(
		WHEEL_L.x,
		WHEEL_L.y,
		WHEEL_L.r
	)} ${circleMask(WHEEL_R.x, WHEEL_R.y, WHEEL_R.r)}`;

	ctx.save();
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');
	let seed = 73;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 400; i++) {
		const px = 4 + rnd() * 848;
		const py = 52 + rnd() * 214;
		ctx.globalAlpha = 0.09 + rnd() * 0.09;
		const size = 1.4 + rnd() * 1.4;
		ctx.fillRect(px, py, size, size * (0.6 + rnd() * 0.7));
	}

	// A few broader flecks so the grain reads at picture-book size.
	ctx.fillStyle = INK;
	for (let i = 0; i < 26; i++) {
		const px = 4 + rnd() * 848;
		const py = 52 + rnd() * 214;
		ctx.globalAlpha = 0.06 + rnd() * 0.05;
		const size = 2.6 + rnd() * 1.8;
		ctx.fillRect(px, py, size, size * (0.5 + rnd() * 0.6));
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 165; i++) {
		const px = 4 + rnd() * 848;
		const py = 52 + rnd() * 214;
		ctx.globalAlpha = 0.18 + rnd() * 0.12;
		const size = 1.2 + rnd() * 1.2;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();

	// Long brush sweeps along the two deck fascias.
	ctx.save();
	ctx.clip(new Path2D(rectMask(UPPER_DECK.x, UPPER_DECK.y, UPPER_DECK.w, UPPER_DECK.h)));
	ctx.strokeStyle = 'rgba(255,255,255,0.18)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(158, 98.5);
	ctx.bezierCurveTo(360, 97, 610, 99.5, 810, 98);
	ctx.stroke();
	ctx.restore();

	ctx.save();
	ctx.clip(new Path2D(rectMask(LOWER_DECK.x, LOWER_DECK.y, LOWER_DECK.w, LOWER_DECK.h)));
	ctx.strokeStyle = 'rgba(255,255,255,0.16)';
	ctx.lineWidth = 2.2;
	ctx.beginPath();
	ctx.moveTo(198, 184.5);
	ctx.bezierCurveTo(380, 183, 600, 185.5, 806, 184);
	ctx.stroke();
	ctx.restore();
}

export function drawRealCarTransporterLevel(
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
		ctx.ellipse(430, 280, 402, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis rails and the frame the decks sit on.
	rect(ctx, CHASSIS.x, CHASSIS.y, CHASSIS.w, CHASSIS.h, STEEL, 4, 2.5);
	if (shaded) rect(ctx, CHASSIS.x + 6, CHASSIS.y + 1, CHASSIS.w - 12, 3, '#8A93A3', 0, 0);
	line(ctx, 196, 255, 820, 255, 'rgba(58,39,27,0.35)', 1.6);

	// Rear underride bar.
	rect(
		ctx,
		REAR_BUMPER.x,
		REAR_BUMPER.y,
		REAR_BUMPER.w,
		REAR_BUMPER.h,
		CHROME,
		2,
		2.2
	);

	// Aero skirts under the lower deck, split around the rear wheel.
	rect(ctx, UNDER_BOX.x, UNDER_BOX.y, UNDER_BOX.w, UNDER_BOX.h, SLATE_DARK, 2, 2.8);
	line(ctx, 194, 214, 210, 214, 'rgba(201,210,222,0.45)', 1.4);
	line(ctx, 194, 220, 210, 220, 'rgba(201,210,222,0.45)', 1.4);
	rect(ctx, 211, 222, 3, 12, CHROME, 1, 1.2);
	rect(ctx, SKIRT_FRONT.x, SKIRT_FRONT.y, SKIRT_FRONT.w, SKIRT_FRONT.h, SLATE_DARK, 2, 3);
	rect(ctx, SKIRT_REAR.x, SKIRT_REAR.y, SKIRT_REAR.w, SKIRT_REAR.h, SLATE_DARK, 2, 3);
	rect(ctx, 220, 210, 374, 6, GOLD, 2, 1.6);
	rect(ctx, 692, 210, 114, 6, GOLD, 2, 1.6);

	if (shaded) {
		ctx.save();
		ctx.clip(
			new Path2D(
				`${rectMask(SKIRT_FRONT.x, SKIRT_FRONT.y, SKIRT_FRONT.w, SKIRT_FRONT.h)} ${rectMask(
					SKIRT_REAR.x,
					SKIRT_REAR.y,
					SKIRT_REAR.w,
					SKIRT_REAR.h
				)}`
			)
		);
		const skirt = ctx.createLinearGradient(0, 200, 0, 244);
		skirt.addColorStop(0, 'rgba(255,255,255,0.2)');
		skirt.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		skirt.addColorStop(1, 'rgba(12,24,36,0.26)');
		ctx.fillStyle = skirt;
		ctx.fillRect(210, 198, 610, 48);
		ctx.restore();
	}

	if (fitted) {
		// Fuel tank, toolbox and the skirt seams.
		rect(ctx, 250, 220, 66, 19, CHROME, 9, 2.2);
		line(ctx, 264, 221, 264, 238, 'rgba(58,39,27,0.32)', 1.4);
		line(ctx, 300, 221, 300, 238, 'rgba(58,39,27,0.32)', 1.4);
		rect(ctx, 712, 220, 52, 19, SLATE, 3, 2.2);
		rect(ctx, 730, 226, 14, 4, CHROME, 1, 1.4);

		for (const seam of [296, 366, 436, 506, 570]) {
			line(ctx, seam, 202, seam, 242, 'rgba(12,24,36,0.2)', 1.3);
		}
		for (const seam of [740, 776]) {
			line(ctx, seam, 202, seam, 242, 'rgba(12,24,36,0.2)', 1.3);
		}

		// Rear lamp cluster and plate on the tail skirt.
		rect(ctx, 794, 206, 10, 14, RED, 2, 1.8);
		rect(ctx, 794, 222, 10, 9, AMBER, 1.5, 1.5);
		rect(ctx, 770, 220, 20, 11, CREAM, 1, 1.5);
		line(ctx, 773, 223, 787, 223, 'rgba(58,39,27,0.42)', 1);

		// Amber side markers along the skirt tops.
		for (const lampX of [244, 334, 424, 514, 724, 784]) {
			circle(ctx, lampX, 204, 2.2, AMBER, 1);
		}
	}

	// Lower deck: slate slab, gold top stripe and a dark underside.
	rect(ctx, LOWER_DECK.x, LOWER_DECK.y, LOWER_DECK.w, LOWER_DECK.h, SLATE, 2, 3);
	rect(ctx, 194, 185, 614, 4, GOLD, 0, 0);
	rect(ctx, 190, 196, 622, 4, SLATE_DEEP, 0, 0);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(rectMask(LOWER_DECK.x, LOWER_DECK.y, LOWER_DECK.w, LOWER_DECK.h)));
		const deck = ctx.createLinearGradient(0, 182, 0, 200);
		deck.addColorStop(0, 'rgba(255,255,255,0.28)');
		deck.addColorStop(0.5, 'rgba(255,255,255,0.02)');
		deck.addColorStop(1, 'rgba(12,24,36,0.24)');
		ctx.fillStyle = deck;
		ctx.fillRect(188, 180, 626, 22);
		ctx.restore();
	}

	if (fitted) {
		// Rear wheel arch shadow cut into the deck edge.
		wheelArch(
			ctx,
			WHEEL_R.x,
			WHEEL_R.y,
			rectMask(LOWER_DECK.x, LOWER_DECK.y, LOWER_DECK.w, LOWER_DECK.h),
			45,
			37
		);

		// Lashing rings along the deck face.
		for (const ringX of [248, 320, 470, 660, 730]) {
			circle(ctx, ringX, 192, 2.3, CHROME, 1.1);
		}
	}

	// Exhaust stack stands in the gap behind the cab.
	rect(ctx, STACK.x, STACK.y, STACK.w, STACK.h, STEEL, 4, 2.5);
	if (shaded) {
		line(ctx, 197, 128, 197, 180, 'rgba(255,255,255,0.3)', 1.5);
		line(ctx, 204, 128, 204, 180, 'rgba(0,0,0,0.28)', 1.8);
	}
	if (fitted) {
		rect(ctx, 195, 125, 10, 4, SLATE_DARK, 1.5, 2);
		rect(ctx, 194, 142, 12, 3, INK, 1, 1.4);
	}

	// Cab shell and livery.
	shape(ctx, CAB, SLATE);
	ctx.save();
	ctx.clip(new Path2D(CAB));
	rect(ctx, 24, 208, 166, 44, SLATE_DARK, 0, 0);
	rect(ctx, 24, 192, 166, 10, GOLD, 0, 0);
	rect(ctx, 24, 202, 166, 3, CREAM, 0, 0);
	if (shaded) {
		const paint = ctx.createLinearGradient(0, 116, 0, 252);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		paint.addColorStop(1, 'rgba(18,30,44,0.26)');
		ctx.fillStyle = paint;
		ctx.fillRect(22, 114, 170, 140);
	}
	ctx.restore();

	// Roof visor, glass and their shading.
	rect(ctx, VISOR.x, VISOR.y, VISOR.w, VISOR.h, SLATE_DARK, 2, 2.5);
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, DOOR_GLASS, GLASS, 2.5);
	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 32, 132, 64, 58);
		shadeGlass(ctx, DOOR_GLASS, 118, 132, 60, 46);
	}

	// Door panel, handle, hinges and sill.
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, DOOR.h, SLATE, 2.5, 2.5);
	rect(ctx, DOOR.x, DOOR.y, DOOR.w, 4, GOLD, 0, 0);
	rect(ctx, 166, 204, 7, 15, CHROME, 3, 1.8);
	rect(ctx, 122, 190, 4, 8, STEEL, 1, 1.4);
	rect(ctx, 122, 222, 4, 8, STEEL, 1, 1.4);
	line(ctx, 120, 214, 176, 214, 'rgba(58,39,27,0.2)', 1.3);

	// Mirrors, bumper, step.
	shape(ctx, MIRROR_ARM, SLATE_DARK, 2);
	shape(ctx, MIRROR_HEAD, SLATE_DARK, 2.2);
	rect(ctx, 9, 133, 10, 25, GLASS, 2, 1.4);
	rect(ctx, BUMPER.x, BUMPER.y, BUMPER.w, BUMPER.h, CHROME, 4, 2.5);
	rect(ctx, STEP.x, STEP.y, STEP.w, STEP.h, CHROME, 2, 2.2);

	if (fitted) {
		// Vent grille, headlamp and markers on the nose.
		rect(ctx, 34, 208, 58, 9, SLATE_DEEP, 2, 2);
		for (let bar = 1; bar <= 3; bar++) {
			line(ctx, 37, 208 + bar * 2.4, 88, 208 + bar * 2.4, 'rgba(201,210,222,0.5)', 1);
		}
		circle(ctx, 44, 228, 8, GOLD, 2.4);
		circle(ctx, 44, 228, 4.4, LAMP, 1.4);
		circle(ctx, 100, 212, 3.6, AMBER, 1.6);

		// Roof marker lamps on the visor.
		rect(ctx, 50, 107, 7, 3, AMBER, 1, 1);
		rect(ctx, 68, 107, 7, 3, AMBER, 1, 1);
		rect(ctx, 86, 107, 7, 3, AMBER, 1, 1);

		// Wipers on the screen.
		line(ctx, 44, 186, 72, 160, INK, 2.2);
		line(ctx, 78, 186, 96, 168, INK, 1.8);

		// Bumper bolts and the front wheel arch.
		circle(ctx, 15, 244, 2, STEEL, 1);
		circle(ctx, 15, 258, 2, STEEL, 1);
		wheelArch(ctx, WHEEL_L.x, WHEEL_L.y, CAB, 43, 36);
	}

	// Front fairing and the raised deck.
	shape(ctx, FRONT_GUSSET, SLATE_DARK, 2.4);
	rect(ctx, UPPER_DECK.x, UPPER_DECK.y, UPPER_DECK.w, UPPER_DECK.h, SLATE, 2, 3);
	rect(ctx, 154, 99, 658, 4, GOLD, 0, 0);
	rect(ctx, 150, 104, 666, 4, SLATE_DEEP, 0, 0);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(rectMask(UPPER_DECK.x, UPPER_DECK.y, UPPER_DECK.w, UPPER_DECK.h)));
		const deck = ctx.createLinearGradient(0, 96, 0, 108);
		deck.addColorStop(0, 'rgba(255,255,255,0.26)');
		deck.addColorStop(0.55, 'rgba(255,255,255,0.02)');
		deck.addColorStop(1, 'rgba(12,24,36,0.24)');
		ctx.fillStyle = deck;
		ctx.fillRect(148, 94, 670, 16);
		ctx.restore();
	}

	// Deck box for lashing gear, sitting on the front of the raised deck.
	rect(ctx, 196, 78, 40, 18, SLATE_DARK, 3, 2.4);
	rect(ctx, 200, 82, 32, 4, GOLD, 0, 0);
	rect(ctx, 210, 90, 12, 3, CHROME, 1, 1.4);

	// Load: one car low, one high.
	drawLoadedCar(ctx, LOWER_LOAD, shaded, fitted);
	drawLoadedCar(ctx, UPPER_LOAD, shaded, fitted);

	// Deck posts and the one diagonal brace in the open bay.
	for (const px of POSTS) {
		rect(ctx, px, 108, 12, 74, SLATE, 1.5, 2.5);
		rect(ctx, px + 3, 112, 3, 66, GOLD, 0, 0);
		if (fitted) {
			circle(ctx, px + 6, 113.5, 1.6, CHROME, 0.8);
			circle(ctx, px + 6, 176.5, 1.6, CHROME, 0.8);
		}
	}
	shape(ctx, BRACE, SLATE_DARK, 2.2);
	if (shaded) line(ctx, 256, 114, 375, 175.5, 'rgba(255,255,255,0.26)', 1.6);

	// Access ladder from the lower deck up behind the cab.
	rect(ctx, 214, 112, 4, 70, STEEL, 2, 1.8);
	rect(ctx, 228, 112, 4, 70, STEEL, 2, 1.8);
	for (const rungY of [124, 140, 156, 172]) {
		rect(ctx, 218, rungY, 10, 4, CHROME, 1, 1.4);
	}
	if (fitted) {
		for (const boltY of [116, 178]) {
			circle(ctx, 216, boltY, 1.4, CHROME, 0.7);
			circle(ctx, 230, boltY, 1.4, CHROME, 0.7);
		}
	}

	// Hydraulic ram raising the rear of the upper deck.
	shape(ctx, RAM, STEEL, 2.4);
	if (fitted) {
		line(ctx, 704, 178, 758, 138, INK, 14);
		line(ctx, 704, 178, 758, 138, SLATE_DEEP, 10);
		line(ctx, 705, 176, 756, 138, 'rgba(255,255,255,0.24)', 2.4);
		line(ctx, 758, 138, 789, 115, INK, 9);
		line(ctx, 758, 138, 789, 115, CHROME, 5);
		line(ctx, 757, 139, 766, 132, GOLD, 4);
		circle(ctx, 705, 177, 4, CHROME, 1.6);
		circle(ctx, 789, 114, 3.6, CHROME, 1.4);
	}

	// Tail ramp with cross rungs.
	shape(ctx, RAMP, STEEL, 2.4);
	for (const t of [0.14, 0.34, 0.54, 0.74]) {
		const rx = 812 + 40 * t;
		const ry = 202 + 60 * t;
		line(ctx, rx, ry, 812 + 26 * t, 216 + 54 * t, INK, 1.4);
	}
	if (fitted) {
		line(ctx, 815, 207, 849, 255, GOLD, 2.2);
		line(ctx, 814, 219, 842, 262, 'rgba(58,39,27,0.4)', 1.4);
		circle(ctx, 815, 205, 1.7, CHROME, 0.8);
	}

	// Both wheels share the one wheel part; the rear tile is the front mirrored.
	atBothWheels(ctx, (cx) => wheel(ctx, cx, WHEEL_L.y, WHEEL_L.r, finish));

	if (lit) {
		// Rim light: cab roof, deck edges, fairing and both car roofs.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(42, 117);
		ctx.lineTo(172, 117);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(154, 97);
		ctx.lineTo(812, 97);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(36, 134);
		ctx.lineTo(36, 190);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(196, 183.5);
		ctx.lineTo(806, 183.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(302, 56);
		ctx.lineTo(340, 56);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(492, 142);
		ctx.lineTo(522, 142);
		ctx.stroke();

		// Headlight glow on the nose.
		const glow = ctx.createRadialGradient(44, 228, 1, 44, 228, 30);
		glow.addColorStop(0, 'rgba(255,240,150,0.78)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(44, 228, 30, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wheelAt of [WHEEL_L, WHEEL_R]) {
			ctx.beginPath();
			ctx.ellipse(wheelAt.x, 272, 30, 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Deck gloss: a polished run along each deck fascia.
		deckSheen(ctx, UPPER_DECK.x, UPPER_DECK.y, UPPER_DECK.w, UPPER_DECK.h);
		deckSheen(ctx, LOWER_DECK.x, LOWER_DECK.y, LOWER_DECK.w, LOWER_DECK.h);

		// Both loaded cars get a paint sweep and a reflection in their glass.
		carSheen(ctx, LOWER_LOAD);
		carSheen(ctx, UPPER_LOAD);

		// Cab glazing: a long sheen down the screen and a shorter one in the door pane.
		ctx.save();
		ctx.clip(new Path2D(GLASS_MASK));
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(46, 184);
		ctx.lineTo(84, 138);
		ctx.stroke();
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(136, 174);
		ctx.lineTo(162, 140);
		ctx.stroke();
		ctx.restore();

		// Livery catchlight along the cab's gold band.
		ctx.save();
		ctx.clip(new Path2D(CAB));
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(28, 194.6);
		ctx.lineTo(188, 193.8);
		ctx.stroke();
		ctx.restore();

		// Glints on glass, paint, chrome and the ramp.
		glint(ctx, 62, 146, 5.2);
		glint(ctx, 330, 58, 4.6);
		glint(ctx, 776, 100, 4.2);
		glint(ctx, 750, 144, 3.4);
		glint(ctx, 828, 236, 3.4);
		glint(ctx, 508, 152, 3.2);
		glint(ctx, 254, 225, 2.8);

		// Hub detail on both wheels; the rear tile mirrors the front one.
		atBothWheels(ctx, (cx) => hubDetail(ctx, cx, WHEEL_L.y, WHEEL_L.r));

		// Tyre sidewall sheen inside each wheel tile, clear of the hub.
		atBothWheels(ctx, (cx) => {
			ctx.save();
			ctx.clip(new Path2D(circleMask(cx, WHEEL_L.y, WHEEL_L.r)));
			ctx.strokeStyle = 'rgba(255,255,255,0.24)';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(cx, WHEEL_L.y, WHEEL_L.r - 4.5, Math.PI * 1.12, Math.PI * 1.52);
			ctx.stroke();
			ctx.restore();
		});

		// Exhaust puff drifting off the stack.
		shape(ctx, PUFF, '#E4EBF3', 1.6);
		ctx.save();
		ctx.clip(new Path2D(PUFF));
		ctx.globalAlpha = 0.9;
		ctx.fillStyle = '#C9D4E0';
		for (const [px, py, pr] of [
			[201, 121, 4],
			[209, 116, 5],
			[214, 121, 3.6]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Chrome work: bumper edge, fuel tank run and the ladder rungs.
		line(ctx, 8, 240.5, 22, 240.5, 'rgba(255,255,255,0.55)', 1.6);
		line(ctx, 258, 224, 308, 224, 'rgba(255,255,255,0.48)', 1.6);
		for (const rungY of [124, 140, 156, 172]) {
			line(ctx, 219, rungY + 1, 227, rungY + 1, 'rgba(255,255,255,0.62)', 1);
		}

		// Road dust gathering along the skirt bottoms.
		ctx.save();
		ctx.clip(
			new Path2D(
				`${rectMask(SKIRT_FRONT.x, SKIRT_FRONT.y, SKIRT_FRONT.w, SKIRT_FRONT.h)} ${rectMask(
					SKIRT_REAR.x,
					SKIRT_REAR.y,
					SKIRT_REAR.w,
					SKIRT_REAR.h
				)}`
			)
		);
		const dust = ctx.createLinearGradient(0, 228, 0, 244);
		dust.addColorStop(0, 'rgba(58,39,27,0)');
		dust.addColorStop(1, 'rgba(58,39,27,0.24)');
		ctx.fillStyle = dust;
		ctx.fillRect(SKIRT_FRONT.x, 228, SKIRT_FRONT.w, 16);
		ctx.fillRect(SKIRT_REAR.x, 228, SKIRT_REAR.w, 16);
		ctx.restore();

		// Finishing marks: paint chips on the working edges, dust along the skirt.
		ctx.save();
		ctx.fillStyle = CREAM;
		for (const [chipX, chipY, w, h, alpha] of [
			[52, 247, 8, 2.2, 0.42],
			[104, 247, 6, 2, 0.36],
			[300, 228, 9, 2, 0.3],
			[640, 198, 7, 2, 0.3],
			[806, 199, 4, 2.2, 0.38]
		]) {
			ctx.globalAlpha = alpha;
			ctx.fillRect(chipX, chipY, w, h);
		}
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealCarTransporter(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealCarTransporterLevel(ctx, x, y, scale, 5);
}
