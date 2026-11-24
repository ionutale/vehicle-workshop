import type { Role } from './parts';
import type { Slot, Vehicle } from './vehicles';

/**
 * The wider fleet: farm, haulage, public transport and works machines. Kept apart from the
 * original six so `vehicles.ts` stays readable; same slot/part model, same rules.
 */

const pal = (shell: string, trim: string): Record<Role, string> => ({
	shell,
	trim,
	glass: '#CFEFFF',
	rubber: '#2B2D42',
	lamp: '#FFE066'
});

const wheel = (side: 'l' | 'r', x: number, y: number, scale = 1): Slot => ({
	id: `wheel-${side}`,
	part: 'wheel',
	x,
	y,
	scale,
	flip: side === 'r',
	z: 4
});

function slab(width: number, groundY: number, height = 140): string {
	const left = 30;
	const right = width - 30;
	const top = groundY - height;
	const r = 22;
	return `M${left + r},${top} L${right - r},${top} Q${right},${top} ${right},${top + r} L${right},${groundY} L${left},${groundY} L${left},${top + r} Q${left},${top} ${left + r},${top} Z`;
}

export const FLEET: Vehicle[] = [
	// ── Farm and land ────────────────────────────────────────────────────────────────
	{
		id: 'combine-harvester',
		name: 'Combine harvester',
		width: 900,
		height: 315,
		groundY: 281,
		palette: pal('#F9C74F', '#2B2D42'),
		chassisPath: slab(900, 281, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realCombineHarvesterBody', x: 521, y: 160, z: 0 },
			{ id: 'windows', part: 'realCombineHarvesterWindows', x: 325, y: 155, z: 1 },
			{ id: 'door', part: 'realCombineHarvesterDoor', x: 314, y: 214, z: 2 },
			{ id: 'header', part: 'realCombineHarvesterHeader', x: 77, y: 220.5, z: 3 },
			{ id: 'wheel-l', part: 'realCombineHarvesterWheel', x: 180, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realCombineHarvesterWheel', x: 720, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'crop-sprayer',
		name: 'Crop sprayer',
		width: 800,
		height: 306,
		groundY: 274,
		palette: pal('#90BE6D', '#F9C74F'),
		chassisPath: slab(800, 274, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realCropSprayerBody', x: 353, y: 126, z: 0 },
			{ id: 'windows', part: 'realCropSprayerWindows', x: 259.5, y: 96, z: 1 },
			{ id: 'boom', part: 'realCropSprayerBoom', x: 560, y: 183, z: 3 },
			{ id: 'wheel-l', part: 'realCropSprayerWheel', x: 160, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realCropSprayerWheel', x: 620, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'hay-baler',
		name: 'Hay baler',
		width: 720,
		height: 300,
		groundY: 268,
		palette: pal('#E9C46A', '#2A9D8F'),
		chassisPath: slab(720, 268, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realHayBalerBody', x: 367, y: 182, z: 0 },
			{ id: 'drawbar', part: 'realHayBalerDrawbar', x: 37, y: 226, z: 1 },
			{ id: 'bale', part: 'realHayBalerBale', x: 602, y: 160, z: 2 },
			{ id: 'wheel-l', part: 'realHayBalerWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realHayBalerWheel', x: 540, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'telehandler',
		name: 'Telehandler',
		width: 760,
		height: 310,
		groundY: 276,
		palette: pal('#F4A261', '#264653'),
		chassisPath: slab(760, 276, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realTelehandlerBody', x: 362, y: 178, z: 0 },
			{ id: 'windows', part: 'realTelehandlerWindows', x: 224, y: 175, z: 1 },
			{ id: 'door', part: 'realTelehandlerDoor', x: 244, y: 224, z: 2 },
			{ id: 'wheel-l', part: 'realTelehandlerWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realTelehandlerWheel', x: 560, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'skid-steer',
		name: 'Skid-steer loader',
		width: 620,
		height: 300,
		groundY: 264,
		palette: pal('#F9C74F', '#2B2D42'),
		chassisPath: slab(620, 264, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realSkidSteerBody', x: 318, y: 156, z: 0 },
			{ id: 'windows', part: 'realSkidSteerWindows', x: 277, y: 124, z: 1 },
			{ id: 'bucket', part: 'realSkidSteerBucket', x: 73.5, y: 209.5, z: 2 },
			{ id: 'wheel-l', part: 'realSkidSteerWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realSkidSteerWheel', x: 450, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'backhoe-loader',
		name: 'Backhoe loader',
		width: 760,
		height: 310,
		groundY: 272,
		palette: pal('#F4A261', '#2B2D42'),
		chassisPath: slab(760, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realBackhoeLoaderBody', x: 341, y: 163, z: 0 },
			{ id: 'windows', part: 'realBackhoeLoaderWindows', x: 488, y: 148, z: 1 },
			{ id: 'backhoe', part: 'realBackhoeLoaderBackhoe', x: 698, y: 188, z: 2 },
			{ id: 'wheel-l', part: 'realBackhoeLoaderWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realBackhoeLoaderWheel', x: 600, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'wheel-loader',
		name: 'Wheel loader',
		width: 760,
		height: 310,
		groundY: 278,
		palette: pal('#E9C46A', '#264653'),
		chassisPath: slab(760, 278, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realWheelLoaderBody', x: 424, y: 167, z: 0 },
			{ id: 'windows', part: 'realWheelLoaderWindows', x: 371, y: 149, z: 1 },
			{ id: 'bucket', part: 'realWheelLoaderBucket', x: 62.75, y: 215.25, z: 2 },
			{ id: 'wheel-l', part: 'realWheelLoaderWheel', x: 160, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realWheelLoaderWheel', x: 620, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'motor-grader',
		name: 'Motor grader',
		width: 820,
		height: 300,
		groundY: 270,
		palette: pal('#F9C74F', '#264653'),
		chassisPath: slab(820, 270, 190),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realMotorGraderBody', x: 431, y: 148.5, z: 0 },
			{ id: 'windows', part: 'realMotorGraderWindows', x: 584, y: 88, z: 1 },
			{ id: 'blade', part: 'realMotorGraderBlade', x: 394.5, y: 229, z: 2 },
			{ id: 'wheel-l', part: 'realMotorGraderWheel', x: 160, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realMotorGraderWheel', x: 660, y: 236, z: 4, flip: true }
		]
	},
	// ── Heavy haulage ────────────────────────────────────────────────────────────────
	{
		id: 'articulated-hauler',
		name: 'Articulated hauler',
		width: 780,
		height: 310,
		groundY: 278,
		palette: pal('#F9C74F', '#2B2D42'),
		chassisPath: slab(780, 278, 190),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realArticulatedHaulerBody', x: 387, y: 155, z: 0 },
			{ id: 'windows', part: 'realArticulatedHaulerWindows', x: 158, y: 137, z: 1 },
			{ id: 'tipper', part: 'realArticulatedHaulerTipper', x: 534, y: 128.5, z: 2 },
			{ id: 'wheel-l', part: 'realArticulatedHaulerWheel', x: 160, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realArticulatedHaulerWheel', x: 620, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'dump-truck',
		name: 'Dump truck',
		width: 760,
		height: 370,
		groundY: 272,
		palette: pal('#E63946', '#2B2D42'),
		chassisPath: slab(760, 272, 190),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realDumpTruckBody', x: 388, y: 155, z: 0 },
			{ id: 'windows', part: 'realDumpTruckWindows', x: 152, y: 138, z: 1 },
			{ id: 'door', part: 'realDumpTruckDoor', x: 237, y: 209, z: 2 },
			{ id: 'wheel-l', part: 'realDumpTruckWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realDumpTruckWheel', x: 600, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'refrigerated-truck',
		name: 'Refrigerated truck',
		width: 780,
		height: 340,
		groundY: 272,
		palette: pal('#F7F9FC', '#457B9D'),
		chassisPath: slab(780, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realRefrigeratedTruckBody', x: 387, y: 160, z: 0 },
			{ id: 'windows', part: 'realRefrigeratedTruckWindows', x: 109, y: 149, z: 1 },
			{ id: 'door', part: 'realRefrigeratedTruckDoor', x: 513, y: 150, z: 2 },
			{ id: 'wheel-l', part: 'realRefrigeratedTruckWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realRefrigeratedTruckWheel', x: 620, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'box-truck',
		name: 'Box truck',
		width: 700,
		height: 340,
		groundY: 300,
		palette: pal('#2C5AA0', '#F4F6FA'),
		chassisPath: slab(700, 300, 160),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realTruckBox', x: 439, y: 182.5, z: 0 },
			{ id: 'cab', part: 'realTruckCab', x: 118, y: 194, z: 1 },
			{ id: 'door', part: 'realTruckDoor', x: 613, y: 191, z: 2 },
			{ id: 'wheel-l', part: 'realTruckWheel', x: 150, y: 264, z: 4 },
			{ id: 'wheel-r', part: 'realTruckWheel', x: 560, y: 264, z: 4, flip: true }
		]
	},
	{
		id: 'curtain-side-lorry',
		name: 'Curtain-side lorry',
		width: 800,
		height: 360,
		groundY: 272,
		palette: pal('#457B9D', '#CED4DA'),
		chassisPath: slab(800, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realCurtainSideLorryBody', x: 397, y: 170, z: 0 },
			{ id: 'windows', part: 'realCurtainSideLorryWindows', x: 108, y: 144, z: 1 },
			{ id: 'door', part: 'realCurtainSideLorryDoor', x: 160, y: 219, z: 2 },
			{ id: 'wheel-l', part: 'realCurtainSideLorryWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realCurtainSideLorryWheel', x: 640, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'skip-loader',
		name: 'Skip-loader truck',
		width: 680,
		height: 300,
		groundY: 244,
		palette: pal('#E76F51', '#2B2D42'),
		chassisPath: slab(680, 244, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realSkipLoaderBody', x: 338, y: 148, z: 0 },
			{ id: 'windows', part: 'realSkipLoaderWindows', x: 122, y: 144, z: 1 },
			{ id: 'skip', part: 'realSkipLoaderSkip', x: 440, y: 114, z: 2 },
			{ id: 'wheel-l', part: 'realSkipLoaderWheel', x: 170, y: 216, z: 4 },
			{ id: 'wheel-r', part: 'realSkipLoaderWheel', x: 510, y: 216, z: 4, flip: true }
		]
	},
	{
		id: 'hook-lift-truck',
		name: 'Hook-lift truck',
		width: 700,
		height: 310,
		groundY: 250,
		palette: pal('#2A9D8F', '#264653'),
		chassisPath: slab(700, 250, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realHookLiftTruckBody', x: 354, y: 136, z: 0 },
			{ id: 'windows', part: 'realHookLiftTruckWindows', x: 115.5, y: 147.5, z: 1 },
			{ id: 'container', part: 'realHookLiftTruckContainer', x: 424, y: 129, z: 2 },
			{ id: 'wheel-l', part: 'realHookLiftTruckWheel', x: 170, y: 222, z: 4 },
			{ id: 'wheel-r', part: 'realHookLiftTruckWheel', x: 520, y: 222, z: 4, flip: true }
		]
	},
	{
		id: 'livestock-truck',
		name: 'Livestock truck',
		width: 800,
		height: 300,
		groundY: 272,
		palette: pal('#8AC6D1', '#6D597A'),
		chassisPath: slab(800, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realLivestockTruckBody', x: 396, y: 149, z: 0 },
			{ id: 'windows', part: 'realLivestockTruckWindows', x: 107, y: 149, z: 1 },
			{ id: 'door', part: 'realLivestockTruckDoor', x: 109, y: 217, z: 2 },
			{ id: 'wheel-l', part: 'realLivestockTruckWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realLivestockTruckWheel', x: 640, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'concrete-pump',
		name: 'Concrete pump truck',
		width: 760,
		height: 340,
		groundY: 262,
		palette: pal('#F4A261', '#264653'),
		chassisPath: slab(760, 262, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realConcretePumpBody', x: 379, y: 180, z: 0 },
			{ id: 'windows', part: 'realConcretePumpWindows', x: 109, y: 166, z: 1 },
			{ id: 'boom', part: 'realConcretePumpBoom', x: 464, y: 115, z: 2 },
			{ id: 'wheel-l', part: 'realConcretePumpWheel', x: 170, y: 230, z: 4 },
			{ id: 'wheel-r', part: 'realConcretePumpWheel', x: 560, y: 230, z: 4, flip: true }
		]
	},
	{
		id: 'water-tanker',
		name: 'Water tanker',
		width: 780,
		height: 340,
		groundY: 272,
		palette: pal('#4E9BD4', '#F7F9FC'),
		chassisPath: slab(780, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realWaterTankerBody', x: 392, y: 177, z: 0 },
			{ id: 'windows', part: 'realWaterTankerWindows', x: 111, y: 143, z: 1 },
			{ id: 'door', part: 'realWaterTankerDoor', x: 117, y: 215, z: 2 },
			{ id: 'wheel-l', part: 'realWaterTankerWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realWaterTankerWheel', x: 620, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'gritter-truck',
		name: 'Gritter truck',
		width: 700,
		height: 320,
		groundY: 252,
		palette: pal('#F9C74F', '#264653'),
		chassisPath: slab(700, 252, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realGritterTruckBody', x: 346, y: 162, z: 0 },
			{ id: 'windows', part: 'realGritterTruckWindows', x: 153, y: 138, z: 1 },
			{ id: 'hopper', part: 'realGritterTruckHopper', x: 528, y: 125, z: 2 },
			{ id: 'wheel-l', part: 'realGritterTruckWheel', x: 170, y: 222, z: 4 },
			{ id: 'wheel-r', part: 'realGritterTruckWheel', x: 530, y: 222, z: 4, flip: true }
		]
	},
	{
		id: 'snow-blower',
		name: 'Snow blower',
		width: 680,
		height: 320,
		groundY: 252,
		palette: pal('#E9ECEF', '#1D3557'),
		chassisPath: slab(680, 252, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realSnowBlowerBody', x: 396, y: 139, z: 0 },
			{ id: 'windows', part: 'realSnowBlowerWindows', x: 240, y: 170, z: 1 },
			{ id: 'auger', part: 'realSnowBlowerAuger', x: 92, y: 194.5, z: 3 },
			{ id: 'wheel-l', part: 'realSnowBlowerWheel', x: 200, y: 222, z: 4 },
			{ id: 'wheel-r', part: 'realSnowBlowerWheel', x: 520, y: 222, z: 4, flip: true }
		]
	},
	// ── Road works ───────────────────────────────────────────────────────────────────
	{
		id: 'road-planer',
		name: 'Road planer',
		width: 760,
		height: 320,
		groundY: 252,
		palette: pal('#F4A261', '#2B2D42'),
		chassisPath: slab(760, 252, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realRoadPlanerBody', x: 394, y: 138, z: 0 },
			{ id: 'windows', part: 'realRoadPlanerWindows', x: 623, y: 126, z: 1 },
			{ id: 'drum', part: 'realRoadPlanerDrum', x: 410, y: 221, z: 2 },
			{ id: 'wheel-l', part: 'realRoadPlanerWheel', x: 180, y: 222, z: 4 },
			{ id: 'wheel-r', part: 'realRoadPlanerWheel', x: 600, y: 222, z: 4, flip: true }
		]
	},
	{
		id: 'asphalt-paver',
		name: 'Asphalt paver',
		width: 700,
		height: 310,
		groundY: 246,
		palette: pal('#F9C74F', '#6B6B6B'),
		chassisPath: slab(700, 246, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realAsphaltPaverBody', x: 319, y: 129, z: 0 },
			{ id: 'windows', part: 'realAsphaltPaverWindows', x: 250, y: 109.5, z: 1 },
			{ id: 'screed', part: 'realAsphaltPaverScreed', x: 628, y: 207, z: 2 },
			{ id: 'wheel-l', part: 'realAsphaltPaverWheel', x: 170, y: 216, z: 4 },
			{ id: 'wheel-r', part: 'realAsphaltPaverWheel', x: 520, y: 216, z: 4, flip: true }
		]
	},
	{
		id: 'sewer-cleaner',
		name: 'Sewer-cleaning truck',
		width: 660,
		height: 300,
		groundY: 244,
		palette: pal('#90BE6D', '#264653'),
		chassisPath: slab(660, 244, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realSewerCleanerBody', x: 332, y: 148, z: 0 },
			{ id: 'windows', part: 'realSewerCleanerWindows', x: 113, y: 132, z: 1 },
			{ id: 'reel', part: 'realSewerCleanerReel', x: 598, y: 173, z: 2 },
			{ id: 'wheel-l', part: 'realSewerCleanerWheel', x: 170, y: 216, z: 4 },
			{ id: 'wheel-r', part: 'realSewerCleanerWheel', x: 500, y: 216, z: 4, flip: true }
		]
	},
	{
		id: 'airport-fuel-bowser',
		name: 'Airport fuel bowser',
		width: 660,
		height: 300,
		groundY: 244,
		palette: pal('#FFB703', '#023047'),
		chassisPath: slab(660, 244, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realAirportFuelBowserBody', x: 333, y: 159, z: 0 },
			{ id: 'tank', part: 'realAirportFuelBowserTank', x: 373, y: 139, z: 1 },
			{ id: 'windows', part: 'realAirportFuelBowserWindows', x: 95, y: 145, z: 2 },
			{ id: 'wheel-l', part: 'realAirportFuelBowserWheel', x: 170, y: 216, z: 4 },
			{ id: 'wheel-r', part: 'realAirportFuelBowserWheel', x: 500, y: 216, z: 4, flip: true }
		]
	},
	{
		id: 'mobile-library',
		name: 'Mobile library',
		width: 780,
		height: 340,
		groundY: 270,
		palette: pal('#8AC6D1', '#F2E8CF'),
		chassisPath: slab(780, 270, 160),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realMobileLibraryBody', x: 423, y: 166, z: 0 },
			{ id: 'windows', part: 'realMobileLibraryWindows', x: 320, y: 148, z: 1 },
			{ id: 'door', part: 'realMobileLibraryDoor', x: 579, y: 177, z: 2 },
			{ id: 'wheel-l', part: 'realMobileLibraryWheel', x: 160, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realMobileLibraryWheel', x: 620, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'mobile-clinic',
		name: 'Mobile clinic',
		width: 780,
		height: 340,
		groundY: 270,
		palette: pal('#F7F9FC', '#E63946'),
		chassisPath: slab(780, 270, 160),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realMobileClinicBody', x: 423, y: 164, z: 0 },
			{ id: 'windows', part: 'realMobileClinicWindows', x: 368, y: 144, z: 1 },
			{ id: 'door', part: 'realMobileClinicDoor', x: 579, y: 177, z: 2 },
			{ id: 'wheel-l', part: 'realMobileClinicWheel', x: 160, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realMobileClinicWheel', x: 620, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'parcel-lorry',
		name: 'Parcel lorry',
		width: 780,
		height: 360,
		groundY: 272,
		palette: pal('#C1121F', '#F2E8CF'),
		chassisPath: slab(780, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realParcelLorryBody', x: 392, y: 150, z: 0 },
			{ id: 'windows', part: 'realParcelLorryWindows', x: 111, y: 144, z: 1 },
			{ id: 'door', part: 'realParcelLorryDoor', x: 520, y: 151, z: 2 },
			{ id: 'wheel-l', part: 'realParcelLorryWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realParcelLorryWheel', x: 620, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'removals-van',
		name: 'Removals van',
		width: 780,
		height: 360,
		groundY: 272,
		palette: pal('#6A994E', '#F2E8CF'),
		chassisPath: slab(780, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realRemovalsVanBody', x: 388, y: 143, z: 0 },
			{ id: 'windows', part: 'realRemovalsVanWindows', x: 111, y: 142, z: 1 },
			{ id: 'door', part: 'realRemovalsVanDoor', x: 516, y: 151, z: 2 },
			{ id: 'wheel-l', part: 'realRemovalsVanWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realRemovalsVanWheel', x: 620, y: 236, z: 4, flip: true }
		]
	},
	// ── Public transport ─────────────────────────────────────────────────────────────
	{
		id: 'double-decker',
		name: 'Double-decker bus',
		width: 760,
		height: 400,
		groundY: 360,
		palette: pal('#E63946', '#F7F9FC'),
		chassisPath: slab(760, 360, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realDoubleDeckerBody', x: 387, y: 200, z: 0 },
			{ id: 'windows', part: 'realDoubleDeckerWindows', x: 370, y: 172.5, z: 1 },
			{ id: 'door', part: 'realDoubleDeckerDoor', x: 618, y: 255, z: 2 },
			{ id: 'wheel-l', part: 'realDoubleDeckerWheel', x: 160, y: 324, z: 4 },
			{ id: 'wheel-r', part: 'realDoubleDeckerWheel', x: 600, y: 324, z: 4, flip: true }
		]
	},
	{
		id: 'bendy-bus',
		name: 'Bendy bus',
		width: 900,
		height: 340,
		groundY: 272,
		palette: pal('#F9C74F', '#2B2D42'),
		chassisPath: slab(900, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realBendyBusBody', x: 461, y: 168, z: 0 },
			{ id: 'windows', part: 'realBendyBusWindows', x: 468, y: 122, z: 1 },
			{ id: 'door', part: 'realBendyBusDoor', x: 769, y: 165, z: 2 },
			{ id: 'wheel-l', part: 'realBendyBusWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realBendyBusWheel', x: 760, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'coach-bus',
		name: 'Coach bus',
		width: 860,
		height: 360,
		groundY: 288,
		palette: pal('#457B9D', '#F7F9FC'),
		chassisPath: slab(860, 288, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realCoachBusBody', x: 447, y: 172, z: 0 },
			{ id: 'windows', part: 'realCoachBusWindows', x: 452, y: 134, z: 1 },
			{ id: 'door', part: 'realCoachBusDoor', x: 714, y: 170, z: 2 },
			{ id: 'wheel-l', part: 'realCoachBusWheel', x: 170, y: 252, z: 4 },
			{ id: 'wheel-r', part: 'realCoachBusWheel', x: 640, y: 252, z: 4, flip: true }
		]
	},
	{
		id: 'trolleybus',
		name: 'Trolleybus',
		width: 820,
		height: 400,
		groundY: 272,
		palette: pal('#2A9D8F', '#F2E8CF'),
		chassisPath: slab(820, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realTrolleybusBody', x: 438.5, y: 154, z: 0 },
			{ id: 'windows', part: 'realTrolleybusWindows', x: 432, y: 142, z: 1 },
			{ id: 'door', part: 'realTrolleybusDoor', x: 689, y: 180, z: 2 },
			{ id: 'wheel-l', part: 'realTrolleybusWheel', x: 160, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realTrolleybusWheel', x: 640, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'airport-shuttle',
		name: 'Airport shuttle bus',
		width: 760,
		height: 320,
		groundY: 262,
		palette: pal('#F7F9FC', '#457B9D'),
		chassisPath: slab(760, 262, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realAirportShuttleBody', x: 393, y: 170, z: 0 },
			{ id: 'windows', part: 'realAirportShuttleWindows', x: 404, y: 140, z: 1 },
			{ id: 'door', part: 'realAirportShuttleDoor', x: 582, y: 176, z: 2 },
			{ id: 'wheel-l', part: 'realAirportShuttleWheel', x: 160, y: 228, z: 4 },
			{ id: 'wheel-r', part: 'realAirportShuttleWheel', x: 640, y: 228, z: 4, flip: true }
		]
	},
	{
		id: 'light-rail-train',
		name: 'Light-rail train',
		width: 900,
		height: 380,
		groundY: 272,
		palette: pal('#E76F51', '#F2E8CF'),
		chassisPath: slab(900, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realLightRailTrainBody', x: 458, y: 135, z: 0 },
			{ id: 'windows', part: 'realLightRailTrainWindows', x: 461, y: 146, z: 1 },
			{ id: 'door', part: 'realLightRailTrainDoor', x: 598, y: 180, z: 2 },
			{ id: 'wheel-l', part: 'realLightRailTrainWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realLightRailTrainWheel', x: 700, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'metro-train',
		name: 'Metro train',
		width: 900,
		height: 380,
		groundY: 272,
		palette: pal('#F1FAEE', '#1D3557'),
		chassisPath: slab(900, 272, 170),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realMetroTrainBody', x: 458, y: 128, z: 0 },
			{ id: 'windows', part: 'realMetroTrainWindows', x: 475, y: 148, z: 1 },
			{ id: 'door', part: 'realMetroTrainDoor', x: 608, y: 164, z: 2 },
			{ id: 'wheel-l', part: 'realMetroTrainWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realMetroTrainWheel', x: 700, y: 236, z: 4, flip: true }
		]
	},
	// ── Emergency and service ────────────────────────────────────────────────────────
	{
		id: 'aerial-ladder',
		name: 'Aerial ladder truck',
		width: 680,
		height: 330,
		groundY: 215,
		palette: pal('#E63946', '#F7F9FC'),
		chassisPath: slab(680, 215, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 350, y: 175, z: 0, scale: 1 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'ladder', part: 'ladder', x: 420, y: 80, z: 2, scale: 2.6 },
			{ id: 'lights', part: 'lightBar', x: 120, y: 72, z: 2 },
			{ id: 'beacon', part: 'beacon', x: 300, y: 88, z: 2 },
			wheel('l', 180, 215),
			wheel('r', 540, 215)
		]
	},
	{
		id: 'airport-fire-truck',
		name: 'Airport fire truck',
		width: 660,
		height: 310,
		groundY: 218,
		palette: pal('#C1121F', '#F9C74F'),
		chassisPath: slab(660, 218, 160),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 165, z: 0, scale: 1.05 },
			{ id: 'cab', part: 'cab', x: 110, y: 125, z: 1, scale: 1 },
			{ id: 'lights', part: 'lightBar', x: 110, y: 66, z: 2 },
			{ id: 'hose', part: 'hoseReel', x: 480, y: 120, z: 2 },
			{ id: 'bumper', part: 'bumper', x: 630, y: 190, z: 2 },
			wheel('l', 180, 218),
			wheel('r', 520, 218)
		]
	},
	{
		id: 'hazmat-truck',
		name: 'Hazmat truck',
		width: 640,
		height: 290,
		groundY: 214,
		palette: pal('#F9C74F', '#1D3557'),
		chassisPath: slab(640, 214, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 340, y: 196, z: 0, scale: 0.75 },
			{ id: 'tank', part: 'tank', x: 390, y: 145, z: 1, scale: 1.05 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 2, scale: 0.9 },
			{ id: 'lights', part: 'lightBar', x: 120, y: 72, z: 3 },
			wheel('l', 180, 214),
			wheel('r', 520, 214)
		]
	},
	{
		id: 'police-van',
		name: 'Police van',
		width: 720,
		height: 340,
		groundY: 272,
		palette: pal('#1D3557', '#F1FAEE'),
		chassisPath: slab(720, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realPoliceVanBody', x: 359, y: 163, z: 0 },
			{ id: 'windows', part: 'realPoliceVanWindows', x: 381, y: 143, z: 1 },
			{ id: 'door', part: 'realPoliceVanDoor', x: 363, y: 179, z: 2 },
			{ id: 'wheel-l', part: 'realPoliceVanWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realPoliceVanWheel', x: 580, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'rescue-truck',
		name: 'Rescue truck',
		width: 600,
		height: 290,
		groundY: 212,
		palette: pal('#E63946', '#F1FAEE'),
		chassisPath: slab(600, 212, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 320, y: 165, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.95 },
			{ id: 'lights', part: 'lightBar', x: 120, y: 70, z: 2 },
			{ id: 'door', part: 'door', x: 300, y: 165, z: 2 },
			{ id: 'beacon', part: 'beacon', x: 460, y: 92, z: 2 },
			wheel('l', 170, 212),
			wheel('r', 500, 212)
		]
	},
	{
		id: 'cherry-picker',
		name: 'Cherry picker',
		width: 620,
		height: 350,
		groundY: 218,
		palette: pal('#F4A261', '#264653'),
		chassisPath: slab(620, 218, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 300, y: 180, z: 0, scale: 0.9 },
			{ id: 'cab', part: 'cab', x: 120, y: 128, z: 1, scale: 0.9 },
			{ id: 'boom', part: 'boom', x: 380, y: 110, z: 2, scale: 1.1 },
			{ id: 'basket', part: 'bucket', x: 530, y: 68, z: 3, scale: 0.8 },
			wheel('l', 170, 218),
			wheel('r', 500, 218)
		]
	},
	{
		id: 'scissor-lift',
		name: 'Scissor lift',
		width: 480,
		height: 330,
		groundY: 238,
		palette: pal('#F9C74F', '#6B6B6B'),
		chassisPath: slab(480, 238, 90),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 240, y: 205, z: 0, scale: 0.55 },
			{ id: 'frame', part: 'scissor', x: 240, y: 160, z: 1, scale: 1.1 },
			{ id: 'platform', part: 'flatbed', x: 240, y: 112, z: 2, scale: 0.7 },
			{ id: 'beacon', part: 'beacon', x: 310, y: 200, z: 2 },
			wheel('l', 140, 238, 0.8),
			wheel('r', 340, 238, 0.8)
		]
	},
	{
		id: 'all-terrain-crane',
		name: 'All-terrain crane',
		width: 680,
		height: 350,
		groundY: 220,
		palette: pal('#F9C74F', '#2B2D42'),
		chassisPath: slab(680, 220, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 185, z: 0, scale: 1 },
			{ id: 'cab', part: 'cab', x: 120, y: 128, z: 1, scale: 0.9 },
			{ id: 'boom', part: 'boom', x: 400, y: 92, z: 2, scale: 1.4 },
			{ id: 'hook', part: 'hook', x: 610, y: 55, z: 3 },
			wheel('l', 170, 220, 1.15),
			wheel('r', 540, 220, 1.15)
		]
	},
	{
		id: 'side-loader-garbage',
		name: 'Side-loader garbage truck',
		width: 640,
		height: 300,
		groundY: 214,
		palette: pal('#2A9D8F', '#264653'),
		chassisPath: slab(640, 214, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 170, z: 0, scale: 1 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'hopper', part: 'tipper', x: 380, y: 112, z: 2, scale: 0.95 },
			{ id: 'arm', part: 'arm', x: 560, y: 165, z: 3, scale: 0.6 },
			wheel('l', 180, 214),
			wheel('r', 520, 214)
		]
	},
	{
		id: 'recycling-truck',
		name: 'Recycling truck',
		width: 640,
		height: 290,
		groundY: 214,
		palette: pal('#457B9D', '#90BE6D'),
		chassisPath: slab(640, 214, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 170, z: 0, scale: 1 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'hopper', part: 'tipper', x: 380, y: 112, z: 2, scale: 0.95 },
			{ id: 'beacon', part: 'beacon', x: 210, y: 95, z: 2 },
			wheel('l', 180, 214),
			wheel('r', 520, 214)
		]
	},
	{
		id: 'mini-dumper',
		name: 'Mini dumper',
		width: 620,
		height: 300,
		groundY: 266,
		palette: pal('#F4A261', '#2B2D42'),
		chassisPath: slab(620, 266, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realMiniDumperBody', x: 373, y: 186, z: 0 },
			{ id: 'skip', part: 'realMiniDumperSkip', x: 143, y: 172, z: 1 },
			{ id: 'seat', part: 'realMiniDumperSeat', x: 431, y: 147, z: 2 },
			{ id: 'wheel-l', part: 'realMiniDumperWheel', x: 140, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realMiniDumperWheel', x: 460, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'ice-cream-truck',
		name: 'Ice-cream truck',
		width: 580,
		height: 290,
		groundY: 212,
		palette: pal('#F7C8E0', '#F9C74F'),
		chassisPath: slab(580, 212, 160),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 300, y: 160, z: 0, scale: 1 },
			{ id: 'cab', part: 'cab', x: 110, y: 125, z: 1, scale: 0.9 },
			{ id: 'hatch', part: 'windowStrip', x: 390, y: 125, z: 2, scale: 1.6 },
			{ id: 'sign', part: 'roofSign', x: 320, y: 82, z: 1, scale: 1.3 },
			wheel('l', 160, 212),
			wheel('r', 480, 212)
		]
	},
	{
		id: 'milk-float',
		name: 'Milk float',
		width: 480,
		height: 260,
		groundY: 215,
		palette: pal('#F7F9FC', '#457B9D'),
		chassisPath: slab(480, 215, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 250, y: 162, z: 0, scale: 0.85 },
			{ id: 'roof', part: 'roof', x: 250, y: 108, z: 1, scale: 2.2 },
			{ id: 'door', part: 'door', x: 160, y: 165, z: 2 },
			{ id: 'light', part: 'light', x: 455, y: 175, z: 2 },
			wheel('l', 130, 215),
			wheel('r', 350, 215)
		]
	},
	{
		id: 'steam-roller',
		name: 'Steam roller',
		width: 700,
		height: 310,
		groundY: 272,
		palette: pal('#C1121F', '#2B2D42'),
		chassisPath: slab(700, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realSteamRollerBody', x: 431, y: 155, z: 0 },
			{ id: 'canopy', part: 'realSteamRollerCanopy', x: 544, y: 153, z: 2 },
			{ id: 'drum', part: 'realSteamRollerDrum', x: 160, y: 224, z: 4 },
			{ id: 'wheel-near', part: 'realSteamRollerWheel', x: 560, y: 242, z: 4 },
			{ id: 'wheel-far', part: 'realSteamRollerWheel', x: 592, y: 245, z: 3, scale: 0.9 }
		]
	},
	{
		id: 'quad-bike',
		name: 'Quad bike',
		width: 560,
		height: 300,
		groundY: 266,
		palette: pal('#E63946', '#2B2D42'),
		chassisPath: slab(560, 266, 110),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realQuadBikeBody', x: 265, y: 196, z: 0 },
			{ id: 'seat', part: 'realQuadBikeSeat', x: 310, y: 183, z: 1 },
			{ id: 'rack', part: 'realQuadBikeRack', x: 407, y: 180, z: 2 },
			{ id: 'wheel-l', part: 'realQuadBikeWheel', x: 130, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realQuadBikeWheel', x: 400, y: 236, z: 4, flip: true }
		]
	}];
