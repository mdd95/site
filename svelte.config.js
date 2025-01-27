import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [vitePreprocess(), mathPreprocess(), mdsvex()],
  kit: {
    adapter: adapter()
  },
  extensions: ['.svelte', '.svx']
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
