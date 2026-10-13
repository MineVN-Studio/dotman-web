<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { parse } from 'yaml'
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from 'lucide-vue-next'
import CopyBlock from './CopyBlock.vue'
import DateTimeField from './DateTimeField.vue'
import IconButton from './IconButton.vue'
import ToolIssues from './ToolIssues.vue'
import ToolSelect, { type SelectOption } from './ToolSelect.vue'
import { colorSegments, parseConfigDateTime } from './promo'
import { q } from './yaml-out'
import { useSessionState } from './session-state'

interface Frame {
  id: number
  /** ID nhập tay, để trống thì tạo từ tên */
  key: string
  name: string
  /** yyyy-MM-ddTHH:mm:ss */
  from: string
  to: string
}

let nextId = 1
const frame = (p: Partial<Frame> = {}): Frame => ({ id: nextId++, key: '', name: '', from: '', to: '', ...p })

const frames = ref<Frame[]>([
  frame({ name: 'Giáng sinh 2026', from: '2026-12-23T00:00:00', to: '2026-12-31T00:00:00' }),
  frame({ name: 'Tết 2027', from: '2027-02-05T00:00:00', to: '2027-02-15T00:00:00' }),
])
const usageKey = ref('')
const importText = ref('')
const importError = ref('')
useSessionState('frame-builder', { frames, usageKey, importText }, () => {
  nextId = Math.max(nextId, ...frames.value.map((f) => f.id + 1))
})

