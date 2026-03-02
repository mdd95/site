<script lang="ts">
	import { DOMParser } from 'prosemirror-model';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { mathPlugin } from './plugins/math.js';
	import { editorInputRules } from './input-rules.js';
	import { editorKeymap } from './keymap.js';
	import { editorSchema } from './schema.js';
	import 'prosemirror-view/style/prosemirror.css';

	type Props = {
		content?: string;
	};
	let { content = $bindable() }: Props = $props();

	let editor: HTMLElement;

	$effect(() => {
		new EditorView(editor, {
			state: EditorState.create({
				doc: DOMParser.fromSchema(editorSchema).parse(
					new globalThis.DOMParser().parseFromString(content ?? '', 'text/html')
				),
				schema: editorSchema,
				plugins: [mathPlugin, editorKeymap, editorInputRules],
			}),
		});
	});
</script>

<div bind:this={editor}></div>

<style>
	div {
		padding: 0.5rem 1rem;

		&:focus-within {
			outline: 2px solid #000;
		}

		& :global(.ProseMirror) {
			outline: none;
		}
	}
</style>
