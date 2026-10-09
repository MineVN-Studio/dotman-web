---
title: Nạp thẻ cào tự động cho server Minecraft
description: 'Cấu hình nạp thẻ cào trong DotMan: Chọn cổng gạch thẻ Card2K, TheSieuRe, GameBank, mệnh giá, lệnh thưởng và giao diện nạp thẻ.'
---

# Nạp thẻ cào

Người chơi nạp thẻ cào qua giao diện `/napthe` hoặc lệnh nạp nhanh. Thẻ được gửi tới cổng gạch thẻ, nạp thành công thì plugin cộng point và chạy lệnh thưởng.

## Chọn cổng gạch thẻ

Đặt cổng gạch thẻ trong mục `provider` của `config.yml`:

```yaml [config.yml]
provider: card2k
```

| `provider` | File cấu hình | Thông tin cần điền | Ghi chú |
|------------|---------------|--------------------|---------|
| `card2k` | `providers/card2k.yml` | `partner-id`, `partner-key` | MineVN Studio khuyên dùng <br>https://card2k.net/</br> |
| `thesieure` | `providers/thesieure.yml` | `partner-id`, `partner-key` | https://thesieure.com/ |
| `gamebank` | `providers/gamebank.yml` | `merchant_id`, `api_user`, `api_password` | |
| `gachthe1s` | `providers/gachthe1s.yml` | `partner-id`, `partner-key` | <Badge type="tip" text="Premium" /> |
| `gachthe5s` | `providers/gachthe5s.yml` | `api-key` | <Badge type="tip" text="Premium" /> |

1. Đặt `provider` rồi chạy `/dotman reload`, plugin sẽ tạo file cấu hình tương ứng trong thư mục `providers`.
2. Điền thông tin lấy từ trang quản lý của cổng gạch thẻ vào file đó.
3. Chạy `/dotman reload` để áp dụng.

Ví dụ với `card2k`:

```yaml [providers/card2k.yml]
partner-id: 'partner_id_của_bạn'
partner-key: 'partner_key_của_bạn'
```

