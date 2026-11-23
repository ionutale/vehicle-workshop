/**
 * Steam roller art, cut into the same five-piece kit as the other realistic works machines.
 * A vintage roller facing left: a tall flared chimney and brass dome on a riveted red boiler,
 * an open-sided canopy on slim posts over the driver's platform, a big smooth front drum and
 * a pair of smaller steel rear wheels. One drum piece and one wheel piece carry the slots.
 * Level 5 is the production target: shaded, fully fitted, lit and picture-book finished.
 */

import { CHROME, GLASS, INK, STEEL, circle, circleMask, line, rect, shape } from './realKit';

const RED = '#C1121F';
const RED_DEEP = '#7C0A14';
const CHARCOAL = '#2B2D42';
const CHARCOAL_LIGHT = '#3D405B';
const CHARCOAL_DEEP = '#1B1C2A';
const BRASS = '#C9A227';
const BRASS_LIGHT = '#EBCE72';
const BRASS_DARK = '#8A6C12';
const LAMP = '#FFF3B0';
const CREAM = '#FFF4DC';

/** Art box 700 x 360, road at 272. The front drum faces left. */
const DRUM = { x: 160, y: 224, r: 48 };
const WHEEL = { x: 560, y: 242, r: 30 };
const WHEEL_FAR = { x: 592, y: 245, r: 27 };

/**
 * One shell for smokebox, boiler barrel, firebox, running board and coal bunker. The front
 * face stops at the drum so the roll tucks under the smokebox without an arch cut.
 */
const BODY =
	'M196,252 L196,146 Q196,140 202,140 L266,140 Q282,150 302,150 L410,150 Q424,150 424,134 L472,134 L472,206 L596,206 L596,168 Q596,162 604,162 L640,162 Q648,162 648,170 L648,236 L636,252 Z';

/** Flared chimney, welded onto the smokebox crown. */
const CHIMNEY =
	'M232,140 L234,88 Q234,80 230,78 L224,70 Q222,58 232,58 L262,58 Q272,58 270,70 L264,78 Q260,80 260,88 L262,140 Z';

/** Headlamp case on the smokebox crown. */
const LAMP_BOX = 'M196,140 L196,114 Q196,108 202,108 L226,108 Q232,108 232,114 L232,140 Z';

/** Rear drawbar with its coupling eye. */
const DRAWBAR = 'M648,220 L658,220 L658,228 L666,228 L666,236 L648,236 Z';

/** Dome, whistle and safety valve stand proud of the boiler crown, so they join the mask. */
const DOME = 'M334,150 Q334,122 352,122 Q370,122 370,150 Z';
const WHISTLE = 'M392,129 L399,129 L399,150 L392,150 Z';
const SAFETY = 'M436,124 L454,124 L454,134 L436,134 Z';

/** Reversing lever and brake standard standing on the open footplate. */
const REVERSING_LEVER = 'M512,206 L507,184 L502,179 L502,173 L496,173 L496,180 L500,184 L506,206 Z';
const BRAKE_LEVER = 'M534,206 L530,186 L522,186 L526,206 Z';
const LEVERS = `${REVERSING_LEVER} ${BRAKE_LEVER}`;

const BODY_MASK = `${BODY} ${CHIMNEY} ${LAMP_BOX} ${DRAWBAR} ${DOME} ${WHISTLE} ${SAFETY} ${LEVERS}`;

/** Canopy: cambered roof, red fascia, two slim posts and an open side between them. */
const CANOPY =
	'M444,120 Q444,100 464,100 L624,100 Q644,100 644,120 L644,132 L632,132 L632,162 L618,162 L618,132 L466,132 L466,206 L452,206 L452,132 L444,132 Z';

/** Brass oil lamp hanging from the canopy underside. */
const CANOPY_LAMP = 'M552,132 L552,139 Q552,148 558,148 Q564,148 564,139 L564,132 Z';

const CANOPY_MASK = `${CANOPY} ${CANOPY_LAMP}`;

