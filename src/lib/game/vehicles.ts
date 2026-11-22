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
		width: 420,
		height: 280,
		groundY: 225,
		palette: palette('#59B85C', '#F4A261'),
		chassisPath:
			'M70,170 Q70,140 100,140 L330,140 L330,150 Q330,190 300,190 L80,190 Q70,190 70,178 Z',
		slots: [
			{ id: 'body', part: 'bodyBox', x: 210, y: 168, z: 0, scale: 0.62 },
			{ id: 'cabin', part: 'cabin', x: 150, y: 104, z: 1, scale: 0.8 },
			{ id: 'exhaust', part: 'exhaust', x: 292, y: 116, z: 2 },
			{ id: 'light', part: 'light', x: 362, y: 146, z: 2 },
			{ id: 'wheel-rear', part: 'wheel', x: 112, y: 214, z: 4, scale: 1.35 },
			{ id: 'wheel-front', part: 'wheel', x: 330, y: 224, z: 4, scale: 0.72, flip: true }
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
		name: 'Van',
		width: 500,
		height: 250,
		groundY: 210,
		palette: palette('#5AA9E6', '#FFD166'),
		chassisPath:
			'M70,110 Q70,96 88,96 L410,96 Q430,96 430,116 L430,190 Q430,210 408,210 L86,210 Q70,210 70,190 Z',
		slots: [
			{ id: 'body', part: 'bodyBox', x: 250, y: 152, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 96, y: 128, z: 1, scale: 0.75 },
			{ id: 'window', part: 'windowStrip', x: 104, y: 108, z: 2, scale: 0.55 },
			{ id: 'door', part: 'door', x: 280, y: 152, z: 2, scale: 1.1 },
			{ id: 'sign', part: 'roofSign', x: 250, y: 84, z: 1 },
			{ id: 'wheel-l', part: 'wheel', x: 140, y: 210, z: 4 },
			{ id: 'wheel-r', part: 'wheel', x: 390, y: 210, z: 4, flip: true }
		]
	}
];


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
		width: 480,
		height: 220,
		groundY: 190,
		palette: palette('#F4F6FA', '#2C5AA0'),
		chassisPath: slabPath(480, 190),
		slots: [
			{ id: 'body', part: 'body', x: 240, y: 145, z: 0 },
			{ id: 'cabin', part: 'cabin', x: 235, y: 61, z: 1 },
			{ id: 'lights', part: 'lightBar', x: 235, y: 24, z: 2 },
			{ id: 'light', part: 'light', x: 440, y: 138, z: 2 },
			wheelSlot('l', 120, 190),
			wheelSlot('r', 360, 190)
		]
	},
	{
		id: 'taxi',
		name: 'Taxi',
		width: 480,
		height: 220,
		groundY: 190,
		palette: palette('#FFC94D', '#2B2D42'),
		chassisPath: slabPath(480, 190),
		slots: [
			{ id: 'body', part: 'body', x: 240, y: 145, z: 0 },
			{ id: 'cabin', part: 'cabin', x: 235, y: 61, z: 1 },
			{ id: 'sign', part: 'roofSign', x: 235, y: 18, z: 2 },
			{ id: 'door', part: 'door', x: 214, y: 132, z: 2 },
			wheelSlot('l', 120, 190),
			wheelSlot('r', 360, 190)
		]
	},
	{
		id: 'limousine',
		name: 'Limousine',
		width: 620,
		height: 220,
		groundY: 190,
		palette: palette('#2E2B3A', '#C9A227'),
		chassisPath: slabPath(620, 190, 110),
		slots: [
			{ id: 'body', part: 'body', x: 310, y: 150, z: 0, scale: 1.3 },
			{ id: 'cabin', part: 'cabin', x: 330, y: 66, z: 1, scale: 0.85 },
			{ id: 'door-front', part: 'door', x: 250, y: 138, z: 2 },
			{ id: 'door-rear', part: 'door', x: 430, y: 138, z: 2 },
			{ id: 'light', part: 'light', x: 580, y: 145, z: 2 },
			wheelSlot('l', 160, 190),
			wheelSlot('r', 470, 190)
		]
	},
	{
		id: 'race-car',
		name: 'Race car',
		width: 500,
		height: 200,
		groundY: 175,
		palette: palette('#E63946', '#FFFFFF'),
		chassisPath: slabPath(500, 175, 90),
		slots: [
			{ id: 'body', part: 'body', x: 250, y: 140, z: 0, scale: 0.9 },
			{ id: 'cabin', part: 'cabin', x: 250, y: 82, z: 1, scale: 0.6 },
			{ id: 'spoiler', part: 'spoiler', x: 80, y: 112, z: 1 },
			{ id: 'light', part: 'light', x: 460, y: 132, z: 2 },
			wheelSlot('l', 130, 175, 1.15),
			wheelSlot('r', 380, 175, 1.15)
		]
	},
	{
		id: 'ambulance',
		name: 'Ambulance',
		width: 500,
		height: 250,
		groundY: 210,
		palette: palette('#F7F9FC', '#E63946'),
		chassisPath: slabPath(500, 210, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 250, y: 152, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 96, y: 128, z: 1, scale: 0.75 },
			{ id: 'window', part: 'windowStrip', x: 96, y: 108, z: 2, scale: 0.55 },
			{ id: 'lights', part: 'lightBar', x: 250, y: 88, z: 2 },
			wheelSlot('l', 140, 210),
			wheelSlot('r', 390, 210)
		]
	},
	{
		id: 'camper',
		name: 'Camper',
		width: 520,
		height: 260,
		groundY: 212,
		palette: palette('#F2E8CF', '#A44A3F'),
		chassisPath: slabPath(520, 212, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 260, y: 155, z: 0, scale: 1 },
			{ id: 'roof', part: 'roof', x: 260, y: 86, z: 2, scale: 2.3 },
			{ id: 'windows', part: 'windowStrip', x: 250, y: 120, z: 2, scale: 1.8 },
			{ id: 'door', part: 'door', x: 360, y: 155, z: 2 },
			wheelSlot('l', 150, 212),
			wheelSlot('r', 400, 212)
		]
	},
	{
		id: 'food-truck',
		name: 'Food truck',
		width: 520,
		height: 250,
		groundY: 212,
		palette: palette('#F4A261', '#2A9D8F'),
		chassisPath: slabPath(520, 212, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 270, y: 155, z: 0, scale: 1 },
			{ id: 'sign', part: 'roofSign', x: 300, y: 86, z: 1, scale: 1.4 },
			{ id: 'window', part: 'windowStrip', x: 170, y: 118, z: 2, scale: 1.2 },
			{ id: 'door', part: 'door', x: 350, y: 155, z: 2 },
			wheelSlot('l', 150, 212),
			wheelSlot('r', 400, 212)
		]
	},
	{
		id: 'ice-cream-van',
		name: 'Ice-cream van',
		width: 500,
		height: 250,
		groundY: 210,
		palette: palette('#F7C8E0', '#6D597A'),
		chassisPath: slabPath(500, 210, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 250, y: 152, z: 0, scale: 0.95 },
			{ id: 'sign', part: 'roofSign', x: 250, y: 86, z: 1 },
			{ id: 'window', part: 'windowStrip', x: 160, y: 112, z: 2, scale: 1 },
			{ id: 'light', part: 'light', x: 470, y: 165, z: 2 },
			wheelSlot('l', 140, 210),
			wheelSlot('r', 390, 210)
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
		width: 500,
		height: 250,
		groundY: 210,
		palette: palette('#FFD166', '#1D3557'),
		chassisPath: slabPath(500, 210, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 250, y: 152, z: 0, scale: 0.95 },
			{ id: 'sign', part: 'roofSign', x: 250, y: 88, z: 1 },
			{ id: 'door', part: 'door', x: 310, y: 155, z: 2 },
			{ id: 'light', part: 'light', x: 470, y: 165, z: 2 },
			wheelSlot('l', 140, 210),
			wheelSlot('r', 390, 210)
		]
	},
	{
		id: 'delivery-van',
		name: 'Delivery van',
		width: 500,
		height: 250,
		groundY: 210,
		palette: palette('#6A994E', '#F2E8CF'),
		chassisPath: slabPath(500, 210, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 250, y: 152, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 96, y: 128, z: 1, scale: 0.75 },
			{ id: 'window', part: 'windowStrip', x: 96, y: 108, z: 2, scale: 0.55 },
			{ id: 'door', part: 'door', x: 310, y: 155, z: 2 },
			wheelSlot('l', 140, 210),
			wheelSlot('r', 390, 210)
		]
	},
	{
		id: 'armoured-van',
		name: 'Armoured van',
		width: 520,
		height: 250,
		groundY: 210,
		palette: palette('#495057', '#CED4DA'),
		chassisPath: slabPath(520, 210, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 260, y: 152, z: 0, scale: 1 },
			{ id: 'window', part: 'windowStrip', x: 260, y: 110, z: 2, scale: 1.1 },
			{ id: 'lights', part: 'lightBar', x: 260, y: 86, z: 1 },
			{ id: 'door', part: 'door', x: 150, y: 155, z: 2 },
			wheelSlot('l', 150, 210),
			wheelSlot('r', 400, 210)
		]
	},
	{
		id: 'pickup',
		name: 'Pickup',
		width: 540,
		height: 240,
		groundY: 200,
		palette: palette('#BC4749', '#F2E8CF'),
		chassisPath: slabPath(540, 200, 120),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 250, y: 172, z: 0, scale: 0.72 },
			{ id: 'cab', part: 'cab', x: 120, y: 130, z: 1, scale: 0.8 },
			{ id: 'bed', part: 'flatbed', x: 400, y: 162, z: 1, scale: 0.75 },
			{ id: 'light', part: 'light', x: 510, y: 150, z: 2 },
			wheelSlot('l', 150, 200),
			wheelSlot('r', 430, 200)
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
		width: 600,
		height: 260,
		groundY: 210,
		palette: palette('#FFB703', '#023047'),
		chassisPath: slabPath(600, 210, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 310, y: 196, z: 0, scale: 0.78 },
			{ id: 'tank', part: 'tank', x: 370, y: 145, z: 1, scale: 1.1 },
			{ id: 'cab', part: 'cab', x: 100, y: 120, z: 2, scale: 0.9 },
			{ id: 'lights', part: 'lightBar', x: 100, y: 72, z: 3 },
			wheelSlot('l', 180, 210),
			wheelSlot('r', 480, 210)
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
		width: 580,
		height: 280,
		groundY: 210,
		palette: palette('#2A9D8F', '#264653'),
		chassisPath: slabPath(580, 210, 160),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 300, y: 160, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 110, y: 120, z: 1, scale: 0.9 },
			{ id: 'hopper', part: 'tipper', x: 350, y: 120, z: 2 },
			{ id: 'beacon', part: 'beacon', x: 200, y: 92, z: 2 },
			wheelSlot('l', 160, 210),
			wheelSlot('r', 460, 210)
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
		width: 600,
		height: 270,
		groundY: 210,
		palette: palette('#8B5E34', '#6B4226'),
		chassisPath: slabPath(600, 210, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 310, y: 178, z: 0, scale: 0.62 },
			{ id: 'cab', part: 'cab', x: 110, y: 120, z: 1, scale: 0.9 },
			{ id: 'deck', part: 'flatbed', x: 370, y: 165, z: 1 },
			{ id: 'logs', part: 'logs', x: 370, y: 128, z: 2, scale: 1.2 },
			wheelSlot('l', 160, 210),
			wheelSlot('r', 470, 210)
		]
	},
	{
		id: 'car-transporter',
		name: 'Car transporter',
		width: 640,
		height: 280,
		groundY: 212,
		palette: palette('#577590', '#F9C74F'),
		chassisPath: slabPath(640, 212, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 340, y: 178, z: 0, scale: 0.66 },
			{ id: 'cab', part: 'cab', x: 110, y: 120, z: 1, scale: 0.9 },
			{ id: 'deck', part: 'flatbed', x: 400, y: 158, z: 1, scale: 0.9 },
			{ id: 'car-a', part: 'miniCar', x: 320, y: 124, z: 2 },
			{ id: 'car-b', part: 'miniCar', x: 470, y: 124, z: 2 },
			wheelSlot('l', 160, 212),
			wheelSlot('r', 500, 212)
		]
	},
	{
		id: 'snow-plough',
		name: 'Snow plough',
		width: 580,
		height: 270,
		groundY: 210,
		palette: palette('#E9ECEF', '#1D3557'),
		chassisPath: slabPath(580, 210, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 300, y: 160, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 110, y: 120, z: 1, scale: 0.9 },
			{ id: 'plough', part: 'plough', x: 520, y: 180, z: 2 },
			{ id: 'lights', part: 'lightBar', x: 110, y: 70, z: 2 },
			wheelSlot('l', 160, 210),
			wheelSlot('r', 440, 210)
		]
	},
	{
		id: 'street-sweeper',
		name: 'Street sweeper',
		width: 580,
		height: 260,
		groundY: 210,
		palette: palette('#90BE6D', '#2B2D42'),
		chassisPath: slabPath(580, 210, 130),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 300, y: 160, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 110, y: 120, z: 1, scale: 0.9 },
			{ id: 'brush', part: 'brush', x: 520, y: 196, z: 2 },
			{ id: 'beacon', part: 'beacon', x: 200, y: 92, z: 2 },
			wheelSlot('l', 160, 210),
			wheelSlot('r', 440, 210)
		]
	},
	{
		id: 'road-roller',
		name: 'Road roller',
		width: 560,
		height: 280,
		groundY: 215,
		palette: palette('#F9C74F', '#2B2D42'),
		chassisPath: slabPath(560, 215, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 280, y: 150, z: 0, scale: 0.9 },
			{ id: 'cab', part: 'cab', x: 140, y: 108, z: 1, scale: 0.8 },
			{ id: 'roller', part: 'roller', x: 480, y: 200, z: 3 },
			{ id: 'beacon', part: 'beacon', x: 140, y: 62, z: 2 },
			wheelSlot('l', 150, 215, 1.1),
			wheelSlot('r', 300, 215, 1.1)
		]
	},
	{
		id: 'forklift',
		name: 'Forklift',
		width: 460,
		height: 270,
		groundY: 225,
		palette: palette('#F4A261', '#2B2D42'),
		chassisPath: slabPath(460, 225, 110),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 230, y: 178, z: 0, scale: 0.6 },
			{ id: 'cab', part: 'cab', x: 160, y: 122, z: 1, scale: 0.7 },
			{ id: 'forks', part: 'forks', x: 390, y: 190, z: 2 },
			{ id: 'beacon', part: 'beacon', x: 260, y: 136, z: 2 },
			wheelSlot('l', 130, 225, 0.9),
			wheelSlot('r', 290, 225, 0.9)
		]
	},
	{
		id: 'bulldozer',
		name: 'Bulldozer',
		width: 480,
		height: 290,
		groundY: 250,
		palette: palette('#E9C46A', '#6B6B6B'),
		chassisPath: slabPath(480, 250, 120),
		slots: [
			{ id: 'tracks', part: 'tracks', x: 220, y: 228, z: 0 },
			{ id: 'body', part: 'bodyBox', x: 220, y: 186, z: 1, scale: 0.7 },
			{ id: 'cab', part: 'cabin', x: 150, y: 128, z: 2, scale: 0.65 },
			{ id: 'blade', part: 'plough', x: 420, y: 212, z: 3 },
			{ id: 'exhaust', part: 'exhaust', x: 300, y: 140, z: 2 }
		]
	},
	{
		id: 'monster-truck',
		name: 'Monster truck',
		width: 540,
		height: 300,
		groundY: 230,
		palette: palette('#8338EC', '#FFBE0B'),
		chassisPath: slabPath(540, 230, 150),
		slots: [
			{ id: 'body', part: 'body', x: 270, y: 150, z: 0, scale: 1.05 },
			{ id: 'cabin', part: 'cabin', x: 265, y: 66, z: 1, scale: 0.9 },
			{ id: 'exhaust', part: 'exhaust', x: 360, y: 120, z: 2 },
			wheelSlot('l', 140, 230, 1.6),
			wheelSlot('r', 410, 230, 1.6)
		]
	}
);

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
