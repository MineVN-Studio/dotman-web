<script setup lang="ts">
// Banner quảng bá chương trình dùng thử DotMan Premium 14 ngày, nằm giữa lưới tính năng và khu vực số liệu của trang chủ.
const DISCORD = 'https://minevn.net/studio'
const STEPS = ['Tham gia Discord MineVN Studio', 'Mở ticket đăng ký dùng thử', 'Dùng thử 14 ngày']
</script>

<template>
  <section id="dung-thu" class="home-section home-trial" aria-labelledby="home-trial-title">
    <div class="panel">
      <div class="glow" aria-hidden="true" />

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
          <a class="btn alt" href="/huong-dan/tinh-nang#so-sanh-ban-mien-phi-va-premium">Xem tính năng Premium</a>
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
  overflow: hidden;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 20px;
  background-color: var(--vp-c-bg-soft);
}

/* viền sáng lên rồi dịu xuống như đang thở.
   Lớp phủ đã vẽ sẵn viền và ánh sáng bên trong, chỉ đổi độ trong suốt (chạy trên GPU);
   animate trực tiếp box-shadow, border-color sẽ buộc vẽ lại cả khối mỗi khung hình. */
.panel::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid rgba(var(--home-glow-a, 62, 207, 142), 0.5);
  border-radius: inherit;
  box-shadow: inset 0 0 56px -18px rgba(var(--home-glow-a, 62, 207, 142), 0.4);
  opacity: 0;
  pointer-events: none;
  animation: panel-glow 7s ease-in-out infinite;
  will-change: opacity;
}

@keyframes panel-glow {
  50% {
    opacity: 1;
  }
}

@media (min-width: 720px) {
  .panel {
    grid-template-columns: 190px minmax(0, 1fr);
    gap: 32px;
    padding: 40px;
  }
}

/* hai quầng sáng xanh - vàng trôi chậm phía sau, cùng tông với ảnh hero và nền trang chủ */
.glow {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.glow::before,
.glow::after {
  content: '';
  position: absolute;
  aspect-ratio: 1;
  border-radius: 50%;
}

.glow::before {
  will-change: transform;
  top: -45%;
  left: -8%;
  width: 62%;
  background: radial-gradient(closest-side, rgba(var(--home-glow-a, 62, 207, 142), 0.26), transparent);
  animation: glow-a 14s ease-in-out infinite alternate;
}

.glow::after {
  will-change: transform;
  right: -10%;
  bottom: -60%;
  width: 56%;
  background: radial-gradient(closest-side, rgba(var(--home-glow-b, 255, 201, 102), 0.2), transparent);
  animation: glow-b 17s ease-in-out infinite alternate;
}

@keyframes glow-a {
  to {
    transform: translate3d(26%, 22%, 0) scale(1.15);
  }
}

@keyframes glow-b {
  to {
    transform: translate3d(-24%, -18%, 0) scale(1.12);
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

/* nút đăng ký tỏa sáng nhẹ khi rê chuột */
.btn {
  transition: color 0.25s, border-color 0.25s, background-color 0.25s, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.btn:hover {
  transform: translateY(-2px);
}

.btn.brand:hover {
  box-shadow: 0 10px 28px -10px rgba(var(--home-glow-a, 62, 207, 142), 0.7);
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

/* cùng kiểu với các nút ở hero (màu lấy từ biến của VitePress) */
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

/* điện thoại: bỏ chuyển động chạy mãi cho máy yếu đỡ giật */
@media (max-width: 767px) {
  .panel::after,
  .glow::before,
  .glow::after {
    animation: none;
    will-change: auto;
  }

  .panel::after {
    opacity: 0.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel::after,
  .glow::before,
  .glow::after {
    animation: none;
  }

  .panel::after {
    opacity: 0.6;
  }

  .btn,
  .btn:hover {
    transition: none;
    transform: none;
  }
}
</style>