/** Vertical paint shading over one region of the shell. */
function regionShade(
	ctx: CanvasRenderingContext2D,
	path: string,
	x: number,
	y: number,
	w: number,
	h: number,
	light: number,
	dark: number
): void {
	ctx.save();
	ctx.clip(new Path2D(path));
	const paint = ctx.createLinearGradient(0, y, 0, y + h);
	paint.addColorStop(0, `rgba(255,255,255,${light})`);
	paint.addColorStop(0.4, 'rgba(255,255,255,0.02)');
	paint.addColorStop(0.78, 'rgba(0,0,0,0.06)');
	paint.addColorStop(1, `rgba(38,6,10,${dark})`);
	ctx.fillStyle = paint;
	ctx.fillRect(x, y, w, h);
	ctx.restore();
}

/** A four-point paint glint with a warm core. */
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

	ctx.fillStyle = CREAM;
	ctx.beginPath();
	ctx.arc(x, y, 1.6, 0, Math.PI * 2);
	ctx.fill();
}

/** A lit rivet or bolt head: a pale domed cap over a small contact shadow. */
function stud(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	r: number,
	alpha = 0.78
): void {
	ctx.fillStyle = 'rgba(58,39,27,0.32)';
	ctx.beginPath();
	ctx.arc(x, y + r * 0.4, r, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = `rgba(255,250,232,${alpha})`;
	ctx.beginPath();
	ctx.arc(x - r * 0.18, y - r * 0.26, r * 0.74, 0, Math.PI * 2);
	ctx.fill();
}

/** A smooth steel roll: rolled rim around a flat machined face and a brass hub. */
function drawDrum(
	ctx: CanvasRenderingContext2D,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean
): void {
	const { x, y, r } = DRUM;
	circle(ctx, x, y, r, '#7C8595', 3.2);

	// Rolled rim band.
	ctx.strokeStyle = '#4E5664';
	ctx.lineWidth = Math.max(5, r * 0.11);
	ctx.beginPath();
	ctx.arc(x, y, r - 3.2, 0, Math.PI * 2);
	ctx.stroke();

	// Flat machined end face, proud of the rim.
	ctx.beginPath();
	ctx.arc(x, y, r * 0.76, 0, Math.PI * 2);
	ctx.fillStyle = 'rgba(255,255,255,0.07)';
	ctx.fill();

	circle(ctx, x, y, r * 0.22, '#4B5361', 2.2);
	circle(ctx, x, y, r * 0.1, BRASS, 1.6);

	if (shaded) {
		// Rolled crown: light on the upper face, a deep contact shade along the road edge.
		ctx.save();
		ctx.beginPath();
		ctx.arc(x, y, r - 1.5, 0, Math.PI * 2);
		ctx.clip();
		const crown = ctx.createLinearGradient(x - r * 0.5, y - r, x + r * 0.5, y + r);
		crown.addColorStop(0, 'rgba(255,255,255,0.34)');
		crown.addColorStop(0.44, 'rgba(255,255,255,0.03)');
		crown.addColorStop(1, 'rgba(10,12,20,0.38)');
		ctx.fillStyle = crown;
		ctx.fillRect(x - r, y - r, r * 2, r * 2);

		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = Math.max(2, r * 0.06);
		ctx.beginPath();
		ctx.arc(x, y, r * 0.86, Math.PI * 1.06, Math.PI * 1.52);
		ctx.stroke();
		ctx.restore();
	}

	if (fitted) {
		// Wide-set rim nuts, close in so the smooth face never reads as a tyre.
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
			circle(
				ctx,
				x + Math.cos(a) * r * 0.4,
				y + Math.sin(a) * r * 0.4,
				Math.max(1.4, r * 0.04),
				'#3A4050',
				1
			);
		}
		ctx.strokeStyle = BRASS;
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.arc(x, y, r * 0.62, 0, Math.PI * 2);
		ctx.stroke();
	}

	if (lit) {
		ctx.strokeStyle = 'rgba(255,255,255,0.62)';
		ctx.lineWidth = 2.8;
		ctx.beginPath();
		ctx.arc(x, y, r - 2, Math.PI * 1.05, Math.PI * 1.6);
		ctx.stroke();
	}

	if (finish) {
		// Machined wear rings and a warm bounce off the road.
		ctx.save();
		ctx.beginPath();
		ctx.arc(x, y, r - 2, 0, Math.PI * 2);
		ctx.clip();

		ctx.strokeStyle = 'rgba(255,255,255,0.42)';
		ctx.lineWidth = Math.max(1.4, r * 0.045);
		ctx.beginPath();
		ctx.arc(x, y, r * 0.7, Math.PI * 1.02, Math.PI * 1.98);
		ctx.stroke();
		ctx.strokeStyle = 'rgba(20,26,38,0.22)';
		ctx.lineWidth = Math.max(1.2, r * 0.032);
		ctx.beginPath();
		ctx.arc(x, y, r * 0.58, Math.PI * 0.98, Math.PI * 2.02);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.24)';
		ctx.lineWidth = Math.max(5, r * 0.13);
		ctx.beginPath();
		ctx.arc(x, y, r * 0.84, Math.PI * 1.16, Math.PI * 1.42);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,203,112,0.16)';
		ctx.lineWidth = Math.max(4, r * 0.09);
		ctx.beginPath();
		ctx.arc(x, y, r * 0.92, Math.PI * 0.3, Math.PI * 0.7);
		ctx.stroke();
		ctx.restore();

		// Polished hub with cap bolts.
		ctx.strokeStyle = 'rgba(255,255,255,0.7)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(x, y, r * 0.28, 0, Math.PI * 2);
		ctx.stroke();
		for (let i = 0; i < 6; i++) {
			const a = (i / 6) * Math.PI * 2 + Math.PI / 12;
			circle(
				ctx,
				x + Math.cos(a) * r * 0.24,
				y + Math.sin(a) * r * 0.24,
				Math.max(1.1, r * 0.03),
				CHROME,
				0.9
			);
		}
		ctx.fillStyle = 'rgba(255,255,255,0.92)';
		ctx.beginPath();
		ctx.arc(x, y, Math.max(1.2, r * 0.04), 0, Math.PI * 2);
		ctx.fill();

		// Lit caps on the rim nuts, then a machined collar and slot in the hub cap.
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
			stud(
				ctx,
				x + Math.cos(a) * r * 0.4,
				y + Math.sin(a) * r * 0.4,
				Math.max(0.85, r * 0.028),
				0.82
			);
		}
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = Math.max(1, r * 0.03);
		ctx.beginPath();
		ctx.arc(x, y, r * 0.16, Math.PI * 1.04, Math.PI * 1.72);
		ctx.stroke();
		line(ctx, x - r * 0.045, y, x + r * 0.045, y, 'rgba(58,39,27,0.4)', 1);

		glint(ctx, x + r * 0.42, y - r * 0.46, r * 0.15);
		glint(ctx, x - r * 0.5, y + r * 0.38, r * 0.07);
	}
}

