/**
 * Skip-loader lorry art, cut into the same five-piece kit as the rest of the realistic
 * fleet. A cab-over lorry facing left: an orange cab, a flat steel bed carrying a large
 * open skip with both ends raked in, ribbed steel walls and a heaped rubble load, plus a
 * chain-lift gantry folded over the cab roof. The skip is the cue that names the machine;
 * the beacon and lamps are works-truck fittings. Level 5 is the production target:
 * shaded, fitted, lit and picture-book finished with paint grain, skip wear, glints, hub
 * bolts and an exhaust wisp above the stack.
 */

import { CHROME, GLASS, INK, STEEL, circle, line, rect, shape, wheel } from './realKit';

const ORANGE = '#E76F51';
const ORANGE_DARK = '#C9563B';
const CHARCOAL = '#2B2D42';
const CHARCOAL_DARK = '#1D1F30';
const CHARCOAL_LIGHT = '#3D405B';
const STEEL_DARK = '#4A5160';
const STEEL_LIGHT = '#7F8A9C';
const SKIP_STEEL = '#666B71';
const CREAM = '#FFF6E4';
const AMBER = '#FFB703';
const LAMP = '#FFE066';
const TAIL = '#E0455A';
const WELL = '#14151F';

/** Art box 680 x 300, road at 244. Front (cab) faces left. */
const CAB =
	'M42,208 L42,148 L56,108 Q58,104 66,104 L198,104 Q204,104 204,108 L204,208 L201,208 A32,32 0 0 0 139,208 L42,208 Z';
const DECK =
	'M204,180 L646,180 L646,220 L542,220 L542,216 A32,32 0 0 0 478,216 L478,220 L204,220 Z';
const STEP = 'M110,208 L138,208 L138,216 L110,216 Z';
const BUMPER = 'M30,196 L42,196 L42,218 L30,218 Z';
const MIRROR_HEAD = 'M18,152 L26,152 L26,172 L18,172 Z';
const MIRROR_ARM = 'M26,157 L42,155 L42,163 L26,166 Z';
const BEACON_BASE = 'M174,98 L192,98 L192,104 L174,104 Z';
const BEACON_LENS = 'M176,98 L190,98 L188,89 Q182,85 176,89 Z';
const MARKER_BAR = 'M106,97 L166,97 L166,104 L106,104 Z';

/** Chain-lift gantry: riser behind the cab plus the boom folded over the roof. */
const ARM = 'M204,180 L222,180 L222,84 L86,74 L86,88 L204,97 Z';
const ARM_HEAD = 'M64,58 L104,58 L104,73 L64,73 Z';
const CHAIN_A = 'M72,73 L76,73 L76,118 L72,118 Z';
const CHAIN_B = 'M82,73 L86,73 L86,114 L82,114 Z';
const STACK =
	'M222,134 L234,134 L234,140 L232,140 L232,180 L224,180 L224,140 L222,140 Z';

const FUEL_TANK = 'M300,220 L360,220 L360,236 L300,236 Z';
const MUDFLAP = 'M544,220 L560,220 L560,238 L544,238 Z';
const REAR_LAMP = 'M646,186 L658,186 L658,214 L646,214 Z';
const REAR_BUMPER = 'M646,214 L658,214 L658,224 L646,224 Z';

/**
 * The skip: a trapezoid with both ends raked in ~22°, an open top and a small heaped
 * load. The skyline follows the load so the whole skip stays a single mask subpath.
 */
const SKIP =
	'M268,180 L310,76 L314,58 L400,58 L410,53 L420,56 L430,50 L440,54 L450,48 L460,55 L470,52 L482,56 L492,54 L498,58 L566,58 L570,76 L612,180 Z';
const SKIP_MOUTH = 'M314,58 L566,58 L570,76 L310,76 Z';
const SKIP_RIM = 'M310,76 L570,76 L567,85 L313,85 Z';
const SKIP_WALL = 'M313,85 L567,85 L612,180 L268,180 Z';
const SKIP_HEAP =
	'M400,58 L410,53 L420,56 L430,50 L440,54 L450,48 L460,55 L470,52 L482,56 L492,54 L498,58 L498,82 L400,82 Z';
const SKIP_RIBS = [330, 380, 430, 480, 530];

const WINDSCREEN = 'M50,176 L50,144 L60,122 Q62,118 68,118 L124,118 L124,176 Z';
const SIDE_WINDOW =
	'M136,112 L186,112 Q194,112 194,120 L194,158 Q194,166 186,166 L136,166 Z';

const WHEEL_L = { x: 170, y: 216, r: 28 };
const WHEEL_R = { x: 510, y: 216, r: 28 };
/** Mask arch radius; 4px clear of the 28px tyre. */
const ARCH = 32;

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
	const glass = ctx.createLinearGradient(x, y, x + w * 0.65, y + h);
	glass.addColorStop(0, 'rgba(255,255,255,0.62)');
	glass.addColorStop(0.42, 'rgba(255,255,255,0.06)');
	glass.addColorStop(1, 'rgba(96,176,226,0.3)');
	ctx.fillStyle = glass;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** A four-point sparkle, sized to survive the game scale. */
function glint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
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
}

/** Six-bolt picture-book hub; mirror symmetric so a flipped wheel tile still matches. */
function hubFinish(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.strokeStyle = 'rgba(255,255,255,0.72)';
	ctx.lineWidth = 2.4;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.47, 0, Math.PI * 2);
	ctx.stroke();

	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		circle(ctx, x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.1, CHROME, 1.1);
	}

	circle(ctx, x, y, r * 0.13, '#E8EDF4', 1.2);
	ctx.strokeStyle = 'rgba(255,255,255,0.8)';
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(x, y, r * 0.62, Math.PI * 1.08, Math.PI * 1.52);
	ctx.stroke();

	// A washer catch on every lug, so the hub reads as hardware at game scale.
	ctx.strokeStyle = 'rgba(255,255,255,0.85)';
	ctx.lineWidth = 1;
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2;
		ctx.beginPath();
		ctx.arc(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3, 2.6, Math.PI * 1.05, Math.PI * 1.55);
		ctx.stroke();
	}
}

