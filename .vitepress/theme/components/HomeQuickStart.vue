<script setup lang="ts">
import { withBase } from 'vitepress'
import { ArrowRight } from 'lucide-vue-next'

const STEPS = [
  {
    title: 'Tải plugin',
    desc: 'Tải DotMan cùng MineVNLib và PlayerPoints. PlaceholderAPI nên có nhưng không bắt buộc.',
    link: '/docs/huong-dan/cai-dat#tai-plugin',
  },
  {
    title: 'Cài đặt',
    desc: 'Chép các file jar vào thư mục plugins rồi khởi động server. Bản Premium điền thêm license key.',
    link: '/docs/huong-dan/cai-dat#cai-dat-dotman',
  },
  {
    title: 'Chọn cổng thanh toán',
    desc: 'Đặt cổng thẻ cào hoặc ngân hàng trong file cấu hình, điền API key rồi chạy /dotman reload.',
    link: '/docs/nap-tien/the-cao#chon-cong-gach-the',
  },
  {
    title: 'Mở nạp cho người chơi',
    desc: 'Người chơi gõ /napthe để nạp thẻ cào, hoặc /bank để chuyển khoản. Point và lệnh thưởng tự động.',
    link: '/docs/nap-tien/the-cao',
  },
]
</script>

<template>
  <section class="home-section home-quickstart" aria-labelledby="home-quickstart-title">
    <h2 id="home-quickstart-title">Bắt đầu trong 4 bước</h2>
    <p>Từ lúc tải plugin tới lúc người chơi nạp được, thường chỉ mất vài phút.</p>

    <ol class="steps">
      <li v-for="(s, i) in STEPS" :key="s.title">
        <a class="step home-card" :href="withBase(s.link)">
          <span class="no">{{ i + 1 }}</span>
          <span class="title">{{ s.title }}</span>
          <span class="desc">{{ s.desc }}</span>
          <span class="more">Xem hướng dẫn <ArrowRight :size="14" aria-hidden="true" /></span>
        </a>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.steps {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: none;
}

@media (min-width: 640px) {
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1040px) {
  .steps {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.steps li {
  display: flex;
  margin: 0;
}

.step {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px 20px 18px;
}

.no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--home-a, var(--vp-c-brand-1)), var(--home-b, #e9a915));
  color: #1b1b1f;
  font-size: 15px;
  font-weight: 700;
}

.title {
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.desc {
  flex: 1;
  font-size: 14px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

.more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

.more svg {
  transition: transform 0.25s var(--home-ease, ease);
}

.step:hover .more svg {
  transform: translateX(3px);
}
</style>