/** Giáng sinh 2026 -> giang-sinh-2026 */
const slug = (s: string) =>
  s
    .replace(/&[0-9a-fk-or]/gi, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const frameId = (f: Frame) => f.key.trim() || slug(f.name)

/** 2026-12-23T00:00:00 -> 23/12/2026 00:00 (plugin đọc theo dd/MM/yyyy HH:mm, không có giây) */
function toConfigTime(v: string) {
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : ''
}
const pad = (n: number) => String(n).padStart(2, '0')
const toIso = (t: number) => {
  const d = new Date(t)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
}
const time = (v: string) => (v ? new Date(v).getTime() : NaN)

// thời điểm hiện tại chỉ lấy sau khi mount, để HTML render sẵn khớp với lúc hydrate
const now = ref<number>()
onMounted(() => (now.value = Date.now()))

const output = computed(() => {
  const out = [
    '# Khung thời gian cho sự kiện, dùng cho đua top và mốc nạp',
    '# ID không được có dấu gạch dưới (_), phải là duy nhất, kể cả với ID đã xóa khỏi file này',
  ]
  if (frames.value.length === 0) out.push('{}')
  frames.value.forEach((f, i) => {
    if (i > 0) out.push('')
    out.push(`${frameId(f)}:`, `  name: ${q(f.name.trim())}`, `  from: ${toConfigTime(f.from)}`, `  to: ${toConfigTime(f.to)}`)
  })
  return out.join('\n') + '\n'
})

const issues = computed(() => {
  const out: { level: 'error' | 'warn'; text: string }[] = []
  const seen = new Set<string>()
  frames.value.forEach((f, i) => {
    const id = frameId(f)
    const where = id ? `Khung "${id}"` : `Khung ${i + 1}`
    // thiếu name, from hoặc to thì plugin lỗi khi đọc cả file, mọi khung đều không chạy
    if (!f.name.trim()) out.push({ level: 'error', text: `${where}: Chưa nhập tên, plugin sẽ không đọc được cả file.` })
    if (!id) out.push({ level: 'error', text: `${where}: Chưa nhập ID.` })
    else if (id.includes('_')) out.push({ level: 'error', text: `${where}: ID không được chứa dấu gạch dưới (_).` })
    else if (/[A-Z]/.test(id)) {
      out.push({ level: 'error', text: `${where}: ID phải viết thường, placeholder luôn đổi ID về chữ thường nên sẽ không khớp.` })
    } else if (!/^[a-z0-9-]+$/.test(id)) {
      out.push({ level: 'error', text: `${where}: ID chỉ nên gồm chữ thường không dấu, số và dấu gạch ngang (-).` })
    }
    if (id && seen.has(id)) out.push({ level: 'error', text: `${where}: ID bị trùng, YAML chỉ giữ lại một khung.` })
    seen.add(id)
    if (!f.from || !f.to) {
      out.push({ level: 'error', text: `${where}: Chưa chọn thời gian bắt đầu và kết thúc, plugin sẽ không đọc được cả file.` })
    } else if (time(f.from) >= time(f.to)) {
      out.push({ level: 'error', text: `${where}: Thời gian kết thúc phải sau thời gian bắt đầu.` })
    } else if (now.value && time(f.to) < now.value) {
      out.push({ level: 'warn', text: `${where}: Đã kết thúc, giao dịch mới sẽ không được tính vào khung này.` })
    }
  })
  return out
})

function move(i: number, delta: number) {
  const j = i + delta
  if (j < 0 || j >= frames.value.length) return
  const [item] = frames.value.splice(i, 1)
  frames.value.splice(j, 0, item)
}

function addFrame() {
  // khung mới bắt đầu ngay sau khung cuối, kéo dài 7 ngày
  const ends = frames.value.map((f) => time(f.to)).filter((t) => !Number.isNaN(t))
  const start = ends.length ? Math.max(...ends) : new Date().setHours(0, 0, 0, 0)
  frames.value.push(frame({ from: toIso(start), to: toIso(start + 7 * 24 * 3600 * 1000) }))
}

// ---- dòng thời gian ----

const fmtDate = (t: number) => new Date(t).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const timeline = computed(() => {
  const valid = frames.value
    .map((f) => ({ id: frameId(f), name: f.name, from: time(f.from), to: time(f.to) }))
    .filter((f) => f.id && f.from < f.to)
  if (valid.length === 0) return undefined
  const min = Math.min(...valid.map((f) => f.from))
  const max = Math.max(...valid.map((f) => f.to))
  const span = max - min
  const pos = (t: number) => ((t - min) / span) * 100
  return {
    rows: valid.map((f) => ({
      ...f,
      left: pos(f.from),
      width: Math.max(pos(f.to) - pos(f.from), 0.8),
      status: !now.value ? '' : now.value < f.from ? 'soon' : now.value > f.to ? 'ended' : 'live',
      range: `${fmtDate(f.from)} → ${fmtDate(f.to)}`,
    })),
    now: now.value && now.value >= min && now.value <= max ? pos(now.value) : undefined,
    start: new Date(min).toLocaleDateString('vi-VN'),
    end: new Date(max).toLocaleDateString('vi-VN'),
  }
})
const STATUS_TEXT: Record<string, string> = { live: 'Đang diễn ra', soon: 'Sắp tới', ended: 'Đã kết thúc' }

// ---- cách dùng ----

const usageOptions = computed<SelectOption[]>(() =>
  [...new Set(frames.value.map(frameId).filter((id) => /^[a-z0-9-]+$/.test(id)))].map((id) => ({ value: id, label: id })),
)
const usageId = computed({
  get: () => (usageOptions.value.some((o) => o.value === usageKey.value) ? usageKey.value : usageOptions.value[0]?.value ?? ''),
  set: (v: string) => (usageKey.value = v),
})
const placeholders = computed(() => {
  const id = usageId.value
  return [
    '# Tổng nạp của người chơi trong khung thời gian',
    `%dotman_dataframe_${id}_donate_total%`,
    '',
    '# Tổng nạp của cả server trong khung thời gian',
    `%dotman_masterdataframe_${id}_donate_total%`,
    '',
    '# Top nạp trong khung thời gian (tên - giá trị)',
    ...[1, 2, 3].map((r) => `${r}. %dotman_topframe_${id}_donate_total_${r}_player% - %dotman_topframe_${id}_donate_total_${r}_value%`),
  ].join('\n')
})
const milestoneExample = computed(() =>
  [
    'mocnap:',
    `- type: frame-${usageId.value}`,
    '  amount: 500000',
    '  commands:',
    "    - 'tell %player% Bạn đã nạp đủ 500k trong sự kiện!'",
  ].join('\n') + '\n',
)

// ---- nhập từ file đang có ----

function doImport() {
  importError.value = ''
  try {
    const doc = parse(importText.value) ?? {}
    if (typeof doc !== 'object' || Array.isArray(doc)) throw new Error('Nội dung không phải danh sách khung thời gian')
    const bad: string[] = []
    const readTime = (id: string, key: string, v: unknown) => {
      try {
        return toIso(parseConfigDateTime(String(v ?? '')))
      } catch {
        bad.push(`${id}.${key}`)
        return ''
      }
    }
    frames.value = Object.entries(doc).map(([id, v]: [string, any]) =>
      frame({
        key: id,
        name: typeof v?.name === 'string' ? v.name : '',
        from: readTime(id, 'from', v?.from),
        to: readTime(id, 'to', v?.to),
      }),
    )
    importText.value = ''
    if (bad.length) importError.value = `Đã nhập, nhưng thời gian không đúng định dạng dd/MM/yyyy HH:mm ở: ${bad.join(', ')}. Hãy chọn lại.`
  } catch (e: any) {
    importError.value = `Không đọc được: ${e.message ?? e}`
  }
}
</script>

<template>
  <div class="tool vp-raw">
    <div v-for="(f, i) in frames" :key="f.id" class="tool-panel">
      <div class="item-head">
        <h4 class="tool-panel-title">
          <span v-for="(seg, k) in colorSegments(f.name.trim() || `Khung ${i + 1}`)" :key="k"
            :style="{ color: seg.color, fontWeight: seg.bold ? 700 : undefined }">{{ seg.text }}</span>
        </h4>
        <div class="tool-actions">
          <IconButton :icon="ArrowUp" tip="Lên trên" :disabled="i === 0" @click="move(i, -1)" />
          <IconButton :icon="ArrowDown" tip="Xuống dưới" :disabled="i === frames.length - 1" @click="move(i, 1)" />
          <IconButton :icon="Trash2" tip="Xóa" danger @click="frames.splice(i, 1)" />
        </div>
      </div>
      <div class="tool-grid cols-2">
        <label class="tool-field">
          <span class="tool-label">Tên sự kiện</span>
          <input v-model="f.name" type="text" placeholder="Giáng sinh 2026" />
          <span class="tool-hint">Hiển thị ở mốc nạp theo khung thời gian, dùng được mã màu &amp;.</span>
        </label>
        <label class="tool-field">
          <span class="tool-label">ID</span>
          <input v-model="f.key" type="text" :placeholder="slug(f.name) || 'giang-sinh-2026'" spellcheck="false" />
          <span class="tool-hint">Để trống thì tạo từ tên. Nên kèm năm, ví dụ <code>tet-2027</code>.</span>
        </label>
        <div class="tool-field">
          <span class="tool-label">Bắt đầu</span>
          <DateTimeField v-model="f.from" :seconds="false" />
        </div>
        <div class="tool-field">
          <span class="tool-label">Kết thúc</span>
          <DateTimeField v-model="f.to" :seconds="false" />
          <span class="tool-hint">Tính tới đúng phút này. Muốn trọn ngày cuối, đặt 00:00 của ngày hôm sau.</span>
        </div>
      </div>
    </div>
    <p v-if="frames.length === 0" class="tool-muted">Chưa có khung thời gian nào.</p>

    <ToolIssues :items="issues" />
    <div class="tool-actions">
      <button type="button" class="tool-btn" @click="addFrame"><Plus :size="16" /> Thêm khung thời gian</button>
    </div>

    <div v-if="timeline" class="tool-panel">
      <h4 class="tool-panel-title">Dòng thời gian</h4>
      <div class="timeline">
        <div v-for="r in timeline.rows" :key="r.id" class="tl-row">
          <span class="tl-label">
            {{ r.id }}
            <span v-if="r.status" class="tl-status" :class="r.status">{{ STATUS_TEXT[r.status] }}</span>
          </span>
          <div class="tl-track">
            <div class="tl-bar" :class="r.status" :style="{ left: `${r.left}%`, width: `${r.width}%` }" :title="r.range" />
            <div v-if="timeline.now !== undefined" class="tl-now" :style="{ left: `${timeline.now}%` }" />
          </div>
        </div>
        <div class="tl-axis tool-hint">
          <span>{{ timeline.start }}</span>
          <span>{{ timeline.end }}</span>
        </div>
      </div>
      <span v-if="timeline.now !== undefined" class="tool-hint">Vạch <span class="tl-now-text">đỏ</span> là thời điểm hiện tại. Rê chuột lên thanh để xem thời gian.</span>
      <span v-else class="tool-hint">Rê chuột lên thanh để xem thời gian.</span>
    </div>

    <CopyBlock :code="output" title="khungthoigian.yml" />

    <div v-if="usageOptions.length" class="tool-panel">
      <div class="item-head">
        <h4 class="tool-panel-title">Cách dùng khung thời gian</h4>
        <ToolSelect v-model="usageId" :options="usageOptions" aria-label="Khung thời gian" class="usage-select" />
      </div>
      <span class="tool-hint">
        Placeholder cho hologram, scoreboard. Tạo thêm kiểu khác bằng công cụ
        <a href="/docs/cong-cu/tao-placeholder">Tạo placeholder</a>.
      </span>
      <CopyBlock :code="placeholders" title="Placeholder" />
      <span class="tool-hint">
        Mốc nạp theo khung thời gian trong <code>mocnap.yml</code> hoặc <code>mocnaptong.yml</code>. Tạo bằng công cụ
        <a href="/docs/cong-cu/moc-nap-va-thuong-top">Tạo mốc nạp &amp; thưởng top</a>.
      </span>
      <CopyBlock :code="milestoneExample" title="mocnap.yml" />
    </div>

    <details class="tool-panel import">
      <summary>Nhập từ file khungthoigian.yml đang có</summary>
      <textarea v-model="importText" rows="8" spellcheck="false" placeholder="Dán nội dung khungthoigian.yml vào đây" />
      <div class="tool-actions">
        <button type="button" class="tool-btn primary small" :disabled="!importText.trim()" @click="doImport"><Upload :size="14" /> Nhập</button>
      </div>
      <p v-if="importError" class="tool-error">{{ importError }}</p>
    </details>
  </div>
</template>

<style scoped>
.item-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.usage-select {
  width: 220px;
}

.timeline {
  display: grid;
  gap: 10px;
}

/* nhãn bên trái, thanh thời gian bên phải; màn hình hẹp thì nhãn nằm trên thanh */
.tl-row {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.tl-label {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  overflow-wrap: anywhere;
}

.tl-status {
  padding: 0 6px;
  border-radius: 999px;
  font-family: var(--vp-font-family-base);
  font-size: 10px;
  font-weight: 500;
  line-height: 18px;
  white-space: nowrap;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.tl-status.live {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.tl-track {
  position: relative;
  height: 14px;
  border-radius: 7px;
  background-color: var(--vp-c-default-soft);
}

.tl-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: 7px;
  background-color: var(--vp-c-brand-2);
}

.tl-bar.ended {
  background-color: var(--vp-c-text-3);
}

.tl-now {
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 2px;
  margin-left: -1px;
  background-color: var(--vp-c-danger-1);
}

.tl-axis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  margin-left: 212px;
}

.tl-now-text {
  color: var(--vp-c-danger-1);
}

/* cột phải giãn hết khung, nếu không cột chỉ rộng bằng chữ, chưa tính mũi tên, nên tiêu đề bị rớt dòng */
.import {
  grid-template-columns: minmax(0, 1fr);
}

.import:not([open]) {
  gap: 0;
}

.import summary {
  margin: 0;
  cursor: pointer;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

@media (max-width: 639px) {
  .tl-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }

  .tl-axis {
    margin-left: 0;
  }

  .usage-select {
    width: 100%;
  }
}
</style>
