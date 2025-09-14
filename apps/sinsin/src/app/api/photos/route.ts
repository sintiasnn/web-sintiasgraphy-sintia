import { NextResponse, type NextRequest } from 'next/server'
import { readFile } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'

export async function GET(_req: NextRequest) {
  try {
    const p = resolvePath(process.cwd(), 'public/photos.json')
    const raw = await readFile(p, 'utf8')
    return new NextResponse(raw, { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error('/api/photos error:', e)
    return NextResponse.json({ photos: [] })
  }
}
