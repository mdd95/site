import { Context } from '../utils/context.js';
import { useId } from '../utils/id.js';
import type { BindState } from '../utils/reactivity.svelte.js';

type PopoverStateProps = {
  open: BindState<boolean>;
};
export class PopoverState {
  anchorName = useId('--anchor');
  open: PopoverStateProps['open'];
  triggerNode = $state<HTMLElement | null>(null);
  contentNode = $state<HTMLElement | null>(null);

  constructor(props: PopoverStateProps) {
    this.open = props.open;
  }
}

export const popover = new Context<PopoverState>('popover');
export function usePopover(props: PopoverStateProps) {
  return popover.set(new PopoverState(props));
}

export type PopoverBaseStateProps<T> = {
  id: string;
  restProps: T;
};
export abstract class PopoverBaseState<T> {
  id: string;
  restProps: T;
  parentState: PopoverState;

  constructor(props: PopoverBaseStateProps<T>, parentState: PopoverState) {
    this.id = props.id;
    this.restProps = props.restProps;
    this.parentState = parentState;
  }
}
