import { roundedRect } from '#lib/render/draw';
import { drawRealAirportShuttle } from './realAirportShuttle';
import { drawRealBendyBus } from './realBendyBus';
import { drawRealCoachBus } from './realCoachBus';
import { drawRealMobileClinic } from './realMobileClinic';
import { drawRealTrolleybus } from './realTrolleybus';
import { drawRealMobileLibrary } from './realMobileLibrary';
import { drawRealDoubleDecker } from './realDoubleDecker';
import { drawRealMiniBus } from './realMiniBus';
import { drawRealSchoolBus } from './realSchoolBus';
import { drawRealTram } from './realTram';
import { drawRealMetroTrain } from './realMetroTrain';
import { drawRealLightRailTrain } from './realLightRailTrain';
import { drawRealMilkTanker } from './realMilkTanker';
import { drawRealDumpTruck } from './realDumpTruck';
import { drawRealFlatbedLorry } from './realFlatbedLorry';
import { drawRealCraneTruck } from './realCraneTruck';
import { drawRealCementMixer } from './realCementMixer';
import { drawRealTowTruck } from './realTowTruck';
import { drawRealGarbageTruck } from './realGarbageTruck';
import { drawRealCarTransporter } from './realCarTransporter';
import { drawRealRefrigeratedTruck } from './realRefrigeratedTruck';
import { drawRealCurtainSideLorry } from './realCurtainSideLorry';
import { drawRealParcelLorry } from './realParcelLorry';
import { drawRealLogTruck } from './realLogTruck';
import { drawRealLivestockTruck } from './realLivestockTruck';
import { drawRealWaterTanker } from './realWaterTanker';
import { drawRealFuelTanker } from './realFuelTanker';
import { drawRealIceCreamVan } from './realIceCreamVan';
import { drawRealMailVan } from './realMailVan';
import { drawRealCamper } from './realCamper';
import { drawRealDeliveryVan } from './realDeliveryVan';
import { drawRealArmouredVan } from './realArmouredVan';
import { drawRealAmbulance } from './realAmbulance';
import { drawRealRemovalsVan } from './realRemovalsVan';
import { drawRealPoliceVan } from './realPoliceVan';
import { drawRealPickup } from './realPickup';
import { drawRealPoliceCar } from './realPoliceCar';
import { drawRealTaxi } from './realTaxi';
import { drawRealLimousine } from './realLimousine';
import { drawRealRaceCar } from './realRaceCar';
import { drawRealTractor } from './realTractor';
import { drawRealBulldozer } from './realBulldozer';
import { drawRealForklift } from './realForklift';
import { drawRealRoadRoller } from './realRoadRoller';
import { drawRealTelehandler } from './realTelehandler';
import { drawRealSnowPlough } from './realSnowPlough';
import { drawRealStreetSweeper } from './realStreetSweeper';
import { drawRealMonsterTruck } from './realMonsterTruck';
import { drawRealFoodTruck } from './realFoodTruck';
import { drawRealCombineHarvester } from './realCombineHarvester';

/**
 * THROWAWAY PROTOTYPE ART. Hand-authored side profiles for the fire engine and digger,
 * to test whether realistic structure reads better than the generic slot kit.
 * Not wired into the game.
 */

const O = '#3A271B';
const RED = '#E63946';
const DARK_RED = '#C1121F';
const CREAM = '#FFF9EC';
const CHROME = '#C9D2DE';
const GLASS = '#CFEFFF';
const TIRE = '#2B2D42';
const YELLOW = '#FFD166';
const BLUE = '#2C5AA0';
const ORANGE = '#F4A261';
const DARK_ORANGE = '#D9773A';
const GRAY = '#4A4E5A';
const STEEL = '#8A93A3';

function shape(ctx: CanvasRenderingContext2D, d: string, fill: string, width = 3): void {
	const path = new Path2D(d);
	ctx.fillStyle = fill;
	ctx.fill(path);
	ctx.strokeStyle = O;
	ctx.lineWidth = width;
	ctx.stroke(path);
}

function rect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number,
	fill: string,
	width = 3
): void {
	roundedRect(ctx, x, y, w, h, r);
	ctx.fillStyle = fill;
	ctx.fill();
	ctx.strokeStyle = O;
	ctx.lineWidth = width;
	ctx.stroke();
}

