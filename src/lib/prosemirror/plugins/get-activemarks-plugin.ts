import { Plugin } from 'prosemirror-state';
import { schema } from 'prosemirror-schema-basic';
import type { ActiveMarks } from './get-activemarks-plugin.svelte.js';

function isUndefined<T>(value: T | undefined): value is undefined {
	return value === undefined;
}

export function getActiveMarksPlugin(marks: ActiveMarks | undefined) {
	return new Plugin({
		view(view) {
			return {
				update(view, prevState) {
					if (marks === undefined) return;

					const { from, $from, to, empty } = view.state.selection;
					if (empty) {
						marks.strong = !isUndefined(
							schema.marks.strong.isInSet(view.state.storedMarks || $from.marks())
						);
						marks.em = !isUndefined(
							schema.marks.em.isInSet(view.state.storedMarks || $from.marks())
						);
					} else {
						marks.strong = view.state.doc.rangeHasMark(from, to, schema.marks.strong);
						marks.em = view.state.doc.rangeHasMark(from, to, schema.marks.em);
					}
				}
			};
		}
	});
}
