---
title: Lịch sử và thống kê
description: Tra cứu lịch sử nạp, thống kê doanh thu, lịch sử point và giao dịch của người chơi.
---

# Lịch sử và thống kê

Các lệnh tra cứu dành cho admin, yêu cầu quyền `dotman.admin`.

## Tùy chọn lọc

Các lệnh tra cứu dùng chung các tùy chọn sau:

| Tùy chọn | Mô tả |
|----------|-------|
| `-p <tên người chơi>` | Chỉ xem một người chơi |
| `-m <tháng>` | Chỉ xem một tháng, định dạng `MM/yyyy`, ví dụ `05/2026` |
| `-s <tên server>` | Xem dữ liệu của server khác, hoặc `all` để xem tất cả server.<br />Cần thêm quyền `dotman.logs.serverfilter`. |

Không có `-s` thì xem dữ liệu của server hiện tại.

## Lịch sử nạp

```
/dotman lichsu [-p <tên người chơi>] [-m <tháng>] [-s <tên server>] [trang]
```

Alias: `history`, `lichsunap`.

- Hiện tổng tiền nạp và danh sách giao dịch, 20 giao dịch mỗi trang.
- Ví dụ:

```
/dotman lichsu
/dotman lichsu -p Steve
/dotman lichsu -m 05/2026
/dotman lichsu -p Steve -m 05/2026 -s all 2
```

## Thống kê theo phương thức <Badge type="tip" text="Premium" />

```
/dotman thongke [-p <tên người chơi>] [-m <tháng>] [-s <tên server>]
```

Hiện tổng tiền nạp, chia theo chuyển khoản, nạp thủ công và thẻ cào.

## Lịch nạp theo ngày <Badge type="tip" text="Premium" />

```
/dotman calendar [-s <tên server>]
```

Alias: `lich`. Mở giao diện lịch, xem tổng nạp của từng ngày. Chỉ dùng được trong game.

## Lịch sử point <Badge type="tip" text="Premium" />

```
/dotman pointlog [-s <tên server>] [tên người chơi]
```

Alias: `lichsupoint`.

- Mở giao diện lịch sử cộng, trừ point của người chơi, kèm lý do.
- Ghi nhận cả point thay đổi bởi plugin khác qua PlayerPoints.
- Chỉ dùng được trong game.

::: tip
Dùng [`/congpoint`](/docs/tham-khao/danh-sach-lenh-va-permission#congpoint) thay cho lệnh của PlayerPoints trong các menu, shop để có lý do rõ ràng trong lịch sử point.
:::

## Tra cứu giao dịch

```
/dotman tracuugd <mã giao dịch>
```

Alias: `magiaodich`. Xem chi tiết giao dịch thẻ cào theo mã giao dịch của cổng gạch thẻ: người chơi, loại thẻ, point nhận, server, thời gian.

## Xóa dữ liệu người chơi

```
/dotman cleardata <tên người chơi>
```

- Xóa toàn bộ dữ liệu của người chơi trong DotMan, không thể khôi phục.
- Khi dùng trong game, cần nhập `XACNHAN` vào khung chat để xác nhận, hoặc `HUY` để hủy.
