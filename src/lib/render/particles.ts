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

/** Celebration confetti: a fixed pool of spinning paper rectangles. */

export interface ConfettiPiece {
	x: number;
	y: number;
	vx: number;
	vy: number;
	age: number;
	life: number;
	w: number;
	h: number;
	rotation: number;
	spin: number;
	colour: string;
}

export interface ConfettiField {
	spawn(x: number, y: number, colours: string[], count: number): void;
	step(dt: number): void;
	draw(ctx: CanvasRenderingContext2D): void;
	clear(): void;
	live(): number;
}

const CONFETTI_CAP = 56;

export function createConfetti(): ConfettiField {
	const pool: ConfettiPiece[] = [];
	let cursor = 0;

	for (let i = 0; i < CONFETTI_CAP; i++) {
		pool.push({
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			age: 1,
			life: 1,
			w: 10,
			h: 14,
			rotation: 0,
			spin: 0,
			colour: '#FFFFFF'
		});
	}

	return {
		spawn(x, y, colours, count) {
			for (let i = 0; i < count; i++) {
				const piece = pool[cursor % CONFETTI_CAP];
				cursor++;
				const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
				const speed = 220 + Math.random() * 260;
				piece.x = x + (Math.random() - 0.5) * 60;
				piece.y = y + (Math.random() - 0.5) * 30;
				piece.vx = Math.cos(angle) * speed;
				piece.vy = Math.sin(angle) * speed;
				piece.age = 0;
				piece.life = 900 + Math.random() * 600;
				piece.w = 8 + Math.random() * 6;
				piece.h = 12 + Math.random() * 8;
				piece.rotation = Math.random() * Math.PI;
				piece.spin = (Math.random() - 0.5) * 12;
				piece.colour = colours[Math.floor(Math.random() * colours.length)];
			}
		},
		step(dt) {
			const seconds = Math.min(dt, 32) / 1000;
			for (const piece of pool) {
				if (piece.age >= piece.life) continue;
				piece.age += dt;
				piece.x += piece.vx * seconds;
				piece.y += piece.vy * seconds;
				piece.vy += 780 * seconds;
				piece.vx *= 1 - 1.1 * seconds;
				piece.rotation += piece.spin * seconds;
			}
		},
		draw(ctx) {
			for (const piece of pool) {
				if (piece.age >= piece.life) continue;
				const t = piece.age / piece.life;
				ctx.save();
				ctx.globalAlpha = t > 0.7 ? (1 - t) / 0.3 : 1;
				ctx.translate(piece.x, piece.y);
				ctx.rotate(piece.rotation);
				ctx.fillStyle = piece.colour;
				ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
				ctx.restore();
			}
			ctx.globalAlpha = 1;
		},
		clear() {
			for (const piece of pool) piece.age = piece.life;
		},
		live() {
			let count = 0;
			for (const piece of pool) if (piece.age < piece.life) count++;
			return count;
		}
	};
}
