<script lang="ts">
	import { EditorState, Plugin } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { marks, nodes } from 'prosemirror-schema-basic';
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap, toggleMark } from 'prosemirror-commands';
	import { history, redo, undo } from 'prosemirror-history';
	import { DOMParser, Schema, type MarkSpec, type NodeSpec } from 'prosemirror-model';
	import type { HTMLAttributes } from 'svelte/elements';
	import 'prosemirror-view/style/prosemirror.css';

	type Props = HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement;
		content?: string;
		extend?: {
			nodes?: Record<string, NodeSpec>;
			marks?: Record<string, MarkSpec>;
		};
		plugins?: (params: { schema: Schema }) => Array<Plugin>;
	};

	const noop = () => [];
	let {
		ref = $bindable(),
		content,
		extend,
		plugins = noop,
		children,
		...restProps
	}: Props = $props();
	let initial: HTMLDivElement;

	$effect(() => {
		const currentSchema = new Schema({
			nodes: { ...nodes, ...(extend?.nodes || {}) },
			marks: { ...marks, ...(extend?.marks || {}) }
		});

		const state = EditorState.create({
			doc: DOMParser.fromSchema(currentSchema).parse(initial),
			schema: currentSchema,
			plugins: [
				keymap({
					...baseKeymap,
					'Mod-b': toggleMark(currentSchema.marks.strong),
					'Mod-i': toggleMark(currentSchema.marks.em),
					'Mod-z': undo,
					'Mod-y': redo
				}),
				history(),
				...plugins({ schema: currentSchema })
			]
		});
		const view = new EditorView(ref!, {
			state
		});
		return () => {
			view.destroy();
		};
	});
</script>

<div bind:this={initial} hidden>{@html content}</div>
<div bind:this={ref} {...restProps}></div>

<style>
	:global(.ProseMirror:focus) {
		outline: none;
	}
</style>
