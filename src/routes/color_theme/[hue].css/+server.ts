import { converter, formatCss, toGamut } from 'culori';

import type { RequestHandler } from './$types';

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const lightness = [97.78, 93.56, 88.11, 82.67, 74.22, 64.78, 57.33, 46.89, 39.44, 32, 23.78];
const chroma = [
	0.0108, 0.0321, 0.0609, 0.0908, 0.1398, 0.1472, 0.1299, 0.1067, 0.0898, 0.0726, 0.054
];
const oklch = converter('oklch');

function getOklch(l: number | string, c: number | string, h: number | string) {
	const color = 'oklch(' + l + '% ' + c + ' ' + h + ')';
	return formatCss(oklch(toGamut('p3', 'oklch')(color)));
}

export const GET: RequestHandler = async (event) => {
	let hue = event.params.hue || 240;

	return new Response(
		`:root{${shades.map((s, i) => '--primary-' + s + ':' + getOklch(lightness[i], chroma[i], hue)).join(';')}}`,
		{
			status: 200,
			headers: {
				'Content-Type': 'text/css',
				'Cache-Control': 'public, max-age=31536000'
			}
		}
	);
};
