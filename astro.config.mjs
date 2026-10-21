// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://aakashgupta.dev',
  output: 'static',
  // lets the preview server answer through a dev tunnel (e.g. a trycloudflare.com URL)
  server: { allowedHosts: true },
  vite: { plugins: [tailwindcss()] },
});
