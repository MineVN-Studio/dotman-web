<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
// API nội bộ của VitePress: danh sách callback đăng ký qua onContentUpdated (mục lục bên phải dùng nó)
import { contentUpdatedCallbacks } from 'vitepress/dist/client/app/utils.js'
import { getScrollOffset } from 'vitepress'
import { Download } from 'lucide-vue-next'
import { data, type Release } from '../../../docs/docs/releases/releases.data'

type Channel = 'stable' | 'beta' | 'all'

const props = defineProps<{ project: string }>()

const project = computed(() => data.projects[props.project])
const releases = computed(() => project.value?.releases ?? [])
const latest = computed(() => releases.value.find((r) => r.latest))
// bản beta mới hơn bản stable mới nhất (nếu có)
const newerBeta = computed(() => {
  const first = releases.value[0]
  return first && first.prerelease && !first.latest ? first : undefined
})

/** File để tải: ưu tiên file .jar, release không có jar thì hiện tất cả file đính kèm */
function downloadFiles(r: Release) {
  const jars = r.assets.filter((a) => /\.jar$/i.test(a.name))
  return jars.length ? jars : r.assets
}

const channel = ref<Channel>('stable')
const query = ref('')
const hideEmpty = ref(true)

const counts = computed(() => ({
  stable: releases.value.filter((r) => !r.prerelease).length,
  beta: releases.value.filter((r) => r.prerelease).length,
  all: releases.value.length,
}))
const channels = computed(() => [
  { value: 'stable' as const, label: 'Stable', count: counts.value.stable },
  { value: 'beta' as const, label: 'Beta', count: counts.value.beta },
  { value: 'all' as const, label: 'Tất cả', count: counts.value.all },
])

const inChannel = computed(() =>
  releases.value.filter((r) => channel.value === 'all' || (channel.value === 'beta') === r.prerelease),
)
const emptyCount = computed(() => inChannel.value.filter((r) => !r.hasNotes).length)

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  return inChannel.value.filter((r) => {
    if (hideEmpty.value && !r.hasNotes && !q) return false
    return !q || r.search.includes(q)
  })
})

// danh sách thay đổi thì tính lại mục lục bên phải
watch(visible, () => contentUpdatedCallbacks.forEach((fn) => fn()), { flush: 'post' })

/** Chuyển sang kênh chứa release rồi cuộn tới release đó */
async function showRelease(id: string, behavior: ScrollBehavior = 'smooth') {
  const r = releases.value.find((x) => x.id === id)
  if (!r) return
  if (r.prerelease && channel.value === 'stable') channel.value = 'beta'
  if (!r.hasNotes) hideEmpty.value = false
  await nextTick()
  const el = document.getElementById(id)
  // trừ chiều cao thanh điều hướng cố định phía trên
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - getScrollOffset() - 16, behavior })
  history.replaceState(history.state, '', '#' + id)
}

// mở link tới một bản beta (hoặc bản không có ghi chú): tự chuyển bộ lọc để hiện bản đó
function showHashRelease() {
  const id = decodeURIComponent(location.hash.slice(1))
  if (id && releases.value.some((r) => r.id === id)) showRelease(id, 'auto')
}

