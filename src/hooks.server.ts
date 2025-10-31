import { sequence } from '@sveltejs/kit/hooks';
import { initializeThemeMode, THEME_MODE_STORAGE_KEY } from '$lib/theme-manager.svelte.js';
import * as auth from '$lib/auth/hooks.js';
import type { Handle } from '@sveltejs/kit';

const inlineScriptRegExp = /\/\*\*%inline-script%\*\*\//g;
const inlineScript = `
	(${initializeThemeMode.toString()})("${THEME_MODE_STORAGE_KEY}");
`;

const handleInlineScript: Handle = ({ event, resolve }) => {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace(inlineScriptRegExp, inlineScript),
	});
};

export const handle: Handle = sequence(handleInlineScript, auth.hooks);
