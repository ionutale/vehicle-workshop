import { createAssembly } from '../game/assembly';
import type { JobKind } from '../game/families';
import type { Layout } from '../game/layout';
import type { Vehicle } from '../game/vehicles';
import { OUTLINE } from './scene';
import { drawVehicle } from './vehicle';

/**
 * The job beat between the drive-off and the next vehicle. A small vignette: the vehicle
 * pulls up on the left, a prop waits on the right, and a family-specific action connects
 * the two. All values are world units, so it fits every orientation.
 */

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function rectangle(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	fill: string
): void {
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.fillStyle = fill;
	ctx.fill();
	ctx.strokeStyle = OUTLINE;
	ctx.lineWidth = 2;
	ctx.stroke();
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill: string): void {
	ctx.fillStyle = fill;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = OUTLINE;
	ctx.lineWidth = 1.5;
	ctx.stroke();
}

export function drawJob(
	ctx: CanvasRenderingContext2D,
	vehicle: Vehicle,
	job: JobKind,
	layout: Layout,
	t: number,
	reduced: boolean
): void {
	const progress = clamp01(t);
	const fade =
		progress < 0.12 ? progress / 0.12 : progress > 0.88 ? (1 - progress) / 0.12 : 1;
	const scale = Math.min(
		layout.gameScale,
		(layout.worldWidth * 0.46) / Math.max(vehicle.width, 1),
		(layout.roadY - 120) / Math.max(vehicle.height, 1)
	);
	const centreX = layout.worldWidth * 0.27;
	const origin = {
		x: centreX - (vehicle.width * scale) / 2,
		y: layout.roadY + 10 - vehicle.groundY * scale
	};
	const state = createAssembly(vehicle, scale, 0, 0, 1, origin);
	const placed = { ...state, placed: vehicle.slots.map((slot) => slot.id) };
	const jobLayout: Layout = {
		...layout,
		gameScale: scale,
		vehicleAnchor: { x: centreX, y: layout.roadY },
		outline: Math.max(1.6, layout.outline)
	};
	const size = Math.max(10, vehicle.height * scale * 0.22);
	const propX = layout.worldWidth * 0.78;
	const ground = layout.roadY + 12;
	const right = centreX + (vehicle.width * scale) / 2;
	const top = origin.y;

	ctx.save();
	ctx.globalAlpha = 0.14 * fade;
	ctx.fillStyle = OUTLINE;
	ctx.beginPath();
	ctx.ellipse(centreX, ground, (vehicle.width * scale) / 2 + size, size * 0.3, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalAlpha = fade;

	drawProp(ctx, job, progress, reduced, {
		vehicle,
		propX,
		ground,
		size,
		right,
		top
	});

	ctx.globalAlpha = 1;
	drawVehicle(ctx, vehicle, placed, jobLayout, 0, 1, 0, fade);
	ctx.restore();
}

interface Stage {
	vehicle: Vehicle;
	propX: number;
	ground: number;
	size: number;
	right: number;
	top: number;
}

function drawProp(
	ctx: CanvasRenderingContext2D,
	job: JobKind,
	progress: number,
	reduced: boolean,
	stage: Stage
): void {
	const { vehicle, propX, ground, size, right, top } = stage;
	const accent = vehicle.palette.trim;

	switch (job) {
		case 'deliver': {
			const move = reduced ? 1 : ease(clamp01((progress - 0.12) / 0.55));
			const x = lerp(propX - size * 0.5, right - size * 0.6, move);
			const y = lerp(ground - size, top + size * 0.8, move);
			rectangle(ctx, x, y, size, size, '#C08552');
			ctx.strokeStyle = '#8A5A34';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + size, y + size);
			ctx.moveTo(x + size, y);
			ctx.lineTo(x, y + size);
			ctx.stroke();
			break;
		}

		case 'dig': {
			const grow = reduced ? 1 : clamp01(progress * 2.4);
			ctx.fillStyle = '#8A5A34';
			ctx.beginPath();
			ctx.ellipse(propX, ground, size * 1.1 * grow, size * 0.5 * grow, 0, 0, Math.PI * 2);
			ctx.fill();
			if (!reduced) {
				for (let i = 0; i < 4; i++) {
					const q = clamp01((progress - i * 0.08) / 0.55);
					if (q <= 0 || q >= 1) continue;
					dot(
						ctx,
						lerp(propX, right + size * 0.4, q),
						ground - size * 0.4 - Math.sin(Math.PI * q) * size * 1.7,
						size * 0.12,
						'#8A5A34'
					);
				}
			}
			break;
		}

		case 'spray': {
			const flame = size * (1.5 - progress * 1.15);
			ctx.fillStyle = '#F2792B';
			ctx.beginPath();
			ctx.moveTo(propX, ground - flame);
			ctx.quadraticCurveTo(propX + size * 0.55, ground - flame * 0.35, propX, ground);
			ctx.quadraticCurveTo(propX - size * 0.55, ground - flame * 0.35, propX, ground - flame);
			ctx.fill();
			ctx.fillStyle = '#FFE066';
			ctx.beginPath();
			ctx.ellipse(propX, ground - flame * 0.28, size * 0.2, flame * 0.22, 0, 0, Math.PI * 2);
			ctx.fill();
			if (!reduced) {
				for (let i = 0; i < 6; i++) {
					const q = clamp01(progress * 1.5 - i * 0.07);
					if (q <= 0 || q >= 1) continue;
					dot(
						ctx,
						lerp(right, propX - size * 0.2, q),
						lerp(top + size * 1.3, ground - flame * 0.5, q) - Math.sin(Math.PI * q) * size * 1.1,
						size * 0.12,
						'#6FC3F7'
					);
				}
			}
			break;
		}

		case 'siren': {
			const rings = reduced ? 1 : 3;
			for (let i = 0; i < rings; i++) {
				const q = reduced ? 0.45 : (progress * 2 + i / 3) % 1;
				ctx.globalAlpha = 0.75 * (1 - q);
				ctx.strokeStyle = i % 2 === 0 ? '#E63946' : '#2C5AA0';
				ctx.lineWidth = 4;
				ctx.beginPath();
				ctx.arc(propX, ground - size, size * (0.5 + q * 1.7), 0, Math.PI * 2);
				ctx.stroke();
			}
			ctx.globalAlpha = 1;
			break;
		}

		case 'passengers':
		case 'platform': {
			if (job === 'passengers') {
				rectangle(ctx, propX - 2, ground - size * 2, 4, size * 2, '#6B6B6B');
				rectangle(ctx, propX - size * 0.6, ground - size * 2.7, size * 1.2, size * 0.75, accent);
			} else {
				rectangle(ctx, propX - size * 1.2, ground - size * 0.35, size * 2.4, size * 0.35, '#B9A58A');
			}
			for (let i = 0; i < 3; i++) {
				const q = reduced ? 1 : clamp01((progress - i * 0.1) / 0.5);
				dot(
					ctx,
					lerp(propX, right - size * 0.35, q),
					ground - size * 0.35 - (reduced ? 0 : Math.sin(Math.PI * q) * size * 1.1),
					size * 0.17,
					accent
				);
			}
			break;
		}

		case 'harvest': {
			if (!reduced) {
				const stalks = 1 - clamp01((progress - 0.2) / 0.55);
				ctx.globalAlpha = stalks;
				for (let i = 0; i < 3; i++) {
					const x = propX + (i - 1) * size * 0.65;
					ctx.strokeStyle = '#D9A441';
					ctx.lineWidth = 3;
					ctx.beginPath();
					ctx.moveTo(x, ground);
					ctx.lineTo(x, ground - size * 1.7);
					ctx.stroke();
					for (let grain = 0; grain < 3; grain++) {
						dot(ctx, x, ground - size * (1.1 + grain * 0.3), size * 0.14, '#F4C95D');
					}
				}
				ctx.globalAlpha = 1;
			}
			const roll = reduced ? 1 : clamp01((progress - 0.45) / 0.45);
			if (roll > 0) {
				const x = lerp(propX, right + size * 0.3, ease(roll));
				dot(ctx, x, ground - size * 0.55, size * 0.55, '#E9C46A');
				ctx.strokeStyle = '#B98B3A';
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.arc(x, ground - size * 0.55, size * 0.3, roll * 6, roll * 6 + Math.PI * 1.6);
				ctx.stroke();
			}
			break;
		}

		case 'beep':
		default: {
			for (let i = 0; i < 3; i++) {
				ctx.strokeStyle = '#FFB703';
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.arc(
					right + size * 0.15,
					top + size * 1.1,
					size * (0.45 + i * 0.32),
					-0.6,
					0.6
				);
				ctx.stroke();
			}
			if (!reduced) {
				for (let i = 0; i < 2; i++) {
					const q = clamp01(progress * 1.3 - i * 0.15);
					dot(
						ctx,
						right - vehicle.width * 0.5 * 0.3 - q * size * 0.7,
						ground - size * (0.3 + i * 0.25) - q * size,
						size * (0.12 + i * 0.04),
						'#D9D9D9'
					);
				}
			}
			break;
		}
	}
}
