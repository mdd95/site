export const useId = (() => {
  let count = 0;
  return (prefix = 'id') => `${prefix}-${++count}`;
})();
