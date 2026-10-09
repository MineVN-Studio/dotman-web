---
title: Danh sách lệnh và permission của DotMan
description: 'Danh sách lệnh và permission của DotMan: lệnh người chơi như /napthe, /bank, /khuyenmai và lệnh quản trị như /dotman, /congpoint.'
---

# Lệnh & permission

Danh sách đầy đủ lệnh và permission của DotMan. Lệnh chỉ có ở bản Premium được đánh dấu <Badge type="tip" text="Premium" />.

## Lệnh người chơi

### /napthe

Mở giao diện nạp thẻ, hoặc nạp nhanh không qua giao diện.

| Thông tin | Nội dung |
|--------|----------|
| Alias | - |
| Usage | `/napthe [<loại thẻ> <mệnh giá> <seri> <mã thẻ>]` |
| Permission | (không yêu cầu) |

**Cách dùng:**
- `/napthe` - Mở giao diện chọn loại thẻ
- `/napthe <loại thẻ> <mệnh giá> <seri> <mã thẻ>` - Nạp nhanh không qua giao diện

**Ví dụ:**
```
/napthe
/napthe viettel 50000 12345678 ABCD1234
```

Xem thêm: [Nạp thẻ cào](/nap-tien/the-cao).

### /bank <Badge type="tip" text="Premium" />

Tạo, tiếp tục hoặc hủy giao dịch nạp tiền qua chuyển khoản ngân hàng (QR code).

| Thông tin | Nội dung |
|--------|----------|
| Alias | `chuyenkhoan` |
| Usage | `/bank <số tiền>`, `/bank resume` hoặc `/bank cancel` |
| Permission | (không yêu cầu) |

**Cách dùng:**
- `/bank` - Xem hướng dẫn và tỉ lệ point khi nạp qua ngân hàng
- `/bank <số tiền>` - Tạo mã QR chuyển khoản
- `/bank resume` - Nhận lại mã QR của giao dịch đang chờ (ví dụ sau khi thoát game rồi vào lại)
- `/bank cancel` - Hủy giao dịch đang chờ xử lý

**Ví dụ:**
```
/bank 50000
/bank resume
/bank cancel
```

::: info Lưu ý
- Số tiền phải là bội số của 1000
- Số tiền tối thiểu theo `min-amount` của cổng ngân hàng
- Mỗi người chơi chỉ được có 1 giao dịch đang chờ xử lý
- Tay chính phải để trống (hoặc cầm bản đồ) để nhận QR
:::

Xem thêm: [Chuyển khoản ngân hàng](/nap-tien/ngan-hang).

### /khuyenmai

Xem danh sách khuyến mãi đang và sắp diễn ra.

| Thông tin | Nội dung |
|--------|----------|
| Alias | `lichkhuyenmai` |
| Usage | `/khuyenmai [số trang]` |
| Permission | (không yêu cầu) |

**Ví dụ:**
```
/khuyenmai
/khuyenmai 2
```

