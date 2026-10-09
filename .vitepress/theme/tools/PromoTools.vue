<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { CalendarPlus, ListChecks } from 'lucide-vue-next'
import PromoBuilder from './PromoBuilder.vue'
import PromoSchedule from './PromoSchedule.vue'
import { activeTab, checkerSource, type PromoTab } from './promo-store'
import { useSessionState } from './session-state'

// mỗi tab có id riêng để link từ trang khác mở đúng tab (#tao-lich-khuyen-mai, #kiem-tra-lich-khuyen-mai)
const TABS: { value: PromoTab; id: string; label: string; icon: any }[] = [
  { value: 'create', id: 'tao-lich-khuyen-mai', label: 'Tạo lịch khuyến mãi', icon: CalendarPlus },
  { value: 'check', id: 'kiem-tra-lich-khuyen-mai', label: 'Kiểm tra lịch khuyến mãi', icon: ListChecks },
]

// tab đang mở lấy theo hash trên URL nên không cần lưu
useSessionState('promo-checker', { checkerSource })

// template không gán trực tiếp được vào biến import, nên bọc bằng computed
const tab = computed({ get: () => activeTab.value, set: (v: PromoTab) => (activeTab.value = v) })

function syncFromHash() {
  const tab = TABS.find((t) => t.id === decodeURIComponent(location.hash.slice(1)))
  if (tab) activeTab.value = tab.value
}

onMounted(() => {
  syncFromHash()
  window.addEventListener('hashchange', syncFromHash)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', syncFromHash))

// ghi tab đang mở lên URL để chia sẻ link đúng tab
watch(activeTab, (tab) => {
  const id = TABS.find((t) => t.value === tab)!.id
  history.replaceState(history.state, '', `#${id}`)
})
</script>

<template>
  <div class="promo-tools">
    <div class="tabs" role="tablist">
      <button v-for="t in TABS" :key="t.value" type="button" role="tab" class="tab"
        :class="{ active: tab === t.value }" :aria-selected="tab === t.value" @click="tab = t.value">
        <component :is="t.icon" :size="16" />
        {{ t.label }}
      </button>
    </div>
    <div :id="TABS[0].id" v-show="tab === 'create'" role="tabpanel" class="panel">
      <PromoBuilder />
    </div>
    <div :id="TABS[1].id" v-show="tab === 'check'" role="tabpanel" class="panel">
      <PromoSchedule />
    </div>
  </div>
</template>

<style scoped>
.promo-tools {
  margin-top: 24px;
}

.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: -1px;
  padding: 10px 16px;
  border-bottom: 2px solid transparent;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-base);
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s, border-color 0.2s;
}

.tab:hover {
  color: var(--vp-c-text-1);
}

.tab.active {
  border-bottom-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.panel {
  scroll-margin-top: calc(var(--vp-nav-height) + 24px);
}

.panel :deep(.tool) {
  margin-top: 20px;
}
</style>
