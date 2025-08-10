import type { Handle } from '@sveltejs/kit';
import { initializeTheme } from '$lib/theme-context.js';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace(
				/\/\*\*%inline-script%\*\*\//,
				`(${initializeTheme.toString()})();`
			);
		}
	});
	return response;
};
