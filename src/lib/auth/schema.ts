import * as v from 'valibot';

export const login = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.string(),
});

export const signup = v.pipe(
	v.object({
		username: v.pipe(v.string(), v.minLength(6), v.maxLength(50)),
		email: v.pipe(v.string(), v.email(), v.maxLength(320)),
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

export const update = v.object({
	email: v.pipe(v.string(), v.email(), v.maxLength(320)),
	username: v.pipe(v.string(), v.minLength(6), v.maxLength(50)),
	bio: v.pipe(v.string(), v.maxLength(512)),
	birthdate: v.pipe(
		v.string(),
		v.transform((input) => new Date(input))
	),
});

export const password = v.pipe(
	v.object({
		previousPassword: v.string(),
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
