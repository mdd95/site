export function sudoku_generator() {
	const row_mask = new Uint16Array(9);
	const col_mask = new Uint16Array(9);
	const box_mask = new Uint16Array(9);
	const numbers = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);

	let seed = 1 >>> 0;
	function rng() {
		seed ^= (seed << 13) >>> 0;
		seed ^= seed >>> 17;
		seed ^= (seed << 5) >>> 0;
		return seed >>> 0;
	}

	function shuffle(arr: Uint8Array) {
		for (let i = 8; i > 0; i--) {
			const j = rng() % (i + 1);
			const t = arr[i];
			arr[i] = arr[j];
			arr[j] = t;
		}
		return arr;
	}

	function box_index(r: number, c: number) {
		return ((r / 3) | 0) * 3 + ((c / 3) | 0);
	}

	function find_best_cell(grid: Uint8Array) {
		let best_i = -1;
		let best_count = 10;

		for (let i = 0; i < 81; i++) {
			if (grid[i] !== 0) continue;

			const r = (i / 9) | 0;
			const c = i % 9;
			const b = box_index(r, c);

			const mask = row_mask[r] | col_mask[c] | box_mask[b];

			let count = 0;
			for (let n = 1; n <= 9; n++) {
				if (!(mask & (1 << n))) count++;
			}

			if (count < best_count) {
				best_count = count;
				best_i = i;
				if (count === 1) return i;
			}
		}
		return best_i;
	}

	function fill_sudoku(grid: Uint8Array): boolean {
		const idx = find_best_cell(grid);
		if (idx < 0) return true;

		const r = (idx / 9) | 0;
		const c = idx % 9;
		const b = box_index(r, c);
		const used = row_mask[r] | col_mask[c] | box_mask[b];
		shuffle(numbers);

		for (let i = 0; i < 9; i++) {
			const num = numbers[i];
			const bit = 1 << num;

			if (used & bit) continue;

			grid[idx] = num;
			row_mask[r] |= bit;
			col_mask[c] |= bit;
			box_mask[b] |= bit;

			if (fill_sudoku(grid)) return true;

			grid[idx] = 0;
			row_mask[r] &= ~bit;
			col_mask[c] &= ~bit;
			box_mask[b] &= ~bit;
		}

		return false;
	}

	function generate() {
		const grid = new Uint8Array(81);
		row_mask.fill(0);
		col_mask.fill(0);
		box_mask.fill(0);

		fill_sudoku(grid);
		return grid;
	}

	function find_best_cell_flat(
		grid: Uint8Array,
		rm: Uint16Array,
		cm: Uint16Array,
		bm: Uint16Array
	) {
		let bestIdx = -1;
		let bestCnt = 10;

		for (let i = 0; i < 81; i++) {
			if (grid[i] !== 0) continue;

			const r = (i / 9) | 0;
			const c = i % 9;
			const b = box_index(r, c);

			const used = rm[r] | cm[c] | bm[b];
			let cnt = 0;
			for (let n = 1; n <= 9; n++) {
				if (!(used & (1 << n))) cnt++;
			}

			if (cnt < bestCnt) {
				bestCnt = cnt;
				bestIdx = i;
				if (cnt === 1) return i;
			}
		}
		return bestIdx;
	}

	function count_solutions(puzzle: Uint8Array, limit = 2) {
		const grid = new Uint8Array(puzzle);
		const rm = new Uint16Array(9);
		const cm = new Uint16Array(9);
		const bm = new Uint16Array(9);

		for (let i = 0; i < 81; i++) {
			const v = grid[i];
			if (!v) continue;
			const r = (i / 9) | 0;
			const c = i % 9;
			const b = box_index(r, c);
			const bit = 1 << v;
			if (rm[r] & bit || cm[c] & bit || bm[b] & bit) return 0;
			rm[r] |= bit;
			cm[c] |= bit;
			bm[b] |= bit;
		}

		let count = 0;

		function solve() {
			const i = find_best_cell_flat(grid, rm, cm, bm);
			if (i < 0) {
				count++;
				return count < limit;
			}

			const r = (i / 9) | 0;
			const c = i % 9;
			const b = box_index(r, c);
			const used = rm[r] | cm[c] | bm[b];

			for (let num = 1; num <= 9; num++) {
				const bit = 1 << num;
				if (used & bit) continue;

				grid[i] = num;
				rm[r] |= bit;
				cm[c] |= bit;
				bm[b] |= bit;

				if (!solve()) return false;

				grid[i] = 0;
				rm[r] &= ~bit;
				cm[c] &= ~bit;
				bm[b] &= ~bit;
			}
			return true;
		}

		solve();
		return count;
	}

	function generate_puzzle(difficulty = 5) {
		const solution = generate();
		const puzzle = new Uint8Array(solution);

		let removed = 0;
		let attempts = difficulty * 10;

		while (attempts > 0 && removed < 64) {
			const i = rng() % 81;
			if (puzzle[i] === 0) continue;

			const backup = puzzle[i];
			puzzle[i] = 0;

			if (count_solutions(puzzle, 2) !== 1) {
				puzzle[i] = backup;
				attempts--;
			} else {
				removed++;
			}
		}
		return puzzle;
	}

	return { generate: generate_puzzle };
}
