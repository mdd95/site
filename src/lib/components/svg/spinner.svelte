<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	interface BaseProps extends SVGAttributes<SVGElement> {
		color?: string;
		size?: string;
	}

	let { role = 'img', size = '24', color = 'currentColor', ...restProps }: BaseProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{role}
	width={size}
	height={size}
	stroke={color}
	viewBox="0 0 24 24"
	{...restProps}
>
	<g transform-origin="center">
		<circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3" stroke-linecap="round">
			<animateTransform
				attributeName="transform"
				type="rotate"
				from="0 12 12"
				to="360 12 12"
				dur="2s"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="stroke-dasharray"
				values="0,150;42,150;42,150"
				keyTimes="0;0.475;1"
				dur="1.5s"
				repeatCount="indefinite"
			/>
			<animate
				attributeName="stroke-dashoffset"
				values="0;-16;-59"
				keyTimes="0;0.475;1"
				dur="1.5s"
				repeatCount="indefinite"
			/>
		</circle>
	</g>
</svg>
