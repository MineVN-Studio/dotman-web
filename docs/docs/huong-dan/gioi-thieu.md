---
title: Giới thiệu DotMan
description: 'Giới thiệu DotMan (Donation Manager): Plugin quản lý dòng tiền cho server Minecraft Việt Nam, tích hợp cổng thẻ cào và ngân hàng, khuyến mãi, mốc nạp, top nạp.'
---

# Giới thiệu DotMan

**DotMan (Donation Manager)** là giải pháp quản lý dòng tiền cho server Minecraft Việt Nam, cho phép chủ server dễ dàng tích hợp các cổng thanh toán thẻ cào và ngân hàng. Đi kèm với các tính năng quản trị, thống kê, lịch sử giao dịch và khuyến mãi.

## Bản miễn phí và Premium

DotMan có 2 phiên bản:

- **Miễn phí:** Mã nguồn mở trên [GitHub](https://github.com/minevn/dotman).
- **Premium:** Bổ sung nhiều tính năng nâng cao, tập trung hướng đến các network lớn, đồng bộ dữ liệu giữa các server, bảo mật cấu hình và hỗ trợ nhiều cổng thanh toán hơn.
- Các trang tính năng chỉ có ở bản Premium được đánh dấu <Badge type="tip" text="Premium" />.
- Danh sách đầy đủ tính năng và bảng so sánh 2 phiên bản xem tại [Tính năng](/docs/huong-dan/tinh-nang).

## Yêu cầu hệ thống

- Server Spigot, Paper hoặc Folia từ phiên bản 1.8.8 trở lên.
  - Server 1.8 không có BossBar, các tính năng bossbar sẽ tự tắt.
- Java phù hợp với phiên bản server.

| Plugin | Bắt buộc | Ghi chú |
|--------|:--------:|---------|
| [MineVNLib](/docs/releases/minevnlib) | ✅ | Thư viện của plugin, xem [cách chọn bản jar](/docs/huong-dan/cai-dat#chon-ban-minevnlib) |
| [PlayerPoints](https://www.spigotmc.org/resources/playerpoints.80745/) | ✅ | Dùng để cộng point cho người chơi |
| [PlaceholderAPI](https://www.spigotmc.org/resources/placeholderapi.6245/) | Khuyến nghị | Cần nếu muốn dùng [placeholder](/docs/tham-khao/placeholder-api) |
| [Floodgate](https://geysermc.org/download#floodgate) | Không | Bản Premium hiện giao diện dạng form cho người chơi Bedrock |

## Cấu trúc thư mục

Sau lần khởi động đầu tiên, thư mục `plugins/DotMan` có dạng:

```
DotMan/
├── config.yml          # Cấu hình chung, nạp thẻ cào, nạp thủ công
├── messages.yml        # Tin nhắn
├── khuyenmai.yml       # Lịch khuyến mãi và thông báo khuyến mãi
├── mocnap.yml          # Mốc nạp cá nhân
├── mocnaptong.yml      # Mốc nạp tổng server
├── discord.yml         # Discord webhook
├── banking.yml         # Chuyển khoản ngân hàng (Premium)
├── khungthoigian.yml   # Khung thời gian (Premium)
├── phanthuongtop.yml   # Phần thưởng top nạp (Premium)
├── qr.yml              # Dữ liệu nội bộ của mã QR, không cần sửa (Premium)
├── menu/
│   ├── napthe/
│   │   ├── loaithe.yml # Giao diện chọn loại thẻ
│   │   └── menhgia.yml # Giao diện chọn mệnh giá
│   └── top.yml         # Giao diện top nạp (Premium)
└── providers/
    ├── <cổng gạch thẻ>.yml    # API key của cổng gạch thẻ đang dùng
    └── banking/
        └── <provider>.yml     # Cấu hình cổng ngân hàng đang dùng (Premium)
```

- File trong `providers/` chỉ được tạo khi bạn chọn cổng tương ứng.
- Nội dung mặc định của từng file xem tại mục [Config mẫu](/docs/config-mau/config-yml).
