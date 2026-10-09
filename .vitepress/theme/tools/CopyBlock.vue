<script setup lang="ts">
import { ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'

const props = defineProps<{
  code: string
  /** Tên file hiển thị ở đầu khung, ví dụ mocnap.yml */
  title?: string
}>()

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch (e) {
    console.error('Không sao chép được', e)
  }
}
</script>

<template>
  <div class="copy-block">
    <div class="copy-head">
      <span class="copy-title">{{ title ?? 'Kết quả' }}</span>
      <button type="button" class="copy-btn" @click="copy">
        <component :is="copied ? Check : Copy" :size="13" />
        {{ copied ? 'Đã sao chép' : 'Sao chép' }}
      </button>
    </div>
    <pre><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.copy-block {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background-color: var(--vp-code-block-bg);
}

.copy-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 8px 6px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.copy-title {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.copy-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

pre {
  margin: 0;
  max-height: 480px;
  overflow: auto;
  padding: 12px 14px;
}

pre code {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  white-space: pre;
}
</style>
