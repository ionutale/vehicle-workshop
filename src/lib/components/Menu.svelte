<script lang="ts">
	import { getVehicle } from '#lib/game/vehicles';
	import { drawGarageVehicle } from '#lib/render/garage';

	interface Props {
		started: boolean;
		garage: string[];
		onplay: () => void;
		onpick: (id: string) => void;
		onsettings: () => void;
	}
	let { started, garage, onplay, onpick, onsettings }: Props = $props();

	const WIDTH = 64;
	const HEIGHT = 40;

	const thumbnail = (canvas: HTMLCanvasElement, id: string) => {
		const paint = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(WIDTH * dpr);
			canvas.height = Math.round(HEIGHT * dpr);
			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, WIDTH, HEIGHT);
			drawGarageVehicle(ctx, getVehicle(id), WIDTH, HEIGHT);
		};
		paint();
		return {
			update(next: string) {
				if (next === id) return;
				id = next;
				paint();
			}
		};
	};
</script>

<div class="screen">
	<div class="panel">
		<div class="mark" aria-hidden="true">
			<svg viewBox="0 0 120 56" width="120" height="56">
				<path
					d="M12 44 Q12 36 22 34 L44 33 L52 22 Q55 18 60 18 L80 18 Q85 18 88 22 L96 33 L106 34 Q112 36 112 42 L112 46 Q112 50 106 50 L18 50 Q12 50 12 46 Z"
					fill="#FF6B6B"
					stroke="#3A271B"
					stroke-width="3"
					stroke-linejoin="round"
				/>
				<circle cx="36" cy="50" r="9" fill="#2B2D42" stroke="#3A271B" stroke-width="3" />
				<circle cx="92" cy="50" r="9" fill="#2B2D42" stroke="#3A271B" stroke-width="3" />
			</svg>
		</div>
		<h1>Vehicle Workshop</h1>
		<p class="tagline">Drag the parts. Watch it drive away.</p>

		<button class="primary" onclick={() => onplay()} type="button">
			<span class="glyph" aria-hidden="true">
				<svg viewBox="0 0 24 24" width="28" height="28">
					<path d="M8 5.5 19 12 8 18.5 Z" fill="currentColor" />
				</svg>
			</span>
			{started ? 'Resume' : 'Play'}
		</button>

		<button class="secondary" onclick={() => onsettings()} type="button">
			<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
				<path
					d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8 3.5c0 .5 0 1-.1 1.4l2 1.5-2 3.4-2.3-.9c-.7.6-1.5 1.1-2.3 1.4l-.4 2.4h-4l-.4-2.4c-.8-.3-1.6-.8-2.3-1.4l-2.3.9-2-3.4 2-1.5a7.7 7.7 0 0 1 0-2.8l-2-1.5 2-3.4 2.3.9c.7-.6 1.5-1.1 2.3-1.4L12.5 4h4l.4 2.4c.8.3 1.6.8 2.3 1.4l2.3-.9 2 3.4-2 1.5c.1.4.1.9.1 1.4Z"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linejoin="round"
				/>
			</svg>
			Settings
		</button>

		{#if garage.length > 0}
			<div class="garage" data-testid="garage" aria-label="Your garage">
				{#each garage as id (id)}
					<button
						class="parked"
						type="button"
						aria-label={getVehicle(id).name}
						data-vehicle={id}
						onclick={() => onpick(id)}
					>
						<canvas use:thumbnail={id} aria-hidden="true"></canvas>
					</button>
				{/each}
			</div>
		{/if}

		<p class="note">For little hands. No reading needed once it starts.</p>
	</div>
</div>

<style>
	.screen {
		position: fixed;
		inset: 0;
		display: grid;
		place-items: center;
		padding: max(20px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right))
			max(20px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
		background:
			radial-gradient(circle at 30% 20%, rgb(255 255 255 / 0.5), transparent 60%), #bfeaff;
		z-index: 20;
	}

	.panel {
		width: min(420px, 100%);
		background: #fff9ec;
		border: 4px solid #ffd8a8;
		border-radius: 32px;
		padding: clamp(20px, 5vw, 34px);
		text-align: center;
		box-shadow: 0 18px 40px rgb(58 39 27 / 0.18);
	}

	.mark {
		display: flex;
		justify-content: center;
		margin-bottom: 4px;
	}

	h1 {
		margin: 6px 0 6px;
		font-size: clamp(28px, 8vw, 40px);
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: #3a271b;
	}

	.tagline {
		margin: 0 0 22px;
		color: #7a6a55;
		font-size: clamp(15px, 4vw, 17px);
	}

	button {
		width: 100%;
		min-height: 60px;
		border-radius: 999px;
		border: 3px solid #3a271b;
		font: inherit;
		font-size: clamp(18px, 5vw, 21px);
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		cursor: pointer;
	}

	.primary {
		background: #ff6b6b;
		color: #fff9ec;
		box-shadow: 0 6px 0 #3a271b;
		margin-bottom: 14px;
	}

	.primary:active {
		transform: translateY(3px);
		box-shadow: 0 3px 0 #3a271b;
	}

	.secondary {
		background: #ffd166;
		color: #3a271b;
		box-shadow: 0 5px 0 #3a271b;
	}

	.secondary:active {
		transform: translateY(2px);
		box-shadow: 0 3px 0 #3a271b;
	}

	.glyph {
		display: inline-flex;
	}

	.garage {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		margin-top: 16px;
		padding: 10px;
		border-radius: 20px;
		background: #eaf7ff;
		border: 2px solid #c9e8f7;
	}

	.garage .parked {
		min-height: 0;
		width: 100%;
		padding: 4px;
		border: 2px solid #bfe2f5;
		border-radius: 12px;
		background: #ffffff;
		box-shadow: none;
	}

	.garage .parked:active {
		transform: translateY(1px);
	}

	.garage canvas {
		display: block;
		width: 100%;
		height: 40px;
	}

	.note {
		margin: 18px 0 0;
		font-size: 13px;
		color: #9a8a74;
	}
</style>
