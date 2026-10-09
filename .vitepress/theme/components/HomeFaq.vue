<script setup lang="ts">
// Khối "Câu hỏi thường gặp" ở cuối trang chủ. Nội dung các câu hỏi viết bằng markdown trong docs/index.md qua <FaqItem>.
</script>

<template>
  <section class="home-section home-faq" aria-labelledby="home-faq-title">
    <h2 id="home-faq-title">Câu hỏi thường gặp</h2>
    <p>Những điều chủ server thường hỏi trước khi dùng DotMan.</p>
    <div class="list">
      <slot />
    </div>
  </section>
</template>

<style scoped>
/* kèm .home-section để thắng style chung của khối trang chủ (.VPHome .home-section) */
.home-section.home-faq {
  max-width: 896px;
  padding-bottom: 8px;
}

.home-faq h2,
.home-faq > p {
  text-align: center;
}

.list {
  display: grid;
  gap: 12px;
}
</style>
