import type { Layout } from '../game/layout';
import type { MotionFrame } from './motion';
import { roundedRect } from './draw';

/**
 * The backdrop: flat paper cut-out, repeating every world width so the drive-off can
 * scroll it. The far layer is static per resize and can be pre-rendered; the road is drawn
 * each frame because it is three rects and a dozen dashes.
 */

export const SKY = '#BFEAFF';
export const SUN = '#FFE066';
export const HILL_FAR = '#A8E6A1';
export const HILL_NEAR = '#8AD88A';
export const ROAD = '#77808F';
export const ROAD_LIP = '#5C6472';
export const ROAD_LINE = '#F3F6FA';
export const OUTLINE = '#3A271B';
export const CLOUD = '#FFFFFF';

export const SCENES = ['countryside', 'town', 'harbour'] as const;
export type SceneId = (typeof SCENES)[number];

/** The backdrop changes every finished build, in a fixed order, never at random. */
export function sceneForBuild(builds: number): SceneId {
	const index = ((Math.floor(builds) % SCENES.length) + SCENES.length) % SCENES.length;
	return SCENES[index];
}

export function drawScene(
	ctx: CanvasRenderingContext2D,
	layout: Layout,
	scrollX = 0,
	roadScroll = 0,
	scene: SceneId = 'countryside',
	frame?: MotionFrame
): void {
	drawFarLayer(ctx, layout, scrollX, scene, frame);
	drawRoad(ctx, layout, roadScroll);
}

