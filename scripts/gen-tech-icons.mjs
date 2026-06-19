/**
 * Downloads tech SVGs from devicons CDN and converts each to a
 * 256×256 WebP: brand-colored circle background + icon centered.
 * Run once: node scripts/gen-tech-icons.mjs
 */
import sharp from 'sharp';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'tech');
fs.mkdirSync(OUT_DIR, { recursive: true });

const SIZE = 256;
const PAD  = 44; // icon padding inside the circle

// [output-filename, devicons-path, background-hex]
const ICONS = [
  ['typescript', 'typescript/typescript-original.svg',  '#3178C6'],
  ['javascript', 'javascript/javascript-original.svg',  '#F7DF1E'],
  ['react',      'react/react-original.svg',            '#20232A'],
  ['nextjs',     'nextjs/nextjs-original.svg',          '#000000'],
  ['nodejs',     'nodejs/nodejs-original.svg',          '#215732'],
  ['express',    'express/express-original.svg',        '#353535'],
  ['python',     'python/python-original.svg',          '#3776AB'],
  ['mysql',      'mysql/mysql-original.svg',            '#00618A'],
  ['mongodb',    'mongodb/mongodb-original.svg',        '#13AA52'],
  ['redis',      'redis/redis-original.svg',            '#DC382D'],
  ['docker',     'docker/docker-original.svg',          '#2496ED'],
  ['git',        'git/git-original.svg',                '#F05032'],
  ['linux',      'linux/linux-original.svg',            '#1A1A2E'],
  ['figma',      'figma/figma-original.svg',            '#F24E1E'],
  ['vitejs',     'vitejs/vitejs-original.svg',          '#646CFF'],
  ['astro',      'astro/astro-original.svg',            '#FF5D01'],
  ['socketio',   'socketio/socketio-original.svg',      '#010101'],
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0,2), 16),
    g: parseInt(h.slice(2,4), 16),
    b: parseInt(h.slice(4,6), 16),
  };
}

async function buildIcon(slug, deviconPath, bgHex) {
  const url = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${deviconPath}`;
  console.log(`  ↓ ${slug}...`);

  let svgBuf;
  try {
    svgBuf = await fetch(url);
  } catch (e) {
    console.warn(`    ✗ failed to download ${slug}: ${e.message}`);
    return;
  }

  // Ensure SVG has explicit dimensions so sharp can rasterize it correctly
  let svgStr = svgBuf.toString('utf8');
  if (!svgStr.includes('width=')) {
    svgStr = svgStr.replace('<svg', '<svg width="200" height="200"');
  }
  svgBuf = Buffer.from(svgStr);

  const iconSize = SIZE - PAD * 2;
  const { r, g, b } = hexToRgb(bgHex);

  try {
    // Rasterise the SVG icon at iconSize×iconSize
    const iconPng = await sharp(svgBuf)
      .resize(iconSize, iconSize, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } })
      .png()
      .toBuffer();

    // Build circular background
    const circle = Buffer.from(
      `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
         <circle cx="${SIZE/2}" cy="${SIZE/2}" r="${SIZE/2}" fill="rgb(${r},${g},${b})"/>
       </svg>`
    );

    await sharp(circle)
      .composite([{ input: iconPng, left: PAD, top: PAD }])
      .webp({ quality: 90 })
      .toFile(path.join(OUT_DIR, `${slug}.webp`));

    console.log(`    ✓ ${slug}.webp`);
  } catch (e) {
    console.warn(`    ✗ sharp error for ${slug}: ${e.message}`);
  }
}

console.log('Generating tech icons…\n');
for (const [slug, deviconPath, bg] of ICONS) {
  await buildIcon(slug, deviconPath, bg);
}
console.log('\nDone.');
