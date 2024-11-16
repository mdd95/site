import { DOMSerializer } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { createHTMLDocument } from 'zeed-dom';

import type { Schema } from 'prosemirror-model';
import type { EditorView } from 'prosemirror-view';
import type { VHTMLDocument } from 'zeed-dom';

function getHTMLDocumentContent(schema: Schema, view: EditorView): string {
	const doc = DOMSerializer.fromSchema(schema).serializeFragment(view.state.doc.content, {
		document: createHTMLDocument() as unknown as Document
	}) as unknown as VHTMLDocument;
	return doc.render();
}

type _State = { value: string | number };

export function bindHTMLContentToState(schema: Schema, state: _State) {
	return new Plugin({
		view() {
			return {
				update(view) {
					state.value = getHTMLDocumentContent(schema, view);
				}
			};
		}
	});
}

export function bindWordCountToProxy(state: _State) {
	return new Plugin({
		view() {
			return {
				update(view) {
					state.value = view.state.doc
						.textBetween(0, view.state.doc.content.size, ' ', ' ')
						.trim()
						.split(/\s+/)
						.filter((word) => word.length > 0).length;
				}
			};
		}
	});
}