/** A slack chain: alternating links with a hooked end. */
function drawChain(
	ctx: CanvasRenderingContext2D,
	cx: number,
	top: number,
	bottom: number,
	finish = false
): void {
	let link = 0;
	for (let cy = top + 3; cy <= bottom - 2.5; cy += 5.6) {
		const vertical = link % 2 === 0;
		ctx.beginPath();
		ctx.ellipse(cx, cy, vertical ? 1.9 : 2.6, vertical ? 2.7 : 1.9, 0, 0, Math.PI * 2);
		ctx.strokeStyle = INK;
		ctx.lineWidth = 2.4;
		ctx.stroke();
		ctx.strokeStyle = vertical ? STEEL_LIGHT : STEEL;
		ctx.lineWidth = 1.1;
		ctx.stroke();
		if (finish) {
			// A chrome catch-light on the upper left of every link.
			ctx.beginPath();
			ctx.ellipse(
				cx - 0.4,
				cy - 0.5,
				vertical ? 1.9 : 2.6,
				vertical ? 2.7 : 1.9,
				0,
				Math.PI * 1.05,
				Math.PI * 1.55
			);
			ctx.strokeStyle = 'rgba(255,255,255,0.72)';
			ctx.lineWidth = 0.9;
			ctx.stroke();
		}
		link++;
	}

	ctx.beginPath();
	ctx.arc(cx, bottom - 1, 2.4, Math.PI * 0.15, Math.PI * 1.4);
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.8;
	ctx.stroke();
	ctx.strokeStyle = STEEL_LIGHT;
	ctx.lineWidth = 1.4;
	ctx.stroke();
	if (finish) {
		ctx.beginPath();
		ctx.arc(cx - 0.5, bottom - 1.4, 2.4, Math.PI * 1.1, Math.PI * 1.5);
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = 0.9;
		ctx.stroke();
	}
}

/** The dark wheel well a tyre sits inside, drawn before the tyre tiles. */function wheelWell(
	ctx: CanvasRenderingContext2D,
	cx: number,
	r: number,
	bottom: number,
	shaded: boolean
): void {
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, r, Math.PI, Math.PI * 2);
	ctx.lineTo(cx + r, bottom);
	ctx.lineTo(cx - r, bottom);
	ctx.closePath();
	if (shaded) {
		const well = ctx.createLinearGradient(0, WHEEL_L.y - r, 0, bottom);
		well.addColorStop(0, WELL);
		well.addColorStop(0.6, '#1B1D2A');
		well.addColorStop(1, CHARCOAL_LIGHT);
		ctx.fillStyle = well;
	} else {
		ctx.fillStyle = WELL;
	}
	ctx.fill();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 2.2;
	ctx.stroke();

	if (shaded) {
		ctx.strokeStyle = 'rgba(0,0,0,0.34)';
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(cx, WHEEL_L.y + 2, r - 4, Math.PI * 1.05, Math.PI * 1.95);
		ctx.stroke();
	}
}

/** Livery arch over the well, tucked inside the cut-out so the tyre meets it. */
function archLip(ctx: CanvasRenderingContext2D, cx: number, a1: number, a2: number): void {
	ctx.strokeStyle = CHARCOAL;
	ctx.lineWidth = 4.4;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH - 2, Math.PI * a1, Math.PI * a2);
	ctx.stroke();
	ctx.strokeStyle = INK;
	ctx.lineWidth = 1.5;
	ctx.beginPath();
	ctx.arc(cx, WHEEL_L.y, ARCH - 0.5, Math.PI * a1, Math.PI * a2);
	ctx.stroke();
}

/** Chain-lift gantry folded over the cab: riser, boom, head beam and chains. */
function drawGantry(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	// Far arm, tucked behind the near one for depth.
	ctx.save();
	ctx.translate(6, -4);
	shape(ctx, ARM, CHARCOAL_DARK, 2.6);
	ctx.restore();

	// Near arm: a box section with a lit top edge and a shaded underside.
	shape(ctx, ARM, CHARCOAL, 3);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(ARM));
		const bar = ctx.createLinearGradient(0, 74, 0, 200);
		bar.addColorStop(0, 'rgba(255,255,255,0.26)');
		bar.addColorStop(0.3, 'rgba(255,255,255,0.04)');
		bar.addColorStop(1, 'rgba(0,0,0,0.36)');
		ctx.fillStyle = bar;
		ctx.fillRect(84, 70, 140, 136);
		ctx.restore();
	}
	line(ctx, 90, 77.6, 216, 87.6, 'rgba(255,255,255,0.36)', 2.4);
	line(ctx, 208, 92, 208, 176, 'rgba(255,255,255,0.16)', 2);

	// Head beam at the tip, carrying the two chains.
	shape(ctx, ARM_HEAD, CHARCOAL_LIGHT, 2.6);
	line(ctx, 66, 59.6, 102, 59.6, 'rgba(255,255,255,0.42)', 1.8);
	drawChain(ctx, 74, 73, 118, finish);
	drawChain(ctx, 84, 73, 114, finish);

	if (fitted) {
		// Head sheave and a chrome pin through the beam.
		circle(ctx, 68, 66, 5.4, CHARCOAL, 1.6);
		circle(ctx, 68, 66, 2.2, CHROME, 1.2);
		circle(ctx, 100, 66, 3, STEEL_LIGHT, 1.2);
	}

	if (finish) {
		line(ctx, 64, 71.6, 104, 71.6, 'rgba(255,255,255,0.2)', 1.6);
		line(ctx, 92, 80, 200, 89.6, 'rgba(255,255,255,0.16)', 1.4);
	}
}

