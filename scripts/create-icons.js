const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const svgIcon = (size) => `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1d4ed8" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="url(#bgGrad)" />
      <text x="50%" y="60%" font-size="${Math.round(size * 0.52)}" text-anchor="middle" dominant-baseline="middle">🚜</text>
    </svg>
  `;

  await sharp(Buffer.from(svgIcon(192)))
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  await sharp(Buffer.from(svgIcon(512)))
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  console.log('App icons generated successfully in public/');
}

createIcons().catch(console.error);
