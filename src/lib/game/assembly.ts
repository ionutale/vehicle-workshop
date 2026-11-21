import type { Point } from './layout';
import type { PartId } from './parts';
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

export type Phase = 'assembling' | 'ready' | 'driving' | 'working' | 'arriving';

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
	| {
			type: 'arrive';
			vehicleId: string;
			now: number;
			gameScale?: number;
			snapRadius?: number;
			origin?: Point;
	  };

export function timeline(timeScale: number): {
	readyMs: number;
	driveMs: number;
	workMs: number;
	arriveMs: number;
} {
	return {
		readyMs: 500 * timeScale,
		driveMs: 1200 * timeScale,
		workMs: 3000 * timeScale,
		arriveMs: 400 * timeScale
	};
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
			// Match the piece's anchor, not the fingertip: a wide slab grabbed near its end
			// must still land when its body sits on the ghost.
			const pieceAt = { x: event.at.x - drag.grab.x, y: event.at.y - drag.grab.y };
			const candidate = nearestSlot(state, drag.part, pieceAt);
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
					from: pieceAt,
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
			if (state.phase === 'driving' && elapsed >= t.driveMs) {
				return { ...state, phase: 'working', phaseStartedAt: state.phaseStartedAt + t.driveMs };
			}
			if (state.phase === 'arriving' && elapsed >= t.arriveMs) {
				return { ...state, phase: 'assembling', phaseStartedAt: event.now };
			}
			return state;
		}

		case 'arrive': {
			const vehicle = getVehicle(event.vehicleId);
			const gameScale = event.gameScale ?? state.gameScale;
			const origin = event.origin ?? state.origin;
			return {
				...state,
				phase: 'arriving',
				vehicleId: vehicle.id,
				placed: [],
				drag: null,
				settle: null,
				anchors: anchorsFor(vehicle, gameScale, origin),
				gameScale,
				origin,
				snapRadius: event.snapRadius ?? state.snapRadius,
				phaseStartedAt: event.now,
				arrivedAt: event.now
			};
		}
	}
}
