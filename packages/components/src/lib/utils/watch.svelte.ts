import { untrack } from 'svelte';
import type { Getter, MapperFn } from './types.js';

export function watch<T>(deps: Getter<T>, effect: MapperFn<T, any>) {
  $effect(() => {
    const value = deps();
    const dispose = untrack(() => effect(value));
    return () => {
      if (dispose && typeof dispose === 'function') {
        dispose();
      }
    };
  });
}
