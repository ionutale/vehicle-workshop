#!/usr/bin/env node
/**
 * Render a five-level contact sheet for one art module, without registering it.
 *
 * Usage:
 *   node scripts/preview-art.mjs --module realTram --export drawRealTramLevel \
 *     --width 820 --height 380 --out tram-levels.png
 *
 * Requires the dev server on 127.0.0.1:5182 (override with VW_URL).
 */

import { chromium } from '@playwright/test';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
	const index = args.indexOf(`--${name}`);
	return index >= 0 ? args[index + 1] : fallback;
};

const moduleName = arg('module');
const exportName = arg('export');
const width = Number(arg('width'));
const height = Number(arg('height'));
const out = arg('out', 'preview.png');
const url = process.env.VW_URL ?? 'http://127.0.0.1:5182';

if (!moduleName || !exportName || !width || !height) {
	console.error('usage: node scripts/preview-art.mjs --module <name> --export <name> --width <n> --height <n> --out <file>');
	process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => {
	if (message.type() === 'error') errors.push(message.text());
});

await page.goto(`${url}/?test=1`, { waitUntil: 'networkidle' });
await page.evaluate(
	async ({ moduleName, exportName, width, height }) => {
		const mod = await import(`/src/lib/render/${moduleName}.ts`);
		const draw = mod[exportName];
		if (typeof draw !== 'function') throw new Error(`${exportName} is not exported by ${moduleName}.ts`);

		const W = 1320;
		const H = 620;
		const canvas = document.createElement('canvas');
		canvas.id = 'vw-preview';
		canvas.width = W;
		canvas.height = H;
		canvas.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;background:#F1E3CD';
		document.body.appendChild(canvas);
		const ctx = canvas.getContext('2d');

		const NAMES = ['Real silhouette', 'Shaded', 'Fully fitted', 'In the world', 'Picture-book'];
		const artW = width;
		const artH = height;

		const hero = (level) => {
			const x = 24;
			const y = 18;
			const w = W - 48;
			const h = 390;
			ctx.fillStyle = '#EAF7FF';
			ctx.fillRect(x, y, w, h);
			ctx.strokeStyle = 'rgba(58,39,27,0.16)';
			ctx.strokeRect(x, y, w, h);
			const scale = Math.min((w - 40) / artW, (h - 30) / artH);
			draw(ctx, x + (w - artW * scale) / 2, y + (h - artH * scale) / 2, scale, level);
			ctx.fillStyle = 'rgba(255,249,236,0.92)';
			ctx.fillRect(x + 12, y + 12, 320, 44);
			ctx.fillStyle = '#3A271B';
			ctx.font = '700 19px ui-rounded, system-ui, sans-serif';
			ctx.fillText(`${level}. ${NAMES[level - 1]}`, x + 24, y + 33);
		};

		const strip = (variant) => {
			const y = 430;
			const gap = 8;
			const cellW = (W - 48 - gap * 5) / 6;
			const cellH = 170;
			for (let level = 1; level <= 5; level++) {
				const x = 24 + level * (cellW + gap);
				ctx.fillStyle = '#FFF9EC';
				ctx.fillRect(x, y, cellW, cellH);
				ctx.strokeStyle = 'rgba(58,39,27,0.16)';
				ctx.strokeRect(x, y, cellW, cellH);
				ctx.fillStyle = 'rgba(255,249,236,0.9)';
				ctx.fillRect(x + 6, y + 6, 109, 21);
				ctx.fillStyle = '#3A271B';
				ctx.font = '700 11px ui-rounded, system-ui, sans-serif';
				ctx.fillText(`Level ${level}`, x + 12, y + 21);
				if (level === variant) {
					ctx.fillStyle = '#8AD88A';
					ctx.fillRect(x + cellW - 43, y + 7, 35, 17);
				}
				const scale = Math.min((cellW - 20) / artW, (cellH - 44) / artH);
				draw(
					ctx,
					x + (cellW - artW * scale) / 2,
					y + 24 + (cellH - 44 - artH * scale) / 2,
					scale,
					level
				);
				ctx.fillStyle = '#7A6A55';
				ctx.font = '11px ui-rounded, system-ui, sans-serif';
				ctx.textAlign = 'center';
				ctx.fillText(NAMES[level - 1], x + cellW / 2, y + cellH - 4);
				ctx.textAlign = 'left';
			}
		};

		hero(4);
		strip(4);
	},
	{ moduleName, exportName, width, height }
);

await page.waitForTimeout(200);
await page.locator('#vw-preview').screenshot({ path: out });
console.log(JSON.stringify({ ok: true, out, errors }));
await browser.close();
