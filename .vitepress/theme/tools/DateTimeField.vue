<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { vi } from 'date-fns/locale'

const props = withDefaults(
  defineProps<{
    /** datetime: 'yyyy-MM-ddTHH:mm:ss', time: 'HH:mm' */
    modelValue: string
    mode?: 'datetime' | 'time'
    placeholder?: string
    clearable?: boolean
    disabled?: boolean
  }>(),
  { mode: 'datetime', placeholder: '', clearable: false, disabled: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { isDark } = useData()
const pad = (n: number) => String(n).padStart(2, '0')

// time picker dùng object { hours, minutes }, datetime dùng chuỗi theo model-type
const value = computed({
  get(): any {
    if (!props.modelValue) return null
    if (props.mode === 'time') {
      const [hours, minutes] = props.modelValue.split(':').map(Number)
      return { hours, minutes, seconds: 0 }
    }
    return props.modelValue
  },
  set(v: any) {
    if (props.mode === 'time') emit('update:modelValue', v ? `${pad(v.hours)}:${pad(v.minutes)}` : '')
    else emit('update:modelValue', v ?? '')
  },
})

const isTime = computed(() => props.mode === 'time')
const inputFormat = computed(() => (isTime.value ? 'HH:mm' : 'dd/MM/yyyy HH:mm:ss'))
</script>

<template>
  <ClientOnly>
    <VueDatePicker
      v-model="value"
      class="dt-field"
      :time-picker="isTime"
      :model-type="isTime ? undefined : `yyyy-MM-dd'T'HH:mm:ss`"
      :formats="{ input: inputFormat }"
      :time-config="{ enableSeconds: !isTime, is24: true }"
      :text-input="{ format: inputFormat }"
      :locale="vi"
      :week-start="1"
      :day-names="['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']"
      :dark="isDark"
      :disabled="disabled"
      :placeholder="placeholder"
      :input-attrs="{ clearable }"
      :action-row="{ selectBtnLabel: 'Chọn', cancelBtnLabel: 'Hủy', nowBtnLabel: 'Bây giờ', showNow: !isTime }"
    />
    <template #fallback>
      <input type="text" :value="modelValue" :placeholder="placeholder" disabled />
    </template>
  </ClientOnly>
</template>
