import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { schema } from './+page.svelte';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(schema.create))
	};
};

export const actions = {
	create: async ({ request }) => {
		const form = await superValidate(request, zod4(schema.create));

		if (!form.valid) {
			return fail(400, { form });
		}
		await new Promise((r) => setTimeout(r, 5000));
		return { form };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const validate = schema.delete.safeParse({ id });

		if (!validate.success) {
			return fail(400, {});
		}
		return { id };
	}
} satisfies Actions;
