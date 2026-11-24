import { FLEET } from './fleet';
import type { PartId, Role } from './parts';

export interface Slot {
	id: string;
	part: PartId;
	/** Anchor in vehicle units; the part's path origin lands here. */
	x: number;
	y: number;
	flip?: boolean;
	/** Per-slot size multiplier; the tractor's rear wheels use this. */
	scale?: number;
	z: number;
}

export interface Vehicle {
	id: string;
	/** Adult-facing only; never rendered as text. */
	name: string;
	width: number;
	height: number;
	/** Vehicle-unit y where the tyres meet the road. */
	groundY: number;
	palette: Record<Role, string>;
	/** Dash-drawn silhouette, shown only while no slot is filled. */
	chassisPath: string;
	slots: Slot[];
	/** Cut-out realistic art; the full illustration supplies each part tile. */
	realistic?: boolean;
}

const palette = (
	shell: string,
	trim: string,
	glass = '#CFEFFF',
	rubber = '#2B2D42',
	lamp = '#FFE066'
): Record<Role, string> => ({ shell, trim, glass, rubber, lamp });

export const VEHICLES: Vehicle[] = [
	{
		id: 'car',
		name: 'Car',
		width: 600,
		height: 260,
		groundY: 235,
		palette: palette('#4EA8DE', '#FFF9EC'),
		chassisPath:
			'M20,150 Q20,145 26,145 L150,145 L170,105 Q178,90 196,90 L274,90 Q292,90 300,105 L320,145 L454,145 Q460,145 460,155 L460,185 Q460,200 445,200 L35,200 Q20,200 20,185 Z',
		realistic: true,
		slots: [
			{ id: 'body', part: 'realCarBody', x: 260, y: 197.5, z: 0 },
			{ id: 'cabin', part: 'realCarCabin', x: 266, y: 137, z: 1 },
			{ id: 'door', part: 'realCarDoor', x: 278.5, y: 194, z: 2 },
			{ id: 'wheel-l', part: 'realCarWheel', x: 120, y: 208, z: 4 },
			{ id: 'wheel-r', part: 'realCarWheel', x: 390, y: 208, z: 4, flip: true }
		]
	},
	{
		id: 'fire-engine',
		name: 'Fire engine',
		width: 700,
		height: 320,
		groundY: 285,
		palette: palette('#E63946', '#FFF9EC'),
		chassisPath:
			'M70,110 Q70,100 84,100 L470,100 Q530,100 530,150 L530,190 Q530,205 512,205 L86,205 Q70,205 70,190 Z',
		realistic: true,
		slots: [
			{ id: 'body', part: 'realFireBody', x: 359.5, y: 174, z: 0 },
			{ id: 'ladder', part: 'realFireLadder', x: 426.5, y: 125, z: 1 },
			{ id: 'pump', part: 'realFirePump', x: 605, y: 194, z: 2 },
			{ id: 'wheel-l', part: 'realFireWheel', x: 145, y: 249, z: 4 },
			{ id: 'wheel-r', part: 'realFireWheel', x: 545, y: 249, z: 4, flip: true }
		]
	},
	{
		id: 'bus',
		name: 'Bus',
		width: 760,
		height: 320,
		groundY: 285,
		palette: palette('#FFC94D', '#F2792B'),
		chassisPath:
			'M40,120 Q40,100 64,100 L456,100 Q480,100 480,124 L480,182 Q480,200 462,200 L58,200 Q40,200 40,182 Z',
		realistic: true,
		slots: [
			{ id: 'body', part: 'realBusBody', x: 385, y: 177.5, z: 0 },
			{ id: 'windows', part: 'realBusWindows', x: 370, y: 153, z: 1 },
			{ id: 'door', part: 'realBusDoor', x: 629, y: 184, z: 2 },
			{ id: 'wheel-l', part: 'realBusWheel', x: 165, y: 246, z: 4 },
			{ id: 'wheel-r', part: 'realBusWheel', x: 590, y: 246, z: 4, flip: true }
		]
	},
	{
		id: 'tractor',
		name: 'Tractor',
		width: 640,
		height: 330,
		groundY: 272,
		palette: palette('#59B85C', '#F4A261'),
		chassisPath: slabPath(640, 272, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realTractorBody', x: 322, y: 152, z: 0 },
			{ id: 'windows', part: 'realTractorWindows', x: 298, y: 97, z: 1 },
			{ id: 'door', part: 'realTractorDoor', x: 287, y: 175, z: 2 },
			{ id: 'wheel-l', part: 'realTractorWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realTractorWheel', x: 500, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'digger',
		name: 'Digger',
		width: 700,
		height: 360,
		groundY: 325,
		palette: palette('#F4A261', '#D9773A'),
		chassisPath:
			'M60,180 Q60,160 86,160 L300,160 L330,180 L330,210 L60,210 Z',
		realistic: true,
		slots: [
			{ id: 'tracks', part: 'realDiggerTracks', x: 236, y: 283, z: 0 },
			{ id: 'house', part: 'realDiggerHouse', x: 225, y: 171, z: 1 },
			{ id: 'beacon', part: 'realDiggerBeacon', x: 201, y: 92, z: 2 },
			{ id: 'boom', part: 'realDiggerBoom', x: 434, y: 179, z: 3 },
			{ id: 'bucket', part: 'realDiggerBucket', x: 574, y: 261, z: 3 }
		]
	},
	{
		id: 'van',
		name: 'Panel van',
		width: 560,
		height: 260,
		groundY: 220,
		palette: palette('#5AA9E6', '#FFD166'),
		chassisPath: slabPath(560, 220, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realVanBody', x: 289, y: 128, z: 0 },
			{ id: 'windows', part: 'realVanWindows', x: 143, y: 95.5, z: 1 },
			{ id: 'door', part: 'realVanDoor', x: 284, y: 137, z: 2 },
			{ id: 'wheel-l', part: 'realVanWheel', x: 140, y: 188, z: 4 },
			{ id: 'wheel-r', part: 'realVanWheel', x: 420, y: 188, z: 4, flip: true }
		]
	}];


/** A dashed slab hint: a rounded body from x=30 to width-30, sitting on the ground line. */
function slabPath(width: number, groundY: number, height = 130, topInset = 0): string {
	const left = 30;
	const right = width - 30;
	const top = groundY - height - topInset;
	const r = 22;
	return `M${left + r},${top} L${right - r},${top} Q${right},${top} ${right},${top + r} L${right},${groundY} L${left},${groundY} L${left},${top + r} Q${left},${top} ${left + r},${top} Z`;
}

const wheelSlot = (side: 'l' | 'r', x: number, y: number, scale = 1): Slot => ({
	id: `wheel-${side}`,
	part: 'wheel',
	x,
	y,
	scale,
	flip: side === 'r',
	z: 4
});

VEHICLES.push(
	{
		id: 'police-car',
		name: 'Police car',
		width: 660,
		height: 300,
		groundY: 272,
		palette: palette('#F4F6FA', '#2C5AA0'),
		chassisPath: slabPath(660, 272, 140),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realPoliceCarBody', x: 317, y: 178, z: 0 },
			{ id: 'windows', part: 'realPoliceCarWindows', x: 323, y: 155, z: 1 },
			{ id: 'door', part: 'realPoliceCarDoor', x: 306, y: 214, z: 2 },
			{ id: 'wheel-l', part: 'realPoliceCarWheel', x: 140, y: 240, z: 4 },
			{ id: 'wheel-r', part: 'realPoliceCarWheel', x: 500, y: 240, z: 4, flip: true }
		]
	},
	{
		id: 'taxi',
		name: 'Taxi',
		width: 660,
		height: 300,
		groundY: 272,
		palette: palette('#FFC94D', '#2B2D42'),
		chassisPath: slabPath(660, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realTaxiBody', x: 325, y: 162, z: 0 },
			{ id: 'windows', part: 'realTaxiWindows', x: 337, y: 144, z: 1 },
			{ id: 'door', part: 'realTaxiDoor', x: 267, y: 213, z: 2 },
			{ id: 'wheel-l', part: 'realTaxiWheel', x: 140, y: 240, z: 4 },
			{ id: 'wheel-r', part: 'realTaxiWheel', x: 500, y: 240, z: 4, flip: true }
		]
	},
	{
		id: 'limousine',
		name: 'Limousine',
		width: 820,
		height: 300,
		groundY: 272,
		palette: palette('#2E2B3A', '#C9A227'),
		chassisPath: slabPath(820, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realLimousineBody', x: 422, y: 187, z: 0 },
			{ id: 'windows', part: 'realLimousineWindows', x: 433, y: 147, z: 1 },
			{ id: 'door', part: 'realLimousineDoor', x: 560, y: 212, z: 2 },
			{ id: 'wheel-l', part: 'realLimousineWheel', x: 150, y: 240, z: 4 },
			{ id: 'wheel-r', part: 'realLimousineWheel', x: 650, y: 240, z: 4, flip: true }
		]
	},
	{
		id: 'race-car',
		name: 'Race car',
		width: 680,
		height: 280,
		groundY: 272,
		palette: palette('#E63946', '#FFFFFF'),
		chassisPath: slabPath(680, 272, 120),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realRaceCarBody', x: 338, y: 186, z: 0 },
			{ id: 'windows', part: 'realRaceCarWindows', x: 277, y: 173, z: 1 },
			{ id: 'door', part: 'realRaceCarDoor', x: 333, y: 220, z: 2 },
			{ id: 'wheel-l', part: 'realRaceCarWheel', x: 140, y: 244, z: 4 },
			{ id: 'wheel-r', part: 'realRaceCarWheel', x: 520, y: 244, z: 4, flip: true }
		]
	},
	{
		id: 'ambulance',
		name: 'Ambulance',
		width: 720,
		height: 340,
		groundY: 272,
		palette: palette('#F7F9FC', '#E63946'),
		chassisPath: slabPath(720, 272, 160),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realAmbulanceBody', x: 352, y: 154, z: 0 },
			{ id: 'windows', part: 'realAmbulanceWindows', x: 348, y: 137, z: 1 },
			{ id: 'door', part: 'realAmbulanceDoor', x: 464, y: 165, z: 2 },
			{ id: 'wheel-l', part: 'realAmbulanceWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realAmbulanceWheel', x: 580, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'camper',
		name: 'Camper',
		width: 720,
		height: 340,
		groundY: 272,
		palette: palette('#F2E8CF', '#A44A3F'),
		chassisPath: slabPath(720, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realCamperBody', x: 355, y: 143, z: 0 },
			{ id: 'windows', part: 'realCamperWindows', x: 352, y: 145, z: 1 },
			{ id: 'door', part: 'realCamperDoor', x: 294, y: 214, z: 2 },
			{ id: 'wheel-l', part: 'realCamperWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realCamperWheel', x: 560, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'food-truck',
		name: 'Food truck',
		width: 720,
		height: 350,
		groundY: 272,
		palette: palette('#F4A261', '#2A9D8F'),
		chassisPath: slabPath(720, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realFoodTruckBody', x: 362, y: 154, z: 0 },
			{ id: 'windows', part: 'realFoodTruckWindows', x: 158, y: 145, z: 1 },
			{ id: 'door', part: 'realFoodTruckDoor', x: 294, y: 173, z: 2 },
			{ id: 'wheel-l', part: 'realFoodTruckWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realFoodTruckWheel', x: 560, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'ice-cream-van',
		name: 'Ice-cream van',
		width: 700,
		height: 330,
		groundY: 272,
		palette: palette('#F7C8E0', '#6D597A'),
		chassisPath: slabPath(700, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realIceCreamVanBody', x: 343, y: 143, z: 0 },
			{ id: 'windows', part: 'realIceCreamVanWindows', x: 133, y: 141, z: 1 },
			{ id: 'door', part: 'realIceCreamVanDoor', x: 160, y: 207, z: 2 },
			{ id: 'wheel-l', part: 'realIceCreamVanWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realIceCreamVanWheel', x: 560, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'mini-bus',
		name: 'Mini bus',
		width: 640,
		height: 300,
		groundY: 265,
		palette: palette('#8AC6D1', '#1D3557'),
		chassisPath: slabPath(640, 265, 160),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realMiniBusBody', x: 326.5, y: 167.5, z: 0 },
			{ id: 'windows', part: 'realMiniBusWindows', x: 294, y: 145, z: 1 },
			{ id: 'door', part: 'realMiniBusDoor', x: 517.5, y: 172, z: 2 },
			{ id: 'wheel-l', part: 'realMiniBusWheel', x: 140, y: 228, z: 4 },
			{ id: 'wheel-r', part: 'realMiniBusWheel', x: 500, y: 228, z: 4, flip: true }
		]
	},
	{
		id: 'mail-van',
		name: 'Mail van',
		width: 700,
		height: 330,
		groundY: 272,
		palette: palette('#FFD166', '#1D3557'),
		chassisPath: slabPath(700, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realMailVanBody', x: 350, y: 155, z: 0 },
			{ id: 'windows', part: 'realMailVanWindows', x: 182, y: 132, z: 1 },
			{ id: 'door', part: 'realMailVanDoor', x: 347, y: 170, z: 2 },
			{ id: 'wheel-l', part: 'realMailVanWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realMailVanWheel', x: 560, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'delivery-van',
		name: 'Delivery van',
		width: 720,
		height: 330,
		groundY: 272,
		palette: palette('#6A994E', '#F2E8CF'),
		chassisPath: slabPath(720, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realDeliveryVanBody', x: 362, y: 168, z: 0 },
			{ id: 'windows', part: 'realDeliveryVanWindows', x: 159, y: 143, z: 1 },
			{ id: 'door', part: 'realDeliveryVanDoor', x: 305, y: 170, z: 2 },
			{ id: 'wheel-l', part: 'realDeliveryVanWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realDeliveryVanWheel', x: 560, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'armoured-van',
		name: 'Armoured van',
		width: 720,
		height: 340,
		groundY: 272,
		palette: palette('#495057', '#CED4DA'),
		chassisPath: slabPath(720, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realArmouredVanBody', x: 363, y: 154, z: 0 },
			{ id: 'windows', part: 'realArmouredVanWindows', x: 132, y: 139, z: 1 },
			{ id: 'door', part: 'realArmouredVanDoor', x: 346, y: 165, z: 2 },
			{ id: 'wheel-l', part: 'realArmouredVanWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realArmouredVanWheel', x: 580, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'pickup',
		name: 'Pickup',
		width: 700,
		height: 330,
		groundY: 272,
		palette: palette('#BC4749', '#F2E8CF'),
		chassisPath: slabPath(700, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realPickupBody', x: 351, y: 188, z: 0 },
			{ id: 'windows', part: 'realPickupWindows', x: 272, y: 145, z: 1 },
			{ id: 'door', part: 'realPickupDoor', x: 291, y: 206, z: 2 },
			{ id: 'wheel-l', part: 'realPickupWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realPickupWheel', x: 560, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'school-bus',
		name: 'School bus',
		width: 760,
		height: 320,
		groundY: 285,
		palette: palette('#FFC94D', '#3A271B'),
		chassisPath: slabPath(760, 285, 160),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realSchoolBusBody', x: 390, y: 177.5, z: 0 },
			{ id: 'windows', part: 'realSchoolBusWindows', x: 365, y: 153, z: 1 },
			{ id: 'door', part: 'realSchoolBusDoor', x: 629, y: 184, z: 2 },
			{ id: 'wheel-l', part: 'realSchoolBusWheel', x: 165, y: 246, z: 4 },
			{ id: 'wheel-r', part: 'realSchoolBusWheel', x: 590, y: 246, z: 4, flip: true }
		]
	},
	{
		id: 'tram',
		name: 'Tram',
		width: 820,
		height: 380,
		groundY: 272,
		palette: palette('#EF476F', '#FFD166'),
		chassisPath: slabPath(820, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realTramBody', x: 423, y: 141, z: 0 },
			{ id: 'windows', part: 'realTramWindows', x: 412, y: 144, z: 1 },
			{ id: 'door', part: 'realTramDoor', x: 636, y: 175, z: 2 },
			{ id: 'wheel-l', part: 'realTramWheel', x: 160, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realTramWheel', x: 640, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'milk-tanker',
		name: 'Milk tanker',
		width: 760,
		height: 340,
		groundY: 272,
		palette: palette('#F7F9FC', '#457B9D'),
		chassisPath: slabPath(760, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realMilkTankerBody', x: 370, y: 170, z: 0 },
			{ id: 'windows', part: 'realMilkTankerWindows', x: 123, y: 146, z: 1 },
			{ id: 'door', part: 'realMilkTankerDoor', x: 124, y: 215, z: 2 },
			{ id: 'wheel-l', part: 'realMilkTankerWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realMilkTankerWheel', x: 600, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'fuel-tanker',
		name: 'Fuel tanker',
		width: 900,
		height: 360,
		groundY: 272,
		palette: palette('#E4EBF2', '#1F3448'),
		chassisPath: slabPath(900, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realFuelTankerBody', x: 446, y: 191, z: 0 },
			{ id: 'windows', part: 'realFuelTankerWindows', x: 108, y: 153, z: 1 },
			{ id: 'door', part: 'realFuelTankerDoor', x: 152, y: 218, z: 2 },
			{ id: 'wheel-l', part: 'realFuelTankerWheel', x: 160, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realFuelTankerWheel', x: 760, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'tow-truck',
		name: 'Tow truck',
		width: 780,
		height: 390,
		groundY: 272,
		palette: palette('#457B9D', '#E9C46A'),
		chassisPath: slabPath(780, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realTowTruckBody', x: 383, y: 163, z: 0 },
			{ id: 'windows', part: 'realTowTruckWindows', x: 117, y: 150, z: 1 },
			{ id: 'door', part: 'realTowTruckDoor', x: 156, y: 215, z: 2 },
			{ id: 'wheel-l', part: 'realTowTruckWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realTowTruckWheel', x: 600, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'crane-truck',
		name: 'Crane truck',
		width: 820,
		height: 300,
		groundY: 272,
		palette: palette('#E76F51', '#264653'),
		chassisPath: slabPath(820, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realCraneTruckBody', x: 395, y: 151, z: 0 },
			{ id: 'windows', part: 'realCraneTruckWindows', x: 116, y: 152.5, z: 1 },
			{ id: 'door', part: 'realCraneTruckDoor', x: 159, y: 220, z: 2 },
			{ id: 'wheel-l', part: 'realCraneTruckWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realCraneTruckWheel', x: 620, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'cement-mixer',
		name: 'Cement mixer',
		width: 740,
		height: 380,
		groundY: 272,
		palette: palette('#F4A261', '#264653'),
		chassisPath: slabPath(740, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realCementMixerBody', x: 352, y: 157, z: 0 },
			{ id: 'windows', part: 'realCementMixerWindows', x: 114, y: 131, z: 1 },
			{ id: 'door', part: 'realCementMixerDoor', x: 117, y: 207, z: 2 },
			{ id: 'wheel-l', part: 'realCementMixerWheel', x: 140, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realCementMixerWheel', x: 500, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'garbage-truck',
		name: 'Garbage truck',
		width: 760,
		height: 330,
		groundY: 272,
		palette: palette('#2A9D8F', '#264653'),
		chassisPath: slabPath(760, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realGarbageTruckBody', x: 384, y: 157, z: 0 },
			{ id: 'windows', part: 'realGarbageTruckWindows', x: 112, y: 128, z: 1 },
			{ id: 'door', part: 'realGarbageTruckDoor', x: 157, y: 208, z: 2 },
			{ id: 'wheel-l', part: 'realGarbageTruckWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realGarbageTruckWheel', x: 600, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'flatbed-lorry',
		name: 'Flatbed lorry',
		width: 780,
		height: 340,
		groundY: 272,
		palette: palette('#6D597A', '#E9C46A'),
		chassisPath: slabPath(780, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realFlatbedLorryBody', x: 391, y: 189, z: 0 },
			{ id: 'windows', part: 'realFlatbedLorryWindows', x: 127, y: 181, z: 1 },
			{ id: 'door', part: 'realFlatbedLorryDoor', x: 165, y: 225, z: 2 },
			{ id: 'wheel-l', part: 'realFlatbedLorryWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realFlatbedLorryWheel', x: 600, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'log-truck',
		name: 'Log truck',
		width: 800,
		height: 380,
		groundY: 272,
		palette: palette('#8B5E34', '#6B4226'),
		chassisPath: slabPath(800, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realLogTruckBody', x: 399, y: 164, z: 0 },
			{ id: 'windows', part: 'realLogTruckWindows', x: 134, y: 148, z: 1 },
			{ id: 'door', part: 'realLogTruckDoor', x: 180, y: 205, z: 2 },
			{ id: 'wheel-l', part: 'realLogTruckWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realLogTruckWheel', x: 640, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'car-transporter',
		name: 'Car transporter',
		width: 860,
		height: 340,
		groundY: 272,
		palette: palette('#577590', '#F9C74F'),
		chassisPath: slabPath(860, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realCarTransporterBody', x: 429, y: 162.5, z: 0 },
			{ id: 'windows', part: 'realCarTransporterWindows', x: 105, y: 161, z: 1 },
			{ id: 'door', part: 'realCarTransporterDoor', x: 148, y: 215, z: 2 },
			{ id: 'wheel-l', part: 'realCarTransporterWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realCarTransporterWheel', x: 650, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'snow-plough',
		name: 'Snow plough',
		width: 780,
		height: 350,
		groundY: 272,
		palette: palette('#E9ECEF', '#1D3557'),
		chassisPath: slabPath(780, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realSnowPloughBody', x: 435, y: 178, z: 0 },
			{ id: 'windows', part: 'realSnowPloughWindows', x: 201, y: 146, z: 1 },
			{ id: 'door', part: 'realSnowPloughDoor', x: 237, y: 216, z: 2 },
			{ id: 'plough', part: 'realSnowPloughPlough', x: 67, y: 172, z: 3 },
			{ id: 'wheel-l', part: 'realSnowPloughWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realSnowPloughWheel', x: 600, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'street-sweeper',
		name: 'Street sweeper',
		width: 760,
		height: 350,
		groundY: 272,
		palette: palette('#90BE6D', '#2B2D42'),
		chassisPath: slabPath(760, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realStreetSweeperBody', x: 368, y: 175, z: 0 },
			{ id: 'windows', part: 'realStreetSweeperWindows', x: 120, y: 132, z: 1 },
			{ id: 'door', part: 'realStreetSweeperDoor', x: 163, y: 204, z: 2 },
			{ id: 'wheel-l', part: 'realStreetSweeperWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realStreetSweeperWheel', x: 600, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'road-roller',
		name: 'Road roller',
		width: 680,
		height: 340,
		groundY: 272,
		palette: palette('#F9C74F', '#2B2D42'),
		chassisPath: slabPath(680, 272, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realRoadRollerBody', x: 391, y: 139, z: 0 },
			{ id: 'windows', part: 'realRoadRollerWindows', x: 259, y: 128, z: 1 },
			{ id: 'door', part: 'realRoadRollerDoor', x: 288, y: 184, z: 2 },
			{ id: 'drum-front', part: 'realRoadRollerDrum', x: 152, y: 220, z: 4 },
			{ id: 'drum-rear', part: 'realRoadRollerDrum', x: 556, y: 228, z: 4, scale: 0.846154 }
		]
	},
	{
		id: 'forklift',
		name: 'Forklift',
		width: 640,
		height: 340,
		groundY: 272,
		palette: palette('#F4A261', '#2B2D42'),
		chassisPath: slabPath(640, 272, 150),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realForkliftBody', x: 316, y: 147, z: 0 },
			{ id: 'windows', part: 'realForkliftWindows', x: 233, y: 111, z: 1 },
			{ id: 'forks', part: 'realForkliftForks', x: 62, y: 217, z: 2 },
			{ id: 'wheel-l', part: 'realForkliftWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realForkliftWheel', x: 480, y: 236, z: 4, flip: true }
		]
	},
	{
		id: 'bulldozer',
		name: 'Bulldozer',
		width: 720,
		height: 340,
		groundY: 272,
		palette: palette('#E9C46A', '#6B6B6B'),
		chassisPath: slabPath(720, 272, 190),
		realistic: true,
		slots: [
			{ id: 'tracks', part: 'realBulldozerTracks', x: 284, y: 236, z: 0 },
			{ id: 'body', part: 'realBulldozerBody', x: 440, y: 161, z: 1 },
			{ id: 'blade', part: 'realBulldozerBlade', x: 93, y: 218, z: 2 },
			{ id: 'windows', part: 'realBulldozerWindows', x: 280, y: 102, z: 3 },
			{ id: 'door', part: 'realBulldozerDoor', x: 303, y: 148, z: 4 }
		]
	},
	{
		id: 'monster-truck',
		name: 'Monster truck',
		width: 720,
		height: 320,
		groundY: 291,
		palette: palette('#8338EC', '#FFBE0B'),
		chassisPath: slabPath(720, 291, 200),
		realistic: true,
		slots: [
			{ id: 'body', part: 'realMonsterTruckBody', x: 361, y: 170, z: 0 },
			{ id: 'windows', part: 'realMonsterTruckWindows', x: 275, y: 100, z: 1 },
			{ id: 'door', part: 'realMonsterTruckDoor', x: 290, y: 156, z: 2 },
			{ id: 'wheel-l', part: 'realMonsterTruckWheel', x: 150, y: 236, z: 4 },
			{ id: 'wheel-r', part: 'realMonsterTruckWheel', x: 560, y: 236, z: 4, flip: true }
		]
	});

VEHICLES.push(...FLEET);

export const FIRST_VEHICLE_ID = 'car';

export function getVehicle(id: string): Vehicle {
	return VEHICLES.find((vehicle) => vehicle.id === id) ?? VEHICLES[0];
}

/** Pick any vehicle that is neither the one just shown nor the one before it, when possible. */
export function nextVehicleId(currentId: string, previousId: string | null): string {
	const fresh = VEHICLES.filter((v) => v.id !== currentId && v.id !== previousId);
	const pool = fresh.length > 0 ? fresh : VEHICLES.filter((v) => v.id !== currentId);
	const chosen = pool.length > 0 ? pool : VEHICLES;
	return chosen[Math.floor(Math.random() * chosen.length)].id;
}
