import type { AssemblyState } from '../game/assembly';
import { familyOf } from '../game/families';
import type { Layout } from '../game/layout';
import { PARTS } from '../game/parts';
import type { Slot, Vehicle } from '../game/vehicles';
import { roundedRect } from './draw';
import { OUTLINE } from './scene';

/**
 * Per-vehicle detail drawn over the assembled parts. Details are derived from the vehicle's
 * own slots and never add pieces, so the puzzle count and the difficulty ramp are untouched.
 */

export type DetailKind =
	| 'grille'
	| 'mirror'
	| 'exhaust'
	| 'mudflap'
	| 'stripe'
	| 'tieDown'
	| 'hydraulic'
	| 'counterweight'
	| 'routeBoard'
	| 'hazard';

export interface Detail {
	kind: DetailKind;
	/** Vehicle units, same space as a slot anchor. */
	x: number;
	y: number;
	scale?: number;
	/** Vehicle-unit length for bands such as the stripe. */
	length?: number;
	/** Draw the detail mirrored for a left-facing vehicle. */
	flip?: boolean;
	/** Slot id that must be placed before this detail is drawn. */
	requires?: string;
}

const BODY_PARTS = ['body', 'bodyBox', 'frame', 'seat'] as const;
const CARGO_PARTS = [
	'tank',
	'flatbed',
	'logs',
	'tipper',
	'bale',
	'skip',
	'miniCar',
	'header',
	'mixer'
] as const;
const CONNECTOR_PARTS = ['arm', 'boom'] as const;

interface Bounds {
	left: number;
	right: number;
	top: number;
	bottom: number;
	cx: number;
	cy: number;
}

function bounds(slot: Slot): Bounds {
	const shape = PARTS[slot.part];
	const scale = slot.scale ?? 1;
	const halfWidth = shape.halfWidth * scale;
	const halfHeight = shape.halfHeight * scale;
	return {
		left: slot.x - halfWidth,
		right: slot.x + halfWidth,
		top: slot.y - halfHeight,
		bottom: slot.y + halfHeight,
		cx: slot.x,
		cy: slot.y
	};
}

function area(slot: Slot): number {
	const shape = PARTS[slot.part];
	const scale = slot.scale ?? 1;
	return shape.halfWidth * shape.halfHeight * scale * scale;
}

function largest(slots: Slot[], parts: readonly string[]): Slot | undefined {
	return slots
		.filter((slot) => parts.includes(slot.part))
		.sort((a, b) => area(b) - area(a))[0];
}

const DETAIL_OVERRIDES: Record<string, DetailKind[]> = {
	'fire-engine': ['hazard'],
	'airport-fire-truck': ['hazard'],
	'milk-tanker': ['tieDown'],
	'fuel-tanker': ['tieDown'],
	'tow-truck': ['hydraulic'],
	'crane-truck': ['hydraulic'],
	'cement-mixer': ['counterweight'],
	'garbage-truck': ['hazard'],
	'school-bus': ['routeBoard'],
	tram: ['routeBoard'],
	digger: ['hydraulic']
};

