---
title: Nạp thủ công cho người chơi
description: Nạp tiền thủ công cho người chơi, cộng point, ghi lịch sử và chạy lệnh thưởng.
---

# Nạp thủ công

Dùng khi người chơi nạp qua kênh khác (ví dụ chuyển khoản trực tiếp cho admin). Lệnh nạp thủ công cộng point, ghi lịch sử, tính vào top nạp và mốc nạp như một giao dịch bình thường.

## Cấu hình

```yaml [config.yml]
manual:
  # Số point tiêu chuẩn trên mỗi 1000 VNĐ, dùng để tính khuyến mãi
  point-base: 1
  # Số point nhận thêm trên mỗi 1000 VNĐ khi nạp thủ công
  point-extra: 0.5
  # Lệnh thực thi sau khi nạp
  commands:
    - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
```

Công thức tính point:

```
Point nhận = (số tiền / 1000) × (point-base + point-extra + point-base × tỉ lệ khuyến mãi)
```

- Tỉ lệ khuyến mãi lấy từ [lịch khuyến mãi](/docs/khuyen-mai/lich-khuyen-mai).
- Ví dụ: nạp 100.000đ, `point-base: 1`, `point-extra: 0.5`, khuyến mãi 50%:

```
Point nhận = 100 × (1 + 0.5 + 1 × 0.5) = 200 point
```

Placeholder dùng được trong `commands`:

| Placeholder | Mô tả |
|-------------|-------|
| `%PLAYER%` | Tên người chơi |
| `%AMOUNT%` | Số tiền nạp (VNĐ) |
| `%POINT%` | Số point nhận được |
| `%POINT_UNIT%` | Đơn vị point |

## Lệnh nạp thủ công

```
/dotman napthucong <tên người chơi> <số tiền> [-p <số point>] [-d <nội dung>] [-f] [-c]
```

Alias: `/dotman manual`. Yêu cầu quyền `dotman.admin`.

| Tùy chọn | Mô tả |
|----------|-------|
| `-p <số point>` | Đặt số point nhận, bỏ qua công thức |
| `-d <nội dung>` | Nội dung ghi vào lịch sử, tối đa 20 ký tự, có thể gồm nhiều từ |
| `-f` | Vẫn nạp khi người chơi đang offline |
| `-c` | Tính point theo [mệnh giá thẻ cào](/docs/nap-tien/the-cao#menh-gia-va-point) thay vì công thức trên.<br />Số tiền phải trùng một mệnh giá thẻ, không dùng chung với `-p`. |

Ví dụ:

```
/dotman napthucong Steve 100000
/dotman napthucong Steve 100000 -p 500
/dotman napthucong Steve 50000 -c
/dotman napthucong Steve 100000 -d qua tang su kien -f
```

- Người chơi phải từng vào server ít nhất một lần.
- Nếu người chơi đang offline, lệnh sẽ dừng lại và nhắc thêm `-f` để xác nhận.
- Lệnh trong `manual.commands` chạy ngay khi nạp, kể cả khi người chơi offline.

## Thử công thức tính point

Dùng `/dotman testpoint <số tiền>` (alias `tp`) để xem trước số point nhận được theo cách tính của thẻ cào và nạp thủ công, không cộng point thật.

Hoặc tính thử ngay trên web bằng [Tính toán point](/docs/cong-cu/tinh-toan-point).
