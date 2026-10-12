<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { parse } from 'yaml'
import { Plus, Trash2, Upload } from 'lucide-vue-next'
import CopyBlock from './CopyBlock.vue'
import IconButton from './IconButton.vue'
import ToolIssues from './ToolIssues.vue'
import ToolSelect, { type SelectOption } from './ToolSelect.vue'
import { lines, q, slashCommands } from './yaml-out'
import { useSessionState } from './session-state'

type Provider = 'MBBANK' | 'PAYOS' | 'SEPAY' | 'PAYMENT-SERVICE'
type SecretKey = 'username' | 'password' | 'client-id' | 'api-key' | 'checksum-key' | 'api-token' | 'url'

interface Secret {
  key: SecretKey
  label: string
  /** giá trị trong file mẫu, plugin xem như chưa điền */
  sample: string
  password?: boolean
}

const BANK_NAMES: Record<string, string> = {
  MBBANK: 'MBBank', MB: 'MBBank', VCB: 'Vietcombank', STB: 'Sacombank', TPB: 'TPBank', VPB: 'VPBank',
  ICB: 'VietinBank', ACB: 'ACB', BIDV: 'BIDV', OCB: 'OCB', KLB: 'KienlongBank', MSB: 'MSB',
}
const bankOptions = (codes: string[]): SelectOption[] => codes.map((c) => ({ value: c, label: `${c} - ${BANK_NAMES[c]}` }))

const PROVIDERS: {
  value: Provider
  label: string
  file: string
  /** danh sách ngân hàng hỗ trợ, null: MBBank không có mục bank, []: nhập tự do */
  banks: SelectOption[] | null
  secrets: Secret[]
}[] = [
  {
    value: 'MBBANK', label: 'MBBank', file: 'mbbank.yml', banks: null,
    secrets: [
      { key: 'username', label: 'Tên đăng nhập MBBank', sample: 'username' },
      { key: 'password', label: 'Mật khẩu MBBank', sample: 'password', password: true },
    ],
  },
  {
    value: 'PAYOS', label: 'PayOS', file: 'payos.yml', banks: bankOptions(['MBBANK', 'BIDV', 'ACB', 'OCB', 'KLB']),
    secrets: [
      { key: 'client-id', label: 'Client ID', sample: 'client-id' },
      { key: 'api-key', label: 'API Key', sample: 'api-key' },
      { key: 'checksum-key', label: 'Checksum Key', sample: 'checksum-key' },
    ],
  },
  {
    value: 'SEPAY', label: 'SePay', file: 'sepay.yml',
    banks: bankOptions(['VCB', 'STB', 'TPB', 'VPB', 'ICB', 'ACB', 'BIDV', 'MB', 'OCB', 'KLB', 'MSB']),
    secrets: [{ key: 'api-token', label: 'API Token', sample: 'api-token' }],
  },
  {
    value: 'PAYMENT-SERVICE', label: 'Payment Service', file: 'payment-service.yml', banks: [],
    secrets: [{ key: 'url', label: 'Endpoint Payment Service', sample: '' }],
  },
]

// giá trị mẫu của file providers/banking/*.yml, plugin xem như chưa điền khi lưu bằng /dotman configdb
const SAMPLE = { account: '0123456789', accountQr: 'nickname', accountName: 'NGUYEN VAN A' }

interface DonateTier {
  id: number
  amount: number
  commands: string
}

let nextId = 1
const tier = (amount: number, commands: string): DonateTier => ({ id: nextId++, amount, commands })

const provider = ref<Provider>('MBBANK')
const banks = reactive<Record<string, string>>({ PAYOS: 'MBBANK', SEPAY: 'MB', 'PAYMENT-SERVICE': 'MBBANK' })
const payosMode = ref<'openapi' | 'vietqr'>('openapi')
const account = reactive({ account: '', accountQr: '', accountName: '', minAmount: 10000 })
const payosUrls = reactive({ success: 'https://minevn.net', cancel: 'https://minevn.net' })
const general = reactive({
  enabled: true,
  interval: 5,
  expiry: 600,
  bossbar: true,
  bossbarTitle: '&aThời gian chuyển khoản: &e%TIME%',
  pointBase: 1,
  pointExtra: 0.5,
  commands: 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%',
})
const tiers = ref<DonateTier[]>([
  tier(10000, 'tell %PLAYER% Cảm ơn bạn đã ủng hộ server!'),
  tier(50000, 'give %PLAYER% diamond 5'),
  tier(100000, 'give %PLAYER% diamond 15'),
])
const proxy = reactive({ enabled: false, socks: false, host: '127.0.0.1', port: 1080 })
// thông tin đăng nhập, API không lưu vào sessionStorage
const secrets = reactive<Record<SecretKey, string>>({
  username: '', password: '', 'client-id': '', 'api-key': '', 'checksum-key': '', 'api-token': '',
  url: 'http://localhost:3000/payments',
})

