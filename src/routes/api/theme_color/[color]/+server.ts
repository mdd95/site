import { formatHex, toGamut } from 'culori';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const { color } = event.params;
	const nums = color.split(',').map((n) => +n);

	if (nums.length !== 3 || nums.some(isNaN) || nums.some((n) => n < 0)) {
		return new Response('Invalid parameters', { status: 400 });
	}

	const [l, c, h] = nums;
	const oklch = 'oklch(' + l + '% ' + c + ' ' + h + ')';
	const hex = formatHex(toGamut('p3', 'oklch')(oklch));

	return new Response(hex, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
