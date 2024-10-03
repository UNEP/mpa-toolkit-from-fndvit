// @ts-check
import adapter from '@mpa/stack';
import preprocess from 'svelte-preprocess';
import { plugins as postcssPlugins } from './src/lib/styles/config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: {
      plugins: postcssPlugins
    }
  }),

  kit: {
    adapter: adapter(),
    appDir: process.env.SVELTEKIT_APP_DIR || '_app',
    outDir: 'build',
    env: {
      dir: '../..'
    },
	paths: {
		base: '',
		assets: process.env.ASSETS_BASE_URL || 'https://mpath.unenvironment.org'
	}
  }
};

export default config;
