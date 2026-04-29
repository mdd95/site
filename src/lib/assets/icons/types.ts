import type { SVGAttributes } from 'svelte/elements';

export interface BaseIconProps extends SVGAttributes<SVGElement> {
	size?: number | string;
}
