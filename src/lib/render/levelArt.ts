/**
 * Level-aware art registry for the conversion prototype.
 *
 * A converted vehicle exports `drawReal<Name>Level(ctx, x, y, scale, level)` from its
 * `real<Name>.ts` module. Register it here once; the generic prototype route renders it
 * with no per-vehicle page.
 */

import { drawRealAmbulanceLevel } from './realAmbulance';
import { drawRealArticulatedHaulerLevel } from './realArticulatedHauler';
import { drawRealArmouredVanLevel } from './realArmouredVan';
import { drawRealBackhoeLoaderLevel } from './realBackhoeLoader';
import { drawRealBulldozerLevel } from './realBulldozer';
import { drawRealCarTransporterLevel } from './realCarTransporter';
import { drawRealCementMixerLevel } from './realCementMixer';
import { drawRealCropSprayerLevel } from './realCropSprayer';
import { drawRealCombineHarvesterLevel } from './realCombineHarvester';
import { drawRealCraneTruckLevel } from './realCraneTruck';
import { drawRealCurtainSideLorryLevel } from './realCurtainSideLorry';
import { drawRealCamperLevel } from './realCamper';
import { drawRealDeliveryVanLevel } from './realDeliveryVan';
import { drawRealDumpTruckLevel } from './realDumpTruck';
import { drawRealFlatbedLorryLevel } from './realFlatbedLorry';
import { drawRealFoodTruckLevel } from './realFoodTruck';
import { drawRealForkliftLevel } from './realForklift';
import { drawRealFuelTankerLevel } from './realFuelTanker';
import { drawRealGarbageTruckLevel } from './realGarbageTruck';
import { drawRealHayBalerLevel } from './realHayBaler';
import { drawRealIceCreamVanLevel } from './realIceCreamVan';
import { drawRealLightRailTrainLevel } from './realLightRailTrain';
import { drawRealMetroTrainLevel } from './realMetroTrain';
import { drawRealLivestockTruckLevel } from './realLivestockTruck';
import { drawRealLogTruckLevel } from './realLogTruck';
import { drawRealLimousineLevel } from './realLimousine';
import { drawRealMiniDumperLevel } from './realMiniDumper';
import { drawRealMonsterTruckLevel } from './realMonsterTruck';
import { drawRealMotorGraderLevel } from './realMotorGrader';
import { drawRealMailVanLevel } from './realMailVan';
import { drawRealPickupLevel } from './realPickup';
import { drawRealPoliceCarLevel } from './realPoliceCar';
import { drawRealPoliceVanLevel } from './realPoliceVan';
import { drawRealQuadBikeLevel } from './realQuadBike';
import { drawRealRaceCarLevel } from './realRaceCar';
import { drawRealRemovalsVanLevel } from './realRemovalsVan';
import { drawRealMilkTankerLevel } from './realMilkTanker';
import { drawRealParcelLorryLevel } from './realParcelLorry';
import { drawRealRefrigeratedTruckLevel } from './realRefrigeratedTruck';
import { drawRealRoadRollerLevel } from './realRoadRoller';
import { drawRealSkidSteerLevel } from './realSkidSteer';
import { drawRealSnowPloughLevel } from './realSnowPlough';
import { drawRealSteamRollerLevel } from './realSteamRoller';
import { drawRealStreetSweeperLevel } from './realStreetSweeper';
import { drawRealTaxiLevel } from './realTaxi';
import { drawRealTelehandlerLevel } from './realTelehandler';
import { drawRealTractorLevel } from './realTractor';
import { drawRealWheelLoaderLevel } from './realWheelLoader';
import { drawRealTowTruckLevel } from './realTowTruck';
import { drawRealWaterTankerLevel } from './realWaterTanker';
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
	'flatbed-lorry': { draw: drawRealFlatbedLorryLevel, width: 780, height: 340 },
	'cement-mixer': { draw: drawRealCementMixerLevel, width: 740, height: 380 },
	'crane-truck': { draw: drawRealCraneTruckLevel, width: 820, height: 300 },
	'tow-truck': { draw: drawRealTowTruckLevel, width: 780, height: 390 },
	'garbage-truck': { draw: drawRealGarbageTruckLevel, width: 760, height: 330 },
	'car-transporter': { draw: drawRealCarTransporterLevel, width: 860, height: 340 },
	'refrigerated-truck': { draw: drawRealRefrigeratedTruckLevel, width: 780, height: 340 },
	'curtain-side-lorry': { draw: drawRealCurtainSideLorryLevel, width: 800, height: 360 },
	'parcel-lorry': { draw: drawRealParcelLorryLevel, width: 780, height: 360 },
	'log-truck': { draw: drawRealLogTruckLevel, width: 800, height: 380 },
	'livestock-truck': { draw: drawRealLivestockTruckLevel, width: 800, height: 300 },
	'water-tanker': { draw: drawRealWaterTankerLevel, width: 780, height: 340 },
	'fuel-tanker': { draw: drawRealFuelTankerLevel, width: 900, height: 360 },
	'ice-cream-van': { draw: drawRealIceCreamVanLevel, width: 700, height: 330 },
	'mail-van': { draw: drawRealMailVanLevel, width: 700, height: 330 },
	camper: { draw: drawRealCamperLevel, width: 720, height: 340 },
	'delivery-van': { draw: drawRealDeliveryVanLevel, width: 720, height: 330 },
	'armoured-van': { draw: drawRealArmouredVanLevel, width: 720, height: 340 },
	ambulance: { draw: drawRealAmbulanceLevel, width: 720, height: 340 },
	'removals-van': { draw: drawRealRemovalsVanLevel, width: 780, height: 360 },
	'police-van': { draw: drawRealPoliceVanLevel, width: 720, height: 340 },
	pickup: { draw: drawRealPickupLevel, width: 700, height: 330 },
	'police-car': { draw: drawRealPoliceCarLevel, width: 660, height: 300 },
	taxi: { draw: drawRealTaxiLevel, width: 660, height: 300 },
	limousine: { draw: drawRealLimousineLevel, width: 820, height: 300 },
	'race-car': { draw: drawRealRaceCarLevel, width: 680, height: 280 },
	tractor: { draw: drawRealTractorLevel, width: 640, height: 330 },
	bulldozer: { draw: drawRealBulldozerLevel, width: 720, height: 340 },
	forklift: { draw: drawRealForkliftLevel, width: 640, height: 340 },
	'road-roller': { draw: drawRealRoadRollerLevel, width: 680, height: 340 },
	'telehandler': { draw: drawRealTelehandlerLevel, width: 760, height: 310 },
	'snow-plough': { draw: drawRealSnowPloughLevel, width: 780, height: 350 },
	'street-sweeper': { draw: drawRealStreetSweeperLevel, width: 760, height: 350 },
	'monster-truck': { draw: drawRealMonsterTruckLevel, width: 720, height: 320 },
	'food-truck': { draw: drawRealFoodTruckLevel, width: 720, height: 350 },
	'combine-harvester': { draw: drawRealCombineHarvesterLevel, width: 900, height: 315 },
	'skid-steer': { draw: drawRealSkidSteerLevel, width: 620, height: 300 },
	'backhoe-loader': { draw: drawRealBackhoeLoaderLevel, width: 760, height: 310 },
	'wheel-loader': { draw: drawRealWheelLoaderLevel, width: 760, height: 310 },
	'motor-grader': { draw: drawRealMotorGraderLevel, width: 820, height: 300 },
	'articulated-hauler': { draw: drawRealArticulatedHaulerLevel, width: 780, height: 310 },
	'crop-sprayer': { draw: drawRealCropSprayerLevel, width: 800, height: 306 },
	'hay-baler': { draw: drawRealHayBalerLevel, width: 720, height: 300 },
	'steam-roller': { draw: drawRealSteamRollerLevel, width: 700, height: 310 },
	'quad-bike': { draw: drawRealQuadBikeLevel, width: 560, height: 300 },
	'mini-dumper': { draw: drawRealMiniDumperLevel, width: 620, height: 300 }
};

export const LEVEL_IDS = Object.keys(LEVEL_ART);
