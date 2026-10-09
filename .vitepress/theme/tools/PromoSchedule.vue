<script setup lang="ts">
import { ChevronLeft, ChevronRight, FileText, Trash2 } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { parse } from 'yaml'
import {
  ALL_DAYS, DAY_NAMES, colorSegments, describe, formatMinute, isActive, parsePromos, pickCurrent, stripColors,
  type PromoEntry,
} from './promo'
import { CHECKER_SAMPLE as SAMPLE, checkerSource } from './promo-store'
import { useSessionState } from './session-state'
import DateTimeField from './DateTimeField.vue'
import IconButton from './IconButton.vue'
import { vTip } from './tooltip'

// nội dung dùng chung với phần Tạo lịch khuyến mãi
const source = computed({ get: () => checkerSource.value, set: (v: string) => (checkerSource.value = v) })

const PALETTE = ['#3ecf8e', '#f5a524', '#a78bfa', '#38bdf8', '#f472b6', '#facc15', '#fb7185', '#34d399', '#60a5fa', '#c084fc']

const SLOT_MINUTES = 30
const SLOTS = (24 * 60) / SLOT_MINUTES

const parsed = computed(() => {
  try {
    return { result: parsePromos(parse(source.value)), error: '' }
  } catch (e: any) {
    return { result: { entries: [] as PromoEntry[] }, error: String(e.message ?? e) }
  }
})
const entries = computed(() => parsed.value.result.entries)
const valid = computed(() => entries.value.filter((e) => !e.error))
const colorOf = (e: PromoEntry) => PALETTE[valid.value.indexOf(e) % PALETTE.length]

const pad = (n: number) => String(n).padStart(2, '0')
const toLocalInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
const at = ref('')
onMounted(() => (at.value = toLocalInput(new Date())))
// đăng ký sau onMounted ở trên: có dữ liệu đã lưu thì dùng, không thì giữ thời điểm hiện tại
useSessionState('promo-calendar', { at })
const atDate = computed(() => (at.value ? new Date(at.value) : new Date()))
const atResult = computed(() => (at.value ? pickCurrent(valid.value, atDate.value) : undefined))
/** ô 30 phút chứa thời điểm đang xem */
const atSlot = computed(() => ({
  day: (atDate.value.getDay() + 6) % 7,
  slot: Math.floor((atDate.value.getHours() * 60 + atDate.value.getMinutes()) / SLOT_MINUTES),
}))

const weekStart = computed(() => {
  const d = atDate.value
  const offset = (d.getDay() + 6) % 7 // thứ 2 là đầu tuần
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - offset)
})
const days = computed(() =>
  ALL_DAYS.map((code, i) => {
    const date = new Date(weekStart.value.getFullYear(), weekStart.value.getMonth(), weekStart.value.getDate() + i)
    const slots = Array.from({ length: SLOTS }, (_, s) => {
      const t = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, s * SLOT_MINUTES)
      const { applied, active } = pickCurrent(valid.value, t)
      return { applied, others: active.filter((a) => a !== applied), start: s * SLOT_MINUTES }
    })
    return { code, label: DAY_NAMES[code], date: `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`, slots }
  }),
)
function shiftWeek(delta: number) {
  const d = new Date(atDate.value)
  d.setDate(d.getDate() + delta * 7)
  at.value = toLocalInput(d)
}
function pickSlot(dayIndex: number, slot: number) {
  const s = weekStart.value
  at.value = toLocalInput(new Date(s.getFullYear(), s.getMonth(), s.getDate() + dayIndex, 0, slot * SLOT_MINUTES))
}
function slotTitle(day: { label: string; date: string }, slot: { applied?: PromoEntry; others: PromoEntry[]; start: number }) {
  const time = `${day.label} ${day.date} ${formatMinute(slot.start)}-${formatMinute(slot.start + SLOT_MINUTES)}`
  if (!slot.applied) return `${time}: không có khuyến mãi`
  const extra = slot.others.length ? `\nBị bỏ qua: ${slot.others.map((o) => stripColors(o.name)).join(', ')}` : ''
  return `${time}: ${stripColors(slot.applied.name)} (+${Math.round(slot.applied.rate! * 100)}%)${extra}`
}
const percent = (e: PromoEntry) => `+${Math.round(e.rate! * 100)}%`
</script>

