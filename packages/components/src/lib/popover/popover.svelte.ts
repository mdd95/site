import { Context } from '../utils/context.js';
import { useId } from '../utils/id.js';
import { prependStyle } from '../utils/style.js';
import { Bin, bindRef, type BindState } from '../utils/reactivity.svelte.js';

type PopoverStateProps = {
  open: BindState<boolean>;
};
export class PopoverState {
  anchor = useId('--anchor');
  open: PopoverStateProps['open'];
  triggerNode = $state<HTMLElement | null>(null);
  contentNode = $state<HTMLElement | null>(null);

  constructor(props: PopoverStateProps) {
    this.open = props.open;
  }
}

export type PopoverProps = {
  id: string;
  props: Record<string, any>;
};
abstract class PopoverBase {
  _id: PopoverProps['id'];
  _props: PopoverProps['props'];
  parent: PopoverState;

  constructor({ id, props }: PopoverProps, parent: PopoverState) {
    this._id = id;
    this._props = props;
    this.parent = parent;
  }
}

export class PopoverTrigger extends PopoverBase {
  constructor(props: PopoverProps, parent: PopoverState) {
    super(props, parent);

    bindRef(
      () => this._id,
      (v) => (this.parent.triggerNode = v)
    );
  }

  props = $derived.by(() => {
    const { style, ...restProps } = this._props;
    return {
      id: this._id,
      popovertarget: this.parent.contentNode?.id,
      style: prependStyle(style, {
        'anchor-name': this.parent.anchor
      }),
      ...restProps
    } as const;
  });
}

export class PopoverContent extends PopoverBase {
  constructor(props: PopoverProps, parent: PopoverState) {
    super(props, parent);
    const bin = new Bin();

    bindRef(
      () => this._id,
      (v) => {
        this.parent.contentNode = v;

        if (v) {
          const handler = (e: Event) => {
            // @ts-ignore
            this.parent.open.current = e.newState === 'open';
          };
          v.addEventListener('toggle', handler);
          bin.add(() => {
            v.removeEventListener('toggle', handler);
          });
        }
      }
    );
  }

  props = $derived.by(() => {
    const { style, ...restProps } = this._props;
    return {
      id: this._id,
      popover: 'auto',
      style: prependStyle(style, {
        'position-anchor': this.parent.anchor
      }),
      ...restProps
    } as const;
  });
}

export const popover = new Context<PopoverState>('popover');
export const popoverTrigger = new Context<PopoverTrigger>('popover-trigger');
export const popoverContent = new Context<PopoverContent>('popover-content');

export function usePopover(props: PopoverStateProps) {
  return popover.set(new PopoverState(props));
}
export function usePopoverTrigger(props: PopoverProps) {
  return popoverTrigger.set(new PopoverTrigger(props, popover.get()));
}
export function usePopoverContent(props: PopoverProps) {
  return popoverContent.set(new PopoverContent(props, popover.get()));
}
