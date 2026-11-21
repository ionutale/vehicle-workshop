<script lang="ts">
	import { prefs, setMusic, setSfx, setSound } from '#lib/preferences.svelte';

	interface Props {
		onback: () => void;
	}
	let { onback }: Props = $props();

	const rows = [
		{ key: 'music' as const, label: 'Music', set: setMusic },
		{ key: 'sound' as const, label: 'Sound', set: setSound },
		{ key: 'sfx' as const, label: 'Sound effects', set: setSfx }
	];

	const HOLD_MS = 1200;
	let unlocked = $state(false);
	let holdTimer: number | undefined;
	let justUnlocked = false;

	const startHold = () => {
		if (unlocked) return;
		justUnlocked = false;
		if (holdTimer) window.clearTimeout(holdTimer);
		holdTimer = window.setTimeout(() => {
			unlocked = true;
			justUnlocked = true;
			holdTimer = undefined;
		}, HOLD_MS);
	};

	const endHold = () => {
		if (holdTimer) {
			window.clearTimeout(holdTimer);
			holdTimer = undefined;
		}
	};

	const toggle = (event: MouseEvent) => {
		// A keyboard activation has detail 0; a tap or a released hold is a pointer click.
		if (event.detail === 0) {
			unlocked = !unlocked;
			justUnlocked = false;
			return;
		}
		if (justUnlocked) {
			justUnlocked = false;
			return;
		}
		if (unlocked) unlocked = false;
	};

	const back = () => {
		unlocked = false;
		onback();
	};
</script>

<div class="screen">
	<div class="panel">
		<h1>Settings</h1>
		<p class="tagline">Slide to taste. Everything saves by itself.</p>
		<p class="how">
			Drag a part onto its shadow. Every piece fits, so nothing can go wrong.
		</p>

		<button
			class="lock"
			class:open={unlocked}
			type="button"
			aria-pressed={unlocked}
			aria-label={unlocked ? 'Lock settings' : 'Unlock settings'}
			aria-describedby="settings-lock-note"
			onpointerdown={startHold}
			onpointerup={endHold}
			onpointerleave={endHold}
			onpointercancel={endHold}
			onclick={toggle}
		>
			<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
				{#if unlocked}
					<path
						d="M8 11V8a4 4 0 0 1 8 0v3"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				{:else}
					<path
						d="M8 11V8a4 4 0 0 1 7.6-1.7"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				{/if}
				<rect
					x="5"
					y="11"
					width="14"
					height="10"
					rx="3"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				/>
			</svg>
			<span>{unlocked ? 'Lock settings' : 'Hold to unlock'}</span>
		</button>
		<p class="lock-note" id="settings-lock-note">
			{unlocked
				? 'Settings are open. Tap the padlock to lock them again.'
				: 'Locked for little hands. Hold the padlock to change the volume.'}
		</p>

		<div class="rows">
			{#each rows as row (row.key)}
				<label class="row">
					<span class="label">{row.label}</span>
					<span class="value">{Math.round(prefs[row.key] * 100)}</span>
					<input
						type="range"
						min="0"
						max="100"
						step="1"
						value={Math.round(prefs[row.key] * 100)}
						aria-label={row.label}
						aria-describedby="settings-lock-note"
						disabled={!unlocked}
						style="--fill: {prefs[row.key] * 100}%"
						oninput={(event) => row.set(Number(event.currentTarget.value) / 100)}
					/>
				</label>
			{/each}
		</div>

		<button class="back" onclick={back} type="button">Back</button>
	</div>
</div>

<style>
	.screen {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: max(20px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right))
			max(20px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
		background: rgb(191 234 255 / 0.92);
		backdrop-filter: blur(6px);
		z-index: 30;
	}

	.panel {
		width: min(460px, 100%);
		margin: auto;
		background: #fff9ec;
		border: 4px solid #ffd8a8;
		border-radius: 32px;
		padding: clamp(20px, 5vw, 30px);
		box-shadow: 0 18px 40px rgb(58 39 27 / 0.2);
	}

	h1 {
		margin: 0 0 4px;
		font-size: clamp(26px, 7vw, 34px);
		color: #3a271b;
	}

	.tagline {
		margin: 0 0 12px;
		color: #7a6a55;
		font-size: 15px;
	}

	.how {
		margin: 0 0 16px;
		color: #5c4b3a;
		font-size: 14px;
		line-height: 1.35;
	}

	.lock {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		min-height: 52px;
		margin: 0 0 6px;
		border-radius: 999px;
		border: 3px solid #3a271b;
		background: #ffe9c9;
		color: #3a271b;
		font: inherit;
		font-size: 17px;
		font-weight: 600;
		box-shadow: 0 4px 0 #3a271b;
		cursor: pointer;
		touch-action: manipulation;
	}

	.lock.open {
		background: #8ad88a;
	}

	.lock-note {
		margin: 0 0 18px;
		font-size: 12.5px;
		color: #9a8a74;
	}

	.rows {
		display: grid;
		gap: 18px;
		margin-bottom: 24px;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 6px 12px;
		color: #3a271b;
	}

	.label {
		font-size: 17px;
		font-weight: 600;
	}

	.value {
		font-variant-numeric: tabular-nums;
		color: #9a8a74;
	}

	input[type='range'] {
		grid-column: 1 / -1;
		width: 100%;
		height: 48px;
		margin: 0;
		background: transparent;
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
	}

	input[type='range']:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	input[type='range']:disabled::-webkit-slider-thumb {
		background: #d9c9a8;
	}

	input[type='range']::-webkit-slider-runnable-track {
		height: 16px;
		border-radius: 999px;
		border: 2px solid #3a271b;
		background: linear-gradient(
			to right,
			#ff6b6b 0,
			#ff6b6b var(--fill),
			#ffe9c9 var(--fill),
			#ffe9c9 100%
		);
	}

	input[type='range']::-moz-range-track {
		height: 16px;
		border-radius: 999px;
		border: 2px solid #3a271b;
		background: #ffe9c9;
	}

	input[type='range']::-moz-range-progress {
		height: 16px;
		border-radius: 999px;
		background: #ff6b6b;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 34px;
		height: 34px;
		margin-top: -11px;
		border-radius: 50%;
		background: #ffd166;
		border: 3px solid #3a271b;
		box-shadow: 0 3px 0 #3a271b;
	}

	input[type='range']::-moz-range-thumb {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: #ffd166;
		border: 3px solid #3a271b;
	}

	.back {
		width: 100%;
		min-height: 56px;
		border-radius: 999px;
		border: 3px solid #3a271b;
		background: #ffd166;
		color: #3a271b;
		font: inherit;
		font-size: 19px;
		font-weight: 600;
		box-shadow: 0 5px 0 #3a271b;
		cursor: pointer;
	}

	.back:active {
		transform: translateY(2px);
		box-shadow: 0 3px 0 #3a271b;
	}

	@media (max-height: 640px) {
		.panel {
			padding: 16px;
		}

		h1 {
			font-size: 26px;
		}

		.tagline {
			margin-bottom: 8px;
		}

		.how {
			font-size: 13px;
			margin-bottom: 10px;
		}

		.rows {
			gap: 12px;
			margin-bottom: 16px;
		}

		.lock {
			min-height: 46px;
		}

		.lock-note {
			margin-bottom: 12px;
		}
	}
</style>
