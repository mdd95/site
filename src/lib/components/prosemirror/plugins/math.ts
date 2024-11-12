import katex, { type KatexOptions } from 'katex';
import 'katex/dist/katex.css';
import './math.css';

import { chainCommands, deleteSelection, newlineInCode } from 'prosemirror-commands';
import { InputRule } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { EditorState, NodeSelection, Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import { StepMap } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';

import type { Node, NodeSpec, NodeType } from 'prosemirror-model';
import type { Command, PluginSpec, Transaction } from 'prosemirror-state';
import type { NodeView, NodeViewConstructor } from 'prosemirror-view';

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
			toDOM: () => ['math-inline', { class: 'math-node' }, 0],
			parseDOM: [{ tag: 'math-inline' }]
		},
		math_display: {
			group: 'block math',
			content: 'text*',
			inline: false,
			atom: true,
			code: true,
			toDOM: () => ['math-display', { class: 'math-node' }, 0],
			parseDOM: [{ tag: 'math-display' }]
		}
	};
}

interface MathViewOptions {
	tagName?: string;
	katexOptions?: KatexOptions;
}

export class MathView implements NodeView {
	#node: Node;
	#outerView: EditorView;
	#getPos: () => number | undefined;
	#mathPluginKey: PluginKey<MathPluginState>;
	#tagName: string;
	#katexOptions: KatexOptions;

	dom: HTMLElement;
	#innerView: EditorView | undefined;
	#mathRenderEl: HTMLElement | undefined;
	#mathSrcEl: HTMLElement | undefined;

	#isEditing: boolean;

	constructor(
		node: Node,
		view: EditorView,
		getPos: () => number | undefined,
		options: MathViewOptions = {},
		mathPluginKey: PluginKey<MathPluginState>
	) {
		this.#node = node;
		this.#outerView = view;
		this.#getPos = getPos;
		this.#mathPluginKey = mathPluginKey;
		this.#tagName = options.tagName || this.#node.type.name.replace('_', '-');
		this.#katexOptions = {
			globalGroup: true,
			throwOnError: false,
			...options.katexOptions
		};

