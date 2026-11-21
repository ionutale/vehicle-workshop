import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createAssembly } from '#lib/game/assembly';
import { computeLayout, worldToScreen } from '#lib/game/layout';
import { PARTS } from '#lib/game/parts';
import { hitPiece } from '#lib/game/pointer';
import { getVehicle } from '#lib/game/vehicles';
import { drawShelf, pieceBoxes, trayPieces } from '#lib/render/tray';

const stubPath = () =>
	vi.stubGlobal(
		'Path2D',
		class {
			constructor(public d: string) {}
		}
	);

function recordingContext() {
	const calls: Array<{ name: string; args: number[]; alpha: number; lineWidth: number }> = [];
	const ctx = {
		save: () => {},
		restore: () => {},
		beginPath: () => {},
		clip: () => {},
		fillRect: () => {},
		fill: () => {},
		stroke: () => {},
		globalAlpha: 1,
		lineWidth: 1,
		fillStyle: '',
		strokeStyle: '',
		translate: () => {},
		scale: () => {},
		moveTo: () => {},
		lineTo: () => {},
		quadraticCurveTo: () => {},
		closePath: () => {},
		arc: (...args: number[]) =>
			calls.push({ name: 'arc', args, alpha: ctx.globalAlpha, lineWidth: ctx.lineWidth }),
		ellipse: (...args: number[]) =>
			calls.push({ name: 'ellipse', args, alpha: ctx.globalAlpha, lineWidth: ctx.lineWidth })
	};
	return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

beforeEach(stubPath);

const car = getVehicle('taxi');
const insets = { top: 0, right: 0, bottom: 0, left: 0 };

describe('shelf affordances', () => {
	it('hugs a wide piece with the hint ellipse instead of drawing a huge circle', () => {
		const layout = computeLayout({ width: 390, height: 844 }, car, pieceBoxes(car), insets, 120);
		const state = createAssembly(car, layout.gameScale, layout.snapRadius, 0);
		const pieces = trayPieces(car, state, layout);
		const body = pieces.find((piece) => piece.part === 'body')!;
		const { ctx, calls } = recordingContext();

		drawShelf(ctx, layout, pieces, PARTS, car.palette, { hintSlotId: body.slotId, now: 0 });

		const hint = calls.find((call) => call.name === 'ellipse');
		expect(hint).toBeDefined();
		const [, , rx, ry] = hint!.args;
		expect(rx).toBeCloseTo(body.rect.w / 2 + 10, 0);
		expect(ry).toBeCloseTo(body.rect.h / 2 + 10, 0);
	});

	it('stops pulsing the hint when reduced motion is on', () => {
		const layout = computeLayout({ width: 390, height: 844 }, car, pieceBoxes(car), insets, 120);
		const state = createAssembly(car, layout.gameScale, layout.snapRadius, 0);
		const pieces = trayPieces(car, state, layout);
		const body = pieces.find((piece) => piece.part === 'body')!;

		const first = recordingContext();
		drawShelf(first.ctx, layout, pieces, PARTS, car.palette, {
			hintSlotId: body.slotId,
			now: 0,
			reduced: true
		});
		const second = recordingContext();
		drawShelf(second.ctx, layout, pieces, PARTS, car.palette, {
			hintSlotId: body.slotId,
			now: 700,
			reduced: true
		});

		const alphaAt = (call: { alpha: number }) => call.alpha;
		expect(alphaAt(first.calls.find((c) => c.name === 'ellipse')!)).toBe(
			alphaAt(second.calls.find((c) => c.name === 'ellipse')!)
		);
	});

	it('keeps the mute button at least 44 CSS pixels in landscape', () => {
		const vp = { width: 844, height: 390 };
		const layout = computeLayout(vp, car, pieceBoxes(car), insets, 120);
		const topLeft = worldToScreen(layout, vp, { x: layout.muteButton.x, y: layout.muteButton.y });
		const bottomRight = worldToScreen(layout, vp, {
			x: layout.muteButton.x + layout.muteButton.w,
			y: layout.muteButton.y + layout.muteButton.h
		});
		expect(bottomRight.x - topLeft.x).toBeGreaterThanOrEqual(44);
		expect(bottomRight.y - topLeft.y).toBeGreaterThanOrEqual(44);
	});

	it('pads a tiny piece to a reachable target', () => {
		const piece = {
			slotId: 'light',
			part: 'light' as const,
			rect: { x: 100, y: 100, w: 10, h: 10 }
		};
		const pieces = [piece];
		const target = 44;
		expect(hitPiece(pieces, { x: 90, y: 100 }, target)?.slotId).toBe('light');
		expect(hitPiece(pieces, { x: 60, y: 100 }, target)).toBeNull();
	});
});
