import { z } from 'zod';

export const updatePasswordFormSchema = z
	.object({
		isEncrypted: z.boolean(),
		password: z.string().min(6).max(255)
	})
	.refine(
		(data) => {
			return !data.isEncrypted || data.password.length > 0;
		},
		{
			message: 'Password is required',
			path: ['password']
		}
	);
