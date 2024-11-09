import { encodeBase64url } from '@oslojs/encoding';

export function generateId(length: number): string {
	return encodeBase64url(crypto.getRandomValues(new Uint8Array(length)));
}
