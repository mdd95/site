import { Context } from '../utils/context.js';
import type { BindState } from '../utils/reactivity.svelte.js';

const useAnchorName = (() => {
  let count = 0;
  return () => `--anchor-${++count}`;
})();

type PopoverStateProps = {
  open: BindState<boolean>;
};
export class PopoverState {
  anchorName = useAnchorName();
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
