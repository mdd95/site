import { getUser } from '$lib/remote/auth.remote.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return { user: await getUser() };
};
