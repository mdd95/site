import type { Schema } from 'prosemirror-model';
import type { Plugin } from 'prosemirror-state';

export type EditorPlugin = {
	applySchema?: (schema: Schema) => Schema;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	applyPlugins?: (schema: Schema) => Array<Plugin<any>>;
};
