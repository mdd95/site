<script lang="ts">
	import { EditorState, Plugin } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { schema } from 'prosemirror-schema-basic';
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap, toggleMark } from 'prosemirror-commands';
	import { history, redo, undo } from 'prosemirror-history';
	import type { Schema } from 'prosemirror-model';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import 'prosemirror-view/style/prosemirror.css';

	type Props = HTMLAttributes<HTMLDivElement> & {
		ref?: HTMLDivElement;
		plugins?: (params: { schema: Schema }) => Array<Plugin>;
		children?: Snippet;
	};

	const noop = () => [];
	let { ref = $bindable(), plugins = noop, children, ...restProps }: Props = $props();

	$effect(() => {
		const state = EditorState.create({
			schema,
			plugins: [
				keymap({
					...baseKeymap,
					'Mod-b': toggleMark(schema.marks.strong),
					'Mod-i': toggleMark(schema.marks.em),
					'Mod-z': undo,
					'Mod-y': redo
				}),
				history(),
				...plugins({ schema })
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

<div bind:this={ref} {...restProps}>
	{@render children?.()}
</div>
