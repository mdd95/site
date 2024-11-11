<script lang="ts">
	import { createEditor, type LexicalEditor } from 'lexical';
	import { registerRichText } from '@lexical/rich-text';
	import { mergeRegister } from '@lexical/utils';
	import { bindFormattingToState } from './utils.js';
	import type { FormattingState } from './types.js';

	let ref: HTMLElement;
	let editor: LexicalEditor;

	let formatting: FormattingState = $state({
		bold: false,
		code: false,
		highlight: false,
		italic: false,
		strikethrough: false,
		subscript: false,
		superscript: false,
		underline: false
	});

	$effect(() => {
		editor = createEditor({
			namespace: 'LexicalEditor',
			nodes: [],
			onError: (err) => {
				throw err;
			}
		});
		editor.setRootElement(ref);
		return mergeRegister(
			registerRichText(editor),
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					bindFormattingToState(formatting);
				});
			})
		);
	});
</script>

<div bind:this={ref} contenteditable></div>
