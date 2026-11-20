/**
 * Renders the app icon from tools/icon.html and writes the PNG sizes the manifest and iOS
 * need. Run with `node tools/make-icons.mjs` from the project root.
 */
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const out = join(root, 'static', 'icons');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
await page.goto(pathToFileURL(join(root, 'tools', 'icon.html')).href);
await page.waitForTimeout(150);

const full = join(out, 'icon-512.png');
await page.screenshot({ path: full });
await browser.close();

execFileSync('sips', ['-z', '192', '192', full, '--out', join(out, 'icon-192.png')]);
execFileSync('sips', ['-z', '180', '180', full, '--out', join(out, 'apple-touch-icon.png')]);
execFileSync('sips', ['-z', '512', '512', full, '--out', join(out, 'maskable-512.png')]);

console.log('icons written to', out);
