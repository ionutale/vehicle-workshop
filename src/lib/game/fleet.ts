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
		width: 700,
		height: 340,
		groundY: 250,
		palette: pal('#F9C74F', '#2B2D42'),
		chassisPath: slab(700, 250, 160),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 380, y: 190, z: 0, scale: 1 },
			{ id: 'cab', part: 'cab', x: 130, y: 135, z: 1, scale: 0.9 },
			{ id: 'tank', part: 'tank', x: 400, y: 110, z: 1, scale: 0.8 },
			{ id: 'header', part: 'header', x: 600, y: 215, z: 2, scale: 1.2 },
			wheel('l', 200, 250, 1.1),
			wheel('r', 520, 250, 1.1)
		]
	},
	{
		id: 'crop-sprayer',
		name: 'Crop sprayer',
		width: 680,
		height: 310,
		groundY: 240,
		palette: pal('#90BE6D', '#F9C74F'),
		chassisPath: slab(680, 240, 130),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 300, y: 180, z: 0, scale: 0.8 },
			{ id: 'cab', part: 'cab', x: 120, y: 140, z: 1, scale: 0.8 },
			{ id: 'tank', part: 'tank', x: 340, y: 130, z: 2, scale: 0.9 },
			{ id: 'boom', part: 'boom', x: 480, y: 150, z: 3, scale: 1.3 },
			wheel('l', 170, 240),
			wheel('r', 540, 240)
		]
	},
	{
		id: 'hay-baler',
		name: 'Hay baler',
		width: 580,
		height: 280,
		groundY: 215,
		palette: pal('#E9C46A', '#2A9D8F'),
		chassisPath: slab(580, 215, 130),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 280, y: 172, z: 0, scale: 0.8 },
			{ id: 'cab', part: 'cab', x: 110, y: 132, z: 1, scale: 0.85 },
			{ id: 'bale', part: 'bale', x: 440, y: 180, z: 2 },
			{ id: 'light', part: 'light', x: 530, y: 150, z: 2 },
			wheel('l', 160, 215),
			wheel('r', 460, 215)
		]
	},
	{
		id: 'telehandler',
		name: 'Telehandler',
		width: 580,
		height: 320,
		groundY: 230,
		palette: pal('#F4A261', '#264653'),
		chassisPath: slab(580, 230, 130),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 270, y: 188, z: 0, scale: 0.72 },
			{ id: 'cab', part: 'cab', x: 150, y: 132, z: 1, scale: 0.7 },
			{ id: 'boom', part: 'boom', x: 390, y: 92, z: 2, scale: 1.2 },
			{ id: 'forks', part: 'forks', x: 530, y: 175, z: 3 },
			wheel('l', 160, 230),
			wheel('r', 450, 230)
		]
	},
	{
		id: 'skid-steer',
		name: 'Skid-steer loader',
		width: 460,
		height: 270,
		groundY: 235,
		palette: pal('#F9C74F', '#2B2D42'),
		chassisPath: slab(460, 235, 90),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 220, y: 185, z: 0, scale: 0.58 },
			{ id: 'cab', part: 'cabin', x: 180, y: 132, z: 1, scale: 0.6 },
			{ id: 'forks', part: 'forks', x: 370, y: 210, z: 2, scale: 0.9 },
			{ id: 'beacon', part: 'beacon', x: 270, y: 140, z: 2 },
			wheel('l', 110, 235, 0.85),
			wheel('r', 330, 235, 0.85)
		]
	},
	{
		id: 'backhoe-loader',
		name: 'Backhoe loader',
		width: 620,
		height: 300,
		groundY: 225,
		palette: pal('#F4A261', '#2B2D42'),
		chassisPath: slab(620, 225, 120),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 320, y: 180, z: 0, scale: 0.85 },
			{ id: 'cab', part: 'cab', x: 140, y: 130, z: 1, scale: 0.8 },
			{ id: 'front-bucket', part: 'bucket', x: 60, y: 195, z: 2, scale: 0.8 },
			{ id: 'arm', part: 'arm', x: 500, y: 170, z: 2, scale: 0.8 },
			{ id: 'bucket', part: 'bucket', x: 570, y: 205, z: 3, scale: 0.8 },
			wheel('l', 170, 225),
			wheel('r', 470, 225)
		]
	},
	{
		id: 'wheel-loader',
		name: 'Wheel loader',
		width: 600,
		height: 300,
		groundY: 235,
		palette: pal('#E9C46A', '#264653'),
		chassisPath: slab(600, 235, 130),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 300, y: 188, z: 0, scale: 0.8 },
			{ id: 'cab', part: 'cab', x: 150, y: 132, z: 1, scale: 0.75 },
			{ id: 'arm', part: 'arm', x: 430, y: 168, z: 2, scale: 0.9 },
			{ id: 'bucket', part: 'bucket', x: 545, y: 208, z: 3 },
			wheel('l', 170, 235),
			wheel('r', 470, 235)
		]
	},
	{
		id: 'motor-grader',
		name: 'Motor grader',
		width: 660,
		height: 290,
		groundY: 220,
		palette: pal('#F9C74F', '#264653'),
		chassisPath: slab(660, 220, 110),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 172, z: 0, scale: 0.9 },
			{ id: 'cab', part: 'cab', x: 190, y: 122, z: 1, scale: 0.75 },
			{ id: 'blade', part: 'plough', x: 440, y: 208, z: 2, scale: 1.2 },
			{ id: 'exhaust', part: 'exhaust', x: 280, y: 110, z: 2 },
			wheel('l', 160, 220),
			wheel('r', 520, 220)
		]
	},
	// ── Heavy haulage ────────────────────────────────────────────────────────────────
	{
		id: 'articulated-hauler',
		name: 'Articulated hauler',
		width: 640,
		height: 320,
		groundY: 250,
		palette: pal('#F9C74F', '#2B2D42'),
		chassisPath: slab(640, 250, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 340, y: 200, z: 0, scale: 0.9 },
			{ id: 'cab', part: 'cab', x: 150, y: 140, z: 1, scale: 0.9 },
			{ id: 'tipper', part: 'tipper', x: 370, y: 120, z: 2, scale: 1.1 },
			wheel('l', 200, 250, 1.3),
			wheel('r', 520, 250, 1.3)
		]
	},
	{
		id: 'dump-truck',
		name: 'Dump truck',
		width: 600,
		height: 290,
		groundY: 215,
		palette: pal('#E63946', '#2B2D42'),
		chassisPath: slab(600, 215, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 320, y: 175, z: 0, scale: 0.9 },
			{ id: 'cab', part: 'cab', x: 115, y: 125, z: 1, scale: 0.9 },
			{ id: 'tipper', part: 'tipper', x: 360, y: 112, z: 2 },
			{ id: 'light', part: 'light', x: 565, y: 160, z: 2 },
			wheel('l', 170, 215),
			wheel('r', 490, 215)
		]
	},
	{
		id: 'refrigerated-truck',
		name: 'Refrigerated truck',
		width: 600,
		height: 280,
		groundY: 212,
		palette: pal('#F7F9FC', '#457B9D'),
		chassisPath: slab(600, 212, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 160, z: 0, scale: 1 },
			{ id: 'cab', part: 'cab', x: 115, y: 125, z: 1, scale: 0.9 },
			{ id: 'chiller', part: 'roofSign', x: 350, y: 82, z: 2, scale: 1.2 },
			wheel('l', 170, 212),
			wheel('r', 500, 212),
			{ id: 'door', part: 'door', x: 545, y: 165, z: 2 }
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
		width: 640,
		height: 280,
		groundY: 212,
		palette: pal('#457B9D', '#CED4DA'),
		chassisPath: slab(640, 212, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 350, y: 160, z: 0, scale: 1.05 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'roof', part: 'roof', x: 350, y: 86, z: 1, scale: 2.6 },
			wheel('l', 180, 212),
			wheel('r', 530, 212),
			{ id: 'light', part: 'light', x: 625, y: 150, z: 2 }
		]
	},
	{
		id: 'skip-loader',
		name: 'Skip-loader truck',
		width: 640,
		height: 300,
		groundY: 215,
		palette: pal('#E76F51', '#2B2D42'),
		chassisPath: slab(640, 215, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 340, y: 175, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'skip', part: 'skip', x: 420, y: 105, z: 2 },
			{ id: 'beacon', part: 'beacon', x: 200, y: 95, z: 2 },
			wheel('l', 180, 215),
			wheel('r', 520, 215)
		]
	},
	{
		id: 'hook-lift-truck',
		name: 'Hook-lift truck',
		width: 640,
		height: 300,
		groundY: 215,
		palette: pal('#2A9D8F', '#264653'),
		chassisPath: slab(640, 215, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 340, y: 175, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'tipper', part: 'tipper', x: 400, y: 115, z: 2 },
			{ id: 'hook', part: 'hook', x: 300, y: 95, z: 2 },
			wheel('l', 180, 215),
			wheel('r', 520, 215)
		]
	},
	{
		id: 'livestock-truck',
		name: 'Livestock truck',
		width: 640,
		height: 290,
		groundY: 212,
		palette: pal('#8AC6D1', '#6D597A'),
		chassisPath: slab(640, 212, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 350, y: 160, z: 0, scale: 1.05 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'slats', part: 'windowStrip', x: 360, y: 118, z: 2, scale: 2.4 },
			{ id: 'door', part: 'door', x: 560, y: 165, z: 2 },
			wheel('l', 180, 212),
			wheel('r', 530, 212)
		]
	},
	{
		id: 'concrete-pump',
		name: 'Concrete pump truck',
		width: 660,
		height: 330,
		groundY: 215,
		palette: pal('#F4A261', '#264653'),
		chassisPath: slab(660, 215, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 350, y: 175, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'boom', part: 'boom', x: 400, y: 80, z: 2, scale: 1.25 },
			{ id: 'nozzle', part: 'hook', x: 570, y: 45, z: 3 },
			wheel('l', 180, 215),
			wheel('r', 540, 215)
		]
	},
	{
		id: 'water-tanker',
		name: 'Water tanker',
		width: 620,
		height: 280,
		groundY: 210,
		palette: pal('#4E9BD4', '#F7F9FC'),
		chassisPath: slab(620, 210, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 196, z: 0, scale: 0.75 },
			{ id: 'tank', part: 'tank', x: 380, y: 145, z: 1, scale: 1.05 },
			{ id: 'cab', part: 'cab', x: 118, y: 120, z: 2, scale: 0.9 },
			{ id: 'hose', part: 'hoseReel', x: 500, y: 150, z: 3 },
			wheel('l', 180, 210),
			wheel('r', 500, 210)
		]
	},
	{
		id: 'gritter-truck',
		name: 'Gritter truck',
		width: 640,
		height: 290,
		groundY: 212,
		palette: pal('#F9C74F', '#264653'),
		chassisPath: slab(640, 212, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 180, z: 0, scale: 0.85 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'hopper', part: 'tipper', x: 400, y: 115, z: 2, scale: 0.9 },
			{ id: 'blade', part: 'plough', x: 590, y: 190, z: 3, scale: 0.9 },
			wheel('l', 180, 212),
			wheel('r', 520, 212)
		]
	},
	{
		id: 'snow-blower',
		name: 'Snow-blower truck',
		width: 620,
		height: 300,
		groundY: 212,
		palette: pal('#E9ECEF', '#1D3557'),
		chassisPath: slab(620, 212, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 320, y: 180, z: 0, scale: 0.85 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'auger', part: 'brush', x: 570, y: 205, z: 2, scale: 1.3 },
			{ id: 'beacon', part: 'beacon', x: 200, y: 95, z: 2 },
			wheel('l', 180, 212),
			wheel('r', 490, 212)
		]
	},
	// ── Road works ───────────────────────────────────────────────────────────────────
	{
		id: 'road-planer',
		name: 'Road planer',
		width: 620,
		height: 290,
		groundY: 212,
		palette: pal('#F4A261', '#2B2D42'),
		chassisPath: slab(620, 212, 130),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 320, y: 175, z: 0, scale: 0.9 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'drum', part: 'roller', x: 470, y: 205, z: 2, scale: 1.2 },
			{ id: 'beacon', part: 'beacon', x: 220, y: 95, z: 2 },
			wheel('l', 180, 212),
			wheel('r', 320, 212)
		]
	},
	{
		id: 'asphalt-paver',
		name: 'Asphalt paver',
		width: 620,
		height: 290,
		groundY: 212,
		palette: pal('#F9C74F', '#6B6B6B'),
		chassisPath: slab(620, 212, 120),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 320, y: 180, z: 0, scale: 0.85 },
			{ id: 'cab', part: 'cab', x: 120, y: 130, z: 1, scale: 0.9 },
			{ id: 'hopper', part: 'tipper', x: 330, y: 120, z: 2, scale: 0.8 },
			{ id: 'screed', part: 'flatbed', x: 540, y: 205, z: 2, scale: 0.5 },
			wheel('l', 180, 212),
			wheel('r', 430, 212)
		]
	},
	{
		id: 'sewer-cleaner',
		name: 'Sewer-cleaning truck',
		width: 620,
		height: 280,
		groundY: 212,
		palette: pal('#90BE6D', '#264653'),
		chassisPath: slab(620, 212, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 180, z: 0, scale: 0.85 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'tank', part: 'tank', x: 380, y: 135, z: 2, scale: 0.95 },
			{ id: 'hose', part: 'hoseReel', x: 520, y: 175, z: 2 },
			wheel('l', 180, 212),
			wheel('r', 500, 212)
		]
	},
	{
		id: 'airport-fuel-bowser',
		name: 'Airport fuel bowser',
		width: 620,
		height: 280,
		groundY: 210,
		palette: pal('#FFB703', '#023047'),
		chassisPath: slab(620, 210, 140),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 196, z: 0, scale: 0.72 },
			{ id: 'tank', part: 'tank', x: 380, y: 140, z: 1, scale: 1 },
			{ id: 'cab', part: 'cab', x: 118, y: 120, z: 2, scale: 0.9 },
			{ id: 'lights', part: 'lightBar', x: 118, y: 72, z: 3 },
			wheel('l', 180, 210),
			wheel('r', 500, 210)
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
		width: 620,
		height: 280,
		groundY: 212,
		palette: pal('#F7F9FC', '#E63946'),
		chassisPath: slab(620, 212, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 330, y: 160, z: 0, scale: 1 },
			{ id: 'cab', part: 'cab', x: 118, y: 125, z: 1, scale: 0.9 },
			{ id: 'window', part: 'windowStrip', x: 420, y: 126, z: 2, scale: 1.2 },
			{ id: 'lights', part: 'lightBar', x: 330, y: 84, z: 2 },
			{ id: 'door', part: 'door', x: 300, y: 165, z: 2 },
			wheel('l', 180, 212),
			wheel('r', 500, 212)
		]
	},
	{
		id: 'parcel-lorry',
		name: 'Parcel lorry',
		width: 660,
		height: 290,
		groundY: 215,
		palette: pal('#C1121F', '#F2E8CF'),
		chassisPath: slab(660, 215, 160),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 370, y: 165, z: 0, scale: 1.1 },
			{ id: 'cab', part: 'cab', x: 120, y: 125, z: 1, scale: 0.9 },
			{ id: 'door', part: 'door', x: 580, y: 170, z: 2 },
			{ id: 'light', part: 'light', x: 640, y: 155, z: 2 },
			wheel('l', 180, 215),
			wheel('r', 540, 215)
		]
	},
	{
		id: 'removals-van',
		name: 'Removals van',
		width: 600,
		height: 290,
		groundY: 212,
		palette: pal('#6A994E', '#F2E8CF'),
		chassisPath: slab(600, 212, 170),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 320, y: 155, z: 0, scale: 0.95 },
			{ id: 'cab', part: 'cab', x: 115, y: 125, z: 1, scale: 0.9 },
			{ id: 'ramp', part: 'flatbed', x: 540, y: 195, z: 2, scale: 0.5 },
			{ id: 'sign', part: 'roofSign', x: 330, y: 82, z: 1, scale: 1.2 },
			wheel('l', 170, 212),
			wheel('r', 490, 212)
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
		width: 620,
		height: 300,
		groundY: 210,
		palette: pal('#2A9D8F', '#F2E8CF'),
		chassisPath: slab(620, 210, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 310, y: 158, z: 0, scale: 1.15 },
			{ id: 'windows', part: 'windowStrip', x: 310, y: 114, z: 2, scale: 2.6 },
			{ id: 'poles', part: 'pantograph', x: 420, y: 66, z: 1, scale: 1.4 },
			{ id: 'door', part: 'door', x: 420, y: 160, z: 2 },
			wheel('l', 170, 210),
			wheel('r', 470, 210)
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
		width: 720,
		height: 290,
		groundY: 212,
		palette: pal('#E76F51', '#F2E8CF'),
		chassisPath: slab(720, 212, 170),
		slots: [
			{ id: 'body-front', part: 'bodyBox', x: 210, y: 160, z: 0, scale: 0.95 },
			{ id: 'body-rear', part: 'bodyBox', x: 510, y: 160, z: 0, scale: 0.95 },
			{ id: 'windows', part: 'windowStrip', x: 360, y: 116, z: 2, scale: 3.2 },
			{ id: 'pantograph', part: 'pantograph', x: 360, y: 74, z: 1, scale: 1.4 },
			wheel('l', 160, 212),
			wheel('r', 580, 212)
		]
	},
	{
		id: 'metro-train',
		name: 'Metro train',
		width: 720,
		height: 290,
		groundY: 212,
		palette: pal('#F1FAEE', '#1D3557'),
		chassisPath: slab(720, 212, 170),
		slots: [
			{ id: 'body-front', part: 'bodyBox', x: 210, y: 160, z: 0, scale: 0.95 },
			{ id: 'body-rear', part: 'bodyBox', x: 510, y: 160, z: 0, scale: 0.95 },
			{ id: 'windows', part: 'windowStrip', x: 360, y: 112, z: 2, scale: 3 },
			{ id: 'door', part: 'door', x: 360, y: 162, z: 2 },
			{ id: 'pantograph', part: 'pantograph', x: 520, y: 74, z: 1, scale: 1.4 },
			wheel('l', 160, 212),
			wheel('r', 580, 212)
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
		width: 560,
		height: 280,
		groundY: 210,
		palette: pal('#1D3557', '#F1FAEE'),
		chassisPath: slab(560, 210, 160),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 290, y: 158, z: 0, scale: 1 },
			{ id: 'cab', part: 'cab', x: 105, y: 125, z: 1, scale: 0.85 },
			{ id: 'window', part: 'windowStrip', x: 320, y: 118, z: 2, scale: 1.4 },
			{ id: 'lights', part: 'lightBar', x: 290, y: 82, z: 2 },
			{ id: 'door', part: 'door', x: 430, y: 160, z: 2 },
			wheel('l', 160, 210),
			wheel('r', 430, 210)
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
		width: 460,
		height: 270,
		groundY: 240,
		palette: pal('#F4A261', '#2B2D42'),
		chassisPath: slab(460, 240, 80),
		slots: [
			{ id: 'tracks', part: 'tracks', x: 220, y: 232, z: 0, scale: 0.85 },
			{ id: 'body', part: 'bodyBox', x: 220, y: 198, z: 1, scale: 0.5 },
			{ id: 'tipper', part: 'tipper', x: 240, y: 155, z: 2, scale: 0.7 },
			{ id: 'light', part: 'light', x: 360, y: 180, z: 2 },
			{ id: 'beacon', part: 'beacon', x: 300, y: 138, z: 2 }
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
		width: 560,
		height: 310,
		groundY: 232,
		palette: pal('#C1121F', '#2B2D42'),
		chassisPath: slab(560, 232, 150),
		slots: [
			{ id: 'body', part: 'bodyBox', x: 280, y: 180, z: 0, scale: 0.9 },
			{ id: 'cab', part: 'cabin', x: 180, y: 122, z: 1, scale: 0.8 },
			{ id: 'drum', part: 'roller', x: 480, y: 215, z: 2, scale: 1.1 },
			{ id: 'chimney', part: 'exhaust', x: 120, y: 112, z: 2 },
			wheel('l', 160, 232, 0.9),
			wheel('r', 330, 232, 0.9)
		]
	},
	{
		id: 'quad-bike',
		name: 'Quad bike',
		width: 460,
		height: 240,
		groundY: 205,
		palette: pal('#E63946', '#2B2D42'),
		chassisPath: slab(460, 205, 100),
		slots: [
			{ id: 'body', part: 'body', x: 240, y: 165, z: 0, scale: 0.7 },
			{ id: 'seat', part: 'roofSign', x: 250, y: 132, z: 1, scale: 0.8 },
			{ id: 'light', part: 'light', x: 400, y: 160, z: 2 },
			wheel('l', 150, 205, 1.15),
			wheel('r', 380, 205, 1.15)
		]
	}
];
