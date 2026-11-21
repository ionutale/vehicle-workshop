import type { Vehicle } from './vehicles';

/** The seven voices a vehicle can inherit from its id. */
export type VehicleFamily = 'car' | 'truck' | 'bus' | 'farm' | 'works' | 'emergency' | 'rail';

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


