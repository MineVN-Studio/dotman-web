---
title: Phần thưởng top nạp
description: Tự động trao thưởng cho người chơi đứng top nạp khi kết thúc mỗi ngày, tuần, tháng.
---

# Phần thưởng top nạp <Badge type="tip" text="Premium" />

Tự động trao thưởng cho người chơi đứng top nạp của kỳ vừa kết thúc. Cấu hình trong file `phanthuongtop.yml`.

## Thời điểm trao thưởng

| Mục | Xét top của | Thời điểm |
|-----|-------------|-----------|
| `top-ngay` | Ngày hôm trước | 0 giờ hằng ngày |
| `top-tuan` | Tuần trước | 0 giờ thứ 2 hằng tuần |
| `top-thang` | Tháng trước | 0 giờ ngày 1 hằng tháng |

- Phần thưởng được trao cho người chơi đang online tại thời điểm trên.
- Người chơi offline sẽ nhận thưởng khi vào lại server lần tới.

## Cấu hình

Mỗi mục là danh sách hạng và lệnh tương ứng:

```yaml [phanthuongtop.yml]
top-thang:
  1:
    - 'give %PLAYER% diamond 10'
  2:
    - 'give %PLAYER% diamond 5'
  3:
    - 'give %PLAYER% diamond 3'
  4-10:
    - 'tell %PLAYER% Tháng trước bạn đứng thứ %RANK% top nạp thẻ.'
```

- Hạng là một số (`1`, `2`, `3`) hoặc một khoảng (`4-10`, `11-20`).
- Chỉ xét tới hạng 100, khai báo hạng lớn hơn sẽ không có tác dụng.

| Placeholder | Mô tả |
|-------------|-------|
| `%PLAYER%` | Tên người chơi |
| `%RANK%` | Hạng của người chơi |

## Ví dụ

```yaml [phanthuongtop.yml]
top-thang:
  1:
    - 'tell %PLAYER% Tháng trước bạn đứng nhất top nạp thẻ.'
    - 'give %PLAYER% diamond 10'
  2-3:
    - 'tell %PLAYER% Tháng trước bạn đứng thứ %RANK% top nạp thẻ.'
    - 'give %PLAYER% diamond 5'

top-tuan:
  1:
    - 'tell %PLAYER% Tuần vừa rồi bạn đứng nhất top nạp thẻ.'
  2-10:
    - 'tell %PLAYER% Tuần vừa rồi bạn đứng thứ %RANK% top nạp thẻ.'

top-ngay:
  1:
    - 'tell %PLAYER% Hôm qua bạn đứng nhất top nạp thẻ.'
```

Xem bảng xếp hạng của các kỳ trước bằng [lệnh top nạp](/phan-thuong/top-nap#lenh-xem-top).

::: tip
Sử dụng công cụ [Tạo mốc nạp & thưởng top](/cong-cu/moc-nap-va-thuong-top) để tạo mốc nạp, phần thưởng dễ dàng hơn.
:::
