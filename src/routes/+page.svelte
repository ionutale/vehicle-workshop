<script lang="ts">
	let canvas: HTMLCanvasElement | undefined = $state();
</script>

<canvas bind:this={canvas} data-testid="stage"></canvas>

<style>
	:global(html, body) {
		margin: 0;
		height: 100%;
		overflow: hidden;
		background: #bfeaff;
	}
	canvas {
		display: block;
		width: 100vw;
		height: 100dvh;
		touch-action: none;
	}
</style>
