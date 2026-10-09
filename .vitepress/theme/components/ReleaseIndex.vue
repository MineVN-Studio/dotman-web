<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../../../docs/releases/releases.data'

const BLURBS: Record<string, string> = {
  dotman: 'Bản miễn phí của DotMan.',
  minevnlib: 'Thư viện dùng chung cho các plugin của MineVN, DotMan cần plugin này để chạy.',
}

const cards = computed(() =>
  Object.values(data.projects).map((p) => {
    const latest = p.releases.find((r) => r.latest) ?? p.releases[0]
    return {
      key: p.key,
      name: p.name,
      link: withBase(`/releases/${p.key}`),
      version: latest?.tag ?? '-',
      date: latest?.date,
      blurb: BLURBS[p.key],
      total: p.releases.length,
    }
  }),
)
</script>

<template>
  <div class="release-index">
    <a v-for="c in cards" :key="c.key" class="card" :href="c.link">
      <span class="card-title">{{ c.name }}</span>
      <span class="card-version">{{ c.version }}</span>
      <span v-if="c.date" class="card-date">phát hành {{ c.date }}</span>
      <span class="card-blurb">{{ c.blurb }}</span>
      <span class="card-total">{{ c.total }} bản phát hành</span>
    </a>
  </div>
</template>

<style scoped>
.release-index {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 24px 0;
}

@media (min-width: 640px) {
  .release-index {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.card-title {
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
}

.card-version {
  color: var(--vp-c-brand-1);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.card-date,
.card-total {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.card-blurb {
  margin-top: 8px;
  color: var(--vp-c-text-1);
  font-size: 14px;
}
</style>
