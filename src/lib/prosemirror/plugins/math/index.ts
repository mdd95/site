import { chainCommands, deleteSelection, newlineInCode } from 'prosemirror-commands';
import { InputRule, inputRules } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import {
	EditorState,
	NodeSelection,
	Plugin,
	PluginKey,
	TextSelection,
	Transaction,
} from 'prosemirror-state';
import { StepMap } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import katex from 'katex';
import 'katex/dist/katex.css';
import './styles.css';
import type { MarkSpec, Node, NodeSpec, NodeType } from 'prosemirror-model';
import type { Command, PluginSpec } from 'prosemirror-state';
import type { NodeView, NodeViewConstructor } from 'prosemirror-view';
import type { KatexOptions } from 'katex';
import type { EditorPlugin } from '../types.js';

interface MathPluginState {
	macros: Record<string, string>;
	prevCursorPos: number;
}
interface MathViewOptions {
	tagName?: string;
	katexOptions?: KatexOptions;
}

const mathPluginKey = new PluginKey<MathPluginState>('prosemirror-math-plugin');

export class MathView implements NodeView {
	#node: Node;
	#tagName: string;
	#katexOptions: KatexOptions;
	#getCursorPos: () => number | undefined;
	#mathPluginKey: PluginKey<MathPluginState>;

	#outerView: EditorView;
	#innerView: EditorView | null = null;

	#mathRenderEl: HTMLElement | null;
	#mathSrcEl: HTMLElement | null;

	dom: HTMLElement;
	#isEditing: boolean;

	constructor(
		node: Node,
		view: EditorView,
		options: MathViewOptions = {},
		getCursorPos: () => number | undefined,
		mathPluginKey: PluginKey<MathPluginState>
	) {
		const defaultKatexOptions: KatexOptions = {
			globalGroup: true,
			throwOnError: false,
		};

		this.#node = node;
		this.#outerView = view;
		this.#tagName = options.tagName ?? this.#node.type.name.replace('_', '-');
		this.#katexOptions = { ...defaultKatexOptions, ...options.katexOptions };
		this.#getCursorPos = getCursorPos;
		this.#mathPluginKey = mathPluginKey;

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

		this.dom.addEventListener('click', this.focusNode.bind(this));
		this.renderMath();
	}

	closeEditor(render = true) {
		if (this.#innerView) {
			this.#innerView.destroy();
			this.#innerView = null;
		}
		if (render) this.renderMath();
		this.#isEditing = false;
	}

	openEditor() {
		if (this.#innerView) {
			console.warn('Math editor was already opened!');
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
							collapseMath(this.#outerView, 1, false)
						),
						'Mod-Enter': chainCommands(
							collapseMath(this.#outerView, 1, false),
							(state) => {
								if (!state.selection.empty) return false;

								const view = this.#outerView;
								const node = view.state.schema.nodes.paragraph.create();
								const tr = view.state.tr.replaceSelectionWith(node);
								view.dispatch(tr);

								return true;
							}
						),
						ArrowLeft: collapseMath(this.#outerView, -1, true),
						ArrowRight: collapseMath(this.#outerView, 1, true),
						ArrowUp: collapseMath(this.#outerView, -1, true),
						ArrowDown: collapseMath(this.#outerView, 1, true),
					}),
				],
			}),
			dispatchTransaction: this.dispatchInner.bind(this),
		});

		this.#innerView.focus();

		const innerState = this.#innerView.state;
		let prevCursorPos = this.#mathPluginKey.getState(this.#outerView.state)?.prevCursorPos;

		if (prevCursorPos === undefined) {
			console.warn('Unable to get previous cursor position');
		}
		prevCursorPos = prevCursorPos || 0;

