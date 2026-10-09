<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { parse } from 'yaml'
import { getScrollOffset } from 'vitepress'
import { ArrowDown, ArrowUp, CopyPlus, ListChecks, Plus, Trash2 } from 'lucide-vue-next'
import CopyBlock from './CopyBlock.vue'
import ToolIssues from './ToolIssues.vue'
import { vTip } from './tooltip'
import DateTimeField from './DateTimeField.vue'
import IconButton from './IconButton.vue'
import { ALL_DAYS, DAY_NAMES, colorSegments, describe, parsePromos, type DayCode } from './promo'
import { activeTab, checkerSource } from './promo-store'
import { q } from './yaml-out'
import { useSessionState } from './session-state'

type Kind = 'fixed' | 'weekly'

interface Draft {
  id: number
  name: string
  percent: number
  kind: Kind
  // ngày cố định
  from: string
  to: string
  // lặp lại hằng tuần
  days: DayCode[]
  allDay: boolean
  startTime: string
  endTime: string
  /** kết thúc lúc 24:00 (hết ngày) */
  endOfDay: boolean
  limitFrom: string
  limitTo: string
}

let nextId = 1
const draft = (p: Partial<Draft> = {}): Draft => ({
  id: nextId++,
  name: '&aKhuyến mãi mới',
  percent: 50,
  kind: 'weekly',
  from: '2026-09-02T00:00:00',
  to: '2026-09-03T23:59:59',
  days: [7, 8],
  allDay: true,
  startTime: '18:00',
  endTime: '22:00',
  endOfDay: false,
  limitFrom: '',
  limitTo: '',
  ...p,
})

const drafts = ref<Draft[]>([
  draft({ name: '&aCuối tuần - Khuyến mãi 50%', percent: 50, days: [7, 8] }),
  draft({ name: '&eGiờ vàng - Khuyến mãi 30%', percent: 30, days: [], allDay: false }),
  draft({ name: '&bQuốc khánh - Khuyến mãi 100%', percent: 100, kind: 'fixed' }),
])
const legacyName = ref('&aKhuyến mãi nạp thẻ')
useSessionState('promo-builder', { drafts, legacyName }, () => {
  nextId = Math.max(nextId, ...drafts.value.map((d) => d.id + 1))
})

/** 2026-09-01T23:59:59 -> 01/09/2026 23:59:59 (bỏ giây nếu = 00) */
function toConfigTime(v: string) {
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/)
  if (!m) return ''
  const [, y, mo, d, h, mi, s] = m
  return `${d}/${mo}/${y} ${h}:${mi}${s && s !== '00' ? ':' + s : ''}`
}
const toMinute = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const fmtMinute = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
const rateText = (percent: number) => {
  const r = (Number(percent) || 0) / 100
  return Number.isInteger(r) ? r.toFixed(1) : String(+r.toFixed(4))
}
const nextDay = (d: DayCode): DayCode => (d === 8 ? 2 : ((d + 1) as DayCode))

interface OutItem {
  draftIndex: number
  lines: string[]
}

/** Mỗi mục trong form thành 1 mục YAML, riêng khung giờ qua nửa đêm được tách thành 2 mục cùng tên */
const items = computed<OutItem[]>(() =>
  drafts.value.flatMap((d, draftIndex) => {
    const head = [`- name: ${q(d.name)}`, `  rate: ${rateText(d.percent)}`]
    if (d.kind === 'fixed') {
      return [{ draftIndex, lines: [...head, `  from: ${toConfigTime(d.from)}`, `  to: ${toConfigTime(d.to)}`] }]
    }
    const limit = [
      ...(d.limitFrom ? [`  from: ${toConfigTime(d.limitFrom)}`] : []),
      ...(d.limitTo ? [`  to: ${toConfigTime(d.limitTo)}`] : []),
    ]
    const days = [...d.days].sort((a, b) => a - b)
    const daysLine = (list: DayCode[]) => (list.length && list.length < 7 ? [`  days: [${list.join(', ')}]`] : [])

    if (d.allDay) {
      // không chọn thứ nào và cả ngày: luôn áp dụng, cần hours để plugin nhận là lịch lặp lại
      const hours = days.length && days.length < 7 ? [] : [`  hours: '00:00-24:00'`]
      return [{ draftIndex, lines: [...head, ...daysLine(days), ...hours, ...limit] }]
    }

    const start = toMinute(d.startTime)
    const end = d.endOfDay ? 1440 : toMinute(d.endTime)
    if (end > start) {
      return [{ draftIndex, lines: [...head, ...daysLine(days), `  hours: '${fmtMinute(start)}-${fmtMinute(end)}'`, ...limit] }]
    }
    // qua nửa đêm: phần trước 24:00 ở các thứ đã chọn, phần sau 00:00 ở thứ kế tiếp
    const after = days.length ? [...new Set(days.map(nextDay))].sort((a, b) => a - b) : []
    const out: OutItem[] = [
      { draftIndex, lines: [...head, ...daysLine(days), `  hours: '${fmtMinute(start)}-24:00'`, ...limit] },
    ]
    if (end > 0) out.push({ draftIndex, lines: [...head, ...daysLine(after), `  hours: '00:00-${fmtMinute(end)}'`, ...limit] })
    return out
  }),
)

