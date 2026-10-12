---
title: Tạo cấu hình ngân hàng
description: 'Tạo banking.yml và file cổng ngân hàng MBBank, PayOS, SePay, Payment Service cho DotMan Premium, hoặc chuyển cấu hình cũ sang cấu trúc mới.'
---

# Tạo cấu hình ngân hàng <Badge type="tip" text="Premium" />

Điền thông tin tài khoản và chọn cổng ngân hàng để tạo 2 file cấu hình chuyển khoản:

- `banking.yml`: cấu hình chung, cách tính point và lệnh thưởng.
- `providers/banking/<provider>.yml`: thông tin tài khoản và API của cổng ngân hàng.

Công cụ kiểm tra các lỗi thường gặp, như còn giữ giá trị mẫu, số tiền tối thiểu không hợp lệ, mức nạp bị trùng.

- Thông tin đăng nhập, API chỉ xử lý trên trình duyệt, không gửi đi đâu.
- Đang dùng `banking.yml` cấu trúc cũ? Dán vào mục **Nhập từ file đang có** để chuyển sang cấu trúc mới.

Giải thích chi tiết từng tùy chọn xem tại [Chuyển khoản ngân hàng](/docs/nap-tien/ngan-hang).

<BankingBuilder />

## Sau khi tạo

1. Thay nội dung `banking.yml` và file trong `providers/banking/` bằng kết quả ở trên.
2. Chạy `/dotman reload`, kiểm tra console không có cảnh báo về ngân hàng.
3. Thử nạp một giao dịch nhỏ bằng `/bank <số tiền>`.
4. Khi đã chạy ổn định, dùng [`/dotman configdb`](/docs/quan-tri/bao-mat-cau-hinh) để mã hóa thông tin nhận tiền lên database.
