import { vi } from 'vitest';

/** A CanvasRenderingContext2D that records every method call, for render tests. */
export function recorder(): { ctx: CanvasRenderingContext2D; calls: string[] } {
	const calls: string[] = [];
	const record = (name: string) => () => calls.push(name);
	const ctx = {
		save: record('save'),
		restore: record('restore'),
		translate: record('translate'),
		scale: record('scale'),
		rotate: record('rotate'),
		setTransform: record('setTransform'),
		clip: record('clip'),
		fill: record('fill'),
		stroke: record('stroke'),
		beginPath: record('beginPath'),
		closePath: record('closePath'),
		moveTo: record('moveTo'),
		lineTo: record('lineTo'),
		quadraticCurveTo: record('quadraticCurveTo'),
		bezierCurveTo: record('bezierCurveTo'),
		arc: record('arc'),
		arcTo: record('arcTo'),
		ellipse: record('ellipse'),
		rect: record('rect'),
		fillRect: record('fillRect'),
		strokeRect: record('strokeRect'),
		setLineDash: record('setLineDash'),
		globalAlpha: 1,
		lineWidth: 1,
		strokeStyle: '',
		fillStyle: ''
	};
	return { ctx: ctx as unknown as CanvasRenderingContext2D, calls };
}

/** jsdom has no Path2D; the renderer only needs construction to succeed. */
export function stubPath(): void {
	vi.stubGlobal(
		'Path2D',
		class {
			constructor(public d: string) {}
		}
	);
}
