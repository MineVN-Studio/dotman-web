---
title: "phanthuongtop.yml mẫu của DotMan Premium"
description: "File phanthuongtop.yml mặc định của DotMan Premium: phần thưởng tự động cho top nạp theo ngày, tuần, tháng."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# phanthuongtop.yml <Badge type="tip" text="Premium" />

Phần thưởng top nạp ngày, tuần, tháng.

Hướng dẫn chi tiết: [Phần thưởng top nạp](/docs/phan-thuong/phan-thuong-top).

Công cụ hỗ trợ: [Tạo mốc nạp & thưởng top](/docs/cong-cu/moc-nap-va-thuong-top).

::: code-group

```yaml [phanthuongtop.yml]
# Các lệnh trao thưởng top nạp thẻ
# %PLAYER% - Tên người chơi
# %RANK% - Hạng của người chơi
# Các số 1, 2, 3 tương đương với top 1, top 2, top 3
# 4-10 là top từ 4 đến 10
# Tối đa 100 hạng, nhiều hơn 100 thì sẽ không có tác dụng

# Phần thưởng top tháng sẽ được trao vào 0 giờ ngày 1 hàng tháng
top-thang:
  1:
    - 'tell %PLAYER% Tháng trước bạn đứng nhất top nạp thẻ.'
  2:
    - 'tell %PLAYER% Tháng trước bạn đứng thứ nhì top nạp thẻ.'
  3:
    - 'tell %PLAYER% Tháng trước bạn đứng thứ ba top nạp thẻ.'
  4-10:
    - 'tell %PLAYER% Tháng trước bạn đứng thứ %RANK% top nạp thẻ.'

# Phần thưởng top tuần sẽ được trao vào 0 giờ thứ 2 hàng tuần
top-tuan:
  1:
    - 'tell %PLAYER% Tuần vừa rồi bạn đứng nhất top nạp thẻ.'
  2:
    - 'tell %PLAYER% Tuần vừa rồi bạn đứng thứ nhì top nạp thẻ.'
  3:
    - 'tell %PLAYER% Tuần vừa rồi bạn đứng thứ ba top nạp thẻ.'
  4-10:
    - 'tell %PLAYER% Tuần vừa rồi bạn đứng thứ %RANK% top nạp thẻ.'

# Phần thưởng top tuần sẽ được trao vào 0 giờ hàng ngày
top-ngay:
  1:
    - 'tell %PLAYER% Hôm qua bạn đứng nhất top nạp thẻ.'
  2:
    - 'tell %PLAYER% Hôm qua bạn đứng thứ nhì top nạp thẻ.'
  3:
    - 'tell %PLAYER% Hôm qua bạn đứng thứ ba top nạp thẻ.'
  4-10:
    - 'tell %PLAYER% Hôm qua bạn đứng thứ %RANK% top nạp thẻ.'
```

:::
