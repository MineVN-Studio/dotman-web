<script setup lang="ts">
import { withBase } from 'vitepress'
import { TOOLS } from '../../tools-list'
import { TOOL_ICONS as ICONS } from '../tool-icons'
</script>

<template>
  <div class="tool-index">
    <a v-for="t in TOOLS" :key="t.link" class="card" :href="withBase(t.link)">
      <span class="card-icon"><component :is="ICONS[t.icon]" :size="20" /></span>
      <span class="card-title">{{ t.text }}</span>
      <span class="card-desc">{{ t.desc }}</span>
    </a>
  </div>
</template>

<style scoped>
.tool-index {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 24px 0;
}

@media (min-width: 640px) {
  .tool-index {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  font-weight: 400;
  text-decoration: none;
  transition: border-color 0.25s;
}

.card:hover {
  border-color: var(--vp-c-brand-1);
}

.card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.card-title {
  margin-top: 6px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.card-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
