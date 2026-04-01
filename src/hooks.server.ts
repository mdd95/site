import { createInitialModeExpression } from 'mode-watcher';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('%modewatcher.snippet%', createInitialModeExpression())
	});
};