/** A spoked steel road wheel; the far one is darker so the pair reads in depth. */
function drawRearWheel(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	r: number,
	shaded: boolean,
	fitted: boolean,
	lit: boolean,
	finish: boolean,
	far: boolean
): void {
	circle(ctx, cx, cy, r, far ? '#24263A' : CHARCOAL, 3);

	// Felloe band inside the steel tyre.
	ctx.strokeStyle = far ? '#4A5162' : STEEL;
	ctx.lineWidth = Math.max(3, r * 0.13);
	ctx.beginPath();
	ctx.arc(cx, cy, r * 0.84, 0, Math.PI * 2);
	ctx.stroke();

	// Ten straight spokes into the hub.
	ctx.strokeStyle = far ? '#394053' : '#6C7484';
	ctx.lineWidth = Math.max(2, r * 0.075);
	for (let i = 0; i < 10; i++) {
		const a = (i / 10) * Math.PI * 2 + Math.PI / 10;
		ctx.beginPath();
		ctx.moveTo(cx + Math.cos(a) * r * 0.24, cy + Math.sin(a) * r * 0.24);
		ctx.lineTo(cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8);
		ctx.stroke();
	}

	circle(ctx, cx, cy, r * 0.26, BRASS, 2.2);
	circle(ctx, cx, cy, r * 0.09, BRASS_LIGHT, 1.4);

	if (shaded) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
		ctx.clip();
		const crown = ctx.createLinearGradient(cx - r * 0.5, cy - r, cx + r * 0.5, cy + r);
		crown.addColorStop(0, 'rgba(255,255,255,0.26)');
		crown.addColorStop(0.45, 'rgba(255,255,255,0.02)');
		crown.addColorStop(1, 'rgba(8,10,18,0.42)');
		ctx.fillStyle = crown;
		ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
		ctx.restore();
	}

	if (fitted) {
		// Rim rivets and hub bolts.
		for (let i = 0; i < 12; i++) {
			const a = (i / 12) * Math.PI * 2;
			circle(
				ctx,
				cx + Math.cos(a) * r * 0.93,
				cy + Math.sin(a) * r * 0.93,
				Math.max(1.1, r * 0.032),
				far ? '#6A7284' : CHROME,
				0.9
			);
		}
		for (let i = 0; i < 6; i++) {
			const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
			circle(
				ctx,
				cx + Math.cos(a) * r * 0.2,
				cy + Math.sin(a) * r * 0.2,
				Math.max(1, r * 0.028),
				BRASS_DARK,
				0.8
			);
		}
	}

	if (lit) {
		ctx.strokeStyle = far ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.6)';
		ctx.lineWidth = 2.2;
		ctx.beginPath();
		ctx.arc(cx, cy, r - 1.8, Math.PI * 1.05, Math.PI * 1.58);
		ctx.stroke();
	}

	if (finish) {
		ctx.strokeStyle = 'rgba(255,255,255,0.4)';
		ctx.lineWidth = 1.6;
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.62, Math.PI * 1.1, Math.PI * 1.55);
		ctx.stroke();

		// Felloe rivets and hub bolts catch a lit cap; the far wheel stays quieter.
		const cap = far ? 0.36 : 0.82;
		for (let i = 0; i < 12; i++) {
			const a = (i / 12) * Math.PI * 2;
			stud(
				ctx,
				cx + Math.cos(a) * r * 0.93,
				cy + Math.sin(a) * r * 0.93,
				Math.max(0.7, r * 0.022),
				cap
			);
		}
		for (let i = 0; i < 6; i++) {
			const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
			stud(
				ctx,
				cx + Math.cos(a) * r * 0.2,
				cy + Math.sin(a) * r * 0.2,
				Math.max(0.65, r * 0.018),
				cap
			);
		}
		ctx.strokeStyle = `rgba(255,255,255,${far ? 0.3 : 0.52})`;
		ctx.lineWidth = 1.1;
		ctx.beginPath();
		ctx.arc(cx, cy, r * 0.17, Math.PI * 1.02, Math.PI * 1.7);
		ctx.stroke();

		glint(ctx, cx + r * 0.3, cy - r * 0.42, Math.max(2, r * 0.11));
	}
}

