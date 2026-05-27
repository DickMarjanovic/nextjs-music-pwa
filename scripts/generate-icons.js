/**
 * Generate PNG icons from existing SVGs using sharp.
 *
 * Usage:
 *   npm install --save-dev sharp
 *   node scripts/generate-icons.js
 */
const fs = require('fs')
const path = require('path')

async function run() {
  let sharp
  try {
    sharp = require('sharp')
  } catch (err) {
    console.error('Please install sharp first: npm install --save-dev sharp')
    process.exit(1)
  }

  const publicDir = path.join(__dirname, '..', 'public')
  const svgMap = [
    { src: path.join(publicDir, 'icon-192.svg'), out: path.join(publicDir, 'icon-192.png'), size: 192 },
    { src: path.join(publicDir, 'icon-512.svg'), out: path.join(publicDir, 'icon-512.png'), size: 512 },
    { src: path.join(publicDir, 'apple-touch-icon.svg'), out: path.join(publicDir, 'apple-touch-icon.png'), size: 180 }
  ]

  for (const item of svgMap) {
    if (!fs.existsSync(item.src)) {
      console.warn('SVG source missing, skipping:', item.src)
      continue
    }
    try {
      await sharp(item.src).resize(item.size, item.size).png().toFile(item.out)
      console.log('Generated', item.out)
    } catch (err) {
      console.error('Failed to generate', item.out, err)
    }
  }
}

run()
