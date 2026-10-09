---
title: Placeholder API của DotMan
description: 'Danh sách placeholder của DotMan dùng với PlaceholderAPI: Dữ liệu người chơi, top nạp, tổng nạp toàn server và khung thời gian.'
---

# Placeholder API

DotMan tích hợp với [PlaceholderAPI](https://www.spigotmc.org/resources/placeholderapi.6245/). Tất cả placeholder đều có prefix `%dotman_..._..._...%`.

- Placeholder không phân biệt hoa thường.
  - Ví dụ: `%DOTMAN_DATA_DONATE_TOTAL%` và `%dotman_data_donate_total%` như nhau.
- Các placeholder theo ngày, tuần, tháng, khung thời gian và tổng server chỉ có ở bản <Badge type="tip" text="Premium" />.
- Tạo nhanh placeholder bằng công cụ [Tạo placeholder](/cong-cu/tao-placeholder).

## Dữ liệu người chơi

Lấy dữ liệu của người chơi đang xem placeholder.

| Placeholder | Mô tả |
|-------------|-------|
| `%dotman_data_<key>%` | Toàn thời gian |
| `%dotman_dataday_<key>%` | Ngày hôm nay |
| `%dotman_dataweek_<key>%` | Tuần này |
| `%dotman_datamonth_<key>%` | Tháng này |

**Key hiện có:**

| Key | Mô tả |
|-----|-------|
| `donate_total` | Tổng số tiền nạp (VNĐ) |
| `point_from_card` | Tổng point nhận được từ các lần nạp <Badge type="tip" text="Premium" /> |
| `point_received` | Tổng point được cộng, kể cả từ plugin khác qua PlayerPoints <Badge type="tip" text="Premium" /> |
| `point_used` | Tổng point đã tiêu <Badge type="tip" text="Premium" /> |

**Ví dụ:**
```
%dotman_data_donate_total%
%dotman_dataday_donate_total%
%dotman_dataweek_donate_total%
%dotman_datamonth_donate_total%
%dotman_datamonth_point_used%
```

::: info
Người chơi chưa có dữ liệu thì placeholder trả về `0`.
:::

## Top nạp

Lấy thông tin người chơi hoặc giá trị tại một vị trí trong bảng xếp hạng.

**Cú pháp:** `%dotman_<loại>_<key>_<rank>_<type>%`

| Tham số | Giá trị |
|---------|---------|
| `<loại>` | `top` (toàn thời gian), `topday`, `topweek`, `topmonth` |
| `<key>` | Xem [key hiện có](#du-lieu-nguoi-choi), thường dùng `donate_total` |
| `<rank>` | Vị trí xếp hạng (1, 2, 3, ...) |
| `<type>` | `player` (tên người chơi) hoặc `value` (giá trị) |

**Ví dụ:**
```
%dotman_top_donate_total_1_player%       → Tên người chơi top 1 toàn thời gian
%dotman_top_donate_total_1_value%        → Số tiền top 1 toàn thời gian
%dotman_topday_donate_total_1_player%    → Tên người chơi top 1 hôm nay
%dotman_topday_donate_total_1_value%     → Số tiền top 1 hôm nay
%dotman_topweek_donate_total_1_player%   → Tên người chơi top 1 tuần này
%dotman_topmonth_donate_total_1_player%  → Tên người chơi top 1 tháng này
```

::: info
Nếu vị trí chưa có người chơi: `player` trả về `Chưa xếp hạng`, `value` trả về `0`.
:::

## Tổng nạp toàn server <Badge type="tip" text="Premium" />

Lấy tổng dữ liệu của tất cả người chơi trên server.

| Placeholder | Mô tả |
|-------------|-------|
| `%dotman_masterdata_<key>%` | Toàn thời gian |
| `%dotman_masterdataday_<key>%` | Ngày hôm nay |
| `%dotman_masterdataweek_<key>%` | Tuần này |
| `%dotman_masterdatamonth_<key>%` | Tháng này |

**Ví dụ:**
```
%dotman_masterdata_donate_total%       → Tổng nạp của server từ trước đến nay
%dotman_masterdatamonth_donate_total%  → Tổng nạp của server tháng này
```

## Khung thời gian (TimeFrame) <Badge type="tip" text="Premium" />

Dùng cho các sự kiện có thời gian bắt đầu và kết thúc tùy chỉnh (ví dụ: sự kiện Giáng sinh, Tết, ...). Xem cách tạo tại [Khung thời gian](/phan-thuong/khung-thoi-gian).

**Cú pháp dữ liệu người chơi:** `%dotman_dataframe_<frame-id>_<key>%`

**Cú pháp top:** `%dotman_topframe_<frame-id>_<key>_<rank>_<type>%`

**Cú pháp tổng server:** `%dotman_masterdataframe_<frame-id>_<key>%`

| Tham số | Mô tả |
|---------|-------|
| `<frame-id>` | ID của khung thời gian, định nghĩa trong `khungthoigian.yml` |
| `<key>` | Xem [key hiện có](#du-lieu-nguoi-choi), thường dùng `donate_total` |
| `<rank>` | Vị trí xếp hạng |
| `<type>` | `player` hoặc `value` |

**Ví dụ** (khung thời gian `giang-sinh-2026`):
```
%dotman_dataframe_giang-sinh-2026_donate_total%
%dotman_topframe_giang-sinh-2026_donate_total_1_player%
%dotman_topframe_giang-sinh-2026_donate_total_1_value%
%dotman_masterdataframe_giang-sinh-2026_donate_total%
```

## Ví dụ thực tế - Hologram

Dưới đây là ví dụ hologram (dùng plugin [DecentHolograms](https://www.spigotmc.org/resources/decentholograms.96927/) hoặc tương tự) hiển thị đầy đủ các loại placeholder của DotMan. Muốn tạo nhanh danh sách top cho hologram, dùng công cụ [Tạo placeholder](/cong-cu/tao-placeholder).

```yaml [dotman.yml]
pages:
- lines:
  - content: '&e&lDotMan - Thống kê nạp thẻ'
  - content: '&fPoints của bạn: &b&l%playerpoints_points%'
  - content: '&8&m---------------------'
  - content: '&fTổng số tiền bạn đã nạp'
  - content: '&e- Toàn thời gian: &a&l%dotman_data_donate_total%'
  - content: '&e- Hôm nay: &a&l%dotman_dataday_donate_total%'
  - content: '&e- Tuần này: &a&l%dotman_dataweek_donate_total%'
  - content: '&e- Tháng này: &a&l%dotman_datamonth_donate_total%'
  - content: '&8&m---------------------'
  - content: '&fTop nạp #1'
  - content: '&e- Toàn thời gian: &b%dotman_top_donate_total_1_player% &7- &a&l%dotman_top_donate_total_1_value%'
  - content: '&e- Hôm nay: &b%dotman_topday_donate_total_1_player% &7- &a&l%dotman_topday_donate_total_1_value%'
  - content: '&e- Tuần này: &b%dotman_topweek_donate_total_1_player% &7- &a&l%dotman_topweek_donate_total_1_value%'
  - content: '&e- Tháng này: &b%dotman_topmonth_donate_total_1_player% &7- &a&l%dotman_topmonth_donate_total_1_value%'
  - content: '&8&m---------------------'
  - content: '&fTổng nạp toàn server: &a&l%dotman_masterdata_donate_total%'
  - content: '&8&m---------------------'
  - content: '&fSự kiện Giáng sinh 2026'
  - content: '&e- Bạn đã nạp: &a&l%dotman_dataframe_giang-sinh-2026_donate_total%'
  - content: '&e- Top 1: &b%dotman_topframe_giang-sinh-2026_donate_total_1_player% &7- &a&l%dotman_topframe_giang-sinh-2026_donate_total_1_value%'
```
