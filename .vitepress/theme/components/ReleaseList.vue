<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
// API nội bộ của VitePress: danh sách callback đăng ký qua onContentUpdated (mục lục bên phải dùng nó)
import { contentUpdatedCallbacks } from 'vitepress/dist/client/app/utils.js'
import { getScrollOffset } from 'vitepress'
import { data } from '../../../docs/docs/releases/releases.data'

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
      <div class="summary">
        <div class="summary-latest">
          <span class="summary-label">Phiên bản mới nhất</span>
          <a v-if="latest" class="summary-version" :href="`#${latest.id}`">{{ latest.tag }}</a>
          <span v-if="latest" class="summary-date">{{ latest.date }}</span>
          <span v-if="newerBeta" class="summary-pre">
            Bản beta mới nhất:
            <a :href="`#${newerBeta.id}`" @click.prevent="showRelease(newerBeta.id)">{{ newerBeta.tag }}</a>
          </span>
        </div>
        <div class="summary-meta">
          <a :href="project.releasesUrl" target="_blank" rel="noreferrer">
            {{ releases.length }} bản phát hành trên GitHub
          </a>
          <span>Đồng bộ ngày {{ data.syncedAt }}</span>
        </div>
      </div>

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
.summary {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin: 24px 0;
  padding: 20px 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
}

.summary-label {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
}

.summary-version {
  color: var(--vp-c-brand-1);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
}

.summary-date {
  margin-left: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.summary-pre {
  display: block;
  margin-top: 4px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.summary-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

@media (max-width: 640px) {
  .summary-meta {
    text-align: left;
  }
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
