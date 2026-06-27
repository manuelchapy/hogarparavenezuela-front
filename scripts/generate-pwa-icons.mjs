import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const svg = path.join(root, 'public', 'favicon.svg');

await sharp(svg).resize(512, 512).png().toFile(path.join(root, 'public', 'pwa-512x512.png'));
await sharp(svg).resize(192, 192).png().toFile(path.join(root, 'public', 'pwa-192x192.png'));

console.log('PWA icons generated in public/');
