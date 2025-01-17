export {
  default as Theme,
  setTheme,
  getTheme,
  THEME_CONTEXT_KEY,
  type ThemeMode,
  type ThemeColors
} from './theme.svelte';

import { DropdownMenu } from 'bits-ui';

export const Dropdown = DropdownMenu.Root;
export const DropdownTrigger = DropdownMenu.Trigger;

export { default as Button } from './components/button.svelte';
export { default as Checkbox } from './components/checkbox.svelte';
export { default as Dialog } from './components/dialog.svelte';
export { default as DropdownContent } from './components/dropdown-content.svelte';
export { default as DropdownItem } from './components/dropdown-item.svelte';
export { default as Switch } from './components/switch.svelte';
export { default as UseId } from './components/use-id.svelte';

export * from './popover/index.js';
