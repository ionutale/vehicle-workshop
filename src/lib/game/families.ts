import type { Vehicle } from './vehicles';

/** The seven voices and job beats a vehicle can inherit from its id. */
export type VehicleFamily = 'car' | 'truck' | 'bus' | 'farm' | 'works' | 'emergency' | 'rail';

export type JobKind =
	| 'beep'
	| 'deliver'
	| 'passengers'
	| 'harvest'
	| 'dig'
	| 'spray'
	| 'siren'
	| 'platform';

const RULES: Array<[VehicleFamily, RegExp]> = [
	['rail', /train|tram|trolleybus|metro|light-rail/],
	['emergency', /fire|ambulance|police|rescue|hazmat|aerial-ladder/],
	['farm', /tractor|harvester|sprayer|baler|telehandler/],
	[
		'works',
		/digger|dozer|loader|crane|lift|picker|roller|paver|sweeper|planer|grader|hauler|dumper|dump|mixer|pump|blower|gritter|forklift|backhoe|skid-steer|sewer|plough/
	],
	['bus', /bus|coach|shuttle|library|clinic|decker/],
	['truck', /truck|lorry|tanker|van|pickup|camper|transporter|bowser/]
];

export function familyOf(vehicle: Vehicle): VehicleFamily {
	for (const [family, pattern] of RULES) {
		if (pattern.test(vehicle.id)) return family;
	}
	return 'car';
}

const JOB_BY_FAMILY: Record<VehicleFamily, JobKind> = {
	car: 'beep',
	truck: 'deliver',
	bus: 'passengers',
	farm: 'harvest',
	works: 'dig',
	emergency: 'siren',
	rail: 'platform'
};

export function jobOf(vehicle: Vehicle): JobKind {
	const family = familyOf(vehicle);
	if (family === 'emergency' && /fire|hazmat|rescue|aerial-ladder/.test(vehicle.id)) return 'spray';
	return JOB_BY_FAMILY[family];
}
