// Giữ dữ liệu đang nhập của các công cụ khi chuyển trang hoặc tải lại trang, tự xóa khi đóng tab (sessionStorage)
import { isRef, onMounted, watch, type Ref } from 'vue'

const PREFIX = 'dotman-tool:'

type Source = Ref<unknown> | object

const unwrap = (src: Source) => (isRef(src) ? src.value : src)

function read(key: string): Record<string, unknown> | undefined {
  try {
    const raw = sessionStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : undefined
  } catch {
    return undefined
  }
}

function write(key: string, value: unknown) {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // hết dung lượng hoặc trình duyệt chặn storage: bỏ qua, công cụ vẫn chạy bình thường
  }
}

/**
 * Lưu các ref / object reactive của một công cụ vào sessionStorage theo `key`.
 * - Khôi phục trong onMounted, sau khi hydrate xong, để HTML render sẵn khớp với lúc tải trang.
 * - Watcher của component (nếu có) sẽ chạy lại sau khi khôi phục, nên tránh watcher ghi đè dữ liệu đã lưu.
 * - Giá trị phải chuyển được sang JSON; kiểu khác (Set, Map...) thì bọc bằng computed có get/set.
 */
export function useSessionState(key: string, state: Record<string, Source>, onRestore?: () => void) {
  onMounted(() => {
    const saved = read(key)
    if (saved) {
      for (const [name, src] of Object.entries(state)) {
        if (!(name in saved)) continue
        if (isRef(src)) src.value = saved[name]
        else Object.assign(src, saved[name])
      }
      onRestore?.()
    }
    watch(
      () => Object.fromEntries(Object.entries(state).map(([name, src]) => [name, unwrap(src)])),
      (value) => write(key, value),
      { deep: true },
    )
  })
}
