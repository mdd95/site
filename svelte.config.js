import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import remarkMath from 'remark-math';
import rehypeKatexSvelte from 'rehype-katex-svelte';
// import katex from 'katex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    // mathPreprocess(),
    vitePreprocess(),
    mdsvex({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatexSvelte]
    })
  ],
  kit: {
    adapter: adapter()
  },
  extensions: ['.svelte', '.svx']
};

// function renderMath(tex, displayMode = false) {
//   const output = katex.renderToString(tex, {
//     displayMode,
//     throwOnError: false
//   });
//   return String.raw`{@html \`${output}\`}`;
// }

// function mathPreprocess() {
//   return {
//     name: 'math-preprocess',
//     markup({ content, filename }) {
//       if (filename.endsWith('.svx')) {
//         const inline = /\$(?!\s)(.+?)(?<!\s)\$/g;
//         const block = /\$\$([\s\S]+?)\$\$/g;

//         if (inline.test(content) || block.test(content)) {
//           console.log(content);
//           content = content
//             .replace(block, (_, tex) => renderMath(tex, true))
//             .replace(inline, (_, tex) => renderMath(tex));
//           return { code: content };
//         }
//       }
//     }
//   };
// }

export default config;
