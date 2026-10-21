# CV — Matías Ganino

Sitio personal con animaciones.

- **[Astro](https://astro.build)**: sitio estático, sin frameworks de UI.
- **[GSAP](https://gsap.com) + ScrollTrigger**: animaciones con el scroll (texto que se pinta, contadores, línea de tiempo) y el selector de proyectos: chips que cambian la tarjeta grande.
- **[Lenis](https://lenis.darkroom.engineering)**: scroll suave.
- **[Three.js](https://threejs.org)**: teclas 3D flotantes en el hero, que siguen al mouse y se dispersan al scrollear.

## Editar el contenido

Todo el texto del CV está en [`src/data/cv.js`](src/data/cv.js). De ahí salen el sitio y el CV en PDF.

## CV en PDF

[`src/pages/cv.astro`](src/pages/cv.astro) es una versión simple del CV, pensada para RRHH y para que la lean bien los ATS.
`npm run pdf` la imprime a `dist/CV-Matias-Ganino.pdf` con Chrome o Edge en modo headless. El deploy lo hace solo, y el sitio lo enlaza en "Descargar CV".

## Imagen de vista previa

`public/og.jpg` es la imagen que muestran LinkedIn y otras redes al compartir el link.
Va en JPEG para que pese poco (WhatsApp no muestra imágenes pesadas).
Se captura de la página [`src/pages/og.astro`](src/pages/og.astro) con el servidor de desarrollo levantado:

```sh
chrome --headless=new --hide-scrollbars --window-size=1200,627 --force-device-scale-factor=2 --virtual-time-budget=6000 --screenshot=public/og.jpg http://localhost:4321/og
```

## Desarrollo

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run pdf      # genera el CV en PDF (después del build)
```

## Deploy

Cada push a `main` publica el sitio en GitHub Pages con el workflow de `.github/workflows/deploy.yml`.
En el repo: **Settings → Pages → Source: GitHub Actions**.
