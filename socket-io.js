import { rolldown } from 'rolldown';

/**
 * @param {string} from
 * @param {string} to
 * @returns {import('rolldown').Plugin}
 */
function replace(from, to) {
	return {
		name: 'replace',
		generateBundle(_, bundle) {
			for (const file of Object.values(bundle)) {
				if (file.type === 'chunk') {
					file.code = file.code.replaceAll(from, to);
				}
			}
		}
	};
}

const builder = await rolldown({
	input: 'src/socket-io/entry.ts',
	external: ['SERVER', 'jsonwebtoken', 'socket.io'],
	platform: 'node',
	plugins: [replace('SERVER', './index.js')]
});

await builder.write({
	file: 'build/main.js',
	format: 'esm',
	sourcemap: true
});
