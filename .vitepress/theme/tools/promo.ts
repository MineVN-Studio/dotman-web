// Mô phỏng cách DotMan đọc và áp dụng khuyenmai.yml (PlannedExtras.kt, Schedule.kt).
// Thời gian tính theo múi giờ của trình duyệt.

export const MINUTES_PER_DAY = 24 * 60

/** 2..7 = thứ 2..thứ 7, 8 = chủ nhật (cách gọi trong khuyenmai.yml) */
export type DayCode = 2 | 3 | 4 | 5 | 6 | 7 | 8

export const DAY_NAMES: Record<DayCode, string> = { 2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6', 7: 'T7', 8: 'CN' }
export const ALL_DAYS: DayCode[] = [2, 3, 4, 5, 6, 7, 8]

export type Schedule =
  | { kind: 'fixed'; from: number; to: number }
  | { kind: 'weekly'; days: Set<DayCode>; start: number; end: number; from: number | null; to: number | null }

export interface PromoEntry {
  index: number
  name: string
  rate?: number
  schedule?: Schedule
  error?: string
}

export interface ParsedPromos {
  legacyName?: string
  entries: PromoEntry[]
}

/** Thứ trong tuần theo cách gọi của khuyenmai.yml */
export function dayCode(date: Date): DayCode {
  const d = date.getDay()
  return (d === 0 ? 8 : d + 1) as DayCode
}

/** dd/MM/yyyy HH:mm:ss hoặc dd/MM/yyyy HH:mm, không lenient (giống parseConfigDateTime) */
export function parseConfigDateTime(text: string): number {
  const value = text.trim()
  const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/)
  if (m) {
    const [d, mo, y, h, mi, s] = [m[1], m[2], m[3], m[4], m[5], m[6] ?? '0'].map(Number)
    const date = new Date(y, mo - 1, d, h, mi, s)
    const valid =
      date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d &&
      date.getHours() === h && date.getMinutes() === mi && date.getSeconds() === s
    if (valid) return date.getTime()
  }
  throw new Error(`'${value}' không hợp lệ, cần đúng định dạng dd/MM/yyyy HH:mm hoặc dd/MM/yyyy HH:mm:ss`)
}

function has(map: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(map, key)
}

function requireValue(map: Record<string, unknown>, key: string) {
  const v = map[key]
  if (v === null || v === undefined) throw new Error(`${key} rỗng`)
  return v
}

function parseTime(map: Record<string, unknown>, key: string): number | null {
  if (!has(map, key)) return null
  try {
    return parseConfigDateTime(String(requireValue(map, key)))
  } catch (e: any) {
    throw new Error(e.message.endsWith('rỗng') ? e.message : `${key} ${e.message}`)
  }
}

export function parseDays(value: unknown): Set<DayCode> {
  const items = Array.isArray(value) ? value.map((x) => String(x)) : String(value).split(',')
  const trimmed = items.map((x) => x.trim()).filter((x) => x.length > 0)
  if (trimmed.length === 0) throw new Error('days rỗng')
  return new Set(
    trimmed.map((item) => {
      const n = /^[+-]?\d+$/.test(item) ? Number(item) : NaN
      if (!(n >= 2 && n <= 8)) throw new Error(`thứ '${item}' không hợp lệ, chỉ nhận 2..8 (8 = chủ nhật)`)
      return n as DayCode
    }),
  )
}

export function parseHours(value: string): [number, number] {
  const m = value.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/)
  if (!m) throw new Error(`hours '${value}' không đúng định dạng HH:mm-HH:mm`)
  const [sh, sm, eh, em] = m.slice(1).map(Number)
  const start = sh * 60 + sm
  const end = eh * 60 + em
  if (sm >= 60 || em >= 60 || start < 0 || start >= MINUTES_PER_DAY || end < 1 || end > MINUTES_PER_DAY) {
    throw new Error(`hours '${value}' có giờ/phút không hợp lệ`)
  }
  if (start >= end) {
    throw new Error(`hours '${value}' phải có giờ bắt đầu trước giờ kết thúc, không hỗ trợ qua nửa đêm`)
  }
  return [start, end]
}

function parseSchedule(map: Record<string, unknown>): Schedule {
  const hasWeekly = has(map, 'days') || has(map, 'hours')
  const from = parseTime(map, 'from')
  const to = parseTime(map, 'to')

  if (from !== null && to !== null && from >= to) {
    throw new Error(`thời gian bắt đầu phải trước thời gian kết thúc: ${map.from} >= ${map.to}`)
  }
  if (!hasWeekly) {
    if (from === null || to === null) throw new Error('thiếu from/to hoặc days/hours')
    return { kind: 'fixed', from, to }
  }
  const days = has(map, 'days') ? parseDays(requireValue(map, 'days')) : new Set(ALL_DAYS)
  const [start, end] = has(map, 'hours')
    ? parseHours(String(requireValue(map, 'hours')).trim())
    : [0, MINUTES_PER_DAY]
  return { kind: 'weekly', days, start, end, from, to }
}