const importText = ref('')
const importError = ref('')
const importInfo = ref('')

useSessionState(
  'banking-builder',
  { provider, banks, payosMode, account, payosUrls, general, tiers, proxy, importText },
  () => {
    nextId = Math.max(nextId, ...tiers.value.map((t) => t.id + 1))
  },
)

const current = computed(() => PROVIDERS.find((p) => p.value === provider.value)!)
const providerFile = computed(() => `providers/banking/${current.value.file}`)
// PayOS VietQR Pro tự cấp số tài khoản khi tạo giao dịch
const usesAccountNumber = computed(() => !(provider.value === 'PAYOS' && payosMode.value === 'vietqr'))
const bank = computed(() => (provider.value === 'MBBANK' ? 'MBBANK' : banks[provider.value].trim()))

/** Tên chủ tài khoản viết hoa, không dấu */
const normalizeName = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .trim()

const accountName = computed(() => normalizeName(account.accountName))
const accountNumber = computed(() => (usesAccountNumber.value ? account.account.trim() : ''))
const accountQr = computed(() => (usesAccountNumber.value ? account.accountQr.trim() || accountNumber.value : ''))

const int = (v: unknown) => Math.trunc(Number(v) || 0)
const num = (v: unknown) => String(Number(v) || 0)

const pointExample = computed(() => Math.floor(100 * (Number(general.pointBase) + Number(general.pointExtra))))

function commandList(text: string, indent: string) {
  const cmds = lines(text)
  return cmds.map((c) => `${indent}- ${q(c)}`)
}

const bankingYaml = computed(() => {
  const g = general
  const out = [
    '# ============================================',
    '# CẤU HÌNH CHUNG',
    '# ============================================',
    '',
    '# Bật/tắt tự động duyệt ngân hàng',
    `enabled: ${g.enabled}`,
    '',
    '# Provider ngân hàng sử dụng',
    '# Hỗ trợ: MBBANK, PAYOS, SEPAY, PAYMENT-SERVICE',
    `# Thông tin tài khoản và API đặt tại ${providerFile.value}`,
    '# Lưu ý: Sau khi chạy /dotman configdb, provider sẽ được khóa trên database và mục này sẽ bị bỏ qua.',
    `provider: ${provider.value}`,
    '',
    '# Thời gian quét lịch sử giao dịch (giây)',
    `interval: ${int(g.interval)}`,
    '',
    '# Thời gian hết hạn giao dịch (giây)',
    `transaction-expiry: ${int(g.expiry)}`,
    '',
    '# BossBar đếm ngược thời gian chuyển khoản',
    'bossbar:',
    `  enabled: ${g.bossbar}`,
    `  title: ${q(g.bossbarTitle)}`,
    '',
    '# ============================================',
    '# TÍNH TOÁN POINT VÀ LỆNH THỰC THI',
    '# ============================================',
    '',
    '# Công thức: point = (amount/1000) * [(point-base + point-extra) + (point-base * khuyến mãi)]',
    '',
    '# Số point tiêu chuẩn trên mỗi 1000 VNĐ',
    `point-base: ${num(g.pointBase)}`,
    '',
    '# Số point được nhận thêm khi nạp qua ngân hàng',
    `point-extra: ${num(g.pointExtra)}`,
    '',
    '# Lệnh thực thi sau khi nạp thành công',
  ]
  const cmds = commandList(g.commands, '  ')
  out.push(cmds.length ? 'commands:' : 'commands: []', ...cmds)
  out.push('', '# Lệnh thực thi theo mốc nạp (hệ thống chọn mốc gần nhất)')
  const sorted = [...tiers.value].sort((a, b) => int(a.amount) - int(b.amount))
  out.push(sorted.length ? 'minimum-donate-commands:' : 'minimum-donate-commands: {}')
  for (const t of sorted) {
    const list = commandList(t.commands, '    ')
    out.push(`  ${int(t.amount)}:${list.length ? '' : ' []'}`, ...list)
  }
  out.push(
    '',
    '# ============================================',
    '# CẤU HÌNH NÂNG CAO',
    '# ============================================',
    '',
    '# Proxy (dùng khi không kết nối được trực tiếp đến ngân hàng)',
    'proxy:',
    `  enabled: ${proxy.enabled}`,
    `  use-socks: ${proxy.socks}`,
    `  host: ${q(proxy.host.trim())}`,
    `  port: ${int(proxy.port)}`,
    '',
    '# Phiên bản cấu trúc config banking',
    '# Không thay đổi mục này nếu không biết',
    'config-version: 2',
  )
  return out.join('\n') + '\n'
})

