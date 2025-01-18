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

export function bindRef(getId: Getter<string>, onRefChange: VoidFn<HTMLElement | null>): void {
  $effect(() => {
    const id = getId();
    untrack(() => {
      const node = document.getElementById(id);
      onRefChange?.(node);
    });
    return () => {
      onRefChange?.(null);
    };
  });
}