::: warning Đã chạy /dotman configdb?
Sau khi [bảo mật cấu hình](/quan-tri/bao-mat-cau-hinh), cổng gạch thẻ bị khóa trên database và mục `provider` trong file không còn tác dụng.
Xem cách [đổi cổng gạch thẻ khi đã khóa](/quan-tri/bao-mat-cau-hinh#doi-provider-khi-da-khoa).
:::

## Loại thẻ chấp nhận

Bật/tắt từng loại thẻ trong `config.yml`:

```yaml [config.yml]
card-types:
  viettel: true
  mobifone: true
  vinaphone: true
  vietnammobile: true
  garena: true
  zing: false
  vcoin: true
  gate: false
```

- Loại thẻ bị tắt sẽ không hiện trong giao diện và không dùng được với lệnh nạp nhanh.
- Loại thẻ đang bật nhưng cổng gạch thẻ báo bảo trì sẽ hiện ở trạng thái "tạm bảo trì".

## Mệnh giá và point

Số point người chơi nhận được ứng với từng mệnh giá thẻ:

```yaml [config.yml]
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
```

- Các mệnh giá hỗ trợ: `10000`, `20000`, `30000`, `50000`, `100000`, `200000`, `300000`, `500000`, `1000000`.
- Point thực nhận đã cộng thêm khuyến mãi:

```
Point nhận = point theo mệnh giá + (point theo mệnh giá × tỉ lệ khuyến mãi)
```

- Tỉ lệ khuyến mãi lấy từ [lịch khuyến mãi](/khuyen-mai/lich-khuyen-mai).
  - Nếu là lần nạp đầu tiên, cộng thêm tỉ lệ [khuyến mãi nạp lần đầu](/khuyen-mai/nap-lan-dau) <Badge type="tip" text="Premium" />.
- Ví dụ: thẻ 100.000đ, khuyến mãi 50% thì nhận `100 + 100 × 0.5 = 150` point.
- Tính thử với cấu hình của bạn bằng công cụ [Tính toán point](/cong-cu/tinh-toan-point).

## Lệnh sau khi nạp thẻ

Lệnh chạy từ console khi nạp thẻ thành công, khai báo theo mệnh giá:

```yaml [config.yml]
donate-commands:
  10000:
    - 'tell %PLAYER% Bạn vừa nạp %CARD_TYPE% %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
  100000:
    - 'tell %PLAYER% Bạn vừa nạp %CARD_TYPE% %AMOUNT% VNĐ và nhận được %POINT% %POINT_UNIT%'
```

| Placeholder | Mô tả |
|-------------|-------|
| `%PLAYER%` | Tên người chơi |
| `%CARD_TYPE%` | Loại thẻ, ví dụ `VIETTEL` |
| `%AMOUNT%` | Mệnh giá thẻ (VNĐ) |
| `%POINT%` | Point theo mệnh giá, **chưa** cộng khuyến mãi |
| `%POINT_UNIT%` | Đơn vị point |

## Người chơi nạp thẻ

### Qua giao diện

1. Gõ `/napthe` để mở giao diện chọn loại thẻ.
2. Chọn mệnh giá.
3. Nhập số seri và mã thẻ:
   - Mặc định nhập qua Anvil.
   - Đặt `use-anvilgui: false` trong `config.yml` để nhập qua khung chat. Khi nhập qua chat, gõ `HUY` để hủy.

Người chơi Bedrock (qua Floodgate) được hiện giao diện dạng form <Badge type="tip" text="Premium" />.

### Nạp nhanh bằng lệnh

```
/napthe <loại thẻ> <mệnh giá> <số seri> <mã thẻ>
```

Ví dụ:

```
/napthe viettel 50000 12345678901 123456789012
```

- Lệnh có gợi ý tab cho loại thẻ và mệnh giá, dùng được trên cả bản 1.8.
- Số seri và mã thẻ tối đa 20 ký tự.

### Giới hạn gửi thẻ <Badge type="tip" text="Premium" />

- Mỗi lần gửi thẻ cách nhau ít nhất `cooldown.transaction` giây.
- Gửi thẻ lỗi 3 lần liên tiếp sẽ bị cấm gửi thẻ trong `cooldown.card-submit` giây.
- Xem cấu hình tại [Cooldown](/huong-dan/cau-hinh-chung#cooldown).

## Giao diện nạp thẻ

Giao diện được cấu hình trong 2 file:

| File | Giao diện |
|------|-----------|
| `menu/napthe/loaithe.yml` | Chọn loại thẻ |
| `menu/napthe/menhgia.yml` | Chọn mệnh giá |

Cách bố trí:

- `rows`: số hàng của giao diện, tối đa 6.
- `background.fill`: các ô đánh dấu `x` được tô nền. Số dòng phải bằng `rows`, mỗi dòng 9 ký tự.
- `cards.fill`, `prices.fill`: các ô đánh dấu `x` lần lượt được đặt loại thẻ, mệnh giá.
- Các nút khác đặt theo `slot` (ô đầu tiên là `0`).

Các nút trong giao diện chọn loại thẻ:

| Nút | Chức năng |
|-----|-----------|
| `close` | Đóng giao diện |
| `info` | Hiện thông báo, đổi nội dung bằng `/dotman thongbao <nội dung>` |
| `banking-recommend` | Dịch chuyển người chơi tới khu hướng dẫn chuyển khoản.<br />Đặt vị trí bằng `/dotman chuyenkhoan` tại chỗ đang đứng. |
| `cards.active` | Loại thẻ đang hoạt động |
| `cards.disabled` | Loại thẻ đang bảo trì |
| `cards.blank` | Ô trống khi số loại thẻ ít hơn số ô `x` |

Nội dung mặc định xem tại [Config mẫu: menu](/config-mau/menu).

## Troubleshooting

| Vấn đề | Cách xử lý |
|------------|-----------|
| Người chơi nhận tin "Hệ thống nạp thẻ đang tạm khóa để bảo trì" | Database đã khóa một cổng gạch thẻ nhưng thiếu thông tin của cổng đó.<br />Xem [Bảo mật cấu hình](/quan-tri/bao-mat-cau-hinh#doi-provider-khi-da-khoa). |
| Cần kiểm tra một giao dịch | Dùng `/dotman tracuugd <mã giao dịch>`, xem [Lịch sử & thống kê](/quan-tri/lich-su-va-thong-ke#tra-cuu-giao-dich). |
| Muốn thử công thức tính point | Dùng công cụ [Tính toán point](/cong-cu/tinh-toan-point),<br />hoặc lệnh `/dotman testpoint <số tiền>` trong game. |
