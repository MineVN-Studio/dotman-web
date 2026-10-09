---
title: Mốc nạp cá nhân
description: Trao thưởng khi tổng tiền nạp của người chơi đạt một mốc trong khoảng thời gian tương ứng.
---

# Mốc nạp cá nhân

Trao thưởng cho người chơi khi tổng số tiền họ đã nạp đạt một mốc nhất định. Cấu hình trong file `mocnap.yml`.

## Cấu hình

```yaml [mocnap.yml]
mocnap:
- type: all
  amount: 5000000
  commands:
    - 'tell %player% Chúc mừng bạn đã đạt mốc 5 triệu tích lũy'
    - 'give %player% emerald 1'
```

| Tùy chọn | Mô tả |
|----------|-------|
| `type` | Khoảng thời gian tính tổng nạp, xem bảng bên dưới |
| `amount` | Tổng số tiền cần đạt (VNĐ) |
| `commands` | Lệnh chạy từ console khi người chơi đạt mốc.<br />`%player%` (viết thường) là tên người chơi. |

## Loại mốc nạp

| `type` | Tính tổng nạp trong | Phiên bản |
|--------|---------------------|-----------|
| `all` | Toàn thời gian | Miễn phí |
| `day` | Ngày hôm nay, tính lại mỗi ngày | Premium |
| `week` | Tuần này, tính lại mỗi tuần | Premium |
| `month` | Tháng này, tính lại mỗi tháng | Premium |
| `frame-<id>` | [Khung thời gian](/docs/phan-thuong/khung-thoi-gian) có ID là `<id>` | Premium |

Với `day`, `week`, `month`, người chơi nhận lại thưởng ở mỗi kỳ mới nếu đạt mốc lần nữa.

## Cách tính

- Tổng nạp gồm thẻ cào (theo mệnh giá), chuyển khoản và nạp thủ công.
- Thưởng được trao **một lần** ngay khi tổng nạp vượt qua mốc.
  - Ví dụ mốc 500.000đ: người chơi đã nạp 400.000đ, nạp thêm 200.000đ thì nhận thưởng.
- Một lần nạp vượt qua nhiều mốc thì nhận thưởng của tất cả các mốc đó.
- Người chơi đang offline khi đạt mốc (ví dụ tiền chuyển khoản về sau khi thoát game): lệnh thưởng được [giữ lại và chạy khi vào lại](/docs/quan-tri/lenh-thuong-offline) <Badge type="tip" text="Premium" />.

## Ví dụ

```yaml [mocnap.yml]
mocnap:
- type: all
  amount: 5000000
  commands:
    - 'tell %player% Chúc mừng bạn đã đạt mốc 5 triệu tích lũy'
    - 'give %player% emerald 1'

- type: week
  amount: 200000
  commands:
    - 'tell %player% Chúc mừng bạn đã đạt mốc 200k tích lũy (hằng tuần)'
    - 'give %player% emerald 1'

- type: frame-giang-sinh-2026
  amount: 500000
  commands:
    - 'tell %player% Bạn đã nạp đủ 500k trong sự kiện Giáng sinh!'
```

Hiển thị tổng nạp của người chơi bằng [placeholder](/docs/tham-khao/placeholder-api#du-lieu-nguoi-choi) `%dotman_data_donate_total%`, hoặc tạo placeholder theo kỳ bằng công cụ [Tạo placeholder](/docs/cong-cu/tao-placeholder).

::: tip
Sử dụng công cụ [Tạo mốc nạp & thưởng top](/docs/cong-cu/moc-nap-va-thuong-top) để tạo mốc nạp, phần thưởng dễ dàng hơn.
:::
