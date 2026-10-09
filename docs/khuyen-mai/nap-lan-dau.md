---
title: Khuyến mãi nạp lần đầu
description: Tặng thêm giá trị và chạy lệnh thưởng cho lần nạp đầu tiên của người chơi.
---

# Khuyến mãi nạp lần đầu <Badge type="tip" text="Premium" />

Tặng thêm point cho lần nạp **đầu tiên** của người chơi trên server, áp dụng cho nạp thẻ cào và chuyển khoản ngân hàng.

## Cấu hình

```yaml [config.yml]
first-donate:
  enabled: false

  # Tỉ lệ khuyến mãi cộng thêm khi nạp lần đầu, cách tính giống "rate" trong khuyenmai.yml
  extra-rate: 1.0

  # Lệnh thực thi khi người chơi nạp lần đầu
  commands:
    - 'tell %PLAYER% Bạn vừa nạp lần đầu và nhận được %POINT% %POINT_UNIT% (khuyến mãi %EXTRA_RATE%% giá trị nạp lần đầu)!'
```

| Tùy chọn | Mô tả | Mặc định |
|----------|-------|----------|
| `enabled` | Bật/tắt khuyến mãi nạp lần đầu | `false` |
| `extra-rate` | Tỉ lệ cộng thêm, `1.0` là thêm 100% | `1.0` |
| `commands` | Lệnh chạy từ console khi người chơi nạp lần đầu | |

## Cách tính

- Lần nạp đầu là khi người chơi chưa có giao dịch thành công nào trước đó trên server.
- `extra-rate` được **cộng thêm** vào tỉ lệ của [khuyến mãi đang áp dụng](/khuyen-mai/lich-khuyen-mai).
  - Ví dụ: đang có khuyến mãi 50%, `extra-rate: 1.0`, thì lần nạp đầu được khuyến mãi 150%.
- Nạp thủ công không tính là nạp lần đầu.

## Placeholder

| Placeholder | Mô tả |
|-------------|-------|
| `%PLAYER%` | Tên người chơi |
| `%AMOUNT%` | Số tiền nạp (VNĐ) |
| `%POINT%` | Số point nhận được, đã cộng khuyến mãi |
| `%POINT_UNIT%` | Đơn vị point |
| `%EXTRA_RATE%` | Tỉ lệ khuyến mãi nạp lần đầu theo phần trăm, ví dụ `100` |

Với chuyển khoản ngân hàng, nếu người chơi đã thoát server lúc tiền về, lệnh thưởng được [giữ lại và chạy khi vào lại](/quan-tri/lenh-thuong-offline).
