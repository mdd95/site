import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import '../styles/placeholder.css';

export function placeholder(text: string) {
	return new Plugin({
		props: {
			decorations(state) {
				const { doc } = state;

				if (
					doc.childCount === 1 &&
					doc.firstChild!.type.name === 'paragraph' &&
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
