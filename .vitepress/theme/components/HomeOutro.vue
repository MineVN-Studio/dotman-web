<script setup lang="ts">
// Lời kêu gọi cuối trang chủ, sau phần FAQ.
import { withBase } from 'vitepress'
</script>

<template>
  <section class="home-section home-outro" aria-labelledby="home-outro-title">
    <div class="glow" aria-hidden="true" />
    <h2 id="home-outro-title">
      Đọc đến đây rồi, thì sao không <span class="home-grad-text">trải nghiệm thử ngay!</span>
    </h2>
    <div class="actions">
      <a class="btn brand" href="#dung-thu">Dùng thử Premium 14 ngày</a>
      <a class="btn alt" :href="withBase('/releases/dotman')">Tải bản miễn phí</a>
    </div>
  </section>
</template>

<style scoped>
.home-section.home-outro {
  position: relative;
  padding-top: 24px;
  padding-bottom: 24px;
  text-align: center;
}

/* quầng sáng xanh - vàng tĩnh phía sau dòng chữ */
.glow {
  position: absolute;
  inset: -40px 0 -40px;
  background:
    radial-gradient(420px 160px at 30% 50%, rgba(var(--home-glow-a, 62, 207, 142), 0.16), transparent 70%),
    radial-gradient(420px 160px at 70% 50%, rgba(var(--home-glow-b, 255, 201, 102), 0.12), transparent 70%);
  pointer-events: none;
}

/* kèm .home-section để thắng quy tắc chung của khối trang chủ (margin: 0 0 8px) */
.home-section.home-outro h2 {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
  padding: 0;
  border: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.3px;
}

@media (min-width: 640px) {
  .home-section.home-outro h2 {
    font-size: 36px;
  }
}

.actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

/* cùng kiểu các nút ở hero (màu lấy từ biến của VitePress) */
.btn {
  display: inline-block;
  min-width: 190px;
  padding: 0 24px;
  border: 1px solid transparent;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  line-height: 44px;
  text-align: center;
  text-decoration: none;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s, transform 0.3s var(--home-ease, ease),
    box-shadow 0.3s var(--home-ease, ease);
}

.btn:hover {
  transform: translateY(-2px);
}

.btn.brand {
  border-color: var(--vp-button-brand-border);
  background-color: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}

.btn.brand:hover {
  border-color: var(--vp-button-brand-hover-border);
  background-color: var(--vp-button-brand-hover-bg);
  color: var(--vp-button-brand-hover-text);
  box-shadow: 0 10px 28px -10px rgba(var(--home-glow-a, 62, 207, 142), 0.7);
}

.btn.alt {
  border-color: var(--vp-button-alt-border);
  background-color: var(--vp-button-alt-bg);
  color: var(--vp-button-alt-text);
}

.btn.alt:hover {
  border-color: var(--vp-button-alt-hover-border);
  background-color: var(--vp-button-alt-hover-bg);
  color: var(--vp-button-alt-hover-text);
}

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }

  .btn:hover {
    transform: none;
  }
}
</style>
