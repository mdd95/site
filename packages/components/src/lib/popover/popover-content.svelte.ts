import {
  popover,
  PopoverBaseState,
  type PopoverState,
  type PopoverBaseStateProps
} from './popover.svelte.js';
import { Context } from '../utils/context.js';
import { bind, bindRef } from '../utils/reactivity.svelte.js';
import { prependStyle } from '../utils/style.js';
import type { HTMLAttributes } from 'svelte/elements';

export type PopoverElementAttributes = HTMLAttributes<HTMLDivElement>;
export type PopoverContentStateProps = PopoverBaseStateProps<PopoverElementAttributes>;
export class PopoverContentState extends PopoverBaseState<PopoverElementAttributes> {
  constructor(props: PopoverContentStateProps, parentState: PopoverState) {
    super(props, parentState);
    bindRef(
      () => this.id,
      bind(
        () => this.parentState.contentNode,
        (v) => (this.parentState.contentNode = v)
      )
    );
  }
  props = $derived.by(() => {
    const { onclick, style, ...restProps } = this.restProps;
    return {
      id: this.id,
      popover: 'auto',
      style: prependStyle(style, {
        'position-anchor': this.parentState.anchorName,
        'position-area': 'block-end span-inline-end'
      }),
      ...restProps
    } satisfies PopoverElementAttributes;
  });
}

export const popoverContent = new Context<PopoverContentState>('popover-content');
export function usePopoverContent(props: PopoverContentStateProps) {
  return popoverContent.set(new PopoverContentState(props, popover.get()));
}
