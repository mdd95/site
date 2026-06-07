import * as v from 'valibot';

export const signInEmail = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.nonEmpty())
});

export const signUpEmail = v.pipe(
	v.object({
		username: v.pipe(v.string(), v.minLength(6), v.maxLength(20)),
		name: v.pipe(v.string(), v.nonEmpty()),
		email: v.pipe(v.string(), v.email()),
		password: v.pipe(v.string(), v.minLength(8)),
		passwordConfirm: v.pipe(v.string(), v.nonEmpty())
	}),
	v.forward(
		v.partialCheck(
			[['password'], ['passwordConfirm']],
			(data) => data.password === data.passwordConfirm,
			'Passwords do not match'
		),
		['passwordConfirm']
	)
);
