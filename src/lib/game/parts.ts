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
	| 'realMobileLibraryWheel'
	| 'realMobileClinicBody'
	| 'realMobileClinicWindows'
	| 'realMobileClinicDoor'
	| 'realMobileClinicWheel'
	| 'realTrolleybusBody'
	| 'realTrolleybusWindows'
	| 'realTrolleybusDoor'
	| 'realTrolleybusWheel'
	| 'realTramBody'
	| 'realTramWindows'
	| 'realTramDoor'
	| 'realTramWheel'
	| 'realMetroTrainBody'
	| 'realMetroTrainWindows'
	| 'realMetroTrainDoor'
	| 'realMetroTrainWheel'
	| 'realLightRailTrainBody'
	| 'realLightRailTrainWindows'
	| 'realLightRailTrainDoor'
	| 'realLightRailTrainWheel'
	| 'realMilkTankerBody'
	| 'realMilkTankerWindows'
	| 'realMilkTankerDoor'
	| 'realMilkTankerWheel'
	| 'realDumpTruckBody'
	| 'realDumpTruckWindows'
	| 'realDumpTruckDoor'
	| 'realDumpTruckWheel'
	| 'realFlatbedLorryBody'
	| 'realFlatbedLorryWindows'
	| 'realFlatbedLorryDoor'
	| 'realFlatbedLorryWheel'
	| 'realCraneTruckBody'
	| 'realCraneTruckWindows'
	| 'realCraneTruckDoor'
	| 'realCraneTruckWheel'
	| 'realCementMixerBody'
	| 'realCementMixerWindows'
	| 'realCementMixerDoor'
	| 'realCementMixerWheel'
	| 'realTowTruckBody'
	| 'realTowTruckWindows'
	| 'realTowTruckDoor'
	| 'realTowTruckWheel'
	| 'realGarbageTruckBody'
	| 'realGarbageTruckWindows'
	| 'realGarbageTruckDoor'
	| 'realGarbageTruckWheel'
	| 'realCarTransporterBody'
	| 'realCarTransporterWindows'
	| 'realCarTransporterDoor'
	| 'realCarTransporterWheel'
	| 'realRefrigeratedTruckBody'
	| 'realRefrigeratedTruckWindows'
	| 'realRefrigeratedTruckDoor'
	| 'realRefrigeratedTruckWheel'
	| 'realCurtainSideLorryBody'
	| 'realCurtainSideLorryWindows'
	| 'realCurtainSideLorryDoor'
	| 'realCurtainSideLorryWheel'
	| 'realParcelLorryBody'
	| 'realParcelLorryWindows'
	| 'realParcelLorryDoor'
	| 'realParcelLorryWheel'
	| 'realLogTruckBody'
	| 'realLogTruckWindows'
	| 'realLogTruckDoor'
	| 'realLogTruckWheel'
	| 'realLivestockTruckBody'
	| 'realLivestockTruckWindows'
	| 'realLivestockTruckDoor'
	| 'realLivestockTruckWheel'
	| 'realWaterTankerBody'
	| 'realWaterTankerWindows'
	| 'realWaterTankerDoor'
	| 'realWaterTankerWheel'
	| 'realFuelTankerBody'
	| 'realFuelTankerWindows'
	| 'realFuelTankerDoor'
	| 'realFuelTankerWheel'
	| 'realIceCreamVanBody'
	| 'realIceCreamVanWindows'
	| 'realIceCreamVanDoor'
	| 'realIceCreamVanWheel'
	| 'realMailVanBody'
	| 'realMailVanWindows'
	| 'realMailVanDoor'
	| 'realMailVanWheel'
	| 'realCamperBody'
	| 'realCamperWindows'
	| 'realCamperDoor'
	| 'realCamperWheel'
	| 'realDeliveryVanBody'
	| 'realDeliveryVanWindows'
	| 'realDeliveryVanDoor'
	| 'realDeliveryVanWheel'
	| 'realArmouredVanBody'
	| 'realArmouredVanWindows'
	| 'realArmouredVanDoor'
	| 'realArmouredVanWheel'
	| 'realAmbulanceBody'
	| 'realAmbulanceWindows'
	| 'realAmbulanceDoor'
	| 'realAmbulanceWheel'
	| 'realRemovalsVanBody'
	| 'realRemovalsVanWindows'
	| 'realRemovalsVanDoor'
	| 'realRemovalsVanWheel'
	| 'realPoliceVanBody'
	| 'realPoliceVanWindows'
	| 'realPoliceVanDoor'
	| 'realPoliceVanWheel'
	| 'realPickupBody'
	| 'realPickupWindows'
	| 'realPickupDoor'
	| 'realPickupWheel'
	| 'realPoliceCarBody'
	| 'realPoliceCarWindows'
	| 'realPoliceCarDoor'
	| 'realPoliceCarWheel'
	| 'realTaxiBody'
	| 'realTaxiWindows'
	| 'realTaxiDoor'
	| 'realTaxiWheel'
	| 'realLimousineBody'
	| 'realLimousineWindows'
	| 'realLimousineDoor'
	| 'realLimousineWheel'
	| 'realRaceCarBody'
	| 'realRaceCarWindows'
	| 'realRaceCarDoor'
	| 'realRaceCarWheel';

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
	),
	realMobileClinicBody: realPart(
		'realMobileClinicBody',
		'shell',
		'body',
		'mobile-clinic',
		'M70,246 L70,96 Q70,76 92,76 L700,76 Q718,76 726,88 L764,160 Q770,172 770,186 L770,222 Q770,246 750,246 Z M330,58 L422,58 L422,76 L330,76 Z M464,68 L524,68 L524,76 L464,76 Z M760,136 L792,136 L792,154 L760,154 Z M770,228 L782,228 L782,242 L770,242 Z M54,230 L70,230 L70,242 L54,242 Z',
		{ x: 54, y: 58, w: 738, h: 212 }
	),
	realMobileClinicWindows: realPart(
		'realMobileClinicWindows',
		'glass',
		'face',
		'mobile-clinic',
		'M264,112 L472,112 L472,176 L264,176 Z',
		{ x: 264, y: 112, w: 208, h: 64 }
	),
	realMobileClinicDoor: realPart(
		'realMobileClinicDoor',
		'trim',
		'detail',
		'mobile-clinic',
		'M552,112 L606,112 L606,242 L552,242 Z',
		{ x: 550, y: 110, w: 58, h: 134 }
	),
	realMobileClinicWheel: realPart(
		'realMobileClinicWheel',
		'rubber',
		'locomotion',
		'mobile-clinic',
		'M586,236 A34,34 0 1 1 654,236 A34,34 0 1 1 586,236 Z',
		{ x: 586, y: 202, w: 68, h: 68 }
	),
	realTrolleybusBody: realPart(
		'realTrolleybusBody',
		'shell',
		'body',
		'trolleybus',
		'M70,246 L70,124 Q70,100 94,100 L730,100 Q752,100 762,116 L790,180 Q796,192 796,206 L796,232 Q796,246 780,246 Z M280,36 L520,36 L520,100 L280,100 Z M190,92 L262,92 L262,100 L190,100 Z M280,92 L352,92 L352,100 L280,100 Z M794,116 L823,116 L823,136 L794,136 Z M796,228 L812,228 L812,242 L796,242 Z M54,230 L70,230 L70,242 L54,242 Z',
		{ x: 54, y: 36, w: 769, h: 236 }
	),
	realTrolleybusWindows: realPart(
		'realTrolleybusWindows',
		'glass',
		'face',
		'trolleybus',
		'M100,118 L660,118 L660,180 L100,180 Z M714,104 L746,104 L764,172 L732,178 Z',
		{ x: 100, y: 104, w: 664, h: 76 }
	),
	realTrolleybusDoor: realPart(
		'realTrolleybusDoor',
		'trim',
		'detail',
		'trolleybus',
		'M668,118 L710,118 L710,242 L668,242 Z',
		{ x: 666, y: 116, w: 46, h: 128 }
	),
	realTrolleybusWheel: realPart(
		'realTrolleybusWheel',
		'rubber',
		'locomotion',
		'trolleybus',
		'M604,236 A36,36 0 1 1 676,236 A36,36 0 1 1 604,236 Z',
		{ x: 604, y: 200, w: 72, h: 72 }
	),
	realTramBody: realPart(
		'realTramBody',
		'shell',
		'body',
		'tram',
		'M98,94 L722,94 Q760,94 760,132 L760,230 Q760,252 738,252 L82,252 Q60,252 60,230 L60,132 Q60,94 98,94 Z M362,94 L362,56 L368,18 L438,18 L452,56 L452,94 Z M654,76 L724,76 L724,94 L654,94 Z M178,85 L240,85 L240,94 L178,94 Z M278,85 L340,85 L340,94 L278,94 Z M760,238 L778,238 L778,248 L760,248 Z M80,252 L740,252 L740,264 L80,264 Z M760,136 L776,116 L786,120 L786,128 L766,140 L760,140 Z M82,116 L106,116 Q112,116 112,122 L112,168 Q112,174 106,174 L82,174 Q76,174 76,168 L76,122 Q76,116 82,116 Z M132,114 L580,114 Q588,114 588,122 L588,166 Q588,174 580,174 L132,174 Q124,174 124,166 L124,122 Q124,114 132,114 Z M714,112 L738,112 Q748,112 748,122 L748,166 Q748,176 738,176 L714,176 Q704,176 704,166 L704,122 Q704,112 714,112 Z M124,236 A36,36 0 1 1 196,236 A36,36 0 1 1 124,236 Z M604,236 A36,36 0 1 1 676,236 A36,36 0 1 1 604,236 Z',
		{ x: 60, y: 18, w: 726, h: 246 }
	),
	realTramWindows: realPart(
		'realTramWindows',
		'glass',
		'face',
		'tram',
		'M82,116 L106,116 Q112,116 112,122 L112,168 Q112,174 106,174 L82,174 Q76,174 76,168 L76,122 Q76,116 82,116 Z M132,114 L580,114 Q588,114 588,122 L588,166 Q588,174 580,174 L132,174 Q124,174 124,166 L124,122 Q124,114 132,114 Z M714,112 L738,112 Q748,112 748,122 L748,166 Q748,176 738,176 L714,176 Q704,176 704,166 L704,122 Q704,112 714,112 Z',
		{ x: 76, y: 112, w: 672, h: 64 }
	),
	realTramDoor: realPart(
		'realTramDoor',
		'trim',
		'detail',
		'tram',
		'M594,112 L678,112 L678,238 L594,238 Z',
		{ x: 594, y: 112, w: 84, h: 126 }
	),
	realTramWheel: realPart(
		'realTramWheel',
		'rubber',
		'locomotion',
		'tram',
		'M124,236 A36,36 0 1 1 196,236 A36,36 0 1 1 124,236 Z',
		{ x: 124, y: 200, w: 72, h: 72 }
	),
	realMetroTrainBody: realPart(
		'realMetroTrainBody',
		'shell',
		'body',
		'metro-train',
		'M58,256 L58,96 Q58,74 82,74 L742,74 Q778,74 796,92 Q846,140 858,200 L858,232 Q858,256 834,256 Z M294,74 L416,74 L422,0 L298,0 Z',
		{ x: 58, y: 0, w: 800, h: 256 }
	),
	realMetroTrainWindows: realPart(
		'realMetroTrainWindows',
		'glass',
		'face',
		'metro-train',
		'M100,108 L210,108 L210,166 L100,166 Z M286,108 L398,108 L398,166 L286,166 Z M474,108 L570,108 L570,166 L474,166 Z M646,108 L768,108 L768,166 L646,166 Z M792,94 Q830,142 854,198 L810,202 Q786,150 770,100 Z',
		{ x: 100, y: 94, w: 750, h: 108 }
	),
	realMetroTrainDoor: realPart(
		'realMetroTrainDoor',
		'trim',
		'detail',
		'metro-train',
		'M572,102 L644,102 L644,226 L572,226 Z',
		{ x: 572, y: 102, w: 72, h: 124 }
	),
	realMetroTrainWheel: realPart(
		'realMetroTrainWheel',
		'rubber',
		'locomotion',
		'metro-train',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realLightRailTrainBody: realPart(
		'realLightRailTrainBody',
		'shell',
		'body',
		'light-rail-train',
		'M50,262 L50,112 Q50,92 70,92 L410,92 Q430,92 430,112 L430,262 Z M474,262 L474,112 Q474,92 494,92 L800,92 Q820,92 828,106 L858,158 Q866,170 866,184 L866,262 Z M430,262 L430,124 Q430,116 438,116 L466,116 Q474,116 474,124 L474,262 Z M176,8 L256,8 L256,92 L176,92 Z M330,79 L406,79 L406,92 L330,92 Z M544,79 L608,79 L608,92 L544,92 Z M866,238 L880,238 L880,250 L866,250 Z M36,240 L50,240 L50,252 L36,252 Z',
		{ x: 36, y: 8, w: 844, h: 254 }
	),
	realLightRailTrainWindows: realPart(
		'realLightRailTrainWindows',
		'glass',
		'face',
		'light-rail-train',
		'M74,112 L238,112 L238,170 L74,170 Z M318,112 L412,112 L412,170 L318,170 Z M494,112 L556,112 L556,170 L494,170 Z M640,112 L790,112 L790,170 L640,170 Z M802,106 L822,106 L848,170 Q852,178 846,186 L802,186 Z',
		{ x: 74, y: 106, w: 774, h: 80 }
	),
	realLightRailTrainDoor: realPart(
		'realLightRailTrainDoor',
		'trim',
		'detail',
		'light-rail-train',
		'M566,108 L630,108 L630,252 L566,252 Z',
		{ x: 566, y: 108, w: 64, h: 144 }
	),
	realLightRailTrainWheel: realPart(
		'realLightRailTrainWheel',
		'rubber',
		'locomotion',
		'light-rail-train',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realMilkTankerBody: realPart(
		'realMilkTankerBody',
		'shell',
		'body',
		'milk-tanker',
		'M30,258 L30,128 Q30,111 48,105 L198,96 Q208,96 214,100 L216,110 L672,110 C690,110 702,134 702,176 C702,218 690,242 672,242 L700,242 L700,258 L30,258 Z M540,82 L620,82 L620,110 L540,110 Z M316,84 L384,84 L384,110 L316,110 Z M702,106 L730,106 L730,258 L702,258 Z M16,236 L30,236 L30,258 L16,258 Z M10,110 L30,110 L30,146 L10,146 Z M220,258 L536,258 L536,265 L220,265 Z',
		{ x: 10, y: 73, w: 720, h: 194 }
	),
	realMilkTankerWindows: realPart(
		'realMilkTankerWindows',
		'glass',
		'face',
		'milk-tanker',
		'M50,122 L122,122 Q130,122 130,130 L130,162 Q130,170 122,170 L50,170 Q42,170 42,162 L42,130 Q42,122 50,122 Z M147,126 L199,126 Q204,126 204,131 L204,165 Q204,170 199,170 L147,170 Q142,170 142,165 L142,131 Q142,126 147,126 Z',
		{ x: 42, y: 122, w: 162, h: 48 }
	),
	realMilkTankerDoor: realPart(
		'realMilkTankerDoor',
		'trim',
		'detail',
		'milk-tanker',
		'M44,178 L204,178 L204,252 L44,252 Z',
		{ x: 44, y: 178, w: 160, h: 74 }
	),
	realMilkTankerWheel: realPart(
		'realMilkTankerWheel',
		'rubber',
		'locomotion',
		'milk-tanker',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realDumpTruckBody: realPart(
		'realDumpTruckBody',
		'shell',
		'body',
		'dump-truck',
		'M26,250 L26,220 L38,220 L38,198 L48,190 L48,176 Q48,150 62,138 L80,112 Q88,98 104,98 L264,98 Q276,98 276,112 L276,152 L304,152 L304,46 Q304,40 314,40 L330,40 L330,52 L710,80.8 L710,78.5 L726,78.5 L726,82 L726,250 Z M36,90 L54,90 L54,114 L36,114 Z M54,98 L80,112 L74.4,120 L54,108 Z M128,90 L224,90 L224,98 L128,98 Z M726,236 L750,236 L750,254 L726,254 Z M344,250 L460,250 L460,268 L344,268 Z M186,250 L203,250 L203,270 L186,270 Z M638,250 L655,250 L655,270 L638,270 Z',
		{ x: 26, y: 40, w: 724, h: 230 }
	),
	realDumpTruckWindows: realPart(
		'realDumpTruckWindows',
		'glass',
		'face',
		'dump-truck',
		'M52,172 L52,158 Q52,148 58,140 L76,118 Q82,108 92,108 L126,108 Q132,108 132,116 L132,164 Q132,172 126,172 Z M142,110 Q142,104 150,104 L244,104 Q252,104 252,112 L252,156 Q252,164 244,164 L150,164 Q142,164 142,156 Z',
		{ x: 52, y: 104, w: 200, h: 68 }
	),
	realDumpTruckDoor: realPart(
		'realDumpTruckDoor',
		'trim',
		'detail',
		'dump-truck',
		'M204,168 L270,168 L270,250 L204,250 Z',
		{ x: 204, y: 168, w: 66, h: 82 }
	),
	realDumpTruckWheel: realPart(
		'realDumpTruckWheel',
		'rubber',
		'locomotion',
		'dump-truck',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realFlatbedLorryBody: realPart(
		'realFlatbedLorryBody',
		'shell',
		'body',
		'flatbed-lorry',
		'M42,266 L42,194 Q42,180 54,172 L76,144 Q84,132 100,132 L200,132 Q212,132 212,144 L212,266 Z M212,150 L754,150 L754,274 L212,274 Z M208,104 L228,104 L228,110 L224,110 L224,150 L212,150 L212,110 L208,110 Z M28,126 L64,126 L64,162 L28,162 Z M28,244 L42,244 L42,266 L28,266 Z M94,124 L178,124 L178,132 L94,132 Z M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z M564,236 A36,36 0 1 1 636,236 A36,36 0 1 1 564,236 Z',
		{ x: 28, y: 104, w: 726, h: 170 }
	),
	realFlatbedLorryWindows: realPart(
		'realFlatbedLorryWindows',
		'glass',
		'face',
		'flatbed-lorry',
		'M54,214 L66,154 Q69,148 76,148 L120,148 L120,214 Z M133,148 L195,148 Q200,148 200,153 L200,189 Q200,194 195,194 L133,194 Q128,194 128,189 L128,153 Q128,148 133,148 Z',
		{ x: 54, y: 148, w: 146, h: 66 }
	),
	realFlatbedLorryDoor: realPart(
		'realFlatbedLorryDoor',
		'trim',
		'detail',
		'flatbed-lorry',
		'M126,194 L204,194 L204,256 L126,256 Z',
		{ x: 126, y: 194, w: 78, h: 62 }
	),
	realFlatbedLorryWheel: realPart(
		'realFlatbedLorryWheel',
		'rubber',
		'locomotion',
		'flatbed-lorry',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realCraneTruckBody: realPart(
		'realCraneTruckBody',
		'shell',
		'body',
		'crane-truck',
		'M34,252 L34,128 Q34,110 50,104 L186,104 Q196,104 196,114 L196,204 L462,204 L462,174 L494.3,167.1 L719.4,36.3 L728.6,51.7 L509.7,192.9 L538,174 L538,204 L772,204 L772,248 L196,248 L196,252 Z M398,204 L398,188 L400,188 L400,172 L408,172 L408,184 L430,184 L430,174 L446,174 L446,204 Z M386,204 L386,166 L454,166 L454,204 L450,204 L450,170 L390,170 L390,204 Z M100,104 L100,100 Q100,92 108,92 L140,92 Q148,92 148,100 L148,104 Z M22,118 L34,118 L34,144 L22,144 Z M20,238 L34,238 L34,260 L20,260 Z M204,124 L200,124 L200,116 L220,116 L220,124 L216,124 L216,204 L204,204 Z M204,116 Q202,102 214,98 Q222,86 236,88 Q250,90 250,102 Q260,108 254,116 Z M230,248 L244,248 L244,260 L258,260 L258,266 L214,266 L214,260 L230,260 Z M700,248 L714,248 L714,260 L728,260 L728,266 L684,266 L684,260 L700,260 Z M707,66 L713,66 L713,156 L707,156 Z M696,156 L724,156 L724,176 L696,176 Z M700,176 L724,176 L724,196 L700,196 Z M586.96,204 A46,46 0 0 1 653.04,204 L636.49,204 A36,36 0 0 0 603.51,204 Z M196,248 L208,248 L208,251 Q208,253 206,253 L196,253 Z',
		{ x: 18, y: 36, w: 754, h: 230 }
	),
	realCraneTruckWindows: realPart(
		'realCraneTruckWindows',
		'glass',
		'face',
		'crane-truck',
		'M46,186 L46,130 Q46,119 57,119 L112,119 Q120,119 120,127 L120,186 Z M134,123 L180,123 Q186,123 186,129 L186,177 Q186,183 180,183 L134,183 Q128,183 128,177 L128,129 Q128,123 134,123 Z',
		{ x: 46, y: 119, w: 140, h: 67 }
	),
	realCraneTruckDoor: realPart(
		'realCraneTruckDoor',
		'trim',
		'detail',
		'crane-truck',
		'M128,190 L190,190 L190,250 L128,250 Z',
		{ x: 128, y: 190, w: 62, h: 60 }
	),
	realCraneTruckWheel: realPart(
		'realCraneTruckWheel',
		'rubber',
		'locomotion',
		'crane-truck',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realCementMixerBody: realPart(
		'realCementMixerBody',
		'shell',
		'body',
		'cement-mixer',
		'M34,260 L34,124 Q34,104 50,98 L60,90 Q68,84 82,84 L182,84 Q196,84 196,96 L196,150 L212,162 L226,172 C256,158 296,134 340,108 C388,84 434,66 480,60 C512,56 534,62 546,76 L552,54 L644,54 L644,78 L620,78 L620,98 L596,98 L596,118 L584,118 L560,136 C562,152 560,172 552,190 C548,200 544,204 542,204 L548,200 L620,226 L638,220 L636,241 L620,241 L552,218 L542,208 C526,220 502,228 476,234 C430,242 382,244 332,238 C302,234 278,224 252,210 L226,204 L226,244 L690,244 L690,260 Z M14,100 L28,100 L28,132 L14,132 Z M18,232 L34,232 L34,256 L18,256 Z M232,216 L262,216 L266,244 L228,244 Z',
		{ x: 14, y: 54, w: 676, h: 206 }
	),
	realCementMixerWindows: realPart(
		'realCementMixerWindows',
		'glass',
		'face',
		'cement-mixer',
		'M49,100 L111,100 Q118,100 118,107 L118,155 Q118,162 111,162 L49,162 Q42,162 42,155 L42,107 Q42,100 49,100 Z M133,104 L181,104 Q186,104 186,109 L186,155 Q186,160 181,160 L133,160 Q128,160 128,155 L128,109 Q128,104 133,104 Z',
		{ x: 42, y: 100, w: 144, h: 62 }
	),
	realCementMixerDoor: realPart(
		'realCementMixerDoor',
		'trim',
		'detail',
		'cement-mixer',
		'M44,170 L190,170 L190,244 L44,244 Z',
		{ x: 44, y: 170, w: 146, h: 74 }
	),
	realCementMixerWheel: realPart(
		'realCementMixerWheel',
		'rubber',
		'locomotion',
		'cement-mixer',
		'M104,236 A36,36 0 1 1 176,236 A36,36 0 1 1 104,236 Z',
		{ x: 104, y: 200, w: 72, h: 72 }
	),
	realTowTruckBody: realPart(
		'realTowTruckBody',
		'shell',
		'body',
		'tow-truck',
		'M22,252 L22,236 L34,236 L34,120 Q34,104 50,98 L184,98 Q196,98 196,110 L196,252 Z M20,110 Q20,106 24,106 L30,106 Q34,106 34,110 L34,146 Q34,150 30,150 L24,150 Q20,150 20,146 Z M76,98 L76,90 Q76,82 84,82 L160,82 Q168,82 168,90 L168,98 Z M208,244 L208,190 Q208,180 218,180 L648,180 Q656,180 656,190 L656,244 Z M656,244 L656,224 Q656,218 662,218 L738,218 Q746,218 746,226 L746,244 Z M232,180 L232,156 Q232,151 237,149 L276,146 L276,180 Z M276,152 L716,58 L716,80 L276,180 Z M709,84 L715,84 L714,164 L708,164 Z M694,164 L720,164 L720,196 Q720,216 704,216 Q694,216 694,204 Z M198,90 L206,90 L206,246 L198,246 Z M192,90 L192,84 Q192,80 196,80 L208,80 Q212,80 212,84 L212,90 Z M236,244 L312,244 L312,260 Q312,264 308,264 L240,264 Q236,264 236,260 Z M700,244 L716,244 L714,262 L702,262 Z M690,262 L726,262 L726,268 L690,268 Z M50,252 L196,252 L196,258 L50,258 Z M196,244 L198,244 L198,258 L196,258 Z M198,246 L206,246 L206,258 L198,258 Z M206,244 L208,244 L208,258 L206,258 Z M208,244 L236,244 L236,258 L208,258 Z M312,244 L656,244 L656,258 L312,258 Z M656,244 L700,244 L700,258 L656,258 Z M716,244 L746,244 L746,258 L716,258 Z',
		{ x: 20, y: 58, w: 726, h: 210 }
	),
	realTowTruckWindows: realPart(
		'realTowTruckWindows',
		'glass',
		'face',
		'tow-truck',
		'M46,184 L46,128 Q46,118 55,116 L110,116 Q118,116 118,124 L118,176 Q118,184 110,184 Z M132,118 L180,118 Q188,118 188,126 L188,170 Q188,178 180,178 L132,178 Q124,178 124,170 L124,126 Q124,118 132,118 Z',
		{ x: 46, y: 116, w: 142, h: 68 }
	),
	realTowTruckDoor: realPart(
		'realTowTruckDoor',
		'trim',
		'detail',
		'tow-truck',
		'M124,186 L188,186 L188,244 L124,244 Z',
		{ x: 124, y: 186, w: 64, h: 58 }
	),
	realTowTruckWheel: realPart(
		'realTowTruckWheel',
		'rubber',
		'locomotion',
		'tow-truck',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realGarbageTruckBody: realPart(
		'realGarbageTruckBody',
		'shell',
		'body',
		'garbage-truck',
		'M30,250 L30,150 Q30,136 38,128 L70,88 Q76,80 88,80 L196,80 L196,68 Q196,58 206,58 L250,56 Q455,38 640,54 L656,56 Q670,58 676,70 L682,80 L700,92 Q704,95 704,106 L704,250 Z M140,80 L140,74 L150,74 Q150,60 160,60 Q170,60 170,74 L180,74 L180,80 Z M18,96 L30,96 L30,126 L18,126 Z M16,230 L30,230 L30,260 L16,260 Z M112,250 L188,250 L188,262 L112,262 Z M190,250 L206,250 L206,268 L190,268 Z M642,250 L658,250 L658,268 L642,268 Z M704,160 L752,160 L752,168 L704,168 Z M708,168 L748,168 L744,226 Q744,232 738,232 L718,232 Q712,232 712,226 Z M696,250 L724,250 L724,264 L696,264 Z',
		{ x: 16, y: 46, w: 736, h: 222 }
	),
	realGarbageTruckWindows: realPart(
		'realGarbageTruckWindows',
		'glass',
		'face',
		'garbage-truck',
		'M36,164 L36,138 Q36,128 44,122 L58,102 Q64,92 76,92 L102,92 Q110,92 110,100 L110,156 Q110,164 102,164 Z M124,94 L180,94 Q188,94 188,102 L188,150 Q188,158 180,158 L124,158 Q116,158 116,150 L116,102 Q116,94 124,94 Z',
		{ x: 36, y: 92, w: 152, h: 72 }
	),
	realGarbageTruckDoor: realPart(
		'realGarbageTruckDoor',
		'trim',
		'detail',
		'garbage-truck',
		'M124,172 L190,172 L190,244 L124,244 Z',
		{ x: 124, y: 172, w: 66, h: 72 }
	),
	realGarbageTruckWheel: realPart(
		'realGarbageTruckWheel',
		'rubber',
		'locomotion',
		'garbage-truck',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realCarTransporterBody: realPart(
		'realCarTransporterBody',
		'shell',
		'body',
		'car-transporter',
		'M24,252 L24,132 Q24,116 40,116 L174,116 Q190,116 190,132 L190,252 Z M38,106 L116,106 L116,116 L38,116 Z M6,134 Q6,130 10,130 L18,130 Q22,130 22,134 L22,158 Q22,162 18,162 L10,162 Q6,162 6,158 Z M22,144 L24,144 L24,152 L22,152 Z M6,238 L24,238 L24,264 L6,264 Z M120,252 L190,252 L190,258 L120,258 Z M194,124 L206,124 L206,182 L194,182 Z M196,124 Q194,119 198,115 Q202,111 207,112 Q211,114 209,118 Q212,121 207,124 Z M150,108 L150,116 L118,116 Z M150,96 L816,96 L816,108 L150,108 Z M190,182 L812,182 L812,200 L190,200 Z M214,200 L600,200 L600,244 L214,244 Z M686,200 L812,200 L812,244 L686,244 Z M190,200 L214,200 L214,244 L190,244 Z M190,244 L824,244 L824,258 L190,258 Z M792,258 L824,258 L824,266 L792,266 Z M236,108 L248,108 L248,182 L236,182 Z M386,108 L398,108 L398,182 L386,182 Z M596,108 L608,108 L608,182 L596,182 Z M800,108 L812,108 L812,182 L800,182 Z M250,110 L378,176 L378,180 L250,114 Z M700,173 L792,108 L792,117 L700,182 Z M812,202 L852,262 L838,270 L812,216 Z M214,112 L218,112 L218,182 L214,182 Z M228,112 L232,112 L232,182 L228,182 Z M218,124 L228,124 L228,128 L218,128 Z M218,140 L228,140 L228,144 L218,144 Z M218,156 L228,156 L228,160 L218,160 Z M218,172 L228,172 L228,176 L218,176 Z M196,78 L236,78 L236,96 L196,96 Z M250,96 L250,90 Q250,86 256,85 L274,82 L290,61 Q294,55 302,55 L340,55 Q348,55 352,61 L368,76 L386,79 Q396,80 396,86 L396,96 Z M440,182 L440,176 Q440,172 446,171 L464,168 L478,147 Q482,141 490,141 L524,141 Q532,141 536,147 L550,162 L576,165 Q586,166 586,172 L586,182 Z',
		{ x: 6, y: 55, w: 846, h: 215 }
	),
	realCarTransporterWindows: realPart(
		'realCarTransporterWindows',
		'glass',
		'face',
		'car-transporter',
		'M32,190 L32,142 Q32,132 42,132 L88,132 Q96,132 96,142 L96,190 Z M118,178 L118,142 Q118,132 128,132 L168,132 Q178,132 178,142 L178,178 Z',
		{ x: 32, y: 132, w: 146, h: 58 }
	),
	realCarTransporterDoor: realPart(
		'realCarTransporterDoor',
		'trim',
		'detail',
		'car-transporter',
		'M118,184 L178,184 L178,246 L118,246 Z',
		{ x: 118, y: 184, w: 60, h: 62 }
	),
	realCarTransporterWheel: realPart(
		'realCarTransporterWheel',
		'rubber',
		'locomotion',
		'car-transporter',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realRefrigeratedTruckBody: realPart(
		'realRefrigeratedTruckBody',
		'shell',
		'body',
		'refrigerated-truck',
		'M24,260 L24,134 Q24,114 42,110 Q58,106 78,106 L130,106 L130,62 Q130,58 136,58 L196,58 L196,52 L742,52 Q752,52 752,62 L752,240 L196,240 L196,260 Z M196,240 L752,240 L752,260 L196,260 Z M6,116 L24,116 L24,150 L6,150 Z M8,244 L24,244 L24,268 L8,268 Z M752,246 L768,246 L768,266 L752,266 Z',
		{ x: 6, y: 52, w: 762, h: 216 }
	),
	realRefrigeratedTruckWindows: realPart(
		'realRefrigeratedTruckWindows',
		'glass',
		'face',
		'refrigerated-truck',
		'M45,120 L119,120 Q128,120 128,129 L128,169 Q128,178 119,178 L45,178 Q36,178 36,169 L36,129 Q36,120 45,120 Z M143,124 L177,124 Q182,124 182,129 L182,173 Q182,178 177,178 L143,178 Q138,178 138,173 L138,129 Q138,124 143,124 Z',
		{ x: 36, y: 120, w: 146, h: 58 }
	),
	realRefrigeratedTruckDoor: realPart(
		'realRefrigeratedTruckDoor',
		'trim',
		'detail',
		'refrigerated-truck',
		'M470,96 L556,96 L556,204 L470,204 Z',
		{ x: 470, y: 96, w: 86, h: 108 }
	),
	realRefrigeratedTruckWheel: realPart(
		'realRefrigeratedTruckWheel',
		'rubber',
		'locomotion',
		'refrigerated-truck',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realCurtainSideLorryBody: realPart(
		'realCurtainSideLorryBody',
		'shell',
		'body',
		'curtain-side-lorry',
		'M22,258 L22,126 Q22,106 40,101 L70,93 Q78,91 86,91 L188,91 L188,78 Q188,74 194,74 L762,74 Q770,74 770,82 L770,262 L196,262 L196,258 Z M6,108 L22,108 L22,144 L6,144 Z M6,240 L22,240 L22,266 L6,266 Z M770,246 L788,246 L788,264 L770,264 Z',
		{ x: 6, y: 74, w: 782, h: 192 }
	),
	realCurtainSideLorryWindows: realPart(
		'realCurtainSideLorryWindows',
		'glass',
		'face',
		'curtain-side-lorry',
		'M38,112 L114,112 Q122,112 122,120 L122,168 Q122,176 114,176 L38,176 Q30,176 30,168 L30,120 Q30,112 38,112 Z M138,112 L180,112 Q186,112 186,118 L186,160 Q186,166 180,166 L138,166 Q132,166 132,160 L132,118 Q132,112 138,112 Z',
		{ x: 30, y: 112, w: 156, h: 64 }
	),
	realCurtainSideLorryDoor: realPart(
		'realCurtainSideLorryDoor',
		'trim',
		'detail',
		'curtain-side-lorry',
		'M128,182 L192,182 L192,256 L128,256 Z',
		{ x: 128, y: 182, w: 64, h: 74 }
	),
	realCurtainSideLorryWheel: realPart(
		'realCurtainSideLorryWheel',
		'rubber',
		'locomotion',
		'curtain-side-lorry',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realParcelLorryBody: realPart(
		'realParcelLorryBody',
		'shell',
		'body',
		'parcel-lorry',
		'M24,258 L24,124 Q24,106 42,102 L196,102 L196,44 L748,44 Q764,44 764,60 L764,240 L196,240 L196,258 Z M196,240 L764,240 L764,258 L196,258 Z M214,32 L742,32 L742,38 L214,38 Z M226,38 L234,38 L234,44 L226,44 Z M722,38 L730,38 L730,44 L722,44 Z M186,82 L196,82 L196,102 L186,102 Z M8,118 L24,118 L24,152 L8,152 Z M8,242 L24,242 L24,266 L8,266 Z M764,248 L776,248 L776,266 L764,266 Z M92,258 L124,258 L124,268 L92,268 Z',
		{ x: 8, y: 32, w: 768, h: 236 }
	),
	realParcelLorryWindows: realPart(
		'realParcelLorryWindows',
		'glass',
		'face',
		'parcel-lorry',
		'M44,112 L128,112 Q138,112 138,122 L138,166 Q138,176 128,176 L44,176 Q34,176 34,166 L34,122 Q34,112 44,112 Z M151,116 L183,116 Q188,116 188,121 L188,167 Q188,172 183,172 L151,172 Q146,172 146,167 L146,121 Q146,116 151,116 Z',
		{ x: 34, y: 112, w: 154, h: 64 }
	),
	realParcelLorryDoor: realPart(
		'realParcelLorryDoor',
		'trim',
		'detail',
		'parcel-lorry',
		'M474,96 L566,96 L566,206 L474,206 Z',
		{ x: 474, y: 96, w: 92, h: 110 }
	),
	realParcelLorryWheel: realPart(
		'realParcelLorryWheel',
		'rubber',
		'locomotion',
		'parcel-lorry',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realLogTruckBody: realPart(
		'realLogTruckBody',
		'shell',
		'body',
		'log-truck',
		'M46,252 L46,142 Q46,120 58,110 L72,100 Q80,92 94,92 L212,92 Q224,92 224,104 L224,252 Z M224,246 L782,246 L782,264 L54,264 L54,252 L224,252 Z M230,186 L782,186 L782,246 L230,246 Z M226,60 L258,60 L258,186 L226,186 Z M260,186 L260,86 L292,86 L292,64 L714,64 L714,86 L778,86 L778,186 Z M16,98 L46,98 L46,128 L16,128 Z M28,230 L46,230 L46,258 L28,258 Z M182,252 L200,252 L200,268 L182,268 Z M670,264 L688,264 L688,268 L670,268 Z M181,72 L203,72 L203,92 L181,92 Z',
		{ x: 16, y: 60, w: 766, h: 208 }
	),
	realLogTruckWindows: realPart(
		'realLogTruckWindows',
		'glass',
		'face',
		'log-truck',
		'M56,128 Q56,114 64,112 L128,112 Q134,112 134,118 L134,178 Q134,184 128,184 L62,184 Q56,184 56,178 Z M146,114 L204,114 Q212,114 212,122 L212,152 Q212,158 206,158 L146,158 Q140,158 140,152 L140,120 Q140,114 146,114 Z',
		{ x: 56, y: 112, w: 156, h: 72 }
	),
	realLogTruckDoor: realPart(
		'realLogTruckDoor',
		'trim',
		'detail',
		'log-truck',
		'M142,164 L218,164 L218,246 L142,246 Z',
		{ x: 142, y: 164, w: 76, h: 82 }
	),
	realLogTruckWheel: realPart(
		'realLogTruckWheel',
		'rubber',
		'locomotion',
		'log-truck',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realLivestockTruckBody: realPart(
		'realLivestockTruckBody',
		'shell',
		'body',
		'livestock-truck',
		'M22,258 L22,146 Q22,120 36,112 L52,104 Q62,99 78,99 L190,99 L190,52 Q190,44 200,44 L748,44 Q762,44 762,56 L762,248 L200,248 L200,258 Z M200,248 L762,248 L762,262 L200,262 Z M2,116 L18,116 L18,152 L2,152 Z M4,244 L22,244 L22,268 L4,268 Z M300,30 L352,30 L352,44 L300,44 Z M462,30 L514,30 L514,44 L462,44 Z M624,30 L676,30 L676,44 L624,44 Z M762,58 L790,58 L790,244 L762,244 Z',
		{ x: 2, y: 30, w: 788, h: 238 }
	),
	realLivestockTruckWindows: realPart(
		'realLivestockTruckWindows',
		'glass',
		'face',
		'livestock-truck',
		'M47,120 L113,120 Q122,120 122,129 L122,169 Q122,178 113,178 L47,178 Q38,178 38,169 L38,129 Q38,120 47,120 Z M133,122 L171,122 Q176,122 176,127 L176,173 Q176,178 171,178 L133,178 Q128,178 128,173 L128,127 Q128,122 133,122 Z',
		{ x: 38, y: 120, w: 138, h: 58 }
	),
	realLivestockTruckDoor: realPart(
		'realLivestockTruckDoor',
		'trim',
		'detail',
		'livestock-truck',
		'M40,182 L178,182 L178,252 L40,252 Z',
		{ x: 40, y: 182, w: 138, h: 70 }
	),
	realLivestockTruckWheel: realPart(
		'realLivestockTruckWheel',
		'rubber',
		'locomotion',
		'livestock-truck',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realWaterTankerBody: realPart(
		'realWaterTankerBody',
		'shell',
		'body',
		'water-tanker',
		'M26,258 L26,132 Q26,110 46,104 L186,98 Q200,98 206,104 L216,112 L640,112 C658,112 672,140 672,176 C672,212 658,240 640,240 L672,240 L672,152 L756,152 L756,258 Z M410,84 L478,84 L478,112 L410,112 Z M290,96 L322,96 L322,112 L290,112 Z M6,114 L26,114 L26,152 L6,152 Z M8,236 L26,236 L26,262 L8,262 Z M50,258 L100,258 L100,266 L50,266 Z M220,258 L572,258 L572,266 L220,266 Z M666,258 L758,258 L758,270 L666,270 Z M756,118 L778,118 L778,246 L756,246 Z',
		{ x: 6, y: 84, w: 772, h: 186 }
	),
	realWaterTankerWindows: realPart(
		'realWaterTankerWindows',
		'glass',
		'face',
		'water-tanker',
		'M45,114 L111,114 Q120,114 120,123 L120,163 Q120,172 111,172 L45,172 Q36,172 36,163 L36,123 Q36,114 45,114 Z M133,118 L181,118 Q186,118 186,123 L186,163 Q186,168 181,168 L133,168 Q128,168 128,163 L128,123 Q128,118 133,118 Z',
		{ x: 36, y: 114, w: 150, h: 58 }
	),
	realWaterTankerDoor: realPart(
		'realWaterTankerDoor',
		'trim',
		'detail',
		'water-tanker',
		'M48,182 L186,182 L186,248 L48,248 Z',
		{ x: 48, y: 182, w: 138, h: 66 }
	),
	realWaterTankerWheel: realPart(
		'realWaterTankerWheel',
		'rubber',
		'locomotion',
		'water-tanker',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realFuelTankerBody: realPart(
		'realFuelTankerBody',
		'shell',
		'body',
		'fuel-tanker',
		'M26,264 L26,142 Q26,124 40,118 L54,112 Q60,110 74,110 L178,110 Q192,110 192,124 L192,242 L236,242 L236,182 Q236,150 264,144 L752,144 Q776,144 790,158 Q806,172 806,196 Q806,220 790,234 Q778,242 764,242 L820,242 L820,176 L866,176 L866,264 L682.6,264 A36,36 0 0 1 637.4,264 L422.6,264 A36,36 0 0 1 377.4,264 L26,264 Z M8,126 L24,126 L24,138 L26,138 L26,146 L24,146 L24,162 L8,162 Z M8,248 L26,248 L26,268 L8,268 Z M866,257 L884,257 L884,264 L866,264 Z M282,144 L282,138 Q282,128 292,128 L308,128 Q318,128 318,138 L318,144 Z M407,144 L407,138 Q407,128 417,128 L433,128 Q443,128 443,138 L443,144 Z M537,144 L537,138 Q537,128 547,128 L563,128 Q573,128 573,138 L573,144 Z M667,144 L667,138 Q667,128 677,128 L693,128 Q703,128 703,138 L703,144 Z',
		{ x: 8, y: 110, w: 876, h: 162 }
	),
	realFuelTankerWindows: realPart(
		'realFuelTankerWindows',
		'glass',
		'face',
		'fuel-tanker',
		'M43,124 L113,124 Q120,124 120,131 L120,175 Q120,182 113,182 L43,182 Q36,182 36,175 L36,131 Q36,124 43,124 Z M135,124 L175,124 Q180,124 180,129 L180,167 Q180,172 175,172 L135,172 Q130,172 130,167 L130,129 Q130,124 135,124 Z',
		{ x: 36, y: 124, w: 144, h: 58 }
	),
	realFuelTankerDoor: realPart(
		'realFuelTankerDoor',
		'trim',
		'detail',
		'fuel-tanker',
		'M120,186 L184,186 L184,250 L120,250 Z',
		{ x: 120, y: 186, w: 64, h: 64 }
	),
	realFuelTankerWheel: realPart(
		'realFuelTankerWheel',
		'rubber',
		'locomotion',
		'fuel-tanker',
		'M124,236 A36,36 0 1 1 196,236 A36,36 0 1 1 124,236 Z',
		{ x: 124, y: 200, w: 72, h: 72 }
	),
	realIceCreamVanBody: realPart(
		'realIceCreamVanBody',
		'shell',
		'body',
		'ice-cream-van',
		'M34,258 L34,206 Q34,196 42,192 L58,180 L82,118 Q84,110 92,110 L638,110 Q652,110 652,124 L652,242 Q652,258 636,258 Z M250,100 L230,72 Q218,68 228,58 Q218,50 230,42 Q228,30 242,30 Q250,19 258,30 Q272,30 270,42 Q282,50 272,58 Q282,68 270,72 Z M240,100 L260,100 L260,110 L240,110 Z M20,242 L34,242 L34,262 L20,262 Z M652,246 L666,246 L666,262 L652,262 Z',
		{ x: 20, y: 24, w: 646, h: 238 }
	),
	realIceCreamVanWindows: realPart(
		'realIceCreamVanWindows',
		'glass',
		'face',
		'ice-cream-van',
		'M72,162 L90,124 Q92,120 98,120 L130,120 Q134,120 134,124 L118,162 Z M146,120 L188,120 Q194,120 194,126 L194,150 Q194,156 188,156 L146,156 Q140,156 140,150 L140,126 Q140,120 146,120 Z',
		{ x: 72, y: 120, w: 122, h: 42 }
	),
	realIceCreamVanDoor: realPart(
		'realIceCreamVanDoor',
		'trim',
		'detail',
		'ice-cream-van',
		'M122,162 L198,162 L198,252 L122,252 Z',
		{ x: 122, y: 162, w: 76, h: 90 }
	),
	realIceCreamVanWheel: realPart(
		'realIceCreamVanWheel',
		'rubber',
		'locomotion',
		'ice-cream-van',
		'M116,236 A34,34 0 1 1 184,236 A34,34 0 1 1 116,236 Z',
		{ x: 116, y: 202, w: 68, h: 68 }
	),
	realMailVanBody: realPart(
		'realMailVanBody',
		'shell',
		'body',
		'mail-van',
		'M40,258 L40,198 Q40,188 50,184 L104,170 L166,88 Q170,78 182,78 L646,78 Q662,78 662,94 L662,244 Q662,258 648,258 Z M262,44 L384,44 L384,74 L262,74 Z M278,74 L287,74 L287,78 L278,78 Z M359,74 L368,74 L368,78 L359,78 Z M26,232 L40,232 L40,252 L26,252 Z M662,240 L674,240 L674,256 L662,256 Z M86,124 L106,124 L106,146 L122.1,146 L116.1,154 L106,154 L106,158 L86,158 Z M190,258 L524,258 L524,266 L190,266 Z',
		{ x: 26, y: 44, w: 648, h: 222 }
	),
	realMailVanWindows: realPart(
		'realMailVanWindows',
		'glass',
		'face',
		'mail-van',
		'M112,164 L164,94 L190,102 L132,170 Z M201,100 L247,100 Q252,100 252,105 L252,151 Q252,156 247,156 L201,156 Q196,156 196,151 L196,105 Q196,100 201,100 Z',
		{ x: 112, y: 94, w: 140, h: 76 }
	),
	realMailVanDoor: realPart(
		'realMailVanDoor',
		'trim',
		'detail',
		'mail-van',
		'M272,104 L422,104 L422,236 L272,236 Z',
		{ x: 272, y: 104, w: 150, h: 132 }
	),
	realMailVanWheel: realPart(
		'realMailVanWheel',
		'rubber',
		'locomotion',
		'mail-van',
		'M116,236 A34,34 0 1 1 184,236 A34,34 0 1 1 116,236 Z',
		{ x: 116, y: 202, w: 68, h: 68 }
	),
	realCamperBody: realPart(
		'realCamperBody',
		'shell',
		'body',
		'camper',
		'M52,252 Q44,252 44,244 L44,156 Q44,138 52,126 Q60,114 78,108 Q94,102 120,98 L150,98 L146,64 Q146,46 160,46 L580,46 Q594,46 594,64 L590,98 L650,98 Q682,98 682,120 L682,244 Q682,252 674,252 Z M24,238 L44,238 L44,258 L24,258 Z M682,240 L700,240 L700,258 L682,258 Z M10,120 L30,120 L30,152 L10,152 Z M30,130 L46,130 L46,138 L30,138 Z M220,28 L520,28 L520,33 L220,33 Z M234,33 L239,33 L239,46 L234,46 Z M314,33 L319,33 L319,46 L314,46 Z M394,33 L399,33 L399,46 L394,46 Z M474,33 L479,33 L479,46 L474,46 Z M108,252 L120,252 A34,34 0 0 0 122.505,256 L108,256 Z M177.495,256 A34,34 0 0 1 180,252 L525,252 L530,252 A34,34 0 0 0 532.505,256 Z M250,256 L338,256 L338,258 L250,258 Z M590,252 A34,34 0 0 1 587.495,256 L628,256 L628,252 Z',
		{ x: 10, y: 28, w: 690, h: 230 }
	),
	realCamperWindows: realPart(
		'realCamperWindows',
		'glass',
		'face',
		'camper',
		'M62,124 L86,124 Q92,124 92,130 L92,172 Q92,178 86,178 L62,178 Q56,178 56,172 L56,130 Q56,124 62,124 Z M113,112 L183,112 Q190,112 190,119 L190,163 Q190,170 183,170 L113,170 Q106,170 106,163 L106,119 Q106,112 113,112 Z M272,128 L318,128 Q322,128 322,132 L322,164 Q322,168 318,168 L272,168 Q268,168 268,164 L268,132 Q268,128 272,128 Z M359,124 L465,124 Q470,124 470,129 L470,165 Q470,170 465,170 L359,170 Q354,170 354,165 L354,129 Q354,124 359,124 Z M565,124 L643,124 Q648,124 648,129 L648,165 Q648,170 643,170 L565,170 Q560,170 560,165 L560,129 Q560,124 565,124 Z',
		{ x: 56, y: 112, w: 592, h: 66 }
	),
	realCamperDoor: realPart(
		'realCamperDoor',
		'trim',
		'detail',
		'camper',
		'M248,176 L340,176 L340,252 L248,252 Z',
		{ x: 248, y: 176, w: 92, h: 76 }
	),
	realCamperWheel: realPart(
		'realCamperWheel',
		'rubber',
		'locomotion',
		'camper',
		'M116,236 A34,34 0 1 1 184,236 A34,34 0 1 1 116,236 Z',
		{ x: 116, y: 202, w: 68, h: 68 }
	),
	realDeliveryVanBody: realPart(
		'realDeliveryVanBody',
		'shell',
		'body',
		'delivery-van',
		'M36,258 L36,196 Q36,186 46,182 L84,178 L140,98 Q144,88 156,88 L676,88 Q688,88 688,102 L688,244 Q688,258 672,258 Z M302,88 L306,74 Q308,72 312,72 L360,72 Q364,72 366,74 L370,88 Z M78,110 L100,110 L100,124 L119,128 L113.4,136 L100,132 L100,146 L78,146 Z M24,236 L36,236 L36,258 L24,258 Z M688,244 L700,244 L700,256 L688,256 Z M206,258 L514,258 L514,264 L206,264 Z',
		{ x: 24, y: 72, w: 676, h: 192 }
	),
	realDeliveryVanWindows: realPart(
		'realDeliveryVanWindows',
		'glass',
		'face',
		'delivery-van',
		'M94,171 L136.6,110 L151.3,120.2 L109,182 Z M178,104 L218,104 Q224,104 224,110 L224,152 Q224,158 218,158 L178,158 Q172,158 172,152 L172,110 Q172,104 178,104 Z',
		{ x: 94, y: 104, w: 130, h: 78 }
	),
	realDeliveryVanDoor: realPart(
		'realDeliveryVanDoor',
		'trim',
		'detail',
		'delivery-van',
		'M232,106 L378,106 L378,234 L232,234 Z',
		{ x: 232, y: 106, w: 146, h: 128 }
	),
	realDeliveryVanWheel: realPart(
		'realDeliveryVanWheel',
		'rubber',
		'locomotion',
		'delivery-van',
		'M116,236 A34,34 0 1 1 184,236 A34,34 0 1 1 116,236 Z',
		{ x: 116, y: 202, w: 68, h: 68 }
	),
	realArmouredVanBody: realPart(
		'realArmouredVanBody',
		'shell',
		'body',
		'armoured-van',
		'M44,250 L44,196 Q44,188 52,184 L88,172 L134,96 Q138,88 148,88 L176,88 L176,64 Q176,56 186,56 L672,56 Q684,56 684,68 L684,250 Z M408,42 L492,42 L492,56 L408,56 Z M22,230 L44,230 L44,264 L22,264 Z M684,238 L704,238 L704,266 L684,266 Z M190,250 L526,250 L526,259 L190,259 Z M92,106 L110,106 L110,132 L92,132 Z M110,117 L121,117 L117.4,123 L110,123 Z',
		{ x: 22, y: 42, w: 682, h: 224 }
	),
	realArmouredVanWindows: realPart(
		'realArmouredVanWindows',
		'glass',
		'face',
		'armoured-van',
		'M92,168 L130,106 L148,114 L110,176 Z M156,102 L168,102 Q172,102 172,106 L172,144 Q172,148 168,148 L156,148 Q152,148 152,144 L152,106 Q152,102 156,102 Z',
		{ x: 92, y: 102, w: 80, h: 74 }
	),
	realArmouredVanDoor: realPart(
		'realArmouredVanDoor',
		'trim',
		'detail',
		'armoured-van',
		'M300,92 L392,92 L392,238 L300,238 Z',
		{ x: 300, y: 92, w: 92, h: 146 }
	),
	realArmouredVanWheel: realPart(
		'realArmouredVanWheel',
		'rubber',
		'locomotion',
		'armoured-van',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realAmbulanceBody: realPart(
		'realAmbulanceBody',
		'shell',
		'body',
		'ambulance',
		'M36,258 L36,178 Q36,170 44,166 L86,154 L158,96 Q162,88 172,88 L236,88 L236,62 Q236,56 244,56 L656,56 Q668,56 668,68 L668,244 Q668,258 654,258 Z M252,40 L372,40 L372,56 L252,56 Z M18,230 L36,230 L36,258 L18,258 Z M18,146 L36,146 L36,186 L18,186 Z M668,236 L686,236 L686,256 L668,256 Z M200,258 L540,258 L540,268 L200,268 Z',
		{ x: 18, y: 40, w: 668, h: 228 }
	),
	realAmbulanceWindows: realPart(
		'realAmbulanceWindows',
		'glass',
		'face',
		'ambulance',
		'M102,172 L158,98 L188,102 L134,176 Z M197,102 L227,102 Q232,102 232,107 L232,147 Q232,152 227,152 L197,152 Q192,152 192,147 L192,107 Q192,102 197,102 Z M542,116 L588,116 Q594,116 594,122 L594,156 Q594,162 588,162 L542,162 Q536,162 536,156 L536,122 Q536,116 542,116 Z',
		{ x: 102, y: 98, w: 492, h: 78 }
	),
	realAmbulanceDoor: realPart(
		'realAmbulanceDoor',
		'trim',
		'detail',
		'ambulance',
		'M416,104 L512,104 L512,226 L416,226 Z',
		{ x: 416, y: 104, w: 96, h: 122 }
	),
	realAmbulanceWheel: realPart(
		'realAmbulanceWheel',
		'rubber',
		'locomotion',
		'ambulance',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realRemovalsVanBody: realPart(
		'realRemovalsVanBody',
		'shell',
		'body',
		'removals-van',
		'M24,258 L24,124 Q24,106 42,102 L112,102 L112,34 Q112,32 118,32 L744,32 Q756,32 756,44 L756,240 L196,240 L196,258 Z M196,240 L756,240 L756,258 L196,258 Z M214,18 L742,18 L742,26 L214,26 Z M226,26 L234,26 L234,32 L226,32 Z M722,26 L730,26 L730,32 L722,32 Z M6,112 L24,112 L24,148 L6,148 Z M8,244 L24,244 L24,266 L8,266 Z M94,258 L126,258 L126,268 L94,268 Z M756,246 L770,246 L770,264 L756,264 Z',
		{ x: 6, y: 18, w: 764, h: 250 }
	),
	realRemovalsVanWindows: realPart(
		'realRemovalsVanWindows',
		'glass',
		'face',
		'removals-van',
		'M45,112 L123,112 Q132,112 132,121 L132,165 Q132,174 123,174 L45,174 Q36,174 36,165 L36,121 Q36,112 45,112 Z M145,110 L181,110 Q186,110 186,115 L186,153 Q186,158 181,158 L145,158 Q140,158 140,153 L140,115 Q140,110 145,110 Z',
		{ x: 36, y: 110, w: 150, h: 64 }
	),
	realRemovalsVanDoor: realPart(
		'realRemovalsVanDoor',
		'trim',
		'detail',
		'removals-van',
		'M470,94 L562,94 L562,208 L470,208 Z',
		{ x: 470, y: 94, w: 92, h: 114 }
	),
	realRemovalsVanWheel: realPart(
		'realRemovalsVanWheel',
		'rubber',
		'locomotion',
		'removals-van',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realPoliceVanBody: realPart(
		'realPoliceVanBody',
		'shell',
		'body',
		'police-van',
		'M30,258 L30,202 Q30,192 40,189 L80,182 L118,98 Q122,88 134,88 L676,88 Q690,88 690,102 L690,242 Q690,258 674,258 Z M161,60 L301,60 Q306,60 306,65 L306,88 L156,88 L156,65 Q156,60 161,60 Z M16,236 L30,236 L30,262 L16,262 Z M690,240 L702,240 L702,258 L690,258 Z M62,122 L80,122 L80,158 L62,158 Z M80,138 L99.9,138 L93.6,152 L80,152 Z M190,258 L540,258 L540,266 L190,266 Z',
		{ x: 16, y: 60, w: 686, h: 206 }
	),
	realPoliceVanWindows: realPart(
		'realPoliceVanWindows',
		'glass',
		'face',
		'police-van',
		'M94,172 L120,110 L148,116 L122,180 Z M171,106 L223,106 Q228,106 228,111 L228,153 Q228,158 223,158 L171,158 Q166,158 166,153 L166,111 Q166,106 171,106 Z M249,116 L279,116 Q282,116 282,119 L282,153 Q282,156 279,156 L249,156 Q246,156 246,153 L246,119 Q246,116 249,116 Z M451,116 L481,116 Q484,116 484,119 L484,153 Q484,156 481,156 L451,156 Q448,156 448,153 L448,119 Q448,116 451,116 Z M615,116 L634,116 Q636,116 636,118 L636,146 Q636,148 634,148 L615,148 Q613,148 613,146 L613,118 Q613,116 615,116 Z M647,116 L666,116 Q668,116 668,118 L668,146 Q668,148 666,148 L647,148 Q645,148 645,146 L645,118 Q645,116 647,116 Z',
		{ x: 94, y: 106, w: 574, h: 74 }
	),
	realPoliceVanDoor: realPart(
		'realPoliceVanDoor',
		'trim',
		'detail',
		'police-van',
		'M300,108 L426,108 L426,250 L300,250 Z',
		{ x: 300, y: 108, w: 126, h: 142 }
	),
	realPoliceVanWheel: realPart(
		'realPoliceVanWheel',
		'rubber',
		'locomotion',
		'police-van',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realPickupBody: realPart(
		'realPickupBody',
		'shell',
		'body',
		'pickup',
		'M42,244 L42,198 Q42,190 52,186 L62,184 Q68,172 86,170 L198,165 L206,176 L242,118 Q246,112 258,112 L324,112 Q337,112 339,125 L341,190 L654,190 L654,244 Z M24,240 L42,240 L42,252 L24,252 Z M348,154 L654,154 L654,190 L348,190 Z M654,154 L676,154 L676,248 L654,248 Z M654,248 L678,248 L678,260 L654,260 Z M196,146 L208,146 L208,164 L196,164 Z M42,244 L654,244 L654,264 L42,264 Z',
		{ x: 24, y: 112, w: 654, h: 152 }
	),
	realPickupWindows: realPart(
		'realPickupWindows',
		'glass',
		'face',
		'pickup',
		'M208,171 L244,119 L257,119 L257,171 Z M268,119 L308,119 Q313,119 313,124 L313,160 Q313,165 308,165 L268,165 Q263,165 263,160 L263,124 Q263,119 268,119 Z M320,124 L331,124 Q336,124 336,129 L336,155 Q336,160 331,160 L320,160 Q315,160 315,155 L315,129 Q315,124 320,124 Z',
		{ x: 208, y: 119, w: 128, h: 52 }
	),
	realPickupDoor: realPart(
		'realPickupDoor',
		'trim',
		'detail',
		'pickup',
		'M264,170 L318,170 L318,242 L264,242 Z',
		{ x: 264, y: 170, w: 54, h: 72 }
	),
	realPickupWheel: realPart(
		'realPickupWheel',
		'rubber',
		'locomotion',
		'pickup',
		'M116,236 A34,34 0 1 1 184,236 A34,34 0 1 1 116,236 Z',
		{ x: 116, y: 202, w: 68, h: 68 }
	),
	realPoliceCarBody: realPart(
		'realPoliceCarBody',
		'shell',
		'body',
		'police-car',
		'M48,252 L48,212 Q48,200 58,198 L188,186 L196,185 L272,126 Q276,122 286,122 L390,122 Q400,122 404,128 L456,180 Q462,186 472,186 L588,186 Q606,186 606,200 L606,252 Z M292,115 L384,115 L384,122 L292,122 Z M294,100 L382,100 L382,115 L294,115 Z M12,206 L32,206 L32,252 L12,252 Z M32,236 L48,236 L48,254 L32,254 Z M36,200 L48,200 L48,222 L36,222 Z M606,240 L622,240 L622,256 L606,256 Z M196,152 L212,152 L212,170 L196,170 Z M552,136 L590,136 L590,186 L552,186 Z',
		{ x: 12, y: 100, w: 610, h: 156 }
	),
	realPoliceCarWindows: realPart(
		'realPoliceCarWindows',
		'glass',
		'face',
		'police-car',
		'M214,172 L276,132 L296,141 L234,178 Z M311,136 L357,136 Q362,136 362,141 L362,165 Q362,170 357,170 L311,170 Q306,170 306,165 L306,141 Q306,136 311,136 Z M378,136 L400,136 L432,170 L378,170 Z',
		{ x: 214, y: 132, w: 218, h: 46 }
	),
	realPoliceCarDoor: realPart(
		'realPoliceCarDoor',
		'trim',
		'detail',
		'police-car',
		'M238,182 L374,182 L374,246 L238,246 Z',
		{ x: 238, y: 182, w: 136, h: 64 }
	),
	realPoliceCarWheel: realPart(
		'realPoliceCarWheel',
		'rubber',
		'locomotion',
		'police-car',
		'M108,240 A32,32 0 1 1 172,240 A32,32 0 1 1 108,240 Z',
		{ x: 108, y: 208, w: 64, h: 64 }
	),
	realTaxiBody: realPart(
		'realTaxiBody',
		'shell',
		'body',
		'taxi',
		'M16,244 L16,220 L34,220 L34,206 Q34,193 46,189 L148,174 Q180,170 196,166 L248,116 Q254,108 266,108 L292,108 L292,80 Q292,76 296,76 L360,76 Q364,76 364,80 L364,108 L398,107 Q412,107 420,115 L474,168 Q484,175 498,177 L582,181 Q616,183 616,199 L616,218 L634,218 L634,244 L616,244 L616,248 L540,248 A40,40 0 0 0 460,248 L180,248 A40,40 0 0 0 100,248 L34,248 L34,244 Z M182,140 Q182,138 184,138 L197,138 Q199,138 199,140 L199,160 Q199,162 197,162 L184,162 Q182,162 182,160 Z M199,148 L207,148 L207,152 L199,152 Z',
		{ x: 16, y: 76, w: 618, h: 172 }
	),
	realTaxiWindows: realPart(
		'realTaxiWindows',
		'glass',
		'face',
		'taxi',
		'M211,164 L252,120 L300,120 L300,164 Q300,168 296,168 L215,168 Q211,168 211,164 Z M315,120 L389,120 Q394,120 394,125 L394,163 Q394,168 389,168 L315,168 Q310,168 310,163 L310,125 Q310,120 315,120 Z M402,168 L402,128 L426,128 L463,168 Z',
		{ x: 211, y: 120, w: 252, h: 48 }
	),
	realTaxiDoor: realPart(
		'realTaxiDoor',
		'trim',
		'detail',
		'taxi',
		'M200,182 L334,182 L334,244 L200,244 Z',
		{ x: 200, y: 182, w: 134, h: 62 }
	),
	realTaxiWheel: realPart(
		'realTaxiWheel',
		'rubber',
		'locomotion',
		'taxi',
		'M108,240 A32,32 0 1 1 172,240 A32,32 0 1 1 108,240 Z',
		{ x: 108, y: 208, w: 64, h: 64 }
	),
	realLimousineBody: realPart(
		'realLimousineBody',
		'shell',
		'body',
		'limousine',
		'M46,250 L46,204 Q46,194 58,191 L204,177 Q214,174 219,169 L253,124 Q259,118 269,118 L666,118 Q676,118 681,126 L714,171 L790,171 Q798,171 798,179 L798,236 Q798,250 784,250 Z M32,222 L46,222 L46,248 L32,248 Z M798,234 L812,234 L812,254 L798,254 Z M712,250 L730,250 L730,256 L712,256 Z',
		{ x: 32, y: 118, w: 780, h: 138 }
	),
	realLimousineWindows: realPart(
		'realLimousineWindows',
		'glass',
		'face',
		'limousine',
		'M278,126 L348,126 Q352,126 352,130 L352,164 Q352,168 348,168 L246,168 Z M373,126 L483,126 Q488,126 488,131 L488,163 Q488,168 483,168 L373,168 Q368,168 368,163 L368,131 Q368,126 373,126 Z M509,126 L615,126 Q620,126 620,131 L620,163 Q620,168 615,168 L509,168 Q504,168 504,163 L504,131 Q504,126 509,126 Z',
		{ x: 246, y: 126, w: 374, h: 42 }
	),
	realLimousineDoor: realPart(
		'realLimousineDoor',
		'trim',
		'detail',
		'limousine',
		'M504,176 L616,176 L616,248 L504,248 Z',
		{ x: 504, y: 176, w: 112, h: 72 }
	),
	realLimousineWheel: realPart(
		'realLimousineWheel',
		'rubber',
		'locomotion',
		'limousine',
		'M118,240 A32,32 0 1 1 182,240 A32,32 0 1 1 118,240 Z',
		{ x: 118, y: 208, w: 64, h: 64 }
	),
	realRaceCarBody: realPart(
		'realRaceCarBody',
		'shell',
		'body',
		'race-car',
		'M22,248 L22,226 Q22,218 32,216 L96,204 L168,194 L214,190 L260,152 Q263,149 268,149 L334,149 Q340,149 344,154 L390,190 L486,196 L540,202 L618,202 Q640,203 645,218 L648,240 Q649,248 640,248 Z M556,126 L654,126 L654,140 L556,140 Z M548,116 L556,116 L556,148 L548,148 Z M654,116 L662,116 L662,148 L654,148 Z M570,140 L577,140 L577,202 L570,202 Z M604,140 L611,140 L611,202 L604,202 Z M14,248 L102,248 L102,256 L22,256 Q14,256 14,248 Z M584,248 L640,248 L640,256 L584,256 Z',
		{ x: 14, y: 116, w: 648, h: 140 }
	),
	realRaceCarWindows: realPart(
		'realRaceCarWindows',
		'glass',
		'face',
		'race-car',
		'M220,189 L254,157 L274,157 L240,189 Z M285,157 L329,157 Q334,157 334,162 L334,184 Q334,189 329,189 L285,189 Q280,189 280,184 L280,162 Q280,157 285,157 Z',
		{ x: 220, y: 157, w: 114, h: 32 }
	),
	realRaceCarDoor: realPart(
		'realRaceCarDoor',
		'trim',
		'detail',
		'race-car',
		'M302,198 L364,198 L364,242 L302,242 Z',
		{ x: 302, y: 198, w: 62, h: 44 }
	),
	realRaceCarWheel: realPart(
		'realRaceCarWheel',
		'rubber',
		'locomotion',
		'race-car',
		'M110,244 A30,30 0 1 1 170,244 A30,30 0 1 1 110,244 Z',
		{ x: 110, y: 214, w: 60, h: 60 }
	),

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
	realMobileLibraryWheel: 'Wheel',
	realMobileClinicBody: 'Mobile clinic',
	realMobileClinicWindows: 'Windows',
	realMobileClinicDoor: 'Door',
	realMobileClinicWheel: 'Wheel',
	realTrolleybusBody: 'Trolleybus',
	realTrolleybusWindows: 'Windows',
	realTrolleybusDoor: 'Door',
	realTrolleybusWheel: 'Wheel',
	realTramBody: 'Tram',
	realTramWindows: 'Windows',
	realTramDoor: 'Door',
	realTramWheel: 'Wheel',
	realMetroTrainBody: 'Metro train',
	realMetroTrainWindows: 'Windows',
	realMetroTrainDoor: 'Door',
	realMetroTrainWheel: 'Wheel',
	realLightRailTrainBody: 'Light-rail train',
	realLightRailTrainWindows: 'Windows',
	realLightRailTrainDoor: 'Door',
	realLightRailTrainWheel: 'Wheel',
	realMilkTankerBody: 'Milk tanker',
	realMilkTankerWindows: 'Windows',
	realMilkTankerDoor: 'Door',
	realMilkTankerWheel: 'Wheel',
	realDumpTruckBody: 'Dump truck',
	realDumpTruckWindows: 'Windows',
	realDumpTruckDoor: 'Door',
	realDumpTruckWheel: 'Wheel',
	realFlatbedLorryBody: 'Flatbed lorry',
	realFlatbedLorryWindows: 'Windows',
	realFlatbedLorryDoor: 'Door',
	realFlatbedLorryWheel: 'Wheel',
	realCraneTruckBody: 'Crane truck',
	realCraneTruckWindows: 'Windows',
	realCraneTruckDoor: 'Door',
	realCraneTruckWheel: 'Wheel',
	realCementMixerBody: 'Cement mixer',
	realCementMixerWindows: 'Windows',
	realCementMixerDoor: 'Door',
	realCementMixerWheel: 'Wheel',
	realTowTruckBody: 'Tow truck',
	realTowTruckWindows: 'Windows',
	realTowTruckDoor: 'Door',
	realTowTruckWheel: 'Wheel',
	realGarbageTruckBody: 'Garbage truck',
	realGarbageTruckWindows: 'Windows',
	realGarbageTruckDoor: 'Door',
	realGarbageTruckWheel: 'Wheel',
	realCarTransporterBody: 'Car transporter',
	realCarTransporterWindows: 'Windows',
	realCarTransporterDoor: 'Door',
	realCarTransporterWheel: 'Wheel',
	realRefrigeratedTruckBody: 'Refrigerated truck',
	realRefrigeratedTruckWindows: 'Windows',
	realRefrigeratedTruckDoor: 'Side door',
	realRefrigeratedTruckWheel: 'Wheel',
	realCurtainSideLorryBody: 'Curtain-side lorry',
	realCurtainSideLorryWindows: 'Windows',
	realCurtainSideLorryDoor: 'Cab door',
	realCurtainSideLorryWheel: 'Wheel',
	realParcelLorryBody: 'Parcel lorry',
	realParcelLorryWindows: 'Windows',
	realParcelLorryDoor: 'Side loading door',
	realParcelLorryWheel: 'Wheel',
	realLogTruckBody: 'Log truck',
	realLogTruckWindows: 'Windows',
	realLogTruckDoor: 'Door',
	realLogTruckWheel: 'Wheel',
	realLivestockTruckBody: 'Livestock truck',
	realLivestockTruckWindows: 'Windows',
	realLivestockTruckDoor: 'Side door',
	realLivestockTruckWheel: 'Wheel',
	realWaterTankerBody: 'Water tanker',
	realWaterTankerWindows: 'Windows',
	realWaterTankerDoor: 'Door',
	realWaterTankerWheel: 'Wheel',
	realFuelTankerBody: 'Fuel tanker',
	realFuelTankerWindows: 'Windows',
	realFuelTankerDoor: 'Door',
	realFuelTankerWheel: 'Wheel',
	realIceCreamVanBody: 'Ice-cream van',
	realIceCreamVanWindows: 'Windows',
	realIceCreamVanDoor: 'Door',
	realIceCreamVanWheel: 'Wheel',
	realMailVanBody: 'Mail van',
	realMailVanWindows: 'Windows',
	realMailVanDoor: 'Roll-up cargo door',
	realMailVanWheel: 'Wheel',
	realCamperBody: 'Camper',
	realCamperWindows: 'Windows',
	realCamperDoor: 'Side door',
	realCamperWheel: 'Wheel',
	realDeliveryVanBody: 'Delivery van',
	realDeliveryVanWindows: 'Windows',
	realDeliveryVanDoor: 'Sliding side door',
	realDeliveryVanWheel: 'Wheel',
	realArmouredVanBody: 'Armoured van',
	realArmouredVanWindows: 'Windows',
	realArmouredVanDoor: 'Reinforced side door',
	realArmouredVanWheel: 'Wheel',
	realAmbulanceBody: 'Ambulance',
	realAmbulanceWindows: 'Windows',
	realAmbulanceDoor: 'Side sliding door',
	realAmbulanceWheel: 'Wheel',
	realRemovalsVanBody: 'Removals van',
	realRemovalsVanWindows: 'Windows',
	realRemovalsVanDoor: 'Side loading door',
	realRemovalsVanWheel: 'Wheel',
	realPoliceVanBody: 'Police van',
	realPoliceVanWindows: 'Windows',
	realPoliceVanDoor: 'Sliding side door',
	realPoliceVanWheel: 'Wheel',
	realPickupBody: 'Pickup',
	realPickupWindows: 'Windows',
	realPickupDoor: 'Door',
	realPickupWheel: 'Wheel',
	realPoliceCarBody: 'Police car',
	realPoliceCarWindows: 'Windows',
	realPoliceCarDoor: 'Front door',
	realPoliceCarWheel: 'Wheel',
	realTaxiBody: 'Taxi',
	realTaxiWindows: 'Windows',
	realTaxiDoor: 'Front door',
	realTaxiWheel: 'Wheel',
	realLimousineBody: 'Limousine',
	realLimousineWindows: 'Windows',
	realLimousineDoor: 'Rear passenger door',
	realLimousineWheel: 'Wheel',
	realRaceCarBody: 'Race car',
	realRaceCarWindows: 'Canopy glass',
	realRaceCarDoor: 'Door',
	realRaceCarWheel: 'Wheel',

};

export function partName(part: PartId): string {
	return PART_NAMES[part];
}
