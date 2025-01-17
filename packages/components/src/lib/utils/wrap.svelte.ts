import type { Getter, Setter } from './types.js';

export type Wrapped<T> = { current: T };

export function wrap<T>(getter: Getter<T>, setter?: Setter<T>): Wrapped<T> {
  const current = $derived.by(getter);

  if (setter) {
    return {
      get current() {
        return current;
      },
      set current(value: T) {
        setter(value);
      }
    };
  }
  return {
    get current() {
      return getter();
    }
  };
}
