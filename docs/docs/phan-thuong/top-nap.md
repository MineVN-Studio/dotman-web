---
title: Top nạp và bảng xếp hạng nạp
description: 'Bảng xếp hạng người nạp nhiều nhất trong DotMan: Top toàn thời gian, theo ngày, tuần, tháng và giao diện top nạp tùy chỉnh.'
---

# Top nạp

DotMan xếp hạng người chơi theo **tổng số tiền nạp** (VNĐ), gồm thẻ cào, chuyển khoản và nạp thủ công.

## Lệnh xem top

| Lệnh | Bảng xếp hạng | Permission | Phiên bản |
|------|---------------|------------|-----------|
| `/topnap [trang]` | Toàn thời gian | `dotman.topnap` | Miễn phí |
| `/topnapngay [-d <ngày>] [-m <tháng>] [-y <năm>] [trang]` | Theo ngày | `dotman.topnapngay` | Premium |
| `/topnaptuan [-w <tuần>] [-y <năm>] [trang]` | Theo tuần | `dotman.topnaptuan` | Premium |
| `/topnapthang [-m <tháng>] [-y <năm>] [trang]` | Theo tháng | `dotman.topnapthang` | Premium |

- Không có tùy chọn thì xem kỳ hiện tại (hôm nay, tuần này, tháng này).
- Dùng `-d`, `-w`, `-m`, `-y` để xem lại các kỳ trước.
  - Tuần đánh số từ 1 tới 53 trong năm.
  - Bỏ `-y` thì lấy năm hiện tại, bỏ `-m` thì lấy tháng hiện tại.

Ví dụ:

```
/topnap 2
/topnapngay -d 15 -m 05
/topnaptuan -w 20 -y 2026
/topnapthang -m 12 -y 2025
```

## Giao diện top nạp <Badge type="tip" text="Premium" />

- Người chơi dùng lệnh xem top sẽ mở giao diện top nạp.
- Lệnh từ console hiện kết quả dạng chữ.
- Bản miễn phí hiện kết quả dạng chữ trên chat.

Giao diện cấu hình trong `menu/top.yml`, gồm 2 phần:

| Phần | Dùng cho |
|------|----------|
| `java` | Người chơi Java Edition, giao diện dạng rương |
| `bedrock` | Người chơi Bedrock qua Floodgate, giao diện dạng form |

Các tùy chọn chính của phần `java`:

| Tùy chọn | Mô tả |
|----------|-------|
| `title` | Tên giao diện |
| `ranktitle` | Tên hiển thị cho top 1, 2, 3 (`1st`, `2nd`, `3rd`) và các hạng khác (`others`).<br />Hỗ trợ `%PLAYER%`, `%RANK%`. |
| `description.topnap` | Mô tả dưới tên người chơi, `%VALUE%` là số tiền đã nạp |
| `ui.rows` | Số hàng của giao diện, tối đa 6 |
| `ui.background` | Tô nền, các ô đánh dấu `x` trong `fill` được tô |
| `ui.first-page-layout` | Vị trí các hạng ở trang đầu, mặc định xếp dạng bục |
| `ui.other-page-layout` | Vị trí các hạng ở các trang sau |
| `ui.previous-page`, `ui.next-page`, `ui.close` | Nút chuyển trang và nút đóng, đặt theo `slot` |

Nội dung mặc định xem tại [Config mẫu: menu](/docs/config-mau/menu).

## Hiển thị top ở nơi khác

Dùng [placeholder top nạp](/docs/tham-khao/placeholder-api#top-nap) để hiện bảng xếp hạng trên hologram, scoreboard... Công cụ [Tạo placeholder](/docs/cong-cu/tao-placeholder) có thể tạo sẵn danh sách top 1 tới N.

```
%dotman_top_donate_total_1_player%
%dotman_top_donate_total_1_value%
```

Muốn tự động trao thưởng cho top nạp mỗi ngày, tuần, tháng, xem [Phần thưởng top nạp](/docs/phan-thuong/phan-thuong-top).
