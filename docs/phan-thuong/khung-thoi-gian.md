---
title: Khung thời gian
description: Định nghĩa các sự kiện có thời gian bắt đầu và kết thúc riêng để đua top và đặt mốc nạp.
---

# Khung thời gian <Badge type="tip" text="Premium" />

Khung thời gian (TimeFrame) là một sự kiện có thời gian bắt đầu và kết thúc tùy chỉnh, ví dụ Giáng sinh, Tết, Quốc khánh.

Tổng nạp của người chơi trong khung thời gian được theo dõi riêng, dùng cho:

- Đua top theo sự kiện, qua [placeholder](#placeholder).
- [Mốc nạp cá nhân](/phan-thuong/moc-nap-ca-nhan) và [mốc nạp tổng](/phan-thuong/moc-nap-tong) theo sự kiện.

## Cấu hình

Khai báo trong file `khungthoigian.yml`:

```yaml [khungthoigian.yml]
giang-sinh-2026:              # ID của khung thời gian
  name: 'Giáng sinh 2026'     # Tên hiển thị
  from: 23/12/2026 00:00      # Thời gian bắt đầu
  to: 30/12/2026 23:59        # Thời gian kết thúc
```

| Thông tin | Mô tả |
|-----------|-------|
| ID | Tên mục, dùng trong placeholder và mốc nạp |
| `name` | Tên hiển thị của sự kiện |
| `from`, `to` | Thời gian bắt đầu, kết thúc, định dạng `dd/MM/yyyy HH:mm` |

::: warning Quy tắc đặt ID
- Không chứa dấu gạch dưới (`_`).
- Phải **duy nhất**, kể cả với các ID đã xóa khỏi file.
  - Dữ liệu được lưu theo ID, dùng lại ID cũ sẽ bị lẫn dữ liệu của sự kiện trước.
- Nên kèm năm vào ID, ví dụ `tet-2027`, `giang-sinh-2026`.
:::

- Chỉ các giao dịch trong khoảng `from` tới `to` được tính vào khung thời gian.
- Dữ liệu khung thời gian lưu riêng, không ảnh hưởng tới dữ liệu toàn thời gian, ngày, tuần, tháng.

## Placeholder

| Placeholder | Trả về |
|-------------|--------|
| `%dotman_dataframe_<id>_donate_total%` | Tổng nạp của người chơi trong khung thời gian |
| `%dotman_topframe_<id>_donate_total_<hạng>_player%` | Tên người chơi ở hạng `<hạng>` |
| `%dotman_topframe_<id>_donate_total_<hạng>_value%` | Tổng nạp của người chơi ở hạng `<hạng>` |
| `%dotman_masterdataframe_<id>_donate_total%` | Tổng nạp của cả server trong khung thời gian |

Ví dụ với khung `giang-sinh-2026`:

```
%dotman_dataframe_giang-sinh-2026_donate_total%
%dotman_topframe_giang-sinh-2026_donate_total_1_player%
%dotman_topframe_giang-sinh-2026_donate_total_1_value%
```

Xem thêm tại [Placeholder API](/tham-khao/placeholder-api), hoặc tạo nhanh bằng công cụ [Tạo placeholder](/cong-cu/tao-placeholder).

## Mốc nạp theo khung thời gian

Đặt `type: frame-<id>` trong `mocnap.yml` hoặc `mocnaptong.yml` (có thể tạo bằng công cụ [Tạo mốc nạp & thưởng top](/cong-cu/moc-nap-va-thuong-top)):

```yaml [mocnap.yml]
mocnap:
- type: frame-giang-sinh-2026
  amount: 500000
  commands:
    - 'tell %player% Bạn đã nạp đủ 500k trong sự kiện Giáng sinh!'
```
