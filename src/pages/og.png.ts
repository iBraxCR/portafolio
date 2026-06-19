import type { APIRoute } from 'astro';
import sharp from 'sharp';

export const GET: APIRoute = async () => {
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0d0d0d"/>
      <stop offset="100%" stop-color="#040404"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="600" y2="315" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(255,245,225,0.07)"/>
      <stop offset="100%" stop-color="rgba(255,245,225,0)"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="240" cy="200" rx="380" ry="260" fill="url(#glow)" opacity="0.7"/>

  <rect x="48" y="48" width="1104" height="534" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
  <rect x="58" y="58" width="1084" height="514" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>

  <text x="80" y="220" font-family="Georgia, 'Times New Roman', serif" font-size="13" fill="rgba(232,200,140,0.75)" letter-spacing="5" font-weight="400">PORTFOLIO</text>

  <text x="78" y="358" font-family="Georgia, 'Times New Roman', serif" font-size="82" fill="rgba(255,255,255,0.93)" letter-spacing="-3" font-weight="400">Joschua</text>
  <text x="78" y="440" font-family="Georgia, 'Times New Roman', serif" font-size="82" fill="rgba(232,200,140,0.85)" letter-spacing="-3" font-style="italic" font-weight="300">Barahona</text>

  <line x1="80" y1="480" x2="320" y2="480" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

  <text x="80" y="516" font-family="'Courier New', Courier, monospace" font-size="16" fill="rgba(255,255,255,0.38)" letter-spacing="3">FULLSTACK DEVELOPER · COSTA RICA</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
