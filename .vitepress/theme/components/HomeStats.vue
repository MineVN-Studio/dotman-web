<script setup lang="ts">
// Số liệu thật của DotMan lấy từ bStats (API công khai, cho phép gọi từ trình duyệt).
// Lỗi mạng hoặc API đổi định dạng thì ẩn cả khu vực, không làm hỏng trang chủ.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const PLUGIN_ID = 23982
const API = `https://bstats.org/api/v1/plugins/${PLUGIN_ID}/charts`
const PAGE = `https://bstats.org/plugin/bukkit/DotMan%20-%20Donation%20Manager/${PLUGIN_ID}`

const DAYS = 30
const SLOTS_PER_DAY = 48 // bStats ghi số liệu mỗi 30 phút
const ALL_ELEMENTS = 100000 // đủ để lấy toàn bộ lịch sử
const POINTS_MONTH = DAYS // mỗi điểm là trung bình một ngày, gom theo ngày để không bị răng cưa do chu kỳ ngày đêm
const POINTS_ALL = 80
const TOP = 5

const CACHE_KEY = 'dotman-bstats'
const CACHE_ALL_KEY = 'dotman-bstats-all'
const CACHE_MS = 30 * 60 * 1000 // bStats cập nhật mỗi 30 phút

type Series = [number, number][]
interface Slice {
  name: string
  y: number
}
interface Stats {
  at: number
  servers: Series
  players: Series
  versions: Slice[]
  plugin: Slice[]
  software: Slice[]
}
/** Lịch sử toàn thời gian đã nén còn vài chục điểm (chuỗi gốc nặng vài MB) */
interface AllTime {
  at: number
  servers: Compact
  players: Compact
}
interface Compact {
  values: number[]
  max: number
  maxAt: number
  /** thời điểm có số liệu đầu tiên khác 0 */
  start: number
}
interface Row {
  name: string
  tag?: string
  count: number
  pct: number
}

const stats = ref<Stats>()
const status = ref<'loading' | 'ok' | 'error'>('loading')
const root = ref<HTMLElement>()
const visible = ref(false)
// bật khi đã có dữ liệu và khu vực này cuộn tới màn hình, để thanh ngang chạy từ 0 tới giá trị thật, số đếm lên và biểu đồ vẽ dần
const ready = ref(false)
// tiến độ đếm số từ 0 tới 1
const count = ref(0)

const range = ref<'month' | 'all'>('month')
const allTime = ref<AllTime>()
const allStatus = ref<'idle' | 'loading' | 'error'>('idle')

