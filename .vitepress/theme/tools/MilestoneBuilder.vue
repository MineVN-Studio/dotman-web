<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { parse } from 'yaml'
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from 'lucide-vue-next'
import CopyBlock from './CopyBlock.vue'
import IconButton from './IconButton.vue'
import ToolIssues from './ToolIssues.vue'
import ToolSelect, { type SelectOption } from './ToolSelect.vue'
import { lines, q, slashCommands } from './yaml-out'
import { useSessionState } from './session-state'

type Tab = 'mocnap' | 'mocnaptong' | 'phanthuongtop'
type MilestoneType = 'all' | 'day' | 'week' | 'month' | 'frame'

const TABS: { value: Tab; label: string; file: string }[] = [
  { value: 'mocnap', label: 'Mốc nạp cá nhân', file: 'mocnap.yml' },
  { value: 'mocnaptong', label: 'Mốc nạp tổng server', file: 'mocnaptong.yml' },
  { value: 'phanthuongtop', label: 'Phần thưởng top nạp', file: 'phanthuongtop.yml' },
]
const TYPES: { value: MilestoneType; label: string; premium?: boolean }[] = [
  { value: 'all', label: 'Toàn thời gian' },
  { value: 'day', label: 'Hằng ngày', premium: true },
  { value: 'week', label: 'Hằng tuần', premium: true },
  { value: 'month', label: 'Hằng tháng', premium: true },
  { value: 'frame', label: 'Khung thời gian', premium: true },
]
const TYPE_OPTIONS: SelectOption[] = TYPES.map((t) => ({ value: t.value, label: t.label, tag: t.premium ? 'Premium' : undefined }))
const toOptions = (list: string[]): SelectOption[] => list.map((v) => ({ value: v, label: v }))
const BAR_COLOR_OPTIONS = toOptions(['GREEN', 'RED', 'BLUE', 'YELLOW', 'PURPLE', 'WHITE', 'PINK'])
const BAR_STYLE_OPTIONS = toOptions(['SOLID', 'SEGMENTED_6', 'SEGMENTED_10', 'SEGMENTED_12', 'SEGMENTED_20'])
const TOP_SECTIONS = [
  { key: 'top-thang', label: 'Top tháng', when: '0 giờ ngày 1 hằng tháng' },
  { key: 'top-tuan', label: 'Top tuần', when: '0 giờ thứ 2 hằng tuần' },
  { key: 'top-ngay', label: 'Top ngày', when: '0 giờ hằng ngày' },
] as const

interface Milestone {
  id: number
  type: MilestoneType
  frameId: string
  amount: number
  commands: string
  // chỉ dùng cho mốc nạp tổng
  bossbar: string
  from: number
  barColor: string
  barStyle: string
}
interface RankReward {
  id: number
  rank: string
  commands: string
}

let nextId = 1
const milestone = (p: Partial<Milestone> = {}): Milestone => ({
  id: nextId++, type: 'all', frameId: '', amount: 1000000, commands: '', bossbar: '', from: 0,
  barColor: 'GREEN', barStyle: 'SEGMENTED_10', ...p,
})
const reward = (rank: string, commands: string): RankReward => ({ id: nextId++, rank, commands })

const tab = ref<Tab>('mocnap')
const personal = ref<Milestone[]>([
  milestone({ amount: 5000000, commands: "tell %player% Chúc mừng bạn đã đạt mốc 5 triệu tích lũy\ngive %player% emerald 1" }),
  milestone({ type: 'week', amount: 200000, commands: 'tell %player% Chúc mừng bạn đã đạt mốc 200k tích lũy (hằng tuần)' }),
])
const server = ref<Milestone[]>([
  milestone({ amount: 10000000, bossbar: 'Donate server: %CURRENT%/%TARGET% VNĐ', commands: 'say Donate của server đã đạt 10 triệu!' }),
])
const top = reactive<Record<string, RankReward[]>>({
  'top-thang': [
    reward('1', 'give %PLAYER% diamond 10'),
    reward('2-3', 'give %PLAYER% diamond 5'),
    reward('4-10', 'tell %PLAYER% Tháng trước bạn đứng thứ %RANK% top nạp thẻ.'),
  ],
  'top-tuan': [reward('1', 'tell %PLAYER% Tuần vừa rồi bạn đứng nhất top nạp thẻ.')],
  'top-ngay': [reward('1', 'tell %PLAYER% Hôm qua bạn đứng nhất top nạp thẻ.')],
})