const output = computed(() => {
  const out: string[] = []
  if (legacyName.value.trim()) out.push(`legacy-name: ${q(legacyName.value.trim())}`, '')
  out.push('khuyen-mai:')
  items.value.forEach((it, i) => {
    if (i > 0) out.push('')
    out.push(...it.lines)
  })
  return out.join('\n') + '\n'
})

const checked = computed(() => {
  try {
    return parsePromos(parse(output.value)).entries
  } catch {
    return []
  }
})
function statusOf(index: number) {
  const parts = items.value
    .map((it, i) => ({ it, entry: checked.value[i] }))
    .filter((x) => x.it.draftIndex === index)
  const errors = parts.map((p) => p.entry?.error).filter(Boolean) as string[]
  const descriptions = parts.map((p) => (p.entry?.schedule ? describe(p.entry.schedule) : '')).filter(Boolean)
  return { errors, descriptions, split: parts.length > 1 }
}

function toggleDay(d: Draft, day: DayCode) {
  d.days = d.days.includes(day) ? d.days.filter((x) => x !== day) : [...d.days, day]
}
function move(i: number, delta: number) {
  const j = i + delta
  if (j < 0 || j >= drafts.value.length) return
  const [item] = drafts.value.splice(i, 1)
  drafts.value.splice(j, 0, item)
}
function duplicate(i: number) {
  drafts.value.splice(i + 1, 0, { ...drafts.value[i], id: nextId++, days: [...drafts.value[i].days] })
}

async function sendToChecker() {
  checkerSource.value = output.value
  activeTab.value = 'check'
  await nextTick()
  // cuộn lên đầu khu vực công cụ để thấy tab Kiểm tra
  const el = document.querySelector('.promo-tools')
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - getScrollOffset() - 16, behavior: 'smooth' })
}
</script>

