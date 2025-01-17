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
import type { HTMLButtonAttributes } from 'svelte/elements';

export type PopoverElementAttributes = HTMLButtonAttributes;
export type PopoverTriggerStateProps = PopoverBaseStateProps<PopoverElementAttributes>;
export class PopoverTriggerState extends PopoverBaseState<PopoverElementAttributes> {
  constructor(props: PopoverTriggerStateProps, parentState: PopoverState) {
    super(props, parentState);
    applyToRef({
      id: wrap(() => this.id),
      ref: wrap(
        () => this.parentState.triggerNode,
        (value) => {
          this.parentState.triggerNode = value;
        }
      )
    });
  }
  props = $derived.by(() => {
    const { onclick, style, ...restProps } = this.restProps;
    return {
      id: this.id,
      popovertarget: this.parentState.contentNode?.id,
      popovertargetaction: 'toggle',
      onclick: (e) => {
        if (onclick) onclick(e);
        if (!e.defaultPrevented) {
          e.preventDefault();
          this.parentState.contentNode?.togglePopover();
        }
      },
      style:
        toStyle({
          anchorName: this.parentState.anchorName
        }) + (style || ''),
      ...restProps
    } satisfies PopoverElementAttributes;
  });
}

export const popoverTrigger = new Context<PopoverTriggerState>('popover-trigger');
export function usePopoverTrigger(props: PopoverTriggerStateProps) {
  return popoverTrigger.set(new PopoverTriggerState(props, popover.get()));
}
