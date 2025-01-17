export const useId = (() => {
  let count = 0;
  return () => `id-${++count}`;
})();