const milestones = computed(() => (tab.value === 'mocnap' ? personal.value : server.value))
const placeholderHint = computed(() =>
  tab.value === 'mocnap'
    ? '%player% (viết thường) là tên người chơi.'
    : tab.value === 'mocnaptong'
      ? 'Lệnh không gắn với người chơi nào, không có placeholder tên người chơi.'
      : '%PLAYER% là tên người chơi, %RANK% là hạng.',
)

function addMilestone() {
  milestones.value.push(milestone())
}
function removeAt<T>(list: T[], i: number) {
  list.splice(i, 1)
}
function move<T>(list: T[], i: number, delta: number) {
  const j = i + delta
  if (j < 0 || j >= list.length) return
  const [item] = list.splice(i, 1)
  list.splice(j, 0, item)
}

const typeValue = (m: Milestone) => (m.type === 'frame' ? `frame-${m.frameId.trim()}` : m.type)

// ---- xuất YAML ----
function milestoneYaml(key: 'mocnap' | 'mocnaptong', list: Milestone[]) {
  const out = [`${key}:`]
  list.forEach((m, i) => {
    if (i > 0) out.push('')
    out.push(`- type: ${typeValue(m)}`)
    if (key === 'mocnaptong') {
      if (m.bossbar.trim()) {
        out.push(`  bossbar: ${q(m.bossbar.trim())}`)
        out.push(`  from: ${Math.max(0, Math.trunc(Number(m.from) || 0))}`)
      }
      out.push(`  bossbar-color: ${m.barColor}`)
      out.push(`  bossbar-style: ${m.barStyle}`)
    }
    out.push(`  amount: ${Math.trunc(Number(m.amount) || 0)}`)
    const cmds = lines(m.commands)
    out.push(cmds.length ? '  commands:' : '  commands: []')
    cmds.forEach((c) => out.push(`    - ${q(c)}`))
  })
  return out.join('\n') + '\n'
}

function topYaml() {
  const out: string[] = []
  for (const s of TOP_SECTIONS) {
    if (out.length) out.push('')
    out.push(`# Trao vào ${s.when}`)
    out.push(`${s.key}:`)
    if (top[s.key].length === 0) out[out.length - 1] += ' {}'
    for (const r of top[s.key]) {
      const cmds = lines(r.commands)
      out.push(`  ${r.rank.trim()}:${cmds.length ? '' : ' []'}`)
      cmds.forEach((c) => out.push(`    - ${q(c)}`))
    }
  }
  return out.join('\n') + '\n'
}

const output = computed(() => {
  if (tab.value === 'mocnap') return milestoneYaml('mocnap', personal.value)
  if (tab.value === 'mocnaptong') return milestoneYaml('mocnaptong', server.value)
  return topYaml()
})

// ---- kiểm tra lỗi ----
const issues = computed(() => {
  const out: { level: 'error' | 'warn'; text: string }[] = []
  const checkCommands = (where: string, text: string) => {
    if (lines(text).length === 0) out.push({ level: 'warn', text: `${where}: chưa có lệnh nào.` })
    if (slashCommands(text).length) out.push({ level: 'warn', text: `${where}: lệnh chạy từ console, không cần dấu / ở đầu.` })
  }
  if (tab.value !== 'phanthuongtop') {
    milestones.value.forEach((m, i) => {
      const where = `Mốc ${i + 1}`
      if (!(Number(m.amount) > 0)) out.push({ level: 'error', text: `${where}: số tiền phải lớn hơn 0.` })
      // plugin đọc amount kiểu Int
      if (Number(m.amount) > 2147483647) out.push({ level: 'error', text: `${where}: số tiền tối đa là 2.147.483.647.` })
      if (m.type === 'frame') {
        if (!m.frameId.trim()) out.push({ level: 'error', text: `${where}: chưa nhập ID khung thời gian.` })
        else if (m.frameId.includes('_')) out.push({ level: 'error', text: `${where}: ID khung thời gian không được chứa dấu gạch dưới (_).` })
      }
      checkCommands(where, m.commands)
    })
    return out
  }
  for (const s of TOP_SECTIONS) {
    const ranges: { from: number; to: number; rank: string }[] = []
    top[s.key].forEach((r) => {
      const where = `${s.label}, hạng "${r.rank}"`
      const m = r.rank.trim().match(/^(\d+)(?:-(\d+))?$/)
      if (!m) {
        out.push({ level: 'error', text: `${where}: hạng phải là một số (1) hoặc một khoảng (4-10).` })
        return
      }
      const from = Number(m[1])
      const to = Number(m[2] ?? m[1])
      if (from < 1 || from > to) out.push({ level: 'error', text: `${where}: khoảng hạng không hợp lệ.` })
      if (to > 100) out.push({ level: 'warn', text: `${where}: chỉ xét tới hạng 100, các hạng lớn hơn không có tác dụng.` })
      const overlap = ranges.find((x) => from <= x.to && x.from <= to)
      if (overlap) {
        out.push({ level: 'warn', text: `${where}: trùng với hạng "${overlap.rank}", người chơi chỉ nhận thưởng của mục đứng trước.` })
      }
      ranges.push({ from, to, rank: r.rank })
      checkCommands(where, r.commands)
    })
  }
  return out
})

