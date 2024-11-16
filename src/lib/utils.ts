import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { encodeBase64url } from '@oslojs/encoding';

import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function useId(length: number) {
	return encodeBase64url(crypto.getRandomValues(new Uint8Array(length)));
}