const providerYaml = computed(() => {
  const s = secrets
  const out: string[] = []
  const header = (title: string, ...notes: string[]) =>
    out.push('# ============================================', `# ${title}`, ...notes.map((n) => `# ${n}`), '# ============================================', '')
  const accountLines = () => {
    out.push(
      '# Số tài khoản để tra cứu lịch sử giao dịch',
      `account: ${q(accountNumber.value)}`,
      '',
      '# Số tài khoản để hướng dẫn người chơi chuyển khoản tạo mã QR code',
      '# Có thể dùng nickname, nếu không có nickname thì hãy để giống account',
      `account-qr: ${q(accountQr.value)}`,
      '',
      '# Tên chủ tài khoản (viết hoa, không dấu)',
      `account-name: ${q(accountName.value)}`,
      '',
      '# Số tiền nạp tối thiểu (VNĐ)',
      `min-amount: ${int(account.minAmount)}`,
      '',
    )
  }
  switch (provider.value) {
    case 'MBBANK':
      header('Đăng nhập trực tiếp ngân hàng MBBank', 'Lưu ý: Cần tắt 2FA')
      accountLines()
      out.push(
        '# Tài khoản và mật khẩu MBBank',
        '# Lưu ý: Tài khoản của bạn cần đăng nhập được vào trang web sau:',
        '# https://online.mbbank.com.vn/',
        `username: ${q(s.username.trim())}`,
        `password: ${q(s.password)}`,
      )
      break
    case 'PAYOS':
      header('PayOS')
      out.push('# Ngân hàng hỗ trợ: MBBANK, BIDV, ACB, OCB, KLB', `bank: ${bank.value}`, '')
      if (!usesAccountNumber.value) {
        out.push('# PayOS VietQR Pro: số tài khoản do hệ thống tự động tạo, chỉ cần tên tài khoản', '')
      }
      accountLines()
      out.push(
        '# Lấy thông tin tại: my.payos.vn -> Kênh thanh toán -> Thông tin kênh thanh toán',
        `client-id: ${q(s['client-id'].trim())}`,
        `api-key: ${q(s['api-key'].trim())}`,
        `checksum-key: ${q(s['checksum-key'].trim())}`,
        '',
        '# URL chuyển hướng khi giao dịch hoàn tất/hủy',
        `url-success: ${q(payosUrls.success.trim())}`,
        `url-cancel: ${q(payosUrls.cancel.trim())}`,
      )
      break
    case 'SEPAY':
      header('SePay', 'Lưu ý: Mọi thông tin phải trùng khớp với thông tin đăng ký tại SePay')
      out.push('# Ngân hàng hỗ trợ: VCB, STB, TPB, VPB, ICB, ACB, BIDV, MB, OCB, KLB, MSB', `bank: ${bank.value}`, '')
      accountLines()
      out.push('# Lấy thông tin tại: https://my.sepay.vn/companyapi', `api-token: ${q(s['api-token'].trim())}`)
      break
    case 'PAYMENT-SERVICE':
      header('Payment Service', 'Chi tiết liên hệ MineVN Studio để được hướng dẫn')
      out.push('# Ngân hàng sử dụng', `bank: ${bank.value}`, '')
      accountLines()
      out.push('# Endpoint payment-service', `url: ${q(s.url.trim())}`)
      break
  }
  return out.join('\n') + '\n'
})

const isUrl = (s: string) => /^https?:\/\/\S+$/.test(s.trim())

