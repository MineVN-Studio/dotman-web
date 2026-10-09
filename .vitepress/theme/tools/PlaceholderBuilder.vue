<script setup lang="ts">
import { computed, ref } from 'vue'
import CopyBlock from './CopyBlock.vue'
import ToolSelect, { type SelectOption } from './ToolSelect.vue'
import { useSessionState } from './session-state'

type Kind = 'data' | 'top' | 'masterdata'
type Period = 'all' | 'day' | 'week' | 'month' | 'frame'

const KINDS: { value: Kind; label: string }[] = [
  { value: 'data', label: 'Dữ liệu người chơi' },
  { value: 'top', label: 'Top nạp' },
  { value: 'masterdata', label: 'Tổng server' },
]
const PERIODS: { value: Period; label: string; suffix: string; text: string }[] = [
  { value: 'all', label: 'Toàn thời gian', suffix: '', text: 'từ trước tới nay' },
  { value: 'day', label: 'Hôm nay', suffix: 'day', text: 'hôm nay' },
  { value: 'week', label: 'Tuần này', suffix: 'week', text: 'tuần này' },
  { value: 'month', label: 'Tháng này', suffix: 'month', text: 'tháng này' },
  { value: 'frame', label: 'Khung thời gian', suffix: 'frame', text: 'trong khung thời gian' },
]
const KEYS = [
  { value: 'donate_total', label: 'donate_total', text: 'tổng số tiền nạp (VNĐ)' },
  { value: 'point_from_card', label: 'point_from_card', text: 'tổng point nhận được từ các lần nạp' },
  { value: 'point_received', label: 'point_received', text: 'tổng point được cộng' },
  { value: 'point_used', label: 'point_used', text: 'tổng point đã tiêu' },
]
const KEY_OPTIONS: SelectOption[] = KEYS.map((k) => ({ value: k.value, label: `${k.label} - ${k.text}` }))

const kind = ref<Kind>('data')
const period = ref<Period>('all')
const frameId = ref('giang-sinh-2026')
const key = ref('donate_total')
const rank = ref(1)
const type = ref<'player' | 'value'>('player')
const listMode = ref(false)
const listTo = ref(10)
useSessionState('placeholder-builder', { kind, period, frameId, key, rank, type, listMode, listTo })

const frameError = computed(() => {
  if (period.value !== 'frame') return ''
  const id = frameId.value.trim()
  if (!id) return 'Nhập ID khung thời gian.'
  if (id.includes('_')) return 'ID khung thời gian không được chứa dấu gạch dưới (_).'
  if (/\s/.test(id)) return 'ID khung thời gian không được chứa khoảng trắng.'
  return ''
})

const prefix = computed(() => {
  const p = PERIODS.find((x) => x.value === period.value)!
  const head = kind.value + p.suffix
  return period.value === 'frame' ? `${head}_${frameId.value.trim()}` : head
})

function build(r: number, t: string) {
  const base = `${prefix.value}_${key.value}`
  return kind.value === 'top' ? `%dotman_${base}_${r}_${t}%` : `%dotman_${base}%`
}

const output = computed(() => {
  if (frameError.value) return ''
  if (kind.value === 'top' && listMode.value) {
    const n = Math.min(100, Math.max(1, Math.trunc(Number(listTo.value) || 1)))
    return Array.from({ length: n }, (_, i) => `${i + 1}. ${build(i + 1, 'player')} - ${build(i + 1, 'value')}`).join('\n')
  }
  return build(Math.max(1, Math.trunc(Number(rank.value) || 1)), type.value)
})

const description = computed(() => {
  const p = PERIODS.find((x) => x.value === period.value)!.text
  const k = KEYS.find((x) => x.value === key.value)!.text
  if (kind.value === 'data') return `Trả về ${k} của người chơi đang xem placeholder, ${p}. Chưa có dữ liệu thì trả về 0.`
  if (kind.value === 'masterdata') return `Trả về ${k} của cả server ${p}.`
  const what = type.value === 'player' ? 'tên người chơi' : 'giá trị'
  return `Trả về ${what} đứng hạng ${rank.value} của bảng xếp hạng ${k}, ${p}. Hạng chưa có người chơi thì trả về "Chưa xếp hạng" (player) hoặc 0 (value).`
})

// bản miễn phí chỉ hỗ trợ data/top toàn thời gian với key donate_total
const premium = computed(
  () => kind.value === 'masterdata' || period.value !== 'all' || key.value !== 'donate_total',
)
</script>

<template>
  <div class="tool vp-raw">
    <div class="tool-panel">
      <div class="tool-field">
        <span class="tool-label">Loại dữ liệu</span>
        <div class="tool-seg">
          <button v-for="k in KINDS" :key="k.value" type="button" :class="{ active: kind === k.value }"
            @click="kind = k.value">{{ k.label }}</button>
        </div>
      </div>

      <div class="tool-field">
        <span class="tool-label">Khoảng thời gian</span>
        <div class="tool-seg">
          <button v-for="p in PERIODS" :key="p.value" type="button" :class="{ active: period === p.value }"
            @click="period = p.value">{{ p.label }}</button>
        </div>
      </div>

      <div class="tool-grid cols-2">
        <div class="tool-field">
          <span class="tool-label">Key</span>
          <ToolSelect v-model="key" :options="KEY_OPTIONS" aria-label="Key" />
        </div>
        <label v-if="period === 'frame'" class="tool-field">
          <span class="tool-label">ID khung thời gian</span>
          <input v-model="frameId" type="text" placeholder="giang-sinh-2026" />
          <span class="tool-hint">ID khai báo trong <code>khungthoigian.yml</code></span>
        </label>
      </div>

      <div v-if="kind === 'top'" class="tool-grid cols-2">
        <label class="tool-field">
          <span class="tool-label">Hạng</span>
          <input v-model.number="rank" type="number" min="1" max="100" :disabled="listMode" />
        </label>
        <div class="tool-field">
          <span class="tool-label">Trả về</span>
          <div class="tool-seg">
            <button type="button" :class="{ active: type === 'player' }" :disabled="listMode"
              @click="type = 'player'">Tên người chơi</button>
            <button type="button" :class="{ active: type === 'value' }" :disabled="listMode"
              @click="type = 'value'">Giá trị</button>
          </div>
        </div>
        <label class="tool-check">
          <input v-model="listMode" type="checkbox" />
          Tạo danh sách từ hạng 1 tới
          <input v-model.number="listTo" class="inline-num" type="number" min="1" max="100" :disabled="!listMode" />
        </label>
      </div>
    </div>

    <p v-if="frameError" class="tool-error">{{ frameError }}</p>
    <template v-else>
      <CopyBlock :code="output" title="Placeholder" />
      <p class="tool-muted desc">
        {{ description }}
        <span v-if="premium" class="tool-tag">Premium</span>
      </p>
    </template>
  </div>
</template>

<style scoped>
.inline-num {
  width: 80px !important;
}

/* badge xếp inline ngay sau chữ, hết chữ mới xuống dòng cùng chữ (flex sẽ đẩy badge xuống dòng riêng) */
.desc {
  margin: -8px 0 0;
}

.desc .tool-tag {
  margin-left: 6px;
  vertical-align: 1px;
  white-space: nowrap;
}
</style>