/** Details for the full or level-trimmed vehicle. */
export function detailsFor(vehicle: Vehicle): Detail[] {
	const slots = vehicle.slots;
	const bodySlot = largest(slots, BODY_PARTS) ?? slots[0];
	if (!bodySlot) return [];

	const body = bounds(bodySlot);
	const cabinSlot = largest(slots, ['cabin', 'cab']);
	const cabin = cabinSlot ? bounds(cabinSlot) : null;
	const cargoSlot = largest(slots, CARGO_PARTS);
	const cargo = cargoSlot ? bounds(cargoSlot) : null;
	const connectorSlot = largest(slots, CONNECTOR_PARTS);
	const connector = connectorSlot ? bounds(connectorSlot) : null;
	const family = familyOf(vehicle);
	const lightSlot = slots.find((slot) => slot.part === 'light');
	const direction = lightSlot
		? Math.sign(lightSlot.x - body.cx) || 1
		: cabinSlot
			? Math.sign(cabinSlot.x - body.cx) || 1
			: 1;
	const front =
		direction > 0
			? Math.max(body.right, cabin?.right ?? body.right)
			: Math.min(body.left, cabin?.left ?? body.left);
	const rear =
		direction > 0
			? Math.min(body.left, cabin?.left ?? body.left)
			: Math.max(body.right, cabin?.right ?? body.right);
	const inward = (value: number, distance: number) =>
		direction > 0 ? value - distance : value + distance;
	const outward = (value: number, distance: number) =>
		direction > 0 ? value + distance : value - distance;
	const bodyHeight = Math.max(1, body.bottom - body.top);
	const grilleScale = Math.max(0.55, Math.min(1.3, bodyHeight / 90));

	const details: Detail[] = [
		{
			kind: 'grille',
			x: inward(front, 10),
			y: body.cy + bodyHeight * 0.16,
			scale: grilleScale,
			requires: bodySlot.id
		}
	];

	if (cabinSlot && cabin) {
		details.push({
			kind: 'mirror',
			x: direction > 0 ? cabin.right - 4 : cabin.left + 4,
			y: cabin.top + 10,
			scale: 0.85,
			flip: direction < 0,
			requires: cabinSlot.id
		});
	}

	if (family !== 'rail' && !slots.some((slot) => slot.part === 'exhaust')) {
		details.push({
			kind: 'exhaust',
			x: outward(rear, 8),
			y: body.bottom - 10,
			scale: 0.9,
			flip: direction < 0,
			requires: bodySlot.id
		});
	}

	for (const wheelSlot of slots.filter((slot) => slot.part === 'wheel')) {
		const wheel = bounds(wheelSlot);
		details.push({
			kind: 'mudflap',
			x: wheel.left - 2,
			y: wheel.bottom - 6,
			scale: 0.8,
			requires: wheelSlot.id
		});
	}

	if (family === 'car' || family === 'truck' || family === 'bus' || family === 'rail') {
		details.push({
			kind: 'stripe',
			x: body.cx,
			y: body.cy + bodyHeight * 0.24,
			length: Math.max(30, body.right - body.left - 18),
			requires: bodySlot.id
		});
	}

	if (cargoSlot && cargo) {
		for (const side of [-1, 1]) {
			details.push({
				kind: 'tieDown',
				x: cargo.cx + side * (cargo.right - cargo.left) * 0.28,
				y: cargo.top + 8,
				scale: 0.9,
				requires: cargoSlot.id
			});
		}
	}

	if (family === 'works') {
		details.push({
			kind: 'counterweight',
			x: outward(rear, 14),
			y: body.bottom - 12,
			scale: 1,
			requires: bodySlot.id
		});
	}

	if (family === 'bus' || family === 'rail') {
		details.push({
			kind: 'routeBoard',
			x: inward(front, 24),
			y: body.top + 10,
			scale: 0.9,
			requires: bodySlot.id
		});
	}

	if (family === 'truck' || family === 'works') {
		details.push({
			kind: 'hazard',
			x: outward(rear, 18),
			y: body.bottom - 12,
			scale: 0.85,
			requires: bodySlot.id
		});
	}

	if (connectorSlot && connector) {
		details.push({
			kind: 'hydraulic',
			x: connector.cx,
			y: connector.cy,
			scale: 1,
			requires: connectorSlot.id
		});
	}

	for (const kind of DETAIL_OVERRIDES[vehicle.id] ?? []) {
		if (details.some((detail) => detail.kind === kind)) continue;
		const detail = extraDetail(kind, direction, {
			front,
			rear,
			body,
			bodySlot,
			cargo,
			cargoSlot,
			connector,
			connectorSlot
		});
		if (detail) details.push(detail);
	}

	return details;
}

