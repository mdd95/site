import type { Component } from 'svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({
  params
}): Promise<{
  content: Component | null;
  metadata: Record<string, unknown> | null;
  slug: string;
}> => {
  try {
    const page = await import(`$lib/refresher/${params.slug}.svx`);
    return {
      slug: params.slug,
      content: page.default,
      metadata: page.metadata
    };
  } catch (err) {}

  return {
    slug: params.slug,
    content: null,
    metadata: null
  };
};