const issues = computed(() => {
  const out: { level: 'error' | 'warn'; text: string }[] = []
  const err = (text: string) => out.push({ level: 'error', text })
  const warn = (text: string) => out.push({ level: 'warn', text })

  if (!general.enabled) warn('Chuyển khoản ngân hàng đang tắt (enabled: false).')

  // cổng ngân hàng
  if (provider.value !== 'MBBANK' && !bank.value) err('Chưa chọn ngân hàng.')
  if (usesAccountNumber.value) {
    if (!accountNumber.value) err('Chưa nhập số tài khoản.')
    else if (!/^\d+$/.test(accountNumber.value)) warn('Số tài khoản thường chỉ gồm chữ số, hãy kiểm tra lại.')
    else if (accountNumber.value === SAMPLE.account) warn('Số tài khoản còn giữ giá trị mẫu.')
    if (account.accountQr.trim() === SAMPLE.accountQr) warn('Số tài khoản QR còn giữ giá trị mẫu "nickname".')
  }
  if (!accountName.value) err('Chưa nhập tên chủ tài khoản.')
  else if (accountName.value === SAMPLE.accountName) warn('Tên chủ tài khoản còn giữ giá trị mẫu.')
  const min = Number(account.minAmount)
  if (!Number.isInteger(min) || min < 1000) err('Số tiền nạp tối thiểu phải là số nguyên, từ 1000 trở lên.')
  else if (min % 1000) warn('Số tiền nạp phải là bội số của 1000, nên đặt số tiền tối thiểu là bội số của 1000.')

  const missing = current.value.secrets.filter((x) => !secrets[x.key].trim()).map((x) => x.label)
  if (missing.length) {
    warn(`Chưa nhập ${missing.join(', ')}. Có thể điền sau trực tiếp trong file ${current.value.file}.`)
  }
  const samples = current.value.secrets.filter((x) => x.sample && secrets[x.key].trim() === x.sample).map((x) => x.label)
  if (samples.length) warn(`${samples.join(', ')} còn giữ giá trị mẫu.`)
  if (provider.value === 'PAYOS') {
    if (!isUrl(payosUrls.success) || !isUrl(payosUrls.cancel)) err('URL chuyển hướng của PayOS phải bắt đầu bằng http:// hoặc https://.')
  }
  if (provider.value === 'PAYMENT-SERVICE' && secrets.url.trim() && !isUrl(secrets.url)) {
    err('Endpoint Payment Service phải bắt đầu bằng http:// hoặc https://.')
  }

  // cài đặt chung
  if (!Number.isInteger(Number(general.interval)) || Number(general.interval) < 1) err('Thời gian quét phải là số nguyên, từ 1 giây trở lên.')
  if (!Number.isInteger(Number(general.expiry)) || Number(general.expiry) < 1) err('Thời gian hết hạn giao dịch phải là số nguyên lớn hơn 0.')
  else if (Number(general.expiry) < 120) warn('Thời gian hết hạn giao dịch dưới 2 phút, người chơi có thể không kịp chuyển khoản.')
  if (general.bossbar && !general.bossbarTitle.includes('%TIME%')) warn('Nội dung bossbar chưa có %TIME% (thời gian còn lại).')

  // point và lệnh
  if (!(Number(general.pointBase) >= 0)) err('point-base không được âm.')
  if (!(Number(general.pointExtra) >= 0)) err('point-extra không được âm.')
  if (slashCommands(general.commands).length) warn('Lệnh sau khi nạp: lệnh chạy từ console, không cần dấu / ở đầu.')
  const seen = new Set<number>()
  tiers.value.forEach((t) => {
    const amount = Number(t.amount)
    const where = `Mốc ${amount ? amount.toLocaleString('vi-VN') : '?'}đ`
    if (!Number.isInteger(amount) || amount <= 0) err(`${where}: số tiền phải là số nguyên lớn hơn 0.`)
    else if (seen.has(amount)) err(`${where}: bị trùng, YAML chỉ giữ lại một mốc.`)
    seen.add(amount)
    if (lines(t.commands).length === 0) warn(`${where}: chưa có lệnh nào.`)
    if (slashCommands(t.commands).length) warn(`${where}: lệnh chạy từ console, không cần dấu / ở đầu.`)
  })

  if (proxy.enabled) {
    if (!proxy.host.trim()) err('Chưa nhập host của proxy.')
    const port = Number(proxy.port)
    if (!Number.isInteger(port) || port < 1 || port > 65535) err('Port của proxy phải từ 1 tới 65535.')
  }
  return out
})

