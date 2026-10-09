---
title: Tính năng DotMan, bản miễn phí và Premium
description: 'Danh sách đầy đủ tính năng của DotMan: Nạp thẻ cào, chuyển khoản ngân hàng, khuyến mãi, mốc nạp, top nạp, quản trị. So sánh bản miễn phí và Premium.'
---

# Tính năng

Danh sách đầy đủ tính năng của DotMan, ở hai phiên bản miễn phí và Premium. Tính năng chỉ có ở bản Premium được đánh dấu <Badge type="tip" text="Premium" />.

## Nạp tiền

- **[Nạp qua chuyển khoản ngân hàng](/nap-tien/ngan-hang)** <Badge type="tip" text="Premium" />
  - Mã QR hiện ngay trên tay người chơi, plugin tự duyệt giao dịch.
  - Hỗ trợ MBBank, PayOS, SePay, Payment Service.
  - Bossbar đếm ngược thời gian chuyển khoản.
  - Lệnh thưởng theo mức nạp tối thiểu.
  - Giữ giao dịch khi người chơi thoát game, nhận lại mã QR bằng `/bank resume`.
- **[Nạp thẻ cào tự động](/nap-tien/the-cao)**
  - Giao diện chọn loại thẻ, mệnh giá. Nhập seri, mã thẻ qua Anvil hoặc khung chat.
  - Lệnh nạp nhanh `/napthe` với gợi ý tab.
  - Bật/tắt từng loại thẻ: Viettel, Mobifone, Vinaphone, Vietnamobile, Garena, Zing, Vcoin, Gate.
  - Tùy chỉnh point và lệnh thưởng theo từng mệnh giá.
