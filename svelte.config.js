import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// BASE_PATH is set by the Pages build when the site is served from a
// subpath such as /axle-clearance. Leave it empty for a custom domain.
const base = process.env.BASE_PATH ?? '';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: undefined }),
    paths: { base }
  }
};

export default config;