// ---- nhập từ file đang có ----
const importText = ref('')
const importError = ref('')
useSessionState('milestone-builder', { tab, personal, server, top, importText }, () => {
  const ids = [...personal.value, ...server.value, ...Object.values(top).flat()].map((x) => x.id + 1)
  nextId = Math.max(nextId, ...ids)
})
function doImport() {
  importError.value = ''
  try {
    const doc = parse(importText.value) ?? {}
    const cmds = (v: unknown) => (Array.isArray(v) ? v.map(String).join('\n') : '')
    if (tab.value !== 'phanthuongtop') {
      const list = doc[tab.value]
      if (!Array.isArray(list)) throw new Error(`không tìm thấy danh sách "${tab.value}:"`)
      const parsed = list.map((it: any) => {
        const type = String(it?.type ?? 'all')
        return milestone({
          type: (type.startsWith('frame-') ? 'frame' : type) as MilestoneType,
          frameId: type.startsWith('frame-') ? type.slice(6) : '',
          amount: Number(it?.amount) || 0,
          commands: cmds(it?.commands),
          bossbar: typeof it?.bossbar === 'string' ? it.bossbar : '',
          from: Number(it?.from) || 0,
          barColor: it?.['bossbar-color'] ?? 'GREEN',
          barStyle: it?.['bossbar-style'] ?? 'SEGMENTED_10',
        })
      })
      if (tab.value === 'mocnap') personal.value = parsed
      else server.value = parsed
    } else {
      for (const s of TOP_SECTIONS) {
        const sec = doc[s.key]
        top[s.key] = sec && typeof sec === 'object' ? Object.entries(sec).map(([k, v]) => reward(k, cmds(v))) : []
      }
    }
    importText.value = ''
  } catch (e: any) {
    importError.value = `Không đọc được: ${e.message ?? e}`
  }
}

const currentFile = computed(() => TABS.find((t) => t.value === tab.value)!.file)
</script>