onMounted(() => {
  showHashRelease()
  window.addEventListener('hashchange', showHashRelease)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', showHashRelease))
</script>

<template>
  <div v-if="project" class="releases">
    <p v-if="project.error" class="warning custom-block">
      Không tải được dữ liệu release từ GitHub, hãy xem trực tiếp tại
      <a :href="project.releasesUrl" target="_blank" rel="noreferrer">GitHub Releases</a>.
    </p>

    <template v-else>
      <div class="downloads">
        <section v-if="latest" class="dl-card">
          <div class="dl-head">
            <span class="dl-channel">Stable</span>
            <span class="badge latest">Mới nhất</span>
          </div>
          <div class="dl-ver">
            <a class="dl-version" :href="`#${latest.id}`">{{ latest.tag }}</a>
            <span class="dl-date">{{ latest.date }}</span>
          </div>
          <p class="dl-note">Phiên bản ổn định để sử dụng cho server chính.</p>
          <div class="dl-files">
            <a v-for="a in downloadFiles(latest)" :key="a.url" class="dl-btn" :href="a.url" rel="noreferrer">
              <Download :size="16" aria-hidden="true" />
              <span class="dl-info">
                <span class="dl-name">{{ a.name }}</span>
                <span class="dl-size">{{ a.size }}</span>
              </span>
            </a>
          </div>
        </section>

        <section v-if="newerBeta" class="dl-card beta">
          <div class="dl-head">
            <span class="dl-channel">Beta</span>
            <span class="badge pre">Thử nghiệm</span>
          </div>
          <div class="dl-ver">
            <a class="dl-version" :href="`#${newerBeta.id}`" @click.prevent="showRelease(newerBeta.id)">{{ newerBeta.tag }}</a>
            <span class="dl-date">{{ newerBeta.date }}</span>
          </div>
          <p class="dl-note">Phiên bản thử nghiệm các tính năng mới, có thể có lỗi khi dùng trên server chính.</p>
          <div class="dl-files">
            <a v-for="a in downloadFiles(newerBeta)" :key="a.url" class="dl-btn" :href="a.url" rel="noreferrer">
              <Download :size="16" aria-hidden="true" />
              <span class="dl-info">
                <span class="dl-name">{{ a.name }}</span>
                <span class="dl-size">{{ a.size }}</span>
              </span>
            </a>
          </div>
        </section>
      </div>

      <p class="dl-meta">
        <a :href="project.releasesUrl" target="_blank" rel="noreferrer">
          {{ releases.length }} bản phát hành trên GitHub
        </a>
        <span>Đồng bộ ngày {{ data.syncedAt }}</span>
      </p>

      <div class="controls">
        <div v-if="counts.beta > 0" class="channels" role="radiogroup" aria-label="Kênh phát hành">
          <button v-for="c in channels" :key="c.value" type="button" role="radio" class="channel"
            :class="{ active: channel === c.value }" :aria-checked="channel === c.value" @click="channel = c.value">
            {{ c.label }} <span class="channel-count">{{ c.count }}</span>
          </button>
        </div>
        <input v-model="query" type="search" class="filter" :placeholder="`Lọc ${inChannel.length} bản phát hành`"
          aria-label="Lọc bản phát hành" />
        <label v-if="emptyCount > 0" class="toggle">
          <input v-model="hideEmpty" type="checkbox" />
          Ẩn {{ emptyCount }} bản không có changelog
        </label>
      </div>

      <p v-if="visible.length === 0" class="empty">Không có bản phát hành nào khớp.</p>

      <article v-for="r in visible" :key="r.id" class="release">
        <div class="release-head">
          <h2 :id="r.id">
            {{ r.tag }}
            <a class="header-anchor" :href="`#${r.id}`" :aria-label="`Liên kết tới ${r.tag}`" />
          </h2>
          <time :datetime="r.datetime">{{ r.date }}</time>
          <span v-if="r.latest" class="badge latest">Mới nhất</span>
          <span v-if="r.prerelease" class="badge pre">Beta</span>
        </div>
        <p v-if="r.title" class="release-title">{{ r.title }}</p>
        <div v-if="r.hasNotes" class="release-body" v-html="r.html" />
        <p v-else class="release-empty">Bản phát hành này không có changelog.</p>

        <details v-if="r.assets.length" class="assets">
          <summary>{{ r.assets.length }} file đính kèm</summary>
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Dung lượng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in r.assets" :key="a.url">
                <td><a :href="a.url" target="_blank" rel="noreferrer">{{ a.name }}</a></td>
                <td>{{ a.size }}</td>
              </tr>
            </tbody>
          </table>
        </details>

        <p class="release-links">
          <a :href="r.url" target="_blank" rel="noreferrer">Xem trên GitHub</a>
          <a v-if="r.compareUrl" :href="r.compareUrl" target="_blank" rel="noreferrer">Toàn bộ thay đổi</a>
        </p>
      </article>
    </template>
  </div>
</template>

<style scoped>
.downloads {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 24px 0 12px;
}

@media (min-width: 640px) {
  .downloads {
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  }
}

.dl-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
}

.dl-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dl-channel {
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
}

.dl-ver {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dl-version {
  color: var(--vp-c-brand-1);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.dl-card.beta .dl-version {
  color: var(--vp-c-warning-1);
}

.dl-date {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.dl-note {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.5;
}

/* đẩy nút xuống đáy thẻ để các thẻ có ghi chú dài ngắn khác nhau vẫn có nút thẳng hàng */
.dl-files {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
}

.dl-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 9px 10px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  text-decoration: none;
  transition: color 0.2s, background-color 0.2s;
}

.dl-btn:hover {
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}

.dl-card.beta .dl-btn {
  border-color: var(--vp-c-warning-1);
  color: var(--vp-c-warning-1);
}

.dl-card.beta .dl-btn:hover {
  background-color: var(--vp-c-warning-1);
  color: var(--vp-c-white);
}

.dl-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.dl-name {
  font-size: 12.5px;
  overflow-wrap: anywhere;
}

.dl-size {
  font-size: 12px;
  font-weight: 500;
  opacity: 0.8;
}

.dl-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin: 24px 0;
}

.channels {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background-color: var(--vp-c-bg-soft);
}

.channel {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 7px;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s, background-color 0.2s;
}

.channel:hover {
  color: var(--vp-c-text-1);
}

.channel.active {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-1);
}

.channel-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.filter {
  flex: 1 1 240px;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 14px;
  transition: border-color 0.25s;
}

.filter:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
}

.empty {
  color: var(--vp-c-text-2);
}

.release {
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.release + .release {
  margin-top: 32px;
}

.release-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
}

.release-head h2 {
  margin: 0;
  padding-top: 0;
  border-top: none;
}

.release-head h2 .header-anchor {
  top: 0;
}

.release-head time {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.badge {
  padding: 1px 8px;
  border: 1px solid;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
}

.badge.latest {
  color: var(--vp-c-brand-1);
}

.badge.pre {
  color: var(--vp-c-warning-1);
}

.release-title {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.release-empty {
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.assets summary {
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.assets table {
  margin-top: 12px;
  font-size: 14px;
}

.release-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
}
</style>
