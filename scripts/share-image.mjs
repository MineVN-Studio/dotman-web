// Tạo ảnh chia sẻ ngang 1200x630 (og:image, twitter:image) cho trang chủ.
//
// Cách dùng:
//   bun run dw:share-image
//
// Dựng ảnh bằng HTML theo giao diện hero của trang chủ rồi chụp bằng Chrome headless, lưu vào docs/public/share.png.
// Chrome không nằm ở đường dẫn mặc định thì đặt biến môi trường CHROME trỏ tới file chạy của Chrome.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'docs/public/share.png')
const WIDTH = 1200
const HEIGHT = 630

const CHROME =
  process.env.CHROME ??
  {
    win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }[process.platform] ??
  'google-chrome'

const fileUrl = (rel) => pathToFileURL(path.join(ROOT, rel)).href
const icons = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules/@iconify-json/simple-icons/icons.json'), 'utf8')).icons
const brandIcon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name].body}</svg>`
// icon Globe của Lucide
const globeIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>'

const font = (weight) => `
@font-face {
  font-family: 'Be Vietnam Pro';
  font-weight: ${weight};
  src: url('${fileUrl(`node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-vietnamese-${weight}-normal.woff2`)}') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'Be Vietnam Pro';
  font-weight: ${weight};
  src: url('${fileUrl(`node_modules/@fontsource/be-vietnam-pro/files/be-vietnam-pro-latin-${weight}-normal.woff2`)}') format('woff2');
}`

const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<style>
${[500, 600, 700].map(font).join('\n')}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  overflow: hidden;
  background: #1b1b1f;
  font-family: 'Be Vietnam Pro', sans-serif;
}

.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 64px 80px 0;
}

.text {
  position: relative;
  width: 660px;
}

.name {
  display: inline-block;
  font-size: 68px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -1px;
  background: linear-gradient(120deg, #3ecf8e 30%, #ffc966);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

h1 {
  margin-top: 4px;
  font-size: 58px;
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -1px;
  color: #dfdfd6;
}

.tagline {
  margin-top: 20px;
  font-size: 25px;
  font-weight: 500;
  line-height: 1.5;
  color: #98989f;
}

.image {
  position: absolute;
  top: 80px;
  right: 72px;
  width: 360px;
  height: 360px;
}

.image::before {
  content: '';
  position: absolute;
  inset: 24px;
  border-radius: 50%;
  background: linear-gradient(-45deg, rgba(62, 207, 142, 0.4) 50%, rgba(255, 201, 102, 0.3) 50%);
  filter: blur(64px);
}

.image img {
  position: relative;
  width: 100%;
  height: 100%;
}

.actions {
  position: absolute;
  left: 80px;
  bottom: 56px;
  display: flex;
  align-items: center;
  gap: 36px;
}

/* nút chính to, nền đặc; Discord, GitHub chỉ là link phụ xếp chồng bên cạnh, không có khung */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  height: 68px;
  padding: 0 32px;
  border-radius: 34px;
  font-size: 22px;
  font-weight: 700;
  white-space: nowrap;
  background: #1f9a5e;
  color: #fff;
}

.btn svg {
  width: 26px;
  height: 26px;
  flex: none;
}

.btn .link {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}

.links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 36px;
  border-left: 2px solid #32363f;
}

.links > span {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  color: #dfdfd6;
}

.links svg {
  width: 20px;
  height: 20px;
  flex: none;
  color: #98989f;
}

.links .link {
  font-weight: 500;
  color: #98989f;
}
</style>
</head>
<body>
<div class="wrap">
  <div class="image"><img src="${fileUrl('docs/public/dotman.png')}" alt=""></div>
  <div class="text">
    <div class="name">DotMan</div>
    <h1>Plugin nạp thẻ cho server Minecraft</h1>
    <p class="tagline">
      Plugin nạp thẻ cào và chuyển khoản ngân hàng cho server Minecraft Việt Nam,
      kèm khuyến mãi, mốc nạp, top nạp, thống kê, lịch sử nạp và quản lý dòng tiền.
    </p>
  </div>
  <div class="actions">
    <span class="btn">${globeIcon}<span>Trải nghiệm ngay: <span class="link">dotman.minevn.net</span></span></span>
    <div class="links">
      <span>${brandIcon('discord')}<span>Discord: <span class="link">minevn.net/studio</span></span></span>
      <span>${brandIcon('github')}<span>GitHub: <span class="link">minevn/dotman</span></span></span>
    </div>
  </div>
</div>
</body>
</html>`

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dotman-share-'))
const page = path.join(tmp, 'share.html')
fs.writeFileSync(page, html)

try {
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${WIDTH},${HEIGHT}`,
    // chờ font và ảnh tải xong rồi mới chụp
    '--virtual-time-budget=3000',
    `--screenshot=${OUT}`,
    pathToFileURL(page).href,
  ], { stdio: 'inherit' })
} finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}

console.log(`Đã tạo ${path.relative(ROOT, OUT)} (${WIDTH}x${HEIGHT})`)
