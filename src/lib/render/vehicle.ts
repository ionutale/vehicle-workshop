import type { AssemblyState, SlotAnchor } from '../game/assembly';
import type { Layout, Point } from '../game/layout';
import { PARTS, type PartShape, type PartId, type Role } from '../game/parts';
import type { Slot, Vehicle } from '../game/vehicles';
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
	/** Outline thickness in world units; keeps the stroke weight even across scales. */
	outlineWidth?: number;
}

export function drawPart(
	ctx: CanvasRenderingContext2D,
	part: PartShape,
	palette: Record<Role, string>,
	at: Point,
	scale: number,
	options: DrawPartOptions = {}
): void {
	const { alpha = 1, flip = false, lift = 0, outlineWidth = OUTLINE_WIDTH } = options;
	const safeScale = Math.max(scale, 0.0001);
	ctx.save();
	ctx.translate(at.x, at.y - lift);
	ctx.scale(flip ? -safeScale : safeScale, safeScale);
	ctx.globalAlpha = alpha;

	const path = pathFrom(part.path);
	const hw = part.halfWidth;
	const hh = part.halfHeight;

	ctx.fillStyle = palette[part.role];
	ctx.fill(path, 'evenodd');

	// Paper depth: a soft shadow along the lower edge and a light band on top.
	ctx.save();
	ctx.clip(path, 'evenodd');
	ctx.fillStyle = 'rgba(58, 39, 27, 0.10)';
	ctx.fillRect(-hw, hh * 0.32, hw * 2, hh);
	ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
	ctx.fillRect(-hw, -hh, hw * 2, Math.max(3, hh * 0.26));
	ctx.restore();

	if (part.glassPath) drawGlass(ctx, part, palette, outlineWidth / safeScale);

	if (part.id === 'wheel') drawWheel(ctx, part, outlineWidth / safeScale);
	else if (part.id === 'tracks') drawTrackWheels(ctx, part);
	else if (part.id === 'roller') drawRollerBand(ctx, part);
	else if (part.id === 'windowStrip') drawWindowPanes(ctx, part, path);

	ctx.strokeStyle = OUTLINE;
	ctx.lineWidth = outlineWidth / safeScale;
	ctx.stroke(path);

	if (part.glassPath) {
		ctx.strokeStyle = 'rgba(58, 39, 27, 0.55)';
		ctx.lineWidth = (outlineWidth * 0.7) / safeScale;
		ctx.stroke(pathFrom(part.glassPath));
	}

	ctx.restore();
}

function drawGlass(
	ctx: CanvasRenderingContext2D,
	part: PartShape,
	palette: Record<Role, string>,
	lineWidth: number
): void {
	const glass = pathFrom(part.glassPath!);
	ctx.fillStyle = palette.glass;
	ctx.fill(glass);

	// A single diagonal reflection, clipped to the pane.
	ctx.save();
	ctx.clip(glass);
	ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
	ctx.beginPath();
	ctx.moveTo(-part.halfWidth * 0.9, part.halfHeight * 0.35);
	ctx.lineTo(-part.halfWidth * 0.05, -part.halfHeight);
	ctx.lineTo(part.halfWidth * 0.28, -part.halfHeight);
	ctx.lineTo(-part.halfWidth * 0.6, part.halfHeight * 0.1);
	ctx.closePath();
	ctx.fill();
	ctx.restore();

	ctx.strokeStyle = 'rgba(58, 39, 27, 0.5)';
	ctx.lineWidth = lineWidth * 0.7;
	ctx.stroke(glass);
}

/** Tyre wall, rim and hub, so a wheel reads as a wheel at any size. */
function drawWheel(ctx: CanvasRenderingContext2D, part: PartShape, lineWidth: number): void {
	const outer = part.halfWidth;
	const rim = outer * 0.42;
	const hub = outer * 0.16;

	ctx.fillStyle = '#C9D2DE';
	ctx.beginPath();
	ctx.arc(0, 0, rim, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = 'rgba(58, 39, 27, 0.65)';
	ctx.lineWidth = lineWidth * 0.6;
	ctx.stroke();

	ctx.fillStyle = '#8A93A3';
	ctx.beginPath();
	ctx.arc(0, 0, hub, 0, Math.PI * 2);
	ctx.fill();

	// Tread notches around the tyre wall.
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
	ctx.lineWidth = Math.max(1.5, outer * 0.07);
	for (let i = 0; i < 8; i++) {
		const angle = (i / 8) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(Math.cos(angle) * outer * 0.74, Math.sin(angle) * outer * 0.74);
		ctx.lineTo(Math.cos(angle) * outer * 0.96, Math.sin(angle) * outer * 0.96);
		ctx.stroke();
	}
}

function drawTrackWheels(ctx: CanvasRenderingContext2D, part: PartShape): void {
	const y = part.halfHeight * 0.5;
	const spread = part.halfWidth * 0.62;
	ctx.fillStyle = '#9AA3B2';
	for (const x of [-spread, -spread / 3, spread / 3, spread]) {
		ctx.beginPath();
		ctx.arc(x, y, part.halfHeight * 0.34, 0, Math.PI * 2);
		ctx.fill();
	}
}

/** Mullions make a glass strip read as a row of windows rather than a stripe. */
function drawWindowPanes(
	ctx: CanvasRenderingContext2D,
	part: PartShape,
	path: Path2D
): void {
	ctx.save();
	ctx.clip(path, 'evenodd');
	ctx.strokeStyle = 'rgba(58, 39, 27, 0.35)';
	ctx.lineWidth = Math.max(2, part.halfHeight * 0.22);
	const panes = Math.max(2, Math.round(part.halfWidth / 22));
	for (let i = 1; i < panes; i++) {
		const x = -part.halfWidth + (i * part.halfWidth * 2) / panes;
		ctx.beginPath();
		ctx.moveTo(x, -part.halfHeight * 0.9);
		ctx.lineTo(x, part.halfHeight * 0.9);
		ctx.stroke();
	}
	ctx.restore();
}

function drawRollerBand(ctx: CanvasRenderingContext2D, part: PartShape): void {
	ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
	ctx.fillRect(-part.halfWidth * 0.55, -part.halfHeight * 0.8, part.halfWidth * 0.25, part.halfHeight * 1.6);
}

/** A soft ellipse under the vehicle, so it sits on the road instead of floating. */
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
			flip: slot.flip,
			outlineWidth: layout.outline
		});
	}
}

export function drawPlacedParts(
	ctx: CanvasRenderingContext2D,
	vehicle: Vehicle,
	state: AssemblyState,
	layout: Layout,
	lampAlpha = 1
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
			vehicle.palette,
			anchor,
			(slot.scale ?? 1) * layout.gameScale,
			{ flip: slot.flip, alpha: role === 'lamp' ? lampAlpha : 1, outlineWidth: layout.outline }
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
	lift = 0
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
		drawPart(ctx, PARTS[slot.part], vehicle.palette, anchor, (slot.scale ?? 1) * layout.gameScale, {
			flip: slot.flip,
			outlineWidth: layout.outline
		});
	}

	ctx.restore();
}

export function partFor(id: PartId): PartShape {
	return PARTS[id];
}
