/**
 * Part art. Every path is authored in vehicle units with its origin at the anchor point
 * that lands on the slot, and drawn centred on 0,0 so `radius` is the snap distance and
 * `halfWidth`/`halfHeight` are the footprint the shelf packs.
 */

export type PartId =
	| 'body'
	| 'bodyBox'
	| 'cabin'
	| 'cab'
	| 'wheel'
	| 'tracks'
	| 'door'
	| 'windowStrip'
	| 'roof'
	| 'roofSign'
	| 'light'
	| 'lightBar'
	| 'bumper'
	| 'ladder'
	| 'hoseReel'
	| 'arm'
	| 'bucket'
	| 'exhaust'
	| 'beacon'
	| 'tank'
	| 'mixer'
	| 'boom'
	| 'hook'
	| 'forks'
	| 'plough'
	| 'roller'
	| 'brush'
	| 'flatbed'
	| 'logs'
	| 'pantograph'
	| 'spoiler'
	| 'tipper'
	| 'miniCar'
	| 'header'
	| 'bale'
	| 'skip'
	| 'scissor'
	| 'realCarBody'
	| 'realCarCabin'
	| 'realCarDoor'
	| 'realCarWheel'
	| 'realFireBody'
	| 'realFireLadder'
	| 'realFirePump'
	| 'realFireWheel'
	| 'realDiggerHouse'
	| 'realDiggerTracks'
	| 'realDiggerBoom'
	| 'realDiggerBucket'
	| 'realDiggerBeacon'
	| 'realTruckCab'
	| 'realTruckBox'
	| 'realTruckDoor'
	| 'realTruckWheel'
	| 'realBusBody'
	| 'realBusWindows'
	| 'realBusDoor'
	| 'realBusWheel'
	| 'realSchoolBusBody'
	| 'realSchoolBusWindows'
	| 'realSchoolBusDoor'
	| 'realSchoolBusWheel'
	| 'realMiniBusBody'
	| 'realMiniBusWindows'
	| 'realMiniBusDoor'
	| 'realMiniBusWheel'
	| 'realDoubleDeckerBody'
	| 'realDoubleDeckerWindows'
	| 'realDoubleDeckerDoor'
	| 'realDoubleDeckerWheel'
	| 'realBendyBusBody'
	| 'realBendyBusWindows'
	| 'realBendyBusDoor'
	| 'realBendyBusWheel'
	| 'realCoachBusBody'
	| 'realCoachBusWindows'
	| 'realCoachBusDoor'
	| 'realCoachBusWheel'
	| 'realAirportShuttleBody'
	| 'realAirportShuttleWindows'
	| 'realAirportShuttleDoor'
	| 'realAirportShuttleWheel'
	| 'realMobileLibraryBody'
	| 'realMobileLibraryWindows'
	| 'realMobileLibraryDoor'
	| 'realMobileLibraryWheel';

export type Role = 'shell' | 'glass' | 'rubber' | 'trim' | 'lamp';

export type PartKind = 'body' | 'face' | 'connector' | 'cargo' | 'locomotion' | 'detail';

export interface PartShape {
	id: PartId;
	path: string;
	role: Role;
	radius: number;
	halfWidth: number;
	halfHeight: number;
	spins?: boolean;
	/** Optional glazing drawn inside the shape, in the same local units. */
	glassPath?: string;
	kind?: PartKind;
	/** Cut-out art: the vehicle id whose full illustration supplies this piece. */
	realVehicle?: string;
	/** Mask in the vehicle's local art coordinates, clipped with even-odd. */
	maskPath?: string;
	maskBounds?: { x: number; y: number; w: number; h: number };
}

function realPart(
	id: PartId,
	role: Role,
	kind: PartKind,
	realVehicle: string,
	maskPath: string,
	b: { x: number; y: number; w: number; h: number }
): PartShape {
	const r = Math.min(14, b.w / 4, b.h / 4);
	return {
		id,
		path: rounded(b.w, b.h, r),
		role,
		radius: Math.hypot(b.w, b.h) / 2,
		halfWidth: b.w / 2,
		halfHeight: b.h / 2,
		kind,
		realVehicle,
		maskPath,
		maskBounds: b
	};
}

const circle = (r: number): string =>
	`M0,${-r} A${r},${r} 0 1 1 0,${r} A${r},${r} 0 1 1 0,${-r} Z`;

const rounded = (w: number, h: number, r: number): string => {
	const x = w / 2;
	const y = h / 2;
	return `M${-x + r},${-y} L${x - r},${-y} Q${x},${-y} ${x},${-y + r} L${x},${y - r} Q${x},${y} ${x - r},${y} L${-x + r},${y} Q${-x},${y} ${-x},${y - r} L${-x},${-y + r} Q${-x},${-y} ${-x + r},${-y} Z`;
};

