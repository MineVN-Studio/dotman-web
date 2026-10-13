import { fileURLToPath } from 'node:url'
import { defineConfig, type DefaultTheme, type HeadConfig } from 'vitepress'
import { markdownSourceDevPlugin, pageActionsPlugin, writeMarkdownSources } from './markdown-source'
import { TOOLS } from './tools-list'

const SITE_URL = 'https://dotman.minevn.net'
const SRC_DIR = fileURLToPath(new URL('../docs', import.meta.url))

// VitePress default slugify + chuyển "đ" thành "d" để anchor tiếng Việt gọn hơn
const slugify = (s: string) =>
  s
    .replace(/[đĐ]/g, 'd')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\u0000-\u001f]/g, '')
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()

const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Bắt đầu',
    collapsed: false,
    items: [
      { text: 'Giới thiệu', link: '/docs/huong-dan/gioi-thieu' },
      { text: 'Tính năng', link: '/docs/huong-dan/tinh-nang' },
      { text: 'Cài đặt', link: '/docs/huong-dan/cai-dat' },
      { text: 'Cấu hình chung', link: '/docs/huong-dan/cau-hinh-chung' },
    ],
  },
  {
    text: 'Releases',
    link: '/docs/releases/',
    collapsed: false,
    items: [
      { text: 'DotMan', link: '/docs/releases/dotman' },
      { text: 'MineVNLib', link: '/docs/releases/minevnlib' },
    ],
  },
  {
    text: 'Nạp tiền',
    collapsed: false,
    items: [
      { text: 'Nạp thẻ cào', link: '/docs/nap-tien/the-cao' },
      { text: 'Chuyển khoản ngân hàng', link: '/docs/nap-tien/ngan-hang' },
      { text: 'Nạp thủ công', link: '/docs/nap-tien/thu-cong' },
    ],
  },
  {
    text: 'Khuyến mãi',
    collapsed: false,
    items: [
      { text: 'Lịch khuyến mãi', link: '/docs/khuyen-mai/lich-khuyen-mai' },
      { text: 'Thông báo khuyến mãi', link: '/docs/khuyen-mai/thong-bao' },
      { text: 'Khuyến mãi nạp lần đầu', link: '/docs/khuyen-mai/nap-lan-dau' },
    ],
  },
  {
    text: 'Mốc nạp & top nạp',
    collapsed: false,
    items: [
      { text: 'Mốc nạp cá nhân', link: '/docs/phan-thuong/moc-nap-ca-nhan' },
      { text: 'Mốc nạp tổng server', link: '/docs/phan-thuong/moc-nap-tong' },
      { text: 'Top nạp', link: '/docs/phan-thuong/top-nap' },
      { text: 'Phần thưởng top nạp', link: '/docs/phan-thuong/phan-thuong-top' },
      { text: 'Khung thời gian', link: '/docs/phan-thuong/khung-thoi-gian' },
    ],
  },
  {
    text: 'Quản trị',
    collapsed: false,
    items: [
      { text: 'Bảo mật cấu hình', link: '/docs/quan-tri/bao-mat-cau-hinh' },
      { text: 'Lịch sử và thống kê', link: '/docs/quan-tri/lich-su-va-thong-ke' },
      { text: 'Lệnh thưởng khi offline', link: '/docs/quan-tri/lenh-thuong-offline' },
    ],
  },
  {
    text: 'Tích hợp',
    collapsed: false,
    items: [{ text: 'Discord Webhook', link: '/docs/tich-hop/discord-webhook' }],
  },
  {
    text: 'Tham khảo',
    collapsed: false,
    items: [
      { text: 'Lệnh & permission', link: '/docs/tham-khao/danh-sach-lenh-va-permission' },
      { text: 'Placeholder API', link: '/docs/tham-khao/placeholder-api' },
    ],
  },
  {
    text: 'Công cụ',
    link: '/docs/cong-cu/',
    collapsed: false,
    items: TOOLS.map(({ text, link }) => ({ text, link })),
  },
  {
    text: 'Config mẫu',
    collapsed: true,
    items: [
      { text: 'config.yml', link: '/docs/config-mau/config-yml' },
      { text: 'messages.yml', link: '/docs/config-mau/messages-yml' },
      { text: 'banking.yml', link: '/docs/config-mau/banking-yml' },
      { text: 'providers/banking/*.yml', link: '/docs/config-mau/providers-ngan-hang' },
      { text: 'providers/*.yml', link: '/docs/config-mau/providers-the-cao' },
      { text: 'khuyenmai.yml', link: '/docs/config-mau/khuyenmai-yml' },
      { text: 'mocnap.yml', link: '/docs/config-mau/mocnap-yml' },
      { text: 'mocnaptong.yml', link: '/docs/config-mau/mocnaptong-yml' },
      { text: 'phanthuongtop.yml', link: '/docs/config-mau/phanthuongtop-yml' },
      { text: 'khungthoigian.yml', link: '/docs/config-mau/khungthoigian-yml' },
      { text: 'discord.yml', link: '/docs/config-mau/discord-yml' },
      { text: 'menu/*.yml', link: '/docs/config-mau/menu' },
    ],
  },
]

