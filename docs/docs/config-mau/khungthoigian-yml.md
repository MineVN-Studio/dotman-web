---
title: "khungthoigian.yml mẫu của DotMan Premium"
description: "File khungthoigian.yml mặc định của DotMan Premium: khung thời gian cho các sự kiện như Tết, Giáng sinh."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# khungthoigian.yml <Badge type="tip" text="Premium" />

Khung thời gian cho sự kiện.

Hướng dẫn chi tiết: [Khung thời gian](/docs/phan-thuong/khung-thoi-gian).

::: code-group

```yaml [khungthoigian.yml]
# Đây là file định nghĩa các khung thời gian, sự kiện
# Có thể sử dụng được cho: Đua top, mốc nạp, ...

# Để sử dụng trong top nạp, hãy dùng placeholder sau:
# - %DOTMAN_TOPFRAME_<ID của khung thời gian>_DONATE_TOTAL_XXX_PLAYER%: Trả về tên ngươi chơi đứng top
# - %DOTMAN_TOPFRAME_<ID của khung thời gian>_DONATE_TOTAL_XXX_VALUE%: Trả về giá trị nạp của người chơi đó
# (XXX là thứ hạng)

# Để xem người chơi đã nạp bao nhiêu tiền trong khung thời gian, hãy dùng placeholder:
# %DOTMAN_DATAFRAME_<ID của khung thời gian>_DONATE_TOTAL%

# Để sử dụng trong mốc nạp, phần type hãy ghi là frame-<ID của khung thời gian>

# ⚠️ LƯU Ý: ID của khung thời gian phải là độc nhất, tránh để trùng với ID đã tồn tại trước đây, kể cả khi đã bị xóa ở file này.

quoc-khanh-2024: # ID của khung thời gian, không được có dấu gạch dưới (_)
  name: 'Quốc khánh 2024' # Tên khung thời gian
  from: 02/09/2024 00:00 # Thời gian bắt đầu
  to: 03/09/2024 23:59 # Thời gian kết thúc

giang-sinh-2024:
  name: 'Giáng sinh 2024'
  from: 23/12/2024 00:00
  to: 30/12/2024 23:59
```

:::