/** Flat bed with a charcoal underframe, fuel tank, mudflap and rear end. */
function drawBed(ctx: CanvasRenderingContext2D, shaded: boolean, fitted: boolean): void {
	shape(ctx, DECK, ORANGE, 3);

	ctx.save();
	ctx.clip(new Path2D(DECK));

	// Deck top face, underframe and chassis rail.
	ctx.fillStyle = 'rgba(255,255,255,0.28)';
	ctx.fillRect(204, 180, 442, 3);
	ctx.fillStyle = ORANGE_DARK;
	ctx.fillRect(204, 193, 442, 3);
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(204, 196, 442, 24);
	ctx.fillStyle = CHARCOAL_DARK;
	ctx.fillRect(204, 208, 442, 12);
	ctx.fillStyle = 'rgba(201,210,222,0.22)';
	ctx.fillRect(204, 208, 442, 1.6);

	if (shaded) {
		const deck = ctx.createLinearGradient(0, 180, 0, 220);
		deck.addColorStop(0, 'rgba(255,255,255,0.24)');
		deck.addColorStop(0.4, 'rgba(255,255,255,0.02)');
		deck.addColorStop(1, 'rgba(70,24,14,0.28)');
		ctx.fillStyle = deck;
		ctx.fillRect(204, 180, 442, 40);
	}
	ctx.restore();

	// Panel seams across the side face and the top lip.
	line(ctx, 206, 193.2, 644, 193.2, 'rgba(255,246,228,0.5)', 1.6);
	line(ctx, 206, 196, 644, 196, 'rgba(58,39,27,0.42)', 1.6);
	line(ctx, 206, 218, 644, 218, 'rgba(201,210,222,0.2)', 1.4);
	// The skip's weight presses a shadow onto the deck's top edge.
	line(ctx, 270, 182.6, 610, 182.6, 'rgba(20,22,32,0.34)', 3.4);
	for (const sx of [272, 386, 500, 614]) {
		line(ctx, sx, 197, sx, 218, 'rgba(58,39,27,0.28)', 1.4);
	}

	if (fitted) {
		// Lashing rings along the deck's side face.
		for (const rx of [252, 312, 372, 432, 492, 552, 612]) {
			circle(ctx, rx, 189, 2.6, STEEL_DARK, 1.2);
			circle(ctx, rx, 189, 1, CHROME, 0.6);
		}

		// Fuel tank hung between the wheels, with two straps.
		rect(ctx, 300, 220, 60, 16, CHROME, 5, 2.4);
		line(ctx, 314, 221, 314, 235, 'rgba(58,39,27,0.35)', 1.6);
		line(ctx, 346, 221, 346, 235, 'rgba(58,39,27,0.35)', 1.6);
		line(ctx, 304, 223.4, 356, 223.4, 'rgba(255,255,255,0.5)', 1.4);
		circle(ctx, 352, 224, 1.8, STEEL_DARK, 1);

		// Mudflap with a thin chrome bracket.
		rect(ctx, 544, 220, 16, 18, CHARCOAL, 2, 2);
		line(ctx, 546, 221.4, 558, 221.4, 'rgba(201,210,222,0.4)', 1.4);
		line(ctx, 546, 235.4, 558, 235.4, 'rgba(255,255,255,0.16)', 1.4);
	}

	// Rear lamp mast, bumper and plate.
	rect(ctx, 646, 186, 12, 28, CHARCOAL_DARK, 2, 2.4);
	if (fitted) {
		rect(ctx, 648, 190, 8, 11, TAIL, 2, 1.6);
		rect(ctx, 648, 203, 8, 9, AMBER, 2, 1.4);
	}
	rect(ctx, 646, 214, 12, 10, CHROME, 2, 2.2);
	line(ctx, 647, 215.4, 657, 215.4, 'rgba(255,255,255,0.55)', 1.2);
	rect(ctx, 648, 216.6, 8, 6, CREAM, 1, 1);
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(649.4, 218.4, 5, 1.2);
	ctx.fillRect(649.4, 220.4, 3.6, 1.2);
}

/** Cab-over cab: raked screen, side glass, grille, door and lamps. */
function drawCab(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, CAB, ORANGE, 3);

	ctx.save();
	ctx.clip(new Path2D(CAB));

	// Lower valance and rear step shadow.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(42, 202, 162, 6);

	if (shaded) {
		const paint = ctx.createLinearGradient(0, 104, 0, 208);
		paint.addColorStop(0, 'rgba(255,255,255,0.34)');
		paint.addColorStop(0.42, 'rgba(255,255,255,0.03)');
		paint.addColorStop(0.86, 'rgba(150,60,34,0.16)');
		paint.addColorStop(1, 'rgba(70,24,14,0.28)');
		ctx.fillStyle = paint;
		ctx.fillRect(40, 100, 166, 110);
	}

	// Grille panel under the screen, then the door and its hardware.
	rect(ctx, 46, 178, 78, 16, CHARCOAL_DARK, 3, 2.2);
	for (let bar = 0; bar < 3; bar++) {
		line(ctx, 50, 181.4 + bar * 4.6, 120, 181.4 + bar * 4.6, 'rgba(201,210,222,0.4)', 1.2);
	}

	rect(ctx, 130, 167, 69, 37, ORANGE, 3, 2.6);
	if (shaded) {
		rect(ctx, 135, 172.5, 58, 22, 'rgba(255,246,228,0.07)', 2, 1.4);
	}
	line(ctx, 131, 170, 131, 202, 'rgba(58,39,27,0.42)', 2);

	// Waist stripe over the door.
	line(ctx, 44, 176.2, 202, 176.2, 'rgba(255,246,228,0.6)', 2);

	if (fitted) {
		rect(ctx, 188, 182, 9, 4, CHROME, 1.6, 1.4);
		rect(ctx, 131, 174, 4, 9, STEEL, 1, 1.4);
		line(ctx, 186, 191, 196, 191, 'rgba(58,39,27,0.28)', 1.2);
	}

	ctx.restore();

	// Glass.
	shape(ctx, WINDSCREEN, GLASS, 2.5);
	shape(ctx, SIDE_WINDOW, GLASS, 2.5);

	if (shaded) {
		shadeGlass(ctx, WINDSCREEN, 48, 116, 78, 62);
		shadeGlass(ctx, SIDE_WINDOW, 134, 110, 62, 58);
		line(ctx, 96, 128, 76, 164, 'rgba(255,255,255,0.45)', 3);
	}

	// Front bumper and nose fittings.
	shape(ctx, BUMPER, CHROME, 2.6);
	rect(ctx, 32, 203, 8, 11, CHARCOAL, 2, 1.4);
	line(ctx, 31, 197.6, 41, 197.6, 'rgba(255,255,255,0.65)', 1.6);
	circle(ctx, 37, 210, 2.6, STEEL_DARK, 1.2);

	if (fitted) {
		// Headlamp, indicator and a chrome bezel on the lower front panel.
		circle(ctx, 52, 201, 6.2, LAMP, 2);
		circle(ctx, 50.6, 199.4, 2.6, '#FFF8CE', 1);
		circle(ctx, 72, 202, 3.6, AMBER, 1.6);
		line(ctx, 46, 196.4, 58, 196.4, 'rgba(255,255,255,0.42)', 1.4);

		// Wipers on the screen's lower edge.
		line(ctx, 62, 172.4, 83, 159, INK, 1.8);
		line(ctx, 91, 173.4, 111, 161, INK, 1.7);

		// Mirrors on the front corner.
		rect(ctx, 18, 152, 8, 20, CHROME, 2, 2);
		rect(ctx, 20, 154.4, 4, 15, GLASS, 1, 1);
		line(ctx, 26, 158, 42, 156, INK, 3.4);
		line(ctx, 26, 158, 42, 156, STEEL, 2.2);
		line(ctx, 26, 164, 42, 162, INK, 2.4);
		line(ctx, 26, 164, 42, 162, CHARCOAL_LIGHT, 1.4);

		// Roof marker bar with three amber lenses.
		rect(ctx, 106, 97, 60, 7, CHARCOAL_DARK, 2, 2);
		for (let lens = 0; lens < 3; lens++) {
			rect(ctx, 111 + lens * 18, 98.2, 12, 4.6, AMBER, 1.4, 1);
		}

		// Cab step under the door front.
		rect(ctx, 110, 208, 28, 8, CHARCOAL_DARK, 2, 2);
		line(ctx, 112, 210, 136, 210, 'rgba(201,210,222,0.4)', 1.2);
	}

	// Beacon: dark plinth, amber lens.
	shape(ctx, BEACON_BASE, CHARCOAL_DARK, 1.8);
	shape(ctx, BEACON_LENS, AMBER, 1.8);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(BEACON_LENS));
		const lens = ctx.createLinearGradient(176, 0, 190, 0);
		lens.addColorStop(0, 'rgba(255,255,255,0.55)');
		lens.addColorStop(0.6, 'rgba(255,183,3,0.06)');
		lens.addColorStop(1, 'rgba(150,90,0,0.34)');
		ctx.fillStyle = lens;
		ctx.fillRect(176, 85, 14, 14);
		ctx.restore();
	}

	if (finish) {
		// Beacon sheen and a cab-roof highlight.
		ctx.save();
		ctx.clip(new Path2D(BEACON_LENS));
		const sheen = ctx.createLinearGradient(177, 0, 189, 0);
		sheen.addColorStop(0, 'rgba(255,255,255,0.82)');
		sheen.addColorStop(0.4, 'rgba(255,246,228,0.28)');
		sheen.addColorStop(1, 'rgba(120,66,0,0.3)');
		ctx.fillStyle = sheen;
		ctx.fillRect(176, 85, 14, 10);
		ctx.restore();
		line(ctx, 68, 105.6, 196, 105.6, 'rgba(255,255,255,0.32)', 2);
	}
}

