<script setup lang="ts">
// Lời giới thiệu nằm giữa hero và lưới tính năng (slot home-features-before của VitePress)
</script>

<template>
  <section class="home-intro">
    <span class="eyebrow">Vì sao chọn DotMan?</span>
    <h2>Giải pháp quản lý dòng tiền <span class="top">số 1</span> cho server <span class="home-grad-text">Minecraft Việt Nam</span></h2>
    <p>
      Hiện đại nhất, đầy đủ nhất: Nạp thẻ cào, chuyển khoản ngân hàng, đa dạng cổng thanh toán, khuyến mãi,
      mốc nạp và đua top trong một plugin duy nhất, được các server Minecraft lớn ở Việt Nam tin dùng.
    </p>
  </section>
</template>

<style scoped>
.home-intro {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px 8px;
  text-align: center;
}

@media (min-width: 640px) {
  .home-intro {
    padding: 56px 48px 8px;
  }
}

.eyebrow {
  display: block;
  margin-bottom: 12px;
  color: var(--vp-c-brand-1);
  font-size: 18px;
  font-weight: 600;
}

@media (min-width: 640px) {
  .eyebrow {
    font-size: 20px;
  }
}

h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

@media (min-width: 640px) {
  h2 {
    font-size: 34px;
  }
}

.top {
  color: var(--vp-c-brand-1);
}

p {
  margin: 16px auto 0;
  max-width: 680px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
</style>
