import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import './placeholder.css';

export function placeholder(text = '') {
	return new Plugin({
		props: {
			decorations(state) {
				const { doc } = state;

				if (
					doc.childCount === 1 &&
					doc.firstChild!.isTextblock &&
					doc.firstChild!.content.size === 0
				) {
					const decoration = Decoration.node(0, doc.content.size, {
						class: 'ProseMirror-placeholder',
						'data-placeholder': text
					});
					return DecorationSet.create(doc, [decoration]);
				}
				return DecorationSet.empty;
			}
		}
	});
}
