---
title: "discord.yml mẫu của DotMan"
description: "File discord.yml mặc định của DotMan: thông báo nạp tiền qua Discord webhook dạng embed."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# discord.yml

Thông báo nạp tiền qua Discord webhook.

Hướng dẫn chi tiết: [Discord Webhook](/docs/tich-hop/discord-webhook).

Công cụ hỗ trợ: [Thiết kế Discord Embed](/docs/cong-cu/thiet-ke-discord-embed).

::: code-group

```yaml [discord.yml]
# Cấu hình gửi thông báo nạp tiền qua Discord Webhook
# - Có thể sử dụng placeholder sau trong content/embeds:
#   %PLAYER%, %AMOUNT%, %POINT_AMOUNT%, %POINT_UNIT%, %BALANCE%, %METHOD%, %TIME%, %SERVER%
# - Màu (color) phải là chuỗi hex dạng "#RRGGBB" (ví dụ: "#58b9ff"). Nếu sai định dạng sẽ tự chuyển về trắng "#FFFFFF".
# - Nếu đã setup sẵn username và avatar bên trong Discord (Integrations -> Webhooks), hãy bỏ trống "" mục username và avatar_url.
# Bạn có thể dùng https://discohook.org/ để thiết kế

discord-hooks:
  # Webhook cho channel thứ nhất
  - enabled: false
    url: https://discord.com/api/webhooks/123456/webhook-token
    payload:
      username: "MineVN"
      avatar_url: "https://i.imgur.com/tdZ2LxY.png"
      content:
        - "Thông báo nạp tiền thành công!"
        - "Thời gian: %TIME%"
      embeds:
        - title: "Ting ting 💸"
          description: "Xin cảm ơn bạn đã ủng hộ server!"
          color: "#58b9ff"
          author:
            name: "MineVN"
            url: "https://minevn.studio/"
            icon_url: "https://i.imgur.com/tdZ2LxY.png"
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
            - name: "Server"
              value: "%SERVER%"
              inline: true
          thumbnail:
            url: "https://i.imgur.com/tdZ2LxY.png"
          image:
            url: "https://i.imgur.com/tdZ2LxY.png"
          footer:
            text: "%TIME%"
            icon_url: "https://i.imgur.com/tdZ2LxY.png"

  # Webhook cho channel thứ hai
  - enabled: false
    url: https://discord.com/api/webhooks/123456/webhook-token
    payload:
      username: ""
      avatar_url: ""
      content:
        - "Thông báo nạp tiền thành công!"
        - "Thời gian: %TIME%"
      embeds:
        - title: "Ting ting 💸"
          description: "Xin cảm ơn bạn đã ủng hộ server!"
          color: "#58b9ff"
          author:
            name: "MineVN"
            url: "https://minevn.studio/"
            icon_url: "https://i.imgur.com/tdZ2LxY.png"
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
            - name: "Server"
              value: "%SERVER%"
              inline: true
          thumbnail:
            url: "https://i.imgur.com/tdZ2LxY.png"
          image:
            url: "https://i.imgur.com/tdZ2LxY.png"
          footer:
            text: "%TIME%"
            icon_url: "https://i.imgur.com/tdZ2LxY.png"

  # Thêm các webhook cho channel khác nếu cần
```

:::
