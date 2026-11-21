import { PARTS } from './parts';
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

const LOCOMOTION = new Set(['wheel', 'tracks', 'roller']);
const BODY = new Set(['body', 'bodyBox', 'frame', 'seat', 'tipper']);
const FACE = new Set(['cabin', 'cab', 'windowStrip', 'roof', 'platform']);

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

	// A child needs the thing that rolls and the thing that makes it that vehicle.
	for (const slot of slots) if (LOCOMOTION.has(slot.part)) add(slot);
	add(byArea.find((slot) => BODY.has(slot.part)));
	add(byArea.find((slot) => FACE.has(slot.part)));
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
	return { level: state.level, streak, stalls: 0 };
}

/** Two menu-abandoned builds quietly step back one piece; never below four. */
export function registerStall(state: DifficultyState): DifficultyState {
	const stalls = state.stalls + 1;
	if (stalls >= 2 && state.level > 0) {
		return { level: state.level - 1, streak: 0, stalls: 0 };
	}
	return { level: state.level, streak: 0, stalls };
}