function circle(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	r: number,
	fill: string,
	width = 2.5
): void {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = fill;
	ctx.fill();
	ctx.strokeStyle = O;
	ctx.lineWidth = width;
	ctx.stroke();
}

function line(
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	color = O,
	width = 3
): void {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.stroke();
}

function wheel(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = TIRE;
	ctx.fill();
	ctx.strokeStyle = O;
	ctx.lineWidth = 3;
	ctx.stroke();

	ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
	ctx.lineWidth = 2.2;
	for (let i = 0; i < 12; i++) {
		const a = (i / 12) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(x + Math.cos(a) * r * 0.76, y + Math.sin(a) * r * 0.76);
		ctx.lineTo(x + Math.cos(a) * r * 0.96, y + Math.sin(a) * r * 0.96);
		ctx.stroke();
	}

	circle(ctx, x, y, r * 0.42, CHROME, 2.5);
	circle(ctx, x, y, r * 0.16, STEEL, 2);
}

export function drawRealFireEngine(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number,
	shaded = true
): void {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	if (shaded) {
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = O;
		ctx.beginPath();
		ctx.ellipse(360, 292, 300, 14, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Chassis and rear step.
	rect(ctx, 38, 238, 620, 18, 6, GRAY);
	rect(ctx, 645, 246, 36, 9, 3, CHROME, 2);

	// Main body.
	rect(ctx, 188, 136, 474, 104, 10, RED);

	// Cab, stepped and leaning forward.
	shape(
		ctx,
		'M40,238 L40,180 Q40,160 52,150 L72,102 Q78,92 92,92 L184,92 Q190,92 190,102 L190,238 Z',
		RED
	);

	// White stripe and a gold pinstripe.
	rect(ctx, 188, 150, 474, 8, 0, CREAM, 2);
	line(ctx, 188, 162, 662, 162, '#E7C56A', 2);

	// Compartment roll-up doors.
	for (const doorX of [205, 325, 445]) {
		rect(ctx, doorX, 170, 108, 54, 4, '#F1F3F6', 2);
		for (let slat = 1; slat < 5; slat++) {
			line(ctx, doorX + 4, 170 + slat * 10.5, doorX + 104, 170 + slat * 10.5, 'rgba(58,39,27,0.35)', 1.6);
		}
		rect(ctx, doorX + 44, 188, 16, 4, 2, STEEL, 1.6);
	}

	// Pump panel with gauges and levers.
	rect(ctx, 570, 164, 70, 60, 4, CHROME, 2);
	circle(ctx, 588, 184, 8, '#F1F3F6', 1.8);
	circle(ctx, 620, 184, 8, '#F1F3F6', 1.8);
	line(ctx, 588, 184, 592, 179, O, 1.5);
	line(ctx, 620, 184, 616, 179, O, 1.5);
	for (let i = 0; i < 3; i++) {
		rect(ctx, 580 + i * 14, 202, 8, 12, 2, i === 1 ? RED : STEEL, 1.5);
	}

	// Hose reel, set into the forward compartment.
	circle(ctx, 262, 194, 23, '#6B6B6B', 2);
	ctx.strokeStyle = '#C9D2DE';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(262, 194, 16, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(262, 194, 9, 0, Math.PI * 2);
	ctx.stroke();

	// Ladder on the roof.
	line(ctx, 200, 120, 650, 120, CHROME, 5);
	line(ctx, 200, 134, 650, 134, CHROME, 5);
	for (let rung = 208; rung < 648; rung += 18) {
		line(ctx, rung, 120, rung, 134, CHROME, 2.5);
	}

	// Cab glass.
	rect(ctx, 56, 112, 60, 58, 7, GLASS, 2.5);
	rect(ctx, 124, 112, 58, 52, 6, GLASS, 2.5);
	line(ctx, 120, 112, 120, 228, O, 2.5);
	line(ctx, 146, 170, 162, 170, O, 2.5);
	line(ctx, 124, 166, 182, 166, 'rgba(58,39,27,0.45)', 1.6);

	// Roof light bar and rear beacon.
	rect(ctx, 72, 82, 86, 12, 5, BLUE, 2);
	rect(ctx, 78, 85, 26, 6, 2, '#FF4D6D', 1.2);
	rect(ctx, 112, 85, 26, 6, 2, '#FFD166', 1.2);
	circle(ctx, 636, 128, 6, '#FF4D6D', 2);

	// Front bumper, grille, headlight, mirror.
	rect(ctx, 30, 222, 24, 18, 4, CHROME, 2.5);
	rect(ctx, 36, 190, 20, 28, 3, GRAY, 2);
	for (let bar = 1; bar <= 3; bar++) {
		line(ctx, 40, 190 + bar * 6, 52, 190 + bar * 6, CHROME, 2);
	}
	circle(ctx, 52, 200, 7, YELLOW, 2.5);
	line(ctx, 188, 120, 206, 112, O, 2.5);
	circle(ctx, 209, 110, 4, CHROME, 2);

	// Rear lights, hazard chevrons and plate.
	rect(ctx, 650, 198, 7, 14, 2, '#FF4D6D', 1.8);
	rect(ctx, 650, 232, 20, 8, 2, CREAM, 1.8);
	for (let i = 0; i < 3; i++) {
		line(ctx, 626 + i * 9, 238, 631 + i * 9, 218, YELLOW, 4);
	}

	// Wheels over the body, then fender arches.
	wheel(ctx, 145, 249, 36);
	wheel(ctx, 545, 249, 36);
	ctx.strokeStyle = RED;
	ctx.lineWidth = 5;
	for (const wheelX of [145, 545]) {
		ctx.beginPath();
		ctx.arc(wheelX, 249, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [145, 545]) {
		ctx.beginPath();
		ctx.arc(wheelX, 249, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		// Top highlight and lower shade on the body.
		ctx.save();
		roundedRect(ctx, 188, 136, 474, 104, 10);
		ctx.clip();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
		ctx.fillRect(188, 136, 474, 10);
		ctx.fillStyle = 'rgba(58, 39, 27, 0.14)';
		ctx.fillRect(188, 214, 474, 26);
		ctx.restore();

		// Glass reflection.
		ctx.save();
		roundedRect(ctx, 56, 112, 60, 58, 7);
		ctx.clip();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
		ctx.beginPath();
		ctx.moveTo(48, 170);
		ctx.lineTo(100, 108);
		ctx.lineTo(120, 108);
		ctx.lineTo(60, 178);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

		// Chrome highlight.
		line(ctx, 31, 224, 52, 224, 'rgba(255,255,255,0.65)', 2);
	}

	ctx.restore();
}

export function drawRealDigger(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number,
	shaded = true
): void {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	if (shaded) {
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = O;
		ctx.beginPath();
		ctx.ellipse(300, 334, 230, 16, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Tracks.
	shape(
		ctx,
		'M55,255 Q55,238 82,238 L388,238 Q415,238 415,255 L415,310 Q415,327 388,327 L82,327 Q55,327 55,310 Z',
		TIRE
	);
	for (let xTrack = 70; xTrack < 400; xTrack += 18) {
		rect(ctx, xTrack, 241, 10, 7, 2, '#4A4E5A', 1.2);
		rect(ctx, xTrack + 4, 319, 10, 7, 2, '#4A4E5A', 1.2);
	}
	for (const roadX of [112, 172, 232, 292, 352]) {
		circle(ctx, roadX, 296, 15, STEEL, 2.2);
		circle(ctx, roadX, 296, 5, GRAY, 1.5);
	}
	circle(ctx, 78, 294, 23, '#3A3D4A', 2.5);
	circle(ctx, 78, 294, 11, STEEL, 2);
	circle(ctx, 392, 294, 20, '#3A3D4A', 2.5);
	circle(ctx, 392, 294, 9, STEEL, 2);

	// Slew ring.
	ctx.beginPath();
	ctx.ellipse(235, 240, 160, 11, 0, 0, Math.PI * 2);
	ctx.fillStyle = '#3A3D4A';
	ctx.fill();
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	ctx.stroke();

	// House, counterweight and engine cover.
	rect(ctx, 95, 160, 290, 82, 8, ORANGE);
	rect(ctx, 65, 184, 34, 58, 4, GRAY);
	for (let i = 0; i < 3; i++) {
		line(ctx, 69 + i * 9, 238, 74 + i * 9, 190, YELLOW, 3.5);
	}
	rect(ctx, 228, 168, 157, 66, 6, DARK_ORANGE);
	for (let vent = 0; vent < 3; vent++) {
		line(ctx, 240, 180 + vent * 12, 372, 180 + vent * 12, 'rgba(58,39,27,0.35)', 2);
	}

	// Cab.
	shape(
		ctx,
		'M115,238 L115,132 Q115,112 132,108 L194,100 Q214,98 214,116 L214,238 Z',
		ORANGE
	);
	rect(ctx, 122, 118, 54, 52, 6, GLASS, 2.5);
	rect(ctx, 182, 118, 27, 44, 4, GLASS, 2.5);
	line(ctx, 115, 190, 214, 190, O, 2);
	line(ctx, 170, 176, 186, 176, O, 2);
	circle(ctx, 201, 92, 7, YELLOW, 2.2);

	// Exhaust and handrail.
	rect(ctx, 360, 140, 10, 28, 2, GRAY, 2);
	rect(ctx, 355, 136, 20, 6, 2, STEEL, 1.8);
	line(ctx, 224, 157, 382, 157, STEEL, 2.5);
	line(ctx, 224, 157, 224, 166, STEEL, 2);

	// Boom.
	shape(ctx, 'M284,190 L452,102 Q464,96 472,104 L490,116 L320,214 Z', ORANGE);
	line(ctx, 318, 188, 462, 112, 'rgba(255,255,255,0.3)', 2);
	circle(ctx, 300, 192, 7, GRAY, 2);
	circle(ctx, 468, 108, 6, GRAY, 2);

	// Stick.
	shape(ctx, 'M458,98 L488,98 L574,240 L544,250 Z', ORANGE);
	line(ctx, 478, 108, 556, 236, 'rgba(255,255,255,0.28)', 2);
	circle(ctx, 558, 246, 6, GRAY, 2);

	// Bucket with teeth.
	shape(
		ctx,
		'M535,238 L594,230 Q610,230 612,245 L610,265 Q607,286 588,291 L540,278 Z',
		'#5C6472'
	);
	for (let tooth = 0; tooth < 4; tooth++) {
		const toothX = 548 + tooth * 14;
		shape(ctx, `M${toothX},283 L${toothX + 5},296 L${toothX + 10},283 Z`, GRAY, 1.5);
	}

	// Hydraulics: dark cylinder plus bright rod.
	line(ctx, 300, 210, 440, 124, GRAY, 10);
	line(ctx, 306, 207, 438, 127, CHROME, 4);
	line(ctx, 464, 116, 526, 206, GRAY, 8);
	line(ctx, 468, 118, 522, 204, CHROME, 3.5);
	line(ctx, 518, 230, 556, 247, GRAY, 6);
	line(ctx, 520, 231, 554, 246, CHROME, 2.5);

	if (shaded) {
		ctx.save();
		roundedRect(ctx, 95, 160, 290, 82, 8);
		ctx.clip();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
		ctx.fillRect(95, 160, 290, 9);
		ctx.fillStyle = 'rgba(58, 39, 27, 0.16)';
		ctx.fillRect(95, 220, 290, 22);
		ctx.restore();

		ctx.save();
		roundedRect(ctx, 122, 118, 54, 52, 6);
		ctx.clip();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
		ctx.beginPath();
		ctx.moveTo(116, 168);
		ctx.lineTo(155, 112);
		ctx.lineTo(175, 112);
		ctx.lineTo(126, 174);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealTruck(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number,
	shaded = true
): void {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	if (shaded) {
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = O;
		ctx.beginPath();
		ctx.ellipse(360, 308, 300, 14, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	rect(ctx, 45, 252, 620, 18, 6, GRAY);

	// Cargo box.
	rect(ctx, 200, 95, 440, 175, 6, '#F4F6FA');
	rect(ctx, 200, 208, 440, 24, 0, BLUE, 2);
	line(ctx, 200, 118, 640, 118, 'rgba(58,39,27,0.28)', 2);
	line(ctx, 340, 100, 340, 262, 'rgba(58,39,27,0.22)', 2);
	line(ctx, 470, 100, 470, 262, 'rgba(58,39,27,0.22)', 2);
	circle(ctx, 290, 150, 18, BLUE, 2);
	circle(ctx, 290, 150, 9, CREAM, 1.5);

	// Roll-up rear door.
	rect(ctx, 588, 120, 50, 142, 3, CHROME, 2.5);
	for (let slat = 1; slat < 10; slat++) {
		line(ctx, 592, 120 + slat * 14, 634, 120 + slat * 14, 'rgba(58,39,27,0.4)', 1.5);
	}
	rect(ctx, 606, 190, 14, 5, 2, O, 1.5);

	// Cab.
	shape(
		ctx,
		'M50,270 L50,190 Q50,172 63,162 L85,132 Q92,120 106,120 L190,120 Q200,120 200,130 L200,270 Z',
		BLUE
	);
	rect(ctx, 68, 136, 62, 74, 6, GLASS, 2.5);
	rect(ctx, 140, 136, 48, 64, 6, GLASS, 2.5);
	line(ctx, 132, 136, 132, 258, O, 2.5);
	line(ctx, 156, 196, 176, 196, O, 2.5);
	line(ctx, 140, 190, 188, 190, 'rgba(58,39,27,0.42)', 1.8);

	// Front bumper, grille, lamp, mirror, step.
	rect(ctx, 34, 242, 24, 18, 4, CHROME, 2.5);
	rect(ctx, 40, 198, 22, 38, 3, GRAY, 2);
	for (let bar = 1; bar <= 4; bar++) {
		line(ctx, 44, 198 + bar * 7, 58, 198 + bar * 7, CHROME, 1.8);
	}
	circle(ctx, 58, 214, 7, YELLOW, 2.5);
	line(ctx, 198, 142, 216, 134, O, 2.5);
	circle(ctx, 219, 132, 4, CHROME, 2);
	rect(ctx, 72, 258, 34, 8, 2, CHROME, 1.8);

	// Rear bumper, lamps, plate.
	rect(ctx, 640, 256, 38, 9, 3, CHROME, 2);
	rect(ctx, 646, 222, 6, 13, 2, '#FF4D6D', 1.5);
	rect(ctx, 646, 238, 18, 8, 2, CREAM, 1.5);

	wheel(ctx, 150, 264, 38);
	wheel(ctx, 560, 264, 38);
	ctx.strokeStyle = BLUE;
	ctx.lineWidth = 5;
	for (const wheelX of [150, 560]) {
		ctx.beginPath();
		ctx.arc(wheelX, 264, 44, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [150, 560]) {
		ctx.beginPath();
		ctx.arc(wheelX, 264, 44, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		ctx.save();
		roundedRect(ctx, 200, 95, 440, 175, 6);
		ctx.clip();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
		ctx.fillRect(200, 95, 440, 9);
		ctx.fillStyle = 'rgba(58, 39, 27, 0.1)';
		ctx.fillRect(200, 246, 440, 24);
		ctx.restore();
		ctx.save();
		roundedRect(ctx, 68, 136, 62, 74, 6);
		ctx.clip();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
		ctx.beginPath();
		ctx.moveTo(60, 210);
		ctx.lineTo(110, 132);
		ctx.lineTo(130, 132);
		ctx.lineTo(72, 216);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealBus(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number,
	shaded = true
): void {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	if (shaded) {
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = O;
		ctx.beginPath();
		ctx.ellipse(385, 292, 340, 14, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Body shell.
	shape(
		ctx,
		'M60,250 Q45,250 45,232 L45,130 Q45,105 70,105 L700,105 Q725,105 725,130 L725,232 Q725,250 710,250 Z',
		'#FFC94D'
	);
	rect(ctx, 70, 202, 640, 14, 0, '#F2792B', 0);
	line(ctx, 70, 105, 700, 105, 'rgba(58,39,27,0.3)', 2);

	// Window strip and front windshield.
	rect(ctx, 120, 124, 500, 58, 8, GLASS, 2.5);
	for (let pane = 1; pane < 5; pane++) {
		line(ctx, 120 + pane * 100, 124, 120 + pane * 100, 182, O, 3);
	}
	rect(ctx, 654, 122, 54, 70, 8, GLASS, 2.5);
	line(ctx, 681, 122, 681, 192, O, 2.5);
	rect(ctx, 70, 124, 38, 58, 7, GLASS, 2.5);

	// Door.
	rect(ctx, 610, 124, 38, 120, 4, '#F7B733', 2.5);
	rect(ctx, 614, 130, 30, 42, 3, GLASS, 2);
	rect(ctx, 614, 178, 30, 44, 3, GLASS, 2);
	line(ctx, 629, 130, 629, 222, O, 2);

	// Destination board, mirror, lamps, bumpers.
	rect(ctx, 650, 100, 68, 18, 3, '#3A271B', 2);
	rect(ctx, 656, 104, 56, 10, 2, '#FFD166', 1);
	line(ctx, 720, 130, 738, 122, O, 2.5);
	circle(ctx, 741, 120, 4, CHROME, 2);
	rect(ctx, 716, 212, 10, 16, 3, YELLOW, 2);
	rect(ctx, 38, 214, 8, 18, 2, '#FF4D6D', 1.8);
	rect(ctx, 34, 238, 26, 12, 3, CHROME, 2);
	rect(ctx, 710, 238, 30, 12, 3, CHROME, 2);
	for (let vent = 0; vent < 3; vent++) {
		rect(ctx, 230 + vent * 70, 96, 38, 7, 2, '#D9A441', 1.5);
	}

	wheel(ctx, 165, 246, 36);
	wheel(ctx, 590, 246, 36);
	ctx.strokeStyle = '#FFC94D';
	ctx.lineWidth = 5;
	for (const wheelX of [165, 590]) {
		ctx.beginPath();
		ctx.arc(wheelX, 246, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [165, 590]) {
		ctx.beginPath();
		ctx.arc(wheelX, 246, 42, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		ctx.save();
		roundedRect(ctx, 45, 105, 680, 145, 22);
		ctx.clip();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
		ctx.fillRect(45, 105, 680, 10);
		ctx.fillStyle = 'rgba(58, 39, 27, 0.12)';
		ctx.fillRect(45, 218, 680, 32);
		ctx.restore();
		ctx.save();
		roundedRect(ctx, 120, 124, 500, 58, 8);
		ctx.clip();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.34)';
		ctx.fillRect(120, 124, 500, 16);
		ctx.restore();
	}

	ctx.restore();
}

export function drawRealCar(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number,
	shaded = true
): void {
	ctx.save();
	ctx.translate(x, y);
	ctx.scale(scale, scale);
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	if (shaded) {
		ctx.save();
		ctx.globalAlpha = 0.16;
		ctx.fillStyle = O;
		ctx.beginPath();
		ctx.ellipse(260, 242, 230, 12, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}

	// Lower body: shorter and taller than a limousine.
	shape(
		ctx,
		'M35,235 L35,196 Q35,180 50,176 L100,170 L140,160 L380,160 L430,168 L470,174 Q485,178 485,194 L485,235 Z',
		'#4EA8DE'
	);
	// Greenhouse.
	shape(
		ctx,
		'M140,162 L170,124 Q180,112 198,112 L330,112 Q348,112 360,126 L392,162 Z',
		'#4EA8DE'
	);
	rect(ctx, 158, 126, 54, 28, 6, GLASS, 2.5);
	rect(ctx, 220, 126, 58, 28, 6, GLASS, 2.5);
	rect(ctx, 286, 126, 50, 28, 6, GLASS, 2.5);
	rect(ctx, 344, 126, 32, 28, 6, GLASS, 2.5);
	line(ctx, 218, 120, 218, 158, O, 2.5);
	line(ctx, 284, 120, 284, 158, O, 2.5);
	line(ctx, 342, 120, 342, 158, O, 2.5);
	line(ctx, 150, 156, 386, 156, O, 2.5);

	// Door panel.
	rect(ctx, 222, 166, 113, 56, 4, '#4EA8DE', 2.5);
	line(ctx, 236, 192, 256, 192, O, 2.5);
	rect(ctx, 312, 184, 9, 8, 2, CHROME, 1.5);

	// Front and rear, lamps, grille, bumpers.
	rect(ctx, 28, 202, 20, 22, 4, CHROME, 2.5);
	rect(ctx, 36, 180, 20, 22, 3, GRAY, 2);
	for (let bar = 1; bar <= 3; bar++) {
		line(ctx, 40, 180 + bar * 5, 52, 180 + bar * 5, CHROME, 1.6);
	}
	circle(ctx, 54, 190, 6, YELLOW, 2.2);
	rect(ctx, 476, 184, 10, 18, 3, '#FF4D6D', 2);
	rect(ctx, 478, 210, 14, 7, 2, CREAM, 1.5);
	line(ctx, 152, 132, 168, 124, O, 2.2);
	circle(ctx, 171, 122, 3.5, CHROME, 1.8);
	line(ctx, 378, 132, 394, 124, O, 2.2);
	circle(ctx, 397, 122, 3.5, CHROME, 1.8);

	wheel(ctx, 120, 208, 34);
	wheel(ctx, 390, 208, 34);
	ctx.strokeStyle = '#4EA8DE';
	ctx.lineWidth = 5;
	for (const wheelX of [120, 390]) {
		ctx.beginPath();
		ctx.arc(wheelX, 208, 40, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}
	ctx.strokeStyle = O;
	ctx.lineWidth = 2;
	for (const wheelX of [120, 390]) {
		ctx.beginPath();
		ctx.arc(wheelX, 208, 40, Math.PI * 1.08, Math.PI * 1.92);
		ctx.stroke();
	}

	if (shaded) {
		ctx.save();
		roundedRect(ctx, 35, 160, 450, 75, 12);
		ctx.clip();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
		ctx.fillRect(35, 160, 450, 8);
		ctx.fillStyle = 'rgba(58, 39, 27, 0.12)';
		ctx.fillRect(35, 222, 450, 13);
		ctx.restore();
		ctx.save();
		roundedRect(ctx, 158, 126, 218, 28, 6);
		ctx.clip();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
		ctx.fillRect(158, 126, 218, 9);
		ctx.restore();
	}

	ctx.restore();
}

export interface RealArtSpec {
	draw: (
		ctx: CanvasRenderingContext2D,
		x: number,
		y: number,
		scale: number,
		shaded?: boolean
	) => void;
	width: number;
	height: number;
}

export const REAL_ART: Record<string, RealArtSpec> = {
	'fire-engine': { draw: drawRealFireEngine, width: 700, height: 320 },
	digger: { draw: drawRealDigger, width: 700, height: 360 },
	'box-truck': { draw: drawRealTruck, width: 700, height: 340 },
	bus: { draw: drawRealBus, width: 760, height: 320 },
	car: { draw: drawRealCar, width: 600, height: 260 },
	'school-bus': { draw: drawRealSchoolBus, width: 760, height: 320 },
	'mini-bus': { draw: drawRealMiniBus, width: 640, height: 300 },
	'double-decker': { draw: drawRealDoubleDecker, width: 760, height: 400 },
	'bendy-bus': { draw: drawRealBendyBus, width: 900, height: 340 },
	'coach-bus': { draw: drawRealCoachBus, width: 860, height: 360 },
	'airport-shuttle': { draw: drawRealAirportShuttle, width: 760, height: 320 },
	'mobile-library': { draw: drawRealMobileLibrary, width: 780, height: 340 },
	'mobile-clinic': { draw: drawRealMobileClinic, width: 780, height: 340 },
	trolleybus: { draw: drawRealTrolleybus, width: 820, height: 400 },
	'tram': { draw: drawRealTram, width: 820, height: 380 },
	'metro-train': { draw: drawRealMetroTrain, width: 900, height: 380 },
	'light-rail-train': { draw: drawRealLightRailTrain, width: 900, height: 380 },
	'milk-tanker': { draw: drawRealMilkTanker, width: 760, height: 340 },
	'dump-truck': { draw: drawRealDumpTruck, width: 760, height: 370 },
	'flatbed-lorry': { draw: drawRealFlatbedLorry, width: 780, height: 340 },
	'crane-truck': { draw: drawRealCraneTruck, width: 820, height: 300 },
	'cement-mixer': { draw: drawRealCementMixer, width: 740, height: 380 },
	'tow-truck': { draw: drawRealTowTruck, width: 780, height: 390 },
	'garbage-truck': { draw: drawRealGarbageTruck, width: 760, height: 330 },
	'car-transporter': { draw: drawRealCarTransporter, width: 860, height: 340 },
	'refrigerated-truck': { draw: drawRealRefrigeratedTruck, width: 780, height: 340 },
	'curtain-side-lorry': { draw: drawRealCurtainSideLorry, width: 800, height: 360 },
	'parcel-lorry': { draw: drawRealParcelLorry, width: 780, height: 360 },
	'log-truck': { draw: drawRealLogTruck, width: 800, height: 380 },
	'livestock-truck': { draw: drawRealLivestockTruck, width: 800, height: 300 },
	'water-tanker': { draw: drawRealWaterTanker, width: 780, height: 340 },
	'fuel-tanker': { draw: drawRealFuelTanker, width: 900, height: 360 },
	'ice-cream-van': { draw: drawRealIceCreamVan, width: 700, height: 330 },
	'mail-van': { draw: drawRealMailVan, width: 700, height: 330 },
	'camper': { draw: drawRealCamper, width: 720, height: 340 },
	'delivery-van': { draw: drawRealDeliveryVan, width: 720, height: 330 },
	'armoured-van': { draw: drawRealArmouredVan, width: 720, height: 340 },
	'ambulance': { draw: drawRealAmbulance, width: 720, height: 340 },
	'removals-van': { draw: drawRealRemovalsVan, width: 780, height: 360 },
	'police-van': { draw: drawRealPoliceVan, width: 720, height: 340 },
	'pickup': { draw: drawRealPickup, width: 700, height: 330 },
	'police-car': { draw: drawRealPoliceCar, width: 660, height: 300 },
	'taxi': { draw: drawRealTaxi, width: 660, height: 300 },
	'limousine': { draw: drawRealLimousine, width: 820, height: 300 },
	'race-car': { draw: drawRealRaceCar, width: 680, height: 280 },
	'tractor': { draw: drawRealTractor, width: 640, height: 330 },
	'bulldozer': { draw: drawRealBulldozer, width: 720, height: 340 },
	'forklift': { draw: drawRealForklift, width: 640, height: 340 },
	'road-roller': { draw: drawRealRoadRoller, width: 680, height: 340 },
	'telehandler': { draw: drawRealTelehandler, width: 760, height: 310 },
	'snow-plough': { draw: drawRealSnowPlough, width: 780, height: 350 },
	'street-sweeper': { draw: drawRealStreetSweeper, width: 760, height: 350 },
	'monster-truck': { draw: drawRealMonsterTruck, width: 720, height: 320 },
	'food-truck': { draw: drawRealFoodTruck, width: 720, height: 350 },
	'combine-harvester': { draw: drawRealCombineHarvester, width: 900, height: 315 }
};

const fullCache = new Map<string, HTMLCanvasElement>();
const tileCache = new Map<string, HTMLCanvasElement>();

export function realVehicleCanvas(vehicleId: string): HTMLCanvasElement | null {
	if (typeof document === 'undefined') return null;
	const cached = fullCache.get(vehicleId);
	if (cached) return cached;
	const spec = REAL_ART[vehicleId];
	if (!spec) return null;

	const canvas = document.createElement('canvas');
	canvas.width = spec.width * 2;
	canvas.height = spec.height * 2;
	const ctx = canvas.getContext('2d');
	if (!ctx) return null;
	ctx.scale(2, 2);
	spec.draw(ctx, 0, 0, 1, true);
	fullCache.set(vehicleId, canvas);
	return canvas;
}

export function realPartCanvas(part: {
	id: string;
	realVehicle?: string;
	maskPath?: string;
	maskBounds?: { x: number; y: number; w: number; h: number };
}): HTMLCanvasElement | null {
	if (!part.realVehicle || !part.maskPath || !part.maskBounds) return null;
	if (typeof document === 'undefined') return null;
	const key = `${part.realVehicle}:${part.id}`;
	const cached = tileCache.get(key);
	if (cached) return cached;

	const full = realVehicleCanvas(part.realVehicle);
	const spec = REAL_ART[part.realVehicle];
	if (!full || !spec) return null;

	const bounds = part.maskBounds;
	const tile = document.createElement('canvas');
	tile.width = Math.max(1, Math.round(bounds.w * 2));
	tile.height = Math.max(1, Math.round(bounds.h * 2));
	const ctx = tile.getContext('2d');
	if (!ctx) return null;
	ctx.scale(2, 2);
	ctx.translate(-bounds.x, -bounds.y);
	ctx.clip(new Path2D(part.maskPath), 'evenodd');
	ctx.drawImage(full, 0, 0, spec.width, spec.height);
	tileCache.set(key, tile);
	return tile;
}
