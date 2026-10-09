---
title: "banking.yml mẫu của DotMan Premium"
description: "File banking.yml mặc định của DotMan Premium: cấu hình chung cho chuyển khoản ngân hàng qua mã QR."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# banking.yml <Badge type="tip" text="Premium" />

Cấu hình chung cho chuyển khoản ngân hàng.

Hướng dẫn chi tiết: [Chuyển khoản ngân hàng](/docs/nap-tien/ngan-hang).

Công cụ hỗ trợ: [Tính toán point](/docs/cong-cu/tinh-toan-point).

::: code-group

```yaml [banking.yml]
# ============================================
# CẤU HÌNH CHUNG
# ============================================

# Bật/tắt tự động duyệt ngân hàng
enabled: false

# Provider ngân hàng sử dụng
# Hỗ trợ: MBBANK, PAYOS, SEPAY, PAYMENT-SERVICE
# Sau khi thiết lập và reload, file config mới sẽ được tạo ở thư mục providers/banking
# Ví dụ: MBBANK sẽ tạo file provider/banking/mbbank.yml
# Bạn sẽ cần tiếp tục thiết lập thông tin API, hoặc thông tin đăng nhập ngân hàng tại file tương ứng.
# Lưu ý: Sau khi chạy /dotman configdb, provider sẽ được khóa trên database và mục này sẽ bị bỏ qua.
# Muốn đổi provider (ví dụ sang SEPAY):
#   1. Sửa mục này thành SEPAY rồi /dotman reload (plugin vẫn chạy provider cũ, nhưng file providers/banking/sepay.yml sẽ được tạo)
#   2. Điền đầy đủ thông tin vào providers/banking/sepay.yml
#   3. Chạy /dotman configdb <mật khẩu xác minh> rồi /dotman reload
provider: MBBANK

# Thời gian quét lịch sử giao dịch (giây)
interval: 5

# Thời gian hết hạn giao dịch (giây)
transaction-expiry: 600

# BossBar đếm ngược thời gian chuyển khoản
bossbar:
  enabled: true
  title: '&aThời gian chuyển khoản: &e%TIME%'

# ============================================
# TÍNH TOÁN POINT VÀ LỆNH THỰC THI
# ============================================

# Công thức: point = (amount/1000) * [(point-base + point-extra) + (point-base * khuyến mãi)]
# Ví dụ: Nếu bạn đặt point tiêu chuẩn và nhận thêm là mặc định (1 và 0.5) và đang bật khuyến mãi 50% (GTKM 0.5) thì:
# 10000đ = (10 + 5) + (10 * 0.5) = 20 point

# Số point tiêu chuẩn trên mỗi 1000 VNĐ
point-base: 1

# Số point được nhận thêm khi nạp qua ngân hàng
point-extra: 0.5

# Lệnh thực thi sau khi nạp thành công
commands:
  - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'

# Lệnh thực thi theo mốc nạp (hệ thống chọn mốc gần nhất)
# Ví dụ: Nạp 17000 VNĐ -> chọn mốc 12000
minimum-donate-commands:
  12000:
    - 'tell %PLAYER% Bạn vừa nạp 12k VNĐ, rất troll!'
  10000:
    - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  20000:
    - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  50000:
    - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  100000:
    - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  200000:
    - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  500000:
    - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  1000000:
    - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'

# ============================================
# CẤU HÌNH NÂNG CAO
# ============================================

# Proxy (dùng khi không kết nối được trực tiếp đến ngân hàng)
proxy:
  enabled: false
  use-socks: false
  host: '127.0.0.1'
  port: 1080

# Phiên bản cấu trúc config banking
# Không thay đổi mục này nếu không biết
# 1 = cấu trúc cũ trong banking.yml, 2 = provider config tách riêng trong providers/banking/*.yml
config-version: 2
```

:::
