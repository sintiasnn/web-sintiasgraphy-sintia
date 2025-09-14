import type { VercelRequest, VercelResponse } from '@vercel/node'

// Simple in-memory cache
const mediumCache: Record<string, { at: number; items: Array<{ title: string; link: string; pubDate?: string; image?: string; snippet?: string }> }> = {}
const MEDIUM_CACHE_TTL_MS = 5 * 60 * 1000

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = (process.env.MEDIUM_USERNAME || '').trim()
  const feedUrlEnv = (process.env.MEDIUM_FEED_URL || '').trim()
  const feedUrl = feedUrlEnv || (username ? `https://medium.com/feed/@${username}` : undefined)
  if (!feedUrl) return res.status(200).json({ items: [] })

  const limitParam = Number.parseInt((req.query.limit as string) || '')
  const pageParam = Number.parseInt((req.query.page as string) || '1')
  const noCache = (req.query.noCache as string) === '1' || (req.query.refresh as string) === '1'
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1

  const key = feedUrl
  const now = Date.now()
  const cached = mediumCache[key]

  try {
    let items: Array<{ title: string; link: string; pubDate?: string; image?: string; snippet?: string }>

    if (!noCache && cached && now - cached.at < MEDIUM_CACHE_TTL_MS) {
      items = cached.items
    } else {
      try {
        const mod: any = await import('medium-article-api')
        const getArticles = mod?.default || mod
        const posts: any[] = await getArticles(username)
        items = (posts || [])
          .map((p: any) => {
            const title = (p.title || p.name || '').toString()
            const link = (p.link || p.url || p.guid || '').toString()
            const pubDate = (p.pubDate || p.date || p.createdAt || p.publishedAt || '').toString()
            const image = (p.thumbnail || p.image || p.coverImage || (p.enclosure && p.enclosure.url) || '').toString()
            const snippet = (p.subtitle || p.description || p.contentSnippet || '').toString()
            return { title, link, pubDate, image, snippet }
          })
          .filter((x: any) => x.title && x.link)
      } catch (_err) {
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
          if (title && link) (items as any).push({ title, link, pubDate, image, snippet })
        }
      }
      mediumCache[key] = { at: now, items }
    }

    if (limit) {
      const total = items.length
      const pageCount = Math.max(1, Math.ceil(total / limit))
      const current = Math.min(page, pageCount)
      const start = (current - 1) * limit
      const slice = items.slice(start, start + limit)
      return res.status(200).json({ items: slice, total, page: current, pageCount, limit })
    }

    return res.status(200).json({ items })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error('/api/medium error:', e)
    return res.status(200).json({ items: [] })
  }
}