- **[Hỗ trợ nhiều cổng gạch thẻ](/nap-tien/the-cao#chon-cong-gach-the)**
  - `card2k`, `thesieure`, `gamebank`.
  - `gachthe1s`, `gachthe5s` <Badge type="tip" text="Premium" />.
- **[Nạp thủ công](/nap-tien/thu-cong)**
  - Ghi nhận khoản nạp từ kênh khác, tính point theo công thức hoặc theo mệnh giá thẻ.
- **Chống spam** <Badge type="tip" text="Premium" />
  - [Cooldown](/huong-dan/cau-hinh-chung#cooldown) giữa các lần gửi thẻ, tạo giao dịch.
  - Tạm cấm gửi thẻ khi gửi thẻ lỗi 3 lần liên tiếp.

## Khuyến mãi

- **[Lịch khuyến mãi](/khuyen-mai/lich-khuyen-mai)**
  - Khuyến mãi theo ngày cố định, ví dụ các ngày lễ.
  - Khuyến mãi lặp lại theo tuần: theo thứ, theo khung giờ, hoặc kết hợp cả hai.
  - Nhiều khuyến mãi cùng lúc thì tự áp dụng khuyến mãi có tỉ lệ cao nhất.
  - Khuyến mãi nhanh trong `config.yml`, không cần lên lịch.
- **[Thông báo khuyến mãi](/khuyen-mai/thong-bao)**
  - Thông báo trên chat khi khuyến mãi bắt đầu, lặp lại định kỳ và khi kết thúc.
  - Bossbar hiện trong suốt thời gian khuyến mãi.
- **[Khuyến mãi nạp lần đầu](/khuyen-mai/nap-lan-dau)** <Badge type="tip" text="Premium" />
  - Tặng thêm giá trị và chạy lệnh thưởng cho lần nạp đầu tiên.
- **[Lệnh `/khuyenmai`](/khuyen-mai/lich-khuyen-mai#xem-danh-sach-khuyen-mai)**
  - Người chơi xem các khuyến mãi đang và sắp diễn ra.

## Mốc nạp & top nạp

- **[Mốc nạp cá nhân](/phan-thuong/moc-nap-ca-nhan)**
  - Trao thưởng khi tổng nạp của người chơi đạt mốc.
  - Mốc theo ngày, tuần, tháng, khung thời gian <Badge type="tip" text="Premium" />.
- **[Mốc nạp tổng server](/phan-thuong/moc-nap-tong)**
  - Mục tiêu nạp chung cho cả server, kèm bossbar tiến độ.
  - Mốc theo ngày, tuần, tháng, khung thời gian <Badge type="tip" text="Premium" />.
- **[Top nạp](/phan-thuong/top-nap)**
  - Top nạp toàn thời gian.
  - Top theo ngày, tuần, tháng, xem lại các kỳ trước <Badge type="tip" text="Premium" />.
  - Giao diện top nạp tùy chỉnh được bố cục <Badge type="tip" text="Premium" />.
- **[Phần thưởng top nạp](/phan-thuong/phan-thuong-top)** <Badge type="tip" text="Premium" />
  - Tự động trao thưởng cho top nạp khi kết thúc mỗi ngày, tuần, tháng.
- **[Khung thời gian](/phan-thuong/khung-thoi-gian)** <Badge type="tip" text="Premium" />
  - Theo dõi nạp riêng cho từng sự kiện như Tết, Giáng sinh để đua top và đặt mốc nạp.

## Quản trị

- **[Lịch sử và thống kê](/quan-tri/lich-su-va-thong-ke)**
  - Lịch sử nạp, lọc theo người chơi, tháng, server.
  - Tra cứu giao dịch thẻ cào theo mã giao dịch.
  - Thống kê theo phương thức nạp, lịch nạp theo ngày, lịch sử point <Badge type="tip" text="Premium" />.
- **[Lệnh `/congpoint`](/tham-khao/danh-sach-lenh-va-permission#congpoint)** <Badge type="tip" text="Premium" />
  - Cộng, trừ point kèm lý do để theo dõi lịch sử tiêu dùng.
- **[Bảo mật cấu hình](/quan-tri/bao-mat-cau-hinh)** <Badge type="tip" text="Premium" />
  - Mã hóa API key, thông tin ngân hàng lên database.
  - Khóa cổng thanh toán, chống bị đổi thông tin nhận tiền.
  - Mật khẩu xác minh cho các lệnh nhạy cảm.
- **[Lệnh thưởng khi offline](/quan-tri/lenh-thuong-offline)** <Badge type="tip" text="Premium" />
  - Lệnh thưởng phát sinh lúc người chơi offline được giữ lại và chạy khi vào lại.
- **[Tính toán point](/cong-cu/tinh-toan-point)**
  - Lệnh `/dotman testpoint` tính thử point và khuyến mãi đang áp dụng, không cộng point thật.

## Tích hợp

- **[PlaceholderAPI](/tham-khao/placeholder-api)**
  - Hiển thị tổng nạp, top nạp lên hologram, scoreboard, tab list.
  - Placeholder theo ngày, tuần, tháng, khung thời gian và tổng server <Badge type="tip" text="Premium" />.
- **[Discord Webhook](/tich-hop/discord-webhook)**
  - Thông báo nạp tiền dạng embed tới nhiều channel Discord.
- **PlayerPoints**
  - Cộng point tự động, ghi nhận cả point thay đổi bởi plugin khác <Badge type="tip" text="Premium" />.
- **Floodgate** <Badge type="tip" text="Premium" />
  - Giao diện dạng form cho người chơi Bedrock.

## Hệ thống

- **[Database](/huong-dan/cai-dat#thiet-lap-database)**
  - H2 cho server đơn lẻ.
  - MySQL/MariaDB cho network nhiều server để đồng bộ dữ liệu, bảo mật cấu hình.
- **Tương thích**
  - Spigot, Paper, Folia từ phiên bản 1.8.8 trở lên. Hỗ trợ từ Java 8 trở lên.
- **Tùy biến cao**
  - Toàn bộ tin nhắn, giao diện đều chỉnh được trong file config tương ứng.
- **Tự kiểm tra cập nhật**
  - Thông báo khi có phiên bản mới.

## Công cụ

Các công cụ giúp dễ dàng tạo khuyến mãi, mốc nạp, placeholder, Discord embed và tính toán point.

- **[Tính toán point](/cong-cu/tinh-toan-point)**: tính số point nhận được theo từng phương thức nạp.
- **[Tạo & kiểm tra lịch khuyến mãi](/cong-cu/lich-khuyen-mai)**: tạo `khuyenmai.yml` bằng form, tìm mục lỗi, xem lịch áp dụng theo tuần.
- **[Tạo placeholder](/cong-cu/tao-placeholder)**: tạo placeholder PlaceholderAPI, kể cả danh sách top cho hologram.
- **[Thiết kế Discord Embed](/cong-cu/thiet-ke-discord-embed)**: thiết kế tin nhắn trên Discohook rồi chuyển sang cấu hình Discord webhook.
- **[Tạo mốc nạp & thưởng top](/cong-cu/moc-nap-va-thuong-top)**: tạo `mocnap.yml`, `mocnaptong.yml`, `phanthuongtop.yml` bằng form.

## So sánh bản miễn phí và Premium

| Tính năng | Miễn phí | Premium |
|-----------|:--------:|:-------:|
| **Giá** | **Miễn phí** | **349.000đ** |
| [Nạp thẻ cào](/nap-tien/the-cao) qua giao diện hoặc lệnh nạp nhanh | ✅ | ✅ |
| Cổng gạch thẻ | `card2k`, `thesieure`,<br />`gamebank` | Thêm `gachthe1s`,<br />`gachthe5s` |
| [Chuyển khoản ngân hàng](/nap-tien/ngan-hang) qua mã QR | ❌ | ✅ |
| [Nạp thủ công](/nap-tien/thu-cong) | ✅ | ✅ |
| Cooldown, chặn gửi thẻ lỗi liên tục | ❌ | ✅ |
| [Lịch khuyến mãi](/khuyen-mai/lich-khuyen-mai)<br />(ngày cố định, lặp lại theo tuần) | ✅ | ✅ |
| [Thông báo khuyến mãi](/khuyen-mai/thong-bao) và lệnh `/khuyenmai` | ✅ | ✅ |
| [Khuyến mãi nạp lần đầu](/khuyen-mai/nap-lan-dau) | ❌ | ✅ |
| [Mốc nạp cá nhân](/phan-thuong/moc-nap-ca-nhan),<br />[mốc nạp tổng server](/phan-thuong/moc-nap-tong) | Toàn thời gian | Thêm ngày, tuần, tháng,<br />khung thời gian |
| [Top nạp](/phan-thuong/top-nap) | Toàn thời gian | Thêm ngày, tuần, tháng,<br />giao diện top |
| [Phần thưởng top nạp](/phan-thuong/phan-thuong-top) tự động | ❌ | ✅ |
| [Khung thời gian](/phan-thuong/khung-thoi-gian) cho sự kiện | ❌ | ✅ |
| [Lịch sử nạp](/quan-tri/lich-su-va-thong-ke), tra cứu giao dịch | ✅ | ✅ |
| Thống kê, lịch nạp theo ngày, lịch sử point | ❌ | ✅ |
| Lệnh `/congpoint` | ❌ | ✅ |
| [Bảo mật cấu hình](/quan-tri/bao-mat-cau-hinh) | ❌ | ✅ |
| [Giữ lệnh thưởng khi người chơi offline](/quan-tri/lenh-thuong-offline) | ❌ | ✅ |
| [PlaceholderAPI](/tham-khao/placeholder-api) | Top và dữ liệu<br />toàn thời gian | Thêm ngày, tuần, tháng,<br />khung thời gian, tổng server |
| [Discord Webhook](/tich-hop/discord-webhook) | ✅ | ✅ |
| Giao diện cho người chơi Bedrock (Floodgate) | ❌ | ✅ |
