---
title: Tạo khung thời gian
description: 'Tạo khungthoigian.yml cho DotMan Premium: khung thời gian sự kiện như Tết, Giáng sinh để đua top và đặt mốc nạp riêng.'
---

# Tạo khung thời gian <Badge type="tip" text="Premium" />

Khung thời gian là một sự kiện có thời gian bắt đầu và kết thúc riêng, ví dụ Tết, Giáng sinh. Tổng nạp trong khung được theo dõi riêng để:

- Đua top theo sự kiện, hiển thị bằng placeholder.
- Đặt mốc nạp cá nhân, mốc nạp tổng chỉ tính trong sự kiện.

Chọn tên và thời gian để tạo `khungthoigian.yml`:

- ID được tạo từ tên nếu để trống, ví dụ `Giáng sinh 2026` thành `giang-sinh-2026`.
- Công cụ kiểm tra ID sai quy tắc, ID trùng, thời gian không hợp lệ, và vẽ dòng thời gian của các sự kiện.
- Sau khi tạo, chọn một khung để lấy sẵn placeholder và mẫu mốc nạp theo khung đó.

Giải thích chi tiết xem tại [Khung thời gian](/docs/phan-thuong/khung-thoi-gian).

<FrameBuilder />

::: warning Không dùng lại ID cũ
Dữ liệu nạp được lưu theo ID. Dùng lại ID của sự kiện đã xóa sẽ bị lẫn dữ liệu của sự kiện trước, nên luôn kèm năm vào ID.
:::
