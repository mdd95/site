import { inputRules } from 'prosemirror-inputrules';
import { mathDisplayInputRule, mathInlineInputRule } from './plugins/math-input-rules.js';
import { editorSchema } from './schema.js';

export const editorInputRules = inputRules({
	rules: [
		mathInlineInputRule(editorSchema.nodes.math_inline),
		mathDisplayInputRule(editorSchema.nodes.math_display),
	],
});

console.log(editorInputRules);
