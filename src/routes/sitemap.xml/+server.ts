import * as sitemap from 'super-sitemap';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	// TODO: site domain
	return sitemap.response({
		origin: 'http://localhost:5173'
	});
};