export const PARTS: Record<PartId, PartShape> = {
	body: {
		id: 'body',
		// A long slab with a wedge nose and a flat tail.
		path: 'M-220,-20 Q-220,-55 -185,-55 L150,-55 L220,-8 Q220,55 175,55 L-180,55 Q-220,55 -220,20 Z',
		role: 'shell',
		radius: 120,
		halfWidth: 220,
		halfHeight: 55
	},
	bodyBox: {
		id: 'bodyBox',
		path: rounded(460, 120, 24),
		role: 'shell',
		radius: 130,
		halfWidth: 230,
		halfHeight: 60
	},
	cabin: {
		id: 'cabin',
		path: 'M-85,39 L-58,-20 Q-50,-39 -28,-39 L44,-39 Q62,-39 70,-22 L85,39 Z',
		glassPath: 'M-66,31 L-46,-18 Q-41,-30 -27,-30 L40,-30 Q54,-30 60,-19 L70,31 Z',
		role: 'shell',
		radius: 60,
		halfWidth: 85,
		halfHeight: 39
	},
	cab: {
		id: 'cab',
		path: 'M-70,42 L-70,-30 Q-70,-42 -56,-42 L30,-42 Q40,-42 46,-32 L70,4 L70,42 Z',
		glassPath: 'M-54,33 L-54,-20 Q-54,-30 -44,-30 L24,-30 Q31,-30 36,-22 L54,-1 L54,33 Z',
		role: 'shell',
		radius: 60,
		halfWidth: 70,
		halfHeight: 42
	},
	wheel: {
		id: 'wheel',
		// Outer tyre with a hub hole: even-odd fill leaves the hub open.
		path: `${circle(34)} ${circle(12)}`,
		role: 'rubber',
		radius: 34,
		halfWidth: 34,
		halfHeight: 34,
		spins: true
	},
	tracks: {
		id: 'tracks',
		path: `${rounded(210, 46, 23)} ${circle(16)}`,
		role: 'rubber',
		radius: 70,
		halfWidth: 105,
		halfHeight: 23
	},
	door: {
		id: 'door',
		path: `${rounded(56, 64, 9)} M-16,2 L10,2`,
		role: 'trim',
		radius: 32,
		halfWidth: 28,
		halfHeight: 32
	},
	windowStrip: {
		id: 'windowStrip',
		path: rounded(150, 34, 10),
		role: 'glass',
		radius: 60,
		halfWidth: 75,
		halfHeight: 17
	},
	roof: {
		id: 'roof',
		path: 'M-90,10 Q-90,-14 -62,-14 L62,-14 Q90,-14 90,10 L90,16 L-90,16 Z',
		role: 'shell',
		radius: 60,
		halfWidth: 90,
		halfHeight: 16
	},
	roofSign: {
		id: 'roofSign',
		path: `${rounded(78, 26, 6)} M-24,0 L24,0`,
		role: 'lamp',
		radius: 30,
		halfWidth: 39,
		halfHeight: 13
	},
	light: {
		id: 'light',
		path: circle(13),
		role: 'lamp',
		radius: 13,
		halfWidth: 13,
		halfHeight: 13
	},
	lightBar: {
		id: 'lightBar',
		path: rounded(96, 22, 11),
		role: 'lamp',
		radius: 40,
		halfWidth: 48,
		halfHeight: 11
	},
	bumper: {
		id: 'bumper',
		path: rounded(150, 26, 13),
		role: 'trim',
		radius: 50,
		halfWidth: 75,
		halfHeight: 13
	},
	ladder: {
		id: 'ladder',
		path: 'M-52,-12 L-52,12 M52,-12 L52,12 M-52,-4 L52,-4 M-52,4 L52,4 M-36,-12 L-36,12 M-18,-12 L-18,12 M0,-12 L0,12 M18,-12 L18,12 M36,-12 L36,12',
		role: 'trim',
		radius: 50,
		halfWidth: 52,
		halfHeight: 14
	},
	hoseReel: {
		id: 'hoseReel',
		path: `${circle(30)} ${circle(11)}`,
		role: 'trim',
		radius: 30,
		halfWidth: 30,
		halfHeight: 30
	},
	arm: {
		id: 'arm',
		path: 'M-84,16 L-44,-14 L14,-14 L46,6 L46,22 L14,22 L-44,22 Z',
		role: 'trim',
		radius: 60,
		halfWidth: 84,
		halfHeight: 22
	},
	bucket: {
		id: 'bucket',
		path: 'M-38,-18 L38,-18 L28,26 L-24,26 Z',
		role: 'trim',
		radius: 40,
		halfWidth: 38,
		halfHeight: 26
	},
	exhaust: {
		id: 'exhaust',
		path: `${rounded(16, 54, 8)} M-8,-27 L-8,-38`,
		role: 'trim',
		radius: 30,
		halfWidth: 8,
		halfHeight: 27
	},
	tank: {
		id: 'tank',
		path: `${rounded(300, 84, 42)} M-120,0 L120,0`,
		role: 'shell',
		radius: 120,
		halfWidth: 150,
		halfHeight: 42
	},
	mixer: {
		id: 'mixer',
		path: 'M-62,-36 Q0,-78 62,-34 L44,58 Q0,76 -44,58 Z',
		role: 'trim',
		radius: 68,
		halfWidth: 62,
		halfHeight: 58
	},
	boom: {
		id: 'boom',
		path: 'M-140,14 L120,-16 L140,-4 L-120,30 Z',
		role: 'trim',
		radius: 110,
		halfWidth: 140,
		halfHeight: 30
	},
	hook: {
		id: 'hook',
		path: 'M-8,-34 L10,-34 L10,-4 Q10,24 0,24 Q-10,24 -10,2',
		role: 'trim',
		radius: 24,
		halfWidth: 12,
		halfHeight: 34
	},
	forks: {
		id: 'forks',
		path: 'M-46,-10 L66,-10 L66,4 L-24,4 L-24,36 L-46,36 Z',
		role: 'trim',
		radius: 50,
		halfWidth: 66,
		halfHeight: 36
	},
	plough: {
		id: 'plough',
		path: 'M-74,-26 L74,8 L74,32 L-74,2 Z',
		role: 'shell',
		radius: 60,
		halfWidth: 74,
		halfHeight: 32
	},
	roller: {
		id: 'roller',
		path: `${rounded(110, 66, 33)} ${circle(20)}`,
		role: 'trim',
		radius: 55,
		halfWidth: 55,
		halfHeight: 33
	},
	brush: {
		id: 'brush',
		path: 'M-48,-14 L48,-14 L48,4 L-48,4 Z M-40,4 L-40,26 M-24,4 L-24,26 M-8,4 L-8,26 M8,4 L8,26 M24,4 L24,26 M40,4 L40,26',
		role: 'trim',
		radius: 50,
		halfWidth: 48,
		halfHeight: 26
	},
	flatbed: {
		id: 'flatbed',
		path: `${rounded(330, 28, 8)} M-150,14 L-150,26 M150,14 L150,26`,
		role: 'trim',
		radius: 120,
		halfWidth: 165,
		halfHeight: 14
	},
	logs: {
		id: 'logs',
		path: `${circle(26)} M0,0` + ` ${circle(26)} M-30,-8` + ` ${circle(26)} M30,-8`,
		role: 'trim',
		radius: 55,
		halfWidth: 56,
		halfHeight: 26
	},
	pantograph: {
		id: 'pantograph',
		path: 'M-26,12 L0,-24 L26,12 L0,-2 Z M-32,12 L32,12',
		role: 'rubber',
		radius: 26,
		halfWidth: 30,
		halfHeight: 20
	},
	spoiler: {
		id: 'spoiler',
		path: 'M-54,4 L54,4 L54,18 L-54,10 Z M-34,18 L-34,30 M34,18 L34,30',
		role: 'trim',
		radius: 40,
		halfWidth: 54,
		halfHeight: 18
	},
	tipper: {
		id: 'tipper',
		path: 'M-104,22 L-86,-28 L86,-28 L104,22 Z',
		role: 'shell',
		radius: 80,
		halfWidth: 104,
		halfHeight: 28
	},
	miniCar: {
		id: 'miniCar',
		path: 'M-46,10 L-46,-6 Q-46,-14 -36,-14 L-18,-14 L-6,-30 Q-2,-34 6,-34 L22,-34 Q30,-34 34,-28 L44,-14 L46,-14 L46,10 Z',
		role: 'shell',
		radius: 34,
		halfWidth: 46,
		halfHeight: 34
	},
	header: {
		id: 'header',
		path: `${rounded(300, 52, 16)} M-120,-26 L-120,26 M-80,-26 L-80,26 M-40,-26 L-40,26 M0,-26 L0,26 M40,-26 L40,26 M80,-26 L80,26 M120,-26 L120,26`,
		role: 'trim',
		radius: 140,
		halfWidth: 150,
		halfHeight: 26
	},
	bale: {
		id: 'bale',
		path: `${circle(40)} M-16,-6 A18,18 0 1 1 4,-14`,
		role: 'trim',
		radius: 40,
		halfWidth: 40,
		halfHeight: 40
	},
	skip: {
		id: 'skip',
		path: 'M-84,-32 L84,-32 L70,32 L-70,32 Z M-84,-32 L-100,-18 L100,-18 L84,-32',
		role: 'trim',
		radius: 80,
		halfWidth: 100,
		halfHeight: 32
	},
	scissor: {
		id: 'scissor',
		path: 'M-52,22 L52,-22 M52,22 L-52,-22 M-34,22 L-34,-22 M34,22 L34,-22',
		role: 'trim',
		radius: 50,
		halfWidth: 52,
		halfHeight: 22
	},
	beacon: {
		id: 'beacon',
		path: 'M-14,10 Q-14,-16 0,-16 Q14,-16 14,10 Z',
		role: 'lamp',
		radius: 18,
		halfWidth: 14,
		halfHeight: 16
	},
	realCarBody: realPart(
		'realCarBody',
		'shell',
		'body',
		'car',
		'M35,235 L35,196 Q35,180 50,176 L100,170 L140,160 L380,160 L430,168 L470,174 Q485,178 485,194 L485,235 Z M86,208 A34,34 0 1 1 154,208 A34,34 0 1 1 86,208 Z M356,208 A34,34 0 1 1 424,208 A34,34 0 1 1 356,208 Z',
		{ x: 35, y: 160, w: 450, h: 75 }
	),
	realCarCabin: realPart(
		'realCarCabin',
		'shell',
		'face',
		'car',
		'M140,162 L170,124 Q180,112 198,112 L330,112 Q348,112 360,126 L392,162 Z',
		{ x: 140, y: 112, w: 252, h: 50 }
	),
	realCarDoor: realPart(
		'realCarDoor',
		'trim',
		'detail',
		'car',
		'M222,166 L335,166 L335,222 L222,222 Z',
		{ x: 220, y: 164, w: 117, h: 60 }
	),
	realCarWheel: realPart(
		'realCarWheel',
		'rubber',
		'locomotion',
		'car',
		'M86,208 A34,34 0 1 1 154,208 A34,34 0 1 1 86,208 Z',
		{ x: 86, y: 174, w: 68, h: 68 }
	),
	realFireBody: realPart(
		'realFireBody',
		'shell',
		'body',
		'fire-engine',
		'M40,240 L40,180 Q40,160 52,150 L72,102 Q78,92 92,92 L184,92 Q190,92 190,102 L190,136 L662,136 L662,240 L681,240 L681,256 L38,256 L38,240 Z M109,249 A36,36 0 1 1 181,249 A36,36 0 1 1 109,249 Z M509,249 A36,36 0 1 1 581,249 A36,36 0 1 1 509,249 Z',
		{ x: 38, y: 92, w: 643, h: 164 }
	),
	realFireLadder: realPart(
		'realFireLadder',
		'trim',
		'connector',
		'fire-engine',
		'M198,110 L655,110 L655,140 L198,140 Z',
		{ x: 198, y: 110, w: 457, h: 30 }
	),
	realFirePump: realPart(
		'realFirePump',
		'trim',
		'cargo',
		'fire-engine',
		'M566,160 L644,160 L644,228 L566,228 Z',
		{ x: 566, y: 160, w: 78, h: 68 }
	),
	realFireWheel: realPart(
		'realFireWheel',
		'rubber',
		'locomotion',
		'fire-engine',
		'M109,249 A36,36 0 1 1 181,249 A36,36 0 1 1 109,249 Z',
		{ x: 109, y: 213, w: 72, h: 72 }
	),
	realDiggerHouse: realPart(
		'realDiggerHouse',
		'shell',
		'body',
		'digger',
		'M65,242 L65,160 L115,160 L115,132 Q115,112 132,108 L194,100 Q214,98 214,116 L214,238 L385,238 L385,242 Z',
		{ x: 65, y: 100, w: 320, h: 142 }
	),
	realDiggerTracks: realPart(
		'realDiggerTracks',
		'rubber',
		'locomotion',
		'digger',
		'M55,255 Q55,238 82,238 L388,238 Q415,238 415,255 L415,310 Q415,327 388,327 L82,327 Q55,327 55,310 Z',
		{ x: 50, y: 234, w: 372, h: 98 }
	),
	realDiggerBoom: realPart(
		'realDiggerBoom',
		'trim',
		'connector',
		'digger',
		'M280,184 L452,90 L500,108 L586,252 L532,264 L286,218 Z',
		{ x: 276, y: 88, w: 316, h: 182 }
	),
	realDiggerBucket: realPart(
		'realDiggerBucket',
		'trim',
		'cargo',
		'digger',
		'M535,238 L594,230 Q610,230 612,245 L610,265 Q607,286 588,291 L540,278 Z',
		{ x: 531, y: 226, w: 86, h: 70 }
	),
	realDiggerBeacon: realPart(
		'realDiggerBeacon',
		'lamp',
		'detail',
		'digger',
		'M201,84 A8,8 0 1 1 201,100 A8,8 0 1 1 201,84 Z',
		{ x: 193, y: 84, w: 16, h: 16 }
	),
	realTruckCab: realPart(
		'realTruckCab',
		'shell',
		'face',
		'box-truck',
		'M50,270 L50,190 Q50,172 63,162 L85,132 Q92,120 106,120 L190,120 Q200,120 200,130 L200,270 Z M45,252 L200,252 L200,270 L45,270 Z M150,226 A38,38 0 1 1 150,302 A38,38 0 1 1 150,226 Z',
		{ x: 32, y: 120, w: 172, h: 150 }
	),
	realTruckBox: realPart(
		'realTruckBox',
		'shell',
		'body',
		'box-truck',
		'M200,95 L640,95 L640,256 L678,256 L678,270 L200,270 Z M522,264 A38,38 0 1 1 598,264 A38,38 0 1 1 522,264 Z',
		{ x: 200, y: 95, w: 478, h: 175 }
	),
	realTruckDoor: realPart(
		'realTruckDoor',
		'trim',
		'detail',
		'box-truck',
		'M588,120 L638,120 L638,262 L588,262 Z',
		{ x: 586, y: 118, w: 54, h: 146 }
	),
	realTruckWheel: realPart(
		'realTruckWheel',
		'rubber',
		'locomotion',
		'box-truck',
		'M112,264 A38,38 0 1 1 188,264 A38,38 0 1 1 112,264 Z',
		{ x: 112, y: 226, w: 76, h: 76 }
	),
	realBusBody: realPart(
		'realBusBody',
		'shell',
		'body',
		'bus',
		'M60,250 Q45,250 45,232 L45,130 Q45,105 70,105 L700,105 Q725,105 725,130 L725,232 Q725,250 710,250 Z M120,124 L620,124 L620,182 L120,182 Z M129,246 A36,36 0 1 1 201,246 A36,36 0 1 1 129,246 Z M554,246 A36,36 0 1 1 626,246 A36,36 0 1 1 554,246 Z',
		{ x: 45, y: 105, w: 680, h: 145 }
	),
	realBusWindows: realPart(
		'realBusWindows',
		'glass',
		'face',
		'bus',
		'M120,124 L620,124 L620,182 L120,182 Z',
		{ x: 118, y: 122, w: 504, h: 62 }
	),
	realBusDoor: realPart(
		'realBusDoor',
		'trim',
		'detail',
		'bus',
		'M610,124 L648,124 L648,244 L610,244 Z',
		{ x: 608, y: 122, w: 42, h: 124 }
	),
	realBusWheel: realPart(
		'realBusWheel',
		'rubber',
		'locomotion',
		'bus',
		'M129,246 A36,36 0 1 1 201,246 A36,36 0 1 1 129,246 Z',
		{ x: 129, y: 210, w: 72, h: 72 }
	),
	realSchoolBusBody: realPart(
		'realSchoolBusBody',
		'shell',
		'body',
		'school-bus',
		'M60,250 Q45,250 45,232 L45,130 Q45,105 70,105 L700,105 Q725,105 725,130 L725,232 Q725,250 710,250 Z M120,124 L610,124 L610,182 L120,182 Z M129,246 A36,36 0 1 1 201,246 A36,36 0 1 1 129,246 Z M554,246 A36,36 0 1 1 626,246 A36,36 0 1 1 554,246 Z M725,238 L740,238 L740,250 L725,250 Z M725,116 L746,116 L746,126 L725,126 Z M34,214 L45,214 L45,232 L34,232 Z',
		{ x: 34, y: 105, w: 712, h: 145 }
	),
	realSchoolBusWindows: realPart(
		'realSchoolBusWindows',
		'glass',
		'face',
		'school-bus',
		'M120,124 L610,124 L610,182 L120,182 Z',
		{ x: 118, y: 122, w: 494, h: 62 }
	),
	realSchoolBusDoor: realPart(
		'realSchoolBusDoor',
		'trim',
		'detail',
		'school-bus',
		'M610,124 L648,124 L648,244 L610,244 Z',
		{ x: 608, y: 122, w: 42, h: 124 }
	),
	realSchoolBusWheel: realPart(
		'realSchoolBusWheel',
		'rubber',
		'locomotion',
		'school-bus',
		'M129,246 A36,36 0 1 1 201,246 A36,36 0 1 1 129,246 Z',
		{ x: 129, y: 210, w: 72, h: 72 }
	),
	realMiniBusBody: realPart(
		'realMiniBusBody',
		'shell',
		'body',
		'mini-bus',
		'M55,235 Q40,235 40,218 L40,125 Q40,100 65,100 L575,100 Q600,100 600,125 L600,218 Q600,235 585,235 Z M100,118 L490,118 L490,172 L100,172 Z M106,228 A34,34 0 1 1 174,228 A34,34 0 1 1 106,228 Z M466,228 A34,34 0 1 1 534,228 A34,34 0 1 1 466,228 Z M600,112 L623,112 L623,124 L600,124 Z M600,218 L620,218 L620,232 L600,232 Z M30,208 L40,208 L40,226 L30,226 Z',
		{ x: 30, y: 100, w: 593, h: 135 }
	),
	realMiniBusWindows: realPart(
		'realMiniBusWindows',
		'glass',
		'face',
		'mini-bus',
		'M100,118 L490,118 L490,172 L100,172 Z',
		{ x: 98, y: 116, w: 394, h: 58 }
	),
	realMiniBusDoor: realPart(
		'realMiniBusDoor',
		'trim',
		'detail',
		'mini-bus',
		'M500,118 L535,118 L535,226 L500,226 Z',
		{ x: 498, y: 116, w: 39, h: 112 }
	),
	realMiniBusWheel: realPart(
		'realMiniBusWheel',
		'rubber',
		'locomotion',
		'mini-bus',
		'M106,228 A34,34 0 1 1 174,228 A34,34 0 1 1 106,228 Z',
		{ x: 106, y: 194, w: 68, h: 68 }
	),
	realDoubleDeckerBody: realPart(
		'realDoubleDeckerBody',
		'shell',
		'body',
		'double-decker',
		'M55,330 Q40,330 40,312 L40,100 Q40,70 70,70 L690,70 Q720,70 720,100 L720,312 Q720,330 705,330 Z M100,95 L640,95 L640,150 L100,150 Z M100,196 L590,196 L590,252 L100,252 Z M124,324 A36,36 0 1 1 196,324 A36,36 0 1 1 124,324 Z M564,324 A36,36 0 1 1 636,324 A36,36 0 1 1 564,324 Z M720,104 L740,104 L740,116 L720,116 Z M720,314 L736,314 L736,326 L720,326 Z M34,288 L40,288 L40,306 L34,306 Z',
		{ x: 34, y: 70, w: 706, h: 260 }
	),
	realDoubleDeckerWindows: realPart(
		'realDoubleDeckerWindows',
		'glass',
		'face',
		'double-decker',
		'M100,95 L640,95 L640,150 L100,150 Z M100,196 L590,196 L590,252 L100,252 Z',
		{ x: 98, y: 93, w: 544, h: 159 }
	),
	realDoubleDeckerDoor: realPart(
		'realDoubleDeckerDoor',
		'trim',
		'detail',
		'double-decker',
		'M600,196 L636,196 L636,314 L600,314 Z',
		{ x: 598, y: 194, w: 40, h: 122 }
	),
	realDoubleDeckerWheel: realPart(
		'realDoubleDeckerWheel',
		'rubber',
		'locomotion',
		'double-decker',
		'M124,324 A36,36 0 1 1 196,324 A36,36 0 1 1 124,324 Z',
		{ x: 124, y: 288, w: 72, h: 72 }
	),
	realBendyBusBody: realPart(
		'realBendyBusBody',
		'shell',
		'body',
		'bendy-bus',
		'M64,240 L424,240 L424,70 L90,70 Q64,70 64,96 Z M500,240 L852,240 L852,96 Q852,70 826,70 L500,70 Z M424,240 L500,240 L500,74 L424,74 Z M46,228 L64,228 L64,240 L46,240 Z M852,228 L866,228 L866,240 L852,240 Z M852,86 L876,86 L876,104 L852,104 Z M130,64 L174,64 L174,70 L130,70 Z M210,64 L254,64 L254,70 L210,70 Z M290,64 L334,64 L334,70 L290,70 Z M560,64 L604,64 L604,70 L560,70 Z M640,64 L684,64 L684,70 L640,70 Z M304,240 L376,240 L376,272 L304,272 Z',
		{ x: 46, y: 64, w: 830, h: 208 }
	),
	realBendyBusWindows: realPart(
		'realBendyBusWindows',
		'glass',
		'face',
		'bendy-bus',
		'M92,92 L396,92 L396,152 L92,152 Z M522,92 L724,92 L724,152 L522,152 Z M798,92 L844,92 L844,150 L798,150 Z',
		{ x: 92, y: 92, w: 752, h: 60 }
	),
	realBendyBusDoor: realPart(
		'realBendyBusDoor',
		'trim',
		'detail',
		'bendy-bus',
		'M748,92 L790,92 L790,238 L748,238 Z',
		{ x: 746, y: 90, w: 46, h: 150 }
	),
	realBendyBusWheel: realPart(
		'realBendyBusWheel',
		'rubber',
		'locomotion',
		'bendy-bus',
		'M724,236 A36,36 0 1 1 796,236 A36,36 0 1 1 724,236 Z',
		{ x: 724, y: 200, w: 72, h: 72 }
	),
	realCoachBusBody: realPart(
		'realCoachBusBody',
		'shell',
		'body',
		'coach-bus',
		'M70,250 L70,88 Q70,66 92,66 L766,66 Q788,66 798,88 L820,182 L820,250 Z M190,56 L280,56 L280,66 L190,66 Z M330,56 L420,56 L420,66 L330,66 Z M812,78 L838,78 L838,96 L812,96 Z M820,228 L826,228 L826,248 L820,248 Z M56,232 L70,232 L70,248 L56,248 Z',
		{ x: 56, y: 56, w: 782, h: 232 }
	),
	realCoachBusWindows: realPart(
		'realCoachBusWindows',
		'glass',
		'face',
		'coach-bus',
		'M100,96 L684,96 L684,168 L100,168 Z M752,96 L788,96 L804,172 L762,172 Z',
		{ x: 100, y: 96, w: 704, h: 76 }
	),
	realCoachBusDoor: realPart(
		'realCoachBusDoor',
		'trim',
		'detail',
		'coach-bus',
		'M692,96 L736,96 L736,244 L692,244 Z',
		{ x: 690, y: 94, w: 48, h: 152 }
	),
	realCoachBusWheel: realPart(
		'realCoachBusWheel',
		'rubber',
		'locomotion',
		'coach-bus',
		'M604,252 A36,36 0 1 1 676,252 A36,36 0 1 1 604,252 Z',
		{ x: 604, y: 216, w: 72, h: 72 }
	),
	realAirportShuttleBody: realPart(
		'realAirportShuttleBody',
		'shell',
		'body',
		'airport-shuttle',
		'M70,240 L70,108 Q70,90 92,90 L640,90 Q658,90 666,102 L706,162 Q712,172 712,184 L712,214 Q712,240 694,240 Z M300,82 L382,82 L382,90 L300,90 Z M470,78 L562,78 L562,90 L470,90 Z M700,138 L732,138 L732,152 L700,152 Z M712,224 L718,224 L718,238 L712,238 Z M54,228 L70,228 L70,240 L54,240 Z',
		{ x: 54, y: 78, w: 678, h: 184 }
	),
	realAirportShuttleWindows: realPart(
		'realAirportShuttleWindows',
		'glass',
		'face',
		'airport-shuttle',
		'M100,116 L544,116 L544,176 L100,176 Z M668,104 L694,104 L708,166 L682,172 Z',
		{ x: 100, y: 104, w: 608, h: 72 }
	),
	realAirportShuttleDoor: realPart(
		'realAirportShuttleDoor',
		'trim',
		'detail',
		'airport-shuttle',
		'M556,116 L608,116 L608,236 L556,236 Z',
		{ x: 554, y: 114, w: 56, h: 124 }
	),
	realAirportShuttleWheel: realPart(
		'realAirportShuttleWheel',
		'rubber',
		'locomotion',
		'airport-shuttle',
		'M606,228 A34,34 0 1 1 674,228 A34,34 0 1 1 606,228 Z',
		{ x: 606, y: 194, w: 68, h: 68 }
	),
	realMobileLibraryBody: realPart(
		'realMobileLibraryBody',
		'shell',
		'body',
		'mobile-library',
		'M70,246 L70,96 Q70,76 92,76 L700,76 Q718,76 726,88 L764,160 Q770,172 770,186 L770,222 Q770,246 750,246 Z M462,62 L558,62 L558,76 L462,76 Z M300,68 L364,68 L364,76 L300,76 Z M760,136 L792,136 L792,154 L760,154 Z M770,228 L782,228 L782,242 L770,242 Z M54,230 L70,230 L70,242 L54,242 Z',
		{ x: 54, y: 62, w: 738, h: 208 }
	),
	realMobileLibraryWindows: realPart(
		'realMobileLibraryWindows',
		'glass',
		'face',
		'mobile-library',
		'M120,112 L520,112 L520,184 L120,184 Z',
		{ x: 120, y: 112, w: 400, h: 72 }
	),
	realMobileLibraryDoor: realPart(
		'realMobileLibraryDoor',
		'trim',
		'detail',
		'mobile-library',
		'M552,112 L606,112 L606,242 L552,242 Z',
		{ x: 550, y: 110, w: 58, h: 134 }
	),
	realMobileLibraryWheel: realPart(
		'realMobileLibraryWheel',
		'rubber',
		'locomotion',
		'mobile-library',
		'M586,236 A34,34 0 1 1 654,236 A34,34 0 1 1 586,236 Z',
		{ x: 586, y: 202, w: 68, h: 68 }
	)

};

