// Sinh các trang "Config mẫu" từ file resource mặc định của DotMan.
//
// Cách dùng:
//   bun run dw:sync-config [đường dẫn tới thư mục resources]
//
// Mặc định đọc từ repo DotMan premium nằm cạnh repo này:
//   ../dotman-premium/dotman-plugin/src/main/resources
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.resolve(
  ROOT,
  process.argv[2] ?? process.env.DOTMAN_RESOURCES ?? '../dotman-premium/dotman-plugin/src/main/resources',
)
const OUT = path.join(ROOT, 'docs/config-mau')

/**
 * slug: tên file trang
 * title: tiêu đề trang (cũng là h1)
 * description: mô tả ngắn, hiển thị thành đoạn mở đầu của trang
 * metaTitle: tiêu đề cho SEO (thẻ <title>, og:title), nên có từ khóa và mô tả rõ nội dung
 * metaDescription: mô tả cho SEO (meta description, og:description), khoảng 70 đến 160 ký tự
 * files: các file resource hiển thị trong trang (nhiều file sẽ hiện dạng tab)
 * guide: trang hướng dẫn liên quan
 * premium: file chỉ có ở bản Premium
 * tool: công cụ hỗ trợ tạo/kiểm tra file này (nếu có)
 */
const PAGES = [
  {
    slug: 'config-yml',
    title: 'config.yml',
    description: 'Cấu hình chung, nạp thẻ cào, nạp thủ công, nạp lần đầu và database.',
    metaTitle: 'config.yml mẫu của DotMan',
    metaDescription: 'File config.yml mặc định của DotMan: cấu hình chung, nạp thẻ cào, nạp thủ công, khuyến mãi nạp lần đầu và database.',
    files: ['config.yml'],
    guide: ['/huong-dan/cau-hinh-chung', 'Cấu hình chung'],
  },
  {
    slug: 'messages-yml',
    title: 'messages.yml',
    description: 'Toàn bộ tin nhắn plugin gửi cho người chơi.',
    metaTitle: 'messages.yml mẫu của DotMan',
    metaDescription: 'File messages.yml mặc định của DotMan: toàn bộ tin nhắn plugin gửi cho người chơi, có thể tùy chỉnh theo ý bạn.',
    files: ['messages.yml'],
    guide: ['/huong-dan/cau-hinh-chung#tin-nhan-messages-yml', 'Tin nhắn'],
  },
  {
    slug: 'banking-yml',
    title: 'banking.yml',
    description: 'Cấu hình chung cho chuyển khoản ngân hàng.',
    metaTitle: 'banking.yml mẫu của DotMan Premium',
    metaDescription: 'File banking.yml mặc định của DotMan Premium: cấu hình chung cho chuyển khoản ngân hàng qua mã QR.',
    files: ['banking.yml'],
    guide: ['/nap-tien/ngan-hang', 'Chuyển khoản ngân hàng'],
    tool: ['/cong-cu/tinh-toan-point', 'Tính toán point'],
    premium: true,
  },
  {
    slug: 'providers-ngan-hang',
    title: 'providers/banking/*.yml',
    description: 'Cấu hình riêng của từng cổng thanh toán ngân hàng.',
    metaTitle: 'File mẫu cổng ngân hàng của DotMan',
    metaDescription: 'File cấu hình mẫu của từng cổng ngân hàng trong DotMan Premium: MBBank, PayOS, SePay và Payment Service.',
    files: [
      'providers/banking/mbbank.yml',
      'providers/banking/payos.yml',
      'providers/banking/sepay.yml',
      'providers/banking/payment-service.yml',
    ],
    guide: ['/nap-tien/ngan-hang#cong-thanh-toan-ngan-hang', 'Cổng thanh toán ngân hàng'],
    premium: true,
  },
  {
    slug: 'providers-the-cao',
    title: 'providers/*.yml',
    description: 'API key của các cổng gạch thẻ cào.',
    metaTitle: 'File mẫu cổng gạch thẻ của DotMan',
    metaDescription: 'File cấu hình mẫu của từng cổng gạch thẻ trong DotMan: Card2K, TheSieuRe, GameBank, GachThe1s và GachThe5s.',
    files: [
      'providers/card2k.yml',
      'providers/thesieure.yml',
      'providers/gamebank.yml',
      'providers/gachthe1s.yml',
      'providers/gachthe5s.yml',
    ],
    guide: ['/nap-tien/the-cao#chon-cong-gach-the', 'Chọn cổng gạch thẻ'],
  },
  {
    slug: 'khuyenmai-yml',
    title: 'khuyenmai.yml',
    description: 'Lịch khuyến mãi và thông báo khuyến mãi.',
    metaTitle: 'khuyenmai.yml mẫu của DotMan',
    metaDescription: 'File khuyenmai.yml mặc định của DotMan: lịch khuyến mãi theo ngày cố định hoặc lặp lại theo tuần, và thông báo khuyến mãi.',
    files: ['khuyenmai.yml'],
    guide: ['/khuyen-mai/lich-khuyen-mai', 'Lịch khuyến mãi'],
    tool: ['/cong-cu/lich-khuyen-mai', 'Tạo & kiểm tra lịch khuyến mãi'],
  },
  {
    slug: 'mocnap-yml',
    title: 'mocnap.yml',
    description: 'Mốc nạp cá nhân.',
    metaTitle: 'mocnap.yml mẫu của DotMan',
    metaDescription: 'File mocnap.yml mặc định của DotMan: mốc nạp cá nhân, thưởng khi tổng nạp của người chơi đạt mốc.',
    files: ['mocnap.yml'],
    guide: ['/phan-thuong/moc-nap-ca-nhan', 'Mốc nạp cá nhân'],
    tool: ['/cong-cu/moc-nap-va-thuong-top', 'Tạo mốc nạp & thưởng top'],
  },
  {
    slug: 'mocnaptong-yml',
    title: 'mocnaptong.yml',
    description: 'Mốc nạp tổng của toàn server.',
    metaTitle: 'mocnaptong.yml mẫu của DotMan',
    metaDescription: 'File mocnaptong.yml mặc định của DotMan: mốc nạp tổng của toàn server, kèm bossbar hiển thị tiến độ.',
    files: ['mocnaptong.yml'],
    guide: ['/phan-thuong/moc-nap-tong', 'Mốc nạp tổng server'],
    tool: ['/cong-cu/moc-nap-va-thuong-top', 'Tạo mốc nạp & thưởng top'],
  },
  {
    slug: 'phanthuongtop-yml',
    title: 'phanthuongtop.yml',
    description: 'Phần thưởng top nạp ngày, tuần, tháng.',
    metaTitle: 'phanthuongtop.yml mẫu của DotMan Premium',
    metaDescription: 'File phanthuongtop.yml mặc định của DotMan Premium: phần thưởng tự động cho top nạp theo ngày, tuần, tháng.',
    files: ['phanthuongtop.yml'],
    guide: ['/phan-thuong/phan-thuong-top', 'Phần thưởng top nạp'],
    tool: ['/cong-cu/moc-nap-va-thuong-top', 'Tạo mốc nạp & thưởng top'],
    premium: true,
  },
  {
    slug: 'khungthoigian-yml',
    title: 'khungthoigian.yml',
    description: 'Khung thời gian cho sự kiện.',
    metaTitle: 'khungthoigian.yml mẫu của DotMan Premium',
    metaDescription: 'File khungthoigian.yml mặc định của DotMan Premium: khung thời gian cho các sự kiện như Tết, Giáng sinh.',
    files: ['khungthoigian.yml'],
    guide: ['/phan-thuong/khung-thoi-gian', 'Khung thời gian'],
    premium: true,
  },
  {
    slug: 'discord-yml',
    title: 'discord.yml',
    description: 'Thông báo nạp tiền qua Discord webhook.',
    metaTitle: 'discord.yml mẫu của DotMan',
    metaDescription: 'File discord.yml mặc định của DotMan: thông báo nạp tiền qua Discord webhook dạng embed.',
    files: ['discord.yml'],
    guide: ['/tich-hop/discord-webhook', 'Discord Webhook'],
    tool: ['/cong-cu/thiet-ke-discord-embed', 'Thiết kế Discord Embed'],
  },
  {
    slug: 'menu',
    title: 'menu/*.yml',
    description: 'Giao diện nạp thẻ và giao diện top nạp.',
    metaTitle: 'File giao diện menu mẫu của DotMan',
    metaDescription: 'Các file giao diện menu/*.yml mặc định của DotMan: menu nạp thẻ cào (chọn loại thẻ, mệnh giá) và menu top nạp.',
    files: ['menu/napthe/loaithe.yml', 'menu/napthe/menhgia.yml', 'menu/top.yml'],
    guide: ['/nap-tien/the-cao#giao-dien-nap-the', 'Giao diện nạp thẻ'],
  },
]

