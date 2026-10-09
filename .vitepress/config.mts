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
      { text: 'Giới thiệu', link: '/huong-dan/gioi-thieu' },
      { text: 'Tính năng', link: '/huong-dan/tinh-nang' },
      { text: 'Cài đặt', link: '/huong-dan/cai-dat' },
      { text: 'Cấu hình chung', link: '/huong-dan/cau-hinh-chung' },
    ],
  },
  {
    text: 'Releases',
    link: '/releases/',
    collapsed: false,
    items: [
      { text: 'DotMan', link: '/releases/dotman' },
      { text: 'MineVNLib', link: '/releases/minevnlib' },
    ],
  },
  {
    text: 'Nạp tiền',
    collapsed: false,
    items: [
      { text: 'Nạp thẻ cào', link: '/nap-tien/the-cao' },
      { text: 'Chuyển khoản ngân hàng', link: '/nap-tien/ngan-hang' },
      { text: 'Nạp thủ công', link: '/nap-tien/thu-cong' },
    ],
  },
  {
    text: 'Khuyến mãi',
    collapsed: false,
    items: [
      { text: 'Lịch khuyến mãi', link: '/khuyen-mai/lich-khuyen-mai' },
      { text: 'Thông báo khuyến mãi', link: '/khuyen-mai/thong-bao' },
      { text: 'Khuyến mãi nạp lần đầu', link: '/khuyen-mai/nap-lan-dau' },
    ],
  },
  {
    text: 'Mốc nạp & top nạp',
    collapsed: false,
    items: [
      { text: 'Mốc nạp cá nhân', link: '/phan-thuong/moc-nap-ca-nhan' },
      { text: 'Mốc nạp tổng server', link: '/phan-thuong/moc-nap-tong' },
      { text: 'Top nạp', link: '/phan-thuong/top-nap' },
      { text: 'Phần thưởng top nạp', link: '/phan-thuong/phan-thuong-top' },
      { text: 'Khung thời gian', link: '/phan-thuong/khung-thoi-gian' },
    ],
  },
  {
    text: 'Quản trị',
    collapsed: false,
    items: [
      { text: 'Bảo mật cấu hình', link: '/quan-tri/bao-mat-cau-hinh' },
      { text: 'Lịch sử và thống kê', link: '/quan-tri/lich-su-va-thong-ke' },
      { text: 'Lệnh thưởng khi offline', link: '/quan-tri/lenh-thuong-offline' },
    ],
  },
  {
    text: 'Tích hợp',
    collapsed: false,
    items: [{ text: 'Discord Webhook', link: '/tich-hop/discord-webhook' }],
  },
  {
    text: 'Tham khảo',
    collapsed: false,
    items: [
      { text: 'Lệnh & permission', link: '/tham-khao/danh-sach-lenh-va-permission' },
      { text: 'Placeholder API', link: '/tham-khao/placeholder-api' },
    ],
  },
  {
    text: 'Công cụ',
    link: '/cong-cu/',
    collapsed: false,
    items: TOOLS.map(({ text, link }) => ({ text, link })),
  },
  {
    text: 'Config mẫu',
    collapsed: true,
    items: [
      { text: 'config.yml', link: '/config-mau/config-yml' },
      { text: 'messages.yml', link: '/config-mau/messages-yml' },
      { text: 'banking.yml', link: '/config-mau/banking-yml' },
      { text: 'providers/banking/*.yml', link: '/config-mau/providers-ngan-hang' },
      { text: 'providers/*.yml', link: '/config-mau/providers-the-cao' },
      { text: 'khuyenmai.yml', link: '/config-mau/khuyenmai-yml' },
      { text: 'mocnap.yml', link: '/config-mau/mocnap-yml' },
      { text: 'mocnaptong.yml', link: '/config-mau/mocnaptong-yml' },
      { text: 'phanthuongtop.yml', link: '/config-mau/phanthuongtop-yml' },
      { text: 'khungthoigian.yml', link: '/config-mau/khungthoigian-yml' },
      { text: 'discord.yml', link: '/config-mau/discord-yml' },
      { text: 'menu/*.yml', link: '/config-mau/menu' },
    ],
  },
]

