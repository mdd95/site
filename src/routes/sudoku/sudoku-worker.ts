import { sudoku_generator } from './sudoku-core.js';

const sudoku = sudoku_generator();

self.addEventListener('message', () => {
	self.postMessage(sudoku.generate());
});
