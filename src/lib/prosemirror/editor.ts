import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema } from 'prosemirror-schema-basic';
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { DOMSerializer, type MarkType } from 'prosemirror-model';
import { createHTMLDocument, type VHTMLDocument } from 'zeed-dom';

import { getActiveMarksPlugin } from './plugins/get-activemarks-plugin.js';
import type { ActiveMarks } from './plugins/get-activemarks-plugin.svelte.js';

import 'prosemirror-view/style/prosemirror.css';

export class Editor {
	state: EditorState | undefined;
	view: EditorView | undefined;
	activeMarks: ActiveMarks | undefined;

	bind(element: HTMLElement) {
		this.state = EditorState.create({
			schema,
			plugins: [
				history(),
				keymap({ 'Mod-z': undo, 'Mod-y': redo }),
				keymap(baseKeymap),
				getActiveMarksPlugin(this.activeMarks)
			]
		});
		this.view = new EditorView(element, {
			state: this.state
		});

		return {
			destroy: () => {
				if (this.view) {
					this.view.destroy();
					this.view = undefined;
					this.state = undefined;
				}
			}
		};
	}

	toggleMark(fn: (e: typeof schema.marks) => MarkType) {
		return () => {
			if (this.view === undefined) return;
			this.view.focus();
			toggleMark(fn(schema.marks))(this.view.state, this.view.dispatch, this.view);
		};
	}

	renderHTML() {
		if (this.view === undefined) return;

		const doc = DOMSerializer.fromSchema(schema).serializeFragment(
			this.view.state.doc.content,
			{ document: createHTMLDocument() as unknown as Document }
		) as unknown as VHTMLDocument;

		return doc.render();
	}
}
