---
title: Nạp tiền qua chuyển khoản ngân hàng (QR)
description: 'Cấu hình chuyển khoản ngân hàng cho DotMan Premium: Mã QR tự duyệt giao dịch qua MBBank, PayOS, SePay hoặc Payment Service.'
---

# Chuyển khoản ngân hàng <Badge type="tip" text="Premium" />

Bên cạnh thẻ cào, DotMan hỗ trợ nạp tiền qua chuyển khoản ngân hàng. Người chơi tạo giao dịch, nhận mã QR và chuyển khoản theo thông tin riêng của giao dịch đó. Plugin tự động kiểm tra lịch sử giao dịch, cộng point và chạy lệnh thưởng khi khớp số tiền và nội dung.

## Cách hoạt động

1. Người chơi gõ `/bank <số tiền>`.
2. Plugin tạo giao dịch, đưa mã QR lên tay chính và gửi thông tin chuyển khoản:
   - Ngân hàng, số tài khoản, chủ tài khoản.
   - Số tiền và nội dung chuyển khoản riêng cho giao dịch này.
3. Bossbar đếm ngược thời gian còn lại của giao dịch.
4. Cứ mỗi `interval` giây, plugin kiểm tra lịch sử giao dịch qua cổng ngân hàng.
5. Khi khớp số tiền và nội dung, plugin cộng point, chạy lệnh thưởng, tính vào top nạp và mốc nạp.

## Bật chuyển khoản ngân hàng

Cấu hình gồm 2 phần:

- `banking.yml`: cấu hình chung (bật/tắt, cách tính point, lệnh thưởng...).
- `providers/banking/<provider>.yml`: thông tin tài khoản và API của cổng ngân hàng đang dùng.

Các bước:

1. Trong `banking.yml`, đặt `enabled: true` và chọn `provider`:

```yaml [banking.yml]
enabled: true
# MBBANK, PAYOS, SEPAY hoặc PAYMENT-SERVICE
provider: MBBANK
```

