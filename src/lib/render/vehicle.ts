import type { AssemblyState, SlotAnchor } from '../game/assembly';
import type { Layout, Point } from '../game/layout';
import { PARTS, type PartShape, type PartId } from '../game/parts';
import type { Slot, Vehicle } from '../game/vehicles';
import { pathFrom } from './draw';
import { realPartCanvas, realVehicleCanvas } from './realVehicles';
import { OUTLINE } from './scene';
import { wheelSpin } from './motion';

/**
 * Vehicle drawing. Slots are positioned in vehicle units; the assembly anchors are already
 * in world units, so a placed part is drawn at its anchor with `gameScale`.
 */

export interface DrawPartOptions {
	alpha?: number;
	flip?: boolean;
	lift?: number;
	/** Rotation about the mask centre, for round wheels only. */
	spin?: number;
	/** Vertical scale for a landing squash. */
	squash?: number;
}

export function drawPart(
	ctx: CanvasRenderingContext2D,
	part: PartShape,
	at: Point,
	scale: number,
	options: DrawPartOptions = {}
): void {
	const { alpha = 1, flip = false, lift = 0, spin = 0, squash = 1 } = options;
	const tile = realPartCanvas(part);
	if (!tile || !part.maskBounds) return;

	const safeScale = Math.max(scale, 0.0001);
	const b = part.maskBounds;
	ctx.save();
	ctx.translate(at.x, at.y - lift);
	ctx.scale(flip ? -safeScale : safeScale, safeScale);
	ctx.rotate(spin);
	ctx.scale(1, squash);
	ctx.globalAlpha = alpha;
	ctx.drawImage(tile, -b.w / 2, -b.h / 2, b.w, b.h);
	ctx.restore();
}

export function drawContactShadow(
	ctx: CanvasRenderingContext2D,
	vehicle: Vehicle,
	layout: Layout,
	offsetX = 0
): void {
	ctx.save();
	ctx.globalAlpha = 0.16;
	ctx.fillStyle = OUTLINE;
	ctx.beginPath();
	ctx.ellipse(
		layout.vehicleAnchor.x + offsetX,
		layout.roadY + 14,
		vehicle.width * 0.44 * layout.gameScale,
		10 * layout.gameScale,
		0,
		0,
		Math.PI * 2
	);
	ctx.fill();
	ctx.restore();
}

const anchorMaps = new WeakMap<AssemblyState, Map<string, SlotAnchor>>();
const sortedSlots = new WeakMap<Vehicle, Slot[]>();

function anchorMap(state: AssemblyState): Map<string, SlotAnchor> {
	let map = anchorMaps.get(state);
	if (!map) {
		map = new Map(state.anchors.map((anchor) => [anchor.slotId, anchor]));
		anchorMaps.set(state, map);
	}
	return map;
}

function slotsInDrawOrder(vehicle: Vehicle): Slot[] {
	let slots = sortedSlots.get(vehicle);
	if (!slots) {
		slots = [...vehicle.slots].sort((a, b) => a.z - b.z);
		sortedSlots.set(vehicle, slots);
	}
	return slots;
}

/** Faint part-shaped ghosts at every unfilled slot, and the dashed chassis before the first. */
export function drawChassisGhosts(
	ctx: CanvasRenderingContext2D,
	vehicle: Vehicle,
	state: AssemblyState,
	layout: Layout,
	now: number
): void {
	const anchors = anchorMap(state);

	if (state.placed.length === 0) {
		const art = vehicle.realistic ? realVehicleCanvas(vehicle.id) : null;
		if (art) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(0, 0, layout.worldWidth, layout.roadY);
			ctx.clip();
			ctx.globalAlpha = 0.08;
			ctx.translate(state.origin.x, state.origin.y);
			ctx.scale(layout.gameScale, layout.gameScale);
			ctx.drawImage(art, 0, 0, vehicle.width, vehicle.height);
			ctx.restore();
		}
		ctx.save();
		// Keep the silhouette off the tarmac.
		ctx.beginPath();
		ctx.rect(0, 0, layout.worldWidth, layout.roadY);
		ctx.clip();
		ctx.translate(state.origin.x, state.origin.y);
		ctx.scale(layout.gameScale, layout.gameScale);
		ctx.strokeStyle = 'rgba(58, 39, 27, 0.35)';
		ctx.lineWidth = (layout.outline * 0.8) / layout.gameScale;
		ctx.setLineDash([14 / layout.gameScale, 10 / layout.gameScale]);
		if (!art) ctx.stroke(pathFrom(vehicle.chassisPath));
		ctx.restore();
	}

	const draggedPart = state.drag?.part ?? null;
	const pulse = 0.5 + 0.5 * Math.sin(now / 220);
	const scale = layout.gameScale;

	for (const slot of vehicle.slots) {
		if (state.placed.includes(slot.id)) continue;
		const anchor = anchors.get(slot.id);
		if (!anchor) continue;
		const shape = PARTS[slot.part];
		const highlighted = draggedPart === slot.part;
		const slotScale = (slot.scale ?? 1) * scale;

		if (highlighted) {
			ctx.save();
			ctx.globalAlpha = 0.35 + 0.35 * pulse;
			ctx.strokeStyle = '#FFB703';
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.arc(anchor.x, anchor.y, shape.radius * slotScale + 14, 0, Math.PI * 2);
			ctx.stroke();
			ctx.restore();
		}

		drawPart(ctx, shape, anchor, slotScale, {
			alpha: highlighted ? 0.32 : 0.18,
			flip: slot.flip
		});
	}
}

export function drawPlacedParts(
	ctx: CanvasRenderingContext2D,
	vehicle: Vehicle,
	state: AssemblyState,
	layout: Layout,
	lampAlpha = 1,
	bob = 0
): void {
	const anchors = anchorMap(state);
	const placed = slotsInDrawOrder(vehicle).filter((slot) => state.placed.includes(slot.id));

	for (const slot of placed) {
		const anchor = anchors.get(slot.id);
		if (!anchor) continue;
		const role = PARTS[slot.part].role;
		drawPart(
			ctx,
			PARTS[slot.part],
			anchor,
			(slot.scale ?? 1) * layout.gameScale,
			{ flip: slot.flip, alpha: role === 'lamp' ? lampAlpha : 1, lift: bob }
		);
	}
}

/** The whole vehicle, used by the drive-off and the arrival slide. */
export function drawVehicle(
	ctx: CanvasRenderingContext2D,
	vehicle: Vehicle,
	state: AssemblyState,
	layout: Layout,
	offsetX: number,
	squash = 1,
	lift = 0,
	alpha = 1,
	distance = 0
): void {
	const anchors = anchorMap(state);
	const originY = layout.vehicleAnchor.y;

	ctx.save();
	ctx.translate(offsetX, originY - lift);
	ctx.scale(1, squash);
	ctx.translate(0, -originY);

	for (const slot of slotsInDrawOrder(vehicle)) {
		const anchor = anchors.get(slot.id);
		if (!anchor) continue;
		const shape = PARTS[slot.part];
		drawPart(ctx, shape, anchor, (slot.scale ?? 1) * layout.gameScale, {
			flip: slot.flip,
			alpha,
			spin: spinFor(shape, distance)
		});
	}

	ctx.restore();
}

/** Wheel angle for a part; drums, tracks and bodies never spin. */
export function spinFor(part: PartShape, distance: number): number {
	if (!part.id.endsWith('Wheel')) return 0;
	return wheelSpin(distance, (part.maskBounds?.w ?? 0) / 2);
}

export function partFor(id: PartId): PartShape {
	return PARTS[id];
}