<template>
  <div class="tool vp-raw">
    <div class="tool-seg">
      <button v-for="t in TABS" :key="t.value" type="button" :class="{ active: tab === t.value }" @click="tab = t.value">
        {{ t.label }}
      </button>
    </div>

    <!-- mốc nạp cá nhân / tổng -->
    <template v-if="tab !== 'phanthuongtop'">
      <div v-for="(m, i) in milestones" :key="m.id" class="tool-panel item">
        <div class="item-head">
          <h4 class="tool-panel-title">Mốc {{ i + 1 }}</h4>
          <div class="tool-actions">
            <IconButton :icon="ArrowUp" tip="Lên trên" :disabled="i === 0" @click="move(milestones, i, -1)" />
            <IconButton :icon="ArrowDown" tip="Xuống dưới" :disabled="i === milestones.length - 1"
              @click="move(milestones, i, 1)" />
            <IconButton :icon="Trash2" tip="Xóa" danger @click="removeAt(milestones, i)" />
          </div>
        </div>
        <div class="tool-grid cols-3">
          <div class="tool-field">
            <span class="tool-label">Loại</span>
            <ToolSelect v-model="m.type" :options="TYPE_OPTIONS" aria-label="Loại" />
          </div>
          <label v-if="m.type === 'frame'" class="tool-field">
            <span class="tool-label">ID khung thời gian</span>
            <input v-model="m.frameId" type="text" placeholder="giang-sinh-2026" />
          </label>
          <label class="tool-field">
            <span class="tool-label">Số tiền cần đạt (VNĐ)</span>
            <input v-model.number="m.amount" type="number" min="0" step="10000" />
          </label>
        </div>
        <div v-if="tab === 'mocnaptong'" class="tool-grid cols-3">
          <label class="tool-field">
            <span class="tool-label">Bossbar tiến độ</span>
            <input v-model="m.bossbar" type="text" placeholder="Để trống nếu không hiện" />
          </label>
          <div class="tool-field">
            <span class="tool-label">Màu bossbar</span>
            <ToolSelect v-model="m.barColor" :options="BAR_COLOR_OPTIONS" aria-label="Màu bossbar" />
          </div>
          <div class="tool-field">
            <span class="tool-label">Kiểu bossbar</span>
            <ToolSelect v-model="m.barStyle" :options="BAR_STYLE_OPTIONS" aria-label="Kiểu bossbar" />
          </div>
          <label v-if="m.bossbar.trim()" class="tool-field">
            <span class="tool-label">Bắt đầu hiện bossbar từ (VNĐ)</span>
            <input v-model.number="m.from" type="number" min="0" step="10000" />
          </label>
        </div>
        <label class="tool-field">
          <span class="tool-label">Lệnh khi đạt mốc (mỗi dòng một lệnh)</span>
          <textarea v-model="m.commands" rows="3" spellcheck="false" />
        </label>
      </div>
      <ToolIssues :items="issues" />
      <div class="tool-actions">
        <button type="button" class="tool-btn" @click="addMilestone"><Plus :size="16" /> Thêm mốc</button>
      </div>
    </template>

    <!-- phần thưởng top -->
    <template v-else>
      <div v-for="s in TOP_SECTIONS" :key="s.key" class="tool-panel">
        <div class="item-head">
          <h4 class="tool-panel-title">{{ s.label }} <span class="tool-muted when">trao vào {{ s.when }}</span></h4>
          <button type="button" class="tool-btn small" @click="top[s.key].push(reward('', ''))"><Plus :size="14" /> Thêm hạng</button>
        </div>
        <p v-if="top[s.key].length === 0" class="tool-muted">Không trao thưởng.</p>
        <!-- tên cột chỉ hiện một lần ở đầu card, các dòng bên dưới dùng chung lưới nên luôn dóng hàng -->
        <div v-if="top[s.key].length" class="rank-head tool-label" aria-hidden="true">
          <span>Hạng</span>
          <span>Lệnh (mỗi dòng một lệnh)</span>
        </div>
        <div v-for="(r, i) in top[s.key]" :key="r.id" class="rank-row">
          <input v-model="r.rank" type="text" placeholder="1 hoặc 4-10" aria-label="Hạng" />
          <textarea v-model="r.commands" rows="2" spellcheck="false" aria-label="Lệnh (mỗi dòng một lệnh)" />
          <IconButton :icon="Trash2" tip="Xóa" danger class="remove" @click="removeAt(top[s.key], i)" />
        </div>
      </div>
      <ToolIssues :items="issues" />
    </template>

    <span class="tool-hint">Placeholder trong lệnh: {{ placeholderHint }}</span>

    <CopyBlock :code="output" :title="currentFile" />

    <details class="tool-panel import">
      <summary>Nhập từ file {{ currentFile }} đang có</summary>
      <textarea v-model="importText" rows="8" spellcheck="false" :placeholder="`Dán nội dung ${currentFile} vào đây`" />
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

.when {
  margin-left: 6px;
  font-size: 13px;
  font-weight: 400;
}

/* tiêu đề cột và các dòng hạng dùng chung một lưới: Hạng | Lệnh | nút xóa (32px) */
.rank-head,
.rank-row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) 32px;
  gap: 12px;
}

.rank-head {
  margin-bottom: -8px;
}

.rank-row {
  align-items: start;
}

.rank-row textarea {
  min-height: 60px;
}

.remove {
  margin-top: 2px;
}

/* cột phải giãn hết khung, nếu không cột chỉ rộng bằng chữ, chưa tính mũi tên, nên tiêu đề bị rớt dòng */
.import {
  grid-template-columns: minmax(0, 1fr);
}

/* khi thu gọn chỉ còn tiêu đề, bỏ khoảng cách tới phần nội dung đang ẩn */
.import:not([open]) {
  gap: 0;
}

/* bỏ margin mặc định của summary trong tài liệu (.vp-doc summary) để tiêu đề sát mép trên khung */
.import summary {
  margin: 0;
  cursor: pointer;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

@media (max-width: 639px) {
  .rank-head,
  .rank-row {
    grid-template-columns: 84px minmax(0, 1fr) 32px;
    gap: 8px;
  }
}
</style>
