<script lang="ts">
  import '$lib/app.css';
  import { theme, ThemeWatcher } from '$lib/theme-watcher/index.js';
</script>

<ThemeWatcher />

<select bind:value={theme.mode}>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="system">System</option>
</select>
