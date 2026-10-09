---
title: Lịch khuyến mãi
description: Lên lịch khuyến mãi tự động theo ngày cố định hoặc lặp lại theo tuần.
---

# Lịch khuyến mãi

Lên lịch khuyến mãi tự động trong file `khuyenmai.yml`. Trong thời gian khuyến mãi, người chơi nhận thêm point khi nạp thẻ cào, chuyển khoản hoặc được nạp thủ công.

## Tỉ lệ khuyến mãi

| `rate` | Ý nghĩa | Ví dụ (nạp 100k) |
|--------|---------|------------------|
| `0` | Không khuyến mãi | Nhận 100k |
| `0.5` | Khuyến mãi 50% | Nhận 150k |
| `1` | Khuyến mãi 100% | Nhận 200k |
| `1.5` | Khuyến mãi 150% | Nhận 250k |

## Cấu hình

Mỗi mục trong danh sách `khuyen-mai` là một chương trình khuyến mãi:

| Tùy chọn | Mô tả |
|----------|-------|
| `name` | Tên khuyến mãi, hỗ trợ mã màu (`&a`, `&e`...) |
| `rate` | Tỉ lệ khuyến mãi, xem bảng trên |
| `from`, `to` | Thời điểm bắt đầu, kết thúc |
| `days` | Các thứ trong tuần (khuyến mãi lặp lại) |
| `hours` | Khung giờ trong ngày (khuyến mãi lặp lại) |

Thời gian dùng định dạng `dd/MM/yyyy HH:mm:ss` hoặc `dd/MM/yyyy HH:mm`.

