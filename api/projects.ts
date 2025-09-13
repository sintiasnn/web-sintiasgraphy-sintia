import type { VercelRequest, VercelResponse } from '@vercel/node'

type GhRepo = {
  name: string;
  full_name?: string;
  description?: string | null;
  html_url: string;
  homepage?: string | null;
  topics?: string[];
  language?: string | null;
  fork?: boolean;
  pushed_at?: string | null;
  updated_at?: string | null;
}

const ghCache: Record<string, { at: number; items: Array<{ title: string; description?: string; link?: string; tags?: string[]; updated?: string; image?: string }> }> = {}
const GH_CACHE_TTL_MS = 5 * 60 * 1000

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = (process.env.GITHUB_USERNAME || 'sintiasnn').trim()
  const token = (process.env.GITHUB_TOKEN || '').trim() || undefined
  const limitParam = Number.parseInt((req.query.limit as string) || '')
  const includeForks = (req.query.includeForks as string) === '1'
  const noCache = (req.query.noCache as string) === '1' || (req.query.refresh as string) === '1'
  const namesParam = (req.query.names as string) || ''
  const envFeatured = (process.env.GITHUB_FEATURED_REPOS || '').trim()
  const featuredNames = (namesParam || envFeatured)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined

  const key = `${username}`
  const now = Date.now()
  const cached = ghCache[key]

  try {
    let items: Array<{ title: string; description?: string; link?: string; tags?: string[]; updated?: string; image?: string }> = []

    if (!noCache && cached && now - cached.at < GH_CACHE_TTL_MS) {
      items = cached.items
    } else {
      const url = new URL(`https://api.github.com/users/${encodeURIComponent(username)}/repos`)
      url.searchParams.set('type', 'owner')
      url.searchParams.set('sort', 'updated')
      url.searchParams.set('per_page', '100')
      const r = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'sinsin/1.0',
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })
      if (!r.ok) {
        if (process.env.NODE_ENV !== 'production') console.error('/api/projects GitHub response:', r.status, await r.text())
        return res.status(200).json({ items: [] })
      }
      const repos = (await r.json()) as GhRepo[]
      let filtered = (repos || []).filter((repo) => includeForks ? true : !repo.fork)
      if (featuredNames.length > 0) {
        const set = new Set(featuredNames)
        filtered = filtered.filter((repo) => set.has(repo.name.toLowerCase()) || (repo.full_name && set.has(repo.full_name.toLowerCase())))
        filtered.sort((a, b) => {
          const ia = featuredNames.indexOf((a.full_name || a.name).toLowerCase())
          const ib = featuredNames.indexOf((b.full_name || b.name).toLowerCase())
          return ia - ib
        })
      }
      items = filtered.map((repo) => {
          const title = repo.name
          const description = repo.description ?? undefined
          const link = (repo.homepage && repo.homepage.trim()) || repo.html_url
          const stack = [
            ...(repo.language ? [repo.language] : []),
            ...((repo.topics && repo.topics.length ? repo.topics : []) as string[]),
          ].map((s) => (s || '').toString().trim()).filter(Boolean)
          const uniq = Array.from(new Set(stack))
          const tags = uniq.length ? uniq : undefined
          const updated = (repo.pushed_at || repo.updated_at || undefined) ?? undefined
          return { title, description, link, tags, updated }
        })
      ghCache[key] = { at: now, items }
    }

    if (limit) return res.status(200).json({ items: items.slice(0, limit) })
    return res.status(200).json({ items })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error('/api/projects error:', e)
    return res.status(200).json({ items: [] })
  }
}
