import { InputRule } from 'prosemirror-inputrules';
import { NodeSelection } from 'prosemirror-state';
import type { NodeType } from 'prosemirror-model';

const REGEX_MATH_INLINE = /\$(.+)\$/;
const REGEX_MATH_DISPLAY = /\$\$\s+$/;

export function mathInlineInputRule(nodeType: NodeType, pattern?: RegExp) {
	return new InputRule(pattern ?? REGEX_MATH_INLINE, (state, match, start, end) => {
		const docStart = state.doc.resolve(start);
		const docEnd = state.doc.resolve(end);

		if (!docStart.parent.canReplaceWith(docStart.index(), docEnd.index(), nodeType))
			return null;
		return state.tr.replaceRangeWith(
			start,
			end,
			nodeType.create({}, nodeType.schema.text(match[1]))
		);
	});
}

export function mathDisplayInputRule(nodeType: NodeType, pattern?: RegExp) {
	return new InputRule(pattern ?? REGEX_MATH_DISPLAY, (state, match, start, end) => {
		const docStart = state.doc.resolve(start);

		console.log(docStart);

		if (
			!docStart.node(-1).canReplaceWith(docStart.index(-1), docStart.indexAfter(-1), nodeType)
		)
			return null;
		const tr = state.tr.delete(start, end).setBlockType(start, start, nodeType, {});
		return tr.setSelection(NodeSelection.create(tr.doc, tr.mapping.map(docStart.pos - 1)));
	});
}
