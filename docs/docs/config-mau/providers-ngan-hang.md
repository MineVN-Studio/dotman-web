---
title: "File mẫu cổng ngân hàng của DotMan"
description: "File cấu hình mẫu của từng cổng ngân hàng trong DotMan Premium: MBBank, PayOS, SePay và Payment Service."
---

<!-- File này được sinh tự động bởi scripts/sync-config-mau.mjs, không sửa tay -->

# providers/banking/*.yml <Badge type="tip" text="Premium" />

Cấu hình riêng của từng cổng thanh toán ngân hàng.

Hướng dẫn chi tiết: [Cổng thanh toán ngân hàng](/docs/nap-tien/ngan-hang#cong-thanh-toan-ngan-hang).

::: code-group

```yaml [providers/banking/mbbank.yml]
# ============================================
# Đăng nhập trực tiếp ngân hàng MBBank
# Lưu ý: Cần tắt 2FA
# MINEVN CAM KẾT KHÔNG LƯU TRỮ, KHÔNG PHÁT TÁN THÔNG TIN ĐĂNG NHẬP
# ============================================

# Số tài khoản để tra cứu lịch sử giao dịch
account: '0123456789'

# Số tài khoản để hướng dẫn người chơi chuyển khoản tạo mã QR code
# Có thể dùng nickname, nếu không có nickname thì hãy để giống account
account-qr: 'nickname'

# Tên chủ tài khoản (viết hoa, không dấu)
account-name: 'NGUYEN VAN A'

# Số tiền nạp tối thiểu (VNĐ)
min-amount: 10000

# Tài khoản và mật khẩu MBBank
# Lưu ý: Tài khoản của bạn cần đăng nhập được vào trang web sau:
# https://online.mbbank.com.vn/
username: "username"
password: "password"
```

```yaml [providers/banking/payos.yml]
# ============================================
# PayOS
# ============================================

# Ngân hàng hỗ trợ: MBBANK, BIDV, ACB, OCB, KLB
bank: MBBANK

# PayOS OpenAPI: Nhập đầy đủ các thông tin bên dưới (account, account-qr, account-name)
# PayOS VietQR Pro: Chỉ nhập tên tài khoản (account-name), số tài khoản (account & account-qr) sẽ do hệ thống tự động tạo
#   account & account-qr có thể để nguyên giá trị mẫu, hoặc để trống ('') đều được

# Số tài khoản để tra cứu lịch sử giao dịch
account: '0123456789'

# Số tài khoản để hướng dẫn người chơi chuyển khoản tạo mã QR code
# Có thể dùng nickname, nếu không có nickname thì hãy để giống account
account-qr: 'nickname'

# Tên chủ tài khoản (viết hoa, không dấu)
account-name: 'NGUYEN VAN A'

# Số tiền nạp tối thiểu (VNĐ)
min-amount: 10000

# Lấy thông tin tại: my.payos.vn -> Kênh thanh toán -> Thông tin kênh thanh toán
client-id: "client-id"
api-key: "api-key"
checksum-key: "checksum-key"

# URL chuyển hướng khi giao dịch hoàn tất/hủy
url-success: 'https://minevn.net'
url-cancel: 'https://minevn.net'
```

```yaml [providers/banking/sepay.yml]
# ============================================
# SePay
# Lưu ý: Mọi thông tin phải trùng khớp với thông tin đăng ký tại SePay
# ============================================

# Ngân hàng hỗ trợ: VCB, STB, TPB, VPB, ICB, ACB, BIDV, MB, OCB, KLB, MSB
bank: MB

# Số tài khoản để tra cứu lịch sử giao dịch
account: '0123456789'

# Số tài khoản để hướng dẫn người chơi chuyển khoản tạo mã QR code
# Có thể dùng nickname, nếu không có nickname thì hãy để giống account
account-qr: 'nickname'

# Tên chủ tài khoản (viết hoa, không dấu)
account-name: 'NGUYEN VAN A'

# Số tiền nạp tối thiểu (VNĐ)
min-amount: 10000

# Lấy thông tin tại: https://my.sepay.vn/companyapi
api-token: 'api-token'
```

```yaml [providers/banking/payment-service.yml]
# ============================================
# Payment Service
# Chi tiết liên hệ MineVN Studio để được hướng dẫn
# ============================================

# Ngân hàng sử dụng
bank: MBBANK

# Số tài khoản để tra cứu lịch sử giao dịch
account: '0123456789'

# Số tài khoản để hướng dẫn người chơi chuyển khoản tạo mã QR code
# Có thể dùng nickname, nếu không có nickname thì hãy để giống account
account-qr: 'nickname'

# Tên chủ tài khoản (viết hoa, không dấu)
account-name: 'NGUYEN VAN A'

# Số tiền nạp tối thiểu (VNĐ)
min-amount: 10000

# Endpoint payment-service
url: 'http://localhost:3000/payments'
```

:::