function addTier() {
  const max = Math.max(0, ...tiers.value.map((t) => int(t.amount)))
  tiers.value.push(tier(max ? max * 2 : 10000, ''))
}

// ---- nhập từ file đang có ----

const str = (v: unknown) => (v === undefined || v === null ? undefined : String(v))
const cmdText = (v: unknown) => (Array.isArray(v) ? v.map(String).join('\n') : '')

/** Ghi các thông tin tài khoản và secret của provider đọc được (key không có prefix) */
function applyProvider(p: Provider, get: (key: string) => unknown, bankValue?: unknown) {
  provider.value = p
  const def = PROVIDERS.find((x) => x.value === p)!
  if (p !== 'MBBANK' && str(bankValue)) banks[p] = String(bankValue).trim().toUpperCase()
  if (str(get('account')) !== undefined) account.account = String(get('account'))
  if (str(get('account-qr')) !== undefined) account.accountQr = String(get('account-qr'))
  if (str(get('account-name')) !== undefined) account.accountName = String(get('account-name'))
  if (Number(get('min-amount')) > 0) account.minAmount = Number(get('min-amount'))
  for (const x of def.secrets) {
    if (str(get(x.key)) !== undefined) secrets[x.key] = String(get(x.key))
  }
  if (p === 'PAYOS') {
    if (str(get('url-success'))) payosUrls.success = String(get('url-success'))
    if (str(get('url-cancel'))) payosUrls.cancel = String(get('url-cancel'))
  }
}

function applyGeneral(doc: Record<string, any>) {
  if (typeof doc.enabled === 'boolean') general.enabled = doc.enabled
  if (doc.interval !== undefined) general.interval = int(doc.interval)
  if (doc['transaction-expiry'] !== undefined) general.expiry = int(doc['transaction-expiry'])
  if (doc.bossbar && typeof doc.bossbar === 'object') {
    if (typeof doc.bossbar.enabled === 'boolean') general.bossbar = doc.bossbar.enabled
    if (str(doc.bossbar.title) !== undefined) general.bossbarTitle = String(doc.bossbar.title)
  }
  if (doc['point-base'] !== undefined) general.pointBase = Number(doc['point-base']) || 0
  if (doc['point-extra'] !== undefined) general.pointExtra = Number(doc['point-extra']) || 0
  if (doc.commands !== undefined) general.commands = cmdText(doc.commands)
  const md = doc['minimum-donate-commands']
  if (md && typeof md === 'object') tiers.value = Object.entries(md).map(([k, v]) => tier(int(k), cmdText(v)))
  if (doc.proxy && typeof doc.proxy === 'object') {
    proxy.enabled = Boolean(doc.proxy.enabled)
    proxy.socks = Boolean(doc.proxy['use-socks'])
    if (str(doc.proxy.host) !== undefined) proxy.host = String(doc.proxy.host)
    if (doc.proxy.port !== undefined) proxy.port = int(doc.proxy.port)
  }
}

/** Đoán provider của file providers/banking/*.yml theo các key riêng của từng cổng */
function detectProvider(doc: Record<string, any>): Provider | undefined {
  if ('username' in doc || 'password' in doc) return 'MBBANK'
  if ('client-id' in doc || 'checksum-key' in doc) return 'PAYOS'
  if ('api-token' in doc) return 'SEPAY'
  if ('url' in doc) return 'PAYMENT-SERVICE'
}

const LEGACY_PREFIX: Record<Provider, string> = { MBBANK: '', PAYOS: 'payos.', SEPAY: 'sepay.', 'PAYMENT-SERVICE': 'payment-service.' }

