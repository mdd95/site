<script lang="ts">
	import { Button } from 'bits-ui';

	let text = $state('');
	let list = $derived(text.split('\n'));
	let colorPalette = $state(['#f3dad8', '#f4c3c2']);

	type Maybe<T> = T | null | undefined;
	let ctx: Maybe<CanvasRenderingContext2D>;
	let animateId: Maybe<number>;
	let offscreenImg: Maybe<ImageBitmap>;
	let rotation = 0;
	let velocity = 0;
	let spinning = false;
	const friction = 0.995;
	const threshold = 0.001;

	function renderer(node: HTMLCanvasElement) {
		ctx = node.getContext('2d');

		const offscreen = new OffscreenCanvas(1000, 1000);
		const tmp = offscreen.getContext('2d')!;

		$effect(() => {
			if (list.length === 0) return;
			const cx = 500;
			const cy = 500;
			const arcLen = (2 * Math.PI) / list.length;

			tmp.clearRect(0, 0, 1000, 1000);
			for (let i = 0; i < list.length; i++) {
				tmp.beginPath();
				tmp.moveTo(cx, cy);
				tmp.arc(cx, cy, 470, arcLen * i, arcLen * (i + 1));
				tmp.lineTo(cx, cy);
				tmp.lineWidth = 3;
				tmp.fillStyle = colorPalette[i % colorPalette.length];
				tmp.fill();
				tmp.stroke();

				tmp.save();
				tmp.translate(cx, cy);
				tmp.rotate(arcLen * i + arcLen / 2);
				tmp.fillStyle = '#000000';
				tmp.font = '32px sans-serif';
				tmp.textAlign = 'end';
				tmp.fillText(list[i], 465, 0, 460);
				tmp.restore();
			}
			offscreenImg = offscreen.transferToImageBitmap();
			ctx?.drawImage(offscreenImg, 0, 0);
		});
	}

	function getWinner() {
		const arc = (2 * Math.PI) / list.length;
		const index = Math.floor((2 * Math.PI - rotation + arc / 2) / arc) % list.length;
		return list[index];
	}

	function animateSpin() {
		if (!ctx || !offscreenImg) {
			if (animateId) cancelAnimationFrame(animateId);
			return;
		}

		rotation += velocity;
		rotation %= 2 * Math.PI;
		velocity *= friction;

		ctx.clearRect(0, 0, 1000, 1000);

		const cx = 500;
		const cy = 500;

		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(rotation);
		ctx.drawImage(offscreenImg, -cx, -cy);
		ctx.restore();

		if (velocity > threshold) {
			animateId = requestAnimationFrame(animateSpin);
		} else {
			spinning = false;
			console.log(getWinner());
			console.log('spinning stopped');
		}
	}

	function start() {
		if (spinning) return;
		spinning = true;
		velocity = Math.random() * 0.3 + 0.25;
		animateId = requestAnimationFrame(animateSpin);
	}
</script>

<div class="layout">
	<div class="main">
		<canvas width={1000} height={1000} {@attach renderer}></canvas>
		<div class="actions">
			<textarea bind:value={text}></textarea>
			<Button.Root onclick={start} class="primary">Spin</Button.Root>
		</div>
	</div>
</div>

<style>
	.layout {
		padding-inline: 1rem;
	}

	.main {
		margin-inline: auto;
		display: grid;
		grid-template-columns: 2fr 1fr;
	}

	canvas {
		width: min(100%, 24rem);
	}

	textarea {
		display: block;
	}
</style>
