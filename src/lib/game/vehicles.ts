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

const CAR_PALETTE: Record<Role, string> = {
	shell: '#FF6B6B',
	glass: '#CFEFFF',
	rubber: '#2B2D42',
	trim: '#FFD166',
	lamp: '#FFE066'
};

export const VEHICLES: Vehicle[] = [
	{
		id: 'car',
		name: 'Car',
		width: 480,
		height: 220,
		groundY: 190,
		palette: CAR_PALETTE,
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
	}
];

export const FIRST_VEHICLE_ID = 'car';

export function getVehicle(id: string): Vehicle {
	const found = VEHICLES.find((vehicle) => vehicle.id === id);
	if (!found) throw new Error(`Unknown vehicle: ${id}`);
	return found;
}

/** Pick any vehicle that is neither the one just shown nor the one before it, when possible. */
export function nextVehicleId(currentId: string, previousId: string | null): string {
	const fresh = VEHICLES.filter((v) => v.id !== currentId && v.id !== previousId);
	const pool = fresh.length > 0 ? fresh : VEHICLES.filter((v) => v.id !== currentId);
	const chosen = pool.length > 0 ? pool : VEHICLES;
	return chosen[Math.floor(Math.random() * chosen.length)].id;
}