<template>
  <div class="tool vp-raw">
    <div v-for="(d, i) in drafts" :key="d.id" class="tool-panel">
      <div class="item-head">
        <div class="item-title">
          <h4 class="tool-panel-title">Khuyến mãi {{ i + 1 }}</h4>
          <div class="tool-seg">
            <button type="button" :class="{ active: d.kind === 'weekly' }" @click="d.kind = 'weekly'">Lặp lại hằng tuần</button>
            <button type="button" :class="{ active: d.kind === 'fixed' }" @click="d.kind = 'fixed'">Ngày cố định</button>
          </div>
        </div>
        <div class="tool-actions">
          <IconButton :icon="ArrowUp" tip="Lên trên" :disabled="i === 0" @click="move(i, -1)" />
          <IconButton :icon="ArrowDown" tip="Xuống dưới" :disabled="i === drafts.length - 1" @click="move(i, 1)" />
          <IconButton :icon="CopyPlus" tip="Nhân bản" @click="duplicate(i)" />
          <IconButton :icon="Trash2" tip="Xóa" danger @click="drafts.splice(i, 1)" />
        </div>
      </div>

      <div class="tool-grid name-row">
        <label class="tool-field">
          <span class="tool-label">Tên khuyến mãi</span>
          <input v-model="d.name" type="text" />
          <span class="mc-name">
            <span v-for="(seg, k) in colorSegments(d.name || ' ')" :key="k"
              :style="{ color: seg.color, fontWeight: seg.bold ? 700 : undefined }">{{ seg.text }}</span>
          </span>
        </label>
        <label class="tool-field">
          <span class="tool-label">Khuyến mãi (%)</span>
          <input v-model.number="d.percent" type="number" min="0" step="10" />
          <span class="tool-hint"><code>rate: {{ rateText(d.percent) }}</code></span>
        </label>
      </div>

      <div v-if="d.kind === 'fixed'" class="tool-grid cols-2">
        <label class="tool-field">
          <span class="tool-label">Bắt đầu</span>
          <DateTimeField v-model="d.from" />
        </label>
        <label class="tool-field">
          <span class="tool-label">Kết thúc</span>
          <DateTimeField v-model="d.to" />
          <span class="tool-hint">Muốn trọn ngày cuối thì đặt 23:59:59.</span>
        </label>
      </div>

      <template v-else>
        <div class="schedule">
          <div class="tool-field">
            <span class="tool-label">Thứ trong tuần <span class="tool-hint">bỏ trống = mọi ngày</span></span>
            <div class="days">
              <button v-for="day in ALL_DAYS" :key="day" type="button" class="day" :class="{ active: d.days.includes(day) }"
                @click="toggleDay(d, day)">{{ DAY_NAMES[day] }}</button>
            </div>
          </div>

          <div class="tool-field">
            <span class="tool-label">
              Khung giờ
              <label class="tool-check all-day"><input v-model="d.allDay" type="checkbox" /> Cả ngày</label>
            </span>
            <div v-if="!d.allDay" class="hours">
              <div v-tip="'Từ'" class="time"><DateTimeField v-model="d.startTime" mode="time" /></div>
              <span class="tool-muted">→</span>
              <div v-tip="'Đến'" class="time"><DateTimeField v-model="d.endTime" mode="time" :disabled="d.endOfDay" /></div>
              <label class="tool-check"><input v-model="d.endOfDay" type="checkbox" /> Hết ngày (24:00)</label>
            </div>
            <span v-else class="all-day-note tool-hint">Áp dụng từ 00:00 đến 24:00.</span>
            <span v-if="!d.allDay" class="tool-hint">Qua nửa đêm (ví dụ 22:00 → 02:00) sẽ được tự tách thành 2 mục cùng tên.</span>
          </div>
        </div>

        <div class="tool-grid cols-2">
          <label class="tool-field">
            <span class="tool-label">Chỉ áp dụng từ (không bắt buộc)</span>
            <DateTimeField v-model="d.limitFrom" placeholder="Không giới hạn" clearable />
          </label>
          <label class="tool-field">
            <span class="tool-label">Chỉ áp dụng đến (không bắt buộc)</span>
            <DateTimeField v-model="d.limitTo" placeholder="Không giới hạn" clearable />
          </label>
        </div>
      </template>

      <ToolIssues v-if="statusOf(i).errors.length"
        :items="statusOf(i).errors.map((e) => ({ level: 'error', text: `Plugin sẽ bỏ qua mục này: ${e}` }))" />
      <p v-else class="summary">
        <span v-for="text in statusOf(i).descriptions" :key="text">{{ text }}</span>
        <span v-if="statusOf(i).split" class="tool-muted">(đã tách thành 2 mục vì qua nửa đêm)</span>
      </p>
    </div>

    <div class="tool-actions">
      <button type="button" class="tool-btn" @click="drafts.push(draft())"><Plus :size="16" /> Thêm khuyến mãi</button>
    </div>

    <div class="tool-panel">
      <label class="tool-field">
        <span class="tool-label">Tên khuyến mãi nhanh trong config.yml (legacy-name)</span>
        <input v-model="legacyName" type="text" placeholder="Để trống nếu không dùng" />
        <span class="tool-hint">Tên hiển thị cho <code>extra-rate</code> trong <code>config.yml</code>, vì loại khuyến mãi này không có tên.</span>
      </label>
    </div>

    <CopyBlock :code="output" title="khuyenmai.yml" />
    <div class="tool-actions">
      <button type="button" class="tool-btn primary" @click="sendToChecker"><ListChecks :size="16" /> Kiểm tra lịch này</button>
    </div>
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

.item-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
}

.schedule {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
}

.schedule > .tool-field {
  flex: 1 1 320px;
}

.schedule > .tool-field:first-child {
  flex: 0 1 auto;
}

.all-day {
  font-weight: 400;
}

.all-day-note {
  display: flex;
  align-items: center;
  min-height: 38px;
}

.name-row {
  grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 640px) {
  .name-row {
    grid-template-columns: minmax(0, 1fr) 160px;
  }
}

.mc-name {
  align-self: flex-start;
  padding: 1px 8px;
  border-radius: 4px;
  background-color: #1e1e22;
  color: #ffffff;
  font-size: 13px;
}

.days {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.day {
  min-width: 44px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.day.active {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.hours {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
}

.hours .time {
  width: 120px;
}

.summary {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-brand-1);
}
</style>