		this.dom = document.createElement(this.#tagName);
		this.dom.classList.add('math-node');

		this.#mathRenderEl = document.createElement('span');
		this.#mathRenderEl.textContent = '';
		this.#mathRenderEl.classList.add('math-render');
		this.dom.appendChild(this.#mathRenderEl);

		this.#mathSrcEl = document.createElement('span');
		this.#mathSrcEl.classList.add('math-src');
		this.#mathSrcEl.spellcheck = false;
		this.dom.appendChild(this.#mathSrcEl);

		this.#isEditing = false;

		this.dom.addEventListener('click', this.ensureFocus.bind(this));
		this.renderMath();
	}

	destroy() {
		this.closeEditor(false);
		if (this.#mathRenderEl) {
			this.#mathRenderEl.remove();
			this.#mathRenderEl = undefined;
		}
		if (this.#mathSrcEl) {
			this.#mathSrcEl.remove();
			this.#mathSrcEl = undefined;
		}
		this.dom.remove();
	}

	update(node: Node) {
		if (!node.sameMarkup(this.#node)) return false;
		this.#node = node;

		if (this.#innerView) {
			const state = this.#innerView.state;
			let start = node.content.findDiffStart(state.doc.content);

			if (start !== null) {
				let diff = node.content.findDiffEnd(state.doc.content);
				if (diff) {
					let { a, b } = diff;
					let overlap = start - Math.min(a, b);
					if (overlap > 0) {
						a += overlap;
						b += overlap;
					}
					this.#innerView.dispatch(
						state.tr
							.replace(start, b, node.slice(start, a))
							.setMeta('fromOutside', true)
					);
				}
			}
		}

		if (!this.#isEditing) {
			this.renderMath();
		}
		return true;
	}

	selectNode() {
		if (!this.#outerView.editable) return;
		this.dom.classList.add('ProseMirror-selectednode');
		if (!this.#isEditing) this.openEditor();
	}

	deselectNode() {
		this.dom.classList.remove('ProseMirror-selectednode');
		if (this.#isEditing) this.closeEditor();
	}

	stopEvent(event: Event): boolean {
		return (
			event.target !== undefined &&
			this.#innerView !== undefined &&
			this.#innerView.dom.contains(event.target as globalThis.Node)
		);
	}

	ignoreMutation() {
		return true;
	}

	ensureFocus() {
		if (this.#innerView && this.#outerView.hasFocus()) {
			this.#innerView.focus();
		}
	}

	renderMath() {
		if (!this.#mathRenderEl) return;
		const content = this.#node.content.firstChild;
		const tex = content !== null ? content.textContent.trim() : '';

		if (tex.length === 0) {
			this.dom.classList.add('math-empty');

			while (this.#mathRenderEl.firstChild) {
				this.#mathRenderEl.firstChild.remove();
			}
			return;
		} else {
			this.dom.classList.remove('math-empty');
		}

		try {
			katex.render(tex, this.#mathRenderEl, this.#katexOptions);
			this.#mathRenderEl.classList.remove('parse-error');
			this.dom.setAttribute('title', '');
		} catch (err) {
			this.#mathRenderEl.classList.add('parse-error');
			this.dom.setAttribute('title', (err as any).message);
		}
	}

	dispatchInner(tr: Transaction) {
		if (!this.#innerView) return;
		const { state, transactions } = this.#innerView.state.applyTransaction(tr);
		this.#innerView.updateState(state);

		if (!tr.getMeta('fromOutside')) {
			const tr = this.#outerView.state.tr;
			const offsetMap = StepMap.offset(this.#getPos()! + 1);

			for (let i = 0; i < transactions.length; i++) {
				const steps = transactions[i].steps;

				for (let j = 0; j < steps.length; j++) {
					const mapped = steps[j].map(offsetMap);
					if (!mapped) throw Error('step discarded!');
					tr.step(mapped);
				}
			}
			if (tr.docChanged) this.#outerView.dispatch(tr);
		}
	}

	openEditor() {
		if (this.#innerView) {
			console.warn('Math editor already open');
		}

		this.#innerView = new EditorView(this.#mathSrcEl!, {
			state: EditorState.create({
				doc: this.#node,
				plugins: [
					keymap({
						Tab: (state, dispatch) => {
							if (dispatch) {
								dispatch(state.tr.insertText('\t'));
							}
							return true;
						},
						Backspace: chainCommands(deleteSelection, (state) => {
							if (!state.selection.empty) return false;
							if (this.#node.textContent.length > 0) return false;
							this.#outerView.dispatch(this.#outerView.state.tr.insertText(''));
							this.#outerView.focus();
							return true;
						}),
						'Mod-Backspace': () => {
							this.#outerView.dispatch(this.#outerView.state.tr.insertText(''));
							this.#outerView.focus();
							return true;
						},
						Enter: chainCommands(
							newlineInCode,
							collapseMathCommand(this.#outerView, 1, false)
						),
						'Mod-Enter': chainCommands(
							collapseMathCommand(this.#outerView, 1, false),
							(state) => {
								if (!state.selection.empty) return false;

								const view = this.#outerView;
								const node = view.state.schema.nodes.paragraph.create();
								const tr = view.state.tr.replaceSelectionWith(node);
								view.dispatch(tr);

								return true;
							}
						),
						ArrowLeft: collapseMathCommand(this.#outerView, -1, true),
						ArrowRight: collapseMathCommand(this.#outerView, 1, true),
						ArrowUp: collapseMathCommand(this.#outerView, -1, true),
						ArrowDown: collapseMathCommand(this.#outerView, 1, true)
					})
				]
			}),
			dispatchTransaction: this.dispatchInner.bind(this)
		});

		this.#innerView.focus();

		const innerState = this.#innerView.state;
		let prevCursorPos = this.#mathPluginKey.getState(this.#outerView.state)?.prevCursorPos;

		if (prevCursorPos === undefined) {
			console.warn('Unable to get previous cursor position');
		}
		prevCursorPos = prevCursorPos || 0;

		const innerPos = prevCursorPos <= this.#getPos()! ? 0 : this.#node.nodeSize - 2;
		this.#innerView.dispatch(
			innerState.tr.setSelection(TextSelection.create(innerState.doc, innerPos))
		);

		this.#isEditing = true;
	}

	closeEditor(render = true) {
		if (this.#innerView) {
			this.#innerView.destroy();
			this.#innerView = undefined;
		}
		if (render) this.renderMath();
		this.#isEditing = false;
	}
}

export function createMathView(displayMode: boolean): NodeViewConstructor {
	return (node, view, getPos) => {
		const pluginState = MATH_PLUGIN_KEY.getState(view.state);

		if (!pluginState) {
			throw new Error('Math plugin is not initialized');
		}

		const katexOptions: KatexOptions = {
			displayMode,
			macros: pluginState.macros
		};

		return new MathView(node, view, getPos, { katexOptions }, MATH_PLUGIN_KEY);
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
				prevCursorPos: oldState.selection.from
			};
		}
	},
	props: {
		nodeViews: {
			math_inline: createMathView(false),
			math_display: createMathView(true)
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

export function backspaceMathCommand(): Command {
	return (state, dispatch) => {
		const { $from } = state.selection;

		if (dispatch) {
			if ($from.nodeBefore?.type.name === 'math_inline') {
				const index = $from.index($from.depth);
				const $beforePos = state.doc.resolve($from.posAtIndex(index - 1));

				dispatch(state.tr.setSelection(new NodeSelection($beforePos)));
			} else if ($from.parent.type.name === 'math_display') {
				const index = $from.index($from.depth - 1);
				const $beforePos = state.doc.resolve($from.posAtIndex(index, $from.depth - 1));

				dispatch(state.tr.setSelection(new NodeSelection($beforePos)));
			}
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
