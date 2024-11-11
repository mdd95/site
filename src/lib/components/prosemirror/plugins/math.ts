import { NodeSelection, Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { InputRule } from 'prosemirror-inputrules';

import type { NodeSpec, NodeType } from 'prosemirror-model';
import type { Command, PluginSpec } from 'prosemirror-state';
import type { EditorView, NodeView } from 'prosemirror-view';

export interface MathPluginState {
	macros: Record<string, string>;
	prevCursorPos: number;
}

export const MATH_PLUGIN_KEY = new PluginKey<MathPluginState>('prosemirror-math');

export function createMathSchema(): Record<string, NodeSpec> {
	return {
		math_inline: {
			group: 'inline math',
			content: 'text*',
			inline: true,
			atom: true,
			toDOM: () => ['span', { 'data-node-type': 'math', 'data-display': 'inline' }, 0],
			parseDOM: [{ tag: 'span' }]
		},
		math_display: {
			group: 'block math',
			content: 'text*',
			atom: true,
			code: true,
			toDOM: () => ['span', { 'data-node-type': 'math', 'data-display': 'block' }, 0],
			parseDOM: [{ tag: '' }]
		}
	};
}

export class MathView implements NodeView {
	dom: HTMLElement;

	constructor() {
		this.dom = document.createElement('span');
		this.dom.dataset.nodeType = 'math';
		this.dom.dataset.display = 'inline';
	}
}

export function createMathView() {
	return (): MathView => {
		return new MathView();
	};
}

export const mathPluginSpec: PluginSpec<MathPluginState> = {
	key: MATH_PLUGIN_KEY,
	state: {
		init(config, instance) {
			return {
				macros: {},
				prevCursorPos: 0
			};
		},
		apply(tr, value, oldState, newState) {
			return {
				macros: value.macros,
				prevCursorPos: value.prevCursorPos
			};
		}
	},
	props: {
		nodeViews: {
			math_inline: createMathView()
		}
	}
};
export const mathPlugin = new Plugin(mathPluginSpec);

export function insertMathCommand(mathNodeType: NodeType, initialText = ''): Command {
	return (state, dispatch) => {
		const { $from } = state.selection;
		const index = $from.index();

		if (!$from.parent.canReplaceWith(index, index, mathNodeType)) {
			return false;
		}
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

export function collapseMathCommand(
	outerView: EditorView,
	entry: -1 | 1,
	requireOnBorder: boolean,
	requireEmptySelection = true
): Command {
	return (innerState, dispatch) => {
		const outerState = outerView.state;
		const { to: outerTo, from: outerFrom } = outerState.selection;
		const { to: innerTo, from: innerFrom } = innerState.selection;

		if (requireEmptySelection && innerTo !== innerFrom) return false;
		const currentPos = entry > 0 ? innerTo : innerFrom;

		if (requireOnBorder) {
			const nodeSize = innerState.doc.nodeSize - 2;
			if (entry > 0 && currentPos < nodeSize) return false;
			if (entry < 0 && currentPos > 0) return false;
		}

		if (dispatch) {
			const targetPos = entry > 0 ? outerTo : outerFrom;
			outerView.dispatch(
				outerState.tr.setSelection(TextSelection.create(outerState.doc, targetPos))
			);
			outerView.focus();
		}
		return true;
	};
}

export function backspaceMathCommand(): Command {
	return (state, dispatch) => {
		const { $from } = state.selection;
		const nodeBefore = $from.nodeBefore;

		if (!nodeBefore) return false;

		if (nodeBefore.type.name === 'math_inline') {
			const index = $from.index($from.depth);
			const $beforePos = state.doc.resolve($from.posAtIndex(index - 1));
			if (dispatch) {
				dispatch(state.tr.setSelection(new NodeSelection($beforePos)));
			}
			return true;
		} else if (nodeBefore.type.name === 'math_display') {
			return false;
		}

		return false;
	};
}

export const REGEX_MATH_INLINE = /\$(.+)\$/;
export const REGEX_MATH_DISPLAY = /\$\$\s+$/;

export function makeMathInlineInputRule(pattern: RegExp, nodeType: NodeType) {
	return new InputRule(pattern, (state, match, start, end) => {
		const $start = state.doc.resolve(start);
		const $end = state.doc.resolve(end);

		if (!$start.parent.canReplaceWith($start.index(), $end.index(), nodeType)) {
			return null;
		}
		return state.tr.replaceRangeWith(
			start,
			end,
			nodeType.create({}, nodeType.schema.text(match[1]))
		);
	});
}

export function makeMathDisplayInputRule(pattern: RegExp, nodeType: NodeType) {
	return new InputRule(pattern, (state, match, start, end) => {
		const $start = state.doc.resolve(start);

		if (!$start.node(-1).canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType))
			return null;

		const tr = state.tr.delete(start, end).setBlockType(start, start, nodeType, {});

		return tr.setSelection(NodeSelection.create(tr.doc, tr.mapping.map($start.pos - 1)));
	});
}
