// Cho các khối của trang chủ hiện dần khi cuộn tới (CSS ở home.css, lớp .reveal và .is-in).
// Lớp .reveal chỉ được thêm bằng JavaScript và bỏ qua khối đã nằm trong màn hình lúc tải,
// nên khi chưa chạy JS hoặc bật giảm chuyển động thì nội dung vẫn hiện bình thường, không bị nháy.

interface Target {
  selector: string
  /** các khối cùng nhóm hiện lệch nhau `step` ms, lặp lại sau mỗi `per` khối (ví dụ 3 thẻ mỗi hàng) */
  step: number
  per: number
}

const TARGETS: Target[] = [
  { selector: '.VPHome .home-intro', step: 0, per: 1 },
  // tiêu đề và đoạn mô tả của các khối bên dưới (trừ dòng dẫn tới trang Tính năng đã tự hiện dần)
  { selector: '.VPHome .home-section:not(.home-more) > h2, .VPHome .home-section:not(.home-more) > p', step: 0, per: 1 },
  { selector: '.VPHome .VPFeature', step: 90, per: 3 },
  { selector: '.VPHome .home-more', step: 0, per: 1 },
  { selector: '.VPHome .home-trial', step: 0, per: 1 },
  { selector: '.VPHome .home-stats .head', step: 0, per: 1 },
  { selector: '.VPHome .home-stats .card', step: 90, per: 2 },
  { selector: '.VPHome .home-gateways .tile', step: 70, per: 3 },
  { selector: '.VPHome .home-quickstart .step', step: 90, per: 4 },
  { selector: '.VPHome .home-tools .tool-card', step: 90, per: 3 },
  { selector: '.VPHome .home-pricing .plan', step: 120, per: 2 },
  { selector: '.VPHome .home-faq .faq', step: 60, per: 3 },
  { selector: '.VPHome .home-outro .actions', step: 0, per: 1 },
]

/** Bắt đầu theo dõi trang chủ, trả về hàm dọn dẹp. */
export function setupReveal(): () => void {
  if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  // phần tử đã xử lý một lần thì không xét lại, tránh đo bố cục lặp đi lặp lại
  const seen = new WeakSet<Element>()

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        el.classList.add('is-in')
        io.unobserve(el)
        // hiện xong thì gỡ lớp để trình duyệt giải phóng animation và lớp GPU đang giữ trạng thái cuối
        const done = (ev: AnimationEvent) => {
          // animation của phần tử con cũng nổi lên tới đây, chỉ xử lý khi là của chính phần tử này
          if (ev.target !== el) return
          el.removeEventListener('animationend', done)
          el.classList.remove('reveal', 'is-in')
          el.style.removeProperty('--d')
        }
        el.addEventListener('animationend', done)
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )

  function scan() {
    const viewport = window.innerHeight - 40
    for (const { selector, step, per } of TARGETS) {
      document.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
        if (seen.has(el)) return
        seen.add(el)
        // đã nằm trong màn hình lúc tải thì để yên, tránh nháy mất rồi hiện lại
        if (el.getBoundingClientRect().top < viewport) return
        el.classList.add('reveal')
        el.style.setProperty('--d', `${(i % per) * step}ms`)
        io.observe(el)
      })
    }
  }

  scan()

  // các khối được vẽ sau khi tải dữ liệu (số liệu bStats) cũng cần được theo dõi.
  // Chỉ quan tâm khi có phần tử mới được thêm vào: số đếm đổi chữ mỗi khung hình không được kích hoạt lại việc quét.
  const home = document.querySelector('.VPHome')
  let pending = 0
  const mo = new MutationObserver((mutations) => {
    if (!mutations.some((m) => [...m.addedNodes].some((n) => n.nodeType === Node.ELEMENT_NODE))) return
    cancelAnimationFrame(pending)
    pending = requestAnimationFrame(scan)
  })
  if (home) mo.observe(home, { childList: true, subtree: true })

  return () => {
    cancelAnimationFrame(pending)
    mo.disconnect()
    io.disconnect()
  }
}
