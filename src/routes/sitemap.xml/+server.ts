import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { RequestHandler } from './$types';

export const prerender = true;

function getRoutes(dir: string, base: string = '') {
	const entries = readdirSync(dir);
	let routes: { path: string; lastmod: string; priority: number }[] = [];

	for (const entry of entries) {
		const fullpath = join(dir, entry);
		const routepath = base ? `${base}/${entry}` : `/${entry}`;
		const stats = statSync(fullpath);

		if (stats.isDirectory()) {
			routes = routes.concat(getRoutes(fullpath, routepath));
		} else if (entry === '+page.svelte') {
			const lastmod = stats.mtime.toISOString().split('T').at(0)!;
			const depth = routepath.split('/').filter(Boolean).length;
			const priority = Math.max(1 - depth * 0.1, 0.3);
			routes.push({ path: base || '/', lastmod, priority });
		}
	}
	return routes;
}

export const GET: RequestHandler = async () => {
	// TODO: site domain
	const baseUrl = 'http://localhost:5173';
	const routes = getRoutes('src/routes');

	const routesXml = routes
		.map(({ path, lastmod, priority }) =>
			[
				'<url>',
				`   <loc>${baseUrl}${path}</loc>`,
				`   <lastmod>${lastmod}</lastmod>`,
				`   <priority>${priority.toFixed(1)}</priority>`,
				'</url>'
			].join('\n')
		)
		.join('\n');
	const sitemap = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		routesXml,
		'</urlset>'
	].join('\n');

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
