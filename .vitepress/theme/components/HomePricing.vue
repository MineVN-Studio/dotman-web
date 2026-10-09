<script setup lang="ts">
// Bảng giá và so sánh nhanh bản miễn phí với Premium. Nội dung lấy theo bảng so sánh ở trang Tính năng,
// nếu phân chia tính năng hoặc giá thay đổi thì sửa cả hai nơi.
import { withBase } from 'vitepress'
import { ArrowRight, Check } from 'lucide-vue-next'

const DISCORD = 'https://minevn.net/studio'

const FREE = [
  'Nạp thẻ cào tự động qua Card2K, TheSieuRe, GameBank',
  'Nạp thủ công cho người chơi',
  'Lịch khuyến mãi và thông báo khuyến mãi',
  'Mốc nạp và top nạp toàn thời gian',
  'Lịch sử nạp, tra cứu giao dịch',
  'Discord Webhook và PlaceholderAPI',
]

const PREMIUM = [
  'Chuyển khoản ngân hàng qua QR, tự duyệt giao dịch',
  'Thêm cổng gạch thẻ GachThe1s, GachThe5s',
  'Mốc nạp và top theo ngày, tuần, tháng',
  'Phần thưởng top tự động, khung thời gian sự kiện',
  'Khuyến mãi nạp lần đầu',
  'Bảo mật cấu hình, giữ lệnh thưởng khi người chơi offline',
  'Thống kê chi tiết và giao diện cho người chơi Bedrock',
]
</script>

<template>
  <section class="home-section home-pricing" aria-labelledby="home-pricing-title">
    <h2 id="home-pricing-title">Chọn phiên bản phù hợp</h2>
    <p>Bắt đầu miễn phí, nâng cấp lên Premium khi server của bạn cần nhiều hơn.</p>

    <div class="plans">
      <article class="plan home-card">
        <h3 class="name">Miễn phí</h3>
        <div class="price"><span class="amount">0đ</span></div>
        <p class="sub">Mã nguồn mở trên GitHub</p>
        <ul class="list">
          <li v-for="f in FREE" :key="f"><Check :size="16" aria-hidden="true" />{{ f }}</li>
        </ul>
        <div class="actions">
          <a class="btn alt" :href="withBase('/releases/dotman')">Tải bản miễn phí</a>
          <span class="hint">Không cần license, dùng ngay</span>
        </div>
      </article>

      <article class="plan premium home-card">
        <span class="ribbon">Đầy đủ nhất</span>
        <h3 class="name">Premium</h3>
        <div class="price"><span class="amount">349.000đ</span></div>
        <p class="sub">Mua và nhận license tại Discord MineVN Studio</p>
        <ul class="list">
          <li class="lead">Tất cả tính năng của bản miễn phí, và:</li>
          <li v-for="f in PREMIUM" :key="f"><Check :size="16" aria-hidden="true" />{{ f }}</li>
        </ul>
        <div class="actions">
          <a class="btn brand" :href="DISCORD" target="_blank" rel="noopener">Mua Premium</a>
          <a class="trial" href="#dung-thu">Hoặc dùng thử miễn phí 14 ngày <ArrowRight :size="14" aria-hidden="true" /></a>
        </div>
      </article>
    </div>

    <p class="compare">
      Cần so sánh chi tiết từng tính năng? Xem
      <a :href="withBase('/huong-dan/tinh-nang#so-sanh-ban-mien-phi-va-premium')">bảng so sánh đầy đủ</a>.
    </p>
  </section>
</template>

<style scoped>
.plans {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  max-width: 880px;
  margin: 0 auto;
}

@media (min-width: 760px) {
  .plans {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }
}

.plan {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px 26px 26px;
}

/* thẻ Premium nổi bật bằng viền và quầng sáng xanh - vàng tĩnh */
.plan.premium {
  border-color: var(--vp-c-brand-1);
  background:
    radial-gradient(420px 220px at 100% 0%, rgba(var(--home-glow-b, 255, 201, 102), 0.14), transparent 70%),
    radial-gradient(420px 220px at 0% 0%, rgba(var(--home-glow-a, 62, 207, 142), 0.14), transparent 70%),
    var(--vp-c-bg-soft);
  box-shadow: 0 18px 48px -28px rgba(var(--home-glow-a, 62, 207, 142), 0.55);
}

.ribbon {
  position: absolute;
  top: 18px;
  right: 18px;
  padding: 2px 10px;
  border-radius: 999px;
  background-color: var(--vp-badge-tip-bg);
  color: var(--vp-badge-tip-text);
  font-size: 12px;
  font-weight: 600;
}

.name {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0;
}

.price {
  margin-top: 8px;
}

.amount {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -1px;
  color: var(--vp-c-text-1);
}

.premium .amount {
  color: var(--vp-c-brand-1);
}

.home-pricing .plan .sub {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-align: left;
}

.list {
  flex: 1;
  display: grid;
  /* thẻ miễn phí ngắn hơn Premium: dồn các dòng lên đầu thay vì giãn đều khoảng cách */
  align-content: start;
  gap: 10px;
  margin: 22px 0 26px;
  padding: 18px 0 0;
  border-top: 1px solid var(--vp-c-divider);
  list-style: none;
}

.list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

.list li svg {
  flex-shrink: 0;
  margin-top: 3px;
  color: var(--vp-c-brand-1);
}

.list li.lead {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.btn {
  display: block;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 38px;
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

/* dòng phụ dưới nút: hai thẻ cùng cấu trúc và cùng chiều cao nên hai nút luôn nằm ngang hàng */
.trial,
.hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 20px;
  font-size: 13px;
  line-height: 20px;
}

.trial {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.hint {
  color: var(--vp-c-text-3);
}

.trial:hover {
  text-decoration: underline;
}

.home-pricing .compare {
  margin: 24px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-3);
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
