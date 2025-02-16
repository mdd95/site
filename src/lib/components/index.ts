import * as BitsUI from 'bits-ui';
import DropdownMenuContent from './dropdown-menu/dropdown-menu-content.svelte';

const DropdownMenu = {
  Content: DropdownMenuContent,
  Root: BitsUI.DropdownMenu.Root,
  Trigger: BitsUI.DropdownMenu.Trigger
};

export { DropdownMenu };
export { default as Button } from './button.svelte';
export { default as ThemeSelect } from './theme-select.svelte';
