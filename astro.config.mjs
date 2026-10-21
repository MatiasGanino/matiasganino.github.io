// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages sirve el sitio en https://<usuario>.github.io/<repo>/
// SITE y BASE_PATH los completa el workflow de deploy; en local queda en la raíz.
export default defineConfig({
  site: process.env.SITE,
  base: process.env.BASE_PATH || '/',
  // Sin la barra de desarrollo de Astro: se colaba en la captura de og.jpg
  devToolbar: { enabled: false },
});
