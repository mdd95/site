<script lang="ts">
	import { DOMParser } from 'prosemirror-model';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { pcBaseKeymap } from 'prosemirror-commands';
	import { keymap } from 'prosemirror-keymap';
	import { schema } from 'prosemirror-schema-basic';
	import { bindHTMLContentToState } from '@/prosemirror/plugins/bindToState.js';

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
		state = EditorState.create({
			doc: DOMParser.fromSchema(schema).parse(content),
			schema,
			plugins: [keymap(pcBaseKeymap), bindHTMLContentToState(schema, htmlContent)]
		});
		view = new EditorView(editor, { state });
	});
</script>

<div bind:this={content} hidden>
	{@render children?.()}
</div>
<div bind:this={editor}></div>
