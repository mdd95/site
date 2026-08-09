import { z } from 'zod/v4-mini';

export const login = z.object({
	email: z.string().check(z.email()),
	password: z.string()
});
