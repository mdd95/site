<script lang="ts">
	import { create, records } from './page.remote';
</script>

<form {...create}>
	<input {...create.fields.longUrl.as('url')} placeholder="Long URL" />
	<input {...create.fields.slug.as('text')} placeholder="Slug" />
	<button type="submit">Create</button>
</form>

<pre>
	{JSON.stringify(await records(), null, 2)}
</pre>

<style>
</style>
