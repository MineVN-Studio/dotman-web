// Tooltip dùng chung cho các công cụ: v-tip="'nội dung'", hiện ngay khi rê chuột hoặc focus bằng bàn phím.
// Chỉ có một phần tử tooltip gắn vào body nên không bị khung có overflow: hidden cắt mất.
import type { Directive } from 'vue'

const GAP = 8
const MARGIN = 8

let tip: HTMLDivElement | undefined
let current: HTMLElement | undefined
const texts = new WeakMap<HTMLElement, string>()

function tipEl() {
  if (!tip) {
    tip = document.createElement('div')
    tip.className = 'tool-tip'
    tip.setAttribute('role', 'tooltip')
    document.body.appendChild(tip)
  }
  return tip
}

function show(target: HTMLElement) {
  const text = texts.get(target)
  if (!text) return hide()
  current = target
  const el = tipEl()
  el.textContent = text
  el.classList.remove('below')
  el.classList.add('show')

  const r = target.getBoundingClientRect()
  const w = el.offsetWidth
  const h = el.offsetHeight
  // mặc định ở trên, không đủ chỗ thì lật xuống dưới
  let top = r.top - h - GAP
  if (top < MARGIN) {
    top = r.bottom + GAP
    el.classList.add('below')
  }
  const left = Math.min(Math.max(r.left + r.width / 2 - w / 2, MARGIN), window.innerWidth - w - MARGIN)
  el.style.top = `${top}px`
  el.style.left = `${left}px`
}

function hide() {
  current = undefined
  tip?.classList.remove('show')
}

const onEnter = (e: Event) => show(e.currentTarget as HTMLElement)

let listening = false
function listenGlobal() {
  if (listening) return
  listening = true
  // tooltip dùng position: fixed nên ẩn khi cuộn trang để không lệch khỏi phần tử
  window.addEventListener('scroll', hide, { capture: true, passive: true })
}

export const vTip: Directive<HTMLElement, string | undefined> = {
  mounted(el, { value }) {
    texts.set(el, value ?? '')
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('focusin', onEnter)
    el.addEventListener('mouseleave', hide)
    el.addEventListener('focusout', hide)
    listenGlobal()
  },
  updated(el, { value }) {
    texts.set(el, value ?? '')
    if (current === el) show(el)
  },
  beforeUnmount(el) {
    if (current === el) hide()
    el.removeEventListener('mouseenter', onEnter)
    el.removeEventListener('focusin', onEnter)
    el.removeEventListener('mouseleave', hide)
    el.removeEventListener('focusout', hide)
  },
}
