import { cv } from '../data/cv.js';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${cv.web}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
}
