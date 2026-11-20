/**
 * Serves `build/` the way a static host configured for a `200.html` SPA
 * fallback does: real files win, unknown routes get the fallback shell.
 * `vite preview` does not implement that fallback, so offline/PWA checks use
 * this server instead. Host/port: `HOST` and `PORT` env vars, defaulting to
 * 127.0.0.1:4173. Bind HOST to a Tailscale IP to share it on the tailnet only.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve('build');
const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 4173);

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.webmanifest': 'application/manifest+json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.ico': 'image/x-icon',
	'.wav': 'audio/wav',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain; charset=utf-8'
};

function resolveFile(urlPath) {
	const clean = decodeURIComponent(urlPath.split('?')[0]);
	const relative = normalize(clean).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
	const candidate = join(root, relative);

	if (!candidate.startsWith(root)) return null;
	if (relative && existsSync(candidate) && statSync(candidate).isFile()) return candidate;

	if (!extname(relative)) {
		const fallback = join(root, '200.html');
		if (existsSync(fallback)) return fallback;
	}

	return null;
}

const server = createServer((request, response) => {
	const file = resolveFile(request.url ?? '/');
	if (!file) {
		response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
		response.end('Not found');
		return;
	}

	response.writeHead(200, {
		'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
		'cache-control': 'no-store'
	});
	createReadStream(file).pipe(response);
});

server.listen(port, host, () => {
	console.log(`Serving build/ at http://${host}:${port}`);
});
