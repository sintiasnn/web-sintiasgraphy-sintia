import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFile } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const p = resolvePath(process.cwd(), 'apps/sin/public/experience.json')
    const raw = await readFile(p, 'utf8')
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(raw)
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error('/api/experience error:', e)
    res.status(200).json({ items: [] })
  }
}

