/**
 * Level-aware art registry for the conversion prototype.
 *
 * A converted vehicle exports `drawReal<Name>Level(ctx, x, y, scale, level)` from its
 * `real<Name>.ts` module. Register it here once; the generic prototype route renders it
 * with no per-vehicle page.
 */

import { drawRealDumpTruckLevel } from './realDumpTruck';
import { drawRealFlatbedLorryLevel } from './realFlatbedLorry';
import { drawRealLightRailTrainLevel } from './realLightRailTrain';
import { drawRealMetroTrainLevel } from './realMetroTrain';
import { drawRealMilkTankerLevel } from './realMilkTanker';
import { drawRealTramLevel } from './realTram';

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
	'tram': { draw: drawRealTramLevel, width: 820, height: 380 },
	'metro-train': { draw: drawRealMetroTrainLevel, width: 900, height: 380 },
	'light-rail-train': { draw: drawRealLightRailTrainLevel, width: 900, height: 380 },
	'milk-tanker': { draw: drawRealMilkTankerLevel, width: 760, height: 340 },
	'dump-truck': { draw: drawRealDumpTruckLevel, width: 760, height: 370 },
	'flatbed-lorry': { draw: drawRealFlatbedLorryLevel, width: 780, height: 340 }
};

export const LEVEL_IDS = Object.keys(LEVEL_ART);
