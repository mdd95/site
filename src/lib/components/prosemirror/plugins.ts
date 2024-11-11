import { Plugin } from 'prosemirror-state';
import { DOMSerializer, type Schema } from 'prosemirror-model';
import { createHTMLDocument, type VHTMLDocument } from 'zeed-dom';
import type { EditorView } from 'prosemirror-view';

export function getDocumentContent(schema: Schema, view: EditorView): string {
	const doc = DOMSerializer.fromSchema(schema).serializeFragment(view.state.doc.content, {
		document: createHTMLDocument() as unknown as Document
	}) as unknown as VHTMLDocument;
	return doc.render();
}

type Proxy = { value: string | number };

export function bindContentToProxy(schema: Schema, proxy: Proxy) {
	return new Plugin({
		view() {
			return {
				update(view) {
					proxy.value = getDocumentContent(schema, view);
				}
			};
		}
	});
}

export function bindWordCountToProxy(proxy: Proxy) {
	return new Plugin({
		view() {
			return {
				update(view) {
					proxy.value = view.state.doc
						.textBetween(0, view.state.doc.content.size, ' ', ' ')
						.trim()
						.split(/\s+/)
						.filter((word) => word.length > 0).length;
				}
			};
		}
	});
}
