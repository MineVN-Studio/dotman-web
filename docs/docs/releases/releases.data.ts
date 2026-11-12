// Lấy danh sách release từ GitHub lúc build (VitePress data loader).
// Đặt biến môi trường GITHUB_TOKEN để tránh giới hạn 60 request/giờ của GitHub API.
// Changelog bản Premium không có trên GitHub, được viết tay trong changelog/premium/*.md.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createMarkdownRenderer, defineLoader } from 'vitepress'
import { parse as parseYaml } from 'yaml'

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
  /** Link xem trên GitHub, release viết tay (Premium) không có */
  url?: string
  compareUrl?: string
  assets: ReleaseAsset[]
}

export interface ReleaseProject {
  key: string
  name: string
  /** Repo GitHub, project viết tay (Premium) không có */
  repo?: string
  releasesUrl?: string
  /** Kênh Discord chứa file jar của từng kênh phát hành, dùng cho project không có file đính kèm (Premium) */
  channelLinks?: { stable: string; beta: string }
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

const PREMIUM_DIR = 'changelog/premium'

/** Kênh Discord MineVN Studio chứa file jar bản Premium */
const PREMIUM_CHANNEL_LINKS = {
  stable: 'https://discord.com/channels/1068181110036635678/1484891352519938148',
  beta: 'https://discord.com/channels/1068181110036635678/1407762581988311060',
}

/** Hiển thị theo thứ tự này ở trang tổng quan */
const PROJECT_ORDER = ['dotman', 'premium', 'minevnlib']

/** Ngày dạng dd/mm/yyyy hoặc dd-mm-yyyy, có thể kèm giờ HH:mm, hiểu là giờ Việt Nam */
function parsePremiumDate(raw: string, file: string) {
  const match = raw.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/)
  if (match) {
    const [day, month, year, hour, minute] = [match[1], match[2], match[3], match[4] ?? '0', match[5] ?? '0'].map(Number)
    // Date tự cuộn ngày sai sang tháng sau (31/02 thành 03/03) nên phải so lại từng phần
    const utc = new Date(Date.UTC(year, month - 1, day, hour, minute))
    if (utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day && hour < 24 && minute < 60) {
      // giờ Việt Nam (UTC+7) về UTC
      return new Date(utc.getTime() - 7 * 3600 * 1000).toISOString()
    }
  }
  throw new Error(`[premium] ${file}: "date" không hợp lệ (${raw}), dùng dạng 12/11/2026, 12-11-2026 hoặc 12/11/2026 14:30`)
}

/** Đọc changelog Premium từ changelog/premium/*.md, mỗi file là một phiên bản */
function loadPremium(md: Awaited<ReturnType<typeof createMarkdownRenderer>>): ReleaseProject {
  const dir = join(process.cwd(), PREMIUM_DIR)
  let files: string[] = []
  try {
    files = readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.md') && f.toLowerCase() !== 'readme.md' && !f.startsWith('_'))
  } catch {
    // chưa có thư mục thì coi như chưa có bản nào
  }

  const seen = new Set<string>()
  const items = files.map((file) => {
    const match = readFileSync(join(dir, file), 'utf8').replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
    if (!match) throw new Error(`[premium] ${file}: thiếu frontmatter, file phải bắt đầu bằng --- version, date, channel ---`)
    const meta = (parseYaml(match[1]) ?? {}) as Record<string, unknown>

    const version = String(meta.version ?? '').trim()
    if (!version) throw new Error(`[premium] ${file}: thiếu "version"`)
    if (seen.has(version)) throw new Error(`[premium] ${file}: trùng version ${version}`)
    seen.add(version)

    const channel = String(meta.channel ?? 'stable').trim().toLowerCase()
    if (channel !== 'stable' && channel !== 'beta') {
      throw new Error(`[premium] ${file}: "channel" chỉ nhận stable hoặc beta (đang là ${channel})`)
    }
    if (meta.date === undefined) throw new Error(`[premium] ${file}: thiếu "date"`)

    const title = meta.title ? String(meta.title).trim() : undefined
    return { version, title, prerelease: channel === 'beta', datetime: parsePremiumDate(String(meta.date), file), body: match[2].trim() }
  })

  items.sort((a, b) => Date.parse(b.datetime) - Date.parse(a.datetime) || b.version.localeCompare(a.version, undefined, { numeric: true }))
  const latestVersion = items.find((r) => !r.prerelease)?.version

  return {
    key: 'premium',
    name: 'DotMan Premium',
    channelLinks: PREMIUM_CHANNEL_LINKS,
    releases: items.map((r) => ({
      id: 'v' + r.version.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      tag: r.version,
      title: r.title,
      date: formatDate(r.datetime),
      datetime: r.datetime,
      prerelease: r.prerelease,
      latest: r.version === latestVersion,
      hasNotes: r.body.length > 0,
      html: r.body ? postprocessHtml(md.render(r.body, {})) : '',
      search: `${r.version} ${r.title ?? ''} ${r.body}`.toLowerCase(),
      assets: [],
    })),
  }
}

export default defineLoader({
  // build lại khi sửa changelog Premium lúc chạy dev
  watch: ['../../../changelog/premium/*.md'],
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

    projects.premium = loadPremium(md)

    const ordered = Object.fromEntries(PROJECT_ORDER.filter((key) => projects[key]).map((key) => [key, projects[key]]))
    return { syncedAt: formatDate(new Date().toISOString()), projects: ordered }
  },
})
