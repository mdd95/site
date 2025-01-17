import { untrack } from 'svelte';
import type { Getter, Setter, VoidFn } from './types.js';

export type BindState<T> = { current: T };

export function bind<T>(getter: Getter<T>, setter?: Setter<T>): BindState<T> {
  return {
    get current() {
      return getter();
    },
    set current(v) {
      setter?.(v);
    }
  };
}

export function bindRef(
  getId: Getter<string>,
  ref: BindState<HTMLElement | null>,
  getRoot: Getter<Document | ShadowRoot> | undefined = undefined,
  onRefChange: VoidFn<HTMLElement | null> | undefined = undefined
): void {
  $effect(() => {
    const id = getId();
    untrack(() => {
      const root = getRoot?.() ?? document;
      const node = root.getElementById(id);
      ref.current = node;
      onRefChange?.(node);
    });
    return () => {
      ref.current = null;
      onRefChange?.(null);
    };
  });
}
