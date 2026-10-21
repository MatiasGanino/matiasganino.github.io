// Imprime dist/cv/index.html a PDF con Chrome o Edge en modo headless.
// Se corre después de `npm run build`; en GitHub Actions usa el Chrome que trae el runner.
import { existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { cv } from '../src/data/cv.js';

const input = resolve('dist/cv/index.html');
const output = resolve('dist', cv.pdf);

if (!existsSync(input)) {
  console.error('No existe dist/cv/index.html: corré `npm run build` primero.');
  process.exit(1);
}

const candidatos = [
  process.env.CHROME_PATH,
  'google-chrome',
  'google-chrome-stable',
  'chromium',
  'chromium-browser',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

// Las rutas se chequean en disco; los nombres sueltos, buscándolos en el PATH
const disponible = (bin) =>
  /[\\/]/.test(bin) ? existsSync(bin) : spawnSync(bin, ['--version'], { stdio: 'ignore' }).status === 0;
const navegador = candidatos.find(disponible);

if (!navegador) {
  console.error('No encontré Chrome ni Edge. Indicá la ruta con la variable CHROME_PATH.');
  process.exit(1);
}

const { status } = spawnSync(
  navegador,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-pdf-header-footer',
    '--virtual-time-budget=8000', // da tiempo a que cargue la fuente Poppins
    `--print-to-pdf=${output}`,
    pathToFileURL(input).href,
  ],
  { stdio: 'inherit' },
);

if (status !== 0 || !existsSync(output) || statSync(output).size === 0) {
  console.error(`Falló la generación del PDF con ${navegador}.`);
  process.exit(1);
}
console.log(`PDF generado: ${output}`);
