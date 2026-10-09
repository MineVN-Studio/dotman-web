---
title: Thiết kế Discord Embed
description: Thiết kế tin nhắn Discord trên Discohook rồi chuyển thành cấu hình discord.yml của DotMan.
---

# Thiết kế Discord Embed

Thiết kế tin nhắn trực quan trên [discohook.org](https://discohook.org/), rồi chuyển sang định dạng `discord.yml` của DotMan:

1. Trên Discohook, thiết kế tin nhắn, chèn các placeholder của DotMan vào nội dung.
2. Mở **JSON Data Editor** của tin nhắn, sao chép toàn bộ JSON.
3. Dán vào ô bên dưới, nhập URL webhook.
4. Sao chép kết quả, thay mục `discord-hooks` trong `discord.yml` rồi chạy `/dotman reload`.

Ý nghĩa từng mục xem tại [Discord Webhook](/tich-hop/discord-webhook).

<DiscordConverter />
