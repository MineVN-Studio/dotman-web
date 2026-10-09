---
title: Thông báo khuyến mãi
description: Tự động thông báo trên chat và bossbar khi khuyến mãi bắt đầu, đang diễn ra và kết thúc.
---

# Thông báo khuyến mãi

DotMan tự thông báo cho toàn server về khuyến mãi đang áp dụng, qua chat và bossbar. Cấu hình trong mục `thong-bao` của `khuyenmai.yml`.

Khuyến mãi được thông báo là khuyến mãi đang thực sự áp dụng, theo [thứ tự ưu tiên](/docs/khuyen-mai/lich-khuyen-mai#thu-tu-uu-tien):

- Khuyến mãi có tỉ lệ cao nhất đang diễn ra trong `khuyenmai.yml`.
- Nếu không có, dùng [khuyến mãi nhanh trong config.yml](/docs/khuyen-mai/lich-khuyen-mai#khuyen-mai-nhanh-trong-config-yml) khi còn hạn.
- Không có khuyến mãi nào thì không gửi gì.

Xem trước khuyến mãi nào được áp dụng vào lúc nào bằng công cụ [Kiểm tra lịch khuyến mãi](/docs/cong-cu/lich-khuyen-mai#kiem-tra-lich-khuyen-mai).

## Thông báo trên chat

```yaml [khuyenmai.yml]
thong-bao:
  chat:
    enabled: true
    interval: 300
    message:
      active:
        - '&e&l✦ KHUYẾN MÃI NẠP THẺ &e&l✦'
        - '%NAME%'
        - '&7Nạp thẻ nhận thêm &b&l+%RATE%% &7giá trị'
        - '&7Còn lại: &e%REMAINING%'
      ended:
        - '&7&l✦ %NAME% &7đã kết thúc &7&l✦'
```

| Tùy chọn | Mô tả |
|----------|-------|
| `enabled` | Bật/tắt thông báo trên chat |
| `interval` | Số giây giữa các lần lặp lại `message.active`.<br />Đặt `0` để chỉ gửi 1 lần lúc bắt đầu. |
| `message.active` | Gửi ngay khi khuyến mãi bắt đầu, sau đó lặp lại mỗi `interval` giây.<br />Đặt `active: []` để tắt. |
| `message.ended` | Gửi 1 lần khi khuyến mãi kết thúc.<br />Đặt `ended: []` để tắt. |

- Khuyến mãi chỉ bị khuyến mãi khác có tỉ lệ cao hơn ghi đè thì không tính là kết thúc.
- Thông báo được gửi tới từng người chơi đang online, không hiện trong console.

## Bossbar

```yaml [khuyenmai.yml]
thong-bao:
  bossbar:
    enabled: false
    style: SOLID
    rotate: 5
    titles:
      - '&e&l✦ %NAME% &e&l✦'
      - '&fNạp thẻ nhận thêm &b&l+%RATE%% &fgiá trị'
      - '&fCòn lại: &e%REMAINING% &7- gõ &a/napthe &7hoặc &a/bank &7để nạp'
```

| Tùy chọn | Mô tả |
|----------|-------|
| `enabled` | Bật/tắt bossbar |
| `style` | Kiểu thanh: `SOLID`, `SEGMENTED_6`, `SEGMENTED_10`, `SEGMENTED_12`, `SEGMENTED_20` |
| `rotate` | Số giây giữa 2 lần đổi tiêu đề |
| `titles` | Các tiêu đề hiện luân phiên |

- Bossbar hiện trong suốt thời gian khuyến mãi, ẩn ngay khi kết thúc.
- Thanh tiến độ thể hiện thời gian còn lại, màu tự đổi xanh → vàng → đỏ.
  - Khuyến mãi không có mốc bắt đầu hoặc kết thúc thì thanh luôn đầy.

::: warning Không hiện bossbar?
Nếu không hiện bossbar, kiểm tra lại cấu hình và phiên bản server. Server 1.8 không hỗ trợ bossbar và sẽ không hiển thị.
:::

## Placeholder

Dùng được trong `message.active`, `message.ended` và `titles`:

| Placeholder | Mô tả |
|-------------|-------|
| `%NAME%` | Tên khuyến mãi |
| `%RATE%` | Tỉ lệ khuyến mãi theo phần trăm, ví dụ `50` |
| `%FROM%` | Thời điểm bắt đầu |
| `%TO%` | Thời điểm kết thúc |
| `%REMAINING%` | Thời gian còn lại, ví dụ `1 ngày, 5 giờ` |
| `%PREFIX%` | Tiền tố trong `config.yml` |

Cách hiển thị thời gian còn lại chỉnh trong các mục `duration-*` của [messages.yml](/docs/config-mau/messages-yml).

::: info Nâng cấp từ bản cũ
File `khuyenmai.yml` cũ chưa có mục `thong-bao` sẽ dùng cấu hình mặc định: **bật thông báo chat**, tắt bossbar.
Muốn tắt, thêm vào `khuyenmai.yml`:

```yaml
thong-bao:
  chat:
    enabled: false
```
:::
