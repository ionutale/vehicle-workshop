import type { Point } from './layout';
import { PARTS, type PartId } from './parts';
import { getVehicle, type Slot, type Vehicle } from './vehicles';

/**
 * The assembly state machine. Pure: every event returns a new state, and the only clock is
 * the `now` each event carries. Rendering and sound read this state; they never own it.
 */

export interface SlotAnchor {
	slotId: string;
	part: PartId;
	/** World units. */
	x: number;
	y: number;
}

export interface Settle {
	slotId: string;
	from: Point;
	to: Point;
	startedAt: number;
	duration: number;
}

export interface Drag {
	/** The shelf entry's slot id; identical to the slot it may land on unless parts repeat. */
	slotId: string;
	part: PartId;
	grab: Point;
	at: Point;
}

export type Phase = 'assembling' | 'ready' | 'driving' | 'arriving';

export interface AssemblyState {
	phase: Phase;
	vehicleId: string;
	placed: string[];
	drag: Drag | null;
	settle: Settle | null;
	anchors: SlotAnchor[];
	gameScale: number;
	origin: Point;
	snapRadius: number;
	phaseStartedAt: number;
	timeScale: number;
	arrivedAt: number | null;
}

export type AssemblyEvent =
	| { type: 'pick'; slotId: string; at: Point; now: number; origin?: Point }
	| { type: 'move'; at: Point }
	| { type: 'drop'; at: Point; now: number; shelfCenters: Record<string, Point> }
	| { type: 'tick'; now: number }
	| { type: 'arrive'; vehicleId: string; now: number };

export function timeline(timeScale: number): { readyMs: number; driveMs: number; arriveMs: number } {
	return { readyMs: 500 * timeScale, driveMs: 1200 * timeScale, arriveMs: 400 * timeScale };
}

function anchorsFor(vehicle: Vehicle, gameScale: number, origin: Point): SlotAnchor[] {
	return vehicle.slots.map((slot: Slot) => ({
		slotId: slot.id,
		part: slot.part,
		x: origin.x + slot.x * gameScale,
		y: origin.y + slot.y * gameScale
	}));
}

export function createAssembly(
	vehicle: Vehicle,
	gameScale: number,
	snapRadius: number,
	now: number,
	timeScale = 1,
	origin: Point = { x: 0, y: 0 }
): AssemblyState {
	return {
		phase: 'assembling',
		vehicleId: vehicle.id,
		placed: [],
		drag: null,
		settle: null,
		anchors: anchorsFor(vehicle, gameScale, origin),
		gameScale,
		origin,
		snapRadius,
		phaseStartedAt: now,
		timeScale,
		arrivedAt: null
	};
}

export function unfilledSlots(state: AssemblyState): SlotAnchor[] {
	return state.anchors.filter((anchor) => !state.placed.includes(anchor.slotId));
}

export function nearestSlot(
	state: AssemblyState,
	part: PartId,
	at: Point
): { slotId: string; distance: number } | null {
	let best: { slotId: string; distance: number } | null = null;
	for (const anchor of unfilledSlots(state)) {
		if (anchor.part !== part) continue;
		const distance = Math.hypot(anchor.x - at.x, anchor.y - at.y);
		if (best === null || distance < best.distance) best = { slotId: anchor.slotId, distance };
	}
	return best;
}

export function reduce(state: AssemblyState, event: AssemblyEvent): AssemblyState {
	switch (event.type) {
		case 'pick': {
			if (state.phase !== 'assembling' || state.drag !== null) return state;
			if (state.placed.includes(event.slotId)) return state;
			const anchor = state.anchors.find((a) => a.slotId === event.slotId);
			if (!anchor) return state;
			return {
				...state,
				drag: {
					slotId: event.slotId,
					part: anchor.part,
					grab: {
						x: event.at.x - (event.origin?.x ?? event.at.x),
						y: event.at.y - (event.origin?.y ?? event.at.y)
					},
					at: event.at
				},
				settle: null
			};
		}

		case 'move': {
			if (!state.drag) return state;
			return { ...state, drag: { ...state.drag, at: event.at } };
		}

		case 'drop': {
			if (!state.drag) return state;
			const drag = state.drag;
			const candidate = nearestSlot(state, drag.part, event.at);
			const snapped = candidate !== null && candidate.distance <= state.snapRadius;
			const target = snapped
				? state.anchors.find((a) => a.slotId === candidate.slotId)!
				: null;
			const fallback = state.origin;
			const shelfCenter = event.shelfCenters[drag.slotId] ?? fallback;

			const placed = target ? [...state.placed, target.slotId] : state.placed;
			const complete = placed.length === state.anchors.length;

			return {
				...state,
				placed,
				drag: null,
				settle: {
					slotId: drag.slotId,
					from: { x: drag.at.x - drag.grab.x, y: drag.at.y - drag.grab.y },
					to: target ? { x: target.x, y: target.y } : shelfCenter,
					startedAt: event.now,
					duration: snapped ? 150 : 220
				},
				phase: complete ? 'ready' : state.phase,
				phaseStartedAt: complete ? event.now : state.phaseStartedAt
			};
		}

		case 'tick': {
			const t = timeline(state.timeScale);
			const elapsed = event.now - state.phaseStartedAt;
			const settle =
				state.settle && event.now - state.settle.startedAt >= state.settle.duration
					? null
					: state.settle;
			if (settle !== state.settle) {
				return reduce({ ...state, settle }, event);
			}
			if (state.phase === 'ready' && elapsed >= t.readyMs) {
				return { ...state, phase: 'driving', phaseStartedAt: state.phaseStartedAt + t.readyMs };
			}
			if (state.phase === 'arriving' && elapsed >= t.arriveMs) {
				return { ...state, phase: 'assembling', phaseStartedAt: event.now };
			}
			return state;
		}

		case 'arrive': {
			const vehicle = getVehicle(event.vehicleId);
			return {
				...state,
				phase: 'arriving',
				vehicleId: vehicle.id,
				placed: [],
				drag: null,
				settle: null,
				anchors: anchorsFor(vehicle, state.gameScale, state.origin),
				phaseStartedAt: event.now,
				arrivedAt: event.now
			};
		}
	}
}

/** The part radius that sets the snap distance for a given part. */
export function partSnapRadius(part: PartId, gameScale: number): number {
	return Math.max(48, PARTS[part].radius * 0.9 * gameScale);
}
