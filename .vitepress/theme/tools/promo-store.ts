// Trạng thái dùng chung giữa phần "Tạo lịch khuyến mãi" và "Kiểm tra lịch khuyến mãi" trên cùng một trang
import { ref } from 'vue'

export const CHECKER_SAMPLE = `legacy-name: '&aKhuyến mãi nạp thẻ'

khuyen-mai:
- name: '&aCuối tuần - Khuyến mãi 50%'
  rate: 0.5
  days: [7, 8]

- name: '&eGiờ vàng - Khuyến mãi 30%'
  rate: 0.3
  hours: '18:00-22:00'

- name: '&dTối thứ 6 - Khuyến mãi 100%'
  rate: 1.0
  days: [6]
  hours: '20:00-24:00'

- name: '&cKhung giờ qua nửa đêm (sai)'
  rate: 0.2
  hours: '22:00-02:00'
`

/** Nội dung khuyenmai.yml đang được kiểm tra */
export const checkerSource = ref(CHECKER_SAMPLE)

export type PromoTab = 'create' | 'check'

/** Tab đang mở trên trang Tạo & kiểm tra lịch khuyến mãi */
export const activeTab = ref<PromoTab>('create')
