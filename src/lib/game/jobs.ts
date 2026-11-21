import type { Vehicle } from './vehicles';

/** The job beat a vehicle performs after its drive-off. */
export type JobKind =
	| 'beep'
	| 'deliver'
	| 'passengers'
	| 'harvest'
	| 'dig'
	| 'spray'
	| 'siren'
	| 'platform'
	| 'tow'
	| 'mix'
	| 'plough'
	| 'sweep'
	| 'roll'
	| 'pour'
	| 'logs'
	| 'cars'
	| 'lift'
	| 'rescue';

export const JOB_KINDS: JobKind[] = [
	'beep',
	'deliver',
	'passengers',
	'harvest',
	'dig',
	'spray',
	'siren',
	'platform',
	'tow',
	'mix',
	'plough',
	'sweep',
	'roll',
	'pour',
	'logs',
	'cars',
	'lift',
	'rescue'
];

/** A handful where the name alone would land on a generic family beat. */
export const JOB_OVERRIDES: Record<string, JobKind> = {
	'fire-engine': 'spray',
	'airport-fire-truck': 'spray',
	'hazmat-truck': 'spray',
	'aerial-ladder': 'spray',
	ambulance: 'rescue',
	'rescue-truck': 'rescue',
	'police-car': 'siren',
	'police-van': 'siren',
	'cement-mixer': 'mix',
	'concrete-pump': 'pour',
	'car-transporter': 'cars',
	'tow-truck': 'tow',
	trolleybus: 'passengers'
};

const RULES: Array<[RegExp, JobKind]> = [
	[/mixer|cement/, 'mix'],
	[/snow-plough|snow-blower|gritter/, 'plough'],
	[/sweeper|sewer/, 'sweep'],
	[/roller/, 'roll'],
	[/concrete-pump|asphalt-paver|road-planer/, 'pour'],
	[/log/, 'logs'],
	[/car-transporter/, 'cars'],
	[/forklift|telehandler|scissor-lift|cherry-picker|crane|hook-lift/, 'lift'],
	[/ambulance|rescue/, 'rescue'],
	[/police/, 'siren'],
	[/fire|hazmat/, 'spray'],
	[/train|tram|metro|trolleybus/, 'platform'],
	[/bus|coach|shuttle|library|clinic|decker/, 'passengers'],
	[/tractor|harvester|baler|sprayer/, 'harvest'],
	[/digger|dozer|backhoe|loader|excavator/, 'dig'],
	[/tanker|bowser|van|truck|lorry|camper|dumper|garbage|recycling|skip/, 'deliver'],
	[/./, 'beep']
];

export function jobOf(vehicle: Vehicle): JobKind {
	const override = JOB_OVERRIDES[vehicle.id];
	if (override) return override;
	for (const [pattern, job] of RULES) {
		if (pattern.test(vehicle.id)) return job;
	}
	return 'beep';
}
