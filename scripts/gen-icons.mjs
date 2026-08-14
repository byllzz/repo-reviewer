import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'

const outDir = path.resolve('public/icons')
mkdirSync(outDir, { recursive: true })

const glyph = `
  <circle cx="215" cy="215" r="118" fill="none" stroke="#ffffff" stroke-width="34"/>
  <line x1="300" y1="300" x2="392" y2="392" stroke="#ffffff" stroke-width="40" stroke-linecap="round"/>
  <circle cx="180" cy="185" r="14" fill="#ffffff"/>
  <circle cx="250" cy="185" r="14" fill="#ffffff"/>
  <circle cx="215" cy="245" r="14" fill="#ffffff"/>
  <line x1="180" y1="185" x2="215" y2="245" stroke="#ffffff" stroke-width="10"/>
  <line x1="250" y1="185" x2="215" y2="245" stroke="#ffffff" stroke-width="10"/>
`

function svgIcon({ padding = 0, bg = '#0a0a0c', rounded = 96 } = {}) {
  const size = 512
  const inner = size - padding * 2
  const scale = inner / size
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${rounded}" fill="${bg}"/>
    <g transform="translate(${padding} ${padding}) scale(${scale})">${glyph}</g>
  </svg>`
}

function svgMono() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${glyph.replace(
    /#ffffff/g,
    '#000000'
  )}</svg>`
}

const standard = svgIcon({ padding: 0 })
const maskable = svgIcon({ padding: 96, rounded: 0 })
const mono = svgMono()

writeFileSync(path.join(outDir, 'icon.svg'), standard)
writeFileSync(path.join(outDir, 'safari-pinned-tab.svg'), mono)

const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512]

for (const size of sizes) {
  await sharp(Buffer.from(standard)).resize(size, size).png().toFile(path.join(outDir, `icon-${size}.png`))
}

await sharp(Buffer.from(maskable)).resize(512, 512).png().toFile(path.join(outDir, 'maskable-512.png'))
await sharp(Buffer.from(maskable)).resize(192, 192).png().toFile(path.join(outDir, 'maskable-192.png'))

await sharp(Buffer.from(svgIcon({ padding: 0, rounded: 0 })))
  .resize(180, 180)
  .png()
  .toFile(path.join(outDir, 'apple-touch-icon.png'))

console.log('Icons generated in', outDir)
