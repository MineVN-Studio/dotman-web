// Kiểm tra SEO của site.
//
// Cách dùng:
//   bun run dw:seo
//
// Gồm hai phần:
//   1. Frontmatter của các trang trong docs/: có title, description, độ dài hợp lý, không trùng nhau.
//   2. Bản build trong .vitepress/dist (nếu đã chạy dw:build): thẻ canonical, og:*, h1, JSON-LD, sitemap, robots.
//
// Lỗi (thiếu, trùng, sai) làm script thoát với mã 1. Cảnh báo (quá dài, quá ngắn) chỉ để tham khảo.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DOCS = path.join(ROOT, 'docs')
const DIST = path.join(ROOT, '.vitepress/dist')
const SITE = 'https://dotman.minevn.net'

// Google hiển thị khoảng 60 ký tự của tiêu đề và 155 đến 160 ký tự của mô tả
const TITLE_MAX = 60
const TITLE_SUFFIX = ' | DotMan Docs'.length
const DESC_MIN = 50
const DESC_MAX = 160

const errors = []
const warnings = []

function walk(dir, ext, skip = () => false) {
  const out = []
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name)
    if (f.isDirectory()) {
      if (!skip(f.name)) out.push(...walk(p, ext, skip))
    } else if (f.name.endsWith(ext)) out.push(p)
  }
  return out
}

const titles = new Map()
const descs = new Map()
const mdFiles = walk(DOCS, '.md', (name) => name === 'public')

for (const file of mdFiles) {
  const rel = path.relative(DOCS, file).replace(/\\/g, '/')
  const m = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) {
    errors.push(`${rel}: không có frontmatter`)
    continue
  }
  let fm
  try {
    fm = parse(m[1]) ?? {}
  } catch (e) {
    errors.push(`${rel}: frontmatter không hợp lệ (${String(e.message).split('\n')[0]})`)
    continue
  }
  const { title, description } = fm
  if (!title) errors.push(`${rel}: thiếu title`)
  if (!description) errors.push(`${rel}: thiếu description`)

  if (title) {
    // trang chủ không dùng titleTemplate nên không cộng hậu tố
    const total = String(title).length + (fm.titleTemplate === false ? 0 : TITLE_SUFFIX)
    if (total > TITLE_MAX) warnings.push(`${rel}: title dài ${total} ký tự (nên dưới ${TITLE_MAX}): ${title}`)
    if (titles.has(title)) errors.push(`${rel}: title trùng với ${titles.get(title)}`)
    titles.set(title, rel)
  }
  if (description) {
    const len = String(description).length
    if (len < DESC_MIN) warnings.push(`${rel}: description chỉ ${len} ký tự (nên từ ${DESC_MIN})`)
    if (len > DESC_MAX) warnings.push(`${rel}: description dài ${len} ký tự (Google thường cắt quanh ${DESC_MAX})`)
    if (descs.has(description)) errors.push(`${rel}: description trùng với ${descs.get(description)}`)
    descs.set(description, rel)
  }
}

let built = 0
if (!fs.existsSync(path.join(DIST, 'sitemap.xml'))) {
  warnings.push('chưa có bản build (.vitepress/dist), bỏ qua phần kiểm tra thẻ trong HTML. Chạy `bun run dw:build` trước.')
} else {
  const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
  const locs = new Set([...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]))
  const pick = (html, re) => (html.match(re) || [])[1]

  const robotsTxt = path.join(DIST, 'robots.txt')
  if (!fs.existsSync(robotsTxt)) errors.push('thiếu robots.txt')
  else if (!fs.readFileSync(robotsTxt, 'utf8').includes(`${SITE}/sitemap.xml`)) errors.push('robots.txt chưa khai báo sitemap')

  for (const file of walk(DIST, '.html')) {
    const rel = path.relative(DIST, file).replace(/\\/g, '/')
    const html = fs.readFileSync(file, 'utf8')

    if (rel === '404.html') {
      if (!/name="robots" content="noindex/.test(html)) errors.push('404.html: thiếu noindex')
      continue
    }
    built++

    const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/)
    if (!canonical) errors.push(`${rel}: thiếu canonical`)
    else if (!locs.has(canonical)) errors.push(`${rel}: canonical không có trong sitemap (${canonical})`)

    const ogTitle = pick(html, /property="og:title" content="([^"]*)"/)
    const ogDesc = pick(html, /property="og:description" content="([^"]*)"/)
    const ogUrl = pick(html, /property="og:url" content="([^"]*)"/)
    if (!ogTitle || !ogDesc || !ogUrl) errors.push(`${rel}: thiếu og:title, og:description hoặc og:url`)
    else if (ogUrl !== canonical) errors.push(`${rel}: og:url khác canonical`)

    if (!pick(html, /<meta name="description" content="([^"]*)"/)) errors.push(`${rel}: thiếu meta description`)

    const ogImage = pick(html, /property="og:image" content="([^"]*)"/)
    if (!ogImage) errors.push(`${rel}: thiếu og:image`)
    else if (!ogImage.startsWith(`${SITE}/`)) errors.push(`${rel}: og:image phải là đường dẫn tuyệt đối (${ogImage})`)
    else if (!fs.existsSync(path.join(DIST, ogImage.slice(SITE.length)))) errors.push(`${rel}: og:image không có trong bản build (${ogImage})`)
    if (/name="robots" content="[^"]*noindex/.test(html)) errors.push(`${rel}: đang bị noindex`)

    const h1 = (html.match(/<h1[ >]/g) || []).length
    if (h1 !== 1) errors.push(`${rel}: có ${h1} thẻ h1 (cần đúng 1)`)

    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        const data = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'))
        if (data['@type'] === 'BreadcrumbList') {
          for (const it of data.itemListElement) {
            if (!it.name || !it.item) errors.push(`${rel}: breadcrumb thiếu name hoặc item`)
            else if (it.item !== `${SITE}/` && !locs.has(it.item)) errors.push(`${rel}: breadcrumb trỏ tới URL không có trong sitemap (${it.item})`)
          }
        }
      } catch (e) {
        errors.push(`${rel}: JSON-LD không đọc được (${e.message})`)
      }
    }
  }
  if (built !== locs.size) warnings.push(`sitemap có ${locs.size} URL nhưng build có ${built} trang`)
}

console.log(`Frontmatter: ${mdFiles.length} trang`)
console.log(`Bản build: ${built ? built + ' trang' : 'chưa kiểm tra'}`)
if (warnings.length) {
  console.log(`\nCảnh báo (${warnings.length}):`)
  warnings.forEach((w) => console.log('  ~', w))
}
if (errors.length) {
  console.log(`\nLỗi (${errors.length}):`)
  errors.forEach((e) => console.log('  x', e))
  process.exit(1)
}
console.log('\nKhông có lỗi SEO.')
