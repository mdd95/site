import { converter, formatCss, toGamut } from 'culori';

import type { RequestHandler } from './$types';

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000];
const lightness = [97.78, 93.56, 88.11, 82.67, 74.22, 64.78, 57.33, 46.89, 39.44, 32, 23.78, 12.02];
const chroma = [
	0.0108, 0.0321, 0.0609, 0.0908, 0.1398, 0.1472, 0.1299, 0.1067, 0.0898, 0.0726, 0.054, 0.0269
];
const oklch = converter('oklch');

const color = (base: string) => formatCss(oklch(toGamut('p3', 'oklch')(base)));
const formatProp = (key: string, shade: number, i: number, hue: string) =>
	'  --' +
	key +
	'-' +
	shade +
	': ' +
	color('oklch(' + lightness[i] + '% ' + chroma[i] + ' ' + hue + ')');

export const GET: RequestHandler = async (event) => {
	let props = '';
	for (const [key, value] of event.url.searchParams.entries()) {
		if (value === '' || isNaN(+value)) continue;
		props += shades.map((s, i) => formatProp(key, s, i, value)).join(';\n') + ';\n';
	}

	return new Response(':root {\n' + props + '}', {
		status: 200,
		headers: {
			'Content-Type': 'text/css'
		}
	});
};
