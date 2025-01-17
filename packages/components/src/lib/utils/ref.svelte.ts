import { watch } from './watch.svelte.js';
import type { Wrapped } from './wrap.svelte.js';

export type ApplyToRefProps = {
  id: Wrapped<string>;
  ref: Wrapped<HTMLElement | null>;
  onRefChange?: (node: HTMLElement | null) => void;
  getRootNode?: () => Document | ShadowRoot | undefined;
};
export function applyToRef({ id, ref, onRefChange, getRootNode }: ApplyToRefProps) {
  watch(
    () => id.current,
    (id) => {
      const rootNode = getRootNode?.() || document;
      const node = rootNode.getElementById(id);
      ref.current = node ? node : null;
      onRefChange?.(node);

      return () => {
        ref.current = null;
        onRefChange?.(null);
      };
    }
  );
}
