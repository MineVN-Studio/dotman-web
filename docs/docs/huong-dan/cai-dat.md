---
title: Cài đặt DotMan lên server Minecraft
description: 'Hướng dẫn cài đặt DotMan: tải plugin cùng MineVNLib và PlayerPoints, nhập license, đặt tên server, chọn database H2 hoặc MySQL.'
---

# Cài đặt

Hướng dẫn cài DotMan lên server mới: Tải plugin và các plugin phụ thuộc, nhập license, đặt tên server và chọn database. Làm xong trang này, plugin đã sẵn sàng để bạn thiết lập [nạp thẻ cào](/docs/nap-tien/the-cao) và [chuyển khoản ngân hàng](/docs/nap-tien/ngan-hang).

## Tải plugin

| Phiên bản | Link tải |
|-----------|----------|
| Miễn phí | [Releases: DotMan](/docs/releases/dotman) |
| Premium | Tại [Discord MineVN Studio](https://minevn.net/studio).<br />Chủ server chưa từng dùng DotMan được dùng thử miễn phí 14 ngày, mở ticket tại Discord để đăng ký. |

DotMan cần các plugin sau để hoạt động: [Yêu cầu hệ thống](/docs#yeu-cau-he-thong):

- [MineVNLib](/docs/releases/minevnlib), xem [cách chọn bản jar](#chon-ban-minevnlib) bên dưới.
- [PlayerPoints](https://www.spigotmc.org/resources/playerpoints.80745/).
- [PlaceholderAPI](https://www.spigotmc.org/resources/placeholderapi.6245/) (khuyến nghị).

### Chọn bản MineVNLib

Mỗi phiên bản MineVNLib có 2 file jar:

| File | Khác biệt |
|------|-----------|
| `MineVNLib-<phiên bản>.jar` | Bản thường, đã kèm sẵn thư viện Kotlin |
| `MineVNLib-no-kotlin-<phiên bản>.jar` | Không kèm thư viện Kotlin, nhẹ hơn |

- **Nên dùng bản thường.** Nếu không chắc, hãy chọn bản này.
- Chỉ dùng bản `no-kotlin` khi server đã có plugin khác cung cấp sẵn thư viện Kotlin.
  - Ví dụ: gặp lỗi xung đột Kotlin (`NoSuchMethodError`, `LinkageError` liên quan tới `kotlin.*`) khi dùng bản thường.
- Chỉ cài **một** trong hai file, không cài cả hai.

## Cài đặt DotMan

1. Chép `DotMan.jar`, file jar MineVNLib và các plugin phụ thuộc vào thư mục `plugins`.
2. Khởi động server để plugin tạo các file cấu hình.
3. Với bản Premium, lần khởi động đầu sẽ báo thiếu license key:
   - Lấy key tại Discord MineVN Studio bằng lệnh `/license list` của bot [**@MineVN Studio**](<https://discord.com/users/840454754357215233>).
   - Điền key vào `config.yml` rồi restart server.

```yaml [config.yml]
license: 'your_license_here'
```

## Đặt tên server

Tên server là ID dùng để ghi lịch sử nạp, tính top nạp và mốc nạp.

- Chỉ dùng chữ thường, chữ số và dấu gạch dưới.
  - Ví dụ: `survival`, `skyblock`, `minevn_1`.
- Mỗi server trong network phải có tên riêng, không trùng nhau.

```yaml [config.yml]
server: 'survival'
```

::: warning Lưu ý
Đổi tên server sau khi đã có dữ liệu sẽ khiến lịch sử, top nạp và mốc nạp của tên cũ không còn được tính cho server này.
:::

## Thiết lập database

DotMan hỗ trợ các loại database sau:

| `engine` | Phù hợp với |
|----------|-------------|
| `h2` (mặc định) | Server đơn lẻ.<br />Lưu vào một file, không cần cấu hình thêm. |
| `mysql`, `mariadb` | Network nhiều server cần dùng chung dữ liệu. |

Với MySQL/MariaDB, hãy điền thông tin kết nối:

```yaml [config.yml]
database:
  engine: mysql # h2, mysql hoặc mariadb
  h2:
    file: dotman
  mysql:
    host: localhost
    port: 3306
    user: 'user_của_bạn'
    password: 'mật_khẩu_của_bạn'
    database: dotman
```

## Cập nhật plugin

1. Xem thay đổi của bản mới tại [Releases: DotMan](/docs/releases/dotman).
2. Cập nhật luôn MineVNLib lên bản mới nhất tại [Releases: MineVNLib](/docs/releases/minevnlib), thông thường chỉ cần cập nhật MineVNLib là có thể hoạt động trên phiên bản Minecraft mới.
3. Thay file jar cũ trong thư mục `plugins` bằng file mới rồi restart server.

::: warning Lưu ý
Không dùng lệnh `/reload` của server và các plugin như PlugMan để load/unload plugin.
:::

## Bước tiếp theo

- Xem các tùy chọn khác trong [Cấu hình chung](/docs/huong-dan/cau-hinh-chung).
- Thiết lập cổng [nạp thẻ cào](/docs/nap-tien/the-cao).
- Thiết lập [chuyển khoản ngân hàng](/docs/nap-tien/ngan-hang) <Badge type="tip" text="Premium" />.
- Sau khi có đủ API key và thông tin ngân hàng, hãy [bảo mật cấu hình](/docs/quan-tri/bao-mat-cau-hinh) <Badge type="tip" text="Premium" />.
