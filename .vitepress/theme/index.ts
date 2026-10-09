import { defineAsyncComponent, defineComponent, h, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import FaqItem from './components/FaqItem.vue'
import HomeGateways from './components/HomeGateways.vue'
import HomeFaq from './components/HomeFaq.vue'
import HomeIntro from './components/HomeIntro.vue'
import HomeOutro from './components/HomeOutro.vue'
import HomePricing from './components/HomePricing.vue'
import HomeQuickStart from './components/HomeQuickStart.vue'
import HomeStats from './components/HomeStats.vue'
import HomeTools from './components/HomeTools.vue'
import HomeTrial from './components/HomeTrial.vue'
import PageActions from './components/PageActions.vue'
import ReleaseIndex from './components/ReleaseIndex.vue'
import ReleaseList from './components/ReleaseList.vue'
import ToolIndex from './components/ToolIndex.vue'
import { setupReveal } from './reveal'
import './style.css'
import './home.css'
import './tools.css'

// Các công cụ (kèm yaml, datepicker, date-fns) chỉ tải khi mở trang công cụ, không làm nặng các trang khác
const tools = {
  PointCalculator: () => import('./components/PointCalculator.vue'),
  DiscordConverter: () => import('./tools/DiscordConverter.vue'),
  MilestoneBuilder: () => import('./tools/MilestoneBuilder.vue'),
  PlaceholderBuilder: () => import('./tools/PlaceholderBuilder.vue'),
  PromoTools: () => import('./tools/PromoTools.vue'),
}

export default {
  extends: DefaultTheme,
  // chèn lời giới thiệu giữa hero và lưới tính năng của trang chủ
  Layout: defineComponent({
    setup() {
      const route = useRoute()
      let stop = () => {}
      // khối của trang chủ hiện dần khi cuộn tới, theo dõi lại sau mỗi lần chuyển trang
      const start = () => {
        stop()
        stop = route.path === '/' ? setupReveal() : () => {}
      }
      onMounted(start)
      watch(() => route.path, () => nextTick(start))
      onBeforeUnmount(() => stop())
      return () => h(DefaultTheme.Layout, null, { 'home-features-before': () => h(HomeIntro) })
    },
  }),
  enhanceApp({ app }) {
    app.component('FaqItem', FaqItem)
    app.component('HomeFaq', HomeFaq)
    app.component('HomeGateways', HomeGateways)
    app.component('HomeOutro', HomeOutro)
    app.component('HomePricing', HomePricing)
    app.component('HomeQuickStart', HomeQuickStart)
    app.component('HomeStats', HomeStats)
    app.component('HomeTools', HomeTools)
    app.component('HomeTrial', HomeTrial)
    app.component('PageActions', PageActions)
    app.component('ReleaseIndex', ReleaseIndex)
    app.component('ReleaseList', ReleaseList)
    app.component('ToolIndex', ToolIndex)
    for (const [name, loader] of Object.entries(tools)) app.component(name, defineAsyncComponent(loader))
  },
} satisfies Theme
