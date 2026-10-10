---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: DotMan - Donation Manager
description: Giải pháp quản lý dòng tiền cho server Minecraft Việt Nam, dễ dàng tích hợp các cổng thanh toán thẻ cào và ngân hàng. Với các tính năng quản trị, thống kê, lịch sử giao dịch và khuyến mãi.
titleTemplate: false

hero:
  name: DotMan
  text: Donation Manager
  tagline: Giải pháp quản lý dòng tiền cho server Minecraft Việt Nam, dễ dàng tích hợp các cổng thanh toán thẻ cào và ngân hàng. Với các tính năng quản trị, thống kê, lịch sử giao dịch và khuyến mãi.
  image:
    src: /dotman.png
    alt: DotMan
  actions:
    - theme: brand
      text: Bắt đầu ngay
      link: /docs
    - theme: alt
      text: Khám phá tính năng
      link: /docs/huong-dan/tinh-nang
    - theme: alt
      text: Dùng thử Premium
      link: '#dung-thu'


features:
  - icon: 💳
    title: Nạp thẻ cào
    details: Kết nối nhiều cổng gạch thẻ, hỗ trợ đầy đủ các nhà mạng, tùy chỉnh point và lệnh thưởng theo mệnh giá.
    link: /docs/nap-tien/the-cao
  - icon: 🏦
    title: Nạp qua ngân hàng <span class="home-badge">Premium</span>
    details: Mã QR hiện ngay trong game, plugin tự duyệt giao dịch, không cần admin xử lý thủ công.
    link: /docs/nap-tien/ngan-hang
  - icon: 🎉
    title: Lịch khuyến mãi
    details: Hẹn lịch theo ngày lễ hoặc khung giờ hằng tuần, nhiều khuyến mãi trùng nhau thì tự lấy tỉ lệ cao nhất.
    link: /docs/khuyen-mai/lich-khuyen-mai
  - icon: 🎯
    title: Mốc nạp
    details: Thưởng khi người chơi đạt mốc cá nhân, hoặc cả server cùng góp cho một mục tiêu chung kèm bossbar tiến độ.
    link: /docs/phan-thuong/moc-nap-ca-nhan
  - icon: 🏆
    title: Top nạp & phần thưởng
    details: Bảng xếp hạng người nạp nhiều nhất. Bản Premium tự trao thưởng khi hết ngày, tuần, tháng.
    link: /docs/phan-thuong/top-nap
  - icon: 🗓️
    title: Khung thời gian sự kiện <span class="home-badge">Premium</span>
    details: Đua top và đặt mốc nạp riêng cho từng sự kiện như Tết, Giáng sinh.
    link: /docs/phan-thuong/khung-thoi-gian
  - icon: 📊
    title: Lịch sử & thống kê
    details: Tra cứu lịch sử nạp, lọc theo người chơi, tháng, server. Bản Premium thêm thống kê theo phương thức nạp.
    link: /docs/quan-tri/lich-su-va-thong-ke
  - icon: 🔐
    title: Bảo mật cấu hình <span class="home-badge">Premium</span>
    details: Mã hóa API key, thông tin ngân hàng và chống ăn chặn dòng tiền trái phép.
    link: /docs/quan-tri/bao-mat-cau-hinh
  - icon: 🔔
    title: Discord Webhook
    details: Gửi thông báo nạp tiền dạng embed tới nhiều channel Discord.
    link: /docs/tich-hop/discord-webhook
  - icon: 🧩
    title: PlaceholderAPI
    details: Hiển thị tổng nạp, bảng top lên hologram, scoreboard, tab list.
    link: /docs/tham-khao/placeholder-api
  - icon: 🌐
    title: Sẵn sàng cho network lớn
    details: H2 cho server đơn lẻ, MySQL/MariaDB để đồng bộ dữ liệu giữa nhiều server.
    link: /docs/huong-dan/cai-dat#thiet-lap-database
  - icon: 📱
    title: Hỗ trợ Minecraft Bedrock <span class="home-badge">Premium</span>
    details: Giao diện dạng form dành riêng cho người chơi Bedrock.
    link: /docs/huong-dan/tinh-nang#tich-hop
---

<div class="home-section home-more">

Xem đầy đủ tính năng và so sánh giữa bản miễn phí với Premium tại [trang Tính năng](/docs/huong-dan/tinh-nang).

</div>

<HomeGateways />

<HomeQuickStart />

<HomeTools />

<HomePricing />

<HomeTrial />

<HomeStats />

<HomeFaq>

<FaqItem q="Bản miễn phí và bản Premium khác nhau thế nào?">

