---
title: "mocnap.yml mẫu của DotMan"
description: "File mocnap.yml mặc định của DotMan: mốc nạp cá nhân, thưởng khi tổng nạp của người chơi đạt mốc."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# mocnap.yml

Mốc nạp cá nhân.

Hướng dẫn chi tiết: [Mốc nạp cá nhân](/phan-thuong/moc-nap-ca-nhan).

Công cụ hỗ trợ: [Tạo mốc nạp & thưởng top](/cong-cu/moc-nap-va-thuong-top).

::: code-group

```yaml [mocnap.yml]
# Phần thưởng nạp thẻ theo mốc
mocnap:
- type: all # Toàn thời gian
  amount: 5000000 # Giá trị tích lũy
  commands: # Các lệnh chạy cho player khi đạt mốc
    - 'tell %player% Chúc mừng bạn đã đạt mốc 5 triệu tích lũy'
    - 'give %player% emerald 1'

- type: week # Hằng tuần (tính năng premium)
  amount: 200000
  commands:
    - 'tell %player% Chúc mừng bạn đã đạt mốc 200k tích lũy (hằng tuần)'
    - 'give %player% emerald 1'

- type: month # Hằng tháng (tính năng premium)
  amount: 1000000
  commands:
    - 'tell %player% Chúc mừng bạn đã đạt mốc 1 triệu tích lũy (hằng tháng)'
    - 'give %player% emerald 1'

- type: day # Hằng ngày (tính năng premium)
  amount: 500000
  commands:
    - 'tell %player% Chúc mừng bạn đã đạt mốc 500k tích lũy (hằng ngày)'
    - 'give %player% emerald 1'
```

:::
