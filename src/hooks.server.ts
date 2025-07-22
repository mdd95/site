import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const nonce = crypto.randomUUID().replace(/-/g, '');
	event.locals.nonce = nonce;

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace(/<script(?![^>]*nonce)/g, `<script nonce="${nonce}"`);
		}
	});

	response.headers.set(
		'Content-Security-Policy',
		[
			`default-src 'self'`,
			`script-src 'self' 'nonce-${nonce}'`,
			`style-src 'self' 'unsafe-inline'`
		].join('; ')
	);
	return response;
};
