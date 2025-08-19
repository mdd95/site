import { initializeTheme, THEME_STORAGE_KEY } from '$lib/theme-manager.svelte.js';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

const handleInlineScript: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace(
				/\/\*\*%inline-script%\*\*\//,
				`(${initializeTheme.toString()})("${THEME_STORAGE_KEY}");`
			)
	});

export const handle: Handle = sequence(handleInlineScript);
