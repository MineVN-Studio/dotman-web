---
title: Cấu hình chung config.yml của DotMan
description: 'Các tùy chọn chung trong config.yml của DotMan: tùy chọn cơ bản, cooldown chống spam và tin nhắn trong messages.yml.'
---

# Cấu hình chung

Phần lớn cấu hình chung nằm trong `config.yml`. Sau khi sửa, dùng `/dotman reload` để áp dụng.

## Tùy chọn cơ bản

| Tùy chọn | Mô tả |
|----------|-------|
| `prefix` | Prefix của tin nhắn, dùng qua `%PREFIX%` trong `messages.yml` |
| `server` | ID server, xem [Đặt tên server](/docs/huong-dan/cai-dat#dat-ten-server) |
| `point-unit` | Tên đơn vị point hiển thị trong game,<br />ví dụ `xu`, `coin`, `gem` |
| `announce-charge` | Thông báo cho toàn server khi có người nạp thẻ thành công |
| `check-update` | Tự kiểm tra phiên bản mới. |
| `use-anvilgui` | Nhập seri, mã thẻ qua Anvil thay vì khung chat |
| `license` | License của bản Premium |
| `database` | Kết nối database, xem [Thiết lập database](/docs/huong-dan/cai-dat#thiet-lap-database) |

## Cooldown <Badge type="tip" text="Premium" />

Giới hạn tần suất tạo giao dịch để tránh spam:

```yaml [config.yml]
cooldown:
  # Giữa các lần tạo giao dịch ngân hàng/nạp thẻ (giây)
  transaction: 60
  # Thời gian cấm nạp thẻ cào nếu thẻ lỗi 3 lần liên tiếp (giây)
  card-submit: 300
```

- `transaction` áp dụng cho cả gửi thẻ cào và tạo giao dịch ngân hàng.
- Người chơi gửi thẻ lỗi 3 lần liên tiếp sẽ bị cấm gửi thẻ trong `card-submit` giây.
- Người có permission `dotman.admin` không bị giới hạn.

## Các mục khác trong config.yml

`config.yml` còn chứa cấu hình của một số tính năng, được hướng dẫn ở trang riêng:

| Mục | Hướng dẫn |
|-----|-----------|
| `provider`, `card-types`,<br />`donate-amounts`, `donate-commands` | [Nạp thẻ cào](/docs/nap-tien/the-cao) |
| `manual` | [Nạp thủ công](/docs/nap-tien/thu-cong) |
| `first-donate` | [Khuyến mãi nạp lần đầu](/docs/khuyen-mai/nap-lan-dau) |
| `extra-rate`, `extra-until` | [Khuyến mãi nhanh trong config.yml](/docs/khuyen-mai/lich-khuyen-mai#khuyen-mai-nhanh-trong-config-yml) |

Toàn bộ nội dung mặc định xem tại [Config mẫu: config.yml](/docs/config-mau/config-yml).

## Tin nhắn (messages.yml)

Mọi tin nhắn plugin gửi cho người chơi nằm trong `messages.yml`.

- Hỗ trợ mã màu Minecraft dạng `&a`, `&l`...
- `%PREFIX%` được thay bằng giá trị `prefix` trong `config.yml`.
- Nếu xóa một mục khỏi file, plugin dùng nội dung mặc định có sẵn trong plugin.

Toàn bộ tin nhắn mặc định xem tại [Config mẫu: messages.yml](/docs/config-mau/messages-yml).
