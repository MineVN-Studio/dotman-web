<script setup lang="ts">
import { withBase } from 'vitepress'
import { ArrowRight, Sparkles } from 'lucide-vue-next'
import { TOOLS } from '../../tools-list'
import { TOOL_ICONS } from '../tool-icons'
</script>

<template>
  <section class="home-section home-tools" aria-labelledby="home-tools-title">
    <h2 id="home-tools-title">Công cụ hỗ trợ</h2>
    <p>Giúp cấu hình DotMan nhanh và dễ dàng hơn.</p>

    <div class="grid">
      <a v-for="t in TOOLS" :key="t.link" class="tool-card home-card" :href="withBase(t.link)">
        <span class="icon"><component :is="TOOL_ICONS[t.icon]" :size="20" aria-hidden="true" /></span>
        <span class="title">{{ t.text }}</span>
        <span class="desc">{{ t.desc }}</span>
      </a>

      <!-- ô giữ chỗ cho công cụ sắp có, để lưới đủ 6 ô -->
      <div class="tool-card soon home-card" aria-label="Công cụ mới, sắp ra mắt">
        <span class="icon"><Sparkles :size="20" aria-hidden="true" /></span>
        <span class="title">Thêm công cụ mới <span class="home-tag">Sắp ra mắt</span></span>
        <span class="desc">DotMan sẽ có thêm công cụ hỗ trợ cấu hình. Hãy quay lại sớm nhé.</span>
      </div>
    </div>

    <div class="all">
      <a class="btn" :href="withBase('/docs/cong-cu/')">Xem tất cả công cụ <ArrowRight :size="15" aria-hidden="true" /></a>
    </div>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1040px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.tool-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
}

.tool-card.soon {
  border-style: dashed;
  background-color: transparent;
}

.tool-card.soon .icon {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-3);
}

.tool-card.soon .title,
.tool-card.soon .desc {
  color: var(--vp-c-text-3);
}

.tool-card.soon .title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-bottom: 6px;
  border-radius: 10px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.desc {
  font-size: 14px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

.all {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 20px;
  border: 1px solid var(--vp-button-alt-border);
  border-radius: 20px;
  background-color: var(--vp-button-alt-bg);
  color: var(--vp-button-alt-text);
  font-size: 14px;
  font-weight: 600;
  line-height: 38px;
  text-decoration: none;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s;
}

.btn:hover {
  border-color: var(--vp-button-alt-hover-border);
  background-color: var(--vp-button-alt-hover-bg);
  color: var(--vp-button-alt-hover-text);
}

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
</style>
