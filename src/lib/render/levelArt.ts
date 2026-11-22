/**
 * Level-aware art registry for the conversion prototype.
 *
 * A converted vehicle exports `drawReal<Name>Level(ctx, x, y, scale, level)` from its
 * `real<Name>.ts` module. Register it here once; the generic prototype route renders it
 * with no per-vehicle page.
 */

export type LevelDraw = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	scale: number,
	level: number
) => void;

export interface LevelArtSpec {
	width: number;
	height: number;
	draw: LevelDraw;
}

export const LEVEL_ART: Record<string, LevelArtSpec> = {
	// one line per converted vehicle, e.g.
	// tram: { draw: drawRealTramLevel, width: 820, height: 380 },
};

export const LEVEL_IDS = Object.keys(LEVEL_ART);
