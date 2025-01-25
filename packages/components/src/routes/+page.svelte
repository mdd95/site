<script lang="ts">
  import '$lib/app.css';
  import { theme, Theme } from '$lib/theme/index.js';
</script>

<Theme />

<select bind:value={theme.mode}>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="system">System</option>
</select>
