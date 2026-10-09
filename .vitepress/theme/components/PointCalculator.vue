<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useSessionState } from '../tools/session-state'

// Mệnh giá thẻ cào DotMan hỗ trợ (CardPrice)
const CARD_PRICES = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000]

const amount = ref(100000)
const promoPercent = ref(0)
const firstDonate = ref(false)
const firstDonatePercent = ref(100)

// Giá trị mặc định lấy từ file config mẫu của DotMan
const cfg = reactive({
  cardPoint: 100,
  bankPointBase: 1,
  bankPointExtra: 0.5,
  bankMinAmount: 10000,
  manualPointBase: 1,
  manualPointExtra: 0.5,
})

// Khi đổi số tiền sang một mệnh giá thẻ, gợi ý lại point theo donate-amounts mặc định (1000 VNĐ = 1 point).
// Không dùng watch để khi khôi phục dữ liệu đã lưu, point đã chỉnh không bị ghi đè.
const amountModel = computed({
  get: () => amount.value,
  set(v: number) {
    if (v === amount.value) return
    amount.value = v
    if (CARD_PRICES.includes(v)) cfg.cardPoint = v / 1000
  },
})

useSessionState('point-calculator', { amount, promoPercent, firstDonate, firstDonatePercent, cfg })

const num = (v: unknown) => Number(v) || 0
// Kotlin .toInt() cắt phần thập phân; cộng epsilon để tránh lỗi số thực (2.9999 -> 2)
const toInt = (x: number) => Math.trunc(x + 1e-9)
const fmt = (n: number) => n.toLocaleString('vi-VN', { maximumFractionDigits: 2 })
const plain = (n: number) => String(+n.toFixed(4))

const promoRate = computed(() => num(promoPercent.value) / 100)
const firstRate = computed(() => (firstDonate.value ? num(firstDonatePercent.value) / 100 : 0))

interface Flow {
  key: string
  title: string
  error?: string
  rate?: number
  base?: number
  extra?: number | null
  promo?: number
  total?: number
}

const card = computed<Flow>(() => {
  const flow = { key: 'card', title: 'Thẻ cào' }
  if (!CARD_PRICES.includes(amount.value)) {
    return { ...flow, error: 'Số tiền không trùng mệnh giá thẻ nào (10.000đ tới 1.000.000đ).' }
  }
  const rate = promoRate.value + firstRate.value
  const base = toInt(num(cfg.cardPoint))
  const promo = toInt(base * rate)
  return {
    ...flow,
    rate,
    base,
    extra: null,
    promo,
    total: base + promo,
  }
})

function perThousand(key: string, title: string, pointBase: number, pointExtra: number, rate: number): Flow {
  const k = Math.trunc(amount.value / 1000)
  return {
    key,
    title,
    rate,
    base: k * pointBase,
    extra: k * pointExtra,
    promo: k * pointBase * rate,
    total: toInt(k * (pointBase + pointExtra + pointBase * rate)),
  }
}

const bank = computed<Flow>(() => {
  const title = 'Chuyển khoản'
  if (amount.value % 1000 !== 0) return { key: 'bank', title, error: 'Số tiền phải là bội số của 1000.' }
  if (amount.value < num(cfg.bankMinAmount)) {
    return { key: 'bank', title, error: `Thấp hơn số tiền tối thiểu ${fmt(num(cfg.bankMinAmount))}đ.` }
  }
  return perThousand('bank', title, num(cfg.bankPointBase), num(cfg.bankPointExtra), promoRate.value + firstRate.value)
})

// nạp thủ công không áp dụng khuyến mãi nạp lần đầu
const manual = computed<Flow>(() =>
  perThousand('manual', 'Nạp thủ công', num(cfg.manualPointBase), num(cfg.manualPointExtra), promoRate.value),
)

const flows = computed(() => [card.value, bank.value, manual.value])

const rows: { label: string; cell: (f: Flow) => string; sub?: (f: Flow) => string; cls?: string }[] = [
  { label: 'Point gốc', cell: (f) => fmt(f.base!) },
  { label: 'Point nhận thêm', cell: (f) => (f.extra === null ? '-' : '+' + fmt(f.extra!)) },
  { label: 'Khuyến mãi', cell: (f) => '+' + fmt(f.promo!), sub: (f) => `${Math.round(f.rate! * 100)}%`, cls: 'bonus' },
  { label: 'Tổng nhận được', cell: (f) => fmt(f.total!), cls: 'total' },
]

// Cấu hình nâng cao, chia nhóm theo phương thức nạp
const settings = [
  {
    group: 'Thẻ cào',
    items: [{ label: 'Point theo mệnh giá', file: 'config.yml', key: 'donate-amounts', model: 'cardPoint', step: 1 }],
  },
  {
    group: 'Chuyển khoản',
    items: [
      { label: 'Point tiêu chuẩn / 1000đ', file: 'banking.yml', key: 'point-base', model: 'bankPointBase', step: 0.1 },
      { label: 'Point nhận thêm / 1000đ', file: 'banking.yml', key: 'point-extra', model: 'bankPointExtra', step: 0.1 },
      { label: 'Số tiền tối thiểu', file: 'providers/banking/*.yml', key: 'min-amount', model: 'bankMinAmount', step: 1000 },
    ],
  },
  {
    group: 'Nạp thủ công',
    items: [
      { label: 'Point tiêu chuẩn / 1000đ', file: 'config.yml', key: 'manual.point-base', model: 'manualPointBase', step: 0.1 },
      { label: 'Point nhận thêm / 1000đ', file: 'config.yml', key: 'manual.point-extra', model: 'manualPointExtra', step: 0.1 },
    ],
  },
] as const
</script>