::: tip Không muốn tự viết config?
Dùng công cụ [Tạo lịch khuyến mãi](/cong-cu/lich-khuyen-mai#tao-lich-khuyen-mai) để tạo khuyến mãi dễ dàng hơn: chọn thứ, khung giờ, ngày bắt đầu, kết thúc rồi sao chép config cuối cùng vào `khuyenmai.yml`.
:::

- Khuyến mãi dừng **đúng** tại thời điểm `to`.
  - `to: 01/05/2026 23:59` dừng lúc 23:59:00.
  - Muốn trọn ngày thì dùng `23:59:59`.

Mỗi khuyến mãi chọn 1 trong 2 kiểu dưới đây. Plugin tự nhận diện kiểu theo các tùy chọn có mặt.

### Ngày cố định

Bắt buộc có cả `from` và `to`:

```yaml [khuyenmai.yml]
khuyen-mai:
- name: '&aNgày Quốc khánh Việt Nam - Khuyến mãi 100%'
  rate: 1.0
  from: 02/09/2026 00:00
  to: 03/09/2026 23:59:59
```

### Lặp lại hàng tuần

Có ít nhất một trong `days` hoặc `hours`:

| Tùy chọn | Cách viết | Bỏ trống thì |
|----------|-----------|--------------|
| `days` | `2` đến `7` là thứ 2 đến thứ 7, `8` là chủ nhật.<br />Viết dạng danh sách `[7, 8]`, chuỗi `'7, 8'` hoặc một số `8`. | Áp dụng mọi ngày |
| `hours` | `'HH:mm-HH:mm'`, đặt trong dấu nháy đơn.<br />Giờ kết thúc tối đa `24:00` và phải sau giờ bắt đầu. | Áp dụng cả ngày |
| `from`, `to` | Không bắt buộc, giới hạn khoảng thời gian lặp lại.<br />Có thể chỉ dùng `from` hoặc chỉ dùng `to`. | Lặp lại không giới hạn |

Ví dụ:

```yaml [khuyenmai.yml]
khuyen-mai:
# Trọn vẹn thứ 7 và chủ nhật hàng tuần
- name: '&aKhuyến mãi cuối tuần 50%'
  rate: 0.5
  days: [7, 8]

# Giờ vàng 18:00 - 22:00 mỗi ngày
- name: '&eGiờ vàng - Khuyến mãi 30%'
  rate: 0.3
  hours: '18:00-22:00'

# Tối thứ 6 từ 20:00 tới hết ngày
- name: '&dTối thứ 6 - Khuyến mãi 20%'
  rate: 0.2
  days: [6]
  hours: '20:00-24:00'

# Chỉ các ngày cuối tuần trong tháng 9
- name: '&aCuối tuần tháng 9 - Khuyến mãi 100%'
  rate: 1.0
  days: [7, 8]
  from: 01/09/2026 00:00
  to: 30/09/2026 23:59:59
```

::: tip Khung giờ qua nửa đêm
Không viết được `'22:00-02:00'`. Hãy tách thành 2 mục cùng tên:

```yaml
- name: '&5Cú đêm cuối tuần - Khuyến mãi 25%'
  rate: 0.25
  days: [7]
  hours: '22:00-24:00'
- name: '&5Cú đêm cuối tuần - Khuyến mãi 25%'
  rate: 0.25
  days: [8]
  hours: '00:00-02:00'
```
:::

Muốn khuyến mãi luôn áp dụng tới khi xóa, dùng `hours: '00:00-24:00'` và không đặt `days`, `from`, `to`.

Xem thêm nhiều ví dụ khác trong [Config mẫu: khuyenmai.yml](/config-mau/khuyenmai-yml).

### Mục không hợp lệ

Mục cấu hình sai sẽ bị bỏ qua, kèm một dòng cảnh báo trong console. Các mục khác vẫn hoạt động. Các trường hợp bị coi là sai:

- Không có thời gian, chỉ có `name` và `rate`.
- `from` không trước `to`.
- Ngày giờ không tồn tại (ví dụ `31/09`, `25:00`) hoặc có ký tự thừa.
- Có dòng `days:`, `hours:`, `from:`, `to:` nhưng để trống giá trị.
  - Muốn "mọi ngày", "cả ngày" hay "không giới hạn" thì xóa hẳn dòng đó.

Khi nạp file, console in ra lịch của từng khuyến mãi lặp lại và khuyến mãi đang được áp dụng, giúp bạn kiểm tra lại cấu hình.

::: tip Kiểm tra trước khi đưa lên server
Dán `khuyenmai.yml` vào công cụ [Kiểm tra lịch khuyến mãi](/cong-cu/lich-khuyen-mai#kiem-tra-lich-khuyen-mai) để tìm mục lỗi và xem lịch áp dụng theo từng giờ trong tuần.
:::

## Thứ tự ưu tiên

- Nhiều khuyến mãi cùng diễn ra: áp dụng khuyến mãi có `rate` cao nhất.
  - Cùng `rate` thì lấy mục đứng trước trong file.
- Khuyến mãi trong `khuyenmai.yml` được ưu tiên hơn [khuyến mãi nhanh trong config.yml](#khuyen-mai-nhanh-trong-config-yml).
- Các khuyến mãi **không cộng dồn** với nhau.
  - Riêng [khuyến mãi nạp lần đầu](/khuyen-mai/nap-lan-dau) được cộng thêm vào tỉ lệ đang áp dụng.

## Khuyến mãi nhanh trong config.yml

Cách đặt khuyến mãi đơn giản, không cần lên lịch:

```yaml [config.yml]
# Tỉ lệ khuyến mãi
extra-rate: 0.5
# Thời gian kết thúc, định dạng dd/MM/yyyy HH:mm:ss hoặc dd/MM/yyyy HH:mm
extra-until: 30/09/2026 23:59:59
```

- Khuyến mãi bắt đầu ngay và kết thúc tại `extra-until`.
- Chỉ áp dụng khi `khuyenmai.yml` không có khuyến mãi nào đang diễn ra.
- `extra-until` sai định dạng sẽ bị coi như khuyến mãi đã hết hạn, kèm cảnh báo trong console.
- Tên hiển thị của khuyến mãi này đặt bằng `legacy-name` trong `khuyenmai.yml`:

```yaml [khuyenmai.yml]
legacy-name: '&aKhuyến mãi nạp thẻ'
```

## Xem danh sách khuyến mãi

Người chơi dùng `/khuyenmai [trang]` (alias `/lichkhuyenmai`) để xem các khuyến mãi đang và sắp diễn ra.

- Không cần permission, dùng được cả trong console.
- Khuyến mãi đang diễn ra hiện trước, sau đó là khuyến mãi sắp diễn ra.
- Khuyến mãi thực sự đang được áp dụng có dấu `★`.
- Khuyến mãi đã kết thúc không hiện.
- Mỗi trang 3 khuyến mãi, có nút chuyển trang.

Định dạng hiển thị chỉnh trong các mục `khuyenmai-*` và `pagination-*` của [messages.yml](/config-mau/messages-yml).

## Kiểm tra trước khuyến mãi

Lệnh admin `/dotman testpoint <số tiền>` (alias `tp`) cho biết với số tiền đó, người chơi sẽ nhận bao nhiêu point:

- Hiện khuyến mãi đang được áp dụng.
- Tính theo cách của [thẻ cào](/nap-tien/the-cao#menh-gia-va-point) (số tiền phải trùng một mệnh giá thẻ) và [nạp thủ công](/nap-tien/thu-cong).
- Không cộng point thật, không ghi lịch sử, không chạy lệnh thưởng.

```
/dotman testpoint 100000
```

Có thể tính thử ngay trên web bằng công cụ [Tính toán point](/cong-cu/tinh-toan-point), và xem lịch áp dụng khuyến mãi theo tuần bằng công cụ [Kiểm tra lịch khuyến mãi](/cong-cu/lich-khuyen-mai#kiem-tra-lich-khuyen-mai).

Muốn gửi thông báo khi khuyến mãi bắt đầu, kết thúc, xem [Thông báo khuyến mãi](/khuyen-mai/thong-bao).
