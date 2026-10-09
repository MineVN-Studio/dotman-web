<script setup lang="ts">
import { FileText, Trash2 } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { stringify } from 'yaml'
import CopyBlock from './CopyBlock.vue'
import ToolIssues from './ToolIssues.vue'
import { vTip } from './tooltip'
import { useSessionState } from './session-state'

const PLACEHOLDERS = [
  ['%PLAYER%', 'Tên người chơi'],
  ['%AMOUNT%', 'Số tiền nạp'],
  ['%POINT_AMOUNT%', 'Số point nhận được'],
  ['%POINT_UNIT%', 'Đơn vị point'],
  ['%BALANCE%', 'Số point sau khi nạp'],
  ['%METHOD%', 'Phương thức nạp'],
  ['%TIME%', 'Thời gian giao dịch'],
  ['%SERVER%', 'Tên server'],
]

const SAMPLE = JSON.stringify(
  {
    messages: [
      {
        data: {
          content: 'Thông báo nạp tiền thành công!\nThời gian: %TIME%',
          embeds: [
            {
              title: 'Ting ting 💸',
              description: 'Xin cảm ơn **%PLAYER%** đã ủng hộ server!',
              color: 5814783,
              fields: [
                { name: 'Số tiền', value: '%AMOUNT% VNĐ', inline: true },
                { name: 'Thực nhận', value: '%POINT_AMOUNT% %POINT_UNIT%', inline: true },
                { name: 'Phương thức', value: '%METHOD%', inline: true },
              ],
              footer: { text: '%SERVER%' },
            },
          ],
          username: 'MineVN',
          avatar_url: 'https://i.imgur.com/tdZ2LxY.png',
          attachments: [],
        },
      },
    ],
  },
  null,
  2,
)

const source = ref(SAMPLE)
const url = ref('')
const enabled = ref(true)
useSessionState('discord-converter', { source, url, enabled })
const copiedPh = ref('')

// các key webhook Discord hỗ trợ khi gửi bằng URL; các key khác (attachments, components...) bị bỏ
const PAYLOAD_KEYS = ['username', 'avatar_url', 'content', 'embeds', 'tts', 'thread_name']

const toHex = (n: number) => '#' + n.toString(16).padStart(6, '0').toUpperCase()

/** Lấy danh sách payload từ JSON của Discohook (hoặc payload webhook thô) */
function extractPayloads(json: any): any[] {
  if (Array.isArray(json)) return json.flatMap(extractPayloads)
  if (json?.messages) return extractPayloads(json.messages)
  if (json?.data && (json.data.content !== undefined || json.data.embeds)) return [json.data]
  if (json && (json.content !== undefined || json.embeds)) return [json]
  return []
}

function convertEmbed(embed: any, warnings: Set<string>) {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(embed ?? {})) {
    if (v === null || v === undefined || v === '') continue
    if (k === 'color' && typeof v === 'number') out.color = toHex(v)
    else if (k === 'timestamp') warnings.add('Đã bỏ "timestamp" vì là thời điểm cố định, dùng %TIME% trong footer thay thế.')
    else if (k === 'description' && typeof v === 'string' && v.includes('\n')) out.description = v.split('\n')
    else out[k] = v
  }
  return out
}

