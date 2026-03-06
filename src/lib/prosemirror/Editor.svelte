<script lang="ts">
	import { onMount } from 'svelte';
	import { pcBaseKeymap, toggleMark } from 'prosemirror-commands';
	import { history, redo, undo } from 'prosemirror-history';
	import { keymap } from 'prosemirror-keymap';
	import { DOMParser } from 'prosemirror-model';
	import { schema } from 'prosemirror-schema-basic';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import 'prosemirror-view/style/prosemirror.css';
	import type { Plugin } from 'prosemirror-state';
	import type { EditorPlugin } from './plugins/types.js';

	type Props = {
		content?: string;
		plugins?: Array<EditorPlugin>;
	};
	let { content = $bindable(), plugins = [] }: Props = $props();

	let editorEl: HTMLElement;

	onMount(() => {
		let editorSchema = schema;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let editorPlugins: Array<Plugin<any>> = [];

		if (plugins) {
			editorSchema = plugins.reduce(
				(schema, plugin) => plugin.applySchema?.(schema) ?? schema,
				schema
			);
			editorPlugins = plugins.flatMap((plugin) => plugin.applyPlugins?.(editorSchema) ?? []);
		}

		let editor = new EditorView(editorEl, {
			state: EditorState.create({
				doc: DOMParser.fromSchema(editorSchema).parse(
					new globalThis.DOMParser().parseFromString(content ?? '', 'text/html')
				),
				plugins: [
					history(),
					keymap({
						...pcBaseKeymap,
						'Mod-b': toggleMark(editorSchema.marks.strong),
						'Mod-i': toggleMark(editorSchema.marks.em),
						'Mod-z': undo,
						'Mod-y': redo,
					}),
					...editorPlugins,
				],
			}),
		});

		return () => {
			editor.destroy();
		};
	});
</script>

<div bind:this={editorEl}></div>

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