/** Everything above the road: sky, sun, clouds and the selected backdrop. */
export function drawFarLayer(
	ctx: CanvasRenderingContext2D,
	layout: Layout,
	scrollX = 0,
	scene: SceneId = 'countryside',
	frame?: MotionFrame
): void {
	const { worldWidth: w, worldHeight: h, roadY } = layout;

	ctx.fillStyle = SKY;
	ctx.fillRect(0, 0, w, h);

	const shift = (distance: number) => ((scrollX * distance) % w + w) % w;

	// Sun sits high and drifts slowest.
	const sunX = w * 0.62 - shift(0.08);
	ctx.fillStyle = SUN;
	ctx.beginPath();
	ctx.arc(sunX, h * 0.13, 46, 0, Math.PI * 2);
	ctx.fill();
	if (frame && frame.sunAlpha > 0) {
		ctx.fillStyle = `rgba(255, 248, 210, ${frame.sunAlpha.toFixed(3)})`;
		ctx.beginPath();
		ctx.arc(sunX, h * 0.13, 56, 0, Math.PI * 2);
		ctx.fill();
	}

	// Two cloud layers; the far one drifts at a third of the near speed.
	ctx.fillStyle = CLOUD;
	for (let copy = -1; copy <= 1; copy++) {
		for (let i = 0; i < 3; i++) {
			const drift = frame ? ((i % 2 === 0 ? frame.cloudFar : frame.cloudNear) % w) : 0;
			const cx = w * (0.18 + i * 0.3) + copy * w - shift(0.16) - drift;
			const cy = h * (0.1 + (i % 2) * 0.05);
			ctx.beginPath();
			ctx.ellipse(cx, cy, 42, 15, 0, 0, Math.PI * 2);
			ctx.ellipse(cx + 26, cy + 4, 28, 12, 0, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	if (frame) {
		ctx.fillStyle = 'rgba(58, 39, 27, 0.55)';
		for (const bird of frame.birds) {
			ctx.beginPath();
			ctx.arc(bird.x - 5, bird.y - bird.flap * 3, 5, Math.PI * 1.1, Math.PI * 1.9);
			ctx.arc(bird.x + 5, bird.y - bird.flap * 3, 5, Math.PI * 1.1, Math.PI * 1.9);
			ctx.fill();
		}
	}

	if (frame) {
		for (const mote of frame.motes) {
			ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, mote.alpha).toFixed(3)})`;
			ctx.beginPath();
			ctx.arc(mote.x, mote.y, 1.8, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	if (scene === 'countryside') {
		drawHills(ctx, w, roadY, shift);
	} else if (scene === 'town') {
		drawTown(ctx, w, roadY, shift);
	} else {
		drawHarbour(ctx, w, roadY, shift);
	}
}

function drawHills(
	ctx: CanvasRenderingContext2D,
	w: number,
	roadY: number,
	shift: (distance: number) => number
): void {
	ctx.fillStyle = HILL_FAR;
	for (let copy = -1; copy <= 1; copy++) {
		const base = copy * w - shift(0.2);
		ctx.beginPath();
		ctx.moveTo(base, roadY);
		ctx.quadraticCurveTo(base + w * 0.2, roadY - 150, base + w * 0.45, roadY - 40);
		ctx.quadraticCurveTo(base + w * 0.7, roadY - 160, base + w, roadY - 60);
		ctx.lineTo(base + w, roadY);
		ctx.closePath();
		ctx.fill();
	}

	ctx.fillStyle = HILL_NEAR;
	for (let copy = -1; copy <= 1; copy++) {
		const base = copy * w - shift(0.32);
		ctx.beginPath();
		ctx.moveTo(base, roadY);
		ctx.quadraticCurveTo(base + w * 0.25, roadY - 90, base + w * 0.5, roadY - 20);
		ctx.quadraticCurveTo(base + w * 0.78, roadY - 100, base + w, roadY - 30);
		ctx.lineTo(base + w, roadY);
		ctx.closePath();
		ctx.fill();
	}
}

const TOWN_WALLS = ['#E8C7A8', '#D9A07A', '#C98B7A', '#B7C9D6'];

function drawTown(
	ctx: CanvasRenderingContext2D,
	w: number,
	roadY: number,
	shift: (distance: number) => number
): void {
	for (let copy = -1; copy <= 1; copy++) {
		const base = copy * w - shift(0.22);
		for (let i = 0; i < 6; i++) {
			const width = w * (0.075 + ((i * 7) % 4) * 0.008);
			const height = 90 + ((i * 53) % 80);
			const x = base + i * w * 0.17;
			const y = roadY - height;

			ctx.fillStyle = TOWN_WALLS[i % TOWN_WALLS.length];
			ctx.fillRect(x, y, width, height);
			ctx.fillStyle = 'rgba(58, 39, 27, 0.18)';
			ctx.fillRect(x, y, width, 7);

			ctx.fillStyle = '#FFF4D6';
			for (let row = 0; row < 4; row++) {
				for (let col = 0; col < 3; col++) {
					const windowY = y + 18 + row * 22;
					if (windowY > roadY - 12) continue;
					ctx.fillRect(x + width * (0.14 + col * 0.28), windowY, width * 0.16, 10);
				}
			}
		}
	}
}

function drawHarbour(
	ctx: CanvasRenderingContext2D,
	w: number,
	roadY: number,
	shift: (distance: number) => number
): void {
	const seaTop = roadY - 84;

	ctx.fillStyle = HILL_FAR;
	ctx.beginPath();
	ctx.moveTo(0, seaTop + 14);
	for (let x = 0; x <= w; x += w / 4) {
		ctx.quadraticCurveTo(x + w / 8, seaTop - 16, x + w / 4, seaTop + 10);
	}
	ctx.lineTo(w, seaTop + 24);
	ctx.lineTo(0, seaTop + 24);
	ctx.closePath();
	ctx.fill();

	ctx.fillStyle = '#7FC8E8';
	ctx.fillRect(0, seaTop + 12, w, roadY - seaTop - 12);

	ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
	ctx.lineWidth = 3;
	for (let copy = -1; copy <= 1; copy++) {
		const base = copy * w - shift(0.18);
		for (let i = 0; i < 4; i++) {
			const x = base + w * (0.12 + i * 0.22);
			const y = seaTop + 34 + (i % 2) * 18;
			ctx.beginPath();
			ctx.arc(x, y, 18, Math.PI * 0.1, Math.PI * 0.9);
			ctx.stroke();
		}
	}

	for (let copy = -1; copy <= 1; copy++) {
		const base = copy * w - shift(0.18);
		for (const [bx, by] of [
			[base + w * 0.3, seaTop + 26],
			[base + w * 0.7, seaTop + 44]
		]) {
			ctx.fillStyle = '#FFF9EC';
			ctx.beginPath();
			ctx.moveTo(bx - 28, by);
			ctx.quadraticCurveTo(bx, by + 16, bx + 28, by);
			ctx.lineTo(bx + 22, by + 10);
			ctx.lineTo(bx - 22, by + 10);
			ctx.closePath();
			ctx.fill();
			ctx.strokeStyle = OUTLINE;
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(bx, by);
			ctx.lineTo(bx, by - 32);
			ctx.stroke();
			ctx.fillStyle = '#FFD166';
			ctx.beginPath();
			ctx.moveTo(bx + 2, by - 30);
			ctx.lineTo(bx + 24, by - 14);
			ctx.lineTo(bx + 2, by - 12);
			ctx.closePath();
			ctx.fill();
		}
	}

	ctx.fillStyle = '#FFF9EC';
	ctx.fillRect(w * 0.08, seaTop - 52, 18, 64);
	ctx.fillStyle = '#E63946';
	ctx.fillRect(w * 0.08, seaTop - 46, 18, 12);
	ctx.fillRect(w * 0.08, seaTop - 22, 18, 12);
	ctx.fillStyle = '#FFD166';
	ctx.beginPath();
	ctx.arc(w * 0.08 + 9, seaTop - 58, 7, 0, Math.PI * 2);
	ctx.fill();
}

export function drawRoad(ctx: CanvasRenderingContext2D, layout: Layout, scrollX = 0): void {
	const { worldWidth: w, worldHeight: h, roadY } = layout;
	const lip = 8;

	ctx.fillStyle = ROAD_LIP;
	ctx.fillRect(0, roadY, w, h - roadY);
	ctx.fillStyle = ROAD;
	ctx.fillRect(0, roadY + lip, w, h - roadY - lip);

	// Centre line: fixed-length dashes, shifted by the scroll distance.
	const dash = 44;
	const gap = 40;
	const y = roadY + (h - roadY) * 0.55;
	const offset = (scrollX % (dash + gap) + (dash + gap)) % (dash + gap);
	ctx.fillStyle = ROAD_LINE;
	for (let x = -offset; x < w + dash; x += dash + gap) {
		roundedRect(ctx, x, y - 3, dash, 6, 3);
		ctx.fill();
	}
}
