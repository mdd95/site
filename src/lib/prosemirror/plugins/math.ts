import katex from 'katex';
import { chainCommands, deleteSelection, newlineInCode } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import {
	EditorState,
	Plugin,
	PluginKey,
	TextSelection,
	Transaction,
	type PluginSpec,
} from 'prosemirror-state';
import { StepMap } from 'prosemirror-transform';
import { EditorView, type NodeView, type NodeViewConstructor } from 'prosemirror-view';
import type { Node } from 'prosemirror-model';
import type { KatexOptions } from 'katex';
import './math.css';
import 'katex/dist/katex.css';
import { collapseMath } from './math-commands';

interface MathPluginState {
	macros: Record<string, string>;
	prevCursorPos: number;
}
interface MathViewOptions {
	tagName?: string;
	katexOptions?: KatexOptions;
}

const mathPluginKey = new PluginKey<MathPluginState>('prosemirror-math');

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
		apply(_, value, oldState) {
			return {
				macros: value.macros,
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

export const mathPlugin = new Plugin(mathPluginSpec);
