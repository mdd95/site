import { NodeSelection, TextSelection } from 'prosemirror-state';
import type { NodeType } from 'prosemirror-model';
import type { Command } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

export function insertMath(mathNodeType: NodeType, initialText = ''): Command {
	return (state, dispatch) => {
		const { $from } = state.selection;
		const index = $from.index();

		if (!$from.parent.canReplaceWith(index, index, mathNodeType)) return false;
		if (dispatch) {
			const mathNode = mathNodeType.create(
				{},
				initialText ? state.schema.text(initialText) : null
			);
			const tr = state.tr.replaceSelectionWith(mathNode);
			dispatch(tr.setSelection(NodeSelection.create(tr.doc, $from.pos)));
		}
		return true;
	};
}

export function collapseMath(
	outerView: EditorView,
	entry: -1 | 1,
	requireOnBorder: boolean,
	requireEmptySelection = true
): Command {
	return (innerState, dispatch) => {
		const outerState = outerView.state;
		const { from: outerFrom, to: outerTo } = outerState.selection;
		const { from: innerFrom, to: innerTo } = innerState.selection;

		if (requireEmptySelection && innerTo !== innerFrom) return false;
		const currentPos = entry > 0 ? innerTo : innerFrom;

		if (requireOnBorder) {
			const nodeSize = innerState.doc.nodeSize - 2;
			if (entry > 0 && currentPos < nodeSize) return false;
			if (entry < 0 && currentPos > 0) return false;
		}

		if (dispatch) {
			const targetPos = entry > 0 ? outerTo : outerFrom;
			const selection = TextSelection.create(outerState.doc, targetPos);
			const tr = outerState.tr.setSelection(selection);

			outerView.dispatch(tr);
			outerView.focus();

			const { $from } = outerView.state.selection;
			if (!$from.nodeAfter) return false;
		}
		return true;
	};
}

export const backspaceMath: Command = (state, dispatch) => {
	const { empty, $from, from } = state.selection;

	if (empty && dispatch) {
		if ($from.nodeBefore?.type.name === 'math_inline') {
			const index = $from.index($from.depth);
			const $beforePos = state.doc.resolve($from.posAtIndex(index - 1));

			dispatch(state.tr.setSelection(new NodeSelection($beforePos)));
		} else if ($from.parent.type.name === 'math_display') {
			const index = $from.index($from.depth - 1);
			const $beforePos = state.doc.resolve($from.posAtIndex(index, $from.depth - 1));

			dispatch(state.tr.setSelection(new NodeSelection($beforePos)));
		} else if (
			$from.parentOffset === 0 &&
			state.doc.resolve(from - 1).nodeBefore?.type.name === 'math_display'
		) {
			const index = $from.index($from.depth - 1);
			const $beforePos = state.doc.resolve($from.posAtIndex(index - 1, $from.depth - 1));

			dispatch(state.tr.setSelection(new NodeSelection($beforePos)));
			return true;
		}
	}
	return false;
};