// Chuỗi trong frontmatter luôn đặt trong nháy kép: JSON.stringify cho ra chuỗi YAML hợp lệ,
// tránh lỗi khi nội dung có dấu hai chấm kèm khoảng trắng hoặc ký tự đặc biệt
const yamlString = (value) => JSON.stringify(value)

if (!fs.existsSync(SRC)) {
  console.error(`Không tìm thấy thư mục resources: ${SRC}`)
  process.exit(1)
}

fs.mkdirSync(OUT, { recursive: true })

for (const page of PAGES) {
  const blocks = page.files.map((file) => {
    const content = fs.readFileSync(path.join(SRC, file), 'utf8').replace(/\r\n/g, '\n').trimEnd()
    // file trống vẫn cần 1 dòng để code block hiển thị đúng
    return `\`\`\`yaml [${file}]\n${content || '# (file trống)'}\n\`\`\``
  })

  const badge = page.premium ? ' <Badge type="tip" text="Premium" />' : ''
  const [guideLink, guideText] = page.guide
  const toolLine = page.tool ? `\nCông cụ hỗ trợ: [${page.tool[1]}](${page.tool[0]}).\n` : ''
  const md = `---
title: ${yamlString(page.metaTitle ?? page.title)}
description: ${yamlString(page.metaDescription ?? page.description)}
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# ${page.title}${badge}

${page.description}

Hướng dẫn chi tiết: [${guideText}](${guideLink}).
${toolLine}
::: code-group

${blocks.join('\n\n')}

:::
`
  fs.writeFileSync(path.join(OUT, `${page.slug}.md`), md)
  console.log('wrote', `config-mau/${page.slug}.md`)
}
