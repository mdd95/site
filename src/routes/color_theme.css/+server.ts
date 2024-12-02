import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const H = event.cookies.get('hue') || '240';
	const S = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
	const L = [97.78, 93.56, 88.11, 82.67, 74.22, 64.78, 57.33, 46.89, 39.44, 32, 23.78];
	const C = [
		0.0108, 0.0321, 0.0609, 0.0908, 0.1398, 0.1472, 0.1299, 0.1067, 0.0898, 0.0726, 0.054
	];
	const body = `:root{${S.map((s, i) => '--primary-' + s + ':oklch(' + L[i] + '% ' + C[i] + ' ' + H + ')').join(';')}}`;

	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': 'text/css'
		}
	});
};
