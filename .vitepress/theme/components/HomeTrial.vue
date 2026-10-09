<script setup lang="ts">
const DISCORD = 'https://minevn.net/studio'
const STEPS = ['Tham gia Discord MineVN Studio', 'Mở ticket đăng ký dùng thử', 'Dùng thử 14 ngày']
</script>

<template>
  <section id="dung-thu" class="home-section home-trial" aria-labelledby="home-trial-title">
    <div class="panel">
      <div class="days" aria-hidden="true">
        <span class="free">Miễn phí</span>
        <span class="num home-grad-text">14</span>
        <span class="unit">ngày dùng thử</span>
      </div>

      <div class="body">
        <span class="eyebrow">Chương trình dùng thử</span>
        <h2 id="home-trial-title">Dùng thử <span class="hl">DotMan Premium</span> miễn phí 14 ngày</h2>
        <p>
          Dành cho chủ server chưa từng sử dụng DotMan. Trải nghiệm bản Premium với chuyển khoản QR tự duyệt,
          bảo mật cấu hình, mốc nạp và top nạp theo ngày, tuần, tháng... rồi quyết định có nên dùng lâu dài hay không.
        </p>

        <ol class="steps">
          <li v-for="(s, i) in STEPS" :key="s">
            <span class="no">{{ i + 1 }}</span>
            {{ s }}
          </li>
        </ol>

        <div class="actions">
          <a class="btn brand" :href="DISCORD" target="_blank" rel="noopener">Đăng ký dùng thử</a>
          <a class="btn alt" href="/docs/huong-dan/tinh-nang#so-sanh-ban-mien-phi-va-premium">Xem tính năng Premium</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-section.home-trial {
  padding-bottom: 0;
  scroll-margin-top: calc(var(--vp-nav-height) + 8px);
}

.panel {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: 28px;
  padding: 28px 24px;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 20px;
  background-color: var(--vp-c-bg-soft);
}

@media (min-width: 720px) {
  .panel {
    grid-template-columns: 190px minmax(0, 1fr);
    gap: 32px;
    padding: 40px;
  }
}

.days {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.free {
  padding: 2px 12px;
  border-radius: 999px;
  background-color: var(--vp-badge-tip-bg);
  color: var(--vp-badge-tip-text);
  font-size: 13px;
  font-weight: 600;
}

.num {
  font-size: 96px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -3px;
}

.unit {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.body {
  position: relative;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-brand-1);
  font-size: 15px;
  font-weight: 600;
}

h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.2px;
}

@media (min-width: 720px) {
  h2 {
    font-size: 30px;
  }
}

.hl {
  color: var(--vp-c-brand-1);
}

.btn {
  transition: color 0.25s, border-color 0.25s, background-color 0.25s, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.btn:hover {
  transform: translateY(-2px);
}

.body p {
  margin: 12px 0 0;
  max-width: 640px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.steps {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.steps li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 5px 14px 5px 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background-color: var(--vp-c-bg);
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  display: inline-block;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 38px;
  text-decoration: none;
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
  .btn,
  .btn:hover {
    transition: none;
    transform: none;
  }
}
</style>