Bản miễn phí là mã nguồn mở trên [GitHub](https://github.com/minevn/dotman), đủ dùng cho nạp thẻ cào, nạp thủ công, lịch khuyến mãi, mốc nạp và top nạp toàn thời gian.

Bản Premium thêm chuyển khoản ngân hàng qua QR, mốc nạp và top theo ngày, tuần, tháng, phần thưởng top tự động, khung thời gian sự kiện, bảo mật cấu hình, thống kê chi tiết và giao diện cho người chơi Bedrock. Xem bảng so sánh đầy đủ tại [Tính năng](/docs/huong-dan/tinh-nang#so-sanh-ban-mien-phi-va-premium).

</FaqItem>

<FaqItem q="Tôi có thể dùng thử bản Premium không?">

Có. Chủ server chưa từng sử dụng DotMan được **dùng thử miễn phí DotMan Premium trong 14 ngày**.

Để đăng ký, tham gia [Discord MineVN Studio](https://minevn.net/studio) và mở ticket đăng ký dùng thử.

</FaqItem>

<FaqItem q="Mua bản Premium ở đâu và giá bao nhiêu?">

Bản Premium có giá **349.000đ**, mua và tải tại [Discord MineVN Studio](https://minevn.net/studio).

Sau khi mua, lấy license key bằng lệnh `/license list` của bot **@MineVN Studio**, điền vào mục `license` trong `config.yml` rồi restart server. Xem thêm tại [Cài đặt](/docs/huong-dan/cai-dat#cai-dat-dotman).

</FaqItem>

<FaqItem q="Server của tôi cần những gì để chạy DotMan?">

Cần server Spigot, Paper hoặc Folia từ phiên bản 1.8.8 trở lên, cùng bản Java phù hợp với phiên bản server.

- Bắt buộc cài thêm **MineVNLib** và **PlayerPoints**.
- **PlaceholderAPI** không bắt buộc, nhưng nên có nếu muốn hiện top nạp lên hologram, scoreboard hay tab list.
- Server 1.8 không có BossBar nên các tính năng bossbar sẽ tự tắt.

Xem chi tiết tại [Yêu cầu hệ thống](/docs/huong-dan/gioi-thieu#yeu-cau-he-thong).

</FaqItem>

<FaqItem q="DotMan hỗ trợ những cổng thanh toán nào?">

- **Thẻ cào:** Card2K, TheSieuRe, GameBank ở bản miễn phí. Bản Premium thêm GachThe1s và GachThe5s.
- **Chuyển khoản ngân hàng** (Premium): MBBank, PayOS, SePay và Payment Service.

Chủ server chọn cổng đang dùng trong file cấu hình, xem [Nạp thẻ cào](/docs/nap-tien/the-cao#chon-cong-gach-the) và [Chuyển khoản ngân hàng](/docs/nap-tien/ngan-hang).

</FaqItem>

<FaqItem q="Người chơi nạp tiền như thế nào?">

- **Thẻ cào:** gõ `/napthe`, chọn loại thẻ và mệnh giá, rồi nhập seri và mã thẻ.
- **Chuyển khoản** (Premium): gõ `/bank <số tiền>`, mã QR hiện ngay trên tay người chơi. Chuyển khoản đúng số tiền và nội dung của giao dịch, plugin tự kiểm tra rồi cộng point.
- **Kênh khác:** nếu người chơi nạp trực tiếp cho admin, admin dùng [nạp thủ công](/docs/nap-tien/thu-cong) để ghi nhận như một giao dịch bình thường.

</FaqItem>

<FaqItem q="Tiền chuyển khoản về chậm khi người chơi đã thoát game thì sao?">

Bản Premium giữ giao dịch lại khi người chơi thoát game, vào lại có thể nhận lại mã QR bằng `/bank resume`.

Các lệnh thưởng cần người chơi online như `give` hay cấp quyền cũng được giữ trong database và chạy khi người chơi vào lại server, nên không bị mất thưởng. Xem [Lệnh thưởng khi offline](/docs/quan-tri/lenh-thuong-offline).

</FaqItem>

<FaqItem q="Có dùng được cho network nhiều server không?">

Có. Server đơn lẻ dùng H2 mặc định, không cần cấu hình thêm. Network nhiều server dùng MySQL hoặc MariaDB để chia sẻ lịch sử nạp, top và mốc nạp, mỗi server đặt một tên riêng để phân biệt.

Xem cách cấu hình tại [Thiết lập database](/docs/huong-dan/cai-dat#thiet-lap-database).

</FaqItem>

<FaqItem q="Cấu hình có bị sửa trộm để đổi nơi nhận tiền không?">

Bản Premium có tính năng **bảo mật cấu hình**: mã hóa API key và thông tin ngân hàng rồi lưu lên database, khóa cổng thanh toán để sửa file cấu hình không đổi được nơi nhận tiền, và đặt mật khẩu xác minh cho các lệnh nhạy cảm. Xem [Bảo mật cấu hình](/docs/quan-tri/bao-mat-cau-hinh).

</FaqItem>

<FaqItem q="Cập nhật plugin hoặc lên phiên bản Minecraft mới thì làm thế nào?">

Thay file jar DotMan cũ bằng bản mới rồi restart server. Thông thường chỉ cần cập nhật MineVNLib là plugin chạy được trên phiên bản Minecraft mới.

Không dùng lệnh `/reload` của server hay các plugin như PlugMan. Xem [Cập nhật plugin](/docs/huong-dan/cai-dat#cap-nhat-plugin) và theo dõi thay đổi tại [Releases](/docs/releases/dotman).

</FaqItem>

<FaqItem q="Gặp lỗi hoặc cần hỗ trợ thì hỏi ở đâu?">

Ghé [Discord MineVN Studio](https://minevn.net/studio) để được hỗ trợ cài đặt và sử dụng. Với bản miễn phí, bạn cũng có thể báo lỗi trên [GitHub](https://github.com/minevn/dotman).

</FaqItem>

</HomeFaq>

<HomeOutro />
