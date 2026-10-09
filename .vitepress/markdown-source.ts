import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import type { MarkdownRenderer } from 'vitepress'

export function toPlainMarkdown(src: string) {
  return src
    .replace(/<!--[\s\S]*?-->\n*/g, '')
    .replace(/[ \t]*<Badge [^>]*text="([^"]+)"[^>]*\/>/g, ' ($1)')
}

/** Trang công cụ là form tương tác, trang Releases là danh sách lấy từ GitHub, đều không cần nút sao chép markdown / mở bằng AI */
const NO_PAGE_ACTIONS = /^(cong-cu|releases)\//

export function pageActionsPlugin(md: MarkdownRenderer) {
  md.core.ruler.push('dotman_page_actions', (state) => {
    if (NO_PAGE_ACTIONS.test(state.env?.relativePath ?? '')) return
    const tokens = state.tokens
    const index = tokens.findIndex((t) => t.type === 'heading_close' && t.tag === 'h1')
    if (index === -1) return
    const token = new state.Token('html_block', '', 0)
    token.content = '<PageActions />\n'
    tokens.splice(index + 1, 0, token)
  })
}

export function markdownSourceDevPlugin(srcDir: string): Plugin {
  return {
    name: 'dotman-markdown-source',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        if (!url.searchParams.has('dotman-md') || !url.pathname.endsWith('.md')) return next()

        const file = path.join(srcDir, decodeURIComponent(url.pathname))
        if (!file.startsWith(srcDir) || !fs.existsSync(file)) return next()

        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.end(toPlainMarkdown(fs.readFileSync(file, 'utf8')))
      })
    },
  }
}

export function writeMarkdownSources(srcDir: string, outDir: string, pages: string[]) {
  for (const page of pages) {
    const out = path.join(outDir, page)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, toPlainMarkdown(fs.readFileSync(path.join(srcDir, page), 'utf8')))
  }
}
