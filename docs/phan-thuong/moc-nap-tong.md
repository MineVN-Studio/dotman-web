---
title: Mốc nạp tổng server
description: 'Mốc nạp tổng server trong DotMan: Mục tiêu nạp chung của cả cộng đồng, chạy lệnh thưởng khi đạt mốc, kèm bossbar hiển thị tiến độ.'
---

# Mốc nạp tổng server

Theo dõi tổng tiền nạp của **toàn server** và chạy lệnh khi đạt mốc. Phù hợp cho các tính năng như server booster, tiến độ nạp cộng đồng. Cấu hình trong file `mocnaptong.yml`.

## Cấu hình

```yaml [mocnaptong.yml]
mocnaptong:
- type: all
  amount: 10000000
  bossbar: 'Donate server: %CURRENT%/%TARGET% VNĐ'
  from: 0
  bossbar-color: GREEN
  bossbar-style: SEGMENTED_10
  commands:
    - 'say Donate của server đã đạt 10 triệu!'
```

| Tùy chọn | Mô tả | Mặc định |
|----------|-------|----------|
| `type` | Khoảng thời gian tính tổng nạp, giống [mốc nạp cá nhân](/phan-thuong/moc-nap-ca-nhan#loai-moc-nap) | |
| `amount` | Tổng tiền nạp của server cần đạt (VNĐ) | |
| `commands` | Lệnh chạy từ console khi đạt mốc | |
| `bossbar` | Nội dung bossbar tiến độ, hỗ trợ `%CURRENT%`, `%TARGET%`.<br />Không khai báo thì không hiện bossbar. | |
| `from` | Tổng nạp tối thiểu để bắt đầu hiện bossbar | `0` |
| `bossbar-color` | Màu bossbar: `GREEN`, `RED`, `BLUE`, `YELLOW`, `PURPLE`, `WHITE`, `PINK` | `GREEN` |
| `bossbar-style` | Kiểu bossbar: `SOLID`, `SEGMENTED_6`, `SEGMENTED_10`, `SEGMENTED_12`, `SEGMENTED_20` | `SEGMENTED_10` |

- `type: all` tính tổng nạp của server từ khi bắt đầu dùng DotMan.
- `day`, `week`, `month`, `frame-<id>` chỉ có ở bản Premium.

## Cách hoạt động

- Lệnh trong `commands` chạy **một lần** khi tổng nạp của server vượt qua mốc.
  - Lệnh không gắn với người chơi nào, không có placeholder tên người chơi.
- Bossbar hiện cho mọi người chơi khi tổng nạp nằm trong khoảng từ `from` tới dưới `amount`, cập nhật mỗi 5 giây.
- Bossbar tự ẩn khi đạt mốc.

## Ví dụ

```yaml [mocnaptong.yml]
mocnaptong:
- type: all
  bossbar: 'Donate server: %CURRENT%/%TARGET% VNĐ'
  from: 0
  bossbar-color: GREEN
  bossbar-style: SEGMENTED_10
  amount: 10000000
  commands:
    - 'say Donate của server đã đạt 10 triệu!'

- type: week
  bossbar: '&eMục tiêu tuần: %CURRENT%/%TARGET% VNĐ'
  from: 500000
  amount: 1000000
  commands:
    - 'say Tuần này donate của server đã đạt 1 triệu!'
```

Hiển thị tổng nạp của server bằng [placeholder](/tham-khao/placeholder-api#tong-nap-toan-server) `%dotman_masterdata_donate_total%` <Badge type="tip" text="Premium" />, hoặc tạo placeholder theo kỳ bằng công cụ [Tạo placeholder](/cong-cu/tao-placeholder).

::: tip
Sử dụng công cụ [Tạo mốc nạp & thưởng top](/cong-cu/moc-nap-va-thuong-top) để tạo mốc nạp, phần thưởng dễ dàng hơn.
:::