/** Deterministic picture-book paint grain over the red shell, clear of glass and wheels. */
function paintGrain(ctx: CanvasRenderingContext2D): void {
	const keepOut = `${circleMask(DRUM.x, DRUM.y, DRUM.r)} ${circleMask(
		WHEEL.x,
		WHEEL.y,
		WHEEL.r
	)} ${circleMask(WHEEL_FAR.x, WHEEL_FAR.y, WHEEL_FAR.r)}`;

	ctx.save();
	ctx.clip(new Path2D(`${BODY_MASK} ${keepOut}`), 'evenodd');

	let seed = 37;
	const rnd = (): number => {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280;
	};

	ctx.fillStyle = INK;
	for (let i = 0; i < 360; i++) {
		const px = 200 + rnd() * 448;
		const py = 60 + rnd() * 190;
		const size = 1.4 + rnd() * 1.3;
		ctx.globalAlpha = 0.07 + rnd() * 0.05;
		ctx.fillRect(px, py, size, size);
	}
	ctx.fillStyle = CREAM;
	for (let i = 0; i < 130; i++) {
		const px = 200 + rnd() * 448;
		const py = 60 + rnd() * 190;
		const size = 1.2 + rnd() * 1.1;
		ctx.globalAlpha = 0.13 + rnd() * 0.08;
		ctx.fillRect(px, py, size, size);
	}
	// Warm primer flecks keep the red from reading as flat plastic.
	ctx.fillStyle = RED_DEEP;
	for (let i = 0; i < 100; i++) {
		const px = 200 + rnd() * 448;
		const py = 60 + rnd() * 190;
		const size = 1.1 + rnd() * 1.2;
		ctx.globalAlpha = 0.09 + rnd() * 0.06;
		ctx.fillRect(px, py, size, size);
	}

	// Long brush sweeps along the boiler and the footplate.
	ctx.globalAlpha = 0.15;
	ctx.strokeStyle = '#FFFFFF';
	ctx.lineWidth = 2;
	for (const [x1, y1, x2, y2] of [
		[272, 168, 414, 166],
		[278, 206, 420, 204],
		[480, 188, 592, 187],
		[430, 150, 468, 149]
	]) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.quadraticCurveTo((x1 + x2) / 2, y1 - 2, x2, y2);
		ctx.stroke();
	}
	ctx.globalAlpha = 0.1;
	ctx.lineWidth = 1.3;
	for (const [x1, y1, x2, y2] of [
		[300, 132, 350, 131],
		[366, 132, 402, 131]
	]) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	ctx.restore();
}