function extraDetail(
	kind: DetailKind,
	direction: number,
	ctx: {
		front: number;
		rear: number;
		body: Bounds;
		bodySlot: Slot;
		cargo: Bounds | null;
		cargoSlot: Slot | undefined;
		connector: Bounds | null;
		connectorSlot: Slot | undefined;
	}
): Detail | null {
	const { front, rear, body, bodySlot, cargo, cargoSlot, connector, connectorSlot } = ctx;
	const inward = (value: number, distance: number) =>
		direction > 0 ? value - distance : value + distance;
	const outward = (value: number, distance: number) =>
		direction > 0 ? value + distance : value - distance;
	switch (kind) {
		case 'hazard':
			return {
				kind,
				x: outward(rear, 18),
				y: body.bottom - 12,
				scale: 0.85,
				requires: bodySlot.id
			};
		case 'counterweight':
			return {
				kind,
				x: outward(rear, 14),
				y: body.bottom - 12,
				scale: 1,
				requires: bodySlot.id
			};
		case 'routeBoard':
			return {
				kind,
				x: inward(front, 24),
				y: body.top + 10,
				scale: 0.9,
				requires: bodySlot.id
			};
		case 'exhaust':
			return {
				kind,
				x: outward(rear, 8),
				y: body.bottom - 10,
				scale: 0.9,
				flip: direction < 0,
				requires: bodySlot.id
			};
		case 'tieDown':
			return cargo && cargoSlot
				? {
						kind,
						x: cargo.cx,
						y: cargo.top + 8,
						scale: 0.9,
						requires: cargoSlot.id
					}
				: null;
		case 'hydraulic':
			return connector && connectorSlot
				? {
						kind,
						x: connector.cx,
						y: connector.cy,
						scale: 1,
						requires: connectorSlot.id
					}
				: null;
		default:
			return null;
	}
}

export interface DetailOptions {
	offsetX?: number;
	lift?: number;
	alpha?: number;
}

export function drawVehicleDetails(
	ctx: CanvasRenderingContext2D,
	vehicle: Vehicle,
	state: AssemblyState,
	layout: Layout,
	options: DetailOptions = {}
): void {
	if (state.placed.length === 0) return;

	const { offsetX = 0, lift = 0, alpha = 1 } = options;
	const details = detailsFor(vehicle);
	if (details.length === 0) return;

	ctx.save();
	ctx.globalAlpha = alpha;
	for (const detail of details) {
		if (detail.requires && !state.placed.includes(detail.requires)) continue;
		const x = state.origin.x + detail.x * layout.gameScale + offsetX;
		const y = state.origin.y + detail.y * layout.gameScale - lift;
		const scale = layout.gameScale * (detail.scale ?? 1);
		ctx.save();
		ctx.translate(x, y);
		if (detail.flip) ctx.scale(-1, 1);
		drawDetail(ctx, detail, vehicle, 0, 0, scale);
		ctx.restore();
	}
	ctx.restore();
}