function doImport() {
  importError.value = ''
  importInfo.value = ''
  try {
    const doc = parse(importText.value)
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) throw new Error('nội dung không phải file YAML cấu hình')
    const isBanking = ['provider', 'point-base', 'point-extra', 'minimum-donate-commands', 'transaction-expiry'].some((k) => k in doc)
    if (isBanking && Number(doc['config-version']) === 2) {
      const p = String(doc.provider ?? '').trim().toUpperCase().replace('_', '-') as Provider
      if (PROVIDERS.some((x) => x.value === p)) provider.value = p
      applyGeneral(doc)
      importInfo.value = `Đã nhập banking.yml. Dán tiếp file providers/banking/${current.value.file} để nhập thông tin tài khoản.`
    } else if (isBanking) {
      // cấu trúc cũ (config-version 1 hoặc không có): mọi thông tin nằm trong banking.yml, provider chọn bằng cờ *.enabled
      const flat = (path: string) => path.split('.').reduce<any>((o, k) => (o && typeof o === 'object' ? o[k] : undefined), doc)
      const enabled = (['PAYOS', 'SEPAY', 'PAYMENT-SERVICE'] as Provider[]).filter((p) => flat(`${LEGACY_PREFIX[p]}enabled`) === true)
      const p = enabled[0] ?? 'MBBANK'
      const accountKeys = ['account', 'account-qr', 'account-name', 'min-amount']
      applyProvider(p, (k) => flat(accountKeys.includes(k) ? k : LEGACY_PREFIX[p] + k), doc.type)
      applyGeneral(doc)
      importInfo.value = enabled.length > 1
        ? `File cấu trúc cũ đang bật nhiều cổng (${enabled.join(', ')}), đã chọn ${p}. Hãy kiểm tra lại.`
        : `Đã chuyển banking.yml cấu trúc cũ sang cấu trúc mới, cổng ${p}.`
    } else {
      const p = detectProvider(doc)
      if (!p) throw new Error('không nhận ra đây là banking.yml hay file providers/banking/*.yml')
      applyProvider(p, (k) => doc[k], doc.bank)
      importInfo.value = `Đã nhập ${PROVIDERS.find((x) => x.value === p)!.file}.`
    }
    importText.value = ''
  } catch (e: any) {
    importError.value = `Không đọc được: ${e.message ?? e}`
  }
}
</script>

