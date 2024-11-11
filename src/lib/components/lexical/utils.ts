import { $getSelection, $isRangeSelection } from 'lexical';
import type { FormattingState } from './types.js';

export function bindFormattingToState(state: FormattingState) {
	const selection = $getSelection();
	if ($isRangeSelection(selection)) {
		state.code = selection.hasFormat('code');
		state.bold = selection.hasFormat('bold');
		state.highlight = selection.hasFormat('highlight');
		state.italic = selection.hasFormat('italic');
		state.strikethrough = selection.hasFormat('strikethrough');
		state.subscript = selection.hasFormat('subscript');
		state.superscript = selection.hasFormat('superscript');
		state.underline = selection.hasFormat('underline');
	}
}
