import type { Component } from 'svelte';
import type { PageLoad } from './$types';

type Data = {
  content: Component | null;
  metadata: Record<string, any> | null;
  slug: string;
};
export const load: PageLoad = async ({ params }): Promise<Data> => {
  try {
    const page = await import(`$lib/refresher/${params.slug}.svx`);
    return {
      content: page.default,
      metadata: page.metadata,
      slug: params.slug
    };
  } catch (err) {}

  return {
    content: null,
    metadata: null,
    slug: params.slug
  };
};
