<script setup lang="ts">
// Dropdown riêng của project, thay cho <select> mặc định của trình duyệt.
// Hỗ trợ bàn phím: mũi tên, Home/End, Enter hoặc Space để chọn, Esc để đóng.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Check, ChevronDown } from 'lucide-vue-next'

export interface SelectOption {
  value: string
  label: string
  /** nhãn nhỏ cạnh tên, ví dụ "Premium" */
  tag?: string
}

const props = defineProps<{
  modelValue: string
  options: SelectOption[]
  disabled?: boolean
  ariaLabel?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const MENU_MAX_HEIGHT = 260

const root = ref<HTMLElement>()
const menu = ref<HTMLElement>()
const open = ref(false)
const above = ref(false)
const active = ref(-1)

const selectedIndex = computed(() => props.options.findIndex((o) => o.value === props.modelValue))
const selected = computed(() => props.options[selectedIndex.value])
const listId = `tool-select-${Math.random().toString(36).slice(2, 9)}`

async function show() {
  if (props.disabled || open.value) return
  // đủ chỗ phía dưới thì xổ xuống, không thì xổ lên trên
  const rect = root.value!.getBoundingClientRect()
  const menuHeight = Math.min(MENU_MAX_HEIGHT, props.options.length * 34 + 8)
  above.value = window.innerHeight - rect.bottom < menuHeight + 12 && rect.top > menuHeight + 12
  active.value = Math.max(selectedIndex.value, 0)
  open.value = true
  await nextTick()
  scrollToActive()
}

function hide() {
  open.value = false
}

function choose(index: number) {
  const option = props.options[index]
  if (option) emit('update:modelValue', option.value)
  hide()
  root.value?.querySelector<HTMLElement>('.trigger')?.focus()
}

function scrollToActive() {
  menu.value?.querySelectorAll<HTMLElement>('[role=option]')[active.value]?.scrollIntoView({ block: 'nearest' })
}

function move(delta: number) {
  const n = props.options.length
  active.value = (active.value + delta + n) % n
  scrollToActive()
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  if (!open.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      show()
    }
    return
  }
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); move(1); break
    case 'ArrowUp': e.preventDefault(); move(-1); break
    case 'Home': e.preventDefault(); active.value = 0; scrollToActive(); break
    case 'End': e.preventDefault(); active.value = props.options.length - 1; scrollToActive(); break
    case 'Enter':
    case ' ': e.preventDefault(); choose(active.value); break
    case 'Escape': e.preventDefault(); hide(); break
    case 'Tab': hide(); break
  }
}

function onPointerDown(e: PointerEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) hide()
}

onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))
watch(() => props.disabled, (d) => d && hide())
</script>

<template>
  <div ref="root" class="tool-select" :class="{ open, above, disabled }">
    <button type="button" class="trigger" role="combobox" aria-haspopup="listbox" :aria-expanded="open"
      :aria-controls="listId" :aria-label="ariaLabel" :disabled="disabled"
      @click="open ? hide() : show()" @keydown="onKeydown">
      <span class="value">
        <span class="text">{{ selected?.label ?? '' }}</span>
        <span v-if="selected?.tag" class="tag">{{ selected.tag }}</span>
      </span>
      <ChevronDown class="chevron" :size="16" aria-hidden="true" />
    </button>
    <Transition name="select-menu">
      <ul v-show="open" :id="listId" ref="menu" class="menu" role="listbox">
        <li v-for="(o, i) in options" :key="o.value" role="option" class="option"
          :class="{ active: i === active, selected: i === selectedIndex }" :aria-selected="i === selectedIndex"
          @pointerenter="active = i" @click="choose(i)">
          <span class="label">
            {{ o.label }}
            <span v-if="o.tag" class="tag">{{ o.tag }}</span>
          </span>
          <Check v-if="i === selectedIndex" class="check" :size="14" aria-hidden="true" />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.tool-select {
  position: relative;
  min-width: 0;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s;
}

.trigger:hover:not(:disabled),
.open .trigger,
.trigger:focus-visible {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.trigger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* chữ dài thì cắt bằng dấu ..., còn nhãn tag luôn hiện đủ */
.value {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  transition: transform 0.2s, color 0.2s;
}

.open .chevron {
  color: var(--vp-c-brand-1);
  transform: rotate(180deg);
}

/* menu cùng kiểu với bộ chọn ngày giờ: nền nổi, bóng đổ, bo góc */
.menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 30;
  min-width: 100%;
  max-height: 260px;
  margin: 0;
  padding: 4px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
  list-style: none;
  transform-origin: top center;
}

.above .menu {
  top: auto;
  bottom: calc(100% + 6px);
  transform-origin: bottom center;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0;
  padding: 6px 10px;
  border-radius: 6px;
  color: var(--vp-c-text-1);
  line-height: 22px;
  white-space: nowrap;
  cursor: pointer;
}

.option.active {
  background-color: var(--vp-c-default-soft);
}

.option.selected {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.check {
  flex-shrink: 0;
}

.tag {
  flex-shrink: 0;
  padding: 0 6px;
  border-radius: 999px;
  background-color: var(--vp-badge-tip-bg);
  color: var(--vp-badge-tip-text);
  font-size: 10px;
  font-weight: 500;
  line-height: 18px;
}

.select-menu-enter-active,
.select-menu-leave-active {
  transition: opacity 0.14s, transform 0.14s;
}

.select-menu-enter-from,
.select-menu-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.above .select-menu-enter-from,
.above .select-menu-leave-to {
  transform: translateY(4px) scale(0.98);
}
</style>
