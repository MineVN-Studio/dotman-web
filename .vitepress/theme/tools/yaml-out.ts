// Tạo YAML theo đúng phong cách các file mẫu của DotMan (chuỗi trong dấu nháy đơn, list không thụt lề ở cấp gốc)

/** Chuỗi YAML trong dấu nháy đơn, ký tự ' được nhân đôi */
export const q = (s: string) => `'${s.replace(/'/g, "''")}'`

/** Tách textarea thành danh sách lệnh, bỏ dòng trống */
export const lines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

/** Các dòng lệnh có dấu / ở đầu (lệnh chạy từ console không cần dấu /) */
export const slashCommands = (text: string) => lines(text).filter((l) => l.startsWith('/'))