<template>
  <div class="tool vp-raw">
    <div class="tool-panel">
      <h4 class="tool-panel-title">Cổng ngân hàng</h4>
      <div class="tool-field">
        <span class="tool-label">Provider</span>
        <div class="tool-seg">
          <button v-for="p in PROVIDERS" :key="p.value" type="button" :class="{ active: provider === p.value }"
            @click="provider = p.value">{{ p.label }}</button>
        </div>
        <span v-if="provider === 'MBBANK'" class="tool-hint">Đăng nhập trực tiếp tài khoản MBBank, cần tắt xác minh 2 bước (2FA).</span>
        <span v-else-if="provider === 'SEPAY'" class="tool-hint">Ngân hàng, số tài khoản và tên chủ tài khoản phải trùng khớp với tài khoản đã liên kết trên SePay.</span>
      </div>

      <div v-if="provider === 'PAYOS'" class="tool-field">
        <span class="tool-label">Loại kênh PayOS</span>
        <div class="tool-seg">
          <button type="button" :class="{ active: payosMode === 'openapi' }" @click="payosMode = 'openapi'">OpenAPI</button>
          <button type="button" :class="{ active: payosMode === 'vietqr' }" @click="payosMode = 'vietqr'">VietQR Pro</button>
        </div>
        <span v-if="payosMode === 'vietqr'" class="tool-hint">Số tài khoản do PayOS tự tạo khi tạo giao dịch, chỉ cần tên chủ tài khoản.</span>
      </div>

      <div class="tool-grid cols-2">
        <div v-if="current.banks?.length" class="tool-field">
          <span class="tool-label">Ngân hàng</span>
          <ToolSelect v-model="banks[provider]" :options="current.banks" aria-label="Ngân hàng" />
        </div>
        <label v-else-if="current.banks" class="tool-field">
          <span class="tool-label">Mã ngân hàng</span>
          <input v-model="banks[provider]" type="text" placeholder="MBBANK" />
        </label>
        <template v-if="usesAccountNumber">
          <label class="tool-field">
            <span class="tool-label">Số tài khoản</span>
            <input v-model="account.account" type="text" inputmode="numeric" placeholder="0123456789" />
            <span class="tool-hint">Dùng để tra cứu lịch sử giao dịch.</span>
          </label>
          <label class="tool-field">
            <span class="tool-label">Số tài khoản hiển thị (QR)</span>
            <input v-model="account.accountQr" type="text" :placeholder="account.account.trim() || 'Để trống nếu giống số tài khoản'" />
            <span class="tool-hint">Có thể dùng nickname tài khoản. Để trống thì dùng số tài khoản.</span>
          </label>
        </template>
        <label class="tool-field">
          <span class="tool-label">Tên chủ tài khoản</span>
          <input v-model="account.accountName" type="text" placeholder="NGUYEN VAN A" />
          <span v-if="accountName && accountName !== account.accountName" class="tool-hint">Sẽ ghi thành <code>{{ accountName }}</code></span>
          <span v-else class="tool-hint">Viết hoa, không dấu. Có thể nhập có dấu, công cụ tự chuyển.</span>
        </label>
        <label class="tool-field">
          <span class="tool-label">Số tiền nạp tối thiểu (VNĐ)</span>
          <input v-model.number="account.minAmount" type="number" min="1000" step="1000" />
        </label>
      </div>
    </div>

    <div class="tool-panel">
      <h4 class="tool-panel-title">Thông tin {{ provider === 'MBBANK' ? 'đăng nhập' : 'API' }}</h4>
      <p class="tool-hint privacy">
        Thông tin chỉ xử lý trên trình duyệt của bạn, không gửi đi đâu và không được lưu lại khi tải lại trang.
        Có thể để trống rồi điền sau trực tiếp trong file.
      </p>
      <div class="tool-grid" :class="current.secrets.length > 1 ? 'cols-2' : ''">
        <label v-for="x in current.secrets" :key="x.key" class="tool-field">
          <span class="tool-label">{{ x.label }} <code>{{ x.key }}</code></span>
          <input v-model="secrets[x.key]" :type="x.password ? 'password' : 'text'" autocomplete="off" spellcheck="false" />
        </label>
        <template v-if="provider === 'PAYOS'">
          <label class="tool-field">
            <span class="tool-label">URL khi thanh toán xong <code>url-success</code></span>
            <input v-model="payosUrls.success" type="text" />
          </label>
          <label class="tool-field">
            <span class="tool-label">URL khi hủy <code>url-cancel</code></span>
            <input v-model="payosUrls.cancel" type="text" />
          </label>
        </template>
      </div>
      <span v-if="provider === 'PAYOS'" class="tool-hint">
        Lấy tại <a href="https://my.payos.vn/" target="_blank" rel="noreferrer">my.payos.vn</a> → Kênh thanh toán → Thông tin kênh thanh toán.
      </span>
      <span v-else-if="provider === 'SEPAY'" class="tool-hint">
        Lấy tại <a href="https://my.sepay.vn/companyapi" target="_blank" rel="noreferrer">my.sepay.vn/companyapi</a>.
      </span>
      <span v-else-if="provider === 'MBBANK'" class="tool-hint">
        Tài khoản phải đăng nhập được tại <a href="https://online.mbbank.com.vn/" target="_blank" rel="noreferrer">online.mbbank.com.vn</a>.
      </span>
    </div>

    <div class="tool-panel">
      <h4 class="tool-panel-title">Cài đặt chung</h4>
      <label class="tool-check"><input v-model="general.enabled" type="checkbox" /> Bật chuyển khoản ngân hàng</label>
      <div class="tool-grid cols-2">
        <label class="tool-field">
          <span class="tool-label">Thời gian quét giao dịch (giây)</span>
          <input v-model.number="general.interval" type="number" min="1" />
        </label>
        <label class="tool-field">
          <span class="tool-label">Thời gian hết hạn giao dịch (giây)</span>
          <input v-model.number="general.expiry" type="number" min="1" step="60" />
        </label>
      </div>
      <label class="tool-check"><input v-model="general.bossbar" type="checkbox" /> Hiện bossbar đếm ngược</label>
      <label v-if="general.bossbar" class="tool-field">
        <span class="tool-label">Nội dung bossbar</span>
        <input v-model="general.bossbarTitle" type="text" />
        <span class="tool-hint"><code>%TIME%</code> là thời gian còn lại.</span>
      </label>
    </div>

    <div class="tool-panel">
      <h4 class="tool-panel-title">Point và lệnh thưởng</h4>
      <div class="tool-grid cols-2">
        <label class="tool-field">
          <span class="tool-label">Point tiêu chuẩn mỗi 1000đ <code>point-base</code></span>
          <input v-model.number="general.pointBase" type="number" min="0" step="0.1" />
        </label>
        <label class="tool-field">
          <span class="tool-label">Point nhận thêm mỗi 1000đ <code>point-extra</code></span>
          <input v-model.number="general.pointExtra" type="number" min="0" step="0.1" />
        </label>
      </div>
      <span class="tool-hint">
        Nạp 100.000đ, không khuyến mãi: nhận {{ pointExample }} point.
        Tính thử với khuyến mãi tại <a href="/docs/cong-cu/tinh-toan-point">Tính toán point</a>.
      </span>
      <label class="tool-field">
        <span class="tool-label">Lệnh sau khi nạp thành công (mỗi dòng một lệnh)</span>
        <textarea v-model="general.commands" rows="3" spellcheck="false" />
      </label>

      <div class="tool-field">
        <span class="tool-label">Lệnh theo mức nạp tối thiểu</span>
        <span class="tool-hint">Chạy lệnh của <b>một</b> mức lớn nhất không vượt quá số tiền nạp.</span>
      </div>
      <div v-if="tiers.length" class="tier-head tool-label" aria-hidden="true">
        <span>Từ (VNĐ)</span>
        <span>Lệnh (mỗi dòng một lệnh)</span>
      </div>
      <div v-for="(t, i) in tiers" :key="t.id" class="tier-row">
        <input v-model.number="t.amount" type="number" min="1000" step="10000" aria-label="Số tiền tối thiểu (VNĐ)" />
        <textarea v-model="t.commands" rows="2" spellcheck="false" aria-label="Lệnh (mỗi dòng một lệnh)" />
        <IconButton :icon="Trash2" tip="Xóa" danger class="remove" @click="tiers.splice(i, 1)" />
      </div>
      <div class="tool-actions">
        <button type="button" class="tool-btn small" @click="addTier"><Plus :size="14" /> Thêm mức</button>
      </div>
      <span class="tool-hint">
        Placeholder trong lệnh: <code>%PLAYER%</code>, <code>%AMOUNT%</code>, <code>%POINT%</code>, <code>%POINT_UNIT%</code>.
      </span>
    </div>

    <div class="tool-panel">
      <h4 class="tool-panel-title">Proxy</h4>
      <label class="tool-check"><input v-model="proxy.enabled" type="checkbox" /> Kết nối qua proxy</label>
      <template v-if="proxy.enabled">
        <div class="tool-grid cols-2">
          <label class="tool-field">
            <span class="tool-label">Host</span>
            <input v-model="proxy.host" type="text" />
          </label>
          <label class="tool-field">
            <span class="tool-label">Port</span>
            <input v-model.number="proxy.port" type="number" min="1" max="65535" />
          </label>
        </div>
        <label class="tool-check"><input v-model="proxy.socks" type="checkbox" /> SOCKS proxy</label>
      </template>
      <span v-else class="tool-hint">Chỉ cần khi server không kết nối trực tiếp được tới ngân hàng.</span>
    </div>

    <ToolIssues :items="issues" />

    <CopyBlock :code="bankingYaml" title="banking.yml" />
    <CopyBlock :code="providerYaml" :title="providerFile" />

    <details class="tool-panel import">
      <summary>Nhập từ file đang có</summary>
      <span class="tool-hint">
        Dán <code>banking.yml</code> hoặc file trong <code>providers/banking/</code>.
        File <code>banking.yml</code> cấu trúc cũ (không có <code>config-version: 2</code>) được chuyển sang cấu trúc mới.
      </span>
      <textarea v-model="importText" rows="8" spellcheck="false" placeholder="Dán nội dung file vào đây" />
      <div class="tool-actions">
        <button type="button" class="tool-btn primary small" :disabled="!importText.trim()" @click="doImport"><Upload :size="14" /> Nhập</button>
      </div>
      <p v-if="importError" class="tool-error">{{ importError }}</p>
      <p v-else-if="importInfo" class="tool-muted">{{ importInfo }}</p>
    </details>
  </div>
</template>

<style scoped>
.privacy {
  margin: -8px 0 0;
}

/* tên key trong nhãn xuống dòng nguyên khối khi màn hình hẹp, không bị ngắt giữa chữ */
.tool-label {
  flex-wrap: wrap;
  row-gap: 2px;
}

.tool-label code {
  white-space: nowrap;
}

/* tiêu đề cột và các dòng mức nạp dùng chung một lưới: Số tiền | Lệnh | nút xóa (32px) */
.tier-head,
.tier-row {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr) 32px;
  gap: 12px;
}

.tier-head {
  margin-bottom: -8px;
}

.tier-row {
  align-items: start;
}

.tier-row textarea {
  min-height: 60px;
}

.remove {
  margin-top: 2px;
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

.import p {
  margin: 0;
}

@media (max-width: 639px) {
  .tier-head,
  .tier-row {
    grid-template-columns: 100px minmax(0, 1fr) 32px;
    gap: 8px;
  }
}
</style>
