import {
  popover,
  PopoverBaseState,
  type PopoverState,
  type PopoverBaseStateProps
} from './popover.svelte.js';
import { Context } from '../utils/context.js';
import { applyToRef } from '../utils/ref.svelte.js';
import { toStyle } from '../utils/to-style.js';
import { wrap } from '../utils/wrap.svelte.js';
import type { HTMLAttributes } from 'svelte/elements';

export type PopoverElementAttributes = HTMLAttributes<HTMLDivElement>;
export type PopoverContentStateProps = PopoverBaseStateProps<PopoverElementAttributes>;
export class PopoverContentState extends PopoverBaseState<PopoverElementAttributes> {
  constructor(props: PopoverContentStateProps, parentState: PopoverState) {
    super(props, parentState);
    applyToRef({
      id: wrap(() => this.id),
      ref: wrap(
        () => this.parentState.contentNode,
        (value) => {
          this.parentState.contentNode = value;
        }
      )
    });
  }
  props = $derived.by(() => {
    const { onclick, style, ...restProps } = this.restProps;
    return {
      id: this.id,
      popover: 'auto',
      style:
        toStyle({
          positionAnchor: this.parentState.anchorName,
          positionArea: 'block-end span-inline-end'
        }) + (style || ''),
      ...restProps
    } satisfies PopoverElementAttributes;
  });
}

export const popoverContent = new Context<PopoverContentState>('popover-content');
export function usePopoverContent(props: PopoverContentStateProps) {
  return popoverContent.set(new PopoverContentState(props, popover.get()));
}
