<script setup lang="ts">
const LINKS = [
  { text: 'Diễn đàn Minecraft Việt Nam', href: 'https://minevn.net' },
  { text: 'MineVN Network', href: 'https://blog.minevn.net' },
  { text: 'Minetrack', href: 'https://track.minevn.net' },
]
</script>

<template>
  <footer class="site-footer">
    <nav class="links" aria-label="Liên kết MineVN">
      <a v-for="l in LINKS" :key="l.href" :href="l.href" target="_blank" rel="noopener">{{ l.text }}</a>
    </nav>
    <p class="credit">
      Icon created by <a href="https://www.flaticon.com/" target="_blank" rel="noopener">Flaticon</a>
      <span class="sep" aria-hidden="true">·</span>
      Releases by <a href="https://calagopus.com/" target="_blank" rel="noopener">Calagopus</a>
    </p>
  </footer>
</template>

<style scoped>
/* footer nằm ngoài khối nội dung của trang chủ nên tự căn độ rộng và lề giống các khối khác */
.site-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 1152px;
  margin: 0 auto;
  padding: 28px 24px 40px;
  font-size: 13px;
  text-align: center;
  color: var(--vp-c-text-3);
}

@media (min-width: 640px) {
  .site-footer {
    padding-left: 48px;
    padding-right: 48px;
  }
}

@media (min-width: 960px) {
  .site-footer {
    padding-left: 64px;
    padding-right: 64px;
  }
}

.links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 20px;
}

.site-footer a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.site-footer a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.credit {
  margin: 0;
}

.sep {
  margin: 0 8px;
}

@media (prefers-reduced-motion: reduce) {
  .site-footer a {
    transition: none;
  }
}
</style>