		const innerPos = prevCursorPos <= this.#getCursorPos()! ? 0 : this.#node.nodeSize - 2;
		this.#innerView.dispatch(
			innerState.tr.setSelection(TextSelection.create(innerState.doc, innerPos))
		);

		this.#isEditing = true;
	}

	destroy() {
		this.closeEditor();
		if (this.#mathRenderEl) {
			this.#mathRenderEl.remove();
			this.#mathRenderEl = null;
		}
		if (this.#mathSrcEl) {
			this.#mathSrcEl.remove();
			this.#mathSrcEl = null;
		}
		this.dom.remove();
	}

	update(node: Node) {
		if (!node.sameMarkup(this.#node)) return false;
		this.#node = node;

		if (this.#innerView) {
			const state = this.#innerView.state;
			const start = node.content.findDiffStart(state.doc.content);
			if (start != null) {
				const diff = node.content.findDiffEnd(state.doc.content);
				if (diff) {
					let { a, b } = diff;
					const overlap = start - Math.min(a, b);
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
		if (!this.#isEditing) this.renderMath();
		return true;
	}

	focusNode() {
		if (this.#innerView && this.#outerView.hasFocus()) {
			this.#innerView.focus();
		}
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

	stopEvent(event: Event) {
		return (
			event.target !== undefined &&
			this.#innerView !== null &&
			this.#innerView.dom.contains(event.target as globalThis.Node)
		);
	}

	ignoreMutation() {
		return true;
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
		}
		this.dom.classList.remove('math-empty');

		try {
			katex.render(tex, this.#mathRenderEl, this.#katexOptions);
			this.#mathRenderEl.classList.remove('parse-error');
			this.dom.setAttribute('title', '');
		} catch (error) {
			this.#mathRenderEl.classList.add('parse-error');
			console.error(error);
			// this.dom.setAttribute('title', error.message);
		}
	}

	dispatchInner(tr: Transaction) {
		if (!this.#innerView) return;
		const { state, transactions } = this.#innerView.state.applyTransaction(tr);
		this.#innerView.updateState(state);

		if (!tr.getMeta('fromOutside')) {
			const outsideTr = this.#outerView.state.tr;
			const offsetMap = StepMap.offset(this.#getCursorPos()! + 1);
			for (let i = 0; i < transactions.length; i++) {
				const steps = transactions[i].steps;
				for (let j = 0; j < steps.length; j++) {
					const mapped = steps[j].map(offsetMap);
					if (!mapped) throw new Error('Step discarded!');
					outsideTr.step(mapped);
				}
			}
			if (outsideTr.docChanged) this.#outerView.dispatch(outsideTr);
		}
	}
}

function insertMath(mathNodeType: NodeType, initialText = ''): Command {
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

function collapseMath(
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

const backspaceMath: Command = (state, dispatch) => {
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

function createMathView(displayMode: boolean): NodeViewConstructor {
	return (node, view, getCursorPos) => {
		const pluginState = mathPluginKey.getState(view.state);

		if (!pluginState) {
			throw new Error('Math plugin is not initialized');
		}
		const katexOptions: KatexOptions = {
			displayMode,
			macros: pluginState.macros,
		};

		return new MathView(node, view, { katexOptions }, getCursorPos, mathPluginKey);
	};
}

const mathPluginSpec: PluginSpec<MathPluginState> = {
	key: mathPluginKey,
	state: {
		init() {
			return { macros: {}, prevCursorPos: 0 };
		},
		apply(tr, pluginState, oldState) {
			return {
				macros: pluginState.macros,
				prevCursorPos: oldState.selection.from,
			};
		},
	},
	props: {
		nodeViews: {
			math_inline: createMathView(false),
			math_display: createMathView(true),
		},
	},
};

const REGEX_MATH_INLINE = /\$([^$]+)\$/;
const REGEX_MATH_DISPLAY = /\$\$\s+$/;

function mathInlineInputRule(nodeType: NodeType, pattern?: RegExp) {
	return new InputRule(pattern ?? REGEX_MATH_INLINE, (state, match, start, end) => {
		const docStart = state.doc.resolve(start);
		const docEnd = state.doc.resolve(end);
		if (!docStart.parent.canReplaceWith(docStart.index(), docEnd.index(), nodeType)) {
			return null;
		}
		return state.tr.replaceRangeWith(
			start,
			end,
			nodeType.create({}, nodeType.schema.text(match[1]))
		);
	});
}

function mathDisplayInputRule(nodeType: NodeType, pattern?: RegExp) {
	return new InputRule(pattern ?? REGEX_MATH_DISPLAY, (state, match, start, end) => {
		const docStart = state.doc.resolve(start);
		if (
			!docStart.node(-1).canReplaceWith(docStart.index(-1), docStart.indexAfter(-1), nodeType)
		) {
			return null;
		}
		const tr = state.tr.delete(start, end).setBlockType(start, start, nodeType, {});
		return tr.setSelection(NodeSelection.create(tr.doc, tr.mapping.map(docStart.pos - 1)));
	});
}

type SchemaSpec = {
	nodes: Record<string, NodeSpec>;
	marks: Record<string, MarkSpec>;
};

const mathSchemaSpec: SchemaSpec = {
	nodes: {
		math_inline: {
			group: 'inline math',
			content: 'text*',
			inline: true,
			atom: true,
			toDOM: () => ['math-inline', { class: 'math-node' }, 0],
			parseDOM: [{ tag: 'math-inline' }],
		},
		math_display: {
			group: 'block math',
			content: 'text*',
			inline: false,
			atom: true,
			code: true,
			toDOM: () => ['math-display', { class: 'math-node' }, 0],
			parseDOM: [{ tag: 'math-display' }],
		},
	},
	marks: {},
};

export const math: EditorPlugin = {
	applySchema: (schema) => {
		return new Schema({
			nodes: schema.spec.nodes
				.addToEnd('math_inline', mathSchemaSpec.nodes.math_inline)
				.addToEnd('math_display', mathSchemaSpec.nodes.math_display),
			marks: schema.spec.marks,
		});
	},
	applyPlugins: (schema) => {
		return [
			new Plugin(mathPluginSpec),
			inputRules({
				rules: [
					mathInlineInputRule(schema.nodes.math_inline),
					mathDisplayInputRule(schema.nodes.math_display),
				],
			}),
		];
	},
};
