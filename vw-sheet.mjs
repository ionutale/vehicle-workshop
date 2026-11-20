import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const ids = ['tram','milk-tanker','fuel-tanker','log-truck'];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const shots = [];
for (const id of ids) {
  await p.goto(`http://127.0.0.1:5182/?test=1&vehicle=${id}`);
  await p.waitForTimeout(300);
  await p.evaluate(() => window.__vw.complete());
  await p.waitForTimeout(30);
  const buf = await p.screenshot({ clip: { x: 0, y: 500, width: 390, height: 260 } });
  shots.push({ id, src: `data:image/png;base64,${buf.toString('base64')}` });
}
writeFileSync('/tmp/vw-sheet3.html', `<!doctype html><body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(2,390px);gap:6px;padding:6px;font:14px sans-serif;color:#fff">
${shots.map(s => `<div><img src="${s.src}" style="width:390px;display:block"><div>${s.id}</div></div>`).join('')}</body>`);
const sheet = await b.newPage({ viewport: { width: 800, height: 600 } });
await sheet.goto('file:///tmp/vw-sheet3.html');
await sheet.waitForTimeout(300);
await sheet.screenshot({ path: 'sheet3.png', fullPage: true });
await b.close();
