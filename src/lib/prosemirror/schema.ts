import { schema } from 'prosemirror-schema-basic';
import { mathExtendSchema } from './plugins/math-schema.js';

export const editorSchema = mathExtendSchema(schema);

console.log(editorSchema);