const SITE_NAME = 'DotMan - Donation Manager'
// ảnh hiện khi chia sẻ link (phải là đường dẫn tuyệt đối), file nằm trong docs/public
const SHARE_IMAGE = { url: SITE_URL + '/dotman.png', width: 512, height: 512, alt: 'Logo DotMan' }
const PUBLISHER = { '@type': 'Organization', name: 'MineVN Studio', url: 'https://minevn.net/studio' }

/** Đường dẫn các cấp của một trang trong sidebar, dùng cho breadcrumb: [{ name, path }] (không gồm trang chủ) */
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

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: 'docs',
  lang: 'vi-VN',
  title: 'DotMan',
  titleTemplate: ':title',
  // đồng bộ với tagline trong hero của docs/index.md; các trang không tự khai báo description cũng dùng dòng này
  description:
    'Giải pháp quản lý dòng tiền cho server Minecraft Việt Nam, dễ dàng tích hợp các cổng thanh toán thẻ cào và ngân hàng. Với các tính năng quản trị, thống kê, lịch sử giao dịch và khuyến mãi.',
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/dotman.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/dotman.png' }],
    ['meta', { name: 'theme-color', content: '#3ecf8e' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'DotMan Docs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
  ],

  sitemap: {
    hostname: SITE_URL,
  },

  vite: {
    plugins: [markdownSourceDevPlugin(SRC_DIR)],
  },

  // Thẻ riêng cho từng trang để link gửi lên Discord, Facebook, Zalo, Google hiển thị đúng tiêu đề và mô tả.
  // Ảnh chia sẻ hiện là logo vuông dotman.png: với twitter:card là summary, Discord và các nơi khác hiện nó dạng ảnh nhỏ (thumbnail) góc phải của embed.
  // Khi có ảnh ngang 1200x630 thì đổi SHARE_IMAGE và twitter:card thành summary_large_image để ảnh hiện lớn bên dưới.
  transformHead({ pageData, description }) {
    // trang lỗi 404 không được lập chỉ mục
    if (pageData.isNotFound) return [['meta', { name: 'robots', content: 'noindex, nofollow' }]]

    // index.md thành thư mục gốc, còn lại bỏ đuôi .md (cleanUrls): huong-dan/cai-dat.md thành /huong-dan/cai-dat
    const path = '/' + pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const url = SITE_URL + path

    const isHome = pageData.relativePath === 'index.md'
    const ldJson = (data: object): HeadConfig => ['script', { type: 'application/ld+json' }, JSON.stringify(data)]

    const structured: HeadConfig[] = []
    if (isHome) {
      // dữ liệu có cấu trúc của trang chủ: tên site, ngôn ngữ và đơn vị phát hành
      structured.push(
        ldJson({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL + '/',
          inLanguage: 'vi-VN',
          description,
          publisher: PUBLISHER,
        }),
      )
    } else {
      // breadcrumb (DotMan > Nhóm > Trang) để Google hiện đường dẫn thay cho URL thô trong kết quả tìm kiếm
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
      // tiêu đề thuần, không kèm hậu tố " | DotMan Docs" của titleTemplate vì og:site_name đã hiện tên site
      ['meta', { property: 'og:title', content: pageData.title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: SHARE_IMAGE.url }],
      ['meta', { property: 'og:image:type', content: 'image/png' }],
      ['meta', { property: 'og:image:width', content: String(SHARE_IMAGE.width) }],
      ['meta', { property: 'og:image:height', content: String(SHARE_IMAGE.height) }],
      ['meta', { property: 'og:image:alt', content: SHARE_IMAGE.alt }],
      ['meta', { name: 'twitter:image', content: SHARE_IMAGE.url }],
      ['meta', { name: 'twitter:image:alt', content: SHARE_IMAGE.alt }],
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
    // https://vitepress.dev/reference/default-theme-config
    logo: '/dotman.png',
    siteTitle: 'DotMan',

    nav: [
      {
        text: 'Hướng dẫn',
        link: '/huong-dan/gioi-thieu',
        activeMatch: '^/(huong-dan|nap-tien|khuyen-mai|phan-thuong|tich-hop|quan-tri)/',
      },
      { text: 'Lệnh & permission', link: '/tham-khao/danh-sach-lenh-va-permission', activeMatch: '^/tham-khao/' },
      { text: 'Releases', link: '/releases/', activeMatch: '^/releases/' },
      {
        text: 'Công cụ',
        items: [
          { text: 'Tất cả công cụ', link: '/cong-cu/' },
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
