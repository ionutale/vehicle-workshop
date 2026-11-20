/** Tyre smoke. A fixed pool, no per-frame allocation, stepped by the page's clock. */

export interface DustParticle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	age: number;
	life: number;
	r: number;
}

export interface DustField {
	spawn(x: number, y: number, count: number): void;
	step(dt: number): void;
	draw(ctx: CanvasRenderingContext2D): void;
	clear(): void;
}

const CAP = 24;

export function createDust(): DustField {
	const pool: DustParticle[] = [];
	let cursor = 0;

	for (let i = 0; i < CAP; i++) {
		pool.push({ x: 0, y: 0, vx: 0, vy: 0, age: 1, life: 1, r: 0 });
	}

	return {
		spawn(x, y, count) {
			for (let i = 0; i < count; i++) {
				const p = pool[cursor % CAP];
				cursor++;
				p.x = x + (Math.random() - 0.5) * 18;
				p.y = y + (Math.random() - 0.5) * 12;
				p.vx = -60 - Math.random() * 80;
				p.vy = -20 - Math.random() * 40;
				p.age = 0;
				p.life = 520 + Math.random() * 260;
				p.r = 7 + Math.random() * 7;
			}
		},
		step(dt) {
			const seconds = Math.min(dt, 32) / 1000;
			for (const p of pool) {
				if (p.age >= p.life) continue;
				p.age += dt;
				p.x += p.vx * seconds;
				p.y += p.vy * seconds;
				p.vy += 120 * seconds;
				p.vx *= 1 - 1.6 * seconds;
			}
		},
		draw(ctx) {
			for (const p of pool) {
				if (p.age >= p.life) continue;
				const t = p.age / p.life;
				ctx.globalAlpha = 0.35 * (1 - t);
				ctx.fillStyle = '#FFFFFF';
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r * (1 + t * 0.8), 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.globalAlpha = 1;
		},
		clear() {
			for (const p of pool) p.age = p.life;
		}
	};
}