/**
 * Level-5 skip finish: rolled-plate grain, deeper rust, rust runs, bare-metal wear and
 * rim chips. Everything here is new to the picture-book pass; the level 2 weathering stays
 * untouched so levels 1 to 4 are unchanged.
 */
function skipPlateFinish(ctx: CanvasRenderingContext2D): void {
	ctx.save();
	ctx.clip(new Path2D(SKIP_WALL));

	// Rolled-steel grain: faint vertical draw marks over the plate.
	let seed = 173;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	ctx.fillStyle = INK;
	for (let i = 0; i < 70; i++) {
		ctx.globalAlpha = 0.035 + rnd() * 0.035;
		ctx.fillRect(272 + rnd() * 336, 88 + rnd() * 80, 1 + rnd() * 1.3, 5 + rnd() * 16);
	}
	ctx.fillStyle = '#C9D2DE';
	for (let i = 0; i < 34; i++) {
		ctx.globalAlpha = 0.04 + rnd() * 0.045;
		ctx.fillRect(272 + rnd() * 336, 88 + rnd() * 78, 1 + rnd() * 1.1, 4 + rnd() * 12);
	}
	ctx.globalAlpha = 1;

	// Deeper corrosion low on the plate, with pitting inside each bloom.
	for (const [rx, ry, brx, bry, rot, alpha] of [
		[286, 169, 26, 7, -0.1, 0.3],
		[596, 161, 18, 7, 0.16, 0.26],
		[342, 168, 12, 5, 0.06, 0.2]
	] as Array<[number, number, number, number, number, number]>) {
		ctx.fillStyle = `rgba(126,66,36,${alpha})`;
		ctx.beginPath();
		ctx.ellipse(rx, ry, brx, bry, rot, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.fillStyle = 'rgba(82,42,22,0.46)';
	for (const [px, py, pr] of [
		[277, 166, 1],
		[284, 170, 1.4],
		[292, 167, 1.1],
		[300, 170, 0.9],
		[590, 158, 1.1],
		[598, 162, 0.9],
		[604, 157, 1.2],
		[338, 166, 0.9],
		[346, 169, 1]
	] as Array<[number, number, number]>) {
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}

	// Rust runs bleeding from the lip and the base seam.
	ctx.fillStyle = 'rgba(146,88,54,0.12)';
	for (const [rx, ry, w, h] of [
		[302, 86, 5, 22],
		[520, 86, 4, 17],
		[560, 86, 5, 25]
	] as Array<[number, number, number, number]>) {
		ctx.beginPath();
		ctx.moveTo(rx, ry);
		ctx.lineTo(rx + w, ry);
		ctx.lineTo(rx + w - 1.2, ry + h);
		ctx.lineTo(rx + 1.4, ry + h - 2);
		ctx.closePath();
		ctx.fill();
	}

	// Bare-metal wear along the base rail and at the two raked corners.
	ctx.strokeStyle = 'rgba(206,216,228,0.34)';
	ctx.lineWidth = 1.4;
	ctx.beginPath();
	ctx.moveTo(282, 170.4);
	ctx.lineTo(318, 170.4);
	ctx.moveTo(470, 170.4);
	ctx.lineTo(512, 170.4);
	ctx.moveTo(272, 150);
	ctx.lineTo(280, 128);
	ctx.moveTo(604, 150);
	ctx.lineTo(598, 132);
	ctx.stroke();
	ctx.restore();

	// Sheen on the near rail and stiffener faces, plus rust-flecked rim chips.
	line(ctx, 322, 79.2, 396, 79.2, 'rgba(255,255,255,0.3)', 1.4);
	line(ctx, 486, 79.2, 552, 79.2, 'rgba(255,255,255,0.26)', 1.4);
	for (const [rx, rw, fy] of [
		[330, 15, 166],
		[428, 16, 165],
		[528, 16, 167]
	] as Array<[number, number, number]>) {
		line(ctx, rx + 2, fy - 10, rx + 2, fy - 3, 'rgba(255,255,255,0.22)', 1.2);
		line(ctx, rx + rw - 2, fy - 9, rx + rw - 2, fy - 3, 'rgba(210,218,230,0.18)', 1);
	}
	ctx.fillStyle = 'rgba(126,66,36,0.5)';
	for (const [nx, ny, nr] of [
		[366, 82, 0.9],
		[534, 82.4, 0.8]
	] as Array<[number, number, number]>) {
		ctx.beginPath();
		ctx.arc(nx, ny, nr, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** Open steel skip: raked ends, fabricated steel box, dark mouth and a heaped load. */
function drawSkip(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	// One silhouette: the shell plus the load's skyline.
	shape(ctx, SKIP, SKIP_STEEL, 3);

	// ---- Near wall: a dark fabricated steel box ----
	ctx.save();
	ctx.clip(new Path2D(SKIP_WALL));

	if (shaded) {
		const wall = ctx.createLinearGradient(0, 85, 0, 180);
		wall.addColorStop(0, 'rgba(255,255,255,0.1)');
		wall.addColorStop(0.35, 'rgba(255,255,255,0.01)');
		wall.addColorStop(0.72, 'rgba(0,0,0,0.08)');
		wall.addColorStop(1, 'rgba(0,0,0,0.28)');
		ctx.fillStyle = wall;
		ctx.fillRect(266, 82, 350, 100);
	}

	// Matte, weathered steel: dense fine speckle so the plate never reads as glass.
	let grainSeed = 17;
	const grain = (): number => {
		grainSeed = (grainSeed * 9301 + 49297) % 233280;
		return grainSeed / 233280;
	};
	ctx.fillStyle = INK;
	if (shaded) {
		for (let i = 0; i < 720; i++) {
			ctx.globalAlpha = 0.05 + grain() * 0.08;
			ctx.fillRect(268 + grain() * 342, 86 + grain() * 92, 1 + grain() * 1.7, 1 + grain() * 1.7);
		}
		ctx.fillStyle = CREAM;
		for (let i = 0; i < 240; i++) {
			ctx.globalAlpha = 0.03 + grain() * 0.05;
			ctx.fillRect(268 + grain() * 342, 86 + grain() * 90, 1 + grain() * 1.4, 1 + grain() * 1.4);
		}
	}
	ctx.globalAlpha = 1;

	// Rolled-steel tooth: a few vertical streaks over the plate.
	let seed = 61;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};
	if (shaded) {
		ctx.fillStyle = INK;
		for (let i = 0; i < 40; i++) {
			ctx.globalAlpha = 0.04 + rnd() * 0.05;
			ctx.fillRect(268 + rnd() * 342, 88 + rnd() * 80, 1.6 + rnd() * 3, 6 + rnd() * 26);
		}
		ctx.fillStyle = CREAM;
		for (let i = 0; i < 16; i++) {
			ctx.globalAlpha = 0.03 + rnd() * 0.04;
			ctx.fillRect(268 + rnd() * 342, 88 + rnd() * 78, 1.4 + rnd() * 2, 5 + rnd() * 16);
		}
	}
	ctx.globalAlpha = 1;

	// Rust and road grime, heaviest along the base and corners.
	for (const [rx, ry, brx, bry, rot, alpha] of [
		[284, 162, 28, 15, -0.14, 0.34],
		[304, 150, 16, 10, 0.2, 0.24],
		[268, 144, 12, 9, 0.1, 0.2],
		[596, 118, 22, 14, 0.22, 0.3],
		[574, 106, 13, 9, -0.2, 0.22],
		[600, 146, 12, 9, 0.3, 0.26],
		[344, 120, 24, 11, 0.1, 0.12],
		[500, 158, 26, 12, 0.06, 0.16]
	] as Array<[number, number, number, number, number, number]>) {
		ctx.fillStyle = `rgba(146,88,54,${alpha})`;
		ctx.beginPath();
		ctx.ellipse(rx, ry, brx, bry, rot, 0, Math.PI * 2);
		ctx.fill();
	}

	// A rust run bleeding down from the lip at one corner.
	if (shaded) {
		ctx.fillStyle = 'rgba(146,88,54,0.16)';
		ctx.beginPath();
		ctx.moveTo(548, 93);
		ctx.lineTo(560, 93);
		ctx.lineTo(556, 138);
		ctx.lineTo(544, 136);
		ctx.closePath();
		ctx.fill();
	}

	// Top rail closing the plate under the lip.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(266, 85, 350, 8);
	ctx.fillStyle = 'rgba(255,255,255,0.12)';
	ctx.fillRect(266, 85, 350, 1.2);

	// Dark body rail across the middle: this is a box, not a pane.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(266, 132, 350, 7);
	ctx.fillStyle = 'rgba(255,255,255,0.1)';
	ctx.fillRect(266, 132, 350, 1.2);
	ctx.fillStyle = 'rgba(0,0,0,0.22)';
	ctx.fillRect(266, 139, 350, 1.6);

	// A single broken weld seam, patched across the plate.
	for (const [x1, x2] of [
		[272, 372],
		[392, 470],
		[492, 606]
	]) {
		line(ctx, x1, 122, x2, 122, 'rgba(12,14,22,0.22)', 1.6);
		line(ctx, x1, 123.4, x2, 123.4, 'rgba(255,255,255,0.05)', 1.2);
	}
	for (let bx = 284; bx < 600; bx += 46) {
		ctx.fillStyle = 'rgba(20,22,32,0.45)';
		ctx.beginPath();
		ctx.arc(bx, 122, 1.25, 0, Math.PI * 2);
		ctx.fill();
	}

	// Raked corner posts.
	shape(ctx, 'M268,180 L310,76 L320,76 L278,180 Z', STEEL_DARK, 1.8);
	line(ctx, 276, 168, 306, 88, 'rgba(255,255,255,0.12)', 2);
	shape(ctx, 'M560,76 L570,76 L612,180 L602,180 Z', STEEL_DARK, 1.8);
	line(ctx, 567, 92, 600, 168, 'rgba(255,255,255,0.1)', 2);

	// Chunky vertical stiffeners, raised off the plate; widths and feet vary.
	for (const [rx, rw, top, foot] of [
		[330, 15, 92, 166],
		[378, 17, 94, 168],
		[428, 16, 91, 165],
		[478, 18, 93, 169],
		[528, 16, 92, 167]
	] as Array<[number, number, number, number]>) {
		if (shaded) {
			ctx.fillStyle = 'rgba(4,6,12,0.24)';
			ctx.fillRect(rx + rw + 1, top + 2, 8, foot - top - 4);
		}
		rect(ctx, rx, top, rw, foot - top, '#4A4F56', 1.6, 1.8);
		line(ctx, rx + 2, top + 5, rx + 2, foot - 7, 'rgba(255,255,255,0.1)', 1.8);
		line(ctx, rx + rw - 2.6, top + 5, rx + rw - 2.6, foot - 5, 'rgba(6,8,14,0.42)', 2.4);
		line(ctx, rx + 1, top + 1.6, rx + rw - 1, top + 1.6, 'rgba(255,255,255,0.16)', 1.4);
		circle(ctx, rx + rw / 2, top + 5.6, 1.3, 'rgba(18,20,28,0.5)', 0.5);
		circle(ctx, rx + rw / 2, foot - 4.4, 1.3, 'rgba(18,20,28,0.5)', 0.5);
	}

	// Small dents and a patch plate edge, kept shallow so they read as steel.
	if (shaded) {
		for (const [dx, dy] of [
			[398, 146],
			[456, 158],
			[300, 128]
		] as Array<[number, number]>) {
			ctx.strokeStyle = 'rgba(6,8,14,0.24)';
			ctx.lineWidth = 2.6;
			ctx.beginPath();
			ctx.arc(dx, dy, 9, Math.PI * 1.05, Math.PI * 1.55);
			ctx.stroke();
		}
		line(ctx, 356, 146, 356, 170, 'rgba(10,12,18,0.24)', 1.6);
		line(ctx, 500, 96, 500, 130, 'rgba(10,12,18,0.22)', 1.6);
	}

	// Heavy base rail along the deck.
	ctx.fillStyle = CHARCOAL_DARK;
	ctx.fillRect(264, 171, 352, 9);
	ctx.fillStyle = 'rgba(255,255,255,0.1)';
	ctx.fillRect(264, 171, 352, 1.4);
	ctx.restore();

	// ---- Open mouth: dark band from the far rim down behind the near lip ----
	shape(ctx, SKIP_MOUTH, '#14161D', 2);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(SKIP_MOUTH));
		const depth = ctx.createLinearGradient(0, 56, 0, 78);
		depth.addColorStop(0, 'rgba(110,120,136,0.38)');
		depth.addColorStop(0.36, 'rgba(20,22,34,0.92)');
		depth.addColorStop(1, 'rgba(4,5,10,0.98)');
		ctx.fillStyle = depth;
		ctx.fillRect(308, 54, 266, 26);
		ctx.restore();
	}
	line(ctx, 315, 59.4, 565, 59.4, 'rgba(196,206,220,0.34)', 1.8);
	line(ctx, 318, 64, 562, 64, 'rgba(108,118,136,0.15)', 3);

	// ---- Load: a small heap of sand, rubble and broken chunks ----
	shape(ctx, SKIP_HEAP, '#9A8C76', 2.2);
	ctx.save();
	ctx.clip(new Path2D(SKIP_HEAP));
	if (shaded) {
		const sand = ctx.createLinearGradient(0, 46, 0, 82);
		sand.addColorStop(0, 'rgba(255,246,228,0.28)');
		sand.addColorStop(0.45, 'rgba(255,246,228,0.03)');
		sand.addColorStop(1, 'rgba(26,20,14,0.46)');
		ctx.fillStyle = sand;
		ctx.fillRect(398, 44, 102, 40);
	}
	ctx.fillStyle = 'rgba(50,42,32,0.3)';
	for (const [px, py, pr] of [
		[414, 72, 6],
		[442, 74, 7],
		[470, 73, 6],
		[490, 70, 4.4]
	] as Array<[number, number, number]>) {
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}

	const stones: Array<[number, number, number, string]> = [
		[406, 62, 3, '#857C71'],
		[416, 61, 3.2, '#948B7E'],
		[426, 60, 3.4, '#7F766B'],
		[436, 59, 3.6, '#948B7E'],
		[446, 58, 3.4, '#857C71'],
		[456, 60, 3.2, '#776E63'],
		[466, 59, 3.4, '#948B7E'],
		[476, 60, 3, '#857C71'],
		[486, 62, 3.2, '#7F766B'],
		[494, 63, 2.6, '#948B7E'],
		[422, 66, 2.6, '#776E63'],
		[442, 64, 2.8, '#857C71'],
		[462, 66, 2.8, '#7F766B'],
		[480, 66, 2.4, '#776E63'],
		[410, 70, 2.2, '#7F766B'],
		[432, 70, 2.2, '#857C71'],
		[452, 70, 2.2, '#948B7E'],
		[470, 70, 2, '#776E63']
	];
	for (const [cx, cy, r, tone] of stones) {
		ctx.fillStyle = 'rgba(28,22,16,0.32)';
		ctx.beginPath();
		ctx.ellipse(cx + 0.8, cy + 1.2, r, r * 0.8, 0, 0, Math.PI * 2);
		ctx.fill();
		circle(ctx, cx, cy, r, tone, 1.3);
		ctx.save();
		ctx.globalAlpha = 0.13;
		ctx.fillStyle = CREAM;
		ctx.beginPath();
		ctx.arc(cx - r * 0.3, cy - r * 0.34, r * 0.34, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Angular broken chunks among the round stones.
	for (const [cx, cy, cw, chh, tone] of [
		[434, 56, 7, 5, '#8B8175'],
		[458, 57, 6, 4.4, '#7F766B'],
		[484, 59, 6, 4.4, '#776E63']
	] as Array<[number, number, number, number, string]>) {
		shape(
			ctx,
			`M${cx},${cy - chh / 2} L${cx + cw / 2},${cy - chh * 0.15} L${cx + cw * 0.3},${cy + chh / 2} L${cx - cw * 0.4},${cy + chh * 0.3} L${cx - cw / 2},${cy - chh * 0.25} Z`,
			tone,
			1.3
		);
	}

	// Fine grit.
	ctx.fillStyle = 'rgba(66,56,44,0.6)';
	for (const [gx, gy] of [
		[404, 70],
		[418, 74],
		[430, 64],
		[444, 68],
		[456, 64],
		[468, 70],
		[478, 66],
		[490, 68],
		[494, 60],
		[424, 62]
	] as Array<[number, number]>) {
		ctx.fillRect(gx, gy, 1.2, 1.2);
	}
	ctx.restore();

	// ---- Lighter steel lip along the near top edge ----
	shape(ctx, SKIP_RIM, '#858C95', 2.4);
	line(ctx, 314, 77.4, 566, 77.4, 'rgba(255,255,255,0.22)', 1.8);
	line(ctx, 316, 83.6, 564, 83.6, 'rgba(8,10,16,0.46)', 1.6);
	for (const bx of [330, 368, 406, 444, 482, 520, 552]) {
		circle(ctx, bx, 81, 1.7, CHROME, 0.9);
	}

	// ---- Lifting lugs at the top corners ----
	for (const lx of [320, 558]) {
		shape(ctx, `M${lx - 5},77 L${lx + 4},77 L${lx + 4},69 L${lx - 5},69 Z`, STEEL_DARK, 1.6);
		circle(ctx, lx - 0.5, 69, 3.2, CHROME, 1.4);
		if (fitted) circle(ctx, lx - 0.5, 69, 1.3, STEEL_DARK, 0.8);
	}

	if (fitted) {
		// Small hire plate and an orange tag on the wall — no long stripes.
		rect(ctx, 552, 148, 38, 13, CREAM, 2, 1.8);
		ctx.fillStyle = CHARCOAL;
		ctx.fillRect(556, 151.4, 24, 2);
		ctx.fillRect(556, 155.6, 16, 1.6);
		ctx.fillStyle = ORANGE;
		ctx.fillRect(582, 150.6, 6, 7);
	}

	if (finish) {
		ctx.save();
		ctx.clip(new Path2D(SKIP_WALL));
		// Scratches and a worn base edge.
		ctx.strokeStyle = 'rgba(255,246,228,0.34)';
		ctx.lineWidth = 1.4;
		ctx.beginPath();
		ctx.moveTo(300, 168);
		ctx.lineTo(340, 165);
		ctx.moveTo(360, 120);
		ctx.lineTo(392, 114);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(10,12,20,0.24)';
		ctx.lineWidth = 1.2;
		ctx.beginPath();
		ctx.moveTo(300, 170);
		ctx.lineTo(340, 167);
		ctx.moveTo(360, 122);
		ctx.lineTo(392, 116);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,246,228,0.28)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.moveTo(290, 176.4);
		ctx.lineTo(330, 176.4);
		ctx.moveTo(470, 176.4);
		ctx.lineTo(520, 176.4);
		ctx.stroke();
		// Rust speckle on the two blooms.
		ctx.fillStyle = 'rgba(120,66,38,0.5)';
		for (const [sx, sy, sr] of [
			[288, 158, 1.4],
			[298, 166, 1],
			[308, 152, 1.2],
			[584, 114, 1.3],
			[592, 124, 1],
			[596, 108, 1.2]
		] as Array<[number, number, number]>) {
			ctx.beginPath();
			ctx.arc(sx, sy, sr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();

		// Picture-book plate: rolled grain, rust runs and bare-metal wear.
		skipPlateFinish(ctx);

		// A nick out of the lip and a little sand spilling over it.
		line(ctx, 352, 79.2, 362, 79.2, 'rgba(255,255,255,0.3)', 1.2);
		ctx.save();
		ctx.globalAlpha = 0.42;
		ctx.fillStyle = '#9A8C76';
		for (const [dx, dy, dr] of [
			[442, 80, 1.2],
			[452, 78.6, 0.9],
			[464, 80.2, 1.1]
		] as Array<[number, number, number]>) {
			ctx.beginPath();
			ctx.arc(dx, dy, dr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}
}

/** Exhaust stack behind the cab with its rain cap. */
function drawStack(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	finish: boolean
): void {
	shape(ctx, STACK, STEEL, 2.4);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D(STACK));
		const pipe = ctx.createLinearGradient(224, 0, 232, 0);
		pipe.addColorStop(0, 'rgba(255,255,255,0.32)');
		pipe.addColorStop(0.45, 'rgba(255,255,255,0.04)');
		pipe.addColorStop(1, 'rgba(0,0,0,0.36)');
		ctx.fillStyle = pipe;
		ctx.fillRect(222, 134, 12, 46);
		ctx.restore();
	}
	if (fitted) {
		line(ctx, 224, 152, 232, 152, 'rgba(58,39,27,0.55)', 2.2);
		line(ctx, 224, 154, 232, 154, 'rgba(255,255,255,0.2)', 1.1);
		line(ctx, 223, 135.4, 233, 135.4, 'rgba(255,255,255,0.5)', 1.2);
	}
	if (finish) {
		// Soot at the cap.
		ctx.save();
		ctx.globalAlpha = 0.26;
		ctx.fillStyle = INK;
		ctx.beginPath();
		ctx.ellipse(228, 137, 5.6, 2.2, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

/** Deterministic picture-book grain over the orange paint only. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const panels = new Path2D(CAB);
	panels.addPath(new Path2D(DECK));
	panels.addPath(new Path2D(WINDSCREEN));
	panels.addPath(new Path2D(SIDE_WINDOW));

	ctx.save();
	ctx.clip(panels, 'evenodd');
	let seed = 29;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 330; i++) {
		const px = 38 + rnd() * 612;
		const py = 98 + rnd() * 140;
		const size = 1.5 + rnd() * 1.6;
		ctx.globalAlpha = 0.09 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	ctx.fillStyle = CREAM;
	for (let i = 0; i < 110; i++) {
		const px = 38 + rnd() * 612;
		const py = 98 + rnd() * 140;
		const size = 1.3 + rnd() * 1.2;
		ctx.globalAlpha = 0.16 + rnd() * 0.1;
		ctx.fillRect(px, py, size, size);
	}
	ctx.restore();
}

/** Chips, road dust and lamp pips for the picture-book pass. */
function finishingMarks(ctx: CanvasRenderingContext2D): void {
	for (const [chipX, chipY, w, h, alpha] of [
		[56, 205, 8, 1.8, 0.42],
		[118, 200, 6, 1.6, 0.34],
		[214, 190, 9, 1.8, 0.3],
		[404, 192, 7, 1.6, 0.28],
		[630, 192, 8, 1.8, 0.32]
	] as Array<[number, number, number, number, number]>) {
		ctx.save();
		ctx.globalAlpha = alpha;
		ctx.fillStyle = CREAM;
		ctx.fillRect(chipX, chipY, w, h);
		ctx.restore();
	}

	// Dust settled along the deck's lower seam.
	ctx.save();
	ctx.globalAlpha = 0.13;
	ctx.fillStyle = INK;
	for (let dust = 0; dust < 8; dust++) {
		const dx = 224 + dust * 54;
		if (dx > 470 && dx < 550) continue;
		ctx.fillRect(dx, 218 + (dust % 2), 15, 1.8);
	}
	ctx.restore();

	// Lamp pips: a bright core in the headlamp and the beacon.
	ctx.fillStyle = '#FFFDF2';
	for (const [pipX, pipY, pipR] of [
		[51.2, 200, 1.3],
		[180, 92, 1.2]
	]) {
		ctx.beginPath();
		ctx.arc(pipX, pipY, pipR, 0, Math.PI * 2);
		ctx.fill();
	}

	// A cooled exhaust puff blooming off the stack, then the pale wisp over it.
	ctx.save();
	ctx.fillStyle = '#9AA3B2';
	for (const [px, py, pr, alpha] of [
		[233, 129, 3.4, 0.26],
		[239, 121, 4.4, 0.22],
		[247, 115, 5.2, 0.17],
		[256, 111, 4.2, 0.12],
		[264, 108, 2.8, 0.07]
	] as Array<[number, number, number, number]>) {
		ctx.globalAlpha = alpha;
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();

	// Exhaust wisp above the stack.
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = CREAM;
	for (const [px, py, pr] of [
		[229, 130, 3.4],
		[235, 122, 4.6],
		[243, 116, 5.4],
		[252, 112, 4]
	]) {
		ctx.beginPath();
		ctx.arc(px, py, pr, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

export function drawRealSkipLoaderLevel(
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
		ctx.ellipse(342, 249, 300, 9, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Lift gantry first: its riser tucks behind the cab and the deck.
	drawGantry(ctx, shaded, fitted, finish);

	// Chassis rail under the cab, between the bumper and the bed.
	rect(ctx, 44, 208, 160, 12, CHARCOAL_DARK, 0, 2.4);

	// Flat bed, cab, skip and stack.
	drawBed(ctx, shaded, fitted);
	drawCab(ctx, shaded, fitted, finish);

	// Pivot bracket where the gantry meets the deck's front.
	if (fitted) {
		rect(ctx, 203, 171, 19, 9, CHARCOAL_DARK, 2, 2.2);
		circle(ctx, 212.5, 175.5, 4.4, CHROME, 1.5);
		circle(ctx, 212.5, 175.5, 1.8, STEEL_DARK, 1);
	}

	drawSkip(ctx, shaded, fitted, finish);
	drawStack(ctx, shaded, fitted, finish);

	// Wheel wells, arch lips, then the one wheel piece used twice.
	wheelWell(ctx, WHEEL_L.x, ARCH, 222, shaded);
	wheelWell(ctx, WHEEL_R.x, ARCH, 220, shaded);
	if (fitted) {
		archLip(ctx, WHEEL_L.x, 1.086, 1.914);
		archLip(ctx, WHEEL_R.x, 0.958, 2.042);
	}

	wheel(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
	wheel(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

	if (lit) {
		// Rim light: cab roof, skip rail, deck edge and the boom.
		ctx.strokeStyle = 'rgba(255,255,255,0.52)';
		ctx.lineWidth = 2.6;
		ctx.beginPath();
		ctx.moveTo(88, 78.4);
		ctx.lineTo(216, 88.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.46)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.moveTo(315, 76.4);
		ctx.lineTo(565, 76.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(270, 178.4);
		ctx.lineTo(311, 76.8);
		ctx.moveTo(569, 76.8);
		ctx.lineTo(610, 178.4);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(255,255,255,0.38)';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(208, 181.4);
		ctx.lineTo(644, 181.4);
		ctx.stroke();

		// Headlight glow and the beacon flash.
		const glow = ctx.createRadialGradient(52, 201, 1, 52, 201, 27);
		glow.addColorStop(0, 'rgba(255,240,150,0.7)');
		glow.addColorStop(1, 'rgba(255,240,150,0)');
		ctx.fillStyle = glow;
		ctx.beginPath();
		ctx.arc(52, 201, 27, 0, Math.PI * 2);
		ctx.fill();

		const beacon = ctx.createRadialGradient(182, 92, 1, 182, 92, 19);
		beacon.addColorStop(0, 'rgba(255,183,3,0.52)');
		beacon.addColorStop(1, 'rgba(255,183,3,0)');
		ctx.fillStyle = beacon;
		ctx.beginPath();
		ctx.arc(182, 92, 19, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the tyres.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const wx of [WHEEL_L.x, WHEEL_R.x]) {
			ctx.beginPath();
			ctx.ellipse(wx, 244, 28, 4.6, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Chrome and paint glints, all clear of the tyre circles.
		glint(ctx, 112, 132, 3.4);
		glint(ctx, 400, 190, 3);
		glint(ctx, 160, 84, 2.8);
		glint(ctx, 314, 88, 2.2);
		glint(ctx, 592, 166, 2.2);
		line(ctx, 58, 124, 76, 156, 'rgba(255,255,255,0.5)', 2.4);

		// Picture-book hub hardware on both wheels.
		hubFinish(ctx, WHEEL_L.x, WHEEL_L.y, WHEEL_L.r);
		hubFinish(ctx, WHEEL_R.x, WHEEL_R.y, WHEEL_R.r);

		finishingMarks(ctx);
	}

	ctx.restore();
}

export function drawRealSkipLoader(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealSkipLoaderLevel(ctx, x, y, scale, 5);
}
