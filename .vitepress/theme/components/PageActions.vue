<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const copied = ref(false)
const menuOpen = ref(false)
const root = ref<HTMLElement>()

// File markdown gốc được phục vụ cùng đường dẫn với trang, ví dụ /docs/huong-dan/cai-dat.md
const markdownPath = computed(() => '/' + page.value.relativePath)

function markdownUrl() {
  return window.location.origin + markdownPath.value
}

function fetchUrl() {
  // dev server cần query riêng để trả về markdown thô thay vì module của trang
  return import.meta.env.DEV ? `${markdownPath.value}?dotman-md` : markdownPath.value
}

function prompt() {
  return `Đọc ${markdownUrl()}, tôi muốn hỏi một số câu hỏi về nội dung này.`
}

// Icon: OpenAI, Gemini từ @lobehub/icons (MIT), Claude và Markdown từ Simple Icons (CC0)
const ICONS = {
  openai:
    'M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z',
  claude:
    'm4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z',
  gemini:
    'M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z',
  markdown:
    'M22.27 19.385H1.73A1.73 1.73 0 010 17.655V6.345a1.73 1.73 0 011.73-1.73h20.54A1.73 1.73 0 0124 6.345v11.308a1.73 1.73 0 01-1.73 1.731zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.46v7.847zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.461 4.039z',
}

const targets = computed(() => [
  {
    name: 'ChatGPT',
    icon: ICONS.openai,
    color: 'currentColor',
    href: () => `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt())}`,
  },
  {
    name: 'Claude',
    icon: ICONS.claude,
    color: '#D97757',
    href: () => `https://claude.ai/new?q=${encodeURIComponent(prompt())}`,
  },
  {
    name: 'Gemini',
    icon: ICONS.gemini,
    color: '#3186FF',
    href: () => 'https://gemini.google.com/app',
    // Gemini không nhận câu hỏi qua URL: sao chép sẵn để người dùng dán vào
    copyPrompt: true,
  },
  { name: 'Xem Markdown', icon: ICONS.markdown, color: 'currentColor', href: () => fetchUrl() },
])

async function copyMarkdown() {
  try {
    const res = await fetch(fetchUrl())
    if (!res.ok) throw new Error(String(res.status))
    await navigator.clipboard.writeText(await res.text())
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    console.error('Không sao chép được markdown', e)
  }
}

const notice = ref('')

function open(target: { name: string; href: () => string; copyPrompt?: boolean }) {
  if (target.copyPrompt) {
    // gọi trước window.open để trang còn focus khi ghi clipboard
    navigator.clipboard.writeText(prompt()).then(
      () => showNotice(`Đã sao chép câu hỏi, dán vào ${target.name} bằng Ctrl + V.`),
      () => showNotice(`Không sao chép được câu hỏi, hãy dán link trang này vào ${target.name}.`),
    )
  }
  window.open(target.href(), '_blank', 'noopener')
  menuOpen.value = false
}

function showNotice(text: string) {
  notice.value = text
  setTimeout(() => (notice.value = ''), 5000)
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) menuOpen.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="root" class="page-actions">
    <button class="action" type="button" @click="copyMarkdown">
      <svg v-if="!copied" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {{ copied ? 'Đã sao chép' : 'Sao chép Markdown' }}
    </button>

    <div class="dropdown">
      <button class="action" type="button" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
        Mở bằng
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div v-if="menuOpen" class="menu" role="menu">
        <button v-for="t in targets" :key="t.name" class="menu-item" type="button" role="menuitem" @click="open(t)">
          <span class="menu-label">
            <svg class="brand" viewBox="0 0 24 24" width="16" height="16" :fill="t.color" aria-hidden="true">
              <path :d="t.icon" fill-rule="evenodd" />
            </svg>
            {{ t.name }}
          </span>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </button>
      </div>
    </div>
    <span v-if="notice" class="notice" role="status">{{ notice }}</span>
  </div>
</template>

<style scoped>
.page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  line-height: 22px;
  transition: color 0.25s, border-color 0.25s;
}

.action:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}

.dropdown {
  position: relative;
}

.menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  min-width: 210px;
  padding: 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  text-align: left;
}

.notice {
  align-self: center;
  font-size: 13px;
  color: var(--vp-c-brand-1);
}

.menu-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.brand {
  flex-shrink: 0;
}

.menu-item:hover {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-brand-1);
}
</style>
