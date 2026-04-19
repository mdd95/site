export function createId(length: number = 8) {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);

	return btoa(String.fromCharCode(...bytes))
		.replace(/[^a-zA-Z0-9]/g, '')
		.slice(0, length);
}
