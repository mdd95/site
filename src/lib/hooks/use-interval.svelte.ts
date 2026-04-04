export function useInterval(callback: () => void, delay: number = 1000) {
	let intervalId: NodeJS.Timeout | null = null;

	$effect(() => {
		intervalId = setInterval(callback, delay);

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});
}