/** Đọc danh sách khuyen-mai đã parse từ YAML, báo lỗi từng mục giống plugin */
export function parsePromos(doc: unknown): ParsedPromos {
  const root = (doc && typeof doc === 'object' ? doc : {}) as Record<string, unknown>
  const list = Array.isArray(root['khuyen-mai']) ? (root['khuyen-mai'] as unknown[]) : []
  const entries = list.map((item, index): PromoEntry => {
    const map = item && typeof item === 'object' && !Array.isArray(item) ? (item as Record<string, unknown>) : null
    const name = typeof map?.name === 'string' ? (map.name as string) : ''
    try {
      if (!map) throw new Error('mỗi khuyến mãi phải là một mục có name, rate và thời gian')
      if (typeof map.name !== 'string') throw new Error('thiếu name')
      if (typeof map.rate !== 'number') throw new Error('thiếu rate hoặc rate không phải số')
      return { index, name, rate: map.rate, schedule: parseSchedule(map) }
    } catch (e: any) {
      return { index, name, error: e.message }
    }
  })
  return { legacyName: typeof root['legacy-name'] === 'string' ? root['legacy-name'] : undefined, entries }
}

export function isActive(s: Schedule, t: Date): boolean {
  const ms = t.getTime()
  if (s.kind === 'fixed') return s.from <= ms && ms <= s.to
  const inRange = (s.from === null || s.from <= ms) && (s.to === null || ms <= s.to)
  const minute = t.getHours() * 60 + t.getMinutes()
  return inRange && s.days.has(dayCode(t)) && s.start <= minute && minute < s.end
}

/** Khuyến mãi được áp dụng: rate cao nhất trong các mục đang hoạt động, cùng rate thì lấy mục đứng trước */
export function pickCurrent(entries: PromoEntry[], t: Date): { applied?: PromoEntry; active: PromoEntry[] } {
  const active = entries.filter((e) => e.schedule && isActive(e.schedule, t))
  let applied: PromoEntry | undefined
  for (const e of active) if (!applied || e.rate! > applied.rate!) applied = e
  return { applied, active }
}

const pad = (n: number) => String(n).padStart(2, '0')
export const formatMinute = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
export function formatDateTime(ms: number) {
  const d = new Date(ms)
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Mô tả lịch bằng chữ, giống log của plugin */
export function describe(s: Schedule): string {
  if (s.kind === 'fixed') return `Ngày cố định: ${formatDateTime(s.from)} → ${formatDateTime(s.to)}`
  const days = s.days.size === 7 ? 'mọi ngày' : ALL_DAYS.filter((d) => s.days.has(d)).map((d) => DAY_NAMES[d]).join(', ')
  const hours = s.start === 0 && s.end === MINUTES_PER_DAY ? 'cả ngày' : `${formatMinute(s.start)}-${formatMinute(s.end)}`
  const range = [s.from !== null ? `từ ${formatDateTime(s.from)}` : '', s.to !== null ? `đến ${formatDateTime(s.to)}` : '']
    .filter(Boolean)
    .join(' ')
  return `Lặp lại: ${days}, ${hours}${range ? `; ${range}` : ''}`
}

// Mã màu Minecraft -> màu hiển thị
const MC_COLORS: Record<string, string> = {
  '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA', '4': '#AA0000', '5': '#AA00AA',
  '6': '#FFAA00', '7': '#AAAAAA', '8': '#555555', '9': '#5555FF', a: '#55FF55', b: '#55FFFF',
  c: '#FF5555', d: '#FF55FF', e: '#FFFF55', f: '#FFFFFF',
}

/** Chuyển tên có mã màu (&a, &l...) thành các đoạn chữ kèm màu để hiển thị */
export function colorSegments(text: string): { text: string; color?: string; bold?: boolean }[] {
  const out: { text: string; color?: string; bold?: boolean }[] = []
  let color: string | undefined
  let bold = false
  const parts = text.split(/[&§]([0-9a-fk-or])/i)
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      const code = part.toLowerCase()
      if (MC_COLORS[code]) {
        color = MC_COLORS[code]
        bold = false
      } else if (code === 'l') bold = true
      else if (code === 'r') {
        color = undefined
        bold = false
      }
    } else if (part) out.push({ text: part, color, bold })
  })
  return out
}

export const stripColors = (text: string) => text.replace(/[&§][0-9a-fk-or]/gi, '')