export function drawRealSteamRollerLevel(
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
		ctx.ellipse(390, 277, 292, 11, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Shell first: boiler, smokebox, firebox, footplate and bunker are one red mass.
	shape(ctx, BODY, RED);
	shape(ctx, CHIMNEY, RED);
	shape(ctx, LAMP_BOX, BRASS);
	shape(ctx, DRAWBAR, CHARCOAL, 2.5);

	if (shaded) {
		regionShade(ctx, BODY, 266, 146, 158, 100, 0.3, 0.34);
		regionShade(ctx, BODY, 196, 140, 70, 112, 0.14, 0.34);
		regionShade(ctx, BODY, 424, 134, 48, 118, 0.26, 0.3);
		regionShade(ctx, BODY, 472, 162, 176, 90, 0.1, 0.26);
		regionShade(ctx, CHIMNEY, 224, 58, 48, 82, 0.22, 0.2);
	}

	// Chassis, running board and ashpan sit over the lower shell.
	ctx.save();
	ctx.clip(new Path2D(BODY_MASK), 'evenodd');

	rect(ctx, 204, 236, 426, 16, CHARCOAL, 3);
	rect(ctx, 210, 240, 412, 3, CHARCOAL_LIGHT, 0, 0);
	rect(ctx, 474, 212, 50, 24, CHARCOAL, 3);
	rect(ctx, 470, 206, 178, 8, CHARCOAL, 2);

	// Coal bunker face and its brass latch.
	ctx.fillStyle = CHARCOAL;
	ctx.fillRect(598, 162, 46, 44);
	ctx.fillStyle = RED_DEEP;
	ctx.fillRect(598, 162, 46, 5);
	ctx.restore();
	line(ctx, 600, 162, 640, 162, BRASS_LIGHT, 1.6);

	// Brass boiler bands carry the livery at every level.
	for (const bandX of [306, 356, 406]) {
		rect(ctx, bandX, 150, 7, 92, BRASS, 1.5, 2);
		line(ctx, bandX + 2, 153, bandX + 2, 238, 'rgba(255,255,255,0.42)', 1.2);
	}

	// Steam dome sits on the boiler crown; whistle and safety valve are fittings.
	shape(ctx, DOME, BRASS, 2.5);
	line(ctx, 336, 150, 368, 150, BRASS_DARK, 1.6);
	line(ctx, 338, 140, 366, 140, BRASS_LIGHT, 2);

	// Smokebox front band keeps the nose dark at every level.
	rect(ctx, 196, 140, 14, 112, CHARCOAL, 0, 2.5);

	// Chimney crown and base ring, clipped to the stack.
	ctx.save();
	ctx.clip(new Path2D(CHIMNEY));
	rect(ctx, 218, 58, 56, 18, CHARCOAL_DEEP, 0, 0);
	rect(ctx, 218, 85, 56, 6, BRASS, 0, 0);
	line(ctx, 230, 94, 230, 138, 'rgba(255,255,255,0.18)', 3);
	ctx.restore();

	// Headlamp: brass case with a glass lens facing forward.
	circle(ctx, 205, 126, 9, BRASS_DARK, 2);
	circle(ctx, 205, 126, 7, GLASS, 1.6);
	if (shaded) {
		ctx.save();
		ctx.clip(new Path2D('M198,126 A7,7 0 1 1 212,126 A7,7 0 1 1 198,126 Z'));
		const lens = ctx.createLinearGradient(198, 120, 212, 134);
		lens.addColorStop(0, 'rgba(255,255,255,0.7)');
		lens.addColorStop(1, 'rgba(105,190,240,0.25)');
		ctx.fillStyle = lens;
		ctx.fillRect(198, 119, 14, 14);
		ctx.restore();
	}

	if (fitted) {
		// Whistle and the firebox safety valve.
		rect(ctx, 392, 132, 7, 18, BRASS, 2);
		rect(ctx, 392, 129, 7, 4, BRASS_DARK, 1.5);
		rect(ctx, 436, 124, 18, 10, BRASS, 2);
		line(ctx, 439, 127, 451, 127, BRASS_LIGHT, 1.4);

		// Smokebox rivets, feed pump and its pipe along the boiler flank.
		for (let rivetY = 158; rivetY <= 234; rivetY += 18) {
			circle(ctx, 203, rivetY, 1.7, BRASS, 1);
		}
		rect(ctx, 214, 196, 20, 16, BRASS, 2);
		line(ctx, 234, 204, 300, 204, BRASS, 3);
		line(ctx, 250, 200, 250, 208, BRASS_DARK, 2.4);
		line(ctx, 282, 200, 282, 208, BRASS_DARK, 2.4);

		// Firebox: brass door, hinges and a pressure gauge.
		rect(ctx, 430, 174, 36, 30, BRASS_DARK, 3, 2);
		line(ctx, 432, 181, 438, 181, BRASS_LIGHT, 1.6);
		line(ctx, 432, 197, 438, 197, BRASS_LIGHT, 1.6);
		circle(ctx, 460, 178, 3, BRASS_LIGHT, 1.2);
		circle(ctx, 452, 158, 7, CHROME, 2);
		circle(ctx, 452, 158, 4.6, '#EAF6FF', 1.2);
		line(ctx, 452, 158, 455, 155, INK, 1.2);

		// Bunker latch and the headlamp crown vent.
		circle(ctx, 628, 184, 4.5, BRASS, 1.8);
		rect(ctx, 198, 110, 32, 6, CHARCOAL, 1, 2);

		// Rear coupling eye on the drawbar.
		circle(ctx, 662, 232, 4, CHROME, 1.8);
		circle(ctx, 662, 232, 1.6, INK, 1);
	}

	// Driver's controls stand in the open side of the canopy.
	shape(ctx, REVERSING_LEVER, BRASS, 2);
	circle(ctx, 499, 177, 3.2, BRASS_LIGHT, 1.4);
	shape(ctx, BRAKE_LEVER, STEEL, 2);
	line(ctx, 522, 186, 530, 186, CHROME, 3);

	// Locomotion: the far wheel first, then the near one, then the big front roll.
	drawRearWheel(
		ctx,
		WHEEL_FAR.x,
		WHEEL_FAR.y,
		WHEEL_FAR.r,
		shaded,
		fitted,
		lit,
		finish,
		true
	);
	drawRearWheel(ctx, WHEEL.x, WHEEL.y, WHEEL.r, shaded, fitted, lit, finish, false);
	drawDrum(ctx, shaded, fitted, lit, finish);

	// Canopy over the driver's platform: open sides, brass caps and scroll brackets.
	shape(ctx, CANOPY_MASK, CHARCOAL);
	shape(ctx, CANOPY_LAMP, BRASS, 2);
	circle(ctx, 558, 141, 4, LAMP, 1.6);

	ctx.save();
	ctx.clip(new Path2D(CANOPY_MASK));

	if (shaded) {
		const roof = ctx.createLinearGradient(0, 100, 0, 132);
		roof.addColorStop(0, 'rgba(255,255,255,0.34)');
		roof.addColorStop(0.62, 'rgba(255,255,255,0.04)');
		roof.addColorStop(1, 'rgba(10,12,22,0.34)');
		ctx.fillStyle = roof;
		ctx.fillRect(444, 100, 200, 32);

		for (const postX of [452, 618]) {
			const post = ctx.createLinearGradient(postX, 0, postX + 14, 0);
			post.addColorStop(0, 'rgba(255,255,255,0.24)');
			post.addColorStop(0.5, 'rgba(255,255,255,0.03)');
			post.addColorStop(1, 'rgba(0,0,0,0.3)');
			ctx.fillStyle = post;
			ctx.fillRect(postX, 132, 14, 74);
		}
	}

	// Red fascia with brass beading.
	ctx.fillStyle = RED;
	ctx.fillRect(444, 120, 200, 12);
	line(ctx, 444, 120.8, 644, 120.8, BRASS_LIGHT, 1.6);
	line(ctx, 444, 131.2, 644, 131.2, BRASS, 1.6);
	line(ctx, 444, 125.5, 644, 125.5, 'rgba(0,0,0,0.18)', 1.2);

	// Post capitals and base collars.
	if (fitted) {
		for (const [postX, baseY] of [
			[452, 206],
			[618, 162]
		]) {
			ctx.fillStyle = BRASS;
			ctx.fillRect(postX, 132, 14, 7);
			ctx.fillRect(postX, baseY - 7, 14, 7);
			line(ctx, postX + 1, 133, postX + 13, 133, BRASS_LIGHT, 1.2);
		}

		// Brass scroll brackets tying each post into the roof.
		ctx.strokeStyle = BRASS;
		ctx.lineWidth = 2.2;
		for (const [fromX, toX] of [
			[468, 486],
			[614, 596]
		]) {
			ctx.beginPath();
			ctx.moveTo(fromX, 131);
			ctx.quadraticCurveTo(fromX + (toX - fromX) * 0.2, 114, toX, 110);
			ctx.stroke();
		}
	}
	ctx.restore();

	// Painted rim line along the fascia so the canopy reads as a finished board.
	line(ctx, 446, 121, 642, 121, 'rgba(255,255,255,0.2)', 1);

	if (lit) {
		// Rim light along the boiler crown, chimney, canopy roof and bunker.
		ctx.strokeStyle = 'rgba(255,255,255,0.55)';
		ctx.lineWidth = 2.4;
		ctx.beginPath();
		ctx.moveTo(268, 150.6);
		ctx.lineTo(408, 150.6);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(466, 101.4);
		ctx.lineTo(622, 101.4);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(602, 162.6);
		ctx.lineTo(638, 162.6);
		ctx.stroke();

		ctx.strokeStyle = 'rgba(255,255,255,0.36)';
		ctx.lineWidth = 1.8;
		ctx.beginPath();
		ctx.moveTo(233, 90);
		ctx.lineTo(232, 60);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(647, 174);
		ctx.lineTo(647, 196);
		ctx.stroke();

		// Headlamp beam wash.
		const beam = ctx.createRadialGradient(202, 126, 1, 202, 126, 30);
		beam.addColorStop(0, 'rgba(255,243,176,0.72)');
		beam.addColorStop(1, 'rgba(255,243,176,0)');
		ctx.fillStyle = beam;
		ctx.beginPath();
		ctx.arc(202, 126, 30, 0, Math.PI * 2);
		ctx.fill();

		// Warm firebox spill across the footplate.
		const fire = ctx.createRadialGradient(446, 190, 2, 446, 190, 34);
		fire.addColorStop(0, 'rgba(255,140,66,0.22)');
		fire.addColorStop(1, 'rgba(255,140,66,0)');
		ctx.fillStyle = fire;
		ctx.beginPath();
		ctx.arc(446, 190, 34, 0, Math.PI * 2);
		ctx.fill();

		// Canopy lamp wash over the driver's station.
		const canopyGlow = ctx.createRadialGradient(558, 143, 1, 558, 143, 22);
		canopyGlow.addColorStop(0, 'rgba(255,243,176,0.45)');
		canopyGlow.addColorStop(1, 'rgba(255,243,176,0)');
		ctx.fillStyle = canopyGlow;
		ctx.beginPath();
		ctx.arc(558, 143, 22, 0, Math.PI * 2);
		ctx.fill();

		// Contact patches under the roll and both rear wheels.
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = INK;
		for (const contact of [
			[DRUM.x, 40],
			[WHEEL.x, 25],
			[WHEEL_FAR.x, 22]
		]) {
			ctx.beginPath();
			ctx.ellipse(contact[0], 272, contact[1], 5, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	if (finish) {
		paintGrain(ctx);

		// Canopy grain: fine freckles over the painted board only.
		ctx.save();
		ctx.clip(new Path2D(CANOPY_MASK));
		let seed = 91;
		const rnd = (): number => {
			seed = (seed * 9301 + 49297) % 233280;
			return seed / 233280;
		};
		ctx.fillStyle = INK;
		for (let i = 0; i < 90; i++) {
			ctx.globalAlpha = 0.08 + rnd() * 0.06;
			ctx.fillRect(446 + rnd() * 196, 102 + rnd() * 28, 1.6, 1.4);
		}
		ctx.globalAlpha = 0.16;
		ctx.strokeStyle = '#FFFFFF';
		ctx.lineWidth = 1.8;
		for (const [x1, y1, x2, y2] of [
			[470, 108, 618, 107],
			[456, 160, 456, 200],
			[626, 140, 626, 158]
		]) {
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}
		ctx.restore();

		// Rivet sheen: a lit cap on every smokebox rivet and the firebox door studs.
		ctx.save();
		ctx.clip(new Path2D(BODY_MASK), 'evenodd');
		for (let rivetY = 158; rivetY <= 234; rivetY += 18) {
			stud(ctx, 203, rivetY, 1, 0.8);
		}
		stud(ctx, 433, 181, 0.8, 0.7);
		stud(ctx, 433, 197, 0.8, 0.7);
		ctx.restore();

		// Paint glints, all inside the body silhouette.
		ctx.save();
		ctx.clip(new Path2D(BODY_MASK), 'evenodd');
		glint(ctx, 330, 178, 4.6);
		glint(ctx, 386, 196, 3.8);
		glint(ctx, 452, 148, 3.4);
		glint(ctx, 224, 174, 3.6);
		glint(ctx, 620, 176, 3.2);
		glint(ctx, 486, 168, 3.8);
		glint(ctx, 352, 132, 3.4);
		ctx.restore();

		// Polished brass: dome crown, band edges and the lamp bezel.
		line(ctx, 338, 138, 366, 138, 'rgba(255,255,255,0.7)', 1.6);
		for (const bandX of [306, 356, 406]) {
			line(ctx, bandX + 2.2, 154, bandX + 2.2, 186, 'rgba(255,255,255,0.62)', 1.1);
		}
		glint(ctx, 356, 130, 3);
		glint(ctx, 205, 122, 2.6);
		glint(ctx, 630, 168, 2.4);

		// Steel glints: the coupling eye and the pressure gauge.
		glint(ctx, 661.5, 231.5, 1.3);
		glint(ctx, 449.6, 155.6, 1.7);

		// Steam plume drifting off the chimney, with a pale core on the nearest puff.
		ctx.save();
		ctx.fillStyle = 'rgba(126,134,150,0.4)';
		for (const [px, py, pr] of [
			[250, 48, 7],
			[241, 35, 5.4],
			[229, 24, 3.6]
		]) {
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.fillStyle = 'rgba(245,247,250,0.85)';
		ctx.beginPath();
		ctx.arc(249, 46, 3, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealSteamRoller(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number
): void {
	drawRealSteamRollerLevel(ctx, x, y, scale, 5);
}
