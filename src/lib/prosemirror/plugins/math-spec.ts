import type { MarkSpec, NodeSpec } from 'prosemirror-model';

type SchemaSpec = {
	nodes: Record<string, NodeSpec>;
	marks: Record<string, MarkSpec>;
};

export const mathSchemaSpec: SchemaSpec = {
	nodes: {
		math_inline: {
			group: 'inline math',
			content: 'text*',
			inline: true,
			atom: true,
			toDOM: () => ['math-inline', { class: 'math-node' }, 0],
			parseDOM: [{ tag: 'math-inline' }],
		},
		math_display: {
			group: 'block math',
			content: 'text*',
			inline: false,
			atom: true,
			code: true,
			toDOM: () => ['math-display', { class: 'math-node' }, 0],
			parseDOM: [{ tag: 'math-display' }],
		},
	},
	marks: {},
};
