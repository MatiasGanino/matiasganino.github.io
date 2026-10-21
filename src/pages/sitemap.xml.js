// Sitemap mínimo: el sitio es una sola página (/cv y /og no se publican en buscadores)
import { cv } from '../data/cv.js';

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${cv.web}/</loc></url></urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
