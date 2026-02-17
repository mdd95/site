import { pcBaseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { insertMath } from './plugins/math-commands.js';
import { editorSchema } from './schema.js';

export const editorKeymap = keymap({
	...pcBaseKeymap,
	'Alt-=': insertMath(editorSchema.nodes.mathInline),
});
