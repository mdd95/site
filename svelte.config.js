import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [vitePreprocess(), mathPreprocess()],

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter()
  }
};

function mathPreprocess(name = 'Math', path = '$lib/Math.svelte') {
  return {
    name: 'math-preprocess',
    markup({ content }) {
      const scriptTag = /<script(?![^>]*\bmodule\b)[^>]*>/g;
      const inlineMath = /\{\`\$ (.+?) \$\`\}/g;
      const displayMath = /\{\`\$\$(.*?)\$\$\`\}/gs;
      const importMath = `import ${name} from "${path}";`;
      const importCheck = new RegExp(`import\\s+${name}\\s+from\\s+['"]${path}['"]`);

      if (inlineMath.test(content) || displayMath.test(content)) {
        if (!scriptTag.test(content)) {
          content = `<script>\n\t${importMath}\n</script>\n\n${content}`;
        } else if (!importCheck.test(content)) {
          content = content.replace(scriptTag, (match) => {
            return `${match}\n\t${importMath}`;
          });
        }
        content = content
          .replace(inlineMath, (_, p) => {
            return `<Math render={\`${p}\`} display={false} />`;
          })
          .replace(displayMath, (_, p) => {
            return `<Math render={\`${p.trim()}\`} display={true} />`;
          });
      }
      return { code: content };
    }
  };
}

export default config;
