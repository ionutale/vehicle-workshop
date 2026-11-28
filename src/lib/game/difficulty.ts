import { PARTS, type PartId, type PartKind } from './parts';
import type { Slot, Vehicle } from './vehicles';

/**
 * The silent difficulty ramp. A vehicle is always authored complete; this module returns a
 * view of it with only the first few slots, so the catalogue never needs starter variants.
 */

export const MIN_PIECES = 4;
export const MAX_LEVEL = 3;

export interface DifficultyState {
	level: number;
	streak: number;
	stalls: number;
}

export function initialDifficulty(): DifficultyState {
	return { level: 0, streak: 0, stalls: 0 };
}

const clampLevel = (level: number): number =>
	Math.max(0, Math.min(MAX_LEVEL, Math.floor(Number.isFinite(level) ? level : 0)));

export function piecesAtLevel(level: number): number {
	return MIN_PIECES + clampLevel(level);
}

const kindOf = (slot: Slot): PartKind => PARTS[slot.part].kind ?? 'detail';

function area(slot: Slot): number {
	const shape = PARTS[slot.part];
	const scale = slot.scale ?? 1;
	return shape.halfWidth * shape.halfHeight * scale * scale;
}

function selectSlots(slots: Slot[], limit: number): Slot[] {
	const keep = new Set<string>();
	const add = (slot: Slot | undefined) => {
		if (slot && keep.size < limit) keep.add(slot.id);
	};
	const byArea = [...slots].sort((a, b) => area(b) - area(a) || a.z - b.z);

	// A child needs the thing that rolls, the thing that holds it together, the part that
	// says what it is, and a face. Then fill up to the limit with the biggest remainder.
	// Body first, so a machine with three locomotion slots can never squeeze it out.
	add(byArea.find((slot) => kindOf(slot) === 'body'));
	for (const slot of slots) if (kindOf(slot) === 'locomotion') add(slot);
	add(byArea.find((slot) => kindOf(slot) === 'connector'));
	add(byArea.find((slot) => kindOf(slot) === 'cargo'));
	add(byArea.find((slot) => kindOf(slot) === 'face'));
	for (const slot of byArea) add(slot);

	return slots.filter((slot) => keep.has(slot.id));
}

/**
 * The vehicle as it should appear at this level: the full object once every slot fits,
 * otherwise a copy whose slots preserve the original order and anchors.
 */
export function vehicleAtLevel(vehicle: Vehicle, level: number): Vehicle {
	const limit = piecesAtLevel(level);
	if (vehicle.slots.length <= limit) return vehicle;
	return { ...vehicle, slots: selectSlots(vehicle.slots, limit) };
}

/** Three clean builds widen the next vehicle by one piece. */
export function registerFinish(state: DifficultyState): DifficultyState {
	const streak = state.streak + 1;
	if (streak >= 3 && state.level < MAX_LEVEL) {
		return { level: state.level + 1, streak: 0, stalls: 0 };
	}
	return { level: state.level, streak: Math.min(streak, 2), stalls: 0 };
}

/** Two menu-abandoned builds quietly step back one piece; never below four. */
export function registerStall(state: DifficultyState): DifficultyState {
	const stalls = state.stalls + 1;
	if (stalls >= 2 && state.level > 0) {
		return { level: state.level - 1, streak: 0, stalls: 0 };
	}
	return { level: state.level, streak: 0, stalls };
}