Xem thêm: [Lịch khuyến mãi](/khuyen-mai/lich-khuyen-mai#xem-danh-sach-khuyen-mai).

## Lệnh top nạp

Người chơi dùng lệnh sẽ mở giao diện top nạp <Badge type="tip" text="Premium" />, dùng từ console thì hiện dạng chữ. Xem thêm: [Top nạp](/phan-thuong/top-nap).

### /topnap

Xem top nạp toàn thời gian.

| Thông tin | Nội dung |
|--------|----------|
| Alias | - |
| Usage | `/topnap [số trang]` |
| Permission | `dotman.topnap` |

**Ví dụ:**
```
/topnap
/topnap 2
```

### /topnaptuan <Badge type="tip" text="Premium" />

Xem top nạp theo tuần.

| Thông tin | Nội dung |
|--------|----------|
| Alias | - |
| Usage | `/topnaptuan [-w <tuần>] [-y <năm>] [số trang]` |
| Permission | `dotman.topnaptuan` |

**Ví dụ:**
```
/topnaptuan
/topnaptuan -w 20
/topnaptuan -w 20 -y 2026
/topnaptuan -w 20 -y 2026 2
```

### /topnapthang <Badge type="tip" text="Premium" />

Xem top nạp theo tháng.

| Thông tin | Nội dung |
|--------|----------|
| Alias | - |
| Usage | `/topnapthang [-m <tháng>] [-y <năm>] [số trang]` |
| Permission | `dotman.topnapthang` |

**Ví dụ:**
```
/topnapthang
/topnapthang -m 05
/topnapthang -m 05 -y 2026
/topnapthang -m 05 -y 2026 2
```

### /topnapngay <Badge type="tip" text="Premium" />

Xem top nạp theo ngày.

| Thông tin | Nội dung |
|--------|----------|
| Alias | - |
| Usage | `/topnapngay [-d <ngày>] [-m <tháng>] [-y <năm>] [số trang]` |
| Permission | `dotman.topnapngay` |

**Ví dụ:**
```
/topnapngay
/topnapngay -d 15
/topnapngay -d 15 -m 05
/topnapngay -d 15 -m 05 -y 2026
```

## Lệnh admin

### /dotman

Lệnh quản trị chính của plugin. Gõ `/dotman` để xem danh sách lệnh con.

| Thông tin | Nội dung |
|--------|----------|
| Alias | - |
| Usage | `/dotman <lệnh con> [tham số]` |
| Permission | `dotman.admin` |

Các lệnh `/dotman ...` bên dưới đều yêu cầu quyền `dotman.admin`.

### /dotman reload
Reload toàn bộ cấu hình plugin.
```
/dotman reload
```

### /dotman thongbao
Thay đổi thông báo hiển thị trong giao diện nạp thẻ. Để trống để xóa thông báo.
```
/dotman thongbao <nội dung thông báo>
/dotman thongbao
```

### /dotman chuyenkhoan
Đặt vị trí hiện tại làm điểm xem hướng dẫn chuyển khoản, dùng cho nút `banking-recommend` trong giao diện nạp thẻ (chỉ dùng trong game).
```
/dotman chuyenkhoan
```

### /dotman lichsu
Xem lịch sử nạp.

| Alias | `history`, `lichsunap` |
|-------|------------------------|
| Usage | `[-p <tên người chơi>] [-m <tháng>] [-s <tên server>] [số trang]` |
| Permission thêm | `dotman.logs.serverfilter` để dùng tùy chọn `-s` |

- `-m` có định dạng `MM/yyyy`.
- `-s all` để xem tất cả server.

```
/dotman lichsu
/dotman lichsu -p Steve
/dotman lichsu -m 05/2026
/dotman lichsu -p Steve -m 05/2026 -s survival 2
```

### /dotman thongke <Badge type="tip" text="Premium" />
Xem thống kê nạp theo phương thức (thẻ cào, chuyển khoản, thủ công).

| Usage | `[-p <tên người chơi>] [-m <tháng>] [-s <tên server>]` |
|-------|--------------------------------------------------------|
| Permission thêm | `dotman.logs.serverfilter` để dùng tùy chọn `-s` |

```
/dotman thongke
/dotman thongke -p Steve -m 05/2026
```

### /dotman pointlog <Badge type="tip" text="Premium" />
Mở giao diện xem lịch sử point của người chơi (chỉ dùng trong game).

| Alias | `lichsupoint` |
|-------|---------------|
| Usage | `[-s <tên server>] [tên người chơi]` |
| Permission thêm | `dotman.logs.serverfilter` để dùng tùy chọn `-s` |

```
/dotman pointlog
/dotman pointlog Steve
/dotman pointlog -s survival Steve
```

### /dotman calendar <Badge type="tip" text="Premium" />
Mở lịch thống kê lịch sử nạp theo ngày (chỉ dùng trong game).

| Alias | `lich` |
|-------|--------|
| Usage | `[-s <tên server>]` |
| Permission thêm | `dotman.logs.serverfilter` để dùng tùy chọn `-s` |

```
/dotman calendar
/dotman calendar -s survival
```

### /dotman napthucong
Nạp tiền thủ công cho người chơi. Xem thêm: [Nạp thủ công](/nap-tien/thu-cong).

| Alias | `manual` |
|-------|----------|
| Usage | `<tên người chơi> <số tiền> [-p <số point>] [-d <nội dung>] [-f] [-c]` |

| Tùy chọn | Mô tả |
|----------|-------|
| `-p <số point>` | Chỉ định số point nhận thay vì tính theo công thức |
| `-d <nội dung>` | Nội dung nạp ghi vào lịch sử (tối đa 20 ký tự) |
| `-f` | Cho phép nạp khi người chơi offline |
| `-c` | Dùng công thức tính point của thẻ cào, số tiền phải trùng một mệnh giá thẻ |

```
/dotman napthucong Steve 100000
/dotman napthucong Steve 100000 -p 500
/dotman napthucong Steve 50000 -c
/dotman napthucong Steve 100000 -d qua tang su kien -f
```

### /dotman testpoint
Xem trước số point nhận được và khuyến mãi đang áp dụng, theo cách tính của thẻ cào và nạp thủ công. Không cộng point thật.

| Alias | `tp` |
|-------|------|
| Usage | `<số tiền>` |

```
/dotman testpoint 100000
```

Có thể tính thử ngay trên web bằng công cụ [Tính toán point](/cong-cu/tinh-toan-point).

### /dotman adminpass <Badge type="tip" text="Premium" />
Đặt hoặc đổi mật khẩu xác minh cho các lệnh nhạy cảm.

| Alias | `setadminpassword`, `setadminpass` |
|-------|-----------------------------------|
| Usage | `<mật khẩu mới>` hoặc `<mật khẩu cũ> <mật khẩu mới>` |

```
/dotman adminpass MyPassword123
/dotman adminpass OldPass NewPass
```

### /dotman configdb <Badge type="tip" text="Premium" />
Mã hóa và lưu cấu hình API nạp thẻ + ngân hàng lên database, đồng thời khóa cổng gạch thẻ và cổng ngân hàng đang dùng. Yêu cầu đã đặt mật khẩu xác minh. Xem thêm: [Bảo mật cấu hình](/quan-tri/bao-mat-cau-hinh).

| Usage | `<mật khẩu xác minh>` |
|-------|----------------------|

```
/dotman configdb MyPassword123
```

### /dotman removeconfigdb <Badge type="tip" text="Premium" />
Hướng dẫn xóa cấu hình đã lưu trên database.
```
/dotman removeconfigdb
```

### /dotman tracuugd
Tra cứu thông tin giao dịch theo mã giao dịch từ cổng gạch thẻ.

| Alias | `magiaodich` |
|-------|--------------|
| Usage | `<mã giao dịch>` |

```
/dotman tracuugd TXN123456
```

### /dotman cleardata
Xóa toàn bộ dữ liệu của một người chơi. Khi dùng trong game, cần nhập `XACNHAN` để xác nhận.

| Usage | `<tên người chơi>` |
|-------|-------------------|

```
/dotman cleardata Steve
```

### /dotman testphantrang
Xem thử cách hiển thị phân trang của các lệnh người chơi.

| Usage | `[số mục] [trang]` |
|-------|-------------------|

```
/dotman testphantrang 20 2
```

### /congpoint <Badge type="tip" text="Premium" />

Cộng (hoặc trừ) point cho người chơi, kèm lý do để ghi log.

| Thông tin | Nội dung |
|--------|----------|
| Alias | `cp`, `addpoint`, `addp`, `cpoint` |
| Usage | `/congpoint <tên người chơi> <số lượng> [lý do]` |
| Permission | `dotman.congpoint` |

**Cách dùng:**
- Nhập số âm để trừ point
- Lý do tối đa 200 ký tự, nên nhập để dễ theo dõi lịch sử
- Nên dùng lệnh này thay cho lệnh của PlayerPoints trong các menu, shop để theo dõi lịch sử tiêu dùng point

**Ví dụ:**
```
/congpoint Steve 100 Thuong su kien
/congpoint Steve -50 Vi pham noi quy
```

## Danh sách permission

| Permission | Mô tả |
|------------|-------|
| `dotman.admin` | Truy cập toàn bộ lệnh `/dotman`, không bị giới hạn cooldown |
| `dotman.update` | Nhận thông báo khi có phiên bản mới |
| `dotman.congpoint` | Sử dụng lệnh `/congpoint` |
| `dotman.topnap` | Sử dụng lệnh `/topnap` |
| `dotman.topnaptuan` | Sử dụng lệnh `/topnaptuan` |
| `dotman.topnapthang` | Sử dụng lệnh `/topnapthang` |
| `dotman.topnapngay` | Sử dụng lệnh `/topnapngay` |
| `dotman.logs.serverfilter` | Dùng tùy chọn `-s` để lọc theo server trong các lệnh lịch sử và thống kê |

::: info
Mặc định chỉ OP có các permission trên. Muốn người chơi thường xem được top nạp, hãy cấp `dotman.topnap` (và các quyền top khác) qua plugin quản lý quyền như LuckPerms.
:::
