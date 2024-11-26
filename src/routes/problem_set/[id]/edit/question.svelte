<script lang="ts">
	import { DOMParser, Schema } from 'prosemirror-model';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import {
		chainCommands,
		deleteSelection,
		joinBackward,
		pcBaseKeymap,
		selectNodeBackward,
		toggleMark
	} from 'prosemirror-commands';
	import { history, redo, undo } from 'prosemirror-history';
	import { inputRules } from 'prosemirror-inputrules';
	import { keymap } from 'prosemirror-keymap';
	import { schema } from 'prosemirror-schema-basic';
	import {
		backspaceMath,
		insertMathCommand,
		makeMathDisplayInputRule,
		makeMathInlineInputRule,
		mathSchemaSpec,
		mathPlugin,
		REGEX_MATH_DISPLAY,
		REGEX_MATH_INLINE
	} from '@/prosemirror/plugins/math.js';
	import { bindHTMLContentToState } from '@/prosemirror/plugins/bindToState.js';
	import { placeholder } from '@/prosemirror/plugins/placeholder.js';

	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		htmlContent: { value: string };
	};

	let { children, htmlContent }: Props = $props();

	let content: HTMLElement;
	let editor: HTMLElement;

	let state: EditorState;
	let view: EditorView;

	$effect(() => {
		const extendedSchema = new Schema({
			nodes: schema.spec.nodes
				.addToEnd('math_inline', mathSchemaSpec.nodes.math_inline)
				.addToEnd('math_display', mathSchemaSpec.nodes.math_display),
			marks: schema.spec.marks
		});

		const backspaceCommand = chainCommands(
			backspaceMath,
			deleteSelection,
			joinBackward,
			selectNodeBackward
		);

		state = EditorState.create({
			doc: DOMParser.fromSchema(extendedSchema).parse(content),
			schema: extendedSchema,
			plugins: [
				keymap({
					...pcBaseKeymap,
					'Mod-b': toggleMark(extendedSchema.marks.strong),
					'Mod-i': toggleMark(extendedSchema.marks.em),
					'Mod-z': undo,
					'Mod-y': redo,
					Backspace: backspaceCommand,
					'Mod-Backspace': backspaceCommand,
					'Shift-Backspace': backspaceCommand,
					'Alt-=': insertMathCommand(extendedSchema.nodes.math_inline)
				}),
				history(),
				mathPlugin,
				inputRules({
					rules: [
						makeMathInlineInputRule(
							REGEX_MATH_INLINE,
							extendedSchema.nodes.math_inline
						),
						makeMathDisplayInputRule(
							REGEX_MATH_DISPLAY,
							extendedSchema.nodes.math_display
						)
					]
				}),
				bindHTMLContentToState(extendedSchema, htmlContent),
				placeholder('Write your question here...')
			]
		});
		view = new EditorView(editor, { state });
	});
</script>

<div bind:this={content} hidden>
	{@render children?.()}
</div>
<div bind:this={editor}></div>
