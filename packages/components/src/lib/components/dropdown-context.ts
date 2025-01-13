import { getContext, setContext } from 'svelte';

let count = 0;

function useAnchorId() {
  return `--anchor-${++count}`;
}

const key = Symbol('dropdown-anchor');

export function createAnchorId(): string {
  return setContext(key, useAnchorId());
}

export function getAnchorId(): string {
  return getContext(key);
}