async function getJson<T>(chart: string, query = ''): Promise<T> {
  const res = await fetch(`${API}/${chart}/data${query}`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${chart}: ${res.status}`)
  return res.json()
}

async function load(): Promise<Stats> {
  const history = `?maxElements=${DAYS * SLOTS_PER_DAY}`
  const [servers, players, versions, plugin, software] = await Promise.all([
    getJson<Series>('servers', history),
    getJson<Series>('players', history),
    getJson<Slice[]>('minecraftVersion'),
    getJson<Slice[]>('pluginVersion'),
    getJson<Slice[]>('serverSoftware'),
  ])
  if (!Array.isArray(servers) || !servers.length || !Array.isArray(players) || !players.length) {
    throw new Error('Dữ liệu không đúng định dạng')
  }
  return { at: Date.now(), servers, players, versions, plugin, software }
}

function readCache<T extends { at: number }>(key: string, valid: (v: T) => boolean): T | undefined {
  try {
    const cached = JSON.parse(sessionStorage.getItem(key) ?? 'null') as T | null
    return cached && Date.now() - cached.at < CACHE_MS && valid(cached) ? cached : undefined
  } catch {
    return undefined
  }
}

function writeCache(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage bị chặn hoặc đầy: bỏ qua, chỉ mất bộ nhớ đệm
  }
}

onMounted(async () => {
  try {
    stats.value = readCache<Stats>(CACHE_KEY, (v) => Array.isArray(v.plugin)) ?? (await load())
    writeCache(CACHE_KEY, stats.value)
    status.value = 'ok'
  } catch (e) {
    console.warn('Không tải được số liệu bStats', e)
    status.value = 'error'
  }
})

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function startCount() {
  if (reduceMotion()) {
    count.value = 1
    return
  }
  const start = performance.now()
  const DURATION = 1400
  const tick = (now: number) => {
    const t = Math.min((now - start) / DURATION, 1)
    count.value = 1 - Math.pow(1 - t, 3) // chậm dần về cuối
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
  // rAF bị trình duyệt tạm dừng ở tab nền: chốt giá trị cuối để số không kẹt ở giữa chừng
  setTimeout(() => (count.value = 1), DURATION + 400)
}

let observer: IntersectionObserver | undefined

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined' || !root.value) {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        visible.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.15 },
  )
  observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())

watch([visible, status], ([isVisible, s]) => {
  if (!isVisible || s !== 'ok' || ready.value) return
  // đợi một nhịp để thanh ngang và biểu đồ được vẽ ở trạng thái 0 rồi mới chạy tới giá trị thật
  setTimeout(() => {
    ready.value = true
    startCount()
  }, 80)
})

// ---- lịch sử toàn thời gian: chỉ tải khi người xem chọn "Tất cả" ----
function compact(series: Series): Compact {
  // bStats trả dữ liệu từ lúc đăng ký plugin, phần đầu toàn số 0 nên cắt bỏ để biểu đồ không bị phẳng
  const first = Math.max(series.findIndex((p) => p[1] > 0), 0)
  const used = series.slice(first)
  const values = used.map((p) => p[1])
  let maxIndex = 0
  values.forEach((v, i) => {
    if (v > values[maxIndex]) maxIndex = i
  })
  return { values: downsample(values, POINTS_ALL), max: values[maxIndex], maxAt: used[maxIndex][0], start: used[0][0] }
}

async function loadAllTime(): Promise<AllTime> {
  const query = `?maxElements=${ALL_ELEMENTS}`
  const [servers, players] = await Promise.all([getJson<Series>('servers', query), getJson<Series>('players', query)])
  if (!Array.isArray(servers) || !servers.length || !Array.isArray(players) || !players.length) {
    throw new Error('Dữ liệu không đúng định dạng')
  }
  return { at: Date.now(), servers: compact(servers), players: compact(players) }
}

async function setRange(next: 'month' | 'all') {
  range.value = next
  if (next === 'month' || allTime.value || allStatus.value === 'loading') return
  allTime.value = readCache<AllTime>(CACHE_ALL_KEY, (v) => typeof v.servers?.start === 'number')
  if (allTime.value) return
  allStatus.value = 'loading'
  try {
    allTime.value = await loadAllTime()
    writeCache(CACHE_ALL_KEY, allTime.value)
    allStatus.value = 'idle'
  } catch (e) {
    console.warn('Không tải được lịch sử bStats', e)
    allStatus.value = 'error'
    range.value = 'month'
  }
}

// ---- biểu đồ nhỏ ----
const W = 200
const H = 56
const PAD = 4

/** Gom chuỗi dài thành n điểm bằng trung bình từng đoạn */
function downsample(values: number[], n: number): number[] {
  if (values.length <= n) return values
  const size = values.length / n
  return Array.from({ length: n }, (_, i) => {
    const part = values.slice(Math.floor(i * size), Math.floor((i + 1) * size))
    return part.reduce((a, b) => a + b, 0) / part.length
  })
}

function spark(values: number[]) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const x = (i: number) => (values.length === 1 ? W / 2 : (i / (values.length - 1)) * W)
  const y = (v: number) => H - PAD - ((v - min) / span) * (H - PAD * 2)
  const line = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  return { line, area: `${line} L${W} ${H} L0 ${H} Z` }
}

const fmt = (n: number) => Math.round(n).toLocaleString('vi-VN')
const fmtPct = (n: number) => (n >= 10 ? Math.round(n) : Math.round(n * 10) / 10).toLocaleString('vi-VN') + '%'
const fmtMonth = (t: number) => {
  const d = new Date(t)
  return `${d.getMonth() + 1}/${d.getFullYear()}`
}

const showAll = computed(() => range.value === 'all' && !!allTime.value)

const cards = computed(() => {
  const s = stats.value
  if (!s) return []
  const defs = [
    { key: 'servers', label: 'Server đang chạy DotMan', month: s.servers, all: allTime.value?.servers },
    { key: 'players', label: 'Người chơi trên các server đó', month: s.players, all: allTime.value?.players },
  ]
  return defs.map(({ key, label, month, all }) => {
    const values = month.map((p) => p[1])
    const useAll = showAll.value && all
    return {
      key,
      label,
      now: values[values.length - 1],
      sub: useAll
        ? `Cao nhất toàn thời gian: ${fmt(all.max)} (tháng ${fmtMonth(all.maxAt)})\nDữ liệu từ tháng ${fmtMonth(all.start)}`
        : `Cao nhất ${DAYS} ngày qua: ${fmt(Math.max(...values))}`,
      ...spark(useAll ? all.values : downsample(values, POINTS_MONTH)),
    }
  })
})

// ---- phân bố ----
function topShare(slices: Slice[], describe: (name: string) => { name: string; tag?: string } = (name) => ({ name })): Row[] {
  const total = slices.reduce((sum, s) => sum + s.y, 0) || 1
  const sorted = [...slices].sort((a, b) => b.y - a.y || a.name.localeCompare(b.name))
  const head: Row[] = sorted.slice(0, TOP).map((s) => ({ ...describe(s.name), count: s.y, pct: (s.y / total) * 100 }))
  const rest = sorted.slice(TOP).reduce((sum, s) => sum + s.y, 0)
  if (rest > 0) head.push({ name: 'Khác', count: rest, pct: (rest / total) * 100 })
  return head
}

/** Tên phiên bản plugin dạng "26.3-beta2-premium": tách hậu tố ra thành nhãn Premium / Free */
function pluginVersion(name: string) {
  const m = name.match(/^(.*?)-(premium|free)$/)
  return m ? { name: m[1], tag: m[2] === 'premium' ? 'Premium' : 'Free' } : { name }
}

const distributions = computed(() => {
  const s = stats.value
  if (!s) return []
  return [
    { key: 'versions', title: 'Phiên bản Minecraft', rows: topShare(s.versions) },
    { key: 'plugin', title: 'Phiên bản DotMan', rows: topShare(s.plugin, pluginVersion) },
    { key: 'software', title: 'Server software', rows: topShare(s.software, (name) => ({ name: name === 'Unknown' ? 'Không rõ' : name })) },
  ]
})
</script>

<template>
  <section v-if="status !== 'error'" ref="root" class="home-section home-stats" aria-labelledby="home-stats-title">
    <div class="head">
      <div>
        <h2 id="home-stats-title">DotMan trong thực tế</h2>
        <p>Số liệu thật từ các server đang dùng DotMan, cập nhật mỗi 30 phút.</p>
      </div>
      <div class="seg" role="group" aria-label="Khoảng thời gian của biểu đồ">
        <button type="button" :class="{ active: range === 'month' }" :aria-pressed="range === 'month'"
          @click="setRange('month')">{{ DAYS }} ngày</button>
        <button type="button" :class="{ active: range === 'all' }" :aria-pressed="range === 'all'"
          @click="setRange('all')">Tất cả</button>
      </div>
    </div>

    <div v-if="stats" class="grid stats">
      <div v-for="c in cards" :key="c.key" class="card stat" :class="{ loading: range === 'all' && allStatus === 'loading' }">
        <span class="label">{{ c.label }}</span>
        <span class="number">{{ fmt(c.now * count) }}</span>
        <span class="sub">{{ range === 'all' && allStatus === 'loading' ? 'Đang tải dữ liệu toàn thời gian...' : c.sub }}</span>
        <svg class="spark" :style="{ '--draw': ready ? 1 : 0 }" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient :id="`spark-${c.key}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="var(--vp-c-brand-1)" stop-opacity="0.35" />
              <stop offset="1" stop-color="var(--vp-c-brand-1)" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="c.area" :fill="`url(#spark-${c.key})`" />
          <path :d="c.line" class="line" vector-effect="non-scaling-stroke" />
        </svg>
      </div>
    </div>

    <div v-if="stats" class="grid dists">
      <div v-for="d in distributions" :key="d.key" class="card dist">
        <span class="label">{{ d.title }}</span>
        <ul class="bars">
          <li v-for="r in d.rows" :key="r.name + (r.tag ?? '')">
            <span class="name">
              {{ r.name }}
              <span v-if="r.tag" class="tag" :class="r.tag.toLowerCase()">{{ r.tag }}</span>
            </span>
            <span class="track">
              <span class="fill" :style="{ width: ready ? `${Math.max(r.pct, 2)}%` : '0%' }" />
            </span>
            <span class="pct">{{ fmtPct(r.pct) }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-else class="grid stats" aria-hidden="true">
      <div v-for="n in 2" :key="n" class="card stat skeleton" />
    </div>

    <p v-if="allStatus === 'error'" class="source error">Không tải được dữ liệu toàn thời gian, hiển thị lại {{ DAYS }} ngày qua.</p>
    <p class="source">
      Dữ liệu từ <a :href="PAGE" target="_blank" rel="noopener">bStats</a>, tính trên các server có bật thu thập số liệu.
    </p>
  </section>
</template>

<style scoped>
.home-stats {
  padding-bottom: 8px;
}

/* tiêu đề căn giữa như các khối khác, công tắc 30 ngày / Tất cả nằm ngay dưới */
.head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  text-align: center;
}

.head p {
  margin: 0;
}

.seg {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background-color: var(--vp-c-bg-soft);
  gap: 2px;
}

.seg button {
  padding: 4px 14px;
  border-radius: 7px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s, background-color 0.2s;
}

.seg button:hover {
  color: var(--vp-c-text-1);
}

.seg button.active {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: var(--vp-shadow-1);
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

.grid + .grid {
  margin-top: 16px;
}

@media (min-width: 720px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dists {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1040px) {
  .dists {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 20px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
}

.label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.number {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: var(--vp-c-brand-1);
}

.sub {
  font-size: 13px;
  white-space: pre-line;
  color: var(--vp-c-text-3);
}

/* biểu đồ nằm ở đáy card, không chiếm chỗ của chữ */
.stat {
  min-height: 220px;
}

.stat.loading .spark,
.stat.loading .number {
  opacity: 0.45;
}

.spark {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  pointer-events: none;
  /* biểu đồ vẽ dần từ trái sang phải khi khu vực cuộn tới */
  clip-path: inset(0 calc((1 - var(--draw, 0)) * 100%) 0 0);
  transition: opacity 0.2s, clip-path 1.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.line {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.bars {
  display: grid;
  gap: 10px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.bars li {
  display: grid;
  grid-template-columns: minmax(84px, 136px) minmax(0, 1fr) 44px;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 13px;
}

.name {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  color: var(--vp-c-text-1);
}

.tag {
  flex-shrink: 0;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 500;
  line-height: 16px;
}

.tag.premium {
  background-color: var(--vp-badge-tip-bg);
  color: var(--vp-badge-tip-text);
}

.tag.free {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.track {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background-color: var(--vp-c-default-soft);
}

.fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--vp-c-brand-3), var(--vp-c-brand-1));
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.pct {
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
}

.skeleton {
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.55;
  }
}

.home-stats .source {
  margin: 16px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.home-stats .source.error {
  margin-top: 12px;
  color: var(--vp-c-warning-1);
}

@media (prefers-reduced-motion: reduce) {
  .fill,
  .spark {
    transition: none;
  }

  .skeleton {
    animation: none;
  }
}
</style>
