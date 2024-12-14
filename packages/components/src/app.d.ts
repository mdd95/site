// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface Window {
    themeMode: import('$lib/theme.svelte').ThemeMode;
    themeColors: import('$lib/theme.svelte').ThemeColors | null;
  }
}

export {};
