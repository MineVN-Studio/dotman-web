---
title: "mocnaptong.yml mẫu của DotMan"
description: "File mocnaptong.yml mặc định của DotMan: mốc nạp tổng của toàn server, kèm bossbar hiển thị tiến độ."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# mocnaptong.yml

Mốc nạp tổng của toàn server.

Hướng dẫn chi tiết: [Mốc nạp tổng server](/docs/phan-thuong/moc-nap-tong).

Công cụ hỗ trợ: [Tạo mốc nạp & thưởng top](/docs/cong-cu/moc-nap-va-thuong-top).

::: code-group

```yaml [mocnaptong.yml]
# Mốc nạp tổng và các lệnh thực thi khi đạt mốc
# Có thể dùng cho: Server booster, tiến độ nạp, ...
mocnaptong:
- type: all # Toàn thời gian
  # Lưu ý: Đối với mốc nạp toàn thời gian, tiền độ donate sẽ tính theo donate của server từ trước đến nay.
  #bossbar: 'Donate server: %CURRENT%/%TARGET% VNĐ' # Bossbar hiển thị tiến độ (bỏ comment để hiển thị)
  #from: 0 # mức hiển bossbar
  bossbar-color: GREEN
  bossbar-style: SEGMENTED_10
  amount: 10000000 # Giá trị tích lũy
  commands: # Các lệnh chạy cho player khi đạt mốc
    - 'say Donate của server đã đạt 10 triệu!'

- type: week # Mốc nạp tuần (tính năng premium)
  bossbar-color: GREEN
  bossbar-style: SEGMENTED_10
  amount: 1000000
  commands:
    - 'say Tuần này donate của server đã đạt 1 triệu!'

- type: month # Mốc nạp tháng (tính năng premium)
  bossbar-color: GREEN
  bossbar-style: SEGMENTED_10
  amount: 5000000
  commands:
    - 'say Tháng này donate của server đã đạt 5 triệu!'

- type: day # Mốc nạp ngày (tính năng premium)
  bossbar-color: GREEN
  bossbar-style: SEGMENTED_10
  amount: 500000
  commands:
    - 'say Hôm nay donate của server đã đạt 500k!'
```

:::
