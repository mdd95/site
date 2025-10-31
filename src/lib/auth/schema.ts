import * as v from 'valibot';

export const login = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.string(),
});

export const signup = v.pipe(
	v.object({
		username: v.pipe(v.string(), v.minLength(6), v.maxLength(55)),
		email: v.pipe(v.string(), v.trim(), v.email(), v.maxLength(255)),
		password: v.pipe(v.string(), v.minLength(8)),
		passwordConfirm: v.string(),
	}),
	v.forward(
		v.partialCheck(
			[['password'], ['passwordConfirm']],
			(input) => input.password === input.passwordConfirm,
			'Password does not matched!'
		),
		['passwordConfirm']
	)
);
