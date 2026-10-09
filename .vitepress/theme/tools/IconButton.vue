<script setup lang="ts">
import type { Component } from 'vue'
import { vTip } from './tooltip'

defineProps<{
  /** Icon từ lucide-vue-next */
  icon: Component
  /** Nội dung tooltip, đồng thời là aria-label */
  tip: string
  danger?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button type="button" class="icon-btn" :class="{ danger }" v-tip="tip" :aria-label="tip" :disabled="disabled">
    <component :is="icon" :size="16" :stroke-width="2" />
  </button>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  transition: color 0.2s, border-color 0.2s, background-color 0.2s;
}

.icon-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.icon-btn.danger:hover:not(:disabled) {
  border-color: var(--vp-c-danger-1);
  color: var(--vp-c-danger-1);
  background-color: var(--vp-c-danger-soft);
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
