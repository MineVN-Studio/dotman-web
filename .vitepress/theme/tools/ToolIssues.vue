<script setup lang="ts">
// Card cảnh báo dùng chung: một card duy nhất chứa mọi cảnh báo, mỗi cảnh báo là một dòng trong danh sách có dấu chấm.
export interface Issue {
  /** error: dấu chấm đỏ, mặc định (warn): dấu chấm vàng */
  level?: 'warn' | 'error'
  text: string
}

defineProps<{ items: Issue[] }>()
</script>

<template>
  <ul v-if="items.length" class="tool-issues">
    <li v-for="(it, i) in items" :key="i" :class="{ error: it.level === 'error' }">{{ it.text }}</li>
  </ul>
</template>

<style scoped>
/* màu theo khối ::: warning của VitePress để đồng bộ với các trang tài liệu.
   Độ ưu tiên của selector scoped cao hơn style danh sách mặc định của .vp-doc */
.tool-issues {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 14px 16px 14px 36px;
  border: 1px solid var(--vp-custom-block-warning-border);
  border-radius: 12px;
  background-color: var(--vp-custom-block-warning-bg);
  color: var(--vp-custom-block-warning-text);
  list-style: disc;
}

.tool-issues li {
  margin: 0;
  padding-left: 2px;
  line-height: 1.6;
}

.tool-issues li::marker {
  color: var(--vp-c-warning-1);
}

.tool-issues li.error::marker {
  color: var(--vp-c-danger-1);
}
</style>
