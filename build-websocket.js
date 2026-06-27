import { rolldown } from 'rolldown';

/**
 * @param {string} from
 * @param {string} to
 * @returns {import('rolldown').Plugin}
 */
function postReplace(from, to) {
	return {
		name: 'post-replace',
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
	input: 'src/websocket/entry.ts',
	external: ['SERVER'],
	platform: 'node',
	plugins: [postReplace('SERVER', './index.js')]
});

await builder.write({
	file: 'build/main.js',
	format: 'esm',
	sourcemap: true
});
