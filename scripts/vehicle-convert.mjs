#!/usr/bin/env node
/**
 * Register a converted vehicle after its art module exists.
 *
 * Usage: node scripts/vehicle-convert.mjs <spec.json> [--dry] [--update]
 *
 * --update rewrites the masks, bounds and names of parts that are already registered.
 * Use it when an existing vehicle's art geometry changes; without it new parts are only
 * inserted once, so changed masks would be silently ignored.
 *
 * The spec owns only the new vehicle. This script performs the shared-file edits:
 * PartId union, PARTS, PART_NAMES, REAL_ART, the vehicle entry, and the level-art
 * registry used by the generic prototype.
 *
 * Art module contract (owned by the art author):
 *   src/lib/render/<module>.ts exports
 *     drawReal<Name>Level(ctx, x, y, scale, level)
 *     drawReal<Name>(ctx, x, y, scale)   // calls level 4
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const specPath = process.argv[2];
const dry = process.argv.includes('--dry');

if (!specPath) {
	console.error('usage: node scripts/vehicle-convert.mjs <spec.json> [--dry]');
	process.exit(1);
}

const spec = JSON.parse(readFileSync(resolve(specPath), 'utf8'));
const required = ['id', 'name', 'module', 'artWidth', 'artHeight', 'parts', 'vehicle'];
for (const key of required) {
	if (!spec[key]) {
		console.error(`spec is missing "${key}"`);
		process.exit(1);
	}
}

const pascal = spec.id
	.split('-')
	.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
	.join('');
const drawName = `drawReal${pascal}`;
const levelName = `${drawName}Level`;
const artFile = join(root, 'src/lib/render', `${spec.module}.ts`);

if (!dry && !existsSync(artFile)) {
	console.error(`art module not found: ${artFile}`);
	process.exit(1);
}
if (!dry) {
	const art = readFileSync(artFile, 'utf8');
	for (const name of [drawName, levelName]) {
		if (!art.includes(`export function ${name}`)) {
			console.error(`${spec.module}.ts does not export ${name}`);
			process.exit(1);
		}
	}
}

const read = (rel) => readFileSync(join(root, rel), 'utf8');
const write = (rel, text) => {
	if (dry) return;
	writeFileSync(join(root, rel), text);
};
const replaceOnce = (text, pattern, replacement, label) => {
	const matches = text.match(pattern);
	if (!matches) {
		console.error(`anchor not found: ${label}`);
		process.exit(1);
	}
	return text.replace(pattern, replacement);
};

const bounds = (b) => `{ x: ${b.x}, y: ${b.y}, w: ${b.w}, h: ${b.h} }`;

let parts = read('src/lib/game/parts.ts');
const firstId = spec.parts[0].id;
const ids = spec.parts.map((part) => `\t| '${part.id}'`).join('\n');
const partEntry = (part) => `\t${part.id}: realPart(
		'${part.id}',
		'${part.role}',
		'${part.kind}',
		'${spec.id}',
		'${part.mask}',
		${bounds(part.bounds)}
	),`;
const partEntries = spec.parts.map(partEntry).join('\n');
const nameEntries = spec.parts.map((part) => `\t${part.id}: '${part.name}',`).join('\n');

const insertObjectEntries = (text, anchor, entries, label) => {
	const index = text.indexOf(anchor);
	if (index < 0) {
		console.error(`anchor not found: ${label}`);
		process.exit(1);
	}
	const before = text.slice(0, index).replace(/\s+$/, '');
	const comma = before.endsWith(',') ? '' : ',';
	return `${before}${comma}\n${entries}\n${text.slice(index)}`;
};

const update = process.argv.includes('--update');

if (!parts.includes(`| '${firstId}'`)) {
	parts = replaceOnce(
		parts,
		/(\t\| '[^']+');\n\nexport type Role/,
		(match, last) => `${last}\n${ids};\n\nexport type Role`,
		'PartId union'
	);
}
if (update) {
	for (const part of spec.parts) {
		const block = new RegExp(`\\t${part.id}: realPart\\([\\s\\S]*?\\n\\t\\),`);
		if (!block.test(parts)) {
			console.error(`part entry not found for --update: ${part.id}`);
			process.exit(1);
		}
		parts = parts.replace(block, partEntry(part));
		const named = new RegExp(`\\t${part.id}: '[^']*',`);
		if (named.test(parts)) {
			parts = parts.replace(named, `\t${part.id}: '${part.name}',`);
		}
	}
} else {
	if (!parts.includes(`\t${firstId}: realPart(`)) {
		parts = insertObjectEntries(parts, '\n};\n\n/** Child-facing names', partEntries, 'PARTS object end');
	}
	if (!parts.includes(`\t${firstId}: '`)) {
		parts = insertObjectEntries(parts, '\n};\n\nexport function partName', nameEntries, 'PART_NAMES end');
	}
}
write('src/lib/game/parts.ts', parts);

let art = read('src/lib/render/realVehicles.ts');
if (!art.includes(`from './${spec.module}'`)) {
art = replaceOnce(
	art,
	/(import \{ drawReal[^\n]+\n)(\n)/,
	`$1import { ${drawName} } from './${spec.module}';\n$2`,
	'REAL_ART imports'
);
}
if (!art.includes(`'${spec.id}': { draw:`)) {
art = replaceOnce(
	art,
	/(export const REAL_ART: Record<string, RealArtSpec> = \{[\s\S]*?)(\n\};)/,
	(match, body, close) =>
		`${body.replace(/\s*$/, '')},\n\t'${spec.id}': { draw: ${drawName}, width: ${spec.artWidth}, height: ${spec.artHeight} }${close}`,
	'REAL_ART object'
);
}
write('src/lib/render/realVehicles.ts', art);

let levels = read('src/lib/render/levelArt.ts');
if (!levels.includes(`from './${spec.module}'`)) {
levels = replaceOnce(
	levels,
	/(\nexport type LevelDraw)/,
	`\nimport { ${levelName} } from './${spec.module}';\n$1`,
	'level registry import'
);
}
if (!levels.includes(`'${spec.id}': {`) && !levels.includes(`\n\t${spec.id}: {`)) {
levels = replaceOnce(
	levels,
	/(export const LEVEL_ART: Record<string, LevelArtSpec> = \{\n)/,
	`$1\t'${spec.id}': { draw: ${levelName}, width: ${spec.artWidth}, height: ${spec.artHeight} },\n`,
	'level registry object'
);
}
write('src/lib/render/levelArt.ts', levels);

const vehicleFile = existsSync(join(root, 'src/lib/game/vehicles.ts')) ? 'src/lib/game/vehicles.ts' : null;
let target = vehicleFile;
let source = target ? read(target) : '';
if (!target || !source.includes(`id: '${spec.id}'`)) {
	target = 'src/lib/game/fleet.ts';
	source = read(target);
}
if (!source.includes(`id: '${spec.id}'`)) {
	console.error(`vehicle entry not found for ${spec.id}`);
	process.exit(1);
}

const paletteFn = target.endsWith('vehicles.ts') ? 'palette' : 'pal';
const [c1, c2] = spec.vehicle.colors;
const slots = spec.vehicle.slots
	.map((slot) => {
		const extras = [
			slot.scale !== undefined ? `scale: ${slot.scale}` : null,
			slot.flip ? 'flip: true' : null
		].filter(Boolean);
		const tail = extras.length ? `, ${extras.join(', ')}` : '';
		return `\t\t\t{ id: '${slot.id}', part: '${slot.part}', x: ${slot.x}, y: ${slot.y}, z: ${slot.z}${tail} }`;
	})
	.join(',\n');
const entry = `\t{
\t\tid: '${spec.id}',
\t\tname: '${spec.name}',
\t\twidth: ${spec.vehicle.width},
\t\theight: ${spec.vehicle.height},
\t\tgroundY: ${spec.vehicle.groundY},
\t\tpalette: ${paletteFn}('${c1}', '${c2}'),
\t\tchassisPath: ${spec.vehicle.chassis},
\t\trealistic: true,
\t\tslots: [
${slots}
\t\t]
\t},`;

const start = source.indexOf(`\t\tid: '${spec.id}',`);
const blockStart = source.lastIndexOf('\n\t{', start);
const commaClose = source.indexOf('\n\t},', start);
const finalClose = source.indexOf('\n\t}\n', start);
const isLast = commaClose < 0 || (finalClose >= 0 && finalClose < commaClose);
const blockEnd = isLast ? finalClose + '\n\t}\n'.length : commaClose + '\n\t},'.length;
if (start < 0 || blockStart < 0 || blockEnd <= start) {
	console.error(`could not isolate the ${spec.id} vehicle block`);
	process.exit(1);
}
const entryText = isLast ? entry.replace(/,$/, '') : entry;
source = source.slice(0, blockStart + 1) + entryText + source.slice(blockEnd);
write(target, source);

console.log(
	JSON.stringify(
		{
			ok: true,
			dry,
			update,
			vehicle: spec.id,
			module: spec.module,
			parts: spec.parts.map((part) => part.id),
			registeredIn: target
		},
		null,
		2
	)
);