2. Chạy `/dotman reload`, plugin tạo file `providers/banking/mbbank.yml`.
3. Điền thông tin vào file vừa tạo, xem hướng dẫn từng cổng tại [Cổng thanh toán ngân hàng](#cong-thanh-toan-ngan-hang).
4. Chạy `/dotman reload` để áp dụng.
5. Nên [bảo mật cấu hình](/quan-tri/bao-mat-cau-hinh) để chống bị sửa thông tin nhận tiền.

## Cấu hình chung

| Tùy chọn | Mô tả | Mặc định |
|----------|-------|----------|
| `enabled` | Bật/tắt chuyển khoản ngân hàng | `false` |
| `provider` | Cổng ngân hàng: `MBBANK`, `PAYOS`, `SEPAY`, `PAYMENT-SERVICE` | `MBBANK` |
| `interval` | Thời gian giữa các lần quét lịch sử giao dịch (giây) | `5` |
| `transaction-expiry` | Thời gian hết hạn của một giao dịch (giây) | `600` |
| `bossbar.enabled` | Hiện bossbar đếm ngược thời gian chuyển khoản | `true` |
| `bossbar.title` | Nội dung bossbar, `%TIME%` là thời gian còn lại | |
| `proxy` | Kết nối qua proxy, xem [bên dưới](#proxy) | Tắt |
| `config-version` | Phiên bản cấu trúc file, **không sửa nếu không rõ** | `2` |

Số tiền nạp tối thiểu (`min-amount`) đặt trong file của từng cổng ngân hàng.

## Cổng thanh toán ngân hàng

Mỗi cổng có một file cấu hình riêng trong `providers/banking/`, được tạo khi bạn chọn cổng đó trong `banking.yml`.

### So sánh các cổng

| `provider` | Cách kết nối | Ngân hàng hỗ trợ |
|------------|--------------|------------------|
| `MBBANK` | Đăng nhập trực tiếp tài khoản MBBank | MBBank |
| `PAYOS` | Qua [PayOS](https://payos.vn/) | MBBANK, BIDV, ACB, OCB, KLB |
| `SEPAY` | Qua [SePay](https://sepay.vn/) | VCB, STB, TPB, VPB, ICB, ACB,<br />BIDV, MB, OCB, KLB, MSB |
| `PAYMENT-SERVICE` | Qua Payment Service | Liên hệ MineVN Studio |

### Thông tin tài khoản

Các tùy chọn sau có trong file của mọi cổng:

| Tùy chọn | Mô tả |
|----------|-------|
| `bank` | Mã ngân hàng, theo danh sách hỗ trợ của từng cổng.<br />MBBank trực tiếp không có tùy chọn này. |
| `account` | Số tài khoản để tra cứu lịch sử giao dịch |
| `account-qr` | Số tài khoản hiển thị cho người chơi và dùng để tạo mã QR.<br />Có thể dùng nickname tài khoản, không có thì để giống `account`. |
| `account-name` | Tên chủ tài khoản, viết hoa không dấu, ví dụ `NGUYEN VAN A` |
| `min-amount` | Số tiền nạp tối thiểu (VNĐ) |

### MBBank

Plugin đăng nhập trực tiếp vào tài khoản MBBank để đọc lịch sử giao dịch.

```yaml [providers/banking/mbbank.yml]
account: '0123456789'
account-qr: 'nickname'
account-name: 'NGUYEN VAN A'
min-amount: 10000

# Tài khoản và mật khẩu MBBank
username: "username"
password: "password"
```

- Tài khoản phải đăng nhập được tại [online.mbbank.com.vn](https://online.mbbank.com.vn/).
- Cần **tắt 2FA** (xác minh 2 bước) trên app ngân hàng.
- Nếu không kết nối được tới ngân hàng, hãy dùng [proxy](#proxy).

### PayOS

```yaml [providers/banking/payos.yml]
# Ngân hàng hỗ trợ: MBBANK, BIDV, ACB, OCB, KLB
bank: MBBANK

account: '0123456789'
account-qr: 'nickname'
account-name: 'NGUYEN VAN A'
min-amount: 10000

client-id: "client-id"
api-key: "api-key"
checksum-key: "checksum-key"

# URL chuyển hướng khi giao dịch hoàn tất/hủy
url-success: 'https://minevn.net'
url-cancel: 'https://minevn.net'
```

- Lấy `client-id`, `api-key`, `checksum-key` tại [my.payos.vn](https://my.payos.vn/):
  - **Kênh thanh toán** → **Thông tin kênh thanh toán**.
- Thông tin tài khoản tùy loại kênh PayOS:
  - **PayOS OpenAPI:** điền đầy đủ `account`, `account-qr`, `account-name`.
  - **PayOS VietQR Pro:** chỉ cần `account-name`, số tài khoản do hệ thống tự tạo. `account`, `account-qr` để nguyên giá trị mẫu hoặc để trống.
- Ngoài mã QR, người chơi nhận thêm link thanh toán của PayOS nếu không quét được mã.
- Video hướng dẫn: [Cấu hình PayOS](https://www.youtube.com/watch?v=UJ4tpiOLR_U).

### SePay

```yaml [providers/banking/sepay.yml]
# Ngân hàng hỗ trợ: VCB, STB, TPB, VPB, ICB, ACB, BIDV, MB, OCB, KLB, MSB
bank: MB

account: '0123456789'
account-qr: 'nickname'
account-name: 'NGUYEN VAN A'
min-amount: 10000

api-token: 'api-token'
```

- Lấy `api-token` tại [my.sepay.vn/companyapi](https://my.sepay.vn/companyapi).
- `bank`, `account`, `account-name` phải **trùng khớp** với tài khoản đã liên kết trên SePay, plugin dùng chúng để chọn đúng tài khoản.
- Chỉ các giao dịch tiền vào mới được xét.

### Payment Service

```yaml [providers/banking/payment-service.yml]
bank: MBBANK

account: '0123456789'
account-qr: 'nickname'
account-name: 'NGUYEN VAN A'
min-amount: 10000

# Endpoint payment-service
url: 'http://localhost:3000/payments'
```

Liên hệ [MineVN Studio](https://minevn.net/studio) để được hướng dẫn cài đặt Payment Service.

### Lưu ý bảo mật

Các thông tin nhạy cảm của mỗi cổng:

| `provider` | Thông tin nhạy cảm |
|------------|--------------------|
| `MBBANK` | `username`, `password` |
| `PAYOS` | `client-id`, `api-key`, `checksum-key` |
| `SEPAY` | `api-token` |
| `PAYMENT-SERVICE` | `url` |

Sau khi cấu hình chạy ổn định, hãy dùng [`/dotman configdb`](/quan-tri/bao-mat-cau-hinh) để mã hóa các thông tin này lên database, khóa cổng ngân hàng đang dùng, rồi xóa chúng khỏi file.

Nội dung mặc định của các file xem tại [Config mẫu: providers/banking](/config-mau/providers-ngan-hang).

## Cách tính point

```
Point nhận = (số tiền / 1000) × (point-base + point-extra + point-base × tỉ lệ khuyến mãi)
```

| Tùy chọn | Mô tả | Mặc định |
|----------|-------|----------|
| `point-base` | Số point tiêu chuẩn trên mỗi 1000 VNĐ, dùng để tính khuyến mãi | `1` |
| `point-extra` | Số point nhận thêm trên mỗi 1000 VNĐ khi nạp qua ngân hàng | `0.5` |

Tính thử với cấu hình của bạn bằng công cụ [Tính toán point](/cong-cu/tinh-toan-point).

- Tỉ lệ khuyến mãi lấy từ [lịch khuyến mãi](/khuyen-mai/lich-khuyen-mai).
  - Nếu là lần nạp đầu tiên, cộng thêm tỉ lệ [khuyến mãi nạp lần đầu](/khuyen-mai/nap-lan-dau).
- Ví dụ: nạp 10.000đ, `point-base: 1`, `point-extra: 0.5`, khuyến mãi 50%:

```
Point nhận = 10 × (1 + 0.5 + 1 × 0.5) = 20 point
```

## Lệnh sau khi nạp

### Lệnh luôn chạy

```yaml [banking.yml]
commands:
  - 'tell %PLAYER% Bạn vừa nạp %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
```

### Lệnh theo mức nạp tối thiểu

Plugin chọn **một** mức lớn nhất không vượt quá số tiền nạp và chạy lệnh của mức đó.

```yaml [banking.yml]
minimum-donate-commands:
  10000:
    - 'tell %PLAYER% Cảm ơn bạn đã ủng hộ server!'
  50000:
    - 'give %PLAYER% diamond 5'
  100000:
    - 'give %PLAYER% diamond 15'
```

- Ví dụ trên, nạp 70.000đ sẽ chạy lệnh của mức `50000`.
- Nạp dưới mức nhỏ nhất thì không chạy lệnh nào trong mục này.

### Placeholder

| Placeholder | Mô tả |
|-------------|-------|
| `%PLAYER%` | Tên người chơi |
| `%AMOUNT%` | Số tiền nạp (VNĐ) |
| `%POINT%` | Số point nhận được, đã cộng khuyến mãi |
| `%POINT_UNIT%` | Đơn vị point |

Nếu người chơi đã thoát server lúc giao dịch thành công, các lệnh trên được [giữ lại và chạy khi người chơi vào lại](/quan-tri/lenh-thuong-offline).

## Người chơi nạp qua ngân hàng

| Lệnh | Chức năng |
|------|-----------|
| `/bank` | Xem hướng dẫn và tỉ lệ point khi nạp qua ngân hàng |
| `/bank <số tiền>` | Tạo giao dịch và nhận mã QR |
| `/bank resume` | Nhận lại mã QR của giao dịch đang chờ |
| `/bank cancel` | Hủy giao dịch đang chờ |

Lệnh `/bank` có alias `/chuyenkhoan`.

Điều kiện tạo giao dịch:

- Số tiền là bội số của 1000 và không nhỏ hơn `min-amount` của cổng ngân hàng.
- Mỗi người chơi chỉ có 1 giao dịch đang chờ.
- Tay chính để trống hoặc đang cầm bản đồ, để nhận mã QR.
- Giữa 2 lần tạo giao dịch cách nhau ít nhất `cooldown.transaction` giây, xem [Cooldown](/huong-dan/cau-hinh-chung#cooldown).

Mã QR bị xóa khi người chơi vứt nó ra khỏi túi đồ.

### Khi người chơi thoát server

- Giao dịch **không bị hủy**, vẫn được theo dõi cho tới khi hết hạn.
- Nếu giao dịch thành công trong lúc offline:
  - Point vẫn được cộng.
  - Lệnh thưởng được giữ lại và chạy khi người chơi vào lại server.
  - Thông báo nạp thành công được gửi khi người chơi vào lại (mất nếu server restart trước đó).
- Khi vào lại, người chơi được nhắc dùng `/bank resume` để nhận lại mã QR, hoặc `/bank cancel` để hủy.

## Proxy

Dùng khi server không kết nối trực tiếp được tới ngân hàng:

```yaml [banking.yml]
proxy:
  enabled: true
  use-socks: false # true nếu dùng SOCKS proxy
  host: '127.0.0.1'
  port: 1080
```

## Chuyển từ cấu hình cũ

Các bản DotMan cũ để toàn bộ thông tin ngân hàng trong `banking.yml` (cấu trúc phiên bản 1).

- File không có `config-version`, hoặc `config-version: 1`, vẫn chạy theo cấu trúc cũ.
- Plugin **không** tự chuyển đổi file của bạn.
- Cấu trúc cũ mà bật từ 2 cổng trung gian trở lên (`payos.enabled`, `sepay.enabled`...) sẽ không chạy và báo cảnh báo trong console.

Để chuyển sang cấu trúc mới:

1. Sao lưu `banking.yml` hiện tại.
2. Lấy file `banking.yml` mới từ [Config mẫu](/config-mau/banking-yml), chép lại các giá trị chung như `point-base`, `commands`...
3. Đặt `provider` và điền thông tin tài khoản vào `providers/banking/<provider>.yml`.
4. Chạy `/dotman reload`.


Nội dung mặc định xem tại [Config mẫu: banking.yml](/config-mau/banking-yml).
