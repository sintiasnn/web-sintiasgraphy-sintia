// Optimize gallery images: generate AVIF/WebP full and thumbnails
import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const roots = [
  path.resolve(process.cwd(), 'apps/sinsin/public/images/photos'),
]

const exts = new Set(['.png', '.jpg', '.jpeg', '.webp'])

async function exists(p) {
  try { await fs.stat(p); return true } catch { return false }
}

async function isOutdated(src, dst) {
  try {
    const [s, d] = await Promise.all([fs.stat(src), fs.stat(dst)])
    return s.mtimeMs > d.mtimeMs
  } catch {
    return true
  }
}

async function processImage(file) {
  const dir = path.dirname(file)
  const base = path.basename(file, path.extname(file))
  // Skip hero image per requirement
  if (base.toLowerCase() === 'hero') {
    return { file, skipped: true }
  }
  const fullWebp = path.join(dir, `${base}.webp`)
  const fullAvif = path.join(dir, `${base}.avif`)
  const thumbWebp = path.join(dir, `${base}.thumb.webp`)
  const thumbAvif = path.join(dir, `${base}.thumb.avif`)

  const input = sharp(file).rotate()
  const meta = await input.metadata()
  const width = meta.width || 2048

  // Full-size (bounded)
  const maxWidth = 1800
  const targetWidth = Math.min(width, maxWidth)

  async function maybeWrite(dst, pipeline) {
    if (await isOutdated(file, dst)) {
      await pipeline.toFile(dst)
      return true
    }
    return false
  }

  const resized = input.resize({ width: targetWidth, withoutEnlargement: true })
  const wroteWebp = await maybeWrite(fullWebp, resized.clone().webp({ quality: 78, effort: 5 }))
  const wroteAvif = await maybeWrite(fullAvif, resized.clone().avif({ quality: 50, effort: 4 }))

  // Thumbnail
  const thumb = sharp(file).rotate().resize({ width: 320, withoutEnlargement: true })
  const wroteThumbWebp = await maybeWrite(thumbWebp, thumb.clone().webp({ quality: 70, effort: 5 }))
  const wroteThumbAvif = await maybeWrite(thumbAvif, thumb.clone().avif({ quality: 45, effort: 4 }))

  return { file, wroteWebp, wroteAvif, wroteThumbWebp, wroteThumbAvif }
}

async function main() {
  let count = 0
  for (const root of roots) {
    if (!(await exists(root))) continue
    const files = (await fs.readdir(root)).filter(f => {
      const ext = path.extname(f).toLowerCase()
      const base = path.basename(f, ext).toLowerCase()
      return exts.has(ext) && base !== 'hero'
    })
    for (const f of files) {
      const fp = path.join(root, f)
      try {
        const res = await processImage(fp)
        count++
        const flags = [
          res.skipped ? 'S' : (res.wroteWebp ? 'W' : '.'),
          res.skipped ? 'S' : (res.wroteAvif ? 'A' : '.'),
          res.skipped ? 'S' : (res.wroteThumbWebp ? 'w' : '.'),
          res.skipped ? 'S' : (res.wroteThumbAvif ? 'a' : '.'),
        ].join('')
        console.log(`${flags} ${path.relative(process.cwd(), res.file)}`)
      } catch (e) {
        console.error('Error processing', fp, e)
      }
    }
  }
  console.log(`Done. Processed ${count} images.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
