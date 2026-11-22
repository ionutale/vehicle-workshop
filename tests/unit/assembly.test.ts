import { describe, expect, it } from 'vitest';
import {
	createAssembly,
	nearestSlot,
	reduce,
	timeline,
	unfilledSlots
} from '#lib/game/assembly';
import { getVehicle } from '#lib/game/vehicles';
import { vehicleAtLevel } from '#lib/game/difficulty';

const car = getVehicle('taxi');
const base = () => createAssembly(car, 0.8, 60, 0);

describe('assembly reducer', () => {
	it('starts with every slot unfilled and the car in the shelf', () => {
		expect(base().placed).toEqual([]);
		expect(unfilledSlots(base())).toHaveLength(car.slots.length);
	});

	it('snaps to the nearest empty slot of the same part', () => {
		const state = base();
		const wheel = state.anchors.find((a) => (a.part === 'wheel' || a.part.endsWith('Wheel')))!;
		const nearOther = { x: wheel.x + 30, y: wheel.y };
		const picked = reduce(state, { type: 'pick', slotId: wheel.slotId, at: nearOther, now: 10 });
		const dropped = reduce(picked, { type: 'drop', at: nearOther, now: 20, shelfCenters: {} });
		expect(dropped.placed).toHaveLength(1);
		expect(dropped.drag).toBeNull();
		expect(dropped.settle?.duration).toBe(150);
	});

	it('snaps by the piece anchor, not the finger, when a wide part is grabbed near its end', () => {
		const state = base();
		const body = state.anchors.find((a) => (a.part === 'body' || a.part === 'bodyBox' || a.part.endsWith('Body')))!;
		const shelf = { x: body.x - 300, y: body.y };
		// Grabbed 100 units right of the piece's centre.
		const picked = reduce(state, {
			type: 'pick',
			slotId: 'body',
			at: { x: shelf.x + 100, y: shelf.y },
			now: 1,
			origin: shelf
		});
		// The finger is 100 units right of the slot, but the piece itself is centred on it.
		const dropped = reduce(picked, {
			type: 'drop',
			at: { x: body.x + 100, y: body.y },
			now: 2,
			shelfCenters: {}
		});
		expect(dropped.placed).toEqual(['body']);
	});

	it('returns the piece to the shelf when the drop misses', () => {
		const state = base();
		const picked = reduce(state, { type: 'pick', slotId: 'body', at: { x: 10, y: 10 }, now: 10 });
		const dropped = reduce(picked, {
			type: 'drop',
			at: { x: 10, y: 10 },
			now: 20,
			shelfCenters: { body: { x: 200, y: 80 } }
		});
		expect(dropped.placed).toEqual([]);
		expect(dropped.settle).toMatchObject({ slotId: 'body', to: { x: 200, y: 80 }, duration: 220 });
	});

	it('ignores a second pick while a piece is held', () => {
		const state = base();
		const first = reduce(state, { type: 'pick', slotId: 'body', at: { x: 0, y: 0 }, now: 10 });
		const second = reduce(first, { type: 'pick', slotId: 'wheel-l', at: { x: 50, y: 50 }, now: 15 });
		expect(second.drag?.slotId).toBe('body');
		expect(second.placed).toEqual([]);
	});

	it('never fills a slot twice', () => {
		const state = base();
		const anchor = state.anchors[0];
		const once = reduce(
			reduce(state, { type: 'pick', slotId: state.anchors[0].slotId, at: anchor, now: 1 }),
			{ type: 'drop', at: anchor, now: 2, shelfCenters: {} }
		);
		expect(once.placed).toEqual([anchor.slotId]);
	});

	it('becomes ready exactly once when the last piece lands', () => {
		const state = createAssembly(car, 0.8, 9999, 0);
		let s = state;
		for (const anchor of state.anchors) {
			s = reduce(s, { type: 'pick', slotId: anchor.slotId, at: anchor, now: 1 });
			s = reduce(s, { type: 'drop', at: anchor, now: 2, shelfCenters: {} });
		}
		expect(s.phase).toBe('ready');
		expect(s.placed).toHaveLength(car.slots.length);
		const again = reduce(s, { type: 'tick', now: 3 });
		expect(again.phase).toBe('ready');
	});

	it('drives after the ready beat, then arrives with a new vehicle', () => {
		const t = timeline(1);
		const placedAt = 2;
		let s = createAssembly(car, 0.8, 9999, 0);
		for (const a of s.anchors) {
			s = reduce(s, { type: 'pick', slotId: a.slotId, at: a, now: 1 });
			s = reduce(s, { type: 'drop', at: a, now: placedAt, shelfCenters: {} });
		}
		const driveAt = placedAt + t.readyMs + 1;
		s = reduce(s, { type: 'tick', now: driveAt });
		expect(s.phase).toBe('driving');
		s = reduce(s, { type: 'tick', now: driveAt + t.driveMs + 1 });
		expect(s.phase).toBe('working');
		const arriveAt = driveAt + t.driveMs + t.workMs + 1;
		s = reduce(s, { type: 'arrive', vehicleId: 'car', now: arriveAt });
		expect(s.phase).toBe('arriving');
		expect(s.arrivedAt).toBe(arriveAt);
		s = reduce(s, { type: 'tick', now: arriveAt + t.arriveMs + 10 });
		expect(s.phase).toBe('assembling');
		expect(s.placed).toEqual([]);
	});

	it('arrives with the trimmed level view it is handed, not the full catalogue entry', () => {
		const view = vehicleAtLevel(car, 0);
		const arrived = reduce(base(), {
			type: 'arrive',
			vehicleId: 'car',
			vehicle: view,
			now: 10,
			gameScale: 0.8,
			snapRadius: 60
		});
		expect(arrived.anchors.map((anchor) => anchor.slotId)).toEqual(
			view.slots.map((slot) => slot.id)
		);
		expect(arrived.anchors).toHaveLength(4);
	});

	it('compresses the timeline in test mode but keeps the order', () => {
		expect(timeline(0.2)).toEqual({ readyMs: 100, driveMs: 240, workMs: 600, arriveMs: 80 });
	});

	it('finds no candidate when the part has no empty slot left', () => {
		const state = base();
		const other = state.anchors.find((a) => (a.part === 'body' || a.part === 'bodyBox' || a.part.endsWith('Body')))!;
		const afterBody = { ...state, placed: [other.slotId] };
		expect(nearestSlot(afterBody, 'body', { x: other.x, y: other.y })).toBeNull();
	});
});
