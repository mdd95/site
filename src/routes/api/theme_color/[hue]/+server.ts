import { formatHex, toGamut } from 'culori';

import type { RequestHandler } from './$types';

const color = (l: number, c: number, h: number) =>
	formatHex(toGamut('p3', 'oklch')('oklch(' + l + '% ' + c + ' ' + h + ')'));

export const GET: RequestHandler = async (event) => {
	const { hue } = event.params;
	const h = +hue;

	if (isNaN(h) || h < 0 || h > 360) {
		return new Response('Invalid parameters', { status: 400 });
	}

	return new Response(
		JSON.stringify({
			light: color(64.78, 0.1472, h),
			dark: color(11.73, 0.0243, h)
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		}
	);
};
