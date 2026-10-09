<script setup lang="ts">
// Một câu hỏi, bấm để mở hoặc thu gọn câu trả lời. Dùng <details> nên vẫn hoạt động khi chưa có JavaScript.
import { Plus } from 'lucide-vue-next'

defineProps<{ q: string }>()
</script>

<template>
  <details class="faq">
    <summary>
      <span class="question">{{ q }}</span>
      <Plus class="icon" :size="18" aria-hidden="true" />
    </summary>
    <div class="answer">
      <slot />
    </div>
  </details>
</template>

<style scoped>
.faq {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.2s;
}

.faq:hover,
.faq[open] {
  border-color: var(--vp-c-brand-soft);
}

.faq[open] {
  border-color: var(--vp-c-brand-1);
}

summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 0;
  padding: 16px 20px;
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

summary:focus-visible {
  border-radius: 12px;
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.question {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.icon {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  transition: transform 0.25s, color 0.2s;
}

.faq[open] .icon {
  color: var(--vp-c-brand-1);
  transform: rotate(135deg);
}

.answer {
  padding: 0 20px 18px;
  font-size: 15px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  animation: reveal 0.25s ease-out;
}

.answer :deep(p) {
  margin: 0;
}

.answer :deep(p + p),
.answer :deep(ul),
.answer :deep(p + ul) {
  margin-top: 10px;
}

.answer :deep(ul) {
  margin-bottom: 0;
  padding-left: 22px;
}

.answer :deep(li) {
  margin: 4px 0 0;
}

.answer :deep(strong) {
  color: var(--vp-c-text-1);
}

.answer :deep(code) {
  padding: 1px 6px;
  border-radius: 4px;
  background-color: var(--vp-c-default-soft);
  font-size: 13px;
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .answer {
    animation: none;
  }

  .icon {
    transition: none;
  }
}
</style>