<template>
  <div class="tool vp-raw">
    <div class="tool-panel">
      <div class="tool-field">
        <span class="tool-label">Nội dung khuyenmai.yml</span>
        <textarea v-model="source" rows="14" spellcheck="false" />
        <span class="tool-hint">Dán toàn bộ file, hoặc chỉ phần <code>khuyen-mai:</code>. Thời gian tính theo múi giờ máy bạn.</span>
      </div>
      <div class="tool-actions">
        <button type="button" class="tool-btn small" @click="source = SAMPLE"><FileText :size="14" /> Dùng ví dụ</button>
        <button type="button" class="tool-btn small danger" @click="source = ''"><Trash2 :size="14" /> Xóa nội dung</button>
      </div>
    </div>

    <p v-if="parsed.error" class="tool-error">Lỗi cú pháp YAML: {{ parsed.error }}</p>

    <template v-else>
      <div class="tool-panel">
        <h4 class="tool-panel-title">Danh sách khuyến mãi ({{ valid.length }}/{{ entries.length }} hợp lệ)</h4>
        <p v-if="entries.length === 0" class="tool-muted">Không tìm thấy mục nào trong <code>khuyen-mai</code>.</p>
        <ul class="entries">
          <li v-for="e in entries" :key="e.index" :class="{ invalid: e.error }">
            <span class="dot" :style="{ background: e.error ? 'var(--vp-c-danger-1)' : colorOf(e) }" />
            <div class="entry-body">
              <div class="entry-head">
                <span class="mc-name">
                  <span v-for="(seg, i) in colorSegments(e.name || '<không có tên>')" :key="i"
                    :style="{ color: seg.color, fontWeight: seg.bold ? 700 : undefined }">{{ seg.text }}</span>
                </span>
                <span v-if="!e.error" class="rate">{{ percent(e) }}</span>
              </div>
              <span v-if="e.error" class="tool-error small">
                Bị bỏ qua do không hợp lệ: {{ e.error }}
              </span>
              <span v-else class="tool-muted small">{{ describe(e.schedule!) }}</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="tool-panel">
        <div class="week-head">
          <h4 class="tool-panel-title">Lịch áp dụng</h4>
          <div class="week-nav">
            <IconButton :icon="ChevronLeft" tip="Tuần trước" @click="shiftWeek(-1)" />
            <div class="at"><DateTimeField v-model="at" /></div>
            <IconButton :icon="ChevronRight" tip="Tuần sau" @click="shiftWeek(1)" />
          </div>
        </div>

        <div v-if="atResult" class="at-result">
          <p v-if="!atResult.applied" class="tool-muted">
            Thời điểm này không có khuyến mãi nào trong <code>khuyenmai.yml</code> hoạt động.
          </p>
          <template v-else>
            <p class="applied">
              <span class="dot" :style="{ background: colorOf(atResult.applied) }" />
              Thời điểm này áp dụng: <b>{{ stripColors(atResult.applied.name) }}</b>
              <span class="rate">{{ percent(atResult.applied) }}</span>
            </p>
            <p v-if="atResult.active.length > 1" class="tool-muted small">
              Đang có {{ atResult.active.length }} khuyến mãi cùng hoạt động, các khuyến mãi bị bỏ qua vì tỉ lệ thấp hơn:
              {{ atResult.active.filter((a) => a !== atResult!.applied).map((a) => `${stripColors(a.name)} (${percent(a)})`).join(', ') }}
            </p>
          </template>
        </div>

        <div v-if="at" class="calendar">
          <div class="hours">
            <span v-for="h in 12" :key="h" class="hour" :style="{ top: `${((h - 1) * 2 * 60) / SLOT_MINUTES * 100 / SLOTS}%` }">
              {{ formatMinute((h - 1) * 120) }}
            </span>
          </div>
          <div v-for="(d, di) in days" :key="d.code" class="day">
            <div class="day-head" :class="{ current: di === atSlot.day }">{{ d.label }}<span>{{ d.date }}</span></div>
            <div class="slots">
              <span v-for="(s, i) in d.slots" :key="i" v-tip="slotTitle(d, s)" class="slot"
                :class="{ filled: s.applied, current: di === atSlot.day && i === atSlot.slot }"
                :style="s.applied ? { '--slot-color': colorOf(s.applied) } : undefined" @click="pickSlot(di, i)" />
            </div>
          </div>
        </div>

        <div class="legend">
          <span v-for="e in valid" :key="e.index" class="legend-item">
            <span class="dot" :style="{ background: colorOf(e) }" />{{ stripColors(e.name) }} ({{ percent(e) }})
          </span>
        </div>
        <span class="tool-hint">Mỗi ô là 30 phút, màu là khuyến mãi được áp dụng. Bấm vào ô để xem chi tiết thời điểm đó.</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.entries {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.entries li {
  display: flex;
  gap: 10px;
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
}

.entries li.invalid {
  border-color: var(--vp-c-danger-2);
}

.dot {
  flex-shrink: 0;
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 50%;
}

.entry-body {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.entry-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.mc-name {
  font-weight: 600;
}

.rate {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.small {
  font-size: 13px;
}

.week-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.week-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.at {
  width: 230px;
}

.at-result p {
  margin: 0;
}

.applied {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px !important;
}

.applied .dot {
  margin-top: 0;
}

.calendar {
  display: grid;
  grid-template-columns: 44px repeat(7, minmax(0, 1fr));
  gap: 4px;
}

.hours {
  position: relative;
  margin-top: 36px;
  height: 480px;
}

.hour {
  position: absolute;
  right: 4px;
  font-size: 11px;
  color: var(--vp-c-text-3);
  transform: translateY(-50%);
}

.day-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 32px;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
}

.day-head span {
  font-weight: 400;
  color: var(--vp-c-text-3);
}

.day-head.current,
.day-head.current span {
  color: var(--vp-c-brand-1);
}

.slots {
  display: grid;
  grid-template-rows: repeat(48, 10px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background-color: var(--vp-c-bg);
}

/* không dùng overflow: hidden cho .slots để ô phóng to khi hover không bị cắt, nên bo góc ô đầu và cuối.
   Mọi ô 30 phút có cùng một vạch ngăn, để mỗi ô là một khung giờ riêng */
.slot {
  position: relative;
  border-bottom: 1px solid var(--vp-c-divider);
  cursor: pointer;
}

.slot:first-child {
  border-radius: 5px 5px 0 0;
}

.slot:last-child {
  border-bottom: 0;
  border-radius: 0 0 5px 5px;
}

/* màu và hiệu ứng vẽ ở lớp ::before không nhận chuột: ô gốc đứng yên nên vùng hover luôn khớp với vị trí chuột */
.slot::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: var(--slot-color, transparent);
  pointer-events: none;
  transition:
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s,
    border-radius 0.2s;
}

.slot:hover {
  z-index: 2;
}

.slot:hover::before {
  border-radius: 4px;
  transform: translateY(-1px) scale(1.08, 1.6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
}

.slot:not(.filled):hover::before {
  background-color: var(--vp-c-default-2);
}

.slot.current {
  z-index: 1;
  outline: 2px solid var(--vp-c-text-1);
  outline-offset: -1px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  font-size: 13px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-item .dot {
  margin-top: 0;
}
</style>
