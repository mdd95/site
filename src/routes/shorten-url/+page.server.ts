import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request }) => {
		return { id: crypto.randomUUID(), slug: 'test', url: 'https://example.com' };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id || typeof id !== 'string' || id.length === 0) {
			return fail(400);
		}
		return { id };
	}
} satisfies Actions;
