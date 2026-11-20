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
		width: 480,
		height: 220,
		groundY: 190,
		palette: palette('#FF6B6B', '#FFD166'),
		chassisPath:
			'M20,150 Q20,145 26,145 L150,145 L170,105 Q178,90 196,90 L274,90 Q292,90 300,105 L320,145 L454,145 Q460,145 460,155 L460,185 Q460,200 445,200 L35,200 Q20,200 20,185 Z',
		slots: [
			{ id: 'body', part: 'body', x: 240, y: 145, z: 0 },
			{ id: 'cabin', part: 'cabin', x: 235, y: 61, z: 1 },
			{ id: 'door', part: 'door', x: 214, y: 132, z: 2 },
			{ id: 'light', part: 'light', x: 440, y: 138, z: 2 },
			{ id: 'wheel-l', part: 'wheel', x: 120, y: 190, z: 4 },
			{ id: 'wheel-r', part: 'wheel', x: 360, y: 190, z: 4, flip: true }
		]
	},
	{
		id: 'fire-engine',
		name: 'Fire engine',
		width: 560,
		height: 250,
		groundY: 205,
		palette: palette('#E63946', '#F1C453'),
		chassisPath:
			'M70,110 Q70,100 84,100 L470,100 Q530,100 530,150 L530,190 Q530,205 512,205 L86,205 Q70,205 70,190 Z',
		slots: [
			{ id: 'body', part: 'bodyBox', x: 300, y: 160, z: 0 },
			{ id: 'cab', part: 'cab', x: 110, y: 120, z: 1 },
			{ id: 'hose', part: 'hoseReel', x: 235, y: 150, z: 2 },
			{ id: 'ladder', part: 'ladder', x: 360, y: 96, z: 1, scale: 2.2 },
			{ id: 'lights', part: 'lightBar', x: 110, y: 66, z: 2 },
			{ id: 'wheel-l', part: 'wheel', x: 150, y: 205, z: 4 },
			{ id: 'wheel-r', part: 'wheel', x: 460, y: 205, z: 4, flip: true }
		]
	},
	{
		id: 'bus',
		name: 'Bus',
		width: 520,
		height: 240,
		groundY: 200,
		palette: palette('#FFC94D', '#F2792B'),
		chassisPath:
			'M40,120 Q40,100 64,100 L456,100 Q480,100 480,124 L480,182 Q480,200 462,200 L58,200 Q40,200 40,182 Z',
		slots: [
			{ id: 'body', part: 'bodyBox', x: 260, y: 150, z: 0, scale: 1.05 },
			{ id: 'windows', part: 'windowStrip', x: 260, y: 112, z: 1, scale: 2.2 },
			{ id: 'roof', part: 'roof', x: 260, y: 88, z: 2, scale: 2.6 },
			{ id: 'door', part: 'door', x: 330, y: 155, z: 2 },
			{ id: 'wheel-l', part: 'wheel', x: 150, y: 200, z: 4 },
			{ id: 'wheel-r', part: 'wheel', x: 390, y: 200, z: 4, flip: true }
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
		width: 460,
		height: 280,
		groundY: 248,
		palette: palette('#F4A261', '#6B6B6B'),
		chassisPath:
			'M60,180 Q60,160 86,160 L300,160 L330,180 L330,210 L60,210 Z',
		slots: [
			{ id: 'tracks', part: 'tracks', x: 230, y: 225, z: 0 },
			{ id: 'body', part: 'bodyBox', x: 225, y: 185, z: 1, scale: 0.72 },
			{ id: 'cabin', part: 'cabin', x: 150, y: 130, z: 2, scale: 0.7 },
			{ id: 'arm', part: 'arm', x: 330, y: 178, z: 3 },
			{ id: 'bucket', part: 'bucket', x: 420, y: 204, z: 3 },
			{ id: 'beacon', part: 'beacon', x: 262, y: 132, z: 2 }
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
