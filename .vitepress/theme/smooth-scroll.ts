// Chỉ bật cuộn mượt ngay sau khi bấm link nhảy tới mục trong cùng trang (mục lục "Trên trang này", nút #dung-thu, link #anchor).
// Không đặt scroll-behavior cố định trên <html> vì khi chuyển trang VitePress cũng gọi scrollTo(0, 0), sẽ bị cuộn lên đầu từ từ.

const ACTIVE_CLASS = 'smooth-scroll'
// đủ lâu cho một lần cuộn dài, hết thời gian thì gỡ lớp để các lần cuộn khác trở lại mặc định
const ACTIVE_MS = 1200

export function setupSmoothScroll(): () => void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  const root = document.documentElement
  let timer = 0

  const onClick = (e: MouseEvent) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const link = (e.target as Element).closest?.<HTMLAnchorElement>('a[href*="#"]')
    if (!link || link.target || !link.hash) return
    if (link.origin !== location.origin || link.pathname !== location.pathname) return

    root.classList.add(ACTIVE_CLASS)
    window.clearTimeout(timer)
    timer = window.setTimeout(() => root.classList.remove(ACTIVE_CLASS), ACTIVE_MS)
  }

  // router của VitePress cũng bắt click ở pha capture rồi mới cuộn ở khung hình kế tiếp (requestAnimationFrame),
  // nên lớp thêm ở đây vẫn kịp có trước khi trang cuộn
  window.addEventListener('click', onClick, true)

  return () => {
    window.clearTimeout(timer)
    root.classList.remove(ACTIVE_CLASS)
    window.removeEventListener('click', onClick, true)
  }
}
