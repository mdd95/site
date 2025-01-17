import { getContext, hasContext, setContext } from 'svelte';

export class Context<T> {
  readonly #key: symbol;
  readonly #name: string;

  constructor(name: string) {
    this.#key = Symbol(name);
    this.#name = name;
  }

  get key(): symbol {
    return this.#key;
  }

  exists(): boolean {
    return hasContext(this.#key);
  }

  set(context: T): T {
    return setContext(this.#key, context);
  }

  get(): T {
    const context: T | undefined = getContext(this.#key);
    if (!context) {
      throw new Error(`Context "${this.#name}" not found`);
    }
    return context;
  }

  getOr<U>(fallback: U): T | U {
    const context: T | undefined = getContext(this.#key);
    if (!context) {
      return fallback;
    }
    return context;
  }
}
