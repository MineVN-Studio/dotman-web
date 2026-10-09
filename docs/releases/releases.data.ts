// Lấy danh sách release từ GitHub lúc build (VitePress data loader).
// Đặt biến môi trường GITHUB_TOKEN để tránh giới hạn 60 request/giờ của GitHub API.
import { createMarkdownRenderer, defineLoader } from 'vitepress'

export interface ReleaseAsset {
  name: string
  size: string
  url: string
}

export interface Release {
  id: string
  tag: string
  /** Tên release, chỉ có khi khác tag (ví dụ "Hotfix cho Paper <1.21.11") */
  title?: string
  date: string
  datetime: string
  prerelease: boolean
  latest: boolean
  hasNotes: boolean
  html: string
  search: string
  url: string
  compareUrl?: string
  assets: ReleaseAsset[]
}

export interface ReleaseProject {
  key: string
  name: string
  repo: string
  releasesUrl: string
  releases: Release[]
  error?: string
}

export interface ReleasesData {
  syncedAt: string
  projects: Record<string, ReleaseProject>
}

declare const data: ReleasesData
export { data }

const PROJECTS = [
  { key: 'dotman', name: 'DotMan', repo: 'minevn/dotman' },
  { key: 'minevnlib', name: 'MineVNLib', repo: 'minevn/minevn-library' },
]

const TIME_ZONE = 'Asia/Ho_Chi_Minh'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TIME_ZONE })

function formatSize(bytes: number) {
  const mib = bytes / 1024 / 1024
  if (mib >= 10) return `${Math.round(mib)} MiB`
  if (mib >= 1) return `${mib.toFixed(1)} MiB`
  return `${Math.max(1, Math.round(bytes / 1024))} KiB`
}

async function fetchReleases(repo: string): Promise<any[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'dotman-web',
  }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

  const all: any[] = []
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`, { headers })
    if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`)
    const items = await res.json()
    all.push(...items)
    if (items.length < 100) break
  }
  return all.filter((r) => !r.draft)
}

/** Bỏ tiền tố tên project và chữ "v" để so sánh tên release với tag */
function releaseTitle(name: string | null, tag: string) {
  if (!name) return undefined
  const normalized = name.trim().replace(/^(DotMan|MineVNLib)\s*-?\s*/i, '').replace(/^v(?=\d)/i, '')
  return normalized === tag ? undefined : name.trim()
}

/** Chuẩn hóa nội dung release giống cách GitHub hiển thị */
function prepareBody(body: string | null, repo: string) {
  return (body ?? '')
    .replace(/\r\n/g, '\n')
    // link "Full Changelog" đã có ở cuối mỗi release
    .replace(/^\*\*Full Changelog\*\*:.*$/gm, '')
    // link PR/issue -> #123 (hoặc owner/repo#123 nếu khác repo)
    .replace(/(?<![(<\[])https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/(?:pull|issues)\/(\d+)\b/g, (url, r, n) =>
      `[${r.toLowerCase() === repo.toLowerCase() ? '' : r}#${n}](${url})`,
    )
    // @username -> link profile GitHub
    .replace(/(^|[\s(])@([A-Za-z\d](?:[A-Za-z\d-]{0,38}))\b/g, '$1[@$2](https://github.com/$2)')
    .trim()
}

/** Hạ cấp heading trong nội dung release (h2 -> h3...) và bỏ id để không trùng anchor giữa các release */
function postprocessHtml(html: string) {
  return html
    .replace(/<a class="header-anchor"[^>]*>[\s\S]*?<\/a>/g, '')
    .replace(/<(\/?)h([1-6])([^>]*)>/g, (_, close, level, attrs) => {
      const next = Math.min(6, Number(level) + 1)
      return close ? `</h${next}>` : `<h${next}${attrs.replace(/\s*(id|tabindex)="[^"]*"/g, '')}>`
    })
}

export default defineLoader({
  async load(): Promise<ReleasesData> {
    const md = await createMarkdownRenderer(process.cwd(), {}, '/')
    const projects: Record<string, ReleaseProject> = {}

    for (const p of PROJECTS) {
      const project: ReleaseProject = {
        key: p.key,
        name: p.name,
        repo: p.repo,
        releasesUrl: `https://github.com/${p.repo}/releases`,
        releases: [],
      }
      projects[p.key] = project

      let raw: any[]
      try {
        raw = await fetchReleases(p.repo)
      } catch (e: any) {
        project.error = String(e?.message ?? e)
        console.warn(`[releases] Không lấy được release của ${p.repo}: ${project.error}`)
        continue
      }

      raw.sort((a, b) => Date.parse(b.published_at ?? b.created_at) - Date.parse(a.published_at ?? a.created_at))
      const latestTag = raw.find((r) => !r.prerelease)?.tag_name

      project.releases = raw.map((r, i) => {
        const body = prepareBody(r.body, p.repo)
        const older = raw[i + 1]
        const published = r.published_at ?? r.created_at
        return {
          id: 'v' + r.tag_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          tag: r.tag_name,
          title: releaseTitle(r.name, r.tag_name),
          date: formatDate(published),
          datetime: published,
          prerelease: r.prerelease,
          latest: r.tag_name === latestTag,
          hasNotes: body.length > 0,
          html: body ? postprocessHtml(md.render(body, {})) : '',
          search: `${r.tag_name} ${r.name ?? ''} ${body}`.toLowerCase(),
          url: r.html_url,
          compareUrl: older ? `https://github.com/${p.repo}/compare/${older.tag_name}...${r.tag_name}` : undefined,
          assets: (r.assets ?? []).map((a: any) => ({
            name: a.name,
            size: formatSize(a.size),
            url: a.browser_download_url,
          })),
        }
      })
    }

    return { syncedAt: formatDate(new Date().toISOString()), projects }
  },
})