/** Child-facing names for the label and speech. Every part has one. */
export const PART_NAMES: Record<PartId, string> = {
	body: 'Body',
	bodyBox: 'Body',
	cabin: 'Cabin',
	cab: 'Cab',
	wheel: 'Wheel',
	tracks: 'Tracks',
	door: 'Door',
	windowStrip: 'Windows',
	roof: 'Roof',
	roofSign: 'Sign',
	light: 'Headlight',
	lightBar: 'Light bar',
	bumper: 'Bumper',
	ladder: 'Ladder',
	hoseReel: 'Hose',
	arm: 'Arm',
	bucket: 'Bucket',
	exhaust: 'Exhaust',
	beacon: 'Beacon',
	tank: 'Tank',
	mixer: 'Mixer',
	boom: 'Boom',
	hook: 'Hook',
	forks: 'Forks',
	plough: 'Plough',
	roller: 'Roller',
	brush: 'Brush',
	flatbed: 'Flatbed',
	logs: 'Logs',
	pantograph: 'Pantograph',
	spoiler: 'Spoiler',
	tipper: 'Tipper',
	miniCar: 'Car',
	header: 'Header',
	bale: 'Bale',
	skip: 'Skip',
	scissor: 'Scissor',
	realCarBody: 'Body',
	realCarCabin: 'Cabin',
	realCarDoor: 'Door',
	realCarWheel: 'Wheel',
	realFireBody: 'Fire engine',
	realFireLadder: 'Ladder',
	realFirePump: 'Pump',
	realFireWheel: 'Wheel',
	realDiggerHouse: 'Digger',
	realDiggerTracks: 'Tracks',
	realDiggerBoom: 'Boom',
	realDiggerBucket: 'Bucket',
	realDiggerBeacon: 'Beacon',
	realTruckCab: 'Cab',
	realTruckBox: 'Box',
	realTruckDoor: 'Door',
	realTruckWheel: 'Wheel',
	realBusBody: 'Bus',
	realBusWindows: 'Windows',
	realBusDoor: 'Door',
	realBusWheel: 'Wheel',
	realSchoolBusBody: 'School bus',
	realSchoolBusWindows: 'Windows',
	realSchoolBusDoor: 'Door',
	realSchoolBusWheel: 'Wheel',
	realMiniBusBody: 'Mini bus',
	realMiniBusWindows: 'Windows',
	realMiniBusDoor: 'Door',
	realMiniBusWheel: 'Wheel',
	realDoubleDeckerBody: 'Double-decker',
	realDoubleDeckerWindows: 'Windows',
	realDoubleDeckerDoor: 'Door',
	realDoubleDeckerWheel: 'Wheel',
	realBendyBusBody: 'Bendy bus',
	realBendyBusWindows: 'Windows',
	realBendyBusDoor: 'Door',
	realBendyBusWheel: 'Wheel',
	realCoachBusBody: 'Coach',
	realCoachBusWindows: 'Windows',
	realCoachBusDoor: 'Door',
	realCoachBusWheel: 'Wheel',
	realAirportShuttleBody: 'Airport shuttle',
	realAirportShuttleWindows: 'Windows',
	realAirportShuttleDoor: 'Door',
	realAirportShuttleWheel: 'Wheel',
	realMobileLibraryBody: 'Mobile library',
	realMobileLibraryWindows: 'Windows',
	realMobileLibraryDoor: 'Door',
	realMobileLibraryWheel: 'Wheel'
};

export function partName(part: PartId): string {
	return PART_NAMES[part];
}
