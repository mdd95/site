import { Schema } from 'prosemirror-model';
import { mathSchemaSpec } from './math-spec.js';

export function mathExtendSchema(schema: Schema) {
	return new Schema({
		nodes: schema.spec.nodes
			.addToEnd('math_inline', mathSchemaSpec.nodes.math_inline)
			.addToEnd('math_display', mathSchemaSpec.nodes.math_display),
		marks: schema.spec.marks,
	});
}