function drawDetail(
	ctx: CanvasRenderingContext2D,
	detail: Detail,
	vehicle: Vehicle,
	x: number,
	y: number,
	scale: number
): void {
	switch (detail.kind) {
		case 'grille':
			roundedRect(ctx, x - 8 * scale, y - 11 * scale, 16 * scale, 22 * scale, 4 * scale);
			ctx.fillStyle = '#2B2D42';
			ctx.fill();
			ctx.strokeStyle = OUTLINE;
			ctx.lineWidth = 1.6;
			ctx.stroke();
			ctx.strokeStyle = '#C9D2DE';
			ctx.lineWidth = Math.max(1, 1.6 * scale);
			for (let i = -1; i <= 1; i++) {
				ctx.beginPath();
				ctx.moveTo(x + i * 4.5 * scale, y - 8 * scale);
				ctx.lineTo(x + i * 4.5 * scale, y + 8 * scale);
				ctx.stroke();
			}
			break;

		case 'mirror': {
			ctx.strokeStyle = OUTLINE;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(x - 6 * scale, y + 5 * scale);
			ctx.lineTo(x, y);
			ctx.lineTo(x + 5 * scale, y - 2 * scale);
			ctx.stroke();
			ctx.fillStyle = vehicle.palette.trim;
			ctx.beginPath();
			ctx.ellipse(x + 6 * scale, y - 2 * scale, 5 * scale, 7 * scale, 0.25, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = OUTLINE;
			ctx.lineWidth = 1.5;
			ctx.stroke();
			break;
		}

		case 'exhaust':
			ctx.strokeStyle = '#8A93A3';
			ctx.lineWidth = Math.max(2, 4 * scale);
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + 2 * scale, y - 12 * scale);
			ctx.stroke();
			ctx.fillStyle = OUTLINE;
			ctx.beginPath();
			ctx.arc(x + 2 * scale, y - 12 * scale, 3 * scale, 0, Math.PI * 2);
			ctx.fill();
			break;

		case 'mudflap':
			ctx.fillStyle = vehicle.palette.rubber;
			roundedRect(ctx, x - 6 * scale, y, 12 * scale, 14 * scale, 2 * scale);
			ctx.fill();
			ctx.strokeStyle = OUTLINE;
			ctx.lineWidth = 1.2;
			ctx.stroke();
			break;

		case 'stripe': {
			const length = (detail.length ?? 80) * scale;
			roundedRect(ctx, x - length / 2, y - 3 * scale, length, 6 * scale, 3 * scale);
			ctx.fillStyle = vehicle.palette.trim;
			ctx.fill();
			ctx.strokeStyle = 'rgba(58, 39, 27, 0.45)';
			ctx.lineWidth = 1;
			ctx.stroke();
			break;
		}

		case 'tieDown':
			ctx.strokeStyle = '#3A271B';
			ctx.lineWidth = Math.max(1.5, 2.2 * scale);
			ctx.beginPath();
			ctx.moveTo(x - 5 * scale, y);
			ctx.lineTo(x + 5 * scale, y + 14 * scale);
			ctx.stroke();
			break;

		case 'hydraulic':
			ctx.strokeStyle = '#8A93A3';
			ctx.lineWidth = Math.max(1.5, 3 * scale);
			ctx.beginPath();
			ctx.moveTo(x - 10 * scale, y + 8 * scale);
			ctx.quadraticCurveTo(x + 4 * scale, y, x + 12 * scale, y - 10 * scale);
			ctx.stroke();
			break;

		case 'counterweight':
			ctx.fillStyle = '#4A4E5A';
			roundedRect(ctx, x - 10 * scale, y - 8 * scale, 20 * scale, 16 * scale, 4 * scale);
			ctx.fill();
			ctx.strokeStyle = OUTLINE;
			ctx.lineWidth = 1.5;
			ctx.stroke();
			break;

		case 'routeBoard': {
			ctx.fillStyle = '#FFF9EC';
			roundedRect(ctx, x - 14 * scale, y - 8 * scale, 28 * scale, 16 * scale, 3 * scale);
			ctx.fill();
			ctx.strokeStyle = OUTLINE;
			ctx.lineWidth = 1.4;
			ctx.stroke();
			ctx.fillStyle = '#3A271B';
			ctx.fillRect(x - 10 * scale, y - 3 * scale, 20 * scale, 2 * scale);
			ctx.fillRect(x - 7 * scale, y + 2 * scale, 14 * scale, 2 * scale);
			break;
		}

		case 'hazard': {
			ctx.fillStyle = '#FFD166';
			roundedRect(ctx, x - 12 * scale, y - 7 * scale, 24 * scale, 14 * scale, 3 * scale);
			ctx.fill();
			ctx.strokeStyle = OUTLINE;
			ctx.lineWidth = 1.3;
			ctx.stroke();
			ctx.strokeStyle = '#2B2D42';
			ctx.lineWidth = Math.max(1.5, 3 * scale);
			for (let i = -1; i <= 1; i++) {
				ctx.beginPath();
				ctx.moveTo(x + i * 8 * scale - 4 * scale, y + 6 * scale);
				ctx.lineTo(x + i * 8 * scale + 4 * scale, y - 6 * scale);
				ctx.stroke();
			}
			break;
		}
	}
}
