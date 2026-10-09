---
title: "config.yml mẫu của DotMan"
description: "File config.yml mặc định của DotMan: cấu hình chung, nạp thẻ cào, nạp thủ công, khuyến mãi nạp lần đầu và database."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# config.yml

Cấu hình chung, nạp thẻ cào, nạp thủ công, nạp lần đầu và database.

Hướng dẫn chi tiết: [Cấu hình chung](/docs/huong-dan/cau-hinh-chung).

::: code-group

```yaml [config.yml]
prefix: '&6&lDotMan >&r'

# Tên server để ghi log
# Đây là server ID để ghi nhận lịch sử nạp, đua top và mốc nạp
# Tên server chỉ chấp nhận chữ viết thường, chữ số và dấu gạch dưới
# Ví dụ: server_1, server_2, server_3
server: 'server'

# Tên đơn vị tiền tệ
point-unit: 'xu'

# API gạch thẻ sử dụng
# Hỗ trợ các API sau: card2k, thesieure, gamebank
# MineVN khuyên dùng: card2k
# Lưu ý: Sau khi chạy /dotman configdb, provider sẽ được khóa trên database và mục này sẽ bị bỏ qua.
# Muốn đổi provider (ví dụ sang thesieure):
#   1. Sửa mục này thành thesieure rồi /dotman reload (plugin vẫn chạy provider cũ, nhưng file providers/thesieure.yml sẽ được tạo)
#   2. Điền đầy đủ thông tin vào providers/thesieure.yml
#   3. Chạy /dotman configdb <mật khẩu xác minh> rồi /dotman reload
provider: card2k

# Lượng points được cộng ứng với giá trị nạp
donate-amounts:
  10000: 10
  20000: 20
  30000: 30
  50000: 50
  100000: 100
  200000: 200
  300000: 300
  500000: 500
  1000000: 1000

# Lệnh thực thi tương ứng với giá trị nạp
donate-commands:
  10000:
    - 'tell %PLAYER% Bạn vừa nạp %CARD_TYPE% %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  20000:
    - 'tell %PLAYER% Bạn vừa nạp %CARD_TYPE% %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  50000:
    - 'tell %PLAYER% Bạn vừa nạp %CARD_TYPE% %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  100000:
    - 'tell %PLAYER% Bạn vừa nạp %CARD_TYPE% %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  200000:
    - 'tell %PLAYER% Bạn vừa nạp %CARD_TYPE% %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  500000:
    - 'tell %PLAYER% Bạn vừa nạp  %CARD_TYPE% %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  1000000:
    - 'tell %PLAYER% Bạn vừa nạp %CARD_TYPE% %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'

# Công thức tính cho lệnh nạp thủ công
manual:
  # Số point tiêu chuẩn trên mỗi 1000 VNĐ
  # Đây là số point dùng để tính toán khuyến mãi
  # Mặc định: 1000 VNĐ = 1 point
  point-base: 1

  # Số point được nhận thêm trên mõi 1000 VNĐ khi nạp qua lệnh nạp thủ công
  # Mặc định: 1000 VNĐ = 0.5 point
  point-extra: 0.5
  # Công thức tính khi nạp qua lệnh nạp thủ công:
  # - Số point nhận được = Số point tiêu chuẩn + Số point được nhận thêm + (Số point tiêu chuẩn × Khuyến mãi)
  # Trong đó khuyến mãi là giá trị khuyến mãi được định nghĩa trong config.yml
  # Ví dụ: Nếu bạn đặt point tiêu chuẩn và nhận thêm là mặc định (1 và 0.5) và bạn đang bật khuyến mãi 50% (GTKM 0.5) thì:
  # - Số point nhận được = 1 + 0.5 + (1 × 0.5) = 2 point

  # Các lệnh thực thi sau khi nạp
  commands:
    - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'

# Phần thưởng nạp lần đầu
# Áp dụng khi người chơi nạp lần đầu tiên trên server này
first-donate:
  enabled: false

  # Tỉ lệ khuyến mãi được cộng thêm khi nạp lần đầu
  # Tham khảo công thức tính "rate" tại file: khuyenmai.yml
  extra-rate: 1.0

  # Lệnh thực thi khi người chơi nạp lần đầu
  # Placeholders: %PLAYER%, %AMOUNT%, %POINT%, %POINT_UNIT%, %EXTRA_RATE% (phần trăm)
  commands:
    - 'tell %PLAYER% Bạn vừa nạp lần đầu và nhận được %POINT% %POINT_UNIT% (khuyến mãi %EXTRA_RATE%% giá trị nạp lần đầu)!'

# Cooldown cho các hành động liên quan đến giao dịch
cooldown:
  # Giữa các lần tạo giao dịch ngân hàng/nạp thẻ
  transaction: 60
  # Thời gian cấm nạp thẻ cào nếu thẻ lỗi 3 lần liên tiếp
  card-submit: 300

# Giá trị khuyến mãi
# 0: Không có khuyến mãi
# 0.5: Khuyến mãi 50%, ví dụ: nạp 100k được 150k
# 1: Khuyến mãi 100%, ví dụ: nạp 100k được 200k
# 1.5: Khuyến mãi 150%, ví dụ: nạp 100k được 250k
extra-rate: 0

# Thời gian kết thúc khuyến mãi
# Định dạng: dd/MM/yyyy HH:mm:ss hoặc dd/MM/yyyy HH:mm
# Khuyến mãi dừng đúng tại thời điểm này: 23:59 = dừng lúc 23:59:00, muốn trọn ngày thì dùng 23:59:59
extra-until: 06/09/2023 17:00

# Các loại thẻ được chấp nhận
card-types:
  viettel: true
  mobifone: true
  vinaphone: true
  vietnammobile: true
  garena: true
  zing: false
  vcoin: true
  gate: false

database:
  # Loại cơ sở dữ liệu
  # Các engine hỗ trợ: h2, mysql, mariadb
  # mặc định là h2 (lưu vào 1 file)
  engine: h2
  h2:
    file: dotman
  mysql:
    host: localhost
    port: 3306
    user: 'root'
    password: '123'
    database: dotman

# Bật/tắt tính năng thông báo người chơi khác khi nạp thẻ thành công
announce-charge: true

# Bật/tắt tính năng kiểm tra cập nhật phiên bản mới
check-update: true

# Bật/tắt tính năng nhập số seri, mã thẻ qua anvil gui
use-anvilgui: true

# Mã license của bạn
# Liên hệ MineVN Studio để được cấp license nhé!
license: 'your_license_here'
```

:::
