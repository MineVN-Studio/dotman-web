<script setup lang="ts">
// Các cổng thanh toán DotMan hỗ trợ. Logo hiện là ảnh tạm (docs/public/gateways/<id>.png), thay file cùng tên là xong.
// `id` là tên file logo, `name` là tên hiển thị (khác với giá trị `provider` trong file cấu hình).
import { withBase } from 'vitepress'

interface Gateway {
  id: string
  name: string
  note?: string
  premium?: boolean
}

const CARD_LINK = '/nap-tien/the-cao#chon-cong-gach-the'
const BANK_LINK = '/nap-tien/ngan-hang#cong-thanh-toan-ngan-hang'

const CARDS: Gateway[] = [
  { id: 'card2k', name: 'Card2K', note: 'MineVN Studio khuyên dùng' },
  { id: 'thesieure', name: 'TheSieuRe' },
  { id: 'gamebank', name: 'GameBank' },
  { id: 'gachthe1s', name: 'GachThe1s', premium: true },
  { id: 'gachthe5s', name: 'GachThe5s', premium: true },
]

const BANKS: Gateway[] = [
  { id: 'mbbank', name: 'MBBank', note: 'Kết nối trực tiếp' },
  { id: 'payos', name: 'PayOS', note: 'MBBANK, BIDV, ACB, OCB, KLB' },
  { id: 'sepay', name: 'SePay', note: '11 ngân hàng' }
]

const groups = [
  { key: 'card', title: 'Thẻ cào', link: CARD_LINK, items: CARDS, premium: false },
  { key: 'bank', title: 'Chuyển khoản ngân hàng', link: BANK_LINK, items: BANKS, premium: true },
]

const logo = (id: string) => withBase(`/gateways/${id}.png`)
</script>

<template>
  <section class="home-section home-gateways" aria-labelledby="home-gateways-title">
    <h2 id="home-gateways-title">Tích hợp sẵn các cổng thanh toán</h2>
    <p>Chọn cổng bạn đang dùng, DotMan lo phần còn lại: kiểm tra giao dịch, cộng point và chạy lệnh thưởng.</p>

    <div v-for="g in groups" :key="g.key" class="group">
      <h3 class="group-title">
        {{ g.title }}
        <span v-if="g.premium" class="home-tag">Premium</span>
      </h3>
      <div class="tiles">
        <a v-for="item in g.items" :key="item.id" class="tile home-card" :href="withBase(g.link)">
          <img class="logo" :src="logo(item.id)" :alt="item.name" width="44" height="44" loading="lazy" />
          <span class="text">
            <span class="name">
              {{ item.name }}
              <span v-if="item.premium" class="home-tag">Premium</span>
            </span>
            <span v-if="item.note" class="note">{{ item.note }}</span>
          </span>
        </a>
      </div>
    </div>

    <p class="cards-note">
      Hỗ trợ thẻ Viettel, Mobifone, Vinaphone, Vietnamobile, Garena, Zing, Vcoin và Gate.
    </p>
  </section>
</template>

<style scoped>
.group + .group {
  margin-top: 28px;
}

.group-title {
  margin: 0 0 12px;
  padding: 0;
  border: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--vp-c-text-2);
  text-align: center;
}

.tiles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
}

.tile {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 18px;
}

@media (min-width: 560px) {
  .tile {
    width: calc(50% - 7px);
  }
}

@media (min-width: 900px) {
  .tile {
    width: calc(33.333% - 10px);
  }
}

.logo {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: contain;
}

.text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.note {
  margin-top: 2px;
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--vp-c-text-3);
}

.home-tag {
  margin-left: 4px;
}

.home-gateways .cards-note {
  margin: 24px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
</style>
