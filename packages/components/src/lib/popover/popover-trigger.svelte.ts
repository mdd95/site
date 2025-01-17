import {
  popover,
  PopoverBaseState,
  type PopoverState,
  type PopoverBaseStateProps
} from './popover.svelte.js';
import { Context } from '../utils/context.js';
import { prependStyle } from '../utils/style.js';
import { bind, bindRef } from '../utils/reactivity.svelte.js';
import type { HTMLButtonAttributes } from 'svelte/elements';

export type PopoverElementAttributes = HTMLButtonAttributes;
export type PopoverTriggerStateProps = PopoverBaseStateProps<PopoverElementAttributes>;
export class PopoverTriggerState extends PopoverBaseState<PopoverElementAttributes> {
  constructor(props: PopoverTriggerStateProps, parentState: PopoverState) {
    super(props, parentState);
    bindRef(
      () => this.id,
      bind(
        () => this.parentState.triggerNode,
        (v) => (this.parentState.triggerNode = v)
      )
    );
  }
  props = $derived.by(() => {
    const { style, ...restProps } = this.restProps;
    return {
      id: this.id,
      popovertarget: this.parentState.contentNode?.id,
      style: prependStyle(style, {
        'anchor-name': this.parentState.anchorName
      }),
      ...restProps
    } satisfies PopoverElementAttributes;
  });
}

export const popoverTrigger = new Context<PopoverTriggerState>('popover-trigger');
export function usePopoverTrigger(props: PopoverTriggerStateProps) {
  return popoverTrigger.set(new PopoverTriggerState(props, popover.get()));
}