const result = computed(() => {
  const warnings = new Set<string>()
  let json: any
  try {
    json = JSON.parse(source.value)
  } catch (e: any) {
    return { error: `JSON không hợp lệ: ${e.message}`, yaml: '', warnings: [] as string[] }
  }
  const payloads = extractPayloads(json)
  if (payloads.length === 0) {
    return { error: 'Không tìm thấy nội dung tin nhắn (content/embeds) trong JSON.', yaml: '', warnings: [] as string[] }
  }

  const hooks = payloads.map((data) => {
    const payload: Record<string, any> = {}
    for (const [k, v] of Object.entries(data)) {
      if (!PAYLOAD_KEYS.includes(k)) {
        if (!(Array.isArray(v) && v.length === 0)) warnings.add(`Đã bỏ "${k}" vì DotMan không gửi được qua webhook URL.`)
        continue
      }
      if (v === null || v === undefined) continue
      if (k === 'content') {
        // DotMan nối các dòng trong list bằng xuống dòng, giống file mẫu
        if (typeof v === 'string' && v.length) payload.content = v.split('\n')
      } else if (k === 'embeds') {
        if (Array.isArray(v) && v.length) payload.embeds = v.map((e) => convertEmbed(e, warnings))
      } else payload[k] = v
    }
    if (payload.username === undefined) payload.username = ''
    if (payload.avatar_url === undefined) payload.avatar_url = ''
    return { enabled: enabled.value, url: url.value.trim() || 'https://discord.com/api/webhooks/123456/webhook-token', payload }
  })

  if (payloads.length > 1) warnings.add(`JSON có ${payloads.length} tin nhắn, mỗi tin nhắn được tạo thành một webhook riêng.`)
  const used = PLACEHOLDERS.filter(([p]) => source.value.includes(p)).length
  if (used === 0) warnings.add('Chưa dùng placeholder nào, thông báo sẽ không có thông tin người nạp.')

  const yaml = stringify({ 'discord-hooks': hooks }, { defaultStringType: 'QUOTE_DOUBLE', defaultKeyType: 'PLAIN', lineWidth: 0 })
  return { error: '', yaml, warnings: [...warnings] }
})

async function copyPlaceholder(p: string) {
  await navigator.clipboard.writeText(p)
  copiedPh.value = p
  setTimeout(() => (copiedPh.value = ''), 1200)
}
</script>

<template>
  <div class="tool vp-raw">
    <div class="tool-panel">
      <h4 class="tool-panel-title">Placeholder dùng được</h4>
      <div class="chips">
        <button v-for="[p, desc] in PLACEHOLDERS" :key="p" type="button" class="chip" v-tip="`${desc} - bấm để sao chép`"
          @click="copyPlaceholder(p)">
          <code>{{ p }}</code><span>{{ copiedPh === p ? 'Đã sao chép' : desc }}</span>
        </button>
      </div>
      <span class="tool-hint">Chèn các placeholder này vào nội dung khi thiết kế trên Discohook.</span>
    </div>

    <div class="tool-panel">
      <div class="tool-field">
        <span class="tool-label">JSON từ Discohook</span>
        <textarea v-model="source" rows="12" spellcheck="false" />
        <span class="tool-hint">Trên discohook.org, mở <b>JSON Data Editor</b> của tin nhắn rồi sao chép toàn bộ nội dung vào đây.</span>
      </div>
      <div class="tool-grid cols-2">
        <label class="tool-field">
          <span class="tool-label">URL webhook</span>
          <input v-model="url" type="text" placeholder="https://discord.com/api/webhooks/..." />
        </label>
        <label class="tool-check enabled">
          <input v-model="enabled" type="checkbox" />
          <!-- bọc trong span: .tool-check là flex có gap, để rời thì chữ, code và dấu ngoặc bị cách nhau -->
          <span>Bật webhook (<code>enabled: true</code>)</span>
        </label>
      </div>
      <div class="tool-actions">
        <button type="button" class="tool-btn small" @click="source = SAMPLE"><FileText :size="14" /> Dùng ví dụ</button>
        <button type="button" class="tool-btn small danger" @click="source = ''"><Trash2 :size="14" /> Xóa nội dung</button>
      </div>
    </div>

    <p v-if="result.error" class="tool-error">{{ result.error }}</p>
    <template v-else>
      <ToolIssues :items="result.warnings.map((text) => ({ text }))" />
      <CopyBlock :code="result.yaml" title="discord.yml" />
    </template>
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background-color: var(--vp-c-bg);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.chip:hover {
  border-color: var(--vp-c-brand-1);
}

.chip code {
  padding: 0;
  background: none;
}

.enabled {
  align-self: end;
  padding-bottom: 8px;
}
</style>
