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
</script>

<div class="screen">
	<div class="panel">
		<h1>Settings</h1>
		<p class="tagline">Slide to taste. Everything saves by itself.</p>

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
						style="--fill: {prefs[row.key] * 100}%"
						oninput={(event) => row.set(Number(event.currentTarget.value) / 100)}
					/>
				</label>
			{/each}
		</div>

		<button class="back" onclick={onback} type="button">Back</button>
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
		background: rgb(191 234 255 / 0.92);
		backdrop-filter: blur(6px);
		z-index: 30;
	}

	.panel {
		width: min(460px, 100%);
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
		margin: 0 0 18px;
		color: #7a6a55;
		font-size: 15px;
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
</style>
