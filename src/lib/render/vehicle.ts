import type { AssemblyState, SlotAnchor } from '../game/assembly';
import type { Layout, Point } from '../game/layout';
import { PARTS, type PartShape, type PartId, type Role } from '../game/parts';
import type { Vehicle } from '../game/vehicles';
import { pathFrom } from './draw';
import { OUTLINE } from './scene';

/**
 * Vehicle drawing. Slots are positioned in vehicle units; the assembly anchors are already
 * in world units, so a placed part is drawn at its anchor with `gameScale`.
 */

export const OUTLINE_WIDTH = 3.5;

export interface DrawPartOptions {
	alpha?: number;
	flip?: boolean;
	lift?: number;
}

export function drawPart(
	ctx: CanvasRenderingContext2D,
	part: PartShape,
	palette: Record<Role, string>,
	at: Point,
	scale: number,
	options: DrawPartOptions = {}
): void {
	const { alpha = 1, flip = false, lift = 0 } = options;
	ctx.save();
	ctx.translate(at.x, at.y - lift);
	ctx.scale(flip ? -scale : scale, scale);
	ctx.globalAlpha = alpha;

	const path = pathFrom(part.path);
	ctx.fillStyle = palette[part.role];
	ctx.fill(path, 'evenodd');
	ctx.strokeStyle = OUTLINE;
	ctx.lineWidth = OUTLINE_WIDTH / Math.max(scale, 0.0001);
	ctx.stroke(path);

	ctx.restore();
}

function anchorMap(state: AssemblyState): Map<string, SlotAnchor> {
	return new Map(state.anchors.map((anchor) => [anchor.slotId, anchor]));
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
		ctx.save();
		ctx.scale(layout.gameScale, layout.gameScale);
		ctx.strokeStyle = 'rgba(58, 39, 27, 0.35)';
		ctx.lineWidth = 3 / layout.gameScale;
		ctx.setLineDash([14 / layout.gameScale, 10 / layout.gameScale]);
		ctx.stroke(pathFrom(vehicle.chassisPath));
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

		drawPart(ctx, shape, vehicle.palette, anchor, slotScale, {
			alpha: highlighted ? 0.32 : 0.18,
			flip: slot.flip
		});
	}
}

export function drawPlacedParts(
	ctx: CanvasRenderingContext2D,
	vehicle: Vehicle,
	state: AssemblyState,
	layout: Layout
): void {
	const anchors = anchorMap(state);
	const placed = vehicle.slots
		.filter((slot) => state.placed.includes(slot.id))
		.sort((a, b) => a.z - b.z);

	for (const slot of placed) {
		const anchor = anchors.get(slot.id);
		if (!anchor) continue;
		drawPart(
			ctx,
			PARTS[slot.part],
			vehicle.palette,
			anchor,
			(slot.scale ?? 1) * layout.gameScale,
			{ flip: slot.flip }
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
	squash = 1
): void {
	const anchors = anchorMap(state);
	const originY = layout.vehicleAnchor.y;

	ctx.save();
	ctx.translate(offsetX, originY);
	ctx.scale(1, squash);
	ctx.translate(0, -originY);

	for (const slot of [...vehicle.slots].sort((a, b) => a.z - b.z)) {
		const anchor = anchors.get(slot.id);
		if (!anchor) continue;
		drawPart(ctx, PARTS[slot.part], vehicle.palette, anchor, (slot.scale ?? 1) * layout.gameScale, {
			flip: slot.flip
		});
	}

	ctx.restore();
}

export function partFor(id: PartId): PartShape {
	return PARTS[id];
}
