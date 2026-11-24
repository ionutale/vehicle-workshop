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
	| 'realRaceCarWheel'
	| 'realTractorBody'
	| 'realTractorWindows'
	| 'realTractorDoor'
	| 'realTractorWheel'
	| 'realBulldozerBody'
	| 'realBulldozerWindows'
	| 'realBulldozerDoor'
	| 'realBulldozerTracks'
	| 'realBulldozerBlade'
	| 'realForkliftBody'
	| 'realForkliftWindows'
	| 'realForkliftForks'
	| 'realForkliftWheel'
	| 'realRoadRollerBody'
	| 'realRoadRollerWindows'
	| 'realRoadRollerDoor'
	| 'realRoadRollerDrum'
	| 'realTelehandlerBody'
	| 'realTelehandlerWindows'
	| 'realTelehandlerDoor'
	| 'realTelehandlerWheel'
	| 'realSnowPloughBody'
	| 'realSnowPloughWindows'
	| 'realSnowPloughDoor'
	| 'realSnowPloughPlough'
	| 'realSnowPloughWheel'
	| 'realStreetSweeperBody'
	| 'realStreetSweeperWindows'
	| 'realStreetSweeperDoor'
	| 'realStreetSweeperWheel'
	| 'realMonsterTruckBody'
	| 'realMonsterTruckWindows'
	| 'realMonsterTruckDoor'
	| 'realMonsterTruckWheel'
	| 'realFoodTruckBody'
	| 'realFoodTruckWindows'
	| 'realFoodTruckDoor'
	| 'realFoodTruckWheel'
	| 'realCombineHarvesterBody'
	| 'realCombineHarvesterWindows'
	| 'realCombineHarvesterDoor'
	| 'realCombineHarvesterWheel'
	| 'realCombineHarvesterHeader'
	| 'realSkidSteerBody'
	| 'realSkidSteerWindows'
	| 'realSkidSteerBucket'
	| 'realSkidSteerWheel'
	| 'realBackhoeLoaderBody'
	| 'realBackhoeLoaderWindows'
	| 'realBackhoeLoaderBackhoe'
	| 'realBackhoeLoaderWheel'
	| 'realWheelLoaderBody'
	| 'realWheelLoaderWindows'
	| 'realWheelLoaderBucket'
	| 'realWheelLoaderWheel'
	| 'realMotorGraderBody'
	| 'realMotorGraderWindows'
	| 'realMotorGraderBlade'
	| 'realMotorGraderWheel'
	| 'realArticulatedHaulerBody'
	| 'realArticulatedHaulerWindows'
	| 'realArticulatedHaulerTipper'
	| 'realArticulatedHaulerWheel'
	| 'realCropSprayerBody'
	| 'realCropSprayerWindows'
	| 'realCropSprayerBoom'
	| 'realCropSprayerWheel'
	| 'realHayBalerBody'
	| 'realHayBalerBale'
	| 'realHayBalerDrawbar'
	| 'realHayBalerWheel'
	| 'realSteamRollerBody'
	| 'realSteamRollerCanopy'
	| 'realSteamRollerDrum'
	| 'realSteamRollerWheel'
	| 'realQuadBikeBody'
	| 'realQuadBikeSeat'
	| 'realQuadBikeRack'
	| 'realQuadBikeWheel'
	| 'realMiniDumperBody'
	| 'realMiniDumperSkip'
	| 'realMiniDumperSeat'
	| 'realMiniDumperWheel'
	| 'realVanBody'
	| 'realVanWindows'
	| 'realVanDoor'
	| 'realVanWheel'
	| 'realSkipLoaderBody'
	| 'realSkipLoaderWindows'
	| 'realSkipLoaderSkip'
	| 'realSkipLoaderWheel'
	| 'realHookLiftTruckBody'
	| 'realHookLiftTruckWindows'
	| 'realHookLiftTruckContainer'
	| 'realHookLiftTruckWheel'
	| 'realConcretePumpBody'
	| 'realConcretePumpWindows'
	| 'realConcretePumpBoom'
	| 'realConcretePumpWheel'
	| 'realGritterTruckBody'
	| 'realGritterTruckWindows'
	| 'realGritterTruckHopper'
	| 'realGritterTruckWheel'
	| 'realSnowBlowerBody'
	| 'realSnowBlowerWindows'
	| 'realSnowBlowerAuger'
	| 'realSnowBlowerWheel'
	| 'realRoadPlanerBody'
	| 'realRoadPlanerWindows'
	| 'realRoadPlanerDrum'
	| 'realRoadPlanerWheel'
	| 'realAsphaltPaverBody'
	| 'realAsphaltPaverWindows'
	| 'realAsphaltPaverScreed'
	| 'realAsphaltPaverWheel'
	| 'realSewerCleanerBody'
	| 'realSewerCleanerWindows'
	| 'realSewerCleanerReel'
	| 'realSewerCleanerWheel'
	| 'realAirportFuelBowserBody'
	| 'realAirportFuelBowserTank'
	| 'realAirportFuelBowserWindows'
	| 'realAirportFuelBowserWheel'
	| 'realAerialLadderBody'
	| 'realAerialLadderWindows'
	| 'realAerialLadderLadder'
	| 'realAerialLadderWheel'
	| 'realAirportFireTruckBody'
	| 'realAirportFireTruckWindows'
	| 'realAirportFireTruckMonitor'
	| 'realAirportFireTruckWheel'
	| 'realHazmatTruckBody'
	| 'realHazmatTruckWindows'
	| 'realHazmatTruckTank'
	| 'realHazmatTruckWheel'
	| 'realRescueTruckBody'
	| 'realRescueTruckWindows'
	| 'realRescueTruckShutter'
	| 'realRescueTruckWheel'
	| 'realCherryPickerBody'
	| 'realCherryPickerWindows'
	| 'realCherryPickerBoom'
	| 'realCherryPickerWheel'
	| 'realScissorLiftBody'
	| 'realScissorLiftScissor'
	| 'realScissorLiftPlatform'
	| 'realScissorLiftWheel'
	| 'realAllTerrainCraneBody'
	| 'realAllTerrainCraneWindows'
	| 'realAllTerrainCraneBoom'
	| 'realAllTerrainCraneWheel'
	| 'realSideLoaderGarbageBody'
	| 'realSideLoaderGarbageWindows'
	| 'realSideLoaderGarbageBin'
	| 'realSideLoaderGarbageWheel'
	| 'realRecyclingTruckBody'
	| 'realRecyclingTruckWindows'
	| 'realRecyclingTruckHopper'
	| 'realRecyclingTruckWheel'
	| 'realIceCreamTruckBody'
	| 'realIceCreamTruckWindows'
	| 'realIceCreamTruckHatch'
	| 'realIceCreamTruckWheel'
	| 'realMilkFloatBody'
	| 'realMilkFloatWindows'
	| 'realMilkFloatCrates'
	| 'realMilkFloatWheel';

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
	realTractorBody: realPart(
		'realTractorBody',
		'shell',
		'body',
		'tractor',
		'M30,244 L30,192 Q30,183 41,179 L54,175 Q62,167 76,165 L158,149 L164,148 L164,54 Q164,46 172,46 L184,46 Q192,46 192,54 L192,118 L197,127 Q199,132 205,135 L205,140 L231,63 Q234,55 244,55 L382,53 Q394,53 396,65 L398,168 L412,180 L432,186 Q440,168 456,162 Q500,154 544,162 Q562,170 568,186 L572,200 L572,244 L540,244 Q540,198 500,194 Q460,198 460,244 L192,244 Q192,201 150,197 Q108,201 108,244 L30,244 Z M18,208 L30,208 L30,244 L18,244 Z M250,244 L430,244 L430,262 L250,262 Z M574,237 L620,222 L622,229 L576,243 Z M556,244 L616,258 L614,266 L554,252 Z M616,263 A5,5 0 1 1 626,263 A5,5 0 1 1 616,263 Z M294,44 Q294,36 302,36 L308,36 Q316,36 316,44 L316,52 L294,52 Z',
		{ x: 18, y: 36, w: 608, h: 232 }
	),
	realTractorWindows: realPart(
		'realTractorWindows',
		'glass',
		'face',
		'tractor',
		'M212,131 L235,64 L250,64 L250,131 Z M255,63 L317,63 Q321,63 321,67 L321,125 Q321,129 317,129 L255,129 Q251,129 251,125 L251,67 Q251,63 255,63 Z M333,70 L381,70 Q384,70 384,73 L384,121 Q384,124 381,124 L333,124 Q330,124 330,121 L330,73 Q330,70 333,70 Z',
		{ x: 212, y: 63, w: 172, h: 68 }
	),
	realTractorDoor: realPart(
		'realTractorDoor',
		'trim',
		'detail',
		'tractor',
		'M254,136 L320,136 L320,214 L254,214 Z',
		{ x: 254, y: 136, w: 66, h: 78 }
	),
	realTractorWheel: realPart(
		'realTractorWheel',
		'rubber',
		'locomotion',
		'tractor',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realBulldozerBody: realPart(
		'realBulldozerBody',
		'shell',
		'body',
		'bulldozer',
		'M176,198 L176,150 L194,142 L222,142 L240,76 Q242,66 252,66 L312,66 L314,56 Q322,46 330,56 L332,66 L344,66 Q352,66 352,74 L352,128 L356,134 L468,143 L468,82 L494,82 L494,144 L562,150 L562,172 L616,172 L616,192 L600,198 L676,242 L690,238 L704,250 L700,266 L684,272 L660,266 L580,206 L562,198 Z M210,84 L224,84 L224,102 L210,102 Z',
		{ x: 176, y: 50, w: 528, h: 222 }
	),
	realBulldozerBlade: realPart(
		'realBulldozerBlade',
		'trim',
		'cargo',
		'bulldozer',
		'M176,164 L84,190 L22,182 Q8,180 10,260 L10,272 L84,272 L84,202 L176,182 Z',
		{ x: 9, y: 164, w: 168, h: 108 }
	),
	realBulldozerWindows: realPart(
		'realBulldozerWindows',
		'glass',
		'face',
		'bulldozer',
		'M238,82 L264,82 L264,126 L226,126 Z M276,82 Q276,78 282,78 L328,78 Q334,78 334,84 L334,106 Q334,112 328,112 L282,112 Q276,112 276,106 Z',
		{ x: 226, y: 78, w: 108, h: 48 }
	),
	realBulldozerDoor: realPart(
		'realBulldozerDoor',
		'trim',
		'detail',
		'bulldozer',
		'M274,120 L332,120 L332,176 L274,176 Z',
		{ x: 274, y: 120, w: 58, h: 56 }
	),
	realBulldozerTracks: realPart(
		'realBulldozerTracks',
		'rubber',
		'locomotion',
		'bulldozer',
		'M126,200 L442,200 Q472,200 472,230 L472,242 Q472,272 442,272 L126,272 Q96,272 96,242 L96,230 Q96,200 126,200 Z',
		{ x: 96, y: 200, w: 376, h: 72 }
	),
	realForkliftBody: realPart(
		'realForkliftBody',
		'shell',
		'body',
		'forklift',
		'M196,252 L196,204 Q196,196 204,194 L214,194 L214,150 Q214,142 222,142 L252,142 L252,172 L330,172 L330,124 Q330,118 338,118 L354,118 Q362,118 362,124 L362,148 L456,148 L456,140 L528,140 Q536,140 536,146 L536,252 L516,252 L516,236 A36,36 0 0 0 444,236 L444,252 Z M96,202 L96,50 Q96,44 102,44 L142,44 Q148,44 148,50 L148,202 Z M148,204 L148,190 L182,190 L182,204 Z M182,204 L196,204 L196,252 L182,252 Z M200,80 L200,62 Q200,56 206,56 L446,56 Q452,56 452,62 L452,80 Z M252,80 L264,80 L264,172 L252,172 Z M420,80 L434,80 L434,148 L420,148 Z M372,56 L372,48 Q372,42 380,42 L396,42 Q404,42 404,48 L404,56 Z M468,140 L468,112 L480,112 L480,140 Z M464,112 Q462,98 474,94 Q484,82 498,88 Q508,94 504,104 Q510,108 504,112 Z',
		{ x: 96, y: 42, w: 440, h: 210 }
	),
	realForkliftWindows: realPart(
		'realForkliftWindows',
		'glass',
		'face',
		'forklift',
		'M214,80 L252,80 L252,142 L226,142 Z',
		{ x: 214, y: 80, w: 38, h: 62 }
	),
	realForkliftForks: realPart(
		'realForkliftForks',
		'trim',
		'cargo',
		'forklift',
		'M74,182 L96,182 L96,252 L74,252 Z M28,236 L74,236 L74,248 L28,248 Z',
		{ x: 28, y: 182, w: 68, h: 70 }
	),
	realForkliftWheel: realPart(
		'realForkliftWheel',
		'rubber',
		'locomotion',
		'forklift',
		'M118,236 A32,32 0 1 1 182,236 A32,32 0 1 1 118,236 Z',
		{ x: 118, y: 204, w: 64, h: 64 }
	),
	realRoadRollerBody: realPart(
		'realRoadRollerBody',
		'shell',
		'body',
		'road-roller',
		'M176,174 A52,52 0 0 1 202.1,206 L338,206 L338,100 Q338,84 326,84 L228,84 Q212,86 208,102 L196,140 Q188,146 186,160 L176,174 Z M356,206 L356,166 Q356,150 372,146 L370,146 L370,88 L384,88 L384,146 L392,146 L392,126 Q392,112 408,108 L420,106 L420,104 L426,104 L426,96 L442,96 L442,104 L556,104 Q574,104 580,122 L580,146 L592,148 Q606,154 610,172 Q614,186 610,198 L610,214 L597.7,214 A44,44 0 0 0 514.3,214 L356,214 Z M338,160 L356,160 L356,206 L338,206 Z M296,84 L296,78 Q296,64 306,64 Q316,64 316,78 L316,84 Z M208,84 L208,76 L226,76 L226,84 Z M172,88 L188,88 L188,104 L172,104 Z M188,96 L206,100 L206,104 L188,100 Z M246,206 L282,206 L282,214 L246,214 Z',
		{ x: 172, y: 64, w: 438, h: 150 }
	),
	realRoadRollerWindows: realPart(
		'realRoadRollerWindows',
		'glass',
		'face',
		'road-roller',
		'M190,158 L200,112 Q203,100 215,98 L246,98 L246,158 Z M258,96 L322,96 Q328,96 328,102 L328,154 Q328,160 322,160 L258,160 Q252,160 252,154 L252,102 Q252,96 258,96 Z',
		{ x: 190, y: 96, w: 138, h: 64 }
	),
	realRoadRollerDoor: realPart(
		'realRoadRollerDoor',
		'trim',
		'detail',
		'road-roller',
		'M252,166 L324,166 L324,202 L252,202 Z',
		{ x: 252, y: 166, w: 72, h: 36 }
	),
	realRoadRollerDrum: realPart(
		'realRoadRollerDrum',
		'rubber',
		'locomotion',
		'road-roller',
		'M100,220 A52,52 0 1 1 204,220 A52,52 0 1 1 100,220 Z',
		{ x: 100, y: 168, w: 104, h: 104 }
	),
	realTelehandlerBody: realPart(
		'realTelehandlerBody',
		'shell',
		'body',
		'telehandler',
		'M150,252 L150,186 Q150,172 162,164 L182,152 Q190,146 200,146 L286,146 Q300,146 300,160 L300,252 Z M300,252 L300,206 L460,206 L460,252 Z M460,252 L460,160 L620,160 L620,252 Z M620,252 L620,178 Q620,170 628,170 L692,170 Q700,170 700,178 L700,252 Z M612,86 L80,124 L80,232 L24,232 L24,248 L104,248 L104,150.29 L612,114 Z M570,160 L612,160 L612,114 L570,117 Z M26,216 L80,216 L80,232 L26,232 Z M320,206 L336,206 L336,133.71 L320,134.86 Z M658,170 L658,154 Q658,148 664,148 L676,148 Q682,148 682,154 L682,170 Z M630,170 L630,130 L642,130 L642,170 Z M190,252 L202,252 L202,260 L226,260 L226,270 L190,270 Z M640,252 L652,252 L652,260 L674,260 L674,270 L640,270 Z',
		{ x: 24, y: 86, w: 676, h: 184 }
	),
	realTelehandlerWindows: realPart(
		'realTelehandlerWindows',
		'glass',
		'face',
		'telehandler',
		'M160,196 L162,172 Q163,166 169,162 L184,154 L184,196 Z M200,196 L200,160 Q200,154 208,154 L278,154 Q288,154 288,164 L288,190 Q288,196 280,196 Z',
		{ x: 160, y: 154, w: 128, h: 42 }
	),
	realTelehandlerDoor: realPart(
		'realTelehandlerDoor',
		'trim',
		'detail',
		'telehandler',
		'M200,202 L288,202 L288,246 L200,246 Z',
		{ x: 200, y: 202, w: 88, h: 44 }
	),
	realTelehandlerWheel: realPart(
		'realTelehandlerWheel',
		'rubber',
		'locomotion',
		'telehandler',
		'M110,236 A40,40 0 1 1 190,236 A40,40 0 1 1 110,236 Z',
		{ x: 110, y: 196, w: 80, h: 80 }
	),
	realSnowPloughBody: realPart(
		'realSnowPloughBody',
		'shell',
		'body',
		'snow-plough',
		'M124,252 L124,202 Q124,192 130,190 L146,112 Q149,98 164,98 L266,98 Q280,98 282,114 L282,150 L700,150 Q716,150 722,164 L742,236 L742,252 Z M282,84 L304,84 L304,103 L282,103 Z M282,104 L293,104 L293,148 L282,148 Z M206,86 L240,86 L240,98 L206,98 Z M112,114 L128,114 L128,148 L112,148 Z M110,212 L124,212 L124,256 L110,256 Z M126,252 L198,252 L198,266 L126,266 Z M214,252 L646,252 L646,266 L214,266 Z M662,252 L744,252 L744,266 L662,266 Z M198,252 L214,252 L214,272 L198,272 Z M646,252 L662,252 L662,272 L646,272 Z M744,232 L760,232 L760,256 L744,256 Z',
		{ x: 110, y: 84, w: 650, h: 188 }
	),
	realSnowPloughWindows: realPart(
		'realSnowPloughWindows',
		'glass',
		'face',
		'snow-plough',
		'M134,184 L134,172 Q134,162 139,154 L151,120 Q154,112 162,112 L190,112 Q198,112 198,120 L198,176 Q198,184 190,184 Z M208,114 Q208,108 216,108 L260,108 Q268,108 268,116 L268,170 Q268,176 262,176 L216,176 Q208,176 208,168 Z',
		{ x: 134, y: 108, w: 134, h: 76 }
	),
	realSnowPloughDoor: realPart(
		'realSnowPloughDoor',
		'trim',
		'detail',
		'snow-plough',
		'M208,184 L266,184 L266,248 L208,248 Z',
		{ x: 208, y: 184, w: 58, h: 64 }
	),
	realSnowPloughPlough: realPart(
		'realSnowPloughPlough',
		'shell',
		'cargo',
		'snow-plough',
		'M30,120 L92,136 Q102,139 102,152 L104,252 Q104,266 90,268 L32,268 Q18,268 16,254 L8,190 Q6,176 16,166 Z M29,75 L39,75 L39,119 L29,119 Z M83,93 L93,93 L93,133 L83,133 Z M104,180 L126,196 L126,203 L104,204 Z M104,222 L112,224 L111,231 L104,229 Z',
		{ x: 7, y: 75, w: 120, h: 194 }
	),
	realSnowPloughWheel: realPart(
		'realSnowPloughWheel',
		'rubber',
		'locomotion',
		'snow-plough',
		'M112,236 A38,38 0 1 1 188,236 A38,38 0 1 1 112,236 Z',
		{ x: 112, y: 198, w: 76, h: 76 }
	),
	realStreetSweeperBody: realPart(
		'realStreetSweeperBody',
		'shell',
		'body',
		'street-sweeper',
		'M36,246 L36,168 Q36,156 45,148 L70,118 Q78,100 96,100 L200,100 L200,112 L656,112 Q684,112 690,132 L690,246 L112,246 L112,226 L36,226 Z M144,100 L144,92 L152,92 Q152,80 164,80 Q176,80 176,92 L184,92 L184,100 Z M20,146 L36,146 L36,186 L20,186 Z M20,218 L36,218 L36,256 L20,256 Z M690,226 L716,226 L716,256 L690,256 Z M216,112 L216,96 Q216,84 230,84 L254,84 L254,80 L274,80 L274,84 L316,84 Q330,84 330,96 L330,112 Z M566,112 L566,102 Q566,96 574,96 L640,96 Q648,96 648,102 L648,112 Z M300,246 L352,246 L356,256 L362,263 L288,263 L294,256 Z M38,248 A22,22 0 1 1 82,248 A22,22 0 1 1 38,248 Z M84,242 A16,16 0 1 1 116,242 A16,16 0 1 1 84,242 Z',
		{ x: 20, y: 80, w: 696, h: 190 }
	),
	realStreetSweeperWindows: realPart(
		'realStreetSweeperWindows',
		'glass',
		'face',
		'street-sweeper',
		'M52,160 L52,148 Q52,138 60,130 L82,110 Q88,104 100,104 L116,104 Q124,104 124,112 L124,152 Q124,160 116,160 Z M140,110 L182,110 Q188,110 188,116 L188,152 Q188,158 182,158 L140,158 Q134,158 134,152 L134,116 Q134,110 140,110 Z',
		{ x: 52, y: 104, w: 136, h: 56 }
	),
	realStreetSweeperDoor: realPart(
		'realStreetSweeperDoor',
		'trim',
		'detail',
		'street-sweeper',
		'M132,170 L194,170 L194,238 L132,238 Z',
		{ x: 132, y: 170, w: 62, h: 68 }
	),
	realStreetSweeperWheel: realPart(
		'realStreetSweeperWheel',
		'rubber',
		'locomotion',
		'street-sweeper',
		'M116,236 A34,34 0 1 1 184,236 A34,34 0 1 1 116,236 Z',
		{ x: 116, y: 202, w: 68, h: 68 }
	),
	realMonsterTruckBody: realPart(
		'realMonsterTruckBody',
		'shell',
		'body',
		'monster-truck',
		'M54,190 L54,150 Q54,142 64,138 L94,130 L146,124 Q158,124 164,116 L182,104 L196,96 Q202,88 212,84 L234,80 Q242,72 254,72 L326,72 Q338,72 340,84 L342,124 L348,130 L664,130 L664,190 L632,190 Q624,162 560,162 Q496,162 488,190 L216,190 Q208,162 150,162 Q92,162 84,190 Z M382,130 L382,80 Q382,60 402,60 L518,60 Q538,60 538,80 L538,130 L526,130 L526,80 Q526,72 518,72 L402,72 Q394,72 394,80 L394,130 Z M394,92 L526,92 L526,99 L394,99 Z M350,98 L358,98 L358,130 L350,130 Z M362,98 L370,98 L370,130 L362,130 Z M40,164 L54,164 L54,188 L40,188 Z M664,162 L682,162 L682,186 L664,186 Z M185.3,193.9 A44,44 0 0 1 185.3,278.1 A55,55 0 0 0 185.3,193.9 Z M594.8,193.4 A44,44 0 0 1 594.8,278.6 A55,55 0 0 0 594.8,193.4 Z M246,190 L500,190 L500,204 L246,204 Z M244,204 L256,204 L256,236 L244,236 Z M486,204 L498,204 L498,236 L486,236 Z',
		{ x: 40, y: 60, w: 642, h: 220 }
	),
	realMonsterTruckWindows: realPart(
		'realMonsterTruckWindows',
		'glass',
		'face',
		'monster-truck',
		'M212,120 L246,84 L256,84 L256,120 Z M266,84 Q266,80 270,80 L318,80 Q322,80 322,84 L322,116 Q322,120 318,120 L270,120 Q266,120 266,116 Z M328,88 Q328,85 331,85 L335,85 Q338,85 338,88 L338,116 Q338,119 335,119 L331,119 Q328,119 328,116 Z',
		{ x: 212, y: 80, w: 126, h: 40 }
	),
	realMonsterTruckDoor: realPart(
		'realMonsterTruckDoor',
		'trim',
		'detail',
		'monster-truck',
		'M258,128 L322,128 L322,184 L258,184 Z',
		{ x: 258, y: 128, w: 64, h: 56 }
	),
	realMonsterTruckWheel: realPart(
		'realMonsterTruckWheel',
		'rubber',
		'locomotion',
		'monster-truck',
		'M95,236 A55,55 0 1 1 205,236 A55,55 0 1 1 95,236 Z',
		{ x: 95, y: 181, w: 110, h: 110 }
	),
	realFoodTruckBody: realPart(
		'realFoodTruckBody',
		'shell',
		'body',
		'food-truck',
		'M36,258 L36,198 Q36,186 48,182 L86,176 L142,104 Q146,94 158,94 L674,94 Q688,94 688,108 L688,244 Q688,258 672,258 Z M296,44 L420,44 Q428,44 428,52 L428,94 L288,94 L288,52 Q288,44 296,44 Z M22,236 L36,236 L36,258 L22,258 Z M688,246 L702,246 L702,260 L688,260 Z M206,258 L512,258 L512,264 L206,264 Z',
		{ x: 22, y: 44, w: 680, h: 220 }
	),
	realFoodTruckWindows: realPart(
		'realFoodTruckWindows',
		'glass',
		'face',
		'food-truck',
		'M96,168 L138,114 L154,124 L112,176 Z M172,116 L214,116 Q220,116 220,122 L220,156 Q220,162 214,162 L172,162 Q166,162 166,156 L166,122 Q166,116 172,116 Z',
		{ x: 96, y: 114, w: 124, h: 62 }
	),
	realFoodTruckDoor: realPart(
		'realFoodTruckDoor',
		'trim',
		'detail',
		'food-truck',
		'M232,112 L356,112 L356,234 L232,234 Z',
		{ x: 232, y: 112, w: 124, h: 122 }
	),
	realFoodTruckWheel: realPart(
		'realFoodTruckWheel',
		'rubber',
		'locomotion',
		'food-truck',
		'M116,236 A34,34 0 1 1 184,236 A34,34 0 1 1 116,236 Z',
		{ x: 116, y: 202, w: 68, h: 68 }
	),
	realCombineHarvesterBody: realPart(
		'realCombineHarvesterBody',
		'shell',
		'body',
		'combine-harvester',
		'M148,264 L148,234 L244,194 L244,168 L250,164 L256,122 Q259,112 270,112 L382,118 Q392,118 396,112 L402,94 L402,54 L252,54 L252,100 L268,100 L268,74 L560,74 L560,62 Q560,56 566,56 L654,56 Q660,56 660,62 L660,74 L728,74 Q742,74 744,86 L748,152 Q750,162 762,164 L798,170 Q808,172 808,186 L808,200 L826,204 L884,208 Q894,210 894,224 L894,252 Q894,266 880,266 Z M228,124 L244,124 L244,158 L228,158 Z',
		{ x: 148, y: 54, w: 746, h: 212 }
	),
	realCombineHarvesterWindows: realPart(
		'realCombineHarvesterWindows',
		'glass',
		'face',
		'combine-harvester',
		'M269,128 L289,128 Q294,128 294,133 L294,179 Q294,184 289,184 L269,184 Q264,184 264,179 L264,133 Q264,128 269,128 Z M308,124 L380,124 Q386,124 386,130 L386,180 Q386,186 380,186 L308,186 Q302,186 302,180 L302,130 Q302,124 308,124 Z',
		{ x: 264, y: 124, w: 122, h: 62 }
	),
	realCombineHarvesterDoor: realPart(
		'realCombineHarvesterDoor',
		'trim',
		'detail',
		'combine-harvester',
		'M266,192 L362,192 L362,236 L266,236 Z',
		{ x: 266, y: 192, w: 96, h: 44 }
	),
	realCombineHarvesterWheel: realPart(
		'realCombineHarvesterWheel',
		'rubber',
		'locomotion',
		'combine-harvester',
		'M135,236 A45,45 0 1 1 225,236 A45,45 0 1 1 135,236 Z',
		{ x: 135, y: 191, w: 90, h: 90 }
	),
	realCombineHarvesterHeader: realPart(
		'realCombineHarvesterHeader',
		'trim',
		'cargo',
		'combine-harvester',
		'M14,270 L2,256 L10,234 Q14,226 26,224 L61,222 L61,206 A35,35 0 0 1 131,206 L134,222 L152,224 L152,246 Q152,270 136,270 Z',
		{ x: 2, y: 171, w: 150, h: 99 }
	),
	realSkidSteerBody: realPart(
		'realSkidSteerBody',
		'shell',
		'body',
		'skid-steer',
		'M96,252 L96,222 Q96,214 105,214 L122,199 L456,199 L470,146 L524,146 Q540,146 540,164 L540,238 Q540,252 528,252 L482,252 L482,236 A32,32 0 0 0 418,236 L418,252 L182,252 L182,236 A32,32 0 0 0 118,236 L118,252 Z M122,158 L300,148 L452,156 L452,199 L122,199 Z M230,98 L230,82 Q230,76 238,76 L408,76 Q416,76 416,82 L416,98 Z M236,98 L248,98 L248,148 L236,148 Z M306,98 L318,98 L318,146 L306,146 Z M400,98 L412,98 L412,151 L400,151 Z M326,146 L358,146 L358,118 Q358,106 346,106 L338,106 Q326,106 326,118 Z M362,146 L396,146 L396,104 Q396,100 392,100 L366,100 Q362,100 362,104 Z M236,76 L236,68 Q236,60 248,60 Q260,60 260,68 L260,76 Z M496,146 L496,118 L508,118 L508,146 Z M492,118 Q486,106 498,100 Q508,90 520,98 Q526,106 520,114 Q522,118 512,118 Z',
		{ x: 96, y: 60, w: 444, h: 192 }
	),
	realSkidSteerWindows: realPart(
		'realSkidSteerWindows',
		'glass',
		'face',
		'skid-steer',
		'M248,99 L306,99 L306,146 L248,149 Z',
		{ x: 248, y: 99, w: 58, h: 50 }
	),
	realSkidSteerBucket: realPart(
		'realSkidSteerBucket',
		'trim',
		'cargo',
		'skid-steer',
		'M122,154 L122,244 Q122,258 106,260 L48,265 Q28,265 26,248 Q22,204 34,168 L36,160 L112,154 Z',
		{ x: 25, y: 154, w: 97, h: 111 }
	),
	realSkidSteerWheel: realPart(
		'realSkidSteerWheel',
		'rubber',
		'locomotion',
		'skid-steer',
		'M122,236 A28,28 0 1 1 178,236 A28,28 0 1 1 122,236 Z',
		{ x: 122, y: 208, w: 56, h: 56 }
	),
	realBackhoeLoaderBody: realPart(
		'realBackhoeLoaderBody',
		'shell',
		'body',
		'backhoe-loader',
		'M112,264 L112,200 L102,196 L26,228 L14,232 L24,238 L14,242 L24,246 L14,250 L22,256 L20,264 Z M112,182 Q200,160 260,157 L352,162 L352,176 L260,172 Q170,190 112,210 Z M212,252 L212,206 Q212,188 226,186 L352,178 L352,148 L380,148 L380,176 L420,174 L420,252 Z M420,252 L420,174 L444,90 Q448,78 460,78 L552,78 Q560,78 560,88 L560,252 Z M560,252 L560,146 L630,146 Q646,146 648,158 L652,186 L664,194 L666,252 L644,252 Q644,192 600,190 Q560,192 560,252 Z M186,252 L186,262 L232,262 L236,268 L236,272 L266,272 L266,258 L634,258 L634,272 L664,272 L668,266 L668,262 L666,262 L666,252 Z M468,78 L468,60 Q468,54 474,54 L486,54 Q492,54 492,60 L492,78 Z M576,146 L576,88 L588,88 L588,146 Z',
		{ x: 13, y: 53, w: 656, h: 220 }
	),
	realBackhoeLoaderWindows: realPart(
		'realBackhoeLoaderWindows',
		'glass',
		'face',
		'backhoe-loader',
		'M426,188 L448,100 L468,100 L468,188 Z M472,96 L544,96 Q550,96 550,102 L550,194 Q550,200 544,200 L472,200 Z',
		{ x: 425, y: 95, w: 126, h: 106 }
	),
	realBackhoeLoaderBackhoe: realPart(
		'realBackhoeLoaderBackhoe',
		'trim',
		'cargo',
		'backhoe-loader',
		'M639,188 L711,118 L723,122 L747,210 L753,220 Q757,232 754,244 L751,251 L746,251 L743,258 L738,251 L733,251 L730,258 L725,251 L720,251 L717,258 L712,251 L707,251 Q701,250 702,242 Q705,235 714,230 Q722,226 727,221 L731,217 L735,213 L711,126 L723,131 L651,200 Z',
		{ x: 638, y: 117, w: 120, h: 142 }
	),
	realBackhoeLoaderWheel: realPart(
		'realBackhoeLoaderWheel',
		'rubber',
		'locomotion',
		'backhoe-loader',
		'M114,236 A36,36 0 1 1 186,236 A36,36 0 1 1 114,236 Z',
		{ x: 114, y: 200, w: 72, h: 72 }
	),
	realWheelLoaderBody: realPart(
		'realWheelLoaderBody',
		'shell',
		'body',
		'wheel-loader',
		'M118,160 L300,144 L308,138 L318,106 Q322,100 330,100 L430,100 Q440,100 440,110 L440,152 L520,152 L648,176 L660,144 L716,144 Q730,144 730,156 L730,240 Q730,252 718,252 L684,252 L684,248 Q684,184 620,184 Q556,184 556,248 L556,252 L224,252 L224,200 L118,182 Z M396,100 L396,86 Q396,82 401,82 L409,82 Q414,82 414,86 L414,100 Z M322,100 L322,90 Q322,86 327,86 L345,86 Q350,86 350,90 L350,100 Z M470,152 L470,118 L486,118 L486,152 Z M204,222 L224,222 L224,234 L204,234 Z',
		{ x: 118, y: 82, w: 612, h: 170 }
	),
	realWheelLoaderWindows: realPart(
		'realWheelLoaderWindows',
		'glass',
		'face',
		'wheel-loader',
		'M314,134 L324,108 L336,108 L336,134 Z M346,108 L420,108 Q428,108 428,116 L428,182 Q428,190 420,190 L346,190 Z',
		{ x: 314, y: 108, w: 114, h: 82 }
	),
	realWheelLoaderBucket: realPart(
		'realWheelLoaderBucket',
		'trim',
		'cargo',
		'wheel-loader',
		'M118,156 L118,242 Q118,262 100,268 L52,274 Q24,276 12,264 Q6,256 8,246 L16,190 Z',
		{ x: 7.5, y: 156, w: 110.5, h: 118.5 }
	),
	realWheelLoaderWheel: realPart(
		'realWheelLoaderWheel',
		'rubber',
		'locomotion',
		'wheel-loader',
		'M118,236 A42,42 0 1 1 202,236 A42,42 0 1 1 118,236 Z',
		{ x: 118, y: 194, w: 84, h: 84 }
	),
	realMotorGraderBody: realPart(
		'realMotorGraderBody',
		'shell',
		'body',
		'motor-grader',
		'M76,206 L76,182 Q76,166 92,163 L150,164 L420,160 Q470,118 520,124 L536,44 L646,44 Q658,44 658,56 L658,126 L770,126 Q786,126 786,140 L786,206 L695,206 L695,236 A35,35 0 0 1 630,254 A35,35 0 0 1 565,236 L565,206 Z M552,44 L552,34 Q552,26 560,26 L566,26 Q574,26 574,34 L574,44 Z M664,126 L664,88 Q664,82 670,82 L676,82 Q682,82 682,88 L682,126 Z',
		{ x: 76, y: 26, w: 710, h: 245 }
	),
	realMotorGraderWindows: realPart(
		'realMotorGraderWindows',
		'glass',
		'face',
		'motor-grader',
		'M528,116 L539,60 L566,60 L566,116 Z M580,60 L632,60 Q640,60 640,68 L640,96 Q640,104 632,104 L580,104 Q572,104 572,96 L572,68 Q572,60 580,60 Z',
		{ x: 528, y: 60, w: 112, h: 56 }
	),
	realMotorGraderBlade: realPart(
		'realMotorGraderBlade',
		'trim',
		'cargo',
		'motor-grader',
		'M300,210 L356,208 L362,192 L418,192 L424,208 L486,202 Q496,201 495,211 L493,250 Q492,260 482,262 L302,266 Q294,266 294,258 L296,216 Q296,210 300,210 Z',
		{ x: 294, y: 192, w: 201, h: 74 }
	),
	realMotorGraderWheel: realPart(
		'realMotorGraderWheel',
		'rubber',
		'locomotion',
		'motor-grader',
		'M126,236 A34,34 0 1 1 194,236 A34,34 0 1 1 126,236 Z',
		{ x: 126, y: 202, w: 68, h: 68 }
	),
	realArticulatedHaulerBody: realPart(
		'realArticulatedHaulerBody',
		'shell',
		'body',
		'articulated-hauler',
		'M22,262 L22,232 L40,230 L47,206 L62,198 L92,104 Q95,90 108,90 L232,90 Q244,90 244,102 L244,212 L282,218 L310,222 L322,224 L352,56 Q354,48 364,48 L740,68 Q752,70 752,82 L752,246 Q752,254 744,254 L332,254 L318,250 L288,244 L62,246 L40,256 Z M195,74 L215,74 L215,90 L195,90 Z M218,60 L232,60 L232,90 L218,90 Z M46,106 L68,106 L68,132 L46,132 Z',
		{ x: 22, y: 48, w: 730, h: 214 }
	),
	realArticulatedHaulerWindows: realPart(
		'realArticulatedHaulerWindows',
		'glass',
		'face',
		'articulated-hauler',
		'M78,170 L82,152 L102,112 Q106,104 116,104 L126,104 Q134,104 134,112 L134,162 Q134,170 126,170 Z M153,104 L231,104 Q238,104 238,111 L238,155 Q238,162 231,162 L153,162 Q146,162 146,155 L146,111 Q146,104 153,104 Z',
		{ x: 78, y: 104, w: 160, h: 66 }
	),
	realArticulatedHaulerTipper: realPart(
		'realArticulatedHaulerTipper',
		'trim',
		'cargo',
		'articulated-hauler',
		'M334,226 L360,48 L372,49 L384,40 L398,44 L412,38 L426,46 L440,40 L454,34 L468,40 L482,34 L496,31 L508,40 L524,33 L540,43 L556,36 L572,45 L588,42 L604,49 L620,42 L636,53 L652,47 L668,54 L684,51 L700,56 L716,55 L726,59 L734,68 L734,226 Z',
		{ x: 334, y: 31, w: 400, h: 195 }
	),
	realArticulatedHaulerWheel: realPart(
		'realArticulatedHaulerWheel',
		'rubber',
		'locomotion',
		'articulated-hauler',
		'M118,236 A42,42 0 1 1 202,236 A42,42 0 1 1 118,236 Z',
		{ x: 118, y: 194, w: 84, h: 84 }
	),
	realCropSprayerBody: realPart(
		'realCropSprayerBody',
		'shell',
		'body',
		'crop-sprayer',
		'M38,196 L38,170 Q38,159 50,156 L166,138 Q176,136 180,128 L212,62 Q214,56 222,56 L326,56 Q334,56 334,64 L334,118 L344,130 C348,104 360,88 386,86 L502,86 C528,86 542,98 546,122 L552,140 L562,150 L646,150 Q658,150 664,160 L668,196 L658,196 Q656,186 620,184 Q584,186 582,196 L206,196 Q204,186 160,184 Q116,186 114,196 Z M114,196 Q116,186 160,184 Q204,186 206,196 Z M582,196 Q584,186 620,184 Q656,186 658,196 Z M160,196 L620,196 L620,206 Q620,210 614,210 L166,210 Q160,210 160,206 Z M20,178 L38,178 L38,196 L20,196 Z M646,196 L686,196 L686,210 Q686,216 678,216 L654,216 Q646,216 646,210 Z M286,56 L286,48 Q286,40 294,40 L302,40 Q310,40 310,48 L310,56 Z M314,40 L326,40 L326,56 L314,56 Z M310,36 L330,36 L330,40 L310,40 Z M160,84 L182,84 L182,102 L173,102 L173,133 L167,133 L167,102 L160,102 Z M420,86 Q420,76 434,74 L466,74 Q476,76 476,86 Z M445,60 L452,60 L452,74 L445,74 Z M441,55 L456,55 L456,60 L441,60 Z M222,50 L236,50 L236,56 L222,56 Z',
		{ x: 20, y: 36, w: 666, h: 180 }
	),
	realCropSprayerWindows: realPart(
		'realCropSprayerWindows',
		'glass',
		'face',
		'crop-sprayer',
		'M191,124 L217,68 L241,68 L241,124 Z M251,70 L299,70 Q303,70 303,74 L303,116 Q303,120 299,120 L251,120 Q247,120 247,116 L247,74 Q247,70 251,70 Z M312,74 L325,74 Q328,74 328,77 L328,113 Q328,116 325,116 L312,116 Q309,116 309,113 L309,77 Q309,74 312,74 Z',
		{ x: 191, y: 68, w: 137, h: 56 }
	),
	realCropSprayerBoom: realPart(
		'realCropSprayerBoom',
		'trim',
		'cargo',
		'crop-sprayer',
		'M348,158 L766,158 Q778,158 778,164 Q778,170 766,170 L348,170 L342,164 Z M364,180 L744,180 Q754,180 754,185 Q754,191 744,191 L364,191 L358,185 Z M428,170 L448,170 L448,180 L428,180 Z M524,170 L544,170 L544,180 L524,180 Z M620,170 L640,170 L640,180 L620,180 Z M342,170 L356,170 L356,196 L342,196 Z M756,170 L770,170 L770,202 L756,202 Z M379,191 L393,191 L390,202 L382,202 Z M382.5,202 L389.5,202 L386,208 Z M439,191 L453,191 L450,202 L442,202 Z M442.5,202 L449.5,202 L446,208 Z M499,191 L513,191 L510,202 L502,202 Z M502.5,202 L509.5,202 L506,208 Z M559,191 L573,191 L570,202 L562,202 Z M562.5,202 L569.5,202 L566,208 Z M669,191 L683,191 L680,202 L672,202 Z M672.5,202 L679.5,202 L676,208 Z M729,191 L743,191 L740,202 L732,202 Z M732.5,202 L739.5,202 L736,208 Z',
		{ x: 342, y: 158, w: 436, h: 50 }
	),
	realCropSprayerWheel: realPart(
		'realCropSprayerWheel',
		'rubber',
		'locomotion',
		'crop-sprayer',
		'M122,236 A38,38 0 1 1 198,236 A38,38 0 1 1 122,236 Z',
		{ x: 122, y: 198, w: 76, h: 76 }
	),
	realHayBalerBody: realPart(
		'realHayBalerBody',
		'shell',
		'body',
		'hay-baler',
		'M58,252 L58,200 Q58,186 72,182 L96,176 L253.3,176 A78,78 0 0 1 407.8,196 L640,206 L648,196 L672,196 L676,206 L676,218 L600,222 L460,222 L430,252 Z',
		{ x: 58, y: 112, w: 618, h: 140 }
	),
	realHayBalerBale: realPart(
		'realHayBalerBale',
		'trim',
		'cargo',
		'hay-baler',
		'M558,160 A44,44 0 1 1 646,160 A44,44 0 1 1 558,160 Z',
		{ x: 558, y: 116, w: 88, h: 88 }
	),
	realHayBalerDrawbar: realPart(
		'realHayBalerDrawbar',
		'trim',
		'detail',
		'hay-baler',
		'M6,246 L58,240 L58,254 L6,258 Z M62,194 Q46,208 42,232 L51,234 Q56,212 68,200 Z',
		{ x: 6, y: 194, w: 62, h: 64 }
	),
	realHayBalerWheel: realPart(
		'realHayBalerWheel',
		'rubber',
		'locomotion',
		'hay-baler',
		'M118,236 A32,32 0 1 1 182,236 A32,32 0 1 1 118,236 Z',
		{ x: 118, y: 204, w: 64, h: 64 }
	),
	realSteamRollerBody: realPart(
		'realSteamRollerBody',
		'shell',
		'body',
		'steam-roller',
		'M196,252 L196,146 Q196,140 202,140 L266,140 Q282,150 302,150 L410,150 Q424,150 424,134 L472,134 L472,206 L596,206 L596,168 Q596,162 604,162 L640,162 Q648,162 648,170 L648,236 L636,252 Z M232,140 L234,88 Q234,80 230,78 L224,70 Q222,58 232,58 L262,58 Q272,58 270,70 L264,78 Q260,80 260,88 L262,140 Z M196,140 L196,114 Q196,108 202,108 L226,108 Q232,108 232,114 L232,140 Z M648,220 L658,220 L658,228 L666,228 L666,236 L648,236 Z M334,150 Q334,122 352,122 Q370,122 370,150 Z M392,129 L399,129 L399,150 L392,150 Z M436,124 L454,124 L454,134 L436,134 Z M512,206 L507,184 L502,179 L502,173 L496,173 L496,180 L500,184 L506,206 Z M534,206 L530,186 L522,186 L526,206 Z',
		{ x: 196, y: 58, w: 470, h: 194 }
	),
	realSteamRollerCanopy: realPart(
		'realSteamRollerCanopy',
		'trim',
		'detail',
		'steam-roller',
		'M444,120 Q444,100 464,100 L624,100 Q644,100 644,120 L644,132 L632,132 L632,162 L618,162 L618,132 L466,132 L466,206 L452,206 L452,132 L444,132 Z M552,132 L552,139 Q552,148 558,148 Q564,148 564,139 L564,132 Z',
		{ x: 444, y: 100, w: 200, h: 106 }
	),
	realSteamRollerDrum: realPart(
		'realSteamRollerDrum',
		'rubber',
		'locomotion',
		'steam-roller',
		'M112,224 A48,48 0 1 1 208,224 A48,48 0 1 1 112,224 Z',
		{ x: 112, y: 176, w: 96, h: 96 }
	),
	realSteamRollerWheel: realPart(
		'realSteamRollerWheel',
		'rubber',
		'locomotion',
		'steam-roller',
		'M530,242 A30,30 0 1 1 590,242 A30,30 0 1 1 530,242 Z',
		{ x: 530, y: 212, w: 60, h: 60 }
	),
	realQuadBikeBody: realPart(
		'realQuadBikeBody',
		'shell',
		'body',
		'quad-bike',
		'M76,208 L76,196 Q76,188 90,186 L158,186 Q172,185 176,196 L182,204 Q186,196 196,194 L202,194 L202,170 L196,172 Q189,173 188,169 Q187,164 194,163 L213,151 Q219,150 220,155 Q221,160 214,161 L209,162 L209,196 Q224,198 240,197 L262,199 Q268,200 270,205 L354,200 L360,190 L362,186 L436,186 Q454,186 454,200 Q454,216 438,222 L372,228 L354,234 L348,242 L210,242 L198,234 L94,228 Q80,226 78,216 Z M106,174 L180,174 L180,182 L162,182 L162,186 L152,186 L152,182 L118,182 L118,186 L108,186 L108,182 L106,182 Z M98.5,236 A31.5,31.5 0 1 1 161.5,236 A31.5,31.5 0 1 1 98.5,236 Z M368.5,236 A31.5,31.5 0 1 1 431.5,236 A31.5,31.5 0 1 1 368.5,236 Z',
		{ x: 76, y: 150, w: 378, h: 92 }
	),
	realQuadBikeSeat: realPart(
		'realQuadBikeSeat',
		'trim',
		'detail',
		'quad-bike',
		'M272,164 L348,164 L348,202 L272,202 Z',
		{ x: 272, y: 164, w: 76, h: 38 }
	),
	realQuadBikeRack: realPart(
		'realQuadBikeRack',
		'trim',
		'cargo',
		'quad-bike',
		'M362,174 L452,174 L452,182 L448,182 L448,186 L438,186 L438,182 L382,182 L382,186 L372,186 L372,182 L362,182 Z',
		{ x: 362, y: 174, w: 90, h: 12 }
	),
	realQuadBikeWheel: realPart(
		'realQuadBikeWheel',
		'rubber',
		'locomotion',
		'quad-bike',
		'M100,236 A30,30 0 1 1 160,236 A30,30 0 1 1 100,236 Z',
		{ x: 100, y: 206, w: 60, h: 60 }
	),
	realMiniDumperBody: realPart(
		'realMiniDumperBody',
		'shell',
		'body',
		'mini-dumper',
		'M170,250 L170,204 L222,196 L292,194 L302,184 L316,172 Q326,166 336,174 L342,184 L342,200 L352,198 L352,194 L430,190 L430,178 L520,166 L544,166 L544,144 L556,144 L556,165 L566,164 L566,250 L498,250 L498,236 A38,38 0 0 0 422,236 L422,250 Z M542,144 Q536,132 548,127 Q560,119 568,127 Q575,135 568,144 Z',
		{ x: 170, y: 120, w: 406, h: 132 }
	),
	realMiniDumperSkip: realPart(
		'realMiniDumperSkip',
		'trim',
		'cargo',
		'mini-dumper',
		'M50,206 L50,156 L236,138 L236,198 L150,202 Z',
		{ x: 48, y: 136, w: 190, h: 72 }
	),
	realMiniDumperSeat: realPart(
		'realMiniDumperSeat',
		'trim',
		'detail',
		'mini-dumper',
		'M334,174 L390,172 L390,188 L334,190 Z M390,184 L414,182 L414,130 Q414,124 408,124 L398,124 Q390,124 390,130 Z M334,190 L390,188 L390,204 L334,206 Z M468,180 L468,120 Q468,108 480,108 L510,108 Q522,108 522,120 L522,174 L508,174 L508,124 L482,126 L482,180 Z M462,180 L488,180 L488,188 L462,188 Z M502,180 L528,180 L528,188 L502,188 Z M486,108 L504,108 L504,100 L486,100 Z M488,100 L502,100 L500,92 Q495,88 488,92 Z',
		{ x: 334, y: 86, w: 194, h: 122 }
	),
	realMiniDumperWheel: realPart(
		'realMiniDumperWheel',
		'rubber',
		'locomotion',
		'mini-dumper',
		'M110,236 A30,30 0 1 1 170,236 A30,30 0 1 1 110,236 Z',
		{ x: 110, y: 206, w: 60, h: 60 }
	),
	realVanBody: realPart(
		'realVanBody',
		'shell',
		'body',
		'van',
		'M46,204 L46,158 Q46,146 52,138 L64,130 Q72,126 80,120 L134,64 Q138,56 148,56 L520,56 Q532,56 532,68 L532,196 Q532,204 524,204 Z M280,56 L285,46 L325,46 L330,56 Z M50,92 L70,92 L70,120 L50,120 Z M32,184 L46,184 L46,208 L32,208 Z M532,188 L546,188 L546,204 L532,204 Z M190,204 L380,204 L380,210 L190,210 Z',
		{ x: 32, y: 46, w: 514, h: 164 }
	),
	realVanWindows: realPart(
		'realVanWindows',
		'glass',
		'face',
		'van',
		'M86,114 L134,66 L146,77 L98,125 Z M156,76 L194,76 Q200,76 200,82 L200,112 Q200,118 194,118 L156,118 Q150,118 150,112 L150,82 Q150,76 156,76 Z',
		{ x: 86, y: 66, w: 114, h: 59 }
	),
	realVanDoor: realPart(
		'realVanDoor',
		'trim',
		'detail',
		'van',
		'M212,76 L356,76 L356,198 L212,198 Z',
		{ x: 212, y: 76, w: 144, h: 122 }
	),
	realVanWheel: realPart(
		'realVanWheel',
		'rubber',
		'locomotion',
		'van',
		'M108,188 A32,32 0 1 1 172,188 A32,32 0 1 1 108,188 Z',
		{ x: 108, y: 156, w: 64, h: 64 }
	),
	realSkipLoaderBody: realPart(
		'realSkipLoaderBody',
		'shell',
		'body',
		'skip-loader',
		'M42,208 L42,148 L56,108 Q58,104 66,104 L198,104 Q204,104 204,108 L204,208 L201,208 A32,32 0 0 0 139,208 L42,208 Z M204,180 L646,180 L646,220 L542,220 L542,216 A32,32 0 0 0 478,216 L478,220 L204,220 Z M110,208 L138,208 L138,216 L110,216 Z M30,196 L42,196 L42,218 L30,218 Z M18,152 L26,152 L26,172 L18,172 Z M26,157 L42,155 L42,163 L26,166 Z M174,98 L192,98 L192,104 L174,104 Z M106,97 L166,97 L166,104 L106,104 Z M204,180 L222,180 L222,84 L86,74 L86,88 L204,97 Z M64,58 L104,58 L104,73 L64,73 Z M72,73 L76,73 L76,118 L72,118 Z M82,73 L86,73 L86,114 L82,114 Z M222,134 L234,134 L234,140 L232,140 L232,180 L224,180 L224,140 L222,140 Z M300,220 L360,220 L360,236 L300,236 Z M544,220 L560,220 L560,238 L544,238 Z M646,186 L658,186 L658,214 L646,214 Z M646,214 L658,214 L658,224 L646,224 Z',
		{ x: 18, y: 58, w: 640, h: 180 }
	),
	realSkipLoaderWindows: realPart(
		'realSkipLoaderWindows',
		'glass',
		'face',
		'skip-loader',
		'M50,176 L50,144 L60,122 Q62,118 68,118 L124,118 L124,176 Z M136,112 L186,112 Q194,112 194,120 L194,158 Q194,166 186,166 L136,166 Z',
		{ x: 50, y: 112, w: 144, h: 64 }
	),
	realSkipLoaderSkip: realPart(
		'realSkipLoaderSkip',
		'trim',
		'cargo',
		'skip-loader',
		'M268,180 L310,76 L314,58 L400,58 L410,53 L420,56 L430,50 L440,54 L450,48 L460,55 L470,52 L482,56 L492,54 L498,58 L566,58 L570,76 L612,180 Z',
		{ x: 268, y: 48, w: 344, h: 132 }
	),
	realSkipLoaderWheel: realPart(
		'realSkipLoaderWheel',
		'rubber',
		'locomotion',
		'skip-loader',
		'M142,216 A28,28 0 1 1 198,216 A28,28 0 1 1 142,216 Z',
		{ x: 142, y: 188, w: 56, h: 56 }
	),
	realHookLiftTruckBody: realPart(
		'realHookLiftTruckBody',
		'shell',
		'body',
		'hook-lift-truck',
		'M34,232 L34,128 Q34,112 48,106 L68,100 Q78,96 92,96 L188,96 Q202,96 202,108 L202,232 Z M20,216 L34,216 L34,240 L20,240 Z M10,96 L28,96 L28,124 L10,124 Z M146,74 L174,74 L174,96 L146,96 Z M96,232 L130,232 L130,242 L96,242 Z M202,92 L222,92 L222,186 L202,186 Z M204,186 L682,186 L682,248 L204,248 Z M682,212 L698,212 L698,236 L682,236 Z M640,186 L676,182 L648,36 L626,32 L600,24 L588,32 L586,48 L594,60 L606,70 L616,68 L614,56 L600,54 L598,44 L606,38 L616,42 L620,42 Z',
		{ x: 10, y: 24, w: 688, h: 224 }
	),
	realHookLiftTruckWindows: realPart(
		'realHookLiftTruckWindows',
		'glass',
		'face',
		'hook-lift-truck',
		'M41,184 L41,132 Q41,122 51,118 L92,112 Q100,111 100,119 L100,178 Q100,184 94,184 Z M112,112 L182,112 Q190,112 190,120 L190,170 Q190,176 184,176 L112,176 Q104,176 104,170 L104,120 Q104,112 112,112 Z',
		{ x: 41, y: 111, w: 149, h: 73 }
	),
	realHookLiftTruckContainer: realPart(
		'realHookLiftTruckContainer',
		'trim',
		'cargo',
		'hook-lift-truck',
		'M236,186 L604,186 L604,86 L612,76 L608,76 L608,72 L592,72 L592,76 L248,76 L236,86 Z',
		{ x: 236, y: 72, w: 376, h: 114 }
	),
	realHookLiftTruckWheel: realPart(
		'realHookLiftTruckWheel',
		'rubber',
		'locomotion',
		'hook-lift-truck',
		'M142,222 A28,28 0 1 1 198,222 A28,28 0 1 1 142,222 Z',
		{ x: 142, y: 194, w: 56, h: 56 }
	),
	realConcretePumpBody: realPart(
		'realConcretePumpBody',
		'shell',
		'body',
		'concrete-pump',
		'M24,232 L24,136 Q24,118 42,118 L182,118 Q196,118 196,132 L196,232 Z M196,168 L208,168 L208,152 L220,138 L258,138 L270,152 L270,168 L676,168 L676,198 L196,198 Z M196,198 L748,198 L748,232 L196,232 Z M676,158 L736,158 L744,164 L744,176 L748,182 L748,198 L676,198 Z M220,232 L236,232 L236,250 L250,250 L250,262 L206,262 L206,250 L220,250 Z M616,232 L632,232 L632,250 L648,250 L648,262 L604,262 L604,250 L616,250 Z M210,232 L218,232 L218,250 L210,250 Z M596,232 L604,232 L604,250 L596,250 Z M318,154 L336,154 L336,168 L318,168 Z M596,154 L614,154 L614,168 L596,168 Z M10,196 L24,196 L24,234 L10,234 Z M8,130 L18,130 L18,154 L8,154 Z M18,142 L24,140 L24,148 L18,150 Z M56,118 L56,112 Q56,104 64,104 L86,104 Q94,104 94,112 L94,118 Z M198,126 L208,126 L208,168 L198,168 Z M200,126 Q194,114 206,108 Q216,98 230,102 Q242,106 240,118 Q246,124 242,126 Z M700,232 L748,232 L748,242 L740,246 L700,246 Z',
		{ x: 6, y: 96, w: 746, h: 168 }
	),
	realConcretePumpWindows: realPart(
		'realConcretePumpWindows',
		'glass',
		'face',
		'concrete-pump',
		'M36,196 L36,144 Q36,136 44,136 L92,136 Q100,136 100,144 L100,196 Z M116,136 L174,136 Q182,136 182,144 L182,182 Q182,190 174,190 L116,190 Q108,190 108,182 L108,144 Q108,136 116,136 Z',
		{ x: 36, y: 136, w: 146, h: 60 }
	),
	realConcretePumpBoom: realPart(
		'realConcretePumpBoom',
		'trim',
		'cargo',
		'concrete-pump',
		'M404,76 L628,76 L628,102 L656,102 L656,154 L270,154 L270,128 L404,128 Z',
		{ x: 266, y: 72, w: 396, h: 86 }
	),
	realConcretePumpWheel: realPart(
		'realConcretePumpWheel',
		'rubber',
		'locomotion',
		'concrete-pump',
		'M138,230 A32,32 0 1 1 202,230 A32,32 0 1 1 138,230 Z',
		{ x: 138, y: 198, w: 64, h: 64 }
	),
	realGritterTruckBody: realPart(
		'realGritterTruckBody',
		'shell',
		'body',
		'gritter-truck',
		'M82,240 L82,208 Q82,200 86,196 L92,124 Q94,108 108,105 L114,98 Q118,86 132,84 L246,84 Q258,84 258,96 L258,170 L600,170 Q618,170 622,184 L650,240 Z M8,118 Q2,124 3,138 Q4,152 6,166 Q8,188 14,210 Q20,234 28,246 L62,246 L66,240 L66,152 Q66,140 70,136 Q40,118 8,118 Z M70,201 L82,206 L82,212 L70,207 Z M70,229 L82,232 L82,238 L70,235 Z M650,233 A20,10 0 1 1 690,233 A20,10 0 1 1 650,233 Z M662,204 L678,204 L678,222 L662,222 Z M96,240 L650,240 L650,252 L96,252 Z M196,72 L230,72 L230,84 L196,84 Z M64,104 L82,109 L82,123 L64,118 Z M259,96 L271,96 L271,168 L259,168 Z M280,146 L340,146 L340,170 L280,170 Z',
		{ x: 2, y: 72, w: 688, h: 180 }
	),
	realGritterTruckWindows: realPart(
		'realGritterTruckWindows',
		'glass',
		'face',
		'gritter-truck',
		'M94,178 L94,150 Q94,138 100,126 L106,110 Q109,102 118,102 L146,102 Q152,102 152,110 L152,170 Q152,178 146,178 Z M164,104 Q164,98 172,98 L204,98 Q212,98 212,106 L212,158 Q212,164 204,164 L172,164 Q164,164 164,156 Z',
		{ x: 94, y: 98, w: 118, h: 80 }
	),
	realGritterTruckHopper: realPart(
		'realGritterTruckHopper',
		'trim',
		'cargo',
		'gritter-truck',
		'M424,116 L440,116 Q526,82 612,116 L628,116 L584,170 L468,170 Z M626,116 L594,88 L600,80 L632,108 Z',
		{ x: 424, y: 80, w: 208, h: 90 }
	),
	realGritterTruckWheel: realPart(
		'realGritterTruckWheel',
		'rubber',
		'locomotion',
		'gritter-truck',
		'M140,222 A30,30 0 1 1 200,222 A30,30 0 1 1 140,222 Z',
		{ x: 140, y: 192, w: 60, h: 60 }
	),
	realSnowBlowerBody: realPart(
		'realSnowBlowerBody',
		'shell',
		'body',
		'snow-blower',
		'M168,246 L168,176 Q168,164 173,156 L180,138 Q184,128 196,128 L306,128 Q320,128 321,142 L321,158 L654,158 Q668,158 670,172 L670,246 Z M112,142 L112,74 A46,46 0 0 1 158,28 L224,28 L224,62 L158,62 A12,12 0 0 0 146,74 L146,142 Z M224,26 L231,26 L231,64 L224,64 Z M258,120 L298,120 L298,128 L258,128 Z M262,120 L262,112 Q262,98 278,98 Q294,98 294,112 L294,120 Z M198,116 L218,116 L218,128 L198,128 Z M224,116 L244,116 L244,128 L224,128 Z M150,118 L164,118 L164,146 L150,146 Z M162,130 L176,138 L173,143 L160,135 Z M338,124 L350,124 L350,158 L338,158 Z M670,222 L680,222 L680,246 L670,246 Z M232,246 L248,246 L248,252 L232,252 Z M552,246 L568,246 L568,252 L552,252 Z',
		{ x: 112, y: 26, w: 568, h: 226 }
	),
	realSnowBlowerWindows: realPart(
		'realSnowBlowerWindows',
		'glass',
		'face',
		'snow-blower',
		'M172,184 L172,178 Q172,168 177,160 L188,144 Q192,136 200,136 L212,136 Q220,136 220,144 L220,176 Q220,184 212,184 Z M240,144 Q240,136 248,136 L300,136 Q308,136 308,144 L308,196 Q308,204 300,204 L248,204 Q240,204 240,194 Z',
		{ x: 172, y: 136, w: 136, h: 68 }
	),
	realSnowBlowerAuger: realPart(
		'realSnowBlowerAuger',
		'shell',
		'cargo',
		'snow-blower',
		'M22,249 L22,198 Q22,184 32,176 L50,158 Q56,150 70,150 L108,150 L108,140 L152,140 L152,150 L154,150 Q162,150 162,160 L162,249 Z',
		{ x: 22, y: 140, w: 140, h: 109 }
	),
	realSnowBlowerWheel: realPart(
		'realSnowBlowerWheel',
		'rubber',
		'locomotion',
		'snow-blower',
		'M170,222 A30,30 0 1 1 230,222 A30,30 0 1 1 170,222 Z',
		{ x: 170, y: 192, w: 60, h: 60 }
	),
	realRoadPlanerBody: realPart(
		'realRoadPlanerBody',
		'shell',
		'body',
		'road-planer',
		'M70,214 L70,152 L300,152 L152,118 L92,118 L92,74 L104,62 L152,62 L368,152 L540,152 L558,96 L694,96 Q718,96 718,120 L718,214 L630,214 A31,31 0 0 0 570,214 L210,214 A31,31 0 0 0 150,214 L70,214 Z M230,152 L254,152 L210,131.3 L186,125.8 Z M640,96 L640,84 Q640,78 646,78 L658,78 Q664,78 664,84 L664,96 Z M510,152 L510,124 Q510,118 516,118 L524,118 Q530,118 530,124 L530,152 Z',
		{ x: 70, y: 62, w: 648, h: 152 }
	),
	realRoadPlanerWindows: realPart(
		'realRoadPlanerWindows',
		'glass',
		'face',
		'road-planer',
		'M546,148 L560,104 L594,104 L594,148 Z M604,104 L692,104 Q700,104 700,112 L700,138 Q700,146 692,146 L604,146 Z',
		{ x: 546, y: 104, w: 154, h: 44 }
	),
	realRoadPlanerDrum: realPart(
		'realRoadPlanerDrum',
		'trim',
		'cargo',
		'road-planer',
		'M292,190 L528,190 L534,200 L534,246 Q534,252 528,252 L292,252 Q286,252 286,246 L286,200 Z',
		{ x: 286, y: 190, w: 248, h: 62 }
	),
	realRoadPlanerWheel: realPart(
		'realRoadPlanerWheel',
		'rubber',
		'locomotion',
		'road-planer',
		'M150,222 A30,30 0 1 1 210,222 A30,30 0 1 1 150,222 Z',
		{ x: 150, y: 192, w: 60, h: 60 }
	),
	realAsphaltPaverBody: realPart(
		'realAsphaltPaverBody',
		'shell',
		'body',
		'asphalt-paver',
		'M24,204 L24,148 Q24,140 32,138 L136,124 L136,204 Z M136,204 L136,152 Q136,144 144,142 L196,138 L196,196 L300,196 L300,120 L588,120 Q600,120 600,132 L600,204 Z M204,204 L560,204 L560,206 L614,206 L614,214 L204,214 Z M144,76 L144,66 Q144,60 152,60 L382,60 Q390,60 390,68 L390,76 Z M186,76 L186,138 L198,138 L198,76 Z M362,76 L362,120 L374,120 L374,76 Z M310,76 L310,120 L316,120 L316,76 Z M252,60 L252,54 Q252,44 260,44 Q268,44 268,54 L268,60 Z M132,66 L144,66 L144,76 L132,76 Z M390,66 L404,66 L404,76 L390,76 Z M120,82 L136,82 L136,76 L144,76 L144,86 L136,86 L136,98 L120,98 Z M560,120 L560,90 L574,90 L574,120 Z M556,86 L578,86 L578,90 L556,90 Z M552,84 Q546,72 558,66 Q568,60 576,68 Q582,76 574,84 Z M430,120 L430,104 L436,104 L436,112 L514,112 L514,104 L520,104 L520,120 Z M212,196 L212,182 Q212,174 222,174 L282,170 L282,130 Q282,124 288,124 L294,124 L294,196 Z',
		{ x: 24, y: 44, w: 590, h: 170 }
	),
	realAsphaltPaverWindows: realPart(
		'realAsphaltPaverWindows',
		'glass',
		'face',
		'asphalt-paver',
		'M140,143 L152,78 L186,78 L186,139 Z M316,76 L360,76 L360,120 L316,120 Z',
		{ x: 140, y: 76, w: 220, h: 67 }
	),
	realAsphaltPaverScreed: realPart(
		'realAsphaltPaverScreed',
		'trim',
		'cargo',
		'asphalt-paver',
		'M574,234 L574,180 L592,180 L592,234 Z M666,230 L666,184 L682,184 L682,230 Z M592,198 L666,198 L666,232 L592,232 Z M592,190 L666,190 L666,198 L592,198 Z',
		{ x: 574, y: 180, w: 108, h: 54 }
	),
	realAsphaltPaverWheel: realPart(
		'realAsphaltPaverWheel',
		'rubber',
		'locomotion',
		'asphalt-paver',
		'M140,216 A30,30 0 1 1 200,216 A30,30 0 1 1 140,216 Z',
		{ x: 140, y: 186, w: 60, h: 60 }
	),
	realSewerCleanerBody: realPart(
		'realSewerCleanerBody',
		'shell',
		'body',
		'sewer-cleaner',
		'M28,224 L28,150 Q28,136 38,128 L60,106 Q68,96 84,96 L186,96 Q200,96 206,104 L212,104 L486,104 C498,110 506,128 506,152 C506,176 500,190 486,200 L506,200 L506,196 L632,196 Q644,196 644,208 L644,224 Z M214,104 L214,84 L392,58 L578,62 L602,72 L594,86 L392,80 L216,104 Z M100,96 L100,88 L106,88 Q108,76 118,76 Q128,76 130,88 L136,88 L136,96 Z M10,120 L26,120 Q28,120 28,124 L28,150 L10,150 Z M12,206 L28,206 L28,232 L12,232 Z M620,226 L654,226 L654,238 L620,238 Z M214,226 L470,226 L470,234 L214,234 Z M420,104 L420,94 Q420,88 428,88 L454,88 Q462,88 462,94 L462,104 Z M508,152 L548,152 L548,196 L508,196 Z M644,140 L654,140 L654,220 L644,220 Z M548,148 L556,148 L556,156 L548,156 Z M550,180 L564,180 L564,196 L550,196 Z M593,88 L603,88 L603,108 L593,108 Z M40,224 L214,224 L214,232 L40,232 Z M470,224 L620,224 L620,232 L470,232 Z',
		{ x: 10, y: 58, w: 644, h: 180 }
	),
	realSewerCleanerWindows: realPart(
		'realSewerCleanerWindows',
		'glass',
		'face',
		'sewer-cleaner',
		'M38,160 L38,142 Q38,134 44,130 L64,110 Q70,104 80,104 L112,104 Q118,104 118,110 L118,154 Q118,160 112,160 Z M129,110 L183,110 Q188,110 188,115 L188,155 Q188,160 183,160 L129,160 Q124,160 124,155 L124,115 Q124,110 129,110 Z',
		{ x: 38, y: 104, w: 150, h: 56 }
	),
	realSewerCleanerReel: realPart(
		'realSewerCleanerReel',
		'trim',
		'cargo',
		'sewer-cleaner',
		'M554,152 A44,44 0 1 1 642,152 A44,44 0 1 1 554,152 Z M589,197 L601,197 L603,230 L607,238 L596,238 L591,232 Z',
		{ x: 554, y: 108, w: 88, h: 130 }
	),
	realSewerCleanerWheel: realPart(
		'realSewerCleanerWheel',
		'rubber',
		'locomotion',
		'sewer-cleaner',
		'M142,216 A28,28 0 1 1 198,216 A28,28 0 1 1 142,216 Z',
		{ x: 142, y: 188, w: 56, h: 56 }
	),
	realAirportFuelBowserBody: realPart(
		'realAirportFuelBowserBody',
		'shell',
		'body',
		'airport-fuel-bowser',
		'M34,210 L34,136 Q34,122 52,117 L86,114 L86,103 Q86,97 93,97 L101,97 Q108,97 108,103 L108,111 L166,111 Q180,110 184,121 L184,186 L560,186 L560,140 Q560,132 570,132 L628,132 Q638,132 638,142 L638,210 L527.331,210 A28,28 0 0 0 472.669,210 L197.331,210 A28,28 0 0 0 142.669,210 L34,210 Z M14,136 L28,136 L28,144 L34,144 L34,150 L28,150 L28,158 L14,158 Z M26,202 L34,202 L34,222 L26,222 Z M638,198 L652,198 L652,218 L638,218 Z',
		{ x: 14, y: 96, w: 638, h: 126 }
	),
	realAirportFuelBowserTank: realPart(
		'realAirportFuelBowserTank',
		'trim',
		'cargo',
		'airport-fuel-bowser',
		'M198,102 L334,102 L334,96 Q334,92 340,92 L368,92 Q374,92 374,96 L374,102 L542,102 Q558,102 560,122 L560,166 Q558,186 542,186 L198,186 Q186,186 186,166 L186,122 Q188,102 198,102 Z',
		{ x: 186, y: 92, w: 374, h: 94 }
	),
	realAirportFuelBowserWindows: realPart(
		'realAirportFuelBowserWindows',
		'glass',
		'face',
		'airport-fuel-bowser',
		'M50,128 L100,128 Q106,128 106,134 L106,156 Q106,162 100,162 L50,162 Q44,162 44,156 L44,134 Q44,128 50,128 Z M117,130 L141,130 Q146,130 146,135 L146,155 Q146,160 141,160 L117,160 Q112,160 112,155 L112,135 Q112,130 117,130 Z',
		{ x: 44, y: 128, w: 102, h: 34 }
	),
	realAirportFuelBowserWheel: realPart(
		'realAirportFuelBowserWheel',
		'rubber',
		'locomotion',
		'airport-fuel-bowser',
		'M142,216 A28,28 0 1 1 198,216 A28,28 0 1 1 142,216 Z',
		{ x: 142, y: 188, w: 56, h: 56 }
	),
	realAerialLadderBody: realPart(
		'realAerialLadderBody',
		'shell',
		'body',
		'aerial-ladder',
		'M30,262 L30,188 Q30,174 40,170 L48,142 Q52,130 66,130 L188,130 Q196,130 196,140 L196,152 L744,152 Q752,152 752,162 L752,262 Z M16,240 L30,240 L30,264 L16,264 Z M16,140 L30,140 L30,166 L16,166 Z M66,130 L66,118 Q66,114 70,114 L174,114 Q178,114 178,118 L178,130 Z M252,262 L266,262 L266,280 L286,280 L286,290 L234,290 L234,280 L252,280 Z M544,262 L558,262 L558,280 L578,280 L578,290 L526,290 L526,280 L544,280 Z M688,262 L756,262 L756,288 L688,288 Z M198,118 L210,118 L210,152 L198,152 Z M196,118 Q194,104 206,100 Q212,88 226,90 Q242,92 240,104 Q248,110 240,118 Z M146,268 A34,34 0 0 1 214,268 Z M586,268 A34,34 0 0 1 654,268 Z',
		{ x: 16, y: 88, w: 740, h: 202 }
	),
	realAerialLadderWindows: realPart(
		'realAerialLadderWindows',
		'glass',
		'face',
		'aerial-ladder',
		'M42,184 L50,152 Q52,144 60,144 L112,144 L112,184 Z M124,144 L184,144 Q190,144 190,150 L190,184 L124,184 Z',
		{ x: 42, y: 144, w: 148, h: 40 }
	),
	realAerialLadderLadder: realPart(
		'realAerialLadderLadder',
		'trim',
		'cargo',
		'aerial-ladder',
		'M212,126 L340,126 L340,122 L472,122 L472,118 L652,118 L652,150 L472,150 L472,146 L340,146 L340,142 L212,142 Z M652,152 L652,136 Q652,128 660,128 L736,128 Q744,128 744,136 L744,152 Z',
		{ x: 212, y: 118, w: 532, h: 34 }
	),
	realAerialLadderWheel: realPart(
		'realAerialLadderWheel',
		'rubber',
		'locomotion',
		'aerial-ladder',
		'M148,268 A32,32 0 1 1 212,268 A32,32 0 1 1 148,268 Z',
		{ x: 148, y: 236, w: 64, h: 64 }
	),
	realAirportFireTruckBody: realPart(
		'realAirportFireTruckBody',
		'shell',
		'body',
		'airport-fire-truck',
		'M42,252 L42,200 Q42,184 56,178 L74,154 Q80,144 94,144 L182,144 Q194,144 194,156 L194,182 L692,182 L692,252 L605.10,252 A36,36 0 0 0 534.90,252 L215.10,252 A36,36 0 0 0 144.90,252 L42,252 Z M14,176 L30,176 L30,182 L42,182 L42,188 L30,188 L30,210 L14,210 Z M8,238 L18,238 L18,252 L8,252 Z M18,226 L42,226 L42,270 L18,270 Z M692,240 L708,240 L708,262 L692,262 Z M96,130 L180,130 L180,144 L96,144 Z',
		{ x: 8, y: 130, w: 700, h: 140 }
	),
	realAirportFireTruckWindows: realPart(
		'realAirportFireTruckWindows',
		'glass',
		'face',
		'airport-fire-truck',
		'M50,206 L50,188 Q50,180 58,174 L86,154 Q90,152 96,152 L124,152 L124,206 Z M139,152 L173,152 Q178,152 178,157 L178,201 Q178,206 173,206 L139,206 Q134,206 134,201 L134,157 Q134,152 139,152 Z',
		{ x: 50, y: 152, w: 128, h: 54 }
	),
	realAirportFireTruckMonitor: realPart(
		'realAirportFireTruckMonitor',
		'trim',
		'cargo',
		'airport-fire-truck',
		'M264,185 L328,185 L328,168 L320,168 L318,156 L313.4,141.3 L269.7,91.8 L256,72.9 Q242,77.6 236,91.1 L253.5,106.6 L298.6,154.7 L296,156 L296,168 L264,168 Z',
		{ x: 235, y: 72, w: 94, h: 114 }
	),
	realAirportFireTruckWheel: realPart(
		'realAirportFireTruckWheel',
		'rubber',
		'locomotion',
		'airport-fire-truck',
		'M144,260 A36,36 0 1 1 216,260 A36,36 0 1 1 144,260 Z',
		{ x: 144, y: 224, w: 72, h: 72 }
	),
	realHazmatTruckBody: realPart(
		'realHazmatTruckBody',
		'shell',
		'body',
		'hazmat-truck',
		'M14,270 L14,246 L24,242 L24,140 Q24,116 48,111 L188,111 Q204,112 204,124 L204,258 L582,258 L582,170 L648,170 L648,262 L656,262 L656,278 L584,278 L584,270 Z M94,111 L94,104 L97,94 Q98,90 104,90 L112,90 Q118,90 119,94 L120,104 L120,111 Z M4,136 L18,136 L18,146 L24,146 L24,152 L18,152 L18,168 L4,168 Z M586,170 L646,170 L646,148 L586,148 Z M250,258 L250,248 L306,248 L306,258 Z M420,258 L420,248 L476,248 L476,258 Z M539,270 L548,270 L548,278 L539,278 Z',
		{ x: 4, y: 90, w: 652, h: 188 }
	),
	realHazmatTruckWindows: realPart(
		'realHazmatTruckWindows',
		'glass',
		'face',
		'hazmat-truck',
		'M45,128 L109,128 Q118,128 118,137 L118,179 Q118,188 109,188 L45,188 Q36,188 36,179 L36,137 Q36,128 45,128 Z M133,132 L181,132 Q186,132 186,137 L186,179 Q186,184 181,184 L133,184 Q128,184 128,179 L128,137 Q128,132 133,132 Z',
		{ x: 36, y: 128, w: 150, h: 60 }
	),
	realHazmatTruckTank: realPart(
		'realHazmatTruckTank',
		'trim',
		'cargo',
		'hazmat-truck',
		'M204,124 L548,124 C566,124 582,150 582,186 C582,222 566,248 548,248 L204,248 Z M300,124 L300,106 Q300,100 306,100 L346,100 Q352,100 352,106 L352,124 Z',
		{ x: 204, y: 100, w: 378, h: 148 }
	),
	realHazmatTruckWheel: realPart(
		'realHazmatTruckWheel',
		'rubber',
		'locomotion',
		'hazmat-truck',
		'M142,254 A28,28 0 1 1 198,254 A28,28 0 1 1 142,254 Z',
		{ x: 142, y: 226, w: 56, h: 56 }
	),
	realRescueTruckBody: realPart(
		'realRescueTruckBody',
		'shell',
		'body',
		'rescue-truck',
		'M38,270 L38,182 Q38,172 44,166 L74,120 Q78,114 86,114 L212,114 L212,96 Q212,90 218,90 L652,90 Q664,90 664,102 L664,264 Q664,270 658,270 Z M92,100 L200,100 L200,114 L92,114 Z M620,80 L650,80 L650,90 L620,90 Z M16,156 L38,156 L38,200 L16,200 Z M20,244 L38,244 L38,270 L20,270 Z M664,250 L680,250 L680,268 L664,268 Z M96,270 L320,270 L320,286 L420,286 L420,270 L656,270 L656,278 L96,278 Z',
		{ x: 16, y: 80, w: 664, h: 206 }
	),
	realRescueTruckWindows: realPart(
		'realRescueTruckWindows',
		'glass',
		'face',
		'rescue-truck',
		'M46,170 L76,124 L104,128 L74,174 Z M117,124 L151,124 Q156,124 156,129 L156,169 Q156,174 151,174 L117,174 Q112,174 112,169 L112,129 Q112,124 117,124 Z M167,126 L195,126 Q200,126 200,131 L200,167 Q200,172 195,172 L167,172 Q162,172 162,167 L162,131 Q162,126 167,126 Z',
		{ x: 46, y: 124, w: 154, h: 50 }
	),
	realRescueTruckShutter: realPart(
		'realRescueTruckShutter',
		'trim',
		'cargo',
		'rescue-truck',
		'M598,100 L660,100 L660,244 L598,244 Z M634,270 L688,270 L688,284 L634,284 Z M622,246 L660,246 L660,260 L622,260 Z M600,248 L618,248 L618,257 L600,257 Z',
		{ x: 598, y: 100, w: 90, h: 184 }
	),
	realRescueTruckWheel: realPart(
		'realRescueTruckWheel',
		'rubber',
		'locomotion',
		'rescue-truck',
		'M140,262 A30,30 0 1 1 200,262 A30,30 0 1 1 140,262 Z',
		{ x: 140, y: 232, w: 60, h: 60 }
	),
	realCherryPickerBody: realPart(
		'realCherryPickerBody',
		'shell',
		'body',
		'cherry-picker',
		'M40,266 L40,192 Q40,182 48,178 L86,168 L132,120 Q138,112 150,112 L606,112 Q620,112 620,126 L620,254 Q620,266 606,266 Z M40,266 L104,266 L104,276 L144,276 L144,266 L558,266 L558,276 L598,276 L598,266 L620,266 L620,276 L40,276 Z M412,112 L412,98 Q412,88 422,86 L466,86 Q476,88 476,98 L476,112 Z M392,112 L400,112 L314,74 L306,66 Z M172,112 L172,104 Q172,98 178,98 L212,98 Q218,98 218,104 L218,112 Z M56,136 L80,136 L80,164 L56,164 Z M80,146 L80,154 L97.5,156 L109,144 Z M22,240 L40,240 L40,266 L22,266 Z M620,240 L636,240 L636,266 L620,266 Z M112,266 L128,266 L128,282 L144,282 L144,292 L104,292 L104,282 L112,282 Z M566,266 L582,266 L582,282 L598,282 L598,292 L558,292 L558,282 L566,282 Z',
		{ x: 22, y: 66, w: 614, h: 226 }
	),
	realCherryPickerWindows: realPart(
		'realCherryPickerWindows',
		'glass',
		'face',
		'cherry-picker',
		'M90,166 L134,122 L142.5,130.5 L98.5,174.5 Z M172,126 L224,126 Q230,126 230,132 L230,168 Q230,174 224,174 L172,174 Q166,174 166,168 L166,132 Q166,126 172,126 Z',
		{ x: 90, y: 122, w: 140, h: 53 }
	),
	realCherryPickerBoom: realPart(
		'realCherryPickerBoom',
		'trim',
		'cargo',
		'cherry-picker',
		'M444,78 L330,48 L326,52 L204,32 L204,52 L326,72 L330,76 L444,108 L452,110 Q464,106 464,96 Q464,86 452,82 Z M123,14 L199,14 Q204,14 204,19 L204,59 Q204,64 199,64 L123,64 Q118,64 118,59 L118,19 Q118,14 123,14 Z',
		{ x: 118, y: 14, w: 346, h: 96 }
	),
	realCherryPickerWheel: realPart(
		'realCherryPickerWheel',
		'rubber',
		'locomotion',
		'cherry-picker',
		'M152,272 A28,28 0 1 1 208,272 A28,28 0 1 1 152,272 Z',
		{ x: 152, y: 244, w: 56, h: 56 }
	),
	realScissorLiftBody: realPart(
		'realScissorLiftBody',
		'shell',
		'body',
		'scissor-lift',
		'M104,236 L426,236 Q434,236 434,244 L434,286 Q434,294 426,294 L407,294 A27,27 0 0 0 353,294 L177,294 A27,27 0 0 0 123,294 L104,294 Q96,294 96,286 L96,244 Q96,236 104,236 Z',
		{ x: 96, y: 236, w: 338, h: 58 }
	),
	realScissorLiftScissor: realPart(
		'realScissorLiftScissor',
		'trim',
		'cargo',
		'scissor-lift',
		'M133.88,152.62 L136.25,137.8 L393.75,137.8 L396.12,152.62 L396.12,219.38 L393.75,234.2 L136.25,234.2 L133.88,219.38 Z',
		{ x: 133, y: 137, w: 264, h: 98 }
	),
	realScissorLiftPlatform: realPart(
		'realScissorLiftPlatform',
		'trim',
		'detail',
		'scissor-lift',
		'M123,110 L407,110 Q412,110 412,115 L412,131 Q412,136 407,136 L123,136 Q118,136 118,131 L118,115 Q118,110 123,110 Z M121,51 L132,51 L132,110 L121,110 Z M186,51 L197,51 L197,110 L186,110 Z M300,51 L311,51 L311,110 L300,110 Z M398,51 L409,51 L409,110 L398,110 Z M197,51 L300,51 L300,58 L197,58 Z M311,51 L398,51 L398,58 L311,58 Z M197,82 L300,82 L300,88 L197,88 Z M311,82 L398,82 L398,88 L311,88 Z M132,52 L186,52 L186,110 L132,110 Z M348,43 L378,43 L378,51 L348,51 Z M352,43 L352,38 Q352,32 359,32 L367,32 Q374,32 374,38 L374,43 Z',
		{ x: 118, y: 32, w: 294, h: 104 }
	),
	realScissorLiftWheel: realPart(
		'realScissorLiftWheel',
		'rubber',
		'locomotion',
		'scissor-lift',
		'M128,294 A22,22 0 1 1 172,294 A22,22 0 1 1 128,294 Z',
		{ x: 128, y: 272, w: 44, h: 44 }
	),
	realAllTerrainCraneBody: realPart(
		'realAllTerrainCraneBody',
		'shell',
		'body',
		'all-terrain-crane',
		'M26,282 L26,224 L36,206 Q40,196 52,196 L126,196 Q140,198 140,214 L140,282 Z M140,244 L770,244 Q782,244 782,254 L782,268 Q782,276 770,276 L140,276 Z M318,244 L318,236 Q318,214 340,214 L744,214 Q760,214 760,232 L760,244 Z M340,214 L340,190 L352,174 Q356,168 366,168 L418,168 Q432,170 432,184 L432,214 Z M544,214 L544,202 Q544,196 550,196 L736,196 Q744,196 744,204 L744,214 Z M232,276 L258,276 L258,298 L268,298 L268,310 L220,310 L220,298 L232,298 Z M706,276 L732,276 L732,298 L744,298 L744,310 L696,310 L696,298 L706,298 Z M74,196 L74,188 Q74,184 79,184 L97,184 Q102,184 102,188 L102,196 Z M372,168 L372,160 Q372,156 377,156 L395,156 Q400,156 400,160 L400,168 Z M16,212 L26,212 L26,238 L16,238 Z M14,262 L26,262 L26,284 L14,284 Z M158,244 L158,192 L162,188 L170,188 L170,244 Z',
		{ x: 14, y: 156, w: 768, h: 154 }
	),
	realAllTerrainCraneWindows: realPart(
		'realAllTerrainCraneWindows',
		'glass',
		'face',
		'all-terrain-crane',
		'M37,250 L45,214 Q47,208 53,208 L76,208 L76,250 Z M84,208 L126,208 Q134,208 134,216 L134,250 L84,250 Z M350,206 L350,194 Q350,188 357,184 L374,177 Q380,175 386,177 L386,206 Z M394,179 L410,179 Q418,179 418,187 L418,206 L394,206 Z',
		{ x: 37, y: 175, w: 381, h: 75 }
	),
	realAllTerrainCraneBoom: realPart(
		'realAllTerrainCraneBoom',
		'trim',
		'cargo',
		'all-terrain-crane',
		'M530.08,242.21 L430.33,176.47 L432.16,173.49 L346.4,121.01 L347.96,118.45 L267.56,69.25 L276.44,54.75 L356.84,103.95 L358.4,101.39 L444.16,153.87 L445.99,150.89 L549.92,209.79 Z M297,92 L303,92 L303,175 L317,175 L317,197 L283,197 L283,175 L297,175 Z M291,197 L315,197 L315,215 L291,215 Z',
		{ x: 267.6, y: 54.8, w: 282.4, h: 187.4 }
	),
	realAllTerrainCraneWheel: realPart(
		'realAllTerrainCraneWheel',
		'rubber',
		'locomotion',
		'all-terrain-crane',
		'M148,288 A32,32 0 1 1 212,288 A32,32 0 1 1 148,288 Z',
		{ x: 148, y: 256, w: 64, h: 64 }
	),
	realSideLoaderGarbageBody: realPart(
		'realSideLoaderGarbageBody',
		'shell',
		'body',
		'side-loader-garbage',
		'M32,272 L32,158 Q32,144 40,136 L62,116 Q68,108 82,108 L174,108 Q182,108 182,100 L182,96 Q182,88 194,88 L634,84 L646,62 Q650,58 660,58 L690,58 Q702,58 702,70 L702,272 Z M118,108 L118,100 L128,100 Q128,84 140,84 Q152,84 152,100 L158,100 L158,108 Z M14,118 L28,118 L28,150 L14,150 Z M16,244 L32,244 L32,272 L16,272 Z M96,272 L158,272 L158,284 L96,284 Z M196,272 L212,272 L212,292 L196,292 Z M586,272 L602,272 L602,292 L586,292 Z',
		{ x: 14, y: 58, w: 688, h: 234 }
	),
	realSideLoaderGarbageWindows: realPart(
		'realSideLoaderGarbageWindows',
		'glass',
		'face',
		'side-loader-garbage',
		'M38,202 L38,166 Q38,156 44,148 L58,130 Q64,122 76,122 L98,122 Q106,122 106,130 L106,194 Q106,202 98,202 Z M118,124 L166,124 Q174,124 174,132 L174,184 Q174,192 166,192 L118,192 Q110,192 110,184 L110,132 Q110,124 118,124 Z',
		{ x: 38, y: 122, w: 136, h: 80 }
	),
	realSideLoaderGarbageBin: realPart(
		'realSideLoaderGarbageBin',
		'trim',
		'cargo',
		'side-loader-garbage',
		'M296,219 L352,219 L352,231 Q352,234 349,234 L299,234 Q296,234 296,231 Z M299,234 L349,234 L345,284 Q345,290 339,290 L334,290 L334,300 L327,300 L327,290 L321,290 L321,300 L314,300 L314,290 L309,290 Q303,290 303,284 Z',
		{ x: 296, y: 219, w: 56, h: 81 }
	),
	realSideLoaderGarbageWheel: realPart(
		'realSideLoaderGarbageWheel',
		'rubber',
		'locomotion',
		'side-loader-garbage',
		'M138,268 A32,32 0 1 1 202,268 A32,32 0 1 1 138,268 Z',
		{ x: 138, y: 236, w: 64, h: 64 }
	),
	realRecyclingTruckBody: realPart(
		'realRecyclingTruckBody',
		'shell',
		'body',
		'recycling-truck',
		'M40,282 L40,248 L40,214 L44,168 Q45,152 53,140 L65,122 Q71,112 85,110 L226,110 L226,74 Q226,62 238,62 L604,62 Q622,62 622,80 L622,282 Z M376,62 L376,54 Q376,50 382,50 L418,50 Q424,50 424,54 L424,62 Z M166,110 L166,103 L171,103 Q171,92 182,92 Q193,92 193,103 L198,103 L198,110 Z M204,110 L204,80 L202,76 L218,76 L216,80 L216,110 Z M20,126 L34,131 L34,158 L20,152 Z M24,248 L40,248 L40,282 L24,282 Z M202,282 L218,282 L218,290 L202,290 Z M576,282 L592,282 L592,290 L576,290 Z M660,282 L696,282 L696,290 L660,290 Z',
		{ x: 20, y: 50, w: 676, h: 240 }
	),
	realRecyclingTruckWindows: realPart(
		'realRecyclingTruckWindows',
		'glass',
		'face',
		'recycling-truck',
		'M50,206 L50,168 Q50,153 57,145 L71,128 Q78,118 91,118 L116,118 Q124,118 124,126 L124,198 Q124,206 116,206 Z M136,114 L210,114 Q218,114 218,122 L218,192 Q218,200 210,200 L136,200 Q128,200 128,192 L128,122 Q128,114 136,114 Z',
		{ x: 50, y: 114, w: 168, h: 92 }
	),
	realRecyclingTruckHopper: realPart(
		'realRecyclingTruckHopper',
		'trim',
		'cargo',
		'recycling-truck',
		'M590,174 L690,174 L690,266 Q690,282 674,282 L606,282 Q596,282 594,270 L584,200 Q584,188 590,174 Z M594,174 L594,142 L602,134 L616,138 L616,174 Z M620,174 L620,156 Q620,150 625,148 L625,143 L628,141 L628,137 Q628,132 631,132 Q634,132 634,137 L634,141 L637,143 L637,148 Q642,150 642,156 L642,174 Z M646,174 L646,158 Q646,153 650,151 L650,146 L652,144 L652,142 Q652,139 655,139 Q658,139 658,142 L658,144 L660,146 L660,151 Q664,153 664,158 L664,174 Z M668,174 L672,132 L684,136 L682,174 Z',
		{ x: 584, y: 132, w: 106, h: 150 }
	),
	realRecyclingTruckWheel: realPart(
		'realRecyclingTruckWheel',
		'rubber',
		'locomotion',
		'recycling-truck',
		'M140,262 A30,30 0 1 1 200,262 A30,30 0 1 1 140,262 Z',
		{ x: 140, y: 232, w: 60, h: 60 }
	),
	realIceCreamTruckBody: realPart(
		'realIceCreamTruckBody',
		'shell',
		'body',
		'ice-cream-truck',
		'M30,276 L30,206 Q30,196 40,192 L74,184 L100,146 Q104,136 114,136 L566,136 Q582,136 582,150 L582,262 Q582,276 566,276 Z M349,136 L323,96 Q311,92 320,82 Q311,72 321,62 Q316,50 330,48 Q337,37 349,41 Q362,37 369,48 Q383,50 378,62 Q388,72 379,82 Q388,92 375,96 Z M118,136 L118,130 Q118,120 128,120 Q138,120 138,130 L138,136 Z M16,248 L30,248 L30,276 L16,276 Z M582,254 L596,254 L596,270 L582,270 Z M210,276 L430,276 L430,282 L210,282 Z',
		{ x: 16, y: 38, w: 580, h: 244 }
	),
	realIceCreamTruckWindows: realPart(
		'realIceCreamTruckWindows',
		'glass',
		'face',
		'ice-cream-truck',
		'M84,196 L118,146 L142,152 L106,202 Z M158,143 L198,143 Q204,143 204,149 L204,176 Q204,182 198,182 L158,182 Q152,182 152,176 L152,149 Q152,143 158,143 Z',
		{ x: 84, y: 142, w: 120, h: 60 }
	),
	realIceCreamTruckHatch: realPart(
		'realIceCreamTruckHatch',
		'trim',
		'cargo',
		'ice-cream-truck',
		'M226,148 L442,148 L442,248 L226,248 Z',
		{ x: 226, y: 148, w: 216, h: 100 }
	),
	realIceCreamTruckWheel: realPart(
		'realIceCreamTruckWheel',
		'rubber',
		'locomotion',
		'ice-cream-truck',
		'M120,258 A30,30 0 1 1 180,258 A30,30 0 1 1 120,258 Z',
		{ x: 120, y: 228, w: 60, h: 60 }
	),
	realMilkFloatBody: realPart(
		'realMilkFloatBody',
		'shell',
		'body',
		'milk-float',
		'M48,84 L48,74 Q48,64 60,64 L526,64 Q538,64 538,74 L538,84 Z M38,222 L38,172 Q38,158 50,154 L70,150 L92,84 L124,84 L124,222 Z M124,158 L144,158 L144,204 L124,204 Z M124,204 L538,204 L538,222 L124,222 Z M152,204 L152,181 Q152,172 162,172 L204,172 L204,204 Z M204,204 L204,158 Q204,150 212,150 Q220,150 220,158 L220,204 Z M462,84 L474,84 L474,204 L462,204 Z M520,84 L532,84 L532,204 L520,204 Z M474,96 L520,96 L520,104 L474,104 Z M474,132 L520,132 L520,140 L474,140 Z M474,168 L520,168 L520,176 L474,176 Z M477,111 L477,132 L489,132 L489,111 L485,111 L485,104 L481,104 L481,111 Z M491,111 L491,132 L503,132 L503,111 L499,111 L499,104 L495,104 L495,111 Z M505,111 L505,132 L517,132 L517,111 L513,111 L513,104 L509,104 L509,111 Z M477,147 L477,168 L489,168 L489,147 L485,147 L485,140 L481,140 L481,147 Z M491,147 L491,168 L503,168 L503,147 L499,147 L499,140 L495,140 L495,147 Z M505,147 L505,168 L517,168 L517,147 L513,147 L513,140 L509,140 L509,147 Z M477,183 L477,204 L489,204 L489,183 L485,183 L485,176 L481,176 L481,183 Z M491,183 L491,204 L503,204 L503,183 L499,183 L499,176 L495,176 L495,183 Z M505,183 L505,204 L517,204 L517,183 L513,183 L513,176 L509,176 L509,183 Z M22,196 L38,196 L38,222 L22,222 Z M520,222 L538,222 L538,236 L520,236 Z',
		{ x: 22, y: 64, w: 516, h: 172 }
	),
	realMilkFloatWindows: realPart(
		'realMilkFloatWindows',
		'glass',
		'face',
		'milk-float',
		'M76,148 L93,89 L114,89 L108,150 Z',
		{ x: 76, y: 89, w: 38, h: 61 }
	),
	realMilkFloatCrates: realPart(
		'realMilkFloatCrates',
		'trim',
		'cargo',
		'milk-float',
		'M226,172 L280,172 L280,204 L226,204 Z M280,172 L334,172 L334,204 L280,204 Z M334,172 L388,172 L388,204 L334,204 Z M388,172 L442,172 L442,204 L388,204 Z M232,140 L286,140 L286,172 L232,172 Z M286,140 L340,140 L340,172 L286,172 Z M340,140 L394,140 L394,172 L340,172 Z M394,140 L448,140 L448,172 L394,172 Z M250,108 L304,108 L304,140 L250,140 Z M304,108 L358,108 L358,140 L304,140 Z M358,108 L412,108 L412,140 L358,140 Z M262,95 L262,108 L274,108 L274,95 L270,95 L270,88 L266,88 L266,95 Z M298,95 L298,108 L310,108 L310,95 L306,95 L306,88 L302,88 L302,95 Z M334,95 L334,108 L346,108 L346,95 L342,95 L342,88 L338,88 L338,95 Z M370,95 L370,108 L382,108 L382,95 L378,95 L378,88 L374,88 L374,95 Z',
		{ x: 226, y: 88, w: 222, h: 116 }
	),
	realMilkFloatWheel: realPart(
		'realMilkFloatWheel',
		'rubber',
		'locomotion',
		'milk-float',
		'M102,236 A28,28 0 1 1 158,236 A28,28 0 1 1 102,236 Z',
		{ x: 102, y: 208, w: 56, h: 56 }
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
	realTractorBody: 'Tractor',
	realTractorWindows: 'Windows',
	realTractorDoor: 'Door',
	realTractorWheel: 'Wheel',
	realBulldozerBody: 'Bulldozer',
	realBulldozerWindows: 'Windows',
	realBulldozerDoor: 'Door',
	realBulldozerTracks: 'Tracks',
	realBulldozerBlade: 'Blade',
	realForkliftBody: 'Forklift',
	realForkliftWindows: 'Windows',
	realForkliftForks: 'Pallet forks',
	realForkliftWheel: 'Wheel',
	realRoadRollerBody: 'Road roller',
	realRoadRollerWindows: 'Windows',
	realRoadRollerDoor: 'Door',
	realRoadRollerDrum: 'Drum',
	realTelehandlerBody: 'Telehandler',
	realTelehandlerWindows: 'Windows',
	realTelehandlerDoor: 'Door',
	realTelehandlerWheel: 'Wheel',
	realSnowPloughBody: 'Snow plough',
	realSnowPloughWindows: 'Windows',
	realSnowPloughDoor: 'Door',
	realSnowPloughPlough: 'Plough',
	realSnowPloughWheel: 'Wheel',
	realStreetSweeperBody: 'Street sweeper',
	realStreetSweeperWindows: 'Windows',
	realStreetSweeperDoor: 'Door',
	realStreetSweeperWheel: 'Wheel',
	realMonsterTruckBody: 'Monster truck',
	realMonsterTruckWindows: 'Windows',
	realMonsterTruckDoor: 'Door',
	realMonsterTruckWheel: 'Wheel',
	realFoodTruckBody: 'Food truck',
	realFoodTruckWindows: 'Windows',
	realFoodTruckDoor: 'Side door',
	realFoodTruckWheel: 'Wheel',
	realCombineHarvesterBody: 'Combine harvester',
	realCombineHarvesterWindows: 'Windows',
	realCombineHarvesterDoor: 'Door',
	realCombineHarvesterWheel: 'Wheel',
	realCombineHarvesterHeader: 'Header',
	realSkidSteerBody: 'Skid-steer loader',
	realSkidSteerWindows: 'Windows',
	realSkidSteerBucket: 'Bucket',
	realSkidSteerWheel: 'Wheel',
	realBackhoeLoaderBody: 'Backhoe loader',
	realBackhoeLoaderWindows: 'Windows',
	realBackhoeLoaderBackhoe: 'Backhoe arm',
	realBackhoeLoaderWheel: 'Wheel',
	realWheelLoaderBody: 'Wheel loader',
	realWheelLoaderWindows: 'Windows',
	realWheelLoaderBucket: 'Bucket',
	realWheelLoaderWheel: 'Wheel',
	realMotorGraderBody: 'Motor grader',
	realMotorGraderWindows: 'Windows',
	realMotorGraderBlade: 'Blade',
	realMotorGraderWheel: 'Wheel',
	realArticulatedHaulerBody: 'Articulated hauler',
	realArticulatedHaulerWindows: 'Windows',
	realArticulatedHaulerTipper: 'Tipper',
	realArticulatedHaulerWheel: 'Wheel',
	realCropSprayerBody: 'Crop sprayer',
	realCropSprayerWindows: 'Windows',
	realCropSprayerBoom: 'Spray boom',
	realCropSprayerWheel: 'Wheel',
	realHayBalerBody: 'Hay baler',
	realHayBalerBale: 'Round bale',
	realHayBalerDrawbar: 'Drawbar',
	realHayBalerWheel: 'Wheel',
	realSteamRollerBody: 'Steam roller',
	realSteamRollerCanopy: 'Canopy',
	realSteamRollerDrum: 'Front drum',
	realSteamRollerWheel: 'Wheel',
	realQuadBikeBody: 'Quad bike',
	realQuadBikeSeat: 'Seat',
	realQuadBikeRack: 'Cargo rack',
	realQuadBikeWheel: 'Wheel',
	realMiniDumperBody: 'Mini dumper',
	realMiniDumperSkip: 'Skip',
	realMiniDumperSeat: 'Seat and roll bar',
	realMiniDumperWheel: 'Wheel',
	realVanBody: 'Panel van',
	realVanWindows: 'Windows',
	realVanDoor: 'Sliding side door',
	realVanWheel: 'Wheel',
	realSkipLoaderBody: 'Skip-loader truck',
	realSkipLoaderWindows: 'Windows',
	realSkipLoaderSkip: 'Skip',
	realSkipLoaderWheel: 'Wheel',
	realHookLiftTruckBody: 'Hook-lift truck',
	realHookLiftTruckWindows: 'Windows',
	realHookLiftTruckContainer: 'Container',
	realHookLiftTruckWheel: 'Wheel',
	realConcretePumpBody: 'Concrete pump truck',
	realConcretePumpWindows: 'Windows',
	realConcretePumpBoom: 'Folding boom',
	realConcretePumpWheel: 'Wheel',
	realGritterTruckBody: 'Gritter truck',
	realGritterTruckWindows: 'Windows',
	realGritterTruckHopper: 'Grit hopper',
	realGritterTruckWheel: 'Wheel',
	realSnowBlowerBody: 'Snow blower',
	realSnowBlowerWindows: 'Windows',
	realSnowBlowerAuger: 'Auger housing',
	realSnowBlowerWheel: 'Wheel',
	realRoadPlanerBody: 'Road planer',
	realRoadPlanerWindows: 'Windows',
	realRoadPlanerDrum: 'Cutting drum',
	realRoadPlanerWheel: 'Wheel',
	realAsphaltPaverBody: 'Asphalt paver',
	realAsphaltPaverWindows: 'Windows',
	realAsphaltPaverScreed: 'Screed',
	realAsphaltPaverWheel: 'Wheel',
	realSewerCleanerBody: 'Sewer-cleaning truck',
	realSewerCleanerWindows: 'Windows',
	realSewerCleanerReel: 'Hose reel',
	realSewerCleanerWheel: 'Wheel',
	realAirportFuelBowserBody: 'Airport fuel bowser',
	realAirportFuelBowserTank: 'Fuel tank',
	realAirportFuelBowserWindows: 'Windows',
	realAirportFuelBowserWheel: 'Wheel',
	realAerialLadderBody: 'Aerial ladder truck',
	realAerialLadderWindows: 'Windows',
	realAerialLadderLadder: 'Aerial ladder',
	realAerialLadderWheel: 'Wheel',
	realAirportFireTruckBody: 'Airport fire truck',
	realAirportFireTruckWindows: 'Windows',
	realAirportFireTruckMonitor: 'Water monitor',
	realAirportFireTruckWheel: 'Wheel',
	realHazmatTruckBody: 'Hazmat truck',
	realHazmatTruckWindows: 'Windows',
	realHazmatTruckTank: 'Chemical tank',
	realHazmatTruckWheel: 'Wheel',
	realRescueTruckBody: 'Rescue truck',
	realRescueTruckWindows: 'Windows',
	realRescueTruckShutter: 'Rear roller shutter',
	realRescueTruckWheel: 'Wheel',
	realCherryPickerBody: 'Cherry picker',
	realCherryPickerWindows: 'Windows',
	realCherryPickerBoom: 'Boom and basket',
	realCherryPickerWheel: 'Wheel',
	realScissorLiftBody: 'Scissor lift',
	realScissorLiftScissor: 'Scissor stack',
	realScissorLiftPlatform: 'Platform',
	realScissorLiftWheel: 'Wheel',
	realAllTerrainCraneBody: 'Crane carrier',
	realAllTerrainCraneWindows: 'Windows',
	realAllTerrainCraneBoom: 'Telescopic boom',
	realAllTerrainCraneWheel: 'Wheel',
	realSideLoaderGarbageBody: 'Side-loader garbage truck',
	realSideLoaderGarbageWindows: 'Windows',
	realSideLoaderGarbageBin: 'Wheelie bin',
	realSideLoaderGarbageWheel: 'Wheel',
	realRecyclingTruckBody: 'Recycling truck',
	realRecyclingTruckWindows: 'Windows',
	realRecyclingTruckHopper: 'Recycling hopper',
	realRecyclingTruckWheel: 'Wheel',
	realIceCreamTruckBody: 'Ice-cream truck',
	realIceCreamTruckWindows: 'Windows',
	realIceCreamTruckHatch: 'Serving hatch',
	realIceCreamTruckWheel: 'Wheel',
	realMilkFloatBody: 'Milk float',
	realMilkFloatWindows: 'Windows',
	realMilkFloatCrates: 'Milk crates',
	realMilkFloatWheel: 'Wheel',

};

export function partName(part: PartId): string {
	return PART_NAMES[part];
}
