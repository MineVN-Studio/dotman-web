---
title: Discord Webhook thông báo nạp tiền
description: Gửi thông báo nạp tiền tới một hoặc nhiều channel Discord qua webhook.
---

# Discord Webhook

Gửi thông báo tới Discord mỗi khi có người nạp thành công, qua thẻ cào, chuyển khoản hoặc nạp thủ công. Có thể khai báo nhiều webhook để gửi tới nhiều channel. Cấu hình trong file `discord.yml`.

## Tạo webhook

1. Trong Discord, mở **Cài đặt kênh** → **Tích hợp** → **Webhook** → **Webhook mới**.
2. Sao chép URL webhook.
3. Dán vào mục `url` trong `discord.yml`, đặt `enabled: true` rồi chạy `/dotman reload`.

## Cấu hình webhook

Mỗi webhook trong danh sách `discord-hooks` có cấu trúc sau:

| Thông tin | Mô tả |
|-----------|-------|
| `enabled` | Bật/tắt webhook này.<br />Không khai báo thì coi như **tắt**. |
| `url` | URL của Discord webhook |
| `payload.username` | Tên hiển thị của bot.<br />Để trống `""` để dùng tên đã đặt trong Discord. |
| `payload.avatar_url` | Avatar của bot.<br />Để trống `""` để dùng avatar đã đặt trong Discord. |
| `payload.content` | Danh sách dòng chữ thường (không phải embed) |
| `payload.embeds` | Danh sách embed |

## Cấu trúc embed

| Thông tin | Mô tả |
|-----------|-------|
| `title` | Tiêu đề embed |
| `description` | Mô tả embed |
| `color` | Màu viền, dạng hex `"#RRGGBB"`.<br />Sai định dạng sẽ tự chuyển về `#FFFFFF`. |
| `author.name` | Tên tác giả |
| `author.url` | Link khi bấm vào tên tác giả |
| `author.icon_url` | Icon tác giả |
| `fields[].name` | Tên field |
| `fields[].value` | Giá trị field |
| `fields[].inline` | Hiển thị inline (`true`/`false`) |
| `thumbnail.url` | Ảnh nhỏ góc phải |
| `image.url` | Ảnh lớn phía dưới |
| `footer.text` | Chữ ở footer |
| `footer.icon_url` | Icon footer |

::: tip Thiết kế embed trực quan
Không cần tự viết YAML: dùng công cụ [Thiết kế Discord Embed](/docs/cong-cu/thiet-ke-discord-embed) để thiết kế tin nhắn trực quan rồi chuyển thẳng sang cấu hình của DotMan.
:::

## Placeholder

Dùng được trong `content` và `embeds`:

| Placeholder | Mô tả |
|-------------|-------|
| `%PLAYER%` | Tên người chơi |
| `%AMOUNT%` | Số tiền nạp (VNĐ) |
| `%POINT_AMOUNT%` | Số point nhận được |
| `%POINT_UNIT%` | Đơn vị point |
| `%BALANCE%` | Số point người chơi có sau khi nạp |
| `%METHOD%` | Phương thức nạp: `Thẻ cào`, `Ngân hàng` hoặc `Thủ công` |
| `%TIME%` | Thời gian giao dịch, dạng `HH:mm:ss dd/MM/yyyy` |
| `%SERVER%` | Tên server |

## Ví dụ

```yaml [discord.yml]
discord-hooks:
  - enabled: true
    url: https://discord.com/api/webhooks/123456/webhook-token
    payload:
      username: "MineVN"
      avatar_url: "https://i.imgur.com/tdZ2LxY.png"
      content:
        - "Thông báo nạp tiền thành công!"
      embeds:
        - title: "Ting ting 💸"
          description: "Xin cảm ơn bạn đã ủng hộ server!"
          color: "#58b9ff"
          fields:
            - name: "Người chơi"
              value: "%PLAYER%"
              inline: true
            - name: "Số tiền"
              value: "%AMOUNT% VNĐ"
              inline: true
            - name: "Thực nhận"
              value: "%POINT_AMOUNT% %POINT_UNIT% (đang có %BALANCE% %POINT_UNIT%)"
              inline: true
            - name: "Phương thức"
              value: "%METHOD%"
              inline: true
          footer:
            text: "%TIME% - %SERVER%"

  # Webhook thứ hai, dùng tên và avatar đã đặt trong Discord
  - enabled: true
    url: https://discord.com/api/webhooks/654321/webhook-token
    payload:
      username: ""
      avatar_url: ""
      content:
        - "%PLAYER% vừa nạp %AMOUNT% VNĐ qua %METHOD%"
```

Nội dung mặc định xem tại [Config mẫu: discord.yml](/docs/config-mau/discord-yml).