const SITE_NAME = 'DotMan'
// ảnh khi chia sẻ link, bắt buộc là đường dẫn tuyệt đối
// trang chủ dùng ảnh ngang share.png (tạo lại bằng `bun run dw:share-image`), các trang khác dùng logo vuông
const SHARE_IMAGE_HOME = { url: SITE_URL + '/share.png', width: 1200, height: 630, alt: 'DotMan - Plugin nạp thẻ cho server Minecraft' }
const SHARE_IMAGE = { url: SITE_URL + '/dotman.png', width: 512, height: 512, alt: 'Logo DotMan' }
const PUBLISHER = { '@type': 'Organization', name: 'MineVN Studio', url: 'https://minevn.net/studio' }

function breadcrumbTrail(path: string): { name: string; path: string }[] {
  for (const group of sidebar) {
    if (group.link === path) return [{ name: group.text!, path }]
    const item = group.items?.find((i) => i.link === path)
    if (item) {
      // nhóm không có trang riêng thì trỏ về trang đầu tiên của nhóm (Google yêu cầu mọi mục giữa chuỗi phải có đường dẫn)
      const groupPath = group.link ?? group.items![0].link!
      return [{ name: group.text!, path: groupPath }, { name: item.text!, path }]
    }
  }
  return []
}

export default defineConfig({
  srcDir: 'docs',
  lang: 'vi-VN',
  title: 'DotMan',
  // title đã có chữ DotMan thì không thêm hậu tố, xem transformPageData
  titleTemplate: ':title | DotMan',
  // đồng bộ với tagline trong hero của docs/index.md; các trang không tự khai báo description cũng dùng dòng này
  description:
    'Plugin nạp thẻ cào và chuyển khoản ngân hàng cho server Minecraft Việt Nam, kèm khuyến mãi, mốc nạp, top nạp, thống kê, lịch sử nạp và quản lý dòng tiền.',
  cleanUrls: true,
  // lấy ngày sửa từ git, hiện cuối trang và thêm lastmod vào sitemap
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/dotman.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/dotman.png' }],
    ['meta', { name: 'theme-color', content: '#3ecf8e' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'DotMan' }],
  ],

  sitemap: {
    hostname: SITE_URL,
  },

  vite: {
    plugins: [markdownSourceDevPlugin(SRC_DIR)],
  },

  transformPageData(pageData) {
    if (pageData.frontmatter.titleTemplate === undefined && pageData.title.includes('DotMan')) {
      pageData.titleTemplate = ':title'
    }
  },

  // Ảnh ngang đi với twitter:card summary_large_image để Discord và các nơi khác hiện ảnh lớn bên dưới embed.
  // Logo vuông đi với summary để hiện dạng ảnh nhỏ (thumbnail) góc phải của embed.
  transformHead({ pageData, description }) {
    if (pageData.isNotFound) return [['meta', { name: 'robots', content: 'noindex, nofollow' }]]

    // index.md thành thư mục gốc, còn lại bỏ đuôi .md (cleanUrls): docs/huong-dan/cai-dat.md thành /docs/huong-dan/cai-dat
    const path = '/' + pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const url = SITE_URL + path

    const isHome = pageData.relativePath === 'index.md'
    const image = isHome ? SHARE_IMAGE_HOME : SHARE_IMAGE
    const ldJson = (data: object): HeadConfig => ['script', { type: 'application/ld+json' }, JSON.stringify(data)]

    const structured: HeadConfig[] = []
    if (isHome) {
      structured.push(
        ldJson({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          alternateName: 'DotMan - Donation Manager',
          url: SITE_URL + '/',
          inLanguage: 'vi-VN',
          description,
          publisher: PUBLISHER,
        }),
        ldJson({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'DotMan',
          alternateName: 'Plugin nạp thẻ cho server Minecraft Việt Nam',
          applicationCategory: 'GameApplication',
          operatingSystem: 'Spigot, Paper, Folia',
          url: SITE_URL + '/',
          description,
          publisher: PUBLISHER,
          offers: [
            { '@type': 'Offer', name: 'Miễn phí', price: 0, priceCurrency: 'VND' },
            { '@type': 'Offer', name: 'Premium', price: 349000, priceCurrency: 'VND' },
          ],
        }),
      )
    } else {
      const trail = breadcrumbTrail(path)
      if (trail.length) {
        const items = [{ name: 'DotMan', path: '/' }, ...trail]
        structured.push(
          ldJson({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items.map((it, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: it.name,
              item: SITE_URL + it.path,
            })),
          }),
        )
      }
    }

    return [
      // cho phép Google hiện đoạn trích và ảnh xem trước đầy đủ
      ['meta', { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' }],
      ...(isHome ? [['link', { rel: 'preload', as: 'image', href: '/dotman.png' }] as HeadConfig] : []),
      ...structured,
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:locale', content: 'vi_VN' }],
      ['meta', { property: 'og:title', content: pageData.title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:card', content: isHome ? 'summary_large_image' : 'summary' }],
      ['meta', { property: 'og:image', content: image.url }],
      ['meta', { property: 'og:image:type', content: 'image/png' }],
      ['meta', { property: 'og:image:width', content: String(image.width) }],
      ['meta', { property: 'og:image:height', content: String(image.height) }],
      ['meta', { property: 'og:image:alt', content: image.alt }],
      ['meta', { name: 'twitter:image', content: image.url }],
      ['meta', { name: 'twitter:image:alt', content: image.alt }],
    ]
  },

  // xuất markdown gốc của từng trang để nút "Sao chép Markdown", "Mở bằng ChatGPT/Claude" dùng
  buildEnd(siteConfig) {
    writeMarkdownSources(siteConfig.srcDir, siteConfig.outDir, siteConfig.pages)
  },

  markdown: {
    anchor: { slugify },
    config: (md) => {
      md.use(pageActionsPlugin)
    },
    container: {
      tipLabel: 'Mẹo',
      infoLabel: 'Ghi chú',
      warningLabel: 'Lưu ý',
      dangerLabel: 'Cảnh báo',
      detailsLabel: 'Chi tiết',
    },
  },

  themeConfig: {
    logo: '/dotman.png',
    siteTitle: 'DotMan',

    nav: [
      {
        text: 'Hướng dẫn',
        link: '/docs',
        activeMatch: '^/docs($|/(huong-dan|nap-tien|khuyen-mai|phan-thuong|tich-hop|quan-tri)/)',
      },
      { text: 'Lệnh & permission', link: '/docs/tham-khao/danh-sach-lenh-va-permission', activeMatch: '^/docs/tham-khao/' },
      { text: 'Releases', link: '/docs/releases/', activeMatch: '^/docs/releases/' },
      {
        text: 'Công cụ',
        items: [
          { text: 'Tất cả công cụ', link: '/docs/cong-cu/' },
          { items: TOOLS.map(({ text, link }) => ({ text, link })) },
        ],
      },
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/minevn/dotman' },
      { icon: 'discord', link: 'https://minevn.net/studio' },
    ],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Tìm kiếm', buttonAriaLabel: 'Tìm kiếm' },
          modal: {
            displayDetails: 'Hiển thị chi tiết',
            resetButtonTitle: 'Xóa tìm kiếm',
            backButtonTitle: 'Đóng tìm kiếm',
            noResultsText: 'Không tìm thấy kết quả cho',
            footer: {
              selectText: 'chọn',
              navigateText: 'di chuyển',
              closeText: 'đóng',
            },
          },
        },
      },
    },

    outline: { level: [2, 3], label: 'Trên trang này' },
    docFooter: { prev: 'Trang trước', next: 'Trang sau' },
    lastUpdated: { text: 'Cập nhật lần cuối', formatOptions: { dateStyle: 'long', forceLocale: true } },
    notFound: {
      title: 'KHÔNG TÌM THẤY TRANG',
      quote: 'Trang bạn tìm không tồn tại hoặc đã được di chuyển.',
      linkLabel: 'Về trang chủ',
      linkText: 'Về trang chủ',
    },
    langMenuLabel: 'Đổi ngôn ngữ',
    returnToTopLabel: 'Lên đầu trang',
    sidebarMenuLabel: 'Danh mục',
    darkModeSwitchLabel: 'Giao diện',
    lightModeSwitchTitle: 'Chuyển sang giao diện sáng',
    darkModeSwitchTitle: 'Chuyển sang giao diện tối',
    skipToContentLabel: 'Đi tới nội dung',
  },
})