<template>
  <div class="calc vp-raw">
    <div class="panel">
      <div class="field">
        <span class="label">Số tiền nạp (VNĐ)</span>
        <input v-model.number="amountModel" class="big" type="number" min="0" step="1000" inputmode="numeric" />
        <div class="chips">
          <button v-for="p in CARD_PRICES" :key="p" type="button" class="chip" :class="{ active: amount === p }"
            @click="amountModel = p">
            {{ p >= 1000000 ? p / 1000000 + 'tr' : p / 1000 + 'k' }}
          </button>
        </div>
      </div>

      <div class="row">
        <label class="field">
          <span class="label">Khuyến mãi đang áp dụng (%)</span>
          <input v-model.number="promoPercent" type="number" min="0" step="10" />
          <span class="hint">Tương ứng <code>rate: {{ plain(promoRate) }}</code> trong <code>khuyenmai.yml</code></span>
        </label>
        <label class="field">
          <span class="label">
            <input v-model="firstDonate" type="checkbox" />
            Lần nạp đầu tiên (%) <span class="tag">Premium</span>
          </span>
          <input v-model.number="firstDonatePercent" type="number" min="0" step="10" :disabled="!firstDonate" />
          <span class="hint">Tương ứng <code>first-donate.extra-rate: {{ plain(firstRate) }}</code></span>
        </label>
      </div>

      <details class="advanced">
        <summary>Cấu hình nâng cao (theo config server của bạn)</summary>
        <div class="settings">
          <template v-for="s in settings" :key="s.group">
            <div class="settings-group">{{ s.group }}</div>
            <label v-for="item in s.items" :key="item.key" class="setting">
              <span class="setting-text">
                <span class="setting-label">{{ item.label }}</span>
                <span class="setting-key"><code>{{ item.key }}</code> trong {{ item.file }}</span>
              </span>
              <input v-model.number="cfg[item.model]" type="number" min="0" :step="item.step" />
            </label>
          </template>
        </div>
      </details>
    </div>

    <div class="result">
      <table>
        <colgroup>
          <col class="col-label" />
          <col v-for="f in flows" :key="f.key" />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th v-for="f in flows" :key="f.key">{{ f.title }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="r.label" :class="r.cls">
            <th scope="row">{{ r.label }}</th>
            <template v-for="f in flows" :key="f.key">
              <td v-if="f.error && i === 0" :rowspan="rows.length" class="error">{{ f.error }}</td>
              <td v-else-if="!f.error">
                {{ r.cell(f) }}
                <span v-if="r.sub" class="sub">{{ r.sub(f) }}</span>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.calc {
  display: grid;
  gap: 20px;
  margin: 24px 0;
  font-family: var(--vp-font-family-base);
}

input,
button {
  font: inherit;
}

code {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-brand-1);
}

.panel {
  display: grid;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
}

.row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

input[type='number'] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}

input[type='number']:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

input[type='number']:disabled {
  opacity: 0.5;
}

input.big {
  font-size: 20px;
  font-weight: 600;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  padding: 2px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.chip:hover,
.chip.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.tag {
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  line-height: 18px;
  color: var(--vp-badge-tip-text);
  background-color: var(--vp-badge-tip-bg);
}

.advanced summary {
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

/* danh sách cấu hình: mỗi dòng gồm nhãn + key bên trái, ô nhập bên phải */
.settings {
  margin-top: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--vp-c-bg);
}

.settings-group {
  padding: 6px 14px;
  background-color: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.settings-group:first-child {
  border-top: 0;
}

.setting {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 140px;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  border-top: 1px solid var(--vp-c-divider);
}

.settings-group + .setting {
  border-top: 1px solid var(--vp-c-divider);
}

.setting-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.setting-key {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.setting input[type='number'] {
  padding: 6px 10px;
  font-size: 14px;
}

.result {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
}

table {
  display: table;
  width: 100%;
  margin: 0;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14px;
}

.col-label {
  width: 34%;
}

th,
td {
  padding: 10px 14px;
  border: 0;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

thead th {
  background-color: var(--vp-c-bg-soft);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

tbody th {
  background-color: transparent;
  text-align: left;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

/* bỏ nền xen kẽ của bảng mặc định trong tài liệu */
tr {
  background-color: transparent !important;
}

td {
  white-space: nowrap;
}

.sub {
  display: block;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

tr.bonus td {
  color: var(--vp-c-brand-1);
}

tr.total th {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

tr.total td {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

tbody tr:last-child > * {
  border-bottom: 0;
}

td.error {
  text-align: center;
  vertical-align: middle;
  font-size: 13px;
  color: var(--vp-c-danger-1);
}

@media (max-width: 639px) {
  th,
  td {
    padding: 8px 10px;
    font-size: 13px;
  }

  .col-label {
    width: 30%;
  }

  tr.total td {
    font-size: 17px;
  }

  .setting {
    grid-template-columns: minmax(0, 1fr) 96px;
    gap: 12px;
  }
}
</style>
