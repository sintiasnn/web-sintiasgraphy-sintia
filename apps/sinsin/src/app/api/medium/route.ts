import { NextResponse, type NextRequest } from 'next/server'

type MediumItem = { title: string; link: string; pubDate?: string; image?: string; snippet?: string }

const mediumCache: Record<string, { at: number; items: MediumItem[] }> = {}
const MEDIUM_CACHE_TTL_MS = 5 * 60 * 1000

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const username = process.env.MEDIUM_USERNAME?.trim()
  const feedUrlEnv = process.env.MEDIUM_FEED_URL?.trim()
  const feedUrl = feedUrlEnv || (username ? `https://medium.com/feed/@${username}` : undefined)
  if (!feedUrl) return NextResponse.json({ items: [] })

  const limitParam = Number.parseInt((searchParams.get('limit') as string) || '')
  const pageParam = Number.parseInt((searchParams.get('page') as string) || '1')
  const noCache = (searchParams.get('noCache') as string) === '1' || (searchParams.get('refresh') as string) === '1'
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1

  const key = feedUrl
  const now = Date.now()
  const cached = mediumCache[key]

  try {
    let items: MediumItem[]

    if (!noCache && cached && now - cached.at < MEDIUM_CACHE_TTL_MS) {
      items = cached.items
    } else {
      // Fetch RSS feed and parse basic fields
      const r = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'sinsin/1.0',
          Accept: 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
        },
      })
      const xml = await r.text()
      const itemRegex = /<item[\s\S]*?<\/item>/g
      const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i
      const linkRegex = /<link>(.*?)<\/link>/i
      const dateRegex = /<pubDate>(.*?)<\/pubDate>/i
      const contentRegex = /<content:encoded>([\s\S]*?)<\/content:encoded>/i
      items = []
      for (const block of xml.match(itemRegex) ?? []) {
        const t = block.match(titleRegex)
        const l = block.match(linkRegex)
        const d = block.match(dateRegex)
        const c = block.match(contentRegex)?.[1] ?? ''
        const imgMatch = c.match(/<img[^>]*src=(?:\"|&quot;|')([^\"'&<>]+)(?:\"|&quot;|')/i)
        const title = (t?.[1] || t?.[2] || '').trim()
        const link = (l?.[1] || '').trim()
        const pubDate = d?.[1]?.trim()
        const image = imgMatch?.[1]?.replace(/&amp;/g, '&')
        const snippet = c.replace(/<[^>]+>/g, ' ').slice(0, 180).trim()
        if (title && link) items.push({ title, link, pubDate, image, snippet })
      }
      mediumCache[key] = { at: now, items }
    }

    if (limit) {
      const total = items.length
      const pageCount = Math.max(1, Math.ceil(total / limit))
      const current = Math.min(page, pageCount)
      const start = (current - 1) * limit
      const slice = items.slice(start, start + limit)
      return NextResponse.json({ items: slice, total, page: current, pageCount, limit })
    }
    return NextResponse.json({ items })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error('/api/medium error:', e)
    return NextResponse.json({ items: [] })
  }
}

